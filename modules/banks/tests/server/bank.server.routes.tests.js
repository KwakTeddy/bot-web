'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Bank = mongoose.model('Bank'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, bank;

/**
 * Bank routes tests
 */
describe('Bank CRUD tests', function () {

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

    // Save a user to the test db and create new Bank
    user.save(function () {
      bank = {
        name: 'Bank name'
      };

      done();
    });
  });

  it('should be able to save a Bank if logged in', function (done) {
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

        // Save a new Bank
        agent.post('/api/banks')
          .send(bank)
          .expect(200)
          .end(function (bankSaveErr, bankSaveRes) {
            // Handle Bank save error
            if (bankSaveErr) {
              return done(bankSaveErr);
            }

            // Get a list of Banks
            agent.get('/api/banks')
              .end(function (banksGetErr, banksGetRes) {
                // Handle Bank save error
                if (banksGetErr) {
                  return done(banksGetErr);
                }

                // Get Banks list
                var banks = banksGetRes.body;

                // Set assertions
                (banks[0].user._id).should.equal(userId);
                (banks[0].name).should.match('Bank name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Bank if not logged in', function (done) {
    agent.post('/api/banks')
      .send(bank)
      .expect(403)
      .end(function (bankSaveErr, bankSaveRes) {
        // Call the assertion callback
        done(bankSaveErr);
      });
  });

  it('should not be able to save an Bank if no name is provided', function (done) {
    // Invalidate name field
    bank.name = '';

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

        // Save a new Bank
        agent.post('/api/banks')
          .send(bank)
          .expect(400)
          .end(function (bankSaveErr, bankSaveRes) {
            // Set message assertion
            (bankSaveRes.body.message).should.match('Please fill Bank name');

            // Handle Bank save error
            done(bankSaveErr);
          });
      });
  });

  it('should be able to update an Bank if signed in', function (done) {
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

        // Save a new Bank
        agent.post('/api/banks')
          .send(bank)
          .expect(200)
          .end(function (bankSaveErr, bankSaveRes) {
            // Handle Bank save error
            if (bankSaveErr) {
              return done(bankSaveErr);
            }

            // Update Bank name
            bank.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Bank
            agent.put('/api/banks/' + bankSaveRes.body._id)
              .send(bank)
              .expect(200)
              .end(function (bankUpdateErr, bankUpdateRes) {
                // Handle Bank update error
                if (bankUpdateErr) {
                  return done(bankUpdateErr);
                }

                // Set assertions
                (bankUpdateRes.body._id).should.equal(bankSaveRes.body._id);
                (bankUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Banks if not signed in', function (done) {
    // Create new Bank model instance
    var bankObj = new Bank(bank);

    // Save the bank
    bankObj.save(function () {
      // Request Banks
      request(app).get('/api/banks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Bank if not signed in', function (done) {
    // Create new Bank model instance
    var bankObj = new Bank(bank);

    // Save the Bank
    bankObj.save(function () {
      request(app).get('/api/banks/' + bankObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', bank.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Bank with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/banks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bank is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Bank which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Bank
    request(app).get('/api/banks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Bank with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Bank if signed in', function (done) {
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

        // Save a new Bank
        agent.post('/api/banks')
          .send(bank)
          .expect(200)
          .end(function (bankSaveErr, bankSaveRes) {
            // Handle Bank save error
            if (bankSaveErr) {
              return done(bankSaveErr);
            }

            // Delete an existing Bank
            agent.delete('/api/banks/' + bankSaveRes.body._id)
              .send(bank)
              .expect(200)
              .end(function (bankDeleteErr, bankDeleteRes) {
                // Handle bank error error
                if (bankDeleteErr) {
                  return done(bankDeleteErr);
                }

                // Set assertions
                (bankDeleteRes.body._id).should.equal(bankSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Bank if not signed in', function (done) {
    // Set Bank user
    bank.user = user;

    // Create new Bank model instance
    var bankObj = new Bank(bank);

    // Save the Bank
    bankObj.save(function () {
      // Try deleting Bank
      request(app).delete('/api/banks/' + bankObj._id)
        .expect(403)
        .end(function (bankDeleteErr, bankDeleteRes) {
          // Set message assertion
          (bankDeleteRes.body.message).should.match('User is not authorized');

          // Handle Bank error error
          done(bankDeleteErr);
        });

    });
  });

  it('should be able to get a single Bank that has an orphaned user reference', function (done) {
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

          // Save a new Bank
          agent.post('/api/banks')
            .send(bank)
            .expect(200)
            .end(function (bankSaveErr, bankSaveRes) {
              // Handle Bank save error
              if (bankSaveErr) {
                return done(bankSaveErr);
              }

              // Set assertions on new Bank
              (bankSaveRes.body.name).should.equal(bank.name);
              should.exist(bankSaveRes.body.user);
              should.equal(bankSaveRes.body.user._id, orphanId);

              // force the Bank to have an orphaned user reference
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

                    // Get the Bank
                    agent.get('/api/banks/' + bankSaveRes.body._id)
                      .expect(200)
                      .end(function (bankInfoErr, bankInfoRes) {
                        // Handle Bank error
                        if (bankInfoErr) {
                          return done(bankInfoErr);
                        }

                        // Set assertions
                        (bankInfoRes.body._id).should.equal(bankSaveRes.body._id);
                        (bankInfoRes.body.name).should.equal(bank.name);
                        should.equal(bankInfoRes.body.user, undefined);

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
      Bank.remove().exec(done);
    });
  });
});
