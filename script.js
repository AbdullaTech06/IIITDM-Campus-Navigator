/********************
 SUPABASE SETUP
********************/
const SUPABASE_URL = "https://iistugxdqonjsrxuvpgs.supabase.co";
const SUPABASE_ANON_KEY = "PASTE_YOUR_ANON_KEY_HERE";

const supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/********************
 MAP SETUP
********************/
const map = L.map("map").setView([15.8147, 78.0322], 17);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

/********************
 GLOBAL STATE
********************/
let liveWatchId = null;
let liveMarker = null;
let routeControl = null;
let destinationLatLng = null;

/********************
 LOAD MARKERS FROM SUPABASE
********************/
async function loadLocations() {
  const { data, error } = await supabase
    .from("Location")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(place => {
    const marker = L.marker([place.Lat, place.Lng]).addTo(map);

    marker.bindPopup(`
      <b>${place.Name}</b><br>
      ${place.Category}<br>
      ${place.Description}<br><br>
      <button onclick="startRoute(${place.Lat}, ${place.Lng})">
        Navigate
      </button>
    `);
  });
}

loadLocations();

/********************
 START LIVE LOCATION
********************/
document.getElementById("liveBtn").onclick = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  liveWatchId = navigator.geolocation.watchPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      if (!liveMarker) {
        liveMarker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [32, 32]
          })
        }).addTo(map);
      } else {
        liveMarker.setLatLng([lat, lng]);
      }

      map.setView([lat, lng], 18);

      // Update route dynamically
      if (destinationLatLng && routeControl) {
        routeControl.setWaypoints([
          L.latLng(lat, lng),
          destinationLatLng
        ]);
      }
    },
    err => alert("Location error"),
    {
      enableHighAccuracy: true,
      maximumAge: 0
    }
  );
};

/********************
 CANCEL LIVE LOCATION
********************/
document.getElementById("cancelLiveBtn").onclick = () => {
  if (liveWatchId) {
    navigator.geolocation.clearWatch(liveWatchId);
    liveWatchId = null;
  }

  if (liveMarker) {
    map.removeLayer(liveMarker);
    liveMarker = null;
  }
};

/********************
 START ROUTE
********************/
window.startRoute = function (lat, lng) {
  destinationLatLng = L.latLng(lat, lng);

  if (!liveMarker) {
    alert("Turn on Live Location first");
    return;
  }

  if (routeControl) {
    map.removeControl(routeControl);
  }

  routeControl = L.Routing.control({
    waypoints: [
      liveMarker.getLatLng(),
      destinationLatLng
    ],
    routeWhileDragging: false,
    show: false
  }).addTo(map);
};

/********************
 CANCEL ROUTE
********************/
document.getElementById("cancelRouteBtn").onclick = () => {
  if (routeControl) {
    map.removeControl(routeControl);
    routeControl = null;
    destinationLatLng = null;
  }
};
