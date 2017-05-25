


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
				"text": "배고프다"
			}
		],
		"output": "배가 고프신가요? 제가 주문을 해드리겠습니다. 다음 중 어떤 것을 먹고 싶으신가요? 1.치킨 2.피자",
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
						"text": "1"
					}
				],
				"output": {
					"output": "치킨입니다",
					"image": {
						"url": "/files/치킨.jpg"
					}
				}
			},
			{
				"name": "피자",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"text": "피자"
					}
				],
				"output": {}
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
		"output": "chicken141315 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('chicken141315');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
