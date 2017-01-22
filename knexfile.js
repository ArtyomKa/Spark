var config = require('config');
var dbConfig = config.get('database');



console.log("KNEX env " + JSON.stringify(dbConfig));

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
