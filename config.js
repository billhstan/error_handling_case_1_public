require('dotenv').config();
const util = require('util');
const chalk = require('chalk');
let databaseConfig=null;
let smtpAccountConfig=null;
if ( process.env.NODE_ENV!='development') {
    console.log(chalk.magenta('config.js>>>NODE_ENV is not \'development\'>>>Connect to Heroku DB'));
     databaseConfig = {
        connectionString: process.env.DATABASE_URL_HEROKU,
        ssl: {
            rejectUnauthorized: false
          }
    };
    console.log(chalk.magenta('config.js>>>Obtain ADMIN SMTP credentials from ENV file'));
    smtpAccountConfig={
        userEmail :process.env.SMTP_ADMIN_USER_EMAIL,
        userPassword :process.env.SMTP_ADMIN_USER_PASSWORD,
     };
}else{
    console.log(chalk.magenta('config.js>>>NODE_ENV is \'development\'>>>Use local database'));
    console.log(chalk.magenta('config.js>>>Developer wants the backend use the localhost database.'));
    databaseConfig = {
        connectionString: process.env.DATABASE_URL_LOCAL
    };
    console.log(chalk.magenta('config.js>>>Obtain ADMIN SMTP credentials from ENV file'));
    smtpAccountConfig={
        userEmail :process.env.SMTP_ADMIN_USER_EMAIL,
        userPassword :process.env.SMTP_ADMIN_USER_PASSWORD,
     };
}
console.log(chalk.magenta('config.js>>>Inspect database connection string:'));
console.log(chalk.magenta(util.inspect(databaseConfig)));
module.exports = {
    databaseConfig,
    smtpAccountConfig
}
