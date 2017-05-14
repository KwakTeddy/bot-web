


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "안녕하다"
			}
		],
		"output": [
			{
				"output": "어 안녕"
			}
		],
		"name": "dialog_default0"
	},
	{
		"name": "dialog_default1",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "바보 이다"
			}
		],
		"output": [
			{
				"output": "너가 바보다"
			}
		]
	},
	{
		"name": "dialog_default2",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "ㅁㄴ"
			}
		],
		"output": [
			{
				"call": "dialog_default4"
			}
		]
	},
	{
		"name": "dialog_default3",
		"id": "default3",
		"filename": "default",
		"input": [],
		"output": [
			{
				"output": "ㅁㄴㅇㅁㄴㅇ"
			}
		]
	},
	{
		"name": "dialog_default4",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "ㅁㄴㅇㄴ"
			}
		],
		"output": [
			{
				"output": "ㅁㄴㅇㄴㅁㅇ"
			}
		]
	},
	{
		"name": "dialog_default5",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"text": "ㅁㄴㅇㄴ"
			}
		],
		"output": [
			{
				"output": "ㅁㄴㅇㄴㅁㅇ"
			}
		]
	}
];

var commonDialogs = [
{
  id: 'defaultcommon0',
  filename: 'defaultcommon',
  name: '시작',
  input: '시작',
  output: 'tree3 입니다.'
},
{
  id: 'defaultcommon1',
  filename: 'defaultcommon',
  name: '답변없음',
  input: '',
  output: '알아듣지 못했습니다'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('tree3');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
