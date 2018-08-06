


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "배고픔"
			}
		],
		"output": "배가 고프신가요? 뭐 드실래요? 1. 치킨, 2. 피자",
		"name": "음식 카테고리",
		"children": [
			{
				"name": "치킨",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"entities": [
							"치킨@메뉴"
						]
					},
					{
						"text": "1"
					}
				],
				"output": {
					"output": "치킨입니다",
					"image": {
						"url": "/files/hyungmin1495779226533.jpg",
						"displayname": "강릉 초당두부.jpg"
					}
				},
				"children": [
					{
						"name": "이전 단계로",
						"id": "default8",
						"filename": "default",
						"input": [
							{
								"text": "이전"
							}
						],
						"output": {
							"up": "1"
						}
					}
				]
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
				"output": {
					"output": "피자입니다",
					"image": {
						"url": "/files/hyungmin1495779337388.png",
						"displayname": "부산 돼지국밥.png"
					}
				}
			}
		]
	},
	{
		"name": "주문..",
		"id": "default7",
		"filename": "default",
		"input": [
			{
				"text": "주문"
			}
		],
		"output": {
			"call": "음식 카테고리"
		}
	},
	{
		"name": "주문",
		"id": "default6",
		"filename": "default",
		"input": [
			{
				"entities": [
					"@메뉴"
				],
				"text": "주문"
			}
		],
		"output": "주문을 시작하겠습니까?"
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('hyungmin');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
