


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
		"output": "주문을 해드릴까요? 1. 치킨, 2.피자",
		"task": "defaultTask",
		"children": [
			{
				"name": "치킨",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"text": "치킨"
					},
					{
						"text": "1"
					}
				],
				"output": "치킨입니다",
				"children": [
					{
						"name": "dialog_default8",
						"id": "default8",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {}
					},
					{
						"name": "dialog_default9",
						"id": "default9",
						"filename": "default",
						"input": [
							{
								"if": "이전"
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
						"text": "피자"
					},
					{
						"text": "2"
					}
				],
				"output": "피자입니다"
			}
		]
	},
	{
		"name": "dialog_default6",
		"id": "default6",
		"filename": "default",
		"input": [
			{
				"text": "주문",
				"entities": [
					"@메뉴"
				]
			}
		],
		"output": "주문을 시작하겠습니다"
	},
	{
		"name": "dialog_default7",
		"id": "default7",
		"filename": "default",
		"input": [
			{
				"text": "주문"
			}
		],
		"output": {}
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
		"output": "tklee 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [],
		"output": "죄송합니다. 고객님, 아직 학습을 못했습니다. KPMG 이동근 파트너에게 전화로 문의하시는것이 좋겠습니다. 핸드폰 번호는 010-4109-9230 입니다."
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('tklee');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
