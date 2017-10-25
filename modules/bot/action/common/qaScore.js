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

QAScore.prototype.isSameSentence = function(question, answer) {
    if (Array.isArray(answer)) {
        for (var i=0; i<answer.length; i++) {
            if (question.inputRaw == answer[i].inputRaw.replace(/^\s+|\s+$/g, "")) {
                return true;
            }

            var questionArray = question.input.split(" ");
            var answerArray = answer[i].input.split(" ");
            if (questionArray.length != answerArray.length) return false;
            for (var i=0; i<answerArray.length; i++) {
                if (questionArray[i] != answerArray[i]) {
                    return false;
                }
            }
            return true;
        }
    } else {
        if (question.inputRaw == answer.inputRaw.replace(/^\s+|\s+$/g, "")) {
            return true;
        }

        var questionArray = question.input.split(" ");
        var answerArray = answer.input.split(" ");
        if (questionArray.length != answerArray.length) return false;
        for (var i = 0; i < answerArray.length; i++) {
            if (questionArray[i] != answerArray[i]) {
                return false;
            }
        }
        return true;
    }
    return false;
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

QAScore.prototype.assignScore = function(nlu) {
    var contextInfo = nlu.contextInfo;
    var matchInfo = nlu.matchInfo;
    var answers = this.stripArray(matchInfo.qa);
    var question = {};
    question["inputRaw"] = nlu.sentence;
    question["input"] = nlu.inNLP;

    var previousSentenceArray = [];
    if (contextInfo.queryHistory.length > 0) {
        previousSentenceArray = contextInfo.queryHistory[0].input.split(' ');
    }

    // 중복 answer 제거
    var answers = answers.reduce(function(answer1, answer2){
        var isExist = false;
        for (var i=0; i<answer1.length; i++) {
            if (answer1[i].output == answer2.output) {
                isExist = true;
                break;
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

        // multi context에 대한 선택이었는지 확인
        if (contextInfo.context.type=="CONTEXT_SELECTION") {
            if (answers[i].context.name == contextInfo.context.name) {
                score += 300;
            }
        }

        // Full Match 인 경우
        console.log("check:" + i);
        if (this.isSameSentence(question, answers[i])) {
            score += 200;
        }

        // context 매치
        if (contextInfo.contextHistory && contextInfo.contextHistory[0]) {
            var categoryScore = 0;

            var previousContextName = Object.getOwnPropertyNames(contextInfo.contextHistory[0])[0];

            var currentContext = answers[i].context;
            var contexts = [];
            while (currentContext != null && currentContext.name) {
                contexts.push(currentContext.name);
                currentContext = currentContext.parent;
            }
            for (var j=0; j<contexts.length; j++) {
                var context = contexts[j];
                var previousContext = contextInfo.matchContextHistory[0][previousContextName];
                while (previousContext != null && previousContext.name) {
                    if (context == previousContext.name) {
                        categoryScore += (contexts.length-j) * 20;
                        break;
                    }
                    if (previousContext.parent) previousContext = previousContext.parent;
                    else break;
                }
            }
            score += categoryScore;
        }

        // 이전 Question과 현제 답변 문장의 Question (answers[i].input, answers[i].inputRaw)의 유사도 score 계산
        var answerArray = answers[i].input.split(' ');
        var intersection = this.intersectArray(previousSentenceArray, answerArray);
        var union = this.unionArray(previousSentenceArray, answerArray);
        score += (intersection.length / union.length) * 10;

        // 현재 Question과 현제 답변 문장의 Question (answers[i].input, answers[i].inputRaw)의 유사도 score 계산
        var questionArray = question.input.split(' ');
        intersection = this.intersectArray(questionArray, answerArray);
        union = this.unionArray(questionArray, answerArray);
        score += (intersection.length / union.length);
        
        answers[i].score = score;
    }

    answers = answers.sort(function(answer1, answer2) {
        return answer2.score - answer1.score;
    });

    // 상위 동일 개수 체크
    topSameScoreCount = 1;
    var contexts = {};
    if (answers.length>0) contexts[answers[0].context.name] = 1;
    for (var i=1; i<answers.length; i++) {
        if (answers[0].score == answers[i].score) {
            topSameScoreCount += 1;
            contexts[answers[i].context.name] = 1;
        }
    }

    matchInfo.topScoreCount = topSameScoreCount;
    matchInfo.qa = answers;
    matchInfo.contexts = contexts;
    return matchInfo;
}

// for node.js library export
if (typeof exports !== 'undefined')
    module.exports = QAScore;

