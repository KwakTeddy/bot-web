


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "안녕"
			}
		],
		"output": "안녕하세요..",
		"name": "안녕"
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
		"output": "배가 고프신가요? 주문을 해드리겠습니다. 1치킨 2.피자",
		"children": [
			{
				"name": "치킨",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"output": "치킨입니다. 이걸로 주문을 도와드릴까요",
					"image": {
						"url": "/files/chat1495778944147.jpg",
						"displayname": "guitar.jpg"
					}
				},
				"children": [
					{
						"name": "네_치킨",
						"id": "default7",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {
							"call": "주문 시작"
						}
					},
					{
						"name": "Up",
						"id": "default9",
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
					}
				],
				"output": {
					"output": "피자입니다. 이걸로 주문을 도와드릴까요?",
					"image": {
						"url": "/files/chat1495779040801.jpg",
						"displayname": "다운로드 (2).jpg"
					}
				},
				"children": [
					{
						"name": "네_피자",
						"id": "default8",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {
							"call": "주문 시작"
						}
					}
				]
			},
			{
				"name": "repeat",
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
		"name": "주문 시작",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"intent": "배가고픔",
				"entities": [
					"@메뉴"
				]
			}
		],
		"output": "주문을 시작하겠습니다."
	},
	{
		"name": "dialog_default5",
		"id": "default5",
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
		"output": "Chat 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [],
		"output": "죄송합니다. 이해가 어렵습니다. 고객센터로 연결해 드릴까요?"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('chat');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
