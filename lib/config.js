var Config, configuration, defaultPort, env;

env = process.env.NODE_ENV || 'development';

defaultPort = 5000;

configuration = {

  development: {
    port: defaultPort,
    cartoDB_USER: "",
    cartoDB_API_KEY: "",
  },

  production: {
    port: defaultPort,
    cartoDB_USER: "",
    cartoDB_API_KEY: "",
  }

};

configuration[env].redirectURL = "http://" + configuration[env].URL + "/callback";

Config = configuration[env];
module.exports.Config = Config;
