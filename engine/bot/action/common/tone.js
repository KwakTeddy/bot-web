var path = require('path');
var nlp = require(path.resolve('engine/bot/engine/nlp/processor'));

function toneSentence(text, toneType, callback) {
  var nlpKo1 = new nlp({
    stemmer: true,      // (optional default: true)
    normalizer: true,   // (optional default: true)
    spamfilter: false     // (optional default: false)
  });

  var _in = '';
  var _nlpRaw = [];
  var _nlp = [];
  nlpKo1.tokenize(text, function(err, result) {
    for(var i in result) {
      if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlpRaw.push(result[i]);
      /*if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')*/ _nlp.push(result[i].text);
    }

    _in = _nlp.join(' ');
    // console.log(JSON.stringify(result));

    var info = analyzeSentence(text, null, result);
    var _text = makeTone(text, null, result, info, toneType);
    callback(_text);
  });
}

exports.toneSentence = toneSentence;

function multiNLP(inRaw, callback) {
  console.log(inRaw);

  var nlpKo1 = new nlp({
    stemmer: false,      // (optional default: true)
    normalizer: true,   // (optional default: true)
    spamfilter: false     // (optional default: false)
  });

  var _in = '';
  var _nlpRaw = [];
  var _nlp = [];
  nlpKo1.tokenize(inRaw, function(err, result) {
    for(var i in result) {
      if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlpRaw.push(result[i]);
      /*if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')*/ _nlp.push(result[i].text);
    }

    _in = _nlp.join(' ');

    // console.log(_in);
    // console.log(JSON.stringify(result));

    var nlpKo = new nlp({
      stemmer: true,      // (optional default: true)
      normalizer: true,   // (optional default: true)
      spamfilter: false     // (optional default: false)
    });

    _in = '';
    _nlpRaw = [];
    _nlp = [];
    nlpKo.tokenize(inRaw, function(err, result1) {
      for (var i in result1) {
        if (result1[i].pos !== 'Josa' && result1[i].pos !== 'Punctuation') _nlpRaw.push(result1[i]);
        /*if (result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')*/ _nlp.push(result1[i].text);
      }

      _in = _nlp.join(' ');

      console.log(_in);
      // console.log(JSON.stringify(result1));

      callback(result, result1);
    });
  });
}

exports.multiNLP = multiNLP;


