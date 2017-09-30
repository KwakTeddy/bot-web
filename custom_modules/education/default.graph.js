


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "배고픔"
			}
		],
		"output": "배가 고프신가요? 제가 주문을 해드리겠습니다. 다음 중 어떤 것을 먹고 싶으신가요? 1.치킨 2.피자",
		"name": "음식 카테고리",
		"children": [
			{
				"name": "치킨",
				"id": "default1",
				"filename": "default",
				"input": [
					{
						"text": "1"
					},
					{
						"text": "치킨"
					}
				],
				"output": {
					"output": "치킨입니다",
					"image": {
						"url": "/files/education1498453537934.jpg",
						"displayname": "card04.jpg"
					}
				}
			},
			{
				"name": "피자",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "2"
					},
					{
						"text": "피자"
					}
				],
				"output": {
					"output": "피자입니다",
					"image": {
						"url": "/files/education1498453732955.jpg",
						"displayname": "card04.jpg"
					}
				}
			},
			{
				"name": "미선택",
				"id": "default5",
				"filename": "default",
				"input": [
					{
						"if": " true"
					}
				],
				"output": {
					"repeat": "1",
					"options": {
						"output": "치킨이나 피자중에 선택해주세요"
					}
				}
			}
		]
	},
	{
		"name": "치킨2",
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"entities": [
					"치킨@음식"
				],
				"intent": "식욕"
			}
		],
		"output": {
			"call": "치킨"
		}
	},
	{
		"name": "피자2",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "피자"
			}
		],
		"output": {
			"call": "피자"
		}
	},
	{
		"name": "dialog_default6",
		"id": "default6",
		"filename": "default",
		"input": [
			{
				"text": "버튼"
			}
		],
		"output": {
			"buttons": [
				{
					"text": "배고파"
				},
				{
					"text": "주문하기",
					"url": "www.moneybrain.ai"
				}
			]
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
		"output": "education 입니다."
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
	},
	{
		"name": "피자3",
		"id": "commondefault6",
		"filename": "defaultcommon",
		"input": [
			{
				"text": "피자"
			}
		],
		"output": "공통피자입니다"
	}
];
var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('education');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
