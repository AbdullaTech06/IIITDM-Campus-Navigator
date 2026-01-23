document.addEventListener("DOMContentLoaded", () => {

    // ===== SUPABASE CONFIG =====
    const SUPABASE_URL = "https://iistugxdqonjsrxuvpgs.supabase.co";
    const SUPABASE_ANON_KEY =
        "sb_publishable_w33IEM4ohCVNL__Z14grpg_DwJR6DJ4";

    const supabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    // ===== MAP SETUP =====
    const campusCenter = [15.758844, 78.037691];

    const map = L.map("map", {
        center: campusCenter,
        zoom: 18,
        zoomControl: true,
        scrollWheelZoom: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // ===== LOAD LOCATIONS FROM SUPABASE =====
    async function loadCampusLocations() {
        const { data, error } = await supabase
            .from("Location")
            .select("*");

        if (error) {
            console.error("Supabase error:", error.message);
            return;
        }

        data.forEach(loc => {
            if (!loc.Lat || !loc.Lng) return;

            const marker = L.circleMarker(
                [Number(loc.Lat), Number(loc.Lng)],
                {
                    radius: 6,
                    color: "#dc3545",
                    fillColor: "#dc3545",
                    fillOpacity: 1,
                    weight: 2
                }
            ).addTo(map);

            // Permanent building name label
            marker.bindTooltip(
                loc.Name,
                {
                    permanent: true,
                    direction: "top",
                    offset: [0, -8],
                    className: "building-label"
                }
            );

            // Popup on click
            marker.bindPopup(`
                <b>${loc.Name}</b><br>
                <small>${loc.Category}</small><br>
                ${loc.Description ?? ""}
            `);
        });
    }

    loadCampusLocations();
});
