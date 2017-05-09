var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));

function searchBranch(task, context, callback) {
  task.query=context.dialog.address.시군구명 + ' ' + context.dialog.address.법정읍면동명 + ' ' + '은행';

  address.naverGeoSearch(task, context, function(task, context) {
    for(var i = 0; i < task.doc.length; i++) {
      var item = task.doc[i];
      item.title = item.title.replace(/<[^>]+>/, '');
      item.title = item.title.replace(/<\/[^>]+>/, '');
    }

    if(task.doc && task.doc.length > 0) task.count = task.doc.length;
    else task.count = 0;

    context.dialog.item = task.doc[0];
    callback(task, context);
  });
}

exports.searchBranch = searchBranch;
