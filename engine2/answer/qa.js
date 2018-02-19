var async = require('async');
var mongoose = require('mongoose');

var Transaction = require('../utils/transaction.js');

var DialogsetDialog = mongoose.model('DialogsetDialog');

(function()
{
    var QA = function()
    {
        this.limit = 5;
        this.exclude = ['하다', '이다']; // 다른 언어는???
    };

    QA.prototype.find = function(bot, context, inputRaw, nlp, callback)
    {
        var that = this;

        var dialogsets = [];
        for(var i=0; i<bot.dialogsets.length; i++)
        {
            dialogsets.push(bot.dialogsets[i]._id);
        }

        var transaction = new Transaction.sync();
        transaction.checkDuplicate = {};

        transaction.call(function(done)
        {
            DialogsetDialog.find({ dialogset: { $in: dialogsets }, inputRaw: inputRaw }).limit(this.limit).populate('context').lean().exec(function(err, list)
            {
                if(err)
                {
                    return callback(err);
                }
                else
                {
                    if(list && list.length > 0)
                    {
                        for(var i=0; i<list.length; i++)
                        {
                            list[i].matchRate = 1;
                        }

                        return callback(null, list);
                    }

                    done();
                }
            });
        });

        transaction.done(function()
        {
            var checkDuplicate = {};
            var matchedList = [];

            async.eachSeries(nlp, function(word, next)
            {
                if(that.exclude.indexOf(word.text) != -1 || !word.text.trim())
                {
                    return next();
                }

                DialogsetDialog.find({ dialogset: { $in: dialogsets }, input: new RegExp('(?:^|\\s)' + word.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '(?:$|\\s)', 'i') }).limit(this.limit).populate('context').lean().exec(function(err, list)
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
                        var maxPoint = -1;
                        var targetInput = undefined;

                        for(var k=0; k<matchedList[i].input.length; k++) // 멀티 input인경우
                        {
                            var point = 0;
                            var lastIndex = -1;

                            for(var j=0; j<nlp.length; j++)
                            {
                                var index = matchedList[i].input[k].indexOf(nlp[j].text);
                                if(index != -1 && (lastIndex == -1 || lastIndex <= index))
                                {
                                    point += 100 - (index - lastIndex);

                                    if(nlp[j].pos == 'Noun')
                                    {
                                        point += 50;
                                    }
                                }
                                else if(matchedList[i].category.indexOf(nlp[j].text) != -1)
                                {
                                    point += 100;
                                }
                            }

                            if(maxPoint == -1)
                            {
                                maxPoint = point;
                            }
                        }

                        matchedList[i].matchRate = point;

                        console.log('인풋 : ', matchedList[i].input, point);

                        matchedList[i].added = 0;
                        if(context.session.currentCategory && matchedList[i].category)
                        {
                            var targetCategories = matchedList[i].category.split('@@@');
                            var categories = context.session.currentCategory.split('@@@');
                            for(var j=0; j<categories.length && j < targetCategories.length; j++)
                            {
                                if(categories[j] == targetCategories[j])
                                {
                                    matchedList[i].added += 500;
                                }
                            }
                        }
                    }
                }

                // var resultList = [];
                // for(var i=0; i<matchedList.length; i++)
                // {
                //     if(matchedList[i].matchRate && matchedList[i].matchRate >= (bot.options.dialogsetMinMatchRate || 0.5))
                //     {
                //         for(var j=0; j<nlp.length; j++)
                //         {
                //             if(nlp[j].pos == 'Noun' && matchedList[i].category.indexOf(nlp[j].text) != -1)
                //             {
                //                 matchedList[i].added++;
                //             }
                //         }
                //
                //         resultList.push(matchedList[i]);
                //     }
                // }

                matchedList = matchedList.sort(function(a, b)
                {
                    return (b.matchRate + b.added) - (a.matchRate + a.added);
                });

                callback(null, matchedList);
            });
        });
    };

    module.exports = new QA();
})();
