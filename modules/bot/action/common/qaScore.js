var QAScore = function () {
};

QAScore.prototype.assignScore = function(contextInfo, matchInfo) {
    var answers = matchInfo.qa;
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

        if (answers[i].state == "FULL") {
            score += 200;
        }

        if (contextInfo.lastContextHistory && contextInfo.lastContextHistory[0]) {
            var currentContext = answers[i].context;
            for(var previousContextName in contextInfo.lastContextHistory[0]) {
                var previousContext = contextInfo.lastContextHistory[0][previousContextName];
                var contexts = [];
                while (currentContext != null && currentContext.name) {
                    contexts.push(currentContext.name);
                    currentContext = currentContext.parent;
                }
                for (var j=0; j<contexts.length; j++) {
                    var context = contexts[j];
                    while (previousContext != null && previousContext.name) {
                        if (context == previousContext.name) {
                            score += (contexts.length-j) * 10;
                            break;
                        }
                        if (previousContext.parent) previousContext = previousContext.parent;
                        else break;
                    }
                }
            }
        }

        answers[i].score = score;
    }

    answers = answers.sort(function(answer1, answer2) {
        if (answer1 && answer2 && answer1.score && answer2.score ) {
            return answer2.score - answer1.score;
        } else {
            return 0;
        }
    });

    // 상위 동일 개수 체크
    topSameScoreCount = 1;
    for (var i=1; i<answers.length; i++) {
        if (answers[0].score == answers[i].score) topSameScoreCount += 1;
    }

    matchInfo.topScoreCount = topSameScoreCount;
    matchInfo.qa = answers;
    return matchInfo;
}

// for node.js library export
if (typeof exports !== 'undefined')
    module.exports = QAScore;

