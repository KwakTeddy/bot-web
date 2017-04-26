


var dialogs = [
	{
		"name": "dialog_test1",
		"id": "test1",
		"filename": "test",
		"input": [
			{
				"text": "안녕 바보",
				"types": [
					{
						"name": "address"
					},
					{
						"name": "date"
					}
				],
				"regexp": "/abc/"
			},
			{
				"text": "왓 더 헬"
			},
			{
				"regexp": "/xyz/"
			}
		],
		"output": [
			{
				"output": "안녕하세요"
			},
			{
				"if": "a = b"
			},
			{
				"up": "1"
			}
		],
		"children": [
			{
				"name": "dialog_test2",
				"id": "test2",
				"filename": "test",
				"input": [],
				"output": [
					{
						"output": "dsfsdfds",
						"if": "aaa"
					}
				]
			},
			{
				"name": "dialog_test3",
				"id": "test3",
				"filename": "test",
				"input": [],
				"output": []
			},
			{
				"name": "dialog_test4",
				"id": "test4",
				"filename": "test",
				"input": [],
				"output": []
			}
		]
	}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('tree');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
