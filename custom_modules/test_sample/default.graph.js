var dialogs = [
    {
        "name": "사용자 입력 테스트",
        "input": [
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
                "text": "사용자 입력관련 기능들 중 테스트 원하는 기능을 선택하세요.",
                "buttons": [
                    {
                        "url": "",
                        "text": "1. 키워드"
                    },
                    {
                        "url": "",
                        "text": "2. 엔터티"
                    },
                    {
                        "url": "",
                        "text": "3. 인텐트"
                    },
                    {
                        "url": "",
                        "text": "4. 정규식"
                    },
                    {
                        "url": "",
                        "text": "5. 타입"
                    },
                    {
                        "url": "",
                        "text": "6. 조건문"
                    },
                    {
                        "url": "",
                        "text": "7. 변수"
                    }
                ]
            }
        ],
        "id": "default95",
        "children": [
            {
                "name": "키워드",
                "input": [
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
                        "text": "1. OR 조건 테스트\n->'키', '워드', 'OR' 중 하나를 입력\n\n2. AND 조건 테스트 \n->'AND 조건' 입력\n\n3. OR 조건 + AND 조건 테스트\n-> '키 워드', 'OR 조건', 'AND 조건' 중 입력"
                    }
                ],
                "id": "default12",
                "children": [
                    {
                        "name": "키워드 방식",
                        "input": [
                            {
                                "text": {
                                    "raw": "키 워드 방식",
                                    "nlp": "키 워드 방식"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "키워드 방식이란 '사용자 입력'에 입력된 키워드를 사용자가 입력했을 경우에 해당 대화 카드가 실행되는 방식을 뜻합니다."
                            }
                        ],
                        "id": "default13"
                    },
                    {
                        "name": "OR 조건 테스트",
                        "input": [
                            {
                                "text": {
                                    "raw": "키",
                                    "nlp": "키"
                                }
                            },
                            {
                                "text": {
                                    "raw": "워드",
                                    "nlp": "워드"
                                }
                            },
                            {
                                "text": {
                                    "raw": "OR",
                                    "nlp": "OR"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "키 또는 워드 또는 OR 또는 조건 중 어느 키워드를 입력해도 대화 카드가 실행됩니다.\nOR 조건은 '사용자 입력'을 여러 개 설정하면 됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default14"
                    },
                    {
                        "name": "AND 조건 테스트",
                        "input": [
                            {
                                "text": {
                                    "raw": "AND 조건",
                                    "nlp": "AND 조건"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "'AND' '조건'을 모두 입력했을 시에 실행됩니다.\nAND 조건은 '사용자 입력'에 띄어쓰기 형태로 여러 키워드를 설정하면 됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default15"
                    }
                ]
            },
            {
                "name": "엔터티",
                "input": [
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
                        "text": "1. 동물 엔터티 테스트\n-> 말, 호랑이, 고양이 입력\n\n2. 상의 엔터티 테스트\n->긴팔, 반팔 입력"
                    }
                ],
                "id": "default0",
                "children": [
                    {
                        "name": "엔터티 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "터티 기능",
                                    "nlp": "터티 기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "엔터티는 '개체명'이라고 번역할 수 있습니다. 예를 들어, 말, 고양이, 호랑이 등의 '개체'들을 동물이라는 '개체명' 즉, 엔터티로 묶을 수 있습니다. \n'사용자 입력'에 @ 입력시 자동으로 엔터티 가이드가 등장합니다. 말, 고양이, 호랑이 등을 포함한 @동물 엔터티를 만들고, '사용자 입력' @동물을 입력하면, 사용자가 말, 고양이, 호랑이를 입력했을 때 해당 대화 카드가 실행됩니다.\n엔터티 관리는 왼쪽 네비게이션 바에  관리 -> 엔터티 에서 할 수 있습니다."
                            }
                        ],
                        "id": "default1"
                    },
                    {
                        "name": "엔터티 구현",
                        "input": [
                            {
                                "entities": "동물 ",
                                "text": {
                                    "raw": " ",
                                    "nlp": ""
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "@동물 엔터티에는 말, 호랑이, 고양이가 포함되어 있습니다. 사용자가 말, 호랑이, 고양이를 입력했을 시에 본 대화 카드가 실행됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default2",
                        "children": []
                    },
                    {
                        "name": "엔터티 구현2",
                        "input": [
                            {
                                "entities": "상의"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "@상의 엔터티에는 긴팔, 반팔 등이 포함되어 있습니다. 사용자가 김팔, 반팔 등을 입력했을 시에 본 대화카드가 실행됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default3"
                    }
                ]
            },
            {
                "name": "인텐트",
                "input": [
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
                        "text": "1. 검색 인텐트 테스트\n-> 검색해줘, 찾아줘 등 입력\n\n2. 정지 인텐트 테스트\n-> 멈춰줘, 그만해 등 입력"
                    }
                ],
                "id": "default8",
                "children": [
                    {
                        "name": "인텐트 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "인 텐트 기능",
                                    "nlp": "인 텐트 기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "인텐트는 의도를 뜻합니다. \n\n'사용자 입력'을 인텐트로 입력하면 하나의 의도를 가진 여러가지 표현의 문장을 함께 처리할 수 있습니다.\n \n예를 들어,  '검색 인텐트'를 만들어 '검색해줘', '찾아줘' 등을 포함시키면 여러 문장을 하나의 인텐트로 처리할 수 있습니다.\n\n'사용자 입력'에 #을 입력하면 인텐트 가이드가 실행됩니다.\n\n인텐트 관리는 왼쪽 네비게이션 바의 관리 -> 인텐트 에서 할 수 있습니다."
                            }
                        ],
                        "id": "default9"
                    },
                    {
                        "name": "인텐트 구현 _ 검색",
                        "input": [
                            {
                                "intent": "검색"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "#검색 인텐트가 실행됐습니다.\n\n검색 인텐트에는 '찾아줘', '검색해줘' 등이 포함되어 있습니다.\n\n사용자가 '찾아줘', '검색해줘' 등을 입력했을 시 해당 대화 카드가 실행됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default10"
                    },
                    {
                        "name": "인텐트 구현 _ 정지",
                        "input": [
                            {
                                "intent": "정지",
                                "text": {
                                    "raw": " ",
                                    "nlp": ""
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "#정지 인텐트가 실행됐습니다.\n\n정지 인텐트에는 '멈춰줘', '그만해' 등이 포함되어 있습니다.\n\n사용자가 '멈춰줘', '그만해' 등을 입력했을 시에 해당 대화 카드가 실행됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default11"
                    }
                ]
            },
            {
                "name": "정규식",
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
                        "text": "1. 핸드폰 번호 정규식 테스트\n-> 010-3030-2811 형태 입력\n\n2. 이메일 정규식 테스트\n-> 5709psy@moneybrain.ai 형태 입력"
                    }
                ],
                "id": "default16",
                "children": [
                    {
                        "name": "정규식 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "정규식 기능",
                                    "nlp": "정규식 기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "정규식은 특정한 규칙을 가진 문자열을 표현하는 데 사용하는 형식을 뜻합니다. \n\n'사용자 입력'을 정규식으로 입력하면 특정한 패턴을 가진 사용자의 입력을 처리할 수 있습니다.\n \n예를 들어,  핸드폰 번호처럼 그 값이 정해져 있는 것이 아니라 특정한 패턴의 문자열을 입력 받을 때 이용할 수 있습니다.\n\n'사용자 입력'에 /을 입력하면 정규식 가이드가 실행됩니다.\n\n정규식에 대한 연습은 아래의 사이트에서 해볼 수 있습니다.",
                                "buttons": [
                                    {
                                        "url": "https://regexr.com",
                                        "text": "정규식 연습"
                                    }
                                ]
                            }
                        ],
                        "id": "default17"
                    },
                    {
                        "name": "정규식 구현_핸드폰번호",
                        "input": [
                            {
                                "regexp": "d{2,3}-d{3,4}-d{4}"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "/정규식/이 실행됐습니다.\n\n위의 정규식은 핸드폰 번호 패턴을 입력 받습니다.\n\n사용자가 '010-3030-2811', '017-123-1234' 등을 입력했을 시 해당 대화 카드가 실행됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default18",
                        "children": []
                    },
                    {
                        "name": "정규식 구현 _ 이메일",
                        "input": [
                            {
                                "regexp": "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "/정규식/이 실행됐습니다.\n\n위의 정규식은 이메일 패턴을 입력 받습니다.\n\n사용자가 '5709psy@gmail.com', 'info@moneybrain.ai' 등을 입력했을 시 해당 대화 카드가 실행됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default19"
                    }
                ]
            },
            {
                "name": "타입",
                "input": [
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
                        "text": "1. mobile 타입 테스트\n-> 010-3030-2811 또는 01030302811  형식 입력\n\n2. email 타입 테스트\n-> 5709psy@moneybrain.ai 형식 입력"
                    }
                ],
                "id": "default20",
                "children": [
                    {
                        "name": "타입 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "타입 기능",
                                    "nlp": "타입 기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "타입은 특정한 규칙을 가진 문자열을 표현하는 데 사용하는 형식을 뜻합니다. \n\n'사용자 입력'을 타입으로 입력하면 특정한 패턴을 가진 사용자의 입력을 처리할 수 있습니다.\n \n예를 들어,  핸드폰 번호처럼 그 값이 정해져 있는 것이 아니라 특정한 패턴의 문자열을 입력 받을 때 이용할 수 있습니다.\n\n'사용자 입력'에 $을 입력하면 타입 가이드가 실행됩니다.\n\n타입은 정규식과 같은 방식으로 작동하지만, 함수 차원에서 구현한다는 점에서 다릅니다.\n\n미리 생성되어 있는 타입을 이용할 수 있고, 사용자 맞춤 타입을 새로 만들 수 있습니다."
                            }
                        ],
                        "id": "default21"
                    },
                    {
                        "name": "타입 구현 _ 모바일",
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
                                "text": "$타입이 실행됐습니다.\n\n위의 타입은 핸드폰 번호 패턴을 입력 받습니다.\n\n사용자가 '010-3030-2811', '017-123-1234' 등을 입력했을 시 해당 대화 카드가 실행됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default22"
                    },
                    {
                        "name": "타입 구현 _ 이메일",
                        "input": [
                            {
                                "types": [
                                    "email"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "$타입이 실행됐습니다.\n\n위의 타입은 이메일 패턴을 입력 받습니다.\n\n사용자가 '5709psy@gmail.com', 'info@moneybrain.ai' 등을 입력했을 시 해당 대화 카드가 실행됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default23"
                    }
                ]
            },
            {
                "name": "input_if",
                "input": [
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
                        "text": "1. if(변수) 테스트\n->dialog.data.test에 값 입력\n\n2. if(true) 테스트\n-> 아무거나 입력"
                    }
                ],
                "id": "default4",
                "children": [
                    {
                        "name": "입력 조건문 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "입력 조건문 기능",
                                    "nlp": "입력 조건문 기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "입력 조건문은 '사용자 입력'에 해당 카드 실행에 조건을 입력하는 기능입니다. \n\n'입력 조건문'을 IF 문으로 입력하면 특정한 조건을 만족시킬 시에 해당 대화 카드를 실행시킬 수 있습니다.\n \n예를 들어,  사용자 인증을 거쳤냐의 여부에 따라 해당 대화 카드를 실행시킬 경우 입력 조건문을 활용할 수 있습니다. \n\n'사용자 입력'에 if를 입력하면 입력 조건문 가이드가 실행됩니다."
                            }
                        ],
                        "id": "default5"
                    },
                    {
                        "name": "입력 조건 _ 사용자 인증",
                        "input": [
                            {
                                "if": "context.user.auth"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "if입력 조건이 실행됐습니다.\n\n위의 입력 조건은 사용자 인증 여부를 판단합니다.\n\n사용자가 인증을 거쳐 context.user.auth에 값이 존재할 시에 해당 대화 카드가 실행됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default6"
                    },
                    {
                        "name": "입력 조건 _ 무조건 실행",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "if입력 조건이 실행됐습니다.\n\n위의 입력 조건은 true입니다.\n\n입력 조건이 true이기 때문에 해당 대화 카드는 모든 사용자 입력에 대해 실행됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default7"
                    }
                ]
            },
            {
                "name": "input_variable",
                "input": [
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
                        "text": "input_variable"
                    }
                ],
                "id": "default24",
                "children": [
                    {
                        "name": "키워드 방식",
                        "input": [
                            {
                                "text": {
                                    "raw": "키 워드 방식",
                                    "nlp": "키 워드 방식"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "키워드 방식이란 '사용자 입력'에 입력된 키워드를 사용자가 입력했을 경우에 해당 대화 카드가 실행되는 방식을 뜻합니다."
                            }
                        ],
                        "id": "default25"
                    },
                    {
                        "name": "키워드 OR 조건",
                        "input": [
                            {
                                "text": {
                                    "raw": "키",
                                    "nlp": "키"
                                }
                            },
                            {
                                "text": {
                                    "raw": "워드",
                                    "nlp": "워드"
                                }
                            },
                            {
                                "text": {
                                    "raw": "OR",
                                    "nlp": "OR"
                                }
                            },
                            {
                                "text": {
                                    "raw": "조건",
                                    "nlp": "조건"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "키 또는 워드 또는 OR 또는 조건 중 어느 키워드를 입력해도 대화 카드가 실행됩니다.\nOR 조건은 '사용자 입력'을 여러 개 설정하면 됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default26"
                    },
                    {
                        "name": "키워드 AND 조건",
                        "input": [
                            {
                                "text": {
                                    "raw": "AND 조건",
                                    "nlp": "AND 조건"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "'AND' '조건'을 모두 입력했을 시에 실행됩니다.\nAND 조건은 '사용자 입력'에 띄어쓰기 형태로 여러 키워드를 설정하면 됩니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default27"
                    }
                ]
            }
        ]
    },
    {
        "name": "챗봇 답변 테스트",
        "input": [
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
                "text": "챗봇 답변 테스트"
            }
        ],
        "id": "default96",
        "children": [
            {
                "name": "output_call",
                "input": [
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
                        "text": "output_call"
                    }
                ],
                "id": "default28",
                "children": [
                    {
                        "name": "대화이동 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "기능",
                                    "nlp": "기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "대화 흐름은 기본적으로 부모 카드에서 자식 카드로 이동합니다.\n\n대화이동은 특정 대화카드에서 임의의 다른 대화카드로 이동하기 위한 기능입니다.\n\nA 대화카드에서 B 대화카드로 대화이동을 할 경우에, A 대화카드의 '챗봇답변'이 실행되고, B 대화카드로 커서(Cursor)가 이동합니다."
                            }
                        ],
                        "id": "default29"
                    },
                    {
                        "name": "대화이동 구현",
                        "input": [
                            {
                                "text": {
                                    "raw": "구현",
                                    "nlp": "구현"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "대화이동 실행을 위해서 아래의 버튼을 눌러주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "대화이동 실행"
                                    }
                                ]
                            }
                        ],
                        "id": "default30",
                        "children": [
                            {
                                "name": "대화이동 실행 카드",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "대화 이동 실행",
                                            "nlp": "대화 이동 실행"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "call",
                                        "dialogName": "대화이동된 카드",
                                        "dialogId": "default32",
                                        "text": "'대화이동 실행 카드'에서\n'대화이동된 카드'로\n 이동했습니다.\n\n현재 커서는 '대화이동된 카드'에 있습니다.\n\n테스트를 위해 '대화이동된 카드'의 자식 카드에 질문을 입력해보세요."
                                    }
                                ],
                                "id": "default31"
                            }
                        ]
                    },
                    {
                        "name": "대화이동된 카드",
                        "input": [
                            {
                                "if": "false"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "'사용자 입력'이 if(false)이기 때문에 대화이동을 통해서만 본 카드에 접근 가능합니다.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "1"
                                    },
                                    {
                                        "url": "",
                                        "text": "2"
                                    }
                                ]
                            }
                        ],
                        "id": "default32",
                        "children": [
                            {
                                "name": "대화이동 테스트 카드1",
                                "input": [
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
                                        "text": "1번 카드입니다."
                                    }
                                ],
                                "id": "default33",
                                "children": []
                            },
                            {
                                "name": "대화이동 테스트 카드2",
                                "input": [
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
                                        "text": "2번 카드입니다."
                                    }
                                ],
                                "id": "default34"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "output_callchild",
                "input": [
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
                        "text": "output_callchild"
                    }
                ],
                "id": "default351",
                "children": [
                    {
                        "name": "대화이동 후 검색 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "기능",
                                    "nlp": "기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "대화 흐름은 기본적으로 부모 카드에서 자식 카드로 이동합니다.\n\n'대화이동 후 검색'은 대화이동 후, 이동한 대화카드의 자식들에 대하여 검색을 실행하는 기능입니다.\n\nA 대화카드에서 B 대화카드로 대화이동 후 검색을 실행할 경우, B 대화카드로 커서(Cursor)가 이동한 후 A 대화카드에서 받은 사용자 입력으로  B의 자식들에 대하여 검색을 실행합니다. \n\nA 대화카드에서 받은 사용자 입력으로 검색한 다음 매칭된 대화 카드가 없을 경우 B 대화카드로 커서가 이동하고, 매칭된 대화 카드가 있을 경우 매칭된 대화 카드로 커서가 이동합니다.\n\n따라서 커서가 '대화이동 후 검색 실행 대화카드'에 있을 때, 사용자가 대화이동 후 검색 이라고 입력했을 경우 B(대화 이동 후 검색될 카드)의 자식 중 매칭될 수 있는 카드가 없어 B로 커서가 이동하고, 사용자가 1이라고 입력할 경우 B의 자식 중 '검색될 자식카드1'로 커서가 이동합니다.\n\n챗봇 답변은 대화이동 후 검색 기능을 실행하는 대화카드에서 챗봇 답변이 있을 경우 해당 답변이 실행되며, 없을 경우 커서가 이동한 대화카드의 챗봇 답변이 실행됩니다."
                            }
                        ],
                        "id": "default36"
                    },
                    {
                        "name": "대화이동 후 검색 실행",
                        "input": [
                            {
                                "text": {
                                    "raw": "실행",
                                    "nlp": "실행"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "대화이동 후 검색 실행을 위해서 아래의 버튼을 눌러주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "대화이동 후 검색"
                                    }
                                ]
                            }
                        ],
                        "id": "default37",
                        "children": [
                            {
                                "name": "대화이동 후 검색 실행 카드",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "callChild",
                                        "dialogName": "대화 이동 후 검색될 카드",
                                        "dialogId": "default39",
                                        "text": "대화이동 후 검색을 실행합니다."
                                    }
                                ],
                                "id": "default38"
                            }
                        ]
                    },
                    {
                        "name": "대화 이동 후 검색될 카드",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "대화 이동됐습니다."
                            }
                        ],
                        "id": "default39",
                        "children": [
                            {
                                "name": "검색될 자식카드1",
                                "input": [
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
                                        "text": "1"
                                    }
                                ],
                                "id": "default40"
                            },
                            {
                                "name": "검색될 자식카드2",
                                "input": [
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
                                        "text": "2"
                                    }
                                ],
                                "id": "default41"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "output_if",
                "input": [
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
                        "text": "output_if"
                    }
                ],
                "id": "default423",
                "children": [
                    {
                        "name": "답변IF 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "기능",
                                    "nlp": "기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "답변IF 기능은 하나의 대화카드에서 조건에 따라 다른 답변을 내놓는 기능입니다.\n\n예를 들어, 사용자의 대화 채널(카카오, 페이스북 등)에 따라 다른 답변을 내놓아야 할 때 활용할 수 있습니다.\n\n챗봇 답변을 여러개 만들었을 시  사용 가능합니다.\n\nIF 안에서 변수에 대한 접근이 가능합니다."
                            }
                        ],
                        "id": "default43"
                    },
                    {
                        "name": "답변IF 구현 _ 소켓",
                        "input": [
                            {
                                "text": {
                                    "raw": "소켓 구현",
                                    "nlp": "소켓 구현"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "대화 이름 : 답변IF 구현 _ 소켓\n\n소켓(socket) 채널로 대화중입니다.",
                                "if": "context.user.channel == 'socket'"
                            },
                            {
                                "kind": "Content",
                                "text": "대화 이름 : 답변IF 구현 _ 소켓\n\n소켓이 아닌 다른 채널에서 대화중입니다."
                            }
                        ],
                        "id": "default44"
                    },
                    {
                        "name": "답변IF 구현 _ 카카오",
                        "input": [
                            {
                                "text": {
                                    "raw": "카카오 구현",
                                    "nlp": "카카오 구현"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "대화 이름 : 답변IF 구현 _ 카카오\n\n\n카카오 채널로 대화중입니다.",
                                "if": "context.user.channel == 'kakao'"
                            },
                            {
                                "kind": "Content",
                                "text": "대화 이름 : 답변IF 구현 _ 카카오\n\n소켓 채널로 대화중입니다."
                            }
                        ],
                        "id": "default45"
                    }
                ]
            },
            {
                "name": "output_repeat",
                "input": [
                    {
                        "text": {
                            "raw": "11",
                            "nlp": "11"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "output_repeat"
                    }
                ],
                "id": "default46",
                "children": [
                    {
                        "name": "다시질문하기 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "기능",
                                    "nlp": "기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "대화 흐름은 기본적으로 부모 카드에서 자식 카드로 이동합니다.\n\n다시질문하기 기능은 사용자의 입력값에 부합하는 자식 대화 카드가 없을 때 커서가 이동하지 않고 챗봇 답변을 다시 실행하는 즉, 다시 질문하는 기능입니다.\n\n다시질문하기는 막내 대화카드에서 사용자 입력을 if(true)로 설정하고 부모 대화카드로 대화이동을 구현한 것과 동일합니다. \n\n사용자에게 특정 대답을 요구할 때 사용 가능합니다.\n\n예를 들어, 핸드폰 번호를 물어볼 경우 그에 해당하지 않는 사용자의 입력값이 들어오면 다시 물어보는 기능입니다."
                            }
                        ],
                        "id": "default47"
                    },
                    {
                        "name": "다시질문하기 실행 _ 핸드폰",
                        "input": [
                            {
                                "text": {
                                    "raw": "실행",
                                    "nlp": "실행"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "다시질문하기 기능을 실행하겠습니다.\n\n핸드폰 번호를 입력해주세요."
                            }
                        ],
                        "id": "default48",
                        "children": [
                            {
                                "name": "핸드폰 번호 입력받기",
                                "input": [
                                    {
                                        "types": [
                                            "mobile"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "핸드폰 번호를 입력해주셨습니다."
                                    }
                                ],
                                "id": "default49"
                            },
                            {
                                "name": "다시질문하기 실행 카드",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "repeat",
                                        "text": "다시질문하기 기능이 실행됐습니다.\n\n핸드폰 번호가 아닙니다. \n\n다시 핸드폰 번호를 입력해주세요."
                                    }
                                ],
                                "id": "default50"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "output_returncall",
                "input": [
                    {
                        "text": {
                            "raw": "12",
                            "nlp": "12"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "output_returncall"
                    }
                ],
                "id": "default51",
                "children": [
                    {
                        "name": "돌아가기용 대화이동 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "기능",
                                    "nlp": "기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "대화 흐름은 기본적으로 부모 카드에서 자식 카드로 이동합니다.\n\n돌아가기용 대화이동 기능은 대화이동과 동일하게 작동합니다.\n\n다만 대화이동한 후 특정 대화 카드에서 돌아가기 기능을 실행했을 시, 돌아가기용 대화이동을 실행했던 대화 카드의 부모 카드로 커서가 이동합니다."
                            }
                        ],
                        "id": "default52"
                    },
                    {
                        "name": "돌아가기용 대화이동 실행",
                        "input": [
                            {
                                "text": {
                                    "raw": "실행",
                                    "nlp": "실행"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "돌아가기용 대화이동 실행 실행을 위해서 아래의 버튼을 눌러주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "돌아가기용 대화 이동 실행"
                                    }
                                ]
                            }
                        ],
                        "id": "default53",
                        "children": [
                            {
                                "name": "돌아가기용 대화 이동 실행카드",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "돌아가다 대화 이동 실행",
                                            "nlp": "돌아가다 대화 이동 실행"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "returnCall",
                                        "dialogName": "돌아가기 대화 준비",
                                        "dialogId": "default55",
                                        "text": "돌아가기용 대화 이동 기능을 실행했습니다.\n\n돌아가고 싶을 경우 돌아가기 기능을 이용해주세요.\n\n돌아가기용 대화이동 기능을 실행한 부모 대화카드로 커서가 이동합니다."
                                    }
                                ],
                                "id": "default54"
                            }
                        ]
                    },
                    {
                        "name": "돌아가기 대화 준비",
                        "input": [
                            {
                                "if": "false"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "사용자 입력이 if(false)이기 때문에 대화 이동으로만 접근 가능합니다.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "돌아가기 실행"
                                    }
                                ]
                            }
                        ],
                        "id": "default55",
                        "children": [
                            {
                                "name": "돌아가기",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "돌아가다 실행",
                                            "nlp": "돌아가다 실행"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "type": "return",
                                        "text": "돌아가기"
                                    }
                                ],
                                "id": "default56"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "output_up",
                "input": [
                    {
                        "text": {
                            "raw": "13",
                            "nlp": "13"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "output_up"
                    }
                ],
                "id": "default57",
                "children": [
                    {
                        "name": "이전대화이동 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "기능",
                                    "nlp": "기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "대화 흐름은 기본적으로 부모 카드에서 자식 카드로 이동합니다.\n\n이전 대화이동 기능은 대화상에서 '이전'이라고 입력했을 때 이전 대화 카드로 이동하는 기능을 말합니다."
                            }
                        ],
                        "id": "default58"
                    },
                    {
                        "name": "이전대화이동 준비",
                        "input": [
                            {
                                "text": {
                                    "raw": "준비",
                                    "nlp": "준비"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "이전대화이동을 잘 살펴보기 위해 의도적으로 뎁스를 만들 었습니다. \n\n준비라고 입력해주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "준비"
                                    }
                                ]
                            }
                        ],
                        "id": "default59",
                        "children": [
                            {
                                "name": "이전대화이동 실행",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "준비",
                                            "nlp": "준비"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "이전대화이동 실행을 위해서 아래의 버튼을 눌러주세요.",
                                        "type": "",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "이전대화이동 실행"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default60",
                                "children": [
                                    {
                                        "name": "이전대화이동 실행 카드",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "이전 대화 이동 실행 카드",
                                                    "nlp": "이전 대화 이동 실행 카드"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Action",
                                                "type": "up",
                                                "dialogName": "돌아가기 대화 준비",
                                                "dialogId": "default55",
                                                "text": "이전 대화로 이동했습니다."
                                            }
                                        ],
                                        "id": "default61"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "output_variable",
                "input": [
                    {
                        "text": {
                            "raw": "14",
                            "nlp": "14"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "output_variable"
                    }
                ],
                "id": "default62",
                "children": [
                    {
                        "name": "변수 접근 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "변수 접근 기능",
                                    "nlp": "변수 접근 기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "'챗봇 답변'은 고정된 답변을 해줄 수도 있지만, 동적인 답변을 해줘야 하는 경우도 있습니다.\n\n예를 들어, 챗봇 답변에서 챗봇 이름을 직접 입력할 수도 있지만(상수), 변수를 이용해 입력 할 수도 있습니다.\n\n예시 : \\+botName+\n\n변수는 context.user 혹은 context.dialog 혹은 context.bot 객체의 key 값입니다. \n\n예시 : context.bot.botName -> 변수명 : botName\n\n변수들은 default.js 파일에서 조작할 수 있습니다.\n\n변수의 값은 문자열, 객체, 배열 중 하나입니다."
                            }
                        ],
                        "id": "default63"
                    },
                    {
                        "name": "변수 접근 구현 _ 문자열",
                        "input": [
                            {
                                "text": {
                                    "raw": "문자열",
                                    "nlp": "문자열"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "값이 문자열인 변수는 \\+변수명+ 형태로 접근할 수 있습니다.\n\ncontext.bot.botName에 접근하고 싶을 때는 다음과 같이 입력합니다.\n\n\\+botName+\n\n아래는 이스케이프 없이 구성된 결과입니다.\n\n+botName+"
                            }
                        ],
                        "id": "default64"
                    },
                    {
                        "name": "변수 접근 구현 _객체",
                        "input": [
                            {
                                "text": {
                                    "raw": "객체",
                                    "nlp": "객체"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "값이 객체인 변수는 \\+변수명.key+ 형태로 접근할 수 있습니다.\n\n예를 들어, \ncontext.dialog.movieDataObject = \n{\n date: '2018년',\ntitle: '살인사건'\n}\n일 경우, 다음과 같이 접근합니다.\n\n\\+movieDataObject.date+\n\\+movieDataObject.title+\n\n아래는 이스케이프 없이 구성된 결과입니다.\n\n+movieDataObject.date+\n+movieDataObject.title+"
                            }
                        ],
                        "id": "default65"
                    },
                    {
                        "name": "변수 접근 구현 _배열",
                        "input": [
                            {
                                "text": {
                                    "raw": "배열",
                                    "nlp": "배열"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "값이 배열인 변수는 \\#변수명\\# 형태로 접근할 수 있습니다.\n\n예를 들어, \ncontext.dialog.movieDataArray = \n[\n\n{\n date: '2018년',\ntitle: '살인사건'\n},\n{\n date: '2017년',\ntitle: '추격자'\n},\n\n]\n일 경우, 다음과 같이 접근합니다.\n\n\\#movieDataArray\\#\n\n\\#변수\\#을 할 경우, 자체적으로 배열에 담긴 요소 하나씩에 접근합니다. \n\n배열에 담긴 요소 하나씩을 접근해 나타내기 위해서는 다음과 같이 접근합니다.\n\n\\#변수\\#각 요소에 대한 접근\\#\n\n마지막 \\#은 각 요소에 대한 접근을 마무리한다는 의미이며, 그에 따라 \\#각 요소에 대한 접근\\# 부분이 반복됩니다.\n\n\\#각 요소에 대한 접근\\#에서는 \\+key+의 형태로 각 요소의 value에 접근할 수 있습니다.\n\n\\#movieDataArray\\# \\+date+ +title+\\#\n\n\\#각 요소에 대한 접근\\#에서는 \\+index+가 자동으로 추가되어 해당 요소의 순번을 알 수가 있습니다.\n\n최종적으로 다음과 같이 활용 가능합니다.\n\n\\#movieDataArray\\#\n\\+index+.\n타이틀은 \\+title+입니다.\n날짜는 \\+date+입니다.\n\n\\#\n\n아래는 이스케이프 없이 구성된 결과입니다.\n\n#movieDataArray#\n+index+.\n타이틀은 +title+입니다.\n날짜는 +date+입니다.\n\n#"
                            }
                        ],
                        "id": "default66"
                    }
                ]
            }
        ]
    },
    {
        "name": "답변 전 실행함수 테스트",
        "input": [
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
                "text": "답변 전 실행함수 테스트"
            }
        ],
        "id": "default97",
        "children": [
            {
                "name": "task_api",
                "input": [
                    {
                        "text": {
                            "raw": "15",
                            "nlp": "15"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "task_api"
                    }
                ],
                "id": "default673",
                "children": [
                    {
                        "name": "함수 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "함수 기능",
                                    "nlp": "함수 기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "함수는 챗봇 답변이 실행 되기 전 자바스크립트(Java Script)를 이용해 다양한 테스크(TASK)를 처리하는 기능입니다. \n \n예를 들어, 답변 전 실행함수에서 api함수를 만들어 외부 서버의 API를 이용할 수 있습니다.\n\n답변 전 실행 함수 입력 창에 포커스 되면 함수 가이드가 실행됩니다.\n\ndefault.js 파일에 함수를 만듭니다.\n\nAPI 이용에 대한 자세한 설명을 원하시면 아래 버튼을 눌러주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "함수 구조 설명"
                                    },
                                    {
                                        "url": "",
                                        "text": "API 이용 설명"
                                    }
                                ]
                            }
                        ],
                        "id": "default68",
                        "children": [
                            {
                                "name": "함수 구조 설명",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "함수 구조 설명",
                                            "nlp": "함수 구조 설명"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "함수의 구조는 다음과 같습니다.\n\nvar testTask = \n{\n\n       action: function (task, context, callback) \n{\n\n\t\t\t//함수 기능  코드 삽입\n\n\t\t    callback(task, context)\n}\n\n}\n\ntestTask라는 변수(var)에 객체(예시 : {key: value})를 넣습니다. \n\ntestTask 객체의 경우 key가 action이고 value가 함수입니다. \n\n함수는 task, context, callback을 매개변수로 받습니다.\n\n1. task\n\ntask에는 함수에 대한 정보가 들어 있으며, 챗봇 답변의 텍스트, 버튼, 이미지를 조작할 수 있습니다.\n\n2. context\n\ncontext에는 사용자에 대한 정보(context.user), 챗봇에 대한 정보(context.bot), 사용자의 입력값에 대한 정보(context.dialog) 등이 들어있습니다.\n\n3. callback\n\ncallback은 해당 함수를 끝내는 기능을 가지기 때문에, 함수의 기능이 끝난 지점에 위치시킵니다.\n\n//함수 기능 코드 삽입 부분에서 task, context, callback 매개변수를 이용하여 원하는 기능을 구현합니다.",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "함수 파라미터 task 구체적 설명"
                                            },
                                            {
                                                "url": "",
                                                "text": "함수 파라미터 context 구체적 설명"
                                            },
                                            {
                                                "url": "",
                                                "text": "함수 파라미터 callback 구체적 설명"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default69",
                                "children": [
                                    {
                                        "name": "함수 파라미터 task",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "함수 파라미터 task 구체 설명",
                                                    "nlp": "함수 파라미터 task 구체 설명"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "함수 파라미터 task에는 해당 함수에 대한 정보가 들어옵니다.\n\n또한 task 파라미터를 통해서 '챗봇 답변'의 텍스트, 이미지, 버튼을 동적으로 조작할 수 있습니다.\n\n1, 텍스트 동적 조작\n\ntask.output = '제 이름은' + context.bot.botName + '입니다.'\n\n챗봇 답변의 텍스트가 동적으로 조작됩니다.\n\n2, 이미지 조작\n\ntask.image = {url: 'http://moneybrain.ai/img/dark-logo.jpg'}\n\n챗봇 답변의 이미지가 해당 url의 이미지로 변경됩니다.\n\n3, 버튼  조작\n\ntask.buttons = [{text : '버튼1'}, {text: '버튼2', url: 'http://map.naver.com'}]\n\n챗봇 답변의 버튼이 해당 버튼들로 변경됩니다."
                                            }
                                        ],
                                        "id": "default70"
                                    },
                                    {
                                        "name": "함수 파라미터 context",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "함수 파라미터 context 구체 설명",
                                                    "nlp": "함수 파라미터 context 구체 설명"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "함수 파라미터 context에는 챗봇 정보, 사용자 정보, 대화 정보 등이 담겨 있습니다.\n\n1, 챗봇 정보\n\ncontext.bot = \n{\n\t    botName: \"playchat\",\n\t    description: \"playchat 봇입니다.\"\n\t    using: true,\n            ....\n}\ncontext.bot.botName과 같은 형태로 해당 값에 접근할 수 있습니다.\n\n2, 사용자 정보\n\ncontext.user = \n{\nuserKey:\"5a4d91842b7a1e41079c0d9a\",\n            ....\n}\ncontext.user.userKey와 같은 형태로 해당 값에 접근할 수 있습니다.\n\n3, 채널 정보\n\ncontext.channel = \n{\n\t\tname: \"kakao\",\n\t\t...\n}\n\ncontext.channel.name와 같은 형태로 해당 값에 접근할 수 있습니다.\n\n4, 대화 정보\n\ncontext.dialog = \n{\n\t\tinNLP = \"반갑다\",\n\t\tinRaw = \"반갑스무니다\",\n\t\tinCurRaw = \"반갑스무니다\",\n\t\t...\n}\ncontext.dialog.inRaw와 같은 형태로 해당 값에 접근할 수 있습니다.\n\ninRaw는 자연어 처리되기 전 사용자의 입력 값이고, inNLP는 자연어 처리된 사용자의 입력 값입니다."
                                            }
                                        ],
                                        "id": "default71"
                                    },
                                    {
                                        "name": "함수 파라미터 callback",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "함수 파라미터 callback 구체 설명",
                                                    "nlp": "함수 파라미터 callback 구체 설명"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "함수 파라미터 callback은 실행될 경우 해당 기능 함수가 종료됩니다.\n\n따라서 해당 기능 함수의 로직이 끝난 다음에 실행되어야 합니다.\n\ncallback에 대한 더 자세한 이해를 원하시는 분은 자바스크립트(Java Script) callback 개념을 살펴보시기 바랍니다.",
                                                "buttons": [
                                                    {
                                                        "url": "https://opentutorials.org/course/743/6508",
                                                        "text": "자바스크립트 Callback 이해하기"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default72"
                                    }
                                ]
                            },
                            {
                                "name": "API 구현 설명",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "API 이용 설명",
                                            "nlp": "API 이용 설명"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "API 이용을 위해서는 한 가지 자바스크립트(Node.js) 모듈을 이용합니다.\n\n모듈을 이용하기 위해서는 default.js 파일의 최상단에 다음을 추가합니다.\n\nvar request = require('request')\n\nrequest라는 모듈을 require하여 request 라는 변수(var)에 넣는 것입니다.\n\nrequest 모듈을 이용해 사용하고자 하는 API에 http 요청을 보내 결과 값을 가져옵니다.\n\nvar client_id = 'tXRaAWut2_2R5OkcLpLQ'\n\nvar client_secret = 'TaU4yqU4fI'\n\nvar api_url = 'https://openapi.naver.com/v1/search/movie.json'\n\nvar options = \n{\n            method : \"GET\",\n            url : api_url,\n            headers : {'X-Naver-Client-Id' : client_id, 'X-Naver-Client-Secret' : client_secret},\n            qs: { query: '사건'}\n}\n\nrequest(options, \nfunction(err, response, body)\n{\n//body에 들어온 정보를 이용해 코드 구성\n}\n)\n\n결과 값을 context.dialog.apiResult에 담습니다.\n\ncontext.dialog.apiResult = body\n\n위의 예시는 네이버 API 중 영화 검색 API를 이용해 '사건'을 검색한 것입니다.",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "request 모듈 설명"
                                            },
                                            {
                                                "url": "",
                                                "text": "API 이용 설명"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default73",
                                "children": [
                                    {
                                        "name": "request 모듈 설명",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "request 모듈 설명",
                                                    "nlp": "request 모듈 설명"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "request 모듈은 http 요청을 외부 서버에 간단하게 보내게 해주는 모듈입니다.\n\n사용법은 request(option, callback함수)입니다.\n\n1. option\nrequest함수의 option 매개 변수는 http 요청의 구체적 내용을 설정하는 것입니다.\n\n예시.\nvar option = \n{\nmethod: 'GET',\nurl: 'https://playchat.ai',\n}\n\noption 란에 url을 단순히 입력할시 method는 GET으로 설정됩니다.\n\n2. callback 함수\n\nrequest함수의 callback함수 매개 변수는 http 요청 이후의 결과를 받는 함수입니다.\n\nfuction(err, response, body)\n{\n\n}\n\ncallback함수의 err 매개변수는 만약 http 요청이 오류가 났을 시에 값이 담겨 옵니다.\n\ncallback함수의 response 매개변수는 http 요청의 서버 반응 값들이 담겨 옵니다.\n\nbody의 결과 값을 이용해 원하는 조작을 하면 됩니다.\n\ncallback함수의 body 매개변수는 http 요청의 결과 값이 담겨 옵니다."
                                            }
                                        ],
                                        "id": "default74"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "함수 구현 _ API",
                        "input": [
                            {
                                "text": {
                                    "raw": "api",
                                    "nlp": "api"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "API를 실행했습니다.\n\nAPI의 결과는 아래와 같습니다.\n\n#context.session.movieData.items#\n+index+.\n+title+\n\n#"
                            }
                        ],
                        "task": {
                            "name": "api"
                        },
                        "id": "default75"
                    }
                ]
            },
            {
                "name": "task_crawling",
                "input": [
                    {
                        "text": {
                            "raw": "16",
                            "nlp": "16"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "task_crawling"
                    }
                ],
                "id": "default765",
                "children": [
                    {
                        "name": "함수 기능",
                        "input": [
                            {
                                "text": {
                                    "raw": "함수 기능",
                                    "nlp": "함수 기능"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "함수는 챗봇 답변이 실행 되기 전 자바스크립트(Java Script)를 이용해 다양한 테스크(TASK)를 처리하는 기능입니다. \n \n예를 들어, 답변 전 실행함수에 crawling함수를 만들어 특정한 인터넷 상의 페이지를 크롤링할 수 있습니다.\n\n답변 전 실행 함수 입력 창에 포커스 되면 함수 가이드가 실행됩니다.\n\ndefault.js 파일에 함수를 만듭니다.\n\n크롤링 구현에 대한 자세한 설명을 원하시면 아래 버튼을 눌러주세요.",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "함수 구조 설명"
                                    },
                                    {
                                        "url": "",
                                        "text": "크롤링 구현 설명"
                                    }
                                ]
                            }
                        ],
                        "id": "default77",
                        "children": [
                            {
                                "name": "함수 구조 설명",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "함수 구조 설명",
                                            "nlp": "함수 구조 설명"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "함수의 구조는 다음과 같습니다.\n\nvar testTask = \n{\n\n       action: function (task, context, callback) \n{\n\n\t\t\t//함수 기능  코드 삽입\n\n\t\t    callback(task, context)\n}\n\n}\n\ntestTask라는 변수(var)에 객체(예시 : {key: value})를 넣습니다. \n\ntestTask 객체의 경우 key가 action이고 value가 함수입니다. \n\n함수는 task, context, callback을 매개변수로 받습니다.\n\n1. task\n\ntask에는 함수에 대한 정보가 들어 있으며, 챗봇 답변의 텍스트, 버튼, 이미지를 조작할 수 있습니다.\n\n2. context\n\ncontext에는 사용자에 대한 정보(context.user), 챗봇에 대한 정보(context.bot), 사용자의 입력값에 대한 정보(context.dialog) 등이 들어있습니다.\n\n3. callback\n\ncallback은 해당 함수를 끝내는 기능을 가지기 때문에, 함수의 기능이 끝난 지점에 위치시킵니다.\n\n//함수 기능 코드 삽입 부분에서 task, context, callback 매개변수를 이용하여 원하는 기능을 구현합니다.",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "함수 파라미터 task 구체적 설명"
                                            },
                                            {
                                                "url": "",
                                                "text": "함수 파라미터 context 구체적 설명"
                                            },
                                            {
                                                "url": "",
                                                "text": "함수 파라미터 callback 구체적 설명"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default78",
                                "children": [
                                    {
                                        "name": "함수 파라미터 task",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "함수 파라미터 task 구체 설명",
                                                    "nlp": "함수 파라미터 task 구체 설명"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "함수 파라미터 task에는 해당 함수에 대한 정보가 들어옵니다.\n\n또한 task 파라미터를 통해서 '챗봇 답변'의 텍스트, 이미지, 버튼을 동적으로 조작할 수 있습니다.\n\n1, 텍스트 동적 조작\n\ntask.output = '제 이름은' + context.bot.botName + '입니다.'\n\n챗봇 답변의 텍스트가 동적으로 조작됩니다.\n\n2, 이미지 조작\n\ntask.image = {url: 'http://moneybrain.ai/img/dark-logo.jpg'}\n\n챗봇 답변의 이미지가 해당 url의 이미지로 변경됩니다.\n\n3, 버튼  조작\n\ntask.buttons = [{text : '버튼1'}, {text: '버튼2', url: 'http://map.naver.com'}]\n\n챗봇 답변의 버튼이 해당 버튼들로 변경됩니다."
                                            }
                                        ],
                                        "id": "default79"
                                    },
                                    {
                                        "name": "함수 파라미터 context",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "함수 파라미터 context 구체 설명",
                                                    "nlp": "함수 파라미터 context 구체 설명"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "함수 파라미터 context에는 챗봇 정보, 사용자 정보, 대화 정보 등이 담겨 있습니다.\n\n1, 챗봇 정보\n\ncontext.bot = \n{\n\t    botName: \"playchat\",\n\t    description: \"playchat 봇입니다.\"\n\t    using: true,\n            ....\n}\ncontext.bot.botName과 같은 형태로 해당 값에 접근할 수 있습니다.\n\n2, 사용자 정보\n\ncontext.user = \n{\nuserKey:\"5a4d91842b7a1e41079c0d9a\",\n            ....\n}\ncontext.user.userKey와 같은 형태로 해당 값에 접근할 수 있습니다.\n\n3, 채널 정보\n\ncontext.channel = \n{\n\t\tname: \"kakao\",\n\t\t...\n}\n\ncontext.channel.name와 같은 형태로 해당 값에 접근할 수 있습니다.\n\n4, 대화 정보\n\ncontext.dialog = \n{\n\t\tinNLP = \"반갑다\",\n\t\tinRaw = \"반갑스무니다\",\n\t\tinCurRaw = \"반갑스무니다\",\n\t\t...\n}\ncontext.dialog.inRaw와 같은 형태로 해당 값에 접근할 수 있습니다.\n\ninRaw는 자연어 처리되기 전 사용자의 입력 값이고, inNLP는 자연어 처리된 사용자의 입력 값입니다."
                                            }
                                        ],
                                        "id": "default80"
                                    },
                                    {
                                        "name": "함수 파라미터 callback",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "함수 파라미터 callback 구체 설명",
                                                    "nlp": "함수 파라미터 callback 구체 설명"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "함수 파라미터 callback은 실행될 경우 해당 기능 함수가 종료됩니다.\n\n따라서 해당 기능 함수의 로직이 끝난 다음에 실행되어야 합니다.\n\ncallback에 대한 더 자세한 이해를 원하시는 분은 자바스크립트(Java Script) callback 개념을 살펴보시기 바랍니다.",
                                                "buttons": [
                                                    {
                                                        "url": "https://opentutorials.org/course/743/6508",
                                                        "text": "자바스크립트 Callback 이해하기"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default81"
                                    }
                                ]
                            },
                            {
                                "name": "크롤링 구현 설명",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "크롤 링 구현 설명",
                                            "nlp": "크롤 링 구현 설명"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "크롤링을 위해서는 두 가지 자바스크립트(Node.js) 모듈을 이용합니다.\n\n모듈을 이용하기 위해서는 default.js 파일의 최상단에 다음을 추가합니다.\n\nvar request = require('request')\nvar cheerio = require('cheerio')\n\nrequest라는 모듈을 require하여 request 라는 변수(var)에 넣는 것입니다.\n\nrequest 모듈을 이용해 크롤링 원하는 URL의 html 파일을 가져오면, 그 값이 body에 담깁니다.\n\nrequest(url, \nfunction(err, response, body)\n{\n//body에 들어온 정보를 이용해 코드 구성\n}\n)\n\ncheerio 모듈을 이용해 body에 담긴 html 파일을 로드하고, 크롤링하기 원하는 부분을 선택하며, 이를 문자열로 바꿔 결과값을 얻습니다.\nvar $ = cheerio.load(body)\nvar selector = '#content > div.section.invest_trend > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2) > em'\nvar result = $(selector).text()\n\n결과 값을 context.dialog.crawlingResult에 담습니다.\n\ncontext.dialog.crawlingResult = result",
                                        "buttons": [
                                            {
                                                "url": "",
                                                "text": "request 모듈 설명"
                                            },
                                            {
                                                "url": "",
                                                "text": "cheerio 모듈 설명"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default82",
                                "children": [
                                    {
                                        "name": "request 모듈 설명",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "request 모듈 설명",
                                                    "nlp": "request 모듈 설명"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "request 모듈은 http 요청을 외부 서버에 간단하게 보내게 해주는 모듈입니다.\n\n사용법은 request(option, callback함수)입니다.\n\n1. option\nrequest함수의 option 매개 변수는 http 요청의 구체적 내용을 설정하는 것입니다.\n\n예시.\nvar option = \n{\nmethod: 'GET',\nurl: 'https://playchat.ai',\n}\n\noption 란에 url을 단순히 입력할시 method는 GET으로 설정됩니다.\n\n2. callback 함수\n\nrequest함수의 callback함수 매개 변수는 http 요청 이후의 결과를 받는 함수입니다.\n\nfuction(err, response, body)\n{\n\n}\n\ncallback함수의 err 매개변수는 만약 http 요청이 오류가 났을 시에 값이 담겨 옵니다.\n\ncallback함수의 response 매개변수는 http 요청의 서버 반응 값들이 담겨 옵니다.\n\nbody의 결과 값을 이용해 원하는 조작을 하면 됩니다.\n\ncallback함수의 body 매개변수는 http 요청의 결과 값이 담겨 옵니다."
                                            }
                                        ],
                                        "id": "default83"
                                    },
                                    {
                                        "name": "cheerio 모듈 설명",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "cheerio 모듈 설명",
                                                    "nlp": "cheerio 모듈 설명"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "cheerio 모듈을 이용해 html 파일을 로드하고, 크롤링하기 원하는 부분을 선택하며, 이를 문자열로 바꿔 결과값을 얻습니다.\n\n1. html 파일 로드\n\nvar $ = cheerio.load(body)\n\nrequest 모듈을 통해 얻은 body(html 파일)을 cheerio 모듈을 이용해 로드한 후 $라는 변수에 넣습니다.\n\n2. 특정 부분 선택\n\nvar selector = '#content > div.section.invest_trend > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2) > em'\n\n웹 페이지에서 마우스 오른쪽 버튼 클릭 -> 검사 -> 개발자 도구 Elements창에서 원하는 부분 오른쪽 클릭 -> Copy -> Copy selector 하시면 해당 부분의 selector가 복사 됩니다.\n\n3. 문자열로 변환 후 결과 값\n\nvar result = $(selector).text()\n\nhtml 파일을 로드한 $변수에 selector 매개변수를 넣어 실행하고, 이를 텍스트로 바꾸는 함수를 연달아 시행해 그 결과값을 result 변수에 넣습니다.\n\n더 자세한 설명을 원하시면 아래의 버튼을 눌러주세요.",
                                                "buttons": [
                                                    {
                                                        "url": "https://cheerio.js.org/",
                                                        "text": "cheerio 모듈 설명"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default84"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "함수 구현 _ 크롤링",
                        "input": [
                            {
                                "text": {
                                    "raw": "크롤 링",
                                    "nlp": "크롤 링"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "크롤링이 실행됐습니다.\n\n크롤링의 결과는 아래와 같습니다.\n\n+context.session.crawlingResult+"
                            }
                        ],
                        "task": {
                            "name": "crawling"
                        },
                        "id": "default85",
                        "children": []
                    }
                ]
            },
            {
                "name": "태스크 파라미터",
                "input": [
                    {
                        "text": {
                            "raw": "18",
                            "nlp": "18"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "태스크 파라미터"
                    }
                ],
                "id": "default42",
                "children": [
                    {
                        "name": "테스크 파라미터",
                        "input": [
                            {
                                "text": {
                                    "raw": " ",
                                    "nlp": ""
                                },
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "함수 실행 결과입니다.\n\ntaskParams : +dialog.data.taskParams+"
                            }
                        ],
                        "task": {
                            "name": "taskParams"
                        },
                        "id": "default91"
                    }
                ]
            },
            {
                "name": "테스크 필수 파라미터",
                "input": [
                    {
                        "text": {
                            "raw": "19",
                            "nlp": "19"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "필수 파라미터인 모바일 타입이 입력되었습니다."
                    }
                ],
                "task": {
                    "name": ""
                },
                "id": "default67",
                "children": [
                    {
                        "name": "테스크 필수 파라미터 실행",
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
                                "text": "테스크 필수 파라미터 실행"
                            }
                        ],
                        "task": {
                            "name": "requiredParams"
                        },
                        "id": "default92"
                    }
                ]
            },
            {
                "name": "preCallback",
                "input": [
                    {
                        "text": {
                            "raw": "20",
                            "nlp": "20"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "preCallback"
                    }
                ],
                "id": "default76",
                "children": [
                    {
                        "name": "preCallback 구현",
                        "input": [
                            {
                                "text": {
                                    "raw": " ",
                                    "nlp": ""
                                },
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "함수 실행 결과 입니다.\n\npreCallback 결과 : +dialog.data.preCallback+\naction 결과 : +dialog.data.action+"
                            }
                        ],
                        "task": {
                            "name": "preCallback"
                        },
                        "id": "default88"
                    }
                ]
            },
            {
                "name": "postCallback",
                "input": [
                    {
                        "text": {
                            "raw": "21",
                            "nlp": "21"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "postCallback"
                    }
                ],
                "id": "default86",
                "task": {
                    "name": ""
                },
                "children": [
                    {
                        "name": "postCallback 구현",
                        "input": [
                            {
                                "text": {
                                    "raw": " ",
                                    "nlp": ""
                                },
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "함수 실행 결과 입니다.\n\naction 결과 : +dialog.data.action+\npostCallback 결과 : +dialog.data.postCallback+"
                            }
                        ],
                        "task": {
                            "name": "postCallback"
                        },
                        "id": "default89"
                    }
                ]
            },
            {
                "name": "시퀀스테스크",
                "input": [
                    {
                        "text": {
                            "raw": "22",
                            "nlp": "22"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "시퀀스테스크"
                    }
                ],
                "id": "default87",
                "children": [
                    {
                        "name": "시퀀스테스크 구현",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "함수 실행 결과입니다.\n\ncrawling 결과 : +context.session.crawlingResult+\nsequenceTest 결과 : +dialog.data.sequenceTest+\ntestFunc 결과 : +dialog.data.testFunc+"
                            }
                        ],
                        "task": {
                            "name": "sequenceTask"
                        },
                        "id": "default90"
                    }
                ]
            },
            {
                "name": "테스트 extends",
                "input": [
                    {
                        "text": {
                            "raw": "23",
                            "nlp": "23"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "테스트 extends"
                    }
                ],
                "id": "default93",
                "children": [
                    {
                        "name": "테스트 extends 구현",
                        "input": [
                            {
                                "text": {
                                    "raw": " ",
                                    "nlp": ""
                                },
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "함수 실행 결과입니다.\n\n+dialog.data.taskParams+"
                            }
                        ],
                        "task": {
                            "name": "taskExtends"
                        },
                        "id": "default94"
                    }
                ]
            }
        ]
    },
    {
        "name": "봇 옵션",
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
                "text": "봇 옵션"
            }
        ],
        "id": "default35"
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
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "대화 시나리오 기능 테스트 봇입니다. \n테스트 원하는 기능을 골라주세요.",
                "buttons": [
                    {
                        "url": "",
                        "text": "1. 사용자 입력 테스트"
                    },
                    {
                        "url": "",
                        "text": "2. 챗봇 답변 테스트"
                    },
                    {
                        "url": "",
                        "text": "3. 답변 전 실행함수 테스트"
                    },
                    {
                        "url": "",
                        "text": "4. 봇 옵션 테스트"
                    }
                ]
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
        "filename": "defaultcommon",
        "name": "답변없음",
        "input": "",
        "output": "알아듣지 못했습니다."
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}
