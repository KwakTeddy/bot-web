var path = require('path');
var mongoose = require('mongoose');
var utils = require(path.resolve('./engine-old/bot/action/common/utils'));
var logger = require(path.resolve('./config/lib/logger'));
var async = require('async');

const DOC_NAME = 'doc';

function save(task, context, callback) {
  var model = getModel(task.mongo.model, task.mongo.schema);

  if(Array.isArray(task.doc)) {
    async.eachSeries(task.doc, function(_doc, cb) {
        model.create(_doc, function(err, _docs) {
          if (err) {
            task.err = err;
          }
          cb(null);
        });
    },
    function(err) {
      callback(task, context);
    });

  } else {
    var item = new model(task.doc);
    item.save(function (err) {
      if (err) {
        task.err = err;
      }
      callback(task, context);
    });
  }
}

exports.save = save;


function remove(task, context, callback) {
  var model = getModel(task.mongo.model, task.mongo.schema);

  model.remove(task.mongo.query, function (err) {
    if (err) {
      throw err;
    } else {
      callback(task, context);
    }
  });
}

exports.remove = remove;


function update(task, context, callback) {
  var model = getModel(task.mongo.model, task.mongo.schema);

  if(Array.isArray(task.doc)) {
    async.eachSeries(task.doc, function(_doc, cb) {
        for(var key in task.mongo.query)
          if(_doc[key]) task.mongo.query[key] = _doc[key];

        var _update = {};
        if(task.mongo.update) {
          for (var key in task.mongo.update)
            if (task.mongo.update[key]) _update[key] = _doc[key];
        } else _update = utils.clone(_doc);

        model.update(task.mongo.query, _update, task.mongo.options, function (err, numAffected) {
          if (err) {
            task.err = err;
          }
          cb(null);
        });

      },
      function(err) {
        callback(task, context);
      });

  } else {
    var _doc = task.doc;

    for(var key in task.mongo.query)
      if(_doc[key]) task.mongo.query[key] = _doc[key];

    var _update = {};
    if(task.mongo.update) {
      for (var key in task.mongo.update)
        if (task.mongo.update[key]) _update[key] = _doc[key];
    } else _update = utils.clone(_doc);

    model.update(task.mongo.query, _update, task.mongo.options, function (err, numAffected) {
      if (err) {
        console.log(err);
        task.err = err;
      }

      task.numAffected = numAffected;

      callback(task, context);
    });
  }
}

exports.update = update;

function findById(task, context, callback) {
  var model = getModel(task.mongo.model, task.mongo.schema);

  model.findById(task.mongo._id).lean().exec(function (err, doc) {
    if (err || !doc) {
      task.error = err;
    } else {
      task[DOC_NAME] = doc._doc;
      console.log("mongo:findById>> " + JSON.stringify(doc._doc));
    }

    callback(task, context);
  });
}

exports.findById = findById;

function findOne(task, context, callback) {
  var model = getModel(task.mongo.model, task.mongo.schema);

  model.findOne(task.mongo.query).lean().exec(function (err, doc) {
    if (err || !doc) {
      task.error = task.errMsg.nodata;
    } else {
      task[DOC_NAME] = doc;
    }

    console.log("mongo:findOne>> " + JSON.stringify(doc));
    callback(task, context);
  });
}

exports.findOne = findOne;

function find(task, context, callback) {
  var model = getModel(task.mongo.model, task.mongo.schema);

  var _query = model.find(task.mongo.query, task.mongo.fields, task.mongo.options);
  if(task.mongo.sort) _query.sort(task.mongo.sort);
  if(task.mongo.limit) _query.limit(task.mongo.limit);

  _query.lean().exec(function (err, docs) {
    if (err || !docs || docs.length <= 0) {
      task.error = err;
    } else {
      task[DOC_NAME] = docs;

      if(task.save) context.user[DOC_NAME] = docs;
    }

    // console.log("mongo:find>> " + JSON.stringify(docs));
    callback(task, context);
  });
}

exports.find = find;


exports.execute = execute;

