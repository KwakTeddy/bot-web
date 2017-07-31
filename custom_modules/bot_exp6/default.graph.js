


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "1"
			}
		],
		"output": [
			{
				"text": "#option#+content+#",
				"kind": "Text"
			}
		],
		"name": "dialog_default0",
		"task": {
			"name": "optionStart"
		},
		"children": [
			{
				"name": "",
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
						"if": "!context.dialog.done",
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "+optionStr+\n\n#option#+content+#"
						}
					},
					{
						"text": "asdf",
						"kind": "Text"
					},
					{
						"text": "ㅗㅎ롤호",
						"kind": "Text"
					}
				],
				"task": {
					"name": "testTask"
				}
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
		"output": "bot_exp6 입니다."
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('bot_exp6');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
