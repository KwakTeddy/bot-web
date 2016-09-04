var path = require('path');
var config = require(path.resolve('./config/config'));

exports.text = function (task, context, successCallback, errorCallback) {
  successCallback(task, context);
};

exports.faqQuestion =     {
  module: 'task',
  action: 'question',
  paramDefs: [
    {type: 'faq', name: 'faq질문', isDisplay: false, question: '죄송합니다. \n해당 질문이 학습되어 있지 않습니다.',
      buttons: ['처음으로 돌아가기', '계속 상담하기', '콜센터로 연결']}
  ],
  preCallback: function(task, context, callback) {
    callback(task, context);
  },
  postCallback: function(task, context, callback) {
    if(task.typeDoc && task.typeDoc.length > 1) {
      task.doc = task.typeDoc;
      context.user.doc = task.typeDoc;
      task.out = '문의하신 질문에 가장 적합한 답변들 입니다.\n\n##+index+. +title+\n\n#원하는 답변을 선택해 주세요.\n\n원하시는 답변이 없을 경우 조금 더 자세히 질문해주세요.';
    } else {
      task.doc = task.typeDoc;
      context.user.doc = task.typeDoc;
      task.out = '문의하신 질문에 가장 적합한 답변들 입니다.\n\n##+index+. +title+\n\n#원하는 답변을 선택해 주세요.\n\n원하시는 답변이 없을 경우 조금 더 자세히 질문해주세요.';
      // task.out = '[+title+]\n+content+';
    }

    callback(task, context);
  }
};

// exports.faqQuestion = {
//   module: 'task',
//   action: 'sequence',
//   actions: [
//     {
//       module: 'task',
//       action: 'question',
//       paramDefs: [
//         {type: 'faq', name: 'faq질문', isDisplay: false, question: '궁금한 질문을 입력해주세요.'}
//       ],
//       preCallback: function(task, context, callback) {
//         task.in = task.parent.in;
//         callback(task, context);
//       },
//       postCallback: function(task, context, callback) {
//         if(task.typeDoc && task.typeDoc.length > 1) {
//           task.doc = task.typeDoc;
//           task.out = '##+index+. +title+\n#';
//         } else {
//           task.out = '[+title+]\n+content+';
//         }
//
//         callback(task, context);
//       },
//       taskOut: "원하는 메뉴를 선택해 주세요.\n##+index+ +title+ +price+원\n#"
//     },
//     {
//       module: 'task',
//       action: 'question',
//       paramDefs: [
//         {type: 'num', name: '질문번호', isDisplay: false, question: 'FAQ번호를 입력해주세요.'}
//       ],
//       preCallback: function(task, context, callback) {
//         task.out = '[+title+]%0a+content+';
//         task.title = task.preTask.doc[task.num-1].title;
//         task.content = task.preTask.doc[task.num-1].content
//
//         callback(task, context);
//       }
//     }
//   ]
// };

exports.faq = {
  module: 'mongo',
  action: 'findById',
  mongo: {
    model: 'faq',
    _id: ''
  },
  preCallback: function(task, context, callback) {
    task.mongo._id = task.id;
    task.out = '+title+ \n +content+';
    callback(task, context);
  }
};

//u: (<<가족 SMS>>) {"module": "mongo", "action": "findById", "mongo": {"model": "faq", "%5fid": %22 57be9ffde2f5ce753f1c59ec %22}, "content": "+title+ %0a +content+","postText":"%0a또 궁금한게 있으시면 질문해주세요~%0a처음으로 이동 : '0'"}

exports.nhApp = function (task, context, successCallback, errorCallback) {
  if(task.urlMessage == undefined) task.urlMessage = '앱 실행하기';

  // var ANDROID_STORE = 'https://market.android.com/details?id='
  // var IOS_STORE = 'https://itunes.apple.com/kr/app/';
  var androidStore = '';
  var iosStore = '';

  if(task.url.startsWith('NHSmartCenter')) {
    // 금융상품몰
    androidStore = 'nh.smart.fincenter';
    iosStore = 'nhgeum-yungsangpummakes/id1063199138?mt=8';
  } else if(task.url.startsWith('nhsmartbank') || task.url.startsWith('com.nonghyup.nhsmartbanking')) {
    // NH스마트뱅킹
    androidStore = 'nh.smart';
    iosStore = 'new_nhseumateubaengking/id398002630?mt=8';
  } else if(task.url.startsWith('nh.smart.card') || task.url.startsWith('com.nonghyup.nhcard')) {
    // NH카드
    androidStore = 'nh.smart.card';
    iosStore = 'seumartnhnonghyeobkadeu/id406473666?mt=8';
  } else {
    // 올원뱅크
    androidStore = 'nh.smart.allonebank';
    iosStore = 'ol-wonbaengkeu-all-one-bank/id1138584631?mt=8';
  }

  task.url = 'http://bot-dev.moneybrain.ai:3000' + '/bot/app/' +
    encodeURIComponent(task.url) + '/' + encodeURIComponent(androidStore) + '/' +
    encodeURIComponent(task.iosUrl ? task.iosUrl : task.url) + '/' + encodeURIComponent(iosStore);

  successCallback(task, context);
};
