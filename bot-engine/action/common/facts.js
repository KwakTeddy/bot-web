var path = require('path');
var nlp = require(path.resolve('./bot-engine/engine/nlp/processor'));
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('./bot-engine/action/common/mongo.js'));


function memoryFacts(inRaw, context, callback) {
  if(context.botUser.sentenceInfo.sentenceType == 1) {
    callback(null, context);

    return;
  }

  var node1, node2='', link;
  var result = context.botUser.nlp;
  for (var i = result.length - 1; i >= 0; i--) {
    var token = result[i];
    if(token.text == '이다' || token.pos == 'Adjective' || token.pos == 'Verb') {
      link = token.text;
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

  if(node1 && node2 && link) {
    var _task = {
      doc:{
        botUser: context.user.userKey,
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
