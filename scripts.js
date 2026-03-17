document.addEventListener("DOMContentLoaded", async () => {

  /* ================= SERVICE WORKER / PWA ================= */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }

  /* ================= LANDING PAGE ================= */
  const landingPage = document.getElementById("landing-page");
  const getStartedBtn = document.getElementById("getStartedBtn");

  if (getStartedBtn && landingPage) {
    getStartedBtn.addEventListener("click", () => {
      landingPage.classList.add("hidden");
      // Remove from DOM to ensure map is interactive after transition
      setTimeout(() => {
        landingPage.style.display = "none";
        map.invalidateSize();
      }, 800);
    });
  }

  /* ================= THEME TOGGLE ================= */
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const mapContainer = document.getElementById("map");
      mapContainer.classList.toggle("dark-map");

      if (mapContainer.classList.contains("dark-map")) {
        themeToggleBtn.textContent = "☀️ Light Mode";
      } else {
        themeToggleBtn.textContent = "🌙 Dark Mode";
      }
    });
  }

  /* ================= SUPABASE ================= */
  const supabase = window.supabase.createClient(
    "https://iistugxdqonjsrxuvpgs.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpc3R1Z3hkcW9uanNyeHV2cGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODE5MzAsImV4cCI6MjA4Mjg1NzkzMH0.QFZKAZnFc-6jrCaOUs0ghAW227OXN1Y2XevOC3BUVX4"
  );

  /* ================= MAP ================= */
  const map = L.map("map", {
    center: [15.759267, 78.037734],
    zoom: 17,
    minZoom: 15,
    maxZoom: 19
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  /* ================= GLOBALS ================= */
  let locations = [];
  let markers = [];
  let watchId = null;
  let userMarker = null;
  let accuracyCircle = null;
  let routingControl = null;
  let destination = null;
  let destPulseMarker = null;

  /* ================= LOAD LOCATIONS ================= */
  const { data, error } = await supabase.from("Location").select("*");

  if (error) {
    console.error("Supabase error:", error);
    alert("Error loading locations: " + error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.warn("No locations found in database");
    alert("No locations found in the database");
    return;
  }

  console.log("Loaded locations:", data);
  locations = data;

  locations.forEach(loc => {
    const marker = L.circleMarker([loc.Lat, loc.Lng], {
      radius: 8,
      color: "#dc2626",
      fillColor: "#ef4444",
      fillOpacity: 1
    }).addTo(map);

    marker.bindPopup(`
      <div class="popup-title">${loc.Name}</div>
      <div class="popup-category">${loc.Category || ""}</div>
      <div class="popup-desc">${loc.Description || ""}</div>
      <button onclick="navigateTo(${loc.Lat}, ${loc.Lng})" class="primary-btn popup-btn">
        🧭 Show Route
      </button>
    `);

    markers.push({ location: loc, marker: marker });
  });

  console.log("Markers created:", markers.length);

  /* ================= SEARCH ================= */
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    searchResults.innerHTML = "";

    if (!q) return;

    locations
      .filter(l =>
        l.Name.toLowerCase().includes(q) ||
        (l.Category || "").toLowerCase().includes(q) ||
        (l.Description || "").toLowerCase().includes(q)
      )
      .forEach(l => {
        const div = document.createElement("div");
        div.className = "result-item";
        div.textContent = l.Name;
        div.onclick = () => {
          map.flyTo([l.Lat, l.Lng], 18);
          const markerObj = markers.find(m => m.location === l);
          if (markerObj) {
            markerObj.marker.openPopup();
          }
        };
        searchResults.appendChild(div);
      });
  });

  /* ================= LIVE LOCATION ================= */
  document.getElementById("liveBtn").onclick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    watchId = navigator.geolocation.watchPosition(
      pos => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];

        if (!userMarker) {
          userMarker = L.circleMarker(latlng, {
            radius: 8,
            color: "#991b1b",
            fillColor: "#fecaca",
            fillOpacity: 1
          }).addTo(map);

          accuracyCircle = L.circle(latlng, {
            radius: pos.coords.accuracy,
            color: "#fecaca",
            fillOpacity: 0.2
          }).addTo(map);

          console.log("User location:", latlng);
        } else {
          userMarker.setLatLng(latlng);
          accuracyCircle.setLatLng(latlng);
          accuracyCircle.setRadius(pos.coords.accuracy);
        }

        if (destination) updateRoute(latlng, destination);
      },
      error => {
        console.error("Geolocation error:", error);
        alert("Error getting location: " + error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );
  };

  document.getElementById("stopLiveBtn").onclick = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    watchId = null;

    if (userMarker) map.removeLayer(userMarker);
    if (accuracyCircle) map.removeLayer(accuracyCircle);

    userMarker = null;
    accuracyCircle = null;
  };

  /* ================= ROUTING ================= */
  window.navigateTo = (lat, lng) => {
    destination = [lat, lng];
    if (!userMarker) return;
    updateRoute(userMarker.getLatLng(), destination);
  };

  function updateRoute(start, end) {
    if (routingControl) map.removeControl(routingControl);
    if (destPulseMarker) map.removeLayer(destPulseMarker);

    // Add pulsing marker to destination
    const pulseIcon = L.divIcon({
      className: 'destination-pulse',
      html: '<div class="destination-pulse-inner"></div>',
      iconSize: [20, 20]
    });

    destPulseMarker = L.marker(end, { icon: pulseIcon }).addTo(map);

    routingControl = L.Routing.control({
      waypoints: [start, end],
      lineOptions: {
        styles: [
          { color: "#dc2626", weight: 6, className: 'animated-route' }
        ]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false
    }).addTo(map);
  }

  document.getElementById("cancelRouteBtn").onclick = () => {
    if (routingControl) map.removeControl(routingControl);
    if (destPulseMarker) map.removeLayer(destPulseMarker);
    routingControl = null;
    destPulseMarker = null;
    destination = null;
  };

});