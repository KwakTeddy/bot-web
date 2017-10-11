/**
 * Created by nzt on 15. 4. 26.
 */
var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));
var java = require('java');
var async = require('async');

var processManager = require('../process-manager.js');

//
java.classpath.push(path.resolve('./external_modules/scala-library-2.11.6.jar'));
java.classpath.push(path.resolve('./external_modules/twitter-text-1.11.1.jar'));
java.classpath.push(path.resolve('./external_modules/korean-text-3.0.jar'));


java.options.push('-Xmx2048m');
java.options.push('-Xmx4096m');

(function()
{
    var NLPKo = function(options)
    {
        this.options = options;
        this.builder = undefined;
        this.processor = undefined;
        this.done = undefined;
        this.isDone = false;
    };

    NLPKo.prototype.initialize = function(done, errCallback)
    {
        this.done = function()
        {
            logger.systemLog(' - NLPKo loaded');
            done();
        };
        this.getBuilder(errCallback);
    };

    NLPKo.prototype.getBuilder = function(errCallback)
    {
        var that = this;
        java.newInstance('com.twitter.penguin.korean.TwitterKoreanProcessorJava$Builder', function(err, builder)
        {
            if (err)
                return errCallback(err);

            that.builder = builder;
            that.normalize(errCallback);
        });
    };

    NLPKo.prototype.normalize = function(errCallback)
    {
        var that = this;
        if (this.options && this.options.normalizer === false)
        {
            this.builder.disableNormalizer(function(err)
            {
                if (err)
                    return errCallback(err);

                that.steemer(errCallback);
            });

            return;
        }

        this.steemer(errCallback);
    };

    NLPKo.prototype.steemer = function(errCallback)
    {
        var that = this;
        if (this.options && this.options.stemmer === false)
        {
            this.builder.disableStemmer(function(err)
            {
                if (err)
                    return errCallback(err);

                that.spamFilter(errCallback);
            });

            return;
        }

        this.spamFilter(errCallback);
    };

    NLPKo.prototype.spamFilter = function(errCallback)
    {
        var that = this;
        if (this.options && this.options.spamfilter === true)
        {
            this.builder.enablePhraseExtractorSpamFilter(function(err)
            {
                if (err)
                    return errCallback(err);

                that.build(errCallback);
            });

            return;
        }

        this.build(errCallback);
    };

    NLPKo.prototype.build = function(errCallback)
    {
        var that = this;
        this.builder.build(function(err, processor)
        {
            if (err)
                return errCallback(err);

            that.processor = processor;
            that.isDone = true;
            that.done();
        });
    };

    NLPKo.prototype.tokenize = function(rawText, done, errCallback)
    {
        var that = this;
        this.processor.tokenize(rawText, function(err, result)
        {
            if(err)
                return errCallback(err);
            
            result.toArray(function(err, tokenArray)
            {
                async.map(tokenArray, KoreanTokenToJSON, function(err, result)
                {
                    if(err)
                        return errCallback(err);

                    that.afterTokenize(rawText, result, done);
                });
            })
        });
    };

    NLPKo.prototype.afterTokenize = function(rawText, tokenizedText, done)
    {
        var result = {};
        result.original = tokenizedText;
        result.processed = [];
        result.processedTexts = [];

        var nlpAll = [];
        for (var i = 0, l=tokenizedText.length; i < l; i++)
        {
            if(tokenizedText[i].pos == 'Alpha')
                tokenizedText[i].pos = 'Noun';

            nlpAll.push(tokenizedText[i]);
            if(tokenizedText[i].text && tokenizedText[i].text.search(/^(은|는|이|가|을|를)$/) == -1 && tokenizedText[i].pos !== 'Punctuation')
            {
                result.processed.push(tokenizedText[i]);
                result.processedTexts.push(tokenizedText[i].text);
            }
        }

        var nlpedText = result.processedTexts.join(' ');
        nlpedText = nlpedText.replace(/(?:\{ | \})/g, '+');

        if(nlpedText == '')
            nlpedText = rawText;

        result.nlpedText = nlpedText;

        done(result);
    };

    module.exports = NLPKo;

    // processor.prototype.tokenizeToStrings = function(string, callback)
    // {
    //     this._processor.tokenizeToStrings(string, function(err, result)
    //     {
    //         if (err)
    //             return callback(err);
    //
    //         result.toArray(callback);
    //     });
    // };
    //
    // processor.prototype.extractPhrases = function(string, callback)
    // {
    //     var _processor = this._processor;
    //
    //     async.waterfall([
    //             function(callback)
    //             {
    //                 _processor.extractPhrases(string ,callback);
    //             },
    //             function(result, callback)
    //             {
    //                 result.toArray(callback);
    //             },
    //             function(tokenArray, callback)
    //             {
    //                 async.map(tokenArray, KoreanTokenToJSON, callback);
    //             }],
    //         function(err, result)
    //         {
    //             if (err)
    //                 return callback(err);
    //
    //             callback(null, result);
    //         });
    // };

    function KoreanTokenToJSON(classObj, callback)
    {
        var token = {};
        async.waterfall([ function(callback)
        {
            classObj.text(function(err, text)
            {
                if (err)
                    return callback(err);
                token.text = text;
                callback();
            })
        },
        function(callback)
        {
            classObj.pos(function(err, pos)
            {
                if (err)
                    return callback(err);

                token.pos = pos.toString();
                callback();
            });
        },
        function(callback)
        {
            classObj.offset(function(err, offset)
            {
                if (err)
                    return callback(err);

                token.offset = offset;
                callback();
            })
        },
        function(callback)
        {
            classObj.length(function(err, length)
            {
                if (err)
                    return callback(err);

                token.length = length;
                callback();
            })
        },
        function(callback)
        {
            if (classObj.hasOwnProperty('unknown'))
            {
                classObj.unknown(function(err, unknown)
                {
                    if (err)
                        return callback(err);

                    token.unknown = unknown;
                    callback();
                });
            }
            else
            {
                callback();
            }
        }],
        function(err)
        {
            if (err)
                return callback(err);

            callback(null, token);
        });
    }
})();
