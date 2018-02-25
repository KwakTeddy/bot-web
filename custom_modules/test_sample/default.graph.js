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
                        "id": "default13",
                        "children": [
                            {
                                "name": "New Dialog",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "",
                                            "nlp": ""
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "",
                                        "buttons": []
                                    }
                                ],
                                "id": "default30"
                            }
                        ]
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
                        "id": "default14",
                        "children": []
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
                        "id": "default17",
                        "children": []
                    },
                    {
                        "name": "정규식 구현_핸드폰번호",
                        "input": [
                            {
                                "regexp": "\\d{2,3}-\\d{3,4}-\\d{4}",
                                "text": {
                                    "raw": " ",
                                    "nlp": ""
                                }
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
                                "regexp": "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\u0001-\b\u000b\f\u000e-\u001f!#-[]-]|\\\\[\u0001-\t\u000b\f\u000e-])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\u0001-\b\u000b\f\u000e-\u001f!-ZS-]|\\\\[\u0001-\t\u000b\f\u000e-])+)\\])"
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
                "name": "IF",
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
                        "text": "1. if(변수) 테스트\n->context.session.test에 값 입력\n\n2. if(true) 테스트\n-> 아무거나 입력"
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
                                "if": "context.session.test"
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
                ],
                "task": {
                    "name": "setTestVar"
                }
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
        ],
        "task": {
            "name": "defaultTask"
        }
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
                "text": "챗봇 답변 관련 기능들 중 테스트 원하는 기능을 선택하세요.",
                "buttons": [
                    {
                        "url": "",
                        "text": "1. 변수 접근"
                    },
                    {
                        "url": "",
                        "text": "2. IF"
                    },
                    {
                        "url": "",
                        "text": "3. Call"
                    },
                    {
                        "url": "",
                        "text": "4. Repeat"
                    },
                    {
                        "url": "",
                        "text": "5. Back"
                    },
                    {
                        "url": "",
                        "text": "6. Up"
                    },
                    {
                        "url": "",
                        "text": "7. Callchild"
                    },
                    {
                        "url": "",
                        "text": "8. Returncall"
                    }
                ]
            }
        ],
        "id": "default96",
        "children": [
            {
                "name": "변수(챗봇 답변)",
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
                        "text": "1. 객체\n\n2. 배열",
                        "buttons": [
                            {
                                "url": "",
                                "text": "1. 객체 변수 접근 테스트"
                            },
                            {
                                "url": "",
                                "text": "2. 배열 변수 접근 테스트"
                            }
                        ]
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
                        "name": "변수 접근 구현 _객체",
                        "input": [
                            {
                                "text": {
                                    "raw": "객체",
                                    "nlp": "객체"
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
                                "text": "값이 객체인 변수는 \\+변수명.key+ 형태로 접근할 수 있습니다.\n\n예를 들어, \ncontext.session.movieDataObject = \n{\n date: '2018년',\ntitle: '살인사건'\n}\n일 경우, 다음과 같이 접근합니다.\n\n\\+context.session.movieDataObject.date+\n\\+context.session.movieDataObject.title+\n\n아래는 이스케이프 없이 구성된 결과입니다.\n\n+context.session.movieDataObject.date+\n+context.session.movieDataObject.title+",
                                "type": "repeat"
                            }
                        ],
                        "id": "default65",
                        "children": []
                    },
                    {
                        "name": "변수 접근 구현 _배열",
                        "input": [
                            {
                                "text": {
                                    "raw": "배열",
                                    "nlp": "배열"
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
                                "text": "값이 배열인 변수는 \\#변수명\\# 형태로 접근할 수 있습니다.\n\n예를 들어, \ncontext.session.movieDataArray = \n[\n\n{\n date: '2018년',\ntitle: '살인사건'\n},\n{\n date: '2017년',\ntitle: '추격자'\n},\n\n]\n일 경우, 다음과 같이 접근합니다.\n\n\\#context.session.movieDataArray\\#\n\n\\#변수\\#을 할 경우, 자체적으로 배열에 담긴 요소 하나씩에 접근합니다. \n\n배열에 담긴 요소 하나씩을 접근해 나타내기 위해서는 다음과 같이 접근합니다.\n\n\\#변수\\#각 요소에 대한 접근\\#\n\n마지막 \\#은 각 요소에 대한 접근을 마무리한다는 의미이며, 그에 따라 \\#각 요소에 대한 접근\\# 부분이 반복됩니다.\n\n\\#각 요소에 대한 접근\\#에서는 \\+key+의 형태로 각 요소의 value에 접근할 수 있습니다.\n\n\\#context.session.movieDataArray\\# \\+date+ +title+\\#\n\n\\#각 요소에 대한 접근\\#에서는 \\+index+가 자동으로 추가되어 해당 요소의 순번을 알 수가 있습니다.\n\n최종적으로 다음과 같이 활용 가능합니다.\n\n\\#context.session.movieDataArray\\#\n\\+index+.\n타이틀은 \\+title+입니다.\n날짜는 \\+date+입니다.\n\n\\#\n\n아래는 이스케이프 없이 구성된 결과입니다.\n\n#context.session.movieDataArray#\n+index+.\n타이틀은 +title+입니다.\n날짜는 +date+입니다.\n\n#",
                                "type": "repeat"
                            }
                        ],
                        "id": "default66"
                    }
                ],
                "task": {
                    "name": "setTestVarOutput"
                }
            },
            {
                "name": "IF(챗봇 답변)",
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
                        "text": "1. if(context.channel.name == 'socket')\n\n2. if(context.channel.name == 'kakao')"
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
                                "if": "context.channel.name == 'socket'"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "대화 이름 : 답변IF 구현 _ 소켓\n\n소켓(socket) 채널로 대화중입니다.",
                                "if": "context.channel.name == 'socket'",
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "text": "대화 이름 : 답변IF 구현 _ 소켓\n\n소켓이 아닌 다른 채널에서 대화중입니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default44"
                    },
                    {
                        "name": "답변IF 구현 _ 카카오",
                        "input": [
                            {
                                "text": {
                                    "raw": "",
                                    "nlp": ""
                                },
                                "if": "context.channel.name == 'kakao'"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "대화 이름 : 답변IF 구현 _ 카카오\n\n\n카카오 채널로 대화중입니다.",
                                "if": "context.channel.name == 'kakao'",
                                "type": "repeat"
                            },
                            {
                                "kind": "Action",
                                "text": "대화 이름 : 답변IF 구현 _ 카카오\n\n소켓 채널로 대화중입니다.",
                                "type": "repeat"
                            }
                        ],
                        "id": "default45",
                        "children": [
                            {
                                "name": "New Dialog1",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "",
                                            "nlp": ""
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "",
                                        "buttons": []
                                    }
                                ],
                                "id": "default68"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Call",
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
                        "text": "대화이동 기능을 테스트합니다.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "대화 이동 실행"
                            }
                        ]
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
                        "name": "대화이동 실행 카드",
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
                                "kind": "Action",
                                "type": "call",
                                "dialogName": "대화이동된 카드",
                                "dialogId": "default32",
                                "text": "'대화이동 실행 카드'에서\n'대화이동된 카드'로\n 이동했습니다.\n\n현재 커서는 '대화이동된 카드'에 있습니다.\n\n테스트를 위해 '대화이동된 카드'의 자식 카드에 질문을 입력해보세요."
                            }
                        ],
                        "id": "default31"
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
                "name": "Repeat",
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
                        "text": "재질의 기능을 테스트합니다."
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
                                    "raw": " ",
                                    "nlp": ""
                                },
                                "if": "true"
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
                                "id": "default50",
                                "children": []
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Back",
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
                        "text": "Back 기능을 테스트합니다."
                    }
                ],
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
                                    "raw": "",
                                    "nlp": ""
                                },
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "이전대화이동이 실행됐습니다.",
                                "type": "back"
                            }
                        ],
                        "id": "default59",
                        "children": []
                    }
                ],
                "id": "default60"
            },
            {
                "name": "UP",
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
                        "text": "이전 대화이동 기능을 테스트합니다."
                    }
                ],
                "id": "default57",
                "children": [
                    {
                        "name": "상위대화이동 기능",
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
                        "id": "default61"
                    },
                    {
                        "name": "상위대화이동 실행",
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
                                "kind": "Action",
                                "text": "",
                                "type": "up"
                            }
                        ],
                        "id": "default64"
                    }
                ]
            },
            {
                "name": "Callchild",
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
                        "text": "Callchild 기능을 테스트합니다."
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
                                    "raw": "",
                                    "nlp": ""
                                },
                                "if": "true"
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
                "name": "Returncall",
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
                        "text": "Returncall 기능을 테스트합니다."
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
                                    "raw": "",
                                    "nlp": ""
                                },
                                "if": "true"
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
                                            "raw": "",
                                            "nlp": ""
                                        },
                                        "if": "true"
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
                                            "raw": "",
                                            "nlp": ""
                                        },
                                        "if": "true"
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
                "text": "답변 전 실행함수 관련 기능들 중 테스트 원하는 기능을 선택하세요.",
                "buttons": [
                    {
                        "url": "",
                        "text": "1. Naver api"
                    },
                    {
                        "url": "",
                        "text": "2. crawling"
                    },
                    {
                        "url": "",
                        "text": "3. 파라미터"
                    },
                    {
                        "url": "",
                        "text": "4. 필수 파라미터"
                    },
                    {
                        "url": "",
                        "text": "5. preCallback"
                    },
                    {
                        "url": "",
                        "text": "6. postCallback"
                    },
                    {
                        "url": "",
                        "text": "7. Sequence Task"
                    },
                    {
                        "url": "",
                        "text": "8. Task Extends"
                    }
                ]
            }
        ],
        "id": "default97",
        "children": [
            {
                "name": "함수 구현 _ API",
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
                        "text": "API를 실행했습니다.\n\nAPI의 결과는 아래와 같습니다.\n\n#context.session.movieData.items#\n+index+.\n+title+\n\n#",
                        "type": "repeat"
                    }
                ],
                "task": {
                    "name": "api"
                },
                "id": "default75"
            },
            {
                "name": "함수 구현 _ 크롤링",
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
                        "text": "크롤링이 실행됐습니다.\n\n크롤링의 결과는 아래와 같습니다.\n\n+context.session.crawlingResult+",
                        "type": "repeat"
                    }
                ],
                "task": {
                    "name": "crawling"
                },
                "id": "default85",
                "children": []
            },
            {
                "name": "태스크 파라미터",
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
                        "text": "함수 실행 결과입니다.\n\ntaskParams : +dialog.data.taskParams+",
                        "type": "repeat"
                    }
                ],
                "id": "default42",
                "children": [],
                "task": {
                    "name": "taskParams"
                }
            },
            {
                "name": "테스크 필수 파라미터",
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
                        "text": "필수 파라미터인 모바일 타입이 입력되었습니다.",
                        "type": "repeat"
                    }
                ],
                "task": {
                    "name": "requiredParams"
                },
                "id": "default67",
                "children": []
            },
            {
                "name": "preCallback",
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
                        "text": "함수 실행 결과 입니다.\n\npreCallback 결과 : +dialog.data.preCallback+\naction 결과 : +dialog.data.action+",
                        "type": "repeat"
                    }
                ],
                "id": "default76",
                "children": [],
                "task": {
                    "name": "preCallback"
                }
            },
            {
                "name": "postCallback",
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
                        "text": "함수 실행 결과 입니다.\n\naction 결과 : +dialog.data.action+\npostCallback 결과 : +dialog.data.postCallback+",
                        "type": "repeat"
                    }
                ],
                "id": "default86",
                "task": {
                    "name": "postCallback"
                },
                "children": []
            },
            {
                "name": "시퀀스테스크",
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
                        "text": "함수 실행 결과입니다.\n\ncrawling 결과 : +context.session.crawlingResult+\nsequenceTest 결과 : +dialog.data.sequenceTest+\ntestFunc 결과 : +dialog.data.testFunc+",
                        "type": "repeat"
                    }
                ],
                "id": "default87",
                "children": [],
                "task": {
                    "name": "sequenceTask"
                }
            },
            {
                "name": "테스트 extends",
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
                        "text": "함수 실행 결과입니다.\n\n+dialog.data.taskParams+",
                        "type": "repeat"
                    }
                ],
                "id": "default93",
                "children": [],
                "task": {
                    "name": "taskExtends"
                }
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
        ],
        "task": {
            "name": ""
        }
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
        "output": [{text: "알아듣지 못했습니다."}]
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}
