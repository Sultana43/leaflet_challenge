

// Set a basemap (used coordinates for Denver, USA)
var map = L.map('map').setView([39.73915, -104.9847], 5);

// Store our API endpoint as queryUrl - all earthquakes from the past 7 days.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the queryUrl
d3.json(queryUrl).then(function (data) {
// Once we get a response, send the data.features object to the createFeatures function.
createFeatures(data.features);
});

// Create function for marker size that show earthquakes with higer magnitudes have larger markers.
function markerSize(magnitude) {
    return magnitude * 5;
}

// Create function for marker color that show earthquakes with greater depth appear darker in color (source: HTML color shades).
// FFFF33 --> CC0033 correspond to yellow --> dark red
function markerColor(magnitude) {
    if (magnitude <= 1) {return "#FFFF33"
    } 
        else if (magnitude <= 2) {return "#FFCC33"
    } 
        else if (magnitude <= 3) {return "#FF9933"
    } 
        else if (magnitude <= 4) {return "#FF6633"
    } 
        else if (magnitude <= 5) {return "#FF3333"
    } 
        else {return "#CC0033"
    }
};

function createFeatures(earthquakeData) {

// Define a function that we want to run once for each feature in the features array.
// Give each feature a popup that describes the place and time of the earthquake.
function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<h4> Magnitude: " + feature.properties.mag +"</h4>");
      }

// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.properties.mag),
            color: "#000",
            weight: 0.3,
            opacity: 0.5,
            fillOpacity: 1
        });
    },
    onEachFeature: onEachFeature
  });

// Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

// Create streetMap layer??
let streetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Create baseMap object to hold layers
var baseMaps = {
    "Map": map,
    "Street Map": streetMap
    
};

// Create overlay object to hold the earthquakes data.
var overlayMaps = {
    Earthquakes: earthquakes
};

// Create the map showing the streetmap and earthquake layers.
// var myMap = L.map("map", {
//     center: [
//         37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [streetMap, earthquakes]
// });

// Create a layer control - pass in baseMaps, overlaysMaps and add layer control to the map.
// L.control.layers(baseMaps, overlayMaps, {
//     collapsed:false
// }).addTo(myMap);

}

// Set up the legend.
var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "info legend");
    let magnitudes = [1,2,3,4,5];
    let colors = geojson.options.markerColor;
    legendInfo = 
    labels = []
    div.innerHTML = legendInfo;
    

// Create loop to push array of magnitude as a list item
    for (let i = 0; i <magnitudes.length; i ++) {
    labels.push('<li style="background-color:' + markerColor(magnitudes[i] + 1) + '"> <span>' + magnitudes[i] + (magnitudes[i + 1]
        ? '&ndash;' + magnitudes[i + 1] + '' : '+') + '</span></li>');

// Add label items under <ul> tag
div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
}

// Add legend to map
legend.addTo(myMap);


};    

