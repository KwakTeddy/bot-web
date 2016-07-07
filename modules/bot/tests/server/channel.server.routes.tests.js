'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Channel = mongoose.model('Channel'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, channel;

/**
 * Channel routes tests
 */
describe('Channel CRUD tests', function () {

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

    // Save a user to the test db and create new channel
    user.save(function () {
      channel = {
        title: 'Channel Title',
        content: 'Channel Content'
      };

      done();
    });
  });

  it('should be able to save an channel if logged in', function (done) {
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

        // Save a new channel
        agent.post('/api/bot')
          .send(channel)
          .expect(200)
          .end(function (channelSaveErr, channelSaveRes) {
            // Handle channel save error
            if (channelSaveErr) {
              return done(channelSaveErr);
            }

            // Get a list of bot
            agent.get('/api/bot')
              .end(function (channelsGetErr, channelsGetRes) {
                // Handle channel save error
                if (channelsGetErr) {
                  return done(channelsGetErr);
                }

                // Get bot list
                var channels = channelsGetRes.body;

                // Set assertions
                (channels[0].user._id).should.equal(userId);
                (channels[0].title).should.match('Channel Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an channel if not logged in', function (done) {
    agent.post('/api/bot')
      .send(channel)
      .expect(403)
      .end(function (channelSaveErr, channelSaveRes) {
        // Call the assertion callback
        done(channelSaveErr);
      });
  });

  it('should not be able to save an channel if no title is provided', function (done) {
    // Invalidate title field
    channel.title = '';

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

        // Save a new channel
        agent.post('/api/bot')
          .send(channel)
          .expect(400)
          .end(function (channelSaveErr, channelSaveRes) {
            // Set message assertion
            (channelSaveRes.body.message).should.match('Title cannot be blank');

            // Handle channel save error
            done(channelSaveErr);
          });
      });
  });

  it('should be able to update an channel if signed in', function (done) {
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

        // Save a new channel
        agent.post('/api/bot')
          .send(channel)
          .expect(200)
          .end(function (channelSaveErr, channelSaveRes) {
            // Handle channel save error
            if (channelSaveErr) {
              return done(channelSaveErr);
            }

            // Update channel title
            channel.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing channel
            agent.put('/api/bot/' + channelSaveRes.body._id)
              .send(channel)
              .expect(200)
              .end(function (channelUpdateErr, channelUpdateRes) {
                // Handle channel update error
                if (channelUpdateErr) {
                  return done(channelUpdateErr);
                }

                // Set assertions
                (channelUpdateRes.body._id).should.equal(channelSaveRes.body._id);
                (channelUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of bot if not signed in', function (done) {
    // Create new channel model instance
    var channelObj = new Channel(channel);

    // Save the channel
    channelObj.save(function () {
      // Request bot
      request(app).get('/api/bot')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single channel if not signed in', function (done) {
    // Create new channel model instance
    var channelObj = new Channel(channel);

    // Save the channel
    channelObj.save(function () {
      request(app).get('/api/bot/' + channelObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', channel.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single channel with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/bot/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Channel is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single channel which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent channel
    request(app).get('/api/bot/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No channel with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an channel if signed in', function (done) {
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

        // Save a new channel
        agent.post('/api/bot')
          .send(channel)
          .expect(200)
          .end(function (channelSaveErr, channelSaveRes) {
            // Handle channel save error
            if (channelSaveErr) {
              return done(channelSaveErr);
            }

            // Delete an existing channel
            agent.delete('/api/bot/' + channelSaveRes.body._id)
              .send(channel)
              .expect(200)
              .end(function (channelDeleteErr, channelDeleteRes) {
                // Handle channel error error
                if (channelDeleteErr) {
                  return done(channelDeleteErr);
                }

                // Set assertions
                (channelDeleteRes.body._id).should.equal(channelSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an channel if not signed in', function (done) {
    // Set channel user
    channel.user = user;

    // Create new channel model instance
    var channelObj = new Channel(channel);

    // Save the channel
    channelObj.save(function () {
      // Try deleting channel
      request(app).delete('/api/bot/' + channelObj._id)
        .expect(403)
        .end(function (channelDeleteErr, channelDeleteRes) {
          // Set message assertion
          (channelDeleteRes.body.message).should.match('User is not authorized');

          // Handle channel error error
          done(channelDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Channel.remove().exec(done);
    });
  });
});
