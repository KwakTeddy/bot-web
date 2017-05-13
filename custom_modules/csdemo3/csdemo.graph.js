
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var type = require(path.resolve('./modules/bot/action/common/type'));
var csdemo = require('./csdemo');
var pre = /(?:~이전페이지|~앞|^<$)/;
var next = /(?:~다음페이지|~뒤|^>$)/;
var up = /(?:^0$|이전)/
var first = /(?:~시작|~처음|^!$|취소)/

var dialogs = [
	{
		"id": "csdemo0",
		"filename": "csdemo",
		"input": [
			{
				"text": "출장 비"
			},
			{
				"text": "수리 비"
			},
			{
				"text": "비용"
			}
		],
		"output": [
			{
				"output": "출장비용은 15,000원 입니다.평일 18시이후 및 주말엔 18,000원 입니다.\n수리비, 부품비는 엔지니어 점검 후 안내해 드리고 있습니다.\n단, 품질보증 기간이내 정상 사용 중 발생된 기능/성능상의 하자의 경우 무상으로 조치됩니다."
			}
		],
		"name": "dialog_csdemo0"
	},
	{
		"id": "csdemo5",
		"filename": "csdemo",
		"name": "냉장고온도조절",
		"input": [
			{
				"text": "~냉장고 온도 조절"
			},
			{
				"text": "~냉장고 온도 설정"
			},
			{
				"text": "~냉장고 온도 어떻다"
			},
			{
				"text": "~냉장고 온도 싶다"
			}
		],
		"output": [
			{
				"output": "[답변]\n1. [잠금/풀림] 버튼을  2초 이상 길게 눌러 풀림 상태로 만듭니다.\n1초 이상 누를 시 잠금이 풀리는 모델도 있습니다.\n2. 냉동실은 \"냉동온도\", 냉장실은 \"냉장온도\" 버튼으로 원하는 온도로 조절 할 수 있습니다.\n3. 원하시는 온도로 조절하신 후 잠금/풀림 버튼을 누르시면 다시 자물쇠가 잠금그림으로 됩니다.\n\n답변이 유용한가요?"
			}
		],
		"children": [
			{
				"id": "csdemo1",
				"filename": "csdemo",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": [
					{
						"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
					}
				],
				"name": "dialog_csdemo1"
			},
			{
				"id": "csdemo4",
				"filename": "csdemo",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": [
					{
						"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
					}
				],
				"children": [
					{
						"id": "csdemo2",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"call": "예약"
							}
						],
						"name": "dialog_csdemo2"
					},
					{
						"id": "csdemo3",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
							}
						],
						"name": "dialog_csdemo3"
					}
				],
				"name": "dialog_csdemo4"
			}
		]
	},
	{
		"id": "csdemo10",
		"filename": "csdemo",
		"name": "에어컨온도조절",
		"input": [
			{
				"text": "~에어컨 온도 조절"
			},
			{
				"text": "~에어컨 온도 설정"
			},
			{
				"text": "~에어컨 온도 어떻다"
			},
			{
				"text": "~에어컨 온도 싶다"
			}
		],
		"output": [
			{
				"output": "[답변]\n에어컨은 기기의 버튼 또는 리모콘을 통해 온도조절을 할 수 있습니다.\n\n답변이 유용한가요?"
			}
		],
		"children": [
			{
				"id": "csdemo6",
				"filename": "csdemo",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": [
					{
						"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
					}
				],
				"name": "dialog_csdemo6"
			},
			{
				"id": "csdemo9",
				"filename": "csdemo",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": [
					{
						"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
					}
				],
				"children": [
					{
						"id": "csdemo7",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"call": "예약"
							}
						],
						"name": "dialog_csdemo7"
					},
					{
						"id": "csdemo8",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
							}
						],
						"name": "dialog_csdemo8"
					}
				],
				"name": "dialog_csdemo9"
			}
		]
	},
	{
		"id": "csdemo13",
		"filename": "csdemo",
		"input": [
			{
				"text": "온도 조절"
			},
			{
				"text": "온도 설정"
			},
			{
				"text": "온도 어떻다"
			},
			{
				"text": "온도 싶다"
			}
		],
		"output": [
			{
				"output": "어떤 제품의 온도조절 방법이 궁금하신가요?\n(냉장고 또는 에어컨)"
			}
		],
		"children": [
			{
				"id": "csdemo11",
				"filename": "csdemo",
				"input": [
					{
						"text": "~냉장고"
					}
				],
				"output": [
					{
						"call": "냉장고온도조절"
					}
				],
				"name": "dialog_csdemo11"
			},
			{
				"id": "csdemo12",
				"filename": "csdemo",
				"input": [
					{
						"text": "~에어컨"
					}
				],
				"output": [
					{
						"call": "에어컨온도조절"
					}
				],
				"name": "dialog_csdemo12"
			}
		],
		"name": "dialog_csdemo13"
	},
	{
		"id": "csdemo18",
		"filename": "csdemo",
		"input": [
			{
				"text": "~투인원 함께 ~약냉"
			}
		],
		"output": [
			{
				"output": "[답변]\n정속 투인원 모델(FNC*** / FNS*** 모델)은 스탠드형/벽걸이형 동시에 가동을 하게 되면 냉기가 약해질 수 있습니다.\n실외기에서 낼 수 있는 냉방 성능은 정해져 있고, 그 냉방 성능을 스탠드형과 벽걸이형이 나눠서 가집니다.\n하지만 최근에 개발되는 투인원(FNQ***)모델은 고효율 인버터 냉방 시스템을 적용하여 인버터 압축기의 회전수를 높여 100% 능력을 달성합니다.\n\n답변이 유용한가요?"
			}
		],
		"children": [
			{
				"id": "csdemo14",
				"filename": "csdemo",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": [
					{
						"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
					}
				],
				"name": "dialog_csdemo14"
			},
			{
				"id": "csdemo17",
				"filename": "csdemo",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": [
					{
						"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
					}
				],
				"children": [
					{
						"id": "csdemo15",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"call": "예약"
							}
						],
						"name": "dialog_csdemo15"
					},
					{
						"id": "csdemo16",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
							}
						],
						"name": "dialog_csdemo16"
					}
				],
				"name": "dialog_csdemo17"
			}
		],
		"name": "dialog_csdemo18"
	},
	{
		"id": "csdemo23",
		"filename": "csdemo",
		"input": [
			{
				"text": "Od"
			},
			{
				"text": "오디"
			}
		],
		"output": [
			{
				"output": "[답변]\n[Od]는 실외기 과열 감지 표시입니다.\n실외기 앞쪽 환기창이 열려있다 하더라도 갤러리 각도가 일직선이 되지 않거나 방충망이 닫혀있는 경우에도 발생할 수 있습니다.\n날씨가 더울 때는 갤러리 각도를 일직선으로 맞추고 방충망까지 열어주세요.\n실외기가 열을 받으면 냉각 능력이 떨어질 수 있습니다. \n\n답변이 유용한가요?"
			}
		],
		"children": [
			{
				"id": "csdemo19",
				"filename": "csdemo",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": [
					{
						"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
					}
				],
				"name": "dialog_csdemo19"
			},
			{
				"id": "csdemo22",
				"filename": "csdemo",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": [
					{
						"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
					}
				],
				"children": [
					{
						"id": "csdemo20",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"call": "예약"
							}
						],
						"name": "dialog_csdemo20"
					},
					{
						"id": "csdemo21",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
							}
						],
						"name": "dialog_csdemo21"
					}
				],
				"name": "dialog_csdemo22"
			}
		],
		"name": "dialog_csdemo23"
	},
	{
		"id": "csdemo28",
		"filename": "csdemo",
		"input": [
			{
				"text": "냉동 잘되다 냉장 안 돼다"
			},
			{
				"text": "냉장 실만"
			}
		],
		"output": [
			{
				"output": "[답변]\n냉동실 내부 결빙(성에)으로 냉장실 쪽으로 냉기가 순환이 안되어 나타나는 증상입니다.\n고객님이 직접 하실 수 있는 방법은 여유 냉장고로 음식물을 옮겨놓은 상태에서 제품의 전원을 끄고 냉동/냉장 도어를 활짝 열어 녹이는 방법이 있습니다.\n전원을 끄기 힘들다면 서비스 엔지니어 방문 점검이 필요합니다. 서비스 접수를 신청해주시기 바랍니다.\n\n답변이 유용한가요?"
			}
		],
		"children": [
			{
				"id": "csdemo24",
				"filename": "csdemo",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": [
					{
						"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
					}
				],
				"name": "dialog_csdemo24"
			},
			{
				"id": "csdemo27",
				"filename": "csdemo",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": [
					{
						"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
					}
				],
				"children": [
					{
						"id": "csdemo25",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"call": "예약"
							}
						],
						"name": "dialog_csdemo25"
					},
					{
						"id": "csdemo26",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
							}
						],
						"name": "dialog_csdemo26"
					}
				],
				"name": "dialog_csdemo27"
			}
		],
		"name": "dialog_csdemo28"
	},
	{
		"id": "csdemo42",
		"filename": "csdemo",
		"name": "예약",
		"input": [
			{
				"text": "출장"
			},
			{
				"text": "점검"
			},
			{
				"text": "예약"
			}
		],
		"output": [
			{
				"output": "출장 수리 예약을 하기 위하여, 간단한 정보 몇가지를 수집하도록 하겠습니다.\n출장 방문시 안내를 받으실 분의 성함을 입력해 주세요."
			}
		],
		"children": [
			{
				"id": "csdemo41",
				"filename": "csdemo",
				"input": [
					{
						"regexp": {}
					}
				],
				"output": [
					{
						"output": "저희 기사님께서 출장 방문시 연락드릴 휴대폰 번호를 입력해주세요."
					}
				],
				"children": [
					{
						"id": "csdemo39",
						"filename": "csdemo",
						"input": [
							{
								"types": [
									{
										"type": {
											"name": "mobile",
											"raw": true,
											"regexp": {}
										},
										"context": false
									}
								]
							}
						],
						"output": [
							{
								"output": "출장 방문을 하기 위해서는 고객님의 정확한 주소가 필요합니다.\n지번 또는 도로명을 포함한 상세주소를 입력 부탁드리겠습니다."
							}
						],
						"children": [
							{
								"id": "csdemo37",
								"filename": "csdemo",
								"input": [
									{
										"types": [
											{
												"name": "address",
												"raw": true
											}
										]
									}
								],
								"output": [
									{
										"output": "출장 수리를 받고 싶으신 날짜를 입력해주세요"
									}
								],
								"children": [
									{
										"id": "csdemo35",
										"filename": "csdemo",
										"input": [
											{
												"text": "월"
											},
											{
												"text": "일"
											},
											{
												"text": "내일"
											},
											{
												"text": "모레"
											},
											{
												"text": "오늘"
											},
											{
												"regexp": {}
											}
										],
										"output": [
											{
												"output": "고객님께서 지정하신 날짜에 출장 수리 예약이 가능한 시간 목록입니다. 원하시는 시간을 선택해주세요\n오전\n09:00 09:30 09:50\n10:10 10:30 11:00\n11:20 11:30 11:50\n오후\n12:00 12:30 12:50\n13:00 13:20 13:40\n15:00 15:10 15:50\n16:10 16:20 16:50\n17:00 17:20 17:40|원하시는 시간을 말씀해주세요."
											}
										],
										"children": [
											{
												"id": "csdemo33",
												"filename": "csdemo",
												"input": [
													{
														"types": [
															{
																"name": "time",
																"typeCheck": "timeTypeCheck",
																"raw": true
															}
														]
													}
												],
												"output": [
													{
														"output": "출장수리 예약이 완료되었습니다. \n더 필요하신 게 있으신가요?"
													}
												],
												"children": [
													{
														"id": "csdemo29",
														"filename": "csdemo",
														"input": [
															{
																"text": "~네"
															}
														],
														"output": [
															{
																"output": "고객님, 어떤 부분이 궁금하신가요?"
															}
														],
														"name": "dialog_csdemo29"
													},
													{
														"id": "csdemo32",
														"filename": "csdemo",
														"input": [
															{
																"text": "~아니요"
															}
														],
														"output": [
															{
																"output": "LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?"
															}
														],
														"children": [
															{
																"id": "csdemo30",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~네"
																	}
																],
																"output": [
																	{
																		"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
																	}
																],
																"name": "dialog_csdemo30"
															},
															{
																"id": "csdemo31",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~아니요"
																	}
																],
																"output": [
																	{
																		"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 LG전자이 되겠습니다.\nLG전자 콜센터 번호는 1577-7314입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다."
																	}
																],
																"name": "dialog_csdemo31"
															}
														],
														"name": "dialog_csdemo32"
													}
												],
												"name": "dialog_csdemo33"
											},
											{
												"id": "csdemo34",
												"filename": "csdemo",
												"input": [
													{
														"if": "true"
													}
												],
												"output": [
													{
														"repeat": 1,
														"options": {
															"output": "시간을 말씀해주세요.\n예시)14시, 오후 2시, 04:00"
														}
													}
												],
												"name": "dialog_csdemo34"
											}
										],
										"name": "dialog_csdemo35"
									},
									{
										"id": "csdemo36",
										"filename": "csdemo",
										"input": [
											{
												"if": "true"
											}
										],
										"output": [
											{
												"repeat": 1,
												"options": {
													"output": "방문 날짜를 말씀해주세요."
												}
											}
										],
										"name": "dialog_csdemo36"
									}
								],
								"name": "dialog_csdemo37"
							},
							{
								"id": "csdemo38",
								"filename": "csdemo",
								"input": [
									{
										"if": "true"
									}
								],
								"output": [
									{
										"repeat": 1,
										"options": {
											"output": "지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.|지번 또는 도로명을 포함한 상세주소를 말씀해주세요."
										}
									}
								],
								"name": "dialog_csdemo38"
							}
						],
						"name": "dialog_csdemo39"
					},
					{
						"id": "csdemo40",
						"filename": "csdemo",
						"input": [
							{
								"if": "true"
							}
						],
						"output": [
							{
								"repeat": 1,
								"options": {
									"output": "휴대폰 번호를 말씀해주세요."
								}
							}
						],
						"name": "dialog_csdemo40"
					}
				],
				"name": "dialog_csdemo41"
			}
		]
	},
	{
		"id": "csdemo101",
		"filename": "csdemo",
		"name": "냉장고약냉",
		"input": [
			{
				"text": "~냉장고 ~양문형 ~약냉"
			},
			{
				"text": "~냉장고 ~일반형 ~약냉"
			}
		],
		"task": "checktorefri",
		"output": [
			{
				"output": "온도 설정은 해보셨나요?"
			}
		],
		"children": [
			{
				"id": "csdemo94",
				"filename": "csdemo",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": [
					{
						"output": "냉장고 주변에 열기구가 있나요?"
					}
				],
				"children": [
					{
						"id": "csdemo47",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"output": "[답변] 설치 장소가 직사광선을 직접 받거나 가스레인지 등 열기구가 가까이 있으면 냉동기능이 약해질 수 있습니다.\n여름철 냉장고 문을 자주 열어 내부 온도가 상승하는 경우 냉동실의 냉기가 약해질 수 있습니다.\n\n답변이 유용한가요?"
							}
						],
						"children": [
							{
								"id": "csdemo43",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
									}
								],
								"name": "dialog_csdemo43"
							},
							{
								"id": "csdemo46",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
									}
								],
								"children": [
									{
										"id": "csdemo44",
										"filename": "csdemo",
										"input": [
											{
												"text": "~네"
											}
										],
										"output": [
											{
												"call": "예약"
											}
										],
										"name": "dialog_csdemo44"
									},
									{
										"id": "csdemo45",
										"filename": "csdemo",
										"input": [
											{
												"text": "~아니요"
											}
										],
										"output": [
											{
												"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
											}
										],
										"name": "dialog_csdemo45"
									}
								],
								"name": "dialog_csdemo46"
							}
						],
						"name": "dialog_csdemo47"
					},
					{
						"id": "csdemo92",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "음식물이 냉기 출구를 가리고 있지 않나요?"
							}
						],
						"children": [
							{
								"id": "csdemo52",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"output": "[답변] 선반에 보관한 음식이 많거나 냉장고 안쪽의 냉기가 나오는 입구를 막고 있으면 냉기 순환이 안되어 음식물이 녹을 수 있습니다.\n쉽게 녹을 수 있는 음식은 냉기가 나오는 입구 근처에 보관해 주세요.\n\n답변이 유용한가요?"
									}
								],
								"children": [
									{
										"id": "csdemo48",
										"filename": "csdemo",
										"input": [
											{
												"text": "~네"
											}
										],
										"output": [
											{
												"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
											}
										],
										"name": "dialog_csdemo48"
									},
									{
										"id": "csdemo51",
										"filename": "csdemo",
										"input": [
											{
												"text": "~아니요"
											}
										],
										"output": [
											{
												"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
											}
										],
										"children": [
											{
												"id": "csdemo49",
												"filename": "csdemo",
												"input": [
													{
														"text": "~네"
													}
												],
												"output": [
													{
														"call": "예약"
													}
												],
												"name": "dialog_csdemo49"
											},
											{
												"id": "csdemo50",
												"filename": "csdemo",
												"input": [
													{
														"text": "~아니요"
													}
												],
												"output": [
													{
														"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
													}
												],
												"name": "dialog_csdemo50"
											}
										],
										"name": "dialog_csdemo51"
									}
								],
								"name": "dialog_csdemo52"
							},
							{
								"id": "csdemo90",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "도어가 잘 안 닫혀 있지 않나요?"
									}
								],
								"children": [
									{
										"id": "csdemo57",
										"filename": "csdemo",
										"input": [
											{
												"text": "~네"
											}
										],
										"output": [
											{
												"output": "[답변] 보관된 음식이 도어에 끼지 않게 해주시고 도어를 꼭 닫아 주세요.\n도어가 완전히 닫히지 않아 냉기가 새면 바깥의 따뜻한 공기가 안으로 유입되어 음식물이 녹을 수 있습니다.\n\n답변이 유용한가요?"
											}
										],
										"children": [
											{
												"id": "csdemo53",
												"filename": "csdemo",
												"input": [
													{
														"text": "~네"
													}
												],
												"output": [
													{
														"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
													}
												],
												"name": "dialog_csdemo53"
											},
											{
												"id": "csdemo56",
												"filename": "csdemo",
												"input": [
													{
														"text": "~아니요"
													}
												],
												"output": [
													{
														"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
													}
												],
												"children": [
													{
														"id": "csdemo54",
														"filename": "csdemo",
														"input": [
															{
																"text": "~네"
															}
														],
														"output": [
															{
																"call": "예약"
															}
														],
														"name": "dialog_csdemo54"
													},
													{
														"id": "csdemo55",
														"filename": "csdemo",
														"input": [
															{
																"text": "~아니요"
															}
														],
														"output": [
															{
																"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
															}
														],
														"name": "dialog_csdemo55"
													}
												],
												"name": "dialog_csdemo56"
											}
										],
										"name": "dialog_csdemo57"
									},
									{
										"id": "csdemo88",
										"filename": "csdemo",
										"input": [
											{
												"text": "~아니요"
											}
										],
										"output": [
											{
												"output": "냉장고 주변에 통풍이 잘 되나요?"
											}
										],
										"children": [
											{
												"id": "csdemo81",
												"filename": "csdemo",
												"input": [
													{
														"text": "~네"
													}
												],
												"output": [
													{
														"output": "도어를 자주 여닫는 편인가요?"
													}
												],
												"children": [
													{
														"id": "csdemo62",
														"filename": "csdemo",
														"input": [
															{
																"text": "~네"
															}
														],
														"output": [
															{
																"output": "[답변] 냉동실에 넣으신 음식의 양에 따라 냉각시키는데 필요한 시간은 다릅니다.\n뜨거운 음식은 식혀서 냉동실에 넣어주시고 여름철과 같이 주위 온도가 높거나 녹기 쉬운 음식이 많은 경우 도어를 자주 여닫지 마세요.\n\n답변이 유용한가요?"
															}
														],
														"children": [
															{
																"id": "csdemo58",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~네"
																	}
																],
																"output": [
																	{
																		"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
																	}
																],
																"name": "dialog_csdemo58"
															},
															{
																"id": "csdemo61",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~아니요"
																	}
																],
																"output": [
																	{
																		"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
																	}
																],
																"children": [
																	{
																		"id": "csdemo59",
																		"filename": "csdemo",
																		"input": [
																			{
																				"text": "~네"
																			}
																		],
																		"output": [
																			{
																				"call": "예약"
																			}
																		],
																		"name": "dialog_csdemo59"
																	},
																	{
																		"id": "csdemo60",
																		"filename": "csdemo",
																		"input": [
																			{
																				"text": "~아니요"
																			}
																		],
																		"output": [
																			{
																				"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
																			}
																		],
																		"name": "dialog_csdemo60"
																	}
																],
																"name": "dialog_csdemo61"
															}
														],
														"name": "dialog_csdemo62"
													},
													{
														"id": "csdemo79",
														"filename": "csdemo",
														"input": [
															{
																"text": "~아니요"
															}
														],
														"output": [
															{
																"output": "냉장고 주위 온도가 5℃ 이하 혹은 43℃ 이상인가요?"
															}
														],
														"children": [
															{
																"id": "csdemo67",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~네"
																	}
																],
																"output": [
																	{
																		"output": "[답변] 냉장고 주위 온도가 5℃ 이상 43℃ 이하인 곳에 설치하세요.\n\n답변이 유용한가요?"
																	}
																],
																"children": [
																	{
																		"id": "csdemo63",
																		"filename": "csdemo",
																		"input": [
																			{
																				"text": "~네"
																			}
																		],
																		"output": [
																			{
																				"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
																			}
																		],
																		"name": "dialog_csdemo63"
																	},
																	{
																		"id": "csdemo66",
																		"filename": "csdemo",
																		"input": [
																			{
																				"text": "~아니요"
																			}
																		],
																		"output": [
																			{
																				"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
																			}
																		],
																		"children": [
																			{
																				"id": "csdemo64",
																				"filename": "csdemo",
																				"input": [
																					{
																						"text": "~네"
																					}
																				],
																				"output": [
																					{
																						"call": "예약"
																					}
																				],
																				"name": "dialog_csdemo64"
																			},
																			{
																				"id": "csdemo65",
																				"filename": "csdemo",
																				"input": [
																					{
																						"text": "~아니요"
																					}
																				],
																				"output": [
																					{
																						"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
																					}
																				],
																				"name": "dialog_csdemo65"
																			}
																		],
																		"name": "dialog_csdemo66"
																	}
																],
																"name": "dialog_csdemo67"
															},
															{
																"id": "csdemo77",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~아니요"
																	}
																],
																"output": [
																	{
																		"output": "처음 전원을 연결했나요?"
																	}
																],
																"children": [
																	{
																		"id": "csdemo72",
																		"filename": "csdemo",
																		"input": [
																			{
																				"text": "~네"
																			}
																		],
																		"output": [
																			{
																				"output": "[답변] 처음 전원을 연결하면 약 1~2시간 정도면 냉기가 나오지만 정상 온도까지는 음식 보관에 따라 2~3일 정도 걸릴 수 있습니다.\n\n답변이 유용한가요?"
																			}
																		],
																		"children": [
																			{
																				"id": "csdemo68",
																				"filename": "csdemo",
																				"input": [
																					{
																						"text": "~네"
																					}
																				],
																				"output": [
																					{
																						"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
																					}
																				],
																				"name": "dialog_csdemo68"
																			},
																			{
																				"id": "csdemo71",
																				"filename": "csdemo",
																				"input": [
																					{
																						"text": "~아니요"
																					}
																				],
																				"output": [
																					{
																						"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
																					}
																				],
																				"children": [
																					{
																						"id": "csdemo69",
																						"filename": "csdemo",
																						"input": [
																							{
																								"text": "~네"
																							}
																						],
																						"output": [
																							{
																								"call": "예약"
																							}
																						],
																						"name": "dialog_csdemo69"
																					},
																					{
																						"id": "csdemo70",
																						"filename": "csdemo",
																						"input": [
																							{
																								"text": "~아니요"
																							}
																						],
																						"output": [
																							{
																								"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
																							}
																						],
																						"name": "dialog_csdemo70"
																					}
																				],
																				"name": "dialog_csdemo71"
																			}
																		],
																		"name": "dialog_csdemo72"
																	},
																	{
																		"id": "csdemo75",
																		"filename": "csdemo",
																		"input": [
																			{
																				"text": "~아니요"
																			}
																		],
																		"output": [
																			{
																				"output": "챗봇 상담으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
																			}
																		],
																		"children": [
																			{
																				"id": "csdemo73",
																				"filename": "csdemo",
																				"input": [
																					{
																						"text": "~네"
																					}
																				],
																				"output": [
																					{
																						"call": "예약"
																					}
																				],
																				"name": "dialog_csdemo73"
																			},
																			{
																				"id": "csdemo74",
																				"filename": "csdemo",
																				"input": [
																					{
																						"text": "~아니요"
																					}
																				],
																				"output": [
																					{
																						"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
																					}
																				],
																				"name": "dialog_csdemo74"
																			}
																		],
																		"name": "dialog_csdemo75"
																	},
																	{
																		"id": "csdemo76",
																		"filename": "csdemo",
																		"input": [
																			{
																				"if": "true"
																			}
																		],
																		"output": [
																			{
																				"repeat": 1,
																				"options": {
																					"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
																				}
																			}
																		],
																		"name": "dialog_csdemo76"
																	}
																],
																"name": "dialog_csdemo77"
															},
															{
																"id": "csdemo78",
																"filename": "csdemo",
																"input": [
																	{
																		"if": "true"
																	}
																],
																"output": [
																	{
																		"repeat": 1,
																		"options": {
																			"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
																		}
																	}
																],
																"name": "dialog_csdemo78"
															}
														],
														"name": "dialog_csdemo79"
													},
													{
														"id": "csdemo80",
														"filename": "csdemo",
														"input": [
															{
																"if": "true"
															}
														],
														"output": [
															{
																"repeat": 1,
																"options": {
																	"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
																}
															}
														],
														"name": "dialog_csdemo80"
													}
												],
												"name": "dialog_csdemo81"
											},
											{
												"id": "csdemo86",
												"filename": "csdemo",
												"input": [
													{
														"text": "~아니요"
													}
												],
												"output": [
													{
														"output": "[답변] 냉장고 주변이 통풍이 안 되는 환경에서는 냉동기능이 약해질 수 있어 통풍이 잘 되도록 적당한 간격을 주세요.\n\n답변이 유용한가요?"
													}
												],
												"children": [
													{
														"id": "csdemo82",
														"filename": "csdemo",
														"input": [
															{
																"text": "~네"
															}
														],
														"output": [
															{
																"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
															}
														],
														"name": "dialog_csdemo82"
													},
													{
														"id": "csdemo85",
														"filename": "csdemo",
														"input": [
															{
																"text": "~아니요"
															}
														],
														"output": [
															{
																"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
															}
														],
														"children": [
															{
																"id": "csdemo83",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~네"
																	}
																],
																"output": [
																	{
																		"call": "예약"
																	}
																],
																"name": "dialog_csdemo83"
															},
															{
																"id": "csdemo84",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~아니요"
																	}
																],
																"output": [
																	{
																		"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
																	}
																],
																"name": "dialog_csdemo84"
															}
														],
														"name": "dialog_csdemo85"
													}
												],
												"name": "dialog_csdemo86"
											},
											{
												"id": "csdemo87",
												"filename": "csdemo",
												"input": [
													{
														"if": "true"
													}
												],
												"output": [
													{
														"repeat": 1,
														"options": {
															"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
														}
													}
												],
												"name": "dialog_csdemo87"
											}
										],
										"name": "dialog_csdemo88"
									},
									{
										"id": "csdemo89",
										"filename": "csdemo",
										"input": [
											{
												"if": "true"
											}
										],
										"output": [
											{
												"repeat": 1,
												"options": {
													"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
												}
											}
										],
										"name": "dialog_csdemo89"
									}
								],
								"name": "dialog_csdemo90"
							},
							{
								"id": "csdemo91",
								"filename": "csdemo",
								"input": [
									{
										"if": "true"
									}
								],
								"output": [
									{
										"repeat": 1,
										"options": {
											"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
										}
									}
								],
								"name": "dialog_csdemo91"
							}
						],
						"name": "dialog_csdemo92"
					},
					{
						"id": "csdemo93",
						"filename": "csdemo",
						"input": [
							{
								"if": "true"
							}
						],
						"output": [
							{
								"repeat": 1,
								"options": {
									"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
								}
							}
						],
						"name": "dialog_csdemo93"
					}
				],
				"name": "dialog_csdemo94"
			},
			{
				"id": "csdemo99",
				"filename": "csdemo",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": [
					{
						"output": "[답변] 냉장실 설정온도가 5도 또는 6도 일 경우 중이나 강 (3도 ~ 0도 사이)으로 설정해 주세요.\n냉장고 전면부의 냉장 온도 버튼으로 냉장실 온도를 조절합니다.\n\n답변이 유용한가요?"
					}
				],
				"children": [
					{
						"id": "csdemo95",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
							}
						],
						"name": "dialog_csdemo95"
					},
					{
						"id": "csdemo98",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
							}
						],
						"children": [
							{
								"id": "csdemo96",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"call": "예약"
									}
								],
								"name": "dialog_csdemo96"
							},
							{
								"id": "csdemo97",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
									}
								],
								"name": "dialog_csdemo97"
							}
						],
						"name": "dialog_csdemo98"
					}
				],
				"name": "dialog_csdemo99"
			},
			{
				"id": "csdemo100",
				"filename": "csdemo",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"repeat": 1,
						"options": {
							"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
						}
					}
				],
				"name": "dialog_csdemo100"
			}
		]
	},
	{
		"id": "csdemo104",
		"filename": "csdemo",
		"name": "냉장고약냉둘",
		"input": [
			{
				"text": "~냉장고 ~약냉"
			}
		],
		"task": "checktorefri",
		"output": [
			{
				"output": "고객님의 냉장고의 형태를 말씀해주세요.\n(양문형 또는 일반형)"
			}
		],
		"children": [
			{
				"id": "csdemo102",
				"filename": "csdemo",
				"input": [
					{
						"text": "~양문형"
					},
					{
						"text": "~일반형"
					}
				],
				"output": [
					{
						"call": "냉장고약냉"
					}
				],
				"name": "dialog_csdemo102"
			},
			{
				"id": "csdemo103",
				"filename": "csdemo",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"repeat": 1,
						"options": {
							"output": "양문형 혹은 일반형 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
						}
					}
				],
				"name": "dialog_csdemo103"
			}
		]
	},
	{
		"id": "csdemo149",
		"filename": "csdemo",
		"name": "냉장고강냉",
		"input": [
			{
				"text": "~양문형 ~강냉"
			},
			{
				"text": "~일반형 ~강냉"
			}
		],
		"task": "checktorefri",
		"output": [
			{
				"output": "온도 설정은 해보셨나요?"
			}
		],
		"children": [
			{
				"id": "csdemo142",
				"filename": "csdemo",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": [
					{
						"output": "수분이 많고 얼기 쉬운 식품을 냉장실 위쪽 선반이나 냉기가 나오는 입구 앞에 보관하셨나요?"
					}
				],
				"children": [
					{
						"id": "csdemo109",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"output": "[답변] 냉장실 온도 설정이 강(0℃ 또는 1℃)으로 낮게 설정되어 있으면 음식물이 얼 수 있습니다.\n냉장실 온도 설정을 중이나 약(3℃ ~ 6℃)으로 설정해 주세요.\n냉장고 전면부의 냉장 온도 버튼으로 냉장실 온도를 조절합니다.\n\n답변이 유용한가요?"
							}
						],
						"children": [
							{
								"id": "csdemo105",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
									}
								],
								"name": "dialog_csdemo105"
							},
							{
								"id": "csdemo108",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
									}
								],
								"children": [
									{
										"id": "csdemo106",
										"filename": "csdemo",
										"input": [
											{
												"text": "~네"
											}
										],
										"output": [
											{
												"call": "예약"
											}
										],
										"name": "dialog_csdemo106"
									},
									{
										"id": "csdemo107",
										"filename": "csdemo",
										"input": [
											{
												"text": "~아니요"
											}
										],
										"output": [
											{
												"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
											}
										],
										"name": "dialog_csdemo107"
									}
								],
								"name": "dialog_csdemo108"
							}
						],
						"name": "dialog_csdemo109"
					},
					{
						"id": "csdemo140",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "신선 맞춤실에 얼기 쉬운 음식을 보관하셨나요?"
							}
						],
						"children": [
							{
								"id": "csdemo114",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"output": "[답변] 신선맞춤실이 있는 경우 냉장실 맨 아래 서랍은 “야채/과일” 또는 ”육류/생선” 으로 전환하여 사용할 수 있는데 야채/과일로 전환 후 사용하세요.\n모델에 따라 전환레버가 있는 모델도 있어 정확하게 야채/과일에 레버를 두세요. OPEN/CLOSE 인 경우 CLOSE로 전환해주세요.\n※ “야채/과일” 사용 시 바나나처럼 열대과일 등 후숙과일은 보관하지 말아 주세요\n※ “육류/생선” 사용 시 냉장실온도보다 더 차가워 야채/과일이 얼 수 있어요.\n\n답변이 유용한가요?"
									}
								],
								"children": [
									{
										"id": "csdemo110",
										"filename": "csdemo",
										"input": [
											{
												"text": "~네"
											}
										],
										"output": [
											{
												"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
											}
										],
										"name": "dialog_csdemo110"
									},
									{
										"id": "csdemo113",
										"filename": "csdemo",
										"input": [
											{
												"text": "~아니요"
											}
										],
										"output": [
											{
												"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
											}
										],
										"children": [
											{
												"id": "csdemo111",
												"filename": "csdemo",
												"input": [
													{
														"text": "~네"
													}
												],
												"output": [
													{
														"call": "예약"
													}
												],
												"name": "dialog_csdemo111"
											},
											{
												"id": "csdemo112",
												"filename": "csdemo",
												"input": [
													{
														"text": "~아니요"
													}
												],
												"output": [
													{
														"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
													}
												],
												"name": "dialog_csdemo112"
											}
										],
										"name": "dialog_csdemo113"
									}
								],
								"name": "dialog_csdemo114"
							},
							{
								"id": "csdemo138",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "냉장고 주변에 통풍이 잘 되나요?"
									}
								],
								"children": [
									{
										"id": "csdemo131",
										"filename": "csdemo",
										"input": [
											{
												"text": "~네"
											}
										],
										"output": [
											{
												"output": "냉장고가 너무 추운 곳에 있지 않나요?"
											}
										],
										"children": [
											{
												"id": "csdemo119",
												"filename": "csdemo",
												"input": [
													{
														"text": "~네"
													}
												],
												"output": [
													{
														"output": "[답변] 주위온도가 5℃~43℃이내인 곳에 설치하세요.\n\n답변이 유용한가요?"
													}
												],
												"children": [
													{
														"id": "csdemo115",
														"filename": "csdemo",
														"input": [
															{
																"text": "~네"
															}
														],
														"output": [
															{
																"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
															}
														],
														"name": "dialog_csdemo115"
													},
													{
														"id": "csdemo118",
														"filename": "csdemo",
														"input": [
															{
																"text": "~아니요"
															}
														],
														"output": [
															{
																"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
															}
														],
														"children": [
															{
																"id": "csdemo116",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~네"
																	}
																],
																"output": [
																	{
																		"call": "예약"
																	}
																],
																"name": "dialog_csdemo116"
															},
															{
																"id": "csdemo117",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~아니요"
																	}
																],
																"output": [
																	{
																		"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
																	}
																],
																"name": "dialog_csdemo117"
															}
														],
														"name": "dialog_csdemo118"
													}
												],
												"name": "dialog_csdemo119"
											},
											{
												"id": "csdemo129",
												"filename": "csdemo",
												"input": [
													{
														"text": "~아니요"
													}
												],
												"output": [
													{
														"output": "냉장실 천장의 온도센서에 음식물이 닿아 있지 않나요?"
													}
												],
												"children": [
													{
														"id": "csdemo124",
														"filename": "csdemo",
														"input": [
															{
																"text": "~네"
															}
														],
														"output": [
															{
																"output": "[답변] 주위온도가 5℃~43℃이내인 곳에 설치하세요.\n\n답변이 유용한가요?"
															}
														],
														"children": [
															{
																"id": "csdemo120",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~네"
																	}
																],
																"output": [
																	{
																		"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
																	}
																],
																"name": "dialog_csdemo120"
															},
															{
																"id": "csdemo123",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~아니요"
																	}
																],
																"output": [
																	{
																		"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
																	}
																],
																"children": [
																	{
																		"id": "csdemo121",
																		"filename": "csdemo",
																		"input": [
																			{
																				"text": "~네"
																			}
																		],
																		"output": [
																			{
																				"call": "예약"
																			}
																		],
																		"name": "dialog_csdemo121"
																	},
																	{
																		"id": "csdemo122",
																		"filename": "csdemo",
																		"input": [
																			{
																				"text": "~아니요"
																			}
																		],
																		"output": [
																			{
																				"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
																			}
																		],
																		"name": "dialog_csdemo122"
																	}
																],
																"name": "dialog_csdemo123"
															}
														],
														"name": "dialog_csdemo124"
													},
													{
														"id": "csdemo127",
														"filename": "csdemo",
														"input": [
															{
																"text": "~아니요"
															}
														],
														"output": [
															{
																"output": "챗봇 상담으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
															}
														],
														"children": [
															{
																"id": "csdemo125",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~네"
																	}
																],
																"output": [
																	{
																		"call": "예약"
																	}
																],
																"name": "dialog_csdemo125"
															},
															{
																"id": "csdemo126",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~아니요"
																	}
																],
																"output": [
																	{
																		"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
																	}
																],
																"name": "dialog_csdemo126"
															}
														],
														"name": "dialog_csdemo127"
													},
													{
														"id": "csdemo128",
														"filename": "csdemo",
														"input": [
															{
																"if": "true"
															}
														],
														"output": [
															{
																"repeat": 1,
																"options": {
																	"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
																}
															}
														],
														"name": "dialog_csdemo128"
													}
												],
												"name": "dialog_csdemo129"
											},
											{
												"id": "csdemo130",
												"filename": "csdemo",
												"input": [
													{
														"if": "true"
													}
												],
												"output": [
													{
														"repeat": 1,
														"options": {
															"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
														}
													}
												],
												"name": "dialog_csdemo130"
											}
										],
										"name": "dialog_csdemo131"
									},
									{
										"id": "csdemo136",
										"filename": "csdemo",
										"input": [
											{
												"text": "~아니요"
											}
										],
										"output": [
											{
												"output": "[답변] 냉장고 주변이 통풍이 안 되는 환경에서는 냉동기능이 약해질 수 있어 통풍이 잘 되도록 적당한 간격을 주세요.\n\n답변이 유용한가요?"
											}
										],
										"children": [
											{
												"id": "csdemo132",
												"filename": "csdemo",
												"input": [
													{
														"text": "~네"
													}
												],
												"output": [
													{
														"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
													}
												],
												"name": "dialog_csdemo132"
											},
											{
												"id": "csdemo135",
												"filename": "csdemo",
												"input": [
													{
														"text": "~아니요"
													}
												],
												"output": [
													{
														"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
													}
												],
												"children": [
													{
														"id": "csdemo133",
														"filename": "csdemo",
														"input": [
															{
																"text": "~네"
															}
														],
														"output": [
															{
																"call": "예약"
															}
														],
														"name": "dialog_csdemo133"
													},
													{
														"id": "csdemo134",
														"filename": "csdemo",
														"input": [
															{
																"text": "~아니요"
															}
														],
														"output": [
															{
																"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
															}
														],
														"name": "dialog_csdemo134"
													}
												],
												"name": "dialog_csdemo135"
											}
										],
										"name": "dialog_csdemo136"
									},
									{
										"id": "csdemo137",
										"filename": "csdemo",
										"input": [
											{
												"if": "true"
											}
										],
										"output": [
											{
												"repeat": 1,
												"options": {
													"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
												}
											}
										],
										"name": "dialog_csdemo137"
									}
								],
								"name": "dialog_csdemo138"
							},
							{
								"id": "csdemo139",
								"filename": "csdemo",
								"input": [
									{
										"if": "true"
									}
								],
								"output": [
									{
										"repeat": 1,
										"options": {
											"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
										}
									}
								],
								"name": "dialog_csdemo139"
							}
						],
						"name": "dialog_csdemo140"
					},
					{
						"id": "csdemo141",
						"filename": "csdemo",
						"input": [
							{
								"if": "true"
							}
						],
						"output": [
							{
								"repeat": "1"
							},
							{
								"repeat": "2"
							}
						],
						"name": "dialog_csdemo141"
					}
				],
				"name": "dialog_csdemo142"
			},
			{
				"id": "csdemo147",
				"filename": "csdemo",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": [
					{
						"output": "[답변] 냉장실 온도 설정이 강(0℃ 또는 1℃)으로 낮게 설정되어 있으면 음식물이 얼 수 있습니다.\n냉장실 온도 설정을 중이나 약(3℃ ~ 6℃)으로 설정해 주세요.\n냉장고 전면부의 냉장 온도 버튼으로 냉장실 온도를 조절합니다.\n\n답변이 유용한가요?"
					}
				],
				"children": [
					{
						"id": "csdemo143",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
							}
						],
						"name": "dialog_csdemo143"
					},
					{
						"id": "csdemo146",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
							}
						],
						"children": [
							{
								"id": "csdemo144",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"call": "예약"
									}
								],
								"name": "dialog_csdemo144"
							},
							{
								"id": "csdemo145",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
									}
								],
								"name": "dialog_csdemo145"
							}
						],
						"name": "dialog_csdemo146"
					}
				],
				"name": "dialog_csdemo147"
			},
			{
				"id": "csdemo148",
				"filename": "csdemo",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"repeat": 1,
						"options": {
							"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
						}
					}
				],
				"name": "dialog_csdemo148"
			}
		]
	},
	{
		"id": "csdemo152",
		"filename": "csdemo",
		"name": "냉장고강냉둘",
		"input": [
			{
				"text": "~냉장고 ~강냉"
			}
		],
		"task": "checktorefri",
		"output": [
			{
				"output": "고객님의 냉장고의 형태를 말씀해주세요.\n(양문형 또는 일반형)"
			}
		],
		"children": [
			{
				"id": "csdemo150",
				"filename": "csdemo",
				"input": [
					{
						"text": "~양문형"
					},
					{
						"text": "~일반형"
					}
				],
				"output": [
					{
						"call": "냉장고강냉"
					}
				],
				"name": "dialog_csdemo150"
			},
			{
				"id": "csdemo151",
				"filename": "csdemo",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"repeat": 1,
						"options": {
							"output": "양문형 혹은 일반형 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
						}
					}
				],
				"name": "dialog_csdemo151"
			}
		]
	},
	{
		"id": "csdemo169",
		"filename": "csdemo",
		"name": "냉장고무냉",
		"input": [
			{
				"text": "~양문형 ~냉장고 ~무냉"
			},
			{
				"text": "~일반형 ~냉장고 ~무냉"
			}
		],
		"task": "checktorefri",
		"output": [
			{
				"output": "전원이 들어오지 않나요?"
			}
		],
		"children": [
			{
				"id": "csdemo157",
				"filename": "csdemo",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": [
					{
						"output": "[답변] 도어를 열었을 때 램프가 들어오지 않는다면 우선 전원코드를 뺐다가 재 삽입해주세요.\n그래도 램프가 들어오지 않는다면 다른 전기제품을 콘센트에 꼽아 정상 작동되는지 확인해주세요.\n다른 전기제품도 정상 작동하지 않는다면 콘센트 문제이며 냉장고를 다른 콘센트에 꼽고 사용해주세요.\n다른 전기제품이 정상 작동한다면 서비스 엔지니어 방문점검이 필요합니다. 서비스 접수를 신청해주세요.\n\n답변이 유용한가요?"
					}
				],
				"children": [
					{
						"id": "csdemo153",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
							}
						],
						"name": "dialog_csdemo153"
					},
					{
						"id": "csdemo156",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
							}
						],
						"children": [
							{
								"id": "csdemo154",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"call": "예약"
									}
								],
								"name": "dialog_csdemo154"
							},
							{
								"id": "csdemo155",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
									}
								],
								"name": "dialog_csdemo155"
							}
						],
						"name": "dialog_csdemo156"
					}
				],
				"name": "dialog_csdemo157"
			},
			{
				"id": "csdemo167",
				"filename": "csdemo",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": [
					{
						"output": "냉장고와 주위 벽과의 거리가 너무 좁지 않나요?"
					}
				],
				"children": [
					{
						"id": "csdemo162",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"output": "[답변] 냉장고와 주위 벽과의 거리가 너무 좁으면 냉장고 뒤쪽 기계실에 있는 냉각모터에서 발생되는 열을 식혀주지 못해 냉기가 약해질 수 있습니다\n뒤쪽 벽면과 측면의 공간을 띄어주시면 냉기가 회복이 될 수 있어요. 통풍이 잘 되도록 냉장고 주변에 적당한 간격을 두세요\n\n답변이 유용한가요?"
							}
						],
						"children": [
							{
								"id": "csdemo158",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
									}
								],
								"name": "dialog_csdemo158"
							},
							{
								"id": "csdemo161",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
									}
								],
								"children": [
									{
										"id": "csdemo159",
										"filename": "csdemo",
										"input": [
											{
												"text": "~네"
											}
										],
										"output": [
											{
												"call": "예약"
											}
										],
										"name": "dialog_csdemo159"
									},
									{
										"id": "csdemo160",
										"filename": "csdemo",
										"input": [
											{
												"text": "~아니요"
											}
										],
										"output": [
											{
												"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
											}
										],
										"name": "dialog_csdemo160"
									}
								],
								"name": "dialog_csdemo161"
							}
						],
						"name": "dialog_csdemo162"
					},
					{
						"id": "csdemo165",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "챗봇 상담으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
							}
						],
						"children": [
							{
								"id": "csdemo163",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"call": "예약"
									}
								],
								"name": "dialog_csdemo163"
							},
							{
								"id": "csdemo164",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
									}
								],
								"name": "dialog_csdemo164"
							}
						],
						"name": "dialog_csdemo165"
					},
					{
						"id": "csdemo166",
						"filename": "csdemo",
						"input": [
							{
								"if": "true"
							}
						],
						"output": [
							{
								"repeat": 1,
								"options": {
									"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
								}
							}
						],
						"name": "dialog_csdemo166"
					}
				],
				"name": "dialog_csdemo167"
			},
			{
				"id": "csdemo168",
				"filename": "csdemo",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"repeat": 1,
						"options": {
							"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
						}
					}
				],
				"name": "dialog_csdemo168"
			}
		]
	},
	{
		"id": "csdemo172",
		"filename": "csdemo",
		"name": "냉장고무냉둘",
		"input": [
			{
				"text": "~냉장고 ~무냉"
			}
		],
		"task": "checktorefri",
		"output": [
			{
				"output": "고객님의 냉장고의 형태를 말씀해주세요.\n(양문형 또는 일반형)"
			}
		],
		"children": [
			{
				"id": "csdemo170",
				"filename": "csdemo",
				"input": [
					{
						"text": "~양문형"
					},
					{
						"text": "~일반형"
					}
				],
				"output": [
					{
						"call": "냉장고무냉"
					}
				],
				"name": "dialog_csdemo170"
			},
			{
				"id": "csdemo171",
				"filename": "csdemo",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"repeat": 1,
						"options": {
							"output": "양문형 혹은 일반형 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
						}
					}
				],
				"name": "dialog_csdemo171"
			}
		]
	},
	{
		"id": "csdemo177",
		"filename": "csdemo",
		"input": [
			{
				"text": "~냉장고"
			}
		],
		"task": "checktorefri",
		"output": [
			{
				"output": "고객님 냉장고의 증상을 말씀해주세요."
			}
		],
		"children": [
			{
				"id": "csdemo173",
				"filename": "csdemo",
				"input": [
					{
						"text": "~강냉"
					}
				],
				"output": [
					{
						"call": "냉장고강냉"
					}
				],
				"name": "dialog_csdemo173"
			},
			{
				"id": "csdemo174",
				"filename": "csdemo",
				"input": [
					{
						"text": "~약냉"
					}
				],
				"output": [
					{
						"call": "냉장고약냉"
					}
				],
				"name": "dialog_csdemo174"
			},
			{
				"id": "csdemo175",
				"filename": "csdemo",
				"input": [
					{
						"text": "~무냉"
					}
				],
				"output": [
					{
						"call": "냉장고무냉"
					}
				],
				"name": "dialog_csdemo175"
			},
			{
				"id": "csdemo176",
				"filename": "csdemo",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"output": "죄송합니다. 현재 챗봇 상담은 냉기 관련 증상(강냉, 약냉, 무냉)만 상담해드리고 있습니다.\n그 외 상담은 콜센터를 이용해주시기 바랍니다.\nLG전자 콜센터 번호는 1577-7314입니다."
					}
				],
				"name": "dialog_csdemo176"
			}
		],
		"name": "dialog_csdemo177"
	},
	{
		"id": "csdemo222",
		"filename": "csdemo",
		"name": "에어컨약냉",
		"input": [
			{
				"text": "~에어컨 ~스탠딩 ~약냉"
			},
			{
				"text": "~에어컨 ~스탠딩 ~무냉"
			},
			{
				"text": "~에어컨 ~벽걸이 ~약냉"
			},
			{
				"text": "~에어컨 ~벽걸이 ~무냉"
			}
		],
		"task": "checktoair",
		"output": [
			{
				"output": "필터를 청소한지 한달이 지났나요?"
			}
		],
		"children": [
			{
				"id": "csdemo182",
				"filename": "csdemo",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": [
					{
						"output": "[답변] 에어컨의 필터에 먼지가 쌓여 있으면 날씨가 더워질수록 냉방 능력이 떨어집니다.\n필터는 주기적으로 청소해주세요.\n\n답변이 유용한가요?"
					}
				],
				"children": [
					{
						"id": "csdemo178",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
							}
						],
						"name": "dialog_csdemo178"
					},
					{
						"id": "csdemo181",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
							}
						],
						"children": [
							{
								"id": "csdemo179",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"call": "예약"
									}
								],
								"name": "dialog_csdemo179"
							},
							{
								"id": "csdemo180",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
									}
								],
								"name": "dialog_csdemo180"
							}
						],
						"name": "dialog_csdemo181"
					}
				],
				"name": "dialog_csdemo182"
			},
			{
				"id": "csdemo220",
				"filename": "csdemo",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": [
					{
						"output": "운전 선택은 냉방, 희망 온도는 18도로 설정했나요?"
					}
				],
				"children": [
					{
						"id": "csdemo213",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"output": "실외기는 정상적으로 가동되나요?"
							}
						],
						"children": [
							{
								"id": "csdemo206",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"output": "뜨거운 햇빝으로 실외기가 과열되지 않았나요?"
									}
								],
								"children": [
									{
										"id": "csdemo187",
										"filename": "csdemo",
										"input": [
											{
												"text": "~네"
											}
										],
										"output": [
											{
												"output": "[답변] 갑자기 올라간 주변 기온으로 인해 흡입되는 공기의 온도가 상승하면 토출구에서 나오는 바람의 온도가 평소보다 덜 시원하게 느껴질 수 있습니다.\n※ 폭염시에는 에어컨 전원을 뽑고 실외기 윗부분에 물을 뿌려 열을 식혀 주세요.\n해결이 안된 경우에는 서비스 점검 받아 보시길 권장 드립니다.\n\n답변이 유용한가요?"
											}
										],
										"children": [
											{
												"id": "csdemo183",
												"filename": "csdemo",
												"input": [
													{
														"text": "~네"
													}
												],
												"output": [
													{
														"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
													}
												],
												"name": "dialog_csdemo183"
											},
											{
												"id": "csdemo186",
												"filename": "csdemo",
												"input": [
													{
														"text": "~아니요"
													}
												],
												"output": [
													{
														"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
													}
												],
												"children": [
													{
														"id": "csdemo184",
														"filename": "csdemo",
														"input": [
															{
																"text": "~네"
															}
														],
														"output": [
															{
																"call": "예약"
															}
														],
														"name": "dialog_csdemo184"
													},
													{
														"id": "csdemo185",
														"filename": "csdemo",
														"input": [
															{
																"text": "~아니요"
															}
														],
														"output": [
															{
																"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
															}
														],
														"name": "dialog_csdemo185"
													}
												],
												"name": "dialog_csdemo186"
											}
										],
										"name": "dialog_csdemo187"
									},
									{
										"id": "csdemo204",
										"filename": "csdemo",
										"input": [
											{
												"text": "~아니요"
											}
										],
										"output": [
											{
												"output": "제품 용량에 비해 실내가 넓거나 출입문 근처에 설치되어 있지 않나요?"
											}
										],
										"children": [
											{
												"id": "csdemo192",
												"filename": "csdemo",
												"input": [
													{
														"text": "~네"
													}
												],
												"output": [
													{
														"output": "[답변] 갑자기 올라간 주변 기온으로 인해 흡입되는 공기의 온도가 상승하면 토출구에서 나오는 바람의 온도가 평소보다 덜 시원하게 느껴질 수 있습니다.\n※ 폭염시에는 에어컨 전원을 뽑고 실외기 윗부분에 물을 뿌려 열을 식혀 주세요.\n해결이 안된 경우에는 서비스 점검 받아 보시길 권장 드립니다.\n\n답변이 유용한가요?"
													}
												],
												"children": [
													{
														"id": "csdemo188",
														"filename": "csdemo",
														"input": [
															{
																"text": "~네"
															}
														],
														"output": [
															{
																"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
															}
														],
														"name": "dialog_csdemo188"
													},
													{
														"id": "csdemo191",
														"filename": "csdemo",
														"input": [
															{
																"text": "~아니요"
															}
														],
														"output": [
															{
																"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
															}
														],
														"children": [
															{
																"id": "csdemo189",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~네"
																	}
																],
																"output": [
																	{
																		"call": "예약"
																	}
																],
																"name": "dialog_csdemo189"
															},
															{
																"id": "csdemo190",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~아니요"
																	}
																],
																"output": [
																	{
																		"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
																	}
																],
																"name": "dialog_csdemo190"
															}
														],
														"name": "dialog_csdemo191"
													}
												],
												"name": "dialog_csdemo192"
											},
											{
												"id": "csdemo202",
												"filename": "csdemo",
												"input": [
													{
														"text": "~아니요"
													}
												],
												"output": [
													{
														"output": "에어컨을 처음 가동했나요?"
													}
												],
												"children": [
													{
														"id": "csdemo197",
														"filename": "csdemo",
														"input": [
															{
																"text": "~네"
															}
														],
														"output": [
															{
																"output": "[답변] 갑자기 올라간 주변 기온으로 인해 흡입되는 공기의 온도가 상승하면 토출구에서 나오는 바람의 온도가 평소보다 덜 시원하게 느껴질 수 있습니다.\n※ 폭염시에는 에어컨 전원을 뽑고 실외기 윗부분에 물을 뿌려 열을 식혀 주세요.\n해결이 안된 경우에는 서비스 점검 받아 보시길 권장 드립니다.\n\n답변이 유용한가요?"
															}
														],
														"children": [
															{
																"id": "csdemo193",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~네"
																	}
																],
																"output": [
																	{
																		"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
																	}
																],
																"name": "dialog_csdemo193"
															},
															{
																"id": "csdemo196",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~아니요"
																	}
																],
																"output": [
																	{
																		"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
																	}
																],
																"children": [
																	{
																		"id": "csdemo194",
																		"filename": "csdemo",
																		"input": [
																			{
																				"text": "~네"
																			}
																		],
																		"output": [
																			{
																				"call": "예약"
																			}
																		],
																		"name": "dialog_csdemo194"
																	},
																	{
																		"id": "csdemo195",
																		"filename": "csdemo",
																		"input": [
																			{
																				"text": "~아니요"
																			}
																		],
																		"output": [
																			{
																				"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
																			}
																		],
																		"name": "dialog_csdemo195"
																	}
																],
																"name": "dialog_csdemo196"
															}
														],
														"name": "dialog_csdemo197"
													},
													{
														"id": "csdemo200",
														"filename": "csdemo",
														"input": [
															{
																"text": "~아니요"
															}
														],
														"output": [
															{
																"output": "챗봇 상담으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
															}
														],
														"children": [
															{
																"id": "csdemo198",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~네"
																	}
																],
																"output": [
																	{
																		"call": "예약"
																	}
																],
																"name": "dialog_csdemo198"
															},
															{
																"id": "csdemo199",
																"filename": "csdemo",
																"input": [
																	{
																		"text": "~아니요"
																	}
																],
																"output": [
																	{
																		"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
																	}
																],
																"name": "dialog_csdemo199"
															}
														],
														"name": "dialog_csdemo200"
													},
													{
														"id": "csdemo201",
														"filename": "csdemo",
														"input": [
															{
																"if": "true"
															}
														],
														"output": [
															{
																"repeat": 1,
																"options": {
																	"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
																}
															}
														],
														"name": "dialog_csdemo201"
													}
												],
												"name": "dialog_csdemo202"
											},
											{
												"id": "csdemo203",
												"filename": "csdemo",
												"input": [
													{
														"if": "true"
													}
												],
												"output": [
													{
														"repeat": 1,
														"options": {
															"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
														}
													}
												],
												"name": "dialog_csdemo203"
											}
										],
										"name": "dialog_csdemo204"
									},
									{
										"id": "csdemo205",
										"filename": "csdemo",
										"input": [
											{
												"if": "true"
											}
										],
										"output": [
											{
												"repeat": 1,
												"options": {
													"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
												}
											}
										],
										"name": "dialog_csdemo205"
									}
								],
								"name": "dialog_csdemo206"
							},
							{
								"id": "csdemo211",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "[답변] 실외기 주변 장애물을 치워주시고 통풍이 잘되도록 관리해 주세요.\n실외기가 내부에 설치한 경우 폭염시에는 방충망까지 열어주세요.\n만약, 실외기가 가동되지 않는다면 점검이 필요합니다.\n\n답변이 유용한가요?"
									}
								],
								"children": [
									{
										"id": "csdemo207",
										"filename": "csdemo",
										"input": [
											{
												"text": "~네"
											}
										],
										"output": [
											{
												"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
											}
										],
										"name": "dialog_csdemo207"
									},
									{
										"id": "csdemo210",
										"filename": "csdemo",
										"input": [
											{
												"text": "~아니요"
											}
										],
										"output": [
											{
												"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
											}
										],
										"children": [
											{
												"id": "csdemo208",
												"filename": "csdemo",
												"input": [
													{
														"text": "~네"
													}
												],
												"output": [
													{
														"call": "예약"
													}
												],
												"name": "dialog_csdemo208"
											},
											{
												"id": "csdemo209",
												"filename": "csdemo",
												"input": [
													{
														"text": "~아니요"
													}
												],
												"output": [
													{
														"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
													}
												],
												"name": "dialog_csdemo209"
											}
										],
										"name": "dialog_csdemo210"
									}
								],
								"name": "dialog_csdemo211"
							},
							{
								"id": "csdemo212",
								"filename": "csdemo",
								"input": [
									{
										"if": "true"
									}
								],
								"output": [
									{
										"repeat": 1,
										"options": {
											"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
										}
									}
								],
								"name": "dialog_csdemo212"
							}
						],
						"name": "dialog_csdemo213"
					},
					{
						"id": "csdemo218",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "[답변] 운전 선택 버튼을 눌러 냉방 모드로 선택해 주세요.\n제습 또는 인공지능으로 선택 시 냉방이 약하게 느껴질 수 있습니다.\n실내온도와 희망온도의 차이가 클수록 냉방능력이 올라가며 최저 18도까지 선택 가능합니다.\n\n답변이 유용한가요?"
							}
						],
						"children": [
							{
								"id": "csdemo214",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
									}
								],
								"name": "dialog_csdemo214"
							},
							{
								"id": "csdemo217",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
									}
								],
								"children": [
									{
										"id": "csdemo215",
										"filename": "csdemo",
										"input": [
											{
												"text": "~네"
											}
										],
										"output": [
											{
												"call": "예약"
											}
										],
										"name": "dialog_csdemo215"
									},
									{
										"id": "csdemo216",
										"filename": "csdemo",
										"input": [
											{
												"text": "~아니요"
											}
										],
										"output": [
											{
												"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
											}
										],
										"name": "dialog_csdemo216"
									}
								],
								"name": "dialog_csdemo217"
							}
						],
						"name": "dialog_csdemo218"
					},
					{
						"id": "csdemo219",
						"filename": "csdemo",
						"input": [
							{
								"if": "true"
							}
						],
						"output": [
							{
								"repeat": 1,
								"options": {
									"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
								}
							}
						],
						"name": "dialog_csdemo219"
					}
				],
				"name": "dialog_csdemo220"
			},
			{
				"id": "csdemo221",
				"filename": "csdemo",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"repeat": 1,
						"options": {
							"output": "네 혹은 아니요 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
						}
					}
				],
				"name": "dialog_csdemo221"
			}
		]
	},
	{
		"id": "csdemo225",
		"filename": "csdemo",
		"name": "에어컨약냉둘",
		"input": [
			{
				"text": "~에어컨 ~약냉"
			},
			{
				"text": "~에어컨 ~무냉"
			}
		],
		"task": "checktoair",
		"output": [
			{
				"output": "고객님의 에어컨의 형태를 말씀해주세요.\n(스탠딩 또는 벽걸이)"
			}
		],
		"children": [
			{
				"id": "csdemo223",
				"filename": "csdemo",
				"input": [
					{
						"text": "~스탠딩"
					},
					{
						"text": "~벽걸이"
					}
				],
				"output": [
					{
						"call": "냉장고약냉"
					}
				],
				"name": "dialog_csdemo223"
			},
			{
				"id": "csdemo224",
				"filename": "csdemo",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"repeat": 1,
						"options": {
							"output": "스탠딩 혹은 벽걸이 중에 입력해주세요.\n\n처음으로 돌아가시려면 \"시작\"을 입력해주세요."
						}
					}
				],
				"name": "dialog_csdemo224"
			}
		]
	},
	{
		"id": "csdemo230",
		"filename": "csdemo",
		"name": "투인원벽걸이",
		"input": [
			{
				"text": "~투인원 ~벽걸이"
			}
		],
		"task": "checktoair2",
		"output": [
			{
				"output": "[답변]\n투인원 제품의 경우 동작 원리상 스탠드형 에어컨의 전원코드를 연결하지 않으면 벽걸이형 제품 단독 운전시 실외기가 가동되지 않아 차가운 바람이 나오지 않을 수 있습니다.\n\n답변이 유용한가요?"
			}
		],
		"children": [
			{
				"id": "csdemo226",
				"filename": "csdemo",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": [
					{
						"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
					}
				],
				"name": "dialog_csdemo226"
			},
			{
				"id": "csdemo229",
				"filename": "csdemo",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": [
					{
						"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
					}
				],
				"children": [
					{
						"id": "csdemo227",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"call": "예약"
							}
						],
						"name": "dialog_csdemo227"
					},
					{
						"id": "csdemo228",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
							}
						],
						"name": "dialog_csdemo228"
					}
				],
				"name": "dialog_csdemo229"
			}
		]
	},
	{
		"id": "csdemo235",
		"filename": "csdemo",
		"name": "투인원스탠딩",
		"input": [
			{
				"text": "~투인원 ~스탠딩"
			}
		],
		"task": "checktoair1",
		"output": [
			{
				"output": "[답변]\n투인원 벽걸이는 정상적으로 냉방이 되는데 스탠드만 냉방이 전혀 안된다면 냉매순환 밸브쪽 문제일 수 있습니다.운전모드를 냉방으로 선택, 희망(설정) 온도는 18도(℃)로 맞추고 30분 이상 가동해 주십시오.\n여름들어 처음 가동하는 경우 냉기 나오는 속도가 조금 늦어질 수 있습니다.\n- 스탠드 바람이 나오는 부분에 냉기가 나온다면 정상입니다.\n- 냉기가 나오지 않을 시 스탠드 쪽으로만 냉매가 순환되지 않는 문제는 전문 엔지니어의 점검이 필요합니다.\n\n답변이 유용한가요?"
			}
		],
		"children": [
			{
				"id": "csdemo231",
				"filename": "csdemo",
				"input": [
					{
						"text": "~네"
					}
				],
				"output": [
					{
						"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
					}
				],
				"name": "dialog_csdemo231"
			},
			{
				"id": "csdemo234",
				"filename": "csdemo",
				"input": [
					{
						"text": "~아니요"
					}
				],
				"output": [
					{
						"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
					}
				],
				"children": [
					{
						"id": "csdemo232",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"call": "예약"
							}
						],
						"name": "dialog_csdemo232"
					},
					{
						"id": "csdemo233",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
							}
						],
						"name": "dialog_csdemo233"
					}
				],
				"name": "dialog_csdemo234"
			}
		]
	},
	{
		"id": "csdemo247",
		"filename": "csdemo",
		"name": "투인원에어컨",
		"input": [
			{
				"text": "~투인원 ~약냉"
			},
			{
				"text": "~투인원 ~무냉"
			}
		],
		"task": "checktoair",
		"output": [
			{
				"output": "고객님의 에어컨의 형태를 말씀해주세요.\n(스탠딩 또는 벽걸이)"
			}
		],
		"children": [
			{
				"id": "csdemo240",
				"filename": "csdemo",
				"input": [
					{
						"text": "~스탠딩"
					}
				],
				"task": "checktoair1",
				"output": [
					{
						"output": "[답변]\n투인원 벽걸이는 정상적으로 냉방이 되는데 스탠드만 냉방이 전혀 안된다면 냉매순환 밸브쪽 문제일 수 있습니다.운전모드를 냉방으로 선택, 희망(설정) 온도는 18도(℃)로 맞추고 30분 이상 가동해 주십시오.\n여름들어 처음 가동하는 경우 냉기 나오는 속도가 조금 늦어질 수 있습니다.\n- 스탠드 바람이 나오는 부분에 냉기가 나온다면 정상입니다.\n- 냉기가 나오지 않을 시 스탠드 쪽으로만 냉매가 순환되지 않는 문제는 전문 엔지니어의 점검이 필요합니다.\n\n답변이 유용한가요?"
					}
				],
				"children": [
					{
						"id": "csdemo236",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
							}
						],
						"name": "dialog_csdemo236"
					},
					{
						"id": "csdemo239",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
							}
						],
						"children": [
							{
								"id": "csdemo237",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"call": "예약"
									}
								],
								"name": "dialog_csdemo237"
							},
							{
								"id": "csdemo238",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
									}
								],
								"name": "dialog_csdemo238"
							}
						],
						"name": "dialog_csdemo239"
					}
				],
				"name": "dialog_csdemo240"
			},
			{
				"id": "csdemo245",
				"filename": "csdemo",
				"input": [
					{
						"text": "~벽걸이"
					}
				],
				"task": "checktoair2",
				"output": [
					{
						"output": "[답변]\n투인원 제품의 경우 동작 원리상 스탠드형 에어컨의 전원코드를 연결하지 않으면 벽걸이형 제품 단독 운전시 실외기가 가동되지 않아 차가운 바람이 나오지 않을 수 있습니다.\n\n답변이 유용한가요?"
					}
				],
				"children": [
					{
						"id": "csdemo241",
						"filename": "csdemo",
						"input": [
							{
								"text": "~네"
							}
						],
						"output": [
							{
								"output": "더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다."
							}
						],
						"name": "dialog_csdemo241"
					},
					{
						"id": "csdemo244",
						"filename": "csdemo",
						"input": [
							{
								"text": "~아니요"
							}
						],
						"output": [
							{
								"output": "답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?"
							}
						],
						"children": [
							{
								"id": "csdemo242",
								"filename": "csdemo",
								"input": [
									{
										"text": "~네"
									}
								],
								"output": [
									{
										"call": "예약"
									}
								],
								"name": "dialog_csdemo242"
							},
							{
								"id": "csdemo243",
								"filename": "csdemo",
								"input": [
									{
										"text": "~아니요"
									}
								],
								"output": [
									{
										"output": "고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다."
									}
								],
								"name": "dialog_csdemo243"
							}
						],
						"name": "dialog_csdemo244"
					}
				],
				"name": "dialog_csdemo245"
			},
			{
				"id": "csdemo246",
				"filename": "csdemo",
				"input": [
					{
						"text": "~모두"
					}
				],
				"output": [
					{}
				],
				"name": "dialog_csdemo246"
			}
		]
	},
	{
		"id": "csdemo250",
		"filename": "csdemo",
		"input": [
			{
				"text": "~에어컨"
			}
		],
		"task": "checktoair",
		"output": [
			{
				"output": "고객님 에어컨의 증상을 말씀해주세요."
			}
		],
		"children": [
			{
				"id": "csdemo248",
				"filename": "csdemo",
				"input": [
					{
						"text": "~약냉"
					},
					{
						"text": "~무냉"
					}
				],
				"output": [
					{
						"call": "에어컨약냉"
					}
				],
				"name": "dialog_csdemo248"
			},
			{
				"id": "csdemo249",
				"filename": "csdemo",
				"input": [
					{
						"if": "true"
					}
				],
				"output": [
					{
						"output": "죄송합니다. 현재 챗봇 상담은 냉기 관련 증상(약냉, 무냉)만 상담해드리고 있습니다.\n그 외 상담은 콜센터를 이용해주시기 바랍니다.\nLG전자 콜센터 번호는 1577-7314입니다."
					}
				],
				"name": "dialog_csdemo249"
			}
		],
		"name": "dialog_csdemo250"
	},
	{
		"id": "csdemo253",
		"filename": "csdemo",
		"input": [
			{
				"text": "~약냉"
			}
		],
		"output": [
			{
				"if": "context.botUser.curcontext == 'refri'",
				"output": {
					"call": "냉장고약냉"
				}
			},
			{
				"if": "context.botUser.curcontext == 'air'",
				"output": {
					"call": "에어컨약냉"
				}
			},
			{
				"if": "context.botUser.curcontext == 'air1'",
				"output": {
					"call": "투인원스탠딩"
				}
			},
			{
				"if": "context.botUser.curcontext == 'air2'",
				"output": {
					"call": "투인원벽걸이"
				}
			},
			{
				"if": "true",
				"output": "어떤 제품이 제대로 동작하지 않나요?\n[냉장고 또는 에어컨]",
				"children": [
					{
						"id": "csdemo251",
						"filename": "csdemo",
						"input": {
							"text": "~냉장고"
						},
						"output": {
							"call": "냉장고약냉둘"
						}
					},
					{
						"id": "csdemo252",
						"filename": "csdemo",
						"input": {
							"text": "~에어컨"
						},
						"output": {
							"call": "에어컨약냉둘"
						}
					}
				]
			}
		],
		"name": "dialog_csdemo253"
	},
	{
		"id": "csdemo256",
		"filename": "csdemo",
		"input": [
			{
				"text": "~무냉"
			}
		],
		"output": [
			{
				"if": "context.botUser.curcontext == 'refri'",
				"output": {
					"call": "냉장고무냉"
				}
			},
			{
				"if": "context.botUser.curcontext == 'air'",
				"output": {
					"call": "에어컨약냉"
				}
			},
			{
				"if": "context.botUser.curcontext == 'air1'",
				"output": {
					"call": "투인원스탠딩"
				}
			},
			{
				"if": "context.botUser.curcontext == 'air2'",
				"output": {
					"call": "투인원벽걸이"
				}
			},
			{
				"if": "true",
				"output": "어떤 제품이 제대로 동작하지 않나요?\n[냉장고 또는 에어컨]",
				"children": [
					{
						"id": "csdemo254",
						"filename": "csdemo",
						"input": {
							"text": "~냉장고"
						},
						"output": {
							"call": "냉장고무냉둘"
						}
					},
					{
						"id": "csdemo255",
						"filename": "csdemo",
						"input": {
							"text": "~에어컨"
						},
						"output": {
							"call": "에어컨약냉둘"
						}
					}
				]
			}
		],
		"name": "dialog_csdemo256"
	},
	{
		"id": "csdemo259",
		"filename": "csdemo",
		"input": [
			{
				"text": "~강냉"
			}
		],
		"output": [
			{
				"if": "context.botUser.curcontext == 'refri'",
				"output": {
					"call": "냉장고강냉"
				}
			},
			{
				"if": "context.botUser.curcontext == 'air' || context.botUser.curcontext == 'air1' || context.botUser.curcontext == 'air2'",
				"output": "죄송합니다. 에어컨의 강냉 관련 질문은 챗봇상담이 불가능합니다.\n고객센터의 전문 상담원과 연결을 원하십니까?",
				"children": [
					{
						"id": "csdemo257",
						"filename": "csdemo",
						"input": {
							"text": "~네"
						},
						"output": {
							"output": "LG전자 고객센터 번호는 1577-7314입니다."
						}
					},
					{
						"id": "csdemo258",
						"filename": "csdemo",
						"input": {
							"text": "~아니요"
						},
						"output": {
							"output": "감사합니다. LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다."
						}
					}
				]
			},
			{
				"if": "true",
				"output": {
					"call": "냉장고강냉둘"
				}
			}
		],
		"name": "dialog_csdemo259"
	}
];

