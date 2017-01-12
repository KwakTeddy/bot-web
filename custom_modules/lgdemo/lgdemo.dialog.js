
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var lgdemo = require('./lgdemo');

var dialogs = [
{
  input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}], regexp: /~서비스센터/},
  output: {callChild: '위치찾기'}
},
{
  name: '위치찾기',
  input: '~서비스센터',
  output: '현재 계신 지역을 말씀해 주세요.', 
    children: [
    {
      input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}]},
      output: [
      {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?', 
        children: [
        {
          input: '~네',
          output: {call: '서비스센터정보'}
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
  name: '서비스센터정보',
  input: false,
  task:   lgdemo.searchCenterTask,
  output: '가장 가까운 서비스센터는 +item.0.svc_center_name+ +item.0.distance+km 입니다.\n인근의 다른 서비스센터로 +item.1.svc_center_name+ +item.1.distance+km 가 있습니다.\n어디로 안내해 드릴까요?', 
    children: [
    {
      input: {types: [{name: 'center', listName: 'item', field: 'svc_center_name', typeCheck: 'listTypeCheck'}]},
      task:       {action: function(task, context, callback) {context.user.center = context.dialog.center;callback(task, context);}},
      output: {output: '+center.svc_center_name+\n주소: +center.address3+\n전화번호: +center.phone+', return : 1}
    },
    {
      input: {if: 'true'},
      output: {repeat: 1, options: {output: '목록에서 선택해주세요.\n'}}
    }
  ]
},
{
  name: '시간체크',
  input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}], regexp: /~영업/},
  task:   {action: lgdemo.checkTime},
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '시간체크'}}}, 
  {if: 'context.dialog.check == true', output: '죄송합니다. 영업 시간이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.'}, 
  {if: 'context.dialog.check == false', output: '네 서비스 받으실 수 있는 시간 입니다.'}, 
  {if: 'context.dialog.check == \'re\'', output: '오후 / 오전을 붙여서 이야기 해주세요.\n예시: 오후 2시 영업해?, 14시 영업해?'}]
},
{
  name: '날짜체크',
  input: {types: [{name: 'date', typeCheck: 'dateTypeCheck', raw: true}], regexp: /~영업/},
  task:   {action: lgdemo.checkDate},
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '날짜체크'}}}, 
  {if: 'context.dialog.check == true', output: '죄송합니다. 영업일이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.'}, 
  {if: 'context.dialog.check == false', output: '네 영업일입니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.'}]
},
{
  name: '토요일영업',
  input: ['~월요일', '~화요일', '~수요일', '~목요일', '~금요일', '~토요일'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '토요일영업'}}}, '네 영업일입니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.']
},
{
  name: '공휴일영업',
  input: ['~공휴일', '일요일'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '공휴일영업'}}}, '죄송합니다. 영업일이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.']
},
{
  name: '영업시간',
  input: '~영업 ~시간',
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '영업시간'}}}, '해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.']
},
{
  name: '방문경로',
  input: ['어떻다 찾다', '어떻다 ~가다'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '방문경로'}}}, 
  {output: '어떻게 방문하실 계획인가요?\n 1. 지하철\n 2. 버스\n 3. 자가용 \n4. 경로안내', 
    children: [
    {
      input: ['1', '지하철'],
      output: '+center.lms_subway+'
    },
    {
      input: ['2', '버스'],
      output: '+center.lms_bus+'
    },
    {
      input: ['3', '자가용'],
      output: '+center.owner+'
    },
    {
      input: ['4', '경로'],
      output: '경로안내입니다'
    }
  ]}]
},
{
  name: '수리가능제품',
  input: '~수리 ~가능',
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '수리가능제품'}}}, '+center.product+']
},
{
  name: '전화번호안내',
  input: '~번호',
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '전화번호안내'}}}, '+center.svc_center_name+ 전화번호입니다.\n +center.phone+']
},
{
  name: '답변없음',
  input: '',
  output: '알아듣지 못하는 말입니다.\n고객센터로 연결해드릴까요?',
  children: [
   {
     input: '~네',
     output: '고객센터 번호는 1577-7314입니다.'
   },
   {
     input: '~아니요',
     output: '이용해주셔서 감사합니다.'
   }
  ]
}
];

var commonDialogs = [
{
  name: '시작',
  input: '~시작',
  task:   {action: 'startAction'},
  output: '안녕하세요. LG전자 고객센터 데모 입니다.'
},
{
  input: '이전',
  output: {up:1}
},
{
  input: '전페이지',
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  input: '다음페이지',
  output: {repeat: 1, options: {page: 'next'}}
},
{
  input: '콜센터',
  output: '고객센터 번호는 1577-7314입니다.'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('lgdemo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
