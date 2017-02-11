var config = require('config');
var dbConfig = config.get('database');
var log = require('./libs/logger.js')(module);


log.debug('KNEX env ' + JSON.stringify(dbConfig));

module.exports = config.get('database');
