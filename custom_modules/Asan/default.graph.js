


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "병원 이용 안내"
			},
			{
				"text": "1"
			}
		],
		"output": [
			{
				"text": "아산병원 안내를 원하시는군요!\n원하시는 정보를 입력해주세요.\n\n예) 지하철로 가는 방법, 주차 안내, 빈소11호 위치",
				"kind": "Content"
			}
		],
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
				],
				"buttons": [
					null,
					null
				]
			},
			{
				"name": "항공",
				"id": "default25",
				"filename": "default",
				"input": [
					{
						"text": "공항"
					},
					{
						"text": "항공"
					},
					{
						"text": "비행기"
					},
					{
						"text": "인천 국제"
					},
					{
						"text": "flight"
					}
				],
				"output": [
					{
						"text": "공항에서 오시는 길\n\n■ 인천국제공항:\n6705 버스 승차(인천국제공항4A.5B.6A.6B) → 하차(잠실롯데월드) → 잠실역 7번 출구(도보 7분) → 4318 버스 승차 → 하차(서울아산병원 동관) \n\n■ 김포공항:\n6706 버스 승차(김포공항국제선) → 하차(잠실롯데월드) → 잠실역 7번 출구(도보 7분) → 4318 버스 승차 → 하차(서울아산병원 동관)",
						"kind": "Text"
					}
				]
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
						"output": [
							{
								"kind": "Action",
								"call": "R주차"
							}
						]
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
				"inRaw": "4",
				"inNLP": "4",
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
								"text": "무료 주차"
							},
							{
								"text": "할인 주차"
							},
							{
								"text": "장애인 주차"
							},
							{
								"text": "유공 자 주차"
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
						"output": [
							{
								"if": "",
								"kind": "Action",
								"call": "무료 및 할인 주차 정보"
							}
						]
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
								"text": "주차 기간 권"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "기간권 정보"
							}
						]
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
				"output": [
					{
						"text": "별관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
						"image": {
							"url": "/files/Asan1500023028385.jpg",
							"displayname": "f-101.jpg"
						},
						"kind": "Content"
					}
				]
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
				"output": [
					{
						"text": "동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
						"image": {
							"url": "/files/Asan1500023363326.jpg",
							"displayname": "e_b1f19.jpg"
						},
						"kind": "Content"
					}
				]
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
					},
					{
						"text": "편의점"
					}
				],
				"output": [
					{
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
					}
				],
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
							},
							{
								"text": "별관"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "별관편의점"
							}
						]
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
							},
							{
								"text": "동관"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관편의점"
							}
						]
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
							},
							{
								"text": "마트"
							},
							{
								"text": "H"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "H마트",
								"type": "Call"
							}
						]
					}
				],
				"buttons": [
					null,
					null,
					null
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
					},
					{
						"text": "카페"
					}
				],
				"output": [
					{
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
					}
				],
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
							},
							{
								"text": "별관"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "별관카페"
							}
						]
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
							},
							{
								"text": "동관"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관카페"
							}
						]
					},
					{
						"name": "신관카페2",
						"id": "default118",
						"filename": "default",
						"input": [
							{
								"text": "신관 카페"
							},
							{
								"text": "3"
							},
							{
								"text": "신관"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관카페"
							}
						]
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
							"call": "밀탑",
							"type": "Call"
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
							"call": "베즐리",
							"type": "Call"
						}
					}
				],
				"buttons": [
					null,
					null,
					null,
					null,
					null
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
				"output": [
					{
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
					}
				],
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
				],
				"buttons": [
					null,
					null,
					null,
					null
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
				],
				"buttons": [
					null,
					null
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
				"name": "나미(일식)",
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
				"output": [
					{
						"text": "병원 내 일식당 안내\n\n• 나미\n - 위치: 동관 지하1층 \n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 생대구탕, 생선초밥, 알탕\n - 문의처: 02-3010-6181\n\n동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
						"image": {
							"url": "/files/Asan1500269918769.jpg",
							"displayname": "e_b1f03.jpg"
						},
						"kind": "Content"
					}
				]
			},
			{
				"name": "남경(중식)",
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
				"output": [
					{
						"text": "■ 병원 내 중식당 안내\n\n• 남경\n - 위치: 신관 지하1층\n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 짜장, 짬뽕, 탕수육, 요리류\n - 문의처: 02-3010-6381\n\n신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.",
						"image": {
							"url": "/files/Asan1500270138353.jpg",
							"displayname": "신관B1F05.jpg"
						},
						"kind": "Content"
					}
				]
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
						"output": [
							{
								"kind": "Action",
								"call": "나미(일식)"
							}
						]
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
				],
				"buttons": [
					null,
					null,
					null,
					null,
					null
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
						"output": [
							{
								"kind": "Action",
								"call": "남경(중식)"
							}
						]
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
				],
				"buttons": [
					null,
					null
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
					},
					{
						"text": "한식당"
					}
				],
				"output": [
					{
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
					}
				],
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
				],
				"buttons": [
					null,
					null,
					null,
					null,
					null,
					null
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
				"output": [
					{
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
					}
				],
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
				],
				"buttons": [
					null,
					null
				]
			},
			{
				"name": "R식당",
				"id": "default223",
				"filename": "default",
				"input": [
					{
						"text": "식당"
					},
					{
						"text": "음식점"
					},
					{
						"text": "끼니"
					},
					{
						"text": "레스토랑"
					},
					{
						"text": "밥 먹다 곳"
					}
				],
				"output": [
					{
						"text": "아산병원에 있는 음식점을 소개해드릴께요.\n\n원하시는 식사종류를 선택하세요.\n\n1. 한식\n2. 양식\n3. 일식\n4. 중식",
						"buttons": [
							{
								"text": "한식"
							},
							{
								"text": "양식"
							},
							{
								"text": "일식"
							},
							{
								"text": "중식"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "R한식2",
						"id": "default224",
						"filename": "default",
						"input": [
							{
								"text": "한식"
							},
							{
								"text": "1"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "R한식"
							}
						]
					},
					{
						"name": "R양식2",
						"id": "default225",
						"filename": "default",
						"input": [
							{
								"text": "양식"
							},
							{
								"text": "2"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "R양식"
							}
						]
					},
					{
						"name": "일식(나미3)",
						"id": "default226",
						"filename": "default",
						"input": [
							{
								"text": "일식"
							},
							{
								"text": "3"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "나미(일식)",
								"type": "Call"
							}
						]
					},
					{
						"name": "중식(남경3)",
						"id": "default227",
						"filename": "default",
						"input": [
							{
								"text": "중식"
							},
							{
								"text": "4"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "남경(중식)"
							}
						]
					}
				],
				"buttons": [
					null,
					null,
					null,
					null
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
				"input": [
					{
						"text": "은행"
					},
					{
						"text": "계좌 이체"
					},
					{
						"text": "ATM"
					}
				],
				"output": [
					{
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
					}
				],
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
							},
							{
								"text": "동관"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관kb하나은행"
							}
						]
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
							},
							{
								"text": "신관"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관kb하나은행"
							}
						]
					}
				],
				"buttons": [
					null,
					null
				]
			},
			{
				"name": "CT실",
				"id": "default165",
				"filename": "default",
				"input": [
					{
						"text": "CT"
					},
					{
						"text": "씨티"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는  CT실은 어디인가요\n\n1. 서관CT실\n2. 신관CT실",
						"buttons": [
							{
								"text": "서관CT실"
							},
							{
								"text": "신관CT실"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					null,
					null
				],
				"children": [
					{
						"name": "신관CT실2",
						"id": "default230",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "신관 CT 실"
							}
						],
						"output": [
							{
								"text": "call로",
								"kind": "Text"
							}
						]
					},
					{
						"name": "신관CT실2",
						"id": "default231",
						"filename": "default",
						"input": [
							{
								"text": "2"
							},
							{
								"text": "신관 CT 실"
							}
						],
						"output": [
							{
								"text": "Call로",
								"kind": "Text"
							}
						]
					}
				]
			},
			{
				"name": "MR실",
				"id": "default232",
				"filename": "default",
				"input": [
					{
						"text": "MR"
					},
					{
						"text": "엘알"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 MR실은 어디인가요\n\n1. 동관 MR실\n2. 신관 MR실(지하)\n3. 신관 MR실(2층)",
						"buttons": [
							{
								"text": "동관 MR실"
							},
							{
								"text": "신관 MR실(지하)"
							},
							{
								"text": "신관 MR실(2층)"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					null,
					null,
					null
				],
				"children": [
					{
						"name": "동관 MR실2",
						"id": "default233",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "동관 MR 실"
							}
						],
						"output": [
							{
								"text": "call",
								"kind": "Text"
							}
						]
					},
					{
						"name": "신관 MR실(지하)2",
						"id": "default234",
						"filename": "default",
						"input": [
							{
								"text": "2"
							},
							{
								"text": "신관 MR 실 지하"
							}
						],
						"output": [
							{
								"text": "call",
								"kind": "Text"
							}
						]
					},
					{
						"name": "신관 MR실(2층)2",
						"id": "default235",
						"filename": "default",
						"input": [
							{
								"text": "3"
							},
							{
								"text": "신관 MR 실 2 층"
							}
						],
						"output": [
							{
								"text": "call",
								"kind": "Text"
							}
						]
					}
				]
			},
			{
				"name": "PET검사실",
				"id": "default236",
				"filename": "default",
				"input": [
					{
						"text": "PET"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 PET검사실은 어디인가요\n\n1. 동관  PET검사실\n2. 신관 PET검사실(지하)\n3. 신관 PET검사실(2층)",
						"buttons": [
							{
								"text": "동관  PET검사실"
							},
							{
								"text": "신관 PET검사실(지하)"
							},
							{
								"text": "신관 PET검사실(2층)"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "동관  PET검사실",
						"id": "default238",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "동관 PET 검 사실"
							}
						],
						"output": [
							{
								"text": "call",
								"kind": "Text"
							}
						]
					},
					{
						"name": "",
						"id": "default239",
						"filename": "default",
						"input": [],
						"output": []
					},
					{
						"name": "",
						"id": "default240",
						"filename": "default",
						"input": [],
						"output": []
					}
				],
				"buttons": [
					null,
					null,
					null
				]
			},
			{
				"name": "",
				"id": "default237",
				"filename": "default",
				"input": [],
				"output": []
			}
		]
	},
	{
		"name": "전화번호안내",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "전화번호 안내"
			},
			{
				"text": "2"
			}
		],
		"output": [
			{
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
			}
		],
		"children": [
			{
				"name": "진료예약상담",
				"id": "default7",
				"filename": "default",
				"input": [
					{
						"text": "진료 예약 상담"
					},
					{
						"text": "1"
					},
					{
						"text": "진료"
					}
				],
				"output": [
					{
						"text": "진료예약 일자확인과 예약, 변경 및 취소를 위한 상담방법을 알려드릴께요.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에 따라 1번->1번을 순차적으로 누르시면 됩니다.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "건강검진예약상담",
				"id": "default8",
				"filename": "default",
				"input": [
					{
						"text": "건강검진 예약 상담"
					},
					{
						"text": "2"
					}
				],
				"output": [
					{
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
					}
				],
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
						"output": [
							{
								"text": "병원대표번호 1688-7575로 전화 하셔서, 안내멘트에따라 2번→1번을 순차적으로 누르시면 됩니다.",
								"kind": "Text"
							}
						]
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
						"output": [
							{
								"text": "예약일 확인을 위한 상담방법을 알려드릴께요.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에 따라 2번->2번을 순차적으로 누르시면 됩니다.",
								"kind": "Text"
							}
						]
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
						"output": [
							{
								"text": "결과 상담일 확인을 위한상담방법을 알려드릴께요.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에 따라 2번->3번을 순차적으로 누르시면 됩니다.",
								"kind": "Content"
							}
						]
					}
				],
				"buttons": [
					null,
					null,
					null
				]
			},
			{
				"name": "입원관련안내",
				"id": "default9",
				"filename": "default",
				"input": [
					{
						"text": "입원 관련 안내"
					},
					{
						"text": "3"
					}
				],
				"output": [
					{
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
				],
				"buttons": [
					null,
					null
				]
			}
		],
		"buttons": [
			null,
			null,
			null
		]
	},
	{
		"name": "진료안내",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "진료 안내"
			},
			{
				"text": "3"
			}
		],
		"output": [
			{
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
			}
		],
		"children": [
			{
				"name": "외래진료",
				"id": "default3",
				"filename": "default",
				"input": [
					{
						"text": "외래 진료"
					},
					{
						"text": "1"
					},
					{
						"text": "외래"
					}
				],
				"output": [
					{
						"text": "외래진료와 관련해서 궁금하신 점을 입력해주세요\n\n예) 예약 업무 시간, 진료 절차 단계, 보험 혜택",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "예약 방법",
						"id": "default166",
						"filename": "default",
						"input": [
							{
								"text": "예약 방법"
							},
							{
								"text": "예약 어떻다"
							}
						],
						"output": [
							{
								"text": "■ 병원 방문 예약\n - 진행절차: 원무팀 수납 창구 방문→진료 신청→진료 예약→예약일에 진료과 방문\n - 예약시간: 평일 08:30~17:30 / 토요일 : 08:30~12:30\n\n■ 전화 예약 \n - 진행절차: 전화신청(1688-7575)→전화예약실 상담원 연결→진료 상담 후 예약→예약일에 진료과 방문\n - 예약시간: 평  일 : 08:00~18:0   토요일 : 08:00~17:3 일요일 : 08:30~17:30\n - 환자가 꼭 알아야 할 사항 : 성명,주민번호,주소,연락번호, 진료과(상담 후 선택가능)\n\n■ FAX 예약\n - 환자명, 주소, 전화번호, 증상, 희망진료과 작성→FAX신청(02-3010-5452)→확인 후 전화또는 FAX 통보\n - 예약시간: 24시간 가능\n\n■ 인터넷 예약\n - 서울아산병원 홈페이지(www.amc.seoul.kr)접속→진료예약클릭→안내에 따라 진료과, 의사, 일시 선택→완료(인터넷 예약을 하면 진료예약일자를 e-메일로 진료 3일 전 통보해 드립니다.\n - 예약시간: 24시간 가능",
								"kind": "Text"
							}
						]
					},
					{
						"name": "예약 업무 시간",
						"id": "default167",
						"filename": "default",
						"input": [
							{
								"text": "예약 업무 시간"
							},
							{
								"text": "진료 예약 업무"
							},
							{
								"text": "예약 시간"
							}
						],
						"output": [
							{
								"text": "진료예약 업무 시간은 아래와 같습니다. \n• 평 일 : 08:30~17:30\n• 토요일 : 08:30~12:30",
								"kind": "Text"
							}
						]
					},
					{
						"name": "필요 서류",
						"id": "default168",
						"filename": "default",
						"input": [
							{
								"text": "필요 서류"
							}
						],
						"output": [
							{
								"text": "서울아산병원은 국민건강보험법에 의거, 1-2차 병.의원에서 발급한 요양급여의뢰서(진료의뢰서)를 제출해야만 보험 급여 혜택이 가능합니다. 요양급여의뢰서(진료의뢰서) 없이도 진료는 가능하지만 보험 혜택은 못 받으시며, 차후 제출하시면 그날부터 보험 혜택을 받을 수 있습니다. 단 가정의학과,치과는 요양급여의뢰서(진료의뢰서) 없이도 건강보험혜택이 가능합니다.\n\n의료급여자(예, 거택보호자, 국가유공자, 사회복지시설 수용자, 생활보호대상자, 부양의무자가 없거나 노동능력이 없는 자 등)는 모든 진료과에 대하여 병원급 의료급여의뢰서 필요합니다. (의원, 보건소 불가) \n2종 의료급여 대상자(예, 생활보호대상자, 부양의무자가 없거나 노동능력이 없는 자) 중 ‘장애인 복지카드’ 소지 환자는 창구에 장애인등록을 신청하십시오. (의료비 경감 혜택)",
								"kind": "Text"
							}
						]
					},
					{
						"name": "R예약",
						"id": "default169",
						"filename": "default",
						"input": [
							{
								"text": "예약"
							}
						],
						"output": [
							{
								"text": "원하시는 정보가 무엇인가요\n선택해주세요.\n\n1. 예약 방법\n2. 예약 업무 시간\n3. 진료 받기 위한 필요 서류 안내",
								"buttons": [
									{
										"text": "예약 방법"
									},
									{
										"text": "예약 업무 시간"
									},
									{
										"text": "진료 받기 위한 필요 서류 안내"
									}
								],
								"kind": "Content"
							}
						],
						"children": [
							{
								"name": "예약 방법2",
								"id": "default170",
								"filename": "default",
								"input": [
									{
										"text": "예약 방법"
									},
									{
										"text": "1"
									},
									{
										"text": "방법"
									}
								],
								"output": [
									{
										"kind": "Action",
										"call": "예약 방법"
									}
								]
							},
							{
								"name": "예약 업무 시간2",
								"id": "default171",
								"filename": "default",
								"input": [
									{
										"text": "2"
									},
									{
										"text": "예약 업무 시간"
									},
									{
										"text": "시간"
									}
								],
								"output": [
									{
										"kind": "Action",
										"call": "예약 업무 시간"
									}
								]
							},
							{
								"name": "필요 서류2",
								"id": "default172",
								"filename": "default",
								"input": [
									{
										"text": "필요 서류"
									},
									{
										"text": "3"
									},
									{
										"text": "서류"
									}
								],
								"output": [
									{
										"kind": "Action",
										"call": "필요 서류"
									}
								]
							}
						],
						"buttons": [
							null,
							null,
							null
						]
					},
					{
						"name": "외래 진료 시간",
						"id": "default173",
						"filename": "default",
						"input": [
							{
								"text": "진료 시간"
							},
							{
								"text": "업무 시간"
							},
							{
								"text": "오픈 시간"
							}
						],
						"output": [
							{
								"text": "외래 진료 시간은 아래와 같습니다. \n• 평 일 : 09:00~17:00 (단, 공휴일은 응급진료만 가능)\n• 토요일 : 09:00~11:30 (성형외과)",
								"kind": "Text"
							}
						],
						"inRaw": "1",
						"inNLP": "1"
					},
					{
						"name": "진료 절차 단계",
						"id": "default174",
						"filename": "default",
						"input": [
							{
								"text": "진료 절차"
							},
							{
								"text": "진료 순서"
							},
							{
								"text": "진료 단계"
							}
						],
						"output": [
							{
								"text": "1. 처음 오신 분\n2. 진료 받은적이 있는 분",
								"buttons": [
									{
										"text": "처음 오신 분"
									},
									{
										"text": "진료 받은적이 있는 분"
									}
								],
								"kind": "Content"
							}
						],
						"children": [
							{
								"name": "처음 오신 분",
								"id": "default176",
								"filename": "default",
								"input": [
									{
										"text": "처음 오신 분"
									},
									{
										"text": "처음"
									},
									{
										"text": "1"
									}
								],
								"output": [
									{
										"text": "■ 처음 오신 분 진료 절차 안내\n\n(1) 진료신청\n처음 오신 분 창구에서 진료카드를 발급받으신 후, 진료 절차를 안내 받으시기 바랍니다. 예약을 하지 않고 오신 경우에는 진료상담에서 간호사 상담 후 진료 또는 예약을 도와드립니다. 요양급여의뢰서와 건강보험증(신분증), 지참하신 외부영상자료(CD, 필름)를 제출하십시오.\n\n(2) 접수\n병원에 도착하시면 꼭 접수를 해주셔야 진료가 진행됩니다. 진료과 접수 직원에게 접수할 수 있습니다. 무인 접수대에 병원등록번호 또는 주민등록 번호를 입력하거나 바코드를 스캔하여 접수할 수 있습니다. 병원에 처음 오신 분은 처음 오신 분 창구에서 등록 후 진료과에 접수하시기 바랍니다.\n\n(3) 진행상황 확인\n동일 예약시간 환자 중 접수한 순서대로 전광판에 성명이 보입니다.\n\"\"예약시간\"\"은 현재 진료중인 환자의 진료예약시간입니다.\n\n(4) 진료\n진료예약증에는 귀하가 진료 받으실 일자와 시간이 기재되어 있으니, 진료 당일 해당 진료과로 가셔서 순번대로 진료를 받으십시오.\n\n(5) 진료 후 안내\n담당 직원에게 검사예약, 약처방 등에 대한 안내를 받으십시오. 필요 시 다음 외래 진료 예약을 하십시오.\n\n(6) 수납\n진료비 수납기 또는 수납창구에서 진료카드를 제시하시고 진료비를 납부 하신 후 진료비계산서 (영수증), 약처방전을 받으십시오. 건강보험 자격 및 주소, 전화번호 등이 변경된 경우에는 반드시 접수 수납 창구에 변경사항을 알려주시기 바랍니다.\n\n(7) 투약/주사/검사\n진료비계산서(영수증)에 귀하가 가실 곳을 확인하시기 바랍니다.\n - 원내투약: 진료비 계산서의 투약번호를 확인하시고 외래 약국의 전광판에 투약번호가 표시되면 조제된 약을 받으십시오. \n - 주사: 주사 처방이 있는 경우 해당 주사실에서 진료카드와 진료비 계산서를 제시하시면\n주사를 맞을 수 있습니다. \n - 검사: 당일 검사인 경우에는 해당 검사실로 가셔서 진료카드와 진료비 계산서를 제출하신 후 검사를 받으시고 예약 검사인 경우는 예약된 일자에 해당 검사실로 방문하시면 됩니다.\n\n(8) 귀가 / 입원\n담당의사로부터 입원이 결정된 분은 입원창구(신관 1~4번, 서관 32~40번)로 가셔서 예약 또는 입원수속을 하십시오. 원외 처방전을 가지고 원하시는 (외부)약국에 가셔서 약을 받아 귀가하십시오.",
										"kind": "Text"
									}
								]
							},
							{
								"name": "진료 받은 적이 있는 분",
								"id": "default177",
								"filename": "default",
								"input": [
									{
										"text": "진료 받다 적 있다 분"
									},
									{
										"text": "2"
									}
								],
								"output": [
									{
										"text": "■ 진료 받은적이 있는 분(해당 진료과 초진 및 재진환자)의 진료 절차 안내\n\n(1) 진료신청\n예약된 진료과에 방문하시어 접수를 하십시오.\n지참하신 외부영상자료(CD, 필름)는 진료 전 영상자료실에 제출하시기 바랍니다.\n예약을 하지 않고 오신 경우에는 수납창구에서 당일진료 또는 진료예약을 하시기 바랍니다. 당일 진료는 해당 진료과의 예약 상황에 따라 어려울 수도 있습니다.\n\n(2) 접수\n병원에 도착하시면 꼭 접수를 해주셔야 진료가 진행됩니다. 진료과 접수 직원에게 접수할 수 있습니다. 무인 접수대에 병원등록번호 또는 주민등록 번호를 입력하거나 바코드를 스캔하여 접수할 수 있습니다. 병원에 처음 오신 분은 처음 오신 분 창구에서 등록 후 진료과에 접수하시기 바랍니다.\n\n(3) 진행상황 확인\n동일 예약시간 환자 중 접수한 순서대로 전광판에 성명이 보입니다.\n\"\"예약시간\"\"은 현재 진료중인 환자의 진료예약시간입니다.\n\n(4) 진료\n진료예약증에는 귀하가 진료 받으실 일자와 시간이 기재되어 있으니, 진료 당일 해당 진료과로 가셔서 순번대로 진료를 받으십시오.\n\n(5) 진료 후 안내\n담당 직원에게 검사예약, 약처방 등에 대한 안내를 받으십시오. 필요 시 다음 외래 진료 예약을 하십시오.\n\n(6) 수납\n진료비 수납기 또는 수납창구에서 진료카드를 제시하시고 진료비를 납부 하신 후 진료비계산서 (영수증), 약처방전을 받으십시오. 건강보험 자격 및 주소, 전화번호 등이 변경된 경우에는 반드시 접수 수납 창구에 변경사항을 알려주시기 바랍니다.\n\n(7) 투약/주사/검사\n진료비계산서(영수증)에 귀하가 가실 곳을 확인하시기 바랍니다.\n - 원내투약: 진료비 계산서의 투약번호를 확인하시고 외래 약국의 전광판에 투약번호가 표시되면 조제된 약을 받으십시오. \n - 주사: 주사 처방이 있는 경우 해당 주사실에서 진료카드와 진료비 계산서를 제시하시면\n주사를 맞을 수 있습니다. \n - 검사: 당일 검사인 경우에는 해당 검사실로 가셔서 진료카드와 진료비 계산서를 제출하신 후 검사를 받으시고 예약 검사인 경우는 예약된 일자에 해당 검사실로 방문하시면 됩니다.\n\n8. 귀가 / 입원\n담당의사로부터 입원이 결정된 분은 입원창구(신관 1~4번, 서관 32~40번)로 가셔서 예약 또는 입원수속을 하십시오. 원외 처방전을 가지고 원하시는 (외부)약국에 가셔서 약을 받아 귀가하십시오.",
										"kind": "Text"
									}
								]
							}
						],
						"inRaw": "이전",
						"inNLP": "이전",
						"buttons": [
							null,
							null
						]
					},
					{
						"name": "R진료",
						"id": "default175",
						"filename": "default",
						"input": [
							{
								"text": "진료"
							}
						],
						"output": [
							{
								"text": "외래 진료와 관련하여 원하시는 정보가 무엇인가요\n선택해주세요.\n\n1. 외래 진료 시간\n2. 진료 절차 단계",
								"buttons": [
									{
										"text": "외래 진료 시간"
									},
									{
										"text": "진료 절차 단계"
									}
								],
								"kind": "Content"
							}
						],
						"children": [
							{
								"name": "외래 진료 시간2",
								"id": "default178",
								"filename": "default",
								"input": [
									{
										"text": "외래 진료 시간"
									},
									{
										"text": "1"
									}
								],
								"output": [
									{
										"kind": "Action",
										"call": "외래 진료 시간"
									}
								]
							},
							{
								"name": "진료 절차 단계",
								"id": "default179",
								"filename": "default",
								"input": [
									{
										"text": "진료 절차 단계"
									},
									{
										"text": "2"
									}
								],
								"output": [
									{
										"kind": "Action",
										"call": "진료 절차 단계"
									}
								]
							}
						],
						"buttons": [
							null,
							null
						]
					},
					{
						"name": "선택진료비",
						"id": "default182",
						"filename": "default",
						"input": [
							{
								"text": "선택 진료 비"
							},
							{
								"text": "선택 진료 항목"
							},
							{
								"text": "선택 진료 기준"
							}
						],
						"output": [
							{
								"text": "■ 선택진료비 안내\n - 진찰: 진료수가 기준 중 진찰료의 40%\n - 입원: 진료수가 기준 중 입원료의 15%\n - 검사: 진료수가 기준 중 검사료의 30%\n - 영상진단 및 방사선 치료: 진료수가 기준 중 영상진단료의 15% (방사선치료료 : 30%, 방사선혈관촬영료 : 60%)\n - 마취: 진료수가 기준 중 마취료의 50%\n - 정신요법: 진료수가 기준 중 정신요법료이 30% (심층분석 : 60%)\n - 처치/수술: 진료수가 기준 중 처치ㆍ수술료의 50%",
								"kind": "Text"
							}
						]
					},
					{
						"name": "선택 진료",
						"id": "default180",
						"filename": "default",
						"input": [
							{
								"text": "선택 진료"
							}
						],
						"output": [
							{
								"text": "■ 선택진료 안내\n선택진료란 의료법 제 46조에 의거 전문의 자격 인정을 받은 후 10년(치과의사는 의사면허 취득 후 15년)이 경과한 의사, 전문의 자격 인정을 받은 후 5년(치과의사는 의사면허 취득 후 10년)이 경과한 대학병원 조교수이상의 진료 경험이 풍부한 의사를 환자가 선택하여 진료를 받는 제도입니다.\n신청방법은 선택진료신청서를 작성하여 수납창구에 제출하거나 전화나 인터넷으로 신청하실 수 있습니다.\n선택진료는 기준 진료비 이외에 보건복지부령이 정하는 범위에 추가비용을 부담합니다.\n\n선택진료 항목과 비용을 알고 싶으시면 '알려줘'라고 입력해주세요.",
								"kind": "Text"
							}
						],
						"children": [
							{
								"name": "선택진료비2",
								"id": "default181",
								"filename": "default",
								"input": [
									{
										"text": "알다"
									}
								],
								"output": [
									{
										"kind": "Action",
										"call": "선택진료비",
										"type": "Call"
									}
								]
							}
						]
					},
					{
						"name": "보험 적용",
						"id": "default184",
						"filename": "default",
						"input": [
							{
								"text": "보험 적용"
							},
							{
								"text": "건강 보험"
							},
							{
								"text": "보험 혜택"
							}
						],
						"output": [
							{
								"text": "서울아산병원은 국민건강보험법에 의거, 1-2차 병.의원에서 발급한 요양급여의뢰서(진료의뢰서)를 제출해야만 보험 급여 혜택이 가능합니다. 요양급여의뢰서(진료의뢰서) 없이도 진료는 가능하지만 보험 혜택은 못 받으시며, 차후 제출하시면 그날부터 보험 혜택을 받을 수 있습니다. 단 가정의학과,치과는 요양급여의뢰서(진료의뢰서) 없이도 건강보험혜택이 가능합니다.\n\n의료급여자(예, 거택보호자, 국가유공자, 사회복지시설 수용자, 생활보호대상자, 부양의무자가 없거나 노동능력이 없는 자 등)는 모든 진료과에 대하여 병원급 의료급여의뢰서 필요합니다. (의원, 보건소 불가) \n2종 의료급여 대상자(예, 생활보호대상자, 부양의무자가 없거나 노동능력이 없는 자) 중 ‘장애인 복지카드’ 소지 환자는 창구에 장애인등록을 신청하십시오. (의료비 경감 혜택)",
								"kind": "Text"
							}
						]
					}
				]
			},
			{
				"name": "응급진료",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"text": "응급진료"
					},
					{
						"text": "2"
					},
					{
						"text": "응급"
					}
				],
				"output": [
					{
						"text": "응급진료와 관련되서 안내해 드릴께요. 궁금하신 부분을 선택해주세요.\n\n1. 진료 절차\n2. 보험 혜택 안내",
						"buttons": [
							{
								"text": "진료 절차"
							},
							{
								"text": "보험 혜택 안내"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "진료 절차",
						"id": "default185",
						"filename": "default",
						"input": [
							{
								"text": "진료 절차"
							},
							{
								"text": "진료"
							},
							{
								"text": "1"
							}
						],
						"output": [
							{
								"text": "■ 응급실 진료 절차 안내 \n\n(1) 진료신청\n응급수납에서 진료신청서를 작성하시어 제출하시면 진료접수증이 발급 됩니다.\n\n(2) 분류실(초진실)\n분류실에 가시면 예진 후 환자 중증도에 따라 진료구역을 배정 받게 됩니다.\n\n(3) 진찰\n해당구역 응급실 간호사에게 진료접수증을 제출하시면 담당의사가 응급진료를 하게 됩니다.\n진료 후 퇴실 및 입원을 결정하게 됩니다.\n\n- 응급실 전문의 당직 근무 진료과: 내과, 소아청소년과, 정신건강의학과, 신경과, 피부과, 외과, 정형외과, 신경외과, 흉부외과, 성형외과, 산부인과, 안과, 이비인후과, 비뇨기과, 재활의학과, 가정의학과, 치과, 마취통증의학과, 방사선종양학과, 영상의학과, 핵의학과, 진단검사의학과\n\n(4) 진료비 수납\n퇴실결정을 받으신 분은 응급수납창구에서 진료비를 수납하시고 영수증 및 외래진료예약증을\n받으시면 됩니다. 비응급 환자분의 경우 요양급여의뢰서(진료의뢰서)가 없으면 보험수가 100% 본인 부담입니다.\n\n(5)  투약 / 퇴실\n수납한 영수증을 간호사에게 제시하신 후 다음 진료사항과 귀가 시 주의사항에 대하여 상담하십시오.\n원내처방인 경우 외래약국 또는 간호사에게 약을 수령하시면 됩니다. 원외처방인 경우 인근 약국에서 처방전을 제시하고 약을 구입하시면 됩니다.\n\n(6) 입원\n입원결정을 받으신 분은 응급수납 창구에서 입원수속을 마친 후 입원하시면 됩니다.",
								"kind": "Text"
							}
						]
					},
					{
						"name": "보험 혜택 안내",
						"id": "default207",
						"filename": "default",
						"input": [
							{
								"text": "보험"
							},
							{
								"text": "혜택"
							},
							{
								"text": "2"
							}
						],
						"output": [
							{
								"text": "보건복지부에서는 법률로써 응급의료센터를 이용하는 경증환자에 대해 보험혜택을 제한하고 있으며, 응급의료에 대한 법률 제2조에서 규정한 응급증상에 해당되지 않는 환자는 진료비에 대한 보험 혜택을 받을 수 없습니다.\n\n■ 응급증상\n- 신경학적 응급증상: 급성 의식장애, 급성 신경학적 이상, 구토ㆍ의식장애 등의 증상이 있는 두부손상\n- 심혈관계 응급증상: 심폐소생술이 필요한 증상, 급성 호흡곤란, 심장질환으로 인한 급성 흉통, 심계항진, 박동이상 및 쇼크\n- 중독 및 대사장애: 심한 탈수, 약물ㆍ알코올 또는 기타 물질의 과다 복용이나 중독, 급성대사장애(간부전ㆍ신부전ㆍ당뇨병 등)\n- 외과적 응급증상: 개복술을 요하는 급성 복증(급성 복막염ㆍ장폐색증ㆍ급성 췌장염 등 중한 경우에 한함), 광범위한 화상(신체 표면적의 18%이상), 관통상, 개방성ㆍ다발성 골절 또는 대퇴부 척추의 골절, 사지를 절단할 우려가 있는 혈관손상, 다발성 외상, 전신마취 하에 응급수술을 요하는 증상\n- 출혈: 계속되는 각혈, 지혈이 안 되는 출혈, 급성 위장관 출혈\n- 안과적 응급증상: 화학물질에 의한 눈의 손상, 급성 시력소실\n- 알러지: 얼굴 부종을 동반한 알러지 반응\n- 소아과적 응급증상: 소아경련성 장애\n- 정신과적 응급증상: 자신 또는 다른 사람을 해할 우려가 있는 정신장애\n\n■ 응급증상에 준하는 증상\n- 신경학적 응급증상: 의식장애\n- 심혈관계 응급증상: 호흡곤란\n- 외과적 응급증상: 화상, 급성 복증을 포함한 배의 전반적인 이상증상, 골절·외상 또는 탈골, 기타 응급수술을 요하는 증상, 배뇨장애\n- 출혈: 혈관손상\n- 소아과적 응급증상: 소아경련, 38℃ 이상인 소아 고열(공휴일ㆍ야간 등 의료서비스가 제공되기 어려운 때에 3세 이하의 소아에게 나타나는 증상을 말한다)\n- 산부인과적 응급증상: 성폭력으로 인하여 산부인과적 검사 또는 처치가 필요한 증상",
								"kind": "Text"
							}
						]
					}
				],
				"buttons": [
					null,
					null
				]
			}
		],
		"buttons": [
			null,
			null
		]
	},
	{
		"name": "입원안내",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"text": "입원 안내"
			},
			{
				"text": "4"
			}
		],
		"output": [
			{
				"text": "입원과 관련한 궁금하신 점이 무엇이든 알려드릴께요. 무엇을 도와드릴까요\n\n예)입원예약변경, 입원비 무통장 입금, 시트 및 담요교환, 간병인 신청, 불만사항접수하기, 입원기록 발급, 서류발급 준비물",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "입원결정",
				"id": "default204",
				"filename": "default",
				"input": [
					{
						"text": "입원 결정"
					},
					{
						"text": "입원 통보"
					}
				],
				"output": [
					{
						"text": "■ 응급 및 외래진료 후 입원 :\n담당의사로부터 입원결정을 통보 받으시면 입원처리 절차에 따라 입원이 이루어집니다.\n\n■ 당일입원 : 입원수속 창구에 준비된 입원약정서를 작성하시어 진료카드와 함께 제출하시면 됩니다. 입원수속 후 입원안내문, 환자식별용 팔찌, 입원 파일, 보호자 출입증을 배부 받고 배정받은 병동으로 가시면 됩니다. \n\n■ 입원 관련 문의처: 02-3010-7586",
						"kind": "Text"
					}
				]
			},
			{
				"name": "입원 예약 방법",
				"id": "default205",
				"filename": "default",
				"input": [
					{
						"text": "입원 예약 방법"
					}
				],
				"output": [
					{
						"text": "수술일정이나 검사일정을 지정 받으신 분은 입원예약 창구에서 입원예약 후 접수증을 받아 귀가하시면 됩니다.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "입원예정일",
				"id": "default206",
				"filename": "default",
				"input": [
					{
						"text": "입원 예정일"
					}
				],
				"output": [
					{
						"text": "진료과별 퇴원환자의 현황이나 수술일자 등을 고려하여 입원예정일을 지정하여 드리고 있습니다.\n단, 입원예정일 당일에 병실이 부족하여 입원예정일을 변경해야 하는 경우는 입원 당일 10:00 이전에 유선 또는 문자메세지로 병실사정과 입원일 연기를 안내하여 드립니다.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "병실 배정",
				"id": "default211",
				"filename": "default",
				"input": [
					{
						"text": "병실 배정"
					}
				],
				"output": [
					{
						"text": "병실은 VIP실,Family실, 1인실, 2인실, 6인실로 운영하고 있으며, 퇴원환자의 상황에 따라 입원당일에 병실이 결정되기 때문에 환자분이 원하시는 병실의 등급과 차이가 있을 수 있습니다.\n본원은 환자의 퇴원으로 인하여 다인실(2인실, 6인실)에 빈 병실이 생길 경우, 전일 먼저 입원중인 환자에게 우선적으로 병실을 배정하는 관계로 입원 수속 시에는 원하는 병실로 배정받지 못하는 경우가 많습니다. \n아울러 다인실을 신청하는 경우 입원예약 시 접수된 일자 순으로 자동 신청됩니다.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "기준병실 확대 운영",
				"id": "default210",
				"filename": "default",
				"input": [
					{
						"text": "병실 확대"
					},
					{
						"text": "병실 운영"
					}
				],
				"output": [
					{
						"text": "우리 병원은 암환자의 진료비 부담 경감을 위하여 암치료(확진,수술, 항암치료 등)를 위해 2인실에 입원하신 환자 분을 대상으로 암 환자분의 균등한 혜택을 드리고자 최대 4일까지 2인실 병실 차액을 일반병실료로 적용해 드립니다.\n[근거:보건복지부 고시 제2015 - 155호]",
						"kind": "Text"
					}
				]
			},
			{
				"name": "입원 수속 절차",
				"id": "default213",
				"filename": "default",
				"input": [
					{
						"text": "입원 수속"
					}
				],
				"output": [
					{
						"text": "입원예약이 되신 분은 입원당일 11:00 ~ 14:00에 입원접수증과 입원약정서, 신분증을 지참하여 입원수속창구(평일,토요일 : 서관 1층 31번~40번창구, 신관 1층 2번~4번창구 / 일요일, 공휴일 : 동관 1층 2번~10번창구)로 오시기 바랍니다. \n입원당일 입원 전 검사가 예약된 분은 오전 중으로 병원에 오셔서 먼저 입원수속을 마치고 입원 전 검사실로 가셔서 검사를 받으시기 바랍니다.(단, 일요일은 13:00 ~ 17:00시까지 검사가 가능합니다.)\n\n입원약정서 작성 방법을 알고싶으시면 '알려줘'라고 입력하세요.",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "입원 약정서 작성 요령2",
						"id": "default215",
						"filename": "default",
						"input": [
							{
								"text": "알다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "입원 약정서 작성요령"
							}
						]
					}
				]
			},
			{
				"name": "입원 약정서 작성요령",
				"id": "default214",
				"filename": "default",
				"input": [
					{
						"text": "입원 약정"
					}
				],
				"output": [
					{
						"text": "배부해 드린 입원약정서를 상세히 읽어 보신 후 작성하시기 바라며, 연대보증인은 가족이나 친지 중 세대주 또는 직장인 1인이 작성하여 서명 날인하신 후, 입원당일 제출하여 주시기 바랍니다.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "입원 문의처",
				"id": "default222",
				"filename": "default",
				"input": [
					{
						"text": "문의"
					},
					{
						"text": "전화"
					},
					{
						"text": "예약 변경"
					},
					{
						"text": "배정 확인"
					},
					{
						"text": "병상 확인"
					}
				],
				"output": [
					{
						"text": "■ 입원 관련 문의처 안내\n\n• 입원예약 변경 및 취소 : 02-3010-7586\n - 입원예약 변경 및 취소하실 분은 입원예약일 7일전까지 알려 주십시오. \n\n• 병상배정 확인 : 1688-7575 (ARS 3번 → 1번) (자동응답전화 / 입원당일 11:00이후 확인가능)",
						"kind": "Text"
					}
				]
			},
			{
				"name": "입원 예약 및 수속",
				"id": "default216",
				"filename": "default",
				"input": [
					{
						"text": "입원 예약"
					},
					{
						"text": "입원 수속"
					}
				],
				"output": [
					{
						"text": "입원 예약 및 수속과 관련한 사항을 알려드릴께요. 궁금하신 사항의 번호를 입력해주세요.\n\n1. 입원 예약방법\n2. 입원 예정일\n3. 병실 배정\n4. 기준병실 확대 운영\n5. 입원 수속 절차\n6. 입원 약정서 작성요령\n7. 입원 문의처 안내",
						"buttons": [
							{
								"text": "입원 예약방법"
							},
							{
								"text": "입원 예정일"
							},
							{
								"text": "병실 배정"
							},
							{
								"text": "기준병실 확대 운영"
							},
							{
								"text": "입원 수속 절차"
							},
							{
								"text": "입원 약정서 작성요령"
							},
							{
								"text": "입원 문의처 안내"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "입원 예약방법2",
						"id": "default217",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "입원 예약 방법"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "입원 예약 방법"
							}
						]
					},
					{
						"name": "입원 예정일2",
						"id": "default218",
						"filename": "default",
						"input": [
							{
								"text": "2"
							},
							{
								"text": "입원 예정일"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "입원예정일"
							}
						]
					},
					{
						"name": "병실 배정2",
						"id": "default219",
						"filename": "default",
						"input": [
							{
								"text": "3"
							},
							{
								"text": "병실 배정"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "병실 배정"
							}
						]
					},
					{
						"name": "기준병실 확대 운영2",
						"id": "default220",
						"filename": "default",
						"input": [
							{
								"text": "4"
							},
							{
								"text": "기준 병실 확대 운영"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "기준병실 확대 운영"
							}
						]
					},
					{
						"name": "입원 수속 절차2",
						"id": "default228",
						"filename": "default",
						"input": [
							{
								"text": "5"
							},
							{
								"text": "입원 수속 절차"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "입원 수속 절차"
							}
						]
					},
					{
						"name": "입원 약정서 작성요령",
						"id": "default229",
						"filename": "default",
						"input": [
							{
								"text": "6"
							},
							{
								"text": "입원 약정 작성 요령"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "입원 약정서 작성요령"
							}
						]
					},
					{
						"name": "입원 문의처 안내2",
						"id": "default221",
						"filename": "default",
						"input": [
							{
								"text": "7"
							},
							{
								"text": "입원 문의 처 안내"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "입원 문의처"
							}
						]
					}
				],
				"buttons": [
					null,
					null,
					null,
					null,
					null,
					null,
					null
				]
			}
		]
	},
	{
		"name": "아산재단과 아산병원 소개",
		"id": "default6",
		"filename": "default",
		"input": [
			{
				"text": "아산재단 아산병원 소개"
			},
			{
				"text": "5"
			}
		],
		"output": [
			{
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
			}
		],
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
				"output": [
					{
						"text": "내용없음!",
						"kind": "Text"
					}
				]
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
		],
		"buttons": [
			null,
			null,
			null,
			null
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
		],
		"buttons": [
			null,
			null
		]
	},
	{
		"name": "전원, 산정특례, 가정간호",
		"id": "default17",
		"filename": "default",
		"input": [
			{
				"text": "7"
			}
		],
		"output": [
			{
				"text": "전원, 산정특례, 가정간호에 관해서 알고싶으시군요!\n\n궁금하신 점을 알려주시면 가장 알맞은 답변을 안내해드릴께요:)\n\n예) 전원 신청방법, 산정특례 혜택, 가정간호 가능한 지역",
				"kind": "Content"
			}
		],
		"children": [
			{
				"name": "전원 신청방법",
				"id": "default186",
				"filename": "default",
				"input": [
					{
						"text": "전원"
					}
				],
				"output": [
					{
						"text": "퇴원 후 다른 병원(연고지 병원, 요양병원 등)으로 입원을 원하시는 경우에는 퇴원전에 담당의와 상의하시고 진료의료협력센터(ARC)에 문의하시기 바랍니다.\n\n■ 진료의뢰 협력센터 : \n - 위치: 신관 지하 1층 진료의뢰협력센터 (ARC)\n - 상담시간: 평일 08:30~17:30, 토요일 : 08:30~12:30\n - 전화번호: (02) 3010-7773~5(원내 #7773~5)",
						"kind": "Text"
					}
				]
			},
			{
				"name": "산정특례 정의 및 혜택",
				"id": "default187",
				"filename": "default",
				"input": [
					{
						"text": "산정 특례"
					}
				],
				"output": [
					{
						"text": "■ 산정특례 정의\n'산정특례 등록제도'란 진료비 본인부담이 높은 암환자와 희귀난치성질환으로 확진된 경우 의사가 발행산 '건강보험 산정특례 등록신청서'를 공단에 제출하여 등록하는 제도입니다.\n\n■ 산정특례 혜택\n등록일부터 5년까지 산정 특례 혜택을 보게 되며, 대상 상병의 외래와 입원진료시 암은 5%, 희귀난치질환은 10%만 본인이 부담하는 혜택을 받게 됩니다.\n단, 뇌혈관 및 심장질환자는 입원해서 수술(개심술 및 개두술)을 받는 경우 1회당 최대 30일까지 혜택이 적용되며, 별도의 등록절차는 필요하지 않습니다.\n\n산정특례 신청방법에 대해 알고싶으시면 '신청방법'이라고 입력해주세요.",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "산정특례 신청방법2",
						"id": "default189",
						"filename": "default",
						"input": [
							{
								"text": "신청 방법"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "산정특례 신청방법"
							}
						]
					}
				]
			},
			{
				"name": "산정특례 신청방법",
				"id": "default188",
				"filename": "default",
				"input": [
					{
						"text": "산정 특례 신청 방법"
					}
				],
				"output": [
					{
						"text": "환자 진단명이 확정되면 의사의 확인 후 간호사가 산정특례 신청이 가능하다는 사실을 알려드립니다. 간호사의 안내 후 원무팀에 가셔서 신청을 하시면 됩니다.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "가정간호 정의 및 목적",
				"id": "default190",
				"filename": "default",
				"input": [
					{
						"text": "가정 간호 무엇"
					},
					{
						"text": "가정 간호 누구"
					},
					{
						"text": "가정 간호 좋다"
					},
					{
						"text": "가정 간호 장점"
					},
					{
						"text": "가정 간호 목적"
					}
				],
				"output": [
					{
						"text": "■ 가정간호 정의\n가정전문 간호사가 가정으로 환자를 방문하여 주치의의 처방으로 지속적인 간호와 치료를 제공하는 것을 말합니다.\n\n■ 가정간호 간호사\n가정전문 간호사는 임상경험이 있는 간호사로 전문 교육기관에서 일정 교육과정 이수 후 가정전문간호사 자격증을 취득한 간호사 입니다.\n\n■ 가정간호 목적\n - 전문적 상담 : 가정에서 간호서비스를 제공받음으로써 심리적 안정감과 빠른 회복을 도움\n - 서비스 제공 : 환자를 잘 돌볼 수 있도록 간호방법 및 사용할 각종 의료기구 또는 가정용품 사용에 대한 전문적 상담을 받을 수 있음\n - 계속적인 치료 : 만성 질환 환자의 건강관리를 위해 계속적인 치료 및 간호를 제공",
						"kind": "Text"
					}
				]
			},
			{
				"name": "가정간호 대상",
				"id": "default191",
				"filename": "default",
				"input": [
					{
						"text": "가정 간호 대상"
					},
					{
						"text": "가정 간호 누가 필요"
					},
					{
						"text": "가정 간호 어떻다 환자"
					}
				],
				"output": [
					{
						"text": "■ 가정간호 대상자 안내\n - 뇌질환, 당뇨, 척수손상, 심.폐질환 등의 만성질환으로 지속적인 관리가 필요한 환자\n - 수술 후 상처관리, 봉합사 제거 등이 필요한 환자\n - 암 등 말기 질환자, 노인환자 등 거동이 불편한 환자",
						"kind": "Text"
					}
				]
			},
			{
				"name": "가정간호 내용",
				"id": "default203",
				"filename": "default",
				"input": [
					{
						"text": "가정 간호 내용"
					}
				],
				"output": [
					{
						"text": "■ 가정간호 내용 안내\n - 기관 절개관 교환 및 흡인 간호 및 교육\n - 비위관 교환 및 위루관 관리\n - 경관 영양관련 간호 및 교육\n - 장루 및 요루 관리 및 교육\n - 유치 도뇨관 교환 및 관리 및 교육\n - 봉합사 제거\n - 욕창 간호 및 상처 소독 및 관리 교육\n - 중심정맥관 관리 및 수액요법\n - 투약\n - 환자 상태 관찰\n - 활력 징후 측정\n - 검체 수집(혈액, 소변,대변,객담 당)\n - 집에서의 환자 관리 교육 및 상담",
						"kind": "Text"
					}
				]
			},
			{
				"name": "가정간호 신청 방법",
				"id": "default193",
				"filename": "default",
				"input": [
					{
						"text": "가정 간호 신청 방법"
					}
				],
				"output": [
					{
						"text": "■ 가정간호 신청 방법 안내\n - 입원환자 : 퇴원계획시 주치의나 간호사를 통해 신청\n - 외래환자 : 외래진료를 통하여 주치의와 상담 후 신청\n - 타 기관환자 : 타 기관 소견서를 가지고 오셔서 외래진료를 받은 후 신청",
						"kind": "Text"
					}
				]
			},
			{
				"name": "가정간호 가능 지역",
				"id": "default192",
				"filename": "default",
				"input": [
					{
						"text": "가정 간호 가능 지역"
					},
					{
						"text": "가정 간호 지역"
					}
				],
				"output": [
					{
						"text": "가정간호는 아래의 지역에 한하여 제공 가능합니다. \n\n• 서울 전 지역, 구리, 하남, 성남, 분당, 과천, 광주 및 남양주 일부 지역",
						"kind": "Text"
					}
				]
			},
			{
				"name": "가정간호 비용",
				"id": "default194",
				"filename": "default",
				"input": [
					{
						"text": "가정 간호 비용"
					}
				],
				"output": [
					{
						"text": "■ 가정간호 비용 안내\n - 기본 방문료: 59,830원 (환자 부담액- 진단명에 따라 5~20% 부담)\n - 진료재료와 투약 및 간호치료: 지정수가\n - 교통비: 7,880원",
						"kind": "Text"
					}
				]
			},
			{
				"name": "가정간호 상담",
				"id": "default195",
				"filename": "default",
				"input": [
					{
						"text": "가정 간호 상담"
					},
					{
						"text": "가정 간호 연락처"
					},
					{
						"text": "가정 간호 사무실"
					},
					{
						"text": "가정 간호 번호"
					},
					{
						"text": "가정 간호 전화번호"
					}
				],
				"output": [
					{
						"text": "가정간호 상담 시간은 평일 08:30~17:30입니다.\n\n가정간호 사무실 연락처 : 02-3010-7004~6",
						"kind": "Text"
					}
				]
			},
			{
				"name": "R가정간호",
				"id": "default196",
				"filename": "default",
				"input": [
					{
						"text": "가정 간호"
					}
				],
				"output": [
					{
						"text": "다음 중 궁금하신 부분의 번호를 입력하세요.\n\n1. 가정간호사 정의 및 목적\n2. 가정간호 대상자\n3. 가정간호 내용\n4. 가정간호 신청 방법\n5. 가정간호 가능 지역\n6. 가정간호 비용\n7. 가정간호 상담 시간과 연락처",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "가정간호 정의 및 목적2",
						"id": "default197",
						"filename": "default",
						"input": [
							{
								"text": "가정 간호 내용"
							},
							{
								"text": "1"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "가정간호 정의 및 목적"
							}
						]
					},
					{
						"name": "가정간호 대상2",
						"id": "default198",
						"filename": "default",
						"input": [
							{
								"text": "가정 간호 대상"
							},
							{
								"text": "2"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "가정간호 대상"
							}
						]
					},
					{
						"name": "가정간호 내용2",
						"id": "default199",
						"filename": "default",
						"input": [
							{
								"text": "가정 간호 내용"
							},
							{
								"text": "3"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "가정간호 내용"
							}
						]
					},
					{
						"name": "가정간호 신청 방법2",
						"id": "default200",
						"filename": "default",
						"input": [
							{
								"text": "가정 간호 신청 방법"
							},
							{
								"text": "4"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "가정간호 신청 방법"
							}
						]
					},
					{
						"name": "가정간호 가능 지역2",
						"id": "default201",
						"filename": "default",
						"input": [
							{
								"text": "가정 간호 가능 지역"
							},
							{
								"text": "5"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "가정간호 가능 지역"
							}
						]
					},
					{
						"name": "가정간호 상담2",
						"id": "default202",
						"filename": "default",
						"input": [
							{
								"text": "가정 간호 상담"
							},
							{
								"text": "6"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "가정간호 상담"
							}
						]
					}
				]
			}
		]
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
		"input": [
			{
				"text": "시작"
			},
			{
				"text": "처음"
			}
		],
		"output": {
			"text": "안녕하세요 아산봇입니다.\n아산봇은 전화, 홈페이지보다 메신저가 편한 고객님들을 위해 24시간 응답하는 챗봇입니다.\n\n원하시는 서비스를 선택해주세요.\n1. 병원이용안내 - 오시는길, 위치안내, 병원시설안내\n2. 전화번호안내\n3. 진료안내\n4. 입원안내\n5. 아산재단과 아산병원 소개\n6. 환자의 권리와 의무\n7. 전원, 산정특례, 가정간호\n8. 아산봇! 알려주세요",
			"kind": "Text"
		},
		"inRaw": "이전",
		"inNLP": "이전"
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
		"input": [
			{
				"text": ""
			}
		],
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('Asan');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
