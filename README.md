# url-crypt

This module was written by [Michael J Cole](https://github.com/MichaelJCole/url-crypt) who removed it for I don't know what reason. 

## json -> compressed encrypted url-safe base64 strings.

## In a nutshell:

Take a javascript object.

  - convert it to json
  - gzip the json
  - encrypt the gzip
  - convert encrypted to url-safe base64 string

and back again.

## Why?

Inspired by [this great article](https://neosmart.net/blog/2015/using-hmac-signatures-to-avoid-database-writes/)

You can send someone encrypted data.  If they don't have the key, they can't tamper with it.

When they give it back you can decrypt it.

Skip the database for email verification.  See example server below.

## Use

```
npm install url-crypt
```

then:

```
var urlCrypt = require('url-crypt')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');

// Get some data
var data = { hello: 'world', this: 'is a test', of: 'url-crypt' };

// Encrypt your data
var base64 = urlCrypt.cryptObj(data);

// Give it to someone.  It's encrypted so they can't tamper with it
// You weren't lazy about your app key were you?

// Get it back
var backAgain = urlCrypt.decryptObj(base64);

// Expectations
// expect(backAgain).to.eql(data);
```


## Caveats

  - URL's should be < 2000 characters.  Keep it simple.
  - This library uses Node.js v0.12.0 for the sync zlib functions.  Patches welcome to make it work with older versions.


## Example: database-less email verification.

It's not necessary to store email verification data in the database.  The verification link is information you gave the user through their email.  

You only need to verify the information is untampered with, and not faked.

You can do this by encrypting information into the verification link.  `url-crypt` is a Node.js package that facilitates this.

Below is a database-less email verification server.

  1. Paste the code below into example.js
  2. `npm install express url-crypt`
  3. `node example.js`

```
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
```

## Tests

`npm install && npm test`

## Options and parameters.

See [index.js](https://github.com/vallettea/url-crypt/blob/master/index.js) for parameters and explanation of the code.