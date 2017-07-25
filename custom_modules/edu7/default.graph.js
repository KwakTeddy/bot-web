


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
		"name": "",
		"id": "default11",
		"filename": "default",
		"input": [
			{
				"text": "출력"
			}
		],
		"output": [
			{
				"text": "출력입니다",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "",
				"id": "default12",
				"filename": "default",
				"input": [
					{
						"text": "문장"
					}
				],
				"output": [
					{
						"text": "문장입니다.",
						"kind": "Text"
					},
					{
						"text": "다른문장도 출력",
						"kind": "Text"
					}
				]
			},
			{
				"name": "",
				"id": "default13",
				"filename": "default",
				"input": [
					{
						"text": "이미지"
					}
				],
				"output": [
					{
						"text": "이미지입니다",
						"image": {
							"url": "/files/edu71500536328204.jpeg",
							"displayname": "loginqrcode.jpeg"
						},
						"kind": "Content"
					}
				]
			},
			{
				"name": "버튼",
				"id": "default14",
				"filename": "default",
				"input": [
					{
						"text": "버튼"
					}
				],
				"output": [
					{
						"text": "버튼출력됩니다.",
						"buttons": [
							{
								"text": "버튼출력",
								"url": "http://naver.com"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					null
				]
			},
			{
				"name": "",
				"id": "default15",
				"filename": "default",
				"input": [
					{
						"text": "대화"
					}
				],
				"output": [
					{
						"text": "대화관리",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "",
						"id": "default16",
						"filename": "default",
						"input": [
							{
								"text": "이동"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "버튼"
							}
						]
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
		"output": "edu7 입니다."
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('edu7');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
