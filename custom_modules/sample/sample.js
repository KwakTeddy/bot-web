var path = require('path');
var bot = require(path.resolve('./bot-engine/bot')).getBot('sample');

var helloworldTask =
{
  name: 'helloworld',
  action: function (task, context, callback) {
    task.doc = { text: 'hello world' };
    callback(task, context);
  }
};

bot.setTask('helloworldTask', helloworldTask);

// action 함수 따로 정의하고 참조
var helloworldTask2 =
{
  name: 'helloworld2',
  action: 'helloworld2Action'
};

bot.setTask('helloworldTask2', helloworldTask2);

function helloworld2(task, context, callback) {
  task.doc = { text: 'hello world2' };
  callback(task, context);
}

bot.setAction('helloworld2Action', helloworld2);

// list 형 DATA
var sampleListTask = {
  name: 'sampleList',
  action: function (task, context, callback) {
    task.doc = [
      {index: 1, name: '작성자1', title: '제목1'},
      {index: 2, name: '작성자2', title: '제목2'},
      {index: 3, name: '작성자3', title: '제목3'},
      {index: 4, name: '작성자4', title: '제목4'}
    ];

    callback(task, context);
  }
};

bot.setTask('sampleListTask', sampleListTask);


function httpAction(task, context, callback) {
  var request = require('request');
  request({url: task.url}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      task.content = body;
      console.log(task.param.q);
      callback(task, context);
    }
  })
}

var googleTask = {
  url: 'https://www.google.com',
  param: {
    q: ''
  },
  action: httpAction
};

var moneybrainTask = {
  name: 'moneybrainTask',
  template: googleTask,
  param: {
    q: 'moneybrain.ai'
  }
};

bot.setTask('moneybrainTask', moneybrainTask);

var sampleTask3 =
{
  name: 'sample3',
  module: 'other',
  action: 'otherAction'
};

bot.setTask('sampleTask3', sampleTask3);
