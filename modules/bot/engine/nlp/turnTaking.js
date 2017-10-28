var fs = require('fs');
var path = require('path');
var SentenceInfo = require(path.resolve('./modules/bot/engine/nlp/sentenceInfo.js'));
var sentenceInfo = new SentenceInfo();

var TurnTaking = function (lanuage) {
    // (declarative, 평서문), (exclamation, 감탄문), (interrogative, 의문문), (imperative, 명령문), (lets, 청유문)
    this.type = {"not" : 0, "taking" : 1};
    this.dictionary = {};

    return this;
};

TurnTaking.prototype.parse = function (language) {
    var dicFileName = path.resolve("./external_modules/resources/"+language+"/turnTaking.dic");

    var data = fs.readFileSync(path.resolve(userDicFile), 'utf8');
    var entries = data.split('\n');
    for (var i in entries) {
        var entry = entries[i].split('\t');
        if (entry[0]!='' && entry[1]!='') {
            this.dictionary[entry[0]] = entry[1];
        }
    }
}

TurnTaking.prototype.analyzeKO = function (nlu) {
    var str = nlu.sentence;
    if (str in this.dictionary) return this.dictionary[str];

    // default로 봇은 행동을 한다.
    return 1;
}

TurnTaking.prototype.analyzeEN = function (nlu) {
    var str = nlu.sentence;
    if (str in this.dictionary) return this.dictionary[str];

    // default로 봇은 행동을 한다.
    return 1;
}

TurnTaking.prototype.analyzeZH = function (nlu) {
    var str = nlu.sentence;
    if (str in this.dictionary) return this.dictionary[str];

    // default로 봇은 행동을 한다.
    return 1;
}

TurnTaking.prototype.analyzeJA = function (nlu) {
    var str = nlu.sentence;
    if (str in this.dictionary) return this.dictionary[str];

    // default로 봇은 행동을 한다.
    return 1;
}

TurnTaking.prototype.analyze = function (language, nlu) {
    if (nlu != undefined && nlu != null) {
        var sentenceInfoValue = nlu.sentenceInfo;

        switch (sentenceInfoValue) {
            case sentenceInfo.type.interrogative:
            case sentenceInfo.type.imperative:
            case sentenceInfo.type.lets:
                return this.type.taking;
        }

        if (language == "ko") {
            return this.analyzeKO(nlu);
        } else if (language == "en") {
            return this.analyzeEN(nlu);
        } else if (language == "zh") {
            return this.analyzeZH(nlu);
        } else if (language == "ja") {
            return this.analyzeJA(nlu);
        }
        return this.type.taking;
    } else {
        return this.type.taking.not;
    }
}

// for node.js library export
if (typeof exports !== 'undefined')
    module.exports = TurnTaking;
