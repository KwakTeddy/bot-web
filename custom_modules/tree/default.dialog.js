


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "안녕 sdfsdf",
				"types": [
					{
						"name": "address"
					},
					{
						"name": "data"
					}
				]
			},
			{
				"text": "바보"
			}
		],
		"output": [
			{
				"output": "어쩌라고"
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
						"name": "dialog_default2",
						"id": "default2",
						"filename": "default",
						"input": [
							[]
						],
						"output": [
							[
								{
									"call": "dialog_default4"
								}
							]
						]
					},
					{
						"name": "dialog_default3",
						"id": "default3",
						"filename": "default",
						"input": [
							[]
						],
						"output": [
							[]
						]
					},
					{
						"name": "dialog_default4",
						"id": "default4",
						"filename": "default",
						"input": [
							[]
						],
						"output": [
							[]
						]
					},
					{
						"name": "dialog_default5",
						"id": "default5",
						"filename": "default",
						"input": [
							[]
						],
						"output": [
							[
								{
									"call": "dialog_default0"
								}
							]
						]
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
