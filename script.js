// ===== CAMPUS COORDINATES =====
// Your college location in Andhra Pradesh, India
const campusCenter = [15.758844, 78.037691];
const campusZoom = 18; // Increased zoom for closer view of buildings

// Initialize the map
const map = L.map('map', {
    center: campusCenter,
    zoom: campusZoom,
    zoomControl: true, // Keep zoom controls enabled
    scrollWheelZoom: true
});

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    minZoom: 10
}).addTo(map);

// Optional: Add a marker at campus center (RED THEME)
const campusMarker = L.marker(campusCenter, {
    icon: L.divIcon({
        className: 'campus-marker',
        html: '<div style="background-color: #dc3545; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    })
}).addTo(map);
campusMarker.bindPopup('<b>Campus Center</b>').openPopup();

// ===== LIVE LOCATION TRACKING =====
let locationMarker = null;
let locationCircle = null;
let watchId = null;
let isTracking = false;
let tooltipShown = false;

// Create custom location control button
const LocateControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    
    onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('div', 'leaflet-control-locate', container);
        button.innerHTML = '📍';
        button.title = 'Show my location';
        
        L.DomEvent.on(button, 'click', function(e) {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            toggleLocationTracking(button);
        });
        
        return container;
    }
});

map.addControl(new LocateControl());

// Toggle location tracking
function toggleLocationTracking(button) {
    if (isTracking) {
        stopLocationTracking(button);
    } else {
        startLocationTracking(button);
    }
}

// Start live location tracking
function startLocationTracking(button) {
    hideError();
    
    // Show tooltip on first use
    if (!tooltipShown) {
        showTooltip();
        tooltipShown = true;
    }
    
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    button.classList.add('active');
    isTracking = true;
    
    // Watch position for live tracking
    watchId = navigator.geolocation.watchPosition(
        onLocationSuccess,
        onLocationError,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Stop location tracking
function stopLocationTracking(button) {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    
    button.classList.remove('active');
    isTracking = false;
    
    // Remove location markers
    if (locationMarker) {
        map.removeLayer(locationMarker);
        locationMarker = null;
    }
    if (locationCircle) {
        map.removeLayer(locationCircle);
        locationCircle = null;
    }
}

// Handle successful location
function onLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    
    // Remove old markers
    if (locationMarker) {
        map.removeLayer(locationMarker);
    }
    if (locationCircle) {
        map.removeLayer(locationCircle);
    }
    
    // Add accuracy circle (RED THEME)
    locationCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: '#dc3545',
        fillColor: '#dc3545',
        fillOpacity: 0.1,
        weight: 1
    }).addTo(map);
    
    // Add location marker (RED dot)
    locationMarker = L.circleMarker([lat, lng], {
        radius: 8,
        color: '#fff',
        fillColor: '#dc3545',
        fillOpacity: 1,
        weight: 2
    }).addTo(map);
    
    locationMarker.bindPopup('You are here').openPopup();
    
    // Center map on user location
    map.setView([lat, lng], map.getZoom());
}

// Handle location errors
function onLocationError(error) {
    let message = '';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = 'Location access denied. Please enable location permissions.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable. Please try again.';
            break;
        case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
        default:
            message = 'An error occurred while getting your location.';
    }
    
    showError(message);
    
    // Stop tracking on error
    const button = document.querySelector('.leaflet-control-locate');
    if (button) {
        stopLocationTracking(button);
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(hideError, 5000);
}

// Hide error message
function hideError() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.classList.add('hidden');
}

// Show location tooltip
function showTooltip() {
    const tooltip = document.getElementById('location-tooltip');
    tooltip.classList.remove('hidden');
    
    // Auto-hide after 3 seconds
    setTimeout(hideTooltip, 3000);
}

// Hide location tooltip
function hideTooltip() {
    const tooltip = document.getElementById('location-tooltip');
    tooltip.classList.add('hidden');
}
