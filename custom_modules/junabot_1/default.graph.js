


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "인사"
			},
			{
				"intent": "다섯 단어 문장"
			},
			{
				"intent": "스무 단어 문장"
			},
			{
				"intent": "한글자긍정"
			}
		],
		"output": [
			{
				"text": "응안녕~~~~",
				"kind": "Text"
			}
		],
		"name": "인사",
		"children": [
			{
				"name": "근황",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"text": "요즘 뭐"
					},
					{
						"text": "머"
					},
					{
						"text": "뭐 살"
					}
				],
				"output": [
					{
						"text": "오버워치나 하고있지 에임연습을 좀 해야해;",
						"image": {
							"url": "/files/junabot_11500951712426.jpg",
							"displayname": "maxresdefault.jpg"
						},
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "잘해?",
						"id": "default3",
						"filename": "default",
						"input": [
							{
								"text": "너 게임 잘하다"
							},
							{
								"text": "너 잘하다"
							},
							{
								"text": "얼마나 해"
							}
						],
						"output": [
							{
								"text": "브론즈다 이새꺄",
								"kind": "Text"
							}
						],
						"children": [
							{
								"name": "비웃음",
								"id": "default9",
								"filename": "default",
								"input": [
									{
										"text": "ㅋ"
									},
									{
										"text": "좆밥"
									},
									{
										"text": "잦다 밥"
									},
									{
										"intent": "욕"
									}
								],
								"output": [
									{
										"text": "욕하지마라 야 넌 나보다 못하는거 다 아는데",
										"kind": "Text"
									}
								],
								"children": [
									{
										"name": "dialog_default11",
										"id": "default11",
										"filename": "default",
										"input": [
											{
												"regexp": "(.*)"
											}
										],
										"output": [
											{
												"text": "닥쵸닥쵸",
												"kind": "Text"
											}
										]
									}
								]
							},
							{
								"name": "괜찮아",
								"id": "default10",
								"filename": "default",
								"input": [
									{
										"text": "하다 수 잇다"
									},
									{
										"text": "괜찮다"
									},
									{
										"text": "힘내다"
									},
									{
										"text": "잘하다"
									}
								],
								"output": [
									{
										"kind": "Action",
										"up": "1",
										"type": "Up"
									}
								]
							}
						]
					},
					{
						"name": "dialog_default6",
						"id": "default6",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "2"
							},
							{
								"text": "3"
							},
							{
								"text": "4"
							},
							{
								"text": "5"
							},
							{
								"text": "6"
							},
							{
								"text": "7"
							},
							{
								"text": "8"
							},
							{
								"text": "9"
							}
						],
						"output": [
							{
								"text": "실험실험",
								"kind": "Text"
							}
						],
						"children": [
							{
								"name": "우우에겍",
								"id": "default7",
								"filename": "default",
								"input": [
									{
										"text": "나 전설"
									}
								],
								"output": [
									{
										"kind": "Action",
										"call": "인사"
									}
								]
							},
							{
								"name": "콜백",
								"id": "default8",
								"filename": "default",
								"input": [
									{
										"text": "죽다"
									},
									{
										"text": "디지다"
									}
								],
								"output": [
									{
										"kind": "Action",
										"callChild": "인사"
									}
								]
							}
						]
					}
				]
			},
			{
				"name": "엔터티실험",
				"id": "default12",
				"filename": "default",
				"input": [
					{
						"entities": [
							"@도시"
						]
					}
				],
				"output": [
					{
						"text": "그 도시에 누가 사는 줄 아니~~",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "Task",
						"id": "default13",
						"filename": "default",
						"input": [
							{
								"types": [
									"listType"
								]
							}
						],
						"output": [
							{
								"text": "+listType.value+",
								"kind": "Text"
							}
						],
						"task": {
							"name": "testTask"
						}
					}
				]
			}
		]
	},
	{
		"name": "무시",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "그래서"
			},
			{
				"text": "어쩌라고"
			},
			{
				"text": "어떻다 하라"
			}
		],
		"output": [
			{
				"kind": "Action",
				"repeat": "1",
				"type": "Repeat"
			}
		]
	},
	{
		"name": "나머지",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"regexp": "(.*)"
			}
		],
		"output": [
			{
				"text": "야 그런 쓸데없는 소리 하지 말고 인사나 해줘",
				"kind": "Text"
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
			"text": "난 준하의 클론이야.",
			"kind": "Text"
		},
		"inRaw": "어쩌라고",
		"inNLP": "어쩌라고"
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
var _bot = require(require('path').resolve("./engine/core/bot")).getBot('junabot_1');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
