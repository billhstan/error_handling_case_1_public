const morgan = require('morgan');

const logger = require('../utils/logger');

// morgan outputs can be passed to winston
// https://coralogix.com/blog/complete-winston-logger-guide-with-hands-on-examples/
/*
module.exports = morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: {
        write: (str) => {
            logger.info(str);
        }
    }
});
*/

// Logs requests
module.exports = morgan(':remote-addr :url :method HTTP/:http-version :user-agent', {
    // https://github.com/expressjs/morgan#immediate
    immediate: true,
    stream: {
      write: (message) => {
        console.log(message);
        logger.info(message.trim());
      }
    }
  });