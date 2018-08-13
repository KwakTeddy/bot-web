


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
		"name": "dialog_default1",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"intent": "배고픔"
			}
		],
		"output": [
			"배고프시군요",
			{
				"buttons": [
					{
						"text": "1. 피자"
					}
				]
			},
			{
				"buttons": [
					{
						"text": "2. 소주"
					}
				]
			}
		],
		"children": [
			{
				"name": "dialog_default2",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"entities": [
							"피자@menu"
						]
					},
					{
						"text": "1"
					}
				],
				"output": "피자를 주문할까요"
			},
			{
				"name": "dialog_default3",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"entities": [
							"소주@menu"
						]
					},
					{
						"text": "2"
					}
				],
				"output": "소주를 주문함????????"
			},
			{
				"name": "dialog_default4",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				}
			},
			{
				"name": "dialog_default5",
				"id": "default5",
				"filename": "default",
				"input": [],
				"output": []
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
		"output": "안녕하세요 반갑슴 ㅋㅋㅋㅋ"
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('tomars_player');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
