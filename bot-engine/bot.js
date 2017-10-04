var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var logger = require(path.resolve('./config/lib/logger.js'));

var utils = require(path.resolve('./bot-engine/action/common/utils.js'));
var intent = require(path.resolve('./bot-engine/engine/nlu/intent'));
var entity = require(path.resolve('./bot-engine/engine/nlu/entity'));
var customContext = require('./dialog/custom-context.js');

var TemplateDataModule = require(path.resolve('./bot-engine/template-datas.server.controller'));

function buildBot(botName, botPath, fileName, dialogs, commons)
{
    logger.systemLog('Building Bot: ' + botName + botPath);

    var build = utils.requireNoCache(path.resolve('./bot-engine/action/common/build'));
    build.botBuild(botName, botPath, fileName, dialogs, commons);
}

exports.buildBot = buildBot;

function loadBots()
{
    console.log();
    logger.systemLog('Load Bot Module: [START]');
    var botDir = path.resolve('custom_modules');
    var fileFilter = function(file)
    {
        return fs.lstatSync(path.join(botDir, file)).isDirectory();
    };

    var files = undefined;
    try
    {
        files = fs.readdirSync(botDir);
        for (var i = 0; i < files.length; i++)
        {
            var file = files[i];
            if(file != file.normalize('NFC'))
            {
                files[i] = file.normalize('NFC');
            }
        }

        files = files.filter(fileFilter);
    }
    catch(e)
    {
        logger.systemLog('Bot: ' + botDir + ' 경로 없음 ' + e);
        return;
    }

    for (var i = 0; i < files.length; i++)
    {
        var dir = files[i];
        buildBot(dir);
        loadBot(dir);
    }

    logger.systemLog('Load Bot Module: [END]');
}

exports.loadBots = loadBots;

