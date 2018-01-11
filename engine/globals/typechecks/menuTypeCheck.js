module.exports = function(globals)
{
    globals.setTypeChecks('menuTypeCheck', function(text, format, inDoc, context, callback)
    {
        logger.debug('');
        try {
            logger.debug('type.js:mongoDbTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
        } catch(e) {
            logger.debug('type.js:mongoDbTypeCheck: START ' + format.name + ' "' + text + '"');
        }

        var model;
        if (mongoose.models[format.mongo.model]) {
            model = mongoose.model(format.mongo.model);
        } else {
            model = mongoose.model(format.mongo.model, new mongoose.Schema(format.mongo.schema));
        }

        var matchedWord = '';
        var matchedDoc = {};
        var bestDoc;
        var words = text.split(' '), wordsCount = 0;
        for(var i = 0 ; i < words.length; i++) {
            var word = words[i];

            var query = {};
            for(var j = 0; j < format.mongo.queryFields.length; j++) {
                try {
                    query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
                } catch(e) {}
            }

            var _query = model.find(query, format.mongo.fields, format.mongo.options);
            if(format.mongo.sort) _query.sort(format.mongo.sort);
            if(format.mongo.limit) _query.limit(format.mongo.limit);

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
                            for(var m = 0; m < words.length; m++) {
                                matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(words[m], 'i'));

                                if(matchIndex != -1) {
                                    matchCount++;
                                    matchedWord += words[m];

                                    var matchOrgIndex = text.search(new RegExp(words[m], 'i'));
                                    if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                                    if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + words[m].length> matchMax)) matchMax = matchOrgIndex + words[m].length;
                                }
                            }
                        }

                        if(matchCount >= format.mongo.minMatch) {
                            var bExist = false;
                            for(var l = 0; l < matchedDoc.length; l++) {
                                if(matchedDoc[l]._id.id == doc._id.id) {
                                    bExist = true;
                                    break;
                                }
                            }

                            if(!bExist) {
                                doc.matchCount = matchCount;
                                doc.matchMin = matchMin;
                                doc.matchMax = matchMax;

                                if(matchedDoc[matchedWord] == undefined) matchedDoc[matchedWord] = [];
                                matchedDoc[matchedWord].push(doc);
                            }
                        }
                    }
                }

                if(wordsCount >= words.length) {

                    if (format.mongo.taskSort && format.mongo.taskSort instanceof Function) {
                        matchedDoc.sort(format.mongo.taskSort);
                    } else {
                        matchedDoc.sort(function (a, b) {
                            return b.matchCount - a.matchCount;
                        });
                    }

                    if (matchedDoc.length > 0) {

                        inDoc.typeDoc = [];
                        for (var _l = 0; _l < matchedDoc.length; _l++) {
                            var matchDoc = matchedDoc[_l];

                            var matchText = '';
                            for (var l = 0; l < format.mongo.queryFields.length; l++) {
                                var _text = matchDoc[format.mongo.queryFields[l]]
                                if (matchText == '') matchText = matchText.concat(_text);
                                else matchText = matchText.concat(' ', _text);
                            }

                            var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
                            text = text.replace(matchOriginal, IN_TAG_START + format.name + IN_TAG_END);

                            if (inDoc['_' + format.name]) {
                                if (Array.isArray(inDoc['_' + format.name])) inDoc['_' + format.name].push(matchOriginal);
                                else inDoc['_' + format.name] = [inDoc['_' + format.name], matchOriginal];
                            } else {
                                inDoc['_' + format.name] = matchOriginal;
                            }

                            if (inDoc[format.name]) {
                                if (Array.isArray(inDoc[format.name])) inDoc[format.name].push(matchText);
                                else inDoc[format.name] = [inDoc[format.name], matchText];
                            } else {
                                inDoc[format.name] = matchText;
                            }

                            if (format.mongo.taskFields) {
                                var addDoc = {};
                                for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
                                    addDoc[format.mongo.taskFields[l]] = matchDoc[format.mongo.taskFields[l]];
                                }
                                inDoc.typeDoc.push(addDoc);
                            } else {
                                inDoc.typeDoc.push(matchDoc);
                            }

                            if (inDoc.typeDoc.length >= format.limit) break;
                        }

                        try {
                            logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
                        } catch (e) {
                            logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
                        }

                        callback(text, inDoc, true);
                    } else {
                        try {
                            logger.debug('type.js:mongoDbTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
                        } catch (e) {
                            logger.debug('type.js:mongoDbTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
                        }

                        callback(text, inDoc, false);
                    }
                }
            });
        }
    });
};
