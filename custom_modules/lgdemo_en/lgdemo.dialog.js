
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var lgdemo = require('./lgdemo');

var dialogs = [
{
  id: 2,
  name: '위치찾기',
  input: '~center',
  output: 'Please tell me the region you are in', 
    children: [
    {
      id: 0,
      input: {types: [{name: 'address', typeCheck: address.usaTypeCheck, raw: true}]},
      output: {call: '서비스센터정보'}
    },
    {
      id: 1,
      input: {if: 'true'},
      output: {up: 1}
    }
  ]
},
{
  id: 5,
  name: '서비스센터정보',
  input: false,
  task:   lgdemo.searchUsaCenterTask,
  output: 'The closest service center is +item.0.SVC_CENTER_NAME+ +item.0.distance+km away.\nOther nearby service center is +item.1.SVC_CENTER_NAME+ +item.1.distance+km away.\nWhich service center do you prefer?', 
    children: [
    {
      id: 3,
      input: {types: [{name: 'center', listName: 'item', field: 'SVC_CENTER_NAME', typeCheck: 'listTypeCheck'}]},
      task:       {action: function(task, context, callback) {context.user.center = context.dialog.center;callback(task, context);}},
      output: {output: '+center.SVC_CENTER_NAME+\nAddress: +center.STREET+, +center.CITY+, +center.ASC_PROVINCE_NAME+\nTel: +center.TEL_NO+', return : 1}
    },
    {
      id: 4,
      input: {if: 'true'},
      output: {repeat: 1, options: {output: 'Choose from the list.\n'}}
    }
  ]
},
{
  id: 6,
  name: '토요일영업',
  input: ['Monday ~open', 'Monday ~work', 'Tuesday ~open', 'Tuesday ~work', 'Wednesday ~open', 'Wednesday ~work', 'Thursday ~open', 'Thursday ~work', 'Fridady ~open', 'Friday ~work', 'Saturday ~open', 'Saturday ~work'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '토요일영업'}}}, 'Service center is open on that day.\nWorking hours of the service center is \n 09:00 to 18:00 on weekdays,\n 09:00 to 13:00 on Saturdays and,\n closed on holidays.']
},
{
  id: 7,
  name: '공휴일영업',
  input: ['~공휴일 ~영업', '~holiday ~work', '~holiday ~open'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '공휴일영업'}}}, 'Sorry. Service center is closed on that day\nWorking hours of the service center is \n 09:00 to 18:00 on weekdays,\n 09:00 to 13:00 on Saturdays and,\n closed on holidays.']
},
{
  id: 8,
  name: '영업시간',
  input: ['~when ~work', '~opening ~hours', '~what ~time', '~work ~hours', '~open', '~when ~open'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '영업시간'}}}, 'Working hours of the service center is \n 09:00 to 18:00 on weekdays,\n 09:00 to 13:00 on Saturdays and,\n closed on holidays.']
},
{
  id: 9,
  name: '방문경로',
  input: ['어떻다 찾다', '어떻다 ~가다', 'How find', 'How ~get', 'How ~go'],
  task:   lgdemo.gimothee,
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '방문경로'}}}, 'Navigation \n Map link: +_doc.link+']
},
{
  id: 10,
  name: '전화번호안내',
  input: ['~tel', '~phone', '~telephone'],
  output: [
  {if: lgdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '전화번호안내'}}}, 'Phone number is +center.SVC_CENTER_NAME+ \n +center.TEL_NO+']
},
{
  id: 13,
  name: '답변없음',
  input: '',
  output: 'I do not understand you.\nWould you like to connect to service call center?',
  children: [
   {
     id: 11,
     input: '~yes',
     output: 'Service center number is 800 243-0000.'
   },
   {
     id: 12,
     input: '~no',
     output: 'Okay. please call me anytime.'
   }
  ]
}
];

var commonDialogs = [
{
  id: 0,
  name: '시작',
  input: '~시작',
  output: 'Hello. This is LG Electronics Customer Service Demo. How can I help you?'
},
{
  id: 1,
  input: 'previous',
  output: {up:1}
},
{
  id: 2,
  input: 'previous page',
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  id: 3,
  input: 'next page',
  output: {repeat: 1, options: {page: 'next'}}
},
{
  id: 4,
  input: 'call center',
  output: 'Service center number is 800 243-0000.'
},
{
  id: 5,
  input: 'Thanks',
  output: 'Your welcome, thanks.'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('lgdemo_en');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
