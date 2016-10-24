var path = require('path');
var utils = require(path.resolve('./modules/bot/action/common/utils'));
var taskModule = require(path.resolve('./modules/bot/action/common/task'));
var type = require(path.resolve('./modules/bot/action/common/type'));

exports.hoolalaSave = {
    module: 'task',
    action: 'sequence',
    actions: [
        {
            module: "hoolala",
            action: "hoolalaHttp",
            path : "/menu/default.aspx?menu=%uBC14%uBCA0%uD050",
            xpath : {
                repeat: "//div[@class='menu_spa_box']/div[@class='m_menu_big_box']",
                doc: {
                    delivery: "//div[@class='menu_ta_box']/li[@class='menu_price']/span[@class='OrderEA']/div/text()"
                }
            },

            postCallback: function (task, context, callback) {
                for(var i = 0; i < task.doc.length; i++) {

                    // 숫자로 입력해야 해서 , 제거
                    // 숫자로 입력해야 해서 , 제거
                    task.doc[i].price = task.doc[i].price.replace(/,/g, '');
                    task.doc[i].price = task.doc[i].price.replace(/price : /g, '');


                    // if(task.doc[i].optionsPath) {
                    //   task.doc[i].options = [];
                    //
                    //   for(var j = 0; j < task.doc[i].optionsPath.length; j++) {
                    //     task.doc[i].options.push({
                    //       name: task.doc[i].optionsPath[j].childNodes[1].firstChild.toString(),
                    //       price: task.doc[i].optionsPath[j].childNodes[1].childNodes[1].firstChild.toString().replace(/,/g, ''),
                    //       id: task.doc[i].optionsPath[j].childNodes[0].getAttribute('value')
                    //     });
                    //   }
                    //
                    //   task.doc[i].optionsPath = null;
                    // }
                }

                console.log(task._text);
                callback(task, context);
            }
        }]
    //     {
    //         module: "lotteria",
    //         action: "lotteriaHttp",
    //         path : "/menu/default.aspx?menu=%uBC14%uBCA0%uD050%28%uBC18%uBC18%29",
    //         xpath : {
    //             repeat: "//div[@class='menu_spa_box']/div[@class='m_menu_big_box']",
    //             doc: {
    //                 delivery: "//div[@class='menu_ta_box']/li[@class='menu_price']/span[@class='OrderEA']/div/text()"
    //             }
    //         },
    //         postCallback: function (task, context, callback) {
    //             for(var i = 0; i < task.doc.length; i++) {
    //                 task.doc[i].franchise = '57e36d5d1d9ef766042083a3';      // 관리자에서 프랜차이즈 아이디확인 수정시에 주소창에서 확인
    //                 task.doc[i].category = ['치킨'];
    //                 task.doc[i].price = task.doc[i].price.replace(/,/g, '');
    //             }
    //             callback(task, context);
    //         }
    //     },
    //     {
    //         module: "lotteria",
    //         action: "lotteriaHttp",
    //         path : "/RIA/homeservice/chicken.asp",
    //         xpath: {
    //             repeat: "//ul[@class='menu_list']/li[@class='product']",
    //             doc: {
    //                 name: '//p[@class="desc"]/text()',
    //                 price: "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()",
    //                 id: '//div[@class="cart_left"]/span/input/@value'
    //             }
    //         },
    //         postCallback: function (task, context, callback) {
    //             for(var i = 0; i < task.doc.length; i++) {
    //                 task.doc[i].franchise = '57dcafc489f921a81474455e';      // 관리자에서 프랜차이즈 아이디확인 수정시에 주소창에서 확인
    //                 task.doc[i].category = ['치킨'];
    //                 task.doc[i].price = task.doc[i].price.replace(/,/g, '');
    //             }
    //             callback(task, context);
    //         }
    //     },
    //     {
    //         module: "lotteria",
    //         action: "lotteriaHttp",
    //         path : "/RIA/homeservice/dessert.asp",
    //         xpath: {
    //             repeat: "//ul[@class='menu_list']/li[@class='product']",
    //             doc: {
    //                 name: '//p[@class="desc"]/text()',
    //                 price: "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()",
    //                 id: '//div[@class="cart_left"]/span/input/@value'
    //             }
    //         },
    //         postCallback: function (task, context, callback) {
    //             for(var i = 0; i < task.doc.length; i++) {
    //                 task.doc[i].franchise = '57dcafc489f921a81474455e';      // 관리자에서 프랜차이즈 아이디확인 수정시에 주소창에서 확인
    //                 task.doc[i].category = ['디저트'];
    //                 task.doc[i].price = task.doc[i].price.replace(/,/g, '');
    //             }
    //             callback(task, context);
    //         }
    //     },
    //     {
    //         module: "lotteria",
    //         action: "lotteriaHttp",
    //         path : "/RIA/homeservice/drink.asp",
    //         xpath: {
    //             repeat: "//ul[@class='menu_list']/li[@class='product']",
    //             doc: {
    //                 name: '//p[@class="desc"]/text()',
    //                 price: "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()",
    //                 id: '//div[@class="cart_left"]/span/input/@value'
    //             }
    //         },
    //         postCallback: function (task, context, callback) {
    //             for(var i = 0; i < task.doc.length; i++) {
    //                 task.doc[i].franchise = '57dcafc489f921a81474455e';      // 관리자에서 프랜차이즈 아이디확인 수정시에 주소창에서 확인
    //                 task.doc[i].category = ['드링크'];
    //                 task.doc[i].price = task.doc[i].price.replace(/,/g, '');
    //             }
    //             callback(task, context);
    //         }
    //     },
    //     {
    //         module: 'mongo',
    //         action: 'update',
    //         setData: true,
    //         docMerge: 'none',
    //         mongo: {
    //             model: 'FranchiseMenu',
    //             // schema: {
    //             //   title: 'String',
    //             //   sort: 'String',
    //             //   price: 'String',
    //             //   id: 'String',
    //             //   options: Array
    //             //   // options: [
    //             //   //   {
    //             //   //     name: 'String',
    //             //   //     price: 'String',
    //             //   //     id: 'String'
    //             //   //   }
    //             //   // ]
    //             // },
    //             query: {category: '', name: ''},
    //             options: {upsert: true}
    //         },
    //         preCallback: function(task, context, callback) {
    //             task.doc = task.topTask.doc;
    //             callback(task, context);
    //         }
    //
    //     }
    // ]
};
// /menu/default.aspx?menu=%uBC14%uBCA0%uD050

exports.hoolalaHttp = {
    module: "http",
    action: "xpathRepeat",
    method: "POST",
    url: "http://www.hoolala.co.kr/menu/default.aspx?menu=%uBC14%uBCA0%uD050",
    path: "/menu/default.aspx?menu=%uBC14%uBCA0%uD050",
    docMerge: "add",
    xpath: {
        repeat: "//div[@class='menu_spa_box']/div[@class='m_menu_big_box']",
        doc: {
            product: "//ul[@class='menu_ta_box']/li[@class='m_menu_text menu_s_title']/text()",
            price: "//ul[@class='menu_ta_box']/li[@class='menu_price menu_s_price']/text()"
        }
    }
};
