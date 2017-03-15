
var nounQuibbles = [
  { condition: {word: '나이'},
    sentences: [
    "나이는 숫자에 불과해",
    "나이가 뭐가 중요해",
    "한국 사람들은 그렇게 나이를 물어보더라!",
    "나이는 중요한 게 아니야",
    "나이는 잘 모르겠는데..",
    "나이? 글쎄 나이는 모르겠어",
    "나이 질문한건가? 나이는 잘 모르겠는데..",
    "나이는 왜 자꾸 묻는거야~",
    "나이 얘기말고 다른 얘기하자~!",
    "나이보단 다른 얘기가 재밌을 것 같은데 ㅎㅎ"
  ]}

];

var verbQuibbles = [
  { condition: {word: '되다', time: '과거', question: '언제'},
    sentences: [
      "그게 언제였더라.. 기억이 잘 안나네..",
      "좀 오래 됐어~",
      "오래된 것 같은데..",
      "한참 됐지!",
      "글쎄 꽤 된 것 같은데!"
    ]}
];

var sentenceQuibbles = [
  { condition: {time: '과거', question: '누구'},
    sentences: [
      "누구였는지 몰라",
      "그 때 그 사람...",
      "누구?",
      "누가?",
      "누구였더라..."
    ]}
];

var quibbles = [
  "?",
  "??",
  "음...",
  "몰라...",
  "엥?",
  "응?",
  "글쎄...",
  "..",
  "...",
  "[UNKNOWN]이 뭐야?",
  "ㅋㅋ",
  "아",
  "ㅇ",
  "무슨 말인지 모르겠어",
  "다시 얘기해줘",
  "다시 말해봐",
  "말 좀 똑바로 해봐~"
];

function quibble(context) {
  var randomQuibble = function(qs) {
    return qs[Math.floor(Math.random() * qs.length)];
  };

  var nlp = context.botUser.nlp;
  var sentenceInfo = context.botUser.sentenceInfo;
  if(nlp == undefined) return randomQuibble(quibbles);

  var text = undefined;
  for(var i = 0; i < nlp.length; i++) {
    if(text) break;
    var token = nlp[i];
    if(token.pos == 'Noun') {
      for(var j = 0; j < nounQuibbles.length; j++) {
        var q = nounQuibbles[j];
        if(token.text == q.condition.word) {text = randomQuibble(q.sentences); break;}
      }
    }
  }

  if(text) return text;

  for(var i = 0; i < nlp.length; i++) {
    if(text) break;
    var token = nlp[i];
    if(token.pos == 'Verb') {
      for(var j = 0; j < verbQuibbles.length; j++) {
        var q = verbQuibbles[j];
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
    for(var j = 0; j < sentenceQuibbles.length; j++) {
      var q = sentenceQuibbles[j];
      if((!q.condition.question && q.condition.question == token.text) &&
        (!q.condition.time || q.condition.time == sentenceInfo.time) &&
        (!q.condition.sentenceType || q.condition.sentenceType == sentenceInfo.sentenceType)) { text = randomQuibble(q.sentences); break;}
    }
  }

  if(text) return text;

  return randomQuibble(quibbles);
}

exports.quibble = quibble;