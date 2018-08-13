var dialogs = [
    {
        "name": "신한 FAN 플랫폼 소개",
        "input": [
            {
                "text": {
                    "raw": "스마트한 생활 플랫폼 신한 FAN을 알려줘요",
                    "nlp": "스마트 한 생활 플랫폼 신한 FAN 을 알다"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "오우, 스마트한 생활플랫폼 신한 FAN 을 선택해 주셨군요! 궁금한 내용을 선택해 주세요. \n \n 1. 신한 FAN에 가입하고 싶어요!\n 2. 신한 FAN을 알려주세요.",
                "buttons": [
                    {
                        "url": "",
                        "text": "신한 FAN 가입"
                    },
                    {
                        "url": "",
                        "text": "신한 FAN 소개영상"
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
        "id": "default0",
        "children": [
            {
                "name": "FAN 가입",
                "input": [
                    {
                        "text": {
                            "raw": "신한 FAN 가입",
                            "nlp": "신한 FAN 가입"
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
                        "text": "현명한 선택! 스마트한 생활 플랫폼 신한 FAN 입니다. \n\n✔ 신한 FAN은 신한카드가 없어도 가입 가능!  \n✔ 신한 FAN에 가입 하시면 다양한 경품이 가득! \n✔ 신규 고객이라면 100% 당첨 경품 제공!",
                        "image": {
                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/FAN%E1%84%80%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B8.jpg"
                        },
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
                "id": "default1"
            },
            {
                "name": "신한 FAN 영상",
                "input": [
                    {
                        "text": {
                            "raw": "신한 FAN 소개영상",
                            "nlp": "신한 FAN 소개 영상"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "현명한 선택!  스마트한 생활 플랫폼 신한 FAN 이 더욱 새로워졌습니다. \n새로워진 신한 FAN을 미리 보여드릴게요\n\n✔ 마음대로 골라쓰는 나만의 판\n✔ 복잡한 결제도 판 하나면 끝\n✔ 신한금융그룹의 다양한 서비스를 한 눈에\n✔ 나만을 위한 맞춤 추천\n✔ 금융 서비스도 한 곳에서",
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
                                "url": "https://www.youtube.com/watch?v=wYqyGdipBZ0",
                                "text": "영상보기"
                            }
                        ]
                    }
                ],
                "id": "default2"
            }
        ]
    },
    {
        "name": "신한 카드 추천",
        "input": [
            {
                "text": {
                    "raw": "내게 꼭 맞는 카드를 추천해줘요",
                    "nlp": "내다 꼭 맞다 카드 를 추천 하다"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "역시 카드는 신한카드죠. 제 자랑같지만 우리나라에서 제일 많이 쓰는 카드에요 :)\n\n 소비 패턴 및 결제 스타일을 선택해 주시면 \"내게 맞는 카드\"를 추천해 드리겠습니다.\n \n 먼저 결제 스타일부터 알아볼까요?\n\n 1. 신용카드를 선호합니다.\n 2. 체크카드를 선호합니다.",
                "buttons": [
                    {
                        "url": "",
                        "text": "신용카드"
                    },
                    {
                        "url": "",
                        "text": "체크카드"
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
        "id": "default3",
        "children": [
            {
                "name": "신용카드",
                "input": [
                    {
                        "text": {
                            "raw": "신용카드",
                            "nlp": "신용카드"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "신용카드를 선택하셨군요! 카드의 매력은 다양한 혜택이죠.\n\n고객님이 직접 혜택을 필요한 것만 골라 구성할 수도 있고, 미리 구성되어 있는 카드 중에서 고르실 수도 있어요. \n아래 보기중에서 선택해 주세요. \n\n 1. 직접 혜택을 구성하고 싶다 (혜택선택형)\n 2. 알차게 구성되어 있는 카드를 고르고 싶다 (혜택기본형)",
                        "buttons": [
                            {
                                "url": "",
                                "text": "혜택선택형"
                            },
                            {
                                "url": "",
                                "text": "혜택기본형"
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
                "id": "default4",
                "children": [
                    {
                        "name": "혜택선택형",
                        "input": [
                            {
                                "text": {
                                    "raw": "혜택선택형",
                                    "nlp": "혜택 선택 형"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "고객님께서 구성하고 싶은 혜택은 주로 할인인가요? 아니면 포인트 적립인가요?\n \n 1. 할인(캐시백)\n 2. 포인트 적립",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "할인"
                                    },
                                    {
                                        "url": "",
                                        "text": "포인트"
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
                        "id": "default5",
                        "children": [
                            {
                                "name": "할인",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "할인",
                                            "nlp": "할인"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "캐시백",
                                            "nlp": "캐시 백"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "(광고) [신한카드 YOLO ⓘ]\n카드가 딱이네요!\n\n✔ 6개 선택처 할인율 선택(커피,택시,편의점,베이커리,소셜커머스,영화)\n✔ 카드 디자인 선택\n✔ 분기별 Bonus 모바일 쿠폰\n\n-연회비\nLocal[국내] 1만 5천원\nVISA 1만 8천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                        "image": {
                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+YOLO+i"
                                        },
                                        "buttons": [
                                            {
                                                "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350235_39388.html",
                                                "text": "바로가기"
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
                                "id": "default6"
                            },
                            {
                                "name": "포인트적립",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "포인트",
                                            "nlp": "포인트"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "(광고) [신한 카드 Nano f]\n카드가 딱이네요!\n \n✔ 직접 고른 스타일과 거리에서 최고 5% 적립\n✔ 어디서나 최고 2% 적립\n✔ 주유 적립\n \n- 연회비\nVISA 1만3천원, 2만3천원(플래티늄)\nMASTER 1만3천원, 2만3천원(플래티늄)\nURS 8천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요. \n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                        "image": {
                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C+Hi-Point+%EC%B9%B4%EB%93%9C+Nano+f"
                                        },
                                        "buttons": [
                                            {
                                                "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1355079_39388.html",
                                                "text": "바로가기"
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
                                "id": "default7"
                            }
                        ]
                    },
                    {
                        "name": "혜택기본형",
                        "input": [
                            {
                                "text": {
                                    "raw": "혜택기본형",
                                    "nlp": "혜택 기본 형"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "추천해 드리기 전에 고객님께서 어떤 카드를 원하시는지 몇 가지만 여쭤볼께요. 할인과 포인트 적립중 어떤 것을 선호하시나요?\n \n 1. 할인(캐시백)\n 2. 포인트 적립",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "할인"
                                    },
                                    {
                                        "url": "",
                                        "text": "포인트"
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
                        "id": "default8",
                        "children": [
                            {
                                "name": "혜택기본-할인",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "할인",
                                            "nlp": "할인"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "캐시백",
                                            "nlp": "캐시 백"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "고객님은 어떤 소비유형에 가까우신가요?\n \n 1. 일상생활의 다양한 할인을 추구한다.\n 2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n 3. 기름값, 교통비 할인을 원하는 실속파다.",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "생활할인형"
                                            },
                                            {
                                                "url": "",
                                                "text": "소비추구형"
                                            },
                                            {
                                                "url": "",
                                                "text": "OIL실속형"
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
                                        "name": "생활할인형 카카오, 페이스북",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "생활",
                                                    "nlp": "생활"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "생활할인형",
                                                    "nlp": "생활 하다 인형"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "고객님께서 좋아하실만한 신용카드가 4가지나 있네요. 아래 4가지 카드 중에서 관심있는 카드를 선택해주세요. \n \n 1. 싱글족을 위한 맞춤형 카드 [신한카드 Mr.Life]\n\n 2. 직장인의 최적화 할인카드 [신한카드 B.BIG]\n\n 3. 점심값부터 커피, 통신, 직구 할인 [신한카드 Noon]\n\n 4. 마트,병원,주유할인과 금융서비스 혜택까지 [신한카드 미래설계]",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "Mr.Life"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "B.BIG"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "Noon"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "미래설계"
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
                                        "id": "default10",
                                        "children": [
                                            {
                                                "name": "Mr.Life",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "Mr.Life",
                                                            "nlp": "Mr.Life"
                                                        }
                                                    },
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
                                                            "raw": "mr life",
                                                            "nlp": "mr life"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 Mr.Life]\n싱글족을 위한 맞춤형 카드 \n\n✔ 시간대별 할인\n✔ 주말사용, 공과금 할인\n\n-연회비\nVISA 1만 8천원\nS& 1만 5천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+Mr.Life"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350239_39388.html?EntryLoc=2774&empSeq=522&datakey=&agcCd=",
                                                                "text": "바로가기"
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
                                                "id": "default11"
                                            },
                                            {
                                                "name": "B.BIG",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "B",
                                                            "nlp": "B"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "B.BIG",
                                                            "nlp": "B . BIG"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "big",
                                                            "nlp": "big"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 B.BIG]\n직장인의 최적화 할인카드 \n\n✔ 대중교통 최대600원 할인\n✔ 백화점,커피,편의점,영화 할인\n\n-연회비\nVISA 1만 3천원\nS& 1만원\nUPI 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+B.Big%5B%EC%82%91%5D"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350240_39388.html",
                                                                "text": "바로가기"
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
                                                "id": "default12"
                                            },
                                            {
                                                "name": "Noon",
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
                                                            "raw": "Noon",
                                                            "nlp": "Noon"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 NOON]\n굿 애프터Noon~!! \n\n✔ 점심값 20%할인\n✔ 커피, 통신, 택시 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n-연회비\nMaster 8천원\nUPI 8천원\n\n자세한 내용을 보시려면 카드 아래의 링크를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+Noon"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1364066_39388.html",
                                                                "text": "바로가기"
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
                                                "id": "default13"
                                            },
                                            {
                                                "name": "미래설계",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "미래설계",
                                                            "nlp": "미래 설계"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "미래",
                                                            "nlp": "미래"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "설계",
                                                            "nlp": "설계"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 미래설계]\n생활할인과 금융서비스 혜택까지 \n \n✔ 전 가맹점 포인트 적립\n✔ 각종 생활비 할인\n✔ 신한생명 보험료 할인\n\n-연회비\nLocal[국내] 1만 5천원\nVisa 2만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+%EB%AF%B8%EB%9E%98%EC%84%A4%EA%B3%84"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350241_39388.html",
                                                                "text": "바로가기"
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
                                                "id": "default14"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "소비추구형 카카오, 페이스북",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "소비추구형",
                                                    "nlp": "소비 추구 형"
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
                                                "text": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 4가지나 있네요. 아래 4가지 카드 중에서 관심있는 카드를 선택해주세요. \n \n 1. 온라인 결제는 FAN으로 5% 할인 [신한카드 Always FAN]\n\n 2. 온•오프라인을 뛰어넘는 할인 제공 [신한카드 O2O]\n\n 3. Trendy한 욜로족을 위한 할인 제공 [신한카드 YOLO Tasty]\n\n 4. 여성 프리미엄 회원을 위한 카드입니다 [신한카드 The LADY CLASSIC]",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "Always FAN"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "O2O"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "YOLO Tasty"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "The Lady CLASSIC"
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
                                        "id": "default16",
                                        "children": [
                                            {
                                                "name": "Always FAN",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "Always FAN",
                                                            "nlp": "Always FAN"
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
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 Always FAN]\n온라인 결제 특화 카드 \n\n✔ FAN페이 온라인결제 5% 할인\n✔ 커피,영화,편의점 할인\n\n-연회비\nS& 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+Always+FAN"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350234_39388.html",
                                                                "text": "바로가기"
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
                                                "id": "default17"
                                            },
                                            {
                                                "name": "O2O",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "O2O",
                                                            "nlp": "O2O"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 O2O]\n온•오프라인을 뛰어넘는 할인!\n\n✔ 모바일 전용카드 Pay 할인\n✔ 스타벅스 사이렌오더 할인\n\n-연회비\nMaster 1만 3천원\nS& 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+O2O"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350244_39388.html",
                                                                "text": "바로가기"
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
                                                "id": "default18"
                                            },
                                            {
                                                "name": "YOLO Tasty",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "YOLO Tasty",
                                                            "nlp": "YOLO Tasty"
                                                        }
                                                    },
                                                    {
                                                        "text": {
                                                            "raw": "Yol",
                                                            "nlp": "Yol"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 YOLO Tasty]\nTrendy한 욜로족을 위한 할인!\n\n✔ 쇼핑,다이닝,몰링 10% 할인\n✔ 영화,택시,커피 할인\n\n-연회비\nVISA 1만 3천원\nS& 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+YOLO+Tasty"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350238_39388.html",
                                                                "text": "바로가기"
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
                                                "id": "default19"
                                            },
                                            {
                                                "name": "The Lady CLASSIC",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "The Lady CLASSIC",
                                                            "nlp": "The Lady CLASSIC"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 The LADY CLASSIC]\n여성 프리미엄 회원을 위하여!\n\n✔ 쇼핑•육아•웰빙 캐시백\n\n-연회비\nVISA 10만 5천원\nUPI 10만원\n가족카드 3만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+The+LADY+CLASSIC"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/premium/1350224_39478.html",
                                                                "text": "바로가기"
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
                                                "id": "default20"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "OIL 실속형",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "OIL실속형",
                                                    "nlp": "OIL 실속 형"
                                                }
                                            },
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
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "(광고) [GS칼텍스 신한카드 Shine]\n카드가 딱이네요!\n\n✔ GS칼텍스 주유 할인\n✔ 대중교통 할인\n\n-연회비\nVISA 1만2천원, 2만2천원(플래티늄)\nMASTER 1만2천원, 2만2천원(플래티늄)\nURS 7천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/GS%EC%B9%BC%ED%85%8D%EC%8A%A4+%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+Shine"
                                                },
                                                "buttons": [
                                                    {
                                                        "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1364067_39388.html",
                                                        "text": "바로가기"
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
                                        "id": "default15"
                                    }
                                ]
                            },
                            {
                                "name": "신용카드-포인트적립",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "포인트",
                                            "nlp": "포인트"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "고객님은 어떤 소비유형에 가까우신가요?\n \n 1. 카드는 포인트가 최고라고 생각한다.\n 2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n 3. 여행을 좋아한다. 항공마일리지에 집중!\n 4. 기름값, 생활비 적립을 원하는 실속파다.",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "포인트집착형"
                                            },
                                            {
                                                "url": "",
                                                "text": "소비추구형"
                                            },
                                            {
                                                "url": "",
                                                "text": "여행덕후형"
                                            },
                                            {
                                                "url": "",
                                                "text": "OIL실속형"
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
                                "id": "default21",
                                "children": [
                                    {
                                        "name": "포인트집착형",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "포인트집착형",
                                                    "nlp": "포인트 집착 형"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "[신한카드 Deep Dream]\n카드가 딱이네요! \n\n✔ 국내/외 전가맹점 0.7%적립\n✔ 5대 DREAM영역 3배(총 2.1%) 적립\n✔ DREAM영역 중 가장 많이 쓴 영역 5배(총3.5%) 적립\n✔ 주유/택시 할인 서비스\n\n- 연회비\nUPI 8천원\nVISA 1만원\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+Deep+Dream"
                                                },
                                                "buttons": [
                                                    {
                                                        "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1445616_33659.html?EntryLoc2=2872&empSeq=561&datakey=&agcCd=",
                                                        "text": "바로가기"
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
                                        "id": "default22"
                                    },
                                    {
                                        "name": "신용카드-소비추구형 카카오, 페이스북",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "소비추구형",
                                                    "nlp": "소비 추구 형"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 2가지가 있네요. 아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요. \n \n 1. 1년에 최대 60만 포인트 적립. 포인트 적립의 끝판왕! [신한카드 Hi-Point]\n\n 2.신한카드 레저 맴버가 되고 싶은 고객님을 위한 카드입니다 [신한카드 The CLASSIC-L]",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "Hi-Point"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "The CLASSIC-L"
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
                                        "id": "default23",
                                        "children": [
                                            {
                                                "name": "HiPoint",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "Hi-Point",
                                                            "nlp": "Hi - Point"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 Hi-Pint]\n포인트 적립의 끝판왕! \n\n✔ 모든 가맹점 적립\n✔ 주유 60원 적립\n\n-연회비\nVISAI 1만원, 1만5천원(플래티늄)\nMaster 1만원, 1만5천원(플래티늄)\nURS 8천원\nJCB 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+Hi-Point+%EC%B9%B4%EB%93%9C"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350243_39388.html",
                                                                "text": "바로가기"
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
                                                "id": "default24"
                                            },
                                            {
                                                "name": "The CLASSIC-L",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "The CLASSIC-L",
                                                            "nlp": "The CLASSIC - L"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 The CLASSIC-L]\n레저를 원하는 당신을 위해!!\n\n✔ 리조트•캠핑 무료 숙박\n✔ 주유 할인\n\n-연회비\nMaster 10만 5천원(캐시백형), 11만 5천원(마일리지형)\nURS 10만원(캐시백형), 11만원(마일리지형)\n가족카드 3만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+The+CLASSIC-L"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/premium/1350227_39478.html",
                                                                "text": "바로가기"
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
                                                "id": "default25"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "여행덕후형 카카오, 페이스북",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "여행덕후형",
                                                    "nlp": "여행 덕후 형"
                                                }
                                            },
                                            {
                                                "text": {
                                                    "raw": "항공",
                                                    "nlp": "항공"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "여행 즐기시는 고객님께서 좋아하실만한 신용카드가 3가지나 있네요. 아래 3가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요. \n \n 1. 아시아나 마일리지 적립의 끝판왕 [신한카드 아시아나 Air1.5]\n\n 2. 항공 마일리지에 다양한 포인트 적립까지 제공합니다 [신한카드 Air Platinum#]\n\n 3. 항공 마일리지 적립, PP카드와 Gift Option 제공 [신한카드 The Classic+ 카드]",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "아시아나 Air1.5"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "Air Platinum#"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "The Classic+"
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
                                        "id": "default26",
                                        "children": [
                                            {
                                                "name": "아시아나 Air1.5",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "아시아나 Air1.5",
                                                            "nlp": "아시아나 Air 1 . 5"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 아시아나 Air 1.5]\n기승전 마일리지!! \n\n✔ 아시아나 마일리지 특화적립\n\n-연회비\nLocal[국내] 4만 3천원\nMaster 4만 5천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%95%84%EC%8B%9C%EC%95%84%EB%82%98+%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+Air+1.5"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "",
                                                                "text": "바로가기"
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
                                                "id": "default27"
                                            },
                                            {
                                                "name": "Air Platinum#",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "Air Platinum",
                                                            "nlp": "Air Platinum #"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 Air Platinum#]\n마일리지와 포인트를 동시에!\n\n✔ 항공 마일리지 적립\n✔ 포인트 추가 적립\n✔ 무료 주차/발렛파킹 \n\n-연회비\nVISA 4만원\nMaster 4만원\nURS 3만 7천원\n가족카드 5천원(별도)\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+Air+Platinum%23"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350232_39388.html",
                                                                "text": "바로가기"
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
                                                "id": "default28"
                                            },
                                            {
                                                "name": "The Classic+",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "The Classic+",
                                                            "nlp": "The Classic +"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "(광고) [신한카드 The Classic+]\n매년 최대 12만원 Gift옵션 제공\n\n✔ 항공마일리지 추가적립\n✔ PP카드 제공\n✔ Gift Option선택\n\n-연회비\nAMEX 12만 5천원\nURS 12만원\n가족카드 3만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+The+CLASSIC%2B"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/premium/1350225_39478.html",
                                                                "text": "바로가기"
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
                                                "id": "default29"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "신용카드-OIL실속형",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "OIL실속형",
                                                    "nlp": "OIL 실속 형"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "(광고) [신한카드 RPM+ Platinum#]\n카드가 딱이네요!\n\n✔ 모든 주유소 적립\n✔ 모든 가맹점 적립\n\n-연회비\nVISA 3만 5천원\nUPI 3만 2천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
                                                "image": {
                                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+RPM%2B+Platinum%23"
                                                },
                                                "buttons": [
                                                    {
                                                        "url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350231_39388.html",
                                                        "text": "바로가기"
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
                                        "id": "default30"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "체크카드",
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
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "체크카드를 선택하셨군요! 소득공제와 카드 혜택 둘다 잡아야죠~\n\n고객님이 직접 혜택을 필요한 것만 골라 구성할 수도 있고, 미리 구성되어 있는 카드 중에서 고르실 수도 있어요. \n아래 보기중에서 선택해 주세요. \n\n 1. 직접 혜택을 구성하고 싶다 (혜택선택형)\n 2. 구성되어 있는 카드를 고르고 싶다(혜택기본형)",
                        "buttons": [
                            {
                                "url": "",
                                "text": "혜택선택형"
                            },
                            {
                                "url": "",
                                "text": "혜택기본형"
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
                "id": "default31",
                "children": [
                    {
                        "name": "체크카드-혜택선택형",
                        "input": [
                            {
                                "text": {
                                    "raw": "혜택선택형",
                                    "nlp": "혜택 선택 형"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "[신한카드 4Tune체크]\n카드가 딱이네요!\n\n✔ 기본적립 + 선택적립\n✔ 커피 10%할인 \n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
                                "image": {
                                    "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+4Tune+%EC%B2%B4%ED%81%AC"
                                },
                                "buttons": [
                                    {
                                        "url": "https://m.shinhancard.com/conts/html/card/apply/check/1350273_39409.html",
                                        "text": "바로가기"
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
                        "id": "default32"
                    },
                    {
                        "name": "체크카드-혜택기본형",
                        "input": [
                            {
                                "text": {
                                    "raw": "혜택기본형",
                                    "nlp": "혜택 기본 형"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "신용카드를 추천해드리기 전에 간단하게 고객님께서 어떤 카드를 원하시는지 몇 가지만 여쭤볼께요. \n2030세대 이신가요~?\n \n 1. 2030세대에요\n 2. 2030세대가 아니에요",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "2030세대에요"
                                    },
                                    {
                                        "url": "",
                                        "text": "2030세대가 아니에요"
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
                        "id": "default33",
                        "children": [
                            {
                                "name": "2030세대에요",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "2030세대에요",
                                            "nlp": "2030 세대 에요"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "2030 맞춤 혜택 상품으로 추천해 드릴까요?\n \n 1. 네, 추천해주세요!\n 2. 아니오, 좀더 찾아주세요.",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "네 추천해주세요"
                                            },
                                            {
                                                "url": "",
                                                "text": "아니요 좀 더 찾아주세요"
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
                                "id": "default34",
                                "children": [
                                    {
                                        "name": "2030세대 추천",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "네 추천해주세요",
                                                    "nlp": "네 추천 하다"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "2030세대에 어울리는 카드가 2가지가 있네요. 아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해 주세요. \n \n 1. 스무살, 첫 금융특권 [신한 S20 체크카드]\n 2. 스무살, 첫 금융특권 [신한 S20 Pink 체크카드]",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "S20"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "S20 Pink"
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
                                                "name": "S20",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "S20",
                                                            "nlp": "S 20"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "[신한 S20 체크카드]\n스무살, 첫 금융특권\n\n✔ 쇼핑, 편의점, 통신, 커피 할인\n✔ 어학원,서점,학원 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C+S20+%EC%B2%B4%ED%81%AC%EC%B9%B4%EB%93%9C"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/check/1350266_39409.html",
                                                                "text": "바로가기"
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
                                                "id": "default36"
                                            },
                                            {
                                                "name": "S20 Pink",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "S20 Pink",
                                                            "nlp": "S 20 Pink"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "[신한 S20 pink체크카드]\n스무살, 첫 금융특권\n\n✔ 쇼핑, 편의점, 통신, 커피 할인\n✔ 어학원,서점,학원 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C+S20+Pink+%EC%B2%B4%ED%81%AC%EC%B9%B4%EB%93%9C"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "https://m.shinhancard.com/conts/html/card/apply/check/1350263_39409.html",
                                                                "text": "바로가기"
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
                                                "id": "default37"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "2030세대 찾아주세요",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "아니요 좀 더 찾아주세요",
                                                    "nlp": "아니다 좀 더 찾다"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "text": "",
                                                "type": "call",
                                                "dialogName": "2030세대가 아니에요",
                                                "dialog": "2030세대가 아니에요"
                                            }
                                        ],
                                        "id": "default39"
                                    }
                                ]
                            },
                            {
                                "name": "2030세대가 아니에요",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "2030세대가 아니에요",
                                            "nlp": "2030 세대 가 아니다"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "그렇다면 고객님의 소비성향을 알려주세요. \n\n1. 주유, 쇼핑 등 생활 혜택에 관심이 있으신 알뜰 실속파\n2. 해외에서도 혜택은 챙기는 센스실속파\n3. 카드는 포인트 적립이 최고라고 생각하는 슈퍼 실속파",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "알뜰신속파"
                                            },
                                            {
                                                "url": "",
                                                "text": "센스실속파"
                                            },
                                            {
                                                "url": "",
                                                "text": "슈퍼실속파"
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
                                "id": "default38",
                                "children": [
                                    {
                                        "name": "알뜰신속파",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "알뜰신속파",
                                                    "nlp": "알뜰 신속 파"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "생활 혜택에 관심이 있으신 알뜰하신 고객님께서 좋아하실만한 체크카드가 4가지가 있네요. 아래 4가지 카드 중에서 자세히 보고 싶으신 카드를 선택해주세요. \n \n1. 쿠팡과 스타벅스를 많이 이용하신다면? [쿠팡 신한카드 체크]\n\n2. 카카오페이를 많이 이용하신다면? [카카오페이 신한 체크카드]\n\n3. 할인,적립,신한금융 서비스를 원한다면? [신한카드 S-Line 체크]\n\n4. 고속도로를 많이 이용하신다면? [신한카드 하이패스(전용) 체크]",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "쿠팡"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "카카오페이"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "S-Line"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "하이패스"
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
                                        "id": "default40",
                                        "children": [
                                            {
                                                "name": "쿠팡",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "쿠팡",
                                                            "nlp": "쿠팡"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "[쿠팡 신한카드 체크]\n\n✔ 쿠팡 캐시 무제한 적립\n✔ 스타벅스 10% 캐시백\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%BF%A0%ED%8C%A1+%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+%EC%B2%B4%ED%81%AC"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "",
                                                                "text": "바로가기"
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
                                                "id": "default41"
                                            },
                                            {
                                                "name": "카카오페이",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "카카오페이",
                                                            "nlp": "카카오 페이"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "[카카오페이 신한 체크카드]\n\n✔ 카카오페이 10% 캐시백\n✔ GS25, 스타벅스 10% 캐시백\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%8E%98%EC%9D%B4+%EC%8B%A0%ED%95%9C+%EC%B2%B4%ED%81%AC%EC%B9%B4%EB%93%9C"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "",
                                                                "text": "바로가기"
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
                                                "id": "default42"
                                            },
                                            {
                                                "name": "S-Line",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "S-Line",
                                                            "nlp": "S - Line"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "[신한카드 S-Line 체크]\n\n✔ 할인+적립+금융우대 서비스\n✔ 전가맹점 포인트 적립\n✔ 요식,대중교통 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+S-Line+%EC%B2%B4%ED%81%AC"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "",
                                                                "text": "바로가기"
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
                                                "id": "default43"
                                            },
                                            {
                                                "name": "하이패스",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "하이패스",
                                                            "nlp": "하이패스"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "[신한카드 하이패스(전용) 체크]\n\n✔ 하이패스 요금 적립\n✔ 출퇴근시간대 통행료 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
                                                        "image": {
                                                            "url": "https://s3.ap-northeast-2.amazonaws.com/playchat-shinhancard/%EC%8B%A0%ED%95%9C%EC%B9%B4%EB%93%9C+%ED%95%98%EC%9D%B4%ED%8C%A8%EC%8A%A4(%EC%A0%84%EC%9A%A9)+%EC%B2%B4%ED%81%AC"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "url": "",
                                                                "text": "바로가기"
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
                                                "id": "default44"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "센스실속파",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "센스실속파",
                                                    "nlp": "센스 실속 파"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "해외에서도 누릴 수 있는 혜택에 관심이 있으신 센스있는 고객님께서 좋아하실만한 신용카드가 2가지가 있어요. 아래 2가지 카드 중에서 자세히 보고 싶으신 카드를 선택해주세요. \n\n1. 해외 직구와 해외여행을 알뜰하게 하고 싶다면 [Smart Global 신한카드 체크]\n2. 여행으로 마일리지 모으고 있다면 [신한카드 YOLO Triplus 체크]",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "Smart Global"
                                                    },
                                                    {
                                                        "url": "",
                                                        "text": "YOLO Triplus"
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
                                        "id": "default45",
                                        "children": [
                                            {
                                                "name": "Smart Global",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "Smart Global",
                                                            "nlp": "Smart Global"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "[Smart Global 신한카드 체크]\n\n✔ 해외/국내 이용 캐시백 ✔ 해외 현금인출 이용 캐시백 \n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
                                                        "buttons": [
                                                            {
                                                                "url": "",
                                                                "text": "바로가기"
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
                                                "id": "default46"
                                            },
                                            {
                                                "name": "YOLO Triplus",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "YOLO Triplus",
                                                            "nlp": "YOLO Triplus"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "[신한카드 YOLO Triplus 체크]\n\n✔ 전가맹점 마일리지 적립\n✔ 국내외 스타벅스 마일리지 적립\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
                                                        "buttons": [
                                                            {
                                                                "url": "",
                                                                "text": "바로가기"
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
                                                "id": "default47"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "슈퍼실속파",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "슈퍼실속파",
                                                    "nlp": "슈퍼 실속 파"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "[신한카드 Deep Dream 체크]\n카드가 딱이네요!\n\n✔ 국내/외 전가맹점 0.2% 적립\n✔ 5대 DREAM영역 3배(총 0.6%) 적립\n✔ DREAM영역 중 가장 많이 쓴 영역 5배(총 1.0%) 적립\n✔ 주유/택시 할인 서비스\n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
                                                "buttons": [
                                                    {
                                                        "url": "",
                                                        "text": "바로가기"
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
                                        "id": "default48"
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
        "name": "FAN에 대해 자주하는 질문들(FAQ)",
        "input": [
            {
                "text": {
                    "raw": "궁금한게 있는데요(FAQ)",
                    "nlp": "궁금하다 있다 ( FAQ )"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "궁금하신 부분을 단어로 입력해 주시면 제가 아는 가장 알맞은 답변을 안내해 드리겠습니다."
            }
        ],
        "id": "default49"
    },
    {
        "name": "페이스북 상담톡",
        "input": [
            {
                "text": {
                    "raw": "페북 지기",
                    "nlp": "페북 지기"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "페북지기에게 메시지를 자유롭게 남겨주세요.\n자유 메시지는 바로 응답되지 않지만, 페북지기가 영업시간내 모두 확인합니다.\n\n메시지를 모두 남기신 후, 챗봇으로 돌아가시려면 '시작'이라고 입력해 주세요."
            }
        ],
        "id": "default50"
    },
    {
        "name": "정치",
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
                "kind": "Content",
                "text": "이런 질문엔 아! 그렇군요 라고 답하라고 배웠습니다. \"아, 그렇군요\" \n\n궁금하신 다른 키워드를 입력해 주세요."
            }
        ],
        "id": "default51"
    },
    {
        "name": "욕설",
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
                "kind": "Content",
                "text": "헉. 고객님을 화나게 하다니..\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
            },
            {
                "kind": "Content",
                "text": "… 응? 고객님을 화나게 해드리다니 반성합니다.\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
            },
            {
                "kind": "Content",
                "text": "죄송하지만 고객님! 저도 상처 받아요 ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
            },
            {
                "kind": "Content",
                "text": "키힝~ 무서워요.ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
            }
        ],
        "id": "default52"
    },
    {
        "name": "칭찬",
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
        ],
        "id": "default53"
    },
    {
        "name": "인사",
        "input": [
            {
                "text": {
                    "raw": "ㅇㅅ",
                    "nlp": "ㅇㅅ"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "안녕 반가워요 :) 저는 여러분과 인사를 나누는 이 시간이 제일 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            },
            {
                "kind": "Content",
                "text": "이렇게 인사 잘 해주시는 분은 난생 처음이에요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            },
            {
                "kind": "Content",
                "text": "고객님도 안녕하세요! \n먼저 인사해 주셔서 전 지금 감동 최고조 입니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            }
        ],
        "id": "default54"
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
                "type": "repeat",
                "text": "아직 부족해서 죄송해요. 매일 더 나아지려 노력하고 있어요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            },
            {
                "kind": "Action",
                "if": "((new Date()).getTime() % 4) ==1",
                "type": "repeat",
                "text": "제가 태어난 지 얼마 안 됐거든요… 더 열심히 공부할게요!\\n\\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            },
            {
                "kind": "Action",
                "if": "((new Date()).getTime() % 4) ==2",
                "type": "repeat",
                "text": "제가 아직 배우는 중이라 조금 부족해도 이해해주세용~\\n\\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
            },
            {
                "kind": "Action",
                "if": "((new Date()).getTime() % 4) ==3",
                "type": "repeat",
                "text": "오늘 컨디션이 별로라서… 흠흠.. 다음엔 꼭 답변해드릴게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
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
            {
                "kind": "Content",
                "text": "전 아직 알파고가 아닙니다. 죄송합니다. 다시 한번 궁금하신 키워드를 입력해 주시겠습니까?"
            },
            {
                "kind": "Content",
                "text": "어제도 혼났습니다. 고객님 말씀 못 알아듣는다고… T.,T 다시 한번 단어로 입력해 주시겠습니까?"
            },
            {
                "kind": "Content",
                "text": "계속 못 알아들어서 죄송합니다. 알파고 학원이라도 등록해야겠습니다. 다른 단어를 입력해 주시면 안 될까요?"
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
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}