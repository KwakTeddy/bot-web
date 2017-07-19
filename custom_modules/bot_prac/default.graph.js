


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
                "types": [
                	"myname"
				]
            }
		],
		"output": {
			"text": "안녕하세요1 +myname+",
			"kind": "Text"
		},
		"name": "대답"
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
		"output": {
			"text": "이름이 뭔가요?",
			"kind": "Text"
		}
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('bot_prac');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
