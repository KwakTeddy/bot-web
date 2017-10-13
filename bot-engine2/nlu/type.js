var async = require('async');

function executeType(text, type, inDoc, context, successCallback)
{
    if(type)
    {
        type.typeCheck(text, type, inDoc, context, successCallback);
    }
    else
    {
        successCallback(text, inDoc);
    }
};

module.exports.extractType = function(rawText, types, successCallback)
{
    var extracted = {};
    async.eachSeries(types, function(type, done)
    {
        type.typeCheck(rawText, function(replacedText, matched, result)
        {
            if(matched)
            {
                rawText = replacedText;
                for(var key in result)
                {
                    extracted[key] = result[key];
                }
            }

            done();
        });
    },
    function()
    {
        successCallback(rawText, extracted);
    });
};
