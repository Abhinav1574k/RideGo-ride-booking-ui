// ==========================================
// MAP INITIALIZATION
// ==========================================

const map = L.map("map").setView([28.6139, 77.2090], 12);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ==========================================
// VARIABLES
// ==========================================

let pickup = null;
let dropoff = null;

let pickupMarker = null;
let dropoffMarker = null;
let routeLine = null;

let bookingTimer = null;


// ==========================================
// DOM ELEMENTS
// ==========================================

const pickupText = document.getElementById("pickupText");
const dropText = document.getElementById("dropText");

const distanceElement = document.getElementById("distance");
const fareElement = document.getElementById("fare");
const etaElement = document.getElementById("eta");

const rideType = document.getElementById("rideType");

const bookBtn = document.getElementById("bookBtn");
const resetBtn = document.getElementById("resetBtn");
const locationBtn = document.getElementById("locationBtn");

const statusText = document.getElementById("statusText");
const driverText = document.getElementById("driverText");


// ==========================================
// MAP CLICK
// ==========================================

map.on("click", function (event) {

    const lat = event.latlng.lat;
    const lng = event.latlng.lng;

    // First click = pickup
    if (!pickup) {

        pickup = {
            lat: lat,
            lng: lng
        };

        pickupMarker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup("Pickup Location")
            .openPopup();

        pickupText.textContent =
            `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        return;
    }


    // Second click = dropoff
    if (!dropoff) {

        dropoff = {
            lat: lat,
            lng: lng
        };

        dropoffMarker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup("Drop-off Location")
            .openPopup();

        dropText.textContent =
            `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        calculateRide();

        return;
    }


    // Third click starts a new selection
    resetLocations();

    pickup = {
        lat: lat,
        lng: lng
    };

    pickupMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("Pickup Location")
        .openPopup();

    pickupText.textContent =
        `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
});


// ==========================================
// HAVERSINE DISTANCE
// ==========================================

function calculateDistance(point1, point2) {

    const R = 6371;

    const lat1 = point1.lat * Math.PI / 180;
    const lat2 = point2.lat * Math.PI / 180;

    const deltaLat =
        (point2.lat - point1.lat) * Math.PI / 180;

    const deltaLng =
        (point2.lng - point1.lng) * Math.PI / 180;

    const a =
        Math.sin(deltaLat / 2) *
        Math.sin(deltaLat / 2) +

        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}


// ==========================================
// CALCULATE FARE
// ==========================================

function calculateRide() {

    if (!pickup || !dropoff) {
        return;
    }

    const distance = calculateDistance(
        pickup,
        dropoff
    );

    let rate = 12;

    if (rideType.value === "premium") {
        rate = 20;
    }

    if (rideType.value === "bike") {
        rate = 8;
    }

    const baseFare = 40;

    const fare =
        baseFare + (distance * rate);

    const eta =
        Math.max(
            5,
            Math.ceil(distance * 3)
        );


    distanceElement.textContent =
        `${distance.toFixed(2)} km`;

    fareElement.textContent =
        `₹${Math.round(fare)}`;

    etaElement.textContent =
        `${eta} min`;


    // Draw a simple line between locations
    if (routeLine) {
        map.removeLayer(routeLine);
    }

    routeLine = L.polyline(
        [
            [pickup.lat, pickup.lng],
            [dropoff.lat, dropoff.lng]
        ],
        {
            weight: 5
        }
    ).addTo(map);


    map.fitBounds(routeLine.getBounds(), {
        padding: [50, 50]
    });
}


// Recalculate if ride type changes
rideType.addEventListener(
    "change",
    calculateRide
);


// ==========================================
// BOOK RIDE
// ==========================================

bookBtn.addEventListener("click", function () {

    if (!pickup || !dropoff) {

        alert(
            "Please select both pickup and drop-off locations."
        );

        return;
    }


    bookBtn.disabled = true;

    statusText.textContent =
        "Ride Requested";

    driverText.textContent =
        "Searching for a nearby driver...";


    // Clear previous timer
    if (bookingTimer) {
        clearTimeout(bookingTimer);
    }


    // Driver assigned
    bookingTimer = setTimeout(function () {

        statusText.textContent =
            "Driver Assigned";

        driverText.textContent =
            "Driver: Rahul • White Swift • DL 01 AB 1234";

    }, 2000);


    // En route
    bookingTimer = setTimeout(function () {

        statusText.textContent =
            "Driver En Route";

        driverText.textContent =
            "Your driver is on the way.";

    }, 5000);


    // Arrived
    bookingTimer = setTimeout(function () {

        statusText.textContent =
            "Driver Arrived";

        driverText.textContent =
            "Your driver has arrived at the pickup location.";

    }, 9000);

});


// ==========================================
// RESET
// ==========================================

resetBtn.addEventListener(
    "click",
    resetLocations
);


function resetLocations() {

    if (bookingTimer) {
        clearTimeout(bookingTimer);
    }

    if (pickupMarker) {
        map.removeLayer(pickupMarker);
    }

    if (dropoffMarker) {
        map.removeLayer(dropoffMarker);
    }

    if (routeLine) {
        map.removeLayer(routeLine);
    }


    pickup = null;
    dropoff = null;

    pickupMarker = null;
    dropoffMarker = null;
    routeLine = null;


    pickupText.textContent =
        "Select pickup location";

    dropText.textContent =
        "Select drop-off location";

    distanceElement.textContent =
        "0 km";

    fareElement.textContent =
        "₹0";

    etaElement.textContent =
        "--";

    statusText.textContent =
        "Waiting for booking";

    driverText.textContent =
        "";

    bookBtn.disabled = false;
}


// ==========================================
// GEOLOCATION
// ==========================================

locationBtn.addEventListener(
    "click",
    function () {

        if (!navigator.geolocation) {

            alert(
                "Geolocation is not supported by this browser."
            );

            return;
        }


        locationBtn.textContent =
            "Getting location...";


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const lat =
                    position.coords.latitude;

                const lng =
                    position.coords.longitude;


                map.setView(
                    [lat, lng],
                    15
                );


                // Reset old pickup
                if (pickupMarker) {
                    map.removeLayer(pickupMarker);
                }


                pickup = {
                    lat: lat,
                    lng: lng
                };


                pickupMarker =
                    L.marker([lat, lng])
                        .addTo(map)
                        .bindPopup("Your Pickup Location")
                        .openPopup();


                pickupText.textContent =
                    `${lat.toFixed(5)}, ${lng.toFixed(5)}`;


                locationBtn.textContent =
                    "📍 Location Selected";
            },


            function () {

                alert(
                    "Unable to access your location. Please select the pickup point manually on the map."
                );

                locationBtn.textContent =
                    "📍 Use My Location";
            }
        );
    }
);