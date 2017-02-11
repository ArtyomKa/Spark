/**
 * configurations are for local development environment
 *
 * should be modified on production with correct configurations
 */

exports.db = {
    development: {
        client: 'sqlite3',
        debug: false,
        connection: {
            filename: './dev.sqlite3',
        },
        useNullAsDefault: true,
    },

    staging: {
        client: 'mysql',
        connection: {
            user: 'spark',
            database: 'spark',
            password: 'spark',
            host: process.env['DB_HOST'] || 'db',
        },
    },
};

// mysql configuration example
// exports.db = {
//     "client"        : "mysql",
//     "debug"         : false,
//     "host"          : "localhost",
//     "database"      : "spark",
//     "user"          : "spark",
//     "password"      : "spark",
//     "charset"       : "utf8",
// };

exports.server = {
    port: 3000,
    hostname: 'localhost',
    protocol: 'http',                  // http or https
    url: 'http://localhost:3000',  // full URL including protocol and port. NO trailing slash
};

exports.mail = {
    enabled: true,
    from: 'spark@localhost',
    host: 'localhost',
    secureConnection: false,         // use SSL
    port: 25,          // port for secure SMTP
    transportMethod: 'SMTP',       // default is SMTP. Accepts anything that nodemailer accepts
    /*
    auth: {
        user: "",
        pass: ""
    }
    */
};

exports.payment = {
    // iCreditUrl              : ""
    // iCreditGroupPrivateToken: ""
};

exports.npo = {
    email: 'amuta@localhost',
    idImagesFolder: 'd:/temp/',
};

exports.facebook = {
    app_id: '1083906121721925',
    app_secret: '',
    callbackBase: 'http://localhost:3000',
};

exports.recaptcha = {
    ignore: true, // when ignore is true - recaptcha is enabled but if it fails it ignores and continues sign up anyway
    // TODO change eyalliebermann app in an oficial one
    sitekey: '6LcdJwwUAAAAAGfkrUCxOp-uCE1_69AlIz8yeHdj',
    secretkey: '6LcdJwwUAAAAAFdmy7eFSjyhtz8Y6t-BawcB9ApF',
};
