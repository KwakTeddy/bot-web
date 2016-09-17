'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Restaurant = mongoose.model('Restaurant'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, restaurant;

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
      restaurant = {
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
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(200)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Handle Custom action save error
            if (restaurantSaveErr) {
              return done(restaurantSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/restaurants')
              .end(function (restaurantsGetErr, restaurantsGetRes) {
                // Handle Custom action save error
                if (restaurantsGetErr) {
                  return done(restaurantsGetErr);
                }

                // Get Custom actions list
                var restaurants = restaurantsGetRes.body;

                // Set assertions
                (restaurants[0].user._id).should.equal(userId);
                (restaurants[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/restaurants')
      .send(restaurant)
      .expect(403)
      .end(function (restaurantSaveErr, restaurantSaveRes) {
        // Call the assertion callback
        done(restaurantSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    restaurant.name = '';

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
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(400)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Set message assertion
            (restaurantSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(restaurantSaveErr);
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
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(200)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Handle Custom action save error
            if (restaurantSaveErr) {
              return done(restaurantSaveErr);
            }

            // Update Custom action name
            restaurant.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/restaurants/' + restaurantSaveRes.body._id)
              .send(restaurant)
              .expect(200)
              .end(function (restaurantUpdateErr, restaurantUpdateRes) {
                // Handle Custom action update error
                if (restaurantUpdateErr) {
                  return done(restaurantUpdateErr);
                }

                // Set assertions
                (restaurantUpdateRes.body._id).should.equal(restaurantSaveRes.body._id);
                (restaurantUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var restaurantObj = new Restaurant(restaurant);

    // Save the restaurant
    restaurantObj.save(function () {
      // Request Custom actions
      request(app).get('/api/restaurants')
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
    var restaurantObj = new Restaurant(restaurant);

    // Save the Custom action
    restaurantObj.save(function () {
      request(app).get('/api/restaurants/' + restaurantObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', restaurant.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/restaurants/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/restaurants/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(200)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Handle Custom action save error
            if (restaurantSaveErr) {
              return done(restaurantSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/restaurants/' + restaurantSaveRes.body._id)
              .send(restaurant)
              .expect(200)
              .end(function (restaurantDeleteErr, restaurantDeleteRes) {
                // Handle restaurant error error
                if (restaurantDeleteErr) {
                  return done(restaurantDeleteErr);
                }

                // Set assertions
                (restaurantDeleteRes.body._id).should.equal(restaurantSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    restaurant.user = user;

    // Create new Custom action model instance
    var restaurantObj = new Restaurant(restaurant);

    // Save the Custom action
    restaurantObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/restaurants/' + restaurantObj._id)
        .expect(403)
        .end(function (restaurantDeleteErr, restaurantDeleteRes) {
          // Set message assertion
          (restaurantDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(restaurantDeleteErr);
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
          agent.post('/api/restaurants')
            .send(restaurant)
            .expect(200)
            .end(function (restaurantSaveErr, restaurantSaveRes) {
              // Handle Custom action save error
              if (restaurantSaveErr) {
                return done(restaurantSaveErr);
              }

              // Set assertions on new Custom action
              (restaurantSaveRes.body.name).should.equal(restaurant.name);
              should.exist(restaurantSaveRes.body.user);
              should.equal(restaurantSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/restaurants/' + restaurantSaveRes.body._id)
                      .expect(200)
                      .end(function (restaurantInfoErr, restaurantInfoRes) {
                        // Handle Custom action error
                        if (restaurantInfoErr) {
                          return done(restaurantInfoErr);
                        }

                        // Set assertions
                        (restaurantInfoRes.body._id).should.equal(restaurantSaveRes.body._id);
                        (restaurantInfoRes.body.name).should.equal(restaurant.name);
                        should.equal(restaurantInfoRes.body.user, undefined);

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
      Restaurant.remove().exec(done);
    });
  });
});
