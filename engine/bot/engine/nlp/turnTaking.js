var fs = require('fs');
var path = require('path');
var SentenceInfo = require(path.resolve('./engine/bot/engine/nlp/sentenceInfo.js'));
var sentenceInfo = new SentenceInfo();

var TurnTaking = function (language) {
    // (declarative, 평서문), (exclamation, 감탄문), (interrogative, 의문문), (imperative, 명령문), (lets, 청유문)
    this.type = {"not" : 0, "taking" : 1};
    this.dictionary = {};
    this.parse(language);

    return this;
};

TurnTaking.prototype.parse = function (language) {
    var dicFileName = path.resolve("./external_modules/resources/"+language+"/turnTaking.dic");

    try {
      var data = fs.readFileSync(path.resolve(dicFileName), 'utf8');
      var entries = data.split('\n');
      for (var i in entries) {
        var entry = entries[i].split('\t');
        if (entry.length == 2) {
          if (entry[0] != '' && entry[1] != '') {
            this.dictionary[entry[0]] = entry[1];
          }
        } else {
          if (entry[0] != '' && entry[3] != '') {
            this.dictionary[entry[0]] = entry[3];
          }
        }
      }
    } catch(e) {}
}

TurnTaking.prototype.analyze = function (language, nlu) {
    if (nlu != undefined && nlu != null) {
        var sentenceInfoValue = nlu.sentenceInfo;

        var str = nlu.sentence;
        if (str in this.dictionary) return this.dictionary[str];

        return this.type.taking;
    } else {
        return this.type.taking.not;
    }
}

// for node.js library export
if (typeof exports !== 'undefined')
    module.exports = TurnTaking;
