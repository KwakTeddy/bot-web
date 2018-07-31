


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
				"intent": "배가 고픔"
			}
		],
		"output": "배가 고프신가요? 주문을 해드리겠습니다. 1. 치킨, 2. 피자",
		"children": [
			{
				"name": "치킨",
				"id": "default4",
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
					"output": "치킨입니다. 이걸로주문할까요?",
					"image": {
						"url": "/files/tjtngh1496116834015.jpg",
						"displayname": "Desert.jpg"
					},
					"buttons": [
						{
							"text": "굽네치킨",
							"url": "http://www.goobne.co.kr/menu/menu_list.jsp"
						}
					]
				},
				"children": [
					{
						"name": "dialog_default10",
						"id": "default10",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {
							"call": "dialog_default7"
						}
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
				"id": "default5",
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
					"output": "피자입니다 이걸로주문할까요?",
					"image": {
						"url": "/files/tjtngh1495780686621.jpg",
						"displayname": "style1.jpg"
					},
					"buttons": [
						{
							"text": "피자에땅",
							"url": "https://www.pizzaetang.com/main.asp"
						}
					]
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
						"output": {
							"call": "dialog_default7"
						}
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
				"name": "dialog_default6",
				"id": "default6",
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
		"name": "dialog_default7",
		"id": "default7",
		"filename": "default",
		"input": [
			{
				"text": "주문",
				"entities": [
					"@메뉴"
				]
			}
		],
		"output": "주문을 시작하겠습니다.",
		"inRaw": "네",
		"inNLP": "네"
	},
	{
		"name": "dialog_default8",
		"id": "default8",
		"filename": "default",
		"input": [
			{
				"text": "주문"
			}
		],
		"output": {
			"call": "음식 카테고리"
		}
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
		"output": "배달봇입니다"
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [],
		"output": "죄송합니다. 학습하지 못한 내용입니다."
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('tjtngh');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
