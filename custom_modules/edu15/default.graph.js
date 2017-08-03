


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
		"name": "대화",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "대화"
			}
		],
		"output": [
			{
				"text": "대화입니다",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "up",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "up"
					}
				],
				"output": [
					{
						"kind": "Action",
						"up": "1"
					}
				]
			}
		]
	},
	{
		"name": "이동",
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"text": "이동"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "시작"
			}
		]
	},
	{
		"name": "task",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "테스 크다"
			}
		],
		"output": [
			{
				"text": "테스크입니다",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "테스크",
				"id": "default5",
				"filename": "default",
				"input": [
					{
						"types": [
							"testType"
						]
					}
				],
				"output": [
					{
						"text": "testType\n+test+\n+test2+",
						"kind": "Text"
					}
				]
			},
			{
				"name": "리스트",
				"id": "default7",
				"filename": "default",
				"input": [
					{
						"text": "리스트"
					}
				],
				"output": [
					{
						"text": "빈소 목록입니다.\n#list2# +index+. +title+ \n#",
						"kind": "Text"
					}
				],
				"task": "testTask",
				"children": [
					{
						"name": "테스트",
						"id": "default8",
						"filename": "default",
						"input": [
							{
								"types": [
									"listType1"
								]
							}
						],
						"output": [
							{
								"text": "+listType1.title+",
								"kind": "Text"
							}
						]
					}
				]
			},
			{
				"name": "",
				"id": "default9",
				"filename": "default",
				"input": [],
				"output": []
			}
		]
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
		"output": "edu15 입니다.",
		"inRaw": "이동",
		"inNLP": "이동"
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
		"input": [
			{
				"text": ""
			}
		],
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('edu15');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
