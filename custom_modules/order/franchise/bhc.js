exports.text = function (task, context, successCallback, errorCallback) {
    successCallback(task, context);
};



exports.bhclist = {
    "module": "http",
    "action": "xpathRepeat",
    "url": "http://www.bhc.co.kr",
    "path": "/menu/chicken.asp?menuCate=B0201002",
    "xpath": {
        "repeat": "//div[@class='tabBox']/ul[1]/li",
        "doc": {
            "id": "//a[1]/@onclick"
        }
    },
    postCallback: function(task, context, callback) {
        // console.log(task._text);
        // console.log(task.doc.location + ',' + task.location);
        callback(task, context);
    }
};


exports.bhcSave = {
    module: 'task',
    action: 'sequence',
    actions: [
        {
            module: "bhc",
            action: "bhclist",
            path : "/menu/chicken.asp?menuCate=B0201002",
            param : {
                MENUID : 10578
            },
            postCallback: function (task, context, callback) {
                for(var i = 0; i < task.doc.length; i++) {
                    task.doc[i].sort = '간장/양념/순살'
                }
                callback(task, context);``
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
