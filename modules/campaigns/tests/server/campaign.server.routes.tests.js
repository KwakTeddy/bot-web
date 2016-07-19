'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Campaign = mongoose.model('Campaign'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, campaign;

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
      campaign = {
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
        agent.post('/api/campaigns')
          .send(campaign)
          .expect(200)
          .end(function (campaignSaveErr, campaignSaveRes) {
            // Handle Custom action save error
            if (campaignSaveErr) {
              return done(campaignSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/campaigns')
              .end(function (campaignsGetErr, campaignsGetRes) {
                // Handle Custom action save error
                if (campaignsGetErr) {
                  return done(campaignsGetErr);
                }

                // Get Custom actions list
                var campaigns = campaignsGetRes.body;

                // Set assertions
                (campaigns[0].user._id).should.equal(userId);
                (campaigns[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/campaigns')
      .send(campaign)
      .expect(403)
      .end(function (campaignSaveErr, campaignSaveRes) {
        // Call the assertion callback
        done(campaignSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    campaign.name = '';

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
        agent.post('/api/campaigns')
          .send(campaign)
          .expect(400)
          .end(function (campaignSaveErr, campaignSaveRes) {
            // Set message assertion
            (campaignSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(campaignSaveErr);
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
        agent.post('/api/campaigns')
          .send(campaign)
          .expect(200)
          .end(function (campaignSaveErr, campaignSaveRes) {
            // Handle Custom action save error
            if (campaignSaveErr) {
              return done(campaignSaveErr);
            }

            // Update Custom action name
            campaign.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/campaigns/' + campaignSaveRes.body._id)
              .send(campaign)
              .expect(200)
              .end(function (campaignUpdateErr, campaignUpdateRes) {
                // Handle Custom action update error
                if (campaignUpdateErr) {
                  return done(campaignUpdateErr);
                }

                // Set assertions
                (campaignUpdateRes.body._id).should.equal(campaignSaveRes.body._id);
                (campaignUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var campaignObj = new Campaign(campaign);

    // Save the campaign
    campaignObj.save(function () {
      // Request Custom actions
      request(app).get('/api/campaigns')
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
    var campaignObj = new Campaign(campaign);

    // Save the Custom action
    campaignObj.save(function () {
      request(app).get('/api/campaigns/' + campaignObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', campaign.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/campaigns/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/campaigns/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/campaigns')
          .send(campaign)
          .expect(200)
          .end(function (campaignSaveErr, campaignSaveRes) {
            // Handle Custom action save error
            if (campaignSaveErr) {
              return done(campaignSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/campaigns/' + campaignSaveRes.body._id)
              .send(campaign)
              .expect(200)
              .end(function (campaignDeleteErr, campaignDeleteRes) {
                // Handle campaign error error
                if (campaignDeleteErr) {
                  return done(campaignDeleteErr);
                }

                // Set assertions
                (campaignDeleteRes.body._id).should.equal(campaignSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    campaign.user = user;

    // Create new Custom action model instance
    var campaignObj = new Campaign(campaign);

    // Save the Custom action
    campaignObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/campaigns/' + campaignObj._id)
        .expect(403)
        .end(function (campaignDeleteErr, campaignDeleteRes) {
          // Set message assertion
          (campaignDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(campaignDeleteErr);
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
          agent.post('/api/campaigns')
            .send(campaign)
            .expect(200)
            .end(function (campaignSaveErr, campaignSaveRes) {
              // Handle Custom action save error
              if (campaignSaveErr) {
                return done(campaignSaveErr);
              }

              // Set assertions on new Custom action
              (campaignSaveRes.body.name).should.equal(campaign.name);
              should.exist(campaignSaveRes.body.user);
              should.equal(campaignSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/campaigns/' + campaignSaveRes.body._id)
                      .expect(200)
                      .end(function (campaignInfoErr, campaignInfoRes) {
                        // Handle Custom action error
                        if (campaignInfoErr) {
                          return done(campaignInfoErr);
                        }

                        // Set assertions
                        (campaignInfoRes.body._id).should.equal(campaignSaveRes.body._id);
                        (campaignInfoRes.body.name).should.equal(campaign.name);
                        should.equal(campaignInfoRes.body.user, undefined);

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
      Campaign.remove().exec(done);
    });
  });
});
