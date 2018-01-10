var path = require('path');
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('./engine/bot/action/common/mongo'));
// var typelib = require(path.resolve('./engine/bot/action/common/type'));
var toneModule = require(path.resolve('./engine/bot/action/common/tone'));

function factsTypeCheck(text, format, inDoc, context, callback) {
    if (context.bot.language == "en") {

        // 영어
        if (!context.bot.useMemoryFacts || context.botUser.nlu.sentenceInfo != 2) {
            callback(text, inDoc, false);
            return;
        }

        var node1;
        for (var j = 0; j < context.botUser.nlp.length; j++) {
            var token1 = context.botUser.nlp[j];
            if (token1.text.toLowerCase() == 'what' ||
                token1.text.toLowerCase() == 'who' ||
                token1.text.toLowerCase() == 'why' ||
                token1.text.toLowerCase() == 'how' ||
                token1.text.toLowerCase() == 'when' ||
                token1.text.toLowerCase() == 'where') {
                continue;
            }
            if (token1.pos == 'Noun' || token1.pos == 'Pronoun' || token1.pos == 'Foreign') {
                node1 = token1.text;
                break;
            }
        }

        var edge;
        for (var j = 0; j < context.botUser.nlp.length; j++) {
            var token1 = context.botUser.nlp[j];
            if (token1.pos == 'Verb' || token1.pos == 'Adjective') {
                if (j<3 && (token1.text =='do' || token1.text =='did')) {
                    if (context.botUser.nlp[0].text.toLowerCase() == 'what' ||
                        context.botUser.nlp[0].text.toLowerCase() == 'who' ||
                        context.botUser.nlp[0].text.toLowerCase() == 'why' ||
                        context.botUser.nlp[0].text.toLowerCase() == 'how' ||
                        context.botUser.nlp[0].text.toLowerCase() == 'when' ||
                        context.botUser.nlp[0].text.toLowerCase() == 'where') {
                        continue;
                    }
                }
                edge = token1.text.replace(/[\?\.!]/gi, "");
                break;
            }
        }

        console.log("input: " + JSON.stringify(context.botUser.nlp));
        console.log("input---node1: " + node1);
        console.log("input---edge: " + edge);

        var edges = [{link: edge}];
        var query = {botUser: {$ne: null}};
        if (edges.length == 1) query = edges[0];
        else {
            query = {$or: []};
            for (var i = 0; i < edges.length; i++) {
                query.$or.push(edges[i]);
            }
        }

        query['botUser'] = context.user.userKey;

        var model = mongoModule.getModel('factlink', undefined);
        model.find(query, null, {sort: {created: -1}}, function (err, docs) {
            if (docs && docs.length > 0) {
                var _node1 = docs[0]._doc.node1;
                var _node2 = docs[0]._doc.node2;
                var _link = docs[0]._doc.link;

                switch (_node1.toLowerCase()) {
                    case 'i'  :
                        _node1 = 'you';
                        break;
                    case 'you' :
                        _node1 = 'i';
                        break;
                }
                switch (_link.toLowerCase()) {
                    case 'am'  :
                        _link = 'are';
                        break;
                    case 'are' :
                        _link = 'am';
                        break;
                }

                inDoc._output = _node1 + ' ' + _link + ' ' + _node2;

                toneModule.toneSentence(inDoc._output, context.botUser.tone || '해요체', function (out) {
                    inDoc._output = out;

                    callback(text, inDoc, true);
                });

            } else {
                callback(text, inDoc, false);
            }
        });
    } else if (context.bot.language == "zh") {
        // 중국어
        if (!context.bot.useMemoryFacts || context.botUser.nlu.sentenceInfo != 2 || context.botUser.sentenceInfo.verbToken == undefined) {
            callback(text, inDoc, false);
            return;
        }

        var node1;
        for (var j = 0; j < context.botUser.nlp.length; j++) {
            var token1 = context.botUser.nlp[j];
            if (((token1.text.indexOf("年") < 0) &&
                    (token1.text.indexOf("月") < 0) &&
                    (token1.text.indexOf("日") < 0)) &&
                (token1.pos == 'Noun' || token1.pos == 'Pronoun' || token1.pos == 'Foreign')) {
                node1 = token1.text;
                break;
            }
        }

        var edge = context.botUser.sentenceInfo.verbToken.text;
        var edges = [{link: edge}];

        var query = {botUser: {$ne: null}};
        if (edges.length == 1) query = edges[0];
        else {
            query = {$or: []};
            for (var i = 0; i < edges.length; i++) {
                query.$or.push(edges[i]);
            }
        }

        query['botUser'] = context.user.userKey;

        var model = mongoModule.getModel('factlink', undefined);
        model.find(query, null, {sort: {created: -1}}, function (err, docs) {
            if (docs && docs.length > 0) {
                var _node1 = docs[0]._doc.node1;
                var _node2 = docs[0]._doc.node2;
                var _link = docs[0]._doc.link;

                if (_node1 == '我') _node1 = '你';
                inDoc._output = _node1 + '' + _link + '' + _node2;

                toneModule.toneSentence(inDoc._output, context.botUser.tone || '해요체', function (out) {
                    inDoc._output = out;

                    callback(text, inDoc, true);
                });

            } else {
                callback(text, inDoc, false);
            }
        });
    } else {
        // 한국어
        //if(!context.bot.useMemoryFacts || context.botUser.sentenceInfo.sentenceType != 1 || context.botUser.sentenceInfo.verbToken == undefined) {
        if (!context.bot.useMemoryFacts || context.botUser.nlu.sentenceInfo != 2 || context.botUser.sentenceInfo.verbToken == undefined) {
            callback(text, inDoc, false);
            return;
        }

        var node1;
        for (var j = 0; j < context.botUser.nlp.length; j++) {
            var token1 = context.botUser.nlp[j];
            if (token1.pos == 'Noun') {
                node1 = token1.text;
                break;
            }
        }

        var edge = context.botUser.sentenceInfo.verbToken.text;
        var edges = [{link: edge}];
        if (edge == '지' || edge == '야') edges.push({link: '이다'});

        var query = {botUser: {$ne: null}};
        if (edges.length == 1) query = edges[0];
        else {
            query = {$or: []};
            for (var i = 0; i < edges.length; i++) {
                query.$or.push(edges[i]);
            }
        }

        query['botUser'] = context.user.userKey;

        var model = mongoModule.getModel('factlink', undefined);
        model.find(query, null, {sort: {created: -1}}, function (err, docs) {
            if (docs && docs.length > 0) {
                var _node1 = docs[0]._doc.node1;
                var _node2 = docs[0]._doc.node2;
                var _link = docs[0]._doc.link;

                if (_node1 == '나' || _node1 == '내') _node1 = '고객님은';
                inDoc._output = _node1 + ' ' + _node2 + ' ' + _link;

                toneModule.toneSentence(inDoc._output, context.botUser.tone || '해요체', function (out) {
                    inDoc._output = out;

                    callback(text, inDoc, true);
                });

            } else {
                callback(text, inDoc, false);
            }
        });
    }
}

