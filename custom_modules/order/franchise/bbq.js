exports.BBQ = {
    "module": "http",
    // "action": "xpathRepeat",
    "action": "xpath",
    "method": "GET",
    "url": "https://www.bbq.co.kr",
    "path": "/menu_new/menu_list_R.asp?cate=B0101&cate2=&SCHKEY=&SCHTEXT=&catenm=치킨",
    "docMerge": "add",
    // "xpath": {
    //     "repeat": "//div[@class='wrap_goods']/div",
    //     "doc": {
    //         "product": "//div[@class='pt3']/p[1]/text()",
    //         "price": "//div[@class='pt3']/p[@class='pt5']/em/text()"
    //     }
    // },
    "xpath": {
        "doc": {
            "test": "//p[@class='tabL1']/a/span/text()"
            // "price": "//div[@class='pt3']/p[@class='pt5']/em/text()"
        }
    },
    postCallback: function(task, context, callback) {
        // console.log(task._text);
        console.log(task.doc.location + ',' + task.location);
        callback(task, context);
    }
};
