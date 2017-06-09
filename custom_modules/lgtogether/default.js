var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('lgtogether');


var listType = {
  name: "item",
  listName: "doc",
  field: 'title',
  typeCheck: "listTypeCheck"
};

var dateType = {
  "name": "date",
  "typeCheck": "dateTypeCheck",
  "raw": true,
  "context": true
};

bot.setType("listType", listType);
bot.setType("date", dateType);

// var refriweak = {
//   paramDefs: [
//     // {type: '가전제품', name: 'electronicsType', required: true, question: '냉장고 또는 에어컨을 선택해 주세요.'},
//     {type: '가전제품', name: 'electronicsType', required: true, questionDialog: '가전체크'},
//     {type: '냉장고종류', name: 'refType', required: true, question: '양문형, 일반형을 선택해 주세요.'}
//   ],
//   action: function (task,context,callback) {
//     context.dialog.doc = [{
//       title: '온도설정을 하지 않은 경우',
//       content: '냉장실 설정온도가 5도 또는 6도 일 경우 중이나 강 (3도 ~ 0도 사이)으로 설정해 주세요.\n냉장고 전면부의 냉장 온도 버튼으로 냉장실 온도를 조절합니다.'
//     },{
//       title: '주변에 열기구가 있는 경우',
//       content: '설치 장소가 직사광선을 직접 받거나 가스레인지 등 열기구가 가까이 있으면 냉동기능이 약해질 수 있습니다.\n여름철 냉장고 문을 자주 열어 내부 온도가 상승하는 경우 냉동실의 냉기가 약해질 수 있습니다.'
//     },{
//       title: '음식물이 냉기 출구를 가리고 있는 경우',
//       content: '선반에 보관한 음식이 많거나 냉장고 안쪽의 냉기가 나오는 입구를 막고 있으면 냉기 순환이 안되어 음식물이 녹을 수 있습니다.\n쉽게 녹을 수 있는 음식은 냉기가 나오는 입구 근처에 보관해 주세요.'
//     },{
//       title: '도어가 잘 닫혀있지 않은 경우',
//       content: '보관된 음식이 도어에 끼지 않게 해주시고 도어를 꼭 닫아 주세요.\n도어가 완전히 닫히지 않아 냉기가 새면 바깥의 따뜻한 공기가 안으로 유입되어 음식물이 녹을 수 있습니다.'
//     },{
//       title: '냉장고 주변이 통풍이 잘 안되는 경우',
//       content: '냉장고 주변이 통풍이 안 되는 환경에서는 냉동기능이 약해질 수 있어 통풍이 잘 되도록 적당한 간격을 주세요.'
//     },{
//       title: '도어를 자주 여닫는 경우',
//       content: '냉동실에 넣으신 음식의 양에 따라 냉각시키는데 필요한 시간은 다릅니다.\n뜨거운 음식은 식혀서 냉동실에 넣어주시고 여름철과 같이 주위 온도가 높거나 녹기 쉬운 음식이 많은 경우 도어를 자주 여닫지 마세요.'
//     },{
//       title: '냉장고 주위 온도가 5℃ 이하 혹은 43℃ 이상인 경우',
//       content: '냉장고 주위 온도가 5℃ 이상 43℃ 이하인 곳에 설치하세요.'
//     },{
//       title: '처음 전원을 연결한 경우',
//       content: '처음 전원을 연결하면 약 1~2시간 정도면 냉기가 나오지만 정상 온도까지는 음식 보관에 따라 2~3일 정도 걸릴 수 있습니다.'
//     }];
//     context.botUser.curcontext = 'refri';
//     callback(task,context);
//   }
// };
//
// bot.setTask('refriweak',refriweak);
//
// var refristrong = {
//   paramDefs: [
//     {type: '가전제품', name: 'electronicsType', required: true, questionDialog: '가전체크'},
//     {type: '냉장고종류', name: 'refType', required: true, question: '양문형, 일반형을 선택해 주세요.'}
//   ],
//   action: function (task,context,callback) {
//     context.dialog.doc = [{
//       title: '온도설정을 하지 않은 경우',
//       content: '냉장실 온도 설정이 강(0℃ 또는 1℃)으로 낮게 설정되어 있으면 음식물이 얼 수 있습니다.\n냉장실 온도 설정을 중이나 약(3℃ ~ 6℃)으로 설정해 주세요.\n냉장고 전면부의 냉장 온도 버튼으로 냉장실 온도를 조절합니다.'
//     },{
//       title: '수분이 많고 얼기 쉬운 식품을 냉장실 위쪽 선반이나 냉기가 나오는 입구 앞에 보관한 경우',
//       content: '수분이 많고 얼기 쉬운 식품(콩나물, 두부, 과일, 야채 등)은 냉장실 아래쪽 선반이나 야채실에 보관해 주시고 냉기가 나오는 입구는 피해서 보관해 주세요.\n특히, 계란은 얼어 깨질 수 있으니 병꽂이에 보관해 주세요.'
//     },{
//       title: '음식물이 냉기 출구를 가리고 있는 경우',
//       content: '선반에 보관한 음식이 많거나 냉장고 안쪽의 냉기가 나오는 입구를 막고 있으면 냉기 순환이 안되어 음식물이 녹을 수 있습니다.\n쉽게 녹을 수 있는 음식은 냉기가 나오는 입구 근처에 보관해 주세요.'
//     },{
//       title: '신선 맞춤실에 얼기 쉬운 음식을 보관한 경우',
//       content: '신선맞춤실이 있는 경우 냉장실 맨 아래 서랍은 “야채/과일” 또는 ”육류/생선” 으로 전환하여 사용할 수 있는데 야채/과일로 전환 후 사용하세요.\n모델에 따라 전환레버가 있는 모델도 있어 정확하게 야채/과일에 레버를 두세요. OPEN/CLOSE 인 경우 CLOSE로 전환해주세요.\n※ “야채/과일” 사용 시 바나나처럼 열대과일 등 후숙과일은 보관하지 말아 주세요\n※ “육류/생선” 사용 시 냉장실온도보다 더 차가워 야채/과일이 얼 수 있어요.'
//     },{
//       title: '냉장고 주변이 통풍이 잘 안되는 경우',
//       content: '냉장고 주변이 통풍이 안 되는 환경에서는 냉동기능이 약해질 수 있어 통풍이 잘 되도록 적당한 간격을 주세요.'
//     },{
//       title: '냉장고가 너무 추운 곳에 설치된 경우',
//       content: '주위온도가 5℃~43℃이내인 곳에 설치하세요.'
//     },{
//       title: '냉장실 천장의 온도센서에 음식물이 닿아 있는 경우',
//       content: '냉장실 천장에 있는 온도센서에 음식물(비닐류 등)이 닿아 있는 경우 온도 감지가 잘 안되어 과냉이 될 수 있으므로\n음식물(비닐류 등)이 천장(센서주변)에 닿지 않도록 정리해주세요.'
//     }];
//     context.botUser.curcontext = 'refri';
//     callback(task,context);
//   }
// };
//
// bot.setTask('refristrong',refristrong);

