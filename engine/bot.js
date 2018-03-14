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
        return this.bots[name];
    };

    module.exports = new f();
})();
