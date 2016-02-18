'use strict';

var zlib = require('zlib');
var crypto = require('crypto');

var URLSafeBase64 = require('urlsafe-base64');

/**
 * Creates a urlCrypte encoder/decoder.
 *
 * var urlCrypt = require('url-crypt')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');  // sensible defaults
 * 
 * var data = { hello: 'world', this: 'is a test', of: 'url-crypt' };
 * var base64 = urlCrypt.cryptObj(data);
 * var backAgain = urlCrypt.decryptObj(base64);
 * expect(backAgain).to.eql(data);
 * 
 * @param  {string} key         super secret random string
 * @param  {number} saltBytes   number of salt bytes to add to token: default (30+key.length%5)
 * @param  {number} iterations  pbkdf2 iterations: default (10000+key.length%5)
 * @return {object}             object with cryptObj() and decryptObj()
 */
module.exports = function (password, saltBytes) {

  // Configuration
  var urlCrypt = { 
    password: password,
    saltBytes: saltBytes || 32,
  };

  if (password.length < 43) throw new Error('Please use base64 password with at least 43 characters.  Google password "password generator" and don\'t be lazy.');

  /**
   * Encrypt a Javascript object.
   * 
   * Obj -> json -> [salt][gzip] -> [aes-256-cbc] -> urlsafe-base64
   * 
   * @param  {object} pojo Object to JSON.stringify()
   * @return {string}      urlsafe-base64 of encrypted object.
   */
  urlCrypt.cryptObj = function(pojo){
    // Make JSON
    var data = JSON.stringify(pojo);
    // Compress data w/ GZip
    var gzip = zlib.gzipSync(data);
    // Salt - this is to prevent attacking the encryption by passing a known payload.
    var salt = crypto.randomBytes(urlCrypt.saltBytes);
    var buffer = Buffer.concat([salt,gzip]);
    // Encrypt - urlCrypt.password has 256 bits of randomness
    var cipher = crypto.createCipher('aes-256-cbc', urlCrypt.password);
    buffer = Buffer.concat([cipher.update(buffer), cipher.final()]);      
    // Encode as urlSafeBase64
    var ret = URLSafeBase64.encode(buffer);
    return ret;
  };
   
  /**
   * Decrypt a Javascript object.
   * 
   * Obj <- json <- [salt][gzip] <- [aes-256-cbc] <- urlsafe-base64
   * 
   * @param  {string} urlSafeBase64 string to decrypt
   * @return {object}               we're back!
   */
  urlCrypt.decryptObj = function(urlSafeBase64){
    // Decode
    var buffer = URLSafeBase64.decode(urlSafeBase64);
    // Decrypt
    var decipher = crypto.createDecipher('aes-256-cbc', urlCrypt.password);
    buffer = Buffer.concat([decipher.update(buffer), decipher.final()]);
    // Remove and discard salt
    buffer = buffer.slice(urlCrypt.saltBytes);
    // Decompress
    buffer = zlib.gunzipSync(buffer);
    // convert to buffer to string  
    var data = buffer.toString('utf8');
    // Parse and return
    var ret = JSON.parse(data);
    return ret;
  };
 
  return urlCrypt;
};
