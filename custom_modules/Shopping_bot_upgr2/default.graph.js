


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "상품"
			},
			{
				"text": "검색"
			},
			{
				"text": "1"
			}
		],
		"output": [
			{
				"text": "상품검색입니다.",
				"kind": "Text"
			}
		],
		"name": "상품검색"
	},
	{
		"name": "주문목록",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "2"
			},
			{
				"text": "주문"
			},
			{
				"text": "목록"
			},
			{
				"text": "배송"
			},
			{
				"text": "조회"
			}
		],
		"output": [
			{
				"text": "주문 목록 및 / 배송 조회를 하기 위해서는 고객님께서 쇼핑몰에 가입하실 때 입력하신 휴대폰 인증이 필요합니다. \n\n가입하실때 입력하신 휴대폰 번호를 입력해주세요.\n(예. 010-9999-9999)",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "인증번호발송",
				"id": "default3",
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
						"text": "고객님께서 입력하신 010-9999-9999 번호로 4자리 인증번호가 문자로 발송되었습니다. \n\n문자로 받으신 4자리 인증번호를 입력해주세요. \n문자를 받지 못한 경우에는 \"재발송\"이라고 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "휴대폰번호재입력",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "주문목록",
						"options": {
							"output": "휴대폰번호 형식으로 입력해주세요"
						}
					}
				]
			}
		]
	},
	{
		"name": "문의하기",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "문의"
			},
			{
				"text": "3"
			}
		],
		"output": [
			{
				"text": "문의하기입니다.",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "",
				"id": "default5",
				"filename": "default",
				"input": [
					{
						"text": "여기"
					}
				],
				"output": [
					{
						"text": "ㅇㅁㄹㅇㄹ",
						"kind": "Text"
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
		"output": "안녕하세요. 머니브레인 쇼핑몰입니다. 아래의 메뉴중에서 원하시는 메뉴를 선택해주세요.\n\n1. 나만의 맟춤형 상품 검색\n2. 주문 목록 / 배송 조회\n3. 문의 하기"
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
var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('Shopping_bot_upgr2');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
