var CBTags = function () {
    this.tagDictionary = {};
    this.setNormalizeTag();

    return this;
};

CBTags.prototype.setNormalizeTag = function() {
    var enDictionary = {}
    var jaDictionary = {}
    var koDictionary = {}
    var zhDictionary = {}

    enDictionary["CC"] = "Conjunction";
    enDictionary["CD"] = "Number";
    enDictionary["DT"] = "Prefix";
    enDictionary["EX"] = "Interjection";
    enDictionary["FW"] = "Foreign";
    enDictionary["IN"] = "Preposition";
    enDictionary["JJ"] = "Adjective";
    enDictionary["JJR"] = "Adjective";
    enDictionary["JJS"] = "Adjective";
    enDictionary["MD"] = "AuxVerb";
    enDictionary["NN"] = "Noun";
    enDictionary["NNP"] = "Noun";
    enDictionary["NNPS"] = "Noun";
    enDictionary["NNS"] = "Noun";
    enDictionary["PDT"] = "Prefix";
    enDictionary["POS"] = "Noun";
    enDictionary["PRP"] = "Pronoun";
    enDictionary["PRP$"] = "Noun";
    enDictionary["RB"] = "Adverb";
    enDictionary["RBR"] = "Adverb";
    enDictionary["RBS"] = "Adverb";
    enDictionary["RP"] = "Preposition";
    enDictionary["SYM"] = "Symbol";
    enDictionary["UH"] = "Interjection";
    enDictionary["VB"] = "Verb";
    enDictionary["VBD"] = "Verb";
    enDictionary["VBG"] = "Verb";
    enDictionary["VBN"] = "Verb";
    enDictionary["VBP"] = "Verb";
    enDictionary["VBZ"] = "Verb";
    enDictionary["WDT"] = "Pronoun";
    enDictionary["WP"] = "Pronoun";
    enDictionary["WP$"] = "Noun ";
    enDictionary["WRB"] = "Pronoun";
    jaDictionary["A-c"] = "Adjective";
    jaDictionary["A-dp"] = "Adjective";
    jaDictionary["C"] = "Conjunction";
    jaDictionary["D"] = "Pronoun";
    jaDictionary["E"] = "Foreign";
    jaDictionary["F"] = "Adverb";
    jaDictionary["I-c"] = "Interjection";
    jaDictionary["J-c"] = "Adjective";
    jaDictionary["J-tari"] = "Adjective";
    jaDictionary["J-xs"] = "Adjective";
    jaDictionary["M-aa"] = "Symbol";
    jaDictionary["M-op"] = "Symbol";
    jaDictionary["M-c"] = "Symbol";
    jaDictionary["M-cp"] = "Symbol";
    jaDictionary["M-p"] = "Symbol";
    jaDictionary["N-n"] = "Noun";
    jaDictionary["N-nc"] = "Noun";
    jaDictionary["N-pn"] = "Noun";
    jaDictionary["N-xs"] = "Noun";
    jaDictionary["P"] = "Prefix";
    jaDictionary["P-fj"] = "Preposition";
    jaDictionary["P-jj"] = "Preposition";
    jaDictionary["P-k"] = "Preposition";
    jaDictionary["P-rj"] = "Preposition";
    jaDictionary["P-sj"] = "Preposition";
    jaDictionary["Q-a"] = "Suffix";
    jaDictionary["Q-j"] = "Suffix";
    jaDictionary["Q-n"] = "Suffix";
    jaDictionary["Q-v"] = "Suffix";
    jaDictionary["R"] = "Adjective";
    jaDictionary["S-c"] = "Symbol";
    jaDictionary["S-l"] = "Symbol";
    jaDictionary["V-c"] = "Verb";
    jaDictionary["V-dp"] = "Verb";
    jaDictionary["X"] = "AuxVerb";
    koDictionary["Adjective"] = "Adjective";
    koDictionary["Adverb"] = "Adverb";
    koDictionary["Conjunction"] = "Conjunction";
    koDictionary["Determiner"] = "Prefix";
    koDictionary["Eomi"] = "Suffix";
    koDictionary["Exclamation"] = "Interjection";
    koDictionary["Foreign"] = "Foreign";
    koDictionary["Josa"] = "Suffix";
    koDictionary["Determiner"] = "Determiner"; // 이/그/저와 같은 한정사
    koDictionary["KoreanParticle"] = "Symbol";
    koDictionary["Noun"] = "Noun";
    koDictionary["NounPrefix"] = "Noun";
    koDictionary["Number"] = "Number";
    koDictionary["PreEomi"] = "Suffix";
    koDictionary["Punctuation"] = "Symbol";
    koDictionary["Suffix"] = "Suffix";
    koDictionary["Unknown"] = "Unknown";
    koDictionary["Verb"] = "Verb";
    zhDictionary["AD"] = "Adverb";
    zhDictionary["AS"] = "Adverb";
    zhDictionary["CC"] = "Conjunction";
    zhDictionary["CD"] = "Number";
    zhDictionary["CS"] = "Conjunction";
    zhDictionary["DT"] = "Prefix";
    zhDictionary["FW"] = "Foreign";
    zhDictionary["IJ"] = "Interjection";
    zhDictionary["NN"] = "Noun";
    zhDictionary["NN-SHORT"] = "Noun";
    zhDictionary["NR"] = "Noun";
    zhDictionary["NR-SHORT"] = "Noun";
    zhDictionary["NT"] = "Noun";
    zhDictionary["NT-SHORT"] = "Noun";
    zhDictionary["OD"] = "Number";
    zhDictionary["ON"] = "Onomatopoeia";
    zhDictionary["P"] = "Preposition";
    zhDictionary["PN"] = "Pronoun";
    zhDictionary["PU"] = "Symbol";
    zhDictionary["SP"] = "Suffix";
    zhDictionary["VA"] = "Adjective";
    zhDictionary["DEG"] = "Suffix";
    zhDictionary["DEC"] = "Suffix";
    zhDictionary["VV"] = "Verb";
    zhDictionary["VC"] = "Verb";
    zhDictionary["MSP"] = "Suffix";
    zhDictionary["LS"] = "Noun";
    zhDictionary["LC"] = "Noun";
    zhDictionary["M"] = "Noun";
    zhDictionary["JJ"] = "Noun";

    this.tagDictionary['en'] = enDictionary;
    this.tagDictionary['ja'] = jaDictionary;
    this.tagDictionary['ko'] = koDictionary;
    this.tagDictionary['zh'] = zhDictionary;
}

CBTags.prototype.normalizeTag = function (language, word, tag) {
    if (language != "en") {
        var otherChar = 0;
        for (var i=0; word && i<word.length; i++)  {
            var chk = word.substring(i,i+1);
            if(!chk.match(/[a-z]|[A-Z]/)) {
                otherChar = otherChar + 1;
            }
        }
        if (otherChar == 0) {
            return "Foreign";
        }
    }

    if (typeof this.tagDictionary[language][tag] == 'undefined') {
        return tag;
    }
    return this.tagDictionary[language][tag];
}

// for node.js library export
if (typeof exports !== 'undefined')
    module.exports = CBTags;
