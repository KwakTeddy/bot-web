(function()
{
    var InputManager = function()
    {

    };

    InputManager.prototype.process = function(session, inputRaw, callback)
    {
        console.log();
        console.log('----- Input Process [Start]');
        console.log('inputRaw : ', inputRaw);

        session.botUser.nlu.sentence = inputRaw;

        inputRaw = inputRaw.replace(/^\s+|\s+$/g,"");



        console.log('----- Input Process [End]');
    };

    module.exports = new InputManager();
})();
