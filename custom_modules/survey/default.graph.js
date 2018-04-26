var dialogs = [
    {
        "name": "서울 시장",
        "input": [
            {
                "text": {
                    "raw": "동의",
                    "nlp": "동의"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "2018 지방선거 서울 시장으로 누구를 지지하십니까?\n1. 박준하 2. 임보훈 3 조수앙"
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "정당",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "어떤 정당을 지지하십니까?\n1. OOO 2 OOO 3 OOO"
                    }
                ],
                "id": "default1",
                "children": [
                    {
                        "name": "선거의사",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "선거에 참여할 의사가 있으십니까?\n1. 참여 2. 불참"
                            }
                        ],
                        "id": "default3"
                    }
                ]
            }
        ]
    },
    {
        "name": "비동의",
        "input": [
            {
                "if": "true"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "2018 지방선거 설문에 동의하지 않으셨습니다.\n\n추후 설문 참여를 원하실 경우, \"설문\"을 입력해주세요."
            }
        ],
        "id": "default2"
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
            },
            {
                "text": {
                    "raw": "설문",
                    "nlp": "설문"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "2018 지방선거 설문조사 챗봇입니다.\n챗봇 설문 조사에 동의하신다면 \"동의\"라고 입력해주세요."
            }
        ]
    },
    {
        "id": "backDialog",
        "name": "이전",
        "input": [
            {
                "text": {
                    "raw": "back",
                    "nlp": "back"
                }
            },
            {
                "text": {
                    "raw": "이전",
                    "nlp": "이전"
                }
            }
        ],
        "output": [
            {
                "kind": "Action",
                "type": "back"
            }
        ]
    },
    {
        "id": "upDialog",
        "name": "상위",
        "input": [
            {
                "text": {
                    "raw": "up",
                    "nlp": "up"
                }
            },
            {
                "text": {
                    "raw": "상위",
                    "nlp": "상위"
                }
            }
        ],
        "output": [
            {
                "kind": "Action",
                "type": "up"
            }
        ]
    },
    {
        "id": "noanswer",
        "name": "답변없음",
        "input": "",
        "output": [
            {
                "text": "알아듣지 못했습니다.",
                "kind": "Content"
            }
        ]
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}