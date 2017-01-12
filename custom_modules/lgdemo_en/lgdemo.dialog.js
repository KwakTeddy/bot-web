
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var lgdemo = require('./lgdemo');

var dialogs = [
{
  name: '서비스센터찾기',
  input: ['~서비스센터', '~서비스센터 ~어디', '~서비스센터 ~찾다', '~service center find', '~service center where', 'where ~service center', 'find ~service center'],
  output: [
  {if: lgdemo.locationExists, output: {call: '서비스센터정보'}}, {output: {call: '위치찾기'}}]
},
{
  input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}], regexp: /~서비스센터/},
  output: {callChild: '위치찾기'}
},
{
  input: ['여기 말고', '다른 ~서비스센터'],
  output: {call: '위치찾기'}
},
{
  name: '위치찾기',
  input: false,
  output: 'Please tell me the region you are in', 
    children: [
    {
      input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}]},
      output: [
      {if: '!Array.isArray(context.dialog.address)', output: 'Is +address.시군구명+ +address.법정읍면동명+ correct?', 
        children: [
        {
          input: ['~네', '~yes'],
          output: {call: '서비스센터정보'}
        },
        {
          input: {if: 'true'},
          output: {up: 1}
        }
      ]}, 
      {if: 'Array.isArray(context.dialog.address)', output: 'Which of the following regions are you at??\n#address#+index+. +지번주소+ +시군구용건물명+\n#', 
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
      output: {repeat: 1, options: {output: 'District not found. Please tell me the region you are in'}}
    }
  ]
},
{
  name: '서비스센터정보',
  input: false,
  task:   lgdemo.searchCenterTask,
  output: 'The closest service center is +item.0.svc_center_name+ +item.0.distance+km away.\nOther nearby service center is +item.1.svc_center_name+ +item.1.distance+km away.\nWhich service center do you prefer?', 
    children: [
    {
      input: {types: [{name: 'center', listName: 'item', field: 'svc_center_name', typeCheck: 'listTypeCheck'}]},
      task:       {action: function(task, context, callback) {context.user.center = context.dialog.center;callback(task, context);}},
      output: {output: '+center.svc_center_name+\nAddress: +center.address3+\nPhone number: +center.phone+', return : 1}, 
        children: [
        {
          input: ['~영업 ~시간', '~언제 ~영업', '~when ~open', '~when ~work', '~opening ~hours', '~what ~time'],
          output: {call: '영업시간'}
        },
        {
          input: ['어떻다 찾다', '어떻다 ~가다', '~how ~go', '~how ~get'],
          output: {call: '방문경로'}
        },
        {
          input: ['~수리 ~가능', '~뭐 ~하다', '~repair ~possible', '~what ~do', '~what ~repair'],
          output: {call: '수리가능제품'}
        },
        {
          input: '~번호',
          output: {call: '전화번호안내'}
        }
      ]
    },
    {
      input: {if: 'true'},
      output: {repeat: 1, options: {output: 'Choose from the list.\n'}}
    }
  ]
},
{
  name: '시간체크',
  input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}], regexp: /~영업/},
  task:   {action: lgdemo.checkTime},
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '시간체크'}}}, 
  {if: 'context.dialog.check == true', output: 'Sorry. It is not working hours.\nWorking hours are\n +center.winter_week_open+ to +center.winter_week_close+ in weekdays \n +center.winter_sat_open+to +center.winter_sat_close+on Saturdays,\n Closed at holidays.'}, 
  {if: 'context.dialog.check == false', output: 'Yes. Service center is open.'}, 
  {if: 'context.dialog.check == \'re\'', output: '오후 / 오전을 붙여서 이야기 해주세요.\n예시: 오후 2시 영업해?, 14시 영업해?'}]
},
{
  name: '날짜체크',
  input: {types: [{name: 'date', typeCheck: 'dateTypeCheck', raw: true}], regexp: /~영업/},
  task:   {action: lgdemo.checkDate},
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '날짜체크'}}}, 
  {if: 'context.dialog.check == true', output: 'Sorry. Service center is closed on that day. \nWorking days of that service center is\n +center.winter_week_open+ to +center.winter_week_close+ on weekdays,\n  +center.winter_sat_open+to +center.winter_sat_close+ on Saturdays,\n Closed at holidays.'}, 
  {if: 'context.dialog.check == false', output: 'Service center is open on that day. \nWorking hours of the service center is \n +center.winter_week_open+to +center.winter_week_close+on weekdays,\n  +center.winter_sat_open+to +center.winter_sat_close+on Saturdays and,\n closed on holidays.'}]
},
{
  name: '토요일영업',
  input: ['월요일 ~영업', '화요일 ~영업', '수요일 ~영업', '목요일 ~영업', '금요일 ~영업', '토요일 ~영업', 'Monday ~open', 'Monday ~work', 'Tuesday ~open', 'Tuesday ~work', 'Wednesday ~open', 'Wednesday ~work', 'Thursday ~open', 'Thursday ~work', 'Fridady ~open', 'Friday ~work', 'Saturday ~open', 'Saturday ~work'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '토요일영업'}}}, 'Service center is open on that day.\nWorking hours of the service center is\n +center.winter_week_open+to +center.winter_week_close+ on weekdays,\n +center.winter_sat_open+ to +center.winter_sat_close+ on Saturdays,\n closed on holidays.']
},
{
  name: '공휴일영업',
  input: ['~공휴일 ~영업', '~holiday ~work', '~holiday ~open'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '공휴일영업'}}}, 'Sorry. Service center is closed on that day\nWorking hours of the service center is \n +center.winter_week_open+ to +center.winter_week_close+ on weekdays,\n +center.winter_sat_open+ to +center.winter_sat_close+ on Saturdays,\n closed on holidays.']
},
{
  name: '영업시간',
  input: ['~영업 ~시간', '~work ~hours', '~open', '~when ~open'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '영업시간'}}}, 'Working hours are\n+center.winter_week_open+ to +center.winter_week_close+ on weekdays,\n +center.winter_sat_open+ to +center.winter_sat_close+ on Saturdays,\n Closed at holidays.']
},
{
  name: '방문경로',
  input: ['어떻다 찾다', '어떻다 ~가다', 'How find', 'How ~get', 'How ~go'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '방문경로'}}}, 
  {output: 'How are you planning to visit?\n 1. Subday\n 2. Bus\n 3. Car \n4. Navigation', 
    children: [
    {
      input: ['1', 'Subway'],
      output: '+center.lms_subway+'
    },
    {
      input: ['2', 'Bus'],
      output: '+center.lms_bus+'
    },
    {
      input: ['3', 'Car'],
      output: '+center.owner+'
    },
    {
      input: ['4', 'Navigation'],
      task:       lgdemo.ang,
      output: 'Navigation \n Map link: +_doc.link_map+ \n Navigation link: +_doc.link_find+'
    }
  ]}]
},
{
  name: '수리가능제품',
  input: ['~수리 ~가능', '~what ~do', '~what ~repair'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '수리가능제품'}}}, '+center.product+']
},
{
  name: '전화번호안내',
  input: '~번호',
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '서비스센터찾기', options: {returnDialog: '전화번호안내'}}}, 'Phone number is +center.svc_center_name+ \n +center.phone+']
},
{
  name: '답변없음',
  input: '',
  output: 'I do not understand you.\nWould you like to connect to service center?',
  children: [
   {
     input: '~yes',
     output: 'Service center number is 1577-7314.'
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
  output: 'Hello. This is LG Electronics Customer Service Demo. How can I help you?'
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
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('lgdemo_en');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
