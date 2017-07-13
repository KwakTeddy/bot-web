


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "안녕"
			}
		],
		"output": "안녕하세요",
		"name": "dialog_default0"
	},
	{
		"name": "주문시작",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "주문"
			}
		],
		"output": {
			"text": "주문을 시작합니다.\n치킨을 원하세요? 피자를 원하세요?",
			"image": {
				"url": "/files/orderbot1499755827345.png",
				"displayname": "btn_feature_03.png"
			},
			"kind": "Content"
		},
		"children": [
			{
				"name": "치킨",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "치킨"
					}
				],
				"output": {
					"text": "치킨을 선택해주셨네요!\n어느 브랜드의  치킨을 원하세요?",
					"kind": "Text"
				},
				"children": [
					{
						"name": "교촌",
						"id": "default5",
						"filename": "default",
						"input": [
							{
								"regexp": "(*.)"
							}
						],
						"output": {
							"text": "1,뿌링클 \n2, 바삭치킨",
							"kind": "Text"
						},
						"children": [
							{
								"name": "뿌링클",
								"id": "default19",
								"filename": "default",
								"input": [
									{
										"text": "1"
									},
									{
										"text": "뿌 링클"
									},
									{
										"text": "뿌 링클 치킨"
									}
								],
								"output": {
									"text": "",
									"image": {
										"url": "/files/orderbot1499757038256.png",
										"displayname": "ref_img_3.png"
									},
									"buttons": [
										{
											"text": "주문하기"
										}
									],
									"kind": "Content"
								},
								"children": [
									{
										"name": "dialog_default23",
										"id": "default23",
										"filename": "default",
										"input": [
											{
												"text": "주문"
											}
										],
										"output": {
											"kind": "Action",
											"call": "주문"
										}
									}
								]
							},
							{
								"name": "바삭치킨",
								"id": "default20",
								"filename": "default",
								"input": [
									{
										"text": "바삭 치킨"
									},
									{
										"text": "2"
									}
								],
								"output": {
									"image": {
										"url": "/files/orderbot1499757104578.png",
										"displayname": "ref_img_2.png"
									},
									"buttons": [
										{
											"text": "주문하기"
										}
									],
									"kind": "Content"
								},
								"children": [
									{
										"name": "메뉴선택확정",
										"id": "default22",
										"filename": "default",
										"input": [
											{
												"text": "주문 하다"
											}
										],
										"output": {
											"kind": "Action",
											"call": "주문"
										}
									}
								]
							}
						]
					},
					{
						"name": "BBQ",
						"id": "default6",
						"filename": "default",
						"input": [
							{
								"text": "비비큐"
							},
							{
								"text": "BBQ"
							}
						],
						"output": {
							"text": "다음은 비비큐의 메뉴입니다",
							"kind": "Text"
						}
					},
					{
						"name": "재질의(Repeat)",
						"id": "default7",
						"filename": "default",
						"input": [
							{
								"if": " true"
							}
						],
						"output": {
							"kind": "Action",
							"type": "Call"
						}
					}
				]
			},
			{
				"name": "피자",
				"id": "default3",
				"filename": "default",
				"input": [],
				"output": {
					"text": "피자를 선택해주셨네요!\n어떤 브랜드의 피자를 원하세요?",
					"kind": "Text"
				}
			},
			{
				"name": "R",
				"id": "default8",
				"filename": "default",
				"input": [
					{
						"if": " true"
					}
				],
				"output": {
					"kind": "Action"
				}
			}
		]
	},
	{
		"name": "주문",
		"id": "default11",
		"filename": "default",
		"input": [
			{
				"text": "바로 주문"
			}
		],
		"output": {
			"text": "주소를 입력해주세요",
			"kind": "Text"
		},
		"children": [
			{
				"name": "주소입력",
				"id": "default12",
				"filename": "default",
				"input": [
					{
						"if": " true"
					}
				],
				"output": {
					"text": "주소를 입력받았습니다.\n결제방식을 선택해주세요",
					"kind": "Text"
				},
				"children": [
					{
						"name": "dialog_default13",
						"id": "default13",
						"filename": "default",
						"input": [
							{
								"if": " true"
							}
						],
						"output": {
							"text": "결제 방식을 선택받았습니다.\n주문하시겠습니까?\n처음으로 돌아가시려면 시작이라고 말씀해주세요",
							"kind": "Text"
						},
						"children": [
							{
								"name": "dialog_default14",
								"id": "default14",
								"filename": "default",
								"input": [
									{
										"text": "예"
									}
								],
								"output": {
									"text": "주문이 완료되었습니다",
									"kind": "Text"
								}
							},
							{
								"name": "dialog_default15",
								"id": "default15",
								"filename": "default",
								"input": [
									{
										"text": "아니다"
									}
								],
								"output": {
									"text": "이전 단계로 돌아갈까요?",
									"kind": "Text"
								},
								"children": [
									{
										"name": "dialog_default16",
										"id": "default16",
										"filename": "default",
										"input": [
											{
												"text": "예"
											}
										],
										"output": {
											"kind": "Action"
										}
									},
									{
										"name": "dialog_default17",
										"id": "default17",
										"filename": "default",
										"input": [
											{
												"text": "아니다"
											}
										],
										"output": {
											"kind": "Action"
										}
									}
								]
							},
							{
								"name": "R",
								"id": "default18",
								"filename": "default",
								"input": [
									{
										"if": " true"
									}
								],
								"output": {
									"kind": "Action"
								}
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
		"id": "defaultcommon0",
		"filename": "defaultcommon",
		"name": "시작",
		"input": [
			{
				"text": "시작"
			}
		],
		"output": "orderbot 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [
			{
				"text": ""
			}
		],
		"output": "알아듣지 못했습니다"
	},
	{
		"name": "이전",
		"id": "commondefault9",
		"filename": "defaultcommon",
		"input": [
			{
				"text": "이전"
			}
		],
		"output": {
			"kind": "Action",
			"up": "1",
			"type": "Up"
		}
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('orderbot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
