


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
		"name": "입력",
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"text": "입력"
			}
		],
		"output": [
			{
				"text": "입력",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "테스트인텐트",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"intent": "테스트인텐트"
					}
				],
				"output": [
					{
						"text": "인텐트매칭",
						"kind": "Text"
					}
				]
			},
			{
				"name": "dialog_default5",
				"id": "default5",
				"filename": "default",
				"input": [
					{
						"entities": [
							"@테스트엔터티"
						]
					}
				],
				"output": [
					{
						"text": "엔터티 매칭",
						"kind": "Text"
					}
				]
			},
			{
				"name": "타입",
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"types": [
							"mobile"
						]
					}
				],
				"output": [
					{
						"text": "모바일 +mobile+",
						"kind": "Text"
					}
				]
			},
			{
				"name": "정규식",
				"id": "default7",
				"filename": "default",
				"input": [
					{
						"regexp": "(.*) 번"
					}
				],
				"output": [
					{
						"text": "정규식 입력\n+1+",
						"kind": "Text"
					}
				]
			},
			{
				"name": "조건문",
				"id": "default8",
				"filename": "default",
				"input": [
					{
						"if": "1 == 1"
					}
				],
				"output": [
					{
						"text": "if 적용",
						"kind": "Text"
					}
				]
			}
		]
	},
	{
		"name": "출력",
		"id": "default9",
		"filename": "default",
		"input": [
			{
				"text": "출력"
			}
		],
		"output": [
			{
				"text": "출력입니다",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "문장",
				"id": "default10",
				"filename": "default",
				"input": [
					{
						"text": "문장"
					}
				],
				"output": [
					{
						"text": "문장입니다",
						"kind": "Text"
					},
					{
						"text": "다른 문장도 출력",
						"kind": "Text"
					}
				]
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
				"output": [
					{
						"text": "이미지가 표시됩니다",
						"kind": "Content"
					}
				]
			},
			{
				"name": "버튼",
				"id": "default12",
				"filename": "default",
				"input": [
					{
						"text": "버튼"
					}
				],
				"output": [
					{
						"text": "버튼입니다",
						"buttons": [
							{
								"text": "버튼"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					null
				]
			}
		],
		"buttons": [
			null
		]
	},
	{
		"name": "대화",
		"id": "default13",
		"filename": "default",
		"input": [
			{
				"text": "대화"
			}
		],
		"output": [
			{
				"text": "대화관리",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "이동",
				"id": "default14",
				"filename": "default",
				"input": [
					{
						"text": "이동"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "버튼"
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
		"output": "edu4 입니다."
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('edu4');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
