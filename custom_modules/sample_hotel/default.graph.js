var dialogs = [
    {
        "name": "1. 메뉴보기",
        "input": [
            {
                "regexp": "^1"
            },
            {
                "regexp": "메뉴"
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
                        "text": "1. 싱글룸"
                    },
                    {
                        "text": "2. 트윈룸"
                    },
                    {
                        "text": "3. 더블룸"
                    },
                    {
                        "text": "4. 트리플룸"
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
                            "raw": "싱글룸",
                            "nlp": "싱글 룸"
                        }
                    },
                    {
                        "regexp": "^2"
                    },
                    {
                        "text": {
                            "raw": "트윈룸",
                            "nlp": "트윈룸"
                        }
                    },
                    {
                        "regexp": "^3"
                    },
                    {
                        "text": {
                            "raw": "더블룸",
                            "nlp": "더 블룸"
                        }
                    },
                    {
                        "regexp": "^4"
                    },
                    {
                        "text": {
                            "raw": "트리플룸",
                            "nlp": "트리플 룸"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "☃하우스 함박스테이크☃\n  ✔house burgsteak\n\n상큼한 토마토 소스\n\n가격: 8900원",
                        "buttons": [
                            {
                                "text": "이전으로 가기"
                            },
                            {
                                "text": "처음으로 돌아가기"
                            }
                        ],
                        "if": "context.session.isorder!==true"
                    },
                    {
                        "kind": "Content",
                        "text": "일 각실로 예약하시겠습니까?",
                        "if": "context.session.isorder===true",
                        "buttons": [
                            {
                                "text": "이 객실로 예약하기"
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
                "task": {
                    "name": "image"
                },
                "id": "default1",
                "children": [
                    {
                        "name": "1. 메뉴보기 예약하기",
                        "input": [
                            {
                                "text": {
                                    "raw": "이 객실로 예약하기",
                                    "nlp": "이 객실 로 예약 하다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "객실 몇개 예약하실거에요? \n(ex: 2)",
                                "type": "call",
                                "dialogName": "2. 예약하기 인원",
                                "dialogId": "default4"
                            }
                        ],
                        "id": "default19"
                    }
                ]
            }
        ],
        "task": {
            "name": "startmenu"
        }
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
                "text": "입주하실 일자를 말씀해 주세요.\n(ex: 2017-02-06)"
            }
        ],
        "id": "default2",
        "children": [
            {
                "name": "2. 예약하기 퇴실 날짜",
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
                        "text": "퇴실일자를 말씀해 주세요.\n(ex: 2017-02-10)"
                    }
                ],
                "task": {
                    "name": "savedatein"
                },
                "id": "default100",
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
                                "kind": "Action",
                                "text": "어떤 객실을 예약해주실 건까요?\n 선택해주세요",
                                "if": "context.session.days>=0",
                                "type": "call",
                                "dialogId": "default0",
                                "dialogName": "1. 메뉴보기"
                            },
                            {
                                "kind": "Action",
                                "text": "퇴실날짜는 입주날짜보다 뒤에 있어야 됩니다.\n\n죄송하지만 확인하시고 다시 한번 입력해주시겠습니까?^^",
                                "if": "context.session.days<0",
                                "type": "repeat"
                            }
                        ],
                        "task": {
                            "name": "savedateout"
                        },
                        "id": "default3",
                        "children": [
                            {
                                "name": "2. 예약하기 인원",
                                "input": [
                                    {
                                        "if": "false"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "객실 몇개 예약하실거에요? \n(ex: 2)"
                                    }
                                ],
                                "task": {
                                    "name": ""
                                },
                                "id": "default4",
                                "children": [
                                    {
                                        "name": "2. 예약하기 예약자",
                                        "input": [
                                            {
                                                "regexp": "/^\\d/"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "예약하실 이름을 입력해주세요."
                                            }
                                        ],
                                        "task": {
                                            "name": "savenum"
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
                                                                        "text": "예약내용을 확인해주세요.\n입주날짜: +context.session.datein+ \n퇴실날짜: +context.session.dateout+\n객실수: +context.session.number+개\n가격: +context.session.allprice+원\n예약 시간: +context.session.time+\n주문자성함: +context.session.name+\n연락처: +context.session.mobile+\n다음과 같이 예약신청하시겠습니까?"
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
                                                                                "text": "예약을 요청하였습니다.\n\n아직 확정이 아닙니다.\n객실 확인 후 예약완료 문자를 보내 드리겠습니다.\n\n예약확인 하려면 \"예약확인\"버튼을 누러주세요\n처음으로 가려면 \"처음으로 돌아가기\" 버튼을 누러주세요",
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
                "name": "2. 예약하기 퇴실 날짜 틀린 경우",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "입력하신 날짜는 인식을 못하거나 입주하는 날짜보다 일찍 되는 날짜입니다.\n\n죄송하지만 확인하시고 다시 한번 입력해주시겠습니까?^^",
                        "type": "repeat"
                    }
                ],
                "id": "default101"
            }
        ],
        "task": {
            "name": "orderstart"
        }
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
                        "text": "예약확인",
                        "if": "context.session.confirmlist.length>0"
                    },
                    {
                        "kind": "Content",
                        "text": "예약하기",
                        "if": "context.session.confirmlist.length<=0",
                        "type": "call",
                        "dialogId": "default2",
                        "dialogName": "2. 예약하기 날짜"
                    }
                ],
                "id": "default16",
                "task": {
                    "name": "showlist"
                },
                "children": [
                    {
                        "name": "3. 예약확인 취소",
                        "input": [
                            {
                                "regexp": "/^\\d/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "삭제했습니다!",
                                "buttons": [
                                    {
                                        "text": "이전으로 가기"
                                    },
                                    {
                                        "text": "처음으로 돌아가기"
                                    }
                                ]
                            }
                        ],
                        "task": {
                            "name": "deleteorder"
                        },
                        "id": "default20"
                    },
                    {
                        "name": "3. 예약확인 없는 경우 예약하기",
                        "input": [
                            {
                                "text": {
                                    "raw": "예약하기",
                                    "nlp": "예약 하다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "call",
                                "dialogId": "default2",
                                "dialogName": "2. 예약하기 날짜"
                            }
                        ],
                        "id": "default22"
                    },
                    {
                        "name": "3. 예약확인 취소 틀린 경우",
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
                        "id": "default21"
                    }
                ]
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
                "text": "<+bot.name+> 주소\n\n서울 서초구 강남대로 373 (서초동, 홍우빌딩) WeWork",
                "buttons": [
                    {
                        "url": "https://map.naver.com/?query=%EC%84%9C%EC%9A%B8+%EC%84%9C%EC%B4%88%EA%B5%AC+%EA%B0%95%EB%82%A8%EB%8C%80%EB%A1%9C+373+(%EC%84%9C%EC%B4%88%EB%8F%99%2C+%ED%99%8D%EC%9A%B0%EB%B9%8C%EB%94%A9)+WeWork",
                        "text": "네이버지도보기"
                    },
                    {
                        "url": "http://dmaps.kr/2i3bv",
                        "text": "daum지도보기"
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
                "text": "<+bot.name+> 영업시간\n\nOpen hour\n24시간\n\nBreak time\n평일 오후 12 - 1시\n\n쉬일 없습니다.",
                "buttons": [
                    {
                        "text": "이전으로 가기"
                    },
                    {
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
                "text": "<+bot.name+> 인공지능 챗봇입니다. 궁금하신 걸 물어보세요.\n\n아니면, 아래의 목록 중 번호를 입력하셔도 되요!\n\n1. 객실보기\n2. 예약하기\n3. 예약확인"
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
                "text": "죄송해요 고객님. 제가 이해하지 못하는 부분이에요~\n\n+bot.name+ 고객센터(☎02-858-5683)를 이용가능하십니다.\n\n다른 궁금하신 걸 물어봐주시겠어요?^^",
                "kind": "Content"
            },
            {
                "text": "앗, 그 부분은 저도 잘 모르겠어요.\n\n+bot.name+ 고객센터(☎02-858-5683)를 이용가능하십니다.\n\n다음번에 학습해서 알려드리겠습니다!",
                "kind": "Content"
            },
            {
                "text": "그건 아직 학습되지 않아서 알려드릴수가 없네요ㅠ.ㅠ\n\n+bot.name+ 고객센터(☎02-858-5683)를 이용가능하십니다.\n\n다른 궁금하신 걸 물어봐주세요!",
                "kind": "Content"
            }
        ]
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}
