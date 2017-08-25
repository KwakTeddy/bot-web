'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  MenuNavigation = mongoose.model('MenuNavigation'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  menuNavigation;

/**
 * Menu navigation routes tests
 */
describe('Menu navigation CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Menu navigation
    user.save(function () {
      menuNavigation = {
        name: 'Menu navigation name'
      };

      done();
    });
  });

  it('should be able to save a Menu navigation if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Menu navigation
        agent.post('/api/menuNavigations')
          .send(menuNavigation)
          .expect(200)
          .end(function (menuNavigationSaveErr, menuNavigationSaveRes) {
            // Handle Menu navigation save error
            if (menuNavigationSaveErr) {
              return done(menuNavigationSaveErr);
            }

            // Get a list of Menu navigations
            agent.get('/api/menuNavigations')
              .end(function (menuNavigationsGetErr, menuNavigationsGetRes) {
                // Handle Menu navigations save error
                if (menuNavigationsGetErr) {
                  return done(menuNavigationsGetErr);
                }

                // Get Menu navigations list
                var menuNavigations = menuNavigationsGetRes.body;

                // Set assertions
                (menuNavigations[0].user._id).should.equal(userId);
                (menuNavigations[0].name).should.match('Menu navigation name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Menu navigation if not logged in', function (done) {
    agent.post('/api/menuNavigations')
      .send(menuNavigation)
      .expect(403)
      .end(function (menuNavigationSaveErr, menuNavigationSaveRes) {
        // Call the assertion callback
        done(menuNavigationSaveErr);
      });
  });

  it('should not be able to save an Menu navigation if no name is provided', function (done) {
    // Invalidate name field
    menuNavigation.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Menu navigation
        agent.post('/api/menuNavigations')
          .send(menuNavigation)
          .expect(400)
          .end(function (menuNavigationSaveErr, menuNavigationSaveRes) {
            // Set message assertion
            (menuNavigationSaveRes.body.message).should.match('Please fill Menu navigation name');

            // Handle Menu navigation save error
            done(menuNavigationSaveErr);
          });
      });
  });

  it('should be able to update an Menu navigation if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Menu navigation
        agent.post('/api/menuNavigations')
          .send(menuNavigation)
          .expect(200)
          .end(function (menuNavigationSaveErr, menuNavigationSaveRes) {
            // Handle Menu navigation save error
            if (menuNavigationSaveErr) {
              return done(menuNavigationSaveErr);
            }

            // Update Menu navigation name
            menuNavigation.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Menu navigation
            agent.put('/api/menuNavigations/' + menuNavigationSaveRes.body._id)
              .send(menuNavigation)
              .expect(200)
              .end(function (menuNavigationUpdateErr, menuNavigationUpdateRes) {
                // Handle Menu navigation update error
                if (menuNavigationUpdateErr) {
                  return done(menuNavigationUpdateErr);
                }

                // Set assertions
                (menuNavigationUpdateRes.body._id).should.equal(menuNavigationSaveRes.body._id);
                (menuNavigationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Menu navigations if not signed in', function (done) {
    // Create new Menu navigation model instance
    var menuNavigationObj = new MenuNavigation(menuNavigation);

    // Save the menuNavigation
    menuNavigationObj.save(function () {
      // Request Menu navigations
      request(app).get('/api/menuNavigations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Menu navigation if not signed in', function (done) {
    // Create new Menu navigation model instance
    var menuNavigationObj = new MenuNavigation(menuNavigation);

    // Save the Menu navigation
    menuNavigationObj.save(function () {
      request(app).get('/api/menuNavigations/' + menuNavigationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', menuNavigation.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Menu navigation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/menuNavigations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Menu navigation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Menu navigation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Menu navigation
    request(app).get('/api/menuNavigations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Menu navigation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Menu navigation if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Menu navigation
        agent.post('/api/menuNavigations')
          .send(menuNavigation)
          .expect(200)
          .end(function (menuNavigationSaveErr, menuNavigationSaveRes) {
            // Handle Menu navigation save error
            if (menuNavigationSaveErr) {
              return done(menuNavigationSaveErr);
            }

            // Delete an existing Menu navigation
            agent.delete('/api/menuNavigations/' + menuNavigationSaveRes.body._id)
              .send(menuNavigation)
              .expect(200)
              .end(function (menuNavigationDeleteErr, menuNavigationDeleteRes) {
                // Handle menuNavigation error error
                if (menuNavigationDeleteErr) {
                  return done(menuNavigationDeleteErr);
                }

                // Set assertions
                (menuNavigationDeleteRes.body._id).should.equal(menuNavigationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Menu navigation if not signed in', function (done) {
    // Set Menu navigation user
    menuNavigation.user = user;

    // Create new Menu navigation model instance
    var menuNavigationObj = new MenuNavigation(menuNavigation);

    // Save the Menu navigation
    menuNavigationObj.save(function () {
      // Try deleting Menu navigation
      request(app).delete('/api/menuNavigations/' + menuNavigationObj._id)
        .expect(403)
        .end(function (menuNavigationDeleteErr, menuNavigationDeleteRes) {
          // Set message assertion
          (menuNavigationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Menu navigation error error
          done(menuNavigationDeleteErr);
        });

    });
  });

  it('should be able to get a single Menu navigation that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Menu navigation
          agent.post('/api/menuNavigations')
            .send(menuNavigation)
            .expect(200)
            .end(function (menuNavigationSaveErr, menuNavigationSaveRes) {
              // Handle Menu navigation save error
              if (menuNavigationSaveErr) {
                return done(menuNavigationSaveErr);
              }

              // Set assertions on new Menu navigation
              (menuNavigationSaveRes.body.name).should.equal(menuNavigation.name);
              should.exist(menuNavigationSaveRes.body.user);
              should.equal(menuNavigationSaveRes.body.user._id, orphanId);

              // force the Menu navigation to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Menu navigation
                    agent.get('/api/menuNavigations/' + menuNavigationSaveRes.body._id)
                      .expect(200)
                      .end(function (menuNavigationInfoErr, menuNavigationInfoRes) {
                        // Handle Menu navigation error
                        if (menuNavigationInfoErr) {
                          return done(menuNavigationInfoErr);
                        }

                        // Set assertions
                        (menuNavigationInfoRes.body._id).should.equal(menuNavigationSaveRes.body._id);
                        (menuNavigationInfoRes.body.name).should.equal(menuNavigation.name);
                        should.equal(menuNavigationInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      MenuNavigation.remove().exec(done);
    });
  });
});
