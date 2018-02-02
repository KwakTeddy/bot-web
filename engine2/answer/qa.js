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

    QA.prototype.find = function(bot, inputRaw, nlp, callback)
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
                    if(!checkDuplicate[list[i]._id])
                    {
                        checkDuplicate[list[i]._id] = JSON.parse(JSON.stringify(list[i]));
                        matchedList.push(checkDuplicate[list[i]._id]);
                    }
                }

                next();
            });
        },
        function()
        {
            for(var i=0; i<matchedList.length; i++)
            {
                if(matchedList[i].inputRaw == inputRaw)
                {
                    matchedList[i].matchRate = 1;
                }
                else
                {
                    var maxCount = -1;
                    var targetInput = undefined;
                    for(var k=0; k<matchedList[i].input.length; k++)
                    {
                        var count = 0;
                        for(var j=0; j<nlp.length; j++)
                        {
                            if(matchedList[i].input[k].indexOf(nlp[j].text) != -1)
                            {
                                count++;
                            }
                        }

                        if(maxCount == -1)
                        {
                            maxCount = count;
                            targetInput = matchedList[i].input[k];
                        }
                    }

                    var inputs = targetInput.split(' ');
                    matchedList[i].matchRate = (maxCount / inputs.length);
                }
            }

            matchedList.sort(function(a, b)
            {
                return b.matchRate - a.matchRate;
            });

            callback(null, matchedList);
        })
    };

    module.exports = new QA();
})();
