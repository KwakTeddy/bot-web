var type = process.argv[2];
var botId = process.argv[3];
var taskName = process.argv[4];
var dialogInstance = JSON.parse(process.argv[5]);
var context = JSON.parse(process.argv[6]);

var Bot = (function()
{
    var BotClass = function()
    {
        this.tasks = {};
        this.types = {};
    };

    BotClass.prototype.setTask = function(name, task)
    {
        this.tasks[name] = task;
    };

    BotClass.prototype.setType = function()
    {

    };

    return new BotClass();
})();

require('./custom_modules/' + botId + '/default.js')(Bot);


Bot.tasks[taskName][type].call(Bot.tasks[taskName], dialogInstance, context, function(isRetry, messages)
{
    console.log('[result][start]');
    console.log(isRetry);
    console.log(JSON.stringify(messages));
    console.log(JSON.stringify(dialogInstance));
    console.log(JSON.stringify(context));
    console.log('[result][end]');
});
