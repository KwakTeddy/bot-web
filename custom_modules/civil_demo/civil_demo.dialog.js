
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var civil_demo = require('./civil_demo');

var dialogs = [
{
  input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw:true}], regexp: /~주민센터/},
  output: {callChild: '위치찾기'}
},
{
  input: '테스트',
  output: '+address.시군구명+'
},
{
  name: '위치찾기',
  input: ['~센터', '~어디', false],
  output: '현재 계신 지역을 말씀해주세요.', 
    children: [
    {
      input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}]},
      output: [
      {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?', 
        children: [
      {
        input: '~네',
        output: {call: '주민센터정보'}
      },
      {
        input: {if: 'true'},
        output: {up: 1}
      }
      ]}, 
      {if: 'Array.isArray(context.dialog.address)', output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#', 
        children: [
        {
          input: {types: [{name: 'address', listName: 'address', typeCheck: 'listTypeCheck'}]},
          output: {call: '서비스센터정보'}
        },
        {
          input: {if: 'true'},
          output: {up: 1}
        }
      ]}]
    },
    {
      input: {if: 'true'},
      output: {repeat: 1, options: {output: '지역을 찾을 수 없습니다. 동명을 말씀해주세요.'}}
    }
  ]
},
{
  name: '주민등록표등본',
  input: '~등본',
  output: '주민등록등(초)본은 가까운 주민센터 또는 인터넷에서 발급 받으실 수 있습니다. \n구비서류는 \n1. 주민등록증 등의 신분증\n2. 주민등록표 열람 또는 등,초본 교부신청 위임장 \n3. 정당한 이해관계를 입증할 수 있는 서류\n입니다. \n민원24 인터넷 링크: www.minwon.go.kr', 
    children: [
    {
      input: ['~네', '~어디'],
      output: {call: '위치찾기'}
    },
    {
      input: '~금액',
      output: {call: '금액정보'}
    },
    {
      input: '~걸리다',
      output: {call: '발급시간'}
    },
    {
      input: '~영업',
      output: {call: '시간체크'}
    }
  ]
},
{
  name: '전입신고',
  input: '~전입',
  output: '전입신고는 가까운 주민센터 또는 인터넷에서 신청/처리하실 수 있습니다. \n구비서류는\n1.주민등록증\n입니다.\n민원24 인터넷 링크: www.minwon.go.kr', 
    children: [
  {
    input: ['~어디', '~네'],
    output: {call: '위치찾기'}
  },
  {
    input: '~금액',
    output: {call: '금액정보'}
  },
  {
    input: '~걸리다',
    output: {call: '발급시간'}
  },
  {
    input: '~영업',
    output: {call: '시간체크'}
  }
  ]
},
{
  name: '금액정보',
  input: [false, '~금액'],
  output: '주민등록등(초)본은 인터넷 발급 시 무료, 주민센터 방문시 400원의 민원발급 수수료가 부가됩니다.'
},
{
  name: '발급시간',
  input: [false, '~걸리다'],
  output: '주민등록등(초)본은 발급 신청 시 즉시 처리되어 근무시간 내 3시간 안에 발급이 완료됩니다.'
},
{
  name: '주민센터정보',
  input: false,
  task:   civil_demo.searchCenterTask,
  output: '가장 가까운 주민센터는 +_doc.address+ 주민센터입니다.', 
    children: [
  {
    input: '~등본',
    output: {call: '주민등록표등본'}
  },
  {
    input: '~전입',
    output: {call: '전입신고'}
  },
  {
    input: '~영업',
    output: {call: '시간체크'}
  },
  {
    input: '~마무리',
    output: {call: '마무리'}
  }
  ]
},
{
  name: '시간체크',
  input: [false, '~영업'],
  output: '주민센터 평일 업무시간은 오전 9시 부터 오후 6시까지이며, 토요일, 일요일 및 공휴일에는 열지 않습니다.', 
    children: [
  {
    input: '~등본',
    output: {call: '주민등록표등본'}
  },
  {
    input: '~ 어디',
    output: {call: '위치찾기'}
  },
  {
    input: '~마무리',
    output: {call: '마무리'}
  }
  ]
},
{
  name: '마무리',
  input: '~마무리',
  output: '이용해주셔서 감사합니다. 안녕히 가세요.'
},
{
  input: '안녕',
  output: '안녕하세요. 무엇을 도와드릴까요?'
}
];

var commonDialogs = [
{
  name: '시작',
  input: '시작',
  output: '안녕하세요. 민원24 고객 응답 서비스 데모입니다. 무엇을 도와드릴까요?'
},
{
  name: '답변없음',
  input: '',
  output: '알아듣지 못했습니다'
}
];


var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('civil_demo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