var userDialogType = {
  name: 'typeDoc',
  typeCheck: global._context.typeChecks['dialogTypeCheck'], //type.mongoDbTypeCheck,
  preType: function(task, context, type, callback) {
    type.mongo.queryStatic.botId = context.bot.botName;
    callback(task, context);
  },
  limit: 5,
  matchRate: 0.3,
  matchCount: 4,
  mongo: {
    model: 'BotDialog',
    queryStatic: {botId: undefined},
    queryFields: ['input'],
    fields: 'input output' ,
    taskFields: ['input', 'output', 'matchRate'],
    minMatch: 1
  }
};

exports.userDialogType = userDialogType;

var dialogsStartType = {
  name: 'typeDoc',
  typeCheck: global._context.typeChecks['dialogTypeCheck'], //type.mongoDbTypeCheck,
  preType: function(task, context, type, callback) {
    if(context.bot.dialogsets) {
      type.mongo.queryStatic = {$or: []};
      for(var i = 0; i < context.bot.dialogsets.length; i++) {
        if(context.bot.dialogsets[i]) type.mongo.queryStatic.$or.push({dialogset: context.bot.dialogsets[i]});
      }

      if(type.mongo.queryStatic.$or.length == 0) type.mongo.queryStatic = {dialogset: ''};
    } else {
      type.mongo.queryStatic = {dialogset: ''};
    }
    callback(task, context);
  },
  limit: 10,
  matchRate: 0.4,
  matchCount: 4,
  exclude: ['하다', '이다'],
  mongo: {
    model: 'dialogsetdialogs',
    queryStatic: {dialogset: ''},
    queryFields: ['input'],
    fields: 'dialogset input inputRaw output context' ,
    taskFields: ['input', 'inputRaw', 'output', 'matchCount', 'matchRate', 'dialogset', 'context'],
    minMatch: 1,
    schema: {
      dialogset: {
        type: mongoose.Schema.ObjectId,
        ref: 'Dialogset'
      },
      id: Number,
      input: mongoose.Schema.Types.Mixed,
      inputRaw: mongoose.Schema.Types.Mixed,
      output: mongoose.Schema.Types.Mixed,
      tag: [String],
      parent: mongoose.Schema.Types.Mixed,
      context: {
        type: mongoose.Schema.ObjectId,
        ref: 'customcontext'
      }
    }
  }
};


