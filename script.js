document.addEventListener("DOMContentLoaded", () => {

    // ===== SUPABASE =====
    const SUPABASE_URL = "https://iistugxdqonjsrxuvpgs.supabase.co";
    const SUPABASE_ANON_KEY =
        "sb_publishable_w33IEM4ohCVNL__Z14grpg_DwJR6DJ4";

    const supabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    // ===== MAP =====
    const campusCenter = [15.758844, 78.037691];
    const LABEL_ZOOM_LEVEL = 17;

    const map = L.map("map", {
        center: campusCenter,
        zoom: 18
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const markers = [];

    // ===== LOAD LOCATIONS =====
    async function loadCampusLocations() {
        const { data, error } = await supabase
            .from("Location")
            .select("*");

        if (error) {
            console.error(error);
            return;
        }

        data.forEach(loc => {
            if (!loc.Lat || !loc.Lng) return;

            const marker = L.circleMarker(
                [loc.Lat, loc.Lng],
                {
                    radius: 6,
                    color: "#dc3545",
                    fillColor: "#dc3545",
                    fillOpacity: 1,
                    weight: 2
                }
            ).addTo(map);

            const tooltip = marker.bindTooltip(loc.Name, {
                permanent: true,
                direction: "top",
                offset: [0, -8],
                className: "building-label"
            });

            marker.bindPopup(`
                <b>${loc.Name}</b><br>
                <small>${loc.Category}</small><br>
                ${loc.Description ?? ""}
            `);

            markers.push({ marker, tooltip, name: loc.Name });
        });

        updateLabels();
    }

    // ===== ZOOM-BASED LABEL VISIBILITY =====
    function updateLabels() {
        const show = map.getZoom() >= LABEL_ZOOM_LEVEL;
        markers.forEach(m => {
            if (show) {
                m.marker.openTooltip();
            } else {
                m.marker.closeTooltip();
            }
        });
    }

    map.on("zoomend", updateLabels);

    // ===== SEARCH =====
    const searchBox = document.getElementById("searchBox");

    searchBox.addEventListener("keydown", e => {
        if (e.key !== "Enter") return;

        const query = searchBox.value.toLowerCase().trim();
        if (!query) return;

        const result = markers.find(m =>
            m.name.toLowerCase().includes(query)
        );

        if (!result) {
            alert("Building not found");
            return;
        }

        map.setView(result.marker.getLatLng(), 18);

        const el = result.marker.getElement();
        if (el) {
            el.classList.add("highlight");
            setTimeout(() => el.classList.remove("highlight"), 3000);
        }

        result.marker.openPopup();
    });

    loadCampusLocations();
});
