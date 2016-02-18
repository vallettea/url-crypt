'use strict';

/**
 * A simple database less email verificaiton server
 *
 *   node example.js 
 */

var port = 9876;

var express = require('express');
var app = express();

// Initialize with a 43 char base64 password.  Google 'password generator'
var urlCrypt = require('url-crypt')('~{ry*I)44==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');
var router = require('express').Router();

/** 
 * Send email verification link
 */
router.get('/emailLink/:email', function(req, res, next) {
  // Encrypt your data
  var payload = {
    email: req.params.email.toString(),
    date: new Date(),
    ip: req.ip,
  };
  var base64 = urlCrypt.cryptObj(payload);

  // make a link
  var registrationUrl = 'http://' + req.headers.host + '/register/checkLink/' + base64;

  // Send it by email
  var message = {
    message: {
      to: [{email: payload.email}],
      from_email: 'registration@example.com',
      subject: 'Emailification of Your Account',
      text: 'Paste the url below into your browser to Emailify!  ' + registrationUrl,
      html: '<a href="'+registrationUrl+'">Emailify now!</a>'
    }
  };
  /*
  var mandrill = require('node-mandrill')(config.mandrill.key);
  mandrill('/messages/send', {
    message: message
  }, function(error, response) {
    if (error) {
      console.log( JSON.stringify(error) );
      next(error);
    }
    return res.send('Email sent!');
  });
  */
 
  // Or just print to console.
  console.log('');
  console.log('*** /register/emailLink/:email ********************************************');
  console.log(message);
  return res.send('Link printed!  Click it!');
});

/** 
 * Given a link, validate it
 */
router.get('/checkLink/:base64', function(req, res) {

  var payload;

  try {
    payload =  urlCrypt.decryptObj(req.params.base64);
  } catch(e) {
    // The link was mangled or tampered with.  
    return res.status(400).send('Bad request.  Please check the link.');
  }

  // Payload was encrypted, so couldn't have been modified
  // Only people you gave it to can give it back.
  // If you emailed it to payload.email, then it's verified.
  // You can cross-check the payload.ip with req.ip
  // You can use payload.date to expire the verification

  console.log('');
  console.log('*** /register/checkLink/:base64 ********************************************');
  console.log('You are verified: ' + payload.email);
  console.log(payload);
  return res.send('You are verified!  Secret data you sent:' + JSON.stringify(payload));
});

app.use('/register', router);
app.listen(port); 
console.log('Emailification at http://localhost:' + port);
console.log('');
console.log('Try http://localhost:' + port + '/register/emailLink/email@example.com');