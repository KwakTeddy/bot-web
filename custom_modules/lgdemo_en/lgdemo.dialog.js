
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var cscenter = require('./cscenter');
var lgdemo = require('./lgdemo');

var dialogs = [
{
  name: '서비스센터찾기',
  input: '~서비스센터 ~찾다',
  output: [{if: lgdemo.locationExists, output: {call: '서비스센터정보'}}, {output: {call: '위치찾기'}}]
},
{
  input: {types: [{name: 'address', typeCheck: address.addressTypeCheck, raw: true}], regexp: /~서비스센터/},
  output: {callChild: '위치찾기'}
},
{
  input: '다른 ~서비스센터',
  output: {call: '위치찾기'}
},
{
  name: '위치찾기',
  input: false,
  output: '현재 계신 지역을 말씀해 주세요.',
  children: [
    {
      input: {types: [{name: 'address', typeCheck: address.addressTypeCheck, raw: true}]},
      output: {if: '!Array.isArray(context.user.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?'},
      children: [
        {
          input: '네',
          output: {call: '서비스센터정보'}
        },
        {
          input: {if: 'true'},
          output: {up: 1}
        }
      ]
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
      output: {output: '+center.svc_center_name+\n주소: +center.address3+\n전화번호: +center.phone+', return : 1},
      children: [
        {
          input: '~영업 시간',
          output: {call: '영업시간'}
        },
        {
          input: '어떻다 찾다',
          output: {call: '방문경로'}
        },
        {
          input: '수리 가능',
          output: {call: '수리가능제품'}
        },
        {
          input: '전화 번호',
          output: {call: '전화번호안내'}
        }
      ]
    },
    {
      input: {if: 'true'},
      output: {repeat: 1, options: {output: '목록에서 선택해주세요.\n'}}
    }
  ]
},
{
  name: '영업시간',
  input: '~영업 시간',
  output: [{if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '영업시간'}}}, '해당 서비스 센터의 영업시간은\n평일 +center.winter_week+ \n토요일 +center.winter_sat+ 입니다']
},
{
  input: {types: [lgdemo.timeDateType], regexp: /영업/},
  task:   {action: lgdemo.checkTime},
  output: [
  {if: 'context.dialog.check == true', output: '죄송합니다. \n근무 시간이 아닙니다. \n근무시간은 평일 오전 9시부터 오후 6시까지, 토요일 오전 9시부터 오후 1시까지 입니다.'}, 
  {if: 'context.dialog.check == false', output: '네 서비스 받으실 수 있는 시간 입니다.'}]
},
{
  name: '방문경로',
  input: '어떻다 찾다',
  output: [{if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '방문경로'}}}, '어떻게 방문하실 계획인가요?\n 1. 지하철\n 2. 버스\n 3. 자가용 \n4. 경로안내'],
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
  ]
},
{
  name: '수리가능제품',
  input: '수리 가능',
  output: [{if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '수리가능제품'}}}, '+center.product+']
},
{
  name: '전화번호안내',
  input: '전화 번호',
  output: [{if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '전화번호안내'}}}, '센터 전화번호입니다.\n +center.phone+, +center.phone2+']
},
{
  name: 'c',
  input: '<',
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  name: 'c',
  input: '',
  output: ''
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
     input: {if: 'true'},
     output: {repeat: 1}
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
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('lgdemo_en');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
