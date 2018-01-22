'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Bot = mongoose.model('Bot'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, bot;

/**
 * Bot routes tests
 */
describe('Bot CRUD tests', function () {

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

    // Save a user to the test db and create new bot
    user.save(function () {
      bot = {
        title: 'Bot Title',
        content: 'Bot Content'
      };

      done();
    });
  });

  it('should be able to save an bot if logged in', function (done) {
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

        // Save a new bot
        agent.post('/api/bots')
          .send(bot)
          .expect(200)
          .end(function (botSaveErr, botSaveRes) {
            // Handle bot save error
            if (botSaveErr) {
              return done(botSaveErr);
            }

            // Get a list of bots
            agent.get('/api/bots')
              .end(function (botsGetErr, botsGetRes) {
                // Handle bot save error
                if (botsGetErr) {
                  return done(botsGetErr);
                }

                // Get bots list
                var bots = botsGetRes.body;

                // Set assertions
                (bots[0].user._id).should.equal(userId);
                (bots[0].title).should.match('Bot Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an bot if not logged in', function (done) {
    agent.post('/api/bots')
      .send(bot)
      .expect(403)
      .end(function (botSaveErr, botSaveRes) {
        // Call the assertion callback
        done(botSaveErr);
      });
  });

  it('should not be able to save an bot if no title is provided', function (done) {
    // Invalidate title field
    bot.title = '';

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

        // Save a new bot
        agent.post('/api/bots')
          .send(bot)
          .expect(400)
          .end(function (botSaveErr, botSaveRes) {
            // Set message assertion
            (botSaveRes.body.message).should.match('Title cannot be blank');

            // Handle bot save error
            done(botSaveErr);
          });
      });
  });

  it('should be able to update an bot if signed in', function (done) {
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

        // Save a new bot
        agent.post('/api/bots')
          .send(bot)
          .expect(200)
          .end(function (botSaveErr, botSaveRes) {
            // Handle bot save error
            if (botSaveErr) {
              return done(botSaveErr);
            }

            // Update bot title
            bot.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing bot
            agent.put('/api/bots/' + botSaveRes.body._id)
              .send(bot)
              .expect(200)
              .end(function (botUpdateErr, botUpdateRes) {
                // Handle bot update error
                if (botUpdateErr) {
                  return done(botUpdateErr);
                }

                // Set assertions
                (botUpdateRes.body._id).should.equal(botSaveRes.body._id);
                (botUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of bots if not signed in', function (done) {
    // Create new bot model instance
    var botObj = new Bot(bot);

    // Save the bot
    botObj.save(function () {
      // Request bots
      request(app).get('/api/bots')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single bot if not signed in', function (done) {
    // Create new bot model instance
    var botObj = new Bot(bot);

    // Save the bot
    botObj.save(function () {
      request(app).get('/api/bots/' + botObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', bot.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single bot with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/bots/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bot is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single bot which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent bot
    request(app).get('/api/bots/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No bot with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an bot if signed in', function (done) {
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

        // Save a new bot
        agent.post('/api/bots')
          .send(bot)
          .expect(200)
          .end(function (botSaveErr, botSaveRes) {
            // Handle bot save error
            if (botSaveErr) {
              return done(botSaveErr);
            }

            // Delete an existing bot
            agent.delete('/api/bots/' + botSaveRes.body._id)
              .send(bot)
              .expect(200)
              .end(function (botDeleteErr, botDeleteRes) {
                // Handle bot error error
                if (botDeleteErr) {
                  return done(botDeleteErr);
                }

                // Set assertions
                (botDeleteRes.body._id).should.equal(botSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an bot if not signed in', function (done) {
    // Set bot user
    bot.user = user;

    // Create new bot model instance
    var botObj = new Bot(bot);

    // Save the bot
    botObj.save(function () {
      // Try deleting bot
      request(app).delete('/api/bots/' + botObj._id)
        .expect(403)
        .end(function (botDeleteErr, botDeleteRes) {
          // Set message assertion
          (botDeleteRes.body.message).should.match('User is not authorized');

          // Handle bot error error
          done(botDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Bot.remove().exec(done);
    });
  });
});
