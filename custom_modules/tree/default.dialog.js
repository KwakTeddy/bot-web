


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "바보"
			}
		],
		"output": [
			{
				"output": "어쩌라고",
				"image": "menu.jpg",
				"buttons": [
					{
						"name": "abc"
					},
					{
						"name": "def"
					}
				]
			}
		],
		"name": "dialog_default0",
		"children": [
			{
				"name": "dialog_default1",
				"id": "default1",
				"filename": "default",
				"input": [
					{
						"text": "써글"
					},
					{
						"text": "왓"
					}
				],
				"output": [
					{
						"output": "그래서 어쩌자는 거냐고ㅇㅇㅇㅇ",
						"if": "true"
					}
				],
				"children": [
					{
						"name": "dialog_default4",
						"id": "default4",
						"filename": "default",
						"input": [],
						"output": [],
						"task": {
							"name": "lglist"
						}
					},
					{
						"name": "dialog_default5",
						"id": "default5",
						"filename": "default",
						"input": [
							{
								"text": "베베"
							}
						],
						"output": [
							{
								"output": "꺼져"
							}
						]
					},
					{
						"name": "dialog_default6",
						"id": "default6",
						"filename": "default",
						"input": [],
						"output": []
					},
					{
						"name": "dialog_default7",
						"id": "default7",
						"filename": "default",
						"input": [],
						"output": []
					}
				],
				"task": "lglist"
			},
			{
				"name": "dialog_default8",
				"id": "default8",
				"filename": "default",
				"input": [
					{
						"regexp": "/[0-9]+/",
						"types": [
							"date"
						]
					}
				],
				"output": [
					{
						"call": "dialog_default4",
						"if": "a=b"
					},
					{
						"returnCall": "dialog_default7"
					},
					{
						"callChild": "dialog_default6"
					},
					{
						"buttons": [
							{
								"name": "abc"
							},
							{
								"name": "bdf"
							}
						]
					}
				]
			},
			{
				"name": "dialog_default9",
				"id": "default9",
				"filename": "default",
				"input": [
					{
						"types": [
							"address"
						]
					}
				],
				"output": [
					{
						"output": "주소입니다"
					}
				]
			}
		],
		"task": "lglist"
	}
];

var commonDialogs = [
{
  id: 'defaultcommon0',
  filename: 'defaultcommon',
  name: '시작',
  input: '시작',
  output: 'tree 입니다.'
},
{
  id: 'defaultcommon1',
  filename: 'defaultcommon',
  name: '답변없음',
  input: '',
  output: '알아듣지 못했습니다'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('tree');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
