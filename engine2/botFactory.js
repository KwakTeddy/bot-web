var path = require('path');
var mongoose = require('mongoose');

var utils = require(path.resolve('./engine/utils/utils.js'));
var Logger = require(path.resolve('./engine/logger.js'));
var Error = require(path.resolve('./engine/error.js'));

var Config = require(path.resolve('./engine/config.js'));

var Globals = require(path.resolve('./engine/globals.js'));

var Bot = require('./bot-factory/bot.js');

var BotModel = mongoose.model('Bot');
var TemplateModel = mongoose.model('Template');

(function()
{
    var BotFactory = function()
    {

    };

    BotFactory.prototype.loadBot = function(bot, user, callback)
    {
        BotModel.findOne({ id: bot }).lean().exec(function(err, doc)
        {
            if(err)
            {
                return Error.delegate(user, err);
            }

            if(!doc)
            {
                return Error.delegate(user, bot + ' is not registered bot');
            }
            else
            {
                var botContext = new Bot(doc);

                botContext.setDialogs(Globals.dialogs.startDialogs);

                callback(botContext, user);
            }
        });
    };

    BotFactory.prototype.loadTemplateData = function(botContext, user, callback)
    {
        //템플릿봇일경우 템플릿 데이터를 바인딩 해주는것.
        TemplateModel.findOne({_id: bot.templateId}).lean().exec(function(err, doc)
        {
            if(err)
            {
                return Error.delegate(user, err);
            }

            if(doc)
            {
                try
                {
                    //실제 봇 파일 로딩
                    utils.requireNoCache('templates/' + doc.id + '/bot/' + doc.id + '.bot.js', true);

                    botContext.template = doc;

                    var files = fs.readdirSync(path.resolve('./templates/' + doc.id));
                    async.eachSeries(files, function(file, next)
                    {
                        if(!file.startsWith('playchat-') && file.endsWith('.json'))
                        {
                            var data = fs.readFileSync(path.resolve('./templates/' + doc.id + '/' + file));

                            var schemaPostFix = file.split('-')[0];

                            var json = JSON.parse(data);
                            json.botId = 'String';

                            var schema = new mongoose.Schema(json);
                            if(mongoose.models[doc.id + '-' + schemaPostFix])
                                schema = mongoose.model(doc.id + '-' + schemaPostFix);
                            else
                                schema = mongoose.model(doc.id + '-' + schemaPostFix, schema);

                            schema.find({ botId: bot.id }).lean().exec(function(err, doc1)
                            {
                                if(schemaPostFix == 'data')
                                {
                                    if(doc1.length == 1 && doc1[0])
                                    {
                                        for(var key in doc1[0])
                                        {
                                            botContext[key] = doc1[0][key];
                                        }
                                    }
                                }
                                else
                                {
                                    var tempData = {};
                                    tempData[schemaPostFix] = doc1 || [];

                                    utils.merge(botContext, tempData);
                                }

                                next();
                            });
                        }
                        else
                        {
                            next();
                        }
                    },
                    function()
                    {
                        callback();
                    });
                }
                catch(err)
                {
                    Error.delegate(user, err);
                }
            }
            else
            {
                callback();
            }
        });
    };

    BotFactory.prototype.load = function(bot, user)
    {
        // TODO 개발 시 node 재시작 안하려고 임시로
        utils.requireNoCache(path.resolve('./engine/bot/action/common/dialog'));
        utils.requireNoCache(path.resolve('./engine/bot/action/common/task'));
        utils.requireNoCache(path.resolve('./engine/bot/action/common/type'));
        utils.requireNoCache(path.resolve('./engine/bot/global/type/common.type'));
        utils.requireNoCache(path.resolve('./engine/global/global-dialogs.js'));

        var globalDialogs = require(path.resolve('./engine/global/global-dialogs.js'));

        console.log('Loading Bot: ' + botId);

        var that = this;
        this.loadBot(bot, user, function(botContext)
        {
            if(botContext.templateId)
            {
                that.loadTemplateData(botContext, user, function()
                {

                });
            }
        });
    };

    module.exports = new BotFactory();
})();
