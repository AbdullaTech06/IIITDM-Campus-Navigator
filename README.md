# 📍 IIITDM Campus Navigator

An advanced, highly aesthetic, and fully functional interactive campus map designed specifically for **IIITDM Kurnool**. Built to help students, faculty, and visitors seamlessly navigate the campus premises.

## 🌟 Key Features

### 1. Premium & Aesthetic User Interface
- **Modern Landing Page:** Welcomes users with a sleek, frosted-glass (glassmorphism) overlay and smooth micro-animations.
- **Dark Mode Support:** A built-in theme toggle allows users to switch between a vibrant light map and a stylized, eye-friendly dark mode map.
- **Custom UI Elements:** Floating semi-transparent control buttons, interactive search bars, and gradient-styled popups replace traditional, clunky map UI.

### 2. Interactive Campus Map & Routing
- **Comprehensive Locations:** Pins for all major campus locations (Hostels, Academic Blocks, Health Center, Sports Complex, etc.).
- **Smart Routing:** Select any location to instantly generate a pedestrian route.
- **Animated Route Drawing:** Routes do not just appear; they are drawn across the map using CSS SVG animations for a premium feel.
- **Pulsing Destination Markers:** Highlights the final destination with a stylish, animated pulse effect.

### 3. Live Geolocation Tracking
- **High-Accuracy GPS:** Uses HTML5 Geolocation API with `enableHighAccuracy: true` to get precise real-time location data.
- **Live Tracking:** A "Show Live" feature places a custom blue beacon on the user's current location, tracking them as they move across campus.

### 4. Progressive Web App (PWA) & Offline Capabilities
- **Installable Native Feel:** Students can "install" the navigator directly to their iOS or Android home screens, functioning exactly like a native app.
- **Instant Loading:** Implements a Service Worker (`sw.js`) to locally cache the HTML, CSS, and JavaScript elements.
- **Offline Mode:** Dynamically caches OpenStreetMap tiles as the user browses. If the Wi-Fi or cellular connection drops while walking across campus, the map and routing interface will intelligently continue to operate from the device's cache.

## 💻 Technical Stack
- **Frontend Core:** HTML5, CSS3 (Vanilla, custom keyframe animations, CSS filters, glassmorphism), Vanilla JavaScript.
- **Map Engine:** [Leaflet.js](https://leafletjs.com/) (Open-source interactive maps).
- **Routing Engine:** Leaflet Routing Machine.
- **Map Tiles:** OpenStreetMap API.
- **Deployment:** Hosted on GitHub Pages.
- **Application Architecture:** Progressive Web App (PWA) using Service Workers and Web App Manifest.

## 🚀 Live Demo
The application is live and hosted on GitHub Pages. It can be accessed anywhere at:
**[https://AbdullaTech06.github.io/IIITDM-Campus-Navigator/](https://AbdullaTech06.github.io/IIITDM-Campus-Navigator/)**

---

## 🛠️ Local Setup Instructions
If you wish to run the project locally for development or evaluation:
1. Clone the repository:
   ```bash
   git clone https://github.com/AbdullaTech06/IIITDM-Campus-Navigator.git
   ```
2. Navigate to the project directory:
   ```bash
   cd IIITDM-Campus-Navigator
   ```
3. Start a local HTTP server (e.g., using Node's `http-server`):
   ```bash
   npx http-server -p 8080
   ```
4. Open `http://localhost:8080` in your web browser.

---
*Developed for IIITDM Kurnool.*
