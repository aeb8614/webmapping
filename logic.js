//earthquake API URL
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//----------------------------------------------------------------------------

// Calls function to render map
renderMap(earthquakeURL);

//----------------------------------------------------------------------------
// Function to render map
function renderMap(earthquakeURL) {

    d3.json(earthquakeURL, function(data) {
        console.log(earthquakeURL)
        var earthquakeData = data;
            createFeatures(earthquakeData);
        });

    // creating earthquake feature
    function createFeatures(earthquakeData) {

        function onEachQuakeLayer(feature, layer) {
            return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                fillOpacity: .5,
                color: "gray",
                weight: .5,
                fillColor: chooseColor(feature.properties.mag),
                radius:  markerSize(feature.properties.mag)
            });
        }
        function onEachEarthquake(feature, layer) {
            layer.bindPopup("<h5>" + feature.properties.place + "</h5><hr><p>" + new Date(feature.properties.time));
        };


        // Creates a GeoJSON layer containing the features array of the earthquakeData object
        var earthquakes = L.geoJSON(earthquakeData, {
            onEachFeature: onEachEarthquake,
            pointToLayer: onEachQuakeLayer
        });


        //puts earthquake features on map
        createMap(earthquakes);
    };

    // Function to create map
    function createMap(earthquakes) {
      var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiYWViODYxNCIsImEiOiJjamlhdWg0c3kxOHRwM2twMDh3aXF4NnF0In0.JR0IsuzNhjGCnGIL6OELrQ");

        // Define a baseMaps object to hold base layers
        var baseMaps = {
            "Light Map": lightmap,
        };

        // Create overlay object to hold overlay layers
        var overlayMaps = {
            "Earthquakes": earthquakes,
        };

        // Create map, default settings
        var map = L.map("map", {
            center: [39.8283, -98.5785],
            zoom: 3,
            layers: [lightmap],
            scrollWheelZoom: false
        });

        // Create a layer control
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: true
        }).addTo(map);

        // Adds Legend
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'info legend'),
                        grades = [0, 1, 2, 3, 4, 5],
                        labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML += '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            };

            return div;
        };
        legend.addTo(map);

    };
}

// chooseColor function
function chooseColor(magnitude) {
  return magnitude > 5 ? "darkred":
         magnitude > 4 ? "crimson":
         magnitude > 3 ? "darkorange":
         magnitude > 2 ? "goldenrod":
         magnitude > 1 ? "gold":
                         "cornsilk"; // <= 1 default
};

//marker size fuction
function markerSize(magnitude) {
    return magnitude * 3;
};
