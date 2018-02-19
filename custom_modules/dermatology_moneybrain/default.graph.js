var dialogs = [
    {
        "name": "1.병원 소개",
        "input": [
            {
                "text": {
                    "raw": "1",
                    "nlp": "1"
                }
            },
            {
                "text": {
                    "raw": "병원 소개",
                    "nlp": "병원 소개"
                }
            },
            {
                "text": {
                    "raw": "병원소개",
                    "nlp": "병원 소개"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.introduction#+description+\n\n+phone+\n#"
            }
        ],
        "id": "default0",
        "task": {
            "name": "introduction"
        }
    },
    {
        "name": "2.교통편",
        "input": [
            {
                "text": {
                    "raw": "2",
                    "nlp": "2"
                }
            },
            {
                "text": {
                    "raw": "교통",
                    "nlp": "교통"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.transportation#+company+\n\n주소: +address+\n#\n \n어떤 교통으로 방문하시나요?"
            }
        ],
        "id": "default1",
        "task": {
            "name": "transportation"
        },
        "children": [
            {
                "name": "2.1 버스",
                "input": [
                    {
                        "text": {
                            "raw": "",
                            "nlp": ""
                        },
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "#context.session.transportation#+bus+\n#"
                    }
                ],
                "task": {
                    "name": "transportationway"
                },
                "id": "default3"
            }
        ]
    },
    {
        "name": "3.의료진 소개",
        "input": [
            {
                "text": {
                    "raw": "의료진",
                    "nlp": "의료 진"
                }
            },
            {
                "text": {
                    "raw": "3",
                    "nlp": "3"
                }
            },
            {
                "text": {
                    "raw": "인원",
                    "nlp": "인원"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "의료진을 소개합니다."
            }
        ],
        "id": "default2",
        "task": {
            "name": "dean"
        },
        "children": [
            {
                "name": "3.의료진 소개 내용",
                "input": [
                    {
                        "types": [
                            "deanlist"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "#context.session.selecteddean#+name+ 원장\n\n파트: +department+\n\n소개:\n +description+\n#"
                    }
                ],
                "task": {
                    "name": "showdean"
                },
                "id": "default4"
            }
        ]
    },
    {
        "name": "4.교통편 자연어 처리",
        "input": [
            {
                "text": {
                    "raw": "버스",
                    "nlp": "버스"
                }
            },
            {
                "text": {
                    "raw": "지하철",
                    "nlp": "지하철"
                }
            },
            {
                "text": {
                    "raw": "자가용",
                    "nlp": "자가용"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.transportation#+bus+\n#",
                "type": "call"
            }
        ],
        "task": {
            "name": "nlp_transportation"
        },
        "id": "default5"
    },
    {
        "name": "5.의료진 자연어 처리",
        "input": [
            {
                "types": [
                    "deanlist"
                ]
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.selecteddean#+name+ 원장\n\n파트: +department+\n\n소개:\n +description+\n#"
            }
        ],
        "id": "default6",
        "task": {
            "name": "showdean"
        }
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
                "text": "안녕하세요! \n무엇을 도와드릴까요?\n\n1.병원 소개\n2.교통편\n3.의료진 소개"
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
        "filename": "defaultcommon",
        "name": "답변없음",
        "input": "",
        "output": "알아듣지 못했습니다."
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}