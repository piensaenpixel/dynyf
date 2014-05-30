App = Backbone.View.extend({

  defaults: {

    mapType:            "google",
    zoom:               3,
    zoomControl:        false,
    panControl:         false,
    scaleControl:       false,
    streetViewControl:  false,
    overviewMapControl: false,
    center:             [35,0],
    layerURL:           'http://javierarce.cartodb.com/api/v2/viz/f6f43a46-fc49-11e2-9967-3085a9a9563c/viz.json',
    grayRoadmap:        [ { stylers: [ { "saturation": -100 } ] },{ "featureType": "water", "stylers": [ { "gamma": 1.67 }, { "lightness": 27 } ] },{ "elementType": "geometry", "stylers": [ { "gamma": 1.31 }, { "lightness": 12 } ] },{ "featureType": "administrative", "elementType": "labels", "stylers": [ { "lightness": 51 }, { "gamma": 0.94 } ] },{ },{ "featureType": "road", "elementType": "labels", "stylers": [ { "lightness": 57 } ] },{ "featureType": "poi", "elementType": "labels", "stylers": [ { "lightness": 42 } ] } ],

    colorRoadmap: [{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":-22},{"lightness":15}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-15},{"gamma":1.65}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"all","stylers":[{"visibility":"on"},{"lightness":35}]}],

    darkRoadmap:        [ { featureType: "landscape.natural", stylers: [ { gamma: 0.01 }, { weight: 0.1 } ] }, { stylers: [ { saturation: -100 }, { invert_lightness: true }, { gamma: 4.17 }, { lightness: -87 } ] }, { elementType: "labels", stylers: [ { visibility: "on" }, { lightness: 3 }, { gamma: 1.85 } ] }, { stylers: [ { weight: 1.2 } ] },{ featureType: "road.highway", stylers: [ { visibility: "simplified" }, { weight: 0.3 } ] }, { elementType: "labels.icon", stylers: [ { visibility: "off" } ] }, { featureType: "road.arterial", stylers: [ { weight: 0.3 } ] }, { featureType: "administrative.neighborhood", stylers: [ { visibility: "off" } ] }, { featureType: "administrative.locality", stylers: [ { visibility: "off" } ] }, { featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "poi", stylers: [ { lightness: 4 } ] },{ featureType: "administrative", stylers: [ { lightness: 14 }, { weight: 0.8 } ] },{ featureType: "landscape.man_made", stylers: [ { lightness: 13 } ] },{ featureType: "road.local", stylers: [ { weight: 0.2 } ] },{ featureType: "road.highway", stylers: [ { weight: 0.3 } ] }],

    darkLayerURL:       'http://a.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png',
    brightLayerURL:     'http://a.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png',
    attribution:        'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms & Feedback</a>',
    tileStyle:          "#answers{ marker-fill: #109DCD; marker-opacity: 0.9; marker-allow-overlap: true; marker-placement: point; marker-type: ellipse; marker-width: 12; marker-line-width: 3; marker-line-color: #FFF; marker-line-opacity: 0; marker-comp-op: multiply; }"
  },

  initialize: function() {

    this.options = _.extend(this.defaults, this.options);
    this._setupMap();

  },

  _setupMap: function() {

    if (!this.map) {
      this._createMap();
    }

  },

  _createMap: function() {

    this._createGoogleMap();

  },

  _createGoogleMap: function() {

    var mapOptions = {
      disableDefaultUI:   true,
      center:             new google.maps.LatLng(this.options.center[0], this.options.center[1]),
      mapTypeId:          google.maps.MapTypeId.ROADMAP,
      zoom:               this.options.zoom,
      zoomControl:        this.options.zoomControl,
      panControl:         this.options.panControl,
      scaleControl:       this.options.scaleControl,
      streetViewControl:  this.options.streetViewControl,
      overviewMapControl: this.options.overviewMapControl,
      styles:             this.options.grayRoadmap
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var overlay = new Marker(this.map, { lat: 32, lng: -20 }, true);
    var overlay = new Marker(this.map, { lat: 12, lng: 23 }, true);
    var overlay = new Marker(this.map, { lat: 22, lng: 10 }, true);

  },

  render: function() {

  }

});

$(function() {

  app = new App();
  Backbone.history.start({ pushState: true });

});
