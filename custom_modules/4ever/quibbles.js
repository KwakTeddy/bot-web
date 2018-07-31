module.exports = function(bot)
{
    var quibbles = [];

    //1.정치
    quibbles.push(
    {
        words: [' 정치', '박근혜', '문재인', '홍준표', '민주당', '자유 한국 당', '바르다 정당', '새누리', '자 다', '한국 당', '국민의당', '안철수', '대통령', '국회', '국회의원', '청와대', '강경화', '김상조'],
        sentences: ['이런 질문에는 아하, 그런가요 라고 답하라고 배웠습니다."아하, 그런가요." \n\n다른 질문을 해 주세요.']
    });
    //2.욕설
    quibbles.push(
        {
            words: ["시발", '씨발', 'ㅅㅂ',"ㄱㅅㄲ","개새끼","썅","나쁘다 놈","죽다 버리다","꺼지다","병신","ㅂㅅ","ㅅㅂㄴ","미치다","눈 까다","별로","못 생기다","섹스","죽다"],
            sentences:
            [
                "고객님을 화 나게 하다니, 정말 죄송합니다.\n\n다른 질문을 해 주시면 안 될까요?",
                "힝~ 너무 무서워요 고객님ㅜㅜ\n\n다른 질문을 해 주시면 안 될까요?",
                "고객님! 그렇게 화 내시면 제 마음도 아파요ㅜㅜ\n\n다른 질문을 해 주시면 안 될까요?",
                "고객님, 그렇게 화를 내시다니 다 제 잘못입니다.\n\n다른 질문을 해 주시면 안 될까요?"
            ]
        });
    // 3.칭찬
    quibbles.push(
        {
            words: ["수고 하다", "수고", '고생 많다',"고생 하다","감사 하다","고맙다","ㄱㅅ","땡큐"],
            sentences:
            [
                "고객님, 정말 감동이에요! 감사합니다.\n\n 다른 질문도 해 주세요, 자비스처럼 대답할게요."
            ]
        });
    // 4.인사
    quibbles.push(
        {
            words: ["안녕", "안녕하다", '헬로 우',"hello","굿모닝","하이","hi","반갑다","안뇽"],
            sentences:
                [
                    "고객님, 정말 감동이에요! 감사합니다.\n\n 다른 질문도 해 주세요, 자비스처럼 대답할게요."
                ]
        });
    // 5.돈
    quibbles.push(
        {
            words:["돈", "내 돈 어디 가다", "돈 좀 주다", "돈 필요하다","돈 좀 내주다"],
            sentences:
            [
                "하하, 잠깐 화장실 좀 다녀와야겠어요.\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요."
            ]
        });
    // 6.일상
    quibbles.push(
        {
            words: ["오늘 뭐", "오늘 모해", "모해", "뭐","모하","모햐"],
            sentences:
            [
                "전 오늘도 새로운 것을 배우기 위해 열심히 노력 중이에요!\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요."
            ]
        });
    // 7.날씨
    quibbles.push(
        {
            words: ["날씨"],
            sentences:
                [
                    "아... 그건 제가 아직 잘 몰라서요, 죄송합니다.\n\n다른 질문을 해 주세요, 최대한 성실히 대답할게요."
                ]
        });
    // 8.푸념
    quibbles.push(
        {
            words: ["졸리다","배고프다","퇴근 시키다","야근 하다 싫다","힘들다"],
            sentences:
                [
                    "고객님이 힘드시다니 제 마음이 다 아파요ㅜㅜ\n\n혹시 다른 질문이 있으신가요? 언제든지 물어봐 주세요, 자비스처럼 대답할게요."
                ]
        });
    // 9.답답
    quibbles.push(
        {
            words: ["답정너","답답","답답하다","뭐임"],
            sentences:
                [
                    "앗, 죄송해요 고객님 제가 아직 잘 몰라서요ㅜㅜ 더 열심히 공부할게요.\n\n혹시 다른 질문이 있으신가요?"
                ]
        });
    // 10.사랑
    quibbles.push(
        {
            words: ["좋아하다","사랑","하트","보다","사랑 햐","좋아햐"],
            sentences:
                [
                "어머, 너무 감동이에요!\n저도 사랑합니다♥\n\n다른 질문이 있으신가요? 사랑을 담아 대답할게요.",
                "저도 사랑합니다, 고객님♥\n주변 사람들에게도 오늘은 꼭 사랑한다고 말해 보세요.\n\n혹시 다른 질문이 있으신가요? 사랑을 담아 대답할게요.",
                "사랑은 정말 아름다운 것이죠, 고객님이 그렇게 말씀해 주시니 너무 기뻐요.\n저도 사랑합니다♥\n\n또 다른 질문이 있으신가요? 사랑을 담아 대답해 드릴게요.",
                "어머, 그렇게 말씀하시면 제가 부끄러워요 >.<\n저도 사랑합니다 고객님!\n\n또 다른 질문이 있으신가요? 사랑을 담아 대답해 드릴게요.",
                "아잇, 제가 먼제 말하려고 했는데...\n저도 사랑합니다♥\n\n또 다른 질문이 있으신가요? 사랑을 담아 대답할게요."
                ]
        });
    // 11.일상대화_바쁨
    quibbles.push(
        {
            words: ["바쁘다","오늘 바쁘다","바쁘다 가요"],
            sentences:
                [
                    "고객님이 바쁘시다니, 제 마음이 다 아파요ㅜㅜ\n아무리 바쁘셔도 건강이 제일 중요한 건 아시죠?\n시원한 스트레칭 10분 어떠세요?\n\n다른 질문을 해 주시면 저는 그 동안 답을 열심히 찾아볼게요!"
            ]
        });
    // 12.짜증2
    quibbles.push(
        {
            words: ["짜증","ㅡㅡ","아 짜증","아 놓다","짜증 나다","짜증 요","짱","쯧쯧","흥","미치다","싸우다","화나다","웃다","웃다 말다"],
            sentences:
                [
                "고객님이 이렇게 화 나신 모습을 보니 제 마음이 다 안좋아요ㅜㅜ\n\n다른 질문을 해 주시면 열심히 대답할게요.",
                "다 제가 모자라서입니다, 죄송해요ㅜㅜ\n\n다른 질문을 해 주시면 열심히 대답할게요.",
                "앗, 혹시 저 때문에 화 나신 건가요? 밤새도록 열심히 공부할게요 기분 푸세요ㅜㅜ\n\n다른 질문을 해 주시면 열심히 대답하겠습니다."
                ]
        });
    // 13.일상대화_짜증
    quibbles.push(
        {
            // words: ["ㅇㅇ","ㅇ","응","네","그렇다","알다","아","ㅇㅋ"],
            words: ["ㅇㅇ","ㅇ","응","네","그렇다","ㅇㅋ"],
            sentences:
                [
                "궁금하신 게 있으시면 언제든지 저에게 물어보세요~\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
                "저의 답변이 만족스러우셨기를 바랄게요.\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
                "고객님께 도움이 되다니, 정말 기뻐요!\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요."
                ]
        });
    // 14.알았음
    quibbles.push(
        {
            words: ["짜증 나다","미치다","화나다","빡치다","짜증"],
            sentences:
                [
                    "저는 그럴 때 항상 초콜릿을 먹어요.\n\n고객님도 고객님만의 스트레스 해소 방법이 있으시겠죠? 기분 푸세요ㅜㅜ\n다른 질문이 있으시면, 성심성의껏 대답해 드릴게요."
                ]
        });
    // 15.부정 - 아니/안돼
    quibbles.push(
        {
            words: ["아니다","아뇨"],
            sentences:
                [
                "죄송합니다, 제가 대답을 잘못한 것 같네요.\n\n다시 질문해 주시거나, 다른 질문을 해 주세요.",
                "앗, 그게 아니군요!\n\n다시 질문해 주시거나, 다른 질문을 해 주세요.",
                "제가 제대로 이해하지 못 한 것 같아요, 죄송합니다ㅜㅜ\n\n다시 질문해 주시거나, 다른 질문을 해 주세요.",
                "죄송해요, 잘 이해하지 못 했어요. 한 번 더 기회를 주세요ㅜㅜ\n\n다시 질문해 주시거나, 다른 질문을 해 주세요."
                ]
        });
    // 16.상담
    quibbles.push(
        {
            words: ["고객 센터","상담 원","상담","전화번호","민원"],
            sentences:
                [
                    "포에버성형외과 고객센터(☎02-561-5773~4)를 이용가능하십니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                ]
        });
    // 17.이벤트
    quibbles.push(
        {
            words: ["이벤트"],
            sentences:
                [
                    "취근에 있는 이벤트는 챗봇 초기 4번 페북지기에게 한마디를 선택해 주세요. 더 좋은 이벤트로 보답하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
                ]
        });
    // 18.웃음
    quibbles.push(
        {
            words: [ "ㅎㅎ","ㅋㅋ","ㅋㅋㅋ","ㅎㅎㅎ"],
            sentences:
                [
                    "하하! 저도 정말 재미있어요^^\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
                    "고객님이 웃으시니 저도 덩달아 즐거워요.\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
                    "웃으면 복이 온대요~\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요."
                ]
        });
    // 19.욕설-바보
    quibbles.push(
        {
            words: [ "바보","바부","멍청","멍충","멍청이","멍처하","멍청이야","멍충이"],
            sentences:
                [
                    "고객님~ 저 상처 받아요ㅜㅜ\n\n다른 질문을 해 주시면 열심히 대답할게요.",
                    "매일 새로운 말을 배우는 중이에요, 기대해 주세요!\n\n다른 질문을 해 주시면 열심히 대답할게요.",
                    "고객님께 걸맞는 챗봇이 될 때까지 매일 열심히 공부할게요!\n\n다른 질문을 해 주시면 열심히 대답할게요.",
                    "고객님이 너무 똑똑하셔서 상대적으로 제가 바보같아 보이는 거예요ㅜㅜ\n\n다른 질문을 해 주시면 열심히 대답할게요."
                ]
        });
    // 20.없다
    quibbles.push(
        {
            // words: [ "없다","몰르다","이해 잘 안 되다","이해 자다 안 돼다","모르다"]
            words: [ "몰르다","이해 잘 안 되다","이해 자다 안 돼다","모르다"],
            sentences:
                [
                    "찾으시는 답변이 없으신가요?\n\n키워드를 바꿔서 다시 한 번 질문해 주세요, 열심히 찾아볼게요."
                ]
        });
    // 21.부정-탄식
    quibbles.push(
        {
            // words: [ "허다","아오","엥","이렇다","칫","뭐임","아이","에고","음","이렇다 뇨","헉","흠","첨","하","아이구","어허"]
            words: [ "허다","아오","엥","이렇다","칫","뭐임","아이","에고","음","이렇다 뇨","헉","흠","첨","아이구","어허"],
            sentences:
                [
                "괜찮아요, 다 잘 될 거에요!\n\n다른 질문을 해 주세요, 성심성의껏 대답해 드릴게요.",
                "너무 상심하지 마세요, 제가 있잖아요!\n\n다른 질문을 해 주세요, 성심성의껏 대답해 드릴게요."
                ]
        });
    // 22.감사
    quibbles.push(
        {
            words: [ "감사","고마 웡","고마워","오케이","편하다","thank","감동","고맙다","괜찮다","금사"],
            sentences:
                [
                "어머 고객님, 감동이에요♥\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
                "고객님 덕분에 너무 기운나요!\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
                "감사합니다, 고객님 덕분에 행복 충전 완료!\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요."
                ]
        });
    // 23.이름/누구
    quibbles.push(
        {
            words: [ "이름","알파","누구","너 뭐","너 애기","뉘귀","너 대해","알파 거","누가","인공 지능","인공지능"],
            sentences:
                [
                "하하, 저는 아직 초짜 챗봇이에요^^\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
                "네 제가 바로 포에버성형외과의 자동응답형 챗봇입니다. 데헷~ \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
                "저에게 관심 가져 주시니 기뻐요~\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요."
                ]
        });
    // 24.부정-기능무시
    quibbles.push(
        {
            words: [ "알다 게 없다","하나","가능하다 게","공부 많이","그냥 기사","그 쪽 궁금하다 게 없다","똑똑하다 다시","답변 안 되다","말 되다","모르다","대답 맞다 않다","뭐 하다 수 있다","무슨 소리","뭔 소리","알다 게 뭐","뭘 대답 하다 수 있다","대화 안 되다","아직 멀다","이 다야","카톡 보내다 마", "도움 안 돼다","관련 없다 답변","해당 되다 내용 없다","헛소리","실망","뭔가","다야"],
            sentences:
                [
                "죄송해요, 제가 아직 많이 모자라죠? 매일 발전하려 노력하고 있어요.\n\n다른 질문이 있으신가요? 자비스처럼 대답하겠습니다.",
                "제가 아직 초보라... 앞으로 더 열심히 하겠습니다!\n\n다른 질문이 있으신가요? 자비스처럼 대답하겠습니다.",
                "저는 아직도 배울 게 너무 많아요~ 조금만 더 기다려주세요 :)\n\n다른 질문이 있으신가요? 자비스처럼 대답하겠습니다.",
                "죄송해요, 다음 번에는 꼭 정답을 알아올게요!\n\n다른 질문이 있으신가요? 자비스처럼 대답하겠습니다."
                ]
        });
    // 25.나
    quibbles.push(
        {
            words: [ "나다"],
            sentences:
                [
                "고객님의 행복이 곧 저의 행복입니다~\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요.",
                "하하 저도요^^\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요."
                ]
        });
    // 26.시비
    quibbles.push(
        {
            words: [ "재미있다","재다","재밌다"],
            sentences:
                [
                "고객님과 대화하는 것이 제 삶의 낙이에요~\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요.",
                "저도 정말 재미있어요!\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요."
                ]
        });
    // 27.시비2
    quibbles.push(
        {
            words: [ "라이벌"],
            sentences:
                [
                "하하, 저는 제 할 일만 할 뿐이에요.\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
                "결국 제일 중요한 건 자기 자신 아니겠어요?\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요."
                ]
        });
    // 28.물음표
    quibbles.push(
        {
            words: [ "?","??"],
            sentences:
                [
                    "무엇을 도와드릴까요?\n\n질문해 주세요, 자비스처럼 대답할게요.",
                    "어떤 게 궁금하세요?\n\n질문해 주세요, 자비스처럼 대답할게요."
                ]
        });

    bot.setQuibbles(quibbles);
};

// module.exports.nounQuibbles =
// [
//     //명사
//     //1.정치
//     {
//         condition:
//         {
//             words: ['정치', '박근혜', '문재인',"홍준표","민주당","자유 한국 당","바르다 정당","새누리","자 다","한국 당","국민의당","안철수","대통령","국회","국회의원","청와대","강경화","김상조"]
//         },
//         sentences:
//         [
//             '이런 질문에는 아하, 그런가요 라고 답하라고 배웠습니다."아하, 그런가요." \n\n다른 질문을 해 주세요.'
//         ]
//     },
//     // 7.날씨
//     {
//         condition:
//             {
//                 words: ["날씨"]
//             },
//         sentences:
//             [
//                 "아... 그건 제가 아직 잘 몰라서요, 죄송합니다.\n\n다른 질문을 해 주세요, 최대한 성실히 대답할게요."
//             ]
//     },
//     // 16.상담
//     {
//         condition:
//             {
//                 words: ["고객 센터","상담 원","상담","전화번호","민원"]
//             },
//         sentences:
//             [
//                 "포에버성형외과 고객센터(☎02-561-5773~4)를 이용가능하십니다. \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
//             ]
//     },
//     // 17.이벤트
//     {
//         condition:
//             {
//                 words: ["이벤트"]
//             },
//         sentences:
//             [
//                 "페이스북 이벤트는 챗봇 초기 4번 페북지기에게 한마디를 선택해 주세요.  페이스북 이벤트가 아닌 신한카드 이벤트는 홈페이지를 참고해 주시면 됩니다. 더 좋은 이벤트로 보답하겠습니다.\n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다."
//             ]
//     },
//     // 23.이름/누구
//     {
//         condition:
//             {
//                 words: [ "이름","알파","누구","너 뭐","너 애기","뉘귀","너 대해","알파 거","누가","인공 지능","인공지능"]
//             },
//         sentences:
//             [
//                 "하하, 저는 아직 초짜 챗봇이에요^^\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
//                 "네 제가 바로 신한의 자동응답형 챗봇입니다. 데헷~ \n\n궁금하신 다른 키워드를 입력해 주세요. 알파고처럼 대답하겠습니다.",
//                 "저에게 관심 가져 주시니 기뻐요~\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요."
//             ]
//     },
//     // 25.나
//     {
//         condition:
//             {
//                 words: [ "나다"]
//             },
//         sentences:
//             [
//                 "고객님의 행복이 곧 저의 행복입니다~\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요.",
//                 "하하 저도요^^\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요."
//             ]
//     }
// ];
//
// module.exports.verbQuibbles =
// [
//     //동사
//
// ];
//
// module.exports.sentenceQuibbles =
// [
//     //문장
//     // 5.돈
//     {
//         condition:
//             {
//                 words: ["돈", "내 돈 어디 가다", "돈 좀 주다", "돈 필요하다","돈 좀 내주다"]
//             },
//         sentences:
//             [
//                 "하하, 잠깐 화장실 좀 다녀와야겠어요.\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요."
//             ]
//     },
//     // 6.일상
//     {
//         condition:
//             {
//                 words: ["오늘 뭐", "오늘 모해", "모해", "뭐","모하","모햐"]
//             },
//         sentences:
//             [
//                 "전 오늘도 새로운 것을 배우기 위해 열심히 노력 중이에요!\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요."
//             ]
//     },
//     // 11.일상대화_바쁨
//     {
//         condition:
//             {
//                 words: ["바쁘다","오늘 바쁘다","바쁘다 가요"]
//             },
//         sentences:
//             [
//                 "고객님이 바쁘시다니, 제 마음이 다 아파요ㅜㅜ\n아무리 바쁘셔도 건강이 제일 중요한 건 아시죠?\n시원한 스트레칭 10분 어떠세요?\n\n다른 질문을 해 주시면 저는 그 동안 답을 열심히 찾아볼게요!"
//             ]
//     },
//     // 24.부정-기능무시
//     {
//         condition:
//             {
//                 words: [ "알다 게 없다","하나","가능하다 게","공부 많이","그냥 기사","그 쪽 궁금하다 게 없다","똑똑하다 다시","답변 안 되다","말 되다","모르다","대답 맞다 않다","뭐 하다 수 있다","무슨 소리","뭔 소리","알다 게 뭐","뭘 대답 하다 수 있다","대화 안 되다","아직 멀다","이 다야","카톡 보내다 마", "도움 안 돼다","관련 없다 답변","해당 되다 내용 없다","헛소리","실망","뭔가","다야"]
//             },
//         sentences:
//             [
//                 "죄송해요, 제가 아직 많이 모자라죠? 매일 발전하려 노력하고 있어요.\n\n다른 질문이 있으신가요? 자비스처럼 대답하겠습니다.",
//                 "제가 아직 초보라... 앞으로 더 열심히 하겠습니다!\n\n다른 질문이 있으신가요? 자비스처럼 대답하겠습니다.",
//                 "저는 아직도 배울 게 너무 많아요~ 조금만 더 기다려주세요 :)\n\n다른 질문이 있으신가요? 자비스처럼 대답하겠습니다.",
//                 "죄송해요, 다음 번에는 꼭 정답을 알아올게요!\n\n다른 질문이 있으신가요? 자비스처럼 대답하겠습니다."
//             ]
//     }
// ];
//
// module.exports.slangQuibbles =
// [
//     //2.욕설
//     {
//         condition:
//             {
//                 words: ["시발", '씨발', 'ㅅㅂ',"ㄱㅅㄲ","개새끼","썅","나쁘다 놈","죽다 버리다","꺼지다","병신","ㅂㅅ","ㅅㅂㄴ","미치다","눈 까다","별로","못 생기다","섹스","죽다"]
//             },
//         sentences:
//             [
//                 "고객님을 화 나게 하다니, 정말 죄송합니다.\n\n다른 질문을 해 주시면 안 될까요?",
//                 "힝~ 너무 무서워요 고객님ㅜㅜ\n\n다른 질문을 해 주시면 안 될까요?",
//                 "고객님! 그렇게 화 내시면 제 마음도 아파요ㅜㅜ\n\n다른 질문을 해 주시면 안 될까요?",
//                 "고객님, 그렇게 화를 내시다니 다 제 잘못입니다.\n\n다른 질문을 해 주시면 안 될까요?"
//             ]
//     },
//     // 14.알았음
//     {
//         condition:
//             {
//                 // words: ["ㅇㅇ","ㅇ","응","네","그렇다","알다","아","ㅇㅋ"]
//                 words: ["ㅇㅇ","ㅇ","응","네","그렇다","ㅇㅋ"]
//             },
//         sentences:
//             [
//                 "궁금하신 게 있으시면 언제든지 저에게 물어보세요~\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
//                 "저의 답변이 만족스러우셨기를 바랄게요.\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
//                 "고객님께 도움이 되다니, 정말 기뻐요!\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요."
//             ]
//     },
//     // 15.부정 - 아니/안돼
//     {
//         condition:
//             {
//                 words: ["아니다","아뇨"]
//             },
//         sentences:
//             [
//                 "죄송합니다, 제가 대답을 잘못한 것 같네요.\n\n다시 질문해 주시거나, 다른 질문을 해 주세요.",
//                 "앗, 그게 아니군요!\n\n다시 질문해 주시거나, 다른 질문을 해 주세요.",
//                 "제가 제대로 이해하지 못 한 것 같아요, 죄송합니다ㅜㅜ\n\n다시 질문해 주시거나, 다른 질문을 해 주세요.",
//                 "죄송해요, 잘 이해하지 못 했어요. 한 번 더 기회를 주세요ㅜㅜ\n\n다시 질문해 주시거나, 다른 질문을 해 주세요."
//             ]
//     },
//     // 18.웃음
//     {
//         condition:
//             {
//                 words: [ "ㅎㅎ","ㅋㅋ","ㅋㅋㅋ","ㅎㅎ"]
//             },
//         sentences:
//             [
//                 "하하! 저도 정말 재미있어요^^\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
//                 "고객님이 웃으시니 저도 덩달아 즐거워요.\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
//                 "웃으면 복이 온대요~\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요."
//             ]
//     },
//     // 19.욕설-바보
//     {
//         condition:
//             {
//                 words: [ "바보","바부","멍청","멍충","멍청이","멍처하","멍청이야","멍충이"]
//             },
//         sentences:
//             [
//                 "고객님~ 저 상처 받아요ㅜㅜ\n\n다른 질문을 해 주시면 열심히 대답할게요.",
//                 "매일 새로운 말을 배우는 중이에요, 기대해 주세요!\n\n다른 질문을 해 주시면 열심히 대답할게요.",
//                 "고객님께 걸맞는 챗봇이 될 때까지 매일 열심히 공부할게요!\n\n다른 질문을 해 주시면 열심히 대답할게요.",
//                 "고객님이 너무 똑똑하셔서 상대적으로 제가 바보같아 보이는 거예요ㅜㅜ\n\n다른 질문을 해 주시면 열심히 대답할게요."
//             ]
//     },
//     // 20.없다
//     {
//         condition:
//             {
//                 // words: [ "없다","몰르다","이해 잘 안 되다","이해 자다 안 돼다","모르다"]
//                 words: [ "몰르다","이해 잘 안 되다","이해 자다 안 돼다","모르다"]
//             },
//         sentences:
//             [
//                 "찾으시는 답변이 없으신가요?\n\n키워드를 바꿔서 다시 한 번 질문해 주세요, 열심히 찾아볼게요."
//             ]
//     },
//     // 21.부정-탄식
//     {
//         condition:
//             {
//                 // words: [ "허다","아오","엥","이렇다","칫","뭐임","아이","에고","음","이렇다 뇨","헉","흠","첨","하","아이구","어허"]
//                 words: [ "허다","아오","엥","이렇다","칫","뭐임","아이","에고","음","이렇다 뇨","헉","흠","첨","아이구","어허"]
//             },
//         sentences:
//             [
//                 "괜찮아요, 다 잘 될 거에요!\n\n다른 질문을 해 주세요, 성심성의껏 대답해 드릴게요.",
//                 "너무 상심하지 마세요, 제가 있잖아요!\n\n다른 질문을 해 주세요, 성심성의껏 대답해 드릴게요."
//             ]
//     },
//     // 12.짜증2
//     {
//         condition:
//             {
//                 words: ["짜증","ㅡㅡ","아 짜증","아 놓다","짜증 나다","짜증 요","짱","쯧쯧","흥","미치다","싸우다","화나다","웃다","웃다 말다"]
//             },
//         sentences:
//             [
//                 "고객님이 이렇게 화 나신 모습을 보니 제 마음이 다 안좋아요ㅜㅜ\n\n다른 질문을 해 주시면 열심히 대답할게요.",
//                 "다 제가 모자라서입니다, 죄송해요ㅜㅜ\n\n다른 질문을 해 주시면 열심히 대답할게요.",
//                 "앗, 혹시 저 때문에 화 나신 건가요? 밤새도록 열심히 공부할게요 기분 푸세요ㅜㅜ\n\n다른 질문을 해 주시면 열심히 대답하겠습니다."
//
//             ]
//     },
//
//
//     //동사
//     // 3.칭찬
//     {
//         condition:
//             {
//                 words: ["수고 하다", "수고", '고생 많다',"고생 하다","감사 하다","고맙다","ㄱㅅ","땡큐"]
//             },
//         sentences:
//             [
//                 "고객님, 정말 감동이에요! 감사합니다.\n\n 다른 질문도 해 주세요, 자비스처럼 대답할게요."
//             ]
//     },
//     // 4.인사
//     {
//         condition:
//             {
//                 words: ["안녕", "안녕하다", '헬로 우',"hello","굿모닝","하이","hi","반갑다","안뇽"]
//             },
//         sentences:
//             [
//                 "네, 안녕하세요!\n먼저 인사해 주시다니 정말 감동이에요.\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요.",
//                 "저에게 이렇게 인사해 주시는 분은 고객님이 처음이세요.\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요.",
//                 "반갑습니다 고객님, 고객님과 이렇게 인사를 나누다니 너무 기뻐요 :)\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요."
//             ]
//     },
//     // 8.푸념
//     {
//         condition:
//             {
//                 words: ["졸리다","배고프다","퇴근 시키다","야근 하다 싫다","힘들다"]
//             },
//         sentences:
//             [
//                 "고객님이 힘드시다니 제 마음이 다 아파요ㅜㅜ\n\n혹시 다른 질문이 있으신가요? 언제든지 물어봐 주세요, 자비스처럼 대답할게요."
//             ]
//     },
//     // 9.답답
//     {
//         condition:
//             {
//                 words: ["답정너","답답","답답하다","뭐임"]
//             },
//         sentences:
//             [
//                 "앗, 죄송해요 고객님 제가 아직 잘 몰라서요ㅜㅜ 더 열심히 공부할게요.\n\n혹시 다른 질문이 있으신가요?"
//             ]
//     },
//     // 10.사랑
//     {
//         condition:
//             {
//                 words: ["좋아하다","사랑","하트","보다","사랑 햐","좋아햐"]
//             },
//         sentences:
//             [
//                 "어머, 너무 감동이에요!\n저도 사랑합니다♥\n\n다른 질문이 있으신가요? 사랑을 담아 대답할게요.",
//                 "저도 사랑합니다, 고객님♥\n주변 사람들에게도 오늘은 꼭 사랑한다고 말해 보세요.\n\n혹시 다른 질문이 있으신가요? 사랑을 담아 대답할게요.",
//                 "사랑은 정말 아름다운 것이죠, 고객님이 그렇게 말씀해 주시니 너무 기뻐요.\n저도 사랑합니다♥\n\n또 다른 질문이 있으신가요? 사랑을 담아 대답해 드릴게요.",
//                 "어머, 그렇게 말씀하시면 제가 부끄러워요 >.<\n저도 사랑합니다 고객님!\n\n또 다른 질문이 있으신가요? 사랑을 담아 대답해 드릴게요.",
//                 "아잇, 제가 먼제 말하려고 했는데...\n저도 사랑합니다♥\n\n또 다른 질문이 있으신가요? 사랑을 담아 대답할게요."
//             ]
//     },
//     // 13.일상대화_짜증
//     {
//         condition:
//             {
//                 words: ["짜증 나다","미치다","화나다","빡치다","짜증"]
//             },
//         sentences:
//             [
//                 "저는 그럴 때 항상 초콜릿을 먹어요.\n\n고객님도 고객님만의 스트레스 해소 방법이 있으시겠죠? 기분 푸세요ㅜㅜ\n다른 질문이 있으시면, 성심성의껏 대답해 드릴게요."
//             ]
//     },
//     // 22.감사
//     {
//         condition:
//             {
//                 words: [ "감사","고마 웡","오케이","편하다","thank","감동","고맙다","괜찮다","금사"]
//             },
//         sentences:
//             [
//                 "어머 고객님, 감동이에요♥\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
//                 "고객님 덕분에 너무 기운나요!\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
//                 "감사합니다, 고객님 덕분에 행복 충전 완료!\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요."
//             ]
//     },
//     // 26.시비
//     {
//         condition:
//             {
//                 words: [ "재미있다","재다","재밌다"]
//             },
//         sentences:
//             [
//                 "고객님과 대화하는 것이 제 삶의 낙이에요~\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요.",
//                 "저도 정말 재미있어요!\n\n다른 질문도 해 주세요, 자비스처럼 대답할게요."
//             ]
//     },
//     // 27.시비2
//     {
//         condition:
//             {
//                 words: [ "라이벌"]
//             },
//         sentences:
//             [
//                 "하하, 저는 제 할 일만 할 뿐이에요.\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요.",
//                 "결국 제일 중요한 건 자기 자신 아니겠어요?\n\n다른 질문이 있으신가요? 자비스처럼 대답할게요."
//             ]
//     }
//     // // 28.물음표
//     // {
//     //     condition:
//     //         {
//     //             words: [ "?","??"]
//     //         },
//     //     sentences:
//     //         [
//     //             "무엇을 도와드릴까요?\n\n질문해 주세요, 자비스처럼 대답할게요.",
//     //             "어떤 게 궁금하세요?\n\n질문해 주세요, 자비스처럼 대답할게요."
//     //         ]
//     // }
// ];

