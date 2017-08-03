


var dialogs = [
	{
		"name": "남자",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"text": "1"
			},
			{
				"text": "2"
			}
		],
		"output": [
			{
				"text": "어떤걸ㅋㅋ",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "ㅇㅇㅇ",
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"text": "1"
					},
					{
						"text": "2"
					}
				],
				"output": [
					{
						"text": "와우",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "ㅇㅇ",
						"id": "default7",
						"filename": "default",
						"input": [
							{
								"text": "1"
							}
						],
						"output": [
							{
								"text": "이텍스트가이텍스트가이텍스트가이텍스트가이텍스트가이텍스트가이텍스트가이텍스트가이텍스트가이텍스트가이텍스트가이텍스트가이텍스트가",
								"kind": "Text"
							}
						]
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
		"output": {
			"text": "본인의 성별을 선택해주세요.\n\n1. 남자\n2. 여자",
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
			"up": 1,
			"kind": "Action",
			"type": "Up"
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('sangwoolastbot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
