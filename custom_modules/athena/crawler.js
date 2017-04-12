var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('athena');
var async = require('async');

var lgcate1= {
  module: 'http',
  action: "simpleRequest",
  uri: "https://www.lgservice.co.kr/main.do#none",
  method: 'GET',
  xpath: {
    _repeat: '//*[@id="container"]/div[2]/div[1]/div/ul/li',
    pane: {
      _repeat: './ul/li',
      cate1: './h3/text()', //휴대폰
      cate2: {
        _repeat: './ul/li',
        catecode: './a/@data-catecode',
        catename: './a/@data-catename',
        parentcatename: './a/@data-parentcatename',
        parentcatecode: './a/@data-parentcatecode',
      },
    },
  },
  postCallback: function (task, context, callback) {
    // catecode, parentcatecode
    var result = [];
    task.doc.forEach(function(p) {
      p.pane.forEach(function(c1) {
        c1.cate2.forEach(function(c2) {
          result.push(c2);
        })
      });
    });
    task.topTask.cate1 = result;
    console.log(JSON.stringify(result));
    callback(task, context);
  }
};
bot.setTask("lgcate1", lgcate1);
exports.lgcate1 = lgcate1;

var lgcate2= {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.lgservice.co.kr/main/selectKeyWordList.do',
  method: 'POST',
  param: {
    "catecode":"C000136",
    "parentcatecode":"1018",
  },
  postCallback: function (task, context, callback) {
    //keyword
    task.topTask.cate2 = task.doc.keyWordList;
    console.log(JSON.stringify(task.doc));
    callback(task, context);
  }
};

bot.setTask("lgcate2", lgcate2);
exports.lgcate2 = lgcate2;

var lglist = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.lgservice.co.kr/keywordSearch/simpleEasySearchPage.do',
  method: 'GET',
  param: {
    "selectKeyWord": "기구/HW",
    "category1" : 1018,
    "category2" : "C000136",
    "currentPageNo" : 1,
  },
  xpath: {
    num: '//*[@id="listCmp"]/em/text()',
    list: {
      _repeat: '//*[@id="container"]/div[2]/div[2]/div[4]/ul/li',
      link: './/div/p[1]/a/@onclick',
      title: './/div/p[1]/a/text()',
    }
  },
  postCallback: function (task, context, callback) {
    task.doc.list.forEach(function(d) {
      var res = d.link.match(/'\w+'/g);
      d.seq = res[0];
      d.itemId = res[1];
      d.gubun = res[2];
    });
    task.topTask.list = task.doc.list;
    console.log(JSON.stringify(task.doc));
    callback(task, context);
  }
};

bot.setTask("lglist", lglist);
exports.lglist = lglist;

var lgitem = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.lgservice.co.kr/simple/selectSimpleSearchDetail.do',
  method: 'GET',
  xpath: {
    title: '//*[@id="container"]/div[2]/div[1]/div[1]/div[1]/h3/text()',
    content: '//*[@id="container"]/div[2]/div[1]/div[1]/div[2]',
  },
  // param: {
  //   "gubun": "SCS",
  //   "seq": "26860",
  //   "itemId": "_190Z19N1I7XZD",
  //   "type": "keyword"
  // },
  // param: {
  //   "gubun": "SCS",
  //   "seq" : 2340,
  //   "itemId": "1308377241130",
  //   "type": "keyword",
  // },
  // param: {
  //   "gubun": "SCS",
  //   "seq" : 9418,
  //   "itemId": "20150138004197",
  //   "type": "keyword",
  // },
  // param: {
  //   "gubun": "SCS",
  //   "seq" : 6201,
  //   "itemId": "1778886",
  //   "type": "keyword",
  // },
  param: {
    "gubun": "SCS",
    "seq" : 26829,
    "itemId": "_0371ZTRX1YDCB",
    "type": "keyword",
  },
  postCallback: function (task, context, callback) {
    var item = {};
    item.title = task.doc.title.trim();

    var collector = "";
    var handleChildren = function(node) {
      if (node.data) {
        collector += node.data;
      }
      if (node.childNodes) {
        for (var i=0; i < node.childNodes.length; ++i) {
          handleChildren(node.childNodes[i], collector);
        }
      }
    };

    if (task.doc.content) {
      task.doc.content.forEach(function (c) {
        handleChildren(c);
      });
      item.body = collector;
    } else {
      item.body = "";
    }
    item.body = item.body.trim();
    item.body = item.body.replace(/&amp;nbsp;|&nbsp;|\t|\r\n|\r|\n/g, ' ');
    item.body = item.body.replace(/<br>/g, ' ');

    item.cate1 = task.topTask.c1.parentcatename;
    item.cate2 = task.topTask.c1.catename;
    item.keyword = task.topTask.c2.keyword;

    task.topTask.data.push(item);
    callback(task, context);
  }
};
bot.setTask("lgitem", lgitem);
exports.lgitem = lgitem;

var categoryOnly = true;

