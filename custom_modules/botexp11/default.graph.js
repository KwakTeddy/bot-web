


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "안녕"
			}
		],
		"output": [
			{
				"list": [
					{
						"title": "리스트1",
						"content": "내용"
					},
					{
						"title": "리스2",
						"content": "내용2"
					}
				],
				"kind": "List"
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
		"output": "botexp11 입니다."
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
var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('botexp11');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
