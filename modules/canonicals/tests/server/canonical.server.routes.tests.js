'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Canonical = mongoose.model('Canonical'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, canonical;

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
      canonical = {
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
        agent.post('/api/canonicals')
          .send(canonical)
          .expect(200)
          .end(function (canonicalSaveErr, canonicalSaveRes) {
            // Handle Custom action save error
            if (canonicalSaveErr) {
              return done(canonicalSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/canonicals')
              .end(function (canonicalsGetErr, canonicalsGetRes) {
                // Handle Custom action save error
                if (canonicalsGetErr) {
                  return done(canonicalsGetErr);
                }

                // Get Custom actions list
                var canonicals = canonicalsGetRes.body;

                // Set assertions
                (canonicals[0].user._id).should.equal(userId);
                (canonicals[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/canonicals')
      .send(canonical)
      .expect(403)
      .end(function (canonicalSaveErr, canonicalSaveRes) {
        // Call the assertion callback
        done(canonicalSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    canonical.name = '';

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
        agent.post('/api/canonicals')
          .send(canonical)
          .expect(400)
          .end(function (canonicalSaveErr, canonicalSaveRes) {
            // Set message assertion
            (canonicalSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(canonicalSaveErr);
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
        agent.post('/api/canonicals')
          .send(canonical)
          .expect(200)
          .end(function (canonicalSaveErr, canonicalSaveRes) {
            // Handle Custom action save error
            if (canonicalSaveErr) {
              return done(canonicalSaveErr);
            }

            // Update Custom action name
            canonical.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/canonicals/' + canonicalSaveRes.body._id)
              .send(canonical)
              .expect(200)
              .end(function (canonicalUpdateErr, canonicalUpdateRes) {
                // Handle Custom action update error
                if (canonicalUpdateErr) {
                  return done(canonicalUpdateErr);
                }

                // Set assertions
                (canonicalUpdateRes.body._id).should.equal(canonicalSaveRes.body._id);
                (canonicalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var canonicalObj = new Canonical(canonical);

    // Save the canonical
    canonicalObj.save(function () {
      // Request Custom actions
      request(app).get('/api/canonicals')
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
    var canonicalObj = new Canonical(canonical);

    // Save the Custom action
    canonicalObj.save(function () {
      request(app).get('/api/canonicals/' + canonicalObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', canonical.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/canonicals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/canonicals/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/canonicals')
          .send(canonical)
          .expect(200)
          .end(function (canonicalSaveErr, canonicalSaveRes) {
            // Handle Custom action save error
            if (canonicalSaveErr) {
              return done(canonicalSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/canonicals/' + canonicalSaveRes.body._id)
              .send(canonical)
              .expect(200)
              .end(function (canonicalDeleteErr, canonicalDeleteRes) {
                // Handle canonical error error
                if (canonicalDeleteErr) {
                  return done(canonicalDeleteErr);
                }

                // Set assertions
                (canonicalDeleteRes.body._id).should.equal(canonicalSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    canonical.user = user;

    // Create new Custom action model instance
    var canonicalObj = new Canonical(canonical);

    // Save the Custom action
    canonicalObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/canonicals/' + canonicalObj._id)
        .expect(403)
        .end(function (canonicalDeleteErr, canonicalDeleteRes) {
          // Set message assertion
          (canonicalDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(canonicalDeleteErr);
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
          agent.post('/api/canonicals')
            .send(canonical)
            .expect(200)
            .end(function (canonicalSaveErr, canonicalSaveRes) {
              // Handle Custom action save error
              if (canonicalSaveErr) {
                return done(canonicalSaveErr);
              }

              // Set assertions on new Custom action
              (canonicalSaveRes.body.name).should.equal(canonical.name);
              should.exist(canonicalSaveRes.body.user);
              should.equal(canonicalSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/canonicals/' + canonicalSaveRes.body._id)
                      .expect(200)
                      .end(function (canonicalInfoErr, canonicalInfoRes) {
                        // Handle Custom action error
                        if (canonicalInfoErr) {
                          return done(canonicalInfoErr);
                        }

                        // Set assertions
                        (canonicalInfoRes.body._id).should.equal(canonicalSaveRes.body._id);
                        (canonicalInfoRes.body.name).should.equal(canonical.name);
                        should.equal(canonicalInfoRes.body.user, undefined);

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
      Canonical.remove().exec(done);
    });
  });
});