function loadBot(botName, callback)
{
    console.log();
    logger.systemLog('Loading Bot : ' + botName + ' [START]');

    // TODO 개발 시 node 재시작 안하려고 임시로
    utils.requireNoCache(path.resolve('./bot-engine/action/common/dialog.js'));
    utils.requireNoCache(path.resolve('./bot-engine/action/common/task'));
    utils.requireNoCache(path.resolve('./bot-engine/action/common/type'));
    utils.requireNoCache(path.resolve('./bot-engine/global/type/common.type'));
    utils.requireNoCache(path.resolve('custom_modules/global/global-dialogs'));

    var globalDialogs = require(path.resolve('custom_modules/global/global-dialogs'));

    var bot = undefined;
    var botDir = path.resolve('custom_modules/' + botName);

    logger.systemLog(' Bot directory : ' + botDir);

    async.waterfall([
        function(cb)
        {
            global._bots[botName] = undefined;

            var BotModel = mongoose.model('Bot');
            BotModel.findOne({ id: botName }).lean().exec(function(err, doc)
            {
                if(doc != undefined)
                {
                    bot = new Bot(doc);
                    bot.error = [];
                    global._bots[botName] = bot;
                    cb(null);
                }
                else
                {
                    cb(null);
                }
            });
        },

    function(cb)
    {
        if(bot && bot.templateId)
        {
            var TemplateModel = mongoose.model('Template');
            TemplateModel.findOne({ _id: bot.templateId }).lean().exec(function(err, doc)
            {
                if(doc)
                {
                    logger.systemLog('Loading Bot\'s Template : ' + JSON.stringify(doc));
                    bot.template = doc;
                    if(!bot.path)
                    {
                        bot.path = 'templates/' + doc.id;
                    }

                    if(global._templates[bot.template.id] && global._templates[bot.template.id].loaded != true)
                    {
                        global._templates[bot.template.id] = undefined;
                    }

                    var templateDataModel = TemplateDataModule.getTemplateDataModel(doc.dataSchema);
                    templateDataModel.findOne({ _id: bot.templateDataId }).lean().exec(function(err, doc1)
                    {
                        logger.systemLog('Loading Bot\'s Template data : ' + JSON.stringify(doc1));
                        utils.merge(bot, doc1);
                        cb(null);
                    });
                }
                else
                {
                    cb(null);
                }
            });
        }
        else
        {
            cb(null);
        }
    },

    function(cb)
    {
        if(bot && bot.template && global._templates[bot.template.id] && global._templates[bot.template.id].loaded == true)
        {
            cb(null);
        }
        else
        {
            if(bot && bot.path)
            {
                botDir = path.resolve(bot.path);
            }

            if(fs.existsSync(botDir))
            {
                var fileFilter = function(file) { return file.endsWith('.bot.js'); };

                var files = undefined;

                try
                {
                    files = fs.readdirSync(botDir);
                    for (var i = 0; i < files.length; i++)
                    {
                        var file = files[i];
                        if(file != file.normalize('NFC'))
                        {
                            files[i] = file.normalize('NFC');
                        }
                    }

                    files = files.filter(fileFilter);
                }
                catch(e)
                {
                    logger.systemError('Loading Bot: ' + botDir + ' 경로 없음');
                    bot.error.push(e.stack);
                    if(bot.error.length === 0)
                    {
                        delete bot.error;
                    }

                    return;
                }

                for (var i = 0; i < files.length; i++)
                {
                    var file = files[i];
                    var filePath = path.join(botDir, file);

                    logger.systemLog('\tLoading Bot file: ' + file);
                    utils.requireNoCache(filePath, true);
                }
            }

            cb(null);
        }
    },

    function(cb)
    {
        bot = getBot(botName);
        if(!bot || bot.use === false)
        {
            cb(true);
        }
        else
        {
            cb(null);
        }
    },

    function(cb)
    {
        bot.setDialogs(globalDialogs.globalStartDialogs);
        cb(null);
    },
    
    function(cb)
    {
        if(bot && bot.template && global._templates[bot.template.id] && global._templates[bot.template.id].loaded == true)
        {
            cb(null);
        }
        else
        {
            var fileFilter;
            var files;

            var filePaths = [];
            if(fs.existsSync(botDir))
            {
                if(bot && bot.dialogFiles)
                {
                    logger.systemLog(botName + ' has dialogFiles');
                    for (var i = 0; i < bot.dialogFiles.length; i++)
                    {
                        var file = bot.dialogFiles[i];
                        var filePath = path.join(botDir, file);
                        filePaths.push(filePath);

                        try
                        {
                            logger.systemLog('\tLoading Dialog file that bot has.: ' + file);
                            utils.requireNoCache(filePath, true);
                        }
                        catch(e)
                        {
                            logger.systemLog('\tLoading Dialog file: ' + file + ' error or not found');
                            logger.systemError(e);
                            bot.error.push(e.stack);
                        }
                    }
                }

                fileFilter = function(file)
                {
                    if(bot && bot.dialogFiles && _.includes(filePaths, file)) return false;
                    else return file.endsWith('.dialog.js');
                };

                try
                {
                    files = utils.readdirRecursive(botDir);
                    for (var i = 0; i < files.length; i++)
                    {
                        var file = files[i];
                        if(file != file.normalize('NFC'))
                        {
                            files[i] = file.normalize('NFC');
                        }
                    }

                    files = files.filter(fileFilter);
                }
                catch(e)
                {
                    logger.systemError('loadBot: ' + botDir + ' 경로 없음');
                    bot.error.push(e.stack);
                    if(bot.error.length === 0) delete bot.error;
                    return;
                }

                for (var i = 0; i < files.length; i++)
                {
                    var file = files[i];

                    try
                    {
                        logger.systemLog('\tLoading Dialog file: ' + file);
                        utils.requireNoCache(file, true);
                    }
                    catch(e)
                    {
                        logger.systemLog(e);
                        bot.error.push(e.stack);
                    }
                }

                fileFilter = function(file)
                {
                    if(bot && bot.dialogFiles && _.includes(filePaths, file))
                    {
                        return false;
                    }
                    else if(file.endsWith('.js') && !file.endsWith('.dialog.js') && !file.endsWith('.test.js') && !file.endsWith('.bot.js'))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                };

                try
                {
                    files = utils.readdirRecursive(botDir);
                    for (var i = 0; i < files.length; i++)
                    {
                        var file = files[i];
                        if(file != file.normalize('NFC'))
                        {
                            files[i] = file.normalize('NFC');
                        }
                    }

                    files = files.filter(fileFilter);
                }
                catch(e)
                {
                    console.log('loadBot: ' + botDir + ' 경로 없음');
                    console.log(e);
                    bot.error.push(e.stack);
                    if(bot.error.length === 0) delete bot.error;
                    return;
                }

                for (var i = 0; i < files.length; i++)
                {
                    var file = files[i];

                    try
                    {
                        logger.systemLog('\tLoading other file: ' + file);
                        utils.requireNoCache(file, true);
                    }
                    catch(e)
                    {
                        console.error(e);
                        bot.error.push(e.stack);
                    }
                }

                for (var i = 0; bot && i < bot.dialogs.length; i++)
                {
                    var dialog = bot.dialogs[i];

                    if(dialog.input && dialog.input.pattern)
                    {
                        var patternDialog;
                        if('string' == typeof dialog.input.pattern)
                        {
                            patternDialog = bot.patterns[dialog.input.pattern];
                        }
                        else
                        {
                            patternDialog = dialog.input.pattern;
                        }

                        if(patternDialog != undefined)
                        {
                            logger.systemLog('\tCheck the dialog Pattern');
                            bot.dialogs[i] = changeDialogPattern(patternDialog, dialog.input.params);
                            logger.systemLog('\t\t - ' + JSON.stringify(bot.dialogs[i]));
                        }
                    }
                }

                for (var i = 0; bot && i < bot.commonDialogs.length; i++)
                {
                    var dialog = bot.commonDialogs[i];

                    if(dialog.input && dialog.input.pattern)
                    {
                        var patternDialog;
                        if('string' == typeof dialog.input.pattern)
                        {
                            patternDialog = bot.patterns[dialog.input.pattern];
                        }
                        else
                        {
                            patternDialog = dialog.input.pattern;
                        }

                        logger.systemLog('\tCheck the common dialog Pattern');
                        bot.commonDialogs[i] = changeDialogPattern(patternDialog, dialog.input.params);
                        logger.systemLog('\t\t - ' + JSON.stringify(bot.commonDialogs[i]));
                    }
                }
            }

            cb(null);
        }
    },

    function(cb)
    {
        if(bot && bot.template && global._templates[bot.template.id])
        {
            utils.merge(bot.template, global._templates[bot.template.id]);
            if(bot.template.loaded == undefined)
            {
                bot.template.loaded = true;
            }

            utils.merge(bot, bot.template);

            bot.commonDialogs =bot.commonDialogs.concat(bot.template.commonDialogs);
            bot.dialogs = bot.dialogs.concat(bot.template.dialogs);
            utils.merge(bot.tasks, bot.template.tasks);
            utils.merge(bot.actions , bot.template.actions );
            utils.merge(bot.types, bot.template.types);
            utils.merge(bot.typeChecks, bot.template.typeChecks);
            utils.merge(bot.concepts, bot.template.concepts);
            utils.merge(bot.messages, bot.template.messages);
            utils.merge(bot.patterns, bot.template.patterns);
            bot.dialogsets = bot.dialogsets.concat(bot.template.dialogsets);
        }

        cb(null);
    },

    function(cb)
    {
        bot.setDialogs(globalDialogs.globalEndDialogs);
        cb(null);
    },

    function(cb)
    {
        intent.loadIntents(bot, function()
        {
            intent.loadIntentTopics(bot, function()
            {
                var _topicKeywords = [];
                for(var key in bot.intentTopics)
                {
                    if(key.length > 1) _topicKeywords.push(key);
                }

                if(bot.topicKeywords) bot.topicKeywords = bot.topicKeywords.concat(_topicKeywords);
                else bot.topicKeywords = _topicKeywords;
                cb(null);
            });
        });
    },

    function(cb)
    {
        entity.loadEntityContents(bot, function()
        {
            cb(null);
        });
    },

    function(cb)
    {
        customContext.loadCustomContext(bot, function()
        {
            cb(null);
        });
    },

    function(cb)
    {
        for(var i in bot.dialogsets)
        {
            if(bot.dialogsets[i].topicKeywords)
            {
                if(bot.topicKeywords) bot.topicKeywords = bot.topicKeywords.concat(bot.dialogsets[i].topicKeywords);
                else bot.topicKeywords = bot.dialogsets[i].topicKeywords;
            }
        }
      
        cb(null);
    }
    ],
    function(err)
    {
        if(bot && bot.error.length === 0) delete bot.error;
        if(callback) callback(bot);
    });
}

