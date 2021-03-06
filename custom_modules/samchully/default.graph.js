var dialogs = [
    {
        "name": "고객정보 취득동의",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "[안내]\n\n<삼천리>는 개인정보를 다음의 목적을 위해 처리하며, 목적 이외의 용도로는 사용되지 않습니다. 이용 목적이 변경될 시에는 사전 동의를 구할 예정입니다. \n•가. 사용요금조회, 자동이체신청/해지 등 도시가스 사용 요금 관련 서비스 및 각종 편리한 서비스를 제공하기 위하여 개인정보를 처리합니다.\n•나. 제한적 본인 확인제에 따른 본인확인, 개인식별, 부정이용방지, 비인가 사용방지, 문의에 대한 질문 접수 및 응답 등을 목적으로 개인정보를 처리합니다.\n\n동의하시겠습니까?",
                "buttons": [
                    {
                        "text": "네"
                    },
                    {
                        "text": "아니요"
                    },
                    {
                        "url": "https://s3.ap-northeast-2.amazonaws.com/mb-playchat/production/%E1%84%83%E1%85%A9%E1%86%BC%E1%84%8B%E1%85%B4%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%82%E1%85%A2%E1%84%86%E1%85%AE%E1%86%AB.jpg",
                        "text": "자세히보기"
                    }
                ]
            }
        ],
        "id": "default76",
        "children": [
            {
                "name": "인증_고객명",
                "input": [
                    {
                        "text": {
                            "raw": "네",
                            "nlp": "네"
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
                        "text": "요금, 안전점검 메뉴를 이용하기 위해서는 고객님 인증이 필요합니다.\n삼천리에 등록된 성함, 핸드폰번호, 생년월일이 일치할 경우에만 이용 하실 수 있습니다.\n고객정보 등록 또는 수정이 필요하실 경우, 고객센터로 문의해주세요.\n\n고객센터 전화번호 (1544-3002)\n\n성함을 입력해주세요.\n예) 홍길동"
                    }
                ],
                "id": "default3",
                "task": {
                    "name": "setCall"
                },
                "children": [
                    {
                        "name": "인증_휴대폰번호",
                        "input": [
                            {
                                "types": [
                                    "saveCustomerName"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "고객명 : +context.user.customerName+\n\n삼천리에 등록된 휴대폰 번호를 입력해주세요.\n예)01012345678\n\n*본 서비스는 삼천리에 등록하신 휴대폰으로만 이용하실 수 있습니다. 핸드폰번호 미등록 또는 변경시에는 고객센터로 문의하여 등록 후 이용해주세요."
                            }
                        ],
                        "id": "default49",
                        "children": [
                            {
                                "name": "인증_생년월일",
                                "input": [
                                    {
                                        "types": [
                                            "saveCustomerMobile"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "고객명 : +context.user.customerName+\n휴대폰 번호 : +context.user.customerMobile+\n\n생년월일 앞 6자리를 입력해주세요.\n예) 900930",
                                        "if": ""
                                    }
                                ],
                                "id": "default46",
                                "children": [
                                    {
                                        "name": "인증_인증번호",
                                        "input": [
                                            {
                                                "types": [
                                                    "saveCustomerBirth"
                                                ]
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "인증번호가 문자 발송되었습니다.\n받으신 인증번호를 입력해주세요.\n예) 1234 or 123"
                                            }
                                        ],
                                        "id": "default7",
                                        "children": [
                                            {
                                                "name": "고객 검색",
                                                "input": [
                                                    {
                                                        "types": [
                                                            "checkIdentificationNum"
                                                        ]
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "삼천리 고객 검색 결과입니다.\n#context.user.customerList#\n+index+.\n고객명 : +NAME+\n주소 : +VSTELLE_ADDR+\n납부자번호 : +VKONT+\n\n#\n인증하시겠습니까?",
                                                        "buttons": [
                                                            {
                                                                "text": "네"
                                                            },
                                                            {
                                                                "text": "아니요"
                                                            }
                                                        ],
                                                        "if": "context.session.noList !== true"
                                                    },
                                                    {
                                                        "kind": "Content",
                                                        "text": "조회된 내역이 없습니다. 고객정보를 정확히 확인해 주세요.",
                                                        "if": "context.session.noList === true",
                                                        "buttons": [
                                                            {
                                                                "text": "이전"
                                                            },
                                                            {
                                                                "text": "처음"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "id": "default50",
                                                "task": {
                                                    "name": ""
                                                },
                                                "children": [
                                                    {
                                                        "name": "인증동의_",
                                                        "input": [
                                                            {
                                                                "text": {
                                                                    "raw": "네",
                                                                    "nlp": "네"
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
                                                                "kind": "Action",
                                                                "text": "인증되셨습니다.\n\n*원하시는 메뉴를 하단 버튼에서 선택해주세요*",
                                                                "type": "call",
                                                                "dialogName": "시작",
                                                                "dialogId": "startDialog"
                                                            }
                                                        ],
                                                        "task": {
                                                            "name": "authConfirm"
                                                        },
                                                        "id": "default47"
                                                    },
                                                    {
                                                        "name": "인증거절_",
                                                        "input": [
                                                            {
                                                                "text": {
                                                                    "raw": "아니다",
                                                                    "nlp": "아니다"
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
                                                                "kind": "Action",
                                                                "text": "인증을 거절하셨습니다. 처음 단계로 이동했습니다.\n\n*원하시는 메뉴를 하단 버튼에서 선택해주세요*",
                                                                "type": "call",
                                                                "dialogName": "시작",
                                                                "dialogId": "startDialog"
                                                            }
                                                        ],
                                                        "id": "default48"
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "인증_인증번호 재발송",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "ㅈ",
                                                            "nlp": "ㅈ"
                                                        }
                                                    },
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
                                                        "text": "",
                                                        "type": "call",
                                                        "dialogId": "default7",
                                                        "dialogName": "인증_인증번호"
                                                    }
                                                ],
                                                "id": "default55"
                                            },
                                            {
                                                "name": "인증_인증번호 재질의",
                                                "input": [
                                                    {
                                                        "if": "true"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Action",
                                                        "text": "고객명 : +context.user.customerName+\n휴대폰 번호 : +context.user.customerMobile+\n생년월일: +context.user.customerBirth+\n\n잘못 입력하셨습니다.\n인증번호 4자리 혹은 3자리 형식에 맞게 입력해주세요.\n시) 1234 or 123",
                                                        "type": "repeat"
                                                    }
                                                ],
                                                "id": "default54"
                                            }
                                        ],
                                        "task": {
                                            "name": "sendIdentificationNum"
                                        }
                                    },
                                    {
                                        "name": "생년월일 재질의",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "text": "고객명 : +context.user.customerName+\n휴대폰 번호 : +context.user.customerMobile+\n\n잘못 입력하셨습니다.\n생년월일 앞 6자리 형식에 맞게 입력해주세요.\n시) 900930\n\n이전으로 돌아가시려면 'ㄱ' 을, 처음으로 돌아가시려면 'ㄴ' 를 입력해주세요.",
                                                "type": "repeat"
                                            }
                                        ],
                                        "id": "default63"
                                    }
                                ],
                                "task": {
                                    "name": "addButton"
                                }
                            },
                            {
                                "name": "핸드폰번호 재질의",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "고객명 : +context.user.customerName+\n\n잘못 입력하셨습니다. 전화번호 형식에 맞게 다시 입력해주세요.\n\nex)01012345678\n\n이전으로 돌아가시려면 'ㄱ' 을, 처음으로 돌아가시려면 'ㄴ' 를 입력해주세요.",
                                        "type": "repeat"
                                    }
                                ],
                                "id": "default51"
                            }
                        ],
                        "task": {
                            "name": "addButton"
                        }
                    },
                    {
                        "name": "이름입력 재질의",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "잘못 입력하셨습니다.\n한글 이름 형식에 맞게 다시 입력해주세요.\n(한글로된 2-4글자입니다.)\n\n이전으로 돌아가시려면 'ㄱ' 을, 처음으로 돌아가시려면 'ㄴ' 를 입력해주세요.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default67"
                    }
                ]
            },
            {
                "name": "취득 거부",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "[안내]\n요금, 안전점검 메뉴를 이용하기 위해서는 개인정보 이용에 동의하셔야 합니다. \n\n*원하시는 메뉴를 하단 버튼에서 선택해주세요*",
                        "type": "call",
                        "dialogId": "startDialog",
                        "dialogName": "시작",
                        "dialog": "시작"
                    }
                ],
                "id": "default78"
            }
        ],
        "task": {
            "name": ""
        }
    },
    {
        "name": "이사/AS",
        "input": [
            {
                "text": {
                    "raw": "1. 이사 및 AS",
                    "nlp": "1 . 이사 및 AS"
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
                "text": "이사(전입/전출) 및 가스렌지 연결/철거 신청, 예약내용 확인/변경, 연결비 안내를 이용하실 수\n있습니다.\n\n자세히 보기를 클릭해주세요.",
                "buttons": [
                    {
                        "url": "http://simplereg.samchully.co.kr",
                        "text": "자세히보기"
                    },
                    {
                        "text": "이전"
                    },
                    {
                        "text": "처음"
                    }
                ]
            }
        ],
        "id": "default5",
        "children": [],
        "task": {
            "name": ""
        }
    },
    {
        "name": "요금 조회 및 납부",
        "input": [
            {
                "text": {
                    "raw": "2. 요금 조회 및 납부",
                    "nlp": "2 . 요금 조회 및 납부"
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
                "text": "[요금] 고객 목록입니다. \n원하시는 고객 번호를 선택하세요.\n#context.user.customerList#\n+index+. \n고객 이름 : +NAME+\n주소 : +VSTELLE_ADDR+\n납부자 번호 : +VKONT+\n\n#",
                "if": "context.user.auth && context.user.customerList.length != 1",
                "dialogName": "요금 조회 및 납부"
            },
            {
                "kind": "Action",
                "type": "call",
                "dialogId": "default13",
                "if": "context.user.auth && context.user.customerList.length == 1",
                "dialogName": "요금 메뉴 선택"
            },
            {
                "kind": "Action",
                "type": "call",
                "dialogId": "default76",
                "dialogName": "고객정보 취득동의",
                "dialog": "고객정보 취득동의"
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "요금 메뉴 선택",
                "input": [
                    {
                        "types": [
                            "customerListType"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "다음 고객이 선택되었습니다.\n\n이름 : +context.user.curCustomer.NAME+\n주소:  +context.user.curCustomer.VSTELLE_ADDR+\n납부자번호 :  +context.user.curCustomer.VKONT+\n\n원하시는 메뉴를 선택하세요.",
                        "if": "",
                        "buttons": [
                            {
                                "url": "",
                                "text": "1. 월별 고지내역 조회"
                            },
                            {
                                "url": "",
                                "text": "2. 월별 납부내역 조회"
                            },
                            {
                                "url": "",
                                "text": "3. 요금납부"
                            },
                            {
                                "url": "",
                                "text": "4. 고지서 재발행 신청"
                            },
                            {
                                "url": "",
                                "text": "이전"
                            },
                            {
                                "url": "",
                                "text": "처음"
                            }
                        ]
                    }
                ],
                "id": "default13",
                "children": [
                    {
                        "name": "월별 고지내역 조회",
                        "input": [
                            {
                                "text": {
                                    "raw": "1. 월별 고지내역 조회",
                                    "nlp": "1 . 월별 고 지내역 조회"
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
                                "text": "이름 : +context.user.curCustomer.NAME+\n주소:  +context.user.curCustomer.VSTELLE_ADDR+\n납부자번호 :  +context.user.curCustomer.VKONT+\n\n조회할 '고지'내역 기간을 선택해주세요.",
                                "buttons": [
                                    {
                                        "text": "1개월"
                                    },
                                    {
                                        "text": "3개월"
                                    },
                                    {
                                        "text": "6개월"
                                    },
                                    {
                                        "text": "12개월"
                                    },
                                    {
                                        "text": "이전"
                                    },
                                    {
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default14",
                        "children": [
                            {
                                "name": "고지내역 3개월",
                                "input": [
                                    {
                                        "types": [
                                            "monthType"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "[고지내역 조회]\n\n이름 : +context.user.curCustomer.NAME+\n주소:  +context.user.curCustomer.VSTELLE_ADDR+\n납부자번호 :  +context.user.curCustomer.VKONT+\n\n월별 고지내역입니다.(+context.session.selectedMonth+개월)\n#context.session.noticeHistory#\n+index+.\n고지년월: +BILLING_PERIOD+\n고지금액 : +BETRW_TOT+원\n미납금액 : +DFAMT+원\n납부마감일 : +FAEDN+\n#\n월별 상세내용을 확인할 수 있습니다.",
                                        "if": "context.session.selectedMonth === 3 || context.session.selectedMonth === 6 || context.session.selectedMonth ===12"
                                    },
                                    {
                                        "kind": "Action",
                                        "text": "",
                                        "if": "context.session.selectedMonth === 1",
                                        "type": "call",
                                        "dialogId": "default18",
                                        "dialogName": "고지내역 상세화면"
                                    }
                                ],
                                "id": "default15",
                                "children": [
                                    {
                                        "name": "고지내역 상세화면",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "+dialog.noticeDetail.BILLING_PERIOD+ 상세 내용입니다.\n\n전월지침 : +dialog.noticeDetail.PR_ZWSTNDAB+㎥\n당월지침 : +dialog.noticeDetail.ZWSTNDAB+㎥\n보정계수 : +dialog.noticeDetail.ZUSTZAHL+\n온압부과량(㎥) : +dialog.noticeDetail.I_ABRMENGE+㎥\n단위열량(MJ) : +dialog.noticeDetail.UNIT_CALORY+MJ\n사용열량(MJ) : +dialog.noticeDetail.USED_CALORY+MJ\n기본요금 : +dialog.noticeDetail.BETRW_GI+원\n사용요금 : +dialog.noticeDetail.BETRW_GA+원\n경감금액 : +dialog.noticeDetail.BETRW_DC+원\n계량기교체비 : +dialog.noticeDetail.ZRESERVE_AMT+원\n부가세 : +dialog.noticeDetail.SBETW+원\n가산금 : +dialog.noticeDetail.BETRW_D+원\n정산금액 : +dialog.noticeDetail.BETRW_JS+원\n원단위절사 : +dialog.noticeDetail.BETRW_RO+원\n재공급수수료 : +dialog.noticeDetail.BETRW_SS+원\n고지금액 : +dialog.noticeDetail.BETRW_TOT+원",
                                                "buttons": [
                                                    {
                                                        "text": "이전"
                                                    },
                                                    {
                                                        "text": "처음"
                                                    }
                                                ],
                                                "if": "context.session.isHistory === \"true\""
                                            },
                                            {
                                                "kind": "Content",
                                                "text": "[알림]\n  \n\"조회한 내역이 없습니다.\"",
                                                "if": "context.session.isHistory === \"false\"",
                                                "buttons": [
                                                    {
                                                        "text": "이전"
                                                    },
                                                    {
                                                        "text": "처음"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default18",
                                        "task": {
                                            "name": "getNoticeDetail"
                                        }
                                    }
                                ],
                                "task": {
                                    "name": "getNoticeHistory"
                                }
                            },
                            {
                                "name": "개월수 선택오류",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "1개월, 3개월, 6개월, 12개월 단위로 조회 가능합니다. \n\n조회할 고지내역 기간을 다시 선택해주세요.",
                                        "type": "repeat",
                                        "dialog": 1
                                    }
                                ],
                                "id": "default17"
                            }
                        ]
                    },
                    {
                        "name": "월별 납부내역 조회",
                        "input": [
                            {
                                "text": {
                                    "raw": "2. 월별 납부내역 조회",
                                    "nlp": "2 . 월별 납부 내 역 조회"
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
                                "text": "이름 : +context.user.curCustomer.NAME+\n주소:  +context.user.curCustomer.VSTELLE_ADDR+\n납부자번호 :  +context.user.curCustomer.VKONT+\n\n조회할 '납부'내역 기간을 선택해주세요.",
                                "buttons": [
                                    {
                                        "text": "1개월"
                                    },
                                    {
                                        "text": "3개월"
                                    },
                                    {
                                        "text": "6개월"
                                    },
                                    {
                                        "text": "12개월"
                                    },
                                    {
                                        "text": "이전"
                                    },
                                    {
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default4",
                        "children": [
                            {
                                "name": "납부내역 3개월",
                                "input": [
                                    {
                                        "types": [
                                            "monthType"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "[납부내역 조회]\n\n이름 : +context.user.curCustomer.NAME+\n주소:  +context.user.curCustomer.VSTELLE_ADDR+\n납부자번호 :  +context.user.curCustomer.VKONT+\n\n월별 납부내역입니다.(+context.session.selectedMonth+개월)\n#context.session.paymentHistory#\n+index+.\n고지년월 : +YYYYMM+\n납부방식 : +PAY_TYPE+\n납부일자 : +BUDAT+\n고지금액 : +BETRWG+원\n납부금액 : +BETRWS+원\n#",
                                        "buttons": [
                                            {
                                                "text": "이전"
                                            },
                                            {
                                                "text": "처음"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default19",
                                "children": [],
                                "task": {
                                    "name": "getPaymentHistory"
                                }
                            },
                            {
                                "name": "개월수 선택오류_납부",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "3개월, 6개월, 12개월 단위로 조회 가능합니다. \n\n조회할 고지내역 기간을 다시 선택해주세요.",
                                        "type": "repeat",
                                        "dialog": 1
                                    }
                                ],
                                "id": "default20"
                            }
                        ]
                    },
                    {
                        "name": "요금납부",
                        "input": [
                            {
                                "text": {
                                    "raw": "3. 요금납부",
                                    "nlp": "3 . 요금 납부"
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
                                "text": "요금납부를 진행합니다.\n원하시는 납부 방식을 선택해주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "신용카드 (ARS 결제)"
                                    },
                                    {
                                        "url": "",
                                        "text": "편의점 (QR코드 결제)"
                                    },
                                    {
                                        "url": "",
                                        "text": "입금전용계좌 조회"
                                    },
                                    {
                                        "url": "",
                                        "text": "이전"
                                    },
                                    {
                                        "url": "",
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default1",
                        "children": [
                            {
                                "name": "신용카드 (ARS 결제)",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "신용카드 (ARS 결제)",
                                            "nlp": "신용카드 ( ARS 결제 )"
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
                                        "text": "[신용카드(ARS 결제)]\n고객님 고유의 가상번호로 전화 한 뒤 카드정보를 입력하여 도시가스 요금을 결제하는 시스템입니다.\n#context.session.nonpaymentHistory#\n+index+. \n고지년월 : +YYYYMM+\n고지금액 : +BETRWG+ 원\n미납금액 : +BETRWP+ 원\n납기일자 : +FAEDN+\n\n#납부하실 고지년월 상단에 있는 번호를 띄어쓰기로 구분하여 입력해주세요.\n예) 1개월분일 경우 1\n     2개월분일 경우 1 2"
                                    }
                                ],
                                "id": "default12",
                                "task": {
                                    "name": "getNonpaymentList"
                                },
                                "children": [
                                    {
                                        "name": "납부연월 선택확인 신용카드",
                                        "input": [
                                            {
                                                "types": [
                                                    "multiMonthType"
                                                ]
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "선택하신 납부연월은 다음과 같습니다.\n\n#context.session.selectedNonpayment#\n+userIdx+.\n고지년월 : +YYYYMM+\n고지금액 : +BETRWG+원\n미납금액 : +BETRWP+원\n납기일자 : +FAEDN+\n\n#\n\n미납금액 합계 : +context.session.totalSelectedNonpayment+원\n\n납부를 원하시면 아래의 신용카드 납부 버튼을 눌러주세요.\n다시 선택하고 싶으시면 이전 버튼을 눌러주세요.",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "신용카드 납부"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "이전"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "처음"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default28",
                                        "children": [
                                            {
                                                "name": "신용카드 납부",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "신용카드 납부",
                                                            "nlp": "신용카드 납부"
                                                        }
                                                    },
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
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "등록된  고객님의 핸드폰 번호로 ARS결제 가상번호를 발송하였습니다. 가상번호로 전화하여 신용카드 수납절차를 진행하시기 바랍니다.",
                                                        "buttons": [
                                                            {
                                                                "text": "이전"
                                                            },
                                                            {
                                                                "text": "처음"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "task": {
                                                    "name": "payByARS"
                                                },
                                                "id": "default21"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "납부연월 선택 재질의",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "type": "repeat"
                                            }
                                        ],
                                        "id": "default30",
                                        "task": {
                                            "name": "monthSelectError"
                                        }
                                    }
                                ]
                            },
                            {
                                "name": "편의점 (QR코드 결제)",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "편의점 (QR코드 결제)",
                                            "nlp": "편의점 ( QR 코드 결제 )"
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
                                        "text": "[편의점 (QR코드 결제)]\n가까운 편의점에서 QR코드를 스캔하여 도시가스 요금을 결제하는 시스템입니다.\n#context.session.nonpaymentHistory#\n+index+.\n고지년월 : +YYYYMM+\n고지금액 : +BETRWG+ 원\n미납금액 : +BETRWP+ 원\n납기일자 : +FAEDN+\n\n#납부하실 고지년월 상단에 있는 번호를 띄어쓰기로 구분하여 입력해주세요.\n예) 1개월분일 경우 1\n       2개월분일 경우 1 2"
                                    }
                                ],
                                "id": "default23",
                                "children": [
                                    {
                                        "name": "납부연월 선택확인 QR",
                                        "input": [
                                            {
                                                "types": [
                                                    "multiMonthType"
                                                ]
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "선택하신 납부연월은 다음과 같습니다.\n\n#context.session.selectedNonpayment#\n+userIdx+.\n고지년월 : +YYYYMM+\n고지금액 : +BETRWG+원\n미납금액 : +BETRWP+원\n납기일자 : +FAEDN+\n\n#\n\n미납금액 합계 : +context.session.totalSelectedNonpayment+원\n\n납부를 원하시면 아래의 QR 코드 납부 버튼을 눌러주세요.\n다시 선택하고 싶으시면 이전 버튼을 눌러주세요.",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "QR 코드 납부"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "이전"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "처음"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default35",
                                        "children": [
                                            {
                                                "name": "QR코드 납부",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "QR 코드 납부",
                                                            "nlp": "QR 코드 납부"
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
                                                        "text": "주어진 번호로 QR코드를 발송하였습니다.\n가까운 편의점에서 QR코드를 스캔하여 요금을 결제하시기 바랍니다.",
                                                        "buttons": [
                                                            {
                                                                "url": "",
                                                                "text": "처음"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "task": {
                                                    "name": "payByQR"
                                                },
                                                "id": "default16"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "납부연월 선택 QR 재질의",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "type": "repeat"
                                            }
                                        ],
                                        "id": "default39",
                                        "task": {
                                            "name": "monthSelectError"
                                        }
                                    }
                                ],
                                "task": {
                                    "name": "getNonpaymentList"
                                }
                            },
                            {
                                "name": "입금전용계좌 조회",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "입금전용계좌 조회",
                                            "nlp": "입금 전용 계좌 조회"
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
                                        "text": "고객님별로 부여된 가상계좌를 통하여 계좌이체로  도시가스 요금을 결제하는 시스템입니다.\n\n기 생선된 계좌번호 입니다. \n입금을 원하시는 계좌에 납부해주세요\n\n#context.session.nonpaymentHistory#\n은행명 : +BANKA+\n계좌번호 : +BANKN+\n\n#"
                                    }
                                ],
                                "id": "default24",
                                "children": [
                                    {
                                        "name": "입금전용계좌 생성",
                                        "input": [
                                            {
                                                "types": [
                                                    "selectedAccountType"
                                                ]
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "+dialog.userInput.selectedBank+은행 입금전용계좌가 생성됐습니다.\n\n은행 : +dialog.userInput.selectedBank+은행\n계좌 : +dialog.createdBankAccount+\n\n위의 계좌로 입금하시면 됩니다.",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "이전"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "처음"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default25",
                                        "children": [],
                                        "task": {
                                            "name": "createDepositAccount"
                                        }
                                    }
                                ],
                                "task": {
                                    "name": "getAccountList"
                                }
                            }
                        ]
                    },
                    {
                        "name": "고지서 재발행 신청",
                        "input": [
                            {
                                "text": {
                                    "raw": "4. 고지서 재발행 신청",
                                    "nlp": "4 . 고지서 재발 행 신청"
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
                                "text": "고객님의 고지방법  '+dialog.curNoticeMethod+' (으)로 재발행이 완료되었습니다.",
                                "buttons": [
                                    {
                                        "text": "이전"
                                    },
                                    {
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default11",
                        "children": [],
                        "task": {
                            "name": "resendNotice"
                        }
                    }
                ]
            }
        ],
        "task": {
            "name": "getCustomerList"
        }
    },
    {
        "name": "전자고지, 자동이체 신청/해지",
        "input": [
            {
                "text": {
                    "raw": "3. 전자고지, 자동이체 신청/해지",
                    "nlp": "3 . 전자 고지 , 자동 이체 신청 / 해지"
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
                "text": "[요금] 고객 목록입니다. \n원하시는 고객 번호를 선택하세요.\n#context.user.customerList#\n+index+. \n고객 이름 : +NAME+\n주소 : +VSTELLE_ADDR+\n납부자 번호 : +VKONT+\n\n#",
                "if": "context.user.auth && context.user.customerList.length != 1",
                "dialogName": "요금"
            },
            {
                "kind": "Action",
                "type": "call",
                "dialogId": "default37",
                "if": "context.user.auth && context.user.customerList.length == 1",
                "dialogName": "요금 메뉴 선택"
            },
            {
                "kind": "Action",
                "type": "call",
                "dialogId": "default76",
                "dialogName": "고객정보 취득동의",
                "dialog": "고객정보 취득동의"
            }
        ],
        "id": "default36",
        "children": [
            {
                "name": "요금 메뉴 선택",
                "input": [
                    {
                        "types": [
                            "customerListType"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "다음 고객이 선택되었습니다.\n\n이름 : +context.user.curCustomer.NAME+\n주소:  +context.user.curCustomer.VSTELLE_ADDR+\n납부자번호 :  +context.user.curCustomer.VKONT+\n\n원하시는 메뉴를 선택하세요.",
                        "if": "",
                        "buttons": [
                            {
                                "url": "",
                                "text": "1. 전자고지 신청/해지"
                            },
                            {
                                "url": "",
                                "text": "2. 자동이체 신청/해지"
                            },
                            {
                                "url": "",
                                "text": "이전"
                            },
                            {
                                "url": "",
                                "text": "처음"
                            }
                        ]
                    }
                ],
                "id": "default37",
                "children": [
                    {
                        "name": "전자고지 신청/해지",
                        "input": [
                            {
                                "text": {
                                    "raw": "1. 전자고지 신청/해지",
                                    "nlp": "1 . 전자 고지 신청 / 해지"
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
                                "text": "현재 고지 방법입니다.\n\n고지방법: +dialog.curNoticeMethod+\n\n 전자고지를 신청(변경)이나 해지를 원하시면 아래의 버튼을 눌러주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "신청/변경"
                                    },
                                    {
                                        "url": "",
                                        "text": "해지"
                                    },
                                    {
                                        "url": "",
                                        "text": "이전"
                                    },
                                    {
                                        "url": "",
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default2",
                        "children": [
                            {
                                "name": "전자고지 신청/변경",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "신청/변경",
                                            "nlp": "신청 / 변경"
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
                                        "text": "원하시는 고지 방법을 선택해주세요.",
                                        "buttons": [
                                            {
                                                "text": "카카오알림톡 고지"
                                            },
                                            {
                                                "text": "카카오페이 고지"
                                            },
                                            {
                                                "text": "LMS 고지"
                                            },
                                            {
                                                "text": "이메일 고지"
                                            },
                                            {
                                                "text": "이전"
                                            },
                                            {
                                                "text": "처음"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default26",
                                "children": [
                                    {
                                        "name": "카카오알림톡",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "카카오알림톡 고지",
                                                    "nlp": "카카오 알림 톡 고지"
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
                                                "text": "카카오알림톡 고지 신청을 계속 진행하시겠습니까?",
                                                "buttons": [
                                                    {
                                                        "text": "네"
                                                    },
                                                    {
                                                        "text": "이전"
                                                    },
                                                    {
                                                        "text": "처음"
                                                    }
                                                ]
                                            }
                                        ],
                                        "task": {
                                            "name": ""
                                        },
                                        "id": "default79",
                                        "children": [
                                            {
                                                "name": "카카오알림톡 완료",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "네",
                                                            "nlp": "네"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "정상적으로 처리되었습니다.",
                                                        "buttons": [
                                                            {
                                                                "text": "이전"
                                                            },
                                                            {
                                                                "text": "처음"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "id": "default80",
                                                "task": {
                                                    "name": "setNoticeMethod_kkoalarm"
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        "name": "카카오",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "카카오페이 고지",
                                                    "nlp": "카카오 페이 고지"
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
                                                "text": "등록된 고객님의 핸드폰 번호로 카카오페이 고지 신청 알림톡을 송부해드렸습니다.",
                                                "buttons": [
                                                    {
                                                        "text": "이전"
                                                    },
                                                    {
                                                        "text": "처음"
                                                    }
                                                ]
                                            }
                                        ],
                                        "task": {
                                            "name": "setNoticeMethod_kkopay"
                                        },
                                        "id": "default32",
                                        "children": []
                                    },
                                    {
                                        "name": "LMS 고지",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "LMS 고지",
                                                    "nlp": "LMS 고지"
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
                                                "text": "현재 고지방법이 고객센터를 통한 종이고지서 송달로 되어 있습니다. 전자고지를 원하실 경우 신청 메뉴를 눌러주세요.",
                                                "buttons": [
                                                    {
                                                        "text": "이전"
                                                    },
                                                    {
                                                        "text": "처음"
                                                    }
                                                ]
                                            }
                                        ],
                                        "task": {
                                            "name": ""
                                        },
                                        "id": "default33",
                                        "children": []
                                    },
                                    {
                                        "name": "이메일",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "이메일 고지",
                                                    "nlp": "이메일 고지"
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
                                                "text": "받으실 이메일 주소를 입력해주세요.\n\n이전으로 돌아가시려면 'ㄱ' 을 입력해주세요.\n처음으로 돌아가시려면 'ㄴ' 을 입력해주세요."
                                            }
                                        ],
                                        "task": {
                                            "name": ""
                                        },
                                        "id": "default29",
                                        "children": [
                                            {
                                                "name": "이메일 고지 설정",
                                                "input": [
                                                    {
                                                        "types": [
                                                            "email"
                                                        ]
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "정상적으로 처리되셨습니다.",
                                                        "buttons": [
                                                            {
                                                                "url": "",
                                                                "text": "처음"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "task": {
                                                    "name": "setNoticeMethod_email"
                                                },
                                                "id": "default34"
                                            },
                                            {
                                                "name": "이메일 재질의",
                                                "input": [
                                                    {
                                                        "if": "true"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Action",
                                                        "type": "repeat",
                                                        "dialog": 1,
                                                        "text": "잘못 입력하셨습니다.\n\n이메일 형식에 맞게 다시 입력해주세요."
                                                    }
                                                ],
                                                "id": "default27"
                                            }
                                        ]
                                    }
                                ],
                                "task": {
                                    "name": ""
                                }
                            },
                            {
                                "name": "전자고지 해지",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "해지",
                                            "nlp": "해지"
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
                                        "text": "해지를 계속 진행하시겠습니까?",
                                        "buttons": [
                                            {
                                                "text": "네"
                                            },
                                            {
                                                "text": "이전"
                                            },
                                            {
                                                "text": "처음"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default31",
                                "children": [
                                    {
                                        "name": "전자고지 해지 원료",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "네",
                                                    "nlp": "네"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "정상적으로 처리되었습니다.",
                                                "buttons": [
                                                    {
                                                        "text": "이전"
                                                    },
                                                    {
                                                        "text": "처음"
                                                    }
                                                ]
                                            }
                                        ],
                                        "task": {
                                            "name": "cancelNoticeMethod"
                                        },
                                        "id": "default59"
                                    }
                                ],
                                "task": {
                                    "name": ""
                                }
                            }
                        ],
                        "task": {
                            "name": "getNoticeMethod"
                        }
                    },
                    {
                        "name": "자동이체 신청해지",
                        "input": [
                            {
                                "text": {
                                    "raw": "2. 자동이체 신청/해지",
                                    "nlp": "2 .   자동 이체 신청 / 해지"
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
                                "text": "현재 납부방법입니다.\n\n납부방법 : +dialog.curPaymentMethod+\n\n자동이체 신청(변경)이나 해지를 원하시면 아래의 버튼을 눌러주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "신청/변경"
                                    },
                                    {
                                        "url": "",
                                        "text": "해지"
                                    },
                                    {
                                        "url": "",
                                        "text": "이전"
                                    },
                                    {
                                        "url": "",
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default9",
                        "children": [
                            {
                                "name": "자동이제 신청",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "신청/변경",
                                            "nlp": "신청 / 변경"
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
                                        "text": "금융결제원의 정책에따라 자동이체 동의자료 녹취가 필요합니다. 은행/카드자동이체를 원하시는 고객님께서는 관할 고객센터로 연락주시기 바랍니다.\n\n고객센터(1544-3002)"
                                    }
                                ],
                                "id": "default53",
                                "task": {
                                    "name": "setCall"
                                }
                            },
                            {
                                "name": "자동이제 해지",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "해지",
                                            "nlp": "해지"
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
                                        "text": "자동이체 해지를 계속 진행하시겠습니까?",
                                        "buttons": [
                                            {
                                                "text": "네"
                                            },
                                            {
                                                "text": "이전"
                                            },
                                            {
                                                "text": "처음"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default57",
                                "task": {
                                    "name": ""
                                },
                                "children": [
                                    {
                                        "name": "자동이제 해지 완료",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "네",
                                                    "nlp": "네"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "정상적으로 처리되었습니다.",
                                                "buttons": [
                                                    {
                                                        "text": "이전"
                                                    },
                                                    {
                                                        "text": "처음"
                                                    }
                                                ]
                                            }
                                        ],
                                        "task": {
                                            "name": "cancelAutoTransfer"
                                        },
                                        "id": "default77"
                                    }
                                ]
                            }
                        ],
                        "task": {
                            "name": "getPaymentMethod"
                        }
                    }
                ]
            }
        ],
        "task": {
            "name": "getCustomerList"
        }
    },
    {
        "name": "자가검침 입력",
        "input": [
            {
                "text": {
                    "raw": "4. 자가검침 입력",
                    "nlp": "4 . 자가 검침 입력"
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
                "text": "[요금] 고객 목록입니다. \n원하시는 고객 번호를 선택하세요.\n#context.user.customerList#\n+index+. \n고객 이름 : +NAME+\n주소 : +VSTELLE_ADDR+\n납부자 번호 : +VKONT+\n\n#",
                "if": "context.user.auth && context.user.customerList.length != 1",
                "dialogName": "요금"
            },
            {
                "kind": "Action",
                "type": "call",
                "dialogId": "default10",
                "if": "context.user.auth && context.user.customerList.length == 1",
                "dialogName": "자가 검침 입력"
            },
            {
                "kind": "Action",
                "type": "call",
                "dialogId": "default76",
                "dialogName": "고객정보 취득동의",
                "dialog": "고객정보 취득동의"
            }
        ],
        "id": "default38",
        "children": [
            {
                "id": "default10",
                "children": [],
                "task": {
                    "name": "selfRFC"
                },
                "name": "자가 검침 입력",
                "input": [
                    {
                        "types": [
                            "customerListType"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "등록된 고객님의 핸드폰 번호로 검침 안내 메시지가 발송 되었습니다.",
                        "buttons": [
                            {
                                "text": "이전"
                            },
                            {
                                "text": "처음"
                            }
                        ]
                    }
                ]
            }
        ],
        "task": {
            "name": "getCustomerList"
        }
    },
    {
        "name": "안전",
        "input": [
            {
                "text": {
                    "raw": "5",
                    "nlp": "5"
                }
            },
            {
                "text": {
                    "raw": "5. 안전점검 및 가스누출/화재 신고",
                    "nlp": "5 . 안전 점검 및 가스 누 추다 / 화재 신고"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "[요금] 고객 목록입니다. \n원하시는 고객 번호를 선택하세요.\n#context.user.customerList#\n+index+. \n고객 이름 : +NAME+\n주소 : +VSTELLE_ADDR+\n납부자 번호 : +VKONT+\n\n#",
                "if": "context.user.auth && context.user.customerList.length != 1"
            },
            {
                "kind": "Action",
                "type": "call",
                "if": "context.user.auth && context.user.customerList.length == 1",
                "dialogId": "default60",
                "dialogName": "안전점검메뉴선택"
            },
            {
                "kind": "Action",
                "if": "!context.user.auth",
                "type": "call",
                "dialogId": "default76",
                "dialogName": "고객정보 취득동의"
            }
        ],
        "id": "default6",
        "children": [
            {
                "name": "안전점검메뉴선택",
                "input": [
                    {
                        "types": [
                            "customerListType"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "다음 고객이 선택되었습니다.\n\n이름 : +context.user.curCustomer.NAME+\n주소:  +context.user.curCustomer.VSTELLE_ADDR+\n납부자번호 :  +context.user.curCustomer.VKONT+\n\n원하시는 메뉴를 선택하세요.",
                        "buttons": [
                            {
                                "text": "안전점검"
                            },
                            {
                                "text": "가스누출 및 화재신고"
                            },
                            {
                                "text": "이전"
                            },
                            {
                                "text": "처음"
                            }
                        ]
                    }
                ],
                "id": "default60",
                "children": [
                    {
                        "name": "안전점검-detail",
                        "input": [
                            {
                                "text": {
                                    "raw": "안전점검",
                                    "nlp": "안전 점검"
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
                                "text": "원하시는 메뉴를 선택해주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "안전점검월 조회"
                                    },
                                    {
                                        "url": "",
                                        "text": "안전점검 결과 내역"
                                    },
                                    {
                                        "url": "",
                                        "text": "이전"
                                    },
                                    {
                                        "url": "",
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default61",
                        "children": [
                            {
                                "name": "안전 점검 월 조회",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "안전점검월 조회",
                                            "nlp": "안전 점검 월 조회"
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
                                        "text": "가스용도 : +dialog.data.gasType+\n안전점검월 : +dialog.data.month+\n ※ 도시가스사업법에 따라 \n    취사용 1년 1회, 그외 1년 2회\n    안전점검이 시행됩니다.",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "이전"
                                            },
                                            {
                                                "url": "",
                                                "text": "처음"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default43",
                                "task": {
                                    "name": "getSafetyCheckMonth"
                                }
                            },
                            {
                                "name": "안전점검 결과 내역",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "안전점검 결과 내역",
                                            "nlp": "안전 점검 결과 내 역"
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
                                        "text": "안전점검 결과 내역입니다\n\n#dialog.data.list#\n안전점검일 : +CHK_YYMM+\n확인자: +SCR_MGR_NO+\n확인자와의 관계: +SCR_MGR_CLF+\n점검결과 :+CHK_YN+\n\n#",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "이전"
                                            },
                                            {
                                                "url": "",
                                                "text": "처음"
                                            }
                                        ]
                                    }
                                ],
                                "task": {
                                    "name": "getSafetyCheckResult"
                                },
                                "id": "default62"
                            }
                        ]
                    },
                    {
                        "name": "누출 화재 긴급연결",
                        "input": [
                            {
                                "text": {
                                    "raw": "2",
                                    "nlp": "2"
                                }
                            },
                            {
                                "text": {
                                    "raw": "가스누출 및 화재신고",
                                    "nlp": "가스 누 추다 및 화재 신고"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": ""
                            }
                        ],
                        "task": {
                            "name": "setCenterCall"
                        },
                        "id": "default45"
                    }
                ]
            }
        ],
        "task": {
            "name": "getCustomerList"
        }
    },
    {
        "name": "기타",
        "input": [
            {
                "text": {
                    "raw": "6. 이용가이드 및 FAQ 등",
                    "nlp": "6 . 이용 가이드 및 FAQ 등"
                }
            },
            {
                "text": {
                    "raw": "6",
                    "nlp": "6"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "원하시는 메뉴를 선택해주세요.",
                "buttons": [
                    {
                        "text": "1. 도시가스 이용가이드"
                    },
                    {
                        "text": "2. 자주 묻는 질문"
                    },
                    {
                        "text": "3. 관할 고객센터 조회"
                    },
                    {
                        "text": "이전"
                    },
                    {
                        "text": "처음"
                    }
                ]
            }
        ],
        "id": "default8",
        "children": [
            {
                "name": "자주 묻는 질문",
                "input": [
                    {
                        "text": {
                            "raw": "2. 자주 묻는 질문",
                            "nlp": "2 . 자주 묻다 질문"
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
                        "text": "원하시는 메뉴를 선택해주세요.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "1. 요금체납 시 중단 시기"
                            },
                            {
                                "url": "",
                                "text": "2. 가스요금 납부방법"
                            },
                            {
                                "url": "",
                                "text": "3. 자동이체 적용시기"
                            },
                            {
                                "url": "",
                                "text": "4. 사회적 배려대상 요금경감제도"
                            },
                            {
                                "url": "",
                                "text": "5. 이중수납 환불제도"
                            },
                            {
                                "url": "",
                                "text": "6. 갑자기 요금이 많이 나왔을때"
                            },
                            {
                                "url": "",
                                "text": "7. 서비스 품질보상 제도 안내"
                            },
                            {
                                "url": "",
                                "text": "8. 연체가산금 안내"
                            },
                            {
                                "url": "",
                                "text": "9. 고지서 명의변경 방법"
                            },
                            {
                                "url": "",
                                "text": "10. 자동이체 통장 잔액부족"
                            },
                            {
                                "url": "",
                                "text": "이전"
                            },
                            {
                                "url": "",
                                "text": "처음"
                            }
                        ]
                    }
                ],
                "id": "default44",
                "children": [
                    {
                        "name": "요금체납 시 중단 시기",
                        "input": [
                            {
                                "text": {
                                    "raw": "1. 요금체납 시 중단 시기",
                                    "nlp": "1 . 요금 체납 시 중단 시기"
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
                                "text": "1개월 체납일 경우 '독촉장'이 나가며 2개월 체납일 경우 '공급중지 예고서'가 발송됩니다.\n중지예고서의 기간내에 납부하지 않은 경우 부득이 가스 공급이 중지됩니다.\n중지 후 재공급 시 익월요금에 해제수수료(2,200원/건)가 부과되므로 참고하시기 바랍니다.\n혹, 이미 중단이 되셨다면 체납금을 납부 하신 후 해당 고객센터로 연락하시어 재공급을 받으시면 됩니다.",
                                "buttons": [
                                    {
                                        "text": "이전"
                                    },
                                    {
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default65"
                    },
                    {
                        "name": "가스요금 납부방법",
                        "input": [
                            {
                                "text": {
                                    "raw": "2. 가스요금 납부방법",
                                    "nlp": "2 . 가스요금 납부 방법"
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
                                "text": "1. 통장이나 신용카드 자동이체\n2. 신용카드 ARS 결제(산업용 제외)\n3. 편의점 QR코드 납부\n4. 카카오페이 청구서 납부\n5. 농협 스마트 고지서 납부\n6. 은행 방문 지로고지서 또는 ATM기기 납부\n7. 은행 뱅킹 또는 금융결제원 인터넷 지로 납부(지로번호 4000077)\n8. 입금전용계좌 입금",
                                "buttons": [
                                    {
                                        "text": "이전"
                                    },
                                    {
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default66"
                    },
                    {
                        "name": "자동이체 적용시기",
                        "input": [
                            {
                                "text": {
                                    "raw": "3. 자동이체 적용시기",
                                    "nlp": "3 . 자동 이체 적용 시기"
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
                                "text": "자동이체 신청 시 삼천리, 금융결제원, 해당은행간 실명제확인 절차로 인해 일정 시일이 소요될 수 있어 정확한 적용시점을 안내드리기 어렵습니다.  \n자동이체 적용 완료시 고지서상에 자동이체로 표시되오니, 자동이체 표시된 고지서를 받기 전까지는 별도의 방법으로 요금을 납부하여 주시기 바랍니다.\n자동이체는 고객님의 납기일 3일 전에 금융결제원으로 청구자료가 발송되어 중복납부되실 수 있사오니, 해지시 주의하여 주시길 부탁드립니다.",
                                "buttons": [
                                    {
                                        "text": "이전"
                                    },
                                    {
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default68"
                    },
                    {
                        "name": "사회적 배려대상 요금경감제도",
                        "input": [
                            {
                                "text": {
                                    "raw": "4. 사회적 배려대상 요금경감제도",
                                    "nlp": "4 . 사회 적 배려 대상 요금 경감 제도"
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
                                "text": "□ 개요\n   ◦ 적용용도 : 주택난방, 취사용, 공동주택 중앙난방(열병합시설제외)\n   ◦ 적용시기 : 요금경감 신청한 날의 익일 사용량부터 적용 \n□ 경감대상자 \n   ◦ “장애인 복지법”에서 정한 1~3급 장애인\n   ◦ “국가유공자 등 예우 및 지원에 관한 법률” 및 “5.18 민주유공자 예우에 관한 법률”에서 정한 1~3급 상이자\n   ◦ “독립유공자 예우에 관한 법률”에 의한 독립유공자 또는 수급자\n   ◦ “국민기초생활보장법”에서 정한 기초생활수급자\n   - 차상위계층자\n     1. \"국민기초생활보장법\"에 따라 자활사업에 참여하는 자\n     2. \"국민건강보험법 시행령(별표2 제3호)”에 따라 희귀난치성질환을 가진 자로서 본인부담액을 경감받는 자\n     3. \"장애인복지법(제49,50조)‘에 따라 장애수당을 받는 18세 이상 장애인 및 장애아동수당을 받는 18세 미만 장애인\n     4. \"한부모가족지원법(제5조)”에 따라 양육비와 학비를 지원받는 모자가정, 부자가정, 조손가정\n     5. \"보건복지부로부터 “우선돌봄이 차상위 가구 결정통지”를 받은 가구\n       - 다자녀가구 : 세대별 주민등록표상 세대주와의 관계가 “자(子)” 또는 “손(孫)”이 각각 3인 이상으로 표시된 주거용 주택의 세대주  \n□ 경감신청방법\n   - 접 수 처 : ㈜삼천리 고객센터 , 주민센터\n   - 신청서류 : 도시가스요금 경감신청서\n□ 유의사항\n - 전자정부서비스를 이용하여 가스요금경감관리시스템에서 \n    매월 말 경감자격 확인\n - 자격을 상실하였을 경우 그 사실을 해당자에게 통보하며\n    15일 이내 이의가 없을 경우 경감대상에서 해지처리   \n - 다자녀가구와 외국인은 별도 자격갱신\n - 이사/사망/수급해지 등 변동사항 발생시에는 도시가스사에 통보하여야 하며 부당수급 시 금전적 벌칙 발생 \n - 중앙난방 사용세대는 아파트관리사무소로 경감신청",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "이전"
                                    },
                                    {
                                        "url": "",
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default69"
                    },
                    {
                        "name": "이중수납 환불제도",
                        "input": [
                            {
                                "text": {
                                    "raw": "5. 이중수납 환불제도",
                                    "nlp": "5 . 이중 수납 환불 제도"
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
                                "text": "이중으로 납부된 경우에는 다음달 요금에서 자동 감액된 후 고지 됩니다.\n또한, 현금으로 환불을 원하실 경우에는 관할 고객센터(1544-3002)에 전화로 신청하시면 환불해드립니다.\n혹, 전출시 직접 납부하시고 자동이체로 이중수납이 되신 일부의 경우에는 수납확인이 되면 자동으로 환불해드립니다.",
                                "buttons": [
                                    {
                                        "text": "이전"
                                    },
                                    {
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default70"
                    },
                    {
                        "name": "갑자기 요금이 많이 나왔을때",
                        "input": [
                            {
                                "text": {
                                    "raw": "6. 갑자기 요금이 많이 나왔을때",
                                    "nlp": "6 . 갑자기 요금 이 많이 나오다 때"
                                }
                            },
                            {
                                "text": {
                                    "raw": "6",
                                    "nlp": "6"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "요금이 많이 나오는 경우는\n1. 사용패턴, 기후변화 등으로 실제 많이 사용한 경우\n2. 보일러 오작동인 경우\n3. 온수 누수인 경우\n4. 계량기 불량인 경우\n5. 가스 누설인 경우\n6. 착오 검침인 경우\n위와 같은 경우를 예측할 수 있습니다.\n그러므로 고객님 댁의 상황을 먼저 확인 하신 후 고지서의 당월지침과 계량기의 현지침을 비교하신 후 해당 고객센터로 문의 하시기 바랍니다.\n고객센터 전화번호 (1544-3002)"
                            }
                        ],
                        "id": "default71",
                        "task": {
                            "name": "setCall"
                        }
                    },
                    {
                        "name": "서비스 품질보상제도 안내",
                        "input": [
                            {
                                "text": {
                                    "raw": "7. 서비스 품질보상 제도 안내",
                                    "nlp": "7 . 서비스 품질 보상 제도 안내"
                                }
                            },
                            {
                                "text": {
                                    "raw": "7",
                                    "nlp": "7"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "고객님, 안녕하십니까? 삼천리 도시가스입니다.\n고객님께 불편을 드려 정말 죄송합니다.\n당사에서는 깨끗한 도시가스를 고객님 댁에 제공하여 편리하고 안전하게 사용하실 수 있도록 서비스 품질보증 제도에 따라 성실한 서비스 제공을 약속 드리고 있으며, 잘못된 서비스에 대해서는 공정거래위원회의 소비자분쟁해결 기준은 물론, 당사의 서비스 품질보상 규정에 따라 공정하고 객관적인 보상이 되도록 노력하겠습니다.\n\n자세히보기를 클릭해주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "이전"
                                    },
                                    {
                                        "url": "",
                                        "text": "처음"
                                    },
                                    {
                                        "url": "https://www.samchully.co.kr/customer/gas/info/service/warranty.do",
                                        "text": "자세히보기"
                                    }
                                ]
                            }
                        ],
                        "id": "default72"
                    },
                    {
                        "name": "연체가산금 안내",
                        "input": [
                            {
                                "text": {
                                    "raw": "8. 연체가산금 안내",
                                    "nlp": "8 . 연체 가산금 안내"
                                }
                            },
                            {
                                "text": {
                                    "raw": "8",
                                    "nlp": "8"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "고객님께서 가스사용요금에 대해 납부기일내 요금을 납부하지 않을 경우 가산금이 부과됩니다.\n가산금 부과 방식은 월 2%가 지연일수가 확인되는 시점 익월 또는 익익월 고지서에 납부 지연일수 만큼 일할계산되어 청구됩니다.\n\n예) 고객님께서 사용금액 10,000원에 대해 15일 지연하여 납부하실 경우,\n* 가산금 =  10,000원 × 2% × 15일/30일 = 100원",
                                "buttons": [
                                    {
                                        "text": "이전"
                                    },
                                    {
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default73"
                    },
                    {
                        "name": "고지서 명의변경 방법",
                        "input": [
                            {
                                "text": {
                                    "raw": "9. 고지서 명의변경 방법",
                                    "nlp": "9 . 고지서 명의 변경 방법"
                                }
                            },
                            {
                                "text": {
                                    "raw": "9",
                                    "nlp": "9"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "새로 이사를 오셨다면 렌지 연결 시 기사님께 사용계약서를 작성하여 바로 신청이 가능하며 관할 고객센터로 전화 주셔도 변경이 가능합니다.\n사업자이신 경우 사용계약서와 사업자등록증을 팩스로 또는 방문 접수 하시면 공급받는자 등록번호를 기재해 드립니다.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "이전"
                                    },
                                    {
                                        "url": "",
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default74"
                    },
                    {
                        "name": "자동이체 통장 잔액부족",
                        "input": [
                            {
                                "text": {
                                    "raw": "10. 자동이체 통장 잔액부족",
                                    "nlp": "10 . 자동 이체 통장 잔액 부족"
                                }
                            },
                            {
                                "text": {
                                    "raw": "10",
                                    "nlp": "10"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "잔액(50원 이상)이 있는 만큼 부분 인출되며 미납금액은 10일 뒤 1회 재인출 됩니다. \n연체료는 일할계산되며 빠른 납부를 원하실 경우 당사가 지정한 계좌로 (입금전용계좌로) 납부해주시면 됩니다\n(※단, 당사가 지정한 계좌로(입금전용계좌로) 납부시 업무일(공휴일제외) 2일전에 자동이체 청구가되므로 이중수납 우려가 있으므로 관할지역에 문의 부탁드립니다.)\n \n10일 뒤 인출이 안될 경우 익월 청구 시 미납금액이 합산청구 되므로 잔액을 충분히 넣어주시면 됩니다.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "이전"
                                    },
                                    {
                                        "url": "",
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "id": "default75"
                    }
                ]
            },
            {
                "name": "도시가스 이용가이드",
                "input": [
                    {
                        "text": {
                            "raw": "1. 도시가스 이용가이드",
                            "nlp": "1 . 도시가스 이용 가이드"
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
                        "text": "자세히보기를 클릭해주세요.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "이전"
                            },
                            {
                                "url": "",
                                "text": "처음"
                            },
                            {
                                "url": "http://www.samchully.co.kr/customer/gas/info/usage/new.do",
                                "text": "자세히보기"
                            }
                        ]
                    }
                ],
                "id": "default52"
            },
            {
                "name": "동명 입력",
                "input": [
                    {
                        "text": {
                            "raw": "3. 관할 고객센터 조회",
                            "nlp": "3 . 관할 고객 센터 조회"
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
                        "text": "찾고자하시는 동명을 입력해주세요.\n\nex) 오산\n\n이전으로 돌아가시려면 '이전' 을 입력해주세요.\n처음으로 돌아가시려면 '처음' 을 입력해주세요."
                    }
                ],
                "task": {
                    "name": ""
                },
                "id": "default42",
                "children": [
                    {
                        "name": "관할 고객센터 조회_",
                        "input": [
                            {
                                "types": [
                                    "centerAddressType"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "+context.session.centerAddress+ 관할 고객센터입니다.\n#context.session.centerAddressList#\n+index+.\n+MESSAGE+\n\n#\n고객센터 전화번호 (1544-3002)",
                                "buttons": [
                                    {
                                        "text": "이전"
                                    },
                                    {
                                        "text": "처음"
                                    }
                                ]
                            }
                        ],
                        "task": {
                            "name": "searchCustomerCenter"
                        },
                        "id": "default40"
                    },
                    {
                        "name": "동명 재질의",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "type": "repeat"
                            }
                        ],
                        "id": "default41"
                    }
                ]
            }
        ],
        "task": {
            "name": ""
        }
    },
    {
        "name": "로그아웃",
        "input": [
            {
                "text": {
                    "raw": "로그아웃",
                    "nlp": "로그아웃"
                }
            },
            {
                "text": {
                    "raw": "7",
                    "nlp": "7"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "로그아웃되셨습니다.",
                "buttons": [
                    {
                        "text": "처음"
                    }
                ]
            }
        ],
        "id": "test1234",
        "task": {
            "name": "logout"
        }
    },
    {
        "name": "시작카드 재질의",
        "input": [
            {
                "if": "true"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "type": "repeat"
            }
        ],
        "id": "default22",
        "task": {
            "name": ""
        }
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
                    "raw": "시작하기",
                    "nlp": "시작 하다"
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
                    "raw": "ㄴ",
                    "nlp": "ㄴ"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "안녕하세요. 삼천리 톡 서비스 입니다.\n\n*원하시는 메뉴를 하단 버튼에서 선택해주세요*",
                "buttons": [
                    {
                        "text": "1. 이사 및 AS"
                    },
                    {
                        "text": "2. 요금 조회 및 납부"
                    },
                    {
                        "text": "3. 전자고지, 자동이체 신청/해지"
                    },
                    {
                        "text": "4. 자가검침 입력"
                    },
                    {
                        "text": "5. 안전점검 및 가스누출/화재 신고"
                    },
                    {
                        "text": "6. 이용가이드 및 FAQ 등"
                    }
                ],
                "image": {
                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-samchully/samchully-1518159068905-1.png"
                },
                "if": "context.channel.name === 'kakao' || context.user.isFirst === false"
            },
            {
                "kind": "Content",
                "text": "안녕하세요. 삼천리 톡 서비스 입니다. 환영합니다!",
                "if": "context.channel.name !== 'kakao' && context.user.isFirst === undefined",
                "buttons": [
                    {
                        "text": "시작하기"
                    }
                ]
            }
        ],
        "task": {
            "name": "getAuth"
        }
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
                    "raw": "ㄱ",
                    "nlp": "ㄱ"
                }
            }
        ],
        "output": [
            {
                "kind": "Action",
                "type": "back"
            }
        ],
        "task": {
            "name": "notRetry"
        }
    },
    {
        "id": "noanswer",
        "name": "답변없음",
        "input": [
            {}
        ],
        "output": [
            {
                "kind": "Content",
                "text": "알아듣지 못했습니다."
            }
        ],
        "task": {
            "name": "addButton"
        },
        "children": []
    },
    {
        "id": "reTry",
        "name": "재시도",
        "input": [
            {
                "text": {
                    "raw": "retry",
                    "nlp": "retry"
                }
            },
            {
                "text": {
                    "raw": "재시도",
                    "nlp": "재시 도"
                }
            }
        ],
        "output": [
            {
                "kind": "Action",
                "type": "call",
                "text": "",
                "dialogId": "startDialog",
                "dialogName": "시작"
            }
        ],
        "task": {
            "name": "reTry"
        }
    }
];

module.exports = function(bot)
{
    bot.setDialogs(dialogs);
    bot.setCommonDialogs(commonDialogs);
}
