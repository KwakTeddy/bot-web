var TenseAnalyzer = function () {
    // (past, 과거), (present, 현재), (future, 미래)
    this.type = {"past" : 0, "present" : 1, "미래" : 2};

    return this;
};

TenseAnalyzer.prototype.analyze = function(language, json) {

}

// for node.js library export
if (typeof exports !== 'undefined')
    module.exports = TenseAnalyzer;
