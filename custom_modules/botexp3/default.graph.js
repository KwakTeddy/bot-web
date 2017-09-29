


var dialogs = [
	{
		"name": "리턴콜1",
		"id": "default13",
		"filename": "default",
		"input": [
			{
				"text": "1"
			}
		],
		"output": {
			"text": "리턴콜1",
			"kind": "Text"
		},
		"children": [
			{
				"name": "리턴콜2",
				"id": "default14",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": [
					{
						"kind": "Action",
						"return": "1",
						"options": {
							"output": "리턴됨"
						},
						"type": "Return"
					}
				]
			}
		],
		"inRaw": "2",
		"inNLP": "2"
	},
	{
		"name": "리턴콜3",
		"id": "default15",
		"filename": "default",
		"input": [
			{
				"text": "2"
			}
		],
		"output": [
			{
				"kind": "Action",
				"returnCall": "리턴콜1",
				"options": {
					"output": "말?"
				},
				"type": "ReturnCall"
			}
		],
		"children": [
			{
				"name": "리턴콜4",
				"id": "default16",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": [
					{
						"kind": "Text"
					}
				]
			}
		]
	},
	{
		"name": "리핏",
		"id": "default17",
		"filename": "default",
		"input": [
			{
				"text": "3"
			}
		],
		"output": [
			{
				"text": "#option#+content+, #",
				"kind": "Text"
			}
		],
		"task": "OptionStart"
	},
	{
		"name": "리턴콜1",
		"id": "default13",
		"filename": "default",
		"input": [
			{
				"text": "1"
			}
		],
		"output": {
			"text": "리턴콜1",
			"kind": "Text"
		},
		"children": [
			{
				"name": "리턴콜2",
				"id": "default14",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": [
					{
						"kind": "Action",
						"return": "1",
						"options": {
							"output": "리턴됨"
						},
						"type": "Return"
					}
				]
			}
		],
		"inRaw": "2",
		"inNLP": "2"
	},
	{
		"name": "리턴콜3",
		"id": "default15",
		"filename": "default",
		"input": [
			{
				"text": "2"
			}
		],
		"output": [
			{
				"kind": "Action",
				"returnCall": "리턴콜1",
				"options": {
					"output": "말?"
				},
				"type": "ReturnCall"
			}
		],
		"children": [
			{
				"name": "리턴콜4",
				"id": "default16",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": [
					{
						"kind": "Text"
					}
				]
			}
		]
	},
	{
		"name": "리핏",
		"id": "default17",
		"filename": "default",
		"input": [
			{
				"text": "3"
			}
		],
		"output": [
			{
				"text": "#option#+content+, #",
				"kind": "Text"
			}
		],
		"task": "OptionStart"
	},
	{
		"name": "실험",
		"id": "default19",
		"filename": "default",
		"input": [
			{
				"text": "4"
			}
		],
		"output": [
			{
				"text": "#option#+content+, #",
				"kind": "Text"
			}
		],
		"task": {
			"name": "OptionStart"
		},
		"children": [
			{
				"name": "실험2",
				"id": "default20",
				"filename": "default",
				"input": [
					{
						"text": "5"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "sdf"
						}
					}
				],
				"task": "makeOption"
			}
		]
	},
	{
		"name": "리턴콜1",
		"id": "default13",
		"filename": "default",
		"input": [
			{
				"text": "1"
			}
		],
		"output": {
			"text": "리턴콜1",
			"kind": "Text"
		},
		"children": [
			{
				"name": "리턴콜2",
				"id": "default14",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": [
					{
						"kind": "Action",
						"return": "1",
						"options": {
							"output": "리턴됨"
						},
						"type": "Return"
					}
				]
			}
		],
		"inRaw": "2",
		"inNLP": "2"
	},
	{
		"name": "리턴콜3",
		"id": "default15",
		"filename": "default",
		"input": [
			{
				"text": "2"
			}
		],
		"output": [
			{
				"kind": "Action",
				"returnCall": "리턴콜1",
				"options": {
					"output": "말?"
				},
				"type": "ReturnCall"
			}
		],
		"children": [
			{
				"name": "리턴콜4",
				"id": "default16",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": [
					{
						"kind": "Text"
					}
				]
			}
		]
	},
	{
		"name": "리핏",
		"id": "default17",
		"filename": "default",
		"input": [
			{
				"text": "3"
			}
		],
		"output": [
			{
				"text": "#option#+content+, #",
				"kind": "Text"
			}
		],
		"task": "OptionStart"
	},
	{
		"name": "리턴콜1",
		"id": "default13",
		"filename": "default",
		"input": [
			{
				"text": "1"
			}
		],
		"output": {
			"text": "리턴콜1",
			"kind": "Text"
		},
		"children": [
			{
				"name": "리턴콜2",
				"id": "default14",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": [
					{
						"kind": "Action",
						"return": "1",
						"options": {
							"output": "리턴됨"
						},
						"type": "Return"
					}
				]
			}
		],
		"inRaw": "2",
		"inNLP": "2"
	},
	{
		"name": "리턴콜3",
		"id": "default15",
		"filename": "default",
		"input": [
			{
				"text": "2"
			}
		],
		"output": [
			{
				"kind": "Action",
				"returnCall": "리턴콜1",
				"options": {
					"output": "말?"
				},
				"type": "ReturnCall"
			}
		],
		"children": [
			{
				"name": "리턴콜4",
				"id": "default16",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": [
					{
						"kind": "Text"
					}
				]
			}
		]
	},
	{
		"name": "리핏",
		"id": "default17",
		"filename": "default",
		"input": [
			{
				"text": "3"
			}
		],
		"output": [
			{
				"text": "#option#+content+, #",
				"kind": "Text"
			}
		],
		"task": "OptionStart"
	},
	{
		"name": "실험",
		"id": "default19",
		"filename": "default",
		"input": [
			{
				"text": "4"
			}
		],
		"output": [
			{
				"text": "",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "실험2",
				"id": "default20",
				"filename": "default",
				"input": [
					{
						"text": "5"
					}
				],
				"output": [
					{
						"text": "ㅁㄴㅇㄹㅇㄹㄴ",
						"kind": "Text"
					}
				],
				"task": "makeOption"
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
				"text": "5"
			}
		],
		"output": [
			{
				"text": "ㅁㄴㅇㄹㅇㄹㄴ",
				"kind": "Text"
			}
		]
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
		"input": "",
		"output": "알아듣지 못했습니다"
	},
	{
		"id": "defaultcommon0",
		"filename": "defaultcommon",
		"name": "시작",
		"input": [
			{
				"text": "시작"
			}
		],
		"output": {
			"text": "botexp3 입니다.dsafdsfasdfadsfasdfadsf\nasdf",
			"kind": "Text"
		}
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
		"input": "",
		"output": "알아듣지 못했습니다"
	},
	{
		"id": "defaultcommon0",
		"filename": "defaultcommon",
		"name": "시작",
		"input": [
			{
				"text": "5"
			}
		],
		"output": [
			{
				"kind": "Action",
				"repeat": "1",
				"options": {
					"output": "asdf"
				}
			}
		]
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
		"input": "",
		"output": "알아듣지 못했습니다"
	},
	{
		"id": "defaultcommon0",
		"filename": "defaultcommon",
		"name": "시작",
		"input": [
			{
				"text": "시작"
			}
		],
		"output": {
			"text": "botexp3 입니다.dsafdsfasdfadsfasdfadsf\nasdf",
			"kind": "Text"
		}
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
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("./engine/core/bot")).getBot('botexp3');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
