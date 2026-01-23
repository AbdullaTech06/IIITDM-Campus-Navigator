// ===================
// SUPABASE CONFIG
// ===================
const SUPABASE_URL = "https://iistugxdqonjsrxuvpgs.supabase.co";
const SUPABASE_KEY =
  "sb_publishable_w33IEM4ohCVNL__Z14grpg_DwJR6DJ4";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ===================
// MAP INIT
// ===================
const map = L.map("map").setView(
  [15.75915, 78.03752], // Food Court area
  18
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// ===================
// GLOBAL VARIABLES
// ===================
let userMarker = null;
let routingControl = null;
let userLatLng = null;

// ===================
// LIVE LOCATION
// ===================
document.getElementById("liveBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLatLng = [pos.coords.latitude, pos.coords.longitude];

      if (userMarker) {
        userMarker.setLatLng(userLatLng);
      } else {
        userMarker = L.marker(userLatLng, {
          icon: L.icon({
            iconUrl:
              "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [35, 35],
          }),
        })
          .addTo(map)
          .bindPopup("You are here");
      }

      map.setView(userLatLng, 18);
    },
    () => alert("Location permission denied")
  );
});

// ===================
// CLEAR ROUTE (FIXED)
// ===================
document.getElementById("clearRouteBtn").addEventListener("click", () => {
  if (routingControl) {
    routingControl.getPlan().setWaypoints([]);
    map.removeControl(routingControl);
    routingControl = null;
  }
});

// ===================
// FOOD COURT BUILDING
// ===================
const foodCourtCoords = [
  [15.759034, 78.037565],
  [15.759212, 78.037613],
  [15.759261, 78.037474],
  [15.759137, 78.037434],
];

const foodCourtPolygon = L.polygon(foodCourtCoords, {
  color: "#dc2626",
  fillColor: "#fca5a5",
  fillOpacity: 0.6,
}).addTo(map);

foodCourtPolygon.bindPopup(`
  <b>Food Court</b><br/>
  Campus Dining Area<br/><br/>
  <button onclick="navigateTo(15.75916, 78.03752)">
    Navigate
  </button>
`);

// Label on building
L.marker([15.75916, 78.03752], {
  icon: L.divIcon({
    className: "building-label",
    html: "Food Court",
    iconSize: [120, 20],
    iconAnchor: [60, -10],
  }),
}).addTo(map);

// ===================
// LOAD LOCATIONS FROM SUPABASE
// ===================
async function loadLocations() {
  const { data, error } = await supabase
    .from("Location")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  data.forEach((loc) => {
    const latLng = [loc.Lat, loc.Lng];

    const marker = L.marker(latLng).addTo(map);

    marker.bindPopup(`
      <b>${loc.Name}</b><br/>
      ${loc.Description || ""}<br/><br/>
      <button onclick="navigateTo(${loc.Lat}, ${loc.Lng})">
        Navigate
      </button>
    `);

    L.marker(latLng, {
      icon: L.divIcon({
        className: "building-label",
        html: loc.Name,
        iconSize: [160, 20],
        iconAnchor: [80, -10],
      }),
    }).addTo(map);
  });
}

loadLocations();

// ===================
// ROUTING FUNCTION
// ===================
window.navigateTo = function (lat, lng) {
  if (!userLatLng) {
    alert("Enable live location first");
    return;
  }

  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(userLatLng[0], userLatLng[1]),
      L.latLng(lat, lng),
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    show: false,
    lineOptions: {
      styles: [{ weight: 6 }],
    },
  }).addTo(map);
};
