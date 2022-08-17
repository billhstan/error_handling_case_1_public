//index.js
const logger = require('./src/utils/logger');
const process = require('process');
const app = require('./app');
const emailer = require('./src/utils/emailer');
//I did not set environment variable for PORT in Heroku, therefore it will be undefined
const PORT = process.env.PORT || 5001; 
//Send an email to the administrator. Notify the person that the server has started/restarted
emailer.sendServerStartedNotification({recipientEmail:'yogibear@applebanana.com',
emailSubject:'Internship Coordination System has started'});
app.listen(PORT, async(err) => {
    if (err) return console.log(`Cannot Listen on PORT: ${PORT}`);
    console.log(`Server is Listening on: http://localhost:${PORT}/`);
});

//Robust Error Handling in Node.js Applications -Lewis Ellis
//Source: https://youtu.be/7G3C8Y5tzw4?t=2158
 //https://help.heroku.com/D5GK0FHU/how-can-my-node-app-gracefully-shutdown-when-receiving-sigterm

 /*
  process
  .on('SIGTERM', shutdown('SIGTERM'))
  .on('SIGINT', shutdown('SIGINT'))
  .on('uncaughtException', shutdown('uncaughtException'));

  function shutdown (signal) {
    return async(error) => {
      console.log(`Dyno manager sent signal: ${ signal }...`);
      if (error) console.error(error.stack || error);
      console.error('UNCAUGHT EXCEPTION! 💥 Shutting down  ... ');
      console.error(error.message);
       await email.sendFatalErrorEmailOld({recipientEmail:'billhstan@yahoo.com.sg',
            emailSubject:'SYSTEM DOWN due to UNCAUGHT EXCEPTION',
            errorDetails:error});
      setTimeout(() => {
        console.log('...waited 8s, exiting.');
        process.exit(error ? 1 : 0);
      }, 8000).unref();
    };
  }
  */

  //******************************************************** */ 
 //The following logic requires further improvements.
 //The code below will does not aim to recover from a crash.
 //Just let it crash.
 //Additional code to email alert a person in charge has been
 //included inside the logic. Just an opportunity to learn abit about emailing features
 //in NodeJS.
 //******************************************************** */

  process.on('uncaughtException',  async (error) => {
     console.error(`UNCAUGHT EXCEPTION! 💥 Shutting down ...`);
     logger.error({message:`UNCAUGHT EXCEPTION! 💥Shutting down ...`,name:'UncaughtException'});
     logger.error(error);
     console.error(error.message);
    //Sending email to alert programmer when this situation happens is not going to work
    //when you host the project at AWS or Heroku platform. (although it works when you test in at localhost)
          // await email.sendFatalErrorEmailOld({recipientEmail:'billhstan@yahoo.com.sg',
         // emailSubject:`${process.env.NODE_ENV} SYSTEM DOWN due to UNCAUGHT EXCEPTION`,
         // errorDetails:error});
    process.exit(1);
  });
  
  //https://github.com/nodejs/node-v0.x-archive/issues/2677
  //To create a drama on memory leak, you can use chalk function inside the
  //event handler function for uncaughtException
 
 
  
  