function execute(task, context, successCallback, errorCallback) {

  var type = utils.requireNoCache(path.resolve('./engine2/bot/action/common/type'));

  try {
    switch (task.action) {
      case 'save':
        var model;
        if (mongoose.models[task.mongo.model]) {
          model = mongoose.model(task.mongo.model);
        } else {
          model = mongoose.model(task.mongo.model, new mongoose.Schema(task.mongo.schema));
        }

        if(Array.isArray(task.doc)) {
          var count = 0;
          for(var i = 0; i < task.doc.length; i++) {
            var _doc = task.doc[i];

          //   var item = new model(_doc);
          //   item.save(function (err) {
          //     count ++;
          //     if (err) {
          //       throw err;
          //     } else {
          //       if(count >= task.doc.length)
          //         successCallback(task, context);
          //     }
          //   });

            model.create(_doc, function(err, _docs) {
              count ++;
              if (err) {
                throw err;
              } else {
                if(count >= task.doc.length)
                  successCallback(task, context);
              }
            });
          }
        } else {
          var item = new model(task.doc);
          item.save(function (err) {
            if (err) {
              throw err;
            } else {
              successCallback(task, context);
            }
          });
        }

        break;

      case 'remove':
        var model;
        if (mongoose.models[task.mongo.model]) {
          model = mongoose.model(task.mongo.model);
        } else {
          model = mongoose.model(task.mongo.model, new mongoose.Schema(task.mongo.schema));
        }

        model.remove(task.mongo.query, function (err) {
          if (err) {
            throw err;
          } else {
            successCallback(task, context);
          }
        });

        break;

      case 'update':
        var model;
        if (mongoose.models[task.mongo.model]) {
          model = mongoose.model(task.mongo.model);
        } else {
          model = mongoose.model(task.mongo.model, new mongoose.Schema(task.mongo.schema));
        }

        if(Array.isArray(task.doc)) {
          var count = 0;
          for(var i = 0; i < task.doc.length; i++) {
            var _doc = task.doc[i];

            for(var key in task.mongo.query)
              if(_doc[key]) task.mongo.query[key] = _doc[key];

            var _update = {};
            if(task.mongo.update) {
              for (var key in task.mongo.update)
                if (task.mongo.update[key]) _update[key] = _doc[key];
            } else _update = utils.clone(_doc);

            model.update(task.mongo.query, _update, task.mongo.options, function (err, numAffected) {
              count ++;
              if (err) {
                throw err;
              } else {
                if(count >= task.doc.length)
                  successCallback(task, context);
              }
            });
          }
        } else {
          var _doc = task.doc;

          for(var key in task.mongo.query.keys)
            if(_doc[key]) task.mongo.query[key] = _doc[key];

          if(task.mongo.update) {
            for(var key in task.mongo.update.keys)
              if(task.mongo.update[key]) task.mongo.update[key] = _doc[key];
          } else task.mongo.update = _doc;

          model.update(task.mongo.query, task.mongo.update, task.mongo.options, function (err) {
            if (err) {
              throw err;
            } else {
              successCallback(task, context);
            }
          });
        }

        break;
      case 'findById':
        var model;
        if (mongoose.models[task.mongo.model]) {
          model = mongoose.model(task.mongo.model);
        } else {
          model = mongoose.model(task.mongo.model, new mongoose.Schema(task.mongo.schema));
        }


        model.findById(task.mongo._id, function (err, doc) {
          if (err || !doc) {
            task.error = err;
          } else {
            task[DOC_NAME] = doc._doc;
            console.log("mongo:findById>> " + JSON.stringify(doc._doc));
          }

          successCallback(task, context);
        });

        break;
      case 'findOne':
        var model;
        if (mongoose.models[task.mongo.model]) {
          model = mongoose.model(task.mongo.model);
        } else {
          model = mongoose.model(task.mongo.model, new mongoose.Schema(task.mongo.schema));
        }

        model.findOne(task.mongo.query, function (err, doc) {
          if (err || !doc) {
            task.error = task.errMsg.nodata;
          } else {
            task[DOC_NAME] = doc;
          }

          console.log("mongo:findOne>> " + JSON.stringify(doc));
          successCallback(task, context);
        });

        break;
      case 'find':
        var model;
        if (mongoose.models[task.mongo.model]) {
          model = mongoose.model(task.mongo.model);
        } else {
          model = mongoose.model(task.mongo.model, new mongoose.Schema(task.mongo.schema));
        }

        var _query = model.find(task.mongo.query, task.mongo.fields, task.mongo.options);
        if(task.mongo.sort) _query.sort(task.mongo.sort);
        if(task.mongo.limit) _query.limit(task.mongo.limit);

        _query.lean().exec(function (err, docs) {
          if (err || !docs || docs.length <= 0) {
            task.error = err;
          } else {
            task[DOC_NAME] = docs;

            if(task.save) context.user[DOC_NAME] = docs;
          }

          console.log("mongo:find>> " + JSON.stringify(docs));
          successCallback(task, context);
        });

        break;
      case 'findByIndex':
        var model;
        if (mongoose.models[task.mongo.model]) {
          model = mongoose.model(task.mongo.model);
        } else {
          model = mongoose.model(task.mongo.model, new mongoose.Schema(task.mongo.schema));
        }

        var index = type.parseNumber(task.index);
        var selectDoc = context.user[DOC_NAME][index - 1];
        task.id = selectDoc._id;

        model.findById(task.id, function (err, doc) {
          if (err || !doc) {
            task.error = task.errMsg.nodata;
          } else {
            task[DOC_NAME] = doc;
          }

          console.log("mongo:findByIndex>> " + JSON.stringify(doc));
          successCallback(task, context);
        });

        context.user[DOC_NAME] = null;

        break;

      case 'selectByIndex':
        var index = type.parseNumber(task.index);
        var selectDoc = context.user[DOC_NAME][index - 1];

        task[DOC_NAME] = selectDoc;
        successCallback(task, context);

        context.user[DOC_NAME] = null;

        break;
      default:
        break;
    }

  } catch(e) {
    if(errorCallback) errorCallback(e, task, context);
    else console.log("[common.action: mongo." + task.action + "] error: " + e);
  }
};


