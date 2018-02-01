(function()
{
    var TaskManager = function()
    {

    };

    TaskManager.prototype.exec = function(bot, context, conversation, name, callback)
    {
        if(name && bot.tasks.hasOwnProperty(name))
        {
            var task = bot.tasks[name];
            if(typeof task.action == 'function')
            {
                // 만약 여기서 output을 변경했을경우 메모리 초기화를 하지 않으면 다이얼로그가 영원히 변경되어있다. 이 부분 처리가 필요함
                console.log();
                console.log('[[[ TASK ]]]');
                task.action(conversation, context, function()
                {
                    console.log();

                    callback();
                });

                return;
            }
        }

        callback();
    };

    module.exports = new TaskManager();
})();
