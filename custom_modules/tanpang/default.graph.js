


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "배고픔"
			}
		],
		"output": "주문하시겠어요? 1.치킨2.피자",
		"name": "음식 카테고리",
		"children": [
			{
				"name": "치킨",
				"id": "default1",
				"filename": "default",
				"input": [
					{
						"entities": [
							"치킨@음식"
						]
					},
					{
						"text": "1"
					}
				],
				"output": {
					"output": "치킨입니다",
					"image": {
						"url": "/files/tanpang1498453659429.jpg",
						"displayname": "shutterstock_144845914.jpg"
					}
				}
			},
			{
				"name": "피자",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "피자"
					},
					{
						"text": "2"
					}
				],
				"output": {
					"output": "피자입니다",
					"image": {
						"url": "/files/tanpang1498453741231.jpg",
						"displayname": "shutterstock_144845914.jpg"
					}
				}
			},
			{
				"name": "족발",
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"text": "족발"
					}
				],
				"output": {
					"call": "시작"
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
					"call": "음식 카테고리"
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
		"name": "dialog_default7",
		"id": "default7",
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
					"url": "www.naver.com"
				}
			]
		}
	},
	{
		"name": "dialog_default8",
		"id": "default8",
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
		"output": "tanpang 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('tanpang');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);