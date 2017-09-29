
var path = require('path');
var type = require(path.resolve('modules/bot/action/common/type'));
var address = require(path.resolve('./modules/bot/action/common/address'));
var navertask = require('./navertask');
var publictask = require('./publictask');
var googletask = require('./googletask');
var crawlertask = require('./crawler');
var core = require('./core');
var pre = /(?:~이전페이지|~앞|^<$)/;
var next = /(?:~다음페이지|~뒤|^>$)/;
var up = /(?:^0$)/
var first = /(?:~시작|~처음|^!$|취소)/

var dialogs = [
	{
		"id": "test0",
		"filename": "test",
		"input": [
			{},
			{},
			{}
		],
		"task": {},
		"output": [
			"+outputtext+\n궁금하신걸 물어보세요.\n(목록으로 돌아가기 : [목록] 또는 [플레이챗] 입력)"
		],
		"name": "dialog_test0"
	},
	{
		"id": "test7",
		"filename": "test",
		"name": "예보",
		"input": [
			{
				"types": [
					{
						"name": "address",
						"raw": true
					},
					{
						"name": "date",
						"typeCheck": "dateTypeCheck",
						"raw": true,
						"context": true
					}
				],
				"regexp": {}
			}
		],
		"task": {},
		"output": [
			{
				"if": "(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined",
				"output": "고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.",
				"children": [
					{
						"id": "test3",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "address",
									"raw": true
								}
							]
						},
						"task": {},
						"output": [
							{
								"if": "(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined",
								"output": {
									"repeat": 1,
									"options": {
										"output": "고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다."
									}
								}
							},
							{
								"if": "Array.isArray(context.dialog.address)",
								"output": "다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?",
								"children": [
									{
										"id": "test1",
										"filename": "test",
										"input": {
											"types": [
												{
													"name": "address",
													"listName": "address",
													"typeCheck": "listTypeCheck"
												}
											]
										},
										"output": {
											"call": "예보셋"
										}
									},
									{
										"id": "test2",
										"filename": "test",
										"input": {
											"if": "true"
										},
										"output": {
											"up": 1
										}
									}
								]
							},
							{
								"if": "context.dialog.forecastdatecheck == 'over'",
								"output": "죄송합니다. 현재 최대 10일간의 날씨정보를 제공하고 있습니다."
							},
							{
								"if": "context.dialog.forecastdatecheck == 'below'",
								"output": "죄송합니다. 이전 기간의 날씨정보는 제공하지 않습니다."
							},
							{
								"if": "context.dialog.range == '이번주' || context.dialog.range == '다음주' || context.dialog.range == '이번달'",
								"output": "+range+ +address.법정읍면동명+ 날씨는 다음과 같습니다.\n#item#+month+/+day+\n날씨: +conditions+\n최저온도: +low+도\n최고온도: +high+도\n#"
							},
							{
								"if": "context.dialog.item",
								"output": "+item.date.month+월 +item.date.day+일 +address.법정읍면동명+ 날씨입니다.\n날씨: +item.conditions+\n최저온도: +item.low+도\n최고온도: +item.high+도"
							}
						]
					},
					{
						"id": "test4",
						"filename": "test",
						"input": {
							"if": "true"
						},
						"output": {
							"repeat": 1,
							"options": {
								"output": "죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.\n 아래 예시와 같이 다시 말씀해주세요.\n[예시]\n구로동\n구로구 구로동\n구로구 구로동 423-12"
							}
						}
					}
				]
			},
			{
				"if": "Array.isArray(context.dialog.address)",
				"output": "다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?",
				"children": [
					{
						"id": "test5",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "address",
									"listName": "address",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": {
							"call": "예보셋"
						}
					},
					{
						"id": "test6",
						"filename": "test",
						"input": {
							"if": "true"
						},
						"output": {
							"up": 1
						}
					}
				]
			},
			{
				"if": "context.dialog.forecastdatecheck == 'over'",
				"output": "죄송합니다. 현재 최대 10일간의 날씨정보를 제공하고 있습니다."
			},
			{
				"if": "context.dialog.forecastdatecheck == 'below'",
				"output": "죄송합니다. 이전 기간의 날씨정보는 제공하지 않습니다."
			},
			{
				"if": "context.dialog.range == '이번주' || context.dialog.range == '다음주' || context.dialog.range == '이번달'",
				"output": "+range+ +address.법정읍면동명+ 날씨는 다음과 같습니다.\n#item#+month+/+day+\n날씨: +conditions+\n최저온도: +low+도\n최고온도: +high+도\n#"
			},
			{
				"if": "context.dialog.item",
				"output": "+item.date.month+월 +item.date.day+일 +address.법정읍면동명+ 날씨입니다.\n날씨: +item.conditions+\n최저온도: +item.low+도\n최고온도: +item.high+도"
			}
		]
	},
	{
		"id": "test16",
		"filename": "test",
		"name": "예보둘",
		"input": [
			{
				"types": [
					{
						"name": "date",
						"typeCheck": "dateTypeCheck",
						"raw": true,
						"context": true
					}
				],
				"regexp": {}
			}
		],
		"task": {},
		"output": [
			{
				"if": "context.user.lat == undefined",
				"output": "어느 지역의 날씨를 알려드릴까요?\n[예시]\n구로동\n구로구 구로동\n구로구 구로동 423-12",
				"children": [
					{
						"id": "test14",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "address",
									"raw": true
								}
							]
						},
						"task": {},
						"output": [
							{
								"if": "(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined",
								"output": "고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.",
								"children": [
									{
										"id": "test10",
										"filename": "test",
										"input": {
											"types": [
												{
													"name": "address",
													"raw": true
												}
											]
										},
										"task": {},
										"output": [
											{
												"if": "(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined",
												"output": {
													"repeat": 1,
													"options": {
														"output": "고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다."
													}
												}
											},
											{
												"if": "Array.isArray(context.dialog.address)",
												"output": "다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?",
												"children": [
													{
														"id": "test8",
														"filename": "test",
														"input": {
															"types": [
																{
																	"name": "address",
																	"listName": "address",
																	"typeCheck": "listTypeCheck"
																}
															]
														},
														"output": {
															"call": "예보"
														}
													},
													{
														"id": "test9",
														"filename": "test",
														"input": {
															"if": "true"
														},
														"output": {
															"up": 1
														}
													}
												]
											},
											{
												"if": "context.dialog.forecastdatecheck == 'over'",
												"output": "죄송합니다. 현재 최대 10일간의 날씨정보를 제공하고 있습니다."
											},
											{
												"if": "context.dialog.forecastdatecheck == 'below'",
												"output": "죄송합니다. 이전 기간의 날씨정보는 제공하지 않습니다."
											},
											{
												"if": "context.dialog.range == '이번주' || context.dialog.range == '다음주' || context.dialog.range == '이번달'",
												"output": "+range+ +address.법정읍면동명+ 날씨는 다음과 같습니다.\n#item#+month+/+day+\n날씨: +conditions+\n최저온도: +low+도\n최고온도: +high+도\n#"
											},
											{
												"if": "context.dialog.item",
												"output": "+item.date.month+월 +item.date.day+일 +address.법정읍면동명+ 날씨입니다.\n날씨: +item.conditions+\n최저온도: +item.low+도\n최고온도: +item.high+도"
											}
										]
									},
									{
										"id": "test11",
										"filename": "test",
										"input": {
											"if": "true"
										},
										"output": {
											"repeat": 1,
											"options": {
												"output": "죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.\n 아래 예시와 같이 다시 말씀해주세요.\n[예시]\n구로동\n구로구 구로동\n구로구 구로동 423-12"
											}
										}
									}
								]
							},
							{
								"if": "Array.isArray(context.dialog.address)",
								"output": "다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?",
								"children": [
									{
										"id": "test12",
										"filename": "test",
										"input": {
											"types": [
												{
													"name": "address",
													"listName": "address",
													"typeCheck": "listTypeCheck"
												}
											]
										},
										"output": {
											"call": "예보"
										}
									},
									{
										"id": "test13",
										"filename": "test",
										"input": {
											"if": "true"
										},
										"output": {
											"up": 1
										}
									}
								]
							},
							{
								"if": "context.dialog.forecastdatecheck == 'over'",
								"output": "죄송합니다. 현재 최대 10일간의 날씨정보를 제공하고 있습니다."
							},
							{
								"if": "context.dialog.forecastdatecheck == 'below'",
								"output": "죄송합니다. 이전 기간의 날씨정보는 제공하지 않습니다."
							},
							{
								"if": "context.dialog.range == '이번주' || context.dialog.range == '다음주' || context.dialog.range == '이번달'",
								"output": "+range+ +address.법정읍면동명+ 날씨는 다음과 같습니다.\n#item#+month+/+day+\n날씨: +conditions+\n최저온도: +low+도\n최고온도: +high+도\n#"
							},
							{
								"if": "context.dialog.item",
								"output": "+item.date.month+월 +item.date.day+일 +address.법정읍면동명+ 날씨입니다.\n날씨: +item.conditions+\n최저온도: +item.low+도\n최고온도: +item.high+도"
							}
						]
					},
					{
						"id": "test15",
						"filename": "test",
						"input": {
							"if": "true"
						},
						"output": {
							"repeat": 1,
							"options": {
								"output": "주소가 올바르지 않습니다.\n아래와 같이 입력해주세요.\n[예시]\n구로동\n구로구 구로동\n구로구 구로동 423-12"
							}
						}
					}
				]
			},
			{
				"if": "context.user.lat != undefined && context.dialog.forecastdatecheck == 'over'",
				"output": "죄송합니다. 현재 최대 10일간의 날씨정보를 제공하고 있습니다."
			},
			{
				"if": "context.user.lat != undefined && context.dialog.forecastdatecheck == 'below'",
				"output": "죄송합니다. 이전 기간의 날씨정보는 제공하지 않습니다."
			},
			{
				"if": "context.user.lat != undefined && context.dialog.range == '이번주' || context.dialog.range == '다음주' || context.dialog.range == '이번달'",
				"output": "+range+ +address.법정읍면동명+ 날씨는 다음과 같습니다.\n#item#+month+/+day+\n날씨: +conditions+\n최저온도: +low+도\n최고온도: +high+도\n#"
			},
			{
				"if": "context.user.lat != undefined && context.dialog.item",
				"output": "+item.date.month+월 +item.date.day+일 +address.법정읍면동명+ 날씨입니다.\n날씨: +item.conditions+\n최저온도: +item.low+도\n최고온도: +item.high+도"
			}
		]
	},
	{
		"id": "test23",
		"filename": "test",
		"name": "현재날씨",
		"input": [
			{
				"types": [
					{
						"name": "address",
						"raw": true
					}
				],
				"regexp": {}
			}
		],
		"task": {},
		"output": [
			{
				"if": "(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined",
				"output": "고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.",
				"children": [
					{
						"id": "test19",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "address",
									"raw": true
								}
							]
						},
						"task": {},
						"output": [
							{
								"if": "(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined",
								"output": {
									"repeat": 1,
									"options": {
										"output": "고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다."
									}
								}
							},
							{
								"if": "Array.isArray(context.dialog.address)",
								"output": "다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?",
								"children": [
									{
										"id": "test17",
										"filename": "test",
										"input": {
											"types": [
												{
													"name": "address",
													"listName": "address",
													"typeCheck": "listTypeCheck"
												}
											]
										},
										"output": {
											"call": "현재날씨"
										}
									},
									{
										"id": "test18",
										"filename": "test",
										"input": {
											"if": "true"
										},
										"output": {
											"up": 1
										}
									}
								]
							},
							{
								"if": "context.dialog.weather",
								"output": "현재 +address.법정읍면동명+ 날씨는 +weather+입니다.\n기온은 +temp+도 입니다."
							}
						]
					},
					{
						"id": "test20",
						"filename": "test",
						"input": {
							"if": "true"
						},
						"output": {
							"repeat": 1,
							"options": {
								"output": "죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.\n 아래 예시와 같이 다시 말씀해주세요.\n[예시]\n구로동\n구로구 구로동\n구로구 구로동 423-12"
							}
						}
					}
				]
			},
			{
				"if": "Array.isArray(context.dialog.address)",
				"output": "다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?",
				"children": [
					{
						"id": "test21",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "address",
									"listName": "address",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": {
							"call": "현재날씨"
						}
					},
					{
						"id": "test22",
						"filename": "test",
						"input": {
							"if": "true"
						},
						"output": {
							"up": 1
						}
					}
				]
			},
			{
				"if": "context.dialog.weather",
				"output": "현재 +address.법정읍면동명+ 날씨는 +weather+입니다.\n기온은 +temp+도 입니다."
			}
		]
	},
	{
		"id": "test32",
		"filename": "test",
		"name": "현재날씨둘",
		"input": [
			"날씨"
		],
		"task": {},
		"output": [
			{
				"if": "context.user.lat == undefined",
				"output": "어느 지역의 날씨를 알려드릴까요?\n[예시]\n구로동\n구로구 구로동\n구로구 구로동 423-12",
				"children": [
					{
						"id": "test30",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "address",
									"raw": true
								}
							]
						},
						"task": {},
						"output": [
							{
								"if": "(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined",
								"output": "고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.",
								"children": [
									{
										"id": "test26",
										"filename": "test",
										"input": {
											"types": [
												{
													"name": "address",
													"raw": true
												}
											]
										},
										"task": {},
										"output": [
											{
												"if": "(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined",
												"output": {
													"repeat": 1,
													"options": {
														"output": "고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다."
													}
												}
											},
											{
												"if": "Array.isArray(context.dialog.address)",
												"output": "다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?",
												"children": [
													{
														"id": "test24",
														"filename": "test",
														"input": {
															"types": [
																{
																	"name": "address",
																	"listName": "address",
																	"typeCheck": "listTypeCheck"
																}
															]
														},
														"output": {
															"call": "현재날씨"
														}
													},
													{
														"id": "test25",
														"filename": "test",
														"input": {
															"if": "true"
														},
														"output": {
															"up": 1
														}
													}
												]
											},
											{
												"if": "context.dialog.weather",
												"output": "현재 +address.법정읍면동명+ 날씨는 +weather+입니다.\n기온은 +temp+도 입니다."
											}
										]
									},
									{
										"id": "test27",
										"filename": "test",
										"input": {
											"if": "true"
										},
										"output": {
											"repeat": 1,
											"options": {
												"output": "죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.\n 아래 예시와 같이 다시 말씀해주세요.\n[예시]\n구로동\n구로구 구로동\n구로구 구로동 423-12"
											}
										}
									}
								]
							},
							{
								"if": "Array.isArray(context.dialog.address)",
								"output": "다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?",
								"children": [
									{
										"id": "test28",
										"filename": "test",
										"input": {
											"types": [
												{
													"name": "address",
													"listName": "address",
													"typeCheck": "listTypeCheck"
												}
											]
										},
										"output": {
											"call": "현재날씨"
										}
									},
									{
										"id": "test29",
										"filename": "test",
										"input": {
											"if": "true"
										},
										"output": {
											"up": 1
										}
									}
								]
							},
							{
								"if": "context.dialog.weather",
								"output": "현재 +address.법정읍면동명+ 날씨는 +weather+입니다.\n기온은 +temp+도 입니다."
							}
						]
					},
					{
						"id": "test31",
						"filename": "test",
						"input": {
							"if": "true"
						},
						"output": {
							"repeat": 1,
							"options": {
								"output": "주소가 올바르지 않습니다.\n아래와 같이 입력해주세요.\n[예시]\n구로동\n구로구 구로동\n구로구 구로동 423-12"
							}
						}
					}
				]
			},
			{
				"if": "context.user.lat != undefined && context.dialog.weather",
				"output": "현재 +address.법정읍면동명+ 날씨는 +weather+입니다.\n기온은 +temp+도 입니다."
			}
		]
	},
	{
		"id": "test33",
		"filename": "test",
		"input": [
			{
				"types": [
					{
						"name": "exchange",
						"raw": true
					}
				],
				"regexp": {}
			}
		],
		"task": {},
		"output": [
			{
				"if": "context.dialog.item[0].rate != 'N/A'",
				"output": "+date+\n+currency+ to KRW\n환율은 +rate+원입니다."
			},
			{
				"if": "context.dialog.item[0].rate == 'N/A'",
				"output": {
					"call": "환율",
					"options": {
						"output": "환율 코드 혹은 통화명을 제대로 입력해주세요."
					}
				}
			}
		],
		"name": "dialog_test33"
	},
	{
		"id": "test36",
		"filename": "test",
		"name": "환율",
		"input": [
			"환율"
		],
		"output": [
			"환율코드나 통화를 입력해주세요\n ex) USD or 달러"
		],
		"children": [
			{
				"id": "test34",
				"filename": "test",
				"input": [
					{
						"types": [
							{
								"name": "exchange",
								"raw": true
							}
						]
					}
				],
				"task": {},
				"output": [
					{
						"if": "context.dialog.item[0].rate != 'N/A'",
						"output": "+date+\n+currency+ to KRW\n환율은 +rate+원입니다."
					},
					{
						"if": "context.dialog.item[0].rate == 'N/A'",
						"output": {
							"repeat": 1,
							"options": {
								"output": "환율 코드 혹은 통화명을 제대로 입력해주세요."
							}
						}
					}
				],
				"name": "dialog_test34"
			},
			{
				"id": "test35",
				"filename": "test",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"repeat": 1,
						"options": {
							"output": "환율 코드 혹은 통화명을 제대로 입력해주세요."
						}
					}
				],
				"name": "dialog_test35",
				"task": {
					"name": ""
				}
			}
		],
		"task": {
			"name": ""
		}
	},
	{
		"id": "test37",
		"filename": "test",
		"input": [
			{
				"types": [
					{
						"name": "stock",
						"raw": true
					}
				],
				"regexp": {}
			}
		],
		"task": {},
		"output": [
			{
				"if": "context.dialog.item.length != 0",
				"output": "[+stockname+]\n+Date+\n\n종가: +lastTradePriceOnly+원"
			}
		],
		"name": "dialog_test37"
	},
	{
		"id": "test40",
		"filename": "test",
		"input": [
			"주가",
			"주식"
		],
		"output": [
			"회사코드나 이름을 알려주세요 AAPL or 삼성전자?"
		],
		"children": [
			{
				"id": "test38",
				"filename": "test",
				"input": [
					{
						"types": [
							{
								"name": "stock",
								"raw": true
							}
						]
					}
				],
				"task": {},
				"output": [
					{
						"if": "context.dialog.item.length != 0",
						"output": "[+stockname+]\n+Date+\n\n종가: +lastTradePriceOnly+원"
					}
				],
				"name": "dialog_test38"
			},
			{
				"id": "test39",
				"filename": "test",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					"죄송합니다. 등록되지 않은 회사명입니다."
				],
				"name": "dialog_test39",
				"task": {
					"name": ""
				}
			}
		],
		"name": "dialog_test40",
		"task": {
			"name": ""
		}
	},
	{
		"id": "test42",
		"filename": "test",
		"input": [
			{},
			{}
		],
		"task": {},
		"output": [
			{
				"if": "context.dialog.item.length != 0 && context.user.channel == 'socket'",
				"output": "검색결과가 없습니다."
			},
			{
				"if": "context.dialog.item.length != 0",
				"output": "뉴스 검색결과입니다.\n#item#+index+. +title+\n#",
				"children": [
					{
						"id": "test41",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "item",
									"listName": "item",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": "[+item.company+] +item.title+\n+item.body+\n+item.link+"
					}
				]
			},
			{
				"if": "context.dialog.item.length ==0",
				"output": "검색결과가 없습니다."
			}
		],
		"name": "dialog_test42"
	},
	{
		"id": "test44",
		"filename": "test",
		"name": "뉴스",
		"input": [
			"뉴스",
			"신문"
		],
		"task": {
			"module": "http",
			"action": "simpleRequest",
			"uri": "http://media.daum.net/ranking/popular",
			"method": "GET",
			"xpath": {
				"_repeat": "//*[@id=\"mArticle\"]/div[2]/ul[3]/li",
				"link": ".//div[2]/strong/a/@href",
				"company": ".//div[2]/strong/span/text()",
				"title": ".//div[2]/strong/a/text()",
				"imageUrl": ".//a/img/@src",
				"body": ".//div[2]/div/span/text()"
			},
			"name": "newscrawl"
		},
		"output": [
			{
				"if": "context.dialog.item.length != 0 && context.user.channel == 'socket'",
				"output": "검색결과가 없습니다."
			},
			{
				"if": "context.dialog.item.length != 0",
				"output": "오늘의 이슈입니다.\n#item#+index+. +title+\n#",
				"children": [
					{
						"id": "test43",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "item",
									"listName": "item",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": "[+item.company+] +item.title+\n+item.body+\n+item.link+"
					}
				]
			}
		]
	},
	{
		"id": "test46",
		"filename": "test",
		"name": "영화",
		"input": [
			"영화"
		],
		"task": {
			"module": "http",
			"action": "simpleRequest",
			"uri": "http://ticket2.movie.daum.net/Movie/MovieRankList.aspx",
			"method": "GET",
			"xpath": {
				"_repeat": "//*[@id=\"mArticle\"]/div/div[2]/div[1]/div/ul/li",
				"link": ".//div/strong/a/@href",
				"rate": ".//div/div/em/text()",
				"title": ".//div/strong/a/text()",
				"imageUrl": ".//a/img/@src",
				"reserverate": ".//div/dl/dd[2]/text()[1]"
			},
			"name": "moviecrawl"
		},
		"output": [
			{
				"if": "context.dialog.item.length != 0 && context.user.channel == 'socket'",
				"output": "검색결과가 없습니다."
			},
			{
				"if": "context.dialog.item.length != 0",
				"output": "박스오피스 순위입니다.\n#item#+index+. +title+\n#",
				"children": [
					{
						"id": "test45",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "item",
									"listName": "item",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": "[+item.title+]\n평점+item.rate+ +item.reserverate+\n+item.link+"
					}
				]
			}
		]
	},
	{
		"id": "test48",
		"filename": "test",
		"name": "인기봇",
		"input": [
			"인기 봇"
		],
		"task": {},
		"output": [
			"인기봇 리스트입니다.\n#popularbot#+index+. +name+\n#"
		],
		"children": [
			{
				"id": "test47",
				"filename": "test",
				"input": [
					{
						"types": [
							{
								"name": "selectbot",
								"listName": "popularbot",
								"typeCheck": "listTypeCheck"
							}
						]
					}
				],
				"task": {},
				"output": [
					"봇이 변경되었습니다."
				],
				"name": "dialog_test47"
			}
		]
	},
	{
		"id": "test50",
		"filename": "test",
		"name": "최신봇",
		"input": [
			"최신 봇"
		],
		"task": {},
		"output": [
			"최신봇 리스트입니다.\n#newbot#+index+. +name+\n#"
		],
		"children": [
			{
				"id": "test49",
				"filename": "test",
				"input": [
					{
						"types": [
							{
								"name": "selectbot",
								"listName": "newbot",
								"typeCheck": "listTypeCheck"
							}
						]
					}
				],
				"task": {},
				"output": [
					"봇이 변경되었습니다."
				],
				"name": "dialog_test49"
			}
		]
	},
	{
		"id": "test55",
		"filename": "test",
		"name": "친구봇",
		"input": [
			"친구 봇"
		],
		"task": {},
		"output": [
			{
				"if": "context.user.check == true",
				"output": {
					"call": "친구봇리스트"
				}
			},
			{
				"if": "context.user.check == false",
				"output": "ID[이메일]를 입력해주세요",
				"children": [
					{
						"id": "test53",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "email",
									"raw": true
								}
							]
						},
						"task": {},
						"output": [
							{
								"if": "context.dialog.emailusercheck == true",
								"output": "고객님의 메일로 인증코드를 전송하였습니다.\n인증코드를 입력해주세요.",
								"children": [
									{
										"id": "test51",
										"filename": "test",
										"input": {
											"types": [
												{
													"name": "code",
													"raw": true
												}
											]
										},
										"task": {},
										"output": [
											{
												"if": "context.dialog.codecheck == true",
												"output": {
													"call": "친구봇리스트"
												}
											},
											{
												"if": "context.dialog.codecheck == false",
												"output": {
													"repeat": 1,
													"options": {
														"output": "인증코드가 잘못되었습니다.\n다시입력해주세요."
													}
												}
											}
										]
									},
									{
										"id": "test52",
										"filename": "test",
										"input": {
											"if": "true"
										},
										"output": {
											"repeat": 1,
											"options": {
												"output": "인증코드의 형식이 틀렸습니다.\n다시입력해주세요."
											}
										}
									}
								]
							},
							{
								"if": "context.dialog.emailusercheck == false",
								"output": {
									"repeat": 1,
									"options": {
										"output": "가입되지 않은 ID[이메일]입니다.\n아래 링크에서 가입 후 진행해주세요."
									}
								}
							}
						]
					},
					{
						"id": "test54",
						"filename": "test",
						"input": {
							"if": "true"
						},
						"output": {
							"repeat": 1,
							"options": {
								"output": "ID[이메일] 형식이 틀렸습니다.\n다시입력해주세요."
							}
						}
					}
				]
			}
		]
	},
	{
		"id": "test57",
		"filename": "test",
		"name": "친구봇리스트",
		"input": [
			"친구 봇"
		],
		"task": {},
		"output": [
			"친구봇 리스트입니다.\n#followbot#+index+. +name+\n#"
		],
		"children": [
			{
				"id": "test56",
				"filename": "test",
				"input": [
					{
						"types": [
							{
								"name": "selectbot",
								"listName": "followbot",
								"typeCheck": "listTypeCheck"
							}
						]
					}
				],
				"task": {},
				"output": [
					"봇이 변경되었습니다."
				],
				"name": "dialog_test56"
			}
		]
	},
	{
		"id": "test62",
		"filename": "test",
		"name": "마이봇",
		"input": [
			"마이 봇"
		],
		"task": {},
		"output": [
			{
				"if": "context.user.check == true",
				"output": {
					"call": "마이봇리스트"
				}
			},
			{
				"if": "context.user.check == false",
				"output": "ID[이메일]를 입력해주세요d",
				"children": [
					{
						"id": "test60",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "email",
									"raw": true
								}
							]
						},
						"task": {},
						"output": [
							{
								"if": "context.dialog.emailusercheck == true",
								"output": "고객님의 메일로 인증코드를 전송하였습니다.\n인증코드를 입력해주세요.",
								"children": [
									{
										"id": "test58",
										"filename": "test",
										"input": {
											"types": [
												{
													"name": "code",
													"raw": true
												}
											]
										},
										"task": {},
										"output": [
											{
												"if": "context.dialog.codecheck == true",
												"output": {
													"call": "마이봇리스트"
												}
											},
											{
												"if": "context.dialog.codecheck == false",
												"output": {
													"repeat": 1,
													"options": {
														"output": "인증코드가 잘못되었습니다.\n다시입력해주세요."
													}
												}
											}
										]
									},
									{
										"id": "test59",
										"filename": "test",
										"input": {
											"if": "true"
										},
										"output": {
											"repeat": 1,
											"options": {
												"output": "인증코드의 형식이 틀렸습니다.\n다시입력해주세요."
											}
										}
									}
								]
							},
							{
								"if": "context.dialog.emailusercheck == false",
								"output": {
									"repeat": 1,
									"options": {
										"output": "가입되지 않은 ID[이메일]입니다.\n아래 링크에서 가입 후 진행해주세요."
									}
								}
							}
						]
					},
					{
						"id": "test61",
						"filename": "test",
						"input": {
							"if": "true"
						},
						"output": {
							"repeat": 1,
							"options": {
								"output": "ID[이메일] 형식이 틀렸습니다.\n다시입력해주세요."
							}
						}
					}
				]
			}
		]
	},
	{
		"id": "test64",
		"filename": "test",
		"name": "마이봇리스트",
		"input": [
			false
		],
		"task": {},
		"output": [
			"마이봇 리스트입니다.\n#mybot#+index+. +name+\n#"
		],
		"children": [
			{
				"id": "test63",
				"filename": "test",
				"input": [
					{
						"types": [
							{
								"name": "selectbot",
								"listName": "mybot",
								"typeCheck": "listTypeCheck"
							}
						]
					}
				],
				"task": {},
				"output": [
					"봇이 변경되었습니다."
				],
				"name": "dialog_test63"
			}
		]
	},
	{
		"id": "test66",
		"filename": "test",
		"name": "주변검색",
		"input": [
			"주변",
			"근처",
			"꺼져"
		],
		"task": {},
		"output": [
			{
				"if": "context.dialog.item.length == 0",
				"output": "검색결과가 존재하지 않습니다."
			},
			{
				"if": "context.dialog.item.length != 0 && context.user.channel == 'socket'",
				"output": "검색결과가 없습니다."
			},
			{
				"if": "context.dialog.item.length != 0",
				"output": "\"+inRaw+\"에 대한 주변 검색 결과입니다.\n#item#+index+. +title+\n#",
				"children": [
					{
						"id": "test65",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "item",
									"listName": "item",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": "+item.title+\n+item.roadAddress+\n+item.telephone+"
					}
				]
			}
		]
	},
	{
		"id": "test68",
		"filename": "test",
		"name": "구글검색",
		"input": [
			{}
		],
		"task": {
			"module": "http",
			"action": "simpleRequest",
			"uri": "https://www.google.co.kr/search",
			"method": "GET",
			"param": {
				"aqs": "chrome..69i57j69i60j0l4.62443j0j4",
				"sourceid": "chrome",
				"ie": "UTF-8"
			},
			"xpath": {
				"_repeat": "//div[@class=\"_NId\"]/div[@class=\"srg\"]/div",
				"title": ".//div/h3/a/text()",
				"body": ".//div/div/span/node()",
				"url": ".//div/h3/a/@href"
			},
			"name": "googlesearchtask"
		},
		"output": [
			{
				"if": "context.dialog.item.length !=0 && context.user.channel == 'socket'",
				"output": "검색결과가 없습니다."
			},
			{
				"if": "context.dialog.search.length !=0",
				"output": "#search#+index+. +title+\n#",
				"children": [
					{
						"id": "test67",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "search",
									"listName": "search",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": "+search.title+\n+search.snippet+\n+search.url+"
					}
				]
			}
		]
	},
	{
		"id": "test71",
		"filename": "test",
		"input": [
			"검색"
		],
		"output": [
			"어떤 것을 찾으시나요?\n검색어를 입력해주세요."
		],
		"children": [
			{
				"id": "test70",
				"filename": "test",
				"input": [
					{}
				],
				"task": {
					"module": "http",
					"action": "simpleRequest",
					"uri": "https://www.google.co.kr/search",
					"method": "GET",
					"param": {
						"aqs": "chrome..69i57j69i60j0l4.62443j0j4",
						"sourceid": "chrome",
						"ie": "UTF-8"
					},
					"xpath": {
						"_repeat": "//div[@class=\"_NId\"]/div[@class=\"srg\"]/div",
						"title": ".//div/h3/a/text()",
						"body": ".//div/div/span/node()",
						"url": ".//div/h3/a/@href"
					},
					"name": "googlesearchtask"
				},
				"output": [
					{
						"if": "context.dialog.item.length !=0 && context.user.channel == 'socket'",
						"output": "검색결과가 없습니다."
					},
					{
						"if": "context.dialog.search.length !=0",
						"output": "#search#+index+. +title+\n#",
						"children": [
							{
								"id": "test69",
								"filename": "test",
								"input": {
									"types": [
										{
											"name": "search",
											"listName": "search",
											"typeCheck": "listTypeCheck"
										}
									]
								},
								"output": "+search.title+\n+search.snippet+\n+search.url+"
							}
						]
					}
				],
				"name": "dialog_test70"
			}
		],
		"name": "dialog_test71",
		"task": {
			"name": ""
		}
	},
	{
		"id": "test73",
		"filename": "test",
		"name": "쇼핑",
		"input": [
			{}
		],
		"task": {},
		"output": [
			{
				"if": "context.dialog.item.length !=0 && context.user.channel == 'socket'",
				"output": "검색결과가 없습니다."
			},
			{
				"if": "context.dialog.item.length !=0",
				"output": "#item#+index+. +title+\n+lprice+\n#",
				"children": [
					{
						"id": "test72",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "item",
									"listName": "item",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": "+item.title+\n+item.lprice+ ~ +item.hprice+\n+item.link+"
					}
				]
			},
			{
				"if": "context.dialog.item.length ==0",
				"output": "검색결과가 없습니다."
			}
		]
	},
	{
		"id": "test76",
		"filename": "test",
		"input": [
			"쇼핑",
			"가격"
		],
		"output": [
			"어떤 것을 찾으시나요?\n검색어를 입력해주세요."
		],
		"children": [
			{
				"id": "test75",
				"filename": "test",
				"input": [
					{}
				],
				"task": {},
				"output": [
					{
						"if": "context.dialog.item.length !=0 && context.user.channel == 'socket'",
						"output": "검색결과가 없습니다."
					},
					{
						"if": "context.dialog.item.length !=0",
						"output": "#item#+index+. +title+\n+lprice+\n#",
						"children": [
							{
								"id": "test74",
								"filename": "test",
								"input": {
									"types": [
										{
											"name": "item",
											"listName": "item",
											"typeCheck": "listTypeCheck"
										}
									]
								},
								"output": "+item.title+\n+item.lprice+ ~ +item.hprice+\n+item.link+"
							}
						]
					},
					{
						"if": "context.dialog.item.length ==0",
						"output": "검색결과가 없습니다."
					}
				],
				"name": "dialog_test75"
			}
		],
		"name": "dialog_test76",
		"task": {
			"name": ""
		}
	},
	{
		"id": "test78",
		"filename": "test",
		"name": "주변검색둘",
		"input": [
			{
				"types": [
					{
						"name": "address",
						"raw": true
					}
				]
			}
		],
		"task": {},
		"output": [
			{
				"if": "context.dialog.item.length == 0",
				"output": "검색결과가 존재하지 않습니다."
			},
			{
				"if": "context.dialog.item.length != 0 && context.user.channel == 'socket'",
				"output": "검색결과가 없습니다."
			},
			{
				"if": "context.dialog.item.length != 0",
				"output": "\"+inRaw+\"에 대한 주변 검색 결과입니다.\n#item#+index+. +title+\n#",
				"children": [
					{
						"id": "test77",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "item",
									"listName": "item",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": "+item.title+\n+item.roadAddress+\n+item.telephone+"
					}
				]
			}
		]
	},
	{
		"id": "test80",
		"filename": "test",
		"name": "음악",
		"input": [
			{}
		],
		"task": {},
		"output": [
			{
				"if": "context.dialog.item.length !=0 && context.user.channel == 'socket'",
				"output": "검색결과가 없습니다."
			},
			{
				"if": "context.dialog.item.length !=0",
				"output": "#item#+index+. +artistName+ - +item.trackName+\n#",
				"children": [
					{
						"id": "test79",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "item",
									"listName": "item",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": "+item.artistName+ - +item.trackName+\n+item.collectionName+\n+item.previewUrl+"
					}
				]
			},
			{
				"if": "context.dialog.item.length ==0",
				"output": "검색결과가 없습니다."
			}
		]
	},
	{
		"id": "test83",
		"filename": "test",
		"input": [
			"음악"
		],
		"output": [
			"어떤 음악을 찾아드릴까요?\n가수명 혹은 곡명을 입력해주세요."
		],
		"children": [
			{
				"id": "test82",
				"filename": "test",
				"input": [
					{}
				],
				"task": {},
				"output": [
					{
						"if": "context.dialog.item.length !=0 && context.user.channel == 'socket'",
						"output": "검색결과가 없습니다."
					},
					{
						"if": "context.dialog.item.length !=0",
						"output": "#item#+index+. +artistName+ - +item.trackName+\n#",
						"children": [
							{
								"id": "test81",
								"filename": "test",
								"input": {
									"types": [
										{
											"name": "item",
											"listName": "item",
											"typeCheck": "listTypeCheck"
										}
									]
								},
								"output": "+item.artistName+ - +item.trackName+\n+item.collectionName+\n+item.previewUrl+"
							}
						]
					},
					{
						"if": "context.dialog.item.length ==0",
						"output": "검색결과가 없습니다."
					}
				],
				"name": "dialog_test82"
			}
		],
		"name": "dialog_test83",
		"task": {
			"name": ""
		}
	},
	{
		"id": "test85",
		"filename": "test",
		"name": "동영상",
		"input": [
			{}
		],
		"task": {},
		"output": [
			{
				"if": "context.dialog.item.length !=0 && context.user.channel == 'socket'",
				"output": "검색결과가 없습니다."
			},
			{
				"if": "context.dialog.item.length !=0",
				"output": "#item#+index+. +title+\n+lprice+\n#",
				"children": [
					{
						"id": "test84",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "item",
									"listName": "item",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": "+item.title+\n+item.lprice+ ~ +item.hprice+\n+item.link+"
					}
				]
			},
			{
				"if": "context.dialog.item.length ==0",
				"output": "검색결과가 없습니다."
			}
		]
	},
	{
		"id": "test88",
		"filename": "test",
		"input": [
			"동영상"
		],
		"output": [
			"어떤 동영상을 찾아드릴까요?\n검색어를 입력해주세요."
		],
		"children": [
			{
				"id": "test87",
				"filename": "test",
				"input": [
					{}
				],
				"task": {},
				"output": [
					{
						"if": "context.dialog.item.length !=0 && context.user.channel == 'socket'",
						"output": "검색결과가 없습니다."
					},
					{
						"if": "context.dialog.item.length !=0",
						"output": "#item#+index+. +title+\n+lprice+\n#",
						"children": [
							{
								"id": "test86",
								"filename": "test",
								"input": {
									"types": [
										{
											"name": "item",
											"listName": "item",
											"typeCheck": "listTypeCheck"
										}
									]
								},
								"output": "+item.title+\n+item.lprice+ ~ +item.hprice+\n+item.link+"
							}
						]
					},
					{
						"if": "context.dialog.item.length ==0",
						"output": "검색결과가 없습니다."
					}
				],
				"name": "dialog_test87"
			}
		],
		"name": "dialog_test88",
		"task": {
			"name": ""
		}
	},
	{
		"id": "test90",
		"filename": "test",
		"input": [
			{}
		],
		"task": {},
		"output": [
			{
				"if": "context.dialog.item.length !=0 && context.user.channel == 'socket'",
				"output": "검색결과가 없습니다."
			},
			{
				"if": "context.dialog.item.length !=0",
				"output": "#item#+index+. +artistName+ - +doc.trackName+\n#",
				"children": [
					{
						"id": "test89",
						"filename": "test",
						"input": {
							"types": [
								{
									"name": "item",
									"listName": "item",
									"typeCheck": "listTypeCheck"
								}
							]
						},
						"output": "+item.artistName+ - +item.trackName+\n+item.collectionName+\n+item.previewUrl+"
					}
				]
			}
		],
		"name": "dialog_test90"
	},
	{
		"id": "test91",
		"filename": "test",
		"input": [
			"lgcatex"
		],
		"task": {
			"module": "http",
			"action": "simpleRequest",
			"uri": "https://www.lgservice.co.kr/main.do#none",
			"method": "GET",
			"xpath": {
				"_repeat": "//*[@id=\"container\"]/div[2]/div[1]/div/ul/li",
				"pane": {
					"_repeat": "./ul/li",
					"cate1": "./h3/text()",
					"cate2": {
						"_repeat": "./ul/li",
						"catecode": "./a/@data-catecode",
						"catename": "./a/@data-catename",
						"parentcatename": "./a/@data-parentcatename",
						"parentcatecode": "./a/@data-parentcatecode"
					}
				}
			},
			"name": "lgcate1"
		},
		"output": [
			{
				"if": "context.dialog.item.length != 0",
				"output": "오늘의 이슈입니다.\n#item#+index+. +title+\n#"
			}
		],
		"name": "dialog_test91"
	},
	{
		"id": "test92",
		"filename": "test",
		"input": [
			"lgcatey"
		],
		"task": {
			"module": "http",
			"action": "simpleRequest",
			"uri": "https://www.lgservice.co.kr/main/selectKeyWordList.do",
			"method": "POST",
			"param": {
				"catecode": "C000136",
				"parentcatecode": "1018"
			},
			"name": "lgcate2"
		},
		"output": [
			{
				"if": "context.dialog.item.length != 0",
				"output": "오늘의 이슈입니다.\n#item#+index+. +title+\n#"
			}
		],
		"name": "dialog_test92"
	},
	{
		"id": "test93",
		"filename": "test",
		"input": [
			"lglist"
		],
		"task": {
			"module": "http",
			"action": "simpleRequest",
			"uri": "https://www.lgservice.co.kr/keywordSearch/simpleEasySearchPage.do",
			"method": "GET",
			"param": {
				"selectKeyWord": "기구/HW",
				"category1": 1018,
				"category2": "C000136",
				"currentPageNo": 1
			},
			"xpath": {
				"num": "//*[@id=\"listCmp\"]/em/text()",
				"list": {
					"_repeat": "//*[@id=\"container\"]/div[2]/div[2]/div[4]/ul/li",
					"link": ".//div/p[1]/a/@onclick",
					"title": ".//div/p[1]/a/text()"
				}
			},
			"name": "lglist"
		},
		"output": [
			{
				"if": "context.dialog.item.length != 0",
				"output": "오늘의 이슈입니다.\n#item#+index+. +title+\n#"
			}
		],
		"name": "dialog_test93"
	},
	{
		"id": "test94",
		"filename": "test",
		"input": [
			"lgitem"
		],
		"task": {
			"module": "http",
			"action": "simpleRequest",
			"uri": "https://www.lgservice.co.kr/simple/selectSimpleSearchDetail.do",
			"method": "GET",
			"xpath": {
				"title": "//*[@id=\"container\"]/div[2]/div[1]/div[1]/div[1]/h3/text()",
				"content": "//*[@id=\"container\"]/div[2]/div[1]/div[1]/div[2]/node()"
			},
			"param": {
				"gubun": "SCS",
				"seq": 9419,
				"itemId": "20150138007211",
				"type": "keyword"
			},
			"name": "lgitem"
		},
		"output": [
			{
				"if": "context.dialog.item.length != 0",
				"output": "오늘의 이슈입니다.\n#item#+index+. +title+\n#"
			}
		],
		"name": "dialog_test94"
	},
	{
		"id": "test95",
		"filename": "test",
		"input": [
			"lg"
		],
		"task": {
			"module": "task",
			"action": "sequence",
			"actions": [
				{
					"template": {
						"module": "http",
						"action": "simpleRequest",
						"uri": "https://www.lgservice.co.kr/main.do#none",
						"method": "GET",
						"xpath": {
							"_repeat": "//*[@id=\"container\"]/div[2]/div[1]/div/ul/li",
							"pane": {
								"_repeat": "./ul/li",
								"cate1": "./h3/text()",
								"cate2": {
									"_repeat": "./ul/li",
									"catecode": "./a/@data-catecode",
									"catename": "./a/@data-catename",
									"parentcatename": "./a/@data-parentcatename",
									"parentcatecode": "./a/@data-parentcatecode"
								}
							}
						},
						"name": "lgcate1"
					}
				},
				{
					"module": "task",
					"action": "while",
					"actions": [
						{
							"module": "task",
							"action": "sequence",
							"actions": [
								{
									"template": {
										"module": "http",
										"action": "simpleRequest",
										"uri": "https://www.lgservice.co.kr/main/selectKeyWordList.do",
										"method": "POST",
										"param": {
											"catecode": "C000136",
											"parentcatecode": "1018"
										},
										"name": "lgcate2"
									}
								},
								{
									"module": "mongo",
									"action": "update",
									"mongo": {
										"model": "conceptlist",
										"query": {
											"parent": "",
											"name": ""
										},
										"options": {
											"upsert": true
										}
									}
								},
								{
									"module": "mongo",
									"action": "update",
									"mongo": {
										"model": "conceptlist",
										"query": {
											"parent": "",
											"name": ""
										},
										"options": {
											"upsert": true
										}
									}
								},
								{
									"module": "task",
									"action": "while",
									"actions": [
										{
											"module": "mongo",
											"action": "update",
											"mongo": {
												"model": "conceptlist",
												"query": {
													"parent": "",
													"name": ""
												},
												"options": {
													"upsert": true
												}
											}
										}
									]
								},
								{
									"module": "task",
									"action": "while",
									"actions": [
										{
											"module": "task",
											"action": "sequence",
											"actions": [
												{
													"template": {
														"module": "http",
														"action": "simpleRequest",
														"uri": "https://www.lgservice.co.kr/keywordSearch/simpleEasySearchPage.do",
														"method": "GET",
														"param": {
															"selectKeyWord": "기구/HW",
															"category1": 1018,
															"category2": "C000136",
															"currentPageNo": 1
														},
														"xpath": {
															"num": "//*[@id=\"listCmp\"]/em/text()",
															"list": {
																"_repeat": "//*[@id=\"container\"]/div[2]/div[2]/div[4]/ul/li",
																"link": ".//div/p[1]/a/@onclick",
																"title": ".//div/p[1]/a/text()"
															}
														},
														"name": "lglist"
													}
												},
												{
													"module": "task",
													"action": "while",
													"actions": [
														{
															"module": "task",
															"action": "sequence",
															"actions": [
																{
																	"template": {
																		"module": "http",
																		"action": "simpleRequest",
																		"uri": "https://www.lgservice.co.kr/keywordSearch/simpleEasySearchPage.do",
																		"method": "GET",
																		"param": {
																			"selectKeyWord": "기구/HW",
																			"category1": 1018,
																			"category2": "C000136",
																			"currentPageNo": 1
																		},
																		"xpath": {
																			"num": "//*[@id=\"listCmp\"]/em/text()",
																			"list": {
																				"_repeat": "//*[@id=\"container\"]/div[2]/div[2]/div[4]/ul/li",
																				"link": ".//div/p[1]/a/@onclick",
																				"title": ".//div/p[1]/a/text()"
																			}
																		},
																		"name": "lglist"
																	}
																},
																{
																	"module": "task",
																	"action": "while",
																	"actions": [
																		{
																			"module": "task",
																			"action": "sequence",
																			"actions": [
																				{
																					"template": {
																						"module": "http",
																						"action": "simpleRequest",
																						"uri": "https://www.lgservice.co.kr/simple/selectSimpleSearchDetail.do",
																						"method": "GET",
																						"xpath": {
																							"title": "//*[@id=\"container\"]/div[2]/div[1]/div[1]/div[1]/h3/text()",
																							"content": "//*[@id=\"container\"]/div[2]/div[1]/div[1]/div[2]/node()"
																						},
																						"param": {
																							"gubun": "SCS",
																							"seq": 9419,
																							"itemId": "20150138007211",
																							"type": "keyword"
																						},
																						"name": "lgitem"
																					}
																				},
																				{
																					"module": "mongo",
																					"action": "update",
																					"mongo": {
																						"model": "lgfaqs",
																						"query": {
																							"cate1": "",
																							"cate2": "",
																							"keyword": "",
																							"title": "",
																							"body": "",
																							"conceptId": ""
																						},
																						"options": {
																							"upsert": true
																						}
																					}
																				}
																			]
																		}
																	]
																}
															]
														}
													]
												}
											]
										}
									]
								}
							]
						}
					]
				}
			],
			"name": "lgcrawl"
		},
		"output": [
			{
				"if": "context.dialog.item.length != 0",
				"output": "오늘의 이슈입니다.\n#item#+index+. +title+\n#"
			}
		],
		"name": "dialog_test95"
	}
];

var commonDialogs = [
{
  id: 'testcommon0',
  filename: 'testcommon',
  name: '시작',
  input: {regexp: first},
  output: '안녕하세요 아테나입니다.\n저는 아래와 같은 정보들을 알려드립니다.\n\n예시) 날씨, 뉴스, 가격비교, 음악, 동영상, 검색, 환율, 주가'
},
{
  id: 'testcommon1',
  filename: 'testcommon',
  input: {regexp: up},
  output: {up:1}
},
{
  id: 'testcommon2',
  filename: 'testcommon',
  input: {regexp: pre},
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  id: 'testcommon3',
  filename: 'testcommon',
  input: {regexp: next},
  output: {repeat: 1, options: {page: 'next'}}
}
];


var _bot = require(require('path').resolve("./engine/core/bot")).getBot('athena');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
