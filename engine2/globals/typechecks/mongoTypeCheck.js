module.exports = function(globals)
{
    globals.setTypeChecks('mongoTypeCheck', function(text, format, inDoc, context, callback) {
        // logger.debug('');
        // try {
        //   logger.debug('type.js:mongoTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
        // } catch(e) {
        //   logger.debug('type.js:mongoTypeCheck: START ' + format.name + ' "' + text + '"');
        // }

        if(text == null) {
            callback(text, inDoc, false);
            return;
        }

        var model;
        if (mongoose.models[format.mongo.model]) {
            model = mongoose.model(format.mongo.model);
        } else {
            model = mongoose.model(format.mongo.model, new mongoose.Schema(format.mongo.schema));
        }

        var matchedWord = '';
        var matchedDoc = [];
        var words = text.split(' '), wordsCount = 0;

        async.waterfall([
            function(_cb) {
                var matchConcepts = [];
                var bot = context.bot;
                if(bot.concepts) {
                    for(var key in bot.concepts) {

                        for (var i = 0; i < words.length; i++) {
                            var word = words[i];
                            try {
                                if(word.length <= 1) continue;
                                word = RegExp.escape(word);

                                for (var j = 0; j < bot.concepts[key].length; j++) {
                                    var val = bot.concepts[key][j];

                                    if(val.search(word) != -1 && !(format.exclude && _.includes(format.exclude, word))) {
                                        if(!_.includes(matchConcepts, key)) matchConcepts.push(key);
                                        break;
                                    }
                                }

                            } catch(e) {}
                        }
                    }
                }

                if(matchConcepts.length > 0) {
                    async.eachSeries(matchConcepts, function (word, _callback) {
                        if(word.length <= 1) {
                            _callback(null);
                        } else {
                            var query = {};
                            if(format.mongo.queryStatic) query = format.mongo.queryStatic;
                            else query = {};

                            for(var j = 0; j < format.mongo.queryFields.length; j++) {
                                try {
                                    word = RegExp.escape(word);
                                    query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
                                } catch(e) {}
                            }

                            if(format.query) query = utils.merge(query, format.query);
                            var _query = model.find(query, format.mongo.fields, format.mongo.options);
                            if(format.mongo.sort) _query.sort(format.mongo.sort);
                            if(format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);

                            _query.lean().exec(function (err, docs) {
                                if (err || !docs || docs.length <= 0) {
                                    //callback(text, inDoc);
                                } else {
                                    for(var k = 0; k < docs.length; k++) {
                                        var doc = docs[k];

                                        var bExist = false;
                                        for(var l = 0; l < matchedDoc.length; l++) {
                                            if(matchedDoc[l]._id.id == doc._id.id) {
                                                bExist = true;
                                                break;
                                            }
                                        }

                                        if(!bExist) {
                                            doc.matchRate = 1;
                                            matchedDoc.push(doc);
                                        }
                                    }
                                }

                                _callback(null);
                            });
                        }
                    }, function(err) {
                        if(matchedDoc.length > 0) _cb(true);
                        else _cb(null);
                    })

                } else _cb(null);

            },

            function(_cb) {
                var _words = [];
                var excluded = [];
                for (var i = 0; i < words.length; i++) {
                    var word = words[i];
                    if(word.length <= 1) continue;
                    word = RegExp.escape(word);
                    if(!(format.exclude && _.includes(format.exclude, word)))
                        _words.push(word);
                    else
                        excluded.push(word);
                }

                if(_words.length == 0) _words.concat(excluded);

                async.eachSeries(_words, function (word, _callback){

                    if(word.length <= 1) {
                        _callback(null);
                    } else {
                        var query = {};
                        if(format.mongo.queryStatic) query = format.mongo.queryStatic;
                        else query = {};

                        for(var j = 0; j < format.mongo.queryFields.length; j++) {
                            try {
                                if(!(format.exclude && _.includes(format.exclude, word)))
                                    query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
                                else
                                    excluded.push(word);
                            } catch(e) {}
                        }

                        if(format.query) query = utils.merge(query, format.query);

                        var _query = model.find(query, format.mongo.fields, format.mongo.options);
                        if(format.mongo.sort) _query.sort(format.mongo.sort);
                        if(format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);

                        _query.lean().exec(function (err, docs) {
                            wordsCount++;

                            if (err || !docs || docs.length <= 0) {
                                //callback(text, inDoc);
                            } else {

                                for(var k = 0; k < docs.length; k++) {
                                    var doc = docs[k];

                                    var matchCount = 0;
                                    matchedWord = '';
                                    var matchIndex = -1, matchMin = -1, matchMax = -1;
                                    for(var l = 0; l < format.mongo.queryFields.length; l++) {
                                        for(var m = 0; m < _words.length; m++) {
                                            matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(_words[m], 'i'));

                                            if(matchIndex != -1) {
                                                matchCount++;
                                                matchedWord += words[m];

                                                var matchOrgIndex = text.search(new RegExp(words[m], 'i'));
                                                if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                                                if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + words[m].length> matchMax)) matchMax = matchOrgIndex + words[m].length;
                                            }
                                        }
                                    }

                                    if(!format.mongo.minMatch || matchCount >= format.mongo.minMatch) {
                                        var bExist = false;
                                        for(var l = 0; l < matchedDoc.length; l++) {
                                            if(matchedDoc[l]._id.id == doc._id.id) {
                                                bExist = true;
                                                break;
                                            }
                                        }

                                        if(!bExist) {
                                            doc.matchWord = matchedWord;
                                            doc.matchCount = matchCount;
                                            doc.matchMin = matchMin;
                                            doc.matchMax = matchMax;
                                            doc.matchRate = matchCount / words.length;
                                            matchedDoc.push(doc);
                                        }
                                    }
                                }
                            }

                            _callback(null);
                        });
                    }
                    // var word = words[i];
                }, function(err) {
                    if(matchedDoc.length > 0) _cb(true);
                    else _cb(null);
                })
            }

        ], function(err) {

            if (format.mongo.taskSort && format.mongo.taskSort instanceof Function) {
                matchedDoc.sort(format.mongo.taskSort);
            } else {
                matchedDoc.sort(function (a, b) {
                    return b.matchRate - a.matchRate;
                });
            }

            if (matchedDoc.length > 0) {

                inDoc[format.name] = [];
                for (var _l = 0; _l < matchedDoc.length; _l++) {
                    var matchDoc = matchedDoc[_l];

                    var matchText = '';
                    for (var l = 0; l < format.mongo.queryFields.length; l++) {
                        var _text = matchDoc[format.mongo.queryFields[l]]
                        if (matchText == '') matchText = matchText.concat(_text);
                        else matchText = matchText.concat(' ', _text);
                    }
                    matchDoc['matchText'] = matchText;

                    if(matchDoc.matchMin != undefined && matchDoc.matchMax != undefined) {
                        var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
                        matchDoc['matchOriginal'] = matchOriginal;
                    }

                    if (format.mongo.taskFields) {
                        var addDoc = {};
                        for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
                            addDoc[format.mongo.taskFields[l]] = matchDoc[format.mongo.taskFields[l]];
                        }
                        inDoc[format.name].push(addDoc);
                    } else {
                        inDoc[format.name].push(matchDoc);
                    }

                    if(matchDoc.matchWord && matchDoc.matchWord.replace(/ /i, '') == matchDoc[format.mongo.queryFields[0]].replace(/ /i, ''))
                        break;
                    if (inDoc[format.name].length >= (format.limit || MAX_LIST)) break;
                }

                if(inDoc[format.name].length == 1) {
                    inDoc[format.name] = inDoc[format.name][0];

                    if(inDoc[format.name]['matchOriginal']) {
                        text = text.replace(inDoc[format.name]['matchOriginal'], IN_TAG_START + format.name + IN_TAG_END);
                        inDoc[format.name+'Original'] = inDoc[format.name]['matchOriginal'];
                    }
                }

                try {
                    logger.debug('type.js:mongoTypeCheck: MATCHED ' + format.name + ' "' + text + ' isArray: ' + Array.isArray(inDoc[format.name]) /* + '" inDoc: ' + JSON.stringify(inDoc)*/);
                } catch (e) {
                    logger.debug('type.js:mongoTypeCheck: MATCHED ' + format.name + ' "' + text + ' isArray: ' + Array.isArray(inDoc[format.name]) /* + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc)*/);
                }

                callback(text, inDoc, true);
            } else {

                try {
                    logger.debug('type.js:mongoTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
                } catch (e) {
                    logger.debug('type.js:mongoTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
                }

                callback(text, inDoc, false);
            }
        });
    });
};
