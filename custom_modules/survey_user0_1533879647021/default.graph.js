var dialogs = [
    {
        "id": "dialog_1",
        "name": "일반형_1",
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
                "name": "일반형_2",
                "input": [
                    {
                        "types": [
                            "name"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "연락이 가능한 휴대폰 번호를 알려주세요.\n예)\n01012341234"
                    }
                ],
                "children": [
                    {
                        "id": "dialog_3",
                        "name": "일반형_3",
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
                                "text": "고객 이름 : +context.user.name+\n연락처 : +context.user.mobile+\n입력하신 정보가 맞으십니까?\n\n예) 네 / 아니오"
                            }
                        ],
                        "children": [
                            {
                                "name": "call_15",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "네",
                                            "nlp": "네"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "",
                                        "type": "call",
                                        "dialogId": "dialog_4",
                                        "dialogName": "일반형_4"
                                    }
                                ],
                                "id": "call_15"
                            },
                            {
                                "name": "call_16",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "아니오",
                                            "nlp": "아니다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "",
                                        "type": "call",
                                        "dialogId": "dialog_1",
                                        "dialogName": "일반형_1"
                                    }
                                ],
                                "id": "call_16"
                            }
                        ]
                    },
                    {
                        "name": "call_17",
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
                        "id": "call_17"
                    }
                ]
            },
            {
                "name": "call_18",
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
                        "dialogId": "dialog_1"
                    }
                ],
                "id": "call_18"
            }
        ],
        "index": 1,
        "fnInput": [
            {
                "types": "name"
            }
        ]
    },
    {
        "id": "dialog_4",
        "name": "일반형_4",
        "input": [
            {
                "if": "true"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "상담 신청 예약이 완료 되었습니다.\n오늘도 좋은 하루 되시기 바랍니다.\n+bot.name+"
            }
        ],
        "parent": true,
        "index": 4
    },
    {
        "id": "dialog_5",
        "name": "일반형_5",
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
                "text": "거부 처리 완료되었습니다.\n오늘도 좋은 하루 되시기 바랍니다.\n+bot.name+"
            }
        ],
        "parent": true,
        "children": [
            {
                "id": "dialog_6",
                "name": "일반형_6",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "상담을 희망하는 날짜와 시간을 알려주세요.\n예)\n7월 13일 오후 2시"
                    }
                ],
                "children": [
                    {
                        "id": "dialog_7",
                        "name": "일반형_7",
                        "input": [
                            {
                                "types": [
                                    "date"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "예시를 참고하여 다시 한번 입력해 주세요."
                            }
                        ]
                    },
                    {
                        "name": "call_19",
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
                        "id": "call_19"
                    }
                ]
            }
        ],
        "index": 5
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
                "text": "(광고) +bot.name+ / +bot.companyCall+\n+bot.description+\n\n개인 정보 수집 및 상담 예약 진행에 동의하시겠습니까?\n\n#동의 시 1 또는 동의를 입력해 주세요.\n#거부 시 2 또는 거부를 입력해 주세요.\n\n무료 수신 거부 : 080-111-1111"
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
        "created": "2018-08-10T09:32:49.768Z",
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
        "created": "2018-08-10T09:32:49.768Z",
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
        "created": "2018-08-10T09:32:49.768Z",
        "useYN": 1
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}