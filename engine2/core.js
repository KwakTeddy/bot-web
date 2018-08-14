var chalk = require('chalk');
var async = require('async');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

var Error = require('./error.js');

var Logger = require('./logger.js');

var SystemMessages = require('./system-messages.js');

var globals = require('./globals.js');
var channel = require('./channel.js');

var Context = require('./context.js');
var Command = require('./command.js');
var BotManager = require('./bot.js');
var InputManager = require('./input.js');
var KnowledgeGraph = require('./km.js');
var AnswerManager = require('./answer.js');

var Transaction = require('./utils/transaction.js');

var AWS = require('aws-sdk');
AWS.config.update(require(path.resolve('./aws-s3-credentials.json')));
var s3 = new AWS.S3();

(function()
{
    var Core = function()
    {
        this.version = '';
        this.redis = undefined;

        console.log();
        console.log(chalk.green('================= Engine Initailize ==================='));

        globals.init();

        console.log(chalk.green('===================================================='));
        console.log();
    };

    Core.prototype.setRedisClient = function(client)
    {
        this.redis = client;
    };

    Core.prototype.init = function(app, io)
    {
        channel.init(app, io);
        // loadBalancer.init(app, io);
    };

    Core.prototype.getBot = function(botId, callback, errCallback)
    {
        var error = new Error(errCallback);

        BotManager.load(botId, function(err, bot)
        {
            if(err)
            {
                error.delegate(err);
            }
            else
            {
                callback(bot);
            }
        });
    };

    Core.prototype.downloadFromS3 = function(botId, callback)
    {
        // 스케일링됐을 경우 모든 봇 파일들을 동기화 하기 위해 s3에서 다운로드 받음.
        if(process.env.NODE_ENV == 'production')
        {
            if(fs.existsSync(path.resolve('./custom_modules/' + botId)))
            {
                return callback();
            }

            var params = {
                Bucket: 'playchat-custom-modules',
                Delimiter: '',
                Prefix: botId
            }

            s3.listObjects(params, function (err, data)
            {
                if(err)
                {
                    return callback(err);
                }

                fs.mkdirSync(path.resolve('./custom_modules/' + botId));

                var list = data.Contents;
                async.eachSeries(list, function(item, next)
                {
                    if(item.Key == botId + '/')
                    {
                        return next();
                    }

                    s3.getObject({ Bucket: "playchat-custom-modules", Key: item.Key }, function (err, data)
                    {
                        if(err != null)
                        {
                            rimraf(path.resolve('./custom_modules/' + botId), function () { console.log('done'); });
                            callback(err);
                        }
                        else
                        {
                            var content = data.Body.toString('utf-8');
                            fs.writeFileSync(path.resolve('./custom_modules/' + item.Key), content);
                            next();
                        }
                    });
                },
                function()
                {
                    callback(null, botId);
                });
            });
        }
        else
        {
            callback(null, botId);
        }
    };

    Core.prototype.process = function(botId, channel, userKey, inputRaw, options, outCallback, errCallback)
    {
        var that = this;

        //console.log();
        //console.log(chalk.green('======================== Engine Process ========================'));
        //console.log(chalk.yellow('[[[ Parameter ]]]'));
        //console.log({ botId: botId, channel: channel, userKey: userKey, inputRaw: inputRaw, options: options });
        //console.log();

        Logger.logBotUser(botId, channel, userKey, {});

        var error = new Error(errCallback);
        this.downloadFromS3(botId, function(err)
        {
            if(err)
            {
                return error.delegate(err);
            }

            if(!botId)
            {
                return error.delegate('bot is not found');
            }

            // 봇 로딩. 이미 메모리에 로딩이 됐으면 그냥 쓰고 아니면 로딩함
            BotManager.load(botId, function(err, bot)
            {
                if(err)
                {
                    error.delegate(err);
                }
                else
                {
                    if(!bot.options || !bot.options.version)
                    {
                        return errCallback('old-version');
                    }

                    var contextKey = botId + '_' + userKey;
                    //스케일링됐을때 여러 서버에 request가 가더라도 사용자가 대화한 기록이 남아있을 수 있게끔 레디스를 활용함
                    that.redis.get(contextKey, function(err, context)
                    {
                        if(err)
                        {
                            error.delegate(err);
                        }
                        else
                        {
                            if(!context)
                            {
                                context = Context.create();
                            }
                            else
                            {
                                context = JSON.parse(context);
                                Context.init(context);
                            }

                            context.globals = globals;
                            context.user.userKey = userKey;
                            context.bot = bot;
                            context.channel.name = channel;

                            if(options)
                            {
                                if(options.user)
                                {
                                    for(var key in options.user)
                                    {
                                        context.user[key] = options.user[key];
                                    }
                                }
                                else if(options.session)
                                {
                                    for(var key in options.session)
                                    {
                                        context.session[key] = options.session[key];
                                    }
                                }
                            }

                            if(!bot)
                            {
                                //만약 봇 로딩이 제대로 안된다면 옛날 버전의 봇임.
                                return outCallback(context, { type: 'dialog', output: { kind: 'Content', text: SystemMessages['There is an unsupported version of the bot. if you are using previous version, then please move below.'].ko, buttons: [{ text: 'https://old.playchat.ai', url: 'https://old.playchat.ai' }] } });
                            }
                            else if(!bot.options.use)
                            {
                                return outCallback(context, SystemMessages['You can\'t use this bot']);
                            }

                            if(inputRaw.startsWith(':'))
                            {
                                // 대화를 처음부터 시작한다든지, 레디스 메모리를 클리어 한다든지 하는 커맨드 실행
                                Command.execute(that.redis, contextKey, inputRaw, bot, context, error, outCallback);
                                return;
                            }

                            if(context.session.history.length > 10)
                            {
                                //각 사용자별로 봇과 대화한 히스토리 관리
                                context.session.history.splice(context.session.history.length-1, 1);
                            }

                            if(bot.options.toLowerCase)
                            {
                                inputRaw = inputRaw.toLowerCase();
                            }

                            var userInput = { text: inputRaw };
                            //사용자 입력을 분석함
                            InputManager.analysis(bot, context, userInput, error, function()
                            {
                                var transaction = new Transaction.sync();

                                if(bot.options.useKnowledgeMemory)
                                {
                                    //지식그래프로 데모용 코드
                                    transaction.call(function(done)
                                    {
                                        KnowledgeGraph.memory(bot, userInput, error, function(numAffected)
                                        {
                                            if(numAffected && numAffected.ok == 1 && numAffected.n > 0)
                                            {
                                                if (bot.language == "zh")
                                                {
                                                    outCallback(context, '我学到了你说的话。');
                                                }
                                                else if (bot.language == "en")
                                                {
                                                    outCallback(context, 'I understand.');
                                                }
                                                else
                                                {
                                                    outCallback(context, '말씀하신 내용을 학습했어요.');
                                                }
                                            }
                                            else
                                            {
                                                done();
                                            }
                                        });
                                    });
                                }
                                else
                                {
                                    transaction.done(function()
                                    {
                                        //분석된 사용자 입력 기반으로 답을 찾아주는 모듈
                                        AnswerManager.answer(bot, context, userInput, error, function(dialog)
                                        {
                                            delete context.bot;
                                            delete context.channel;
                                            delete context.globals;
                                            delete context.session.currentDialog;

                                            var demo = context.demo;

                                            delete context.demo;
                                            //if(bot.options.similarQuestionSearch){
                                            //    delete dialog.output
                                            //}

                                            that.redis.set(contextKey, JSON.stringify(context), function(err)
                                            {
                                                if(err)
                                                {
                                                    error.delegate(err);
                                                }
                                                else
                                                {
                                                    //테스트 필요
                                                    that.redis.expireat(contextKey, parseInt((+new Date)/1000) + (1000 * 60 * 5));

                                                    context.bot = bot;
                                                    context.userInput = userInput;
                                                    context.demo = demo;
                                                    outCallback(context, dialog);

                                                    //여기서 소켓으로 올려보내자 userkey로 구분해서
                                                    // Logger.chatLog(userKey, { userKey: userKey, inputRaw: inputRaw, output: dialog });
                                                    if(Logger.userSockets[userKey])
                                                    {
                                                        Logger.userSockets[userKey].emit('chat_log', { type: 'dialog', inputRaw: inputRaw, output: dialog.output });
                                                    }
                                                }
                                            });
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    };

    module.exports = new Core();
})();
