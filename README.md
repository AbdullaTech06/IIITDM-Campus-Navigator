# IIITDM Campus Navigator 🗺️

A clean, minimal, and responsive web-based campus navigation system for **IIIT Design and Manufacturing Kurnool** built with Leaflet.js and OpenStreetMap.

![Campus Navigator](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🎯 About

IIITDM Campus Navigator helps students, faculty, and visitors easily navigate the IIITDM Kurnool campus. The application provides an interactive map with real-time location tracking and a student-friendly interface.

## ✨ Features

- **Interactive Campus Map** - Full-screen responsive OpenStreetMap integration with IIITDM Kurnool campus location
- **Live Location Tracking** - Real-time GPS tracking to show your current position on campus
- **Campus Center Marker** - Clearly marked campus center point for easy orientation
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop devices
- **Clean Minimal UI** - Distraction-free interface with college-themed red accents
- **Smart Tooltips** - Contextual help messages for better user experience
- **High Zoom Levels** - Detailed view up to individual buildings (zoom level 18)
- **Error Handling** - Clear error messages for location permission issues

## 🎓 Team Members

This project was developed by students of IIIT Design and Manufacturing Kurnool:

- **Abdulla Ahmed**
- **Laxmikant Sahoo**
- **Asim Khan**
- **Rishabh Chaturvedi**

## 🚀 Live Demo

Visit the live application: [IIITDM Campus Navigator](https://your-username.github.io/IIITDM-Campus-Navigator/)

> Replace `your-username` with your GitHub username after deployment

## 📋 Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for map tiles
- Location permissions enabled (for live tracking feature)

## 🛠️ Installation & Usage

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/IIITDM-Campus-Navigator.git
```

2. Navigate to the project directory:
```bash
cd IIITDM-Campus-Navigator
```

3. Open `index.html` in your web browser:
```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

That's it! No build process or dependencies required.

## 🌐 GitHub Pages Deployment

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select:
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 2-3 minutes for deployment
7. Your site will be live at: `https://your-username.github.io/IIITDM-Campus-Navigator/`

## 📱 Features Breakdown

### Location Tracking
- Click the 📍 button in the top-right corner
- Grant location permission when prompted
- Blue dot shows your current position
- Red accuracy circle indicates GPS precision
- Works best on mobile devices with GPS

### Map Controls
- **Zoom In/Out**: Use +/- buttons or scroll wheel
- **Pan**: Click and drag the map
- **Campus Center**: Red marker shows the main campus location

## 🎨 Technology Stack

- **HTML5** - Structure and layout
- **CSS3** - Styling and animations
- **Vanilla JavaScript** - Core functionality
- **Leaflet.js** - Interactive map library
- **OpenStreetMap** - Map tile provider

## 📂 Project Structure

```
IIITDM-Campus-Navigator/
├── index.html          # Main HTML file
├── style.css           # Stylesheet with red theme
├── script.js           # JavaScript logic and map initialization
├── README.md           # Project documentation
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

## 🔧 Customization

### Change Campus Coordinates
Edit `script.js` and modify:
```javascript
const campusCenter = [15.758844, 78.037691]; // Your coordinates
```

### Adjust Zoom Level
```javascript
const campusZoom = 18; // Change to 15-19
```

### Modify Theme Colors
Edit `style.css` and change:
```css
border-bottom: 3px solid #dc3545; /* Red theme */
```

## 📝 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Known Issues

- Location tracking is less accurate on laptops (uses WiFi positioning instead of GPS)
- Requires internet connection for map tiles to load

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **IIIT Design and Manufacturing Kurnool** for the opportunity
- **Leaflet.js** for the amazing mapping library
- **OpenStreetMap** contributors for map data

## 📧 Contact

For questions or feedback, please contact the development team through the college portal.

---

**Made with ❤️ by IIITDM Kurnool Students**
