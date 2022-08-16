class BaseError extends Error {
    constructor(error=null) {
        super();
        Error.captureStackTrace(this, BaseError);
        this.originalError=error;
        //Regarding this.unexpectedError:
         //By default unexpectedError should be false. You need to explicitly set it to true when some circumstances.
        this.unexpectedError=false;
        this.name = 'BaseError';
        this.message = 'An error has occurred.';
        this.httpStatusCode = 400; //Default code shall be 400. Which is Bad Request.
        //When not sure on the date-time format, just go for UTC first.
        this.datetime = new Date().toISOString();//https://bobbyhadz.com/blog/javascript-get-current-date-and-time-in-utc
    }

    // For http response
    toJSON() {
        return ({
            ok: false,
            statusCode: this.httpStatusCode,
            message: this.message,
            errors:this.errors,
            datetime: this.datetime
        });
    }
    // for logging
    toLog() {
        let originalError = null;
//https://www.codegrepper.com/code-examples/javascript/escape+json+in+javascript
//I used the code sample given online, to ensure the stack property string value is properly escaped so that
//the entire error data can be viewed on a JSON viewer tool.
//Prepare the originalError content to be JSON friendly (No illegal characters).
        if (this.originalError) {
            originalError = {
                name: this.originalError.name ?? 'unknown',
                message: this.originalError.message ?? 'unknown',
                stack: this.originalError.stack.replace(/\\n/g, "\\n")
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, "\\&")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t")
                .replace(/\\b/g, "\\b")
                .replace(/\\f/g, "\\f")?? 'unknown',
                ...this.originalError
            };
        }
      
        
        return ({
            name: this.name,
            message: this.message,
            stack: this.stack,
            datetime: this.datetime,
            unexpectedError:this.unexpectedError,
            originalError
        });
    }
}//End of BaseError class

module.exports = { BaseError };