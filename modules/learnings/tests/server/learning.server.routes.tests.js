'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Learning = mongoose.model('Learning'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, learning;

/**
 * Learning routes tests
 */
describe('Learning CRUD tests', function () {

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

    // Save a user to the test db and create new learning
    user.save(function () {
      learning = {
        title: 'Learning Title',
        content: 'Learning Content'
      };

      done();
    });
  });

  it('should be able to save an learning if logged in', function (done) {
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

        // Save a new learning
        agent.post('/api/learnings')
          .send(learning)
          .expect(200)
          .end(function (learningSaveErr, learningSaveRes) {
            // Handle learning save error
            if (learningSaveErr) {
              return done(learningSaveErr);
            }

            // Get a list of learnings
            agent.get('/api/learnings')
              .end(function (learningsGetErr, learningsGetRes) {
                // Handle learning save error
                if (learningsGetErr) {
                  return done(learningsGetErr);
                }

                // Get learnings list
                var learnings = learningsGetRes.body;

                // Set assertions
                (learnings[0].user._id).should.equal(userId);
                (learnings[0].title).should.match('Learning Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an learning if not logged in', function (done) {
    agent.post('/api/learnings')
      .send(learning)
      .expect(403)
      .end(function (learningSaveErr, learningSaveRes) {
        // Call the assertion callback
        done(learningSaveErr);
      });
  });

  it('should not be able to save an learning if no title is provided', function (done) {
    // Invalidate title field
    learning.title = '';

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

        // Save a new learning
        agent.post('/api/learnings')
          .send(learning)
          .expect(400)
          .end(function (learningSaveErr, learningSaveRes) {
            // Set message assertion
            (learningSaveRes.body.message).should.match('Title cannot be blank');

            // Handle learning save error
            done(learningSaveErr);
          });
      });
  });

  it('should be able to update an learning if signed in', function (done) {
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

        // Save a new learning
        agent.post('/api/learnings')
          .send(learning)
          .expect(200)
          .end(function (learningSaveErr, learningSaveRes) {
            // Handle learning save error
            if (learningSaveErr) {
              return done(learningSaveErr);
            }

            // Update learning title
            learning.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing learning
            agent.put('/api/learnings/' + learningSaveRes.body._id)
              .send(learning)
              .expect(200)
              .end(function (learningUpdateErr, learningUpdateRes) {
                // Handle learning update error
                if (learningUpdateErr) {
                  return done(learningUpdateErr);
                }

                // Set assertions
                (learningUpdateRes.body._id).should.equal(learningSaveRes.body._id);
                (learningUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of learnings if not signed in', function (done) {
    // Create new learning model instance
    var learningObj = new Learning(learning);

    // Save the learning
    learningObj.save(function () {
      // Request learnings
      request(app).get('/api/learnings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single learning if not signed in', function (done) {
    // Create new learning model instance
    var learningObj = new Learning(learning);

    // Save the learning
    learningObj.save(function () {
      request(app).get('/api/learnings/' + learningObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', learning.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single learning with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/learnings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Learning is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single learning which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent learning
    request(app).get('/api/learnings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No learning with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an learning if signed in', function (done) {
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

        // Save a new learning
        agent.post('/api/learnings')
          .send(learning)
          .expect(200)
          .end(function (learningSaveErr, learningSaveRes) {
            // Handle learning save error
            if (learningSaveErr) {
              return done(learningSaveErr);
            }

            // Delete an existing learning
            agent.delete('/api/learnings/' + learningSaveRes.body._id)
              .send(learning)
              .expect(200)
              .end(function (learningDeleteErr, learningDeleteRes) {
                // Handle learning error error
                if (learningDeleteErr) {
                  return done(learningDeleteErr);
                }

                // Set assertions
                (learningDeleteRes.body._id).should.equal(learningSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an learning if not signed in', function (done) {
    // Set learning user
    learning.user = user;

    // Create new learning model instance
    var learningObj = new Learning(learning);

    // Save the learning
    learningObj.save(function () {
      // Try deleting learning
      request(app).delete('/api/learnings/' + learningObj._id)
        .expect(403)
        .end(function (learningDeleteErr, learningDeleteRes) {
          // Set message assertion
          (learningDeleteRes.body.message).should.match('User is not authorized');

          // Handle learning error error
          done(learningDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Learning.remove().exec(done);
    });
  });
});
