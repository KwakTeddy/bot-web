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
 * Campaign routes tests
 */
describe('Campaign CRUD tests', function () {

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

    // Save a user to the test db and create new campaign
    user.save(function () {
      campaign = {
        title: 'Campaign Title',
        content: 'Campaign Content'
      };

      done();
    });
  });

  it('should be able to save an campaign if logged in', function (done) {
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

        // Save a new campaign
        agent.post('/api/campaigns')
          .send(campaign)
          .expect(200)
          .end(function (campaignSaveErr, campaignSaveRes) {
            // Handle campaign save error
            if (campaignSaveErr) {
              return done(campaignSaveErr);
            }

            // Get a list of campaigns
            agent.get('/api/campaigns')
              .end(function (campaignsGetErr, campaignsGetRes) {
                // Handle campaign save error
                if (campaignsGetErr) {
                  return done(campaignsGetErr);
                }

                // Get campaigns list
                var campaigns = campaignsGetRes.body;

                // Set assertions
                (campaigns[0].user._id).should.equal(userId);
                (campaigns[0].title).should.match('Campaign Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an campaign if not logged in', function (done) {
    agent.post('/api/campaigns')
      .send(campaign)
      .expect(403)
      .end(function (campaignSaveErr, campaignSaveRes) {
        // Call the assertion callback
        done(campaignSaveErr);
      });
  });

  it('should not be able to save an campaign if no title is provided', function (done) {
    // Invalidate title field
    campaign.title = '';

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

        // Save a new campaign
        agent.post('/api/campaigns')
          .send(campaign)
          .expect(400)
          .end(function (campaignSaveErr, campaignSaveRes) {
            // Set message assertion
            (campaignSaveRes.body.message).should.match('Title cannot be blank');

            // Handle campaign save error
            done(campaignSaveErr);
          });
      });
  });

  it('should be able to update an campaign if signed in', function (done) {
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

        // Save a new campaign
        agent.post('/api/campaigns')
          .send(campaign)
          .expect(200)
          .end(function (campaignSaveErr, campaignSaveRes) {
            // Handle campaign save error
            if (campaignSaveErr) {
              return done(campaignSaveErr);
            }

            // Update campaign title
            campaign.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing campaign
            agent.put('/api/campaigns/' + campaignSaveRes.body._id)
              .send(campaign)
              .expect(200)
              .end(function (campaignUpdateErr, campaignUpdateRes) {
                // Handle campaign update error
                if (campaignUpdateErr) {
                  return done(campaignUpdateErr);
                }

                // Set assertions
                (campaignUpdateRes.body._id).should.equal(campaignSaveRes.body._id);
                (campaignUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of campaigns if not signed in', function (done) {
    // Create new campaign model instance
    var campaignObj = new Campaign(campaign);

    // Save the campaign
    campaignObj.save(function () {
      // Request campaigns
      request(app).get('/api/campaigns')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single campaign if not signed in', function (done) {
    // Create new campaign model instance
    var campaignObj = new Campaign(campaign);

    // Save the campaign
    campaignObj.save(function () {
      request(app).get('/api/campaigns/' + campaignObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', campaign.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single campaign with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/campaigns/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Campaign is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single campaign which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent campaign
    request(app).get('/api/campaigns/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No campaign with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an campaign if signed in', function (done) {
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

        // Save a new campaign
        agent.post('/api/campaigns')
          .send(campaign)
          .expect(200)
          .end(function (campaignSaveErr, campaignSaveRes) {
            // Handle campaign save error
            if (campaignSaveErr) {
              return done(campaignSaveErr);
            }

            // Delete an existing campaign
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

  it('should not be able to delete an campaign if not signed in', function (done) {
    // Set campaign user
    campaign.user = user;

    // Create new campaign model instance
    var campaignObj = new Campaign(campaign);

    // Save the campaign
    campaignObj.save(function () {
      // Try deleting campaign
      request(app).delete('/api/campaigns/' + campaignObj._id)
        .expect(403)
        .end(function (campaignDeleteErr, campaignDeleteRes) {
          // Set message assertion
          (campaignDeleteRes.body.message).should.match('User is not authorized');

          // Handle campaign error error
          done(campaignDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Campaign.remove().exec(done);
    });
  });
});