exports.loadBot = loadBot;

function loadUserBot(botName, callback) {
  var UserBot = mongoose.model('UserBot');
  UserBot.findOne({id: botName}, function(err, doc) {
    if(doc != undefined) {
      var bot = new Bot(doc);

      var dialogs = [];
      dialogs = dialogs.concat(globalDialogs.globalStartDialogs);
      dialogs = dialogs.concat(globalDialogs.globalEndDialogs);
      bot.setDialogs(dialogs);

      global._userbots[botName] = bot;

      callback(bot);
    } else {
      callback(null);
    }
  })
}
exports.loadUserBot = loadUserBot;


// function setBot(botName, bot) {
//   if(!global._bots) global._bots = {};
//   global._bots[botName] = bot;
//   global._bots[botName].dialogs = [];
//   global._bots[botName].commonDialogs = [];
//   global._bots[botName].tasks = {};
//   global._bots[botName].actions = {};
//   global._bots[botName].types = {};
//   global._bots[botName].typeChecks = {};
//   // console.log('SetBot: ' + botName);
// }
//
// exports.setBot = setBot;
//
// function setDialogs(botName, dialogs) {
//   global._bots[botName].dialogs = global._bots[botName].dialogs.concat(dialogs);
// }
//
// exports.setDialogs = setDialogs;
//
//
// function setCommonDialogs(botName, dialogs) {
//   global._bots[botName].commonDialogs = global._bots[botName].commonDialogs.concat(dialogs);
// }
//
// exports.setCommonDialogs = setCommonDialogs;
//
//
// function setTask(botName, taskName, task) {
//   global._bots[botName].tasks[taskName] =  task;
// }
//
// exports.setTask = setTask;
//
// function setAction(botName, actionName, action) {
//   global._bots[botName].actions[actionName] =  action;
// }
//
// exports.setAction = setAction;
//
//
// function setTypeCheck(botName, typeCheckName, typeCheck) {
//   global._bots[botName].typeChecks[typeCheckName] =  typeCheck;
// }
//
// exports.setTypeCheck = setTypeCheck;