function analyzeSentence(text, result1, result2) {
  var sentenceType = -1;            // 0. 평서문 1. 의문문 2. 명령 3. 청유 4. 감탄
  var toneType = undefined;         // 합쇼체 하오체 하게체 해라체 해요체 해체
  var verbType = undefined;         // 0. 2형식 1. 3형식
  var tense = undefined;            // 시제
  var aspect = undefined;           // 완료형
  var verbPos = undefined;          // 동사 위치
  var verbEomi = undefined;         // 동사 어미
  var verbToken = undefined;        // 어미 변환이 필요한 동사 token


  for (var i = result2.length - 1; i >= 0; i--) {
    if(sentenceType != -1 && verbToken != undefined) break;

    var token = result2[i];
    var textToken = '';

    if(token.pos == 'Verb' || token.pos == 'Adjective' || token.pos == 'Josa') {
      var textToken = text.substring(token.offset);
      var _offset = textToken.search(/[\s0-9!"#$%&'()*+,./:;<=>?@\^_`{|}~-]/);
      if(_offset != -1) textToken = textToken.substring(0, _offset);
    }

    if (token.pos == 'Punctuation' && token.text == '?') {
      sentenceType = 1;
    } else if(token.text == '누구' || token.text == '언제' || token.text == '어디서' ||
      token.text == '어떻게' ||token.text == '왜' ||token.text == '얼마나') {
      sentenceType = 1;
    }

    if(verbToken == undefined) {
      if(textToken.endsWith('야') || textToken.endsWith('어') || textToken.endsWith('지') || textToken.endsWith('니') || textToken.endsWith('나')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 0;
        toneType = '해체';
      } else if(textToken.endsWith('해') || textToken.endsWith('하지')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 2;
        toneType = '해체';
        // } else if(textToken.endsWith('해') || textToken.endsWith('하지')) {
        //   verbToken = token;
        //   sentenceType = 3;
        //   toneType = '해체';

      } else if(textToken.endsWith('나요') || textToken.endsWith('해요') || textToken.endsWith('예요') || textToken.endsWith('에요')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 0;
        toneType = '해요체';
      } else if(textToken.endsWith('세요') || textToken.endsWith('셔요') ||textToken.endsWith('해요') ||
        textToken.endsWith('주세요')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 2;
        toneType = '해요체';
        // } else if(textToken.endsWith('하세요') ||textToken.endsWith('하셔요') ||textToken.endsWith('해요')) {
        //   verbToken = token;
        //   sentenceType = 3;
        //   toneType = '해요체';

      } else if(textToken.endsWith('십니다') || textToken.endsWith('니다') || textToken.endsWith('니다') ||
        textToken.endsWith('니다') || textToken.endsWith('소서') ||
        textToken.endsWith('나이다') || textToken.endsWith('올시다')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 0;
        toneType = '합쇼체';

      } else if(textToken.endsWith('니까')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 1;
        toneType = '합쇼체';
      } else if(textToken.endsWith('십시오')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 2;
        toneType = '합쇼체';
      } else if(textToken.endsWith('십시다') || textToken.endsWith('시지요')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 3;
        toneType = '합쇼체';
        // } else if(textToken.endsWith('하시오') || textToken.endsWith('하오') || textToken.endsWith('이오') ||
        //   // textToken.endsWith('소') || textToken.endsWith('오') ||
        //   textToken.endsWith('리다') || textToken.endsWith('디다')) {
        //   verbToken = token;
        //   sentenceType = 0;
        //   toneType = '하오체';
        // } else if(textToken.endsWith('하시오') || textToken.endsWith('하오') || textToken.endsWith('이오')
        //   // textToken.endsWith('소') || textToken.endsWith('오')
        //   ) {
        //   verbToken = token;
        //   sentenceType = 1;
        //   toneType = '하오체';
      } else if(textToken.endsWith('시오') || textToken.endsWith('하오') || textToken.endsWith('하구려')
      // textToken.endsWith('시오')
      ) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 2;
        toneType = '하오체';
      } else if(textToken.endsWith('시다')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 3;
        toneType = '하오체';
      } else if(textToken.endsWith('하네') || textToken.endsWith('이네')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 0;
        toneType = '하게체';
      } else if(textToken.endsWith('하는가') || textToken.endsWith('하나') || textToken.endsWith('이나')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 1;
        toneType = '하게체';
      } else if(textToken.endsWith('하게') || textToken.endsWith('하구려')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 2;
        toneType = '하게체';
      } else if(textToken.endsWith('하세')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 3;
        toneType = '하게체';
      } else if(textToken.endsWith('하다') || textToken.endsWith('한다') || textToken.endsWith('이다')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 0;
        toneType = '해라체';
      } else if(textToken.endsWith('하느냐') || textToken.endsWith('하냐') || textToken.endsWith('하니') ||
        textToken.endsWith('이냐') || textToken.endsWith('이니')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 1;
        toneType = '해라체';
      } else if(textToken.endsWith('해라') || textToken.endsWith('하려무나') || textToken.endsWith('하렴')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 2;
        toneType = '해라체';
      } else if(textToken.endsWith('하자')) {
        verbToken = token;
        if(sentenceType == undefined) sentenceType = 3;
        toneType = '해라체';
      } else if(token.pos == 'Verb' || token.pos == 'Adjective' ||
        token.text == '하다' || token.text == '이다' || token.text == '있다' ||
        token.text == '해주다' || token.text == '줄다') {
        verbToken = token;
      }
    }
  }


  if(verbToken) {
    var _text = text.substring(verbToken.offset);
    var _offset = _text.search(/[\s0-9!"#$%&'()*+,./:;<=>?@\^_`{|}~-]/);
    if(_offset != -1) _text = _text.substring(0, _offset);

    var _pos = -1;
    for(var j = 0; j < Math.min(verbToken.text.length, _text.length); j++) {
      if(verbToken.text.charAt(j) != _text.charAt(j)) {
        _pos = j;
        break;
      }
    }

    if(_pos != -1) verbEomi = _text.substring(_pos);
    else verbEomi = '';

    if(verbToken.text =='이다' ||
      (verbToken.text == '야' && verbToken.pos == 'Josa') ||
      (verbToken.text == '예요' && verbToken.pos == 'Josa')) {

      verbType = 0;
      verbPos = verbToken.offset;

    } else if(verbToken.text == '해주다' ||
      (verbToken.text == '해' && verbToken.pos == 'Josa') ||
      (verbToken.text == '줄다' && verbToken.pos == 'Verb')) {

      verbType = 1;
      verbPos = verbToken.offset + verbToken.text.indexOf('해');

    } else if(verbToken.text.endsWith('하다')) {
      verbType = 1;
      verbPos = verbToken.offset + verbToken.text.indexOf('하다');
    } else {
      verbType = 2;
      verbPos = verbToken.offset + verbToken.text.indexOf('다');
    }
  }

  var info = {sentenceType: sentenceType, toneType: toneType, verbType: verbType, tense: tense, aspect: aspect,
    verbPos: verbPos, verbEomi: verbEomi, verbToken: verbToken};
  // console.log(JSON.stringify(info));

  return info;
}

exports.analyzeSentence  = analyzeSentence;

function makeTone(text, result1, result2, info, toneType) {
  var eomi = '';

  if(toneType == '합쇼체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '입니다';
      else if(info.sentenceType == 1) eomi = '입니까';
      else if(info.sentenceType == 2) eomi = '입시오';
      else if(info.sentenceType == 3) eomi = '입시다';
      else eomi = '입니다';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '합니다';
      else if(info.sentenceType == 1) eomi = '합니까';
      else if(info.sentenceType == 2) eomi = '하십시오';
      else if(info.sentenceType == 3) eomi = '하십시다';
      else eomi = '합니다';
    } else if(info.verbType == 2) {
      if(info.sentenceType == 0) eomi = '습니다';
      else if(info.sentenceType == 1) eomi = '습니까';
      else if(info.sentenceType == 2) eomi = '습시오';
      else if(info.sentenceType == 3) eomi = '습시다';
      else eomi = '습니다';
    }
  } else if(toneType == '하오체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '이오';
      else if(info.sentenceType == 1) eomi = '이오';
      else if(info.sentenceType == 2) eomi = '입시오';
      else if(info.sentenceType == 3) eomi = '입시다';
      else eomi = '이오';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '하오';
      else if(info.sentenceType == 1) eomi = '하오';
      else if(info.sentenceType == 2) eomi = '하오';
      else if(info.sentenceType == 3) eomi = '합시다';
      else eomi = '하오';
    }
  } else if(toneType == '하게체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '이네';
      else if(info.sentenceType == 1) eomi = '인가';
      else if(info.sentenceType == 2) eomi = '이게';
      else if(info.sentenceType == 3) eomi = '이세';
      else eomi = '이오';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '하네';
      else if(info.sentenceType == 1) eomi = '하는가';
      else if(info.sentenceType == 2) eomi = '하게';
      else if(info.sentenceType == 3) eomi = '하세';
      else eomi = '하네';
    }
  } else if(toneType == '해라체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '이다';
      else if(info.sentenceType == 1) eomi = '이나';
      else if(info.sentenceType == 2) eomi = '이라';
      else if(info.sentenceType == 3) eomi = '이자';
      else eomi = '이오';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '한다';
      else if(info.sentenceType == 1) eomi = '하니';
      else if(info.sentenceType == 2) eomi = '해라';
      else if(info.sentenceType == 3) eomi = '하자';
      else eomi = '한다';
    }
  } else if(toneType == '해요체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '예요';
      else if(info.sentenceType == 1) eomi = '인가요';
      else if(info.sentenceType == 2) eomi = '이요';
      else if(info.sentenceType == 3) eomi = '이요';
      else eomi = '예요';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '해요';
      else if(info.sentenceType == 1) eomi = '하나요';
      else if(info.sentenceType == 2) eomi = '해주세요';
      else if(info.sentenceType == 3) eomi = '해주세요';
      else eomi = '해요';
    } else if(info.verbType == 2) {
      if(info.sentenceType == 0) eomi = '아요';
      else if(info.sentenceType == 1) eomi = '아요';
      else if(info.sentenceType == 2) eomi = '아해주세요';
      else if(info.sentenceType == 3) eomi = '아해주세요';
      else eomi = '아요';
    }
  } else if(toneType == '해체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '야';
      else if(info.sentenceType == 1) eomi = '야';
      else if(info.sentenceType == 2) eomi = '야';
      else if(info.sentenceType == 3) eomi = '야';
      else eomi = '야';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '해';
      else if(info.sentenceType == 1) eomi = '해';
      else if(info.sentenceType == 2) eomi = '해';
      else if(info.sentenceType == 3) eomi = '해';
      else eomi = '해';
    } else if(info.verbType == 2) {
      if(info.sentenceType == 0) eomi = '아';
      else if(info.sentenceType == 1) eomi = '아해';
      else if(info.sentenceType == 2) eomi = '아해';
      else if(info.sentenceType == 3) eomi = '아해';
      else eomi = '아';
    }
  }

  if(info.verbPos != undefined) {
    var _text = text.replace(text.substring(info.verbPos, text.length), eomi);
    // console.log(_text);
    return _text;
  } else {
    return text;
  }
}