var lgcrawl = {
  module: 'task',
  action: 'sequence',
  preCallback: function(task, context, callback) {
    task.topTask.doc = [];
    task.topTask.cate1 = [];
    task.topTask.cate2 = [];
    task.topTask.data = [];

    task.topTask.cate1_idx = -1;

    callback(task, context);
  },
  actions: [
    {
      template: lgcate1,
    },
    {
      module: 'task',
      action: 'while',
      whileIf: function(task, context) {
        if (++task.topTask.cate1_idx < task.topTask.cate1.length) {
          return true;
        }
        return false;
      },
      actions: [
        {
          module: 'task',
          action: 'sequence',
          actions: [
            {
              template:lgcate2,
              preCallback: function (task, context, callback) {
                task.topTask.cate2_idx = -1;
                task.topTask.cate2_idx_cate = -1;

                task.topTask.c1 = task.topTask.cate1[task.topTask.cate1_idx];
                task.param =  task.topTask.c1;
                callback(task, context);
              }
            },
            // store cate1 parentcatename
            {
              module: 'mongo',
              action: 'update',
              mongo: {
                model: 'concepts',
                query: {parent:'', name:''},
                options: {upsert: true}
              },
              preCallback: function (task, context, callback) {
                task.doc = {};
                task.doc.name = task.topTask.c1.parentcatename;
                task.doc.parent = null;
                callback(task, context);
              },
              postCallback: function(task, context, callback) {
                task.topTask.parentId = task.numAffected.upserted[0]._id;
                callback(task, context);
              }
            },
            // store cate1 catename
            {
              module: 'mongo',
              action: 'update',
              mongo: {
                model: 'concepts',
                query: {parent:'', name:''},
                options: {upsert: true}
              },
              preCallback: function (task, context, callback) {
                task.doc = {};
                task.doc.parent = '';
                task.doc.parent = task.topTask.parentId;
                task.doc.name = task.topTask.c1.catename;
                callback(task, context);
              },
              postCallback: function(task, context, callback) {
                task.topTask.parentId = task.numAffected.upserted[0]._id;
                callback(task, context);
              }
            },
            {
              module: 'task',
              action: 'while',
              whileIf: function(task, context) {
                if (!categoryOnly)
                  return false;
                if (++task.topTask.cate2_idx_cate < task.topTask.cate2.length) {
                  return true;
                }
                return false;
              },
              actions: [
                //store cate2 keyword
                {
                  module: 'mongo',
                  action: 'update',
                  mongo: {
                    model: 'concepts',
                    query: {parent:'', name:''},
                    options: {upsert: true}
                  },
                  preCallback: function (task, context, callback) {
                    task.doc = {};
                    task.topTask.c2 = task.topTask.cate2[task.topTask.cate2_idx_cate];
                    task.doc.parent = task.topTask.parentId;
                    task.doc.name = task.topTask.c2.keyword;
                    callback(task, context);
                  },
                  postCallback: function (task, context, callback) {
                    task.topTask.c2._id = task.numAffected.upserted[0]._id;
                    callback(task, context);
                  }
                }
              ]
            },
            {
              module: 'task',
              action: 'while',
              whileIf: function(task, context) {
                if (++task.topTask.cate2_idx < task.topTask.cate2.length) {
                  return true;
                }
                return false;
              },
              actions: [
                {
                  module: 'task',
                  action: 'sequence',
                  actions: [
                    {
                      preCallback: function(task, context, callback) {
                        task.topTask.c2 = task.topTask.cate2[task.topTask.cate2_idx];

                        task.topTask.param = {};
                        task.topTask.param.selectKeyWord = task.topTask.c2.keyword;
                        task.topTask.param.category1 = task.topTask.c1.parentcatecode;
                        task.topTask.param.category2 = task.topTask.c1.catecode;
                        task.topTask.param.currentPageNo = 1;

                        task.param = task.topTask.param;

                        callback(task,context);
                      },
                      template: lglist,
                      postCallback: function(task, context, callback) {
                        task.topTask.listCount = task.doc.num;
                        task.topTask.curPage = 0;
                        callback(task,context);
                      }
                    },
                    {
                      module: 'task',
                      action: 'while',
                      whileIf: function(task, context) {
                        if (++task.topTask.curPage <= task.topTask.listCount/10) {
                          return true;
                        }
                        return false;
                      },
                      actions: [
                        {
                          module:'task',
                          action:'sequence',
                          actions: [
                            {
                              template: lglist,
                              preCallback: function (task, context, callback) {
                                task.param =  task.topTask.param;
                                task.param.currentPageNo = task.topTask.curPage;
                                callback(task, context);
                              }
                            },
                            {
                              module: 'task',
                              action: 'while',
                              preCallback: function (task, context, callback) {
                                task.topTask.cur = -1;
                                callback(task,context);
                              },
                              whileIf: function(task, context) {
                                if (++task.topTask.cur < task.topTask.list.length) {
                                  return true;
                                }
                                return false;
                              },
                              actions: [
                                {
                                  module: 'task',
                                  action: 'sequence',
                                  actions: [
                                    {
                                      preCallback: function(task, context, callback) {
                                        var curItem = task.topTask.list[task.topTask.cur];
                                        task.param.gubun = curItem.gubun.replace(/['"]+/g, '');
                                        task.param.type = "keyword";
                                        task.param.seq = curItem.seq.replace(/['"]+/g, '');
                                        task.param.itemId = curItem.itemId.replace(/['"]+/g, '');
                                        callback(task,context);
                                      },
                                      template:lgitem
                                    },
                                    {
                                      module: 'mongo',
                                      action: 'update',
                                      mongo: {
                                        model: 'lgfaqs',
                                        query: {cate1:'', cate2:'', keyword:'', title: '', body: '', conceptId: ''},
                                        options: {upsert: true}
                                      },
                                      preCallback: function (task, context, callback) {
                                        task.doc = task.topTask.data[task.topTask.data.length-1];
                                        task.doc.conceptId = task.topTask.c2._id;
                                        console.log("SAVED:" + JSON.stringify(task.doc));
                                        callback(task, context);
                                      }
                                    }
                                  ]
                                }
                              ]
                            }
                          ],
                        }
                      ]
                    }
                  ],
                }
              ]
            }
          ]
        }
      ]
    },
  ]
};

bot.setTask("lgcrawl", lgcrawl);
exports.lgcrawl = lgcrawl;


