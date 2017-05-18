


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "안녕"
			},
			{
				"text": "안녕하다"
			},
			{
				"text": "언뇽"
			},
			{
				"text": "안뇽"
			},
			{
				"text": "하이"
			},
			{
				"text": "할룽"
			},
			{
				"text": "헬로 우"
			},
			{
				"text": "안늉"
			}
		],
		"output": "안녕하세요",
		"name": "인사"
	},
	{
		"name": "감정표현_감사",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "고맙다"
			}
		],
		"output": "천만에요"
	},
	{
		"name": "강냉",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"intent": "강냉"
			}
		],
		"output": "가전제품 종류를 말씀해주세요",
		"children": [
			{
				"name": "가전제품 종류",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"entities": [
							"냉장고@가전제품"
						]
					}
				],
				"output": "다음은 문제의 유형입니다. 어떤 유형에 해당하시나요?",
				"children": [
					{
						"name": "2",
						"id": "default6",
						"filename": "default",
						"input": [
							{
								"text": "2"
							}
						],
						"output": "2번 유형입니다 이전을 누르세요"
					},
					{
						"name": "1",
						"id": "default7",
						"filename": "default",
						"input": [
							{
								"text": "1"
							}
						],
						"output": "1번 유형입니다 이전을 누르세요"
					}
				]
			}
		]
	},
	{
		"name": "약냉",
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"intent": "약냉"
			}
		],
		"output": "가전제품 종류를 말씀해주세요",
		"children": [
			{
				"name": "가전제품 종류",
				"id": "default5",
				"filename": "default",
				"input": [
					{
						"entities": [
							"@가전제품"
						]
					}
				],
				"output": "다음은 문제의 유형입니다. 어떤 유형?"
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
		"output": "junhatest 입니다."
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('junhatest');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
