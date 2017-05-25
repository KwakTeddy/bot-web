


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
		"name": "욕",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "지랄"
			},
			{
				"text": "씨발"
			}
		],
		"output": "욕은 그 사람의 인격을 보여줍니다"
	},
	{
		"name": "테스트",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "테스트 하다 오다"
			},
			{
				"text": "테스트"
			}
		],
		"output": "잘 오셨어요 빨리 승인해주세요"
	},
	{
		"name": "dialog_default3",
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"entities": [
					"@가전제품"
				]
			}
		],
		"output": "123123"
	},
	{
		"name": "dialog_default4",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"entities": [
					"에어컨@가전제품"
				]
			}
		],
		"output": "432423423"
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
		"output": "junhabot1 입니다."
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
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('junhabot1');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
