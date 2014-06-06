var store
sys        = require('util');
express    = require("express");
http       = require("http");
https       = require("https");
routes     = require("./routes");
path       = require('path');
crypto     = require('crypto');
sanitize   = require('validator').sanitize;
session    = require('express-session');
async      = require('async');

Geocoder = require("batch-geocoder"),
geocoder = new Geocoder("./geocode-cache.csv");


var morgan       = require('morgan')
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');

_ = require("underscore");
passport = require('passport')
FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:5000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {

    console.log(accessToken, refreshToken)

    profile.accessToken = accessToken;

    return done(null, profile);

  });
}));

CartoDB = require('cartodb');
Config  = require("./lib/config").Config;
app = express();

app.set('port', process.env.PORT || Config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", {
  layout: false
});

//app.use(express.favicon());
app.use(morgan({ format: 'dev', immediate: true }));

app.use(bodyParser());
app.use(require('errorhandler')())
app.use(require('method-override')())
app.use(cookieParser("F;;v,m-{-HC6YqTR}T=;"));
app.use(session({
  secret: 'F;;v,m-{-HC6YqTR}T=;',
  store: store
}));
 app.use(passport.initialize());
  app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

console.log(process.env.CARTODB_USER)
// CartoDB configuration
cartoDB = new CartoDB({
  user: process.env.CARTODB_USER,
  api_key: process.env.CARTODB_API_KEY,
});

cartoDBLog = require("fs").createWriteStream(__dirname + "/responses.log");
cartoDB.pipe(cartoDBLog);
cartoDB.connect();
cartoDB.on("connect", function() {
  return console.log("connected");
});

extend = function(origin, add) {
  var i, keys;
  if (!add || typeof add !== "object") {
    return origin;
  }
  keys = Object.keys(add);
  i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};


var getLatLng = function(callback) {
  var query;
  query = "SELECT ST_X(the_geom) AS longitude, ST_Y(the_geom) AS latitude FROM {table} LIMIT 1";
  return cartoDB.query(query, {
    table: "global_cities_points"
  }, callback);
};


// ROUTES
// ==========================================
//

var getOptions = function(host, port, method, path, headers) {
  return {
    host: host,
    port: port,
    method: method,
    path: path,
    headers: _.extend({
      "Content-Type": "application/json"
    }, headers)
  };
};

var get = function(res, options) {
  return https.request(options, function(resp) {
    var data;
    data = "";
    resp.on("data", function(chunk) {
      return data += chunk;
    });
    return resp.on("end", function() {
      res.writeHead(resp.statusCode, {
        "Content-Type": "application/json"
      });
      res.write(data);
      return res.end();
    });
  }).end();
};

function getFriendsLocation(req, res) {

  //console.log(req.session.passport.user.accessToken)

  var options = getOptions("graph.facebook.com", 443, "GET", "/v1.0/me/friends?fields=location&limit=5000&access_token=" + req.session.passport.user.accessToken);

  return https.request(options, function(resp) {
    var data;
    data = "";
    resp.on("data", function(chunk) {
      return data += chunk;
    });
    return resp.on("end", function() {

      data = JSON.parse(data);

      var locations = [];

      console.log(data.data.length)

      for (var i = 0; i< data.data.length; i++) {

        var location = data.data[i].location;

        if (location) {
          locations.push(location.name);
        }

      }

      req.session.passport["locations"]= locations
      req.session.save()

      console.log(req.session.passport.user.locations)
      console.log(locations.length)

      return res.redirect("/visualization");

    });
  }).end();
}

app.get("/", function(request, response) {

    if (request.session.passport.user) {
      getFriendsLocation(request, response);
      return;
    }

  return response.render("index");

});

app.get("/get/coordinates", function(request, response) {

  if (request.session.passport) {

    var locations = request.session.passport.locations;
    console.log(locations)

    geocoder.on("status", function(status){
      console.log(completed.current + '/' + completed.total);
    });

    geocoder.on("finish", function(collection){
      console.log(collection)
      response.end(JSON.stringify(collection));
    });

    geocoder.find(locations);

  } else {
    response.end(null);
  }

});

app.get("/visualization", function(request, response) {

  if (!request.session.passport.user) {
    return response.redirect("/");
  }

  return response.render("page");
});

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['friends_hometown', 'read_friendlists', 'read_stream', 'publish_actions'] }),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

port = process.env.PORT || Config.port;

server = app.listen(port, function() {
  return console.log("Listening on " + port);
});

