var dialogs = [
    {
        "name": "1.병원 소개",
        "input": [
            {
                "regexp": "^1$"
            },
            {
                "text": {
                    "raw": "병원 소개",
                    "nlp": "병원 소개"
                }
            },
            {
                "text": {
                    "raw": "병원소개",
                    "nlp": "병원 소개"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.introduction#+description+\n\n+phone+\n#"
            }
        ],
        "id": "default0",
        "task": {
            "name": "introduction"
        }
    },
    {
        "name": "2.교통편",
        "input": [
            {
                "regexp": "^2"
            },
            {
                "text": {
                    "raw": "교통",
                    "nlp": "교통"
                }
            },
            {
                "text": {
                    "raw": "주소",
                    "nlp": "주소"
                }
            },
            {
                "text": {
                    "raw": "위치",
                    "nlp": "위치"
                }
            },
            {
                "text": {
                    "raw": "가는 길",
                    "nlp": "가다 길"
                }
            },
            {
                "text": {
                    "raw": "지도",
                    "nlp": "지도"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.transportation#+company+\n\n주소: +address+\n#\n \n어떤 교통으로 방문하시나요?"
            }
        ],
        "id": "default1",
        "task": {
            "name": "transportation"
        },
        "children": [
            {
                "name": "2.1 버스",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "#context.session.transportation#+bus+\n#"
                    }
                ],
                "task": {
                    "name": "transportationway"
                },
                "id": "default3"
            }
        ]
    },
    {
        "name": "3.의료진 소개",
        "input": [
            {
                "text": {
                    "raw": "의료진",
                    "nlp": "의료 진"
                }
            },
            {
                "regexp": "^3$"
            },
            {
                "text": {
                    "raw": "인원",
                    "nlp": "인원"
                }
            },
            {
                "text": {
                    "raw": "직원",
                    "nlp": "직원"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "의료진을 소개합니다."
            }
        ],
        "id": "default2",
        "task": {
            "name": "dean"
        },
        "children": [
            {
                "name": "3.의료진 소개 내용",
                "input": [
                    {
                        "types": [
                            "deanlist"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "#context.session.selecteddean#+name+ 원장\n\n파트: +department+\n\n소개:\n +description+\n#"
                    }
                ],
                "task": {
                    "name": "showdean"
                },
                "id": "default4"
            }
        ]
    },
    {
        "name": "4.2월 이벤트",
        "input": [
            {
                "regexp": "^4"
            },
            {
                "text": {
                    "raw": "2월 이벤트",
                    "nlp": "2 월 이벤트"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "2월 이벤트들은 아래와 같습니다.",
                "buttons": [
                    {
                        "url": "",
                        "text": "1.감량제"
                    },
                    {
                        "url": "",
                        "text": "2.지방흡입후케어"
                    },
                    {
                        "url": "",
                        "text": "3.그 외 진행하는 이벤트 추가"
                    },
                    {
                        "url": "",
                        "text": "이전으로 가기"
                    },
                    {
                        "url": "",
                        "text": "처음으로 돌아가기"
                    }
                ]
            }
        ],
        "id": "default7",
        "children": [
            {
                "name": "4.1감량제",
                "input": [
                    {
                        "text": {
                            "raw": "감량체",
                            "nlp": "감량 체"
                        }
                    },
                    {
                        "regexp": "^1"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "감량체와 관련한 질문들은 아래와 같습니다.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "1.감량제 이벤트가 정확히 무엇인가요?"
                            },
                            {
                                "url": "",
                                "text": "2.비용은 얼마인가요?"
                            },
                            {
                                "url": "",
                                "text": "3.몇일 동안 몇키로를 뺄수 있는건가요?"
                            },
                            {
                                "url": "",
                                "text": "이전으로 가기"
                            },
                            {
                                "url": "",
                                "text": "처음으로 돌아가기"
                            }
                        ]
                    }
                ],
                "id": "default8",
                "children": [
                    {
                        "name": "4.1.1대답",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "dd"
                            }
                        ],
                        "task": {
                            "name": "event2month1"
                        },
                        "id": "default11"
                    }
                ]
            },
            {
                "name": "4.2지방흡입후케어",
                "input": [
                    {
                        "text": {
                            "raw": "지방흡입후케어",
                            "nlp": "지방 흡입 후 케어"
                        }
                    },
                    {
                        "regexp": "^2"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "지방흡입후케어에 관련한 질문들은 아래와 갑습니다.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "1.지방흡입 후 몇일 뒤에 하면 좋나요?"
                            },
                            {
                                "url": "",
                                "text": "2.지방흡입 후케어 패키지 내용은 무엇인가요?"
                            },
                            {
                                "url": "",
                                "text": "3.비용은 얼마인가요?"
                            },
                            {
                                "url": "",
                                "text": "4.지방흡입 후 케어를 하고 나면 확실히 효과가 있나요?"
                            },
                            {
                                "url": "",
                                "text": "이전으로 가기"
                            },
                            {
                                "url": "",
                                "text": "처음으로 돌아가기"
                            }
                        ]
                    }
                ],
                "id": "default9",
                "children": [
                    {
                        "name": "4.1.2대답",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "dd"
                            }
                        ],
                        "task": {
                            "name": "event2month2"
                        },
                        "id": "default12"
                    }
                ]
            },
            {
                "name": "4.3그 외 진행하는 이벤트 추가",
                "input": [
                    {
                        "text": {
                            "raw": "그 외 진행하는 이벤트 추가",
                            "nlp": "그 외 진행 하다 이벤트 추가"
                        }
                    },
                    {
                        "regexp": "^3"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "그 외 진행하는 이벤트 추가에 관련한 질문들은 아래와 같습니다.",
                        "buttons": [
                            {
                                "url": "",
                                "text": "1.진행하는 이벤트가 또 무엇이 있나요?"
                            },
                            {
                                "url": "",
                                "text": "이전으로 가기"
                            },
                            {
                                "url": "",
                                "text": "처음으로 돌아가기"
                            }
                        ]
                    }
                ],
                "id": "default10",
                "children": [
                    {
                        "name": "4.3대답",
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
                                "text": "전화상담으로 자세히 안내해드리겠습니다\n\n02-561-5773~4",
                                "buttons": [
                                    {
                                        "url": "",
                                        "text": "이전으르 가기"
                                    },
                                    {
                                        "url": "",
                                        "text": "처음으로 돌아가기"
                                    }
                                ]
                            }
                        ],
                        "id": "default13"
                    }
                ]
            }
        ]
    },
    {
        "name": "4.교통편 자연어 처리",
        "input": [
            {
                "text": {
                    "raw": "버스",
                    "nlp": "버스"
                }
            },
            {
                "text": {
                    "raw": "지하철",
                    "nlp": "지하철"
                }
            },
            {
                "text": {
                    "raw": "자가용",
                    "nlp": "자가용"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.transportation#+bus+\n#",
                "type": "call"
            }
        ],
        "task": {
            "name": "nlp_transportation"
        },
        "id": "default5"
    },
    {
        "name": "5.의료진 자연어 처리",
        "input": [
            {
                "types": [
                    "deanlist2"
                ]
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "#context.session.selecteddean#+name+ 원장\n\n파트: +department+\n\n소개:\n +description+\n#"
            }
        ],
        "id": "default6",
        "task": {
            "name": "showdean"
        }
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
                "text": "안녕하세요! \n무엇을 도와드릴까요?\n\n1.병원 소개\n2.교통편\n3.의료진 소개\n4.2월 이벤트"
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