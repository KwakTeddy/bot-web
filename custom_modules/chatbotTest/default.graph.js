


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
				"intent": "배 고픔"
			}
		],
		"output": {
			"output": "주문을 할까요?",
			"buttons": [
				{
					"text": "1.피자"
				},
				{
					"text": "2.치킨"
				}
			]
		},
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
				"output": {
					"output": "이 피자를 주문할까요?",
					"image": {
						"url": "/files/chatbotTest1496124258710.JPG",
						"displayname": "IMG_0640.JPG"
					}
				}
			},
			{
				"name": "dialog_default3",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"entities": [
							"치킨@menu"
						]
					},
					{
						"text": "2"
					}
				],
				"output": {
					"output": "이 치킨을 주문할까요?",
					"image": {
						"url": "/files/chatbotTest1496124470249.JPG",
						"displayname": "IMG_0646.JPG"
					}
				}
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
		"output": "chatbotTest 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('chatbotTest');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
