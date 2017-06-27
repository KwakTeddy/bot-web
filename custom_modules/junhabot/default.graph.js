


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "배고픔"
			}
		],
		"output": "1, 치킨2, 피자",
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
						"url": "/files/junhabot1498453702728.jpg",
						"displayname": "llllll1498453363946.jpg"
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
						"url": "/files/junhabot1498453741942.jpg",
						"displayname": "이벤트.jpg"
					},
					"text": "피자입니다"
				},
				"inRaw": "피자",
				"inNLP": "피자",
				"task": {
					"output": "피자입니다",
					"image": {
						"url": "/files/junhabot1498453741942.jpg",
						"displayname": "이벤트.jpg"
					},
					"text": "피자입니다"
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
						"output": "치킨이나 피자 중에 선택해주세요"
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
				}
			],
			"output": "배고팡?"
		}
	},
	{
		"name": "dialog_default7",
		"id": "default7",
		"filename": "default",
		"input": [
			{
				"text": "유알"
			}
		],
		"output": {
			"buttons": [
				{
					"text": "유알엘",
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
		"output": "junhabot 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('junhabot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
