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

  /* ================= SERVICE WORKER / PWA (KILL SWITCH) ================= */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
        console.log('Service Worker unregistered.');
      }
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
  let routingAttempt = 0;
  const ROUTING_BACKENDS = [
    // Default public OSRM (sometimes blocked by certain mobile networks)
    "https://router.project-osrm.org/route/v1",
    // Alternative OSRM instance (often works when the default is blocked)
    "https://routing.openstreetmap.de/routed-foot/route/v1"
  ];

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

  const buildingDetails = {
    "Administrative Building": "<b>Ground Floor:</b> SIC Lab<br><b>1st Floor:</b> All Associate Deans (LG-07, LG-04), Dining Room (LG-05), Chairman (LG-06)<br><b>2nd Floor:</b> Purchase Section (G04), Accounts Section (G05), Administration Section (G06), Academics Section (G07)<br><b>3rd Floor:</b> Store Room (105), Communications",
    "Administrative Block": "<b>Ground Floor:</b> SIC Lab<br><b>1st Floor:</b> All Associate Deans (LG-07, LG-04), Dining Room (LG-05), Chairman (LG-06)<br><b>2nd Floor:</b> Purchase Section (G04), Accounts Section (G05), Administration Section (G06), Academics Section (G07)<br><b>3rd Floor:</b> Store Room (105), Communications",
    "Department of CSE": "<b>Ground Floor:</b> Project Room<br><b>1st Floor:</b> Computing Lab<br><b>2nd Floor:</b> Software Design and Product Level<br><b>3rd Floor:</b> Analog Circuits Lab",
    "CSE Block": "<b>Ground Floor:</b> Project Room<br><b>1st Floor:</b> Computing Lab<br><b>2nd Floor:</b> Software Design and Product Level<br><b>3rd Floor:</b> Analog Circuits Lab",
    "Kalam Hostel": "<b>Ground Floor:</b> Barber",
    "KALAM boys Hostel": "<b>Ground Floor:</b> Barber",
    "Seminar Hall Complex": "<b>Ground Floor:</b> Cafe<br><b>1st Floor:</b> Hundri Seminar Hall, Krishna Seminar Hall<br><b>2nd Floor:</b> Tungabhadra Seminar Hall<br><b>3rd Floor:</b> Seminar Hall Complex",
    "Seminar Hall Block": "<b>Ground Floor:</b> Cafe<br><b>1st Floor:</b> Hundri Seminar Hall, Krishna Seminar Hall<br><b>2nd Floor:</b> Tungabhadra Seminar Hall<br><b>3rd Floor:</b> Seminar Hall Complex",
    "Department of Mechanical": "<b>Ground Floor:</b> Thermal and Fluids Lab, Material Processing and Tech Lab, Design and Dynamics Lab<br><b>1st Floor:</b> HOD Cabin, Department Office, Faculty Cabin of Mechanical, Robotics Lab, DREAAMS Lab",
    "Mechanical Engineering block": "<b>Ground Floor:</b> Thermal and Fluids Lab, Material Processing and Tech Lab, Design and Dynamics Lab<br><b>1st Floor:</b> HOD Cabin, Department Office, Faculty Cabin of Mechanical, Robotics Lab, DREAAMS Lab",
    "Department of ECE": "<b>Ground Floor:</b> ECE Faculty Cabin, DSP Lab, Electrical Drives and instrumentation Lab, Drones Lab, Embedded Systems and IOT Lab, Microprocessor and Microcontroller Lab, VLSI and DSP Lab<br><b>1st Floor:</b> EC101, ME101, Computational Lab, High Performance Computing and Research<br><b>2nd Floor:</b> EC201, ME201, Artificial Intelligence and Data Science Lab, Cyber Physical System Lab<br><b>3rd Floor:</b> ...",
    "ECE Department": "<b>Ground Floor:</b> ECE Faculty Cabin, DSP Lab, Electrical Drives and instrumentation Lab, Drones Lab, Embedded Systems and IOT Lab, Microprocessor and Microcontroller Lab, VLSI and DSP Lab<br><b>1st Floor:</b> EC101, ME101, Computational Lab, High Performance Computing and Research<br><b>2nd Floor:</b> EC201, ME201, Artificial Intelligence and Data Science Lab, Cyber Physical System Lab<br><b>3rd Floor:</b> ...",
    "ECE Block": "<b>Ground Floor:</b> ECE Faculty Cabin, DSP Lab, Electrical Drives and instrumentation Lab, Drones Lab, Embedded Systems and IOT Lab, Microprocessor and Microcontroller Lab, VLSI and DSP Lab<br><b>1st Floor:</b> EC101, ME101, Computational Lab, High Performance Computing and Research<br><b>2nd Floor:</b> EC201, ME201, Artificial Intelligence and Data Science Lab, Cyber Physical System Lab<br><b>3rd Floor:</b> ...",
    "Dining Hall": "<b>Ground Floor:</b> Veg Section, Girls Section<br><b>1st Floor:</b> 1st Year, Non-Veg Section",
    "Hill top dining hall (mess)": "<b>Ground Floor:</b> Veg Section, Girls Section<br><b>1st Floor:</b> 1st Year, Non-Veg Section",
    "DOS Faculty Cabins": "<b>All Floors:</b> Info coming soon",
    "Staff Quarters": "<b>All Floors:</b> Info coming soon"
  };

  locations.forEach(loc => {
    const marker = L.circleMarker([loc.Lat, loc.Lng], {
      radius: 8,
      color: "#dc2626",
      fillColor: "#ef4444",
      fillOpacity: 1
    }).addTo(map);

    let extraDetails = "";
    const locName = loc.Name ? loc.Name.trim() : "";
    if (buildingDetails[locName]) {
      extraDetails = `<div class="popup-floor-info" style="margin-top:8px; margin-bottom:12px; font-size:0.9em; line-height:1.4; color:#cbd5e1; background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.1); text-align: left;">${buildingDetails[locName]}</div>`;
    }

    marker.bindPopup(`
      <div class="popup-title">${loc.Name}</div>
      <div class="popup-category">${loc.Category || ""}</div>
      <div class="popup-desc">${loc.Description || ""}</div>
      ${extraDetails}
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
    routingAttempt = 0;
    setRouteStatus("Routing…", 0);
    if (!userMarker) {
      setRouteStatus("");
      alert("Please tap “📍 Show Live” first so routing can start from your current location.");
      return;
    }
    updateRoute(userMarker.getLatLng(), destination);
  };
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
        serviceUrl: ROUTING_BACKENDS[Math.min(routingAttempt, ROUTING_BACKENDS.length - 1)],
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
        // Retry once with an alternative backend if available
        if (routingAttempt < ROUTING_BACKENDS.length - 1) {
          routingAttempt += 1;
          setRouteStatus("Routing… (retrying)", 0);
          try {
            map.removeControl(routingControl);
          } catch {}
          routingControl = null;
          updateRoute(startLL, endLL);
          return;
        }

        setRouteStatus("");
        alert("Route failed to load on your network. Try switching between mobile data and Wi‑Fi, or use a VPN.");
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