


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
		"name": "음식 카테고리",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"intent": "배가고픔"
			}
		],
		"output": "배가 고프신가요? 주문을 해드리겠습니다. 1.치킨 2.피자",
		"inRaw": "주문",
		"inNLP": "주문",
		"children": [
			{
				"name": "치킨",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"entities": [
							"치킨@메뉴"
						]
					},
					{
						"text": "1"
					}
				],
				"output": {
					"output": "치킨입니다. 주문하시겠습니까?",
					"image": {
						"url": "/files/lyd_test_bot1495778920143.jpg",
						"displayname": "산.jpg"
					}
				},
				"children": [
					{
						"name": "dialog_default8",
						"id": "default8",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {}
					},
					{
						"name": "dialog_default11",
						"id": "default11",
						"filename": "default",
						"input": [
							{
								"text": "이전"
							}
						],
						"output": {
							"up": "1"
						}
					}
				]
			},
			{
				"name": "피자",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"entities": [
							"피자@메뉴"
						]
					},
					{
						"text": "2"
					}
				],
				"output": {
					"output": "피자입니다. 주문하시겠습니까?",
					"image": {
						"url": "/files/lyd_test_bot1495779126136.jpg",
						"displayname": "바다.jpg"
					}
				},
				"children": [
					{
						"name": "dialog_default9",
						"id": "default9",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {}
					},
					{
						"name": "dialog_default12",
						"id": "default12",
						"filename": "default",
						"input": [
							{
								"text": "이전"
							}
						],
						"output": {
							"up": "1"
						}
					}
				]
			},
			{
				"name": "dialog_default4",
				"id": "default4",
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
		"name": "dialog_default5",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"text": "주문",
				"entities": [
					"@메뉴"
				]
			}
		],
		"output": "주문을 시작하겠습니다."
	},
	{
		"name": "dialog_default6",
		"id": "default6",
		"filename": "default",
		"input": [
			{
				"text": "주문"
			}
		],
		"output": {}
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
		"output": "lyd_test_bot 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [],
		"output": "죄송합니다. 키워드 인식을 할 수 없습니다. 다른 키워드를 이용해 주시기 부탁드립니다."
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('lyd_test_bot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
