
exports.fssLotteriaSave = {
    module: 'task',
    action: 'sequence',
    actions: [
        {
            module: 'task',
            action: 'repeater',
            actions: [
                {
                    module: "moneybot",
                    action: "fssLotteria",
                    path : "/RIA/homeservice/burger.asp",
                    param: {
                        a: 1798581530,
                        z: 375957775,
                        dl: 'https://homeservice.lotteria.com/RIA/homeservice/burger.asp'
                    },
                    "xpath": {
                        "repeat": "//ul[@class='menu_list']/li[@class='product']",
                        //"limit": "5",
                        "doc": {
                            "soloprice": "//div[@class='cart_wrap']/div[@class='cart_left']/div[1]/label/b/text()",
                            "setprice": "//div[@class='cart_wrap']/div[@class='cart_left']/div[2]/label/b/text()"
                        }

                    },
                    postCallback: function (outJson, json, callback) {
                        for(var i = 0; i < json.doc.length; i++) {
                            json.doc[i].sort = '버거'
                        }
                        callback(json);
                    }
                }
            ]
        },
        {
            module: 'task',
            action: 'repeater',
            actions: [
                {
                    module: "moneybot",
                    action: "fssLotteria",
                    path : "/RIA/homeservice/pack.asp",
                    param: {
                        a: 1891420703,
                        z: 2147133306,
                        dl: 'https://homeservice.lotteria.com/RIA/homeservice/pack.asp'
                    },
                    xpath: {
                        "repeat": "//ul[@class='menu_list']/li[@class='product']",
                        //"limit": "5",
                        "doc": {
                            "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()"
                        }
                    },
                    postCallback: function (outJson, json, callback) {
                        for(var i = 0; i < json.doc.length; i++) {
                            json.doc[i].sort = '팩'
                        }
                        callback(json);
                    }
                }
            ]
        },
        {
            module: 'task',
            action: 'repeater',
            actions: [
                {
                    module: "moneybot",
                    action: "fssLotteria",
                    path : "/RIA/homeservice/chicken.asp",
                    param: {
                        a: 262626634,
                        z: 208966946,
                        dl: 'https://homeservice.lotteria.com/RIA/homeservice/chicken.asp'
                    },
                    xpath: {
                        "repeat": "//ul[@class='menu_list']/li[@class='product']",
                        //"limit": "5",
                        "doc": {
                            "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()"
                        }
                    },
                    postCallback: function (outJson, json, callback) {
                        for(var i = 0; i < json.doc.length; i++) {
                            json.doc[i].sort = '치킨'
                        }
                        callback(json);
                    }
                }
            ]
        },
        {
            module: 'task',
            action: 'repeater',
            actions: [
                {
                    module: "moneybot",
                    action: "fssLotteria",
                    path : "/RIA/homeservice/dessert.asp",
                    param: {
                        a: 766690042,
                        z: 917500388,
                        dl: 'https://homeservice.lotteria.com/RIA/homeservice/dessert.asp'
                    },
                    xpath: {
                        "repeat": "//ul[@class='menu_list']/li[@class='product']",
                        //"limit": "5",
                        "doc": {
                            "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()"
                        }
                    },
                    postCallback: function (outJson, json, callback) {
                        for(var i = 0; i < json.doc.length; i++) {
                            json.doc[i].sort = '디저트'
                        }
                        callback(json);
                    }
                }
            ]
        },
        {
            module: 'task',
            action: 'repeater',
            actions: [
                {
                    module: "moneybot",
                    action: "fssLotteria",
                    path : "/RIA/homeservice/drink.asp",
                    param: {
                        a: 1197707916,
                        z: 23969862,
                        dl: 'https://homeservice.lotteria.com/RIA/homeservice/drink.asp'
                    },
                    xpath: {
                        "repeat": "//ul[@class='menu_list']/li[@class='product']",
                        //"limit": "5",
                        "doc": {
                            "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()"
                        }
                    },
                    postCallback: function (outJson, json, callback) {
                        for(var i = 0; i < json.doc.length; i++) {
                            json.doc[i].sort = '드링크'
                        }
                        callback(json);
                    }
                }
            ]
        },
        {
            module: 'mongo',
            action: 'update',
            setData: true,
            docMerge: 'none',
            mongo: {
                model: 'Deposit',
                schema: {
                    sort: 'String',
                    calories: 'String',
                    price: 'String',
                    soloprice: 'String',
                    setprice: 'String'
                },
                query: {sort: ''},
                options: {upsert: true}
            }
        }
    ]
};

exports.fssLotteria = {
    "module": "http",
    "action": "xpathRepeat",
    "method": "POST",
    "url": "https://homeservice.lotteria.com",
    "path": "/RIA/homeservice/burger.asp",
    "param": {
        "v": 1,
        "_v": "j44",
        "t": "pageview",
        "_s": 1,
        "je": 0,
        "a": 1798581530,
        "z": 375957775,
        "dl": 'https://homeservice.lotteria.com/RIA/homeservice/burger.asp'
    },
    "docMerge": "add",
    "xpath": {
        "repeat": "//ul[@class='menu_list']/li[@class='product']",
        //"limit": "5",
        "doc": {
            "product": "//div[@class='info']/div[@class='name']/p[@class='desc']/text()",
            "calories": "//div[@class='info']/div[@class='name']/p[@class='desc']/span/text()"
        }
    }
};
