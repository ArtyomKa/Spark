const opsworks = require('../opsworks.js');

console.log("default.js > " + JSON.stringify(opsworks));
console.log("NODE_ENV " + process.env.NODE_ENV);

module.exports =  {
  database: opsworks.db[process.env.NODE_ENV],
  
  server: opsworks.server,

  mail: opsworks.mail,

  i18n: {
    languages: ["he", "en"]
  },

  payment: opsworks.payment,

  npo: opsworks.npo,
  
  facebook: opsworks.facebook
};
