const { BaseError } = require('./baseError');
//BusinessRuleError
class BusinessRuleError {
    constructor({message}) {
        this.name = 'BusinessRuleError';
        this.message =message;
    }
}//End of BusinessRuleError class definition

//ParameterError
//Incorrect date format etc.
//All inputs are required for the constructor when you create a 
//ParameterError object
class ParameterError {
    constructor({parameter,value,message}) {
        this.name = 'ParameterError';
        this.value ={parameter:parameter,value:value} //e.g. {parameter:'Admission id',value:'ABC'}
        this.message = message; //e.g. The admission id must be 7 digits. Invalid admission id format
    }
}//End of ParameterError class definition

//DuplicateError
//Note that Duplicate Error incidents are usually detected by the database engine.
//Why does this class exist? (1)Because this occurs frequently when certain database constraint rules
//are violated (e.g.User email should be unique and not repeated).
//(2) Because need to standardize each developer team members' response content 
//structure and feedback messages
//to the client side so that client-side code can handle them consistently.

//About DuplicateError class constructor: The parameter input must have a value.
//The constructor logic uses this parameter input to build a message.
//Side note: Some developers might find it difficult to supply the value due to 
//certain code structure. Therefore, minimally still need to describe 
//the parameter name that caused the operational error.(e.g. mobile number etc.)
class DuplicateError  {
    constructor({parameter,  value = null}) {
        this.name = 'DuplicateError';
        this.message = `The ${parameter} has already been used.`;
        this.value = (value)?value:'';
    }
}

//DataError
class DataError extends BaseError {
    //DataError class has additional errors instance property.
    //The errors instance property was prepared to reference an Array of objects which
    //can be instances of DuplicateError, ParameterError, BusinessRuleError
    constructor({message='Invalid input(s)', errors = null, originalError=null,unexpectedError=false}) {
        super();
        super.name = 'DataError';
        super.message = message;
        super.httpStatusCode = 400;
        super.unexpectedError=unexpectedError;//Should be false if your code is able to detect and describe the error
        super.originalError = originalError;
        //Regarding this.errors: (When to use them)
        //Accumulate custom error or error type objects inside the errors, 
        //when you want to comunicate these information to the client-side. Because the 
        //logic inside the toJSON includes the errors property when building up the content
        //which will be called by the backend logic error handler middleware to send a response.
        this.errors = errors;
  
        //Reference: https://www.bugsnag.com/blog/anatomy-of-a-javascript-error
        // the next line is important so that the DataError constructor is not part
        //of the resulting stacktrace
        //https://www.youtube.com/watch?v=45Zus_IEwJI
        //https://youtu.be/WyAx-YkCyfU?t=159
         Error.captureStackTrace(this, DataError);

    }//constructor
    toLog() {
        return ({
           ...super.toLog(),
           errors: this.errors,
           devNote:this.devNote
        });
    }
    //https://youtu.be/_D6ilsRB9tw?t=265
    //Video reference for understanding that toJSON and toLog are just methods (functions)
    toJSON() {
        return ({
           ...super.toJSON(),
           errors:this.errors
        });
    }
}//End of DataError class definition

module.exports = { ParameterError, DuplicateError,DataError,BusinessRuleError };