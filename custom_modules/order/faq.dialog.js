


var dialogs = [
{
  input: ['배달 비', '배달 비용'],
<<<<<<< HEAD
  output: '얌얌이는 배달비를 따로 받지 않아요 고객님의 주문을 도와드릴 뿐!'
},
{
  input: '현장 결제',
  output: '현장결제이는 현장카드결제와 현장현금결제가 있답니다\n배달원분께 직접 결제하시면 돼요'
=======
  output: '얌얌이는 배달비를 따로 받지 않아요. 고객님의 주문을 도와드리기만 한답니다~'
},
{
  input: '현장 결제',
  output: '현장결제는 현장카드결제와 현장현금결제가 있답니다\n배달원분께 직접 결제하시면 돼요!'
>>>>>>> ad9f45ab53e3d4667f0804c5ba38dab9c52ceff8
},
{
  input: '결제',
  output: '현장결제와 전화주문이 가능해요\n얌얌이가 바로결제도 준비중이니까 기대해주세요~'
},
{
<<<<<<< HEAD
  input: ['즐겨찾기', '찜'],
=======
  input: '즐겨찾기',
>>>>>>> ad9f45ab53e3d4667f0804c5ba38dab9c52ceff8
  output: '자주 드시는 음식은 얌얌이가 항상 체크하고 있답니다 \n\'히스토리\'를 입력해주세요~'
},
{
  input: '주문 취소',
  output: '\'주문취소\'라고 입력해주세요\n조리가 시작된 경우 취소가 어려워요 ㅠ'
},
{
  input: '주문 추가',
  output: '\'주문취소\' 후에 다시 주문해주세요~'
},
{
  input: ['포인트', '마일리지'],
  output: '아직 얌얌포인트제는 적용되지 않았답니다 ㅠ 조금만 더 기다려주세요'
},
{
  input: '회원 가입',
  output: '회원가입은 하지 않으셔도 돼요!\n배달받으실 주소와 연락처만 남겨주세요~'
},
{
  input: '주소 입력',
  output: '\'주소변경\'을 입력해주세요'
},
{
  input: ['핸드폰 인증', '연락처 인증'],
  output: '핸드폰 인증은 시작시에 한번만 하면 되고 변경을 원할 시에는 \'연락처 변경\'을 입력해주세요'
},
{
  input: '약관',
  output: '약관이에요 아래 링크를 누르시면 자세한 내용을 볼 수 있어요~\n이용약관:link1\n개인정보3자제공동의:link2\n개인정보수집및이용동의:link3'
},
{
  input: '페이스북',
  output: '페이스북 메신저로도 이용 가능해요!\nYAMYAM을 팔로우 해주세요~'
},
{
<<<<<<< HEAD
  input: ['인공 지능', '봇'],
  output: '전 머니브레인에서 만든 인공지능 챗봇 (Chatbot) 얌얌이에요'
=======
  input: ['인공 지능', '로봇', '챗봇', '챗 봇'],
  output: '전 머니브레인에서 만든 인공지능 챗봇 (Chatbot)'
},
{
  input: ['고객센터', '센터'],
  output: '1577-7314로 연락해주세요~'
>>>>>>> ad9f45ab53e3d4667f0804c5ba38dab9c52ceff8
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('order');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
