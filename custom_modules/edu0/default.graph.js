


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "이동"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "dialog_default12"
			}
		],
		"name": "dialog_default14"
	},
	{
		"name": "dialog_default2",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "입력"
			}
		],
		"output": [
			{
				"text": "입력으로",
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
				"name": "dialog_default6",
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
				"name": "dialog_default7",
				"id": "default7",
				"filename": "default",
				"input": [
					{
						"regexp": "(.*) 번 (.*) 개"
					}
				],
				"output": [
					{
						"text": "정규식 입력\n+1+ 번\n+2+ 개",
						"kind": "Text"
					}
				]
			},
			{
				"name": "dialog_default8",
				"id": "default8",
				"filename": "default",
				"input": [
					{
						"if": "1 ==2"
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
		"name": "dialog_default9",
		"id": "default9",
		"filename": "default",
		"input": [
			{
				"text": "출력"
			}
		],
		"output": [
			{
				"text": "출력입니다.",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "dialog_default10",
				"id": "default10",
				"filename": "default",
				"input": [
					{
						"text": "문장"
					}
				],
				"output": [
					{
						"text": "문장입니다.",
						"kind": "Text"
					},
					{
						"text": "다른 문장도 출력",
						"kind": "Text"
					}
				]
			},
			{
				"name": "dialog_default11",
				"id": "default11",
				"filename": "default",
				"input": [
					{
						"text": "이미지"
					}
				],
				"output": [
					{
						"text": "이미지가 표시 됩니다.",
						"image": {
							"url": "/files/edu01500536256214.png",
							"displayname": "btn_feature_03.png"
						},
						"kind": "Content"
					}
				]
			},
			{
				"name": "dialog_default12",
				"id": "default12",
				"filename": "default",
				"input": [
					{
						"text": "버튼"
					}
				],
				"output": [
					{
						"text": "버튼코드",
						"buttons": [
							{
								"text": "버튼1"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					null
				]
			}
		]
	},
	{
		"name": "dialog_default13",
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
				"name": "dialog_default14",
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
						"call": "dialog_default11"
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
				"text": "버튼"
			}
		],
		"output": [
			{
				"text": "버튼출력",
				"buttons": [
					{
						"text": "구글연결",
						"url": "http://google.com"
					},
					{
						"text": "버튼3"
					}
				],
				"kind": "Content"
			}
		],
		"buttons": [
			null,
			null
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('edu0');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
