var dialogs = [
    {
        "name": "카테고리보기",
        "id": "default3",
        "filename": "default",
        "input": [
            {
                "regexp": "^1"
            },
            {
                "text": "메뉴"
            },
            {
                "text": "배달"
            }
        ],
        "output": [
            {
                "text": "[메뉴보기]\n주문하시고 싶은 카테고리 번호를 입력해주세요. \n\n#category#+index+. +name+ +price+\n#\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "카테고리선택",
                "id": "default50",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "category"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "메뉴보기",
                        "type": "Call"
                    }
                ],
                "task": {
                    "name": "categoryToMenu"
                }
            },
            {
                "name": "메뉴보기",
                "id": "default48",
                "filename": "default",
                "input": [
                    {
                        "if": "false"
                    }
                ],
                "output": [
                    {
                        "text": "<+menu.name+>의 상세메뉴를 선택해주세요.\n\n#menu.subMenu#+index+. +name+ +price+\n#\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                        "kind": "Text"
                    }
                ],
                "task": {
                    "name": "makeSubMenuList",
                    "kind": "Text"
                },
                "children": [
                    {
                        "name": "메뉴선택",
                        "id": "default49",
                        "filename": "default",
                        "input": [
                            {
                                "types": [
                                    "menuElement"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "if": "context.dialog.menuElement.subMenu",
                                "kind": "Action",
                                "call": "메뉴보기",
                                "type": "Call"
                            },
                            {
                                "kind": "Action",
                                "call": "주문목록",
                                "type": "Call"
                            }
                        ],
                        "task": "menuListUpdate"
                    },
                    {
                        "name": "메뉴텍스트검색",
                        "id": "default51",
                        "filename": "default",
                        "input": [
                            {
                                "types": [
                                    "menuElementText"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "call": "메뉴선택",
                                "type": "Call"
                            }
                        ]
                    },
                    {
                        "name": "바로주문3",
                        "id": "default87",
                        "filename": "default",
                        "input": [
                            {
                                "types": [
                                    "orderble"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "if": "",
                                "kind": "Action",
                                "call": "바로주문"
                            }
                        ],
                        "task": "makeOrderList"
                    },
                    {
                        "input": [
                            {
                                "regexp": "<"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "repeat": 1,
                                "options": {
                                    "page": "pre"
                                }
                            }
                        ],
                        "id": "default1512795450304",
                        "name": "생성된 이름 1512795450304"
                    },
                    {
                        "input": [
                            {
                                "regexp": ">"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "repeat": 1,
                                "options": {
                                    "page": "next"
                                }
                            }
                        ],
                        "id": "default1512795450305",
                        "name": "생성된 이름 1512795450305"
                    },
                    {
                        "name": "메뉴재선택",
                        "id": "default78",
                        "filename": "default",
                        "input": [
                            {
                                "text": ""
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "repeat": "1",
                                "options": {
                                    "output": "보기중에 선택해주세요. (처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "name": "주문목록",
                "id": "default32",
                "filename": "default",
                "input": [
                    {
                        "if": "false"
                    }
                ],
                "output": [
                    {
                        "text": "[주문 목록]\n\n#cart#[+name+] X+quant+, +price+원\n#\n1. 주문 완료\n2. 메뉴 추가\n3. 메뉴 삭제\n4. 메뉴 수량변경\n5. 주문 취소\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
                        "kind": "Text"
                    }
                ],
                "task": {
                    "0": "a",
                    "1": "d",
                    "2": "d",
                    "3": "C",
                    "4": "a",
                    "5": "r",
                    "6": "t",
                    "name": "addCart",
                    "kind": "Text"
                },
                "children": [
                    {
                        "name": "주문조건확인",
                        "id": "default55",
                        "filename": "default",
                        "input": [
                            {
                                "text": "완료"
                            },
                            {
                                "text": "1"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "!context.dialog.deliveryTime",
                                "repeat": "1",
                                "options": {
                                    "output": "**죄송합니다. 현재는 영업시간이 아닙니다.**\n\n[주문 목록]\n\n#cart#[+name+] X+quant+, +price+원\n#\n1. 주문 완료\n2. 메뉴 추가\n3. 메뉴 삭제\n4. 메뉴 수량변경\n5. 주문 취소\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요."
                                }
                            },
                            {
                                "kind": "Action",
                                "if": "!context.dialog.priceCond",
                                "call": "최소가격미달"
                            },
                            {
                                "kind": "Action",
                                "if": "!context.user.address",
                                "call": "주소등록"
                            },
                            {
                                "kind": "Action",
                                "if": "!context.dialog.deliveryDistance",
                                "repeat": "1",
                                "options": {
                                    "output": "**죄송합니다. 배달가능지역이 아닙니다. 주소를 변경하시려면 '주소변경'을 입력해주세요**\n\n[주문 목록]\n\n#cart#[+name+] X+quant+, +price+원\n#\n1. 주문 완료\n2. 메뉴 추가\n3. 메뉴 삭제\n4. 메뉴 수량변경\n5. 주문 취소\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요."
                                }
                            },
                            {
                                "kind": "Action",
                                "if": "!context.user.mobile",
                                "call": "번호등록"
                            },
                            {
                                "kind": "Action",
                                "call": "주문조건만족"
                            }
                        ],
                        "task": "checkCondition"
                    },
                    {
                        "name": "주문조건만족",
                        "id": "default56",
                        "filename": "default",
                        "input": [
                            {
                                "if": "false"
                            }
                        ],
                        "output": [
                            {
                                "text": "[주문 정보]\n\n#cart#+name+ - +price+, +quant+개\n#\n총금액 : +totalPrice+\n배달주소 : +address.지번주소+\n휴대폰번호 : +mobile+\n\n위 내용이 맞습니까?\n\n1. 주문계속\n2. 메뉴변경\n3. 주소변경\n4. 핸드폰변경",
                                "kind": "Text"
                            }
                        ],
                        "children": [
                            {
                                "name": "카드현금",
                                "id": "default57",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": "1"
                                    },
                                    {
                                        "text": "이대로"
                                    },
                                    {
                                        "text": "주문"
                                    },
                                    {
                                        "text": "응"
                                    }
                                ],
                                "output": [
                                    {
                                        "text": "결제방식을 선택하세요.\n\n1. 카드\n2. 현금\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                                        "kind": "Text"
                                    }
                                ],
                                "children": [
                                    {
                                        "name": "배달요청사항",
                                        "id": "default58",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "text": "1"
                                            },
                                            {
                                                "text": "2"
                                            },
                                            {
                                                "text": "카드"
                                            },
                                            {
                                                "text": "현금"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "text": "배달시 요청사항을 입력하세요.\n(ex 벨 누르지 말고 노크해주세요)\n\n요청 사항이 없다면 '없음',\n이전으로 가려면 '이전', \n주문 취소는 '취소'를 입력하세요.",
                                                "kind": "Text"
                                            }
                                        ],
                                        "children": [
                                            {
                                                "name": "최종확인",
                                                "id": "default59",
                                                "filename": "default",
                                                "input": [
                                                    {
                                                        "if": "true"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "text": "[주문최종확인]\n#cart#[+name+] X+quant+, +price+원\n#\n\n*총금액 : +totalPrice+\n*배달주소 : +address.지번주소+\n*주문자 전화번호 : +mobile+\n*결제 : +pay+\n*요청사항 : +discription+\n\n위 내용대로 주문하시겠습니까?\n1. 주문\n2. 취소",
                                                        "kind": "Text"
                                                    }
                                                ],
                                                "children": [
                                                    {
                                                        "name": "주문최종완료",
                                                        "id": "default60",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "text": "1"
                                                            },
                                                            {
                                                                "text": "주문"
                                                            },
                                                            {
                                                                "text": "완료"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "text": "주문요청이 완료되었습니다. 음식점이 승인하면 접수완료 문자가 발송되며, 그전까진 '주문내역 보기'에서 주문 취소 가능합니다.\n\n배달은 30분 가량 소요될 예정입니다.\n\n처음으로 돌아가시려면 '시작'을 입력해주세요.",
                                                                "kind": "Text"
                                                            }
                                                        ],
                                                        "task": "reserveRequest"
                                                    },
                                                    {
                                                        "name": "주문최종취소",
                                                        "id": "default61",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "text": "2"
                                                            },
                                                            {
                                                                "text": "취소"
                                                            },
                                                            {
                                                                "text": "중단"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "text": "주문이 취소되었습니다.\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                                                                "kind": "Text"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "dialog_default96",
                                                        "id": "default96",
                                                        "filename": "default",
                                                        "input": [
                                                            {
                                                                "text": ""
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Action",
                                                                "repeat": "1"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "task": "saveRequest"
                                            }
                                        ],
                                        "task": "savePay"
                                    },
                                    {
                                        "name": "카드현금예외",
                                        "id": "default92",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "text": ""
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "repeat": "1"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "메뉴변경2",
                                "id": "default74",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": "2"
                                    },
                                    {
                                        "text": "메뉴"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "call": "주문목록"
                                    }
                                ]
                            },
                            {
                                "name": "주소변경2",
                                "id": "default75",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": "3"
                                    },
                                    {
                                        "text": "주소"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "call": "주소등록"
                                    }
                                ]
                            },
                            {
                                "name": "핸드폰변경2",
                                "id": "default76",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": "4"
                                    },
                                    {
                                        "text": "핸드폰"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "call": "핸드폰번호"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "메뉴추가",
                        "id": "default62",
                        "filename": "default",
                        "input": [
                            {
                                "text": "2"
                            },
                            {
                                "text": "추가"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "call": "카테고리보기"
                            }
                        ]
                    },
                    {
                        "name": "메뉴삭제",
                        "id": "default64",
                        "filename": "default",
                        "input": [
                            {
                                "text": "3"
                            },
                            {
                                "text": "삭제"
                            }
                        ],
                        "output": [
                            {
                                "text": "삭제할 메뉴의 번호를 입력하세요. (수량을 줄이고 싶다면 '수량변경'을 입력하세요.)\n\n#cart#+index+. +name+ - +price+, +quant+개\n#",
                                "kind": "Text"
                            }
                        ],
                        "task": {
                            "name": "makeCartList"
                        },
                        "children": [
                            {
                                "name": "삭제",
                                "id": "default66",
                                "filename": "default",
                                "input": [
                                    {
                                        "types": [
                                            "cartItem"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "text": "[메뉴 삭제]\n\n[+cartItem.name+] 를 주문목록에서 삭제하시겠습니까?\n\n1. 예\n2. 아니오",
                                        "kind": "Text"
                                    }
                                ],
                                "children": [
                                    {
                                        "name": "삭제완료",
                                        "id": "default69",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "text": "1"
                                            },
                                            {
                                                "text": "예"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "call": "주문목록",
                                                "options": {
                                                    "output": "*메뉴가 삭제되었습니다*\n[주문 목록]\n#cart#[+name+] X+quant+, +price+원 # \n1. 주문 완료 \n2. 메뉴 추가 \n3. 메뉴 삭제 \n4. 메뉴 수량변경 \n5. 주문 취소  \n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요."
                                                }
                                            }
                                        ],
                                        "task": "deleteCartItem"
                                    },
                                    {
                                        "name": "삭제취소",
                                        "id": "default70",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "text": "2"
                                            },
                                            {
                                                "text": "아니"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "call": "주문목록",
                                                "options": {
                                                    "output": "*삭제가 취소되었습니다*\n[주문 목록]\n#cart#[+name+] X+quant+, +price+원 # \n1. 주문 완료 \n2. 메뉴 추가 \n3. 메뉴 삭제 \n4. 메뉴 수량변경 \n5. 주문 취소  \n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요."
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        "name": "삭제예외",
                                        "id": "default91",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "text": ""
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "repeat": "1"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "수량변경바로가기",
                                "id": "default83",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": "변경"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "call": "수량변경"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "수량변경",
                        "id": "default65",
                        "filename": "default",
                        "input": [
                            {
                                "text": "4"
                            },
                            {
                                "text": "변경"
                            }
                        ],
                        "output": {
                            "text": "수량을 변경할 메뉴를 선택하세요. \n\n#cart#+index+. +name+ - +price+, +quant+개\n#",
                            "kind": "Text"
                        },
                        "task": {
                            "name": "makeCartList",
                            "kind": "Text"
                        },
                        "children": [
                            {
                                "name": "수량변경2",
                                "id": "default67",
                                "filename": "default",
                                "input": [
                                    {
                                        "types": [
                                            "cartItem"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "text": "[수량변경]\n메뉴이름 : +cartItem.name+\n\n원하시는 수량을 숫자로 입력하세요.\n(현재수량 : +cartItem.quant+)",
                                        "kind": "Text"
                                    }
                                ],
                                "children": [
                                    {
                                        "name": "수량변경완료",
                                        "id": "default68",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "regexp": "\\d*"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "call": "주문목록",
                                                "options": {
                                                    "output": "*수량이 변경되었습니다*\n[주문 목록]\n#cart#[+name+] X+quant+, +price+원 # \n1. 주문 완료 \n2. 메뉴 추가 \n3. 메뉴 삭제 \n4. 메뉴 수량변경 \n5. 주문 취소  \n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요."
                                                },
                                                "type": "Call"
                                            }
                                        ],
                                        "task": {
                                            "name": "changeQuantity"
                                        }
                                    },
                                    {
                                        "name": "수량변경2예외",
                                        "id": "default90",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "text": ""
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "repeat": "1"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "수량변경예외",
                                "id": "default89",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": ""
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "repeat": "1"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "주문취소",
                        "id": "default71",
                        "filename": "default",
                        "input": [
                            {
                                "text": "5"
                            },
                            {
                                "text": "취소"
                            }
                        ],
                        "output": [
                            {
                                "text": "정말 주문을 취소하시겠습니까?\n(장바구니가 모두 비워집니다.)\n\n1. 예\n2. 아니오",
                                "kind": "Text"
                            }
                        ],
                        "children": [
                            {
                                "name": "주문취소완료",
                                "id": "default72",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": "1"
                                    },
                                    {
                                        "text": "예"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "call": "시작"
                                    }
                                ]
                            },
                            {
                                "name": "취소중단",
                                "id": "default73",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": "2"
                                    },
                                    {
                                        "text": "아니"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "call": "주문목록"
                                    }
                                ]
                            },
                            {
                                "name": "주문취소재선택",
                                "id": "default80",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": ""
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "repeat": "1",
                                        "options": {
                                            "output": "보기중에서 선택해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요."
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "최소가격미달",
                        "id": "default84",
                        "filename": "default",
                        "input": [
                            {
                                "if": "false"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "call": "주문목록",
                                "options": {
                                    "output": "*배달가능한 최소가격은 +minPrice+입니다.*[주문 목록]\n\n#cart#[+name+] X+quant+, +price+원\n#\n1. 주문 완료\n2. 메뉴 추가\n3. 메뉴 삭제\n4. 메뉴 수량변경\n5. 주문 취소\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요."
                                }
                            }
                        ]
                    },
                    {
                        "name": "주문목록예외",
                        "id": "default88",
                        "filename": "default",
                        "input": [
                            {}
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "repeat": "1",
                                "options": {
                                    "output": "목록에서 선택해주세요"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "name": "바로주문2",
                "input": [
                    {
                        "types": [
                            "orderble"
                        ]
                    }
                ],
                "output": [
                    {
                        "if": "",
                        "kind": "Action",
                        "call": "바로주문",
                        "type": "Call"
                    }
                ],
                "task": {
                    "name": "makeOrderList"
                },
                "id": "default1512795450338"
            },
            {
                "name": "카테고리보기예외",
                "id": "default86",
                "filename": "default",
                "input": [
                    {
                        "text": ""
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "repeat": "1",
                        "options": {
                            "output": "보기중에 선택해주세요. (처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)"
                        },
                        "type": "Repeat"
                    }
                ]
            }
        ],
        "task": {
            "0": "g",
            "1": "e",
            "2": "t",
            "3": "C",
            "4": "a",
            "5": "t",
            "6": "e",
            "7": "g",
            "8": "o",
            "9": "r",
            "10": "y",
            "name": "getCategory",
            "kind": "Text"
        }
    },
    {
        "name": "바로주문",
        "id": "default29",
        "filename": "default",
        "input": [
            {
                "types": [
                    "orderble"
                ]
            }
        ],
        "output": [
            {
                "if": "context.dialog.menu.subMenu.length == 1",
                "kind": "Action",
                "call": "바로주문단일",
                "type": "Call"
            },
            {
                "kind": "Action",
                "call": "바로주문복수",
                "type": "Call"
            }
        ],
        "task": "makeOrderList"
    },
    {
        "name": "주소등록",
        "id": "default18",
        "filename": "default",
        "input": [
            {
                "text": "주소 등록"
            },
            {
                "text": "주소 변경"
            }
        ],
        "output": [
            {
                "text": "지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "주소입력",
                "id": "default20",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "address"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "repeat": 1,
                        "if": "context.dialog.address.지번본번 == undefined",
                        "options": {
                            "output": "상세주소를 입력해주세요. 이게 주소의 전부라면 '여기까지'라고 입력해주세요."
                        }
                    },
                    {
                        "kind": "Action",
                        "repeat": 1,
                        "if": "context.dialog.address.상세주소 == undefined",
                        "options": {
                            "output": "동호수나 몇층인지까지 말씀해주세요. 이게 전부이면 '여기까지' 라고 입력해주세요."
                        }
                    },
                    {
                        "kind": "Action",
                        "call": "주소조건만족"
                    }
                ]
            },
            {
                "name": "지번본번없음",
                "id": "default39",
                "filename": "default",
                "input": [
                    {
                        "if": "false"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "repeat": "1",
                        "options": {
                            "output": "상세주소를 입력해주세요. 이게 주소의 전부라면 '여기까지' 라고 입력해주세요."
                        }
                    }
                ]
            },
            {
                "name": "상세주소없음",
                "id": "default40",
                "filename": "default",
                "input": [
                    {
                        "if": "false"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "repeat": "1",
                        "options": {
                            "output": "동호수나 몇층인지까지 말씀해주세요. 이게 전부이면 '여기까지' 라고 입력해주세요."
                        }
                    }
                ]
            },
            {
                "name": "주소조건만족",
                "id": "default42",
                "filename": "default",
                "input": [
                    {
                        "if": "false"
                    }
                ],
                "output": [
                    {
                        "text": "주소가 \n\n\"+address.지번주소+\"\n\n로 등록되었습니다.\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                        "kind": "Text"
                    },
                    {
                        "kind": "Action",
                        "call": "주문조건확인",
                        "if": "context.dialog.ordering"
                    }
                ]
            },
            {
                "name": "New Dialog1",
                "input": [
                    {
                        "if": "true",
                        "text": "여기"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "주소조건만족"
                    }
                ],
                "id": "default1"
            }
        ]
    },
    {
        "name": "바로주문복수",
        "id": "default31",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "options": {
                    "output": "'+keyword+'에 해당되는 메뉴들입니다. 원하시는 메뉴의 번호를 입력해주세요. \n#menu.subMenu#+index+. +name+\n#"
                },
                "call": "메뉴보기"
            }
        ],
        "children": [
            {
                "name": "바로주문 복수선택",
                "id": "default36",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "directMenu"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "주문목록"
                    }
                ],
                "task": {
                    "name": "makeCurrentItem4"
                }
            }
        ],
        "task": {
            "name": "makeOrderList"
        }
    },
    {
        "name": "주소확인",
        "id": "default9",
        "filename": "default",
        "input": [
            {
                "regexp": "^4$"
            },
            {
                "text": "주소"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "주소있음",
                "if": "context.user.address"
            },
            {
                "kind": "Action",
                "call": "주소없음"
            }
        ]
    },
    {
        "name": "주소있음",
        "id": "default10",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "현재 등록된 주소는\n \n\"+address.지번주소+\"\n\n입니다. 변경을 원하시면 새로운 주소를 입력해주세요.\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "주소변경",
                "id": "default44",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "address"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "주소입력"
                    }
                ]
            },
            {
                "name": "New Dialog2",
                "input": [
                    {
                        "if": "true",
                        "text": "여기"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "주소조건만족"
                    }
                ],
                "id": "default2"
            }
        ]
    },
    {
        "name": "주소없음",
        "id": "default12",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "현재 등록된 주소가 없습니다. 등록을 원하시면 새로운 주소를 입력해주세요.",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "주소등록바로가기",
                "id": "default45",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "address"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "주소입력"
                    }
                ]
            },
            {
                "name": "New Dialog3",
                "input": [
                    {
                        "if": "true",
                        "text": "여기"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "주소조건만족"
                    }
                ],
                "id": "default4"
            }
        ]
    },
    {
        "name": "번호등록",
        "id": "default19",
        "filename": "default",
        "input": [
            {
                "text": "번호 등록"
            },
            {
                "text": "핸드폰 등록"
            }
        ],
        "output": [
            {
                "text": "핸드폰번호를 입력해주세요\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "핸드폰번호",
                "id": "default21",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "mobile"
                        ]
                    }
                ],
                "output": [
                    {
                        "text": "휴대폰으로 발송된 인증번호를 입력해주세요.\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                        "kind": "Text"
                    }
                ],
                "task": "sendSMSAuth",
                "children": [
                    {
                        "name": "등록완료",
                        "id": "default53",
                        "filename": "default",
                        "input": [
                            {
                                "regexp": "\\d{4}"
                            }
                        ],
                        "output": [
                            {
                                "if": "dialog.inRaw.replace(/s*/g, '') == context.dialog.smsAuth",
                                "kind": "Action",
                                "id": "default53_0",
                                "call": "인증번호일치"
                            },
                            {
                                "kind": "Action",
                                "options": {
                                    "output": ""
                                }
                            }
                        ]
                    },
                    {
                        "name": "인증번호일치",
                        "id": "default54",
                        "filename": "default",
                        "input": [
                            {
                                "if": "false"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "context.dialog.ordering",
                                "call": "주문조건확인",
                                "task": {
                                    "0": "s",
                                    "1": "a",
                                    "2": "v",
                                    "3": "e",
                                    "4": "M",
                                    "5": "o",
                                    "6": "b",
                                    "7": "i",
                                    "8": "l",
                                    "9": "e",
                                    "name": "saveMobile",
                                    "inRaw": "8497",
                                    "inNLP": "8497"
                                }
                            },
                            {
                                "text": "휴대폰 번호가\n\n+mobile+\n\n로 등록되었습니다.\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                                "kind": "Text"
                            }
                        ],
                        "task": {
                            "0": "s",
                            "1": "a",
                            "2": "v",
                            "3": "e",
                            "4": "M",
                            "5": "o",
                            "6": "b",
                            "7": "i",
                            "8": "l",
                            "9": "e",
                            "name": "saveMobile"
                        }
                    },
                    {
                        "name": "인증번호불일치",
                        "id": "default93",
                        "filename": "default",
                        "input": [
                            {
                                "text": "취소"
                            }
                        ],
                        "output": [
                            {
                                "text": "인증번호가 틀렸습니다. 원하시는 동작을 선택해주세요.\n\n1. 인증번호 재발송\n2. 휴대폰 등록 취소\n\n처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'",
                                "kind": "Text"
                            }
                        ],
                        "children": [
                            {
                                "name": "재발송",
                                "id": "default94",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": "1"
                                    },
                                    {
                                        "text": "발송"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "call": "핸드폰번호"
                                    }
                                ]
                            },
                            {
                                "name": "휴대폰등록취소",
                                "id": "default95",
                                "filename": "default",
                                "input": [
                                    {
                                        "text": "2"
                                    },
                                    {
                                        "text": "취소"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "call": "시작"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "쿠폰",
        "id": "default82",
        "filename": "default",
        "input": [
            {
                "text": "쿠폰"
            },
            {
                "regexp": "^6"
            }
        ],
        "output": [
            {
                "if": "context.bot.event",
                "text": "<+resname+> \n쿠폰정보입니다.\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text",
                "id": "default0_0"
            },
            {
                "if": "true",
                "text": "<+resname+> \n지금은 등록된 쿠폰이 없습니다. 다음에 다시 확인해주세요!\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text",
                "id": "default0_1"
            }
        ]
    },
    {
        "name": "번호확인",
        "id": "default14",
        "filename": "default",
        "input": [
            {
                "regexp": "^5"
            },
            {
                "text": "핸드폰"
            },
            {
                "text": "번호"
            },
            {
                "text": "연락처"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "call": "번호있음",
                "if": "context.user.mobile"
            },
            {
                "kind": "Action",
                "call": "번호없음"
            }
        ]
    },
    {
        "name": "번호있음",
        "id": "default15",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "현재 등록된 번호는\n \n\"+mobile+\"\n\n입니다. 변경을 원하실 경우 새로운 번호를 입력해주세요.\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "핸드폰변경",
                "id": "default46",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "mobile"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "핸드폰번호"
                    }
                ]
            }
        ]
    },
    {
        "name": "번호없음",
        "id": "default17",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "현재 등록된 번호가 없습니다. 등록을 원하시면 핸드폰 번호를 입력해주세요.\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "핸드폰등록바로가기",
                "id": "default47",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "mobile"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "call": "핸드폰번호",
                        "type": "Call"
                    }
                ]
            }
        ]
    },
    {
        "name": "주문내역",
        "id": "default22",
        "filename": "default",
        "input": [
            {
                "regexp": "^2"
            },
            {
                "text": "내 역"
            }
        ],
        "output": [
            {
                "if": "context.dialog.orderHistory",
                "text": "[\"+mobile+\" 님의 최근 주문 내역]\n\n주문상태: +orderHistory.status+\n주문일시: +orderHistory.time.month+월 +orderHistory.time.date+일 +orderHistory.time.hour+:+orderHistory.time.minute+\n도착예정시각: +expectedTime.hour+:+expectedTime.minute+\n배달주소: +address.지번주소+\n총 금액: +totalPrice+원\n주문내용:\n#orderHistory.order# - +name+ X+quant+, +price+원\n#\n* '주문취소' - 승인대기중인 주문 취소\n*'그대로' - 예전과 똑같이 주문\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text",
                "id": "default22_0"
            },
            {
                "text": "아직 회원님의 주문내역이 없네요.\n\n어서 <+name+> 챗봇을 통해 음식을 주문해보세요!\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text",
                "id": "default22_1"
            }
        ],
        "task": "getOrderHistory"
    },
    {
        "name": "매장안내",
        "id": "default81",
        "filename": "default",
        "input": [
            {
                "regexp": "^3"
            },
            {
                "text": "매장"
            },
            {
                "text": "안내"
            }
        ],
        "output": [
            {
                "text": "<<+resname+>>\n\n전화번호 : +phone+\n주소: +location+\n [영업시간] \n+startTime+ ~ +endTime+\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text"
            }
        ],
        "task": {
            "name": "getLocation"
        }
    },
    {
        "name": "주문취소확인",
        "id": "default101",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "text": "주문상태: +orderHistory.status+\n주문일시: +orderHistory.time.month+월 +orderHistory.time.date+일 +orderHistory.time.hour+:+orderHistory.time.minute+\n도착예정시각: +expectedTime.hour+:+expectedTime.minute+\n배달주소: +address.지번주소+\n총 금액: +totalPrice+원\n[주문내용]:\n#orderHistory.order#[+name+] X+quant+, +price+원\n#\n위 주문을 취소하시겠습니까?\"\n\n1. 네\n2. 아니오",
                "kind": "Text"
            }
        ],
        "children": [
            {
                "name": "주문취소완료",
                "id": "default102",
                "filename": "default",
                "input": [
                    {
                        "text": "1"
                    },
                    {
                        "text": "네"
                    },
                    {
                        "text": "응"
                    }
                ],
                "output": [
                    {
                        "text": "주문이 취소되었습니다.\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                        "kind": "Text"
                    }
                ],
                "task": "orderCancel"
            },
            {
                "name": "주문취소중단",
                "id": "default103",
                "filename": "default",
                "input": [
                    {
                        "text": "2"
                    },
                    {
                        "text": "아니다"
                    }
                ],
                "output": [
                    {
                        "text": "주문이 취소되지 않았습니다.\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                        "kind": "Text"
                    }
                ]
            }
        ]
    },
    {
        "id": "default100",
        "filename": "default",
        "input": [
            {
                "text": "주문 취소"
            }
        ],
        "output": [
            {
                "if": "context.dialog.orderHistory && context.dialog.orderHistory.status=='승인대기중'",
                "kind": "Action",
                "id": "default0_0",
                "call": "주문취소확인"
            },
            {
                "if": "",
                "text": "<+resname+> \n취소가능한 주문이 없습니다. 이미 주문이 승인된 경우 취소가 불가능합니다.\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text"
            }
        ],
        "name": "주문취소",
        "task": "getOrderHistory"
    },
    {
        "name": "바로주문단일",
        "id": "default30",
        "filename": "default",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": {
            "kind": "Action",
            "call": "주문목록",
            "type": "Call"
        },
        "task": {
            "0": "m",
            "1": "a",
            "2": "k",
            "3": "e",
            "4": "C",
            "5": "u",
            "6": "r",
            "7": "r",
            "8": "e",
            "9": "n",
            "10": "t",
            "11": "I",
            "12": "t",
            "13": "e",
            "14": "m",
            "15": "3",
            "name": "makeCurrentItem3",
            "kind": "Text"
        }
    },
    {
        "id": "default0",
        "filename": "default",
        "input": [
            {
                "text": "그대로"
            },
            {
                "text": "지난"
            },
            {
                "text": "똑같이"
            },
            {
                "text": "예전 처럼"
            }
        ],
        "output": [
            {
                "if": "context.dialog.orderHistory",
                "kind": "Action",
                "call": "최종확인"
            },
            {
                "text": "아직 저를 통해 주문하신적이 없네요. 한번 주문을 하신 뒤로는, 모든 내용을 기억해 그대로 주문해드릴 수 있어요!\n\n(처음으로 돌아가려면 '처음', 이전으로 돌아가려면 '이전'을 입력해주세요.)",
                "kind": "Text"
            }
        ],
        "name": "그대로",
        "task": {
            "name": "recentCart"
        }
    }
];














