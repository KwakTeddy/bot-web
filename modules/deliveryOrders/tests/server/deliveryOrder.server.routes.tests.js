'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  DeliveryOrder = mongoose.model('DeliveryOrder'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, deliveryOrder;

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
      deliveryOrder = {
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
        agent.post('/api/deliveryOrders')
          .send(deliveryOrder)
          .expect(200)
          .end(function (deliveryOrderSaveErr, deliveryOrderSaveRes) {
            // Handle Custom action save error
            if (deliveryOrderSaveErr) {
              return done(deliveryOrderSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/deliveryOrders')
              .end(function (deliveryOrdersGetErr, deliveryOrdersGetRes) {
                // Handle Custom action save error
                if (deliveryOrdersGetErr) {
                  return done(deliveryOrdersGetErr);
                }

                // Get Custom actions list
                var deliveryOrders = deliveryOrdersGetRes.body;

                // Set assertions
                (deliveryOrders[0].user._id).should.equal(userId);
                (deliveryOrders[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/deliveryOrders')
      .send(deliveryOrder)
      .expect(403)
      .end(function (deliveryOrderSaveErr, deliveryOrderSaveRes) {
        // Call the assertion callback
        done(deliveryOrderSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    deliveryOrder.name = '';

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
        agent.post('/api/deliveryOrders')
          .send(deliveryOrder)
          .expect(400)
          .end(function (deliveryOrderSaveErr, deliveryOrderSaveRes) {
            // Set message assertion
            (deliveryOrderSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(deliveryOrderSaveErr);
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
        agent.post('/api/deliveryOrders')
          .send(deliveryOrder)
          .expect(200)
          .end(function (deliveryOrderSaveErr, deliveryOrderSaveRes) {
            // Handle Custom action save error
            if (deliveryOrderSaveErr) {
              return done(deliveryOrderSaveErr);
            }

            // Update Custom action name
            deliveryOrder.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/deliveryOrders/' + deliveryOrderSaveRes.body._id)
              .send(deliveryOrder)
              .expect(200)
              .end(function (deliveryOrderUpdateErr, deliveryOrderUpdateRes) {
                // Handle Custom action update error
                if (deliveryOrderUpdateErr) {
                  return done(deliveryOrderUpdateErr);
                }

                // Set assertions
                (deliveryOrderUpdateRes.body._id).should.equal(deliveryOrderSaveRes.body._id);
                (deliveryOrderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var deliveryOrderObj = new DeliveryOrder(deliveryOrder);

    // Save the deliveryOrder
    deliveryOrderObj.save(function () {
      // Request Custom actions
      request(app).get('/api/deliveryOrders')
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
    var deliveryOrderObj = new DeliveryOrder(deliveryOrder);

    // Save the Custom action
    deliveryOrderObj.save(function () {
      request(app).get('/api/deliveryOrders/' + deliveryOrderObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', deliveryOrder.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/deliveryOrders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/deliveryOrders/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/deliveryOrders')
          .send(deliveryOrder)
          .expect(200)
          .end(function (deliveryOrderSaveErr, deliveryOrderSaveRes) {
            // Handle Custom action save error
            if (deliveryOrderSaveErr) {
              return done(deliveryOrderSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/deliveryOrders/' + deliveryOrderSaveRes.body._id)
              .send(deliveryOrder)
              .expect(200)
              .end(function (deliveryOrderDeleteErr, deliveryOrderDeleteRes) {
                // Handle deliveryOrder error error
                if (deliveryOrderDeleteErr) {
                  return done(deliveryOrderDeleteErr);
                }

                // Set assertions
                (deliveryOrderDeleteRes.body._id).should.equal(deliveryOrderSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    deliveryOrder.user = user;

    // Create new Custom action model instance
    var deliveryOrderObj = new DeliveryOrder(deliveryOrder);

    // Save the Custom action
    deliveryOrderObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/deliveryOrders/' + deliveryOrderObj._id)
        .expect(403)
        .end(function (deliveryOrderDeleteErr, deliveryOrderDeleteRes) {
          // Set message assertion
          (deliveryOrderDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(deliveryOrderDeleteErr);
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
          agent.post('/api/deliveryOrders')
            .send(deliveryOrder)
            .expect(200)
            .end(function (deliveryOrderSaveErr, deliveryOrderSaveRes) {
              // Handle Custom action save error
              if (deliveryOrderSaveErr) {
                return done(deliveryOrderSaveErr);
              }

              // Set assertions on new Custom action
              (deliveryOrderSaveRes.body.name).should.equal(deliveryOrder.name);
              should.exist(deliveryOrderSaveRes.body.user);
              should.equal(deliveryOrderSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/deliveryOrders/' + deliveryOrderSaveRes.body._id)
                      .expect(200)
                      .end(function (deliveryOrderInfoErr, deliveryOrderInfoRes) {
                        // Handle Custom action error
                        if (deliveryOrderInfoErr) {
                          return done(deliveryOrderInfoErr);
                        }

                        // Set assertions
                        (deliveryOrderInfoRes.body._id).should.equal(deliveryOrderSaveRes.body._id);
                        (deliveryOrderInfoRes.body.name).should.equal(deliveryOrder.name);
                        should.equal(deliveryOrderInfoRes.body.user, undefined);

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
      DeliveryOrder.remove().exec(done);
    });
  });
});
