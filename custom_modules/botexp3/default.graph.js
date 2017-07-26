


var dialogs = [
	{
		"name": "리턴콜1",
		"id": "default13",
		"filename": "default",
		"input": [
			{
				"text": "1"
			}
		],
		"output": {
			"text": "리턴콜1",
			"kind": "Text"
		},
		"children": [
			{
				"name": "리턴콜2",
				"id": "default14",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": [
					{
						"kind": "Action",
						"return": "1",
						"options": {
							"output": "리턴됨"
						}
					}
				]
			}
		],
		"inRaw": "2",
		"inNLP": "2"
	},
	{
		"name": "리턴콜3",
		"id": "default15",
		"filename": "default",
		"input": [
			{
				"text": "2"
			}
		],
		"output": [
			{
				"kind": "Action",
				"returnCall": "리턴콜1",
				"options": {
					"output": "말?"
				}
			}
		],
		"children": [
			{
				"name": "리턴콜4",
				"id": "default16",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": [
					{
						"kind": "Text"
					}
				]
			}
		]
	},
	{
		"name": "리핏",
		"id": "default17",
		"filename": "default",
		"input": [
			{
				"text": "3"
			}
		],
		"output": [
			{
				"text": "리핏",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "리핏2",
				"id": "default18",
				"filename": "default",
				"input": [
					{
						"text": "3"
					}
				],
				"output": [
					{
						"if": "if (!context.dialog.optionDone)",
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "+option.name+을 선택하세요. +option.list+"
						}
					},
					{
						"text": "아니면 여기",
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
		"output": {
			"text": "botexp3 입니다.dsafdsfasdfadsfasdfadsf\nasdf",
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('botexp3');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
