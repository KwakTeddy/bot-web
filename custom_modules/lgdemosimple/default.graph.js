


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
				"intent": "약냉"
			}
		],
		"output": "냉장고 냉기가 약할 때 안내 입니다."
	},
	{
		"name": "dialog_default2",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"intent": "강냉"
			}
		],
		"output": "강냉인 경우의 메세지 입니다."
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
		"output": "lgdemosimple 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('lgdemosimple');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
