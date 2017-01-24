var config = require('config');
var dbConfig = config.get('database');
var log = require('./logger.js')(module);


log.debug("KNEX env " + JSON.stringify(dbConfig));

module.exports = {
    development : {

    client: dbConfig.client,
    connection: dbConfig,
    debug: dbConfig.debug,
    useNullAsDefault: true
    },

    dockerdev: dbConfig
    /*{
        client: "mysql",
        connection: {
            host: dbConfig.host,
            user: dbConfig.user,
            database: "spark",
            password: dbConfig.password
            
        }
    }*/
};
