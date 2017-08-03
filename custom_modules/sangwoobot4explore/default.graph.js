


var dialogs = [
	{
		"name": "인텐트 분석",
		"id": "default16",
		"filename": "default",
		"input": [
			{
				"intent": "와우"
			}
		],
		"output": [
			{
				"text": "성공ddddddd",
				"kind": "Text"
			}
		]
	},
	{
		"name": "dialog_default17",
		"id": "default17",
		"filename": "default",
		"input": [],
		"output": []
	},
	{
		"name": "dialog_default18",
		"id": "default18",
		"filename": "default",
		"input": [
			{}
		],
		"output": [
			{
				"text": "dddd",
				"kind": "Text"
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
		"output": {
			"text": "입력하시오",
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('sangwoobot4explore');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
