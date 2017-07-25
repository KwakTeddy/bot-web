


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "병원이용안내"
			},
			{
				"text": "1"
			}
		],
		"output": {
			"text": "아산병원 안내를 원하시는군요!\n원하시는 정보를 입력해주세요.\n\n예) 지하철로 가는 방법, 주차 안내, 빈소11호 위치",
			"kind": "Content"
		},
		"name": "병원이용안내",
		"children": [
			{
				"name": "셔틀",
				"id": "default22",
				"filename": "default",
				"input": [
					{
						"text": "셔틀"
					}
				],
				"output": {
					"text": "셔틀버스 이용 안내입니다.\n\n당일 외래진료예약자 및 그 보호자, 병원직원, 자원봉사자를 위한 순환버스입니다.\n장례식장 이용, 일반용무 등으로 오신 분은 이용이 불가하니 양해 부탁드립니다.\n\n■ 운행코스: 동관 후문 버스정류장 잠실나루역 1번출구 앞 왕복운행 \n\n■ 운행시간: 평일 8:30 ~ 17:00(약 10분 간격) \n • 중식시간 운행 11:10, 11:30, 11:45, 12:00, 12:15, 12:30, 12:50 \n • 토요일, 일요일, 공휴일은 운행하지 않습니다.\n\n■ 탑승장소: 아래의 약도를 참고하세요. \"",
					"kind": "Text"
				}
			},
			{
				"name": "지하철",
				"id": "default23",
				"filename": "default",
				"input": [
					{
						"text": "지하철"
					}
				],
				"output": {
					"text": "지하철로 오시는 길\n\n■ 잠실나루역:\n1번 출구 → 순환버스 또는 도보(10분)로 이동\n3번 출구 → 4318 버스 승차 → 하차(서울아산병원 동관)\n\n■ 잠실역:\n7번 출구 → 4318 버스 승차 → 하차(서울아산병원 동관)\n\n■ 천호역:\n9번 출구 → 4318 버스 승차 또는 112-5 버스 승차 → 하차(서울아산병원 동관)\n\n■ 강동역:\n1번 출구 → 112-5 버스 승차 → 하차(서울아산병원 동관)\n\n■ 강동구청역:\n5번 출구 → 112-5 버스 승차 → 하차(서울아산병원 동관)\n\n■ 몽촌토성역:\n1번 출구 → 4318 버스 승차 → 하차(서울아산병원 동관)\"",
					"kind": "Text"
				}
			},
			{
				"name": "시내버스",
				"id": "default24",
				"filename": "default",
				"input": [
					{
						"text": "시내버스"
					},
					{
						"text": "시내"
					}
				],
				"output": {
					"text": "시내버스 타고 오시는 길\n\n■ 4318번:\n서울아산병원 동관 하차 (사당역 ↔ 서울아산병원)\n\n■ 112-5번:\n서울아산병원 동관 하차 (한솔아파트 ↔ 서울아산병원)\n\n■ 97번:\n서울아산병원 동관 하차 (남양주 호평동 ↔ 강변역 ↔ 서울아산병원)\"",
					"kind": "Text"
				},
				"inRaw": "시내",
				"inNLP": "시내",
				"task": {
					"text": "시내버스 타고 오시는 길\n\n■ 4318번:\n서울아산병원 동관 하차 (사당역 ↔ 서울아산병원)\n\n■ 112-5번:\n서울아산병원 동관 하차 (한솔아파트 ↔ 서울아산병원)\n\n■ 97번:\n서울아산병원 동관 하차 (남양주 호평동 ↔ 강변역 ↔ 서울아산병원)\"",
					"kind": "Text"
				}
			},
			{
				"name": "고속버스",
				"id": "default26",
				"filename": "default",
				"input": [
					{
						"text": "고속버스"
					},
					{
						"text": "고속"
					}
				],
				"output": {
					"text": "고속버스로 오시는 길\n\n■ 동서울종합터미널:\n97 버스 승차(강변역A) → 하차(서울아산병원 동관)\n\n■ 고속터미널:\n고속터미널역 승차 → 교대역 환승 → 잠실나루역 하차\n→ 순환버스 또는 도보(10분), 4318 버스 이동",
					"kind": "Text"
				},
				"inRaw": "고속",
				"inNLP": "고속",
				"task": {
					"text": "고속버스로 오시는 길\n\n■ 동서울종합터미널:\n97 버스 승차(강변역A) → 하차(서울아산병원 동관)\n\n■ 고속터미널:\n고속터미널역 승차 → 교대역 환승 → 잠실나루역 하차\n→ 순환버스 또는 도보(10분), 4318 버스 이동",
					"kind": "Text"
				}
			},
			{
				"name": "R버스",
				"id": "default28",
				"filename": "default",
				"input": [
					{
						"text": "버스"
					}
				],
				"output": {
					"text": "버스를 타고 오시는군요!\n\n시내버스를 타고 오시는지, 고속버스를 타고 오시는 지 알려주세요^^",
					"buttons": [
						{
							"text": "시내버스"
						},
						{
							"text": "고속버스"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "시내버스2",
						"id": "default29",
						"filename": "default",
						"input": [
							{
								"text": "시내"
							},
							{
								"text": "시내버스"
							}
						],
						"output": {
							"kind": "Action",
							"call": "시내버스",
							"type": "Call"
						}
					},
					{
						"name": "고속버스2",
						"id": "default30",
						"filename": "default",
						"input": [
							{
								"text": "고속"
							},
							{
								"text": "고속버스"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"kind": "Action",
							"call": "고속버스"
						}
					}
				]
			},
			{
				"name": "항공",
				"id": "default25",
				"filename": "default",
				"input": [
					{
						"intent": "공항"
					}
				],
				"output": {
					"text": "공항에서 오시는 길\n\n■ 인천국제공항:\n6705 버스 승차(인천국제공항4A.5B.6A.6B) → 하차(잠실롯데월드) → 잠실역 7번 출구(도보 7분) → 4318 버스 승차 → 하차(서울아산병원 동관) \n\n■ 김포공항:\n6706 버스 승차(김포공항국제선) → 하차(잠실롯데월드) → 잠실역 7번 출구(도보 7분) → 4318 버스 승차 → 하차(서울아산병원 동관)",
					"kind": "Text"
				}
			},
			{
				"name": "기차",
				"id": "default27",
				"filename": "default",
				"input": [
					{
						"text": "기차"
					},
					{
						"text": "열차"
					},
					{
						"text": "서울역"
					},
					{
						"text": "수서역"
					},
					{
						"text": "수서역 SRT"
					}
				],
				"output": {
					"text": "기차타고 오시는 길\n\n■ 서울역:\n서울역 승차 → 동대문역사문화공원역 환승 → 잠실나루역 하차\n→ 순환버스 또는 도보(10분), 4318 버스 이동\n\n■ 수서역SRT:\n2412 버스 승차(수서역 5번 출구) → 하차(잠실역) → 잠실역 7번 출구(도보 2분) → 4318 버스 승차 → 하차(서울아산병원 동관)",
					"kind": "Content"
				}
			},
			{
				"name": "자가용",
				"id": "default31",
				"filename": "default",
				"input": [
					{
						"text": "자가용"
					},
					{
						"text": "자동차"
					},
					{
						"text": "운전"
					},
					{
						"text": "자차"
					}
				],
				"output": {
					"text": "자가용으로 오시는군요!\n\n주소는 다음과 같아요.\n서울특별시 송파구 올림픽로43길 88 (풍납2동 388-1)\n\n주차 안내를 원하시면 \"주차\"라고 입력해주세요:)",
					"kind": "Text"
				},
				"children": [
					{
						"name": "주차2",
						"id": "default33",
						"filename": "default",
						"input": [
							{
								"text": "주차"
							}
						],
						"output": {
							"kind": "Action",
							"call": "주차"
						}
					}
				]
			},
			{
				"name": "주차장 위치",
				"id": "default42",
				"filename": "default",
				"input": [
					{
						"text": "주차장 위치"
					},
					{
						"text": "주차장 어디"
					}
				],
				"output": {
					"text": "주차장은 야외 중앙주차장, 신관 지하 주차장, 후문 주차장, 풍납유수지 공영주차장이 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"kind": "Text"
				},
				"inRaw": "1",
				"inNLP": "1",
				"task": {
					"text": "주차장은 야외 중앙주차장, 신관 지하 주차장, 후문 주차장, 풍납유수지 공영주차장이 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"kind": "Text"
				}
			},
			{
				"name": "주차장 이용 방식",
				"id": "default43",
				"filename": "default",
				"input": [
					{
						"text": "주차장 이용"
					},
					{
						"text": "주차장 방법"
					},
					{
						"text": "사전 무 인정 산소"
					},
					{
						"text": "무 인정 산소"
					}
				],
				"output": {
					"text": "사전무인정산소에서 정산하신 후 출차하여 주십시오.(진료 및 무료주차 차량도 포함) 정산 후 20분 이내에 출차하여 주십시오.(초과시 요금 부과 됨)",
					"kind": "Text"
				},
				"inRaw": "이용방식",
				"inNLP": "이용 방식",
				"task": {
					"text": "사전무인정산소에서 정산하신 후 출차하여 주십시오.(진료 및 무료주차 차량도 포함) 정산 후 20분 이내에 출차하여 주십시오.(초과시 요금 부과 됨)",
					"kind": "Text"
				}
			},
			{
				"name": "주차 이용 가능 시간",
				"id": "default44",
				"filename": "default",
				"input": [
					{
						"text": "주차 이용 시간"
					},
					{
						"text": "주차장 시간"
					},
					{
						"text": "주차장 이용 시간"
					}
				],
				"output": {
					"text": "주차장은 24시간 이용가능합니다.",
					"kind": "Content"
				}
			},
			{
				"name": "주차장 규모",
				"id": "default45",
				"filename": "default",
				"input": [
					{
						"text": "주차 규모"
					},
					{
						"text": "주차 자리"
					},
					{
						"text": "주차장 규모"
					},
					{
						"text": "주차장 규모"
					}
				],
				"output": {
					"text": "총 2,565대 주차 가능합니다. \n- 중앙주차장: 953대\n- 신관 지하주차장(B1~B5): 1,276대\n- 후문 주차장: 102대\n- 풍납유수지 공영주차장: 234대",
					"kind": "Text"
				},
				"inRaw": "규모",
				"inNLP": "규모",
				"task": {
					"text": "총 2,565대 주차 가능합니다. \n- 중앙주차장: 953대\n- 신관 지하주차장(B1~B5): 1,276대\n- 후문 주차장: 102대\n- 풍납유수지 공영주차장: 234대",
					"kind": "Text"
				}
			},
			{
				"name": "주차요금",
				"id": "default46",
				"filename": "default",
				"input": [
					{
						"text": "주차 요금"
					},
					{
						"text": "주차 가격"
					},
					{
						"text": "주차 영수증"
					},
					{
						"text": "환자 주차"
					},
					{
						"text": "진료 주차"
					}
				],
				"output": {
					"text": "■ 주간 (오전 6시~오후 10시)\n - 입차 후 30분 무료\n - 30분 초과 시 10분 당 500원\n - 1일 최대 요금: 입원환자 및 보호자 10,000원 / 일반 내원객 20,000원\n\n■ 야간(오후 10시~오전 6시)\n - 입차 후 30분 무료\n - 일괄 1,000원\n\n■ 외래 진료일 및 입/퇴원일 환자, 수술일 환자(시술제외), 종합건진 수검자\n - 당일 1회 무료\n - 진료카드 또는 영수증 제시 필요\n\n■ 응급실 환자\n - 당일 입차 후 24시간(1회) 무료\n - 진료카드 또는 영수증 제시 필요",
					"kind": "Text"
				}
			},
			{
				"name": "무료 및 할인 주차 정보",
				"id": "default47",
				"filename": "default",
				"input": [
					{
						"text": "무료 주차"
					},
					{
						"text": "할인 주차"
					},
					{
						"text": "장애인 주차"
					},
					{
						"text": "국가 유공 자 주차"
					},
					{
						"text": "진료 주차"
					},
					{
						"text": "환자 주차"
					},
					{
						"text": "종합 검진 주차"
					},
					{
						"text": "수술 주차"
					}
				],
				"output": {
					"text": "■ 외래 진료일 및 입/퇴원일 환자, 수술일 환자(시술제외), 종합건진 수검자\n - 당일 1회 무료\n - 사전무인정산기에 차량번호 입력 후 진료카드 투입 및 병원등록번호 입력\n\n■ 응급실 환자\n - 당일 입차 후 24시간(1회) 무료\n - 사전무인정산기에 차량번호 입력 후 진료카드 투입 및 병원등록번호 입력\n\n■국가 유공자, 장애인\n - 주차 요금 50% 감면 (단, 정산 시 등록카드 제시자에 한함)",
					"kind": "Content"
				}
			},
			{
				"name": "기간권 정보",
				"id": "default48",
				"filename": "default",
				"input": [
					{
						"text": "주차 기간 권"
					}
				],
				"output": [
					{
						"text": "입차 후 수시 입/출차가 필요한 경우 기간권 구입 후 이용 가능합니다.\n\n- 이용 가능 시간: 입차 후 24시간\n- 비용: 10,000원\n- 등록 방법: 자량번호 기간권 등록\n- 등록처: 신관/공영/후문 주차장, 출구정산소중앙주차장, 동관/신관 1층 현관안내",
						"kind": "Text"
					}
				]
			},
			{
				"name": "R주차",
				"id": "default32",
				"filename": "default",
				"input": [
					{
						"text": "주차장"
					},
					{
						"text": "주차"
					}
				],
				"output": {
					"text": "주차안내를 해드릴께요.\n\n원하시는 정보의 번호를 입력해주세요.\n\n1. 주차장 위치\n2. 주차장 이용방식\n3. 주차 이용 가능시간\n4. 주차장 규모\n5. 주차 요금\n6. 무료 및 할인 주차 정보\n7. 기간권 정보",
					"kind": "Text"
				},
				"inRaw": "주차",
				"inNLP": "주차",
				"task": {
					"text": "주차안내를 해드릴께요.\n\n원하시는 정보의 번호를 입력해주세요.\n\n1. 주차장 위치\n2. 주차장 이용방식\n3. 주차 이용 가능시간\n4. 주차장 규모\n5. 주차 요금\n6. 무료 및 할인 주차 정보\n7. 기간권 정보",
					"kind": "Text"
				},
				"children": [
					{
						"name": "주차장 위치2",
						"id": "default49",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "주차장 위치"
							},
							{
								"text": "위치"
							},
							{
								"text": "주차 위치"
							}
						],
						"output": {
							"kind": "Action",
							"call": "주차장 위치",
							"type": "Call"
						}
					},
					{
						"name": "주차장 이용방식2",
						"id": "default50",
						"filename": "default",
						"input": [
							{
								"text": "2"
							},
							{
								"text": "이용 방식"
							},
							{
								"text": "이용 방법"
							},
							{
								"text": "주차장 이용 방법"
							}
						],
						"output": {
							"kind": "Action",
							"call": "주차장 이용 방식"
						}
					},
					{
						"name": "주차 이용 가능 시간2",
						"id": "default51",
						"filename": "default",
						"input": [
							{
								"text": "3"
							},
							{
								"text": "이용 시간"
							},
							{
								"text": "이용 가능 시간"
							},
							{
								"text": "주차 시간"
							},
							{
								"text": "주차 이용 시간"
							}
						],
						"output": {
							"kind": "Action",
							"call": "주차 이용 가능 시간"
						}
					},
					{
						"name": "주차장 규모2",
						"id": "default52",
						"filename": "default",
						"input": [
							{
								"text": "4"
							},
							{
								"text": "규모"
							},
							{
								"text": "주차장 규모"
							}
						],
						"output": {
							"kind": "Action",
							"call": "주차장 규모",
							"type": "Call"
						}
					},
					{
						"name": "주차 요금2",
						"id": "default53",
						"filename": "default",
						"input": [
							{
								"text": "주차 요금"
							},
							{
								"text": "5"
							},
							{
								"text": "요금"
							},
							{
								"text": "얼마"
							},
							{
								"text": "가격"
							}
						],
						"output": {
							"kind": "Action",
							"call": "주차 요금",
							"type": "Call"
						}
					},
					{
						"name": "무료 및 할인 주차 정보2",
						"id": "default54",
						"filename": "default",
						"input": [
							{
								"text": "6"
							},
							{
								"intent": "무료 및 할인주차정보"
							}
						],
						"output": {
							"if": "",
							"kind": "Action",
							"call": "무료 및 할인 주차 정보"
						}
					},
					{
						"name": "기간권 정보2",
						"id": "default55",
						"filename": "default",
						"input": [
							{
								"text": "7"
							},
							{
								"intent": "주차기간권"
							}
						],
						"output": {
							"kind": "Action",
							"call": "기간권 정보"
						}
					}
				]
			},
			{
				"name": "빈소Task-빈소#S",
				"id": "default80",
				"filename": "default",
				"input": [
					{
						"text": "1 번 장례식"
					}
				],
				"output": {
					"text": "장례식장 빈소1호는 별관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1499948281636.jpg",
						"displayname": "별관301.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "빈소Task-빈소#F",
				"id": "default66",
				"filename": "default",
				"input": [
					{
						"text": "빈소 4"
					},
					{
						"text": "장례식 4"
					}
				],
				"output": {
					"text": "찾으시는 빈소 호수는 없습니다. 몇번 빈소인지 다시 한 번 확인한 후 입력해 주세요.",
					"kind": "Content"
				},
				"children": [
					{
						"name": "빈소Task-빈소#F-#S",
						"id": "default83",
						"filename": "default",
						"input": [
							{
								"text": "1"
							}
						],
						"output": {
							"text": "장례식장 빈소1호는 별관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
							"kind": "Text"
						},
						"inRaw": "1",
						"inNLP": "1",
						"task": {
							"text": "장례식장 빈소1호는 별관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
							"kind": "Text"
						}
					},
					{
						"name": "빈소Task-빈소#F-#F",
						"id": "default84",
						"filename": "default",
						"input": [
							{
								"text": "4"
							}
						],
						"output": {
							"kind": "Action",
							"call": "빈소Task-빈소#F",
							"type": "Call"
						}
					}
				]
			},
			{
				"name": "빈소no#",
				"id": "default88",
				"filename": "default",
				"input": [
					{
						"text": "장례식"
					},
					{
						"text": "빈소"
					}
				],
				"output": {
					"text": "아산병원 빈소는 별관 지하1층, 2층, 3층에 있습니다.\n\n찾으시는 빈소 호수 번호를 입력하시면 자세한 위치를 약도와 함께 안내해드릴께요.",
					"kind": "Content"
				},
				"children": [
					{
						"name": "빈소no#-#S",
						"id": "default89",
						"filename": "default",
						"input": [
							{
								"text": "1"
							}
						],
						"output": {
							"kind": "Action",
							"call": "빈소Task-빈소#F-#S",
							"type": "Call"
						}
					},
					{
						"name": "빈소no#-#F",
						"id": "default90",
						"filename": "default",
						"input": [
							{
								"text": "4"
							}
						],
						"output": {
							"kind": "Action",
							"call": "빈소Task-빈소#F-#F",
							"type": "Call"
						}
					}
				]
			},
			{
				"name": "객실501~508호",
				"id": "default81",
				"filename": "default",
				"input": [
					{
						"text": "객실 501"
					},
					{
						"text": "객실 502"
					},
					{
						"text": "객실 503"
					},
					{
						"text": "객실 504"
					},
					{
						"text": "객실 505"
					},
					{
						"text": "객실 506"
					},
					{
						"text": "객실 507"
					},
					{
						"text": "객실 508"
					}
				],
				"output": {
					"text": "찾으시는 객실은(OR객실 501호~508호)는 별관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500017365166.jpg",
						"displayname": "별관404.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "객실509~512호",
				"id": "default82",
				"filename": "default",
				"input": [
					{
						"text": "객실 509"
					},
					{
						"text": "객실 510"
					},
					{
						"text": "객실 511"
					},
					{
						"text": "객실 512"
					}
				],
				"output": {
					"text": "찾으시는 객실은(OR객실 509호~512호)는 별관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500017461363.jpg",
						"displayname": "f-403.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "객실513호",
				"id": "default85",
				"filename": "default",
				"input": [
					{
						"text": "객실 513"
					}
				],
				"output": {
					"text": "객실 513호는 별관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500017515979.jpg",
						"displayname": "f-402.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "객실514호",
				"id": "default86",
				"filename": "default",
				"input": [
					{
						"text": "객실 514"
					}
				],
				"output": {
					"text": "객실514호는 별관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500017582321.jpg",
						"displayname": "f-401.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "객실Task-객실#F",
				"id": "default96",
				"filename": "default",
				"input": [
					{
						"text": "객실 0"
					}
				],
				"output": {
					"text": "찾으시는 객실 번호는 없습니다.  객실 번호를 다시 한 번 확인해 주세요. 객실 번호를 입력하시면 약도와 함께 안내해드릴께요.\n\n모든 객실은 별관 4층에 있습니다.",
					"kind": "Text"
				},
				"children": [
					{
						"name": "객실Task-객실501~508호",
						"id": "default97",
						"filename": "default",
						"input": [
							{
								"text": "501"
							},
							{
								"text": "502"
							},
							{
								"text": "503"
							},
							{
								"text": "504"
							},
							{
								"text": "505"
							},
							{
								"text": "506"
							},
							{
								"text": "507"
							},
							{
								"text": "508"
							}
						],
						"output": {
							"kind": "Action",
							"call": "객실501~508호",
							"type": "Call"
						}
					},
					{
						"name": "객실Task-객실509~512호",
						"id": "default98",
						"filename": "default",
						"input": [
							{
								"text": "509"
							},
							{
								"text": "510"
							},
							{
								"text": "511"
							},
							{
								"text": "512"
							}
						],
						"output": {
							"kind": "Action",
							"call": "객실509~512호"
						}
					},
					{
						"name": "객실Task-객실513호",
						"id": "default99",
						"filename": "default",
						"input": [
							{
								"text": "513"
							}
						],
						"output": {
							"kind": "Action",
							"call": "객실513호"
						}
					},
					{
						"name": "객실Task-객실514호",
						"id": "default100",
						"filename": "default",
						"input": [
							{
								"text": "514"
							}
						],
						"output": {
							"kind": "Action",
							"call": "객실514호"
						}
					}
				]
			},
			{
				"name": "객실no#",
				"id": "default87",
				"filename": "default",
				"input": [
					{
						"text": "객실"
					}
				],
				"output": {
					"text": "지방에서 오신 문상객 및 유족 여러분의 편의를 위해 객실(한, 양실) 14실을 준비하였습니다.\n\n객실은 별관 4층에 있습니다.\n\n찾으시는 객실 호수를 입력하시면 약도와 함께 안내해드릴께요.",
					"kind": "Text"
				},
				"children": [
					{
						"name": "객실no#-501~508호",
						"id": "default91",
						"filename": "default",
						"input": [
							{
								"text": "501"
							},
							{
								"text": "502"
							},
							{
								"text": "503"
							},
							{
								"text": "504"
							},
							{
								"text": "505"
							},
							{
								"text": "506"
							},
							{
								"text": "507"
							},
							{
								"text": "508"
							}
						],
						"output": {
							"text": "찾으시는 객실은(OR객실 501호~508호)는 별관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
							"image": {
								"url": "/files/Asan1500018384095.jpg",
								"displayname": "별관404.jpg"
							},
							"kind": "Content"
						}
					},
					{
						"name": "객실no#-509~512",
						"id": "default92",
						"filename": "default",
						"input": [
							{
								"text": "509"
							},
							{
								"text": "510"
							},
							{
								"text": "511"
							},
							{
								"text": "512"
							}
						],
						"output": {
							"text": "찾으시는 객실은(OR객실 509호~512호)는 별관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
							"image": {
								"url": "/files/Asan1500018471879.jpg",
								"displayname": "f-403.jpg"
							},
							"kind": "Content"
						}
					},
					{
						"name": "객실no#-513호",
						"id": "default93",
						"filename": "default",
						"input": [
							{
								"text": "513"
							}
						],
						"output": {
							"text": "객실 513호는 별관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
							"image": {
								"url": "/files/Asan1500018544982.jpg",
								"displayname": "f-402.jpg"
							},
							"kind": "Content"
						}
					},
					{
						"name": "객실no#-514호",
						"id": "default94",
						"filename": "default",
						"input": [
							{
								"text": "514"
							}
						],
						"output": {
							"text": "객실 513호는 별관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
							"image": {
								"url": "/files/Asan1500018655392.jpg",
								"displayname": "f-401.jpg"
							},
							"kind": "Content"
						}
					},
					{
						"name": "객실no#-#F",
						"id": "default95",
						"filename": "default",
						"input": [
							{
								"text": "1000"
							}
						],
						"output": {
							"kind": "Action",
							"call": "객실Task-객실#F"
						}
					}
				]
			},
			{
				"name": "별관편의점",
				"id": "default101",
				"filename": "default",
				"input": [
					{
						"text": "별관 편의점"
					}
				],
				"output": {
					"text": "별관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500023028385.jpg",
						"displayname": "f-101.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "동관편의점",
				"id": "default102",
				"filename": "default",
				"input": [
					{
						"text": "동관 편의점"
					}
				],
				"output": {
					"text": "동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500023095132.jpg",
						"displayname": "e_b1f20.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "H마트",
				"id": "default103",
				"filename": "default",
				"input": [
					{
						"text": "H 마트"
					}
				],
				"output": {
					"text": "동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500023363326.jpg",
						"displayname": "e_b1f19.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "R편의점&마트",
				"id": "default104",
				"filename": "default",
				"input": [
					{
						"text": "마트"
					},
					{
						"text": "슈퍼"
					},
					{
						"text": "수퍼"
					},
					{
						"text": "생활용품"
					},
					{
						"text": "생필품"
					}
				],
				"output": {
					"text": "■ H마트 안내\n - 위치 : 동관 지하1층\n - 영업 / 운영시간 : 08:00 ~ 21:00\n - 문의처 : 02-3010-7880\n\n■ H24Green 편의점 안내\n - 위치: 동관 지하1층\n - 영업 / 운영시간: 07:00 ~ 22:00(토 09:30 ~ 15:00)\n - 문의처: 02-3010-8747\n\n■ 별관 편의점 안내(정보필요!!)\n\n원하시는 장소의 버튼을 클릭하시거나 번호를 입력해주세요. 약도를 보여드릴께요^^\n\n1. 별관편의점\n2. 동관편의점\n3. H마트",
					"buttons": [
						{
							"text": "별관편의점"
						},
						{
							"text": "동관편의점"
						},
						{
							"text": "H마트"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "별관편의점2",
						"id": "default105",
						"filename": "default",
						"input": [
							{
								"text": "별관 편의점"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"kind": "Action",
							"call": "별관편의점"
						}
					},
					{
						"name": "동관편의점2",
						"id": "default106",
						"filename": "default",
						"input": [
							{
								"text": "동관 편의점"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"kind": "Action",
							"call": "동관편의점"
						}
					},
					{
						"name": "H마트",
						"id": "default107",
						"filename": "default",
						"input": [
							{
								"text": "H 마트"
							},
							{
								"text": "3"
							}
						],
						"output": {
							"kind": "Action",
							"call": "H마트"
						}
					}
				]
			},
			{
				"name": "별관카페",
				"id": "default110",
				"filename": "default",
				"input": [
					{
						"text": "별관 커피"
					},
					{
						"text": "별관 카페"
					}
				],
				"output": {
					"text": "별관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500256275890.jpg",
						"displayname": "별관103.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "동관카페",
				"id": "default111",
				"filename": "default",
				"input": [
					{
						"text": "동관 카페"
					},
					{
						"text": "동관 커피"
					}
				],
				"output": {
					"text": "동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500256344931.jpg",
						"displayname": "동관135.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "신관카페",
				"id": "default112",
				"filename": "default",
				"input": [
					{
						"text": "신관 카페"
					},
					{
						"text": "신관 커피"
					}
				],
				"output": {
					"text": "신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500256393085.jpg",
						"displayname": "신관101.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "밀탑",
				"id": "default113",
				"filename": "default",
				"input": [
					{
						"text": "밀탑"
					}
				],
				"output": {
					"text": "밀탑은 신관 지하 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"kind": "Content"
				}
			},
			{
				"name": "베즐리",
				"id": "default114",
				"filename": "default",
				"input": [],
				"output": {
					"text": "베즐리는 동관 지하 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"kind": "Text"
				}
			},
			{
				"name": "R카페&커피",
				"id": "default115",
				"filename": "default",
				"input": [
					{
						"text": "커피"
					}
				],
				"output": {
					"text": "■ 병원 내 카페 안내\n• 밀탑\n - 위치: 신관 지하1층\n - 영업시간: 평일 07:30 ~ 20:00\n               토요일 10:00 ~ 20:00\n - 메뉴: 빙수, 단팥죽, 커피 등\n - 문의처: 02-3010-8585\n\n• 베이커리 (베즐리)\n - 위치: 동관 지하1층 \n - 영업시간: 07:00 ~ 20:30\n - 메뉴: 베이커리, 음료, 아이스크림  등\n - 문의처: 02-3010-6390\n\n• 동관커피숍\n - 위치: 동관 1층\n - 영업시간: 08:00 ~ 19:00\n - 메뉴: 커피, 쥬스 등\n - 문의처: 02-3010-2983 \n\n• 별관커피숍\n - 위치: 별관 1층\n - 영업시간: 07:30 ~ 22:00 \n - 메뉴: 커피, 쥬스 등\n - 문의처: 02-3010-2982 \n• 신관커피숍\n\n원하시는 장소의 버튼을 클릭하시거나 번호를 입력해주세요. 약도를 보여드릴께요^^\n1. 별관카페\n2. 동관카페\n3. 신관카페\n4. 밀탑\n5. 베즐리",
					"buttons": [
						{
							"text": "별관카페"
						},
						{
							"text": "동관카페"
						},
						{
							"text": "신관카페"
						},
						{
							"text": "밀탑"
						},
						{
							"text": "베즐리"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "별관카페2",
						"id": "default116",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "별관 카페"
							}
						],
						"output": {
							"kind": "Action",
							"call": "별관카페"
						}
					},
					{
						"name": "동관카페2",
						"id": "default117",
						"filename": "default",
						"input": [
							{
								"text": "2"
							},
							{
								"text": "동관 카페"
							}
						],
						"output": {
							"kind": "Action",
							"call": "동관카페",
							"type": "Call"
						}
					},
					{
						"name": "신관카페2",
						"id": "default118",
						"filename": "default",
						"input": [],
						"output": {
							"kind": "Action",
							"call": "신관카페",
							"type": "Call"
						}
					},
					{
						"name": "밀탑2",
						"id": "default119",
						"filename": "default",
						"input": [
							{
								"text": "밀탑"
							},
							{
								"text": "4"
							}
						],
						"output": {
							"kind": "Action",
							"call": "밀탑"
						}
					},
					{
						"name": "베즐리",
						"id": "default120",
						"filename": "default",
						"input": [
							{
								"text": "베즐리"
							},
							{
								"text": "5"
							},
							{
								"text": "베이커리"
							}
						],
						"output": {
							"kind": "Action",
							"call": "베즐리"
						}
					}
				]
			},
			{
				"name": "금강산",
				"id": "default121",
				"filename": "default",
				"input": [
					{
						"text": "금강산"
					},
					{
						"text": "사골"
					},
					{
						"text": "양곰"
					},
					{
						"text": "우거지"
					}
				],
				"output": {
					"text": "• 금강산\n - 위치: 동관 지하1층\n - 영업시간: 07:30 ~ 20:30\n - 메뉴: 사골우거지탕, 양곰탕 등\n - 문의처: 02-3010-6191\n\n동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500257661032.jpg",
						"displayname": "e_b1f02.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "한강",
				"id": "default122",
				"filename": "default",
				"input": [
					{
						"text": "한강"
					},
					{
						"text": "설렁탕"
					},
					{
						"text": "육개장"
					},
					{
						"text": "수육"
					}
				],
				"output": {
					"text": "• 한강\n - 위치: 동관 지하1층 \n - 영업시간: 07:30 ~ 15:30\n - 메뉴: 설렁탕, 육개장, 수육 등\n - 문의처: 02-3010-6398 \n\n동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500257867762.jpg",
						"displayname": "e_b1f16.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "직원식당, 보호자식당",
				"id": "default134",
				"filename": "default",
				"input": [
					{
						"text": "직원 식당"
					},
					{
						"text": "보호자 식당"
					}
				],
				"output": {
					"text": "동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500270027568.jpg",
						"displayname": "e_b1f14.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "스카이라운지",
				"id": "default146",
				"filename": "default",
				"input": [
					{
						"text": "스카이 라운지"
					},
					{
						"text": "skylounge"
					},
					{
						"text": "스테이크"
					},
					{
						"text": "스파게티"
					}
				],
				"output": {
					"kind": "List"
				}
			},
			{
				"name": "R동관 한식",
				"id": "default123",
				"filename": "default",
				"input": [
					{
						"text": "동관 한식"
					}
				],
				"output": {
					"text": "동관에 위치한 한식점은 금강산과 한강이 있습니다.\n\n• 금강산\n - 위치: 동관 지하1층\n - 영업시간: 07:30 ~ 20:30\n - 메뉴: 사골우거지탕, 양곰탕 등\n - 문의처: 02-3010-6191\n\n• 한강\n - 위치: 동관 지하1층 \n - 영업시간: 07:30 ~ 15:30\n - 메뉴: 설렁탕, 육개장, 수육 등\n - 문의처: 02-3010-6398\n\n•직원식당\n\n• 스카이라운지\n - 위치: 동관 18층\n - 영업시간: 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 스테이크, 스파게티, 한식류 \n - 문의처: 02-3010-7860\n\n원하시는 장소의 버튼을 클릭하시거나 번호를 입력해주세요. 약도를 보여드릴께요^^\n1. 금강산\n2. 한강\n3. 직원식당, 보호자식당\n4. 스카이라운지",
					"buttons": [
						{
							"text": "금강산"
						},
						{
							"text": "한강"
						},
						{
							"text": "직원식당, 보호자식당"
						},
						{
							"text": "스카이라운지"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "금강산2",
						"id": "default126",
						"filename": "default",
						"input": [
							{
								"text": "금강산"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"kind": "Action",
							"call": "금강산"
						}
					},
					{
						"name": "한강2",
						"id": "default127",
						"filename": "default",
						"input": [
							{
								"text": "한강"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"kind": "Action",
							"call": "한강"
						}
					},
					{
						"name": "직원식당,보호자식당2",
						"id": "default153",
						"filename": "default",
						"input": [
							{
								"text": "직원 식당"
							},
							{
								"text": "보호자 식당"
							},
							{
								"text": "직원 식당 보호자 식당"
							},
							{
								"text": "3"
							}
						],
						"output": {
							"kind": "Action",
							"call": "직원식당, 보호자식당"
						}
					},
					{
						"name": "스카이라운지2",
						"id": "default154",
						"filename": "default",
						"input": [
							{
								"text": "스카이 라운지"
							},
							{
								"text": "4"
							}
						],
						"output": {
							"kind": "Action",
							"call": "스카이라운지"
						}
					}
				]
			},
			{
				"name": "가람",
				"id": "default125",
				"filename": "default",
				"input": [
					{
						"text": "가람"
					}
				],
				"output": {
					"text": "별관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500258525946.jpg",
						"displayname": "별관102.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "국수나무",
				"id": "default124",
				"filename": "default",
				"input": [
					{
						"text": "국수나무"
					}
				],
				"output": {
					"text": "• 국수나무\n - 위치: 별관 2층\n - 영업시간:\n평일 08:00 ~ 20:30\n토요일 11:30 ~ 15:00\n(일, 공휴일 휴업) \n - 메뉴: 잔치국수, 돈가스, 낙지덮밥 등\n\n별관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"kind": "Text"
				}
			},
			{
				"name": "R별관 식당",
				"id": "default129",
				"filename": "default",
				"input": [
					{
						"text": "별관 음식점"
					},
					{
						"text": "별관 한식"
					},
					{
						"text": "별관 식당"
					},
					{
						"text": "별관 음식"
					},
					{
						"text": "별관 식사"
					}
				],
				"output": {
					"text": "별관에 위치한 식당으로는 가람과 국수나무가 있습니다.\n\n•가람\n\n• 국수나무\n - 위치: 별관 2층\n - 영업시간: \n평일 08:00 ~ 20:3.\n토요일 11:30 ~ 15:00\n(일, 공휴일 휴업) \n - 메뉴: 잔치국수, 돈가스, 낙지덮밥 등\n - 문의처: 02-3010-2999\n\n원하시는 장소의 버튼을 클릭하시거나 번호를 입력해주세요. 약도를 보여드릴께요^^\n1. 가람\n2. 국수나무",
					"buttons": [
						{
							"text": "가람"
						},
						{
							"text": "국수나무"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "가람2",
						"id": "default130",
						"filename": "default",
						"input": [
							{
								"text": "가람"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"text": "별관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
							"image": {
								"url": "/files/Asan1500260212181.jpg",
								"displayname": "별관102.jpg"
							},
							"kind": "Content"
						}
					},
					{
						"name": "국수나무2",
						"id": "default131",
						"filename": "default",
						"input": [
							{
								"text": "국수나무"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"text": "• 국수나무\n - 위치: 별관 2층\n - 영업시간: 평일 08:00 ~ 20:30\n               토요일 11:30 ~ 15:00 (일, 공휴일 휴업) \n - 메뉴: 잔치국수, 돈가스, 낙지덮밥 등\n - 문의처: 02-3010-2999\n\n별관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
							"kind": "Text"
						}
					}
				]
			},
			{
				"name": "푸드코트",
				"id": "default128",
				"filename": "default",
				"input": [
					{
						"text": "푸드코트"
					},
					{
						"text": "신관 한식"
					},
					{
						"text": "돈까스"
					},
					{
						"text": "해물 덮다 밥"
					},
					{
						"text": "비빔밥"
					},
					{
						"text": "찌개"
					},
					{
						"text": "경양 식"
					}
				],
				"output": {
					"text": "• 푸드코트\n - 위치: 신관 지하1층\n - 영업시간: \n한식 07:30 ~ 20:30\n양식 11:00 ~ 20:30 \n(주말, 공휴일 휴업)\n - 메뉴: 돈까스, 해물덮밥, 비빔밥, 찌개, 죽 등\n\n신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500274789983.jpg",
						"displayname": "신관B1F12.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "나미",
				"id": "default133",
				"filename": "default",
				"input": [
					{
						"text": "나미"
					},
					{
						"text": "동관 일식"
					},
					{
						"text": "일식"
					},
					{
						"text": "생 대구 탕"
					},
					{
						"text": "초밥"
					},
					{
						"text": "알탕"
					}
				],
				"output": {
					"text": "병원 내 일식당 안내\n\n• 나미\n - 위치: 동관 지하1층 \n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 생대구탕, 생선초밥, 알탕\n - 문의처: 02-3010-6181\n\n동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500269918769.jpg",
						"displayname": "e_b1f03.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "남경",
				"id": "default135",
				"filename": "default",
				"input": [
					{
						"text": "중식"
					},
					{
						"text": "중국음식"
					},
					{
						"text": "중국집"
					},
					{
						"text": "남경"
					},
					{
						"text": "짜장"
					},
					{
						"text": "짬뽕"
					},
					{
						"text": "탕수육"
					}
				],
				"output": {
					"text": "■ 병원 내 중식당 안내\n\n• 남경\n - 위치: 신관 지하1층\n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 짜장, 짬뽕, 탕수육, 요리류\n - 문의처: 02-3010-6381\n\n신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500270138353.jpg",
						"displayname": "신관B1F05.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "R동관 식당",
				"id": "default136",
				"filename": "default",
				"input": [
					{
						"text": "동관 밥"
					},
					{
						"text": "동관 음식"
					},
					{
						"text": "동관 식당"
					}
				],
				"output": {
					"text": "동관에는 4개의 식당이 있습니다.\n\n• 금강산\n - 위치: 동관 지하1층\n - 영업시간: 07:30 ~ 20:30\n - 메뉴: 사골우거지탕, 양곰탕 등\n - 문의처: 02-3010-6191\n\n\n• 한강\n - 위치: 동관 지하1층 \n - 영업시간: 07:30 ~ 15:30\n - 메뉴: 설렁탕, 육개장, 수육 등\n - 문의처: 02-3010-6398 \n\n• 나미\n - 위치: 동관 지하1층 \n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 생대구탕, 생선초밥, 알탕\n - 문의처: 02-3010-6181\n\n• 직원식당, 보호자식당\n\n\n• 스카이라운지\n - 위치: 동관 18층\n - 영업시간: 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 스테이크, 스파게티, 한식류 \n - 문의처: 02-3010-7860\n\n원하시는 장소의 버튼을 선택하시거나 번호를 입력하시면 약도로 안내해드릴께요:)\n1. 금강산\n2. 한강\n3. 나미\n4. 직원식당, 보호자 식당\n5. 스카이라운지",
					"buttons": [
						{
							"text": "금강산"
						},
						{
							"text": "한강"
						},
						{
							"text": "나미"
						},
						{
							"text": "직원식당, 보호자식당"
						},
						{
							"text": "스카이라운지"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "금강산3",
						"id": "default137",
						"filename": "default",
						"input": [
							{
								"text": "금강산"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"kind": "Content"
						}
					},
					{
						"name": "한강3",
						"id": "default138",
						"filename": "default",
						"input": [
							{
								"text": "한강"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"kind": "Action",
							"call": "한강"
						}
					},
					{
						"name": "나미2",
						"id": "default139",
						"filename": "default",
						"input": [
							{
								"text": "나미"
							},
							{
								"text": "3"
							}
						],
						"output": {
							"kind": "Action",
							"call": "나미"
						}
					},
					{
						"name": "직원식당, 보호자식당3",
						"id": "default140",
						"filename": "default",
						"input": [
							{
								"text": "직원 식당 보호자 식당"
							},
							{
								"text": "4"
							}
						],
						"output": {
							"kind": "Action",
							"call": "직원식당"
						}
					},
					{
						"name": "스카이라운지3",
						"id": "default155",
						"filename": "default",
						"input": [
							{
								"text": "스카이 라운지"
							},
							{
								"text": "5"
							}
						],
						"output": {
							"kind": "Action",
							"call": "스카이라운지"
						}
					}
				]
			},
			{
				"name": "R신관 식당",
				"id": "default141",
				"filename": "default",
				"input": [
					{
						"text": "신관 식당"
					},
					{
						"text": "신관 음식"
					},
					{
						"text": "신관 식사"
					},
					{
						"text": "신관 밥"
					}
				],
				"output": {
					"text": "신관에는 2개의 식당이 있습니다.\n\n• 남경\n - 위치: 신관 지하1층\n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 짜장, 짬뽕, 탕수육, 요리류\n - 문의처: 02-3010-6381\n\n\n• 푸드코트\n - 위치: 신관 지하1층\n - 영업시간: \n한식 07:30 ~ 20:30 \n양식 11:00 ~ 20:30\n (주말, 공휴일 휴업)\n - 메뉴: 돈까스, 해물덮밥, 비빔밥, 찌개, 죽 등\n - 문의처: 02-3010-6394\n\n원하시는 장소의 버튼을 누르시거나 번호를 입력해주세요. 약도를 보여드릴께요:)\n1. 남경\n2. 푸드코트",
					"buttons": [
						{
							"text": "남경"
						},
						{
							"text": "푸드코트"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "남경2",
						"id": "default143",
						"filename": "default",
						"input": [
							{
								"text": "남경"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"kind": "Action",
							"call": "남경",
							"type": "Call"
						}
					},
					{
						"name": "푸트코트2",
						"id": "default144",
						"filename": "default",
						"input": [
							{
								"text": "푸트 코트"
							},
							{
								"text": "2"
							},
							{
								"text": "푸드"
							}
						],
						"output": {
							"kind": "Action",
							"call": "푸드코트",
							"type": "Call"
						}
					}
				]
			},
			{
				"name": "R한식",
				"id": "default142",
				"filename": "default",
				"input": [
					{
						"text": "한식"
					},
					{
						"text": "한 국밥"
					}
				],
				"output": {
					"text": "■ 병원 내 한식당 안내\n\n• 금강산\n - 위치: 동관 지하1층\n - 영업시간: 07:30 ~ 20:30\n - 메뉴: 사골우거지탕, 양곰탕 등\n - 문의처: 02-3010-6191\n\n• 한강\n - 위치: 동관 지하1층 \n - 영업시간: 07:30 ~ 15:30\n - 메뉴: 설렁탕, 육개장, 수육 등\n - 문의처: 02-3010-6398 \n\n• 국수나무\n - 위치: 별관 2층\n - 영업시간: 평일 08:00 ~ 20:30\n               토요일 11:30 ~ 15:00 (일, 공휴일 휴업) \n - 메뉴: 잔치국수, 돈가스, 낙지덮밥 등\n - 문의처: 02-3010-2999\n\n• 푸드코트\n - 위치: 신관 지하1층\n - 영업시간: 한식 07:30 ~ 20:30\n               양식 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 돈까스, 해물덮밥, 비빔밥, 찌개, 죽 등\n - 문의처: 02-3010-6394\n\n+가람\n\n+직원식당, 보호자식당\n\n원하시는 장소의 버튼을 누르시거나 번호를 입력해주세요. 약도로 안내해드리겠습니다.\n1. 금강산\n2. 한강\n3. 국수나무\n4. 푸드코트\n5. 가람\n6. 직원식당, 보호자식당",
					"buttons": [
						{
							"text": "금강산"
						},
						{
							"text": "한강"
						},
						{
							"text": "국수나무"
						},
						{
							"text": "푸드코트"
						},
						{
							"text": "가람"
						},
						{
							"text": "직원식당, 보호자식당"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "금강산4",
						"id": "default147",
						"filename": "default",
						"input": [
							{
								"text": "금강산"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"kind": "Action",
							"call": "금강산"
						}
					},
					{
						"name": "한강4",
						"id": "default148",
						"filename": "default",
						"input": [
							{
								"text": "한강"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"kind": "Action",
							"call": "한강"
						}
					},
					{
						"name": "푸드코트3",
						"id": "default149",
						"filename": "default",
						"input": [
							{
								"text": "푸드코트"
							},
							{
								"text": "3"
							}
						],
						"output": {
							"kind": "Action",
							"call": "푸드코트",
							"type": "Call"
						}
					},
					{
						"name": "가람3",
						"id": "default150",
						"filename": "default",
						"input": [
							{
								"text": "가람"
							},
							{
								"text": "4"
							}
						],
						"output": {
							"kind": "Action",
							"call": "가람"
						}
					},
					{
						"name": "국수나무3",
						"id": "default151",
						"filename": "default",
						"input": [
							{
								"text": "국수나무"
							},
							{
								"text": "5"
							}
						],
						"output": {
							"kind": "Action",
							"call": "국수나무"
						}
					},
					{
						"name": "직원식당,보호자식당3",
						"id": "default152",
						"filename": "default",
						"input": [
							{
								"text": "직원 식당 보호자 식당"
							},
							{
								"text": "6"
							}
						],
						"output": {
							"kind": "Action",
							"call": "직원식당, 보호자식당"
						}
					}
				]
			},
			{
				"name": "R양식",
				"id": "default145",
				"filename": "default",
				"input": [
					{
						"text": "양식"
					}
				],
				"output": {
					"text": "두 개의 양식당이 있습니다.\n\n• 푸드코트\n - 위치: 신관 지하1층\n - 영업시간: 한식 07:30 ~ 20:30\n               양식 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 돈까스, 해물덮밥, 비빔밥, 찌개, 죽 등\n - 문의처: 02-3010-6394\n\n• 스카이라운지\n - 위치: 동관 18층\n - 영업시간: 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 스테이크, 스파게티, 한식류 \n - 문의처: 02-3010-7860\n\n원하시는 장소의 버튼을 선택하시거나 번호를 입력해주세요. 약도로 안내해드리겠습니다.",
					"buttons": [
						{
							"text": "푸드코트"
						},
						{
							"text": "스카이라운지"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "푸드코트4",
						"id": "default156",
						"filename": "default",
						"input": [
							{
								"text": "푸드코트"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"kind": "Action",
							"call": "푸드코트"
						}
					},
					{
						"name": "스카이라운지4",
						"id": "default157",
						"filename": "default",
						"input": [
							{
								"text": "스카이 라운지"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"kind": "Action",
							"call": "스카이라운지"
						}
					}
				]
			},
			{
				"name": "동관kb하나은행",
				"id": "default158",
				"filename": "default",
				"input": [
					{
						"text": "동관 은행"
					}
				],
				"output": {
					"text": "동관 지하1층에 KEB하나은행이 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500278639383.jpg",
						"displayname": "e_b1f11.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "신관kb하나은행",
				"id": "default159",
				"filename": "default",
				"input": [
					{
						"text": "신관 은행"
					}
				],
				"output": {
					"text": "신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
					"image": {
						"url": "/files/Asan1500278671896.jpg",
						"displayname": "신관B1F04.jpg"
					},
					"kind": "Content"
				}
			},
			{
				"name": "R은행",
				"id": "default162",
				"filename": "default",
				"input": [],
				"output": {
					"text": "아산병원에는 KB하나은행이 있습니다. \n - 위치: 동관/신관 지하 1층\n - 영업 / 운영 시간: 09:00 ~ 16:00(토요일, 공휴일 휴무)\n - 문의처: 02-3010-8647\n\n원하시는 은행의 버튼을 누르시거나 번호를 입력해주세요. 약도로 안내해드리겠습니다.\n1.동관KB하나은행\n2.신관KB하나은행",
					"buttons": [
						{
							"text": "동관KB하나은행"
						},
						{
							"text": "신관KB하나은행"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "동관KB하나은행2",
						"id": "default163",
						"filename": "default",
						"input": [
							{
								"text": "동관 KB 하나은행"
							},
							{
								"text": "1"
							}
						],
						"output": {
							"kind": "Action",
							"call": "동관kb하나은행",
							"type": "Call"
						}
					},
					{
						"name": "신관KB하나은행2",
						"id": "default164",
						"filename": "default",
						"input": [
							{
								"text": "신관 KB 하나은행"
							},
							{
								"text": "2"
							}
						],
						"output": {
							"kind": "Action",
							"call": "신관kb하나은행",
							"type": "Call"
						}
					}
				]
			}
		]
	},
	{
		"name": "전화번호안내",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"intent": "전화번호안내"
			},
			{
				"text": "2"
			}
		],
		"output": {
			"text": "전화번호를 안내해드릴께요.\n\n다음 중 원하시는 상담 서비스는 무엇인가요\n\n1. 진료예약상담\n2. 건강검진예약상담\n3. 입원관련안내",
			"buttons": [
				{
					"text": "진료예약상담"
				},
				{
					"text": "건강검진예약상담"
				},
				{
					"text": "입원관련안내"
				}
			],
			"kind": "Content"
		},
		"children": [
			{
				"name": "진료예약상담",
				"id": "default7",
				"filename": "default",
				"input": [
					{
						"intent": "진료예약상담"
					},
					{
						"text": "1"
					},
					{
						"text": "진료"
					}
				],
				"output": {
					"text": "진료예약 일자확인과 예약, 변경 및 취소를 위한 상담방법을 알려드릴께요.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에 따라 1번->1번을 순차적으로 누르시면 됩니다.",
					"kind": "Text"
				}
			},
			{
				"name": "건강검진예약상담",
				"id": "default8",
				"filename": "default",
				"input": [
					{
						"intent": "건강검진예약상담"
					},
					{
						"text": "2"
					}
				],
				"output": {
					"text": "건강검진예약과 관련한 상담사 연결을 원하시는군요.\n\n다음 중 궁금하신 사항을 선택해주세요.\n\n1. 건강검진예약 및 결과문의\n2. 예약일 확인\n3. 결과 상담일 확인",
					"buttons": [
						{
							"text": "건강검진예약 및 결과문의"
						},
						{
							"text": "예약일 확인"
						},
						{
							"text": "결과 상담일 확인"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "건강검진 예약 및 결과문의",
						"id": "default10",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "건강검진 예약 및 결과 문의"
							},
							{
								"text": "건강검진"
							},
							{
								"text": "결과 문의"
							},
							{
								"text": "건강검진 예약"
							}
						],
						"output": {
							"kind": "List"
						}
					},
					{
						"name": "예약일 확인",
						"id": "default11",
						"filename": "default",
						"input": [
							{
								"text": "2"
							},
							{
								"text": "예약 일 확인"
							},
							{
								"text": "예약 일"
							}
						],
						"output": {
							"text": "예약일 확인을 위한 상담방법을 알려드릴께요.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에 따라 2번->2번을 순차적으로 누르시면 됩니다.",
							"kind": "Text"
						}
					},
					{
						"name": "결과 상담일 확인",
						"id": "default12",
						"filename": "default",
						"input": [
							{
								"text": "3"
							},
							{
								"text": "결과 상담 일 확인"
							},
							{
								"text": "결과 상담"
							},
							{
								"text": "결과 확인"
							}
						],
						"output": {
							"text": "결과 상담일 확인을 위한상담방법을 알려드릴께요.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에 따라 2번->3번을 순차적으로 누르시면 됩니다.",
							"kind": "Content"
						}
					}
				]
			},
			{
				"name": "입원관련안내",
				"id": "default9",
				"filename": "default",
				"input": [
					{
						"intent": "입원관련안내"
					},
					{
						"text": "3"
					}
				],
				"output": {
					"text": "입원관련 안내를 원하시는군요.\n\n다음중 궁금하신 점이 무엇인가요\n1. 병실배정안내\n2. 입원진료비안내",
					"buttons": [
						{
							"text": "병실배정안내"
						},
						{
							"text": "입원진료비안내"
						}
					],
					"kind": "Content"
				}
			}
		]
	},
	{
		"name": "진료안내",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"intent": "진료안내"
			},
			{
				"text": "3"
			}
		],
		"output": {
			"text": "진료안내를 해드릴께요.\n\n원하시는 진료가 외래인가요 응급인가요\n\n1. 외래진료\n2. 응급진료",
			"buttons": [
				{
					"text": "외래진료"
				},
				{
					"text": "응급진료"
				}
			],
			"kind": "Content"
		},
		"children": [
			{
				"name": "외래진료",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"intent": "외래진료"
					},
					{
						"text": "1"
					}
				],
				"output": {
					"text": "외래진료와 관련해서 궁금하신 점을 입력해주세요\n\n예) 예약 업무 시간, 첫방문자 진료절차, 건강보험혜택",
					"kind": "Text"
				}
			},
			{
				"name": "응급진료",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"intent": "응급진료"
					},
					{
						"text": "2"
					}
				],
				"output": {
					"text": "응급진료와 관련해서 궁금하신 점을 입력해주세요\n\n예) 진료절차, 보험이 적용되는 증상",
					"kind": "Text"
				}
			}
		]
	},
	{
		"name": "입원안내",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"intent": "입원안내"
			},
			{
				"text": "4"
			}
		],
		"output": {
			"text": "입원과 관련한 궁금하신 점이 무엇이든 알려드릴께요. 무엇을 도와드릴까요\n\n예)입원예약변경, 입원비 무통장 입금, 시트 및 담요교환, 간병인 신청, 불만사항접수하기, 입원기록 발급, 서류발급 준비물",
			"kind": "Text"
		}
	},
	{
		"name": "아산재단과 아산병원 소개",
		"id": "default6",
		"filename": "default",
		"input": [
			{
				"intent": "아산재단과 아산병원 소개"
			},
			{
				"text": "5"
			}
		],
		"output": {
			"text": "아산재단과 아산병원에 관해 궁금하시군요!\n\n다음 중 알고싶으신 것이 무엇인가요\n\n1. 아산사회복지재단 설립자\n2. 아산사회복지재단 설립 취지\n3. 아산병원 연보\n4. 아산병원 형황",
			"buttons": [
				{
					"text": "아산사회복지재단 설립자"
				},
				{
					"text": "아산사회복지재단 설립 취지"
				},
				{
					"text": "아산병원 연보"
				},
				{
					"text": "아산병원 형황"
				}
			],
			"kind": "Content"
		},
		"children": [
			{
				"name": "아산재단 설립자",
				"id": "default13",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"text": "아산사회복지재단의 설립자인 정주영 초대 이사장은 강원도 통천군 송전면 아산리에서 태어나 한국이 현대화와 통일로 나아가는 고비마다 큰 족적을 남긴 우리나라 현대사의 큰 별이었습니다.\n\n아산은 창조적 기업가 정신과 강인한 추진력으로 한국전의 폐허를 딛고 현대자동차, 현대중공업 등을 창설하여 세계 시장에 진출하였고, 현대건설을 설립하여 중동 주베일 산업항공사, 서산 방조제 건설 등 국내외 많은 역사적 사업을 주도하였습니다. 이처럼 그는 한국의 산업화, 국제화를 이루며 한국 경제발전을 선도해 왔습니다.\n\n아산은 ′88 서울 올림픽을 유치한 주역으로 한국을 세계에 알리고 국민들에게 긍지를 심어 주었습니다. 1998년에는 소떼를 몰고 판문점을 거쳐 방북하여 평화통일로 가는 남북교류의 물꼬를 텄습니다.\n\n아산은 기업이윤의 사회환원이라는 신념을 가지고 1977년 아산사회복지재단을 설립하였습니다. 재단은 ‘우리 사회의 가장 어려운 이웃을 돕는다’는 설립자의 뜻에 따라 의료사업, 사회복지 지원사업, 학술연구 지원사업, 장학사업을 수행해 오고 있습니다. 의료시설이 부족한 농어촌 지역에 먼저 병원을 세우고 1989년에는 서울아산병원을 개원하여 세계적 수준의 종합의료기관으로 발전시켰습니다.\n\n“시련은 있어도 실패는 없다”는 아산의 긍정적 사고방식과 도전정신은 영원히 기억되고 빛날 것입니다.",
					"kind": "Text"
				}
			},
			{
				"name": "아산재단 설립취지",
				"id": "default14",
				"filename": "default",
				"input": [
					{
						"text": "2"
					}
				],
				"output": {
					"text": "아산재단은 지난 1977년 7월 1일 현대그룹 정주영 명예회장이 현대그룹의 모회사인 현대건설(주) 창립 30주년 기념사업의 일환으로 사재를 출연하여 설립한 공익재단으로, '우리 사회의 가장 어려운 이웃을 돕는다' 는 설립취지에 따라 의료사업을 비롯한 다양한 복지사업을 전개하고 있습니다.\n\n아산재단은 설립초부터 현대적 의료시설이 열악했던 정읍, 보성, 보령, 영덕, 홍천, 강릉 등 농어촌지역을 비롯해 전국에 8개의 대규모 종합병원을 건립,양질의 의료혜택을 제공하고 있습니다.\n\n또한 경제적인 어려움으로 적정한 진료를 받지 못하고 있는 국민들을 대상으로 무료진료 사업을 펼쳐오고 있으며 아울러 노인 복지시설, 아동복지시설,장애인복지시설 등 각종 사회복지단체를 지원하는 사회복지 지원사업, 학문연구를 장려하기 위한 학술연구 지원사업, 우수한 인재 양성과 불우 청소년들을 돕는 장학사업 등 국민 모두의 삶의 질을 향상 시키는 다양한 사업들을 전개하고 있습니다.",
					"kind": "Text"
				}
			},
			{
				"name": "아산병원 연보",
				"id": "default15",
				"filename": "default",
				"input": [
					{
						"text": "3"
					}
				],
				"output": {
					"kind": "Text"
				}
			},
			{
				"name": "아산병원 현황",
				"id": "default16",
				"filename": "default",
				"input": [
					{
						"text": "4"
					}
				],
				"output": {
					"text": "서울아산병원은 2,704병상을 운영하고 있으며, 단일 병원으로서는 국내 최대규모입니다.\n\n서울아산병원 외래 환자수는 일평균 11,610명입니다. \n\n서울아산병원 재원 환자수는 2016년 누적 기준 931,788명입니다.\n\n서울아산병원 응급 환자수는 2016년 누적 기준 111,273명입니다.\n\n서울아산병원 수술 건수는 2016년 기준 63,118건입니다. \n\n[마무리멘트]예) 아산병원은 환자를 위해 오늘도 최선을 다합니다. 여러분의 건강을 위해 일하는 아산병원을 찾아주셔서 감사합니다^^",
					"kind": "Text"
				}
			}
		]
	},
	{
		"name": "환자의 권리와 의무",
		"id": "default19",
		"filename": "default",
		"input": [
			{
				"intent": "환자의 권리와 의무"
			},
			{
				"text": "6"
			}
		],
		"output": {
			"text": "환자의 권리와 의무를 알고싶은 당신은 지성인!\n\n1. 환자의 권리는 무엇인가요\n2. 환자의 의무는 무엇인가요",
			"buttons": [
				{
					"text": "환자의 권리"
				},
				{
					"text": "환자의 의무"
				}
			],
			"kind": "Content"
		},
		"children": [
			{
				"name": "환자의 권리",
				"id": "default20",
				"filename": "default",
				"input": [
					{
						"text": "환자 권리"
					},
					{
						"text": "1"
					},
					{
						"text": "환자 권리"
					}
				],
				"output": {
					"text": "환자의 권리는 다음과 같아요!\n\n■ 진료받을 권리\n환자는 자신의 건강보호와 증진을 위하여 적절한 보건의료서비스를 받을 권리를 갖고, 성별.나이.종교.신분 및 경제적 사정 등을 이유로 건강에 관한 권리를 침해받지 아니하며, 의료인은 정당한 사유없이 진료를 거부하지 못한다.\n\n■ 알권리 및 자기결정권\n환자는 담당의사.간호사 등으로부터 질병 상태, 치료 방법, 의학적 연구 대상 여부, 장기이식 여부, 부작용 등 예상 결과 및 진료 비용에 관하여 충분한 설명을 듣고 자세히 물어볼 수 있으며, 이에 관한 동의 여부를 결정할 권리를 갖는다. 환자는 예정된 진료를 받지 않거나 진료가 시작된 이후 중지를 요청할 수 있으며, 이 경우 앞으로 발생 가능한 결과와 대안적 치료에 대해서 설명을 들을 권리가 있다. 단, 치료를 거절하여 발생하는 결과에 대한 책임은 환자에게 있다.\n\n■ 비밀을 보호받을 권리\n환자는 진료와 관련된 신체상. 건강상의 비밀과 사생활의 비밀을 침해 받지 아니하며, 의료인과 의료기관은 환자의 동의를 받거나 범죄 수사 등 법률에서 정한 경우 외에는 비밀을 누설. 발표하지 못한다.\n\n■ 상담.조정을 신청할 권리\n환자는 의료서비스 관련 분쟁이 발생한 경우, 한국의료분쟁조정중재원 등에 상담 및 조정 신청을 할 수 있다.\"",
					"kind": "Text"
				}
			},
			{
				"name": "환자의 의무",
				"id": "default21",
				"filename": "default",
				"input": [
					{
						"text": "환자 의무"
					},
					{
						"text": "환자 의무"
					},
					{
						"text": "2"
					}
				],
				"output": {
					"text": "환자의 의무를 소개합니다.\n\n■ 의료인에 대한 신뢰.존중 의무\n: 환자는 자신의 건강 관련 정보를 의료인에게 정확히 알리고, 의료인의 치료 계획을 신뢰하고 존중하여야 한다.\n\n■ 부정한 방법으로 진료를 받지 않을 의무\n: 환자는 진료 전에 본인의 신분을 밝혀야 하고, 다른 사람의 명의로 진료를 받는 등 거짓이나 부정한 방법으로 진료를 받지 아니한다.",
					"kind": "Text"
				}
			}
		]
	},
	{
		"name": "전원, 산정특례, 가정간호",
		"id": "default17",
		"filename": "default",
		"input": [
			{
				"text": "기타"
			},
			{
				"text": "7"
			}
		],
		"output": {
			"text": "전원, 산정특례, 가정간호에 관해서 알고싶으시군요!\n\n궁금하신 점을 알려주시면 가장 알맞은 답변을 안내해드릴께요:)",
			"kind": "Content"
		}
	},
	{
		"name": "아산봇! 알려주세요",
		"id": "default18",
		"filename": "default",
		"input": [
			{
				"text": "알다"
			},
			{
				"text": "아산 봇"
			},
			{
				"text": "8"
			}
		],
		"output": {
			"text": "아산병원과 관련하여 궁금하신 부분을 단어로 입력해 주시면, 제가 아는 가장 알맞은 답변을 드릴께요.",
			"kind": "Text"
		}
	}
];

var commonDialogs = [
	{
		"id": "defaultcommon0",
		"filename": "defaultcommon",
		"name": "시작",
		"input": [],
		"output": {
			"text": "안녕하세요. 아산봇입니다.\n저는 전화,홈페이지,어플리케이션보다 메신저가 편한 고객님들을 위해 새롭게 선보이는 아산병원 자동 채팅 서비스입니다.\n병원 이용과 관련하신 필요하신 서비스를 선택해주세요.\n\n1. 병원이용 안내 - 오시는 길, 주차안내, 병원시설안내, 편의시설안내\n2. 상담연결번호안내 - 진료예약상담, 건강검진예약상담, 입원관련상담\n3. 진료 안내 - 외래진료, 응급진료\n4. 입원 안내 - 입원 예약, 입원 수속, 입원 치료, 입원 생활, 서류 발급\n5. 아산재단과 아산병원 소개\n6. 환자의 권리와 의무\n7. 기타\n8. 아산봇! 알려주세요!",
			"kind": "Text"
		}
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('Asan');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
