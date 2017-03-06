var path = require('path');
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('modules/bot/action/common/mongo'));
// var typelib = require(path.resolve('modules/bot/action/common/type'));

function factsTypeCheck(text, format, inDoc, context, callback) {
  if(context.botUser.sentenceInfo.sentenceType != 1 || context.botUser.sentenceInfo.verbToken == undefined) {
    callback(text, inDoc, false);
    return;
  }

  var edge = context.botUser.sentenceInfo.verbToken.text;

  var model = mongoModule.getModel('fact', undefined);
  model.find({edge: edge}, null, {sort: {created: -1}}, function(err, docs) {
    if(docs && docs.length > 0) {
      var node1 = docs[0]._doc.node1;
      var node2 = docs[0]._doc.node2;
      var edge = docs[0]._doc.edge;

      inDoc._output = node1 + ' ' + node2 + ' ' + edge;
      callback(text, inDoc, true);
    } else {
      callback(text, inDoc, false);
    }
  });
}

var globalDialogs = [
  {
    input: /(^.*체).*바꾸다/,
    task: {
      action: function(task, context, callback) {
        task['1'] = task['1'].replace(/ /g, '');
        context.botUser.tone = task['1'];
        callback(task, context);
      }
    },
    output: '+1+로 변경되었습니다.'
  },
  {
    input: {types: [{typeCheck: factsTypeCheck}]},
    output: '+_output+'
  }
];

exports.globalDialogs = globalDialogs;

// var listPattern =
// { input: '+input+',
//   task: '+task+',
//   output: '+output+',
//   children: [
//     { input: {types: [{name: '+type+', typeCheck: 'listTypeCheck'}]}, output: '+output2+'},
//     {input: {types: ['+type+']},output: '+output2+'},
//     {output: {repeat: 1}}
//   ]
// };
//
// // var listPattern =
// // { input: orderTypes.menuCategoryCheck,
// //   task: orderTasks.categoryRestaurants,
// //   output: '[+category+]\n##+index+. +name+\n#\n목록에서 번호를 선택하거나 음식점명을 입력해주세요.',
// //   children: [
// //     { input: {types: [{name: 'restaurant', typeCheck: 'listTypeCheck'}]},
// //       output: {call: '메뉴선택'}},
// //     {input: {types: [orderTask.restaurantType]},output: {call: '+nextDialog+'}},
// //     {output: {repeat: 1}}
// //   ]
// // };
//
// // var categoryListPattern =
// // {
// //   name: '음식점구분',
// //   output: //'입력된 주소 근처에서 해당 음식점을 찾을 수 없습니다.\n' +
// //   '[음식점 종류 선택]\n1. 치킨\n2. 중국집\n3. 피자\n4. 족발/보쌈\n5. 패스트푸드\n\n' +
// //   '목록에서 번호를 선택하거나 음식점명을 입력해주세요.',
// //   children: [
// //     {
// //       input: orderTypes.menuCategoryCheck,
// //       task: orderTasks.categoryRestaurants,
// //       output: '[+category+]\n##+index+. +name+\n#\n목록에서 번호를 선택하거나 음식점명을 입력해주세요.',
// //       children: [
// //         {
// //           input: {types: [{name: 'restaurant', typeCheck: 'listTypeCheck'}]},
// //           output: {call: '메뉴선택'}
// //         },
// //         {input: {types: [orderTask.restaurantType]}, output: {call: '메뉴선택'}},
// //         {output: {repeat: 1}}
// //       ]
// //     },
// //     {input: {types: [orderTask.restaurantType]}, output: {call: '메뉴선택'}},
// //     {input: /~이전/, output: {up: 1}},
// //     {output: {repeat: 1}}
// //   ]
// // }
//
// var dbPatternType = {
//   typeCheck: typelib.mongoDbTypeCheck,
//   mongo: {
//     model: '{type}',
//     queryFields: ['name'],
//     minMatch: 2
//   }
// };
//
// var dbListPattern =
// { input: {types: [dbPatternType]},
//   output: [
//     { if: '!Array.isArray(dialog.task.{type})',
//        output: {call: '메뉴선택'}
//     },
//     { if: 'Array.isArray(dialog.task.{type})',
//       name: '{desc}목록',
//       task: {action: function(task, context, callback) {
//         if(task[task.pattern.type]) context.dialog[task.pattern.type] = task[task.pattern.type];
//         else if(!task[task.pattern.type] && context.dialog[task.pattern.type]) task[task.pattern.type] = context.dialog[task.pattern.type];
//         callback(task, context);
//       }},
//       output: '말씀하신 곳과 가장 유사한 {desc}입니다.\n#{type}#+index+. +name+\n#\n목록에서 번호를 선택하거나 {desc} 이름을 입력해주세요.',
//       children: [
//         { input: {types: [{name: '{type}', typeCheck: 'listTypeCheck'}]}, output: {call: '메뉴선택'}},
//         {input: {types: ['{type}']},output: {repeat: 1}},
//         {output: {call: '음식점구분'}}
//       ]
//     }
//   ]
// };
//
