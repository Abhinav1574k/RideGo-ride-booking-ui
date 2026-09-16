# Ride Booking UI

Task 24 of the Web Development Internship.

A frontend ride-booking interface that allows users to select pickup and drop-off locations on an interactive map, calculate an estimated fare, and simulate a ride booking flow.

## Features

- Interactive map using Leaflet
- Pickup location selection
- Drop-off location selection
- Browser geolocation support
- Distance calculation
- Distance-based fare estimation
- Multiple ride types
- ETA estimation
- Simulated driver assignment
- Simulated ride status updates
- Reset functionality
- Responsive design

## Ride Flow

The simulated ride progresses through:

1. Ride Requested
2. Driver Assigned
3. Driver En Route
4. Driver Arrived

## Fare Calculation

The application calculates the geographic distance between pickup and drop-off locations using the Haversine formula.

Example pricing:

- Standard: ₹12/km
- Premium: ₹20/km
- Bike: ₹8/km

A base fare is also included.

## Technology

- HTML5
- CSS3
- JavaScript
- Leaflet.js
- OpenStreetMap

## Map

Leaflet is used for the interactive map and OpenStreetMap is used for map tiles.

The application does not require a Google Maps API key.

## Running Locally

Open the project using a local static server.

Example:

```bash
python3 -m http.server 5500
```

Then open:
http://localhost:5500