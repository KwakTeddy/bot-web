var dialogs = [
    {
        "id": "dialog_1",
        "name": "이름수집",
        "input": [
            {
                "text": {
                    "raw": "1",
                    "nlp": "1"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "고객님의 이름을 입력해주세요."
            }
        ],
        "parent": true,
        "children": [
            {
                "id": "dialog_2",
                "name": "연락처수집",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "연락이 가능한 고객님의 연락처를 입력해주세요."
                    }
                ],
                "children": [
                    {
                        "id": "dialog_6",
                        "name": "날짜수집",
                        "input": [
                            {
                                "types": [
                                    "mobile"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "OO 이벤트 접수가 완료되었습니다.\n참여해주셔서 감사합니다.\n\n결제 시 이 메시지를 보여주시면, 1회 10% 할인이 적용됩니다. \n\n오늘도 좋은 하루 되세요.\n+bot.name+"
                            }
                        ]
                    },
                    {
                        "name": "call_33",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "예시를 참고하여 다시 한번 입력해 주세요.",
                                "type": "returnCall",
                                "dialogId": "dialog_2"
                            }
                        ],
                        "id": "call_33"
                    }
                ]
            }
        ],
        "index": 1,
        "first": true
    },
    {
        "id": "dialog_3",
        "name": "입력확인",
        "input": [
            {
                "text": {
                    "raw": "2",
                    "nlp": "2"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "더 좋은 이벤트로 찾아뵙겠습니다. \n오늘도 좋은 하루 되세요.\n+bot.name+"
            }
        ],
        "parent": true,
        "index": 4,
        "first": true
    }
];

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
                "text": "(광고) +bot.name+ / +bot.companyCall+\n+bot.description+\n\n이 달의 이벤트 안내!\n지금 OO 기념 이벤트에 참여하면 방문 시, 1회 10% 할인!\n\n이벤트 참여 방법 ▶\n메시지로 동의만 입력하면 참여 완료!\n\n지금 이벤트에 참여하시겠습니까?\n#동의 시, 1을 입력해주세요.\n#거부 시, 2를 입력해주세요.\n\n무료수신거부 : 080-1111-1111"
            }
        ]
    },
    {
        "_id": "5b4dea1d55611f9addf74b6f",
        "templateId": "common",
        "type": "global",
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
        ],
        "created": "2018-09-05T01:52:26.049Z",
        "useYN": 1
    },
    {
        "_id": "5b4dea2555611f9addf74b70",
        "id": "upDialog",
        "templateId": "common",
        "type": "global",
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
        ],
        "created": "2018-09-05T01:52:26.049Z",
        "useYN": 1
    },
    {
        "_id": "5b4dea3455611f9addf74b71",
        "id": "noanswer",
        "templateId": "common",
        "type": "global",
        "name": "답변없음",
        "input": "",
        "output": [
            {
                "kind": "Content",
                "text": "알아듣지 못했습니다."
            }
        ],
        "created": "2018-09-05T01:52:26.049Z",
        "useYN": 1
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}