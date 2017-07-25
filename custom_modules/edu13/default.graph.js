


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
				"text": "대화",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "이동",
				"id": "default2",
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
				"name": "dialog_default3",
				"id": "default3",
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
			},
			{
				"name": "child",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"text": "child"
					}
				],
				"output": [
					{
						"text": "child",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "up",
						"id": "default5",
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
				"name": "리핏",
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1"
					}
				]
			}
		]
	},
	{
		"name": "테스크",
		"id": "default7",
		"filename": "default",
		"input": [
			{
				"text": "테스 크다"
			}
		],
		"output": [
			{
				"text": "테스크",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "dialog_default8",
				"id": "default8",
				"filename": "default",
				"input": [
					{
						"types": [
							"testtype"
						]
					}
				],
				"output": [
					{
						"text": "type\n+test+\n+test2+",
						"kind": "Text"
					}
				]
			},
			{
				"name": "dialog_default9",
				"id": "default9",
				"filename": "default",
				"input": [
					{
						"text": "리스트"
					}
				],
				"output": [
					{
						"text": "빈소 목록입니다.\n\n#list1# +title+#",
						"kind": "Text"
					}
				],
				"task": "testtask",
				"children": [
					{
						"name": "dialog_default10",
						"id": "default10",
						"filename": "default",
						"input": [
							{
								"types": [
									"listtype1"
								]
							}
						],
						"output": [
							{
								"text": "제목 : +listtype1.title+\n내용 : +listtype1.content+\n\n더 필요한게 있으신가요",
								"kind": "Text"
							}
						]
					}
				]
			},
			{
				"name": "",
				"id": "default11",
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
		"output": "edu13 입니다."
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
				"if": "true"
			}
		],
		"output": {
			"text": "몰라 이 자식아.",
			"kind": "Text"
		}
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('edu13');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
