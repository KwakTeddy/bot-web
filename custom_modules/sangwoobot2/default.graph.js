


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"types": [
					"date"
				]
			}
		],
		"output": [
			{
				"text": "오래도 만났네",
				"kind": "Text"
			}
		],
		"name": "$date 입력"
	},
	{
		"name": "ㅇㅇㅇ",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"intent": "치킨"
			},
			{
				"intent": "피자"
			},
			{
				"intent": "음식"
			}
		],
		"output": [
			{
				"text": "오 나도 좋아하는데",
				"kind": "Text"
			}
		]
	},
	{
		"name": "",
		"id": "default2",
		"filename": "default",
		"input": [],
		"output": []
	},
	{
		"name": "",
		"id": "default3",
		"filename": "default",
		"input": [],
		"output": []
	},
	{
		"name": "",
		"id": "default4",
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
		"output": [
			{
				"text": "아래 질문 중 한가지에 대답하시오\n\n- 언제부터 사귀셨나요\n- 좋아하는 음식은\n-",
				"kind": "Text"
			}
		]
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('sangwoobot2');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
