


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "출장비"
			}
		],
		"output": "출장비용은 15,000원 입니다.평일 18시이후 및 주말엔 18,000원 입니다.\n수리비, 부품비는 엔지니어 점검 후 안내해 드리고 있습니다.\n단, 품질보증 기간이내 정상 사용 중 발생된 기능/성능상의 하자의 경우 무상으로 조치됩니다.",
		"name": "출장비"
	},
	{
		"id": "default5",
		"filename": "default",
		"name": "냉장고온도조절",
		"input": [
			{
				"intent": "냉장고 온도 조절"
			}
		],
		"output": "[답변]\n1. [잠금/풀림] 버튼을  2초 이상 길게 눌러 풀림 상태로 만듭니다.\n1초 이상 누를 시 잠금이 풀리는 모델도 있습니다.\n2. 냉동실은 \"냉동온도\", 냉장실은 \"냉장온도\" 버튼으로 원하는 온도로 조절 할 수 있습니다.\n3. 원하시는 온도로 조절하신 후 잠금/풀림 버튼을 누르시면 다시 자물쇠가 잠금그림으로 됩니다.\n\n답변이 유용한가요?",
		"inRaw": "냉장",
		"inNLP": "냉장",
		"children": [
			{
				"id": "default1",
				"filename": "default",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": {
					"call": "~네"
				},
				"name": "dialog_default1"
			},
			{
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": {
					"call": "아니요"
				},
				"name": "dialog_default4"
			}
		]
	},
	{
		"id": "default10",
		"filename": "default",
		"name": "에어컨온도조절",
		"input": [
			{
				"intent": "에어컨 온도 조절"
			}
		],
		"output": "[답변]\n에어컨은 기기의 버튼 또는 리모콘을 통해 온도조절을 할 수 있습니다.\n\n답변이 유용한가요?",
		"inRaw": "에어컨이요",
		"inNLP": "에어컨 요",
		"children": [
			{
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": {
					"call": "~네"
				},
				"name": "dialog_default6"
			},
			{
				"name": "dialog_default182",
				"id": "default182",
				"filename": "default",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": {
					"call": "아니요"
				}
			}
		]
	},
	{
		"id": "default13",
		"filename": "default",
		"input": [
			{
				"intent": "온도 조절"
			}
		],
		"output": "어떤 제품의 온도조절 방법이 궁금하신가요?\n(냉장고 또는 에어컨)",
		"name": "온도조절",
		"children": [
			{
				"id": "default11",
				"filename": "default",
				"input": [
					{
						"entities": [
							"냉장고@가전제품"
						]
					}
				],
				"output": {
					"call": "냉장고온도조절"
				},
				"name": "dialog_default11"
			},
			{
				"id": "default12",
				"filename": "default",
				"input": [
					{
						"entities": [
							"에어컨@가전제품"
						]
					}
				],
				"output": {
					"call": "에어컨온도조절"
				},
				"name": "dialog_default12"
			}
		]
	},
	{
		"id": "default18",
		"filename": "default",
		"input": [
			{
				"text": "투 인원 함께"
			}
		],
		"output": "[답변]\n정속 투인원 모델(FNC*** / FNS*** 모델)은 스탠드형/벽걸이형 동시에 가동을 하게 되면 냉기가 약해질 수 있습니다.\n실외기에서 낼 수 있는 냉방 성능은 정해져 있고, 그 냉방 성능을 스탠드형과 벽걸이형이 나눠서 가집니다.\n하지만 최근에 개발되는 투인원(FNQ***)모델은 고효율 인버터 냉방 시스템을 적용하여 인버터 압축기의 회전수를 높여 100% 능력을 달성합니다.\n\n답변이 유용한가요?",
		"name": "투인원 함께",
		"children": [
			{
				"id": "default14",
				"filename": "default",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": {
					"call": "~네"
				},
				"name": "dialog_default14"
			},
			{
				"id": "default17",
				"filename": "default",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": {
					"call": "아니요"
				},
				"name": "dialog_default17"
			}
		]
	},
	{
		"id": "default23",
		"filename": "default",
		"input": [
			{
				"text": "Od"
			}
		],
		"output": "[답변]\n[Od]는 실외기 과열 감지 표시입니다.\n실외기 앞쪽 환기창이 열려있다 하더라도 갤러리 각도가 일직선이 되지 않거나 방충망이 닫혀있는 경우에도 발생할 수 있습니다.\n날씨가 더울 때는 갤러리 각도를 일직선으로 맞추고 방충망까지 열어주세요.\n실외기가 열을 받으면 냉각 능력이 떨어질 수 있습니다. \n\n답변이 유용한가요?",
		"name": "Od 오류",
		"children": [
			{
				"id": "default19",
				"filename": "default",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": {
					"call": "~네"
				},
				"name": "dialog_default19"
			},
			{
				"id": "default22",
				"filename": "default",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": {
					"call": "아니요"
				},
				"name": "dialog_default22"
			}
		]
	},
	{
		"id": "default28",
		"filename": "default",
		"input": [
			{
				"intent": "냉동실은 되지만 냉장실은 안됨"
			}
		],
		"output": "[답변]\n냉동실 내부 결빙(성에)으로 냉장실 쪽으로 냉기가 순환이 안되어 나타나는 증상입니다.\n고객님이 직접 하실 수 있는 방법은 여유 냉장고로 음식물을 옮겨놓은 상태에서 제품의 전원을 끄고 냉동/냉장 도어를 활짝 열어 녹이는 방법이 있습니다.\n전원을 끄기 힘들다면 서비스 엔지니어 방문 점검이 필요합니다. 서비스 접수를 신청해주시기 바랍니다.\n\n답변이 유용한가요?",
		"name": "냉장실만 안됨",
		"children": [
			{
				"id": "default24",
				"filename": "default",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": {
					"call": "~네"
				},
				"name": "dialog_default24"
			},
			{
				"id": "default27",
				"filename": "default",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": {
					"call": "아니요"
				},
				"name": "dialog_default27"
			}
		]
	},
	{
		"id": "default39",
		"filename": "default",
		"input": [
			{
				"intent": "약냉"
			}
		],
		"output": [
			{
				"if": "context.botUser.entities.가전제품 == '냉장고' && context.botUser.entities.냉장고분류 == '양문형'",
				"output": {
					"call": "약냉"
				}
			},
			{
				"if": "context.botUser.entities.가전제품 == '냉장고' && context.botUser.entities.냉장고분류 == '일반형'",
				"output": {
					"call": "약냉"
				}
			},
			{
				"if": "context.botUser.entities.가전제품 == '냉장고'",
				"output": {
					"call": "냉장고유형1"
				}
			},
			{
				"if": "context.botUser.entities.가전제품 == '에어컨' && context.botUser.entities.에어컨분류 == '스탠딩'",
				"output": {
					"call": "에어컨약냉"
				}
			},
			{
				"if": "context.botUser.entities.가전제품 == '에어컨' && context.botUser.entities.에어컨분류 == '벽걸이'",
				"output": {
					"call": "에어컨약냉"
				}
			},
			{
				"if": "context.botUser.entities.가전제품 == '에어컨'",
				"output": {
					"call": "에어컨유형1"
				}
			},
			{
				"if": "true",
				"output": {
					"call": "가전제품유형1"
				}
			}
		],
		"name": "약냉분기"
	},
	{
		"id": "default50",
		"filename": "default",
		"input": [
			{
				"intent": "무냉"
			}
		],
		"output": [
			{
				"if": "context.botUser.entities.가전제품 == '냉장고' && context.botUser.entities.냉장고분류 == '양문형'",
				"output": {
					"call": "무냉"
				}
			},
			{
				"if": "context.botUser.entities.가전제품 == '냉장고' && context.botUser.entities.냉장고분류 == '일반형'",
				"output": {
					"call": "무냉"
				}
			},
			{
				"if": "context.botUser.entities.가전제품 == '냉장고'",
				"output": {
					"call": "냉장고유형2"
				}
			},
			{
				"if": "context.botUser.entities.가전제품 == '에어컨' && context.botUser.entities.에어컨분류 == '스탠딩'",
				"output": {
					"call": "에어컨무냉"
				}
			},
			{
				"if": "context.botUser.entities.가전제품 == '에어컨' && context.botUser.entities.에어컨분류 == '벽걸이'",
				"output": {
					"call": "에어컨무냉"
				}
			},
			{
				"if": "context.botUser.entities.가전제품 == '에어컨'",
				"output": {
					"call": "에어컨유형2"
				}
			},
			{
				"if": "true",
				"output": {
					"call": "가전제품유형2"
				}
			}
		],
		"name": "무냉분기"
	},
	{
		"id": "default56",
		"filename": "default",
		"input": [
			{
				"intent": "강냉"
			}
		],
		"output": [
			{
				"if": "context.botUser.entities.가전제품 == '냉장고'",
				"output": {
					"call": "강냉"
				}
			},
			{
				"if": "context.botUser.entities.가전제품 == '에어컨'",
				"output": "죄송합니다. 에어컨의 강냉 관련 질문은 챗봇상담이 불가능합니다."
			},
			{
				"if": "true",
				"output": {
					"call": "가전제품유형3"
				}
			}
		],
		"name": "강냉분기"
	},
	{
		"id": "default79",
		"filename": "default",
		"name": "약냉",
		"input": "false",
		"task": {
			"name": "refriweak"
		},
		"output": "아래는 냉장고의 냉기가 약할 때의 주된 원인입니다.\n#doc#+index+. +title+\n#\n고객님께 해당되는 경우가 있으면 선택해주세요.\n어떤 것도 해당하지 않으면 전문기사님의 출장점검을 도와드리겠습니다.",
		"inRaw": "싱싱냉장고",
		"inNLP": "싱싱 냉장고",
		"children": [
			{
				"id": "default75",
				"filename": "default",
				"input": [
					{
						"types": [
							"listType"
						]
					}
				],
				"output": "[답변]+listType.content+다른 경우를 보시려면 \"이전\"을 입력해주세요답변이 유용한가요?",
				"name": "dialog_default75",
				"task": "checkcontext",
				"children": [
					{
						"id": "default71",
						"filename": "default",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": {
							"call": "~네"
						},
						"name": "dialog_default71"
					},
					{
						"id": "default74",
						"filename": "default",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": {
							"call": "아니요"
						},
						"name": "dialog_default74"
					}
				]
			},
			{
				"id": "default78",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"call": "아니요"
				},
				"name": "dialog_default78"
			}
		]
	},
	{
		"id": "default82",
		"filename": "default",
		"name": "냉장고약냉",
		"input": "false",
		"task": "checktorefri",
		"output": "고객님의 냉장고의 형태를 말씀해주세요.\n(양문형 또는 일반형)",
		"children": [
			{
				"id": "default80",
				"filename": "default",
				"input": [
					{
						"entities": [
							"일반형@냉장고분류"
						]
					},
					{
						"entities": [
							"양문형@냉장고분류"
						]
					}
				],
				"output": {
					"call": "약냉"
				},
				"name": "dialog_default80"
			},
			{
				"id": "default81",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				},
				"name": "dialog_default81"
			}
		]
	},
	{
		"id": "default91",
		"filename": "default",
		"name": "강냉",
		"input": "false",
		"task": {
			"name": "refristrong"
		},
		"output": "아래는 냉장고의 냉기가 너무 강할 때의 주된 원인입니다.\n#doc#+index+. +title+\n#\n고객님께 해당되는 경우가 있으면 선택해주세요.\n어떤 것도 해당하지 않으면 전문기사님의 출장점검을 도와드리겠습니다.",
		"inRaw": "냉장고요",
		"inNLP": "냉장고 요",
		"children": [
			{
				"id": "default87",
				"filename": "default",
				"input": [
					{
						"types": [
							"listType"
						]
					}
				],
				"output": "[답변]+listType.content+다른 경우를 보시려면 \"이전\"을 입력해주세요답변이 유용한가요?",
				"name": "dialog_default87",
				"children": [
					{
						"id": "default83",
						"filename": "default",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": {
							"call": "~네"
						},
						"name": "dialog_default83"
					},
					{
						"id": "default86",
						"filename": "default",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": {
							"call": "아니요"
						},
						"name": "dialog_default86"
					}
				]
			},
			{
				"id": "default90",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"call": "아니요"
				},
				"name": "dialog_default90"
			}
		]
	},
	{
		"id": "default94",
		"filename": "default",
		"name": "냉장고강냉",
		"input": "false",
		"task": "checktorefri",
		"output": "고객님의 냉장고의 형태를 말씀해주세요.\n(양문형 또는 일반형)",
		"children": [
			{
				"id": "default92",
				"filename": "default",
				"input": [
					{
						"entities": [
							"양문형@냉장고분류"
						]
					},
					{
						"entities": [
							"일반형@냉장고분류"
						]
					}
				],
				"output": {
					"call": "강냉"
				},
				"name": "dialog_default92"
			},
			{
				"id": "default93",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				},
				"name": "dialog_default93"
			}
		]
	},
	{
		"id": "default103",
		"filename": "default",
		"name": "무냉",
		"input": "false",
		"task": {
			"name": "refrino"
		},
		"output": "아래는 냉장고이 작동하지 않을 때의 주된 원인입니다.\n#doc#+index+. +title+\n#\n고객님께 해당되는 경우가 있으면 선택해주세요.\n어떤 것도 해당하지 않으면 전문기사님의 출장점검을 도와드리겠습니다.",
		"inRaw": "싱싱냉장고",
		"inNLP": "싱싱 냉장고",
		"children": [
			{
				"id": "default99",
				"filename": "default",
				"input": [
					{
						"types": [
							"listType"
						]
					}
				],
				"output": "[답변]+listType.content+다른 경우를 보시려면 \"이전\"을 입력해주세요답변이 유용한가요?",
				"name": "dialog_default99",
				"children": [
					{
						"id": "default95",
						"filename": "default",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": {
							"call": "~네"
						},
						"name": "dialog_default95"
					},
					{
						"id": "default98",
						"filename": "default",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": {
							"call": "아니요"
						},
						"name": "dialog_default98"
					}
				]
			},
			{
				"id": "default102",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"call": "아니요"
				},
				"name": "dialog_default102"
			}
		]
	},
	{
		"id": "default106",
		"filename": "default",
		"name": "냉장고무냉",
		"input": "false",
		"task": "checktorefri",
		"output": "고객님의 냉장고의 형태를 말씀해주세요.\n(양문형 또는 일반형)",
		"children": [
			{
				"id": "default104",
				"filename": "default",
				"input": [
					{
						"entities": [
							"양문형@냉장고분류"
						]
					},
					{
						"entities": [
							"일반형@냉장고분류"
						]
					}
				],
				"output": {
					"call": "무냉"
				},
				"name": "dialog_default104"
			},
			{
				"id": "default105",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				},
				"name": "dialog_default105"
			}
		]
	},
	{
		"id": "default111",
		"filename": "default",
		"name": "냉장고",
		"input": "false",
		"task": "checktorefri",
		"output": "고객님 냉장고의 증상을 말씀해주세요.",
		"children": [
			{
				"id": "default107",
				"filename": "default",
				"input": [
					{
						"intent": "강냉"
					}
				],
				"output": {
					"call": "강냉"
				},
				"name": "dialog_default107"
			},
			{
				"id": "default108",
				"filename": "default",
				"input": [
					{
						"intent": "약냉"
					}
				],
				"output": {
					"call": "약냉"
				},
				"name": "dialog_default108"
			},
			{
				"id": "default109",
				"filename": "default",
				"input": [
					{
						"intent": "무냉"
					}
				],
				"output": {
					"call": "무냉"
				},
				"name": "dialog_default109"
			},
			{
				"id": "default110",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": "죄송합니다. 현재 챗봇 상담은 냉기 관련 증상(강냉, 약냉, 무냉)만 상담해드리고 있습니다.\n그 외 상담은 콜센터를 이용해주시기 바랍니다.\nLG전자 콜센터 번호는 1577-7314입니다.",
				"name": "dialog_default110"
			}
		]
	},
	{
		"id": "default114",
		"filename": "default",
		"input": "false",
		"task": "checktorefri",
		"output": "고객님의 냉장고의 형태를 말씀해주세요.\n(양문형 또는 일반형)",
		"name": "dialog_default114",
		"children": [
			{
				"id": "default112",
				"filename": "default",
				"input": [
					{
						"entities": [
							"양문형@냉장고분류"
						]
					},
					{
						"entities": [
							"일반형@냉장고분류"
						]
					}
				],
				"output": {
					"call": "냉장고"
				},
				"name": "dialog_default112"
			},
			{
				"id": "default113",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				},
				"name": "dialog_default113"
			}
		]
	},
	{
		"id": "default151",
		"filename": "default",
		"name": "에어컨약냉",
		"input": "false",
		"task": {
			"name": "airweak"
		},
		"output": "아래는 에어컨의 냉기가 약할 때의 주된 원인입니다.\n#doc#+index+. +title+\n#\n고객님께 해당되는 경우가 있으면 선택해주세요.\n어떤 것도 해당하지 않으면 전문기사님의 출장점검을 도와드리겠습니다.",
		"inRaw": "스탠딩",
		"inNLP": "스탠딩",
		"children": [
			{
				"id": "default147",
				"filename": "default",
				"input": [
					{
						"types": [
							"listType"
						]
					}
				],
				"output": "[답변]+listType.content+다른 경우를 보시려면 \"이전\"을 입력해주세요답변이 유용한가요?",
				"name": "dialog_default147",
				"children": [
					{
						"id": "default143",
						"filename": "default",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": {
							"call": "~네"
						},
						"name": "dialog_default143"
					},
					{
						"id": "default146",
						"filename": "default",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": {
							"call": "아니요"
						},
						"name": "dialog_default146"
					}
				]
			},
			{
				"id": "default150",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"call": "아니요"
				},
				"name": "dialog_default150"
			}
		]
	},
	{
		"id": "default155",
		"filename": "default",
		"name": "에어컨약냉둘",
		"input": "false",
		"task": "checktoair",
		"output": "고객님의 에어컨의 형태를 말씀해주세요.\n(스탠딩 또는 벽걸이)",
		"children": [
			{
				"id": "default153",
				"filename": "default",
				"input": [
					{
						"entities": [
							"스탠딩@에어컨분류"
						]
					},
					{
						"entities": [
							"벽걸이@에어컨분류"
						]
					}
				],
				"output": {
					"call": "에어컨약냉"
				},
				"name": "dialog_default153"
			},
			{
				"id": "default154",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				},
				"name": "dialog_default154"
			}
		]
	},
	{
		"id": "default158",
		"filename": "default",
		"name": "에어컨강냉",
		"input": "false",
		"task": "checktoair",
		"output": "죄송합니다. 에어컨의 강냉 관련 질문은 챗봇상담이 불가능합니다.\n고객센터의 전문 상담원과 연결을 원하십니까?",
		"children": [
			{
				"id": "default156",
				"filename": "default",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": {
					"call": "아니요"
				},
				"name": "dialog_default156"
			},
			{
				"id": "default157",
				"filename": "default",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": {
					"call": "~네"
				},
				"name": "dialog_default157"
			}
		]
	},
	{
		"id": "default167",
		"filename": "default",
		"name": "에어컨무냉",
		"input": "false",
		"task": {
			"name": "airweak"
		},
		"output": "아래는 에어컨이 작동하지 않을 때의 주된 원인입니다.\n#doc#+index+. +title+\n#\n고객님께 해당되는 경우가 있으면 선택해주세요.\n어떤 것도 해당하지 않으면 전문기사님의 출장점검을 도와드리겠습니다.",
		"inRaw": "스탠드형이요",
		"inNLP": "스탠드 형 이요",
		"children": [
			{
				"id": "default163",
				"filename": "default",
				"input": [
					{
						"types": [
							"listType"
						]
					}
				],
				"output": "[답변]+listType.content+다른 경우를 보시려면 \"이전\"을 입력해주세요답변이 유용한가요?",
				"name": "dialog_default163",
				"children": [
					{
						"id": "default159",
						"filename": "default",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": {
							"call": "~네"
						},
						"name": "dialog_default159"
					},
					{
						"id": "default162",
						"filename": "default",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": {
							"call": "아니요"
						},
						"name": "dialog_default162"
					}
				]
			},
			{
				"id": "default166",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"call": "아니요"
				},
				"name": "dialog_default166"
			}
		]
	},
	{
		"id": "default171",
		"filename": "default",
		"name": "에어컨무냉둘",
		"input": "false",
		"task": "checktoair",
		"output": "고객님의 에어컨의 형태를 말씀해주세요.\n(스탠딩 또는 벽걸이)",
		"children": [
			{
				"id": "default169",
				"filename": "default",
				"input": [
					{
						"entities": [
							"스탠딩@에어컨분류"
						]
					},
					{
						"entities": [
							"벽걸이@에어컨분류"
						]
					}
				],
				"output": {
					"call": "에어컨무냉"
				},
				"name": "dialog_default169"
			},
			{
				"id": "default170",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				},
				"name": "dialog_default170"
			}
		]
	},
	{
		"id": "default175",
		"filename": "default",
		"name": "에어컨",
		"input": "false",
		"task": "checktoair",
		"output": "고객님 에어컨의 증상을 말씀해주세요.",
		"children": [
			{
				"id": "default172",
				"filename": "default",
				"input": [
					{
						"intent": "약냉"
					}
				],
				"output": {
					"call": "에어컨약냉"
				},
				"name": "dialog_default172"
			},
			{
				"id": "default173",
				"filename": "default",
				"input": [
					{
						"intent": "무냉"
					}
				],
				"output": {
					"call": "에어컨무냉"
				},
				"name": "dialog_default173"
			},
			{
				"id": "default174",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": "죄송합니다. 현재 챗봇 상담은 냉기 관련 증상(약냉, 무냉)만 상담해드리고 있습니다.\n그 외 상담은 콜센터를 이용해주시기 바랍니다.\nLG전자 콜센터 번호는 1577-7314입니다.",
				"name": "dialog_default174"
			}
		]
	},
	{
		"id": "default179",
		"filename": "default",
		"input": "false",
		"task": "checktoair",
		"output": "고객님의 에어컨의 형태를 말씀해주세요.\n(스탠딩 또는 벽걸이)",
		"name": "dialog_default179",
		"children": [
			{
				"id": "default177",
				"filename": "default",
				"input": [
					{
						"entities": [
							"스탠딩@에어컨분류"
						]
					},
					{
						"entities": [
							"벽걸이@에어컨분류"
						]
					}
				],
				"output": {
					"call": "에어컨"
				},
				"name": "dialog_default177"
			},
			{
				"id": "default178",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				},
				"name": "dialog_default178"
			}
		]
	},
	{
		"id": "default180",
		"filename": "default",
		"input": [
			{
				"text": "안녕"
			}
		],
		"output": "안녕하세요",
		"name": "dialog_default180"
	},
	{
		"name": "~네",
		"id": "default183",
		"filename": "default",
		"input": "false",
		"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.",
		"inRaw": "응",
		"inNLP": "응"
	},
	{
		"name": "아니요",
		"id": "default184",
		"filename": "default",
		"input": "false",
		"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.",
		"inRaw": "출장점검",
		"inNLP": "출장 점검"
	},
	{
		"name": "냉장고유형1",
		"id": "default185",
		"filename": "default",
		"input": "false",
		"output": "냉장고가 양문형인가요? 일반형인가요?",
		"inRaw": "냉장고가 안시원해요",
		"inNLP": "냉장고 안 시원하다",
		"children": [
			{
				"name": "dialog_default186",
				"id": "default186",
				"filename": "default",
				"input": [
					{
						"entities": [
							"일반형@냉장고분류"
						]
					},
					{
						"entities": [
							"양문형@냉장고분류"
						]
					}
				],
				"output": {
					"call": "약냉"
				}
			},
			{
				"name": "dialog_default209",
				"id": "default209",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				}
			}
		]
	},
	{
		"name": "냉장고유형2",
		"id": "default187",
		"filename": "default",
		"input": "false",
		"output": "냉장고가 양문형인가요? 일반형인가요?",
		"inRaw": "냉장고",
		"inNLP": "냉장고",
		"children": [
			{
				"name": "dialog_default188",
				"id": "default188",
				"filename": "default",
				"input": [
					{
						"entities": [
							"일반형@냉장고분류"
						]
					},
					{
						"entities": [
							"양문형@냉장고분류"
						]
					}
				],
				"output": {
					"call": "무냉"
				}
			},
			{
				"name": "dialog_default208",
				"id": "default208",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				}
			}
		]
	},
	{
		"name": "에어컨유형1",
		"id": "default189",
		"filename": "default",
		"input": "false",
		"output": "에어컨이 스탠딩인가요? 벽걸이인가요?",
		"inRaw": "에어컨 안시원해",
		"inNLP": "에어컨 안 시원하다",
		"children": [
			{
				"name": "dialog_default190",
				"id": "default190",
				"filename": "default",
				"input": [
					{
						"entities": [
							"벽걸이@에어컨분류"
						]
					},
					{
						"entities": [
							"스탠딩@에어컨분류"
						]
					}
				],
				"output": {
					"call": "에어컨약냉"
				}
			},
			{
				"name": "dialog_default207",
				"id": "default207",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				}
			}
		]
	},
	{
		"name": "에어컨유형2",
		"id": "default192",
		"filename": "default",
		"input": "false",
		"output": "에어컨이 스탠딩인가요? 벽걸이인가요?",
		"inRaw": "에어컨이 잘 안돼",
		"inNLP": "에어컨 자다 안 돼다",
		"children": [
			{
				"name": "dialog_default193",
				"id": "default193",
				"filename": "default",
				"input": [
					{
						"entities": [
							"벽걸이@에어컨분류"
						]
					},
					{
						"entities": [
							"스탠딩@에어컨분류"
						]
					}
				],
				"output": {
					"call": "에어컨무냉"
				}
			},
			{
				"name": "dialog_default206",
				"id": "default206",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				}
			}
		]
	},
	{
		"name": "가전제품유형1",
		"id": "default194",
		"filename": "default",
		"input": "false",
		"output": "에어컨과 냉장고 중 어떤 제품에 문제가 생기셨나요?",
		"inRaw": "안 차가워",
		"inNLP": "안 차갑다",
		"children": [
			{
				"name": "dialog_default195",
				"id": "default195",
				"filename": "default",
				"input": [
					{
						"entities": [
							"에어컨@가전제품"
						]
					}
				],
				"output": {
					"call": "에어컨유형1"
				}
			},
			{
				"name": "dialog_default196",
				"id": "default196",
				"filename": "default",
				"input": [
					{
						"entities": [
							"냉장고@가전제품"
						]
					}
				],
				"output": {
					"call": "냉장고유형1"
				}
			},
			{
				"name": "dialog_default205",
				"id": "default205",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				}
			}
		]
	},
	{
		"name": "가전제품유형2",
		"id": "default197",
		"filename": "default",
		"input": "false",
		"output": "에어컨과 냉장고 중 어떤 제품에 문제가 생기셨나요?",
		"inRaw": "냉기가 없어요",
		"inNLP": "냉기 없다",
		"children": [
			{
				"name": "dialog_default198",
				"id": "default198",
				"filename": "default",
				"input": [
					{
						"entities": [
							"에어컨@가전제품"
						]
					}
				],
				"output": {
					"call": "에어컨유형2"
				}
			},
			{
				"name": "dialog_default199",
				"id": "default199",
				"filename": "default",
				"input": [
					{
						"entities": [
							"냉장고@가전제품"
						]
					}
				],
				"output": {
					"call": "냉장고유형2"
				}
			},
			{
				"name": "dialog_default204",
				"id": "default204",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				}
			}
		]
	},
	{
		"name": "가전제품유형3",
		"id": "default200",
		"filename": "default",
		"input": "false",
		"output": "에어컨과 냉장고 중 어떤 제품에 문제가 생기셨나요?",
		"inRaw": "냉기가 너무 세요",
		"inNLP": "냉기 너무 세요",
		"children": [
			{
				"name": "dialog_default201",
				"id": "default201",
				"filename": "default",
				"input": [
					{
						"entities": [
							"냉장고@가전제품"
						]
					}
				],
				"output": {
					"call": "강냉"
				}
			},
			{
				"name": "dialog_default202",
				"id": "default202",
				"filename": "default",
				"input": [
					{
						"entities": [
							"에어컨@가전제품"
						]
					}
				],
				"output": "죄송합니다. 에어컨의 강냉 관련 질문은 챗봇상담이 불가능합니다."
			},
			{
				"name": "dialog_default203",
				"id": "default203",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				}
			}
		]
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
			}
		],
		"output": "lgdemobot 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "이전",
		"input": [
			{
				"text": "이전"
			}
		],
		"output": {
			"up": "1"
		}
	},
	{
		"id": "defaultcommon2",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("./engine/core/bot")).getBot('lgdemobot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
