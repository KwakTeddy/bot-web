(function()
{
    var command = {};
    command.name = ':reset user';
    command.action = function()
    {
        // startDialog = dialog.findDialog(null, context, dialog.START_DIALOG_NAME);
        // if(!startDialog)
        //     print('안녕하세요.' + (context.bot.name || context.botUser.curBotName) + '입니다.');
        // else
        //     dialog.executeDialog(startDialog, context, print, callback);
    };

    module.exports = command;
})();
