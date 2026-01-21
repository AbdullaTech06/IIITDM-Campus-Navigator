// ================= SUPABASE =================
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://iistugxdqonjsrxuvpgs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_w33IEM4ohCVNL__Z14grpg_DwJR6DJ4";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================= MAP SETUP =================
const campusCenter = [15.758844, 78.037691];
const campusZoom = 18;

const map = L.map("map", {
    center: campusCenter,
    zoom: campusZoom,
    zoomControl: true,
    scrollWheelZoom: true
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
    minZoom: 10
}).addTo(map);

// ================= LOAD LOCATIONS =================
async function loadCampusLocations() {
    const { data, error } = await supabase
        .from("Location")   // EXACT table name
        .select("*");

    if (error) {
        console.error("Supabase error:", error.message);
        return;
    }

    data.forEach(loc => {
        if (!loc.Lat || !loc.Lng) return;

        const marker = L.marker([
            Number(loc.Lat),
            Number(loc.Lng)
        ]).addTo(map);

        marker.bindPopup(`
            <b>${loc.Name}</b><br/>
            <small>${loc.Category}</small><br/>
            ${loc.Description ?? ""}
        `);
    });
}

loadCampusLocations();

// ================= LIVE LOCATION =================
let locationMarker = null;
let locationCircle = null;
let watchId = null;
let isTracking = false;
let tooltipShown = false;

const LocateControl = L.Control.extend({
    options: { position: "topright" },
    onAdd: function () {
        const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
        const button = L.DomUtil.create("div", "leaflet-control-locate", container);
        button.innerHTML = "📍";
        button.title = "Show my location";

        L.DomEvent.on(button, "click", e => {
            L.DomEvent.stop(e);
            toggleLocationTracking(button);
        });

        return container;
    }
});

map.addControl(new LocateControl());

function toggleLocationTracking(button) {
    isTracking ? stopLocationTracking(button) : startLocationTracking(button);
}

function startLocationTracking(button) {
    hideError();

    if (!navigator.geolocation) {
        showError("Geolocation not supported");
        return;
    }

    if (!tooltipShown) {
        showTooltip();
        tooltipShown = true;
    }

    button.classList.add("active");
    isTracking = true;

    watchId = navigator.geolocation.watchPosition(
        onLocationSuccess,
        onLocationError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function stopLocationTracking(button) {
    if (watchId) navigator.geolocation.clearWatch(watchId);

    watchId = null;
    isTracking = false;
    button.classList.remove("active");

    if (locationMarker) map.removeLayer(locationMarker);
    if (locationCircle) map.removeLayer(locationCircle);

    locationMarker = null;
    locationCircle = null;
}

function onLocationSuccess(position) {
    const { latitude, longitude, accuracy } = position.coords;

    if (locationMarker) map.removeLayer(locationMarker);
    if (locationCircle) map.removeLayer(locationCircle);

    locationCircle = L.circle([latitude, longitude], {
        radius: accuracy,
        color: "#dc3545",
        fillOpacity: 0.1
    }).addTo(map);

    locationMarker = L.circleMarker([latitude, longitude], {
        radius: 8,
        fillColor: "#dc3545",
        color: "#fff",
        weight: 2,
        fillOpacity: 1
    }).addTo(map);

    locationMarker.bindPopup("You are here").openPopup();
    map.setView([latitude, longitude], map.getZoom());
}

function onLocationError() {
    showError("Unable to access location");
}

function showError(msg) {
    const el = document.getElementById("error-message");
    el.textContent = msg;
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 5000);
}

function hideError() {
    document.getElementById("error-message").classList.add("hidden");
}

function showTooltip() {
    const el = document.getElementById("location-tooltip");
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 3000);
}
