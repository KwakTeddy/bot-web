var path = require('path');
var type = require(path.resolve('./engine/bot/action/common/type'));
//var start = require(path.resolve('./engine/bot/common/start'));
// var start = require('./start');


var dialogs = [
    {
        "id": "restaurant0",
        "filename": "restaurants",
        "name": "전화번호",
        "input": [
            "전화",
            "전화번호"
        ],
        "output": "전화번호는 +phone+ 입니다."
    },
    {
        "id": "restaurant97",
        "filename": "restaurants",
        "name": "주차",
        "input": [
            "주차",
            "주차장",
            "주차정보"
        ],
        "task": "inforpark",
        "output": [
            {
                "if": "context.dialog.parkno==undefined",
                "output": "아직 주차정보를 등록하지 않았습니다."
            },
            {
                "if": "context.dialog.parkno===1",
                "output": "아직 주차장를 이용하실 수 없습니다."
            },
            {
                "if": "context.dialog.parkno===0",
                "output": "[주차 정보]\n- 주차장 이름: +parkname+\n- 주차장 자리수: +parksize+\n- 주차장 소개: +parkdetails+\n-주차장 위치: +parkaddress+\n\n처음으로 가려면 \"시작\"이라고 입력해주세요."
            }
        ]
    },
    {
        "id": "restaurant90",
        "filename": "restaurants",
        "name": "인기메뉴",
        "input": [
            "인기메뉴",
            "인기",
            "인기메뉴정보"
        ],
        "task": "categoryrestaurantlist",
        "output": [
            {
                "if": "context.dialog.restaurantno===undefined",
                "ouput": "아직 인기 정보를 등록하지 않았습니다.",
                "task": "categoryrestaurantlist"
            },
            {
                "if": "context.dialog.restaurantno===1",
                "ouput": "아직 인기 정보가 없습니다.",
                "task": "categoryrestaurantlist"
            },
            {
                "if": "context.dialog.restaurantno===0",
                "output": "[인기메뉴판]\n#categorys#+index+.+name+\n#\n\n번호를 선택해주세요.",
                "task": "categoryrestaurantlist",
                "children": [
                    {
                        "filename": "restaurants",
                        "input": {
                            "types": [
                                {
                                    "name": "category",
                                    "listName": "categorys",
                                    "typeCheck": "listTypeCheck"
                                }
                            ]
                        },
                        "task":"categoryrestaurantlistisornot",
                        "output": [
                            {
                                "if": "context.dialog.menuprice===0",
                                "output": "정보가 등록되지 않았습니다."
                            },
                            {
                                "if": "context.dialog.menuprice===1",
                                'task':"menuImageTask1",
                                "output": "#menucategory#[+name+] +price+원\n+description+#\n\n처음으로 가려면 \"시작\"이라고 입력해주세요."
                            }
                        ]
                    },
                    {
                        "id": "restaurant94",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "output": {
                            "repeat": 1,
                            "options": {
                                "postfix": "\n처음으로 가려면 \"시작\"이라고 입력해주세요."
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": "restaurant1",
        "filename": "restaurants",
        "name": "위치",
        "input": [
            "위치",
            "찾아가다",
            "어떻다 가다",
            "가다 방법",
            "주소",
            "어디"
        ],
        "task": "mapButton",
        "output": "저희 매장의 주소는\n+address+\n입니다."
    },
    {
        "id": "restaurant8",
        "filename": "restaurants",
        "name": "이벤트",
        "input": [
            "세일",
            "행사",
            "이벤트"
        ],
        "task": "eventCategoryAction",
        "output": [
            {
                "if": "context.dialog.events == undefined || context.dialog.events.length == 0",
                "output": "아직 이벤트 정보를 등록하지 않았습니다.",
                "task": "eventCategoryAction"
            },
            {
                "if": "context.dialog.events.length > 0",
                "output": "[이벤트]\n#events#+index+. +name+\n#번호를 선택해주세요.",
                "task": "eventCategoryAction",
                "children": [
                    {
                        "id": "restaurant4",
                        "filename": "restaurants",
                        "input": [
                            {
                                "types": [
                                    "eventlistType"
                                ]
                            }
                        ],
                        "task": "eventAction",
                        "output":[
                            {
                            "text": "#eventss#[+name+]\n+description+\n+date+\n\n처음으로 가려면 \"시작\"이라고 입력해주세요.",
                            "kind": "Text"
                        }
                        ]
                    },
                    {
                        "id": "restaurant5",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "output": {
                            "repeat": 1,
                            "options": {
                                "postfix": "\n처음으로 가려면\n \"시작\"이라고 입력해주세요."
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": "restaurant15",
        "filename": "restaurants",
        "name": "시설",
        "input": [
            "시설",
            "장비",
            "기구",
            "매장 사진"
        ],
        "task": "previewCategoryAction",
        "output": [
            {
                "if": "context.dialog.categorys == undefined",
                "output": "아직 시설 정보를 등록하지 않았습니다.",
                "task": "previewCategoryAction"
            },
            {
                "if": "context.dialog.categorys.length>0 && context.dialog.categoryisone==0",
                "output": "[시설정보]\n#previewcategorylength#+index+. +category+\n#번호를 선택해주세요.",
                "task": "previewCategoryAction",
                "children": [
                    {
                        "id": "restaurant11",
                        "filename": "restaurants",
                        "input": [
                            {
                                "types": [
                                    "previewlistType"
                                ]
                            }
                        ],
                        "task": "previewAction",
                        "output": "[+previewlistType.category+]\n#previews#+index+. +name+\n#\n번호나 메뉴명을 입력해주세요.",
                        "children": [
                            {
                                "id": "restaurant9",
                                "filename": "restaurants",
                                "input": [
                                    {
                                        "types": [
                                            "previewmenulistType"
                                        ]
                                    }
                                ],
                                "task": "menuDetailTask",
                                "output": "[+previewmenulistType.name+]\n+previewmenulistType.description+\n\n처음으로 가려면\n \"시작\"이라고 입력해주세요."
                            },
                            {
                                "id": "restaurant10",
                                "filename": "restaurants",
                                "input": {
                                    "if": "true"
                                },
                                "output": {
                                    "repeat": 1,
                                    "options": {
                                        "postfix": "\n처음으로 가려면\n \"시작\"이라고 입력해주세요."
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "id": "restaurant12",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "output": {
                            "repeat": 1,
                            "options": {
                                "postfix": "\n처음으로 가려면\n \"시작\"이라고 입력해주세요."
                            }
                        }
                    }
                ]
            },
            {
                "if": "context.dialog.categorys.length>0 && context.dialog.categoryisone==1",
                "output": "[+previewcategorylength+]\n#menuss#+index+.+name+\n#\n번호나 메뉴명을 입력해주세요.",
                "task": "previewCategoryAction",
                "children": [
                    {
                        "id": "restaurant333",
                        "filename": "restaurants",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "task": "menuisornot",
                        "output": [
                            {
                                "if": "context.dialog.menuis == 1",
                                "output": "#categorymenu#[+name+] +price+원# +hot+\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
                            },
                            {
                                "if": "context.dialog.menuis == 0",
                                "output": {
                                    "repeat": 1,
                                    "options": {
                                        "postfix": "\n처음으로 가려면\n \"시작\"이라고 입력해주세요."
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": "restaurant22",
        "filename": "restaurants",
        "name": "서비스",
        "input": [
            "무엇 서비스",
            "서비스 알리다",
            "서비스",
            "메뉴",
            "메뉴판",
            "메뉴 알리다",
            "메뉴 뭐",
            "가격",
            "가격표",
            "얼마",
            "비용"
        ],
        "task": "menuCategoryAction",
        "output": [
            // {
            //     "if": "context.dialog.restaurantno == undefined && (context.bot.menuImage == undefined || context.bot.menuImage == \"\")",
            //     "output": "아직 메뉴를 등록하지 않았습니다."
            // },
            {
                "if": "context.dialog.restaurantno == 1 && context.bot.image != undefined",
                "task": "menuImageTask",
                "output": "[메뉴판보기]"
            },
            {
                "if": "context.dialog.restaurantno== 0 && context.dialog.categoryisone==0",
                "output": "[가격표]\n#categorylength#+index+.+category+\n#번호를 선택해주세요.",
                "task": "menuCategoryAction",
                "children": [
                    {
                        "id": "restaurant18",
                        "filename": "restaurants",
                        "input": {
                            "types": [
                                {
                                    "name": "category",
                                    "listName": "categorylength",
                                    "typeCheck": "listTypeCheck"
                                }
                            ]
                        },
                        "task": "categorymenu",
                        "output": "[+categoryss+]\n #categorymenus#+index+. +name+\n#\n번호나 메뉴명을 입력해주세요.",
                        "children": [
                            {
                                "id": "restaurant16",
                                "filename": "restaurants",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "task": "categorymenuisornot",
                                "output": [
                                    {
                                        "if": "context.dialog.menuis == 1",
                                        "task": "menuimagedisplay",
                                        "output": "#categorymenu#[+name+] +price+원 #+hot+#categorymenu#\n+description+#\n\n처음으로 가려면 \"시작\"이라고 입력해주세요."
                                    },
                                    {
                                        "if": "context.dialog.menuis == 0",
                                        "output": {
                                            "repeat": 1,
                                            "options": {
                                                "postfix": "\n처음으로 가려면 \"시작\"이라고 입력해주세요."
                                            }
                                        },
                                        "task": "categorymenuisornot"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": "restaurant19",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "output": {
                            "repeat": 1,
                            "options": {
                                "postfix": "\n처음으로 가려면\n \"시작\"이라고 입력해주세요."
                            }
                        }
                    }
                ]
            },
            {
                "if": "context.dialog.restaurantno==0 && context.dialog.categoryisone==1",
                "output": "[#categorys#+name+#]\n#menus#+index+.+name+\n#\n번호나 메뉴명을 입력해주세요.",
                "children": [
                    {
                        "id": "restaurant20",
                        "filename": "restaurants",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "task": "menuisornot",
                        "output": [
                            {
                                "if": "context.dialog.menuis == 1",
                                "output": "#categorymenu#[+name+] +price+원# +hot+#categorymenu#\n+description+#\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
                            },
                            {
                                "if": "context.dialog.menuis == 0",
                                "output": {
                                    "repeat": 1,
                                    "options": {
                                        "postfix": "\n처음으로 가려면\n \"시작\"이라고 입력해주세요."
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": "restaurant95",
        "filename": "restaurants",
        "name": "추천",
        "input": [
            "있어",
            "있다",
            "~있나",
            "~메뉴 있나",
            "~메뉴 있다"
        ],
        "task": "categoryrestaurantisornot",
        "output": [
            {
                "if": "context.dialog.menuis===0",
                "output": "정보가 등록되지 않았습니다."
            },
            {
                "if": "context.dialog.menuis===1",
                'task':"menuImageTask2",
                "output": "찾으시는 메뉴가 아래와 같이 있습니다.\n\n#menumatch#+index+.[+name+] +price+원\n+description+#\n\n처음으로 가려면 \"시작\"이라고 입력해주세요."
            },
            {
                "if":"context.dialog.categoryis===1",
                "output": "찾으시는 메뉴가 아래와 같이 있습니다.\n\n#categorymatchmenu#+index+.[+name+] +price+원\n#\n\n번호를 선택해주세요.",
                "children": [
                    {
                        "id": "restaurant188",
                        "filename": "restaurants",
                        "input": {
                            regex:/\d/
                        },
                        "task": "menuImageTask3",
                        "output": "#categorymenu#+index+.[+name+] +price+원\n+description+#\n\n처음으로 가려면 \"시작\"이라고 입력해주세요."
                    },
                    {
                        "id": "restaurant187",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "output": {
                            "repeat": 1,
                            "options": {
                                "postfix": "\n처음으로 가려면\n \"시작\"이라고 입력해주세요."
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": "restaurant23",
        "filename": "restaurants",
        "name": "날짜체크",
        "input": {
            "types": [
                {
                    "name": "date",
                    "typeCheck": "dateTypeCheck",
                    "raw": true
                }
            ],
            "regexp": /~영업/
        },
        "task": "checkDate",
        "output": [
            {
                "if": "context.dialog.check == true",
                "output": "죄송합니다. 해당 일자는 영업일이 아닙니다.\n영업시간은 +startTime+부터\n+endTime+까지이며,\n+holiday+은 휴무입니다."
            },
            {
                "if": "context.dialog.check == false && context.bot.holiday !== '휴일없음'&& context.bot.holiday !== '휴일 없어' && context.bot.holiday !== '없다' && context.bot.holiday !== '365일 영업'",
                "output": "네 영업일입니다.\n영업시간은 +startTime+부터\n+endTime+까지이며,\n+holiday+은 휴무입니다.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
            },
            {
                "if": "context.dialog.check == false && (context.bot.holiday == '휴일없음' || context.bot.holiday == '휴일 없어' || context.bot.holiday == '없다' || context.bot.holiday == '365일 영업')",
                "output": "네 영업일입니다.\n영업시간은 +startTime+부터\n+endTime+까지이며,\n휴무일은 없습니다.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
            }
        ]
    },
    {
        "id": "restaurant24",
        "filename": "restaurants",
        "name": "시간체크",
        "input": {
            "types": [
                {
                    "name": "time",
                    "typeCheck": "timeTypeCheck",
                    "raw": true
                }
            ],
            "regexp": /~영업/
        },
        "task": "checkTime",
        "output": [
            {
                "if": "context.dialog.check == 're'",
                "output": "오후 / 오전을 붙여서 이야기 해주세요.\n예시: 오후 2시 영업해?, 14시 영업해?"
            },
            {
                "if": "context.dialog.check == false && context.bot.holiday !== '휴일없음'&& context.bot.holiday !== '휴일 없어' && context.bot.holiday !== '없다' && context.bot.holiday !== '365일 영업'",
                "output": "죄송합니다. 영업시간이 아닙니다.\n영업시간은 +startTime+부터\n+endTime+까지이며,\n+holiday+은 휴무입니다."
            },
            {
                "if": "context.dialog.check == false && (context.bot.holiday == '휴일없음' || context.bot.holiday == '휴일 없어' || context.bot.holiday == '없다' || context.bot.holiday == '365일 영업')",
                "output": "죄송합니다. 영업시간이 아닙니다.\n영업시간은 +startTime+부터\n+endTime+까지이며,\n휴무일은 없습니다."
            },
            {
                "if": "context.dialog.check == true && context.bot.holiday !== '휴일없음'&& context.bot.holiday !== '휴일 없어' && context.bot.holiday !== '없다' && context.bot.holiday !== '365일 영업'",
                "output": "네 영업시간 입니다. \n영업시간은 +startTime+부터\n+endTime+까지이며,\n+holiday+은 휴무입니다.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
            },
            {
                "if": "context.dialog.check == true && (context.bot.holiday == '휴일없음' || context.bot.holiday == '휴일 없어' || context.bot.holiday == '없다' || context.bot.holiday == '365일 영업')",
                "output": "네 영업시간 입니다. \n영업시간은 +startTime+부터\n+endTime+까지이며,\n휴무일은 없습니다.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
            }
        ]
    },
    {
        "id": "restaurant25",
        "filename": "restaurants",
        "name": "영업 시간",
        "input": [
            "영업 시간",
            "몇 시",
            "언제 끝",
            "언제 시작",
            "영업해",
            "영업",
            "몇시까지",
            "몇 시까지"
        ],
        "output": [
            {
                "if": "context.bot.holiday == '휴일없음' || context.bot.holiday == '휴일 없어' || context.bot.holiday == '없다' || context.bot.holiday == '365일 영업'",
                "output": "영업시간은 +startTime+ 에서 +endTime+ 입니다.\n 휴무일은 없습니다.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
            },
            "영업시간은 +startTime+ 에서 +endTime+ 입니다.\n+holiday+은 휴무입니다.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
        ]
    },
    {
        "id": "restaurant35",
        "filename": "restaurants",
        "name": "예약내역",
        "input": [
            "예약 취소",
            "예약 확인",
            "예약 내역"
        ],
        "task": "reserveCheck",
        "output": [
            {
                "if": "context.botUser.isOwner && context.dialog.reserves != undefined",
                "output": "미처리 예약내역입니다.\n#reserves#+index+. +name+ +dateStr+ +time+ +numOfPerson+명 [+status+]\n#\n처리할 예약번호를 말씀해주세요.",
                "task": "reserveCheck",
                "children": [
                    {
                        "id": "restaurant30",
                        "filename": "restaurants",
                        "input": {
                            "types": [
                                {
                                    "name": "reserve",
                                    "listName": "reserves",
                                    "typeCheck": "listTypeCheck"
                                }
                            ]
                        },
                        "task": "action1",
                        "output": "상세 예약내역입니다.#ordermenu#\n상태: +status+\n예약자명: +name+#\n#reserves#일시: +dateStr+##ordermenu# +time+\n인원: +numOfPerson+명\n연락처: +mobile+#\n\n\"확정\", \"취소\"를 선택해 주세요.",
                        "children": [
                            {
                                "id": "restaurant26",
                                "filename": "restaurants",
                                "input": "~확정",
                                "task": "reserveOwnerConfirm",
                                "output": {
                                    "call": "예약내역",
                                    "options": {
                                        "prefix": "예약이 확정 되었습니다. 고객님에게 문자가 발송되었습니다.\n\n"
                                    }
                                }
                            },
                            {
                                "id": "restaurant28",
                                "filename": "restaurants",
                                "input": "~취소",
                                "output": "취소 이유를 입력해주세요.",
                                "children": [
                                    {
                                        "id": "restaurant27",
                                        "filename": "restaurants",
                                        "input": {
                                            "if": "true"
                                        },
                                        "task": "reserveOwnerCancel",
                                        "output": {
                                            "call": "예약내역",
                                            "options": {
                                                "prefix": "예약이 취소 되었습니다.\n\n"
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                "id": "restaurant29",
                                "filename": "restaurants",
                                "input": {
                                    "if": "true"
                                },
                                "output": {
                                    "repeat": 1,
                                    "options": {
                                        "output": "\"확정\" 또는 \"취소\"라고 말씀해주세요."
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "id": "restaurant31",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "output": {
                            "repeat": 1,
                            "options": {
                                "prefix": "목록에서 선택해주세요.\n"
                            }
                        }
                    }
                ]
            },
            {
                "if": "context.botUser.isOwner && context.dialog.reserves == undefined",
                "output": "미처리 예약내역이 없습니다. \n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                "task": "reserveCheck"
            },
            {
                "if": "context.dialog.reserves != undefined",
                "output": "고객님의 예약 내역입니다.\n#reserves#+index+. +dateStr+ +time+ +numOfPerson+명 [+status+]\n#\n예약을 취소하시려면, 취소할 번호를 말씀해주세요.",
                "task": "reserveCheck",
                "children": [
                    {
                        "id": "restaurant32",
                        "filename": "restaurants",
                        "input": {
                            "types": [
                                {
                                    "name": "reserve",
                                    "listName": "reserves",
                                    "typeCheck": "listTypeCheck"
                                }
                            ]
                        },
                        "task": "reserveCancel",
                        "output": "예약이 취소되었습니다.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
                    },
                    {
                        "id": "restaurant33",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "output": {
                            "repeat": 1,
                            "options": {
                                "prefix": "목록에서 선택해주세요.\n"
                            }
                        }
                    }
                ]
            },
            {
                "if": "context.dialog.reserve != undefined",
                "output": "고객님의 예약 내역입니다.\n상태: +reserve.status+\n일시: +reserve.dateStr+ +reserve.time+\n인원: +reserve.numOfPerson+명\n예약자명: +reserve.name+\n연락처: +reserve.mobile+\n\n예약을 취소하시려면 \"취소\"라고 말씀해주세요.",
                "task": "reserveCheck",
                "children": [
                    {
                        "id": "restaurant34",
                        "filename": "restaurants",
                        "input": "취소",
                        "task": "reserveCancel",
                        "output": "예약이 취소되었습니다."
                    }
                ]
            },
            "고객님의 예약내역이 없습니다."
        ]
    },
    {
        "id": "restaurant57",
        "filename": "restaurants",
        "name": "예약하기",
        "input": "예약",
        "output": {
            "callChild": "날짜선택"
        },
        "children": [
            {
                "id": "restaurant39",
                "filename": "restaurants",
                "name": "날짜선택",
                "input": false,
                "output": "예약하실 일자를 말씀해 주세요.\n(ex: 2017-02-06)",
                "children": [
                    {
                        "id": "restaurant36",
                        "filename": "restaurants",
                        // "input": {
                        //     "types": [
                        //         {
                        //             "name": "date",
                        //             "typeCheck": "dateTypeCheck"
                        //         }
                        //     ]
                        // },
                        "input": [
                            {
                                "types": "dateTypeCheck"
                            }
                        ],
                        // "input": [
                        //     {
                        //         "types": [
                        //             "date"
                        //         ]
                        //     }
                        // ],
                        "task": "checkDate",
                        "output": [
                            {
                                "if": "context.dialog.check == false",
                                "output": {"callChild": "시간선택"}
                            },
                            {
                                "if": "context.dialog.check == true",
                                "output": {
                                    "call": "날짜선택",
                                    "options": {
                                        "prefix": "+holiday+휴일입니다.\n\n"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "id": "restaurant37",
                        "filename": "restaurants",
                        "input": {
                            "if": "context.dialog.날짜입력최초 == undefined"
                        },
                        "task": "action2",
                        "output": {
                            "call": "날짜선택"
                        }
                    },
                    {
                        "id": "restaurant38",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "output": [
                            {
                                "text": "날짜가 아닙니다.\n\n* 예약 진행을 계속하시려면 '이전',예약 진행을 취소하시려면 '처음' 또는 0번을 입력해주세요.",
                                "kind": "Text"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "restaurant43",
                "filename": "restaurants",
                "name": "시간선택",
                "input": false,
                "output": "예약하실 시간을 말씀해 주세요.\n(ex: 오후 4시)",
                "children": [
                    {
                        "id": "restaurant40",
                        "filename": "restaurants",
                        // "input": {
                        //     "types": [
                        //         {
                        //             "name": "time",
                        //             "typeCheck": "timeTypeCheck"
                        //         }
                        //     ]
                        // },
                        "input": [
                            {
                                "types": "timeTypeCheck"
                            }
                        ],
                        "task": "checkTime",
                        "output": [
                            {
                                "if": "context.dialog.check === false",
                                "output": {"callChild": "인원선택"}
                            },
                            {
                                "if": "context.dialog.check == 're'",
                                "output": {
                                    "call": "시간선택",
                                    "options": {
                                        "prefix": "시간은 오전/오후를 붙여서 이야기 해주세요.\n\n"
                                    }
                                }
                            },
                            {
                                "if": "context.dialog.check === true",
                               "output": {
                                    "call": "시간선택",
                                    "options": {
                                        "prefix": "영업시간은 +startTime+부터 +endTime+까지입니다.\n\n"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "id": "restaurant41",
                        "filename": "restaurants",
                        "input": {
                            "if": "context.dialog.시간입력최초 == undefined"
                        },
                        "task": "action3",
                        "output": {
                            "call": "시간선택"
                        }
                    },
                    {
                        "id": "restaurant42",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "output": [
                            {
                                "text": "시간이 아닙니다\n\n* 예약 진행을 계속하시려면 '이전',예약 진행을 취소하시려면 '처음' 또는 0번을 입력해주세요.",
                                "kind": "Text"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "restaurant47",
                "filename": "restaurants",
                "name": "인원선택",
                "input": false,
                "output": "몇명이 오실지 말씀해 주세요\n(ex: 6명)",
                "children": [
                    {
                        "id": "restaurant44",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "task":"numOfPersonTypeCheck1",
                        "output": [
                            {
                                "if": "context.dialog.numOfPersonis ==1",
                                "output": {"call": "예약자명"}
                            },
                            {
                                "if": "context.dialog.numOfPersonis ==0",
                                "output": {"call": "인원선택"}
                            }
                        ]
                    },
                    {
                        "id": "restaurant45",
                        "filename": "restaurants",
                        "input": {
                            "if": "context.dialog.인원선택최초 == undefined"
                        },
                        "task": "action4",
                        "output": {
                            "call": "인원선택"
                        }
                    },
                    {
                        "id": "restaurant46",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "output": [
                            {
                                "text": "인원수가 아닙니다.\n\n* 예약 진행을 계속하시려면 '이전',예약 진행을 취소하시려면 '시작' 또는 0번을 입력해주세요.",
                                "kind": "Text"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "restaurant49",
                "filename": "restaurants",
                "name": "예약자명",
                "input": false,
                "output": "예약하실 이름을 입력해주세요.",
                "children": [
                    {
                        "id": "restaurant48",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "task": "reserveNameTask",
                        "output": [
                            {
                                "if": "context.user.mobile == undefined",
                                "output": {
                                    "call": "휴대폰번호입력"
                                }
                            },
                            {
                                "if": "true",
                                "output": {
                                    "call": "예약내용확인"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "id": "restaurant54",
                "filename": "restaurants",
                "name": "휴대폰번호입력",
                "input": false,
                "output": "휴대폰 번호를 말씀해주세요.(01012123434)",
                "children": [
                    {
                        "id": "restaurant52",
                        "filename": "restaurants",
                        "input": [
                            {
                                "types": [
                                    "mobile"
                                ]
                            }
                        ],
                        "task": "smsAuth",
                        "output": "문자메세지(SMS)로 발송된 인증번호를 입력해주세요.",
                        "children": [
                            {
                                "id": "restaurant50",
                                "filename": "restaurants",
                                "input": {
                                    "regexp": /[\d\s]+/
                                },
                                "task": "smsAuthValid",
                                "output": [
                                    {
                                        "if": "context.dialog.matched1==true",
                                        "task": "smsAuthTask",
                                        "output": {
                                            "call": "예약내용확인"
                                        }
                                    },
                                    {
                                        "if": "context.dialog.matched1==false",
                                        "repeat": 1,
                                        "options": {
                                            "output": "인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.\n0. 이전\n1. 처음"
                                        }
                                    }
                                ]
                            },
                            {
                                "id": "restaurant51",
                                "filename": "restaurants",
                                "input": "true",
                                "output": [
                                    {
                                    "repeat": 1,
                                    "options": {
                                        "output": "인증번호가 틀렸습니다.\n\n* 예약 진행을 계속하시려면 '이전',예약 진행을 취소하시려면 '시작' 또는 0번을 입력해주세요."
                                    }
                                }
                                ]
                            }
                        ]
                    },
                    {
                        "id": "restaurant53",
                        "filename": "restaurants",
                        "input": {
                            "if": "true"
                        },
                        "output": [
                            {
                                "text": "인증번호가 틀렸습니다.\n\n* 예약 진행을 계속하시려면 '이전',예약 진행을 취소하시려면 '시작' 또는 0번을 입력해주세요.",
                                "kind": "Text"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "restaurant56",
                "filename": "restaurants",
                "name": "예약내용확인",
                "input": false,
                "task":"reserveConfirm",
                "output": "예약내용을 확인해주세요.\n일시: +dateStr+ +time+\n인원: +numOfPerson+명\n연락처: +mobile+\n다음과 같이 예약신청하시겠습니까?",
                "children": [
                    {
                        "id": "restaurant55",
                        "filename": "restaurants",
                        "input": "~네",
                        "task": "reserveRequest",
                        "output": "예약을 요청하였습니다.\n\n아직 확정이 아닙니다.\n좌석 확인 후 예약완료 문자를 보내 드리겠습니다.\n\n처음으로 가려면 \"시작\"이라고 입력해주세요."
                    }
                ]
            }
        ]
    },
    {
        "id": "restaurant58",
        "filename": "restaurants",
        "input": "안녕",
        "output": "안녕하세요."
    },
    {
        "id": "restaurant96",
        "filename": "restaurants",
        "input": {
            "if": "true"
        },
        "output": "죄송합니다.고객님이 입력하셨던 정보가 등록되지 않았습니다.\n\n처음으로 가려면 \"시작\"이라고 입력해주세요."
    }
];

var commonDialogs = [
    {
        "id": "restaurantcommon0",
        "filename": "restaurantcommon",
        "name": "시작",
        "input": [
            {
                "text": "처음"
            },
            {
                "regexp":"^0$"
            },
            {
                "regexp":"^시작$"
            }
        ],
        "task": "startTask",
        "output": [
            {
                "if": "context.botUser.isOwner",
                "output": {
                    "call": "예약내역",
                    "options": {
                        "prefix": "<+name+> 인공지능 챗봇입니다.\n사장님께서 접속 하였습니다.\n\n"
                    }
                }
            },
            "<+name+> 인공지능 챗봇입니다.\n문의할 내용을 말씀해주세요.\n\n예시)\n위치,  영업시간,  메뉴(메뉴,인기메뉴)\n주차,  매장사진,  이벤트\n예약확인,  예약취소\n내일 저녁 7시에 4명 예약"
        ]
    },
    {
        "id": "restaurantcommon1",
        "filename": "restaurantcommon",
        "name": "답변없음",
        "input": "",
        "output": "불편을 끼쳐드려 죄송합니다. 현재 고객님께서 무슨 말씀을 하시는지 이해를 못하였습니다.\n 매장으로 전화하여 안내받으시겠습니까?",
        "children": [
            {
                "id": "restaurantcommon2",
                "filename": "restaurantcommon",
                "input": "~네",
                "output": "매장 전화번호는 +phone+ 입니다."
            },
            {
                "id": "restaurantcommon3",
                "filename": "restaurantcommon",
                "input": "~아니요",
                "output": "<+name+>에서는 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다."
            }
        ]
    },
    {
        "name": "이전",
        "id": "restaurantcommon4",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp":"^이전$"
            },
            {
                "regexp":"^상위$"
            }
        ],
        "output": {
            "up": 1
        }
    },
    {
        "name": "전화번호common",
        "id": "restaurantcommon5",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp": "전화[번]?[호]?"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "전화번호"
            }
        ]
    },
    {
        "name": "주차common",
        "id": "restaurantcommon6",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp": "주차[장]?[정]?[보]?"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "주차"
            }
        ]
    },
    {
        "name": "인기메뉴common",
        "id": "restaurantcommon7",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp": "인기[메]?[뉴]?"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "인기메뉴"
            }
        ]
    },
    {
        "name": "위치common",
        "id": "restaurantcommon8",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp": "^위치[정]?[보]?"
            },
            {
                "regexp": "^주소[정]?[보]?"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "위치"
            }
        ]
    },
    {
        "name": "이벤트common",
        "id": "restaurantcommon9",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp": "이벤트[정]?[보]?"
            },
            {
                "regexp": "행사[정]?[보]?"
            },
            {
                "regexp": "세일[정]?[보]?"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "이벤트"
            }
        ]
    },
    {
        "name": "시설common",
        "id": "restaurantcommon10",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp": "시설[정]?[보]?"
            },
            {
                "regexp": "장비[정]?[보]?"
            },
            {
                "regexp": "기구[정]?[보]?"
            },
            {
                "regexp": "매장[정]?[보]?"
            },
            {
                "regexp": "매장[ ]?사진[정]?[보]?"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "시설"
            }
        ]
    },
    {
        "name": "서비스common",
        "id": "restaurantcommon11",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp": "서비스[정]?[보]?"
            },
            {
                "regexp": "^메뉴[판]?[정]?[보]?"
            },
            {
                "regexp": "가격[정]?[보]?"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "서비스"
            }
        ]
    },
    {
        "name": "추천common",
        "id": "restaurantcommon12",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp": "메뉴있[다]?$"
            },
            {
                "regexp": "메뉴있[어]?[요]?$"
            },
            {
                "regexp": "있어[요]?$"
            },
            {
                "regexp": "있다$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "추천"
            }
        ]
    },
    {
        "name": "영업 시간common",
        "id": "restaurantcommon13",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp": "영업[하]?[다]?$"
            },
            {
                "regexp": "영업[하]?[나]?[요]?$"
            },
            {
                "regexp": "영업[시]?[가]?"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "영업 시간"
            }
        ]
    },
    {
        "name": "예약내역common",
        "id": "restaurantcommon14",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp": "예약[ ]?취소"
            },
            {
                "regexp": "예약[ ]?확인"
            },
            {
                "regexp": "예약[ ]?내역"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "예약내역"
            }
        ]
    },
    {
        "name": "예약하기common",
        "id": "restaurantcommon15",
        "filename": "restaurantcommon",
        "input": [
            {
                "regexp": "^예약$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "날짜선택"
            }
        ]
    }

];


var _bot = require(require('path').resolve("engine/bot")).getTemplateBot('restaurant');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
