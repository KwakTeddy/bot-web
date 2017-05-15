


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "안녕"
			}
		],
		"output": [
			{
				"output": "안녕하세요"
			}
		],
		"name": "안녕"
	},
	{
		"name": "이미지버튼",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "이미지 버튼"
			}
		],
		"output": [
			{
				"image": "002-hospital.png"
			},
			{
				"buttons": [
					{
						"name": "이미지보기"
					}
				]
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
  output: 'undefined 입니다.'
},
{
  id: 'defaultcommon1',
  filename: 'defaultcommon',
  name: '답변없음',
  input: '',
  output: '알아듣지 못했습니다'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('sampletree');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
