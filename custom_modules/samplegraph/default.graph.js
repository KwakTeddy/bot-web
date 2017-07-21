


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
				"text": "입력을 선택 했습니다.",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "dialog_default3",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"intent": "테스트인텐트"
					}
				],
				"output": [
					{
						"text": "다양한 표현을 인텐트로 입력했습니다.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "엔터티",
				"id": "default4",
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
						"text": "개체명을 엔터티로 입력했습니다.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "타입",
				"id": "default5",
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
						"text": "휴대폰번호 타입 +mobile+",
						"kind": "Text"
					}
				]
			},
			{
				"name": "정규식",
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"regexp": "(.?) 번"
					}
				],
				"output": [
					{
						"text": "정규식으로 입력 +1+",
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
						"if": "false"
					}
				],
				"output": [
					{
						"text": "if 조건",
						"kind": "Text"
					}
				]
			}
		]
	},
	{
		"name": "출력",
		"id": "default8",
		"filename": "default",
		"input": [
			{
				"text": "출력"
			}
		],
		"output": [
			{
				"text": "출력을 선택했습니다.",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "dialog_default9",
				"id": "default9",
				"filename": "default",
				"input": [
					{
						"text": "문장"
					}
				],
				"output": [
					{
						"text": "문장으로 출력합니다.",
						"kind": "Text"
					},
					{
						"text": "문장이 여러게 될 수 있음",
						"kind": "Text"
					}
				]
			},
			{
				"name": "dialog_default10",
				"id": "default10",
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
							"url": "/files/samplegraph1500518613098.jpg",
							"displayname": "erl5td_640x640_s.jpg"
						},
						"kind": "Content"
					}
				]
			},
			{
				"name": "dialog_default11",
				"id": "default11",
				"filename": "default",
				"input": [
					{
						"text": "버튼"
					}
				],
				"output": {
					"text": "버튼이 표시 됩니다.",
					"buttons": [
						{
							"text": "버튼1",
							"url": ""
						},
						{
							"text": "구글연결",
							"url": "http://www.google.com"
						}
					],
					"kind": "Content"
				},
				"inRaw": "버튼 호출",
				"inNLP": "버튼 호출",
				"buttons": [
					null,
					null
				]
			}
		]
	},
	{
		"name": "DM",
		"id": "default12",
		"filename": "default",
		"input": [
			{
				"text": "대화"
			}
		],
		"output": [
			{
				"text": "대화 관리 입니다.",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "dialog_default13",
				"id": "default13",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": [
					{
						"text": "Child",
						"kind": "Text"
					}
				]
			},
			{
				"name": "dialog_default14",
				"id": "default14",
				"filename": "default",
				"input": [
					{
						"text": "버튼 호출"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "dialog_default11"
					}
				]
			},
			{
				"name": "dialog_default16",
				"id": "default16",
				"filename": "default",
				"input": [
					{
						"text": "상위"
					}
				],
				"output": [
					{
						"kind": "Action",
						"up": "1"
					}
				]
			},
			{
				"name": "dialog_default15",
				"id": "default15",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "다시 입력해주세요."
						}
					}
				]
			}
		]
	},
	{
		"name": "dialog_default17",
		"id": "default17",
		"filename": "default",
		"input": [
			{
				"text": "테스 크다"
			}
		],
		"output": [
			{
				"text": "타입과 테스크 입니다",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "dialog_default20",
				"id": "default20",
				"filename": "default",
				"input": [
					{
						"types": [
							"testType"
						]
					}
				],
				"output": [
					{
						"text": "커스텀 테스크 \n+test+",
						"kind": "Text"
					}
				],
				"task": {
					"name": "testTask"
				}
			},
			{
				"name": "",
				"id": "default26",
				"filename": "default",
				"input": [
					{
						"types": [
							"binType"
						]
					}
				],
				"output": [
					{
						"text": "리스트\n#list1#+index+. +title+\n#",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "",
						"id": "default27",
						"filename": "default",
						"input": [
							{
								"types": [
									"listType1"
								]
							}
						],
						"output": [
							{
								"text": "제목: +listType1.title+\n내용: +listType1.content+",
								"kind": "Text"
							}
						]
					}
				]
			},
			{
				"name": "dialog_default23",
				"id": "default23",
				"filename": "default",
				"input": [
					{
						"types": [
							"mongoType1"
						]
					}
				],
				"output": [
					{
						"text": "리스트 입니다. \n#list2#+index+. +title+\n#",
						"kind": "Text"
					}
				],
				"task": "listTask1",
				"children": [
					{
						"name": "dialog_default24",
						"id": "default24",
						"filename": "default",
						"input": [
							{
								"types": [
									"listType2"
								]
							}
						],
						"output": [
							{
								"text": "제목: +listType2.title+\n내용: +listType2.content+",
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
		"output": "samplegraph 입니다."
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
		"input": [
			{
				"text": ""
			}
		],
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('samplegraph');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
