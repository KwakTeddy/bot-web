module.exports = function(code)
{
    var lan = {
        ko: {
            "L001":"플레이챗 - 챗봇 개발, 대화형 인공지능 플랫폼, 머니브레인",
            "L002":"로그인",
            "L003":"비밀번호를 잊으셨나요?",
            "L004":"",
            "L005":"",
            "L006":"",
            "L007":"",
            "L008":"",
            "L009":"",
            "L010":"",
            "ko":"한국어",
            "L011":"한국어",
            "L012":"영어",
            "L013":"중국어",
            "L014":"일본어",
            "L015":"무료로 시작하기",
            "L016":"대화형 인공지능 플랫폼 Playchat",
            "L017":"이제 직접 개발하지 않고 간단한 정보의 입력만으로 나만의 대화형 인공지능을 만들어 바로 사용 할 수 있습니다.",
            "L018":"플러스친구, 페이스북에도 바로 연결 할 수 있습니다.",
            "L019":"Playchat은 자연스러운 대화형 인공지능을 지향하며 여러가지 기능을 제공합니다.",
            "L020":"업종별 맞춤형 템플릿",
            "L021":"템플릿에 나의 서비스를 제공할 챗봇을 만들어보세요.",
            "L022":"요식업, 쇼핑, 의료등 다양한 템플릿이 있습니다.",
            "L023":"1:1 대화 학습",
            "L024":"챗봇에 간단하게 질문과 답변을 학습시키면 챗봇이 대답해줍니다.",
            "L025":"엑셀 파일에 정리하여 한번에 학습시킬수 있습니다.",
            "L026":"시나리오 대화 관리",
            "L027":"사람이 대화하는 것처럼 단계적인 대화를 구성할 수도 있고 시나리오 기반의 대화를 구성하면 더 많은 컨텐츠를 만들 수 있어요.",
            "L028":"다양한 플랫폼 지원",
            "L029":"카카오톡, 페이스북, 네이버톡톡 여러 플랫폼을 통해서 내가 만든 챗봇을 연동할 수 있고 Playchat에서 통합관리 할 수 있어요.",
            "L030":"편리한 서비스를 통한 고객 유입",
            "L031":"챗봇으로 단순하고 빠른 업무처리를 해보세요.",
            "L032":"채팅처럼 쉽게 고객들에게 접근하면, 편리한 서비스제공과 빠른 서비스로 대만족하실 거에요.",
            "L033":"비용감소 및 매출증대",
            "L034":"자동 고객응대 시스템으로 직원의 단순한 고객응대 업무시간을 줄일 수 있어요. 또한, 챗봇이 새로운 고객을 끌어오는 수단이 되어 매출증가의 기회를 주기도 하지요!",
            "L035":"템플릿으로 쉽게 만드는 인공지능 챗봇 으로 고객을 사로잡는 주인공이 되세요!",
            "L036":"배달봇",
            "L037":"메뉴 자동주문",
            "L038":"배달음식 메뉴주문 및 접수",
            "L039":"메뉴 안내",
            "L040":"메뉴주문 및 접수",
            "L041":"주문내역 확인",
            "L042":"주문접수 안내",
            "Create delivery bot":"배달봇 만들기",
            "L043":"쇼핑봇",
            "L044":"상품검색 및 추천",
            "L045":"상품추천과 배송서비스",
            "L046":"상품추천 및 검색 서비스",
            "L047":"배송상태 조회",
            "L048":"상품 품절안내",
            "L049":"재입고 일정안내",
            "Create shopping bot":"쇼핑봇 만들기",
            "L050":"호텔봇",
            "L051":"객실 자동예약",
            "L052":"24시간 응대접수",
            "L053":"호텔 이용안내",
            "L054":"객실 조회",
            "L055":"객실 예약",
            "L056":"외국어 안내",
            "Create Hotel bot":"호텔봇 만들기",
            "L057":"병원봇",
            "L058":"진료예약 및 상담",
            "L059":"병원안내 최대 데이터를 보유",
            "L060":"시술 안내",
            "L061":"병원 정보",
            "L062":"진료 예약",
            "L063":"후기 정보 조회",
            "Create hospital bot":"병원봇 만들기",
            "L064":"자사의 대화형 인공지능을 사용하고 있는 구축사례",
            "L065":"NH농협은행 금융업무 상담 챗봇",
            "L066":"플랫폼 - 카카오톡",
            "L067":"출시일 : 2016.10.28",
            "L068":"주요 기능 : 상품안내, 자주 묻는",
            "L069":"질문, 이벤트 안내, 이용시간 안내",
            "L070":"고객상담 및 정보공유 챗봇",
            "L071":"플랫폼 - 카카오톡, 페이스북, 네이버톡톡",
            "L072":"출시일 : 2017.6.28",
            "L073":"주요 기능 : 신한 FAN 안내, 카드추천",
            "L074":"자주 묻는 질문, 이벤트",
            "L075":"플랫폼 - 카카오톡, 페이스북",
            "L076":"출시일 : 2016.11.18",
            "L077":"배달음식 주문(음식점 검색, ",
            "L078":"메뉴검색, 주문 관리 등)",
            "L079":"세계 최고의 대화형 인공지능 기술을 무료로 이용하세요.",
            "L080":"Copyright 2017 by MoneyBrain Inc.",
            "L081":"",
            "L082":"",
            "L083":"",
            "L084":"",
            "Terms":"",
            "Conditions":"",
            "Licenses":"",
            "L085":"Company",
            "L086":"",
            "L087":"",
            "L088":"",
            "L089":"",
            "L090":"",
            "L091":"찾을 수 없습니다.",
            "L092" : "자사의 개발 프로그램인 플레이챗을 사용하고 있는 회사입니다.",
            "L093" : "챗봇 개발하기",
            "L094" : '지금 시작하세요',
            "L095" : '등록',
            "L096" : "회원가입",
            "L097" : "10분 만에 누구나 쉽고 빠르게 만드는 챗봇",
            "L098" : "세계 최고의 대화형 인공지능 플랫폼",
            "lan" : "ko",
            "sigunup" : "가입이 완료되었습니다. 입력하신 이메일로 인증 메일을 보냈습니다. 확인후 로그인해주세요.",
            "start" : '시작하기'

        },
        en: {
            "L001":"Playchat - Develop a Chatbot, Conversational AI platform, Moneybrain",
            "L002":"Sign in",
            "L003":"Forget your password?",
            "L004":"Click here",
            "L005":"Don't have an account yet?",
            "L006":"Click here to sign up.",
            "L007":"Home",
            "L008":"Feature",
            "L009":"Template",
            "L010":"Partners",
            "ko":"ko",
            "L011":"Korean",
            "L012":"English",
            "L013":"Chinese",
            "L014":"Japanese",
            "L015":"start for free",
            "L016":"Conversational Artificial Intelligence platform Playchat",
            "L017":"Now, you may make your own conversational artificial intelligence by only entering in the basic information other than develop your own.",
            "L018":"Able to connect to Facebook and Plus Friends right away.",
            "L019":"Playchat is aiming to be a natural conversational artificial intelligence with diverse functions",
            "L020":"Customized Templates due to different types of jobs",
            "L021":"Make the chatbot which can supply my service on the template.",
            "L022":"There are various templates such as restaurants, shopping and medicals.",
            "L023":"1:1 Conversation Learning",
            "L024":"Chatbot will reply if you let it learn short questions and answers.",
            "L025":"You may make it learn at once if you organize the Q&A on excel file.",
            "L026":"Manage Conversational Scenario",
            "L027":"You may form the conversations with phases as if the real conversation between human or if you could make the scenario based conversations you are able to make even more contents.",
            "L028":"Supply various platforms",
            "L029":"Through the various platforms such as KakaoTalk, Facebook, Naver talktalk, you may able to conncet your own chatbot and able to manage integratedly at Playchat",
            "L030":"Customer inflow through the comfortable service",
            "L031":"handle your business fast and easy through chatbot",
            "L032":"If you could approach to the customers by using easy systems such as chatting, it will be greatly satisfied by its fast and comfortable service support.",
            "L033":"Decrease the cost and increase the sales",
            "L034":"Through the automatic response system for customers, it will decrease the working hours spent for basic customer response. Moreover, the chatbot will support the chance of attracting customers which leads into sales increase.",
            "L035":"Become a heroin who captivates customers by using Artificial Intelligence Chatbot with easy templates!",
            "L036":"Delivery bot",
            "L037":"automatic menu order",
            "L038":"Delivery food menu requests and confirm",
            "L039":"menu guide",
            "L040":"Order menus and confirm",
            "L041":"Ordering list confirm",
            "L042":"Ordering request Guide",
            "Create delivery bot":"Create delivery bot",
            "L043":"Shopping bot",
            "L044":"search items and recommend",
            "L045":"item recoomendation and delivery service",
            "L046":"item recommendation and search service",
            "L047":"check delivery status",
            "L048":"out of stock items guide",
            "L049":"Information regarding restock",
            "Create shopping bot":"Create shopping bot",
            "L050":"Hotel bot",
            "L051":"automatic room reservations",
            "L052":"24hours customer response",
            "L053":"hotel access guide",
            "L054":"check room availability",
            "L055":"Room Booking",
            "L056":"Guide in Foreign Language",
            "Create Hotel bot":"Create Hotel bot",
            "L057":"Hospital bot",
            "L058":"Doctor's consultaion and treatment reservation",
            "L059":"possess the largest data regarding hospital information",
            "L060":"procedural guide",
            "L061":"hospital information",
            "L062":"Medical Treatment Reservation",
            "L063":"Search Feedbacks information",
            "Create hospital bot":"Create hospital bot",
            "L064":"Construction case of using an excellenct conversational Artificial intelligence engine",
            "L065":"Counselling chatbot regarding financial banking tasks of NH bank",
            "L066":"platform - KakaoTalk",
            "L067":"Release Date: 2016.10.28",
            "L068":"Main Function: item guide, frequently asked",
            "L069":"questions, event guide, opening hours guide",
            "L070":"customer service and information sharing chatbot",
            "L071":"platform - KakaoTalk, Facebook, naver talktalk",
            "L072":"Release date: 2017.06.28",
            "L073":"Main Function: Shinhan Fan Guide, Card recommendation",
            "L074":"Frequently asked qeustions, event",
            "L075":"Platform - KakaoTalk, Facebook",
            "L076":"Release Date: 2016.11.18",
            "L077":"order delivery food(Search Restaurants,",
            "L078":"menu search, manage orders and etc.)",
            "L079":"Use the World's best conversational Artificial Intelligence Technique for free.",
            "L080":"Copyright 2017 by MoneyBrain Inc.",
            "L081":"All Rights Reserved",
            "L082":"Links",
            "L083":"Privacy",
            "L084":"Policy",
            "Terms":"Terms",
            "Conditions":"Conditions",
            "Licenses":"Licenses",
            "L085":"Company",
            "L086":"Homepage",
            "L087":"Coming Soon",
            "L088":"Blog",
            "L089":"Facebook",
            "L090":"Contact with us",
            "L091":"is not found",
            "L092" : "Who Use Playchat?",
            "L093" : "Build Chatbot",
            "L094" : 'Start Now',
            "L095" : "Register",
            "L096" : "Sign up",
            "L097" : "Make chatbot in 10 minutes",
            "L098" : "Best Chatbot Builder. It`s easy and fast",
            "lan" : "en",
            "sigunup" : "Success! Please, confirm your email.",
            "start" : 'Start'

        },
        zh: {
            "L001": "Playchat - 聊天机器人开发，对话型人工智能平台，Moneybrain",
            "L002": "登录",
            "L003": "忘记了密码？",
            "L004": "点击",
            "L005": "您还没有注册用户名？",
            "L006": "点击注册。",
            "L007": "主页﻿",
            "L008": "特色",
            "L009": "模板",
            "L010": "合作伙伴",
            "ko": "韩语",
            "L011": "韩语",
            "L012": "英语",
            "L013": "中文",
            "L014": "日语",
            "L015": "免费开始",
            "L016": "互动式AI平台Playchat",
            "L017": "现在您只需简单地输入信息而不需要自己开发，就可以创建自己的交互式人工智能。",
            "L018": "另外，您还可以连接到您的公众号和Facebook。",
            "L019": "Playchat为了实现自然交互式人工智能，提供了以下多种功能。",
            "L020": "以业种来区分的模板",
            "L021": "在模板中创建聊天机器人所能提供的服务。",
            "L022": "有各种各样的模板，如餐饮，购物和医疗。",
            "L023": "1:1对话学习",
            "L024": "在聊天机器人中只需让聊天机器人学习简单的问题和答案,它就可以回答相应的问题了。",
            "L025": "您可以将问答整理成一个Excel文件，让它一次性学习。",
            "L026": "场景会话管理",
            "L027": "为了让它可以像人一样进行阶段式对话,您可以添加基于各种场景的对话内容。",
            "L028": "支持多种平台",
            "L029": "将您自己制作的聊天机器人，连接到微信，Kakao Talk，Facebook，Naver Talk Talk 等多个平台上，并可以在Playchat进行综合管理。",
            "L030": "通过便捷的服务来吸引客户",
            "L031": "现在就开始利用聊天机器人来轻轻松松处理业务吧。",
            "L032": "像聊天一样可以亲近客户，您会对这样便利又快速的服务感到非常满意。",
            "L033": "降低成本，提高销售额",
            "L034": "自动客户响应系统可以减少员工为简单业务所花的时间。另外，聊天机器人还是一种吸引新客户的好方法，让您的销售量蹭蹭上涨！",
            "L035": "现在就立刻开始使用模板，来制作人工智能聊天机器人吧！加入能抓住客户的主人公列队！",
            "L036": "外卖机器人",
            "L037": "自动预订菜单",
            "L038": "外卖菜单订餐和确认",
            "L039": "菜单指南",
            "L040": "菜单订餐和确认",
            "L041":"查看您的订单历史记录",
            "L042":"订单确认指南",
            "Create delivery bot":"创建一个外卖聊天机器人",
            "L043":"购物聊天机器人",
            "L044":"产品搜索和推荐",
            "L045":"产品推荐和送货服务",
            "L046":"产品推荐和搜索服务",
            "L047":"查看送货状态",
            "L048":"产品售罄告知",
            "L049":"上货日期",
            "Create shopping bot":"创建一个购物聊天机器人",
            "L050":"酒店聊天机器人",
            "L051":"自动预订房间",
            "L052":"24小时自动答复",
            "L053":"酒店指南",
            "L054":"房间查询",
            "L055":"房间预订",
            "L056":"外语指南",
            "Create Hotel bot":"创建酒店聊天机器人",
            "L057":"医院聊天机器人",
            "L058":"医疗预约和咨询",
            "L059":"拥有做多的医院指南数据",
            "L060":"治疗向导",
            "L061":"医院信息",
            "L062":"治疗预约",
            "L063":"查看反馈信息",
            "Create hospital bot":"创建医院聊天机器人",
            "L064":"使用了Playchat优秀对话型人工智能引擎的案例",
            "L065":"农协银行金融服务咨询聊天机器人",
            "L066":"平台 - KakaoTalk",
            "L067":"发布日期：2016年10月28日",
            "L068":"主要功能：产品指南，常见问题解答",
            "L069":"问题，活动指南，营业时间指南",
            "L070":"客户咨询和信息共享聊天机器人",
            "L071":"平台 - Kakao Talk，Facebook，Naver Talk Talk",
            "L072":"发布日期：2017年6月28日",
            "L073":"主要功能：新韩FAN指南，信用卡推荐",
            "L074":"常见问题，活动指南",
            "L075":"平台 - Kakao Talk，Facebook",
            "L076":"发布日期：2016年11月18日",
            "L077":"外卖订餐（搜索餐厅,",
            "L078":"查看菜单，订单管理等）",
            "L079":"免费使用世界上最好的对话型人工智能技术！",
            "L080":"Copyright 2017 by MoneyBrain Inc.",
            "L081":"版权所有﻿",
            "L082":"链接",
            "L083":"隐私",
            "L084":"政策",
            "Terms":"协议",
            "Conditions":"条件",
            "Licenses":"许可",
            "L085":"公司",
            "L086":"主页",
            "L087":"开发中",
            "L088":"博客",
            "L089":"Facebook",
            "L090":"联系我们",
            "L091":"找不到",
            "L092" : "Who Use Playchat?",
            "L093" : "Build Chatbot",
            "L094" : 'Start Now',
            "L095" : "Register",
            "L096" : "Sign up",
            "L097" : "Chatbot I build, easy and fast",
            "L098" : "World best dialog Artificial Intelligence Technology",
            "lan" : "zh",
            "start" : '开始对话'

        },
        jp: {
            "L001":"",
            "L002":"",
            "L003":"",
            "L004":"",
            "L005":"",
            "L006":"",
            "L007":"",
            "L008":"",
            "L009":"",
            "L010":"",
            "ko":"",
            "L011":"",
            "L012":"",
            "L013":"",
            "L014":"",
            "L015":"",
            "L016":"",
            "L017":"",
            "L018":"",
            "L019":"",
            "L020":"",
            "L021":"",
            "L022":"",
            "L023":"",
            "L024":"",
            "L025":"",
            "L026":"",
            "L027":"",
            "L028":"",
            "L029":"",
            "L030":"",
            "L031":"",
            "L032":"",
            "L033":"",
            "L034":"",
            "L035":"",
            "L036":"",
            "L037":"",
            "L038":"",
            "L039":"",
            "L040":"",
            "L041":"",
            "L042":"",
            "Create delivery bot":"",
            "L043":"",
            "L044":"",
            "L045":"",
            "L046":"",
            "L047":"",
            "L048":"",
            "L049":"",
            "Create shopping bot":"",
            "L050":"",
            "L051":"",
            "L052":"",
            "L053":"",
            "L054":"",
            "L055":"",
            "L056":"",
            "Create Hotel bot":"",
            "L057":"",
            "L058":"",
            "L059":"",
            "L060":"",
            "L061":"",
            "L062":"",
            "L063":"",
            "Create hospital bot":"",
            "L064":"",
            "L065":"",
            "L066":"",
            "L067":"",
            "L068":"",
            "L069":"",
            "L070":"",
            "L071":"",
            "L072":"",
            "L073":"",
            "L074":"",
            "L075":"",
            "L076":"",
            "L077":"",
            "L078":"",
            "L079":"",
            "L080":"",
            "L081":"",
            "L082":"",
            "L083":"",
            "L084":"",
            "Terms":"",
            "Conditions":"",
            "Licenses":"",
            "L085":"",
            "L086":"",
            "L087":"",
            "L088":"",
            "L089":"",
            "L090":"",
            "L091":"見つけることができません。",
            "L092" : "Who Use Playchat?",
            "L093" : "Build Chatbot",
            "L094" : 'Start Now',
            "L095" : "Register",
            "L096" : "Sign up",
            "L097" : "Chatbot I build, easy and fast",
            "L098" : "World best dialog Artificial Intelligence Technology",
            "lan" : "ja",
            "start" : '始める'

        }
    };

    var result = lan[code];

    for(var key in result)
    {
        if(!result[key])
        {
            result[key] = lan['en'][key];
        }
    }

    return lan[code];
};
