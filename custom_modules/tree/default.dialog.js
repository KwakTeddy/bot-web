


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			[
				"안녕",
				{
					"types": [
						{
							"name": "address"
						},
						{
							"name": "data"
						}
					],
					"regexp": "/abc/"
				}
			],
			[
				"꺼져",
				"뭐라고"
			],
			[
				{
					"regexp": "/xxx/"
				}
			],
			[
				"sfsadfsadf",
				"바보",
				{
					"types": [
						{
							"name": "sdfasdf"
						}
					]
				}
			]
		],
		"output": [
			[
				"안녕하세요",
				"ㄴㅇㄹㄴㅇㄹㅇㄴ"
			],
			[
				{
					"call": "ㄴㅇㄹㄴㅇㄹ"
				}
			]
		],
		"name": "dialog_default0",
		"children": [
			{
				"name": "dialog_default1",
				"id": "default1",
				"filename": "default",
				"input": [
					[
						"하이"
					]
				],
				"output": [
					"하이롱"
				]
			},
			{
				"name": "dialog_default2",
				"id": "default2",
				"filename": "default",
				"input": [
					[
						"왓더"
					]
				],
				"output": [
					"헬"
				],
				"children": [
					{
						"name": "dialog_default5",
						"id": "default5",
						"filename": "default",
						"input": [
							""
						],
						"output": [
							""
						]
					}
				]
			},
			{
				"name": "dialog_default3",
				"id": "default3",
				"filename": "default",
				"input": [
					[
						"어쩌라고"
					]
				],
				"output": [
					"확",
					"그냥"
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
