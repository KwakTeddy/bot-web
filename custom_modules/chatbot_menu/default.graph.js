


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
		"name": "메뉴",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"intent": "배가 고픔"
			}
		],
		"output": {
			"output": "배가 고프시군요. 주문을 도와 드리겠습니다.",
			"buttons": [
				{
					"text": "1. 피자"
				},
				{
					"text": "2. 치킨"
				}
			],
			"text": "배가 고프시군요. 주문을 도와 드리겠습니다."
		},
		"inRaw": "주문",
		"inNLP": "주문",
		"task": {
			"output": "배가 고프시군요. 주문을 도와 드리겠습니다.",
			"buttons": [
				{
					"text": "1. 피자"
				},
				{
					"text": "2. 치킨"
				}
			],
			"text": "배가 고프시군요. 주문을 도와 드리겠습니다."
		},
		"children": [
			{
				"name": "피자",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"entities": [
							"피자@menu"
						]
					},
					{
						"text": "1"
					}
				],
				"output": {
					"output": "피자를 주문합니다.  이걸로 주문을 도와 드릴까요?",
					"image": {
						"url": "/files/chatbot_menu1495782005895.PNG",
						"displayname": "pizza.PNG"
					}
				},
				"children": [
					{
						"name": "dialog_default6",
						"id": "default6",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {
							"call": "메뉴"
						}
					},
					{
						"name": "이전",
						"id": "default9",
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
				"name": "치킨",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"entities": [
							"치킨@menu"
						]
					},
					{
						"text": "2"
					}
				],
				"output": {
					"output": "치킨을 주문합니다.  이걸로 주문을 도와 드릴까요?",
					"image": {
						"url": "/files/chatbot_menu1495782051067.PNG",
						"displayname": "chiken.PNG"
					}
				},
				"children": [
					{
						"name": "dialog_default7",
						"id": "default7",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {
							"call": "메뉴"
						}
					},
					{
						"name": "dialog_default11",
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
				"name": "dialog_default5",
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
		"name": "주문",
		"id": "default8",
		"filename": "default",
		"input": [
			{
				"text": "주문",
				"entities": [
					"@menu"
				]
			},
			{
				"text": "주문"
			},
			{
				"entities": [
					"@menu"
				],
				"text": "주문"
			}
		],
		"output": {
			"call": "메뉴"
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
		"output": "배달봇입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [],
		"output": "죄송합니다. 고객님, 다시 시도해 주세요."
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('chatbot_menu');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
