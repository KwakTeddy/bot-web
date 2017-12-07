


var dialogs = [
    {
        "name": "시술안내",
        "id": "default5",
        "filename": "default",
        "input": [
            {
                "text": "안내"
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
            },
            {
                "name": "미완처리",
                "id": "default17",
                "filename": "default",
                "input": [
                    {
                        "regexp": "(.*) (.*)"
                    }
                ],
                "output": [
                    {
                        "text": "아직 \"+1+\"에 관한 데이터가 없습니다.",
                        "kind": "Text"
                    }
                ],
                "task": {
                    "name": "addButton"
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
            }
        ],
        "output": [
            {
                "text": "<+hospitalName+>\n\n+introduce+\n\n- 전화번호 : +phone+\n- 주소 : +address+\n- 진료시간 : +startTime+ ~ +endTime+\n- 휴일 : +holiday+",
                "kind": "Text"
            }
        ],
        "task": {
            "name": "mapButton"
        }
    },
    // {
    //     "id": "default0",
    //     "filename": "default",
    //     "input": [
    //         {
    //             "text": "예약"
    //         }
    //     ],
    //     "output": [
    //         {
    //             "kind": "Action",
    //             "call": "예약안내"
    //         }
    //     ],
    //     "name": "예약하기",
    //     "children": [
    //         {
    //             "name": "예약안내",
    //             "id": "default3",
    //             "filename": "default",
    //             "input": [
    //                 {
    //                     "if": "false"
    //                 }
    //             ],
    //             "output": [
    //                 {
    //                     "text": "<+hospitalName+>는 전화로 진료예약을 받고 있습니다.\n지금 바로 전화주세요!\n\n전화하기 -> +phone+",
    //                     "kind": "Text"
    //                 }
    //             ],
    //             "task": {
    //                 "name": "addButton"
    //             },
    //             "buttons": []
    //         },
    //         {
    //             "name": "예약하기2",
    //             "id": "default4",
    //             "filename": "default",
    //             "input": [
    //                 {
    //                     "text": "1"
    //                 }
    //             ],
    //             "output": [
    //                 {
    //                     "text": "ㅁㄴㅇㄹ",
    //                     "kind": "Text"
    //                 }
    //             ]
    //         }
    //     ]
    // },
    {
        "name": "시술후기",
        "id": "default10",
        "filename": "default",
        "input": [
            {
                "text": "후기"
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
                        "text": "[ +surgeListType.name+ ] 시술후기\n\n+surgeListType.description+",
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
                    "name": "reviewButtonImage"
                }
            },
            {
                "name": "미완처리2",
                "id": "default18",
                "filename": "default",
                "input": [
                    {
                        "regexp": "(.*) (.*)"
                    }
                ],
                "output": [
                    {
                        "text": "아직 \"+1+\"에 관한 후기가 없습니다.",
                        "kind": "Text"
                    }
                ],
                "task": {
                    "name": "addButton"
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
            }
        ],
        "output": [
            {
                "kind": "Action",
                "if": "!context.bot.events",
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
                        "text": "<+eventListType.name+>\n\n+eventListType.description+",
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
                "text": "시술안내"
            },
            {
                "text": "병원정보"
            },
            {
                "text": "예약하기"
            },
            {
                "text": "시술후기 before&after"
            },
            {
                "text": "★이벤트★"
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
        "output": "알아듣지 못했습니다"
    }
];



var _bot = require(require('path').resolve("engine/bot")).getTemplateBot('hospital');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
