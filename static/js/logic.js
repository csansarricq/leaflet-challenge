// Create the 'basemap' tile layer that will be the background of our map.

let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map object with center and zoom options.
let myMap = L.map("map", {
    center: [34.03, -118.24],
    zoom: 5,
});

// Then add the 'basemap' tile layer to the map.

basemap.addTo(myMap);


// Make a request that retrieves the earthquake geoJSON data.

let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(link).then(function (data) {
  // This function returns the style data for each of the earthquakes
  function styleInfo(feature) {
    return {
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000", 
        weight: 0.5, 
        opacity: 0.5, 
        fillOpacity: 0.8, 
        radius: getRadius(feature.properties.mag) 
    };
}

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    return depth > 90 ? "red" :
        depth > 70 ? "orangered" :
        depth > 50 ? "gold" :
        depth > 30 ? "yellow" :
        depth > 10 ? "green" :
                     "blue"; 
  }


  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return magnitude === 0 ? 1 : magnitude * 4;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
         return L.circleMarker(latlng, styleInfo(feature));
    },
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            "<strong>Magnitude:</strong> " + feature.properties.mag + "<br>" +
            "<strong>Depth:</strong> " + feature.geometry.coordinates[2] + " km<br>" +
            "<strong>Location:</strong> " + feature.properties.place
        );  
    }
  }).addTo(myMap);

  // Create a legend control object.
function addLegend(){  
    let legend = L.control({
    position: "bottomright"
});

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    div.innerHTML = "<h4>Earthquake Depth (km)</h4>";
    // Initialize depth intervals and colors for the legend
    let depthIntervals = [-10, 10, 30, 50, 70, 90];
    let colors = ["blue", "green", "yellow", "gold", "orangered", "red"];
    // Loop through our depth intervals to generate a label with a colored square for each interval.
     for (let i = 0; i < depthIntervals.length; i++) {
            div.innerHTML +=
                `<i style="background: ${colors[i]}"></i> ` +
                depthIntervals[i] + (depthIntervals[i + 1] ? "&ndash;" + depthIntervals[i + 1] + " km<br>" : "+ km");
        }

    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(myMap);
    
}
  // Call the function to add the legend
  addLegend();
});