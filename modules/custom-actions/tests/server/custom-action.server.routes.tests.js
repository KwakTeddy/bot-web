'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CustomAction = mongoose.model('CustomAction'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, customAction;

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
      customAction = {
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
        agent.post('/api/customActions')
          .send(customAction)
          .expect(200)
          .end(function (customActionSaveErr, customActionSaveRes) {
            // Handle Custom action save error
            if (customActionSaveErr) {
              return done(customActionSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/customActions')
              .end(function (customActionsGetErr, customActionsGetRes) {
                // Handle Custom action save error
                if (customActionsGetErr) {
                  return done(customActionsGetErr);
                }

                // Get Custom actions list
                var customActions = customActionsGetRes.body;

                // Set assertions
                (customActions[0].user._id).should.equal(userId);
                (customActions[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/customActions')
      .send(customAction)
      .expect(403)
      .end(function (customActionSaveErr, customActionSaveRes) {
        // Call the assertion callback
        done(customActionSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    customAction.name = '';

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
        agent.post('/api/customActions')
          .send(customAction)
          .expect(400)
          .end(function (customActionSaveErr, customActionSaveRes) {
            // Set message assertion
            (customActionSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(customActionSaveErr);
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
        agent.post('/api/customActions')
          .send(customAction)
          .expect(200)
          .end(function (customActionSaveErr, customActionSaveRes) {
            // Handle Custom action save error
            if (customActionSaveErr) {
              return done(customActionSaveErr);
            }

            // Update Custom action name
            customAction.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/customActions/' + customActionSaveRes.body._id)
              .send(customAction)
              .expect(200)
              .end(function (customActionUpdateErr, customActionUpdateRes) {
                // Handle Custom action update error
                if (customActionUpdateErr) {
                  return done(customActionUpdateErr);
                }

                // Set assertions
                (customActionUpdateRes.body._id).should.equal(customActionSaveRes.body._id);
                (customActionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var customActionObj = new CustomAction(customAction);

    // Save the customAction
    customActionObj.save(function () {
      // Request Custom actions
      request(app).get('/api/customActions')
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
    var customActionObj = new CustomAction(customAction);

    // Save the Custom action
    customActionObj.save(function () {
      request(app).get('/api/customActions/' + customActionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', customAction.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/customActions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/customActions/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/customActions')
          .send(customAction)
          .expect(200)
          .end(function (customActionSaveErr, customActionSaveRes) {
            // Handle Custom action save error
            if (customActionSaveErr) {
              return done(customActionSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/customActions/' + customActionSaveRes.body._id)
              .send(customAction)
              .expect(200)
              .end(function (customActionDeleteErr, customActionDeleteRes) {
                // Handle customAction error error
                if (customActionDeleteErr) {
                  return done(customActionDeleteErr);
                }

                // Set assertions
                (customActionDeleteRes.body._id).should.equal(customActionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    customAction.user = user;

    // Create new Custom action model instance
    var customActionObj = new CustomAction(customAction);

    // Save the Custom action
    customActionObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/customActions/' + customActionObj._id)
        .expect(403)
        .end(function (customActionDeleteErr, customActionDeleteRes) {
          // Set message assertion
          (customActionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(customActionDeleteErr);
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
          agent.post('/api/customActions')
            .send(customAction)
            .expect(200)
            .end(function (customActionSaveErr, customActionSaveRes) {
              // Handle Custom action save error
              if (customActionSaveErr) {
                return done(customActionSaveErr);
              }

              // Set assertions on new Custom action
              (customActionSaveRes.body.name).should.equal(customAction.name);
              should.exist(customActionSaveRes.body.user);
              should.equal(customActionSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/customActions/' + customActionSaveRes.body._id)
                      .expect(200)
                      .end(function (customActionInfoErr, customActionInfoRes) {
                        // Handle Custom action error
                        if (customActionInfoErr) {
                          return done(customActionInfoErr);
                        }

                        // Set assertions
                        (customActionInfoRes.body._id).should.equal(customActionSaveRes.body._id);
                        (customActionInfoRes.body.name).should.equal(customAction.name);
                        should.equal(customActionInfoRes.body.user, undefined);

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
      CustomAction.remove().exec(done);
    });
  });
});
