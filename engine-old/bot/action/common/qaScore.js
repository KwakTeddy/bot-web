var QAScore = function () {
};

QAScore.prototype.unionArray = function(a, b) {
    var tmp={}, res=[];
    for(var i=0;i<a.length;i++) tmp[a[i]]=1;
    for(var i=0;i<b.length;i++) tmp[b[i]]=1;
    for(var k in tmp) res.push(k);
    return res;
}

QAScore.prototype.intersectArray = function(a, b) {
    var tmp={}, res=[];
    for(var i=0;i<a.length;i++) tmp[a[i]]=1;
    for(var i=0;i<b.length;i++) if(tmp[b[i]]) res.push(b[i]);
    return res;
}

QAScore.prototype.levenshteinDistance = function(src, tgt) {
    var realCost;

    var srcLength = src.length,
        tgtLength = tgt.length,
        tempString, tempLength; // for swapping

    var resultMatrix = new Array();
    resultMatrix[0] = new Array(); // Multi dimensional

    // To limit the space in minimum of source and target,
    // we make sure that srcLength is greater than tgtLength
    if (srcLength < tgtLength) {
        tempString = src; src = tgt; tgt = tempString;
        tempLength = srcLength; srcLength = tgtLength; tgtLength = tempLength;
    }

    for (var c = 0; c < tgtLength+1; c++) {
        resultMatrix[0][c] = c;
    }

    for (var i = 1; i < srcLength+1; i++) {
        resultMatrix[i] = new Array();
        resultMatrix[i][0] = i;
        for (var j = 1; j < tgtLength+1; j++) {
            realCost = (src.charAt(i-1) == tgt.charAt(j-1))? 0: 1;
            resultMatrix[i][j] = Math.min(
                resultMatrix[i-1][j]+1,
                resultMatrix[i][j-1]+1,
                resultMatrix[i-1][j-1] + realCost // same logic as our previous example.
            );
        }
    }

    return resultMatrix[srcLength][tgtLength];
}

