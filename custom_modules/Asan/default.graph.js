


var dialogs = [
	{
		"name": "전원, 산정특례, 가정간호",
		"id": "default17",
		"filename": "default",
		"input": [
			{
				"text": "none"
			}
		],
		"output": [
			{
				"text": "전원, 산정특례, 가정간호에 관해서 알고싶으시군요!\n\n궁금하신 점을 알려주시면 가장 알맞은 답변을 안내해드릴께요:)\n\n예) 전원 신청방법, 산정특례 혜택, 가정간호 가능한 지역\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
						"intent": "전원 신청 방법"
					}
				],
				"output": {
					"text": "퇴원 후 다른 병원(연고지 병원, 요양병원 등)으로 입원을 원하시는 경우에는 퇴원전에 담당의와 상의하시고 진료의료협력센터(ARC)에 문의하시기 바랍니다.\n\n■ 진료의뢰 협력센터 : \n - 위치: 신관 지하 1층 진료의뢰협력센터 (ARC)\n - 상담시간: 평일 08:30~17:30, 토요일 : 08:30~12:30\n - 전화번호: (02) 3010-7773~5(원내 #7773~5)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "산정특례 정의 및 혜택",
				"id": "default187",
				"filename": "default",
				"input": [
					{
						"text": "산정 특례"
					},
					{
						"intent": "산정 특례 정의 및 혜택"
					}
				],
				"output": {
					"text": "■ 산정특례 정의\n'산정특례 등록제도'란 진료비 본인부담이 높은 암환자와 희귀난치성질환으로 확진된 경우 의사가 발행산 '건강보험 산정특례 등록신청서'를 공단에 제출하여 등록하는 제도입니다.\n\n■ 산정특례 혜택\n등록일부터 5년까지 산정 특례 혜택을 보게 되며, 대상 상병의 외래와 입원진료시 암은 5%, 희귀난치질환은 10%만 본인이 부담하는 혜택을 받게 됩니다.\n단, 뇌혈관 및 심장질환자는 입원해서 수술(개심술 및 개두술)을 받는 경우 1회당 최대 30일까지 혜택이 적용되며, 별도의 등록절차는 필요하지 않습니다.\n\n산정특례 신청방법에 대해 알고싶으시면 '신청방법'이라고 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요. .",
					"kind": "Text"
				},
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
				],
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "산정특례 신청방법",
				"id": "default188",
				"filename": "default",
				"input": [
					{
						"text": "산정 특례 신청 방법"
					},
					{
						"intent": "산정특례 신청방법"
					}
				],
				"output": [
					{
						"text": "환자 진단명이 확정되면 의사의 확인 후 간호사가 산정특례 신청이 가능하다는 사실을 알려드립니다. 간호사의 안내 후 원무팀에 가셔서 신청을 하시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
					},
					{
						"intent": "가정간호 - 정의 및 목적"
					}
				],
				"output": [
					{
						"text": "■ 가정간호 정의\n가정전문 간호사가 가정으로 환자를 방문하여 주치의의 처방으로 지속적인 간호와 치료를 제공하는 것을 말합니다.\n\n■ 가정간호 간호사\n가정전문 간호사는 임상경험이 있는 간호사로 전문 교육기관에서 일정 교육과정 이수 후 가정전문간호사 자격증을 취득한 간호사 입니다.\n\n■ 가정간호 목적\n - 전문적 상담 : 가정에서 간호서비스를 제공받음으로써 심리적 안정감과 빠른 회복을 도움\n - 서비스 제공 : 환자를 잘 돌볼 수 있도록 간호방법 및 사용할 각종 의료기구 또는 가정용품 사용에 대한 전문적 상담을 받을 수 있음\n - 계속적인 치료 : 만성 질환 환자의 건강관리를 위해 계속적인 치료 및 간호를 제공\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
					},
					{
						"intent": "가정간호 대상"
					}
				],
				"output": [
					{
						"text": "■ 가정간호 대상자 안내\n - 뇌질환, 당뇨, 척수손상, 심.폐질환 등의 만성질환으로 지속적인 관리가 필요한 환자\n - 수술 후 상처관리, 봉합사 제거 등이 필요한 환자\n - 암 등 말기 질환자, 노인환자 등 거동이 불편한 환자\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
						"text": "■ 가정간호 내용 안내\n - 기관 절개관 교환 및 흡인 간호 및 교육\n - 비위관 교환 및 위루관 관리\n - 경관 영양관련 간호 및 교육\n - 장루 및 요루 관리 및 교육\n - 유치 도뇨관 교환 및 관리 및 교육\n - 봉합사 제거\n - 욕창 간호 및 상처 소독 및 관리 교육\n - 중심정맥관 관리 및 수액요법\n - 투약\n - 환자 상태 관찰\n - 활력 징후 측정\n - 검체 수집(혈액, 소변,대변,객담 당)\n - 집에서의 환자 관리 교육 및 상담\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
						"text": "■ 가정간호 신청 방법 안내\n - 입원환자 : 퇴원계획시 주치의나 간호사를 통해 신청\n - 외래환자 : 외래진료를 통하여 주치의와 상담 후 신청\n - 타 기관환자 : 타 기관 소견서를 가지고 오셔서 외래진료를 받은 후 신청\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
						"text": "가정간호는 아래의 지역에 한하여 제공 가능합니다. \n\n• 서울 전 지역, 구리, 하남, 성남, 분당, 과천, 광주 및 남양주 일부 지역\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
						"text": "■ 가정간호 비용 안내\n - 기본 방문료: 59,830원 (환자 부담액- 진단명에 따라 5~20% 부담)\n - 진료재료와 투약 및 간호치료: 지정수가\n - 교통비: 7,880원\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
						"text": "가정간호 상담 시간은 평일 08:30~17:30입니다.\n\n가정간호 사무실 연락처 : 02-3010-7004~6\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
						"buttons": [
							{
								"text": "가정간호사 정의 및 목적"
							},
							{
								"text": "가정간호 대상자"
							},
							{
								"text": "가정간호 내용"
							},
							{
								"text": "가정간호 신청 방법"
							},
							{
								"text": "가정간호 가능 지역"
							},
							{
								"text": "가정간호 비용"
							},
							{
								"text": "가정간호 상담 시간과 연락처",
								"url": ""
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
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
				],
				"buttons": [
					{
						"text": "가정간호사 정의 및 목적"
					},
					{
						"text": "가정간호 대상자"
					},
					{
						"text": "가정간호 내용"
					},
					{
						"text": "가정간호 신청 방법"
					},
					{
						"text": "가정간호 가능 지역"
					},
					{
						"text": "가정간호 비용"
					},
					{
						"text": "가정간호 상담 시간과 연락처",
						"url": ""
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			}
		]
	},
	{
		"name": "D서관 초음파실",
		"id": "default595",
		"filename": "default",
		"input": [
			{
				"intent": "서관 초음파실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관 초음파실",
				"type": "Call"
			}
		]
	},
	{
		"name": "D순환(셔틀)버스",
		"id": "default668",
		"filename": "default",
		"input": [
			{
				"intent": "셔틀"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "순환(셔틀)버스"
			}
		]
	},
	{
		"name": "D지하철",
		"id": "default670",
		"filename": "default",
		"input": [
			{
				"intent": "지하철"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "지하철"
			}
		]
	},
	{
		"name": "D시내버스",
		"id": "default671",
		"filename": "default",
		"input": [
			{
				"intent": "시내 버스"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "시내버스"
			}
		]
	},
	{
		"name": "D고속버스",
		"id": "default672",
		"filename": "default",
		"input": [
			{
				"intent": "고속버스"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "고속버스"
			}
		]
	},
	{
		"name": "D버스",
		"id": "default673",
		"filename": "default",
		"input": [
			{
				"intent": "버스"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R버스"
			}
		]
	},
	{
		"name": "D항공",
		"id": "default674",
		"filename": "default",
		"input": [
			{
				"intent": "공항"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "항공"
			}
		]
	},
	{
		"name": "D기차",
		"id": "default675",
		"filename": "default",
		"input": [
			{
				"intent": "기차"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "기차"
			}
		]
	},
	{
		"name": "D객실Task-객실#S",
		"id": "default1125",
		"filename": "default",
		"input": [
			{
				"regexp": "(?:\\s|^|제)(501|502|503|504|505|506|507|508|509|510|511|512|513|514)\\s*(객실|번객실|호객실|$)"
			},
			{
				"regexp": "(?:객실|객실방)?(501|502|503|504|505|506|507|508|509|510|511|512|513|514)(?:\\s|^|번|호|$)"
			}
		],
		"output": [
			{
				"text": "+1+",
				"kind": "Text"
			}
		],
		"task": {
			"name": "RoomTask"
		}
	},
	{
		"name": "DR예약",
		"id": "default1148",
		"filename": "default",
		"input": [
			{
				"intent": "예약"
			}
		],
		"output": [
			{
				"text": "어떤 예약에 대해서 안내해 드릴까요?\n\n1. 진료 예약\n2. 입원 예약",
				"buttons": [
					{
						"text": "진료 예약"
					},
					{
						"text": "입원 예약"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전",
						"url": ""
					}
				],
				"kind": "Content"
			}
		],
		"children": [
			{
				"name": "진료예약상담2",
				"id": "default1149",
				"filename": "default",
				"input": [
					{
						"text": "진료 예약"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "진료예약상담"
					}
				]
			},
			{
				"name": "입원",
				"id": "default1150",
				"filename": "default",
				"input": [
					{
						"text": "입원 예약"
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
			{
				"text": "진료 예약"
			},
			{
				"text": "입원 예약"
			},
			{
				"text": "처음"
			},
			{
				"text": "이전",
				"url": ""
			}
		]
	},
	{
		"name": "D진료예약상담",
		"id": "default974",
		"filename": "default",
		"input": [
			{
				"intent": "진료예약상담"
			},
			{
				"text": "예약"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "진료예약상담"
			}
		]
	},
	{
		"name": "D자가용",
		"id": "default676",
		"filename": "default",
		"input": [
			{
				"intent": "자가용"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "자가용"
			}
		]
	},
	{
		"name": "D주차장 위치",
		"id": "default677",
		"filename": "default",
		"input": [
			{
				"intent": "주차장 위치"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "주차장 위치"
			}
		]
	},
	{
		"name": "D주차장 이용 방식",
		"id": "default678",
		"filename": "default",
		"input": [
			{
				"intent": "주차장 이용 방식"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "주차장 이용 방식"
			}
		]
	},
	{
		"name": "D주차 이용 가능 시간",
		"id": "default679",
		"filename": "default",
		"input": [
			{
				"intent": "주차 이용 가능 시간"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "주차 이용 가능 시간"
			}
		]
	},
	{
		"name": "D주차장 규모",
		"id": "default680",
		"filename": "default",
		"input": [
			{
				"intent": "주차장 규모"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "주차장 규모"
			}
		]
	},
	{
		"name": "D주차장 규모",
		"id": "default681",
		"filename": "default",
		"input": [
			{
				"intent": "주차장 규모"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "주차장 규모",
				"type": "Call"
			}
		]
	},
	{
		"name": "D주차요금",
		"id": "default682",
		"filename": "default",
		"input": [
			{
				"intent": "주차요금"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "주차요금"
			}
		]
	},
	{
		"name": "D무료 및 할인 주차 정보",
		"id": "default683",
		"filename": "default",
		"input": [
			{
				"intent": "무료 및 할인 주차 정보"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "무료 및 할인 주차 정보"
			}
		]
	},
	{
		"name": "D기간권 정보",
		"id": "default684",
		"filename": "default",
		"input": [
			{
				"intent": "기간권 정보"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "기간권 정보"
			}
		]
	},
	{
		"name": "D주차",
		"id": "default685",
		"filename": "default",
		"input": [
			{
				"intent": "주차"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R주차"
			}
		]
	},
	{
		"name": "D별관 편의점",
		"id": "default686",
		"filename": "default",
		"input": [
			{
				"intent": "별관 편의점"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "별관 편의점"
			}
		]
	},
	{
		"name": "D동관편의점",
		"id": "default687",
		"filename": "default",
		"input": [
			{
				"intent": "동관 편의점"
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
		"name": "DH마트",
		"id": "default688",
		"filename": "default",
		"input": [
			{
				"intent": "H마트"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "H마트"
			}
		]
	},
	{
		"name": "DR편의점&마트",
		"id": "default689",
		"filename": "default",
		"input": [
			{
				"intent": "편의점"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R편의점&마트"
			}
		]
	},
	{
		"name": "D별관카페",
		"id": "default690",
		"filename": "default",
		"input": [
			{
				"intent": "별관 커피숍"
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
		"name": "D동관카페",
		"id": "default691",
		"filename": "default",
		"input": [
			{
				"intent": "동관 커피숍"
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
		"name": "D동관 PET검사실",
		"id": "default693",
		"filename": "default",
		"input": [
			{
				"intent": "동관 PET 검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 PET 검사실"
			}
		]
	},
	{
		"name": "D신관PET검사실",
		"id": "default694",
		"filename": "default",
		"input": [
			{
				"intent": "신관 PET 검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관 PET 검사실"
			}
		]
	},
	{
		"name": "DPET검사실",
		"id": "default692",
		"filename": "default",
		"input": [
			{
				"intent": "PET검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "PET검사실"
			}
		]
	},
	{
		"name": "D신관카페",
		"id": "default695",
		"filename": "default",
		"input": [
			{
				"intent": "신관 커피숍"
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
		"name": "D밀탑",
		"id": "default696",
		"filename": "default",
		"input": [
			{
				"intent": "밀탑(빙수전문점)"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "밀탑"
			}
		]
	},
	{
		"name": "D베즐리",
		"id": "default697",
		"filename": "default",
		"input": [
			{
				"intent": "베이커리카페(베즐리)"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "베즐리"
			}
		]
	},
	{
		"name": "D카페&커피",
		"id": "default698",
		"filename": "default",
		"input": [
			{
				"intent": "카페"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R카페&커피"
			}
		]
	},
	{
		"name": "D금강산",
		"id": "default699",
		"filename": "default",
		"input": [
			{
				"intent": "한식당(금강산)"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "금강산"
			}
		]
	},
	{
		"name": "D한강",
		"id": "default700",
		"filename": "default",
		"input": [
			{
				"intent": "한식당(한강)"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "한강"
			}
		]
	},
	{
		"name": "D직원식당,보호자식당",
		"id": "default701",
		"filename": "default",
		"input": [
			{
				"intent": "직원식당/보호자식당"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "직원식당, 보호자식당"
			}
		]
	},
	{
		"name": "D스카이라운지",
		"id": "default702",
		"filename": "default",
		"input": [
			{
				"intent": "스카이라운지"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "스카이라운지"
			}
		]
	},
	{
		"name": "D가람",
		"id": "default708",
		"filename": "default",
		"input": [
			{
				"intent": "한식당(가람)"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "가람"
			}
		]
	},
	{
		"name": "DR동관 한식",
		"id": "default703",
		"filename": "default",
		"input": [
			{
				"intent": "동관 한식"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R동관 한식"
			}
		]
	},
	{
		"name": "D국수나무",
		"id": "default709",
		"filename": "default",
		"input": [
			{
				"intent": "국수나무"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "국수나무"
			}
		]
	},
	{
		"name": "D별관 식당",
		"id": "default710",
		"filename": "default",
		"input": [
			{
				"intent": "별관 식당"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R별관 식당"
			}
		]
	},
	{
		"name": "D푸드코트",
		"id": "default711",
		"filename": "default",
		"input": [
			{
				"intent": "푸드코트(한식)"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "푸드코트"
			}
		]
	},
	{
		"name": "D나미(일식)",
		"id": "default712",
		"filename": "default",
		"input": [
			{
				"intent": "일식당(나미)"
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
		"name": "D남경(중식)",
		"id": "default713",
		"filename": "default",
		"input": [
			{
				"intent": "중식당(남경)"
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
		"name": "DR동관 식당",
		"id": "default714",
		"filename": "default",
		"input": [
			{
				"intent": "동관 식당"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R동관 식당"
			}
		]
	},
	{
		"name": "DR신관 식당",
		"id": "default715",
		"filename": "default",
		"input": [
			{
				"intent": "신관 식당"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R신관 식당"
			}
		]
	},
	{
		"name": "DR한식",
		"id": "default716",
		"filename": "default",
		"input": [
			{
				"intent": "한식"
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
		"name": "DR양식",
		"id": "default717",
		"filename": "default",
		"input": [
			{
				"intent": "양식"
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
		"name": "DR식당",
		"id": "default718",
		"filename": "default",
		"input": [
			{
				"intent": "식당"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R식당"
			}
		]
	},
	{
		"name": "D동관KB하나은행",
		"id": "default719",
		"filename": "default",
		"input": [
			{
				"intent": "동관 KEB하나은행"
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
		"name": "D신관KB하나은행",
		"id": "default720",
		"filename": "default",
		"input": [
			{
				"intent": "신관 KEB하나은행"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관kb하나은행"
			}
		]
	},
	{
		"name": "DR은행",
		"id": "default721",
		"filename": "default",
		"input": [
			{
				"intent": "은행"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R은행"
			}
		]
	},
	{
		"name": "DCT실",
		"id": "default722",
		"filename": "default",
		"input": [
			{
				"intent": "CT"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "CT실"
			}
		]
	},
	{
		"name": "DMR실",
		"id": "default723",
		"filename": "default",
		"input": [
			{
				"intent": "MR"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "MR실"
			}
		]
	},
	{
		"name": "D처음오신분 창구",
		"id": "default726",
		"filename": "default",
		"input": [
			{
				"intent": "처음오신 분"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "처음 오신 분 창구"
			}
		]
	},
	{
		"name": "D신관 처음 오신분 창구",
		"id": "default724",
		"filename": "default",
		"input": [
			{
				"intent": "신관 처음 오신분 창구"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관 처음 오신분 창구"
			}
		]
	},
	{
		"name": "D동관 처음 오신 분 창구",
		"id": "default725",
		"filename": "default",
		"input": [
			{
				"intent": "동관 처음 오신 분 창구"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 처음 오신 분 창구"
			}
		]
	},
	{
		"name": "D빈소Task-빈소#S>9",
		"id": "default1120",
		"filename": "default",
		"input": [
			{
				"regexp": "(?:\\s|^|제)(11|12|20|21|22|23|30|31|32|33|34|35)\\s*(빈소|번빈소|호빈소| 빈소|번 빈소|호 빈소)"
			},
			{
				"regexp": "(?:\\s|^|제)(11|12|20|21|22|23|30|31|32|33|34|35)\\s*(장례식|번장례식|호장례식|번 장례식|호 장례식)"
			},
			{
				"regexp": "(?:빈소)(?:\\s)?(11|12|20|21|22|23|30|31|32|33|34|35)(?:\\s|번|호|$)"
			},
			{
				"regexp": "(?:장례식|장례식 장)(?:\\s)?(11|12|20|21|22|23|30|31|32|33|34|35)(?:\\s|번|호|$)"
			}
		],
		"output": [
			{
				"text": "+1+",
				"kind": "Text"
			}
		],
		"task": "BSTask"
	},
	{
		"name": "D빈소Task-빈소#S",
		"id": "default1121",
		"filename": "default",
		"input": [
			{
				"regexp": "(?:\\s|^|제)(1|2|3|5|6|7|8|9|10|11|12|20|21|22|23|30|31|32|33|34|35)\\s*(빈소|번빈소|호빈소| 빈소|번 빈소|호 빈소)"
			},
			{
				"regexp": "(?:\\s|^|제)(1|2|3|5|6|7|8|9|10|11|12|20|21|22|23|30|31|32|33|34|35)\\s*(장례식|번장례식|호장례식|번 장례식|호 장례식)"
			},
			{
				"regexp": "(?:빈소)(?:\\s)?(1|2|3|5|6|7|8|9|10|11|12|20|21|22|23|30|31|32|33|34|35)(?:\\s|번|호|$)"
			},
			{
				"regexp": "(?:장례식|장례식 장)(?:\\s)?(1|2|3|5|6|7|8|9|10|11|12|20|21|22|23|30|31|32|33|34|35)(?:\\s|번|호|$)"
			}
		],
		"output": [
			{
				"text": "+1+",
				"kind": "Text"
			}
		],
		"task": {
			"name": "BSTask"
		}
	},
	{
		"name": "D빈소",
		"id": "default728",
		"filename": "default",
		"input": [
			{
				"intent": "빈소"
			},
			{
				"text": "빈소"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "빈소 #F"
			}
		]
	},
	{
		"name": "D객실",
		"id": "default729",
		"filename": "default",
		"input": [
			{
				"intent": "객실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "객실 #F"
			}
		]
	},
	{
		"name": "D사이버나이프센터",
		"id": "default733",
		"filename": "default",
		"input": [
			{
				"intent": "사이버나이프센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "사이버나이프센터"
			}
		]
	},
	{
		"name": "D서관 의무기록/영상사본발급",
		"id": "default734",
		"filename": "default",
		"input": [
			{
				"intent": "서관 의무기록/영상사본발급"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관 의무기록/영상사본발급"
			}
		]
	},
	{
		"name": "D간담도췌외과",
		"id": "default735",
		"filename": "default",
		"input": [
			{
				"intent": "간담도췌외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "간담도췌외과"
			}
		]
	},
	{
		"name": "D간센터",
		"id": "default736",
		"filename": "default",
		"input": [
			{
				"intent": "간센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "간센터"
			}
		]
	},
	{
		"name": "D간이식 및 간담도외과",
		"id": "default737",
		"filename": "default",
		"input": [
			{
				"intent": "간이식 및 간담도외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "간이식 및 간담도외과"
			}
		]
	},
	{
		"name": "D담도/췌장센터",
		"id": "default738",
		"filename": "default",
		"input": [
			{
				"intent": "담도/췌장센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "담도/췌장센터"
			}
		]
	},
	{
		"name": "D대장항문외과",
		"id": "default739",
		"filename": "default",
		"input": [
			{
				"intent": "대장항문외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "대장항문외과"
			}
		]
	},
	{
		"name": "D상부위장관외과",
		"id": "default740",
		"filename": "default",
		"input": [
			{
				"intent": "상부위장관외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "상부위장관외과"
			}
		]
	},
	{
		"name": "D서관 주사실",
		"id": "default741",
		"filename": "default",
		"input": [
			{
				"intent": "서관 주사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관 주사실"
			}
		]
	},
	{
		"name": "D서관 채혈실",
		"id": "default742",
		"filename": "default",
		"input": [
			{
				"intent": "서관 채혈실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관 채혈실"
			}
		]
	},
	{
		"name": "D소화기내과",
		"id": "default743",
		"filename": "default",
		"input": [
			{
				"intent": "소화기내과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소화기내과"
			}
		]
	},
	{
		"name": "D암교육정보센터",
		"id": "default744",
		"filename": "default",
		"input": [
			{
				"intent": "암교육정보센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "암교육정보센터"
			}
		]
	},
	{
		"name": "D암통합진료센터",
		"id": "default745",
		"filename": "default",
		"input": [
			{
				"intent": "암통합진료센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "암통합진료센터"
			}
		]
	},
	{
		"name": "D염증성장질환센터",
		"id": "default746",
		"filename": "default",
		"input": [
			{
				"intent": "염증성장질환센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "염증성장질환센터"
			}
		]
	},
	{
		"name": "D서관 외래/응급 CT MR 실",
		"id": "default747",
		"filename": "default",
		"input": [
			{
				"intent": "외래/응급 CT MR실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관 외래/응급 CT MR실"
			}
		]
	},
	{
		"name": "D외래약국",
		"id": "default748",
		"filename": "default",
		"input": [
			{
				"intent": "외래약국"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "외래약국"
			}
		]
	},
	{
		"name": "D유방내분비외과",
		"id": "default749",
		"filename": "default",
		"input": [
			{
				"intent": "유방내분비외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "유방내분비외과"
			}
		]
	},
	{
		"name": "D유방암클리닉",
		"id": "default750",
		"filename": "default",
		"input": [
			{
				"intent": "유방암클리닉"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "유방암클리닉"
			}
		]
	},
	{
		"name": "D응급의료센터",
		"id": "default751",
		"filename": "default",
		"input": [
			{
				"intent": "응급의료센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "응급의료센터"
			}
		]
	},
	{
		"name": "D응급중환자실",
		"id": "default752",
		"filename": "default",
		"input": [
			{
				"intent": "응급중환자실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "응급중환자실"
			}
		]
	},
	{
		"name": "D응급촬영실",
		"id": "default753",
		"filename": "default",
		"input": [
			{
				"intent": "응급촬영실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "응급촬영실"
			}
		]
	},
	{
		"name": "D일반외과",
		"id": "default754",
		"filename": "default",
		"input": [
			{
				"intent": "일반외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "일반외과"
			}
		]
	},
	{
		"name": "D재활의학과",
		"id": "default755",
		"filename": "default",
		"input": [
			{
				"intent": "재활의학과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "재활의학과"
			}
		]
	},
	{
		"name": "D종양내과",
		"id": "default756",
		"filename": "default",
		"input": [
			{
				"intent": "종양내과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "종양내과"
			}
		]
	},
	{
		"name": "D폐식도외과",
		"id": "default757",
		"filename": "default",
		"input": [
			{
				"intent": "폐식도외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "폐식도외과"
			}
		]
	},
	{
		"name": "D혈액내과",
		"id": "default758",
		"filename": "default",
		"input": [
			{
				"intent": "혈액내과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "혈액내과"
			}
		]
	},
	{
		"name": "D기관지내시경검사실",
		"id": "default759",
		"filename": "default",
		"input": [
			{
				"intent": "기관지내시경검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "기관지내시경검사실"
			}
		]
	},
	{
		"name": "D류마티스내과",
		"id": "default760",
		"filename": "default",
		"input": [
			{
				"intent": "류마티스내과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "류마티스내과"
			}
		]
	},
	{
		"name": "DRCT실",
		"id": "default949",
		"filename": "default",
		"input": [
			{
				"intent": "CT"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "CT실"
			}
		]
	},
	{
		"name": "D서관CT실",
		"id": "default761",
		"filename": "default",
		"input": [
			{
				"intent": "서관CT실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관CT실"
			}
		]
	},
	{
		"name": "D서관 초음파실",
		"id": "default762",
		"filename": "default",
		"input": [
			{
				"intent": "서관 초음파실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관 초음파실"
			}
		]
	},
	{
		"name": "D서관 투시조영실",
		"id": "default763",
		"filename": "default",
		"input": [
			{
				"intent": "서관 투시조영실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관 투시조영실"
			}
		]
	},
	{
		"name": "D알레르기검사실",
		"id": "default764",
		"filename": "default",
		"input": [
			{
				"intent": "알레르기검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "알레르기검사실"
			}
		]
	},
	{
		"name": "D알레르기내과",
		"id": "default765",
		"filename": "default",
		"input": [
			{
				"intent": "알레르기내과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "알레르기내과"
			}
		]
	},
	{
		"name": "D유방두경부영상의학검사실",
		"id": "default766",
		"filename": "default",
		"input": [
			{
				"intent": "유방두경부영상의학검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "유방두경부영상의학검사실"
			}
		]
	},
	{
		"name": "D입원전검사실",
		"id": "default767",
		"filename": "default",
		"input": [
			{
				"intent": "입원전검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원전검사실"
			}
		]
	},
	{
		"name": "D장기이식센터",
		"id": "default768",
		"filename": "default",
		"input": [
			{
				"intent": "장기이식센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "장기이식센터"
			}
		]
	},
	{
		"name": "D천식 COPD센터",
		"id": "default769",
		"filename": "default",
		"input": [
			{
				"intent": "천식/COPD센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "천식 COPD센터"
			}
		]
	},
	{
		"name": "D호흡기검사실",
		"id": "default770",
		"filename": "default",
		"input": [
			{
				"intent": "호흡기검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "호흡기검사실"
			}
		]
	},
	{
		"name": "D호흡기내과",
		"id": "default771",
		"filename": "default",
		"input": [
			{
				"intent": "호흡기내과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "호흡기내과"
			}
		]
	},
	{
		"name": "D기독교원목실",
		"id": "default772",
		"filename": "default",
		"input": [
			{
				"intent": "기독교"
			},
			{
				"intent": "기독교원목실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "기독교원목실"
			}
		]
	},
	{
		"name": "D마취통증의학과",
		"id": "default773",
		"filename": "default",
		"input": [
			{
				"intent": "마취통증의학과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "마취통증의학과"
			}
		]
	},
	{
		"name": "D불교법당",
		"id": "default774",
		"filename": "default",
		"input": [
			{
				"intent": "불교"
			},
			{
				"intent": "불교법당"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "불교법당"
			}
		]
	},
	{
		"name": "D서관 3층 강당",
		"id": "default775",
		"filename": "default",
		"input": [
			{
				"intent": "서관 3층 강당"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관 3층 강당"
			}
		]
	},
	{
		"name": "D서관 중환자실",
		"id": "default776",
		"filename": "default",
		"input": [
			{
				"intent": "서관 중환자실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관 중환자실"
			}
		]
	},
	{
		"name": "D서관 수술실",
		"id": "default777",
		"filename": "default",
		"input": [
			{
				"intent": "서관수술실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관수술실"
			}
		]
	},
	{
		"name": "D서관 중환자면회대기실",
		"id": "default778",
		"filename": "default",
		"input": [
			{
				"intent": "서관 중환자면회대기실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서관 중환자면회대기실"
			}
		]
	},
	{
		"name": "D천주교원목실",
		"id": "default779",
		"filename": "default",
		"input": [
			{
				"intent": "천주교"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "천주교원목실"
			}
		]
	},
	{
		"name": "D배변장애치료실",
		"id": "default780",
		"filename": "default",
		"input": [
			{
				"intent": "배변장애치료실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "배변장애치료실"
			}
		]
	},
	{
		"name": "D상부위장관내시경검사실",
		"id": "default781",
		"filename": "default",
		"input": [
			{
				"intent": "상부위장관내시경검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "상부위장관내시경검사실"
			}
		]
	},
	{
		"name": "D췌담도검사실",
		"id": "default782",
		"filename": "default",
		"input": [
			{
				"intent": "췌담도검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "췌담도검사실"
			}
		]
	},
	{
		"name": "D하부위장관내시경검사실",
		"id": "default783",
		"filename": "default",
		"input": [
			{
				"intent": "하부위장관내시경검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "하부위장관내시경검사실"
			}
		]
	},
	{
		"name": "D뷰티케어 샵",
		"id": "default784",
		"filename": "default",
		"input": [
			{
				"intent": "뷰티케어 샵"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "뷰티케어 샵"
			}
		]
	},
	{
		"name": "D암병원 주사실",
		"id": "default785",
		"filename": "default",
		"input": [
			{
				"intent": "암병원 주사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "암병원 주사실"
			}
		]
	},
	{
		"name": "D긴급진료실",
		"id": "default786",
		"filename": "default",
		"input": [
			{
				"intent": "긴급진료실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "긴급진료실"
			}
		]
	},
	{
		"name": "D병동",
		"id": "default1116",
		"filename": "default",
		"input": [
			{
				"intent": "병동"
			}
		],
		"output": [
			{
				"text": "아산병원에 있는 병동 리스트입니다.\n\n72~76병동\n81~86병동\n91~96병동\n101~106병동\n111~116병동\n121,123~126병동\n133~136병동\n143~146병동\n153~156병동\n163,164병동\n173,174병동\n183,184병동\n\n다음 중 어떤 병동을 찾으시나요?",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "dialog_default1117",
				"id": "default1117",
				"filename": "default",
				"input": [
					{
						"regexp": "(72|81|82|91|92|93|94|95|96|101|102|103|104|105|106|111|112|113|114|115|116|121|123|124|125|126|133|134|135|136|143|144|145|153|155|156|163|164|173|174|183|184)"
					}
				],
				"output": [
					{
						"text": "+1+",
						"kind": "Text"
					}
				],
				"task": "DongTask"
			}
		]
	},
	{
		"name": "D병동Task-Task#S",
		"id": "default1113",
		"filename": "default",
		"input": [
			{
				"regexp": "(?:\\s|^|제)(72|81|82|91|92|93|94|95|96|101|102|103|104|105|106|111|112|113|114|115|116|121|123|124|125|126|133|134|135|136|143|144|145|153|155|156|163|164|173|174|183|184)\\s*(병동|동|번 병동)"
			}
		],
		"output": [
			{
				"text": "+1+",
				"kind": "Text"
			}
		],
		"task": "DongTask"
	},
	{
		"name": "D단기병동",
		"id": "default787",
		"filename": "default",
		"input": [
			{
				"intent": "단기병동"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "단기병동"
			}
		]
	},
	{
		"name": "D방사선종양학과",
		"id": "default788",
		"filename": "default",
		"input": [
			{
				"intent": "방사선종양학과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "방사선종양학과"
			}
		]
	},
	{
		"name": "D의료용품점",
		"id": "default789",
		"filename": "default",
		"input": [
			{
				"intent": "의료용품점"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "의료용품점"
			}
		]
	},
	{
		"name": "D현대드림투어",
		"id": "default790",
		"filename": "default",
		"input": [
			{
				"intent": "현대드림투어"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "현대드림투어"
			}
		]
	},
	{
		"name": "D화원(꽃집)",
		"id": "default791",
		"filename": "default",
		"input": [
			{
				"intent": "화원(꽃집)"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "화원(꽃집)"
			}
		]
	},
	{
		"name": "D휴대전화 대리점",
		"id": "default792",
		"filename": "default",
		"input": [
			{
				"intent": "휴대전화 대리점"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "휴대전화 대리점"
			}
		]
	},
	{
		"name": "D가정의학과",
		"id": "default793",
		"filename": "default",
		"input": [
			{
				"intent": "가정의학과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "가정의학과"
			}
		]
	},
	{
		"name": "D갤러리",
		"id": "default794",
		"filename": "default",
		"input": [
			{
				"intent": "갤러리"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "갤러리"
			}
		]
	},
	{
		"name": "D내분비내과",
		"id": "default795",
		"filename": "default",
		"input": [
			{
				"intent": "내분비내과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "내분비내과"
			}
		]
	},
	{
		"name": "D노년내과",
		"id": "default796",
		"filename": "default",
		"input": [
			{
				"intent": "노년내과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "노년내과"
			}
		]
	},
	{
		"name": "D당뇨병센터",
		"id": "default797",
		"filename": "default",
		"input": [
			{
				"intent": "당뇨병센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "당뇨병센터"
			}
		]
	},
	{
		"name": "D당뇨합병증검사실",
		"id": "default798",
		"filename": "default",
		"input": [
			{
				"intent": "당뇨합병증검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "당뇨합병증검사실"
			}
		]
	},
	{
		"name": "D대동맥질환센터",
		"id": "default799",
		"filename": "default",
		"input": [
			{
				"intent": "대동맥질환센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "대동맥질환센터"
			}
		]
	},
	{
		"name": "D동관 외래 촬영실",
		"id": "default800",
		"filename": "default",
		"input": [
			{
				"intent": "동관 외래 촬영실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 외래 촬영실"
			}
		]
	},
	{
		"name": "D동관 처음 오신 분 창구",
		"id": "default801",
		"filename": "default",
		"input": [
			{
				"intent": "동관 처음 오신 분 창구"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 처음 오신 분 창구"
			}
		]
	},
	{
		"name": "D마르판클리닉",
		"id": "default802",
		"filename": "default",
		"input": [
			{
				"intent": "마르판클리닉"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "마르판클리닉"
			}
		]
	},
	{
		"name": "D말초혈관질환센터",
		"id": "default803",
		"filename": "default",
		"input": [
			{
				"intent": "말초혈관질환센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "말초혈관질환센터"
			}
		]
	},
	{
		"name": "D신경과",
		"id": "default805",
		"filename": "default",
		"input": [
			{
				"intent": "신경과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신경과"
			}
		]
	},
	{
		"name": "D신경외과",
		"id": "default806",
		"filename": "default",
		"input": [
			{
				"intent": "신경외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신경외과"
			}
		]
	},
	{
		"name": "D신장내과",
		"id": "default807",
		"filename": "default",
		"input": [
			{
				"intent": "신장내과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신장내과"
			}
		]
	},
	{
		"name": "D신방세동센터",
		"id": "default808",
		"filename": "default",
		"input": [
			{
				"intent": "심방세동센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심방세동센터"
			}
		]
	},
	{
		"name": "D심부전/심장이식센터",
		"id": "default809",
		"filename": "default",
		"input": [
			{
				"intent": "심부전/심장이식센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심부전/심장이식센터"
			}
		]
	},
	{
		"name": "D심장내과",
		"id": "default810",
		"filename": "default",
		"input": [
			{
				"intent": "심장내과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심장내과"
			}
		]
	},
	{
		"name": "D심장병예방재활센터",
		"id": "default811",
		"filename": "default",
		"input": [
			{
				"intent": "심장병예방재활센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심장병예방재활센터"
			}
		]
	},
	{
		"name": "D심장병원",
		"id": "default812",
		"filename": "default",
		"input": [
			{
				"intent": "심장병원"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심장병원"
			}
		]
	},
	{
		"name": "D심장영상센터",
		"id": "default813",
		"filename": "default",
		"input": [
			{
				"intent": "심장영상센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심장영상센터"
			}
		]
	},
	{
		"name": "D심장외과",
		"id": "default814",
		"filename": "default",
		"input": [
			{
				"intent": "심장외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심장외과"
			}
		]
	},
	{
		"name": "D유헬스센터",
		"id": "default815",
		"filename": "default",
		"input": [
			{
				"intent": "유헬스센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "유헬스센터"
			}
		]
	},
	{
		"name": "D동관 의무기록/영상사본발급",
		"id": "default816",
		"filename": "default",
		"input": [
			{
				"intent": "동관 의무기록/영상사본발급"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 의무기록/영상사본발급"
			}
		]
	},
	{
		"name": "D정형외과",
		"id": "default817",
		"filename": "default",
		"input": [
			{
				"intent": "정형외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "정형외과"
			}
		]
	},
	{
		"name": "D진료안내 창구",
		"id": "default818",
		"filename": "default",
		"input": [
			{
				"intent": "진료안내 창구"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "진료안내"
			}
		]
	},
	{
		"name": "D파킨슨병센터",
		"id": "default819",
		"filename": "default",
		"input": [
			{
				"intent": "파킨슨병센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "파킨슨병센터",
				"type": "Call"
			}
		]
	},
	{
		"name": "D판막질환센터",
		"id": "default820",
		"filename": "default",
		"input": [
			{
				"intent": "판막질환센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "판막질환센터"
			}
		]
	},
	{
		"name": "D평생건강클리닉",
		"id": "default821",
		"filename": "default",
		"input": [
			{
				"intent": "평생건강클리닉"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "평생건강클리닉"
			}
		]
	},
	{
		"name": "D폐고혈압/정맥혈전센터",
		"id": "default822",
		"filename": "default",
		"input": [
			{
				"intent": "폐고혈압/정맥혈전센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "폐고혈압/정맥혈전센터"
			}
		]
	},
	{
		"name": "D혈관외과",
		"id": "default823",
		"filename": "default",
		"input": [
			{
				"intent": "혈관외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "혈관외과"
			}
		]
	},
	{
		"name": "D협십증/심근경색센터",
		"id": "default824",
		"filename": "default",
		"input": [
			{
				"intent": "협십증/심근경색센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "협십증/심근경색센터"
			}
		]
	},
	{
		"name": "D감마나이프센터",
		"id": "default825",
		"filename": "default",
		"input": [
			{
				"intent": "감마나이프센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "감마나이프센터"
			}
		]
	},
	{
		"name": "D뇌신경검사실",
		"id": "default826",
		"filename": "default",
		"input": [
			{
				"intent": "뇌신경검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "뇌신경검사실"
			}
		]
	},
	{
		"name": "D동관 MR실",
		"id": "default827",
		"filename": "default",
		"input": [
			{
				"intent": "동관 MR실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 MR실"
			}
		]
	},
	{
		"name": "D동관 PET검사실",
		"id": "default828",
		"filename": "default",
		"input": [
			{
				"intent": "동관 PET 검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 PET 검사실"
			}
		]
	},
	{
		"name": "D동관 일반촬영실",
		"id": "default829",
		"filename": "default",
		"input": [
			{
				"intent": "동관 일반촬영실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 일반촬영실"
			}
		]
	},
	{
		"name": "D동관 핵의학과 영상검사실",
		"id": "default831",
		"filename": "default",
		"input": [
			{
				"intent": "동관 핵의학과 영상검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 핵의학과 영상검사실"
			}
		]
	},
	{
		"name": "D동관 핵의학과 혈액검사실",
		"id": "default832",
		"filename": "default",
		"input": [
			{
				"intent": "동관 핵의학과 혈액검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 핵의학과 혈액검사실"
			}
		]
	},
	{
		"name": "D수면다윈검사실",
		"id": "default833",
		"filename": "default",
		"input": [
			{
				"intent": "수면다원검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "수면다원검사실"
			}
		]
	},
	{
		"name": "D신경중재클리닉",
		"id": "default834",
		"filename": "default",
		"input": [
			{
				"intent": "신경중재클리닉"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신경중재클리닉"
			}
		]
	},
	{
		"name": "D심장검사실",
		"id": "default835",
		"filename": "default",
		"input": [
			{
				"intent": "심장검사실(심전도, 홀터, 운동부하)"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심장검사실(심전도, 홀터, 운동부하)"
			}
		]
	},
	{
		"name": "D심장재활검사실",
		"id": "default836",
		"filename": "default",
		"input": [
			{
				"intent": "심장재활검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심장재활검사실"
			}
		]
	},
	{
		"name": "D심전도실",
		"id": "default837",
		"filename": "default",
		"input": [
			{
				"intent": "심전도실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심전도실"
			}
		]
	},
	{
		"name": "D영상의학과 외래",
		"id": "default838",
		"filename": "default",
		"input": [
			{
				"intent": "영상의학과 외래"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "영상의학과 외래"
			}
		]
	},
	{
		"name": "D혈관검사실",
		"id": "default839",
		"filename": "default",
		"input": [
			{
				"intent": "혈관검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "혈관검사실"
			}
		]
	},
	{
		"name": "D혈관조명실",
		"id": "default840",
		"filename": "default",
		"input": [
			{
				"intent": "혈관조영실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "혈관조영실"
			}
		]
	},
	{
		"name": "D동관 수술실",
		"id": "default841",
		"filename": "default",
		"input": [
			{
				"intent": "동관 수술실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 수술실"
			}
		]
	},
	{
		"name": "D동관 중환자실",
		"id": "default842",
		"filename": "default",
		"input": [
			{
				"intent": "동관 중환자실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 중환자실"
			}
		]
	},
	{
		"name": "D심장병원 당일입원실",
		"id": "default843",
		"filename": "default",
		"input": [
			{
				"intent": "심장병원 당일입원실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심장병원 당일입원실"
			}
		]
	},
	{
		"name": "D심혈관조영실",
		"id": "default844",
		"filename": "default",
		"input": [
			{
				"intent": "심혈관조영실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심혈관조영실"
			}
		]
	},
	{
		"name": "D전기생리학 검사실",
		"id": "default845",
		"filename": "default",
		"input": [
			{
				"intent": "전기생리학 검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "전기생리학 검사실"
			}
		]
	},
	{
		"name": "DR중환자면회대기실",
		"id": "default846",
		"filename": "default",
		"input": [
			{
				"intent": "중환자면회대기실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R중환자면회대기실"
			}
		]
	},
	{
		"name": "D병리과",
		"id": "default847",
		"filename": "default",
		"input": [
			{
				"intent": "병리과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "병리과"
			}
		]
	},
	{
		"name": "D비뇨기검사실",
		"id": "default848",
		"filename": "default",
		"input": [
			{
				"intent": "비뇨기과검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "비뇨기검사실"
			}
		]
	},
	{
		"name": "D비뇨기과",
		"id": "default849",
		"filename": "default",
		"input": [
			{
				"intent": "비뇨기과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "비뇨기과"
			}
		]
	},
	{
		"name": "D세침흡인실",
		"id": "default850",
		"filename": "default",
		"input": [
			{
				"intent": "세침흡인실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "세침흡인실"
			}
		]
	},
	{
		"name": "D스포츠건강의학센터",
		"id": "default851",
		"filename": "default",
		"input": [
			{
				"intent": "스포츠건강의학센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "스포츠건강의학센터"
			}
		]
	},
	{
		"name": "D심장초음파 검사실",
		"id": "default852",
		"filename": "default",
		"input": [
			{
				"intent": "심장초음파 검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "심장초음파 검사실"
			}
		]
	},
	{
		"name": "D인공신장실",
		"id": "default853",
		"filename": "default",
		"input": [
			{
				"intent": "인공신장실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "인공신장실"
			}
		]
	},
	{
		"name": "D재활치료실",
		"id": "default854",
		"filename": "default",
		"input": [
			{
				"intent": "재활치료실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "재활치료실"
			}
		]
	},
	{
		"name": "D전립선센터",
		"id": "default855",
		"filename": "default",
		"input": [
			{
				"intent": "전립선센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "전립선센터"
			}
		]
	},
	{
		"name": "D정신건강의학과",
		"id": "default856",
		"filename": "default",
		"input": [
			{
				"intent": "정신건강의학과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "정신건강의학과"
			}
		]
	},
	{
		"name": "D조직세포지원센터",
		"id": "default857",
		"filename": "default",
		"input": [
			{
				"intent": "조직세포자원센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "조직세포자원센터"
			}
		]
	},
	{
		"name": "D헌혈실",
		"id": "default858",
		"filename": "default",
		"input": [
			{
				"intent": "헌혈실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "헌혈실"
			}
		]
	},
	{
		"name": "D혈액은행",
		"id": "default859",
		"filename": "default",
		"input": [
			{
				"intent": "혈액은행"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "혈액은행"
			}
		]
	},
	{
		"name": "D동관 대강당",
		"id": "default860",
		"filename": "default",
		"input": [
			{
				"intent": "동관 대강당"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 대강당"
			}
		]
	},
	{
		"name": "D동관 소강당",
		"id": "default861",
		"filename": "default",
		"input": [
			{
				"intent": "동관 소강당"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "동관 소강당"
			}
		]
	},
	{
		"name": "D전시실",
		"id": "default862",
		"filename": "default",
		"input": [
			{
				"intent": "전시실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "전시실"
			}
		]
	},
	{
		"name": "D세미나실",
		"id": "default863",
		"filename": "default",
		"input": [
			{
				"intent": "세미나실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "세미나실"
			}
		]
	},
	{
		"name": "D조혈모세포 검사실",
		"id": "default864",
		"filename": "default",
		"input": [
			{
				"intent": "조혈모세포 검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "조혈모세포 검사실"
			}
		]
	},
	{
		"name": "D비디오뇌파검사실",
		"id": "default865",
		"filename": "default",
		"input": [
			{
				"intent": "비디오뇌파검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "비디오뇌파검사실"
			}
		]
	},
	{
		"name": "D뇌졸증센터 집중치료실",
		"id": "default866",
		"filename": "default",
		"input": [
			{
				"intent": "뇌졸중센터 집중치료실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "뇌졸중센터 집중치료실"
			}
		]
	},
	{
		"name": "D멀티플라자",
		"id": "default867",
		"filename": "default",
		"input": [
			{
				"intent": "멀티플라자"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "멀티플라자"
			}
		]
	},
	{
		"name": "D문구점",
		"id": "default868",
		"filename": "default",
		"input": [
			{
				"intent": "문구점"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "문구점"
			}
		]
	},
	{
		"name": "D서점",
		"id": "default869",
		"filename": "default",
		"input": [
			{
				"intent": "서점"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서점"
			}
		]
	},
	{
		"name": "D미용실",
		"id": "default870",
		"filename": "default",
		"input": [
			{
				"intent": "미용실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "미용실"
			}
		]
	},
	{
		"name": "D보호자세탁실",
		"id": "default871",
		"filename": "default",
		"input": [
			{
				"intent": "보호자세탁실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "보호자세탁실"
			}
		]
	},
	{
		"name": "D신관 MR실(지하)",
		"id": "default872",
		"filename": "default",
		"input": [
			{
				"intent": "신관 MR실(지하)"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관 MR실(지하)"
			}
		]
	},
	{
		"name": "D안경점",
		"id": "default874",
		"filename": "default",
		"input": [
			{
				"intent": "안경점"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "안경점"
			}
		]
	},
	{
		"name": "D우체국",
		"id": "default875",
		"filename": "default",
		"input": [
			{
				"intent": "우체국"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "우체국"
			}
		]
	},
	{
		"name": "D의학유전학센터",
		"id": "default876",
		"filename": "default",
		"input": [
			{
				"intent": "의학유전학센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "의학유전학센터"
			}
		]
	},
	{
		"name": "D이발소",
		"id": "default877",
		"filename": "default",
		"input": [
			{
				"intent": "이발소"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "이발소"
			}
		]
	},
	{
		"name": "D진료의뢰협력센터",
		"id": "default878",
		"filename": "default",
		"input": [
			{
				"intent": "진료의뢰협력센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "진료의뢰협력센터"
			}
		]
	},
	{
		"name": "D산부인과",
		"id": "default879",
		"filename": "default",
		"input": [
			{
				"intent": "산부인과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "산부인과"
			}
		]
	},
	{
		"name": "D소아 재활치료실",
		"id": "default880",
		"filename": "default",
		"input": [
			{
				"text": "소아 재활 치료 실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아 재활치료실"
			}
		]
	},
	{
		"name": "D소아 주사실",
		"id": "default881",
		"filename": "default",
		"input": [
			{
				"intent": "소아 주사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아 주사실"
			}
		]
	},
	{
		"name": "D소아 당뇨클리닉",
		"id": "default882",
		"filename": "default",
		"input": [
			{
				"intent": "소아 당뇨클리닉"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아 당뇨클리닉"
			}
		]
	},
	{
		"name": "D소아 심장검사실",
		"id": "default883",
		"filename": "default",
		"input": [
			{
				"intent": "소아 심장검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아 심장검사실"
			}
		]
	},
	{
		"name": "D소아 심전도검사실",
		"id": "default884",
		"filename": "default",
		"input": [
			{
				"intent": "소아 심전도검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아 심전도검사실"
			}
		]
	},
	{
		"name": "D소아외과",
		"id": "default885",
		"filename": "default",
		"input": [
			{
				"intent": "소아외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아외과"
			}
		]
	},
	{
		"name": "D소아 주사실",
		"id": "default886",
		"filename": "default",
		"input": [
			{
				"intent": "소아 주사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아 주사실",
				"type": "Call"
			}
		]
	},
	{
		"name": "D소아 응급센터",
		"id": "default887",
		"filename": "default",
		"input": [
			{
				"intent": "소아응급센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아응급센터"
			}
		]
	},
	{
		"name": "D소아천식아토피센터",
		"id": "default888",
		"filename": "default",
		"input": [
			{
				"intent": "소아천식아토피센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아천식아토피센터"
			}
		]
	},
	{
		"name": "D소아청소년 감염과",
		"id": "default889",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 감염과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 감염과"
			}
		]
	},
	{
		"name": "D소아청소년 내분비대사과",
		"id": "default890",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 내분비대사과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 내분비대사과"
			}
		]
	},
	{
		"name": "D소아청소년 비뇨기과",
		"id": "default891",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 비뇨기과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 비뇨기과"
			}
		]
	},
	{
		"name": "D소아청소년  소화기 영양과",
		"id": "default892",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 소화기 영양과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 소화기 영양과"
			}
		]
	},
	{
		"name": "D소아청소년 신경과",
		"id": "default893",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 신경과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 신경과"
			}
		]
	},
	{
		"name": "D소아청소년 신경외과",
		"id": "default894",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 신경외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 신경외과"
			}
		]
	},
	{
		"name": "D소아청소년 안과",
		"id": "default895",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 안과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 안과"
			}
		]
	},
	{
		"name": "D소아청소년 암센터",
		"id": "default896",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 암센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 암센터"
			}
		]
	},
	{
		"name": "D소아청소년 영상의학과",
		"id": "default897",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 영상의학과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 영상의학과"
			}
		]
	},
	{
		"name": "D소아청소년 일반과",
		"id": "default898",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 일반과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 일반과"
			}
		]
	},
	{
		"name": "D소아청소년 재활의학과",
		"id": "default899",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 재활의학과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 재활의학과"
			}
		]
	},
	{
		"name": "D소아청소년 정신건강의학과",
		"id": "default900",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 정신건강의학과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 정신건강의학과"
			}
		]
	},
	{
		"name": "D소아청소년 정형외과",
		"id": "default901",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 정형외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 정형외과"
			}
		]
	},
	{
		"name": "D소아청소년 종양혈액과",
		"id": "default902",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 종양혈액과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 종양혈액과"
			}
		]
	},
	{
		"name": "D소아청소년 중환자과",
		"id": "default903",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 중환자과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 중환자과"
			}
		]
	},
	{
		"name": "D소아청소년 호흡기알레르기과",
		"id": "default904",
		"filename": "default",
		"input": [
			{
				"intent": "소아청소년 호흡기알레르기과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아청소년 호흡기알레르기과"
			}
		]
	},
	{
		"name": "D스트레스심리상담센터",
		"id": "default905",
		"filename": "default",
		"input": [
			{
				"intent": "스트레스심리상담센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "스트레스심리상담센터"
			}
		]
	},
	{
		"name": "D신관 채혈실",
		"id": "default906",
		"filename": "default",
		"input": [
			{
				"intent": "신관 채혈실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관 채혈실"
			}
		]
	},
	{
		"name": "D아산기념전시실",
		"id": "default907",
		"filename": "default",
		"input": [
			{
				"intent": "아산기념전시실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "아산기념전시실"
			}
		]
	},
	{
		"name": "D어린이병원",
		"id": "default908",
		"filename": "default",
		"input": [
			{
				"intent": "어린이병원"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "어린이병원"
			}
		]
	},
	{
		"name": "D이비인후과",
		"id": "default909",
		"filename": "default",
		"input": [
			{
				"intent": "이비인후과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "이비인후과"
			}
		]
	},
	{
		"name": "D이비인후과 검사실",
		"id": "default910",
		"filename": "default",
		"input": [
			{
				"intent": "이비인후과 검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "이비인후과 검사실"
			}
		]
	},
	{
		"name": "D척추측만증센터",
		"id": "default911",
		"filename": "default",
		"input": [
			{
				"intent": "척추측만증센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "척추측만증센터"
			}
		]
	},
	{
		"name": "D태아치료센터",
		"id": "default912",
		"filename": "default",
		"input": [
			{
				"intent": "태아치료센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "태아치료센터"
			}
		]
	},
	{
		"name": "D골밀도검사실",
		"id": "default913",
		"filename": "default",
		"input": [
			{
				"intent": "골밀도검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "골밀도검사실"
			}
		]
	},
	{
		"name": "D교정과",
		"id": "default914",
		"filename": "default",
		"input": [
			{
				"intent": "교정과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "교정과"
			}
		]
	},
	{
		"name": "D구강악안면외과",
		"id": "default915",
		"filename": "default",
		"input": [
			{
				"intent": "구강악안면외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "구강악안면외과"
			}
		]
	},
	{
		"name": "D보존과",
		"id": "default916",
		"filename": "default",
		"input": [
			{
				"intent": "보존과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "보존과"
			}
		]
	},
	{
		"name": "D보철과",
		"id": "default917",
		"filename": "default",
		"input": [
			{
				"intent": "보철과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "보철과"
			}
		]
	},
	{
		"name": "D성형외과",
		"id": "default918",
		"filename": "default",
		"input": [
			{
				"intent": "성형외과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "성형외과"
			}
		]
	},
	{
		"name": "D소아진정치료실",
		"id": "default919",
		"filename": "default",
		"input": [
			{
				"intent": "소아진정치료실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아진정치료실"
			}
		]
	},
	{
		"name": "D소아치과",
		"id": "default920",
		"filename": "default",
		"input": [
			{
				"intent": "소아치과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아치과"
			}
		]
	},
	{
		"name": "D신관  CT실",
		"id": "default921",
		"filename": "default",
		"input": [
			{
				"intent": "신관 CT실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관 CT실"
			}
		]
	},
	{
		"name": "D신관 초음파실",
		"id": "default922",
		"filename": "default",
		"input": [
			{
				"intent": "신관 초음파실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관 초음파실"
			}
		]
	},
	{
		"name": "D신관 투시조영실",
		"id": "default923",
		"filename": "default",
		"input": [
			{
				"intent": "신관 투시조영실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관 투시조영실"
			}
		]
	},
	{
		"name": "D신관 핵의학 영상 검사실",
		"id": "default924",
		"filename": "default",
		"input": [
			{
				"intent": "신관 핵의학 영상 검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관 핵의학 영상 검사실"
			}
		]
	},
	{
		"name": "D안과",
		"id": "default925",
		"filename": "default",
		"input": [
			{
				"intent": "안과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "안과"
			}
		]
	},
	{
		"name": "D안과 검사실",
		"id": "default926",
		"filename": "default",
		"input": [
			{
				"intent": "안과검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "안과검사실"
			}
		]
	},
	{
		"name": "D엑시머라식클리닉",
		"id": "default927",
		"filename": "default",
		"input": [
			{
				"intent": "엑시머라식클리닉"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "엑시머라식클리닉"
			}
		]
	},
	{
		"name": "D임플란트센트",
		"id": "default928",
		"filename": "default",
		"input": [
			{
				"intent": "임플란트센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "임플란트센터"
			}
		]
	},
	{
		"name": "D치과",
		"id": "default929",
		"filename": "default",
		"input": [
			{
				"intent": "치과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "치과"
			}
		]
	},
	{
		"name": "D치주과",
		"id": "default930",
		"filename": "default",
		"input": [
			{
				"intent": "치주과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "치주과"
			}
		]
	},
	{
		"name": "D피부과",
		"id": "default931",
		"filename": "default",
		"input": [
			{
				"intent": "피부과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "피부과",
				"type": "Call"
			}
		]
	},
	{
		"name": "D당일수술센터",
		"id": "default932",
		"filename": "default",
		"input": [
			{
				"intent": "당일수술센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "당일수술센터"
			}
		]
	},
	{
		"name": "D선천성심장병센터",
		"id": "default933",
		"filename": "default",
		"input": [
			{
				"intent": "선천성심장병센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "선천성심장병센터"
			}
		]
	},
	{
		"name": "D소아중환자실",
		"id": "default934",
		"filename": "default",
		"input": [
			{
				"intent": "소아중환자실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소아중환자실"
			}
		]
	},
	{
		"name": "D신관 수술실",
		"id": "default935",
		"filename": "default",
		"input": [
			{
				"intent": "신관 수술실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관 수술실"
			}
		]
	},
	{
		"name": "D신관 주사실",
		"id": "default936",
		"filename": "default",
		"input": [
			{
				"intent": "신관 주사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관 주사실"
			}
		]
	},
	{
		"name": "D통증클리닉",
		"id": "default937",
		"filename": "default",
		"input": [
			{
				"intent": "통증클리닉"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "통증클리닉"
			}
		]
	},
	{
		"name": "D건강증진센터",
		"id": "default938",
		"filename": "default",
		"input": [
			{
				"intent": "건강증진센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "건강증진센터"
			}
		]
	},
	{
		"name": "D국제진료센터",
		"id": "default939",
		"filename": "default",
		"input": [
			{
				"intent": "국제진료센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "국제진료센터"
			}
		]
	},
	{
		"name": "D분만장",
		"id": "default940",
		"filename": "default",
		"input": [
			{
				"intent": "분만장"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "분만장"
			}
		]
	},
	{
		"name": "D생식의학 및 불임클리닉",
		"id": "default941",
		"filename": "default",
		"input": [
			{
				"intent": "생식의학 및 불임클리닉"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "생식의학 및 불임클리닉"
			}
		]
	},
	{
		"name": "D신생아실",
		"id": "default942",
		"filename": "default",
		"input": [
			{
				"intent": "신생아실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신생아실"
			}
		]
	},
	{
		"name": "D신생아중환자실1",
		"id": "default943",
		"filename": "default",
		"input": [
			{
				"intent": "신생아중환자실1"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신생아중환자실1"
			}
		]
	},
	{
		"name": "D신생아중환자실2",
		"id": "default944",
		"filename": "default",
		"input": [
			{
				"intent": "신생아중환자실2"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신생아중환자실2"
			}
		]
	},
	{
		"name": "DR신생아중환자실",
		"id": "default945",
		"filename": "default",
		"input": [
			{
				"intent": "신생아 중환자실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신생아 중환자실"
			}
		]
	},
	{
		"name": "D체외수정실",
		"id": "default946",
		"filename": "default",
		"input": [
			{
				"intent": "체외수정실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "체외수정실"
			}
		]
	},
	{
		"name": "D중동환자 기도실",
		"id": "default947",
		"filename": "default",
		"input": [
			{
				"intent": "중동환자 기도실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "중동환자 기도실"
			}
		]
	},
	{
		"name": "DRPET검사실",
		"id": "default948",
		"filename": "default",
		"input": [
			{
				"text": "PET 검 사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "PET검사실"
			}
		]
	},
	{
		"name": "DR강당",
		"id": "default950",
		"filename": "default",
		"input": [
			{
				"text": "강당"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "강당"
			}
		]
	},
	{
		"name": "DR수술실",
		"id": "default951",
		"filename": "default",
		"input": [
			{
				"text": "수술실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "수술실"
			}
		]
	},
	{
		"name": "DR촬영실",
		"id": "default952",
		"filename": "default",
		"input": [
			{
				"text": "촬영 실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "촬영실"
			}
		]
	},
	{
		"name": "DR주사실",
		"id": "default953",
		"filename": "default",
		"input": [
			{
				"text": "주사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "주사실"
			}
		]
	},
	{
		"name": "DR중환자실",
		"id": "default954",
		"filename": "default",
		"input": [
			{
				"text": "중환자실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "중환자실"
			}
		]
	},
	{
		"name": "DR체혈실",
		"id": "default955",
		"filename": "default",
		"input": [
			{
				"text": "체혈실"
			},
			{
				"text": "채혈 실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "채혈실"
			}
		]
	},
	{
		"name": "DR처음 오신 분 창구",
		"id": "default956",
		"filename": "default",
		"input": [
			{
				"intent": "처음오신 분"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "처음 오신 분 창구"
			}
		]
	},
	{
		"name": "DR초음파실",
		"id": "default957",
		"filename": "default",
		"input": [
			{
				"text": "초음파 실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "초음파실"
			}
		]
	},
	{
		"name": "DR투시조영실",
		"id": "default958",
		"filename": "default",
		"input": [
			{
				"text": "투시 조 영실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "투시조영실"
			}
		]
	},
	{
		"name": "DR핵의학 검사실",
		"id": "default959",
		"filename": "default",
		"input": [
			{
				"text": "핵의학 검 사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "핵의학 검사실"
			}
		]
	},
	{
		"name": "D예약방법",
		"id": "default960",
		"filename": "default",
		"input": [
			{
				"intent": "예약 방법"
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
		"name": "D예약 업무 시간",
		"id": "default961",
		"filename": "default",
		"input": [
			{
				"intent": "예약 업무 시간"
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
		"name": "D필요 서류",
		"id": "default962",
		"filename": "default",
		"input": [
			{
				"intent": "필요 서류"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "필요 서류"
			}
		]
	},
	{
		"name": "DR예약",
		"id": "default963",
		"filename": "default",
		"input": [
			{
				"text": "외래 예약"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R예약"
			}
		]
	},
	{
		"name": "D외래 진료 시간",
		"id": "default964",
		"filename": "default",
		"input": [
			{
				"intent": "외래 진료 시간"
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
		"name": "D외래 - 처음오신분",
		"id": "default965",
		"filename": "default",
		"input": [
			{
				"text": "외래 진료 처음"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "처음 오신 분"
			}
		]
	},
	{
		"name": "D외래 - 진료받은적이 있는 분",
		"id": "default966",
		"filename": "default",
		"input": [
			{
				"intent": "진료 받은적이 있는 분"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "진료 받은 적이 있는 분"
			}
		]
	},
	{
		"name": "D증명서B",
		"id": "default1134",
		"filename": "default",
		"input": [
			{
				"intent": "증명서B"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "증명서B"
			}
		]
	},
	{
		"name": "DR외래 진료 절차 단계",
		"id": "default967",
		"filename": "default",
		"input": [
			{
				"text": "외래 진료 절차"
			},
			{
				"text": "외래 진료 단계"
			},
			{
				"intent": "진료 절차 단계"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "진료 절차 단계"
			}
		]
	},
	{
		"name": "DR외래 진료",
		"id": "default968",
		"filename": "default",
		"input": [
			{
				"text": "외래 진료"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R진료"
			}
		]
	},
	{
		"name": "D선택진료비",
		"id": "default969",
		"filename": "default",
		"input": [
			{
				"intent": "선택진료비"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "선택진료비"
			}
		]
	},
	{
		"name": "D선택진료",
		"id": "default970",
		"filename": "default",
		"input": [
			{
				"intent": "선택 진료"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "선택 진료"
			}
		]
	},
	{
		"name": "D보험 적용",
		"id": "default971",
		"filename": "default",
		"input": [
			{
				"intent": "보험 적용"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "보험 적용"
			}
		]
	},
	{
		"name": "D응급 - 진료절차",
		"id": "default972",
		"filename": "default",
		"input": [
			{
				"intent": "응급 진료 -진료절차"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "진료 절차"
			}
		]
	},
	{
		"name": "D응급진료 - 보험 혜택 안내",
		"id": "default973",
		"filename": "default",
		"input": [
			{
				"intent": "응급 진료 - 보험혜택안내"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "보험 혜택 안내"
			}
		]
	},
	{
		"name": "D전원 신청방법",
		"id": "default975",
		"filename": "default",
		"input": [
			{
				"intent": "전원 신청 방법"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "전원 신청방법"
			}
		]
	},
	{
		"name": "D가정간호 정의 및 목적",
		"id": "default976",
		"filename": "default",
		"input": [
			{
				"intent": "가정간호 - 정의 및 목적"
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
		"name": "D가정간호 대상",
		"id": "default977",
		"filename": "default",
		"input": [
			{
				"text": "가정 간호 대상"
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
		"name": "D가정간호 내용",
		"id": "default978",
		"filename": "default",
		"input": [
			{
				"text": "가정 간호 내용"
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
		"name": "D가정간호 신청 방법",
		"id": "default979",
		"filename": "default",
		"input": [
			{
				"intent": "가정간호 신청 방법"
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
		"name": "D가정간호 비용",
		"id": "default980",
		"filename": "default",
		"input": [
			{
				"intent": "가정간호 비용"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "가정간호 비용"
			}
		]
	},
	{
		"name": "D가정간호 상담",
		"id": "default981",
		"filename": "default",
		"input": [
			{
				"intent": "가정간호 상담"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "가정간호 상담"
			}
		]
	},
	{
		"name": "D입원결정",
		"id": "default983",
		"filename": "default",
		"input": [
			{
				"intent": "입원 결정"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원결정"
			}
		]
	},
	{
		"name": "D입원 예약 방법",
		"id": "default984",
		"filename": "default",
		"input": [
			{
				"intent": "입원 예약 방법"
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
		"name": "D입원예정일",
		"id": "default985",
		"filename": "default",
		"input": [
			{
				"intent": "입원예정일"
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
		"name": "D병실배정안내",
		"id": "default986",
		"filename": "default",
		"input": [
			{
				"intent": "병실 배정"
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
		"name": "D기준병실 확대 운영",
		"id": "default987",
		"filename": "default",
		"input": [
			{
				"intent": "기준병실 확대 운영"
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
		"name": "D입원 수속 절차",
		"id": "default988",
		"filename": "default",
		"input": [
			{
				"intent": "입원수속절차"
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
		"name": "D입원 약정서 작성 요령",
		"id": "default989",
		"filename": "default",
		"input": [
			{
				"intent": "입원약정서 작성요령"
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
		"name": "D입원 문의처",
		"id": "default990",
		"filename": "default",
		"input": [
			{
				"intent": "입원 문의처"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원 문의처"
			}
		]
	},
	{
		"name": "DR입원 예약 및 수속",
		"id": "default991",
		"filename": "default",
		"input": [
			{
				"intent": "입원 예약 및 수속"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원 예약 및 수속"
			}
		]
	},
	{
		"name": "D입원생활 출입",
		"id": "default992",
		"filename": "default",
		"input": [
			{
				"intent": "입원 생활 - 출입"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원생활 - 출입"
			}
		]
	},
	{
		"name": "D입원생활 - 병문안",
		"id": "default993",
		"filename": "default",
		"input": [
			{
				"intent": "입원 생활 - 병문안 시간, 준수수칙"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원생활 - 병문안"
			}
		]
	},
	{
		"name": "D입원생활 - 보호자 안내",
		"id": "default994",
		"filename": "default",
		"input": [
			{
				"intent": "입원 생활 - 보호자 안내"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원 생활 - 보호자 안내"
			}
		]
	},
	{
		"name": "D입원생활 - 식이 변경",
		"id": "default995",
		"filename": "default",
		"input": [
			{
				"intent": "입원 생활 - 식이 변경"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원 생활 - 식이 변경"
			}
		]
	},
	{
		"name": "D입원생활 - 식판 수거",
		"id": "default996",
		"filename": "default",
		"input": [
			{
				"intent": "입원 생활 -식판 수거"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원 생활 - 식판 수거"
			}
		]
	},
	{
		"name": "D입원생활 - 보호자석 이용안내",
		"id": "default997",
		"filename": "default",
		"input": [
			{
				"intent": "입원 생활 - 보호자석 이용 안내"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "직원식당, 보호자식당"
			}
		]
	},
	{
		"name": "D입원생활 - 냉장고 이용안내",
		"id": "default998",
		"filename": "default",
		"input": [
			{
				"intent": "입원 생활 - 냉장고 이용 안내"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원 생활 - 냉장고 이용안내"
			}
		]
	},
	{
		"name": "D입원생활 - 회진",
		"id": "default999",
		"filename": "default",
		"input": [
			{
				"intent": "입원안내 - 회진"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원안내 - 회진"
			}
		]
	},
	{
		"name": "D입원생활 - 간호사 호출방법",
		"id": "default1000",
		"filename": "default",
		"input": [
			{
				"intent": "입원 생활 - 간호사 호출방법"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원 생활 - 간호사 호출방법"
			}
		]
	},
	{
		"name": "D입원비",
		"id": "default1079",
		"filename": "default",
		"input": [
			{
				"intent": "입원비"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원비"
			}
		]
	},
	{
		"name": "D입원 준비물품",
		"id": "default1001",
		"filename": "default",
		"input": [
			{
				"intent": "입원 준비물품"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원 준비물품"
			}
		]
	},
	{
		"name": "D병실 내 창문/방충망",
		"id": "default1002",
		"filename": "default",
		"input": [
			{
				"intent": "병실내 창문/방충망"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "병실내 창문/방충망"
			}
		]
	},
	{
		"name": "D입원시 지참약관리",
		"id": "default1003",
		"filename": "default",
		"input": [
			{
				"intent": "입원시  지참약관리"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원시 지참약관리"
			}
		]
	},
	{
		"name": "D환자 팔찌 착용안내",
		"id": "default1004",
		"filename": "default",
		"input": [
			{
				"intent": "환자 팔찌 착용안내"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "환자 팔찌 착용안내"
			}
		]
	},
	{
		"name": "Dwifi",
		"id": "default1005",
		"filename": "default",
		"input": [
			{
				"intent": "wifi"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "wifi"
			}
		]
	},
	{
		"name": "D시트",
		"id": "default1006",
		"filename": "default",
		"input": [
			{
				"intent": "시트"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "시트"
			}
		]
	},
	{
		"name": "D담요",
		"id": "default1007",
		"filename": "default",
		"input": [
			{
				"intent": "담요"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "담요"
			}
		]
	},
	{
		"name": "D흡연",
		"id": "default1008",
		"filename": "default",
		"input": [
			{
				"intent": "흡연"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "흡연"
			}
		]
	},
	{
		"name": "D오물실",
		"id": "default1009",
		"filename": "default",
		"input": [
			{
				"intent": "오물실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "오물실"
			}
		]
	},
	{
		"name": "D다용도실",
		"id": "default1010",
		"filename": "default",
		"input": [
			{
				"intent": "다용도실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "다용도실"
			}
		]
	},
	{
		"name": "D샤워실",
		"id": "default1011",
		"filename": "default",
		"input": [
			{
				"intent": "샤워실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "샤워실"
			}
		]
	},
	{
		"name": "D휴게실",
		"id": "default1012",
		"filename": "default",
		"input": [
			{
				"intent": "휴게실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "휴게실"
			}
		]
	},
	{
		"name": "D간병인 신청 - 요금",
		"id": "default1013",
		"filename": "default",
		"input": [
			{
				"intent": "간병인 신청 - 요금"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "간병인 신청 - 요금"
			}
		]
	},
	{
		"name": "D간병인 신청 - 전화번호",
		"id": "default1014",
		"filename": "default",
		"input": [
			{
				"intent": "간병인 신청 - 전화번호"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "간병인 신청 - 전화번호"
			}
		]
	},
	{
		"name": "DR간병인 신청",
		"id": "default1015",
		"filename": "default",
		"input": [
			{
				"text": "간병인"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "간병인 신청"
			}
		]
	},
	{
		"name": "DR불만 및 고충사항",
		"id": "default1019",
		"filename": "default",
		"input": [
			{
				"intent": "불만 및 고충사항"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "불만 및 고충사항"
			}
		]
	},
	{
		"name": "D불만 및 고충사항 - 상담안내",
		"id": "default1016",
		"filename": "default",
		"input": [
			{
				"intent": "불만 및 고충사항 - 상담안내"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "불만 및 고충사항 - 상담안내"
			}
		]
	},
	{
		"name": "D불만 및 고충사항 - 상담방법",
		"id": "default1017",
		"filename": "default",
		"input": [
			{
				"intent": "불만 및 고충사항 - 상담방법"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "불만 및 고충사항 - 상담방법"
			}
		]
	},
	{
		"name": "D불만 및 고충사항 - 처리절차",
		"id": "default1018",
		"filename": "default",
		"input": [
			{
				"intent": "불만 및 고충사항 - 처리절차"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "불만 및 고충사항 - 처리절차"
			}
		]
	},
	{
		"name": "D발급가능 내용",
		"id": "default1020",
		"filename": "default",
		"input": [
			{
				"intent": "발급가능 내용"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "발급가능 내용"
			}
		]
	},
	{
		"name": "건강검진안내",
		"id": "default546",
		"filename": "default",
		"input": [
			{
				"text": "건강검진 안내"
			},
			{
				"text": "5"
			},
			{
				"text": "건강검진"
			},
			{
				"text": "건지다"
			}
		],
		"output": [
			{
				"text": "건강검진 관련한 안내를 해드릴께요.\n\n다음 중 궁금하신 사항을 선택해주세요.\n\n1. 건강검진예약 및 결과문의\n2. 예약일 확인\n3. 결과 상담일 확인\n4. 건강검진 기록지 발급방법",
				"buttons": [
					{
						"text": "건강검진예약 및 결과문의"
					},
					{
						"text": "예약일 확인"
					},
					{
						"text": "결과 상담일 확인"
					},
					{
						"text": "건강검진 기록지 발급방법"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				],
				"kind": "Content"
			}
		],
		"children": [
			{
				"name": "건강검진예약 및 결과문의",
				"id": "default547",
				"filename": "default",
				"input": [
					{
						"text": "건강검진 예약 및 결과 문의"
					},
					{
						"text": "1"
					}
				],
				"output": [
					{
						"text": "건강강검진 예약 및 결과 문의 전화번호입니다.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에따라 2번→1번을 순차적으로 누르시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "예약일 확인",
				"id": "default549",
				"filename": "default",
				"input": [
					{
						"text": "예약 일 확인"
					},
					{
						"text": "2"
					}
				],
				"output": [
					{
						"text": "건강검진 예약일자 확인 전화번호입니다.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에따라 2번→2번을 순차적으로 누르시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "결과 상담일 확인",
				"id": "default550",
				"filename": "default",
				"input": [
					{
						"text": "결과 상담 일 확인"
					}
				],
				"output": [
					{
						"text": "건강강검진 결과 상담일 확인 전화번호입니다\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에따라 2번→1번을 순차적으로 누르시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "건강검진 기록지 발급방법",
				"id": "default1151",
				"filename": "default",
				"input": [
					{
						"text": "건강검진 기록 발급 방법"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "의무기록 발급 절차"
					}
				]
			}
		],
		"buttons": [
			{
				"text": "건강검진예약 및 결과문의"
			},
			{
				"text": "예약일 확인"
			},
			{
				"text": "결과 상담일 확인"
			},
			{
				"text": "건강검진 기록지 발급방법"
			},
			{
				"text": "처음"
			},
			{
				"text": "이전"
			}
		]
	},
	{
		"name": "D의무기록 발급 절차",
		"id": "default1021",
		"filename": "default",
		"input": [
			{
				"intent": "의무기록 발급 절차"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "의무기록 발급 절차"
			}
		]
	},
	{
		"name": "D서류발급 - 준비물",
		"id": "default1022",
		"filename": "default",
		"input": [
			{
				"intent": "서류 발급 - 준비물"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서류발급 - 준비물"
			}
		]
	},
	{
		"name": "D증명서 발급위치",
		"id": "default1130",
		"filename": "default",
		"input": [
			{
				"intent": "증명서 발급위치"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "증명서 발급위치"
			}
		]
	},
	{
		"name": "D서류발급 - 가능서류",
		"id": "default1024",
		"filename": "default",
		"input": [
			{
				"intent": "서류 발급 - 가능서류"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "서류발급 - 가능서류"
			}
		]
	},
	{
		"name": "D건강검진예약 및 결과문의",
		"id": "default1025",
		"filename": "default",
		"input": [
			{
				"intent": "건강검진예약 및 결과문의"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "건강검진 예약 및 결과문의"
			}
		]
	},
	{
		"name": "D건강검진 - 예약일 확인",
		"id": "default1026",
		"filename": "default",
		"input": [
			{
				"text": "건강검진 예약 일 확인"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "예약일 확인"
			}
		]
	},
	{
		"name": "D건강검진 - 결과 상담일 확인",
		"id": "default1027",
		"filename": "default",
		"input": [
			{
				"intent": "결과 상담일 확인"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "결과 상담일 확인",
				"type": "Call"
			}
		]
	},
	{
		"name": "D교통",
		"id": "default1029",
		"filename": "default",
		"input": [
			{
				"intent": "교통안내"
			}
		],
		"output": [
			{
				"text": "어떤 교통편을 이용하시나요?\n선택하시면 오시는 법을 안내해드릴께요",
				"buttons": [
					{
						"text": "버스"
					},
					{
						"text": "지하철"
					},
					{
						"text": "자가용"
					},
					{
						"text": "공항"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				],
				"kind": "Content"
			}
		],
		"children": [
			{
				"name": "D교통 - 버스",
				"id": "default1031",
				"filename": "default",
				"input": [
					{
						"text": "버스"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "R버스"
					}
				]
			},
			{
				"name": "D교통 - 지하철",
				"id": "default1032",
				"filename": "default",
				"input": [
					{
						"text": "지하철"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "지하철"
					}
				]
			},
			{
				"name": "D교통 - 자가용",
				"id": "default1033",
				"filename": "default",
				"input": [
					{
						"text": "자가용"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "자가용"
					}
				]
			},
			{
				"name": "D교통 - 공항",
				"id": "default1034",
				"filename": "default",
				"input": [
					{
						"text": "공항"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "항공"
					}
				]
			}
		],
		"buttons": [
			{
				"text": "버스"
			},
			{
				"text": "지하철"
			},
			{
				"text": "자가용"
			},
			{
				"text": "공항"
			},
			{
				"text": "처음"
			},
			{
				"text": "이전"
			}
		]
	},
	{
		"name": "D응급의학과",
		"id": "default1037",
		"filename": "default",
		"input": [
			{
				"intent": "응급의학과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "응급의학과"
			}
		]
	},
	{
		"name": "DR영상의학과",
		"id": "default1047",
		"filename": "default",
		"input": [
			{
				"text": "영상의학"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R영상의학과"
			}
		]
	},
	{
		"name": "D중증외상팀",
		"id": "default1051",
		"filename": "default",
		"input": [
			{
				"intent": "중증외상팀"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "중증외상팀"
			}
		]
	},
	{
		"name": "D소화관기능검사",
		"id": "default1053",
		"filename": "default",
		"input": [
			{
				"intent": "소화관기능검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소화관기능검사실"
			}
		]
	},
	{
		"name": "D소화기내시경센터",
		"id": "default1065",
		"filename": "default",
		"input": [
			{
				"intent": "소화기내시경센터"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "소화기내시경센터"
			}
		]
	},
	{
		"name": "D가정간호",
		"id": "default1068",
		"filename": "default",
		"input": [
			{
				"intent": "가정간호"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "in3. R가정간호"
			}
		]
	},
	{
		"name": "D종교시설",
		"id": "default1074",
		"filename": "default",
		"input": [
			{
				"intent": "종교시설"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "종교시설"
			}
		]
	},
	{
		"name": "D의무기록/영상사본 발급처",
		"id": "default1085",
		"filename": "default",
		"input": [
			{
				"intent": "의무기록/영상사본발급"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "R의무기록/영상사본"
			}
		]
	},
	{
		"name": "D중간계산서",
		"id": "default1086",
		"filename": "default",
		"input": [
			{
				"intent": "중간계산서"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "중간계산서"
			}
		]
	},
	{
		"name": "D무통장입금",
		"id": "default1089",
		"filename": "default",
		"input": [
			{
				"intent": "무통장 입금"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "무통장입금"
			}
		]
	},
	{
		"name": "D퇴원",
		"id": "default1090",
		"filename": "default",
		"input": [
			{
				"intent": "퇴원"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "퇴원"
			}
		]
	},
	{
		"name": "D식사",
		"id": "default1098",
		"filename": "default",
		"input": [
			{
				"intent": "식사"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "식사"
			}
		]
	},
	{
		"name": "D산정특례",
		"id": "default1103",
		"filename": "default",
		"input": [
			{
				"intent": "산정 특례 정의 및 혜택"
			},
			{
				"intent": "산정특례 신청방법"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "산정특례 정의 및 혜택"
			}
		]
	},
	{
		"name": "D가정간호 가능 지역",
		"id": "default1104",
		"filename": "default",
		"input": [
			{
				"intent": "가정간호 가능 지역"
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
		"name": "D대장항문클리닉",
		"id": "default1107",
		"filename": "default",
		"input": [
			{
				"intent": "대장항문클리닉"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "대장항문클리닉"
			}
		]
	},
	{
		"name": "D감염내과",
		"id": "default1109",
		"filename": "default",
		"input": [
			{
				"intent": "감염내과"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "감염내과"
			}
		]
	},
	{
		"name": "D입원 생활 - 식사시간",
		"id": "default1119",
		"filename": "default",
		"input": [
			{
				"intent": "식사시간"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "입원 생활 - 식사 시간"
			}
		]
	},
	{
		"name": "D신관 MR실(2층)",
		"id": "default1122",
		"filename": "default",
		"input": [
			{
				"intent": "신관 MR실(2층)"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "신관 MR실(2층)"
			}
		]
	},
	{
		"name": "DPET 검사실",
		"id": "default1123",
		"filename": "default",
		"input": [
			{
				"intent": "PET검사실"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "DRPET검사실"
			}
		]
	},
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "1"
			},
			{
				"text": "교통 및 주차 안내"
			},
			{
				"text": "일"
			}
		],
		"output": [
			{
				"text": "아산병원 교통 및 주차 안내를 원하시는군요!\n원하시는 정보를 입력해주세요.\n\n예) 지하철로 가는 방법, 주차 안내\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
				"kind": "Text"
			}
		],
		"name": "교통 및 주차 안내",
		"children": [
			{
				"name": "순환(셔틀)버스",
				"id": "default22",
				"filename": "default",
				"input": [
					{
						"intent": "셔틀"
					}
				],
				"output": {
					"text": "셔틀버스 이용 안내입니다.\n\n당일 외래진료예약자 및 그 보호자, 병원직원, 자원봉사자를 위한 순환버스입니다.\n장례식장 이용, 일반용무 등으로 오신 분은 이용이 불가하니 양해 부탁드립니다.\n\n■ 운행코스: 동관 후문 버스정류장 잠실나루역 1번출구 앞 왕복운행 \n\n■ 운행시간: 평일 8:30 ~ 17:00(약 10분 간격) \n • 중식시간 운행 11:10, 11:30, 11:45, 12:00, 12:15, 12:30, 12:50 \n • 토요일, 일요일, 공휴일은 운행하지 않습니다.\n\n■ 탑승장소: 아래의 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505969592674.jpg",
						"displayname": "location_img02.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/images/infor/location_img02.jpg"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "셔틀버스 이용 안내입니다.\n\n당일 외래진료예약자 및 그 보호자, 병원직원, 자원봉사자를 위한 순환버스입니다.\n장례식장 이용, 일반용무 등으로 오신 분은 이용이 불가하니 양해 부탁드립니다.\n\n■ 운행코스: 동관 후문 버스정류장 잠실나루역 1번출구 앞 왕복운행 \n\n■ 운행시간: 평일 8:30 ~ 17:00(약 10분 간격) \n • 중식시간 운행 11:10, 11:30, 11:45, 12:00, 12:15, 12:30, 12:50 \n • 토요일, 일요일, 공휴일은 운행하지 않습니다.\n\n■ 탑승장소: 아래의 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505969592674.jpg",
						"displayname": "location_img02.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/images/infor/location_img02.jpg"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/images/infor/location_img02.jpg"
					}
				]
			},
			{
				"name": "지하철",
				"id": "default23",
				"filename": "default",
				"input": [
					{
						"intent": "지하철"
					}
				],
				"output": {
					"text": "지하철로 오시는 길\n\n■ 잠실나루역:\n1번 출구 → 순환버스 또는 도보(10분)로 이동\n3번 출구 → 4318 버스 승차 → 하차(서울아산병원 동관)\n\n■ 잠실역:\n7번 출구 → 4318 버스 승차 → 하차(서울아산병원 동관)\n\n■ 천호역:\n9번 출구 → 4318 버스 승차 또는 112-5 버스 승차 → 하차(서울아산병원 동관)\n\n■ 강동역:\n1번 출구 → 112-5 버스 승차 → 하차(서울아산병원 동관)\n\n■ 강동구청역:\n5번 출구 → 112-5 버스 승차 → 하차(서울아산병원 동관)\n\n■ 몽촌토성역:\n1번 출구 → 4318 버스 승차 → 하차(서울아산병원 동관)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "시내버스",
				"id": "default24",
				"filename": "default",
				"input": [
					{
						"intent": "시내 버스"
					}
				],
				"output": {
					"text": "시내버스 타고 오시는 길\n\n■ 4318번:\n서울아산병원 동관 하차 (사당역 ↔ 서울아산병원)\n\n■ 112-5번:\n서울아산병원 동관 하차 (한솔아파트 ↔ 서울아산병원)\n\n■ 97번:\n서울아산병원 동관 하차 (남양주 호평동 ↔ 강변역 ↔ 서울아산병원)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "고속버스",
				"id": "default26",
				"filename": "default",
				"input": [
					{
						"intent": "고속버스"
					}
				],
				"output": {
					"text": "고속버스로 오시는 길\n\n■ 동서울종합터미널:\n97 버스 승차(강변역A) → 하차(서울아산병원 동관)\n\n■ 고속터미널:\n고속터미널역 승차 → 교대역 환승 → 잠실나루역 하차\n→ 순환버스 또는 도보(10분), 4318 버스 이동\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "R버스",
				"id": "default241",
				"filename": "default",
				"input": [
					{
						"intent": "버스"
					}
				],
				"output": {
					"text": "버스를 타고 오시는군요!\n\n타고오실 버스를 선택해주세요.\n\n1. 셔틀버스\n2. 시내버스\n3. 고속버스",
					"buttons": [
						{
							"text": "셔틀버스"
						},
						{
							"text": "시내버스"
						},
						{
							"text": "고속버스"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "셔틀버스2",
						"id": "default248",
						"filename": "default",
						"input": [
							{
								"text": "셔틀버스"
							},
							{
								"text": "1"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "순환(셔틀)버스"
							}
						]
					},
					{
						"name": "시내버스2",
						"id": "default247",
						"filename": "default",
						"input": [
							{
								"text": "시내버스"
							},
							{
								"text": "2"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "시내버스"
							}
						]
					},
					{
						"name": "고속버스2",
						"id": "default246",
						"filename": "default",
						"input": [
							{
								"text": "고속버스"
							},
							{
								"text": "3"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "고속버스"
							}
						]
					}
				],
				"task": {
					"text": "버스를 타고 오시는군요!\n\n타고오실 버스를 선택해주세요.\n\n1. 셔틀버스\n2. 시내버스\n3. 고속버스",
					"buttons": [
						{
							"text": "셔틀버스"
						},
						{
							"text": "시내버스"
						},
						{
							"text": "고속버스"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "셔틀버스"
					},
					{
						"text": "시내버스"
					},
					{
						"text": "고속버스"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
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
					"text": "공항에서 오시는 길\n\n■ 인천국제공항:\n6705 버스 승차(인천국제공항4A.5B.6A.6B) → 하차(잠실롯데월드) → 잠실역 7번 출구(도보 7분) → 4318 버스 승차 → 하차(서울아산병원 동관) \n\n■ 김포공항:\n6706 버스 승차(김포공항국제선) → 하차(잠실롯데월드) → 잠실역 7번 출구(도보 7분) → 4318 버스 승차 → 하차(서울아산병원 동관)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "기차",
				"id": "default27",
				"filename": "default",
				"input": [
					{
						"intent": "기차"
					}
				],
				"output": {
					"text": "기차타고 오시는 길\n\n■ 서울역:\n서울역 승차 → 동대문역사문화공원역 환승 → 잠실나루역 하차\n→ 순환버스 또는 도보(10분), 4318 버스 이동\n\n■ 수서역SRT:\n2412 버스 승차(수서역 5번 출구) → 하차(잠실역) → 잠실역 7번 출구(도보 2분) → 4318 버스 승차 → 하차(서울아산병원 동관)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "자가용",
				"id": "default31",
				"filename": "default",
				"input": [
					{
						"intent": "자가용"
					}
				],
				"output": {
					"text": "자가용으로 오시는군요!\n\n주소는 다음과 같아요.\n서울특별시 송파구 올림픽로43길 88 (풍납2동 388-1)\n\n주차 안내를 원하시면 \"주차\"라고 입력해주세요:)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
							},
							{
								"intent": "주차"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "R주차"
							}
						]
					}
				],
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "주차장 위치",
				"id": "default42",
				"filename": "default",
				"input": [
					{
						"intent": "주차장 위치"
					}
				],
				"output": {
					"text": "주차장은 야외 중앙주차장, 신관 지하 주차장, 후문 주차장, 풍납유수지 공영주차장이 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505969747617.jpg",
						"displayname": "img_parking01.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/images/infor/img_parking01.jpg"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "주차장은 야외 중앙주차장, 신관 지하 주차장, 후문 주차장, 풍납유수지 공영주차장이 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505969747617.jpg",
						"displayname": "img_parking01.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/images/infor/img_parking01.jpg"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/images/infor/img_parking01.jpg"
					}
				]
			},
			{
				"name": "주차장 이용 방식",
				"id": "default43",
				"filename": "default",
				"input": [
					{
						"intent": "주차장 이용 방식"
					}
				],
				"output": {
					"text": "사전무인정산소에서 정산하신 후 출차하여 주십시오.(진료 및 무료주차 차량도 포함) 정산 후 20분 이내에 출차하여 주십시오.(초과시 요금 부과 됨)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "주차 이용 가능 시간",
				"id": "default44",
				"filename": "default",
				"input": [
					{
						"intent": "주차 이용 가능 시간"
					}
				],
				"output": {
					"text": "주차장은 24시간 이용가능합니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "주차장 규모",
				"id": "default45",
				"filename": "default",
				"input": [
					{
						"intent": "주차장 규모"
					}
				],
				"output": {
					"text": "총 2,565대 주차 가능합니다. \n- 중앙주차장: 953대\n- 신관 지하주차장(B1~B5): 1,276대\n- 후문 주차장: 102대\n- 풍납유수지 공영주차장: 234대\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "주차요금",
				"id": "default46",
				"filename": "default",
				"input": [
					{
						"intent": "주차요금"
					}
				],
				"output": {
					"text": "주차 요금에 대해서 알려 드리겠습니다. \n\n주차 요금은 주간, 야간 및 방문 목적에 따라 달라집니다. \n자세한 사항은 아래를 참고해 주세요. \n\n■ 주간 (오전 6시~오후 10시)\n - 입차 후 30분 무료\n - 30분 초과 시 10분 당 500원\n - 1일 최대 요금: 입원환자 및 보호자 10,000원 / 일반 내원객 20,000원\n\n■ 야간(오후 10시~오전 6시)\n - 입차 후 30분 무료\n - 일괄 1,000원\n\n■ 외래 진료일 및 입/퇴원일 환자, 수술일 환자(시술제외), 종합건진 수검자\n - 당일 1회 무료\n - 진료카드 또는 영수증 제시 필요\n\n■ 응급실 환자\n - 당일 입차 후 24시간(1회) 무료\n - 진료카드 또는 영수증 제시 필요\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "무료 및 할인 주차 정보",
				"id": "default47",
				"filename": "default",
				"input": [
					{
						"intent": "무료 및 할인 주차 정보"
					}
				],
				"output": {
					"text": "■ 외래 진료일 및 입/퇴원일 환자, 수술일 환자(시술제외), 종합건진 수검자\n - 당일 1회 무료\n - 사전무인정산기에 차량번호 입력 후 진료카드 투입 및 병원등록번호 입력\n\n■ 응급실 환자\n - 당일 입차 후 24시간(1회) 무료\n - 사전무인정산기에 차량번호 입력 후 진료카드 투입 및 병원등록번호 입력\n\n■국가 유공자, 장애인\n - 주차 요금 50% 감면 (단, 정산 시 등록카드 제시자에 한함)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Content"
				},
				"task": {
					"kind": "Content"
				}
			},
			{
				"name": "기간권 정보",
				"id": "default48",
				"filename": "default",
				"input": [
					{
						"intent": "기간권 정보"
					}
				],
				"output": {
					"text": "입차 후 수시 입/출차가 필요한 경우 기간권 구입 후 이용 가능합니다.\n\n- 이용 가능 시간: 입차 후 24시간\n- 비용: 10,000원\n- 등록 방법: 자량번호 기간권 등록\n- 등록처: 신관/공영/후문 주차장, 출구정산소중앙주차장, 동관/신관 1층 현관안내\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "R주차",
				"id": "default32",
				"filename": "default",
				"input": [
					{
						"intent": "주차"
					}
				],
				"output": {
					"text": "주차안내를 해드릴께요.\n\n원하시는 정보의 번호를 입력해주세요.\n\n1. 주차장 위치\n2. 주차장 이용방식\n3. 주차 이용 가능시간\n4. 주차장 규모\n5. 주차 요금\n6. 무료 및 할인 주차 정보\n7. 기간권 정보\n\n처음으로 돌아가시려면 '처음'을, 이전 단계로 돌아가고 싶으시면 '이전'이라고 입력해주세요.",
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
				],
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "교통안내",
				"id": "default1030",
				"filename": "default",
				"input": [
					{
						"intent": "교통안내"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "D교통",
						"type": "Call"
					}
				]
			},
			{
				"name": "별관 편의점",
				"id": "default257",
				"filename": "default",
				"input": [
					{
						"intent": "별관 편의점"
					}
				],
				"output": [
					{
						"text": "별관 편의점은 별관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505963558825.jpg",
							"displayname": "f-101-1.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021649"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021649"
					}
				]
			},
			{
				"name": "동관편의점",
				"id": "default102",
				"filename": "default",
				"input": [
					{
						"intent": "동관 편의점"
					}
				],
				"output": {
					"text": "동관편의점은 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505964507686.jpg",
						"displayname": "e_b1f20.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020899"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "동관편의점은 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505964507686.jpg",
						"displayname": "e_b1f20.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020899"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020899"
					}
				]
			},
			{
				"name": "H마트",
				"id": "default103",
				"filename": "default",
				"input": [
					{
						"intent": "H마트"
					}
				],
				"output": {
					"text": "H마트는 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505964552819.jpg",
						"displayname": "e_b1f19.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020900"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "H마트는 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505964552819.jpg",
						"displayname": "e_b1f19.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020900"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020900"
					}
				]
			},
			{
				"name": "R편의점&마트",
				"id": "default104",
				"filename": "default",
				"input": [
					{
						"intent": "편의점"
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
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
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
							},
							{
								"text": "별관"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "별관 편의점"
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
						"name": "H마트2",
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
								"call": "H마트"
							}
						]
					}
				],
				"task": {
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
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "별관편의점"
					},
					{
						"text": "동관편의점"
					},
					{
						"text": "H마트"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "별관카페",
				"id": "default110",
				"filename": "default",
				"input": [
					{
						"intent": "별관 커피숍"
					}
				],
				"output": {
					"text": "별관카페는 별관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505964643859.jpg",
						"displayname": "BG103.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021567"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "별관카페는 별관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505964643859.jpg",
						"displayname": "BG103.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021567"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021567"
					}
				]
			},
			{
				"name": "동관카페",
				"id": "default111",
				"filename": "default",
				"input": [
					{
						"intent": "동관 커피숍"
					}
				],
				"output": [
					{
						"text": "동관카페는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505964724029.jpg",
							"displayname": "EG135.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021582"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021582"
					}
				]
			},
			{
				"name": "PET검사실",
				"id": "default236",
				"filename": "default",
				"input": [
					{
						"intent": "PET검사실"
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
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "동관  PET검사실2",
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
								"kind": "Action",
								"call": "동관 PET 검사실"
							}
						]
					},
					{
						"name": "신관  PET검사실(지하)2",
						"id": "default239",
						"filename": "default",
						"input": [
							{
								"text": "2"
							},
							{
								"text": "신관 PET 검 사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관 PET 검사실"
							}
						]
					},
					{
						"name": "신관 PET 검사실(2층)2",
						"id": "default240",
						"filename": "default",
						"input": [
							{
								"text": "신관 PET 검 사실 2 층"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관 PET 검사실(2층)"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "동관  PET검사실"
					},
					{
						"text": "신관 PET검사실(지하)"
					},
					{
						"text": "신관 PET검사실(2층)"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "신관카페",
				"id": "default112",
				"filename": "default",
				"input": [
					{
						"intent": "신관 커피숍"
					}
				],
				"output": {
					"text": "신관카페는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505969864399.jpg",
						"displayname": "NW101.jpg"
					},
					"buttons": [
						{
							"text": "신관카페",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=202"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "신관카페는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505969864399.jpg",
						"displayname": "NW101.jpg"
					},
					"buttons": [
						{
							"text": "신관카페",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=202"
						},
						{
							"text": "이전"
						},
						{
							"text": "처음"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "신관카페",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=202"
					}
				]
			},
			{
				"name": "신관카페",
				"id": "default113",
				"filename": "default",
				"input": [
					{
						"intent": "신관 커피숍"
					}
				],
				"output": [
					{
						"text": "신관카페는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505964766183.jpg",
							"displayname": "NW101.jpg"
						},
						"buttons": [
							{
								"text": "신관카페",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=202"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "신관카페",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=202"
					}
				]
			},
			{
				"name": "베즐리",
				"id": "default114",
				"filename": "default",
				"input": [
					{
						"intent": "베이커리카페(베즐리)"
					}
				],
				"output": [
					{
						"text": "베즐리(베이커리카페)는 동관 지하 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505969976633.jpg",
							"displayname": "e_b1f07.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021142"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021142"
					}
				]
			},
			{
				"name": "R카페&커피",
				"id": "default115",
				"filename": "default",
				"input": [
					{
						"intent": "카페"
					}
				],
				"output": {
					"text": "■ 병원 내 카페 안내\n• 밀탑\n - 위치: 신관 지하1층\n - 영업시간: 평일 07:30 ~ 20:00\n               토요일 10:00 ~ 20:00\n - 메뉴: 빙수, 단팥죽, 커피 등\n - 문의처: 02-3010-8585\n\n• 베이커리 (베즐리)\n - 위치: 동관 지하1층 \n - 영업시간: 07:00 ~ 20:30\n - 메뉴: 베이커리, 음료, 아이스크림  등\n - 문의처: 02-3010-6390\n\n• 동관커피숍\n - 위치: 동관 1층\n - 영업시간: 08:00 ~ 19:00\n - 메뉴: 커피, 쥬스 등\n - 문의처: 02-3010-2983 \n\n• 별관커피숍\n - 위치: 별관 1층\n - 영업시간: 07:30 ~ 22:00 \n - 메뉴: 커피, 쥬스 등\n - 문의처: 02-3010-2982 \n\n• 신관커피숍\n - 위치: 신관 1층\n - 영업시간: 08:00 ~ 19:00\n - 메뉴: 커피, 쥬스 등\n\n원하시는 장소의 버튼을 클릭하시거나 번호를 입력해주세요. 약도를 보여드릴께요^^\n1. 별관카페\n2. 동관카페\n3. 신관카페\n4. 밀탑\n5. 베즐리",
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
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
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
						"output": [
							{
								"kind": "Action",
								"call": "밀탑"
							}
						]
					},
					{
						"name": "베즐리2",
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
						"output": [
							{
								"kind": "Action",
								"call": "베즐리"
							}
						]
					}
				],
				"task": {
					"text": "■ 병원 내 카페 안내\n• 밀탑\n - 위치: 신관 지하1층\n - 영업시간: 평일 07:30 ~ 20:00\n               토요일 10:00 ~ 20:00\n - 메뉴: 빙수, 단팥죽, 커피 등\n - 문의처: 02-3010-8585\n\n• 베이커리 (베즐리)\n - 위치: 동관 지하1층 \n - 영업시간: 07:00 ~ 20:30\n - 메뉴: 베이커리, 음료, 아이스크림  등\n - 문의처: 02-3010-6390\n\n• 동관커피숍\n - 위치: 동관 1층\n - 영업시간: 08:00 ~ 19:00\n - 메뉴: 커피, 쥬스 등\n - 문의처: 02-3010-2983 \n\n• 별관커피숍\n - 위치: 별관 1층\n - 영업시간: 07:30 ~ 22:00 \n - 메뉴: 커피, 쥬스 등\n - 문의처: 02-3010-2982 \n\n• 신관커피숍\n - 위치: 신관 1층\n - 영업시간: 08:00 ~ 19:00\n - 메뉴: 커피, 쥬스 등\n\n원하시는 장소의 버튼을 클릭하시거나 번호를 입력해주세요. 약도를 보여드릴께요^^\n1. 별관카페\n2. 동관카페\n3. 신관카페\n4. 밀탑\n5. 베즐리",
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
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
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
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "금강산",
				"id": "default121",
				"filename": "default",
				"input": [
					{
						"intent": "한식당(금강산)"
					}
				],
				"output": {
					"text": "금강산은 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n• 금강산\n - 위치: 동관 지하1층\n - 영업시간: 07:30 ~ 20:30\n - 메뉴: 사골우거지탕, 양곰탕 등\n - 문의처: 02-3010-6191\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970029972.jpg",
						"displayname": "e_b1f02.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021230"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "금강산은 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n• 금강산\n - 위치: 동관 지하1층\n - 영업시간: 07:30 ~ 20:30\n - 메뉴: 사골우거지탕, 양곰탕 등\n - 문의처: 02-3010-6191\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505970029972.jpg",
						"displayname": "e_b1f02.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021230"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021230"
					}
				]
			},
			{
				"name": "한강",
				"id": "default122",
				"filename": "default",
				"input": [
					{
						"intent": "한식당(한강)"
					}
				],
				"output": {
					"text": "한강(한식당)은 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n• 한강\n - 위치: 동관 지하1층 \n - 영업시간: 07:30 ~ 15:30\n - 메뉴: 설렁탕, 육개장, 수육 등\n - 문의처: 02-3010-6398 \n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970085538.jpg",
						"displayname": "e_b1f16.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021145"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "한강(한식당)은 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n• 한강\n - 위치: 동관 지하1층 \n - 영업시간: 07:30 ~ 15:30\n - 메뉴: 설렁탕, 육개장, 수육 등\n - 문의처: 02-3010-6398 \n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970085538.jpg",
						"displayname": "e_b1f16.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021145"
						},
						{
							"text": "이전"
						},
						{
							"text": "처음"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021145"
					}
				]
			},
			{
				"name": "직원식당, 보호자식당",
				"id": "default134",
				"filename": "default",
				"input": [
					{
						"intent": "직원식당/보호자식당"
					}
				],
				"output": {
					"text": "개인적으로 준비한 도시락, 컵라면 등은 동관지하 1층에 위치한 직원 식당 안에 보호자석을 별도로 운영하오니 이곳을 이용하시기 바랍니다.\n자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970116467.jpg",
						"displayname": "e_b1f16.jpg"
					},
					"buttons": [
						{
							"text": "직원식당/보호자식당",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020913"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "개인적으로 준비한 도시락, 컵라면 등은 동관지하 1층에 위치한 직원 식당 안에 보호자석을 별도로 운영하오니 이곳을 이용하시기 바랍니다.\n자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505970116467.jpg",
						"displayname": "e_b1f16.jpg"
					},
					"buttons": [
						{
							"text": "직원식당/보호자식당",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020913"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "직원식당/보호자식당",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020913"
					}
				]
			},
			{
				"name": "스카이라운지",
				"id": "default146",
				"filename": "default",
				"input": [
					{
						"intent": "스카이라운지"
					}
				],
				"output": {
					"text": "스카이라운지는 동관 18층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n• 스카이라운지\n - 위치: 동관 18층\n - 영업시간: 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 스테이크, 스파게티, 한식류 \n - 문의처: 02-3010-7860\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970229414.jpg",
						"displayname": "EG181.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021126"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "스카이라운지는 동관 18층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n• 스카이라운지\n - 위치: 동관 18층\n - 영업시간: 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 스테이크, 스파게티, 한식류 \n - 문의처: 02-3010-7860\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505970229414.jpg",
						"displayname": "EG181.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021126"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021126"
					}
				]
			},
			{
				"name": "R동관 한식",
				"id": "default123",
				"filename": "default",
				"input": [
					{
						"intent": "동관 한식"
					}
				],
				"output": [
					{
						"text": "동관에 위치한 한식점은 금강산과 한강이 있습니다.\n\n• 금강산\n - 위치: 동관 지하1층\n - 영업시간: 07:30 ~ 20:30\n - 메뉴: 사골우거지탕, 양곰탕 등\n - 문의처: 02-3010-6191\n\n• 한강\n - 위치: 동관 지하1층 \n - 영업시간: 07:30 ~ 15:30\n - 메뉴: 설렁탕, 육개장, 수육 등\n - 문의처: 02-3010-6398\n\n•직원식당, 보호자식당\n\n• 스카이라운지\n - 위치: 동관 18층\n - 영업시간: 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 스테이크, 스파게티, 한식류 \n - 문의처: 02-3010-7860\n\n원하시는 장소의 버튼을 클릭하시거나 번호를 입력해주세요. 약도를 보여드릴께요^^\n1. 금강산\n2. 한강\n3. 직원식당, 보호자식당\n4. 스카이라운지",
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
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
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
						"output": [
							{
								"kind": "Action",
								"call": "직원식당, 보호자식당"
							}
						]
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
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "가람",
				"id": "default125",
				"filename": "default",
				"input": [
					{
						"intent": "한식당(가람)"
					}
				],
				"output": [
					{
						"text": "가람은 별관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n•가람\n -  위치 : 별관 1층\n -  영업시간 : 07:00 ~ 22:00\n -  메뉴 : 육개장, 우거지탕, 황태콩나물국, 파전, 두부김치 등\n -  문의처 : 02-3010-2421\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505970275574.jpg",
							"displayname": "BG102.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021566"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021566"
					}
				]
			},
			{
				"name": "국수나무",
				"id": "default124",
				"filename": "default",
				"input": [
					{
						"intent": "국수나무"
					}
				],
				"output": [
					{
						"text": "국수나무는 별관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n• 국수나무\n - 위치: 별관 2층\n - 영업시간:\n평일 08:00 ~ 20:30\n토요일 11:30 ~ 15:00\n(일, 공휴일 휴업) \n - 메뉴: 잔치국수, 돈가스, 낙지덮밥 등\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505970302113.jpg",
							"displayname": "f-201.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021666"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021666"
					}
				]
			},
			{
				"name": "R별관 식당",
				"id": "default129",
				"filename": "default",
				"input": [
					{
						"intent": "별관 식당"
					}
				],
				"output": [
					{
						"text": "별관에 위치한 식당으로는 가람과 국수나무가 있습니다.\n\n•가람\n\n• 국수나무\n - 위치: 별관 2층\n - 영업시간: \n평일 08:00 ~ 20:3.\n토요일 11:30 ~ 15:00\n(일, 공휴일 휴업) \n - 메뉴: 잔치국수, 돈가스, 낙지덮밥 등\n - 문의처: 02-3010-2999\n\n원하시는 장소의 버튼을 클릭하시거나 번호를 입력해주세요. 약도를 보여드릴께요^^\n1. 가람\n2. 국수나무",
						"buttons": [
							{
								"text": "가람"
							},
							{
								"text": "국수나무"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
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
						"output": [
							{
								"kind": "Action",
								"call": "가람"
							}
						]
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
						"output": [
							{
								"kind": "Action",
								"call": "국수나무"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "가람"
					},
					{
						"text": "국수나무"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "푸드코트",
				"id": "default128",
				"filename": "default",
				"input": [
					{
						"intent": "푸드코트(한식)"
					}
				],
				"output": {
					"text": "푸드코트는 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n• 푸드코트\n - 위치: 신관 지하1층\n - 영업시간: \n한식 07:30 ~ 20:30\n양식 11:00 ~ 20:30 \n(주말, 공휴일 휴업)\n - 메뉴: 돈까스, 해물덮밥, 비빔밥, 찌개, 죽 등\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970350869.jpg",
						"displayname": "e_b1f15.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=190"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "푸드코트는 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n• 푸드코트\n - 위치: 신관 지하1층\n - 영업시간: \n한식 07:30 ~ 20:30\n양식 11:00 ~ 20:30 \n(주말, 공휴일 휴업)\n - 메뉴: 돈까스, 해물덮밥, 비빔밥, 찌개, 죽 등\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505970350869.jpg",
						"displayname": "e_b1f15.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=190"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=190"
					}
				]
			},
			{
				"name": "나미(일식)",
				"id": "default133",
				"filename": "default",
				"input": [
					{
						"intent": "일식당(나미)"
					}
				],
				"output": {
					"text": "나미(일식당)은 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n• 나미\n - 위치: 동관 지하1층 \n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 생대구탕, 생선초밥, 알탕\n - 문의처: 02-3010-6181\n\n동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970376985.jpg",
						"displayname": "e_b1f03.jpg"
					},
					"buttons": [
						{
							"text": "나미(일식) 약도안내",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021232"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "나미(일식당)은 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n• 나미\n - 위치: 동관 지하1층 \n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 생대구탕, 생선초밥, 알탕\n - 문의처: 02-3010-6181\n\n동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970376985.jpg",
						"displayname": "e_b1f03.jpg"
					},
					"buttons": [
						{
							"text": "나미(일식) 약도안내",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021232"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "나미(일식) 약도안내",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021232"
					}
				]
			},
			{
				"name": "남경(중식)",
				"id": "default135",
				"filename": "default",
				"input": [
					{
						"intent": "중식"
					},
					{
						"intent": "중식당(남경)"
					}
				],
				"output": {
					"text": "남경(중식)은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 병원 내 중식당 안내\n\n• 남경\n - 위치: 신관 지하1층\n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 짜장, 짬뽕, 탕수육, 요리류\n - 문의처: 02-3010-6381\n\n신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970398828.jpg",
						"displayname": "NWB1F05.jpg"
					},
					"buttons": [
						{
							"text": "남경(중식) 약도안내",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=172"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "남경(중식)은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 병원 내 중식당 안내\n\n• 남경\n - 위치: 신관 지하1층\n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 짜장, 짬뽕, 탕수육, 요리류\n - 문의처: 02-3010-6381\n\n신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970398828.jpg",
						"displayname": "NWB1F05.jpg"
					},
					"buttons": [
						{
							"text": "남경(중식) 약도안내",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=172"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "남경(중식) 약도안내",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=172"
					}
				]
			},
			{
				"name": "R동관 식당",
				"id": "default136",
				"filename": "default",
				"input": [
					{
						"intent": "동관 식당"
					}
				],
				"output": {
					"text": "동관에는 4개의 식당이 있습니다.\n\n• 금강산\n - 위치: 동관 지하1층\n - 영업시간: 07:30 ~ 20:30\n - 메뉴: 사골우거지탕, 양곰탕 등\n - 문의처: 02-3010-6191\n\n\n• 한강\n - 위치: 동관 지하1층 \n - 영업시간: 07:30 ~ 15:30\n - 메뉴: 설렁탕, 육개장, 수육 등\n - 문의처: 02-3010-6398 \n\n• 나미\n - 위치: 동관 지하1층 \n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 생대구탕, 생선초밥, 알탕\n - 문의처: 02-3010-6181\n\n• 스카이라운지\n - 위치: 동관 18층\n - 영업시간: 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 스테이크, 스파게티, 한식류 \n - 문의처: 02-3010-7860\n\n원하시는 장소의 버튼을 선택하시거나 번호를 입력하시면 약도로 안내해드릴께요:)\n1. 금강산\n2. 한강\n3. 나미\n4. 직원식당, 보호자 식당\n5. 스카이라운지",
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
							"text": "스카이라운지"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
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
						"name": "스카이라운지3",
						"id": "default155",
						"filename": "default",
						"input": [
							{
								"text": "스카이 라운지"
							},
							{
								"text": "4"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "스카이라운지"
							}
						]
					}
				],
				"task": {
					"text": "동관에는 4개의 식당이 있습니다.\n\n• 금강산\n - 위치: 동관 지하1층\n - 영업시간: 07:30 ~ 20:30\n - 메뉴: 사골우거지탕, 양곰탕 등\n - 문의처: 02-3010-6191\n\n\n• 한강\n - 위치: 동관 지하1층 \n - 영업시간: 07:30 ~ 15:30\n - 메뉴: 설렁탕, 육개장, 수육 등\n - 문의처: 02-3010-6398 \n\n• 나미\n - 위치: 동관 지하1층 \n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 생대구탕, 생선초밥, 알탕\n - 문의처: 02-3010-6181\n\n• 스카이라운지\n - 위치: 동관 18층\n - 영업시간: 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 스테이크, 스파게티, 한식류 \n - 문의처: 02-3010-7860\n\n원하시는 장소의 버튼을 선택하시거나 번호를 입력하시면 약도로 안내해드릴께요:)\n1. 금강산\n2. 한강\n3. 나미\n4. 직원식당, 보호자 식당\n5. 스카이라운지",
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
							"text": "스카이라운지"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
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
						"text": "스카이라운지"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "R신관 식당",
				"id": "default141",
				"filename": "default",
				"input": [
					{
						"intent": "신관 식당"
					}
				],
				"output": [
					{
						"text": "신관에는 2개의 식당이 있습니다.\n\n• 남경\n - 위치: 신관 지하1층\n - 영업시간: 11:00 ~ 20:30\n - 메뉴: 짜장, 짬뽕, 탕수육, 요리류\n - 문의처: 02-3010-6381\n\n\n• 푸드코트\n - 위치: 신관 지하1층\n - 영업시간: \n한식 07:30 ~ 20:30 \n양식 11:00 ~ 20:30\n (주말, 공휴일 휴업)\n - 메뉴: 돈까스, 해물덮밥, 비빔밥, 찌개, 죽 등\n - 문의처: 02-3010-6394\n\n원하시는 장소의 버튼을 누르시거나 번호를 입력해주세요. 약도를 보여드릴께요:)\n1. 남경\n2. 푸드코트",
						"buttons": [
							{
								"text": "남경"
							},
							{
								"text": "푸드코트"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
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
					{
						"text": "남경"
					},
					{
						"text": "푸드코트"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "R한식",
				"id": "default142",
				"filename": "default",
				"input": [
					{
						"intent": "한식"
					}
				],
				"output": {
					"text": "■ 병원 내 한식당 안내\n\n• 금강산\n - 위치: 동관 지하1층\n - 영업시간: 07:30 ~ 20:30\n - 메뉴: 사골우거지탕, 양곰탕 등\n - 문의처: 02-3010-6191\n\n• 한강\n - 위치: 동관 지하1층 \n - 영업시간: 07:30 ~ 15:30\n - 메뉴: 설렁탕, 육개장, 수육 등\n - 문의처: 02-3010-6398 \n\n• 국수나무\n - 위치: 별관 2층\n - 영업시간: 평일 08:00 ~ 20:30\n               토요일 11:30 ~ 15:00 (일, 공휴일 휴업) \n - 메뉴: 잔치국수, 돈가스, 낙지덮밥 등\n - 문의처: 02-3010-2999\n\n• 푸드코트\n - 위치: 신관 지하1층\n - 영업시간: 한식 07:30 ~ 20:30\n               양식 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 돈까스, 해물덮밥, 비빔밥, 찌개, 죽 등\n - 문의처: 02-3010-6394\n\n• 가람\n -  위치 : 별관 1층\n -  영업시간 : 07:00 ~ 22:00\n -  메뉴 : 육개장, 우거지탕, 황태콩나물국, 파전, 두부김치 등\n -  문의처 : 02-3010-2421\n\n원하시는 장소의 버튼을 누르시거나 번호를 입력해주세요. 약도로 안내해드리겠습니다.\n1. 금강산\n2. 한강\n3. 국수나무\n4. 푸드코트\n5. 가람",
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
							"text": "처음"
						},
						{
							"text": "이전"
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
						"name": "국수나무3",
						"id": "default151",
						"filename": "default",
						"input": [
							{
								"text": "국수나무"
							},
							{
								"text": "3"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "국수나무"
							}
						]
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
								"text": "4"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "푸드코트"
							}
						]
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
								"text": "5"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "가람"
							}
						]
					}
				],
				"task": {
					"text": "■ 병원 내 한식당 안내\n\n• 금강산\n - 위치: 동관 지하1층\n - 영업시간: 07:30 ~ 20:30\n - 메뉴: 사골우거지탕, 양곰탕 등\n - 문의처: 02-3010-6191\n\n• 한강\n - 위치: 동관 지하1층 \n - 영업시간: 07:30 ~ 15:30\n - 메뉴: 설렁탕, 육개장, 수육 등\n - 문의처: 02-3010-6398 \n\n• 국수나무\n - 위치: 별관 2층\n - 영업시간: 평일 08:00 ~ 20:30\n               토요일 11:30 ~ 15:00 (일, 공휴일 휴업) \n - 메뉴: 잔치국수, 돈가스, 낙지덮밥 등\n - 문의처: 02-3010-2999\n\n• 푸드코트\n - 위치: 신관 지하1층\n - 영업시간: 한식 07:30 ~ 20:30\n               양식 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 돈까스, 해물덮밥, 비빔밥, 찌개, 죽 등\n - 문의처: 02-3010-6394\n\n• 가람\n -  위치 : 별관 1층\n -  영업시간 : 07:00 ~ 22:00\n -  메뉴 : 육개장, 우거지탕, 황태콩나물국, 파전, 두부김치 등\n -  문의처 : 02-3010-2421\n\n원하시는 장소의 버튼을 누르시거나 번호를 입력해주세요. 약도로 안내해드리겠습니다.\n1. 금강산\n2. 한강\n3. 국수나무\n4. 푸드코트\n5. 가람",
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
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
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
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "R양식",
				"id": "default145",
				"filename": "default",
				"input": [
					{
						"intent": "양식"
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
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
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
				],
				"task": {
					"text": "두 개의 양식당이 있습니다.\n\n• 푸드코트\n - 위치: 신관 지하1층\n - 영업시간: 한식 07:30 ~ 20:30\n               양식 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 돈까스, 해물덮밥, 비빔밥, 찌개, 죽 등\n - 문의처: 02-3010-6394\n\n• 스카이라운지\n - 위치: 동관 18층\n - 영업시간: 11:00 ~ 20:30 (주말, 공휴일 휴업)\n - 메뉴: 스테이크, 스파게티, 한식류 \n - 문의처: 02-3010-7860\n\n원하시는 장소의 버튼을 선택하시거나 번호를 입력해주세요. 약도로 안내해드리겠습니다.",
					"buttons": [
						{
							"text": "푸드코트"
						},
						{
							"text": "스카이라운지"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "푸드코트"
					},
					{
						"text": "스카이라운지"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "R식당",
				"id": "default223",
				"filename": "default",
				"input": [
					{
						"intent": "식당"
					}
				],
				"output": {
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
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
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
				"task": {
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
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
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
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "동관kb하나은행",
				"id": "default158",
				"filename": "default",
				"input": [
					{
						"intent": "동관 KEB하나은행"
					}
				],
				"output": [
					{
						"text": "동관KEB하나은행은 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505970433916.jpg",
							"displayname": "NWB1F05.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021050"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021050"
					}
				]
			},
			{
				"name": "신관kb하나은행",
				"id": "default159",
				"filename": "default",
				"input": [
					{
						"intent": "신관 KEB하나은행"
					}
				],
				"output": [
					{
						"text": "신관KEB하나은행은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505970493443.jpg",
							"displayname": "NWB1F04.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=185"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=185"
					}
				]
			},
			{
				"name": "R은행",
				"id": "default162",
				"filename": "default",
				"input": [
					{
						"intent": "은행"
					}
				],
				"output": {
					"text": "아산병원에는 KB하나은행이 있습니다. \n - 위치: 동관/신관 지하 1층\n - 영업 / 운영 시간: 09:00 ~ 16:00(토요일, 공휴일 휴무)\n - 문의처: 02-3010-8647\n\n원하시는 은행의 버튼을 누르시거나 번호를 입력해주세요. 약도로 안내해드리겠습니다.\n1.동관KB하나은행\n2.신관KB하나은행",
					"buttons": [
						{
							"text": "동관KB하나은행"
						},
						{
							"text": "신관KB하나은행"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
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
				"task": {
					"text": "아산병원에는 KB하나은행이 있습니다. \n - 위치: 동관/신관 지하 1층\n - 영업 / 운영 시간: 09:00 ~ 16:00(토요일, 공휴일 휴무)\n - 문의처: 02-3010-8647\n\n원하시는 은행의 버튼을 누르시거나 번호를 입력해주세요. 약도로 안내해드리겠습니다.\n1.동관KB하나은행\n2.신관KB하나은행",
					"buttons": [
						{
							"text": "동관KB하나은행"
						},
						{
							"text": "신관KB하나은행"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "동관KB하나은행"
					},
					{
						"text": "신관KB하나은행"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "CT실",
				"id": "default165",
				"filename": "default",
				"input": [
					{
						"intent": "CT"
					}
				],
				"output": {
					"text": "다음 중 찾으시는  CT실은 어디인가요\n\n1. 서관CT실\n2. 신관CT실\n3. 응급CT실",
					"buttons": [
						{
							"text": "서관CT실"
						},
						{
							"text": "신관CT실"
						},
						{
							"text": "응급CT실"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "서관 CT실2",
						"id": "default230",
						"filename": "default",
						"input": [
							{
								"text": "1"
							},
							{
								"text": "서관 CT 실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "서관CT실"
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
								"kind": "Action",
								"call": "신관 CT실"
							}
						]
					},
					{
						"name": "응급CT실2",
						"id": "default258",
						"filename": "default",
						"input": [
							{
								"text": "응급 CT 실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "서관 외래/응급 CT MR실"
							}
						]
					}
				],
				"task": {
					"text": "다음 중 찾으시는  CT실은 어디인가요\n\n1. 서관CT실\n2. 신관CT실\n3. 응급CT실",
					"buttons": [
						{
							"text": "서관CT실"
						},
						{
							"text": "신관CT실"
						},
						{
							"text": "응급CT실"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "서관CT실"
					},
					{
						"text": "신관CT실"
					},
					{
						"text": "응급CT실"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "MR실",
				"id": "default232",
				"filename": "default",
				"input": [
					{
						"intent": "MR"
					}
				],
				"output": {
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
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
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
								"kind": "Action",
								"call": "동관 MR실"
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
								"kind": "Action",
								"call": "신관 MR실(지하)"
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
								"kind": "Action",
								"call": "신관 MR실(2층)"
							}
						]
					}
				],
				"task": {
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
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "동관 MR실"
					},
					{
						"text": "신관 MR실(지하)"
					},
					{
						"text": "신관 MR실(2층)"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "신관 처음 오신분 창구",
				"id": "default474",
				"filename": "default",
				"input": [
					{
						"intent": "신관 처음 오신분 창구"
					}
				],
				"output": [
					{
						"text": "신관 처음 오신분 창구는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505970540867.jpg",
							"displayname": "n_138.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=353"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=353"
					}
				]
			},
			{
				"name": "밀탑",
				"id": "default1124",
				"filename": "default",
				"input": [
					{
						"intent": "밀탑(빙수전문점)"
					}
				],
				"output": [
					{
						"text": "• 밀탑\n - 위치: 신관 지하1층\n - 영업시간: 평일 07:30 ~ 20:00\n               토요일 10:00 ~ 20:00\n - 메뉴: 빙수, 단팥죽, 커피 등\n - 문의처: 02-3010-8585\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1506299549750.jpg",
							"displayname": "NWB1F19.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=179"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=179"
					}
				]
			}
		]
	},
	{
		"name": "병원 내 위치찾기/편의시설 이용안내",
		"id": "default249",
		"filename": "default",
		"input": [
			{
				"regexp": "(2|7|위치|위치 찾기|위치찾기|편의 시설 |편의 시설)"
			},
			{
				"text": "위치"
			}
		],
		"output": [
			{
				"text": "+1+",
				"kind": "Text"
			}
		],
		"children": [
			{
				"name": "빈소Task-빈소#S >9",
				"id": "default1075",
				"filename": "default",
				"input": [
					{
						"regexp": "(?:\\s|^|제)(11|12|20|21|22|23|30|31|32|33|34|35)\\s*(빈소|번빈소|호빈소| 빈소|번 빈소|호 빈소)"
					},
					{
						"regexp": "(?:\\s|^|제)(11|12|20|21|22|23|30|31|32|33|34|35)\\s*(장례식|번장례식|호장례식|번 장례식|호 장례식)"
					},
					{
						"regexp": "(?:빈소)(?:\\s)?(11|12|20|21|22|23|30|31|32|33|34|35)(?:\\s|번|호|$)"
					},
					{
						"regexp": "(?:장례식|장례식 장)(?:\\s)?(11|12|20|21|22|23|30|31|32|33|34|35)(?:\\s|번|호|$)"
					}
				],
				"output": [
					{
						"text": "+1+",
						"kind": "Text"
					}
				],
				"task": "BSTask"
			},
			{
				"name": "빈소Task-빈소#S",
				"id": "default250",
				"filename": "default",
				"input": [
					{
						"regexp": "(?:\\s|^|제)(1|2|3|5|6|7|8|9|10|11|12|20|21|22|23|30|31|32|33|34|35)\\s*(빈소|번빈소|호빈소| 빈소|번 빈소|호 빈소)"
					},
					{
						"regexp": "(?:\\s|^|제)(1|2|3|5|6|7|8|9|10|11|12|20|21|22|23|30|31|32|33|34|35)\\s*(장례식|번장례식|호장례식|번 장례식|호 장례식)"
					},
					{
						"regexp": "(?:빈소)(?:\\s)?(1|2|3|5|6|7|8|9|10|11|12|20|21|22|23|30|31|32|33|34|35)(?:\\s|번|호|$)"
					},
					{
						"regexp": "(?:장례식|장례식 장)(?:\\s)?(1|2|3|5|6|7|8|9|10|11|12|20|21|22|23|30|31|32|33|34|35)(?:\\s|번|호|$)"
					}
				],
				"output": [
					{
						"text": "+1+",
						"kind": "Text"
					}
				],
				"task": "BSTask"
			},
			{
				"name": "빈소 #F",
				"id": "default251",
				"filename": "default",
				"input": [
					{
						"intent": "빈소"
					}
				],
				"output": {
					"text": "빈소(장례식장)을 찾으시는군요!\n\n아산병원 빈소 보유현황은 다음과 같아요.\n\n별관 지하1층에 1~12호(4,10호 없음)\n별관 2층에 20~23호\n별관 3층에 30~35호\n\n찾으시는 빈소 번호를 입력하시면 약도로 안내해드릴께요.\n\n예) 빈소 5호를 찾아요, 23번 장례식장 어디야?\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"children": [
					{
						"name": "빈소 Task-빈소#S>9 2",
						"id": "default1076",
						"filename": "default",
						"input": [
							{
								"regexp": "(11|12|20|21|22|23|30|31|32|33|34|35)"
							}
						],
						"output": [
							{
								"text": "+1+",
								"kind": "Text"
							}
						],
						"task": {
							"name": "BSTask"
						}
					},
					{
						"name": "빈소 Task-빈소#S 2",
						"id": "default252",
						"filename": "default",
						"input": [
							{
								"regexp": "(1|2|3|5|6|7|8|9|10|11|12)"
							}
						],
						"output": [
							{
								"text": "+1+",
								"kind": "Text"
							}
						],
						"task": "BSTask"
					}
				],
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "객실Task-객실#S",
				"id": "default254",
				"filename": "default",
				"input": [
					{
						"regexp": "(?:\\s|^|제)(501|502|503|504|505|506|507|508|509|510|511|512|513|514)\\s*(객실|번객실|호객실|$)"
					},
					{
						"regexp": "(?:객실|객실방)?(501|502|503|504|505|506|507|508|509|510|511|512|513|514)(?:\\s|^|번|호|$)"
					}
				],
				"output": [
					{
						"text": "+1+",
						"kind": "Text"
					}
				],
				"task": "RoomTask"
			},
			{
				"name": "객실 #F",
				"id": "default255",
				"filename": "default",
				"input": [
					{
						"text": "객실"
					},
					{
						"intent": "객실"
					}
				],
				"output": [
					{
						"text": "객실을 찾으시는군요!\n\n아산병원 객실은 별관 4층에 있습니다. \n\n찾으시는 객실 번호를 입력하시면 약도로 안내해드릴께요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "객실 Task-객실#S 2",
						"id": "default256",
						"filename": "default",
						"input": [
							{
								"regexp": "(501|502|503|504|505|506|507|508|509|510|511|512|513|514)"
							}
						],
						"output": [
							{
								"text": "+1+",
								"kind": "Text"
							}
						],
						"task": "RoomTask"
					}
				]
			},
			{
				"name": "in1.별관 편의점",
				"id": "default259",
				"filename": "default",
				"input": [
					{
						"intent": "별관 편의점"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "별관 편의점"
					}
				]
			},
			{
				"name": "in1. 동관 편의점",
				"id": "default260",
				"filename": "default",
				"input": [
					{
						"intent": "동관 편의점"
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
				"name": "in1. H마트",
				"id": "default261",
				"filename": "default",
				"input": [
					{
						"intent": "H마트"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "H마트"
					}
				]
			},
			{
				"name": "in1. R편의점&마트",
				"id": "default262",
				"filename": "default",
				"input": [
					{
						"intent": "편의점"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "R편의점&마트"
					}
				]
			},
			{
				"name": "in1. 별관카페",
				"id": "default264",
				"filename": "default",
				"input": [
					{
						"intent": "별관 커피숍"
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
				"name": "in1. 동관카페",
				"id": "default265",
				"filename": "default",
				"input": [
					{
						"intent": "동관 커피숍"
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
				"name": "in1. 신관카페",
				"id": "default266",
				"filename": "default",
				"input": [
					{
						"intent": "신관 커피숍"
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
				"name": "in1. 밀탑",
				"id": "default267",
				"filename": "default",
				"input": [
					{
						"intent": "밀탑(빙수전문점)"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "밀탑"
					}
				]
			},
			{
				"name": "in1. 베즐리",
				"id": "default268",
				"filename": "default",
				"input": [
					{
						"intent": "베이커리카페(베즐리)"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "베즐리"
					}
				]
			},
			{
				"name": "in1. R카페&커피",
				"id": "default269",
				"filename": "default",
				"input": [
					{
						"intent": "커피"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "R카페&커피"
					}
				]
			},
			{
				"name": "in1. 금강산",
				"id": "default270",
				"filename": "default",
				"input": [
					{
						"intent": "한식당(금강산)"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "금강산"
					}
				]
			},
			{
				"name": "in1. 한강",
				"id": "default271",
				"filename": "default",
				"input": [
					{
						"intent": "한식당(한강)"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "한강"
					}
				]
			},
			{
				"name": "in1. 직원식당",
				"id": "default272",
				"filename": "default",
				"input": [
					{
						"intent": "직원식당/보호자식당"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "직원식당, 보호자식당"
					}
				]
			},
			{
				"name": "in1. 스카이라운지",
				"id": "default273",
				"filename": "default",
				"input": [
					{
						"intent": "스카이라운지"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "스카이라운지"
					}
				]
			},
			{
				"name": "in1. R동관 한식",
				"id": "default274",
				"filename": "default",
				"input": [
					{
						"intent": "동관 한식"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "R동관 한식"
					}
				]
			},
			{
				"name": "in1. 가람",
				"id": "default275",
				"filename": "default",
				"input": [
					{
						"intent": "한식당(가람)"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "가람",
						"type": "Call"
					}
				]
			},
			{
				"name": "in1. 국수나무",
				"id": "default276",
				"filename": "default",
				"input": [
					{
						"intent": "국수나무"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "국수나무"
					}
				]
			},
			{
				"name": "in1. R별관 식당",
				"id": "default277",
				"filename": "default",
				"input": [
					{
						"intent": "별관 식당"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "R별관 식당"
					}
				]
			},
			{
				"name": "in1. 푸드코트",
				"id": "default279",
				"filename": "default",
				"input": [
					{
						"intent": "푸드코트(경양식)"
					},
					{
						"intent": "푸드코트(한식)"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "푸드코트"
					}
				]
			},
			{
				"name": "in1. 나미(일식)",
				"id": "default280",
				"filename": "default",
				"input": [
					{
						"intent": "일식당(나미)"
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
				"name": "in1. 남경(중식)",
				"id": "default281",
				"filename": "default",
				"input": [
					{
						"intent": "중식당(남경)"
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
				"name": "in1. R동관 식당",
				"id": "default282",
				"filename": "default",
				"input": [
					{
						"intent": "동관 식당"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "R동관 식당"
					}
				]
			},
			{
				"name": "in1. R신관 식당",
				"id": "default283",
				"filename": "default",
				"input": [
					{
						"intent": "신관 식당"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "R신관 식당"
					}
				]
			},
			{
				"name": "in1. R한식",
				"id": "default284",
				"filename": "default",
				"input": [
					{
						"intent": "한식"
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
				"name": "in1. 식당",
				"id": "default286",
				"filename": "default",
				"input": [
					{
						"intent": "식당"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "R식당"
					}
				]
			},
			{
				"name": "in1. 양식",
				"id": "default285",
				"filename": "default",
				"input": [
					{
						"intent": "양식"
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
				"name": "사이버나이프센터",
				"id": "default287",
				"filename": "default",
				"input": [
					{
						"intent": "사이버나이프센터"
					}
				],
				"output": {
					"text": "사이버나이프센터는 서관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n처음으로 돌아가시려면 '처음'을, 이전 단계로 돌아가고 싶으시면 '이전'이라고 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970646206.jpg",
						"displayname": "WGB1F01.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021151"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "사이버나이프센터는 서관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n처음으로 돌아가시려면 '처음'을, 이전 단계로 돌아가고 싶으시면 '이전'이라고 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970646206.jpg",
						"displayname": "WGB1F01.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021151"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021151"
					}
				]
			},
			{
				"name": "서관 의무기록/영상사본발급",
				"id": "default288",
				"filename": "default",
				"input": [
					{
						"intent": "서관 의무기록/영상사본발급"
					}
				],
				"output": {
					"text": "서관 의무기록/영상사본발급처는\n 서관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505970702444.jpg",
						"displayname": "w-B1F02.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000030957"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "서관 의무기록/영상사본발급처는\n 서관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505970702444.jpg",
						"displayname": "w-B1F02.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000030957"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000030957"
					}
				]
			},
			{
				"name": "간담도췌외과",
				"id": "default289",
				"filename": "default",
				"input": [
					{
						"intent": "간담도췌외과"
					}
				],
				"output": [
					{
						"text": "간담도췌외과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505970729829.jpg",
							"displayname": "WG124.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021182"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021182"
					}
				]
			},
			{
				"name": "간센터",
				"id": "default290",
				"filename": "default",
				"input": [
					{
						"intent": "간센터"
					}
				],
				"output": [
					{
						"text": "간센터는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505970768073.jpg",
							"displayname": "WG112.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021199"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021199"
					}
				]
			},
			{
				"name": "간이식 및 간담도외과",
				"id": "default291",
				"filename": "default",
				"input": [
					{
						"intent": "간이식 및 간담도외과"
					}
				],
				"output": [
					{
						"text": "간이식 및 간담도외과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505970797218.jpg",
							"displayname": "WG123.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021183"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021183"
					}
				]
			},
			{
				"name": "담도/췌장센터",
				"id": "default292",
				"filename": "default",
				"input": [
					{
						"intent": "담도/췌장센터"
					}
				],
				"output": [
					{
						"text": "담도/췌장센터는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505970819978.jpg",
							"displayname": "WG104.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021216"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021216"
					}
				]
			},
			{
				"name": "대장항문외과",
				"id": "default293",
				"filename": "default",
				"input": [
					{
						"intent": "대장항문외과"
					}
				],
				"output": [
					{
						"text": "대장항문외과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505970852281.jpg",
							"displayname": "WG121.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021185"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021185"
					}
				]
			},
			{
				"name": "상부위장관외과",
				"id": "default294",
				"filename": "default",
				"input": [
					{
						"intent": "상부위장관외과"
					}
				],
				"output": [
					{
						"text": "상부위장관외과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505970893228.jpg",
							"displayname": "WG120.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021187"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021187"
					}
				]
			},
			{
				"name": "서관 주사실",
				"id": "default295",
				"filename": "default",
				"input": [
					{
						"intent": "서관 주사실"
					}
				],
				"output": [
					{
						"text": "서관 주사실은 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971034639.jpg",
							"displayname": "WG107.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021207"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021207"
					}
				]
			},
			{
				"name": "서관 채혈실",
				"id": "default296",
				"filename": "default",
				"input": [
					{
						"intent": "서관 채혈실"
					}
				],
				"output": [
					{
						"text": "서관 채혈실은 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971006706.jpg",
							"displayname": "WG108.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021205"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021205"
					}
				]
			},
			{
				"name": "소화기내과",
				"id": "default297",
				"filename": "default",
				"input": [
					{
						"intent": "소화기내과"
					}
				],
				"output": [
					{
						"text": "소화기내과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971062938.jpg",
							"displayname": "WG115.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021196"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021196"
					}
				]
			},
			{
				"name": "암교육정보센터",
				"id": "default298",
				"filename": "default",
				"input": [
					{
						"intent": "암교육정보센터"
					}
				],
				"output": [
					{
						"text": "암교육정보센터는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971090396.jpg",
							"displayname": "WG111.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021200"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021200"
					}
				]
			},
			{
				"name": "암통합진료센터",
				"id": "default299",
				"filename": "default",
				"input": [
					{
						"intent": "암통합진료센터"
					}
				],
				"output": [
					{
						"text": "암통합진료센터는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971113552.jpg",
							"displayname": "WG110.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021201"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021201"
					}
				]
			},
			{
				"name": "염증성장질환센터",
				"id": "default300",
				"filename": "default",
				"input": [
					{
						"intent": "염증성장질환센터"
					}
				],
				"output": [
					{
						"text": "염증성장질환센터는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971142700.jpg",
							"displayname": "WG113.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021198"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021198"
					}
				]
			},
			{
				"name": "서관 외래/응급 CT MR실",
				"id": "default301",
				"filename": "default",
				"input": [
					{
						"intent": "외래/응급 CT MR실"
					}
				],
				"output": [
					{
						"text": "외래/응급 CT MR실은 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971185464.jpg",
							"displayname": "WG116.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021193"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021193"
					}
				]
			},
			{
				"name": "외래약국",
				"id": "default302",
				"filename": "default",
				"input": [
					{
						"intent": "외래약국"
					}
				],
				"output": {
					"text": "외래약국은 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971213580.jpg",
						"displayname": "WG101.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021222"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "외래약국은 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505971213580.jpg",
						"displayname": "WG101.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021222"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021222"
					}
				]
			},
			{
				"name": "유방내분비외과",
				"id": "default303",
				"filename": "default",
				"input": [
					{
						"intent": "유방내분비외과"
					}
				],
				"output": {
					"text": "유방내분비외과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971245826.jpg",
						"displayname": "WG122.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021184"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "유방내분비외과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971245826.jpg",
						"displayname": "WG122.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021184"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021184"
					}
				]
			},
			{
				"name": "유방암클리닉",
				"id": "default304",
				"filename": "default",
				"input": [
					{
						"intent": "유방암클리닉"
					}
				],
				"output": {
					"text": "유방암클리닉은 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971271362.jpg",
						"displayname": "WG119.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021189"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "유방암클리닉은 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971271362.jpg",
						"displayname": "WG119.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021189"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021189"
					}
				]
			},
			{
				"name": "응급의료센터",
				"id": "default305",
				"filename": "default",
				"input": [
					{
						"intent": "응급의료센터"
					}
				],
				"output": [
					{
						"text": "응급의료센터는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971296970.jpg",
							"displayname": "WG106.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021052"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021052"
					}
				]
			},
			{
				"name": "응급중환자실",
				"id": "default306",
				"filename": "default",
				"input": [
					{
						"intent": "응급중환자실"
					}
				],
				"output": [
					{
						"text": "응급중환자실은 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971321398.jpg",
							"displayname": "WG117.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021191"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021191"
					}
				]
			},
			{
				"name": "응급촬영실",
				"id": "default307",
				"filename": "default",
				"input": [
					{
						"intent": "응급촬영실"
					}
				],
				"output": [
					{
						"text": "응급촬영실은 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971344764.jpg",
							"displayname": "WG105.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021457"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021457"
					}
				]
			},
			{
				"name": "일반외과",
				"id": "default308",
				"filename": "default",
				"input": [
					{
						"intent": "일반외과"
					}
				],
				"output": {
					"text": "일반외과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971366681.jpg",
						"displayname": "WG125.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021181"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "일반외과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971366681.jpg",
						"displayname": "WG125.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021181"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021181"
					}
				]
			},
			{
				"name": "재활의학과",
				"id": "default309",
				"filename": "default",
				"input": [
					{
						"intent": "재활의학과"
					}
				],
				"output": [
					{
						"text": "재활의학과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971402869.jpg",
							"displayname": "WG128.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021161"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021161"
					}
				]
			},
			{
				"name": "종양내과",
				"id": "default310",
				"filename": "default",
				"input": [
					{
						"intent": "종양내과"
					}
				],
				"output": {
					"text": "종양내과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971425499.jpg",
						"displayname": "WG127.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021179"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "종양내과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971425499.jpg",
						"displayname": "WG127.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021179"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021179"
					}
				]
			},
			{
				"name": "폐식도외과",
				"id": "default311",
				"filename": "default",
				"input": [
					{
						"intent": "폐식도외과"
					}
				],
				"output": {
					"text": "폐식도외과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971452303.jpg",
						"displayname": "WG109.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021203"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "폐식도외과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971452303.jpg",
						"displayname": "WG109.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021203"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021203"
					}
				]
			},
			{
				"name": "혈액내과",
				"id": "default312",
				"filename": "default",
				"input": [
					{
						"intent": "혈액내과"
					}
				],
				"output": {
					"text": "혈액내과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971480325.jpg",
						"displayname": "WG126.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021180"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "혈액내과는 서관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971480325.jpg",
						"displayname": "WG126.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021180"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021180"
					}
				]
			},
			{
				"name": "기관지내시경검사실",
				"id": "default313",
				"filename": "default",
				"input": [
					{
						"intent": "기관지내시경검사실"
					}
				],
				"output": [
					{
						"text": "기관지내시경검사실은 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971504695.jpg",
							"displayname": "WG203.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021217"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021217"
					}
				]
			},
			{
				"name": "류마티스내과",
				"id": "default314",
				"filename": "default",
				"input": [
					{
						"intent": "류마티스내과"
					}
				],
				"output": {
					"text": "류마티스내과는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971526641.jpg",
						"displayname": "WG208.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021208"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "류마티스내과는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971526641.jpg",
						"displayname": "WG208.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021208"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021208"
					}
				]
			},
			{
				"name": "서관CT실",
				"id": "default315",
				"filename": "default",
				"input": [
					{
						"intent": "서관CT실"
					}
				],
				"output": {
					"text": "서관CT실는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971553621.jpg",
						"displayname": "WG217.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021173"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "서관CT실는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505971553621.jpg",
						"displayname": "WG217.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021173"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021173"
					}
				]
			},
			{
				"name": "서관 초음파실",
				"id": "default317",
				"filename": "default",
				"input": [
					{
						"intent": "서관 초음파실"
					}
				],
				"output": {
					"text": "서관 초음파실은 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971594925.jpg",
						"displayname": "WG204.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021214"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "서관 초음파실은 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971594925.jpg",
						"displayname": "WG204.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021214"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021214"
					}
				]
			},
			{
				"name": "서관 투시조영실",
				"id": "default318",
				"filename": "default",
				"input": [
					{
						"intent": "서관 투시조영실"
					}
				],
				"output": {
					"text": "서관 투시조영실은 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971622255.jpg",
						"displayname": "w_2f_007.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021188"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "서관 투시조영실은 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971622255.jpg",
						"displayname": "w_2f_007.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021188"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021188"
					}
				]
			},
			{
				"name": "알레르기검사실",
				"id": "default319",
				"filename": "default",
				"input": [
					{
						"intent": "알레르기검사실"
					}
				],
				"output": {
					"text": "알레르기검사실은 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971648149.jpg",
						"displayname": "WG209.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021206"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "알레르기검사실은 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971648149.jpg",
						"displayname": "WG209.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021206"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021206"
					}
				]
			},
			{
				"name": "알레르기내과",
				"id": "default320",
				"filename": "default",
				"input": [
					{
						"intent": "알레르기내과"
					}
				],
				"output": {
					"text": "알레르기내과는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971669516.jpg",
						"displayname": "WG210.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021192"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "알레르기내과는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971669516.jpg",
						"displayname": "WG210.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021192"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021192"
					}
				]
			},
			{
				"name": "유방두경부영상의학검사실",
				"id": "default321",
				"filename": "default",
				"input": [
					{
						"intent": "유방두경부영상의학검사실"
					}
				],
				"output": {
					"text": "유방두경부영상의학검사실는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971691645.jpg",
						"displayname": "WG214.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021178"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "유방두경부영상의학검사실는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971691645.jpg",
						"displayname": "WG214.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021178"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021178"
					}
				]
			},
			{
				"name": "입원전검사실",
				"id": "default322",
				"filename": "default",
				"input": [
					{
						"intent": "입원전검사실"
					}
				],
				"output": {
					"text": "입원전검사실은 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971733733.jpg",
						"displayname": "WG205.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021211"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "입원전검사실은 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971733733.jpg",
						"displayname": "WG205.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021211"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021211"
					}
				]
			},
			{
				"name": "장기이식센터",
				"id": "default323",
				"filename": "default",
				"input": [
					{
						"intent": "장기이식센터"
					}
				],
				"output": {
					"text": "장기이식센터는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971757349.jpg",
						"displayname": "WG201.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021220"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "장기이식센터는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971757349.jpg",
						"displayname": "WG201.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021220"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021220"
					}
				]
			},
			{
				"name": "천식 COPD센터",
				"id": "default324",
				"filename": "default",
				"input": [
					{
						"intent": "천식/COPD센터"
					}
				],
				"output": {
					"text": "천식 COPD센터는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971780946.jpg",
						"displayname": "WG207.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021209"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "천식 COPD센터는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971780946.jpg",
						"displayname": "WG207.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021209"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021209"
					}
				]
			},
			{
				"name": "호흡기검사실",
				"id": "default325",
				"filename": "default",
				"input": [
					{
						"intent": "호흡기검사실"
					}
				],
				"output": [
					{
						"text": "호흡기검사실은 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971806510.jpg",
							"displayname": "WG202.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021219"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021219"
					}
				]
			},
			{
				"name": "호흡기내과",
				"id": "default326",
				"filename": "default",
				"input": [
					{
						"intent": "호흡기내과"
					}
				],
				"output": [
					{
						"text": "호흡기내과는 서관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971833194.jpg",
							"displayname": "WG206.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021210"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021210"
					}
				]
			},
			{
				"name": "기독교원목실",
				"id": "default327",
				"filename": "default",
				"input": [
					{
						"intent": "기독교"
					},
					{
						"intent": "기독교원목실"
					}
				],
				"output": {
					"text": "기독교원목실은 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 기독교 종교시설 안내\n - 위치: 서관 3층 강당\n - 예배시간: 새벽예배 06:00, 수요예배 18:30, 주일예배 15:00 \n - 기도실: 24시간 개방\n - 문의처: 02-3010-7890 \n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971858814.jpg",
						"displayname": "WG307.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021169"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "기독교원목실은 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 기독교 종교시설 안내\n - 위치: 서관 3층 강당\n - 예배시간: 새벽예배 06:00, 수요예배 18:30, 주일예배 15:00 \n - 기도실: 24시간 개방\n - 문의처: 02-3010-7890 \n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971858814.jpg",
						"displayname": "WG307.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021169"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021169"
					}
				]
			},
			{
				"name": "마취통증의학과",
				"id": "default328",
				"filename": "default",
				"input": [
					{
						"intent": "마취통증의학과"
					}
				],
				"output": {
					"text": "마취통증의학과는 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971900640.jpg",
						"displayname": "WG308.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021168"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "마취통증의학과는 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971900640.jpg",
						"displayname": "WG308.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021168"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021168"
					}
				]
			},
			{
				"name": "불교법당",
				"id": "default329",
				"filename": "default",
				"input": [
					{
						"intent": "불교"
					},
					{
						"intent": "불교법당"
					}
				],
				"output": [
					{
						"text": "불교법당은 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 불교 종교시설 안내\n - 위치: 서관 3층 강당\n - 기도시간: 명상 04:30, 기도 11:00(평일)\n - 개방시간: 법당 24시간 개방\n - 문의처: 02-3010-7892\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971927277.jpg",
							"displayname": "WG305.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021171"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021171"
					}
				]
			},
			{
				"name": "서관 3층 강당",
				"id": "default330",
				"filename": "default",
				"input": [
					{
						"intent": "서관 3층 강당"
					}
				],
				"output": [
					{
						"text": "찾으시는 강당은 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505971963642.jpg",
							"displayname": "WG309.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021167"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021167"
					}
				]
			},
			{
				"name": "서관 중환자실",
				"id": "default331",
				"filename": "default",
				"input": [
					{
						"intent": "서관 중환자실"
					}
				],
				"output": {
					"text": "서관 중환자실은 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505971987008.jpg",
						"displayname": "WG302.jpg"
					},
					"buttons": [
						{
							"text": "서관 중환자실",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021174"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "서관 중환자실은 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505971987008.jpg",
						"displayname": "WG302.jpg"
					},
					"buttons": [
						{
							"text": "서관 중환자실",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021174"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "서관 중환자실",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021174"
					}
				]
			},
			{
				"name": "서관수술실",
				"id": "default332",
				"filename": "default",
				"input": [
					{
						"intent": "서관수술실"
					}
				],
				"output": {
					"text": "서관수술실은 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972012065.jpg",
						"displayname": "WG303.jpg"
					},
					"buttons": [
						{
							"text": "서관수술실",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021612"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "서관수술실은 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972012065.jpg",
						"displayname": "WG303.jpg"
					},
					"buttons": [
						{
							"text": "서관수술실",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021612"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "서관수술실",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021612"
					}
				]
			},
			{
				"name": "서관 중환자면회대기실",
				"id": "default333",
				"filename": "default",
				"input": [
					{
						"intent": "서관 중환자면회대기실"
					}
				],
				"output": {
					"text": "서관 중환자면회대기실은 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972040137.jpg",
						"displayname": "WG304.jpg"
					},
					"buttons": [
						{
							"text": "서관 중환자면회대기실",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021172"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "서관 중환자면회대기실은 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972040137.jpg",
						"displayname": "WG304.jpg"
					},
					"buttons": [
						{
							"text": "서관 중환자면회대기실",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021172"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "서관 중환자면회대기실",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021172"
					}
				]
			},
			{
				"name": "천주교원목실",
				"id": "default334",
				"filename": "default",
				"input": [
					{
						"intent": "천주교원목실"
					},
					{
						"intent": "천주교"
					}
				],
				"output": [
					{
						"text": "천주교원목실은 서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 천주교 종교 시설 안내\n • 미사시간\n  - 화, 수, 목요일 11:30(원목실)\n  - 금요일 11:50(원목실)\n  - 토요일 12:00(원목실)\n  - 주일 11:00(서관 3층 강당)\n • 개방시간: 성체조배실 24시간 개방 \n • 문의처: 02-3010-7891\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972064905.jpg",
							"displayname": "WG306.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021170"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021170"
					}
				]
			},
			{
				"name": "배변장애치료실",
				"id": "default335",
				"filename": "default",
				"input": [
					{
						"intent": "배변장애치료실"
					}
				],
				"output": {
					"text": "배변장애치료실은 서관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972116762.jpg",
						"displayname": "WG401.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021165"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "배변장애치료실은 서관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972116762.jpg",
						"displayname": "WG401.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021165"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021165"
					}
				]
			},
			{
				"name": "상부위장관내시경검사실",
				"id": "default336",
				"filename": "default",
				"input": [
					{
						"intent": "상부위장관내시경검사실"
					}
				],
				"output": [
					{
						"text": "상부위장관내시경검사실는 서관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972140971.jpg",
							"displayname": "WG407.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021159"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021159"
					}
				]
			},
			{
				"name": "췌담도검사실",
				"id": "default337",
				"filename": "default",
				"input": [
					{
						"intent": "췌담도검사실"
					}
				],
				"output": {
					"text": "췌담도검사실은 서관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972216095.jpg",
						"displayname": "WG404.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021163"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "췌담도검사실은 서관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972216095.jpg",
						"displayname": "WG404.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021163"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021163"
					}
				]
			},
			{
				"name": "하부위장관내시경검사실",
				"id": "default338",
				"filename": "default",
				"input": [
					{
						"intent": "하부위장관내시경검사실"
					}
				],
				"output": [
					{
						"text": "하부위장관내시경검사실은 서관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972239567.jpg",
							"displayname": "WG406.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021160"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021160"
					}
				]
			},
			{
				"name": "뷰티케어 샵",
				"id": "default339",
				"filename": "default",
				"input": [
					{
						"intent": "뷰티케어 샵"
					}
				],
				"output": [
					{
						"text": "뷰티케어 샵은 서관 5층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972270456.jpg",
							"displayname": "WG504.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021543"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021543"
					}
				]
			},
			{
				"name": "암병원 주사실",
				"id": "default340",
				"filename": "default",
				"input": [
					{
						"intent": "암병원 주사실"
					}
				],
				"output": {
					"text": "암병원 주사실 약도보기은 서관 5층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972291610.jpg",
						"displayname": "WG509.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021546"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "암병원 주사실 약도보기은 서관 5층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972291610.jpg",
						"displayname": "WG509.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021546"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021546"
					}
				]
			},
			{
				"name": "긴급진료실",
				"id": "default341",
				"filename": "default",
				"input": [
					{
						"intent": "긴급진료실"
					}
				],
				"output": {
					"text": "긴급진료실는 서관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972314915.jpg",
						"displayname": "WG602.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021458"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "긴급진료실는 서관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505972314915.jpg",
						"displayname": "WG602.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021458"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021458"
					}
				]
			},
			{
				"name": "단기병동",
				"id": "default342",
				"filename": "default",
				"input": [
					{
						"intent": "단기병동"
					}
				],
				"output": {
					"text": "단기병동(62병동)은 서관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972337427.jpg",
						"displayname": "WG604.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000026876"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "단기병동(62병동)은 서관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505972337427.jpg",
						"displayname": "WG604.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000026876"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000026876"
					}
				]
			},
			{
				"name": "병동Task-Task#S",
				"id": "default343",
				"filename": "default",
				"input": [
					{
						"regexp": "(?:\\s|^|제)(72|81|82|91|92|93|94|95|96|101|102|103|104|105|106|111|112|113|114|115|116|121|123|124|125|126|133|134|135|136|143|144|145|153|155|156|163|164|173|174|183|184)(\\s*(병동|동|번 병동)"
					}
				],
				"output": [
					{
						"text": "+1+",
						"kind": "Text"
					}
				],
				"task": "DongTask"
			},
			{
				"name": "방사선종양학과",
				"id": "default350",
				"filename": "default",
				"input": [
					{
						"intent": "방사선종양학과"
					}
				],
				"output": [
					{
						"text": "방사선종양학과는 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972388857.jpg",
							"displayname": "e_b1f06.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021141"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021141"
					}
				]
			},
			{
				"name": "의료용품점",
				"id": "default351",
				"filename": "default",
				"input": [
					{
						"intent": "의료용품점"
					}
				],
				"output": {
					"text": "의료용품점는 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 의료용품점 안내\n - 위치: 동관 지하 1층\n - 영업 / 운영 시간: 08:00 ~ 19:00(토요일 09 : 00 ~ 13 : 00 / 공휴일 휴무)\n - 문의처: 02-3010-6838\n\n처음으로 돌아가시려면 '처음'을, 이전 단계로 돌아가고 싶으시면 '이전'이라고 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972446803.jpg",
						"displayname": "e_b1f12.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021049"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "의료용품점는 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 의료용품점 안내\n - 위치: 동관 지하 1층\n - 영업 / 운영 시간: 08:00 ~ 19:00(토요일 09 : 00 ~ 13 : 00 / 공휴일 휴무)\n - 문의처: 02-3010-6838\n\n처음으로 돌아가시려면 '처음'을, 이전 단계로 돌아가고 싶으시면 '이전'이라고 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972446803.jpg",
						"displayname": "e_b1f12.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021049"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021049"
					}
				]
			},
			{
				"name": "현대드림투어",
				"id": "default352",
				"filename": "default",
				"input": [
					{
						"intent": "현대드림투어"
					}
				],
				"output": [
					{
						"text": "현대드림투어(여행사)는 동관 지하1층에 현대드림투어가 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972472506.jpg",
							"displayname": "e_b1f17.jpg"
						},
						"buttons": [
							{
								"text": "현대드림투어(여행사)",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021143"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "현대드림투어(여행사)",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021143"
					}
				]
			},
			{
				"name": "화원(꽃집)",
				"id": "default353",
				"filename": "default",
				"input": [
					{
						"intent": "화원(꽃집)"
					}
				],
				"output": [
					{
						"text": "화원(꽃집)은 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 꽃집 안내\n위치: 동관 지하1층\n영업시간: 08:00 ~ 19:30 (토 오전9시~ 오후3시)\n문의처: 02-3010-6881\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972497087.jpg",
							"displayname": "e_b1f05.jpg"
						},
						"buttons": [
							{
								"text": "화원(꽃집) 약도안내",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020906"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "화원(꽃집) 약도안내",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020906"
					}
				]
			},
			{
				"name": "휴대전화 대리점",
				"id": "default354",
				"filename": "default",
				"input": [
					{
						"intent": "휴대전화 대리점"
					}
				],
				"output": [
					{
						"text": "휴대전화 대리점은 동관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972518836.jpg",
							"displayname": "e_b1f10.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021051"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021051"
					}
				]
			},
			{
				"name": "가정의학과",
				"id": "default355",
				"filename": "default",
				"input": [
					{
						"intent": "가정의학과"
					}
				],
				"output": [
					{
						"text": "가정의학과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972541755.jpg",
							"displayname": "EG132.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021139"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021139"
					}
				]
			},
			{
				"name": "갤러리",
				"id": "default356",
				"filename": "default",
				"input": [
					{
						"intent": "갤러리"
					}
				],
				"output": [
					{
						"text": "갤러리 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972587204.jpg",
							"displayname": "EG104.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021092"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021092"
					}
				]
			},
			{
				"name": "내분비내과",
				"id": "default357",
				"filename": "default",
				"input": [
					{
						"intent": "내분비내과"
					}
				],
				"output": [
					{
						"text": "내분비내과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972609463.jpg",
							"displayname": "EG127.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021134"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021134"
					}
				]
			},
			{
				"name": "노년내과",
				"id": "default358",
				"filename": "default",
				"input": [
					{
						"intent": "노년내과"
					}
				],
				"output": [
					{
						"text": "노년내과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972633964.jpg",
							"displayname": "EG134.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021140"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021140"
					}
				]
			},
			{
				"name": "당뇨병센터",
				"id": "default359",
				"filename": "default",
				"input": [
					{
						"intent": "당뇨병센터"
					}
				],
				"output": [
					{
						"text": "당뇨병센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972656417.jpg",
							"displayname": "EG128.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021135"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021135"
					}
				]
			},
			{
				"name": "당뇨합병증검사실",
				"id": "default360",
				"filename": "default",
				"input": [
					{
						"intent": "당뇨합병증검사실"
					}
				],
				"output": [
					{
						"text": "당뇨합병증검사실은 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972677455.jpg",
							"displayname": "EG125.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021093"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021093"
					}
				]
			},
			{
				"name": "대동맥질환센터",
				"id": "default361",
				"filename": "default",
				"input": [
					{
						"intent": "대동맥질환센터"
					}
				],
				"output": [
					{
						"text": "대동맥질환센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972701056.jpg",
							"displayname": "EG109.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021102"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021102"
					}
				]
			},
			{
				"name": "동관 외래 촬영실",
				"id": "default362",
				"filename": "default",
				"input": [
					{
						"intent": "동관 외래 촬영실"
					}
				],
				"output": [
					{
						"text": "동관 외래 촬영실는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972723562.jpg",
							"displayname": "EG123.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021131"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021131"
					}
				]
			},
			{
				"name": "동관 처음 오신 분 창구",
				"id": "default363",
				"filename": "default",
				"input": [
					{
						"intent": "동관 처음 오신 분 창구"
					}
				],
				"output": [
					{
						"text": "동관 처음 오신 분 창구는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972822842.jpg",
							"displayname": "EG103.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021451"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021451"
					}
				]
			},
			{
				"name": "마르판클리닉",
				"id": "default364",
				"filename": "default",
				"input": [
					{
						"intent": "마르판클리닉"
					}
				],
				"output": [
					{
						"text": "마르판클리닉은 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972848831.jpg",
							"displayname": "Marfan.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000045818_AxZtnQ"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000045818_AxZtnQ"
					}
				]
			},
			{
				"name": "말초혈관질환센터",
				"id": "default365",
				"filename": "default",
				"input": [
					{
						"intent": "말초혈관질환센터"
					}
				],
				"output": [
					{
						"text": "말초혈관질환센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972871557.jpg",
							"displayname": "EG108.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021100"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021100"
					}
				]
			},
			{
				"name": "신경과",
				"id": "default367",
				"filename": "default",
				"input": [
					{
						"intent": "신경과"
					}
				],
				"output": [
					{
						"text": "신경과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505975319273.jpg",
							"displayname": "EG122.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021129"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021129"
					}
				]
			},
			{
				"name": "신경외과",
				"id": "default368",
				"filename": "default",
				"input": [
					{
						"intent": "신경외과"
					}
				],
				"output": {
					"text": "신경외과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505975352010.jpg",
						"displayname": "EG120.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021120"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "신경외과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505975352010.jpg",
						"displayname": "EG120.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021120"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021120"
					}
				]
			},
			{
				"name": "신장내과",
				"id": "default369",
				"filename": "default",
				"input": [
					{
						"intent": "신장내과"
					}
				],
				"output": [
					{
						"text": "신장내과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505975378899.jpg",
							"displayname": "EG124.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021132"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021132"
					}
				]
			},
			{
				"name": "심방세동센터",
				"id": "default370",
				"filename": "default",
				"input": [
					{
						"intent": "심방세동센터"
					}
				],
				"output": [
					{
						"text": "심방세동센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505975410966.jpg",
							"displayname": "EG107.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021099"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021099"
					}
				]
			},
			{
				"name": "심부전/심장이식센터",
				"id": "default371",
				"filename": "default",
				"input": [
					{
						"intent": "심부전/심장이식센터"
					}
				],
				"output": [
					{
						"text": "심부전/심장이식센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505975447551.jpg",
							"displayname": "EG114.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021109"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021109"
					}
				]
			},
			{
				"name": "심장내과",
				"id": "default372",
				"filename": "default",
				"input": [
					{
						"intent": "심장내과"
					}
				],
				"output": [
					{
						"text": "심장내과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505975594574.jpg",
							"displayname": "EG117.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021114"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021114"
					}
				]
			},
			{
				"name": "심장병예방재활센터",
				"id": "default373",
				"filename": "default",
				"input": [
					{
						"intent": "심장병예방재활센터"
					}
				],
				"output": [
					{
						"text": "심장병예방재활센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505975826517.jpg",
							"displayname": "EG113.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021108"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021108"
					}
				]
			},
			{
				"name": "심장병원",
				"id": "default374",
				"filename": "default",
				"input": [
					{
						"intent": "심장병원"
					}
				],
				"output": [
					{
						"text": "심장병원은 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505975859872.jpg",
							"displayname": "EG118.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021115"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021115"
					}
				]
			},
			{
				"name": "심장영상센터",
				"id": "default375",
				"filename": "default",
				"input": [
					{
						"intent": "심장영상센터"
					}
				],
				"output": [
					{
						"text": "심장영상센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505975885630.jpg",
							"displayname": "EG112.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021106"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021106"
					}
				]
			},
			{
				"name": "심장외과",
				"id": "default376",
				"filename": "default",
				"input": [
					{
						"intent": "심장외과"
					}
				],
				"output": [
					{
						"text": "심장외과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505975914920.jpg",
							"displayname": "EG116.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021113"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021113"
					}
				]
			},
			{
				"name": "유헬스센터",
				"id": "default377",
				"filename": "default",
				"input": [
					{
						"intent": "유헬스센터"
					}
				],
				"output": [
					{
						"text": "유헬스센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505975963613.jpg",
							"displayname": "EG126.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021133"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021133"
					}
				]
			},
			{
				"name": "동관 의무기록/영상사본발급",
				"id": "default378",
				"filename": "default",
				"input": [
					{
						"intent": "동관 의무기록/영상사본발급"
					}
				],
				"output": {
					"text": "동관 의무기록/영상사본발급처는  동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n발급절차에 대해 알고싶으시면 '알려줘'라고 입력하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505975997508.jpg",
						"displayname": "EG136.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000023317"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "dialog_default1128",
						"id": "default1128",
						"filename": "default",
						"input": [
							{
								"text": "알다"
							}
						],
						"output": [
							{
								"text": "call to 발급절차",
								"kind": "Text"
							}
						]
					}
				],
				"task": {
					"text": "동관 의무기록/영상사본발급처는  동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n발급절차에 대해 알고싶으시면 '알려줘'라고 입력하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505975997508.jpg",
						"displayname": "EG136.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000023317"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000023317"
					}
				]
			},
			{
				"name": "정형외과",
				"id": "default379",
				"filename": "default",
				"input": [
					{
						"intent": "정형외과"
					}
				],
				"output": {
					"text": "정형외과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505976023335.jpg",
						"displayname": "EG130.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021137"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "정형외과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505976023335.jpg",
						"displayname": "EG130.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021137"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021137"
					}
				]
			},
			{
				"name": "진료안내 창구",
				"id": "default380",
				"filename": "default",
				"input": [
					{
						"intent": "진료안내 창구"
					}
				],
				"output": [
					{
						"text": "진료안내는 동관 1층 로비 안내 데스크에 있는 진료안내 창구로 가시면 됩니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976046843.jpg",
							"displayname": "EG102.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021450"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021450"
					}
				]
			},
			{
				"name": "파킨슨병센터",
				"id": "default381",
				"filename": "default",
				"input": [
					{
						"intent": "파킨슨병센터"
					}
				],
				"output": [
					{
						"text": "파킨슨병센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976070332.jpg",
							"displayname": "EG121.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021128"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021128"
					}
				]
			},
			{
				"name": "판막질환센터",
				"id": "default382",
				"filename": "default",
				"input": [
					{
						"intent": "판막질환센터"
					}
				],
				"output": [
					{
						"text": "판막질환센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976098336.jpg",
							"displayname": "EG111.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021104"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021104"
					}
				]
			},
			{
				"name": "평생건강클리닉",
				"id": "default383",
				"filename": "default",
				"input": [
					{
						"intent": "평생건강클리닉"
					}
				],
				"output": [
					{
						"text": "평생건강클리닉 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976125938.jpg",
							"displayname": "EG133.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021453"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021453"
					}
				]
			},
			{
				"name": "폐고혈압/정맥혈전센터",
				"id": "default384",
				"filename": "default",
				"input": [
					{
						"intent": "폐고혈압/정맥혈전센터"
					}
				],
				"output": [
					{
						"text": "폐고혈압/정맥혈전센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976158108.jpg",
							"displayname": "EG105.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021096"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021096"
					}
				]
			},
			{
				"name": "혈관외과",
				"id": "default385",
				"filename": "default",
				"input": [
					{
						"intent": "혈관외과"
					}
				],
				"output": [
					{
						"text": "혈관외과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976186449.jpg",
							"displayname": "EG115.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021111"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021111"
					}
				]
			},
			{
				"name": "협십증/심근경색센터",
				"id": "default386",
				"filename": "default",
				"input": [
					{
						"intent": "협십증/심근경색센터"
					}
				],
				"output": [
					{
						"text": "협십증/심근경색센터는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976215409.jpg",
							"displayname": "EG106.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021097"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021097"
					}
				]
			},
			{
				"name": "감마나이프센터",
				"id": "default387",
				"filename": "default",
				"input": [
					{
						"intent": "감마나이프센터"
					}
				],
				"output": [
					{
						"text": "감마나이프센터는 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976246591.jpg",
							"displayname": "EG215.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021125"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021125"
					}
				]
			},
			{
				"name": "뇌신경검사실",
				"id": "default388",
				"filename": "default",
				"input": [
					{
						"intent": "뇌신경검사실"
					}
				],
				"output": [
					{
						"text": "뇌신경검사실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976280047.jpg",
							"displayname": "EG206.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021076"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021076"
					}
				]
			},
			{
				"name": "동관 MR실",
				"id": "default389",
				"filename": "default",
				"input": [
					{
						"intent": "동관 MR실"
					}
				],
				"output": {
					"text": "동관 MR실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505976308053.jpg",
						"displayname": "EG217.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020183"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "동관 MR실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505976308053.jpg",
						"displayname": "EG217.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020183"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000020183"
					}
				]
			},
			{
				"name": "동관 PET 검사실",
				"id": "default390",
				"filename": "default",
				"input": [
					{
						"intent": "동관 PET 검사실"
					}
				],
				"output": [
					{
						"text": "동관 PET 검사실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976348622.jpg",
							"displayname": "EG214.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021117"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021117"
					}
				]
			},
			{
				"name": "동관 일반촬영실",
				"id": "default391",
				"filename": "default",
				"input": [
					{
						"intent": "동관 일반촬영실"
					}
				],
				"output": [
					{
						"text": "동관 일반촬영실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976385909.jpg",
							"displayname": "EG213.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021671"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021671"
					}
				]
			},
			{
				"name": "동관 핵의학과 영상검사실",
				"id": "default392",
				"filename": "default",
				"input": [
					{
						"intent": "동관 핵의학과 영상검사실"
					}
				],
				"output": {
					"text": "동관 핵의학과 영상검사실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505976424855.jpg",
						"displayname": "EG208.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021083"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "동관 핵의학과 영상검사실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505976424855.jpg",
						"displayname": "EG208.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021083"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021083"
					}
				]
			},
			{
				"name": "동관 핵의학과 혈액검사실",
				"id": "default393",
				"filename": "default",
				"input": [
					{
						"intent": "동관 핵의학과 혈액검사실"
					}
				],
				"output": [
					{
						"text": "동관 핵의학과 혈액검사실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976450316.jpg",
							"displayname": "EG210.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021088"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021088"
					}
				]
			},
			{
				"name": "수면다원검사실",
				"id": "default394",
				"filename": "default",
				"input": [
					{
						"intent": "수면다원검사실"
					}
				],
				"output": [
					{
						"text": "수면다원검사실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976473024.jpg",
							"displayname": "EG205.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021074"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021074"
					}
				]
			},
			{
				"name": "신경중재클리닉",
				"id": "default395",
				"filename": "default",
				"input": [
					{
						"intent": "신경중재클리닉"
					}
				],
				"output": [
					{
						"text": "신경중재클리닉는 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976495572.jpg",
							"displayname": "EG211.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021127"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021127"
					}
				]
			},
			{
				"name": "심장검사실(심전도, 홀터, 운동부하)",
				"id": "default396",
				"filename": "default",
				"input": [
					{
						"intent": "심장검사실(심전도, 홀터, 운동부하)"
					}
				],
				"output": [
					{
						"text": "심장검사실(심전도, 홀터, 운동부하)은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976520954.jpg",
							"displayname": "EG203.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021061"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021061"
					}
				]
			},
			{
				"name": "심장재활검사실",
				"id": "default397",
				"filename": "default",
				"input": [
					{
						"intent": "심장재활검사실"
					}
				],
				"output": [
					{
						"text": "심장재활검사실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976547906.jpg",
							"displayname": "EG201.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021055"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021055"
					}
				]
			},
			{
				"name": "심전도실",
				"id": "default398",
				"filename": "default",
				"input": [
					{
						"intent": "심전도실"
					}
				],
				"output": [
					{
						"text": "심전도실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976570606.jpg",
							"displayname": "EG202.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021058"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021058"
					}
				]
			},
			{
				"name": "영상의학과 외래",
				"id": "default399",
				"filename": "default",
				"input": [
					{
						"intent": "영상의학과 외래"
					}
				],
				"output": {
					"text": "영상의학과(외래)는 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505976593968.jpg",
						"displayname": "e_2f_012.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021107"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "영상의학과(외래)는 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505976593968.jpg",
						"displayname": "e_2f_012.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021107"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021107"
					}
				]
			},
			{
				"name": "혈관검사실",
				"id": "default400",
				"filename": "default",
				"input": [
					{
						"intent": "혈관검사실"
					}
				],
				"output": [
					{
						"text": "혈관검사실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976630508.jpg",
							"displayname": "EG204.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021064"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021064"
					}
				]
			},
			{
				"name": "혈관조영실",
				"id": "default401",
				"filename": "default",
				"input": [
					{
						"intent": "혈관조영실"
					}
				],
				"output": [
					{
						"text": "혈관조영실은 동관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976655143.jpg",
							"displayname": "EG216.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021091"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021091"
					}
				]
			},
			{
				"name": "동관 수술실",
				"id": "default402",
				"filename": "default",
				"input": [
					{
						"intent": "동관 수술실"
					}
				],
				"output": [
					{
						"text": "동관 수술실은 동관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505976681667.jpg",
							"displayname": "EG301.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021053"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021053"
					}
				]
			},
			{
				"name": "동관 중환자실",
				"id": "default403",
				"filename": "default",
				"input": [
					{
						"intent": "동관 중환자실"
					}
				],
				"output": {
					"text": "동관 중환자실은 동관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505976703932.jpg",
						"displayname": "EG303.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000031648"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "동관 중환자실은 동관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505976703932.jpg",
						"displayname": "EG303.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000031648"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000031648"
					}
				]
			},
			{
				"name": "심장병원 당일입원실",
				"id": "default404",
				"filename": "default",
				"input": [
					{
						"intent": "심장병원 당일입원실"
					}
				],
				"output": {
					"text": "심장병원 당일입원실은 동관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505978091664.jpg",
						"displayname": "EG304.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021054"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "심장병원 당일입원실은 동관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505978091664.jpg",
						"displayname": "EG304.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021054"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021054"
					}
				]
			},
			{
				"name": "심혈관조영실",
				"id": "default405",
				"filename": "default",
				"input": [
					{
						"intent": "심혈관조영실"
					}
				],
				"output": [
					{
						"text": "심혈관조영실은 동관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505978115978.jpg",
							"displayname": "EG305.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021089"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021089"
					}
				]
			},
			{
				"name": "전기생리학 검사실",
				"id": "default406",
				"filename": "default",
				"input": [
					{
						"intent": "전기생리학 검사실"
					}
				],
				"output": [
					{
						"text": "전기생리학 검사실은 동관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505978139842.jpg",
							"displayname": "EG306.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021452"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021452"
					}
				]
			},
			{
				"name": "동관 중환자면회대기실",
				"id": "default407",
				"filename": "default",
				"input": [
					{
						"intent": "동관 중환자면회대기실"
					}
				],
				"output": [
					{
						"text": "동관 중환자면회대기실은 동관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505978178968.jpg",
							"displayname": "EG302.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021095"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021095"
					}
				]
			},
			{
				"name": "병리과",
				"id": "default408",
				"filename": "default",
				"input": [
					{
						"intent": "병리과"
					}
				],
				"output": [
					{
						"text": "병리과는 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505978203835.jpg",
							"displayname": "EG409.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021063"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021063"
					}
				]
			},
			{
				"name": "비뇨기검사실",
				"id": "default409",
				"filename": "default",
				"input": [
					{
						"intent": "비뇨기과검사실"
					}
				],
				"output": {
					"text": "비뇨기검사실은 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505978228667.jpg",
						"displayname": "EG402.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021072"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "비뇨기검사실은 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505978228667.jpg",
						"displayname": "EG402.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021072"
						},
						{
							"text": "이전"
						},
						{
							"text": "처음"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021072"
					}
				]
			},
			{
				"name": "비뇨기과",
				"id": "default411",
				"filename": "default",
				"input": [
					{
						"intent": "비뇨기과"
					}
				],
				"output": [
					{
						"text": "비뇨기과는 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979301319.jpg",
							"displayname": "EG403.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021454"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021454"
					}
				]
			},
			{
				"name": "세침흡인실",
				"id": "default412",
				"filename": "default",
				"input": [
					{
						"intent": "세침흡인실"
					}
				],
				"output": [
					{
						"text": "세침흡인실은 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979330652.jpg",
							"displayname": "EG408.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021065"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021065"
					}
				]
			},
			{
				"name": "스포츠건강의학센터",
				"id": "default413",
				"filename": "default",
				"input": [
					{
						"intent": "스포츠건강의학센터"
					}
				],
				"output": [
					{
						"text": "스포츠건강의학센터는 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979446265.jpg",
							"displayname": "EG413.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021057"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021057"
					}
				]
			},
			{
				"name": "심장초음파 검사실",
				"id": "default414",
				"filename": "default",
				"input": [
					{
						"intent": "심장초음파 검사실"
					}
				],
				"output": [
					{
						"text": "심장초음파 검사실은 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979469505.jpg",
							"displayname": "EG406.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021068"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021068"
					}
				]
			},
			{
				"name": "인공신장실",
				"id": "default415",
				"filename": "default",
				"input": [
					{
						"intent": "인공신장실"
					}
				],
				"output": [
					{
						"text": "인공신장실은 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979492136.jpg",
							"displayname": "EG401.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021073"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021073"
					}
				]
			},
			{
				"name": "재활치료실",
				"id": "default416",
				"filename": "default",
				"input": [
					{
						"intent": "재활치료실"
					}
				],
				"output": [
					{
						"text": "재활치료실은 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979515574.jpg",
							"displayname": "EG405.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021144"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021144"
					}
				]
			},
			{
				"name": "전립선센터",
				"id": "default417",
				"filename": "default",
				"input": [
					{
						"intent": "전립선센터"
					}
				],
				"output": [
					{
						"text": "전립선센터는 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979549093.jpg",
							"displayname": "EG404.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021070"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021070"
					}
				]
			},
			{
				"name": "정신건강의학과",
				"id": "default418",
				"filename": "default",
				"input": [
					{
						"intent": "정신건강의학과"
					}
				],
				"output": [
					{
						"text": "정신건강의학과는 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979571949.jpg",
							"displayname": "EG411.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021060"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021060"
					}
				]
			},
			{
				"name": "조직세포자원센터",
				"id": "default419",
				"filename": "default",
				"input": [
					{
						"intent": "조직세포자원센터"
					}
				],
				"output": [
					{
						"text": "조직세포자원센터는 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979599962.jpg",
							"displayname": "EG410.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021062"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021062"
					}
				]
			},
			{
				"name": "헌혈실",
				"id": "default420",
				"filename": "default",
				"input": [
					{
						"intent": "헌혈실"
					}
				],
				"output": [
					{
						"text": "헌혈실은 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979625578.jpg",
							"displayname": "EG407.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021067"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021067"
					}
				]
			},
			{
				"name": "혈액은행",
				"id": "default421",
				"filename": "default",
				"input": [
					{
						"intent": "혈액은행"
					}
				],
				"output": [
					{
						"text": "혈액은행은 동관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979649708.jpg",
							"displayname": "e_4f_007.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021066"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021066"
					}
				]
			},
			{
				"name": "동관 대강당",
				"id": "default422",
				"filename": "default",
				"input": [
					{
						"intent": "동관 대강당"
					}
				],
				"output": [
					{
						"text": "동관 대강당은 동관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979687345.jpg",
							"displayname": "EG623.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021101"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021101"
					}
				]
			},
			{
				"name": "동관 소강당",
				"id": "default423",
				"filename": "default",
				"input": [
					{
						"intent": "동관 소강당"
					}
				],
				"output": [
					{
						"text": "동관 소강당은 동관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979711479.jpg",
							"displayname": "EG619.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021078"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021078"
					}
				]
			},
			{
				"name": "전시실",
				"id": "default424",
				"filename": "default",
				"input": [
					{
						"intent": "전시실"
					}
				],
				"output": [
					{
						"text": "전시실은 동관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505979738713.jpg",
							"displayname": "EG620.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021077"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021077"
					}
				]
			},
			{
				"name": "세미나실Task-세미나#S",
				"id": "default425",
				"filename": "default",
				"input": [
					{
						"regexp": "(?:\\s|^|제)(1|2|3|4|5|6|7)\\s*(세미나실|번 세미나|호 세미나실| 세미나)"
					},
					{
						"regexp": "(?:세미나실|세미나)(?:\\s)?(1|2|3|5|6|7)(?:\\s|번|호|$)"
					}
				],
				"output": [
					{
						"text": "+1+",
						"kind": "Text"
					}
				],
				"task": {
					"name": "SeminarTask"
				}
			},
			{
				"name": "조혈모세포 검사실",
				"id": "default426",
				"filename": "default",
				"input": [
					{
						"intent": "조혈모세포 검사실"
					}
				],
				"output": [
					{
						"text": "조혈모세포 검사실은 동관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505980278939.JPG",
							"displayname": "east6F.JPG"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021118"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021118"
					}
				]
			},
			{
				"name": "비디오뇌파검사실",
				"id": "default427",
				"filename": "default",
				"input": [
					{
						"intent": "비디오뇌파검사실"
					}
				],
				"output": [
					{
						"text": "비디오뇌파검사실은 동관 14층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505981926919.jpg",
							"displayname": "EG144.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021122"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021122"
					}
				]
			},
			{
				"name": "뇌졸중센터 집중치료실",
				"id": "default428",
				"filename": "default",
				"input": [
					{
						"intent": "뇌졸중센터 집중치료실"
					}
				],
				"output": [
					{
						"text": "뇌졸중센터 집중치료실은 동관 15층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505982093198.jpg",
							"displayname": "EG154.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021124"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021124"
					}
				]
			},
			{
				"name": "멀티플라자",
				"id": "default429",
				"filename": "default",
				"input": [
					{
						"intent": "멀티플라자"
					}
				],
				"output": [
					{
						"text": "멀티플라자는 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505993041837.jpg",
							"displayname": "NWB1F06.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=174"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=174"
					}
				]
			},
			{
				"name": "문구점",
				"id": "default430",
				"filename": "default",
				"input": [
					{
						"intent": "문구점"
					}
				],
				"output": {
					"text": "문구점은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 문구점 안내\n - 위치: 신관 지하1층\n - 영업 / 운영시간: 08:00 ~ 19:30(토요일 17:00)\n - 문의처: 02-3010-7882\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1506299174924.jpg",
						"displayname": "NWB1F07.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=176"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "문구점은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 문구점 안내\n - 위치: 신관 지하1층\n - 영업 / 운영시간: 08:00 ~ 19:30(토요일 17:00)\n - 문의처: 02-3010-7882\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1506299174924.jpg",
						"displayname": "NWB1F07.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=176"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=176"
					}
				]
			},
			{
				"name": "서점",
				"id": "default431",
				"filename": "default",
				"input": [
					{
						"intent": "서점"
					}
				],
				"output": {
					"text": "서점은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 서점 안내\n - 위치: 신관 지하1층\n - 영업 / 운영시간: 08:00 ~ 19:30(토요일 17:00)\n - 문의처: 02-3010-7882\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505993107746.jpg",
						"displayname": "NWB1F07.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=176"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "서점은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 서점 안내\n - 위치: 신관 지하1층\n - 영업 / 운영시간: 08:00 ~ 19:30(토요일 17:00)\n - 문의처: 02-3010-7882\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505993107746.jpg",
						"displayname": "NWB1F07.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=176"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=176"
					}
				]
			},
			{
				"name": "미용실",
				"id": "default433",
				"filename": "default",
				"input": [
					{
						"intent": "미용실"
					}
				],
				"output": {
					"text": "미용실은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 미용실 안내\n위치: 신관 지하1층\n영업 / 운영시간: 10:00 ~ 20:00(토요일 10:00 ~ 18:00 / 공휴일 휴무)\n문의처: 02-3010-7869\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1506299230577.jpg",
						"displayname": "NWB1F08.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=178"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "미용실은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 미용실 안내\n위치: 신관 지하1층\n영업 / 운영시간: 10:00 ~ 20:00(토요일 10:00 ~ 18:00 / 공휴일 휴무)\n문의처: 02-3010-7869\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1506299230577.jpg",
						"displayname": "NWB1F08.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=178"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=178"
					}
				]
			},
			{
				"name": "보호자세탁실",
				"id": "default434",
				"filename": "default",
				"input": [
					{
						"intent": "보호자세탁실"
					}
				],
				"output": {
					"text": "보호자세탁실은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 세탁실 안내\n - 위치: 신관 지하1층\n - 영업시간: 24시간(연중무휴)\n - 이용방법 및 요금: 셀프 / 3천원 \n - 문의처: 02-3010-7845 \n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505993155562.jpg",
						"displayname": "NWB1F01.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=181"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "보호자세탁실은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 세탁실 안내\n - 위치: 신관 지하1층\n - 영업시간: 24시간(연중무휴)\n - 이용방법 및 요금: 셀프 / 3천원 \n - 문의처: 02-3010-7845 \n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505993155562.jpg",
						"displayname": "NWB1F01.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=181"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=181"
					}
				]
			},
			{
				"name": "신관 MR실(지하)",
				"id": "default436",
				"filename": "default",
				"input": [
					{
						"intent": "신관 MR실(지하)"
					}
				],
				"output": [
					{
						"text": "신관 MR실(지하)은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505993184920.jpg",
							"displayname": "NWB1F15.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=182"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=182"
					}
				]
			},
			{
				"name": "신관 PET 검사실",
				"id": "default437",
				"filename": "default",
				"input": [
					{
						"intent": "신관 PET 검사실"
					}
				],
				"output": {
					"text": "신관 PET 검사실은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505993239052.jpg",
						"displayname": "NWB1F14.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=183"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "신관 PET 검사실은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505993239052.jpg",
						"displayname": "NWB1F14.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=183"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=183"
					}
				]
			},
			{
				"name": "안경점",
				"id": "default438",
				"filename": "default",
				"input": [
					{
						"intent": "안경점"
					}
				],
				"output": {
					"text": "안경점은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 안경점 안내\n - 위치: 신관 지하1층\n - 영업 / 운영시간: 09:00 ~ 19:00(공휴일 휴무)\n - 문의처: 02-3010-7873\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505993300066.jpg",
						"displayname": "NWB1F06.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=177"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "안경점은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 안경점 안내\n - 위치: 신관 지하1층\n - 영업 / 운영시간: 09:00 ~ 19:00(공휴일 휴무)\n - 문의처: 02-3010-7873\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505993300066.jpg",
						"displayname": "NWB1F06.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=177"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=177"
					}
				]
			},
			{
				"name": "우체국",
				"id": "default439",
				"filename": "default",
				"input": [
					{
						"intent": "우체국"
					}
				],
				"output": [
					{
						"text": "우체국은 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 우체국 안내\n - 영업 / 운영시간 : 09:00 ~ 18:00(토요일, 공휴일 휴무)\n - 위치 : 신관 지하1층\n - 문의 : 02-3010-7888\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505993320480.jpg",
							"displayname": "NWB1F11.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=186"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=186"
					}
				]
			},
			{
				"name": "의학유전학센터",
				"id": "default440",
				"filename": "default",
				"input": [
					{
						"intent": "의학유전학센터"
					}
				],
				"output": [
					{
						"text": "의학유전학센터는 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505993354072.jpg",
							"displayname": "NWB1F13.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=187"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=187"
					}
				]
			},
			{
				"name": "이발소",
				"id": "default441",
				"filename": "default",
				"input": [
					{
						"intent": "이발소"
					}
				],
				"output": {
					"text": "이발소는 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 이발소 안내\n위치: 신관 지하1층\n영업 / 운영시간: 08:00 ~ 20:00(토요일 18:00)\n문의처: 02-3010-7866\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505993375091.jpg",
						"displayname": "NWB1F09.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=188"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "이발소는 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n■ 이발소 안내\n위치: 신관 지하1층\n영업 / 운영시간: 08:00 ~ 20:00(토요일 18:00)\n문의처: 02-3010-7866\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505993375091.jpg",
						"displayname": "NWB1F09.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=188"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=188"
					}
				]
			},
			{
				"name": "진료의뢰협력센터",
				"id": "default442",
				"filename": "default",
				"input": [
					{
						"intent": "진료의뢰협력센터"
					}
				],
				"output": {
					"text": "진료의뢰협력센터는 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505993398988.jpg",
						"displayname": "NWB1F02.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=192"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "진료의뢰협력센터는 신관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1505993398988.jpg",
						"displayname": "NWB1F02.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=192"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=192"
					}
				]
			},
			{
				"name": "산부인과",
				"id": "default443",
				"filename": "default",
				"input": [
					{
						"intent": "산부인과"
					}
				],
				"output": [
					{
						"text": "산부인과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505993417797.jpg",
							"displayname": "NW107.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=193"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=193"
					}
				]
			},
			{
				"name": "소아 재활치료실",
				"id": "default444",
				"filename": "default",
				"input": [
					{
						"intent": "소아 재활치료실"
					}
				],
				"output": [
					{
						"text": "소아 재활치료실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504867222311.jpg",
							"displayname": "NW109.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=196"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=196"
					}
				]
			},
			{
				"name": "소아 주사실",
				"id": "default445",
				"filename": "default",
				"input": [
					{
						"intent": "소아 주사실"
					}
				],
				"output": {
					"text": "소아 주사실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867283277.jpg",
						"displayname": "NW111.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=227"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아 주사실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867283277.jpg",
						"displayname": "NW111.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=227"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=227"
					}
				]
			},
			{
				"name": "소아 당뇨클리닉",
				"id": "default446",
				"filename": "default",
				"input": [
					{
						"intent": "소아 당뇨클리닉"
					}
				],
				"output": {
					"text": "소아 당뇨클리닉은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867320169.jpg",
						"displayname": "NW117.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=221"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아 당뇨클리닉은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867320169.jpg",
						"displayname": "NW117.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=221"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=221"
					}
				]
			},
			{
				"name": "소아 심장검사실",
				"id": "default447",
				"filename": "default",
				"input": [
					{
						"intent": "소아 심장검사실"
					}
				],
				"output": {
					"text": "소아 심장검사실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867362919.jpg",
						"displayname": "NW112.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=225"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아 심장검사실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867362919.jpg",
						"displayname": "NW112.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=225"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=225"
					}
				]
			},
			{
				"name": "소아 심전도검사실",
				"id": "default448",
				"filename": "default",
				"input": [
					{
						"intent": "소아 심전도검사실"
					}
				],
				"output": {
					"text": "소아 심전도검사실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867391402.jpg",
						"displayname": "NW113.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=226"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아 심전도검사실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867391402.jpg",
						"displayname": "NW113.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=226"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=226"
					}
				]
			},
			{
				"name": "소아외과",
				"id": "default449",
				"filename": "default",
				"input": [
					{
						"intent": "소아외과"
					}
				],
				"output": {
					"text": "소아외과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867419322.jpg",
						"displayname": "NW133.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=205"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아외과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867419322.jpg",
						"displayname": "NW133.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=205"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=205"
					}
				]
			},
			{
				"name": "소아응급센터",
				"id": "default450",
				"filename": "default",
				"input": [
					{
						"intent": "소아응급센터"
					}
				],
				"output": {
					"text": "소아응급센터는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867455432.jpg",
						"displayname": "NW102.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=194"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아응급센터는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1504867455432.jpg",
						"displayname": "NW102.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=194"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=194"
					}
				]
			},
			{
				"name": "소아천식아토피센터",
				"id": "default451",
				"filename": "default",
				"input": [
					{
						"intent": "소아천식아토피센터"
					}
				],
				"output": {
					"text": "소아천식아토피센터는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867480743.jpg",
						"displayname": "NW114.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=224"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아천식아토피센터는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867480743.jpg",
						"displayname": "NW114.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=224"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=224"
					}
				]
			},
			{
				"name": "소아청소년 감염과",
				"id": "default452",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 감염과"
					}
				],
				"output": {
					"text": "소아청소년 감염과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867554969.jpg",
						"displayname": "NW126.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=212"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아청소년 감염과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867554969.jpg",
						"displayname": "NW126.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=212"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=212"
					}
				]
			},
			{
				"name": "소아청소년 내분비대사과",
				"id": "default453",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 내분비대사과"
					}
				],
				"output": {
					"text": "소아청소년 내분비대사과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867587540.jpg",
						"displayname": "NW132.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=206"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아청소년 내분비대사과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867587540.jpg",
						"displayname": "NW132.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=206"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=206"
					}
				]
			},
			{
				"name": "소아청소년 비뇨기과",
				"id": "default454",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 비뇨기과"
					}
				],
				"output": {
					"text": "소아청소년 비뇨기과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867663194.jpg",
						"displayname": "NW122.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=216"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아청소년 비뇨기과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867663194.jpg",
						"displayname": "NW122.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=216"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=216"
					}
				]
			},
			{
				"name": "소아청소년 소화기 영양과",
				"id": "default455",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 소화기 영양과"
					}
				],
				"output": {
					"text": "소아청소년 소화기 영양과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867688992.jpg",
						"displayname": "NW129.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=209"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아청소년 소화기 영양과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867688992.jpg",
						"displayname": "NW129.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=209"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=209"
					}
				]
			},
			{
				"name": "소아청소년 신경과",
				"id": "default456",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 신경과"
					}
				],
				"output": {
					"text": "소아청소년 신경과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867712956.jpg",
						"displayname": "NW130.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=208"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아청소년 신경과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867712956.jpg",
						"displayname": "NW130.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=208"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=208"
					}
				]
			},
			{
				"name": "소아청소년 신경외과",
				"id": "default457",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 신경외과"
					}
				],
				"output": {
					"text": "소아청소년 신경외과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867744684.jpg",
						"displayname": "NW123.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=215"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아청소년 신경외과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867744684.jpg",
						"displayname": "NW123.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=215"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=215"
					}
				]
			},
			{
				"name": "소아청소년 신장과",
				"id": "default458",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 신장과"
					}
				],
				"output": [
					{
						"text": "소아청소년 신장과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504867771046.jpg",
							"displayname": "NW131.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=207"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=207"
					}
				]
			},
			{
				"name": "소아청소년 심장과",
				"id": "default459",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 심장과"
					}
				],
				"output": [
					{
						"text": "소아청소년 심장과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504867802642.jpg",
							"displayname": "NW118.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=220"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=220"
					}
				]
			},
			{
				"name": "소아청소년 심장외과",
				"id": "default460",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 심장외과"
					}
				],
				"output": [
					{
						"text": "소아청소년 심장외과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504867830311.jpg",
							"displayname": "NW116.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=222"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=222"
					}
				]
			},
			{
				"name": "소아청소년 안과",
				"id": "default461",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 안과"
					}
				],
				"output": {
					"text": "소아청소년 안과는 신관 1층에 있습니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=364"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아청소년 안과는 신관 1층에 있습니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=364"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=364"
					}
				]
			},
			{
				"name": "소아청소년 암센터",
				"id": "default462",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 암센터"
					}
				],
				"output": {
					"text": "소아청소년 암센터는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867891814.jpg",
						"displayname": "NW115.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=223"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아청소년 암센터는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867891814.jpg",
						"displayname": "NW115.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=223"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=223"
					}
				]
			},
			{
				"name": "소아청소년 영상의학과",
				"id": "default464",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 영상의학과"
					}
				],
				"output": {
					"text": "소아청소년 영상의학과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867925933.jpg",
						"displayname": "NW120.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=218"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아청소년 영상의학과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504867925933.jpg",
						"displayname": "NW120.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=218"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=218"
					}
				]
			},
			{
				"name": "소아청소년 일반과",
				"id": "default465",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 일반과"
					}
				],
				"output": [
					{
						"text": "소아청소년 일반과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504867954168.jpg",
							"displayname": "NW127.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=211"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=211"
					}
				]
			},
			{
				"name": "소아청소년 재활의학과",
				"id": "default466",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 재활의학과"
					}
				],
				"output": [
					{
						"text": "소아청소년 재활의학과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504867977966.jpg",
							"displayname": "NW121.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=217"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=217"
					}
				]
			},
			{
				"name": "소아청소년 정신건강의학과",
				"id": "default467",
				"filename": "default",
				"input": [
					{
						"intent": "정신건강의학과"
					}
				],
				"output": {
					"text": "소아청소년 정신건강의학과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868001221.jpg",
						"displayname": "NW125.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=213"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아청소년 정신건강의학과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868001221.jpg",
						"displayname": "NW125.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=213"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=213"
					}
				]
			},
			{
				"name": "소아청소년 정형외과",
				"id": "default468",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 정형외과"
					}
				],
				"output": [
					{
						"text": "소아청소년 정형외과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504868028739.jpg",
							"displayname": "NW124.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=214"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=214"
					}
				]
			},
			{
				"name": "소아청소년 종양혈액과",
				"id": "default469",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 종양혈액과"
					}
				],
				"output": [
					{
						"text": "소아청소년 종양혈액과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504868056143.jpg",
							"displayname": "NW136.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=367"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=367"
					}
				]
			},
			{
				"name": "소아청소년 중환자과",
				"id": "default470",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 중환자과"
					}
				],
				"output": [
					{
						"text": "소아청소년 중환자과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504868080618.jpg",
							"displayname": "NW128.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=210"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=210"
					}
				]
			},
			{
				"name": "소아청소년 호흡기알레르기과",
				"id": "default471",
				"filename": "default",
				"input": [
					{
						"intent": "소아청소년 호흡기알레르기과"
					}
				],
				"output": [
					{
						"text": "소아청소년 호흡기알레르기과는\n 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504868108021.jpg",
							"displayname": "NW119.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=219"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=219"
					}
				]
			},
			{
				"name": "스트레스심리상담센터",
				"id": "default472",
				"filename": "default",
				"input": [
					{
						"intent": "스트레스심리상담센터"
					}
				],
				"output": [
					{
						"text": "스트레스심리상담센터는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504868132080.jpg",
							"displayname": "NW135.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=195"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=195"
					}
				]
			},
			{
				"name": "신관 채혈실",
				"id": "default473",
				"filename": "default",
				"input": [
					{
						"intent": "신관 채혈실"
					}
				],
				"output": [
					{
						"text": "신관 채혈실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504868163659.jpg",
							"displayname": "NW103.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=197"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=197"
					}
				]
			},
			{
				"name": "아산기념전시실",
				"id": "default475",
				"filename": "default",
				"input": [
					{
						"intent": "아산기념전시실"
					}
				],
				"output": {
					"text": "아산기념전시실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868324760.jpg",
						"displayname": "NW108.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=198"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "아산기념전시실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868324760.jpg",
						"displayname": "NW108.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=198"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=198"
					}
				]
			},
			{
				"name": "어린이병원",
				"id": "default476",
				"filename": "default",
				"input": [
					{
						"intent": "어린이병원"
					}
				],
				"output": {
					"text": "어린이병원은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504940912340.jpg",
						"displayname": "Kidshospital.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=326"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "어린이병원은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1504940912340.jpg",
						"displayname": "Kidshospital.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=326"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=326"
					}
				]
			},
			{
				"name": "이비인후과",
				"id": "default477",
				"filename": "default",
				"input": [
					{
						"intent": "이비인후과"
					}
				],
				"output": {
					"text": "이비인후과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868422198.jpg",
						"displayname": "NW104.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=199"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "이비인후과는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868422198.jpg",
						"displayname": "NW104.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=199"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=199"
					}
				]
			},
			{
				"name": "이비인후과 검사실",
				"id": "default478",
				"filename": "default",
				"input": [
					{
						"intent": "이비인후과 검사실"
					}
				],
				"output": {
					"text": "이비인후과 검사실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868446550.jpg",
						"displayname": "NW105.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=200"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "이비인후과 검사실은 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868446550.jpg",
						"displayname": "NW105.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=200"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=200"
					}
				]
			},
			{
				"name": "척추측만증센터",
				"id": "default479",
				"filename": "default",
				"input": [
					{
						"intent": "척추측만증센터"
					}
				],
				"output": {
					"text": "척추측만증센터는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868470987.jpg",
						"displayname": "NW137.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=201"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "척추측만증센터는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868470987.jpg",
						"displayname": "NW137.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=201"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=201"
					}
				]
			},
			{
				"name": "태아치료센터",
				"id": "default480",
				"filename": "default",
				"input": [
					{
						"intent": "태아치료센터"
					}
				],
				"output": {
					"text": "태아치료센터는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868499358.jpg",
						"displayname": "NW106.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=203"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "태아치료센터는 신관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868499358.jpg",
						"displayname": "NW106.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=203"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=203"
					}
				]
			},
			{
				"name": "골밀도검사실",
				"id": "default481",
				"filename": "default",
				"input": [
					{
						"intent": "골밀도검사실"
					}
				],
				"output": {
					"text": "골밀도검사실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868523535.jpg",
						"displayname": "new-203.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=236"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "골밀도검사실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868523535.jpg",
						"displayname": "new-203.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=236"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=236"
					}
				]
			},
			{
				"name": "교정과",
				"id": "default482",
				"filename": "default",
				"input": [
					{
						"intent": "교정과"
					}
				],
				"output": [
					{
						"text": "교정과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504868557937.jpg",
							"displayname": "new-220.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=242"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=242"
					}
				]
			},
			{
				"name": "구강악안면외과",
				"id": "default483",
				"filename": "default",
				"input": [
					{
						"intent": "구강악안면외과"
					}
				],
				"output": {
					"text": "구강악안면외과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868591773.jpg",
						"displayname": "new-219.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=243"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "구강악안면외과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868591773.jpg",
						"displayname": "new-219.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=243"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=243"
					}
				]
			},
			{
				"name": "보존과",
				"id": "default484",
				"filename": "default",
				"input": [
					{
						"intent": "보존과"
					}
				],
				"output": [
					{
						"text": "보존과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504868625273.jpg",
							"displayname": "new-218.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=244"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=244"
					}
				]
			},
			{
				"name": "보철과",
				"id": "default485",
				"filename": "default",
				"input": [
					{
						"intent": "보철과"
					}
				],
				"output": [
					{
						"text": "보철과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504868658841.jpg",
							"displayname": "new-217.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=245"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=245"
					}
				]
			},
			{
				"name": "성형외과",
				"id": "default486",
				"filename": "default",
				"input": [
					{
						"intent": "성형외과"
					}
				],
				"output": {
					"text": "성형외과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868683649.jpg",
						"displayname": "NW202.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=228"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "성형외과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504868683649.jpg",
						"displayname": "NW202.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=228"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=228"
					}
				]
			},
			{
				"name": "소아진정치료실",
				"id": "default487",
				"filename": "default",
				"input": [
					{
						"intent": "소아진정치료실"
					}
				],
				"output": {
					"text": "소아진정치료실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504940951756.jpg",
						"displayname": "new-child.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=371"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아진정치료실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504940951756.jpg",
						"displayname": "new-child.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=371"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=371"
					}
				]
			},
			{
				"name": "소아치과",
				"id": "default488",
				"filename": "default",
				"input": [
					{
						"intent": "소아치과"
					}
				],
				"output": {
					"text": "소아치과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504940978703.jpg",
						"displayname": "new-214.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=241"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아치과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504940978703.jpg",
						"displayname": "new-214.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=241"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=241"
					}
				]
			},
			{
				"name": "신관 CT실",
				"id": "default489",
				"filename": "default",
				"input": [
					{
						"intent": "신관 CT실"
					}
				],
				"output": {
					"text": "신관 CT실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941034100.jpg",
						"displayname": "new-211.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=230"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "신관 CT실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1504941034100.jpg",
						"displayname": "new-211.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=230"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=230"
					}
				]
			},
			{
				"name": "신관 MR실(2층)",
				"id": "default490",
				"filename": "default",
				"input": [
					{
						"intent": "신관 MR실(2층)"
					}
				],
				"output": [
					{
						"text": "찾으시는 MR실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504941196645.jpg",
							"displayname": "new-212.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=355"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=355"
					}
				]
			},
			{
				"name": "신관 PET 검사실(2층)",
				"id": "default491",
				"filename": "default",
				"input": [
					{
						"intent": "신관 PET 검사실"
					}
				],
				"output": [
					{
						"text": "찾으시는 PET 검사실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504941258788.jpg",
							"displayname": "NW222.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=369"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=369"
					}
				]
			},
			{
				"name": "신관 초음파실",
				"id": "default492",
				"filename": "default",
				"input": [
					{
						"intent": "신관 초음파실"
					}
				],
				"output": [
					{
						"text": "신관 초음파실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504941285717.jpg",
							"displayname": "new-210.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=233"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=233"
					}
				]
			},
			{
				"name": "신관 투시조영실",
				"id": "default493",
				"filename": "default",
				"input": [
					{
						"intent": "신관 투시조영실"
					}
				],
				"output": [
					{
						"text": "신관 투시조영실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504941308444.jpg",
							"displayname": "new-209.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=232"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=232"
					}
				]
			},
			{
				"name": "신관 핵의학 영상 검사실",
				"id": "default494",
				"filename": "default",
				"input": [
					{
						"intent": "신관 핵의학 영상 검사실"
					}
				],
				"output": [
					{
						"text": "신관 핵의학 영상 검사실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504941371372.jpg",
							"displayname": "new-204.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=235"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=235"
					}
				]
			},
			{
				"name": "안과",
				"id": "default495",
				"filename": "default",
				"input": [
					{
						"intent": "안과"
					}
				],
				"output": [
					{
						"text": "안과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504941401760.jpg",
							"displayname": "new-206.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=237"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=237"
					}
				]
			},
			{
				"name": "안과검사실",
				"id": "default496",
				"filename": "default",
				"input": [
					{
						"intent": "안과검사실"
					}
				],
				"output": [
					{
						"text": "안과검사실은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504941431202.jpg",
							"displayname": "new-205.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=238"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=238"
					}
				]
			},
			{
				"name": "엑시머라식클리닉",
				"id": "default497",
				"filename": "default",
				"input": [
					{
						"intent": "엑시머라식클리닉"
					}
				],
				"output": {
					"text": "엑시머라식클리닉은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941461832.jpg",
						"displayname": "new-207.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=239"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "엑시머라식클리닉은 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941461832.jpg",
						"displayname": "new-207.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=239"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=239"
					}
				]
			},
			{
				"name": "임플란트센터",
				"id": "default498",
				"filename": "default",
				"input": [
					{
						"intent": "임플란트센터"
					}
				],
				"output": [
					{
						"text": "임플란트센터는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504941481398.jpg",
							"displayname": "new-215.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=247"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=247"
					}
				]
			},
			{
				"name": "치과",
				"id": "default499",
				"filename": "default",
				"input": [
					{
						"intent": "치과"
					}
				],
				"output": [
					{
						"text": "치과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504941511210.jpg",
							"displayname": "NW221.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=240"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=240"
					}
				]
			},
			{
				"name": "치주과",
				"id": "default500",
				"filename": "default",
				"input": [
					{
						"intent": "치주과"
					}
				],
				"output": [
					{
						"text": "치주과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504941546340.jpg",
							"displayname": "new-216.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=246"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=246"
					}
				]
			},
			{
				"name": "피부과",
				"id": "default501",
				"filename": "default",
				"input": [
					{
						"intent": "피부과"
					}
				],
				"output": [
					{
						"text": "피부과는 신관 2층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1504941577336.jpg",
							"displayname": "new-201.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=248"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=248"
					}
				]
			},
			{
				"name": "당일수술센터",
				"id": "default502",
				"filename": "default",
				"input": [
					{
						"intent": "당일수술센터"
					}
				],
				"output": {
					"text": "당일수술센터는 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941609953.jpg",
						"displayname": "new-302.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=249"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "당일수술센터는 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941609953.jpg",
						"displayname": "new-302.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=249"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=249"
					}
				]
			},
			{
				"name": "선천성심장병센터",
				"id": "default503",
				"filename": "default",
				"input": [
					{
						"intent": "선천성심장병센터"
					}
				],
				"output": {
					"text": "선천성심장병센터는 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941633169.jpg",
						"displayname": "new-307.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=250"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "선천성심장병센터는 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941633169.jpg",
						"displayname": "new-307.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=250"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=250"
					}
				]
			},
			{
				"name": "소아중환자실",
				"id": "default504",
				"filename": "default",
				"input": [
					{
						"intent": "소아중환자실"
					}
				],
				"output": {
					"text": "소아중환자실는 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941658397.jpg",
						"displayname": "NW303.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=253"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소아중환자실는 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941658397.jpg",
						"displayname": "NW303.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=253"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=253"
					}
				]
			},
			{
				"name": "신관 수술실",
				"id": "default505",
				"filename": "default",
				"input": [
					{
						"intent": "신관 수술실"
					}
				],
				"output": {
					"text": "신관 수술실은 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941685036.jpg",
						"displayname": "new-301.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=251"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "신관 수술실은 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941685036.jpg",
						"displayname": "new-301.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=251"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=251"
					}
				]
			},
			{
				"name": "신관 주사실",
				"id": "default506",
				"filename": "default",
				"input": [
					{
						"intent": "신관 주사실"
					}
				],
				"output": {
					"text": "신관 주사실은 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941707416.jpg",
						"displayname": "new-304.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=252"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "신관 주사실은 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941707416.jpg",
						"displayname": "new-304.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=252"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=252"
					}
				]
			},
			{
				"name": "통증클리닉",
				"id": "default507",
				"filename": "default",
				"input": [
					{
						"intent": "통증클리닉"
					}
				],
				"output": {
					"text": "통증클리닉은 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941735091.jpg",
						"displayname": "new-305.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=254"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "통증클리닉은 신관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941735091.jpg",
						"displayname": "new-305.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=254"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=254"
					}
				]
			},
			{
				"name": "건강증진센터",
				"id": "default508",
				"filename": "default",
				"input": [
					{
						"intent": "건강증진센터"
					}
				],
				"output": {
					"text": "건강증진센터는 신관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941756604.jpg",
						"displayname": "new-401.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=255"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "건강증진센터는 신관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "https://dev.moneybrain.ai/files/Asan1504941756604.jpg",
						"displayname": "new-401.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=255"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=255"
					}
				]
			},
			{
				"name": "국제진료센터",
				"id": "default509",
				"filename": "default",
				"input": [
					{
						"intent": "국제진료센터"
					}
				],
				"output": {
					"text": "국제진료센터는 신관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941781219.jpg",
						"displayname": "new-402.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=23"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "국제진료센터는 신관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941781219.jpg",
						"displayname": "new-402.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=23"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=23"
					}
				]
			},
			{
				"name": "분만장",
				"id": "default510",
				"filename": "default",
				"input": [
					{
						"intent": "분만장"
					}
				],
				"output": {
					"text": "분만장은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941802754.jpg",
						"displayname": "new-604.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=256"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "분만장은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941802754.jpg",
						"displayname": "new-604.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=256"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=256"
					}
				]
			},
			{
				"name": "생식의학 및 불임클리닉",
				"id": "default511",
				"filename": "default",
				"input": [
					{
						"intent": "생식의학 및 불임클리닉"
					}
				],
				"output": {
					"text": "생식의학 및 불임클리닉은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941833308.jpg",
						"displayname": "new-602.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=257"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "생식의학 및 불임클리닉은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941833308.jpg",
						"displayname": "new-602.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=257"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=257"
					}
				]
			},
			{
				"name": "신생아실",
				"id": "default512",
				"filename": "default",
				"input": [
					{
						"intent": "신생아실"
					}
				],
				"output": {
					"text": "신생아실은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941851667.jpg",
						"displayname": "new-601.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=258"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "신생아실은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941851667.jpg",
						"displayname": "new-601.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=258"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=258"
					}
				]
			},
			{
				"name": "신생아중환자실1",
				"id": "default513",
				"filename": "default",
				"input": [
					{
						"intent": "신생아중환자실1"
					}
				],
				"output": {
					"text": "신생아중환자실1은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941869114.jpg",
						"displayname": "new-605.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=260"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "신생아중환자실1은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941869114.jpg",
						"displayname": "new-605.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=260"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=260"
					}
				]
			},
			{
				"name": "신생아중환자실2",
				"id": "default514",
				"filename": "default",
				"input": [
					{
						"intent": "신생아중환자실2"
					}
				],
				"output": {
					"text": "신생아중환자실2은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941897189.jpg",
						"displayname": "new-603.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=259"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "신생아중환자실2은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504941897189.jpg",
						"displayname": "new-603.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=259"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=259"
					}
				]
			},
			{
				"name": "신생아 중환자실",
				"id": "default515",
				"filename": "default",
				"input": [
					{
						"intent": "신생아 중환자실"
					}
				],
				"output": [
					{
						"text": "찾으시는 신생아 중환자실은 어디인가요?\n\n1. 신생아 중환자실1\n2. 신생아 중환자실2",
						"buttons": [
							{
								"text": "신생아 중환자실 1",
								"url": ""
							},
							{
								"text": "신생아 중환자실 2"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "신생아 중환자실1 2",
						"id": "default516",
						"filename": "default",
						"input": [
							{
								"text": "신생아 중환자실 1"
							},
							{
								"text": "1"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신생아중환자실1"
							}
						]
					},
					{
						"name": "신생아 중환자실2 2",
						"id": "default517",
						"filename": "default",
						"input": [
							{
								"text": "신생아 중환자실 2"
							},
							{
								"text": "2"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신생아중환자실2"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "신생아 중환자실 1",
						"url": ""
					},
					{
						"text": "신생아 중환자실 2"
					}
				]
			},
			{
				"name": "체외수정실",
				"id": "default518",
				"filename": "default",
				"input": [
					{
						"intent": "체외수정실"
					}
				],
				"output": {
					"text": "체외수정실은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504942056872.jpg",
						"displayname": "NW602.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=261"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "체외수정실은 신관 6층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504942056872.jpg",
						"displayname": "NW602.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=261"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=261"
					}
				]
			},
			{
				"name": "중동환자 기도실",
				"id": "default519",
				"filename": "default",
				"input": [
					{
						"intent": "중동환자 기도실"
					}
				],
				"output": {
					"text": "중동환자 기도실은 신관 15층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504942124687.jpg",
						"displayname": "nb_15.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=372"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "중동환자 기도실은 신관 15층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1504942124687.jpg",
						"displayname": "nb_15.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=372"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/hospitalguide/lookaround/lookAroundDetail.do?placeId=372"
					}
				]
			},
			{
				"name": "in1. R CT실",
				"id": "default551",
				"filename": "default",
				"input": [
					{
						"intent": "CT"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "CT실"
					}
				]
			},
			{
				"name": "PET 검사실",
				"id": "default553",
				"filename": "default",
				"input": [
					{
						"intent": "PET검사실"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 PET검사실은 어디인가요?\n\n1. 동관 PET검사실\n2. 신관 PET검사실(지하 1층)\n3. 신관 PET검사실(2층)",
						"buttons": [
							{
								"text": "동관 PET검사실"
							},
							{
								"text": "신관 PET검사실(지하 1층)"
							},
							{
								"text": "신관 PET검사실(2층)"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "동관 PET검사실 2",
						"id": "default554",
						"filename": "default",
						"input": [
							{
								"text": "동관 PET 검 사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관 PET 검사실"
							}
						]
					},
					{
						"name": "신관 PET검사실(지하 1층)2",
						"id": "default555",
						"filename": "default",
						"input": [
							{
								"text": "신관 PET 검 사실 지하 1 층"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관 PET 검사실"
							}
						]
					},
					{
						"name": "신관 PET검사실(2층)2",
						"id": "default556",
						"filename": "default",
						"input": [
							{
								"text": "신관 PET 검 사실 2 층"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관 PET 검사실(2층)"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "동관 PET검사실"
					},
					{
						"text": "신관 PET검사실(지하 1층)"
					},
					{
						"text": "신관 PET검사실(2층)"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "강당",
				"id": "default557",
				"filename": "default",
				"input": [
					{
						"intent": "강당"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 강당은 어디인가요?\n\n1. 동관 대강당\n2. 동관 소강당\n3. 서관 3층 강당",
						"buttons": [
							{
								"text": "동관 대강당"
							},
							{
								"text": "동관 소강당"
							},
							{
								"text": "서관  3층 강당"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "동관 대강당2",
						"id": "default558",
						"filename": "default",
						"input": [
							{
								"text": "동관 대강 당"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관 대강당"
							}
						]
					},
					{
						"name": "동관 소강당",
						"id": "default559",
						"filename": "default",
						"input": [
							{
								"text": "동관 소강 당"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관 소강당"
							}
						]
					},
					{
						"name": "서관 3층 강당",
						"id": "default560",
						"filename": "default",
						"input": [
							{
								"text": "서관 3 층 강당"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "서관 3층 강당"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "동관 대강당"
					},
					{
						"text": "동관 소강당"
					},
					{
						"text": "서관  3층 강당"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "수술실",
				"id": "default561",
				"filename": "default",
				"input": [
					{
						"intent": "수술실"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 수술실은 어디인가요?\n\n1. 서관 수술실\n2. 동관 수술실\n3. 신관 수술실",
						"buttons": [
							{
								"text": "서관 수술실"
							},
							{
								"text": "동관 수술실"
							},
							{
								"text": "신관 수술실"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "서관 수술실2",
						"id": "default562",
						"filename": "default",
						"input": [
							{
								"text": "서관 수술실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "서관수술실"
							}
						]
					},
					{
						"name": "동관 수술실2",
						"id": "default563",
						"filename": "default",
						"input": [
							{
								"text": "동관 수술실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관 수술실"
							}
						]
					},
					{
						"name": "신관 수술실2",
						"id": "default564",
						"filename": "default",
						"input": [
							{
								"text": "신관 수술실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관 수술실"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "서관 수술실"
					},
					{
						"text": "동관 수술실"
					},
					{
						"text": "신관 수술실"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "촬영실",
				"id": "default565",
				"filename": "default",
				"input": [
					{
						"intent": "촬영실"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 촬영실은 어디인가요?\n\n1. 동관 외래 촬영실\n2. 동관 일반 촬영실",
						"buttons": [
							{
								"text": "동관 외래 촬영실"
							},
							{
								"text": "동관 일반 촬영실"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "동관 외래 촬영실2",
						"id": "default566",
						"filename": "default",
						"input": [
							{
								"text": "동관 외래 촬영 실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관 외래 촬영실"
							}
						]
					},
					{
						"name": "동관 일반 촬영실2",
						"id": "default567",
						"filename": "default",
						"input": [
							{
								"text": "동관 일반 촬영 실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관 일반촬영실"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "동관 외래 촬영실"
					},
					{
						"text": "동관 일반 촬영실"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "주사실",
				"id": "default568",
				"filename": "default",
				"input": [
					{
						"intent": "주사실"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 주사실은 어디인가요?\n\n1. 서관 주사실\n2. 신관 주사실\n3. 소아 주사실",
						"buttons": [
							{
								"text": "서관 주사실"
							},
							{
								"text": "신관 주사실"
							},
							{
								"text": "소아 주사실"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "서관 주사실2",
						"id": "default569",
						"filename": "default",
						"input": [
							{
								"text": "서관 주사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "서관 주사실"
							}
						]
					},
					{
						"name": "신관 주사실2",
						"id": "default570",
						"filename": "default",
						"input": [
							{
								"text": "신관 주사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관 주사실"
							}
						]
					},
					{
						"name": "소아 주사실2",
						"id": "default571",
						"filename": "default",
						"input": [
							{
								"text": "소아 주사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "소아 주사실"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "서관 주사실"
					},
					{
						"text": "신관 주사실"
					},
					{
						"text": "소아 주사실"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "중환자실",
				"id": "default572",
				"filename": "default",
				"input": [
					{
						"intent": "중환자실"
					}
				],
				"output": {
					"text": "다음 중 찾으시는 중환자실은 어디인가요?\n\n1. 서관 중환자실\n2. 동관 중환자실",
					"buttons": [
						{
							"text": "서관 중환자실"
						},
						{
							"text": "동관 중환자실"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "서관 중환자실2",
						"id": "default573",
						"filename": "default",
						"input": [
							{
								"text": "서관 중환자실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "서관 중환자실"
							}
						]
					},
					{
						"name": "동관 중환자실2",
						"id": "default574",
						"filename": "default",
						"input": [
							{
								"text": "동관 중환자실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관 중환자실"
							}
						]
					}
				],
				"task": {
					"text": "다음 중 찾으시는 중환자실은 어디인가요?\n\n1. 서관 중환자실\n2. 동관 중환자실",
					"buttons": [
						{
							"text": "서관 중환자실"
						},
						{
							"text": "동관 중환자실"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "서관 중환자실"
					},
					{
						"text": "동관 중환자실"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "채혈실",
				"id": "default575",
				"filename": "default",
				"input": [
					{
						"intent": "채혈실"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 채혈실은 어디인가요?\n\n1. 서관 채혈실\n2. 신관 채혈실",
						"buttons": [
							{
								"text": "서관 채혈실"
							},
							{
								"text": "신관 채혈실"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "서관 채혈실2",
						"id": "default576",
						"filename": "default",
						"input": [
							{
								"text": "서관 채혈 실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "서관 채혈실"
							}
						]
					},
					{
						"name": "신관 채혈실2신관 채혈실",
						"id": "default577",
						"filename": "default",
						"input": [
							{
								"text": "신관 채혈 실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관 채혈실"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "서관 채혈실"
					},
					{
						"text": "신관 채혈실"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "처음 오신 분 창구",
				"id": "default578",
				"filename": "default",
				"input": [
					{
						"intent": "처음오신 분"
					}
				],
				"output": {
					"text": "다음 중 찾으시는 처음 오신 분 창구는 어디인가요?\n\n1. 동관 처음 오신 분 창구\n2. 신관 처음 오신 분 창구",
					"buttons": [
						{
							"text": "동관 처음 오신 분 창구"
						},
						{
							"text": "신관 처음 오신 분 창구"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "동관 처음 오신 분 창구2",
						"id": "default579",
						"filename": "default",
						"input": [
							{
								"text": "동관 처음 오신 분 창구"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관 처음 오신 분 창구"
							}
						]
					},
					{
						"name": "신관 처음 오신 분 창구2",
						"id": "default580",
						"filename": "default",
						"input": [
							{
								"text": "신관 처음 오신 분 창구"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관 처음 오신분 창구"
							}
						]
					}
				],
				"task": {
					"text": "다음 중 찾으시는 처음 오신 분 창구는 어디인가요?\n\n1. 동관 처음 오신 분 창구\n2. 신관 처음 오신 분 창구",
					"buttons": [
						{
							"text": "동관 처음 오신 분 창구"
						},
						{
							"text": "신관 처음 오신 분 창구"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "동관 처음 오신 분 창구"
					},
					{
						"text": "신관 처음 오신 분 창구"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "초음파실",
				"id": "default581",
				"filename": "default",
				"input": [
					{
						"intent": "초음파실"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 초음파실은 어디인가요?\n\n1. 서관 초음파실\n2. 신관 초음파실",
						"buttons": [
							{
								"text": "서관 초음파실"
							},
							{
								"text": "신관 초음파실"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "서관 초음파실2",
						"id": "default582",
						"filename": "default",
						"input": [
							{
								"text": "서관 초음파 실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "서관 초음파실"
							}
						]
					},
					{
						"name": "신관 초음파실2",
						"id": "default583",
						"filename": "default",
						"input": [
							{
								"text": "신관 초음파 실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관 초음파실"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "서관 초음파실"
					},
					{
						"text": "신관 초음파실"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "투시조영실",
				"id": "default584",
				"filename": "default",
				"input": [
					{
						"intent": "투시조영실"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 투시조영실은 어디인가요?\n\n1. 서관 투시조영실\n2. 신관 투시조영실",
						"buttons": [
							{
								"text": "서관 투시조영실"
							},
							{
								"text": "신관 투시조영실"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "서관 투시조영실2",
						"id": "default585",
						"filename": "default",
						"input": [
							{
								"text": "서관 투시 조 영실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "서관 투시조영실"
							}
						]
					},
					{
						"name": "신관 투시조영실2",
						"id": "default586",
						"filename": "default",
						"input": [
							{
								"text": "신관 투시 조 영실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관 투시조영실"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "서관 투시조영실"
					},
					{
						"text": "신관 투시조영실"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "핵의학 검사실",
				"id": "default587",
				"filename": "default",
				"input": [
					{
						"intent": "핵의학검사실"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 핵의학 검사실은 어디인가요?\n\n1. 신관 핵의학 영상 검사실\n2. 동관 핵의학과 영상 검사실\n3. 동관 핵의학과 혈액 검사실",
						"buttons": [
							{
								"text": "신관 핵의학 영상 검사실"
							},
							{
								"text": "동관 핵의학과 영상 검사실"
							},
							{
								"text": "동관 핵의학과 혈액 검사실"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "신관 핵의학 영상 검사실2",
						"id": "default588",
						"filename": "default",
						"input": [
							{
								"text": "신관 핵의학 영상 검 사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신관 핵의학 영상 검사실"
							}
						]
					},
					{
						"name": "동관 핵의학과 영상 검사실2",
						"id": "default589",
						"filename": "default",
						"input": [
							{
								"text": "동관 핵의학 영상 검 사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관 핵의학과 영상검사실"
							}
						]
					},
					{
						"name": "동관 핵의학과 혈액 검사실2",
						"id": "default590",
						"filename": "default",
						"input": [
							{
								"text": "동관 핵의학 혈액 검 사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관 핵의학과 혈액검사실"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "신관 핵의학 영상 검사실"
					},
					{
						"text": "동관 핵의학과 영상 검사실"
					},
					{
						"text": "동관 핵의학과 혈액 검사실"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "세미나실",
				"id": "default596",
				"filename": "default",
				"input": [
					{
						"intent": "세미나실"
					}
				],
				"output": [
					{
						"text": "아산병원 동관 6층에는 7개의 세미나실이 있습니다.\n\n찾으시는 세미나실 번호를 입력하시면 약도와 함께 안내해드릴께요.\n\n예) 제1세미나실은 어디인가요?\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "세미나실 #S",
						"id": "default598",
						"filename": "default",
						"input": [
							{
								"regexp": "(?:\\s|^|제)(1|2|3|4|5|6|7)\\s*(세미나실|번 세미나|호 세미나실| 세미나)"
							},
							{
								"regexp": "(?:세미나실|세미나)(?:\\s)?(1|2|3|5|6|7)(?:\\s|번|호|$)"
							},
							{
								"regexp": "(1|2|3|4|5|6|7)"
							}
						],
						"output": [
							{
								"text": "+1+",
								"kind": "Text"
							}
						],
						"task": "SeminarTask"
					}
				]
			},
			{
				"name": "R중환자면회대기실",
				"id": "default730",
				"filename": "default",
				"input": [
					{
						"intent": "중환자면회대기실"
					}
				],
				"output": [
					{
						"text": "다음중 찾으시는 중환자면회대기실은 어디인가요?\n\n1. 서관 중환자면회대기실\n2. 동관 중환자면회대기실",
						"buttons": [
							{
								"text": "서관 중환자면회대기실"
							},
							{
								"text": "동관 중환자면회대기실"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "서관 중환자면회대기실2",
						"id": "default731",
						"filename": "default",
						"input": [
							{
								"text": "서관 중환자 면회 대기실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "서관 중환자면회대기실"
							}
						]
					},
					{
						"name": "동관 중환자면회대기실2",
						"id": "default732",
						"filename": "default",
						"input": [
							{
								"text": "동관 중환자 면회 대기실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "동관 중환자면회대기실"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "서관 중환자면회대기실"
					},
					{
						"text": "동관 중환자면회대기실"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "응급의학과",
				"id": "default1035",
				"filename": "default",
				"input": [
					{
						"intent": "응급의학과"
					}
				],
				"output": [
					{
						"text": "서관 지하1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505365710233.jpg",
							"displayname": "WGB1F04.jpg"
						},
						"kind": "Content"
					}
				]
			},
			{
				"name": "R영상의학과",
				"id": "default1041",
				"filename": "default",
				"input": [
					{
						"intent": "영상의학과"
					}
				],
				"output": [
					{
						"text": "다음 중 찾으시는 영상의학과는 어디인가요?\n\n1. 유방두경부영상의학검사실\n2. 영상의학과 외래\n3. 소아청소년 영상의학과",
						"buttons": [
							{
								"text": "유방두경부영상의학검사실"
							},
							{
								"text": "영상의학과 외래"
							},
							{
								"text": "소아청소년 영상의학과"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "유방두경부영상의학검사실2",
						"id": "default1043",
						"filename": "default",
						"input": [
							{
								"text": "유방 두경부 영상의학 검 사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "유방두경부영상의학검사실"
							}
						]
					},
					{
						"name": "영상의학과 외래2",
						"id": "default1044",
						"filename": "default",
						"input": [
							{
								"text": "영상의학 외래"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "영상의학과 외래"
							}
						]
					},
					{
						"name": "소아청소년 영상의학과2",
						"id": "default1045",
						"filename": "default",
						"input": [
							{
								"text": "소아 청소년 영상의학"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "소아청소년 영상의학과"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "유방두경부영상의학검사실"
					},
					{
						"text": "영상의학과 외래"
					},
					{
						"text": "소아청소년 영상의학과"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "중증외상팀",
				"id": "default1050",
				"filename": "default",
				"input": [
					{
						"intent": "중증외상팀"
					}
				],
				"output": [
					{
						"text": "서관 3층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505367451000.jpg",
							"displayname": "WG301.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기"
					}
				]
			},
			{
				"name": "소화관기능검사실",
				"id": "default1052",
				"filename": "default",
				"input": [
					{
						"intent": "소화관기능검사실"
					}
				],
				"output": [
					{
						"text": "소화관기능검사실은 서관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972168157.jpg",
							"displayname": "WG403.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021459"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021459"
					}
				]
			},
			{
				"name": "소화기내시경센터",
				"id": "default1067",
				"filename": "default",
				"input": [
					{
						"intent": "소화기내시경센터"
					}
				],
				"output": {
					"text": "소화기내시경센터는 서관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972192935.jpg",
						"displayname": "WG405.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021162"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "소화기내시경센터는 서관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972192935.jpg",
						"displayname": "WG405.jpg"
					},
					"buttons": [
						{
							"text": "약도 자세히 보기",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021162"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021162"
					}
				]
			},
			{
				"name": "R내시경",
				"id": "default1060",
				"filename": "default",
				"input": [
					{
						"intent": "내시경"
					}
				],
				"output": [
					{
						"text": "다음중 찾으시는 내시경 시설은 어디인가요?\n\n1. 기관지내시경검사실\n2. 상부위장관내시경검사실\n3. 소화기내시경센터\n4. 하부위장관내시경검사실",
						"buttons": [
							{
								"text": "기관지내시경검사실"
							},
							{
								"text": "상부위장관내시경검사실"
							},
							{
								"text": "소화기내시경센터"
							},
							{
								"text": "하부위장관내시경검사실"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "기관지내시경검사실2",
						"id": "default1061",
						"filename": "default",
						"input": [
							{
								"intent": "기관지내시경검사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "기관지내시경검사실"
							}
						]
					},
					{
						"name": "상부위장관내시경검사실2",
						"id": "default1062",
						"filename": "default",
						"input": [
							{
								"text": "상부 위장 관내 시경 검 사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "상부위장관내시경검사실"
							}
						]
					},
					{
						"name": "소화기내시경센터2",
						"id": "default1063",
						"filename": "default",
						"input": [
							{
								"text": "소화기 내시경 센터"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "소화기내시경센터"
							}
						]
					},
					{
						"name": "하부위장관내시경검사실2",
						"id": "default1064",
						"filename": "default",
						"input": [
							{
								"text": "하부 위장 관내 시경 검 사실"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "하부위장관내시경검사실",
								"type": "Call"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "기관지내시경검사실"
					},
					{
						"text": "상부위장관내시경검사실"
					},
					{
						"text": "소화기내시경센터"
					},
					{
						"text": "하부위장관내시경검사실"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "종교시설",
				"id": "default1069",
				"filename": "default",
				"input": [
					{
						"intent": "종교시설"
					}
				],
				"output": [
					{
						"text": "어떤 종교시설을 찾으시나요?\n\n1. 기독교\n2. 불교\n3. 천주교",
						"buttons": [
							{
								"text": "기독교"
							},
							{
								"text": "불교"
							},
							{
								"text": "천주교"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "기독교원목실2",
						"id": "default1070",
						"filename": "default",
						"input": [
							{
								"text": "기독교"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "기독교원목실"
							}
						]
					},
					{
						"name": "불교법당2",
						"id": "default1071",
						"filename": "default",
						"input": [
							{
								"text": "불교"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "불교법당"
							}
						]
					},
					{
						"name": "천주교원목실2",
						"id": "default1072",
						"filename": "default",
						"input": [
							{
								"text": "천주교"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "천주교원목실"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "기독교"
					},
					{
						"text": "불교"
					},
					{
						"text": "천주교"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "R의무기록/영상사본",
				"id": "default1084",
				"filename": "default",
				"input": [
					{
						"intent": "의무기록/영상사본발급"
					}
				],
				"output": {
					"text": "찾으시는 서류는 동관과 서관에서 발급 받으실 수 있습니다. 어느곳으로 안내하여 드릴까요?\n\n1. 서관 의무기록/영상사본 발급처\n2. 동관 의무기록/영상사본 발급처",
					"buttons": [
						{
							"text": "서관 의무기록/영상사본 발급처"
						},
						{
							"text": "동관 의무기록/영상사본 발급처"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "찾으시는 서류는 동관과 서관에서 발급 받으실 수 있습니다. 어느곳으로 안내하여 드릴까요?\n\n1. 서관 의무기록/영상사본 발급처\n2. 동관 의무기록/영상사본 발급처",
					"buttons": [
						{
							"text": "서관 의무기록/영상사본 발급처"
						},
						{
							"text": "동관 의무기록/영상사본 발급처"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "서관 의무기록/영상사본 발급처"
					},
					{
						"text": "동관 의무기록/영상사본 발급처"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "대장항문클리닉",
				"id": "default1106",
				"filename": "default",
				"input": [
					{
						"intent": "대장항문클리닉"
					}
				],
				"output": {
					"text": "대장항문클리닉은 서관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972086645.jpg",
						"displayname": "WG402.jpg"
					},
					"buttons": [
						{
							"text": "대장항문클리닉",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021164"
						}
					],
					"kind": "Content"
				},
				"task": {
					"text": "대장항문클리닉은 서관 4층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"image": {
						"url": "/files/Asan1505972086645.jpg",
						"displayname": "WG402.jpg"
					},
					"buttons": [
						{
							"text": "대장항문클리닉",
							"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021164"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "대장항문클리닉",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021164"
					}
				]
			},
			{
				"name": "감염내과",
				"id": "default1108",
				"filename": "default",
				"input": [
					{
						"intent": "감염내과"
					}
				],
				"output": [
					{
						"text": "감염내과는 동관 1층에 있습니다. 자세한 위치는 아래 약도를 참고하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"image": {
							"url": "/files/Asan1505972564993.jpg",
							"displayname": "EG131.jpg"
						},
						"buttons": [
							{
								"text": "약도 자세히 보기",
								"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021138"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "약도 자세히 보기",
						"url": "http://www.amc.seoul.kr/asan/file/imageView.do?fileId=F000000021138"
					}
				]
			}
		],
		"task": "locationORTask"
	},
	{
		"name": "전화번호안내",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"intent": "전화번호"
			}
		],
		"output": [
			{
				"text": "전화번호를 안내해드릴께요.\n\n다음 중 원하시는 상담 서비스는 무엇인가요\n\n1. 진료예약상담\n2. 건강검진예약상담\n3. 입원관련안내\n\n처음으로 돌아가시려면 '처음'을, 이전 단계로 돌아가고 싶으시면 '이전'이라고 입력해주세요.",
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
						"text": "3"
					},
					{
						"text": "진료"
					},
					{
						"intent": "진료예약상담"
					}
				],
				"output": {
					"text": "진료예약 일자확인과 예약, 변경 및 취소를 위한 상담방법을 알려드릴께요.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에 따라 1번->1번을 순차적으로 누르시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
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
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
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
								"text": "병원대표번호 1688-7575로 전화 하셔서, 안내멘트에따라 2번→1번을 순차적으로 누르시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
								"text": "예약일 확인을 위한 상담방법을 알려드릴께요.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에 따라 2번->2번을 순차적으로 누르시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
								"text": "결과 상담일 확인을 위한상담방법을 알려드릴께요.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에 따라 2번->3번을 순차적으로 누르시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Content"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "건강검진예약 및 결과문의"
					},
					{
						"text": "예약일 확인"
					},
					{
						"text": "결과 상담일 확인"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
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
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"buttons": [
					{
						"text": "병실배정안내"
					},
					{
						"text": "입원진료비안내"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			}
		],
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
			},
			{
				"intent": "진료안내"
			}
		],
		"output": [
			{
				"text": "진료안내를 해드릴께요.\n\n무엇에 대해 안내해드릴까요?\n\n1. 외래진료\n2. 응급진료\n3. 진료예약상담\n4. 전원, 가정간호 안내\n5. 진료안내 창구",
				"buttons": [
					{
						"text": "외래진료"
					},
					{
						"text": "응급진료"
					},
					{
						"text": "진료예약상담"
					},
					{
						"text": "전원, 가정간호 안내"
					},
					{
						"text": "진료안내 창구"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
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
					}
				],
				"output": [
					{
						"text": "외래진료와 관련해서 궁금하신 점을 입력해주세요\n\n예) 예약 업무 시간, 진료 절차 단계, 보험 혜택\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
								"intent": "예약 방법"
							}
						],
						"output": {
							"text": "■ 병원 방문 예약\n - 진행절차: 원무팀 수납 창구 방문→진료 신청→진료 예약→예약일에 진료과 방문\n - 예약시간: 평일 08:30~17:30 / 토요일 : 08:30~12:30\n\n■ 전화 예약 \n - 진행절차: 전화신청(1688-7575)→전화예약실 상담원 연결→진료 상담 후 예약→예약일에 진료과 방문\n - 예약시간: 평  일 : 08:00~18:0   토요일 : 08:00~17:3 일요일 : 08:30~17:30\n - 환자가 꼭 알아야 할 사항 : 성명,주민번호,주소,연락번호, 진료과(상담 후 선택가능)\n\n■ FAX 예약\n - 환자명, 주소, 전화번호, 증상, 희망진료과 작성→FAX신청(02-3010-5452)→확인 후 전화또는 FAX 통보\n - 예약시간: 24시간 가능\n\n■ 인터넷 예약\n - 서울아산병원 홈페이지(www.amc.seoul.kr)접속→진료예약클릭→안내에 따라 진료과, 의사, 일시 선택→완료(인터넷 예약을 하면 진료예약일자를 e-메일로 진료 3일 전 통보해 드립니다.\n - 예약시간: 24시간 가능\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
							"kind": "Text"
						},
						"task": {
							"kind": "Text"
						}
					},
					{
						"name": "예약 업무 시간",
						"id": "default167",
						"filename": "default",
						"input": [
							{
								"intent": "예약 업무 시간"
							}
						],
						"output": {
							"text": "진료예약 업무 시간은 아래와 같습니다. \n• 평 일 : 08:30~17:30\n• 토요일 : 08:30~12:30\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
							"kind": "Text"
						},
						"task": {
							"kind": "Text"
						}
					},
					{
						"name": "필요 서류",
						"id": "default168",
						"filename": "default",
						"input": [
							{
								"intent": "필요 서류"
							}
						],
						"output": {
							"text": "서울아산병원은 국민건강보험법에 의거, 1-2차 병.의원에서 발급한 요양급여의뢰서(진료의뢰서)를 제출해야만 보험 급여 혜택이 가능합니다. 요양급여의뢰서(진료의뢰서) 없이도 진료는 가능하지만 보험 혜택은 못 받으시며, 차후 제출하시면 그날부터 보험 혜택을 받을 수 있습니다. 단 가정의학과,치과는 요양급여의뢰서(진료의뢰서) 없이도 건강보험혜택이 가능합니다.\n\n의료급여자(예, 거택보호자, 국가유공자, 사회복지시설 수용자, 생활보호대상자, 부양의무자가 없거나 노동능력이 없는 자 등)는 모든 진료과에 대하여 병원급 의료급여의뢰서 필요합니다. (의원, 보건소 불가) \n2종 의료급여 대상자(예, 생활보호대상자, 부양의무자가 없거나 노동능력이 없는 자) 중 ‘장애인 복지카드’ 소지 환자는 창구에 장애인등록을 신청하십시오. (의료비 경감 혜택)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
							"kind": "Text"
						},
						"task": {
							"kind": "Text"
						}
					},
					{
						"name": "R예약",
						"id": "default169",
						"filename": "default",
						"input": [
							{
								"intent": "예약"
							},
							{
								"text": "과 예약 하다 싶다"
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
									},
									{
										"text": "처음"
									},
									{
										"text": "이전"
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
							{
								"text": "예약 방법"
							},
							{
								"text": "예약 업무 시간"
							},
							{
								"text": "진료 받기 위한 필요 서류 안내"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						]
					},
					{
						"name": "외래 진료 시간",
						"id": "default173",
						"filename": "default",
						"input": [
							{
								"intent": "외래 진료 시간"
							}
						],
						"output": {
							"text": "외래 진료 시간은 아래와 같습니다. \n• 평 일 : 09:00~17:00 (단, 공휴일은 응급진료만 가능)\n• 토요일 : 09:00~11:30 (성형외과만 가능)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
							"kind": "Text"
						},
						"task": {
							"kind": "Text"
						}
					},
					{
						"name": "진료 절차 단계",
						"id": "default174",
						"filename": "default",
						"input": [
							{
								"intent": "진료 절차 단계"
							}
						],
						"output": {
							"text": "1. 처음 오신 분\n2. 진료 받은적이 있는 분",
							"buttons": [
								{
									"text": "처음 오신 분"
								},
								{
									"text": "진료 받은적이 있는 분"
								},
								{
									"text": "처음"
								},
								{
									"text": "이전"
								}
							],
							"kind": "Content"
						},
						"children": [
							{
								"name": "처음 오신 분 진료 절차",
								"id": "default176",
								"filename": "default",
								"input": [
									{
										"text": "처음 오신 분"
									},
									{
										"text": "1"
									}
								],
								"output": {
									"text": "■ 처음 오신 분 진료 절차 안내\n\n(1) 진료신청\n처음 오신 분 창구에서 진료카드를 발급받으신 후, 진료 절차를 안내 받으시기 바랍니다. 예약을 하지 않고 오신 경우에는 진료상담에서 간호사 상담 후 진료 또는 예약을 도와드립니다. 요양급여의뢰서와 건강보험증(신분증), 지참하신 외부영상자료(CD, 필름)를 제출하십시오.\n\n(2) 접수\n병원에 도착하시면 꼭 접수를 해주셔야 진료가 진행됩니다. 진료과 접수 직원에게 접수할 수 있습니다. 무인 접수대에 병원등록번호 또는 주민등록 번호를 입력하거나 바코드를 스캔하여 접수할 수 있습니다. 병원에 처음 오신 분은 처음 오신 분 창구에서 등록 후 진료과에 접수하시기 바랍니다.\n\n(3) 진행상황 확인\n동일 예약시간 환자 중 접수한 순서대로 전광판에 성명이 보입니다.\n\"\"예약시간\"\"은 현재 진료중인 환자의 진료예약시간입니다.\n\n(4) 진료\n진료예약증에는 귀하가 진료 받으실 일자와 시간이 기재되어 있으니, 진료 당일 해당 진료과로 가셔서 순번대로 진료를 받으십시오.\n\n(5) 진료 후 안내\n담당 직원에게 검사예약, 약처방 등에 대한 안내를 받으십시오. 필요 시 다음 외래 진료 예약을 하십시오.\n\n(6) 수납\n진료비 수납기 또는 수납창구에서 진료카드를 제시하시고 진료비를 납부 하신 후 진료비계산서 (영수증), 약처방전을 받으십시오. 건강보험 자격 및 주소, 전화번호 등이 변경된 경우에는 반드시 접수 수납 창구에 변경사항을 알려주시기 바랍니다.\n\n(7) 투약/주사/검사\n진료비계산서(영수증)에 귀하가 가실 곳을 확인하시기 바랍니다.\n - 원내투약: 진료비 계산서의 투약번호를 확인하시고 외래 약국의 전광판에 투약번호가 표시되면 조제된 약을 받으십시오. \n - 주사: 주사 처방이 있는 경우 해당 주사실에서 진료카드와 진료비 계산서를 제시하시면\n주사를 맞을 수 있습니다. \n - 검사: 당일 검사인 경우에는 해당 검사실로 가셔서 진료카드와 진료비 계산서를 제출하신 후 검사를 받으시고 예약 검사인 경우는 예약된 일자에 해당 검사실로 방문하시면 됩니다.\n\n(8) 귀가 / 입원\n담당의사로부터 입원이 결정된 분은 입원창구(신관 1~4번, 서관 32~40번)로 가셔서 예약 또는 입원수속을 하십시오. 원외 처방전을 가지고 원하시는 (외부)약국에 가셔서 약을 받아 귀가하십시오.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
									"kind": "Text"
								},
								"task": {
									"kind": "Text"
								}
							},
							{
								"name": "진료 받은적이 있는 분",
								"id": "default177",
								"filename": "default",
								"input": [
									{
										"text": "진료 받다 적 있다 분"
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
						"task": {
							"text": "1. 처음 오신 분\n2. 진료 받은적이 있는 분",
							"buttons": [
								{
									"text": "처음 오신 분"
								},
								{
									"text": "진료 받은적이 있는 분"
								},
								{
									"text": "처음"
								},
								{
									"text": "이전"
								}
							],
							"kind": "Content"
						},
						"buttons": [
							{
								"text": "처음 오신 분"
							},
							{
								"text": "진료 받은적이 있는 분"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						]
					},
					{
						"name": "R진료",
						"id": "default175",
						"filename": "default",
						"input": [
							{
								"intent": "진료"
							}
						],
						"output": {
							"text": "외래 진료와 관련하여 원하시는 정보가 무엇인가요\n선택해주세요.\n\n1. 외래 진료 시간\n2. 진료 절차 단계",
							"buttons": [
								{
									"text": "외래 진료 시간"
								},
								{
									"text": "진료 절차 단계"
								},
								{
									"text": "처음"
								},
								{
									"text": "이전"
								}
							],
							"kind": "Content"
						},
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
								"name": "진료 절차 단계2",
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
						"task": {
							"text": "외래 진료와 관련하여 원하시는 정보가 무엇인가요\n선택해주세요.\n\n1. 외래 진료 시간\n2. 진료 절차 단계",
							"buttons": [
								{
									"text": "외래 진료 시간"
								},
								{
									"text": "진료 절차 단계"
								},
								{
									"text": "처음"
								},
								{
									"text": "이전"
								}
							],
							"kind": "Content"
						},
						"buttons": [
							{
								"text": "외래 진료 시간"
							},
							{
								"text": "진료 절차 단계"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						]
					},
					{
						"name": "선택진료비",
						"id": "default182",
						"filename": "default",
						"input": [
							{
								"intent": "선택진료비"
							}
						],
						"output": {
							"text": "■ 선택진료비 안내\n - 진찰: 진료수가 기준 중 진찰료의 40%\n - 입원: 진료수가 기준 중 입원료의 15%\n - 검사: 진료수가 기준 중 검사료의 30%\n - 영상진단 및 방사선 치료: 진료수가 기준 중 영상진단료의 15% (방사선치료료 : 30%, 방사선혈관촬영료 : 60%)\n - 마취: 진료수가 기준 중 마취료의 50%\n - 정신요법: 진료수가 기준 중 정신요법료이 30% (심층분석 : 60%)\n - 처치/수술: 진료수가 기준 중 처치ㆍ수술료의 50%\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
							"kind": "Text"
						},
						"task": {
							"kind": "Text"
						}
					},
					{
						"name": "선택 진료",
						"id": "default180",
						"filename": "default",
						"input": [
							{
								"intent": "선택 진료"
							}
						],
						"output": [
							{
								"text": "■ 선택진료 안내\n선택진료란 의료법 제 46조에 의거 전문의 자격 인정을 받은 후 10년(치과의사는 의사면허 취득 후 15년)이 경과한 의사, 전문의 자격 인정을 받은 후 5년(치과의사는 의사면허 취득 후 10년)이 경과한 대학병원 조교수이상의 진료 경험이 풍부한 의사를 환자가 선택하여 진료를 받는 제도입니다.\n신청방법은 선택진료신청서를 작성하여 수납창구에 제출하거나 전화나 인터넷으로 신청하실 수 있습니다.\n선택진료는 기준 진료비 이외에 보건복지부령이 정하는 범위에 추가비용을 부담합니다.\n\n선택진료 항목과 비용을 알고 싶으시면 '알려줘'라고 입력해주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
								"intent": "보험 적용"
							}
						],
						"output": {
							"text": "서울아산병원은 국민건강보험법에 의거, 1-2차 병.의원에서 발급한 요양급여의뢰서(진료의뢰서)를 제출해야만 보험 급여 혜택이 가능합니다. 요양급여의뢰서(진료의뢰서) 없이도 진료는 가능하지만 보험 혜택은 못 받으시며, 차후 제출하시면 그날부터 보험 혜택을 받을 수 있습니다. 단 가정의학과,치과는 요양급여의뢰서(진료의뢰서) 없이도 건강보험혜택이 가능합니다.\n\n의료급여자(예, 거택보호자, 국가유공자, 사회복지시설 수용자, 생활보호대상자, 부양의무자가 없거나 노동능력이 없는 자 등)는 모든 진료과에 대하여 병원급 의료급여의뢰서 필요합니다. (의원, 보건소 불가) \n2종 의료급여 대상자(예, 생활보호대상자, 부양의무자가 없거나 노동능력이 없는 자) 중 ‘장애인 복지카드’ 소지 환자는 창구에 장애인등록을 신청하십시오. (의료비 경감 혜택)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
							"kind": "Text"
						},
						"task": {
							"kind": "Text"
						}
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
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
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
							}
						],
						"output": [
							{
								"text": "■ 응급실 진료 절차 안내 \n\n(1) 진료신청\n응급수납에서 진료신청서를 작성하시어 제출하시면 진료접수증이 발급 됩니다.\n\n(2) 분류실(초진실)\n분류실에 가시면 예진 후 환자 중증도에 따라 진료구역을 배정 받게 됩니다.\n\n(3) 진찰\n해당구역 응급실 간호사에게 진료접수증을 제출하시면 담당의사가 응급진료를 하게 됩니다.\n진료 후 퇴실 및 입원을 결정하게 됩니다.\n\n- 응급실 전문의 당직 근무 진료과: 내과, 소아청소년과, 정신건강의학과, 신경과, 피부과, 외과, 정형외과, 신경외과, 흉부외과, 성형외과, 산부인과, 안과, 이비인후과, 비뇨기과, 재활의학과, 가정의학과, 치과, 마취통증의학과, 방사선종양학과, 영상의학과, 핵의학과, 진단검사의학과\n\n(4) 진료비 수납\n퇴실결정을 받으신 분은 응급수납창구에서 진료비를 수납하시고 영수증 및 외래진료예약증을\n받으시면 됩니다. 비응급 환자분의 경우 요양급여의뢰서(진료의뢰서)가 없으면 보험수가 100% 본인 부담입니다.\n\n(5)  투약 / 퇴실\n수납한 영수증을 간호사에게 제시하신 후 다음 진료사항과 귀가 시 주의사항에 대하여 상담하십시오.\n원내처방인 경우 외래약국 또는 간호사에게 약을 수령하시면 됩니다. 원외처방인 경우 인근 약국에서 처방전을 제시하고 약을 구입하시면 됩니다.\n\n(6) 입원\n입원결정을 받으신 분은 응급수납 창구에서 입원수속을 마친 후 입원하시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
								"text": "보험 혜택 안내"
							}
						],
						"output": [
							{
								"text": "보건복지부에서는 법률로써 응급의료센터를 이용하는 경증환자에 대해 보험혜택을 제한하고 있으며, 응급의료에 대한 법률 제2조에서 규정한 응급증상에 해당되지 않는 환자는 진료비에 대한 보험 혜택을 받을 수 없습니다.\n\n■ 응급증상\n- 신경학적 응급증상: 급성 의식장애, 급성 신경학적 이상, 구토ㆍ의식장애 등의 증상이 있는 두부손상\n- 심혈관계 응급증상: 심폐소생술이 필요한 증상, 급성 호흡곤란, 심장질환으로 인한 급성 흉통, 심계항진, 박동이상 및 쇼크\n- 중독 및 대사장애: 심한 탈수, 약물ㆍ알코올 또는 기타 물질의 과다 복용이나 중독, 급성대사장애(간부전ㆍ신부전ㆍ당뇨병 등)\n- 외과적 응급증상: 개복술을 요하는 급성 복증(급성 복막염ㆍ장폐색증ㆍ급성 췌장염 등 중한 경우에 한함), 광범위한 화상(신체 표면적의 18%이상), 관통상, 개방성ㆍ다발성 골절 또는 대퇴부 척추의 골절, 사지를 절단할 우려가 있는 혈관손상, 다발성 외상, 전신마취 하에 응급수술을 요하는 증상\n- 출혈: 계속되는 각혈, 지혈이 안 되는 출혈, 급성 위장관 출혈\n- 안과적 응급증상: 화학물질에 의한 눈의 손상, 급성 시력소실\n- 알러지: 얼굴 부종을 동반한 알러지 반응\n- 소아과적 응급증상: 소아경련성 장애\n- 정신과적 응급증상: 자신 또는 다른 사람을 해할 우려가 있는 정신장애\n\n■ 응급증상에 준하는 증상\n- 신경학적 응급증상: 의식장애\n- 심혈관계 응급증상: 호흡곤란\n- 외과적 응급증상: 화상, 급성 복증을 포함한 배의 전반적인 이상증상, 골절·외상 또는 탈골, 기타 응급수술을 요하는 증상, 배뇨장애\n- 출혈: 혈관손상\n- 소아과적 응급증상: 소아경련, 38℃ 이상인 소아 고열(공휴일ㆍ야간 등 의료서비스가 제공되기 어려운 때에 3세 이하의 소아에게 나타나는 증상을 말한다)\n- 산부인과적 응급증상: 성폭력으로 인하여 산부인과적 검사 또는 처치가 필요한 증상\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Text"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "진료 절차"
					},
					{
						"text": "보험 혜택 안내"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "진료예약상담",
				"id": "default520",
				"filename": "default",
				"input": [
					{
						"intent": "진료예약상담"
					}
				],
				"output": [
					{
						"text": "진료예약상담안내입니다.\n\n병원대표번호 1688-7575로 전화 하셔서, 안내멘트에따라 1번→1번을 순차적으로 누르시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "전원, 가정간호 안내",
				"id": "default521",
				"filename": "default",
				"input": [
					{
						"text": "전원 가정 간호 안내"
					},
					{
						"text": "4"
					}
				],
				"output": [
					{
						"text": "전원,  가정간호에 관해서 알고싶으시군요!\n\n궁금하신 점을 알려주시면 가장 알맞은 답변을 안내해드릴께요:)\n\n예) 전원 신청방법, 가정간호 가능한 지역\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				],
				"children": [
					{
						"name": "전원 신청방법",
						"id": "default523",
						"filename": "default",
						"input": [
							{
								"intent": "전원 신청 방법"
							}
						],
						"output": [
							{
								"text": "전원 신청하는 방법에 대해 알려드리겠습니다.\n\n■ 다른 병원(연고지 병원, 요양병원 등)으로 입원을 원하시는 경우에는  담당의와 상의하시고 진료의료협력센터(ARC)에 문의하시기 바랍니다.\n\n■ 진료의뢰 협력센터 : \n- 위치: 신관 지하 1층 진료의뢰협력센터 (ARC)\n- 상담시간: 평일 08:30~17:30, 토요일 : 08:30~12:30 \n- 전화번호: (02) 3010-7773~5(원내 #7773~5)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Text"
							}
						]
					},
					{
						"name": "가정간호 정의 및 목적",
						"id": "default524",
						"filename": "default",
						"input": [
							{
								"intent": "가정간호 - 정의 및 목적"
							}
						],
						"output": [
							{
								"text": "가정간호에 대해 알려드리겠습니다.\n\n■ 가정간호 정의\n가정전문 간호사가 가정으로 환자를 방문하여 주치의의 처방으로 지속적인 간호와 치료를 제공하는 것을 말합니다.\n\n■ 가정간호 간호사\n가정전문 간호사는 임상경험이 있는 간호사로 전문 교육기관에서 일정 교육과정 이수 후 가정전문간호사 자격증을 취득한 간호사 입니다.\n\n■ 가정간호 목적\n - 전문적 상담 : 가정에서 간호서비스를 제공받음으로써 심리적 안정감과 빠른 회복을 도움\n - 서비스 제공 : 환자를 잘 돌볼 수 있도록 간호방법 및 사용할 각종 의료기구 또는 가정용품 사용에 대한 전문적 상담을 받을 수 있음\n - 계속적인 치료 : 만성 질환 환자의 건강관리를 위해 계속적인 치료 및 간호를 제공\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Text"
							}
						]
					},
					{
						"name": "가정간호 대상",
						"id": "default525",
						"filename": "default",
						"input": [
							{
								"intent": "가정 간호 대상"
							}
						],
						"output": [
							{
								"text": "가정간호를 받을수 있는 있는 분을 알려드리겠습니다.\n\n■ 가정간호 대상자 안내\n - 뇌질환, 당뇨, 척수손상, 심.폐질환 등의 만성질환으로 지속적인 관리가 필요한 환자\n - 수술 후 상처관리, 봉합사 제거 등이 필요한 환자\n - 암 등 말기 질환자, 노인환자 등 거동이 불편한 환자\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Text"
							}
						]
					},
					{
						"name": "가정간호 내용",
						"id": "default526",
						"filename": "default",
						"input": [
							{
								"intent": "가정 간호 내용"
							}
						],
						"output": [
							{
								"text": "■ 가정간호 내용 안내\n - 기관 절개관 교환 및 흡인 간호 및 교육\n - 비위관 교환 및 위루관 관리\n - 경관 영양관련 간호 및 교육\n - 장루 및 요루 관리 및 교육\n - 유치 도뇨관 교환 및 관리 및 교육\n - 봉합사 제거\n - 욕창 간호 및 상처 소독 및 관리 교육\n - 중심정맥관 관리 및 수액요법\n - 투약\n - 환자 상태 관찰\n - 활력 징후 측정\n - 검체 수집(혈액, 소변,대변,객담 당)\n - 집에서의 환자 관리 교육 및 상담\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Text"
							}
						]
					},
					{
						"name": "가정간호 신청 방법",
						"id": "default527",
						"filename": "default",
						"input": [
							{
								"intent": "가정간호 신청 방법"
							}
						],
						"output": [
							{
								"text": "가정간호를 신청하는 방법입니다.\n\n■ 가정간호 신청 방법 안내\n - 입원환자 : 퇴원계획시 주치의나 간호사를 통해 신청\n - 외래환자 : 외래진료를 통하여 주치의와 상담 후 신청\n - 타 기관환자 : 타 기관 소견서를 가지고 오셔서 외래진료를 받은 후 신청\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Content"
							}
						]
					},
					{
						"name": "가정간호 가능 지역",
						"id": "default528",
						"filename": "default",
						"input": [
							{
								"intent": "가정간호 가능 지역"
							}
						],
						"output": [
							{
								"text": "가정간호는 아래의 지역에 한하여 제공 가능합니다. \n\n■서울 전 지역, 구리, 하남, 성남, 분당, 과천, 광주 및 남양주 일부 지역\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Text"
							}
						]
					},
					{
						"name": "가정간호 비용",
						"id": "default529",
						"filename": "default",
						"input": [
							{
								"intent": "가정간호 비용"
							}
						],
						"output": [
							{
								"text": "가정간호 비용을 알려드리겠습니다.\n\n - 기본 방문료: 59,830원\n (환자 부담액- 진단명에 따라 5~20% 부담)\n\n - 진료재료와 투약 및 간호치료: 지정수가\n\n - 교통비: 7,880원\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Text"
							}
						]
					},
					{
						"name": "가정간호 상담",
						"id": "default530",
						"filename": "default",
						"input": [
							{
								"intent": "가정간호 상담"
							}
						],
						"output": [
							{
								"text": "가정간호 문의처를 알려드리겠습니다.\n\n■업무시간 : 평일 08:30~17:30\n\n■가정간호 사무실: 02-3010-7004~6\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Text"
							}
						]
					},
					{
						"name": "in 7. R가정간호",
						"id": "default531",
						"filename": "default",
						"input": [
							{
								"text": "가정 간호"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "R가정간호",
								"type": "Call"
							}
						]
					}
				]
			},
			{
				"name": "진료안내 창구2",
				"id": "default1111",
				"filename": "default",
				"input": [
					{
						"text": "진료 안내 창구"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "진료안내 창구"
					}
				]
			}
		],
		"buttons": [
			{
				"text": "외래진료"
			},
			{
				"text": "응급진료"
			},
			{
				"text": "진료예약상담"
			},
			{
				"text": "전원, 가정간호 안내"
			},
			{
				"text": "진료안내 창구"
			},
			{
				"text": "처음"
			},
			{
				"text": "이전"
			}
		]
	},
	{
		"name": "입원안내",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"regexp": "(4|6|입원안내|서류발급|입원 안내|서류 발급|입원)"
			}
		],
		"output": [
			{
				"text": "+1+",
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
						"intent": "입원 결정"
					}
				],
				"output": [
					{
						"text": "■ 응급 및 외래진료 후 입원 :\n담당의사로부터 입원결정을 통보 받으시면 입원처리 절차에 따라 입원이 이루어집니다.\n\n■ 당일입원 : 입원수속 창구에 준비된 입원약정서를 작성하시어 진료카드와 함께 제출하시면 됩니다. 입원수속 후 입원안내문, 환자식별용 팔찌, 입원 파일, 보호자 출입증을 배부 받고 배정받은 병동으로 가시면 됩니다. \n\n■ 입원 관련 문의처: 02-3010-7586\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
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
						"intent": "입원 예약 방법"
					}
				],
				"output": {
					"text": "응급 및 외래진료 후 담당의사로부터 입원결정을 통보 받으시면 입원처리 절차에 따라 입원이 이루어집니다(문의전화 : 02-3010-7586)\n\n수술일정이나 검사일정을 지정 받으신 분은 입원예약 창구에서 입원예약 후 접수증을 받아 귀가하시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원예정일",
				"id": "default206",
				"filename": "default",
				"input": [
					{
						"intent": "입원예정일"
					}
				],
				"output": {
					"text": "진료과별 퇴원환자의 현황이나 수술일자 등을 고려하여 입원예정일을 지정하여 드리고 있습니다.\n단, 입원예정일 당일에 병실이 부족하여 입원예정일을 변경해야 하는 경우는 입원 당일 10:00 이전에 유선 또는 문자메세지로 병실사정과 입원일 연기를 안내하여 드립니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "병실 배정",
				"id": "default211",
				"filename": "default",
				"input": [
					{
						"intent": "병실 배정"
					}
				],
				"output": {
					"text": "병실은 VIP실,Family실, 1인실, 2인실, 6인실로 운영하고 있으며, 퇴원환자의 상황에 따라 입원당일에 병실이 결정되기 때문에 환자분이 원하시는 병실의 등급과 차이가 있을 수 있습니다.\n본원은 환자의 퇴원으로 인하여 다인실(2인실, 6인실)에 빈 병실이 생길 경우, 전일 먼저 입원중인 환자에게 우선적으로 병실을 배정하는 관계로 입원 수속 시에는 원하는 병실로 배정받지 못하는 경우가 많습니다. \n아울러 다인실을 신청하는 경우 입원예약 시 접수된 일자 순으로 자동 신청됩니다.\n\n전화연결을 원하실 경우, 병원대표번호 1688-7575로 전화 하셔서, 안내멘트에따라 3번→1번을 순차적으로 누르시면 됩니다. \n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "기준병실 확대 운영",
				"id": "default210",
				"filename": "default",
				"input": [
					{
						"intent": "기준병실 확대 운영"
					}
				],
				"output": {
					"text": "우리 병원은 암환자의 진료비 부담 경감을 위하여 암치료(확진,수술, 항암치료 등)를 위해 2인실에 입원하신 환자 분을 대상으로 암 환자분의 균등한 혜택을 드리고자 최대 4일까지 2인실 병실 차액을 일반병실료로 적용해 드립니다.\n[근거:보건복지부 고시 제2015 - 155호]\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원 수속 절차",
				"id": "default213",
				"filename": "default",
				"input": [
					{
						"intent": "입원수속절차"
					}
				],
				"output": {
					"text": "입원예약이 되신 분은 입원당일 11:00 ~ 14:00에 입원접수증과 입원약정서, 신분증을 지참하여 입원수속창구(평일,토요일 : 서관 1층 31번~40번창구, 신관 1층 2번~4번창구 / 일요일, 공휴일 : 동관 1층 2번~10번창구)로 오시기 바랍니다. \n입원당일 입원 전 검사가 예약된 분은 오전 중으로 병원에 오셔서 먼저 입원수속을 마치고 입원 전 검사실로 가셔서 검사를 받으시기 바랍니다.(단, 일요일은 13:00 ~ 17:00시까지 검사가 가능합니다.)\n\n입원약정서 작성 방법을 알고싶으시면 '알려줘'라고 입력하세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
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
				],
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원 약정서 작성요령",
				"id": "default214",
				"filename": "default",
				"input": [
					{
						"intent": "입원약정서 작성요령"
					}
				],
				"output": {
					"text": "배부해 드린 입원약정서를 상세히 읽어 보신 후 작성하시기 바라며, 연대보증인은 가족이나 친지 중 세대주 또는 직장인 1인이 작성하여 서명 날인하신 후, 입원당일 제출하여 주시기 바랍니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원 문의처",
				"id": "default222",
				"filename": "default",
				"input": [
					{
						"intent": "입원 문의처"
					},
					{
						"text": "입원"
					}
				],
				"output": {
					"text": "■ 입원 관련 문의처 안내\n\n• 입원예약 변경 및 취소 : 02-3010-7586\n - 입원예약 변경 및 취소하실 분은 입원예약일 7일전까지 알려 주십시오. \n\n• 병상배정 확인 : 1688-7575 (ARS 3번 → 1번) (자동응답전화 / 입원당일 11:00이후 확인가능)\n\n• 입원날짜 안내 : 예약된 입원 날짜를 알고 싶으시면 02-3010-7586으로 전화 후 문의 하시기 바랍니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원 예약 및 수속",
				"id": "default216",
				"filename": "default",
				"input": [
					{
						"intent": "입원 예약 및 수속"
					},
					{
						"text": "예약"
					}
				],
				"output": {
					"text": "입원 예약 및 수속과 관련한 사항을 알려드릴께요. 궁금하신 사항의 번호를 입력해주세요.\n\n1. 입원 예약방법\n2. 입원 예정일\n3. 병실 배정\n4. 입원 수속 절차\n5. 입원 약정서 작성요령\n6. 입원 문의처 안내",
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
							"text": "입원 수속 절차"
						},
						{
							"text": "입원 약정서 작성요령"
						},
						{
							"text": "입원 문의처 안내"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
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
				"task": {
					"text": "입원 예약 및 수속과 관련한 사항을 알려드릴께요. 궁금하신 사항의 번호를 입력해주세요.\n\n1. 입원 예약방법\n2. 입원 예정일\n3. 병실 배정\n4. 입원 수속 절차\n5. 입원 약정서 작성요령\n6. 입원 문의처 안내",
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
							"text": "입원 수속 절차"
						},
						{
							"text": "입원 약정서 작성요령"
						},
						{
							"text": "입원 문의처 안내"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
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
						"text": "입원 수속 절차"
					},
					{
						"text": "입원 약정서 작성요령"
					},
					{
						"text": "입원 문의처 안내"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "in 전화.진료예약상담",
				"id": "default534",
				"filename": "default",
				"input": [
					{
						"intent": "진료예약상담"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "진료예약상담"
					}
				]
			},
			{
				"name": "in 3. 전원 신청방법",
				"id": "default536",
				"filename": "default",
				"input": [
					{
						"intent": "전원 신청 방법"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "전원 신청방법"
					}
				]
			},
			{
				"name": "in3. 가정간호 정의 및 목적",
				"id": "default537",
				"filename": "default",
				"input": [
					{
						"intent": "가정간호 - 정의 및 목적"
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
				"name": "in3. 가정간호 대상",
				"id": "default538",
				"filename": "default",
				"input": [
					{
						"intent": "가정 간호 대상"
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
				"name": "in3. 가정간호 내용",
				"id": "default539",
				"filename": "default",
				"input": [
					{
						"intent": "가정 간호 내용"
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
				"name": "in3. 가정간호 신청 방법",
				"id": "default540",
				"filename": "default",
				"input": [
					{
						"intent": "가정간호 신청 방법"
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
				"name": "in3. 가정간호 가능 지역",
				"id": "default541",
				"filename": "default",
				"input": [
					{
						"intent": "가정간호 가능 지역"
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
				"name": "in3. 가정간호 비용",
				"id": "default542",
				"filename": "default",
				"input": [
					{
						"intent": "가정간호 비용"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "가정간호 비용"
					}
				]
			},
			{
				"name": "in3. 가정간호 상담",
				"id": "default543",
				"filename": "default",
				"input": [
					{
						"intent": "가정간호 상담"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "가정간호 상담"
					}
				]
			},
			{
				"name": "in3. R가정간호",
				"id": "default545",
				"filename": "default",
				"input": [
					{
						"intent": "가정간호"
					}
				],
				"output": {
					"kind": "Action",
					"call": "R가정간호"
				}
			},
			{
				"name": "입원치료 - 중간계산서",
				"id": "default599",
				"filename": "default",
				"input": [
					{
						"intent": "중간계산서"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "중간계산서"
					}
				]
			},
			{
				"name": "입원치료 - 무통장 입금",
				"id": "default600",
				"filename": "default",
				"input": [
					{
						"intent": "무통장 입금"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "무통장입금"
					}
				]
			},
			{
				"name": "퇴원",
				"id": "default601",
				"filename": "default",
				"input": [
					{
						"intent": "퇴원"
					}
				],
				"output": {
					"text": "정규퇴원은 퇴원하시기 하루 전날 결정됩니다.\n퇴원일 09:00 ~ 11:00 경에 진료비 최종심사가 끝나면 간호사가 환자분께 연락을 드립니다.\n간호사로부터 퇴원안내문을 받으신 후 퇴원수속창구에서 퇴원수속을 하시면 됩니다. \n퇴원수속 완료 후 병동 간호사가 퇴원약을 전달해 드리며, 퇴원약 수령후 귀가 하시면 됩니다. \n\n■ 퇴원 수속 장소\n - 평일, 토요일 : 서관1층 입·퇴원창구와 신관1층 입·퇴원창구\n - 일요일, 공휴일 : 동관1층 초진접수창구(2번~10번창구)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원생활 - 출입",
				"id": "default602",
				"filename": "default",
				"input": [
					{
						"intent": "입원 생활 - 출입"
					}
				],
				"output": {
					"text": "입원환자에게 안전한 진료환경 제공과 감염예방을 위하 서울아산병원 모든 병동에 출입문이 설치되었습니다. 보호자 출입증을 소지한 보호자 한 분만 병동 출입이 가능하오니, 보호자 출입증이 없는 분은 정해진 면회시간에 방문가능 합니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원생활 - 병문안",
				"id": "default603",
				"filename": "default",
				"input": [
					{
						"intent": "입원 생활 - 병문안 시간, 준수수칙"
					}
				],
				"output": {
					"text": "■ 병문안 가능 시간 안내\n - 일반병동 : 평일 오후 6시~ 8시 / 주말ㆍ공휴일 오전 10시~12시, 오후 6시~8시\n - 성인ㆍ소아중환자실 : 매일 오전 10시~10시 30분, 오후 8시~8시 30분\n - 신생아중환자실 : 매일 오후 1시~1시 30분, 오후 8시~8시 30분\n - 정신건강의학과 병동 : 평일(화ㆍ목), 주말(토ㆍ일) 오후 12시~2시, 오후 6시~8시\n\n■ 병문안 시 주의사항\n - 13세 이하 어린이, 감기 및 기타 전염성 질환자 및 3인이상 단체 방문객 병문안 제한\n - 병문안 전, 후 손씻기, 기침 예절 지키기, 애완동물 반입 금지\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원 생활 - 보호자 안내",
				"id": "default604",
				"filename": "default",
				"input": [
					{
						"intent": "입원 생활 - 보호자 안내"
					}
				],
				"output": {
					"text": "안정된 병실 환경 유지를 위하여 반드시 필요한 경우 외에는 보호자 상주를 하지 않습니다. 단, 환자의 상태에 따라 필요하다고 판단된 경우에 보호자 한분만 환자 곁에 계시기 바랍니다. \n보호자 침대는 밤 취침 시에만 이용해 주시기 바랍니다. 낮 동안에는 의자를 이용하고, 보호자 침대는 항상 침대 밑으로 밀어 넣어 주시기 바랍니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원 생활 - 식이 변경",
				"id": "default605",
				"filename": "default",
				"input": [
					{
						"intent": "입원 생활 - 식이 변경"
					}
				],
				"output": {
					"text": "일반식 밥 환자를 대상으로 조식, 중식에 식단 선택제를 실시하고 있습니다. 매일 석식에 배식원에게 신청하여 주시기 바랍니다. \n\n환자식 선택 메뉴는 병동 내 전체 게시판 및 다인실 병실 내 냉장고 상부에 게시되어 있습니다. \n\n아침/점심/저녁 식사 변경 마감 시간은 아래와 같습니다. 식이변경 마감시간 이후에는 식이 변경이 불가하니 참고하시기 바랍니다.  \n - 아침 : 오전 4시\n - 점심 : 오전 10시 30분\n - 저녁 : 오후 4시\n\n일반식(밥, 죽을 드시는) 환자를 대상으로 2가지 선택이 가능합니다.\n - 주식 : 국 대신 숭늉, 국 대신 스프, 국은 미역국으로, 밥 대신 누룽지, 진밥, 쌀밥, 잡곡밥, 흰죽\n - 음료 및 기타 : 우유 대신 두유, 우유 대신 요구르트, 양념간장, 맵지않게, 물김치, 백김치\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원 생활 - 식판 수거",
				"id": "default606",
				"filename": "default",
				"input": [
					{
						"intent": "입원 생활 -식판 수거"
					}
				],
				"output": {
					"text": "배식후 30분 이내에 배식원이 그릇을 가지러 병실을 방문하며, 그 이후 시간은 다용도실의 퇴식 카트에 넣어주시기 바랍니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원 생활 - 보호자석 이용 안내",
				"id": "default607",
				"filename": "default",
				"input": [
					{
						"intent": "입원 생활 - 보호자석 이용 안내"
					}
				],
				"output": {
					"text": "개인적으로 준비한 도시락, 컵라면 등은 동관지하 1층에 위치한 직원 식당 안에 보호자석을 별도로 운영하오니 이곳을 이용하시기 바랍니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원 생활 - 냉장고 이용안내",
				"id": "default608",
				"filename": "default",
				"input": [
					{
						"intent": "입원 생활 - 냉장고 이용 안내"
					}
				],
				"output": {
					"text": "병실의 냉장(동)고 및 다용도실의 환자 공용 냉동고에 물품 보관시 아래의 사항을 지켜주십시오.\n보관 물품에는 환자명을 기입하시고, 음식물의 경우 유효기간 내 섭취하시기 바랍니다.\n모유는 환자명과 유축날짜를 기입하여 보관합니다.\n\n처음으로 돌아가시려면 '처음'을, 이전 단계로 돌아가고 싶으시면 '이전'이라고 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원안내 - 회진",
				"id": "default609",
				"filename": "default",
				"input": [
					{
						"intent": "입원안내 - 회진"
					},
					{
						"text": "회진"
					}
				],
				"output": [
					{
						"text": "회진시간 : 오전 7시~9시 또는 오후 4시~7시\n(회진시간은 진료과와 의사의 사정으로 변동될 수 있습니다.)\n\n교수님별 회진시간은 병동에 부착된 게시물을 확인해주세요\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "입원 생활 - 간호사 호출방법",
				"id": "default610",
				"filename": "default",
				"input": [
					{
						"intent": "입원 생활 - 간호사 호출방법"
					}
				],
				"output": [
					{
						"text": "침대 머리 위, 화장실 벽의 호출기와 병실 내 전화기의 간호사 호출 버튼을 사용하시면 됩니다. 간호사의 도움이 급히 필요할 때 사용해 주세요.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "입원 준비물품",
				"id": "default611",
				"filename": "default",
				"input": [
					{
						"intent": "입원 준비물품"
					}
				],
				"output": {
					"text": "■ 입원 물품 키트(구매 가능) : 물통, 계량 컵, 볼펜, 휴지/슬리퍼(남.여)\n\n■ 개별 준비 물품 : 치약, 칫솔, 비누, 수건 및 개인물품\n\n■ 화재 및 안전을 위하여 병실에서 제공하는 비품 이외 일체의 가전제품(TV,취사용품 등)을 개인적으로 사용하실 수 없습니다. (각 병동에 전자레인지 있음)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "병실내 창문/방충망",
				"id": "default612",
				"filename": "default",
				"input": [
					{
						"intent": "병실내 창문/방충망"
					}
				],
				"output": {
					"text": "- 동절기/하절기에는 에너지 절약을 위하여 창문을 꼭 닫아 주시기 바랍니다. 불가피하게 환기를 위하여 창문을 열어두는 경우는 각종 해충의 유입을 차단하기 위하여 방충망을 꼭 닫아 주시기 바랍니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원시 지참약관리",
				"id": "default613",
				"filename": "default",
				"input": [
					{
						"intent": "입원시  지참약관리"
					}
				],
				"output": {
					"text": "■ 현재 복용하고 있는 약이 있는 경우 담당 간호사에게 알리고 반드시 약을 제출하여 주시기 바랍니다.\n\n■ 다음과 같은 이유로 약물의 임의 복용을 금하고 있습니다.\n - 복용 중인 약물이 환자분의 치료에 영향을 미칠 수 있습니다.\n - 같은 성분의 약을 중복해서 복용하여 예상치 못한 부작용이 발생하거나 약효에 영향을 미칠 수 있습니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "환자 팔찌 착용안내",
				"id": "default614",
				"filename": "default",
				"input": [
					{
						"intent": "환자 팔찌 착용안내"
					}
				],
				"output": {
					"text": "서울 아산병원 전 직원은 투약, 검사, 수혈, 수술 등 모든 과정에서 착용하고 계신 환자 팔찌를 통해 정확한 환자 확인을 하고 있습니다. \n\n• 환자 팔찌에는 환자의 이름과 본원에서 부여한 고유의 등록번호가 있습니다( 직원이 착용해드린 환자 팔찌가 본인의 것이 맞는지 다시 한번 확인하여 주십시오)\n\n• 투약, 검사, 수혈, 수술 등 모든 과정에서 직원과 함께 이름과 등록번호를 확인하여 주시기 바랍니다.\n\n• 환자 팔찌가 손상 또는 분실된 경우 직원에게 알려주십시오.\n\n• 환자 팔찌 착용은 정확하고 안전한 치료의 시작입니다. 불편하시더라도 꼭 착용하여 주십시오.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "wifi",
				"id": "default615",
				"filename": "default",
				"input": [
					{
						"intent": "wifi"
					}
				],
				"output": {
					"text": "■ 접속방법\n: 무선 검색 후 ASAN_GUEST로 접속하여 개인 이메일 인증 후 사용 가능합니다. 등록하신 이메일로 아이디와 비밀번호가 전송됩니다.\n\n■ 유효기간: 발급된 아이디는 5일간 유지되며, 기간 만료 시 재인증이 필요합니다.\n\n■ 문의 전화 : 02-3010-7800 (원내 #7800)\n\n병원 정책상 일부 사이트는 제한 될 수 있습니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "시트",
				"id": "default616",
				"filename": "default",
				"input": [
					{
						"intent": "시트"
					}
				],
				"output": {
					"text": "시트는 주 2~3회 일정한 시간에 교환해드립니다.\n오염 등으로 추가 교환을 해야 하는 경우 병동에 말씀하시기 바랍니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "담요",
				"id": "default617",
				"filename": "default",
				"input": [
					{
						"intent": "담요"
					}
				],
				"output": {
					"text": "담요는 입원 시 1장을 드리고, 교환이 필요한 경우 병동안내에 따라 사용한 담요를 오물실에 내놓으시면 새 담요로 교환해드립니다.\n오염 등으로 추가 교환을 해야 하는 경우 병동에 말씀하시기 바랍니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "흡연",
				"id": "default618",
				"filename": "default",
				"input": [
					{
						"intent": "흡연"
					}
				],
				"output": {
					"text": "국민건강증진법시행규칙 개정에 따라 2003.7.1일부터 병원내에서는 절대 금연을\n해야합니다. (병원내화장실,복도,병실,동관7층,서관4층옥외휴게실등)\n\n흡연은 아래의 정해진 구역에서만 가능합니다. \n - 서관응급실 건너편 택시 승강장 \n - 장례식장 앞\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "오물실",
				"id": "default619",
				"filename": "default",
				"input": [
					{
						"intent": "오물실"
					}
				],
				"output": {
					"text": "사용한 환의와 시트는 오물실 안에 있는 수거함에 넣어주시기 바랍니다. 단, 환자의 혈액 분비물, 배설물에 오염되거나 젖은 세탁물 또는 격리 환자용 세탁물은 비닐봉지에 담은 후 수거함에 넣어주시기 바랍니다.\n\n※ 사용한 기저귀류는 오물실 안에 있는 분리수거용 상자에 버려주시기 바랍니다.\n\n※ 사용하신 담요는 오물실 내 수거함에 절대 넣지 마시기 바랍니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "다용도실",
				"id": "default620",
				"filename": "default",
				"input": [
					{
						"intent": "다용도실"
					}
				],
				"output": {
					"text": "각층 중앙 비상계단 옆의 다용도실에는 식수와 전자레인지가 비치되어 있습니다.\n병실에서는 가스렌지나 전열기구의 사용을 금하며 음식을 데울 경우에는 다용도실에 있는 전자레인지를 이용하시기 바랍니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "샤워실",
				"id": "default621",
				"filename": "default",
				"input": [
					{
						"intent": "샤워실"
					}
				],
				"output": {
					"text": "병동마다 환자들을 위한 샤워실이 위치하고 있습니다. \n보호자의 샤워실 이용 및 세탁은 금지합니다. \n\n■ 샤워실 이용시간: 오전 6시~오후 10시\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "휴게실",
				"id": "default622",
				"filename": "default",
				"input": [
					{
						"intent": "휴게실"
					}
				],
				"output": {
					"text": "층별 실내 면회실이 있습니다.\n\n실외 휴게실은 서관 4층, 동관 7층, 신관 6층, 신관 7층에 있습니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "간병인 신청 - 요금",
				"id": "default623",
				"filename": "default",
				"input": [
					{
						"intent": "간병인 신청 - 요금"
					}
				],
				"output": {
					"text": "간병인 요금입니다.\n\n24시간 : 60,000 (식대포함)\n주.야간 : 40,000 (식대포함)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "간병인 신청 - 전화번호",
				"id": "default624",
				"filename": "default",
				"input": [
					{
						"intent": "간병인 신청 - 전화번호"
					}
				],
				"output": {
					"text": "■ 간병인 신청 문의처\n - 명성 : 원내 6264, 원외478-4141\n - YWCA : 원내 6263. 원외855-8826\n - SG 프라자 : 원내 7265\n - 인자인케어컴퍼니 : 원내 7266   \n - 제니엘메디컬 : 원내 7267\n - 열린간병인(I서비스) : 원내7862. 원외484-9577\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "간병인 신청",
				"id": "default625",
				"filename": "default",
				"input": [
					{
						"intent": "간병인 신청"
					}
				],
				"output": {
					"text": "간병인 신청과 관련하여 무엇을 알려드릴까요?\n\n1. 요금\n2. 전화번호",
					"buttons": [
						{
							"text": "요금"
						},
						{
							"text": "전화번호"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "간병인 신청 - 요금2",
						"id": "default626",
						"filename": "default",
						"input": [
							{
								"text": "요금"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "간병인 신청 - 요금",
								"type": "Call"
							}
						]
					},
					{
						"name": "간병인 신청 - 전화번호2",
						"id": "default627",
						"filename": "default",
						"input": [
							{
								"text": "전화번호"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "간병인 신청 - 전화번호"
							}
						]
					}
				],
				"task": {
					"text": "간병인 신청과 관련하여 무엇을 알려드릴까요?\n\n1. 요금\n2. 전화번호",
					"buttons": [
						{
							"text": "요금"
						},
						{
							"text": "전화번호"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "요금"
					},
					{
						"text": "전화번호"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "불만 및 고충사항 - 상담안내",
				"id": "default628",
				"filename": "default",
				"input": [
					{
						"intent": "불만 및 고충사항 - 상담안내"
					}
				],
				"output": [
					{
						"text": "병원이용 과정에 대한 불만 및 고충사항이 있으실 경우 해당부서 직원에게 말씀해 주십시오.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "불만 및 고충사항 - 상담방법",
				"id": "default629",
				"filename": "default",
				"input": [
					{
						"intent": "불만 및 고충사항 - 상담방법"
					}
				],
				"output": {
					"text": "■ 불만 사항 접수 방법\n\n• 열린 상담실 방문\n - 운영시간 : 오전 8시 30분~오후 5시 30분(토요일, 공휴일 휴무)\n - 위치 : 동관 1층 갤러리 앞\n - 전화번호 : 02-3010-5350 / 080-203-3355\n\n• 열린소리함(고객 제안/ 불편신고 카드): 각 병동 휴게실, 검사실 및 외래 진료과 비치\n\n• 인터넷 : 홈페이지 (www.amc.seoul.kr) \"\"고객의 소리\"\" 코너\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "불만 및 고충사항 - 처리절차",
				"id": "default630",
				"filename": "default",
				"input": [
					{
						"intent": "불만 및 고충사항 - 처리절차"
					}
				],
				"output": [
					{
						"text": "불만/ 고충 접수(상담) → 접수내용 검토(해당부서 확인) → 고객회신(개선활동)\n회신소요기간 : 2주 이내, 사안별 기간이 더 소요될 경우 고객에게 미리 통보.\n회신 방법 : 직접상담, 전화등\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "불만 및 고충사항",
				"id": "default631",
				"filename": "default",
				"input": [
					{
						"intent": "불만 및 고충사항"
					}
				],
				"output": [
					{
						"text": "불만 및 고충사항이 있으시군요.\n\n원하시는 서비스를 골라주세요.\n\n1. 불만 및 고충사항 상담안내\n2. 불만 및 고충사항 상담방법\n3. 불만 및 고충사항 처리절차",
						"buttons": [
							{
								"text": "불만 및 고충사항 상담안내"
							},
							{
								"text": "불만 및 고충사항 상담방법"
							},
							{
								"text": "불만 및 고충사항 처리절차"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "불만 및 고충사항 - 상담안내2",
						"id": "default632",
						"filename": "default",
						"input": [
							{
								"text": "불만 및 고충 사항 상담 안내"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "불만 및 고충사항 - 상담안내",
								"type": "Call"
							}
						]
					},
					{
						"name": "불만 및 고충사항 - 상담방법2",
						"id": "default1099",
						"filename": "default",
						"input": [
							{
								"intent": "불만 및 고충사항 - 상담방법"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "불만 및 고충사항 - 상담방법"
							}
						]
					},
					{
						"name": "불만 및 고충사항 - 처리절차2",
						"id": "default634",
						"filename": "default",
						"input": [
							{
								"intent": "불만 및 고충사항 - 처리절차"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "불만 및 고충사항 - 처리절차"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "불만 및 고충사항 상담안내"
					},
					{
						"text": "불만 및 고충사항 상담방법"
					},
					{
						"text": "불만 및 고충사항 처리절차"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "발급가능 내용",
				"id": "default636",
				"filename": "default",
				"input": [
					{
						"intent": "발급가능 내용"
					}
				],
				"output": [
					{
						"text": "의무기록 중 발급가능한것에 대해 안내드리겠습니다.\n\n진료기록(외래기록, 입원기록 등), 검사결과지(혈액검사, 소변검사, 조직검사, CT판독 결과 등), 영상사본(MRI, PET, CT 등) 사본발급이 가능합니다.단, 정신건강의학과 진료기록은 정신건강의학과 접수 및 의사상담 후 사본발급 창구에서 발급 가능합니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "의무기록 발급 절차",
				"id": "default637",
				"filename": "default",
				"input": [
					{
						"intent": "의무기록 발급 절차"
					}
				],
				"output": [
					{
						"text": "의무기록 사본발급 절차 안내드립니다.\n\n사본발급 창구(서관: 지하1층 직원식당 앞, 동관: 1층 로비) 방문 → 신분증 확인 및 구비서류(준비물) 제출 → 수납 및 사본 수령\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"buttons": [
							{
								"text": "서관 의무기록사본 발급처"
							},
							{
								"text": "동관 의무기록사본 발급처"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "서관 의무기록/영상사본발급2",
						"id": "default1160",
						"filename": "default",
						"input": [
							{
								"text": "서관 의무 기록 사본 발급 처"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "서관 의무기록/영상사본발급"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "서관 의무기록사본 발급처"
					},
					{
						"text": "동관 의무기록사본 발급처"
					}
				]
			},
			{
				"name": "신청 준비물-본인",
				"id": "default638",
				"filename": "default",
				"input": [
					{
						"text": "본인 서류 발급"
					}
				],
				"output": {
					"text": "본인이 의무기록 신청, 발급할 경우 본인 신분증을 가져오시면 됩니다.\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "신청 준비물 - 친족",
				"id": "default639",
				"filename": "default",
				"input": [
					{
						"text": "친족 신청"
					}
				],
				"output": [
					{
						"text": "환자분의 동의를 받으실 수 있나요?",
						"buttons": [
							{
								"text": "네"
							},
							{
								"text": "아니요"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "신청 준비물 - 친족 - 동의가능",
						"id": "default640",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": {
							"text": "환자분의 나이를 선택해주세요.",
							"buttons": [
								{
									"text": "만 13세 미만 아동"
								},
								{
									"text": "만 14세~만 16세"
								},
								{
									"text": "만 17세~"
								},
								{
									"text": "처음"
								},
								{
									"text": "이전"
								}
							],
							"kind": "Content"
						},
						"children": [
							{
								"name": "친족A",
								"id": "default1140",
								"filename": "default",
								"input": [
									{
										"text": "만 13 세 미만 아동"
									}
								],
								"output": [
									{
										"text": "아래의 서류를 준비해 주세요.\n\n(1) 환자 신분증 사본 : 환자의 이름과 주민등록번호 전체를 확인할 수 있는 서류(예, 주민등록초본, 가족관계증명서, 여권, 학생증 등)\n(2) 신청인 신분증 사본: 여권, 운전면허증, 주민등록증 등\n(3) 친족관계 확인 서류: 가족관계 증명서, 주민등록표 등본 등 (가족관계서류는 환자 또는 신청인 기준으로 발급, 건강보험증 확인 불가능)\n(4) 서류발급 동의서: 환자를 대신한 법정대리인이 작성하며 가족관계 증명서 등 법정대리인임을 확인할 수 있는 서류 제출\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
										"kind": "Text"
									}
								]
							},
							{
								"name": "친족B",
								"id": "default1141",
								"filename": "default",
								"input": [
									{
										"text": "만 14 세 만 16 세"
									}
								],
								"output": [
									{
										"text": "아래의 서류를 준비해 주세요.\n\n(1) 환자 신분증 사본 : 환자의 이름과 주민등록번호 전체를 확인할 수 있는 서류(예, 주민등록초본, 가족관계증명서, 여권, 학생증 등)\n(2) 신청인 신분증 사본: 여권, 운전면허증, 주민등록증 등\n(3) 친족관계 확인 서류: 가족관계 증명서, 주민등록표 등본 등 (가족관계서류는 환자 또는 신청인 기준으로 발급, 건강보험증 확인 불가능)\n(4) 서류발급 동의서: 환자가 자필 서명한 동의서\n\n※ 가족관계증명서, 주민등록표 등본 등 관공서에서 발행하는 서류는 최근 3개월만 유효함\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
										"kind": "Text"
									}
								]
							},
							{
								"name": "친족C",
								"id": "default1142",
								"filename": "default",
								"input": [
									{
										"text": "만 17 세"
									}
								],
								"output": [
									{
										"text": "아래의 서류를 준비해 주세요.\n\n(1) 환자 신분증 사본\n(2) 신청인 신분증 사본: 여권, 운전면허증, 주민등록증 등\n(3) 친족관계 확인 서류: 가족관계 증명서, 주민등록표 등본 등 (가족관계서류는 환자 또는 신청인 기준으로 발급, 건강보험증 확인 불가능)\n(4) 서류발급 동의서: 환자가 자필 서명한 동의서\n\n※ 가족관계증명서, 주민등록표 등본 등 관공서에서 발행하는 서류는 최근 3개월만 유효함\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
										"kind": "Text"
									}
								]
							}
						],
						"task": {
							"text": "환자분의 나이를 선택해주세요.",
							"buttons": [
								{
									"text": "만 13세 미만 아동"
								},
								{
									"text": "만 14세~만 16세"
								},
								{
									"text": "만 17세~"
								},
								{
									"text": "처음"
								},
								{
									"text": "이전"
								}
							],
							"kind": "Content"
						},
						"buttons": [
							{
								"text": "만 13세 미만 아동"
							},
							{
								"text": "만 14세~만 16세"
							},
							{
								"text": "만 17세~"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						]
					},
					{
						"name": "신청 준비물 - 친족 - 동의불가능",
						"id": "default641",
						"filename": "default",
						"input": [
							{
								"text": "아니다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물 - 동의불가능",
								"type": "Call"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "네"
					},
					{
						"text": "아니요"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "신청 준비물 - 대리인",
				"id": "default642",
				"filename": "default",
				"input": [
					{
						"text": "신청 대리인"
					}
				],
				"output": [
					{
						"text": "환자분의 동의를 받으실 수 있나요?",
						"buttons": [
							{
								"text": "네"
							},
							{
								"text": "아니요"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						],
						"kind": "Content"
					}
				],
				"children": [
					{
						"name": "신청 준비물 - 대리인 - 동의가능",
						"id": "default643",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": [
							{
								"text": "환자분의 동의를 받으실 수 있나요?",
								"buttons": [
									{
										"text": "만 13세 미만 아동"
									},
									{
										"text": "만 14세~만 16세"
									},
									{
										"text": "만 17세~"
									},
									{
										"text": "처음"
									},
									{
										"text": "이전"
									}
								],
								"kind": "Content"
							}
						],
						"children": [
							{
								"name": "대리인A",
								"id": "default1143",
								"filename": "default",
								"input": [
									{
										"text": "만 13 세 미만 아동"
									}
								],
								"output": [
									{
										"text": "아래의 서류를 준비해 주세요.\n\n(1) 환자 신분증 사본 : 환자의 이름과 주민등록번호 전체를 확인할 수 있는 서류(예, 주민등록초본, 가족관계증명서, 여권, 학생증 등)\n(2) 신청인 신분증 사본: 여권, 운전면허증, 주민등록증 등\n(3) 서류발급 동의서: 환자를 대신한 법정대리인이 작성하며 가족관계 증명서 등 법정대리인임을 확인할 수 있는 서류 제출\n(4) 서류발급 위임장: 환자를 대신한 법정대리인이 작성하며 가족관계 증명서 등 법정대리인임을 확인할 수 있는 서류 제출\n\n※ 가족관계증명서, 주민등록표 등본 등 관공서에서 발행하는 서류는 최근 3개월만 유효함\n\n* 처음으로 가시려면 처음 또는 0번, 이전단계로 가시러면 이전 또는 9번을 입력해주세요.",
										"kind": "Text"
									}
								]
							},
							{
								"name": "대리인B",
								"id": "default1144",
								"filename": "default",
								"input": [
									{
										"text": "만 14 세 만 16 세"
									}
								],
								"output": [
									{
										"text": "아래의 서류를 준비해 주세요.\n\n(1) 환자 신분증 사본 : 환자의 이름과 주민등록번호 전체를 확인할 수 있는 서류(예, 주민등록초본, 가족관계증명서, 여권, 학생증 등)\n(2) 신청인 신분증 사본: 여권, 운전면허증, 주민등록증 등\n(3) 서류발급 동의서: 환자가 자필 서명한 동의서\n(4) 서류발급 위임장: 환자가 자필 서명한 위임장\n\n※ 가족관계증명서, 주민등록표 등본 등 관공서에서 발행하는 서류는 최근 3개월만 유효함\n\n* 처음으로 가시려면 처음 또는 0번, 이전단계로 가시러면 이전 또는 9번을 입력해주세요.",
										"kind": "Text"
									}
								]
							},
							{
								"name": "대리인C",
								"id": "default1145",
								"filename": "default",
								"input": [
									{
										"text": "만 17 세"
									}
								],
								"output": [
									{
										"text": "아래의 서류를 준비해 주세요.\n\n(1) 환자 신분증 사본\n(2) 신청인 신분증 사본: 여권, 운전면허증, 주민등록증 등\n(3) 서류발급 동의서: 환자가 자필 서명한 동의서\n(4) 서류발급 위임장: 환자가 자필 서명한 위임장\n\n※ 가족관계증명서, 주민등록표 등본 등 관공서에서 발행하는 서류는 최근 3개월만 유효함\n\n* 처음으로 가시려면 처음 또는 0번, 이전단계로 가시러면 이전 또는 9번을 입력해주세요.",
										"kind": "Text"
									}
								]
							}
						],
						"buttons": [
							{
								"text": "만 13세 미만 아동"
							},
							{
								"text": "만 14세~만 16세"
							},
							{
								"text": "만 17세~"
							},
							{
								"text": "처음"
							},
							{
								"text": "이전"
							}
						]
					},
					{
						"name": "신청 준비물 - 대리인 - 동의불가능",
						"id": "default644",
						"filename": "default",
						"input": [
							{
								"text": "아니다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물 - 동의불가능",
								"type": "Call"
							}
						]
					}
				],
				"buttons": [
					{
						"text": "네"
					},
					{
						"text": "아니요"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "신청 준비물 - 환자사망",
				"id": "default645",
				"filename": "default",
				"input": [
					{
						"intent": "신청 준비물 - 환자사망"
					}
				],
				"output": {
					"text": "환자 사망으로 인하여 환자의 동의를 받을 수 없는 경우 아래의 준비물이 필요합니다.\n ■ 신청인 신분증\n ■ 가족관계증명서, 주민등록표 등본 등 친족관계임을 확인할 수 있는 서류\n ■ 사망사실 확인서류(가족관계증명서, 사망진단서, 제적등본 등)\n\n환자의 형제ㆍ자매가 요청하는 경우에는\n환자의 배우자 및 직계 존속ㆍ비속,\n배우자의 직계 존속이 모두 없음을 증명하는\n자료를 함께 제출하셔야 합니다. \n(친족이 없음을 증명하는 서류 및 확인서)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "신청 준비물-의식불명",
				"id": "default646",
				"filename": "default",
				"input": [
					{
						"intent": "신청 준비물 - 의식불명"
					}
				],
				"output": [
					{
						"text": "환자 의식불명 혹은 중증질환, 부상 등으로 인하여 동의를 받을 수 없는 경우 아래의 준비물이 필요합니다. \n ■ 신청인 신분증\n ■ 가족관계증명서, 주민등록표 등본 등 친족관계임을 확인할 수 있는 서류\n ■ 의식불명, 중증 질환 부상 등으로 자필서명을 할 수 없음을 확인할 수 있는 진단서\n\n환자의 형제ㆍ자매가 요청하는 경우에는\n환자의 배우자 및 직계 존속ㆍ비속,\n배우자의 직계 존속이 모두 없음을 증명하는\n자료를 함께 제출하셔야 합니다. \n(친족이 없음을 증명하는 서류 및 확인서)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "신청 준비물-행방불명",
				"id": "default647",
				"filename": "default",
				"input": [
					{
						"text": "행방불명 서류 신청"
					}
				],
				"output": [
					{
						"text": "환자 행방불명으로 인하여 동의를 받을 수 없는 경우 아래의 준비물이 필요합니다. \n ■ 신청인 신분증\n ■ 가족관계증명서, 주민등록표 등본 등 친족관계임을 확인할 수 있는 서류\n ■ 행방불명 사실을 확인할 수 있는 서류(주민등록표 등본, 법원의 실종선고 결정문 사본 등)\n\n환자의 형제ㆍ자매가 요청하는 경우에는\n환자의 배우자 및 직계 존속ㆍ비속,\n배우자의 직계 존속이 모두 없음을 증명하는\n자료를 함께 제출하셔야 합니다. \n(친족이 없음을 증명하는 서류 및 확인서)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "신청 준비물-의사무능력자",
				"id": "default648",
				"filename": "default",
				"input": [
					{
						"intent": "신청 준비물 - 의사무능력자"
					}
				],
				"output": [
					{
						"text": "환자가 스스로 의사판단을 하기 어려워 환자의 동의를 받을 수 없는 경우 아래의 준비물이 필요합니다. \n ■ 신청인 신분증\n ■ 가족관계증명서, 주민등록표 등본 등 친족관계임을 확인할 수 있는 서류\n ■ 법원의 금치산 선고 결정문 사본 또는 의사무능력자임을 증명하는 정신과 전문의의 진단서\n\n환자의 형제ㆍ자매가 요청하는 경우에는\n환자의 배우자 및 직계 존속ㆍ비속,\n배우자의 직계 존속이 모두 없음을 증명하는\n자료를 함께 제출하셔야 합니다. \n(친족이 없음을 증명하는 서류 및 확인서)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "신청 준비물 - 동의가능",
				"id": "default649",
				"filename": "default",
				"input": [
					{
						"intent": "신청 준비물 - 동의가능"
					}
				],
				"output": {
					"text": "환자분과의 관계는 다음 중 어떻게 되시나요?\n\n1. 친족(환자의 배우자, 직계존속, 비속, 배우자의 직계존속)\n2. 환자 대리인(형제, 자매, 보험회사 등)",
					"buttons": [
						{
							"text": "친족"
						},
						{
							"text": "환자 대리인"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "신청준비물 - 동의가능 - 친족",
						"id": "default650",
						"filename": "default",
						"input": [
							{
								"text": "친족"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물 - 친족 - 동의가능"
							}
						]
					},
					{
						"name": "신청 준비물 - 동의가능 - 대리인",
						"id": "default651",
						"filename": "default",
						"input": [
							{
								"text": "환자 대리인"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물 - 대리인 - 동의가능"
							}
						]
					}
				],
				"task": {
					"text": "환자분과의 관계는 다음 중 어떻게 되시나요?\n\n1. 친족(환자의 배우자, 직계존속, 비속, 배우자의 직계존속)\n2. 환자 대리인(형제, 자매, 보험회사 등)",
					"buttons": [
						{
							"text": "친족"
						},
						{
							"text": "환자 대리인"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "친족"
					},
					{
						"text": "환자 대리인"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "신청 준비물 - 동의불가능",
				"id": "default652",
				"filename": "default",
				"input": [
					{
						"text": "서류 신청 동의 불가"
					}
				],
				"output": {
					"text": "환자의 동의를 받으실 수 없는 경우 서류 발급에 관해 안내해드리겠습니다.\n\n현재 환자분의 동의를 받으실 수 없는 이유는 무엇인가요?\n\n1. 환자사망\n2. 환자 의식불명 또는 중증질환, 부상\n3. 환자 행방불명\n4. 환자 의사무능력자",
					"buttons": [
						{
							"text": "환자사망"
						},
						{
							"text": "환자 의식불명 또는 중증질환, 부상"
						},
						{
							"text": "환자 행방불명"
						},
						{
							"text": "환자 의사무능력자"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "신청 준비물 - 동의불가능 - 환자사망",
						"id": "default653",
						"filename": "default",
						"input": [
							{
								"text": "환자 사망"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물 - 환자사망"
							}
						]
					},
					{
						"name": "신청 준비물 - 동의불가능 - 환자 의식불명",
						"id": "default654",
						"filename": "default",
						"input": [
							{
								"text": "환자 의식 불명 또는 중증 질환 부상"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물-의식불명"
							}
						]
					},
					{
						"name": "신청 준비물 - 동의불가능 - 행방불명",
						"id": "default656",
						"filename": "default",
						"input": [
							{
								"text": "환자 행방불명"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물-행방불명"
							}
						]
					},
					{
						"name": "신청 준비물 - 동의불가능 - 환자 의사무능력자",
						"id": "default657",
						"filename": "default",
						"input": [
							{
								"text": "환자 의사 무능력자"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물-의사무능력자"
							}
						]
					}
				],
				"task": {
					"text": "환자의 동의를 받으실 수 없는 경우 서류 발급에 관해 안내해드리겠습니다.\n\n현재 환자분의 동의를 받으실 수 없는 이유는 무엇인가요?\n\n1. 환자사망\n2. 환자 의식불명 또는 중증질환, 부상\n3. 환자 행방불명\n4. 환자 의사무능력자",
					"buttons": [
						{
							"text": "환자사망"
						},
						{
							"text": "환자 의식불명 또는 중증질환, 부상"
						},
						{
							"text": "환자 행방불명"
						},
						{
							"text": "환자 의사무능력자"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "환자사망"
					},
					{
						"text": "환자 의식불명 또는 중증질환, 부상"
					},
					{
						"text": "환자 행방불명"
					},
					{
						"text": "환자 의사무능력자"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "신청 준비물 - 타인",
				"id": "default658",
				"filename": "default",
				"input": [
					{
						"text": "타인 신청 준비물"
					}
				],
				"output": {
					"text": "신청하시는 분께서 환자분의 동의를 얻으실 수 있나요?",
					"buttons": [
						{
							"text": "네"
						},
						{
							"text": "아니요"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "신청 준비물 - 타인 - 네",
						"id": "default659",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물 - 동의가능"
							}
						]
					},
					{
						"name": "신청 준비물 - 타인 - 아니요",
						"id": "default660",
						"filename": "default",
						"input": [
							{
								"text": "아니다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물 - 동의불가능"
							}
						]
					}
				],
				"task": {
					"text": "신청하시는 분께서 환자분의 동의를 얻으실 수 있나요?",
					"buttons": [
						{
							"text": "네"
						},
						{
							"text": "아니요"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "네"
					},
					{
						"text": "아니요"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "서류발급 - 준비물",
				"id": "default661",
				"filename": "default",
				"input": [
					{
						"intent": "서류 발급 - 준비물"
					}
				],
				"output": {
					"text": "본인이 신청하시나요?",
					"buttons": [
						{
							"text": "네"
						},
						{
							"text": "아니요"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "서류발급 - 준비물 - 본인2",
						"id": "default1105",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물-본인"
							}
						]
					},
					{
						"name": "서류발급 - 준비물 - 타인",
						"id": "default663",
						"filename": "default",
						"input": [
							{
								"text": "아니다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "신청 준비물 - 타인",
								"type": "Call"
							}
						]
					}
				],
				"task": {
					"text": "본인이 신청하시나요?",
					"buttons": [
						{
							"text": "네"
						},
						{
							"text": "아니요"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "네"
					},
					{
						"text": "아니요"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "서류 발급시간,비용",
				"id": "default664",
				"filename": "default",
				"input": [
					{
						"intent": "서류 발급시간, 비용"
					}
				],
				"output": [
					{
						"text": "■ 의무기록 사본 발급 창구 운영 시간\n - 평일 08:30 ~ 18:00, 토요일 08:30 ~ 13:00\n - 토요일은 서관 사본발급 창구만 운영, 공휴일은 휴무\n\n■ 의무기록 사본 발급 비용\n - 1매당 200원, CD 1장당 17,000원\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "증명서A",
				"id": "default665",
				"filename": "default",
				"input": [
					{
						"intent": "증명서A"
					}
				],
				"output": {
					"text": "문의하신 증명서 발급 절차를 알려드릴께요.\n\n환자가 입원중이신가요?",
					"buttons": [
						{
							"text": "네"
						},
						{
							"text": "아니요"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "증명서A-입원중",
						"id": "default1126",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": [
							{
								"text": "병동 간호사에게 신청하시기 바랍니다. \n\n발급절차: 병동 간호사에게 신청 → 담당 의사 작성 → 원무팀 수납창구에서 발급\n\n※ 재발급인 경우 진료 없이 원무팀 창구에서 바로 발급 가능합니다. (단, 진단서, 소견서, 입원사실증명서, 출생증명서, 수술확인서, 소득공제용 장애인증명서는 병원 홈페이지(인터넷)에서도 발급이 가능합니다.)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Text"
							}
						]
					},
					{
						"name": "증명서B-입원아님",
						"id": "default1127",
						"filename": "default",
						"input": [
							{
								"text": "아니다"
							}
						],
						"output": [
							{
								"text": "외래 진료 후 발급이 가능합니다. \n\n발급절차: 외래 진료 예약 → 외래 진료 시 의사에게 증명서 요청 → 원무팀 수납창구에서 발급\n\n※ 재발급인 경우 진료 없이 원무팀 창구에서 바로 발급 가능합니다. (단, 진단서, 소견서, 입원사실증명서, 출생증명서, 수술확인서, 소득공제용 장애인증명서는 병원 홈페이지(인터넷)에서도 발급이 가능합니다.)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
								"kind": "Text"
							}
						]
					}
				],
				"task": {
					"text": "문의하신 증명서 발급 절차를 알려드릴께요.\n\n환자가 입원중이신가요?",
					"buttons": [
						{
							"text": "네"
						},
						{
							"text": "아니요"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "네"
					},
					{
						"text": "아니요"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "서류발급 - 가능서류",
				"id": "default666",
				"filename": "default",
				"input": [
					{
						"intent": "서류 발급 - 가능서류"
					}
				],
				"output": {
					"text": "진단서, 소견서, 입원사실 증명서, 출생증멍서, 수술확인서, 소득공제용 장애인증명서, 입원확인서, 통원확인서, 상급병실 확인서, 진료비 세부 내역서, 진료비 확인서, 진료비 약제비 납입 증명서(연말 정산용)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "입원비",
				"id": "default1078",
				"filename": "default",
				"input": [
					{
						"intent": "입원비"
					}
				],
				"output": {
					"text": "입원비 관련하여 무엇이 궁금하신가요?\n\n1. 중간계산서\n2. 무통장 입금",
					"buttons": [
						{
							"text": "중간계산서"
						},
						{
							"text": "무통장 입금"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "입원치료 - 중간계산서2",
						"id": "default1080",
						"filename": "default",
						"input": [
							{
								"text": "중간 계산서"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "중간계산서"
							}
						]
					},
					{
						"name": "입원치료 - 무통장 입금2",
						"id": "default1081",
						"filename": "default",
						"input": [
							{
								"text": "무 통장 입금"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "무통장입금"
							}
						]
					}
				],
				"task": {
					"text": "입원비 관련하여 무엇이 궁금하신가요?\n\n1. 중간계산서\n2. 무통장 입금",
					"buttons": [
						{
							"text": "중간계산서"
						},
						{
							"text": "무통장 입금"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "중간계산서"
					},
					{
						"text": "무통장 입금"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "중간계산서",
				"id": "default1087",
				"filename": "default",
				"input": [
					{
						"intent": "중간계산서"
					}
				],
				"output": {
					"text": "중간계산서는 매주 화요일에 병실로 가져다 드립니다.\n\n납부장소 : 평일, 토요일 : 서관 1층 31번~40번창구, 신관 1층 2번~4번창구 /\n일요일, 공휴일 : 동관 1층 2번~10번창구  \n\n중간계산서 진료비에 대한 의문사항이 있으면 동관 6층 적정진료팀 담당자에게 문의 바랍니다.\n\n입원진료비 자동안내 전화 : 1688-7575 (ARS 3번 → 2번)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "무통장입금",
				"id": "default1088",
				"filename": "default",
				"input": [
					{
						"intent": "무통장 입금"
					}
				],
				"output": [
					{
						"text": "입원비 중간 계산이나 퇴원비 계산 시 환자별 가상계좌로 입금 하시면 됩니다. \n\n• 계좌번호 : 환자별 가상계좌 \n• 예금주 : 서울아산병원\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "입원 생활 - 식사 시간",
				"id": "default1091",
				"filename": "default",
				"input": [
					{
						"intent": "식사시간"
					}
				],
				"output": {
					"text": "■ 입원 환자 식사 시간 안내\n - 아침 : 오전 7시10분~8시\n - 점심 : 오후 12시 10분~1시\n - 저녁 : 오후 5시 20분~6시 10분\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "식사",
				"id": "default1092",
				"filename": "default",
				"input": [
					{
						"intent": "식사"
					}
				],
				"output": {
					"text": "식사와 관련하여 궁금하신 점은 무엇인가요?\n\n1. 식사 시간\n2. 식이 변경\n3. 식판 수거\n4. 보호자석 이용안내\n5. 냉장고 이용안내",
					"buttons": [
						{
							"text": "식사 시간"
						},
						{
							"text": "식이 변경"
						},
						{
							"text": "식판 수거"
						},
						{
							"text": "보호자석 이용안내"
						},
						{
							"text": "냉장고 이용안내"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "입원 생활 - 식사시간2",
						"id": "default1093",
						"filename": "default",
						"input": [
							{
								"text": "식사 시간"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "입원 생활 - 식사 시간"
							}
						]
					},
					{
						"name": "입원 생활 - 식이 변경2",
						"id": "default1094",
						"filename": "default",
						"input": [
							{
								"text": "식이 변경"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "입원 생활 - 식이 변경"
							}
						]
					},
					{
						"name": "입원 생활 - 식판 수거2",
						"id": "default1095",
						"filename": "default",
						"input": [
							{
								"text": "식판 수거"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "입원 생활 - 식판 수거"
							}
						]
					},
					{
						"name": "입원 생활 - 보호자석 이용 안내2",
						"id": "default1096",
						"filename": "default",
						"input": [
							{
								"text": "보호 자석 이용 안내"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "입원 생활 - 보호자석 이용 안내"
							}
						]
					},
					{
						"name": "입원 생활 - 냉장고 이용안내2",
						"id": "default1097",
						"filename": "default",
						"input": [
							{
								"text": "냉장고 이용 안내"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "입원 생활 - 냉장고 이용안내"
							}
						]
					}
				],
				"task": {
					"text": "식사와 관련하여 궁금하신 점은 무엇인가요?\n\n1. 식사 시간\n2. 식이 변경\n3. 식판 수거\n4. 보호자석 이용안내\n5. 냉장고 이용안내",
					"buttons": [
						{
							"text": "식사 시간"
						},
						{
							"text": "식이 변경"
						},
						{
							"text": "식판 수거"
						},
						{
							"text": "보호자석 이용안내"
						},
						{
							"text": "냉장고 이용안내"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "식사 시간"
					},
					{
						"text": "식이 변경"
					},
					{
						"text": "식판 수거"
					},
					{
						"text": "보호자석 이용안내"
					},
					{
						"text": "냉장고 이용안내"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "병실배정안내",
				"id": "default1100",
				"filename": "default",
				"input": [
					{
						"intent": "병실 배정"
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
				"name": "입원진료비안내",
				"id": "default1101",
				"filename": "default",
				"input": [
					{
						"intent": "입원진료비안내"
					}
				],
				"output": [
					{
						"text": "입원진료비안내는 병원대표번호 1688-7575로 전화 하셔서, 안내멘트에따라 3번→2번을 순차적으로 누르시면 됩니다. \n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
						"kind": "Text"
					}
				]
			},
			{
				"name": "증명서 발급위치",
				"id": "default1129",
				"filename": "default",
				"input": [
					{
						"intent": "증명서 발급위치"
					}
				],
				"output": {
					"text": "증명서는 원무팀 수납창구에서 발급받으실 수 있습니다.\n\n발급받기 전, 아래와 같은 절차를 따라 주세요.\n\n*환자가 입원하신 경우\n담당간호사 신청 → 담당의사 작성 → 원무팀 수납창구에서 발급\n\n*입원이 아니신 경우\n외래 진료 예약 → 외래 진료 시 의사에게 증명서 요청 → 원무팀 수납창구에서 발급\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			},
			{
				"name": "증명서B",
				"id": "default1135",
				"filename": "default",
				"input": [
					{
						"intent": "증명서B"
					}
				],
				"output": {
					"text": "증명서에 진단명(병명)이 표기가 되기를 원하시는지요?",
					"buttons": [
						{
							"text": "네"
						},
						{
							"text": "아니요"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"children": [
					{
						"name": "증명서B-병명표기",
						"id": "default1138",
						"filename": "default",
						"input": [
							{
								"text": "네"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "증명서A"
							}
						]
					},
					{
						"name": "증명서B-병명표기불필요",
						"id": "default1139",
						"filename": "default",
						"input": [
							{
								"text": "아니다"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "증명서C"
							}
						]
					}
				],
				"task": {
					"text": "증명서에 진단명(병명)이 표기가 되기를 원하시는지요?",
					"buttons": [
						{
							"text": "네"
						},
						{
							"text": "아니요"
						},
						{
							"text": "처음"
						},
						{
							"text": "이전"
						}
					],
					"kind": "Content"
				},
				"buttons": [
					{
						"text": "네"
					},
					{
						"text": "아니요"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				]
			},
			{
				"name": "증명서C",
				"id": "default1136",
				"filename": "default",
				"input": [
					{
						"intent": "증명서C"
					}
				],
				"output": {
					"text": "원무팀에서 발급 가능합니다.\n\n발급절차: 원무팀 수납창구에 신청 → 확인 후 발급 (경우에 따라 원무팀 사무실에서 발급 진행)\n\n※ 병원 홈페이지(인터넷)에서 발급이 가능한 서류: 입원확인서(입원기간만 기재), 통원(진료/치료)확인서(통원일자만 기재), 상급병실 확인서, 진료비 세부내역서(외래환자 대상), 진료비 확인서, 진료비 약제비 납입 증명서(연말정산용)\n\n* 처음으로 가시려면 '처음' 또는 0번, 이전단계로 가시러면 '이전' 또는 9번을 입력해주세요.",
					"kind": "Text"
				},
				"task": {
					"kind": "Text"
				}
			}
		],
		"task": "ORTask"
	},
	{
		"name": "D증명서C",
		"id": "default1137",
		"filename": "default",
		"input": [
			{
				"intent": "증명서C"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "증명서C"
			}
		]
	},
	{
		"name": "D병원주소",
		"id": "default1146",
		"filename": "default",
		"input": [
			{
				"intent": "병원주소"
			}
		],
		"output": [
			{
				"text": "서울아산병원 주소입니다.\n\n서울특별시 송파구 풍납2동 올림픽로 43길 88",
				"kind": "Text"
			}
		]
	},
	{
		"name": "D처음 오신 분 진료절차",
		"id": "default1147",
		"filename": "default",
		"input": [
			{
				"intent": "처음 오신 분 진료절차"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "처음 오신 분 진료 절차"
			}
		]
	},
	{
		"name": "증명서2",
		"id": "default1159",
		"filename": "default",
		"input": [
			{
				"text": "증명서"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "증명서",
				"type": "Call"
			}
		]
	},
	{
		"name": "D증명서A",
		"id": "default1133",
		"filename": "default",
		"input": [
			{
				"intent": "증명서A"
			}
		],
		"output": [
			{
				"kind": "Action",
				"call": "증명서A"
			}
		]
	},
	{
		"name": "D서류",
		"id": "default1152",
		"filename": "default",
		"input": [
			{
				"text": "서류"
			}
		],
		"output": [
			{
				"text": "어떤 서류에 대해 궁금하신가요?\n\n1. 증명서(진단서, 소견서 등 의사의 판단 및 의견이 필요한 서류)\n2. 의무기록 (요약지, 기록지 등 치료 기록이 포함된 서류)",
				"buttons": [
					{
						"text": "증명서"
					},
					{
						"text": "의무기록"
					},
					{
						"text": "처음"
					},
					{
						"text": "이전"
					}
				],
				"kind": "Content"
			}
		],
		"children": [
			{
				"name": "의무기록",
				"id": "default1154",
				"filename": "default",
				"input": [
					{
						"text": "의무 기록"
					}
				],
				"output": [
					{
						"kind": "Action",
						"call": "의무기록 발급 절차"
					}
				]
			},
			{
				"name": "증명서",
				"id": "default1155",
				"filename": "default",
				"input": [
					{
						"text": "증명서"
					}
				],
				"output": {
					"text": "어떤 증명서에 관련하여 알려드릴까요?",
					"kind": "Text"
				},
				"children": [
					{
						"name": "증명서A2",
						"id": "default1156",
						"filename": "default",
						"input": [
							{
								"intent": "증명서A"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "증명서A"
							}
						]
					},
					{
						"name": "증명서B2",
						"id": "default1157",
						"filename": "default",
						"input": [
							{
								"intent": "증명서B"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "증명서B"
							}
						]
					},
					{
						"name": "증명서C2",
						"id": "default1158",
						"filename": "default",
						"input": [
							{
								"intent": "증명서C"
							}
						],
						"output": [
							{
								"kind": "Action",
								"call": "증명서C"
							}
						]
					}
				],
				"task": {
					"kind": "Text"
				}
			}
		],
		"buttons": [
			{
				"text": "증명서"
			},
			{
				"text": "의무기록"
			},
			{
				"text": "처음"
			},
			{
				"text": "이전"
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
			},
			{
				"text": "처음"
			}
		],
		"output": {
			"text": "안녕하세요 아산봇입니다.\n아산봇은 전화, 홈페이지보다 메신저가 편한 고객님들을 위해 24시간 응답하는 챗봇입니다.\n\n아산병원 안내와 관련하여 궁금하신 점을 입력해주세요. \n\n무엇을 입력해야할지 모르시겠나요? 그렇다면,아래메뉴의 중 해당하는 번호를 입력하세요:)\n\n1. 교통 및 주차 안내\n2. 병원 내 위치 찾기 (예, 정형외과, 96병동, 편의점 등)\n3. 진료안내\n4. 입원안내\n5. 건강검진 안내\n6. 서류발급 안내\n7. 편의 시설 이용 안내",
			"kind": "Text"
		}
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
	},
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
			},
			{
				"text": "0"
			}
		],
		"output": {
			"text": "안녕하세요 아산봇입니다.\n아산봇은 전화, 홈페이지보다 메신저가 편한 고객님들을 위해 24시간 응답하는 챗봇입니다.\n\n고객님께서 아산병원 안내와\n 관련하여 궁금하신 점을 입력해주세요. \n\n또는 아래의메뉴의 번호를 입력하세요:)\n\n1. 교통 및 주차 안내\n2. 병원 내 위치 찾기 (예, 정형외과, 96병동, 편의점 등)\n3. 진료안내\n4. 입원안내\n5. 건강검진 안내\n6. 서류발급 안내\n7. 편의 시설 이용 안내",
			"kind": "Text"
		}
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
			},
			{
				"text": "9"
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