var checktorefri = {
  name: 'checktorefri',
  action: function (task,context,callback) {
    context.botUser.curcontext = 'refri';
    callback(task,context);
  }
};

bot.setTask('checktorefri',checktorefri);

var checktoair = {
  name: 'checktoair',
  action: function (task,context,callback) {
    context.botUser.curcontext = 'air';
    callback(task,context);
  }
};

bot.setTask('checktoair',checktoair);

var checktoair1 = {
  name: 'checktoair1',
  action: function (task,context,callback) {
    context.botUser.curcontext = 'air1';
    callback(task,context);
  }
};

bot.setTask('checktoair1',checktoair1);

var checktoair2 = {
  name: 'checktoair2',
  action: function (task,context,callback) {
    context.botUser.curcontext = 'air2';
    callback(task,context);
  }
};

bot.setTask('checktoair2',checktoair2);

var checkcontext = {
  name: 'checktoair2',
  action: function (task,context,callback) {
    console.log('--------------1---------------'+JSON.stringify(context.dialog.doc));
    callback(task,context);
  }
};

bot.setTask('checkcontext',checkcontext);

var start = {
  action: function (task,context,callback) {
    context.botUser.curcontext = null;
    callback(task,context);
  }
};

bot.setTask('start',start);

var airweak = {
  action: function (task,context,callback) {
    context.dialog.doc = [{
      title: '필터를 청소한 지 한달 이상 지난 경우',
      content: '에어컨의 필터에 먼지가 쌓여 있으면 날씨가 더워질수록 냉방 능력이 떨어집니다.\n필터는 주기적으로 청소해주세요.'
    },{
      title: '운전 선택은 냉방, 희망온도는 18도로 설정했나요.',
      content: '운전 선택 버튼을 눌러 냉방 모드로 선택해 주세요.\n제습 또는 인공지능으로 선택 시 냉방이 약하게 느껴질 수 있습니다.\n실내온도와 희망온도의 차이가 클수록 냉방능력이 올라가며 최저 18도까지 선택 가능합니다.'
    },{
      title: '실외기가 가동되지 않는 경우',
      content: '실외기 주변 장애물을 치워주시고 통풍이 잘되도록 관리해 주세요.\n실외기가 내부에 설치한 경우 폭염시에는 방충망까지 열어주세요.\n만약, 실외기가 가동되지 않는다면 점검이 필요합니다.'
    },{
      title: '뜨거운 햇볕으로 실외기가 과열된 경우',
      content: '갑자기 올라간 주변 기온으로 인해 흡입되는 공기의 온도가 상승하면 토출구에서 나오는 바람의 온도가 평소보다 덜 시원하게 느껴질 수 있습니다.\n※ 폭염시에는 에어컨 전원을 뽑고 실외기 윗부분에 물을 뿌려 열을 식혀 주세요.\n해결이 안된 경우에는 서비스 점검 받아 보시길 권장 드립니다.'
    },{
      title: '제품 용량에 비해 실내가 넓거나 출입문 근처에 설치되어 있는 경우',
      content: '용량이 맞지 않거나 냉기 손실이 많은 장소에 설치한 경우 날씨가 더워질 수록 토출구 근처만 시원하고 전체적인 실내온도는 떨어지지 않습니다.\n흡입온도와 토출온도가 8℃ 이상이면 제품은 정상입니다.\n(온도 측정방법은 흡입구에서 5㎝정도 거리 온도, 냉기토출구에서 5 ㎝정도 거리 온도를 각각 측정)'
    },{
      title: '처음 가동한 경우',
      content: '초기 가동 시에는 실외기가 늦게 돌아가거나 냉기 순환이 늦어질 수 있습니다.\n30분이상 충분히 테스트해 주세요.'
    }];
    context.botUser.curcontext = 'air';
    callback(task,context);
  }
};

