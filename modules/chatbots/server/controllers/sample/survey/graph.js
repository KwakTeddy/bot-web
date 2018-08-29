var dialogs = [];

var commonDialogs = [
    {
        "id": "startDialog",
        "name": "시작",
        "input": [
            {
                "text": {
                    "raw": "start",
                    "nlp": "start"
                }
            },
            {
                "text": {
                    "raw": "시작",
                    "nlp": "시작"
                }
            },
            {
                "text": {
                    "raw": "처음",
                    "nlp": "처음"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "(광고) +bot.name+ / +bot.companyCall+\n+bot.description+\n\n개인 정보 수집 및 상담 예약 진행에 동의하시겠습니까?\n\n#동의 시 1을 입력해 주세요.\n#거부 시 2를 입력해 주세요.\n\n무료 수신 거부 : 080-111-1111"
            }
        ]
    },
    {
        "id": "backDialog",
        "name": "이전",
        "input": [
            {
                "text": {
                    "nlp": "back",
                    "raw": "back"
                }
            },
            {
                "text": {
                    "nlp": "이전",
                    "raw": "이전"
                }
            }
        ],
        "output": [
            {
                "type": "back",
                "kind": "Action"
            }
        ]
    },
    {
        "id": "upDialog",
        "name": "상위",
        "input": [
            {
                "text": {
                    "nlp": "up",
                    "raw": "up"
                }
            },
            {
                "text": {
                    "nlp": "상위",
                    "raw": "상위"
                }
            }
        ],
        "output": [
            {
                "type": "up",
                "kind": "Action"
            }
        ]
    },
    {
        "id": "noanswer",
        "name": "답변없음",
        "input": "",
        "output": [
            {
                "kind": "Content",
                "text": "알아듣지 못했습니다."
            }
        ]
    }
];

module.exports = function(bot)
{
    bot.setDialogs(dialogs);
    bot.setCommonDialogs(commonDialogs);
}
