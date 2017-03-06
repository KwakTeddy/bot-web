var path = require('path');
var nlp = require(path.resolve('modules/bot/engine/nlp/processor'));
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('modules/bot/action/common/mongo.js'));


function memoryFacts(inRaw, context, callback) {
  if(context.botUser.sentenceInfo.sentenceType == 1 || context.botUser.sentenceInfo.sentenceType == 2 ||context.botUser.sentenceInfo.sentenceType == 3) {
    callback(null, context);

    return;
  }

  // var nlpKo1 = new nlp({
  //   stemmer: true,      // (optional default: true)
  //   normalizer: true,   // (optional default: true)
  //   spamfilter: false     // (optional default: false)
  // });

  // nlpKo1.tokenize(inRaw, function(err, result) {
    var node1, node2='', edge;
    var result = context.botUser.nlp;
    for (var i = result.length - 1; i >= 0; i--) {
      var token = result[i];
      if(token.text == '이다' || token.pos == 'Adjective' || token.pos == 'Verb') {
        edge = token.text;
        for (var j = 0; j < i; j++) {
          var token1 = result[j];
          if(token1.pos == 'Noun') {
            if(node1 == undefined) {
              node1 = token1.text;
              for(var k = j+1; k < i; k++) {
                var token2 = result[k];
                if(token2.pos == 'Number' || token2.pos == 'Noun') {
                  node2 += token2.text;
                }
              }
              break;
            }
          }
        }
      }
    }

    if(node1 && node2 && edge) {
      var _task = {
        doc:{
          botUser: mongoose.Types.ObjectId(context.botUser._id),
          node1: node1,
          node2: node2,
          edge: edge,
          created: Date.now
        },
        mongo: {
          model: 'fact',
          query: {node1: '', node2: '', edge: ''},
          options: {upsert: true}
        }
      };

      mongoModule.update(_task, null, function(__task, __context) {
        callback(__task, context);
      });
    } else {
      callback(null, context);
    }
  // });
}

exports.memoryFacts = memoryFacts;