module.exports = function(bot) {
    bot.setTask("defaultTask",
        {
            action: function (dialog, context, callback) {
                callback();
            }
        });

    bot.setTask('start',
        {
            action: function (dialog, context, callback) {
                dialog.output[0].image = {url: "http://chuantu.biz/t6/245/1520301024x-1404764858.png"};
                callback();
            }
        });
};
