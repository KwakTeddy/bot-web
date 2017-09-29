


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
		"name": "dialog_default14",
		"id": "default14",
		"filename": "default",
		"input": [
			{
				"text": "버튼 이미지 텍스트"
			}
		],
		"output": {
			"output": "버튼이미지텍스트",
			"image": {
				"url": "/files/666777.png"
			},
			"buttons": [
				{
					"text": "버튼이름"
				}
			]
		}
	},
	{
		"name": "버튼텍스트",
		"id": "default13",
		"filename": "default",
		"input": [
			{
				"text": "버튼 텍스트"
			}
		],
		"output": {
			"buttons": [
				{
					"text": "버튼이름"
				}
			],
			"output": "버튼텍스트"
		}
	},
	{
		"name": "버튼이미지",
		"id": "default15",
		"filename": "default",
		"input": [
			{
				"text": "버튼 이미지"
			}
		],
		"output": {
			"image": {
				"url": "/files/666777.png"
			},
			"buttons": [
				{
					"text": "버튼이미지"
				}
			]
		}
	},
	{
		"name": "버튼만",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "버튼"
			}
		],
		"output": {
			"buttons": [
				{
					"text": "버튼"
				}
			]
		}
	},
	{
		"name": "dialog_default5",
		"id": "default5",
		"filename": "default",
		"input": [],
		"output": []
	},
	{
		"name": "버튼 텍스트",
		"id": "default6",
		"filename": "default",
		"input": [
			{
				"text": "버튼 텍스트"
			}
		],
		"output": {
			"output": "버튼텍스트",
			"buttons": [
				{
					"text": "버튼텍스트"
				}
			]
		}
	},
	{
		"name": "dialog_default9",
		"id": "default9",
		"filename": "default",
		"input": [],
		"output": []
	},
	{
		"name": "이미지텍스트",
		"id": "default10",
		"filename": "default",
		"input": [
			{
				"text": "스크린샷"
			}
		],
		"output": {
			"image": {
				"url": "/files/666777.png"
			},
			"output": "스크린샷"
		}
	},
	{
		"name": "한글이미지",
		"id": "default12",
		"filename": "default",
		"input": [
			{
				"text": "한글 이미지"
			}
		],
		"output": {
			"image": {
				"url": "/files/스크린샷 2017-05-18 오전 10.38.12.png"
			}
		}
	},
	{
		"name": "이미지",
		"id": "default11",
		"filename": "default",
		"input": [
			{
				"text": "이미지"
			}
		],
		"output": {
			"image": {
				"url": "/files/666777.png"
			}
		}
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
		"output": "facebooktest 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("./engine/core/bot")).getBot('facebooktest');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
