var path = require('path');
var mongoModule = require(path.resolve('modules/bot/action/common/mongo'));
var async = require('async');

function loadCustomContext(bot, callback) {
  var list = [];
  var contexts = {};

  async.waterfall([
    function(cb) {
      var CustomContext = mongoModule.getModel('customcontext');

      CustomContext.find({bot: bot.id}).lean().exec(function(err, docs) {
        list = docs;
        for(var i in docs) {
          if(docs[i].parent) {
            docs[i].parentId = docs[i].parent;
            for (var j in docs) {
              if (docs[j]._id.toString() == docs[i].parentId.toString()) {
                docs[i].parent = docs[j];
                break;
              }
            }

            if(docs[i].parent.children == undefined) {
              docs[i].parent.children = [docs[i]];
            } else {
              docs[i].parent.children.push(docs[i]);
            }
          }
        }

        var getPath = function(context) {
          if(context.parent == null) return context.name;
          else return getPath(context.parent) + '.' + context.name;
        };

        for(var i in docs) {
          contexts[getPath(docs[i])] = docs[i];
        }

        bot.contexts = contexts;

        cb(null);
      })
    },

    function(cb) {
      var CustomContextItem = mongoModule.getModel('customcontextitem');

      CustomContextItem.find({bot: bot.id}).lean().exec(function(err, docs) {
        for(var i in docs) {
          var item = docs[i];

          for(var j in list) {
            if(list[j]._id.toString() == item.context.toString()) {
              var context = list[j];
              if(context.items == undefined) context.items = [];
              context.items.push({type: item.itemType, name: item.name});

              break;
            }
          }
        }

        cb(null);
      })
    },
    
    function(cb) {
      for(var i in bot.dialogs) {
        var dialog = bot.dialogs[i];
        for(var key in contexts) {
          if(dialog.context == key) {
            dialog.context = contexts[key];

            if(contexts[key].dialogs == undefined) {
              contexts[key].dialogs = [dialog];
            } else {
              contexts[key].dialogs.push(dialog);
            }

            break;
          }
        }
      }

      cb(null);
    }

  ], function(err) {
    if(callback) callback();
  })
}

exports.loadCustomContext = loadCustomContext;