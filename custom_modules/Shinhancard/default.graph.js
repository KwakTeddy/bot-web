


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
		"output": "고객님께서 젤 좋아하는 카드사는? 힌트. 접니다.",
		"children": [
			{
				"name": "정답1",
				"id": "default214",
				"filename": "default",
				"input": [
					{
						"text": "신한카드"
					},
					{
						"text": "신한카드 사"
					},
					{
						"text": "신한"
					},
					{
						"text": "shinhancard"
					},
					{
						"text": "shinhan"
					}
				],
				"output": "정답입니다! 저도 고객님을 젤 좋아합니다 ♥♥ \n\n'나도' 라고 입력하시면 다음 퀴즈를 낼게요.",
				"children": [
					{
						"name": "정답",
						"id": "default216",
						"filename": "default",
						"input": [
							{
								"text": "24"
							}
						],
						"output": "와우!!\n축하드립니다!! 정답이에요."
					},
					{
						"name": "오답",
						"id": "default217",
						"filename": "default",
						"input": [
							{
								"if": "true"
							}
						],
						"output": "이런 정답이 아니에요.\n다시 시도하시겠습니까?",
						"children": [
							{
								"name": "네1",
								"id": "default218",
								"filename": "default",
								"input": [
									{
										"intent": "네"
									}
								],
								"output": {
									"up": "1"
								}
							},
							{
								"name": "아니요1",
								"id": "default222",
								"filename": "default",
								"input": [
									{
										"intent": "아니요"
									}
								],
								"output": "다음에 다시 도전해주세요~"
							}
						]
					}
				]
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
		],
		"task": {
			"name": "resetcount"
		}
	},
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "FAN"
			}
		],
		"output": {
			"output": "오우, FAN 을 선택해 주셨군요! 원하는 서비스를 선택해 주세요.\n \n 1. 신한 FAN에 가입하고 싶어요!\n 2. 신한 FAN은 어떤 혜택이 있나요?\n 3. 신한 FAN 활용 꿀팁 좀 알려주세요!\n 4. FAN으로 금융/납부서비스도 한다구요?",
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
					"text": "신한 FAN 금융/납부 서비스"
				}
			]
		},
		"name": "신한 FAN 플랫폼 소개",
		"inRaw": "FAN",
		"inNLP": "FAN",
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
				"output": {
					"output": "현명한 선택! 결제+혜택+재미가 있는 신한 FAN 입니다. \n\n✔ 신한 FAN은 신한카드가 없어도 가입가능!  \n✔ 신한 FAN에 가입 하시면 다양한 경품이 가득! \n✔ 신규 고객이라면 100% 당첨 경품 제공!",
					"image": {
						"url": "/files/Shinhancard1497408485049.jpg",
						"displayname": "FAN가입.jpg"
					}
				},
				"task": {
					"name": "task1",
					"buttons": [
						{
							"text": "가입하고 경품타자",
							"url": "https://newm.shinhancard.com/event/2015/pt06.jsp?prm=naver"
						},
						{
							"text": "이전단계"
						},
						{
							"text": "시작메뉴"
						}
					],
					"output": "현명한 선택! 결제+혜택+재미가 있는 신한 FAN 입니다. \n\n✔ 신한 FAN은 신한카드가 없어도 가입가능!  \n✔ 신한 FAN에 가입 하시면 다양한 경품이 가득! \n✔ 신규 고객이라면 100% 당첨 경품 제공!",
					"image": {
						"url": "/files/Shinhancard1497408485049.jpg",
						"displayname": "FAN가입.jpg"
					},
					"text": "현명한 선택! 결제재미가 있는 신한 FAN 입니다. \n\n✔ 신한 FAN은 신한카드가 없어도 가입가능!  \n✔ 신한 FAN에 가입 하시면 다양한 경품이 가득! \n✔ 신규 고객이라면 100% 당첨 경품 제공!"
				},
				"inRaw": "신한 FAN 가입",
				"inNLP": "신한 FAN 가입"
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
						"id": "default224",
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
							"output": "FAN 전용 할인, 포인트 적립/쿠폰, 각종 제휴사 혜택 등 놓칠 수 없는 FAN 혜택을 \n\n1. 모~두 보고 싶다면, 신한 FAN 혜택ZONE!\n\n2. 나한테 필요한 혜택만 골라보고 싶다면, 나만의 맞춤 쿠폰 Sally!\n",
							"buttons": [
								{
									"text": "신한 FAN 혜택 ZONE!"
								},
								{
									"text": "나만의 맞춤 쿠폰 Sally"
								},
								{
									"text": "이전단계"
								},
								{
									"text": "시작메뉴"
								}
							],
							"text": "FAN 전용 할인, 포인트 적립/쿠폰, 각종 제휴사 혜택 등 놓칠 수 없는 FAN 혜택을 \n\n1. 모~두 보고 싶다면, 신한 FAN 혜택ZONE!\n\n2. 나한테 필요한 혜택만 골라보고 싶다면, 나만의 맞춤 쿠폰 Sally!\n"
						},
						"children": [
							{
								"name": "FAN 혜택+ 서비스_",
								"id": "default226",
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
										"displayname": "혜택+.jpg"
									}
								}
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
								}
							}
						],
						"inRaw": "할인",
						"inNLP": "할인",
						"task": {
							"output": "FAN 전용 할인, 포인트 적립/쿠폰, 각종 제휴사 혜택 등 놓칠 수 없는 FAN 혜택을 \n\n1. 모~두 보고 싶다면, 신한 FAN 혜택ZONE!\n\n2. 나한테 필요한 혜택만 골라보고 싶다면, 나만의 맞춤 쿠폰 Sally!\n",
							"buttons": [
								{
									"text": "신한 FAN 혜택 ZONE!"
								},
								{
									"text": "나만의 맞춤 쿠폰 Sally"
								},
								{
									"text": "이전단계"
								},
								{
									"text": "시작메뉴"
								}
							],
							"text": "FAN 전용 할인, 포인트 적립/쿠폰, 각종 제휴사 혜택 등 놓칠 수 없는 FAN 혜택을 \n\n1. 모~두 보고 싶다면, 신한 FAN 혜택ZONE!\n\n2. 나한테 필요한 혜택만 골라보고 싶다면, 나만의 맞춤 쿠폰 Sally!\n"
						}
					},
					{
						"name": "이벤트_",
						"id": "default225",
						"filename": "default",
						"input": [
							{
								"intent": "이벤트"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"output": "신한 FAN 에서 매월 다양한 이벤트를 준비하고 여러분을 기다려요!\n \n✔ 6월 FAN 신규가입 이벤트\n✔ 6월 FAN 여름맞이 이벤트\n✔ 6월 FAN 추가포인트 적립 이벤트\n\n신한 FAN 고객이라면 바로 참여하러 고고. \n\n아직 가입 전이라면 '가입하기'부터!",
							"buttons": [
								{
									"text": "이벤트 참여하기",
									"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_304"
								},
								{
									"text": "가입하기"
								}
							],
							"image": {
								"url": "/files/Shinhancard1497416151023.jpg",
								"displayname": "이벤트.jpg"
							}
						}
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
						},
						{
							"text": "이전단계"
						},
						{
							"text": "시작메뉴"
						}
					],
					"text": "결제는 어떻게 하지? 어디에서? 어떤 혜택이 있다고? 포인트까지? 이 모든걸 FAN 에서 한번에! \n\n 1. FAN페이 결제\n 2. FAN페이 오프라인 가맹점 \n 3. 신한 FAN 생활형 서비스\n 4. 신한 FAN 클럽(통합포인트)"
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
								"displayname": "sns_FAN이용가이드.jpg"
							}
						}
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
								"displayname": "FAN-가맹점안내.jpg"
							}
						}
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
							"output": "신한 FAN에는 각종 혜택, 생활형 FUN 컨텐츠부터 금융편의 서비스까지 유용함이 한가득! 서비스를 선택해 주세요. \n\n1 혜택을 한눈에, 신한 FAN 제휴사 혜택ZONE!\n\n2. 흥하세요! 나의 운세는? \n\n3. 게임도 하고, 포인트도 쌓고\n\n4. AI 진짜가 나타났다, 페이봇\n\n5. 쉿! 최신 트렌드 정보\n\n6. 전설의 n빵, 더치페이",
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
								},
								{
									"text": "이전단계"
								},
								{
									"text": "시작메뉴"
								}
							],
							"text": "신한 FAN에는 각종 혜택, 생활형 FUN 컨텐츠부터 금융편의 서비스까지 유용함이 한가득! 서비스를 선택해 주세요. \n\n1 혜택을 한눈에, 신한 FAN 제휴사 혜택ZONE!\n\n2. 흥하세요! 나의 운세는? \n\n3. 게임도 하고, 포인트도 쌓고\n\n4. AI 진짜가 나타났다, 페이봇\n\n5. 쉿! 최신 트렌드 정보\n\n6. 전설의 n빵, 더치페이"
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
										},
										{
											"text": "이전단계"
										},
										{
											"text": "시작메뉴"
										}
									],
									"image": {
										"url": "/files/Shinhancard1497420190594.jpg",
										"displayname": "FAN_제휴사혜택.jpg"
									},
									"text": "\"우와, 이런 혜택. 놓칠 수 없어!\"\n \n신한 FAN 고객이라면 득템하러 고고.\n\n아직 가입 전이시면 '가입하기'부터!"
								},
								"inRaw": "제휴사 혜택",
								"inNLP": "제휴 사 혜택",
								"task": {
									"output": "\"우와, 이런 혜택. 놓칠 수 없어!\"\n \n신한 FAN 고객이라면 득템하러 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
									"buttons": [
										{
											"text": "혜택 보기",
											"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_104"
										},
										{
											"text": "가입하기"
										},
										{
											"text": "이전단계"
										},
										{
											"text": "시작메뉴"
										}
									],
									"image": {
										"url": "/files/Shinhancard1497420190594.jpg",
										"displayname": "FAN_제휴사혜택.jpg"
									},
									"text": "\"우와, 이런 혜택. 놓칠 수 없어!\"\n \n신한 FAN 고객이라면 득템하러 고고.\n\n아직 가입 전이시면 '가입하기'부터!"
								}
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
										"displayname": "타로.jpg"
									}
								}
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
										"displayname": "게임.jpg"
									}
								}
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
									"output": "\"내 카드값 다 어디에 쓴거야?\"\n\n✔ 단골 가맹점\n✔ 많이 쓴 가맹점\n✔ 즐겨쓰는 카드\n✔ 많이 쓰는 요일\n✔ 많이 쓰는 업종\n\n똑똑한 금융 비서 페이봇이 고객님의 소비내역을 분석해 드려요! 이것만 잘 봐도 꼭 써야할 곳만 쓰게 되겠죠?\n\n신한 FAN 고객이라면 페이봇 만나러 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
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
										"displayname": "페이봇.jpg"
									}
								}
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
										"displayname": "트렌디연구소.jpg"
									}
								}
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
										"displayname": "더치페이.jpg"
									}
								}
							}
						],
						"inRaw": "이전단계",
						"inNLP": "이전 단계",
						"task": {
							"output": "신한 FAN에는 각종 혜택, 생활형 FUN 컨텐츠부터 금융편의 서비스까지 유용함이 한가득! 서비스를 선택해 주세요. \n\n1 혜택을 한눈에, 신한 FAN 제휴사 혜택ZONE!\n\n2. 흥하세요! 나의 운세는? \n\n3. 게임도 하고, 포인트도 쌓고\n\n4. AI 진짜가 나타났다, 페이봇\n\n5. 쉿! 최신 트렌드 정보\n\n6. 전설의 n빵, 더치페이",
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
								},
								{
									"text": "이전단계"
								},
								{
									"text": "시작메뉴"
								}
							],
							"text": "신한 FAN에는 각종 혜택, 생활형 FUN 컨텐츠부터 금융편의 서비스까지 유용함이 한가득! 서비스를 선택해 주세요. \n\n1 혜택을 한눈에, 신한 FAN 제휴사 혜택ZONE!\n\n2. 흥하세요! 나의 운세는? \n\n3. 게임도 하고, 포인트도 쌓고\n\n4. AI 진짜가 나타났다, 페이봇\n\n5. 쉿! 최신 트렌드 정보\n\n6. 전설의 n빵, 더치페이"
						}
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
								"displayname": "판클럽.jpg"
							}
						}
					}
				],
				"inRaw": "포인트",
				"inNLP": "포인트",
				"task": {
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
						},
						{
							"text": "이전단계"
						},
						{
							"text": "시작메뉴"
						}
					],
					"text": "결제는 어떻게 하지? 어디에서? 어떤 혜택이 있다고? 포인트까지? 이 모든걸 FAN 에서 한번에! \n\n 1. FAN페이 결제\n 2. FAN페이 오프라인 가맹점 \n 3. 신한 FAN 생활형 서비스\n 4. 신한 FAN 클럽(통합포인트)"
				}
			},
			{
				"name": "금융/납부 서비스_",
				"id": "default210",
				"filename": "default",
				"input": [
					{
						"intent": "금융/납부 서비스"
					},
					{
						"text": "4"
					}
				],
				"output": {
					"output": "신한 FAN 에서 바로 대출 및 자동 납부 서비스를 신청할 수 있어요. 원하는 서비스를 선택해 주세요. \n\n1. 단기카드대출(현금서비스)\n2. 장기카드대출(카드론)\n3. 신한카드 없어도 대출 (MF일반대출)\n4. 납부서비스",
					"buttons": [
						{
							"text": "단기카드대출"
						},
						{
							"text": "장기카드대출"
						},
						{
							"text": "MF일반대출"
						},
						{
							"text": "납부서비스"
						}
					]
				},
				"children": [
					{
						"name": "단기카드대출_",
						"id": "default240",
						"filename": "default",
						"input": [
							{
								"intent": "단기카드대출"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"output": "단기카드대출(현금서비스)를 받아 고객님 계좌로 입금해 드리는 서비스로 365일 24시간 이용 가능합니다. \n\n✔ 한도 및 이자율 조회\n✔ 이용내역 조회\n\n신한 FAN 고객이라면 단기카드대출 자세히보기로 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
							"buttons": [
								{
									"text": "단기카드대출 바로가기",
									"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_201"
								},
								{
									"text": "가입하기"
								}
							],
							"image": {
								"url": "/files/Shinhancard1497422698865.jpg",
								"displayname": "단기카드대출(현금서비스).jpg"
							}
						}
					},
					{
						"name": "장기카드대출_",
						"id": "default241",
						"filename": "default",
						"input": [
							{
								"intent": "장기카드대출"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"output": "신청서, 심사기간, 취급/중도상환수수료가 없고,  365일 언제나, 휴일에도 신청 가능합니다. \n\n✔ 스피드론\n✔ 프리미엄론\n✔ 대출조건/상환내역 조회\n\n신한 FAN 고객이라면 장기카드대출 자세히보기로 고고.\n\n아직 가입 전이시면 '가입하기'부터!\n",
							"buttons": [
								{
									"text": "장기카드대출 바로가기",
									"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_202"
								},
								{
									"text": "가입하기"
								}
							],
							"image": {
								"url": "/files/Shinhancard1497423073106.jpg",
								"displayname": "장기카드대출(카드론).jpg"
							}
						}
					},
					{
						"name": "MF일반대출_",
						"id": "default242",
						"filename": "default",
						"input": [
							{
								"intent": "MF일반대출"
							},
							{
								"text": "3"
							}
						],
						"output": {
							"output": "신한카드가 없어도 이용가능한 중금리신용대출를 이용해 보세요. \n\n✔ 즉시대출\n✔ 직장인대출\n✔ 개인사업자대출\n✔ 아파트소유자대출\n✔ 국민연금납부자대출\n✔ 국민연금수령자대출\n✔ 자동차담보대출\n✔ 스피드론2\n\n신한 FAN 고객이라면 MF일반대출 자세히보기로 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
							"buttons": [
								{
									"text": "MF일반대출 바로가기",
									"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_203"
								},
								{
									"text": "가입하기"
								}
							],
							"image": {
								"url": "/files/Shinhancard1497423171724.jpg",
								"displayname": "MF일반대출.jpg"
							}
						}
					},
					{
						"name": "납부서비스_",
						"id": "default243",
						"filename": "default",
						"input": [
							{
								"intent": "납부서비스"
							},
							{
								"text": "4"
							}
						],
						"output": {
							"output": "매달 내야하는 요금들, 일일이 챙기기 번거로우셨죠? 신한 FAN을 통해 납부서비스를 이용할 수 있습니다!\n\n✔ 전기요금 \n✔ 전화요금\n✔ 도시가스요금\n✔ 대학등록금\n✔ 아파트 관리비\n✔ 원격결제/조회\n\n신한 FAN 고객이라면 납부서비스로 고고.\n\n아직 가입 전이시면 '가입하기'부터!",
							"buttons": [
								{
									"text": "납부서비스 바로가기",
									"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_308"
								},
								{
									"text": "가입하기"
								}
							],
							"image": {
								"url": "/files/Shinhancard1497423267457.jpg",
								"displayname": "납부서비스.jpg"
							}
						}
					}
				]
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
			}
		],
		"output": {
			"output": "역시 카드는 신한카드죠. 제 자랑같지만 우리나라에서 제일 많이 쓰는 카드에요. :)\n\n 소비 패턴 및 결제 스타일을 선택해 주시면 \"내게 맞는 카드\"를 추천해 드리겠습니다.\n \n 먼저 결제 스타일부터 알아볼까요?\n\n 1. 신용카드를 선호합니다.\n 2. 체크카드를 선호합니다.",
			"buttons": [
				{
					"text": "신용카드"
				},
				{
					"text": "체크카드"
				}
			]
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
									"output": "[신한카드 YOLO ⓘ]\n카드가 딱이네요!\n\n✔ 6개 선택처 할인율 선택(커피,택시,편의점,베이커리,소셜커머스,영화)\n✔ 카드 디자인 선택\n✔ 분기별 Bonus 모바일 쿠폰\n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
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
									"output": "[신한 Hi-Point 카드 Nano f]\n카드가 딱이네요!\n \n✔ 직접 고른 스타일과 거리에서 최고 5% 적립\n✔ 어디서나 최고 2% 적립\n✔ 주유 적립\n \n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
									"image": {
										"url": "/files/Shinhancard1496222865319.jpg",
										"displayname": "card02.jpg"
									}
								},
								"task": "NANOf"
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
									"output": "고객님은 어떤 소비유형에 가까우신가요?\n \n 1. 일상생활의 다양한 할인을 추구한다.\n 2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n 3. 기름값, 교통비 할인을 원하는 실속파다.",
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
								"children": [
									{
										"name": "생활할인형카카오",
										"id": "default69",
										"filename": "default",
										"input": [
											{
												"text": "1",
												"if": "context.user.channel == 'kakao'"
											},
											{
												"text": "생활",
												"if": "context.user.channel == 'kakao'"
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
													"output": "[신한카드 Mr.Life]\n싱글족을 위한 맞춤형 카드 \n\n✔ 시간대별 할인\n✔ 주말사용, 공과금 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
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
													"output": "[신한카드 B.BIG]\n직장인의 최적화 할인카드 \n\n✔ 대중교통 최대600원 할인\n✔ 백화점,커피,편의점,영화 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1497428142803.jpg",
														"displayname": "card09.jpg"
													}
												},
												"task": {
													"name": "BBig"
												}
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
													"output": "[신한카드 NOON]\n굿 애프터Noon~!! \n\n✔ 점심값 20%할인\n✔ 커피, 통신, 택시 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1497428235548.jpg",
														"displayname": "card32.jpg"
													}
												},
												"task": {
													"name": "Noon"
												}
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
													"output": "[신한카드 미래설계]\n생활할인과 금융서비스 혜택까지 \n \n✔ 전 가맹점 포인트 적립\n✔ 각종 생활비 할인\n✔ 신한생명 보험료 할인\n \n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1497428290478.jpg",
														"displayname": "card03.jpg"
													}
												},
												"task": "mirae"
											}
										]
									},
									{
										"name": "소비추구형카카오",
										"id": "default70",
										"filename": "default",
										"input": [
											{
												"text": "소비",
												"if": "context.user.channel == 'kakao'"
											},
											{
												"text": "여유",
												"if": "context.user.channel == 'kakao'"
											},
											{
												"text": "2",
												"if": "context.user.channel == 'kakao'"
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
													"output": "[신한카드 Always FAN]\n온라인 결제 특화 카드 \n\n✔ FAN페이 온라인결제 5% 할인\n✔ 커피,영화,편의점 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
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
													"output": "[신한카드 O2O]\n온•오프라인을 뛰어넘는 할인!\n\n✔ 모바일 전용카드 Pay 할인\n✔ 스타벅스 사이렌오더 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
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
													"output": "[신한카드 YOLO Tasty]\nTrendy한 욜로족을 위한 할인!\n\n✔ 쇼핑,다이닝,몰링 10% 할인\n✔ 영화,택시,커피 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1497428689198.jpg",
														"displayname": "card07.jpg"
													}
												},
												"task": {
													"name": "YOLOTasty"
												}
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
													"output": "[신한카드 The LADY CLASSIC]\n여성 프리미엄 회원을 위하여!\n\n✔ 쇼핑•육아•웰빙 캐시백\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1497428759311.jpg",
														"displayname": "card10.jpg"
													}
												},
												"task": {
													"name": "TheLadyClassic"
												}
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
											"output": "[GS칼텍스 신한카드 Shine]\n카드가 딱이네요!\n\n✔ GS칼텍스 주유 할인\n✔ 대중교통 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
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
								"output": {
									"output": "고객님은 어떤 소비유형에 가까우신가요?\n \n 1. 숫자에 민감하며, 재테크에 관심이 많다. \n 2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n 3. 여행을 좋아한다. 항공마일리지에 집중!\n 4. 기름값, 생활비 적립을 원하는 실속파다.",
									"buttons": [
										{
											"text": "숫자민감형"
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
								},
								"children": [
									{
										"name": "숫자민감형2",
										"id": "default73",
										"filename": "default",
										"input": [
											{
												"text": "숫자"
											},
											{
												"text": "재테크"
											},
											{
												"text": "1"
											}
										],
										"output": {
											"output": "[신한카드 주거래 신용(스마트 OTP 겸용)]\n카드가 딱이네요! \n \n✔ 전 가맹점 포인트 적립\n✔ 쇼핑•해외 추가 적립\n✔ 생활 적립\n \n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
											"image": {
												"url": "/files/Shinhancard1496222965267.jpg",
												"displayname": "card13.jpg"
											}
										},
										"task": "Main"
									},
									{
										"name": "소비추구형2",
										"id": "default74",
										"filename": "default",
										"input": [
											{
												"text": "소비",
												"if": "context.user.channel == 'kakao'"
											},
											{
												"text": "여유",
												"if": "context.user.channel == 'kakao'"
											},
											{
												"text": "2",
												"if": "context.user.channel == 'kakao'"
											}
										],
										"output": {
											"output": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 2가지가 있네요. 아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요. \n \n 1. 1년에 최대 60만 포인트 적립. 포인트 적립의 끝판왕! [신한카드 Hi-Point]\n\n 2.신한카드 레저 맴버가 되고 싶은 고객님을 위한 카드입니다 [신한카드 The CLASSIC-L]",
											"buttons": [
												{
													"text": "Hi-Point"
												},
												{
													"text": "The CLASSIC-L"
												}
											]
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
													"output": "[신한카드 Hi-Pint]\n포인트 적립의 끝판왕! \n\n✔ 모든 가맹점 적립\n✔ 주유 60원 적립\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
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
													"output": "[신한카드 The CLASSIC-L]\n레저를 원하는 당신을 위해!!\n\n✔ 리조트•캠핑 무료 숙박\n✔ 주유 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1496222991777.jpg",
														"displayname": "card15.jpg"
													}
												},
												"task": "TheClassicL"
											}
										]
									},
									{
										"name": "여행덕후형카카오",
										"id": "default75",
										"filename": "default",
										"input": [
											{
												"text": "여행",
												"if": "context.user.channel == 'kakao'"
											},
											{
												"text": "항공",
												"if": "context.user.channel == 'kakao'"
											},
											{
												"text": "3",
												"if": "context.user.channel == 'kakao'"
											}
										],
										"output": {
											"output": "여행 즐기시는 고객님께서 좋아하실만한 신용카드가 3가지나 있네요. 아래 3가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요. \n \n 1. 항공 마일리지에 다양한 포인트 적립까지 제공합니다 [신한카드 Air Platinum#]\n\n 2. 아시아나 마일리지 적립의 끝판왕 [신한카드 아시아나 Air1.5]\n\n 3. 항공 마일리지 적립, PP카드와 Gift Option 제공 [신한카드 The Classic+ 카드]",
											"buttons": [
												{
													"text": "Air Platinum#"
												},
												{
													"text": "아시아나 Air 1.5"
												},
												{
													"text": "The Classic+"
												}
											]
										},
										"children": [
											{
												"name": "Air Platinum#",
												"id": "default155",
												"filename": "default",
												"input": [
													{
														"text": "1"
													},
													{
														"text": "Air Platinum"
													}
												],
												"output": {
													"output": "[신한카드 Air Platinum#]\n마일리지와 포인트를 동시에!\n\n✔ 항공 마일리지 적립\n✔ 포인트 추가 적립\n✔ 무료 주차/발렛파킹 \n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1497430841837.jpg",
														"displayname": "card17.jpg"
													}
												},
												"task": {
													"name": "Air"
												}
											},
											{
												"name": "Asiana",
												"id": "default156",
												"filename": "default",
												"input": [
													{
														"text": "2"
													},
													{
														"text": "아시아나 Air 1 5"
													},
													{
														"text": "아시아나"
													}
												],
												"output": {
													"output": "[신한카드 아시아나 Air 1.5]\n기승전 마일리지!! \n\n✔ 아시아나 마일리지 특화적립\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n(버튼링크명) 바로가기",
													"image": {
														"url": "/files/Shinhancard1497431142371.jpg",
														"displayname": "card31.jpg"
													}
												},
												"task": {
													"name": "Air15"
												}
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
													"output": "[신한카드 The Classic+]\n매년 최대 12만원 Gift옵션 제공\n\n✔ 항공마일리지 추가적립\n✔ PP카드 제공\n✔ Gift Option선택\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
													"image": {
														"url": "/files/Shinhancard1497431214583.jpg",
														"displayname": "card20.jpg"
													}
												},
												"task": {
													"name": "TheClassicplus"
												}
											}
										]
									},
									{
										"name": "OIL실속형카카오2",
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
											"output": "[신한카드 RPM+ Platinum#]\n카드가 딱이네요!\n\n✔ 모든 주유소 적립\n✔ 모든 가맹점 적립\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.",
											"image": {
												"url": "/files/Shinhancard1497431326194.jpg",
												"displayname": "card16.jpg"
											}
										},
										"task": {
											"name": "RPM"
										}
									},
									{
										"name": "소비추구형카카오2",
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
								]
							}
						]
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
					"output": "체크카드를 선택하셨군요! 소득공제와 카드 혜택 둘다 잡아야죠~\n\n고객님이 직접 혜택을 필요한 것만 골라 구성할 수도 있고, 미리 구성되어 있는 카드 중에서 고르실 수도 있어요. \n아래 보기중에서 선택해 주세요. \n\n 1. 직접 혜택을 구성하고 싶다 (혜택선택형)\n 2. 구성되어 있는 카드를 고르고 싶다(혜택기본형)",
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
							"output": "[신한카드 4Tune체크]\n카드가 딱이네요!\n\n✔ 기본적립 + 선택적립\n✔ 커피 10%할인 \n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
							"image": {
								"url": "/files/Shinhancard1497433256845.jpg",
								"displayname": "card21.jpg"
							}
						},
						"task": {
							"name": "FourTune"
						}
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
									"text": "2030세대가 맞아요"
								},
								{
									"text": "2030세대가 아니에요"
								}
							]
						},
						"children": [
							{
								"name": "2030",
								"id": "default83",
								"filename": "default",
								"input": [
									{
										"text": "1"
									},
									{
										"text": "2030 세대 맞다"
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
													"output": "[신한 S20 pink체크카드]\n스무살, 첫 금융특권\n\n✔ 쇼핑, 편의점, 통신, 커피 할인\n✔ 어학원,서점,학원 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
													"image": {
														"url": "/files/Shinhancard1496223114080.jpg",
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
													"output": "[신한 S20 체크카드]\n스무살, 첫 금융특권\n\n✔ 쇼핑, 편의점, 통신, 커피 할인\n✔ 어학원,서점,학원 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
													"image": {
														"url": "/files/Shinhancard1496223125514.jpg",
														"displayname": "card22.jpg"
													}
												},
												"task": "S20"
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
										"task": "cardlist5"
									}
								]
							},
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
								"output": {
									"output": "그렇다면 고객님의 소비성향을 알려주세요. \n\n1. 주유, 쇼핑 등 생활 혜택에 관심이 있으신 알뜰 실속파\n2. 해외에서도 혜택은 챙기는 센스실속파\n3. 주거래 계좌 연결하시면 기본+추가+특별 적립이 한번에! 슈퍼 실속파",
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
													"output": "[쿠팡 신한카드 체크]\n\n✔ 쿠팡 캐시 무제한 적립\n✔ 스타벅스 10% 캐시백\n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
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
													"output": "[카카오페이 신한 체크카드]\n\n✔ 카카오페이 10% 캐시백\n✔ GS25, 스타벅스 10% 캐시백\n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
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
													"output": "[신한카드 S-Line 체크]\n\n✔ 할인+적립+금융우대 서비스\n✔ 전가맹점 포인트 적립\n✔ 요식,대중교통 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
													"image": {
														"url": "/files/Shinhancard1497433809997.jpg",
														"displayname": "card34.jpg"
													}
												},
												"task": {
													"name": "SLine"
												}
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
													"output": "[신한카드 하이패스(전용) 체크]\n\n✔ 하이패스 요금 적립\n✔ 출퇴근시간대 통행료 할인\n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
													"image": {
														"url": "/files/Shinhancard1497434030857.jpg",
														"displayname": "card24.jpg"
													}
												},
												"task": "hypass"
											}
										],
										"inRaw": "이전단계",
										"inNLP": "이전 단계"
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
										"output": {
											"output": "[신한카드 주거래 체크]\n카드가 딱이네요!\n\n✔ 전가맹점 적립\n✔ 쇼핑,해외,생활 추가 적립\n\n자세한 내용을 보시려면 아래의 링크를 클릭해 주세요.",
											"image": {
												"url": "/files/Shinhancard1496223253775.jpg",
												"displayname": "card29.jpg"
											}
										},
										"task": "MainCheck",
										"inRaw": "슈퍼실속파",
										"inNLP": "슈퍼 실속 파"
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
		"name": "FAN에 대해 자주하는 질문들(FAQ)",
		"id": "default21",
		"filename": "default",
		"input": [
			{
				"intent": "FAQ"
			}
		],
		"output": "궁금하신 부분을 단어로 입력해 주시면 제가 아는 가장 알맞은 답변을 안내해 드리겠습니다."
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
			"output": "안녕하세요, 신한카드입니다. \n저는 전화, 홈페이지 보다 메신저가 편한 고객님들을 위해 새롭게 선보이는 신한카드 자동채팅 서비스입니다. 결제+혜택+재미=신한 FAN 과 카드에 대해 알려드리겠습니다. 많이 이용해 주실꺼죠?\n\n신한 FAN, 카드 추천, 자주 묻는 질문(FAQ) 중 하나를 선택해 주세요.",
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
			"text": "안녕하세요, 신한카드입니다. \n저는 전화, 홈페이지 보다 메신저가 편한 고객님들을 위해 새롭게 선보이는 신한카드 자동채팅 서비스입니다. 결제재미=신한 FAN 과 카드에 대해 알려드리겠습니다. 많이 이용해 주실꺼죠?\n\n신한 FAN, 카드 추천, 자주 묻는 질문(FAQ) 중 하나를 선택해 주세요."
		},
		"inRaw": "이전단계",
		"inNLP": "이전 단계"
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": [],
		"output": "고객님, 신한카드는 FAN, 맞춤형 카드 추천, 자주묻는 질문에 대한 답변이 학습되어 있어요.\n어떤 내용 관련하여 상담을 받고 싶으신가요?\n충분한 답변이 되지 않았으면 고객센터로 문의하시면 전문 상담원을 통하여 상세한 답변을 해드릴 수 있습니다.\n(1544-7000)"
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
				"text": "반갑다 신한카드 이다"
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
		"name": "FAN 가입",
		"id": "commondefault231",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "FAN 가입"
			}
		],
		"output": {
			"call": "FAN 가입_"
		}
	},
	{
		"name": "FAN 혜택",
		"id": "comdefault4",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "FAN 혜택"
			}
		],
		"output": {
			"call": "FAN 혜택_"
		},
		"inRaw": "신한 FAN에는 어떤 혜택이 있나요",
		"inNLP": "신한 FAN 에는 어떻다 혜택 있다"
	},
	{
		"name": "FAN 전용 적립 및 할인",
		"id": "comdefault5",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "FAN 전용 적립 및 할인"
			}
		],
		"output": {
			"call": "FAN 전용 적립 및 할인_"
		},
		"inRaw": "FAN 전용 적립 및 할인",
		"inNLP": "FAN 전용 적립 및 할인"
	},
	{
		"name": "이벤트",
		"id": "comdefault6",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "이벤트"
			}
		],
		"output": {
			"call": "이벤트_"
		},
		"inRaw": "진행중인 대박 이벤트",
		"inNLP": "진행중 인 대박 이벤트"
	},
	{
		"name": "혜택 안내",
		"id": "comdefault7",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "혜택 안내"
			}
		],
		"output": {
			"call": "FAN 혜택+ 서비스_"
		},
		"inRaw": "신한 FAN 혜택ZONE!",
		"inNLP": "신한 FAN 혜택 ZONE"
	},
	{
		"name": "Sally 쿠폰 상세",
		"id": "comdefault9",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "Sally"
			}
		],
		"output": {
			"call": "Sally_"
		},
		"inRaw": "나만의 맞춤 쿠폰 Sally",
		"inNLP": "나 만의 맞춤 쿠폰 Sally"
	},
	{
		"name": "이용안내",
		"id": "comdefault10",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "이용안내"
			}
		],
		"output": {
			"call": "이용안내_"
		},
		"inRaw": "이전단계",
		"inNLP": "이전 단계"
	},
	{
		"name": "FAN 결제 이용가이드",
		"id": "comdefault11",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "FAN 결제 이용가이드"
			}
		],
		"output": {
			"call": "FAN페이 결제 이용가이드"
		},
		"inRaw": "FAN페이 결제",
		"inNLP": "FAN 페이 결제"
	},
	{
		"name": "FAN페이 가맹점 안내",
		"id": "comdefault12",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "FAN페이 가맹점"
			}
		],
		"output": {
			"call": "FAN페이 오프라인 가맹점_"
		},
		"inRaw": "FAN페이 오프라인 가맹점",
		"inNLP": "FAN 페이 오프라인   가맹 점"
	},
	{
		"name": "다양한 제휴/FUN/생활/금융 서비스",
		"id": "comdefault13",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "다양한 제휴/FUN/생활/금융 서비스"
			}
		],
		"output": {
			"call": "신한 FAN 생활금융 서비스_"
		},
		"inRaw": "이전단계",
		"inNLP": "이전 단계"
	},
	{
		"name": "통합리워드(포인트) 신한 FAN클럽",
		"id": "comdefault14",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "FAN클럽"
			}
		],
		"output": {
			"call": "FAN 클럽_"
		},
		"inRaw": "신한 FAN클럽 (통합포인트)",
		"inNLP": "신한 FAN 클럽 통합 포인트"
	},
	{
		"name": "제휴사서비스(혜택+)",
		"id": "comdefault15",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "제휴사서비스"
			}
		],
		"output": {
			"call": "제휴사 서비스_"
		},
		"inRaw": "제휴사서비스(혜택+)",
		"inNLP": "제휴 사 서비스 혜택"
	},
	{
		"name": "운세",
		"id": "comdefault16",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "운세"
			}
		],
		"output": {
			"call": "운세_"
		},
		"inRaw": "운세",
		"inNLP": "운세"
	},
	{
		"name": "게임",
		"id": "comdefault17",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "게임"
			}
		],
		"output": {
			"call": "게임_"
		},
		"inRaw": "게임",
		"inNLP": "게임"
	},
	{
		"name": "페이봇",
		"id": "comdefault18",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "페이봇"
			}
		],
		"output": {
			"call": "페이봇_"
		},
		"inRaw": "페이봇",
		"inNLP": "페이 봇"
	},
	{
		"name": "트렌드연구소",
		"id": "comdefault19",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "트렌드연구소"
			}
		],
		"output": {
			"call": "트렌드_"
		},
		"inRaw": "신한 트렌드연구소",
		"inNLP": "신한 트렌드 연구소"
	},
	{
		"name": "더치페이",
		"id": "comdefault20",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "더치페이"
			}
		],
		"output": {
			"call": "더치페이_"
		},
		"inRaw": "더치페이",
		"inNLP": "더치페이"
	},
	{
		"name": "금융/납부 서비스",
		"id": "comdefault192",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "금융/납부 서비스"
			}
		],
		"output": {
			"call": "금융/납부 서비스_"
		},
		"inRaw": "이전단계",
		"inNLP": "이전 단계"
	},
	{
		"name": "단기카드대출",
		"id": "comdefault193",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "단기카드대출"
			}
		],
		"output": {
			"call": "단기카드대출_"
		},
		"inRaw": "단기카드대출(현금서비스)",
		"inNLP": "단기 카드 대출 현금 서비스"
	},
	{
		"name": "장기카드대출",
		"id": "comdefault195",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "장기카드대출"
			}
		],
		"output": {
			"call": "장기카드대출_"
		},
		"inRaw": "장기카드대출(카드론)",
		"inNLP": "장기 카드 대출 카드 론"
	},
	{
		"name": "MF일반대출",
		"id": "comdefault197",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "MF일반대출"
			}
		],
		"output": {
			"call": "MF일반대출_"
		},
		"inRaw": "MF일반대출",
		"inNLP": "MF 일반 대출"
	},
	{
		"name": "납부서비스",
		"id": "comdefault198",
		"filename": "defaultcommon",
		"input": [
			{
				"intent": "납부서비스"
			}
		],
		"output": {
			"call": "납부서비스_"
		},
		"inRaw": "4",
		"inNLP": "4"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('Shinhancard');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
