var dialogs = [
    {
        "name": "일반 텍스트",
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
                "text": "텍스트만 있습니다."
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "New Dialog",
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
                        "text": "2"
                    }
                ],
                "id": "default4"
            }
        ]
    },
    {
        "name": "텍스트 + 이미지",
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
                "text": "텍스트와 이미지 입니다.",
                "image": {
                    "url": "/files/park-1519268085294-가람.jpg",
                    "displayname": "가람.jpg"
                }
            }
        ],
        "id": "default1"
    },
    {
        "name": "텍스트와 링크",
        "input": [
            {
                "text": {
                    "raw": "3",
                    "nlp": "3"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "텍스트와 링크",
                "buttons": [
                    {
                        "url": "http://www.naver.com",
                        "text": "네이버"
                    }
                ]
            }
        ],
        "id": "default2"
    },
    {
        "name": "텍스트와 버튼",
        "input": [
            {
                "text": {
                    "raw": "4",
                    "nlp": "4"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "텍스트와 버튼",
                "buttons": [
                    {
                        "url": "",
                        "text": "ㅇㅇ"
                    },
                    {
                        "url": "",
                        "text": "ㅁㅁ"
                    },
                    {
                        "url": "www.google.com",
                        "text": "링크"
                    }
                ]
            }
        ],
        "id": "default3"
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
                "text": "우주의 기운이 모인다. 박근핵입니다."
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