var commonDialogs = [
    {
        "id": "defaultcommon0",
        "filename": "defaultcommon",
        "name": "시작",
        "input": [
            {
                "text": "시작"
            },
            {
                "text": "처음"
            }
        ],
        "output": [
            {
                "if": "context.botUser.isOwner",
                "kind": "Action",
                "call": "사장님주문내역",
                "type": "Call"
            },
            {
                "text": "안녕하세요. \n<+resname+>입니다.\n\n주문을 하고싶으신 메뉴를 보시려면 메뉴보기를 선택해주세요. \n+notOpen+\n1. 배달주문\n2. 주문내역(주문취소, 그대로 주문)\n3. 매장안내\n4. 주소 확인/변경\n5. 연락처 확인/변경",
                "kind": "Text"
            }
        ],
        "task": {
            "name": "startTask"
        }
    },
    {
        "id": "defaultcommon1",
        "filename": "defaultcommon",
        "name": "상위",
        "input": [
            {
                "text": "상위"
            },
            {
                "text": "이전"
            }
        ],
        "output": [
            {
                "up": 1,
                "kind": "Action"
            }
        ]
    },
    {
        "id": "defaultcommon2",
        "filename": "defaultcommon",
        "name": "답변없음",
        "input": [
            {
                "text": ""
            }
        ],
        "output": "알아듣지 못했습니다"
    }
];















var _bot = require(require('path').resolve("engine/bot")).getTemplateBot('delivery');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
