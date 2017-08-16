


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"regexp": "(후라이드|양념|간장|반반)\s?(?:치킨)?\s?특?(대|중|순살)"
			},
			{
				"regexp": "(두\s?마리)(?:치킨)?\s?(후라이드\s?\+?\s?후라이드|후라이드\s?\+?\s?간장(?:치킨)?|후라이드\s?\+?\s?양념(?:치킨)?|간장(?:치킨)?\s?\+?\s?양념(?:치킨)?)"
			},
			{
				"regexp": "(부위별)?(?:치킨)?\s?(다리\s?8개?|통날개\s?(?:10개)?|다리\s?\+?\s?통날개)"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "주문계속"
			}
		],
		"name": "dialog_default0",
		"task": "orderSave",
		"children": [
			{
				"name": "주문계속",
				"id": "default8",
				"filename": "default",
				"input": [
					{
						"text": "치킨"
					}
				],
				"output": [
					{
						"text": "[주문목록]\n#orderList#+name+ - +price+\n#\n\n주문을 완료하시려면 '완료'를, 주문을 추가하시려면 추가하실 메뉴명을 입력해주세요.",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "추가주문2",
						"id": "default9",
						"filename": "default",
						"input": [
							{
								"regexp": "(후라이드|양념|간장|반반)s?(?:치킨)?s?특?(대|중|순살)"
							},
							{
								"regexp": "(두s?마리)(?:치킨)?s?(후라이드s?+?s?후라이드|후라이드s?+?s?간장(?:치킨)?|후라이드s?+?s?양념(?:치킨)?|간장(?:치킨)?s?+?s?양념(?:치킨)?)"
							},
							{
								"regexp": "(부위별)?(?:치킨)?s?(다리s?8개?|통날개s?(?:10개)?|다리s?+?s?통날개)"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "[주문목록] \n#orderList#+name+\n#\n주문을 완료하시려면 '완료'를, 주문을 추가하시려면 추가하실 메뉴명을 입력해주세요."
								},
								"type": "Repeat"
							}
						],
						"task": "orderSave"
					},
					{
						"name": "추가주문상세",
						"id": "default26",
						"filename": "default",
						"input": [
							{
								"regexp": "(후라이드)"
							},
							{
								"regexp": "(양념)"
							}
						],
						"output": [
							{
								"text": "[+detailMenuName+]\n\n#detailMenu#+index+. +name+ - +price+\n#",
								"kind": "Text"
							}
						],
						"task": {
							"name": "selectMenu"
						},
						"children": [
							{
								"name": "추가주문상세2",
								"id": "default27",
								"filename": "default",
								"input": [
									{
										"types": [
											"detailList"
										]
									}
								],
								"output": [
									{
										"kind": "Action",
										"call": "주문계속"
									}
								],
								"task": {
									"name": "detailSelect"
								}
							}
						]
					},
					{
						"name": "주문완료",
						"id": "default13",
						"filename": "default",
						"input": [
							{
								"text": "완료"
							}
						],
						"output": [
							{
								"if": "!context.user.address",
								"kind": "Action",
								"call": "주소등록"
							},
							{
								"kind": "Action",
								"if": "!context.user.mobile",
								"call": "전번등록",
								"output": {
									"kind": "Action",
									"if": "!context.user.mobile",
									"call": "전번등록"
								},
								"inRaw": "서울시",
								"inNLP": "서울시"
							},
							{
								"if": "true",
								"kind": "Action",
								"call": "주소번호만족"
							}
						],
						"inRaw": "서울시",
						"inNLP": "서울시"
					},
					{
						"name": "다시주문",
						"id": "default20",
						"filename": "default",
						"input": [
							{
								"if": "true"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "올바른 메뉴명을 입력하세요"
								}
							}
						]
					},
					{
						"name": "주소번호만족",
						"id": "default17",
						"filename": "default",
						"input": [
							{
								"text": ""
							}
						],
						"output": [
							{
								"text": "주문내용\n#orderList#+name+#\n\n배달주소 : +address+\n주문자 전화번호 : +mobile+\n\n위 내용대로 주문하시겠습니까?",
								"kind": "Text"
							}
						],
						"children": [
							{
								"name": "주문최종완료",
								"id": "default18",
								"filename": "default",
								"input": [
									{
										"text": "응"
									},
									{
										"text": "네"
									}
								],
								"output": [
									{
										"text": "주문이 완료되었습니다.",
										"kind": "Text"
									}
								]
							},
							{
								"name": "주문취소",
								"id": "default29",
								"filename": "default",
								"input": [
									{
										"text": "아니다"
									}
								],
								"output": [
									{
										"text": "주문을 취소했습니다.\n\n처음으로 돌아가시려면 '시작'을 입력해주세요.",
										"kind": "Text"
									}
								]
							}
						]
					}
				],
				"inRaw": "부위별 다리 8개",
				"inNLP": "부위 별 다리 8 개"
			}
		]
	},
	{
		"name": "주소확인",
		"id": "default10",
		"filename": "default",
		"input": [
			{
				"regexp": "주소.*(?:확인|무엇|뭐|알다)"
			}
		],
		"output": [
			{
				"text": "현재 주소는 +address+ 입니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "주소등록",
		"id": "default11",
		"filename": "default",
		"input": [
			{
				"regexp": "주소.*~변경"
			},
			{
				"text": "3"
			}
		],
		"output": [
			{
				"text": "지번 또는 도로명을 포함한 상세주소를 말씀해주세요.",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "주소입력",
				"id": "default12",
				"filename": "default",
				"input": [
					{
						"regexp": "(.*)"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "context.dialog.ordering",
						"call": "주문완료"
					},
					{
						"text": "주소가\n\n+1+\n\n로 변경되었습니다.",
						"kind": "Text"
					}
				],
				"task": "saveAddress"
			}
		],
		"inRaw": "완료",
		"inNLP": "완료"
	},
	{
		"name": "전번확인",
		"id": "default14",
		"filename": "default",
		"input": [
			{
				"text": "핸드폰 번호 확인"
			}
		],
		"output": [
			{
				"text": "현재 등록된 핸드폰 번호는\n\n+mobile+\n\n입니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "전번등록",
		"id": "default15",
		"filename": "default",
		"input": [
			{
				"text": "핸드폰 번호 변경"
			}
		],
		"output": [
			{
				"text": "핸드폰번호를 입력해주세요",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "핸드폰번호입력",
				"id": "default16",
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
						"if": "context.dialog.ordering",
						"call": "주문완료"
					},
					{
						"text": "핸드폰번호가\n\n+mobile+\n\n로 변경되었습니다.",
						"kind": "Text"
					}
				],
				"task": "saveMobile"
			}
		],
		"inRaw": "서울시",
		"inNLP": "서울시"
	},
	{
		"name": "치킨상세",
		"id": "default24",
		"filename": "default",
		"input": [
			{
				"regexp": "(후라이드)"
			},
			{
				"regexp": "(양념)"
			}
		],
		"output": [
			{
				"text": "[+detailMenuName+]\n\n#detailMenu#+index+. +name+ - +price+\n#",
				"kind": "Text"
			}
		],
		"task": "selectMenu",
		"children": [
			{
				"name": "치킨상세선택",
				"id": "default25",
				"filename": "default",
				"input": [
					{
						"types": [
							"detailList"
						]
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "주문계속",
						"type": "Call"
					}
				],
				"task": {
					"name": "detailSelect"
				}
			}
		]
	},
	{
		"name": "메뉴",
		"id": "default28",
		"filename": "default",
		"input": [
			{
				"text": "메뉴"
			}
		],
		"output": [
			{
				"text": "f",
				"kind": "Content"
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
		"output": [
			{
				"text": "안녕하세요 저는 무등치킨이에요! 먹고 싶은 메뉴가 있다면 바로 말씀해주세요~\n\n1. 바로주문(메뉴명 입력)\n2. 메뉴보기\n3. 주소 확인/변경\n4. 핸드폰번호 확인/변경",
				"kind": "Text"
			}
		]
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
		"output": {
			"up": 1
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('md_chicken');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
