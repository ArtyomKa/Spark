var config = require('config');
var dbConfig = config.get('database');
 
var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin('virtuals');
bookshelf.plugin('pagination');

module.exports = {
    bookshelf: bookshelf,
    knex: knex
};
