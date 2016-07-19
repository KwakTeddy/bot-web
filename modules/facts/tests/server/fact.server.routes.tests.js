'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Fact = mongoose.model('Fact'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, fact;

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
      fact = {
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
        agent.post('/api/facts')
          .send(fact)
          .expect(200)
          .end(function (factSaveErr, factSaveRes) {
            // Handle Custom action save error
            if (factSaveErr) {
              return done(factSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/facts')
              .end(function (factsGetErr, factsGetRes) {
                // Handle Custom action save error
                if (factsGetErr) {
                  return done(factsGetErr);
                }

                // Get Custom actions list
                var facts = factsGetRes.body;

                // Set assertions
                (facts[0].user._id).should.equal(userId);
                (facts[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/facts')
      .send(fact)
      .expect(403)
      .end(function (factSaveErr, factSaveRes) {
        // Call the assertion callback
        done(factSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    fact.name = '';

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
        agent.post('/api/facts')
          .send(fact)
          .expect(400)
          .end(function (factSaveErr, factSaveRes) {
            // Set message assertion
            (factSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(factSaveErr);
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
        agent.post('/api/facts')
          .send(fact)
          .expect(200)
          .end(function (factSaveErr, factSaveRes) {
            // Handle Custom action save error
            if (factSaveErr) {
              return done(factSaveErr);
            }

            // Update Custom action name
            fact.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/facts/' + factSaveRes.body._id)
              .send(fact)
              .expect(200)
              .end(function (factUpdateErr, factUpdateRes) {
                // Handle Custom action update error
                if (factUpdateErr) {
                  return done(factUpdateErr);
                }

                // Set assertions
                (factUpdateRes.body._id).should.equal(factSaveRes.body._id);
                (factUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var factObj = new Fact(fact);

    // Save the fact
    factObj.save(function () {
      // Request Custom actions
      request(app).get('/api/facts')
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
    var factObj = new Fact(fact);

    // Save the Custom action
    factObj.save(function () {
      request(app).get('/api/facts/' + factObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', fact.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/facts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/facts/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/facts')
          .send(fact)
          .expect(200)
          .end(function (factSaveErr, factSaveRes) {
            // Handle Custom action save error
            if (factSaveErr) {
              return done(factSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/facts/' + factSaveRes.body._id)
              .send(fact)
              .expect(200)
              .end(function (factDeleteErr, factDeleteRes) {
                // Handle fact error error
                if (factDeleteErr) {
                  return done(factDeleteErr);
                }

                // Set assertions
                (factDeleteRes.body._id).should.equal(factSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    fact.user = user;

    // Create new Custom action model instance
    var factObj = new Fact(fact);

    // Save the Custom action
    factObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/facts/' + factObj._id)
        .expect(403)
        .end(function (factDeleteErr, factDeleteRes) {
          // Set message assertion
          (factDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(factDeleteErr);
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
          agent.post('/api/facts')
            .send(fact)
            .expect(200)
            .end(function (factSaveErr, factSaveRes) {
              // Handle Custom action save error
              if (factSaveErr) {
                return done(factSaveErr);
              }

              // Set assertions on new Custom action
              (factSaveRes.body.name).should.equal(fact.name);
              should.exist(factSaveRes.body.user);
              should.equal(factSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/facts/' + factSaveRes.body._id)
                      .expect(200)
                      .end(function (factInfoErr, factInfoRes) {
                        // Handle Custom action error
                        if (factInfoErr) {
                          return done(factInfoErr);
                        }

                        // Set assertions
                        (factInfoRes.body._id).should.equal(factSaveRes.body._id);
                        (factInfoRes.body.name).should.equal(fact.name);
                        should.equal(factInfoRes.body.user, undefined);

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
      Fact.remove().exec(done);
    });
  });
});
