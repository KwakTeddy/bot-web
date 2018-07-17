var dialogs = [
    {
        "name": "질문 2-1",
        "type":"﻿5b486d4a55611f9addf74b64",
        "input": [
            {
                "text": {
                    "raw": "1",
                    "nlp": "1"
                }
            },
            {
                "text": {
                    "raw": "예",
                    "nlp": "예"
                }
            },
            {
                "text": {
                    "raw": "알고 있다",
                    "nlp": "알 고 있다"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "질문2. 전자 청구서를 사용하지 않는 가장 큰 이유는 무엇인가요?      \n\n1. 신청 방법을 몰라서\n2. 신청 방법이 번거로워서\n3. 종이 청구서가 편해서\n4. 전자 청구서를 믿을 수 없어서\n5. 지로 납부를 하고 싶어서"
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "질문 3-1",
                "type":"﻿5b486d4a55611f9addf74b64",
                "input": [
                    {
                        "types": [
                            "nextFlow"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "[기초설문]\n질문1. 고객님의 연령에 해당하는 보기 숫자를 입력해주세요.\n\n1. 19세이하\n2. 20대\n3. 30대\n4. 40대\n5. 50대\n6. 60대이상"
                    }
                ],
                "id": "default2",
                "children": [
                    {
                        "name": "질문 4-1",
                        "type":"﻿5b486d4a55611f9addf74b64",
                        "input": [
                            {
                                "types": [
                                    "nextFlow"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "질문2. 고객님의 성별에 해당하는 보기 숫자를 입력해주세요.\n\n1. 남성\n2. 여성"
                            }
                        ],
                        "id": "default3",
                        "children": [
                            {
                                "name": "결과-1",
                                "type":"﻿5b486e6955611f9addf74b65",
                                "input": [
                                    {
                                        "types": [
                                            "lastFlow"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "대화형 SMS 설문에 참여해 주셔서 감사합니다.\n추첨을 통해 50분께 문화상품권을 보내드리겠습니다."
                                    }
                                ],
                                "id": "default4"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "질문 2-2",
        "type":"﻿5b486d4a55611f9addf74b64",
        "input": [
            {
                "text": {
                    "raw": "2",
                    "nlp": "2"
                }
            },
            {
                "text": {
                    "raw": "아니오",
                    "nlp": "아니다"
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
                "kind": "Content",
                "text": "가스 요금 전자 청구서는 고객센터(1544-3002)에서도 신청하실 수 있습니다. \n\n질문 2. 어떤 조건이 만족되면 전자 청구서를 사용하실 의사가 있으신가요? \n\n1. 지금 알게 되어서 신청하겠음\n2. 더 간편한 가입 방법\n3. 더 많은 고객 리워드 (경품, 캐시백 등)\n4. 다양한 결제수단 제공 (카드, 계좌 등)\n5. 기타 (주관식으로 직접 입력)"
            }
        ],
        "id": "default1",
        "children": [
            {
                "name": "질문 2-2-1",
                "type":"﻿5b486d4a55611f9addf74b64",
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
                        "text": "어떤 조건이 만족되면 전자 청구서를 사용하실 의사가 있으신가요? (주관식)"
                    }
                ],
                "id": "default5",
                "children": [
                    {
                        "name": "질문 3-3",
                        "type":"﻿5b486d4a55611f9addf74b64",
                        "input": [
                            {
                                "types": [
                                    "nextFlow"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "[기초설문]\n질문1. 고객님의 나이대에 해당하는 보기 숫자를 입력해주세요.\n\n1. 19세이하\n2. 20대\n3. 30대\n4. 40대\n5. 50대\n6. 60대이상"
                            }
                        ],
                        "id": "default2-Clone-Clone",
                        "children": [
                            {
                                "name": "질문 4-3",
                                "type":"﻿5b486d4a55611f9addf74b64",
                                "input": [
                                    {
                                        "types": [
                                            "nextFlow"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "질문2. 고객님의 성별에 해당하는 보기 숫자를 입력해주세요.\n\n1. 남성\n2. 여성"
                                    }
                                ],
                                "id": "default3-Clone-Clone-Clone",
                                "children": [
                                    {
                                        "name": "결과-3",
                                        "type":"﻿5b486e6955611f9addf74b65",
                                        "input": [
                                            {
                                                "types": [
                                                    "lastFlow"
                                                ]
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "대화형 SMS 설문에 참여해 주셔서 감사합니다.\n추첨을 통해 50분께 문화상품권을 보내드리겠습니다."
                                            }
                                        ],
                                        "id": "default4-Clone-Clone-Clone"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "질문 3-2",
                "type":"﻿5b486d4a55611f9addf74b64",
                "input": [
                    {
                        "types": [
                            "nextFlow"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "[기초설문]\n질문1. 고객님의 나이대에 해당하는 보기 숫자를 입력해주세요.\n\n1. 19세이하\n2. 20대\n3. 30대\n4. 40대\n5. 50대\n6. 60대이상"
                    }
                ],
                "id": "default2-Clone",
                "children": [
                    {
                        "name": "질문 4-2",
                        "type":"﻿5b486d4a55611f9addf74b64",
                        "input": [
                            {
                                "types": [
                                    "nextFlow"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "질문2. 고객님의 성별에 해당하는 보기 숫자를 입력해주세요.\n\n1. 남성\n2. 여성"
                            }
                        ],
                        "id": "default3-Clone",
                        "children": [
                            {
                                "name": "결과-2",
                                "type":"﻿5b486e6955611f9addf74b65",
                                "input": [
                                    {
                                        "types": [
                                            "lastFlow"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "대화형 SMS 설문에 참여해 주셔서 감사합니다.\n추첨을 통해 50분께 문화상품권을 보내드리겠습니다."
                                    }
                                ],
                                "id": "default4-Clone"
                            }
                        ]
                    }
                ]
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
                "kind": "Content",
                "text": "[삼천리도시가스] \n삼천리 인공지능 챗봇입니다. 가스 요금 전자 청구서에 대한 설문조사를 실시하고 있습니다. 끝까지 답해주신 분들 중 50분께 문화상품권을 보내드립니다.\n \n본 설문조사는 대화형 SMS 방식으로 진행되며, 고객님의 SMS 발송비용은 무료입니다.\n\n문의: 1544-3002\n무료수신거부: 080-877-5907\n\n[요금설문]\n질문1. 가스 요금 전자 청구서 (알림톡, 카카오페이 등) 가 있다는 것을 알고 계신가요?\n\n1. 예, 알고 있습니다\n2. 아니오, 모릅니다\n\n(예시. 알고 계시면 1을 입력)"
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
        "name": "답변없음",
        "input": "",
        "output": [
            {
                "text": "알아듣지 못했습니다.",
                "kind": "Action",
                "type": "back",
                "dialogId": "startDialog"
            }
        ]
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}
