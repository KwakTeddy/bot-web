'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  BotUser = mongoose.model('BotUser'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, botUser;

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
      botUser = {
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
        agent.post('/api/botUsers')
          .send(botUser)
          .expect(200)
          .end(function (botUserSaveErr, botUserSaveRes) {
            // Handle Bot user save error
            if (botUserSaveErr) {
              return done(botUserSaveErr);
            }

            // Get a list of Bot users
            agent.get('/api/botUsers')
              .end(function (botUsersGetErr, botUsersGetRes) {
                // Handle Bot user save error
                if (botUsersGetErr) {
                  return done(botUsersGetErr);
                }

                // Get Bot users list
                var botUsers = botUsersGetRes.body;

                // Set assertions
                (botUsers[0].user._id).should.equal(userId);
                (botUsers[0].name).should.match('Bot user name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Bot user if not logged in', function (done) {
    agent.post('/api/botUsers')
      .send(botUser)
      .expect(403)
      .end(function (botUserSaveErr, botUserSaveRes) {
        // Call the assertion callback
        done(botUserSaveErr);
      });
  });

  it('should not be able to save an Bot user if no name is provided', function (done) {
    // Invalidate name field
    botUser.name = '';

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
        agent.post('/api/botUsers')
          .send(botUser)
          .expect(400)
          .end(function (botUserSaveErr, botUserSaveRes) {
            // Set message assertion
            (botUserSaveRes.body.message).should.match('Please fill Bot user name');

            // Handle Bot user save error
            done(botUserSaveErr);
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
        agent.post('/api/botUsers')
          .send(botUser)
          .expect(200)
          .end(function (botUserSaveErr, botUserSaveRes) {
            // Handle Bot user save error
            if (botUserSaveErr) {
              return done(botUserSaveErr);
            }

            // Update Bot user name
            botUser.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Bot user
            agent.put('/api/botUsers/' + botUserSaveRes.body._id)
              .send(botUser)
              .expect(200)
              .end(function (botUserUpdateErr, botUserUpdateRes) {
                // Handle Bot user update error
                if (botUserUpdateErr) {
                  return done(botUserUpdateErr);
                }

                // Set assertions
                (botUserUpdateRes.body._id).should.equal(botUserSaveRes.body._id);
                (botUserUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Bot users if not signed in', function (done) {
    // Create new Bot user model instance
    var botUserObj = new BotUser(botUser);

    // Save the botUser
    botUserObj.save(function () {
      // Request Bot users
      request(app).get('/api/botUsers')
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
    var botUserObj = new BotUser(botUser);

    // Save the Bot user
    botUserObj.save(function () {
      request(app).get('/api/botUsers/' + botUserObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', botUser.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Bot user with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/botUsers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bot user is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Bot user which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Bot user
    request(app).get('/api/botUsers/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/botUsers')
          .send(botUser)
          .expect(200)
          .end(function (botUserSaveErr, botUserSaveRes) {
            // Handle Bot user save error
            if (botUserSaveErr) {
              return done(botUserSaveErr);
            }

            // Delete an existing Bot user
            agent.delete('/api/botUsers/' + botUserSaveRes.body._id)
              .send(botUser)
              .expect(200)
              .end(function (botUserDeleteErr, botUserDeleteRes) {
                // Handle botUser error error
                if (botUserDeleteErr) {
                  return done(botUserDeleteErr);
                }

                // Set assertions
                (botUserDeleteRes.body._id).should.equal(botUserSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Bot user if not signed in', function (done) {
    // Set Bot user user
    botUser.user = user;

    // Create new Bot user model instance
    var botUserObj = new BotUser(botUser);

    // Save the Bot user
    botUserObj.save(function () {
      // Try deleting Bot user
      request(app).delete('/api/botUsers/' + botUserObj._id)
        .expect(403)
        .end(function (botUserDeleteErr, botUserDeleteRes) {
          // Set message assertion
          (botUserDeleteRes.body.message).should.match('User is not authorized');

          // Handle Bot user error error
          done(botUserDeleteErr);
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
          agent.post('/api/botUsers')
            .send(botUser)
            .expect(200)
            .end(function (botUserSaveErr, botUserSaveRes) {
              // Handle Bot user save error
              if (botUserSaveErr) {
                return done(botUserSaveErr);
              }

              // Set assertions on new Bot user
              (botUserSaveRes.body.name).should.equal(botUser.name);
              should.exist(botUserSaveRes.body.user);
              should.equal(botUserSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/botUsers/' + botUserSaveRes.body._id)
                      .expect(200)
                      .end(function (botUserInfoErr, botUserInfoRes) {
                        // Handle Bot user error
                        if (botUserInfoErr) {
                          return done(botUserInfoErr);
                        }

                        // Set assertions
                        (botUserInfoRes.body._id).should.equal(botUserSaveRes.body._id);
                        (botUserInfoRes.body.name).should.equal(botUser.name);
                        should.equal(botUserInfoRes.body.user, undefined);

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
      BotUser.remove().exec(done);
    });
  });
});
