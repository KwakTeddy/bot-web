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
        var that = this;

        var dialogsets = [];
        for(var i=0; i<bot.dialogsets.length; i++)
        {
            dialogsets.push(bot.dialogsets[i]._id);
        }

        var checkDuplicate = {};
        var matchedList = [];
        async.eachSeries(nlp, function(word, next)
        {
            if(that.exclude.indexOf(word.text) != -1 || !word.text.trim())
            {
                return next();
            }

            DialogsetDialog.find({ dialogset: { $in: dialogsets }, input: new RegExp('(?:^|\\s)' + word.text.replace(/\(/gi, '\\(').replace(/\)/gi, '\\(') + '(?:$|\\s)', 'i') }).limit(this.limit).lean().exec(function(err, list)
            {
                if(err)
                {
                    return callback(err);
                }

                for(var i=0; i<list.length; i++)
                {
                    if(!checkDuplicate[list[i]._id]) // exclude도 제외시킨다.
                    {
                        checkDuplicate[list[i]._id] = JSON.parse(JSON.stringify(list[i]));
                        checkDuplicate[list[i]._id].matchCount = 1;
                        matchedList.push(checkDuplicate[list[i]._id]);
                    }
                    else
                    {
                        checkDuplicate[list[i]._id].matchCount++;
                    }
                }

                next();
            });
        },
        function()
        {
            matchedList.sort(function(a, b)
            {
                return b.matchCount - a.matchCount;
            });

            callback(null, matchedList);
        })
    };

    module.exports = new QA();
})();
