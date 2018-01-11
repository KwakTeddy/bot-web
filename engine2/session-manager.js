(function()
{
    var Session = function()
    {
        this.sessions = {};
    };

    Session.prototype.make = function(botId, userId)
    {
        var session = this.sessions[botId + '_' + userId];
        if(!session)
        {
            session =
            {
                botUser:
                {
                    nlu:
                    {
                        contextInfo:
                        {
                            contextHistory: [], // 발화의 상태를 history로 저장한다
                            matchContextHistory: [], // 발화의 상태를 history로 저장한다
                            answerHistory: [], // 발화에 대한 대답의 history로 저장한다 (일반, 멀티context 등..)
                            queryHistory: [], // 사용자 발화를 history로 저장한다
                            context: [] // 현재 발화의 상태
                        },
                        dialog: {}, // dialog를 저장한다.
                        matchInfo: // 현재 발화의 매치 정보
                        {
                            qa: [],
                            contextNames: {},
                            contexts: {},
                            topScoreCount: 0
                        },
                        sentence: '',
                        pos: ''
                    },
                    nlpAll: '',
                    inNLP: ''
                },
                bot:
                {

                }
            };

            this.sessions[botId + '_' + userId] = session;
        }

        return session;
    };

    module.exports = new Session();
})();
