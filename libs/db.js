var config = require('config');
var dbConfig = config.get('database');
var log = require('./logger.js')(module);


log.debug("database config: " + JSON.stringify(dbConfig));
 
var knex = require('knex')(dbConfig)
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin('virtuals');

module.exports = {
    bookshelf: bookshelf,
    knex: knex
};
