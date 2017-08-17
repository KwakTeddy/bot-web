


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
			}
		],
		"output": {
			"text": "상품검색을 시작하겠습니다.",
			"kind": "Text"
		},
		"name": "상품검색"
	},
	{
		"name": "휴대폰인증여부분류",
		"id": "default36",
		"filename": "default",
		"input": [
			{
				"text": "조회"
			},
			{
				"text": "주문"
			},
			{
				"text": "배송"
			},
			{
				"text": "2"
			}
		],
		"output": [
			{
				"if": "context.user.mobile",
				"kind": "Action",
				"call": "주문목록"
			},
			{
				"kind": "Action",
				"if": "true",
				"call": "휴대폰인증1"
			}
		]
	},
	{
		"name": "휴대폰인증1",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": ""
			}
		],
		"output": {
			"text": "주문 목록 및 / 배송 조회를 하기 위해서는 고객님께서 쇼핑몰에 가입하실 때 입력하신 휴대폰 인증이 필요합니다. \n\n가입하실때 입력하신 휴대폰 번호를 입력해주세요.\n(예. 010-9999-9999)",
			"kind": "Text"
		},
		"children": [
			{
				"name": "휴대폰형식",
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
						"if": "context.dialog.signed==1",
						"kind": "Action",
						"call": "가입자인증"
					}
				],
				"children": [
					{
						"name": "가입자인증",
						"id": "default6",
						"filename": "default",
						"input": [
							{}
						],
						"output": {
							"text": "고객님께서 입력하신 +mobile+ 번호로 4자리 인증번호가 문자로 발송되었습니다. \n\n문자로 받으신 4자리 인증번호를 입력해주세요. \n문자를 받지 못한 경우에는 \"재발송\"이라고 입력해주세요.",
							"kind": "Text"
						},
						"children": [
							{
								"name": "인증번호확인",
								"id": "default20",
								"filename": "default",
								"input": [
									{
										"regexp": "(.*)"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "dialog.inRaw == context.dialog.smsAuth",
										"call": "주문목록",
										"type": "Call"
									},
									{
										"kind": "Action",
										"if": "true",
										"call": "인증실패",
										"options": {
											"output": ""
										},
										"type": "Call"
									}
								]
							},
							{
								"name": "주문목록",
								"id": "default8",
								"filename": "default",
								"input": [
									{}
								],
								"output": [
									{
										"text": "[+mobile+님의 주문 목록]\n\n#order#+index+. [+status+] +text+\n#\n상세한 정보를 보고싶으신 항목을 선택해주세요.\n목록에 없는 상품은 1:1문의로 문의 주세요.",
										"kind": "Text"
									}
								],
								"task": {
									"name": "orderList",
									"kind": "Text"
								},
								"children": [
									{
										"name": "배송상태분류",
										"id": "default11",
										"filename": "default",
										"input": [
											{
												"types": [
													"orderListType"
												]
											}
										],
										"output": [
											{
												"kind": "Action",
												"if": "context.dialog.orderListType.status.search(/배송완료/) != -1",
												"call": "배송완료상품"
											},
											{
												"kind": "Action",
												"if": "context.dialog.orderListType.status.search(/배송중/) != -1",
												"call": "배송중상품"
											},
											{
												"kind": "Action",
												"if": "context.dialog.orderListType.status.search(/ACCEPT/) != -1",
												"call": "배송대기중상품"
											}
										]
									},
									{
										"name": "배송완료상품",
										"id": "default17",
										"filename": "default",
										"input": [
											{
												"text": ""
											}
										],
										"output": {
											"text": "[+orderListType.order_simplestatus+]\n\n+orderListType.order_product+\n\n환불이나 교환을 원하실 경우 선택해주세요.\n1.환불\n2.교환",
											"kind": "Text"
										},
										"children": [
											{
												"name": "환불",
												"id": "default22",
												"filename": "default",
												"input": [
													{
														"text": "환불"
													},
													{
														"text": "1"
													}
												],
												"output": [
													{
														"text": "[환불 접수]\n\n- 상품명 : +orderListType.order_product+\n- 주문 내용 : +orderListType.order_content+\n- 주문 일자 : +orderListType.order_date+\n- 배송주소 : +orderListType.order_address+\n- 현황 : 배송 완료\n- 배송 완료일: +orderListType.order_expecteddate+\n\n위 상품을 환불하시겠습니까?",
														"kind": "Text"
													}
												],
												"children": [
													{
														"name": "환불사유",
														"id": "default23",
														"filename": "default",
														"input": [
															{
																"text": "응"
															}
														],
														"output": [
															{
																"text": "환불 사유를 입력해주세요.",
																"kind": "Text"
															}
														],
														"children": [
															{
																"name": "상품회수지",
																"id": "default24",
																"filename": "default",
																"input": [
																	{
																		"types": [
																			"reason"
																		]
																	}
																],
																"output": [
																	{
																		"text": "환불사유 : +reason+\n\n상품회수지를 입력해주세요.",
																		"kind": "Text"
																	}
																],
																"children": [
																	{
																		"name": "환불최종확인",
																		"id": "default25",
																		"filename": "default",
																		"input": [
																			{
																				"types": [
																					"address2"
																				]
																			}
																		],
																		"output": [
																			{
																				"text": "환불 사유 : +reason+\n상품회수지 : +address2+\n\n위 내용으로 진행하겠습니까?",
																				"kind": "Text"
																			}
																		],
																		"children": [
																			{
																				"name": "환불완료",
																				"id": "default26",
																				"filename": "default",
																				"input": [
																					{
																						"text": "응"
																					}
																				],
																				"output": [
																					{
																						"text": "환불신청이 접수되었습니다.",
																						"kind": "Text"
																					}
																				]
																			}
																		]
																	}
																]
															}
														]
													}
												]
											},
											{
												"name": "교환",
												"id": "default21",
												"filename": "default",
												"input": [
													{
														"text": "2"
													},
													{
														"text": "교환"
													}
												],
												"output": [
													{
														"text": "[환불 접수]\n\n- 상품명 : +orderListType.order_product+\n- 주문 내용 : +orderListType.order_content+\n- 주문 일자 : +orderListType.order_date+\n- 배송주소 : +orderListType.order_address+\n- 현황 : 배송 완료\n- 배송 완료일: +orderListType.order_expecteddate+\n\n위 상품을 교환하시겠습니까?",
														"kind": "Text"
													}
												],
												"children": [
													{
														"name": "교환옵션선택",
														"id": "default27",
														"filename": "default",
														"input": [
															{
																"text": "응"
															}
														],
														"output": [
															{
																"text": "교환하실 옵션을 입력해주세요.\n(현재옵션 : +orderListType.order_content+)",
																"kind": "Text"
															}
														],
														"children": [
															{
																"name": "교환확인",
																"id": "default28",
																"filename": "default",
																"input": [
																	{
																		"types": [
																			"option"
																		]
																	}
																],
																"output": [
																	{
																		"text": "상품명 : +orderListType.order_product+\n현재옵션 : +orderListType.order_content+\n변경할 옵션 : +option+\n\n위 내용대로 교환신청을 접수하시겠습니까?",
																		"kind": "Text"
																	}
																],
																"children": [
																	{
																		"name": "교환신청완료",
																		"id": "default29",
																		"filename": "default",
																		"input": [
																			{
																				"text": "응"
																			}
																		],
																		"output": [
																			{
																				"text": "교환신청이 완료되었습니다.",
																				"kind": "Text"
																			}
																		]
																	}
																]
															}
														]
													}
												]
											}
										],
										"inRaw": "1",
										"inNLP": "1",
										"task": {
											"kind": "Text"
										}
									},
									{
										"name": "배송중상품",
										"id": "default30",
										"filename": "default",
										"input": [
											{
												"text": ""
											}
										],
										"output": [
											{
												"text": "[+orderListType.order_simplestatus+]\n\n+orderListType.order_product+\n\n배송예정일은 +orderListType.order_expecteddate+ 입니다.",
												"kind": "Text"
											}
										]
									},
									{
										"name": "배송대기중상품",
										"id": "default19",
										"filename": "default",
										"input": [
											{}
										],
										"output": [
											{
												"text": "[+orderListType.status+]\n+orderListType.text+\n\n(*배송 대기 중인 상품은 주문 취소및 변경이 가능합니다. 필요한 경우 \n1.취소 2.변경 을 입력해주세요)",
												"kind": "Text"
											}
										],
										"children": [
											{
												"name": "주문취소",
												"id": "default31",
												"filename": "default",
												"input": [
													{
														"text": "1"
													},
													{
														"text": "취소"
													}
												],
												"output": [
													{
														"text": "[+orderListType.status+]\n+orderListType.text+\n\n위 주문을 취소하겠습니까?",
														"kind": "Text"
													}
												],
												"children": [
													{
														"name": "주문취소완료",
														"id": "default32",
														"filename": "default",
														"input": [
															{
																"text": "응"
															}
														],
														"output": [
															{
																"text": "주문이 정상 취소되었습니다.",
																"kind": "Text"
															}
														],
														"task": {
															"name": "orderCancle"
														}
													}
												]
											},
											{
												"name": "변경옵션선택",
												"id": "default33",
												"filename": "default",
												"input": [
													{
														"text": "2"
													},
													{
														"text": "변경"
													}
												],
												"output": [
													{
														"text": "주문을 변경하시겠습니까? 원하시는 변경 옵션을 입력해주세요.\n(현재옵션 : +orderListType.order_content+)",
														"kind": "Text"
													}
												],
												"children": [
													{
														"name": "변경옵션확인",
														"id": "default34",
														"filename": "default",
														"input": [
															{
																"types": [
																	"option"
																]
															}
														],
														"output": [
															{
																"text": "상품명 : +orderListType.order_product+\n현재옵션 : +orderListType.order_content+\n변경할 옵션 : +option+\n\n위 내용대로 주문을 변경하시겠습니까?",
																"kind": "Text"
															}
														],
														"children": [
															{
																"name": "옵션변경완료",
																"id": "default35",
																"filename": "default",
																"input": [
																	{
																		"text": "응"
																	}
																],
																"output": [
																	{
																		"text": "주문 옵션이 변경되었습니다.",
																		"kind": "Text"
																	}
																]
															}
														]
													}
												]
											}
										],
										"inRaw": "3",
										"inNLP": "3"
									}
								],
								"inRaw": "6096",
								"inNLP": "6096"
							},
							{
								"name": "인증실패",
								"id": "default9",
								"filename": "default",
								"input": [
									{
										"if": " true"
									}
								],
								"output": {
									"text": "인증실패했습니다. 인증번호를 재발송 하시겠습니까?\n\n1. 인증번호 재발송\n0. 처음으로",
									"kind": "Text"
								},
								"children": [
									{
										"name": "인증번호 재발송",
										"id": "default10",
										"filename": "default",
										"input": [
											{
												"text": "1"
											},
											{
												"text": "재 발송"
											}
										],
										"output": {
											"kind": "Action",
											"call": "가입자인증"
										}
									}
								]
							}
						],
						"inRaw": "01092597716",
						"inNLP": "01092597716",
						"task": {
							"name": "smsAuth",
							"mobile": "01092597716",
							"_result": "SUCCESS",
							"kind": "Text"
						}
					},
					{
						"name": "미가입자",
						"id": "default7",
						"filename": "default",
						"input": [],
						"output": {
							"kind": "Text"
						}
					}
				],
				"task": "signcheck"
			},
			{
				"name": "휴대폰아님",
				"id": "default4",
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
						"output": "다시 입력하세요"
					}
				}
			}
		],
		"inRaw": "2",
		"inNLP": "2",
		"task": {
			"kind": "Text"
		}
	},
	{
		"name": "문의하기",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "3"
			},
			{
				"text": "문의"
			}
		],
		"output": {
			"text": "문의해주세요!",
			"kind": "Text"
		}
	},
	{
		"name": "바로반품",
		"id": "default37",
		"filename": "default",
		"input": [
			{
				"text": "반품"
			}
		],
		"output": [
			{
				"kind": "Text"
			}
		]
	},
	{
		"name": "바로메뉴더미",
		"id": "default38",
		"filename": "default",
		"input": [
			{}
		],
		"output": [
			{
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "바로반품목록",
				"id": "default39",
				"filename": "default",
				"input": [
					{}
				],
				"output": [
					{
						"text": "바로반품목록입니다.",
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
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('taobao');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
