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
        return bots[name];
    };
})();
