var TypeUtil = function () {
};

TypeUtil.prototype.parseDialogSetDocs = function(docs) {
/*
{"_id":"5a0110e2e02af33e51af7e71","input":["언제 출근 하다","출근 하다","222","111"],"inputRaw":["언제 출근해?","출근해?","222","111"],"output":["아침","이른 시간"],"dialogset":"5a00455eea534fcc3e8chWord":"[object Object]","matchCount":null,"matchNLP":[],"matchMin":0,"matchMax":3,"matchRate":1,"score":0}
*/
    if (!docs && docs == undefined) return [];
    if (!docs.inputRaw && docs.inputRaw == undefined) return [];

    if (Array.isArray(docs.inputRaw)) {
        var len = docs.inputRaw;
        var results = [];
        for (var i = 0; i<docs.inputRaw.length; i++) {
            var randomInt = -1;
            if (Array.isArray(docs.output)) {
                randomInt = Math.floor(Math.random() * docs.output.length); // 0 ~ len
            }

            console.log('랜덤 인트 : ', randomInt, docs.output[randomInt]);

            var result = {};
            if (docs._id && docs._id != undefined) result["_id"] = docs._id;
            if (docs.input && docs.input != undefined) result["input"] = docs.input[i];
            if (docs.inputRaw && docs.inputRaw != undefined) result["inputRaw"] = docs.inputRaw[i];
            if (randomInt==-1) {
                if (docs.output && docs.output != undefined) result["output"] = docs.output;
            } else {
                if (docs.output && docs.output != undefined) result["output"] = docs.output[randomInt];
            }
            if (docs.dialogset && docs.dialogset != undefined) result["dialogset"] = docs.dialogset;
            if (docs.matchCount && docs.matchCount != undefined) result["matchCount"] = docs.matchCount;
            if (docs.matchNLP && docs.matchNLP != undefined) result["matchNLP"] = docs.matchNLP;
            if (docs.matchMin && docs.matchMin != undefined) result["matchMin"] = docs.matchMin;
            if (docs.matchMax && docs.matchMax != undefined) result["matchMax"] = docs.matchMax;
            if (docs.matchRate && docs.matchRate != undefined) result["matchRate"] = docs.matchRate;
            if (docs.score && docs.score != undefined) {
                result["score"] = docs.score;
            } else {
                result["score"] = 0.0;
            }

            results.push(result);
        }
        return results;
    } else {
      return [docs];
    }
}

// for node.js library export
if (typeof exports !== 'undefined')
    module.exports = TypeUtil;
