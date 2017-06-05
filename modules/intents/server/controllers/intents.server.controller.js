'use strict';


var path = require('path');
var dialogset = require(path.resolve('modules/bot/engine/dialogset/dialogset'));
var intentModule = require(path.resolve('modules/bot/engine/nlu/intent'));

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Intent = mongoose.model('Intent'),
  IntentContent = mongoose.model('IntentContent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var util = require('util'); //temporary
var async = require('async');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var query = {botId: req.body.botName, user: req.user._id, name: req.body.name};
  Intent.findOne(query, function (err, result) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      if (!result) {
        if (req.body.content){
          var intent = new Intent();
          intent.botId = req.body.botName;
          intent.name = req.body.name;
          intent.user = req.user;

          async.eachSeries(req.body.content, function(content, cb) {
            console.log(util.inspect(content));
            dialogset.processInput(null, content.name, function (_input, _json) {
              content['input'] = _input;
              content['intentId'] =intent._id ;
              content['botId'] = req.body.botName;
              content['user'] = req.user._id;
              cb(null);
            });
          }, function(err) {
            if (err){
              console.log(err);
            }else {
              intent.save(function (err) {
                if (err) {
                  console.log(err);
                  return res.status(400).send({
                    message: err
                  });
                } else {
                  IntentContent.collection.insert(req.body.content, function (err, result) {
                    if(err){
                      console.log(util.inspect(err))
                    }else {
                      intentModule.saveIntentTopics(intent.botId, function () {
                        res.jsonp(intent);
                      });
                    }
                  })
                }
              });

            }
          });
        }else {
          res.send({
            message: '적어도 하나의 인텐트 내용을 입력해주세요'
          })
        }
      }else {
        res.status(400).send({
          message: '동일한 이름의 인텐트가 존재합니다'
        });
      }
    }
  })
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  console.log('noenownowneo-------------------------------------------------')
  // convert mongoose document to JSON
  var intent = req.intent ? req.intent.toJSON() : {};

  if (/*req.user && intent.user && (String(req.user._id) == String(intent.user._id)) && */(req.intent.botId == req.params.botName)){
    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    intent.isCurrentUserOwner = req.user && intent.user && intent.user._id.toString() === req.user._id.toString() ? true : false;

    IntentContent.find({intentId: intent._id}, function (err, result) {
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else {
        // console.log(JSON.stringify(result));
        intent.content = result;
        // console.log(util.inspect(intent));
        res.jsonp(intent);
      }
    })
  }else {
    return res.end();
  }
};



/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  if (req.body.name){
    Intent.find({botId: req.body.botId, name: req.body.name, _id: {$ne: req.body._id}}).exec(function (err, result) {
      if (err){
        console.log(err)
      }else {
        if (result.length){
          return res.status(400).send({
            message: '동일한 이름의 인텐트가 존재합니다'
          })
        }else {
          var intent = req.intent ;
          // console.log(util.inspect(intent));
          // console.log(util.inspect(req.body));
          intent = _.extend(intent , req.body);
          intent.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {

              // async.eachSeries(req.body.content, function(content, cb) {
              //   console.log(util.inspect(content));
              //   IntentContent.update({_id: content._id}, {input: })
              //
              // }, function(err) {
              //   if (err){
              //     console.log(err);
              //   }else {
              //
              //   }
              // });
              res.jsonp(intent);
            };
          });
        }
      }
    })
  }else {
    return res.status(400).send({
      message: '인텐트 이름이 빈 칸입니다'
    })
  }
};



/**
 * Update a Custom action
 */
exports.contentUpdate = function(req, res) {
  if (req.body.name){
    IntentContent.find({
      name: req.body.name,
      intentId: req.body.intentId,
      _id: {$ne: req.body._id}
    }).exec(function (err, result) {
      if (err){
        console.log(err)
      }else {
        if (result.length){
          return res.status(400).send({
            message: '동일한 이름의 인텐트가 존재합니다'
          })
        }else {
          IntentContent.findOne({_id: req.body._id}).exec(function (err, data) {
            if (err){
              console.log(err)
            }else {

              dialogset.processInput(null, req.body.name, function (_input, _json) {
                data.name = req.body.name;
                data.input = _input;
                data.save(function (err, data2) {
                  if (err){
                    console.log(err)
                  }else {
                    console.log(util.inspect(data2))
                    res.json(data2);
                  }
                })
              });
            }
          })
        }
      }
    });
  }else {
    return res.status(400).send({
      message: '인텐트 내용이 빈 칸입니다'
    })
  }
};


/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var intent = req.intent ;
  IntentContent.find({intentId: req.intent._id}).exec(function (err, result) {
    if (err){
      console.log(err)
    }else {
      var contentIds = [];
      for(var i = 0; i < result.length; i++){
        contentIds.push(result[i]._id)
      }
      IntentContent.remove({_id: {$in: contentIds}}).exec(function (err, result) {
        if (err){
          console.log(err)
        }else {
          intent.remove(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(intent);
            }
          });
        }
      })
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) {
  Intent.find({botId: req.params.botName}).sort('-created').populate('user', 'displayName').exec(function(err, intents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(util.inspect(intents));
      console.log('-----------3========2=========------')
      res.jsonp(intents);
    }
  });
};

/**
 * Custom action middleware
 */
exports.intentByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Intent.findById(id).populate('user', 'displayName').exec(function (err, intent) {
    if (err) {
      return next(err);
    } else if (!intent) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.intent = intent;
    next();
  });
};

/**
 * Create a Custom action
 */
exports.contentCreate = function(req, res) {
  if ((typeof req.body.content !== 'string')){
    var i = 0;
    async.eachSeries(req.body.content, function(c, cb) {
      req.body.content[i]['user'] = req.user._id;
      req.body.content[i]['name'] = req.body.content[i].userDialog.dialog;
      req.body.content[i]['intentId'] = req.body.intentId;

      dialogset.processInput(null, req.body.content[i]['name'], function(_input, _json) {
        req.body.content[i]['input'] = _input;

        i++;
        cb(null);
      });
    }, function(err) {
      IntentContent.create(req.body.content, function (err, data) {
        if(err){
          console.log(err)
        }else {
          res.end();
        }
      })
    })

  }else {
    IntentContent.find({user: req.user._id, intentId: req.body.intentId, name: req.body.content}).exec(function (err, data) {
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else {
        if(!data.length){
          var intentContent = new IntentContent();
          intentContent.name = req.body.content;
          intentContent.user = req.user;
          intentContent.intentId = req.body.intentId;
          intentContent.botId = req.body.botId;

          dialogset.processInput(null, req.body.content, function(_input, _json) {
            intentContent.input = _input;

            intentContent.save(function (err, data) {
              if(err){
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              }else {
                intentModule.saveIntentTopics(intentContent.botId, function() {
                  res.jsonp(data);
                });
              }
            });
          });

        }else {
          return res.status(400).send({
            message: '동일한 내용이 존재합니다.'
          });
        }
      }
    })
  }
};


/**
 * Delete an Custom action
 */
exports.contentDelete = function(req, res) {
  IntentContent.remove({_id: req.query.contentId}, function (err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(data);
    }
  })
};
