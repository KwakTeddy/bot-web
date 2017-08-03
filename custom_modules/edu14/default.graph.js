


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
		"name": "dialog_default0",
		"children": [
			{
				"name": "dialog_default2",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "대화"
					}
				],
				"output": [
					{
						"text": "대화",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "dialog_default3",
						"id": "default3",
						"filename": "default",
						"input": [
							{
								"text": "업"
							}
						],
						"output": [
							{
								"kind": "Action",
								"up": "1"
							}
						]
					},
					{
						"name": "dialog_default5",
						"id": "default5",
						"filename": "default",
						"input": [
							{
								"if": "true"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "다시"
								}
							}
						]
					}
				]
			}
		]
	},
	{
		"name": "dialog_default4",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "이동"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "dialog_default0"
			}
		]
	},
	{
		"name": "dialog_default6",
		"id": "default6",
		"filename": "default",
		"input": [
			{
				"text": "태스 크다"
			}
		],
		"output": [
			{
				"text": "태스크입니다",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "dialog_default7",
				"id": "default7",
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
						"text": "매칭되었음\n+text+",
						"kind": "Text"
					}
				]
			},
			{
				"name": "dialog_default9",
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
						"text": "+listType1.title+\n+listType1.content+",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "dialog_default9",
						"id": "default9",
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
								"text": "+listType1.title+\n+listType1.content+",
								"kind": "Text"
							}
						]
					}
				]
			},
			{
				"name": "",
				"id": "default10",
				"filename": "default",
				"input": [
					{
						"types": [
							"mongoType1"
						]
					}
				],
				"output": [
					{
						"kind": "Text"
					}
				]
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
		"output": "edu14 입니다."
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('edu14');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
