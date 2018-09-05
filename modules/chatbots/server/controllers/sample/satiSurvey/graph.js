var dialogs = [
    {
        "id": "dialog_1",
        "name": "이름 수집",
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
                "name": "전화번호 수집",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "고객님의 연락처를 입력해주세요.\n예)\n01012341234"
                    }
                ],
                "children": [
                    {
                        "id": "dialog_3",
                        "name": "서비스 친절 만족도",
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
                                "text": "서비스를 담당한 직원이 친절히 응대했습니까? \n(1,2,3으로 답변해주세요.)\n\n1. 불친절했다\n2. 보통이었다\n3. 친절했다"
                            }
                        ],
                        "children": [
                            {
                                "id": "dialog_4",
                                "name": "서비스 안내 만족도",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "서비스에 대해 충분히 안내받으셨습니까?\n(1,2,3으로 답변해주세요.)\n\n1. 부족했다\n2. 보통이다\n3. 충분했다"
                                    }
                                ],
                                "children": [
                                    {
                                        "id": "dialog_5",
                                        "name": "서비스 비용 만족도",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "서비스의 비용에 대해 만족하십니까?\n(1,2,3으로 답변해주세요.)\n\n1. 비싸다\n2. 적절하다\n3. 저렴하다"
                                            }
                                        ],
                                        "children": [
                                            {
                                                "id": "dialog_6",
                                                "name": "서비스 결과 만족도",
                                                "input": [
                                                    {
                                                        "if": "true"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "서비스 결과에 만족하십니까?\n(1,2,3으로 답변해주세요.)\n\n1. 불만이다\n2. 보통이다\n3. 만족한다"
                                                    }
                                                ],
                                                "children": [
                                                    {
                                                        "id": "dialog_7",
                                                        "name": "서비스 추천 의사",
                                                        "input": [
                                                            {
                                                                "if": "true"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Content",
                                                                "text": "서비스를 지인분들에게 추천하시겠습니까?\n(1,2,3으로 답변해주세요.)\n1. 추천안한다\n2. 고민된다\n3. 추천한다"
                                                            }
                                                        ],
                                                        "children": [
                                                            {
                                                                "id": "dialog_8",
                                                                "name": "설문 종료",
                                                                "input": [
                                                                    {
                                                                        "if": "true"
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Content",
                                                                        "text": "설문이 완료되었습니다. 설문에 응해 주셔서 대단히 감사합니다. 오늘도 좋은 하루 되시기 바랍니다.\n+bot.name+"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "call_2",
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
                                        "dialogId": "dialog_6"
                                    }
                                ],
                                "id": "call_2"
                            }
                        ]
                    },
                    {
                        "name": "call_3",
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
                        "id": "call_3"
                    }
                ]
            }
        ],
        "index": 1,
        "first": true
    },
    {
        "id": "dialog_9",
        "name": "설문 거부 처리",
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
                "text": "거부 처리 완료되었습니다. 오늘도 좋은 하루 되시기 바랍니다.\n+bot.name+"
            }
        ],
        "parent": true,
        "index": 9,
        "first": true
    }
];

var commonDialogs = [
    {
        "id": "startDialog",
        "name": "안내 설문조사 동의",
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
                "text": "(광고) +bot.name+ / +bot.companyCall+\n+bot.description+\n\n개인 정보 수집 및 설문 조사에 동의하시겠습니까?\n\n#동의 시, 1 또는 동의를 입력해 주세요.\n#거부 시 2 또는 거부를 입력해 주세요.\n\n무료 수신 거부 : 080-111-1111"
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
        "created": "2018-09-05T04:58:34.751Z",
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
        "created": "2018-09-05T04:58:34.751Z",
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
        "created": "2018-09-05T04:58:34.751Z",
        "useYN": 1
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}
