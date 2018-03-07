module.exports = function(globals)
{
    // globals.setTypeChecks('dialogTypeCheck', function(text, format, inDoc, context, callback)
    // {
    //     // logger.debug('');
    //     // try {
    //     //   logger.debug('type.js:dialogTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
    //     // } catch(e) {
    //     //   logger.debug('type.js:dialogTypeCheck: START ' + format.name + ' "' + text + '"');
    //     // }
    //
    //     if(context.bot == undefined) callback(text, inDoc, false);
    //
    //     var t0 = new Date();
    //
    //     if(text == null) {
    //         callback(text, inDoc, false);
    //         return;
    //     }
    //     var model;
    //     if (mongoose.models[format.mongo.model]) {
    //         model = mongoose.model(format.mongo.model);
    //     } else {
    //         model = mongoose.model(format.mongo.model, new mongoose.Schema(format.mongo.schema));
    //     }
    //
    //     var matchedWord = '';
    //     var matchedDoc = [];
    //     var /*nlps = text.split(' '), */nlpsCount = 0;
    //
    //     var nlps = context.botUser.nlu.nlp;
    //
    //     // TODO 현재 중국어 자연어 처리 안되는 듯 com2best
    //     if(nlps === undefined) {
    //         nlps = [];
    //         var _s = text.split(' ');
    //         for(var i = 0; i < _s.length; i++) {
    //             nlps.push({text: _s[i], pos: 'Noun'});
    //         }
    //     }
    //     var nlpMatchLength = 0;
    //     for(var i = 0; i < nlps.length; i++) {
    //         if(nlps[i].pos == 'Noun') nlpMatchLength+=2;
    //         else nlpMatchLength += 1;
    //     }
    //
    //     var topicKeywords = [];
    //     var contexts = [];
    //     if(!context.dialog) context.dialog = {};
    //
    //     async.waterfall([
    //         function(_cb) {
    //             // 현재 발화의 대답이 중복인 경우, 중복된 발화의 category들을 저장하는 변수 (dsyoon)
    //             if (context.botUser["nlu"] == undefined || context.botUser["nlu"] == null) context.botUser["nlu"] = {};
    //             if (context.botUser.nlu["contextInfo"] == undefined || context.botUser.nlu["contextInfo"] == null) context.botUser.nlu["contextInfo"] = {};
    //
    //             // dialog를 저장한다.
    //             if (context.botUser.nlu["dialog"] == undefined || context.botUser.nlu["dialog"] == null) context.botUser.nlu["dialog"] = {};
    //             // 발화의 상태를 history로 저장한다
    //             if (context.botUser.nlu.contextInfo["contextHistory"] == undefined || context.botUser.nlu.contextInfo["contextHistory"] == null) context.botUser.nlu.contextInfo["contextHistory"] = [];
    //             if (context.botUser.nlu.contextInfo["matchContextHistory"] == undefined || context.botUser.nlu.contextInfo["matchContextHistory"] == null) context.botUser.nlu.contextInfo["matchContextHistory"] = [];
    //             // 발화에 대한 대답의 history로 저장한다 (일반, 멀티context 등..)
    //             if (context.botUser.nlu.contextInfo["answerHistory"] == undefined || context.botUser.nlu.contextInfo["answerHistory"] == null) context.botUser.nlu.contextInfo["answerHistory"] = [];
    //             // 사용자 발화를 history로 저장한다
    //             if (context.botUser.nlu.contextInfo["queryHistory"] == undefined || context.botUser.nlu.contextInfo["queryHistory"] == null) context.botUser.nlu.contextInfo["queryHistory"] = [];
    //             // 현재 발화의 상태
    //             if (context.botUser.nlu.contextInfo["context"] == undefined || context.botUser.nlu.contextInfo["context"] == null) context.botUser.nlu.contextInfo["context"] = {};
    //
    //             // 현재 발화의 매치 정보
    //             if (context.botUser.nlu["matchInfo"] == undefined || context.botUser.nlu["matchInfo"] == null) context.botUser.nlu["matchInfo"] = {};
    //             if (context.botUser.nlu.matchInfo["qa"] == undefined || context.botUser.nlu.matchInfo["qa"] == null) context.botUser.nlu.matchInfo["qa"] = [];
    //             if (context.botUser.nlu.matchInfo["contextNames"] == undefined || context.botUser.nlu.matchInfo["contextNames"] == null) context.botUser.nlu.matchInfo["contextNames"] = {};
    //             if (context.botUser.nlu.matchInfo["contexts"] == undefined || context.botUser.nlu.matchInfo["contexts"] == null) context.botUser.nlu.matchInfo["contexts"] = {};
    //             if (context.botUser.nlu.matchInfo["topScoreCount"] == undefined || context.botUser.nlu.matchInfo["topScoreCount"] == null) context.botUser.nlu.matchInfo["topScoreCount"] = 0;
    //
    //             _cb(null);
    //         },
    //         function(_cb) {
    //             var matchConcepts = [];
    //             var bot = context.bot;
    //             if(bot && bot.concepts) {
    //                 for(var key in bot.concepts) {
    //                     for (var i = 0; i < nlps.length; i++) {
    //                         var word = nlps[i].text;
    //                         try {
    //                             if(word.length <= 1) continue;
    //                             word = RegExp.escape(word);
    //
    //                             for (var j = 0; j < bot.concepts[key].length; j++) {
    //                                 var val = bot.concepts[key][j];
    //
    //                                 if(val.search(word) != -1 && !(format.exclude && _.includes(format.exclude, word))) {
    //                                     if(!_.includes(matchConcepts, key)) matchConcepts.push(key);
    //                                     break;
    //                                 }
    //                             }
    //
    //                         } catch(e) {}
    //                     }
    //                 }
    //             }
    //
    //             if(matchConcepts.length > 0) {
    //                 async.eachSeries(matchConcepts, function (word, _callback) {
    //                     if(word.length <= 1) {
    //                         _callback(null);
    //                     } else {
    //                         var query = {};
    //                         if(format.mongo.queryStatic) query = format.mongo.queryStatic;
    //                         else query = {};
    //
    //                         for(var j = 0; j < format.mongo.queryFields.length; j++) {
    //                             try {
    //                                 word = RegExp.escape(word);
    //                                 query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
    //                             } catch(e) {}
    //                         }
    //
    //                         if(format.query) query = utils.merge(query, format.query);
    //                         var _query = model.find(query, format.mongo.fields, format.mongo.options);
    //                         if(format.mongo.sort) _query.sort(format.mongo.sort);
    //                         if(format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);
    //
    //                         _query.lean().exec(function (err, docs) {
    //                             if (err || !docs || docs.length <= 0) {
    //                                 //callback(text, inDoc);
    //                             } else {
    //                                 for(var k = 0; k < docs.length; k++) {
    //                                     var doc = docs[k];
    //                                     var bExist = false;
    //                                     for(var l = 0; l < matchedDoc.length; l++) {
    //                                         if(matchedDoc[l].dialogset == doc.dialogset) {
    //                                             bExist = true;
    //                                             break;
    //                                         }
    //                                     }
    //
    //                                     if(!bExist) {
    //                                         doc.matchRate = 1;
    //                                         matchedDoc.push(doc);
    //                                     }
    //                                 }
    //                             }
    //
    //                             _callback(null);
    //                         });
    //                     }
    //                 }, function(err) {
    //                     if(matchedDoc.length > 0) _cb(true);
    //                     else _cb(null);
    //                 })
    //
    //             } else _cb(null);
    //         },
    //
    //         function(_cb) {
    //             // 명사 단어에 대한 bigram 적용
    //             var nounList = [];
    //             for (var i = 0; i < nlps.length; i++) {
    //                 var word = nlps[i].text;
    //                 if (nlps[i].pos == "Noun") {
    //                     nounList.push(RegExp.escape(word));
    //                 }
    //             }
    //             if (nounList.length > 0) {
    //                 for (var i=0; i<nounList.length; i++) {
    //                     var nounWord = nounList[i];
    //                     for (var j=1; j<nounWord.length; j++) {
    //                         var word = nounWord.substr(j-1, 2);
    //                         var query = {};
    //                         if (format.mongo.queryStatic) query = format.mongo.queryStatic;
    //                         else query = {};
    //
    //                         for (var k = 0; k < format.mongo.queryFields.length; k++) {
    //                             try {
    //                                 if (!(format.exclude && _.includes(format.exclude, word))) {
    //                                     if (word.length == 1) query[format.mongo.queryFields[k]] = word;
    //                                     else query[format.mongo.queryFields[k]] = new RegExp('(?:^|\\s)' + word + '(?:$|\\s)', 'i');
    //                                 } else
    //                                     excluded.push(word);
    //                             } catch (e) {
    //                             }
    //                         }
    //
    //                         if (format.query) query = utils.merge(query, format.query);
    //
    //                         var _query = model.find(query, format.mongo.fields, format.mongo.options);
    //
    //                         _query.populate('context');
    //                         if (format.mongo.sort) _query.sort(format.mongo.sort);
    //                         if (format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);
    //
    //                         _query.lean().exec(function (err, docs) {
    //                             nlpsCount++;
    //
    //                             if (err || !docs || docs.length <= 0) {
    //                                 if(err) {
    //                                     // logger.systemError(err.stack || err);
    //                                 }
    //                                 //callback(text, inDoc);
    //                             } else {
    //                                 for (var k = 0; k < docs.length; k++) {
    //                                     var doc = docs[k];
    //                                     doc["score"] = 0.0;
    //                                     matchedDoc.push(doc);
    //
    //                                     var parsedDoc = typeUtil.parseDialogSetDocs(doc);
    //                                     for (var pdx=0; pdx<parsedDoc.length; pdx++) {
    //                                         context.botUser.nlu.matchInfo["qa"].push(doc);
    //                                     }
    //                                 }
    //                             }
    //                         });
    //                     }
    //                 }
    //                 _cb(null);
    //             } else {
    //                 _cb(null);
    //             }
    //         },
    //         function(_cb) {
    //             // Token 단위로 Answer 체크
    //             var _nlps = [];
    //             var excluded = [];
    //
    //             for (var i = 0; i < nlps.length; i++) {
    //                 var word = nlps[i].text;
    //                 // if(word.length <= 1) continue;
    //                 word = RegExp.escape(word);
    //
    //                 if ((!context.bot.dialogsetOption || context.bot.dialogsetOption.useTopic !== false) && context.bot.topicKeywords && _.includes(context.bot.topicKeywords, word)) {
    //                     topicKeywords.push(nlps[i]);
    //                 }
    //                 if (!(format.exclude && _.includes(format.exclude, word)))
    //                     _nlps.push(nlps[i]);
    //                 else
    //                     excluded.push(nlps[i]);
    //             }
    //
    //             if ((!context.bot.dialogsetOption || context.bot.dialogsetOption.useContext !== false) && context.botUser.contexts && context.botUser.contexts.length > 0) {
    //                 topicKeywords = [];
    //                 /* context를 통한 topicKeyword 검색은 하지 않는다.
    //                 for (var j = 0; j < context.botUser.contexts.length; j++)
    //                     if (context.botUser.contexts[j].name) topicKeywords.push({
    //                         text: context.botUser.contexts[j].name,
    //                         pos: 'Noun'
    //                     });
    //                 console.log('topicKeywords: contexts ' + topicKeywords);
    //                 */
    //             } else if ((!context.bot.dialogsetOption || context.bot.dialogsetOption.useTopic !== false) && topicKeywords.length == 0 && context.botUser.topic && context.botUser.topic.length > 0) {
    //                 topicKeywords = context.botUser.topic;
    //                 console.log('topicKeywords: topic ' + topicKeywords);
    //             }
    //
    //             if (_nlps.length == 0) _nlps.concat(excluded);
    //
    //             async.eachSeries((topicKeywords.length > 0 ? topicKeywords : _nlps), function (word, _callback) {
    //                 word = word.text ? RegExp.escape(word.text) : word;
    //
    //                 if (false/*word.length <= 1*/) {
    //                     _callback(null);
    //                 } else {
    //                     var query = {};
    //                     if (format.mongo.queryStatic) query = format.mongo.queryStatic;
    //                     else query = {};
    //
    //                     for (var j = 0; j < format.mongo.queryFields.length; j++) {
    //                         try {
    //                             if (!(format.exclude && _.includes(format.exclude, word))) {
    //                                 /*
    //                                 if (word.length == 1) query[format.mongo.queryFields[j]] = word;
    //                                 else query[format.mongo.queryFields[j]] = new RegExp('(?:^|\\s)' + word + '(?:$|\\s)', 'i');
    //                                 */
    //                                 // "몇 살?" 질의에 대해서 기존 "몇"의 Question이 있는 경우 "몇 살"을 검색하지 못함
    //                                 query[format.mongo.queryFields[j]] = new RegExp('(?:^|\\s)' + word + '(?:$|\\s)', 'i');
    //                             } else
    //                                 excluded.push(word);
    //                         } catch (e) {
    //                         }
    //                     }
    //
    //                     if (format.query) query = utils.merge(query, format.query);
    //
    //                     var _query = model.find(query, format.mongo.fields, format.mongo.options);
    //
    //                     _query.populate('context');
    //                     if (format.mongo.sort) _query.sort(format.mongo.sort);
    //                     if (format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);
    //
    //                     _query.lean().exec(function (err, docs) {
    //                         nlpsCount++;
    //
    //                         if (err || !docs || docs.length <= 0) {
    //                             //callback(text, inDoc);
    //                         } else {
    //                             for (var k = 0; k < docs.length; k++) {
    //                                 var doc = docs[k];
    //
    //                                 var matchCount = 0, matchCount1 = 0, matchTotal = 0, matchNLP = [];
    //                                 matchedWord = '';
    //                                 var matchIndex = -1, matchMin = -1, matchMax = -1;
    //
    //                                 var _matchCount = [], _matchCount1 = [], _matchTotal = [];
    //                                 var _matchedWord = [];
    //                                 var _matchIndex = [], _matchMin = [], _matchMax = [], _matchOrgIndex = [];
    //                                 if (Array.isArray(doc['input'])) {
    //                                     for (var n = 0; n < doc['input'].length; n++) {
    //                                         _matchCount[n] = 0;
    //                                         _matchTotal[n] = 0;
    //                                         _matchedWord[n] = '';
    //                                         _matchIndex[n] = -1;
    //                                         _matchMin[n] = -1;
    //                                         _matchMax[n] = -1;
    //                                     }
    //                                 }
    //
    //                                 for (var l = 0; l < format.mongo.queryFields.length; l++) {
    //                                     var bMatchTotal = false;
    //                                     for (var m = 0; m < _nlps.length; m++) {
    //                                         if (_nlps[m].pos == 'Josa' || _nlps[m].pos == 'Suffix') continue;
    //
    //                                         var _word = _nlps[m].text;
    //                                         _word = RegExp.escape(_word);
    //
    //                                         if (Array.isArray(doc[format.mongo.queryFields[l]])) {
    //
    //                                             for (var n = 0; n < doc[format.mongo.queryFields[l]].length; n++) {
    //                                                 _matchIndex[n] = doc[format.mongo.queryFields[l]][n].search(new RegExp('(?:^|\\s)' + _word + '(?:$|\\s)', 'i'));
    //
    //                                                 if (_matchIndex[n] != -1) {
    //                                                     if (context.bot.topicKeywords && _.includes(context.bot.topicKeywords, _nlps[m].text)) {
    //                                                         _matchCount[n]++;
    //                                                         _matchCount1[n] += 3;
    //                                                     }
    //                                                     else if (_nlps[m].pos == 'Noun') {
    //                                                         _matchCount[n] += 2;
    //                                                         _matchCount1[n] += 2;
    //                                                     }
    //                                                     else {
    //                                                         _matchCount[n]++;
    //                                                         _matchCount1[n]++;
    //                                                     }
    //
    //                                                     if (!bMatchTotal) {
    //                                                         _matchTotal[n] += doc[format.mongo.queryFields[l]][n].split(' ').length;
    //                                                         bMatchTotal = true
    //                                                     }
    //                                                     ;
    //                                                     _matchedWord[n] += nlps[m];
    //
    //                                                     var __word = nlps[m].text;
    //                                                     __word = RegExp.escape(__word);
    //
    //                                                     _matchOrgIndex[n] = text.search(new RegExp(__word, 'i'));
    //                                                     if (_matchOrgIndex[n] != -1 && (_matchMin[n] == -1 || _matchOrgIndex[n] < _matchMin[n])) _matchMin[n] = _matchOrgIndex[n];
    //                                                     if (_matchOrgIndex[n] != -1 && (_matchMax[n] == -1 || _matchOrgIndex[n] + nlps[m].length > _matchMax[n])) _matchMax[n] = _matchOrgIndex[n] + nlps[m].length;
    //                                                 }
    //                                             }
    //
    //                                             var maxMatchIndex = 0, maxMatchedCount = 0;
    //                                             for (var n = 0; n < doc[format.mongo.queryFields[l]].length; n++) {
    //                                                 if (_matchCount[n] > maxMatchedCount) {
    //                                                     maxMatchIndex = n;
    //                                                     maxMatchedCount = _matchCount[n];
    //                                                 }
    //                                             }
    //
    //                                             matchCount = _matchCount[maxMatchIndex];
    //                                             matchCount1 = _matchCount1[maxMatchIndex];
    //                                             matchTotal = _matchTotal[maxMatchIndex];
    //                                             matchedWord = _matchedWord[maxMatchIndex];
    //                                             matchIndex = _matchIndex[maxMatchIndex];
    //                                             matchMin = _matchMin[maxMatchIndex];
    //                                             matchMax = _matchMax[maxMatchIndex];
    //
    //                                         } else {
    //                                             matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(_word, 'i'));
    //
    //                                             if (matchIndex != -1) {
    //                                                 if ((!context.bot.dialogsetOption || context.bot.dialogsetOption.useTopic !== false) && context.bot.topicKeywords && _.includes(context.bot.topicKeywords, _nlps[m].text)) {
    //                                                     matchCount++;
    //                                                     matchCount1 += 3;
    //                                                 }
    //                                                 else if (_nlps[m].pos == 'Noun') {
    //                                                     matchCount += 2;
    //                                                     matchCount1 += 2;
    //                                                 }
    //                                                 else {
    //                                                     matchCount++;
    //                                                     matchCount1++;
    //                                                 }
    //
    //                                                 if (!bMatchTotal) {
    //                                                     matchTotal += doc[format.mongo.queryFields[l]].split(' ').length;
    //                                                     bMatchTotal = true;
    //                                                 }
    //                                                 matchedWord += nlps[m];
    //                                                 matchNLP.push({text: _nlps[m].text, pos: _nlps[m].pos});
    //
    //                                                 var __word = nlps[m].text;
    //                                                 __word = RegExp.escape(__word);
    //
    //                                                 var matchOrgIndex = text.search(new RegExp(__word, 'i'));
    //                                                 if (matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
    //                                                 if (matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + nlps[m].length > matchMax)) matchMax = matchOrgIndex + nlps[m].length;
    //                                             }
    //                                         }
    //                                     }
    //                                 }
    //
    //                                 // context match
    //                                 // if(doc.context) {
    //                                 //   matchIndex = doc.context.name.search(new RegExp(_word, 'i'));
    //                                 //
    //                                 //   if(matchIndex != -1) {
    //                                 //     matchCount++; matchCount1+=3;
    //                                 //   }
    //                                 // }
    //
    //                                 if (!format.mongo.minMatch || matchCount >= format.mongo.minMatch) {
    //                                     var bExist = false;
    //                                     for (var l = 0; l < matchedDoc.length; l++) {
    //                                         if ((Array.isArray(doc.input) && doc.input[maxMatchIndex] == matchedDoc[l].input) ||
    //                                             (doc.input == matchedDoc[l].input)) {
    //                                             bExist = true;
    //                                             break;
    //                                         }
    //                                     }
    //
    //                                     // intent 매치의 경우 위에서 bExist가 모두 true로 나와서 아래 if문이 실행 안됨. 따라서 matchRate가 계산이 안되는 문제가 있었음.
    //                                     //일단 임시로 intent매치의 경우 bExist를 false로 해서 matchRate를 계산한다
    //                                     if(format.mongo.model == 'intentcontent')
    //                                         bExist = false;
    //
    //                                     if (!bExist &&
    //                                         ((nlps.length <= 2 && (matchCount == matchTotal ||
    //                                                                (matchCount / nlpMatchLength >= format.matchRate || matchCount1 >= format.matchCount))) ||
    //                                          (nlps.length > 2 && (matchCount / nlpMatchLength >= format.matchRate ||
    //                                                               matchCount1 >= format.matchCount)))) {
    //                                         //if (Array.isArray(doc.input)) doc.input = doc.input[maxMatchIndex];
    //                                         if (Array.isArray(doc.input)) {
    //                                             doc.inputLen = doc.input[maxMatchIndex].split(' ').length;
    //                                         } else {
    //                                             doc.inputLen = doc.input.split(' ').length;
    //                                         }
    //                                         doc.matchWord = matchedWord;
    //                                         doc.matchCount = matchCount1;
    //                                         doc.matchNLP = matchNLP;
    //                                         doc.matchMin = matchMin;
    //                                         doc.matchMax = matchMax;
    //                                         doc.matchRate = matchCount / nlpMatchLength;
    //                                         // doc.matchRate = matchCount / matchTotal;
    //
    //                                         var doc = docs[k];
    //                                         doc["score"] = 0.0;
    //                                         matchedDoc.push(doc);
    //
    //                                         if (context.botUser.nlu["contextInfo"] == undefined || context.botUser.nlu["contextInfo"] == null) context.botUser.nlu["contextInfo"] = {};
    //                                         if (context.botUser.nlu.contextInfo["context"] == undefined || context.botUser.nlu.contextInfo["context"] == null) context.botUser.nlu.contextInfo["context"] = {};
    //                                     }
    //
    //                                     // 멀티 Answer에 대해서 Context 확인을 위해서 모든 answer 저장 (dsyoon)
    //                                     var parsedDoc = typeUtil.parseDialogSetDocs(doc);
    //                                     for (var pdx=0; pdx<parsedDoc.length; pdx++) {
    //                                         context.botUser.nlu.matchInfo["qa"].push(parsedDoc[pdx]);
    //                                     }
    //
    //                                     if (((nlps.length <= 2 && (matchCount == matchTotal ||
    //                                                                (matchCount / nlpMatchLength >= format.matchRate || matchCount1 >= format.matchCount))) ||
    //                                          (nlps.length > 2 && (matchCount / nlpMatchLength >= format.matchRate ||
    //                                                               matchCount1 >= format.matchCount)))) {
    //                                         if (context.botUser.nlu["contextInfo"] == undefined || context.botUser.nlu["contextInfo"] == null) context.botUser.nlu["contextInfo"] = {};
    //                                         if (doc.context) {
    //                                             context.botUser.nlu.matchInfo.contextNames[doc.context.name] = doc.context;
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                         }
    //
    //                         _callback(null);
    //                     });
    //                 }
    //                 // var word = nlps[i];
    //             }, function (err) {
    //                 if (matchedDoc.length > 0) _cb(true);
    //                 else _cb(null);
    //             })
    //         },
    //
    //         // function(_cb) {
    //         //   if(context.bot.dialogsetContexts == undefined) {
    //         //     _cb(null);
    //         //   } else {
    //         //     var CustomContext = mongoModule.getModel('customcontext');
    //         //
    //         //     async.eachSeries(nlps, function (word, _callback) {
    //         //       CustomContext.find({name: new RegExp(word, 'i')}).lean().exec(function(err, docs) {
    //         //
    //         //       })
    //         //     }, function(err) {
    //         //
    //         //     });
    //         //
    //         //     async.eachSeries(nlps, function (word, _callback){
    //         //       word = word.text ? RegExp.escape(word.text): word;
    //         //
    //         //       if(false/*word.length <= 1*/) {
    //         //         _callback(null);
    //         //       } else {
    //         //         var query = {};
    //         //         if(format.mongo.queryStatic) query = format.mongo.queryStatic;
    //         //         else query = {};
    //         //
    //         //         for(var j = 0; j < format.mongo.queryFields.length; j++) {
    //         //           try {
    //         //             if(!(format.exclude && _.includes(format.exclude, word)))
    //         //               query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
    //         //             else
    //         //               excluded.push(word);
    //         //           } catch(e) {}
    //         //         }
    //         //
    //         //         if(format.query) query = utils.merge(query, format.query);
    //         //
    //         //         var _query = model.find(query, format.mongo.fields, format.mongo.options);
    //         //         if(format.mongo.sort) _query.sort(format.mongo.sort);
    //         //         if(format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);
    //         //
    //         //         _query.lean().exec(function (err, docs) {
    //         //           nlpsCount++;
    //         //
    //         //           if (err || !docs || docs.length <= 0) {
    //         //             //callback(text, inDoc);
    //         //           } else {
    //         //
    //         //             for(var k = 0; k < docs.length; k++) {
    //         //               var doc = docs[k];
    //         //
    //         //               var matchCount = 0, matchCount1 = 0, matchTotal = 0, matchNLP = [];
    //         //               matchedWord = '';
    //         //               var matchIndex = -1, matchMin = -1, matchMax = -1;
    //         //
    //         //               var _matchCount = [], _matchCount1 = [], _matchTotal = [];
    //         //               var _matchedWord = [];
    //         //               var _matchIndex = [], _matchMin = [], _matchMax = [], _matchOrgIndex = [];
    //         //               if(Array.isArray(doc['input'])) {
    //         //                 for (var n = 0; n < doc['input'].length; n++) {
    //         //                   _matchCount[n] = 0; _matchTotal[n] = 0; _matchedWord[n] = '';
    //         //                   _matchIndex[n] = -1; _matchMin[n] = -1; _matchMax[n] = -1;
    //         //                 }
    //         //               }
    //         //
    //         //               for(var l = 0; l < format.mongo.queryFields.length; l++) {
    //         //                 var bMatchTotal = false;
    //         //                 for(var m = 0; m < _nlps.length; m++) {
    //         //                   if(_nlps[m].pos == 'Josa') continue;
    //         //
    //         //                   var _word = _nlps[m].text;
    //         //                   _word = RegExp.escape(_word);
    //         //
    //         //                   if(Array.isArray(doc[format.mongo.queryFields[l]])) {
    //         //
    //         //                     for(var n = 0; n < doc[format.mongo.queryFields[l]].length; n++) {
    //         //                       _matchIndex[n] = doc[format.mongo.queryFields[l]][n].search(new RegExp(_word, 'i'));
    //         //
    //         //                       if(_matchIndex[n] != -1) {
    //         //                         if(context.bot.topicKeywords && _.includes(context.bot.topicKeywords, _nlps[m].text)) {_matchCount[n]++; _matchCount1[n] +=3;}
    //         //                         else if(_nlps[m].pos == 'Noun') {_matchCount[n]++;_matchCount1[n]+=2;}
    //         //                         else {_matchCount[n]++;_matchCount1[n]++;}
    //         //
    //         //                         // console.log(word + ' ' + _word + ' ' + doc[format.mongo.queryFields[l]][n] + ' ' +_matchCount[n]);
    //         //                         if(!bMatchTotal) {_matchTotal[n] += doc[format.mongo.queryFields[l]][n].split(' ').length; bMatchTotal = true};
    //         //                         _matchedWord[n] += nlps[m];
    //         //
    //         //                         var __word = nlps[m].text;
    //         //                         __word = RegExp.escape(__word);
    //         //
    //         //                         _matchOrgIndex[n] = text.search(new RegExp(__word, 'i'));
    //         //                         if(_matchOrgIndex[n] != -1 && (_matchMin[n] == -1 || _matchOrgIndex[n] < _matchMin[n])) _matchMin[n] = _matchOrgIndex[n];
    //         //                         if(_matchOrgIndex[n] != -1 && (_matchMax[n] == -1 || _matchOrgIndex[n] + nlps[m].length> _matchMax[n])) _matchMax[n] = _matchOrgIndex[n] + nlps[m].length;
    //         //                       }
    //         //                     }
    //         //
    //         //                     var maxMatchIndex = 0, maxMatchedCount = 0;
    //         //                     for(var n = 0; n < doc[format.mongo.queryFields[l]].length; n++) {
    //         //                       if(_matchCount[n] > maxMatchedCount) {
    //         //                         maxMatchIndex = n;
    //         //                         maxMatchedCount = _matchCount[n];
    //         //                       }
    //         //                     }
    //         //
    //         //                     matchCount = _matchCount[maxMatchIndex];
    //         //                     matchCount1 = _matchCount1[maxMatchIndex];
    //         //                     matchTotal= _matchTotal[maxMatchIndex];
    //         //                     matchedWord = _matchedWord[maxMatchIndex];
    //         //                     matchIndex = _matchIndex[maxMatchIndex];
    //         //                     matchMin = _matchMin[maxMatchIndex];
    //         //                     matchMax = _matchMax[maxMatchIndex];
    //         //
    //         //                   } else {
    //         //                     matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(_word, 'i'));
    //         //
    //         //                     if(matchIndex != -1) {
    //         //                       if(context.bot.topicKeywords && _.includes(context.bot.topicKeywords, _nlps[m].text)) {matchCount++; matchCount1 +=3;}
    //         //                       else if(_nlps[m].pos == 'Noun') {matchCount++; matchCount1+=2;}
    //         //                       else {matchCount++; matchCount1++;}
    //         //                       // console.log(word + ' ' + _word + ' ' + doc[format.mongo.queryFields[l]] + ' ' +matchCount);
    //         //
    //         //                       if(!bMatchTotal) {matchTotal += doc[format.mongo.queryFields[l]].split(' ').length;bMatchTotal = true;}
    //         //                       matchedWord += nlps[m];
    //         //                       matchNLP.push({text: _nlps[m].text, pos: _nlps[m].pos});
    //         //
    //         //                       // console.log(l + ',' + doc[format.mongo.queryFields[l]] + ', ' + matchCount + ',' + matchTotal);
    //         //
    //         //                       var __word = nlps[m].text;
    //         //                       __word = RegExp.escape(__word);
    //         //
    //         //                       var matchOrgIndex = text.search(new RegExp(__word, 'i'));
    //         //                       if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
    //         //                       if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + nlps[m].length> matchMax)) matchMax = matchOrgIndex + nlps[m].length;
    //         //                     }
    //         //                   }
    //         //                 }
    //         //               }
    //         //
    //         //               if(!format.mongo.minMatch || matchCount >= format.mongo.minMatch) {
    //         //                 var bExist = false;
    //         //                 for(var l = 0; l < matchedDoc.length; l++) {
    //         //                   if((Array.isArray(doc.input) && doc.input[maxMatchIndex] == matchedDoc[l].input) ||
    //         //                     (doc.input == matchedDoc[l].input)) {
    //         //                     bExist = true;
    //         //                     break;
    //         //                   }
    //         //                 }
    //         //
    //         //                 if(!bExist &&
    //         //                   ((nlps.length <= 2 && (matchCount == matchTotal ||
    //         //                   (matchCount / nlpMatchLength >= format.matchRate || matchCount1 >= format.matchCount))) ||
    //         //                   (nlps.length > 2 && (matchCount / nlpMatchLength >= format.matchRate ||
    //         //                   matchCount1 >= format.matchCount)))) {
    //         //                   if(Array.isArray(doc.input)) doc.input = doc.input[maxMatchIndex];
    //         //                   doc.inputLen = doc.input.split(' ').length;
    //         //                   doc.matchWord = matchedWord;
    //         //                   doc.matchCount = matchCount1;
    //         //                   doc.matchNLP = matchNLP;
    //         //                   doc.matchMin = matchMin;
    //         //                   doc.matchMax = matchMax;
    //         //                   doc.matchRate = matchCount / nlpMatchLength;
    //         //                   // doc.matchRate = matchCount / matchTotal;
    //         //
    //         //                   matchedDoc.push(doc);
    //         //                 }
    //         //               }
    //         //             }
    //         //           }
    //         //
    //         //           _callback(null);
    //         //         });
    //         //       }
    //         //       // var word = nlps[i];
    //         //     }, function(err) {
    //         //       if(matchedDoc.length > 0) _cb(true);
    //         //       else _cb(null);
    //         //     })
    //         //   }
    //         // }
    //
    //     ], function(err) {
    //
    //         if (format.mongo.taskSort && format.mongo.taskSort instanceof Function) {
    //             matchedDoc.sort(format.mongo.taskSort);
    //         } else {
    //             var inNLP = context.botUser.nlu.inNLP;
    //             for(var i = 0; i < matchedDoc.length /*&& i < 5*/; i++) {
    //                 if (inNLP == matchedDoc[i].input) {
    //                     matchedDoc[i].matchRate = 1.0;
    //                 }
    //             }
    //             matchedDoc = matchedDoc.sort(function(doc1, doc2) {
    //                 return doc2.matchRate - doc1.matchRate;
    //             });
    //             matchedDoc.sort(function (a, b) {
    //                 if(b.matchCount == a.matchCount) {
    //                     if(b.matchRate == a.matchRate) {
    //                         if(a.id && b.id) return a.id - b.id;
    //                         else return a.inputLen - b.inputLen;
    //                     }
    //                     else return b.matchRate - a.matchRate;
    //                 } else {
    //                     if(!b.matchCount) b.matchCount = 0;
    //                     if(!a.matchCount) a.matchCount = 0;
    //
    //                     return b.matchCount - a.matchCount;
    //                 }
    //             });
    //         }
    //
    //         if (matchedDoc.length > 0) {
    //             inDoc[format.name] = [];
    //             for (var _l = 0; _l < matchedDoc.length; _l++) {
    //                 var matchDoc = matchedDoc[_l];
    //
    //                 var matchText = '';
    //                 for (var l = 0; l < format.mongo.queryFields.length; l++) {
    //                     var _text = matchDoc[format.mongo.queryFields[l]]
    //                     if (matchText == '') matchText = matchText.concat(_text);
    //                     else matchText = matchText.concat(' ', _text);
    //                 }
    //                 matchDoc['matchText'] = matchText;
    //
    //                 if(matchDoc.matchMin != undefined && matchDoc.matchMax != undefined) {
    //                     var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
    //                     matchDoc['matchOriginal'] = matchOriginal;
    //                 }
    //
    //                 if (format.mongo.taskFields) {
    //                     var addDoc = {};
    //                     for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
    //                         addDoc[format.mongo.taskFields[l]] = matchDoc[format.mongo.taskFields[l]];
    //                     }
    //                     addDoc._id = matchDoc._id; // addDialog시 qna의 경우 dialogsetdialog의 _id가 필요해서 넣음
    //                     inDoc[format.name].push(addDoc);
    //                 } else {
    //                     inDoc[format.name].push(matchDoc);
    //                 }
    //
    //                 // if(matchDoc.matchWord && matchDoc.matchWord.replace(/ /i, '') == matchDoc[format.mongo.queryFields[0]].replace(/ /i, ''))
    //                 //   break;
    //                 if (inDoc[format.name].length >= (format.limit || MAX_LIST)) break;
    //             }
    //
    //             if(inDoc[format.name][0].context) {
    //                 var _dialog = inDoc[format.name][0];
    //                 context.botUser.contexts = [];
    //                 var parentContext = function(_context) {
    //                     var __context;
    //                     if(context.bot.dialogsetContexts[_dialog.dialogset] && context.bot.dialogsetContexts[_dialog.dialogset][_context._id]) {
    //                         __context = context.bot.dialogsetContexts[_dialog.dialogset][_context._id];
    //                         context.botUser.contexts.unshift(__context);
    //                     }
    //
    //                     if(__context && __context.parent) {
    //                         parentContext(__context.parent);
    //                     }
    //                 };
    //
    //                 parentContext(inDoc[format.name][0].context);
    //             }
    //
    //             if(inDoc[format.name].length == 1) {
    //                 inDoc[format.name] = inDoc[format.name][0];
    //
    //                 if(inDoc[format.name]['matchOriginal']) {
    //                     text = text.replace(inDoc[format.name]['matchOriginal'], IN_TAG_START + format.name + IN_TAG_END);
    //                     inDoc[format.name+'Original'] = inDoc[format.name]['matchOriginal'];
    //                 }
    //             }
    //
    //             var t1 = new Date();
    //             try {
    //                 logger.debug('type.js:dialogCheck: MATCHED ' + (t1 - t0) + ' ms ' + format.name + ' "' + text + ' isArray: ' + Array.isArray(inDoc[format.name]) /* + '" inDoc: ' + JSON.stringify(inDoc)*/);
    //             } catch (e) {
    //                 logger.debug('type.js:dialogCheck: MATCHED ' + (t1 - t0) + ' ms ' + format.name + ' "' + text + ' isArray: ' + Array.isArray(inDoc[format.name]) /* + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc)*/);
    //             }
    //
    //             if(topicKeywords && topicKeywords.length > 0) context.botUser.topic = topicKeywords;
    //             // console.log('topic1: '+ (context.botUser.topic ? context.botUser.topic[0].text : 'null')+ ',' + context.botUser.analytics + ',' + context.botUser.analytics2);
    //
    //             for(var i = 0; i < matchedDoc.length /*&& i < 5*/; i++) {
    //                 var _doc = matchedDoc[i];
    //                 console.log('type.js:dialogCheck: ' + /*(_doc.context ? _doc.context.name + ':': '') +*/ _doc.matchText + ': ' + _doc.matchCount + ', ' + _doc.matchRate + ', ' + JSON.stringify(_doc.matchNLP));
    //             }
    //
    //             callback(text, inDoc, true);
    //         } else {
    //
    //             var t1 = new Date();
    //             try {
    //                 logger.debug('type.js:dialogCheck: NOT MATCHED ' + (t1 - t0) + ' ms ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
    //             } catch (e) {
    //                 logger.debug('type.js:dialogCheck: NOT MATCHED ' + (t1 - t0) + ' ms ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
    //             }
    //
    //             if(((context.botUser.topic && context.botUser.topic.length > 0) ||
    //                 (context.botUser.contexts && context.botUser.contexts.length > 0))&&
    //                (context.botUser.analytics == null || context.botUser.analytics2 == null)) {
    //                 if(context.botUser.analytics == null) {
    //                     context.botUser.topic = null;
    //                     context.botUser.contexts = null;
    //                 }
    //                 // else context.botUser.analytics = null;
    //                 else context.botUser.analytics2 = true;
    //
    //                 // console.log('topic20: '+ (context.botUser.topic ? context.botUser.topic[0].text : 'null') + ',' + context.botUser.analytics + ',' + context.botUser.analytics2);
    //
    //                 dialogTypeCheck(text, format, inDoc, context, callback);
    //             } else {
    //                 if(topicKeywords && topicKeywords.length > 0) context.botUser.topic = topicKeywords;
    //
    //                 // console.log('topic21: '+ (context.botUser.topic ? context.botUser.topic[0].text : 'null') + ',' + context.botUser.analytics + ',' + context.botUser.analytics2);
    //                 callback(text, inDoc, false);
    //             }
    //         }
    //     });
    // });
};
