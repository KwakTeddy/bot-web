var dialogs = [
    {
        "name": "1.1인사",
        "input": [
            {
                "text": "안녕"
            },
            {
                "text": "하이"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "안녕하세요~"
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "사랑해",
                "input": [
                    {
                        "text": "사랑 하다"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "+customerName+님\n저도 사랑해요",
                        "if": "context.user.customerName"
                    },
                    {
                        "kind": "Content",
                        "text": "누군지도 모르는데 어떻게 사랑해요!?",
                        "if": ""
                    }
                ],
                "id": "default8"
            }
        ]
    },
    {
        "name": "1.2.이름",
        "input": [
            {
                "text": "이름"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "저는 플레이 아웃도어 입니다.\n성함이 어떻게 되세요?"
            }
        ],
        "id": "default1",
        "children": [
            {
                "name": "사용자이름",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "안녕하세요. 반가워요.\n+customerName+님"
                    }
                ],
                "actionOutput": {
                    "kind": "Action",
                    "type": "",
                    "dialog": ""
                },
                "id": "default7",
                "task": {
                    "name": "saveCustomerName"
                }
            }
        ]
    },
    {
        "name": "플레이 아웃도어 소개",
        "input": [
            {
                "text": "소개"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "플레이 아웃도어는 사용자 친화적인 아웃도어 브랜드 입니다.\n\n플레이 아웃도어에 대해 더 궁금하신 점을 물어보세요!",
                "buttons": [
                    {
                        "url": "",
                        "text": "플레이 아웃도어 제품의 특징이 뭐죠?"
                    },
                    {
                        "url": "",
                        "text": "플레이 아웃도어는 어디에 있나요?"
                    },
                    {
                        "url": "",
                        "text": "고객센터 알려주세요"
                    }
                ]
            }
        ],
        "actionOutput": {
            "kind": "Action",
            "type": "",
            "dialog": ""
        },
        "id": "default2",
        "children": [
            {
                "name": "회사특징",
                "input": [
                    {
                        "text": "특징"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "방수 처리",
                        "buttons": [
                            {
                                "url": "",
                                "text": "제품 구매하로 가기"
                            }
                        ]
                    }
                ],
                "actionOutput": {
                    "kind": "Action",
                    "type": "",
                    "dialog": ""
                },
                "id": "default3",
                "children": [
                    {
                        "name": "제품소개이동",
                        "input": [
                            {
                                "text": "이동"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "call": "상의",
                                "options": "이동합니다"
                            }
                        ],
                        "actionOutput": {
                            "kind": "Action",
                            "type": "",
                            "dialog": ""
                        },
                        "id": "default6",
                        "children": []
                    },
                    {
                        "name": "상의이동후검색",
                        "input": [
                            {
                                "text": "여름 검색"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "callChild": "상의",
                                "options": {
                                    "output": "이동검색"
                                }
                            }
                        ],
                        "id": "default18"
                    }
                ]
            }
        ]
    },
    {
        "name": "제품 소개",
        "input": [
            {
                "text": "제품"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "플레이 아웃도어의 다양한 제품을 소개해 드릴께요.\n원하시는 카테고리를 선택해주세요",
                "buttons": [
                    {
                        "url": "",
                        "text": "상의"
                    },
                    {
                        "url": "",
                        "text": "하의"
                    }
                ],
                "uploader": {
                    "url": "/api/lecture_jun/dialog-graphs/uploadImage",
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
        "actionOutput": {
            "kind": "Action",
            "type": "",
            "dialog": ""
        },
        "id": "default4",
        "children": [
            {
                "name": "상의",
                "input": [
                    {
                        "text": " ",
                        "entities": "상의 엔터티",
                        "intent": "검색"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "여름에 입으실거에요? 겨울에 입으실 거에요?",
                        "buttons": [
                            {
                                "url": "",
                                "text": "여름"
                            },
                            {
                                "url": "",
                                "text": "겨울"
                            }
                        ]
                    }
                ],
                "actionOutput": {
                    "kind": "Action",
                    "type": "",
                    "dialog": ""
                },
                "id": "default5",
                "children": [
                    {
                        "name": "여름",
                        "input": [
                            {
                                "text": "여름"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "return": 1,
                                "options": {
                                    "output": "여름 상의입니다"
                                }
                            }
                        ],
                        "id": "default16",
                        "children": []
                    },
                    {
                        "name": "겨울",
                        "input": [
                            {
                                "text": "겨울"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "겨울 상의입니다."
                            }
                        ],
                        "id": "default17"
                    }
                ]
            },
            {
                "name": "하의",
                "input": [
                    {
                        "entities": "하의엔터티",
                        "intent": "검색"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "여름에 입으실 거에요? 겨울에 입으실 거에요?",
                        "buttons": [
                            {
                                "url": "",
                                "text": "여름"
                            },
                            {
                                "url": "",
                                "text": "겨울"
                            }
                        ]
                    }
                ],
                "actionOutput": {
                    "kind": "Action",
                    "type": "",
                    "dialog": ""
                },
                "id": "default9"
            }
        ]
    },
    {
        "name": "핸드폰",
        "input": [
            {
                "text": "핸드폰 인증"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "핸드폰 인증을 진행하겠습니다.\n번호를 입력해주세요."
            }
        ],
        "actionOutput": {
            "kind": "Action",
            "type": "",
            "dialog": ""
        },
        "id": "default10",
        "children": [
            {
                "name": "핸드폰 번호 받기",
                "input": [
                    {
                        "regexp": "^\\d{3}-\\d{3,4}-\\d{4}$"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "핸드폰 번호를 인증번호를 보냈습니다. \n인증번호를 입력해주세요."
                    }
                ],
                "actionOutput": {
                    "kind": "Action",
                    "type": "",
                    "dialog": ""
                },
                "id": "default11",
                "children": [
                    {
                        "name": "인증번호 확인",
                        "input": [
                            {
                                "types": [
                                    "checkCode"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "인증이 완료되었습니다."
                            }
                        ],
                        "actionOutput": {
                            "kind": "Action",
                            "type": "",
                            "dialog": ""
                        },
                        "id": "default12"
                    }
                ]
            },
            {
                "name": "핸드폰재질의",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "repeat": 1,
                        "options": "핸드폰 번호를 잘못 입력하셨습니다. 다시 입력해주세요."
                    }
                ],
                "id": "default15"
            }
        ]
    },
    {
        "name": "크롤링",
        "input": [
            {
                "text": "크롤 링"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "크롤링 결과입니다.\n\n+crawlingResult+"
            }
        ],
        "id": "default13",
        "children": [],
        "task": {
            "name": "crawling"
        }
    },
    {
        "name": "네이버",
        "input": [
            {
                "text": "네이버"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "네이버입니다.\n#movieData.items#\n+index+. +title+\n\n#",
                "buttons": [],
                "uploader": {
                    "url": "/api/lecture_jun/dialog-graphs/uploadImage",
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
        "task": {
            "name": "naverMovieSearch"
        },
        "id": "default14"
    },
    {
        "name": "리턴콜테스트",
        "input": [
            {
                "text": "테스트"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "테스트",
                "type": ""
            }
        ],
        "id": "default19",
        "children": [
            {
                "name": "리턴콜_",
                "input": [
                    {
                        "text": "리턴 콜"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "returnCall": "상의",
                        "options": {
                            "output": "리턴콜"
                        }
                    }
                ],
                "id": "default20"
            }
        ]
    }
];















































var commonDialogs = [
    {
        "id": "defaultcommon0",
        "filename": "defaultcommon",
        "name": "0. 시작",
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
                "text": "안녕하세요. 플레이 아웃도어 안내봇입니다. \n매일 아웃도어 관련 정보를 하나씩 알려드릴께요!\n원하시는 메뉴를 선택하세요.",
                "buttons": [
                    {
                        "url": "",
                        "text": "플레이 아웃도어에 대해 소개해주세요"
                    },
                    {
                        "url": "",
                        "text": "요새 트렌디한 아웃도어가 뭐죠?"
                    },
                    {
                        "url": "",
                        "text": "챗봇은 어떻게 만드나요?"
                    }
                ]
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
        "id": "noanswer",
        "filename": "defaultcommon",
        "name": "답변없음",
        "input": "",
        "output": "알아듣지 못했습니다."
    }
];















































var _bot = require(require('path').resolve("./engine/bot.js")).getBot('lecture_jun');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
