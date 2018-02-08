module.exports = function(globals)
{
    // globals.setTypeChecks('factsTypeCheck', function(text, format, inDoc, context, callback)
    // {
    //     if (context.bot.language == "en")
    //     {
    //         // 영어
    //         if (!context.bot.useMemoryFacts || context.botUser.nlu.sentenceInfo != 2)
    //         {
    //             callback(text, inDoc, false);
    //             return;
    //         }
    //
    //         var node1 = undefined;
    //         for (var j = 0; j < context.botUser.nlp.length; j++)
    //         {
    //             var token1 = context.botUser.nlp[j];
    //             if (token1.text.toLowerCase() == 'what' ||
    //                 token1.text.toLowerCase() == 'who' ||
    //                 token1.text.toLowerCase() == 'why' ||
    //                 token1.text.toLowerCase() == 'how' ||
    //                 token1.text.toLowerCase() == 'when' ||
    //                 token1.text.toLowerCase() == 'where') {
    //                 continue;
    //             }
    //
    //             if (token1.pos == 'Noun' || token1.pos == 'Pronoun' || token1.pos == 'Foreign')
    //             {
    //                 node1 = token1.text;
    //                 break;
    //             }
    //         }
    //
    //         var edge = undefined;
    //         for (var j = 0; j < context.botUser.nlp.length; j++)
    //         {
    //             var token1 = context.botUser.nlp[j];
    //             if (token1.pos == 'Verb' || token1.pos == 'Adjective')
    //             {
    //                 if (j<3 && (token1.text =='do' || token1.text =='did'))
    //                 {
    //                     if (context.botUser.nlp[0].text.toLowerCase() == 'what' ||
    //                         context.botUser.nlp[0].text.toLowerCase() == 'who' ||
    //                         context.botUser.nlp[0].text.toLowerCase() == 'why' ||
    //                         context.botUser.nlp[0].text.toLowerCase() == 'how' ||
    //                         context.botUser.nlp[0].text.toLowerCase() == 'when' ||
    //                         context.botUser.nlp[0].text.toLowerCase() == 'where') {
    //                         continue;
    //                     }
    //                 }
    //
    //                 edge = token1.text.replace(/[\?\.!]/gi, "");
    //                 break;
    //             }
    //         }
    //
    //         console.log("input: " + JSON.stringify(context.botUser.nlp));
    //         console.log("input---node1: " + node1);
    //         console.log("input---edge: " + edge);
    //
    //         var edges = [{link: edge}];
    //         var query = {botUser: {$ne: null}};
    //         if (edges.length == 1)
    //         {
    //             query = edges[0];
    //         }
    //         else
    //         {
    //             query = {$or: []};
    //             for (var i = 0; i < edges.length; i++)
    //             {
    //                 query.$or.push(edges[i]);
    //             }
    //         }
    //
    //         query['botUser'] = context.user.userKey;
    //
    //         var model = mongoModule.getModel('factlink', undefined);
    //         model.find(query, null, {sort: {created: -1}}, function (err, docs)
    //         {
    //             if (docs && docs.length > 0)
    //             {
    //                 var _node1 = docs[0]._doc.node1;
    //                 var _node2 = docs[0]._doc.node2;
    //                 var _link = docs[0]._doc.link;
    //
    //                 switch (_node1.toLowerCase())
    //                 {
    //                     case 'i'  :
    //                         _node1 = 'you';
    //                         break;
    //                     case 'you' :
    //                         _node1 = 'i';
    //                         break;
    //                 }
    //
    //                 switch (_link.toLowerCase())
    //                 {
    //                     case 'am'  :
    //                         _link = 'are';
    //                         break;
    //                     case 'are' :
    //                         _link = 'am';
    //                         break;
    //                 }
    //
    //                 inDoc._output = _node1 + ' ' + _link + ' ' + _node2;
    //
    //                 toneModule.toneSentence(inDoc._output, context.botUser.tone || '해요체', function (out)
    //                 {
    //                     inDoc._output = out;
    //                     callback(text, inDoc, true);
    //                 });
    //
    //             }
    //             else
    //             {
    //                 callback(text, inDoc, false);
    //             }
    //         });
    //     }
    //     else if (context.bot.language == "zh")
    //     {
    //         // 중국어
    //         if (!context.bot.useMemoryFacts || context.botUser.nlu.sentenceInfo != 2 || context.botUser.sentenceInfo.verbToken == undefined)
    //         {
    //             callback(text, inDoc, false);
    //             return;
    //         }
    //
    //         var node1 = undefined;
    //         for (var j = 0; j < context.botUser.nlp.length; j++)
    //         {
    //             var token1 = context.botUser.nlp[j];
    //             if (((token1.text.indexOf("年") < 0) && (token1.text.indexOf("月") < 0) && (token1.text.indexOf("日") < 0)) && (token1.pos == 'Noun' || token1.pos == 'Pronoun' || token1.pos == 'Foreign'))
    //             {
    //                 node1 = token1.text;
    //                 break;
    //             }
    //         }
    //
    //         var edge = context.botUser.sentenceInfo.verbToken.text;
    //         var edges = [{link: edge}];
    //
    //         var query = {botUser: {$ne: null}};
    //         if (edges.length == 1)
    //         {
    //             query = edges[0];
    //         }
    //         else
    //         {
    //             query = {$or: []};
    //             for (var i = 0; i < edges.length; i++)
    //             {
    //                 query.$or.push(edges[i]);
    //             }
    //         }
    //
    //         query['botUser'] = context.user.userKey;
    //
    //         var model = mongoModule.getModel('factlink', undefined);
    //         model.find(query, null, {sort: {created: -1}}, function (err, docs)
    //         {
    //             if (docs && docs.length > 0)
    //             {
    //                 var _node1 = docs[0]._doc.node1;
    //                 var _node2 = docs[0]._doc.node2;
    //                 var _link = docs[0]._doc.link;
    //
    //                 if (_node1 == '我') _node1 = '你';
    //                 inDoc._output = _node1 + '' + _link + '' + _node2;
    //
    //                 toneModule.toneSentence(inDoc._output, context.botUser.tone || '해요체', function (out)
    //                 {
    //                     inDoc._output = out;
    //                     callback(text, inDoc, true);
    //                 });
    //
    //             }
    //             else
    //             {
    //                 callback(text, inDoc, false);
    //             }
    //         });
    //     }
    //     else
    //     {
    //         // 한국어
    //         if (!context.bot.useMemoryFacts || context.botUser.nlu.sentenceInfo != 2 || context.botUser.sentenceInfo.verbToken == undefined)
    //         {
    //             callback(text, inDoc, false);
    //             return;
    //         }
    //
    //         var node1 = undefined;
    //         for (var j = 0; j < context.botUser.nlp.length; j++)
    //         {
    //             var token1 = context.botUser.nlp[j];
    //             if (token1.pos == 'Noun')
    //             {
    //                 node1 = token1.text;
    //                 break;
    //             }
    //         }
    //
    //         var edge = context.botUser.sentenceInfo.verbToken.text;
    //         var edges = [{link: edge}];
    //         if (edge == '지' || edge == '야')
    //         {
    //             edges.push({link: '이다'});
    //         }
    //
    //         var query = {botUser: {$ne: null}};
    //         if (edges.length == 1)
    //         {
    //             query = edges[0];
    //         }
    //         else
    //         {
    //             query = {$or: []};
    //             for (var i = 0; i < edges.length; i++)
    //             {
    //                 query.$or.push(edges[i]);
    //             }
    //         }
    //
    //         query['botUser'] = context.user.userKey;
    //
    //         var model = mongoModule.getModel('factlink', undefined);
    //         model.find(query, null, {sort: {created: -1}}, function (err, docs)
    //         {
    //             if (docs && docs.length > 0)
    //             {
    //                 var _node1 = docs[0]._doc.node1;
    //                 var _node2 = docs[0]._doc.node2;
    //                 var _link = docs[0]._doc.link;
    //
    //                 if (_node1 == '나' || _node1 == '내')
    //                 {
    //                     _node1 = '고객님은';
    //                 }
    //
    //                 inDoc._output = _node1 + ' ' + _node2 + ' ' + _link;
    //
    //                 toneModule.toneSentence(inDoc._output, context.botUser.tone || '해요체', function (out)
    //                 {
    //                     inDoc._output = out;
    //                     callback(text, inDoc, true);
    //                 });
    //             }
    //             else
    //             {
    //                 callback(text, inDoc, false);
    //             }
    //         });
    //     }
    // });
};
