(function()
{
    var bots = {};
    module.exports.bots = bots;
    module.exports.makeBot = function(name, obj)
    {
        bots[name] = obj;
    };

    module.exports.getBot = function(name)
    {
        console.log('흠 : ', bots.hasOwnProperty(name));
        return bots[name];
    };
})();
