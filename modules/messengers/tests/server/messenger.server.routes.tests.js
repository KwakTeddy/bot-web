'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Messenger = mongoose.model('Messenger'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, messenger;

/**
 * Messenger routes tests
 */
describe('Messenger CRUD tests', function () {

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

    // Save a user to the test db and create new messenger
    user.save(function () {
      messenger = {
        title: 'Messenger Title',
        content: 'Messenger Content'
      };

      done();
    });
  });

  it('should be able to save an messenger if logged in', function (done) {
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

        // Save a new messenger
        agent.post('/api/messengers')
          .send(messenger)
          .expect(200)
          .end(function (messengerSaveErr, messengerSaveRes) {
            // Handle messenger save error
            if (messengerSaveErr) {
              return done(messengerSaveErr);
            }

            // Get a list of messengers
            agent.get('/api/messengers')
              .end(function (messengersGetErr, messengersGetRes) {
                // Handle messenger save error
                if (messengersGetErr) {
                  return done(messengersGetErr);
                }

                // Get messengers list
                var messengers = messengersGetRes.body;

                // Set assertions
                (messengers[0].user._id).should.equal(userId);
                (messengers[0].title).should.match('Messenger Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an messenger if not logged in', function (done) {
    agent.post('/api/messengers')
      .send(messenger)
      .expect(403)
      .end(function (messengerSaveErr, messengerSaveRes) {
        // Call the assertion callback
        done(messengerSaveErr);
      });
  });

  it('should not be able to save an messenger if no title is provided', function (done) {
    // Invalidate title field
    messenger.title = '';

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

        // Save a new messenger
        agent.post('/api/messengers')
          .send(messenger)
          .expect(400)
          .end(function (messengerSaveErr, messengerSaveRes) {
            // Set message assertion
            (messengerSaveRes.body.message).should.match('Title cannot be blank');

            // Handle messenger save error
            done(messengerSaveErr);
          });
      });
  });

  it('should be able to update an messenger if signed in', function (done) {
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

        // Save a new messenger
        agent.post('/api/messengers')
          .send(messenger)
          .expect(200)
          .end(function (messengerSaveErr, messengerSaveRes) {
            // Handle messenger save error
            if (messengerSaveErr) {
              return done(messengerSaveErr);
            }

            // Update messenger title
            messenger.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing messenger
            agent.put('/api/messengers/' + messengerSaveRes.body._id)
              .send(messenger)
              .expect(200)
              .end(function (messengerUpdateErr, messengerUpdateRes) {
                // Handle messenger update error
                if (messengerUpdateErr) {
                  return done(messengerUpdateErr);
                }

                // Set assertions
                (messengerUpdateRes.body._id).should.equal(messengerSaveRes.body._id);
                (messengerUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of messengers if not signed in', function (done) {
    // Create new messenger model instance
    var messengerObj = new Messenger(messenger);

    // Save the messenger
    messengerObj.save(function () {
      // Request messengers
      request(app).get('/api/messengers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single messenger if not signed in', function (done) {
    // Create new messenger model instance
    var messengerObj = new Messenger(messenger);

    // Save the messenger
    messengerObj.save(function () {
      request(app).get('/api/messengers/' + messengerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', messenger.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single messenger with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/messengers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Messenger is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single messenger which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent messenger
    request(app).get('/api/messengers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No messenger with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an messenger if signed in', function (done) {
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

        // Save a new messenger
        agent.post('/api/messengers')
          .send(messenger)
          .expect(200)
          .end(function (messengerSaveErr, messengerSaveRes) {
            // Handle messenger save error
            if (messengerSaveErr) {
              return done(messengerSaveErr);
            }

            // Delete an existing messenger
            agent.delete('/api/messengers/' + messengerSaveRes.body._id)
              .send(messenger)
              .expect(200)
              .end(function (messengerDeleteErr, messengerDeleteRes) {
                // Handle messenger error error
                if (messengerDeleteErr) {
                  return done(messengerDeleteErr);
                }

                // Set assertions
                (messengerDeleteRes.body._id).should.equal(messengerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an messenger if not signed in', function (done) {
    // Set messenger user
    messenger.user = user;

    // Create new messenger model instance
    var messengerObj = new Messenger(messenger);

    // Save the messenger
    messengerObj.save(function () {
      // Try deleting messenger
      request(app).delete('/api/messengers/' + messengerObj._id)
        .expect(403)
        .end(function (messengerDeleteErr, messengerDeleteRes) {
          // Set message assertion
          (messengerDeleteRes.body.message).should.match('User is not authorized');

          // Handle messenger error error
          done(messengerDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Messenger.remove().exec(done);
    });
  });
});
