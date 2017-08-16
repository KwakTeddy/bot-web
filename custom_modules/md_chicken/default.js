var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('md_chicken');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);


var menu = {
    "후라이드": [
        {
            'name': '후라이드 특대',
            'price': '16000'
        },
        {
            'name': '후라이드 중',
            'price': '13000'
        },
        {
            'name': '후라이드 순살',
            'price': '16000'
        }
    ],
    "양념치킨": [
        {
            'name': '양념치킨 특대',
            'price': '17000'
        },
        {
            'name': '양념치킨 중',
            'price': '14000'
        },
        {
            'name': '양념치킨 순살',
            'price': '17000'
        }
    ],
    "간장치킨": [
        {
            'name': '간장치킨 특대',
            'price': '17000'
        },
        {
            'name': '간장치킨 중',
            'price': '14000'
        },
        {
            'name': '간장치킨 순살',
            'price': '17000'
        }
    ],
    "반반치킨": [
        {
            'name': '간장치킨 특대',
            'price': '17000'
        },
        {
            'name': '간장치킨 중',
            'price': '14000'
        },
        {
            'name': '간장치킨 순살',
            'price': '17000'
        }
    ],
    "두마리치킨": [
        {
            'name': '후라이드 후라이드',
            'price': '19000'
        },
        {
            'name': '후라이드 양념치킨',
            'price': '20000'
        },
        {
            'name': '후라이드 간장치킨',
            'price': '20000'
        },
        {
            'name': '간장치킨 양념치킨',
            'price': '21000'
        }
    ],
    "부위별치킨": [
        {
            'name': '다리 8개',
            'price': '17000'
        },
        {
            'name': '통날개 10개',
            'price': '17000'
        },
        {
            'name': '다리 + 통날개',
            'price': '17000'
        }
    ]
}

var detailMenu = [];

function findName(list, word) {
    for(var key in list)
    {
        if(key.search(word) != -1) return key;
    }
}






var orderSave = {
  action: function (task,context,callback) {
    if(typeof context.dialog.orderList == 'undefined')
    {
      context.dialog.orderList = [];
      context.dialog.ordering = true;
    }

    //context.dialog.orderList.push({name:task['1']+' '+task['2']+' '+task['3']})
    var keyword = task['1'];
    var bigmenu = [];
    if(typeof keyword == "undefined" | keyword == '부위 별') bigmenu = menu.부위별치킨;
    else if(keyword == '두 마리') bigmenu = menu.두마리치킨;
    else {
        eval('bigmenu = menu.' + findName(menu, keyword) );
    }
    for(i=0; i < bigmenu.length; i++){
        if(bigmenu[i].name.search(task['2']) != -1) context.dialog.orderList.push(bigmenu[i]);
    }
      callback(task,context);
	}
};

bot.setTask('orderSave', orderSave);

var saveAddress = {
  action: function (task,context,callback) {
    context.user.address = task['1'];
    callback(task,context);
	}
};

bot.setTask('saveAddress', saveAddress);

var saveMobile = {
  action: function (task,context,callback) {
    context.user.mobile = context.dialog.mobile;
    callback(task,context);
	}
};

bot.setTask('saveMobile', saveMobile);

var selectMenu = {
    action: function (task,context,callback) {
        context.dialog.detailMenuName = findName(menu, task['1']);
        eval('context.dialog.detailMenu = menu.' + context.dialog.detailMenuName);
        detailMenu = context.dialog.detailMenu;
        callback(task,context);
    }
};

bot.setTask('selectMenu', selectMenu);


var detailList = {
    listName: "detailMenu",
    typeCheck: "listTypeCheck"
};

bot.setType('detailList', detailList);


var detailSelect = {
  action: function (task,context,callback) {
    if(typeof context.dialog.orderList == 'undefined')
    {
      context.dialog.orderList = [];
      context.dialog.ordering = true;
    }
    context.dialog.orderList.push(context.dialog.detailList);
    callback(task,context);
	}
};

bot.setTask('detailSelect', detailSelect);
