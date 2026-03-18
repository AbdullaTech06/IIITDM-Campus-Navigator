document.addEventListener("DOMContentLoaded", async () => {

  /* ================= MINI STATUS TOAST (MOBILE DEBUG) ================= */
  const routeStatusEl = document.createElement("div");
  routeStatusEl.id = "routeStatus";
  routeStatusEl.style.cssText =
    "position:fixed;left:50%;top:14px;transform:translateX(-50%);" +
    "z-index:10000;max-width:92vw;padding:10px 12px;border-radius:12px;" +
    "background:rgba(15,23,42,.92);color:#f8fafc;font:600 14px system-ui;" +
    "box-shadow:0 10px 25px rgba(0,0,0,.35);display:none;text-align:center;";
  document.body.appendChild(routeStatusEl);

  const setRouteStatus = (msg, showMs = 2500) => {
    if (!msg) {
      routeStatusEl.style.display = "none";
      routeStatusEl.textContent = "";
      return;
    }
    routeStatusEl.textContent = msg;
    routeStatusEl.style.display = "block";
    if (showMs > 0) {
      window.clearTimeout(setRouteStatus._t);
      setRouteStatus._t = window.setTimeout(() => setRouteStatus(""), showMs);
    }
  };

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
      <button
        type="button"
        class="primary-btn popup-btn popup-route-btn"
        data-lat="${loc.Lat}"
        data-lng="${loc.Lng}"
      >
        🧭 Show Route
      </button>
    `);

    markers.push({ location: loc, marker: marker });
  });

  console.log("Markers created:", markers.length);

  // Mobile-safe handler for popup "Show Route" button.
  // Inline onclick is flaky on some mobile browsers inside Leaflet popups.
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target?.closest?.(".popup-route-btn");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const lat = Number(btn.getAttribute("data-lat"));
      const lng = Number(btn.getAttribute("data-lng"));
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        alert("Invalid destination coordinates.");
        return;
      }
      window.navigateTo(lat, lng);
    },
    true // capture to beat Leaflet's internal handlers
  );

  // Also support touchstart for mobile Safari/Chrome where click can be delayed/suppressed.
  document.addEventListener(
    "touchstart",
    (e) => {
      const btn = e.target?.closest?.(".popup-route-btn");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const lat = Number(btn.getAttribute("data-lat"));
      const lng = Number(btn.getAttribute("data-lng"));
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      window.navigateTo(lat, lng);
    },
    { capture: true, passive: false }
  );

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
          // Close the search results and hide keyboard
          searchResults.innerHTML = "";
          searchInput.value = l.Name;
          searchInput.blur();
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
    setRouteStatus("Routing…", 0);
    getStartLatLng((startLatLng) => {
      if (!startLatLng) {
        setRouteStatus("");
        alert("Could not determine a starting point. Please enable location or pan the map.");
        return;
      }
      updateRoute(startLatLng, destination);
    });
  };

  function getStartLatLng(callback) {
    // 1) If user is live-tracking, use that position
    if (userMarker) {
      callback(userMarker.getLatLng());
      return;
    }

    // 2) Try a one-time high-accuracy geolocation fix
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          callback([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn("getCurrentPosition error:", err);
          // 3) Fallback to map center (works even if GPS is blocked)
          try {
            const center = map.getCenter();
            callback([center.lat, center.lng]);
          } catch {
            callback(null);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 10000
        }
      );
      return;
    }

    // 4) Final fallback: map center if available
    try {
      const center = map.getCenter();
      callback([center.lat, center.lng]);
    } catch {
      callback(null);
    }
  }

  function updateRoute(start, end) {
    if (routingControl) map.removeControl(routingControl);
    if (destPulseMarker) map.removeLayer(destPulseMarker);

    const startLL = L.latLng(start);
    const endLL = L.latLng(end);

    // Add pulsing marker to destination
    const pulseIcon = L.divIcon({
      className: 'destination-pulse',
      html: '<div class="destination-pulse-inner"></div>',
      iconSize: [20, 20]
    });

    destPulseMarker = L.marker(endLL, { icon: pulseIcon }).addTo(map);

    routingControl = L.Routing.control({
      waypoints: [startLL, endLL],
      // Explicit HTTPS routing backend (avoids mixed-content blocks on phones)
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'foot'
      }),
      lineOptions: {
        styles: [
          { color: "#dc2626", weight: 6, className: 'animated-route' }
        ]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false
    })
      .on('routesfound', () => {
        setRouteStatus("");
      })
      .on('routingerror', (e) => {
        console.error('Routing error:', e);
        setRouteStatus("");
        alert("Route failed to load. This is usually due to network restrictions or blocked routing service. Please try again on a different network.");
      })
      .addTo(map);
  }

  document.getElementById("cancelRouteBtn").onclick = () => {
    if (routingControl) map.removeControl(routingControl);
    if (destPulseMarker) map.removeLayer(destPulseMarker);
    routingControl = null;
    destPulseMarker = null;
    destination = null;
  };

});