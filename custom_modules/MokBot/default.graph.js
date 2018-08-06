


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
		"output": "배가 고프신가요? 주문을 해드리겠습니다. 1.치킨 2.피자",
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
					"output": "치킨입니다. 이걸로 주문을 도와 드릴까요?",
					"image": {
						"url": "/files/MokBot1495778918793.jpg",
						"displayname": "치킨.jpg"
					}
				},
				"children": [
					{
						"name": "dialog_default7",
						"id": "default7",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {}
					},
					{
						"name": "dialog_default8",
						"id": "default8",
						"filename": "default",
						"input": [
							{
								"text": "아니다"
							}
						],
						"output": {}
					},
					{
						"name": "dialog_default9",
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
					},
					{
						"text": "2"
					}
				],
				"output": {
					"output": "피자입니다",
					"image": {
						"url": "/files/MokBot1495779102538.jpg",
						"displayname": "피자.jpg"
					}
				}
			}
		]
	},
	{
		"name": "주문",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"entities": [
					"@메뉴"
				],
				"text": "주문"
			}
		],
		"output": "주문을 시작하겠습니다"
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
		"output": "배달봇입니다"
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [],
		"output": {
			"call": "시작"
		}
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('MokBot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
