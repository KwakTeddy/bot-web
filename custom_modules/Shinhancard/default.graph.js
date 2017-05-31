


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
		"output": "✔ 신한 FAN은 신한카드가 없어도 가입가능!  \n✔ 신한 FAN에 가입 하시면 다양한 경품이 가득! \n✔ 신규라면 100% 당첨 경품 제공!\n\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
		"inRaw": "1",
		"inNLP": "1",
		"task": {
			"name": "task1"
		}
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
		"output": "스마트컨슈머를 위한 다양한 혜택!\n신한 FAN만의 다양한 혜택을 누리세요!\n \n 1. 신한 FAN 혜택ZONE!\n 2. 나만의 맞춤 쿠폰 Sally\n \n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
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
			"output": "지금 FAN에서 진행되는 다양한 이벤트가 있어요.\n \n✔ 5월 FAN 신규가입 이벤트\n✔ 5월 FAN 포인트 바꿔쓰기 이벤트\n✔ 5월 FAN 가정의 달 이벤트\n\n신한 FAN에는 항상 다양한 이벤트가 준비되어 있어요!\n \n신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n 아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "대박이벤트 바로가기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?+A2:F14=FAN_MAIN_304"
				}
			]
		}
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
			"output": "지금바로 신한 FAN의 다양한 혜택을 확인하세요! \n \n✔ GS25 바나나맛우유 100원 쿠폰\n✔ 홈플러스 10% 할인혜택\n✔ 비스테까 티라미수 1만원 할인\n\n 더 많은 혜택을 신한 FAN에 가입하시면 누리실 수 있어요!\n\n 신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n 아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "FAN 혜택 바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_104"
				}
			]
		},
		"inRaw": "1",
		"inNLP": "1"
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
			"output": "빅데이터 기반의 고객 맞춤형 혜택쿠폰 Sally\n \n Sally는 빅데이터를 분석해 고객님께 필요한 쿠폰을 추천해드리는 서비스입니다.\n\n  신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n 아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "나만의 혜택 보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_305"
				}
			]
		}
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
		"output": "결제, 생활금융, 생활, 포인트 서비스를 한번에!  번호를 선택하세요!\n\n 1. FAN페이 결제\n 2. FAN페이 오프라인 가맹점 \n 3. 신한 FAN 생활금융 서비스\n 4. 신한 FAN클럽 (통합포인트)\n\n(* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9'  또는 '이전')",
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
			"output": "신한 FAN을 통해 편리한 결제를 할 수 있어요!\n \n 결제 방식은 나한테 맞는걸 선택하시면 되요. \n 고객님을 생각하는 FAN답게 다양한 인증방식을 제공합니다. \n \n✔ 비밀번호\n✔ 지문\n✔ 홍채 인증\n\n 신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n 아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9 또는 '이전')",
			"buttons": [
				{
					"text": "이용가이드 보기",
					"url": "\"https://newm.shinhancard.com/event/2015/fc_launch.jsp?url=https://m.shinhancard.com/conts/html/shinhanFAN/introFAN/MOBFM021R02.html&title=GUIDE \""
				}
			]
		}
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
			"output": "FAN에 는 다양한 오프라인 가맹점이 있어요!\n어떤 가맹점이 있는지 더 자세히 알아볼까요?\n \n 신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n 아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9 또는 '이전')",
			"buttons": [
				{
					"text": "가맹점 보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_038"
				}
			]
		}
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
		"output": "신한 FAN에서는 제휴사 서비스, FUN컨텐츠부터 생활금융서비스까지 유용한 기능이 한가득!\n번호를 선택해 주세요.\n\n 1. 제휴사서비스(혜택+)\n 2. 운세\n 3. 게임\n 4. 페이봇\n 5. 신한 트렌드연구소\n 6. 더치페이\n\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9 또는 '이전')",
		"children": [
			{
				"name": "dialog_default3722",
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
			"output": "신한금융그룹과 거래를 할수록 더많은 혜택을 드리는 통합리워드 서비스 신한 FAN클럽! \n 포인트 적립/이용부터 쇼핑/쿠폰/그룹사 혜택까지 한번에 이용하세요.\n \n 신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n 아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9 또는 '이전')",
			"buttons": [
				{
					"text": "바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_102"
				}
			]
		}
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
			"output": "지금바로 신한 FAN의 다양한 혜택을 확인하세요! \n \n✔ GS25 바나나맛우유 100원 쿠폰\n✔ 홈플러스 10% 할인혜택\n✔ 비스테까 티라미수 1만원 할인 \n\n더 많은 혜택을 신한 FAN에 가입하시면 누리실 수 있어요! \n\n신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n 아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "FAN 혜택 바로보기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?maintap=FAN_TAB_104"
				}
			]
		}
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
			"output": "오늘의 운세, 주간운세, 신토정비결, 타로카드 등 나의 운세를 확인해보세요. \n \n✔ 동양운세\n✔ 서양운세 \n \n신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "나의 운세 확인하기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_301"
				}
			]
		}
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
			"output": "게임만 해도 포인트가 적립되는 미니게임이 있어요!  \n매달 1등하면 10만포인트 지급!\n\n✔ 판귄의 남극탐험\n✔ 차곡차곡 판권쌓기\n✔ FAN팡\n \n 신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n 아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "게임하러가기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_302"
				}
			]
		}
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
			"output": "화재의 AI 인공지능 아세요?\n나만의 금융비서 페이봇이\n고객님의 소비내역을 분석해 드려요!\n\n신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n(* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "소비관리 바로가기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_084"
				}
			]
		}
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
			"output": "이것만 알면 나도 트렌드세터! 신한 트렌드연구소에서 다양한 정보를 제공해드립니다.\n \n✔ 트렌드클립 : 동영상\n✔ 트렌트뉴스 : 기사 \n✔ 인포그래픽스 : 유익한 통계정보\n \n신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n(* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "트렌드 확인하기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_314"
				}
			]
		}
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
			"output": "한명이 카드로 결제한 밥값을 여러명에게 청구하는 특별한 더이페이 서비스!\n나눌 친구는 카드대금으로 청구되고 요청친구는 그만큼 차감됩니다.\n\n신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n아직 가입 전이시면 '가입' 이라고 입력해주세요.\n(* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "더치페이 바로가기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_085"
				}
			]
		}
	},
	{
		"name": "금융/납부 서비스",
		"id": "default192",
		"filename": "default",
		"input": [
			{
				"text": "금융"
			},
			{
				"text": "금융 서비스"
			},
			{
				"text": "납부"
			},
			{
				"text": "납부 서비스"
			},
			{
				"text": "4"
			}
		],
		"output": "신한 FAN에는 편리하게 금융/납부서비스를 신청할 수 있어요!\n \n1. 단기카드대출(현금서비스)\n2. 장기카드대출(카드론)\n3. MF일반대출\n4. 납부서비스\n \n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
		"children": [
			{
				"name": "dialog_default194",
				"id": "default194",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "단기카드대출"
				}
			},
			{
				"name": "dialog_default196",
				"id": "default196",
				"filename": "default",
				"input": [
					{
						"text": "2"
					}
				],
				"output": {
					"call": "장기카드대출"
				}
			}
		]
	},
	{
		"name": "단기카드대출",
		"id": "default193",
		"filename": "default",
		"input": [
			{
				"text": "단기 카드 대출"
			},
			{
				"text": "현금 서비스"
			}
		],
		"output": {
			"output": "신한 FAN을 통해 단기카드대출(현금서비스)을 이용할 수 있습니다!\n\n신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n 아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "단기카드대출 바로가기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_201"
				}
			]
		}
	},
	{
		"name": "장기카드대출",
		"id": "default195",
		"filename": "default",
		"input": [
			{
				"text": "장기 카드 대출"
			},
			{
				"text": "카드 론"
			}
		],
		"output": {
			"output": "신한 FAN을 통해 장기카드대출(카드론)을 이용할 수 있습니다!\n\n✔ 스피드론\n✔ 프리미엄론\n\n신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n 아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "장기카드대출 바로가기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_202"
				}
			]
		}
	},
	{
		"name": "MF일반대출",
		"id": "default197",
		"filename": "default",
		"input": [
			{
				"text": "일반 대출"
			},
			{
				"text": "MF 일반 대출"
			},
			{
				"text": "즉시 대출"
			},
			{
				"text": "스피드 론"
			},
			{
				"text": "담보 대출"
			}
		],
		"output": {
			"output": "신한 FAN을 통해 MF일반대출을 이용할 수 있습니다!\n\n✔ 즉시대출\n✔ 직장인대출\n✔ 개인사업자대출\n✔ 아파트소유자대출\n✔ 국민연금납부자대출\n✔ 국민연금수령자대출\n✔ 자동차담보대출\n✔ 스피드론2\n\n신한 FAN에 가입하신 고객은 아래 링크를 클릭해주세요.\n 아직 가입 전이시면 '가입' 이라고 입력해주세요.\n (* 처음으로 돌아가기 0 또는 '처음', 이전단계 '9' 또는 '이전')",
			"buttons": [
				{
					"text": "MF일반대출 바로가기",
					"url": "https://newm.shinhancard.com/event/2015/fc_launch.jsp?screenid=FAN_MAIN_203"
				}
			]
		}
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
			}
		],
		"output": "FAN관련 궁금하신부분을 말씀하시면 가장 알맞은 답변을 안내해드리겠습니다. 궁금하신 질문을 '단어'로 입력해주세요!",
		"children": [
			{
				"name": "dialog_default189",
				"id": "default189",
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
					}
				],
				"output": {
					"call": "FAN에 대해 자주하는 질문들(FAQ)"
				}
			},
			{
				"name": "dialog_default190",
				"id": "default190",
				"filename": "default",
				"input": [
					{
						"text": "추천"
					}
				],
				"output": {
					"call": "신한 카드 추천"
				}
			},
			{
				"name": "dialog_default191",
				"id": "default191",
				"filename": "default",
				"input": [
					{
						"text": "FAN"
					}
				],
				"output": {
					"call": "신한 FAN 플랫폼 소개"
				}
			},
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
						"output": "[+listType.title+]\n+listType.content+\n더 필요하신 게 있으시면 말씀해주세요~\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')"
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
			}
		],
		"output": {
			"output": "안녕하세요. OOO봇입니다\n내게 맞는 신한카드를 추천해드립니다. \n나의 소비 패턴 및 결제스타일을 기반으로 OOO봇이 추천해드립니다.\n\n먼저 나의 결제 스타일부터 알아볼까요?\n\n1.신용카드\n2.체크카드",
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
					"output": "신한카드에서 제공되는 혜택을 직접 이것저것 선택하여 구성할 수 도 있고, 미리 구성되어 있는 카드중에서 고르실 수도 있어요. \n다음단계로 넘어가기 위해서 아래 보기중에서 선택해주세요. \n1. 직접 혜택을 구성하고 싶다 (혜택선택형)\n2. 구성되어 있는 카드를 고르고 싶다(혜택기본형)",
					"buttons": [
						{
							"text": "혜택선택형"
						},
						{
							"text": "혜택기본형"
						},
						{
							"text": "이전메뉴"
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
							"output": "고객님께서 구성하고 싶으신 혜택이 주로 할인인가요? 포인트 적립인가요?\n\n1. 할인(캐시백)\n2. 포인트 적립",
							"buttons": [
								{
									"text": "할인"
								},
								{
									"text": "포인트"
								},
								{
									"text": "이전메뉴"
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
											"url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350235_33659.html"
										}
									]
								}
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
											"url": "https://m.shinhancard.com/conts/html/card/apply/credit/1355079_33659.html"
										}
									]
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
						"output": {
							"output": "신용카드를 추천해드리기 전에 간단하게 고객님께서 어떤 카드를 원하시는지 몇가지만 여쭤볼께요. \n할인(캐시백)과 포인트 적립중 어떤 것을 선호하시나요?\n\n1. 할인(캐시백)\n2. 포인트 적립",
							"buttons": [
								{
									"text": "할인"
								},
								{
									"text": "포인트"
								},
								{
									"text": "이전메뉴"
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
										"text": "할인"
									},
									{
										"text": "캐시 백"
									},
									{
										"text": "1"
									}
								],
								"output": {
									"output": "고객님은 어떤 소비유형에 가까우신가요?\n\n1. 숫자에 민감하며, 재테크에 관심이 많다. \n2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n3. 기름값, 교통비가 할인을 원하는 실속파다.",
									"buttons": [
										{
											"text": "숫자민감형"
										},
										{
											"text": "소비추구형"
										},
										{
											"text": "OIL실속형"
										},
										{
											"text": "이전메뉴"
										}
									]
								},
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
													"url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350241_33659.html"
												}
											]
										}
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
										"output": {
											"output": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 4가지나 있네요. 아래 4가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요.  1. 언제나 FAN으로 혜택을 받을수 있어요. [신한카드 Always FAN]2. 온.오프라인을 뛰어넘은 할인을 제공해드려요. [신한카드 O2O]3. 실속형 여성 프리미엄 회원을 위한 카드입니다. [신한카드 The LADY CLASSIC]4. Premium 적립에 Trendy 할인을 맞추었습니다. [신한카드 The CLASSIC-Y]",
											"buttons": [
												{
													"text": "Always FAN"
												},
												{
													"text": "O2O"
												},
												{
													"text": "The LADY CLASSIC"
												},
												{
													"text": "The CLASSIC-Y"
												},
												{
													"text": "이전메뉴"
												}
											]
										},
										"children": [
											{
												"name": "dialog_default143",
												"id": "default143",
												"filename": "default",
												"input": [
													{
														"text": "1"
													},
													{
														"text": "Always FAN"
													}
												],
												"output": {
													"output": "[신한카드 Always FAN] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350234_33659.html"
														}
													]
												}
											},
											{
												"name": "dialog_default144",
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
													"output": "[신한카드 O2O] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350244_33659.html"
														}
													]
												}
											},
											{
												"name": "dialog_default145",
												"id": "default145",
												"filename": "default",
												"input": [
													{
														"text": "3"
													},
													{
														"text": "The LADY CLASSIC"
													}
												],
												"output": {
													"output": "[신한카드 The LADY CLASSIC] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/premium/1350224_33658.html"
														}
													]
												}
											},
											{
												"name": "dialog_default146",
												"id": "default146",
												"filename": "default",
												"input": [
													{
														"text": "4"
													},
													{
														"text": "The CLASSIC Y"
													}
												],
												"output": {
													"output": "[신한카드 The CLASSIC-Y] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/premium/1350226_33658.html"
														}
													]
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
													"url": "https://m.shinhancard.com/conts/html/card/apply/credit/1364067_33659.html"
												}
											]
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
								"output": {
									"output": "고객님은 어떤 소비유형에 가까우신가요?\n\n1. 숫자에 민감하며, 재테크에 관심이 많다. \n2. 맛과 멋, 여유를 즐기는 소비를 추구한다. \n3. 여행을 좋아한다. 항공마일리지에 집중!\n4. 기름값, 교통비가 할인을 원하는 실속파다.",
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
										},
										{
											"text": "이전메뉴"
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
											"output": "고객님께 딱 맞는 카드를 추천해드려요.\n\n[신한카드 주거래 신용 [스마트 OTP 겸용]]이 고객님께서 좋아하실 카드 입니다. \n\n나의 Main 금융파트너!\n신한 주거래 패키지로 혜택을 누리세요!\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
											"buttons": [
												{
													"text": "바로보기",
													"url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350237_33659.html"
												}
											]
										}
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
										"output": {
											"output": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 2가지가 있네요. \n아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 포인트를 백화점 상품권으로 돌려받을 수 있어요. 포인트 최고 5% 적립! [신한 Hi-Point 카드]\n2.신한카드 레저 맴버가 되고 싶은 고객님을 위한 카드입니다.  [신한카드 The CLASSIC-L]",
											"buttons": [
												{
													"text": "Hi-Point"
												},
												{
													"text": "The CLASSIC-L"
												},
												{
													"text": "이전메뉴"
												}
											]
										},
										"children": [
											{
												"name": "dialog_default151",
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
													"output": "[신한 Hi-Point 카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350243_33659.html"
														}
													]
												}
											},
											{
												"name": "dialog_default152",
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
													"output": "[신한카드 The CLASSIC-L] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/premium/1350227_33658.html"
														}
													]
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
										"output": {
											"output": "여행 즐기시는 고개님께서 좋아하실만한 신용카드가 4가지나 있네요. \n아래 4가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 모든 주유소 포인트 적립에 생활 맞춤 혜택까지 제공합니다. [신한카드 RPM+ Platinum#]\n2. 항공 마일리지에 포인트, 프리미엄 서비스까지 제공해드려요. [신한카드 Air Platinum#]\n3. 해외 여행의 든든한 파트너가 되는 카드입니다. [신한카드 The BEST-T]\n4. 소중한 사람들과 누리는 생활속 프리미엄카드 입니다.  [신한 THE BEST-F 카드]",
											"buttons": [
												{
													"text": "RPM+ Platinum#"
												},
												{
													"text": "Air Platinum#"
												},
												{
													"text": "The Best-T"
												},
												{
													"text": "The Best-F"
												},
												{
													"text": "이전메뉴"
												}
											]
										},
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
													},
													{
														"text": "RPM Platinum"
													}
												],
												"output": {
													"output": "[신한 RPM+ Platinum# 카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350231_33659.html"
														}
													]
												}
											},
											{
												"name": "dialog_default156",
												"id": "default156",
												"filename": "default",
												"input": [
													{
														"text": "2"
													},
													{
														"text": "Air Platinum"
													}
												],
												"output": {
													"output": "[신한카드 Air Platinum#] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/credit/1350232_33659.html"
														}
													]
												}
											},
											{
												"name": "dialog_default157",
												"id": "default157",
												"filename": "default",
												"input": [
													{
														"text": "3"
													},
													{
														"text": "The Best T"
													}
												],
												"output": {
													"output": "[신한카드 The Best-T] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/premium/1350223_33658.html"
														}
													]
												}
											},
											{
												"name": "dialog_default158",
												"id": "default158",
												"filename": "default",
												"input": [
													{
														"text": "4"
													},
													{
														"text": "The Best F"
													}
												],
												"output": {
													"output": "[신한 THE BEST-F 카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/premium/1350228_33658.html"
														}
													]
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
											},
											{
												"text": "OIL 실속 형"
											}
										],
										"output": {
											"output": "맛과 멋을 즐기시는 고개님께서 좋아하실만한 신용카드가 2가지가 있네요. \n아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 모든 주유소 포인트 적립에 생활 맞춤 혜택까지 제공합니다. [신한카드 RPM+ Platinum#]\n2. 항공 마일리지에 포인트, 프리미엄 서비스까지 제공해드려요. [신한카드 Air Platinum#]",
											"buttons": [
												{
													"text": "RPM+ Platinum#"
												},
												{
													"text": "Air Platinum#"
												},
												{
													"text": "이전메뉴"
												}
											]
										},
										"children": [
											{
												"name": "dialog_default160",
												"id": "default160",
												"filename": "default",
												"input": [
													{
														"text": "1"
													},
													{
														"text": "RPM Platinum"
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
													},
													{
														"text": "Air Platinum"
													}
												],
												"output": {
													"call": "dialog_default156"
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
					"output": "신한카드에서 제공되는 혜택을 직접 이것저것 선택하여 구성할 수 도 있고, 미리 구성되어 있는 카드중에서 고르실 수도 있어요. \n다음단계로 넘어가기 위해서 아래 보기중에서 선택해주세요. \n1. 직접 혜택을 구성하고 싶다 (혜택선택형)\n2. 구성되어 있는 카드를 고르고 싶다(혜택기본형)",
					"buttons": [
						{
							"text": "혜택선택형"
						},
						{
							"text": "혜택기본형"
						},
						{
							"text": "이전메뉴"
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
							"output": "고객님께 딱 맞는 카드를 추천해드려요.\n\n[신한카드 4Tune 체크]가 고객님께서 좋아하실거 같아요.\n어디서나 0.2% 적립됩니다. \n추가로 고객님께서 선택한 곳에서는 5배로 적립됩니다!\n\n자세한 내용을 보시려면 아래의 링크를 클릭해주세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
							"buttons": [
								{
									"text": "바로보기",
									"url": "https://m.shinhancard.com/conts/html/card/apply/check/1350273_33660.html"
								}
							]
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
							"output": "신용카드를 추천해드리기 전에 간단하게 고객님께서 어떤 카드를 원하시는지 몇가지만 여쭤볼께요. \n2030세대 이신가요~?\n\n1. 2030세대가 맞아요.\n2. 2030세대가 아니에요.",
							"buttons": [
								{
									"text": "2030세대가 맞아요"
								},
								{
									"text": "2030세대가 아니에요"
								},
								{
									"text": "이전메뉴"
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
									"output": "2030 맞춤 혜택 상품을 추천할까요~?\n\n1. 네 추천해주세요!\n2. 아니요, 좀더 찾아주세요.",
									"buttons": [
										{
											"text": "네 추천해주세요"
										},
										{
											"text": "아니요 좀 더 찾아주세요"
										},
										{
											"text": "이전메뉴"
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
												"text": "1"
											},
											{
												"text": "네"
											}
										],
										"output": {
											"output": "2030세대에 어울리는 카드가 2가지가 있네요. \n아래 2가지 카드 중에서 관심 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 스무살, 첫 금융특권 [신한 S20 체크카드]\n2.스무살, 첫 금융특권 [신한 S20 Pink 체크카드]",
											"buttons": [
												{
													"text": "S20"
												},
												{
													"text": "S20 Pink"
												},
												{
													"text": "이전메뉴"
												}
											]
										},
										"children": [
											{
												"name": "dialog_default164",
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
													"output": "[신한 S20 Pink 카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/check/1350263_33660.html"
														}
													]
												}
											},
											{
												"name": "dialog_default163",
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
													"output": "[신한 S20 체크카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/check/1350266_33660.html"
														}
													]
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
										"output": {
											"output": "그렇다면, 고객님의 소비성향을 알려주세요. \n1. 주유, 쇼핑 등 생활혜택에 관심이 있으신 알뜰 실속파\n2. 해외에서도 혜택은 챙기는 센스실속파\n3. 주거래 계좌 연결하시면 기본+추가+특별 적립이 한번에! 슈퍼 실속파!",
											"buttons": [
												{
													"text": "알뜰실속파"
												},
												{
													"text": "센스실속파"
												},
												{
													"text": "슈퍼실속파"
												},
												{
													"text": "이전메뉴"
												}
											]
										},
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
											}
										]
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
									"output": "그렇다면, 고객님의 소비성향을 알려주세요. \n1. 주유, 쇼핑 등 생활혜택에 관심이 있으신 알뜰 실속파\n2. 해외에서도 혜택은 챙기는 센스실속파\n3. 주거래 계좌 연결하시면 기본+추가+특별 적립이 한번에! 슈퍼 실속파!",
									"buttons": [
										{
											"text": "알뜰실속파"
										},
										{
											"text": "센스실속파"
										},
										{
											"text": "슈퍼실속파"
										},
										{
											"text": "이전메뉴"
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
												"text": "알뜰"
											},
											{
												"text": "1"
											}
										],
										"output": {
											"output": "생활 혜택에 관심이 있으신 알뜰하신 고객님께서 좋아하실만한 신용카드가 3가지가 있네요. 아래 3가지 카드 중에서 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 쿠팡 이용금액 3% 무제한 적립에 스타벅스 이용금액 캐시백까지! [쿠팡 신한카드 체크]\n2. 카카오페이 신한 체크카드로 카카오페이에서 간편하게 결제하고 캐시백 혜택을 누려보세요!  [카카오페이 신한 체크카드]\n3.이제 오프라인에서도 네이버페이로 결제하고 네이버페이포인트도 적립하세요!  [네이버페이 신한카드 체크]",
											"buttons": [
												{
													"text": "쿠팡"
												},
												{
													"text": "카카오페이"
												},
												{
													"text": "네이버페이"
												},
												{
													"text": "이전메뉴"
												}
											]
										},
										"children": [
											{
												"name": "dialog_default166",
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
													"output": "[쿠팡 신한카드 체크] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/check/1350250_33660.html"
														}
													]
												}
											},
											{
												"name": "dialog_default167",
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
													"output": "[카카오페이 신한 체크카드] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/check/1350256_33660.html"
														}
													]
												}
											},
											{
												"name": "dialog_default184",
												"id": "default184",
												"filename": "default",
												"input": [
													{
														"text": "3"
													},
													{
														"text": "네이버 페이"
													}
												],
												"output": {
													"output": "[네이버페이 신한 체크카드] 카드를 추천해드릴게요.아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/check/1350254_33660.html"
														}
													]
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
										"output": {
											"output": "해외에서도 누릴 수 있는 혜택에 관심이 있으신 센스있는 고객님께서 좋아하실만한 신용카드가 2가지가 있어요. 아래 2가지 카드 중에서 자세히 보고 싶으신 카드를 선택해주세요.  \n\n1. 해외 여행도! 해외 직구도! [Smart Global 신한카드 체크]\n2. 여행에 혜택을 더하였습니다.  [신한카드 YOLO Triplus 체크]",
											"buttons": [
												{
													"text": "Smart Global"
												},
												{
													"text": "YOLO Triplus"
												},
												{
													"text": "이전메뉴"
												}
											]
										},
										"children": [
											{
												"name": "dialog_default169",
												"id": "default169",
												"filename": "default",
												"input": [
													{
														"text": "1"
													},
													{
														"text": "Smart Global"
													}
												],
												"output": {
													"output": "[Smart Global 신한카드 체크] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/check/1350269_33660.html"
														}
													]
												}
											},
											{
												"name": "dialog_default170",
												"id": "default170",
												"filename": "default",
												"input": [
													{
														"text": "2"
													},
													{
														"text": "YOLO Triplus"
													}
												],
												"output": {
													"output": "[신한카드 YOLO Triplus 체크] 카드를 추천해드릴게요.\n아래 바로보기 링크를 클릭해 상세 정보를 살펴보세요.\n\n(* 처음으로 돌아가기 : 0 또는 '처음', 이전 메뉴 : '이전')",
													"buttons": [
														{
															"text": "바로보기",
															"url": "https://m.shinhancard.com/conts/html/card/apply/check/1350267_33660.html"
														}
													]
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
													"url": "https://m.shinhancard.com/conts/html/card/apply/check/1350268_33660.html"
												}
											]
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
		"output": "안녕하세요ㅇㅇ봇 입니다. 메뉴 또는 궁금하신 키워드를 입력해주세요.\n \n 1. 신한 FAN에 가입하고 싶어요\n 2. 신한 FAN에는 어떤 혜택이 있나요\n 3. 신한 FAN으로는 무엇을 할 수 있나요\n 4. 편리한 금융/납부 서비스\n \n (* 처음으로 돌아가기 0 또는 '처음')",
		"name": "신한 FAN 플랫폼 소개",
		"inRaw": "FAN",
		"inNLP": "FAN",
		"children": [
			{
				"name": "dialog_default186",
				"id": "default186",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
				}
			},
			{
				"name": "dialog_default187",
				"id": "default187",
				"filename": "default",
				"input": [
					{
						"text": "2"
					}
				],
				"output": {
					"call": "FAN 혜택"
				}
			},
			{
				"name": "dialog_default188",
				"id": "default188",
				"filename": "default",
				"input": [
					{
						"text": "3"
					}
				],
				"output": {
					"call": "이용안내"
				}
			}
		]
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
				"output": "[+listType.title+]\n+listType.content+\n더 필요하신 게 있으시면 말씀해주세요~\n\n(* 처음으로 돌아가기 : 0 또는 '처음')"
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
			"output": "내 손안의 생활 플랫폼\n생활의 판을 바꾸다!\n간편 결제를 기반으로 결제, 금융, 생활편의 서비스를 한번에 누리세요!\n\n · 편리한 모바일결제 신한FAN페이보유하고 있는 카드를 신한 FAN에 등록하여 간편하게 결제하세요!\n\n · 다양하고 편리한 생활서비스다양한 제휴사 할인, 적립 서비스와 게임, 운세 등 FUN 및 생활서비스를 신한 FAN에서 한판에 즐기세요!\n\n · 통합리워드 서비스 신한 FAN클럽\n신한금융그룹이 동행하면 더 많은 포인트와 혜택이 함께합니다.\n\n신한 FAN에 궁금한점을 OOO 챗봇이 해결해 드립니다. 메뉴 또는 궁금하신 키워드를 입력해주세요.",
			"buttons": [
				{
					"text": "FAN"
				},
				{
					"text": "내게 맞는 카드 추천"
				},
				{
					"text": "자주 묻는 질문(FAQ)"
				}
			],
			"text": "내 손안의 생활 플랫폼\n생활의 판을 바꾸다!\n간편 결제를 기반으로 결제, 금융, 생활편의 서비스를 한번에 누리세요!\n\n · 편리한 모바일결제 신한FAN페이보유하고 있는 카드를 신한 FAN에 등록하여 간편하게 결제하세요!\n\n · 다양하고 편리한 생활서비스다양한 제휴사 할인, 적립 서비스와 게임, 운세 등 FUN 및 생활서비스를 신한 FAN에서 한판에 즐기세요!\n\n · 통합리워드 서비스 신한 FAN클럽\n신한금융그룹이 동행하면 더 많은 포인트와 혜택이 함께합니다.\n\n신한 FAN에 궁금한점을 OOO 챗봇이 해결해 드립니다. 메뉴 또는 궁금하신 키워드를 입력해주세요."
		},
		"inRaw": "0",
		"inNLP": "0"
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
	},
	{
		"name": "dialog_commondefault192",
		"id": "commondefault192",
		"filename": "defaultcommon",
		"input": [
			{
				"regexp": "/^FAN$/"
			}
		],
		"output": {
			"call": "신한 FAN 플랫폼 소개"
		}
	},
	{
		"name": "dialog_commondefault197",
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
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('Shinhancard');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
