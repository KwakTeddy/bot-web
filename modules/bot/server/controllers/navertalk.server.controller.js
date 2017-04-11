var net = require('net');
var request = require('request');
var path = require('path');
var chat = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
var contextModule = require(path.resolve('modules/bot/engine/common/context'));

var util =require('util'); //temporary

exports.message =  function(req, res) {
  console.log("navertalk message");
  console.log(JSON.stringify(req.body));

  // if(req.body && req.body.user_key && req.body.content) {
  //   var from = req.body.user_key;
  //   var type = req.body.type;
  //   var text = req.body.content;
  //
  //   console.log(JSON.stringify(req.params));
  //   chat.write('kakao', from, req.params.bot, text, function (serverText, json) {
  //     respondMessage(res, serverText, json)
  //   });
  // }
};
