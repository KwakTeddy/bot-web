


var dialogs = [
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
			}
		],
		"output": "신한FAN은 신한카드가 없어도 가입가능! 최초 신규고객이면 포인트 지급!FAN이 설치되어 있나요? 1. 앱은 설치는 되어있는데 가입은 하지않았습니다. 2. 앱을 아직 설치하지 않았습니다.",
		"children": [
			{
				"name": "dialog_default26",
				"id": "default26",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "설치"
				}
			},
			{
				"name": "dialog_default27",
				"id": "default27",
				"filename": "default",
				"input": [
					{
						"text": "2"
					}
				],
				"output": {
					"call": "미설치"
				}
			}
		]
	},
	{
		"name": "설치",
		"id": "default2",
		"filename": "default",
		"input": [
			{
				"text": "설치"
			},
			{
				"text": "회원"
			}
		],
		"output": "카드회원 또는 일반회원으로 가입해 주세요"
	},
	{
		"name": "미설치",
		"id": "default3",
		"filename": "default",
		"input": [
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
			}
		],
		"output": "신한 FAN 다운 및 설치 후, 카드회원 또는 일반회원으로 가입해 주세요"
	},
	{
		"name": "FAN 혜택",
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"text": "혜택"
			}
		],
		"output": "FAN에는 고객님을 위한  다양한 혜택들이 있습니다. 어떤 혜택을 알아볼까요? 1. FAN 전용 적립 및 할인 2. 진행중인 대박 이벤트",
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
		"output": "스마트컨슈머를 위한 다양한 혜택! FAN만의 다양한 혜택을 누리세요! 1. FAN 전용 상시 혜택 2. FAN X 제휴사 혜택ZONE! 3. 나만의 맞춤 쿠폰 Sally",
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
					"call": "상시 혜택 상세"
				}
			},
			{
				"name": "dialog_default31",
				"id": "default31",
				"filename": "default",
				"input": [
					{
						"text": "2"
					}
				],
				"output": {
					"call": "제휴사 혜택 상세"
				}
			},
			{
				"name": "dialog_default32",
				"id": "default32",
				"filename": "default",
				"input": [
					{
						"text": "3"
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
		"output": "놓치면 후회할 수밖에 없는 다양한 이벤트를 한눈에!  신한 FAN가입을 원하실경우 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default46",
				"id": "default46",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
				}
			}
		]
	},
	{
		"name": "상시 혜택 상세",
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
		"output": "FAN 고객만을 위한 1년 365일 혜택입니다. 상시 혜택 외에도 FAN의 다양한 혜택을 확인하세요!   1. X-GOLF 무료부킹/피팅분석권 2. 저렴하고 간편한 동부화재 여행자보험 3. 티머니 충전서비스 수수료 무료 혜택 4. 리화이트 신규가입시 5천원 할인  위 혜택들은 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default43",
				"id": "default43",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
				}
			}
		]
	},
	{
		"name": "제휴사 혜택 상세",
		"id": "default8",
		"filename": "default",
		"input": [
			{
				"text": "제휴"
			}
		],
		"output": "FAN 고객만을 위한 제휴사들의 다양한 할인/포인트적립/쿠폰 혜택!  위 혜택들은 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default44",
				"id": "default44",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
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
		"output": "빅데이터 기반의 고객 맞춤형  혜택쿠폰 Sally  위 혜택들은 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default45",
				"id": "default45",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
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
			}
		],
		"output": "간편결제를 기반으로 결제,금융/생활, 포인트 서비스를 한번에! 무엇을 알아볼까요? 1. 편리한 FAN페이 결제 이용가이드 2. FAN페이 가맹점 안내 3. 다양한 제휴/FUN/생활/금융 서비스 4. 통합리워드(포인트) 신한 FAN클럽",
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
		"output": "FAN을 통해 편리하게 온/오프라인 결제를 이용해 보세요! 비밀번호/지문/홍채 인증으로 한번에 결제! FAN페이 이용가이드 보기  위 서비스는 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default47",
				"id": "default47",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
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
		"output": "카드없이 FAN 오프라인 가맹점에서 FAN페이를 이용하세요! 오프라인 가맹점 보기  위 서비스는 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default48",
				"id": "default48",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
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
		"output": "FAN에서는 xx개의 제휴사 서비스스와 운세, 게임, 웹툰과  같은  FUN컨텐츠 부터  더치페이, 투자정보, 소비관리 와 같은 금융서비스까지  한번에 누릴 수 있습니다. 신한 FAN에 놀러오세요! 1. 제휴사서비스(혜택+) 2. 운세 3. 게임 4. 페이봇 5. 트렌드연구소 6. 더치페이",
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
		"output": "신한에선 포인트도 자산이다! 신한금융그룹과 거래를 할수록 더많은 혜택을 드리는 통합리워드 서비스 신한 FAN클럽! 포인트 적립/이용부터 쇼핑/쿠폰/그룹사 혜택까지 한번에 이용하세요  위 혜택들은 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default49",
				"id": "default49",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
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
		"output": "쇼핑/식품, 여가/보험, 요식/생활, 뷰티/패션, 교통/차량의 대표 제휴사들을 한번에 이용할 수 있는 혜택+! 혜택+를 통해 다양한 제휴서비스와 할인/적립/쿠폰 등 혜택을 동시에 누리세요!  위 서비스는 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default50",
				"id": "default50",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
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
		"output": "오늘의 운세, 주간운세 신토정비결, 타로카드 등 나의 운세를 한눈에!  위 서비스는 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default51",
				"id": "default51",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
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
		"output": "지루할 틈이 없는 FAN 미니게임 3종 세트  위 서비스는 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default52",
				"id": "default52",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
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
		"output": "합리적인 소비를 도와줄 나만의 금융비서 페이봇!  위 서비스는 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default53",
				"id": "default53",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
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
		"output": "이것만 알면 나도 트렌드세터! 트렌드연구소의  트렌드뉴스, 인포그래픽스,  트렌드클립!  위 서비스는 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default54",
				"id": "default54",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
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
		"output": "현금없이도 가능한 카드 '더치페이' 설명 : 대표로 카드 결제한 고객이 FAN을 통해 대상자에게 분담금액을 요청하고 분담금액의 신용카드 결제를 통해 대표로 카드 결제한 고객의 결제대금을 차감받는 서비스  위 서비스는 신한 FAN에 가입된 회원만 이용할 수 있습니다. 신한 FAN 회원가입을 원하시면 '1'을 입력하세요. (가입-DEPTH2로 이동)",
		"children": [
			{
				"name": "dialog_default55",
				"id": "default55",
				"filename": "default",
				"input": [
					{
						"text": "1"
					}
				],
				"output": {
					"call": "FAN 가입"
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
			}
		],
		"output": "FAN관련 궁금하신부분을 말씀하시면 가장 알맞은 답변을 안내해드리겠습니다. 궁금하신 질문을 '단어'로 입력해주세요!"
	},
	{
		"name": "dialog_default22",
		"id": "default22",
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
		"name": "dialog_default23",
		"id": "default23",
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
		"name": "dialog_default24",
		"id": "default24",
		"filename": "default",
		"input": [
			{
				"text": "3"
			}
		],
		"output": {
			"call": "이용안내"
		}
	},
	{
		"name": "dialog_default25",
		"id": "default25",
		"filename": "default",
		"input": [
			{
				"text": "4"
			}
		],
		"output": {
			"call": "FAN에 대해 자주하는 질문들(FAQ)"
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
			}
		],
		"output": "내 손안의 생활 플랫폼 생활의 판을 바꾸다! 간편 결제를 기반으로 결제, 금융, 생활편의 서비스를 한번에 누리세요!  • 카드의 경계를 넘다! - 편리한 모바일결제 신한FAN페이 - 보유하고 있는 카드를 신한 FAN에 등록하여 간편하게 결제하세요!  • 신한 FAN 혜택을 더하다! - 다양하고 편리한 생활서비스 - 다양한 제휴사 할인, 적립 서비스와 게임, 운세 등 FUN 및 생활서비스를  - 신한 FAN에서 한판에 즐기세요!  • 신한에선 포인트도 자산이다!  - 통합리워드 서비스 신한 FAN클럽 - 신한금융그룹이 동행하면 더 많은 포인트와 혜택이 함께합니다.  FAN에 궁금한점을 OOO 챗봇이 해결해 드립니다. 메뉴 또는 궁금하신 키워드를 입력해주세요.  1. FAN에 가입하고 싶어요 2. FAN에는 어떤 혜택이 있나요 3. FAN으로는 무엇을 할 수 있나요 4. FAN에 대해 자주하는 질문들(FAQ)"
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('Shinhancard');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
