


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"types": [
					"testType"
				]
			}
		],
		"output": [
			{
				"text": "#cd# +title+\n#",
				"kind": "Text"
			}
		],
		"name": "dialog_default0",
		"children": [
			{
				"name": "리스트타입",
				"id": "default1",
				"filename": "default",
				"input": [
					{
						"types": [
							"listType"
						]
					}
				],
				"output": [
					{
						"text": "+listType.content+",
						"kind": "Text"
					}
				]
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
		"output": "bot_edu12 입니다."
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('bot_edu12');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
