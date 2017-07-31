


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "안녕"
			}
		],
		"output": [
			{
				"kind": "Action",
				"repeat": "1",
				"options": {
					"output": "#option#+content+#"
				},
				"type": "Repeat"
			}
		],
		"name": "dialog_default0",
		"task": "testTask"
	},
	{
		"name": "실험1",
		"id": "default1",
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
		"task": {
			"name": "optionStart"
		},
		"children": [
			{
				"name": "실험2",
				"id": "default2",
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
						"if": "context.dialog.done",
						"text": "+optionStr+\n\n완료.",
						"kind": "Text",
						"id": "default2_0"
					},
					{
						"kind": "Action",
						"options": {
							"output": "+optionStr+\n\n#option#+content+#"
						},
						"repeat": "1",
						"id": "default2_1",
						"type": "Repeat"
					}
				],
				"task": "testTask"
			}
		]
	}
];

var commonDialogs = [
	{
		"id": "defaultcommon0",
		"filename": "defaultcommon",
		"name": "시작",
		"input": [],
		"output": {
			"text": "시작입니다.",
			"kind": "Text"
		},
		"inRaw": "안녕",
		"inNLP": "안녕"
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('bot_exp5');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
