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
