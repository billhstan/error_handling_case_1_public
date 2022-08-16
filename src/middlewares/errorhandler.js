//errorhandler.js
const chalk = require('chalk');
const E = require('../errors');
const logger = require('../utils/logger');
const util = require('util');

module.exports = (error, req, res, next) => {
    //Don't mutate the arguments
    //console.log(error);
    let err = error;

    for (const [key, value] of Object.entries(E)) {
     if (error instanceof value) {
      console.log(chalk.green('Able to identify the error type as '),key  );
     }
    }

    //Custom errors
    //Choose which type of error you wish to log it.

    if (error instanceof E.InternalError) {
        err = error;
        logger.error(err.toLog());
    }
    else if (error instanceof E.DataError) {
        err = error;
        logger.warn(err.toLog());
    }
    else if (error instanceof E.BaseError) {
        err = error;
        logger.error(err.toLog());
    }/* if the JavaScript engine executes the [else] block, likely it is a 
    pure JavaScript generated Error object which we don't expect to happen */
    else {
        err = new E.InternalError({originalError:error,unexpectedError:true,devNote:'Created at errorhandler.js'});
        logger.error(err.toLog());
    }


    // Check if there was already a response
    if (!res.headersSent) {
        res.status(err.httpStatusCode).send(err.toJSON());
    }

    // HACK for dev
    console.log(chalk.redBright(util.inspect(err,showHidden=false, depth=3, colorize=true)));
};

