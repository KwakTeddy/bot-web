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

    QA.prototype.findExactly = function(bot, context, dialogsets, inputRaw, done, callback)
    {
        DialogsetDialog.find({ dialogset: { $in: dialogsets }, inputRaw: inputRaw }).limit(this.limit).populate('dialogset').populate('context').lean().exec(function(err, list)
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
                        list[i].added = 0;

                        var categories = list[i].category ? list[i].category.split('@@@') : [];
                        for(var j=0; j<categories.length; j++)
                        {
                            //사용자 입력중 대화학습의 카테고리와 일치하는 말이 있으면 가중치
                            if(inputRaw.indexOf(categories[j]) != -1)
                            {
                                list[i].added += 0.1;
                            }

                            //대화학습의 카테고리가 현재 문맥의 카테고리와 일치하는 부분이 있으면 가중치
                            if(context.session.currentCategory && context.session.currentCategory.indexOf(categories[j]) != -1 || (bot.options.topicKeywords && bot.options.topicKeywords.indexOf(categories[j]) != -1))
                            {
                                list[i].added += 0.2;
                            }
                        }

                        list = list.sort(function(a, b)
                        {
                            return (b.matchRate + b.added) - (a.matchRate + a.added);
                        });
                    }

                    return callback(null, list);
                }

                done();
            }
        });
    };

    QA.prototype.find = function(bot, context, inputRaw, synonyms, nlp, nlpText, callback)
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
            var split = inputRaw.split(' ');

            var inputRawList = [];

            //동의어 사전 쓰면 동의어 적용
            if(bot.options.useSynonymDictionary)
            {
                for(var i=0; i<split.length; i++)
                {
                    for(var j=0; j<synonyms.length; j++)
                    {
                        var index = synonyms[j].synonyms.indexOf(split[i]);
                        if(index != -1)
                        {
                            inputRawList.push(inputRaw.replace(new RegExp(split[i], 'gi'), synonyms[j].synonyms[index]));
                        }
                    }
                }
            }

            if(inputRawList.length <= 0)
            {
                inputRawList.push(inputRaw);
            }

            async.eachSeries(inputRawList, function(i, next)
            {
                //완전히 사용자 입력과 일치하는 대화셋 검색
                that.findExactly(bot, context, dialogsets, i, next, callback);
            },
            function()
            {
                done();
            });
        });

        transaction.done(function()
        {
            var checkDuplicate = {};
            var matchedList = [];
            var findWords = [];

            for(var j=0; j<nlp.length; j++)
            {
                var word = nlp[j];
                if(that.exclude.indexOf(word.text) != -1 || !word.text.trim() || word.pos == 'Josa' || word.pos == 'Suffix')
                {
                    continue;
                }

                if(bot.options.useSynonymDictionary)
                {
                    for(var i=0; i<synonyms.length; i++)
                    {
                        var list = synonyms[i].synonyms;
                        if(list.indexOf(word.text) != -1) // nlp 처리된거에 동의어를 발견하면
                        {
                            word.synonyms = list; // 넣고
                            findWords = findWords.concat(list);
                        }
                        else
                        {
                            findWords.push(word.text);
                        }
                    }
                }
                else
                {
                    findWords.push(word.text);
                }
            }

            async.eachSeries(findWords, function(word, next)
            {
                // var regexp = new RegExp('(?:^|\\s)' + word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '(?:$|\\s)', 'i');
                var regexp = new RegExp(word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
                DialogsetDialog.find({ dialogset: { $in: dialogsets }, input: regexp }).limit(this.limit).populate('dialogset').populate('context').lean().exec(function(err, list)
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
                var nlpCount = 0;
                for(var j=0; j<nlp.length; j++)
                {
                    if(nlp[j].pos == 'Josa' || nlp[j].pos == 'Suffix')
                    {
                        continue;
                    }

                    if(nlp[j].pos == 'Noun')
                    {
                        nlpCount += 3;
                    }
                    else if(nlp[j].pos == 'Verb')
                    {
                        nlpCount += 2;
                    }
                    else
                    {
                        nlpCount += 1;
                    }
                }

                for(var i=0; i<matchedList.length; i++)
                {
                    matchedList[i].added = 0;

                    if(matchedList[i].inputRaw == inputRaw)
                    {
                        matchedList[i].matchRate = 1;
                    }
                    else
                    {
                        var maxNormalCount = -1;
                        var maxNormalIndex = -1;
                        var maxCount = -1;
                        var targetInput = undefined;
                        var maxPoint = -1;
                        for(var k=0; k<matchedList[i].input.length; k++) // 멀티 input인경우
                        {
                            var normalCount = 0;
                            var count = 0;
                            var point = 0;
                            var lastIndex = -1;

                            var input = (matchedList[i].category ? matchedList[i].category.split('@@@').join(' ') : '') + matchedList[i].input[k];

                            for(var j=0; j<nlp.length; j++)
                            {
                                if(nlp[j].pos == 'Josa' || nlp[j].pos == 'Suffix')
                                {
                                    continue;
                                }

                                var index = -1;
                                if(bot.options.useSynonymDictionary && nlp[j].synonyms) // 동의어가 있으면
                                {
                                    //동의어중에 하나라도 input에 들어있으면 성공
                                    for(var k=0; k<nlp[j].synonyms.length; k++)
                                    {
                                        index = input.indexOf(nlp[j].synonyms[k]);
                                        if(index != -1)
                                        {
                                            break;
                                        }
                                    }
                                }
                                else
                                {
                                    index = input.indexOf(nlp[j].text);
                                }

                                if(index != -1)
                                {
                                    if(nlp[j].pos == 'Noun')
                                    {
                                        count += 1.3;
                                    }
                                    else if(nlp[j].pos == 'Verb')
                                    {
                                        count += 1.2;
                                    }
                                    else
                                    {
                                        count += 1.1;
                                    }

                                    normalCount++;

                                    // if(lastIndex == -1 || lastIndex <= index)
                                    // {
                                    //     var offset = 100;
                                    //     if(nlp[j].pos == 'Noun')
                                    //     {
                                    //         offset = 250;
                                    //     }
                                    //     else if(nlp[j].pos == 'Verb')
                                    //     {
                                    //         offset = 200;
                                    //     }
                                    //     else
                                    //     {
                                    //         offset = 100;
                                    //     }
                                    //
                                    //     if(lastIndex != -1)
                                    //     {
                                    //         point += ((index - lastIndex)) + ((index - nlpText.indexOf(nlp[j].text)));
                                    //     }
                                    // }

                                    lastIndex = index;
                                }
                            }

                            if(maxPoint == -1)
                            {
                                maxPoint = point;
                            }

                            if(maxCount == -1 || maxCount < count)
                            {
                                maxCount = count;
                                targetInput = input;
                            }

                            if(maxNormalCount == -1 || maxNormalCount < normalCount)
                            {
                                maxNormalCount = normalCount;
                                maxNormalIndex = matchedList[i].input[k];
                            }
                        }

                        var matchRate = (maxCount / targetInput.split(' ').length);
                        matchedList[i].matchRate = (matchRate >= 100 ? 100 : matchRate);
                        matchedList[i].added += point;

                        // if(context.session.currentCategory && matchedList[i].category)
                        // {
                        //     var targetCategories = matchedList[i].category.split('@@@');
                        //     var categories = context.session.currentCategory.split('@@@');
                        //     for(var j=0; j<categories.length && j < targetCategories.length; j++)
                        //     {
                        //         if(categories[j] == targetCategories[j])
                        //         {
                        //             matchedList[i].added += 0.1;
                        //         }
                        //     }
                        // }
                    }

                    var categories = matchedList[i].category ? matchedList[i].category.split('@@@') : [];
                    for(var j=0; j<categories.length; j++)
                    {
                        if(inputRaw.indexOf(categories[j]) != -1)
                        {
                            matchedList[i].added += 0.15;
                        }

                        if(context.session.currentCategory && context.session.currentCategory.indexOf(categories[j]) != -1)
                        {
                            matchedList[i].added += 0.05;
                        }

                        if(bot.options.topicKeywords && bot.options.topicKeywords.indexOf(categories[j]) != -1)
                        {
                            matchedList[i].added += 0.1;
                        }
                    }

                    console.log(matchedList[i].category, matchedList[i].inputRaw, matchedList[i].matchRate, matchedList[i].added, matchedList[i].matchRate + matchedList[i].added);
                }

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
