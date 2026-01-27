document.addEventListener("DOMContentLoaded", () => {
  // ===================
  // SUPABASE CONFIG
  // ===================
  const SUPABASE_URL = "https://iistugxdqonjsrxuvpgs.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpc3R1Z3hkcW9uanNyeHV2cGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5NzI2ODMsImV4cCI6MjA1MzU0ODY4M30.YOUR_KEY_HERE";
  
  let supabase = null;
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (error) {
    console.error("Supabase initialization error:", error);
  }

  // ===================
  // COMPREHENSIVE CAMPUS DATA
  // ===================
  const campusLocations = [
    // Academic Buildings
    { name: "Main Academic Block", lat: 15.7695, lng: 78.0664, description: "Central Academic Building", category: "academic" },
    { name: "Academic Block A", lat: 15.7692, lng: 78.0666, description: "Lecture Halls 1-10", category: "academic" },
    { name: "Academic Block B", lat: 15.7698, lng: 78.0662, description: "Lecture Halls 11-20", category: "academic" },
    { name: "Computer Science Department", lat: 15.7690, lng: 78.0668, description: "CS Labs & Faculty Offices", category: "department" },
    { name: "Electronics Department", lat: 15.7693, lng: 78.0670, description: "ECE Labs & Workshops", category: "department" },
    { name: "Mechanical Department", lat: 15.7688, lng: 78.0665, description: "ME Labs & Workshops", category: "department" },
    
    // Library & Study Areas
    { name: "Central Library", lat: 15.7700, lng: 78.0670, description: "Main Library - 24x7 Reading Hall", category: "library" },
    { name: "Digital Library", lat: 15.7701, lng: 78.0671, description: "E-Resources & Digital Collection", category: "library" },
    
    // Hostels
    { name: "Boys Hostel A", lat: 15.7690, lng: 78.0660, description: "UG Boys Hostel Block A", category: "hostel" },
    { name: "Boys Hostel B", lat: 15.7687, lng: 78.0658, description: "UG Boys Hostel Block B", category: "hostel" },
    { name: "Boys Hostel C", lat: 15.7684, lng: 78.0662, description: "PG Boys Hostel", category: "hostel" },
    { name: "Girls Hostel A", lat: 15.7703, lng: 78.0658, description: "UG Girls Hostel Block A", category: "hostel" },
    { name: "Girls Hostel B", lat: 15.7706, lng: 78.0660, description: "PG Girls Hostel", category: "hostel" },
    
    // Dining & Food
    { name: "Main Cafeteria", lat: 15.7698, lng: 78.0668, description: "Central Dining Hall", category: "dining" },
    { name: "Food Court", lat: 15.7696, lng: 78.0669, description: "Multiple Food Stalls", category: "dining" },
    { name: "Juice Center", lat: 15.7697, lng: 78.0667, description: "Fresh Juices & Snacks", category: "dining" },
    { name: "Boys Hostel Mess", lat: 15.7689, lng: 78.0659, description: "Hostel Dining", category: "dining" },
    { name: "Girls Hostel Mess", lat: 15.7704, lng: 78.0659, description: "Hostel Dining", category: "dining" },
    
    // Sports & Recreation
    { name: "Sports Complex", lat: 15.7680, lng: 78.0655, description: "Indoor Sports Facilities", category: "sports" },
    { name: "Cricket Ground", lat: 15.7675, lng: 78.0660, description: "Main Cricket Ground", category: "sports" },
    { name: "Football Ground", lat: 15.7677, lng: 78.0665, description: "Football Field", category: "sports" },
    { name: "Basketball Court", lat: 15.7682, lng: 78.0658, description: "Outdoor Basketball", category: "sports" },
    { name: "Volleyball Court", lat: 15.7683, lng: 78.0659, description: "Outdoor Volleyball", category: "sports" },
    { name: "Gymnasium", lat: 15.7681, lng: 78.0656, description: "Fitness Center", category: "sports" },
    
    // Administration
    { name: "Administrative Block", lat: 15.7702, lng: 78.0666, description: "Director's Office & Admin", category: "admin" },
    { name: "Accounts Office", lat: 15.7703, lng: 78.0667, description: "Fee Payment & Finance", category: "admin" },
    { name: "Academic Section", lat: 15.7701, lng: 78.0665, description: "Exam Cell & Records", category: "admin" },
    
    // Medical & Wellness
    { name: "Medical Center", lat: 15.7694, lng: 78.0672, description: "Campus Health Center", category: "medical" },
    { name: "Pharmacy", lat: 15.7695, lng: 78.0673, description: "Medical Store", category: "medical" },
    
    // Other Facilities
    { name: "Auditorium", lat: 15.7699, lng: 78.0664, description: "Main Auditorium - 500 Capacity", category: "facility" },
    { name: "Seminar Hall", lat: 15.7697, lng: 78.0663, description: "Seminar & Conference Hall", category: "facility" },
    { name: "Workshop", lat: 15.7686, lng: 78.0663, description: "Engineering Workshop", category: "facility" },
    { name: "Guest House", lat: 15.7708, lng: 78.0668, description: "Visitor Accommodation", category: "facility" },
    { name: "Gate 1 - Main Entrance", lat: 15.7710, lng: 78.0665, description: "Primary Campus Entrance", category: "entrance" },
    { name: "Gate 2 - Side Entrance", lat: 15.7672, lng: 78.0670, description: "Secondary Entrance", category: "entrance" },
    { name: "Parking Area", lat: 15.7705, lng: 78.0663, description: "Vehicle Parking", category: "facility" },
    { name: "ATM", lat: 15.7696, lng: 78.0665, description: "Bank ATM", category: "facility" },
    { name: "Stationery Shop", lat: 15.7697, lng: 78.0666, description: "Books & Stationery", category: "facility" },
  ];

  // ===================
  // MAP INIT
  // ===================
  const map = L.map("map").setView(
    [15.7695, 78.0664], // IIITDM Kurnool
    16
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  let userMarker = null;
  let routingControl = null;
  let userLatLng = null;
  let allMarkers = [];
  let allLocations = [];

  // Category colors
  const categoryColors = {
    academic: "#3b82f6",
    department: "#8b5cf6",
    library: "#10b981",
    hostel: "#f59e0b",
    dining: "#ef4444",
    sports: "#06b6d4",
    admin: "#6366f1",
    medical: "#ec4899",
    facility: "#84cc16",
    entrance: "#f97316"
  };

  // ===================
  // LIVE LOCATION
  // ===================
  document.getElementById("liveBtn").addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLatLng = [pos.coords.latitude, pos.coords.longitude];
        if (!userMarker) {
          userMarker = L.marker(userLatLng, {
            icon: L.divIcon({
              className: "user-location-marker",
              html: '<div class="pulse-marker">📍</div>',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            }),
          }).addTo(map);
        } else {
          userMarker.setLatLng(userLatLng);
        }
        map.setView(userLatLng, 17);
        
        // Update info panel
        document.getElementById("infoPanel").innerHTML = `
          <h3>✅ Location Enabled</h3>
          <p>You can now navigate to any location</p>
        `;
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Location permission denied or unavailable");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });

  // ===================
  // CLEAR ROUTE
  // ===================
  document.getElementById("clearRouteBtn").addEventListener("click", () => {
    if (routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
      document.getElementById("infoPanel").innerHTML = `
        <h3>🏛️ IIITDM Kurnool Navigator</h3>
        <p>Route cleared. Search or click markers to navigate.</p>
      `;
    }
  });

  // ===================
  // LOAD LOCATIONS
  // ===================
  async function loadLocations() {
    let locations = [];
    
    // Try to load from Supabase
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("location")
          .select("*");
        
        if (error) {
          console.log("Supabase error, using default data:", error.message);
          locations = campusLocations;
        } else if (data && data.length > 0) {
          locations = data;
          console.log("✅ Loaded", data.length, "locations from Supabase");
        } else {
          console.log("No Supabase data, using default locations");
          locations = campusLocations;
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
        locations = campusLocations;
      }
    } else {
      locations = campusLocations;
    }

    allLocations = locations;

    // Display locations on map
    locations.forEach((loc) => {
      const latLng = [loc.lat, loc.lng];
      const color = categoryColors[loc.category] || "#3b82f6";
      
      // Create custom icon
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          background: ${color};
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      
      // Create marker
      const marker = L.marker(latLng, {
        icon: customIcon,
      }).addTo(map);

      // Bind popup
      marker.bindPopup(`
        <div style="text-align: center; min-width: 200px;">
          <b style="font-size: 16px; color: ${color};">${loc.name}</b><br/>
          <span style="font-size: 12px; color: #666; text-transform: uppercase;">
            ${loc.category || 'Location'}
          </span><br/>
          <span style="font-size: 13px; color: #444;">${loc.description || ""}</span>
          <br/><br/>
          <button 
            onclick="navigateTo(${loc.lat}, ${loc.lng}, '${loc.name}')"
            style="
              padding: 10px 20px;
              background: ${color};
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              font-size: 14px;
            "
          >
            🧭 Navigate Here
          </button>
        </div>
      `);

      // Add label
      L.marker(latLng, {
        icon: L.divIcon({
          className: "building-label",
          html: `<span style="
            background: white;
            padding: 2px 8px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-size: 11px;
            font-weight: 700;
            color: #1e293b;
            border-left: 3px solid ${color};
          ">${loc.name}</span>`,
          iconSize: [200, 20],
          iconAnchor: [100, -8],
        }),
      }).addTo(map);

      allMarkers.push({ marker, location: loc });
    });

    console.log(`✅ Loaded ${locations.length} locations on map`);
    
    // Update info panel
    document.getElementById("infoPanel").innerHTML = `
      <h3>🏛️ IIITDM Kurnool Navigator</h3>
      <p>${locations.length} locations loaded. Use search or click markers!</p>
    `;
  }

  loadLocations();

  // ===================
  // SEARCH FUNCTIONALITY
  // ===================
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.innerHTML = "";
      searchResults.style.display = "none";
      return;
    }

    // Filter locations
    const filtered = allLocations.filter(loc => 
      loc.name.toLowerCase().includes(query) ||
      (loc.description && loc.description.toLowerCase().includes(query)) ||
      (loc.category && loc.category.toLowerCase().includes(query))
    );

    if (filtered.length === 0) {
      searchResults.innerHTML = `
        <div class="search-result-item" style="color: #999;">
          No results found for "${query}"
        </div>
      `;
      searchResults.style.display = "block";
      return;
    }

    // Display results
    searchResults.innerHTML = filtered.map(loc => {
      const color = categoryColors[loc.category] || "#3b82f6";
      return `
        <div class="search-result-item" onclick="selectLocation(${loc.lat}, ${loc.lng}, '${loc.name}')">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: ${color};
            "></div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 14px;">${loc.name}</div>
              <div style="font-size: 12px; color: #666;">${loc.description || loc.category}</div>
            </div>
          </div>
        </div>
      `;
    }).join("");
    
    searchResults.style.display = "block";
  });

  // Close search results when clicking outside
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.style.display = "none";
    }
  });

  // ===================
  // SELECT LOCATION FROM SEARCH
  // ===================
  window.selectLocation = function(lat, lng, name) {
    map.setView([lat, lng], 18);
    searchResults.style.display = "none";
    searchInput.value = "";
    
    // Find and open popup
    allMarkers.forEach(({ marker, location }) => {
      if (location.lat === lat && location.lng === lng) {
        marker.openPopup();
      }
    });

    // Update info panel
    document.getElementById("infoPanel").innerHTML = `
      <h3>📍 ${name}</h3>
      <p>Click "Navigate Here" in the popup to get directions</p>
    `;
  };

  // ===================
  // ROUTING
  // ===================
  window.navigateTo = function (lat, lng, name) {
    if (!userLatLng) {
      alert("Please enable live location first by clicking the 📍 button");
      return;
    }

    if (routingControl) {
      map.removeControl(routingControl);
    }

    try {
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
          styles: [{ color: "#2563eb", weight: 6, opacity: 0.8 }],
        },
        createMarker: function () {
          return null;
        },
      }).addTo(map);

      // Update info panel
      document.getElementById("infoPanel").innerHTML = `
        <h3>🧭 Navigating to ${name}</h3>
        <p>Follow the blue route on the map</p>
      `;

      // Fit map to route
      setTimeout(() => {
        if (routingControl && routingControl.getPlan()) {
          const waypoints = routingControl.getPlan().getWaypoints();
          const bounds = L.latLngBounds(
            waypoints.map((wp) => wp.latLng)
          );
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }, 500);
    } catch (error) {
      console.error("Routing error:", error);
      alert("Error creating route. Please try again.");
    }
  };
});
