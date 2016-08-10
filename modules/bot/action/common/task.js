var utils = require('./utils');
var actionController = require('../../server/controllers/action.server.controller');
const MAX_ACTION = 100;

exports.execute = execute;

function execute(action, botName, user, inJson, outJson, successCallback, errorCallback, template) {
  var actionJson = template && template.actions ? template.actions : outJson.actions;

  if(action == 'sequence' || action == 'repeater') {

    var actionCounter = 0;
    var actionNum = 0;
    var actions = [];

    for(var i = 0; i < actionJson.length; i++) {
      actions[i] = actionController.findModule(actionJson[i], botName);
    }

    var _successCallback = function(json) {
      var docMerge = actionJson[actionNum].template ? actionJson[actionNum].template.docMerge :
        actionJson[actionNum].docMerge;

      if(Array.isArray(json.doc)) {
        if(!outJson.doc) outJson.doc = [];
        if(docMerge != 'none') outJson.doc = outJson.doc.concat(json.doc);
      } else {
        if(docMerge == 'add') {
          if(!outJson.doc) outJson.doc = [];
          outJson.doc = outJson.doc.concat(json.doc);
        }
        else if(docMerge == 'out') outJson = utils.mergeJSON(outJson, json.doc);
        else if(docMerge == 'replace') outJson.doc = json.doc;
        else outJson.doc = utils.mergeJSON(outJson.doc, json.doc);
      }

      actionCounter++;

      if(action == 'sequence' && (actionNum = actionCounter) >= actions.length) {

        successCallback(outJson);
      } else if(action == 'repeater' && (json.pages && json.currentPage && json.currentPage >= json.pages[json.pages.length-1]) ||
          actionCounter >= outJson.actionLimit || actionCounter >= MAX_ACTION) {

          successCallback(outJson);
      } else {
        if(actionJson[actionNum].setData)
          actionJson[actionNum].doc = outJson.doc;

        if(actionJson[actionNum].preCallback) {
          actionJson[actionNum].preCallback(outJson, actionJson[actionNum], function(outJson) {
            actions[actionNum].execute(actionJson[actionNum].action, botName, user, inJson, actionJson[actionNum], postCallback, errorCallback, actionJson[actionNum].template);
          });
        } else {
          actions[actionNum].execute(actionJson[actionNum].action, botName, user, inJson, actionJson[actionNum], postCallback, errorCallback, actionJson[actionNum].template);
        }
      }
    };

    var postCallback;
    if(actionJson[actionNum].postCallback) {
      postCallback = function(json) {
        actionJson[actionNum].postCallback(outJson, json, _successCallback);
      }
    } else {
      postCallback = _successCallback;
    }

    if(actionJson[actionNum].setData) actionJson[actionNum].doc = outJson.doc;

    if(actionJson[actionNum].preCallback) {
      actionJson[actionNum].preCallback(outJson, actionJson[actionNum], function(outJson) {
        actions[actionNum].execute(actionJson[actionNum].action, botName, user, inJson, actionJson[actionNum], postCallback, errorCallback, actionJson[actionNum].template);
      });
    } else {
      actions[actionNum].execute(actionJson[actionNum].action, botName, user, inJson, actionJson[actionNum], postCallback, errorCallback, actionJson[actionNum].template);
    }

  } else if(action == 'repeater') {

    var actionCounter = 0;
    var actions = [];
    var docs = [];

    for(var i = 0; i < outJson.actions.length; i++) {
      actions[i] = actionController.findModule(actionNames[i], botName);
    }

    var _successCallback = function(json) {
      var docMerge = outJson.actions[0].template ? outJson.actions[0].template.docMerge :
        outJson.actions[0].docMerge;

      if(Array.isArray(json.doc)) {
        if(!outJson.doc) outJson.doc = [];
        outJson.doc = outJson.doc.concat(json.doc);
      } else {
        if(docMerge == 'add') {
          if(!outJson.doc) outJson.doc = [];
          outJson.doc = outJson.doc.concat(json.doc);
        }
        else if(docMerge == 'out') outJson = utils.mergeJSON(outJson, json.doc);
        else if(docMerge == 'replace') outJson.doc = json.doc;
        else outJson.doc = utils.mergeJSON(outJson.doc, json.doc);
      }

      if((json.pages && json.currentPage && json.currentPage >= json.pages[json.pages.length-1]) ||
        ++actionCounter >= outJson.actionLimit || actionCounter >= MAX_ACTION) {
        if(docMerge == 'add') outJson.doc = docs;

        successCallback(outJson);
      } else {

        if(outJson.actions[0].preCallback) {
          outJson.actions[0].preCallback(outJson, outJson.actions[0], function(outJson) {
            actions[0].execute(outJson.actions[0].action, botName, user, inJson, outJson.actions[0], postCallback, errorCallback, outJson.actions[0].template);
          });
        } else {
          actions[0].execute(outJson.actions[0].action, botName, user, inJson, outJson.actions[0], postCallback, errorCallback, outJson.actions[0].template);
        }
      }
    };


    var postCallback;
    if(outJson.actions[0].postCallback) {
      postCallback = function(json) {
        outJson.actions[0].postCallback(outJson, json, _successCallback);
      }
    } else {
      postCallback = _successCallback;
    }


    if(outJson.actions[0].preCallback) {
      outJson.actions[0].preCallback(outJson, outJson.actions[0], function(outJson) {
        actions[0].execute(outJson.actions[0].action, botName, user, inJson, outJson.actions[0], postCallback, errorCallback, outJson.actions[0].template);
      });
    } else {
      actions[0].execute(outJson.actions[0].action, botName, user, inJson, outJson.actions[0], postCallback, errorCallback, outJson.actions[0].template);
    }


  } else if(action == 'synchronous') {

    var actions = outJson.actions;
    var bCallback = false;

    var _successCallback = function(json) {
      if(!bCallback) {
        bCallback = true;
        successCallback(json);
      }
    };

    for(var i = 0; i < actions.length; i++) {
      actions[i](action, botName, inJson, outJson, _successCallback, errorCallback, template);
    }

  } else if(action == 'synchronous-join') {

    var actionCounter = 0;
    var actions = outJson.actions;
    var docs =[];

    var _successCallback = function(json) {
      if(++actionCounter >= actions.length) {
        json.doc = docs;
        outJson.joinder(json, function(_json) {
          successCallback(_json);
        });
      } else {
        docs.push(json.doc);
      }
    };

    for(var i = 0; i < actions.length; i++) {
      actions[i](action, botName, inJson, outJson, _successCallback, errorCallback, template);
    }

  }
}
