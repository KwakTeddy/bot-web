


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
				"text": "번호 입력해라",
				"kind": "Text"
			}
		],
		"name": "dialog_default0",
		"children": [
			{
				"name": "문자발송",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"types": [
							"mobile"
						]
					}
				],
				"output": [
					{
						"text": "보냈다. 번호 입력해라",
						"kind": "Text"
					}
				],
				"task": "sms",
				"children": [
					{
						"name": "",
						"id": "default3",
						"filename": "default",
						"input": [
							{
								"regexp": "(.*)"
							}
						],
						"output": [
							{
								"if": "dialog.inRaw == dialog.context.smsAuth",
								"text": "맞았어",
								"kind": "Text",
								"id": "default3_0"
							},
							{
								"if": "true",
								"text": "틀렸어",
								"kind": "Text",
								"id": "default3_1"
							}
						]
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
		"output": "botexp2 바꾼당ㄴㄹ"
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('botexp2');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
