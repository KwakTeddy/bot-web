'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserDialog = mongoose.model('UserDialog'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, userDialog;

/**
 * Bot user routes tests
 */
describe('Bot user CRUD tests', function () {

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

    // Save a user to the test db and create new Bot user
    user.save(function () {
      userDialog = {
        name: 'Bot user name'
      };

      done();
    });
  });

  it('should be able to save a Bot user if logged in', function (done) {
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

        // Save a new Bot user
        agent.post('/api/userDialogs')
          .send(userDialog)
          .expect(200)
          .end(function (userDialogSaveErr, userDialogSaveRes) {
            // Handle Bot user save error
            if (userDialogSaveErr) {
              return done(userDialogSaveErr);
            }

            // Get a list of Bot users
            agent.get('/api/userDialogs')
              .end(function (userDialogsGetErr, userDialogsGetRes) {
                // Handle Bot user save error
                if (userDialogsGetErr) {
                  return done(userDialogsGetErr);
                }

                // Get Bot users list
                var userDialogs = userDialogsGetRes.body;

                // Set assertions
                (userDialogs[0].user._id).should.equal(userId);
                (userDialogs[0].name).should.match('Bot user name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Bot user if not logged in', function (done) {
    agent.post('/api/userDialogs')
      .send(userDialog)
      .expect(403)
      .end(function (userDialogSaveErr, userDialogSaveRes) {
        // Call the assertion callback
        done(userDialogSaveErr);
      });
  });

  it('should not be able to save an Bot user if no name is provided', function (done) {
    // Invalidate name field
    userDialog.name = '';

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

        // Save a new Bot user
        agent.post('/api/userDialogs')
          .send(userDialog)
          .expect(400)
          .end(function (userDialogSaveErr, userDialogSaveRes) {
            // Set message assertion
            (userDialogSaveRes.body.message).should.match('Please fill Bot user name');

            // Handle Bot user save error
            done(userDialogSaveErr);
          });
      });
  });

  it('should be able to update an Bot user if signed in', function (done) {
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

        // Save a new Bot user
        agent.post('/api/userDialogs')
          .send(userDialog)
          .expect(200)
          .end(function (userDialogSaveErr, userDialogSaveRes) {
            // Handle Bot user save error
            if (userDialogSaveErr) {
              return done(userDialogSaveErr);
            }

            // Update Bot user name
            userDialog.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Bot user
            agent.put('/api/userDialogs/' + userDialogSaveRes.body._id)
              .send(userDialog)
              .expect(200)
              .end(function (userDialogUpdateErr, userDialogUpdateRes) {
                // Handle Bot user update error
                if (userDialogUpdateErr) {
                  return done(userDialogUpdateErr);
                }

                // Set assertions
                (userDialogUpdateRes.body._id).should.equal(userDialogSaveRes.body._id);
                (userDialogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Bot users if not signed in', function (done) {
    // Create new Bot user model instance
    var userDialogObj = new UserDialog(userDialog);

    // Save the userDialog
    userDialogObj.save(function () {
      // Request Bot users
      request(app).get('/api/userDialogs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Bot user if not signed in', function (done) {
    // Create new Bot user model instance
    var userDialogObj = new UserDialog(userDialog);

    // Save the Bot user
    userDialogObj.save(function () {
      request(app).get('/api/userDialogs/' + userDialogObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', userDialog.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Bot user with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userDialogs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bot user is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Bot user which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Bot user
    request(app).get('/api/userDialogs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Bot user with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Bot user if signed in', function (done) {
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

        // Save a new Bot user
        agent.post('/api/userDialogs')
          .send(userDialog)
          .expect(200)
          .end(function (userDialogSaveErr, userDialogSaveRes) {
            // Handle Bot user save error
            if (userDialogSaveErr) {
              return done(userDialogSaveErr);
            }

            // Delete an existing Bot user
            agent.delete('/api/userDialogs/' + userDialogSaveRes.body._id)
              .send(userDialog)
              .expect(200)
              .end(function (userDialogDeleteErr, userDialogDeleteRes) {
                // Handle userDialog error error
                if (userDialogDeleteErr) {
                  return done(userDialogDeleteErr);
                }

                // Set assertions
                (userDialogDeleteRes.body._id).should.equal(userDialogSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Bot user if not signed in', function (done) {
    // Set Bot user user
    userDialog.user = user;

    // Create new Bot user model instance
    var userDialogObj = new UserDialog(userDialog);

    // Save the Bot user
    userDialogObj.save(function () {
      // Try deleting Bot user
      request(app).delete('/api/userDialogs/' + userDialogObj._id)
        .expect(403)
        .end(function (userDialogDeleteErr, userDialogDeleteRes) {
          // Set message assertion
          (userDialogDeleteRes.body.message).should.match('User is not authorized');

          // Handle Bot user error error
          done(userDialogDeleteErr);
        });

    });
  });

  it('should be able to get a single Bot user that has an orphaned user reference', function (done) {
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

          // Save a new Bot user
          agent.post('/api/userDialogs')
            .send(userDialog)
            .expect(200)
            .end(function (userDialogSaveErr, userDialogSaveRes) {
              // Handle Bot user save error
              if (userDialogSaveErr) {
                return done(userDialogSaveErr);
              }

              // Set assertions on new Bot user
              (userDialogSaveRes.body.name).should.equal(userDialog.name);
              should.exist(userDialogSaveRes.body.user);
              should.equal(userDialogSaveRes.body.user._id, orphanId);

              // force the Bot user to have an orphaned user reference
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

                    // Get the Bot user
                    agent.get('/api/userDialogs/' + userDialogSaveRes.body._id)
                      .expect(200)
                      .end(function (userDialogInfoErr, userDialogInfoRes) {
                        // Handle Bot user error
                        if (userDialogInfoErr) {
                          return done(userDialogInfoErr);
                        }

                        // Set assertions
                        (userDialogInfoRes.body._id).should.equal(userDialogSaveRes.body._id);
                        (userDialogInfoRes.body.name).should.equal(userDialog.name);
                        should.equal(userDialogInfoRes.body.user, undefined);

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
      UserDialog.remove().exec(done);
    });
  });
});
