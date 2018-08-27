var dialogs = [
    {
        "name": "서울대 정보",
        "input": [
            {
                "text": {
                    "raw": "서울대의 정보가 궁금해요!",
                    "nlp": "서울대 의 정보 가 궁금하다"
                }
            },
            {
                "text": {
                    "raw": "다른 것",
                    "nlp": "다른 것"
                }
            },
            {
                "text": {
                    "raw": "정보",
                    "nlp": "정보"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "무슨 정보가 필요하지?",
                "buttons": [
                    {
                        "text": "식단"
                    },
                    {
                        "text": "도서관"
                    },
                    {
                        "text": "셔틀"
                    },
                    {
                        "text": "날씨"
                    },
                    {
                        "text": "미세먼지"
                    },
                    {
                        "text": "캠퍼스맵"
                    }
                ],
                "image": {
                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528879029229-noBg_pose3.png",
                    "displayname": "noBg_pose3.png"
                }
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "식단 날짜 선택",
                "input": [
                    {
                        "text": {
                            "raw": "식단",
                            "nlp": "식단"
                        }
                    },
                    {
                        "text": {
                            "raw": "메뉴",
                            "nlp": "메뉴"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "어떤 날짜의 식단이 궁금한가?",
                        "buttons": [
                            {
                                "text": "오늘"
                            },
                            {
                                "text": "내일"
                            }
                        ],
                        "image": {
                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528879054162-noBg_pose4.png",
                            "displayname": "noBg_pose4.png"
                        }
                    }
                ],
                "id": "default1",
                "task": {
                    "name": ""
                },
                "children": [
                    {
                        "name": "식단 식당선택",
                        "input": [
                            {
                                "if": "true"
                            },
                            {
                                "text": {
                                    "raw": "식당",
                                    "nlp": "식당"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "어느 식당의 메뉴를 알려줄까?",
                                "buttons": [
                                    {
                                        "text": "학생회관 식당"
                                    },
                                    {
                                        "text": "대학원 기숙사 식당"
                                    },
                                    {
                                        "text": "전망대(3식당)"
                                    },
                                    {
                                        "text": "자하연 식당"
                                    },
                                    {
                                        "text": "학부 기숙사 식당"
                                    },
                                    {
                                        "text": "동원생활관식당(113동)"
                                    },
                                    {
                                        "text": "220동 식당"
                                    },
                                    {
                                        "text": "아름드리(예술계식당)"
                                    },
                                    {
                                        "text": "서당골(4식당)"
                                    },
                                    {
                                        "text": "감골식당"
                                    },
                                    {
                                        "text": "제2공학관식당(302동)"
                                    },
                                    {
                                        "text": "두레미담"
                                    },
                                    {
                                        "text": "제1공학관식당(301동)"
                                    },
                                    {
                                        "text": "공대간이식당"
                                    },
                                    {
                                        "text": "수의대식당"
                                    }
                                ]
                            }
                        ],
                        "task": {
                            "name": "saveMenuDate"
                        },
                        "id": "default3",
                        "children": [
                            {
                                "name": "식단 입력 확인",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "날짜: +context.session.dateQuery+\n식당: +context.session.storeQuery+\n\n이거 맞지?",
                                        "buttons": [
                                            {
                                                "text": "맞아요!"
                                            }
                                        ]
                                    }
                                ],
                                "task": {
                                    "name": "saveMenuStore"
                                },
                                "id": "default4",
                                "children": [
                                    {
                                        "name": "식단 알림",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "맞아요!",
                                                    "nlp": "맞다"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "옛다~! 밥 잘 챙겨 먹어라~\n\n+context.session.result+",
                                                "buttons": [
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528879066953-noBg_pose6.png",
                                                    "displayname": "noBg_pose6.png"
                                                }
                                            }
                                        ],
                                        "task": {
                                            "name": "searchMenu"
                                        },
                                        "id": "default5"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "날씨",
                "input": [
                    {
                        "text": {
                            "raw": "날씨",
                            "nlp": "날씨"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "+context.session.weatherSnu+",
                        "buttons": [
                            {
                                "text": "일기예보"
                            },
                            {
                                "text": "감사합니다!"
                            },
                            {
                                "text": "다른 정보가 필요해요!"
                            },
                            {
                                "text": "처음으로!"
                            }
                        ],
                        "image": {
                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528879080727-noBg_pose6.png",
                            "displayname": "noBg_pose6.png"
                        }
                    }
                ],
                "task": {
                    "name": "searchWeather_new"
                },
                "id": "default2",
                "children": [
                    {
                        "name": "일기예보",
                        "input": [
                            {
                                "text": {
                                    "raw": "일기예보",
                                    "nlp": "일기예보"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "자하연에 오래 살다 보니까 서울대 날씨는 척 하면 알 수 있지!\n+context.session.weatherForecast+",
                                "buttons": [
                                    {
                                        "text": "감사합니다!"
                                    },
                                    {
                                        "text": "다른 정보가 필요해요!"
                                    },
                                    {
                                        "text": "처음으로!"
                                    }
                                ]
                            }
                        ],
                        "task": {
                            "name": "searchWeatherForcast"
                        },
                        "id": "default18"
                    }
                ]
            },
            {
                "name": "셔틀 시간",
                "input": [
                    {
                        "text": {
                            "raw": "셔틀",
                            "nlp": "셔틀"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "+context.session.shuttleTime+",
                        "buttons": [
                            {
                                "text": "감사합니다!"
                            },
                            {
                                "text": "다른 정보가 필요해요!"
                            },
                            {
                                "text": "처음으로!"
                            }
                        ]
                    }
                ],
                "task": {
                    "name": "searchShuttleTime"
                },
                "id": "default6"
            },
            {
                "name": "도서관 HOME",
                "input": [
                    {
                        "text": {
                            "raw": "도서관",
                            "nlp": "도서관"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "도서관의 어떤 정보를 알고싶은가?",
                        "buttons": [
                            {
                                "text": "도서관 시설 시간표"
                            },
                            {
                                "text": "중도 열람실 현황"
                            },
                            {
                                "text": "다른 정보가 필요해요!"
                            },
                            {
                                "text": "처음으로!"
                            }
                        ],
                        "image": {
                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529139369296-noBg_pose5.png",
                            "displayname": "noBg_pose5.png"
                        }
                    }
                ],
                "id": "default34",
                "children": [
                    {
                        "name": "도서관 시설 시간표",
                        "input": [
                            {
                                "text": {
                                    "raw": "도서관 시설 시간표",
                                    "nlp": "도서관 시설 시간표"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "어느 도서관의 시간표가 알고 싶느냐?",
                                "buttons": [
                                    {
                                        "text": "본관"
                                    },
                                    {
                                        "text": "관정관"
                                    },
                                    {
                                        "text": "다른 정보가 필요해요!"
                                    },
                                    {
                                        "text": "처음으로!"
                                    }
                                ]
                            }
                        ],
                        "id": "default7",
                        "children": [
                            {
                                "name": "도서관 본관 시설 목록",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "본관",
                                            "nlp": "본관"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "어떤 시설의 정보를 알려줄까?",
                                        "buttons": [
                                            {
                                                "text": "단행본자료실"
                                            },
                                            {
                                                "text": "국제기구자료실"
                                            },
                                            {
                                                "text": "본관열람실"
                                            },
                                            {
                                                "text": "자동반납기"
                                            },
                                            {
                                                "text": "다른 정보가 필요해요!"
                                            },
                                            {
                                                "text": "처음으로!"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default21",
                                "children": [
                                    {
                                        "name": "도서관 본관 국제기구 자료실",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "국제기구자료실",
                                                    "nlp": "국제 기구 자료 실"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "- 국제기구자료실(2F), 시진핑자료실(2F)\n\n월요일 ~ 금요일\n10:00 ~ 17:00\n\n토요일&공휴일&일요일\n<휴무>\n———————————\n\n시간 헷갈리지 말고 공부 열심히 하게나! 항상 응원하고 있도록 하지. 흠흠.",
                                                "buttons": [
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529140018071-noBg_pose6.png",
                                                    "displayname": "noBg_pose6.png"
                                                }
                                            }
                                        ],
                                        "id": "default23"
                                    },
                                    {
                                        "name": "도서관 본관 열람실",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "본관열람실",
                                                    "nlp": "본관 열람 실"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "도서관 - 본관\n\n- 1,2,3열람실(B2~1F)\n\n월요일 ~ 일요일 & 공휴일\n06:00 ~ 23:00 (제3A열람실은 24시간 개실)\n———————————\n\n시간 헷갈리지 말고 공부 열심히 하게나! 항상 응원하고 있도록 하지. 흠흠.",
                                                "buttons": [
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529140038148-noBg_pose6.png",
                                                    "displayname": "noBg_pose6.png"
                                                }
                                            }
                                        ],
                                        "id": "default24"
                                    },
                                    {
                                        "name": "도서관 본관 자동반납기",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "자동반납기",
                                                    "nlp": "자동 반납 기"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "도서관 - 본관\n\n- 자동반납기(1, 2F)\n\n월요일 ~ 일요일 & 공휴일\n1층 24시간, 2층 09:00 ~ 21:00\n———————————\n다 읽은 책은 제시간에 반납하도록! 안 그러면 연체료가 나올 수 있다네. 항상 응원하고 있도록 하지. 흠흠.",
                                                "buttons": [
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default25"
                                    },
                                    {
                                        "name": "도서관 본관 단행본 자료실",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "단행본자료실",
                                                    "nlp": "단행본 자료 실"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "도서관 - 본관\n\n- 단행본자료실(1~6자료실 3F, 7~8자료실 4F)\n- 신문자료실(4F)\n- 신착연속간행물실(2F), 연속간행물자료실(2F)\n- 참고자료실(2F), 정보검색실(2F)\n- 중앙대출실(2F)\n\n월요일 ~ 금요일\n09:00 ~ 21:00\n\n토요일&공휴일\n09:00 ~ 17:00\n\n일요일\n13:00 ~ 17:00\n———————————\n\n시간 헷갈리지 말고 공부 열심히 하게나! 항상 응원하고 있도록 하지. 흠흠.",
                                                "buttons": [
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529139993466-noBg_pose6.png",
                                                    "displayname": "noBg_pose6.png"
                                                }
                                            }
                                        ],
                                        "id": "default22"
                                    }
                                ]
                            },
                            {
                                "name": "도서관 관정관 시설 목록",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "관정관",
                                            "nlp": "관정 관"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "관정관의 어떤 시설의 정보를 알려줄까?",
                                        "buttons": [
                                            {
                                                "text": "멀티미디어 플라자"
                                            },
                                            {
                                                "text": "정보검색실"
                                            },
                                            {
                                                "text": "그룹스터디룸"
                                            },
                                            {
                                                "text": "7-8층 시설"
                                            },
                                            {
                                                "text": "옥상정원"
                                            },
                                            {
                                                "text": "세미나실 및 라운지"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default26",
                                "children": [
                                    {
                                        "name": "도서관 관정관 멀티미디어 플라자",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "멀티미디어 플라자",
                                                    "nlp": "멀티미디어 플라자"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "도서관 - 관정관\n\n- 멀티미디어 플라자(6F)\n\n월요일 ~ 금요일\n09:00 ~ 18:00\n\n토요일&공휴일&일요일\n<휴무>\n———————————\n\n시간 헷갈리지 말고 공부 열심히 하게나! 항상 응원하고 있도록 하지. 흠흠.",
                                                "buttons": [
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529140071731-noBg_pose6.png",
                                                    "displayname": "noBg_pose6.png"
                                                }
                                            }
                                        ],
                                        "id": "default27"
                                    },
                                    {
                                        "name": "도서관 관정관 정보검색실",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "정보검색실",
                                                    "nlp": "정보검색 실"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "도서관 - 관정관\n\n- 정보검색실(6F)\n\n월요일 ~ 일요일 & 공휴일\n09:00 ~ 23:00\n———————————\n\n시간 헷갈리지 말고 공부 열심히 하게나! 항상 응원하고 있도록 하지. 흠흠.",
                                                "buttons": [
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529140099563-noBg_pose6.png",
                                                    "displayname": "noBg_pose6.png"
                                                }
                                            }
                                        ],
                                        "id": "default28"
                                    },
                                    {
                                        "name": "도서관 관정관 그룹스터디룸",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "그룹스터디룸",
                                                    "nlp": "그룹 스터디 룸"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "도서관 - 관정관\n\n- 그룹스터디룸(2,4F)\n\n월요일 ~ 일요일 & 공휴일\n09:00 ~ 23:00\n———————————\n\n시간 헷갈리지 말고 공부 열심히 하게나! 항상 응원하고 있도록 하지. 흠흠.",
                                                "buttons": [
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529140110390-noBg_pose6.png",
                                                    "displayname": "noBg_pose6.png"
                                                }
                                            }
                                        ],
                                        "id": "default29"
                                    },
                                    {
                                        "name": "도서관 관정관 7-8층 시설",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "7-8층 시설",
                                                    "nlp": "7 - 8 층 시설"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "도서관 - 관정관\n\n- 7,8열람실(7,8F), 캐럴(7,8F), 스터디가든(2,3F)\n\n월요일 ~ 일요일 & 공휴일\n07:00 ~ 23:00\n———————————\n\n시간 헷갈리지 말고 공부 열심히 하게나! 항상 응원하고 있도록 하지. 흠흠.",
                                                "buttons": [
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529140129626-noBg_pose6.png",
                                                    "displayname": "noBg_pose6.png"
                                                }
                                            }
                                        ],
                                        "id": "default30"
                                    },
                                    {
                                        "name": "도서관 관정관 옥상정원",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "옥상정원",
                                                    "nlp": "옥상정원"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "도서관 - 관정관\n\n- 옥상정원(5F)\n\n월요일 ~ 일요일 & 공휴일\n동절기 09:00 ~ 17:00\n봄가을 09:00 ~ 18:00\n하절기 09:00 ~ 19:00\n———————————\n\n공부도 가끔씩 쉬어가면서 하려무나! 항상 응원하고 있도록 하지. 흠흠.",
                                                "buttons": [
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529140151324-noBg_pose3.png",
                                                    "displayname": "noBg_pose3.png"
                                                }
                                            }
                                        ],
                                        "id": "default31"
                                    },
                                    {
                                        "name": "도서관 관정관 세미나실 및 라운지",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "세미나실 및 라운지",
                                                    "nlp": "세미나 실 및 라운지"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "세미나실",
                                                    "nlp": "세미나 실"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "라운지",
                                                    "nlp": "라운지"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "도서관 - 관정관\n\n- 세미나실(1F), 양두석홀(3F),\n패컬티 라운지(4F), 소극장(6F)\n\n월요일 ~ 금요일\n09:00 ~ 18:00\n\n토요일&공휴일&일요일\n<휴무>\n———————————\n\n시간 헷갈리지 말고 공부 열심히 하게나! 항상 응원하고 있도록 하지. 흠흠.",
                                                "buttons": [
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529140180792-noBg_pose6.png",
                                                    "displayname": "noBg_pose6.png"
                                                }
                                            }
                                        ],
                                        "id": "default32"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "도서관 중도 열람실 현황",
                        "input": [
                            {
                                "text": {
                                    "raw": "중도 열람실 현황",
                                    "nlp": "중도 열람 실 현황"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "+context.session.librarySeatsInfo+",
                                "buttons": [
                                    {
                                        "text": "열람실별 현황"
                                    },
                                    {
                                        "text": "감사합니다!"
                                    },
                                    {
                                        "text": "다른 정보가 필요해요!"
                                    },
                                    {
                                        "text": "처음으로!"
                                    }
                                ],
                                "image": {
                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529140335588-noBg_pose4.png",
                                    "displayname": "noBg_pose4.png"
                                }
                            }
                        ],
                        "task": {
                            "name": "getLibrarySeatsInfo"
                        },
                        "id": "default35",
                        "children": [
                            {
                                "name": "중도 열람실들",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "열람실별 현황",
                                            "nlp": "열람 실별 현황"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "열람실별 좌석 현황을 보려면 열람실 이름을 선택해~",
                                        "buttons": [
                                            {
                                                "text": "제1열람실 (가)"
                                            },
                                            {
                                                "text": "제1열람실 (나)"
                                            },
                                            {
                                                "text": "제1열람실 (다)"
                                            },
                                            {
                                                "text": "제2열람실 (가)"
                                            },
                                            {
                                                "text": "제2열람실 (나)"
                                            },
                                            {
                                                "text": "제2열람실 (다)"
                                            },
                                            {
                                                "text": "제3A열람실 (가)"
                                            },
                                            {
                                                "text": "제3A열람실 (나)"
                                            },
                                            {
                                                "text": "제3B열람실 (가)"
                                            },
                                            {
                                                "text": "제3B열람실 (나)"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default36",
                                "children": [
                                    {
                                        "name": "중도 제1열람실 (가)",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "중도 제1열람실 (가)",
                                                    "nlp": "중도 제 1 열람 실 ( 가다 )"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "중도 제1열람실 (가)의 좌석 현황이야!",
                                                "buttons": [
                                                    {
                                                        "url": "http://libseat.snu.ac.kr/roomview5.asp?room_no=3",
                                                        "text": "좌석 현황 보기"
                                                    },
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529141106206-noBg_pose3.png",
                                                    "displayname": "noBg_pose3.png"
                                                }
                                            }
                                        ],
                                        "id": "default37"
                                    },
                                    {
                                        "name": "제1열람실 (나)",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "제1열람실 (나)",
                                                    "nlp": "제 1 열람 실 ( 나 )"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "중도 제1열람실 (나)의 좌석 현황이야!",
                                                "buttons": [
                                                    {
                                                        "url": "http://libseat.snu.ac.kr/roomview5.asp?room_no=4",
                                                        "text": "좌석 현황 보기"
                                                    },
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529141119354-noBg_pose3.png",
                                                    "displayname": "noBg_pose3.png"
                                                }
                                            }
                                        ],
                                        "id": "default38"
                                    },
                                    {
                                        "name": "중도 제1열람실 (다)",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "제1열람실 (다)",
                                                    "nlp": "제 1 열람 실 ( 다 )"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "중도 제1열람실 (다)의 좌석 현황이야!",
                                                "buttons": [
                                                    {
                                                        "url": "http://libseat.snu.ac.kr/roomview5.asp?room_no=5",
                                                        "text": "좌석 현황 보기"
                                                    },
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529141136706-noBg_pose3.png",
                                                    "displayname": "noBg_pose3.png"
                                                }
                                            }
                                        ],
                                        "id": "default39"
                                    },
                                    {
                                        "name": "중도 제2열람실 (가)",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "제2열람실 (가)",
                                                    "nlp": "제 2 열람 실 ( 가다 )"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "중도 제2열람실 (가)의 좌석 현황이야!",
                                                "buttons": [
                                                    {
                                                        "url": "http://libseat.snu.ac.kr/roomview5.asp?room_no=6",
                                                        "text": "좌석 현황 보기"
                                                    },
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529141155589-noBg_pose3.png",
                                                    "displayname": "noBg_pose3.png"
                                                }
                                            }
                                        ],
                                        "id": "default40"
                                    },
                                    {
                                        "name": "중도 제2열람실 (나)",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "제2열람실 (나)",
                                                    "nlp": "제 2 열람 실 ( 나 )"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "중도 제2열람실 (나)의 좌석 현황이야!",
                                                "buttons": [
                                                    {
                                                        "url": "http://libseat.snu.ac.kr/roomview5.asp?room_no=7",
                                                        "text": "좌석 현황 보기"
                                                    },
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529141173248-noBg_pose3.png",
                                                    "displayname": "noBg_pose3.png"
                                                }
                                            }
                                        ],
                                        "id": "default41"
                                    },
                                    {
                                        "name": "중도 제2열람실 (다)",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "제2열람실 (다)",
                                                    "nlp": "제 2 열람 실 ( 다 )"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "중도 제2열람실 (다)의 좌석 현황이야!",
                                                "buttons": [
                                                    {
                                                        "url": "http://libseat.snu.ac.kr/roomview5.asp?room_no=8",
                                                        "text": "좌석 현황 보기"
                                                    },
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529141201641-noBg_pose3.png",
                                                    "displayname": "noBg_pose3.png"
                                                }
                                            }
                                        ],
                                        "id": "default42"
                                    },
                                    {
                                        "name": "중도 제3A열람실 (가)",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "제3A열람실 (가)",
                                                    "nlp": "제 3 A 열람 실 ( 가다 )"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "중도 제3A열람실 (가)의 좌석 현황이야!",
                                                "buttons": [
                                                    {
                                                        "url": "http://libseat.snu.ac.kr/roomview5.asp?room_no=9",
                                                        "text": "좌석 현황 보기"
                                                    },
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529141220649-noBg_pose3.png",
                                                    "displayname": "noBg_pose3.png"
                                                }
                                            }
                                        ],
                                        "id": "default43"
                                    },
                                    {
                                        "name": "중도 제3A열람실 (나)",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "제3A열람실 (나)",
                                                    "nlp": "제 3 A 열람 실 ( 나 )"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "중도 제3A열람실 (나)의 좌석 현황이야!",
                                                "buttons": [
                                                    {
                                                        "url": "http://libseat.snu.ac.kr/roomview5.asp?room_no=10",
                                                        "text": "좌석 현황 보기"
                                                    },
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529141247405-noBg_pose3.png",
                                                    "displayname": "noBg_pose3.png"
                                                }
                                            }
                                        ],
                                        "id": "default44"
                                    },
                                    {
                                        "name": "중도 제3B열람실 (가)",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "제3B열람실 (가)",
                                                    "nlp": "제 3 B 열람 실 ( 가다 )"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "중도 제3B열람실 (가)의 좌석 현황이야!",
                                                "buttons": [
                                                    {
                                                        "url": "http://libseat.snu.ac.kr/roomview5.asp?room_no=11",
                                                        "text": "좌석 현황 보기"
                                                    },
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529141267410-noBg_pose3.png",
                                                    "displayname": "noBg_pose3.png"
                                                }
                                            }
                                        ],
                                        "id": "default45"
                                    },
                                    {
                                        "name": "중도 제3B열람실 (나)",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "제3B열람실 (나)",
                                                    "nlp": "제 3 B 열람 실 ( 나 )"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "중도 제3B열람실 (나)의 좌석 현황이야!",
                                                "buttons": [
                                                    {
                                                        "url": "http://libseat.snu.ac.kr/roomview5.asp?room_no=12",
                                                        "text": "좌석 현황 보기"
                                                    },
                                                    {
                                                        "text": "감사합니다!"
                                                    },
                                                    {
                                                        "text": "다른 정보가 필요해요!"
                                                    },
                                                    {
                                                        "text": "처음으로!"
                                                    }
                                                ],
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529141291786-noBg_pose3.png",
                                                    "displayname": "noBg_pose3.png"
                                                }
                                            }
                                        ],
                                        "id": "default46"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "캠퍼스맵",
                "input": [
                    {
                        "text": {
                            "raw": "지도",
                            "nlp": "지도"
                        }
                    },
                    {
                        "text": {
                            "raw": "캠퍼스맵",
                            "nlp": "캠퍼스 맵"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "신입생인가? 캠퍼스 지도 여기 있네~",
                        "buttons": [
                            {
                                "url": "http://map.snu.ac.kr/web/main.action",
                                "text": "캠퍼스맵 보기"
                            },
                            {
                                "text": "감사합니다!"
                            },
                            {
                                "text": "다른 정보가 필요해요!"
                            },
                            {
                                "text": "처음으로!"
                            }
                        ],
                        "image": {
                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1529063212813-noBg_pose3.png",
                            "displayname": "noBg_pose3.png"
                        }
                    }
                ],
                "id": "default20"
            },
            {
                "name": "서울대 미세먼지",
                "input": [
                    {
                        "text": {
                            "raw": "미세먼지",
                            "nlp": "미세먼지"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "+context.session.fineDustResult+",
                        "buttons": [
                            {
                                "text": "감사합니다!"
                            },
                            {
                                "text": "다른 정보가 필요해요!"
                            },
                            {
                                "text": "처음으로!"
                            }
                        ]
                    }
                ],
                "task": {
                    "name": "getFineDustInfo"
                },
                "id": "default33"
            }
        ]
    },
    {
        "id": "startDialog-Clone",
        "name": "시작-Clone",
        "input": [
            {
                "text": {
                    "raw": "보고 왔어",
                    "nlp": "보고 오다"
                }
            },
            {
                "text": {
                    "raw": "소원",
                    "nlp": "소원"
                }
            },
            {
                "text": {
                    "raw": "다른 소원",
                    "nlp": "다른 소원"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "그래, 나에 대해 이제 조금은 알겠군. 나는 서울대의 정령이다. 너라면 무엇을 가장 부러워 했겠는가?",
                "buttons": [
                    {
                        "text": "달콤한 사랑"
                    },
                    {
                        "text": "인기"
                    },
                    {
                        "text": "돈돈돈"
                    }
                ],
                "image": {
                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528881382237-noBg_pose5.png",
                    "displayname": "noBg_pose5.png"
                }
            }
        ],
        "children": [
            {
                "name": "돈 소원 로또번호 추첨",
                "input": [
                    {
                        "text": {
                            "raw": "돈",
                            "nlp": "돈"
                        }
                    },
                    {
                        "text": {
                            "raw": "돈돈돈",
                            "nlp": "돈돈"
                        }
                    },
                    {
                        "text": {
                            "raw": "다른 번호 추첨",
                            "nlp": "다른 번호 추첨"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "돈중의 돈은 불로소득이지!\n자하연에 내린 관악산의 정기를 통해 이 몸이 오늘의 로또 번호를 추첨해보겠어.\n오늘의 로또 번호는...\n\n(+context.session.randomLotto+) 이다!!!\n\n그럼, 행운을 빈다네. \n당첨되면 나에게 알려주는 거 잊지 말게나!",
                        "buttons": [
                            {
                                "text": "다른 소원"
                            },
                            {
                                "text": "다른 정보가 필요해요!"
                            },
                            {
                                "text": "처음으로!"
                            }
                        ]
                    }
                ],
                "task": {
                    "name": "getLotto"
                },
                "id": "default19"
            }
        ]
    },
    {
        "name": "성물 찾기 시작",
        "input": [
            {
                "text": {
                    "raw": "성물",
                    "nlp": "성물"
                }
            },
            {
                "text": {
                    "raw": "다른 성물 찾기",
                    "nlp": "다른 성물 찾기"
                }
            },
            {
                "text": {
                    "raw": "성물 찾기!",
                    "nlp": "성물 찾기"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "그래, 성물을 찾아서 학교를 구하고 싶은 용감한 녀석이 나타났군. 너를 기다렸어!\n그 전에, 성물을 찾기 위해선 동영상을 반드시 봐야 할 것이야.\n성물을 다 모았다면 나에게 찾아오도록 해\n어떤 성물을 찾고 싶나?",
                "buttons": [
                    {
                        "text": "감성의 소리굽쇠"
                    },
                    {
                        "text": "이성의 열쇠"
                    },
                    {
                        "text": "진리의 컴퍼스"
                    }
                ]
            }
        ],
        "id": "default8",
        "children": [
            {
                "name": "소리굽쇠",
                "input": [
                    {
                        "text": {
                            "raw": "소리굽쇠",
                            "nlp": "소리굽쇠"
                        }
                    },
                    {
                        "text": {
                            "raw": "감성",
                            "nlp": "감성"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "감성의 소리굽쇠는 특정 음을 따라가는 성질이 있지. \n그 음이 무엇이었지?",
                        "buttons": [
                            {
                                "text": "도"
                            },
                            {
                                "text": "레"
                            },
                            {
                                "text": "미"
                            },
                            {
                                "text": "파"
                            },
                            {
                                "text": "파#"
                            }
                        ]
                    }
                ],
                "task": {
                    "name": ""
                },
                "id": "default9",
                "children": [
                    {
                        "name": "성물찾기 소리굽쇠 실패",
                        "input": [
                            {
                                "text": {
                                    "raw": "도",
                                    "nlp": "도"
                                }
                            },
                            {
                                "text": {
                                    "raw": "레",
                                    "nlp": "레"
                                }
                            },
                            {
                                "text": {
                                    "raw": "파",
                                    "nlp": "파"
                                }
                            },
                            {
                                "text": {
                                    "raw": "파#",
                                    "nlp": "파 #"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "......\n서울대를 지키긴 글렀군",
                                "buttons": [
                                    {
                                        "text": "처음으로!"
                                    }
                                ],
                                "image": {
                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528912092019-noBg_pose7.png",
                                    "displayname": "noBg_pose7.png"
                                }
                            }
                        ],
                        "id": "default14"
                    },
                    {
                        "name": "성물찾기 소리굽쇠 성공",
                        "input": [
                            {
                                "text": {
                                    "raw": "미",
                                    "nlp": "밉다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "그래, 정답이다! 어쩌면 정말 서울대를 구할지도...\n내 위치는 '경영대'\n더 자세한 위치를 원한다면 다른 성물도 모아봐! 서둘러야 할 것이야",
                                "buttons": [
                                    {
                                        "text": "다른 성물 찾기"
                                    }
                                ],
                                "image": {
                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528911968602-tuner_3d.png",
                                    "displayname": "tuner_3d.png"
                                }
                            }
                        ],
                        "id": "default10"
                    }
                ]
            },
            {
                "name": "성물찾기 열쇠",
                "input": [
                    {
                        "text": {
                            "raw": "이성의 열쇠",
                            "nlp": "이성 의 열쇠"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "다음과 같이  종이를 접어 구멍을 뚫었을 때, 생기는 모양은?",
                        "buttons": [
                            {
                                "text": "1"
                            },
                            {
                                "text": "2"
                            },
                            {
                                "text": "3"
                            },
                            {
                                "text": "4"
                            },
                            {
                                "text": "5"
                            }
                        ],
                        "image": {
                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528942100859-key_quiz.png",
                            "displayname": "key_quiz.png"
                        }
                    }
                ],
                "id": "default11",
                "children": [
                    {
                        "name": "성물찾기 열쇠 정답",
                        "input": [
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
                                "text": "그래 정답이다!!! 녀석 참 똘똘하군\n어서 성물을 모아서 서울대를 지켜!!\n내 위치는 '사물함'\n더 자세한 위치를 원한다면, 다른 성물들도 찾아봐!",
                                "buttons": [
                                    {
                                        "text": "다른 성물 찾기"
                                    }
                                ],
                                "image": {
                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528912047261-key_3d.png",
                                    "displayname": "key_3d.png"
                                }
                            }
                        ],
                        "id": "default12"
                    },
                    {
                        "name": "성물찾기 열쇠 실패",
                        "input": [
                            {
                                "text": {
                                    "raw": "1",
                                    "nlp": "1"
                                }
                            },
                            {
                                "text": {
                                    "raw": "2",
                                    "nlp": "2"
                                }
                            },
                            {
                                "text": {
                                    "raw": "3",
                                    "nlp": "3"
                                }
                            },
                            {
                                "text": {
                                    "raw": "5",
                                    "nlp": "5"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "틀렸어.....\n정 모르겠다면 동영상이라도 다시 보고 와!",
                                "buttons": [
                                    {
                                        "text": "처음으로!"
                                    }
                                ],
                                "image": {
                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528912108486-noBg_pose7.png",
                                    "displayname": "noBg_pose7.png"
                                }
                            }
                        ],
                        "id": "default13"
                    }
                ]
            },
            {
                "name": "성물찾기 컴파스",
                "input": [
                    {
                        "text": {
                            "raw": "진리의 컴퍼스",
                            "nlp": "진리 의 컴퍼스"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "진리의 컴퍼스는 83동 3층 어디에 위치했었지?",
                        "buttons": [
                            {
                                "text": "엘리베이터"
                            },
                            {
                                "text": "소화전"
                            },
                            {
                                "text": "강의실"
                            },
                            {
                                "text": "복도"
                            }
                        ]
                    }
                ],
                "id": "default15",
                "children": [
                    {
                        "name": "성물찾기 컴파스 성공",
                        "input": [
                            {
                                "text": {
                                    "raw": "소화전",
                                    "nlp": "소화전"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "그래, 정답이다!!!\n내 위치는 '36번'\n더 정확한 위치를 알고 싶다면, 다른 성물들도 찾아봐!",
                                "buttons": [
                                    {
                                        "text": "다른 성물 찾기"
                                    }
                                ],
                                "image": {
                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528912139305-compass_3d.png",
                                    "displayname": "compass_3d.png"
                                }
                            }
                        ],
                        "id": "default16"
                    },
                    {
                        "name": "성물찾기 컴파스 실패",
                        "input": [
                            {
                                "text": {
                                    "raw": "엘리베이터",
                                    "nlp": "엘리베이터"
                                }
                            },
                            {
                                "text": {
                                    "raw": "강의실",
                                    "nlp": "강의실"
                                }
                            },
                            {
                                "text": {
                                    "raw": "복도",
                                    "nlp": "복도"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "전혀 아니야...\n서울대는 이대로 끝인건가...",
                                "buttons": [
                                    {
                                        "text": "처음으로"
                                    }
                                ],
                                "image": {
                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528912197304-noBg_pose7.png",
                                    "displayname": "noBg_pose7.png"
                                }
                            }
                        ],
                        "id": "default17"
                    }
                ]
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
                    "raw": "안녕",
                    "nlp": "안녕"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "나는 서울대의 정령이다. 내가 누군지 아나? 아래 링크를 보면  나한테 반할 수 있을거야. 보고 와서 다시 말 걸면 더 반겨주도록 하지.",
                "buttons": [
                    {
                        "url": "https://video.helloeko.com/v/AKPRqV?autoplay=true",
                        "text": "동영상 보기"
                    },
                    {
                        "text": "보고 왔어요~"
                    },
                    {
                        "text": "서울대의 정보가 궁금해요!"
                    },
                    {
                        "text": "성물 찾기!"
                    }
                ],
                "type": "call",
                "dialogId": "startDialog",
                "dialogName": "시작",
                "image": {
                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-files/5b14a364c6fdbf8e7206c447/blank_user682_1528078559350-1528878891689-noBg_pose2.png",
                    "displayname": "noBg_pose2.png"
                }
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
                "text": "흠흠 무슨 말인지 잘 모르겠군.",
                "kind": "Content"
            }
        ],
        "task": {
            "name": "defaultTask"
        }
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}