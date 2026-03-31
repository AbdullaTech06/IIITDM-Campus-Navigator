# IIITDM Campus Navigator 🗺️🎓

An interactive, premium, mobile-first campus navigation application built to help students, faculty, and visitors seamlessly find their way around the IIITDM campus. Designed as a Google Maps-style experience, it offers live location tracking, optimal routing, intelligent search, and detailed facility information.

---

## 🌟 Key Features

*   **Interactive Campus Map:** Complete view of the entire campus built on top of high-performance mapping rendering engines.
*   **Live Geolocation Tracking:** Pulse animated "sonar" marker tracks your current position dynamically using the browser's Geolocation API.
*   **Shortest Path Navigation:** Dijkstra-powered route calculation showing animated paths from your live location to any campus destination.
*   **Smart Search Engine:** Instantly search for high-level buildings (e.g., "Library") or highly specific rooms (e.g., "AI & Data Science Lab", "SBI ATM"). 
*   **Intelligent Filtering System:** Quick-action chips let users isolate specific categories like Hostels, Academic Blocks, Dining, Labs, and Admin buildings.
*   **Detailed Facility Panels:** Interactive bottom-sheet panels constructed using glassmorphism UI showing floor-by-floor room directories for selected buildings.
*   **Premium & Responsive Design:** Highly polished UI featuring dark mode support, fluid micro-animations, blur backdrops, and a mobile-optimized layout focusing on single-handed operation.
*   **Dynamic Data Integration:** Connects seamlessly to a Supabase backend to retrieve real-time geographic coordinates and category data for campus nodes.

---

## 💻 Technology Stack

*   **Frontend Technologies:**
    *   **HTML5** for semantic, accessible document structure.
    *   **CSS3** featuring CSS Variables, Flexbox, Grid, advanced transitions, and custom scrollbars. No bulky CSS frameworks used for maximum performance.
    *   **Vanilla JavaScript (ES6+)** for DOM manipulation, asynchronous data fetching, and core application logic.
*   **Mapping & Routing:**
    *   **Leaflet.js (v1.9.4):** Core lightweight 2D interactive map rendering.
    *   **Leaflet Routing Machine:** Engine for calculating shortest walking paths (A*/Dijkstra).
    *   **OpenStreetMap (OSM):** Base map tile provider.
*   **Data & Backend:**
    *   **Supabase:** Serves as the real-time Database-as-a-Service (DBaaS) to host primary location nodes and coordinate data.
*   **Assets & Icons:**
    *   **Lucide Icons:** Clean, consistent SVG icon set.

---

## 📂 Project Structure

```text
/
├── index.html            # The visually rich product landing page and entry point
├── README.md             # Project documentation (you are here)
├── app/
│   ├── map.html          # Core highly interactive map application view
│   ├── style.css         # Component-scoped styling (panels, chips, overlays)
│   └── script.js         # Core business logic: Map rendering, DB sync, tracking
└── assets/
    └── css/
        └── global.css    # Typography, root variables, utility classes
```

---

## 🚀 How to Run Locally

Since this project relies on vanilla web technologies and an external DBaaS, running it locally is incredibly straightforward:

1.  **Clone or Download the Repository:** Save the root folder to your local machine.
2.  **Serve the files:** Due to modern browser security policies (CORS) when loading modules/fetching data, it's best to run this through a local development server rather than directly double-clicking `index.html`. 
    *   *If you use VS Code:* Install the **Live Server** extension, right-click `index.html`, and select "Open with Live Server".
    *   *Alternative (Node.js):* In your terminal, run `npx serve .` inside the project directory.
    *   *Alternative (Python):* In your terminal, run `python -m http.server` and visit `http://localhost:8000`.
3.  **Start Exploring:** Access the landing page, click "Open Map," and ensure you allow Location Permissions in your browser to test live tracking.

---

## 📐 Architecture & Logic Flow

1.  **Initialization:** `script.js` initializes the Leaflet map, configuring zoom limits and removing default controls for custom UI implementation.
2.  **Data Hydration:** An asynchronous call is made to the Supabase endpoint to fetch dynamic `.Lat`, `.Lng`, `Name`, and `Category` data. Detailed static data (like specific floors and laboratories) is mapped against these coordinates locally.
3.  **Marker Generation:** Custom HTML DivIcons with dynamically injected emojis (based on intelligent category string matching) are mounted onto the grid.
4.  **Spatial Interactivity:** Clicking a node flies the camera to the coordinate and raises the `detailPanel`. 
5.  **Routing Mechanics:** A destination is set. If the user's `watchPosition` returns valid data, Leaflet Routing Machine calculates the vector path between the live node and the selected destination.

---

## 📋 Evaluation Notes for Faculty

*   **Offline Tolerance:** Most core UI elements and JavaScript logic load independently. However, initial boot requires an internet connection to pull map tiles from OpenStreetMap and data nodes from Supabase.
*   **Geolocation Limitations:** Desktop testing might yield less accurate GPS coordinates than mobile devices. For the best routing experience during evaluation, testing on a mobile device is recommended.

---
*Developed with 💡 for IIITDM.*
