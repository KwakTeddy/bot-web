'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Dialogset = mongoose.model('Dialogset'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, dialogset;

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
      dialogset = {
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
        agent.post('/api/dialogsets')
          .send(dialogset)
          .expect(200)
          .end(function (dialogsetSaveErr, dialogsetSaveRes) {
            // Handle Custom action save error
            if (dialogsetSaveErr) {
              return done(dialogsetSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/dialogsets')
              .end(function (dialogsetsGetErr, dialogsetsGetRes) {
                // Handle Custom action save error
                if (dialogsetsGetErr) {
                  return done(dialogsetsGetErr);
                }

                // Get Custom actions list
                var dialogsets = dialogsetsGetRes.body;

                // Set assertions
                (dialogsets[0].user._id).should.equal(userId);
                (dialogsets[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/dialogsets')
      .send(dialogset)
      .expect(403)
      .end(function (dialogsetSaveErr, dialogsetSaveRes) {
        // Call the assertion callback
        done(dialogsetSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    dialogset.name = '';

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
        agent.post('/api/dialogsets')
          .send(dialogset)
          .expect(400)
          .end(function (dialogsetSaveErr, dialogsetSaveRes) {
            // Set message assertion
            (dialogsetSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(dialogsetSaveErr);
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
        agent.post('/api/dialogsets')
          .send(dialogset)
          .expect(200)
          .end(function (dialogsetSaveErr, dialogsetSaveRes) {
            // Handle Custom action save error
            if (dialogsetSaveErr) {
              return done(dialogsetSaveErr);
            }

            // Update Custom action name
            dialogset.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/dialogsets/' + dialogsetSaveRes.body._id)
              .send(dialogset)
              .expect(200)
              .end(function (dialogsetUpdateErr, dialogsetUpdateRes) {
                // Handle Custom action update error
                if (dialogsetUpdateErr) {
                  return done(dialogsetUpdateErr);
                }

                // Set assertions
                (dialogsetUpdateRes.body._id).should.equal(dialogsetSaveRes.body._id);
                (dialogsetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var dialogsetObj = new Dialogset(dialogset);

    // Save the dialogset
    dialogsetObj.save(function () {
      // Request Custom actions
      request(app).get('/api/dialogsets')
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
    var dialogsetObj = new Dialogset(dialogset);

    // Save the Custom action
    dialogsetObj.save(function () {
      request(app).get('/api/dialogsets/' + dialogsetObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', dialogset.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/dialogsets/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/dialogsets/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/dialogsets')
          .send(dialogset)
          .expect(200)
          .end(function (dialogsetSaveErr, dialogsetSaveRes) {
            // Handle Custom action save error
            if (dialogsetSaveErr) {
              return done(dialogsetSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/dialogsets/' + dialogsetSaveRes.body._id)
              .send(dialogset)
              .expect(200)
              .end(function (dialogsetDeleteErr, dialogsetDeleteRes) {
                // Handle dialogset error error
                if (dialogsetDeleteErr) {
                  return done(dialogsetDeleteErr);
                }

                // Set assertions
                (dialogsetDeleteRes.body._id).should.equal(dialogsetSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    dialogset.user = user;

    // Create new Custom action model instance
    var dialogsetObj = new Dialogset(dialogset);

    // Save the Custom action
    dialogsetObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/dialogsets/' + dialogsetObj._id)
        .expect(403)
        .end(function (dialogsetDeleteErr, dialogsetDeleteRes) {
          // Set message assertion
          (dialogsetDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(dialogsetDeleteErr);
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
          agent.post('/api/dialogsets')
            .send(dialogset)
            .expect(200)
            .end(function (dialogsetSaveErr, dialogsetSaveRes) {
              // Handle Custom action save error
              if (dialogsetSaveErr) {
                return done(dialogsetSaveErr);
              }

              // Set assertions on new Custom action
              (dialogsetSaveRes.body.name).should.equal(dialogset.name);
              should.exist(dialogsetSaveRes.body.user);
              should.equal(dialogsetSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/dialogsets/' + dialogsetSaveRes.body._id)
                      .expect(200)
                      .end(function (dialogsetInfoErr, dialogsetInfoRes) {
                        // Handle Custom action error
                        if (dialogsetInfoErr) {
                          return done(dialogsetInfoErr);
                        }

                        // Set assertions
                        (dialogsetInfoRes.body._id).should.equal(dialogsetSaveRes.body._id);
                        (dialogsetInfoRes.body.name).should.equal(dialogset.name);
                        should.equal(dialogsetInfoRes.body.user, undefined);

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
      Dialogset.remove().exec(done);
    });
  });
});
