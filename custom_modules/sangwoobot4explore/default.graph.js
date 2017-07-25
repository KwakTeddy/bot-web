


var dialogs = [
	{
		"name": "ㄹㄹㄹ",
		"id": "default3",
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
				"text": "ffffffffffff",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "",
				"id": "default8",
				"filename": "default",
				"input": [],
				"output": []
			},
			{
				"name": "",
				"id": "default9",
				"filename": "default",
				"input": [],
				"output": []
			},
			{
				"name": "",
				"id": "default6",
				"filename": "default",
				"input": [],
				"output": [],
				"children": [
					{
						"name": "",
						"id": "default7",
						"filename": "default",
						"input": [],
						"output": []
					}
				]
			}
		]
	},
	{
		"name": "",
		"id": "default5",
		"filename": "default",
		"input": [],
		"output": []
	},
	{
		"name": "",
		"id": "default4",
		"filename": "default",
		"input": [],
		"output": [],
		"children": [
			{
				"name": "",
				"id": "default11",
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
		"output": {
			"text": "fff.",
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
