'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserDialog = mongoose.model('UserDialog');

/**
 * Globals
 */
var user, userDialog;

/**
 * Unit tests
 */
describe('Bot user Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      userDialog = new UserDialog({
        name: 'Bot user Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return userDialog.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      userDialog.name = '';

      return userDialog.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    UserDialog.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
