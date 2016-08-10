var mongoose = require('mongoose');
var actionController = require('../../server/controllers/action.server.controller');

const DOC_NAME = 'doc';

exports.execute = execute;

function execute(action, botName, user, inJson, outJson, successCallback, errorCallback, template) {
  var modelName, schema, query, update, fields, sort, limit, options;

  modelName = template && template.mongo && template.mongo.model ? template.mongo.model : (outJson.mongo ? outJson.mongo.model : undefined);
  schema = template && template.mongo && template.mongo.schema ? template.mongo.schema : (outJson.mongo ? outJson.mongo.schema : undefined);
  query = template && template.mongo && template.mongo.query ? template.mongo.query : (outJson.mongo? outJson.mongo.query: undefined);
  update = template && template.mongo && template.mongo.update ? template.mongo.update : (outJson.mongo ? outJson.mongo.update : undefined);
  fields = template && template.mongo && template.mongo.fields ? template.mongo.fields : (outJson.mongo ? outJson.mongo.fields : undefined);
  sort = template && template.mongo && template.mongo.sort ? template.mongo.sort : (outJson.mongo ? outJson.mongo.sort : undefined);
  limit = template && template.mongo && template.mongo.limit ? template.mongo.limit : (outJson.mongo ? outJson.mongo.limit : undefined);
  options = template && template.mongo && template.mongo.options ? template.mongo.options : (outJson.mongo ? outJson.mongo.options : undefined);

  try {
    switch (action) {
      case 'save':
        var model;
        if (mongoose.models[modelName]) {
          model = mongoose.model(modelName);
        } else {
          model = mongoose.model(modelName, new mongoose.Schema(schema));
        }

        if(Array.isArray(outJson.doc)) {
          model.create(outJson.doc, function(err, _docs) {
            if (err) {
              throw err;
            } else {
              successCallback(outJson);
            }
          });
        } else {
          var item = new model(outJson.doc);
          item.save(function (err) {
            if (err) {
              throw err;
            } else {
              successCallback(outJson);
            }
          });
        }

        break;

      case 'update':
        var model;
        if (mongoose.models[modelName]) {
          model = mongoose.model(modelName);
        } else {
          model = mongoose.model(modelName, new mongoose.Schema(schema));
        }

        if(Array.isArray(outJson.doc)) {
          var count = 0;
          for(var i = 0; i < outJson.doc.length; i++) {
            var _doc = outJson.doc[i];

            for(var key in query)
              if(_doc[key]) query[key] = _doc[key];

            if(update) {
              for (var key in update)
                if (update[key]) update[key] = _doc[key];
            } else update = JSON.clone(_doc);

            model.update(query, update, options, function (err, numAffected) {
              count ++;
              if (err) {
                throw err;
              } else {
                if(count >= outJson.doc.length)
                  successCallback(outJson);
              }
            });
          }
        } else {
          var _doc = outJson.doc;

          for(var key in query.keys)
            if(_doc[key]) query[key] = _doc[key];

          if(update) {
            for(var key in update.keys)
              if(update[key]) update[key] = _doc[key];
          } else update = _doc;

          model.update(query, update, options, function (err) {
            if (err) {
              throw err;
            } else {
              successCallback(outJson);
            }
          });
        }

        break;
      case 'findById':
        var model = mongoose.model(outJson.mongo.model);

        model.findById(outJson.mongo._id, function (err, doc) {
          if (err || !doc) {
            outJson.error = outJson.errMsg.nodata;
          } else {
            outJson[DOC_NAME] = doc._doc;
          }

          console.log("mongo:findById>> " + JSON.stringify(doc._doc));
          successCallback(outJson);
        });

        break;
      case 'findOne':
        var model = mongoose.model(outJson.mongo.model);

        model.findOne(outJson.mongo.query, function (err, doc) {
          if (err || !doc) {
            outJson.error = outJson.errMsg.nodata;
          } else {
            outJson[DOC_NAME] = doc;
          }

          console.log("mongo:findOne>> " + JSON.stringify(doc));
          successCallback(outJson);
        });

        break;
      case 'find':
        var model;
        if (mongoose.models[modelName]) {
          model = mongoose.model(modelName);
        } else {
          model = mongoose.model(modelName, new mongoose.Schema(schema));
        }

        var _query = model.find(query, fields, options);
        if(sort) _query.sort(sort);
        if(limit) _query.limit(limit);

        _query.lean().exec(function (err, docs) {
          if (err || !docs || docs.length <= 0) {
            outJson.error = err;
          } else {
            outJson[DOC_NAME] = docs;

            if(outJson.save) {
              if (!global.users) global.users = {};
              if (!global.users[user]) global.users[user] = {};
              global.users[user][DOC_NAME] = docs;
            }
          }

          console.log("mongo:find>> " + JSON.stringify(docs));
          successCallback(outJson);
        });

        break;
      case 'findByIndex':
        var model = mongoose.model(outJson.mongo.model);

        var index = actionController.parseNumber(outJson.index);
        var selectDoc = global.users[user][DOC_NAME][index - 1];
        outJson.id = selectDoc._id;

        model.findById(outJson.id, function (err, doc) {
          if (err || !doc) {
            outJson.error = outJson.errMsg.nodata;
          } else {
            outJson[DOC_NAME] = doc;
          }

          console.log("mongo:findByIndex>> " + JSON.stringify(doc));
          successCallback(outJson);
        });

        global.users[user][DOC_NAME] = null;

        break;

      case 'selectByIndex':
        var index = actionController.parseNumber(outJson.index);
        var selectDoc = global.users[user][DOC_NAME][index - 1];

        outJson[DOC_NAME] = selectDoc;
        successCallback(outJson);

        global.users[user][DOC_NAME] = null;

        break;
      default:
        break;
    }

  } catch(e) {
    if(errorCallback) errorCallback(e);
    else console.log("[common.action: mongo." + action + "] error: " + e);
  }
};

