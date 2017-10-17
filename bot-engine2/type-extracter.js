var async = require('async');

(function()
{
    var TypeExtracter = function()
    {

    };

    TypeExtracter.prototype.extract = function(types, rawText, done)
    {
        var extracted = {};
        async.eachSeries(types, function(type, next)
        {
            types.typeCheck(rawText, function(replacedText, matched, result)
            {
                if(matched)
                {
                    rawText = replacedText;
                    for(var key in result)
                    {
                        extracted[key] = result[key];
                    }
                }

                next();
            });
        }, function()
        {
            done(rawText, extracted);
        });
    };

    module.exports = new TypeExtracter();
})();
