var dialogs = [
    {
        "name": "시술안내",
        "id": "default5",
        "filename": "default",
        "input": [
            {
                "text": "안내"
            },
            {
                "regexp": "^1$"
            }
        ],
        "output": [
            {
                "text": "<+hospitalName+>에서는 전문성과 젊은 감각을 모두 갖춘 시술들만을 진행하고 있습니다.\n\n▼아래 목록에서 자세한 시술내용을 확인해보세요.▼",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "필러",
                "id": "default7",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "surgeListType"
                        ]
                    }
                ],
                "output": [
                    {
                        "text": "[ +surgeListType.name+ ]\n\n효능 : +surgeListType.description+\n비용 : +surgeListType.price+원\n회복기간 : +surgeListType.recovery+",
                        "kind": "Text"
                    }
                ],
                "children": [
                    {
                        "name": "안내바로예약",
                        "id": "default13",
                        "filename": "default",
                        "input": [
                            {
                                "text": "예약"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "call": "예약하기"
                            }
                        ]
                    },
                    {
                        "name": "후기바로가기",
                        "id": "default14",
                        "filename": "default",
                        "input": [
                            {
                                "text": "후기"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "call": "후기"
                            }
                        ]
                    }
                ],
                "task": {
                    "name": "surgeImageButton"
                }
            }
        ],
        "task": {
            "name": "makeSurgeList"
        }
    },
    {
        "name": "병원정보",
        "id": "default8",
        "filename": "default",
        "input": [
            {
                "text": "병원"
            },
            {
                "text": "정보"
            },
            {
                "regexp": "^2$"
            }
        ],
        "output": [
            {
                "text": "<+hospitalName+>\n\n+greeting+\n\n- 전화번호 : +phone+\n- 주소 : +location+\n- 진료시간 : +startTime+ ~ +endTime+\n- 휴일 : +holiday+",
                "kind": "Text"
            }
        ],
        "task": {
            "name": "mapButton"
        }
    },
    {
        "name": "New Dialog1",
        "input": [
            {
                "types": [
                    "orderble"
                ]
            }
        ],
        "task": "chooseSurge",
        "output": [
            {
                "kind": "Action",
                "call": "후기",
                "if": "context.dialog.review"
            },
            {
                "kind": "Action",
                "call": "필러"
            }
        ],
        "id": "hospital0"
    },
    {
        "name": "시술후기",
        "id": "default10",
        "filename": "default",
        "input": [
            {
                "text": "후기"
            },
            {
                "regexp": "^4$"
            }
        ],
        "output": [
            {
                "text": "만족도 100%의 시술후기들! \n\n<+hospitalName+>의 다양한 시술을 이용하신 여러 고객분들의 달라진 before&after 를 보여드리겠습니다.여러분도 망설이지 마세요!\n\n▼아래 목록에서 시술 후기를 선택하세요.▼",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "후기",
                "id": "default11",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "surgeListType"
                        ]
                    }
                ],
                "output": [
                    {
                        "text": "[ +surgeListType.name+ ] 시술후기\n\n+surgeListType.review+",
                        "kind": "Text"
                    }
                ],
                "children": [
                    {
                        "name": "후기바로예약",
                        "id": "default12",
                        "filename": "default",
                        "input": [
                            {
                                "text": "예약"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "call": "예약하기"
                            }
                        ]
                    },
                    {
                        "name": "정보바로가기",
                        "id": "default15",
                        "filename": "default",
                        "input": [
                            {
                                "text": "정보"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "call": "필러"
                            }
                        ]
                    }
                ],
                "task": {
                    "name": "reviewButtonImage2"
                }
            }
        ],
        "task": {
            "name": "makeSurgeList"
        }
    },
    {
        "name": "이벤트",
        "id": "default9",
        "filename": "default",
        "input": [
            {
                "text": "이벤트"
            },
            {
                "regexp": "^5$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "if": "context.bot.events.length==0",
                "call": "이벤트 없음"
            },
            {
                "kind": "Action",
                "if": "context.bot.events.length==1",
                "call": "이벤트 한개"
            },
            {
                "kind": "Action",
                "call": "이벤트 여러개"
            }
        ],
        "task": {
            "name": "makeEvent"
        }
    },
    {
        "name": "이벤트 없음",
        "id": "default19",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "현재는 진행중인 이벤트가 없습니다.\n\n다음에 확인해주세요!",
                "kind": "Text"
            }
        ],
        "task": {
            "name": "addButton"
        }
    },
    {
        "name": "이벤트 한개",
        "id": "default20",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "이벤트 선택"
            }
        ],
        "task": {
            "name": "selectOneEvent"
        }
    },
    {
        "name": "이벤트 여러개",
        "id": "default21",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "<+hospitalName+> 에서 다음 이벤트들을 진행중입니다. 번호를 눌러 내용을 확인하세요!",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "이벤트 선택",
                "id": "default22",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "eventListType"
                        ]
                    }
                ],
                "output": [
                    {
                        "text": "<+eventListType.name+>\n\n+eventListType.description+\n+eventListType.period+",
                        "kind": "Text"
                    }
                ],
                "task": {
                    "name": "addEventImage"
                }
            }
        ],
        "task": {
            "name": "addEventButton"
        }
    }
];




var commonDialogs = [
    {
        "id": "defaultcommon0",
        "filename": "defaultcommon",
        "name": "시작",
        "input": [
            {
                "text": "시작"
            },
            {
                "text": "처음"
            }
        ],
        "output": [
            {
                "text": "안녕하세요 <+hospitalName+> 입니다.\n \n+greeting+\n\n아래에서 궁금하신 내용을 선택해주세요~",
                "kind": "Text"
            }
        ],
        "buttons": [
            {
                "text": "1. 시술안내"
            },
            {
                "text": "2. 병원정보"
            },
            {
                "text": "3. 예약하기"
            },
            {
                "text": "4. 시술후기 before&after"
            },
            {
                "text": "5. ★이벤트★"
            }
        ],
        "task": {
            "name": "startTask"
        }
    },
    {
        "id": "defaultcommon1",
        "filename": "defaultcommon",
        "name": "상위",
        "input": [
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
        "input": "",
        "output": "죄송해요 알아듣지 못했습니다ㅜㅜ 필요하신 내용은 바로 전화로 문의하실 수 있어요!\n\n+hospitalName+) +phone+",
        "task": {
            "name": "addButton"
        }
    }
];






var _bot = require(require('path').resolve("engine/bot")).getTemplateBot('hospital');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);