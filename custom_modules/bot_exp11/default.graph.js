


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"regexp": "(.*)"
			}
		],
		"output": [
			{
				"text": "+context.dialog.1+",
				"kind": "Text"
			}
		],
		"name": "dialog_default0"
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
		"output": {
			"text": "bot_exp11 입니다.asdfasdf.adfgadf\nfg",
			"kind": "Text"
		}
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "상위",
		"input": [
			{
				"text": "상위"
			},
			{
				"text": "이전"
			}
		],
		"output": {
			"up": 1
		}
	},
	{
		"id": "defaultcommon2",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('bot_exp11');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
