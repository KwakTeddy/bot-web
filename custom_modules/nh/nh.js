var path = require('path');
var config = require(path.resolve('./config/config'));

exports.text = function (task, context, successCallback, errorCallback) {
  successCallback(task, context);
};

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
