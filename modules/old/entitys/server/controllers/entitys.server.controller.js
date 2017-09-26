'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Entity = mongoose.model('Entity'),
  EntityContent = mongoose.model('EntityContent'),
  EntityContent = mongoose.model('EntityContent'),
  EntityContentSynonym = mongoose.model('EntityContentSynonym'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var util = require('util'); //temporary

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  console.log('----------------------------');

  var query = {botId: req.body.botName, user: req.user._id, name: req.body.name};
  Entity.findOne(query, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: err
      });
    } else {
      if (!result){
        if (req.body.content){
          var entity = new Entity();
          entity.botId = req.body.botName;
          entity.name = req.body.name;
          entity.user = req.user;
          entity.save(function (err) {
            if (err) {
              console.log(err);
              return res.status(400).send({
                message: err
              });
            } else {
              var synonym = [];
              for(var i = 0; i < req.body.content.length; i++){
                if(req.body.content[i].syn.length){
                  for(var j = 0; j < req.body.content[i].syn.length; j++){
                    var unit = {};
                    unit['name'] = req.body.content[i].syn[j].name;
                    unit['contentId'] = req.body.content[i].name;
                    unit['entityId'] = entity._id;
                    unit['botId'] = req.body.botName;
                    synonym.push(unit);
                  }
                }
                req.body.content[i]['entityId'] = entity._id ;
                req.body.content[i]['botId'] = req.body.botName;
                req.body.content[i]['user'] = req.user._id;
                delete req.body.content[i].syn;
              }
              EntityContent.collection.insert(req.body.content, function (err, result) {
                if(err){
                  console.log(util.inspect(err))
                }else {
                  for(var h = 0; h < result.ops.length; h++){
                    for(var k = 0; k < synonym.length; k++){
                      if (result.ops[h].name == synonym[k].contentId){
                        synonym[k].contentId = result.ops[h]._id
                      }
                    }
                  }
                  EntityContentSynonym.collection.insert(synonym, function (err, result2) {
                    if(err){
                      console.log(err)
                    }else {
                      res.jsonp(entity);
                    }
                  });
                }
              })
            }
          });
        }else {
          res.status(400).send({
            message: '적어도 하나의 엔터티 내용을 입력해주세요'
          })
        }
      }else {
        return res.status(400).send({
          message:  '\'' + req.body.name + '\'' +' 이름의 엔터티가 존재합니다. 다른 이름으로 생성해주세요'
        });
      }
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var entity = req.entity ? req.entity.toJSON() : {};
  console.log(util.inspect(entity));

  if (/*req.user && entity.user && (String(req.user._id) == String(entity.user._id)) && */(req.entity.botId == req.params.botName)) {
    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    entity.isCurrentUserOwner = req.user && entity.user && entity.user._id.toString() === req.user._id.toString() ? true : false;

    EntityContent.find({entityId: entity._id}, function (err, result) {
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else {
        var contentIds = []
        for(var k = 0; k < result.length; k++){
          contentIds.push(result[k]._id)
        }
        console.log(util.inspect(contentIds));
        EntityContentSynonym.find({contentId: {$in : contentIds}}, function (err2, result2) {
          if(err2){
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err2)
            });
          }else {
            console.log(util.inspect(result));
            console.log(util.inspect(result2));
            console.log('9494949494--===========================')
            for(var i = 0; i < result.length; i++){
              for(var j = 0; j < result2.length; j++){
                console.log(result2[j].contentId)
                if (result2[j].contentId.toString() == result[i]._id.toString()){
                  if(!result[i].syn){
                    result[i]['syn'] = [];
                  }
                  result[i].syn.push(result2[j])
                }
              }
            }
            console.log(util.inspect(result))
            entity.content = result;
            res.jsonp(entity);
          }
        });
      }
    });
  }else {
    return res.end();
  }
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  if (req.body.name){
    Entity.find({botId: req.body.botId, name: req.body.name, _id: {$ne: req.body._id}}).exec(function (err, result) {
      if (err){
        console.log(err)
      }else {
        if(result.length){
          return res.status(400).send({
            message: '동일한 이름의 엔터티가 존재합니다'
          })
        }else {
          var entity = req.entity ;
          entity = _.extend(entity , req.body);

          entity.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(entity);
            }
          });
        }
      }
    });
  }else {
    return res.status(400).send({
      message: '엔터티 이름이 빈 칸입니다'
    })
  }

};

/**
 * Update a Custom action
 */
