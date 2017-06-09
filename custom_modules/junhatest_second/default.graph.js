


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
		"name": "강",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"intent": "강냉"
			}
		],
		"output": "냉장고의 종류를 말씀해주세요"
	},
	{
		"name": "약냉",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"intent": "약냉"
			}
		],
		"output": "냉장고의 종류를 말씀해주세요"
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
		"output": "junhatest_second 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('junhatest_second');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
