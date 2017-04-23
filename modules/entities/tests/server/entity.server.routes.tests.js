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
var app,
  agent,
  credentials,
  user,
  entity;

/**
 * Entity routes tests
 */
describe('Entity CRUD tests', function () {

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

    // Save a user to the test db and create new Entity
    user.save(function () {
      entity = {
        name: 'Entity name'
      };

      done();
    });
  });

  it('should be able to save a Entity if logged in', function (done) {
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

        // Save a new Entity
        agent.post('/api/entities')
          .send(entity)
          .expect(200)
          .end(function (entitySaveErr, entitySaveRes) {
            // Handle Entity save error
            if (entitySaveErr) {
              return done(entitySaveErr);
            }

            // Get a list of Entities
            agent.get('/api/entities')
              .end(function (entitiesGetErr, entitiesGetRes) {
                // Handle Entities save error
                if (entitiesGetErr) {
                  return done(entitiesGetErr);
                }

                // Get Entities list
                var entities = entitiesGetRes.body;

                // Set assertions
                (entities[0].user._id).should.equal(userId);
                (entities[0].name).should.match('Entity name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Entity if not logged in', function (done) {
    agent.post('/api/entities')
      .send(entity)
      .expect(403)
      .end(function (entitySaveErr, entitySaveRes) {
        // Call the assertion callback
        done(entitySaveErr);
      });
  });

  it('should not be able to save an Entity if no name is provided', function (done) {
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

        // Save a new Entity
        agent.post('/api/entities')
          .send(entity)
          .expect(400)
          .end(function (entitySaveErr, entitySaveRes) {
            // Set message assertion
            (entitySaveRes.body.message).should.match('Please fill Entity name');

            // Handle Entity save error
            done(entitySaveErr);
          });
      });
  });

  it('should be able to update an Entity if signed in', function (done) {
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

        // Save a new Entity
        agent.post('/api/entities')
          .send(entity)
          .expect(200)
          .end(function (entitySaveErr, entitySaveRes) {
            // Handle Entity save error
            if (entitySaveErr) {
              return done(entitySaveErr);
            }

            // Update Entity name
            entity.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Entity
            agent.put('/api/entities/' + entitySaveRes.body._id)
              .send(entity)
              .expect(200)
              .end(function (entityUpdateErr, entityUpdateRes) {
                // Handle Entity update error
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

  it('should be able to get a list of Entities if not signed in', function (done) {
    // Create new Entity model instance
    var entityObj = new Entity(entity);

    // Save the entity
    entityObj.save(function () {
      // Request Entities
      request(app).get('/api/entities')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Entity if not signed in', function (done) {
    // Create new Entity model instance
    var entityObj = new Entity(entity);

    // Save the Entity
    entityObj.save(function () {
      request(app).get('/api/entities/' + entityObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', entity.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Entity with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/entities/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Entity is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Entity which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Entity
    request(app).get('/api/entities/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Entity with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Entity if signed in', function (done) {
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

        // Save a new Entity
        agent.post('/api/entities')
          .send(entity)
          .expect(200)
          .end(function (entitySaveErr, entitySaveRes) {
            // Handle Entity save error
            if (entitySaveErr) {
              return done(entitySaveErr);
            }

            // Delete an existing Entity
            agent.delete('/api/entities/' + entitySaveRes.body._id)
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

  it('should not be able to delete an Entity if not signed in', function (done) {
    // Set Entity user
    entity.user = user;

    // Create new Entity model instance
    var entityObj = new Entity(entity);

    // Save the Entity
    entityObj.save(function () {
      // Try deleting Entity
      request(app).delete('/api/entities/' + entityObj._id)
        .expect(403)
        .end(function (entityDeleteErr, entityDeleteRes) {
          // Set message assertion
          (entityDeleteRes.body.message).should.match('User is not authorized');

          // Handle Entity error error
          done(entityDeleteErr);
        });

    });
  });

  it('should be able to get a single Entity that has an orphaned user reference', function (done) {
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

          // Save a new Entity
          agent.post('/api/entities')
            .send(entity)
            .expect(200)
            .end(function (entitySaveErr, entitySaveRes) {
              // Handle Entity save error
              if (entitySaveErr) {
                return done(entitySaveErr);
              }

              // Set assertions on new Entity
              (entitySaveRes.body.name).should.equal(entity.name);
              should.exist(entitySaveRes.body.user);
              should.equal(entitySaveRes.body.user._id, orphanId);

              // force the Entity to have an orphaned user reference
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

                    // Get the Entity
                    agent.get('/api/entities/' + entitySaveRes.body._id)
                      .expect(200)
                      .end(function (entityInfoErr, entityInfoRes) {
                        // Handle Entity error
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
