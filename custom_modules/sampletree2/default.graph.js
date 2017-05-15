


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
		"name": "text-text"
	},
	{
		"name": "regexp",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"regexp": "/사과/"
			}
		],
		"output": "사과레귤러"
	},
	{
		"name": "image",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "image"
			}
		],
		"output": {
			"image": {
				"url": "/files/menu.jpg"
			}
		}
	},
	{
		"name": "button",
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"text": "button"
			}
		],
		"output": {
			"buttons": [
				{
					"text": "test"
				}
			]
		}
	},
	{
		"name": "false2",
		"id": "default17",
		"filename": "default",
		"input": [
			{
				"text": "false"
			}
		],
		"output": {
			"call": "false"
		}
	},
	{
		"name": "call",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "call"
			}
		],
		"output": {
			"call": "text-text"
		}
	},
	{
		"name": "all input",
		"id": "default16",
		"filename": "default",
		"input": [
			{
				"text": "text",
				"types": [
					"date"
				],
				"regexp": "/포도/"
			}
		],
		"output": "all success"
	},
	{
		"name": "task4",
		"id": "default23",
		"filename": "default",
		"input": [
			{
				"text": "output"
			}
		],
		"output": [
			{
				"if": "context.dialog.check=='check'",
				"output": "Success"
			},
			{
				"if": "context.dialog.check!='check'",
				"output": "Fail"
			}
		],
		"task": "defaultTask"
	},
	{
		"name": "returncall",
		"id": "default10",
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
				"id": "default11",
				"filename": "default",
				"input": [
					{
						"text": "child"
					}
				],
				"output": "success"
			}
		]
	},
	{
		"name": "intent",
		"id": "default14",
		"filename": "default",
		"input": [
			{
				"intent": "노래요청1"
			}
		],
		"output": "노래 불러줄게"
	},
	{
		"name": "task",
		"id": "default19",
		"filename": "default",
		"input": [
			{
				"text": "task"
			}
		],
		"output": "choose",
		"task": {
			"name": "defaultTask"
		},
		"children": [
			{
				"name": "task2",
				"id": "default21",
				"filename": "default",
				"input": [
					{
						"if": "context.dialog.check=='check'"
					}
				],
				"output": "success"
			},
			{
				"name": "task3",
				"id": "default22",
				"filename": "default",
				"input": [
					{
						"if": "context.dialog.check!='check'"
					}
				],
				"output": "fail"
			}
		]
	},
	{
		"name": "repeat1",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"text": "repeat"
			}
		],
		"output": "success",
		"children": [
			{
				"name": "repeat2",
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": "---------1----------",
				"children": [
					{
						"name": "up",
						"id": "default9",
						"filename": "default",
						"input": [
							{
								"text": "3"
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
				"id": "default7",
				"filename": "default",
				"input": [
					{
						"text": "2"
					}
				],
				"output": {
					"repeat": "1"
				}
			}
		]
	},
	{
		"name": "type",
		"id": "default18",
		"filename": "default",
		"input": [
			{
				"types": [
					"date"
				]
			}
		],
		"output": "datesucccess"
	},
	{
		"name": "false",
		"id": "default12",
		"filename": "default",
		"input": "false",
		"output": "success"
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
		"output": "sampletree2 입니다. 왓???????"
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('sampletree2');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
