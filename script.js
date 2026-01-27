document.addEventListener("DOMContentLoaded", () => {

  /* ================= SUPABASE ================= */
  const supabase = window.supabase.createClient(
    "https://iistugxdqonjsrxuvpgs.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImV4cCI6MjA4Mjg1NzkzMH0.QFZKAZnFc-6jrCaOUs0ghAW227OXN1Y2XevOC3BUVX4"
  );

  /* ================= MAP ================= */
  const map = L.map("map", {
    center: [15.759267, 78.037734],
    zoom: 17,
    minZoom: 15,
    maxZoom: 19
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  setTimeout(() => map.invalidateSize(), 300);

  let locations = [];
  let routingControl = null;

  /* ================= LOAD LOCATIONS ================= */
  async function loadLocations() {
    const { data, error } = await supabase.from("Location").select("*");
    if (error) return;

    locations = data;

    data.forEach(loc => {
      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: 7,
        color: "#dc2626",
        fillColor: "#ef4444",
        fillOpacity: 1
      }).addTo(map);

      marker.bindPopup(`
        <b>${loc.name}</b><br>
        <small>${loc.category || ""}</small><br><br>
        <button onclick="navigateTo(${loc.lat}, ${loc.lng}, '${loc.name}')"
        style="padding:8px 12px;background:#dc2626;color:white;border:none;border-radius:6px">
          🧭 Navigate Here
        </button>
      `);
    });

    document.getElementById("infoPanel").innerHTML =
      `<h3>🏛️ IIITDM Navigator</h3><p>${data.length} locations loaded</p>`;
  }

  loadLocations();

  /* ================= SEARCH ================= */
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    if (q.length < 2) {
      searchResults.style.display = "none";
      return;
    }

    searchResults.innerHTML = locations.filter(l =>
      l.name.toLowerCase().includes(q) ||
      (l.category || "").toLowerCase().includes(q)
    ).map(l => `
      <div class="search-item"
        onclick="selectLocation(${l.lat}, ${l.lng}, '${l.name}')">
        <b>${l.name}</b><br>
        <small>${l.category || ""}</small>
      </div>
    `).join("");

    searchResults.style.display = "block";
  });

  window.selectLocation = (lat, lng, name) => {
    map.setView([lat, lng], 18);
    searchResults.style.display = "none";
    document.getElementById("infoPanel").innerHTML =
      `<h3>📍 ${name}</h3><p>Tap Navigate Here</p>`;
  };

  /* ================= LIVE LOCATION ================= */
  let watchId = null;
  let userMarker = null;
  let userLatLng = null;

  document.getElementById("liveBtn").onclick = () => {
    if (watchId) return;

    watchId = navigator.geolocation.watchPosition(
      pos => {
        userLatLng = [pos.coords.latitude, pos.coords.longitude];

        if (!userMarker) {
          userMarker = L.marker(userLatLng).addTo(map);
        } else {
          userMarker.setLatLng(userLatLng);
        }

        map.setView(userLatLng, 18);
      },
      err => alert(err.message),
      { enableHighAccuracy: true }
    );
  };

  document.getElementById("stopLiveBtn").onclick = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  };

  /* ================= ROUTING ================= */
  window.navigateTo = (lat, lng, name) => {
    if (!userLatLng) {
      alert("Enable live location first");
      return;
    }

    if (routingControl) map.removeControl(routingControl);

    routingControl = L.Routing.control({
      waypoints: [L.latLng(userLatLng), L.latLng(lat, lng)],
      lineOptions: {
        styles: [{ color: "#dc2626", weight: 6 }]
      },
      createMarker: () => null
    }).addTo(map);

    document.getElementById("infoPanel").innerHTML =
      `<h3>🧭 Navigating</h3><p>${name}</p>`;
  };

  document.getElementById("clearRouteBtn").onclick = () => {
    if (routingControl) map.removeControl(routingControl);
  };

});
