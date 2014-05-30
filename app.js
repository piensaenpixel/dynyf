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

// CartoDB configuration
cartoDB = new CartoDB({
  user: Config.cartoDB_USER,
  api_key: Config.cartoDB_API_KEY
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

    });
  }).end();
}

app.get("/", function(request, response) {

    if (request.session.passport.user) {
      getFriendsLocation(request, response);
      return response.redirect("/visualization");
    }

  return response.render("index");
});

app.get("/visualization", function(request, response) {

  if (!request.session.passport.user) {
    return response.redirect("/");
  }

  if (request.session.passport) {
    console.log(request.session.passport);
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

