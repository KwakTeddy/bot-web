
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var cscenter = require('./cscenter');

var dialogs = [
{
  input: ['지점 ~찾다', '지점 안내'],
  output: [
  {if: '\'금융회사있는경우\'', output: {call: '금융회사_위치조회'}}, {returnCall: '금융기관_입력', options: {returnDialog: '금융회사_위치조회'}}]
},
{
  input: '영업 시간',
  output: [
  {if: '\'금융회사있는경우\'', output: {call: '영업시간_조회'}}, {returnCall: '금융기관_입력', options: {returnDialog: '영업시간_조회'}}]
},
{
  input: '콜센터 전화번호',
  output: [
  {if: '\'금융회사있는경우\'', output: {call: '영업시간_조회'}}, {returnCall: '금융기관_입력', options: {returnDialog: '콜센터_전화번호'}}]
},
{
  input: '계좌 개설 서류',
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
  input: false,
  output: '어떤 금융 기관을 알고 싶으신가요?', 
    children: [
    {
      input: '금융기관매칭',
      output: {ouput: 'XX 금융기관을 선택하셨습니다', return: 1}
    },
    {
      input: '',
      output: {repeat: 1, options: {prefix: '금융회사가 아닌 것 같아요.'}}
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
  name: '상담원',
  input: '상담원 연결',
  output: '네 상담원을 연결해 드리겠습니다'
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('moneybot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);

// TEST
var json = JSON.stringify(dialogs);
console.log(json);
var fs = require('fs');
fs.writeFile(require('path').resolve("public/js") + "/dialog.json", json, function(err) {
if(err) { return console.log(err); }
console.log("dialog.json was saved!"); });
