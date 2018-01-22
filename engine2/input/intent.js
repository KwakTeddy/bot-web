(function()
{
    var IntentManager = function()
    {

    };

    IntentManager.prototype.analysis = function(inputRaw, nlp, callback)
    {
        var nounList = [];

        console.log('인텐트 분석 : ', inputRaw, nlp);
    };

    module.exports = new IntentManager();
})();
