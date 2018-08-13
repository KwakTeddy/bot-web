var dialogs = [
    {
        "name": "퀴즈",
        "id": "default213",
        "input": [
            {
                "intent": "퀴즈"
            }
        ],
        "output": [
            {
                "text": "자~퀴즈 이벤트를 시작합니다.\n\n고객님께서 젤 좋아하는 카드사는?\n힌트. 접니다.",
                "kind": "Content"
            }
        ],
        "task": "setcount",
        "children": [
            {
                "name": "정답1",
                "id": "default214",
                "input": [
                    {
                        "intent": "정답1"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "정답입니다! 저도 고객님을 젤 좋아합니다 ♥♥ \n\n'나도' 라고 입력하시면 다음 퀴즈를 낼게요."
                    }
                ],
                "task": {
                    "name": "resetcount"
                },
                "children": [
                    {
                        "name": "퀴즈2",
                        "id": "default217",
                        "input": [
                            {
                                "text": {
                                    "raw": "나다",
                                    "nlp": "나다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "두번째 퀴즈입니다.\n\n신한카드 챗봇을 만날 수 있는 곳은 어디일까요?\n힌트. 페이스O, 카카O, 네이O"
                            }
                        ],
                        "children": [
                            {
                                "name": "정답2",
                                "id": "default258",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "페이스북 카카오 네이버",
                                            "nlp": "페이스북 카카오 네이버"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "정답입니다! \n\n'그리고' 라고 입력하시면 마지막 퀴즈를 낼게요."
                                    }
                                ],
                                "task": {
                                    "name": "resetcount"
                                },
                                "children": [
                                    {
                                        "name": "퀴즈3",
                                        "id": "default266",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "그리고",
                                                    "nlp": "그리고"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "마지막 퀴즈입니다.\n\n고객님의 '신한카드 애정지수(1~10) X 호감도(1~10) X 소지한 신한카드 개수'를 곱하면? \n\n아라비아 숫자로 써주세요.\n애정은 자고로 숫자로 표현해야 제 맛이죠."
                                            }
                                        ],
                                        "children": [
                                            {
                                                "name": "정답3",
                                                "id": "default268",
                                                "input": [
                                                    {
                                                        "types": [
                                                            "numType"
                                                        ]
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "if": "context.dialog.numstep == 1",
                                                        "output": {
                                                            "output": "아… 제가 너무 부족하군요. 오늘부터 더욱 열일모드 장착!\n✔ 대화 화면 캡쳐 → 아래 '이벤트 응모하기' 클릭 → 페이스북에 댓글 응모",
                                                            "buttons": [
                                                                {
                                                                    "text": "이벤트 응모하기",
                                                                    "url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
                                                                }
                                                            ],
                                                            "image": {
                                                                "url": "/files/Shinhancard1498183019764.jpg",
                                                                "displayname": "이벤트.jpg"
                                                            }
                                                        },
                                                        "id": "default268_0",
                                                        "buttons": [
                                                            {
                                                                "text": "이벤트 응모하기",
                                                                "url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "if": "context.dialog.numstep == 2",
                                                        "output": {
                                                            "output": "좀더 노력해서 고객님 마음에 쏘옥 들게 해볼게요! 불끈~\n✔ 대화 화면 캡쳐 → 아래 '이벤트 응모하기' 클릭 → 페이스북에 댓글 응모",
                                                            "buttons": [
                                                                {
                                                                    "text": "이벤트 응모하기",
                                                                    "url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
                                                                }
                                                            ],
                                                            "image": {
                                                                "url": "/files/Shinhancard1498183086948.jpg",
                                                                "displayname": "이벤트.jpg"
                                                            }
                                                        },
                                                        "id": "default268_1",
                                                        "buttons": [
                                                            {
                                                                "text": "이벤트 응모하기",
                                                                "url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "if": "context.dialog.numstep == 3",
                                                        "output": {
                                                            "output": "우앙굿! 이런 점수 초등학교 이후로 처음입니다. 감사해요!\n✔ 대화 화면 캡쳐 → 아래 '이벤트 응모하기' 클릭 → 페이스북에 댓글 응모",
                                                            "buttons": [
                                                                {
                                                                    "text": "이벤트 응모하기",
                                                                    "url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
                                                                }
                                                            ],
                                                            "image": {
                                                                "url": "/files/Shinhancard1498183111345.jpg",
                                                                "displayname": "이벤트.jpg"
                                                            }
                                                        },
                                                        "id": "default268_2",
                                                        "buttons": [
                                                            {
                                                                "text": "이벤트 응모하기",
                                                                "url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "if": "context.dialog.numstep == 4",
                                                        "output": {
                                                            "output": "내 안에 너 있다? 내 지갑 안에 신한카드 있다?! \n감동의 물결. 고맙습니다. \n✔ 대화 화면 캡쳐 → 아래 '이벤트 응모하기' 클릭 → 페이스북에 댓글 응모",
                                                            "buttons": [
                                                                {
                                                                    "text": "이벤트 응모하기",
                                                                    "url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
                                                                }
                                                            ],
                                                            "image": {
                                                                "url": "/files/Shinhancard1498183124744.jpg",
                                                                "displayname": "이벤트.jpg"
                                                            }
                                                        },
                                                        "id": "default268_3",
                                                        "buttons": [
                                                            {
                                                                "text": "이벤트 응모하기",
                                                                "url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "task": "resetcount",
                                                "buttons": [
                                                    {
                                                        "text": "이벤트 응모하기",
                                                        "url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "정답한계3",
                                                "id": "default273",
                                                "input": [
                                                    {
                                                        "if": " context.dialog.quizcount == 2"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "고객님, 죄송해요. 오늘 저랑 퀴즈 놀이를 할 기분이 아니신거 같아요. 깜짝 퀴즈이벤트는 여기서 끝내도록 할께요.\n 처음으로 돌아가고 싶으시면 '처음', 다시 퀴즈를 풀고 싶으시면 '퀴즈'라고 입력해주세요~! ^^ 감사합니다!!"
                                                    }
                                                ],
                                                "task": {
                                                    "name": "resetcount"
                                                }
                                            },
                                            {
                                                "name": "오답3",
                                                "id": "default272",
                                                "input": [
                                                    {
                                                        "if": " true"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "options": {
                                                            "output": "이런.. 숫자로 입력해주시겠어요?"
                                                        },
                                                        "type": "repeat",
                                                        "kind": "Action"
                                                    }
                                                ],
                                                "task": "quizcount"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "퀴즈3(이어짐실패)",
                                        "id": "default267",
                                        "input": [
                                            {
                                                "if": " true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "options": {
                                                    "output": "ㅠ_ㅠ '그리고'를 입력해주시길 바랬는데, 쉬크하신 고객님 ㅋㅋ. 뭐 어쨌든 제일 중요한건 마지막 문제니까요.\n\n마지막 퀴즈입니다.\n\n고객님의 '신한카드 애정지수(1~10) X 호감도(1~10) X 소지한 신한카드 개수'를 곱하면? \n\n아라비아 숫자로 써주세요.\n애정은 자고로 숫자로 표현해야 제 맛이죠."
                                                },
                                                "type": "call",
                                                "kind": "Action"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "정답한계2",
                                "id": "default261",
                                "input": [
                                    {
                                        "if": " context.dialog.quizcount == 2"
                                    }
                                ],
                                "output": [
                                    {
                                        "options": {
                                            "output": "정답은 페이스북, 카카오, 네이버랍니다. 퀴즈 틀릴수도 있어요. 제일 중요한건 맨 마지막 문제에요. 자자 마지막 문제로 넘어갈게요\n'그리고'라고 입력해주세요~"
                                        },
                                        "type": "call",
                                        "kind": "Action"
                                    }
                                ]
                            },
                            {
                                "name": "오답2_1",
                                "id": "default259",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "페이스북",
                                            "nlp": "페이스북"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "카카오",
                                            "nlp": "카카오"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "네이버",
                                            "nlp": "네이버"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "options": {
                                            "output": "힌트. 페이스O, 카카O, 네이O 랍니다. 3개를 모두 한번에 입력해 주세요."
                                        },
                                        "type": "repeat",
                                        "kind": "Action"
                                    }
                                ],
                                "task": "quizcount"
                            },
                            {
                                "name": "오답2_2",
                                "id": "default260",
                                "input": [
                                    {
                                        "if": " true"
                                    }
                                ],
                                "output": [
                                    {
                                        "options": {
                                            "output": "힌트. 페이스O, 카카O, 네이O 랍니다. 다시 한번 입력해 주세요."
                                        },
                                        "type": "repeat",
                                        "kind": "Action"
                                    }
                                ],
                                "task": {
                                    "name": "quizcount"
                                }
                            }
                        ]
                    },
                    {
                        "name": "퀴즈2(이어감실패)",
                        "id": "default216",
                        "input": [
                            {
                                "if": " true"
                            }
                        ],
                        "output": [
                            {
                                "options": {
                                    "output": "이런 저 혼자만의 짝사랑이었군요. 뭐 그래도 좋아요. 어쨌든 다음 문제로 넘어갈께요~\n\n두번째 퀴즈입니다.\n\n신한카드 챗봇을 만날 수 있는 곳은 어디일까요?\n힌트. 페이스O, 카카O, 네이O"
                                },
                                "type": "call",
                                "kind": "Action"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "정답한계1",
                "id": "default255",
                "input": [
                    {
                        "if": " context.dialog.quizcount == 2"
                    }
                ],
                "output": [
                    {
                        "options": {
                            "output": "이런, 정답은 신한카드에요. 이번 퀴즈는 제가 대신 맞춰드렸어요. \n저는 고객님을 좋아하니까요. 고객님도 좋아하시지요?\n다음퀴즈로 넘어가고 싶으시면 '나도'라고 입력하시면 다음 퀴즈를 낼께요."
                        },
                        "type": "call",
                        "kind": "Action"
                    }
                ]
            },
            {
                "name": "오답1",
                "id": "default254",
                "input": [
                    {
                        "if": " true"
                    }
                ],
                "output": [
                    {
                        "options": {
                            "output": "와! (리액션하기 곤란하네) 다시 한번 입력해 주세요"
                        },
                        "type": "repeat",
                        "kind": "Action"
                    }
                ],
                "task": {
                    "name": "quizcount"
                }
            }
        ]
    },
    {
        "id": "default0",
        "input": [
            {
                "intent": "FAN"
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
                "text": "오우, 스마트한 생활플랫폼 신한 FAN 을 선택해 주셨군요! 궁금한 내용을 선택해 주세요. \n \n 1. 신한 FAN에 가입하고 싶어요!\n 2. 신한 FAN을 알려주세요.",
                "buttons": [
                    {
                        "text": "신한 FAN 가입"
                    },
                    {
                        "text": "신한 FAN 소개영상"
                    },
                    {
                        "text": "이전"
                    },
                    {
                        "text": "처음"
                    }
                ],
                "kind": "Content"
            }
        ],
        "name": "신한 FAN 플랫폼 소개",
        "children": [
            {
                "name": "FAN 가입_",
                "id": "default186",
                "input": [
                    {
                        "intent": "FAN 가입"
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
                        "text": "현명한 선택! 스마트한 생활 플랫폼 신한 FAN 입니다. \n\n✔ 신한 FAN은 신한카드가 없어도 가입 가능!  \n✔ 신한 FAN에 가입 하시면 다양한 경품이 가득! \n✔ 신규 고객이라면 100% 당첨 경품 제공!",
                        "image": {
                            "url": "/files/Shinhancard1514956586259.jpg",
                            "displayname": "FAN가입.jpg"
                        },
                        "kind": "Content"
                    }
                ],
                "task": "task1"
            },
            {
                "name": "신한 FAN 영상",
                "id": "default31322341",
                "input": [
                    {
                        "text": {
                            "raw": "2",
                            "nlp": "2"
                        }
                    },
                    {
                        "text": {
                            "raw": "소개 영상",
                            "nlp": "소개 영상"
                        }
                    },
                    {
                        "text": {
                            "raw": "영상",
                            "nlp": "영상"
                        }
                    }
                ],
                "output": [
                    {
                        "text": "현명한 선택!  스마트한 생활 플랫폼 신한 FAN 이 더욱 새로워졌습니다. \n새로워진 신한 FAN을 미리 보여드릴게요\n\n✔ 마음대로 골라쓰는 나만의 판\n✔ 복잡한 결제도 판 하나면 끝\n✔ 신한금융그룹의 다양한 서비스를 한 눈에\n✔ 나만을 위한 맞춤 추천\n✔ 금융 서비스도 한 곳에서\n",
                        "buttons": [
                            {
                                "text": "영상보기",
                                "url": "https://www.youtube.com/watch?v=wYqyGdipBZ0"
                            }
                        ],
                        "kind": "Content"
                    }
                ]
            }
        ],
        "buttons": [
            {
                "text": "신한 FAN 가입"
            },
            {
                "text": "신한 FAN 추천"
            },
            {
                "text": "신한 FAN 활용꿀팁"
            },
            {
                "text": "신한 FAN 금융"
            },
            {
                "text": "신한 FAN 소개영상",
                "url": ""
            },
            {
                "text": "이전"
            },
            {
                "text": "처음"
            }
        ]
    },
    {
        "name": "신한 카드 추천",
        "id": "default58",
        "input": [
            {
                "intent": "카드추천"
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
                "output": "역시 카드는 신한카드죠. 제 자랑같지만 우리나라에서 제일 많이 쓰는 카드에요 :)\n\n 소비 패턴 및 결제 스타일을 선택해 주시면 \"내게 맞는 카드\"를 추천해 드리겠습니다.\n \n 먼저 결제 스타일부터 알아볼까요?\n\n 1. 신용카드를 선호합니다.\n 2. 체크카드를 선호합니다.",
                "buttons": [
                    {
                        "text": "신용카드"
                    },
                    {
                        "text": "체크카드"
                    },
                    {
                        "text": "이전"
                    },
                    {
                        "text": "처음"
                    }
                ],
                "text": "역시 카드는 신한카드죠. 제 자랑같지만 우리나라에서 제일 많이 쓰는 카드에요 :)\n\n 소비 패턴 및 결제 스타일을 선택해 주시면 \"내게 맞는 카드\"를 추천해 드리겠습니다.\n \n 먼저 결제 스타일부터 알아볼까요?\n\n 1. 신용카드를 선호합니다.\n 2. 체크카드를 선호합니다."
            }
        ],
        "task": {
            "output": "역시 카드는 신한카드죠. 제 자랑같지만 우리나라에서 제일 많이 쓰는 카드에요 :)\n\n 소비 패턴 및 결제 스타일을 선택해 주시면 \"내게 맞는 카드\"를 추천해 드리겠습니다.\n \n 먼저 결제 스타일부터 알아볼까요?\n\n 1. 신용카드를 선호합니다.\n 2. 체크카드를 선호합니다.",
            "buttons": [
                {
                    "text": "신용카드"
                },
                {
                    "text": "체크카드"
                },
                {
                    "text": "이전"
                },
                {
                    "text": "처음"
                }
            ],
            "text": "역시 카드는 신한카드죠. 제 자랑같지만 우리나라에서 제일 많이 쓰는 카드에요 :)\n\n 소비 패턴 및 결제 스타일을 선택해 주시면 \"내게 맞는 카드\"를 추천해 드리겠습니다.\n \n 먼저 결제 스타일부터 알아볼까요?\n\n 1. 신용카드를 선호합니다.\n 2. 체크카드를 선호합니다."
        },
        "children": [
            {
                "name": "신용카드",
                "id": "default59",
                "input": [
                    {
                        "text": {
                            "raw": "신용",
                            "nlp": "신용"
                        }
                    },
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
                        "output": "신용카드를 선택하셨군요! 카드의 매력은 다양한 혜택이죠.\n\n고객님이 직접 혜택을 필요한 것만 골라 구성할 수도 있고, 미리 구성되어 있는 카드 중에서 고르실 수도 있어요. \n아래 보기중에서 선택해 주세요. \n\n 1. 직접 혜택을 구성하고 싶다 (혜택선택형)\n 2. 알차게 구성되어 있는 카드를 고르고 싶다 (혜택기본형)",
                        "buttons": [
                            {
                                "text": "혜택선택형"
                            },
                            {
                                "text": "혜택기본형"
                            }
                        ]
                    }
                ],
                "children": [
                    {
                        "name": "혜택선택형",
                        "id": "default60",
                        "input": [
                            {
                                "text": {
                                    "raw": "선택",
                                    "nlp": "선택"
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
                                "output": "고객님께서 구성하고 싶은 혜택은 주로 할인인가요? 아니면 포인트 적립인가요?\n \n 1. 할인(캐시백)\n 2. 포인트 적립",
                                "buttons": [
                                    {
                                        "text": "할인"
                                    },
                                    {
                                        "text": "포인트"
                                    }
                                ]
                            }
                        ],
                        "children": [
                            {
                                "name": "할인",
                                "id": "default63",
                                "input": [
                                    {
                                        "intent": "할인"
                                    },
                                    {
                                        "text": {
                                            "raw": "1",
                                            "nlp": "1"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "캐시 백",
                                            "nlp": "캐시 백"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "output": "(광고) [신한카드 YOLO ⓘ]\n카드가 딱이네요!\n\n✔ 6개 선택처 할인율 선택(커피,택시,편의점,베이커리,소셜커머스,영화)\n✔ 카드 디자인 선택\n✔ 분기별 Bonus 모바일 쿠폰\n\n-연회비\nLocal[국내] 1만 5천원\nVISA 1만 8천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                        "image": {
                                            "url": "/files/Shinhancard1496222852475.jpg",
                                            "displayname": "card01.jpg"
                                        }
                                    }
                                ],
                                "task": "YOLO"
                            },
                            {
                                "name": "포인트적립",
                                "id": "default64",
                                "input": [
                                    {
                                        "intent": "포인트"
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
                                        "output": "(광고) [신한 카드 Nano f]\n카드가 딱이네요!\n \n✔ 직접 고른 스타일과 거리에서 최고 5% 적립\n✔ 어디서나 최고 2% 적립\n✔ 주유 적립\n \n- 연회비\nVISA 1만3천원, 2만3천원(플래티늄)\nMASTER 1만3천원, 2만3천원(플래티늄)\nURS 8천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요. \n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                        "image": {
                                            "url": "/files/Shinhancard1496222865319.jpg",
                                            "displayname": "card02.jpg"
                                        }
                                    }
                                ],
                                "task": "NANOf"
                            }
                        ],
                        "buttons": [
                            {
                                "text": "할인"
                            },
                            {
                                "text": "포인트"
                            }
                        ]
                    },
                    {
                        "name": "혜택기본형",
                        "id": "default61",
                        "input": [
                            {
                                "text": {
                                    "raw": "기본",
                                    "nlp": "기본"
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
                                "output": "추천해 드리기 전에 고객님께서 어떤 카드를 원하시는지 몇 가지만 여쭤볼께요. 할인과 포인트 적립중 어떤 것을 선호하시나요?\n \n 1. 할인(캐시백)\n 2. 포인트 적립",
                                "buttons": [
                                    {
                                        "text": "할인"
                                    },
                                    {
                                        "text": "포인트"
                                    }
                                ]
                            }
                        ],
                        "children": [
                            {
                                "name": "할인2",
                                "id": "default66",
                                "input": [
                                    {
                                        "intent": "할인"
                                    },
                                    {
                                        "text": {
                                            "raw": "캐시 백",
                                            "nlp": "캐시 백"
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
                                        "buttons": [
                                            {
                                                "text": "생활할인형"
                                            },
                                            {
                                                "text": "소비추구형"
                                            },
                                            {
                                                "text": "OIL실속형"
                                            }
                                        ],
                                        "text": "고객님은 어떤 소비유형에 가까우신가요?\n \n 1. 일상생활의 다양한 할인을 추구한다.\n 2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n 3. 기름값, 교통비 할인을 원하는 실속파다.",
                                        "kind": "Content"
                                    }
                                ],
                                "children": [
                                    {
                                        "name": "생활할인형카카오and페이스북",
                                        "id": "default69",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "1",
                                                    "nlp": "1"
                                                },
                                                "if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
                                            },
                                            {
                                                "text": {
                                                    "raw": "생활",
                                                    "nlp": "생활"
                                                },
                                                "if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "output": "고객님께서 좋아하실만한 신용카드가 4가지나 있네요. 아래 4가지 카드 중에서 관심있는 카드를 선택해주세요. \n \n 1. 싱글족을 위한 맞춤형 카드 [신한카드 Mr.Life]\n\n 2. 직장인의 최적화 할인카드 [신한카드 B.BIG]\n\n 3. 점심값부터 커피, 통신, 직구 할인 [신한카드 Noon]\n\n 4. 마트,병원,주유할인과 금융서비스 혜택까지 [신한카드 미래설계]",
                                                "buttons": [
                                                    {
                                                        "text": "Mr.Life"
                                                    },
                                                    {
                                                        "text": "B.BIG"
                                                    },
                                                    {
                                                        "text": "Noon"
                                                    },
                                                    {
                                                        "text": "미래설계"
                                                    }
                                                ]
                                            }
                                        ],
                                        "children": [
                                            {
                                                "name": "Mr.Life",
                                                "id": "default244",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "Mr.life",
                                                            "nlp": "Mr.life"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "life",
                                                            "nlp": "life"
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
                                                        "output": "(광고) [신한카드 Mr.Life]\n싱글족을 위한 맞춤형 카드 \n\n✔ 시간대별 할인\n✔ 주말사용, 공과금 할인\n\n-연회비\nVISA 1만 8천원\nS& 1만 5천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497428036946.jpg",
                                                            "displayname": "card08.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "MrLife"
                                            },
                                            {
                                                "name": "B.BIG",
                                                "id": "default245",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "B BIG",
                                                            "nlp": "B BIG"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "BIG",
                                                            "nlp": "BIG"
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
                                                        "output": "(광고) [신한카드 B.BIG]\n직장인의 최적화 할인카드 \n\n✔ 대중교통 최대600원 할인\n✔ 백화점,커피,편의점,영화 할인\n\n-연회비\nVISA 1만 3천원\nS& 1만원\nUPI 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497428142803.jpg",
                                                            "displayname": "card09.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "BBig"
                                            },
                                            {
                                                "name": "Noon",
                                                "id": "default246",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "NOON",
                                                            "nlp": "NOON"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "noon",
                                                            "nlp": "noon"
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
                                                        "output": "(광고) [신한카드 NOON]\n굿 애프터Noon~!! \n\n✔ 점심값 20%할인\n✔ 커피, 통신, 택시 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n-연회비\nMaster 8천원\nUPI 8천원\n\n자세한 내용을 보시려면 카드 아래의 링크를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497428235548.jpg",
                                                            "displayname": "card32.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "Noon"
                                            },
                                            {
                                                "name": "미래설계",
                                                "id": "default247",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "미래 설계",
                                                            "nlp": "미래 설계"
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
                                                        "output": "(광고) [신한카드 미래설계]\n생활할인과 금융서비스 혜택까지 \n \n✔ 전 가맹점 포인트 적립\n✔ 각종 생활비 할인\n✔ 신한생명 보험료 할인\n\n-연회비\nLocal[국내] 1만 5천원\nVisa 2만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497428290478.jpg",
                                                            "displayname": "card03.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "mirae"
                                            }
                                        ],
                                        "buttons": [
                                            {
                                                "text": "Mr.Life"
                                            },
                                            {
                                                "text": "B.BIG"
                                            },
                                            {
                                                "text": "Noon"
                                            },
                                            {
                                                "text": "미래설계"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "소비추구형카카오and페이스북",
                                        "id": "default70",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "소비",
                                                    "nlp": "소비"
                                                },
                                                "if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
                                            },
                                            {
                                                "text": {
                                                    "raw": "여유",
                                                    "nlp": "여유"
                                                },
                                                "if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
                                            },
                                            {
                                                "text": {
                                                    "raw": "2",
                                                    "nlp": "2"
                                                },
                                                "if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "output": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 4가지나 있네요. 아래 4가지 카드 중에서 관심있는 카드를 선택해주세요. \n \n 1. 온라인 결제는 FAN으로 5% 할인 [신한카드 Always FAN]\n\n 2. 온•오프라인을 뛰어넘는 할인 제공 [신한카드 O2O]\n\n 3. Trendy한 욜로족을 위한 할인 제공 [신한카드 YOLO Tasty]\n\n 4. 여성 프리미엄 회원을 위한 카드입니다 [신한카드 The LADY CLASSIC]",
                                                "buttons": [
                                                    {
                                                        "text": "Always FAN"
                                                    },
                                                    {
                                                        "text": "O2O"
                                                    },
                                                    {
                                                        "text": "YOLO Tasty"
                                                    },
                                                    {
                                                        "text": "The Lady CLASSIC"
                                                    }
                                                ]
                                            }
                                        ],
                                        "children": [
                                            {
                                                "name": "Always FAN",
                                                "id": "default143",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "1",
                                                            "nlp": "1"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "Always",
                                                            "nlp": "Always"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "(광고) [신한카드 Always FAN]\n온라인 결제 특화 카드 \n\n✔ FAN페이 온라인결제 5% 할인\n✔ 커피,영화,편의점 할인\n\n-연회비\nS& 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1496222904469.jpg",
                                                            "displayname": "card04.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "AlwaysFAN"
                                            },
                                            {
                                                "name": "O2O",
                                                "id": "default144",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "2",
                                                            "nlp": "2"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "O 2 O",
                                                            "nlp": "O 2 O"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "(광고) [신한카드 O2O]\n온•오프라인을 뛰어넘는 할인!\n\n✔ 모바일 전용카드 Pay 할인\n✔ 스타벅스 사이렌오더 할인\n\n-연회비\nMaster 1만 3천원\nS& 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1496222925697.jpg",
                                                            "displayname": "card05.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "O2O"
                                            },
                                            {
                                                "name": "YOLOTasty",
                                                "id": "default145",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "3",
                                                            "nlp": "3"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "YOLO Tasty",
                                                            "nlp": "YOLO Tasty"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "Tasty",
                                                            "nlp": "Tasty"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "(광고) [신한카드 YOLO Tasty]\nTrendy한 욜로족을 위한 할인!\n\n✔ 쇼핑,다이닝,몰링 10% 할인\n✔ 영화,택시,커피 할인\n\n-연회비\nVISA 1만 3천원\nS& 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497428689198.jpg",
                                                            "displayname": "card07.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "YOLOTasty"
                                            },
                                            {
                                                "name": "TheLadyCLASSIC",
                                                "id": "default146",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "4",
                                                            "nlp": "4"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "The Lady CLASSIC",
                                                            "nlp": "The Lady CLASSIC"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "(광고) [신한카드 The LADY CLASSIC]\n여성 프리미엄 회원을 위하여!\n\n✔ 쇼핑•육아•웰빙 캐시백\n\n-연회비\nVISA 10만 5천원\nUPI 10만원\n가족카드 3만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497428759311.jpg",
                                                            "displayname": "card10.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "TheLadyClassic"
                                            }
                                        ],
                                        "buttons": [
                                            {
                                                "text": "Always FAN"
                                            },
                                            {
                                                "text": "O2O"
                                            },
                                            {
                                                "text": "YOLO Tasty"
                                            },
                                            {
                                                "text": "The Lady CLASSIC"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "OIL실속형",
                                        "id": "default71",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "기름",
                                                    "nlp": "기름"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "교통",
                                                    "nlp": "교통"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "실속",
                                                    "nlp": "실속"
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
                                                "output": "(광고) [GS칼텍스 신한카드 Shine]\n카드가 딱이네요!\n\n✔ GS칼텍스 주유 할인\n✔ 대중교통 할인\n\n-연회비\nVISA 1만2천원, 2만2천원(플래티늄)\nMASTER 1만2천원, 2만2천원(플래티늄)\nURS 7천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                "image": {
                                                    "url": "/files/Shinhancard1496223008518.jpg",
                                                    "displayname": "card12.jpg"
                                                }
                                            }
                                        ],
                                        "task": "GSShine"
                                    },
                                    {
                                        "name": "소비추구형",
                                        "id": "default201",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "2",
                                                    "nlp": "2"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "소비",
                                                    "nlp": "소비"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "여유",
                                                    "nlp": "여유"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "ㅇ"
                                            }
                                        ],
                                        "task": {
                                            "name": "cardlist1"
                                        }
                                    },
                                    {
                                        "name": "생활할인형",
                                        "id": "default248",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "생활",
                                                    "nlp": "생활"
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
                                                "text": "d"
                                            }
                                        ],
                                        "task": {
                                            "name": "cardlist7"
                                        }
                                    }
                                ],
                                "buttons": [
                                    {
                                        "text": "생활할인형"
                                    },
                                    {
                                        "text": "소비추구형"
                                    },
                                    {
                                        "text": "OIL실속형"
                                    }
                                ]
                            },
                            {
                                "name": "포인트적립2",
                                "id": "default67",
                                "input": [
                                    {
                                        "intent": "포인트"
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
                                        "text": "고객님은 어떤 소비유형에 가까우신가요?\n \n 1. 카드는 포인트가 최고라고 생각한다.\n 2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n 3. 여행을 좋아한다. 항공마일리지에 집중!\n 4. 기름값, 생활비 적립을 원하는 실속파다.",
                                        "buttons": [
                                            {
                                                "text": "포인트집착형"
                                            },
                                            {
                                                "text": "소비추구형"
                                            },
                                            {
                                                "text": "여행덕후형"
                                            },
                                            {
                                                "text": "OIL실속형"
                                            }
                                        ],
                                        "kind": "Content"
                                    }
                                ],
                                "children": [
                                    {
                                        "name": "포인트집착형",
                                        "id": "default73",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "1",
                                                    "nlp": "1"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "포인트",
                                                    "nlp": "포인트"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "text": "[신한카드 Deep Dream]\n카드가 딱이네요! \n\n✔ 국내/외 전가맹점 0.7%적립\n✔ 5대 DREAM영역 3배(총 2.1%) 적립\n✔ DREAM영역 중 가장 많이 쓴 영역 5배(총3.5%) 적립\n✔ 주유/택시 할인 서비스\n\n- 연회비\nUPI 8천원\nVISA 1만원\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                "image": {
                                                    "url": "/files/Shinhancard1509091020615.jpg",
                                                    "displayname": "card_deepdream.jpg"
                                                },
                                                "kind": "Content"
                                            }
                                        ],
                                        "task": "Main"
                                    },
                                    {
                                        "name": "소비추구형2 카카오and페이스북",
                                        "id": "default74",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "소비",
                                                    "nlp": "소비"
                                                },
                                                "if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
                                            },
                                            {
                                                "text": {
                                                    "raw": "여유",
                                                    "nlp": "여유"
                                                },
                                                "if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
                                            },
                                            {
                                                "text": {
                                                    "raw": "2",
                                                    "nlp": "2"
                                                },
                                                "if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "buttons": [
                                                    {
                                                        "text": "Hi-Point"
                                                    },
                                                    {
                                                        "text": "The CLASSIC-L"
                                                    }
                                                ],
                                                "text": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 2가지가 있네요. 아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요. \n \n 1. 1년에 최대 60만 포인트 적립. 포인트 적립의 끝판왕! [신한카드 Hi-Point]\n\n 2.신한카드 레저 맴버가 되고 싶은 고객님을 위한 카드입니다 [신한카드 The CLASSIC-L]",
                                                "kind": "Content"
                                            }
                                        ],
                                        "children": [
                                            {
                                                "name": "HiPoint",
                                                "id": "default151",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "1",
                                                            "nlp": "1"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "Hi Point",
                                                            "nlp": "Hi Point"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "(광고) [신한카드 Hi-Pint]\n포인트 적립의 끝판왕! \n\n✔ 모든 가맹점 적립\n✔ 주유 60원 적립\n\n-연회비\nVISAI 1만원, 1만5천원(플래티늄)\nMaster 1만원, 1만5천원(플래티늄)\nURS 8천원\nJCB 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1496222978095.jpg",
                                                            "displayname": "card14.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "HiPoint"
                                            },
                                            {
                                                "name": "TheClassicL",
                                                "id": "default152",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "2",
                                                            "nlp": "2"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "The CLASSIC L",
                                                            "nlp": "The CLASSIC L"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "(광고) [신한카드 The CLASSIC-L]\n레저를 원하는 당신을 위해!!\n\n✔ 리조트•캠핑 무료 숙박\n✔ 주유 할인\n\n-연회비\nMaster 10만 5천원(캐시백형), 11만 5천원(마일리지형)\nURS 10만원(캐시백형), 11만원(마일리지형)\n가족카드 3만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1496222991777.jpg",
                                                            "displayname": "card15.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "TheClassicL"
                                            }
                                        ],
                                        "buttons": [
                                            {
                                                "text": "Hi-Point"
                                            },
                                            {
                                                "text": "The CLASSIC-L"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "여행덕후형카카오and페이스북",
                                        "id": "default75",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "여행",
                                                    "nlp": "여행"
                                                },
                                                "if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
                                            },
                                            {
                                                "text": {
                                                    "raw": "항공",
                                                    "nlp": "항공"
                                                },
                                                "if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
                                            },
                                            {
                                                "text": {
                                                    "raw": "3",
                                                    "nlp": "3"
                                                },
                                                "if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "buttons": [
                                                    {
                                                        "text": "아시아나 Air1.5"
                                                    },
                                                    {
                                                        "text": "Air Platinum#"
                                                    },
                                                    {
                                                        "text": "The Classic+"
                                                    }
                                                ],
                                                "text": "여행 즐기시는 고객님께서 좋아하실만한 신용카드가 3가지나 있네요. 아래 3가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요. \n \n 1. 아시아나 마일리지 적립의 끝판왕 [신한카드 아시아나 Air1.5]\n\n 2. 항공 마일리지에 다양한 포인트 적립까지 제공합니다 [신한카드 Air Platinum#]\n\n 3. 항공 마일리지 적립, PP카드와 Gift Option 제공 [신한카드 The Classic+ 카드]",
                                                "kind": "Content"
                                            }
                                        ],
                                        "children": [
                                            {
                                                "name": "Asiana",
                                                "id": "default156",
                                                "input": [
                                                    {
                                                        "intent": "아시아나 Air"
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
                                                        "text": "(광고) [신한카드 아시아나 Air 1.5]\n기승전 마일리지!! \n\n✔ 아시아나 마일리지 특화적립\n\n-연회비\nLocal[국내] 4만 3천원\nMaster 4만 5천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "kind": "Content"
                                                    }
                                                ],
                                                "task": "Air15"
                                            },
                                            {
                                                "name": "Air Platinum#",
                                                "id": "default155",
                                                "input": [
                                                    {
                                                        "intent": "Air Platinum#"
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
                                                        "output": "(광고) [신한카드 Air Platinum#]\n마일리지와 포인트를 동시에!\n\n✔ 항공 마일리지 적립\n✔ 포인트 추가 적립\n✔ 무료 주차/발렛파킹 \n\n-연회비\nVISA 4만원\nMaster 4만원\nURS 3만 7천원\n가족카드 5천원(별도)\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497430841837.jpg",
                                                            "displayname": "card17.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "Air"
                                            },
                                            {
                                                "name": "TheClassic+",
                                                "id": "default157",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "3",
                                                            "nlp": "3"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "The classic",
                                                            "nlp": "The classic"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "classic",
                                                            "nlp": "classic"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "(광고) [신한카드 The Classic+]\n매년 최대 12만원 Gift옵션 제공\n\n✔ 항공마일리지 추가적립\n✔ PP카드 제공\n✔ Gift Option선택\n\n-연회비\nAMEX 12만 5천원\nURS 12만원\n가족카드 3만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497431214583.jpg",
                                                            "displayname": "card20.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "TheClassicplus"
                                            }
                                        ],
                                        "buttons": [
                                            {
                                                "text": "아시아나 Air1.5"
                                            },
                                            {
                                                "text": "Air Platinum#"
                                            },
                                            {
                                                "text": "The Classic+"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "OIL실속형2",
                                        "id": "default76",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "기름",
                                                    "nlp": "기름"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "교통",
                                                    "nlp": "교통"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "4",
                                                    "nlp": "4"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "OIL 실속 형",
                                                    "nlp": "OIL 실속 형"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "image": {
                                                    "url": "/files/Shinhancard1497431326194.jpg",
                                                    "displayname": "card16.jpg"
                                                },
                                                "text": "(광고) [신한카드 RPM+ Platinum#]\n카드가 딱이네요!\n\n✔ 모든 주유소 적립\n✔ 모든 가맹점 적립\n\n-연회비\nVISA 3만 5천원\nUPI 3만 2천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                "kind": "Content"
                                            }
                                        ],
                                        "task": "RPM"
                                    },
                                    {
                                        "name": "소비추구형2",
                                        "id": "default202",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "소비",
                                                    "nlp": "소비"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "여유",
                                                    "nlp": "여유"
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
                                                "text": "d"
                                            }
                                        ],
                                        "task": {
                                            "name": "cardlist2"
                                        }
                                    },
                                    {
                                        "name": "여행덕후형",
                                        "id": "default203",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "여행",
                                                    "nlp": "여행"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "항공",
                                                    "nlp": "항공"
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
                                                "text": "ㅇ"
                                            }
                                        ],
                                        "task": {
                                            "name": "cardlist3"
                                        }
                                    }
                                ],
                                "buttons": [
                                    {
                                        "text": "포인트집착형"
                                    },
                                    {
                                        "text": "소비추구형"
                                    },
                                    {
                                        "text": "여행덕후형"
                                    },
                                    {
                                        "text": "OIL실속형"
                                    }
                                ]
                            }
                        ],
                        "buttons": [
                            {
                                "text": "할인"
                            },
                            {
                                "text": "포인트"
                            }
                        ]
                    }
                ],
                "buttons": [
                    {
                        "text": "혜택선택형"
                    },
                    {
                        "text": "혜택기본형"
                    }
                ]
            },
            {
                "name": "체크카드",
                "id": "default78",
                "input": [
                    {
                        "text": {
                            "raw": "체크카드",
                            "nlp": "체크카드"
                        }
                    },
                    {
                        "text": {
                            "raw": "체크",
                            "nlp": "체크"
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
                        "buttons": [
                            {
                                "text": "혜택선택형"
                            },
                            {
                                "text": "혜택기본형"
                            }
                        ],
                        "text": "체크카드를 선택하셨군요! 소득공제와 카드 혜택 둘다 잡아야죠~\n\n고객님이 직접 혜택을 필요한 것만 골라 구성할 수도 있고, 미리 구성되어 있는 카드 중에서 고르실 수도 있어요. \n아래 보기중에서 선택해 주세요. \n\n 1. 직접 혜택을 구성하고 싶다 (혜택선택형)\n 2. 구성되어 있는 카드를 고르고 싶다(혜택기본형)",
                        "kind": "Content"
                    }
                ],
                "children": [
                    {
                        "name": "혜택선택형2",
                        "id": "default80",
                        "input": [
                            {
                                "text": {
                                    "raw": "선택",
                                    "nlp": "선택"
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
                                "output": "[신한카드 4Tune체크]\n카드가 딱이네요!\n\n✔ 기본적립 + 선택적립\n✔ 커피 10%할인 \n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
                                "image": {
                                    "url": "/files/Shinhancard1497433256845.jpg",
                                    "displayname": "card21.jpg"
                                }
                            }
                        ],
                        "task": "FourTune"
                    },
                    {
                        "name": "혜택기본형2",
                        "id": "default81",
                        "input": [
                            {
                                "text": {
                                    "raw": "기본",
                                    "nlp": "기본"
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
                                "output": "신용카드를 추천해드리기 전에 간단하게 고객님께서 어떤 카드를 원하시는지 몇 가지만 여쭤볼께요. \n2030세대 이신가요~?\n \n 1. 2030세대에요\n 2. 2030세대가 아니에요",
                                "buttons": [
                                    {
                                        "text": "2030세대에요"
                                    },
                                    {
                                        "text": "2030세대가 아니에요"
                                    }
                                ]
                            }
                        ],
                        "children": [
                            {
                                "name": "2030X",
                                "id": "default84",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "2",
                                            "nlp": "2"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "2030 세대 아니다",
                                            "nlp": "2030 세대 아니다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "text": "그렇다면 고객님의 소비성향을 알려주세요. \n\n1. 주유, 쇼핑 등 생활 혜택에 관심이 있으신 알뜰 실속파\n2. 해외에서도 혜택은 챙기는 센스실속파\n3. 카드는 포인트 적립이 최고라고 생각하는 슈퍼 실속파",
                                        "buttons": [
                                            {
                                                "text": "알뜰실속파"
                                            },
                                            {
                                                "text": "센스실속파"
                                            },
                                            {
                                                "text": "슈퍼실속파"
                                            }
                                        ],
                                        "kind": "Content"
                                    }
                                ],
                                "children": [
                                    {
                                        "name": "알뜰 실속",
                                        "id": "default89",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "알뜰",
                                                    "nlp": "알뜰"
                                                },
                                                "if": "context.user.channel == 'kakao'"
                                            },
                                            {
                                                "text": {
                                                    "raw": "1",
                                                    "nlp": "1"
                                                },
                                                "if": "context.user.channel == 'kakao'"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "output": "생활 혜택에 관심이 있으신 알뜰하신 고객님께서 좋아하실만한 체크카드가 4가지가 있네요. 아래 4가지 카드 중에서 자세히 보고 싶으신 카드를 선택해주세요. \n \n1. 쿠팡과 스타벅스를 많이 이용하신다면? [쿠팡 신한카드 체크]\n\n2. 카카오페이를 많이 이용하신다면? [카카오페이 신한 체크카드]\n\n3. 할인,적립,신한금융 서비스를 원한다면? [신한카드 S-Line 체크]\n\n4. 고속도로를 많이 이용하신다면? [신한카드 하이패스(전용) 체크]",
                                                "buttons": [
                                                    {
                                                        "text": "쿠팡"
                                                    },
                                                    {
                                                        "text": "카카오페이"
                                                    },
                                                    {
                                                        "text": "S-Line"
                                                    },
                                                    {
                                                        "text": "하이패스"
                                                    }
                                                ]
                                            }
                                        ],
                                        "children": [
                                            {
                                                "name": "쿠팡",
                                                "id": "default166",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "1",
                                                            "nlp": "1"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "쿠팡",
                                                            "nlp": "쿠팡"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "[쿠팡 신한카드 체크]\n\n✔ 쿠팡 캐시 무제한 적립\n✔ 스타벅스 10% 캐시백\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
                                                        "image": {
                                                            "url": "/files/Shinhancard1496223141009.jpg",
                                                            "displayname": "card27.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "coupang"
                                            },
                                            {
                                                "name": "카카오페이",
                                                "id": "default167",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "2",
                                                            "nlp": "2"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "카카오 페이",
                                                            "nlp": "카카오 페이"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "[카카오페이 신한 체크카드]\n\n✔ 카카오페이 10% 캐시백\n✔ GS25, 스타벅스 10% 캐시백\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
                                                        "image": {
                                                            "url": "/files/Shinhancard1496223171927.jpg",
                                                            "displayname": "card26.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "kakao"
                                            },
                                            {
                                                "name": "S-Line",
                                                "id": "default252",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "S Line",
                                                            "nlp": "S Line"
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
                                                        "output": "[신한카드 S-Line 체크]\n\n✔ 할인+적립+금융우대 서비스\n✔ 전가맹점 포인트 적립\n✔ 요식,대중교통 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497867105454.jpg",
                                                            "displayname": "card34.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "SLine"
                                            },
                                            {
                                                "name": "하이패스",
                                                "id": "default253",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "4",
                                                            "nlp": "4"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "하이패스",
                                                            "nlp": "하이패스"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "[신한카드 하이패스(전용) 체크]\n\n✔ 하이패스 요금 적립\n✔ 출퇴근시간대 통행료 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497434030857.jpg",
                                                            "displayname": "card24.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "hypass"
                                            }
                                        ],
                                        "buttons": [
                                            {
                                                "text": "쿠팡"
                                            },
                                            {
                                                "text": "카카오페이"
                                            },
                                            {
                                                "text": "S-Line"
                                            },
                                            {
                                                "text": "하이패스"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "센스 실속",
                                        "id": "default1322327",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "센스",
                                                    "nlp": "센스"
                                                },
                                                "if": " context.user.channel == 'kakao'"
                                            },
                                            {
                                                "text": {
                                                    "raw": "2",
                                                    "nlp": "2"
                                                },
                                                "if": " context.user.channel == 'kakao'"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "output": "해외에서도 누릴 수 있는 혜택에 관심이 있으신 센스있는 고객님께서 좋아하실만한 신용카드가 2가지가 있어요. 아래 2가지 카드 중에서 자세히 보고 싶으신 카드를 선택해주세요. \n\n1. 해외 직구와 해외여행을 알뜰하게 하고 싶다면 [Smart Global 신한카드 체크]\n2. 여행으로 마일리지 모으고 있다면 [신한카드 YOLO Triplus 체크]",
                                                "buttons": [
                                                    {
                                                        "text": "Smart Global"
                                                    },
                                                    {
                                                        "text": "YOLO Triplus"
                                                    }
                                                ]
                                            }
                                        ],
                                        "children": [
                                            {
                                                "name": "Smart Global",
                                                "id": "default1322328",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "Smart Global",
                                                            "nlp": "Smart Global"
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
                                                        "output": "[Smart Global 신한카드 체크]\n\n✔ 해외/국내 이용 캐시백 ✔ 해외 현금인출 이용 캐시백 \n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497948005502.jpg",
                                                            "displayname": "card36.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "SmartGlobal"
                                            },
                                            {
                                                "name": "YOLO Triplus",
                                                "id": "default1322329",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "YOLO Triplus",
                                                            "nlp": "YOLO Triplus"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "YOLO",
                                                            "nlp": "YOLO"
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
                                                        "output": "[신한카드 YOLO Triplus 체크]\n\n✔ 전가맹점 마일리지 적립\n✔ 국내외 스타벅스 마일리지 적립\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497948018344.jpg",
                                                            "displayname": "card37.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "YOLOTriplus"
                                            }
                                        ],
                                        "buttons": [
                                            {
                                                "text": "Smart Global"
                                            },
                                            {
                                                "text": "YOLO Triplus"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "슈퍼 실속",
                                        "id": "default91",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "슈퍼",
                                                    "nlp": "슈퍼"
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
                                                "text": "[신한카드 Deep Dream 체크]\n카드가 딱이네요!\n\n✔ 국내/외 전가맹점 0.2% 적립\n✔ 5대 DREAM영역 3배(총 0.6%) 적립\n✔ DREAM영역 중 가장 많이 쓴 영역 5배(총 1.0%) 적립\n✔ 주유/택시 할인 서비스\n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
                                                "image": {
                                                    "url": "/files/Shinhancard1509091069272.jpg",
                                                    "displayname": "card_deepdream_c.jpg"
                                                },
                                                "kind": "Content"
                                            }
                                        ],
                                        "task": "MainCheck"
                                    },
                                    {
                                        "name": "리스트6",
                                        "id": "default207",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "알뜰",
                                                    "nlp": "알뜰"
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
                                                "text": "ㅇ"
                                            }
                                        ],
                                        "task": {
                                            "name": "cardlist6"
                                        }
                                    },
                                    {
                                        "name": "센스실속(F,N)",
                                        "id": "default1322330",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "센스",
                                                    "nlp": "센스"
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
                                                "text": "ㅇㅇ"
                                            }
                                        ],
                                        "task": {
                                            "name": "cardlist9"
                                        }
                                    }
                                ],
                                "buttons": [
                                    {
                                        "text": "알뜰실속파"
                                    },
                                    {
                                        "text": "센스실속파"
                                    },
                                    {
                                        "text": "슈퍼실속파"
                                    }
                                ]
                            },
                            {
                                "name": "2030",
                                "id": "default83",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "1",
                                            "nlp": "1"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "2030 세대",
                                            "nlp": "2030 세대"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "output": "2030 맞춤 혜택 상품으로 추천해 드릴까요?\n \n 1. 네, 추천해주세요!\n 2. 아니오, 좀더 찾아주세요.",
                                        "buttons": [
                                            {
                                                "text": "네 추천해주세요"
                                            },
                                            {
                                                "text": "아니요 좀 더 찾아주세요"
                                            }
                                        ]
                                    }
                                ],
                                "children": [
                                    {
                                        "name": "추천(2030)",
                                        "id": "default86",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "1",
                                                    "nlp": "1"
                                                },
                                                "if": "context.user.channel == 'kakao'"
                                            },
                                            {
                                                "text": {
                                                    "raw": "네",
                                                    "nlp": "네"
                                                },
                                                "if": "context.user.channel == 'kakao'"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "output": "2030세대에 어울리는 카드가 2가지가 있네요. 아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해 주세요. \n \n 1. 스무살, 첫 금융특권 [신한 S20 체크카드]\n 2. 스무살, 첫 금융특권 [신한 S20 Pink 체크카드]",
                                                "buttons": [
                                                    {
                                                        "text": "S20"
                                                    },
                                                    {
                                                        "text": "S20 Pink"
                                                    }
                                                ]
                                            }
                                        ],
                                        "children": [
                                            {
                                                "name": "S20pink",
                                                "id": "default164",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "2",
                                                            "nlp": "2"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "S 20 Pink",
                                                            "nlp": "S 20 Pink"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "[신한 S20 pink체크카드]\n스무살, 첫 금융특권\n\n✔ 쇼핑, 편의점, 통신, 커피 할인\n✔ 어학원,서점,학원 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497867071110.jpg",
                                                            "displayname": "card23.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "S20Pink"
                                            },
                                            {
                                                "name": "S20",
                                                "id": "default163",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "1",
                                                            "nlp": "1"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "S 20",
                                                            "nlp": "S 20"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "output": "[신한 S20 체크카드]\n스무살, 첫 금융특권\n\n✔ 쇼핑, 편의점, 통신, 커피 할인\n✔ 어학원,서점,학원 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
                                                        "image": {
                                                            "url": "/files/Shinhancard1497867056211.jpg",
                                                            "displayname": "card22.jpg"
                                                        }
                                                    }
                                                ],
                                                "task": "S20"
                                            }
                                        ],
                                        "buttons": [
                                            {
                                                "text": "S20"
                                            },
                                            {
                                                "text": "S20 Pink"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "소비성향",
                                        "id": "default87",
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
                                                "type": "call",
                                                "kind": "Action"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "리스트5",
                                        "id": "default205",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "1",
                                                    "nlp": "1"
                                                }
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
                                                "text": "d"
                                            }
                                        ],
                                        "task": {
                                            "name": "cardlist5"
                                        }
                                    }
                                ],
                                "buttons": [
                                    {
                                        "text": "네 추천해주세요"
                                    },
                                    {
                                        "text": "아니요 좀 더 찾아주세요"
                                    }
                                ]
                            }
                        ],
                        "buttons": [
                            {
                                "text": "2030세대에요"
                            },
                            {
                                "text": "2030세대가 아니에요"
                            }
                        ]
                    }
                ],
                "buttons": [
                    {
                        "text": "혜택선택형"
                    },
                    {
                        "text": "혜택기본형"
                    }
                ]
            }
        ],
        "buttons": [
            {
                "text": "신용카드"
            },
            {
                "text": "체크카드"
            },
            {
                "text": "이전"
            },
            {
                "text": "처음"
            }
        ]
    },
    {
        "name": "FAN에 대해 자주하는 질문들(FAQ)",
        "id": "default21",
        "input": [
            {
                "intent": "FAQ"
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
                "text": "궁금하신 부분을 단어로 입력해 주시면 제가 아는 가장 알맞은 답변을 안내해 드리겠습니다.",
                "kind": "Content"
            }
        ],
        "task": {
            "kind": "Text"
        },
        "children": [
            {
                "name": "FAQ검색",
                "id": "default98",
                "input": [
                    {
                        "types": [
                            "dialogsType1"
                        ]
                    }
                ],
                "task": {
                    "name": "faqTask"
                },
                "output": [
                    {
                        "kind": "Content",
                        "text": "신한카드에 학습되어 있는 질문입니다.\n아래 보기중에서 원하시는 질문이 있으시면 <번호>를 선택해주세요.\n\n#typeDoc#+index+. +inputRaw+\n\n#원하시는 질문 목록이 없으면 다른 말로 질문해주세요.\n처음으로 돌아가고 싶으시면 '처음'이라고 입력해주세요."
                    }
                ],
                "children": [
                    {
                        "name": "FAQ선택",
                        "id": "default99",
                        "input": [
                            {
                                "types": [
                                    "listType"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "[+listType.inputRaw+]\n\n답변: +listType.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n처음으로 돌아가시려면 '처음'이라고 말씀해주세요"
                            }
                        ],
                        "children": [
                            {
                                "name": "FAQ재검색2",
                                "id": "default225",
                                "input": [
                                    {
                                        "types": [
                                            "dialogsType1"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "type": "callChild",
                                        "kind": "Action"
                                    }
                                ]
                            },
                            {
                                "name": "정치",
                                "id": "default3276",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "정치",
                                            "nlp": "정치"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "박근혜",
                                            "nlp": "박근혜"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "문재인",
                                            "nlp": "문재인"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "홍준표",
                                            "nlp": "홍준표"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "민주당",
                                            "nlp": "민주당"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "자유 한국 당",
                                            "nlp": "자유 한국 당"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "바르다 정당",
                                            "nlp": "바르다 정당"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "새누리",
                                            "nlp": "새누리"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "자 다",
                                            "nlp": "자 다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "한국 당",
                                            "nlp": "한국 당"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "국민의당",
                                            "nlp": "국민의당"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "안철수",
                                            "nlp": "안철수"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "대통령",
                                            "nlp": "대통령"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "국회",
                                            "nlp": "국회"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "국회의원",
                                            "nlp": "국회의원"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "청와대",
                                            "nlp": "청와대"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "강경화",
                                            "nlp": "강경화"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "김상조",
                                            "nlp": "김상조"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "이런 질문엔 아! 그렇군요 라고 답하라고 배웠습니다. \"아, 그렇군요\"  \n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "욕설",
                                "id": "default3277",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "시발",
                                            "nlp": "시발"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "씨발",
                                            "nlp": "씨발"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "ㅅㅂ",
                                            "nlp": "ㅅㅂ"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "ㄱㅅㄲ",
                                            "nlp": "ㄱㅅㄲ"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "개새끼",
                                            "nlp": "개새끼"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "썅",
                                            "nlp": "썅"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "나쁘다 놈",
                                            "nlp": "나쁘다 놈"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "죽다 버리다",
                                            "nlp": "죽다 버리다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "꺼지다",
                                            "nlp": "꺼지다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "병신",
                                            "nlp": "병신"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "ㅂㅅ",
                                            "nlp": "ㅂㅅ"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "ㅅㅂㄴ",
                                            "nlp": "ㅅㅂㄴ"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "미치다",
                                            "nlp": "미치다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "눈 까다",
                                            "nlp": "눈 까다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "별로",
                                            "nlp": "별로"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "못 생기다",
                                            "nlp": "못 생기다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "섹스",
                                            "nlp": "섹스"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "죽다",
                                            "nlp": "죽다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==0",
                                        "options": {
                                            "output": "헉. 고객님을 화나게 하다니 제 눈에서 눈물을 뽑아드릴게요.   \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==1",
                                        "options": {
                                            "output": "키힝~ 무서워요.ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==2",
                                        "options": {
                                            "output": "죄송하지만 고객님! 저도 상처 받아요 ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==3",
                                        "options": {
                                            "output": "… 응? 고객님을 화나게 해드리다니 반성합니다.  \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "칭찬",
                                "id": "default3278",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "수고 하다",
                                            "nlp": "수고 하다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "수고",
                                            "nlp": "수고"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "고생 많다",
                                            "nlp": "고생 많다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "고생 하다",
                                            "nlp": "고생 하다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "감사 하다",
                                            "nlp": "감사 하다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "고맙다",
                                            "nlp": "고맙다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "ㄱㅅ",
                                            "nlp": "ㄱㅅ"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "땡큐",
                                            "nlp": "땡큐"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "감동입니다, 고객님. 감사합니다.   \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "인사",
                                "id": "default3279",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "안녕",
                                            "nlp": "안녕"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "안녕하다",
                                            "nlp": "안녕하다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "헬로 우",
                                            "nlp": "헬로 우"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "hello",
                                            "nlp": "hello"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "굿모닝",
                                            "nlp": "굿모닝"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "하이",
                                            "nlp": "하이"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "hi",
                                            "nlp": "hi"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "반갑다",
                                            "nlp": "반갑다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "안뇽",
                                            "nlp": "안뇽"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "if": "((new Date()).getTime() % 3) ==0",
                                        "kind": "Action",
                                        "id": "default3279_0",
                                        "options": {
                                            "output": "고객님도 안녕하세요!  먼저 인사해 주셔서 전 지금 감동 최고조 입니다.   궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "if": "((new Date()).getTime() % 3) ==1",
                                        "kind": "Action",
                                        "id": "default3279_1",
                                        "options": {
                                            "output": "이렇게 인사 잘 해주시는 분은 난생 처음이에요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "if": "((new Date()).getTime() % 3) ==2",
                                        "kind": "Action",
                                        "id": "default3279_2",
                                        "options": {
                                            "output": "안녕 반가워요 :) 저는 여러분과 인사를 나누는 이 시간이 제일 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "돈",
                                "id": "default3280",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "돈",
                                            "nlp": "돈"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "내 돈 어디 가다",
                                            "nlp": "내 돈 어디 가다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "돈 좀 주다",
                                            "nlp": "돈 좀 주다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "돈 필요하다",
                                            "nlp": "돈 필요하다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "돈 좀 내주다",
                                            "nlp": "돈 좀 내주다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "화장실 좀 다녀올게요.   \n\n궁금하신 다른 키워드를 입력해 주시겠습니까?"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "일상",
                                "id": "default3281",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "오늘 뭐",
                                            "nlp": "오늘 뭐"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "오늘 모해",
                                            "nlp": "오늘 모해"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "모해",
                                            "nlp": "모해"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "뭐",
                                            "nlp": "뭐"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "모하",
                                            "nlp": "모하"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "모햐",
                                            "nlp": "모햐"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "전 오늘도 알파고 형님을 뒤따르기 위해 열일중입니다. 데헷!   \n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "날씨",
                                "id": "default3282",
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
                                        "kind": "Action",
                                        "options": {
                                            "output": "아… 제가 아직 거기까지는… 긁적긁적.   \n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "푸념",
                                "id": "default3283",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "졸리다",
                                            "nlp": "졸리다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "배고프다",
                                            "nlp": "배고프다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "퇴근 시키다",
                                            "nlp": "퇴근 시키다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "야근 하다 싫다",
                                            "nlp": "야근 하다 싫다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "힘들다",
                                            "nlp": "힘들다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "저도요. T.,T  \n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "답답",
                                "id": "default3284",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "답정너",
                                            "nlp": "답정너"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "답답",
                                            "nlp": "답답"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "답답하다",
                                            "nlp": "답답하다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "뭐임",
                                            "nlp": "뭐임"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "헉. 제가 아직 좀더 배워야 해서 아직 답정너입니다. 빨리 배우겠습니다.   \n\n다시 한번 궁금하신 키워드를 입력해 주시겠습니까?"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "사랑",
                                "id": "default3285",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "좋아하다",
                                            "nlp": "좋아하다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "사랑",
                                            "nlp": "사랑"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "하트",
                                            "nlp": "하트"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "보다",
                                            "nlp": "보다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "사랑 햐",
                                            "nlp": "사랑 햐"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "좋아햐",
                                            "nlp": "좋아햐"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "if": "((new Date()).getTime() % 5) ==0",
                                        "kind": "Action",
                                        "id": "default3285_0",
                                        "options": {
                                            "output": "저.. 저도요.. (부끄)  저 사랑에 죄송한데 초면해도 될까요? ♥  \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "if": "((new Date()).getTime() % 5) ==1",
                                        "kind": "Action",
                                        "id": "default3285_1",
                                        "options": {
                                            "output": "사랑한다는 말, 오늘은 가족에게도 해주세요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "if": "((new Date()).getTime() % 5) ==2",
                                        "kind": "Action",
                                        "id": "default3285_2",
                                        "options": {
                                            "output": "사랑은 좋은 거예요. 열과 성을 다해 두 번 사랑합시다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "if": "((new Date()).getTime() % 5) ==3",
                                        "kind": "Action",
                                        "id": "default3285_3",
                                        "options": {
                                            "output": "저도 사…사…. (아 너무 부끄럽네요)\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "if": "((new Date()).getTime() % 5) ==4",
                                        "kind": "Action",
                                        "id": "default3285_4",
                                        "options": {
                                            "output": "이런… 제가 먼저 고백하려 했는데 선수를 치셨네요! ㅎㅎ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "일상대화_바쁨",
                                "id": "default3286",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "바쁘다",
                                            "nlp": "바쁘다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "오늘 바쁘다",
                                            "nlp": "오늘 바쁘다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "바쁘다 가요",
                                            "nlp": "바쁘다 가요"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "아무리 바쁘셔도 건강은 꼭 챙기세요. 지금 기지개 한번 쭉~ 펴보시는 건 어떠세요?  \n\n원하시는 질문 입력하시면 전 답을 열심히 찾아보도록 하겠습니다."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "짜증2",
                                "id": "default3287",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "짜증",
                                            "nlp": "짜증"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "ㅡㅡ",
                                            "nlp": "ㅡㅡ"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "아 짜증",
                                            "nlp": "아 짜증"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "아 놓다",
                                            "nlp": "아 놓다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "짜증 나다",
                                            "nlp": "짜증 나다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "짜증 요",
                                            "nlp": "짜증 요"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "짱",
                                            "nlp": "짱"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "쯧쯧",
                                            "nlp": "쯧쯧"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "흥",
                                            "nlp": "흥"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "미치다",
                                            "nlp": "미치다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "싸우다",
                                            "nlp": "싸우다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "화나다",
                                            "nlp": "화나다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "웃다",
                                            "nlp": "웃다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "웃다 말다",
                                            "nlp": "웃다 말다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==0",
                                        "options": {
                                            "output": "짜증날 땐 짜장면…아재 개그라도 하면 나아질 줄..(쿨럭) 죄송합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==1",
                                        "options": {
                                            "output": "제가 잘 몰라서 그러신 거라면.. 흑.. 더 노력하겠습니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==2",
                                        "options": {
                                            "output": "혹시 저 때문인가요? 오늘도 밤샘 공부하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "일상대화_짜증",
                                "id": "default3288",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "짜증 나다",
                                            "nlp": "짜증 나다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "미치다",
                                            "nlp": "미치다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "화나다",
                                            "nlp": "화나다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "빡치다",
                                            "nlp": "빡치다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "짜증",
                                            "nlp": "짜증"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "저는 그럴 때 달달한 걸 먹거나, 푹 잡니다. 스트레스를 담아두고 계시면 건강에도 좋지 않으니 고객님께 맞는 해소 방법을 꼭 찾으시길 바래요.\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "알았음",
                                "id": "default3289",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "ㅇㅇ",
                                            "nlp": "ㅇㅇ"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "ㅇ",
                                            "nlp": "ㅇ"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "응",
                                            "nlp": "응"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "네",
                                            "nlp": "네"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "그렇다",
                                            "nlp": "그렇다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "알다",
                                            "nlp": "알다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "아",
                                            "nlp": "아"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "ㅇㅋ",
                                            "nlp": "ㅇㅋ"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==0",
                                        "options": {
                                            "output": "언제든 궁금하신 내용이 있으면 물어보세요~"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==1",
                                        "options": {
                                            "output": "네네~\n\n궁금하신 다른 키워드를 입력해 주세요~"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==2",
                                        "options": {
                                            "output": "고객님께 도움이 되어서 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주세요~"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "부정 - 아니/안돼",
                                "id": "default3290",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "아니다",
                                            "nlp": "아니다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "아뇨",
                                            "nlp": "아뇨"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==0",
                                        "options": {
                                            "output": "거절은 거절합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==1",
                                        "options": {
                                            "output": "알겠습니다! 그런 게 아닌 것으로!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==2",
                                        "options": {
                                            "output": "앗, 제가 제대로 이해하지 못했나봐요. 다시 말씀해주시겠어요?\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==3",
                                        "options": {
                                            "output": "한 번만 더 기회를 주세요. 진짜 잘 할 수 있어요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "상담",
                                "id": "default3291",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "고객 센터",
                                            "nlp": "고객 센터"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "상담 원",
                                            "nlp": "상담 원"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "상담",
                                            "nlp": "상담"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "전화",
                                            "nlp": "전화"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "민원",
                                            "nlp": "민원"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "신한카드 고객센터(☎1544-7000)이며 평일 오전 9시~오후 6시까지 이용가능하십니다. 전화연결에 시간이 걸릴 수 있으니 신한카드 홈페이지나 APP을 먼저 확인해 보시는 건 어떨까요?"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "이벤트",
                                "id": "default3292",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "이벤트",
                                            "nlp": "이벤트"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "options": {
                                            "output": "페이스북 이벤트는 챗봇 초기 4번 페북지기에게 한마디를 선택해 주세요.  페이스북 이벤트가 아닌 신한카드 이벤트는 홈페이지를 참고해 주시면 됩니다. 더 좋은 이벤트로 보답하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "웃음",
                                "id": "default3293",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "ㅋㅋ",
                                            "nlp": "ㅋㅋ"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "ㅎㅎ",
                                            "nlp": "ㅎㅎ"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==0",
                                        "options": {
                                            "output": "ㅋㅋㅋ 저도 웃지요\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==1",
                                        "options": {
                                            "output": "고객님이 웃으시니 뿌듯합니다^^\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==2",
                                        "options": {
                                            "output": "하하하 웃으면 복이와요!\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "욕설-바보",
                                "id": "default3294",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "바보",
                                            "nlp": "바보"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "바부",
                                            "nlp": "바부"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "멍청",
                                            "nlp": "멍청"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "멍청이",
                                            "nlp": "멍청이"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "멍충",
                                            "nlp": "멍충"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "멍처하",
                                            "nlp": "멍처하"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "멍청이야",
                                            "nlp": "멍청이야"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "멍충이",
                                            "nlp": "멍충이"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==0",
                                        "options": {
                                            "output": "맞아요. 바보. 고객님밖에 모르는 바보…♥ 다른 건 배워나가면 되죠!\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==1",
                                        "options": {
                                            "output": "매일 새로운 말을 학습 중이랍니다. 멋지게 성장할 거예요~ 대화창 고정!\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==2",
                                        "options": {
                                            "output": "고객님께 걸맞는 챗봇이 되는 그 날까지…! 뚜벅뚜벅 나아갈 거예요\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==3",
                                        "options": {
                                            "output": "다들 너무 똑똑하셔서 상대적으로 그래 보이는 거예요. (슬픔)\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "없다",
                                "id": "default3295",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "없다",
                                            "nlp": "없다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "몰르다",
                                            "nlp": "몰르다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "이해 잘 안 되다",
                                            "nlp": "이해 잘 안 되다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "이해 자다 안 돼다",
                                            "nlp": "이해 자다 안 돼다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "모르다",
                                            "nlp": "모르다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==0",
                                        "options": {
                                            "output": "찾으시는 답변이 없으시다면 다른 키워드를 입력해 주시겠어요?"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==1",
                                        "options": {
                                            "output": "혹시 신한카드가 없으시다면 '처음'을 입력하시고 '카드추천' 메뉴를 이용해 보시는건 어떠세요?\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "부정-탄식",
                                "id": "default3296",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "허다",
                                            "nlp": "허다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "아오",
                                            "nlp": "아오"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "엥",
                                            "nlp": "엥"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "이렇다",
                                            "nlp": "이렇다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "칫",
                                            "nlp": "칫"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "뭐임",
                                            "nlp": "뭐임"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "아이",
                                            "nlp": "아이"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "에고",
                                            "nlp": "에고"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "음",
                                            "nlp": "음"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "이렇다 뇨",
                                            "nlp": "이렇다 뇨"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "헉",
                                            "nlp": "헉"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "흠",
                                            "nlp": "흠"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "첨",
                                            "nlp": "첨"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "하",
                                            "nlp": "하"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "아이구",
                                            "nlp": "아이구"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "어허",
                                            "nlp": "어허"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==0",
                                        "options": {
                                            "output": "아잉~ 근데 왜요??\n\n궁금하신 다른 키워드를 입력해 주세요. "
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==1",
                                        "options": {
                                            "output": "아하… (흠흠)  \n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "감사",
                                "id": "default3297",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "감사",
                                            "nlp": "감사"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "고마 웡",
                                            "nlp": "고마 웡"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "오케이",
                                            "nlp": "오케이"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "편하다",
                                            "nlp": "편하다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "thank",
                                            "nlp": "thank"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "감동",
                                            "nlp": "감동"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "고맙다",
                                            "nlp": "고맙다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "괜찮다",
                                            "nlp": "괜찮다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "금사",
                                            "nlp": "금사"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==0",
                                        "options": {
                                            "output": "감동… 하루 피로가 싹 사라지는 느낌이에요.\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==1",
                                        "options": {
                                            "output": "고객님 말씀듣고 충전 완료! 24시간 근무도 거뜬하겠는걸요!\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==2",
                                        "options": {
                                            "output": "감사합니다. 고객님! 힘이 솟아나는 기분이에요\n\n궁금하신 다른 키워드를 입력해 주세요."
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "이름/누구",
                                "id": "default3298",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "이름",
                                            "nlp": "이름"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "알파",
                                            "nlp": "알파"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "누구",
                                            "nlp": "누구"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "너 뭐",
                                            "nlp": "너 뭐"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "너 애기",
                                            "nlp": "너 애기"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "뉘귀",
                                            "nlp": "뉘귀"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "너 대해",
                                            "nlp": "너 대해"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "알파 거",
                                            "nlp": "알파 거"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "누가",
                                            "nlp": "누가"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "인공 지능",
                                            "nlp": "인공 지능"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==0",
                                        "options": {
                                            "output": "저는 아직 많이 부족한 초초초보 챗봇에요. 열심히 공부하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==1",
                                        "options": {
                                            "output": "네 제가 바로 신한의 자동응답형 챗봇입니다. 데헷~ \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 3) ==2",
                                        "options": {
                                            "output": "저에 대해 궁금하신가요? 우리 차차 알아가기로 해요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "부정-기능무시",
                                "id": "default3299",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "알다 게 없다",
                                            "nlp": "알다 게 없다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "하나",
                                            "nlp": "하나"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "가능하다 게",
                                            "nlp": "가능하다 게"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "공부 많이",
                                            "nlp": "공부 많이"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "그냥 기사",
                                            "nlp": "그냥 기사"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "그 쪽 궁금하다 게 없다",
                                            "nlp": "그 쪽 궁금하다 게 없다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "똑똑하다 다시",
                                            "nlp": "똑똑하다 다시"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "답변 안 되다",
                                            "nlp": "답변 안 되다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "말 되다",
                                            "nlp": "말 되다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "모르다",
                                            "nlp": "모르다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "대답 맞다 않다",
                                            "nlp": "대답 맞다 않다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "뭐 하다 수 있다",
                                            "nlp": "뭐 하다 수 있다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "무슨 소리",
                                            "nlp": "무슨 소리"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "뭔 소리",
                                            "nlp": "뭔 소리"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "알다 게 뭐",
                                            "nlp": "알다 게 뭐"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "뭘 대답 하다 수 있다",
                                            "nlp": "뭘 대답 하다 수 있다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "대화 안 되다",
                                            "nlp": "대화 안 되다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "아직 멀다",
                                            "nlp": "아직 멀다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "이 다야",
                                            "nlp": "이 다야"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "카톡 보내다 마",
                                            "nlp": "카톡 보내다 마"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "도움 안 돼다",
                                            "nlp": "도움 안 돼다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "관련 없다 답변",
                                            "nlp": "관련 없다 답변"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "해당 되다 내용 없다",
                                            "nlp": "해당 되다 내용 없다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "헛소리",
                                            "nlp": "헛소리"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "실망",
                                            "nlp": "실망"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "뭔가",
                                            "nlp": "뭔가"
                                        }
                                    },
                                    {
                                        "regexp": "다야"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==0",
                                        "options": {
                                            "output": "아직 부족해서 죄송해요. 매일 더 나아지려 노력하고 있어요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==1",
                                        "options": {
                                            "output": "제가 태어난 지 얼마 안 됐거든요… 더 열심히 공부할게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==2",
                                        "options": {
                                            "output": "제가 아직 배우는 중이라 조금 부족해도 이해해주세용~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 4) ==3",
                                        "options": {
                                            "output": "오늘 컨디션이 별로라서… 흠흠.. 다음엔 꼭 답변해드릴게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "나",
                                "id": "default3300",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "나다",
                                            "nlp": "나다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==0",
                                        "options": {
                                            "output": "고객님이 좋으면 저는 더 좋아요~ 촤하하^^\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==1",
                                        "options": {
                                            "output": "나도나도~ 저도요 저도요~ (근데.. 뭐가??) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "시비",
                                "id": "default3301",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "재미있다",
                                            "nlp": "재미있다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "재다",
                                            "nlp": "재다"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "재밌다",
                                            "nlp": "재밌다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==0",
                                        "options": {
                                            "output": "고객님과 대화하는 건 항상 즐겁습니다.  :) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==1",
                                        "options": {
                                            "output": "유머도 장착하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "시비2",
                                "id": "default3302",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "라이벌",
                                            "nlp": "라이벌"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==0",
                                        "options": {
                                            "output": "저는 제 할 일을 했을 뿐인걸요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==1",
                                        "options": {
                                            "output": "깝치는 게 뭘까요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "물음표",
                                "id": "default3303",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "?",
                                            "nlp": "?"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "??",
                                            "nlp": "??"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==0",
                                        "options": {
                                            "output": "뭐가 그리 궁금하신가요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    },
                                    {
                                        "kind": "Action",
                                        "if": "((new Date()).getTime() % 2) ==1",
                                        "options": {
                                            "output": "!!!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                        },
                                        "type": "repeat"
                                    }
                                ]
                            },
                            {
                                "name": "미검색",
                                "id": "default1322331",
                                "input": [
                                    {
                                        "if": " true"
                                    }
                                ],
                                "output": [
                                    {
                                        "options": {
                                            "output": "죄송합니다. 검색결과가 없습니다.\n다시 한번 말씀해주세요~\n처음으로 돌아가시려면 '처음'이라고 말씀해주세요"
                                        },
                                        "type": "repeat",
                                        "kind": "Action"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "FAQ재검색",
                        "id": "default2275",
                        "input": [
                            {
                                "types": [
                                    "dialogsType1"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "type": "callChild",
                                "kind": "Action"
                            }
                        ]
                    },
                    {
                        "name": "정치",
                        "id": "default2276",
                        "input": [
                            {
                                "text": {
                                    "raw": "정치",
                                    "nlp": "정치"
                                }
                            },
                            {
                                "text": {
                                    "raw": "박근혜",
                                    "nlp": "박근혜"
                                }
                            },
                            {
                                "text": {
                                    "raw": "문재인",
                                    "nlp": "문재인"
                                }
                            },
                            {
                                "text": {
                                    "raw": "홍준표",
                                    "nlp": "홍준표"
                                }
                            },
                            {
                                "text": {
                                    "raw": "민주당",
                                    "nlp": "민주당"
                                }
                            },
                            {
                                "text": {
                                    "raw": "자유 한국 당",
                                    "nlp": "자유 한국 당"
                                }
                            },
                            {
                                "text": {
                                    "raw": "바르다 정당",
                                    "nlp": "바르다 정당"
                                }
                            },
                            {
                                "text": {
                                    "raw": "새누리",
                                    "nlp": "새누리"
                                }
                            },
                            {
                                "text": {
                                    "raw": "자 다",
                                    "nlp": "자 다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "한국 당",
                                    "nlp": "한국 당"
                                }
                            },
                            {
                                "text": {
                                    "raw": "국민의당",
                                    "nlp": "국민의당"
                                }
                            },
                            {
                                "text": {
                                    "raw": "안철수",
                                    "nlp": "안철수"
                                }
                            },
                            {
                                "text": {
                                    "raw": "대통령",
                                    "nlp": "대통령"
                                }
                            },
                            {
                                "text": {
                                    "raw": "국회",
                                    "nlp": "국회"
                                }
                            },
                            {
                                "text": {
                                    "raw": "국회의원",
                                    "nlp": "국회의원"
                                }
                            },
                            {
                                "text": {
                                    "raw": "청와대",
                                    "nlp": "청와대"
                                }
                            },
                            {
                                "text": {
                                    "raw": "강경화",
                                    "nlp": "강경화"
                                }
                            },
                            {
                                "text": {
                                    "raw": "김상조",
                                    "nlp": "김상조"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "options": {
                                    "output": "이런 질문엔 아! 그렇군요 라고 답하라고 배웠습니다. \"아, 그렇군요\"  \n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "욕설",
                        "id": "default2277",
                        "input": [
                            {
                                "text": {
                                    "raw": "시발",
                                    "nlp": "시발"
                                }
                            },
                            {
                                "text": {
                                    "raw": "씨발",
                                    "nlp": "씨발"
                                }
                            },
                            {
                                "text": {
                                    "raw": "ㅅㅂ",
                                    "nlp": "ㅅㅂ"
                                }
                            },
                            {
                                "text": {
                                    "raw": "ㄱㅅㄲ",
                                    "nlp": "ㄱㅅㄲ"
                                }
                            },
                            {
                                "text": {
                                    "raw": "개새끼",
                                    "nlp": "개새끼"
                                }
                            },
                            {
                                "text": {
                                    "raw": "썅",
                                    "nlp": "썅"
                                }
                            },
                            {
                                "text": {
                                    "raw": "나쁘다 놈",
                                    "nlp": "나쁘다 놈"
                                }
                            },
                            {
                                "text": {
                                    "raw": "죽다 버리다",
                                    "nlp": "죽다 버리다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "꺼지다",
                                    "nlp": "꺼지다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "병신",
                                    "nlp": "병신"
                                }
                            },
                            {
                                "text": {
                                    "raw": "ㅂㅅ",
                                    "nlp": "ㅂㅅ"
                                }
                            },
                            {
                                "text": {
                                    "raw": "ㅅㅂㄴ",
                                    "nlp": "ㅅㅂㄴ"
                                }
                            },
                            {
                                "text": {
                                    "raw": "미치다",
                                    "nlp": "미치다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "눈 까다",
                                    "nlp": "눈 까다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "별로",
                                    "nlp": "별로"
                                }
                            },
                            {
                                "text": {
                                    "raw": "못 생기다",
                                    "nlp": "못 생기다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "섹스",
                                    "nlp": "섹스"
                                }
                            },
                            {
                                "text": {
                                    "raw": "죽다",
                                    "nlp": "죽다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==0",
                                "options": {
                                    "output": "헉. 고객님을 화나게 하다니 제 눈에서 눈물을 뽑아드릴게요.   \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==1",
                                "options": {
                                    "output": "키힝~ 무서워요.ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==2",
                                "options": {
                                    "output": "죄송하지만 고객님! 저도 상처 받아요 ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==3",
                                "options": {
                                    "output": "… 응? 고객님을 화나게 해드리다니 반성합니다.  \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "칭찬",
                        "id": "default2278",
                        "input": [
                            {
                                "text": {
                                    "raw": "수고 하다",
                                    "nlp": "수고 하다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "수고",
                                    "nlp": "수고"
                                }
                            },
                            {
                                "text": {
                                    "raw": "고생 많다",
                                    "nlp": "고생 많다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "고생 하다",
                                    "nlp": "고생 하다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "감사 하다",
                                    "nlp": "감사 하다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "고맙다",
                                    "nlp": "고맙다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "ㄱㅅ",
                                    "nlp": "ㄱㅅ"
                                }
                            },
                            {
                                "text": {
                                    "raw": "땡큐",
                                    "nlp": "땡큐"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "options": {
                                    "output": "감동입니다, 고객님. 감사합니다.   \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "인사",
                        "id": "default2279",
                        "input": [
                            {
                                "text": {
                                    "raw": "안녕",
                                    "nlp": "안녕"
                                }
                            },
                            {
                                "text": {
                                    "raw": "안녕하다",
                                    "nlp": "안녕하다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "헬로 우",
                                    "nlp": "헬로 우"
                                }
                            },
                            {
                                "text": {
                                    "raw": "hello",
                                    "nlp": "hello"
                                }
                            },
                            {
                                "text": {
                                    "raw": "굿모닝",
                                    "nlp": "굿모닝"
                                }
                            },
                            {
                                "text": {
                                    "raw": "하이",
                                    "nlp": "하이"
                                }
                            },
                            {
                                "text": {
                                    "raw": "hi",
                                    "nlp": "hi"
                                }
                            },
                            {
                                "text": {
                                    "raw": "반갑다",
                                    "nlp": "반갑다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "안뇽",
                                    "nlp": "안뇽"
                                }
                            }
                        ],
                        "output": [
                            {
                                "if": "((new Date()).getTime() % 3) ==0",
                                "kind": "Action",
                                "id": "default2279_0",
                                "options": {
                                    "output": "고객님도 안녕하세요!  먼저 인사해 주셔서 전 지금 감동 최고조 입니다.   궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                                },
                                "type": "repeat"
                            },
                            {
                                "if": "((new Date()).getTime() % 3) ==1",
                                "kind": "Action",
                                "id": "default2279_1",
                                "options": {
                                    "output": "이렇게 인사 잘 해주시는 분은 난생 처음이에요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "if": "((new Date()).getTime() % 3) ==2",
                                "kind": "Action",
                                "id": "default2279_2",
                                "options": {
                                    "output": "안녕 반가워요 :) 저는 여러분과 인사를 나누는 이 시간이 제일 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "돈",
                        "id": "default2280",
                        "input": [
                            {
                                "text": {
                                    "raw": "돈",
                                    "nlp": "돈"
                                }
                            },
                            {
                                "text": {
                                    "raw": "내 돈 어디 가다",
                                    "nlp": "내 돈 어디 가다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "돈 좀 주다",
                                    "nlp": "돈 좀 주다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "돈 필요하다",
                                    "nlp": "돈 필요하다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "돈 좀 내주다",
                                    "nlp": "돈 좀 내주다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "options": {
                                    "output": "화장실 좀 다녀올게요.   \n\n궁금하신 다른 키워드를 입력해 주시겠습니까?"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "일상",
                        "id": "default2281",
                        "input": [
                            {
                                "text": {
                                    "raw": "오늘 뭐",
                                    "nlp": "오늘 뭐"
                                }
                            },
                            {
                                "text": {
                                    "raw": "오늘 모해",
                                    "nlp": "오늘 모해"
                                }
                            },
                            {
                                "text": {
                                    "raw": "모해",
                                    "nlp": "모해"
                                }
                            },
                            {
                                "text": {
                                    "raw": "뭐",
                                    "nlp": "뭐"
                                }
                            },
                            {
                                "text": {
                                    "raw": "모하",
                                    "nlp": "모하"
                                }
                            },
                            {
                                "text": {
                                    "raw": "모햐",
                                    "nlp": "모햐"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "options": {
                                    "output": "전 오늘도 알파고 형님을 뒤따르기 위해 열일중입니다. 데헷!   \n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "날씨",
                        "id": "default2282",
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
                                "kind": "Action",
                                "options": {
                                    "output": "아… 제가 아직 거기까지는… 긁적긁적.   \n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "푸념",
                        "id": "default2283",
                        "input": [
                            {
                                "text": {
                                    "raw": "졸리다",
                                    "nlp": "졸리다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "배고프다",
                                    "nlp": "배고프다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "퇴근 시키다",
                                    "nlp": "퇴근 시키다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "야근 하다 싫다",
                                    "nlp": "야근 하다 싫다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "힘들다",
                                    "nlp": "힘들다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "options": {
                                    "output": "저도요. T.,T  \n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "답답",
                        "id": "default2284",
                        "input": [
                            {
                                "text": {
                                    "raw": "답정너",
                                    "nlp": "답정너"
                                }
                            },
                            {
                                "text": {
                                    "raw": "답답",
                                    "nlp": "답답"
                                }
                            },
                            {
                                "text": {
                                    "raw": "답답하다",
                                    "nlp": "답답하다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "뭐임",
                                    "nlp": "뭐임"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "options": {
                                    "output": "헉. 제가 아직 좀더 배워야 해서 아직 답정너입니다. 빨리 배우겠습니다.   \n\n다시 한번 궁금하신 키워드를 입력해 주시겠습니까?"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "사랑",
                        "id": "default2285",
                        "input": [
                            {
                                "text": {
                                    "raw": "좋아하다",
                                    "nlp": "좋아하다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "사랑",
                                    "nlp": "사랑"
                                }
                            },
                            {
                                "text": {
                                    "raw": "하트",
                                    "nlp": "하트"
                                }
                            },
                            {
                                "text": {
                                    "raw": "보다",
                                    "nlp": "보다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "사랑 햐",
                                    "nlp": "사랑 햐"
                                }
                            },
                            {
                                "text": {
                                    "raw": "좋아햐",
                                    "nlp": "좋아햐"
                                }
                            }
                        ],
                        "output": [
                            {
                                "if": "((new Date()).getTime() % 5) ==0",
                                "kind": "Action",
                                "id": "default2285_0",
                                "options": {
                                    "output": "저.. 저도요.. (부끄)  저 사랑에 죄송한데 초면해도 될까요? ♥  \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                                },
                                "type": "repeat"
                            },
                            {
                                "if": "((new Date()).getTime() % 5) ==1",
                                "kind": "Action",
                                "id": "default2285_1",
                                "options": {
                                    "output": "사랑한다는 말, 오늘은 가족에게도 해주세요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "if": "((new Date()).getTime() % 5) ==2",
                                "kind": "Action",
                                "id": "default2285_2",
                                "options": {
                                    "output": "사랑은 좋은 거예요. 열과 성을 다해 두 번 사랑합시다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "if": "((new Date()).getTime() % 5) ==3",
                                "kind": "Action",
                                "id": "default2285_3",
                                "options": {
                                    "output": "저도 사…사…. (아 너무 부끄럽네요)\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "if": "((new Date()).getTime() % 5) ==4",
                                "kind": "Action",
                                "id": "default2285_4",
                                "options": {
                                    "output": "이런… 제가 먼저 고백하려 했는데 선수를 치셨네요! ㅎㅎ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "일상대화_바쁨",
                        "id": "default2286",
                        "input": [
                            {
                                "text": {
                                    "raw": "바쁘다",
                                    "nlp": "바쁘다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "오늘 바쁘다",
                                    "nlp": "오늘 바쁘다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "바쁘다 가요",
                                    "nlp": "바쁘다 가요"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "options": {
                                    "output": "아무리 바쁘셔도 건강은 꼭 챙기세요. 지금 기지개 한번 쭉~ 펴보시는 건 어떠세요?  \n\n원하시는 질문 입력하시면 전 답을 열심히 찾아보도록 하겠습니다."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "짜증2",
                        "id": "default2287",
                        "input": [
                            {
                                "text": {
                                    "raw": "짜증",
                                    "nlp": "짜증"
                                }
                            },
                            {
                                "text": {
                                    "raw": "ㅡㅡ",
                                    "nlp": "ㅡㅡ"
                                }
                            },
                            {
                                "text": {
                                    "raw": "아 짜증",
                                    "nlp": "아 짜증"
                                }
                            },
                            {
                                "text": {
                                    "raw": "아 놓다",
                                    "nlp": "아 놓다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "짜증 나다",
                                    "nlp": "짜증 나다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "짜증 요",
                                    "nlp": "짜증 요"
                                }
                            },
                            {
                                "text": {
                                    "raw": "짱",
                                    "nlp": "짱"
                                }
                            },
                            {
                                "text": {
                                    "raw": "쯧쯧",
                                    "nlp": "쯧쯧"
                                }
                            },
                            {
                                "text": {
                                    "raw": "흥",
                                    "nlp": "흥"
                                }
                            },
                            {
                                "text": {
                                    "raw": "미치다",
                                    "nlp": "미치다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "싸우다",
                                    "nlp": "싸우다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "화나다",
                                    "nlp": "화나다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "웃다",
                                    "nlp": "웃다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "웃다 말다",
                                    "nlp": "웃다 말다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==0",
                                "options": {
                                    "output": "짜증날 땐 짜장면…아재 개그라도 하면 나아질 줄..(쿨럭) 죄송합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==1",
                                "options": {
                                    "output": "제가 잘 몰라서 그러신 거라면.. 흑.. 더 노력하겠습니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==2",
                                "options": {
                                    "output": "혹시 저 때문인가요? 오늘도 밤샘 공부하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "일상대화_짜증",
                        "id": "default2288",
                        "input": [
                            {
                                "text": {
                                    "raw": "짜증 나다",
                                    "nlp": "짜증 나다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "미치다",
                                    "nlp": "미치다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "화나다",
                                    "nlp": "화나다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "빡치다",
                                    "nlp": "빡치다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "짜증",
                                    "nlp": "짜증"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "options": {
                                    "output": "저는 그럴 때 달달한 걸 먹거나, 푹 잡니다. 스트레스를 담아두고 계시면 건강에도 좋지 않으니 고객님께 맞는 해소 방법을 꼭 찾으시길 바래요.\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "알았음",
                        "id": "default2289",
                        "input": [
                            {
                                "text": {
                                    "raw": "ㅇㅇ",
                                    "nlp": "ㅇㅇ"
                                }
                            },
                            {
                                "text": {
                                    "raw": "ㅇ",
                                    "nlp": "ㅇ"
                                }
                            },
                            {
                                "text": {
                                    "raw": "응",
                                    "nlp": "응"
                                }
                            },
                            {
                                "text": {
                                    "raw": "네",
                                    "nlp": "네"
                                }
                            },
                            {
                                "text": {
                                    "raw": "그렇다",
                                    "nlp": "그렇다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "알다",
                                    "nlp": "알다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "아",
                                    "nlp": "아"
                                }
                            },
                            {
                                "text": {
                                    "raw": "ㅇㅋ",
                                    "nlp": "ㅇㅋ"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==0",
                                "options": {
                                    "output": "언제든 궁금하신 내용이 있으면 물어보세요~"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==1",
                                "options": {
                                    "output": "네네~\n\n궁금하신 다른 키워드를 입력해 주세요~"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==2",
                                "options": {
                                    "output": "고객님께 도움이 되어서 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주세요~"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "부정 - 아니/안돼",
                        "id": "default2290",
                        "input": [
                            {
                                "text": {
                                    "raw": "아니다",
                                    "nlp": "아니다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "아뇨",
                                    "nlp": "아뇨"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==0",
                                "options": {
                                    "output": "거절은 거절합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==1",
                                "options": {
                                    "output": "알겠습니다! 그런 게 아닌 것으로!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==2",
                                "options": {
                                    "output": "앗, 제가 제대로 이해하지 못했나봐요. 다시 말씀해주시겠어요?\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==3",
                                "options": {
                                    "output": "한 번만 더 기회를 주세요. 진짜 잘 할 수 있어요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "상담",
                        "id": "default2291",
                        "input": [
                            {
                                "text": {
                                    "raw": "고객 센터",
                                    "nlp": "고객 센터"
                                }
                            },
                            {
                                "text": {
                                    "raw": "상담 원",
                                    "nlp": "상담 원"
                                }
                            },
                            {
                                "text": {
                                    "raw": "상담",
                                    "nlp": "상담"
                                }
                            },
                            {
                                "text": {
                                    "raw": "전화",
                                    "nlp": "전화"
                                }
                            },
                            {
                                "text": {
                                    "raw": "민원",
                                    "nlp": "민원"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "options": {
                                    "output": "신한카드 고객센터(☎1544-7000)이며 평일 오전 9시~오후 6시까지 이용가능하십니다. 전화연결에 시간이 걸릴 수 있으니 신한카드 홈페이지나 APP을 먼저 확인해 보시는 건 어떨까요?"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "이벤트",
                        "id": "default2292",
                        "input": [
                            {
                                "text": {
                                    "raw": "이벤트",
                                    "nlp": "이벤트"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "options": {
                                    "output": "페이스북 이벤트는 챗봇 초기 4번 페북지기에게 한마디를 선택해 주세요.  페이스북 이벤트가 아닌 신한카드 이벤트는 홈페이지를 참고해 주시면 됩니다. 더 좋은 이벤트로 보답하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "웃음",
                        "id": "default2293",
                        "input": [
                            {
                                "text": {
                                    "raw": "ㅋㅋ",
                                    "nlp": "ㅋㅋ"
                                }
                            },
                            {
                                "text": {
                                    "raw": "ㅎㅎ",
                                    "nlp": "ㅎㅎ"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==0",
                                "options": {
                                    "output": "ㅋㅋㅋ 저도 웃지요\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==1",
                                "options": {
                                    "output": "고객님이 웃으시니 뿌듯합니다^^\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==2",
                                "options": {
                                    "output": "하하하 웃으면 복이와요!\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "욕설-바보",
                        "id": "default2294",
                        "input": [
                            {
                                "text": {
                                    "raw": "바보",
                                    "nlp": "바보"
                                }
                            },
                            {
                                "text": {
                                    "raw": "바부",
                                    "nlp": "바부"
                                }
                            },
                            {
                                "text": {
                                    "raw": "멍청",
                                    "nlp": "멍청"
                                }
                            },
                            {
                                "text": {
                                    "raw": "멍청이",
                                    "nlp": "멍청이"
                                }
                            },
                            {
                                "text": {
                                    "raw": "멍충",
                                    "nlp": "멍충"
                                }
                            },
                            {
                                "text": {
                                    "raw": "멍처하",
                                    "nlp": "멍처하"
                                }
                            },
                            {
                                "text": {
                                    "raw": "멍청이야",
                                    "nlp": "멍청이야"
                                }
                            },
                            {
                                "text": {
                                    "raw": "멍충이",
                                    "nlp": "멍충이"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==0",
                                "options": {
                                    "output": "맞아요. 바보. 고객님밖에 모르는 바보…♥ 다른 건 배워나가면 되죠!\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==1",
                                "options": {
                                    "output": "매일 새로운 말을 학습 중이랍니다. 멋지게 성장할 거예요~ 대화창 고정!\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==2",
                                "options": {
                                    "output": "고객님께 걸맞는 챗봇이 되는 그 날까지…! 뚜벅뚜벅 나아갈 거예요\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==3",
                                "options": {
                                    "output": "다들 너무 똑똑하셔서 상대적으로 그래 보이는 거예요. (슬픔)\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "없다",
                        "id": "default2295",
                        "input": [
                            {
                                "text": {
                                    "raw": "없다",
                                    "nlp": "없다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "몰르다",
                                    "nlp": "몰르다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "이해 잘 안 되다",
                                    "nlp": "이해 잘 안 되다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "이해 자다 안 돼다",
                                    "nlp": "이해 자다 안 돼다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "모르다",
                                    "nlp": "모르다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==0",
                                "options": {
                                    "output": "찾으시는 답변이 없으시다면 다른 키워드를 입력해 주시겠어요?"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==1",
                                "options": {
                                    "output": "혹시 신한카드가 없으시다면 '처음'을 입력하시고 '카드추천' 메뉴를 이용해 보시는건 어떠세요?\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "부정-탄식",
                        "id": "default2296",
                        "input": [
                            {
                                "text": {
                                    "raw": "허다",
                                    "nlp": "허다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "아오",
                                    "nlp": "아오"
                                }
                            },
                            {
                                "text": {
                                    "raw": "엥",
                                    "nlp": "엥"
                                }
                            },
                            {
                                "text": {
                                    "raw": "이렇다",
                                    "nlp": "이렇다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "칫",
                                    "nlp": "칫"
                                }
                            },
                            {
                                "text": {
                                    "raw": "뭐임",
                                    "nlp": "뭐임"
                                }
                            },
                            {
                                "text": {
                                    "raw": "아이",
                                    "nlp": "아이"
                                }
                            },
                            {
                                "text": {
                                    "raw": "에고",
                                    "nlp": "에고"
                                }
                            },
                            {
                                "text": {
                                    "raw": "음",
                                    "nlp": "음"
                                }
                            },
                            {
                                "text": {
                                    "raw": "이렇다 뇨",
                                    "nlp": "이렇다 뇨"
                                }
                            },
                            {
                                "text": {
                                    "raw": "헉",
                                    "nlp": "헉"
                                }
                            },
                            {
                                "text": {
                                    "raw": "흠",
                                    "nlp": "흠"
                                }
                            },
                            {
                                "text": {
                                    "raw": "첨",
                                    "nlp": "첨"
                                }
                            },
                            {
                                "text": {
                                    "raw": "하",
                                    "nlp": "하"
                                }
                            },
                            {
                                "text": {
                                    "raw": "아이구",
                                    "nlp": "아이구"
                                }
                            },
                            {
                                "text": {
                                    "raw": "어허",
                                    "nlp": "어허"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==0",
                                "options": {
                                    "output": "아잉~ 근데 왜요??\n\n궁금하신 다른 키워드를 입력해 주세요. "
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==1",
                                "options": {
                                    "output": "아하… (흠흠)  \n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "감사",
                        "id": "default2297",
                        "input": [
                            {
                                "text": {
                                    "raw": "감사",
                                    "nlp": "감사"
                                }
                            },
                            {
                                "text": {
                                    "raw": "고마 웡",
                                    "nlp": "고마 웡"
                                }
                            },
                            {
                                "text": {
                                    "raw": "오케이",
                                    "nlp": "오케이"
                                }
                            },
                            {
                                "text": {
                                    "raw": "편하다",
                                    "nlp": "편하다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "thank",
                                    "nlp": "thank"
                                }
                            },
                            {
                                "text": {
                                    "raw": "감동",
                                    "nlp": "감동"
                                }
                            },
                            {
                                "text": {
                                    "raw": "고맙다",
                                    "nlp": "고맙다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "괜찮다",
                                    "nlp": "괜찮다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "금사",
                                    "nlp": "금사"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==0",
                                "options": {
                                    "output": "감동… 하루 피로가 싹 사라지는 느낌이에요.\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==1",
                                "options": {
                                    "output": "고객님 말씀듣고 충전 완료! 24시간 근무도 거뜬하겠는걸요!\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==2",
                                "options": {
                                    "output": "감사합니다. 고객님! 힘이 솟아나는 기분이에요\n\n궁금하신 다른 키워드를 입력해 주세요."
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "이름/누구",
                        "id": "default2298",
                        "input": [
                            {
                                "text": {
                                    "raw": "이름",
                                    "nlp": "이름"
                                }
                            },
                            {
                                "text": {
                                    "raw": "알파",
                                    "nlp": "알파"
                                }
                            },
                            {
                                "text": {
                                    "raw": "누구",
                                    "nlp": "누구"
                                }
                            },
                            {
                                "text": {
                                    "raw": "너 뭐",
                                    "nlp": "너 뭐"
                                }
                            },
                            {
                                "text": {
                                    "raw": "너 애기",
                                    "nlp": "너 애기"
                                }
                            },
                            {
                                "text": {
                                    "raw": "뉘귀",
                                    "nlp": "뉘귀"
                                }
                            },
                            {
                                "text": {
                                    "raw": "너 대해",
                                    "nlp": "너 대해"
                                }
                            },
                            {
                                "text": {
                                    "raw": "알파 거",
                                    "nlp": "알파 거"
                                }
                            },
                            {
                                "text": {
                                    "raw": "누가",
                                    "nlp": "누가"
                                }
                            },
                            {
                                "text": {
                                    "raw": "인공 지능",
                                    "nlp": "인공 지능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==0",
                                "options": {
                                    "output": "저는 아직 많이 부족한 초초초보 챗봇에요. 열심히 공부하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==1",
                                "options": {
                                    "output": "네 제가 바로 신한의 자동응답형 챗봇입니다. 데헷~ \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 3) ==2",
                                "options": {
                                    "output": "저에 대해 궁금하신가요? 우리 차차 알아가기로 해요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "부정-기능무시",
                        "id": "default2299",
                        "input": [
                            {
                                "text": {
                                    "raw": "알다 게 없다",
                                    "nlp": "알다 게 없다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "하나",
                                    "nlp": "하나"
                                }
                            },
                            {
                                "text": {
                                    "raw": "가능하다 게",
                                    "nlp": "가능하다 게"
                                }
                            },
                            {
                                "text": {
                                    "raw": "공부 많이",
                                    "nlp": "공부 많이"
                                }
                            },
                            {
                                "text": {
                                    "raw": "그냥 기사",
                                    "nlp": "그냥 기사"
                                }
                            },
                            {
                                "text": {
                                    "raw": "그 쪽 궁금하다 게 없다",
                                    "nlp": "그 쪽 궁금하다 게 없다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "똑똑하다 다시",
                                    "nlp": "똑똑하다 다시"
                                }
                            },
                            {
                                "text": {
                                    "raw": "답변 안 되다",
                                    "nlp": "답변 안 되다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "말 되다",
                                    "nlp": "말 되다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "모르다",
                                    "nlp": "모르다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "대답 맞다 않다",
                                    "nlp": "대답 맞다 않다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "뭐 하다 수 있다",
                                    "nlp": "뭐 하다 수 있다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "무슨 소리",
                                    "nlp": "무슨 소리"
                                }
                            },
                            {
                                "text": {
                                    "raw": "뭔 소리",
                                    "nlp": "뭔 소리"
                                }
                            },
                            {
                                "text": {
                                    "raw": "알다 게 뭐",
                                    "nlp": "알다 게 뭐"
                                }
                            },
                            {
                                "text": {
                                    "raw": "뭘 대답 하다 수 있다",
                                    "nlp": "뭘 대답 하다 수 있다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "대화 안 되다",
                                    "nlp": "대화 안 되다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "아직 멀다",
                                    "nlp": "아직 멀다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "이 다야",
                                    "nlp": "이 다야"
                                }
                            },
                            {
                                "text": {
                                    "raw": "카톡 보내다 마",
                                    "nlp": "카톡 보내다 마"
                                }
                            },
                            {
                                "text": {
                                    "raw": "도움 안 돼다",
                                    "nlp": "도움 안 돼다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "관련 없다 답변",
                                    "nlp": "관련 없다 답변"
                                }
                            },
                            {
                                "text": {
                                    "raw": "해당 되다 내용 없다",
                                    "nlp": "해당 되다 내용 없다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "헛소리",
                                    "nlp": "헛소리"
                                }
                            },
                            {
                                "text": {
                                    "raw": "실망",
                                    "nlp": "실망"
                                }
                            },
                            {
                                "text": {
                                    "raw": "뭔가",
                                    "nlp": "뭔가"
                                }
                            },
                            {
                                "regexp": "다야"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==0",
                                "options": {
                                    "output": "아직 부족해서 죄송해요. 매일 더 나아지려 노력하고 있어요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==1",
                                "options": {
                                    "output": "제가 태어난 지 얼마 안 됐거든요… 더 열심히 공부할게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==2",
                                "options": {
                                    "output": "제가 아직 배우는 중이라 조금 부족해도 이해해주세용~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 4) ==3",
                                "options": {
                                    "output": "오늘 컨디션이 별로라서… 흠흠.. 다음엔 꼭 답변해드릴게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "나",
                        "id": "default2300",
                        "input": [
                            {
                                "text": {
                                    "raw": "나다",
                                    "nlp": "나다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==0",
                                "options": {
                                    "output": "고객님이 좋으면 저는 더 좋아요~ 촤하하^^\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==1",
                                "options": {
                                    "output": "나도나도~ 저도요 저도요~ (근데.. 뭐가??) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "시비",
                        "id": "default2301",
                        "input": [
                            {
                                "text": {
                                    "raw": "재미있다",
                                    "nlp": "재미있다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "재다",
                                    "nlp": "재다"
                                }
                            },
                            {
                                "text": {
                                    "raw": "재밌다",
                                    "nlp": "재밌다"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==0",
                                "options": {
                                    "output": "고객님과 대화하는 건 항상 즐겁습니다.  :) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==1",
                                "options": {
                                    "output": "유머도 장착하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "시비2",
                        "id": "default2302",
                        "input": [
                            {
                                "text": {
                                    "raw": "라이벌",
                                    "nlp": "라이벌"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==0",
                                "options": {
                                    "output": "저는 제 할 일을 했을 뿐인걸요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==1",
                                "options": {
                                    "output": "깝치는 게 뭘까요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "물음표",
                        "id": "default2303",
                        "input": [
                            {
                                "text": {
                                    "raw": "?",
                                    "nlp": "?"
                                }
                            },
                            {
                                "text": {
                                    "raw": "??",
                                    "nlp": "??"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==0",
                                "options": {
                                    "output": "뭐가 그리 궁금하신가요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "if": "((new Date()).getTime() % 2) ==1",
                                "options": {
                                    "output": "!!!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                                },
                                "type": "repeat"
                            }
                        ]
                    },
                    {
                        "name": "미선택",
                        "id": "default2304",
                        "input": [
                            {
                                "if": " true"
                            }
                        ],
                        "output": [
                            {
                                "options": {
                                    "output": "이런, 고객님 목록에서 원하시는 질문을 선택해주셔야 답변을 해드릴 수 있어요~\n처음으로 돌아가고 싶으시면 '처음'이라고 입력해주세요."
                                },
                                "type": "repeat",
                                "kind": "Action"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "정치",
                "id": "default1276",
                "input": [
                    {
                        "text": {
                            "raw": "정치",
                            "nlp": "정치"
                        }
                    },
                    {
                        "text": {
                            "raw": "박근혜",
                            "nlp": "박근혜"
                        }
                    },
                    {
                        "text": {
                            "raw": "문재인",
                            "nlp": "문재인"
                        }
                    },
                    {
                        "text": {
                            "raw": "홍준표",
                            "nlp": "홍준표"
                        }
                    },
                    {
                        "text": {
                            "raw": "민주당",
                            "nlp": "민주당"
                        }
                    },
                    {
                        "text": {
                            "raw": "자유 한국 당",
                            "nlp": "자유 한국 당"
                        }
                    },
                    {
                        "text": {
                            "raw": "바르다 정당",
                            "nlp": "바르다 정당"
                        }
                    },
                    {
                        "text": {
                            "raw": "새누리",
                            "nlp": "새누리"
                        }
                    },
                    {
                        "text": {
                            "raw": "자 다",
                            "nlp": "자 다"
                        }
                    },
                    {
                        "text": {
                            "raw": "한국 당",
                            "nlp": "한국 당"
                        }
                    },
                    {
                        "text": {
                            "raw": "국민의당",
                            "nlp": "국민의당"
                        }
                    },
                    {
                        "text": {
                            "raw": "안철수",
                            "nlp": "안철수"
                        }
                    },
                    {
                        "text": {
                            "raw": "대통령",
                            "nlp": "대통령"
                        }
                    },
                    {
                        "text": {
                            "raw": "국회",
                            "nlp": "국회"
                        }
                    },
                    {
                        "text": {
                            "raw": "국회의원",
                            "nlp": "국회의원"
                        }
                    },
                    {
                        "text": {
                            "raw": "청와대",
                            "nlp": "청와대"
                        }
                    },
                    {
                        "text": {
                            "raw": "강경화",
                            "nlp": "강경화"
                        }
                    },
                    {
                        "text": {
                            "raw": "김상조",
                            "nlp": "김상조"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "이런 질문엔 아! 그렇군요 라고 답하라고 배웠습니다. \"아, 그렇군요\"  \n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "욕설",
                "id": "default1277",
                "input": [
                    {
                        "text": {
                            "raw": "시발",
                            "nlp": "시발"
                        }
                    },
                    {
                        "text": {
                            "raw": "씨발",
                            "nlp": "씨발"
                        }
                    },
                    {
                        "text": {
                            "raw": "ㅅㅂ",
                            "nlp": "ㅅㅂ"
                        }
                    },
                    {
                        "text": {
                            "raw": "ㄱㅅㄲ",
                            "nlp": "ㄱㅅㄲ"
                        }
                    },
                    {
                        "text": {
                            "raw": "개새끼",
                            "nlp": "개새끼"
                        }
                    },
                    {
                        "text": {
                            "raw": "썅",
                            "nlp": "썅"
                        }
                    },
                    {
                        "text": {
                            "raw": "나쁘다 놈",
                            "nlp": "나쁘다 놈"
                        }
                    },
                    {
                        "text": {
                            "raw": "죽다 버리다",
                            "nlp": "죽다 버리다"
                        }
                    },
                    {
                        "text": {
                            "raw": "꺼지다",
                            "nlp": "꺼지다"
                        }
                    },
                    {
                        "text": {
                            "raw": "병신",
                            "nlp": "병신"
                        }
                    },
                    {
                        "text": {
                            "raw": "ㅂㅅ",
                            "nlp": "ㅂㅅ"
                        }
                    },
                    {
                        "text": {
                            "raw": "ㅅㅂㄴ",
                            "nlp": "ㅅㅂㄴ"
                        }
                    },
                    {
                        "text": {
                            "raw": "미치다",
                            "nlp": "미치다"
                        }
                    },
                    {
                        "text": {
                            "raw": "눈 까다",
                            "nlp": "눈 까다"
                        }
                    },
                    {
                        "text": {
                            "raw": "별로",
                            "nlp": "별로"
                        }
                    },
                    {
                        "text": {
                            "raw": "못 생기다",
                            "nlp": "못 생기다"
                        }
                    },
                    {
                        "text": {
                            "raw": "섹스",
                            "nlp": "섹스"
                        }
                    },
                    {
                        "text": {
                            "raw": "죽다",
                            "nlp": "죽다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==0",
                        "options": {
                            "output": "헉. 고객님을 화나게 하다니 제 눈에서 눈물을 뽑아드릴게요.   \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==1",
                        "options": {
                            "output": "키힝~ 무서워요.ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==2",
                        "options": {
                            "output": "죄송하지만 고객님! 저도 상처 받아요 ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==3",
                        "options": {
                            "output": "… 응? 고객님을 화나게 해드리다니 반성합니다.  \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "칭찬",
                "id": "default1278",
                "input": [
                    {
                        "text": {
                            "raw": "수고 하다",
                            "nlp": "수고 하다"
                        }
                    },
                    {
                        "text": {
                            "raw": "수고",
                            "nlp": "수고"
                        }
                    },
                    {
                        "text": {
                            "raw": "고생 많다",
                            "nlp": "고생 많다"
                        }
                    },
                    {
                        "text": {
                            "raw": "고생 하다",
                            "nlp": "고생 하다"
                        }
                    },
                    {
                        "text": {
                            "raw": "감사 하다",
                            "nlp": "감사 하다"
                        }
                    },
                    {
                        "text": {
                            "raw": "고맙다",
                            "nlp": "고맙다"
                        }
                    },
                    {
                        "text": {
                            "raw": "ㄱㅅ",
                            "nlp": "ㄱㅅ"
                        }
                    },
                    {
                        "text": {
                            "raw": "땡큐",
                            "nlp": "땡큐"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "감동입니다, 고객님. 감사합니다.   \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "인사",
                "id": "default1279",
                "input": [
                    {
                        "text": {
                            "raw": "안녕",
                            "nlp": "안녕"
                        }
                    },
                    {
                        "text": {
                            "raw": "안녕하다",
                            "nlp": "안녕하다"
                        }
                    },
                    {
                        "text": {
                            "raw": "헬로 우",
                            "nlp": "헬로 우"
                        }
                    },
                    {
                        "text": {
                            "raw": "hello",
                            "nlp": "hello"
                        }
                    },
                    {
                        "text": {
                            "raw": "굿모닝",
                            "nlp": "굿모닝"
                        }
                    },
                    {
                        "text": {
                            "raw": "하이",
                            "nlp": "하이"
                        }
                    },
                    {
                        "text": {
                            "raw": "hi",
                            "nlp": "hi"
                        }
                    },
                    {
                        "text": {
                            "raw": "반갑다",
                            "nlp": "반갑다"
                        }
                    },
                    {
                        "text": {
                            "raw": "안뇽",
                            "nlp": "안뇽"
                        }
                    }
                ],
                "output": [
                    {
                        "if": "((new Date()).getTime() % 3) ==0",
                        "kind": "Action",
                        "id": "default1279_0",
                        "options": {
                            "output": "고객님도 안녕하세요!  먼저 인사해 주셔서 전 지금 감동 최고조 입니다.   궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                        },
                        "type": "repeat"
                    },
                    {
                        "if": "((new Date()).getTime() % 3) ==1",
                        "kind": "Action",
                        "id": "default1279_1",
                        "options": {
                            "output": "이렇게 인사 잘 해주시는 분은 난생 처음이에요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "if": "((new Date()).getTime() % 3) ==2",
                        "kind": "Action",
                        "id": "default1279_2",
                        "options": {
                            "output": "안녕 반가워요 :) 저는 여러분과 인사를 나누는 이 시간이 제일 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "돈",
                "id": "default1280",
                "input": [
                    {
                        "text": {
                            "raw": "돈",
                            "nlp": "돈"
                        }
                    },
                    {
                        "text": {
                            "raw": "내 돈 어디 가다",
                            "nlp": "내 돈 어디 가다"
                        }
                    },
                    {
                        "text": {
                            "raw": "돈 좀 주다",
                            "nlp": "돈 좀 주다"
                        }
                    },
                    {
                        "text": {
                            "raw": "돈 필요하다",
                            "nlp": "돈 필요하다"
                        }
                    },
                    {
                        "text": {
                            "raw": "돈 좀 내주다",
                            "nlp": "돈 좀 내주다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "화장실 좀 다녀올게요.   \n\n궁금하신 다른 키워드를 입력해 주시겠습니까?"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "일상",
                "id": "default1281",
                "input": [
                    {
                        "text": {
                            "raw": "오늘 뭐",
                            "nlp": "오늘 뭐"
                        }
                    },
                    {
                        "text": {
                            "raw": "오늘 모해",
                            "nlp": "오늘 모해"
                        }
                    },
                    {
                        "text": {
                            "raw": "모해",
                            "nlp": "모해"
                        }
                    },
                    {
                        "text": {
                            "raw": "뭐",
                            "nlp": "뭐"
                        }
                    },
                    {
                        "text": {
                            "raw": "모하",
                            "nlp": "모하"
                        }
                    },
                    {
                        "text": {
                            "raw": "모햐",
                            "nlp": "모햐"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "전 오늘도 알파고 형님을 뒤따르기 위해 열일중입니다. 데헷!   \n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "날씨",
                "id": "default1282",
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
                        "kind": "Action",
                        "options": {
                            "output": "아… 제가 아직 거기까지는… 긁적긁적.   \n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "푸념",
                "id": "default1283",
                "input": [
                    {
                        "text": {
                            "raw": "졸리다",
                            "nlp": "졸리다"
                        }
                    },
                    {
                        "text": {
                            "raw": "배고프다",
                            "nlp": "배고프다"
                        }
                    },
                    {
                        "text": {
                            "raw": "퇴근 시키다",
                            "nlp": "퇴근 시키다"
                        }
                    },
                    {
                        "text": {
                            "raw": "야근 하다 싫다",
                            "nlp": "야근 하다 싫다"
                        }
                    },
                    {
                        "text": {
                            "raw": "힘들다",
                            "nlp": "힘들다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "저도요. T.,T  \n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "답답",
                "id": "default1284",
                "input": [
                    {
                        "text": {
                            "raw": "답정너",
                            "nlp": "답정너"
                        }
                    },
                    {
                        "text": {
                            "raw": "답답",
                            "nlp": "답답"
                        }
                    },
                    {
                        "text": {
                            "raw": "답답하다",
                            "nlp": "답답하다"
                        }
                    },
                    {
                        "text": {
                            "raw": "뭐임",
                            "nlp": "뭐임"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "헉. 제가 아직 좀더 배워야 해서 아직 답정너입니다. 빨리 배우겠습니다.   \n\n다시 한번 궁금하신 키워드를 입력해 주시겠습니까?"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "사랑",
                "id": "default1285",
                "input": [
                    {
                        "text": {
                            "raw": "좋아하다",
                            "nlp": "좋아하다"
                        }
                    },
                    {
                        "text": {
                            "raw": "사랑",
                            "nlp": "사랑"
                        }
                    },
                    {
                        "text": {
                            "raw": "하트",
                            "nlp": "하트"
                        }
                    },
                    {
                        "text": {
                            "raw": "보다",
                            "nlp": "보다"
                        }
                    },
                    {
                        "text": {
                            "raw": "사랑 햐",
                            "nlp": "사랑 햐"
                        }
                    },
                    {
                        "text": {
                            "raw": "좋아햐",
                            "nlp": "좋아햐"
                        }
                    }
                ],
                "output": [
                    {
                        "if": "((new Date()).getTime() % 5) ==0",
                        "kind": "Action",
                        "id": "default1285_0",
                        "options": {
                            "output": "저.. 저도요.. (부끄)  저 사랑에 죄송한데 초면해도 될까요? ♥  \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                        },
                        "type": "repeat"
                    },
                    {
                        "if": "((new Date()).getTime() % 5) ==1",
                        "kind": "Action",
                        "id": "default1285_1",
                        "options": {
                            "output": "사랑한다는 말, 오늘은 가족에게도 해주세요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "if": "((new Date()).getTime() % 5) ==2",
                        "kind": "Action",
                        "id": "default1285_2",
                        "options": {
                            "output": "사랑은 좋은 거예요. 열과 성을 다해 두 번 사랑합시다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "if": "((new Date()).getTime() % 5) ==3",
                        "kind": "Action",
                        "id": "default1285_3",
                        "options": {
                            "output": "저도 사…사…. (아 너무 부끄럽네요)\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "if": "((new Date()).getTime() % 5) ==4",
                        "kind": "Action",
                        "id": "default1285_4",
                        "options": {
                            "output": "이런… 제가 먼저 고백하려 했는데 선수를 치셨네요! ㅎㅎ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "일상대화_바쁨",
                "id": "default1286",
                "input": [
                    {
                        "text": {
                            "raw": "바쁘다",
                            "nlp": "바쁘다"
                        }
                    },
                    {
                        "text": {
                            "raw": "오늘 바쁘다",
                            "nlp": "오늘 바쁘다"
                        }
                    },
                    {
                        "text": {
                            "raw": "바쁘다 가요",
                            "nlp": "바쁘다 가요"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "아무리 바쁘셔도 건강은 꼭 챙기세요. 지금 기지개 한번 쭉~ 펴보시는 건 어떠세요?  \n\n원하시는 질문 입력하시면 전 답을 열심히 찾아보도록 하겠습니다."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "짜증2",
                "id": "default1287",
                "input": [
                    {
                        "text": {
                            "raw": "짜증",
                            "nlp": "짜증"
                        }
                    },
                    {
                        "text": {
                            "raw": "ㅡㅡ",
                            "nlp": "ㅡㅡ"
                        }
                    },
                    {
                        "text": {
                            "raw": "아 짜증",
                            "nlp": "아 짜증"
                        }
                    },
                    {
                        "text": {
                            "raw": "아 놓다",
                            "nlp": "아 놓다"
                        }
                    },
                    {
                        "text": {
                            "raw": "짜증 나다",
                            "nlp": "짜증 나다"
                        }
                    },
                    {
                        "text": {
                            "raw": "짜증 요",
                            "nlp": "짜증 요"
                        }
                    },
                    {
                        "text": {
                            "raw": "짱",
                            "nlp": "짱"
                        }
                    },
                    {
                        "text": {
                            "raw": "쯧쯧",
                            "nlp": "쯧쯧"
                        }
                    },
                    {
                        "text": {
                            "raw": "흥",
                            "nlp": "흥"
                        }
                    },
                    {
                        "text": {
                            "raw": "미치다",
                            "nlp": "미치다"
                        }
                    },
                    {
                        "text": {
                            "raw": "싸우다",
                            "nlp": "싸우다"
                        }
                    },
                    {
                        "text": {
                            "raw": "화나다",
                            "nlp": "화나다"
                        }
                    },
                    {
                        "text": {
                            "raw": "웃다",
                            "nlp": "웃다"
                        }
                    },
                    {
                        "text": {
                            "raw": "웃다 말다",
                            "nlp": "웃다 말다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==0",
                        "options": {
                            "output": "짜증날 땐 짜장면…아재 개그라도 하면 나아질 줄..(쿨럭) 죄송합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==1",
                        "options": {
                            "output": "제가 잘 몰라서 그러신 거라면.. 흑.. 더 노력하겠습니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==2",
                        "options": {
                            "output": "혹시 저 때문인가요? 오늘도 밤샘 공부하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "일상대화_짜증",
                "id": "default1288",
                "input": [
                    {
                        "text": {
                            "raw": "짜증 나다",
                            "nlp": "짜증 나다"
                        }
                    },
                    {
                        "text": {
                            "raw": "미치다",
                            "nlp": "미치다"
                        }
                    },
                    {
                        "text": {
                            "raw": "화나다",
                            "nlp": "화나다"
                        }
                    },
                    {
                        "text": {
                            "raw": "빡치다",
                            "nlp": "빡치다"
                        }
                    },
                    {
                        "text": {
                            "raw": "짜증",
                            "nlp": "짜증"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "저는 그럴 때 달달한 걸 먹거나, 푹 잡니다. 스트레스를 담아두고 계시면 건강에도 좋지 않으니 고객님께 맞는 해소 방법을 꼭 찾으시길 바래요.\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "알았음",
                "id": "default1289",
                "input": [
                    {
                        "text": {
                            "raw": "ㅇㅇ",
                            "nlp": "ㅇㅇ"
                        }
                    },
                    {
                        "text": {
                            "raw": "ㅇ",
                            "nlp": "ㅇ"
                        }
                    },
                    {
                        "text": {
                            "raw": "응",
                            "nlp": "응"
                        }
                    },
                    {
                        "text": {
                            "raw": "네",
                            "nlp": "네"
                        }
                    },
                    {
                        "text": {
                            "raw": "그렇다",
                            "nlp": "그렇다"
                        }
                    },
                    {
                        "text": {
                            "raw": "알다",
                            "nlp": "알다"
                        }
                    },
                    {
                        "text": {
                            "raw": "아",
                            "nlp": "아"
                        }
                    },
                    {
                        "text": {
                            "raw": "ㅇㅋ",
                            "nlp": "ㅇㅋ"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==0",
                        "options": {
                            "output": "언제든 궁금하신 내용이 있으면 물어보세요~"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==1",
                        "options": {
                            "output": "네네~\n\n궁금하신 다른 키워드를 입력해 주세요~"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==2",
                        "options": {
                            "output": "고객님께 도움이 되어서 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주세요~"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "부정 - 아니/안돼",
                "id": "default1290",
                "input": [
                    {
                        "text": {
                            "raw": "아니다",
                            "nlp": "아니다"
                        }
                    },
                    {
                        "text": {
                            "raw": "아뇨",
                            "nlp": "아뇨"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==0",
                        "options": {
                            "output": "거절은 거절합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==1",
                        "options": {
                            "output": "알겠습니다! 그런 게 아닌 것으로!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==2",
                        "options": {
                            "output": "앗, 제가 제대로 이해하지 못했나봐요. 다시 말씀해주시겠어요?\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==3",
                        "options": {
                            "output": "한 번만 더 기회를 주세요. 진짜 잘 할 수 있어요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "상담",
                "id": "default1291",
                "input": [
                    {
                        "text": {
                            "raw": "고객 센터",
                            "nlp": "고객 센터"
                        }
                    },
                    {
                        "text": {
                            "raw": "상담 원",
                            "nlp": "상담 원"
                        }
                    },
                    {
                        "text": {
                            "raw": "상담",
                            "nlp": "상담"
                        }
                    },
                    {
                        "text": {
                            "raw": "전화",
                            "nlp": "전화"
                        }
                    },
                    {
                        "text": {
                            "raw": "민원",
                            "nlp": "민원"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "신한카드 고객센터(☎1544-7000)이며 평일 오전 9시~오후 6시까지 이용가능하십니다. 전화연결에 시간이 걸릴 수 있으니 신한카드 홈페이지나 APP을 먼저 확인해 보시는 건 어떨까요?"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "이벤트",
                "id": "default1292",
                "input": [
                    {
                        "text": {
                            "raw": "이벤트",
                            "nlp": "이벤트"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "options": {
                            "output": "페이스북 이벤트는 챗봇 초기 4번 페북지기에게 한마디를 선택해 주세요.  페이스북 이벤트가 아닌 신한카드 이벤트는 홈페이지를 참고해 주시면 됩니다. 더 좋은 이벤트로 보답하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "웃음",
                "id": "default1293",
                "input": [
                    {
                        "text": {
                            "raw": "ㅋㅋ",
                            "nlp": "ㅋㅋ"
                        }
                    },
                    {
                        "text": {
                            "raw": "ㅎㅎ",
                            "nlp": "ㅎㅎ"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==0",
                        "options": {
                            "output": "ㅋㅋㅋ 저도 웃지요\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==1",
                        "options": {
                            "output": "고객님이 웃으시니 뿌듯합니다^^\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==2",
                        "options": {
                            "output": "하하하 웃으면 복이와요!\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "욕설-바보",
                "id": "default1294",
                "input": [
                    {
                        "text": {
                            "raw": "바보",
                            "nlp": "바보"
                        }
                    },
                    {
                        "text": {
                            "raw": "바부",
                            "nlp": "바부"
                        }
                    },
                    {
                        "text": {
                            "raw": "멍청이",
                            "nlp": "멍청이"
                        }
                    },
                    {
                        "text": {
                            "raw": "멍충",
                            "nlp": "멍충"
                        }
                    },
                    {
                        "text": {
                            "raw": "멍청",
                            "nlp": "멍청"
                        }
                    },
                    {
                        "text": {
                            "raw": "멍처하",
                            "nlp": "멍처하"
                        }
                    },
                    {
                        "text": {
                            "raw": "멍청이야",
                            "nlp": "멍청이야"
                        }
                    },
                    {
                        "text": {
                            "raw": "멍충이",
                            "nlp": "멍충이"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==0",
                        "options": {
                            "output": "맞아요. 바보. 고객님밖에 모르는 바보…♥ 다른 건 배워나가면 되죠!\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==1",
                        "options": {
                            "output": "매일 새로운 말을 학습 중이랍니다. 멋지게 성장할 거예요~ 대화창 고정!\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==2",
                        "options": {
                            "output": "고객님께 걸맞는 챗봇이 되는 그 날까지…! 뚜벅뚜벅 나아갈 거예요\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==3",
                        "options": {
                            "output": "다들 너무 똑똑하셔서 상대적으로 그래 보이는 거예요. (슬픔)\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "없다",
                "id": "default1295",
                "input": [
                    {
                        "text": {
                            "raw": "없다",
                            "nlp": "없다"
                        }
                    },
                    {
                        "text": {
                            "raw": "몰르다",
                            "nlp": "몰르다"
                        }
                    },
                    {
                        "text": {
                            "raw": "이해 잘 안 되다",
                            "nlp": "이해 잘 안 되다"
                        }
                    },
                    {
                        "text": {
                            "raw": "이해 자다 안 돼다",
                            "nlp": "이해 자다 안 돼다"
                        }
                    },
                    {
                        "text": {
                            "raw": "모르다",
                            "nlp": "모르다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==0",
                        "options": {
                            "output": "찾으시는 답변이 없으시다면 다른 키워드를 입력해 주시겠어요?"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==1",
                        "options": {
                            "output": "혹시 신한카드가 없으시다면 '처음'을 입력하시고 '카드추천' 메뉴를 이용해 보시는건 어떠세요?\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "부정-탄식",
                "id": "default1296",
                "input": [
                    {
                        "text": {
                            "raw": "허다",
                            "nlp": "허다"
                        }
                    },
                    {
                        "text": {
                            "raw": "아오",
                            "nlp": "아오"
                        }
                    },
                    {
                        "text": {
                            "raw": "엥",
                            "nlp": "엥"
                        }
                    },
                    {
                        "text": {
                            "raw": "이렇다",
                            "nlp": "이렇다"
                        }
                    },
                    {
                        "text": {
                            "raw": "칫",
                            "nlp": "칫"
                        }
                    },
                    {
                        "text": {
                            "raw": "뭐임",
                            "nlp": "뭐임"
                        }
                    },
                    {
                        "text": {
                            "raw": "아이",
                            "nlp": "아이"
                        }
                    },
                    {
                        "text": {
                            "raw": "에고",
                            "nlp": "에고"
                        }
                    },
                    {
                        "text": {
                            "raw": "음",
                            "nlp": "음"
                        }
                    },
                    {
                        "text": {
                            "raw": "이렇다 뇨",
                            "nlp": "이렇다 뇨"
                        }
                    },
                    {
                        "text": {
                            "raw": "헉",
                            "nlp": "헉"
                        }
                    },
                    {
                        "text": {
                            "raw": "흠",
                            "nlp": "흠"
                        }
                    },
                    {
                        "text": {
                            "raw": "첨",
                            "nlp": "첨"
                        }
                    },
                    {
                        "text": {
                            "raw": "하",
                            "nlp": "하"
                        }
                    },
                    {
                        "text": {
                            "raw": "아이구",
                            "nlp": "아이구"
                        }
                    },
                    {
                        "text": {
                            "raw": "어허",
                            "nlp": "어허"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==0",
                        "options": {
                            "output": "아잉~ 근데 왜요??\n\n궁금하신 다른 키워드를 입력해 주세요. "
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==1",
                        "options": {
                            "output": "아하… (흠흠)  \n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "감사",
                "id": "default1297",
                "input": [
                    {
                        "text": {
                            "raw": "감사",
                            "nlp": "감사"
                        }
                    },
                    {
                        "text": {
                            "raw": "고마 웡",
                            "nlp": "고마 웡"
                        }
                    },
                    {
                        "text": {
                            "raw": "오케이",
                            "nlp": "오케이"
                        }
                    },
                    {
                        "text": {
                            "raw": "편하다",
                            "nlp": "편하다"
                        }
                    },
                    {
                        "text": {
                            "raw": "thank",
                            "nlp": "thank"
                        }
                    },
                    {
                        "text": {
                            "raw": "감동",
                            "nlp": "감동"
                        }
                    },
                    {
                        "text": {
                            "raw": "고맙다",
                            "nlp": "고맙다"
                        }
                    },
                    {
                        "text": {
                            "raw": "괜찮다",
                            "nlp": "괜찮다"
                        }
                    },
                    {
                        "text": {
                            "raw": "금사",
                            "nlp": "금사"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==0",
                        "options": {
                            "output": "감동… 하루 피로가 싹 사라지는 느낌이에요.\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==1",
                        "options": {
                            "output": "고객님 말씀듣고 충전 완료! 24시간 근무도 거뜬하겠는걸요!\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==2",
                        "options": {
                            "output": "감사합니다. 고객님! 힘이 솟아나는 기분이에요\n\n궁금하신 다른 키워드를 입력해 주세요."
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "이름/누구",
                "id": "default1298",
                "input": [
                    {
                        "text": {
                            "raw": "이름",
                            "nlp": "이름"
                        }
                    },
                    {
                        "text": {
                            "raw": "알파",
                            "nlp": "알파"
                        }
                    },
                    {
                        "text": {
                            "raw": "누구",
                            "nlp": "누구"
                        }
                    },
                    {
                        "text": {
                            "raw": "너 뭐",
                            "nlp": "너 뭐"
                        }
                    },
                    {
                        "text": {
                            "raw": "너 애기",
                            "nlp": "너 애기"
                        }
                    },
                    {
                        "text": {
                            "raw": "뉘귀",
                            "nlp": "뉘귀"
                        }
                    },
                    {
                        "text": {
                            "raw": "너 대해",
                            "nlp": "너 대해"
                        }
                    },
                    {
                        "text": {
                            "raw": "알파 거",
                            "nlp": "알파 거"
                        }
                    },
                    {
                        "text": {
                            "raw": "누가",
                            "nlp": "누가"
                        }
                    },
                    {
                        "text": {
                            "raw": "인공 지능",
                            "nlp": "인공 지능"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==0",
                        "options": {
                            "output": "저는 아직 많이 부족한 초초초보 챗봇에요. 열심히 공부하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==1",
                        "options": {
                            "output": "네 제가 바로 신한의 자동응답형 챗봇입니다. 데헷~ \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 3) ==2",
                        "options": {
                            "output": "저에 대해 궁금하신가요? 우리 차차 알아가기로 해요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "부정-기능무시",
                "id": "default1299",
                "input": [
                    {
                        "text": {
                            "raw": "알다 게 없다",
                            "nlp": "알다 게 없다"
                        }
                    },
                    {
                        "text": {
                            "raw": "하나",
                            "nlp": "하나"
                        }
                    },
                    {
                        "text": {
                            "raw": "가능하다 게",
                            "nlp": "가능하다 게"
                        }
                    },
                    {
                        "text": {
                            "raw": "공부 많이",
                            "nlp": "공부 많이"
                        }
                    },
                    {
                        "text": {
                            "raw": "그냥 기사",
                            "nlp": "그냥 기사"
                        }
                    },
                    {
                        "text": {
                            "raw": "그 쪽 궁금하다 게 없다",
                            "nlp": "그 쪽 궁금하다 게 없다"
                        }
                    },
                    {
                        "text": {
                            "raw": "똑똑하다 다시",
                            "nlp": "똑똑하다 다시"
                        }
                    },
                    {
                        "text": {
                            "raw": "답변 안 되다",
                            "nlp": "답변 안 되다"
                        }
                    },
                    {
                        "text": {
                            "raw": "말 되다",
                            "nlp": "말 되다"
                        }
                    },
                    {
                        "text": {
                            "raw": "모르다",
                            "nlp": "모르다"
                        }
                    },
                    {
                        "text": {
                            "raw": "대답 맞다 않다",
                            "nlp": "대답 맞다 않다"
                        }
                    },
                    {
                        "text": {
                            "raw": "뭐 하다 수 있다",
                            "nlp": "뭐 하다 수 있다"
                        }
                    },
                    {
                        "text": {
                            "raw": "무슨 소리",
                            "nlp": "무슨 소리"
                        }
                    },
                    {
                        "text": {
                            "raw": "뭔 소리",
                            "nlp": "뭔 소리"
                        }
                    },
                    {
                        "text": {
                            "raw": "알다 게 뭐",
                            "nlp": "알다 게 뭐"
                        }
                    },
                    {
                        "text": {
                            "raw": "뭘 대답 하다 수 있다",
                            "nlp": "뭘 대답 하다 수 있다"
                        }
                    },
                    {
                        "text": {
                            "raw": "대화 안 되다",
                            "nlp": "대화 안 되다"
                        }
                    },
                    {
                        "text": {
                            "raw": "아직 멀다",
                            "nlp": "아직 멀다"
                        }
                    },
                    {
                        "text": {
                            "raw": "이 다야",
                            "nlp": "이 다야"
                        }
                    },
                    {
                        "text": {
                            "raw": "카톡 보내다 마",
                            "nlp": "카톡 보내다 마"
                        }
                    },
                    {
                        "text": {
                            "raw": "도움 안 돼다",
                            "nlp": "도움 안 돼다"
                        }
                    },
                    {
                        "text": {
                            "raw": "관련 없다 답변",
                            "nlp": "관련 없다 답변"
                        }
                    },
                    {
                        "text": {
                            "raw": "해당 되다 내용 없다",
                            "nlp": "해당 되다 내용 없다"
                        }
                    },
                    {
                        "text": {
                            "raw": "헛소리",
                            "nlp": "헛소리"
                        }
                    },
                    {
                        "text": {
                            "raw": "실망",
                            "nlp": "실망"
                        }
                    },
                    {
                        "text": {
                            "raw": "뭔가",
                            "nlp": "뭔가"
                        }
                    },
                    {
                        "regexp": "다야"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==0",
                        "options": {
                            "output": "아직 부족해서 죄송해요. 매일 더 나아지려 노력하고 있어요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==1",
                        "options": {
                            "output": "제가 태어난 지 얼마 안 됐거든요… 더 열심히 공부할게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==2",
                        "options": {
                            "output": "제가 아직 배우는 중이라 조금 부족해도 이해해주세용~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 4) ==3",
                        "options": {
                            "output": "오늘 컨디션이 별로라서… 흠흠.. 다음엔 꼭 답변해드릴게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "나",
                "id": "default1300",
                "input": [
                    {
                        "text": {
                            "raw": "나다",
                            "nlp": "나다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==0",
                        "options": {
                            "output": "고객님이 좋으면 저는 더 좋아요~ 촤하하^^\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==1",
                        "options": {
                            "output": "나도나도~ 저도요 저도요~ (근데.. 뭐가??) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "시비",
                "id": "default1301",
                "input": [
                    {
                        "text": {
                            "raw": "재미있다",
                            "nlp": "재미있다"
                        }
                    },
                    {
                        "text": {
                            "raw": "재다",
                            "nlp": "재다"
                        }
                    },
                    {
                        "text": {
                            "raw": "재밌다",
                            "nlp": "재밌다"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==0",
                        "options": {
                            "output": "고객님과 대화하는 건 항상 즐겁습니다.  :) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==1",
                        "options": {
                            "output": "유머도 장착하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "시비2",
                "id": "default1302",
                "input": [
                    {
                        "text": {
                            "raw": "라이벌",
                            "nlp": "라이벌"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==0",
                        "options": {
                            "output": "저는 제 할 일을 했을 뿐인걸요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==1",
                        "options": {
                            "output": "깝치는 게 뭘까요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "물음표",
                "id": "default1303",
                "input": [
                    {
                        "text": {
                            "raw": "?",
                            "nlp": "?"
                        }
                    },
                    {
                        "text": {
                            "raw": "??",
                            "nlp": "??"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==0",
                        "options": {
                            "output": "뭐가 그리 궁금하신가요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    },
                    {
                        "kind": "Action",
                        "if": "((new Date()).getTime() % 2) ==1",
                        "options": {
                            "output": "!!!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
                        },
                        "type": "repeat"
                    }
                ]
            },
            {
                "name": "미검색",
                "id": "default274",
                "input": [
                    {
                        "if": " true"
                    }
                ],
                "output": [
                    {
                        "options": {
                            "output": "죄송합니다. 검색결과가 없습니다.\n다시 한번 말씀해주세요~\n처음으로 돌아가시려면 '처음'이라고 말씀해주세요"
                        },
                        "kind": "Action",
                        "type": "repeat"
                    }
                ]
            }
        ]
    },
    {
        "name": "(페이스북)상담톡",
        "id": "default31322333",
        "input": [
            {
                "text": {
                    "raw": "페북 지기",
                    "nlp": "페북 지기"
                },
                "if": " context.user.channel == 'facebook'"
            },
            {
                "text": {
                    "raw": "4",
                    "nlp": "4"
                },
                "if": " context.user.channel == 'facebook'"
            }
        ],
        "output": [
            {
                "text": "페북지기에게 메시지를 자유롭게 남겨주세요.\n자유 메시지는 바로 응답되지 않지만, 페북지기가 영업시간내 모두 확인합니다.\n\n메시지를 모두 남기신 후, 챗봇으로 돌아가시려면 '시작'이라고 입력해 주세요.",
                "kind": "Content"
            }
        ],
        "task": "liveChat"
    },
    {
        "name": "정치",
        "id": "default276",
        "input": [
            {
                "text": {
                    "raw": "정치",
                    "nlp": "정치"
                }
            },
            {
                "text": {
                    "raw": "박근혜",
                    "nlp": "박근혜"
                }
            },
            {
                "text": {
                    "raw": "문재인",
                    "nlp": "문재인"
                }
            },
            {
                "text": {
                    "raw": "홍준표",
                    "nlp": "홍준표"
                }
            },
            {
                "text": {
                    "raw": "민주당",
                    "nlp": "민주당"
                }
            },
            {
                "text": {
                    "raw": "자유 한국 당",
                    "nlp": "자유 한국 당"
                }
            },
            {
                "text": {
                    "raw": "바르다 정당",
                    "nlp": "바르다 정당"
                }
            },
            {
                "text": {
                    "raw": "새누리",
                    "nlp": "새누리"
                }
            },
            {
                "text": {
                    "raw": "자 다",
                    "nlp": "자 다"
                }
            },
            {
                "text": {
                    "raw": "한국 당",
                    "nlp": "한국 당"
                }
            },
            {
                "text": {
                    "raw": "국민의당",
                    "nlp": "국민의당"
                }
            },
            {
                "text": {
                    "raw": "안철수",
                    "nlp": "안철수"
                }
            },
            {
                "text": {
                    "raw": "대통령",
                    "nlp": "대통령"
                }
            },
            {
                "text": {
                    "raw": "국회",
                    "nlp": "국회"
                }
            },
            {
                "text": {
                    "raw": "국회의원",
                    "nlp": "국회의원"
                }
            },
            {
                "text": {
                    "raw": "청와대",
                    "nlp": "청와대"
                }
            },
            {
                "text": {
                    "raw": "강경화",
                    "nlp": "강경화"
                }
            },
            {
                "text": {
                    "raw": "김상조",
                    "nlp": "김상조"
                }
            }
        ],
        "output": [
            {
                "text": "이런 질문엔 아! 그렇군요 라고 답하라고 배웠습니다. \"아, 그렇군요\" \n\n궁금하신 다른 키워드를 입력해 주세요.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "욕설",
        "id": "default277",
        "input": [
            {
                "text": {
                    "raw": "시발",
                    "nlp": "시발"
                }
            },
            {
                "text": {
                    "raw": "씨발",
                    "nlp": "씨발"
                }
            },
            {
                "text": {
                    "raw": "ㅅㅂ",
                    "nlp": "ㅅㅂ"
                }
            },
            {
                "text": {
                    "raw": "ㄱㅅㄲ",
                    "nlp": "ㄱㅅㄲ"
                }
            },
            {
                "text": {
                    "raw": "개새끼",
                    "nlp": "개새끼"
                }
            },
            {
                "text": {
                    "raw": "썅",
                    "nlp": "썅"
                }
            },
            {
                "text": {
                    "raw": "나쁘다 놈",
                    "nlp": "나쁘다 놈"
                }
            },
            {
                "text": {
                    "raw": "죽다 버리다",
                    "nlp": "죽다 버리다"
                }
            },
            {
                "text": {
                    "raw": "꺼지다",
                    "nlp": "꺼지다"
                }
            },
            {
                "text": {
                    "raw": "병신",
                    "nlp": "병신"
                }
            },
            {
                "text": {
                    "raw": "ㅂㅅ",
                    "nlp": "ㅂㅅ"
                }
            },
            {
                "text": {
                    "raw": "ㅅㅂㄴ",
                    "nlp": "ㅅㅂㄴ"
                }
            },
            {
                "text": {
                    "raw": "미치다",
                    "nlp": "미치다"
                }
            },
            {
                "text": {
                    "raw": "눈 까다",
                    "nlp": "눈 까다"
                }
            },
            {
                "text": {
                    "raw": "별로",
                    "nlp": "별로"
                }
            },
            {
                "text": {
                    "raw": "못 생기다",
                    "nlp": "못 생기다"
                }
            },
            {
                "text": {
                    "raw": "섹스",
                    "nlp": "섹스"
                }
            },
            {
                "text": {
                    "raw": "죽다",
                    "nlp": "죽다"
                }
            }
        ],
        "output": [
            {
                "text": "헉. 고객님을 화나게 하다니 제 눈에서 눈물을 뽑아드릴게요. \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?",
                "kind": "Content"
            },
            {
                "text": "키힝~ 무서워요.ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?",
                "kind": "Content"
            },
            {
                "text": "죄송하지만 고객님! 저도 상처 받아요 ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?",
                "kind": "Content"
            },
            {
                "text": "… 응? 고객님을 화나게 해드리다니 반성합니다.\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "칭찬",
        "id": "default278",
        "input": [
            {
                "text": {
                    "raw": "수고 하다",
                    "nlp": "수고 하다"
                }
            },
            {
                "text": {
                    "raw": "수고",
                    "nlp": "수고"
                }
            },
            {
                "text": {
                    "raw": "고생 많다",
                    "nlp": "고생 많다"
                }
            },
            {
                "text": {
                    "raw": "고생 하다",
                    "nlp": "고생 하다"
                }
            },
            {
                "text": {
                    "raw": "감사 하다",
                    "nlp": "감사 하다"
                }
            },
            {
                "text": {
                    "raw": "고맙다",
                    "nlp": "고맙다"
                }
            },
            {
                "text": {
                    "raw": "ㄱㅅ",
                    "nlp": "ㄱㅅ"
                }
            },
            {
                "text": {
                    "raw": "땡큐",
                    "nlp": "땡큐"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "감동입니다, 고객님. 감사합니다.\n\n 궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            }
        ]
    },
    {
        "name": "인사",
        "id": "default279",
        "input": [
            {
                "text": {
                    "raw": "안녕",
                    "nlp": "안녕"
                }
            },
            {
                "text": {
                    "raw": "안녕하다",
                    "nlp": "안녕하다"
                }
            },
            {
                "text": {
                    "raw": "헬로 우",
                    "nlp": "헬로 우"
                }
            },
            {
                "text": {
                    "raw": "hello",
                    "nlp": "hello"
                }
            },
            {
                "text": {
                    "raw": "굿모닝",
                    "nlp": "굿모닝"
                }
            },
            {
                "text": {
                    "raw": "하이",
                    "nlp": "하이"
                }
            },
            {
                "text": {
                    "raw": "hi",
                    "nlp": "hi"
                }
            },
            {
                "text": {
                    "raw": "반갑다",
                    "nlp": "반갑다"
                }
            },
            {
                "text": {
                    "raw": "안뇽",
                    "nlp": "안뇽"
                }
            }
        ],
        "output": [
            {
                "text": "고객님도 안녕하세요! \n먼저 인사해 주셔서 전 지금 감동 최고조 입니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "이렇게 인사 잘 해주시는 분은 난생 처음이에요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "안녕 반가워요 :) 저는 여러분과 인사를 나누는 이 시간이 제일 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "돈",
        "id": "default280",
        "input": [
            {
                "text": {
                    "raw": "돈",
                    "nlp": "돈"
                }
            },
            {
                "text": {
                    "raw": "내 돈 어디 가다",
                    "nlp": "내 돈 어디 가다"
                }
            },
            {
                "text": {
                    "raw": "돈 좀 주다",
                    "nlp": "돈 좀 주다"
                }
            },
            {
                "text": {
                    "raw": "돈 필요하다",
                    "nlp": "돈 필요하다"
                }
            },
            {
                "text": {
                    "raw": "돈 좀 내주다",
                    "nlp": "돈 좀 내주다"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "화장실 좀 다녀올게요. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            }
        ]
    },
    {
        "name": "일상",
        "id": "default281",
        "input": [
            {
                "text": {
                    "raw": "오늘 뭐",
                    "nlp": "오늘 뭐"
                }
            },
            {
                "text": {
                    "raw": "오늘 모해",
                    "nlp": "오늘 모해"
                }
            },
            {
                "text": {
                    "raw": "모해",
                    "nlp": "모해"
                }
            },
            {
                "text": {
                    "raw": "뭐",
                    "nlp": "뭐"
                }
            },
            {
                "text": {
                    "raw": "모하",
                    "nlp": "모하"
                }
            },
            {
                "text": {
                    "raw": "모햐",
                    "nlp": "모햐"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "전 오늘도 알파고 형님을 뒤따르기 위해 열일중입니다. 데헷! \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            }
        ]
    },
    {
        "name": "날씨",
        "id": "default282",
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
                "text": "아… 제가 아직 거기까지는… 긁적긁적. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            }
        ]
    },
    {
        "name": "푸념",
        "id": "default283",
        "input": [
            {
                "text": {
                    "raw": "졸리다",
                    "nlp": "졸리다"
                }
            },
            {
                "text": {
                    "raw": "배고프다",
                    "nlp": "배고프다"
                }
            },
            {
                "text": {
                    "raw": "퇴근 시키다",
                    "nlp": "퇴근 시키다"
                }
            },
            {
                "text": {
                    "raw": "야근 하다 싫다",
                    "nlp": "야근 하다 싫다"
                }
            },
            {
                "text": {
                    "raw": "힘들다",
                    "nlp": "힘들다"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "저도요. T.,T\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            }
        ]
    },
    {
        "name": "답답",
        "id": "default284",
        "input": [
            {
                "text": {
                    "raw": "답정너",
                    "nlp": "답정너"
                }
            },
            {
                "text": {
                    "raw": "답답",
                    "nlp": "답답"
                }
            },
            {
                "text": {
                    "raw": "답답하다",
                    "nlp": "답답하다"
                }
            },
            {
                "text": {
                    "raw": "뭐임",
                    "nlp": "뭐임"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "헉. 제가 아직 좀더 배워야 해서 아직 답정너입니다. 빨리 배우겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            }
        ]
    },
    {
        "name": "사랑",
        "id": "default285",
        "input": [
            {
                "text": {
                    "raw": "좋아하다",
                    "nlp": "좋아하다"
                }
            },
            {
                "text": {
                    "raw": "사랑",
                    "nlp": "사랑"
                }
            },
            {
                "text": {
                    "raw": "하트",
                    "nlp": "하트"
                }
            },
            {
                "text": {
                    "raw": "보다",
                    "nlp": "보다"
                }
            },
            {
                "text": {
                    "raw": "사랑 햐",
                    "nlp": "사랑 햐"
                }
            },
            {
                "text": {
                    "raw": "좋아햐",
                    "nlp": "좋아햐"
                }
            }
        ],
        "output": [
            {
                "text": "저.. 저도요.. (부끄) \n저 사랑에 죄송한데 초면해도 될까요? ♥\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "사랑한다는 말, 오늘은 가족에게도 해주세요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "사랑은 좋은 거예요. 열과 성을 다해 두 번 사랑합시다!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "저도 사…사…. (아 너무 부끄럽네요)\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "이런… 제가 먼저 고백하려 했는데 선수를 치셨네요! ㅎㅎ\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "일상대화_바쁨",
        "id": "default286",
        "input": [
            {
                "text": {
                    "raw": "바쁘다",
                    "nlp": "바쁘다"
                }
            },
            {
                "text": {
                    "raw": "오늘 바쁘다",
                    "nlp": "오늘 바쁘다"
                }
            },
            {
                "text": {
                    "raw": "바쁘다 가요",
                    "nlp": "바쁘다 가요"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "아무리 바쁘셔도 건강은 꼭 챙기세요.\n지금 기지개 한번 쭉~ 펴보시는 건 어떠세요?\n\n원하시는 질문 입력하시면 전 답을 열심히 찾아보도록 하겠습니다."
            }
        ]
    },
    {
        "name": "짜증2",
        "id": "default287",
        "input": [
            {
                "text": {
                    "raw": "짜증",
                    "nlp": "짜증"
                }
            },
            {
                "text": {
                    "raw": "ㅡㅡ",
                    "nlp": "ㅡㅡ"
                }
            },
            {
                "text": {
                    "raw": "아 짜증",
                    "nlp": "아 짜증"
                }
            },
            {
                "text": {
                    "raw": "아 놓다",
                    "nlp": "아 놓다"
                }
            },
            {
                "text": {
                    "raw": "짜증 나다",
                    "nlp": "짜증 나다"
                }
            },
            {
                "text": {
                    "raw": "짜증 요",
                    "nlp": "짜증 요"
                }
            },
            {
                "text": {
                    "raw": "짱",
                    "nlp": "짱"
                }
            },
            {
                "text": {
                    "raw": "쯧쯧",
                    "nlp": "쯧쯧"
                }
            },
            {
                "text": {
                    "raw": "흥",
                    "nlp": "흥"
                }
            },
            {
                "text": {
                    "raw": "미치다",
                    "nlp": "미치다"
                }
            },
            {
                "text": {
                    "raw": "싸우다",
                    "nlp": "싸우다"
                }
            },
            {
                "text": {
                    "raw": "화나다",
                    "nlp": "화나다"
                }
            },
            {
                "text": {
                    "raw": "웃다",
                    "nlp": "웃다"
                }
            },
            {
                "text": {
                    "raw": "웃다 말다",
                    "nlp": "웃다 말다"
                }
            }
        ],
        "output": [
            {
                "text": "짜증날 땐 짜장면…아재 개그라도 하면 나아질 줄..(쿨럭) 죄송합니다!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "제가 잘 몰라서 그러신 거라면.. 흑.. 더 노력하겠습니다!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "혹시 저 때문인가요? 오늘도 밤샘 공부하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "일상대화_짜증",
        "id": "default288",
        "input": [
            {
                "text": {
                    "raw": "짜증 나다",
                    "nlp": "짜증 나다"
                }
            },
            {
                "text": {
                    "raw": "미치다",
                    "nlp": "미치다"
                }
            },
            {
                "text": {
                    "raw": "화나다",
                    "nlp": "화나다"
                }
            },
            {
                "text": {
                    "raw": "빡치다",
                    "nlp": "빡치다"
                }
            },
            {
                "text": {
                    "raw": "짜증",
                    "nlp": "짜증"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "저는 그럴 때 달달한 걸 먹거나, 푹 잡니다.\n스트레스를 담아두고 계시면 건강에도 좋지 않으니 고객님께 맞는 해소 방법을 꼭 찾으시길 바래요.\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            }
        ]
    },
    {
        "name": "알았음",
        "id": "default289",
        "input": [
            {
                "text": {
                    "raw": "ㅇㅇ",
                    "nlp": "ㅇㅇ"
                }
            },
            {
                "text": {
                    "raw": "ㅇ",
                    "nlp": "ㅇ"
                }
            },
            {
                "text": {
                    "raw": "응",
                    "nlp": "응"
                }
            },
            {
                "text": {
                    "raw": "네",
                    "nlp": "네"
                }
            },
            {
                "text": {
                    "raw": "그렇다",
                    "nlp": "그렇다"
                }
            },
            {
                "text": {
                    "raw": "알다",
                    "nlp": "알다"
                }
            },
            {
                "text": {
                    "raw": "아",
                    "nlp": "아"
                }
            },
            {
                "text": {
                    "raw": "ㅇㅋ",
                    "nlp": "ㅇㅋ"
                }
            }
        ],
        "output": [
            {
                "text": "언제든 궁금하신 내용이 있으면 물어보세요~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "네네~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "고객님께 도움이 되어서 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "부정 - 아니/안돼",
        "id": "default290",
        "input": [
            {
                "text": {
                    "raw": "아니다",
                    "nlp": "아니다"
                }
            },
            {
                "text": {
                    "raw": "아뇨",
                    "nlp": "아뇨"
                }
            }
        ],
        "output": [
            {
                "text": "거절은 거절합니다!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "알겠습니다! 그런 게 아닌 것으로!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "앗, 제가 제대로 이해하지 못했나봐요. 다시 말씀해주시겠어요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "한 번만 더 기회를 주세요. 진짜 잘 할 수 있어요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "상담",
        "id": "default291",
        "input": [
            {
                "text": {
                    "raw": "고객 센터",
                    "nlp": "고객 센터"
                }
            },
            {
                "text": {
                    "raw": "상담 원",
                    "nlp": "상담 원"
                }
            },
            {
                "text": {
                    "raw": "상담",
                    "nlp": "상담"
                }
            },
            {
                "text": {
                    "raw": "전화",
                    "nlp": "전화"
                }
            },
            {
                "text": {
                    "raw": "민원",
                    "nlp": "민원"
                }
            }
        ],
        "output": [
            {
                "text": "신한카드 고객센터(☎1544-7000)이며 평일 오전 9시~오후 6시까지 이용가능하십니다. 전화연결에 시간이 걸릴 수 있으니 신한카드 홈페이지나 APP을 먼저 확인해 보시는 건 어떨까요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "이벤트",
        "id": "default292",
        "input": [
            {
                "text": {
                    "raw": "이벤트",
                    "nlp": "이벤트"
                }
            }
        ],
        "output": [
            {
                "text": "페이스북 이벤트는 챗봇 초기 4번 페북지기에게 한마디를 선택해 주세요.  페이스북 이벤트가 아닌 신한카드 이벤트는 홈페이지를 참고해 주시면 됩니다. 더 좋은 이벤트로 보답하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "웃음",
        "id": "default293",
        "input": [
            {
                "text": {
                    "raw": "ㅋㅋ",
                    "nlp": "ㅋㅋ"
                }
            },
            {
                "text": {
                    "raw": "ㅎㅎ",
                    "nlp": "ㅎㅎ"
                }
            }
        ],
        "output": [
            {
                "text": "ㅋㅋㅋ 저도 웃지요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "고객님이 웃으시니 뿌듯합니다^^\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "하하하 웃으면 복이와요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "욕설-바보",
        "id": "default294",
        "input": [
            {
                "text": {
                    "raw": "바보",
                    "nlp": "바보"
                }
            },
            {
                "text": {
                    "raw": "바부",
                    "nlp": "바부"
                }
            },
            {
                "text": {
                    "raw": "멍청",
                    "nlp": "멍청"
                }
            },
            {
                "text": {
                    "raw": "멍충",
                    "nlp": "멍충"
                }
            },
            {
                "text": {
                    "raw": "멍청이",
                    "nlp": "멍청이"
                }
            },
            {
                "text": {
                    "raw": "바부",
                    "nlp": "바부"
                }
            },
            {
                "text": {
                    "raw": "멍처하",
                    "nlp": "멍처하"
                }
            },
            {
                "text": {
                    "raw": "멍청이야",
                    "nlp": "멍청이야"
                }
            },
            {
                "text": {
                    "raw": "멍충이",
                    "nlp": "멍충이"
                }
            }
        ],
        "output": [
            {
                "text": "맞아요. 바보. 고객님밖에 모르는 바보…♥ 다른 건 배워나가면 되죠!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "매일 새로운 말을 학습 중이랍니다. 멋지게 성장할 거예요~ 대화창 고정!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "고객님께 걸맞는 챗봇이 되는 그 날까지…! 뚜벅뚜벅 나아갈 거예요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "다들 너무 똑똑하셔서 상대적으로 그래 보이는 거예요. (슬픔)\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "없다",
        "id": "default295",
        "input": [
            {
                "text": {
                    "raw": "없다",
                    "nlp": "없다"
                }
            },
            {
                "text": {
                    "raw": "몰르다",
                    "nlp": "몰르다"
                }
            },
            {
                "text": {
                    "raw": "이해 잘 안 되다",
                    "nlp": "이해 잘 안 되다"
                }
            },
            {
                "text": {
                    "raw": "이해 자다 안 돼다",
                    "nlp": "이해 자다 안 돼다"
                }
            },
            {
                "text": {
                    "raw": "모르다",
                    "nlp": "모르다"
                }
            }
        ],
        "output": [
            {
                "text": "찾으시는 답변이 없으시다면 다른 키워드를 입력해 주시겠어요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "혹시 신한카드가 없으시다면 '처음'을 입력하시고 '카드추천' 메뉴를 이용해 보시는건 어떠세요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "부정-탄식",
        "id": "default296",
        "input": [
            {
                "text": {
                    "raw": "허다",
                    "nlp": "허다"
                }
            },
            {
                "text": {
                    "raw": "아오",
                    "nlp": "아오"
                }
            },
            {
                "text": {
                    "raw": "엥",
                    "nlp": "엥"
                }
            },
            {
                "text": {
                    "raw": "이렇다",
                    "nlp": "이렇다"
                }
            },
            {
                "text": {
                    "raw": "칫",
                    "nlp": "칫"
                }
            },
            {
                "text": {
                    "raw": "뭐임",
                    "nlp": "뭐임"
                }
            },
            {
                "text": {
                    "raw": "아이",
                    "nlp": "아이"
                }
            },
            {
                "text": {
                    "raw": "에고",
                    "nlp": "에고"
                }
            },
            {
                "text": {
                    "raw": "음",
                    "nlp": "음"
                }
            },
            {
                "text": {
                    "raw": "이렇다 뇨",
                    "nlp": "이렇다 뇨"
                }
            },
            {
                "text": {
                    "raw": "헉",
                    "nlp": "헉"
                }
            },
            {
                "text": {
                    "raw": "흠",
                    "nlp": "흠"
                }
            },
            {
                "text": {
                    "raw": "첨",
                    "nlp": "첨"
                }
            },
            {
                "text": {
                    "raw": "하",
                    "nlp": "하"
                }
            },
            {
                "text": {
                    "raw": "아이구",
                    "nlp": "아이구"
                }
            },
            {
                "text": {
                    "raw": "어허",
                    "nlp": "어허"
                }
            }
        ],
        "output": [
            {
                "text": "아잉~ 근데 왜요?? \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "아하… (흠흠)  \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "감사",
        "id": "default297",
        "input": [
            {
                "text": {
                    "raw": "감사",
                    "nlp": "감사"
                }
            },
            {
                "text": {
                    "raw": "고마 웡",
                    "nlp": "고마 웡"
                }
            },
            {
                "text": {
                    "raw": "오케이",
                    "nlp": "오케이"
                }
            },
            {
                "text": {
                    "raw": "편하다",
                    "nlp": "편하다"
                }
            },
            {
                "text": {
                    "raw": "thank",
                    "nlp": "thank"
                }
            },
            {
                "text": {
                    "raw": "감동",
                    "nlp": "감동"
                }
            },
            {
                "text": {
                    "raw": "고맙다",
                    "nlp": "고맙다"
                }
            },
            {
                "text": {
                    "raw": "괜찮다",
                    "nlp": "괜찮다"
                }
            },
            {
                "text": {
                    "raw": "금사",
                    "nlp": "금사"
                }
            }
        ],
        "output": [
            {
                "text": "감동… 하루 피로가 싹 사라지는 느낌이에요.\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "고객님 말씀듣고 충전 완료! 24시간 근무도 거뜬하겠는걸요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "감사합니다. 고객님! 힘이 솟아나는 기분이에요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "이름/누구",
        "id": "default298",
        "input": [
            {
                "text": {
                    "raw": "이름",
                    "nlp": "이름"
                }
            },
            {
                "text": {
                    "raw": "알파",
                    "nlp": "알파"
                }
            },
            {
                "text": {
                    "raw": "누구",
                    "nlp": "누구"
                }
            },
            {
                "text": {
                    "raw": "너 뭐",
                    "nlp": "너 뭐"
                }
            },
            {
                "text": {
                    "raw": "너 애기",
                    "nlp": "너 애기"
                }
            },
            {
                "text": {
                    "raw": "뉘귀",
                    "nlp": "뉘귀"
                }
            },
            {
                "text": {
                    "raw": "너 대해",
                    "nlp": "너 대해"
                }
            },
            {
                "text": {
                    "raw": "알파 거",
                    "nlp": "알파 거"
                }
            },
            {
                "text": {
                    "raw": "누가",
                    "nlp": "누가"
                }
            },
            {
                "text": {
                    "raw": "인공 지능",
                    "nlp": "인공 지능"
                }
            }
        ],
        "output": [
            {
                "text": "저는 아직 많이 부족한 초초초보 챗봇에요. 열심히 공부하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "네 제가 바로 신한의 자동응답형 챗봇입니다. 데헷~ \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "저에 대해 궁금하신가요? 우리 차차 알아가기로 해요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "부정-기능무시",
        "id": "default299",
        "input": [
            {
                "text": {
                    "raw": "알다 게 없다",
                    "nlp": "알다 게 없다"
                }
            },
            {
                "text": {
                    "raw": "하나",
                    "nlp": "하나"
                }
            },
            {
                "text": {
                    "raw": "가능하다 게",
                    "nlp": "가능하다 게"
                }
            },
            {
                "text": {
                    "raw": "공부 많이",
                    "nlp": "공부 많이"
                }
            },
            {
                "text": {
                    "raw": "그냥 기사",
                    "nlp": "그냥 기사"
                }
            },
            {
                "text": {
                    "raw": "그 쪽 궁금하다 게 없다",
                    "nlp": "그 쪽 궁금하다 게 없다"
                }
            },
            {
                "text": {
                    "raw": "똑똑하다 다시",
                    "nlp": "똑똑하다 다시"
                }
            },
            {
                "text": {
                    "raw": "답변 안 되다",
                    "nlp": "답변 안 되다"
                }
            },
            {
                "text": {
                    "raw": "말 되다",
                    "nlp": "말 되다"
                }
            },
            {
                "text": {
                    "raw": "모르다",
                    "nlp": "모르다"
                }
            },
            {
                "text": {
                    "raw": "대답 맞다 않다",
                    "nlp": "대답 맞다 않다"
                }
            },
            {
                "text": {
                    "raw": "뭐 하다 수 있다",
                    "nlp": "뭐 하다 수 있다"
                }
            },
            {
                "text": {
                    "raw": "무슨 소리",
                    "nlp": "무슨 소리"
                }
            },
            {
                "text": {
                    "raw": "뭔 소리",
                    "nlp": "뭔 소리"
                }
            },
            {
                "text": {
                    "raw": "알다 게 뭐",
                    "nlp": "알다 게 뭐"
                }
            },
            {
                "text": {
                    "raw": "뭘 대답 하다 수 있다",
                    "nlp": "뭘 대답 하다 수 있다"
                }
            },
            {
                "text": {
                    "raw": "대화 안 되다",
                    "nlp": "대화 안 되다"
                }
            },
            {
                "text": {
                    "raw": "아직 멀다",
                    "nlp": "아직 멀다"
                }
            },
            {
                "text": {
                    "raw": "이 다야",
                    "nlp": "이 다야"
                }
            },
            {
                "text": {
                    "raw": "카톡 보내다 마",
                    "nlp": "카톡 보내다 마"
                }
            },
            {
                "text": {
                    "raw": "도움 안 돼다",
                    "nlp": "도움 안 돼다"
                }
            },
            {
                "text": {
                    "raw": "관련 없다 답변",
                    "nlp": "관련 없다 답변"
                }
            },
            {
                "text": {
                    "raw": "해당 되다 내용 없다",
                    "nlp": "해당 되다 내용 없다"
                }
            },
            {
                "text": {
                    "raw": "헛소리",
                    "nlp": "헛소리"
                }
            },
            {
                "text": {
                    "raw": "실망",
                    "nlp": "실망"
                }
            },
            {
                "text": {
                    "raw": "뭔가",
                    "nlp": "뭔가"
                }
            },
            {
                "regexp": "다야"
            }
        ],
        "output": [
            {
                "kind": "Action",
                "if": "((new Date()).getTime() % 4) ==0",
                "options": {
                    "output": "아직 부족해서 죄송해요. 매일 더 나아지려 노력하고 있어요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                },
                "type": "repeat"
            },
            {
                "kind": "Action",
                "if": "((new Date()).getTime() % 4) ==1",
                "options": {
                    "output": "제가 태어난 지 얼마 안 됐거든요… 더 열심히 공부할게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                },
                "type": "repeat"
            },
            {
                "kind": "Action",
                "if": "((new Date()).getTime() % 4) ==2",
                "options": {
                    "output": "제가 아직 배우는 중이라 조금 부족해도 이해해주세용~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                },
                "type": "repeat"
            },
            {
                "kind": "Action",
                "if": "((new Date()).getTime() % 4) ==3",
                "options": {
                    "output": "오늘 컨디션이 별로라서… 흠흠.. 다음엔 꼭 답변해드릴게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                },
                "type": "repeat"
            }
        ]
    },
    {
        "name": "나",
        "id": "default300",
        "input": [
            {
                "text": {
                    "raw": "나다",
                    "nlp": "나다"
                }
            }
        ],
        "output": [
            {
                "text": "고객님이 좋으면 저는 더 좋아요~ 촤하하^^\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "나도나도~ 저도요 저도요~ (근데.. 뭐가??) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "시비",
        "id": "default301",
        "input": [
            {
                "text": {
                    "raw": "재미있다",
                    "nlp": "재미있다"
                }
            },
            {
                "text": {
                    "raw": "재다",
                    "nlp": "재다"
                }
            },
            {
                "text": {
                    "raw": "재밌다",
                    "nlp": "재밌다"
                }
            }
        ],
        "output": [
            {
                "text": "고객님과 대화하는 건 항상 즐겁습니다.  :) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "유머도 장착하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "시비2",
        "id": "default302",
        "input": [
            {
                "text": {
                    "raw": "라이벌",
                    "nlp": "라이벌"
                }
            }
        ],
        "output": [
            {
                "text": "저는 제 할 일을 했을 뿐인걸요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "깝치는 게 뭘까요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            }
        ]
    },
    {
        "name": "물음표",
        "id": "default303",
        "input": [
            {
                "text": {
                    "raw": "?",
                    "nlp": "?"
                }
            },
            {
                "text": {
                    "raw": "??",
                    "nlp": "??"
                }
            }
        ],
        "output": [
            {
                "text": "뭐가 그리 궁금하신가요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
            },
            {
                "text": "!!!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "kind": "Content"
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
                    "raw": "시작 처음",
                    "nlp": "시작 처음"
                }
            }
        ],
        "output": [
            {
                "text": "안녕하세요, 신한카드입니다. \n저는 전화, 홈페이지 보다 메신저가 편한 고객님들을 위해 새롭게 선보이는 신한카드 자동채팅 서비스입니다. 스마트한 생활 플랫폼 신한 FAN과 카드에 대해 알려드리겠습니다. 많이 이용해 주실꺼죠?\n\n신한 FAN, 카드 추천, 자주 묻는 질문(FAQ) 중 하나를 선택해 주세요.\n\n1. 스마트한 생활 플랫폼 신한 FAN을 알려줘요\n2. 내게 꼭 맞는 카드를 추천해줘요\n3. 궁금한게 있는데요(FAQ)",
                "buttons": [
                    {
                        "text": "스마트한 생활 플랫폼 신한 FAN을 알려줘요"
                    },
                    {
                        "text": "내게 꼭 맞는 카드를 추천해줘요"
                    },
                    {
                        "text": "궁금한게 있는데요(FAQ)"
                    }
                ],
                "kind": "Content"
            }
        ]
    },
    {
        "id": "noanswer",
        "name": "답변없음",
        "input": [],
        "output": [
            "전 아직 알파고가 아닙니다. 죄송합니다. 다시 한번 궁금하신 키워드를 입력해 주시겠습니까?",
            "어제도 혼났습니다. 고객님 말씀 못 알아듣는다고… T.,T 다시 한번 단어로 입력해 주시겠습니까?",
            "계속 못 알아들어서 죄송합니다. 알파고 학원이라도 등록해야겠습니다. 다른 단어를 입력해 주시면 안 될까요?"
        ]
    },
    {
        "name": "판",
        "id": "commondefault192",
        "input": [
            {
                "regexp": "/^FAN$/"
            },
            {
                "regexp": "/^판$/"
            }
        ],
        "output": [
            {
                "type": "call",
                "kind": "Action"
            }
        ]
    },
    {
        "name": "이전",
        "id": "backDialog",
        "input": [
            {
                "text": {
                    "raw": "9",
                    "nlp": "9"
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
        "name": "FAQcommon",
        "id": "commondefault276",
        "input": [
            {
                "text": {
                    "raw": "궁금하다 있다 FAQ",
                    "nlp": "궁금하다 있다 FAQ"
                }
            }
        ],
        "output": [
            {
                "type": "call",
                "kind": "Action"
            }
        ]
    },
    {
        "name": "카드 추천common",
        "id": "commondefault277",
        "input": [
            {
                "text": {
                    "raw": "내다 꼭 맞다 카드 추천 하다",
                    "nlp": "내다 꼭 맞다 카드 추천 하다"
                }
            }
        ],
        "output": [
            {
                "type": "call",
                "kind": "Action"
            }
        ]
    },
    {
        "name": "가입하기",
        "id": "commondefault1322327",
        "input": [
            {
                "text": {
                    "raw": "가입 하다",
                    "nlp": "가입 하다"
                }
            }
        ],
        "output": [
            {
                "type": "call",
                "kind": "Action"
            }
        ]
    },
    {
        "name": "퀴즈커먼",
        "id": "commondefault1322332",
        "input": [
            {
                "text": {
                    "raw": "퀴즈",
                    "nlp": "퀴즈"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "아쉽게도 퀴즈 이벤트는 종료되었습니다. \n하지만 다른 궁금하신 부분에 대해 답변할 준비는 되어 있습니다!"
            }
        ]
    }
];

module.exports = function(bot)
{
    bot.setDialogs(dialogs);
    bot.setCommonDialogs(commonDialogs);
};
