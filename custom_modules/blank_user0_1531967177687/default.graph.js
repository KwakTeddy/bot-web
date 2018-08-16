var dialogs = [
    {
        "name": "상품추천",
        "input": [
            {
                "text": {
                    "raw": "상품 추천",
                    "nlp": "상품 추천"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "~상품추천 요청을 받았습니다.\n\n연령을 입력해주세요."
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "질문1. 연령",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "~연령입력하셨습니다.\n\n펀드를 나열합니다.\n펀드를 선택해주세요."
                    }
                ],
                "id": "default1",
                "children": [
                    {
                        "name": "질문2. 펀드선택",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "~나열된 펀드 중 선택하셨습니다.\n\n투자기간을 입력해주세요."
                            }
                        ],
                        "id": "default2",
                        "children": [
                            {
                                "name": "질문3. 투자기간",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "~투자기간을 입력하셨습니다.\n\n선택하신 사항은 아래와 같습니다.\n\n+dialog.result+\n\n감사합니다."
                                    }
                                ],
                                "task": {
                                    "name": "resultTask"
                                },
                                "id": "default3",
                                "children": []
                            }
                        ]
                    }
                ]
            }
        ]
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
                    "raw": "시작하기",
                    "nlp": "시작 하다"
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
                "text": "안녕하세요, +bot.name+ 입니다.",
                "if": ""
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