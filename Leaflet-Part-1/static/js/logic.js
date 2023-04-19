// Define the tile layer that will be the background of the map
var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
});

// Define the map with the specified center and zoom level
var map = L.map('mapid').setView([37.09, -95.71], 3);

// Add the tile layer to the map
tileLayer.addTo(map);

// Define a function that returns the radius of the marker based on the magnitude of the earthquake
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    } else {
        return magnitude * 4;
    }
}

// Define a function that returns the color of the marker based on the depth of the earthquake
function getColor(depth) {
    if (depth < 10) {
        return "#b7f34d";
    } else if (depth < 30) {
        return "#e1f34d";
    } else if (depth < 50) {
        return "#f3db4d";
    } else if (depth < 70) {
        return "#f3ba4d";
    } else if (depth < 90) {
        return "#f0a76b";
    } else {
        return "#f06b6b";
    }
}

// Define a function that returns the style of the marker based on the depth of the earthquake
function getStyle(feature) {
    return {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}

// Define a function that adds a popup to the marker when it is clicked
function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "<p>Magnitude: " + feature.properties.mag + "</p>" +
        "<p>Depth: " + feature.geometry.coordinates[2] + "</p>");
}

// Import the earthquake data and add it to the map as a layer of markers
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url, function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, getStyle(feature));
        },
        onEachFeature: onEachFeature
    }).addTo(map);

    // Create a legend for the map
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var depths = [-10, 10, 30, 50, 70, 90];
        var labels = [];

        // Add the legend title
        div.innerHTML += "<h4>Depth</h4>";

        // Add the depth range labels to the legend
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML += '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' +
