var dialogs = [
    {
        "name": "1. 후보자 소개",
        "input": [
            {
                "intent": "후보자 소개"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "알고 싶은 후보자 이력을 말씀해주세요.\n1. 기본 프로필\n2. 학력\n3. 경력\n4. 수상"
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "후보자 이력 상세보기",
                "input": [
                    {
                        "text": {
                            "raw": "기본 프로필",
                            "nlp": "기본 프로필"
                        }
                    },
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
                        "text": "이름 : 박준하\n생년월일 : 1990년 09월 30일\n혈액형 : A형\n가족관계 : 배우자 안희수, 딸 박시울"
                    }
                ],
                "id": "default5"
            },
            {
                "name": "학력 상세보기",
                "input": [
                    {
                        "text": {
                            "raw": "학력",
                            "nlp": "학력"
                        }
                    },
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
                        "text": "학력\n~1990 한국대학교 경영학 학사\n~1994 한국대학교 경영학 석사"
                    }
                ],
                "id": "default6"
            },
            {
                "name": "경력 상세보기",
                "input": [
                    {
                        "text": {
                            "raw": "경력",
                            "nlp": "경력"
                        }
                    },
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
                        "text": "경력\n1995.02 ~ 1997.04 파라미터 연구소 창립, 대표이사\n2000.05 ~ 2004.04 한국 대학교 이사"
                    }
                ],
                "id": "default7"
            },
            {
                "name": "수상 상세보기",
                "input": [
                    {
                        "text": {
                            "raw": "수상",
                            "nlp": "수상"
                        }
                    },
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
                        "text": "수상\n1994 대한민국특허기술대전 금상\n1995 대통령표창 산업포장"
                    }
                ],
                "id": "default8"
            }
        ]
    },
    {
        "name": "2. 오늘 일정",
        "input": [
            {
                "intent": "일정 문의"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "궁금하신 날짜의 일정을 알려주세요.\n\n1. 오늘 일정\n2. 내일 일정\n3. 어제 일정"
            }
        ],
        "id": "default1",
        "children": [
            {
                "name": "오늘 일정",
                "input": [
                    {
                        "text": {
                            "raw": "오늘",
                            "nlp": "오늘"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "오늘 일정입니다.\n◇ 07:33       CNN 브랜든의 뉴스쇼 출연 \n◇ 11:00       \"창업도시 낙성대밸리!\" - 청년 창업가 및 스타트업 멤버들과의 현장 간담회\n◇ 13:30       4.19묘역 참배"
                    }
                ],
                "id": "default9"
            },
            {
                "name": "내일 일정",
                "input": [
                    {
                        "text": {
                            "raw": "내일",
                            "nlp": "내일"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "◇ 07:33       CNN 브랜든의 뉴스쇼 출연 \n◇ 11:00       \"창업도시 낙성대밸리!\" - 청년 창업가 및 스타트업 멤버들과의 현장 간담회\n◇ 13:30       4.19묘역 참배"
                    }
                ],
                "id": "default10"
            },
            {
                "name": "어제 일정",
                "input": [
                    {
                        "text": {
                            "raw": "어제",
                            "nlp": "어제"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "◇ 07:33       CNN 브랜든의 뉴스쇼 출연 \n◇ 11:00       \"창업도시 낙성대밸리!\" - 청년 창업가 및 스타트업 멤버들과의 현장 간담회\n◇ 13:30       4.19묘역 참배"
                    }
                ],
                "id": "default11"
            }
        ]
    },
    {
        "name": "3 .정책 공약",
        "input": [
            {
                "intent": "정책 문의"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "궁금하신 정책에 대해 말씀해주세요.\n\n1. 주식 공매도 제도 개선\n2. 여성가족부, 성평등인권부로 개편\n3. 미세먼지 정책"
            }
        ],
        "id": "default2",
        "children": [
            {
                "name": "주식 공매도 정책",
                "input": [
                    {
                        "text": {
                            "raw": "주식 공매도",
                            "nlp": "주식 공매도"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "주식 공매도 제도 개선\n△공매도 거래 현황 보고 및 공시 제도의 확대\n△공매도 과열종목 지정제도 강화 \n△공매도 활용 시장교란 행위에 대한 조사 및 처벌 강화"
                    }
                ],
                "id": "default12"
            },
            {
                "name": "성평등인권부",
                "input": [
                    {
                        "text": {
                            "raw": "성평등인권부",
                            "nlp": "성 평등 인 권부"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "여성가족부, 성평등인권부로 개편\n△내각의 여성 비율을 OECD 평균 수준인 30%\n△성별 임금 격차를 해소\n△성평등 인권 통합교육"
                    }
                ],
                "id": "default13"
            },
            {
                "name": "미세먼지 정책",
                "input": [
                    {
                        "text": {
                            "raw": "미세먼지 정책",
                            "nlp": "미세먼지 정책"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "미세먼지 정책\n△대중교통 무료 정책\n△중국과의 외교적 노력"
                    }
                ],
                "id": "default14"
            }
        ]
    },
    {
        "name": "4. 선거 활동",
        "input": [
            {
                "intent": "선거활동문의"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "박준하 후보는 새벽 5시 30분 노량진수산시장에서 시작해 자정무렵 홍대에서 마지막 유세의 피날레를 장식했습니다."
            }
        ],
        "id": "default3",
        "children": [
            {
                "name": "유세 피날레",
                "input": [
                    {
                        "text": {
                            "raw": "유세 피날레",
                            "nlp": "유세 피날레"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "박준하 후보는 새벽 5시 30분 노량진수산시장에서 시작해 자정무렵 홍대에서 마지막 유세의 피날레를 장식했습니다."
                    }
                ],
                "id": "default15"
            }
        ]
    },
    {
        "name": "5. 후원하기",
        "input": [
            {
                "intent": "후원문의"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "[후원회 모금 안내] 박준하 후보를 후원해주세요.\n\n서울 시장 예비후보자, 박준하후원회 모금이 진행되고 있습니다. \n대신할 수 없는 미래, 박준하 예비후보를 후원해주세요. \n여러분의 후원이 대한민국의 정치를 한땀한땀 변화시킵니다.\n후원계좌: 농협 302-0227-4334-XX"
            }
        ],
        "id": "default4"
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
                "text": "서울 시민 여러분, 박준하 후보입니다.\n여러분들과 함께 더 나은 세상을 만들기 위해 서울 시민들의 의견을 귀담아 듣고 있습니다. \n챗봇과 이야기하시어, 박준하 후보의 정책과 걸어온 길을 알아주시길 바라며, \n0번 많은 투표 바랍니다.\n감사합니다. \n\nP.S. 이 메시지는 인공지능 챗봇의 메세지입니다.\n후보자에게 원하는 질문을 여기서 바로 물어볼 수 있습니다."
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
        "name": "답변없음",
        "input": "",
        "output": [
            {
                "text": "잘못 알아 들었습니다.\n아래와 같은 질문을 대답할 수 있습니다.\n1. 후보자 소개\n2. 오늘 일정\n3 .정책 공약\n4. 선거 활동\n5. 후원하기",
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