bot.setTask('airweak',airweak);

var refrino = {
  action: function (task,context,callback) {
    context.dialog.doc = [{
      title: '전원이 들어오지 않는 경우',
      content: '도어를 열었을 때 램프가 들어오지 않는다면 우선 전원코드를 뺐다가 재 삽입해주세요.\n그래도 램프가 들어오지 않는다면 다른 전기제품을 콘센트에 꼽아 정상 작동되는지 확인해주세요.\n다른 전기제품도 정상 작동하지 않는다면 콘센트 문제이며 냉장고를 다른 콘센트에 꼽고 사용해주세요.\n다른 전기제품이 정상 작동한다면 서비스 엔지니어 방문점검이 필요합니다. 서비스 접수를 신청해주세요.'
    },{
      title: '냉장고와 주위 벽과의 거리가 너무 좁은 경우',
      content: '냉장고와 주위 벽과의 거리가 너무 좁으면 냉장고 뒤쪽 기계실에 있는 냉각모터에서 발생되는 열을 식혀주지 못해 냉기가 약해질 수 있습니다\n뒤쪽 벽면과 측면의 공간을 띄어주시면 냉기가 회복이 될 수 있어요. 통풍이 잘 되도록 냉장고 주변에 적당한 간격을 두세요'
    }];
    context.botUser.curcontext = 'refri';
    callback(task,context);
  }
};

bot.setTask('refrino',refrino);

