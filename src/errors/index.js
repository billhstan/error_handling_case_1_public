const BaseError = require('./baseError');
const DataError = require('./dataError');
const InternalError = require('./internalError');
module.exports = {
    ...BaseError,
    ...DataError,
    ...InternalError
};