var globalStartDialogs = [
  // {
  //   input: ['목록',/playchat/i,'플레이 챗','플레이챗','플레이 쳇','플레이쳇','플래이챗','플래이 챗'],
  //   task: {
  //     action: function (task, context, callback) {
  //       task.botName = 'playchat';
  //       var command = require(path.resolve('./modules/bot/action/common/command'));
  //       command.changeBot(task, context, function (_task, _context) {
  //         callback(_task, _context);
  //       });
  //     }
  //   },
  //   output: '안녕하세요 PlayChat입니다.\n인기봇, 최신봇, 친구봇, 마이봇 중 하나를 입력해주세요.',
  // },
  // {
  //   name: '인기봇',
  //   input: '인기 봇',
  //   task:   {action: core.popularbotlist},
  //   output: '인기봇 리스트입니다.\n#popularbot#+index+. +name+\n#',
  //   children: [
  //     {
  //       input: {types: [{name: 'selectbot', listName: 'popularbot', typeCheck: 'listTypeCheck'}]},
  //       task:       {action: core.connectBot},
  //       output: '+outputtext+\n궁금하신걸 물어보세요.\n\(목록으로 돌아가기 : [목록] 또는 [플레이챗] 입력\)'
  //     }
  //   ]
  // },
  // {
  //   name: '최신봇',
  //   input: '최신 봇',
  //   task:   {action: core.newbotlist},
  //   output: '최신봇 리스트입니다.\n#newbot#+index+. +name+\n#',
  //   children: [
  //     {
  //       input: {types: [{name: 'selectbot', listName: 'newbot', typeCheck: 'listTypeCheck'}]},
  //       task:       {action: core.connectBot},
  //       output: '+outputtext+\n궁금하신걸 물어보세요.\n\(목록으로 돌아가기 : [목록] 또는 [플레이챗] 입력\)'
  //     }
  //   ]
  // },
  // {
  //   name: '친구봇',
  //   input: '친구 봇',
  //   task:   {action: core.userCheck},
  //   output: [
  //     {if: 'context.user.check == true', output: {call:'친구봇리스트'}},
  //     {if: 'context.user.check == false', output: 'ID[이메일]를 입력해주세요',
  //       children: [
  //         {
  //           input: {types: [{name: 'email', typeCheck: core.emailTypeCheck, raw: true}]},
  //           task:       {action: core.authemail},
  //           output: [
  //             {if: 'context.dialog.emailusercheck == true', output: '고객님의 메일로 인증코드를 전송하였습니다.\n인증코드를 입력해주세요.',
  //               children: [
  //                 {
  //                   input: {types: [{name: 'code', typeCheck: core.codeTypeCheck, raw: true}]},
  //                   task:           {action: core.authcode},
  //                   output: [
  //                     {if: 'context.dialog.codecheck == true', output: {call:'친구봇리스트'}},
  //                     {if: 'context.dialog.codecheck == false', output: {repeat: 1, options: {output: '인증코드가 잘못되었습니다.\n다시입력해주세요.'}}}]
  //                 },
  //                 {
  //                   input: {if: 'true'},
  //                   output: {repeat: 1, options: {output: '인증코드의 형식이 틀렸습니다.\n다시입력해주세요.'}}
  //                 }
  //               ]},
  //             {if: 'context.dialog.emailusercheck == false', output: {repeat: 1, options: {output: '가입되지 않은 ID[이메일]입니다.\n아래 링크에서 가입 후 진행해주세요.'}}}]
  //         },
  //         {
  //           input: {if: 'true'},
  //           output: {repeat: 1, options: {output: 'ID[이메일] 형식이 틀렸습니다.\n다시입력해주세요.'}}
  //         }
  //       ]}]
  // },
  // {
  //   name: '친구봇리스트',
  //   input: '친구 봇',
  //   task:   {action: core.followbotlist},
  //   output: '친구봇 리스트입니다.\n#followbot#+index+. +name+\n#',
  //   children: [
  //     {
  //       input: {types: [{name: 'selectbot', listName: 'followbot', typeCheck: 'listTypeCheck'}]},
  //       task:       {action: core.connectBot},
  //       output: '+outputtext+\n궁금하신걸 물어보세요.\n\(목록으로 돌아가기 : [목록] 또는 [플레이챗] 입력\)'
  //     }
  //   ]
  // },
  // {
  //   name: '마이봇',
  //   input: '마이 봇',
  //   task:   {action: core.userCheck},
  //   output: [
  //     {if: 'context.user.check == true', output: {call:'마이봇리스트'}},
  //     {if: 'context.user.check == false', output: 'ID[이메일]를 입력해주세요',
  //       children: [
  //         {
  //           input: {types: [{name: 'email', typeCheck: core.emailTypeCheck, raw: true}]},
  //           task:       {action: core.authemail},
  //           output: [
  //             {if: 'context.dialog.emailusercheck == true', output: '고객님의 메일로 인증코드를 전송하였습니다.\n인증코드를 입력해주세요.',
  //               children: [
  //                 {
  //                   input: {types: [{name: 'code', typeCheck: core.codeTypeCheck, raw: true}]},
  //                   task:           {action: core.authcode},
  //                   output: [
  //                     {if: 'context.dialog.codecheck == true', output: {call:'마이봇리스트'}},
  //                     {if: 'context.dialog.codecheck == false', output: {repeat: 1, options: {output: '인증코드가 잘못되었습니다.\n다시입력해주세요.'}}}]
  //                 },
  //                 {
  //                   input: {if: 'true'},
  //                   output: {repeat: 1, options: {output: '인증코드의 형식이 틀렸습니다.\n다시입력해주세요.'}}
  //                 }
  //               ]},
  //             {if: 'context.dialog.emailusercheck == false', output: {repeat: 1, options: {output: '가입되지 않은 ID[이메일]입니다.\n아래 링크에서 가입 후 진행해주세요.'}}}]
  //         },
  //         {
  //           input: {if: 'true'},
  //           output: {repeat: 1, options: {output: 'ID[이메일] 형식이 틀렸습니다.\n다시입력해주세요.'}}
  //         }
  //       ]}]
  // },
  // {
  //   name: '마이봇리스트',
  //   input: false,
  //   task:   {action: core.mybotlist},
  //   output: '마이봇 리스트입니다.\n#mybot#+index+. +name+\n#',
  //   children: [
  //     {
  //       input: {types: [{name: 'selectbot', listName: 'mybot', typeCheck: 'listTypeCheck'}]},
  //       task:       {action: core.connectBot},
  //       output: '+outputtext+\n궁금하신걸 물어보세요.\n\(목록으로 돌아가기 : [목록] 또는 [플레이챗] 입력\)'
  //     }
  //   ]
  // },

  // {
  //   input: [/([^\b\s]*)(?:\b|\s).*불러줘/, /([^\b\s]*)(?:\b|\s).*부르다/, /([^\b\s]*)(?:\b|\s).*불다/],
  //   task:   {
  //     action: function(task, context, callback) {
  //       task.botName = task['1'];
  //       var command = require(path.resolve('./modules/bot/action/common/command'));
  //       command.changeBot(task, context, function(_task, _context) {
  //         callback(_task, _context);
  //       });
  //     }
  //   },
  //   output: '+outputtext+\n궁금하신걸 물어보세요.\n\(목록으로 돌아가기 : [목록] 또는 [플레이챗] 입력\)'
  // },
  // {
  //   input: /(^.*체).*바꾸다/,
  //   task: {
  //     action: function(task, context, callback) {
  //       task['1'] = task['1'].replace(/ /g, '');
  //       context.botUser.tone = task['1'];
  //       callback(task, context);
  //     }
  //   },
  //   output: '+1+로 변경되었습니다.'
  // },
  {
    input: {types: [{typeCheck: factsTypeCheck}]},
    output: '+_output+'
  },
  {
    input: {if: 'context.bot.dialogsetOption == undefined || context.bot.dialogsetOption.useBotDialog != false', types: [userDialogType]},
    task: {
      action: function(task, context, callback) {
        if(Array.isArray(task.typeDoc)) {
          if(task.typeDoc.length > 1) task._output = task.typeDoc[0].output;
          else task._output = task.typeDoc[0].output;
        } else {
          task._output = task.typeDoc.output;
        }

        if(Array.isArray(task._output)) {
          task._output = task._output[Math.floor(Math.random() * task._output.length)];
        }

        callback(task, context);
      }
    },
    output: '+_output+'
  // },
  //
  // {
  //   input: {types: [dialogsStartType]},
  //   task:   {
  //     action: function(task, context, callback) {
  //       // console.log(JSON.stringify(task.typeDoc, null, 2));
  //
  //       if(Array.isArray(task.typeDoc)) {
  //         if(task.typeDoc.length > 1) task._output = task.typeDoc[0].output;
  //         else task._output = task.typeDoc[0].output;
  //
  //         console.log(task.typeDoc[0].inputRaw + ', ' + task.typeDoc[0].input + '(' + task.typeDoc[0].matchCount + ', ' + task.typeDoc[0].matchRate + ')');
  //       } else {
  //         task._output = task.typeDoc.output;
  //         console.log(task.typeDoc.inputRaw + ', ' + task.typeDoc.input + '(' + task.typeDoc.matchCount + ', ' + task.typeDoc.matchRate + ')');
  //       }
  //
  //       if(Array.isArray(task._output)) {
  //         task._output = task._output[Math.floor(Math.random() * task._output.length)];
  //       }
  //
  //       callback(task, context);
  //     }
  //   },
  //   output: '+_output+'
  }

];

