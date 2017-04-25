'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Entity = mongoose.model('Entity'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, entity;

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
      entity = {
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
        agent.post('/api/entitys')
          .send(entity)
          .expect(200)
          .end(function (entitySaveErr, entitySaveRes) {
            // Handle Custom action save error
            if (entitySaveErr) {
              return done(entitySaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/entitys')
              .end(function (entitysGetErr, entitysGetRes) {
                // Handle Custom action save error
                if (entitysGetErr) {
                  return done(entitysGetErr);
                }

                // Get Custom actions list
                var entitys = entitysGetRes.body;

                // Set assertions
                (entitys[0].user._id).should.equal(userId);
                (entitys[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/entitys')
      .send(entity)
      .expect(403)
      .end(function (entitySaveErr, entitySaveRes) {
        // Call the assertion callback
        done(entitySaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    entity.name = '';

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
        agent.post('/api/entitys')
          .send(entity)
          .expect(400)
          .end(function (entitySaveErr, entitySaveRes) {
            // Set message assertion
            (entitySaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(entitySaveErr);
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
        agent.post('/api/entitys')
          .send(entity)
          .expect(200)
          .end(function (entitySaveErr, entitySaveRes) {
            // Handle Custom action save error
            if (entitySaveErr) {
              return done(entitySaveErr);
            }

            // Update Custom action name
            entity.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/entitys/' + entitySaveRes.body._id)
              .send(entity)
              .expect(200)
              .end(function (entityUpdateErr, entityUpdateRes) {
                // Handle Custom action update error
                if (entityUpdateErr) {
                  return done(entityUpdateErr);
                }

                // Set assertions
                (entityUpdateRes.body._id).should.equal(entitySaveRes.body._id);
                (entityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var entityObj = new Entity(entity);

    // Save the entity
    entityObj.save(function () {
      // Request Custom actions
      request(app).get('/api/entitys')
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
    var entityObj = new Entity(entity);

    // Save the Custom action
    entityObj.save(function () {
      request(app).get('/api/entitys/' + entityObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', entity.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/entitys/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/entitys/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/entitys')
          .send(entity)
          .expect(200)
          .end(function (entitySaveErr, entitySaveRes) {
            // Handle Custom action save error
            if (entitySaveErr) {
              return done(entitySaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/entitys/' + entitySaveRes.body._id)
              .send(entity)
              .expect(200)
              .end(function (entityDeleteErr, entityDeleteRes) {
                // Handle entity error error
                if (entityDeleteErr) {
                  return done(entityDeleteErr);
                }

                // Set assertions
                (entityDeleteRes.body._id).should.equal(entitySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    entity.user = user;

    // Create new Custom action model instance
    var entityObj = new Entity(entity);

    // Save the Custom action
    entityObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/entitys/' + entityObj._id)
        .expect(403)
        .end(function (entityDeleteErr, entityDeleteRes) {
          // Set message assertion
          (entityDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(entityDeleteErr);
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
          agent.post('/api/entitys')
            .send(entity)
            .expect(200)
            .end(function (entitySaveErr, entitySaveRes) {
              // Handle Custom action save error
              if (entitySaveErr) {
                return done(entitySaveErr);
              }

              // Set assertions on new Custom action
              (entitySaveRes.body.name).should.equal(entity.name);
              should.exist(entitySaveRes.body.user);
              should.equal(entitySaveRes.body.user._id, orphanId);

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
                    agent.get('/api/entitys/' + entitySaveRes.body._id)
                      .expect(200)
                      .end(function (entityInfoErr, entityInfoRes) {
                        // Handle Custom action error
                        if (entityInfoErr) {
                          return done(entityInfoErr);
                        }

                        // Set assertions
                        (entityInfoRes.body._id).should.equal(entitySaveRes.body._id);
                        (entityInfoRes.body.name).should.equal(entity.name);
                        should.equal(entityInfoRes.body.user, undefined);

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
      Entity.remove().exec(done);
    });
  });
});
