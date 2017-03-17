var path = require('path');
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('modules/bot/action/common/mongo'));
// var typelib = require(path.resolve('modules/bot/action/common/type'));
var toneModule = require(path.resolve('modules/bot/action/common/tone'));

function factsTypeCheck(text, format, inDoc, context, callback) {
  if(context.botUser.sentenceInfo.sentenceType != 1 || context.botUser.sentenceInfo.verbToken == undefined) {
    callback(text, inDoc, false);
    return;
  }

  var node1;
  for (var j = 0; j < context.botUser.nlp.length; j++) {
    var token1 = context.botUser.nlp[j];
    if(token1.pos == 'Noun') {
      node1  = token1.text;
      break;
    }
  }

  var edge = context.botUser.sentenceInfo.verbToken.text;
  var edges = [{link: edge}];
  if(edge == '지' || edge == '야') edges.push({link: '이다'});

  var query = {botUser: {$ne: null}};
  if(edges.length == 1) query = edges[0];
  else {
    query = {$or: []};
    for(var i = 0; i < edges.length; i++) {
      query.$or.push(edges[i]);
    }
  }

  query['botUser'] = {$ne: null};

  var model = mongoModule.getModel('factlink', undefined);
  model.find(query, null, {sort: {created: -1}}, function(err, docs) {
    if(docs && docs.length > 0) {
      var _node1 = docs[0]._doc.node1;
      var _node2 = docs[0]._doc.node2;
      var _link = docs[0]._doc.link;

      if(_node1 == '나' || _node1 == '내') _node1 = '고객님은';
      inDoc._output = _node1 + ' ' + _node2 + ' ' + _link;

      toneModule.toneSentence(inDoc._output, context.botUser.tone || '해요체', function(out) {
        inDoc._output = out;

        callback(text, inDoc, true);
      });

    } else {
      callback(text, inDoc, false);
    }
  });
}


var globalDialogs = [
  {
    input: [/([^\b\s]*)(?:\b|\s).*불러줘/, /([^\b\s]*)(?:\b|\s).*부르다/, /([^\b\s]*)(?:\b|\s).*불다/],
    task:   {
      action: function(task, context, callback) {
        task.botName = task['1'];
        var command = require(path.resolve('./modules/bot/action/common/command'));
        command.changeBot(task, context, function(_task, _context) {
          callback(_task, _context);
        });
      }
    },
    output: '+output+'
  },
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
