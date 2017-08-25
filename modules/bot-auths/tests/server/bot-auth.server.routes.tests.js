'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  BotAuth = mongoose.model('BotAuth'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  botAuth;

/**
 * Bot auth routes tests
 */
describe('Bot auth CRUD tests', function () {

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

    // Save a user to the test db and create new Bot auth
    user.save(function () {
      botAuth = {
        name: 'Bot auth name'
      };

      done();
    });
  });

  it('should be able to save a Bot auth if logged in', function (done) {
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

        // Save a new Bot auth
        agent.post('/api/botAuths')
          .send(botAuth)
          .expect(200)
          .end(function (botAuthSaveErr, botAuthSaveRes) {
            // Handle Bot auth save error
            if (botAuthSaveErr) {
              return done(botAuthSaveErr);
            }

            // Get a list of Bot auths
            agent.get('/api/botAuths')
              .end(function (botAuthsGetErr, botAuthsGetRes) {
                // Handle Bot auths save error
                if (botAuthsGetErr) {
                  return done(botAuthsGetErr);
                }

                // Get Bot auths list
                var botAuths = botAuthsGetRes.body;

                // Set assertions
                (botAuths[0].user._id).should.equal(userId);
                (botAuths[0].name).should.match('Bot auth name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Bot auth if not logged in', function (done) {
    agent.post('/api/botAuths')
      .send(botAuth)
      .expect(403)
      .end(function (botAuthSaveErr, botAuthSaveRes) {
        // Call the assertion callback
        done(botAuthSaveErr);
      });
  });

  it('should not be able to save an Bot auth if no name is provided', function (done) {
    // Invalidate name field
    botAuth.name = '';

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

        // Save a new Bot auth
        agent.post('/api/botAuths')
          .send(botAuth)
          .expect(400)
          .end(function (botAuthSaveErr, botAuthSaveRes) {
            // Set message assertion
            (botAuthSaveRes.body.message).should.match('Please fill Bot auth name');

            // Handle Bot auth save error
            done(botAuthSaveErr);
          });
      });
  });

  it('should be able to update an Bot auth if signed in', function (done) {
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

        // Save a new Bot auth
        agent.post('/api/botAuths')
          .send(botAuth)
          .expect(200)
          .end(function (botAuthSaveErr, botAuthSaveRes) {
            // Handle Bot auth save error
            if (botAuthSaveErr) {
              return done(botAuthSaveErr);
            }

            // Update Bot auth name
            botAuth.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Bot auth
            agent.put('/api/botAuths/' + botAuthSaveRes.body._id)
              .send(botAuth)
              .expect(200)
              .end(function (botAuthUpdateErr, botAuthUpdateRes) {
                // Handle Bot auth update error
                if (botAuthUpdateErr) {
                  return done(botAuthUpdateErr);
                }

                // Set assertions
                (botAuthUpdateRes.body._id).should.equal(botAuthSaveRes.body._id);
                (botAuthUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Bot auths if not signed in', function (done) {
    // Create new Bot auth model instance
    var botAuthObj = new BotAuth(botAuth);

    // Save the botAuth
    botAuthObj.save(function () {
      // Request Bot auths
      request(app).get('/api/botAuths')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Bot auth if not signed in', function (done) {
    // Create new Bot auth model instance
    var botAuthObj = new BotAuth(botAuth);

    // Save the Bot auth
    botAuthObj.save(function () {
      request(app).get('/api/botAuths/' + botAuthObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', botAuth.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Bot auth with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/botAuths/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bot auth is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Bot auth which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Bot auth
    request(app).get('/api/botAuths/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Bot auth with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Bot auth if signed in', function (done) {
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

        // Save a new Bot auth
        agent.post('/api/botAuths')
          .send(botAuth)
          .expect(200)
          .end(function (botAuthSaveErr, botAuthSaveRes) {
            // Handle Bot auth save error
            if (botAuthSaveErr) {
              return done(botAuthSaveErr);
            }

            // Delete an existing Bot auth
            agent.delete('/api/botAuths/' + botAuthSaveRes.body._id)
              .send(botAuth)
              .expect(200)
              .end(function (botAuthDeleteErr, botAuthDeleteRes) {
                // Handle botAuth error error
                if (botAuthDeleteErr) {
                  return done(botAuthDeleteErr);
                }

                // Set assertions
                (botAuthDeleteRes.body._id).should.equal(botAuthSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Bot auth if not signed in', function (done) {
    // Set Bot auth user
    botAuth.user = user;

    // Create new Bot auth model instance
    var botAuthObj = new BotAuth(botAuth);

    // Save the Bot auth
    botAuthObj.save(function () {
      // Try deleting Bot auth
      request(app).delete('/api/botAuths/' + botAuthObj._id)
        .expect(403)
        .end(function (botAuthDeleteErr, botAuthDeleteRes) {
          // Set message assertion
          (botAuthDeleteRes.body.message).should.match('User is not authorized');

          // Handle Bot auth error error
          done(botAuthDeleteErr);
        });

    });
  });

  it('should be able to get a single Bot auth that has an orphaned user reference', function (done) {
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

          // Save a new Bot auth
          agent.post('/api/botAuths')
            .send(botAuth)
            .expect(200)
            .end(function (botAuthSaveErr, botAuthSaveRes) {
              // Handle Bot auth save error
              if (botAuthSaveErr) {
                return done(botAuthSaveErr);
              }

              // Set assertions on new Bot auth
              (botAuthSaveRes.body.name).should.equal(botAuth.name);
              should.exist(botAuthSaveRes.body.user);
              should.equal(botAuthSaveRes.body.user._id, orphanId);

              // force the Bot auth to have an orphaned user reference
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

                    // Get the Bot auth
                    agent.get('/api/botAuths/' + botAuthSaveRes.body._id)
                      .expect(200)
                      .end(function (botAuthInfoErr, botAuthInfoRes) {
                        // Handle Bot auth error
                        if (botAuthInfoErr) {
                          return done(botAuthInfoErr);
                        }

                        // Set assertions
                        (botAuthInfoRes.body._id).should.equal(botAuthSaveRes.body._id);
                        (botAuthInfoRes.body.name).should.equal(botAuth.name);
                        should.equal(botAuthInfoRes.body.user, undefined);

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
      BotAuth.remove().exec(done);
    });
  });
});
