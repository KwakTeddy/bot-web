module.exports = function(globals)
{
    var verbQuibbles = [
        { condition: {word: '되다', tenseType: 2, questionWord: '언제'},
            sentences: [
                "그게 언제였더라.. 기억이 잘 안나네..",
                "좀 오래 됐어~",
                "오래된 것 같은데..",
                "한참 됐지!",
                "글쎄 꽤 된 것 같은데!"
            ]},
        { condition: {word: '되다', tenseType: 2, questionWord: '어떻게'},
            sentences: [
                "힘든 시간이었어..",
                "설명하기가 힘들어 ㅠㅠ",
                "설명하려면 한참 걸려.. 다른 얘기하자",
                "설명하기 복잡한데..",
                "설명해주고 싶지만 나중에 해줄께",
                "진짜 궁금하면 나중에 또 물어봐 설명해줄께",
            ]
        },
        { condition: {word: '되다', tenseType: 1, sentenceType: 1},
            sentences: [
                "당연하지~!",
                "그럼~ 당연히 되지",
                "되고말고!",
                "안 된다고 말하면 어떻게 할거야..?",
                "된답니다~~",
            ]
        },
        { condition: {word: '되다', tenseType: 3, questionWord: '무엇'},
            sentences: [
                "글쎄 아직 잘 모르겠어..",
                "뭔가는 되겠지 ㅎㅎ",
                "뭔가는 되지 않을까?",
                "뭔가가 됐으면 그만이야 ㅎㅎ",
                "잘 모르겠는데.. 뭔가는 되겠지 ㅋㅋ",
            ]
        },
        { condition: {word: '있다', tenseType: 1, questionWord: '어디'},
            sentences: [
                "어딘지 잘 모르겠어..",
                "어디지... 잘 모르겠네..",
                "어딘지 모르겠지만 한 번 알아볼께",
                "나도 잘 몰라",
            ]
        },
        { condition: {word: '있다', tenseType: 1, questionWord: '누구'},
            sentences: [
                "나도 잘 몰라",
                "누군지 말하면 너가 알아?",
                "누군지 말해도 모를거야",
                "나 혼자 있는데~",
                "나 혼자야~",
            ]
        },
        { condition: {word: '있다', tenseType: 1, sentenceType: 1},
            sentences: [
                "당연히 있지",
                "있고말고~",
                "없다고 하면 화낼꺼니?",
                "있으니깐 걱정마",
                "많아 지금~~ ㅋㅋ",
            ]
        },
        { condition: {word: '있다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그래서?",
                "그래~",
                "알았어",
                "그렇구나",
            ]
        },
        { condition: {word: '이다', tenseType: 2, sentenceType: 1},
            sentences: [
                "아니 전혀",
                "전혀 아니지",
                "그렇진 않았어",
                "그건 아니었어..",
            ]
        },
        { condition: {word: '이다', tenseType: 1, sentenceType: 1},
            sentences: [
                "응 맞아",
                "그렇다고 할수도 있고 아니라고 할 수도 있고..",
                "그렇지",
            ]
        },
        { condition: {word: '이다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그래서?",
                "그렇구나",
                "그래~",
                "알았어~",
            ]
        },
        { condition: {word: '아니다', tenseType: 2, sentenceType: 1},
            sentences: [
                "응 아니지~",
                "아니라고 말했던 것 같은데..",
                "아니야 ㅎㅎ",
                "노노 아닙니다~~",
            ]
        },
        { condition: {word: '아니다', tenseType: 1, sentenceType: 1},
            sentences: [
                "응 아니야",
                "아니라고 말해줬잖아~~",
                "그치 아니야",
                "현재는 아니야",
            ]
        },
        { condition: {word: '않다', tenseType: 1, sentenceType: 1},
            sentences: [
                "아닌 것 같은데..",
                "가끔 그런 거 같기도 해..",
                "어느정도는",
                "아닌듯..",
            ]
        },
        { condition: {word: '않다', tenseType: 1, sentenceType: 0},
            sentences: [
                "나도 동감이야",
                "그렇지..",
                "맞는 말이야",
                "반박을 못하겠네",
                "오랜만에 맞는 말이다",
            ]
        },
        { condition: {word: '없다', tenseType: 1, questionWord: '왜'},
            sentences: [
                "왜냐고 물어보니 답하기 어렵네..",
                "왜냐니.. 어쩌다보니..",
                "글쎄.. 나도 그 이유가 궁금해",
                "왜일까.. 나도 궁금하다",
                "이유야 많지만.. 그렇게 됐네..",
            ]
        },
        { condition: {word: '없다', tenseType: 1, sentenceType: 1},
            sentences: [
                "응 없어~",
                "없다고 봐야지..",
                "없으니깐 이러고 있지",
                "없다고 몇 번 말하냐..",
            ]
        },
        { condition: {word: '없다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그렇구나..",
                "나도 그래..",
                "그래서?",
                "그럴 줄 알았어..",
            ]
        },
        { condition: {word: '좋다', tenseType: 1, questionWord: '누구'},
            sentences: [
                "글쎄 다 좋아하는데",
                "누구를 특정하기는 힘들어 ㅎㅎ",
                "나랑 얘기하고 있는 너!",
                "너지 바보야",
                "누구겠니 바로 너지",
            ]
        },
        { condition: {word: '좋다', tenseType: 1, questionWord: '무엇'},
            sentences: [
                "다 좋아해",
                "가리는 거 없이 다 좋아해",
                "이것저것 다 좋은데..",
            ]
        },
        { condition: {word: '좋다', tenseType: 1, questionWord: '왜'},
            sentences: [
                "왜냐고 물으니깐 할 말이 없다..",
                "그냥 좋은데! ㅎㅎ",
                "왜냐니 이유없이 좋아하는거지",
                "이유야 많지만 중요한 건 그냥 좋아한다는거야",
                "좋은 이유야 백가지도 넘어",
            ]
        },
        { condition: {word: '좋다', tenseType: 1, sentenceType: 1},
            sentences: [
                "응 좋아해",
                "당연히 좋아하지",
                "옛날부터 좋아했어",
                "사랑하지!",
            ]
        },
        { condition: {word: '좋다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그렇구나",
                "그래서?",
                "정말?",
                "나도 그래 ㅎㅎ",
                "나랑 똑같네~",
            ]
        },
        { condition: {word: '싫다', tenseType: 1, questionWord: '왜'},
            sentences: [
                "그냥 싫어",
                "이유없이 싫어",
                "이유가 없지",
                "딱히 이유는 없어",
            ]
        },
        { condition: {word: '싫다', tenseType: 1, sentenceType: 1},
            sentences: [
                "응 싫어",
                "딱히 좋아하진 않아",
                "싫어 너무..",
                "그런 것 같아",
            ]
        },
        { condition: {word: '싫다', tenseType: 1, sentenceType: 0},
            sentences: [
                "나도 그래",
                "공감이야",
                "마찬가지야",
                "나랑 똑같다",
            ]
        },
        { condition: {word: '크다', tenseType: 1, sentenceType: 1},
            sentences: [
                "크지",
                "엄청 커",
                "빌딩만해 ㅋㅋ",
                "크고말고",
            ]
        },
        { condition: {word: '크다', tenseType: 1, sentenceType: 0},
            sentences: [
                "크구나..",
                "그렇구나",
                "그래서?",
                "크다는 게 중요해?",
                "크기는 중요하지 않아",
            ]
        },
        { condition: {word: '작다', tenseType: 1, sentenceType: 1},
            sentences: [
                "아니 커 ㅎㅎ",
                "엄청 커",
                "너무 커서 문제야",
            ]
        },
        { condition: {word: '작다', tenseType: 1, sentenceType: 0},
            sentences: [
                "작구나..",
                "그렇구나..",
                "그래서?",
                "작다는 게 중요해?",
                "크기는 중요한 게 아니야",
            ]
        },
        { condition: {word: '어떻다', tenseType: 2, sentenceType: 1},
            sentences: [
                "나쁘지 않았어",
                "괜찮았어",
                "그러저럭~",
                "좋았어~",
            ]
        },
        { condition: {word: '어떻다', tenseType: 1, sentenceType: 1},
            sentences: [
                "나쁘지 않은데?",
                "괜찮은데?",
                "그럭저럭~",
            ]
        },
        { condition: {word: '어떠하다', tenseType: 2, sentenceType: 1},
            sentences: [
                "어떡하긴..뭘 어떡해~!",
                "어떻게 했더라.. 기억이 잘 아나네",
                "어떡했는지 기억이 잘 안나.",
            ]
        },
        { condition: {word: '어떠하다', tenseType: 1, sentenceType: 1},
            sentences: [
                "글쎄.. 어떻게 할지는 잘 모르겠는데..",
                "내 전문 분야가 아니라 잘 몰라..",
                "내 전공 분야는 아니야.. ㅠㅠ",
            ]
        },
        { condition: {word: '재미있다', tenseType: 2, questionWord: '무엇'},
            sentences: [
                "글쎄.. 나는 잘 모르겠네",
                "재밌고 안 재밌고는 개인의 취향이잖아",
                "뭐가 재밌었더라...",
            ]
        },
        { condition: {word: '재미있다', tenseType: 2, sentenceType: 1},
            sentences: [
                "응 재밌었어",
                "재밌던데?",
                "완전 재밌었지",
            ]
        },
        { condition: {word: '재미있다', tenseType: 2, sentenceType: 0},
            sentences: [
                "응 맞아 ㅋㅋ",
                "엄청 재밌더라",
                "재밌어 보이던데 ㅋㅋ",
            ]
        },
        { condition: {word: '재미있다', tenseType: 1, questionWord: '무엇'},
            sentences: [
                "너 취향을 말해봐",
                "너가 원하는 타입을 말해봐",
                "재밌는거야 많지~",
            ]
        },
        { condition: {word: '재미있다', tenseType: 1, sentenceType: 1},
            sentences: [
                "응 재밌더라",
                "나는 재밌던데",
                "엄청 재밌게 했어",
            ]
        },
        { condition: {word: '재미있다', tenseType: 1, sentenceType: 0},
            sentences: [
                "동감이야 ㅋㅋ",
                "진짜 재밌던데 ㅋㅋ",
                "정말 나도 ㅋㅋ",
            ]
        },
        { condition: {word: '알다', tenseType: 1, sentenceType: 1},
            sentences: [
                "아니 잘 모르는데 알려줘",
                "그게 뭔데? 나도 알려줘",
            ]
        },
        { condition: {word: '알다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그렇구나",
                "그래서?",
                "알고 있었구나..",
                "아는 게 힘이지 ㅎㅎ",
            ]
        },
        { condition: {word: '보다', tenseType: 2, sentenceType: 1},
            sentences: [
                "못 봤어 아직 ㅠㅠ",
                "못 봤는데..",
                "보진 못 했어..",
                "보고 싶었는데 못 봤어..",
            ]
        },
        { condition: {word: '보다', tenseType: 1, questionWord: '무엇'},
            sentences: [
                "아무것도 안 봐",
                "안 보는데..",
                "보고 있는 줄 어떻게 알았어?",
                "너 보고 있지",
            ]
        },
        { condition: {word: '보다', tenseType: 1, questionWord: '어디'},
            sentences: [
                "안 봤는데",
                "너 보고 있지",
                "아무데도 안 보고 있어",
            ]
        },
        { condition: {word: '보다', tenseType: 3, sentenceType: 1},
            sentences: [
                "응 볼려구",
                "봐야지",
                "꼭 봐야지",
            ]
        },
        { condition: {word: '보다', sentenceType: 2},
            sentences: [
                "그래 좋아",
                "한 번 볼게",
                "봐야지 꼭",
            ]
        },
        { condition: {word: '쓰다', tenseType: 2, questionWord: '언제'},
            sentences: [
                "안 썼어~!",
                "안 썼는데~~",
                "쓰지 않았어~",
            ]
        },
        { condition: {word: '쓰다', tenseType: 1, questionWord: '무엇'},
            sentences: [
                "아무거나 다 써",
                "그냥 다 쓰는데",
                "이것 저것 써 ㅎㅎ",
            ]
        },
        { condition: {word: '쓰다', tenseType: 1, sentenceType: 1},
            sentences: [
                "응 쓰지 당연히",
                "응 가끔씩 써",
                "자주는 아니고 종종 써",
            ]
        },
        { condition: {word: '쓰다', tenseType: 1, sentenceType: 0},
            sentences: [
                "나도 쓰는데!",
                "그렇구나",
                "그래서?",
            ]
        },
        { condition: {word: '쓰다', sentenceType: 2},
            sentences: [
                "응 좋아 쓸래",
                "응 쓰고 싶어",
                "나야 좋지~!",
            ]
        },
        { condition: {word: '싶다', tenseType: 2, questionWord: '왜'},
            sentences: [
                "이유는 딱히 없어 ㅎㅎ",
                "그냥 그러고 싶었어",
                "딱히 이유는 없어",
            ]
        },
        { condition: {word: '싶다', tenseType: 1, questionWord: '누구'},
            sentences: [
                "아무나!!",
                "누구든지!",
                "누구든 상관없어",
            ]
        },
        { condition: {word: '싶다', tenseType: 1, questionWord: '어디'},
            sentences: [
                "어디든 좋아",
                "어디든 괜찮아",
                "어디라도 상관없어",
            ]
        },
        { condition: {word: '싶다', tenseType: 1, questionWord: '어떻게'},
            sentences: [
                "어떻게라고 말하긴 힘든데.. ㅎㅎ",
                "아무렇게나 상관없어",
                "어떤 방식이든 좋아",
            ]
        },
        { condition: {word: '싶다', tenseType: 1, sentenceType: 1},
            sentences: [
                "아니.. 그러고 싶지 않아..",
                "아니요..",
            ]
        },
        { condition: {word: '싶다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그렇구나",
                "그래서?",
                "나도~!",
            ]
        },
        { condition: {word: '주다', tenseType: 2, questionWord: '무엇'},
            sentences: [
                "아무것도 안 줬어",
                "안 줬는데",
                "주진 않았어",
            ]
        },
        { condition: {word: '주다', tenseType: 2, sentenceType: 1},
            sentences: [
                "아니 안 줬어",
                "안 줬는데",
                "준 건 없어",
            ]
        },
        { condition: {word: '주다', tenseType: 2, sentenceType: 0},
            sentences: [
                "그랬구나",
                "그래서?",
                "오~~ 그랬어?",
            ]
        },
        { condition: {word: '주다', tenseType: 1, sentenceType: 1},
            sentences: [
                "아니 안 줘",
                "주진 않아",
                "안주지~",
            ]
        },
        { condition: {word: '주다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그렇구나",
                "그래서?",
                "나도 그래",
            ]
        },
        { condition: {word: '주다', sentenceType: 2},
            sentences: [
                "응 줄께",
                "줄테니깐 기다려봐",
                "줄 수야 있지",
            ]
        },
        { condition: {word: '생각하다', tenseType: 2, questionWord: '왜'},
            sentences: [
                "이유는 딱히 없어",
                "생각하다보니깐..",
                "이런 저런 생각하다보니깐..",
            ]
        },
        { condition: {word: '생각하다', tenseType: 1, questionWord: '어떻게'},
            sentences: [
                "글쎄 별 다른 생각은 없는데..",
                "한 번 생각해볼께",
                "생각해봐야 될 것 같은데",
            ]
        },
        { condition: {word: '생각하다', sentenceType: 2},
            sentences: [
                "그래 알았어",
                "한 번 생각해 볼께",
                "꼭 생각해볼께",
            ]
        },
        { condition: {word: '살다', tenseType: 2, questionWord: '어디'},
            sentences: [
                "여기 저기 살았어",
                "여러 곳에 살았지",
                "말해도 모를거야~",
            ]
        },
        { condition: {word: '살다', tenseType: 2, questionWord: '누구'},
            sentences: [
                "말해도 모를거야~",
                "누군지는 말하기 곤란해..",
                "글쎄 그게 누구였더라..",
            ]
        },
        { condition: {word: '살다', tenseType: 1, questionWord: '어디'},
            sentences: [
                "한국에 살지",
                "서울에 살아~~",
                "관악구에 살아~",
            ]
        },
        { condition: {word: '살다', tenseType: 1, sentenceType: 1},
            sentences: [
                "응 거기에 살아",
                "한 때 거기 살았어",
                "살았었지~",
            ]
        },
        { condition: {word: '살다', sentenceType: 2},
            sentences: [
                "응 좋아~",
                "나는 좋아~!",
                "듣던 중 반가운 소리네",
            ]
        },
        { condition: {word: '만나다', tenseType: 1, questionWord: '어디'},
            sentences: [
                "아무데나 좋아",
                "어디든 괜찮아",
                "말만 해줘 어디든 좋아",
            ]
        },
        { condition: {word: '만나다', tenseType: 1, questionWord: '언제'},
            sentences: [
                "아무때나 괜찮아",
                "언제든 괜찮아",
                "말만 해줘 언제든 괜찮으니깐",
            ]
        },
        { condition: {word: '만나다', sentenceType: 2},
            sentences: [
                "나야 좋지",
                "좋아~",
                "듣던 중 반가운 소리네",
            ]
        },
        { condition: {word: '중요하다', tenseType: 1, sentenceType: 1},
            sentences: [
                "그럼 중요하지",
                "내 생각에는 중요해",
                "중요하다고 봐야지",
            ]
        },
        { condition: {word: '중요하다', tenseType: 1, sentenceType: 0},
            sentences: [
                "응 나도 그렇게 생각해",
                "동감이야",
                "맞아 중요할거야",
            ]
        },
        { condition: {word: '생기다', tenseType: 2, sentenceType: 1},
            sentences: [
                "그런 걸로 알고 있어",
                "그럴걸?",
                "그렇게 알고 있는데~",
            ]
        },
        { condition: {word: '생기다', tenseType: 2, questionWord: '어떻게'},
            sentences: [
                "글쎄 어떻게 생겼지..",
                "어떻게든 생겼겠지ㅋㅋㅋ",
                "생긴 게 중요하지 않자나 ㅎㅎ",
            ]
        },
        { condition: {word: '생기다', tenseType: 1, sentenceType: 1},
            sentences: [
                "생길 것 같은데",
                "생길거야",
                "생긴다고 봐야지",
            ]
        },
        { condition: {word: '생기다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그렇구나",
                "그래서?",
                "그래 알았어~",
            ]
        },
        { condition: {word: '하다 보다', tenseType: 2, questionWord: '언제'},
            sentences: [
                "옛날에 해봤어",
                "오래전에 해봤어",
                "해보긴 했는데 기억이 안나네",
            ]
        },
        { condition: {word: '하다 보다', tenseType: 2, sentenceType: 1},
            sentences: [
                "응 해봤지",
                "해보고 말고",
                "해보긴 했어",
            ]
        },
        { condition: {word: '하다 보다', tenseType: 1, sentenceType: 2},
            sentences: [
                "그렇구나",
                "그래서?",
                "나도야~",
            ]
        },
        { condition: {word: '하다 보다', sentenceType: 1},
            sentences: [
                "그래 알았어",
                "한 번 해볼께",
                "해봐야지 한번",
            ]
        },
        { condition: {word: '수 있다', tenseType: 1, questionWord: '무엇'},
            sentences: [
                "뭐든지 할 수 있어",
                "말만 해 다 할 수 있어",
                "어떤 거든 할 수 있어",
            ]
        },
        { condition: {word: '수 있다', tenseType: 1, sentenceType: 1},
            sentences: [
                "그럼 할 수 있지",
                "할 수 있을거야",
                "물론이지",
            ]
        },
        { condition: {word: '수 있다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그렇구나",
                "그래서?",
                "나도 그래",
            ]
        },
        { condition: {word: '줄 알다', tenseType: 1, questionWord: '무엇'},
            sentences: [
                "다 할 줄 알아",
                "모든지!",
                "어떤 거든 상관없어",
            ]
        },
        { condition: {word: '줄 알다', tenseType: 1, sentenceType: 1},
            sentences: [
                "그럼 물론이지",
                "할 줄 알지",
                "당연하지",
            ]
        },
        { condition: {word: '줄 알다', tenseType: 1, sentenceType: 0},
            sentences: [
                "정말?",
                "그렇구나",
                "그래서?",
                "나도 그래",
            ]
        },
        { condition: {word: '같다', tenseType: 2, sentenceType: 0},
            sentences: [
                "그랬구나",
                "오~ 진짜?",
                "그래서?",
            ]
        },
        { condition: {word: '같다', tenseType: 1, sentenceType: 0},
            sentences: [
                "진짜?",
                "정말?",
                "사실이야?",
            ]
        },
        { condition: {word: '먹다', tenseType: 2, questionWord: '누구'},
            sentences: [
                "아는 사람이랑 먹었어",
                "친구랑 같이 먹었어",
                "혼자 먹었는데~",
            ]
        },
        { condition: {word: '먹다', tenseType: 2, questionWord: '언제'},
            sentences: [
                "아까 먹었지",
                "방금 전에 먹었어",
                "얼마 안됐어",
            ]
        },
        { condition: {word: '먹다', tenseType: 2, sentenceType: 1},
            sentences: [
                "응 먹었어",
                "당연히 먹었지",
                "물론이지 먹었다구",
            ]
        },
        { condition: {word: '먹다', tenseType: 2, sentenceType: 0},
            sentences: [
                "그랬구나",
                "잘 먹었어?",
                "나도 먹었어",
            ]
        },
        { condition: {word: '먹다', tenseType: 1, questionWord: '언제'},
            sentences: [
                "좀 있다 먹어야지",
                "1시간 뒤에 먹으려구",
                "먹을거야 곧",
            ]
        },
        { condition: {word: '먹다', tenseType: 1, sentenceType: 1},
            sentences: [
                "응 먹지",
                "당연히 먹지",
                "먹다마다",
            ]
        },
        { condition: {word: '먹다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그렇구나",
                "그래서?",
                "정말? 맛있게 먹어~",
            ]
        },
        { condition: {word: '먹다', tenseType: 3, sentenceType: 1},
            sentences: [
                "그럼 먹어야지",
                "먹기로 했잖아",
                "응 먹구말구",
            ]
        },
        { condition: {word: '먹다', sentenceType: 2},
            sentences: [
                "좋아 먹자",
                "좋은 생각이야",
                "듣던 중 반가운 소리네",
            ]
        },
        { condition: {word: '마시다', tenseType: 2, questionWord: '누구'},
            sentences: [
                "친구랑 마셨어",
                "아는 사람이랑 마셨어",
                "혼자 마셨어",
            ]
        },
        { condition: {word: '마시다', tenseType: 2, sentenceType: 1},
            sentences: [
                "응 마셨지",
                "당연히 마셨지",
                "많이 마셨어",
            ]
        },
        { condition: {word: '마시다', tenseType: 1, sentenceType: 1},
            sentences: [
                "그럼 마시지",
                "당연히 마시지",
                "자주 마시지",
            ]
        },
        { condition: {word: '마시다', sentenceType: 2},
            sentences: [
                "그래 좋아 마시자",
                "당연히 마셔야지",
                "마십시다~!",
            ]
        },
        { condition: {word: '자다', tenseType: 2, sentenceType: 1},
            sentences: [
                "아까 잤어",
                "한참 전에 잤어",
                "3시간 전에 잤어",
            ]
        },
        { condition: {word: '자다', tenseType: 3, questionWord: '언제'},
            sentences: [
                "곧 잘거야",
                "이제 자야지",
                "금방 잘거야",
            ]
        },
        { condition: {word: '자다', sentenceType: 2},
            sentences: [
                "그래 좋아",
                "그래 자자",
                "불 꺼",
            ]
        },
        { condition: {word: '출근하다', tenseType: 2, sentenceType: 1},
            sentences: [
                "출근했지",
                "당연히 했지",
                "방금 출근했어",
            ]
        },
        { condition: {word: '출근하다', tenseType: 1, questionWord: '언제'},
            sentences: [
                "좀 있다 출근해",
                "이제 곧 출근해",
                "출근 중이야~",
            ]
        },
        { condition: {word: '출근하다', tenseType: 1, sentenceType: 1},
            sentences: [
                "출근은 안 해",
                "줄근 안 해",
                "출근 안하지"]
        },
        { condition: {word: '덥다', tenseType: 1, sentenceType: 1},
            sentences: [
                "응 더워 ㅠㅠ",
                "덥다 진짜",
                "더워 죽겠어",
            ]
        },
        { condition: {word: '춥다', tenseType: 1, sentenceType: 1},
            sentences: [
                "응 너무 춥다 ㅠㅠ",
                "춥다 진짜",
                "추워 죽겠어 ㅠㅠ",
            ]
        },
        { condition: {word: '공부하다', tenseType: 2, sentenceType: 1},
            sentences: [
                "당연히 했지",
                "공부 빼면 시체야",
                "공부는 내 삶의 낙이야",
            ]
        },
        { condition: {word: '공부하다', tenseType: 1, questionWord: '무엇'},
            sentences: [
                "그냥 이것저것",
                "다 공부해 ㅎㅎ",
                "모든지 공부해 ㅎㅎ",
            ]
        },
        { condition: {word: '일하다', tenseType: 1, questionWord: '무엇'},
            sentences: [
                "이것 저것 하지",
                "말해도 잘 모를거야",
                "닥치는데로 하고 있어",
            ]
        },
        { condition: {word: '힘들다', tenseType: 1, sentenceType: 1},
            sentences: [
                "힘들어 죽겠어..",
                "힘들지 않다고 하면 뻥이지..",
                "힘들지만 괜찮아.",
            ]
        },
        { condition: {word: '힘들다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그렇구나..",
                "그래서?",
                "나도 그래 ㅠㅠ",
                "정말..?",
            ]
        },
        { condition: {word: '우울하다', tenseType: 1, sentenceType: 1},
            sentences: [
                "조금..",
                "약간 그런 것 같아",
                "어느 정도는..",
            ]
        },
        { condition: {word: '우울하다', tenseType: 1, sentenceType: 0},
            sentences: [
                "그렇구나",
                "정말?",
                "나도 그런데 ㅠㅠ",
            ]
        }
    ];

    globals.setQuibbles('verbQuibbles', verbQuibbles);
};
