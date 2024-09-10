/// Create map object 
var map = L.map('map').setView([38, -99], 4.5);

/// Add title layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/// Store API endpoint as queryURL
let queryURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

/// Get request to queryURL to create, add and style Circle Markers
d3.json(queryURL).then(data =>{
    L.geoJSON(data, {
        pointToLayer:function(geoJsonPoint, latlng) {
            return L.circleMarker(latlng);
        },
        style: function (feature) {
            let depth = feature.geometry.coordinates[2];
            
            return {
                radius: feature.properties.mag*4,
                color: 'black',
                weight: 1,
                fillOpacity: .4,
                fillColor: 
                    depth<10 ? 'green' : 
                    depth<30 ? 'lime' :
                    depth<50 ? 'yellow' :
                    depth<70 ? 'orange' :
                    depth<90 ? 'darkorange' : 'red'
            };
        }
    }).bindPopup(function (layer) {

        let mag = layer.feature.properties.mag;
        let place = layer.feature.properties.place;
        let time = new Date(layer.feature.properties.time).toLocaleString();
        let depth = layer.feature.geometry.coordinates[2];

        return `
            <h4>
                ${place}<br>
                Magnitude: ${mag}<br>
                Depth: ${depth}<br>
                ${time}      
            </h4>
        `;
    }).addTo(map);

    /// Create a legend control
    let legend = L.control({ position: 'bottomright' });
    /// When the legend is added to the map
    legend.onAdd = function () {
      let div = L.DomUtil.create('div', 'info legend');
      let depth = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
      let colors = ['green', 'lime', 'yellow', 'orange', 'darkorange', 'red'];
      let labels = [];

    /// Loop through the depth variable and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        labels.push('<i style="background:' + colors[i] + '; margin-right: 10px;"></i>' +
            depth[i] +  (depth[i + 1] ? '' + '<br>' : '')); 
            ///console.log(labels[i])
    }
    div.innerHTML += '<h4>Earthquakes (Past Day) <br /> *Depth of Earthquakes* </h4>' + labels.join('');
    return div;

  };
/// Add lengend to map
legend.addTo(map);

});

