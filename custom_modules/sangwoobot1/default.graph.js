


var dialogs = [
	{
		"name": "남성 선택",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "1"
			},
			{
				"text": "남자"
			}
		],
		"output": [
			{
				"text": "본인의 나이대를 선택해주세요.\n1. ~ 20\n2. 21 ~",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "10대",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"text": ""
					}
				],
				"output": [
					{
						"text": "아래 중 본인의 이상형에 가까운 사람을 선택해주세요.\n\n1. 아이유 (IU)\n2. 이수현 (악동뮤지션)",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "아이유",
						"id": "default9",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "아이유"
							}
						],
						"output": [
							{
								"text": "당신이 찾는 이상형입니다!",
								"image": {
									"url": "/files/sangwoobot11500955965810.jpg",
									"displayname": "20130109153846_003.jpg"
								},
								"buttons": [],
								"kind": "Content"
							}
						],
						"buttons": []
					},
					{
						"name": "이수현",
						"id": "default10",
						"filename": "default",
						"input": [
							{
								"text": "2"
							},
							{
								"text": "이수현"
							}
						],
						"output": [
							{
								"text": "당신이 찾는 이상형입니다!",
								"image": {
									"url": "/files/sangwoobot11500956192162.jpg",
									"displayname": "images.jpg"
								},
								"kind": "Content"
							}
						]
					}
				]
			},
			{
				"name": "20대",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"text": ""
					}
				],
				"output": [
					{
						"text": "아래 중 본인의 이상형에 가까운 사람을 선택해주세요.\n\n1. 태연\n2. 에일리",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "태연",
						"id": "default11",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "태연"
							}
						],
						"output": [
							{
								"text": "당신이 찾는 이상형입니다!",
								"image": {
									"url": "/files/sangwoobot11500956285277.jpg",
									"displayname": "5.jpg"
								},
								"buttons": [
									{
										"text": ""
									}
								],
								"kind": "Content"
							}
						],
						"buttons": [
							null
						]
					},
					{
						"name": "에일리",
						"id": "default12",
						"filename": "default",
						"input": [
							{
								"text": "2"
							},
							{
								"text": "에일리"
							}
						],
						"output": [
							{
								"text": "당신이 찾는 이상형입니다!",
								"image": {
									"url": "/files/sangwoobot11500956327979.jpg",
									"displayname": "a0334634_5360aa68ef353.jpg"
								},
								"kind": "Content"
							}
						]
					}
				]
			}
		]
	},
	{
		"name": "여성 선택",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "2"
			},
			{
				"text": "여자"
			}
		],
		"output": [
			{
				"text": "본인의 나이대를 선택해주세요.\n1. ~ 20\n2. 21 ~",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "10대",
				"id": "default7",
				"filename": "default",
				"input": [
					{
						"text": ""
					}
				],
				"output": [
					{
						"text": "여자버전은 준비중입니다.",
						"image": {
							"url": "/files/sangwoobot11500955746456.jpg",
							"displayname": "민우.jpg"
						},
						"buttons": [],
						"kind": "Content"
					}
				],
				"buttons": []
			},
			{
				"name": "20대",
				"id": "default8",
				"filename": "default",
				"input": [
					{
						"text": ""
					}
				],
				"output": [
					{
						"text": "여자버전은 준비중입니다.",
						"image": {
							"url": "/files/sangwoobot11500956435252.jpg",
							"displayname": "민우.jpg"
						},
						"kind": "Content"
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
		"output": [
			{
				"text": "지구상 운명의 이상형 찾기 시작!\n\n본인의 성별을 선택해주세요.\n\n1. 남자\n2. 여자",
				"kind": "Text"
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('sangwoobot1');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
