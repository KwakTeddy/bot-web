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
                "text": "어느 당을 지지하십니까?\n1. 민주당\n2. 새누리당\n3. 바른정당\n4. 정의당\n5. 기타"
            }
        ],
        "parent": true,
        "called": true,
        "children": [
            {
                "name": "call_0",
                "input": [
                    {
                        "text": {
                            "raw": "1. 민주당",
                            "nlp": "1 . 민주당"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "dialog_3"
                    }
                ],
                "id": "call_0"
            },
            {
                "name": "call_1",
                "input": [
                    {
                        "text": {
                            "raw": "2. 새누리당",
                            "nlp": "2 . 새누리당"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "dialog_3"
                    }
                ],
                "id": "call_1"
            },
            {
                "name": "call_2",
                "input": [
                    {
                        "text": {
                            "raw": "3. 바른미래당",
                            "nlp": "3 . 바르다 미래 당"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "dialog_3"
                    }
                ],
                "id": "call_2"
            },
            {
                "name": "call_3",
                "input": [
                    {
                        "text": {
                            "raw": "4. 정의당",
                            "nlp": "4 . 정의당"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "dialog_3"
                    }
                ],
                "id": "call_3"
            },
            {
                "name": "call_4",
                "input": [
                    {
                        "text": {
                            "raw": "5. 기타",
                            "nlp": "5 . 기타"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "dialog_2"
                    }
                ],
                "id": "call_4"
            }
        ],
        "index": 1
    },
    {
        "id": "dialog_2",
        "name": "일반형_2",
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
                "text": "보기 외에 어느 당을 지지하시는지 입력해주세요."
            }
        ],
        "parent": true,
        "index": 2
    },
    {
        "id": "dialog_3",
        "name": "일반형_3",
        "input": [
            {
                "if": "true"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "지지하는 후보를 입력해주세요."
            }
        ],
        "parent": true,
        "children": [
            {
                "id": "dialog_4",
                "name": "선택형_4",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "연령대를 선택해주세요.\n\n1. 20대 이하\n2. 30대\n3. 40대\n4. 50대\n5. 60대 이상"
                    }
                ],
                "children": [
                    {
                        "id": "dialog_5",
                        "name": "일반형_5",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "감사합니다."
                            }
                        ],
                        "children": [
                            {
                                "id": "dialog_6",
                                "name": "이미지형_6",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "ㅁㅁ",
                                        "image": {
                                            "url": "/files/survey_user0_1532483198916-1532670002116-스크린샷 2018-07-09 오후 3.49.46.png"
                                        }
                                    }
                                ],
                                "children": [
                                    {
                                        "id": "dialog_7",
                                        "name": "이미지형_7",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "test",
                                                "image": {
                                                    "url": "/files/survey_user0_1532483198916-1532670197995-스크린샷 2018-07-19 오전 9.38.27.png"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "index": 3
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
                "text": "(광고) +bot.name+ / +bot.phone+\n+bot.description+\n설문을 시작하시려면 시작을 입력해주세요. \n\n무료거부  \n000-0000-0000"
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
        "created": "2018-08-10T05:35:26.513Z",
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
        "created": "2018-08-10T05:35:26.514Z",
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
        "created": "2018-08-10T05:35:26.514Z",
        "useYN": 1
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}