


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "객실"
			},
			{
				"text": "1"
			}
		],
		"output": {
			"text": "[객실]\n\n머니브레인 호텔 객실 예약 관련 사항을 도와드리겠습니다. \n아래의 항목중에서 필요하신 메뉴를 선택해주세요. \n\n1. 객실 정보\n2. 객실 예약\n3. 객실 에약 확인\n4. 객실 예약 취소",
			"kind": "Text"
		},
		"name": "객실",
		"children": [
			{
				"name": "이름",
				"id": "default1",
				"filename": "default",
				"input": [
					{
						"types": [
							"myname"
						]
					}
				],
				"output": {
					"text": "+myname+입니다.",
					"kind": "Text"
				},
				"task": {
					"name": "mynamesave"
				}
			},
			{
				"name": "객실 정보",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"text": "정보"
					},
					{
						"text": "1"
					}
				],
				"output": {
					"text": "[객실 정보]\n\n머니브레인 호텔에는 총 3가지 종류의 객실이 있습니다. 확인하고 싶으시면 객실 종류를 선택해주세요.\n\n1. 싱글룸\n2. 디럭스룸\n3. 스위트룸",
					"kind": "Text"
				},
				"children": [
					{
						"name": "싱글룸",
						"id": "default5",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "싱글"
							}
						],
						"output": {
							"text": "[객실 정보 - 싱글룸]\n싱글룸은 편안하고 안락한 공간을 효율적으로 구성했습니다. \n\n싱글룸 구성 \n- 침실1, 욕실1, 화장실1\n- 전망 : 시티뷰 또는 오션뷰\n- 침대 : 더블, 트윈\n- 크기 : 36m2\n- 체크인 : 오후 3시\n- 체크아웃 : 낮 12시\n- 55인치 스마트 TV(위성 TV 52개 채널)위성채널정보\n- 300Mbps 초고속 인터넷 유∙무선(wi-fi) 무료\n- 220V, 110V 전압 사용 가능\n- 커피·차 티백 무료 제공\n- 엑스트라 베드 1개 추가 30,000원/1박\n- 베이비 크립(무료)\n\n[객실 이미지]",
							"image": {
								"url": "/files/Hotel_bot1499950855867.jpg",
								"displayname": "싱글 객실.jpg"
							},
							"kind": "Content"
						}
					},
					{
						"name": "디럭스룸",
						"id": "default6",
						"filename": "default",
						"input": [
							{
								"text": "2"
							},
							{
								"text": "디럭스"
							}
						],
						"output": {
							"text": "[객실 정보 - 디럭스룸]\n여유로운 휴식공간이 돋보이는 디럭스룸에 라운지 서비스를 더한 객실입니다. \n\n디럭스룸 구성 \n- 침실1, 욕실1, 화장실1\n- 전망 : 시티뷰 또는 오션뷰\n- 침대 : 더블, 트윈\n- 크기 : 43m2\n- 체크인 : 오후 3시\n- 체크아웃 : 낮 12시\n- 65인치 스마트 TV(위성 TV 52개 채널)위성채널정보\n- 300Mbps 초고속 인터넷 유∙무선(wi-fi) 무료\n- 220V, 110V 전압 사용 가능\n- 커피·차 티백 무료 제공\n- 엑스트라 베드 1개 추가 30,000원/1박\n- 베이비 크립(무료)\n[객실 이미지]",
							"image": {
								"url": "/files/Hotel_bot1499950900068.jpeg",
								"displayname": "디럭스 객실.jpeg"
							},
							"kind": "Content"
						}
					},
					{
						"name": "스위트룸",
						"id": "default9",
						"filename": "default",
						"input": [
							{
								"text": "3"
							},
							{
								"text": "스위트룸"
							}
						],
						"output": [
							{
								"text": "[객실 정보 - 스위트룸]\n여유로운 휴식공간이 돋보이는 디럭스룸에 라운지 서비스를 더한 객실입니다. \n\n디럭스룸 구성 \n- 침실1, 욕실1, 화장실1\n- 전망 : 시티뷰 또는 오션뷰\n- 침대 : 더블, 트윈\n- 크기 : 43m2\n- 체크인 : 오후 3시\n- 체크아웃 : 낮 12시\n- 65인치 스마트 TV(위성 TV 52개 채널)위성채널정보\n- 300Mbps 초고속 인터넷 유∙무선(wi-fi) 무료\n- 220V, 110V 전압 사용 가능\n- 커피·차 티백 무료 제공\n- 엑스트라 베드 1개 추가 30,000원/1박\n- 베이비 크립(무료)\n[객실 이미지 보기]",
								"image": {
									"url": "/files/Hotel_bot1499950914400.jpg",
									"displayname": "스윗룸 객실.jpg"
								},
								"kind": "Content"
							}
						]
					}
				]
			},
			{
				"name": "객실 예약",
				"id": "default11",
				"filename": "default",
				"input": [
					{
						"text": "예약"
					},
					{
						"text": "2"
					}
				],
				"output": {
					"text": "[객실 - 객실 예약]\n머니브레인 호텔에는 총 3가지 종류의 객실이 있습니다. 예약하고 싶으시면 객실 종류를 선택해주세요.\n\n1. 싱글룸\n2. 디럭스룸\n3. 스위트룸",
					"kind": "Text"
				},
				"children": [
					{
						"name": "객실 예약 날짜",
						"id": "default12",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "싱글 룸"
							}
						],
						"output": {
							"text": "[객실 예약]\n객실 예약 진행 정보\n- 객실 종류 : 싱글룸\n\n체크인 하실 날짜를 말씀해주세요.",
							"kind": "Text"
						},
						"children": [
							{
								"name": "객실 예약 날짜2",
								"id": "default13",
								"filename": "default",
								"input": [
									{
										"if": " true"
									}
								],
								"output": {
									"text": "[객실 예약]\n객실 예약 진행 정보\n- 객실 종류 : 싱글룸\n- 체크인 일자 : 2017년 7월13일\n\n체크아웃 하실 날짜를 말씀해주세요.",
									"kind": "Text"
								},
								"children": [
									{
										"name": "예약 확정",
										"id": "default14",
										"filename": "default",
										"input": [
											{
												"if": " true"
											}
										],
										"output": {
											"text": "[객실 예약]\n객실 예약 진행 정보\n- 객실 종류 : 싱글룸\n- 체크인 일자 : 2017년 7월13일\n- 체크아웃 일자 : 2017년 7월 20일\n- 투숙 기간 : 6박7일\n- 가격 : 500,000원\n\n예약을 진행하시겠습니까?",
											"kind": "Text"
										},
										"children": [
											{
												"name": "예약 완료",
												"id": "default15",
												"filename": "default",
												"input": [
													{
														"text": "응"
													}
												],
												"output": {
													"text": "[객실 예약]\n고객님의 객실 예약이 완료 되었습니다.\n\n객실 예약정보\n- 객실 종류 : 싱글룸\n- 체크인 일자 : 2017년 7월13일\n- 체크아웃 일자 : 2017년 7월 20일\n- 투숙 기간 : 6박7일",
													"kind": "Text"
												}
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
		"name": "다이닝",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "2"
			},
			{
				"text": "다이닝"
			}
		],
		"output": {
			"text": "[다이닝]\n머니브레인 호텔에는 다양한 종류의 다이닝 시설이 준비되어 있습니다. 자세히 보고 싶으신 다이닝을 선택해주세요. \n\n1. 한식당\n2. 일식당\n3. 중식당\n4. 양식당",
			"kind": "Text"
		},
		"children": [
			{
				"name": "한식당",
				"id": "default16",
				"filename": "default",
				"input": [
					{
						"text": "한식당"
					},
					{
						"text": "1"
					}
				],
				"output": {
					"text": "[다이닝 - 한식당]\n전통의 맛을 세심하고 세련되게 표한한 한식당입니다. 한식당으로서는 세계 최초로 미쉐린 3스타 레스토랑으로 선정된 전통 한식을 경험해 보시기 바랍니다. \n\n- 위치 : 23층\n- 운영 시간 \n점심 : 12:00 ~ 14:30\n저녁 : 18:00 ~ 22:00\n- 좌석수 : 총 40좌석",
					"image": {
						"url": "/files/Hotel_bot1499950962135.jpg",
						"displayname": "한식.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "일식당",
				"id": "default17",
				"filename": "default",
				"input": [
					{
						"text": "2"
					},
					{
						"text": "일식 당"
					}
				],
				"output": {
					"text": "[다이닝 - 일식당]\n모던함이 느껴지는 현대적 감각의 레스토랑으로 청정해의 해산물과 직접 엄선한 최고급 식재료로 정통 일식의 진수를 선보입니다.\n\n- 위치 : 2층\n- 운영 시간 \n점심 : 12:00 ~ 14:30\n저녁 : 18:00 ~ 22:00\n- 좌석수 : 총 120좌석\n- 룸 20실\n이미지 포함",
					"image": {
						"url": "/files/Hotel_bot1499950974389.jpg",
						"displayname": "일식.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "중식당",
				"id": "default18",
				"filename": "default",
				"input": [
					{
						"text": "3"
					},
					{
						"text": "중식 당"
					}
				],
				"output": {
					"text": "[다이닝 - 중식당]\n깊은 전통과 꾸준한 명성은 중국 본토 최고의 맛을 그대로 전해드립니다. 북경과 광둥 지녁 출신의 조리사가 직접 선보이는 정통 중식 요리는 그 맛과 정성으로 다양한 취향을 가진 고객의 눈과 입은 만족 시켜드립니다. \n\n- 위치 : 23층\n- 운영 시간 \n점심 : 12:00 ~ 14:30\n저녁 : 18:00 ~ 22:00\n- 좌석수 : 총 40좌석\n- 룸 6실",
					"image": {
						"url": "/files/Hotel_bot1499950986006.jpg",
						"displayname": "중식.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "양식당",
				"id": "default19",
				"filename": "default",
				"input": [
					{
						"text": "4"
					},
					{
						"text": "양식 당"
					}
				],
				"output": {
					"text": "[다이닝 - 양식당]\n우아한 실내 장식과 부드러운 조명, 전문적이고 세심한 직원 서비스를 제공합니다. \n\n- 위치 : 5층\n- 운영 시간 \n점심 : 12:00 ~ 14:30\n저녁 : 18:00 ~ 22:00\n- 좌석수 : 총 36좌석\n- 룸 5실",
					"image": {
						"url": "/files/Hotel_bot1499950995305.jpg",
						"displayname": "양식.jpg"
					},
					"kind": "Content"
				}
			}
		]
	},
	{
		"name": "시설",
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"text": "3"
			},
			{
				"text": "시설"
			}
		],
		"output": {
			"text": "[시설]\n머니브레인 호텔에는 고객님의 편의를 위하여 이용하실 수 있는 여러가지 시설을 준비했습니다. 자세히 보고 싶으신 시설을 선택해주세요. \n\n1. 수영장\n2. 예식장\n3. 컨퍼런스홀\n4. 헬스장",
			"kind": "Text"
		},
		"children": [
			{
				"name": "수영장",
				"id": "default20",
				"filename": "default",
				"input": [
					{
						"text": "수영장"
					},
					{
						"text": "1"
					}
				],
				"output": {
					"text": "[시설 - 수영장]\n최초 온수풀, 사계절 자쿠지, 아웃도어바 등 차원이 다른 라이플 스타일을 제공하는 수영장입니다. \n\n- 위치 : 3층\n- 시설 소개 \n자쿠지, 사우나, 바, 온수풀",
					"image": {
						"url": "/files/Hotel_bot1499951023309.jpg",
						"displayname": "수영장.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "예식장",
				"id": "default21",
				"filename": "default",
				"input": [
					{
						"text": "예식장"
					}
				],
				"output": {
					"text": "[시설 - 예식장]\n행복한 순간, 그 느낌을 오래 간직하게 해줄 기품있는 인테리어와 신랑 신부를 위한 세심한 배려로 영원한 미래를 약속하는 최고의 장소 입니다. \n\n- 위치 : 2층\n- 규모 : 49.5 x 22.0m / 높이 6.2m\n- 수용 가능 인원 : 700석",
					"image": {
						"url": "/files/Hotel_bot1499951038739.jpg",
						"displayname": "예식장.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "컨퍼런스룸",
				"id": "default22",
				"filename": "default",
				"input": [
					{
						"text": "컨퍼런스 룸"
					},
					{
						"text": "3"
					}
				],
				"output": {
					"text": "[시설 - 컨퍼런스룸]\n컨퍼런스홀은 행사 규모 및 성격에 따라 변화 가능한 구조로 다양하게 활용 할 수 있씁니다. \n\n- 위치 : 4층\n- 규모 : 16.0 x 22.9m / 높이 6.2m\n- 수용 가능 인원 : 최대 400명",
					"image": {
						"url": "/files/Hotel_bot1499951055872.jpg",
						"displayname": "컨퍼런스룸.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "헬스장",
				"id": "default23",
				"filename": "default",
				"input": [
					{
						"text": "헬스장"
					},
					{
						"text": "4"
					}
				],
				"output": {
					"text": "[시설 - 헬스장]\n체계적인 체력 관리를 위한 기능별 공간과 최상의 휴식을 위한 공간으로 조성되어 운동과 휴식을 조화롭게 즐기실 수 있는 실내 체육관 입니다. \n\n- 위치 : 5층\n- 운영 시간 : 05:30 ~ 22:30\n- 대여품목 : 트레이닝복, 양말",
					"image": {
						"url": "/files/Hotel_bot1499951079672.jpeg",
						"displayname": "헬스장.jpeg"
					},
					"kind": "Content"
				}
			}
		]
	},
	{
		"name": "이벤트",
		"id": "default24",
		"filename": "default",
		"input": [
			{
				"text": "4"
			},
			{
				"text": "이벤트"
			}
		],
		"output": {
			"text": "[이벤트]\n머니브레인 호텔에서 여름을 맞이하여 제공하는 특별 행사입니다. 자세히 보고 싶으신 항목을 선택해주세요. \n\n1. 여름 페스티벌\n2. 이브닝 마리아주\n3. 주말 스페셜",
			"kind": "Text"
		},
		"children": [
			{
				"name": "여름 페스티벌",
				"id": "default25",
				"filename": "default",
				"input": [
					{
						"text": "여름"
					},
					{
						"text": "페스티벌"
					},
					{
						"text": "1"
					}
				],
				"output": {
					"text": "[이벤트 - 여름 페스티벌]\n야외 테라스에서 한여름 더위를 식힐 시원한 음료를 준비했습니다.\n향긋한 아이스티부터 청량한 칵테일까지 다양한 트로피컬 음료와 함께 시원한 여름 밤을 즐겨보시기 바랍니다.\n\n- 장소 : 3층 라운지\n- 시간 : 월요일~ 목요일( 17:00~22:00)\n- 기간 : 2017-07-01 ~ 2017-08-31",
					"kind": "Text"
				}
			},
			{
				"name": "이브닝 마리아주",
				"id": "default26",
				"filename": "default",
				"input": [
					{
						"text": "이브닝"
					},
					{
						"text": "마리 아주"
					},
					{
						"text": "2"
					}
				],
				"output": {
					"text": "[이벤트 - 이브닝 마리아주]\n특별한 저녁을 만들어 줄 실루엣 이브닝 마리아주를 소개합니다.\n셰프가 제안하는 메인 요리와 파티셰의 보석같은 디저트,\n그리고 품격있는 마리아주를 선사하는 와인과 함께 더 라이브러리에서 특별한 저녁을 만끽하세요.\n\n- 장소 : 1층 라운지바\n- 기간 : 2017-07-01 ~ 2017-08-31",
					"kind": "Text"
				}
			},
			{
				"name": "주말 스페셜",
				"id": "default27",
				"filename": "default",
				"input": [
					{
						"text": "3"
					},
					{
						"text": "주말"
					},
					{
						"text": "스페셜"
					}
				],
				"output": {
					"text": "[이벤트 - 주말 스페셜]\n풀사이드에서 즐기는 풍성한 메뉴와 시원한 맥주, 그리고 은은한 달빛 아래 즐기는 문라이트 스위밍까 주말 스페셜 프로모션으로 즐기세요.\n\n- 객실 종류 : 디럭스룸\n- 기간 : 2017-07-01 ~ 2017-08-31\n- 혜택 \n라운지 이용권, 헬스장, 실내 사우나, 수영장, 맥주 무제한",
					"kind": "Text"
				}
			}
		]
	},
	{
		"name": "위치 안내",
		"id": "default28",
		"filename": "default",
		"input": [
			{
				"text": "5"
			},
			{
				"text": "위치"
			},
			{
				"text": "안내"
			}
		],
		"output": {
			"text": "[위치안내]\n머니브레인 호텔은 도심속에 공원입니다. 편안한 휴식을 제공하기 위해서 최선을 다하겠습니다. \n\n- 주소 : 서울특별시 중구 종로 222",
			"image": {
				"url": "/files/Hotel_bot1499951113228.gif",
				"displayname": "오시는길.gif"
			},
			"kind": "Content"
		}
	},
	{
		"name": "빠른예약",
		"id": "default29",
		"filename": "default",
		"input": [
			{
				"text": "내일 예약"
			}
		],
		"output": [
			{
				"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : 미입력\n- 체크인 일자 : 2017년 8월4일\n- 체크아웃 일자 : 미입력\n\n객실 종류를 선택해주세요.\n1. 싱글룸\n2. 디럭스룸\n3. 스위트룸",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "빠른예약2",
				"id": "default30",
				"filename": "default",
				"input": [
					{
						"text": "싱글"
					},
					{
						"text": "1"
					}
				],
				"output": [
					{
						"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : 싱글룸\n- 체크인 일자 : 2017년 8월4일\n- 체크아웃 일자 : 미입력\n\n체크아웃 날짜나, 묵을 밤 수를 입력해주세요.\n(ex. 날짜의 경우 \"2017-01-01\", 2박3일의 경우 숫자 \"3\")",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "빠른예약3",
						"id": "default31",
						"filename": "default",
						"input": [
							{
								"text": "2"
							}
						],
						"output": [
							{
								"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : 싱글룸\n- 체크인 일자 : 2017년 8월4일\n- 체크아웃 일자 : 2017년 8월 7일\n\n예약 내용을 확인하세요. 요금은 총 24만원입니다. 예약을 진행하시겠습니까?",
								"kind": "Text"
							}
						],
						"children": [
							{
								"name": "빠른예약4",
								"id": "default32",
								"filename": "default",
								"input": [
									{
										"text": "응"
									}
								],
								"output": [
									{
										"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : 싱글룸\n- 체크인 일자 : 2017년 8월4일\n- 체크아웃 일자 : 2017년 8월 7일\n\n예약자 성함을 입력해주세요.",
										"kind": "Text"
									}
								],
								"children": [
									{
										"name": "빠른예약5",
										"id": "default33",
										"filename": "default",
										"input": [
											{
												"text": "김지섭"
											}
										],
										"output": [
											{
												"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : 싱글룸\n- 체크인 일자 : 2017년 8월4일\n- 체크아웃 일자 : 2017년 8월 7일\n- 예약자 성함 : 김지섭\n\n예약자의 휴대폰 번호를 입력해주세요.",
												"kind": "Text"
											}
										],
										"children": [
											{
												"name": "빠른예약6",
												"id": "default34",
												"filename": "default",
												"input": [
													{
														"text": "01092597716"
													}
												],
												"output": [
													{
														"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : 싱글룸\n- 체크인 일자 : 2017년 8월4일\n- 체크아웃 일자 : 2017년 8월 7일\n- 예약자 성함 : 김지섭\n- 예약자 연락처 : 010-9259-7716\n\n위의 내용이 맞습니까? 맞으면 '예'를, 수정하고 싶은 항목이 있다면 항목의 이름을 입력해주세요.",
														"kind": "Text"
													}
												],
												"children": [
													{
														"name": "객실 종류",
														"id": "default36",
														"filename": "default",
														"input": [
															{
																"text": "객실 종류"
															}
														],
														"output": [
															{
																"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : 미입력\n- 체크인 일자 : 2017년 8월4일\n- 체크아웃 일자 : 2017년 8월7일\n- 예약자 성함 : 김지섭\n- 예약자 연락처 : 010-9259-7716\n\n객실 종류를 선택해주세요.\n1. 싱글룸\n2. 디럭스룸\n3. 스위트룸",
																"kind": "Text"
															}
														],
														"children": [
															{
																"name": "객실종류2",
																"id": "default37",
																"filename": "default",
																"input": [
																	{
																		"text": "디럭스"
																	},
																	{
																		"text": "2"
																	}
																],
																"output": [
																	{
																		"text": "[객실예약 진행상황]\n객실 예약 진행 정보\n- 객실 종류 : 디럭스룸\n- 체크인 일자 : 2017년 8월4일\n- 체크아웃 일자 : 2017년 8월7일\n- 예약자 성함 : 김지섭\n- 예약자 연락처 : 010-9259-7716\n\n위의 내용이 맞습니까? 맞으면 '예'를, 수정하고 싶은 항목이 있다면 항목의 이름을 입력해주세요.",
																		"kind": "Text"
																	}
																],
																"children": [
																	{
																		"name": "빠른예약완료",
																		"id": "default38",
																		"filename": "default",
																		"input": [
																			{
																				"text": "응"
																			}
																		],
																		"output": [
																			{
																				"text": "*김지섭* 님의 명의로 예약이 신청되었습니다. 아래 계좌로 숙박요금 *24만원*을 입금하시면 예약이 완료됩니다.\n\n국민은행 620-186066-484 머니브레인호텔",
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
									}
								]
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
		"output": {
			"text": "안녕하세요. 머니브레인 호텔입니다.\n호텔 이용 관련 정보를 확인 하실 수 있습니다. 필요하신 메뉴를 선택해주세요. \n\n1. 객실 \n2. 다이닝\n3, 시설\n4. 이벤트\n5. 위치 안내",
			"kind": "Text"
		}
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "처음",
		"input": [
			{
				"text": "처음"
			}
		],
		"output": {
			"kind": "Action",
			"call": "시작"
		}
	},
	{
		"name": "이전",
		"id": "commondefault30",
		"filename": "defaultcommon",
		"input": [
			{
				"text": "이전"
			}
		],
		"output": {
			"kind": "Action",
			"up": "1"
		}
	}
];
var _bot = require(require('path').resolve("./engine/core/bot")).getBot('Hotel_bot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
