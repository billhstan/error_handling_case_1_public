const nodemailer = require('nodemailer');
const {smtpAccountConfig} = require('../../config')
//****************************************************************** */
//Caution: The code below is used in index.js file.
//The code below, sendFatalErrorEmail is not well polished.
//Refer to many Github  resources on automated email coding patterns and email technical concepts
//to polish the code for better reusability and maintenance.
//Good coding ideas when comes to preparing automated email functionalities
//https://github.com/panshak/accountill/blob/master/server/controllers/clients.js
//****************************************************************** */

module.exports.sendFatalErrorEmail=({recipientEmail,emailSubject,errorDetails})=>{
  					//The code here generates a UTC date time
					//Then, the UTC date time is converted to local time
					//By right, should not convert to local time because the local time conversion
					//is based on the production server (the code is running at hosted region in USA)
					//Therefore, it should have remained UTC date time format.
					const utcInString = new Date().toISOString(); // '2022-01-15T11:02:17Z';
					const utcDateTime = new Date(utcInString);
					// 👇️ "Sat Jan 15 2022 13:02:17 GMT+0200 (Eastern European Standard Time)"
					// ✅ Convert to Local time
					const localDateTime = utcDateTime.toLocaleString(); // 👉️ "1/15/2022, 1:02:17 PM"
					// Create the transporter with the required configuration for Outlook
					// Use your own personal outlook user email and password !
					const transportOutlook = nodemailer.createTransport({
						pool: true,
						host: 'smtp-mail.outlook.com',
						secureConnection: false,
						maxConnections: 1,
						port: 587,
						auth: {
							user: smtpAccountConfig.userEmail,
							pass: smtpAccountConfig.userPassword,
						},
						secure: false, // use SSL
						tls: {
							ciphers: 'SSLv3',
							rejectUnauthorized: false,
						},
					});
					const transportMailtrap = nodemailer.createTransport({
						host: 'smtp.mailtrap.io',
						port: 587,
                        ignoreTLS:true,
                        direct:true,
						secure: false, 
                        //secureConnection: false,
						auth: {
							user: smtpAccountConfig.userEmail,
							pass: smtpAccountConfig.userPassword,
						},
						tls: {
							rejectUnauthorized:  false,
						},
                       //debug: true, // show debug output
                       //logger: true // log information in console
					});
					const mailOptions = {
						from: smtpAccountConfig.userEmail,
						to: recipientEmail,
						subject: emailSubject,
						/*        text: ' ',
						 */ html: `Hello, some time at ${localDateTime}<br><b>Internship coordination system has an error. The error details are:</b><br>
              [errorDetails.message] is evaluated by JS engine as  : ${errorDetails.message}  <br />
              [errorDetails.stack] is evaluated by JS engine as:  ${errorDetails.stack}  `,
					};
					//If you have prepared outlook credentials inside the ENV file and
					//would like to check out the effects. Switch between the two command below.
					const transport = transportMailtrap;
					//const transport = transportOutlook;
					transport.sendMail(mailOptions, function (error, info) {
						if (error) {
							console.log('mail.js>>>[error] is ' + error);
							transport.close();
							
						} else {
							console.log('mail.js>>>email sent [info.response] gives :\n ' + info.response);
							transport.close();
							
						}
					});
}//End of sendFatalErrorEmail




/*************************DON'T USE PROMISE **************************** */

module.exports.sendFatalErrorEmailOld=({recipientEmail,emailSubject,errorDetails})=>{
    console.log('transport.sendMail>>>[started]');
    return new Promise((resolve,reject)=>{
					//The code here generates a UTC date time
					//Then, the UTC date time is converted to local time
					//By right, should not convert to local time because the local time conversion
					//is based on the production server (the code is running at hosted region in USA)
					//Therefore, it should have remained UTC date time format.
					const utcInString = new Date().toISOString(); // '2022-01-15T11:02:17Z';
					const utcDateTime = new Date(utcInString);
					// 👇️ "Sat Jan 15 2022 13:02:17 GMT+0200 (Eastern European Standard Time)"
					// ✅ Convert to Local time
					const localDateTime = utcDateTime.toLocaleString(); // 👉️ "1/15/2022, 1:02:17 PM"
					// Create the transporter with the required configuration for Outlook
					// Use your own personal outlook user email and password !
					const transportOutlook = nodemailer.createTransport({
						pool: true,
						host: 'smtp-mail.outlook.com',
						secureConnection: false,
						maxConnections: 1,
						port: 587,
						auth: {
							user: smtpAccountConfig.userEmail,
							pass: smtpAccountConfig.userPassword,
						},
						secure: false, // use SSL
						tls: {
							ciphers: 'SSLv3',
							rejectUnauthorized: false,
						},
					});
        
                    const transportMailtrap = nodemailer.createTransport({
						host: 'smtp.mailtrap.io',
						port: 587,
                        ignoreTLS:true,
                        direct:true,
						secure: false, 
                        //secureConnection: false,
						auth: {
							user: smtpAccountConfig.userEmail,
							pass: smtpAccountConfig.userPassword,
						},
						tls: {
							rejectUnauthorized:  false,
						},
                       //debug: true, // show debug output
                       //logger: true // log information in console
					});

					const mailOptions = {
						from: smtpAccountConfig.userEmail,
						to: recipientEmail,
						subject: emailSubject,
						/*        text: ' ',
						 */ html: `Hello, some time at ${localDateTime}<br><b>Internship coordination system has an error. The error details are:</b><br>
              [errorDetails.message] is evaluated by JS engine as  : ${errorDetails.message}  <br />
              [errorDetails.stack] is evaluated by JS engine as:  ${errorDetails.stack}  `,
					};
					//If you have prepared outlook credentials inside the ENV file and
					//would like to check out the effects. Switch between the two command below.
					const transport = transportMailtrap;
					//const transport = transportOutlook;
					transport.sendMail(mailOptions, function (error, info) {
                        
						if (error) {
							console.log('mail.js>>>[error] is ' + error);
							transport.close();
							reject(false); // or use rejcet(false) but then you will have to handle errors
						} else {
							console.log('mail.js>>>email sent [info.response] gives :\n ' + info.response);
							transport.close();
							resolve(true);
						}
					});
				})  
}//End of sendFatalErrorEmailOld

