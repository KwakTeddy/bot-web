var dialogs = [
    {
        "name": "1. 메뉴보기",
        "input": [
            {
                "regexp": "/^1/"
            },
            {
                "regexp": "/메뉴/"
            },
            {
                "text": {
                    "raw": "메뉴보기",
                    "nlp": "메뉴 보기"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "메뉴리스트 아래와 같습니다.",
                "buttons": [
                    {
                        "text": "1. 하우스 함박스테이크"
                    },
                    {
                        "text": "2. 라구 라이스"
                    },
                    {
                        "text": "3. 팬 스테이크"
                    },
                    {
                        "text": "이전으로 가기"
                    },
                    {
                        "text": "처음으로 돌아가기"
                    }
                ]
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "1. 메뉴보기 1",
                "input": [
                    {
                        "regexp": "^1"
                    },
                    {
                        "text": {
                            "raw": "하우스 함박스테이크",
                            "nlp": "하우스 함박스테이크"
                        }
                    },
                    {
                        "regexp": "^2"
                    },
                    {
                        "text": {
                            "raw": "라구 라이스",
                            "nlp": "라 구 라이스"
                        }
                    },
                    {
                        "regexp": "^3"
                    },
                    {
                        "text": {
                            "raw": "팬 스테이크",
                            "nlp": "팬 스테이크"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "☃하우스 함박스테이크☃\n  ✔house burgsteak\n\n상큼한 토마토 소스\n\n가격: 8900원",
                        "buttons": [
                            {
                                "url": "",
                                "text": "이전으로 가기"
                            },
                            {
                                "url": "",
                                "text": "처음으로 돌아가기"
                            }
                        ]
                    }
                ],
                "task": {
                    "name": "image"
                },
                "id": "default1"
            }
        ]
    },
    {
        "name": "2. 예약하기 날짜",
        "input": [
            {
                "regexp": "예약하"
            },
            {
                "regexp": "^2"
            },
            {
                "regexp": "예약해"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "예약하실 일자를 말씀해 주세요.\n(ex: 2017-02-06)"
            }
        ],
        "id": "default2",
        "children": [
            {
                "name": "2. 예약하기 시간",
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
                        "text": "예약하실 시간을 말씀해 주세요.\n(ex: 오후 4시)"
                    }
                ],
                "task": {
                    "name": "savedate"
                },
                "id": "default3",
                "children": [
                    {
                        "name": "2. 예약하기 인원",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "몇명이 오실지 말씀해 주세요\n(ex: 6)"
                            }
                        ],
                        "task": {
                            "name": "savetime"
                        },
                        "id": "default4",
                        "children": [
                            {
                                "name": "2. 예약하기 예약자",
                                "input": [
                                    {
                                        "types": [
                                            "peoplenumber"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "예약하실 이름을 입력해주세요."
                                    }
                                ],
                                "task": {
                                    "name": "savepeoplenum"
                                },
                                "id": "default5",
                                "children": [
                                    {
                                        "name": "2. 예약하기 휴대번호",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "휴대폰 번호를 말씀해주세요.(01012123434)"
                                            }
                                        ],
                                        "task": {
                                            "name": "savename"
                                        },
                                        "id": "default6",
                                        "children": [
                                            {
                                                "name": "2. 예약하기 인증번호",
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
                                                        "text": "문자메세지(SMS)로 발송된 인증번호를 입력해주세요."
                                                    }
                                                ],
                                                "id": "default7",
                                                "children": [
                                                    {
                                                        "name": "2. 예약확인",
                                                        "input": [
                                                            {
                                                                "types": [
                                                                    "identification"
                                                                ]
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Content",
                                                                "text": "예약내용을 확인해주세요.\n일시: +context.session.date+ +context.session.time+\n인원: +context.session.peoplenumber+명\n주문자성함: +context.session.name+\n연락처: +context.session.mobile+\n다음과 같이 예약신청하시겠습니까?"
                                                            }
                                                        ],
                                                        "task": {
                                                            "name": "saveorder"
                                                        },
                                                        "id": "default8",
                                                        "children": [
                                                            {
                                                                "name": "2. 주문",
                                                                "input": [
                                                                    {
                                                                        "text": {
                                                                            "raw": "네",
                                                                            "nlp": "네"
                                                                        }
                                                                    },
                                                                    {
                                                                        "text": {
                                                                            "raw": "ㅇㅇ",
                                                                            "nlp": "ㅇㅇ"
                                                                        }
                                                                    },
                                                                    {
                                                                        "text": {
                                                                            "raw": "ㅇ",
                                                                            "nlp": "ㅇ"
                                                                        }
                                                                    },
                                                                    {
                                                                        "text": {
                                                                            "raw": "넹",
                                                                            "nlp": "넹"
                                                                        }
                                                                    },
                                                                    {
                                                                        "text": {
                                                                            "raw": "웅",
                                                                            "nlp": "웅"
                                                                        }
                                                                    },
                                                                    {
                                                                        "text": {
                                                                            "raw": "응",
                                                                            "nlp": "응"
                                                                        }
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Content",
                                                                        "text": "예약을 요청하였습니다.\n\n아직 확정이 아닙니다.\n좌석 확인 후 예약완료 문자를 보내 드리겠습니다.\n\n예약확인 하려면 \"예약확인\"버튼을 누러주세요\n처음으로 가려면 \"처음으로 돌아가기\" 버튼을 누러주세요",
                                                                        "buttons": [
                                                                            {
                                                                                "url": "",
                                                                                "text": "예약확인"
                                                                            },
                                                                            {
                                                                                "url": "",
                                                                                "text": "처음으로 돌아가기"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "id": "default14"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "2. 예약하기 인증번호 재발송",
                                                        "input": [
                                                            {
                                                                "text": {
                                                                    "raw": "재발송",
                                                                    "nlp": "재 발송"
                                                                }
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Action",
                                                                "text": "재발송이 되었습니다.\n\n문자메세지(SMS)로 발송된 인증번호를 입력해주세요.",
                                                                "type": "call",
                                                                "dialogName": "2. 예약하기 인증번호",
                                                                "dialogId": "default7"
                                                            }
                                                        ],
                                                        "task": {
                                                            "name": "recertification"
                                                        },
                                                        "id": "default13"
                                                    },
                                                    {
                                                        "name": "2. 예약하기 인증번호 틀린경우",
                                                        "input": [
                                                            {
                                                                "if": "true"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Action",
                                                                "text": "입력하신 인증번호는 틀렸습니다.\n\n죄송하지만 확인하시고 다시 한번 입력해주시겠습니까?^^\n\n인증번호를 못 받은 경우에는 '재발송' 을 입력해주세요.",
                                                                "type": "repeat"
                                                            }
                                                        ],
                                                        "id": "default12"
                                                    }
                                                ],
                                                "task": {
                                                    "name": "savemobile"
                                                }
                                            },
                                            {
                                                "name": "2.예약하기 휴대번호 틀린경우",
                                                "input": [
                                                    {
                                                        "if": "true"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Action",
                                                        "text": "입력하신 전화번호는 인식을 못하네요.\n\n죄송하지만 확인하시고 다시 한번 입력해주시겠습니까?^^",
                                                        "type": "repeat"
                                                    }
                                                ],
                                                "id": "default11"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "2. 예약하기 인원 틀린 경우",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "죄송하지만 숫자만 다시 한번 입력해주시겠습니까?^^",
                                        "type": "repeat"
                                    }
                                ],
                                "id": "default10"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "2. 예약하기 날짜 틀린 경우",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "입력하신 날짜는 인식을 못하네요.\n\n죄송하지만 확인하시고 다시 한번 입력해주시겠습니까?^^",
                        "type": "repeat"
                    }
                ],
                "id": "default9"
            }
        ]
    },
    {
        "name": "3. 예약확인",
        "input": [
            {
                "regexp": "^3"
            },
            {
                "regexp": "예약확인"
            },
            {
                "regexp": "예약 확인"
            },
            {
                "regexp": "예약했"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "예약자성함을 입력해주세요."
            }
        ],
        "task": {
            "name": ""
        },
        "id": "default15",
        "children": [
            {
                "name": "3. 예약확인 여부",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "예약확인"
                    }
                ],
                "id": "default16",
                "task": {
                    "name": "showlist"
                }
            }
        ]
    },
    {
        "name": "5. 지도",
        "input": [
            {
                "regexp": "지도"
            },
            {
                "regexp": "위치"
            },
            {
                "regexp": "주소"
            },
            {
                "regexp": "어디"
            },
            {
                "regexp": "버스"
            },
            {
                "regexp": "지하철"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "<+bot.name+> 주소\n\n서울특별시 서초구 효령로4길 7",
                "buttons": [
                    {
                        "url": "https://map.naver.com/?mapmode=0&lng=39d126de18996d8a144a5a61be3b702e&title=%ED%95%98%EC%9A%B0%EC%8A%A4&pinId=38237621&dlevel=10&lat=5f024fcb2a6d36a67f5fa552eb4ad84e&enc=&pinType=site",
                        "text": "네이버지도보기"
                    },
                    {
                        "url": "http://dmaps.kr/86qni",
                        "text": "daum지도보기"
                    },
                    {
                        "url": "",
                        "text": "이전으로 가기"
                    },
                    {
                        "url": "",
                        "text": "처음으로 돌아가기"
                    }
                ]
            }
        ],
        "id": "default18"
    },
    {
        "name": "4.영업시간",
        "input": [
            {
                "regexp": "영업시간"
            },
            {
                "regexp": "영업"
            },
            {
                "regexp": "열어"
            },
            {
                "regexp": "출근"
            },
            {
                "regexp": "퇴근"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "<+bot.name+> 영업시간\n\nOpen hour\n오전 11시 30분 - 저녁 10시\n(last order / 9시)\n\nBreak time\n평일 오후 3 - 4시\n\n일요일은 쉽니다",
                "buttons": [
                    {
                        "url": "",
                        "text": "이전으로 가기"
                    },
                    {
                        "url": "",
                        "text": "처음으로 돌아가기"
                    }
                ]
            }
        ],
        "id": "default17"
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
            },
            {
                "text": {
                    "raw": "대화 시작",
                    "nlp": "대화 시작"
                }
            },
            {
                "text": {
                    "raw": "처음으로 돌아가기",
                    "nlp": "처음 으로 돌아가다"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "<+bot.name+> 인공지능 챗봇입니다. 궁금하신 걸 물어보세요.\n\n아니면, 아래의 목록 중 번호를 입력하셔도 되요!\n\n1. 메뉴보기\n2. 예약하기\n3. 예약확인"
            }
        ],
        "task": {
            "name": "start"
        }
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
            },
            {
                "text": {
                    "raw": "이전으로 가기",
                    "nlp": "이전으로 가기"
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
        "name": "답변없음",
        "input": "",
        "output": [
            {
                "kind": "Content",
                "text": "답변없음."
            }
        ]
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}
