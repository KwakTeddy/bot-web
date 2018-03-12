(function()
{
    var f = function()
    {
        this.bots = {};
    };

    f.prototype.makeBot = function(name, obj)
    {
        this.bots[name] = obj;
    };

    f.prototype.getBot = function(name)
    {
        console.log('흠 : ', bots.hasOwnProperty(name));
        return bots[name];
    };

    module.exports = new f;
})();
