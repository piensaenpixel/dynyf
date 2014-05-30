var Config, configuration, defaultPort, env;

env = process.env.NODE_ENV || 'development';

defaultPort = 5000;

configuration = {

  development: {
    port: defaultPort,
  },

  production: {
    port: defaultPort,
  }

};

configuration[env].redirectURL = "http://" + configuration[env].URL + "/callback";

Config = configuration[env];
module.exports.Config = Config;
