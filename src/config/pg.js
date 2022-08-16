var Pool = require('pg-pool');
const {databaseConfig} = require('../../config');
const chalk = require('chalk');
const logger = require('../utils/logger');
//When hosting database at heroku, the setup is different.
//Because heroku gives a database url for each database you have created and it has a format.
//It provide convenience on db connection. Therefore, need to study the format as adviced by the official doc in pg library github
//to use it effectively. Sample db url given by heroku is shown below: (delimited by using [:] and [@] and [/])
//postgres://xrfrjegrvtwcro:a64818d3529f3d5e8adf9accb029a1333f956ae9711bfa0f501e93a26c6eb932@ec2-100-26-39-41.compute-1.amazonaws.com:5432/d3c4iqrei6fr4e
//As a result, I prefer to setup my local computer database information as:
//postgres://errorhandling_db_admin:pasword@localhost:5432/errorhandling_db

const pool = new Pool(databaseConfig); //According to some online resources, this has already started a new pool

//https://stackoverflow.com/questions/50497583/when-to-disconnect-and-when-to-end-a-pg-client-or-pool
//The online discussion above is important. I forgot to handle pool errors.
//The following code is not well polished.
pool.on('error', (error, client) => {
    console.error(chalk.red.bold('Pool has error '), error) // Your callback here
    process.exit(-1)
  });
//The following statement which tries to create a pool won't work (tested)
//const pool = new Pool('postgress://errorhandling_db_admin:password@localhost:5432/errorhandling_db');
module.exports = { pool };