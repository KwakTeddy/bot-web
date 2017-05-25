
var path = require('path');
var intent = require(path.resolve('modules/bot/engine/nlu/intent.js'));
var dialogsType = {
  name: 'typeDoc',
  typeCheck: global._context.typeChecks['dialogTypeCheck'],
  limit: 10,
  matchRate: 0.4,
  matchCount: 4,
  exclude: ['하다', '이다'],
  mongo: {
    model: 'lgfaq',
    queryFields: ['input'],
    fields: 'conceptId input output' ,
    taskFields: ['conceptId', 'input', 'output', 'matchCount', 'matchRate'],
    minMatch: 1
  }
};

var dialogs = [
{
  id: 'default0',
  filename: 'default',
  input: {intent: '약냉'},
  task:   {
      name: '테스크1',
      entities: [
          {type: '가전제품', required: true}
      ]
  },
  output: '인텐트 분석 성공'
},
{
  id: 'default1',
  filename: 'default',
  input: {types: [dialogsType]},
  task:   {
        action: function(task, context, callback) {
          if(Array.isArray(task.typeDoc)) {
            if(task.typeDoc.length > 1) task._output = task.typeDoc[0].output;
            else task._output = task.typeDoc[0].output;
            console.log(task.typeDoc[0].inputRaw + ', ' + task.typeDoc[0].input + '(' + task.typeDoc[0].matchCount + ', ' + task.typeDoc[0].matchRate + ')');
          } else {
            task._output = task.typeDoc.output;
            console.log(task.typeDoc.inputRaw + ', ' + task.typeDoc.input + '(' + task.typeDoc.matchCount + ', ' + task.typeDoc.matchRate + ')');
          }
          if(Array.isArray(task._output)) {
            task._output = task._output[Math.floor(Math.random() * task._output.length)];
          }
          callback(task, context);
        }
      },
  output: '+_output+'
},
{
  id: 'default2',
  filename: 'default',
  input: 'items',
  task:   {
      action: function(task, context, callback) {
          task.result = {
              items: [
                  {
                      text: '박근혜 대통령 측이 이달 24일로 예정된 탄핵심판의 최종 변론기일을 3월 초로 연기해달라고 헌법재판소에 공식 요청한 것으로 확인됐다',
                      imageUrl: '/images/news_image.jpg',
                      buttons: [
                          {text: '상세보기'},
                      ]
                  },
                  {
                      text: '박근혜 대통령 측이 이달 24일로 예정된 탄핵심판의 최종 변론기일을 3월 초로 연기해달라고 헌법재판소에 공식 요청한 것으로 확인됐다',
                      imageUrl: '/images/news_image.jpg',
                      buttons: [
                          {text: '상세보기', url: 'http://www.google.com'},
                      ]
                  },
                  {
                      text: '박근혜 대통령 측이 이달 24일로 예정된 탄핵심판의 최종 변론기일을 3월 초로 연기해달라고 헌법재판소에 공식 요청한 것으로 확인됐다',
                      imageUrl: '/images/news_image.jpg',
                      buttons: [
                          {text: '상세보기', url: 'http://www.google.com'},
                      ]
                  }
              ],
              smartReply: ['버튼1', '버튼2', '버튼3']
          };
          callback(task, context);
      }
  },
  output: 'items 결과'
},
{
  id: 'default3',
  filename: 'default',
  input: ['안녕하세요', '안녕하다', '안녕', '안뇽', '안늉'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/1-1인사.mp4'} ];
          task.result = {actions: result};
          console.log(JSON.stringify(task.result));
          callback(task, context);
      }
  },
  output: '안녕하세요 반갑습니다'
},
{
  id: 'default4',
  filename: 'default',
  input: ['이름 뭐', '이름 뭔', '이름 뭔가', '이름 어떻다'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/1-2이름.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '저는 장세영이라고 합니다'
},
{
  id: 'default5',
  filename: 'default',
  input: ['어디 살 다', '살다 곳 어디', '살다 곳', '어디 살다 있다', '어디 살'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/1-3사는곳.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '저는 경기도에 살고 있어요'
},
{
  id: 'default6',
  filename: 'default',
  input: ['직업 뭐', '어떻다 일 하다 있다', '하다 일 뭐', '어떻다 일 해', '무슨 일 해', '직업 말 하다', '무슨 일 직업'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/1-4직업.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '저는 머니브레인이라는 회사를 운영하고 있습니다'
},
{
  id: 'default7',
  filename: 'default',
  input: ['나이 몇 살', '나이 몇 살이', '나이 어떻다 돼다', '나이', '너 몇 살이'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/1-5나이.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '그건 비밀이에요'
},
{
  id: 'default8',
  filename: 'default',
  input: ['오늘 날씨 어떻다', '오늘 날씨 말 하다', '오늘 날씨 말 하다', '날씨 알다', '날씨 얘기 하다', '날씨'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/2-1날씨.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '오늘 날씨는 영상 6도입니다.'
},
{
  id: 'default9',
  filename: 'default',
  input: ['가장 가깝다 은행지점 어디', '가장 가깝다 은행 어디 야', '가장 가깝다 은행', '여기 가장 가깝다 은행 어디', '가깝다 은행 말 하다', '근처 가장 가깝다 은행 말 하다', '은행'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/2-2은행지점.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '사당역에 은행입니다.'
},
{
  id: 'default10',
  filename: 'default',
  input: ['나 고민 있다', '고민'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/3-1고민.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '어떤 고민이에요?'
},
{
  id: 'default11',
  filename: 'default',
  input: ['애기들 유치원 잘 안 가다', '아이 안', '유치원 안', '유치 안'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/3-2아이들.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '애기들은 원래 다 그래요 너무 고민하지 마세요'
},
{
  id: 'default12',
  filename: 'default',
  input: ['특히 유치원 옮기다 더 그렇다', '옮기다'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/3-2아이들적응.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '애들도 적응하는데 시간이 필요하죠 좀 기다려보면 잘 해결 될 거에요'
},
{
  id: 'default13',
  filename: 'default',
  input: ['작년 어디 여행 가다', '여행'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/4-1작년.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '작년 여름에 괌에 다녀 왔어요'
},
{
  id: 'default14',
  filename: 'default',
  input: ['중학교 기억 남다', '중학'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/4-3농구.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '특별한 것은 없고 영석이라는 친구와 농구를 자주 했던 게 기억이 나요'
},
{
  id: 'default15',
  filename: 'default',
  input: ['왼손 들다 말다 오른손 들다', '왼손 들다 오른손 들다'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/5-2오른손.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '오른손 들었습니다'
},
{
  id: 'default16',
  filename: 'default',
  input: ['오른손 들다 말다 왼손 들다', '오른손 들다 왼손 들다'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/5-2왼손.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '왼손 들었습니다'
},
{
  id: 'default17',
  filename: 'default',
  input: ['왼손 들다', '웬', '왼손', '맨손'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/5-1왼손.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '왼손 들었습니다'
},
{
  id: 'default18',
  filename: 'default',
  input: ['오른손 들다', '오늘', '오른손'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/5-2오른손.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '오른손 들었습니다'
},
{
  id: 'default19',
  filename: 'default',
  input: ['물구나무 서다', '물구나무서기', '물구나무', '물구'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/5-3물구나무.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '물구나무 섰습니다'
},
{
  id: 'default20',
  filename: 'default',
  input: '이기다',
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/5-3물구나무.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '감사합니다.'
},
{
  id: 'default21',
  filename: 'default',
  input: ['수고 하다 다음 보다', '다음'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'play-video-full', url: 'http://localhost:8443/videos/6-1감사합니다.mp4'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '알았어요 다음에 뵙겠습니다'
},
{
  id: 'default22',
  filename: 'default',
  input: ['홀로그램', '홀로'],
  task:   {
      action: function(task, context, callback) {
          var result = [{action: 'holo-start'} ];
          task.result = {actions: result};
          callback(task, context);
      }
  },
  output: '홀로그램 시작'
},
{
  id: 'default23',
  filename: 'default',
  input: '안녕',
  output: '안녕하세요'
}
];

var commonDialogs = [
{
  id: 'defaultcommon0',
  filename: 'defaultcommon',
  input: '시작',
  output: '안녕하세요 머니브레인 개발용 옐로아이디입니다. 개발용이니 참고해주세요.'
},
{
  id: 'defaultcommon1',
  filename: 'defaultcommon',
  name: '답변없음',
  input: '',
  output: '알아듣지 못했습니다'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
