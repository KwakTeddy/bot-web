


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "5"
			},
			{
				"text": "치킨"
			}
		],
		"output": {
			"text": "치킨을 원하시는군요\n시켜드릴께요\n\n위치를 알려주세요\n1.서울\n2.부산",
			"kind": "Text"
		},
		"name": "1.치킨",
		"children": [
			{
				"name": "dialog_default2",
				"id": "default2",
				"filename": "default",
				"input": [],
				"output": []
			},
			{
				"name": "dialog_default3",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"entities": [
							"@도시"
						]
					}
				],
				"output": {
					"text": "서울이군요",
					"kind": "Text"
				}
			}
		]
	},
	{
		"name": "dialog_default1",
		"id": "default1",
		"filename": "default",
		"input": [],
		"output": []
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
			"text": "배달봇입니다.\n무엇을 시켜드릴까요\n1. 치킨\n2.. 피자",
			"kind": "Text"
		}
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [
			{
				"text": ""
			}
		],
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('TEST');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
