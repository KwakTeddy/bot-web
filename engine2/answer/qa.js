var mongoose = require('mongoose');

var DialogsetDialog = mongoose.model('DialogsetDialog');

(function()
{
    var QA = function()
    {
        this.limit = 5;
    };

    QA.prototype.find = function(bot)
    {

    };

    module.exports = new QA();
})();
