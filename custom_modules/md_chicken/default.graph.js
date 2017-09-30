


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"regexp": "(후라이드|양념|간장|반반)\\s?(?:치킨)?\\s?특?(대|중|순살)"
			},
			{
				"regexp": "(두\\s?마리)(?:치킨)?\\s?(후라이드\\s?\\+?\\s?후라이드|후라이드\\s?\\+?\\s?간장(?:치킨)?|후라이드\\s?\\+?\\s?양념(?:치킨)?|간장(?:치킨)?\\s?\\+?\\s?양념(?:치킨)?)"
			},
			{
				"regexp": "(부위\\s?별)?(?:치킨)?\\s?(다리\\s?8개?|통날개\\s?(?:10개)?|다리\\s?\\+?\\s?통날개)"
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
						"text": "[주문목록]\n#orderList#+name+ - +price+\n#\n주문을 완료하시려면 '완료'를, 주문을 추가하시려면 추가하실 메뉴명을 입력해주세요.\n\n*처음으로 가려면 '시작',\n이전으로 가려면 '이전' 을 입력해주세요.",
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
								"regexp": "(후라이드|양념|간장|반반)\\s?(?:치킨)?\\s?특?(대|중|순살)"
							},
							{
								"regexp": "(두\\s?마리)(?:치킨)?\\s?(후라이드\\s?\\+?\\s?후라이드|후라이드\\s?\\+?\\s?간장(?:치킨)?|후라이드\\s?\\+?\\s?양념(?:치킨)?|간장(?:치킨)?\\s?\\+?\\s?양념(?:치킨)?)"
							},
							{
								"regexp": "(부위\\s?별)?(?:치킨)?\\s?(다리\\s?8개?|통날개\\s?(?:10개)?|다리\\s?\\+?\\s?통날개)"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "[주문목록]\n#orderList#+name+ - +price+\n#\n주문을 완료하시려면 '완료'를, 주문을 추가하시려면 추가하실 메뉴명을 입력해주세요.\n\n*처음으로 가려면 '시작', 이전으로 가려면 '이전' 을 입력해주세요."
								}
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
							},
							{
								"regexp": "(간장)"
							},
							{
								"regexp": "(반반)"
							},
							{
								"regexp": "(부위s?별)"
							},
							{
								"regexp": "(두s?마리)"
							}
						],
						"output": [
							{
								"text": "[+detailMenuName+] \n원하시는 메뉴번호를 입력하세요\n\n#detailMenu#+index+. +name+ - +price+\n#",
								"kind": "Text"
							}
						],
						"task": {
							"name": "selectMenu",
							"kind": "Text"
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
									"call": "전번등록",
									"output": {
										"kind": "Action",
										"if": "!context.user.mobile",
										"call": "전번등록"
									}
								}
							},
							{
								"if": "true",
								"kind": "Action",
								"call": "주소번호만족",
								"output": {
									"if": "true",
									"kind": "Action",
									"call": "주소번호만족"
								}
							}
						]
					},
					{
						"name": "다시주문",
						"id": "default20",
						"filename": "default",
						"input": [
							{
								"regexp": "(.*)"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "\"+noMenu+\"은(는) 메뉴에 없는 단어입니다. \n\n올바른 메뉴명을 입력하세요.\n'시작'을 입력하면 처음으로 돌아가고 주문목록이 초기화 됩니다."
								}
							}
						],
						"task": {
							"name": "noMenusave"
						}
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
						"output": {
							"text": "[주문내용]\n#orderList#+name+ - +price+\n#\n\n*배달주소 : +address+\n*주문자 전화번호 : +mobile+\n\n위 내용대로 주문하시겠습니까?",
							"kind": "Text"
						},
						"children": [
							{
								"name": "주문최종완료",
								"id": "default18",
								"filename": "default",
								"input": [
									{
										"intent": "응"
									}
								],
								"output": [
									{
										"text": "주문이 완료되었습니다.\n\n*처음으로 가려면 '시작',\n이전으로 가려면 '이전' 을 입력해주세요.",
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
							},
							{
								"name": "대답다시",
								"id": "default33",
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
											"output": "'응' 혹은 '아니'로 대답해주세요"
										}
									}
								]
							}
						],
						"task": {
							"kind": "Text"
						}
					}
				]
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
			},
			{
				"text": "2"
			}
		],
		"output": [
			{
				"if": "context.user.address",
				"text": "현재 등록된 주소는\n\n\"+address+\"\n\n입니다. 주소 변경을 원하시면 '주소 변경'을 입력해주세요~\n\n*처음으로 가려면 '시작',\n이전으로 가려면 '이전' 을 입력해주세요.",
				"kind": "Text",
				"id": "default10_0"
			},
			{
				"text": "현재 입력된 주소지가 없습니다. 주소 등록을 원하시면 '주소 등록'을 입력하여 주소지를 등록해주세요~\n\n*처음으로 가려면 '시작',\n이전으로 가려면 '이전' 을 입력해주세요.",
				"kind": "Text",
				"id": "default10_1"
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
				"text": "주소 등록"
			}
		],
		"output": {
			"text": "지번 또는 도로명을 포함한 상세주소를 말씀해주세요.",
			"kind": "Text"
		},
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
						"call": "주문완료",
						"type": "Call"
					},
					{
						"text": "주소가\n\n+1+\n\n로 변경되었습니다.\n\n*처음으로 가려면 '시작',\n이전으로 가려면 '이전' 을 입력해주세요.",
						"kind": "Text"
					}
				],
				"task": "saveAddress"
			}
		],
		"task": {
			"kind": "Text"
		}
	},
	{
		"name": "전번확인",
		"id": "default14",
		"filename": "default",
		"input": [
			{
				"text": "3"
			},
			{
				"text": "번호 확인"
			}
		],
		"output": [
			{
				"if": "context.user.mobile",
				"text": "현재 등록된 핸드폰 번호는\n\n+mobile+\n\n입니다. 번호 변경을 원하시면 '번호 변경'을 입력해주세요~\n\n*처음으로 가려면 '시작',\n이전으로 가려면 '이전' 을 입력해주세요.",
				"kind": "Text",
				"id": "default14_0"
			},
			{
				"text": "현재 입력된 번호가 없습니다. 번호 등록을 원하시면 '번호 등록'을 입력하여 핸드폰 번호를 등록해주세요~\n\n*처음으로 가려면 '시작',\n이전으로 가려면 '이전' 을 입력해주세요.",
				"kind": "Text",
				"id": "default14_1"
			}
		]
	},
	{
		"name": "전번등록",
		"id": "default15",
		"filename": "default",
		"input": [
			{
				"text": "번호 변경"
			},
			{
				"text": "번호 등록"
			},
			{
				"text": "핸드폰 변경"
			},
			{
				"text": "핸드폰 등록"
			}
		],
		"output": {
			"text": "핸드폰번호를 입력해주세요",
			"kind": "Text"
		},
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
						"text": "핸드폰번호가\n\n+mobile+\n\n로 변경되었습니다.\n\n*처음으로 가려면 '시작',\n이전으로 가려면 '이전' 을 입력해주세요.",
						"kind": "Text"
					}
				],
				"task": "saveMobile"
			},
			{
				"name": "번호아님",
				"id": "default30",
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
							"output": "핸드폰 번호 형식을 입력해주세요.\n(ex 010-2222-3333 or 01044445555)"
						},
						"type": "Repeat"
					}
				]
			}
		],
		"task": {
			"kind": "Text"
		}
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
			},
			{
				"regexp": "(간장)"
			},
			{
				"regexp": "(반반)"
			},
			{
				"regexp": "(부위s?별)"
			},
			{
				"regexp": "(두s?마리)"
			}
		],
		"output": [
			{
				"text": "[+detailMenuName+]\n원하시는 메뉴번호를 입력하세요\n\n#detailMenu#+index+. +name+ - +price+\n#",
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
			},
			{
				"text": "1"
			}
		],
		"output": [
			{
				"text": "[메뉴판] 원하시는 상세 메뉴의 번호나 이름을 입력하세요.\n\n1. 후라이드 치킨\n2. 양념치킨\n3. 간장치킨\n4. 반반(후라이드 + 양념) 치킨\n5. 두마리치킨\n6. 부위별치킨\n\n*처음으로 가려면 '시작',\n이전으로 가려면 '이전' 을 입력해주세요.",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "메뉴판상세",
				"id": "default32",
				"filename": "default",
				"input": [
					{
						"regexp": "(\\d)"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "추가주문상세"
					}
				],
				"task": "numberMatch"
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
		"output": {
			"text": "안녕하세요 저는 무등치킨이에요! 먹고 싶은 메뉴가 있다면 바로 말씀해주세요~\n(ex 후라이드 특대)\n\n1. 메뉴보기\n2. 주소 확인/변경\n3. 핸드폰번호 확인/변경",
			"kind": "Text"
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
var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('md_chicken');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
