var path = require('path');
var async = require('async');
var tough = require('tough-cookie');
var botModule = require(path.resolve('./engine2/bot.js'));
var dialog = require(path.resolve('engine2/bot/action/common/dialog'));
var utils = require(path.resolve('./engine2/bot/action/common/utils'));
var util = require('util');
var config = require(path.resolve('./config/config'));

var redis = require('redis');
var cache;
// try {
//   cache = redis.createClient(config.redis.port, config.redis.host);
// } catch(e) {
//
// }

exports.getContext = getContext;
function getContext(botName, channel, user, options, callback) {
  // if(!global._context) global._context = {};
  // if(!global._bots) global._bots = {};
  // if(!global._channels) global._channels = {};
  // if(!global._users) global._users = {};
  // if(!global._botusers) global._botusers = {};

  var userContext, botUserContext;
  var botContext;
  async.waterfall([
    function(cb) {
      // if (!global._bots[botName]) global._bots[botName] = {};
      if (!global._channels[channel]) global._channels[channel] = {};

      if (user == undefined) {
        cb(null);
      } else if (!global._users[user]) {
        var botUser = require(path.resolve('./engine2/bot-users/server/controllers/bot-users.server.controller'));
        var _user = {userId: user, channel: channel, bot: botName};
        botUser.getUserContext(_user, null, function (_user, _context) {
          userContext = {userId: user, channel: channel, bot: botName};
          // userContext = utils.merge(userContext, _user.doc._doc);
          userContext.userKey = user;

          if (userContext.address)
            userContext.addressCompact = userContext.address.지번주소.replace(/^([가-힣]+\s*)/, function (matched, p1) {
              return ''
            });
          // userContext.addressCompact = userContext.addressCompact.replace(/(\s+\(.*\))/, function(matched, p1) {return ''});

          global._users[user] = userContext;
          cb(null);
        });
      } else {
        userContext = global._users[user];
        cb(null);
      }
    }, function(cb) {
      if(user != undefined) {
        var botUserName;
        botUserName = botName + '_' + user;

        // cache.get(botUserName, function(err, data) {
        //   if (data) {
        //     botUserContext = JSON.parse(data);
        //   } else  {
        //     botUserContext = {botUserName: botName + '_' + user};
        //   }
        //
        //   botUserContext.orgBot = global._bots[botName];
        //
        //   if(!botUserContext._dialog) botUserContext._dialog = {};
        //   if(!botUserContext._task) botUserContext._task = {};
        //
        //   if(options) botUserContext.options = options;
        //
        //   // console.log('changeBot: '  + botUserContext.curBotId + ' ' + botUserContext.curBotName);
        //   if(botUserContext.curBotId) botName = botUserContext.curBotId;
        //
        //   cb(null);
        // })

        if(!global._botusers[botUserName]) global._botusers[botUserName] = {};
        botUserContext = global._botusers[botUserName];

        botUserContext.orgBot = global._bots[botName];

        if(!botUserContext._dialog) botUserContext._dialog = {};
        if(!botUserContext._task) botUserContext._task = {};

        if(options) botUserContext.options = options;

        // console.log('changeBot: '  + botUserContext.curBotId + ' ' + botUserContext.curBotName);
        if(botUserContext.curBotId) botName = botUserContext.curBotId;
      }

      cb(null);
      // else cb(null);
    }, function(cb) {
      getBotContext(botName, function(_botContext) {
        botContext = _botContext;
        cb(null);
      });

      // if(global._bots[botName]) {
      //   botContext = global._bots[botName];
      //   cb(null);
      // } else if(global._userbots[botName]) {
      //   botContext = global._userbots[botName];
      //   cb(null);
      // } else {
      //   botModule.loadBot(botName);
      //   botContext = global._bots[botName];
      //   if(botContext) {
      //     cb(null);
      //   } else {
      //     botModule.loadUserBot(botName, function(_userBot) {
      //       if(_userBot) {
      //         botContext = _userBot;
      //       } else {
      //         botModule.loadBot(botName);
      //         botContext = global._bots[botName];
      //         if(botContext == undefined) botContext = {};
      //       }
      //
      //       cb(null);
      //     })
      //   }
      // }
    }
  ], function(err) {
    var context = {
      global: global._context,
      bot: botContext,
      channel: global._channels[channel],
      user: userContext,
      botUser: botUserContext,
      dialog: (botUserContext ? botUserContext._dialog : undefined),
      task: (botUserContext ? botUserContext._task : undefined)
    };

    if(context.bot) context.bot.botName = botName;
    if(context.channel) context.channel.name = channel;
    if(context.user) {
      context.user.userId = user;
      if(!context.user.cookie) context.user.cookie = new tough.CookieJar();
    }


    context.bot.startDialog = dialog.findGlobalDialog(null, context, dialog.START_DIALOG_NAME);
    context.bot.noDialog = dialog.findGlobalDialog(null, context, dialog.NO_DIALOG_NAME);

    // context.global.messages = messages;

    // context.user.mobile = '010-6316-5683';

    callback(context);
  });

}

exports.getBotContext = getBotContext;
function getBotContext(botName, cb) {
  var botContext;
  if(global._bots[botName]) {
    botContext = global._bots[botName];
    cb(botContext);
  // } else if(global._userbots[botName]) {
  //   botContext = global._userbots[botName];
  //   cb(botContext);
  } else {
    botModule.loadBot(botName, function(_bot) {
      if(_bot) {
        botContext = _bot;
        cb(botContext);
      } else if(botContext == undefined) {
        botContext = {};
        cb(botContext);
      // } else {
      //   botModule.loadUserBot(botName, function(_userBot) {
      //     if(_userBot) {
      //       botContext = _userBot;
      //     } else if(botContext == undefined) botContext = {};
      //
      //     cb(botContext);
      //   })
      }
    });

    // botModule.loadBot(botName);
    // botContext = global._bots[botName];
    // if(botContext) {
    //   cb(botContext);
    // } else {
    //   botModule.loadUserBot(botName, function(_userBot) {
    //     if(_userBot) {
    //       botContext = _userBot;
    //     } else {
    //       botModule.loadBot(botName);
    //       botContext = global._bots[botName];
    //       if(botContext == undefined) botContext = {};
    //     }
    //
    //     cb(botContext);
    //   })
    // }
  }
}