exports.updateContent = function(req, res) {
  if (req.body.name) {
    EntityContent.find({
      name: req.body.name,
      entityId: req.body.entityId,
      _id: {$ne: req.body._id}
    }).exec(function (error, result) {
      console.log(util.inspect(result));
      if (error) {
        console.log(error)
      } else {
        if (result.length) {
          return res.status(400).send({
            message: '동일한 이름의 엔터티가 존재합니다'
          })
        } else {
          EntityContent.findOne({_id: req.body._id}).exec(function (err, data) {
            if (err) {
              console.log(err)
            } else {
              if (data.name !== req.body.name){
                data.name = req.body.name;
                data.save(function (err) {
                  if (err) {
                    console.log(err)
                  } else {
                    return res.end();
                  }
                })
              }else {
                console.log(util.inspect(data));
                console.log('-------------------------------------------')
                EntityContentSynonym.find({contentId: data._id}).exec(function (err2, data2) {
                  if(err2){
                    console.log(err2)
                  }else {
                    console.log(util.inspect(data2));
                    if (data2.length !== req.body.syn.length){
                      if ( data2.length > req.body.syn.length){
                        // var deleteId = [];
                        // for(var j = 0; j < data2.length; j++){
                        //   deleteId.push(data2[j]._id);
                        //   for(var k = 0; k < req.body.syn.length; k++){
                        //     if ( data2[j]._id !== req.body.syn[k]._id){
                        //
                        //       deleteId.splice(deleteId.indexOf(data2[i]._id), 1)
                        //     }
                        //   }
                        // }
                        for(var i = 0; i < data2.length; i++){
                          data2[i] = data2[i]._id.toString()
                        }
                        for(var i = 0; i < req.body.syn.length; i++){
                          req.body.syn[i] = req.body.syn[i]._id.toString()
                        }

                        var deleteId = data2.filter(function (i) {
                          return req.body.syn.indexOf(i) < 0;
                        })
                        EntityContentSynonym.remove({_id: {$in: deleteId}}).exec(function (err5, data5 ) {
                          if(err5){
                            console.log(err5)
                          }else {
                            return res.end()
                          }
                        })

                      }else {
                        var entityContentSynonym = new EntityContentSynonym;
                        entityContentSynonym.botId = req.body.botId
                        entityContentSynonym.entityId = req.body.entityId
                        entityContentSynonym.contentId = req.body._id
                        entityContentSynonym.name = req.body.syn[req.body.syn.length - 1].name
                        entityContentSynonym.save(function (err3, data3) {
                          if(err3){
                            console.log(err3)
                          }else {
                            return res.end()
                          }
                        })
                      }

                    }else {
                      for(var i = 0; i < data2.length; i++){
                        if(data2[i].name == req.body.syn[i].name){
                          data2[i].name = req.body.syn[i].name
                        }
                      }
                      // data2.save(function (err4, data4) {
                      //   if (err4){
                      //     console.log(err4)
                      //   }else {
                      //     return res.end();
                      //   }
                      // })
                    }
                  }
                })
              }
            }
          })
        }
      }
    });
  }else {
    return res.status(400).send({
      message: '엔터티 내용이 빈 칸입니다'
    })
  }
};


/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var entity = req.entity ;
  EntityContent.find({entityId: req.entity._id}).exec(function (err, result) {
    if (err){
      console.log(err)
    }else {
      var contentIds = [];
      for(var i = 0; i < result.length; i++){
        contentIds.push(result[i]._id)
      }
      EntityContent.remove({_id: {$in: contentIds}}).exec(function (err, result) {
        if (err){
          console.log(err)
        }else {
          entity.remove(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(entity);
            }
          });
        }
      })
    }
  })
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) {
  Entity.find({botId: req.params.botName}).sort('-created').populate('user', 'displayName').exec(function(err, entitys) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entitys);
    }
  });
};


exports.listEntityContents = function(req, res) {
  var Entity = mongoose.model('Entity');

  var entitys = [];
  Entity.find({botId: req.params.botName}).lean().exec(function(err, docs) {
    entitys = docs;
    for(var i in docs) {
      docs[i].name = '@' + docs[i].name;
    }

    var EntityContent = mongoose.model('EntityContent');

    EntityContent.find({botId: req.params.botName}).lean().populate('entityId').exec(function(err, docs) {
      for(var i in docs) {
        docs[i].name = docs[i].name + '@' + (docs[i].entityId ? docs[i].entityId.name : '');
      }

      entitys = entitys.concat(docs);

      res.jsonp(entitys);
    });
  });
};

/**
 * Custom action middleware
 */
exports.entityByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Entity.findById(id).populate('user', 'displayName').exec(function (err, entity) {
    if (err) {
      return next(err);
    } else if (!entity) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.entity = entity;
    next();
  });
};

/**
 * Create a Custom action
 */
exports.contentCreate = function(req, res) {
  console.log(req.body.content);
  console.log('-----------------');
  EntityContent.find({user: req.user._id, entityId: req.body.entityId, name: req.body.content}).exec(function (err, data) {
    console.log(err);
    console.log(data);
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else {
      if(!data.length){
        var entityContent = new EntityContent();
        entityContent.name = req.body.content;
        entityContent.botId = req.body.botId;
        entityContent.user = req.user;
        entityContent.entityId = req.body.entityId;
        entityContent.save(function (err, data) {
          if(err){
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }else {
            var entityContentSynonym = new EntityContentSynonym();
            entityContentSynonym.name = req.body.content;
            entityContentSynonym.botId = req.body.botId;
            entityContentSynonym.entityId = req.body.entityId;
            entityContentSynonym.contentId = entityContent._id;
            entityContentSynonym.save(function (err2, data2) {
              if(err2){
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              }else {
                data.syn = [data2];
                res.json(data);
              }
            });
          }
        });
      }else {
        return res.status(400).send({
          message: '동일한 내용이 존재합니다.'
        });
      }
    }
  })

};


/**
 * Delete an Custom action
 */
exports.contentDelete = function(req, res) {
  EntityContent.remove({_id: req.query.contentId}, function (err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(data);
      console.log('--------------')
      res.jsonp(data);
    }
  })
};
