'use strict';

var expect = require('chai').expect;
var util = require('util');

/**
 * Test /register/emailLink
 */
describe('urlCrypt', function() {

  it('should not take a weak password', function(done) {

    var urlCryptFunc = require('./index');

    // Throws error because wrong key
    expect(urlCryptFunc.bind('weak-key')).to.throw(Error);
    done();
  });

  it('should work on a string', function(done) {

    var data = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    var urlCrypt = require('./index')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');
    var urlCrypt2 = require('./index')('differenty*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');

    var encrypted = urlCrypt.cryptObj(data);

    // Same
    expect(urlCrypt.decryptObj(encrypted)).to.eql(data);
    // Throws error because wrong key
    expect(urlCrypt2.decryptObj.bind(urlCrypt2.decryptObj, encrypted)).to.throw(Error);
    done();
  });

  it('should work on a number', function(done) {

    var data = 42;

    var urlCrypt = require('./index')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');
    var urlCrypt2 = require('./index')('differenty*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');

    var encrypted = urlCrypt.cryptObj(data);

    // Same
    expect(urlCrypt.decryptObj(encrypted)).to.eql(data);
    // Throws error because wrong key
    expect(urlCrypt2.decryptObj.bind(urlCrypt2.decryptObj, encrypted)).to.throw(Error);
    done();
  });

  it('should work on a simple object', function(done) {

    var data = { hello: 'world', this: 'is a test', of: 'url-crypt' };

    var urlCrypt = require('./index')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');
    var urlCrypt2 = require('./index')('differenty*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');

    var encrypted = urlCrypt.cryptObj(data);

    // Same
    expect(urlCrypt.decryptObj(encrypted)).to.eql(data);
    // Throws error because wrong key
    expect(urlCrypt2.decryptObj.bind(urlCrypt2.decryptObj, encrypted)).to.throw(Error);
    done();
  });

  it('should work on a complex object', function(done) {

    var data = util.inspect(process);

    var urlCrypt = require('./index')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');
    var urlCrypt2 = require('./index')('differenty*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');

    var encrypted = urlCrypt.cryptObj(data);

    // Same
    expect(urlCrypt.decryptObj(encrypted)).to.eql(data);
    // Throws error because wrong key
    expect(urlCrypt2.decryptObj.bind(urlCrypt2.decryptObj, encrypted)).to.throw(Error);
    done();
  });

  it('fail same key, different salt bytes', function(done) {

    var data = util.inspect(process);

    var urlCrypt = require('./index')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF', 2);
    var urlCrypt2 = require('./index')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF', 3);

    var encrypted = urlCrypt.cryptObj(data);

    // Same
    expect(urlCrypt.decryptObj(encrypted)).to.eql(data);
    // Throws error because wrong key
    expect(urlCrypt2.decryptObj.bind(urlCrypt2.decryptObj, encrypted)).to.throw(Error);
    done();
  });

  it('should work with different encoders', function(done) {

    var data = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    var urlCrypt = require('./index')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');
    var urlCrypt2 = require('./index')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');

    var encrypted = urlCrypt.cryptObj(data);

    // Same
    expect(urlCrypt.decryptObj(encrypted)).to.eql(data);
    // Same
    expect(urlCrypt2.decryptObj(encrypted)).to.eql(data);
    done();
  });

});
