


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
		"output": "배가 고프신가요? 1번. 치킨 2번. 피자",
		"inRaw": "도미노피자",
		"inNLP": "도미노피자",
		"children": [
			{
				"name": "치킨",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "치킨",
						"entities": [
							"@메뉴"
						]
					}
				],
				"output": {
					"output": "치킨입니다",
					"image": {
						"url": "/files/smileBot1495778997800.jpg",
						"displayname": "유명산.jpg"
					}
				},
				"children": [
					{
						"name": "dialog_default6",
						"id": "default6",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {
							"call": "dialog_default5"
						}
					},
					{
						"name": "dialog_default10",
						"id": "default10",
						"filename": "default",
						"input": [],
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
						"text": "피자",
						"entities": [
							"@메뉴"
						]
					}
				],
				"output": "피자",
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
						"output": {
							"call": "dialog_default5"
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
		"name": "dialog_default9",
		"id": "default9",
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
		"output": "배달 봇입니다"
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('smileBot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
