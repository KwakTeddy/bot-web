/**
 * Created by nzt on 15. 4. 26.
 */
var path = require('path');
var async = require('async');
var deasync = require('deasync');
var java = require('java');

java.classpath.push(path.resolve('./engine2/input/nlp/twitter/scala-library-2.11.6.jar'));
java.classpath.push(path.resolve('./engine2/input/nlp/twitter/twitter-text-1.11.1.jar'));
java.classpath.push(path.resolve('./engine2/input/nlp/twitter/korean-text-3.0.jar'));
java.classpath.push(path.resolve('./engine2/input/nlp/opennlp/lib/opennlp-tools-1.6.0.jar'));

java.options.push('-Xmx2048m');
java.options.push('-Xmx4096m');

var processor = function(options)
{
    // var procBuilder;
    var self = this;
    var that = this;
    var done = false;
    this.procBuilder = undefined;

    java.newInstance('com.twitter.penguin.korean.TwitterKoreanProcessorJava$Builder', function(err, procBuilder)
    {
        if(err)
        {
            throw new Error(err);
        }

        self.procBuilder = procBuilder;

        async.waterfall([
            function(callback) {
                if (options && options.normalizer === false)
                    return that.procBuilder.disableNormalizer(function(err) {
                        if (err)
                            return callback(err);
                        callback();
                    });

                callback();
            },
            function(callback) {
                if (options && options.stemmer === false)
                    return that.procBuilder.disableStemmer(function(err) {
                        if (err)
                            return callback(err);
                        callback();
                    });

                callback();
            },
            function(callback) {
                if (options && options.spamfilter === true)
                    return that.procBuilder.enablePhraseExtractorSpamFilter(function(err) {
                        if (err)
                            return callback(err);
                        callback();
                    });

                callback();
            },
            function(callback) {
                that.procBuilder.build(function(err, processor) {
                    if (err)
                        return callback(err);

                    self._processor = processor;
                    callback();
                })
            }
        ], function(err) {
            if (err)
                self._err = err;

            done = true;
        });
    });


    while(!done) {
        deasync.runLoopOnce();
    }
};

processor.prototype.tokenizeToStrings = function(string, callback) {
    this._processor.tokenizeToStrings(string, function(err, result) {
        if (err)
            return callback(err);

        result.toArray(callback);
    });
};

processor.prototype.tokenize = function(string, callback) {
    var _processor = this._processor;

    async.waterfall([
        function(callback) {
            _processor.tokenize(string ,callback);
        },
        function(result, callback) {
            result.toArray(callback);
        },
        function(tokenArray, callback) {
            async.map(tokenArray, KoreanTokenToJSON, callback);
        }
    ], function(err, result) {
        if (err)
            return callback(err);

        callback(null, result);
    });
};

processor.prototype.extractPhrases = function(string, callback) {
    var _processor = this._processor;

    async.waterfall([
        function(callback) {
            _processor.extractPhrases(string ,callback);
        },
        function(result, callback) {
            result.toArray(callback);
        },
        function(tokenArray, callback) {
            async.map(tokenArray, KoreanTokenToJSON, callback);
        }
    ], function(err, result) {
        if (err)
            return callback(err);

        callback(null, result);
    });
};

function KoreanTokenToJSON(classObj, callback) {
    var token = {};
    async.waterfall([
        function(callback) {
            classObj.text(function(err, text) {
                if (err)
                    return callback(err);
                token.text = text;
                callback();
            })
        },
        function(callback) {
            classObj.pos(function(err, pos) {
                if (err)
                    return callback(err);

                token.pos = pos.toString();
                callback();
            });
        },
        function(callback) {
            classObj.offset(function(err, offset) {
                if (err)
                    return callback(err);

                token.offset = offset;
                callback();
            })
        },
        function(callback) {
            classObj.length(function(err, length) {
                if (err)
                    return callback(err);

                token.length = length;
                callback();
            })
        },
        function(callback) {
            if (classObj.hasOwnProperty('unknown')) {
                classObj.unknown(function(err, unknown) {
                    if (err)
                        return callback(err);

                    token.unknown = unknown;
                    callback();
                });
            } else {
                callback();
            }
        }
    ], function(err) {
        if (err)
            return callback(err);

        callback(null, token);
    });
}

module.exports = processor;
