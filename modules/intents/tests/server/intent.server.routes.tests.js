'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Intent = mongoose.model('Intent'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, intent;

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
      intent = {
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
        agent.post('/api/intents')
          .send(intent)
          .expect(200)
          .end(function (intentSaveErr, intentSaveRes) {
            // Handle Custom action save error
            if (intentSaveErr) {
              return done(intentSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/intents')
              .end(function (intentsGetErr, intentsGetRes) {
                // Handle Custom action save error
                if (intentsGetErr) {
                  return done(intentsGetErr);
                }

                // Get Custom actions list
                var intents = intentsGetRes.body;

                // Set assertions
                (intents[0].user._id).should.equal(userId);
                (intents[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/intents')
      .send(intent)
      .expect(403)
      .end(function (intentSaveErr, intentSaveRes) {
        // Call the assertion callback
        done(intentSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    intent.name = '';

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
        agent.post('/api/intents')
          .send(intent)
          .expect(400)
          .end(function (intentSaveErr, intentSaveRes) {
            // Set message assertion
            (intentSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(intentSaveErr);
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
        agent.post('/api/intents')
          .send(intent)
          .expect(200)
          .end(function (intentSaveErr, intentSaveRes) {
            // Handle Custom action save error
            if (intentSaveErr) {
              return done(intentSaveErr);
            }

            // Update Custom action name
            intent.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/intents/' + intentSaveRes.body._id)
              .send(intent)
              .expect(200)
              .end(function (intentUpdateErr, intentUpdateRes) {
                // Handle Custom action update error
                if (intentUpdateErr) {
                  return done(intentUpdateErr);
                }

                // Set assertions
                (intentUpdateRes.body._id).should.equal(intentSaveRes.body._id);
                (intentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var intentObj = new Intent(intent);

    // Save the intent
    intentObj.save(function () {
      // Request Custom actions
      request(app).get('/api/intents')
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
    var intentObj = new Intent(intent);

    // Save the Custom action
    intentObj.save(function () {
      request(app).get('/api/intents/' + intentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', intent.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/intents/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/intents/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/intents')
          .send(intent)
          .expect(200)
          .end(function (intentSaveErr, intentSaveRes) {
            // Handle Custom action save error
            if (intentSaveErr) {
              return done(intentSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/intents/' + intentSaveRes.body._id)
              .send(intent)
              .expect(200)
              .end(function (intentDeleteErr, intentDeleteRes) {
                // Handle intent error error
                if (intentDeleteErr) {
                  return done(intentDeleteErr);
                }

                // Set assertions
                (intentDeleteRes.body._id).should.equal(intentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    intent.user = user;

    // Create new Custom action model instance
    var intentObj = new Intent(intent);

    // Save the Custom action
    intentObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/intents/' + intentObj._id)
        .expect(403)
        .end(function (intentDeleteErr, intentDeleteRes) {
          // Set message assertion
          (intentDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(intentDeleteErr);
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
          agent.post('/api/intents')
            .send(intent)
            .expect(200)
            .end(function (intentSaveErr, intentSaveRes) {
              // Handle Custom action save error
              if (intentSaveErr) {
                return done(intentSaveErr);
              }

              // Set assertions on new Custom action
              (intentSaveRes.body.name).should.equal(intent.name);
              should.exist(intentSaveRes.body.user);
              should.equal(intentSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/intents/' + intentSaveRes.body._id)
                      .expect(200)
                      .end(function (intentInfoErr, intentInfoRes) {
                        // Handle Custom action error
                        if (intentInfoErr) {
                          return done(intentInfoErr);
                        }

                        // Set assertions
                        (intentInfoRes.body._id).should.equal(intentSaveRes.body._id);
                        (intentInfoRes.body.name).should.equal(intent.name);
                        should.equal(intentInfoRes.body.user, undefined);

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
      Intent.remove().exec(done);
    });
  });
});