


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
		"name": "dialog_default0",
		"children": [
			{
				"name": "dialog_default9",
				"id": "default9",
				"filename": "default",
				"input": [],
				"output": []
			}
		]
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
		"output": "배가 고파? 주문해줄까? 말해봐! 1. 치킨 2. 피자 3. 짜장 4. 버거",
		"children": [
			{
				"name": "치킨",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "1"
					},
					{
						"text": "치킨"
					},
					{
						"entities": [
							"치킨@메뉴"
						]
					}
				],
				"output": {
					"output": "그래 치킨먹자! 주문할래?",
					"image": {
						"url": "/files/DLVR_BOT1495778878083.jpg",
						"displayname": "다운로드 (4).jpg"
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
							"call": "주문"
						}
					},
					{
						"name": "dialog_default8",
						"id": "default8",
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
						"text": "2"
					},
					{
						"text": "피자"
					},
					{
						"entities": [
							"피자@메뉴"
						]
					}
				],
				"output": {
					"output": "피자 먹자!",
					"image": {
						"url": "/files/DLVR_BOT1495779091433.jpg",
						"displayname": "다운로드 (5).jpg"
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
						"output": {
							"call": "주문"
						}
					}
				]
			}
		]
	},
	{
		"name": "주문",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "주문",
				"entities": [
					"@메뉴"
				]
			}
		],
		"output": "주문할게~~~"
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
		"output": "안녕! 난 배달봇!"
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [],
		"output": [
			{
				"call": "시작"
			},
			{}
		]
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('DLVR_BOT');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
