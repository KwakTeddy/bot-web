var path = require('path');
var chat = require(path.resolve('engine/bot/server/controllers/bot.server.controller'));

exports.message = function (req, res) {
  console.log(JSON.stringify(req.body));

  var msg = req.body;
  try {
    chat.write(msg.channel, msg.user, msg.bot, msg.text, msg, function (_out, _task) {

      if(_task == undefined || (_task.result == undefined && _task.image == undefined && _task.buttons == undefined && _task.items == undefined)) {
        res.write(_out);
        res.end();
      } else if(_task.result) {
        if(_task.result.text == undefined) _task.result.text = _out;
        res.write(JSON.stringify(_task.result));
        res.end();
      } else {
        _task.text = _out;
        _task.topTask = undefined;
        res.write(JSON.stringify(_task));
        res.end();
      }
    });
  } catch(e) {
    res.write('');
    res.end();
  }
};
