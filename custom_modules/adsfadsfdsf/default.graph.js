


var dialogs = [
	{
		"name": "test",
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"text": "똥똥"
			},
			{
				"text": "빵빵"
			}
		],
		"output": [
			{
				"text": "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "dddddddddd",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"text": "ddddd"
					}
				],
				"output": [
					{
						"text": "ddddddd",
						"kind": "Text"
					}
				]
			},
			{
				"name": "dddddddddd",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"text": "ddddd"
					}
				],
				"output": [
					{
						"text": "ddddddd",
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
		"output": "adsfadsfdsf 입니다."
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('adsfadsfdsf');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
