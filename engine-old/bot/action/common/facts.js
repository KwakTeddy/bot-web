var path = require('path');
var nlp = require(path.resolve('engine2/bot/engine/nlp/processor'));
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('engine2/bot/action/common/mongo.js'));

function memoryFacts(inRaw, context, callback) {

  if(context.botUser.sentenceInfo.sentenceType == 1 || context.botUser.nlu.sentenceInfo != 0) {
      // 평서문이 아니라면 종료
    callback(null, context);

    return;
  }

  var node1='', node2='', link='';
  var result = context.botUser.nlp;

    // context.bot.language == "ko";

    if (context.bot.language == "en") {
        var index = -1, mode = 0; // 1: the first noun, 2: verb, 3: the second noun
        var allPronoun = 0;
        for (var i = 0; i < result.length; i++) {
            var token = result[i];
            if (isNaN(token.text) != true) continue;
            if (node1 == token.text) continue;
            if (token.text == "the" || token.text == "a" || token.text == "an") continue;
            if (token.pos == "AuxVerb") continue;

            // 초기화
            if (mode==1) {
                if (token.pos == 'Pronoun' || token.pos == 'Foreign') {
                    mode = 0;
                    node1 = ""; node2 = ""; link = "";
                    allPronoun = 0;
                }
            }

            if (mode == 0) {
                if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign') {
                    node1 = token.text;
                    mode = 1;
                    index = i;
                    if (token.pos == 'Pronoun') allPronoun = 1;
                }
            } else if (mode == 1) {
                if (token.pos == 'Adjective' || token.pos == 'Verb') {
                    link = token.text;
                    mode = 2;
                    index = i;
                }
            } else if (mode == 2) {
                if (token.pos == 'Noun' || token.pos == 'Foreign' || token.pos == 'Pronoun') {
                    node2 = token.text;
                    if (token.pos == 'Pronoun') allPronoun = 2;
                    break;
                }
            }
        }
        if (allPronoun == 2) {
            node1 = ""; node2 = ""; link = "";
        }
        console.log("--- factMemory: " + node1 + " / " + node2 + " / " + link + " / " + allPronoun);
    } else if (context.bot.language == "zh") {
        var mode=0; // 1: the first noun, 2: verb, 3: the second noun
        for (var i = 0; i < result.length - 1; i++) {
            var token = result[i];
            if (mode==0) {
                if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign' || token.pos == 'NR') {
                    node1 = token.text;
                    mode=1;
                }
            } else if (mode==1) {
                if (token.pos == 'Adjective' || token.pos == 'Verb') {
                    link = token.text;
                    mode=2;
                }
            } else if (mode==2) {
                if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign') {
                    node2 = token.text;
                    break;
                }
            }
        }
    } else {
        for (var i = result.length - 1; i >= 0; i--) {
            var token = result[i];
            if (token.text == '이다' || token.pos == 'Adjective' || token.pos == 'Verb') {
                link = token.text;
                for (var j = 0; j < i; j++) {
                    var token1 = result[j];
                    if (token1.pos == 'Noun') {
                        if (node1 == undefined) {
                            node1 = token1.text;
                            for (var k = j + 1; k < i; k++) {
                                var token2 = result[k];
                                if (token2.pos == 'Number' || token2.pos == 'Noun') {
                                    node2 += token2.text;
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

  if(node1 && node2 && link) {
    var _task = {
      doc:{
        // botUser: context.user.userKey,
        // bot_id: context.user.bot,
        botUser: context.user.userKey,
        bot_id: context.bot.id,
        node1: node1,
        node2: node2,
        link: link,
        created: new Date()
      },
      mongo: {
        model: 'FactLink',
        query: {node1: '', node2: '', link: ''},
        options: {upsert: true}
      }
    };

    mongoModule.update(_task, null, function(__task, __context) {
      callback(__task, context);
    });
  } else {
    callback(null, context);
  }
}

exports.memoryFacts = memoryFacts;
