


var dialogs = [
	{
		"name": "FAN 가입",
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"text": "가입"
			},
			{
				"text": "앱"
			},
			{
				"text": "앱 카드"
			},
			{
				"text": "설치"
			},
			{
				"text": "회원"
			},
			{
				"text": "다운로드"
			},
			{
				"text": "다운"
			},
			{
				"text": "앱스토어"
			},
			{
				"text": "플레이스토어"
			},
			{
				"text": "1"
			}
		],
		"output": {
			"output": "신한 FAN은 신한카드가 없어도 가입가능! \n신한카드를 이미 보유하고 계시면 카드회원, 아직 카드가 없으시다면 일반회원으로 가입해주세요. \n\n신한 FAN에 가입 하시면 다양한 경품이 가득!\n아래 링크를 클릭하시고 이벤트에 응모해주세요. \n[24시간내 전원 100% 당첨 경품 제공!]\n* 대상 : 최초 신규 등록회원(기존 가입회원 제외)\n* 방법 : 하단 클릭 후 이벤트 응모 ] 24시간내 앱다운로드 및 가입 ] 경품 실시간 발송\n\n신한 FAN App이 설치되어 있어야, 회원 가입 및 이벤트에 참여 하실 수 있습니다.\n\n※ 가입시, '추천인 등록'에 '신한카드'를 선택하셔야 쿠폰이 발송됩니다.\n\n(* 처음으로 돌아가기 : 0 또는 '처음')",
			"buttons": [
				{
					"text": "가입하기",
					"url": "https://newm.shinhancard.com/event/2015/pt06.jsp?prm=kakao"
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"inRaw": "1",
		"inNLP": "1"
	},
	{
		"name": "FAN 혜택",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "혜택"
			},
			{
				"text": "2"
			}
		],
		"output": "신한 FAN에는 고객님을 위한  다양한 혜택들이 있습니다. 어떤 혜택을 알아볼까요?\n1. FAN 전용 적립 및 할인\n2. 진행중인 대박 이벤트\n\n(* 처음으로 돌아가기 : 0 또는 '처음')",
		"children": [
			{
				"name": "dialog_default28",
				"id": "default28",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 전용 적립 및 할인"
				}
			},
			{
				"name": "dialog_default29",
				"id": "default29",
				"filename": "default",
				"input": [
					{
						"text": "2"
					}
				],
				"output": {
					"call": "이벤트"
				}
			}
		]
	},
	{
		"name": "FAN 전용 적립 및 할인",
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"text": "적립"
			},
			{
				"text": "할인"
			},
			{
				"text": "쿠폰"
			}
		],
		"output": "스마트컨슈머를 위한 다양한 혜택!\n신한 FAN만의 다양한 혜택을 누리세요!\n\n1. 신한 FAN 혜택ZONE!\n2. 나만의 맞춤 쿠폰 Sally\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
		"inRaw": "1",
		"inNLP": "1",
		"children": [
			{
				"name": "dialog_default30",
				"id": "default30",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "혜택 안내"
				}
			},
			{
				"name": "dialog_default32",
				"id": "default32",
				"filename": "default",
				"input": [
					{
						"text": "2"
					}
				],
				"output": {
					"call": "Sally 쿠폰 상세"
				}
			},
			{
				"name": "dialog_default100",
				"id": "default100",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "FAN 혜택"
				}
			}
		]
	},
	{
		"name": "이벤트",
		"id": "default6",
		"filename": "default",
		"input": [
			{
				"text": "이벤트"
			}
		],
		"output": {
			"output": "지금 진행되는 다양한 이벤트가 있어요.\n\n[5월 온라인 쇼핑몰 할인 혜택]\n- 5월에도 멈추지 안흔 신한카드의 할인 혜택! 이달의 온리안 쇼핑몰/홈쇼핑 할인행사가 있어요! \n- 기간 : 2017년 05월 01일~2017년 05월 31일\n\n[포인트 바꿔쓰기 이벤트]\n- 차곡차곡 쌓은 마이신한포인트, FAN에서 다양하게 바꾸어 사용해보세요. 추첨을 통해 포인트를 드립니다.\n- 기간 : 2017년 05월 08일~2017년 05월 31일\n\n이외에 00개의 이벤트가 있어요. 자세한 내용은 '신한 FAN'에서 확인할 수 있어요. \n\n신한 FAN에 가입하신 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?+A2:F14=FAN_MAIN_304"
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"children": [
			{
				"name": "dialog_default101",
				"id": "default101",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "FAN 혜택"
				}
			}
		]
	},
	{
		"name": "혜택 안내",
		"id": "default7",
		"filename": "default",
		"input": [
			{
				"text": "X GOLF"
			},
			{
				"text": "동부 화재"
			},
			{
				"text": "티머니"
			},
			{
				"text": "하나투어"
			},
			{
				"text": "야 놀다"
			},
			{
				"text": "리 화이트"
			}
		],
		"output": {
			"output": "신한 FAN 고객만을 위한 혜택입니다. 지금바로 신한 FAN의 다양한 혜택을 확인하세요!  \n\n[할인 혜택]\n- GS25, 홈플러스, 동부화재, 티머니\n[포인트적립/쿠폰 혜택]\n- 홈플러스, 야놀자, X-GOLF 무료부킹\n[쇼핑/식품]\n- GS25, 홈플러스, 11번가, 티몬, CJ오쇼핑, 롯데면세점, 마켓컬리, 에브리밀\n[여가/보험]\n-교보문고, 인터파크 티켓, X-GOLF, 롯데시네마, 하나투어, 호텔패스, 야놀자, 동부화재\n[요식/생활]\n-포잉, 요기요, 플레이팅, 다방, 한방이사, 한솔교육, 리화이트\n[뷰티/패션]\n- 아모레퍼시픽, LF몰, 브리치, 스트라입스, 헤이뷰티, 왓슈, 꾸까\n[교통/차량]\n- 티머니, 쏘카, 아이파킹, 카페인, 페달링, 빨리와, 자몽, 화물맨, 코레일\n\n이 많은 혜택을 신한 FAN에 가입하시면 누리실 수 있어요!\n신한 FAN에 가입하신 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_104"
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"inRaw": "1",
		"inNLP": "1",
		"children": [
			{
				"name": "dialog_default102",
				"id": "default102",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "FAN 전용 적립 및 할인"
				}
			}
		]
	},
	{
		"name": "Sally 쿠폰 상세",
		"id": "default9",
		"filename": "default",
		"input": [
			{
				"text": "빅데이터"
			},
			{
				"text": "SALLY"
			}
		],
		"output": {
			"output": "빅데이터 기반의 고객 맞춤형  혜택쿠폰 Sally\n\nSally는 신한카드의 다양한 혜택을 빅데이터 기반으로 고객님께 안내/추천 해드리는 서비스입니다.\n뜻밖의 행운이라는 샐리의 법칙처럼 고객님의 매일매일이 기분좋은 설렘으로 가특하시기 바랍니다.\n\nSally는 신한 FAN에 가입하신 고객님께 제공되는 혜택입니다. \n신한 FAN에 가입하신 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_305"
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"children": [
			{
				"name": "dialog_default103",
				"id": "default103",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "FAN 전용 적립 및 할인"
				}
			}
		]
	},
	{
		"name": "이용안내",
		"id": "default10",
		"filename": "default",
		"input": [
			{
				"text": "결제"
			},
			{
				"text": "금융"
			},
			{
				"text": "생활"
			},
			{
				"text": "포인트"
			},
			{
				"text": "3"
			}
		],
		"output": "간편결제를 기반으로 결제,금융/생활, 포인트 서비스를 한번에! 무엇을 알아볼까요?\n1. 편리한 FAN페이 결제 이용가이드\n2. FAN페이 가맹점 안내\n3. 다양한 제휴/FUN/생활/금융 서비스\n4. 통합리워드(포인트) 신한 FAN클럽",
		"children": [
			{
				"name": "dialog_default33",
				"id": "default33",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 결제 이용가이드"
				}
			},
			{
				"name": "dialog_default34",
				"id": "default34",
				"filename": "default",
				"input": [
					{
						"text": "2"
					}
				],
				"output": {
					"call": "FAN페이 가맹점 안내"
				}
			},
			{
				"name": "dialog_default35",
				"id": "default35",
				"filename": "default",
				"input": [
					{
						"text": "3"
					}
				],
				"output": {
					"call": "다양한 제휴/FUN/생활/금융 서비스"
				}
			},
			{
				"name": "dialog_default36",
				"id": "default36",
				"filename": "default",
				"input": [
					{
						"text": "4"
					}
				],
				"output": {
					"call": "통합리워드(포인트) 신한 FAN클럽"
				}
			}
		]
	},
	{
		"name": "FAN 결제 이용가이드",
		"id": "default11",
		"filename": "default",
		"input": [
			{
				"text": "이용"
			},
			{
				"text": "가이드"
			},
			{
				"text": "지문"
			},
			{
				"text": "홍채"
			}
		],
		"output": {
			"output": "신한 FAN을 통해 편리한 온/오프라인 결제를 할 수 있습니다.\n\n결제 방식은 나한테 맞는걸 선택하시면 되요. \n고객님을 항상 생각하는 스마트한 FAN답게 다양한 결제 방식을 제공합니다. \n\n- 비밀번호\n- 지문\n- 홍채 인증\n\n이용가이드를 확인해보세요!\n신한 FAN을 통해서 결제를 하고 싶으시다면 회원가입은 필수 겠지요? \n\n신한 FAN에 가입하신 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?url=https://m.shinhancard.com/conts/html/shinhanFAN/introFAN/M"
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"children": [
			{
				"name": "dialog_default104",
				"id": "default104",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "이용안내"
				}
			}
		]
	},
	{
		"name": "FAN페이 가맹점 안내",
		"id": "default12",
		"filename": "default",
		"input": [
			{
				"text": "가맹 점"
			}
		],
		"output": {
			"output": "GS25, GS슈퍼마켓, 롯데마트, 홈플러스, 롯데슈퍼, 하나로클럽, 세븐일레븐, 바이더웨이, 교보문고, JDC면세점, S-Oil, E1, 아리따움, Espoire, 에띄드, 오설록, 에버랜드, 대명리조트, 파르나스몰, 베어스타운리조트, BEANS NIS, 홀리스커피, 카페 Ti-amo, 이니스프리, 주커피, ORGA, Obong 도시락, Eight Seconds, LOHB, 엘지패션, 씨유, 커피앤구르나루\n\nFAN App에서 고객님께서 계신 지역에 어떤 가맹점이 있는지 더 자세히 볼 수 있어요. \n\n신한 FAN에 가입하신 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_038"
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"children": [
			{
				"name": "dialog_default105",
				"id": "default105",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "이용안내"
				}
			}
		]
	},
	{
		"name": "다양한 제휴/FUN/생활/금융 서비스",
		"id": "default13",
		"filename": "default",
		"input": [
			{
				"text": "FUN"
			},
			{
				"text": "서비스"
			},
			{
				"text": "컨텐츠"
			}
		],
		"output": "신한 FAN에서는 xx개의 제휴사 서비스스와 운세, 게임, 웹툰과  같은  FUN컨텐츠 부터  더치페이, 투자정보, 소비관리 와 같은 금융서비스까지  한번에 누릴 수 있습니다. 신한 FAN에 놀러오세요!\n1. 제휴사서비스(혜택+)\n2. 운세\n3. 게임\n4. 페이봇\n5. 트렌드연구소\n6. 더치페이\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
		"children": [
			{
				"name": "dialog_default37",
				"id": "default37",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "제휴사서비스(혜택+)"
				}
			},
			{
				"name": "dialog_default38",
				"id": "default38",
				"filename": "default",
				"input": [
					{
						"text": "2"
					}
				],
				"output": {
					"call": "운세"
				}
			},
			{
				"name": "dialog_default39",
				"id": "default39",
				"filename": "default",
				"input": [
					{
						"text": "3"
					}
				],
				"output": {
					"call": "게임"
				}
			},
			{
				"name": "dialog_default40",
				"id": "default40",
				"filename": "default",
				"input": [
					{
						"text": "4"
					}
				],
				"output": {
					"call": "페이봇"
				}
			},
			{
				"name": "dialog_default41",
				"id": "default41",
				"filename": "default",
				"input": [
					{
						"text": "5"
					}
				],
				"output": {
					"call": "트렌드연구소"
				}
			},
			{
				"name": "dialog_default42",
				"id": "default42",
				"filename": "default",
				"input": [
					{
						"text": "6"
					}
				],
				"output": {
					"call": "더치페이"
				}
			},
			{
				"name": "dialog_default106",
				"id": "default106",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "이용안내"
				}
			}
		]
	},
	{
		"name": "통합리워드(포인트) 신한 FAN클럽",
		"id": "default14",
		"filename": "default",
		"input": [
			{
				"text": "FAN 클럽"
			},
			{
				"text": "리 워드"
			}
		],
		"output": {
			"output": "신한에선 포인트도 자산이다!\n신한금융그룹과 거래를 할수록 더많은 혜택을 드리는 통합리워드 서비스 신한 FAN클럽! \n포인트 적립/이용부터 쇼핑/쿠폰/그룹사 혜택까지 한번에 이용하세요\n\n\n신한 FAN클럽 서비스는 가입하신 고객에게 제공되는 서비스입니다. \n가입 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
			"image": {
				"url": "/files/sh_logo.png"
			},
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_102"
				}
			]
		},
		"children": [
			{
				"name": "dialog_default107",
				"id": "default107",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "이용안내"
				}
			}
		]
	},
	{
		"name": "제휴사서비스(혜택+)",
		"id": "default15",
		"filename": "default",
		"input": [
			{
				"text": "쇼핑"
			},
			{
				"text": "식품"
			},
			{
				"text": "여가"
			},
			{
				"text": "보험"
			},
			{
				"text": "음식"
			},
			{
				"text": "뷰티"
			},
			{
				"text": "패션"
			},
			{
				"text": "교통"
			},
			{
				"text": "차량"
			}
		],
		"output": {
			"output": "신한 FAN 고객만을 위한 혜택입니다. 지금바로 신한 FAN의 다양한 혜택을 확인하세요!  \n\n[할인 혜택]\n- GS25, 홈플러스, 동부화재, 티머니\n[포인트적립/쿠폰 혜택]\n- 홈플러스, 야놀자, X-GOLF 무료부킹\n[쇼핑/식품]\n- GS25, 홈플러스, 11번가, 티몬, CJ오쇼핑, 롯데면세점, 마켓컬리, 에브리밀\n[여가/보험]\n-교보문고, 인터파크 티켓, X-GOLF, 롯데시네마, 하나투어, 호텔패스, 야놀자, 동부화재\n[요식/생활]\n-포잉, 요기요, 플레이팅, 다방, 한방이사, 한솔교육, 리화이트\n[뷰티/패션]\n- 아모레퍼시픽, LF몰, 브리치, 스트라입스, 헤이뷰티, 왓슈, 꾸까\n[교통/차량]\n- 티머니, 쏘카, 아이파킹, 카페인, 페달링, 빨리와, 자몽, 화물맨, 코레일\n\n이 많은 혜택을 신한 FAN에 가입하시면 누리실 수 있어요!\n신한 FAN에 가입하신 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_104"
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"children": [
			{
				"name": "dialog_default108",
				"id": "default108",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "다양한 제휴/FUN/생활/금융 서비스"
				}
			}
		]
	},
	{
		"name": "운세",
		"id": "default16",
		"filename": "default",
		"input": [
			{
				"text": "운세"
			}
		],
		"output": {
			"output": "오늘의 운세, 주간운세 신토정비결, 타로카드 등 나의 운세를 확인해보세요. \n\n- 동양운세\n- 서양운세(오늘의타로,월간타로, 신년타로 등)\n\n운세 서비스는 신한 FAN에 가입하신 고객에게 제공되는 서비스입니다. \n가입 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_301"
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"children": [
			{
				"name": "dialog_default109",
				"id": "default109",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "다양한 제휴/FUN/생활/금융 서비스"
				}
			}
		]
	},
	{
		"name": "게임",
		"id": "default17",
		"filename": "default",
		"input": [
			{
				"text": "게임"
			},
			{
				"text": "게임 존"
			}
		],
		"output": {
			"output": "게임만 해도 포인트가 적립되는 미니게임이 있어요! 게임이 자신이 있으신 분들은 도전해보세요!\n\n[미니게임]\n- 차곡차곡판권쌓기 (5월대회진행중)\n- FAN 팡!(5월대회진행중)\n- 판원을 구해라(5월대회진행중)\n\nFAN게임존은 신한 FAN에 가입하신 고객에게 제공되는 서비스입니다. \n가입 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_302"
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"children": [
			{
				"name": "dialog_default110",
				"id": "default110",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "다양한 제휴/FUN/생활/금융 서비스"
				}
			}
		]
	},
	{
		"name": "페이봇",
		"id": "default18",
		"filename": "default",
		"input": [
			{
				"text": "페이 봇"
			},
			{
				"text": "소비 관리"
			}
		],
		"output": {
			"output": "합리적인 소비를 도와줄 나만의 금융비서 페이봇!\n\nFAN페이봇은 신한 FAN에 가입하신 고객에게 제공되는 서비스입니다. \n가입 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "\"https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_084 \""
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"children": [
			{
				"name": "dialog_default111",
				"id": "default111",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "다양한 제휴/FUN/생활/금융 서비스"
				}
			}
		]
	},
	{
		"name": "트렌드연구소",
		"id": "default19",
		"filename": "default",
		"input": [
			{
				"text": "트렌드 연구소"
			},
			{
				"text": "트렌디 스"
			}
		],
		"output": {
			"output": "이것만 알면 나도 트렌드세터! 트렌드연구소에서 다양한 정보를 제공해드립니다.\n\n[트렌드클립]\n- 동영상으로 제공되는 라이프스타일 정보컨텐츠 입니다\n[트렌트뉴스]\n- 기사로 보는 트렌트 관련 뉴스들 입니다.\n[인포그래픽스]\n- 트렌드와 관련된 다양한 통계정보를 제공합니다. \n\n신한 트렌드연구소의 컨텐츠는 신한FAN에 가입하신 고객에게 제공되는 서비스입니다. \n가입 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_314"
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"children": [
			{
				"name": "dialog_default112",
				"id": "default112",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "다양한 제휴/FUN/생활/금융 서비스"
				}
			}
		]
	},
	{
		"name": "더치페이",
		"id": "default20",
		"filename": "default",
		"input": [
			{
				"text": "더치페이"
			}
		],
		"output": {
			"output": "현금없이도 가능한\n카드 '더치페이'\n설명 : 대표로 카드 결제한 고객이 FAN을 통해 대상자에게 분담금액을 요청하고 분담금액의 신용카드 결제를 통해 대표로 카드 결제한 고객의 결제대금을 차감받는 서비스\n\n더치페이는 신한 FAN에 가입하신 고객에게 제공되는 서비스입니다. \n가입 고객은 '바로보기'를 클릭해 주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_085"
				}
			],
			"image": {
				"url": "/files/sh_logo.png"
			}
		},
		"children": [
			{
				"name": "dialog_default113",
				"id": "default113",
				"filename": "default",
				"input": [
					{
						"text": "이전"
					}
				],
				"output": {
					"call": "다양한 제휴/FUN/생활/금융 서비스"
				}
			}
		]
	},
	{
		"name": "FAN에 대해 자주하는 질문들(FAQ)",
		"id": "default21",
		"filename": "default",
		"input": [
			{
				"text": "질문"
			},
			{
				"text": "FAQ"
			},
			{
				"text": "문의"
			},
			{
				"text": "4"
			}
		],
		"output": "FAN관련 궁금하신부분을 말씀하시면 가장 알맞은 답변을 안내해드리겠습니다. 궁금하신 질문을 '단어'로 입력해주세요!",
		"children": [
			{
				"name": "dialog_default98",
				"id": "default98",
				"filename": "default",
				"input": [
					{
						"types": [
							"fanfaqType"
						]
					}
				],
				"output": "아래 중에 궁금하신 내용이 있나요?\n#typeDoc#+index+. +title+\n#번호를 입력하면 상세 내용을 보여드립니다.\n다시 검색하시려면 검색어를 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음')",
				"children": [
					{
						"name": "dialog_default99",
						"id": "default99",
						"filename": "default",
						"input": [
							{
								"types": [
									"listType"
								]
							}
						],
						"output": "[+listType.title+]\n+listType.content+\n더 필요하신 게 있으시면 말씀해주세요~\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
						"children": [
							{
								"name": "dialog_default114",
								"id": "default114",
								"filename": "default",
								"input": [
									{
										"text": "이전"
									}
								],
								"output": {
									"up": "1"
								}
							}
						]
					},
					{
						"name": "dialog_default140",
						"id": "default140",
						"filename": "default",
						"input": [
							{
								"if": "true"
							}
						],
						"output": {
							"callChild": "FAN에 대해 자주하는 질문들(FAQ)"
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
				"text": "신용카드"
			},
			{
				"text": "체크카드"
			},
			{
				"text": "추천"
			},
			{
				"text": "5"
			}
		],
		"output": "안녕하세요. OOO봇입니다\n내게 맞는 신한카드를 추천해드립니다. \n나의 소비 패턴 및 결제스타일을 기반으로 OOO봇이 추천해드립니다.\n\n먼저 나의 결제 스타일부터 알아볼까요?\n1. 신용카드를 선호합니다.\n2. 체크카드를 선호합니다.\n\n(* 처음으로 돌아가기 : 0 또는 '처음')\n",
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
				"output": "신한카드에서 제공되는 혜택을 직접 이것저것 선택하여 구성할 수 도 있고, 미리 구성되어 있는 카드중에서 고르실 수도 있어요. \n다음단계로 넘어가기 위해서 아래 보기중에서 선택해주세요. \n1. 직접 혜택을 구성하고 싶다 (혜택선택형)\n2. 구성되어 있는 카드를 고르고 싶다(혜택기본형)\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
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
						"output": "고객님께서 구성하고 싶으신 혜택이 주로 할인인가요? 포인트 적립인가요?\n\n1. 할인(캐시백)\n2. 포인트 적립\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
						"children": [
							{
								"name": "할인",
								"id": "default63",
								"filename": "default",
								"input": [
									{
										"text": "할인"
									},
									{
										"text": "1"
									},
									{
										"text": "캐시 백"
									}
								],
								"output": {
									"output": "고객님께 딱 맞는 카드를 추천해드려요.\n\n[신한카드 YOLO ⓘ]가 고객님께서 좋아하실 카드 입니다. \n\n할인율과 디자인을 내 마음대로!!\n나의 맞춤카드를 원하신다면, “YOLO”오세요~\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
									"buttons": [
										{
											"text": "바로보기",
											"url": "https://www.shinhancard.com/conts/person/card_info/major/benefit/propose/1301614_31350.jsp"
										}
									]
								},
								"children": [
									{
										"name": "dialog_default130",
										"id": "default130",
										"filename": "default",
										"input": [
											{
												"text": "이전"
											}
										],
										"output": {
											"up": "1"
										}
									}
								]
							},
							{
								"name": "포인트적립",
								"id": "default64",
								"filename": "default",
								"input": [
									{
										"text": "포인트"
									},
									{
										"text": "2"
									}
								],
								"output": {
									"output": "고객님께 딱 맞는 카드를 추천해드려요.\n\n[신한 Hi-Point 카드 Nano f]가 고객님께서  좋아하실 카드 입니다. \n\n이 땅의 패션피플을 위한 단 하나의 카드!입니다.\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
									"buttons": [
										{
											"text": "바로보기",
											"url": "https://www.shinhancard.com/conts/person/card_info/major/benefit/oneself/1198220_12880.jsp"
										}
									]
								},
								"children": [
									{
										"name": "dialog_default132",
										"id": "default132",
										"filename": "default",
										"input": [
											{
												"text": "이전"
											}
										],
										"output": {
											"up": "1"
										}
									}
								]
							},
							{
								"name": "dialog_default131",
								"id": "default131",
								"filename": "default",
								"input": [
									{
										"text": "이전"
									}
								],
								"output": {
									"up": "1"
								}
							},
							{
								"name": "dialog_default65",
								"id": "default65",
								"filename": "default",
								"input": [
									{
										"if": "true"
									}
								],
								"output": {
									"repeat": "1"
								}
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
						"output": "신용카드를 추천해드리기 전에 간단하게 고객님께서 어떤 카드를 원하시는지 몇가지만 여쭤볼께요. \n할인(캐시백)과 포인트 적립중 어떤 것을 선호하시나요?\n\n1. 할인(캐시백)\n2. 포인트 적립\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
						"children": [
							{
								"name": "할인2",
								"id": "default66",
								"filename": "default",
								"input": [
									{
										"text": "할인"
									},
									{
										"text": "캐시 백"
									},
									{
										"text": "1"
									}
								],
								"output": "고객님은 어떤 소비유형에 가까우신가요?\n\n1. 숫자에 민감하며, 재테크에 관심이 많다. \n2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n3. 기름값, 교통비가 할인을 원하는 실속파다.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
								"children": [
									{
										"name": "숫자민감형",
										"id": "default69",
										"filename": "default",
										"input": [
											{
												"text": "1"
											},
											{
												"text": "숫자"
											},
											{
												"text": "재테크"
											}
										],
										"output": {
											"output": "고객님께 딱 맞는 카드를 추천해드려요.\n\n[신한카드 미래설계]가 고객님께서  좋아하실 카드 입니다. \n\n생활비 할인에 금융 혜택까지 제공해드립니다.\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
											"buttons": [
												{
													"text": "바로보기",
													"url": "https://www.shinhancard.com/conts/person/card_info/major/benefit/wealth/1237418_12886.jsp"
												}
											]
										},
										"children": [
											{
												"name": "dialog_default133",
												"id": "default133",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											}
										]
									},
									{
										"name": "소비추구형",
										"id": "default70",
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
										"output": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 4가지나 있네요. \n아래 4가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 언제나 FAN으로 혜택을 받을수 있어요. [신한카드 Always FAN]\n2. 온.오프라인을 뛰어넘은 할인을 제공해드려요. [신한카드 O2O]\n3. 실속형 여성 프리미엄 회원을 위한 카드입니다. [신한카드 The LADY CLASSIC]\n4. Premium 적립에 Trendy 할인을 맞추었습니다. [신한카드 The CLASSIC-Y]\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
										"children": [
											{
												"name": "dialog_default143",
												"id": "default143",
												"filename": "default",
												"input": [
													{
														"text": "1"
													}
												],
												"output": {
													"output": "[신한카드 Always FAN] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/major/benefit/propose/1331070_31350.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default147",
														"id": "default147",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default144",
												"id": "default144",
												"filename": "default",
												"input": [
													{
														"text": "2"
													}
												],
												"output": {
													"output": "[신한카드 O2O] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/major/benefit/propose/1310619_31350.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default148",
														"id": "default148",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default145",
												"id": "default145",
												"filename": "default",
												"input": [
													{
														"text": "3"
													}
												],
												"output": {
													"output": "[신한카드 The LADY CLASSIC] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/premium/vip/1282931_12788.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default149",
														"id": "default149",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default146",
												"id": "default146",
												"filename": "default",
												"input": [
													{
														"text": "4"
													}
												],
												"output": {
													"output": "[신한카드 The CLASSIC-Y] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/premium/vip/1282931_12788.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default150",
														"id": "default150",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default134",
												"id": "default134",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											},
											{
												"name": "dialog_default154",
												"id": "default154",
												"filename": "default",
												"input": [
													{
														"if": "true"
													}
												],
												"output": {
													"repeat": "1"
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
											"output": "고객님께 딱 맞는 카드를 추천해드려요.\n\n[GS칼텍스 신한카드 Shine] 가 기름값, 교통비 할인 혜택이 제공되는 카드는 입니다.\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
											"buttons": [
												{
													"text": "바로보기",
													"url": "https://www.shinhancard.com/conts/person/card_info/major/benefit/oil/1198262_12889.jsp"
												}
											]
										},
										"children": [
											{
												"name": "dialog_default135",
												"id": "default135",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											}
										]
									},
									{
										"name": "dialog_default129",
										"id": "default129",
										"filename": "default",
										"input": [
											{
												"text": "이전"
											}
										],
										"output": {
											"up": "1"
										}
									},
									{
										"name": "dialog_default72",
										"id": "default72",
										"filename": "default",
										"input": [
											{
												"if": "true"
											}
										],
										"output": {
											"repeat": "1"
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
										"text": "포인트"
									},
									{
										"text": "2"
									}
								],
								"output": "고객님은 어떤 소비유형에 가까우신가요?\n\n1. 숫자에 민감하며, 재테크에 관심이 많다. \n2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n3. 여행을 좋아한다. 항공마일리지에 집중!\n4. 기름값, 교통비가 할인을 원하는 실속파다.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
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
											"output": "고객님께 딱 맞는 카드를 추천해드려요.\n\n[신한카드 주거래 신용 [스마트 OTP 겸용]]이 고객님께서 좋아하실 카드 입니다. \n\n나의 Main 금융파트너!\n신한 주거래 패키지로 혜택을 누리세요!\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
											"buttons": [
												{
													"text": "바로보기",
													"url": "https://www.shinhancard.com/conts/person/card_info/major/benefit/wealth/1278820_12886.jsp"
												}
											]
										},
										"children": [
											{
												"name": "dialog_default136",
												"id": "default136",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											}
										]
									},
									{
										"name": "소비추구형2",
										"id": "default74",
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
										"output": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 2가지가 있네요. \n아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 포인트를 백화점 상품권으로 돌려받을 수 있어요. 포인트 최고 5% 적립! [신한 Hi-Point 카드]\n2.신한카드 레저 맴버가 되고 싶은 고객님을 위한 카드입니다.  [신한카드 The CLASSIC-L]\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
										"children": [
											{
												"name": "dialog_default137",
												"id": "default137",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											},
											{
												"name": "dialog_default151",
												"id": "default151",
												"filename": "default",
												"input": [
													{
														"text": "1"
													}
												],
												"output": {
													"output": "[신한 Hi-Point 카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/major/benefit/large/1198313_12904.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default172",
														"id": "default172",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default152",
												"id": "default152",
												"filename": "default",
												"input": [
													{
														"text": "2"
													}
												],
												"output": {
													"output": "[신한카드 The CLASSIC-L] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/premium/vip/1219771_12788.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default173",
														"id": "default173",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default153",
												"id": "default153",
												"filename": "default",
												"input": [
													{
														"if": "true"
													}
												],
												"output": {
													"repeat": "1"
												}
											}
										]
									},
									{
										"name": "여행덕후형",
										"id": "default75",
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
										"output": "여행 즐기시는 고개님께서 좋아하실만한 신용카드가 4가지나 있네요. \n아래 4가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 모든 주유소 포인트 적립에 생활 맞춤 혜택까지 제공합니다. [신한카드 RPM+ Platinum#]\n2. 항공 마일리지에 포인트, 프리미엄 서비스까지 제공해드려요. [신한카드 Air Platinum#]\n3. 해외 여행의 든든한 파트너가 되는 카드입니다. [신한카드 The BEST-T]\n4. 소중한 사람들과 누리는 생활속 프리미엄카드 입니다.  [신한 THE BEST-F 카드]\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
										"children": [
											{
												"name": "dialog_default138",
												"id": "default138",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											},
											{
												"name": "dialog_default155",
												"id": "default155",
												"filename": "default",
												"input": [
													{
														"text": "1"
													}
												],
												"output": {
													"output": "[신한 RPM+ Platinum# 카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/premium/platinum/1293916_12791.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default174",
														"id": "default174",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default156",
												"id": "default156",
												"filename": "default",
												"input": [
													{
														"text": "2"
													}
												],
												"output": {
													"output": "[신한카드 Air Platinum#] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/premium/platinum/1259018_12791.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default175",
														"id": "default175",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default157",
												"id": "default157",
												"filename": "default",
												"input": [
													{
														"text": "3"
													}
												],
												"output": {
													"output": "[신한카드 The Best-T] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/premium/vip/1320225_12788.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default176",
														"id": "default176",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default158",
												"id": "default158",
												"filename": "default",
												"input": [
													{
														"text": "4"
													}
												],
												"output": {
													"output": "[신한 THE BEST-F 카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/premium/vip/1208724_12788.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default177",
														"id": "default177",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default159",
												"id": "default159",
												"filename": "default",
												"input": [
													{
														"if": "true"
													}
												],
												"output": {
													"repeat": "1"
												}
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
											}
										],
										"output": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 2가지가 있네요. \n아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 모든 주유소 포인트 적립에 생활 맞춤 혜택까지 제공합니다. [신한카드 RPM+ Platinum#]\n2. 항공 마일리지에 포인트, 프리미엄 서비스까지 제공해드려요. [신한카드 Air Platinum#]\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
										"children": [
											{
												"name": "dialog_default139",
												"id": "default139",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											},
											{
												"name": "dialog_default160",
												"id": "default160",
												"filename": "default",
												"input": [
													{
														"text": "1"
													}
												],
												"output": {
													"call": "dialog_default155"
												}
											},
											{
												"name": "dialog_default161",
												"id": "default161",
												"filename": "default",
												"input": [
													{
														"text": "2"
													}
												],
												"output": {
													"call": "dialog_default156"
												}
											},
											{
												"name": "dialog_default162",
												"id": "default162",
												"filename": "default",
												"input": [
													{
														"if": "true"
													}
												],
												"output": {
													"repeat": "1"
												}
											}
										]
									},
									{
										"name": "dialog_default128",
										"id": "default128",
										"filename": "default",
										"input": [
											{
												"text": "이전"
											}
										],
										"output": {
											"up": "1"
										}
									},
									{
										"name": "dialog_default77",
										"id": "default77",
										"filename": "default",
										"input": [
											{
												"if": "true"
											}
										],
										"output": {
											"repeat": "1"
										}
									}
								]
							},
							{
								"name": "dialog_default122",
								"id": "default122",
								"filename": "default",
								"input": [
									{
										"text": "이전"
									}
								],
								"output": {
									"up": "1"
								}
							},
							{
								"name": "dialog_default68",
								"id": "default68",
								"filename": "default",
								"input": [
									{
										"if": "true"
									}
								],
								"output": {
									"repeat": "1"
								}
							}
						]
					},
					{
						"name": "dialog_default116",
						"id": "default116",
						"filename": "default",
						"input": [
							{
								"text": "이전"
							}
						],
						"output": {
							"up": "1"
						}
					},
					{
						"name": "dialog_default62",
						"id": "default62",
						"filename": "default",
						"input": [
							{
								"if": "true"
							}
						],
						"output": {
							"repeat": "1"
						}
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
				"output": "신한카드에서 제공되는 혜택을 직접 이것저것 선택하여 구성할 수 도 있고, 미리 구성되어 있는 카드중에서 고르실 수도 있어요. \n다음단계로 넘어가기 위해서 아래 보기중에서 선택해주세요. \n1. 직접 혜택을 구성하고 싶다 (혜택선택형)\n2. 구성되어 있는 카드를 고르고 싶다(혜택기본형)\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
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
							"output": "고객님께 딱 맞는 카드를 추천해드려요.\n\n[신한카드 4Tune 체크]가 고객님께서 좋아하실거 같아요.\n어디서나 0.2% 적립됩니다. \n추가로 고객님께서 선택한 곳에서는 5배로 적립됩니다!\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
							"buttons": [
								{
									"text": "바로보기",
									"url": "https://www.shinhancard.com/conts/person/card_info/rookie/benefit/select/1267879_17067.jsp"
								}
							]
						},
						"children": [
							{
								"name": "dialog_default120",
								"id": "default120",
								"filename": "default",
								"input": [
									{
										"text": "이전"
									}
								],
								"output": {
									"up": "1"
								}
							}
						]
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
						"output": "신용카드를 추천해드리기 전에 간단하게 고객님께서 어떤 카드를 원하시는지 몇가지만 여쭤볼께요. \n2030세대 이신가요~?\n\n1. 2030세대에요!\n2. 2030세대가 아니에요. \n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
						"children": [
							{
								"name": "2030",
								"id": "default83",
								"filename": "default",
								"input": [
									{
										"text": "1"
									}
								],
								"output": "2030 맞춤 혜택 상품을 추천할까요~?\n\n1. 네 추천해주세요!\n2. 아니요, 좀더 찾아주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
								"children": [
									{
										"name": "추천(2030)",
										"id": "default86",
										"filename": "default",
										"input": [
											{
												"text": "1"
											},
											{
												"text": "네"
											}
										],
										"output": "2030세대에 어울리는 카드가 2가지가 있네요. \n아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 스무살, 첫 금융특권 [신한 S20 체크카드]\n2.스무살, 첫 금융특권 [신한 S20 Pink 체크카드]\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
										"children": [
											{
												"name": "dialog_default123",
												"id": "default123",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											},
											{
												"name": "dialog_default163",
												"id": "default163",
												"filename": "default",
												"input": [
													{
														"text": "1"
													}
												],
												"output": {
													"output": "[신한 S20 체크카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/rookie/benefit/life/1198821_13338.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default178",
														"id": "default178",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default164",
												"id": "default164",
												"filename": "default",
												"input": [
													{
														"text": "2"
													}
												],
												"output": {
													"output": "[신한 S20 Pink 카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/rookie/benefit/life/1198822_13338.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default179",
														"id": "default179",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default165",
												"id": "default165",
												"filename": "default",
												"input": [
													{
														"if": "true"
													}
												],
												"output": {
													"repeat": "1"
												}
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
										"output": "그렇다면, 고객님의 소비성향을 알려주세요. \n1. 주유, 쇼핑 등 생활혜택에 관심이 있으신 알뜰 실속파\n2. 해외에서도 혜택은 챙기는 센스실속파\n3. 주거래 계좌 연결하시면 기본+추가+특별 적립이 한번에! 슈퍼 실속파!\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
										"children": [
											{
												"name": "dialog_default93",
												"id": "default93",
												"filename": "default",
												"input": [
													{
														"text": "알뜰"
													},
													{
														"text": "1"
													}
												],
												"output": {
													"call": "알뜰 실속"
												}
											},
											{
												"name": "dialog_default94",
												"id": "default94",
												"filename": "default",
												"input": [
													{
														"text": "센스"
													},
													{
														"text": "2"
													}
												],
												"output": {
													"call": "센스 실속"
												}
											},
											{
												"name": "dialog_default95",
												"id": "default95",
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
													"call": "슈퍼 실속"
												}
											},
											{
												"name": "dialog_default124",
												"id": "default124",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											},
											{
												"name": "dialog_default96",
												"id": "default96",
												"filename": "default",
												"input": [
													{
														"if": "true"
													}
												],
												"output": {
													"repeat": "1"
												}
											}
										]
									},
									{
										"name": "dialog_default118",
										"id": "default118",
										"filename": "default",
										"input": [
											{
												"text": "이전"
											}
										],
										"output": {
											"up": "1"
										}
									},
									{
										"name": "dialog_default88",
										"id": "default88",
										"filename": "default",
										"input": [
											{
												"if": "true"
											}
										],
										"output": {
											"repeat": "1"
										}
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
									}
								],
								"output": "그렇다면, 고객님의 소비성향을 알려주세요. \n1. 주유, 쇼핑 등 생활혜택에 관심이 있으신 알뜰 실속파\n2. 해외에서도 혜택은 챙기는 센스실속파\n3. 주거래 계좌 연결하시면 기본+추가+특별 적립이 한번에! 슈퍼 실속파!\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
								"children": [
									{
										"name": "알뜰 실속",
										"id": "default89",
										"filename": "default",
										"input": [
											{
												"text": "알뜰"
											},
											{
												"text": "1"
											}
										],
										"output": "생활 혜택에 관심이 있으신 알뜰하신 고객님께서 좋아하실만한 신용카드가 3가지가 있네요. 아래 3가지 카드 중에서 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 쿠팡 이용금액 3% 무제한 적립에 스타벅스 이용금액 캐시백까지! [쿠팡 신한카드 체크]\n2. 카카오페이 신한 체크카드로 카카오페이에서 간편하게 결제하고 캐시백 혜택을 누려보세요!  [카카오페이 신한 체크카드]\n3.이제 오프라인에서도 네이버페이로 결제하고 네이버페이포인트도 적립하세요!  [네이버페이 신한카드 체크]\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
										"children": [
											{
												"name": "dialog_default125",
												"id": "default125",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											},
											{
												"name": "dialog_default166",
												"id": "default166",
												"filename": "default",
												"input": [
													{
														"text": "1"
													}
												],
												"output": {
													"output": "[쿠팡 신한카드 체크] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/rookie/benefit/buy/1335816_13344.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default180",
														"id": "default180",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default167",
												"id": "default167",
												"filename": "default",
												"input": [
													{
														"text": "2"
													}
												],
												"output": {
													"output": "[카카오페이 신한 체크카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/rookie/benefit/propose/1297119_13356.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default181",
														"id": "default181",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default168",
												"id": "default168",
												"filename": "default",
												"input": [
													{
														"if": "true"
													}
												],
												"output": {
													"repeat": "1"
												}
											}
										]
									},
									{
										"name": "센스 실속",
										"id": "default90",
										"filename": "default",
										"input": [
											{
												"text": "센스"
											},
											{
												"text": "2"
											}
										],
										"output": "해외에서도 누릴 수 있는 혜택에 관심이 있으신 센스있는 고객님께서 좋아하실만한 신용카드가 2가지가 있어요. 아래 2가지 카드 중에서 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 해외 여행도! 해외 직구도! [Smart Global 신한카드 체크]\n2. 여행에 혜택을 더하였습니다.  [신한카드 YOLO Triplus 체크]\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
										"children": [
											{
												"name": "dialog_default126",
												"id": "default126",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											},
											{
												"name": "dialog_default169",
												"id": "default169",
												"filename": "default",
												"input": [
													{
														"text": "1"
													}
												],
												"output": {
													"output": "[Smart Global 신한카드 체크] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/rookie/benefit/propose/1252727_13356.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default182",
														"id": "default182",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default170",
												"id": "default170",
												"filename": "default",
												"input": [
													{
														"text": "2"
													}
												],
												"output": {
													"output": "[신한카드 YOLO Triplus 체크] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://www.shinhancard.com/conts/person/card_info/rookie/benefit/enjoy/1317826_13347.jsp"
														}
													]
												},
												"children": [
													{
														"name": "dialog_default183",
														"id": "default183",
														"filename": "default",
														"input": [
															{
																"text": "이전"
															}
														],
														"output": {
															"up": "1"
														}
													}
												]
											},
											{
												"name": "dialog_default171",
												"id": "default171",
												"filename": "default",
												"input": [
													{
														"if": "true"
													}
												],
												"output": {
													"repeat": "1"
												}
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
										"output": {
											"output": "고객님께 딱 맞는 카드를 추천해드려요.\n\n[신한카드 주거래 체크]가 고객님께서 좋아하실거 같아요.\n\n나의 Main 금융파트너!\n신한 주거래 패키지로 혜택을 누리세요!\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n(* 처음으로 돌아가기 0 또는 '처음', 이전 메뉴 : '이전')",
											"buttons": [
												{
													"text": "바로보기",
													"url": "https://www.shinhancard.com/conts/person/card_info/rookie/benefit/wealth/1278822_13341.jsp"
												}
											]
										},
										"children": [
											{
												"name": "dialog_default127",
												"id": "default127",
												"filename": "default",
												"input": [
													{
														"text": "이전"
													}
												],
												"output": {
													"up": "1"
												}
											}
										]
									},
									{
										"name": "dialog_default119",
										"id": "default119",
										"filename": "default",
										"input": [
											{
												"text": "이전"
											}
										],
										"output": {
											"up": "1"
										}
									},
									{
										"name": "dialog_default92",
										"id": "default92",
										"filename": "default",
										"input": [
											{
												"if": "true"
											}
										],
										"output": {
											"repeat": "1"
										}
									}
								]
							},
							{
								"name": "dialog_default121",
								"id": "default121",
								"filename": "default",
								"input": [
									{
										"text": "이전"
									}
								],
								"output": {
									"up": "1"
								}
							},
							{
								"name": "dialog_default85",
								"id": "default85",
								"filename": "default",
								"input": [
									{
										"if": "true"
									}
								],
								"output": {
									"repeat": "1"
								}
							}
						]
					},
					{
						"name": "dialog_default117",
						"id": "default117",
						"filename": "default",
						"input": [
							{
								"text": "이전"
							}
						],
						"output": {
							"up": "1"
						}
					},
					{
						"name": "dialog_default82",
						"id": "default82",
						"filename": "default",
						"input": [
							{
								"if": "true"
							}
						],
						"output": {
							"repeat": "1"
						}
					}
				]
			},
			{
				"name": "dialog_default79",
				"id": "default79",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"repeat": "1"
				}
			}
		]
	},
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"text": "FAN"
			},
			{
				"text": "플랫폼"
			}
		],
		"output": {
			"call": "시작"
		},
		"name": "신한 FAN 플랫폼 소개"
	},
	{
		"name": "FAQ Type",
		"id": "default57",
		"filename": "default",
		"input": [
			{
				"types": [
					"fanfaqType"
				]
			}
		],
		"output": "아래 중에 궁금하신 내용이 있나요?\n#typeDoc#+index+. +title+\n#번호를 입력하면 상세 내용을 보여드립니다.\n다시 검색하시려면 검색어를 입력해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음')",
		"children": [
			{
				"name": "dialog_default97",
				"id": "default97",
				"filename": "default",
				"input": [
					{
						"types": [
							"listType"
						]
					}
				],
				"output": "[+listType.title+]\n+listType.content+\n더 필요하신 게 있으시면 말씀해주세요~\n\n(* 처음으로 돌아가기 : 0 또는 '처음')",
				"children": [
					{
						"name": "dialog_default115",
						"id": "default115",
						"filename": "default",
						"input": [
							{
								"text": "이전"
							}
						],
						"output": {
							"up": "1"
						}
					}
				]
			},
			{
				"name": "dialog_default142",
				"id": "default142",
				"filename": "default",
				"input": [
					{
						"if": "true"
					}
				],
				"output": {
					"callChild": "FAQ Type"
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
		"input": [
			{
				"text": "시작"
			}
		],
		"output": "내 손안의 생활 플랫폼\n생활의 판을 바꾸다!\n간편 결제를 기반으로 결제, 금융, 생활편의 서비스를 한번에 누리세요!\n\n · 편리한 모바일결제 신한FAN페이\n보유하고 있는 카드를 신한 FAN에 등록하여 간편하게 결제하세요!\n\n · 다양하고 편리한 생활서비스\n다양한 제휴사 할인, 적립 서비스와 게임, 운세 등 FUN 및 생활서비스를 신한 FAN에서 한판에 즐기세요!\n\n · 통합리워드 서비스 신한 FAN클럽\n신한금융그룹이 동행하면 더 많은 포인트와 혜택이 함께합니다.\n\n신한 FAN에 궁금한점을 OOO 챗봇이 해결해 드립니다. 메뉴 또는 궁금하신 키워드를 입력해주세요.\n\n1. 신한 FAN에 가입하고 싶어요\n2. 신한 FAN에는 어떤 혜택이 있나요\n3. 신한 FAN으로는 무엇을 할 수 있나요\n4. FAN에 대해 자주하는 질문들(FAQ)\n5. 내게 맞는 카드를 추천해주세요.",
		"inRaw": "0",
		"inNLP": "0",
		"top": {
			"name": "dialog_commondefault90",
			"id": "commondefault90",
			"filename": "defaultcommon",
			"input": [
				{
					"text": "0"
				},
				{
					"text": "처음"
				}
			],
			"output": {
				"call": "시작"
			},
			"parent": {
				"name": "FAN 혜택",
				"id": "default4",
				"filename": "default",
				"input": [
					{
						"text": "혜택"
					},
					{
						"text": "2"
					}
				],
				"output": "신한 FAN에는 고객님을 위한  다양한 혜택들이 있습니다. 어떤 혜택을 알아볼까요?\n1. FAN 전용 적립 및 할인\n2. 진행중인 대박 이벤트\n\n(* 처음으로 돌아가기 : 0 또는 '처음')",
				"children": [
					{
						"name": "dialog_default28",
						"id": "default28",
						"filename": "default",
						"input": [
							{
								"text": "1"
							}
						],
						"output": {
							"call": "FAN 전용 적립 및 할인"
						}
					},
					{
						"name": "dialog_default29",
						"id": "default29",
						"filename": "default",
						"input": [
							{
								"text": "2"
							}
						],
						"output": {
							"call": "이벤트"
						}
					}
				],
				"parent": null,
				"task": {
					"inRaw": "2",
					"inNLP": "2"
				},
				"inRaw": "2",
				"inNLP": "2"
			},
			"task": {
				"inRaw": "0",
				"inNLP": "0"
			},
			"inRaw": "0",
			"inNLP": "0"
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
	},
	{
		"name": "dialog_commondefault90",
		"id": "commondefault90",
		"filename": "defaultcommon",
		"input": [
			{
				"text": "0"
			},
			{
				"text": "처음"
			}
		],
		"output": {
			"call": "시작"
		}
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('Shinhancard');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
