var mongoose = require('mongoose');
var actionController = require('../../server/controllers/action.server.controller');

const DOC_NAME = 'doc';

exports.execute = execute;

function execute(action, botName, user, inJson, outJson, successCallback, errorCallback, template) {
  try {
    switch (action) {
      case 'findById':
        var model = mongoose.model(outJson.mongo.model);

        model.findById(outJson.mongo._id, function (err, doc) {
          if (err || !doc) {
            outJson.error = outJson.errMsg.nodata;
          } else {
            outJson[DOC_NAME] = doc;
          }

          console.log("mongo:findById>> " + JSON.stringify(doc));
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
        var model = mongoose.model(outJson.mongo.model);

        var query = model.find(outJson.mongo.query, outJson.mongo.fields, outJson.mongo.options);
        if(outJson.mongo.sort) query.sort(outJson.mongo.sort);
        if(outJson.mongo.limit) query.limit(outJson.mongo.limit);

        query.exec(function (err, docs) {
          if (err || !docs || docs.length <= 0) {
            outJson.error = outJson.errMsg.nodata;
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

