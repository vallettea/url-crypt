'use strict';

// Initialize with a 43 char base64 password.  Google 'password generator'
var urlCrypt = require('url-crypt')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');

// Get some data
var data = { hello: 'world', this: 'is a test', of: 'url-crypt' };
console.log(data);

// Encrypt your data
var base64 = urlCrypt.cryptObj(data);
console.log(base64);

// Give it to someone.  It's encrypted so they can't tamper with it

// Get it back
var backAgain = urlCrypt.decryptObj(base64);
console.log(backAgain);

// Expectations
// expect(backAgain).to.eql(data);