exports.globalStartDialogs = globalStartDialogs;

var dialogsType = {
  name: 'typeDoc',
  typeCheck: global._context.typeChecks['dialogTypeCheck'], //type.mongoDbTypeCheck,
  preType: function(task, context, type, callback) {
    if(context.bot.dialogsets) {
      if(context.bot.dialogsetOption) {
        if(context.bot.dialogsetOption.limit) type.limit = context.bot.dialogsetOption.limit;
        if(context.bot.dialogsetOption.matchRate) type.matchRate = context.bot.dialogsetOption.matchRate;
        if(context.bot.dialogsetOption.matchCount) type.matchCount = context.bot.dialogsetOption.matchCount;
      }

      type.mongo.queryStatic = {$or: []};
      for(var i = 0; i < context.bot.dialogsets.length; i++) {
        if(context.bot.dialogsets[i]) type.mongo.queryStatic.$or.push({dialogset: context.bot.dialogsets[i]});
      }

      if(type.mongo.queryStatic.$or.length == 0) type.mongo.queryStatic = {dialogset: ''};
    } else {
      type.mongo.queryStatic = {dialogset: ''};
    }
    callback(task, context);
  },
  limit: 5,
  matchRate: 0.4,
  matchCount: 4,
  exclude: ['하다', '이다'],
  mongo: {
    model: 'dialogsetdialogs',
    queryStatic: {dialogset: ''},
    queryFields: ['input'],
    fields: 'dialogset input inputRaw output context' ,
    taskFields: ['input', 'inputRaw', 'output', 'matchCount', 'matchRate', 'dialogset', 'context'],
    minMatch: 1,
    schema: {
      dialogset: {
        type: mongoose.Schema.ObjectId,
        ref: 'Dialogset'
      },
      id: Number,
      input: mongoose.Schema.Types.Mixed,
      inputRaw: mongoose.Schema.Types.Mixed,
      output: mongoose.Schema.Types.Mixed,
      tag: [String],
      parent: mongoose.Schema.Types.Mixed,
      context: {
        type: mongoose.Schema.ObjectId,
        //ref: 'CustomContext'
          ref: 'customcontext'
      }
    }
  }
};