function mongoTypeCheck(task, context, callback) {

  var text = task.raw ? task.inRaw : task.in;
  var docName = task.name ? task.name : 'doc';

  logger.debug('');
  try {
    logger.debug('mongo.js:mongoTypeCheck: START ' + docName + ' "' + text + '" task: ' + JSON.stringify(task));
  } catch(e) {
    logger.debug('mongo.js:mongoTypeCheck: START ' + docName + ' "' + text + '"');
  }

  var model;
  if (mongoose.models[task.mongo.model]) {
    model = mongoose.model(task.mongo.model);
  } else {
    model = mongoose.model(task.mongo.model, new mongoose.Schema(task.mongo.schema));
  }

  var matchedWord = '';
  var matchedDoc = [];
  var words = text.split(' '), wordsCount = 0;
  for(var i = 0 ; i < words.length; i++) {
    var word = words[i];

    var query = {};
    for(var j = 0; j < task.mongo.queryFields.length; j++) {
      try {
        query[task.mongo.queryFields[j]] = new RegExp(word, 'i');
      } catch(e) {}
    }

    var _query = model.find(query, task.mongo.fields, task.mongo.options);
    if(task.mongo.sort) _query.sort(task.mongo.sort);
    if(task.mongo.limit) _query.limit(task.mongo.limit);

    _query.lean().exec(function (err, docs) {
      wordsCount++;

      if (err || !docs || docs.length <= 0) {
        //callback(text, task);
      } else {

        for(var k = 0; k < docs.length; k++) {
          var doc = docs[k];

          var matchCount = 0;
          matchedWord = '';
          var matchIndex = -1, matchMin = -1, matchMax = -1;
          for(var l = 0; l < task.mongo.queryFields.length; l++) {
            for(var m = 0; m < words.length; m++) {
              matchIndex = doc[task.mongo.queryFields[l]].search(new RegExp(words[m], 'i'));

              if(matchIndex != -1) {
                matchCount++;
                matchedWord += words[m];

                var matchOrgIndex = text.search(new RegExp(words[m], 'i'));
                if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + words[m].length> matchMax)) matchMax = matchOrgIndex + words[m].length;
              }
            }
          }

          if(matchCount >= task.mongo.minMatch) {
            var bExist = false;
            for(var l = 0; l < matchedDoc.length; l++) {
              if(matchedDoc[l]._id.id == doc._id.id) {
                bExist = true;
                break;
              }
            }

            if(!bExist) {
              doc.matchWord = matchedWord;
              doc.matchCount = matchCount;
              doc.matchMin = matchMin;
              doc.matchMax = matchMax;

              matchedDoc.push(doc);
            }
          }
        }
      }

      if(wordsCount >= words.length) {

        if (task.mongo.taskSort && task.mongo.taskSort instanceof Function) {
          matchedDoc.sort(task.mongo.taskSort);
        } else {
          matchedDoc.sort(function (a, b) {
            return b.matchCount - a.matchCount;
          });
        }

        if (matchedDoc.length > 0) {

          task[docName] = [];
          for (var _l = 0; _l < matchedDoc.length; _l++) {
            var matchDoc = matchedDoc[_l];

            var matchText = '';
            for (var l = 0; l < task.mongo.queryFields.length; l++) {
              var _text = matchDoc[task.mongo.queryFields[l]]
              if (matchText == '') matchText = matchText.concat(_text);
              else matchText = matchText.concat(' ', _text);
            }
            matchDoc['matchText'] = matchText;

            var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
            matchDoc['matchOriginal'] = matchOriginal;

            if (task.mongo.taskFields) {
              var addDoc = {};
              for (var l = 0; task.mongo.taskFields && l < task.mongo.taskFields.length; l++) {
                addDoc[task.mongo.taskFields[l]] = matchDoc[task.mongo.taskFields[l]];
              }
              task[docName].push(addDoc);
            } else {
              task[docName].push(matchDoc);
            }

            if(matchDoc.matchWord.replace(/ /i, '') == matchDoc[task.mongo.queryFields[0]].replace(/ /i, ''))
              break;
            if (task[docName].length >= task.limit) break;
          }

          if(task[docName].length == 1) {
            task[docName] = task[docName][0];

            text = text.replace(task[docName]['matchOriginal'], type.IN_TAG_START + docName + type.IN_TAG_END);
            task[docName+'Original'] = task[docName]['matchOriginal'];
          }

          try {
            logger.debug('mongo.js:mongoTypeCheck: MATCHED ' + docName + ' "' + text + '" task: ' + JSON.stringify(task));
          } catch (e) {
            logger.debug('mongo.js:mongoTypeCheck: MATCHED ' + docName + ' "' + text + '" task.' + docName + ': ' + task[docName] + ' task.typeDoc: ' + JSON.stringify(task.typeDoc));
          }

          task.match = true;
          callback(task, context);
        } else {
          try {
            logger.debug('mongo.js:mongoTypeCheck: NOT MATCHED ' + docName + ' "' + text + '" task: ' + JSON.stringify(task));
          } catch (e) {
            logger.debug('mongo.js:mongoTypeCheck: NOT MATCHED ' + docName + ' "' + text + '" task.' + docName + ': ' + task[docName] + ' task.typeDoc: ' + JSON.stringify(task.typeDoc));
          }

          task.match = false;
          callback(task, context);
        }
      }
    });
  }
}


function getModel(modelName, schema, options) {
  var model;
  var _schema;
  if(schema === undefined) {
    _schema = {any: {}};
    if(options === undefined) options = {};
    options.strict = false;
  } else {
    _schema = schema;
  }
  if (mongoose.models[modelName]) {
    model = mongoose.model(modelName);
  } else if(options !== undefined) {
    model = mongoose.model(modelName, new mongoose.Schema(_schema, options));
  } else {
    model = mongoose.model(modelName, new mongoose.Schema(_schema));
  }

  return model
}

 exports.getModel = getModel;

