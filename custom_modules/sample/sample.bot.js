var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));
var typelib = require(path.resolve('./bot-engine/action/common/type'));

var sampleBot = {
  use: true
};

// bot.setBot('sample', sampleBot);

botlib.makeBot('sample', sampleBot);

var dbPatternType = {
  name: '{type}',
  typeCheck: typelib.mongoTypeCheck,
  mongo: {
    model: '{type}',
    queryFields: ['{field}']
    // minMatch: 2
  }
};

var dbListPattern =
{ input: {types: [dbPatternType]},
  output: [
    { if: '!Array.isArray(dialog.task.{type})',
      output: '{output}'
    },
    { if: 'Array.isArray(dialog.task.{type})',
      name: '{desc}목록',
      // task: {action: function(task, context, callback) {
      //   if(task[task.pattern.type]) context.dialog[task.pattern.type] = task[task.pattern.type];
      //   else if(!task[task.pattern.type] && context.dialog[task.pattern.type]) task[task.pattern.type] = context.dialog[task.pattern.type];
      //   callback(task, context);
      // }},
      output: '말씀하신 곳과 가장 유사한 {desc}입니다.\n#{type}#+index+. +title+\n#\n목록에서 번호를 선택하거나 {desc} 이름을 입력해주세요.',
      children: [
        { input: {types: [{name: '{type}', typeCheck: 'listTypeCheck'}]}, output: '{output}'},
        {input: {types: ['{type}']},output: {repeat: 1}},
        {output: {call: '음식점구분'}}
      ]
    }
  ]
};

// botlib.getBot('sample').setDialogPattern('dbListPattern', dbListPattern);
