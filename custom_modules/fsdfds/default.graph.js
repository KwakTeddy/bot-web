


var dialogs = [
	{
		"name": "dialog_default2",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"entities": [
					"@과일"
				]
			}
		],
		"output": [
			{
				"text": "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
				"kind": "Text"
			}
		]
	},
	{
		"name": "dialog_default2",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"intent": "머리"
			}
		],
		"output": [
			{
				"text": "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
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
		"output": "fsdfds 입니다."
	},
	{
		"id": "defaultcommon2",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [
			{
				"text": ""
			}
		],
		"output": "알아듣지 못했습니다",
		"children": [
			{
				"name": "ㅇㅇㅇㅇㅇㅇㅇㅇㅇ",
				"id": "commondefault3",
				"filename": "defaultcommon",
				"input": [
					{
						"text": "ㅇㅇ"
					}
				],
				"output": [
					{
						"if": "ㅇㅇㅇ",
						"text": "ㅇㅇㅇㅇㅇㅇ",
						"kind": "Text",
						"id": "commondefault3_0"
					}
				]
			}
		]
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
	}
];
var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('fsdfds');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
