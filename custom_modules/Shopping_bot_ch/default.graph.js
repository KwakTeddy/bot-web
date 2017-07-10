


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "查询"
			},
			{
				"text": "配送查询"
			}
		],
		"output": [
			"正在进行配送查询.\n进行查询需要输入手机号码. \n请输入注册会员时使用的手机号码.",
			{
				"if": "context.user.mobile",
				"output": {
					"call": "목록휴대폰인증"
				}
			}
		],
		"name": "배송조회",
		"children": [
			{
				"name": "목록휴대폰인증",
				"id": "default1",
				"filename": "default",
				"input": [
					{
						"types": [
							"mobile"
						]
					}
				],
				"output": "配送状态.\n(手机数: +mobile+)\n\n#order#+index+. [+order_simplestatus+] +order_product+\n#\n请输入想要查看详细内容的编号. +title+",
				"task": {
					"name": "orderlist"
				},
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
						"output": "[+listType.order_product+]  \n\n주소: +listType.order_adress+  \n\n配送进行状态: +listType.order_status+  \n\n预计到达日: +listType.order_expecteddate+"
					},
					{
						"name": "dialog_default22",
						"id": "default22",
						"filename": "default",
						"input": [
							{
								"text": "号码"
							}
						],
						"output": "+mobile+"
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
							"text": "请选择想要查询的列表.",
							"kind": "Text"
						}
					}
				],
				"inRaw": "配送查询",
				"inNLP": "配送查询"
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
						"output": "手机号码格式错误.\n请输入正确的额手机号码."
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
				"text": "取消"
			},
			{
				"text": "订单取消"
			}
		],
		"output": [
			"将取消订单. \n取消订单需验证手机号码. \n请输入注册会员时使用的手机号码.",
			{
				"if": "context.user.mobile",
				"output": {
					"call": "취소휴대폰"
				}
			}
		],
		"children": [
			{
				"name": "취소휴대폰",
				"id": "default6",
				"filename": "default",
				"input": [
					{
						"types": [
							"mobile"
						]
					}
				],
				"output": "预订商品目录.\n\n#order#+index+. [+order_simplestatus+] +order_product+\n#\n请输入想要取消订单的号码.",
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
								"output": "配送中的商品不能取消订单.\n请在配送结束后申请退货."
							},
							{
								"if": "context.dialog.orderstatuscheck == 2",
								"output": "取消订单成功，谢谢."
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
								"output": "请选择希望查询的列表."
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
						"output": "手机号码格式错误.\n请输入正确的是手机号码."
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
				"text": "搜索"
			},
			{
				"text": "商品检索"
			}
		],
		"output": "下面是商品种类.\n请选择需要查询商品的种类.\n\n#category#+index+. +category_name+\n#",
		"task": "categorylist",
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
				"output": "相关种类商品目录.\n\n#items#+index+. +item_name+\n#\n想要查看具体信息请选择商品.",
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
						"output": "[+listType3.item_name+]\n+listType3.item_summary+\n\n价格: +listType3.item_price+\n颜色: +listType3.item_color+\n尺寸: +listType3.item_size+\n库存: +listType3.item_stock+\n预计入库日期: +listType3.item_restock_date+",
						"task": "itemdetail",
						"children": [
							{
								"name": "重新入库",
								"id": "default22",
								"filename": "default",
								"input": [
									{
										"text": "重新入库"
									},
									{
										"text": "通知"
									},
									{
										"text": "재 입다"
									}
								],
								"output": "[+listType3.item_name+]\n\n 已选择上述商品的再入库通知."
							}
						]
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
						"output": "请选择种类."
					}
				}
			}
		]
	},
	{
		"name": "주문변경",
		"id": "default14",
		"filename": "default",
		"input": [
			{
				"text": "修改订单"
			},
			{
				"text": "订单修改"
			}
		],
		"output": {
			"text": "请选择修改内容\n\n商品选项变更\n配送地变更",
			"buttons": [],
			"kind": "Content"
		},
		"children": [
			{
				"name": "选项变更",
				"id": "default15",
				"filename": "default",
				"input": [
					{
						"text": "选项"
					},
					{
						"text": "商品选项变更"
					}
				],
				"output": "预订商品目录.\n\n#order#+index+. [+order_simplestatus+] +order_product+\n#\n请选择需要变更目录的号码.",
				"task": "orderlist",
				"children": [
					{
						"name": "dialog_default17",
						"id": "default17",
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
								"output": "配送中商品不能取消.\n请在配送结束后申请退货."
							},
							{
								"if": "context.dialog.orderstatuscheck == 2",
								"output": "请选择想要修改的选项内容.\n(当前选项: +curr_option+)\n\n+options+",
								"children": [
									{
										"name": "选项修改结束",
										"id": "default31",
										"filename": "default",
										"input": [
											{
												"regexp": /(.*)/
											}
										],
										"output": "选项 +1+ 修改完成."
									}
								]
							}
						],
						"task": "checkorderstatus"
					}
				]
			},
			{
				"name": "配送地变更",
				"id": "default16",
				"filename": "default",
				"input": [
					{
						"text": "配送地"
					},
					{
						"text": "配送地变更"
					}
				],
				"output": "预订商品目录.\n\n#order#+index+. [+order_simplestatus+] +order_product+\n#\n请选择想要修改配送地的商品序号.",
				"task": "orderlist",
				"children": [
					{
						"name": "배송지 변경2",
						"id": "default18",
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
								"output": "十分抱歉，正在配送中的商品不能进行变更."
							},
							{
								"if": "context.dialog.orderstatuscheck == 2",
								"output": "请输入新配送地.",
								"children": [
									{
										"name": "dialog_default24",
										"id": "default24",
										"filename": "default",
										"input": [
											{
												"regexp": /(.*)/
											}
										],
										"output": "新配送地 \n\n+1+\n\n确认?",
										"children": [
											{
												"name": "变更结束",
												"id": "default30",
												"filename": "default",
												"input": [
													{
														"text": "是"
													}
												],
												"output": "新配送地已经变更为为配送地."
											}
										]
									}
								]
							}
						],
						"task": "checkorderstatus"
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
		"input": [],
		"output": {
			"text": "您好，我是购物机器人.\n欢迎使用配送查询，订单取消和商品检索功能.\n\n配送查询\n订单取消\n商品检索\n订单修改",
			"buttons": [],
			"kind": "Content"
		}
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "처음",
		"input": [
			{
				"text": "第一"
			}
		],
		"output": {
			"call": "시작"
		}
	},
	{
		"name": "이전",
		"id": "commondefault23",
		"filename": "defaultcommon",
		"input": [
			{
				"text": "以前"
			}
		],
		"output": {
			"kind": "Action",
			"up": "1"
		}
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('Shopping_bot_ch');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
