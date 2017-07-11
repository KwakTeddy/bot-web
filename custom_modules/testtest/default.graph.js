


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "배고픔"
			}
		],
		"output": "배고프세요 1, 치킨 2, 피자",
		"name": "음식카테고리",
		"children": [
			{
				"name": "치킨",
				"id": "default1",
				"filename": "default",
				"input": [
					{
						"text": "1"
					},
					{
						"text": "치킨"
					}
				],
				"output": {
					"output": "치킨을주문해드리겠습니다.",
					"image": {
						"url": "/files/testtest1498453647934.png",
						"displayname": "Capture001.png"
					}
				}
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
					}
				],
				"output": {
					"output": "피자를주문해드리겠습니다.",
					"image": {
						"url": "/files/testtest1498453730237.png",
						"displayname": "스크린샷 2017-04-17 15.58.57.png"
					}
				}
			},
			{
				"name": "미선택",
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"if": " true"
					}
				],
				"output": {
					"repeat": "1",
					"options": {
						"output": "치킨이나 피자중에 선택해"
					}
				}
			}
		]
	},
	{
		"name": "치킨2",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"entities": [
					"치킨@음식"
				],
				"intent": "식욕"
			}
		],
		"output": {
			"call": "치킨"
		},
		"task": "defaultTask"
	},
	{
		"name": "피자2",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"text": "피자"
			}
		],
		"output": {
			"call": "피자"
		}
	},
	{
		"name": "버튼",
		"id": "default7",
		"filename": "default",
		"input": [
			{
				"text": "버튼"
			}
		],
		"output": {
			"buttons": [
				{
					"text": "배고파"
				},
				{
					"text": "유알엘",
					"url": "www.moneybrain.먀"
				}
			]
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
		"output": "testtest 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('testtest');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
