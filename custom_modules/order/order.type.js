

function numberListTypeCheck(text, type, task, context, callback) {
  var num = Number(text);

  if (task[type.name] && num >= 1 && num <= task[type.name].length) {
    context.dialog[type.name] = task[type.name] = task[type.name][num - 1];

    // TODO 목록 선택시 텍스트 변경
    // if (task.in && task[paramDef.name]['matchOriginal']) {
    //   task.in = task.in.replace(task[paramDef.name]['matchOriginal'], type.IN_TAG_START + paramDef.name + type.IN_TAG_END);
    //   task[paramDef.name + 'Original'] = task[paramDef.name]['matchOriginal'];
    // }

    callback(text, task, true);
  } else if (context.dialog[type.name] && num >= 1 && num <= context.dialog[type.name].length) {
    context.dialog[type.name] = task[type.name] = context.dialog[type.name][num - 1];

    callback(text, task, true);
  } else {
    callback(text, task, false);
  }
}

exports.numberListTypeCheck = numberListTypeCheck;


function listTypeCheck(text, type, task, context, callback) {
  var num = Number(text);

  if (task[type.name] && num >= 1 && num <= task[type.name].length) {
    context.dialog[type.name] = task[type.name] = task[type.name][num - 1];

    callback(text, task, true);
  } else if (context.dialog[type.name] && num >= 1 && num <= context.dialog[type.name].length) {
    context.dialog[type.name] = task[type.name] = context.dialog[type.name][num - 1];

    callback(text, task, true);
  } else {
    var maxIndex = -1, maxCount = 0;
    var list = (task[type.name] ? task[type.name] : context.dialog[type.name]);
    for (var j = 0; j < list.length; j++) {
      var item;
      if(type.field) item = list[j][type.field];
      else if(list[j]['name']) item = list[j]['name'];
      else item = list[j];

      var matchCount = 0;
      var words = text.split(' ');
      for (var i = 0; i < words.length; i++) {
        var word = words[i];

        if(item.search(word) != -1) matchCount++;
      }

      if(matchCount > maxCount) {
        maxCount = matchCount;
        maxIndex = j;
      }
    }

    if(maxIndex != -1) {
      context.dialog[type.name] = task[type.name] = list[maxIndex];
      callback(text, task, true);
    } else
      callback(text, task, false);
  }
}

exports.listTypeCheck = listTypeCheck;

function menuCategoryCheck(inRaw, inNLP, dialog, context, callback) {
  var num = Number(inRaw);
  if (num >= 1 && num <= 5) {
    if(num == 1) context.dialog.restaurantCategory = '치킨';
    else if(num == 2) context.dialog.restaurantCategory = '중국집';
    else if(num == 3) context.dialog.restaurantCategory = '피자';
    else if(num == 4) context.dialog.restaurantCategory = '족발';
    else if(num == 5) context.dialog.restaurantCategory = '패스트푸드';

    callback(true);
  } else {
    callback(false);
  }
}

exports.menuCategoryCheck = menuCategoryCheck;


function orderDialogCondition(inRaw, inNLP, dialog, context, callback) {
  if(context.botUser.currentDialog && context.botUser.currentDialog.top && context.botUser.currentDialog.top.name == '배달주문')
    callback(true);
  else
    callback(false);
}

exports.orderDialogCondition = orderDialogCondition;
