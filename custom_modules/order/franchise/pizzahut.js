exports.text = function (task, context, successCallback, errorCallback) {
    successCallback(task, context);
};



exports.pizzahut = {
    "module": "http",
    "action": "xpathRepeat",
    "url": "http://www.pizzahut.co.kr",
    "path": "/portfolio/pizza/pizzaList.do?gbn=01",
    "xpath": {
        "repeat": "//div[@class='thumb_list']/ul/li",
        "doc": {
            "product": "//div[1]/strong/text()",
            "meduium_price" : "//div[1]/div[1]/span[1]/span/b/text()",
            "large_price" : "//div[1]/div[1]/span[2]/span/b/text()"
        }
    },
    postCallback: function(task, context, callback) {
        console.log(task._text);
        console.log(task.doc.location + ',' + task.location);
        callback(task, context);
    }
};


exports.kyochonSave = {
    module: 'task',
    action: 'sequence',
    actions: [
        {
            module: "kyochon",
            action: "kyochon",
            path : "/menu/chicken.asp",

            postCallback: function (task, context, callback) {
                for(var i = 0; i < task.doc.length; i++) {
                    task.doc[i].sort = '치킨'
                }
                callback(task, context);
            }
        },
        {
            module: "kyochon",
            action: "kyochon",
            path : "/menu/side.asp",

            postCallback: function (task, context, callback) {
                for(var i = 0; i < task.doc.length; i++) {
                    task.doc[i].sort = '사이드'
                }
                callback(task, context);
            }
        },
        {
            module: 'mongo',
            action: 'update',
            setData: true,
            docMerge: 'none',
            mongo: {
                model: 'Kyochon',
                schema: {
                    product: 'String',
                    sort: 'String',
                    price: 'String'
                },
                query: {sort: '', product: ''},
                options: {upsert: true}
            },
            preCallback: function(task, context, callback) {
                task.doc = task.topTask.doc;
                callback(task, context);
            }

        }
    ]
};
