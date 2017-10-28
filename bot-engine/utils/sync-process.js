(function()
{
    var make = function(callback)
    {
        var index = 0;
        var funcs = [];

        var datas = {};

        var _return = function(params)
        {
            for(var key in params)
            {
                datas[key] = params[key];
            }

            if(index < funcs.length)
            {
                var func = funcs[index];
                func.call(func.arguments);
            }
            else
            {
                Function.prototype.sync = undefined;
            }
        };

        Function.prototype.sync = function()
        {
            arguments.push(_return);
            funcs.push({call: this, arguments: arguments});

            if(index == 0)
            {
                funcs[index++].call(arguments);
            }
        };

        if(callback)
            callback(datas);
    };

    module.exports.make = make;
})();
