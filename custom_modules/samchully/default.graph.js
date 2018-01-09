var dialogs = [
    {
        "name": "고객인증",
        "input": [
            {
                "text": "인증"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "테스크를 붙여야함"
            }
        ],
        "id": "default3",
        "task": {
            "name": "authentication"
        }
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
                "text": "[요금] 고객리스트입니다. \n원하시는 고객 번호를 선택하세요.\n\n#customerList#+index+. +customerName+/+address+ \n#"
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "요금 메뉴 선택",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "원하시는 메뉴를 선택하세요",
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
                                "text": "원하시는 기간을 선택해주세요",
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
                                        "text": "3"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "[요금] 123456456 월별 고지내역입니다.(3개월)\n\n2017.12\n신용카드 자동이체 / 고지금액 1000원 중 0원 납부(미납)\n\n2017.11\n은행 자동이체 / 고지금액 2000원 중 2000원 납부(2017.11.25)\n\n2017.10\n지로용지 납부 / 고지금액 3000원 중 3000원 납부(2017.11.25)",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "12월 상세보기"
                                            },
                                            {
                                                "url": "",
                                                "text": "11월 상세보기"
                                            },
                                            {
                                                "url": "",
                                                "text": "10월 상세보기"
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
                                "id": "default15",
                                "children": [
                                    {
                                        "name": "고지내역 상세화면",
                                        "input": [
                                            {
                                                "text": "상세"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "2017.12\n신용카드 자동이체 / 고지금액 1000원 중 0원 납부(미납)",
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
                                        "id": "default18"
                                    }
                                ]
                            },
                            {
                                "name": "6개월",
                                "input": [
                                    {
                                        "text": "6개월"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "6개월"
                                    }
                                ],
                                "id": "default16"
                            },
                            {
                                "name": "9개월",
                                "input": [
                                    {
                                        "text": "9개월"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "9개월"
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
                                "text": "납부"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "원하시는 기간을 선택해주세요",
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
                                        "text": "3"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "[요금] 123456456 월별 납부내역입니다.(3개월)\n\n2017.12\n신용카드 자동이체 / 고지금액 1000원 중 0원 납부(미납)\n\n2017.11\n은행 자동이체 / 고지금액 2000원 중 2000원 납부(2017.11.25)\n\n2017.10\n지로용지 납부 / 고지금액 3000원 중 3000원 납부(2017.11.25)"
                                    }
                                ],
                                "id": "default19",
                                "children": [
                                    {
                                        "name": "납부내역 상세화면",
                                        "input": [
                                            {
                                                "text": "상세"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "상세화면",
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
                                        "id": "default22"
                                    }
                                ]
                            },
                            {
                                "name": "납부내역 6개월",
                                "input": [
                                    {
                                        "text": "6 개월"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "6개월"
                                    }
                                ],
                                "id": "default20"
                            },
                            {
                                "name": "납부내역 12개월",
                                "input": [
                                    {
                                        "text": "12개월"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "12개월",
                                        "if": ""
                                    }
                                ],
                                "task": {
                                    "name": ""
                                },
                                "id": "default21"
                            }
                        ]
                    },
                    {
                        "name": "요금납부",
                        "input": [
                            {
                                "text": "요금납부"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "요금납부 화면입니다.\n원하시는 메뉴를 선택하세요",
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
                                        "text": "신용카드"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "미납금액 목록입니다\n\n1",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "1, 12월"
                                            },
                                            {
                                                "url": "",
                                                "text": "2, 11월"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default12"
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
                                        "text": "편의점"
                                    }
                                ],
                                "id": "default23"
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
                                        "text": "입금전용계좌 개요",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "입금전용계좌 조회"
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
                                                "text": "입금전용계좌 리스트"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "1, 전용계좌 1",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "농협 입금전용계좌 생성"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default25"
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
                                "text": "전자고지",
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
                                        "text": "현재 고지 방법입니다.\n 전자고지를 신청하거나 변경하시겠습니까?",
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
                                                ]
                                            }
                                        ],
                                        "id": "default27",
                                        "children": [
                                            {
                                                "name": "카카오페이 고지",
                                                "input": [
                                                    {
                                                        "text": "휴대폰번호 확인"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "휴대폰 번호가 맞습니까?",
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
                                                        "text": "LMS 고지입니다.\n휴대폰 번호가 맞습니까"
                                                    }
                                                ],
                                                "id": "default29"
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
                                                        "text": "이메일 주소가 맞습니까"
                                                    }
                                                ],
                                                "id": "default30"
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
                                        "text": "현재 고지방법입니다.\n해지하시겠습니까",
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
                                "id": "default31"
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
                "text": "이사",
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
                },
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
                    "item": "/files/samchully-1515459210907-samchully.png"
                }
            }
        ]
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