


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "응"
			}
		],
		"output": [
			{
				"text": "인텐트 응",
				"kind": "Text"
			}
		],
		"name": "첫번째차일드"
	}
];

var commonDialogs = [
	{
		"id": "defaultcommon0",
		"filename": "defaultcommon",
		"name": "시작",
		"input": [
			{
				"intent": "응"
			}
		],
		"output": {
			"text": "핸드폰 번호를 입력하세요",
			"kind": "Text"
		}
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('jiseob_bot1');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
