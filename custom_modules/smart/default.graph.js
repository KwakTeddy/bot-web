


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
		"inRaw": "주문",
		"inNLP": "주문",
		"children": [
			{
				"name": "치킨",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "치킨"
					},
					{
						"text": "1"
					},
					{
						"entities": [
							"치킨 메뉴@메뉴"
						]
					}
				],
				"output": {
					"output": "치킨입니다. 주문 할까요?",
					"image": {
						"url": "/files/smart1495778840162.jpg",
						"displayname": "bird.jpg"
					}
				},
				"children": [
					{
						"name": "주문 시작",
						"id": "default9",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {
							"call": "주문 카테고리2"
						}
					},
					{
						"name": "이전",
						"id": "default11",
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
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"text": "피자"
					},
					{
						"text": "2"
					},
					{
						"entities": [
							"메뉴 피자@메뉴2"
						]
					}
				],
				"output": [
					"피자입니다.",
					{
						"image": {
							"url": "/files/smart1495781855305.jpg",
							"displayname": "DesertTest.jpg"
						}
					}
				]
			},
			{
				"name": "재질문",
				"id": "default5",
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
	},
	{
		"name": "주문 카테고리",
		"id": "default6",
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
		"name": "주문 카테고리2",
		"id": "default8",
		"filename": "default",
		"input": [
			{
				"text": "주문"
			}
		],
		"output": "주문을 시작하시겠습니까?",
		"children": [
			{
				"name": "주문 완료",
				"id": "default10",
				"filename": "default",
				"input": [
					{
						"text": "네"
					}
				],
				"output": "주문을 완료 했습니다."
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
		"output": "smart 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [],
		"output": "고객센터에 문의바랍니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('smart');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
