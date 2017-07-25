


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
		"name": "입력",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "입력"
			}
		],
		"output": [
			{
				"text": "입력",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "dialog_default5",
				"id": "default5",
				"filename": "default",
				"input": [
					{
						"intent": "테스트인텐트"
					}
				],
				"output": [
					{
						"text": "인텐트 매칭!",
						"kind": "Text"
					}
				]
			},
			{
				"name": "dialog_default6",
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"types": [
							"phone"
						]
					}
				],
				"output": [
					{
						"text": "ㅁㄴㅇㄹ",
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
				"types": [
					"mobile"
				]
			}
		],
		"output": [
			{
				"text": "안녕하세요",
				"kind": "Text"
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
	},
	{
		"id": "defaultcommon2",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('edu3');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
