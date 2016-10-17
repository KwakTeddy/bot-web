exports.text = function (task, context, successCallback, errorCallback) {
    successCallback(task, context);
};



exports.kyochon = {
    "module": "http",
    "action": "xpathRepeat",
    "url": "http://www.kyochon.com",
    "path": "/menu/chicken.asp",
    "xpath": {
        "repeat": "//ul[@class='menuProduct']/li",
        "doc": {
            "product": "//dl/dt/text()",
            "price" : "//p[@class='money']/strong/text()"
        }
    },
    postCallback: function(task, context, callback) {
        // console.log(task._text);
        // console.log(task.doc.location + ',' + task.location);
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
