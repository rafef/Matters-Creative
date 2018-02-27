var myMap;
var canvas;
var mappa = new Mappa('Leaflet');
// Lets change the map tiles to something with more contrast
var options = {
  lat: 0,
  lng: 0,
  zoom: 4,
  style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
}
function setup(){
  canvas = createCanvas(640,640);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas)
  // Load the data
  meteorites = loadTable('./data/Meteorite_Landings.csv', 'csv', 'header');
  // Only redraw the meteorites when the map change and not every frame.
  myMap.onChange(drawMeteorites);
  fill(70, 203,31);
  stroke(100);
}
function draw(){
}
// Draw the meteorites
function drawMeteorites() {
  // Clear the canvas
  clear();
  for (var i = 0; i < meteorites.getRowCount(); i++) {
    // Get the lat/lng of each meteorite
    var latitude = Number(meteorites.getString(i, 'reclat'));
    var longitude = Number(meteorites.getString(i, 'reclong'));
    // Only draw them if the position is inside the current map bounds. We use a
    // Leaflet method to check if the lat and lng are contain inside the current
    // map. This way we draw just what we are going to see and not everything. See
    // getBounds() in http://leafletjs.com/reference-1.1.0.html
    if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
      // Transform lat/lng to pixel position
      var pos = myMap.latLngToPixel(latitude, longitude);
      // Get the size of the meteorite and map it. 60000000 is the mass of the largest
      // meteorite (https://en.wikipedia.org/wiki/Hoba_meteorite)
      var size = meteorites.getString(i, 'mass (g)');
      size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
      ellipse(pos.x, pos.y, size, size);
    }
  }
}
