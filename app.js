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


everyauth.everymodule.findUserById(function(userId,callback) {
    UserModel.findOne({facebook_id: userId},function(err, user) {
        callback(user, err);
    });
});
everyauth.facebook
    .appId('592158694213808')
    .appSecret('e981f191dee36aaa1c00879b84d60978')
    .scope('email,user_location,user_photos,publish_actions')
    .handleAuthCallbackError( function (req, res) {
        res.send('Error occured');
    })
    .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {

        var promise = this.Promise();
        UserModel.findOne({facebook_id: fbUserMetadata.id},function(err, user) {
            if (err) return promise.fulfill([err]);

            if(user) {

                // user found, life is good
                promise.fulfill(user);

            } else {

                // create new user
                var User = new UserModel({
                    name: fbUserMetadata.name,
                    firstname: fbUserMetadata.first_name,
                    lastname: fbUserMetadata.last_name,
                    email: fbUserMetadata.email,
                    username: fbUserMetadata.username,
                    gender: fbUserMetadata.gender,
                    facebook_id: fbUserMetadata.id,
                    facebook: fbUserMetadata
                });

                User.save(function(err,user) {
                    if (err) return promise.fulfill([err]);
                    promise.fulfill(user);
                });

            }


        });

        return promise;
    })
    .redirectPath('/');

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
app.use(everyauth.middleware(app));

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

app.get("/", function(request, response) {
  return response.render("index");
});

app.get("/redirect", function(request, response) {
  return response.redirect("/");
});

app.get("/login", function(request, response) {
  return response.redirect("/auth/facebook");
});

port = process.env.PORT || Config.port;

server = app.listen(port, function() {
  return console.log("Listening on " + port);
});

