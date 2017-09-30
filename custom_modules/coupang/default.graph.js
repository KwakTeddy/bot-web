


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "주문"
			},
			{
				"text": "1"
			}
		],
		"output": [
			{
				"text": "주문목록\n\n#order#+index+. +text+ [+status+]\n\n+orderId+, +orderItems[0].cancelCount+#\n\nexp = +exp2+, +exp+",
				"kind": "Text"
			}
		],
		"name": "dialog_default0",
		"task": "defaultTask2"
	},
	{
		"name": "dialog_default1",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "반품"
			},
			{
				"text": "2"
			}
		],
		"output": [
			{
				"text": "ㅁㄴㅇㄹ",
				"kind": "Text"
			}
		],
		"task": {
			"name": "orderReturn"
		}
	}
];

var commonDialogs = [
	{
		"id": "defaultcommon0",
		"filename": "defaultcommon",
		"name": "시작",
		"output": {
			"text": "메뉴 선택하세요\n1. 주문조회\n2. 반품\n3. 교환",
			"kind": "Text"
		},
		"input": [
			{
				"text": "시작"
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
	}
];
var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('coupang');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
