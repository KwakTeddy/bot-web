'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Franchise = mongoose.model('Franchise'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, franchise;

/**
 * Custom action routes tests
 */
describe('Custom action CRUD tests', function () {

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

    // Save a user to the test db and create new Custom action
    user.save(function () {
      franchise = {
        name: 'Custom action name'
      };

      done();
    });
  });

  it('should be able to save a Custom action if logged in', function (done) {
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

        // Save a new Custom action
        agent.post('/api/franchises')
          .send(franchise)
          .expect(200)
          .end(function (franchiseSaveErr, franchiseSaveRes) {
            // Handle Custom action save error
            if (franchiseSaveErr) {
              return done(franchiseSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/franchises')
              .end(function (franchisesGetErr, franchisesGetRes) {
                // Handle Custom action save error
                if (franchisesGetErr) {
                  return done(franchisesGetErr);
                }

                // Get Custom actions list
                var franchises = franchisesGetRes.body;

                // Set assertions
                (franchises[0].user._id).should.equal(userId);
                (franchises[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/franchises')
      .send(franchise)
      .expect(403)
      .end(function (franchiseSaveErr, franchiseSaveRes) {
        // Call the assertion callback
        done(franchiseSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    franchise.name = '';

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

        // Save a new Custom action
        agent.post('/api/franchises')
          .send(franchise)
          .expect(400)
          .end(function (franchiseSaveErr, franchiseSaveRes) {
            // Set message assertion
            (franchiseSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(franchiseSaveErr);
          });
      });
  });

  it('should be able to update an Custom action if signed in', function (done) {
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

        // Save a new Custom action
        agent.post('/api/franchises')
          .send(franchise)
          .expect(200)
          .end(function (franchiseSaveErr, franchiseSaveRes) {
            // Handle Custom action save error
            if (franchiseSaveErr) {
              return done(franchiseSaveErr);
            }

            // Update Custom action name
            franchise.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/franchises/' + franchiseSaveRes.body._id)
              .send(franchise)
              .expect(200)
              .end(function (franchiseUpdateErr, franchiseUpdateRes) {
                // Handle Custom action update error
                if (franchiseUpdateErr) {
                  return done(franchiseUpdateErr);
                }

                // Set assertions
                (franchiseUpdateRes.body._id).should.equal(franchiseSaveRes.body._id);
                (franchiseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var franchiseObj = new Franchise(franchise);

    // Save the franchise
    franchiseObj.save(function () {
      // Request Custom actions
      request(app).get('/api/franchises')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Custom action if not signed in', function (done) {
    // Create new Custom action model instance
    var franchiseObj = new Franchise(franchise);

    // Save the Custom action
    franchiseObj.save(function () {
      request(app).get('/api/franchises/' + franchiseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', franchise.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/franchises/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/franchises/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Custom action with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Custom action if signed in', function (done) {
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

        // Save a new Custom action
        agent.post('/api/franchises')
          .send(franchise)
          .expect(200)
          .end(function (franchiseSaveErr, franchiseSaveRes) {
            // Handle Custom action save error
            if (franchiseSaveErr) {
              return done(franchiseSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/franchises/' + franchiseSaveRes.body._id)
              .send(franchise)
              .expect(200)
              .end(function (franchiseDeleteErr, franchiseDeleteRes) {
                // Handle franchise error error
                if (franchiseDeleteErr) {
                  return done(franchiseDeleteErr);
                }

                // Set assertions
                (franchiseDeleteRes.body._id).should.equal(franchiseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    franchise.user = user;

    // Create new Custom action model instance
    var franchiseObj = new Franchise(franchise);

    // Save the Custom action
    franchiseObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/franchises/' + franchiseObj._id)
        .expect(403)
        .end(function (franchiseDeleteErr, franchiseDeleteRes) {
          // Set message assertion
          (franchiseDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(franchiseDeleteErr);
        });

    });
  });

  it('should be able to get a single Custom action that has an orphaned user reference', function (done) {
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

          // Save a new Custom action
          agent.post('/api/franchises')
            .send(franchise)
            .expect(200)
            .end(function (franchiseSaveErr, franchiseSaveRes) {
              // Handle Custom action save error
              if (franchiseSaveErr) {
                return done(franchiseSaveErr);
              }

              // Set assertions on new Custom action
              (franchiseSaveRes.body.name).should.equal(franchise.name);
              should.exist(franchiseSaveRes.body.user);
              should.equal(franchiseSaveRes.body.user._id, orphanId);

              // force the Custom action to have an orphaned user reference
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

                    // Get the Custom action
                    agent.get('/api/franchises/' + franchiseSaveRes.body._id)
                      .expect(200)
                      .end(function (franchiseInfoErr, franchiseInfoRes) {
                        // Handle Custom action error
                        if (franchiseInfoErr) {
                          return done(franchiseInfoErr);
                        }

                        // Set assertions
                        (franchiseInfoRes.body._id).should.equal(franchiseSaveRes.body._id);
                        (franchiseInfoRes.body.name).should.equal(franchise.name);
                        should.equal(franchiseInfoRes.body.user, undefined);

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
      Franchise.remove().exec(done);
    });
  });
});