function Bot(schema)
{
    utils.merge(this, schema);

    this.dialogs = this.dialogs || [];
    this.commonDialogs = this.commonDialogs || [];
    this.tasks = this.tasks || {};
    this.actions = this.actions || {};
    this.types = this.types || {};
    this.typeChecks = this.typeChecks || {};
    this.concepts = this.concepts || {};
    this.messages = this.messages || {};
    this.patterns = this.patterns || {};
    this.dialogsets = this.dialogsets || [];
}

exports.Bot = Bot;

Bot.prototype.setDialogs = function(dialogs)
{
    this.dialogs = this.dialogs.concat(dialogs);
};

Bot.prototype.setCommonDialogs = function(dialogs)
{
    this.commonDialogs = this.commonDialogs.concat(dialogs);
};

Bot.prototype.setTask = function(taskName, task)
{
    task.name = taskName;
    this.tasks[taskName] = task;
};

Bot.prototype.setAction = function(actionName, action)
{
    this.actions[actionName] = action;
};

Bot.prototype.setType = function(typeName, type)
{
    type.name = typeName;
    this.types[typeName] = type;
};

Bot.prototype.setTypeCheck = function(typeCheckName, typeCheck)
{
    this.typeChecks[typeCheckName] = typeCheck;
};

Bot.prototype.setConcepts = function(concepts)
{
    for (var key in concepts)
    {
        this.concepts[key] = concepts[key];
    }
};

