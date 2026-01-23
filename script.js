console.log("Script loaded");

// ===================
// SUPABASE CONFIG
// ===================
const SUPABASE_URL = "https://iistugxdqonjsrxuvpgs.supabase.co";
const SUPABASE_KEY =
  "sb_publishable_w33IEM4ohCVNL__Z14grpg_DwJR6DJ4";

const supabase = supabaseJs.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ===================
// MAP INIT
// ===================
const map = L.map("map").setView(
  [15.75915, 78.03752],
  18
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

console.log("Map initialized");

// ===================
// GLOBALS
// ===================
let userLatLng = null;
let userMarker = null;
let routingControl = null;

// ===================
// LIVE LOCATION
// ===================
document.getElementById("liveBtn").onclick = () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    userLatLng = [pos.coords.latitude, pos.coords.longitude];

    if (!userMarker) {
      userMarker = L.marker(userLatLng).addTo(map);
    } else {
      userMarker.setLatLng(userLatLng);
    }

    map.setView(userLatLng, 18);
  });
};

// ===================
// CANCEL ROUTE
// ===================
document.getElementById("clearRouteBtn").onclick = () => {
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
  }
};

// ===================
// FOOD COURT POLYGON
// ===================
const foodCourt = [
  [15.759034, 78.037565],
  [15.759212, 78.037613],
  [15.759261, 78.037474],
  [15.759137, 78.037434],
];

L.polygon(foodCourt, {
  color: "red",
  fillOpacity: 0.6,
}).addTo(map).bindPopup("Food Court");

// ===================
// LOAD SUPABASE LOCATIONS
// ===================
async function loadLocations() {
  const { data, error } = await supabase.from("Location").select("*");
  if (error) {
    console.error(error);
    return;
  }

  data.forEach((loc) => {
    L.marker([loc.Lat, loc.Lng])
      .addTo(map)
      .bindPopup(`<b>${loc.Name}</b><br>${loc.Description || ""}`);
  });
}

loadLocations();
