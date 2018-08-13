


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
		"name": "음식 카테고리",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"intent": "배가 고픔"
			}
		],
		"output": "배가 고프신가요? 주문을 해드리겠습니다. 1.치킨 2.피자",
		"children": [
			{
				"name": "치킨",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "1"
					},
					{
						"entities": [
							"치킨@메뉴"
						]
					}
				],
				"output": "치킨입니다"
			},
			{
				"name": "피자",
				"id": "default5",
				"filename": "default",
				"input": [
					{
						"entities": [
							"피자@메뉴"
						]
					},
					{
						"text": "2"
					}
				],
				"output": "피자입니다 이걸로 주문ㄱ?",
				"children": [
					{
						"name": "dialog_default10",
						"id": "default10",
						"filename": "default",
						"input": [],
						"output": {
							"call": "주문"
						}
					}
				]
			},
			{
				"name": "dialog_default6",
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {}
			}
		]
	},
	{
		"name": "주문",
		"id": "default8",
		"filename": "default",
		"input": [
			{
				"text": "주문",
				"entities": [
					"@메뉴"
				]
			}
		],
		"output": "주문하시겠습니까"
	},
	{
		"name": "dialog_default9",
		"id": "default9",
		"filename": "default",
		"input": [
			{
				"text": "주문"
			}
		],
		"output": {
			"call": "음식 카테고리"
		}
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
		"output": "배달봇입니다"
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('jhjun');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
