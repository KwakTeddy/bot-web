


var dialogs = [
	{
		"name": "reg1",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"regexp": "/사과/"
			}
		],
		"output": {
			"output": "사과레귤러"
		}
	},
	{
		"name": "text-text",
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"text": "안녕"
			}
		],
		"output": {
			"output": "안녕하세요"
		}
	},
	{
		"name": "image",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "이미지"
			}
		],
		"output": {
			"image": "스크린샷 2017-05-15 오후 6.02.04.png"
		}
	},
	{
		"name": "button",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"text": "버튼"
			}
		],
		"output": {
			"buttons": [
				{
					"name": "버튼1"
				}
			]
		}
	},
	{
		"name": "Call1",
		"id": "default6",
		"filename": "default",
		"input": [
			{
				"text": "콜 1"
			}
		],
		"output": {
			"call": "text-text"
		}
	},
	{
		"name": "repeat1",
		"id": "default7",
		"filename": "default",
		"input": [
			{
				"text": "repeat"
			}
		],
		"output": {
			"output": "repeat1"
		},
		"children": [
			{
				"name": "repeat2",
				"id": "default8",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"output": "11"
				},
				"children": [
					{
						"name": "up1",
						"id": "default11",
						"filename": "default",
						"input": [
							{
								"text": "5"
							}
						],
						"output": {
							"up": "1"
						}
					}
				]
			},
			{
				"name": "repeat3",
				"id": "default9",
				"filename": "default",
				"input": [
					{
						"text": "2"
					}
				],
				"output": {
					"output": "22"
				}
			},
			{
				"name": "repeat4",
				"id": "default10",
				"filename": "default",
				"input": [
					{
						"text": "3"
					}
				],
				"output": {
					"repeat": "1"
				}
			}
		]
	},
	{
		"name": "intent",
		"id": "default12",
		"filename": "default",
		"input": [
			{
				"intent": "노래요청"
			}
		],
		"output": {
			"output": "노래오키"
		}
	},
	{
		"name": "returncall",
		"id": "default16",
		"filename": "default",
		"input": [
			{
				"text": "return"
			}
		],
		"output": {
			"returnCall": "text-text"
		},
		"children": [
			{
				"name": "returncall2",
				"id": "default17",
				"filename": "default",
				"input": [
					{
						"text": "child"
					}
				],
				"output": {
					"output": "returncall성공"
				}
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
