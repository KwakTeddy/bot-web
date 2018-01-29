var dialogs = [
    {
        "name": "인증_고객명",
        "input": [
            {
                "if": "!context.user.auth"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "삼천리 챗봇을 이용하기 위해서는 고객님 인증이 필요합니다. \n고객님 성함을 입력해주세요.",
                "buttons": [],
                "uploader": {
                    "url": "/api/samchully/dialog-graphs/uploadImage",
                    "alias": "uploadFile",
                    "headers": {},
                    "queue": [],
                    "progress": 0,
                    "autoUpload": true,
                    "removeAfterUpload": false,
                    "method": "POST",
                    "filters": [
                        {
                            "name": "folder"
                        },
                        {
                            "name": "queueLimit"
                        }
                    ],
                    "formData": [],
                    "queueLimit": 1.7976931348623157e+308,
                    "withCredentials": false,
                    "disableMultipart": false,
                    "isUploading": false,
                    "_nextIndex": 0,
                    "_failFilterIndex": -1,
                    "_directives": {
                        "select": [],
                        "drop": [],
                        "over": []
                    },
                    "item": "none"
                }
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
                        "text": "고객명은 다음과 같이 입력되었습니다.\n\n+customerName+\n생년월일을 다음과 같이 입력해주세요.\n예시) 900930",
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
                                "text": "생년월일은 다음과 같이 입력되었습니다.\n+customerBirth+\n삼천리에 등록된 휴대폰 번호나 현재 사용중인 핸드폰 번호를 입력해주세요."
                            }
                        ],
                        "id": "default49",
                        "children": [
                            {
                                "name": "인증여부",
                                "input": [
                                    {
                                        "types": "mobile"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "call": "시작",
                                        "if": "context.user.auth",
                                        "options": {
                                            "output": "인증에 성공하셨습니다."
                                        }
                                    },
                                    {
                                        "kind": "Action",
                                        "call": "인증실패",
                                        "options": {
                                            "output": ""
                                        }
                                    }
                                ],
                                "id": "default50",
                                "task": {
                                    "name": "authentication"
                                },
                                "children": [
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
                                                "call": "인증_고객명",
                                                "options": {
                                                    "output": ""
                                                }
                                            }
                                        ],
                                        "id": "default52",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "name": "리핏-핸드폰번호",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "repeat": 1,
                                        "options": {
                                            "output": "잘못 입력하셨습니다. 전화번호 형식에 맞게 다시 입력해주세요."
                                        }
                                    }
                                ],
                                "id": "default51"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "요금",
        "input": [
            {
                "text": "요금"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "[요금] 고객리스트입니다. \n원하시는 고객 번호를 선택하세요.\n#customerList#+index+. +customerName+/+address+ / +id+\n#",
                "if": "",
                "type": "call",
                "dialog": "요금 메뉴 선택",
                "options": {
                    "output": "[요금] 고객리스트입니다. \n원하시는 고객 번호를 선택하세요.\n#customerList#+index+. +customerName+/+address+ / +num+\n#\n\nㅇ"
                }
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "요금 메뉴 선택",
                "input": [
                    {
                        "types": "customerListType"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "+curCustomer+가 선택되었습니다.\n원하시는 메뉴를 선택하세요.",
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
                                "text": "고 지내역"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "원하시는 고지내역 기간을 선택해주세요",
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
                                ],
                                "uploader": {
                                    "url": "/api/samchully/dialog-graphs/uploadImage",
                                    "alias": "uploadFile",
                                    "headers": {},
                                    "queue": [],
                                    "progress": 0,
                                    "autoUpload": true,
                                    "removeAfterUpload": false,
                                    "method": "POST",
                                    "filters": [
                                        {
                                            "name": "folder"
                                        },
                                        {
                                            "name": "queueLimit"
                                        }
                                    ],
                                    "formData": [],
                                    "queueLimit": 1.7976931348623157e+308,
                                    "withCredentials": false,
                                    "disableMultipart": false,
                                    "isUploading": false,
                                    "_nextIndex": 0,
                                    "_failFilterIndex": -1,
                                    "_directives": {
                                        "select": [],
                                        "drop": [],
                                        "over": []
                                    },
                                    "item": "none"
                                }
                            }
                        ],
                        "id": "default14",
                        "children": [
                            {
                                "name": "고지내역 3개월",
                                "input": [
                                    {
                                        "types": "monthType"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "[요금] +curCustomer.customerName+ 고객님 월별 고지내역입니다.( +noticeNum+ 개월)\n\n#noticeHistory#+index+. +date+월\n+method+\n고지금액 : +noticeVal+\n납부금액 : +payment+ (+paymentDate+)\n\n#",
                                        "buttons": [],
                                        "uploader": {
                                            "url": "/api/samchully/dialog-graphs/uploadImage",
                                            "alias": "uploadFile",
                                            "headers": {},
                                            "queue": [],
                                            "progress": 0,
                                            "autoUpload": true,
                                            "removeAfterUpload": false,
                                            "method": "POST",
                                            "filters": [
                                                {
                                                    "name": "folder"
                                                },
                                                {
                                                    "name": "queueLimit"
                                                }
                                            ],
                                            "formData": [],
                                            "queueLimit": 1.7976931348623157e+308,
                                            "withCredentials": false,
                                            "disableMultipart": false,
                                            "isUploading": false,
                                            "_nextIndex": 0,
                                            "_failFilterIndex": -1,
                                            "_directives": {
                                                "select": [],
                                                "drop": [],
                                                "over": []
                                            },
                                            "item": "none"
                                        }
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
                                                "buttons": [],
                                                "uploader": {
                                                    "url": "/api/samchully/dialog-graphs/uploadImage",
                                                    "alias": "uploadFile",
                                                    "headers": {},
                                                    "queue": [],
                                                    "progress": 0,
                                                    "autoUpload": true,
                                                    "removeAfterUpload": false,
                                                    "method": "POST",
                                                    "filters": [
                                                        {
                                                            "name": "folder"
                                                        },
                                                        {
                                                            "name": "queueLimit"
                                                        }
                                                    ],
                                                    "formData": [],
                                                    "queueLimit": 1.7976931348623157e+308,
                                                    "withCredentials": false,
                                                    "disableMultipart": false,
                                                    "isUploading": false,
                                                    "_nextIndex": 0,
                                                    "_failFilterIndex": -1,
                                                    "_directives": {
                                                        "select": [],
                                                        "drop": [],
                                                        "over": []
                                                    },
                                                    "item": "none"
                                                }
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
                            }
                        ]
                    },
                    {
                        "name": "월별 납부내역 조회",
                        "input": [
                            {
                                "text": "납부 역"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "원하시는 납부내역 기간을 선택해주세요",
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
                                        "types": "monthType"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "[요금] +curCustomer.customerName+ 월별 납부내역입니다.(+listNum+개월)\n\n#paymentHistory#+index+. +date+월\n+method+\n고지금액 : +noticeVal+\n납부금액 : +payment+ (+paymentDate+)\n\n#"
                                    }
                                ],
                                "id": "default19",
                                "children": [
                                    {
                                        "name": "납부내역 상세화면",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "상세화면"
                                            }
                                        ],
                                        "id": "default22",
                                        "task": {
                                            "name": "getPaymentDetail"
                                        }
                                    }
                                ],
                                "task": {
                                    "name": "getPaymentHistory"
                                }
                            }
                        ]
                    },
                    {
                        "name": "요금납부",
                        "input": [
                            {
                                "text": "요금"
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
                                ],
                                "uploader": {
                                    "url": "/api/samchully/dialog-graphs/uploadImage",
                                    "alias": "uploadFile",
                                    "headers": {},
                                    "queue": [],
                                    "progress": 0,
                                    "autoUpload": true,
                                    "removeAfterUpload": false,
                                    "method": "POST",
                                    "filters": [
                                        {
                                            "name": "folder"
                                        },
                                        {
                                            "name": "queueLimit"
                                        }
                                    ],
                                    "formData": [],
                                    "queueLimit": 1.7976931348623157e+308,
                                    "withCredentials": false,
                                    "disableMultipart": false,
                                    "isUploading": false,
                                    "_nextIndex": 0,
                                    "_failFilterIndex": -1,
                                    "_directives": {
                                        "select": [],
                                        "drop": [],
                                        "over": []
                                    },
                                    "item": "none"
                                }
                            }
                        ],
                        "id": "default1",
                        "children": [
                            {
                                "name": "신용카드",
                                "input": [
                                    {
                                        "text": "신용카드"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "미납금액 목록입니다.\n\n#nonpaymentHistory#+index+. +date+\n고지년월 : +noticeVal+\n고지금액 : +payment+\n미납금액 : +payment+\n납기일자 : +date+\n\n#납부하실 고지년월을 다음과 같이 입력해주세요.\n예시  : 3 4"
                                    }
                                ],
                                "id": "default12",
                                "task": {
                                    "name": "getNonpaymentList"
                                },
                                "children": [
                                    {
                                        "name": "납부연월 선택",
                                        "input": [
                                            {
                                                "types": "number"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "다음 목록의 납부를 진행합니다.\n\n2017년 3월\n\n핸드폰 번호를 입력하세요",
                                                "buttons": [],
                                                "uploader": {
                                                    "url": "/api/samchully/dialog-graphs/uploadImage",
                                                    "alias": "uploadFile",
                                                    "headers": {},
                                                    "queue": [],
                                                    "progress": 0,
                                                    "autoUpload": true,
                                                    "removeAfterUpload": false,
                                                    "method": "POST",
                                                    "filters": [
                                                        {
                                                            "name": "folder"
                                                        },
                                                        {
                                                            "name": "queueLimit"
                                                        }
                                                    ],
                                                    "formData": [],
                                                    "queueLimit": 1.7976931348623157e+308,
                                                    "withCredentials": false,
                                                    "disableMultipart": false,
                                                    "isUploading": false,
                                                    "_nextIndex": 0,
                                                    "_failFilterIndex": -1,
                                                    "_directives": {
                                                        "select": [],
                                                        "drop": [],
                                                        "over": []
                                                    },
                                                    "item": "none"
                                                }
                                            }
                                        ],
                                        "id": "default16",
                                        "children": [
                                            {
                                                "name": "핸드폰 입력_",
                                                "input": [
                                                    {
                                                        "types": "mobile"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "type": "call",
                                                        "dialog": "등록완료_",
                                                        "options": {
                                                            "output": "인증번호 입력!"
                                                        },
                                                        "text": "주어진 번호로 ARS결제 가상번호를 발송하였습니다.\n가상번호로 전화하여 신용카드 수납절차를 진행하시기 바랍니다."
                                                    }
                                                ],
                                                "id": "default17",
                                                "children": [],
                                                "task": {
                                                    "name": "sendSMSAuth"
                                                }
                                            },
                                            {
                                                "name": "핸드폰 입력 리피트",
                                                "input": [
                                                    {
                                                        "if": "true"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Action",
                                                        "repeat": 1,
                                                        "options": {
                                                            "output": "잘못입력하셨습니다. 다시 입력해주세요."
                                                        }
                                                    }
                                                ],
                                                "id": "default21"
                                            }
                                        ],
                                        "task": {
                                            "name": "addButton"
                                        }
                                    }
                                ]
                            },
                            {
                                "name": "편의점",
                                "input": [
                                    {
                                        "text": "편의점"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "미납금액 목록입니다.\n\n#nonpaymentHistory#+index+. +date+\n고지년월 : +noticeVal+\n고지금액 : +payment+\n미납금액 : +payment+\n납기일자 : +date+\n\n#납부하실 고지년월을 다음과 같이 입력해주세요.\n예시  : 3 4"
                                    }
                                ],
                                "id": "default23",
                                "children": [
                                    {
                                        "name": "납부연월선택_편의점",
                                        "input": [
                                            {
                                                "types": "number"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "다음 목록의 납부를 진행합니다.\n\n2017년 3월\n\n핸드폰 번호를 입력하세요."
                                            }
                                        ],
                                        "id": "default20",
                                        "children": [
                                            {
                                                "name": "핸드폰입력2",
                                                "input": [
                                                    {
                                                        "types": "mobile"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "주어진 번호로 QR코드를 발송하였습니다.\n가까운 편의점에서 QR코드를 스캔하여 요금을 결제하시기 바랍니다."
                                                    }
                                                ],
                                                "id": "default47",
                                                "task": {
                                                    "name": "sendSMSAuth"
                                                }
                                            },
                                            {
                                                "name": "리피트",
                                                "input": [
                                                    {
                                                        "if": "true"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Action",
                                                        "repeat": 1
                                                    }
                                                ],
                                                "id": "default48"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "입금전용계좌 조회",
                                "input": [
                                    {
                                        "text": "입금 전용"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "고객님별로 부여된 가상계좌를 통하여 계좌이체로  도시가스 요금을 결제하는 시스템입니다.\n\n기 생선된 계좌번호 입니다. \n입금을 원하시는 계좌에 납부해주세요\n\n1, 기업은행\n910-4422-4123\n2, 하나은행\n5302-33-441-3332",
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
                                        "name": "입금전용계좌 리스트",
                                        "input": [
                                            {
                                                "text": "농협"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "1, 기업은행\n910-4422-4123\n2, 하나은행\n5302-33-441-3332\n3. 농협은행\n402-0338-4334-11"
                                            }
                                        ],
                                        "id": "default25",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "전자고지 신청/해지",
                        "input": [
                            {
                                "text": "전자 고지"
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
                                        "text": "신청"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "현재 고지 방법입니다.\n\n\"카카오페이 고지\"\n\n 전자고지를 신청하거나 변경하시겠습니까?",
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
                                                "text": "전자고지 신청"
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
                                                ],
                                                "uploader": {
                                                    "url": "/api/samchully/dialog-graphs/uploadImage",
                                                    "alias": "uploadFile",
                                                    "headers": {},
                                                    "queue": [],
                                                    "progress": 0,
                                                    "autoUpload": true,
                                                    "removeAfterUpload": false,
                                                    "method": "POST",
                                                    "filters": [
                                                        {
                                                            "name": "folder"
                                                        },
                                                        {
                                                            "name": "queueLimit"
                                                        }
                                                    ],
                                                    "formData": [],
                                                    "queueLimit": 1.7976931348623157e+308,
                                                    "withCredentials": false,
                                                    "disableMultipart": false,
                                                    "isUploading": false,
                                                    "_nextIndex": 0,
                                                    "_failFilterIndex": -1,
                                                    "_directives": {
                                                        "select": [],
                                                        "drop": [],
                                                        "over": []
                                                    },
                                                    "item": "none"
                                                }
                                            }
                                        ],
                                        "id": "default27",
                                        "children": [
                                            {
                                                "name": "카카오페이 고지",
                                                "input": [
                                                    {
                                                        "text": "카카오 페이"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "카카에페이 URL 발송"
                                                    }
                                                ],
                                                "id": "default28"
                                            },
                                            {
                                                "name": "LMS 고지",
                                                "input": [
                                                    {
                                                        "text": "LMS"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "LMS 고지받을 휴대폰 번호를 입력해주세요"
                                                    }
                                                ],
                                                "id": "default29",
                                                "children": [
                                                    {
                                                        "name": "LMS확인",
                                                        "input": [
                                                            {
                                                                "types": "mobile"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Content",
                                                                "text": "신청 완료되었습니다."
                                                            }
                                                        ],
                                                        "id": "default53"
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "이메일 고지",
                                                "input": [
                                                    {
                                                        "text": "이메일"
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
                                                                "types": "email"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Content",
                                                                "text": "신청 완료되었습니다."
                                                            }
                                                        ],
                                                        "id": "default54"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "해지",
                                "input": [
                                    {
                                        "text": "해지"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "현재 고지방법입니다.\n\"카카오페이 고지\"\n해지하시겠습니까?",
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
                                                "text": "네"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "전자고지 해지 완료되었습니다."
                                            }
                                        ],
                                        "id": "default55"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "자동이체 신청해지_",
                        "input": [
                            {
                                "text": "자동 이체"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "자동이체 신청해지",
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
                                "name": "자동이체 신청",
                                "input": [
                                    {
                                        "text": "신청"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "현재 납부방법입니다.\n\n자동이체 신청 혹은 변경 하시겠습니까",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "자동이체 신청/변경"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default32",
                                "children": [
                                    {
                                        "name": "자동이체 신청 안내멘트",
                                        "input": [
                                            {
                                                "text": "신청"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "금융결제원 자동이체 동의자료 열람서비스 제도 시행으로 인해 은행/카드자동이체를 원하시는 고객님께서는 관할 고객센터로 연락주시기 바랍니다.”\n\n1544-3002"
                                            }
                                        ],
                                        "id": "default33"
                                    }
                                ]
                            },
                            {
                                "name": "자동이체 해지",
                                "input": [
                                    {
                                        "text": "해지"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "현재 납부 방법입니다.\n\n해지하시겠습니까?",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "넵"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default34",
                                "children": [
                                    {
                                        "name": "자동이체 해지 완료 메세지",
                                        "input": [
                                            {
                                                "text": "네"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "자동이체 재 신청이 필요하신 고객님께서는 관할 고객센터로 연락 주시기 바랍니다"
                                            }
                                        ],
                                        "id": "default35"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "자가 검침",
                        "input": [
                            {
                                "text": "자가 검침"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "자가 검침",
                                "buttons": [],
                                "uploader": {
                                    "url": "/api/samchully/dialog-graphs/uploadImage",
                                    "alias": "uploadFile",
                                    "headers": {},
                                    "queue": [],
                                    "progress": 0,
                                    "autoUpload": true,
                                    "removeAfterUpload": false,
                                    "method": "POST",
                                    "filters": [
                                        {
                                            "name": "folder"
                                        },
                                        {
                                            "name": "queueLimit"
                                        }
                                    ],
                                    "formData": [],
                                    "queueLimit": 1.7976931348623157e+308,
                                    "withCredentials": false,
                                    "disableMultipart": false,
                                    "isUploading": false,
                                    "_nextIndex": 0,
                                    "_failFilterIndex": -1,
                                    "_directives": {
                                        "select": [],
                                        "drop": [],
                                        "over": []
                                    },
                                    "item": "none"
                                }
                            }
                        ],
                        "id": "default10",
                        "children": [
                            {
                                "name": "자가 검침 대상 확인",
                                "input": [
                                    {
                                        "text": "대상"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "대상확인"
                                    }
                                ],
                                "id": "default36",
                                "children": [
                                    {
                                        "name": "자가검침 화면",
                                        "input": [
                                            {
                                                "text": "화면"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "화면"
                                            }
                                        ],
                                        "id": "default37"
                                    },
                                    {
                                        "name": "에러 메세지 출력",
                                        "input": [
                                            {
                                                "text": "에러 메시지"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "에러"
                                            }
                                        ],
                                        "id": "default38"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "고지서 재발행 신청",
                        "input": [
                            {
                                "text": "고지서 재발 행"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "고지서 재발행",
                                "buttons": [],
                                "uploader": {
                                    "url": "/api/samchully/dialog-graphs/uploadImage",
                                    "alias": "uploadFile",
                                    "headers": {},
                                    "queue": [],
                                    "progress": 0,
                                    "autoUpload": true,
                                    "removeAfterUpload": false,
                                    "method": "POST",
                                    "filters": [
                                        {
                                            "name": "folder"
                                        },
                                        {
                                            "name": "queueLimit"
                                        }
                                    ],
                                    "formData": [],
                                    "queueLimit": 1.7976931348623157e+308,
                                    "withCredentials": false,
                                    "disableMultipart": false,
                                    "isUploading": false,
                                    "_nextIndex": 0,
                                    "_failFilterIndex": -1,
                                    "_directives": {
                                        "select": [],
                                        "drop": [],
                                        "over": []
                                    },
                                    "item": "none"
                                }
                            }
                        ],
                        "id": "default11",
                        "children": [
                            {
                                "name": "전자고지 재발행 접수",
                                "input": [
                                    {
                                        "text": "재발행"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "재발행"
                                    }
                                ],
                                "id": "default39",
                                "children": [
                                    {
                                        "name": "고지서 재발행",
                                        "input": [
                                            {
                                                "text": "고지서 재발행"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "재발행"
                                            }
                                        ],
                                        "id": "default41"
                                    }
                                ]
                            },
                            {
                                "name": "에러메세지",
                                "input": [
                                    {
                                        "text": "에러"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "에러"
                                    }
                                ],
                                "id": "default40"
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
        "name": "이사/AS",
        "input": [
            {
                "text": "이사"
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
                "text": "안전 점검"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "안전점검",
                "if": "",
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
        "id": "default6",
        "children": [
            {
                "name": "안전 점검 선택",
                "input": [
                    {
                        "text": "점검월"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "점검월 조회"
                    }
                ],
                "id": "default42",
                "children": [
                    {
                        "name": "안전 점검 월 조회",
                        "input": [
                            {
                                "text": "점검 월 조회"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "점검 월 조회"
                            }
                        ],
                        "id": "default43"
                    },
                    {
                        "name": "안전 점검 결과 조회",
                        "input": [
                            {
                                "text": "결과 조회"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "결과 조회"
                            }
                        ],
                        "id": "default44"
                    }
                ]
            },
            {
                "name": "누출 화재 긴급연결",
                "input": [
                    {
                        "text": "누출 화재"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "긴급연결\n\n종합상황실 : 080-3002-119"
                    }
                ],
                "id": "default45"
            }
        ]
    },
    {
        "name": "카카오톡상담",
        "input": [
            {
                "text": "카카오 톡"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "카카오톡"
            }
        ],
        "id": "default7"
    },
    {
        "name": "기타",
        "input": [
            {
                "text": "기타"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "기타",
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
        "children": []
    }
];
































































































var commonDialogs = [
    {
        "id": "defaultcommon0",
        "filename": "defaultcommon",
        "name": "시작",
        "input": [
            {
                "text": "start"
            },
            {
                "text": "시작"
            },
            {
                "text": "처음"
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
                "text": "up"
            },
            {
                "text": "back"
            },
            {
                "text": "상위"
            },
            {
                "text": "이전"
            }
        ],
        "output": {
            "up": 1
        }
    },
    {
        "id": "defaultcommon2",
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
































































































var _bot = require(require('path').resolve("./engine/bot.js")).getBot('samchully');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);