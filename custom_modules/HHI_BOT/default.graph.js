


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
		"output": "배가 고프신가요? 주문을 해드리겠습니다. 1.치킨, 2. 피자",
		"children": [
			{
				"name": "치킨",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "치킨"
					},
					{
						"text": "닭"
					},
					{
						"text": "1"
					},
					{
						"entities": [
							"치킨@매뉴"
						]
					}
				],
				"output": {
					"output": "치킨으로 주문을 도와드릴까요?",
					"image": {
						"url": "/files/HHI_BOT1495778975422.jpg",
						"displayname": "etosha_national_park_namibia-wallpaper-1680x1050.jpg"
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
							"call": "dialog_default5"
						}
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
						"text": "피자"
					},
					{
						"text": "2"
					},
					{
						"text": "pizza"
					},
					{
						"entities": [
							"피자@매뉴"
						]
					}
				],
				"output": {
					"output": "피자로 주문을 도와드릴까요?",
					"image": {
						"url": "/files/HHI_BOT1495779028395.jpg",
						"displayname": "ponte_sant_angelo_castel_sant_angelo_rome_italy-wallpaper-1680x1050.jpg"
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
						"output": {
							"call": "dialog_default5"
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
					"@매뉴"
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
		"output": "배달봇입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [],
		"output": "학습하지 않은 문장입니다. 고객센터로 연결을 원하십니까?"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('HHI_BOT');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
