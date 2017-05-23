


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
		"name": "욕",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "바보"
			}
		],
		"output": "너도ㅋ"
	},
	{
		"name": "이미지텍스트",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "양념 치킨"
			}
		],
		"output": {
			"output": "양념치킨은 15000원입니다",
			"image": {
				"url": "/files/img_sauce_big01.jpg"
			}
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
		"output": "junhabot 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('junhabot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
