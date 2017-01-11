
function startAction(task, context, callback) {
    context.botUser.location = null;
    callback(task, context);
}
function locationNotExists(dialog, context, callback) {
  console.log('locationNotExists:' + context.botUser.location);
  if(context.botUser.location == undefined) callback(true);
  else callback(false);
}
function locationExists(dialog, context, callback) {
  console.log('locationExists:' + context.botUser.location);
  if(context.botUser.location != undefined) {
    console.log(context.dialog.location.lat);
    callback(true);
  }
  else callback(false);
}
function setLocation(task, context, callback) {
  context.botUser.location = {lat: 1.0, lng: 1.0};
  callback(task, context);
}

var dialogs = [
{
  name: '서비스센터찾기',
  input: '~서비스센터 ~찾다',
  output: {call: '위치찾기', options: {prefix: '먼저 서비스 센터를 찾고 말씀드리겠습니다.\n'}}
},
{
  name: '위치찾기',
  input: false,
  output: [{if: locationExists, output: {call: '서비스센터정보'}}, '현재 계신 위치를 말씀해 주세요.'],
  children: [
    {
      input: '주소 type',
      task:       {action: setLocation},
      output: {call: '서비스센터정보', return: 1}
    },
    {
      input: '동 type',
      task:       {action: setLocation},
      output: {call: '서비스센터정보', return: 1}
    },
    {
      input: '건물정보 type',
      task:       {action: setLocation},
      output: {call: '서비스센터정보', return: 1}
    },
    {
      input: '',
      output: '위치 정보를 찾을 수 없습니다. 주소나 법정동명 또는 주변 건물을 알려주세요'
    }
  ]
},
{
  name: '서비스센터정보',
  input: false,
  task:   '서비스센터조회 task',
  output: '서비스센터 정보입니다.',
  children: [
    {
      input: '근처 ~서비스센터',
      output: '근처의 다른 서비스센터 입니다'
    },
    {
      input: '~영업 ~시간',
      output: {call: '영업시간'}
    },
    {
      input: '어떻게 찾다',
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
  name: '영업시간',
  input: '~영업 ~시간',
  output: [{if: locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '영업시간'}}}, '해당 서비스 센터의 영업시간은 +center.startTime+ 부터 +center.endTime+ 입니다']
},
{
  name: '방문경로',
  input: '~어떻게 ~가다',
  output: [{if: locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '방문경로'}}}, '어떻게 방문하실 계획인가요? 지하철, 버스, 자가용'],
  children: [
    {
      input: '~대중교통',
      task:       '대중교통경로조회 Task',
      output: '대중교통으로 방문하는 방법을 안내해 드리겠습니다. 링크'
    },
    {
      input: '~자가용',
      task:       '네이게이션조회 Task',
      output: '자가용 방문경로를 안내해 드리겠습니다. 링크'
    }
  ]
},
{
  name: '수리가능제품',
  input: '제품 type',
  output: [{if: locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '수리가능제품'}}}, '해당 매장에서 수리 가능한 제품입니다.']
},
{
  name: '전화번호안내',
  input: [],
  output: []
},
{
  name: '답변없음',
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
  task:   {action: startAction},
  output: '안녕하세요. LG전자 고객센터 데모 입니다.'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('lgdemo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
