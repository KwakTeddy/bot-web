var dialogs = [
    {
        "name": "1.병원 소개",
        "input": [
            {
                "regexp": "^1$"
            },
            {
                "text": {
                    "raw": "병원 소개",
                    "nlp": "병원 소개"
                }
            },
            {
                "text": {
                    "raw": "병원소개",
                    "nlp": "병원 소개"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.introduction#+description+\n\n+phone+\n#"
            }
        ],
        "id": "default0",
        "task": {
            "name": "introduction"
        },
        "children": [
            {
                "name": "1.병원 소개 이전으로",
                "input": [
                    {
                        "text": {
                            "raw": "이전으로 가기",
                            "nlp": "이전 으로 가기"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "back"
                    }
                ],
                "id": "default10"
            },
            {
                "name": "1.벙원 소개 처음으로 돌아가기",
                "input": [
                    {
                        "text": {
                            "raw": "처음으로 돌아가기",
                            "nlp": "처음 으로 돌아가다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "startDialog",
                        "dialogName": "시작"
                    }
                ],
                "id": "default12"
            }
        ]
    },
    {
        "name": "2.교통편",
        "input": [
            {
                "regexp": "^2$"
            },
            {
                "text": {
                    "raw": "교통",
                    "nlp": "교통"
                }
            },
            {
                "text": {
                    "raw": "주소",
                    "nlp": "주소"
                }
            },
            {
                "text": {
                    "raw": "위치",
                    "nlp": "위치"
                }
            },
            {
                "text": {
                    "raw": "가는 길",
                    "nlp": "가다 길"
                }
            },
            {
                "text": {
                    "raw": "지도",
                    "nlp": "지도"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.transportation#+company+\n\n주소: +address+\n#\n \n어떤 교통으로 방문하시나요?"
            }
        ],
        "id": "default1",
        "task": {
            "name": "transportation"
        },
        "children": [
            {
                "name": "2.교통편 이전으로 가기",
                "input": [
                    {
                        "text": {
                            "raw": "이전으로 가기",
                            "nlp": "이전 으로 가기"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "back"
                    }
                ],
                "id": "default13"
            },
            {
                "name": "2.교통편 처음으로 돌아가기",
                "input": [
                    {
                        "text": {
                            "raw": "처음으로 돌아가기",
                            "nlp": "처음 으로 돌아가다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "startDialog",
                        "dialogName": "시작"
                    }
                ],
                "id": "default18"
            },
            {
                "name": "2.1 버스",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "#context.session.transportation#+bus+\n#"
                    }
                ],
                "task": {
                    "name": "transportationway"
                },
                "id": "default3",
                "children": [
                    {
                        "name": "New Dialog",
                        "input": [
                            {
                                "text": {
                                    "raw": "2.1버스 이전으로 가기",
                                    "nlp": "2 . 1 버스 이전 으로 가기"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "back"
                            }
                        ],
                        "task": {
                            "name": "이전으로 가기"
                        },
                        "id": "default19"
                    },
                    {
                        "name": "2.1버스 처음으로 돌아가기",
                        "input": [
                            {
                                "text": {
                                    "raw": "처음으로 돌아가기",
                                    "nlp": "처음 으로 돌아가다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "call",
                                "dialogId": "startDialog",
                                "dialogName": "시작"
                            }
                        ],
                        "id": "default20"
                    }
                ]
            }
        ]
    },
    {
        "name": "3.의료진 소개",
        "input": [
            {
                "text": {
                    "raw": "의료진",
                    "nlp": "의료 진"
                }
            },
            {
                "regexp": "^3$"
            },
            {
                "text": {
                    "raw": "인원",
                    "nlp": "인원"
                }
            },
            {
                "text": {
                    "raw": "직원",
                    "nlp": "직원"
                }
            },
            {
                "text": {
                    "raw": "원장 누구",
                    "nlp": "원장 누구"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "의료진을 소개합니다."
            }
        ],
        "id": "default2",
        "task": {
            "name": "dean"
        },
        "children": [
            {
                "name": "3.의료진 소개 내용",
                "input": [
                    {
                        "types": [
                            "deanlist"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "#context.session.selecteddean#+name+ 원장\n\n파트: +department+\n\n소개:\n +description+\n#"
                    }
                ],
                "task": {
                    "name": "showdean"
                },
                "id": "default4",
                "children": [
                    {
                        "name": "3.의료진 소개 내용 이전으로 가기",
                        "input": [
                            {
                                "text": {
                                    "raw": "이전으로 가기",
                                    "nlp": "이전 으로 가기"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "back"
                            }
                        ],
                        "id": "default23"
                    },
                    {
                        "name": "3.의료진 소개 내용 처음으로 돌아가기",
                        "input": [
                            {
                                "text": {
                                    "raw": "처음으로 돌아가기",
                                    "nlp": "처음 으로 돌아가다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "call",
                                "dialogId": "startDialog",
                                "dialogName": "시작"
                            }
                        ],
                        "id": "default24"
                    }
                ]
            },
            {
                "name": "3.의료진 소개 이전으로 가기",
                "input": [
                    {
                        "text": {
                            "raw": "이전으로 가기",
                            "nlp": "이전 으로 가기"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "back"
                    }
                ],
                "id": "default21"
            },
            {
                "name": "3.의료진 소개 처음으로 돌아가기",
                "input": [
                    {
                        "text": {
                            "raw": "처음으로 돌아가기",
                            "nlp": "처음 으로 돌아가다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "startDialog",
                        "dialogName": "시작"
                    }
                ],
                "id": "default22"
            }
        ]
    },
    {
        "name": "4.2월 이벤트",
        "input": [
            {
                "regexp": "^4"
            },
            {
                "text": {
                    "raw": "이벤트",
                    "nlp": "이벤트"
                }
            },
            {
                "text": {
                    "raw": "2월 이벤트",
                    "nlp": "2 월 이벤트"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "2월 이벤트들은 아래와 같습니다.",
                "buttons": [
                    {
                        "text": "1. 성형 이벤트"
                    },
                    {
                        "text": "2. 피부 이벤트"
                    },
                    {
                        "text": "3. 감량제 다이어트 이벤트"
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
        "id": "default7",
        "children": [
            {
                "name": "4.1감량제",
                "input": [
                    {
                        "regexp": "1"
                    },
                    {
                        "regexp": "2"
                    },
                    {
                        "regexp": "3"
                    },
                    {
                        "text": {
                            "raw": "성형",
                            "nlp": "성형"
                        }
                    },
                    {
                        "text": {
                            "raw": "피부",
                            "nlp": "피부"
                        }
                    },
                    {
                        "text": {
                            "raw": "량제 다이어트",
                            "nlp": "량제 다이어트"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "관련한 이벤트들은 아래와 같습니다."
                    }
                ],
                "id": "default8",
                "children": [
                    {
                        "name": "4.1.1대답",
                        "input": [
                            {
                                "types": [
                                    "eventlist"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "**+context.session.event.name+**\n\n+context.session.event.description+\n\n가격: +context.session.event.price+원"
                            }
                        ],
                        "task": {
                            "name": "showevent"
                        },
                        "id": "default11",
                        "children": [
                            {
                                "name": "4.1.1대답 이전으로 가기",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "이전으로 가기",
                                            "nlp": "이전 으로 가기"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "",
                                        "type": "back"
                                    }
                                ],
                                "id": "default29"
                            },
                            {
                                "name": "4.1.1대답 처음으로 돌아가기",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "처음으로 돌아가기",
                                            "nlp": "처음 으로 돌아가다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "",
                                        "type": "call",
                                        "dialogId": "startDialog",
                                        "dialogName": "시작"
                                    }
                                ],
                                "id": "default30"
                            }
                        ]
                    },
                    {
                        "name": "4.1감량제 이전으로 가기",
                        "input": [
                            {
                                "text": {
                                    "raw": "이전으로 가기",
                                    "nlp": "이전 으로 가기"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "back"
                            }
                        ],
                        "id": "default27"
                    },
                    {
                        "name": "4.1감량제 처음으로 돌아가기",
                        "input": [
                            {
                                "text": {
                                    "raw": "처음으로 돌아가기",
                                    "nlp": "처음 으로 돌아가다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "call",
                                "dialogId": "startDialog",
                                "dialogName": "시작"
                            }
                        ],
                        "id": "default28"
                    }
                ],
                "task": {
                    "name": "event2month1"
                }
            },
            {
                "name": "4.2월 이벤트 이전으로 가기",
                "input": [
                    {
                        "text": {
                            "raw": "이전으로 가기",
                            "nlp": "이전 으로 가기"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "back"
                    }
                ],
                "id": "default25"
            },
            {
                "name": "4.2월 이벤트 처음으로 돌아가기",
                "input": [
                    {
                        "text": {
                            "raw": "처음으로 돌아가기",
                            "nlp": "처음 으로 돌아가다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "startDialog",
                        "dialogName": "시작"
                    }
                ],
                "id": "default26"
            }
        ]
    },
    {
        "name": "5.상담 신청",
        "input": [
            {
                "regexp": "^5"
            },
            {
                "text": {
                    "raw": "상담 신청",
                    "nlp": "상담 신청"
                }
            },
            {
                "text": {
                    "raw": "상담 예약",
                    "nlp": "상담 예약"
                }
            },
            {
                "text": {
                    "raw": "상담 해줘",
                    "nlp": "상담 해주다"
                }
            },
            {
                "text": {
                    "raw": "상담 하고 싶다",
                    "nlp": "상담 하다 싶다"
                }
            },
            {
                "text": {
                    "raw": "상담 하고 싶어",
                    "nlp": "상담 하다 싶다"
                }
            },
            {
                "text": {
                    "raw": "상담 하고 싶은데",
                    "nlp": "상담 하다 싶다"
                }
            },
            {
                "text": {
                    "raw": "상담하다",
                    "nlp": "상담 하다"
                }
            },
            {
                "text": {
                    "raw": "상담해줘",
                    "nlp": "상담 해주다"
                }
            },
            {
                "text": {
                    "raw": "상담하고 싶은데",
                    "nlp": "상담 하고 싶다"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "상담 받고 싶은 시술은 어떤 것인가요? 복수일 경우 하나만 선택해주셔도 됩니다.",
                "buttons": [
                    {
                        "url": "",
                        "text": "성형"
                    },
                    {
                        "url": "",
                        "text": "피부&쁘띠"
                    },
                    {
                        "url": "",
                        "text": "다이어트"
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
        "id": "default14",
        "children": [
            {
                "name": "5.상담 신청 이전으로 가기",
                "input": [
                    {
                        "text": {
                            "raw": "이전으로 가기",
                            "nlp": "이전 으로 가기"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "back"
                    }
                ],
                "id": "default31"
            },
            {
                "name": "5.상담 신청 처음으로 돌아가기",
                "input": [
                    {
                        "text": {
                            "raw": "처음으로 돌아가기",
                            "nlp": "처음 으로 돌아가다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "startDialog",
                        "dialogName": "시작"
                    }
                ],
                "id": "default32"
            },
            {
                "name": "5.1상담 신청",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "아래의 신청하기 버튼을 눌러서 신청을 완료해주세요",
                        "buttons": [
                            {
                                "url": "http://hippomarketing.co.kr/foreverLanding.html",
                                "text": "상담신청"
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
                "id": "default15",
                "children": [
                    {
                        "name": "5.1상담 신청 이전으로 가기",
                        "input": [
                            {
                                "text": {
                                    "raw": "이전으로 가기",
                                    "nlp": "이전 으로 가기"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "back"
                            }
                        ],
                        "id": "default33"
                    },
                    {
                        "name": "5.1상담 신청 처음으로 돌아가기",
                        "input": [
                            {
                                "text": {
                                    "raw": "처음으로 돌아가기",
                                    "nlp": "처음 으로 돌아가다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "call",
                                "dialogId": "startDialog",
                                "dialogName": "시작"
                            }
                        ],
                        "id": "default34"
                    }
                ]
            }
        ]
    },
    {
        "name": "4.교통편 자연어 처리",
        "input": [
            {
                "text": {
                    "raw": "버스",
                    "nlp": "버스"
                }
            },
            {
                "text": {
                    "raw": "지하철",
                    "nlp": "지하철"
                }
            },
            {
                "text": {
                    "raw": "자가용",
                    "nlp": "자가용"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.transportation#+bus+\n#",
                "type": "call"
            }
        ],
        "task": {
            "name": "nlp_transportation"
        },
        "id": "default5",
        "children": [
            {
                "name": "4.교통편 자연어 처리 이전으로 가기",
                "input": [
                    {
                        "text": {
                            "raw": "이전으로 가기",
                            "nlp": "이전 으로 가기"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "back"
                    }
                ],
                "id": "default35"
            },
            {
                "name": "4.교통편 자연어 처리 처음으로 돌아가기",
                "input": [
                    {
                        "text": {
                            "raw": "처음으로 돌아가기",
                            "nlp": "처음 으로 돌아가다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "startDialog",
                        "dialogName": "시작"
                    }
                ],
                "id": "default36"
            }
        ]
    },
    {
        "name": "5.의료진 자연어 처리",
        "input": [
            {
                "types": [
                    "deanlist2"
                ]
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.selecteddean#+name+ 원장\n\n파트: +department+\n\n소개:\n +description+\n#"
            }
        ],
        "id": "default6",
        "task": {
            "name": "showdean"
        },
        "children": [
            {
                "name": "5.의료진 자연어 처리 이전으로 가기",
                "input": [
                    {
                        "text": {
                            "raw": "이전으로 가기",
                            "nlp": "이전 으로 가기"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "back"
                    }
                ],
                "id": "default37"
            },
            {
                "name": "5.의료진 자연어 처리 처음으로 돌아가기",
                "input": [
                    {
                        "text": {
                            "raw": "처음으로 돌아가기",
                            "nlp": "처음 으로 돌아가다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "startDialog",
                        "dialogName": "시작"
                    }
                ],
                "id": "default38"
            }
        ]
    },
    {
        "name": "6.성형 원장",
        "input": [
            {
                "text": {
                    "raw": "성형 원장",
                    "nlp": "성형 원장"
                }
            },
            {
                "text": {
                    "raw": "성형 파트",
                    "nlp": "성형 파트"
                }
            },
            {
                "text": {
                    "raw": "다이어트 파트",
                    "nlp": "다이어트 파트"
                }
            },
            {
                "text": {
                    "raw": "다이어트 원장",
                    "nlp": "다이어트 원장"
                }
            },
            {
                "text": {
                    "raw": "다이어트",
                    "nlp": "다이어트"
                }
            },
            {
                "text": {
                    "raw": "몸무게",
                    "nlp": "몸무게"
                }
            },
            {
                "text": {
                    "raw": "피부 파트",
                    "nlp": "피부 파트"
                }
            },
            {
                "text": {
                    "raw": "피부 원장",
                    "nlp": "피부 원장"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "의료진을 소개합니다."
            }
        ],
        "task": {
            "name": "nlp_원장"
        },
        "id": "default16",
        "children": [
            {
                "name": "6.1 성형 원장 소개",
                "input": [
                    {
                        "types": [
                            "deanlist"
                        ],
                        "text": {
                            "raw": " ",
                            "nlp": ""
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "#context.session.selecteddean#+name+ 원장\n\n파트: +department+\n\n소개:\n +description+\n#"
                    }
                ],
                "id": "default17",
                "task": {
                    "name": "showdean"
                },
                "children": [
                    {
                        "name": "6.1성형 원장 소개 이전으로 가기",
                        "input": [
                            {
                                "text": {
                                    "raw": "이전으로 가기",
                                    "nlp": "이전 으로 가기"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "back"
                            }
                        ],
                        "id": "default41"
                    },
                    {
                        "name": "6.1성형 원장 소개 처음으로 돌아가기",
                        "input": [
                            {
                                "text": {
                                    "raw": "처음으로 돌아가기",
                                    "nlp": "처음 으로 돌아가다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "call",
                                "dialogId": "startDialog",
                                "dialogName": "시작"
                            }
                        ],
                        "id": "default42"
                    }
                ]
            },
            {
                "name": "6.성형 원장 이전으로 가기",
                "input": [
                    {
                        "text": {
                            "raw": "이전으로 가기",
                            "nlp": "이전 으로 가기"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "back"
                    }
                ],
                "id": "default39"
            },
            {
                "name": "6.성형 원장 처음으로 돌아가기",
                "input": [
                    {
                        "text": {
                            "raw": "처음으로 돌아가기",
                            "nlp": "처음 으로 돌아가다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "startDialog",
                        "dialogName": "시작"
                    }
                ],
                "id": "default40"
            }
        ]
    },
    {
        "name": "7.전화번호",
        "input": [
            {
                "text": {
                    "raw": "전화번호",
                    "nlp": "전화번호"
                }
            },
            {
                "text": {
                    "raw": "전화번호알려줘",
                    "nlp": "전화번호 알다"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "포에버성형외과 \n고객센터 ☎02-561-5773~4 를 이용가능하십니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "buttons": [
                    {
                        "text": "이전으로 가기"
                    },
                    {
                        "url": "",
                        "text": "처음으로 돌아가기"
                    }
                ]
            }
        ],
        "id": "default9",
        "children": [
            {
                "name": "7.전화번호 이전으로 가기",
                "input": [
                    {
                        "text": {
                            "raw": "이전으로 가기",
                            "nlp": "이전 으로 가기"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "back"
                    }
                ],
                "id": "default43"
            },
            {
                "name": "7.전화번호 처음으로 돌아가기",
                "input": [
                    {
                        "text": {
                            "raw": "처음으로 돌아가기",
                            "nlp": "처음 으로 돌아가다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "startDialog",
                        "dialogName": "시작"
                    }
                ],
                "id": "default44"
            }
        ]
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
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "영원한 아름다움을 드리는 포에버성형외과의 포에버봇입니다.\n인공지능 포에버봇은 간단한 병원소개부터, 시술소개까지 많은 걸 알려드려요!\n나날이 학습하면서 더욱 발전하는 포에버봇이 되겠습니다.\n아직 부족하지만 많은 정보 알려드릴께요!\n\n인공지능 포에버봇에게 궁금하신 걸 물어보세요. \n\n예를들면,\n- 여우필은 어떤 피부타입에 좋나요?\n- 상담비가 있나요?\n- 트윙클링쌍커풀이 뭔가요? \n\n아니면, 아래의 목록 중 번호를 입력하셔도 되요!\n\n1. 병원 소개\n2. 교통편 \n3. 의료진 소개\n4. 2월 이벤트\n5. 상담 신청\n\n* 대화중 처음으로 가시려면 '처음' , 이전단계로 가시러면 '이전'을 입력해주세요."
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
                "text": "죄송해요 고객님. 제가 이해하지 못하는 부분이에요~\n\n포에버성형외과 고객센터(☎02-561-5773~4)를 이용가능하십니다.\n\n다른 궁금하신 걸 물어봐주시겠어요?^^",
                "kind": "Content"
            },
            {
                "text": "앗, 그 부분은 저도 잘 모르겠어요.\n\n포에버성형외과 고객센터(☎02-561-5773~4)를 이용가능하십니다.\n\n다음번에 학습해서 알려드리겠습니다!",
                "kind": "Content"
            },
            {
                "text": "그건 아직 학습되지 않아서 알려드릴수가 없네요ㅠ.ㅠ\n\n포에버성형외과 고객센터(☎02-561-5773~4)를 이용가능하십니다.\n\n다른 궁금하신 걸 물어봐주세요!",
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
