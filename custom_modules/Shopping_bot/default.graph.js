


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "조회"
			}
		],
		"output": "배송조회를 진행하겠습니다. \n조회를 위해서는 휴대폰 인증이 필요합니다. \n가입하실때 사용하신 휴대폰 번호를 입력해주세요.",
		"name": "배송조회",
		"children": [
			{
				"name": "휴대폰인증",
				"id": "default1",
				"filename": "default",
				"input": [
					{
						"types": [
							"mobileType"
						]
					}
				],
				"output": "배송 진행 상황입니다.\n\n#order#+index+. [+order_simplestatus+] +order_product+\n#\n상세한 정보를 보고싶은 번호를 입력해주세요.",
				"task": "orderlist",
				"children": [
					{
						"name": "dialog_default3",
						"id": "default3",
						"filename": "default",
						"input": [
							{
								"types": [
									"listType"
								]
							}
						],
						"output": "[+listType.order_product+]  \n\n주소: +listType.order_adress+  \n\n배송진행상황: +listType.order_status+  \n\n배송예정일: +listType.order_expecteddate+"
					},
					{
						"name": "dialog_default4",
						"id": "default4",
						"filename": "default",
						"input": [
							{
								"if": " true"
							}
						],
						"output": {
							"text": "조회하고싶으신 리스트 중에 선택해주세요.",
							"kind": "Text"
						}
					}
				]
			},
			{
				"name": "dialog_default2",
				"id": "default2",
				"filename": "default",
				"input": [
					{
						"if": " true"
					}
				],
				"output": {
					"kind": "Action",
					"repeat": "1",
					"options": {
						"output": "휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요."
					}
				}
			}
		]
	},
	{
		"name": "주문취소",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"text": "취소"
			}
		],
		"output": "주문취소를 진행하겠습니다. \n주문 취소를 위해서는 휴대폰 인증이 필요합니다. \n가입하실때 사용하신 휴대폰 번호를 입력해주세요.",
		"children": [
			{
				"name": "휴대폰인증",
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"types": [
							"mobileType"
						]
					}
				],
				"output": "주문한 상품 목록입니다.\n\n#order#+index+. [+order_simplestatus+] +order_product+\n#\n주문 취소를 원하는 번호를 입력해주세요.",
				"task": "orderlist",
				"children": [
					{
						"name": "dialog_default8",
						"id": "default8",
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
								"if": "context.dialog.orderstatuscheck == 1",
								"output": "배송중인 상품은 취소가 불가능합니다.\n배송 완료 이후 반품신청을 해주세요."
							},
							{
								"if": "context.dialog.orderstatuscheck == 2",
								"output": "주문취소신청 처리 되었습니다. 감사합니다."
							}
						],
						"task": "checkorderstatus"
					},
					{
						"name": "dialog_default9",
						"id": "default9",
						"filename": "default",
						"input": [
							{
								"if": " true"
							}
						],
						"output": {
							"repeat": "1",
							"options": {
								"output": "조회하고싶으신 리스트 중에 선택해주세요."
							}
						}
					}
				]
			},
			{
				"name": "dialog_default7",
				"id": "default7",
				"filename": "default",
				"input": [
					{
						"if": " true"
					}
				],
				"output": {
					"kind": "Action",
					"repeat": "1",
					"options": {
						"output": "휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요."
					}
				}
			}
		]
	},
	{
		"name": "상품검색",
		"id": "default10",
		"filename": "default",
		"input": [
			{
				"text": "검색"
			}
		],
		"output": "아래는 상품 카테고리입니다.\n찾으시는 상품이 속한 카테고리를 선택해주세요.\n\n#category#+index+. +category_name+\n#",
		"task": {
			"name": "categorylist"
		},
		"children": [
			{
				"name": "dialog_default11",
				"id": "default11",
				"filename": "default",
				"input": [
					{
						"types": [
							"listType2"
						]
					}
				],
				"output": "카테고리에 속한 상품 목록입니다.\n\n#items#+index+. +item_name+\n#\n상세 정보를 보고 싶으신 상품을 선택해주세요.",
				"task": "itemlist",
				"children": [
					{
						"name": "dialog_default13",
						"id": "default13",
						"filename": "default",
						"input": [
							{
								"types": [
									"listType3"
								]
							}
						],
						"output": "[+listType3.item_name+]\n+listType3.item_summary+\n\n가격: +listType3.item_price+\n색상: +listType3.item_color+\n사이즈: +listType3.item_size+\n재고: +listType3.item_stock+\n입고예정일: +listType3.item_restock_date+",
						"task": "itemdetail"
					}
				]
			},
			{
				"name": "dialog_default12",
				"id": "default12",
				"filename": "default",
				"input": [
					{
						"if": " true"
					}
				],
				"output": {
					"repeat": "1",
					"options": {
						"output": "카테고리를 선택해주세요."
					}
				}
			}
		]
	}
];

var commonDialogs = [
	{
		"id": "defaultcommon0",
		"filename": "defaultcommon",
		"name": "시작",
		"input": [],
		"output": {
			"buttons": [
				{
					"text": "배송조회"
				},
				{
					"text": "주문취소"
				},
				{
					"text": "상품검색"
				}
			],
			"output": "안녕하세요 쇼핑봇입니다.\n배송조회, 주문취소, 상품검색 기능을 이용하실 수 있습니다.",
			"text": "안녕하세요 쇼핑봇입니다.\n배송조회, 주문취소, 상품검색 기능을 이용하실 수 있습니다."
		}
	},
	{
		"id": "defaultcommon1",
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
var _bot = require(require('path').resolve("config/lib/bot")).getBot('Shopping_bot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
