var dialogs = [
    {
        "name": "1.카테고리 대",
        "input": [
            {
                "text": {
                    "raw": "카테고리",
                    "nlp": "카테고리"
                }
            },
            {
                "text": {
                    "raw": "다른",
                    "nlp": "다른"
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
                "text": "카테고리별로 추천상품을 안내해드릴께요."
            }
        ],
        "task": {
            "name": "getcategory"
        },
        "id": "default0",
        "children": [
            {
                "name": "1.카테고리 중",
                "input": [
                    {
                        "types": [
                            "categorylist"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "카테고리 별 추천상품입니다.\n선택하시면 사진과 함께 세부사항을 보여드릴께요."
                    }
                ],
                "task": {
                    "name": "showcategory"
                },
                "id": "default1",
                "children": [
                    {
                        "name": "1.상품선택",
                        "input": [
                            {
                                "types": [
                                    "itemlist"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "#context.session.item#**+name+**\n\n*가격: +price+원\n\n*주문시 유의사항: \n+notic+\n\n*배송이 가능한 시간: \n+time+\n\n*주문취소안내: \n+cancel+\n#\n\n처음으로 가려면 \"시작\"이라고 입력해주세요.",
                                "if": "context.session.item[0].category===\"기획상품(택배배송)\""
                            },
                            {
                                "kind": "Content",
                                "text": "#context.session.item#**+name+**\n\n*가격: +price+원\n\n*주문시 유의사항: \n+notic+\n\n*배송이 가능한 시간: \n+time+\n\n*배송지역: \n+region+\n\n*특정 기념일 배송 유의사항: \n+special+\n\n*주문취소안내: \n+cancel+\n#\n\n처음으로 가려면 \"시작\"이라고 입력해주세요.",
                                "if": "context.session.item[0].category!==\"기획상품(택배배송)\""
                            }
                        ],
                        "task": {
                            "name": "showitem"
                        },
                        "id": "default2",
                        "children": [
                            {
                                "name": "1.변경하고 주문서 확인하기",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "확인",
                                            "nlp": "확인"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "확인하기",
                                            "nlp": "확인 하다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "call",
                                        "dialogName": "3.주문서 확인",
                                        "dialog": "3.주문서 확인",
                                        "dialogId": "default44"
                                    }
                                ],
                                "id": "default60"
                            },
                            {
                                "name": "1.이 상품으로 주문하기",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "주문",
                                            "nlp": "주문"
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
                                        "type": "call",
                                        "dialogName": "3.기준및 신규",
                                        "dialog": "3.기준및 신규",
                                        "dialogId": "default11"
                                    }
                                ],
                                "id": "default8"
                            },
                            {
                                "name": "1.다른 상품 더보기",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "다른",
                                            "nlp": "다른"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "더보",
                                            "nlp": "더보"
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
                                        "type": "call",
                                        "dialog": "1.카테고리 대",
                                        "dialogName": "1.카테고리 대",
                                        "dialogId": "default0"
                                    }
                                ],
                                "id": "default9"
                            },
                            {
                                "name": "1.선택하는 없을 때",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "call",
                                        "dialog": "시작",
                                        "dialogName": "시작",
                                        "dialogId": "defaultcommon0"
                                    }
                                ],
                                "id": "default58"
                            }
                        ]
                    },
                    {
                        "name": "1.카테고리 중 입력 틀린 경우",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "buttons": [
                                    {
                                        "text": "다시 입력"
                                    },
                                    {
                                        "text": "시작"
                                    }
                                ],
                                "text": "죄송합니다. 더 정확하게 입력해주세요. 다시 입력하고 싶으시면, 아래의 '다시 입력' 버튼을 선택해주세요~\n\n처음으로 가려면“시작“이라고 입력해주세요."
                            }
                        ],
                        "id": "default57",
                        "children": [
                            {
                                "name": "56",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "다시",
                                            "nlp": "다시"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "선택",
                                            "nlp": "선택"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "call",
                                        "dialog": "1.카테고리 중",
                                        "dialogName": "1.카테고리 중",
                                        "dialogId": "default1"
                                    }
                                ],
                                "id": "default94"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "1.카테고리 대 입력틀인 경우",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "type": "repeat",
                        "dialog": 1,
                        "options": {
                            "output": "죄송합니다. 더 정확하게 입력해주세요. 다시 입력하고 싶으시면, 아래의 '다시 입력' 버튼을 선택해주세요~\n\n처음으로 가려면“시작“이라고 입력해주세요."
                        },
                        "buttons": [
                            {
                                "text": "다시 입력"
                            },
                            {
                                "text": "시작"
                            }
                        ],
                        "text": "죄송합니다. 더 정확하게 입력해주세요. 다시 입력하고 싶으시면, 아래의 '다시 입력' 버튼을 선택해주세요~\n\n처음으로 가려면“시작“이라고 입력해주세요."
                    }
                ],
                "id": "default56",
                "children": [
                    {
                        "name": "1.카테고리 대 입력들 대시 선택",
                        "input": [
                            {
                                "text": {
                                    "raw": "다시",
                                    "nlp": "다시"
                                }
                            },
                            {
                                "text": {
                                    "raw": "입력",
                                    "nlp": "입력"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "type": "call",
                                "dialogName": "1.카테고리 대",
                                "dialog": "1.카테고리 대",
                                "dialogId": "default0"
                            }
                        ],
                        "id": "default93"
                    }
                ]
            }
        ]
    },
    {
        "name": "3.상품 주문하기",
        "input": [
            {
                "text": {
                    "raw": "2",
                    "nlp": "2"
                }
            },
            {
                "text": {
                    "raw": "주문",
                    "nlp": "주문"
                }
            },
            {
                "text": {
                    "raw": "상품 주문하기",
                    "nlp": "상품 주문 하다"
                }
            },
            {
                "text": {
                    "raw": "주문하기",
                    "nlp": "주문 하다"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "상품 주문을 도와드릴께요.\n\n원하시는 상품이름을 아신다면, 입력해주세요\n\n추천상품을 안내를 원하신다면 '추천해줘'라고 입력하시면 됩니다",
                "buttons": [
                    {
                        "url": "",
                        "text": "추천해줘"
                    }
                ]
            }
        ],
        "id": "default6",
        "children": [
            {
                "name": "3.\"추천\"입력",
                "input": [
                    {
                        "text": {
                            "raw": "추천",
                            "nlp": "추천"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "type": "call",
                        "dialog": "1.카테고리 대",
                        "dialogName": "1.카테고리 대",
                        "dialogId": "default0"
                    }
                ],
                "id": "default7"
            },
            {
                "name": "3.선택 상품 확인",
                "input": [
                    {
                        "types": "allnamelist"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "#context.session.item#선택하신 **+name+**에 대한 정보입니다.\n\n상품 번호: +code+\n배송 안내: +delivery+\n회원 혜택: +VIP+\n\n가격:\n       일반가: +price+원\n       회원할인가: +sale_price+원\n\n상품안내: +description+\n#\n\n이 상품으로 주문하시겠습니까?",
                        "if": "3.상품 이름을 입력성공"
                    }
                ],
                "id": "default10",
                "task": {
                    "name": "categorycheck"
                },
                "children": [
                    {
                        "name": "3.기준및 신규",
                        "input": [
                            {
                                "intent": "네"
                            },
                            {
                                "text": {
                                    "raw": "네",
                                    "nlp": "네"
                                }
                            },
                            {
                                "text": {
                                    "raw": "주문",
                                    "nlp": "주문"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "context.user.mobile==undefined",
                                "options": {
                                    "output": "주문하시는 고객님의 휴대폰 연락처를 입력해주세요.\n(ex: 01012345678)"
                                },
                                "type": "call",
                                "dialog": "3.고객 이메일",
                                "dialogName": "3.고객 이메일",
                                "dialogId": "default16"
                            },
                            {
                                "kind": "Action",
                                "if": "context.user.mobile!==undefined",
                                "options": {
                                    "output": "수취인/배송정보 접수를 진행하겠습니다.\n\n결혼식을 위한 배송인가요?"
                                },
                                "type": "call",
                                "dialogName": "3.기존회원",
                                "dialog": "3.기존회원",
                                "dialogId": "default21"
                            }
                        ],
                        "id": "default11",
                        "task": {
                            "name": "neworder"
                        }
                    },
                    {
                        "name": "3.선택 상품 확인 다시",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "type": "up",
                                "dialog": 1,
                                "options": {
                                    "output": ""
                                },
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "다시 확인"
                                    },
                                    {
                                        "url": "",
                                        "text": "시작"
                                    }
                                ],
                                "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 확인 하고 싶은면 \"다시 확인\"버튼을 누르세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
                            }
                        ],
                        "id": "default87",
                        "children": [
                            {
                                "name": "3.선택 상품 확인 다시 버튼",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "다시",
                                            "nlp": "다시"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "확인",
                                            "nlp": "확인"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "call",
                                        "dialogName": "3.선택 상품 확인",
                                        "dialog": "3.선택 상품 확인",
                                        "dialogId": "default10"
                                    }
                                ],
                                "id": "default88"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "100",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "죄송합니다. 고객님이 입력하신 상품명이 없습니다. 다시 입력하시고 싶으면 “다시 입력“을 입력해주세요.\n\n추천 상품을 보고 싶으시면 \"추천\"을 입력해주세요.\n\n처음으로 가려면“시작“이라고 입력해주세요.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "다시 입력"
                            },
                            {
                                "url": "",
                                "text": "추천"
                            },
                            {
                                "url": "",
                                "text": "시작"
                            }
                        ]
                    }
                ],
                "id": "default138",
                "children": [
                    {
                        "name": "101",
                        "input": [
                            {
                                "text": {
                                    "raw": "다시",
                                    "nlp": "다시"
                                }
                            },
                            {
                                "text": {
                                    "raw": "입력",
                                    "nlp": "입력"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "type": "call",
                                "dialogName": "3.상품 주문하기",
                                "dialog": "3.상품 주문하기",
                                "dialogId": "default6"
                            }
                        ],
                        "id": "default139"
                    },
                    {
                        "name": "102",
                        "input": [
                            {
                                "text": {
                                    "raw": "추천",
                                    "nlp": "추천"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "type": "call",
                                "dialogName": "3.\"추천\"입력",
                                "dialog": "3.\"추천\"입력",
                                "dialogId": "default7"
                            }
                        ],
                        "id": "default140"
                    }
                ]
            }
        ],
        "task": {
            "name": "allname"
        }
    },
    {
        "name": "6.내 주문 확인하기",
        "input": [
            {
                "text": {
                    "raw": "4",
                    "nlp": "4"
                }
            },
            {
                "text": {
                    "raw": "내 주문 확인 하다",
                    "nlp": "내 주문 확인 하다"
                }
            },
            {
                "text": {
                    "raw": "주문 확인",
                    "nlp": "주문 확인"
                }
            },
            {
                "text": {
                    "raw": "내 주문 확인하기",
                    "nlp": "내 주문 확인 하다"
                }
            },
            {
                "text": {
                    "raw": "확인",
                    "nlp": "확인"
                }
            }
        ],
        "output": [
            {
                "kind": "Action",
                "if": "context.user.mobile===undefined",
                "type": "call",
                "dialogName": "6.주문 확인 신규회원",
                "dialog": "6.주문 확인 신규회원",
                "dialogId": "default75"
            },
            {
                "kind": "Action",
                "if": "context.user.mobile!==undefined",
                "type": "call",
                "dialogName": "6.주문 확인 기존회원",
                "dialog": "6.주문 확인 기존회원",
                "dialogId": "default76"
            }
        ],
        "id": "default54",
        "task": {
            "name": "recordorder"
        }
    },
    {
        "name": "2.자주하는 질문 대",
        "input": [
            {
                "text": {
                    "raw": "1",
                    "nlp": "1"
                }
            },
            {
                "text": {
                    "raw": "질문",
                    "nlp": "질문"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "무엇이든 물어보세요! 궁금하신 점을 문자로 입력해도 알아듣는 인공지능 배달봇입니다.\n\n예를 들면, 배달시간은 몇시부터 몇시까지 가능한가요? 라고 입력해도 되요.\n\n또는, 다음 중 궁금하신 점과 관련된 주제를 선택해주세요.",
                "buttons": []
            }
        ],
        "id": "default3",
        "task": {
            "name": "getFAQcategory"
        },
        "children": [
            {
                "name": "2.질문 토픽 중",
                "input": [
                    {
                        "types": [
                            "faqcategorylist"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "무엇이 궁금하신가요? 선택해주세요!"
                    }
                ],
                "id": "default4",
                "task": {
                    "name": "showfaqlist"
                },
                "children": [
                    {
                        "name": "2.질문 답",
                        "input": [
                            {
                                "types": [
                                    "faqitemlist"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "#context.session.faqitem#**question** \n+question+\n\n**answer** \n+answer+\n#\n\n처음으로 가려면 \"시작\"이라고 입력해주세요."
                            }
                        ],
                        "task": {
                            "name": "showfaq"
                        },
                        "id": "default5"
                    },
                    {
                        "name": "2.질문 토픽 중 다시",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "죄송합니다. 더 정확하게 입력해주세요. 다시 입력하고 싶으시면, 아래의 '다시 입력' 버튼을 선택해주세요~\n\n처음으로 가려면“시작“이라고 입력해주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "다시 입력"
                                    },
                                    {
                                        "url": "",
                                        "text": "시작"
                                    }
                                ]
                            }
                        ],
                        "id": "default86",
                        "children": [
                            {
                                "name": "57",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "다시",
                                            "nlp": "다시"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "선택",
                                            "nlp": "선택"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "call",
                                        "dialogName": "2.질문 토픽 중",
                                        "dialog": "2.질문 토픽 중",
                                        "dialogId": "default4"
                                    }
                                ],
                                "id": "default95"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "2.질문 대 다시",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "buttons": [
                            {
                                "url": "",
                                "text": "다시 입력"
                            },
                            {
                                "url": "",
                                "text": "시작"
                            }
                        ],
                        "text": "죄송합니다. 더 정확하게 입력해주세요. 다시 입력하고 싶으시면, 아래의 '다시 입력' 버튼을 선택해주세요~\n\n처음으로 가려면“시작“이라고 입력해주세요."
                    }
                ],
                "id": "default85",
                "children": [
                    {
                        "name": "58",
                        "input": [
                            {
                                "text": {
                                    "raw": "다시",
                                    "nlp": "다시"
                                }
                            },
                            {
                                "text": {
                                    "raw": "선택",
                                    "nlp": "선택"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "type": "call",
                                "dialogName": "2.자주하는 질문 대",
                                "dialog": "2.자주하는 질문 대",
                                "dialogId": "default3"
                            }
                        ],
                        "id": "default96"
                    }
                ]
            }
        ]
    },
    {
        "name": "3.신규회원",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "플라워마니아 홈페이지에서 회원가입을 하시면, 할인된 회원가로 상품을 구매하실 수 있습니다."
            }
        ],
        "task": {
            "name": "newuser"
        },
        "id": "default12",
        "children": [
            {
                "name": "3.비회원으로 구매하기",
                "input": [
                    {
                        "text": {
                            "raw": "3",
                            "nlp": "3"
                        }
                    },
                    {
                        "text": {
                            "raw": "비회 구매 하다",
                            "nlp": "비회 구매 하다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "주문하시는 고객님의 성함을 입력해주세요.\n(ex: 아리랑)"
                    }
                ],
                "id": "default13",
                "children": [
                    {
                        "name": "3.고객 성함",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "주문하시는 고객님의 이메일을 입력해주세요.\n\n입력하시는 이메일로 주문서를 발송해드립니다.\n(ex: 123456@naver.com)"
                            }
                        ],
                        "task": {
                            "name": "savename"
                        },
                        "id": "default15",
                        "children": [
                            {
                                "name": "3.고객 이메일",
                                "input": [
                                    {
                                        "types": "email"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "",
                                        "if": "context.user.mobile!==undefined && context.session.findorder===1",
                                        "type": "call",
                                        "dialogName": "6.주문 확인 기존회원",
                                        "dialog": "6.주문 확인 기존회원"
                                    },
                                    {
                                        "kind": "Content",
                                        "text": "주문하시는 고객님의 휴대폰 연락처를 입력해주세요.\n(ex: 01012345678)",
                                        "if": "context.user.mobile==undefined"
                                    },
                                    {
                                        "kind": "Action",
                                        "text": "",
                                        "if": "context.user.mobile!==undefined && context.session.findorder!==1",
                                        "type": "call",
                                        "dialogName": "3.기존회원",
                                        "dialog": "3.기존회원",
                                        "dialogId": "default21"
                                    }
                                ],
                                "id": "default16",
                                "children": [
                                    {
                                        "name": "3.휴대폰 번호 인증절차",
                                        "input": [
                                            {
                                                "types": "mobile"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "options": {
                                                    "output": "받으신 인증번호를 입력해주세요."
                                                },
                                                "type": "call",
                                                "dialogName": "3.인증번호를 확인",
                                                "dialog": "3.인증번호를 확인",
                                                "dialogId": "default19"
                                            }
                                        ],
                                        "task": {
                                            "name": "savemobile"
                                        },
                                        "id": "default17"
                                    },
                                    {
                                        "name": "3.고객 휴대폰 번호 틀린 경우",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "다시 입력"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "시작"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default91",
                                        "children": [
                                            {
                                                "name": "3.고객 휴대폰 번호를 틀린 경우 다시 입력",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "다시",
                                                            "nlp": "다시"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "입력",
                                                            "nlp": "입력"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Action",
                                                        "type": "call",
                                                        "dialogName": "3.고객 이메일",
                                                        "dialog": "3.고객 이메일",
                                                        "dialogId": "default16"
                                                    }
                                                ],
                                                "id": "default92"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "3.고객 이메일 틀린 경우",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "죄송합니다. 더 정확하게 입력해주세요. 다시 입력하고 싶으시면, 아래의 '다시 입력' 버튼을 선택해주세요~\n\n처음으로 가려면“시작“이라고 입력해주세요.",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "다시 입력"
                                            },
                                            {
                                                "url": "",
                                                "text": "시작"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default89",
                                "children": [
                                    {
                                        "name": "3.고객 이메일 틀린 경우 다시 입력",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "다시",
                                                    "nlp": "다시"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "입력",
                                                    "nlp": "입력"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "type": "call",
                                                "dialogName": "3.고객 성함",
                                                "dialog": "3.고객 성함",
                                                "dialogId": "default15"
                                            }
                                        ],
                                        "id": "default90"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "3.인증번호를 확인",
                "input": [
                    {
                        "if": "false"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "받으신 인증번호를 입력해주세요."
                    }
                ],
                "id": "default19",
                "children": [
                    {
                        "name": "3.인증번호를 입력하고 확인",
                        "input": [
                            {
                                "types": "identification"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "if": "context.session.olduser==false",
                                "type": "call",
                                "dialogName": "3.비회원으로 구매하기",
                                "dialog": "3.비회원으로 구매하기",
                                "dialogId": "default13"
                            },
                            {
                                "kind": "Action",
                                "if": "context.session.findorder===1 && context.session.olduser==true",
                                "type": "call",
                                "dialogName": "6.주문 확인 기존회원",
                                "dialog": "6.주문 확인 기존회원",
                                "dialogId": "default76"
                            },
                            {
                                "kind": "Action",
                                "if": "context.session.findorder!==1 && context.session.olduser==true",
                                "options": {
                                    "output": "수취인/배송정보 접수를 진행하겠습니다.\n\n결혼식을 위한 배송인가요?"
                                },
                                "type": "call",
                                "dialogName": "3.기존회원",
                                "dialog": "3.기존회원",
                                "dialogId": "default21"
                            }
                        ],
                        "id": "default20"
                    },
                    {
                        "name": "3.인증번호 틀린 경우 다시 입력",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "options": {
                                    "output": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력해주세요.\n\n인정번호를 안 받았으면 \"재발송\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
                                },
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "다시 입력"
                                    },
                                    {
                                        "url": "",
                                        "text": "재발송"
                                    },
                                    {
                                        "url": "",
                                        "text": "시작"
                                    }
                                ],
                                "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하고 싶으면 \"다시 입력\"을 입력해주세요.\n\n인정번호를 안 받았으면 \"재발송\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
                            }
                        ],
                        "id": "default84",
                        "children": [
                            {
                                "name": "60",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "재",
                                            "nlp": "재"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "발송",
                                            "nlp": "발송"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "call",
                                        "dialogName": "3.인증번호를 확인",
                                        "dialog": "3.인증번호를 확인",
                                        "dialogId": "default19"
                                    }
                                ],
                                "id": "default98",
                                "task": {
                                    "name": "sendidentification"
                                }
                            },
                            {
                                "name": "61",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "다시",
                                            "nlp": "다시"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "입력",
                                            "nlp": "입력"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "call",
                                        "dialogName": "3.인증번호를 확인",
                                        "dialog": "3.인증번호를 확인",
                                        "dialogId": "default19"
                                    }
                                ],
                                "id": "default99"
                            }
                        ],
                        "task": {
                            "name": ""
                        }
                    }
                ],
                "task": {
                    "name": ""
                }
            }
        ]
    },
    {
        "name": "3.기존회원",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "수취인/배송정보 접수를 진행하겠습니다.\n\n결혼식을 위한 배송인가요?",
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
        "id": "default21",
        "children": [
            {
                "name": "3.신랑/신부",
                "input": [
                    {
                        "intent": "네"
                    },
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
                        "text": "신랑측인가요, 신부측인가요?",
                        "buttons": [
                            {
                                "url": "",
                                "text": "신랑"
                            },
                            {
                                "url": "",
                                "text": "신부"
                            }
                        ]
                    }
                ],
                "id": "default22",
                "children": [
                    {
                        "name": "3.예식시간",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "예식시간을 입력해주세요.\n(ex: 20180625 오후 4시)"
                            }
                        ],
                        "task": {
                            "name": "bridegroomorbride"
                        },
                        "id": "default23",
                        "children": [
                            {
                                "name": "3.예식시간 입력",
                                "input": [
                                    {
                                        "types": "dateAndtime"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "수취인 성함을 입력해주세요.\n(ex: 아리랑)"
                                        },
                                        "type": "call",
                                        "dialogName": "3.수취인 성함",
                                        "dialog": "3.수취인 성함",
                                        "dialogId": "default24"
                                    }
                                ],
                                "task": {
                                    "name": ""
                                },
                                "id": "default25"
                            },
                            {
                                "name": "105",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "다시 입력"
                                            },
                                            {
                                                "url": "",
                                                "text": "시작"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default143",
                                "children": [
                                    {
                                        "name": "106",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "다시",
                                                    "nlp": "다시"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "입력",
                                                    "nlp": "입력"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "type": "call",
                                                "dialogName": "3.예식시간",
                                                "dialog": "3.예식시간",
                                                "dialogId": "default23"
                                            }
                                        ],
                                        "id": "default144"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "3.수취인 성함",
                "input": [
                    {
                        "intent": "아니요"
                    },
                    {
                        "text": {
                            "raw": "아니요",
                            "nlp": "아니"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "수취인 성함을 입력해주세요.\n(ex: 아리랑)"
                    }
                ],
                "id": "default24",
                "children": [
                    {
                        "name": "3.수취인 연락처",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "수취인 연락처를 입력해주세요.\n(ex: 01012345678)"
                            }
                        ],
                        "task": {
                            "name": "savefriendname"
                        },
                        "id": "default26",
                        "children": [
                            {
                                "name": "3.주소",
                                "input": [
                                    {
                                        "types": "mobile"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "배송받을 주소를 입력해주세요.\n\n시/도와 상세주소를 입력해주세요."
                                    }
                                ],
                                "task": {
                                    "name": "savefriendmobile"
                                },
                                "id": "default27",
                                "children": [
                                    {
                                        "name": "3.배송일시",
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
                                                "text": "배송을 원하시는 날짜와 시간을 입력해주세요.\n(ex: 20180316 오후 3시)"
                                            }
                                        ],
                                        "task": {
                                            "name": "savefriendaddress"
                                        },
                                        "id": "default28",
                                        "children": [
                                            {
                                                "name": "3.배송방법",
                                                "input": [
                                                    {
                                                        "types": "dateAndtime1"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "원하시는 배송방법을 선택해주세요.\n\n ◆ ◆ ◆ 생화일반배송 안내 ◆ ◆ ◆\n\n- 생화일반배송은 서울권은 본사 매장에서 제작배송하며, 지방권은 각 지방 가맹점에서 제작배송합니다.\n\n- 당일배송이 가능하며 배송일자 지정, 배송시간 지정이 가능합니다\n\n ◆ ◆ ◆ 생화택배 안내 ◆ ◆ ◆\n\n- 생화택배란 생화전문택배를 뜻하며, 본사매장에서 제작한 상품을 생화택배를 이용하여 \n\n- 전국으로 안전하게 배송해드리는 택배서비스입니다.\n\n- 오후4시 이전까지 주문하시면 당일 택배발송후 익일 수취가 가능하며, 배송일자 지정이 가능합니다.(공휴일제외)\n\n- 택배의 특성상 배송시간 지정이 안되며 오전 9시~오후6시 사이에 임의시간대에 배송됩니다."
                                                    }
                                                ],
                                                "task": {
                                                    "name": "savedeliverytime"
                                                },
                                                "id": "default29",
                                                "children": [
                                                    {
                                                        "name": "3.카드/리본 선택",
                                                        "input": [
                                                            {
                                                                "if": "true"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Content",
                                                                "text": "카드를 원하시나요 리본을 원하시나요?",
                                                                "buttons": [
                                                                    {
                                                                        "url": "",
                                                                        "text": "카드"
                                                                    },
                                                                    {
                                                                        "url": "",
                                                                        "text": "리본"
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        "task": {
                                                            "name": "savedeliveryway"
                                                        },
                                                        "id": "default30",
                                                        "children": [
                                                            {
                                                                "name": "3.문구입력요청",
                                                                "input": [
                                                                    {
                                                                        "text": {
                                                                            "raw": "카드",
                                                                            "nlp": "카드"
                                                                        }
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Content",
                                                                        "text": "원하시는 카드문구를 입력하세요.\n\n경조사어 참고문구를 보고싶으시다면 '참고문구' 라고 입력하세요."
                                                                    }
                                                                ],
                                                                "id": "default31",
                                                                "children": [
                                                                    {
                                                                        "name": "3.참고문구 카테고리",
                                                                        "input": [
                                                                            {
                                                                                "text": {
                                                                                    "raw": "참고 문구",
                                                                                    "nlp": "참고 문구"
                                                                                }
                                                                            }
                                                                        ],
                                                                        "output": [
                                                                            {
                                                                                "kind": "Content",
                                                                                "text": "다음 중 해당하는 경조사를 선택하세요."
                                                                            }
                                                                        ],
                                                                        "id": "default33",
                                                                        "children": [
                                                                            {
                                                                                "name": "3.참고문구 소개",
                                                                                "input": [
                                                                                    {
                                                                                        "types": [
                                                                                            "greetiongcategorylist"
                                                                                        ]
                                                                                    }
                                                                                ],
                                                                                "output": [
                                                                                    {
                                                                                        "kind": "Content",
                                                                                        "text": "다음 중 원하시는 문구를 선택하세요."
                                                                                    }
                                                                                ],
                                                                                "id": "default34",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "3.문구선택여부",
                                                                                        "input": [
                                                                                            {
                                                                                                "types": [
                                                                                                    "greetingitemlist"
                                                                                                ]
                                                                                            }
                                                                                        ],
                                                                                        "output": [
                                                                                            {
                                                                                                "kind": "Content",
                                                                                                "text": "선택하신 문구로 진행할까요?\n",
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
                                                                                        "id": "default36",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "1.기타요청사항",
                                                                                                "input": [
                                                                                                    {
                                                                                                        "intent": "네"
                                                                                                    },
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
                                                                                                        "text": "기타 요청사항을 입력해주세요.\n\n※ 케익이 포함된경우 요청사항에 양초갯수를 적어주세요!",
                                                                                                        "buttons": []
                                                                                                    }
                                                                                                ],
                                                                                                "id": "default37",
                                                                                                "children": [
                                                                                                    {
                                                                                                        "name": "3.남기시는 메세지 변경 가기",
                                                                                                        "input": [
                                                                                                            {
                                                                                                                "text": {
                                                                                                                    "raw": "주문서 확인하기",
                                                                                                                    "nlp": "주문 서 확인 하다"
                                                                                                                },
                                                                                                                "if": "context.session.selectchange===1"
                                                                                                            },
                                                                                                            {
                                                                                                                "text": {
                                                                                                                    "raw": "확인",
                                                                                                                    "nlp": "확인"
                                                                                                                },
                                                                                                                "if": "context.session.selectchange===1"
                                                                                                            },
                                                                                                            {
                                                                                                                "text": {
                                                                                                                    "raw": "주문",
                                                                                                                    "nlp": "주문"
                                                                                                                },
                                                                                                                "if": "context.session.selectchange===1"
                                                                                                            }
                                                                                                        ],
                                                                                                        "output": [
                                                                                                            {
                                                                                                                "kind": "Action",
                                                                                                                "type": "call",
                                                                                                                "dialogName": "3.주문서 확인",
                                                                                                                "dialog": "3.주문서 확인",
                                                                                                                "dialogId": "default44"
                                                                                                            }
                                                                                                        ],
                                                                                                        "id": "default71",
                                                                                                        "task": {
                                                                                                            "name": ""
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "name": "3.계산서 요청여부",
                                                                                                        "input": [
                                                                                                            {
                                                                                                                "if": "true"
                                                                                                            }
                                                                                                        ],
                                                                                                        "output": [
                                                                                                            {
                                                                                                                "kind": "Content",
                                                                                                                "text": "계산서 요청여부를 선택해주세요.\n\n*게산서발행을 원하시는 고객님께서는 주문완료후사업자등록증을 팩스로 보내주셔야합니다. FAX : 02)6974-1544\n\n*계산서는 배송완료 후 익월 10일 전까지 전자계산서로 발송해드립니다.",
                                                                                                                "buttons": [
                                                                                                                    {
                                                                                                                        "url": "",
                                                                                                                        "text": "필요없음"
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "url": "",
                                                                                                                        "text": "계산서 발행"
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "url": "",
                                                                                                                        "text": "현금 영수증 발급"
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ],
                                                                                                        "id": "default39",
                                                                                                        "children": [
                                                                                                            {
                                                                                                                "name": "3.결제방법 선택",
                                                                                                                "input": [
                                                                                                                    {
                                                                                                                        "text": {
                                                                                                                            "raw": "필요없다",
                                                                                                                            "nlp": "필요없다"
                                                                                                                        }
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "text": {
                                                                                                                            "raw": "필요없음",
                                                                                                                            "nlp": "필요없다"
                                                                                                                        }
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "text": {
                                                                                                                            "raw": "계산서 발행",
                                                                                                                            "nlp": "계산서 발행"
                                                                                                                        }
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "text": {
                                                                                                                            "raw": "현금 영수증 발급",
                                                                                                                            "nlp": "현금 영수증 발급"
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
                                                                                                                        "text": "고객님의 주문내역을 보시려면 \"주문내역\"을 입력해주세요.",
                                                                                                                        "buttons": [
                                                                                                                            {
                                                                                                                                "url": "",
                                                                                                                                "text": "주문내역"
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "type": "call",
                                                                                                                        "dialogName": "3.카드 결제하기",
                                                                                                                        "dialog": "3.카드 결제하기",
                                                                                                                        "dialogId": "default41"
                                                                                                                    }
                                                                                                                ],
                                                                                                                "id": "default40",
                                                                                                                "children": [
                                                                                                                    {
                                                                                                                        "name": "3.카드 결제하기",
                                                                                                                        "input": [
                                                                                                                            {
                                                                                                                                "text": {
                                                                                                                                    "raw": "카드 결제 하다",
                                                                                                                                    "nlp": "카드 결제 하다"
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
                                                                                                                                    "raw": "카드 결제하기",
                                                                                                                                    "nlp": "카드 결제 하다"
                                                                                                                                }
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "intent": "네"
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "output": [
                                                                                                                            {
                                                                                                                                "kind": "Content",
                                                                                                                                "text": "고객님의 주문내역을 보시려면 \"주문내역\"을 입력해주세요.",
                                                                                                                                "buttons": [
                                                                                                                                    {
                                                                                                                                        "url": "",
                                                                                                                                        "text": "주문내역"
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "id": "default41",
                                                                                                                        "children": [
                                                                                                                            {
                                                                                                                                "name": "3.주문서 확인",
                                                                                                                                "input": [
                                                                                                                                    {
                                                                                                                                        "text": {
                                                                                                                                            "raw": "주문내역",
                                                                                                                                            "nlp": "주문 내 역"
                                                                                                                                        }
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "text": {
                                                                                                                                            "raw": "주문 내역",
                                                                                                                                            "nlp": "주문 내 역"
                                                                                                                                        }
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "text": {
                                                                                                                                            "raw": "주문",
                                                                                                                                            "nlp": "주문"
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "output": [
                                                                                                                                    {
                                                                                                                                        "kind": "Content",
                                                                                                                                        "text": "고객님의 주문내역입니다.\n이대로 주문신청을 할까요?\n\n【주문내역】\n-주문일시:\n+context.session.orderinfor.time+\n-고객성함: +context.session.orderinfor.name+\n-보내시는분 성함: +context.session.orderinfor.sendername+\n-고객 휴대폰 번호: +context.session.orderinfor.mobile+\n-받는분 성함: +context.session.orderinfor.receivername+\n-받는분 연락처: +context.session.orderinfor.receivermobile+\n-배달주소: +context.session.orderinfor.receiveraddress+\n-배달일자: +context.session.orderinfor.deliverytime+\n-남기시는 메세지: +context.session.orderinfor.greeting+\n-상품명: +context.session.orderinfor.itemname+\n-상품금액: +context.session.orderinfor.itemprice+원\n-수량: +context.session.orderinfor.itemnumber+\n\n총 +context.session.orderinfor.allprice+ 원\n\n[상품 이미지]"
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "id": "default44",
                                                                                                                                "children": [
                                                                                                                                    {
                                                                                                                                        "name": "3.변경사항 선택",
                                                                                                                                        "input": [
                                                                                                                                            {
                                                                                                                                                "text": {
                                                                                                                                                    "raw": "변경하기",
                                                                                                                                                    "nlp": "변경 하다"
                                                                                                                                                }
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "text": {
                                                                                                                                                    "raw": "변경",
                                                                                                                                                    "nlp": "변경"
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "output": [
                                                                                                                                            {
                                                                                                                                                "kind": "Content",
                                                                                                                                                "text": "다음중 변경하고 싶으신 부분을 선택해주세요.\n\n【주문내역】\n-주문일시:\n+context.session.orderinfor.time+\n-고객성함: +context.session.orderinfor.name+\n-보내시는분 성함: +context.session.orderinfor.sendername+\n-고객 휴대폰 번호: +context.session.orderinfor.mobile+\n-받는분 성함: +context.session.orderinfor.receivername+\n-받는분 연락처: +context.session.orderinfor.receivermobile+\n-배달주소: +context.session.orderinfor.receiveraddress+\n-배달일자: +context.session.orderinfor.deliverytime+\n-남기시는 메세지: +context.session.orderinfor.greeting+\n-상품명: +context.session.orderinfor.itemname+\n-상품금액: +context.session.orderinfor.itemprice+원\n-수량: +context.session.orderinfor.itemnumber+\n\n총 +context.session.orderinfor.allprice+ 원"
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "id": "default46",
                                                                                                                                        "task": {
                                                                                                                                            "name": "selectchange"
                                                                                                                                        },
                                                                                                                                        "children": [
                                                                                                                                            {
                                                                                                                                                "name": "3.상품 변경",
                                                                                                                                                "input": [
                                                                                                                                                    {
                                                                                                                                                        "text": {
                                                                                                                                                            "raw": "상품",
                                                                                                                                                            "nlp": "상품"
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "output": [
                                                                                                                                                    {
                                                                                                                                                        "kind": "Action",
                                                                                                                                                        "type": "call",
                                                                                                                                                        "dialogName": "1.카테고리 대",
                                                                                                                                                        "dialog": "1.카테고리 대",
                                                                                                                                                        "dialogId": "default0"
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "id": "default61"
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "name": "3.받는 분 성함 변경",
                                                                                                                                                "input": [
                                                                                                                                                    {
                                                                                                                                                        "text": {
                                                                                                                                                            "raw": "성함",
                                                                                                                                                            "nlp": "성함"
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "output": [
                                                                                                                                                    {
                                                                                                                                                        "kind": "Content",
                                                                                                                                                        "text": "변경하시고 싶은 받는 분 성함을 알려주세요.\n(ex: 아리랑)"
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "id": "default62",
                                                                                                                                                "children": [
                                                                                                                                                    {
                                                                                                                                                        "name": "3.받는 분 성함 변경 저장",
                                                                                                                                                        "input": [
                                                                                                                                                            {
                                                                                                                                                                "if": "true"
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "output": [
                                                                                                                                                            {
                                                                                                                                                                "kind": "Action",
                                                                                                                                                                "type": "call",
                                                                                                                                                                "dialogName": "3.주문서 확인",
                                                                                                                                                                "dialog": "3.주문서 확인",
                                                                                                                                                                "dialogId": "default44"
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "task": {
                                                                                                                                                            "name": "savefriendname"
                                                                                                                                                        },
                                                                                                                                                        "id": "default63"
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "name": "3.받는 분 연락처 변경",
                                                                                                                                                "input": [
                                                                                                                                                    {
                                                                                                                                                        "text": {
                                                                                                                                                            "raw": "연락처",
                                                                                                                                                            "nlp": "연락처"
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "output": [
                                                                                                                                                    {
                                                                                                                                                        "kind": "Content",
                                                                                                                                                        "text": "변경하시고 싶은 받는 분 연락처를 알려주세요.\n(ex: 01012345678)",
                                                                                                                                                        "buttons": []
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "id": "default64",
                                                                                                                                                "children": [
                                                                                                                                                    {
                                                                                                                                                        "name": "3.받는 분 연락처 변경 저장",
                                                                                                                                                        "input": [
                                                                                                                                                            {
                                                                                                                                                                "types": "mobile"
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "output": [
                                                                                                                                                            {
                                                                                                                                                                "kind": "Action",
                                                                                                                                                                "type": "call",
                                                                                                                                                                "dialogName": "3.주문서 확인",
                                                                                                                                                                "dialog": "3.주문서 확인",
                                                                                                                                                                "dialogId": "default44"
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "task": {
                                                                                                                                                            "name": "savefriendmobile"
                                                                                                                                                        },
                                                                                                                                                        "id": "default65"
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        "name": "87",
                                                                                                                                                        "input": [
                                                                                                                                                            {
                                                                                                                                                                "if": "true"
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "output": [
                                                                                                                                                            {
                                                                                                                                                                "kind": "Content",
                                                                                                                                                                "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                                                                                                                                                "buttons": [
                                                                                                                                                                    {
                                                                                                                                                                        "url": "",
                                                                                                                                                                        "text": "다시 입력"
                                                                                                                                                                    },
                                                                                                                                                                    {
                                                                                                                                                                        "url": "",
                                                                                                                                                                        "text": "시작"
                                                                                                                                                                    }
                                                                                                                                                                ]
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "id": "default125",
                                                                                                                                                        "children": [
                                                                                                                                                            {
                                                                                                                                                                "name": "88",
                                                                                                                                                                "input": [
                                                                                                                                                                    {
                                                                                                                                                                        "text": {
                                                                                                                                                                            "raw": "다시",
                                                                                                                                                                            "nlp": "다시"
                                                                                                                                                                        }
                                                                                                                                                                    },
                                                                                                                                                                    {
                                                                                                                                                                        "text": {
                                                                                                                                                                            "raw": "입력",
                                                                                                                                                                            "nlp": "입력"
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                ],
                                                                                                                                                                "output": [
                                                                                                                                                                    {
                                                                                                                                                                        "kind": "Action",
                                                                                                                                                                        "type": "call",
                                                                                                                                                                        "dialogName": "3.받는 분 연락처 변경",
                                                                                                                                                                        "dialog": "3.받는 분 연락처 변경",
                                                                                                                                                                        "dialogId": "default64"
                                                                                                                                                                    }
                                                                                                                                                                ],
                                                                                                                                                                "id": "default126"
                                                                                                                                                            }
                                                                                                                                                        ]
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "name": "3.배달주소 변경",
                                                                                                                                                "input": [
                                                                                                                                                    {
                                                                                                                                                        "text": {
                                                                                                                                                            "raw": "주소",
                                                                                                                                                            "nlp": "주소"
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "output": [
                                                                                                                                                    {
                                                                                                                                                        "kind": "Content",
                                                                                                                                                        "text": "변경하시고 싶은 배달주소를 알려주세요.",
                                                                                                                                                        "buttons": []
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "id": "default66",
                                                                                                                                                "children": [
                                                                                                                                                    {
                                                                                                                                                        "name": "3.배달주소 변경 저장",
                                                                                                                                                        "input": [
                                                                                                                                                            {
                                                                                                                                                                "if": "true"
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "output": [
                                                                                                                                                            {
                                                                                                                                                                "kind": "Action",
                                                                                                                                                                "type": "call",
                                                                                                                                                                "dialogName": "3.주문서 확인",
                                                                                                                                                                "dialog": "3.주문서 확인",
                                                                                                                                                                "dialogId": "default44"
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "id": "default67",
                                                                                                                                                        "task": {
                                                                                                                                                            "name": "savefriendaddress"
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "name": "3.배달일자 변경",
                                                                                                                                                "input": [
                                                                                                                                                    {
                                                                                                                                                        "text": {
                                                                                                                                                            "raw": "일자",
                                                                                                                                                            "nlp": "일자"
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "output": [
                                                                                                                                                    {
                                                                                                                                                        "kind": "Content",
                                                                                                                                                        "text": "변경하시고 싶은 배달일자를 알려주세요.\n(ex: 20180625 오후 3시)",
                                                                                                                                                        "buttons": []
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "id": "default68",
                                                                                                                                                "children": [
                                                                                                                                                    {
                                                                                                                                                        "name": "3.배달일자 변경 저장",
                                                                                                                                                        "input": [
                                                                                                                                                            {
                                                                                                                                                                "types": [
                                                                                                                                                                    "dateAndtime1"
                                                                                                                                                                ]
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "output": [
                                                                                                                                                            {
                                                                                                                                                                "kind": "Action",
                                                                                                                                                                "type": "call",
                                                                                                                                                                "dialogName": "3.주문서 확인",
                                                                                                                                                                "dialog": "3.주문서 확인",
                                                                                                                                                                "dialogId": "default44"
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "id": "default69",
                                                                                                                                                        "task": {
                                                                                                                                                            "name": "savedeliverytime"
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "name": "3.남기시는 메세지 변경",
                                                                                                                                                "input": [
                                                                                                                                                    {
                                                                                                                                                        "text": {
                                                                                                                                                            "raw": "메세지",
                                                                                                                                                            "nlp": "메세지"
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "output": [
                                                                                                                                                    {
                                                                                                                                                        "kind": "Action",
                                                                                                                                                        "type": "call",
                                                                                                                                                        "dialogName": "1.기타요청사항",
                                                                                                                                                        "dialog": "1.기타요청사항",
                                                                                                                                                        "dialogId": "default37"
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "id": "default70"
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "name": "83",
                                                                                                                                                "input": [
                                                                                                                                                    {
                                                                                                                                                        "if": "true"
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "output": [
                                                                                                                                                    {
                                                                                                                                                        "kind": "Content",
                                                                                                                                                        "text": "죄송합니다. 더 정확하게 입력해주세요. 다시 입력하고 싶으시면, 아래의 '다시 입력' 버튼을 선택해주세요~\n\n처음으로 가려면“시작“이라고 입력해주세요.",
                                                                                                                                                        "buttons": [
                                                                                                                                                            {
                                                                                                                                                                "url": "",
                                                                                                                                                                "text": "다시 입력"
                                                                                                                                                            },
                                                                                                                                                            {
                                                                                                                                                                "url": "",
                                                                                                                                                                "text": "시작"
                                                                                                                                                            }
                                                                                                                                                        ]
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "id": "default121",
                                                                                                                                                "children": [
                                                                                                                                                    {
                                                                                                                                                        "name": "84",
                                                                                                                                                        "input": [
                                                                                                                                                            {
                                                                                                                                                                "text": {
                                                                                                                                                                    "raw": "다시",
                                                                                                                                                                    "nlp": "다시"
                                                                                                                                                                }
                                                                                                                                                            },
                                                                                                                                                            {
                                                                                                                                                                "text": {
                                                                                                                                                                    "raw": "선택",
                                                                                                                                                                    "nlp": "선택"
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "output": [
                                                                                                                                                            {
                                                                                                                                                                "kind": "Action",
                                                                                                                                                                "type": "call",
                                                                                                                                                                "dialogName": "3.변경사항 선택",
                                                                                                                                                                "dialog": "3.변경사항 선택",
                                                                                                                                                                "dialogId": "default46"
                                                                                                                                                            }
                                                                                                                                                        ],
                                                                                                                                                        "id": "default122"
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            }
                                                                                                                                        ]
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "name": "3.주문신청완료",
                                                                                                                                        "input": [
                                                                                                                                            {
                                                                                                                                                "text": {
                                                                                                                                                    "raw": "이대로 주문하기",
                                                                                                                                                    "nlp": "이대로 주문 하다"
                                                                                                                                                }
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "text": {
                                                                                                                                                    "raw": "주문",
                                                                                                                                                    "nlp": "주문"
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "output": [
                                                                                                                                            {
                                                                                                                                                "kind": "Content",
                                                                                                                                                "text": "플라워매니아에 주문신청되었습니다.\n\n신청하신 주문내용의 최종승인은 담당자가 직접 연락드린 후 진행됩니다.\n\n고객님의 주문내역은 처음화면에 가서 '내 주문 확인하기'를 입력하시면 확인하실 수 있습니다.\n\n처음으로 가려면 \"시작\"이라고 입력해주세요."
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "id": "default45",
                                                                                                                                        "task": {
                                                                                                                                            "name": "addorder"
                                                                                                                                        }
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "name": "81",
                                                                                                                                        "input": [
                                                                                                                                            {
                                                                                                                                                "if": "true"
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "output": [
                                                                                                                                            {
                                                                                                                                                "kind": "Content",
                                                                                                                                                "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                                                                                                                                "buttons": [
                                                                                                                                                    {
                                                                                                                                                        "url": "",
                                                                                                                                                        "text": "다시 입력"
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        "url": "",
                                                                                                                                                        "text": "시작"
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "id": "default119",
                                                                                                                                        "children": [
                                                                                                                                            {
                                                                                                                                                "name": "82",
                                                                                                                                                "input": [
                                                                                                                                                    {
                                                                                                                                                        "text": {
                                                                                                                                                            "raw": "다시",
                                                                                                                                                            "nlp": "다시"
                                                                                                                                                        }
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        "text": {
                                                                                                                                                            "raw": "입력",
                                                                                                                                                            "nlp": "입력"
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "output": [
                                                                                                                                                    {
                                                                                                                                                        "kind": "Action",
                                                                                                                                                        "type": "call",
                                                                                                                                                        "dialogName": "3.주문서 확인",
                                                                                                                                                        "dialog": "3.주문서 확인",
                                                                                                                                                        "dialogId": "default44"
                                                                                                                                                    }
                                                                                                                                                ],
                                                                                                                                                "id": "default120"
                                                                                                                                            }
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "task": {
                                                                                                                                    "name": "collectorderinfor"
                                                                                                                                }
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "name": "79",
                                                                                                                                "input": [
                                                                                                                                    {
                                                                                                                                        "if": "true"
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "output": [
                                                                                                                                    {
                                                                                                                                        "kind": "Content",
                                                                                                                                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                                                                                                                        "buttons": [
                                                                                                                                            {
                                                                                                                                                "url": "",
                                                                                                                                                "text": "다시 입력"
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "url": "",
                                                                                                                                                "text": "시작"
                                                                                                                                            }
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "id": "default117",
                                                                                                                                "children": [
                                                                                                                                    {
                                                                                                                                        "name": "80",
                                                                                                                                        "input": [
                                                                                                                                            {
                                                                                                                                                "text": {
                                                                                                                                                    "raw": "다시",
                                                                                                                                                    "nlp": "다시"
                                                                                                                                                }
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "text": {
                                                                                                                                                    "raw": "입력",
                                                                                                                                                    "nlp": "입력"
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "output": [
                                                                                                                                            {
                                                                                                                                                "kind": "Action",
                                                                                                                                                "type": "call",
                                                                                                                                                "dialogName": "3.카드 결제하기",
                                                                                                                                                "dialog": "3.카드 결제하기",
                                                                                                                                                "dialogId": "default41"
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "id": "default118"
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "task": {
                                                                                                                            "name": "savepayway"
                                                                                                                        }
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "name": "3.무통장 입금하기",
                                                                                                                        "input": [
                                                                                                                            {
                                                                                                                                "text": {
                                                                                                                                    "raw": "무 통장 입금 하다",
                                                                                                                                    "nlp": "무 통장 입금 하다"
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
                                                                                                                                    "raw": "무통장 입금하기",
                                                                                                                                    "nlp": "무통장 입금하기"
                                                                                                                                }
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "output": [
                                                                                                                            {
                                                                                                                                "kind": "Content",
                                                                                                                                "text": "국민은행 284-801-04-095386 (예금주 최유나)\n\n※ 무통장입금시 고객님 명의로 입금하시면 확인전화 없어도 입금확인됩니다\n\n고객님의 주문내역을 보시려면 \"주문내역\"을 입력해주세요.",
                                                                                                                                "buttons": [
                                                                                                                                    {
                                                                                                                                        "url": "",
                                                                                                                                        "text": "주문내역"
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "id": "default42",
                                                                                                                        "children": [
                                                                                                                            {
                                                                                                                                "name": "3.무통장 입금하기2",
                                                                                                                                "input": [
                                                                                                                                    {
                                                                                                                                        "text": {
                                                                                                                                            "raw": "주문내역",
                                                                                                                                            "nlp": "주문 내 역"
                                                                                                                                        }
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "text": {
                                                                                                                                            "raw": "주문",
                                                                                                                                            "nlp": "주문"
                                                                                                                                        }
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "text": {
                                                                                                                                            "raw": "내역",
                                                                                                                                            "nlp": "내 역"
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "output": [
                                                                                                                                    {
                                                                                                                                        "kind": "Action",
                                                                                                                                        "type": "call",
                                                                                                                                        "dialogName": "3.주문서 확인",
                                                                                                                                        "dialog": "3.주문서 확인",
                                                                                                                                        "dialogId": "default44"
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "id": "default47"
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "name": "89",
                                                                                                                                "input": [
                                                                                                                                    {
                                                                                                                                        "if": "true"
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "output": [
                                                                                                                                    {
                                                                                                                                        "kind": "Content",
                                                                                                                                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                                                                                                                        "buttons": [
                                                                                                                                            {
                                                                                                                                                "url": "",
                                                                                                                                                "text": "다시 입력"
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "url": "",
                                                                                                                                                "text": "시작"
                                                                                                                                            }
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "id": "default127",
                                                                                                                                "children": [
                                                                                                                                    {
                                                                                                                                        "name": "90",
                                                                                                                                        "input": [
                                                                                                                                            {
                                                                                                                                                "text": {
                                                                                                                                                    "raw": "다시",
                                                                                                                                                    "nlp": "다시"
                                                                                                                                                }
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "text": {
                                                                                                                                                    "raw": "입력",
                                                                                                                                                    "nlp": "입력"
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "output": [
                                                                                                                                            {
                                                                                                                                                "kind": "Action",
                                                                                                                                                "type": "call",
                                                                                                                                                "dialogName": "3.무통장 입금하기",
                                                                                                                                                "dialog": "3.무통장 입금하기",
                                                                                                                                                "dialogId": "default47"
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "id": "default128"
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "task": {
                                                                                                                            "name": "savepayway"
                                                                                                                        }
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "name": "3.카카오페이",
                                                                                                                        "input": [
                                                                                                                            {
                                                                                                                                "text": {
                                                                                                                                    "raw": "카카오 페이",
                                                                                                                                    "nlp": "카카오 페이"
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
                                                                                                                                "text": "카카오페이 ID: vip4hoon 으로 송금해주시면 됩니다.\n\n고객님의 주문내역을 보시려면 \"주문내역\"을 입력해주세요.",
                                                                                                                                "buttons": [
                                                                                                                                    {
                                                                                                                                        "url": "",
                                                                                                                                        "text": "주문내역"
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "id": "default43",
                                                                                                                        "children": [
                                                                                                                            {
                                                                                                                                "name": "3.카카오 페이2",
                                                                                                                                "input": [
                                                                                                                                    {
                                                                                                                                        "text": {
                                                                                                                                            "raw": "주문내역",
                                                                                                                                            "nlp": "주문 내 역"
                                                                                                                                        }
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "text": {
                                                                                                                                            "raw": "주문",
                                                                                                                                            "nlp": "주문"
                                                                                                                                        }
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "text": {
                                                                                                                                            "raw": "내역",
                                                                                                                                            "nlp": "내 역"
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "output": [
                                                                                                                                    {
                                                                                                                                        "kind": "Action",
                                                                                                                                        "type": "call",
                                                                                                                                        "dialogName": "3.주문서 확인",
                                                                                                                                        "dialog": "3.주문서 확인",
                                                                                                                                        "dialogId": "default44"
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "id": "default48"
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "name": "91",
                                                                                                                                "input": [
                                                                                                                                    {
                                                                                                                                        "if": "true"
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "output": [
                                                                                                                                    {
                                                                                                                                        "kind": "Content",
                                                                                                                                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                                                                                                                        "buttons": [
                                                                                                                                            {
                                                                                                                                                "url": "",
                                                                                                                                                "text": "다시 입력"
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "url": "",
                                                                                                                                                "text": "시작"
                                                                                                                                            }
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "id": "default129",
                                                                                                                                "children": [
                                                                                                                                    {
                                                                                                                                        "name": "92",
                                                                                                                                        "input": [
                                                                                                                                            {
                                                                                                                                                "text": {
                                                                                                                                                    "raw": "다시",
                                                                                                                                                    "nlp": "다시"
                                                                                                                                                }
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "text": {
                                                                                                                                                    "raw": "입력",
                                                                                                                                                    "nlp": "입력"
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "output": [
                                                                                                                                            {
                                                                                                                                                "kind": "Action",
                                                                                                                                                "type": "call",
                                                                                                                                                "dialogName": "3.카카오페이",
                                                                                                                                                "dialog": "3.카카오페이",
                                                                                                                                                "dialogId": "default43"
                                                                                                                                            }
                                                                                                                                        ],
                                                                                                                                        "id": "default130"
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "task": {
                                                                                                                            "name": "savepayway"
                                                                                                                        }
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "name": "77",
                                                                                                                        "input": [
                                                                                                                            {
                                                                                                                                "if": "true"
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "output": [
                                                                                                                            {
                                                                                                                                "kind": "Content",
                                                                                                                                "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                                                                                                                "buttons": [
                                                                                                                                    {
                                                                                                                                        "url": "",
                                                                                                                                        "text": "다시 입력"
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "url": "",
                                                                                                                                        "text": "시작"
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "id": "default115",
                                                                                                                        "children": [
                                                                                                                            {
                                                                                                                                "name": "78",
                                                                                                                                "input": [
                                                                                                                                    {
                                                                                                                                        "text": {
                                                                                                                                            "raw": "다시",
                                                                                                                                            "nlp": "다시"
                                                                                                                                        }
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "text": {
                                                                                                                                            "raw": "입력",
                                                                                                                                            "nlp": "입력"
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "output": [
                                                                                                                                    {
                                                                                                                                        "kind": "Action",
                                                                                                                                        "type": "call",
                                                                                                                                        "dialogName": "3.결제방법 선택",
                                                                                                                                        "dialog": "3.결제방법 선택",
                                                                                                                                        "dialogId": "default40"
                                                                                                                                    }
                                                                                                                                ],
                                                                                                                                "id": "default116"
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    }
                                                                                                                ],
                                                                                                                "task": {
                                                                                                                    "name": "savebill"
                                                                                                                }
                                                                                                            },
                                                                                                            {
                                                                                                                "name": "75",
                                                                                                                "input": [
                                                                                                                    {
                                                                                                                        "if": "true"
                                                                                                                    }
                                                                                                                ],
                                                                                                                "output": [
                                                                                                                    {
                                                                                                                        "kind": "Content",
                                                                                                                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                                                                                                        "buttons": [
                                                                                                                            {
                                                                                                                                "url": "",
                                                                                                                                "text": "다시 입력"
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "url": "",
                                                                                                                                "text": "시작"
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    }
                                                                                                                ],
                                                                                                                "id": "default113",
                                                                                                                "children": [
                                                                                                                    {
                                                                                                                        "name": "76",
                                                                                                                        "input": [
                                                                                                                            {
                                                                                                                                "text": {
                                                                                                                                    "raw": "다시",
                                                                                                                                    "nlp": "다시"
                                                                                                                                }
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "text": {
                                                                                                                                    "raw": "입력",
                                                                                                                                    "nlp": "입력"
                                                                                                                                }
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "output": [
                                                                                                                            {
                                                                                                                                "kind": "Action",
                                                                                                                                "type": "call",
                                                                                                                                "dialogName": "3.계산서 요청여부",
                                                                                                                                "dialog": "3.계산서 요청여부",
                                                                                                                                "dialogId": "default39"
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "id": "default114"
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ],
                                                                                                        "task": {
                                                                                                            "name": "saveotherrequire"
                                                                                                        }
                                                                                                    }
                                                                                                ],
                                                                                                "task": {
                                                                                                    "name": "savegreeting"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "name": "2.카드일 때 \"아니요\"",
                                                                                                "input": [
                                                                                                    {
                                                                                                        "intent": "아니요"
                                                                                                    }
                                                                                                ],
                                                                                                "output": [
                                                                                                    {
                                                                                                        "kind": "Action",
                                                                                                        "if": "context.session.decorate==\"리본\"",
                                                                                                        "type": "call",
                                                                                                        "dialogName": "3.리본좌측 입력요청",
                                                                                                        "dialog": "3.리본좌측 입력요청",
                                                                                                        "dialogId": "default32"
                                                                                                    },
                                                                                                    {
                                                                                                        "kind": "Action",
                                                                                                        "if": "context.session.decorate==\"카드\"",
                                                                                                        "type": "call",
                                                                                                        "dialogName": "3.문구입력요청",
                                                                                                        "dialog": "3.문구입력요청",
                                                                                                        "dialogId": "default31"
                                                                                                    }
                                                                                                ],
                                                                                                "id": "default38",
                                                                                                "task": {
                                                                                                    "name": "deletegreeting"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "name": "73",
                                                                                                "input": [
                                                                                                    {
                                                                                                        "if": "true"
                                                                                                    }
                                                                                                ],
                                                                                                "output": [
                                                                                                    {
                                                                                                        "kind": "Content",
                                                                                                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                                                                                        "buttons": [
                                                                                                            {
                                                                                                                "url": "",
                                                                                                                "text": "다시 입력"
                                                                                                            },
                                                                                                            {
                                                                                                                "url": "",
                                                                                                                "text": "시작"
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                ],
                                                                                                "id": "default111",
                                                                                                "children": [
                                                                                                    {
                                                                                                        "name": "74",
                                                                                                        "input": [
                                                                                                            {
                                                                                                                "text": {
                                                                                                                    "raw": "다시",
                                                                                                                    "nlp": "다시"
                                                                                                                }
                                                                                                            },
                                                                                                            {
                                                                                                                "text": {
                                                                                                                    "raw": "입력",
                                                                                                                    "nlp": "입력"
                                                                                                                }
                                                                                                            }
                                                                                                        ],
                                                                                                        "output": [
                                                                                                            {
                                                                                                                "kind": "Action",
                                                                                                                "type": "call",
                                                                                                                "dialogName": "3.문구선택여부",
                                                                                                                "dialog": "3.문구선택여부",
                                                                                                                "dialogId": "default36"
                                                                                                            }
                                                                                                        ],
                                                                                                        "id": "default112"
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ],
                                                                                        "task": {
                                                                                            "name": ""
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "name": "68",
                                                                                        "input": [
                                                                                            {
                                                                                                "if": "true"
                                                                                            }
                                                                                        ],
                                                                                        "output": [
                                                                                            {
                                                                                                "kind": "Content",
                                                                                                "text": "죄송합니다. 더 정확하게 입력해주세요. 다시 입력하고 싶으시면, 아래의 '다시 입력' 버튼을 선택해주세요~\n\n마음을 들은 것 없어요? 자기는 쓰시고 싶으면 \"직접 쓰기\"를 입력해주세요.\n\n처음으로 가려면“시작“이라고 입력해주세요.",
                                                                                                "buttons": [
                                                                                                    {
                                                                                                        "url": "",
                                                                                                        "text": "다시 입력"
                                                                                                    },
                                                                                                    {
                                                                                                        "url": "",
                                                                                                        "text": "직접 쓰기"
                                                                                                    },
                                                                                                    {
                                                                                                        "url": "",
                                                                                                        "text": "시작"
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ],
                                                                                        "id": "default106",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "69",
                                                                                                "input": [
                                                                                                    {
                                                                                                        "text": {
                                                                                                            "raw": "다시",
                                                                                                            "nlp": "다시"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": {
                                                                                                            "raw": "선택",
                                                                                                            "nlp": "선택"
                                                                                                        }
                                                                                                    }
                                                                                                ],
                                                                                                "output": [
                                                                                                    {
                                                                                                        "kind": "Action",
                                                                                                        "type": "call",
                                                                                                        "dialogName": "3.참고문구 소개",
                                                                                                        "dialog": "3.참고문구 소개",
                                                                                                        "dialogId": "default34"
                                                                                                    }
                                                                                                ],
                                                                                                "id": "default107"
                                                                                            },
                                                                                            {
                                                                                                "name": "70",
                                                                                                "input": [
                                                                                                    {
                                                                                                        "text": {
                                                                                                            "raw": "직접",
                                                                                                            "nlp": "직접"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": {
                                                                                                            "raw": "쓰",
                                                                                                            "nlp": "쓰다"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": {
                                                                                                            "raw": "써",
                                                                                                            "nlp": "쓰다"
                                                                                                        }
                                                                                                    }
                                                                                                ],
                                                                                                "output": [
                                                                                                    {
                                                                                                        "kind": "Action",
                                                                                                        "text": "",
                                                                                                        "if": "if(context.session.decorate===\"리본\")",
                                                                                                        "type": "call",
                                                                                                        "dialogName": "3.문구입력요청2",
                                                                                                        "dialog": "3.문구입력요청2",
                                                                                                        "dialogId": "default49"
                                                                                                    },
                                                                                                    {
                                                                                                        "kind": "Action",
                                                                                                        "type": "call",
                                                                                                        "dialogName": "3.문구입력요청",
                                                                                                        "dialog": "3.문구입력요청",
                                                                                                        "dialogId": "default31",
                                                                                                        "text": "",
                                                                                                        "if": "if(context.session.decorate===\"카드\")"
                                                                                                    }
                                                                                                ],
                                                                                                "id": "default108"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ],
                                                                                "task": {
                                                                                    "name": "showgreeting"
                                                                                }
                                                                            },
                                                                            {
                                                                                "name": "71",
                                                                                "input": [
                                                                                    {
                                                                                        "if": "true"
                                                                                    }
                                                                                ],
                                                                                "output": [
                                                                                    {
                                                                                        "kind": "Content",
                                                                                        "text": "죄송합니다. 더 정확하게 입력해주세요. 다시 입력하고 싶으시면, 아래의 '다시 입력' 버튼을 선택해주세요~\n\n처음으로 가려면“시작“이라고 입력해주세요.",
                                                                                        "buttons": [
                                                                                            {
                                                                                                "url": "",
                                                                                                "text": "다시 입력"
                                                                                            },
                                                                                            {
                                                                                                "url": "",
                                                                                                "text": "시작"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ],
                                                                                "id": "default109",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "72",
                                                                                        "input": [
                                                                                            {
                                                                                                "text": {
                                                                                                    "raw": "다시",
                                                                                                    "nlp": "다시"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "text": {
                                                                                                    "raw": "선택",
                                                                                                    "nlp": "선택"
                                                                                                }
                                                                                            }
                                                                                        ],
                                                                                        "output": [
                                                                                            {
                                                                                                "kind": "Action",
                                                                                                "type": "call",
                                                                                                "dialogName": "3.참고문구 카테고리",
                                                                                                "dialog": "3.참고문구 카테고리",
                                                                                                "dialogId": "default33"
                                                                                            }
                                                                                        ],
                                                                                        "id": "default110"
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ],
                                                                        "task": {
                                                                            "name": "getgreeting"
                                                                        }
                                                                    },
                                                                    {
                                                                        "name": "3.문구입력",
                                                                        "input": [
                                                                            {
                                                                                "if": "true"
                                                                            }
                                                                        ],
                                                                        "output": [
                                                                            {
                                                                                "kind": "Action",
                                                                                "options": {
                                                                                    "output": "기타 요청사항을 입력해주세요.\n\n※ 케익이 포함된경우 요청사항에 양초갯수를 적어주세요!"
                                                                                },
                                                                                "type": "call",
                                                                                "dialogName": "1.기타요청사항",
                                                                                "dialog": "1.기타요청사항",
                                                                                "dialogId": "default37"
                                                                            }
                                                                        ],
                                                                        "id": "default35",
                                                                        "task": {
                                                                            "name": "savegreeting"
                                                                        }
                                                                    }
                                                                ],
                                                                "task": {
                                                                    "name": "savedecorate"
                                                                }
                                                            },
                                                            {
                                                                "name": "3.리본좌측 입력요청",
                                                                "input": [
                                                                    {
                                                                        "text": {
                                                                            "raw": "리본",
                                                                            "nlp": "리본"
                                                                        }
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Content",
                                                                        "text": "리본 좌측에 들어갈 보내는 분 성함을 입력해주세요.\n(ex: 아리랑)\n\n-보내는 이름을 안쓰시면 구매자 성함으로 보내드립니다.\n(ex: 네)\n\n-익명을 원하시면 익명이라고 써주세요.\n(ex: 익명)\n\n-리본메세지는 리본 한쪽당 15자 이내가 적당합니다."
                                                                    }
                                                                ],
                                                                "id": "default32",
                                                                "children": [
                                                                    {
                                                                        "name": "3.문구입력요청2",
                                                                        "input": [
                                                                            {
                                                                                "if": "true"
                                                                            }
                                                                        ],
                                                                        "output": [
                                                                            {
                                                                                "kind": "Content",
                                                                                "text": "리본 우측에 들어갈 경조문구를 입력하세요.\n\n-리본메세지는 리본 한쪽당 15자 이내가 적당합니다.\n\n 경조사어 참고문구를 보고싶으시다면 '참고문구' 라고 입력하세요."
                                                                            }
                                                                        ],
                                                                        "id": "default49",
                                                                        "children": [
                                                                            {
                                                                                "name": "3.참고문구 캐태고리2",
                                                                                "input": [
                                                                                    {
                                                                                        "text": {
                                                                                            "raw": "참고문구 ",
                                                                                            "nlp": "참고 문구"
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "text": {
                                                                                            "raw": "참고 문구",
                                                                                            "nlp": "참고 문구"
                                                                                        }
                                                                                    }
                                                                                ],
                                                                                "output": [
                                                                                    {
                                                                                        "kind": "Action",
                                                                                        "type": "call",
                                                                                        "dialogName": "3.참고문구 카테고리",
                                                                                        "dialog": "3.참고문구 카테고리",
                                                                                        "dialogId": "default33"
                                                                                    }
                                                                                ],
                                                                                "id": "default50"
                                                                            },
                                                                            {
                                                                                "name": "3.기타요청사항2",
                                                                                "input": [
                                                                                    {
                                                                                        "if": "true"
                                                                                    }
                                                                                ],
                                                                                "output": [
                                                                                    {
                                                                                        "kind": "Action",
                                                                                        "options": {
                                                                                            "output": "기타 요청사항을 입력해주세요.\n\n※ 케익이 포함된경우 요청사항에 양초갯수를 적어주세요!"
                                                                                        },
                                                                                        "type": "call",
                                                                                        "dialogName": "1.기타요청사항",
                                                                                        "dialog": "1.기타요청사항",
                                                                                        "dialogId": "default37"
                                                                                    }
                                                                                ],
                                                                                "id": "default51",
                                                                                "task": {
                                                                                    "name": "savegreeting"
                                                                                }
                                                                            }
                                                                        ],
                                                                        "task": {
                                                                            "name": "savesendname"
                                                                        }
                                                                    }
                                                                ],
                                                                "task": {
                                                                    "name": "savedecorate"
                                                                }
                                                            },
                                                            {
                                                                "name": "66",
                                                                "input": [
                                                                    {
                                                                        "if": "true"
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Content",
                                                                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                                                        "buttons": [
                                                                            {
                                                                                "url": "",
                                                                                "text": "다시 입력"
                                                                            },
                                                                            {
                                                                                "url": "",
                                                                                "text": "시작"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "id": "default104",
                                                                "children": [
                                                                    {
                                                                        "name": "67",
                                                                        "input": [
                                                                            {
                                                                                "text": {
                                                                                    "raw": "다시",
                                                                                    "nlp": "다시"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": {
                                                                                    "raw": "입력",
                                                                                    "nlp": "입력"
                                                                                }
                                                                            }
                                                                        ],
                                                                        "output": [
                                                                            {
                                                                                "kind": "Action",
                                                                                "type": "call",
                                                                                "dialogName": "3.카드/리본 선택",
                                                                                "dialog": "3.카드/리본 선택",
                                                                                "dialogId": "default30"
                                                                            }
                                                                        ],
                                                                        "id": "default105"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "103",
                                                "input": [
                                                    {
                                                        "if": "true"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                                                        "buttons": [
                                                            {
                                                                "url": "",
                                                                "text": "다시 입력"
                                                            },
                                                            {
                                                                "url": "",
                                                                "text": "시작"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "id": "default141",
                                                "children": [
                                                    {
                                                        "name": "104",
                                                        "input": [
                                                            {
                                                                "text": {
                                                                    "raw": "다시",
                                                                    "nlp": "다시"
                                                                }
                                                            },
                                                            {
                                                                "text": {
                                                                    "raw": "입력",
                                                                    "nlp": "입력"
                                                                }
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Action",
                                                                "type": "call",
                                                                "dialogName": "3.배송일시",
                                                                "dialog": "3.배송일시",
                                                                "dialogId": "default28"
                                                            }
                                                        ],
                                                        "id": "default142"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "name": "3.주소 잘 못 입력하기",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "dialog": "3.주소",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "다시 입력"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "시작"
                                                    }
                                                ],
                                                "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
                                            }
                                        ],
                                        "id": "default55",
                                        "children": [
                                            {
                                                "name": "65",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "다시",
                                                            "nlp": "다시"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "입력",
                                                            "nlp": "입력"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Action",
                                                        "type": "call",
                                                        "dialogName": "3.주소",
                                                        "dialog": "3.주소",
                                                        "dialogId": "default27"
                                                    }
                                                ],
                                                "id": "default103"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "3.수취인 연락처 입력 틀린경우",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "type": "repeat",
                                        "dialog": 1,
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "다시 입력"
                                            },
                                            {
                                                "url": "",
                                                "text": "시작"
                                            }
                                        ],
                                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요."
                                    }
                                ],
                                "id": "default59",
                                "children": [
                                    {
                                        "name": "64",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "다시",
                                                    "nlp": "다시"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "입력",
                                                    "nlp": "입력"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "type": "call",
                                                "dialogName": "3.수취인 연락처",
                                                "dialog": "3.수취인 연락처",
                                                "dialogId": "default26"
                                            }
                                        ],
                                        "id": "default102"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "task": {
                    "name": "nobride"
                }
            },
            {
                "name": "62",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "다시 입력"
                            },
                            {
                                "url": "",
                                "text": "시작"
                            }
                        ]
                    }
                ],
                "id": "default100",
                "children": [
                    {
                        "name": "63",
                        "input": [
                            {
                                "text": {
                                    "raw": "다시",
                                    "nlp": "다시"
                                }
                            },
                            {
                                "text": {
                                    "raw": "입력",
                                    "nlp": "입력"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "type": "call",
                                "dialogName": "3.기존회원",
                                "dialog": "3.기존회원",
                                "dialogId": "default21"
                            }
                        ],
                        "id": "default101"
                    }
                ]
            }
        ],
        "task": {
            "name": ""
        }
    },
    {
        "name": "4.게시판에 문의하기",
        "input": [
            {
                "text": {
                    "raw": "3",
                    "nlp": "3"
                }
            },
            {
                "text": {
                    "raw": "게시판",
                    "nlp": "게시판"
                }
            },
            {
                "text": {
                    "raw": "문의하기",
                    "nlp": "문의 하다"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "인공지능 꽃배달봇에게 문의해보세요.\n\n또는 플라워마니아 홈페이지에서 관리자에게 문의할 수도있어요.",
                "buttons": [
                    {
                        "url": "",
                        "text": "인공지능 꽃배달봇에게 물어보기"
                    },
                    {
                        "url": "http://flowercenterjst.allofthat.kr/?doc=sub_07",
                        "text": "게시판으로 이동하기"
                    }
                ]
            }
        ],
        "id": "default52",
        "children": [
            {
                "name": "3.문의 하기",
                "input": [
                    {
                        "text": {
                            "raw": "인공",
                            "nlp": "인공"
                        }
                    },
                    {
                        "text": {
                            "raw": "지능",
                            "nlp": "지능"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "어떤 문의를 하시고 싶어요?"
                    }
                ],
                "id": "default74"
            },
            {
                "name": "93",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "다시 입력"
                            },
                            {
                                "url": "",
                                "text": "시작"
                            }
                        ]
                    }
                ],
                "id": "default131",
                "children": [
                    {
                        "name": "94",
                        "input": [
                            {
                                "text": {
                                    "raw": "다시",
                                    "nlp": "다시"
                                }
                            },
                            {
                                "text": {
                                    "raw": "입력",
                                    "nlp": "입력"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "type": "call",
                                "dialogName": "4.게시판에 문의하기",
                                "dialog": "4.게시판에 문의하기",
                                "dialogId": "default52"
                            }
                        ],
                        "id": "default132"
                    }
                ]
            }
        ]
    },
    {
        "name": "5.배송확인하기",
        "input": [
            {
                "text": {
                    "raw": "확인",
                    "nlp": "확인"
                }
            },
            {
                "text": {
                    "raw": "확인 하다",
                    "nlp": "확인 하다"
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
                "text": "api 연동중",
                "buttons": []
            }
        ],
        "id": "default53"
    },
    {
        "name": "6.주문 확인 신규회원",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "options": {
                    "output": "주문내역 확인을 위해 회원인증이 필요합니다.\n휴대폰 번호를 입력해주세요."
                },
                "type": "call",
                "text": "주문하신 고객님의 휴대폰 연락처를 입력해주세요.\n(ex: 01012345678)",
                "dialogName": "3.고객 이메일",
                "dialog": "3.고객 이메일",
                "dialogId": "default16"
            }
        ],
        "id": "default75",
        "children": [],
        "task": {
            "name": ""
        }
    },
    {
        "name": "6.주문 확인 기존회원",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "if": "context.session.orderlist.length<1",
                "type": "call",
                "dialogName": "6.기존회원 주문내역 없는 경우",
                "dialog": "6.기존회원 주문내역 없는 경우",
                "dialogId": "default78"
            },
            {
                "kind": "Action",
                "if": "context.session.orderlist.length>=1",
                "type": "call",
                "dialogName": "6.기존회원 주문내역 있는 경우",
                "dialog": "6.기존회원 주문내역 있는 경우",
                "dialogId": "default77"
            }
        ],
        "id": "default76",
        "task": {
            "name": "showorder"
        },
        "children": []
    },
    {
        "name": "6.기존회원 주문내역 있는 경우",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "완료된 고객님의 지난 주문내역입니다.\n\n지난 주문내역과 동일한 상품으로 주문을 원하시면 해당 주문내역의 번호를 입력하세요.",
                "buttons": []
            }
        ],
        "task": {
            "name": "showorder"
        },
        "id": "default77",
        "children": [
            {
                "name": "6.기존회원 주문내역 추가",
                "input": [
                    {
                        "types": "orderlist"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "주문접수중인 상품의 주문내역입니다.\n\n주문확정은 고객님의 휴대폰으로 SMS를 통해 안내해드리겠습니다.\n\n처음으로 가려면 \"시작\"이라고 입력해주세요.\n\n-주문일시: \n+dialog.userInput.types.orderlist.time+\n-고객성함: +dialog.userInput.types.orderlist.name+\n-보내시는분 성함: +dialog.userInput.types.orderlist.sendername+\n-고객 휴대폰 번호: +dialog.userInput.types.orderlist.mobile+\n-받는분 성함: +dialog.userInput.types.orderlist.receivername+\n-받는분 연락처: +dialog.userInput.types.orderlist.receivermobile+\n-배달주소: +dialog.userInput.types.orderlist.receiveraddress+\n-남기시는 메세지: +dialog.userInput.types.orderlist.greeting+\n-상품명: +dialog.userInput.types.orderlist.itemname+\n-상품금액: +dialog.userInput.types.orderlist.price+원\n-수량: +dialog.userInput.types.orderlist.itemnumber+\n\n총 +dialog.userInput.types.orderlist.allprice+원\n\n[상품 이미지]"
                    }
                ],
                "task": {
                    "name": "showorder1"
                },
                "id": "default79"
            },
            {
                "name": "95",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "죄송합니다. 더 정확하게 입력해주세요. 다시 입력하고 싶으시면, 아래의 '다시 입력' 버튼을 선택해주세요~\n\n처음으로 가려면“시작“이라고 입력해주세요.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "다시 입력"
                            },
                            {
                                "url": "",
                                "text": "시작"
                            }
                        ]
                    }
                ],
                "id": "default133",
                "children": [
                    {
                        "name": "96",
                        "input": [
                            {
                                "text": {
                                    "raw": "다시",
                                    "nlp": "다시"
                                }
                            },
                            {
                                "text": {
                                    "raw": "선택",
                                    "nlp": "선택"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "type": "call",
                                "dialogName": "6.기존회원 주문내역 있는 경우",
                                "dialog": "6.기존회원 주문내역 있는 경우",
                                "dialogId": "default77"
                            }
                        ],
                        "id": "default134"
                    }
                ]
            }
        ]
    },
    {
        "name": "6.기존회원 주문내역 없는 경우",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "고객님의 계정으로 주문완료 된 상품이 없습니다.\n\n다른 상품으로 주문을 도와드릴까요?",
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
        "id": "default78",
        "children": [
            {
                "name": "6.기존회원 주문내역 없고 네 경우",
                "input": [
                    {
                        "intent": "네"
                    },
                    {}
                ],
                "output": [
                    {
                        "kind": "Action",
                        "type": "call",
                        "dialogName": "1.카테고리 대",
                        "dialog": "1.카테고리 대",
                        "dialogId": "default0"
                    }
                ],
                "id": "default80"
            },
            {
                "name": "6.기존회원 주문내역 없고 아니요 경우",
                "input": [
                    {
                        "intent": "아니요"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "type": "call",
                        "dialogName": "시작",
                        "dialog": "시작",
                        "dialogId": "defaultcommon0"
                    }
                ],
                "id": "default81"
            },
            {
                "name": "97",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "죄송합니다. 고객님이 잘 못 입력했습니다. 다시 입력하시고 싶으면 \"다시 입력\"을 입력해주세요.\n\n처음으로 가려면\"시작\"이라고 입력해주세요.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "다시 입력"
                            },
                            {
                                "url": "",
                                "text": "시작"
                            }
                        ]
                    }
                ],
                "id": "default135",
                "children": [
                    {
                        "name": "98",
                        "input": [
                            {
                                "text": {
                                    "raw": "다시",
                                    "nlp": "다시"
                                }
                            },
                            {
                                "text": {
                                    "raw": "입력",
                                    "nlp": "입력"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "type": "call",
                                "dialogName": "6.기존회원 주문내역 없는 경우",
                                "dialog": "6.기존회원 주문내역 없는 경우",
                                "dialogId": "default78"
                            }
                        ],
                        "id": "default136"
                    }
                ]
            }
        ]
    },
    {
        "name": "6.신규회원 경우 회원가입 여부 묻기",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "고객님께서는 비회원이시기 때문에 주문내역을 확인해드릴 수가 없습니다.\n\n플라워마니아 홈페이지에서 회원가입을 하시면, 할인된 회원가로 상품을 구매하실 수 있습니다.",
                "buttons": []
            }
        ],
        "task": {
            "name": "addvip"
        },
        "id": "default82"
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
                "text": "안녕하세요 < +bot.name+ >입니다!\n꽃은 청렴한 사람이 받을수있는 선물입니다."
            }
        ],
        "task": {
            "name": "startbuttons"
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
            "up": 1
        }
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}