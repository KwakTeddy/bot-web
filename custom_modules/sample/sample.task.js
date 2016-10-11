var helloworldTask =
{
  name: 'helloworld',
  action: function (task, context, callback) {
    task.doc = { text: 'hello world' };
    callback(task, context);
  }
};

exports.helloworldTask = helloworldTask;


// action 함수 따로 정의하고 참조
var helloworldTask2 =
{
  name: 'helloworld2',
  action: helloworld2
};

exports.helloworldTask2 = helloworldTask2;

function helloworld2(task, context, callback) {
  task.doc = { text: 'hello world2' };
  callback(task, context);
}

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

exports.sampleListTask = sampleListTask;

