var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var globals = require('./globals.js');
var channel = require('./channel.js');
var loadBalancer = require('./loadbalancer.js');

var context = require('./context.js');

(function()
{
    console.log('엔진호출');
    var Engine = function()
    {
        console.log();
        console.log(chalk.green('================= Engine Initailize ==================='));

        this.loadModels();
        globals.init();

        // var autoCorrection = require(path.resolve('engine/bot/engine/nlp/autoCorrection'));
        // autoCorrection.loadWordCorrections();

        console.log(chalk.green('===================================================='));
        console.log();
    };

    Engine.prototype.loadModels = function()
    {
        console.log('[Load Models START]');
        var list = fs.readdirSync(path.resolve('./engine/models'));
        for(var i=0; i<list.length; i++)
        {
            require(path.resolve('./engine/models/' + list[i]));
            console.log(list[i]);
        }
        console.log('[Load Models END]');
        console.log();
    };

    Engine.prototype.init = function(app, io)
    {
        channel.init(app, io);
        // loadBalancer.init(app, io);
    };

    Engine.prototype.process = function(bot, channel, user, msg, options, callback)
    {
        console.log();
        console.log(chalk.green('======== Engine Process ========'));
        console.log('--- Parameters: ');
        console.log({ bot: bot, channel: channel, user: user, msg: msg, options: options });


        context.makeContext(bot, channel, user, options, function()
        {
            console.log('컨텍스트 끝');
        });


        console.log(chalk.green('================================'));
        console.log();
    };

    module.exports = new Engine();
})();
