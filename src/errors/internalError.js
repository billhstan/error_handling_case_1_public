const { BaseError } = require('./baseError');
//InternalError
//This class has an additional class member, devNote
//Programmer can write additional comments through this member .
//The toLog will record down the devNote content. The toJson logic should never 
//use this devNote as part of the response content to the client.
class InternalError extends BaseError {
    constructor({devNote='',originalError=null,unexpectedError=true}) {
        super();
        super.name = "InternalError";
        super.message = "An error has occurred in the application.";
        
        super.httpStatusCode = 500;
        super.originalError = originalError;
        super.unexpectedError = unexpectedError;
        //Reference: https://www.bugsnag.com/blog/anatomy-of-a-javascript-error
        // the next line is important so that the ValidationError constructor is not part
        //of the resulting stacktrace
        //https://www.youtube.com/watch?v=45Zus_IEwJI
        //https://youtu.be/WyAx-YkCyfU?t=159
        //Error.captureStackTrace(this, InternalError);
        this.devNote = devNote;
    }

        toLog() {
            return ({
               ...super.toLog(),
               devNote:this.devNote
            });
        }
}

module.exports = { InternalError };