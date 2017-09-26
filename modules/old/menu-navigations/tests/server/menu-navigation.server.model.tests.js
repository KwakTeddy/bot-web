'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  MenuNavigation = mongoose.model('MenuNavigation');

/**
 * Globals
 */
var user,
  menuNavigation;

/**
 * Unit tests
 */
describe('Menu navigation Model Unit Tests:', function() {
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
      menuNavigation = new MenuNavigation({
        name: 'Menu navigation Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return menuNavigation.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      menuNavigation.name = '';

      return menuNavigation.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    MenuNavigation.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
