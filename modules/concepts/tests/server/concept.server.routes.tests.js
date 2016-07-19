'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Concept = mongoose.model('Concept'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, concept;

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
      concept = {
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
        agent.post('/api/concepts')
          .send(concept)
          .expect(200)
          .end(function (conceptSaveErr, conceptSaveRes) {
            // Handle Custom action save error
            if (conceptSaveErr) {
              return done(conceptSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/concepts')
              .end(function (conceptsGetErr, conceptsGetRes) {
                // Handle Custom action save error
                if (conceptsGetErr) {
                  return done(conceptsGetErr);
                }

                // Get Custom actions list
                var concepts = conceptsGetRes.body;

                // Set assertions
                (concepts[0].user._id).should.equal(userId);
                (concepts[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/concepts')
      .send(concept)
      .expect(403)
      .end(function (conceptSaveErr, conceptSaveRes) {
        // Call the assertion callback
        done(conceptSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    concept.name = '';

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
        agent.post('/api/concepts')
          .send(concept)
          .expect(400)
          .end(function (conceptSaveErr, conceptSaveRes) {
            // Set message assertion
            (conceptSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(conceptSaveErr);
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
        agent.post('/api/concepts')
          .send(concept)
          .expect(200)
          .end(function (conceptSaveErr, conceptSaveRes) {
            // Handle Custom action save error
            if (conceptSaveErr) {
              return done(conceptSaveErr);
            }

            // Update Custom action name
            concept.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/concepts/' + conceptSaveRes.body._id)
              .send(concept)
              .expect(200)
              .end(function (conceptUpdateErr, conceptUpdateRes) {
                // Handle Custom action update error
                if (conceptUpdateErr) {
                  return done(conceptUpdateErr);
                }

                // Set assertions
                (conceptUpdateRes.body._id).should.equal(conceptSaveRes.body._id);
                (conceptUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var conceptObj = new Concept(concept);

    // Save the concept
    conceptObj.save(function () {
      // Request Custom actions
      request(app).get('/api/concepts')
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
    var conceptObj = new Concept(concept);

    // Save the Custom action
    conceptObj.save(function () {
      request(app).get('/api/concepts/' + conceptObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', concept.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/concepts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/concepts/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/concepts')
          .send(concept)
          .expect(200)
          .end(function (conceptSaveErr, conceptSaveRes) {
            // Handle Custom action save error
            if (conceptSaveErr) {
              return done(conceptSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/concepts/' + conceptSaveRes.body._id)
              .send(concept)
              .expect(200)
              .end(function (conceptDeleteErr, conceptDeleteRes) {
                // Handle concept error error
                if (conceptDeleteErr) {
                  return done(conceptDeleteErr);
                }

                // Set assertions
                (conceptDeleteRes.body._id).should.equal(conceptSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    concept.user = user;

    // Create new Custom action model instance
    var conceptObj = new Concept(concept);

    // Save the Custom action
    conceptObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/concepts/' + conceptObj._id)
        .expect(403)
        .end(function (conceptDeleteErr, conceptDeleteRes) {
          // Set message assertion
          (conceptDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(conceptDeleteErr);
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
          agent.post('/api/concepts')
            .send(concept)
            .expect(200)
            .end(function (conceptSaveErr, conceptSaveRes) {
              // Handle Custom action save error
              if (conceptSaveErr) {
                return done(conceptSaveErr);
              }

              // Set assertions on new Custom action
              (conceptSaveRes.body.name).should.equal(concept.name);
              should.exist(conceptSaveRes.body.user);
              should.equal(conceptSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/concepts/' + conceptSaveRes.body._id)
                      .expect(200)
                      .end(function (conceptInfoErr, conceptInfoRes) {
                        // Handle Custom action error
                        if (conceptInfoErr) {
                          return done(conceptInfoErr);
                        }

                        // Set assertions
                        (conceptInfoRes.body._id).should.equal(conceptSaveRes.body._id);
                        (conceptInfoRes.body.name).should.equal(concept.name);
                        should.equal(conceptInfoRes.body.user, undefined);

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
      Concept.remove().exec(done);
    });
  });
});
