


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "하이"
			}
		],
		"output": [
			{
				"text": "안녕하세요",
				"kind": "Text"
			}
		],
		"name": "dialog_default0",
		"children": [
			{
				"name": "if실험part1",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"text": "폰번 실험"
					}
				],
				"output": [
					{
						"text": "",
						"kind": "Content"
					}
				]
			},
			{
				"name": "TAB",
				"id": "default13",
				"filename": "default",
				"input": [
					{
						"text": "1"
					},
					{
						"text": "2"
					},
					{
						"text": "3"
					}
				],
				"output": [
					{
						"text": "D",
						"kind": "Text"
					}
				]
			},
			{
				"name": "과일",
				"id": "default14",
				"filename": "default",
				"input": [
					{
						"entities": [
							"@과일"
						]
					}
				],
				"output": [
					{
						"text": "과일이당!",
						"kind": "Text"
					}
				]
			}
		]
	},
	{
		"name": "인텐트실험",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"intent": "인텐트실험"
			}
		],
		"output": [
			{
				"text": "휴대폰이당",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "정규식실험",
				"id": "default7",
				"filename": "default",
				"input": [
					{
						"regexp": ".*"
					}
				],
				"output": [
					{
						"text": "true",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "UP실험",
						"id": "default11",
						"filename": "default",
						"input": [
							{
								"regexp": ".*"
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
			}
		]
	},
	{
		"name": "type실험",
		"id": "default8",
		"filename": "default",
		"input": [
			{
				"types": [
					"number"
				]
			}
		],
		"output": [
			{
				"text": "숫자당",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "button",
				"id": "default9",
				"filename": "default",
				"input": [
					{
						"regexp": ".*"
					}
				],
				"output": [
					{
						"text": "",
						"buttons": [
							{
								"text": "1",
								"url": "1"
							},
							{
								"text": "2",
								"url": "2"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "CALL실험",
						"id": "default10",
						"filename": "default",
						"input": [
							{
								"regexp": ".*"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "dialog_default0"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "1",
						"url": "1"
					},
					{
						"text": "2",
						"url": "2"
					}
				]
			}
		]
	},
	{
		"name": "인텐트",
		"id": "default15",
		"filename": "default",
		"input": [
			{
				"intent": "인인"
			}
		],
		"output": [
			{
				"text": "ㄷㄹㄷㄹ",
				"kind": "Text"
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
		"output": "test_2 입니다."
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('test_2');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
