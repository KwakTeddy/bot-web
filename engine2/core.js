var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var Error = require('./error.js');

var globals = require('./globals.js');
var channel = require('./channel.js');
var loadBalancer = require('./loadbalancer.js');

var SessionManager = require('./session.js');

var BotManager = require('./bot.js');
var InputManager = require('./input.js');
var AnswerManager = require('./answer.js');
var TaskManager = require('./task.js');
var OutputManager = require('./output.js');
var ContextManager = require('./context.js');

(function()
{
    var Core = function()
    {
        console.log();
        console.log(chalk.green('================= Engine Initailize ==================='));

        this.loadModels();
        globals.init();

        // var autoCorrection = require(path.resolve('engine2/bot/engine/nlp/autoCorrection'));
        // autoCorrection.loadWordCorrections();

        console.log(chalk.green('===================================================='));
        console.log();
    };

    Core.prototype.loadModels = function()
    {
        console.log('[Load Models START]');
        var list = fs.readdirSync(path.resolve('./engine2/models'));
        for(var i=0; i<list.length; i++)
        {
            require(path.resolve('./engine2/models/' + list[i]));
            console.log(list[i]);
        }
        console.log('[Load Models END]');
        console.log();
    };

    Core.prototype.init = function(app, io)
    {
        channel.init(app, io);
        // loadBalancer.init(app, io);
    };

    Core.prototype.process = function(botId, channel, userId, inputRaw, options, outCallback, errCallback)
    {
        console.log();
        console.log(chalk.green('======== Engine Process ========'));
        console.log('--- Parameters: ');
        console.log({ botId: botId, channel: channel, userId: userId, inputRaw: inputRaw, options: options });

        var error = new Error(errCallback);

        //1. 유저가 접속하면 제일 먼저 봇을 로딩해야 함.
        BotManager.load(botId, function(err, bot)
        {
            if(err)
            {
                error.delegate(err);
            }
            else
            {
                if(inputRaw.startsWith(':'))
                {
                    //FIXME 커맨드 실행
                    outCallback('커맨드가 실행되었습니다 ' + inputRaw);
                    console.log(chalk.green('================================'));
                    console.log();
                    return;
                }

                //2. 그 다음 세션을 생성하고. 세션은 user-bot 단위로 유지되는 데이터 이 세션은 시간이 지나면 사라진다.
                //3. 컨텍스트를 생성한다. 컨텍스트는 1 request 에서만 유지되는 데이터

                //4. input을 처리하기 위한 작업

                var session = SessionManager.make(botId, userId, channel, options);
                var context = session.context.get();
                context.nlu.sentence = inputRaw;

                InputManager.analysis(bot, session, context, error, function()
                {
                    AnswerManager.analysis(bot, session, context, error, function(answer)
                    {
                        if(answer.type == 'qa')
                        {
                            //TODO 여러개일때 랜덤하게 출력 dm도 마찬가지
                            outCallback(answer.list[0]);
                        }
                        else if(answer.type == 'dm')
                        {
                            if(answer.dialog.task)
                            {
                                TaskManager.exec(answer.dialog.task);
                            }

                            // var hasIf = false;
                            // var elseOutput = false;
                            // for(var i=0; i<answer.dialog.output.length; i++)
                            // {
                            //     var output = answer.dialog.output[i];
                            //     if(output.if)
                            //     {
                            //         //TODO 실행 후 맞으면 target에 넣어줌
                            //         hasIf = true;
                            //     }
                            // }

                            outCallback(answer.dialog.output[0].text);

                            //TODO execute postTask
                        }
                        else
                        {
                            outCallback(answer.text);
                        }

                        //output 출력하고
                        console.log(chalk.green('================================'));
                        console.log();
                    });
                });
            }
        });

        // context.makeContext(bot, channel, user, options, function(context)
        // {
        //     console.log(context);
        //     console.log('컨텍스트 끝');
        // });
        //
        // bot.loadBot();
    };

    module.exports = new Core();
})();
