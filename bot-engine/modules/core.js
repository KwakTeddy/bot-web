var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));
var AsyncProcess = require('./common/async-process/core.js');
var processManager = require('./process-manager.js');
var nlpManager = require('./nlp-manager.js');

var socketReceiver = require(path.resolve('./bot-engine/modules/receiver/socket-receiver.js'));

(function()
{
    var Core = function()
    {
        this.app;
    };

    Core.prototype.initialize = function(app, startServer)
    {
        var ap = new AsyncProcess(2);

        logger.systemLog('\n====================== Bot Engine Initialize [START]');
        ap.done(function()
        {
            logger.systemLog('====================== Bot Engine Initialize [END]');
            startServer();
        });

        this.app = app;
        socketReceiver.initialize(this, app.io, ap.makeAsyncProcess());
        nlpManager.initialize('ko', ap.makeAsyncProcess());
    };

    Core.prototype.process = function(requestData, responseCallback)
    {
        var botId = requestData.botId;
        var userId = requestData.userId;
        var channel = requestData.channel || 'socket';
        var userInputText = requestData.userInputText;

        // 유저 인풋이 커맨드인 경우가 있다. 시스템 커맨드. 그건 NLP 처리 될 필요가 없다.

        if(userInputText.startsWith(':'))
        {
            //커맨드를 실행시킨다.
            console.log('커맨드 실행합니다');
        }
        else
        {
            nlpManager.tokenize(userInputText, function(result)
            {
                //이후 진행.
            });
        }
    };


    module.exports = new Core();
})();
