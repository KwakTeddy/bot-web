


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
		"name": "dialog_default1",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "data 전문가"
			}
		],
		"output": "KPMG SOC팀입니다",
		"children": [
			{
				"name": "dialog_default2",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "담당 파트너"
					}
				],
				"output": "이동근 파트너입니다",
				"children": [
					{
						"name": "dialog_default3",
						"id": "default3",
						"filename": "default",
						"input": [
							{
								"text": "연락처"
							}
						],
						"output": "회사번호, 핸드폰 번호 중 어떤 것을 알려드릴까요?",
						"children": [
							{
								"name": "dialog_default4",
								"id": "default4",
								"filename": "default",
								"input": [
									{
										"text": "핸드폰 번호"
									}
								],
								"output": "010-4109-9230 입니다"
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
		"output": "R_consultant 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('R_consultant');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
