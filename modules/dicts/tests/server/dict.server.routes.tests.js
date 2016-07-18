'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Dict = mongoose.model('Dict'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, dict;

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
      dict = {
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
        agent.post('/api/dicts')
          .send(dict)
          .expect(200)
          .end(function (dictSaveErr, dictSaveRes) {
            // Handle Custom action save error
            if (dictSaveErr) {
              return done(dictSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/dicts')
              .end(function (dictsGetErr, dictsGetRes) {
                // Handle Custom action save error
                if (dictsGetErr) {
                  return done(dictsGetErr);
                }

                // Get Custom actions list
                var dicts = dictsGetRes.body;

                // Set assertions
                (dicts[0].user._id).should.equal(userId);
                (dicts[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/dicts')
      .send(dict)
      .expect(403)
      .end(function (dictSaveErr, dictSaveRes) {
        // Call the assertion callback
        done(dictSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    dict.name = '';

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
        agent.post('/api/dicts')
          .send(dict)
          .expect(400)
          .end(function (dictSaveErr, dictSaveRes) {
            // Set message assertion
            (dictSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(dictSaveErr);
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
        agent.post('/api/dicts')
          .send(dict)
          .expect(200)
          .end(function (dictSaveErr, dictSaveRes) {
            // Handle Custom action save error
            if (dictSaveErr) {
              return done(dictSaveErr);
            }

            // Update Custom action name
            dict.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/dicts/' + dictSaveRes.body._id)
              .send(dict)
              .expect(200)
              .end(function (dictUpdateErr, dictUpdateRes) {
                // Handle Custom action update error
                if (dictUpdateErr) {
                  return done(dictUpdateErr);
                }

                // Set assertions
                (dictUpdateRes.body._id).should.equal(dictSaveRes.body._id);
                (dictUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var dictObj = new Dict(dict);

    // Save the dict
    dictObj.save(function () {
      // Request Custom actions
      request(app).get('/api/dicts')
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
    var dictObj = new Dict(dict);

    // Save the Custom action
    dictObj.save(function () {
      request(app).get('/api/dicts/' + dictObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', dict.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/dicts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/dicts/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/dicts')
          .send(dict)
          .expect(200)
          .end(function (dictSaveErr, dictSaveRes) {
            // Handle Custom action save error
            if (dictSaveErr) {
              return done(dictSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/dicts/' + dictSaveRes.body._id)
              .send(dict)
              .expect(200)
              .end(function (dictDeleteErr, dictDeleteRes) {
                // Handle dict error error
                if (dictDeleteErr) {
                  return done(dictDeleteErr);
                }

                // Set assertions
                (dictDeleteRes.body._id).should.equal(dictSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    dict.user = user;

    // Create new Custom action model instance
    var dictObj = new Dict(dict);

    // Save the Custom action
    dictObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/dicts/' + dictObj._id)
        .expect(403)
        .end(function (dictDeleteErr, dictDeleteRes) {
          // Set message assertion
          (dictDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(dictDeleteErr);
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
          agent.post('/api/dicts')
            .send(dict)
            .expect(200)
            .end(function (dictSaveErr, dictSaveRes) {
              // Handle Custom action save error
              if (dictSaveErr) {
                return done(dictSaveErr);
              }

              // Set assertions on new Custom action
              (dictSaveRes.body.name).should.equal(dict.name);
              should.exist(dictSaveRes.body.user);
              should.equal(dictSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/dicts/' + dictSaveRes.body._id)
                      .expect(200)
                      .end(function (dictInfoErr, dictInfoRes) {
                        // Handle Custom action error
                        if (dictInfoErr) {
                          return done(dictInfoErr);
                        }

                        // Set assertions
                        (dictInfoRes.body._id).should.equal(dictSaveRes.body._id);
                        (dictInfoRes.body.name).should.equal(dict.name);
                        should.equal(dictInfoRes.body.user, undefined);

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
      Dict.remove().exec(done);
    });
  });
});
