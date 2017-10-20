var path = require('path');
var mongoose = require('mongoose');
var utils = require(path.resolve('modules/bot/action/common/utils'));

utils.requireNoCache(path.resolve("./modules/bot-users/server/models/bot-user.server.model.js"));
utils.requireNoCache(path.resolve("./modules/dialogs/server/models/dialogset.server.model.js"));
utils.requireNoCache(path.resolve("./modules/intents/server/models/intent.server.model.js"));
utils.requireNoCache(path.resolve("./modules/bot/server/models/bot.server.model.js"));
utils.requireNoCache(path.resolve("./modules/bots/server/models/bot.server.model.js"));
utils.requireNoCache(path.resolve("./modules/banks/server/models/bank.server.model.js"));
utils.requireNoCache(path.resolve("./modules/user-dialogs/server/models/user-dialog.server.model.js"));
utils.requireNoCache(path.resolve("./modules/facts/server/models/fact-link.server.model.js"));
utils.requireNoCache(path.resolve("./modules/bots/server/models/file-bot.server.model.js"));
utils.requireNoCache(path.resolve("./modules/bots/server/models/user-bot.server.model.js"));

utils.requireNoCache(path.resolve("./modules/bot/engine/common/globals.js"));
utils.requireNoCache(path.resolve('./modules/bot/engine/common/globals')).initGlobals();

var bot = require(path.resolve('./modules/bot/server/controllers/bot.server.controller.js'));


var msg = {}
msg["bot"] = "LGE";
msg["channel"] = "socket";
msg["user"] = "840685e6-d819-48cb-82b4-5e26811f2edb";
msg["options"] = {"dev":"true"};
msg["msg"] = "어떤 패턴이야?";

bot.botProc(msg.bot, msg.channel, msg.user, msg.msg, msg, function(_out, _task) {
        console.log(_out);
        console.log(_task);
}, msg.options, null);

