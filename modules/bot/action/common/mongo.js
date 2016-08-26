var path = require('path');
var mongoose = require('mongoose');
var type = require(path.resolve('./modules/bot/action/common/type'));
var utils = require(path.resolve('./modules/bot/action/common/utils'));

const DOC_NAME = 'doc';

exports.execute = execute;

function execute(task, context, successCallback, errorCallback) {

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
          model.create(task.doc, function(err, _docs) {
            if (err) {
              throw err;
            } else {
              successCallback(task, context);
            }
          });
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
            task.error = task.errMsg.nodata;
          } else {
            task[DOC_NAME] = doc._doc;
          }

          console.log("mongo:findById>> " + JSON.stringify(doc._doc));
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

