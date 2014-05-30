Marker.prototype = new google.maps.OverlayView();

function Marker(map, message, autoopen) {

  this.map_ = map;

  this.message  = message;
  this.lat      = this.message.lat;
  this.lng      = this.message.lng;
  this.autoopen = autoopen;

  this.div_ = null;

  // Explicitly call setMap() on this overlay
  this.setMap(map);
}

Marker.prototype.onAdd = function() {

  // We add an overlay to a map via one of the map's panes.
  // We'll add this overlay to the overlayImage pane.
  //var panes = this.getPanes();
  //panes.overlayLayer.appendChild(div);


 // Create the DIV and set some basic attributes.
  var div = document.createElement('div');
  div.style.position = "absolute";

  this.div_ = div;

  var overlayProjection = this.getProjection();
  var d = new google.maps.LatLng(this.lat, this.lng);
  var coordinates = overlayProjection.fromLatLngToDivPixel(d);

  this.layer = d3.select(this.getPanes().overlayLayer).append("div")
  .attr("class", "marker");

  var padding = 20;
  var self = this;

  var data = this.data = {}

  data.coordinates = coordinates;
  data.div = div;
  data.message = this.message;
  data.lat = this.lat;
  data.lng = this.lng;
  data.marker = this;

  this.marker = this.layer
  .data([data])
  .style("left", coordinates.x + "px")
  .style("top", coordinates.y + "px")
  .append("svg:svg")
  .append("svg:circle")
  .style("opacity", 0)
  .attr("r", 0)
  .attr("cx", padding)
  .attr("cy", padding)
  .on('mouseout', function(d, i) {
      app.map.setOptions({ draggableCursor:'' }) // set the cursor back to its default state
      return
  })
  .on('mouseover', function(d, i) {
      app.map.setOptions({ draggableCursor:'pointer' })
      return
  })
  .transition()
  .delay(Math.random() * 1000)
  .duration(200)
  .attr("r", 6 + Math.random()*10)
  .ease("ease-in")
  .style("opacity", 1)
  .transition()
  .duration(150)
  .ease("ease-out")
  .attr("r", 6)
  .each("end", function() {
    if (self.autoopen) {

      setTimeout(function() {
        self.show();
      }, 1400);

    }
  });

  $("svg").on("click", function(e) {
    e.preventDefault()
  })

  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div);

};

Marker.prototype.show = function() {
}

Marker.prototype._onClick = function(data) {


};

Marker.prototype.draw = function() {

  var overlayProjection = this.getProjection();
  var d = new google.maps.LatLng(this.lat, this.lng);
  var coordinates = overlayProjection.fromLatLngToDivPixel(d);

  var padding = 20;

  this.layer
  .style("left", (coordinates.x - 20) + "px")
  .style("top",  (coordinates.y  - 20) + "px")

};

Marker.prototype.onRemove = function() {
  //this.div_.parentNode.removeChild(this.div_);
  //this.div_ = null;
};
