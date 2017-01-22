var config = require('config');
var dbConfig = config.get('database');
var log = require('./logger.js')(module);


log.info("database config: " + JSON.stringify(dbConfig));
 
/*
var knex = require('knex')({
    client: dbConfig.client,
    connection: {
        host : dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database
    },
    debug: dbConfig.debug,
    useNullAsDefault: true
});
*/

var knex = require('knex')(dbConfig)
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin('virtuals');

module.exports.bookshelf = bookshelf;
