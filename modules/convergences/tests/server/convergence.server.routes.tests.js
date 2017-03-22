'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Convergence = mongoose.model('Convergence'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  convergence;

/**
 * Convergence routes tests
 */
describe('Convergence CRUD tests', function () {

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

    // Save a user to the test db and create new Convergence
    user.save(function () {
      convergence = {
        name: 'Convergence name'
      };

      done();
    });
  });

  it('should be able to save a Convergence if logged in', function (done) {
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

        // Save a new Convergence
        agent.post('/api/convergences')
          .send(convergence)
          .expect(200)
          .end(function (convergenceSaveErr, convergenceSaveRes) {
            // Handle Convergence save error
            if (convergenceSaveErr) {
              return done(convergenceSaveErr);
            }

            // Get a list of Convergences
            agent.get('/api/convergences')
              .end(function (convergencesGetErr, convergencesGetRes) {
                // Handle Convergences save error
                if (convergencesGetErr) {
                  return done(convergencesGetErr);
                }

                // Get Convergences list
                var convergences = convergencesGetRes.body;

                // Set assertions
                (convergences[0].user._id).should.equal(userId);
                (convergences[0].name).should.match('Convergence name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Convergence if not logged in', function (done) {
    agent.post('/api/convergences')
      .send(convergence)
      .expect(403)
      .end(function (convergenceSaveErr, convergenceSaveRes) {
        // Call the assertion callback
        done(convergenceSaveErr);
      });
  });

  it('should not be able to save an Convergence if no name is provided', function (done) {
    // Invalidate name field
    convergence.name = '';

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

        // Save a new Convergence
        agent.post('/api/convergences')
          .send(convergence)
          .expect(400)
          .end(function (convergenceSaveErr, convergenceSaveRes) {
            // Set message assertion
            (convergenceSaveRes.body.message).should.match('Please fill Convergence name');

            // Handle Convergence save error
            done(convergenceSaveErr);
          });
      });
  });

  it('should be able to update an Convergence if signed in', function (done) {
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

        // Save a new Convergence
        agent.post('/api/convergences')
          .send(convergence)
          .expect(200)
          .end(function (convergenceSaveErr, convergenceSaveRes) {
            // Handle Convergence save error
            if (convergenceSaveErr) {
              return done(convergenceSaveErr);
            }

            // Update Convergence name
            convergence.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Convergence
            agent.put('/api/convergences/' + convergenceSaveRes.body._id)
              .send(convergence)
              .expect(200)
              .end(function (convergenceUpdateErr, convergenceUpdateRes) {
                // Handle Convergence update error
                if (convergenceUpdateErr) {
                  return done(convergenceUpdateErr);
                }

                // Set assertions
                (convergenceUpdateRes.body._id).should.equal(convergenceSaveRes.body._id);
                (convergenceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Convergences if not signed in', function (done) {
    // Create new Convergence model instance
    var convergenceObj = new Convergence(convergence);

    // Save the convergence
    convergenceObj.save(function () {
      // Request Convergences
      request(app).get('/api/convergences')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Convergence if not signed in', function (done) {
    // Create new Convergence model instance
    var convergenceObj = new Convergence(convergence);

    // Save the Convergence
    convergenceObj.save(function () {
      request(app).get('/api/convergences/' + convergenceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', convergence.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Convergence with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/convergences/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Convergence is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Convergence which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Convergence
    request(app).get('/api/convergences/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Convergence with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Convergence if signed in', function (done) {
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

        // Save a new Convergence
        agent.post('/api/convergences')
          .send(convergence)
          .expect(200)
          .end(function (convergenceSaveErr, convergenceSaveRes) {
            // Handle Convergence save error
            if (convergenceSaveErr) {
              return done(convergenceSaveErr);
            }

            // Delete an existing Convergence
            agent.delete('/api/convergences/' + convergenceSaveRes.body._id)
              .send(convergence)
              .expect(200)
              .end(function (convergenceDeleteErr, convergenceDeleteRes) {
                // Handle convergence error error
                if (convergenceDeleteErr) {
                  return done(convergenceDeleteErr);
                }

                // Set assertions
                (convergenceDeleteRes.body._id).should.equal(convergenceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Convergence if not signed in', function (done) {
    // Set Convergence user
    convergence.user = user;

    // Create new Convergence model instance
    var convergenceObj = new Convergence(convergence);

    // Save the Convergence
    convergenceObj.save(function () {
      // Try deleting Convergence
      request(app).delete('/api/convergences/' + convergenceObj._id)
        .expect(403)
        .end(function (convergenceDeleteErr, convergenceDeleteRes) {
          // Set message assertion
          (convergenceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Convergence error error
          done(convergenceDeleteErr);
        });

    });
  });

  it('should be able to get a single Convergence that has an orphaned user reference', function (done) {
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

          // Save a new Convergence
          agent.post('/api/convergences')
            .send(convergence)
            .expect(200)
            .end(function (convergenceSaveErr, convergenceSaveRes) {
              // Handle Convergence save error
              if (convergenceSaveErr) {
                return done(convergenceSaveErr);
              }

              // Set assertions on new Convergence
              (convergenceSaveRes.body.name).should.equal(convergence.name);
              should.exist(convergenceSaveRes.body.user);
              should.equal(convergenceSaveRes.body.user._id, orphanId);

              // force the Convergence to have an orphaned user reference
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

                    // Get the Convergence
                    agent.get('/api/convergences/' + convergenceSaveRes.body._id)
                      .expect(200)
                      .end(function (convergenceInfoErr, convergenceInfoRes) {
                        // Handle Convergence error
                        if (convergenceInfoErr) {
                          return done(convergenceInfoErr);
                        }

                        // Set assertions
                        (convergenceInfoRes.body._id).should.equal(convergenceSaveRes.body._id);
                        (convergenceInfoRes.body.name).should.equal(convergence.name);
                        should.equal(convergenceInfoRes.body.user, undefined);

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
      Convergence.remove().exec(done);
    });
  });
});
