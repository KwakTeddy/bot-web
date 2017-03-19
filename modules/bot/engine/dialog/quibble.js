var path = require('path');
var globalQuibbles = require(path.resolve('custom_modules/global/global-quibbles'));

function quibble(context) {
  var randomQuibble = function(qs) {
    return qs[Math.floor(Math.random() * qs.length)];
  };

  var nlp = context.botUser.nlp;
  var sentenceInfo = context.botUser.sentenceInfo;
  if(nlp == undefined) return randomQuibble(globalQuibbles.quibbles);

  var text = undefined;
  for(var i = 0; i < nlp.length; i++) {
    if(text) break;
    var token = nlp[i];
    if(token.pos == 'Noun') {
      for(var j = 0; j < globalQuibbles.nounQuibbles.length; j++) {
        var q = globalQuibbles.nounQuibbles[j];
        if(token.text == q.condition.word) {
          text = randomQuibble(q.sentences); break;
        }
      }
    }
  }

  if(text) return text;

  for(var i = 0; i < nlp.length; i++) {
    if(text) break;
    var token = nlp[i];
    if(token.pos == 'Verb') {
      for(var j = 0; j < globalQuibbles.verbQuibbles.length; j++) {
        var q = globalQuibbles.verbQuibbles[j];
        if(q.condition.word == token.text) {
          if(q.condition.question) {
            for(var k = 0; k < nlp.length; k++) {
              if(text) break;
              var token1 = nlp[k];
              if((!q.condition.question && q.condition.question == token1.text) &&
                (!q.condition.time || q.condition.time == sentenceInfo.time) &&
                (!q.condition.sentenceType || q.condition.sentenceType == sentenceInfo.sentenceType)) { text = randomQuibble(q.sentences); break;}
            }
          } else {
            if((!q.condition.time || q.condition.time == sentenceInfo.time) &&
              (!q.condition.sentenceType || q.condition.sentenceType == sentenceInfo.sentenceType)) {text = randomQuibble(q.sentences); break;}
          }
        }
      }
    }
  }

  if(text) return text;

  for(var i = 0; i < nlp.length; i++) {
    if(text) break;
    var token = nlp[i];
    for(var j = 0; j < globalQuibbles.sentenceQuibbles.length; j++) {
      var q = globalQuibbles.sentenceQuibbles[j];
      if((!q.condition.question && q.condition.question == token.text) &&
        (!q.condition.time || q.condition.time == sentenceInfo.time) &&
        (!q.condition.sentenceType || q.condition.sentenceType == sentenceInfo.sentenceType)) { text = randomQuibble(q.sentences); break;}
    }
  }

  if(text) return text;

  return randomQuibble(globalQuibbles.quibbles);
}

exports.quibble = quibble;