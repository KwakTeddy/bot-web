module.exports = function(globals)
{
    globals.setTypeChecks('mongoDbTypeCheck', function(text, format, inDoc, context, callback)
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

        var matchedDoc = [];
        var bestDoc;
        var words = text.split(' '), wordsCount = 0;
        for(var i = 0 ; i < words.length; i++) {
            var word = words[i];

            if(word.search(REG_ESCAPE) != -1) {
                wordsCount++;
                continue;
            }

            var query = {};
            if(format.mongo.queryStatic) query = format.mongo.queryStatic;
            else query = {};

            for(var j = 0; j < format.mongo.queryFields.length; j++) {
                try {
                    query[format.mongo.queryFields[j]] = new RegExp((word), 'i');
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
                        var matchIndex = -1, matchMin = -1, matchMax = -1;
                        for(var l = 0; l < format.mongo.queryFields.length; l++) {
                            for(var m = 0; m < words.length; m++) {
                                if(words[m].search(REG_ESCAPE) != -1) continue;

                                // matchIndex = doc[format.mongo.queryFields[l]].toLowerCase().indexOf(words[m].toLowerCase());
                                matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(words[m], 'i'));

                                if(matchIndex != -1) {
                                    matchCount++;

                                    // var matchOrgIndex = text.toLowerCase().indexOf(words[m].toLowerCase());
                                    var matchOrgIndex = text.search(new RegExp(words[m], 'i'));
                                    if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                                    if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + words[m].length> matchMax)) matchMax = matchOrgIndex + words[m].length;
                                }
                            }
                        }

                        if(format.limit && format.limit == 1) {
                            if((!bestDoc || bestDoc.matchCount < matchCount) && matchCount >= format.mongo.minMatch) {
                                bestDoc = doc;
                                bestDoc.matchCount = matchCount;
                                bestDoc.matchMin = matchMin;
                                bestDoc.matchMax = matchMax;
                            }
                        } else {
                            if(!format.mongo.minMatch || matchCount >= format.mongo.minMatch) {
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
                                    matchedDoc.push(doc);
                                }
                            }
                        }
                    }
                }

                if(wordsCount >= words.length) {

                    if(format.limit && format.limit == 1) {

                    } else {
                        if(format.mongo.taskSort && format.mongo.taskSort instanceof Function) {
                            matchedDoc.sort(format.mongo.taskSort);
                        } else {
                            matchedDoc.sort(function(a, b) {
                                return b.matchCount - a.matchCount;
                            });
                        }
                    }

                    if(bestDoc) {
                        var matchText = '';
                        for (var l = 0; l < format.mongo.queryFields.length; l++) {
                            var _text = bestDoc[format.mongo.queryFields[l]]
                            if (matchText == '') matchText = matchText.concat(_text);
                            else matchText = matchText.concat(' ', _text);
                        }

                        var matchOriginal = text.substring(bestDoc.matchMin, bestDoc.matchMax);
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

                        if(format.mongo.taskFields) {
                            for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
                                inDoc[format.mongo.taskFields[l]] = bestDoc[format.mongo.taskFields[l]];
                            }
                        } else {
                            inDoc = utils.merge(inDoc, bestDoc);
                        }

                        inDoc.typeDoc = bestDoc;

                        try {
                            logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
                        } catch(e) {
                            logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
                        }

                        callback(text, inDoc, true);
                    } else if(matchedDoc.length > 0) {
                        inDoc.typeDoc = [];
                        for(var _l = 0; _l < matchedDoc.length; _l++) {
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

                            if(format.mongo.taskFields) {
                                var addDoc = {};
                                for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
                                    addDoc[format.mongo.taskFields[l]] = matchDoc[format.mongo.taskFields[l]];
                                }
                                inDoc.typeDoc.push(addDoc);
                            } else {
                                inDoc.typeDoc.push(matchDoc);
                            }

                            if(inDoc.typeDoc.length >= format.limit) break;
                        }

                        try {
                            logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
                        } catch(e) {
                            logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
                        }
                        context.dialog.faqDoc = inDoc.typeDoc;
                        callback(text, inDoc, true);
                    } else {
                        try {
                            logger.debug('type.js:mongoDbTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
                        } catch(e) {
                            logger.debug('type.js:mongoDbTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
                        }

                        callback(text, inDoc, false);
                    }
                }

            });
        }
    });
};
