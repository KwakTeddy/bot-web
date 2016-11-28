
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var cscenter = require('./cscenter');

var dialogs = [
{
  input: '지점 ~찾다',
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
  input: '대출',
  output: '대출 안내해 드리겠습니다. url: https://spot.wooribank.com/pot/Dream?withyou=ln'
},
{
  input: '예금',
  output: '예금 안내해 드리겠습니다. url: https://spot.wooribank.com/pot/Dream?withyou=PODEP0001'
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
  input: '',
  output: '알아듣지 못하는 말입니다.'
}
];

var commonDialogs = [
{
  name: '시작',
  input: '~시작',
  output: '안녕하세요. 고객센터 데모 입니다.'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('demo2');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
