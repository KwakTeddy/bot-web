


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "강냉"
			}
		],
		"output": "냉장고 강냉인 경우의 증상 입니다.",
		"name": "냉장고.강냉1",
		"context": {
			"name": "강냉"
		}
	},
	{
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"intent": "약냉"
			}
		],
		"output": [
			{
				"output": "냉장고 약냉인 경우의 증상 입니다."
			}
		],
		"name": "냉장고.약냉",
		"context": {
			"name": "약냉"
		}
	},
	{
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"intent": "무냉"
			}
		],
		"output": "냉장고 무냉인 경우의 증상 입니다.",
		"name": "냉장고.무냉",
		"context": {
			"name": "무냉"
		}
	},
	{
		"id": "default7",
		"filename": "default",
		"input": [
			{
				"intent": "강냉"
			}
		],
		"output": [
			{
				"output": "에어컨 강냉인 경우의 증상 입니다."
			}
		],
		"name": "에어컨.강냉",
		"context": {
			"name": "강냉"
		}
	},
	{
		"id": "default8",
		"filename": "default",
		"input": [
			{
				"intent": "약냉"
			}
		],
		"output": [
			{
				"output": "에어컨 약냉인 경우의 증상 입니다."
			}
		],
		"name": "에어컨.약냉",
		"context": {
			"name": "약냉"
		}
	},
	{
		"id": "default9",
		"filename": "default",
		"input": [
			{
				"intent": "무냉"
			}
		],
		"output": [
			{
				"output": "에어컨 무냉인 경우의 증상 입니다."
			}
		],
		"name": "에어컨.무냉",
		"context": {
			"name": "무냉"
		}
	},
	{
		"name": "dialog_default10",
		"id": "default10",
		"filename": "default",
		"input": [
			{
				"intent": "부정"
			}
		],
		"output": "긍정 입니다.",
		"context": null,
		"task": {
			"url": "www.google.com",
			"template": "httpRequest"
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
		"output": "test4 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("./engine/core/bot")).getBot('test4');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