QAScore.prototype.getDistance = function(question, answer) {
    var s = question.inputRaw.replace(/\s|\"|\.|\?|\'|<|>|\(|\)/gi, "").toLowerCase();
    if (Array.isArray(answer)) {
        for (var i=0; i<answer.length; i++) {
            if (answer.inputRaw) {
                var t = answer[i].inputRaw.replace(/\s|\"|\.|\?|\'|<|>|\(|\)/gi, "").toLowerCase();
                var distance = this.levenshteinDistance(s, t);
                return distance;
            }
        }
    } else {
        if (answer.inputRaw) {
            var t = answer.inputRaw.replace(/\s|\"|\.|\?|\'|<|>|\(|\)/gi, "").toLowerCase();
            var distance = this.levenshteinDistance(s, t);
            return distance;
        }
    }

    return question.length;
}

QAScore.prototype.stripArray = function(answers) {
    var result = [];
    for (var i=0; i<answers.length; i++) {
        var answer = answers[i];
        if (Array.isArray(answer.inputRaw)) {
            for (var j=0; j<answer.inputRaw.length; j++) {
                //var tempAnswer = answers[i];
                var tempAnswer = Object.assign({}, answers[i]);
                tempAnswer.input = answers[i].input[j];
                tempAnswer.inputRaw = answers[i].inputRaw[j];
                tempAnswer.output = answers[i].output[j];
                result.push(tempAnswer);
            }
        } else {
            result.push(answer);
        }
    }
    return result;
}

QAScore.prototype.init = function(context) {
    // 현재 발화의 대답이 중복인 경우, 중복된 발화의 category들을 저장하는 변수 (dsyoon)
    if (context.botUser["nlu"] == undefined || context.botUser["nlu"] == null) context.botUser["nlu"] = {};
    if (context.botUser.nlu["contextInfo"] == undefined || context.botUser.nlu["contextInfo"] == null) context.botUser.nlu["contextInfo"] = {};

    // 발화의 상태를 history로 저장한다
    if (context.botUser.nlu.contextInfo["contextHistory"] == undefined || context.botUser.nlu.contextInfo["contextHistory"] == null) context.botUser.nlu.contextInfo["contextHistory"] = [];
    if (context.botUser.nlu.contextInfo["matchContextHistory"] == undefined || context.botUser.nlu.contextInfo["matchContextHistory"] == null) context.botUser.nlu.contextInfo["matchContextHistory"] = [];
    // 발화에 대한 대답의 history로 저장한다 (일반, 멀티context 등..)
    if (context.botUser.nlu.contextInfo["answerHistory"] == undefined || context.botUser.nlu.contextInfo["answerHistory"] == null) context.botUser.nlu.contextInfo["answerHistory"] = [];
    // 사용자 발화를 history로 저장한다
    if (context.botUser.nlu.contextInfo["queryHistory"] == undefined || context.botUser.nlu.contextInfo["queryHistory"] == null) context.botUser.nlu.contextInfo["queryHistory"] = [];
    // 현재 발화의 상태
    if (context.botUser.nlu.contextInfo["context"] == undefined || context.botUser.nlu.contextInfo["context"] == null) context.botUser.nlu.contextInfo["context"] = {};

    // 현재 발화의 매치 정보
    if (context.botUser.nlu["matchInfo"] == undefined || context.botUser.nlu["matchInfo"] == null) context.botUser.nlu["matchInfo"] = {};
    if (context.botUser.nlu.matchInfo["qa"] == undefined || context.botUser.nlu.matchInfo["qa"] == null) context.botUser.nlu.matchInfo["qa"] = [];
    if (context.botUser.nlu.matchInfo["contextNames"] == undefined || context.botUser.nlu.matchInfo["contextNames"] == null) context.botUser.nlu.matchInfo["contextNames"] = {};
    if (context.botUser.nlu.matchInfo["contexts"] == undefined || context.botUser.nlu.matchInfo["contexts"] == null) context.botUser.nlu.matchInfo["contexts"] = {};
    if (context.botUser.nlu.matchInfo["topScoreCount"] == undefined || context.botUser.nlu.matchInfo["topScoreCount"] == null) context.botUser.nlu.matchInfo["topScoreCount"] = 0;
}

QAScore.prototype.assignScore = function(scope) {
    this.init(scope);

    var nlu = scope.botUser.nlu;
    var contextInfo = nlu.contextInfo;
    var matchInfo = nlu.matchInfo;
    var answers = this.stripArray(matchInfo.qa);
    var question = {};
    question["inputRaw"] = nlu.sentence;
    question["input"] = nlu.inNLP;

    if (!nlu.sentence && nlu.sentence == undefined) return scope;

    var previousSentenceArray = [];

    if (contextInfo.queryHistory.length > 0) {
        if (contextInfo.queryHistory[0].input && contextInfo.queryHistory[0].input != undefined) {
            previousSentenceArray = contextInfo.queryHistory[0].input.split(' ');
        } else {
            var queryHistory = {};
            queryHistory["input"] = "";
            queryHistory["inputRaw"] = "";
            previousSentenceArray.push(queryHistory);
        }
    }

    // 중복 answer 제거
    var answers = answers.reduce(function(answer1, answer2){
        var isExist = false;
        for (var i=0; i<answer1.length; i++) {
            if (answer1[i].context && answer2.context) {
                if (answer1[i].inputRaw == answer2.inputRaw &&
                    answer1[i].context.name == answer2.context.name) {
                    isExist = true;
                    break;
                }
            } else {
                if (answer1[i].inputRaw == answer2.inputRaw && answer1[i].output == answer2.output) {
                    isExist = true;
                    break;
                }
            }
        }
        if (!isExist) {
            answer1.push(answer2);
        }
        return answer1;
    },[]);

    // score 계산
    for (var i=0; i<answers.length; i++) {
        var score = 0.0;
        var score_multi_context = 0;
        var score_text_match = 0;
        var score_context = 0;

        // multi context에 대한 선택이었는지 확인
        if (contextInfo.context.type=="CONTEXT_SELECTION") {
            if (answers[i].context) {
                if (answers[i].context.name == co2ntextInfo.context.name) {
                    score_multi_context = 300;
                }
            }
        }

        // Full Match 인 경우
        var distance = this.getDistance(question, answers[i]);
        if (distance == 0) {
            score_text_match = 200;
        } else if (distance == 1) {
            score_text_match = 50;
        } else if (distance == 2) {
            score_text_match = 20;
        } else if (distance == 3) {
            score_text_match = 10;
        } else if (distance == 4) {
            score_text_match = 5;
        } else if (distance == 5) {
            score_text_match = 1;
        }

        // context 매치
        if (contextInfo.contextHistory && contextInfo.contextHistory[0]) {
            var previousContextNames = Object.getOwnPropertyNames(contextInfo.contextHistory[0]);
            if (previousContextNames.length == 1) {
                var previousContextName = previousContextNames[0];

                var currentContext = answers[i].context;
                var contexts = [];
                while (currentContext != null && currentContext.name) {
                    contexts.push(currentContext.name);
                    currentContext = currentContext.parent;
                }
                var contextMatchByDepth = [];
                for (var j = 0; j < contexts.length; j++) {
                    contextMatchByDepth[contextMatchByDepth.length] = 0;
                    var context = contexts[j];
                    var previousContext = contextInfo.matchContextHistory[0][previousContextName];
                    while (previousContext != null && previousContext.name) {
                        if (context == previousContext.name) {
                            contextMatchByDepth[contextMatchByDepth.length - 1] = 1;
                            break;
                        }
                        if (previousContext.parent) previousContext = previousContext.parent;
                        else break;
                    }
                }
                // 1depth 부터 같은지 체크
                var depth = 0;
                for (var j = contextMatchByDepth.length - 1; j >= 0; j--) {
                    if (contextMatchByDepth[j] == 0) {
                        break;
                    }
                    depth += 1;
                }
                score_context = depth * 20;
            }
        }

        // 이전 Question과 현제 답변 문장의 Question (answers[i].input, answers[i].inputRaw)의 유사도 score 계산
        /*
        if (answers[i].input != undefined) {
            var answerArray = answers[i].input.split(' ');
            var intersection = this.intersectArray(previousSentenceArray, answerArray);
            var union = this.unionArray(previousSentenceArray, answerArray);
            score_ = (intersection.length / union.length);
        }
        */

        // 현재 Question과 현제 답변 문장의 Question (answers[i].input, answers[i].inputRaw)의 유사도 score 계산
        /*
        if (question.input != undefined) {
            var questionArray = question.input.split(' ');
            intersection = this.intersectArray(questionArray, answerArray);
            union = this.unionArray(questionArray, answerArray);
            score += (intersection.length / union.length);
        }
        */

        score = score_multi_context + score_text_match + score_context;
        answers[i].score = score;

        answers[i]["scoreInfo"] = {};
        answers[i].scoreInfo["multi_context"] = score_multi_context;
        answers[i].scoreInfo["score_text_match"] = score_text_match;
        answers[i].scoreInfo["score_context"] = score_context;
    }

    answers = answers.sort(function(answer1, answer2) {
        return answer2.score - answer1.score;
    });

    //console.log("--------- score ---------");
    //console.log("inputRaw     score     multi_context     score_text_match     score_context");
    //console.log(answers[0].inputRaw + "     " + answers[0].score + "     " + answers[0].scoreInfo.multi_context + "     " + answers[0].scoreInfo.score_text_match + "     " + answers[0].scoreInfo.score_context);
    //console.log(answers[1].inputRaw + "     " + answers[1].score + "     " + answers[1].scoreInfo.multi_context + "     " + answers[1].scoreInfo.score_text_match + "     " + answers[1].scoreInfo.score_context);

    var topSameScoreCount = 1;
    var contexts = {};
    if (answers.length>0  && answers[0].score >= 0.3) {
        // 상위 동일 개수 체크
        if (answers[0].context) {
            if (answers.length > 0) contexts[answers[0].context.name] = 1;
            for (var i = 1; i < answers.length; i++) {
                if (answers[0].score == answers[i].score) {
                    topSameScoreCount += 1;
                    contexts[answers[i].context.name] = 1;
                }
            }
        }
    } else {
        topSameScoreCount = 0;
    }

    scope.botUser.nlu.matchInfo.topScoreCount = topSameScoreCount;
    scope.botUser.nlu.matchInfo.qa = answers;
    scope.botUser.nlu.matchInfo.contexts = contexts;
    return scope;
}

// for node.js library export
if (typeof exports !== 'undefined')
    module.exports = QAScore;