exports.dialogsType = dialogsType;

var globalEndDialogs = [
  {
    input: {if: 'context.bot.dialogsetOption == undefined || context.bot.dialogsetOption.useDialogset != false', types: [dialogsType]},
    task:   {
      action: function(task, context, callback) {

        if(Array.isArray(task.typeDoc)) {
          if(context.bot.dialogsetOption && context.bot.dialogsetOption.matchList &&
            (context.bot.dialogsetOption.matchOneRate == undefined || context.bot.dialogsetOption.matchOneRate > task.typeDoc[0].matchRate) &&
            (context.bot.dialogsetOption.matchOneCount == undefined || context.bot.dialogsetOption.matchOneCount > task.typeDoc[0].matchCount)) {
            context.dialog.typeDoc = task.typeDoc;
            if(context.bot.dialogsetOption.listOutput) {
              context.dialog.output = context.bot.dialogsetOption.listOutput;
            } else {
              context.dialog.output = '질문에 가장 유사한 답변을 찾았습니다.\n\n#typeDoc#+index+. +inputRaw+\n\n# 번호를 입력해 주세요.';
            }

            context.dialog.children = [
              {
                input: {types: [{name: 'doc1', listName: 'typeDoc', typeCheck: 'listTypeCheck'}]},
                output: (context.bot.dialogsetOption.contentOutput ?
                  context.bot.dialogsetOption.contentOutput
                  : '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n')
              }
            ];
          } else if(context.bot.dialogsetOption && context.bot.dialogsetOption.matchList && task.typeDoc.length > 1 &&
            (task.typeDoc[0].matchCount == task.typeDoc[1].matchCount)) {

            var dialogs = [];
            for(var i = 0; i < task.typeDoc.length; i++) {
              if(i == 0) dialogs.push(task.typeDoc[i]);
              else if(dialogs[dialogs.length - 1].matchCount != task.typeDoc[i].matchCount) break;
              else dialogs.push(task.typeDoc[i]);
            }
            task.typeDoc = dialogs;

            context.dialog.typeDoc = task.typeDoc;
            // if (context.bot.dialogsetOption.listOutput) {
            //   context.dialog.output = context.bot.dialogsetOption.listOutput;
            // } else {
            context.dialog.output = "아래 중에 궁금하신 내용이 있나요?\n\n#typeDoc#+index+. +inputRaw+\n\n#번호를 입력하면 상세 내용을 보여드립니다.\n다시 검색하시려면 검색어를 입력해주세요.\n처음으로 돌아가시려면 '시작'이라고 말씀해주세요";
            // }

            context.dialog.children = [
              {
                input: {types: [{name: 'doc1', listName: 'typeDoc', typeCheck: 'listTypeCheck'}]},
                output: (context.bot.dialogsetOption.contentOutput ?
                  context.bot.dialogsetOption.contentOutput
                  : '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n')
              }
            ];

          } else {
            if(task.typeDoc.length > 1) task._output = task.typeDoc[0].output;
            else task._output = task.typeDoc[0].output;

            if(Array.isArray(task._output)) {
              task._output = task._output[Math.floor(Math.random() * task._output.length)];
            }

            context.dialog.output = '+_output+';
            context.dialog.children = null;
            //
            // console.log(task.typeDoc[0].inputRaw + ', ' + task.typeDoc[0].input + '(' + task.typeDoc[0].matchCount + ', ' + task.typeDoc[0].matchRate + ')');
          }

        } else {
          if(Array.isArray(task.typeDoc.output)) {
            var index = Math.floor(Math.random() * task.typeDoc.output.length);
            task._output = task.typeDoc.output[index];
            console.log('index: ' + index + ', ' + task._output)
          } else {
            task._output = task.typeDoc.output;
          }

          context.dialog.output = '+_output+';
          context.dialog.children = null;
          // console.log(task.typeDoc.inputRaw + ', ' + task.typeDoc.input + '(' + task.typeDoc.matchCount + ', ' + task.typeDoc.matchRate + ')');
        }

        callback(task, context);
      }

      // postCallback: function(task, context, callback) {
      //   var toneType = context.botUser.tone;
      //   if(toneType == undefined) toneType = '해요체';
      //
      //   tone.toneSentence(task._output, toneType, function(_output) {
      //     task._output = _output;
      //     callback(task, context);
      //   });
      // }
    },
    output: '+_output+'
    // output: '질문에 가장 유사한 답변을 찾았습니다.\n\n#typeDoc#+index+. +inputRaw+\n# 번호를 입력해 주세요.',
    // children: [
    //   {
    //     input: {types: [{name: 'doc1', listName: 'typeDoc', typeCheck: 'listTypeCheck'}]},
    //     output: '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n'
    //   }
    // ]
  }
];

exports.globalEndDialogs = globalEndDialogs;

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