Bot.prototype.setMessages = function(messages)
{
    for (var key in messages)
    {
        this.messages[key] = messages[key];
    }
};

Bot.prototype.setDialogPattern = function(patternName, pattern)
{
    this.patterns[patternName] = pattern;
};

function makeBot(botName, schema) {
  var bot = global._bots[botName];
  if(bot == undefined) {
    bot = new Bot(schema);
    var BotModel = mongoose.model('Bot');
    BotModel.findOne({id: botName}).lean().exec(function (err, doc) {
      if (doc != undefined) {
        utils.merge(bot, doc);
        bot.dialogsets = bot.dialogsets.concat(doc.dialogsets);

        global._bots[botName] = bot;
      } else {
        var _bot = new Bot(schema);
        utils.merge(bot, _bot);
        global._bots[botName] = bot;
      }
    });

  } else {
    var _bot = new Bot(schema);
    utils.merge(bot, _bot);
    global._bots[botName] = bot;
  }

  // var bot = new Bot(schema);
  // var BotModel = mongoose.model('Bot');
  // BotModel.findOne({id: botName}).lean().exec(function(err, doc) {
  //   if(doc != undefined) {
  //     utils.merge(bot, doc);
  //     bot.dialogsets = bot.dialogsets.concat(doc.dialogsets);
  //   }
  // });
  //
  // global._bots[botName] = bot;

  // console.log('MakeBot: ' + botName);

  return bot;
}

exports.makeBot = makeBot;

function makeTemplateBot(templateName, schema) {
  // if(global._templates == undefined) global._templates = {};

  var templateBot;
  if(global._templates[templateName] == undefined) {
    templateBot = new Bot(schema);
    global._templates[templateName] = templateBot;
  // } else {
  //   templateBot = global._templates[templateName];
  }

  // for(var key in global._bots) {
  //   var bot = global._bots[key];
  //   if(bot.template.id == templateName) {
  //     utils.merge(bot, templateBot);
  //   }
  // }
}

exports.makeTemplateBot = makeTemplateBot;

function getBot(botName)
{
    return global._bots[botName];
}

exports.getBot = getBot;

function getTemplateBot(botName) {
  return global._templates[botName];
}

exports.getTemplateBot = getTemplateBot;

function changeDialogPattern(obj, params)
{
    if ('string' == typeof obj)
    {
        var matched = obj.match(/^{(.*)}$/);
        if (matched != null && params && params[matched[1]])
        {
            return params[matched[1]];
        }
        else if(params)
        {
            obj = obj.replace(/{(.*)}/g, function(match, p1) {
                return params[p1];
            });

            return obj;
        }
    }

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Array
    if (obj instanceof Array)
    {
        for (var i = 0, len = obj.length; i < len; i++)
        {
            obj[i] = changeDialogPattern(obj[i], params);
        }

        return obj;
    }

    // Handle Object
    if (obj instanceof Object)
    {
        for (var attr in obj)
        {
            if (obj.hasOwnProperty(attr)) obj[attr] = changeDialogPattern(obj[attr], params);
        }
        return obj;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}