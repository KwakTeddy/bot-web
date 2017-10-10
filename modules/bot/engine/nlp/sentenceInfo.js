var SentenceInfo = function (lanuage) {
    // (declarative, 평서문), (exclamation, 감탄문), (interrogative, 의문문), (imperative, 명령문), (lets, 청유문)
    this.type = {"declarative" : 0, "exclamation" : 1, "interrogative" : 2, "imperative" : 3, "lets" : 4};

    return this;
};

SentenceInfo.prototype.toKorChars = function(str) {
    var cCho  = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ];
    var cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ];
    var cJong = [ '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ];
    var cho, jung, jong;

    var cnt = str.length;
    var chars = []
    var cCode;

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

SentenceInfo.prototype.analyzeKO = function (posJson) {
    str = String(posJson.sentence.str);
    morphemes = posJson.morpheme;

    var suffix = "";
    var suffixIndex = -1;
    var wasSuffix = false;

    // 문장 가장 뒤의 suffix 찾기
    for (var i=morphemes.length-1; i>=0; i--) {
        if (wasSuffix == false && morphemes[i].pos == 'Suffix') {
            wasSuffix = true;
            suffixIndex = i;
            suffix = morphemes[i].str;
        }
        if (wasSuffix === true && morphemes[i].pos == 'Verb') {
            if (suffixIndex - i >= 5) {
                wasSuffix = false;
                suffixIndex = -1;
                suffix = "";
                continue;
            }
        }
    }

    if (wasSuffix == true) {
        // 1. 의문문: -느냐, -니, -아/-어, -나/-은가, -오/-소, -어요/-아요, -습니까/-ㅂ니까
        // 체크 1: 없습니까, 먹었습니까
        if (suffix.length > 3) {
            var lastStr = suffix.substr(1, 3);
            if (lastStr == "습니까" || lastStr == "읍니까") {
                return this.type.interrogative;
            }
        }
        // 체크 2: 없니, 없냐, 먹어줄래
        if (morphemes[suffixIndex-1].pos=="Verb") {
            if (suffix == "니" || suffix == "냐" || suffix == "래") {
                return this.type.interrogative;
            }
        }
        // 체크 3: 갔었니, 먹었니
        if (suffixIndex - 2 > 0) {
            if (morphemes[suffixIndex - 2].pos == "Verb" && morphemes[suffixIndex - 1].pos == "Suffix") {
                if (morphemes[suffixIndex - 1].str == "었" || morphemes[suffixIndex - 1].str == "았") {
                    if (suffix == "니" || suffix == "냐") {
                        return this.type.interrogative;
                    }
                }
                if (suffix == "래") {
                    return this.type.interrogative;
                }
            }
        }

        // 2. 명령문: “-아라/-어라, -아/-어, -게, -오/-으오, -아요/-어요, -십시오/-시지요‟
        // 체크 1: 와라, 찾아라, 찾아줘, 찾아죠
        if (morphemes[suffixIndex-1].pos=="Verb") {
            if (suffix == "니" || suffix == "냐" || suffix == "라" || suffix == "줘" || suffix == "죠") {
                return this.type.imperative;
            }
        }
        // 체크 3: 가져와봐.
        if (morphemes.length > 1) {
            var lastIndex = morphemes.length - 1;
            if (morphemes[lastIndex-1].pos == "Verb" && morphemes[lastIndex].str == "봐") {
                return PC_SentenceInfoType.imperative;
            }
        }

        // 3. 감탄문: -구나, -군, -구먼, -구려‟
        // 체크 1: 했구나, 했군
        if (morphemes[suffixIndex-1].pos=="Verb") {
            if (suffix == "구나" || suffix == "군" || suffix == "구만" || suffix == "구먼") {
                return this.type.exclamation;
            }
        }
        // 체크 2: 먹었구나, 먹었군
        if (suffixIndex - 2 > 0) {
            if (morphemes[suffixIndex - 2].pos == "Verb" && morphemes[suffixIndex - 1].pos == "Suffix") {
                if (morphemes[suffixIndex - 1].str == "었" || morphemes[suffixIndex - 1].str == "았") {
                    if (suffix == "구나" || suffix == "군") {
                        return this.type.exclamation;
                    }
                }
            }
        }
    }

    // 2. 명령문: “-아라/-어라, -아/-어, -게, -오/-으오, -아요/-어요, -십시오/-시지요‟
    // 체크 2: 먹어줘
    for (var i=morphemes.length-1; i>=0; i--) {
        if (morphemes[i].pos == 'Verb') {
            if (morphemes[i].str.charAt(morphemes[i].str.length-1) == "줘") {
                return this.type.imperative;
            }
        }
    }

    // 4. 청유문: -자, -세, -ㅂ시다, -시지요
    // 체크 1: 하자, 가보자, 먹어보자
    // 문장 가장 뒤의 suffix 찾기
    wasSuffix = false;
    suffix = "";
    suffixIndex = -1;
    if (morphemes.length==1) {
        if (morphemes[0].str == "하자") {
            return this.type.lets;
        }
        if (morphemes[0].str == "보자") {
            return this.type.lets;
        }
        if (morphemes[0].str == "가보자") {
            return this.type.lets;
        }
    } else {
        for (var i=morphemes.length-1; i>=0; i--) {
            if (morphemes[i].str == '하자' || morphemes[i].str == '보자' || morphemes[i].str == '가보자') {
                suffixIndex = i;
                suffix = morphemes[i].str;
                wasSuffix = true;
            }
        }
        if (wasSuffix == true) {
            if (morphemes[suffixIndex-1].pos=="Noun" || morphemes[suffixIndex-1].pos=="Verb") {
                if (suffix == "하자" || suffix == "보자" || suffix == "가보자") {
                    return this.type.lets;
                }
            }
        }
    }

    return this.type.declarative;
}

SentenceInfo.prototype.isBeVerb = function (str) {
    str = str.toLowerCase();
    if (str == "be" || str == "am" || str == "are" || str == "is" || str == "was" || str == "were") {
        return true;
    }
    return false;
}
SentenceInfo.prototype.isInterrogative = function (str) {
    str = str.toLowerCase();
    if (str == "who" || str == "what" || str == "where" || str == "which" || str == "when" || str == "why") {
        return true;
    }
    return false;
}
SentenceInfo.prototype.analyzeEN = function (posJson) {
    str = String(posJson.sentence.str);
    morphemes = posJson.morpheme;

    var suffix = "";
    var suffixIndex = -1;
    var wasSuffix = false;

    // 1. 의문문
    // 체크1. is this... do you...
    if (morphemes.length > 1) {
        if (morphemes[0].pos == "AuxVerb") {
            return this.type.interrogative;
        }
        if (this.isBeVerb(morphemes[0].str)) {
            return this.type.interrogative;
        }
    }

    // 체크2. what is this, which book is, What sports,
    if (morphemes.length > 2) {
        var str0 = morphemes[0].str.toLowerCase();
        if (this.isInterrogative(str0)) {
            var pos1 = morphemes[1].pos;
            if (pos1 == "Verb" || pos1 == "AuxVerb") {
                return this.type.interrogative;
            }

            var pos2 = morphemes[2].pos;
            if (pos1 == "NOUN") {
                if (pos2 == "Verb" || pos2 == "AuxVerb") {
                    return this.type.interrogative;
                }
            }
        }
    }

    // 2. 명령문
    // 체크1. is this... do you...
    if (morphemes.length > 1) {
        if (morphemes[0].pos == "Verb" && !this.isBeVerb(morphemes[0].str)) {
            return this.type.imperative;
        }
    }

    // 3. 감탄문
    // 체크1. How foolish, What a foolish
    if (morphemes.length > 1) {
        if (morphemes[0].str.toLowerCase() == "how") {
            if (morphemes[1].pos == "Adjective" || morphemes[1].pos == "Adverb") {
                return this.type.declarative;
            }
        }
        if (morphemes[0].str.toLowerCase() == "what") {
            if (morphemes[1].pos == "Determiner") {
                if (morphemes[2].pos == "Adjective" || morphemes[2].pos == "Adverb" || morphemes[2].pos == "Noun") {
                    return this.type.declarative;
                }
            }
        }
    }

    // 4. 청유형
    // 체크1. Let’s (합시다), Shall we?
    if (morphemes.length > 1) {
        if (morphemes[0].str.toLowerCase() == "let’s") {
            if (morphemes[1].pos == "Verb") {
                return this.type.lets;
            }
        }
    }
    if (morphemes.length > 2) {
        if (morphemes[0].str.toLowerCase() == "shall") {
            if (morphemes[1].str.toLowerCase() == "we") {
                if (morphemes[2].pos == "Verb" && !this.isBeVerb(morphemes[2].str)) {
                    return this.type.lets;
                }
            }
        }
    }

    return this.type.declarative;
}

SentenceInfo.prototype.analyzeZH = function (posJson) {
    str = String(posJson.sentence.str);
    morphemes = posJson.morpheme;

    // 1. 의문문
    // 체크1. 서술문 + 吗
    if (morphemes.length > 1) {
        if (morphemes[morphemes.length-1].str == "吗") {
            if (morphemes[morphemes.length-2].pos == 'Verb' || morphemes[morphemes.length-2].pos == 'Adjective') {
                return this.type.interrogative;
            }
        }
        if (morphemes[morphemes.length-1].str == "呢") {
            if (morphemes[morphemes.length-2].pos == 'Verb' || morphemes[morphemes.length-2].pos == 'Adjective' || morphemes[morphemes.length-2].pos == 'Pronoun' || morphemes[morphemes.length-2].pos == 'Noun') {
                return this.type.interrogative;
            }
        }
        if (morphemes[morphemes.length-1].str == "哪儿") {
            return this.type.interrogative;
        }
    }

    for (var i=1; i<morphemes.length; i++) {
        if (morphemes[i].str == '没') {
            if ((i+1<morphemes.length) && (morphemes[i-1].str == morphemes[i+1].str)) {
                return this.type.interrogative;
            }
        }
        /*
        if (morphemes[i].str == '是') {
            if ((i+1<morphemes.length) && (morphemes[i-1].pos == "Pronoun" || morphemes[i-1].pos == "Noun") && (morphemes[i+1].pos == "Pronoun" || morphemes[i+1].pos == "Noun")) {
                return this.type.interrogative;
            }
        }
        */
        if (morphemes[i].str == '几' || morphemes[i].str == '多少' || morphemes[i].str == '怎么' || morphemes[i].str == '为什么' || morphemes[i].str == '还是') {
            return this.type.interrogative;
        }
    }
    // 체크2. 谁 (누가), 什么 (무엇), 当 (언제), 如何 (어떻게), 为什么 (왜), 哪里 (어디)
    if (str.indexOf("谁") != -1 ||
        str.indexOf("什么") != -1 ||
        str.indexOf("当") != -1 ||
        str.indexOf("如何") != -1 ||
        str.indexOf("为什么") != -1 ||
        str.indexOf("哪里") != -1) {
        return this.type.interrogative;
    }

    // 2. 명령문
    // 체크1. 不要 + 동사인 경우, 别 + 동사인 경우
    for (var i=0; i<morphemes.length; i++) {
        if (morphemes[i].str.indexOf("不要") > -1) {
            if (morphemes[i].pos == "Adjective") {
                return this.type.imperative;
            }
            if (i<morphemes.length-1) {
                if (morphemes[i+1].pos == "Verb") {
                    return this.type.imperative;
                }
            }
        }
        if (morphemes[i].str.indexOf("别") > -1) {
            if (morphemes[i].pos == "Adjective") {
                return this.type.imperative;
            }
            if (i<morphemes.length-1) {
                if (morphemes[i+1].pos == "Verb") {
                    return this.type.imperative;
                }
            }
        }
    }

    // 3. 감탄문
    // 체크1. 내용 자체가 감탄
    if (str.indexOf("好极了")>-1 ||
        str.indexOf("中华人民共和国万岁")>-1 ||
        str.indexOf("祝您健康长寿")>-1 ||
        str.indexOf("祝你生日快乐")>-1 ||
        str.indexOf("旅行快乐")>-1) {
        return this.type.exclamation;
    }

    // 체크2.
    if (morphemes.length >=3) {
        for (var i=2; i<morphemes.length; i++) {
            // ‘多(么)+형용사+啊’
            if ((morphemes[i-2].str == "多" || morphemes[i-2].str == "么") && morphemes[i-1].pos == "Adjective" && morphemes[i].str == "啊") {
                return this.type.exclamation;
            }
            // ‘多(么)’ 앞에 ‘该’가 오는 경우
            if (morphemes[i-1].str == "该" && (morphemes[i].str == "多" || morphemes[i].str == "么")) {
                return this.type.exclamation;
            }
        }
        // ‘太…了’를 사용
        if (morphemes[0].str == "太" && morphemes[morphemes.length-1].str == "了") {
            return this.type.exclamation;
        }
    }

    return this.type.declarative;
}

SentenceInfo.prototype.analyzeJA = function (posJson) {
    str = String(posJson.sentence.str);
    morphemes = posJson.morpheme;

    // 1. 의문문
    // 체크1. 문장 뒤에 だ를 지우고 か
    if (morphemes.length > 1) {
        if (morphemes[morphemes.length-2].pos == "Preposition" || morphemes[morphemes.length-2].pos == "AuxVerb" || morphemes[morphemes.length-2].pos == "Verb") {
            if (morphemes[morphemes.length-1].str == "か" && morphemes[morphemes.length-1].pos == "Preposition") {
                return this.type.interrogative;
            }
        }
    }

    // 2. 명령문
    // 체크1. 동사 ます형 + なさい
    if (morphemes.length > 1) {
        if (morphemes[morphemes.length-2].pos == "AuxVerb" || morphemes[morphemes.length-2].pos == "Verb") {
            if (morphemes[morphemes.length-1].str == "なさい") {
                return this.type.imperative;
            }
        }
    }
    if (morphemes.length > 2) {
        if (morphemes[morphemes.length-2].pos == "Preposition" || morphemes[morphemes.length-2].pos == "AuxVerb" || morphemes[morphemes.length-2].pos == "Verb") {
            if (morphemes[morphemes.length-1].str == "しまえ") {
                return this.type.imperative;
            }
        }
    }

    // 3. 감탄문
    // 체크1. 1단어 형용사
    if (morphemes.length == 1) {
        if (morphemes[0].pos == "Adjective") {
            return this.type.exclamation;
        }
    }

    // 체크2. おや (감탄사로써 어, 이런, 어머, 어머나.)
    if (morphemes.length > 1) {
        if (morphemes[0].pos == "Interjection") {
            return this.type.exclamation;
        }
    }

    // 4. 청유형
    // 끝 음절인 " る。" 를 " よう。" 로 교체
    if (morphemes.length > 2) {
        if (morphemes[morphemes.length-1].pos == "Verb") {
            if (morphemes[1].str.indexOf("よう")>0) {
                return this.type.lets;
            }
        }
    }

    return this.type.declarative;
}

SentenceInfo.prototype.analyze = function (language, nlu) {
    if ("pos" in nlu && nlu.pos != null && nlu.pos != "") {
        var posJson = eval("(" + nlu.pos + ")");
        str = String(posJson.sentence.str);

        // 1. 문장 부호 확인
        lastStr = str.charAt(str.length - 1);
        if (lastStr == "?" || lastStr == "？") {
            return this.type.interrogative;
        } else if (lastStr == "!") {
            return this.type.exclamation;
        }

        // 2. 문장의 동사 뒤 어미 확인
        if (language == "ko") {
            return this.analyzeKO(posJson);
        } else if (language == "en") {
            return this.analyzeEN(posJson);
        } else if (language == "zh") {
            return this.analyzeZH(posJson);
        } else if (language == "ja") {
            return this.analyzeJA(posJson);
        }
    } else {
        return this.type.declarative;
    }

    return this.type.declarative;
}

// for node.js library export
if (typeof exports !== 'undefined')
    module.exports = SentenceInfo;
