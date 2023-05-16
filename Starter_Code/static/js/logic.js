// Set a basemap (used coordinates for Denver, USA)
var map = L.map('map').setView([39.73915, -104.9847], 5);

let streetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Store our API endpoint as queryUrl - all earthquakes from the past 7 days.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the queryUrl
d3.json(queryUrl).then(function (data) {
// Once we get a response, send the data.features object to the createFeatures function.
createFeatures(data.features);
});

function createFeatures(earthquakeData) {
console.log(earthquakeData);

// Define a function that we want to run once for each feature in the features array.
// Give each feature a popup that describes the place and time of the earthquake.

function styling(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: markerColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

// Create function for marker size that show earthquakes with higer magnitudes have larger markers.
function markerSize(magnitude) {
    return magnitude * 5;
}

// Create function for marker color that show earthquakes with greater depth appear darker in color
function markerColor(magnitude) {

// '#B6F34C', '#E1F34C', '#F3DB4C', '#F3B94C', '#F0A76A','#F06A6A'
    if (magnitude <= 10) {return '#B6F34C'
    } 
        else if (magnitude <= 30) {return '#E1F34C'
    } 
        else if (magnitude <= 50) {return '#F3DB4C'
    } 
        else if (magnitude <= 70) {return '#F3B94C'
    } 
        else if (magnitude <= 90) {return '#F0A76A'
    } 
        else {return '#F06A6A'
    }
};


function onEachFeature2(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<h4> Magnitude: " + feature.properties.mag +"</h4>");
      }

// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng)},

style:styling,  
    onEachFeature: onEachFeature2
  })

earthquakes.addTo(map);

// Set up the legend.
let legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "info legend");
    let magnitudes = [-10,10,30,50,70,90];
    let colors = ['#B6F34C', '#E1F34C', '#F3DB4C', '#F3B94C', '#F0A76A','#F06A6A'];
    
    

// Create loop to push array of magnitude as a list item
for (let i = 0; i < magnitudes.length; i++) {
    div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + magnitudes[i] + (colors[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
  }
  return div;
};


// Add legend to map
legend.addTo(map);


}



  

