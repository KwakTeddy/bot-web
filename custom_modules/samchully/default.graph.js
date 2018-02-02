var dialogs = [
    {
        "name": "인증_고객명",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "요금, 안전전검 메뉴를 이용하기 위해서는 고객님 인증이 필요합니다. \n\n인증을 위해 고객님 한글 성함을 입력해주세요.\n(한글로된 2-4글자입니다.)"
            }
        ],
        "id": "default3",
        "task": {
            "name": ""
        },
        "children": [
            {
                "name": "인증_생년월일",
                "input": [
                    {
                        "types": "saveCustomerName"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "고객명 : +context.user.customerName+\n\n(다시 입력하시려면 '이전'이라고 입력해주세요.)\n\n주민등록번호 앞에 6자리를 입력해주세요.\n예시) 900930",
                        "if": ""
                    }
                ],
                "id": "default46",
                "children": [
                    {
                        "name": "인증_휴대폰번호",
                        "input": [
                            {
                                "types": "saveCustomerBirth"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "고객명 : +context.user.customerName+\n생년월일 : +context.user.customerBirth+\n\n(다시 입력하시려면 '이전'이라고 입력해주세요.)\n\n삼천리에 등록된 휴대폰 번호나 현재 사용중인 핸드폰 번호를 입력해주세요."
                            }
                        ],
                        "id": "default49",
                        "children": [
                            {
                                "name": "고객 검색",
                                "input": [
                                    {
                                        "types": "mobile"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "context.user.customerInfo",
                                        "type": "call",
                                        "dialogId": "default64",
                                        "dialogName": "인증동의"
                                    },
                                    {
                                        "kind": "Action",
                                        "type": "call",
                                        "dialogId": "default52",
                                        "dialogName": "인증실패"
                                    }
                                ],
                                "id": "default50",
                                "task": {
                                    "name": "searchUser"
                                },
                                "children": [
                                    {
                                        "name": "인증동의",
                                        "input": [
                                            {
                                                "if": "false"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "검색 결과입니다.\n\n고객명 : +context.user.customerName+\n생일 : +context.user.customerBirth+\n핸드폰번호 : +context.types.mobile+\n\n인증하시겠습니까?",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "네"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "아니요"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default64",
                                        "children": [
                                            {
                                                "name": "인증완료",
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
                                                        "kind": "Action",
                                                        "type": "call",
                                                        "dialogId": "defaultcommon0",
                                                        "dialogName": "시작"
                                                    }
                                                ],
                                                "id": "default65",
                                                "task": {
                                                    "name": "authConfirm"
                                                }
                                            },
                                            {
                                                "name": "인증거절",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "아니다",
                                                            "nlp": "아니다"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Action",
                                                        "type": "call",
                                                        "dialogId": "defaultcommon0",
                                                        "dialogName": "시작"
                                                    }
                                                ],
                                                "id": "default66"
                                            }
                                        ],
                                        "task": {
                                            "name": "searchUser"
                                        }
                                    },
                                    {
                                        "name": "인증실패",
                                        "input": [
                                            {
                                                "if": "false"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "options": {
                                                    "output": "고객 인증에 실패했습니다."
                                                },
                                                "type": "call",
                                                "dialogId": "default3",
                                                "dialogName": "인증_고객명"
                                            }
                                        ],
                                        "id": "default52",
                                        "children": []
                                    }
                                ]
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
                                        "options": {
                                            "output": "잘못 입력하셨습니다. 전화번호 형식에 맞게 다시 입력해주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ],
                                "id": "default51"
                            }
                        ]
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
                                "options": {
                                    "output": "잘못 입력하셨습니다.\n\n주민등록번호 앞에 6자리 형식에 맞게 입력해주세요.\n\n예시) 900930"
                                },
                                "type": "repeat"
                            }
                        ],
                        "id": "default63"
                    }
                ]
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
                        "options": {
                            "output": "잘못 입력하셨습니다.\n\n한글 이름 형식에 맞게 다시 입력해주세요."
                        },
                        "type": "repeat"
                    }
                ],
                "id": "default67"
            }
        ]
    },
    {
        "name": "요금",
        "input": [
            {
                "text": {
                    "raw": "요금",
                    "nlp": "요금"
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
                "text": "[요금] 고객리스트입니다. \n원하시는 고객 번호를 선택하세요.\n#context.customerList#+index+. +customerName+/+address+ / +id+\n#",
                "if": "context.user.auth"
            },
            {
                "kind": "Action",
                "type": "call",
                "dialogId": "default3",
                "dialogName": "인증_고객명"
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
                        "text": "+context.curCustomer.customerName+님이 선택되었습니다.\n원하시는 메뉴를 선택하세요.",
                        "if": "",
                        "buttons": [
                            {
                                "url": "",
                                "text": "월별 고지내역 조회"
                            },
                            {
                                "url": "",
                                "text": "월별 납부내역 조회"
                            },
                            {
                                "url": "",
                                "text": "요금납부"
                            },
                            {
                                "url": "",
                                "text": "전자고지 신청/해지"
                            },
                            {
                                "url": "",
                                "text": "자동이체 신청/해지"
                            },
                            {
                                "url": "",
                                "text": "자가검침 입력"
                            },
                            {
                                "url": "",
                                "text": "고지서 재발행 신청"
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
                                    "raw": "월별 고지내역 조회",
                                    "nlp": "월별 고 지내역 조회"
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
                                "text": "[+context.curCustomer.customerName+]\n\n조회할 '고지'내역 기간을 선택해주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "3개월"
                                    },
                                    {
                                        "url": "",
                                        "text": "6개월"
                                    },
                                    {
                                        "url": "",
                                        "text": "12개월"
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
                                        "text": "[고지내역 조회]\n\n+context.curCustomer.customerName+ 고객님 월별 고지내역입니다.(+context.selectedMonth+ 개월)\n\n#context.noticeHistory#\n+index+.\n고지년월: +BILLING_PERIOD+\n고지금액 : +BETRW_TOT+\n미납금액 : +DFAMT+\n납부마감일 : +FAEDN+\n\n#\n상세내용을 확인할 기간을 선택해주세요."
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
                                                "text": "+conversation.noticeDetail.BILLING_PERIOD+ 상세 내용입니다.\n\n전월지침 : +conversation.noticeDetail.PR_ZWSTNDAB+\n당월지침 : +conversation.noticeDetail.ZWSTNDAB+\n보정계수 : +conversation.noticeDetail.ZUSTZAHL+\n온압부과량(㎥) : +conversation.noticeDetail.I_ABRMENGE+\n단위열량(MJ) : +conversation.noticeDetail.UNIT_CALORY+\n사용열량(MJ) : +conversation.noticeDetail.USED_CALORY+\n기본요금 : +conversation.noticeDetail.BETRW_GI+\n사용요금 : +conversation.noticeDetail.BETRW_GA+\n경감금액 : +conversation.noticeDetail.BETRW_DC+\n계량기교체비 : +conversation.noticeDetail.ZRESERVE_AMT+\n부가세 : +conversation.noticeDetail.SBETW+\n가산금 : +conversation.noticeDetail.BETRW_D+\n정산금액 : +conversation.noticeDetail.BETRW_JS+\n원단위절사 : +conversation.noticeDetail.BETRW_RO+\n재공급수수료 : +conversation.noticeDetail.BETRW_SS+\n고지금액 : +conversation.noticeDetail.BETRW_TOT+"
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
                                        "text": {
                                            "raw": "",
                                            "nlp": ""
                                        },
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "3개월, 6개월, 12개월 단위로 조회 가능합니다. \n\n조회할 고지내역 기간을 다시 선택해주세요.",
                                        "type": ""
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
                                    "raw": "월별 납부내역 조회",
                                    "nlp": "월별 납부 내 역 조회"
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
                                "text": "[+context.curCustomer.customerName+]\n\n조회할 '납부'내역 기간을 선택해주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "3개월"
                                    },
                                    {
                                        "url": "",
                                        "text": "6개월"
                                    },
                                    {
                                        "url": "",
                                        "text": "12개월"
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
                                        "text": "[납부내역 조회]\n\n+context.curCustomer.customerName+ 월별 납부내역입니다.(+context.selectedMonth+개월)\n\n#context.paymentHistory#\n+index+.\n고지년월 : +YYYYMM+\n납부방식 : +PAY_TYPE+\n납부일자 : +BUDAT+\n고지금액 : +BETRWG+\n납부금액 : +BETRWS+\n\n#"
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
                                        "text": {
                                            "raw": "",
                                            "nlp": ""
                                        },
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "3개월, 6개월, 12개월 단위로 조회 가능합니다. \n\n조회할 고지내역 기간을 다시 선택해주세요."
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
                                    "raw": "요금납부",
                                    "nlp": "요금 납부"
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
                                    }
                                ]
                            }
                        ],
                        "id": "default1",
                        "children": [
                            {
                                "name": "신용카드",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "신용카드",
                                            "nlp": "신용카드"
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
                                        "text": "미납금액 목록입니다.\n\n#context.nonpaymentHistory#+index+. +date+\n고지년월 : +noticeVal+\n고지금액 : +payment+\n미납금액 : +payment+\n납기일자 : +date+\n\n#납부하실 고지년월을 다음과 같이 입력해주세요.\n예시  : 3 4"
                                    }
                                ],
                                "id": "default12",
                                "task": {
                                    "name": "getNonpaymentList"
                                },
                                "children": [
                                    {
                                        "name": "신용카드 납부",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "신용카드 납부",
                                                    "nlp": "신용카드 납부"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "주어진 번호로 ARS결제 가상번호를 발송하였습니다.\n가상번호로 전화하여 신용카드 수납절차를 진행하시기 바랍니다."
                                            }
                                        ],
                                        "id": "default21",
                                        "task": {
                                            "name": "payByARS"
                                        }
                                    }
                                ]
                            },
                            {
                                "name": "편의점",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "편의점",
                                            "nlp": "편의점"
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
                                        "text": "미납금액 목록입니다.\n\n#context.nonpaymentHistory#+index+. +date+\n고지년월 : +noticeVal+\n고지금액 : +payment+\n미납금액 : +payment+\n납기일자 : +date+\n\n#납부하실 고지년월을 다음과 같이 입력해주세요.\n예시  : 3 4"
                                    }
                                ],
                                "id": "default23",
                                "children": [
                                    {
                                        "name": "편의점 납부",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "편의점 납부",
                                                    "nlp": "편의점 납부"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "주어진 번호로 QR코드를 발송하였습니다.\n가까운 편의점에서 QR코드를 스캔하여 요금을 결제하시기 바랍니다."
                                            }
                                        ],
                                        "id": "default16",
                                        "task": {
                                            "name": "payByQR"
                                        }
                                    }
                                ]
                            },
                            {
                                "name": "입금전용계좌 조회",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "입금 전용",
                                            "nlp": "입금 전용"
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
                                        "text": "고객님별로 부여된 가상계좌를 통하여 계좌이체로  도시가스 요금을 결제하는 시스템입니다.\n\n기 생선된 계좌번호 입니다. \n입금을 원하시는 계좌에 납부해주세요\n\n#context.nonpaymentHistory#\n+index+.\n은행명 : +BANKA+\n계좌번호 : +BANKN+\n\n#",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "농협 입금전용계좌 생성"
                                            }
                                        ]
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
                                                "text": "+conversation.selectedBank+은행 입금전용계좌가 생성됐습니다.\n\n은행 : +conversation.selectedBank+은행\n계좌 : +conversation.createdBankAccount+\n\n위의 계좌로 입금하시면 됩니다."
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
                        "name": "전자고지 신청/해지",
                        "input": [
                            {
                                "text": {
                                    "raw": "전자 고지",
                                    "nlp": "전자 고지"
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
                                "text": "전자고지를 신청하거나 해지하실 수 있습니다.\n원하시는 메뉴를 선택해주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "신청"
                                    },
                                    {
                                        "url": "",
                                        "text": "해지"
                                    }
                                ]
                            }
                        ],
                        "id": "default2",
                        "children": [
                            {
                                "name": "신청",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "신청",
                                            "nlp": "신청"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "현재 고지 방법입니다.\n\n\"+context.user.curNoticeMethod+\"\n\n 전자고지를 신청하거나 변경하시겠습니까?",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "전자고지 신청/변경"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default26",
                                "children": [
                                    {
                                        "name": "고지 목록",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "전자고지 신청",
                                                    "nlp": "전자고지 신청"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "원하시는 고지 방법을 선택해주세요",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "카카오페이 고지"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "LMS 고지"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "이메일 고지"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default27",
                                        "children": [
                                            {
                                                "name": "카카오페이 고지",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "카카오 페이",
                                                            "nlp": "카카오 페이"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "카카에페이 URL을 발송했습니다.",
                                                        "if": "conversation.setNoticeMethodSuccess"
                                                    },
                                                    {
                                                        "kind": "Content",
                                                        "text": "카카에페이 URL 발송"
                                                    }
                                                ],
                                                "id": "default28",
                                                "task": {
                                                    "name": "setNoticeMethod"
                                                },
                                                "children": []
                                            },
                                            {
                                                "name": "LMS 고지",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "LMS",
                                                            "nlp": "LMS"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "정상적으로 처리되었습니다.",
                                                        "if": "conversation.setNoticeMethodSuccess"
                                                    },
                                                    {
                                                        "kind": "Content",
                                                        "text": "에러가 발생했습니다."
                                                    }
                                                ],
                                                "id": "default29",
                                                "children": [],
                                                "task": {
                                                    "name": "setNoticeMethod_lms"
                                                }
                                            },
                                            {
                                                "name": "이메일 고지",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "이메일",
                                                            "nlp": "이메일"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "받으실 이메일 주소를 입력해주세요."
                                                    }
                                                ],
                                                "id": "default30",
                                                "children": [
                                                    {
                                                        "name": "New Dialog",
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
                                                                "text": "신청 완료되었습니다.",
                                                                "if": "conversation.setNoticeMethodSuccess"
                                                            },
                                                            {
                                                                "kind": "Content",
                                                                "text": "에러 났습니다."
                                                            }
                                                        ],
                                                        "id": "default54",
                                                        "task": {
                                                            "name": "setNoticeMethod_email"
                                                        }
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
                                                                "type": "repeat"
                                                            }
                                                        ],
                                                        "id": "default58"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "task": {
                                    "name": "getNoticeMethod"
                                }
                            },
                            {
                                "name": "해지",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "해지",
                                            "nlp": "해지"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "현재 고지방법입니다.\n\n\"+context.user.curNoticeMethod+\"\n\n해지하시겠습니까?",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "네"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default31",
                                "children": [
                                    {
                                        "name": "해지완료",
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
                                                "text": "전자고지 해지 완료되었습니다.",
                                                "if": "conversation.cancelNoticeMethodSuccess"
                                            },
                                            {
                                                "kind": "Content",
                                                "text": "에러"
                                            }
                                        ],
                                        "id": "default55",
                                        "task": {
                                            "name": "cancelNoticeMethod"
                                        }
                                    }
                                ],
                                "task": {
                                    "name": "getNoticeMethod"
                                }
                            }
                        ]
                    },
                    {
                        "name": "자동이체 신청해지_",
                        "input": [
                            {
                                "text": {
                                    "raw": "자동 이체",
                                    "nlp": "자동 이체"
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
                                "text": "현재 납부방법입니다.\n\n+conversation.curPaymentMethod+\n\n자동이체 신청(변경)이나 해지를 원하시면 아래의 버튼을 눌러주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "신청"
                                    },
                                    {
                                        "url": "",
                                        "text": "해지"
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
                                            "raw": "신청",
                                            "nlp": "신청"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "금융결제원 자동이체 동의자료 열람서비스 제도 시행으로 인해 은행/카드자동이체를 원하시는 고객님께서는 관할 고객센터로 연락주시기 바랍니다.”\n\n1544-3002"
                                    }
                                ],
                                "id": "default53"
                            },
                            {
                                "name": "자동이제 해지",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "해지",
                                            "nlp": "해지"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "자동이체 재 신청이 필요하신 고객님께서는 관할 고객센터로 연락 주시기 바랍니다"
                                    }
                                ],
                                "id": "default57",
                                "task": {
                                    "name": "cancelAutoTransfer"
                                }
                            }
                        ],
                        "task": {
                            "name": "getPaymentMethod"
                        }
                    },
                    {
                        "name": "자가 검침 입력",
                        "input": [
                            {
                                "text": {
                                    "raw": "자가 검침",
                                    "nlp": "자가 검침"
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
                                "text": "자가 검침"
                            }
                        ],
                        "id": "default10",
                        "children": [
                            {
                                "name": "자가검침 화면",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "자가 검침 화면",
                                            "nlp": "자가 검침 화면"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "검정색 바탕의 숫자를 입력해주세요."
                                    }
                                ],
                                "id": "default36",
                                "children": [
                                    {
                                        "name": "자가검침등록",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "자가 검침 등록",
                                                    "nlp": "자가 검침 등록"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "자가검침등록"
                                            }
                                        ],
                                        "id": "default38",
                                        "children": [
                                            {
                                                "name": "청구예상금액",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "청구 예상 금액",
                                                            "nlp": "청구 예상 금액"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "청구예상금액"
                                                    }
                                                ],
                                                "id": "default59"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "에러메세지출력",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "에러 메세지 출력",
                                            "nlp": "에러 메세지 출력"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "에러메세지출력"
                                    }
                                ],
                                "task": {
                                    "name": "getErrMsg"
                                },
                                "id": "default37"
                            }
                        ]
                    },
                    {
                        "name": "고지서 재발행 신청",
                        "input": [
                            {
                                "text": {
                                    "raw": "고지서 재발 행",
                                    "nlp": "고지서 재발 행"
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
                                "kind": "Action",
                                "call": "전자고지 재발행 접수",
                                "if": "conversation.curNoticeMethodCategory > 1",
                                "options": {
                                    "output": "고지서를 재발행하시겠습니까?"
                                },
                                "type": "call",
                                "dialogName": "고지 재",
                                "dialog": "전자고지 재발행 접수"
                            },
                            {
                                "kind": "Content",
                                "text": "고객의 고지방법 : +conversation.curNoticeMethod+\n\n전자고지 고객님만 가능하며 종이고지서 수령을 원하시는 고객님께서는 관할 고객센터로 연락주시기 바랍니다."
                            }
                        ],
                        "id": "default11",
                        "children": [
                            {
                                "name": "전자고지 재발행 접수",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "재발 행",
                                            "nlp": "재발 행"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "재발행되었습니다."
                                    }
                                ],
                                "id": "default39",
                                "children": []
                            },
                            {
                                "name": "에러메세지",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "에러",
                                            "nlp": "에러"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "전자고지 고객님만 가능하며 종이고지서 수령을  원하시는 고객님께서는 관할 고객센터로 연락주시기 바랍니다."
                                    }
                                ],
                                "id": "default40"
                            }
                        ],
                        "task": {
                            "name": "getNoticeMethod"
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
        "name": "이사/AS",
        "input": [
            {
                "text": {
                    "raw": "이사",
                    "nlp": "이사"
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
                "text": "이사 관련 문의를 처리합니다.\n메뉴를 선택해주세요.",
                "buttons": [
                    {
                        "url": "",
                        "text": "이사 들어오실 때"
                    },
                    {
                        "url": "",
                        "text": "이사 나가실 때"
                    },
                    {
                        "url": "",
                        "text": "AS (렌지연결 등)"
                    },
                    {
                        "url": "",
                        "text": "예약 확인/변경"
                    },
                    {
                        "url": "",
                        "text": "연결비 안내"
                    }
                ]
            }
        ],
        "id": "default5"
    },
    {
        "name": "안전점검",
        "input": [
            {
                "text": {
                    "raw": "안전 점검",
                    "nlp": "안전 점검"
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
                "kind": "Action",
                "if": "!context.user.auth",
                "type": "call",
                "dialogId": "default3",
                "dialogName": "인증_고객명"
            },
            {
                "kind": "Content",
                "text": "[요금] 고객리스트입니다. \n원하시는 고객 번호를 선택하세요.\n#context.customerList#+index+. +customerName+/+address+ / +id+\n#",
                "if": ""
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
                        "text": "+context.curCustomer.customerName+님이 선택되었습니다.\n원하시는 메뉴를 선택하세요.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "안전점검"
                            },
                            {
                                "url": "",
                                "text": "누출 화재 긴급연결"
                            }
                        ]
                    }
                ],
                "id": "default60",
                "children": [
                    {
                        "name": "안전전검",
                        "input": [
                            {
                                "text": {
                                    "raw": "안전 전검",
                                    "nlp": "안전 전검"
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
                                            "raw": "안전 점검 월 조회",
                                            "nlp": "안전 점검 월 조회"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "가스용도 : ○ ○ ○\n안전점검월 : ○월, ○월\n ※ 도시가스사업법에 따라 \n    취사용 1년 1회, 그외 1년 2회\n    안전점검이 시행됩니다."
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
                                            "raw": "안전 점검 결과 역",
                                            "nlp": "안전 점검 결과 역"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "안전점검 결과 내역입니다\n\n안전점검일 : \n점검 참여자 : \n계약자와 관계 : \n점검결과 :"
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
                                    "raw": "누 추다 화재 긴급 연결",
                                    "nlp": "누 추다 화재 긴급 연결"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "종합상황실 : 080-3002-119\n\n\n가스 누출 또는 화재 등 \n사고관련 신고 이외 민원은\n1544-3002로 문의 바랍니다"
                            }
                        ],
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
        "name": "카카오톡상담",
        "input": [
            {
                "text": {
                    "raw": "카카오 톡",
                    "nlp": "카카오 톡"
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
                "text": "카카오톡"
            }
        ],
        "id": "default7",
        "task": {
            "name": "sendNotiTalk"
        }
    },
    {
        "name": "기타",
        "input": [
            {
                "text": {
                    "raw": "기타",
                    "nlp": "기타"
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
                "text": "원하시는 메뉴를 선택해주세요.",
                "buttons": [
                    {
                        "url": "http://www.samchully.co.kr/customer/gas/info/usage/new.do",
                        "text": "도시가스 이용가이드"
                    },
                    {
                        "url": "",
                        "text": "자주 묻는 질문"
                    },
                    {
                        "url": "",
                        "text": "관할 고객센터 조회"
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
                            "raw": "자주 묻다 질문",
                            "nlp": "자주 묻다 질문"
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
                                "text": "요금체납 시 중단 시기"
                            },
                            {
                                "url": "",
                                "text": "가스요금 납부방법"
                            },
                            {
                                "url": "",
                                "text": "자동이체 적용시기"
                            },
                            {
                                "url": "",
                                "text": "사회적 배려대상 요금경감제도"
                            },
                            {
                                "url": "",
                                "text": "이중수납 환불제도"
                            },
                            {
                                "url": "",
                                "text": "갑자기 요금이 많이 나왔을때"
                            },
                            {
                                "url": "",
                                "text": "서비스 품질보상 제도 안내"
                            },
                            {
                                "url": "",
                                "text": "연체가산금 안내"
                            },
                            {
                                "url": "",
                                "text": "고지서 명의변경 방법"
                            },
                            {
                                "url": "",
                                "text": "자동이체 통장 잔액부족"
                            }
                        ]
                    }
                ],
                "id": "default44"
            },
            {
                "name": "관할 고객센터 조회",
                "input": [
                    {
                        "text": {
                            "raw": "관할 고객 센터 조회",
                            "nlp": "관할 고객 센터 조회"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "관할 고객센터는\n\n입니다."
                    }
                ],
                "task": {
                    "name": "searchCustomerCenter"
                },
                "id": "default42"
            }
        ]
    },
    {
        "name": "시작대화 재질의",
        "input": [
            {
                "text": {
                    "raw": "",
                    "nlp": ""
                },
                "if": "true"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "ㄴㅇㄹ",
                "type": "repeat"
            }
        ],
        "id": "default22"
    }
];

var commonDialogs = [
    {
        "id": "defaultcommon0",
        "filename": "defaultcommon",
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
                "text": "안녕하세요, 삼천리 고객센터 입니다.\n무엇을 도와드릴까요? \n\n*원하시는 메뉴를 하단 버튼에서 선택해주세요*",
                "buttons": [
                    {
                        "url": "",
                        "text": "요금"
                    },
                    {
                        "url": "",
                        "text": "이사/AS"
                    },
                    {
                        "url": "",
                        "text": "안전점검"
                    },
                    {
                        "url": "",
                        "text": "카카오톡상담"
                    },
                    {
                        "url": "",
                        "text": "기타"
                    }
                ],
                "image": {
                    "url": "/files/samchully-1515459210907-samchully.png",
                    "displayname": "samchully.png"
                }
            }
        ],
        "task": {
            "name": "getAuth"
        }
    },
    {
        "id": "defaultcommon1",
        "filename": "defaultcommon",
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
                    "raw": "back",
                    "nlp": "back"
                }
            },
            {
                "text": {
                    "raw": "상위",
                    "nlp": "상위"
                }
            },
            {
                "text": {
                    "raw": "이전",
                    "nlp": "이전"
                }
            }
        ],
        "output": {
            "kind": "Action",
            "type": "up"
        }
    },
    {
        "id": "noanswer",
        "filename": "defaultcommon",
        "name": "답변없음",
        "input": [
            ""
        ],
        "output": [
            {
                "kind": "Content",
                "text": "알아듣지 못했습니다."
            }
        ],
        "task": {
            "name": "addButton"
        }
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}