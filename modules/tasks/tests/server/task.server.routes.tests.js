'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Task = mongoose.model('Task'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, task;

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
      task = {
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
        agent.post('/api/tasks')
          .send(task)
          .expect(200)
          .end(function (taskSaveErr, taskSaveRes) {
            // Handle Custom action save error
            if (taskSaveErr) {
              return done(taskSaveErr);
            }

            // Get a list of Custom actions
            agent.get('/api/tasks')
              .end(function (tasksGetErr, tasksGetRes) {
                // Handle Custom action save error
                if (tasksGetErr) {
                  return done(tasksGetErr);
                }

                // Get Custom actions list
                var tasks = tasksGetRes.body;

                // Set assertions
                (tasks[0].user._id).should.equal(userId);
                (tasks[0].name).should.match('Custom action name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Custom action if not logged in', function (done) {
    agent.post('/api/tasks')
      .send(task)
      .expect(403)
      .end(function (taskSaveErr, taskSaveRes) {
        // Call the assertion callback
        done(taskSaveErr);
      });
  });

  it('should not be able to save an Custom action if no name is provided', function (done) {
    // Invalidate name field
    task.name = '';

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
        agent.post('/api/tasks')
          .send(task)
          .expect(400)
          .end(function (taskSaveErr, taskSaveRes) {
            // Set message assertion
            (taskSaveRes.body.message).should.match('Please fill Custom action name');

            // Handle Custom action save error
            done(taskSaveErr);
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
        agent.post('/api/tasks')
          .send(task)
          .expect(200)
          .end(function (taskSaveErr, taskSaveRes) {
            // Handle Custom action save error
            if (taskSaveErr) {
              return done(taskSaveErr);
            }

            // Update Custom action name
            task.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Custom action
            agent.put('/api/tasks/' + taskSaveRes.body._id)
              .send(task)
              .expect(200)
              .end(function (taskUpdateErr, taskUpdateRes) {
                // Handle Custom action update error
                if (taskUpdateErr) {
                  return done(taskUpdateErr);
                }

                // Set assertions
                (taskUpdateRes.body._id).should.equal(taskSaveRes.body._id);
                (taskUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Custom actions if not signed in', function (done) {
    // Create new Custom action model instance
    var taskObj = new Task(task);

    // Save the task
    taskObj.save(function () {
      // Request Custom actions
      request(app).get('/api/tasks')
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
    var taskObj = new Task(task);

    // Save the Custom action
    taskObj.save(function () {
      request(app).get('/api/tasks/' + taskObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', task.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Custom action with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tasks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Custom action is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Custom action which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Custom action
    request(app).get('/api/tasks/559e9cd815f80b4c256a8f41')
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
        agent.post('/api/tasks')
          .send(task)
          .expect(200)
          .end(function (taskSaveErr, taskSaveRes) {
            // Handle Custom action save error
            if (taskSaveErr) {
              return done(taskSaveErr);
            }

            // Delete an existing Custom action
            agent.delete('/api/tasks/' + taskSaveRes.body._id)
              .send(task)
              .expect(200)
              .end(function (taskDeleteErr, taskDeleteRes) {
                // Handle task error error
                if (taskDeleteErr) {
                  return done(taskDeleteErr);
                }

                // Set assertions
                (taskDeleteRes.body._id).should.equal(taskSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Custom action if not signed in', function (done) {
    // Set Custom action user
    task.user = user;

    // Create new Custom action model instance
    var taskObj = new Task(task);

    // Save the Custom action
    taskObj.save(function () {
      // Try deleting Custom action
      request(app).delete('/api/tasks/' + taskObj._id)
        .expect(403)
        .end(function (taskDeleteErr, taskDeleteRes) {
          // Set message assertion
          (taskDeleteRes.body.message).should.match('User is not authorized');

          // Handle Custom action error error
          done(taskDeleteErr);
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
          agent.post('/api/tasks')
            .send(task)
            .expect(200)
            .end(function (taskSaveErr, taskSaveRes) {
              // Handle Custom action save error
              if (taskSaveErr) {
                return done(taskSaveErr);
              }

              // Set assertions on new Custom action
              (taskSaveRes.body.name).should.equal(task.name);
              should.exist(taskSaveRes.body.user);
              should.equal(taskSaveRes.body.user._id, orphanId);

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
                    agent.get('/api/tasks/' + taskSaveRes.body._id)
                      .expect(200)
                      .end(function (taskInfoErr, taskInfoRes) {
                        // Handle Custom action error
                        if (taskInfoErr) {
                          return done(taskInfoErr);
                        }

                        // Set assertions
                        (taskInfoRes.body._id).should.equal(taskSaveRes.body._id);
                        (taskInfoRes.body.name).should.equal(task.name);
                        should.equal(taskInfoRes.body.user, undefined);

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
      Task.remove().exec(done);
    });
  });
});
