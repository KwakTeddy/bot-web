var path = require('path');
var globalQuibbles = require(path.resolve('custom_modules/global/global-quibbles'));

function quibble(context) {
  var quibbleSentence = undefined;

  quibbleSentence = quibbleProcess(context.bot, context);
  if(quibbleSentence) return quibbleSentence;

  quibbleSentence = quibbleProcess(globalQuibbles, context);

  if(quibbleSentence) return quibbleSentence;
  else return '이해할 수 없는 말입니다.';
}

function quibbleProcess(quibbleScope, context) {
  var randomQuibble = function(qs) {
    return qs[Math.floor(Math.random() * qs.length)];
  };

  var nlp = context.botUser.nlp;
  var sentenceInfo = context.botUser.sentenceInfo;
  if(nlp == undefined) return randomQuibble(quibbleScope.quibbles);

  var text = undefined;

  if(quibbleScope.nounQuibbles) {
    for(var i = 0; i < nlp.length; i++) {
      if(text) break;
      var token = nlp[i];
      if(token.pos == 'Noun') {
        for(var j = 0; j < quibbleScope.nounQuibbles.length; j++) {
          var q = quibbleScope.nounQuibbles[j];
          if(token.text == q.condition.word) {
            text = randomQuibble(q.sentences);
            console.log('quibble [명사]: ' + JSON.stringify(q, null, 2));
            break;
          }
        }
      }
    }
  }

  if(text) return text;

  if(quibbleScope.verbQuibbles) {
    for(var i = 0; i < nlp.length; i++) {
      if(text) break;
      var token = nlp[i];
      if(token.pos == 'Verb') {
        for(var j = 0; j < quibbleScope.verbQuibbles.length; j++) {
          var q = quibbleScope.verbQuibbles[j];
          if(q.condition.word == token.text) {
            if(q.condition.questionWord) {
              for(var k = 0; k < nlp.length; k++) {
                if(text) break;
                var token1 = nlp[k];
                if((!q.condition.questionWord && q.condition.questionWord == token1.text) &&
                  (!q.condition.tenseType || !sentenceInfo.tenseType || q.condition.tenseType == sentenceInfo.tenseType) &&
                  (!q.condition.sentenceType || !sentenceInfo.sentenceType || q.condition.sentenceType == sentenceInfo.sentenceType)) {
                  text = randomQuibble(q.sentences);
                  console.log('quibble [동사]: ' + JSON.stringify(q, null, 2));
                  break;
                }
              }
            } else {
              if((!q.condition.tenseType || !sentenceInfo.tenseType ||  q.condition.tenseType == sentenceInfo.tenseType) &&
                (!q.condition.sentenceType || !sentenceInfo.sentenceType || q.condition.sentenceType == sentenceInfo.sentenceType)) {
                text = randomQuibble(q.sentences);
                console.log('quibble [동사]: ' + JSON.stringify(q, null, 2));
                break;
              }
            }
          }
        }
      }
    }
  }

  if(text) return text;

  if(quibbleScope.sentenceQuibbles) {
    for(var i = 0; i < nlp.length; i++) {
      if(text) break;
      var token = nlp[i];
      for(var j = 0; j < quibbleScope.sentenceQuibbles.length; j++) {
        var q = quibbleScope.sentenceQuibbles[j];
        if((!q.condition.questionWord && q.condition.questionWord == token.text) &&
          (!q.condition.tenseType || !sentenceInfo.tenseType || q.condition.tenseType == sentenceInfo.tenseType) &&
          (!q.condition.sentenceType || !sentenceInfo.sentenceType || q.condition.sentenceType == sentenceInfo.sentenceType)) {
          text = randomQuibble(q.sentences);
          console.log('quibble [문장]: ' + JSON.stringify(q, null, 2));
          break;
        }
      }
    }
  }

  if(text) return text;

  if(quibbleScope.slangQuibbles) {
    for(var i = 0; i < nlp.length; i++) {
      if(text) break;
      var token = nlp[i];
      if(token.pos == 'Noun') {
        for(var j = 0; j < quibbleScope.slangQuibbles.length; j++) {
          var q = quibbleScope.slangQuibbles[j];
          if(token.text == q.condition.word) {
            text = randomQuibble(q.sentences);
            console.log('quibble [욕설]: ' + JSON.stringify(q, null, 2));
            break;
          }
        }
      }
    }
  }

  if(text) return text;

  console.log('quibble [최종]: ' + JSON.stringify(quibbleScope.quibbles, null, 2));

  if(quibbleScope.quibbles) {
    return randomQuibble(quibbleScope.quibbles);
  } else {
    return undefined;
  }
}

exports.quibble = quibble;
