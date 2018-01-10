
var path = require('path');

var dialogs = [
	{
		"name": "빠른예약",
		"id": "default29",
		"filename": "default",
		"input": ["내일 예약","삐른예약", "빨리 예약"],
		"output": [
            {
                "if":"context.dialog.roomno===undefined",
                "text":"아직 객실 정보를 등록하지 않았습니다.",
                "kind": "Text"
            },
            {   "if":"context.dialog.roomno===0",
                "kind": "Action",
                "options":
                    {
                        "output": "[객실예약 진행상황]\n객실 예약 진행 정보\n\n- 체크인 일자 : +myyear+년+mymonth+월+myday+일\n\n\n객실 종류를 선택해주세요.\n#categoryroom#+index+.+category_name+\n#"
                    },
                "call": "빠른예약1"
            }
		],
		"task": "categoryroomlist"
	},
	{
		"name": "예약 정보 확인",
		"id": "default106",
		"filename": "default",
		"input": [
			{
				"text": "예약 정보"
			},
			{
				"text": "예약 확인"
			},
			{
				"text": "예약 확인해"
			},
			{
				"text": "예약했"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "예약 확인"
			}
		]
	},
	{
		"name": "예약 취소 확인",
		"id": "default107",
		"filename": "default",
		"input": [
			{
				"text": "예약 취소"
			},
			{
				"text": "취소"
			},
            {
                "text": "9"
            }
		],
		"output": [
			{
				"kind": "Action",
				"call": "예약 취소 선택"
			}
		]
	},
	{
		"name": "바로 예약",
		"id": "default73",
		"filename": "default",
		"input": [
			{
				"text": "예약해"
			},
			{
				"text": "바로 예약"
			},
            {
                "text": "삐른 예약"
            }
		],
		"output": [
			{
				"text": "[바로 예약하기]\n아래 좋아하는 방식을 선택하세요.",
				"buttons": [
					{
						"text": "1.바로 내일 예약"
					},
					{
						"text": "2.체크인 날짜를 스스로 정하는 예약"
					}
				],
				"kind": "Content"
			}
		],
		"children": [
			{
				"name": "1.바로 내일 예약",
				"id": "default74",
				"filename": "default",
				"input": [
					{
						"text": "1"
					},
					{
						"text": "바로 내일 예약"
					},
					{
						"text": "1 . 바로 내일 예약"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "빠른예약"
					}
				]
			},
			{
				"name": "2.체크인 날짜를 스스로 정하는 예약",
				"id": "default75",
				"filename": "default",
				"input": [
					{
						"text": "2"
					},
					{
						"text": "2 . 체크 날짜 스스로 정하는 예약"
					},
					{
						"text": "체크 날짜 스스로 정하는 예약"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "객실 예약"
					}
				]
			}
		],
		"buttons": [
			{
				"text": "1.바로 내일 예약"
			},
			{
				"text": "2.체크인 날짜를 스스로 정하는 예약"
			}
		]
	},
    {
        "name":"빠른예약(체크인날짜,인원수,투숙 기간,객실명,예약)",
        "id": "default118",
        "filename": "default",
        "input": ["예약","8"],
        "output": [
            {
                "if":"context.dialog.roomno===undefined",
                "text":"아직 객실 정보를 등록하지 않았습니다.\n\n* 처음으로 가시려면 '처음' 또는 0번을 입력해주세요.",
                "kind": "Text"
            },
            {
                "if":"context.dialog.roomno===0",
                "kind": "Action",
                "callChild": "체크인날짜"
            }
        ],
        "task":"categoryroomlist"
    },
    {
        "id": "default119",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "체크인 하실 날짜를 말씀해주세요.\n(ex: 20170125)",
                "kind": "Text"
            }
        ],
        "name": "체크인날짜",
        "children": [
            {
                "name": "체크인날짜1",
                "id": "default120",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "isDateIn"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "callChild": "인원수"
                    }
                ]
            },
            {
                "name": "체크인날짜2",
                "id": "default121",
                "filename": "default",
                "input": [
                    {
                        "if": "context.dialog.inputyear === undefined && context.dialog.inputmonth === undefined && context.dialog.inputday === undefined"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "체크인날짜"
                    }
                ]
            },
            {
                "name": "체크인날짜3",
                "id": "default122",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "날짜가 아닙니다.\n다시 체크인 하실 날짜를 말씀해주세요.\n(ex: 20170125)"
                        },
                        "call": "체크인날짜"
                    }
                ]
            }
        ]
    },
    {
        "id": "default123",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "인원수가 어떻게 되나요?\n알려주세요.(ex: 5명)",
                "kind": "Text"
            }
        ],
        "name": "인원수",
        "children": [
            {
                "name": "인원수1",
                "id": "default124",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "peoplenumbertype"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "callChild": "투숙 기간"
                    }
                ]
            },
            {
                "name": "인원수2",
                "id": "default125",
                "filename": "default",
                "input": [
                    {
                        "if": "context.dialog.peoplenumber === undefined"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "인원수"
                    }
                ]
            },
            {
                "name": "인원수3",
                "id": "default126",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "인원수가 아닙니다.\n다시 인원수를 말씀해주세요.(ex: 5명)"
                        },
                        "call": "인원수"
                    }
                ]
            }
        ]
    },
    {
        "id": "default127",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "투숙 기간이 어떻게 되나요?\n알려주세요.(ex: 3박4일)",
                "kind": "Text"
            }
        ],
        "name": "투숙 기간",
        "children": [
            {
                "name": "투숙 기간1",
                "id": "default128",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "daynumbertype"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "callChild": "객실선택"
                    }
                ],
                "task": "dateoutcheck"
            },
            {
                "name": "투숙 기간2",
                "id": "default129",
                "filename": "default",
                "input": [
                    {
                        "if": "context.dialog.outyear === undefined && context.dialog.outmonth === undefined && context.dialog.outday === undefined"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "투숙 기간"
                    }
                ]
            },
            {
                "name": "투숙 기간3",
                "id": "default130",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "투숙 기간이 아닙니다.\n다시 투숙 기간을 말씀해주세요.(ex: 3박4일)"
                        },
                        "call": "투숙 기간"
                    }
                ]
            }
        ]
    },
    {
        "name": "객실선택",
        "id": "default131",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "객실 종류를 선택해주세요.\n#categoryroom#+index+.+category_name+\n#",
                "kind": "Text"
            }
        ],
        "task": "categoryroomlist",
        "children": [
            {
                "name": "객실선택1",
                "id": "default132",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "categoryroomisornot"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "예약자 이름 입력"
                    }
                ]
            },
            {
                "name": "객실선택2",
                "id": "default133",
                "filename": "default",
                "input": [
                    {
                        "if": "context.dialog.menumatch===undefined"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "객실선택"
                    }
                ]
            },
            {
                "name": "객실선택3",
                "id": "default134",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "객실명이 아닙니다.\n아래 있는 객실 종류를 선택해주세요.\n#categoryroom#+index+.+category_name+\n#"
                        },
                        "call": "객실선택"
                    }
                ],
                "task": "categoryroomlist"
            }
        ]
    },
    {
        "name": "예약자 이름 입력",
        "id": "default170",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "예약자 성함을 입력해주세요",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "예약자 이름 입력1",
                "id": "default171",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "if":"context.user.mobile===undefined",
                        "kind": "Action",
                        "call": "빠른예약휴대혼번호입력"
                    },
                    {
                        "if":"context.user.mobile!==undefined",
                        "kind": "Action",
                        "call": "빠른예약휴대혼번호입력3"
                    }
                ],
                "task": "mynamesave"
            },
            {
                "name": "예약자 이름 입력2",
                "id": "default172",
                "filename": "default",
                "input": [
                    {
                        "if": "context.user.myname===undefined"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "예약자 이름 입력"
                    }
                ]
            }
        ]
    },
    {
        "name": "빠른예약휴대혼번호입력",
        "id": "default135",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": {
            "text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +daynumber+박+daynumber1+일\n- 예약 인원수 : +peoplenumber+명\n- 예약자 성함 : +myname+\n\n총 금액:+preallprice+원\n\n예약자의 휴대폰 번호를 입력해주세요.",
            "kind": "Text"
        },
        "children": [
            {
                "name": "빠른예약휴대혼번호입력1",
                "id": "default136",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "mobile"
                        ]
                    }
                ],
                "output": [
                    {
                        "text": "고객님께서 입력하신 +mobile+ 번호로 4자리 인증번호가 문자로 발송되었습니다. \n\n문자로 받으신 4자리 인증번호를 입력해주세요. \n문자를 받지 못한 경우에는 \"재발송\"이라고 입력해주세요.",
                        "kind": "Text"
                    }
                ],
                "children": [
                    {
                        "name": "빠른예약휴대혼번호입력2",
                        "id": "default137",
                        "filename": "default",
                        "input": [
                            {
                                "text": "재 발송"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "options": {
                                    "output": "인증번호를 다시 보내드렸습니다.\n\n확인하시고 입력해주세요."
                                },
                                "repeat": "1",
                                "type": "Repeat"
                            }
                        ]
                    },
                    {
                        "name": "빠른예약휴대혼번호입력3",
                        "id": "default138",
                        "filename": "default",
                        "input": [
                            {
                                "types": [
                                    "verificationType"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 예약자 성함 : +myname+\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +daynumber+박+daynumber1+일\n- 예약 인원수 : +peoplenumber+명\n- 예약자 연락처 : +mobile+\n\n총 금액:+preallprice+원\n\n이대로 예약을 도와드릴까요?\n\n변경하고 싶은 부분이 있으면 '변경'이라고 입력해 주세요.",
                                "kind": "Text"
                            }
                        ],
                        "task": "saveMobile",
                        "children": [
                                    {
                                        "name": "빠른예약확인및원료",
                                        "id": "default140",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "text": "네"
                                            },
                                            {
                                                "text": "ㅇㅇ"
                                            },
                                            {
                                                "text": "웅"
                                            },
                                            {
                                                "text": "응"
                                            },
                                            {
                                                "text": "ok"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear1+년+outmonth1+월+outday1+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +daynumber+박+daynumber1+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n+bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번을 입력해주세요.",
                                                "kind": "Text"
                                            }
                                        ],
                                        "task": "addorder1",
                                        "children": [
                                            {
                                                "name": "빠른예약 목록 보기1",
                                                "id": "default141",
                                                "filename": "default",
                                                "input": [
                                                    {
                                                        "text": "목록"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Action",
                                                        "call": "빠른예약 예약 목록 보기",
                                                        "type": "Call"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "name": "빠른예약변경",
                                        "id": "default142",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "text": "변경"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "text": "어떤 부분을 변경해 드릴까요?\n1. 객실 종류\n2. 체크인 일자\n3. 체크아웃 일자\n4. 예약자 성함\n5. 예약자 연락처\n6. 인원수",
                                                "kind": "Text"
                                            }
                                        ],
                                        "children": [
                                            {
                                                "name": "빠른예약 객실 종류 수정",
                                                "id": "default143",
                                                "filename": "default",
                                                "input": [
                                                    {
                                                        "text": "1 . 객실 종류"
                                                    },
                                                    {
                                                        "text": "1"
                                                    },
                                                    {
                                                        "text": "객실 종류"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +daynumber+박+daynumber1+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber+명\n\n총 금액:+preallprice+원\n\n객실 종류를 선택해주세요.\n#categoryroom#+index+.+category_name+\n#",
                                                        "kind": "Text"
                                                    }
                                                ],
                                                "task": "categoryroomlist",
                                                "children": [
                                                    {
                                                        "name": "빠른예약 객실 종료 수정2",
                                                        "id": "default144",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "types": [
                                                                    "roomlistType"
                                                                ]
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear1+년+outmonth1+월+outday1+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +daynumber+박+daynumber1+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n+bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번을 입력해주세요.",
                                                                "kind": "Text"
                                                            }
                                                        ],
                                                        "task": "addorder",
                                                        "children": [
                                                            {
                                                                "name": "빠른예약 목록 보기2",
                                                                "id": "default145",
                                                                "filename": "default",
                                                                "input": [
                                                                    {
                                                                        "text": "목록"
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Action",
                                                                        "call": "빠른예약 예약 목록 보기"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "빠른예약 객실 종료 수정22",
                                                        "id": "default146",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "if": "true"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Action",
                                                                "call": "빠른예약 객실 종류 수정",
                                                                "options": {
                                                                    "output": "아래 있는 객실 종류를 선택해주세요.\n\n#categoryroom#+index+.+category_name+\n#"
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "빠른예약 체크인 일자 수정",
                                                "id": "default147",
                                                "filename": "default",
                                                "input": [
                                                    {
                                                        "text": "체크 일자"
                                                    },
                                                    {
                                                        "text": "2 . 체크 일자"
                                                    },
                                                    {
                                                        "text": "2"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +daynumber+박+daynumber1+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber+명\n\n총 금액:+preallprice+원\n\n체크인 하실 날짜를 말씀해주세요.\n(ex: 20170125)",
                                                        "kind": "Text"
                                                    }
                                                ],
                                                "children": [
                                                    {
                                                        "name": "빠른예약 체크인 일자 수정2",
                                                        "id": "default148",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "types": [
                                                                    "isDateIn"
                                                                ]
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear1+년+outmonth1+월+outday1+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n+bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번을 입력해주세요.",
                                                                "kind": "Text"
                                                            }
                                                        ],
                                                        "task": "addorder1",
                                                        "children": [
                                                            {
                                                                "name": "빠른예약 예약 목록 보기3",
                                                                "id": "default149",
                                                                "filename": "default",
                                                                "input": [
                                                                    {
                                                                        "text": "목록"
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Action",
                                                                        "call": "빠른예약 예약 목록 보기"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "빠른예약 체크인 일자 수정22",
                                                        "id": "default150",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "if": "true"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Action",
                                                                "options": {
                                                                    "output": "틀렸네요.\n\n다시 입력해주세요!\n그리고 체크아웃 일자는 체크인 일자보다 뒤에 나와야 합니다.(ex: 20170212)"
                                                                },
                                                                "call": "빠른예약 체크인 일자 수정"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "빠른예약 체크아웃 일자 수정",
                                                "id": "default151",
                                                "filename": "default",
                                                "input": [
                                                    {
                                                        "text": "체크아웃 일자"
                                                    },
                                                    {
                                                        "text": "3"
                                                    },
                                                    {
                                                        "text": "3 . 체크아웃 일자"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +daynumber+박+daynumber1+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber+명\n\n총 금액:+preallprice+원\n\n체크아웃 하실 날짜를 말씀해주세요.",
                                                        "kind": "Text"
                                                    }
                                                ],
                                                "children": [
                                                    {
                                                        "name": "빠른예약 체크아웃 일자 수정2",
                                                        "id": "default152",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "types": [
                                                                    "isDateOut"
                                                                ]
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear1+년+outmonth1+월+outday1+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n+bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번을 입력해주세요.",
                                                                "kind": "Text"
                                                            }
                                                        ],
                                                        "task": "addorder1",
                                                        "children": [
                                                            {
                                                                "name": "빠른예약 예약 목록 보기4",
                                                                "id": "default153",
                                                                "filename": "default",
                                                                "input": [
                                                                    {
                                                                        "text": "목록"
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Action",
                                                                        "call": "빠른예약 예약 목록 보기"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "dialog_default1001",
                                                        "id": "default154",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "if": "true"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Action",
                                                                "options": {
                                                                    "output": "틀렸네요.\n\n다시 입력해주세요!\n(ex: 20170212)\n\n그리고 체크아웃 일자는 체크인 일자보다 뒤에 나와야 합니다."
                                                                },
                                                                "call": "빠른예약 체크아웃 일자 수정"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "빠른예약 성함 수정",
                                                "id": "default155",
                                                "filename": "default",
                                                "input": [
                                                    {
                                                        "text": "성함"
                                                    },
                                                    {
                                                        "text": "4"
                                                    },
                                                    {
                                                        "text": "4 . 예약 성함"
                                                    },
                                                    {
                                                        "text": "예약 성함"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +daynumber+박+daynumber1+일\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber+명\n\n총 금액:+preallprice+원\n\n예약자 성함을 입력해주세요.",
                                                        "kind": "Text"
                                                    }
                                                ],
                                                "children": [
                                                    {
                                                        "name": "빠른예약 성함 수정2",
                                                        "id": "default156",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "if": "true"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear1+년+outmonth1+월+outday1+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +daynumber+박+daynumber1+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n+bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번을 입력해주세요.",
                                                                "kind": "Text"
                                                            }
                                                        ],
                                                        "task": "addorder2",
                                                        "children": [
                                                            {
                                                                "name": "빠른예약 예약 목록 보기5",
                                                                "id": "default157",
                                                                "filename": "default",
                                                                "input": [
                                                                    {
                                                                        "text": "목록"
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Action",
                                                                        "call": "빠른예약 예약 목록 보기",
                                                                        "type": "Call"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "빠른예약 연락처 수정",
                                                "id": "default158",
                                                "filename": "default",
                                                "input": [
                                                    {
                                                        "text": "연락처"
                                                    },
                                                    {
                                                        "text": "5"
                                                    },
                                                    {
                                                        "text": "5 . 예약 성함"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Action",
                                                        "options": {
                                                            "output": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +daynumber+박+daynumber1+일\n- 예약자 성함 : +myname+\n- 인원수: +peoplenumber+명\n\n총 금액:+preallprice+원\n\n예약자의 휴대폰 번호를 입력해주세요."
                                                        },
                                                        "call": "빠른예약휴대혼번호입력"
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "6.빠른예약 인원수 변경",
                                                "id": "default159",
                                                "filename": "default",
                                                "input": [
                                                    {
                                                        "text": "인원 수"
                                                    },
                                                    {
                                                        "text": "6"
                                                    },
                                                    {
                                                        "text": "6 . 인원 수"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +daynumber+박+daynumber1+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n\n총 금액:+preallprice+원\n\n예약하실 인원수를 입력해주세요.(ex: 5)",
                                                        "kind": "Text"
                                                    }
                                                ],
                                                "children": [
                                                    {
                                                        "name": "빠른예약 인원수 변경2",
                                                        "id": "default160",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "types": [
                                                                    "ispeoplenumber"
                                                                ]
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +menumatch.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear1+년+outmonth1+월+outday1+일\n- 가격 : +menumatch.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n+bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번을 입력해주세요.",
                                                                "kind": "Text"
                                                            }
                                                        ],
                                                        "task": "addorder1",
                                                        "children": [
                                                            {
                                                                "name": "빠른예약 예약 목록 보기 6",
                                                                "id": "default161",
                                                                "filename": "default",
                                                                "input": [
                                                                    {
                                                                        "text": "목록"
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Action",
                                                                        "call": "빠른예약 예약 목록 보기"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "빠른예약 인원수 변경22",
                                                        "id": "default162",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "if": "true"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Action",
                                                                "options": {
                                                                    "output": "인원수가 어떻게 되나요? 알려주세요.(ex: 5)"
                                                                },
                                                                "call": "6.빠른예약 인원수 변경"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "빠른예약 예약 목록 보기",
                                                "id": "default163",
                                                "filename": "default",
                                                "input": [
                                                    {
                                                        "text": "목록"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "text": "#orders#+index+.+order_room+\n- 예약 기간: \n     +order_period+\n- 예약 시간: +order_daynumbers+박\n- 예약 일자: \n      +order_date+\n- 입금 일자: \n      +order_paydate+까지\n- 가격: +order_oneprice+원\n- 인원수: +order_peoplenumber+명\n- 총 금액: +order_price+원\n\n#\n취소하시려면 '취소'라고 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번을 입력해주세요.",
                                                        "kind": "Text"
                                                    }
                                                ],
                                                "task": {
                                                    "0": "o",
                                                    "1": "r",
                                                    "2": "d",
                                                    "3": "e",
                                                    "4": "r",
                                                    "5": "l",
                                                    "6": "i",
                                                    "7": "s",
                                                    "8": "t",
                                                    "name": "orderlist",
                                                    "kind": "Text"
                                                },
                                                "children": [
                                                    {
                                                        "name": "빠른예약 예약 취소",
                                                        "id": "default164",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "text": "취소"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "text": "몇번을 취소해드릴까요?\n\n#orders#+index+.+order_room+\n- 예약 기간: \n     +order_period+\n- 예약 시간: +order_daynumbers+박\n- 예약 일자: \n      +order_date+\n- 입금 일자: \n      +order_paydate+까지\n- 가격: +order_oneprice+원\n- 인원수: +order_peoplenumber+명\n- 총 금액: +order_price+원\n\n#",
                                                                "kind": "Text"
                                                            }
                                                        ],
                                                        "task": "orderlist",
                                                        "children": [
                                                            {
                                                                "name": "빠른예약 예약 취소1",
                                                                "id": "default165",
                                                                "filename": "default",
                                                                "input": [
                                                                    {
                                                                        "types": [
                                                                            "orderlistType"
                                                                        ]
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "text": "취소 완료!\n\n* 처음으로 가시려면 '처음' 또는 0번을 입력해주세요.",
                                                                        "kind": "Text"
                                                                    }
                                                                ],
                                                                "task": "deleteorder"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "빠른예약 틀린 경우",
                                                "id": "default166",
                                                "filename": "default",
                                                "input": [
                                                    {
                                                        "if": "true"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "text": "고객님, 무엇을 도와드릴까요?\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
                                                        "kind": "Text"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                            {
                                "name": "빠른예약 도움",
                                "id": "default167",
                                "filename": "default",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "text": "고객님, 무엇을 도와드릴까요?\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
                                        "kind": "Text"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "틀린 인증번호 입력",
                        "id": "default169",
                        "filename": "default",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "repeat": "1",
                                "options": {
                                    "output": "인력해신 인증번호를 틀렸습니다.\n\n다시 보내드렸습니다.\n\n새로운 인증번호를 디시 입력해주세요!"
                                },
                                "type": "Repeat"
                            }
                        ]
                    }
                ],
                "task": "SMSAuth"
            },
            {
                "name": "901",
                "id": "default901",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "repeat": "1",
                        "options": {
                            "output": "전화번호를 틀렸습니다.\n\n다시 보내드렸습니다.\n\n새로운 인증번호를 디시 입력해주세요!"
                        },
                        "type": "Repeat"
                    }
                ]
            }
        ]
    },
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "객실"
			},
			{
				"text": "1"
			},
			{
				"text": "1 . < 객실 >"
			}
		],
		"output": [
			{
				"text": "[객실]\n\n<+hotelname+> 객실 예약 관련 사항을 도와드리겠습니다. \n아래의 항목중에서 필요하신 메뉴를 선택해주세요.\n\n1. 객실 정보\n2. 객실 예약\n3. 객실 예약 확인\n4. 객실 예약 취소",
				"kind": "Text"
			}
		],
		"name": "객실",
		"children": [
			{
				"name": "객실 정보",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"text": "1"
					},
					{
						"text": "1 . 객실 정보"
					}
				],
				"output": [
                    {
                        "if":"context.dialog.roomno===undefined",
                        "text":"아직 객실 정보를 등록하지 않았습니다.",
                        "kind": "Text"
                    },
                    {   "if":"context.dialog.roomno===0",
                        "kind": "Action",
                        "options":
                            {
                                "output": "[객실 정보]\n\n<+hotelname+>에는 총 3가지 종류의 객실이 있습니다. 확인하고 싶으시면 객실 종류를 선택해주세요.\n\n#categoryroom#+index+.+category_name+\n#"
                            },
                        "call": "객실 정보1"
                    }
				],
				"task": "categoryroomlist"
			},
			{
				"name": "객실 예약",
				"id": "default11",
				"filename": "default",
				"input": [
					{
						"text": "2"
					},
					{
						"text": "2 . 객실 예약"
					}
				],
				"output": [
                    {
                        "if":"context.dialog.roomno===undefined",
                        "text":"아직 객실 정보를 등록하지 않았습니다.",
                        "kind": "Text"
                    },
                    {   "if":"context.dialog.roomno===0",
                        "kind": "Action",
                        "options":
                            {
                                "output": "[객실 - 객실 예약]\n<+hotelname+>에는 총 3가지 종류의 객실이 있습니다. 예약하고 싶으시면 객실 종류를 선택해주세요.\n\n#categoryroom#+index+.+category_name+\n#"
                            },
                        "call": "객실 예약1"
                    }
				],
				"task": "categoryroomlist"
			},
			{
				"name": "예약 확인",
				"id": "default85",
				"filename": "default",
				"input": [
					{
						"text": "3"
					},
					{
						"text": "3 . 객실 예약 확인"
					}
				],
				"output": [
					{
						"if": "context.dialog.orders.length!==0",
						"text": "[예약 정보]\n#orders#+index+.+order_room+\n- 예약 기간: \n     +order_period+\n- 예약 시간: +order_daynumbers+박\n- 예약 일자: \n      +order_date+\n- 입금 일자: \n      +order_paydate+까지\n- 가격: +order_oneprice+원\n- 인원수: +order_peoplenumber+명\n- 총 금액: +order_price+원\n\n#\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
						"kind": "Text",
						"id": "default85_0"
					},
					{
						"if": "context.dialog.orders.length===0",
						"text": "고객님이 아직 예약한 적이 없네요. 바로 예약하로 가시려면 \"예약\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
						"kind": "Text",
						"id": "default85_1"
					}
				],
				"task": "orderlist"
			},
			{
				"name": "예약 취소",
				"id": "default86",
				"filename": "default",
				"input": [
					{
						"text": "4"
					},
					{
						"text": "4 . 객실 예약 취소"
					}
				],
				"output": [
					{
						"if": "context.dialog.orders.length!==0",
						"kind": "Action",
						"id": "default86_0",
						"call": "예약 취소 선택",
						"options": {
							"output": "몇번을 취소해드릴까요?\n\n#orders#+index+.+order_room+\n- 예약 기간:\n+order_period+\n- 예약 시간: +order_daynumbers+박\n- 예약 일자:\n+order_date+\n- 입금 일자: \n+order_paydate+까지\n- 가격: +order_oneprice+원\n- 인원수: +order_peoplenumber+명\n- 총 금액: +order_price+원\n\n#"
						}
					},
					{
						"if": "context.dialog.orders.length===0",
						"text": "고객님이 아직 예약한 적이 없네요. 바로 예약하로 가시려면 \"예약\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
						"kind": "Text"
					}
				],
				"task": "orderlist"
			}
		]
	},
	{
		"name": "다이닝",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "2"
			},
			{
				"text": "다이닝"
			},
			{
				"text": "2 . < 다이닝 >"
			}
		],
		"output": [
			{
               "if":"context.dialog.restaurantno===undefined",
                "text":"아직 다이닝 정보를 등록하지 않았습니다.",
                "kind": "Text"
			},
            {   "if":"context.dialog.restaurantno===0",
                "kind": "Action",
                "options":
                    {
                        "output": "[다이닝]\n<+hotelname+>에는 다양한 종류의 다이닝 시설이 준비되어 있습니다. 자세히 보고 싶으신 다이닝을 선택해주세요. \n\n#categoryrestaurant#+index+.+category_name+\n#"
                    },
                "call": "다이닝 정보1"
            }
		],
		"task": "categoryrestaurantlist"
	},
	{
		"name": "시설",
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"text": "3"
			},
			{
				"text": "시설"
			},
			{
				"text": "3 . < 시설 >"
			}
		],
		"output": [
            {   "if":"context.dialog.facilityno===undefined",
                "text": "아직 시설 정보를 등록하지 않았습니다.",
                "kind": "Text"
            },
			{
                "if":"context.dialog.facilityno===0",
                "kind": "Action",
                "options":
                    {
                        "output": "[시설]\n<+hotelname+>에는 고객님의 편의를 위하여 이용하실 수 있는 여러가지 시설을 준비했습니다. 자세히 보고 싶으신 시설을 선택해주세요. \n\n#categoryfacility#+index+.+category_name+\n#"
                    },
                "call": "시설 정보1"
			}
		],
		"task": "categoryfacilitylist"
	},
	{
		"name": "이벤트",
		"id": "default24",
		"filename": "default",
		"input": [
			{
				"text": "4"
			},
			{
				"text": "이벤트"
			},
			{
				"text": "4 . < 이벤트 >"
			}
		],
		"output": [
            {   "if":"context.dialog.eventno===undefined",
                "text": "아직 이벤트 정보를 등록하지 않았습니다.",
                "kind": "Text"
            },
			{
                "if":"context.dialog.eventno===0",
                "kind": "Action",
                "options":
                    {
                        "output": "[이벤트]\n<+hotelname+>에서 여름을 맞이하여 제공하는 특별 행사입니다. 자세히 보고 싶으신 항목을 선택해주세요. \n\n#categoryevent#+index+.+category_name+\n#"
                    },
                "call": "이벤트 정보1"
			}
		],
		"task": "categoryeventlist"
	},
	{
		"name": "주소 안내",
		"id": "default28",
		"filename": "default",
		"input": [
			{
				"text": "5"
			},
			{
				"text": "안내"
			},
			{
				"text": "주소"
			},
			{
				"text": "5 . < 위치 안내 >"
			},
			{
				"text": "5 . < 주소 안내 >"
			}
		],
		"output": [
			{
				"text": "[위치안내]\n<+hotelname+>입니다. 편안한 휴식을 제공하기 위해서 최선을 다하겠습니다. \n\n- 주소 : +address+\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
				"kind": "Text"
			}
		],
        "task": "mapButton"
	},
	{
		"name": "6.셔틀",
		"id": "default104",
		"filename": "default",
		"input": [
			{
				"text": "셔틀"
			},
			{
				"text": "6 . 셔틀"
			},
			{
				"text": "6"
			},
			{
				"text": "6 . < 셔틀 >"
			},
			{
				"text": "버스"
			}
		],
		"output": [
            {
                "if": "context.dialog.shuttleno===undefined",
                "text": "아직 셔틀정보를 등록하지 않았습니다.",
                "kind": "Text"
            },
            {
                "if": "context.dialog.shuttleno===1",
                "text": "아직 셔틀을 이용하실 수 없습니다.",
                "kind": "Text"
            },
            {
                "if": "context.dialog.shuttleno===0",
                "text": "[셔틀 정보]\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.\n",
                "kind": "Text"
            }
		],
		"task": "inforshuttle"
	},
	{
		"name": "7.주차",
		"id": "default105",
		"filename": "default",
		"input": [
			{
				"text": "주차"
			},
			{
				"text": "7 . < 주차 >"
			},
			{
				"text": "7"
			},
			{
				"text": "주차장"
			}
		],
		"output": [
            {
                "if": "context.dialog.parkno===undefined",
                "text": "아직 주차정보를 등록하지 않았습니다.",
                "kind": "Text"
            },
            {
                "if": "context.dialog.parkno===1",
                "text": "아직 주차장를 이용하실 수 없습니다.",
                "kind": "Text"
            },
			{
				"if": "context.dialog.parkno===0",
				"text": "[주차 정보]\n- 주차장 이름: +parkname+\n- 주차장 자리수: +parksize+\n- 주차장 소개: +parkdetails+\n-주차장 위치: +parkaddress+\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
				"kind": "Text"
			}

		],
		"task": "inforpark"
},
	{
		"name": "예약 취소 선택",
		"id": "default87",
		"filename": "default",
		"input": [
			{
				"if": "false"
			}
		],
		"output": [
			{
				"text": "몇번을 취소해드릴까요?\n\n#orders#+index+.+order_room+\n- 예약 기간: \n     +order_period+\n- 예약 시간: +order_daynumbers+박\n- 예약 일자: \n      +order_date+\n- 입금 일자: \n      +order_paydate+까지\n- 가격: +order_oneprice+원\n- 인원수: +order_peoplenumber+명\n- 총 금액: +order_price+원\n\n#",
				"kind": "Text"
			}
		],
		"task": "orderlist",
		"children": [
			{
				"name": "예약 취소 선택1",
				"id": "default88",
				"filename": "default",
				"input": [
					{
						"types": [
							"orderlistType"
						]
					}
				],
				"output": [
					{
						"text": "취소 완료!\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
						"kind": "Text"
					}
				],
				"task": {
					"name": "deleteorder"
				}
			}
		]
	},
	{
		"name": "휴대폰번호 인증",
		"id": "default42",
		"filename": "default",
		"input": [
			{
				"if": "false"
			}
		],
		"output": {
			"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n\n예약자의 휴대폰 번호를 입력해주세요.",
			"kind": "Text"
		},
		"children": [
			{
				"name": "전화번호 입력",
				"id": "default44",
				"filename": "default",
				"input": [
					{
						"types": [
							"mobile"
						]
					}
				],
				"output": [
					{
						"text": "고객님께서 입력하신 +mobile+ 번호로 4자리 인증번호가 문자로 발송되었습니다. \n\n문자로 받으신 4자리 인증번호를 입력해주세요. \n문자를 받지 못한 경우에는 \"재발송\"이라고 입력해주세요.",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "재발송",
						"id": "default45",
						"filename": "default",
						"input": [
							{
								"text": "재 발송"
							}
						],
						"output": [
							{
								"kind": "Action",
								"options": {
									"output": "인증번호를 다시 보내드렸습니다.\n\n확인하시고 입력해주세요."
								},
								"repeat": "1",
								"type": "Repeat"
							}
						]
					},
					{
						"name": "인증번호 확인",
						"id": "default47",
						"filename": "default",
						"input": [
							{
								"types": [
									"verificationType"
								]
							}
						],
						"output": [
							{
								"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n\n총 금액:+preallprice+원\n\n인원수가 어떻게 되나요? 알려주세요.(ex: 5)",
								"kind": "Text"
							}
						],
						"task": "saveMobile",
						"children": [
							{
								"name": "인원수 확인",
								"id": "default89",
								"filename": "default",
								"input": [
									{
										"types": [
											"ispeoplenumber"
										]
									}
								],
								"output": [
									{
										"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber+명\n\n총 금액:+preallprice+원\n\n이대로 예약을 도와드릴까요?\n\n변경하고 싶은 부분이 있으면 '변경'이라고 입력해 주세요.",
										"kind": "Text"
									}
								],
								"children": [
									{
										"name": "빠른예약42",
										"id": "default49",
										"filename": "default",
										"input": [
                                            {
                                                "text": "네"
                                            },
                                            {
                                                "text": "ㅇㅇ"
                                            },
                                            {
                                                "text": "웅"
                                            },
                                            {
                                                "text": "응"
                                            },
                                            {
                                                "text": "ok"
                                            }
										],
										"output": [
											{
												"text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear1+년+outmonth1+월+outday1+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n +bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
												"kind": "Text"
											}
										],
										"task": "addorder",
										"children": [
											{
												"name": "예약 목록 보기1",
												"id": "default68",
												"filename": "default",
												"input": [
													{
														"text": "목록"
													}
												],
												"output": [
													{
														"kind": "Action",
														"call": "예약 목록 보기",
														"type": "Call"
													}
												]
											}
										]
									},
									{
										"name": "변경",
										"id": "default90",
										"filename": "default",
										"input": [
											{
												"text": "변경"
											}
										],
										"output": [
											{
												"text": "어떤 부분을 변경해 드릴까요?\n1. 객실 종류\n2. 체크인 일자\n3. 체크아웃 일자\n4. 예약자 성함\n5. 예약자 연락처\n6. 인원수",
												"kind": "Text"
											}
										],
										"children": [
											{
												"name": "객실 종류 수정",
												"id": "default50",
												"filename": "default",
												"input": [
													{
														"text": "1 . 객실 종류"
													},
													{
														"text": "1"
													},
													{
														"text": "객실 종류"
													}
												],
												"output": [
													{
														"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber+명\n\n총 금액:+preallprice+원\n\n객실 종류를 선택해주세요.\n#categoryroom#+index+.+category_name+\n#",
														"kind": "Text"
													}
												],
												"task": "categoryroomlist",
												"children": [
													{
														"name": "객실 종료 수정2",
														"id": "default51",
														"filename": "default",
														"input": [
															{
																"types": [
																	"roomlistType"
																]
															}
														],
														"output": [
															{
																"text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear1+년+outmonth1+월+outday1+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n+bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
																"kind": "Text"
															}
														],
														"task": "addorder",
														"children": [
															{
																"name": "예약 목록 보기2",
																"id": "default69",
																"filename": "default",
																"input": [
																	{
																		"text": "목록"
																	}
																],
																"output": [
																	{
																		"kind": "Action",
																		"call": "예약 목록 보기"
																	}
																]
															}
														]
													},
													{
														"name": "객실 종료 수정22",
														"id": "default98",
														"filename": "default",
														"input": [
															{
																"if": "true"
															}
														],
														"output": [
															{
																"kind": "Action",
																"call": "객실 종류 수정",
																"options": {
																	"output": "아래 있는 객실 종류를 선택해주세요.\n\n#categoryroom#+index+.+category_name+\n#"
																}
															}
														]
													}
												]
											},
											{
												"name": "체크인 일자 수정",
												"id": "default52",
												"filename": "default",
												"input": [
													{
														"text": "체크 일자"
													},
													{
														"text": "2 . 체크 일자"
													},
													{
														"text": "2"
													}
												],
												"output": [
													{
														"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber+명\n\n총 금액:+preallprice+원\n\n체크인 하실 날짜를 말씀해주세요.\n(ex: 20170125)",
														"kind": "Text"
													}
												],
												"children": [
													{
														"name": "체크인 일자 수정2",
														"id": "default53",
														"filename": "default",
														"input": [
															{
																"types": [
																	"isDateIn"
																]
															}
														],
														"output": [
															{
																"text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear1+년+outmonth1+월+outday1+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n+bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
																"kind": "Text"
															}
														],
														"task": "addorder",
														"children": [
															{
																"name": "예약 목록 보기3",
																"id": "default70",
																"filename": "default",
																"input": [
																	{
																		"text": "목록"
																	}
																],
																"output": [
																	{
																		"kind": "Action",
																		"call": "예약 목록 보기"
																	}
																]
															}
														]
													},
													{
														"name": "체크인 일자 수정22",
														"id": "default99",
														"filename": "default",
														"input": [
															{
																"if": "true"
															}
														],
														"output": [
															{
																"kind": "Action",
																"options": {
																	"output": "틀렸네요.\n\n다시 입력해주세요!\n(ex: 20170212)"
																},
																"call": "체크인 일자 수정"
															}
														]
													}
												]
											},
											{
												"name": "체크아웃 일자 수정",
												"id": "default54",
												"filename": "default",
												"input": [
													{
														"text": "체크아웃 일자"
													},
													{
														"text": "3"
													},
													{
														"text": "3 . 체크아웃 일자"
													}
												],
												"output": [
													{
														"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber+명\n\n총 금액:+preallprice+원\n\n체크아웃 하실 날짜를 말씀해주세요.",
														"kind": "Text"
													}
												],
												"children": [
													{
														"name": "체크아웃 일자 수정2",
														"id": "default55",
														"filename": "default",
														"input": [
															{
																"types": [
																	"isDateOut"
																]
															}
														],
														"output": [
															{
																"text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear1+년+outmonth1+월+outday1+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n+bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
																"kind": "Text"
															}
														],
														"task": "addorder",
														"children": [
															{
																"name": "예약 목록 보기4",
																"id": "default71",
																"filename": "default",
																"input": [
																	{
																		"text": "목록"
																	}
																],
																"output": [
																	{
																		"kind": "Action",
																		"call": "예약 목록 보기"
																	}
																]
															}
														]
													},
													{
														"name": "dialog_default100",
														"id": "default100",
														"filename": "default",
														"input": [
															{
																"if": "true"
															}
														],
														"output": [
															{
																"kind": "Action",
																"options": {
																	"output": "틀렸네요.\n\n다시 입력해주세요!\n(ex: 20170212)\n\n그리고 체크아웃 일자는 체크인 일자보다 뒤에 나와야 합니다."
																},
																"call": "체크아웃 일자 수정"
															}
														]
													}
												]
											},
											{
												"name": "성함 수정",
												"id": "default57",
												"filename": "default",
												"input": [
													{
														"text": "성함"
													},
													{
														"text": "4"
													},
													{
														"text": "4 . 예약 성함"
													},
													{
														"text": "예약 성함"
													}
												],
												"output": [
													{
														"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber+명\n\n총 금액:+preallprice+원\n\n예약자 성함을 입력해주세요.",
														"kind": "Text"
													}
												],
												"children": [
													{
														"name": "성함 수정2",
														"id": "default59",
														"filename": "default",
														"input": [
															{
																"if": "true"
															}
														],
														"output": [
															{
																"text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n+bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
																"kind": "Text"
															}
														],
														"task": "mynamesave1",
														"children": [
															{
																"name": "예약 목록 보기5",
																"id": "default72",
																"filename": "default",
																"input": [
																	{
																		"text": "목록"
																	}
																],
																"output": [
																	{
																		"kind": "Action",
																		"call": "예약 목록 보기",
																		"type": "Call"
																	}
																]
															}
														]
													}
												]
											},
											{
												"name": "연락처 수정",
												"id": "default60",
												"filename": "default",
												"input": [
													{
														"text": "연락처"
													},
													{
														"text": "5"
													},
													{
														"text": "5 . 예약 성함"
													}
												],
												"output": [
													{
														"kind": "Action",
														"options": {
															"output": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 인원수: +peoplenumber+명\n\n총 금액:+preallprice+원\n\n예약자의 휴대폰 번호를 입력해주세요."
														},
														"call": "휴대폰번호 인증"
													}
												]
											},
											{
												"name": "6.인원수 변경",
												"id": "default91",
												"filename": "default",
												"input": [
													{
														"text": "인원 수"
													},
													{
														"text": "6"
													},
													{
														"text": "6 . 인원 수"
													}
												],
												"output": [
													{
														"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n\n총 금액:+preallprice+원\n\n예약하실 인원수를 입력해주세요.(ex: 5)",
														"kind": "Text"
													}
												],
												"children": [
													{
														"name": "인원수 변경2",
														"id": "default92",
														"filename": "default",
														"input": [
															{
																"types": [
																	"ispeoplenumber"
																]
															}
														],
														"output": [
															{
																"text": "[객실예약 완료]\n객실 예약 완료 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear1+년+inputmonth1+월+inputday1+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n- 인원수: +peoplenumber1+명\n\n*+myname+* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *+preallprice+원*을 입금하시면 예약이 완료됩니다.\n\n+bank+\n\n- 예약 신청시간: \n      +todaydate+\n- 입금 시간: \n      +tomorrowdate+까지\n\n예약 목록을 보시려면 \"목록\"을 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
																"kind": "Text"
															}
														],
														"task": "addorder",
														"children": [
															{
																"name": "예약 목록 보기 6",
																"id": "default93",
																"filename": "default",
																"input": [
																	{
																		"text": "목록"
																	}
																],
																"output": [
																	{
																		"kind": "Action",
																		"call": "예약 목록 보기"
																	}
																]
															}
														]
													},
													{
														"name": "인원수 변경22",
														"id": "default102",
														"filename": "default",
														"input": [
															{
																"if": "true"
															}
														],
														"output": [
															{
																"kind": "Action",
																"options": {
																	"output": "인원수가 어떻게 되나요? 알려주세요.(ex: 5)"
																},
																"call": "6.인원수 변경"
															}
														]
													}
												]
											},
											{
												"name": "예약 목록 보기",
												"id": "default67",
												"filename": "default",
												"input": [
													{
														"text": "목록"
													}
												],
												"output": [
													{
														"text": "#orders#+index+.+order_room+\n- 예약 기간: \n     +order_period+\n- 예약 시간: +order_daynumbers+박\n- 예약 일자: \n      +order_date+\n- 입금 일자: \n      +order_paydate+까지\n- 가격: +order_oneprice+원\n- 인원수: +order_peoplenumber+명\n- 총 금액: +order_price+원\n\n#\n취소하시려면 '취소'라고 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
														"kind": "Text"
													}
												],
												"task": {
													"0": "o",
													"1": "r",
													"2": "d",
													"3": "e",
													"4": "r",
													"5": "l",
													"6": "i",
													"7": "s",
													"8": "t",
													"name": "orderlist",
													"kind": "Text"
												},
												"children": [
													{
														"name": "예약 취소",
														"id": "default79",
														"filename": "default",
														"input": [
															{
																"text": "취소"
															}
														],
														"output": [
															{
																"text": "몇번을 취소해드릴까요?\n\n#orders#+index+.+order_room+\n- 예약 기간: \n     +order_period+\n- 예약 시간: +order_daynumbers+박\n- 예약 일자: \n      +order_date+\n- 입금 일자: \n      +order_paydate+까지\n- 가격: +order_oneprice+원\n- 인원수: +order_peoplenumber+명\n- 총 금액: +order_price+원\n\n#",
																"kind": "Text"
															}
														],
														"task": "orderlist",
														"children": [
															{
																"name": "예약 취소1",
																"id": "default80",
																"filename": "default",
																"input": [
																	{
																		"types": [
																			"orderlistType"
																		]
																	}
																],
																"output": [
																	{
																		"text": "취소 완료!\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
																		"kind": "Text"
																	}
																],
																"task": "deleteorder"
															}
														]
													}
												]
											},
											{
												"name": "틀린 경우",
												"id": "default76",
												"filename": "default",
												"input": [
													{
														"if": "true"
													}
												],
												"output": [
													{
														"text": "고객님, 무엇을 도와드릴까요?\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
														"kind": "Text"
													}
												]
											}
										]
									},
									{
										"name": "도움",
										"id": "default103",
										"filename": "default",
										"input": [
											{
												"if": "true"
											}
										],
										"output": [
											{
												"text": "고객님, 무엇을 도와드릴까요?\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
												"kind": "Text"
											}
										]
									}
								]
							},
							{
								"name": "인원수 틀린 경우",
								"id": "default97",
								"filename": "default",
								"input": [
									{
										"if": "true"
									}
								],
								"output": [
									{
										"kind": "Action",
										"options": {
											"output": "인원수가 어떻게 되나요? 알려주세요.(ex: 5)"
										},
										"call": "인증번호 확인",
										"type": "Call"
									}
								]
							}
						]
					},
					{
						"name": "틀린 인증번호 입력",
						"id": "default48",
						"filename": "default",
						"input": [
							{
								"if": "true"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "인력해신 인증번호를 틀렸습니다.\n\n다시 보내드렸습니다.\n\n새로운 인증번호를 디시 입력해주세요!"
								},
								"type": "Repeat"
							}
						]
					}
				],
				"task": "SMSAuth"
			},
            {
                "name": "902",
                "id": "default902",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "repeat": "1",
                        "options": {
                            "output": "전화번호를 틀렸습니다.\n\n다시 보내드렸습니다.\n\n새로운 인증번호를 디시 입력해주세요!"
                        },
                        "type": "Repeat"
                    }
                ]
            }
		]
	},
    {
        "name": "다이닝 정보1",
        "id": "default108",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "[다이닝]\n<+hotelname+>에는 다양한 종류의 다이닝 시설이 준비되어 있습니다. 자세히 보고 싶으신 다이닝을 선택해주세요. \n\n#categoryrestaurant#+index+.+category_name+\n#",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "다이닝 정보2",
                "id": "default16",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "restaurantlistType"
                        ]
                    }
                ],
                "output": [
                    {
                        "text": "[다이닝 - +restaurantlistType.category_name+]\n+restaurantlistType.restaurant_introduction+\n\n- 위치 : +restaurantlistType.restaurant_location+\n- 운영 시간\n아침 : +restaurantlistType.restaurant_mopentime+\n점심 : +restaurantlistType.restaurant_mopentime+\n저녁 : +restaurantlistType.restaurant_nopentime+\n- 좌석수 : 총 +restaurantlistType.restaurant_seat+좌석\n- +restaurantlistType.restaurant_room+\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
                        "kind": "Text"
                    }
                ],
                "task": {
                    "name": "imagerestaurant"
                }
            },
            {
                "name": "다이닝 정보3",
                "id": "default117",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "아래 있는 다이닝 종류를 선택해주세요.\n\n#categoryrestaurant#+index+.+category_name+\n#"
                        },
                        "call": "다이닝",
                        "type": "Call"
                    }
                ]
            }
        ],
        "task": "categoryrestaurantlist"
    },
    {
        "name": "시설 정보1",
        "id": "default109",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "[시설]\n<+hotelname+>에는 고객님의 편의를 위하여 이용하실 수 있는 여러가지 시설을 준비했습니다. 자세히 보고 싶으신 시설을 선택해주세요. \n\n#categoryfacility#+index+.+category_name+\n#",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "시설 정보2",
                "id": "default20",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "facilitylistType"
                        ]
                    }
                ],
                "output": [
                    {
                        "text": "[시설 - +facilitylistType.category_name+]\n+facilitylistType.facility_introduction+\n\n- 위치 : +facilitylistType.facility_location+\n- 시설 규모: +facilitylistType.facility_size+ \n- 시설 수용 가능 인원: +facilitylistType.facility_number+\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
                        "kind": "Text",
                        "id": "default20_0"
                    }
                ],
                "task": {
                    "name": "imagefacility"
                }
            },
            {
                "name": "시설 정보3",
                "id": "default116",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "아래 있는 시설 종류를 선택해주세요.\n\n#categoryfacility#+index+.+category_name+\n#"
                        },
                        "call": "시설",
                        "type": "Call"
                    }
                ]
            }
        ],
        "task": "categoryfacilitylist"
    },
    {
        "name": "이벤트 정보1",
        "id": "default110",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "[이벤트]\n<+hotelname+>에서 여름을 맞이하여 제공하는 특별 행사입니다. 자세히 보고 싶으신 항목을 선택해주세요. \n\n#categoryevent#+index+.+category_name+\n#",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "이벤트 정보2",
                "id": "default25",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "eventlistType"
                        ]
                    }
                ],
                "output": [
                    {
                        "text": "[이벤트 - +eventlistType.category_name+]\n+eventlistType.event_introduction+\n\n- 장소 : +eventlistType.event_location+\n- 시간 : +eventlistType.event_opentime+\n- 기간 : +eventlistType.event_date+\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
                        "kind": "Text",
                        "id": "default25_0"
                    }
                ]
            },
            {
                "name": "이벤트 정보3",
                "id": "default115",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "아래 있는 이벤트 종류를 선택해주세요.\n\n#categoryevent#+index+.+category_name+\n#"
                        },
                        "call": "이벤트",
                        "type": "Call"
                    }
                ]
            }
        ],
        "task": "categoryeventlist"
    },
    {
        "name": "객실 정보1",
        "id": "default111",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "[객실 정보]\n\n<+hotelname+>에는 총 3가지 종류의 객실이 있습니다. 확인하고 싶으시면 객실 종류를 선택해주세요.\n\n#categoryroom#+index+.+category_name+\n#",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "객실 정보2",
                "id": "default5",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "roomlistType"
                        ]
                    }
                ],
                "output": [
                    {
                        "text": "[객실 정보 - +roomlistType.category_name+]+roomlistType1+",
                        "kind": "Text"
                    }
                ],
                "task": "imageroom"
            },
            {
                "name": "객실 정보3",
                "id": "default114",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "아래 있는 객실 종류를 선택해주세요.\n\n#categoryroom#+index+.+category_name+\n#"
                        },
                        "call": "객실 정보",
                        "type": "Call"
                    }
                ]
            }
        ],
        "task": "categoryroomlist"
    },
    {
        "name": "객실 예약1",
        "id": "default112",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "[객실 - 객실 예약]\n<+hotelname+>에는 총 3가지 종류의 객실이 있습니다. 예약하고 싶으시면 객실 종류를 선택해주세요.\n\n#categoryroom#+index+.+category_name+\n#",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "객실 예약 날짜",
                "id": "default12",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "roomlistType"
                        ]
                    }
                ],
                "output": {
                    "text": "[객실 예약]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 가격 : +roomlistType.room_price+원\n\n체크인 하실 날짜를 말씀해주세요.\n(ex: 20170125)",
                    "kind": "Text"
                },
                "children": [
                    {
                        "name": "객실 예약 날짜2",
                        "id": "default13",
                        "filename": "default",
                        "input": [
                            {
                                "types": [
                                    "isDateIn"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "text": "[객실 예약]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 가격 : +roomlistType.room_price+원\n- 체크인 일자 :+inputyear+년+inputmonth+월+inputday+일\n\n체크아웃 하실 날짜를 말씀해주세요.",
                                "kind": "Text"
                            }
                        ],
                        "children": [
                            {
                                "name": "예약 확정",
                                "id": "default14",
                                "filename": "default",
                                "input": [
                                    {
                                        "types": [
                                            "isDateOut"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "text": "[객실 예약]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 :+inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 :+outyear+년+outmonth+월+outday+일\n- 투숙 기간 : +days+박+dayss+일\n- 가격 : +roomlistType.room_price+원\n\n총 금액:+preallprice+원\n\n예약 내용을 확인하세요. 예약을 진행하시겠습니까?",
                                        "kind": "Text"
                                    }
                                ],
                                "children": [
                                    {
                                        "name": "예약 완료",
                                        "id": "default15",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "text": "네"
                                            },
                                            {
                                                "text": "ㅇㅇ"
                                            },
                                            {
                                                "text": "웅"
                                            },
                                            {
                                                "text": "응"
                                            },
                                            {
                                                "text": "ok"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "call": "빠른예약4",
                                                "type": "Call"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "이전6663",
                                        "id": "default66",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "text": "고객님, 무엇을 도와드릴까요?\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
                                                "kind": "Text"
                                            }
                                        ]
                                    }
                                ],
                                "task": "categoryroomlist"
                            },
                            {
                                "name": "예약 확정 재입력",
                                "id": "default40",
                                "filename": "default",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "죄송합니다.다시 입력해주세요!\n(ex: 20170212)\n\n그리고 체크아웃 일자는 체크인 일자보다 뒤에 나와야 합니다."
                                        },
                                        "call": "객실 예약 날짜2"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "객실 예약 날짜22",
                        "id": "default64",
                        "filename": "default",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "call": "객실 예약 날짜",
                                "options": {
                                    "output": "죄송합니다.다시 입력해주세요!\n(ex: 20170212)"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "name": "객실 예약 날짜2",
                "id": "default63",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "객실 예약",
                        "options": {
                            "output": "아래 있는 객실 종류를 선택해주세요.\n\n#categoryroom#+index+.+category_name+\n#"
                        },
                        "type": "Call"
                    }
                ]
            }
        ],
        "task": "categoryroomlist"
    },
    {
        "name": "빠른예약1",
        "id": "default113",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "[객실예약 진행상황]\n객실 예약 진행 정보\n\n- 체크인 일자 : +myyear+년+mymonth+월+myday+일\n\n\n객실 종류를 선택해주세요.\n#categoryroom#+index+.+category_name+\n#",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "빠른예약2",
                "id":"default30",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "roomlistType"
                        ]
                    }
                ],
                "output": [
                    {
                        "text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +myyear+년+mymonth+월+myday+일\n- 가격 : +roomlistType.room_price+원\n\n체크아웃 날짜 입력해주세요.\n(ex: 20170101)",
                        "kind": "Text"
                    }
                ],
                "children": [
                    {
                        "name": "빠른예약3",
                        "id": "default31",
                        "filename": "default",
                        "input": [
                            {
                                "types": [
                                    "isDateOutfast"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +myyear+년+mymonth+월+myday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n\n총 금액:+preallprice+원\n\n예약 내용을 확인하세요. 요금은 총 +preallprice+원입니다. 예약을 진행하시겠습니까?",
                                "kind": "Text"
                            }
                        ],
                        "children": [
                            {
                                "name": "빠른예약4",
                                "id": "default32",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": "네"
                                    },
                                    {
                                        "text": "ㅇㅇ"
                                    },
                                    {
                                        "text": "웅"
                                    },
                                    {
                                        "text": "응"
                                    },
                                    {
                                        "text": "ok"
                                    }
                                ],
                                "output": [
                                    {
                                        "text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n\n총 금액:+preallprice+원\n\n예약자 성함을 입력해주세요.",
                                        "kind": "Text"
                                    }
                                ],
                                "children": [
                                    {
                                        "name": "빠른예약5",
                                        "id": "default33",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "if": "context.user.mobile",
                                                "kind": "Action",
                                                "options": {
                                                    "output": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n- 예약자 연락처 : +mobile+\n\n총 금액:+preallprice+원\n\n인원수가 어떻게 되나요? 알려주세요.(ex: 5)"
                                                },
                                                "call": "인증번호 확인"
                                            },
                                            {
                                                "if": "!context.user.mobile",
                                                "kind": "Action",
                                                "options": {
                                                    "output": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : +roomlistType.category_name+\n- 체크인 일자 : +inputyear+년+inputmonth+월+inputday+일\n- 체크아웃 일자 : +outyear+년+outmonth+월+outday+일\n- 가격 : +roomlistType.room_price+원\n- 투숙 기간 : +days+박+dayss+일\n- 예약자 성함 : +myname+\n\n총 금액:+preallprice+원\n\n예약자의 휴대폰 번호를 입력해주세요."
                                                },
                                                "call": "휴대폰번호 인증"
                                            }
                                        ],
                                        "task": "mynamesave"
                                    }
                                ],
                                "task": {
                                    "0": "s",
                                    "1": "a",
                                    "2": "v",
                                    "3": "e",
                                    "4": "i",
                                    "5": "n",
                                    "6": "p",
                                    "7": "u",
                                    "8": "t",
                                    "9": "d",
                                    "10": "a",
                                    "11": "t",
                                    "12": "e",
                                    "name": "saveinputdate",
                                    "kind": "Text"
                                }
                            },
                            {
                                "name": "dialog_default65",
                                "id": "default65",
                                "filename": "default",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "text": "고객님, 무엇을 도와드릴까요?\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
                                        "kind": "Text"
                                    }
                                ]
                            }
                        ],
                        "task": "categoryroomlist"
                    },
                    {
                        "name": "빠른예약3재입력",
                        "id": "default39",
                        "filename": "default",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "call": "빠른예약2",
                                "options": {
                                    "output": "죄송합니다. 다시 입력해주세요!\n(ex: 20170212)\n\n그리고 체크아웃 일자는 체크인 일자보다 뒤에 나와야 합니다."
                                }
                            }
                        ]
                    }
                ],
                "task": "categoryroomlist"
            },
            {
                "name": "빠른예약22",
                "id": "default61",
                "filename": "default",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "아래 있는 객실 종류를 선택해주세요.\n\n#categoryroom#+index+.+category_name+\n#"
                        },
                        "call": "빠른예약",
                        "type": "Call"
                    }
                ]
            }
        ],
        "task": "categoryroomlist"
    },
	{
		"name": "대답 못함",
		"id": "default95",
		"filename": "default",
		"input": [
			{
				"if": "true"
			}
		],
		"output": [
			{
				"text": "고객님, 무엇을 도와드릴까요?\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시려면 '이전' 을 입력해주세요.",
				"kind": "Text"
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
                "regexp":"^사작$"
			}
		],
		"output": [
			{
				"text": "안녕하세요. < +hotelname+ > 입니다.\n\n호텔 이용 관련 정보를 확인 하실 수 있습니다.\n\n예시)\n주소, 주차, 셔틀,\n예약 확인, 예약 취소\n20170215부터 5명 4박5일 싱글룸 예약\n\n또한 필요하신 메뉴를 직접 선택해셔도 됩니다.\n\n1. 객실\n2. 다이닝\n3. 시설\n4. 이벤트\n5. 주소 안내\n6. 셔틀 안내\n7. 주차 정보",
				"kind": "Text"
			}
		]
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "처음",
		"input": [
			{
                "regexp":"^처음$"
			},
            {
                "regexp":"^0$"
            }
		],
		"output": [
			{
				"kind": "Action",
				"call": "시작"
			}
		]
	},
    {
        "id": "defaultcommon2",
        "filename": "defaultcommon",
        "name": "예약확인default",
        "input": [
            {
                "regexp":"^예약[ ]?확인$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "예약 정보 확인"
            }
        ]
    },
    {
        "id": "defaultcommon3",
        "filename": "defaultcommon",
        "name": "예약취소default",
        "input": [
            {
                "regexp":"^예약[ ]?취소$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "예약 취소 확인"
            }
        ]
    },
    {
        "id": "defaultcommon4",
        "filename": "defaultcommon",
        "name": "빠른예약default",
        "input": [
            {
                "regexp":"^빠른[ ]?예약$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "빠른예약"
            }
        ]
    },
    {
        "id": "defaultcommon5",
        "filename": "defaultcommon",
        "name": "바로예약default",
        "input": [
            {
                "regexp":"^바로[ ]?예약$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "바로 예약"
            }
        ]
    },
    // {
    //     "id": "defaultcommon6",
    //     "filename": "defaultcommon",
    //     "name": "예약default",
    //     "input": [
    //         {
    //             "regexp":"^예약$"
    //         }
    //     ],
    //     "output": [
    //         {
    //             "kind": "Action",
    //             "call": "빠른예약(체크인날짜,인원수,투숙 기간,객실명,예약)"
    //         }
    //     ]
    // },
    {
        "id": "defaultcommon7",
        "filename": "defaultcommon",
        "name": "객실정보default",
        "input": [
            {
                "regexp":"^[ ]?객실[정]?[보]?$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "객실 정보"
            }
        ]
    },
    {
        "id": "defaultcommon8",
        "filename": "defaultcommon",
        "name": "다이닝정보default",
        "input": [
            {
                "regexp":"^[ ]?다이닝[정]?[보]?$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "다이닝"
            }
        ]
    },
    {
        "id": "defaultcommon9",
        "filename": "defaultcommon",
        "name": "이벤트정보default",
        "input": [
            {
                "regexp":"^[ ]?이벤트[정]?[보]?$"
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
        "id": "defaultcommon10",
        "filename": "defaultcommon",
        "name": "주소안내default",
        "input": [
            {
                "regexp":"^주소[정]?[보]?$"
            },
            {
                "regexp":"^취치[정[?]보]?$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "주소 안내"
            }
        ]
    },
    {
        "id": "defaultcommon11",
        "filename": "defaultcommon",
        "name": "셔틀default",
        "input": [
            {
                "regexp":"^셔틀[정]?[보]?$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "6.셔틀"
            }
        ]
    },
    {
        "id": "defaultcommon12",
        "filename": "defaultcommon",
        "name": "주차default",
        "input": [
            {
                "regexp":"^주차[정]?[보]?$"
            },
            {
                "regexp":"^주차장[정]?[보]?$"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "7.주차"
            }
        ]
    },
    {
        "id": "defaultcommon13",
        "filename": "defaultcommon",
        "name": "시설default",
        "input": [
            {
                "regexp":"^시설[정]?[보]?$"
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
		"name": "이전",
		"id": "commondefault30",
		"filename": "defaultcommon",
		"input": [
			{
                "regexp":"^이전$"
			}
		],
		"output": {
			"kind": "Action",
			"up": "1"
		}
	}
];
var _bot = require(require('path').resolve("engine/bot")).getTemplateBot('hotel');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
