var xpath = require('xpath');

function xpathAction(task, context, callback) {


  callback(task, context);
}

exports.xpathAction = xpathAction;


function xpathChange(task, context) {
  for (var obj in task) {
    if(obj === '_repeat') {

    } else {

    }
  }
}
