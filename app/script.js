document.addEventListener("DOMContentLoaded", async () => {

  /* ================= COMPREHENSIVE ROOM DATA ================= */
  const roomData = {
    // --- PREVIOUS DATA RESTORED ---
    "Administrative Block": {
      "Ground Floor": ["SIC Lab"],
      "1st Floor": ["Associate Deans (LG-07, LG-04)", "Dining Room (LG-05)", "Chairman (LG-06)"],
      "2nd Floor": ["Purchase Section (G04)", "Accounts Section (G05)", "Administration Section (G06)", "Academics Section (G07)"],
      "3rd Floor": ["Store Room (105)", "Communications"]
    },
    "CSE Block": {
      "Ground Floor": ["Project Room"],
      "1st Floor": ["Computing Lab"],
      "2nd Floor": ["Software Design and Product Level"],
      "3rd Floor": ["Analog Circuits Lab"]
    },
    "ECE Block": {
      "Ground Floor": ["DSP Lab", "Electrical Drives & Instrumentation Lab", "Drones Lab", "Embedded Systems & IOT Lab", "Microprocessor & Microcontroller Lab", "VLSI & DSP Lab", "ECE Faculty Cabin"],
      "1st Floor": ["Computational Lab", "High Performance Computing & Research", "EC101", "ME101"],
      "2nd Floor": ["AI & Data Science Lab", "Cyber Physical System Lab", "EC201", "ME201"]
    },
    "Mechanical Engineering block": {
      "Ground Floor": ["Thermal and Fluids Lab", "Material Processing and Tech Lab", "Design and Dynamics Lab"],
      "1st Floor": ["HOD Cabin", "Department Office", "Faculty Cabin of Mechanical", "Robotics Lab", "DREAAMS Lab"]
    },
    "Department of Science": {
      "Ground Floor": ["DS103", "DS104", "DS105", "DS106", "DS107", "DS108", "HOD (DOS)", "Functional Nanomaterials Lab"],
      "1st Floor": ["DOS Seminar Hall", "SBI ATM", "DS102 (Sec B)", "DS101 (Sec A)", "IOT/CSE Lab", "VLSI Lab", "Maths Scholars Lab", "Language Lab", "Physics Lab"]
    },
    "Seminar Hall Block": {
      "Ground Floor": ["Cafe"],
      "1st Floor": ["Hundri Seminar Hall", "Krishna Seminar Hall"],
      "2nd Floor": ["Tungabhadra Seminar Hall"],
      "3rd Floor": ["Seminar Hall Complex"]
    },
    "Hill top dining hall (mess)": {
      "Ground Floor": ["Veg Section", "Girls Section"],
      "1st Floor": ["1st Year Section", "Non-Veg Section"]
    },
    "Library": {
      "1st Floor": ["Reading Room", "Digital Library"]
    },
    "KALAM boys Hostel": { "Ground Floor": ["Barber Shop"] },
    "MVHR Boys Hostel": { "Ground Floor": ["Reception", "Common Room"] },
    "Kalpana Chawla girls hostel": { "Ground Floor": ["Warden Office"] },
    "SRK boys hostel": { "Ground Floor": ["Common Hall"] },

    // --- NEW / UPDATED DATA MERGED ---
    "Kalam Hostel": {
      "Ground Floor": ["Barber"]
    },
    "Central Workshop": {
      "Ground Floor": ["Incharge Room", "Precision Manufacturing & Measurement Centre", "Quality Inspection and Product Validation Lab", "Computerised Hydraulic Base", "Hydraulic Press", "Laser Engraver", "Stir Casting Machine", "Drilling and Tapping", "Fitting", "Welding"]
    },
    "Department of Mechanical": {
      "Ground Floor": ["Thermal and Fluids Lab", "Material Processing and Tech Lab", "Design and Dynamics Lab"],
      "1st Floor": ["HOD Cabin", "Department Office", "Faculty Cabin of Mechanical", "Robotics Lab", "DREAAMS Lab"]
    },
    "Department of ECE": {
      "Ground Floor": ["DSP Lab", "Electrical Drives and Instrumentation Lab", "Drones Lab", "Embedded Systems and IOT Lab", "Microprocessor and Microcontroller Lab", "VLSI and DSP Lab"],
      "1st Floor": ["Computational Lab", "High Performance Computing and Research"],
      "2nd Floor": ["Artificial Intelligence and Data Science Lab", "Cyber Physical System Lab"],
      "3rd Floor": ["QF and Simulation Lab", "Antennas Lab", "Communications Lab", "5G Lab"]
    },
    "Department of CSE": {
      "Ground Floor": ["Project Room"],
      "1st Floor": ["Computing Lab"],
      "2nd Floor": ["Software Design and Product Level"],
      "3rd Floor": ["Analog Circuits Lab"]
    },
    "CSE Department": {
      "Ground Floor": ["CSE Faculty Cabin"],
      "1st Floor": ["CS101", "CS102"],
      "2nd Floor": ["CS201", "CS202"]
    },
    "ECE Department": {
      "Ground Floor": ["ECE Faculty Cabin"],
      "1st Floor": ["EC101", "ME101"],
      "2nd Floor": ["EC201", "ME201"]
    },
    "DOS": {
      "1st Floor": ["Surveillance Room", "Computer Centre", "Dr Nagaraju", "Staff Room"]
    },
    "Dining Hall": {
      "Ground Floor": ["Veg Section", "Girls Section"],
      "1st Floor": ["1st Year", "Non-Veg Section"]
    },
    "IIITDM Kurnool": {
      "Ground Floor": ["Drones PMU Lab"],
      "1st Floor": ["Store Room (LG-01)", "Director Cabin (LG-03)", "Conference Room (LG-02)"],
      "2nd Floor": ["Mini Conference Room (G01)", "Internal Audit Office (G02)", "Register / PA to Register (G03)"],
      "3rd Floor": ["Pantry (104)", "Training and Placement Office (101)", "Engineering and Maintenance (102)"]
    },
    "Seminar Hall Complex": {
      "Ground Floor": ["Cafe"],
      "1st Floor": ["Hundri Seminar Hall", "Krishna Seminar Hall"],
      "2nd Floor": ["Tungabhadra Seminar Hall"],
      "3rd Floor": ["Seminar Hall Complex"]
    },
    "Administrative Building": {
      "Ground Floor": ["SIC Lab"],
      "1st Floor": ["All Associate Deans (LG-07, LG-04)", "Dining Room (LG-05)", "Chairman (LG-06)"],
      "2nd Floor": ["Purchase Section (G04)", "Accounts Section (G05)", "Administration Section (G06)", "Academics Section (G07)"],
      "3rd Floor": ["Store Room (105)", "Communications", "Examination Room (108)", "Records Room (107)"]
    },
    "DOS Faculty Cabins": {
      "Info": ["Info coming soon"]
    },
    "DOS Class Rooms": {
      "1st Floor": ["DOS Seminar Hall", "SBI ATM", "DS102 (Sec B)", "DS101 (Sec A)", "Functional Nanomaterials Lab"]
    },
    "DOS Labs & Class Rooms": {
      "Ground Floor": ["DS103", "DS104", "DS105", "DS106", "DS107", "DS108", "HOD (DOS)"],
      "1st Floor": ["IOT/CSE Lab", "VLSI Lab", "Maths Scholars Lab", "Language Lab", "Physics Lab"]
    }
  };

  /* ================= SUPABASE SETUP ================= */
  const supabase = window.supabase.createClient(
    "https://iistugxdqonjsrxuvpgs.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpc3R1Z3hkcW9uanNyeHV2cGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODE5MzAsImV4cCI6MjA4Mjg1NzkzMH0.QFZKAZnFc-6jrCaOUs0ghAW227OXN1Y2XevOC3BUVX4"
  );

  /* ================= MAP LOGIC ================= */
  const map = L.map("map", {
    center: [15.759267, 78.037734],
    zoom: 17,
    minZoom: 15,
    maxZoom: 19,
    zoomControl: false
  });

  // Custom Zoom Controls
  document.getElementById("zoomInBtn").addEventListener("click", () => map.zoomIn());
  document.getElementById("zoomOutBtn").addEventListener("click", () => map.zoomOut());

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  let locations = [];
  let markers = [];
  let watchId = null;
  let userMarker = null;
  let accuracyCircle = null;
  let routingControl = null;
  let destination = null;

  /* ================= LOAD & DISPLAY ================= */
  const { data, error } = await supabase.from("Location").select("*");
  if (error) return console.error("Data error:", error);
  locations = data;

  // Icon Mapping Function based on Name and Category
  const getIconForLocation = (name, category) => {
    const textToSearch = ((name || "") + " " + (category || "")).toLowerCase();
    
    if (textToSearch.includes("hostel") || textToSearch.includes("bhavan") || textToSearch.includes("residence")) return "🛏️";
    if (textToSearch.includes("library") || textToSearch.includes("reading")) return "📚";
    if (textToSearch.includes("dining") || textToSearch.includes("mess") || textToSearch.includes("cafe") || textToSearch.includes("canteen") || textToSearch.includes("food")) return "🍔";
    if (textToSearch.includes("workshop")) return "🛠️";
    if (textToSearch.includes("lab") || textToSearch.includes("science")) return "🔬";
    if (textToSearch.includes("admin") || textToSearch.includes("office") || textToSearch.includes("director")) return "🏢";
    if (textToSearch.includes("sport") || textToSearch.includes("ground") || textToSearch.includes("court") || textToSearch.includes("gym")) return "⚽";
    if (textToSearch.includes("medical") || textToSearch.includes("dispensary") || textToSearch.includes("hospital") || textToSearch.includes("clinic")) return "🏥";
    if (textToSearch.includes("seminar") || textToSearch.includes("auditorium") || textToSearch.includes("hall")) return "🎤";
    if (textToSearch.includes("academic") || textToSearch.includes("cse") || textToSearch.includes("ece") || textToSearch.includes("mechanical") || textToSearch.includes("block") || textToSearch.includes("department")) return "🏫";
    if (textToSearch.includes("gate") || textToSearch.includes("entrance") || textToSearch.includes("security")) return "🚪";
    if (textToSearch.includes("atm") || textToSearch.includes("bank")) return "🏧";
    if (textToSearch.includes("parking")) return "🅿️";
    if (textToSearch.includes("park") || textToSearch.includes("garden")) return "🌳";
    
    return "📍"; // default
  };

  locations.forEach(loc => {
    const iconEmoji = getIconForLocation(loc.Name, loc.Category);
    
    // Create Custom HTML Div Icon
    const customIcon = L.divIcon({
      className: 'custom-map-marker', // wrapper class
      html: `<div class="custom-pin">${iconEmoji}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 38], // Point is centered bottom
      popupAnchor: [0, -32] // Popups above the pin
    });

    const marker = L.marker([loc.Lat, loc.Lng], { icon: customIcon }).addTo(map);

    const bName = (loc.Name || "").trim();
    let roomHtml = "";

    if (roomData[bName]) {
      for (const [floor, rooms] of Object.entries(roomData[bName])) {
        roomHtml += `<div class="room-group"><strong>${floor}</strong><span>${rooms.join("<br>")}</span></div>`;
      }
    } else {
       roomHtml = `<div style="color: #64748b; font-size: 0.9rem; font-style: italic;">No detailed rooms found for this location.</div>`;
    }

    // Bind Detail Panel
    marker.on('click', () => {
      document.getElementById('panelTitle').textContent = loc.Name;
      document.getElementById('panelSubtitle').textContent = loc.Category || "Campus Facility";
      document.getElementById('panelRooms').innerHTML = roomHtml;
      document.getElementById('panelNavigateBtn').onclick = () => {
        document.getElementById('detailPanel').classList.remove('visible');
        navigateTo(loc.Lat, loc.Lng);
      };
      
      document.getElementById('detailPanel').classList.add('visible');
      map.flyTo([loc.Lat, loc.Lng], 18, { animate: true, duration: 0.5 });
    });

    markers.push({ location: loc, marker: marker });
  });

  // Hide Detail Panel Button
  document.getElementById('closePanelBtn').onclick = () => {
    document.getElementById('detailPanel').classList.remove('visible');
  };

  // Quick Action Chips Filtering
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      const filter = chip.dataset.filter;
      
      markers.forEach(m => {
        const textArea = ((m.location.Name || "") + " " + (m.location.Category || "")).toLowerCase();
        let show = false;
        if (filter === 'all') show = true;
        else if (filter === 'hostel' && (textArea.includes("hostel") || textArea.includes("residence") || textArea.includes("bhavan"))) show = true;
        else if (filter === 'academic' && (textArea.includes("academic") || textArea.includes("block") || textArea.includes("department") || textArea.includes("cse") || textArea.includes("ece") || textArea.includes("mechanical"))) show = true;
        else if (filter === 'food' && (textArea.includes("dining") || textArea.includes("mess") || textArea.includes("cafe") || textArea.includes("canteen") || textArea.includes("food"))) show = true;
        else if (filter === 'lab' && (textArea.includes("lab") || textArea.includes("science") || textArea.includes("workshop"))) show = true;
        else if (filter === 'admin' && (textArea.includes("admin") || textArea.includes("office") || textArea.includes("director"))) show = true;
        
        if (show) {
          if (!map.hasLayer(m.marker)) m.marker.addTo(map);
        } else {
          if (map.hasLayer(m.marker)) map.removeLayer(m.marker);
        }
      });
    });
  });

  // Remove Loading Screen
  setTimeout(() => {
    const loader = document.getElementById("loadingOverlay");
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 600);
    }
  }, 800);

  /* ================= SEARCH SYSTEM (FIXED) ================= */
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = "";
    if (!q) return;

    locations.forEach(l => {
      const bName = (l.Name || "").trim();

      // Check building name and category match
      let isMatch = bName.toLowerCase().includes(q) ||
                    (l.Category || "").toLowerCase().includes(q);

      // Collect ALL matching rooms across ALL floors (not just the first match)
      let matchedRooms = [];
      let matchedFloors = [];

      if (roomData[bName]) {
        for (const [floor, rooms] of Object.entries(roomData[bName])) {
          rooms.forEach(r => {
            if (r.toLowerCase().includes(q)) {
              isMatch = true;
              matchedRooms.push(r);
              matchedFloors.push(floor);
            }
          });
        }
      }

      if (isMatch) {
        const div = document.createElement("div");
        div.className = "result-item";

        // Build matched rooms display
        let matchedHtml = "";
        if (matchedRooms.length > 0) {
          matchedHtml = matchedRooms.map((room, i) =>
            `<small style="color:#dc2626; display:block;">📍 ${room} <span style="color:#999;">(${matchedFloors[i]})</span></small>`
          ).join("");
        }

        const catBadge = l.Category ? `<span class="cat-badge">${l.Category}</span>` : '';

        div.innerHTML = `<div><strong>${l.Name}</strong>${catBadge}</div>${matchedHtml}`;
        div.onclick = () => {
          map.flyTo([l.Lat, l.Lng], 18);
          const mObj = markers.find(m => m.location === l);
          if (mObj) mObj.marker.fire('click');
          searchResults.innerHTML = "";
          searchInput.value = "";
        };
        searchResults.appendChild(div);
      }
    });

    // Show "no results" message if nothing matched
    if (searchResults.children.length === 0) {
      const div = document.createElement("div");
      div.className = "result-item";
      div.style.color = "#999";
      div.style.fontStyle = "italic";
      div.textContent = "No locations or rooms found.";
      searchResults.appendChild(div);
    }
  });

  /* ================= NAVIGATION ================= */
  document.getElementById("liveBtn").onclick = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    watchId = navigator.geolocation.watchPosition(pos => {
      const latlng = [pos.coords.latitude, pos.coords.longitude];
      if (!userMarker) {
        // Sonar User Marker
        const userIcon = L.divIcon({
          className: 'user-sonar',
          html: `<div class="sonar-ring"></div><div class="sonar-dot"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7]
        });
        userMarker = L.marker(latlng, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);

        accuracyCircle = L.circle(latlng, {
          radius: pos.coords.accuracy, color: "#3b82f6", weight: 1, fillOpacity: 0.1
        }).addTo(map);
      } else {
        userMarker.setLatLng(latlng);
        accuracyCircle.setLatLng(latlng).setRadius(pos.coords.accuracy);
      }
      if (destination) updateRoute(latlng, destination);
    }, (err) => alert("Please enable GPS: " + err.message));
  };

  document.getElementById("stopLiveBtn").onclick = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    if (userMarker) {
      map.removeLayer(userMarker);
      map.removeLayer(accuracyCircle);
    }
    userMarker = null;
    watchId = null;
  };

  window.navigateTo = (lat, lng) => {
    destination = [lat, lng];
    if (!userMarker) alert("Click '📍 Show Live' first to see your current position!");
    else updateRoute(userMarker.getLatLng(), destination);
  };

  function updateRoute(start, end) {
    if (routingControl) map.removeControl(routingControl);
    routingControl = L.Routing.control({
      waypoints: [start, end],
      lineOptions: { styles: [{ color: "#2563eb", weight: 6, opacity: 0.9, className: 'animated-route' }] },
      addWaypoints: false,
      show: false,
      fitSelectedRoutes: true
    }).addTo(map);
  }

  document.getElementById("cancelRouteBtn").onclick = () => {
    if (routingControl) map.removeControl(routingControl);
    routingControl = null;
    destination = null;
  };
});