exports.makeTone = makeTone;

function KorToJaso(str) {
  var cCho  = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
    cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ],
    cJong = [ '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
    cho, jung, jong;

  var cnt = str.length,
    chars = [],
    cCode;

  for (var i = 0; i < cnt; i++) {
    cCode = str.charCodeAt(i);

    if (cCode == 32) { continue; }

    // 한글이 아닌 경우
    if (cCode < 0xAC00 || cCode > 0xD7A3) {
      chars.push(str.charAt(i));
      continue;
    }

    cCode  = str.charCodeAt(i) - 0xAC00;

    jong = cCode % 28; // 종성
    jung = ((cCode - jong) / 28 ) % 21 // 중성
    cho  = (((cCode - jong) / 28 ) - jung ) / 21 // 초성

    chars.push(cCho[cho], cJung[jung]);
    if (cJong[jong] !== '') { chars.push(cJong[jong]); }
  }

  return chars;
}

var samples = [
  '한국어를 처리하는 예시입니다.',
  '한국어를 처리하는 예시이다.',
  '한국어를 처리하는 예시야.',
  '한국어를 처리하는 예시예요.',
  '한국어를 처리하는 것을 좋아합니다.',
  '한국어를 처리하는 것을 좋아하다.',
  '한국어를 처리하는 것을 좋아해.',
  '한국어를 처리하는 것을 좋아해요.',
  '한국어를 처리하는 것을 좋아하나요?',
  '한국어를 처리 해줄래.',
  '한국어를 처리해.',
  '한국어를 처리해 주세요.',
  '한국어를 처리해 주십시오.',
  '장모님 있어?',
  '도착해서 나한테 전화 해줘.',
  '시간 날때 가보자.',
  '내일 대학원 갔다 오는 거야?',
  '먼데 어떻게 가?',
  '응 뚱 빨리 코자',
  '갑자기?',
  '유치원 체육대회 토요일이야 일요일이야?',
  '주말에 놀러오라구 했는데 괜찮지?',
  '일단해.',
  '왔을때 고쳐.',
  '지윤이 몇호',
  '아가 토니스트래치 오늘 왔나?',
  '장모님 있어?',
  '수정해 달라구 해',
  '응 지윤이가 고민해서 판단해',
  '지윤 뚱이 사봐',
  '누구랑 할꺼야?',
  '언제 할꺼야?',
  '어디서 할꺼야?',
  '어떻게 할꺼야?',
  '왜 할꺼야?',
  '얼마나 할꺼야?'
];
