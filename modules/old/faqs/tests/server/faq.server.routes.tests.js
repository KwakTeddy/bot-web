'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Faq = mongoose.model('Faq'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, faq;

/**
 * Faq routes tests
 */
describe('Faq CRUD tests', function () {

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

    // Save a user to the test db and create new Faq
    user.save(function () {
      faq = {
        name: 'Faq name'
      };

      done();
    });
  });

  it('should be able to save a Faq if logged in', function (done) {
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

        // Save a new Faq
        agent.post('/api/faqs')
          .send(faq)
          .expect(200)
          .end(function (faqSaveErr, faqSaveRes) {
            // Handle Faq save error
            if (faqSaveErr) {
              return done(faqSaveErr);
            }

            // Get a list of Faqs
            agent.get('/api/faqs')
              .end(function (faqsGetErr, faqsGetRes) {
                // Handle Faq save error
                if (faqsGetErr) {
                  return done(faqsGetErr);
                }

                // Get Faqs list
                var faqs = faqsGetRes.body;

                // Set assertions
                (faqs[0].user._id).should.equal(userId);
                (faqs[0].name).should.match('Faq name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Faq if not logged in', function (done) {
    agent.post('/api/faqs')
      .send(faq)
      .expect(403)
      .end(function (faqSaveErr, faqSaveRes) {
        // Call the assertion callback
        done(faqSaveErr);
      });
  });

  it('should not be able to save an Faq if no name is provided', function (done) {
    // Invalidate name field
    faq.name = '';

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

        // Save a new Faq
        agent.post('/api/faqs')
          .send(faq)
          .expect(400)
          .end(function (faqSaveErr, faqSaveRes) {
            // Set message assertion
            (faqSaveRes.body.message).should.match('Please fill Faq name');

            // Handle Faq save error
            done(faqSaveErr);
          });
      });
  });

  it('should be able to update an Faq if signed in', function (done) {
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

        // Save a new Faq
        agent.post('/api/faqs')
          .send(faq)
          .expect(200)
          .end(function (faqSaveErr, faqSaveRes) {
            // Handle Faq save error
            if (faqSaveErr) {
              return done(faqSaveErr);
            }

            // Update Faq name
            faq.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Faq
            agent.put('/api/faqs/' + faqSaveRes.body._id)
              .send(faq)
              .expect(200)
              .end(function (faqUpdateErr, faqUpdateRes) {
                // Handle Faq update error
                if (faqUpdateErr) {
                  return done(faqUpdateErr);
                }

                // Set assertions
                (faqUpdateRes.body._id).should.equal(faqSaveRes.body._id);
                (faqUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Faqs if not signed in', function (done) {
    // Create new Faq model instance
    var faqObj = new Faq(faq);

    // Save the faq
    faqObj.save(function () {
      // Request Faqs
      request(app).get('/api/faqs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Faq if not signed in', function (done) {
    // Create new Faq model instance
    var faqObj = new Faq(faq);

    // Save the Faq
    faqObj.save(function () {
      request(app).get('/api/faqs/' + faqObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', faq.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Faq with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/faqs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Faq is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Faq which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Faq
    request(app).get('/api/faqs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Faq with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Faq if signed in', function (done) {
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

        // Save a new Faq
        agent.post('/api/faqs')
          .send(faq)
          .expect(200)
          .end(function (faqSaveErr, faqSaveRes) {
            // Handle Faq save error
            if (faqSaveErr) {
              return done(faqSaveErr);
            }

            // Delete an existing Faq
            agent.delete('/api/faqs/' + faqSaveRes.body._id)
              .send(faq)
              .expect(200)
              .end(function (faqDeleteErr, faqDeleteRes) {
                // Handle faq error error
                if (faqDeleteErr) {
                  return done(faqDeleteErr);
                }

                // Set assertions
                (faqDeleteRes.body._id).should.equal(faqSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Faq if not signed in', function (done) {
    // Set Faq user
    faq.user = user;

    // Create new Faq model instance
    var faqObj = new Faq(faq);

    // Save the Faq
    faqObj.save(function () {
      // Try deleting Faq
      request(app).delete('/api/faqs/' + faqObj._id)
        .expect(403)
        .end(function (faqDeleteErr, faqDeleteRes) {
          // Set message assertion
          (faqDeleteRes.body.message).should.match('User is not authorized');

          // Handle Faq error error
          done(faqDeleteErr);
        });

    });
  });

  it('should be able to get a single Faq that has an orphaned user reference', function (done) {
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

          // Save a new Faq
          agent.post('/api/faqs')
            .send(faq)
            .expect(200)
            .end(function (faqSaveErr, faqSaveRes) {
              // Handle Faq save error
              if (faqSaveErr) {
                return done(faqSaveErr);
              }

              // Set assertions on new Faq
              (faqSaveRes.body.name).should.equal(faq.name);
              should.exist(faqSaveRes.body.user);
              should.equal(faqSaveRes.body.user._id, orphanId);

              // force the Faq to have an orphaned user reference
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

                    // Get the Faq
                    agent.get('/api/faqs/' + faqSaveRes.body._id)
                      .expect(200)
                      .end(function (faqInfoErr, faqInfoRes) {
                        // Handle Faq error
                        if (faqInfoErr) {
                          return done(faqInfoErr);
                        }

                        // Set assertions
                        (faqInfoRes.body._id).should.equal(faqSaveRes.body._id);
                        (faqInfoRes.body.name).should.equal(faq.name);
                        should.equal(faqInfoRes.body.user, undefined);

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
      Faq.remove().exec(done);
    });
  });
});