var commonDialogs = [
{
  id: 'csdemocommon0',
  filename: 'csdemocommon',
  name: '시작',
  input: {regexp: first},
  task:   'start',
  output: {output:'안녕하세요. LG전자 고객센터입니다.'}
},
{
  id: 'csdemocommon3',
  filename: 'csdemocommon',
  name: '특수문자',
  input: {regexp:/^(\.|\,|\;|\:|\!|\?|\@|\#|\$|\%)$/},
  output: {output:'고객님, 불편을 끼쳐드려 죄송합니다.\n현재 챗봇상담은 냉장고 및 에어컨 냉기관련 상담만 진행하고 있습니다.\n그 외 상담은 전문 상담원을 통해 상담진행 도와드리겠습니다.\n고객센터의 전문 상담원과 연결을 원하십니까?'}, 
    children: [
    {
      id: 'csdemocommon1',
      filename: 'csdemocommon',
      input: {text:'~네'},
      output: {output:'LG전자 고객센터 번호는 1577-7314입니다.'}
    },
    {
      id: 'csdemocommon2',
      filename: 'csdemocommon',
      input: {text:'~아니요'},
      output: {output:'감사합니다. LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.'}
    }
  ]
},
{
  id: 'csdemocommon4',
  filename: 'csdemocommon',
  input: {regexp: up},
  output: {up:1}
},
{
  id: 'csdemocommon5',
  filename: 'csdemocommon',
  input: {regexp: pre},
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  id: 'csdemocommon6',
  filename: 'csdemocommon',
  input: {regexp: next},
  output: {repeat: 1, options: {page: 'next'}}
},
{
  id: 'csdemocommon7',
  filename: 'csdemocommon',
  input: {text:'콜센터'},
  output: {output:'고객센터 번호는 1577-7314입니다.'}
},
{
  id: 'csdemocommon10',
  filename: 'csdemocommon',
  name: '답변없음',
  input: '',
  output: {output:'고객님, 불편을 끼쳐드려 죄송합니다.\n현재 챗봇상담은 냉장고 및 에어컨 냉기관련 상담만 진행하고 있습니다.\n그 외 상담은 전문 상담원을 통해 상담진행 도와드리겠습니다.\n고객센터의 전문 상담원과 연결을 원하십니까?'},
  children: [
    {
      id: 'csdemocommon8',
      filename: 'csdemocommon',
      input: {text:'~네'},
      output: {output:'LG전자 고객센터 번호는 1577-7314입니다.'}
    },
    {
      id: 'csdemocommon9',
      filename: 'csdemocommon',
      input: {text:'~아니요'},
      output: {output:'감사합니다. LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.'}
    }
  ]
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('csdemo3');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
