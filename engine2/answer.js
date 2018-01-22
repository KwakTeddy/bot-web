var QA = require('./answer/qa.js');

(function()
{
    var AnswerManager = function()
    {

    };

    AnswerManager.prototype.analysis = function(bot)
    {
        QA.find(bot);
    };

    module.exports = new AnswerManager();
})();
