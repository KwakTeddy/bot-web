


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
		"name": "dialog_default1",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "배고프다"
			}
		],
		"output": "1.치킨 2.피자",
		"children": [
			{
				"name": "dialog_default2",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "치킨"
					}
				],
				"output": "치킨입니다"
			},
			{
				"name": "dialog_default3",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"text": "피자"
					}
				],
				"output": "피자입니다"
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
		"output": "yayayam 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('yayayam');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
