var dialogs = [
    {
        "name": "New Dialog1",
        "input": [
            {
                "text": "요금"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "[요금] 고객리스트입니다. 원하시는 고객 번호를 선택하세요.\n\n1. 홍길동 / 1234564564 / 서울시 서초구 방배동 481-5 금영빌딩 104호\n\n2. 홍길동 / 987665432 / 서울시 관악구 봉천동 1645-1 101호",
                "buttons": [
                    {
                        "url": "",
                        "text": "1. 123456456"
                    },
                    {
                        "url": "",
                        "text": "2. 987665432"
                    }
                ]
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "New Dialog2",
                "input": [
                    {
                        "text": "1"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "[요금] 123456456 월별 납부내역입니다.(3개월)\n\n2017.12\n신용카드 자동이체 / 고지금액 1000원 중 0원 납부(미납)\n\n2017.11\n은행 자동이체 / 고지금액 2000원 중 2000원 납부(2017.11.25)\n\n2017.10\n지로용지 납부 / 고지금액 3000원 중 3000원 납부(2017.11.25)",
                        "buttons": [
                            {
                                "url": "",
                                "text": "6개월 전 내역보기(미완)"
                            },
                            {
                                "url": "",
                                "text": "12개월 전 내역보기(미완)"
                            }
                        ],
                        "uploader": {
                            "url": "/api/samchully/dialog-graphs/uploadImage",
                            "alias": "uploadFile",
                            "headers": {},
                            "queue": [],
                            "progress": 0,
                            "autoUpload": true,
                            "removeAfterUpload": false,
                            "method": "POST",
                            "filters": [
                                {
                                    "name": "folder"
                                },
                                {
                                    "name": "queueLimit"
                                }
                            ],
                            "formData": [],
                            "queueLimit": 1.7976931348623157e+308,
                            "withCredentials": false,
                            "disableMultipart": false,
                            "isUploading": false,
                            "_nextIndex": 0,
                            "_failFilterIndex": -1,
                            "_directives": {
                                "select": [],
                                "drop": [],
                                "over": []
                            },
                            "item": "none"
                        }
                    }
                ],
                "id": "default1",
                "task": {
                    "name": ""
                }
            },
            {
                "name": "New Dialog2 Clone",
                "input": [
                    {
                        "text": "2"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "[요금] 123456456 월별 납부내역입니다.(3개월)\n\n2017.12\n신용카드 자동이체 / 고지금액 1000원 중 0원 납부(미납)\n\n2017.11\n은행 자동이체 / 고지금액 2000원 중 2000원 납부(2017.11.25)\n\n2017.10\n지로용지 납부 / 고지금액 3000원 중 3000원 납부(2017.11.25)",
                        "buttons": [
                            {
                                "url": "",
                                "text": "6개월 전 내역보기(미완)"
                            },
                            {
                                "url": "",
                                "text": "12개월 전 내역보기(미완)"
                            }
                        ]
                    }
                ],
                "id": "default2",
                "task": {
                    "name": ""
                }
            }
        ]
    }
];















var commonDialogs = [
    {
        "id": "defaultcommon0",
        "filename": "defaultcommon",
        "name": "시작",
        "input": [
            {
                "text": "start"
            },
            {
                "text": "시작"
            },
            {
                "text": "처음"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "안녕하세요, 삼천리 고객센터 입니다.\n무엇을 도와드릴까요? \n\n*원하시는 메뉴를 하단 버튼에서 선택해주세요*",
                "buttons": [
                    {
                        "url": "",
                        "text": "요금"
                    },
                    {
                        "url": "",
                        "text": "이사/AS"
                    },
                    {
                        "url": "",
                        "text": "안전점검(미완)"
                    },
                    {
                        "url": "",
                        "text": "기타(미완)"
                    }
                ],
                "image": {
                    "url": "/files/samchully-1515402498281-samchully.png",
                    "displayname": "samchully.png"
                }
            }
        ]
    },
    {
        "id": "defaultcommon1",
        "filename": "defaultcommon",
        "name": "상위",
        "input": [
            {
                "text": "up"
            },
            {
                "text": "back"
            },
            {
                "text": "상위"
            },
            {
                "text": "이전"
            }
        ],
        "output": {
            "up": 1
        }
    },
    {
        "id": "defaultcommon2",
        "filename": "defaultcommon",
        "name": "답변없음",
        "input": [
            ""
        ],
        "output": [
            {
                "kind": "Content",
                "text": "알아듣지 못했습니다."
            }
        ],
        "task": {
            "name": "addButton"
        }
    }
];















var _bot = require(require('path').resolve("./engine/bot.js")).getBot('samchully');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);