var store
sys        = require('util');
express    = require("express");
http       = require("http");
routes     = require("./routes");
path       = require('path');
crypto     = require('crypto');
sanitize   = require('validator').sanitize;
session    = require('express-session');

var morgan       = require('morgan')
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');

_         = require("underscore");
everyauth = require('everyauth');


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

getRandomID = function(length) {
  if (length == null) {
    length = 10;
  }
  return crypto.randomBytes(length).toString('hex');
};

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

app.get("/", function(request, response) {
  return response.render("index");
});

port = process.env.PORT || Config.port;

server = app.listen(port, function() {
  return console.log("Listening on " + port);
});

