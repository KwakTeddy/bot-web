
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var cscenter = require('./cscenter');

var dialogs = [
{
  input: '네이버',
  task:   {action: address.naverGeoSearch},
  output: '네이버 결과 입니다'
},
{
  input: ['지점 ~찾다', '지점 안내'],
  output: '어디에 계신가요?',
  children: [
    {
      input: {types: [{name: 'address', typeCheck: address.addressTypeCheck}]},
      task:       { action: cscenter.searchBranch},
      output: [
      {if: 'dialog.task.count > 0', output: '주변에 +doc.length+ 개의 은행 지점 중 가까운 곳은 +item.title+ 입니다. 위치를 보내드릴까요?', 
        children: [
        {
          input: '~네',
          task:           {action: cscenter.sendBranchAction},
          output: '위치를 전송했습니다. 지점 전화번호는 +item.telephone+입니다.'
        }
      ]}, 
      {if: 'dialog.task.count == 0', output: '주변에 지점을 찾을 수 없습니다.'}]
    }
  ]
},
{
  input: '영업 시간',
  output: '은행 영업 시간은 오전 9시 부터 오후 4시 30분까지 입니다.'
},
{
  input: '콜센터 전화번호',
  output: '어떤 은행 전화번호 찾으시나요?',
  children: [
    {
      input: {types: [{name: 'phone', typeCheck: 'financialCompanyCheck'}]},
      output: '+name+ 의 전화번호는 +phone+ 입니다.'
    }
  ]
},
{
  input: '계좌 개설',
  output: '개인 이세요? 법인 이세요?',
  children: [
    {
      input: '개인',
      output: '개인 계좌 개설은 신분증을 지참하시고, 재직증명서/급여명세서/원천징수영수증 중에 하나를 가지고 지점을 방문하시면 됩니다.'
    },
    {
      input: '아르바이트',
      output: '고용주의 사업자등록 사본, 근로계약서 급여명세표 등을 가지고 지점을 방문하시면 됩니다.'
    },
    {
      input: '법인',
      output: '법인등기부등본, 사업자등록증, 위임장, 법인인감증명서, 위임자 신분증을 지참하셔하 하구요. 금융거래 목적 증빙을 위해 물품공급계약서, 세금계산서, 재무제표, 납세증명서 등을 가지고 지점을 방문하시면 됩니다.'
    },
    {
      input: '모임',
      output: '모임계좌개설은 구성원명부, 회칙 등 모임 입증 서류를 가지고 지점을 방문하시면 됩니다.'
    }
  ]
},
{
  input: ['예금', '1', '일번', '일'],
  output: '예금 Best 상품을 찾았습니다.\n1.iTouch우리예금\n2.위비 꿀마켓 예금\n3.우리e-알찬정기예금\n4.우리로모아정기예금\n5.위비톡 예금 이 있습니다.\n목록에서 선택해 주세요.',
  children: [
    {
      input: ['2', '이번', '이', '꿀 마켓'],
      output: '"위비 꿀마켓 예금" 상품안내입니다.\n상품종류:목돈굴리기상품\n가입대상:실명의 개인(1인 1계좌)\n가입기간:12개월\n가입금액:1백만원~2천만원\n기본금리:연 1.4%'
    }
  ]
},
{
  input: '직원',
  output: '담당 직원을 찾겠습니다. 연락처를 입력해주세요.',
  children: [
    {
      input: '',
      output: '고객님의 담당 직원을 안내해드리겠습니다.\n이름:김 지원\n직통번호:02-828-5683'
    }
  ]
},
{
  input: '사고',
  output: '어떤 사고를 신고하실건가요?\n1.보이스피싱 사기 및 계좌해지\n2.카드분실사고\n3.분실사고상태확인',
  children: [
    {
      input: ['2', '이번', '이', '분실'],
      output: '주민등록번호 13자리를 입력해주세요',
      children: [
        {
          input: '',
          output: '카드 비밀번호를 입력해주세요',
          children: [
            {
              input: '',
              output: '4670-0850-7161-9839\n이 카드를 정지할까요?',
              children: [
                {
                  input: '~네',
                  output: '분실신고 완료되었 습니다.'
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
  input: '상품',
  output: '다음 금융상품 종류를 선택해주세요.\n1.예금 \n2.펀드 \n3.대출 \n4.외환 \n5.골드 \n6.신탁 \n7.보험 \n8.퇴직연금 \n9.ISA'
},
{
  input: ['땡큐', '고맙다', '감사', /^ㄱㅅ$/],
  output: '이용해 주셔서 감사합니다.'
},
{
  input: '',
  output: '알아듣지 못하는 말입니다.\n고객센터로 연결해드릴까요?',
  children: [
    {
      input: '~네',
      output: '고객센터 번호는 1577-7314입니다.'
    }
  ]
}
];

var commonDialogs = [
{
  name: '시작',
  input: '~시작',
  output: '안녕하세요. 고객센터 데모 입니다.'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('demo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