var refristrong = {
  action: function (task,context,callback) {
    context.dialog.doc = [{
      title: '온도설정을 하지 않은 경우',
      content: '냉장실 온도 설정이 강(0℃ 또는 1℃)으로 낮게 설정되어 있으면 음식물이 얼 수 있습니다.\n냉장실 온도 설정을 중이나 약(3℃ ~ 6℃)으로 설정해 주세요.\n냉장고 전면부의 냉장 온도 버튼으로 냉장실 온도를 조절합니다.'
    },{
      title: '수분이 많고 얼기 쉬운 식품을 냉장실 위쪽 선반이나 냉기가 나오는 입구 앞에 보관한 경우',
      content: '수분이 많고 얼기 쉬운 식품(콩나물, 두부, 과일, 야채 등)은 냉장실 아래쪽 선반이나 야채실에 보관해 주시고 냉기가 나오는 입구는 피해서 보관해 주세요.\n특히, 계란은 얼어 깨질 수 있으니 병꽂이에 보관해 주세요.'
    },{
      title: '음식물이 냉기 출구를 가리고 있는 경우',
      content: '선반에 보관한 음식이 많거나 냉장고 안쪽의 냉기가 나오는 입구를 막고 있으면 냉기 순환이 안되어 음식물이 녹을 수 있습니다.\n쉽게 녹을 수 있는 음식은 냉기가 나오는 입구 근처에 보관해 주세요.'
    },{
      title: '신선 맞춤실에 얼기 쉬운 음식을 보관한 경우',
      content: '신선맞춤실이 있는 경우 냉장실 맨 아래 서랍은 “야채/과일” 또는 ”육류/생선” 으로 전환하여 사용할 수 있는데 야채/과일로 전환 후 사용하세요.\n모델에 따라 전환레버가 있는 모델도 있어 정확하게 야채/과일에 레버를 두세요. OPEN/CLOSE 인 경우 CLOSE로 전환해주세요.\n※ “야채/과일” 사용 시 바나나처럼 열대과일 등 후숙과일은 보관하지 말아 주세요\n※ “육류/생선” 사용 시 냉장실온도보다 더 차가워 야채/과일이 얼 수 있어요.'
    },{
      title: '냉장고 주변이 통풍이 잘 안되는 경우',
      content: '냉장고 주변이 통풍이 안 되는 환경에서는 냉동기능이 약해질 수 있어 통풍이 잘 되도록 적당한 간격을 주세요.'
    },{
      title: '냉장고가 너무 추운 곳에 설치된 경우',
      content: '주위온도가 5℃~43℃이내인 곳에 설치하세요.'
    },{
      title: '냉장실 천장의 온도센서에 음식물이 닿아 있는 경우',
      content: '냉장실 천장에 있는 온도센서에 음식물(비닐류 등)이 닿아 있는 경우 온도 감지가 잘 안되어 과냉이 될 수 있으므로\n음식물(비닐류 등)이 천장(센서주변)에 닿지 않도록 정리해주세요.'
    }];
    context.botUser.curcontext = 'refri';
    callback(task,context);
  }
};

bot.setTask('refristrong',refristrong);

var refriweak = {
  action: function (task,context,callback) {
    context.dialog.doc = [{
      title: '온도설정을 하지 않은 경우',
      content: '냉장실 설정온도가 5도 또는 6도 일 경우 중이나 강 (3도 ~ 0도 사이)으로 설정해 주세요.\n냉장고 전면부의 냉장 온도 버튼으로 냉장실 온도를 조절합니다.'
    },{
      title: '주변에 열기구가 있는 경우',
      content: '설치 장소가 직사광선을 직접 받거나 가스레인지 등 열기구가 가까이 있으면 냉동기능이 약해질 수 있습니다.\n여름철 냉장고 문을 자주 열어 내부 온도가 상승하는 경우 냉동실의 냉기가 약해질 수 있습니다.'
    },{
      title: '음식물이 냉기 출구를 가리고 있는 경우',
      content: '선반에 보관한 음식이 많거나 냉장고 안쪽의 냉기가 나오는 입구를 막고 있으면 냉기 순환이 안되어 음식물이 녹을 수 있습니다.\n쉽게 녹을 수 있는 음식은 냉기가 나오는 입구 근처에 보관해 주세요.'
    },{
      title: '도어가 잘 닫혀있지 않은 경우',
      content: '보관된 음식이 도어에 끼지 않게 해주시고 도어를 꼭 닫아 주세요.\n도어가 완전히 닫히지 않아 냉기가 새면 바깥의 따뜻한 공기가 안으로 유입되어 음식물이 녹을 수 있습니다.'
    },{
      title: '냉장고 주변이 통풍이 잘 안되는 경우',
      content: '냉장고 주변이 통풍이 안 되는 환경에서는 냉동기능이 약해질 수 있어 통풍이 잘 되도록 적당한 간격을 주세요.'
    },{
      title: '도어를 자주 여닫는 경우',
      content: '냉동실에 넣으신 음식의 양에 따라 냉각시키는데 필요한 시간은 다릅니다.\n뜨거운 음식은 식혀서 냉동실에 넣어주시고 여름철과 같이 주위 온도가 높거나 녹기 쉬운 음식이 많은 경우 도어를 자주 여닫지 마세요.'
    },{
      title: '냉장고 주위 온도가 5℃ 이하 혹은 43℃ 이상인 경우',
      content: '냉장고 주위 온도가 5℃ 이상 43℃ 이하인 곳에 설치하세요.'
    },{
      title: '처음 전원을 연결한 경우',
      content: '처음 전원을 연결하면 약 1~2시간 정도면 냉기가 나오지만 정상 온도까지는 음식 보관에 따라 2~3일 정도 걸릴 수 있습니다.'
    }];
    context.botUser.curcontext = 'refri';
    callback(task,context);
  }
};

bot.setTask('refriweak',refriweak);
