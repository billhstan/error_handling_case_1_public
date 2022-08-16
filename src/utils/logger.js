const path = require('path');
const winston = require('winston');

// default log levels
// winston.config.npm.levels;

const dirname = path.resolve(
    process.cwd(),
    'logs'
);

const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'error',
            format: fileFormat,
            filename: 'error.log',
            dirname
        }),
         new winston.transports.File({
            format: fileFormat,
            filename: 'combined.log',
            dirname
        }),
        new winston.transports.File({
            level: 'http',
            filename: 'info.log',
            format: fileFormat,
            dirname
        })
    ]
});

module.exports = logger;
