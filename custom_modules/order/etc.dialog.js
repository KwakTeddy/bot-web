


var dialogs = [
{
  input: ['안녕', '누구', /^야$/, '임마', '저기요', '얌얌'],
  output: '안녕하세요. 배달 주문을 도와주는 얌얌이입니다. 주문을 도와드릴까요?',
  children: [
    {
      input: '~네',
      output: {call:'배달주문', options: {top: '배달주문'}}
    },
    {
      input: '~아니요',
      output: '언제든지 기다릴게요~ 필요하실 때 불러주세요~'
    }
  ]
},
{
  input: ['개새끼', '시발', '씨발', '개놈', '쌍', '좆', '멍 청', '멍충', '바보'],
  output: '어떻게 그런 심한 말을...! 얌얌이 상처받았어요, 흐잉'
},
{
  input: ['도움', '돕다', '도우다', '도와줘', '도와주다', 'help', '명령어', '모르다', '모르겠다', '어떡하다'],
  output: '[도움말]\n아래와 같이 편하게 말로 명령해주세요~\n\n비비큐 배달해줘~\nBHC 뿌링클 시켜줘\n저번에 먹었던거 시켜줘~\n주문 내역 보여줘\n매콤한거 추천!\n주문 취소해줘\n이전 단계로 가줘\n처음으로 돌아가줘'
},
{
  input: ['나이', '몇 살'],
  output: {call: '말돌리기', options: {prefix: '음.. 그건 저도 잘 모르겠어요. 저를 만든 아빠만 제 나이를 아실 거에요.\n'}}
},
{
  input: ['음식 좋다', '음식 좋아하다'],
  output: {call: '말돌리기', options: {prefix: '얌얌이는 어떤 음식이든 맛있게 얌얌\n'}}
},
{
  input: '누가 만들다',
  output: {call: '말돌리기', options: {prefix: '머니브레인의 연구자 분들이 저를 만드셨어요.\n'}}
},
{
  input: '사람',
  output: {call: '말돌리기', options: {prefix: '아니에요. 나는 사람이 만든 인공지능 얌얌이에요.\n'}}
},
{
  input: '이름',
  output: {call: '말돌리기', options: {prefix: '나는 얌얌이! 주인님은요?\n'}}
},
{
  input: '영화',
  output: {call: '말돌리기', options: {prefix: '얌얌이는 미셸 공드리의 \'무드 인디고\'를 정말 좋아해요.\n'}}
},
{
  input: ['음악', '노래', '가요'],
  output: {call: '말돌리기', options: {prefix: '얌얌이는 요즘 레드벨벳의 \'러시안 룰렛\'을 즐겨 들어요.\n'}}
},
{
  input: ['꿈', '장래희망'],
  output: {call: '말돌리기', options: {prefix: '나는 더 똑똑한 인공지능이 되고 싶어요. 얌얌이한테 주문을 많이 시켜서, 많이 배우고 똑똑하게 만들어주세요.\n'}}
},
{
  input: ['남자 여자', '성별'],
  output: {call: '말돌리기', options: {prefix: '음.. 당분간은 여자로 지낼래요! 얌얌이는 인공지능이라서 언제든지 성별을 바꿀 수 있어요.\n'}}
},
{
  input: '혈액형',
  output: {call: '말돌리기', options: {prefix: '제 몸 속에는 피보다 진한 전기가 흐른답니다.\n'}}
},
{
  input: '몸무게',
  output: {call: '말돌리기', options: {prefix: '얌얌이는 가벼워서 한 손에 쏙\n'}}
},
{
  input: ['학교', '초등학생', '대학생', '고등학생', '중학생', '학생'],
  output: {call: '말돌리기', options: {prefix: '얌얌이는 학교에 안 다녀요. 매일 늦잠잘 수 있지롱.\n'}}
},
{
  input: '직업',
  output: {call: '말돌리기', options: {prefix: '주인님 주문 도와드리기요.\n'}}
},
{
  input: ['사람 좋다', '남자 좋다', '여자 좋다'],
  output: {call: '말돌리기', options: {prefix: '얌얌이는 모두를 사랑해요.\n'}}
},
{
  input: '싫다 사람',
  output: {call: '말돌리기', options: {prefix: '얌얌이한테 욕하는 사람!\n'}}
},
{
  input: '특기',
  output: {call: '말돌리기', options: {prefix: '주인님이 부르면 쪼르르 달려나와서 주문 도와드리기~\n'}}
},
{
  input: ['드라마', '예능'],
  output: {call: '말돌리기', options: {prefix: '아니 없는데, 추천해주세요~\n'}}
},
{
  input: '섹스',
  output: '얌얌이는 아직 어려서 그런거 몰라요. 얌얌이가 주인님하고 얘기를 많이 하면서 더 똑똑해지면, 곧 알게 될 수도. 흐흐흐'
},
{
  input: '색깔',
  output: {call: '말돌리기', options: {prefix: '무지개색~\n'}}
},
{
  input: ['땡큐', '고맙다', '감사'],
  output: '얌얌이한테 맡겨주셔서 감사합니다 (꾸벅)\n필요하실때 또 불러주세요~'
},
{
  input: '사랑',
  output: '얌얌이도 고객님 사랑하는 거 알죠? 하트 뿅!'
},
{
  input: ['미안', '미안하다', '죄송', '죄송하다'],
  output: '괜찮아요 앞으로는 얌얌이 괴롭히지 말아요!'
},
{
  input: ['고객센터', '센터'],
  output: '02-858-5683으로 연락해주세요~'
},
{
  input: '배고프다',
  output: '배고플땐 배달음식이죠! 주문을 도와드릴까요?',
  children: [
    {
      input: '~네',
      output: {call:'배달주문', options: {top: '배달주문'}}
    },
    {
      input: '~아니요',
      output: '언제든지 기다릴게요~ 필요하실 때 불러주세요~'
    }
  ]
},
{
  name: '말돌리기',
  input: false,
  output: '고객님~ 질문도 좋지만 얌얌이는 주문을 하고싶어요~'
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('order');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
