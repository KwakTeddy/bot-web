var dialogs = [
    {
        "name": "1. 실수안내",
        "input": [
            {
                "regexp": "/^1/"
            },
            {
                "regexp": "/교통/"
            },
            {
                "regexp": "/주차/"
            },
            {
                "regexp": "/버스/"
            },
            {
                "regexp": "/지하철/"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "<bot.name>교통 및 주차 안내를 원하시는군요!\n원하시는 정보를 입력해주세요.\n\n예) 지하철로 가는 방법, 주차 안내\n\n* 처음으로 가시려면 '처음' , 이전단계로 가시러면 '이전'을 입력해주세요."
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "1. 버스",
                "input": [
                    {
                        "regexp": "/버스/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "버스를 타고 오시는군요!\n\n타고오실 버스를 선택해주세요.",
                        "buttons": [
                            {
                                "text": "셔틀버스"
                            },
                            {
                                "text": "시내버스"
                            },
                            {
                                "text": "고속버스"
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
                "id": "default1",
                "children": [
                    {
                        "name": "1. 버스 셔틀버스",
                        "input": [
                            {
                                "regexp": "/셔틀버스/"
                            },
                            {
                                "regexp": "/1/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "셔틀버스 이용 안내입니다.\n\n당일 외래진료예약자 및 그 보호자, 병원직원, 자원봉사자를 위한 순환버스입니다.\n장례식장 이용, 일반용무 등으로 오신 분은 이용이 불가하니 양해 부탁드립니다.\n\n■ 운행코스: 동관 후문 버스정류장 잠실나루역 1번출구 앞 왕복운행 \n\n■ 운행시간: 평일 6:30 ~ 18:00(약 15분 간격) \n • 중식시간 운행 11:00, 11:15, 11:30, 11:45, 12:00, 12:15, 12:30 \n • 일요일, 공휴일은 운행하지 않습니다.\n\n■ 탑승장소: 강남역 2호선 6번출구, 사당역 2호선 14번출구",
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
                        "id": "default2"
                    },
                    {
                        "name": "2. 시내버스",
                        "input": [
                            {
                                "regexp": "/시내버스/"
                            },
                            {
                                "regexp": "/2/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "시내버스 타고 오시는 길\n\n■ 0000번:\n+bot.name+ 하차 (사당역 ↔ +bot.name+)\n\n■ 1111번:\n+bot.name+ 하차 (강남역 ↔ +bot.name+)",
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
                        "id": "default3"
                    },
                    {
                        "name": "3. 고속버스",
                        "input": [
                            {
                                "regexp": "/고속버스/"
                            },
                            {
                                "regexp": "/3/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "고속버스로 오시는 길\n\n■ 동서울종합터미널:\n000 버스 승차(강변역A) → 하차(\n+bot.name+)\n\n■ 고속터미널:\n고속터미널역 승차 → 교대역 환승 → +bot.name+하차",
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
                        "id": "default4"
                    }
                ]
            },
            {
                "name": "2. 지하철",
                "input": [
                    {
                        "regexp": "/지하철/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "지하철로 오시는 길\n\n■ 서울역:\n15번 출구 → 순환버스 또는 도보(5분)로 이동\n18번 출구 → 1111버스 승차 → 하차(+bot.name+)\n\n■ 강남역:\n16번 출구 →0000 버스 승차 → 하차(+bot.name+)",
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
                "id": "default5"
            },
            {
                "name": "3. 주차",
                "input": [
                    {
                        "regexp": "/주차/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "주차장은 야외 중앙주차장, 후문 주차장이 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
                        "buttons": [
                            {
                                "url": "https://map.naver.com/index.nhn?query=d2V3b3Jr&enc=b64&tab=1",
                                "text": "야외 중앙주차장 지도보기"
                            },
                            {
                                "url": "https://map.naver.com/index.nhn?query=d2V3b3Jr&enc=b64&tab=1",
                                "text": "후문 주차장 자도보기"
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
                "id": "default6"
            }
        ]
    },
    {
        "name": "2. 병원 내 위치 찾기",
        "input": [
            {
                "regexp": "/^2/"
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
        "id": "default7"
    },
    {
        "name": "3. 진료안내",
        "input": [
            {
                "regexp": "/^3/"
            },
            {
                "regexp": "/진료안내/"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "진료안내를 해드릴께요.\n\n무엇에 대해 안내해드릴까요?\n\n1. 외래진료\n2. 응급진료\n3. 진료예약상담"
            }
        ],
        "id": "default8",
        "children": [
            {
                "name": "3. 진료안내 외래진료",
                "input": [
                    {
                        "regexp": "/^1/"
                    },
                    {
                        "regexp": "/외래진료/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "외래진료와 관련해서 궁금하신 점을 입력해주세요\n\n예) 예약 업무 시간, 진료 절차 단계\n\n* 처음으로 가시려면 '처음', 이전단계로 가시러면 '이전'을 입력해주세요."
                    }
                ],
                "id": "default9",
                "children": [
                    {
                        "name": "3. 예약",
                        "input": [
                            {
                                "regexp": "/예약/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "원하시는 정보가 무엇인가요\n선택해주세요.",
                                "buttons": [
                                    {
                                        "text": "1. 예약 방법"
                                    },
                                    {
                                        "text": "2. 예약 업무 시간"
                                    },
                                    {
                                        "text": "3. 진료 받기 위한 필요 서류 안내"
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
                        "id": "default10",
                        "children": [
                            {
                                "name": "1. 예약 방법",
                                "input": [
                                    {
                                        "regexp": "/방법/"
                                    },
                                    {
                                        "regexp": "/1/"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "■ 병원 방문 예약\n - 진행절차: 수납 창구 방문→진료 신청→진료 예약→예약일에 진료과 방문\n - 예약시간: 평일 06:30~17:30 / 토요일 : 08:30~15:30\n\n■ 전화 예약 \n - 진행절차: 전화신청(0000-1111)→전화예약실 상담원 연결→진료 상담 후 예약→예약일에 진료과 방문\n - 예약시간: 평  일 : 06:00~18:0   토요일 : 08:00~17:3 일요일 : 08:30~17:30\n - 환자가 꼭 알아야 할 사항 : 성명,주민번호,주소,연락번호, 진료과(상담 후 선택가능)\n\n■ FAX 예약\n - 환자명, 주소, 전화번호, 증상, 희망진료과 작성→FAX신청(02-0000-1111)→확인 후 전화또는 FAX 통보\n - 예약시간: 24시간 가능",
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
                                "id": "default11"
                            },
                            {
                                "name": "2. 예약 업무 시간",
                                "input": [
                                    {
                                        "regexp": "/업무시간/"
                                    },
                                    {
                                        "regexp": "/2/"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "진료예약 업무 시간은 아래와 같습니다. \n• 평 일 : 06:30~17:30\n• 토요일 : 08:30~15:30",
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
                                "id": "default12"
                            },
                            {
                                "name": "3. 진료 받기 위한 필요 서류 안내",
                                "input": [
                                    {
                                        "regexp": "/서류/"
                                    },
                                    {
                                        "regexp": "/3/"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "+bot.name+은 국민건강보험법에 의거, 1-2차 병.의원에서 발급한 요양급여의뢰서(진료의뢰서)를 제출해야만 보험 급여 혜택이 가능합니다. 요양급여의뢰서(진료의뢰서) 없이도 진료는 가능하지만 보험 혜택은 못 받으시며, 차후 제출하시면 그날부터 보험 혜택을 받을 수 있습니다. 단 가정의학과,치과는 요양급여의뢰서(진료의뢰서) 없이도 건강보험혜택이 가능합니다.\n\n의료급여자(예, 거택보호자, 국가유공자, 사회복지시설 수용자, 생활보호대상자, 부양의무자가 없거나 노동능력이 없는 자 등)는 모든 진료과에 대하여 병원급 의료급여의뢰서 필요합니다. (의원, 보건소 불가) \n2종 의료급여 대상자(예, 생활보호대상자, 부양의무자가 없거나 노동능력이 없는 자) 중 ‘장애인 복지카드’ 소지 환자는 창구에 장애인등록을 신청하십시오. (의료비 경감 혜택)",
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
                                "id": "default13"
                            }
                        ]
                    },
                    {
                        "name": "3. 진료",
                        "input": [
                            {
                                "regexp": "/진료/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "외래 진료와 관련하여 원하시는 정보가 무엇인가요\n선택해주세요.",
                                "buttons": [
                                    {
                                        "text": "1. 외래 진료 시간"
                                    },
                                    {
                                        "text": "2. 진료 절차 단계"
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
                        "id": "default14",
                        "children": [
                            {
                                "name": "3. 진료 외래 진료 시간",
                                "input": [
                                    {
                                        "regexp": "/외래/"
                                    },
                                    {
                                        "regexp": "/시간/"
                                    },
                                    {
                                        "regexp": "/1/"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "외래 진료 시간은 아래와 같습니다. \n• 평 일 : 08:00~17:00 (단, 공휴일은 응급진료만 가능)\n• 토요일 : 09:00~14:30",
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
                                "id": "default15"
                            },
                            {
                                "name": "3. 진료 진료 절차 단계",
                                "input": [
                                    {
                                        "regexp": "/2/"
                                    },
                                    {
                                        "regexp": "/절차/"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "청음 오신 분인분인가요? 진료 받은적이 있는 분인가요?",
                                        "buttons": [
                                            {
                                                "text": "1. 처음 오신 분"
                                            },
                                            {
                                                "text": "2. 진료 받은적이 있는 분"
                                            }
                                        ],
                                        "image": {
                                            "url": ""
                                        }
                                    }
                                ],
                                "id": "default16",
                                "children": [
                                    {
                                        "name": "3. 진료 절차 단계 처음",
                                        "input": [
                                            {
                                                "regexp": "/1/"
                                            },
                                            {
                                                "regexp": "/처음/"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "■ 처음 오신 분 진료 절차 안내\n\n(1) 진료신청\n처음 오신 분 창구에서 진료카드를 발급받으신 후, 진료 절차를 안내 받으시기 바랍니다. 예약을 하지 않고 오신 경우에는 진료상담에서 간호사 상담 후 진료 또는 예약을 도와드립니다. 요양급여의뢰서와 건강보험증(신분증), 지참하신 외부영상자료(CD, 필름)를 제출하십시오.\n\n(2) 접수\n병원에 도착하시면 꼭 접수를 해주셔야 진료가 진행됩니다. 진료과 접수 직원에게 접수할 수 있습니다. 무인 접수대에 병원등록번호 또는 주민등록 번호를 입력하거나 바코드를 스캔하여 접수할 수 있습니다. 병원에 처음 오신 분은 처음 오신 분 창구에서 등록 후 진료과에 접수하시기 바랍니다.\n\n(3) 진행상황 확인\n동일 예약시간 환자 중 접수한 순서대로 전광판에 성명이 보입니다.\n\"예약시간\"은 현재 진료중인 환자의 진료예약시간입니다.\n\n(4) 진료\n진료예약증에는 귀하가 진료 받으실 일자와 시간이 기재되어 있으니, 진료 당일 해당 진료과로 가셔서 순번대로 진료를 받으십시오.\n\n(5) 진료 후 안내\n담당 직원에게 검사예약, 약처방 등에 대한 안내를 받으십시오. 필요 시 다음 외래 진료 예약을 하십시오.\n\n(6) 수납\n진료비 수납기 또는 수납창구에서 진료카드를 제시하시고 진료비를 납부 하신 후 진료비계산서 (영수증), 약처방전을 받으십시오. 건강보험 자격 및 주소, 전화번호 등이 변경된 경우에는 반드시 접수 수납 창구에 변경사항을 알려주시기 바랍니다.\n\n(7) 투약/주사/검사\n진료비계산서(영수증)에 귀하가 가실 곳을 확인하시기 바랍니다.\n - 원내투약: 진료비 계산서의 투약번호를 확인하시고 외래 약국의 전광판에 투약번호가 표시되면 조제된 약을 받으십시오. \n - 주사: 주사 처방이 있는 경우 해당 주사실에서 진료카드와 진료비 계산서를 제시하시면\n주사를 맞을 수 있습니다. \n - 검사: 당일 검사인 경우에는 해당 검사실로 가셔서 진료카드와 진료비 계산서를 제출하신 후 검사를 받으시고 예약 검사인 경우는 예약된 일자에 해당 검사실로 방문하시면 됩니다.\n\n(8) 귀가 / 입원\n담당의사로부터 입원이 결정된 분은 입원창구(신관 1~4번, 서관 32~40번)로 가셔서 예약 또는 입원수속을 하십시오. 원외 처방전을 가지고 원하시는 (외부)약국에 가셔서 약을 받아 귀가하십시오.",
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
                                    },
                                    {
                                        "name": "3. 진료 절차 단계 진료 받은적이 있는 분",
                                        "input": [
                                            {
                                                "regexp": "/받은적이 있는/"
                                            },
                                            {
                                                "regexp": "/2/"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "■ 진료 받은적이 있는 분(해당 진료과 초진 및 재진환자)의 진료 절차 안내\n\n(1) 진료신청\n예약된 진료과에 방문하시어 접수를 하십시오.\n지참하신 외부영상자료(CD, 필름)는 진료 전 영상자료실에 제출하시기 바랍니다.\n예약을 하지 않고 오신 경우에는 수납창구에서 당일진료 또는 진료예약을 하시기 바랍니다. 당일 진료는 해당 진료과의 예약 상황에 따라 어려울 수도 있습니다.\n\n(2) 접수\n병원에 도착하시면 꼭 접수를 해주셔야 진료가 진행됩니다. 진료과 접수 직원에게 접수할 수 있습니다. 무인 접수대에 병원등록번호 또는 주민등록 번호를 입력하거나 바코드를 스캔하여 접수할 수 있습니다. 병원에 처음 오신 분은 처음 오신 분 창구에서 등록 후 진료과에 접수하시기 바랍니다.\n\n(3) 진행상황 확인\n동일 예약시간 환자 중 접수한 순서대로 전광판에 성명이 보입니다.\n\"예약시간\"은 현재 진료중인 환자의 진료예약시간입니다.\n\n(4) 진료\n진료예약증에는 귀하가 진료 받으실 일자와 시간이 기재되어 있으니, 진료 당일 해당 진료과로 가셔서 순번대로 진료를 받으십시오.\n\n(5) 진료 후 안내\n담당 직원에게 검사예약, 약처방 등에 대한 안내를 받으십시오. 필요 시 다음 외래 진료 예약을 하십시오.\n\n(6) 수납\n진료비 수납기 또는 수납창구에서 진료카드를 제시하시고 진료비를 납부 하신 후 진료비계산서 (영수증), 약처방전을 받으십시오. 건강보험 자격 및 주소, 전화번호 등이 변경된 경우에는 반드시 접수 수납 창구에 변경사항을 알려주시기 바랍니다.\n\n(7) 투약/주사/검사\n진료비계산서(영수증)에 귀하가 가실 곳을 확인하시기 바랍니다.\n - 원내투약: 진료비 계산서의 투약번호를 확인하시고 외래 약국의 전광판에 투약번호가 표시되면 조제된 약을 받으십시오. \n - 주사: 주사 처방이 있는 경우 해당 주사실에서 진료카드와 진료비 계산서를 제시하시면\n주사를 맞을 수 있습니다. \n - 검사: 당일 검사인 경우에는 해당 검사실로 가셔서 진료카드와 진료비 계산서를 제출하신 후 검사를 받으시고 예약 검사인 경우는 예약된 일자에 해당 검사실로 방문하시면 됩니다.\n\n8. 귀가 / 입원\n담당의사로부터 입원이 결정된 분은 입원창구로 가셔서 예약 또는 입원수속을 하십시오. 원외 처방전을 가지고 원하시는 (외부)약국에 가셔서 약을 받아 귀가하십시오.",
                                                "buttons": [
                                                    {
                                                        "text": "이전으로 가기"
                                                    },
                                                    {
                                                        "text": "처음으로  돌아가기"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default18"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "3. 응급진료",
                "input": [
                    {
                        "regexp": "/응급/"
                    },
                    {
                        "regexp": "/2/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "응급진료와 관련되서 안내해 드릴께요. 궁금하신 부분을 선택해주세요.",
                        "buttons": [
                            {
                                "text": "1. 진료 절차"
                            },
                            {
                                "text": "2. 보험 혜택 안내"
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
                "id": "default20",
                "children": [
                    {
                        "name": "3. 응금진료 진료 절차",
                        "input": [
                            {
                                "regexp": "/진료 절차/"
                            },
                            {
                                "regexp": "/1/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "■ 응급실 진료 절차 안내 \n\n(1) 진료신청\n응급수납에서 진료신청서를 작성하시어 제출하시면 진료접수증이 발급 됩니다.\n\n(2) 분류실(초진실)\n분류실에 가시면 예진 후 환자 중증도에 따라 진료구역을 배정 받게 됩니다.\n\n(3) 진찰\n해당구역 응급실 간호사에게 진료접수증을 제출하시면 담당의사가 응급진료를 하게 됩니다.\n진료 후 퇴실 및 입원을 결정하게 됩니다.\n\n- 응급실 전문의 당직 근무 진료과: 내과, 소아청소년과, 정신건강의학과, 신경과, 피부과, 외과, 정형외과, 신경외과, 흉부외과, 성형외과, 산부인과, 안과, 이비인후과, 비뇨기과, 재활의학과, 가정의학과, 치과, 마취통증의학과, 영상의학과, 핵의학과, 진단검사의학과\n\n(4) 진료비 수납\n퇴실결정을 받으신 분은 응급수납창구에서 진료비를 수납하시고 영수증 및 외래진료예약증을\n받으시면 됩니다. 비응급 환자분의 경우 요양급여의뢰서(진료의뢰서)가 없으면 보험수가 100% 본인 부담입니다.\n\n(5)  투약 / 퇴실\n수납한 영수증을 간호사에게 제시하신 후 다음 진료사항과 귀가 시 주의사항에 대하여 상담하십시오.\n원내처방인 경우 외래약국 또는 간호사에게 약을 수령하시면 됩니다. 원외처방인 경우 인근 약국에서 처방전을 제시하고 약을 구입하시면 됩니다.\n\n(6) 입원\n입원결정을 받으신 분은 응급수납 창구에서 입원수속을 마친 후 입원하시면 됩니다.",
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
                        "id": "default21"
                    },
                    {
                        "name": "3. 응금진료 보험 혜택 안내",
                        "input": [
                            {
                                "regexp": "/보험/"
                            },
                            {
                                "regexp": "/2/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "보건복지부에서는 법률로써 응급의료센터를 이용하는 경증환자에 대해 보험혜택을 제한하고 있으며, 응급의료에 대한 법률 제2조에서 규정한 응급증상에 해당되지 않는 환자는 진료비에 대한 보험 혜택을 받을 수 없습니다.\n\n■ 응급증상\n- 신경학적 응급증상: 급성 의식장애, 급성 신경학적 이상, 구토ㆍ의식장애 등의 증상이 있는 두부손상\n- 심혈관계 응급증상: 심폐소생술이 필요한 증상, 급성 호흡곤란, 심계항진, 박동이상 및 쇼크\n- 중독 및 대사장애: 심한 탈수, 약물ㆍ알코올 또는 기타 물질의 과다 복용이나 중독, 급성대사장애(간부전ㆍ신부전ㆍ당뇨병 등)\n- 외과적 응급증상: 개복술을 요하는 급성 복증(급성 복막염ㆍ장폐색증ㆍ급성 췌장염 등 중한 경우에 한함), 광범위한 화상(신체 표면적의 18%이상), 관통상, 개방성ㆍ다발성 골절 또는 대퇴부 척추의 골절, 사지를 절단할 우려가 있는 혈관손상, 다발성 외상, 전신마취 하에 응급수술을 요하는 증상\n- 출혈: 계속되는 각혈, 지혈이 안 되는 출혈, 급성 위장관 출혈\n- 안과적 응급증상: 화학물질에 의한 눈의 손상, 급성 시력소실\n- 알러지: 얼굴 부종을 동반한 알러지 반응\n- 소아과적 응급증상: 소아경련성 장애\n- 정신과적 응급증상: 자신 또는 다른 사람을 해할 우려가 있는 정신장애\n\n■ 응급증상에 준하는 증상\n- 신경학적 응급증상: 의식장애\n- 심혈관계 응급증상: 호흡곤란\n- 외과적 응급증상: 화상, 급성 복증을 포함한 배의 전반적인 이상증상, 골절·외상 또는 탈골, 기타 응급수술을 요하는 증상, 배뇨장애\n- 출혈: 혈관손상\n- 소아과적 응급증상: 소아경련, 38℃ 이상인 소아 고열(공휴일ㆍ야간 등 의료서비스가 제공되기 어려운 때에 3세 이하의 소아에게 나타나는 증상을 말한다)\n- 산부인과적 응급증상: 성폭력으로 인하여 산부인과적 검사 또는 처치가 필요한 증상",
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
                        "id": "default22"
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
                    "raw": "처음으로 돌아가기",
                    "nlp": "처음으로 돌아가기"
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
                "text": "안녕하세요, +bot.name+ 입니다. \n전화, 홈페이지보다 메신저가 편한 고객님들을 위해 24시간 응답하는 챗봇입니다.\n\n+bot.name+ 안내와 관련하여 궁금하신 점을 입력해주세요. \n\n무엇을 입력해야할지 모르시겠나요? 그렇다면,아래메뉴의 중 해당하는 번호를 입력하세요:)\n\n1. 교통 및 주차 안내\n2. 병원 내 위치 찾기\n3. 진료안내"
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
