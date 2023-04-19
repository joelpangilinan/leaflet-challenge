// Load the data from the USGS website
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url, function(data) {

  // Create a map centered on the United States
  var map = L.map('map').setView([37.8, -96], 4);

  // Create a tile layer for the base map
  var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors'
  }).addTo(map);

  // Define the marker options
  function markerOptions(feature) {
    return {
      radius: feature.properties.mag * 5,
      fillColor: depthColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }

  // Define the color scale for the depth of the earthquake
  function depthColor(depth) {
    if (depth < 10) {
      return "#1a9850";
    } else if (depth < 30) {
      return "#91cf60";
    } else if (depth < 50) {
      return "#d9ef8b";
    } else if (depth < 70) {
      return "#fee08b";
    } else if (depth < 90) {
      return "#fc8d59";
    } else {
      return "#d73027";
    }
  }

  // Create a geojson layer and add it to the map
  var geojsonLayer = L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, markerOptions(feature));
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "<p>Magnitude: " + feature.properties.mag + "</p>" +
        "<p>Depth: " + feature.geometry.coordinates[2] + " km</p>");
    }
  }).addTo(map);

  // Create a legend for the depth colors
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    var depths = [-10, 10, 30, 50, 70, 90];
    var labels = ["<strong>Depth</strong><br>"];
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        labels.push('<i style="background:' + depthColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+'));
    }
    div.innerHTML = labels.join('');
    return div;
  };
  legend.addTo(map);
});
