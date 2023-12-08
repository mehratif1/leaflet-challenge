
// Use this link to get the GeoJSON data.
let queryUrl  = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Creating the map object
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 4
  });
  
  // Adding the tile layer
  
  
  
  // Getting our GeoJSON data
  d3.json(queryUrl).then(function(data) {

    console.log(data);

    createFeatures(data);

 });

function markerSize(magnitude){
   if (magnitude == 0 ){
    return 1;
   }

   return magnitude * 5;
}



function getColor(depth) {
  switch (true) {
    case depth > 90:
      return "#D84315";
    case depth > 70:
      return "#F57C00"
      case depth > 50:
        return "#FF9800"
        case depth > 30:
        return "#FFCC80"
        case depth > 10:
        return "#DCE775"
        default:
          return "#AED581"
  }}


function styleInfo(feature){
    return  {
        stroke: true, 
        fillOpacity: 0.75,
        color:getColor(feature.geometry.coordinates[2]) ,
        radius: markerSize(feature.properties.mag),
        weight: 0.5
    };
}



// Create a legend control
let legend = L.control({ position: 'bottomright' });

// Function to generate the legend content
function createLegend() {
  let div = L.DomUtil.create('div', 'info legend');
  let depths = [-10, 10, 30, 50, 70, 90];
  let labels = [];

  

  // Loop through depth intervals and generate labels with colored squares
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }

  return div;
}

// Add legend content to the control
legend.onAdd = function (map) {
  return createLegend();
};

// Add legend to the map
legend.addTo(myMap);



function createFeatures(earthquakeData) {

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  


  L.geoJSON(earthquakeData, {

    pointToLayer: function (feature, latlng){
        return L.circleMarker(latlng)
    },

    style: styleInfo,

    onEachFeature:  function (feature, layer) {

        
      layer.bindTooltip(`<strong>Magnitude:</strong> ${feature.properties.mag}<br>
                  <strong>Location:</strong> ${feature.properties.place}<br>
                  <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`);

    }

  }).addTo(myMap);

}

  
