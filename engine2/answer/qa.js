var async = require('async');
var mongoose = require('mongoose');

var DialogsetDialog = mongoose.model('DialogsetDialog');

(function()
{
    var QA = function()
    {
        this.limit = 5;
        this.exclude = ['하다', '이다']; // 다른 언어는???

        //봇별로 과연 여기 옵션들을 건드릴까?
    };

    QA.prototype.find = function(bot, nlp, callback)
{
    var checkDuplicate = {};
    var matchedList = [];
    async.eachSeries(nlp, function(word, next)
        {
            DialogsetDialog.find({ input: new RegExp('(?:^|\\s)' + word + '(?:$|\\s)', 'i') }).limit(this.limit).lean().exec(function(err, list)
            {
                if(err)
                {
                    return callback(err);
                }

                for(var i=0; i<list.length; i++)
                {
                    if(!checkDuplicate[list[i]._id]) // exclude도 제외시킨다.
                    {
                        matchedList.push(list[i]);
                        checkDuplicate[list[i]._id] = true;
                    }
                }

                next();
            });
        },
        function()
        {
            callback(null, matchedList);
        })
};

    module.exports = new QA();
})();
