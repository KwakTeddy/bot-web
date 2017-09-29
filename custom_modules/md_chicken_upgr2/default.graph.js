


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "1"
			},
			{
				"text": "주문"
			}
		],
		"output": [
			{
				"text": "주문하실 메뉴명을 말씀해주세요!\n(메뉴판: 'ㅁㄴㅍ'입력)",
				"kind": "Text"
			}
		],
		"name": "주문하기",
		"children": [
			{
				"name": "바로주문",
				"id": "default3",
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
							"output": "[주문목록]\n#orderList#+name+ - +price+\n#\n주문을 완료하시려면 '완료'를, 주문을 추가하시려면 추가하실 메뉴명을 입력해주세요.(메뉴판: 'ㅁㄴㅍ'입력)\n\n*주문을 중단하려면 '중단', 이전으로 가려면 '이전' 을 입력해주세요."
						},
						"type": "Repeat"
					}
				],
				"task": "orderSave"
			},
			{
				"name": "추가주문상세",
				"id": "default4",
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
						"regexp": "(부위\\s?별)"
					},
					{
						"regexp": "(두\\s?마리)"
					}
				],
				"output": {
					"text": "[+detailMenuName+] \n원하시는 메뉴번호를 입력하세요\n\n#detailMenu#+index+. +name+ - +price+\n#",
					"kind": "Text"
				},
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
								"call": "주문하기",
								"options": {
									"output": "[주문목록]\n#orderList#+name+ - +price+\n#\n주문을 완료하시려면 '완료'를, 주문을 추가하시려면 추가하실 메뉴명을 입력해주세요.(메뉴판: 'ㅁㄴㅍ'입력)\n\n*주문을 중단하려면 '중단', 이전으로 가려면 '이전' 을 입력해주세요."
								}
							}
						],
						"task": "detailSelect"
					},
					{
						"name": "추가바로주문",
						"id": "default28",
						"filename": "default",
						"input": [
							{
								"text": ""
							}
						],
						"output": [
							{
								"kind": "Action",
								"callChild": "주문하기"
							}
						]
					}
				]
			},
			{
				"name": "주문완료",
				"id": "default29",
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
						"call": "주소등록",
						"type": "Call"
					},
					{
						"kind": "Action",
						"if": "!context.user.mobile",
						"call": "전번등록",
						"type": "Call"
					},
					{
						"if": "true",
						"kind": "Action",
						"call": "주소번호만족",
						"type": "Call"
					}
				],
				"task": {
					"name": "defaultTask"
				}
			},
			{
				"name": "메뉴호출",
				"id": "default44",
				"filename": "default",
				"input": [
					{
						"text": "메뉴"
					},
					{
						"text": "ㅁㄴ"
					},
					{
						"text": "ㅁㄴㅍ"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "메뉴보기"
					}
				]
			},
			{
				"name": "메뉴다시",
				"id": "default43",
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
							"output": "메뉴에 있는 올바른 메뉴명을 입력해주세요!"
						},
						"type": "Repeat"
					}
				]
			},
			{
				"name": "주소번호만족",
				"id": "default30",
				"filename": "default",
				"input": [
					{
						"text": ""
					}
				],
				"output": {
					"text": "[주문내용]\n#orderList#+name+ - +price+\n#\n\n*배달주소 : +address+\n*주문자 전화번호 : +mobile+\n\n위 내용이 맞습니까?\n1. 이대로 주문\n2. 주문 취소\n3. 주소 변경\n4. 전화번호 변경",
					"kind": "Text"
				},
				"children": [
					{
						"name": "주소변경",
						"id": "default35",
						"filename": "default",
						"input": [
							{
								"text": "3"
							},
							{
								"text": "주소"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "주소등록"
							}
						]
					},
					{
						"name": "전번변경",
						"id": "default36",
						"filename": "default",
						"input": [
							{
								"text": "4"
							},
							{
								"text": "번호"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "전번등록"
							}
						]
					},
					{
						"name": "카드현금",
						"id": "default37",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "이대로"
							},
							{
								"text": "주문"
							},
							{
								"text": "응"
							}
						],
						"output": [
							{
								"text": "결제방식을 선택하세요.\n\n1. 카드\n2. 현금\n\n이전으로 가려면 '9' 또는 '이전', \n주문 취소는 '취소'를 입력하세요.",
								"kind": "Text"
							}
						],
						"children": [
							{
								"name": "배달요청사항",
								"id": "default38",
								"filename": "default",
								"input": [
									{
										"text": "1"
									},
									{
										"text": "2"
									},
									{
										"text": "카드"
									},
									{
										"text": "현금"
									}
								],
								"output": [
									{
										"text": "배달시 요청사항을 입력하세요.\n(ex 벨 누르지 말고 노크해주세요)\n\n요청 사항이 없다면 '없음',\n이전으로 가려면 '이전', \n주문 취소는 '취소'를 입력하세요.",
										"kind": "Text"
									}
								],
								"children": [
									{
										"name": "최종확인",
										"id": "default39",
										"filename": "default",
										"input": [
											{
												"if": "true"
											}
										],
										"output": [
											{
												"text": "[주문최종확인]\n#orderList#+name+ - +price+\n#\n\n*배달주소 : +address+\n*주문자 전화번호 : +mobile+\n*결제 : +pay+\n*요청사항 : +request+\n\n위 내용대로 주문하시겠습니까?\n1. 주문\n2. 취소",
												"kind": "Text"
											}
										],
										"children": [
											{
												"name": "주문최종완료",
												"id": "default40",
												"filename": "default",
												"input": [
													{
														"text": "1"
													},
													{
														"text": "주문"
													},
													{
														"text": "완료"
													}
												],
												"output": [
													{
														"text": "주문이 완료되었습니닭!\n\n배달은 20분~40분 가량 소요될 예정입니다.\n\n처음으로 돌아가시려면 '0' 또는 '시작'을 입력해주세요.",
														"kind": "Text"
													}
												],
												"task": "sendMessage"
											},
											{
												"name": "주문최종취소",
												"id": "default42",
												"filename": "default",
												"input": [
													{
														"text": "2"
													},
													{
														"text": "취소"
													},
													{
														"text": "중단"
													}
												],
												"output": [
													{
														"text": "주문이 취소되었습니다.\n\n이전으로 가려면 '9' 또는 '이전', \n처음으로 가려면 '0' 또는 '시작'\n을 입력해주세요.",
														"kind": "Text"
													}
												]
											}
										],
										"task": "saveRequest"
									}
								],
								"task": {
									"name": "savePay"
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
	},
	{
		"name": "메뉴보기",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "2"
			},
			{
				"text": "메뉴"
			},
			{
				"text": "ㅁㄴ"
			}
		],
		"output": [
			{
				"text": "[메뉴판] \n원하시는 상세 메뉴의 번호나 이름을 입력하세요.\n\n1. 후라이드 치킨\n2. 양념치킨\n3. 간장치킨\n4. 반반(후라이드 + 양념) 치킨\n5. 두마리치킨\n6. 부위별치킨\n\n이전으로 가려면 '9' 또는 '이전', \n처음으로 가려면 '0' 또는 '시작'\n을 입력해주세요.('완료'를 입력하면 주문이 완료됩니다.)",
				"buttons": [
					{
						"text": "메뉴 이미지 보기(클릭!)",
						"url": "http://52.78.35.72/img/md_chicken.jpg"
					}
				],
				"kind": "Content"
			}
		],
		"children": [
			{
				"name": "메뉴판상세",
				"id": "default41",
				"filename": "default",
				"input": [
					{
						"regexp": "(\\d)"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "추가주문상세",
						"type": "Call"
					}
				],
				"task": "numberMatch"
			},
			{
				"name": "메뉴에서완료",
				"id": "default45",
				"filename": "default",
				"input": [
					{
						"text": "완료"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "주문완료",
						"type": "Call"
					}
				]
			},
			{
				"name": "메뉴에서주문",
				"id": "default46",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"kind": "Action",
						"callChild": "주문하기"
					}
				]
			}
		],
		"buttons": [
			{
				"text": "메뉴 이미지 보기(클릭!)",
				"url": "http://52.78.35.72/img/md_chicken.jpg"
			}
		]
	},
	{
		"name": "영업시간",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "영업"
			},
			{
				"text": "시간"
			},
			{
				"text": "3"
			}
		],
		"output": [
			{
				"text": "무등치킨의 영업시간은\n\n평일 오전11시 ~ 오후 11시\n주말 오전 11시 ~ 새벽 1시\n\n입니다!\n\n이전으로 가려면 '9' 또는 '이전', \n처음으로 가려면 '0' 또는 '시작'\n을 입력해주세요.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "주소등록",
		"id": "default31",
		"filename": "default",
		"input": [
			{
				"regexp": "주소.*~변경"
			},
			{
				"text": "주소 등록"
			}
		],
		"output": [
			{
				"text": "지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n(ex OO동 OO아파트 XX동 XX호)",
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
						"call": "주문완료",
						"type": "Call"
					},
					{
						"text": "주소가\n\n+inCurRaw+\n\n로 변경되었습니다.\n\n*주문을 중단하려면 '중단',\n이전으로 가려면 '이전' 을 입력해주세요.",
						"kind": "Text"
					}
				],
				"task": "saveAddress"
			}
		]
	},
	{
		"name": "전번등록",
		"id": "default32",
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
		"output": [
			{
				"text": "핸드폰번호를 입력해주세요.\n(숫자만 입력해주세요.)",
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
						"call": "주문완료",
						"type": "Call"
					},
					{
						"text": "핸드폰번호가\n\n+mobile+\n\n로 변경되었습니다.\n\n*주문을 중단하려면 '중단',\n이전으로 가려면 '이전' 을 입력해주세요.",
						"kind": "Text"
					}
				],
				"task": "saveMobile"
			},
			{
				"name": "번호아님",
				"id": "default33",
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
			},
			{
				"text": "취소"
			},
			{
				"text": "중단"
			},
			{
				"text": "0"
			}
		],
		"output": {
			"text": "무등치킨의 문자 주문 전용 채팅창입니다.\n(주문 전 영업시간을 확인해 주세요. 일반적인 문의 사항은 전화 이용 부탁드립니다.)\n\n\n1. 주문하기\n2. 메뉴보기\n3. 영업시간 보기",
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
			},
			{
				"text": "9"
			}
		],
		"output": [
			{
				"up": 1,
				"kind": "Action"
			}
		]
	},
	{
		"id": "defaultcommon2",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [
			{
				"text": ""
			}
		],
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("./engine/core/bot")).getBot('md_chicken_upgr2');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
