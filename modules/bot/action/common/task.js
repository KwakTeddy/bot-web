var utils = require('./utils');
var actionController = require('../../server/controllers/action.server.controller');
const MAX_ACTION = 100;

exports.execute = execute;

function execute(action, botName, user, inJson, outJson, successCallback, errorCallback, template) {

  if(action == 'sequence') {

    var actionCounter = 0;
    var actions = [];
    var docs = [];

    for(var i = 0; i < outJson.actions.length; i++) {
      actions[i] = actionController.findModule(outJson.actions[i], botName);
    }

    var _successCallback = function(json) {
      var docMerge = outJson.actions[actionCounter].template ? outJson.actions[actionCounter].template.docMerge :
        outJson.actions[actionCounter].docMerge;
      if(Array.isArray(json.doc)) {
        if(docMerge == 'add') docs = docs.concat(json.doc);
        else outJson.doc = utils.mergeJSON(outJson.doc, json.doc);
      } else {
        if(docMerge == 'add') docs = docs.push(json.doc);
        else if(docMerge == 'out') outJson = utils.mergeJSON(outJson, json.doc);
        else outJson.doc = utils.mergeJSON(outJson.doc, json.doc);
      }

      if(++actionCounter >= actions.length) {
        if(docMerge == 'add') outJson.doc = docs;

        successCallback(outJson);
      } else {

        actions[actionCounter].execute(outJson.actions[actionCounter].action, botName, user, inJson, outJson.actions[actionCounter], _successCallback, errorCallback, outJson.actions[actionCounter].template);
      }
    };

    actions[actionCounter].execute(outJson.actions[actionCounter].action, botName, user, inJson, outJson.actions[actionCounter], _successCallback, errorCallback, outJson.actions[actionCounter].template);

  } else if(action == 'repeater') {

    var actionCounter = 0;
    var actions = [];
    var docs = [];

    for(var i = 0; i < outJson.actions.length; i++) {
      actions[i] = actionController.findModule(outJson.actions[i], botName);
    }

    var _successCallback = function(json) {
      var docMerge = outJson.actions[0].template ? outJson.actions[0].template.docMerge :
        outJson.actions[0].docMerge;

      if(Array.isArray(json.doc)) {
        if(docMerge == 'add') docs = docs.concat(json.doc);
        else outJson.doc = utils.mergeJSON(outJson.doc, json.doc);
      } else {
        if(docMerge == 'add') docs = docs.push(json.doc);
        else if(docMerge == 'out') outJson = utils.mergeJSON(outJson, json.doc);
        else outJson.doc = utils.mergeJSON(outJson.doc, json.doc);
      }

      if((json.pages && json.currentPage && json.currentPage >= json.pages[json.pages.length-1]) ||
        ++actionCounter >= outJson.actionLimit || actionCounter >= MAX_ACTION) {
        if(docMerge == 'add') outJson.doc = docs;

        successCallback(outJson);
      } else {

        actions[0].execute(outJson.actions[0].action, botName, user, inJson, outJson.actions[0], postCallback, errorCallback, outJson.actions[0].template);
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

    actions[0].execute(outJson.actions[0].action, botName, user, inJson, outJson.actions[0], postCallback, errorCallback, outJson.actions[0].template);

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
