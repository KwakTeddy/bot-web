var mongoose = require('mongoose');
var async = require('async');
var UserDialog = mongoose.model('UserDialog');

var speller_en = require('./auto-correction/speller_en');
var speller_ko = require('./auto-correction/speller_ko');

(function()
{
    var AutoCorrection = function()
    {

    };

    AutoCorrection.prototype.batchCorrectionDB = function(callback)
    {
        var speller = speller_ko;
        var query = { fail: false };

        UserDialog.find(query).lean().sort('+created').exec(function (err, docs)
        {
            if(docs)
            {
                async.eachSeries(docs, function (doc, cb)
                {
                    // console.log(doc.dialog);
                    speller.train(doc.dialog);
                    cb();
                },
                function (err)
                {
                    saveWordCorrections(speller.getNWords(), function()
                    {
                        console.log('batchCorrectionDB: DONE');
                        if(callback) callback();
                    });
                });

            }
            else if (err)
            {
                console.log(err);
                if(callback)
                {
                    callback();
                }
            }
        });
    };

    AutoCorrection.prototype.saveWordCorrections = function(nWords, callback)
    {
        var words = [];
        for(var i in nWords)
        {
            words.push({ word: i, count: nWords[i] });
        }

        mongoModule.remove({mongo: {model: 'wordcorrection', query: {}}}, null, function()
        {
            mongoModule.save({mongo: {model: 'wordcorrection'}, doc: words}, null, function ()
            {
                callback();
            });
        });
    };

    AutoCorrection.prototype.loadWordCorrections = function(callback)
    {
        var speller = speller_ko;

        mongoModule.find({mongo: {model: 'wordcorrection', query: {}}}, null, function(_task, _context)
        {
            var words = _task.doc, nWords = {};
            for(var i in words)
            {
                nWords[words[i].word] = words[i].count;
            }

            speller.setNWords(nWords);

            if(callback)
            {
                callback();
            }
        });
    };

    AutoCorrection.prototype.correction = function(text)
    {
        var t0 = new Date();
        var tokens = text.split(' ');
        for(var i = 0;i < tokens.length; i++)
        {
            if(tokens[i].length <= 5) tokens[i] = speller_ko.correct(tokens[i]);
        }

        var t1 = new Date();
        console.log('오타수정: ' + (t1-t0) + 'ms ' +  text + ' > ' + tokens.join(' '));

        return tokens.join(' ');
    };
})();
