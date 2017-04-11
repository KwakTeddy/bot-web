var net = require('net');
var request = require('request');
var path = require('path');
var chat = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
var contextModule = require(path.resolve('modules/bot/engine/common/context'));

var util =require('util'); //temporary

exports.message =  function(req, res) {
  console.log(req.body);
  console.log('lol');
  res.status(200).end();
};
