


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
				"name": "dialog_default4",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"intent": "테스트인텐트"
					}
				],
				"output": [
					{
						"text": "인텐트 매칭",
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
							"@테스트 엔터티"
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
				"name": "",
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
						"text": "모바일\n+mobile+",
						"kind": "Text"
					}
				]
			},
			{
				"name": "",
				"id": "default7",
				"filename": "default",
				"input": [
					{
						"regexp": "(.*) 번 (.*) 개 (.*) 명"
					}
				],
				"output": [
					{
						"text": "정규식 립력\n+1+\n+2+\n+3+",
						"kind": "Text"
					}
				]
			},
			{
				"name": "조건",
				"id": "default8",
				"filename": "default",
				"input": [
					{
						"if": "1==2"
					}
				],
				"output": [
					{
						"if": "",
						"text": "트루",
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
				"text": "[Depth1]\n출력입니다.",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "문장 출력",
				"id": "default10",
				"filename": "default",
				"input": [
					{
						"text": "문장"
					}
				],
				"output": [
					{
						"text": "[Depth2]\n문장입니다.",
						"kind": "Text"
					},
					{
						"text": "[Depth2]\n문장2입니다.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "이미지 연겨랗기",
				"id": "default11",
				"filename": "default",
				"input": [
					{
						"text": "이미지"
					}
				],
				"output": [
					{
						"text": "카카오톡 연결하기 입니다.",
						"image": {
							"url": "/files/edu21500536254155.png",
							"displayname": "kakako.png"
						},
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
						"text": "바로가기 버튼!!!",
						"buttons": [
							{
								"text": "네이버",
								"url": "https://www.naver.com"
							},
							{
								"text": "구글",
								"url": "https://www.google.com"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					null,
					null
				]
			}
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
				"text": "대화 관리",
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
		"output": "edu2 입니다."
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('edu2');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
