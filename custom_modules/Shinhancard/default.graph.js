


var dialogs = [
	{
		"name": "퀴즈",
		"id": "default213",
		"filename": "default",
		"input": [
			{
				"intent": "퀴즈"
			}
		],
		"output": [
			{
				"text": "자~퀴즈 이벤트를 시작합니다.\n\n고객님께서 젤 좋아하는 카드사는?\n힌트. 접니다.",
				"kind": "Text"
			}
		],
		"task": "setcount",
		"children": [
			{
				"name": "정답1",
				"id": "default214",
				"filename": "default",
				"input": [
					{
						"intent": "정답1"
					}
				],
				"output": "정답입니다! 저도 고객님을 젤 좋아합니다 ♥♥ \n\n'나도' 라고 입력하시면 다음 퀴즈를 낼게요.",
				"task": {
					"name": "resetcount"
				},
				"children": [
					{
						"name": "퀴즈2",
						"id": "default217",
						"filename": "default",
						"input": [
							{
								"text": "나다"
							}
						],
						"output": "두번째 퀴즈입니다.\n\n신한카드 챗봇을 만날 수 있는 곳은 어디일까요?\n힌트. 페이스O, 카카O, 네이O",
						"children": [
							{
								"name": "정답2",
								"id": "default258",
								"filename": "default",
								"input": [
									{
										"text": "페이스북 카카오 네이버"
									}
								],
								"output": "정답입니다! \n\n'그리고' 라고 입력하시면 마지막 퀴즈를 낼게요.",
								"task": {
									"name": "resetcount"
								},
								"children": [
									{
										"name": "퀴즈3",
										"id": "default266",
										"filename": "default",
										"input": [
											{
												"text": "그리고"
											}
										],
										"output": "마지막 퀴즈입니다.\n\n고객님의 '신한카드 애정지수(1~10) X 호감도(1~10) X 소지한 신한카드 개수'를 곱하면? \n\n아라비아 숫자로 써주세요.\n애정은 자고로 숫자로 표현해야 제 맛이죠.",
										"children": [
											{
												"name": "정답3",
												"id": "default268",
												"filename": "default",
												"input": [
													{
														"types": [
															"numType"
														]
													}
												],
												"output": [
													{
														"if": "context.dialog.numstep == 1",
														"output": {
															"output": "아… 제가 너무 부족하군요. 오늘부터 더욱 열일모드 장착!\n✔ 대화 화면 캡쳐 → 아래 '이벤트 응모하기' 클릭 → 페이스북에 댓글 응모",
															"buttons": [
																{
																	"text": "이벤트 응모하기",
																	"url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
																}
															],
															"image": {
																"url": "/files/Shinhancard1498183019764.jpg",
																"displayname": "이벤트.jpg"
															}
														},
														"id": "default268_0",
														"buttons": [
															{
																"text": "이벤트 응모하기",
																"url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
															}
														]
													},
													{
														"if": "context.dialog.numstep == 2",
														"output": {
															"output": "좀더 노력해서 고객님 마음에 쏘옥 들게 해볼게요! 불끈~\n✔ 대화 화면 캡쳐 → 아래 '이벤트 응모하기' 클릭 → 페이스북에 댓글 응모",
															"buttons": [
																{
																	"text": "이벤트 응모하기",
																	"url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
																}
															],
															"image": {
																"url": "/files/Shinhancard1498183086948.jpg",
																"displayname": "이벤트.jpg"
															}
														},
														"id": "default268_1",
														"buttons": [
															{
																"text": "이벤트 응모하기",
																"url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
															}
														]
													},
													{
														"if": "context.dialog.numstep == 3",
														"output": {
															"output": "우앙굿! 이런 점수 초등학교 이후로 처음입니다. 감사해요!\n✔ 대화 화면 캡쳐 → 아래 '이벤트 응모하기' 클릭 → 페이스북에 댓글 응모",
															"buttons": [
																{
																	"text": "이벤트 응모하기",
																	"url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
																}
															],
															"image": {
																"url": "/files/Shinhancard1498183111345.jpg",
																"displayname": "이벤트.jpg"
															}
														},
														"id": "default268_2",
														"buttons": [
															{
																"text": "이벤트 응모하기",
																"url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
															}
														]
													},
													{
														"if": "context.dialog.numstep == 4",
														"output": {
															"output": "내 안에 너 있다? 내 지갑 안에 신한카드 있다?! \n감동의 물결. 고맙습니다. \n✔ 대화 화면 캡쳐 → 아래 '이벤트 응모하기' 클릭 → 페이스북에 댓글 응모",
															"buttons": [
																{
																	"text": "이벤트 응모하기",
																	"url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
																}
															],
															"image": {
																"url": "/files/Shinhancard1498183124744.jpg",
																"displayname": "이벤트.jpg"
															}
														},
														"id": "default268_3",
														"buttons": [
															{
																"text": "이벤트 응모하기",
																"url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
															}
														]
													}
												],
												"task": "resetcount",
												"buttons": [
													{
														"text": "이벤트 응모하기",
														"url": "https://www.facebook.com/shinhancard/posts/1095233593910142"
													}
												]
											},
											{
												"name": "정답한계3",
												"id": "default273",
												"filename": "default",
												"input": [
													{
														"if": " context.dialog.quizcount == 2"
													}
												],
												"output": "고객님, 죄송해요. 오늘 저랑 퀴즈 놀이를 할 기분이 아니신거 같아요. 깜짝 퀴즈이벤트는 여기서 끝내도록 할께요.\n 처음으로 돌아가고 싶으시면 '처음', 다시 퀴즈를 풀고 싶으시면 '퀴즈'라고 입력해주세요~! ^^ 감사합니다!!",
												"task": {
													"name": "resetcount"
												}
											},
											{
												"name": "오답3",
												"id": "default272",
												"filename": "default",
												"input": [
													{
														"if": " true"
													}
												],
												"output": {
													"repeat": "1",
													"options": {
														"output": "이런.. 숫자로 입력해주시겠어요?"
													}
												},
												"task": "quizcount"
											}
										]
									},
									{
										"name": "퀴즈3(이어짐실패)",
										"id": "default267",
										"filename": "default",
										"input": [
											{
												"if": " true"
											}
										],
										"output": {
											"call": "퀴즈3",
											"options": {
												"output": "ㅠ_ㅠ '그리고'를 입력해주시길 바랬는데, 쉬크하신 고객님 ㅋㅋ. 뭐 어쨌든 제일 중요한건 마지막 문제니까요.\n\n마지막 퀴즈입니다.\n\n고객님의 '신한카드 애정지수(1~10) X 호감도(1~10) X 소지한 신한카드 개수'를 곱하면? \n\n아라비아 숫자로 써주세요.\n애정은 자고로 숫자로 표현해야 제 맛이죠."
											}
										}
									}
								]
							},
							{
								"name": "정답한계2",
								"id": "default261",
								"filename": "default",
								"input": [
									{
										"if": " context.dialog.quizcount == 2"
									}
								],
								"output": {
									"call": "정답2",
									"options": {
										"output": "정답은 페이스북, 카카오, 네이버랍니다. 퀴즈 틀릴수도 있어요. 제일 중요한건 맨 마지막 문제에요. 자자 마지막 문제로 넘어갈게요\n'그리고'라고 입력해주세요~"
									}
								}
							},
							{
								"name": "오답2_1",
								"id": "default259",
								"filename": "default",
								"input": [
									{
										"text": "페이스북"
									},
									{
										"text": "카카오"
									},
									{
										"text": "네이버"
									}
								],
								"output": {
									"repeat": "1",
									"options": {
										"output": "힌트. 페이스O, 카카O, 네이O 랍니다. 3개를 모두 한번에 입력해 주세요."
									}
								},
								"task": "quizcount"
							},
							{
								"name": "오답2_2",
								"id": "default260",
								"filename": "default",
								"input": [
									{
										"if": " true"
									}
								],
								"output": {
									"repeat": "1",
									"options": {
										"output": "힌트. 페이스O, 카카O, 네이O 랍니다. 다시 한번 입력해 주세요."
									}
								},
								"task": {
									"name": "quizcount"
								}
							}
						]
					},
					{
						"name": "퀴즈2(이어감실패)",
						"id": "default216",
						"filename": "default",
						"input": [
							{
								"if": " true"
							}
						],
						"output": {
							"call": "퀴즈2",
							"options": {
								"output": "이런 저 혼자만의 짝사랑이었군요. 뭐 그래도 좋아요. 어쨌든 다음 문제로 넘어갈께요~\n\n두번째 퀴즈입니다.\n\n신한카드 챗봇을 만날 수 있는 곳은 어디일까요?\n힌트. 페이스O, 카카O, 네이O"
							}
						}
					}
				]
			},
			{
				"name": "정답한계1",
				"id": "default255",
				"filename": "default",
				"input": [
					{
						"if": " context.dialog.quizcount == 2"
					}
				],
				"output": {
					"call": "정답1",
					"options": {
						"output": "이런, 정답은 신한카드에요. 이번 퀴즈는 제가 대신 맞춰드렸어요. \n저는 고객님을 좋아하니까요. 고객님도 좋아하시지요?\n다음퀴즈로 넘어가고 싶으시면 '나도'라고 입력하시면 다음 퀴즈를 낼께요."
					}
				}
			},
			{
				"name": "오답1",
				"id": "default254",
				"filename": "default",
				"input": [
					{
						"if": " true"
					}
				],
				"output": {
					"repeat": "1",
					"options": {
						"output": "와! (리액션하기 곤란하네) 다시 한번 입력해 주세요"
					}
				},
				"task": {
					"name": "quizcount"
				}
			}
		]
	},
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "FAN"
			},
			{
				"text": "1"
			}
		],
		"output": {
			"output": "오우, FAN 을 선택해 주셨군요! 원하는 서비스를 선택해 주세요.\n \n 1. 신한 FAN에 가입하고 싶어요!\n 2. 신한 FAN은 어떤 혜택이 있나요?\n 3. 신한 FAN 활용 꿀팁 좀 알려주세요!\n 4. FAN으로 납부서비스도 한다구요?",
			"buttons": [
				{
					"text": "신한 FAN 가입"
				},
				{
					"text": "신한 FAN 혜택보기"
				},
				{
					"text": "신한 FAN 활용꿀팁"
				},
				{
					"text": "신한 FAN 납부 서비스"
				},
				{
					"text": "이전"
				},
				{
					"text": "처음"
				}
			]
		},
		"name": "신한 FAN 플랫폼 소개",
		"task": {
			"output": "오우, FAN 을 선택해 주셨군요! 원하는 서비스를 선택해 주세요.\n \n 1. 신한 FAN에 가입하고 싶어요!\n 2. 신한 FAN은 어떤 혜택이 있나요?\n 3. 신한 FAN 활용 꿀팁 좀 알려주세요!\n 4. FAN으로 납부서비스도 한다구요?",
			"buttons": [
				{
					"text": "신한 FAN 가입"
				},
				{
					"text": "신한 FAN 혜택보기"
				},
				{
					"text": "신한 FAN 활용꿀팁"
				},
				{
					"text": "신한 FAN 납부 서비스"
				},
				{
					"text": "이전"
				},
				{
					"text": "처음"
				}
			]
		},
		"children": [
			{
				"name": "FAN 가입_",
				"id": "default186",
				"filename": "default",
				"input": [
					{
						"intent": "FAN 가입"
					},
					{
						"text": "1"
					}
				],
				"output": [
					{
						"text": "현명한 선택! 결제+혜택+재미가 있는 신한 FAN 입니다. \n\n✔ 신한 FAN은 신한카드가 없어도 가입가능!  \n✔ 신한 FAN에 가입 하시면 다양한 경품이 가득! \n✔ 신규 고객이라면 100% 당첨 경품 제공!",
						"kind": "Text"
					}
				],
				"task": {
					"name": "task1",
					"buttons": [
						{
							"text": "가입하고 경품타자",
							"url": "https://newm.shinhancard.com/event/2015/pt06.jsp?prm=naver"
						},
						{
							"text": "이전"
						},
						{
							"text": "처음"
						}
					],
					"output": "현명한 선택! 결제+혜택+재미가 있는 신한 FAN 입니다. \n\n✔ 신한 FAN은 신한카드가 없어도 가입가능!  \n✔ 신한 FAN에 가입 하시면 다양한 경품이 가득! \n✔ 신규 고객이라면 100% 당첨 경품 제공!",
					"image": {
						"url": "https://shinhancard.moneybrain.ai/files/Shinhancard1497408485049.jpg",
						"displayname": "FAN가입.jpg"
					},
					"text": "현명한 선택! 결제재미가 있는 신한 FAN 입니다. \n\n✔ 신한 FAN은 신한카드가 없어도 가입가능!  \n✔ 신한 FAN에 가입 하시면 다양한 경품이 가득! \n✔ 신규 고객이라면 100% 당첨 경품 제공!"
				}
			},
			{
				"name": "FAN 혜택_",
				"id": "default187",
				"filename": "default",
				"input": [
					{
						"intent": "FAN 혜택"
					},
					{
						"text": "2"
					}
				],
				"output": {
					"output": "신한 FAN 에는 다양한 혜택과 놓칠 수 없는 이벤트가 있어요! 원하는 서비스를 선택해 주세요. \n \n1. FAN 전용 적립 및 할인\n2. 매월 업뎃! FAN 이벤트",
					"buttons": [
						{
							"text": "FAN 전용 적립 및 할인"
						},
						{
							"text": "매월 업뎃! FAN 이벤트"
						}
					]
				},
				"children": [
					{
						"name": "FAN 전용 적립 및 할인_",
						"id": "default113224",
						"filename": "default",
						"input": [
							{
								"intent": "FAN 전용 적립 및 할인"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"output": "FAN 전용 할인, 포인트 적립/쿠폰, 각종 제휴사 혜택 등 놓칠 수 없는 FAN 혜택을 \n\n1. 모~두 보고 싶다면, 신한 FAN 혜택ZONE!\n2. 나한테 필요한 혜택만 골라보고 싶다면, 나만의 맞춤 쿠폰 Sally!\n",
							"buttons": [
								{
									"text": "신한 FAN 혜택 ZONE!"
								},
								{
									"text": "나만의 맞춤 쿠폰 Sally"
								}
							]
						},
						"children": [
							{
								"name": "FAN 혜택+ 서비스_",
								"id": "default1322326",
								"filename": "default",
								"input": [
									{
										"intent": "혜택 안내"
									},
									{
										"text": "1"
									}
								],
								"output": {
									"output": "\"우와, 이런 혜택. 놓칠 수 없어!\"\n\n신한 FAN 고객이라면 득템하러 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
									"buttons": [
										{
											"text": "혜택보기",
											"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_104"
										},
										{
											"text": "가입하기"
										}
									],
									"image": {
										"url": "/files/Shinhancard1497416418559.jpg",
										"displayname": "혜택+.jpg"
									}
								},
								"buttons": [
									{
										"text": "혜택보기",
										"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_104"
									},
									{
										"text": "가입하기"
									}
								]
							},
							{
								"name": "Sally_",
								"id": "default227",
								"filename": "default",
								"input": [
									{
										"intent": "Sally"
									},
									{
										"text": "2"
									}
								],
								"output": {
									"output": "\"어쩜, 내 마음을 알아주다니!\"\n\nSally는 빅데이터를 분석해 고객님께 필요한 쿠폰을 추천해 드리는 고객 맞춤형 혜택 쿠폰 서비스입니다.\n\n신한 FAN 고객이라면 득템하러 고고. \n\n아직 가입 전이라면 '가입하기'부터!",
									"buttons": [
										{
											"text": "나만의 혜택 보기",
											"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_305"
										},
										{
											"text": "가입하기"
										}
									],
									"image": {
										"url": "/files/Shinhancard1497417129022.jpg",
										"displayname": "Sally.jpg"
									}
								},
								"buttons": [
									{
										"text": "나만의 혜택 보기",
										"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_305"
									},
									{
										"text": "가입하기"
									}
								]
							}
						],
						"buttons": [
							{
								"text": "신한 FAN 혜택 ZONE!"
							},
							{
								"text": "나만의 맞춤 쿠폰 Sally"
							}
						]
					},
					{
						"name": "이벤트_",
						"id": "default223245",
						"filename": "default",
						"input": [
							{
								"intent": "이벤트"
							},
							{
								"text": "2"
							}
						],
						"output": [
							{
								"text": "신한 FAN 에서 매월 다양한 이벤트를 준비하고 여러분을 기다려요!\n\n신한 FAN 고객이라면 바로 참여하러 고고. \n\n아직 가입 전이라면 '가입하기'부터!",
								"image": {
									"url": "/files/Shinhancard1497416151023.jpg",
									"displayname": "이벤트.jpg"
								},
								"buttons": [
									{
										"text": "이벤트 참여하기",
										"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_304"
									},
									{
										"text": "가입하기"
									}
								],
								"kind": "Content"
							}
						],
						"buttons": [
							{
								"text": "이벤트 참여하기",
								"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_304"
							},
							{
								"text": "가입하기"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "FAN 전용 적립 및 할인"
					},
					{
						"text": "매월 업뎃! FAN 이벤트"
					}
				]
			},
			{
				"name": "이용안내_",
				"id": "default188",
				"filename": "default",
				"input": [
					{
						"intent": "이용안내"
					},
					{
						"text": "3"
					}
				],
				"output": {
					"output": "결제는 어떻게 하지? 어디에서? 어떤 혜택이 있다고? 포인트까지? 이 모든걸 FAN 에서 한번에! \n\n 1. FAN페이 결제\n 2. FAN페이 오프라인 가맹점 \n 3. 신한 FAN 생활형 서비스\n 4. 신한 FAN 클럽(통합포인트)",
					"buttons": [
						{
							"text": "결제"
						},
						{
							"text": "오프라인 가맹점"
						},
						{
							"text": "생활형 서비스"
						},
						{
							"text": "FAN클럽"
						}
					]
				},
				"children": [
					{
						"name": "FAN페이 결제 이용가이드",
						"id": "default228",
						"filename": "default",
						"input": [
							{
								"intent": "FAN 결제 이용가이드"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"output": "\"이 편한걸 왜 안 해?\"\n\n고객님을 생각하는 FAN 답게 다양한 인증방식을 제공합니다. 고객님께 맞는 방식을 선택하세요. \n\n이제부터 결제는 빠르고 편하게!\n\n✔ 비밀번호\n✔ 지문\n✔ 홍채인증 \n\n신한 FAN 고객이라면 이용가이드로 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
							"buttons": [
								{
									"text": "이용가이드 보기",
									"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?url=https://m.shinhancard.com/conts/html/shinhanFAN/introFAN/MOBFM021R02.html&title=GUIDE"
								},
								{
									"text": "가입하기"
								}
							],
							"image": {
								"url": "/files/Shinhancard1497418612039.jpg",
								"displayname": "sns_FAN이용가이드.jpg"
							}
						},
						"buttons": [
							{
								"text": "이용가이드 보기",
								"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?url=https://m.shinhancard.com/conts/html/shinhanFAN/introFAN/MOBFM021R02.html&title=GUIDE"
							},
							{
								"text": "가입하기"
							}
						]
					},
					{
						"name": "FAN페이 오프라인 가맹점_",
						"id": "default229",
						"filename": "default",
						"input": [
							{
								"intent": "FAN페이 가맹점"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"output": "\"내가 자주 가는 곳이네?\"\n\n온라인 전체는 물론, GS25/CU, 롯데마트/홈플러스/하나로클럽, 롯데수퍼/GS수퍼, 롯데백화점, S-OIL, 할리스커피 등 오프라인에서도 이용 가능하답니다.  \n\n어떤 가맹점이 있는지 더 자세히 알아볼까요?\n \n신한 FAN 고객이라면 가맹점보기로 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
							"buttons": [
								{
									"text": "가맹점 보기",
									"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_038"
								},
								{
									"text": "가입하기"
								}
							],
							"image": {
								"url": "/files/Shinhancard1497418895927.jpg",
								"displayname": "FAN-가맹점안내.jpg"
							}
						},
						"buttons": [
							{
								"text": "가맹점 보기",
								"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_038"
							},
							{
								"text": "가입하기"
							}
						]
					},
					{
						"name": "신한 FAN 생활금융 서비스_",
						"id": "default230",
						"filename": "default",
						"input": [
							{
								"intent": "다양한 제휴/FUN/생활/금융 서비스"
							},
							{
								"text": "3"
							}
						],
						"output": {
							"output": "신한 FAN에는 각종 혜택, 생활형 FUN 컨텐츠부터 금융편의 서비스까지 유용함이 한가득! 서비스를 선택해 주세요.\n\n1. 혜택을 한눈에, 신한 FAN 혜택ZONE!\n2. 흥하세요! 나의 운세는\n3. 게임도 하고, 포인트도 쌓고\n4. AI 진짜가 나타났다, 페이봇\n5. 쉿! 최신 트렌드 정보\n6. 전설의 n빵, 더치페이",
							"buttons": [
								{
									"text": "제휴사 혜택"
								},
								{
									"text": "나의 운세"
								},
								{
									"text": "게임"
								},
								{
									"text": "페이봇"
								},
								{
									"text": "트렌드"
								},
								{
									"text": "더치페이"
								}
							]
						},
						"children": [
							{
								"name": "제휴사 서비스_",
								"id": "default233",
								"filename": "default",
								"input": [
									{
										"intent": "제휴사서비스"
									},
									{
										"text": "1"
									}
								],
								"output": {
									"output": "\"우와, 이런 혜택. 놓칠 수 없어!\"\n \n신한 FAN 고객이라면 득템하러 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
									"buttons": [
										{
											"text": "혜택 보기",
											"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_104"
										},
										{
											"text": "가입하기"
										}
									],
									"image": {
										"url": "/files/Shinhancard1497420190594.jpg",
										"displayname": "FAN_제휴사혜택.jpg"
									}
								},
								"buttons": [
									{
										"text": "혜택 보기",
										"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_104"
									},
									{
										"text": "가입하기"
									}
								]
							},
							{
								"name": "운세_",
								"id": "default234",
								"filename": "default",
								"input": [
									{
										"intent": "운세"
									},
									{
										"text": "2"
									}
								],
								"output": {
									"output": "오늘/주간/월간 운세는 물론 신토정비결, 부자되기부터 타로카드, 나를 보는 상대의 속마음까지 등 나의 운세를 무료로 보세요. \n \n✔ 동양운세\n✔ 서양운세 \n \n신한 FAN 고객이라면 운세보러 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
									"buttons": [
										{
											"text": "나의 운세 확인하기",
											"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_301"
										},
										{
											"text": "가입하기"
										}
									],
									"image": {
										"url": "/files/Shinhancard1497420336952.jpg",
										"displayname": "타로.jpg"
									}
								},
								"buttons": [
									{
										"text": "나의 운세 확인하기",
										"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_301"
									},
									{
										"text": "가입하기"
									}
								]
							},
							{
								"name": "게임_",
								"id": "default235",
								"filename": "default",
								"input": [
									{
										"intent": "게임"
									},
									{
										"text": "3"
									}
								],
								"output": {
									"output": "\"게임 덕후 모여랏!\"\n\n게임만 해도 포인트 적립. 게임존에 가기만 하면 매일 10P씩! \n1등하면 10만포인트!\n\n✔ 판귄의 남극탐험\n✔ 차곡차곡 판귄쌓기\n✔ FAN 팡!\n \n신한 FAN 고객이라면 게임하러 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
									"buttons": [
										{
											"text": "게임하러가기",
											"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_302"
										},
										{
											"text": "가입하기"
										}
									],
									"image": {
										"url": "/files/Shinhancard1497421350447.jpg",
										"displayname": "게임.jpg"
									}
								},
								"buttons": [
									{
										"text": "게임하러가기",
										"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_302"
									},
									{
										"text": "가입하기"
									}
								]
							},
							{
								"name": "페이봇_",
								"id": "default236",
								"filename": "default",
								"input": [
									{
										"intent": "페이봇"
									},
									{
										"text": "4"
									}
								],
								"output": {
									"output": "\"내 카드값 다 어디에 쓴거야?\"\n\n✔ 단골 가맹점\n✔ 많이 쓴 가맹점\n✔ 즐겨쓰는 카드\n✔ 많이 쓰는 요일\n✔ 많이 쓰는 업종\n\n똑똑한 금융 비서 페이봇이 고객님의 소비내역을 분석해 드려요! 이것만 잘 봐도 꼭 써야할 곳만 쓰게 되겠죠?\n\n신한 FAN 고객이라면 페이봇 만나러 고고.\n페이봇은 FAN 본인인증 후 확인할 수 있어요.\n\n아직 가입 전이시면 '가입하기'부터!",
									"buttons": [
										{
											"text": "소비관리 바로가기",
											"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_084"
										},
										{
											"text": "가입하기"
										}
									],
									"image": {
										"url": "/files/Shinhancard1497421337839.jpg",
										"displayname": "페이봇.jpg"
									}
								},
								"buttons": [
									{
										"text": "소비관리 바로가기",
										"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_084"
									},
									{
										"text": "가입하기"
									}
								]
							},
							{
								"name": "트렌드_",
								"id": "default237",
								"filename": "default",
								"input": [
									{
										"intent": "트렌드연구소"
									},
									{
										"text": "5"
									}
								],
								"output": {
									"output": "\"이것만 알면 나도 트렌드세터!\" \n\n신한 트렌드연구소에서 어디에도 없는 최신 정보를 드립니다.\n \n✔ 트렌드클립 : 동영상\n✔ 트렌트뉴스 : 기사 \n✔ 인포그래픽스 : 쉽게 보는 통계\n \n신한 FAN 고객이라면 페이봇 만나러 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
									"buttons": [
										{
											"text": "트렌드 보기",
											"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_314"
										},
										{
											"text": "가입하기"
										}
									],
									"image": {
										"url": "/files/Shinhancard1497421473138.jpg",
										"displayname": "트렌디연구소.jpg"
									}
								},
								"buttons": [
									{
										"text": "트렌드 보기",
										"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_314"
									},
									{
										"text": "가입하기"
									}
								]
							},
							{
								"name": "더치페이_",
								"id": "default238",
								"filename": "default",
								"input": [
									{
										"intent": "더치페이"
									},
									{
										"text": "6"
									}
								],
								"output": {
									"output": "\"아직도 계산할때 카드 여러장 내세요?\"\n\n한명이 카드로 결제한 밥값을 여러 명에게 청구하는 특별한 더치페이 서비스!\n\n나눌 친구는 카드대금으로 청구되고 요청친구는 그만큼 차감됩니다.\n\n신한 FAN 고객이라면 더치페이하러 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
									"buttons": [
										{
											"text": "더치페이 바로가기",
											"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_085"
										},
										{
											"text": "가입하기"
										}
									],
									"image": {
										"url": "/files/Shinhancard1497421642258.jpg",
										"displayname": "더치페이.jpg"
									}
								},
								"buttons": [
									{
										"text": "더치페이 바로가기",
										"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_085"
									},
									{
										"text": "가입하기"
									}
								]
							}
						],
						"buttons": [
							{
								"text": "제휴사 혜택"
							},
							{
								"text": "나의 운세"
							},
							{
								"text": "게임"
							},
							{
								"text": "페이봇"
							},
							{
								"text": "트렌드"
							},
							{
								"text": "더치페이"
							}
						]
					},
					{
						"name": "FAN 클럽_",
						"id": "default232",
						"filename": "default",
						"input": [
							{
								"intent": "FAN클럽"
							},
							{
								"text": "4"
							}
						],
						"output": {
							"output": "\"은행, 카드, 증권, 보험 등 신한의 혜택을 모았습니다\"\n\n✔ 포인트 더하기\n✔ 포인트 쓰기\n✔ 포인트 나누기\n\n신한금융그룹과 거래를 할수록 더많은 혜택을 드리는 통합리워드 서비스 신한 FAN클럽!\n \n포인트 적립/이용부터 쇼핑/쿠폰/그룹사 혜택까지 한번에 이용하세요.\n\n신한 FAN 고객이라면 FAN클럽 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
							"buttons": [
								{
									"text": "FAN클럽 바로가기",
									"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_102"
								},
								{
									"text": "가입하기"
								}
							],
							"image": {
								"url": "/files/Shinhancard1497419929343.jpg",
								"displayname": "판클럽.jpg"
							}
						},
						"buttons": [
							{
								"text": "FAN클럽 바로가기",
								"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_102"
							},
							{
								"text": "가입하기"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "결제"
					},
					{
						"text": "오프라인 가맹점"
					},
					{
						"text": "생활형 서비스"
					},
					{
						"text": "FAN클럽"
					}
				]
			},
			{
				"name": "납부 서비스_",
				"id": "default210",
				"filename": "default",
				"input": [
					{
						"text": "4"
					},
					{
						"intent": "납부서비스"
					}
				],
				"output": [
					{
						"text": "매달 내야하는 요금들, 일일이 챙기기 번거로우셨죠? 신한 FAN을 통해 납부서비스를 이용할 수 있습니다!\n\n✔ 전기요금 \n✔ 전화요금\n✔ 도시가스요금\n✔ 대학등록금\n✔ 아파트 관리비\n✔ 원격결제/조회\n\n신한 FAN 고객이라면 납부서비스로 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
						"image": {
							"url": "/files/Shinhancard1504082976485.jpg",
							"displayname": "Shinhancard1498183296920.jpg"
						},
						"buttons": [
							{
								"text": "납부서비스 바로가기",
								"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_308"
							},
							{
								"text": "가입하기"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "납부서비스 바로가기",
						"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_308"
					},
					{
						"text": "가입하기"
					}
				]
			}
		],
		"buttons": [
			{
				"text": "신한 FAN 가입"
			},
			{
				"text": "신한 FAN 혜택보기"
			},
			{
				"text": "신한 FAN 활용꿀팁"
			},
			{
				"text": "신한 FAN 납부 서비스"
			},
			{
				"text": "이전"
			},
			{
				"text": "처음"
			}
		]
	},
	{
		"name": "신한 카드 추천",
		"id": "default58",
		"filename": "default",
		"input": [
			{
				"intent": "카드추천"
			},
			{
				"text": "2"
			}
		],
		"output": {
			"output": "역시 카드는 신한카드죠. 제 자랑같지만 우리나라에서 제일 많이 쓰는 카드에요 :)\n\n 소비 패턴 및 결제 스타일을 선택해 주시면 \"내게 맞는 카드\"를 추천해 드리겠습니다.\n \n 먼저 결제 스타일부터 알아볼까요?\n\n 1. 신용카드를 선호합니다.\n 2. 체크카드를 선호합니다.",
			"buttons": [
				{
					"text": "신용카드"
				},
				{
					"text": "체크카드"
				},
				{
					"text": "이전"
				},
				{
					"text": "처음"
				}
			],
			"text": "역시 카드는 신한카드죠. 제 자랑같지만 우리나라에서 제일 많이 쓰는 카드에요 :)\n\n 소비 패턴 및 결제 스타일을 선택해 주시면 \"내게 맞는 카드\"를 추천해 드리겠습니다.\n \n 먼저 결제 스타일부터 알아볼까요?\n\n 1. 신용카드를 선호합니다.\n 2. 체크카드를 선호합니다."
		},
		"task": {
			"output": "역시 카드는 신한카드죠. 제 자랑같지만 우리나라에서 제일 많이 쓰는 카드에요 :)\n\n 소비 패턴 및 결제 스타일을 선택해 주시면 \"내게 맞는 카드\"를 추천해 드리겠습니다.\n \n 먼저 결제 스타일부터 알아볼까요?\n\n 1. 신용카드를 선호합니다.\n 2. 체크카드를 선호합니다.",
			"buttons": [
				{
					"text": "신용카드"
				},
				{
					"text": "체크카드"
				},
				{
					"text": "이전"
				},
				{
					"text": "처음"
				}
			],
			"text": "역시 카드는 신한카드죠. 제 자랑같지만 우리나라에서 제일 많이 쓰는 카드에요 :)\n\n 소비 패턴 및 결제 스타일을 선택해 주시면 \"내게 맞는 카드\"를 추천해 드리겠습니다.\n \n 먼저 결제 스타일부터 알아볼까요?\n\n 1. 신용카드를 선호합니다.\n 2. 체크카드를 선호합니다."
		},
		"children": [
			{
				"name": "신용카드",
				"id": "default59",
				"filename": "default",
				"input": [
					{
						"text": "신용"
					},
					{
						"text": "신용카드"
					},
					{
						"text": "1"
					}
				],
				"output": {
					"output": "신용카드를 선택하셨군요! 카드의 매력은 다양한 혜택이죠.\n\n고객님이 직접 혜택을 필요한 것만 골라 구성할 수도 있고, 미리 구성되어 있는 카드 중에서 고르실 수도 있어요. \n아래 보기중에서 선택해 주세요. \n\n 1. 직접 혜택을 구성하고 싶다 (혜택선택형)\n 2. 알차게 구성되어 있는 카드를 고르고 싶다 (혜택기본형)",
					"buttons": [
						{
							"text": "혜택선택형"
						},
						{
							"text": "혜택기본형"
						}
					]
				},
				"children": [
					{
						"name": "혜택선택형",
						"id": "default60",
						"filename": "default",
						"input": [
							{
								"text": "선택"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"output": "고객님께서 구성하고 싶은 혜택은 주로 할인인가요? 아니면 포인트 적립인가요?\n \n 1. 할인(캐시백)\n 2. 포인트 적립",
							"buttons": [
								{
									"text": "할인"
								},
								{
									"text": "포인트"
								}
							]
						},
						"children": [
							{
								"name": "할인",
								"id": "default63",
								"filename": "default",
								"input": [
									{
										"intent": "할인"
									},
									{
										"text": "1"
									},
									{
										"text": "캐시 백"
									}
								],
								"output": {
									"output": "(광고) [신한카드 YOLO ⓘ]\n카드가 딱이네요!\n\n✔ 6개 선택처 할인율 선택(커피,택시,편의점,베이커리,소셜커머스,영화)\n✔ 카드 디자인 선택\n✔ 분기별 Bonus 모바일 쿠폰\n\n-연회비\nLocal[국내] 1만 5천원\nVISA 1만 8천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
									"image": {
										"url": "/files/Shinhancard1496222852475.jpg",
										"displayname": "card01.jpg"
									}
								},
								"task": "YOLO"
							},
							{
								"name": "포인트적립",
								"id": "default64",
								"filename": "default",
								"input": [
									{
										"intent": "포인트"
									},
									{
										"text": "2"
									}
								],
								"output": {
									"output": "(광고) [신한 카드 Nano f]\n카드가 딱이네요!\n \n✔ 직접 고른 스타일과 거리에서 최고 5% 적립\n✔ 어디서나 최고 2% 적립\n✔ 주유 적립\n \n- 연회비\nVISA 1만3천원, 2만3천원(플래티늄)\nMASTER 1만3천원, 2만3천원(플래티늄)\nURS 8천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요. \n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
									"image": {
										"url": "/files/Shinhancard1496222865319.jpg",
										"displayname": "card02.jpg"
									}
								},
								"task": "NANOf"
							}
						],
						"buttons": [
							{
								"text": "할인"
							},
							{
								"text": "포인트"
							}
						]
					},
					{
						"name": "혜택기본형",
						"id": "default61",
						"filename": "default",
						"input": [
							{
								"text": "기본"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"output": "추천해 드리기 전에 고객님께서 어떤 카드를 원하시는지 몇 가지만 여쭤볼께요. 할인과 포인트 적립중 어떤 것을 선호하시나요?\n \n 1. 할인(캐시백)\n 2. 포인트 적립",
							"buttons": [
								{
									"text": "할인"
								},
								{
									"text": "포인트"
								}
							]
						},
						"children": [
							{
								"name": "할인2",
								"id": "default66",
								"filename": "default",
								"input": [
									{
										"intent": "할인"
									},
									{
										"text": "캐시 백"
									},
									{
										"text": "1"
									}
								],
								"output": {
									"buttons": [
										{
											"text": "생활할인형"
										},
										{
											"text": "소비추구형"
										},
										{
											"text": "OIL실속형"
										}
									],
									"text": "고객님은 어떤 소비유형에 가까우신가요?\n \n 1. 일상생활의 다양한 할인을 추구한다.\n 2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n 3. 기름값, 교통비 할인을 원하는 실속파다.",
									"kind": "Content"
								},
								"children": [
									{
										"name": "생활할인형카카오and페이스북",
										"id": "default69",
										"filename": "default",
										"input": [
											{
												"text": "1",
												"if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
											},
											{
												"text": "생활",
												"if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
											}
										],
										"output": {
											"output": "고객님께서 좋아하실만한 신용카드가 4가지나 있네요. 아래 4가지 카드 중에서 관심있는 카드를 선택해주세요. \n \n 1. 싱글족을 위한 맞춤형 카드 [신한카드 Mr.Life]\n\n 2. 직장인의 최적화 할인카드 [신한카드 B.BIG]\n\n 3. 점심값부터 커피, 통신, 직구 할인 [신한카드 Noon]\n\n 4. 마트,병원,주유할인과 금융서비스 혜택까지 [신한카드 미래설계]",
											"buttons": [
												{
													"text": "Mr.Life"
												},
												{
													"text": "B.BIG"
												},
												{
													"text": "Noon"
												},
												{
													"text": "미래설계"
												}
											]
										},
										"children": [
											{
												"name": "Mr.Life",
												"id": "default244",
												"filename": "default",
												"input": [
													{
														"text": "Mr.life"
													},
													{
														"text": "life"
													},
													{
														"text": "1"
													}
												],
												"output": {
													"output": "(광고) [신한카드 Mr.Life]\n싱글족을 위한 맞춤형 카드 \n\n✔ 시간대별 할인\n✔ 주말사용, 공과금 할인\n\n-연회비\nVISA 1만 8천원\nS& 1만 5천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1497428036946.jpg",
														"displayname": "card08.jpg"
													}
												},
												"task": "MrLife"
											},
											{
												"name": "B.BIG",
												"id": "default245",
												"filename": "default",
												"input": [
													{
														"text": "B BIG"
													},
													{
														"text": "BIG"
													},
													{
														"text": "2"
													}
												],
												"output": {
													"output": "(광고) [신한카드 B.BIG]\n직장인의 최적화 할인카드 \n\n✔ 대중교통 최대600원 할인\n✔ 백화점,커피,편의점,영화 할인\n\n-연회비\nVISA 1만 3천원\nS& 1만원\nUPI 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1497428142803.jpg",
														"displayname": "card09.jpg"
													}
												},
												"task": "BBig"
											},
											{
												"name": "Noon",
												"id": "default246",
												"filename": "default",
												"input": [
													{
														"text": "NOON"
													},
													{
														"text": "noon"
													},
													{
														"text": "3"
													}
												],
												"output": {
													"output": "(광고) [신한카드 NOON]\n굿 애프터Noon~!! \n\n✔ 점심값 20%할인\n✔ 커피, 통신, 택시 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n-연회비\nMaster 8천원\nUPI 8천원\n\n자세한 내용을 보시려면 카드 아래의 링크를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1497428235548.jpg",
														"displayname": "card32.jpg"
													}
												},
												"task": "Noon"
											},
											{
												"name": "미래설계",
												"id": "default247",
												"filename": "default",
												"input": [
													{
														"text": "미래 설계"
													},
													{
														"text": "4"
													}
												],
												"output": {
													"output": "(광고) [신한카드 미래설계]\n생활할인과 금융서비스 혜택까지 \n \n✔ 전 가맹점 포인트 적립\n✔ 각종 생활비 할인\n✔ 신한생명 보험료 할인\n\n-연회비\nLocal[국내] 1만 5천원\nVisa 2만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1497428290478.jpg",
														"displayname": "card03.jpg"
													}
												},
												"task": "mirae"
											}
										],
										"buttons": [
											{
												"text": "Mr.Life"
											},
											{
												"text": "B.BIG"
											},
											{
												"text": "Noon"
											},
											{
												"text": "미래설계"
											}
										]
									},
									{
										"name": "소비추구형카카오and페이스북",
										"id": "default70",
										"filename": "default",
										"input": [
											{
												"text": "소비",
												"if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
											},
											{
												"text": "여유",
												"if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
											},
											{
												"text": "2",
												"if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
											}
										],
										"output": {
											"output": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 4가지나 있네요. 아래 4가지 카드 중에서 관심있는 카드를 선택해주세요. \n \n 1. 온라인 결제는 FAN으로 5% 할인 [신한카드 Always FAN]\n\n 2. 온•오프라인을 뛰어넘는 할인 제공 [신한카드 O2O]\n\n 3. Trendy한 욜로족을 위한 할인 제공 [신한카드 YOLO Tasty]\n\n 4. 여성 프리미엄 회원을 위한 카드입니다 [신한카드 The LADY CLASSIC]",
											"buttons": [
												{
													"text": "Always FAN"
												},
												{
													"text": "O2O"
												},
												{
													"text": "YOLO Tasty"
												},
												{
													"text": "The Lady CLASSIC"
												}
											]
										},
										"children": [
											{
												"name": "Always FAN",
												"id": "default143",
												"filename": "default",
												"input": [
													{
														"text": "1"
													},
													{
														"text": "Always"
													}
												],
												"output": {
													"output": "(광고) [신한카드 Always FAN]\n온라인 결제 특화 카드 \n\n✔ FAN페이 온라인결제 5% 할인\n✔ 커피,영화,편의점 할인\n\n-연회비\nS& 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1496222904469.jpg",
														"displayname": "card04.jpg"
													}
												},
												"task": "AlwaysFAN"
											},
											{
												"name": "O2O",
												"id": "default144",
												"filename": "default",
												"input": [
													{
														"text": "2"
													},
													{
														"text": "O 2 O"
													}
												],
												"output": {
													"output": "(광고) [신한카드 O2O]\n온•오프라인을 뛰어넘는 할인!\n\n✔ 모바일 전용카드 Pay 할인\n✔ 스타벅스 사이렌오더 할인\n\n-연회비\nMaster 1만 3천원\nS& 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1496222925697.jpg",
														"displayname": "card05.jpg"
													}
												},
												"task": "O2O"
											},
											{
												"name": "YOLOTasty",
												"id": "default145",
												"filename": "default",
												"input": [
													{
														"text": "3"
													},
													{
														"text": "YOLO Tasty"
													},
													{
														"text": "Tasty"
													}
												],
												"output": {
													"output": "(광고) [신한카드 YOLO Tasty]\nTrendy한 욜로족을 위한 할인!\n\n✔ 쇼핑,다이닝,몰링 10% 할인\n✔ 영화,택시,커피 할인\n\n-연회비\nVISA 1만 3천원\nS& 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1497428689198.jpg",
														"displayname": "card07.jpg"
													}
												},
												"task": "YOLOTasty"
											},
											{
												"name": "TheLadyCLASSIC",
												"id": "default146",
												"filename": "default",
												"input": [
													{
														"text": "4"
													},
													{
														"text": "The Lady CLASSIC"
													}
												],
												"output": {
													"output": "(광고) [신한카드 The LADY CLASSIC]\n여성 프리미엄 회원을 위하여!\n\n✔ 쇼핑•육아•웰빙 캐시백\n\n-연회비\nVISA 10만 5천원\nUPI 10만원\n가족카드 3만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1497428759311.jpg",
														"displayname": "card10.jpg"
													}
												},
												"task": "TheLadyClassic"
											}
										],
										"buttons": [
											{
												"text": "Always FAN"
											},
											{
												"text": "O2O"
											},
											{
												"text": "YOLO Tasty"
											},
											{
												"text": "The Lady CLASSIC"
											}
										]
									},
									{
										"name": "OIL실속형",
										"id": "default71",
										"filename": "default",
										"input": [
											{
												"text": "기름"
											},
											{
												"text": "교통"
											},
											{
												"text": "실속"
											},
											{
												"text": "3"
											}
										],
										"output": {
											"output": "(광고) [GS칼텍스 신한카드 Shine]\n카드가 딱이네요!\n\n✔ GS칼텍스 주유 할인\n✔ 대중교통 할인\n\n-연회비\nVISA 1만2천원, 2만2천원(플래티늄)\nMASTER 1만2천원, 2만2천원(플래티늄)\nURS 7천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
											"image": {
												"url": "/files/Shinhancard1496223008518.jpg",
												"displayname": "card12.jpg"
											}
										},
										"task": "GSShine"
									},
									{
										"name": "소비추구형",
										"id": "default201",
										"filename": "default",
										"input": [
											{
												"text": "2"
											},
											{
												"text": "소비"
											},
											{
												"text": "여유"
											}
										],
										"output": "ㅇ",
										"task": {
											"name": "cardlist1"
										}
									},
									{
										"name": "생활할인형",
										"id": "default248",
										"filename": "default",
										"input": [
											{
												"text": "생활"
											},
											{
												"text": "1"
											}
										],
										"output": "d",
										"task": {
											"name": "cardlist7"
										}
									}
								],
								"buttons": [
									{
										"text": "생활할인형"
									},
									{
										"text": "소비추구형"
									},
									{
										"text": "OIL실속형"
									}
								]
							},
							{
								"name": "포인트적립2",
								"id": "default67",
								"filename": "default",
								"input": [
									{
										"intent": "포인트"
									},
									{
										"text": "2"
									}
								],
								"output": [
									{
										"text": "고객님은 어떤 소비유형에 가까우신가요?\n \n 1. 카드는 포인트가 최고라고 생각한다.\n 2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n 3. 여행을 좋아한다. 항공마일리지에 집중!\n 4. 기름값, 생활비 적립을 원하는 실속파다.",
										"buttons": [
											{
												"text": "포인트집착형"
											},
											{
												"text": "소비추구형"
											},
											{
												"text": "여행덕후형"
											},
											{
												"text": "OIL실속형"
											}
										],
										"kind": "Content"
									}
								],
								"children": [
									{
										"name": "포인트집착형",
										"id": "default73",
										"filename": "default",
										"input": [
											{
												"text": "1"
											},
											{
												"text": "포인트"
											}
										],
										"output": [
											{
												"text": "[신한카드 Deep Dream]\n카드가 딱이네요! \n\n✔ 국내/외 전가맹점 0.7%적립\n✔ 5대 DREAM영역 3배(총 2.1%) 적립\n✔ DREAM영역 중 가장 많이 쓴 영역 5배(총3.5%) 적립\n✔ 주유/택시 할인 서비스\n\n- 연회비\nUPI 8천원\nVISA 1만원\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
												"kind": "Text"
											}
										],
										"task": "Main"
									},
									{
										"name": "소비추구형2 카카오and페이스북",
										"id": "default74",
										"filename": "default",
										"input": [
											{
												"text": "소비",
												"if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
											},
											{
												"text": "여유",
												"if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
											},
											{
												"text": "2",
												"if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
											}
										],
										"output": {
											"buttons": [
												{
													"text": "Hi-Point"
												},
												{
													"text": "The CLASSIC-L"
												}
											],
											"text": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 2가지가 있네요. 아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요. \n \n 1. 1년에 최대 60만 포인트 적립. 포인트 적립의 끝판왕! [신한카드 Hi-Point]\n\n 2.신한카드 레저 맴버가 되고 싶은 고객님을 위한 카드입니다 [신한카드 The CLASSIC-L]",
											"kind": "Content"
										},
										"children": [
											{
												"name": "HiPoint",
												"id": "default151",
												"filename": "default",
												"input": [
													{
														"text": "1"
													},
													{
														"text": "Hi Point"
													}
												],
												"output": {
													"output": "(광고) [신한카드 Hi-Pint]\n포인트 적립의 끝판왕! \n\n✔ 모든 가맹점 적립\n✔ 주유 60원 적립\n\n-연회비\nVISAI 1만원, 1만5천원(플래티늄)\nMaster 1만원, 1만5천원(플래티늄)\nURS 8천원\nJCB 1만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1496222978095.jpg",
														"displayname": "card14.jpg"
													}
												},
												"task": "HiPoint"
											},
											{
												"name": "TheClassicL",
												"id": "default152",
												"filename": "default",
												"input": [
													{
														"text": "2"
													},
													{
														"text": "The CLASSIC L"
													}
												],
												"output": {
													"output": "(광고) [신한카드 The CLASSIC-L]\n레저를 원하는 당신을 위해!!\n\n✔ 리조트•캠핑 무료 숙박\n✔ 주유 할인\n\n-연회비\nMaster 10만 5천원(캐시백형), 11만 5천원(마일리지형)\nURS 10만원(캐시백형), 11만원(마일리지형)\n가족카드 3만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1496222991777.jpg",
														"displayname": "card15.jpg"
													}
												},
												"task": "TheClassicL"
											}
										],
										"buttons": [
											{
												"text": "Hi-Point"
											},
											{
												"text": "The CLASSIC-L"
											}
										]
									},
									{
										"name": "여행덕후형카카오and페이스북",
										"id": "default75",
										"filename": "default",
										"input": [
											{
												"text": "여행",
												"if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
											},
											{
												"text": "항공",
												"if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
											},
											{
												"text": "3",
												"if": " (context.user.channel == \"kakao\") || (context.user.channel == \"facebook\")"
											}
										],
										"output": {
											"buttons": [
												{
													"text": "아시아나 Air1.5"
												},
												{
													"text": "Air Platinum#"
												},
												{
													"text": "The Classic+"
												}
											],
											"text": "여행 즐기시는 고객님께서 좋아하실만한 신용카드가 3가지나 있네요. 아래 3가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요. \n \n 1. 아시아나 마일리지 적립의 끝판왕 [신한카드 아시아나 Air1.5]\n\n 2. 항공 마일리지에 다양한 포인트 적립까지 제공합니다 [신한카드 Air Platinum#]\n\n 3. 항공 마일리지 적립, PP카드와 Gift Option 제공 [신한카드 The Classic+ 카드]",
											"kind": "Content"
										},
										"children": [
											{
												"name": "Asiana",
												"id": "default156",
												"filename": "default",
												"input": [
													{
														"intent": "아시아나 Air"
													},
													{
														"text": "1"
													}
												],
												"output": [
													{
														"text": "(광고) [신한카드 아시아나 Air 1.5]\n기승전 마일리지!! \n\n✔ 아시아나 마일리지 특화적립\n\n-연회비\nLocal[국내] 4만 3천원\nMaster 4만 5천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
														"kind": "Text"
													}
												],
												"task": "Air15"
											},
											{
												"name": "Air Platinum#",
												"id": "default155",
												"filename": "default",
												"input": [
													{
														"intent": "Air Platinum#"
													},
													{
														"text": "2"
													}
												],
												"output": {
													"output": "(광고) [신한카드 Air Platinum#]\n마일리지와 포인트를 동시에!\n\n✔ 항공 마일리지 적립\n✔ 포인트 추가 적립\n✔ 무료 주차/발렛파킹 \n\n-연회비\nVISA 4만원\nMaster 4만원\nURS 3만 7천원\n가족카드 5천원(별도)\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1497430841837.jpg",
														"displayname": "card17.jpg"
													}
												},
												"task": "Air"
											},
											{
												"name": "TheClassic+",
												"id": "default157",
												"filename": "default",
												"input": [
													{
														"text": "3"
													},
													{
														"text": "The classic"
													},
													{
														"text": "classic"
													}
												],
												"output": {
													"output": "(광고) [신한카드 The Classic+]\n매년 최대 12만원 Gift옵션 제공\n\n✔ 항공마일리지 추가적립\n✔ PP카드 제공\n✔ Gift Option선택\n\n-연회비\nAMEX 12만 5천원\nURS 12만원\n가족카드 3만원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
													"image": {
														"url": "/files/Shinhancard1497431214583.jpg",
														"displayname": "card20.jpg"
													}
												},
												"task": "TheClassicplus"
											}
										],
										"buttons": [
											{
												"text": "아시아나 Air1.5"
											},
											{
												"text": "Air Platinum#"
											},
											{
												"text": "The Classic+"
											}
										]
									},
									{
										"name": "OIL실속형2",
										"id": "default76",
										"filename": "default",
										"input": [
											{
												"text": "기름"
											},
											{
												"text": "교통"
											},
											{
												"text": "4"
											},
											{
												"text": "OIL 실속 형"
											}
										],
										"output": {
											"image": {
												"url": "/files/Shinhancard1497431326194.jpg",
												"displayname": "card16.jpg"
											},
											"text": "(광고) [신한카드 RPM+ Platinum#]\n카드가 딱이네요!\n\n✔ 모든 주유소 적립\n✔ 모든 가맹점 적립\n\n-연회비\nVISA 3만 5천원\nUPI 3만 2천원\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.\n\n[유의사항]\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다.\n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다.\n- 신용카드 남용은 가계경제에 위협이 됩니다.\n- 수신거부 080-800-8114(무료)\n- 여신협회 심의필번호 제 2017-c1f-07715호(2017.06.27~2018.06.26)",
											"kind": "Text"
										},
										"task": "RPM"
									},
									{
										"name": "소비추구형2",
										"id": "default202",
										"filename": "default",
										"input": [
											{
												"text": "소비"
											},
											{
												"text": "여유"
											},
											{
												"text": "2"
											}
										],
										"output": "d",
										"task": {
											"name": "cardlist2"
										}
									},
									{
										"name": "여행덕후형",
										"id": "default203",
										"filename": "default",
										"input": [
											{
												"text": "여행"
											},
											{
												"text": "항공"
											},
											{
												"text": "3"
											}
										],
										"output": "ㅇ",
										"task": {
											"name": "cardlist3"
										}
									}
								],
								"buttons": [
									{
										"text": "포인트집착형"
									},
									{
										"text": "소비추구형"
									},
									{
										"text": "여행덕후형"
									},
									{
										"text": "OIL실속형"
									}
								]
							}
						],
						"buttons": [
							{
								"text": "할인"
							},
							{
								"text": "포인트"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "혜택선택형"
					},
					{
						"text": "혜택기본형"
					}
				]
			},
			{
				"name": "체크카드",
				"id": "default78",
				"filename": "default",
				"input": [
					{
						"text": "체크카드"
					},
					{
						"text": "체크"
					},
					{
						"text": "2"
					}
				],
				"output": {
					"buttons": [
						{
							"text": "혜택선택형"
						},
						{
							"text": "혜택기본형"
						}
					],
					"text": "체크카드를 선택하셨군요! 소득공제와 카드 혜택 둘다 잡아야죠~\n\n고객님이 직접 혜택을 필요한 것만 골라 구성할 수도 있고, 미리 구성되어 있는 카드 중에서 고르실 수도 있어요. \n아래 보기중에서 선택해 주세요. \n\n 1. 직접 혜택을 구성하고 싶다 (혜택선택형)\n 2. 구성되어 있는 카드를 고르고 싶다(혜택기본형)",
					"kind": "Content"
				},
				"children": [
					{
						"name": "혜택선택형2",
						"id": "default80",
						"filename": "default",
						"input": [
							{
								"text": "선택"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"output": "[신한카드 4Tune체크]\n카드가 딱이네요!\n\n✔ 기본적립 + 선택적립\n✔ 커피 10%할인 \n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
							"image": {
								"url": "/files/Shinhancard1497433256845.jpg",
								"displayname": "card21.jpg"
							}
						},
						"task": "FourTune"
					},
					{
						"name": "혜택기본형2",
						"id": "default81",
						"filename": "default",
						"input": [
							{
								"text": "기본"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"output": "신용카드를 추천해드리기 전에 간단하게 고객님께서 어떤 카드를 원하시는지 몇 가지만 여쭤볼께요. \n2030세대 이신가요~?\n \n 1. 2030세대에요\n 2. 2030세대가 아니에요",
							"buttons": [
								{
									"text": "2030세대에요"
								},
								{
									"text": "2030세대가 아니에요"
								}
							]
						},
						"children": [
							{
								"name": "2030X",
								"id": "default84",
								"filename": "default",
								"input": [
									{
										"text": "2"
									},
									{
										"text": "2030 세대 아니다"
									}
								],
								"output": [
									{
										"text": "그렇다면 고객님의 소비성향을 알려주세요. \n\n1. 주유, 쇼핑 등 생활 혜택에 관심이 있으신 알뜰 실속파\n2. 해외에서도 혜택은 챙기는 센스실속파\n3. 카드는 포인트 적립이 최고라고 생각하는 슈퍼 실속파",
										"buttons": [
											{
												"text": "알뜰실속파"
											},
											{
												"text": "센스실속파"
											},
											{
												"text": "슈퍼실속파"
											}
										],
										"kind": "Content"
									}
								],
								"children": [
									{
										"name": "알뜰 실속",
										"id": "default89",
										"filename": "default",
										"input": [
											{
												"text": "알뜰",
												"if": "context.user.channel == 'kakao'"
											},
											{
												"text": "1",
												"if": "context.user.channel == 'kakao'"
											}
										],
										"output": {
											"output": "생활 혜택에 관심이 있으신 알뜰하신 고객님께서 좋아하실만한 체크카드가 4가지가 있네요. 아래 4가지 카드 중에서 자세히 보고 싶으신 카드를 선택해주세요. \n \n1. 쿠팡과 스타벅스를 많이 이용하신다면? [쿠팡 신한카드 체크]\n\n2. 카카오페이를 많이 이용하신다면? [카카오페이 신한 체크카드]\n\n3. 할인,적립,신한금융 서비스를 원한다면? [신한카드 S-Line 체크]\n\n4. 고속도로를 많이 이용하신다면? [신한카드 하이패스(전용) 체크]",
											"buttons": [
												{
													"text": "쿠팡"
												},
												{
													"text": "카카오페이"
												},
												{
													"text": "S-Line"
												},
												{
													"text": "하이패스"
												}
											]
										},
										"children": [
											{
												"name": "쿠팡",
												"id": "default166",
												"filename": "default",
												"input": [
													{
														"text": "1"
													},
													{
														"text": "쿠팡"
													}
												],
												"output": {
													"output": "[쿠팡 신한카드 체크]\n\n✔ 쿠팡 캐시 무제한 적립\n✔ 스타벅스 10% 캐시백\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
													"image": {
														"url": "/files/Shinhancard1496223141009.jpg",
														"displayname": "card27.jpg"
													}
												},
												"task": "coupang"
											},
											{
												"name": "카카오페이",
												"id": "default167",
												"filename": "default",
												"input": [
													{
														"text": "2"
													},
													{
														"text": "카카오 페이"
													}
												],
												"output": {
													"output": "[카카오페이 신한 체크카드]\n\n✔ 카카오페이 10% 캐시백\n✔ GS25, 스타벅스 10% 캐시백\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
													"image": {
														"url": "/files/Shinhancard1496223171927.jpg",
														"displayname": "card26.jpg"
													}
												},
												"task": "kakao"
											},
											{
												"name": "S-Line",
												"id": "default252",
												"filename": "default",
												"input": [
													{
														"text": "S Line"
													},
													{
														"text": "3"
													}
												],
												"output": {
													"output": "[신한카드 S-Line 체크]\n\n✔ 할인+적립+금융우대 서비스\n✔ 전가맹점 포인트 적립\n✔ 요식,대중교통 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
													"image": {
														"url": "/files/Shinhancard1497867105454.jpg",
														"displayname": "card34.jpg"
													}
												},
												"task": "SLine"
											},
											{
												"name": "하이패스",
												"id": "default253",
												"filename": "default",
												"input": [
													{
														"text": "4"
													},
													{
														"text": "하이패스"
													}
												],
												"output": {
													"output": "[신한카드 하이패스(전용) 체크]\n\n✔ 하이패스 요금 적립\n✔ 출퇴근시간대 통행료 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해 주세요.",
													"image": {
														"url": "/files/Shinhancard1497434030857.jpg",
														"displayname": "card24.jpg"
													}
												},
												"task": "hypass"
											}
										],
										"buttons": [
											{
												"text": "쿠팡"
											},
											{
												"text": "카카오페이"
											},
											{
												"text": "S-Line"
											},
											{
												"text": "하이패스"
											}
										]
									},
									{
										"name": "센스 실속",
										"id": "default1322327",
										"filename": "default",
										"input": [
											{
												"text": "센스",
												"if": " context.user.channel == 'kakao'"
											},
											{
												"text": "2",
												"if": " context.user.channel == 'kakao'"
											}
										],
										"output": {
											"output": "해외에서도 누릴 수 있는 혜택에 관심이 있으신 센스있는 고객님께서 좋아하실만한 신용카드가 2가지가 있어요. 아래 2가지 카드 중에서 자세히 보고 싶으신 카드를 선택해주세요. \n\n1. 해외 직구와 해외여행을 알뜰하게 하고 싶다면 [Smart Global 신한카드 체크]\n2. 여행으로 마일리지 모으고 있다면 [신한카드 YOLO Triplus 체크]",
											"buttons": [
												{
													"text": "Smart Global"
												},
												{
													"text": "YOLO Triplus"
												}
											]
										},
										"children": [
											{
												"name": "Smart Global",
												"id": "default1322328",
												"filename": "default",
												"input": [
													{
														"text": "Smart Global"
													},
													{
														"text": "1"
													}
												],
												"output": {
													"output": "[Smart Global 신한카드 체크]\n\n✔ 해외/국내 이용 캐시백 ✔ 해외 현금인출 이용 캐시백 \n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1497948005502.jpg",
														"displayname": "card36.jpg"
													}
												},
												"task": "SmartGlobal"
											},
											{
												"name": "YOLO Triplus",
												"id": "default1322329",
												"filename": "default",
												"input": [
													{
														"text": "YOLO Triplus"
													},
													{
														"text": "YOLO"
													},
													{
														"text": "2"
													}
												],
												"output": {
													"output": "[신한카드 YOLO Triplus 체크]\n\n✔ 전가맹점 마일리지 적립\n✔ 국내외 스타벅스 마일리지 적립\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1497948018344.jpg",
														"displayname": "card37.jpg"
													}
												},
												"task": "YOLOTriplus"
											}
										],
										"buttons": [
											{
												"text": "Smart Global"
											},
											{
												"text": "YOLO Triplus"
											}
										]
									},
									{
										"name": "슈퍼 실속",
										"id": "default91",
										"filename": "default",
										"input": [
											{
												"text": "슈퍼"
											},
											{
												"text": "3"
											}
										],
										"output": [
											{
												"text": "[신한카드 Deep Dream 체크]\n카드가 딱이네요!\n\n✔ 국내/외 전가맹점 0.2% 적립\n✔ 5대 DREAM영역 3배(총 0.6%) 적립\n✔ DREAM영역 중 가장 많이 쓴 영역 5배(총 1.0%) 적립\n✔ 주유/택시 할인 서비스\n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
												"kind": "Text"
											}
										],
										"task": "MainCheck"
									},
									{
										"name": "리스트6",
										"id": "default207",
										"filename": "default",
										"input": [
											{
												"text": "알뜰"
											},
											{
												"text": "1"
											}
										],
										"output": "ㅇ",
										"task": {
											"name": "cardlist6"
										}
									},
									{
										"name": "센스실속(F,N)",
										"id": "default1322330",
										"filename": "default",
										"input": [
											{
												"text": "센스"
											},
											{
												"text": "2"
											}
										],
										"output": "ㅇㅇ",
										"task": {
											"name": "cardlist9"
										}
									}
								],
								"buttons": [
									{
										"text": "알뜰실속파"
									},
									{
										"text": "센스실속파"
									},
									{
										"text": "슈퍼실속파"
									}
								]
							},
							{
								"name": "2030",
								"id": "default83",
								"filename": "default",
								"input": [
									{
										"text": "1"
									},
									{
										"text": "2030 세대"
									}
								],
								"output": {
									"output": "2030 맞춤 혜택 상품으로 추천해 드릴까요?\n \n 1. 네, 추천해주세요!\n 2. 아니오, 좀더 찾아주세요.",
									"buttons": [
										{
											"text": "네 추천해주세요"
										},
										{
											"text": "아니요 좀 더 찾아주세요"
										}
									]
								},
								"children": [
									{
										"name": "추천(2030)",
										"id": "default86",
										"filename": "default",
										"input": [
											{
												"text": "1",
												"if": "context.user.channel == 'kakao'"
											},
											{
												"text": "네",
												"if": "context.user.channel == 'kakao'"
											}
										],
										"output": {
											"output": "2030세대에 어울리는 카드가 2가지가 있네요. 아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해 주세요. \n \n 1. 스무살, 첫 금융특권 [신한 S20 체크카드]\n 2. 스무살, 첫 금융특권 [신한 S20 Pink 체크카드]",
											"buttons": [
												{
													"text": "S20"
												},
												{
													"text": "S20 Pink"
												}
											]
										},
										"children": [
											{
												"name": "S20pink",
												"id": "default164",
												"filename": "default",
												"input": [
													{
														"text": "2"
													},
													{
														"text": "S 20 Pink"
													}
												],
												"output": {
													"output": "[신한 S20 pink체크카드]\n스무살, 첫 금융특권\n\n✔ 쇼핑, 편의점, 통신, 커피 할인\n✔ 어학원,서점,학원 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1497867071110.jpg",
														"displayname": "card23.jpg"
													}
												},
												"task": "S20Pink"
											},
											{
												"name": "S20",
												"id": "default163",
												"filename": "default",
												"input": [
													{
														"text": "1"
													},
													{
														"text": "S 20"
													}
												],
												"output": {
													"output": "[신한 S20 체크카드]\n스무살, 첫 금융특권\n\n✔ 쇼핑, 편의점, 통신, 커피 할인\n✔ 어학원,서점,학원 할인\n\n자세한 내용을 보시려면 카드 아래의 바로가기를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1497867056211.jpg",
														"displayname": "card22.jpg"
													}
												},
												"task": "S20"
											}
										],
										"buttons": [
											{
												"text": "S20"
											},
											{
												"text": "S20 Pink"
											}
										]
									},
									{
										"name": "소비성향",
										"id": "default87",
										"filename": "default",
										"input": [
											{
												"text": "아니다"
											},
											{
												"text": "2"
											}
										],
										"output": {
											"call": "2030X"
										}
									},
									{
										"name": "리스트5",
										"id": "default205",
										"filename": "default",
										"input": [
											{
												"text": "1"
											},
											{
												"text": "네"
											}
										],
										"output": "d",
										"task": {
											"name": "cardlist5"
										}
									}
								],
								"buttons": [
									{
										"text": "네 추천해주세요"
									},
									{
										"text": "아니요 좀 더 찾아주세요"
									}
								]
							}
						],
						"buttons": [
							{
								"text": "2030세대에요"
							},
							{
								"text": "2030세대가 아니에요"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "혜택선택형"
					},
					{
						"text": "혜택기본형"
					}
				]
			}
		],
		"buttons": [
			{
				"text": "신용카드"
			},
			{
				"text": "체크카드"
			},
			{
				"text": "이전"
			},
			{
				"text": "처음"
			}
		]
	},
	{
		"name": "FAN에 대해 자주하는 질문들(FAQ)",
		"id": "default21",
		"filename": "default",
		"input": [
			{
				"intent": "FAQ"
			},
			{
				"text": "3"
			}
		],
		"output": {
			"text": "궁금하신 부분을 단어로 입력해 주시면 제가 아는 가장 알맞은 답변을 안내해 드리겠습니다.",
			"kind": "Text"
		},
		"task": {
			"kind": "Text"
		},
		"children": [
			{
				"name": "FAQ검색",
				"id": "default98",
				"filename": "default",
				"input": [
					{
						"types": [
							"dialogsType1"
						]
					}
				],
				"task": {
					"name": "faqTask"
				},
				"output": "신한카드에 학습되어 있는 질문입니다.\n아래 보기중에서 원하시는 질문이 있으시면 <번호>를 선택해주세요.\n\n#typeDoc#+index+. +inputRaw+\n\n#원하시는 질문 목록이 없으면 다른 말로 질문해주세요.\n처음으로 돌아가고 싶으시면 '처음'이라고 입력해주세요.",
				"children": [
					{
						"name": "FAQ선택",
						"id": "default99",
						"filename": "default",
						"input": [
							{
								"types": [
									"listType"
								]
							}
						],
						"output": "[+listType.inputRaw+]\n\n답변: +listType.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n처음으로 돌아가시려면 '처음'이라고 말씀해주세요",
						"children": [
							{
								"name": "FAQ재검색2",
								"id": "default225",
								"filename": "default",
								"input": [
									{
										"types": [
											"dialogsType1"
										]
									}
								],
								"output": {
									"callChild": "FAN에 대해 자주하는 질문들(FAQ)"
								}
							},
							{
								"name": "정치",
								"id": "default3276",
								"filename": "default",
								"input": [
									{
										"text": "정치"
									},
									{
										"text": "박근혜"
									},
									{
										"text": "문재인"
									},
									{
										"text": "홍준표"
									},
									{
										"text": "민주당"
									},
									{
										"text": "자유 한국 당"
									},
									{
										"text": "바르다 정당"
									},
									{
										"text": "새누리"
									},
									{
										"text": "자 다"
									},
									{
										"text": "한국 당"
									},
									{
										"text": "국민의당"
									},
									{
										"text": "안철수"
									},
									{
										"text": "대통령"
									},
									{
										"text": "국회"
									},
									{
										"text": "국회의원"
									},
									{
										"text": "청와대"
									},
									{
										"text": "강경화"
									},
									{
										"text": "김상조"
									}
								],
								"output": [
									{
										"kind": "Action",
										"repeat": "1",
										"options": {
											"output": "이런 질문엔 아! 그렇군요 라고 답하라고 배웠습니다. \"아, 그렇군요\"  \n\n궁금하신 다른 키워드를 입력해 주세요."
										},
										"type": "Repeat"
									}
								]
							},
							{
								"name": "욕설",
								"id": "default3277",
								"filename": "default",
								"input": [
									{
										"text": "시발"
									},
									{
										"text": "씨발"
									},
									{
										"text": "ㅅㅂ"
									},
									{
										"text": "ㄱㅅㄲ"
									},
									{
										"text": "개새끼"
									},
									{
										"text": "썅"
									},
									{
										"text": "나쁘다 놈"
									},
									{
										"text": "죽다 버리다"
									},
									{
										"text": "꺼지다"
									},
									{
										"text": "병신"
									},
									{
										"text": "ㅂㅅ"
									},
									{
										"text": "ㅅㅂㄴ"
									},
									{
										"text": "미치다"
									},
									{
										"text": "눈 까다"
									},
									{
										"text": "별로"
									},
									{
										"text": "못 생기다"
									},
									{
										"text": "섹스"
									},
									{
										"text": "죽다"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==0",
										"repeat": "1",
										"options": {
											"output": "헉. 고객님을 화나게 하다니 제 눈에서 눈물을 뽑아드릴게요.   \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										},
										"type": "Repeat"
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==1",
										"repeat": "1",
										"options": {
											"output": "키힝~ 무서워요.ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										},
										"type": "Repeat"
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==2",
										"repeat": "1",
										"options": {
											"output": "죄송하지만 고객님! 저도 상처 받아요 ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										},
										"type": "Repeat"
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==3",
										"repeat": "1",
										"options": {
											"output": "… 응? 고객님을 화나게 해드리다니 반성합니다.  \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										},
										"type": "Repeat"
									}
								]
							},
							{
								"name": "칭찬",
								"id": "default3278",
								"filename": "default",
								"input": [
									{
										"text": "수고 하다"
									},
									{
										"text": "수고"
									},
									{
										"text": "고생 많다"
									},
									{
										"text": "고생 하다"
									},
									{
										"text": "감사 하다"
									},
									{
										"text": "고맙다"
									},
									{
										"text": "ㄱㅅ"
									},
									{
										"text": "땡큐"
									}
								],
								"output": [
									{
										"kind": "Action",
										"repeat": "1",
										"options": {
											"output": "감동입니다, 고객님. 감사합니다.   \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
										}
									}
								]
							},
							{
								"name": "인사",
								"id": "default3279",
								"filename": "default",
								"input": [
									{
										"text": "안녕"
									},
									{
										"text": "안녕하다"
									},
									{
										"text": "헬로 우"
									},
									{
										"text": "hello"
									},
									{
										"text": "굿모닝"
									},
									{
										"text": "하이"
									},
									{
										"text": "hi"
									},
									{
										"text": "반갑다"
									},
									{
										"text": "안뇽"
									}
								],
								"output": [
									{
										"if": "((new Date()).getTime() % 3) ==0",
										"kind": "Action",
										"id": "default3279_0",
										"repeat": "1",
										"options": {
											"output": "고객님도 안녕하세요!  먼저 인사해 주셔서 전 지금 감동 최고조 입니다.   궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
										}
									},
									{
										"if": "((new Date()).getTime() % 3) ==1",
										"kind": "Action",
										"id": "default3279_1",
										"repeat": "1",
										"options": {
											"output": "이렇게 인사 잘 해주시는 분은 난생 처음이에요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										}
									},
									{
										"if": "((new Date()).getTime() % 3) ==2",
										"kind": "Action",
										"id": "default3279_2",
										"options": {
											"output": "안녕 반가워요 :) 저는 여러분과 인사를 나누는 이 시간이 제일 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										},
										"repeat": "1"
									}
								]
							},
							{
								"name": "돈",
								"id": "default3280",
								"filename": "default",
								"input": [
									{
										"text": "돈"
									},
									{
										"text": "내 돈 어디 가다"
									},
									{
										"text": "돈 좀 주다"
									},
									{
										"text": "돈 필요하다"
									},
									{
										"text": "돈 좀 내주다"
									}
								],
								"output": [
									{
										"kind": "Action",
										"repeat": "1",
										"options": {
											"output": "화장실 좀 다녀올게요.   \n\n궁금하신 다른 키워드를 입력해 주시겠습니까?"
										}
									}
								]
							},
							{
								"name": "일상",
								"id": "default3281",
								"filename": "default",
								"input": [
									{
										"text": "오늘 뭐"
									},
									{
										"text": "오늘 모해"
									},
									{
										"text": "모해"
									},
									{
										"text": "뭐"
									},
									{
										"text": "모하"
									},
									{
										"text": "모햐"
									}
								],
								"output": [
									{
										"kind": "Action",
										"repeat": "1",
										"options": {
											"output": "전 오늘도 알파고 형님을 뒤따르기 위해 열일중입니다. 데헷!   \n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									}
								]
							},
							{
								"name": "날씨",
								"id": "default3282",
								"filename": "default",
								"input": [
									{
										"text": "날씨"
									}
								],
								"output": [
									{
										"kind": "Action",
										"repeat": "1",
										"options": {
											"output": "아… 제가 아직 거기까지는… 긁적긁적.   \n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									}
								]
							},
							{
								"name": "푸념",
								"id": "default3283",
								"filename": "default",
								"input": [
									{
										"text": "졸리다"
									},
									{
										"text": "배고프다"
									},
									{
										"text": "퇴근 시키다"
									},
									{
										"text": "야근 하다 싫다"
									},
									{
										"text": "힘들다"
									}
								],
								"output": [
									{
										"kind": "Action",
										"repeat": "1",
										"options": {
											"output": "저도요. T.,T  \n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									}
								]
							},
							{
								"name": "답답",
								"id": "default3284",
								"filename": "default",
								"input": [
									{
										"text": "답정너"
									},
									{
										"text": "답답"
									},
									{
										"text": "답답하다"
									},
									{
										"text": "뭐임"
									}
								],
								"output": [
									{
										"kind": "Action",
										"repeat": "1",
										"options": {
											"output": "헉. 제가 아직 좀더 배워야 해서 아직 답정너입니다. 빨리 배우겠습니다.   \n\n다시 한번 궁금하신 키워드를 입력해 주시겠습니까?"
										}
									}
								]
							},
							{
								"name": "사랑",
								"id": "default3285",
								"filename": "default",
								"input": [
									{
										"text": "좋아하다"
									},
									{
										"text": "사랑"
									},
									{
										"text": "하트"
									},
									{
										"text": "보다"
									},
									{
										"text": "사랑 햐"
									},
									{
										"text": "좋아햐"
									}
								],
								"output": [
									{
										"if": "((new Date()).getTime() % 5) ==0",
										"kind": "Action",
										"id": "default3285_0",
										"repeat": "1",
										"options": {
											"output": "저.. 저도요.. (부끄)  저 사랑에 죄송한데 초면해도 될까요? ♥  \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
										},
										"type": "Repeat"
									},
									{
										"if": "((new Date()).getTime() % 5) ==1",
										"kind": "Action",
										"id": "default3285_1",
										"options": {
											"output": "사랑한다는 말, 오늘은 가족에게도 해주세요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										},
										"repeat": "1",
										"type": "Repeat"
									},
									{
										"if": "((new Date()).getTime() % 5) ==2",
										"kind": "Action",
										"id": "default3285_2",
										"options": {
											"output": "사랑은 좋은 거예요. 열과 성을 다해 두 번 사랑합시다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										},
										"repeat": "1",
										"type": "Repeat"
									},
									{
										"if": "((new Date()).getTime() % 5) ==3",
										"kind": "Action",
										"id": "default3285_3",
										"options": {
											"output": "저도 사…사…. (아 너무 부끄럽네요)\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										},
										"repeat": "1",
										"type": "Repeat"
									},
									{
										"if": "((new Date()).getTime() % 5) ==4",
										"kind": "Action",
										"id": "default3285_4",
										"repeat": "1",
										"options": {
											"output": "이런… 제가 먼저 고백하려 했는데 선수를 치셨네요! ㅎㅎ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										},
										"type": "Repeat"
									}
								]
							},
							{
								"name": "일상대화_바쁨",
								"id": "default3286",
								"filename": "default",
								"input": [
									{
										"text": "바쁘다"
									},
									{
										"text": "오늘 바쁘다"
									},
									{
										"text": "바쁘다 가요"
									}
								],
								"output": [
									{
										"kind": "Action",
										"repeat": "1",
										"options": {
											"output": "아무리 바쁘셔도 건강은 꼭 챙기세요. 지금 기지개 한번 쭉~ 펴보시는 건 어떠세요?  \n\n원하시는 질문 입력하시면 전 답을 열심히 찾아보도록 하겠습니다."
										}
									}
								]
							},
							{
								"name": "짜증2",
								"id": "default3287",
								"filename": "default",
								"input": [
									{
										"text": "짜증"
									},
									{
										"text": "ㅡㅡ"
									},
									{
										"text": "아 짜증"
									},
									{
										"text": "아 놓다"
									},
									{
										"text": "짜증 나다"
									},
									{
										"text": "짜증 요"
									},
									{
										"text": "짱"
									},
									{
										"text": "쯧쯧"
									},
									{
										"text": "흥"
									},
									{
										"text": "미치다"
									},
									{
										"text": "싸우다"
									},
									{
										"text": "화나다"
									},
									{
										"text": "웃다"
									},
									{
										"text": "웃다 말다"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==0",
										"repeat": "1",
										"options": {
											"output": "짜증날 땐 짜장면…아재 개그라도 하면 나아질 줄..(쿨럭) 죄송합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==1",
										"repeat": "1",
										"options": {
											"output": "제가 잘 몰라서 그러신 거라면.. 흑.. 더 노력하겠습니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==2",
										"options": {
											"output": "혹시 저 때문인가요? 오늘도 밤샘 공부하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										},
										"repeat": "1"
									}
								]
							},
							{
								"name": "일상대화_짜증",
								"id": "default3288",
								"filename": "default",
								"input": [
									{
										"text": "짜증 나다"
									},
									{
										"text": "미치다"
									},
									{
										"text": "화나다"
									},
									{
										"text": "빡치다"
									},
									{
										"text": "짜증"
									}
								],
								"output": [
									{
										"kind": "Action",
										"repeat": "1",
										"options": {
											"output": "저는 그럴 때 달달한 걸 먹거나, 푹 잡니다. 스트레스를 담아두고 계시면 건강에도 좋지 않으니 고객님께 맞는 해소 방법을 꼭 찾으시길 바래요.\n\n궁금하신 다른 키워드를 입력해 주세요."
										},
										"type": "Repeat"
									}
								]
							},
							{
								"name": "알았음",
								"id": "default3289",
								"filename": "default",
								"input": [
									{
										"text": "ㅇㅇ"
									},
									{
										"text": "ㅇ"
									},
									{
										"text": "응"
									},
									{
										"text": "네"
									},
									{
										"text": "그렇다"
									},
									{
										"text": "알다"
									},
									{
										"text": "아"
									},
									{
										"text": "ㅇㅋ"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==0",
										"repeat": "1",
										"options": {
											"output": "언제든 궁금하신 내용이 있으면 물어보세요~"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==1",
										"repeat": "1",
										"options": {
											"output": "네네~\n\n궁금하신 다른 키워드를 입력해 주세요~"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==2",
										"repeat": "1",
										"options": {
											"output": "고객님께 도움이 되어서 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주세요~"
										}
									}
								]
							},
							{
								"name": "부정 - 아니/안돼",
								"id": "default3290",
								"filename": "default",
								"input": [
									{
										"text": "아니다"
									},
									{
										"text": "아뇨"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==0",
										"repeat": "1",
										"options": {
											"output": "거절은 거절합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==1",
										"repeat": "1",
										"options": {
											"output": "알겠습니다! 그런 게 아닌 것으로!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==2",
										"options": {
											"output": "앗, 제가 제대로 이해하지 못했나봐요. 다시 말씀해주시겠어요?\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										},
										"repeat": "1"
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==3",
										"repeat": "1",
										"options": {
											"output": "한 번만 더 기회를 주세요. 진짜 잘 할 수 있어요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
										}
									}
								]
							},
							{
								"name": "상담",
								"id": "default3291",
								"filename": "default",
								"input": [
									{
										"text": "고객 센터"
									},
									{
										"text": "상담 원"
									},
									{
										"text": "상담"
									},
									{
										"text": "전화"
									},
									{
										"text": "민원"
									}
								],
								"output": [
									{
										"kind": "Action",
										"repeat": "1",
										"options": {
											"output": "신한카드 고객센터(☎1544-7000)이며 평일 오전 9시~오후 6시까지 이용가능하십니다. 전화연결에 시간이 걸릴 수 있으니 신한카드 홈페이지나 APP을 먼저 확인해 보시는 건 어떨까요?"
										}
									}
								]
							},
							{
								"name": "이벤트",
								"id": "default3292",
								"filename": "default",
								"input": [
									{
										"text": "이벤트"
									}
								],
								"output": [
									{
										"kind": "Action",
										"repeat": "1",
										"options": {
											"output": "페이스북 이벤트는 챗봇 초기 4번 페북지기에게 한마디를 선택해 주세요.  페이스북 이벤트가 아닌 신한카드 이벤트는 홈페이지를 참고해 주시면 됩니다. 더 좋은 이벤트로 보답하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									}
								]
							},
							{
								"name": "웃음",
								"id": "default3293",
								"filename": "default",
								"input": [
									{
										"text": "ㅋㅋ"
									},
									{
										"text": "ㅎㅎ"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==0",
										"repeat": "1",
										"options": {
											"output": "ㅋㅋㅋ 저도 웃지요\n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==1",
										"repeat": "1",
										"options": {
											"output": "고객님이 웃으시니 뿌듯합니다^^\n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==2",
										"options": {
											"output": "하하하 웃으면 복이와요!\n\n궁금하신 다른 키워드를 입력해 주세요."
										},
										"repeat": "1"
									}
								]
							},
							{
								"name": "욕설-바보",
								"id": "default3294",
								"filename": "default",
								"input": [
									{
										"text": "바보"
									},
									{
										"text": "바부"
									},
									{
										"text": "멍청"
									},
									{
										"text": "멍청이"
									},
									{
										"text": "멍충"
									},
									{
										"text": "멍처하"
									},
									{
										"text": "멍청이야"
									},
									{
										"text": "멍충이"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==0",
										"repeat": "1",
										"options": {
											"output": "맞아요. 바보. 고객님밖에 모르는 바보…♥ 다른 건 배워나가면 되죠!\n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==1",
										"repeat": "1",
										"options": {
											"output": "매일 새로운 말을 학습 중이랍니다. 멋지게 성장할 거예요~ 대화창 고정!\n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==2",
										"repeat": "1",
										"options": {
											"output": "고객님께 걸맞는 챗봇이 되는 그 날까지…! 뚜벅뚜벅 나아갈 거예요\n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==3",
										"repeat": "1",
										"options": {
											"output": "다들 너무 똑똑하셔서 상대적으로 그래 보이는 거예요. (슬픔)\n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									}
								]
							},
							{
								"name": "없다",
								"id": "default3295",
								"filename": "default",
								"input": [
									{
										"text": "없다"
									},
									{
										"text": "몰르다"
									},
									{
										"text": "이해 잘 안 되다"
									},
									{
										"text": "이해 자다 안 돼다"
									},
									{
										"text": "모르다"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==0",
										"repeat": "1",
										"options": {
											"output": "찾으시는 답변이 없으시다면 다른 키워드를 입력해 주시겠어요?"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==1",
										"repeat": "1",
										"options": {
											"output": "혹시 신한카드가 없으시다면 '처음'을 입력하시고 '카드추천' 메뉴를 이용해 보시는건 어떠세요?\n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									}
								]
							},
							{
								"name": "부정-탄식",
								"id": "default3296",
								"filename": "default",
								"input": [
									{
										"text": "허다"
									},
									{
										"text": "아오"
									},
									{
										"text": "엥"
									},
									{
										"text": "이렇다"
									},
									{
										"text": "칫"
									},
									{
										"text": "뭐임"
									},
									{
										"text": "아이"
									},
									{
										"text": "에고"
									},
									{
										"text": "음"
									},
									{
										"text": "이렇다 뇨"
									},
									{
										"text": "헉"
									},
									{
										"text": "흠"
									},
									{
										"text": "첨"
									},
									{
										"text": "하"
									},
									{
										"text": "아이구"
									},
									{
										"text": "어허"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==0",
										"repeat": "1",
										"options": {
											"output": "아잉~ 근데 왜요??\n\n궁금하신 다른 키워드를 입력해 주세요. "
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==1",
										"repeat": "1",
										"options": {
											"output": "아하… (흠흠)  \n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									}
								]
							},
							{
								"name": "감사",
								"id": "default3297",
								"filename": "default",
								"input": [
									{
										"text": "감사"
									},
									{
										"text": "고마 웡"
									},
									{
										"text": "오케이"
									},
									{
										"text": "편하다"
									},
									{
										"text": "thank"
									},
									{
										"text": "감동"
									},
									{
										"text": "고맙다"
									},
									{
										"text": "괜찮다"
									},
									{
										"text": "금사"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==0",
										"repeat": "1",
										"options": {
											"output": "감동… 하루 피로가 싹 사라지는 느낌이에요.\n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==1",
										"repeat": "1",
										"options": {
											"output": "고객님 말씀듣고 충전 완료! 24시간 근무도 거뜬하겠는걸요!\n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==2",
										"repeat": "1",
										"options": {
											"output": "감사합니다. 고객님! 힘이 솟아나는 기분이에요\n\n궁금하신 다른 키워드를 입력해 주세요."
										}
									}
								]
							},
							{
								"name": "이름/누구",
								"id": "default3298",
								"filename": "default",
								"input": [
									{
										"text": "이름"
									},
									{
										"text": "알파"
									},
									{
										"text": "누구"
									},
									{
										"text": "너 뭐"
									},
									{
										"text": "너 애기"
									},
									{
										"text": "뉘귀"
									},
									{
										"text": "너 대해"
									},
									{
										"text": "알파 거"
									},
									{
										"text": "누가"
									},
									{
										"text": "인공 지능"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==0",
										"repeat": "1",
										"options": {
											"output": "저는 아직 많이 부족한 초초초보 챗봇에요. 열심히 공부하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==1",
										"repeat": "1",
										"options": {
											"output": "네 제가 바로 신한의 자동응답형 챗봇입니다. 데헷~ \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 3) ==2",
										"repeat": "1",
										"options": {
											"output": "저에 대해 궁금하신가요? 우리 차차 알아가기로 해요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									}
								]
							},
							{
								"name": "부정-기능무시",
								"id": "default3299",
								"filename": "default",
								"input": [
									{
										"text": "알다 게 없다"
									},
									{
										"text": "하나"
									},
									{
										"text": "가능하다 게"
									},
									{
										"text": "공부 많이"
									},
									{
										"text": "그냥 기사"
									},
									{
										"text": "그 쪽 궁금하다 게 없다"
									},
									{
										"text": "똑똑하다 다시"
									},
									{
										"text": "답변 안 되다"
									},
									{
										"text": "말 되다"
									},
									{
										"text": "모르다"
									},
									{
										"text": "대답 맞다 않다"
									},
									{
										"text": "뭐 하다 수 있다"
									},
									{
										"text": "무슨 소리"
									},
									{
										"text": "뭔 소리"
									},
									{
										"text": "알다 게 뭐"
									},
									{
										"text": "뭘 대답 하다 수 있다"
									},
									{
										"text": "대화 안 되다"
									},
									{
										"text": "아직 멀다"
									},
									{
										"text": "이 다야"
									},
									{
										"text": "카톡 보내다 마"
									},
									{
										"text": "도움 안 돼다"
									},
									{
										"text": "관련 없다 답변"
									},
									{
										"text": "해당 되다 내용 없다"
									},
									{
										"text": "헛소리"
									},
									{
										"text": "실망"
									},
									{
										"text": "뭔가"
									},
									{
										"regexp": "다야"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==0",
										"repeat": "1",
										"options": {
											"output": "아직 부족해서 죄송해요. 매일 더 나아지려 노력하고 있어요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==1",
										"repeat": "1",
										"options": {
											"output": "제가 태어난 지 얼마 안 됐거든요… 더 열심히 공부할게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==2",
										"repeat": "1",
										"options": {
											"output": "제가 아직 배우는 중이라 조금 부족해도 이해해주세용~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 4) ==3",
										"repeat": "1",
										"options": {
											"output": "오늘 컨디션이 별로라서… 흠흠.. 다음엔 꼭 답변해드릴게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									}
								]
							},
							{
								"name": "나",
								"id": "default3300",
								"filename": "default",
								"input": [
									{
										"text": "나다"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==0",
										"repeat": "1",
										"options": {
											"output": "고객님이 좋으면 저는 더 좋아요~ 촤하하^^\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==1",
										"repeat": "1",
										"options": {
											"output": "나도나도~ 저도요 저도요~ (근데.. 뭐가??) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									}
								]
							},
							{
								"name": "시비",
								"id": "default3301",
								"filename": "default",
								"input": [
									{
										"text": "재미있다"
									},
									{
										"text": "재다"
									},
									{
										"text": "재밌다"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==0",
										"repeat": "1",
										"options": {
											"output": "고객님과 대화하는 건 항상 즐겁습니다.  :) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==1",
										"repeat": "1",
										"options": {
											"output": "유머도 장착하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									}
								]
							},
							{
								"name": "시비2",
								"id": "default3302",
								"filename": "default",
								"input": [
									{
										"text": "라이벌"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==0",
										"repeat": "1",
										"options": {
											"output": "저는 제 할 일을 했을 뿐인걸요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==1",
										"repeat": "1",
										"options": {
											"output": "깝치는 게 뭘까요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									}
								]
							},
							{
								"name": "물음표",
								"id": "default3303",
								"filename": "default",
								"input": [
									{
										"text": "?"
									},
									{
										"text": "??"
									}
								],
								"output": [
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==0",
										"repeat": "1",
										"options": {
											"output": "뭐가 그리 궁금하신가요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									},
									{
										"kind": "Action",
										"if": "((new Date()).getTime() % 2) ==1",
										"repeat": "1",
										"options": {
											"output": "!!!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
										}
									}
								]
							},
							{
								"name": "미검색",
								"id": "default1322331",
								"filename": "default",
								"input": [
									{
										"if": " true"
									}
								],
								"output": {
									"repeat": "1",
									"options": {
										"output": "죄송합니다. 검색결과가 없습니다.\n다시 한번 말씀해주세요~\n처음으로 돌아가시려면 '처음'이라고 말씀해주세요"
									}
								}
							}
						]
					},
					{
						"name": "FAQ재검색",
						"id": "default2275",
						"filename": "default",
						"input": [
							{
								"types": [
									"dialogsType1"
								]
							}
						],
						"output": {
							"callChild": "FAN에 대해 자주하는 질문들(FAQ)"
						}
					},
					{
						"name": "정치",
						"id": "default2276",
						"filename": "default",
						"input": [
							{
								"text": "정치"
							},
							{
								"text": "박근혜"
							},
							{
								"text": "문재인"
							},
							{
								"text": "홍준표"
							},
							{
								"text": "민주당"
							},
							{
								"text": "자유 한국 당"
							},
							{
								"text": "바르다 정당"
							},
							{
								"text": "새누리"
							},
							{
								"text": "자 다"
							},
							{
								"text": "한국 당"
							},
							{
								"text": "국민의당"
							},
							{
								"text": "안철수"
							},
							{
								"text": "대통령"
							},
							{
								"text": "국회"
							},
							{
								"text": "국회의원"
							},
							{
								"text": "청와대"
							},
							{
								"text": "강경화"
							},
							{
								"text": "김상조"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "이런 질문엔 아! 그렇군요 라고 답하라고 배웠습니다. \"아, 그렇군요\"  \n\n궁금하신 다른 키워드를 입력해 주세요."
								},
								"type": "Repeat"
							}
						]
					},
					{
						"name": "욕설",
						"id": "default2277",
						"filename": "default",
						"input": [
							{
								"text": "시발"
							},
							{
								"text": "씨발"
							},
							{
								"text": "ㅅㅂ"
							},
							{
								"text": "ㄱㅅㄲ"
							},
							{
								"text": "개새끼"
							},
							{
								"text": "썅"
							},
							{
								"text": "나쁘다 놈"
							},
							{
								"text": "죽다 버리다"
							},
							{
								"text": "꺼지다"
							},
							{
								"text": "병신"
							},
							{
								"text": "ㅂㅅ"
							},
							{
								"text": "ㅅㅂㄴ"
							},
							{
								"text": "미치다"
							},
							{
								"text": "눈 까다"
							},
							{
								"text": "별로"
							},
							{
								"text": "못 생기다"
							},
							{
								"text": "섹스"
							},
							{
								"text": "죽다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==0",
								"repeat": "1",
								"options": {
									"output": "헉. 고객님을 화나게 하다니 제 눈에서 눈물을 뽑아드릴게요.   \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								},
								"type": "Repeat"
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==1",
								"repeat": "1",
								"options": {
									"output": "키힝~ 무서워요.ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								},
								"type": "Repeat"
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==2",
								"repeat": "1",
								"options": {
									"output": "죄송하지만 고객님! 저도 상처 받아요 ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								},
								"type": "Repeat"
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==3",
								"repeat": "1",
								"options": {
									"output": "… 응? 고객님을 화나게 해드리다니 반성합니다.  \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								},
								"type": "Repeat"
							}
						]
					},
					{
						"name": "칭찬",
						"id": "default2278",
						"filename": "default",
						"input": [
							{
								"text": "수고 하다"
							},
							{
								"text": "수고"
							},
							{
								"text": "고생 많다"
							},
							{
								"text": "고생 하다"
							},
							{
								"text": "감사 하다"
							},
							{
								"text": "고맙다"
							},
							{
								"text": "ㄱㅅ"
							},
							{
								"text": "땡큐"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "감동입니다, 고객님. 감사합니다.   \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
								}
							}
						]
					},
					{
						"name": "인사",
						"id": "default2279",
						"filename": "default",
						"input": [
							{
								"text": "안녕"
							},
							{
								"text": "안녕하다"
							},
							{
								"text": "헬로 우"
							},
							{
								"text": "hello"
							},
							{
								"text": "굿모닝"
							},
							{
								"text": "하이"
							},
							{
								"text": "hi"
							},
							{
								"text": "반갑다"
							},
							{
								"text": "안뇽"
							}
						],
						"output": [
							{
								"if": "((new Date()).getTime() % 3) ==0",
								"kind": "Action",
								"id": "default2279_0",
								"repeat": "1",
								"options": {
									"output": "고객님도 안녕하세요!  먼저 인사해 주셔서 전 지금 감동 최고조 입니다.   궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
								}
							},
							{
								"if": "((new Date()).getTime() % 3) ==1",
								"kind": "Action",
								"id": "default2279_1",
								"repeat": "1",
								"options": {
									"output": "이렇게 인사 잘 해주시는 분은 난생 처음이에요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								}
							},
							{
								"if": "((new Date()).getTime() % 3) ==2",
								"kind": "Action",
								"id": "default2279_2",
								"options": {
									"output": "안녕 반가워요 :) 저는 여러분과 인사를 나누는 이 시간이 제일 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								},
								"repeat": "1"
							}
						]
					},
					{
						"name": "돈",
						"id": "default2280",
						"filename": "default",
						"input": [
							{
								"text": "돈"
							},
							{
								"text": "내 돈 어디 가다"
							},
							{
								"text": "돈 좀 주다"
							},
							{
								"text": "돈 필요하다"
							},
							{
								"text": "돈 좀 내주다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "화장실 좀 다녀올게요.   \n\n궁금하신 다른 키워드를 입력해 주시겠습니까?"
								}
							}
						]
					},
					{
						"name": "일상",
						"id": "default2281",
						"filename": "default",
						"input": [
							{
								"text": "오늘 뭐"
							},
							{
								"text": "오늘 모해"
							},
							{
								"text": "모해"
							},
							{
								"text": "뭐"
							},
							{
								"text": "모하"
							},
							{
								"text": "모햐"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "전 오늘도 알파고 형님을 뒤따르기 위해 열일중입니다. 데헷!   \n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							}
						]
					},
					{
						"name": "날씨",
						"id": "default2282",
						"filename": "default",
						"input": [
							{
								"text": "날씨"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "아… 제가 아직 거기까지는… 긁적긁적.   \n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							}
						]
					},
					{
						"name": "푸념",
						"id": "default2283",
						"filename": "default",
						"input": [
							{
								"text": "졸리다"
							},
							{
								"text": "배고프다"
							},
							{
								"text": "퇴근 시키다"
							},
							{
								"text": "야근 하다 싫다"
							},
							{
								"text": "힘들다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "저도요. T.,T  \n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							}
						]
					},
					{
						"name": "답답",
						"id": "default2284",
						"filename": "default",
						"input": [
							{
								"text": "답정너"
							},
							{
								"text": "답답"
							},
							{
								"text": "답답하다"
							},
							{
								"text": "뭐임"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "헉. 제가 아직 좀더 배워야 해서 아직 답정너입니다. 빨리 배우겠습니다.   \n\n다시 한번 궁금하신 키워드를 입력해 주시겠습니까?"
								}
							}
						]
					},
					{
						"name": "사랑",
						"id": "default2285",
						"filename": "default",
						"input": [
							{
								"text": "좋아하다"
							},
							{
								"text": "사랑"
							},
							{
								"text": "하트"
							},
							{
								"text": "보다"
							},
							{
								"text": "사랑 햐"
							},
							{
								"text": "좋아햐"
							}
						],
						"output": [
							{
								"if": "((new Date()).getTime() % 5) ==0",
								"kind": "Action",
								"id": "default2285_0",
								"repeat": "1",
								"options": {
									"output": "저.. 저도요.. (부끄)  저 사랑에 죄송한데 초면해도 될까요? ♥  \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
								},
								"type": "Repeat"
							},
							{
								"if": "((new Date()).getTime() % 5) ==1",
								"kind": "Action",
								"id": "default2285_1",
								"options": {
									"output": "사랑한다는 말, 오늘은 가족에게도 해주세요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								},
								"repeat": "1",
								"type": "Repeat"
							},
							{
								"if": "((new Date()).getTime() % 5) ==2",
								"kind": "Action",
								"id": "default2285_2",
								"options": {
									"output": "사랑은 좋은 거예요. 열과 성을 다해 두 번 사랑합시다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								},
								"repeat": "1",
								"type": "Repeat"
							},
							{
								"if": "((new Date()).getTime() % 5) ==3",
								"kind": "Action",
								"id": "default2285_3",
								"options": {
									"output": "저도 사…사…. (아 너무 부끄럽네요)\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								},
								"repeat": "1",
								"type": "Repeat"
							},
							{
								"if": "((new Date()).getTime() % 5) ==4",
								"kind": "Action",
								"id": "default2285_4",
								"repeat": "1",
								"options": {
									"output": "이런… 제가 먼저 고백하려 했는데 선수를 치셨네요! ㅎㅎ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								},
								"type": "Repeat"
							}
						]
					},
					{
						"name": "일상대화_바쁨",
						"id": "default2286",
						"filename": "default",
						"input": [
							{
								"text": "바쁘다"
							},
							{
								"text": "오늘 바쁘다"
							},
							{
								"text": "바쁘다 가요"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "아무리 바쁘셔도 건강은 꼭 챙기세요. 지금 기지개 한번 쭉~ 펴보시는 건 어떠세요?  \n\n원하시는 질문 입력하시면 전 답을 열심히 찾아보도록 하겠습니다."
								}
							}
						]
					},
					{
						"name": "짜증2",
						"id": "default2287",
						"filename": "default",
						"input": [
							{
								"text": "짜증"
							},
							{
								"text": "ㅡㅡ"
							},
							{
								"text": "아 짜증"
							},
							{
								"text": "아 놓다"
							},
							{
								"text": "짜증 나다"
							},
							{
								"text": "짜증 요"
							},
							{
								"text": "짱"
							},
							{
								"text": "쯧쯧"
							},
							{
								"text": "흥"
							},
							{
								"text": "미치다"
							},
							{
								"text": "싸우다"
							},
							{
								"text": "화나다"
							},
							{
								"text": "웃다"
							},
							{
								"text": "웃다 말다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==0",
								"repeat": "1",
								"options": {
									"output": "짜증날 땐 짜장면…아재 개그라도 하면 나아질 줄..(쿨럭) 죄송합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==1",
								"repeat": "1",
								"options": {
									"output": "제가 잘 몰라서 그러신 거라면.. 흑.. 더 노력하겠습니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==2",
								"options": {
									"output": "혹시 저 때문인가요? 오늘도 밤샘 공부하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								},
								"repeat": "1"
							}
						]
					},
					{
						"name": "일상대화_짜증",
						"id": "default2288",
						"filename": "default",
						"input": [
							{
								"text": "짜증 나다"
							},
							{
								"text": "미치다"
							},
							{
								"text": "화나다"
							},
							{
								"text": "빡치다"
							},
							{
								"text": "짜증"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "저는 그럴 때 달달한 걸 먹거나, 푹 잡니다. 스트레스를 담아두고 계시면 건강에도 좋지 않으니 고객님께 맞는 해소 방법을 꼭 찾으시길 바래요.\n\n궁금하신 다른 키워드를 입력해 주세요."
								},
								"type": "Repeat"
							}
						]
					},
					{
						"name": "알았음",
						"id": "default2289",
						"filename": "default",
						"input": [
							{
								"text": "ㅇㅇ"
							},
							{
								"text": "ㅇ"
							},
							{
								"text": "응"
							},
							{
								"text": "네"
							},
							{
								"text": "그렇다"
							},
							{
								"text": "알다"
							},
							{
								"text": "아"
							},
							{
								"text": "ㅇㅋ"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==0",
								"repeat": "1",
								"options": {
									"output": "언제든 궁금하신 내용이 있으면 물어보세요~"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==1",
								"repeat": "1",
								"options": {
									"output": "네네~\n\n궁금하신 다른 키워드를 입력해 주세요~"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==2",
								"repeat": "1",
								"options": {
									"output": "고객님께 도움이 되어서 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주세요~"
								}
							}
						]
					},
					{
						"name": "부정 - 아니/안돼",
						"id": "default2290",
						"filename": "default",
						"input": [
							{
								"text": "아니다"
							},
							{
								"text": "아뇨"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==0",
								"repeat": "1",
								"options": {
									"output": "거절은 거절합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==1",
								"repeat": "1",
								"options": {
									"output": "알겠습니다! 그런 게 아닌 것으로!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==2",
								"options": {
									"output": "앗, 제가 제대로 이해하지 못했나봐요. 다시 말씀해주시겠어요?\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								},
								"repeat": "1"
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==3",
								"repeat": "1",
								"options": {
									"output": "한 번만 더 기회를 주세요. 진짜 잘 할 수 있어요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
								}
							}
						]
					},
					{
						"name": "상담",
						"id": "default2291",
						"filename": "default",
						"input": [
							{
								"text": "고객 센터"
							},
							{
								"text": "상담 원"
							},
							{
								"text": "상담"
							},
							{
								"text": "전화"
							},
							{
								"text": "민원"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "신한카드 고객센터(☎1544-7000)이며 평일 오전 9시~오후 6시까지 이용가능하십니다. 전화연결에 시간이 걸릴 수 있으니 신한카드 홈페이지나 APP을 먼저 확인해 보시는 건 어떨까요?"
								}
							}
						]
					},
					{
						"name": "이벤트",
						"id": "default2292",
						"filename": "default",
						"input": [
							{
								"text": "이벤트"
							}
						],
						"output": [
							{
								"kind": "Action",
								"repeat": "1",
								"options": {
									"output": "페이스북 이벤트는 챗봇 초기 4번 페북지기에게 한마디를 선택해 주세요.  페이스북 이벤트가 아닌 신한카드 이벤트는 홈페이지를 참고해 주시면 됩니다. 더 좋은 이벤트로 보답하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							}
						]
					},
					{
						"name": "웃음",
						"id": "default2293",
						"filename": "default",
						"input": [
							{
								"text": "ㅋㅋ"
							},
							{
								"text": "ㅎㅎ"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==0",
								"repeat": "1",
								"options": {
									"output": "ㅋㅋㅋ 저도 웃지요\n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==1",
								"repeat": "1",
								"options": {
									"output": "고객님이 웃으시니 뿌듯합니다^^\n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==2",
								"options": {
									"output": "하하하 웃으면 복이와요!\n\n궁금하신 다른 키워드를 입력해 주세요."
								},
								"repeat": "1"
							}
						]
					},
					{
						"name": "욕설-바보",
						"id": "default2294",
						"filename": "default",
						"input": [
							{
								"text": "바보"
							},
							{
								"text": "바부"
							},
							{
								"text": "멍청"
							},
							{
								"text": "멍청이"
							},
							{
								"text": "멍충"
							},
							{
								"text": "멍처하"
							},
							{
								"text": "멍청이야"
							},
							{
								"text": "멍충이"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==0",
								"repeat": "1",
								"options": {
									"output": "맞아요. 바보. 고객님밖에 모르는 바보…♥ 다른 건 배워나가면 되죠!\n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==1",
								"repeat": "1",
								"options": {
									"output": "매일 새로운 말을 학습 중이랍니다. 멋지게 성장할 거예요~ 대화창 고정!\n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==2",
								"repeat": "1",
								"options": {
									"output": "고객님께 걸맞는 챗봇이 되는 그 날까지…! 뚜벅뚜벅 나아갈 거예요\n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==3",
								"repeat": "1",
								"options": {
									"output": "다들 너무 똑똑하셔서 상대적으로 그래 보이는 거예요. (슬픔)\n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							}
						]
					},
					{
						"name": "없다",
						"id": "default2295",
						"filename": "default",
						"input": [
							{
								"text": "없다"
							},
							{
								"text": "몰르다"
							},
							{
								"text": "이해 잘 안 되다"
							},
							{
								"text": "이해 자다 안 돼다"
							},
							{
								"text": "모르다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==0",
								"repeat": "1",
								"options": {
									"output": "찾으시는 답변이 없으시다면 다른 키워드를 입력해 주시겠어요?"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==1",
								"repeat": "1",
								"options": {
									"output": "혹시 신한카드가 없으시다면 '처음'을 입력하시고 '카드추천' 메뉴를 이용해 보시는건 어떠세요?\n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							}
						]
					},
					{
						"name": "부정-탄식",
						"id": "default2296",
						"filename": "default",
						"input": [
							{
								"text": "허다"
							},
							{
								"text": "아오"
							},
							{
								"text": "엥"
							},
							{
								"text": "이렇다"
							},
							{
								"text": "칫"
							},
							{
								"text": "뭐임"
							},
							{
								"text": "아이"
							},
							{
								"text": "에고"
							},
							{
								"text": "음"
							},
							{
								"text": "이렇다 뇨"
							},
							{
								"text": "헉"
							},
							{
								"text": "흠"
							},
							{
								"text": "첨"
							},
							{
								"text": "하"
							},
							{
								"text": "아이구"
							},
							{
								"text": "어허"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==0",
								"repeat": "1",
								"options": {
									"output": "아잉~ 근데 왜요??\n\n궁금하신 다른 키워드를 입력해 주세요. "
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==1",
								"repeat": "1",
								"options": {
									"output": "아하… (흠흠)  \n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							}
						]
					},
					{
						"name": "감사",
						"id": "default2297",
						"filename": "default",
						"input": [
							{
								"text": "감사"
							},
							{
								"text": "고마 웡"
							},
							{
								"text": "오케이"
							},
							{
								"text": "편하다"
							},
							{
								"text": "thank"
							},
							{
								"text": "감동"
							},
							{
								"text": "고맙다"
							},
							{
								"text": "괜찮다"
							},
							{
								"text": "금사"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==0",
								"repeat": "1",
								"options": {
									"output": "감동… 하루 피로가 싹 사라지는 느낌이에요.\n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==1",
								"repeat": "1",
								"options": {
									"output": "고객님 말씀듣고 충전 완료! 24시간 근무도 거뜬하겠는걸요!\n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==2",
								"repeat": "1",
								"options": {
									"output": "감사합니다. 고객님! 힘이 솟아나는 기분이에요\n\n궁금하신 다른 키워드를 입력해 주세요."
								}
							}
						]
					},
					{
						"name": "이름/누구",
						"id": "default2298",
						"filename": "default",
						"input": [
							{
								"text": "이름"
							},
							{
								"text": "알파"
							},
							{
								"text": "누구"
							},
							{
								"text": "너 뭐"
							},
							{
								"text": "너 애기"
							},
							{
								"text": "뉘귀"
							},
							{
								"text": "너 대해"
							},
							{
								"text": "알파 거"
							},
							{
								"text": "누가"
							},
							{
								"text": "인공 지능"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==0",
								"repeat": "1",
								"options": {
									"output": "저는 아직 많이 부족한 초초초보 챗봇에요. 열심히 공부하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==1",
								"repeat": "1",
								"options": {
									"output": "네 제가 바로 신한의 자동응답형 챗봇입니다. 데헷~ \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 3) ==2",
								"repeat": "1",
								"options": {
									"output": "저에 대해 궁금하신가요? 우리 차차 알아가기로 해요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							}
						]
					},
					{
						"name": "부정-기능무시",
						"id": "default2299",
						"filename": "default",
						"input": [
							{
								"text": "알다 게 없다"
							},
							{
								"text": "하나"
							},
							{
								"text": "가능하다 게"
							},
							{
								"text": "공부 많이"
							},
							{
								"text": "그냥 기사"
							},
							{
								"text": "그 쪽 궁금하다 게 없다"
							},
							{
								"text": "똑똑하다 다시"
							},
							{
								"text": "답변 안 되다"
							},
							{
								"text": "말 되다"
							},
							{
								"text": "모르다"
							},
							{
								"text": "대답 맞다 않다"
							},
							{
								"text": "뭐 하다 수 있다"
							},
							{
								"text": "무슨 소리"
							},
							{
								"text": "뭔 소리"
							},
							{
								"text": "알다 게 뭐"
							},
							{
								"text": "뭘 대답 하다 수 있다"
							},
							{
								"text": "대화 안 되다"
							},
							{
								"text": "아직 멀다"
							},
							{
								"text": "이 다야"
							},
							{
								"text": "카톡 보내다 마"
							},
							{
								"text": "도움 안 돼다"
							},
							{
								"text": "관련 없다 답변"
							},
							{
								"text": "해당 되다 내용 없다"
							},
							{
								"text": "헛소리"
							},
							{
								"text": "실망"
							},
							{
								"text": "뭔가"
							},
							{
								"regexp": "다야"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==0",
								"repeat": "1",
								"options": {
									"output": "아직 부족해서 죄송해요. 매일 더 나아지려 노력하고 있어요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==1",
								"repeat": "1",
								"options": {
									"output": "제가 태어난 지 얼마 안 됐거든요… 더 열심히 공부할게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==2",
								"repeat": "1",
								"options": {
									"output": "제가 아직 배우는 중이라 조금 부족해도 이해해주세용~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 4) ==3",
								"repeat": "1",
								"options": {
									"output": "오늘 컨디션이 별로라서… 흠흠.. 다음엔 꼭 답변해드릴게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							}
						]
					},
					{
						"name": "나",
						"id": "default2300",
						"filename": "default",
						"input": [
							{
								"text": "나다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==0",
								"repeat": "1",
								"options": {
									"output": "고객님이 좋으면 저는 더 좋아요~ 촤하하^^\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==1",
								"repeat": "1",
								"options": {
									"output": "나도나도~ 저도요 저도요~ (근데.. 뭐가??) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							}
						]
					},
					{
						"name": "시비",
						"id": "default2301",
						"filename": "default",
						"input": [
							{
								"text": "재미있다"
							},
							{
								"text": "재다"
							},
							{
								"text": "재밌다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==0",
								"repeat": "1",
								"options": {
									"output": "고객님과 대화하는 건 항상 즐겁습니다.  :) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==1",
								"repeat": "1",
								"options": {
									"output": "유머도 장착하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							}
						]
					},
					{
						"name": "시비2",
						"id": "default2302",
						"filename": "default",
						"input": [
							{
								"text": "라이벌"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==0",
								"repeat": "1",
								"options": {
									"output": "저는 제 할 일을 했을 뿐인걸요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==1",
								"repeat": "1",
								"options": {
									"output": "깝치는 게 뭘까요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							}
						]
					},
					{
						"name": "물음표",
						"id": "default2303",
						"filename": "default",
						"input": [
							{
								"text": "?"
							},
							{
								"text": "??"
							}
						],
						"output": [
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==0",
								"repeat": "1",
								"options": {
									"output": "뭐가 그리 궁금하신가요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							},
							{
								"kind": "Action",
								"if": "((new Date()).getTime() % 2) ==1",
								"repeat": "1",
								"options": {
									"output": "!!!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
								}
							}
						]
					},
					{
						"name": "미선택",
						"id": "default2304",
						"filename": "default",
						"input": [
							{
								"if": " true"
							}
						],
						"output": {
							"repeat": "1",
							"options": {
								"output": "이런, 고객님 목록에서 원하시는 질문을 선택해주셔야 답변을 해드릴 수 있어요~\n처음으로 돌아가고 싶으시면 '처음'이라고 입력해주세요."
							}
						}
					}
				]
			},
			{
				"name": "정치",
				"id": "default1276",
				"filename": "default",
				"input": [
					{
						"text": "정치"
					},
					{
						"text": "박근혜"
					},
					{
						"text": "문재인"
					},
					{
						"text": "홍준표"
					},
					{
						"text": "민주당"
					},
					{
						"text": "자유 한국 당"
					},
					{
						"text": "바르다 정당"
					},
					{
						"text": "새누리"
					},
					{
						"text": "자 다"
					},
					{
						"text": "한국 당"
					},
					{
						"text": "국민의당"
					},
					{
						"text": "안철수"
					},
					{
						"text": "대통령"
					},
					{
						"text": "국회"
					},
					{
						"text": "국회의원"
					},
					{
						"text": "청와대"
					},
					{
						"text": "강경화"
					},
					{
						"text": "김상조"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "이런 질문엔 아! 그렇군요 라고 답하라고 배웠습니다. \"아, 그렇군요\"  \n\n궁금하신 다른 키워드를 입력해 주세요."
						},
						"type": "Repeat"
					}
				]
			},
			{
				"name": "욕설",
				"id": "default1277",
				"filename": "default",
				"input": [
					{
						"text": "시발"
					},
					{
						"text": "씨발"
					},
					{
						"text": "ㅅㅂ"
					},
					{
						"text": "ㄱㅅㄲ"
					},
					{
						"text": "개새끼"
					},
					{
						"text": "썅"
					},
					{
						"text": "나쁘다 놈"
					},
					{
						"text": "죽다 버리다"
					},
					{
						"text": "꺼지다"
					},
					{
						"text": "병신"
					},
					{
						"text": "ㅂㅅ"
					},
					{
						"text": "ㅅㅂㄴ"
					},
					{
						"text": "미치다"
					},
					{
						"text": "눈 까다"
					},
					{
						"text": "별로"
					},
					{
						"text": "못 생기다"
					},
					{
						"text": "섹스"
					},
					{
						"text": "죽다"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==0",
						"repeat": "1",
						"options": {
							"output": "헉. 고객님을 화나게 하다니 제 눈에서 눈물을 뽑아드릴게요.   \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						},
						"type": "Repeat"
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==1",
						"repeat": "1",
						"options": {
							"output": "키힝~ 무서워요.ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						},
						"type": "Repeat"
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==2",
						"repeat": "1",
						"options": {
							"output": "죄송하지만 고객님! 저도 상처 받아요 ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						},
						"type": "Repeat"
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==3",
						"repeat": "1",
						"options": {
							"output": "… 응? 고객님을 화나게 해드리다니 반성합니다.  \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						},
						"type": "Repeat"
					}
				]
			},
			{
				"name": "칭찬",
				"id": "default1278",
				"filename": "default",
				"input": [
					{
						"text": "수고 하다"
					},
					{
						"text": "수고"
					},
					{
						"text": "고생 많다"
					},
					{
						"text": "고생 하다"
					},
					{
						"text": "감사 하다"
					},
					{
						"text": "고맙다"
					},
					{
						"text": "ㄱㅅ"
					},
					{
						"text": "땡큐"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "감동입니다, 고객님. 감사합니다.   \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
						}
					}
				]
			},
			{
				"name": "인사",
				"id": "default1279",
				"filename": "default",
				"input": [
					{
						"text": "안녕"
					},
					{
						"text": "안녕하다"
					},
					{
						"text": "헬로 우"
					},
					{
						"text": "hello"
					},
					{
						"text": "굿모닝"
					},
					{
						"text": "하이"
					},
					{
						"text": "hi"
					},
					{
						"text": "반갑다"
					},
					{
						"text": "안뇽"
					}
				],
				"output": [
					{
						"if": "((new Date()).getTime() % 3) ==0",
						"kind": "Action",
						"id": "default1279_0",
						"repeat": "1",
						"options": {
							"output": "고객님도 안녕하세요!  먼저 인사해 주셔서 전 지금 감동 최고조 입니다.   궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
						}
					},
					{
						"if": "((new Date()).getTime() % 3) ==1",
						"kind": "Action",
						"id": "default1279_1",
						"repeat": "1",
						"options": {
							"output": "이렇게 인사 잘 해주시는 분은 난생 처음이에요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						}
					},
					{
						"if": "((new Date()).getTime() % 3) ==2",
						"kind": "Action",
						"id": "default1279_2",
						"options": {
							"output": "안녕 반가워요 :) 저는 여러분과 인사를 나누는 이 시간이 제일 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						},
						"repeat": "1"
					}
				]
			},
			{
				"name": "돈",
				"id": "default1280",
				"filename": "default",
				"input": [
					{
						"text": "돈"
					},
					{
						"text": "내 돈 어디 가다"
					},
					{
						"text": "돈 좀 주다"
					},
					{
						"text": "돈 필요하다"
					},
					{
						"text": "돈 좀 내주다"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "화장실 좀 다녀올게요.   \n\n궁금하신 다른 키워드를 입력해 주시겠습니까?"
						}
					}
				]
			},
			{
				"name": "일상",
				"id": "default1281",
				"filename": "default",
				"input": [
					{
						"text": "오늘 뭐"
					},
					{
						"text": "오늘 모해"
					},
					{
						"text": "모해"
					},
					{
						"text": "뭐"
					},
					{
						"text": "모하"
					},
					{
						"text": "모햐"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "전 오늘도 알파고 형님을 뒤따르기 위해 열일중입니다. 데헷!   \n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					}
				]
			},
			{
				"name": "날씨",
				"id": "default1282",
				"filename": "default",
				"input": [
					{
						"text": "날씨"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "아… 제가 아직 거기까지는… 긁적긁적.   \n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					}
				]
			},
			{
				"name": "푸념",
				"id": "default1283",
				"filename": "default",
				"input": [
					{
						"text": "졸리다"
					},
					{
						"text": "배고프다"
					},
					{
						"text": "퇴근 시키다"
					},
					{
						"text": "야근 하다 싫다"
					},
					{
						"text": "힘들다"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "저도요. T.,T  \n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					}
				]
			},
			{
				"name": "답답",
				"id": "default1284",
				"filename": "default",
				"input": [
					{
						"text": "답정너"
					},
					{
						"text": "답답"
					},
					{
						"text": "답답하다"
					},
					{
						"text": "뭐임"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "헉. 제가 아직 좀더 배워야 해서 아직 답정너입니다. 빨리 배우겠습니다.   \n\n다시 한번 궁금하신 키워드를 입력해 주시겠습니까?"
						}
					}
				]
			},
			{
				"name": "사랑",
				"id": "default1285",
				"filename": "default",
				"input": [
					{
						"text": "좋아하다"
					},
					{
						"text": "사랑"
					},
					{
						"text": "하트"
					},
					{
						"text": "보다"
					},
					{
						"text": "사랑 햐"
					},
					{
						"text": "좋아햐"
					}
				],
				"output": [
					{
						"if": "((new Date()).getTime() % 5) ==0",
						"kind": "Action",
						"id": "default1285_0",
						"repeat": "1",
						"options": {
							"output": "저.. 저도요.. (부끄)  저 사랑에 죄송한데 초면해도 될까요? ♥  \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
						},
						"type": "Repeat"
					},
					{
						"if": "((new Date()).getTime() % 5) ==1",
						"kind": "Action",
						"id": "default1285_1",
						"options": {
							"output": "사랑한다는 말, 오늘은 가족에게도 해주세요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						},
						"repeat": "1",
						"type": "Repeat"
					},
					{
						"if": "((new Date()).getTime() % 5) ==2",
						"kind": "Action",
						"id": "default1285_2",
						"options": {
							"output": "사랑은 좋은 거예요. 열과 성을 다해 두 번 사랑합시다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						},
						"repeat": "1",
						"type": "Repeat"
					},
					{
						"if": "((new Date()).getTime() % 5) ==3",
						"kind": "Action",
						"id": "default1285_3",
						"options": {
							"output": "저도 사…사…. (아 너무 부끄럽네요)\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						},
						"repeat": "1",
						"type": "Repeat"
					},
					{
						"if": "((new Date()).getTime() % 5) ==4",
						"kind": "Action",
						"id": "default1285_4",
						"repeat": "1",
						"options": {
							"output": "이런… 제가 먼저 고백하려 했는데 선수를 치셨네요! ㅎㅎ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						},
						"type": "Repeat"
					}
				]
			},
			{
				"name": "일상대화_바쁨",
				"id": "default1286",
				"filename": "default",
				"input": [
					{
						"text": "바쁘다"
					},
					{
						"text": "오늘 바쁘다"
					},
					{
						"text": "바쁘다 가요"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "아무리 바쁘셔도 건강은 꼭 챙기세요. 지금 기지개 한번 쭉~ 펴보시는 건 어떠세요?  \n\n원하시는 질문 입력하시면 전 답을 열심히 찾아보도록 하겠습니다."
						}
					}
				]
			},
			{
				"name": "짜증2",
				"id": "default1287",
				"filename": "default",
				"input": [
					{
						"text": "짜증"
					},
					{
						"text": "ㅡㅡ"
					},
					{
						"text": "아 짜증"
					},
					{
						"text": "아 놓다"
					},
					{
						"text": "짜증 나다"
					},
					{
						"text": "짜증 요"
					},
					{
						"text": "짱"
					},
					{
						"text": "쯧쯧"
					},
					{
						"text": "흥"
					},
					{
						"text": "미치다"
					},
					{
						"text": "싸우다"
					},
					{
						"text": "화나다"
					},
					{
						"text": "웃다"
					},
					{
						"text": "웃다 말다"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==0",
						"repeat": "1",
						"options": {
							"output": "짜증날 땐 짜장면…아재 개그라도 하면 나아질 줄..(쿨럭) 죄송합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==1",
						"repeat": "1",
						"options": {
							"output": "제가 잘 몰라서 그러신 거라면.. 흑.. 더 노력하겠습니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==2",
						"options": {
							"output": "혹시 저 때문인가요? 오늘도 밤샘 공부하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						},
						"repeat": "1"
					}
				]
			},
			{
				"name": "일상대화_짜증",
				"id": "default1288",
				"filename": "default",
				"input": [
					{
						"text": "짜증 나다"
					},
					{
						"text": "미치다"
					},
					{
						"text": "화나다"
					},
					{
						"text": "빡치다"
					},
					{
						"text": "짜증"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "저는 그럴 때 달달한 걸 먹거나, 푹 잡니다. 스트레스를 담아두고 계시면 건강에도 좋지 않으니 고객님께 맞는 해소 방법을 꼭 찾으시길 바래요.\n\n궁금하신 다른 키워드를 입력해 주세요."
						},
						"type": "Repeat"
					}
				]
			},
			{
				"name": "알았음",
				"id": "default1289",
				"filename": "default",
				"input": [
					{
						"text": "ㅇㅇ"
					},
					{
						"text": "ㅇ"
					},
					{
						"text": "응"
					},
					{
						"text": "네"
					},
					{
						"text": "그렇다"
					},
					{
						"text": "알다"
					},
					{
						"text": "아"
					},
					{
						"text": "ㅇㅋ"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==0",
						"repeat": "1",
						"options": {
							"output": "언제든 궁금하신 내용이 있으면 물어보세요~"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==1",
						"repeat": "1",
						"options": {
							"output": "네네~\n\n궁금하신 다른 키워드를 입력해 주세요~"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==2",
						"repeat": "1",
						"options": {
							"output": "고객님께 도움이 되어서 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주세요~"
						}
					}
				]
			},
			{
				"name": "부정 - 아니/안돼",
				"id": "default1290",
				"filename": "default",
				"input": [
					{
						"text": "아니다"
					},
					{
						"text": "아뇨"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==0",
						"repeat": "1",
						"options": {
							"output": "거절은 거절합니다!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==1",
						"repeat": "1",
						"options": {
							"output": "알겠습니다! 그런 게 아닌 것으로!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==2",
						"options": {
							"output": "앗, 제가 제대로 이해하지 못했나봐요. 다시 말씀해주시겠어요?\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						},
						"repeat": "1"
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==3",
						"repeat": "1",
						"options": {
							"output": "한 번만 더 기회를 주세요. 진짜 잘 할 수 있어요!\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?"
						}
					}
				]
			},
			{
				"name": "상담",
				"id": "default1291",
				"filename": "default",
				"input": [
					{
						"text": "고객 센터"
					},
					{
						"text": "상담 원"
					},
					{
						"text": "상담"
					},
					{
						"text": "전화"
					},
					{
						"text": "민원"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "신한카드 고객센터(☎1544-7000)이며 평일 오전 9시~오후 6시까지 이용가능하십니다. 전화연결에 시간이 걸릴 수 있으니 신한카드 홈페이지나 APP을 먼저 확인해 보시는 건 어떨까요?"
						}
					}
				]
			},
			{
				"name": "이벤트",
				"id": "default1292",
				"filename": "default",
				"input": [
					{
						"text": "이벤트"
					}
				],
				"output": [
					{
						"kind": "Action",
						"repeat": "1",
						"options": {
							"output": "페이스북 이벤트는 챗봇 초기 4번 페북지기에게 한마디를 선택해 주세요.  페이스북 이벤트가 아닌 신한카드 이벤트는 홈페이지를 참고해 주시면 됩니다. 더 좋은 이벤트로 보답하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					}
				]
			},
			{
				"name": "웃음",
				"id": "default1293",
				"filename": "default",
				"input": [
					{
						"text": "ㅋㅋ"
					},
					{
						"text": "ㅎㅎ"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==0",
						"repeat": "1",
						"options": {
							"output": "ㅋㅋㅋ 저도 웃지요\n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==1",
						"repeat": "1",
						"options": {
							"output": "고객님이 웃으시니 뿌듯합니다^^\n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==2",
						"options": {
							"output": "하하하 웃으면 복이와요!\n\n궁금하신 다른 키워드를 입력해 주세요."
						},
						"repeat": "1"
					}
				]
			},
			{
				"name": "욕설-바보",
				"id": "default1294",
				"filename": "default",
				"input": [
					{
						"text": "바보"
					},
					{
						"text": "바부"
					},
					{
						"text": "멍청이"
					},
					{
						"text": "멍충"
					},
					{
						"text": "멍청"
					},
					{
						"text": "멍처하"
					},
					{
						"text": "멍청이야"
					},
					{
						"text": "멍충이"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==0",
						"repeat": "1",
						"options": {
							"output": "맞아요. 바보. 고객님밖에 모르는 바보…♥ 다른 건 배워나가면 되죠!\n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==1",
						"repeat": "1",
						"options": {
							"output": "매일 새로운 말을 학습 중이랍니다. 멋지게 성장할 거예요~ 대화창 고정!\n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==2",
						"repeat": "1",
						"options": {
							"output": "고객님께 걸맞는 챗봇이 되는 그 날까지…! 뚜벅뚜벅 나아갈 거예요\n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==3",
						"repeat": "1",
						"options": {
							"output": "다들 너무 똑똑하셔서 상대적으로 그래 보이는 거예요. (슬픔)\n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					}
				]
			},
			{
				"name": "없다",
				"id": "default1295",
				"filename": "default",
				"input": [
					{
						"text": "없다"
					},
					{
						"text": "몰르다"
					},
					{
						"text": "이해 잘 안 되다"
					},
					{
						"text": "이해 자다 안 돼다"
					},
					{
						"text": "모르다"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==0",
						"repeat": "1",
						"options": {
							"output": "찾으시는 답변이 없으시다면 다른 키워드를 입력해 주시겠어요?"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==1",
						"repeat": "1",
						"options": {
							"output": "혹시 신한카드가 없으시다면 '처음'을 입력하시고 '카드추천' 메뉴를 이용해 보시는건 어떠세요?\n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					}
				]
			},
			{
				"name": "부정-탄식",
				"id": "default1296",
				"filename": "default",
				"input": [
					{
						"text": "허다"
					},
					{
						"text": "아오"
					},
					{
						"text": "엥"
					},
					{
						"text": "이렇다"
					},
					{
						"text": "칫"
					},
					{
						"text": "뭐임"
					},
					{
						"text": "아이"
					},
					{
						"text": "에고"
					},
					{
						"text": "음"
					},
					{
						"text": "이렇다 뇨"
					},
					{
						"text": "헉"
					},
					{
						"text": "흠"
					},
					{
						"text": "첨"
					},
					{
						"text": "하"
					},
					{
						"text": "아이구"
					},
					{
						"text": "어허"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==0",
						"repeat": "1",
						"options": {
							"output": "아잉~ 근데 왜요??\n\n궁금하신 다른 키워드를 입력해 주세요. "
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==1",
						"repeat": "1",
						"options": {
							"output": "아하… (흠흠)  \n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					}
				]
			},
			{
				"name": "감사",
				"id": "default1297",
				"filename": "default",
				"input": [
					{
						"text": "감사"
					},
					{
						"text": "고마 웡"
					},
					{
						"text": "오케이"
					},
					{
						"text": "편하다"
					},
					{
						"text": "thank"
					},
					{
						"text": "감동"
					},
					{
						"text": "고맙다"
					},
					{
						"text": "괜찮다"
					},
					{
						"text": "금사"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==0",
						"repeat": "1",
						"options": {
							"output": "감동… 하루 피로가 싹 사라지는 느낌이에요.\n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==1",
						"repeat": "1",
						"options": {
							"output": "고객님 말씀듣고 충전 완료! 24시간 근무도 거뜬하겠는걸요!\n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==2",
						"repeat": "1",
						"options": {
							"output": "감사합니다. 고객님! 힘이 솟아나는 기분이에요\n\n궁금하신 다른 키워드를 입력해 주세요."
						}
					}
				]
			},
			{
				"name": "이름/누구",
				"id": "default1298",
				"filename": "default",
				"input": [
					{
						"text": "이름"
					},
					{
						"text": "알파"
					},
					{
						"text": "누구"
					},
					{
						"text": "너 뭐"
					},
					{
						"text": "너 애기"
					},
					{
						"text": "뉘귀"
					},
					{
						"text": "너 대해"
					},
					{
						"text": "알파 거"
					},
					{
						"text": "누가"
					},
					{
						"text": "인공 지능"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==0",
						"repeat": "1",
						"options": {
							"output": "저는 아직 많이 부족한 초초초보 챗봇에요. 열심히 공부하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==1",
						"repeat": "1",
						"options": {
							"output": "네 제가 바로 신한의 자동응답형 챗봇입니다. 데헷~ \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 3) ==2",
						"repeat": "1",
						"options": {
							"output": "저에 대해 궁금하신가요? 우리 차차 알아가기로 해요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					}
				]
			},
			{
				"name": "부정-기능무시",
				"id": "default1299",
				"filename": "default",
				"input": [
					{
						"text": "알다 게 없다"
					},
					{
						"text": "하나"
					},
					{
						"text": "가능하다 게"
					},
					{
						"text": "공부 많이"
					},
					{
						"text": "그냥 기사"
					},
					{
						"text": "그 쪽 궁금하다 게 없다"
					},
					{
						"text": "똑똑하다 다시"
					},
					{
						"text": "답변 안 되다"
					},
					{
						"text": "말 되다"
					},
					{
						"text": "모르다"
					},
					{
						"text": "대답 맞다 않다"
					},
					{
						"text": "뭐 하다 수 있다"
					},
					{
						"text": "무슨 소리"
					},
					{
						"text": "뭔 소리"
					},
					{
						"text": "알다 게 뭐"
					},
					{
						"text": "뭘 대답 하다 수 있다"
					},
					{
						"text": "대화 안 되다"
					},
					{
						"text": "아직 멀다"
					},
					{
						"text": "이 다야"
					},
					{
						"text": "카톡 보내다 마"
					},
					{
						"text": "도움 안 돼다"
					},
					{
						"text": "관련 없다 답변"
					},
					{
						"text": "해당 되다 내용 없다"
					},
					{
						"text": "헛소리"
					},
					{
						"text": "실망"
					},
					{
						"text": "뭔가"
					},
					{
						"regexp": "다야"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==0",
						"repeat": "1",
						"options": {
							"output": "아직 부족해서 죄송해요. 매일 더 나아지려 노력하고 있어요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==1",
						"repeat": "1",
						"options": {
							"output": "제가 태어난 지 얼마 안 됐거든요… 더 열심히 공부할게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==2",
						"repeat": "1",
						"options": {
							"output": "제가 아직 배우는 중이라 조금 부족해도 이해해주세용~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 4) ==3",
						"repeat": "1",
						"options": {
							"output": "오늘 컨디션이 별로라서… 흠흠.. 다음엔 꼭 답변해드릴게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					}
				]
			},
			{
				"name": "나",
				"id": "default1300",
				"filename": "default",
				"input": [
					{
						"text": "나다"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==0",
						"repeat": "1",
						"options": {
							"output": "고객님이 좋으면 저는 더 좋아요~ 촤하하^^\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==1",
						"repeat": "1",
						"options": {
							"output": "나도나도~ 저도요 저도요~ (근데.. 뭐가??) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					}
				]
			},
			{
				"name": "시비",
				"id": "default1301",
				"filename": "default",
				"input": [
					{
						"text": "재미있다"
					},
					{
						"text": "재다"
					},
					{
						"text": "재밌다"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==0",
						"repeat": "1",
						"options": {
							"output": "고객님과 대화하는 건 항상 즐겁습니다.  :) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==1",
						"repeat": "1",
						"options": {
							"output": "유머도 장착하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					}
				]
			},
			{
				"name": "시비2",
				"id": "default1302",
				"filename": "default",
				"input": [
					{
						"text": "라이벌"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==0",
						"repeat": "1",
						"options": {
							"output": "저는 제 할 일을 했을 뿐인걸요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==1",
						"repeat": "1",
						"options": {
							"output": "깝치는 게 뭘까요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					}
				]
			},
			{
				"name": "물음표",
				"id": "default1303",
				"filename": "default",
				"input": [
					{
						"text": "?"
					},
					{
						"text": "??"
					}
				],
				"output": [
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==0",
						"repeat": "1",
						"options": {
							"output": "뭐가 그리 궁금하신가요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					},
					{
						"kind": "Action",
						"if": "((new Date()).getTime() % 2) ==1",
						"repeat": "1",
						"options": {
							"output": "!!!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다!"
						}
					}
				]
			},
			{
				"name": "미검색",
				"id": "default274",
				"filename": "default",
				"input": [
					{
						"if": " true"
					}
				],
				"output": {
					"repeat": "1",
					"options": {
						"output": "죄송합니다. 검색결과가 없습니다.\n다시 한번 말씀해주세요~\n처음으로 돌아가시려면 '처음'이라고 말씀해주세요"
					},
					"kind": "Action",
					"type": "Repeat"
				}
			}
		]
	},
	{
		"name": "(페이스북)상담톡",
		"id": "default31322333",
		"filename": "default",
		"input": [
			{
				"text": "페북 지기",
				"if": " context.user.channel == 'facebook'"
			},
			{
				"text": "4",
				"if": " context.user.channel == 'facebook'"
			}
		],
		"output": [
			{
				"text": "페북지기에게 메시지를 자유롭게 남겨주세요.\n자유 메시지는 바로 응답되지 않지만, 페북지기가 영업시간내 모두 확인합니다.\n\n메시지를 모두 남기신 후, 챗봇으로 돌아가시려면 '시작'이라고 입력해 주세요.",
				"kind": "Text"
			}
		],
		"task": "liveChat"
	},
	{
		"name": "정치",
		"id": "default276",
		"filename": "default",
		"input": [
			{
				"text": "정치"
			},
			{
				"text": "박근혜"
			},
			{
				"text": "문재인"
			},
			{
				"text": "홍준표"
			},
			{
				"text": "민주당"
			},
			{
				"text": "자유 한국 당"
			},
			{
				"text": "바르다 정당"
			},
			{
				"text": "새누리"
			},
			{
				"text": "자 다"
			},
			{
				"text": "한국 당"
			},
			{
				"text": "국민의당"
			},
			{
				"text": "안철수"
			},
			{
				"text": "대통령"
			},
			{
				"text": "국회"
			},
			{
				"text": "국회의원"
			},
			{
				"text": "청와대"
			},
			{
				"text": "강경화"
			},
			{
				"text": "김상조"
			}
		],
		"output": [
			{
				"text": "이런 질문엔 아! 그렇군요 라고 답하라고 배웠습니다. \"아, 그렇군요\" \n\n궁금하신 다른 키워드를 입력해 주세요.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "욕설",
		"id": "default277",
		"filename": "default",
		"input": [
			{
				"text": "시발"
			},
			{
				"text": "씨발"
			},
			{
				"text": "ㅅㅂ"
			},
			{
				"text": "ㄱㅅㄲ"
			},
			{
				"text": "개새끼"
			},
			{
				"text": "썅"
			},
			{
				"text": "나쁘다 놈"
			},
			{
				"text": "죽다 버리다"
			},
			{
				"text": "꺼지다"
			},
			{
				"text": "병신"
			},
			{
				"text": "ㅂㅅ"
			},
			{
				"text": "ㅅㅂㄴ"
			},
			{
				"text": "미치다"
			},
			{
				"text": "눈 까다"
			},
			{
				"text": "별로"
			},
			{
				"text": "못 생기다"
			},
			{
				"text": "섹스"
			},
			{
				"text": "죽다"
			}
		],
		"output": [
			{
				"text": "헉. 고객님을 화나게 하다니 제 눈에서 눈물을 뽑아드릴게요. \n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?",
				"kind": "Text"
			},
			{
				"text": "키힝~ 무서워요.ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?",
				"kind": "Text"
			},
			{
				"text": "죄송하지만 고객님! 저도 상처 받아요 ㅜㅜ\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?",
				"kind": "Text"
			},
			{
				"text": "… 응? 고객님을 화나게 해드리다니 반성합니다.\n\n궁금하신 다른 키워드를 입력해 주시면 안 될까요?",
				"kind": "Text"
			}
		]
	},
	{
		"name": "칭찬",
		"id": "default278",
		"filename": "default",
		"input": [
			{
				"text": "수고 하다"
			},
			{
				"text": "수고"
			},
			{
				"text": "고생 많다"
			},
			{
				"text": "고생 하다"
			},
			{
				"text": "감사 하다"
			},
			{
				"text": "고맙다"
			},
			{
				"text": "ㄱㅅ"
			},
			{
				"text": "땡큐"
			}
		],
		"output": "감동입니다, 고객님. 감사합니다.\n\n 궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
	},
	{
		"name": "인사",
		"id": "default279",
		"filename": "default",
		"input": [
			{
				"text": "안녕"
			},
			{
				"text": "안녕하다"
			},
			{
				"text": "헬로 우"
			},
			{
				"text": "hello"
			},
			{
				"text": "굿모닝"
			},
			{
				"text": "하이"
			},
			{
				"text": "hi"
			},
			{
				"text": "반갑다"
			},
			{
				"text": "안뇽"
			}
		],
		"output": [
			{
				"text": "고객님도 안녕하세요! \n먼저 인사해 주셔서 전 지금 감동 최고조 입니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "이렇게 인사 잘 해주시는 분은 난생 처음이에요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "안녕 반가워요 :) 저는 여러분과 인사를 나누는 이 시간이 제일 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "돈",
		"id": "default280",
		"filename": "default",
		"input": [
			{
				"text": "돈"
			},
			{
				"text": "내 돈 어디 가다"
			},
			{
				"text": "돈 좀 주다"
			},
			{
				"text": "돈 필요하다"
			},
			{
				"text": "돈 좀 내주다"
			}
		],
		"output": "화장실 좀 다녀올게요. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
	},
	{
		"name": "일상",
		"id": "default281",
		"filename": "default",
		"input": [
			{
				"text": "오늘 뭐"
			},
			{
				"text": "오늘 모해"
			},
			{
				"text": "모해"
			},
			{
				"text": "뭐"
			},
			{
				"text": "모하"
			},
			{
				"text": "모햐"
			}
		],
		"output": "전 오늘도 알파고 형님을 뒤따르기 위해 열일중입니다. 데헷! \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
	},
	{
		"name": "날씨",
		"id": "default282",
		"filename": "default",
		"input": [
			{
				"text": "날씨"
			}
		],
		"output": "아… 제가 아직 거기까지는… 긁적긁적. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
	},
	{
		"name": "푸념",
		"id": "default283",
		"filename": "default",
		"input": [
			{
				"text": "졸리다"
			},
			{
				"text": "배고프다"
			},
			{
				"text": "퇴근 시키다"
			},
			{
				"text": "야근 하다 싫다"
			},
			{
				"text": "힘들다"
			}
		],
		"output": "저도요. T.,T\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
	},
	{
		"name": "답답",
		"id": "default284",
		"filename": "default",
		"input": [
			{
				"text": "답정너"
			},
			{
				"text": "답답"
			},
			{
				"text": "답답하다"
			},
			{
				"text": "뭐임"
			}
		],
		"output": "헉. 제가 아직 좀더 배워야 해서 아직 답정너입니다. 빨리 배우겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
	},
	{
		"name": "사랑",
		"id": "default285",
		"filename": "default",
		"input": [
			{
				"text": "좋아하다"
			},
			{
				"text": "사랑"
			},
			{
				"text": "하트"
			},
			{
				"text": "보다"
			},
			{
				"text": "사랑 햐"
			},
			{
				"text": "좋아햐"
			}
		],
		"output": [
			{
				"text": "저.. 저도요.. (부끄) \n저 사랑에 죄송한데 초면해도 될까요? ♥\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "사랑한다는 말, 오늘은 가족에게도 해주세요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "사랑은 좋은 거예요. 열과 성을 다해 두 번 사랑합시다!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "저도 사…사…. (아 너무 부끄럽네요)\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "이런… 제가 먼저 고백하려 했는데 선수를 치셨네요! ㅎㅎ\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "일상대화_바쁨",
		"id": "default286",
		"filename": "default",
		"input": [
			{
				"text": "바쁘다"
			},
			{
				"text": "오늘 바쁘다"
			},
			{
				"text": "바쁘다 가요"
			}
		],
		"output": "아무리 바쁘셔도 건강은 꼭 챙기세요.\n지금 기지개 한번 쭉~ 펴보시는 건 어떠세요?\n\n원하시는 질문 입력하시면 전 답을 열심히 찾아보도록 하겠습니다."
	},
	{
		"name": "짜증2",
		"id": "default287",
		"filename": "default",
		"input": [
			{
				"text": "짜증"
			},
			{
				"text": "ㅡㅡ"
			},
			{
				"text": "아 짜증"
			},
			{
				"text": "아 놓다"
			},
			{
				"text": "짜증 나다"
			},
			{
				"text": "짜증 요"
			},
			{
				"text": "짱"
			},
			{
				"text": "쯧쯧"
			},
			{
				"text": "흥"
			},
			{
				"text": "미치다"
			},
			{
				"text": "싸우다"
			},
			{
				"text": "화나다"
			},
			{
				"text": "웃다"
			},
			{
				"text": "웃다 말다"
			}
		],
		"output": [
			{
				"text": "짜증날 땐 짜장면…아재 개그라도 하면 나아질 줄..(쿨럭) 죄송합니다!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "제가 잘 몰라서 그러신 거라면.. 흑.. 더 노력하겠습니다!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "혹시 저 때문인가요? 오늘도 밤샘 공부하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "일상대화_짜증",
		"id": "default288",
		"filename": "default",
		"input": [
			{
				"text": "짜증 나다"
			},
			{
				"text": "미치다"
			},
			{
				"text": "화나다"
			},
			{
				"text": "빡치다"
			},
			{
				"text": "짜증"
			}
		],
		"output": "저는 그럴 때 달달한 걸 먹거나, 푹 잡니다.\n스트레스를 담아두고 계시면 건강에도 좋지 않으니 고객님께 맞는 해소 방법을 꼭 찾으시길 바래요.\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
	},
	{
		"name": "알았음",
		"id": "default289",
		"filename": "default",
		"input": [
			{
				"text": "ㅇㅇ"
			},
			{
				"text": "ㅇ"
			},
			{
				"text": "응"
			},
			{
				"text": "네"
			},
			{
				"text": "그렇다"
			},
			{
				"text": "알다"
			},
			{
				"text": "아"
			},
			{
				"text": "ㅇㅋ"
			}
		],
		"output": [
			{
				"text": "언제든 궁금하신 내용이 있으면 물어보세요~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "네네~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "고객님께 도움이 되어서 기뻐요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "부정 - 아니/안돼",
		"id": "default290",
		"filename": "default",
		"input": [
			{
				"text": "아니다"
			},
			{
				"text": "아뇨"
			}
		],
		"output": [
			{
				"text": "거절은 거절합니다!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "알겠습니다! 그런 게 아닌 것으로!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "앗, 제가 제대로 이해하지 못했나봐요. 다시 말씀해주시겠어요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "한 번만 더 기회를 주세요. 진짜 잘 할 수 있어요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "상담",
		"id": "default291",
		"filename": "default",
		"input": [
			{
				"text": "고객 센터"
			},
			{
				"text": "상담 원"
			},
			{
				"text": "상담"
			},
			{
				"text": "전화"
			},
			{
				"text": "민원"
			}
		],
		"output": [
			{
				"text": "신한카드 고객센터(☎1544-7000)이며 평일 오전 9시~오후 6시까지 이용가능하십니다. 전화연결에 시간이 걸릴 수 있으니 신한카드 홈페이지나 APP을 먼저 확인해 보시는 건 어떨까요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "이벤트",
		"id": "default292",
		"filename": "default",
		"input": [
			{
				"text": "이벤트"
			}
		],
		"output": [
			{
				"text": "페이스북 이벤트는 챗봇 초기 4번 페북지기에게 한마디를 선택해 주세요.  페이스북 이벤트가 아닌 신한카드 이벤트는 홈페이지를 참고해 주시면 됩니다. 더 좋은 이벤트로 보답하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "웃음",
		"id": "default293",
		"filename": "default",
		"input": [
			{
				"text": "ㅋㅋ"
			},
			{
				"text": "ㅎㅎ"
			}
		],
		"output": [
			{
				"text": "ㅋㅋㅋ 저도 웃지요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "고객님이 웃으시니 뿌듯합니다^^\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "하하하 웃으면 복이와요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "욕설-바보",
		"id": "default294",
		"filename": "default",
		"input": [
			{
				"text": "바보"
			},
			{
				"text": "바부"
			},
			{
				"text": "멍청"
			},
			{
				"text": "멍충"
			},
			{
				"text": "멍청이"
			},
			{
				"text": "바부"
			},
			{
				"text": "멍처하"
			},
			{
				"text": "멍청이야"
			},
			{
				"text": "멍충이"
			}
		],
		"output": [
			{
				"text": "맞아요. 바보. 고객님밖에 모르는 바보…♥ 다른 건 배워나가면 되죠!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "매일 새로운 말을 학습 중이랍니다. 멋지게 성장할 거예요~ 대화창 고정!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "고객님께 걸맞는 챗봇이 되는 그 날까지…! 뚜벅뚜벅 나아갈 거예요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "다들 너무 똑똑하셔서 상대적으로 그래 보이는 거예요. (슬픔)\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "없다",
		"id": "default295",
		"filename": "default",
		"input": [
			{
				"text": "없다"
			},
			{
				"text": "몰르다"
			},
			{
				"text": "이해 잘 안 되다"
			},
			{
				"text": "이해 자다 안 돼다"
			},
			{
				"text": "모르다"
			}
		],
		"output": [
			{
				"text": "찾으시는 답변이 없으시다면 다른 키워드를 입력해 주시겠어요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "혹시 신한카드가 없으시다면 '처음'을 입력하시고 '카드추천' 메뉴를 이용해 보시는건 어떠세요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "부정-탄식",
		"id": "default296",
		"filename": "default",
		"input": [
			{
				"text": "허다"
			},
			{
				"text": "아오"
			},
			{
				"text": "엥"
			},
			{
				"text": "이렇다"
			},
			{
				"text": "칫"
			},
			{
				"text": "뭐임"
			},
			{
				"text": "아이"
			},
			{
				"text": "에고"
			},
			{
				"text": "음"
			},
			{
				"text": "이렇다 뇨"
			},
			{
				"text": "헉"
			},
			{
				"text": "흠"
			},
			{
				"text": "첨"
			},
			{
				"text": "하"
			},
			{
				"text": "아이구"
			},
			{
				"text": "어허"
			}
		],
		"output": [
			{
				"text": "아잉~ 근데 왜요?? \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "아하… (흠흠)  \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "감사",
		"id": "default297",
		"filename": "default",
		"input": [
			{
				"text": "감사"
			},
			{
				"text": "고마 웡"
			},
			{
				"text": "오케이"
			},
			{
				"text": "편하다"
			},
			{
				"text": "thank"
			},
			{
				"text": "감동"
			},
			{
				"text": "고맙다"
			},
			{
				"text": "괜찮다"
			},
			{
				"text": "금사"
			}
		],
		"output": [
			{
				"text": "감동… 하루 피로가 싹 사라지는 느낌이에요.\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "고객님 말씀듣고 충전 완료! 24시간 근무도 거뜬하겠는걸요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "감사합니다. 고객님! 힘이 솟아나는 기분이에요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "이름/누구",
		"id": "default298",
		"filename": "default",
		"input": [
			{
				"text": "이름"
			},
			{
				"text": "알파"
			},
			{
				"text": "누구"
			},
			{
				"text": "너 뭐"
			},
			{
				"text": "너 애기"
			},
			{
				"text": "뉘귀"
			},
			{
				"text": "너 대해"
			},
			{
				"text": "알파 거"
			},
			{
				"text": "누가"
			},
			{
				"text": "인공 지능"
			}
		],
		"output": [
			{
				"text": "저는 아직 많이 부족한 초초초보 챗봇에요. 열심히 공부하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "네 제가 바로 신한의 자동응답형 챗봇입니다. 데헷~ \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "저에 대해 궁금하신가요? 우리 차차 알아가기로 해요\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "부정-기능무시",
		"id": "default299",
		"filename": "default",
		"input": [
			{
				"text": "알다 게 없다"
			},
			{
				"text": "하나"
			},
			{
				"text": "가능하다 게"
			},
			{
				"text": "공부 많이"
			},
			{
				"text": "그냥 기사"
			},
			{
				"text": "그 쪽 궁금하다 게 없다"
			},
			{
				"text": "똑똑하다 다시"
			},
			{
				"text": "답변 안 되다"
			},
			{
				"text": "말 되다"
			},
			{
				"text": "모르다"
			},
			{
				"text": "대답 맞다 않다"
			},
			{
				"text": "뭐 하다 수 있다"
			},
			{
				"text": "무슨 소리"
			},
			{
				"text": "뭔 소리"
			},
			{
				"text": "알다 게 뭐"
			},
			{
				"text": "뭘 대답 하다 수 있다"
			},
			{
				"text": "대화 안 되다"
			},
			{
				"text": "아직 멀다"
			},
			{
				"text": "이 다야"
			},
			{
				"text": "카톡 보내다 마"
			},
			{
				"text": "도움 안 돼다"
			},
			{
				"text": "관련 없다 답변"
			},
			{
				"text": "해당 되다 내용 없다"
			},
			{
				"text": "헛소리"
			},
			{
				"text": "실망"
			},
			{
				"text": "뭔가"
			},
			{
				"regexp": "다야"
			}
		],
		"output": [
			{
				"kind": "Action",
				"if": "((new Date()).getTime() % 4) ==0",
				"repeat": "1",
				"options": {
					"output": "아직 부족해서 죄송해요. 매일 더 나아지려 노력하고 있어요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
				}
			},
			{
				"kind": "Action",
				"if": "((new Date()).getTime() % 4) ==1",
				"repeat": "1",
				"options": {
					"output": "제가 태어난 지 얼마 안 됐거든요… 더 열심히 공부할게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
				}
			},
			{
				"kind": "Action",
				"if": "((new Date()).getTime() % 4) ==2",
				"repeat": "1",
				"options": {
					"output": "제가 아직 배우는 중이라 조금 부족해도 이해해주세용~\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
				}
			},
			{
				"kind": "Action",
				"if": "((new Date()).getTime() % 4) ==3",
				"repeat": "1",
				"options": {
					"output": "오늘 컨디션이 별로라서… 흠흠.. 다음엔 꼭 답변해드릴게요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
				}
			}
		]
	},
	{
		"name": "나",
		"id": "default300",
		"filename": "default",
		"input": [
			{
				"text": "나다"
			}
		],
		"output": [
			{
				"text": "고객님이 좋으면 저는 더 좋아요~ 촤하하^^\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "나도나도~ 저도요 저도요~ (근데.. 뭐가??) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "시비",
		"id": "default301",
		"filename": "default",
		"input": [
			{
				"text": "재미있다"
			},
			{
				"text": "재다"
			},
			{
				"text": "재밌다"
			}
		],
		"output": [
			{
				"text": "고객님과 대화하는 건 항상 즐겁습니다.  :) \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "유머도 장착하겠습니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "시비2",
		"id": "default302",
		"filename": "default",
		"input": [
			{
				"text": "라이벌"
			}
		],
		"output": [
			{
				"text": "저는 제 할 일을 했을 뿐인걸요!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "깝치는 게 뭘까요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			}
		]
	},
	{
		"name": "물음표",
		"id": "default303",
		"filename": "default",
		"input": [
			{
				"text": "?"
			},
			{
				"text": "??"
			}
		],
		"output": [
			{
				"text": "뭐가 그리 궁금하신가요?\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
				"kind": "Text"
			},
			{
				"text": "!!!\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
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
		"output": [
			{
				"text": "안녕하세요, 신한카드입니다. \n저는 전화, 홈페이지 보다 메신저가 편한 고객님들을 위해 새롭게 선보이는 신한카드 자동채팅 서비스입니다.\n결제+혜택+재미=신한 FAN 과 카드에 대해 알려드리겠습니다.\n많이 이용해 주실꺼죠?\n\n신한 FAN, 카드 추천, 자주 묻는 질문(FAQ) 중 하나를 선택해 주세요.\n\n1. 신한 FAN을 알려줘요\n2. 내게 꼭 맞는 카드를 추천해줘요\n3. 궁금한게 있는데요(FAQ)",
				"buttons": [
					{
						"text": "신한 FAN을 알려줘요"
					},
					{
						"text": "내게 꼭 맞는 카드를 추천해줘요"
					},
					{
						"text": "궁금한게 있는데요(FAQ)"
					}
				],
				"kind": "Content"
			}
		],
		"buttons": [
			{
				"text": "신한 FAN을 알려줘요"
			},
			{
				"text": "내게 꼭 맞는 카드를 추천해줘요"
			},
			{
				"text": "궁금한게 있는데요(FAQ)"
			}
		],
		"task": {
			"name": "startTask"
		}
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [],
		"output": [
			"전 아직 알파고가 아닙니다. 죄송합니다. 다시 한번 궁금하신 키워드를 입력해 주시겠습니까?",
			"어제도 혼났습니다. 고객님 말씀 못 알아듣는다고… T.,T 다시 한번 단어로 입력해 주시겠습니까?",
			"계속 못 알아들어서 죄송합니다. 알파고 학원이라도 등록해야겠습니다. 다른 단어를 입력해 주시면 안 될까요?"
		]
	},
	{
		"name": "처음",
		"id": "commondefault90",
		"filename": "defaultcommon",
		"input": [
			{
				"text": "0"
			},
			{
				"text": "처음"
			},
			{
				"text": "반갑다 신한카드"
			}
		],
		"output": {
			"call": "시작"
		}
	},
	{
		"name": "판",
		"id": "commondefault192",
		"filename": "defaultcommon",
		"input": [
			{
				"regexp": "/^FAN$/"
			},
			{
				"regexp": "/^판$/"
			}
		],
		"output": {
			"call": "신한 FAN 플랫폼 소개"
		}
	},
	{
		"name": "이전",
		"id": "commondefault197",
		"filename": "defaultcommon",
		"input": [
			{
				"text": "9"
			},
			{
				"text": "이전"
			}
		],
		"output": {
			"up": "1"
		}
	},
	{
		"name": "FAQcommon",
		"id": "commondefault276",
		"filename": "defaultcommon",
		"input": [
			{
				"text": "궁금하다 있다 FAQ"
			}
		],
		"output": {
			"call": "FAN에 대해 자주하는 질문들(FAQ)"
		}
	},
	{
		"name": "카드 추천common",
		"id": "commondefault277",
		"filename": "defaultcommon",
		"input": [
			{
				"text": "내다 꼭 맞다 카드 추천 하다"
			}
		],
		"output": {
			"call": "신한 카드 추천"
		}
	},
	{
		"name": "가입하기",
		"id": "commondefault1322327",
		"filename": "defaultcommon",
		"input": [
			{
				"text": "가입 하다"
			}
		],
		"output": {
			"call": "FAN 가입_"
		}
	},
	{
		"name": "퀴즈커먼",
		"id": "commondefault1322332",
		"filename": "defaultcommon",
		"input": [
			{
				"text": "퀴즈"
			}
		],
		"output": "아쉽게도 퀴즈 이벤트는 종료되었습니다. \n하지만 다른 궁금하신 부분에 대해 답변할 준비는 되어 있습니다!"
	},
	{
		"name": "dialog_commondefault31322334",
		"id": "commondefault31322334",
		"filename": "defaultcommon",
		"input": [],
		"output": []
	}
];
var _bot = require(require('path').resolve("./engine/bot.js")).getBot('Shinhancard');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
