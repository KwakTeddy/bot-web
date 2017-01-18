
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var civil_demo = require('./civil_demo');

var dialogs = [
{
  input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw:true}], regexp: /~주민센터/},
  output: {callChild: '위치찾기'}
},
{
  name: '위치찾기',
  input: '~주민센터',
  output: '현재 계신 지역을 말씀해주세요.', 
    children: [
    {
      input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}]},
      output: 
      {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?'}
    },
    {
      input: {if: 'true'},
      output: {repeat: 1, options: {output: '지역을 찾을 수 없습니다. 동명을 말씀해주세요.'}}
    }
  ]
},
{
  input: '~주민',
  output: '현재 계신 지역을 말씀해주세요.', 
    children: [
    {
      input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}]},
      output: 
      {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?'}
    }
  ]
},
{
  input: '안녕',
  output: '안녕하세요'
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


var _bot = require(require('path').resolve("config/lib/bot")).getBot('civil_demo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
