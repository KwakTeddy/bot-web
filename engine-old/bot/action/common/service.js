var task = require('./task');

exports.execute = execute;

function execute(action, botName, user, inJson, outJson, successCallback, errorCallback, template) {
  //outJson.actionLimit = 2;
  //outJson.actions = [
  //  {
  //    "module": "template",
  //    "action": "fssCredit",
  //    "param": {
  //      "pageIndex": 1
  //    },
  //
  //    "preCallback": function(outJson, json, callback) {
  //      console.log('preCallback');
  //      callback(outJson);
  //    },
  //    "postCallback": function(outJson, json, callback) {
  //      json.param.pageIndex++;
  //      callback(json);
  //    }
  //  }
  //];
  //
  //task.execute('repeater', botName, user, inJson, outJson, successCallback, errorCallback, template);

  //var actions = {
  //  module: 'task',
  //  action: 'sequence',
  //  actions: [
  //    {
  //      module: 'task',
  //      action: 'sequence',
  //      actions: [
  //        {
  //          "module": "template",
  //          "action": "fssCredit",
  //          "param": {
  //            "pageIndex": 1
  //          }
  //        },
  //        {
  //          "module": "template",
  //          "action": "fssCredit",
  //          "param": {
  //            "pageIndex": 2
  //          }
  //        },
  //        {
  //          "module": "template",
  //          "action": "fssCredit",
  //          "param": {
  //            "pageIndex": 3
  //          }
  //        }]
  //    },
  //    {
  //      'module': 'mongo',
  //      'action': 'save',
  //      'mongo': {
  //        'model': 'FinProduct',
  //        'schema': {
  //          company: 'String',
  //          title: 'String',
  //          rate: 'String'
  //        }
  //      }
  //    }
  //  ]
  //};


  outJson.actions= [
    {
      module: 'task',
      action: 'sequence',
      actions: [
        {
          "module": "template",
          "action": "fssCredit",
          "param": {
            "pageIndex": 1
          }
        },
        {
          "module": "template",
          "action": "fssCredit",
          "param": {
            "pageIndex": 2
          }
        },
        {
          "module": "template",
          "action": "fssCredit",
          "param": {
            "pageIndex": 3
          }
        }]
    },
    {
      'module': 'mongo',
      'action': 'save',
      setData: true,
      'mongo': {
        'model': 'FinProduct',
        'schema': {
          company: 'String',
          title: 'String',
          rate: 'String'
        }
      }
    }
  ];

  //outJson.actions = [
  //  {
  //    "module": "template",
  //    "action": "fssCredit",
  //    "param": {
  //      "pageIndex": 1
  //    }
  //  },
  //  {
  //    "module": "template",
  //    "action": "fssCredit",
  //    "param": {
  //      "pageIndex": 2
  //    }
  //  },
  //  {
  //    "module": "template",
  //    "action": "fssCredit",
  //    "param": {
  //      "pageIndex": 3
  //    }
  //  }
  //];

  //outJson.actions = [
  //  {
  //    "module": "http",
  //    "action": "xpathRepeat",
  //    "method": "POST",
  //    "url": "http://finlife.fss.or.kr",
  //    "path": "/creditfacility/selectCreditfacility.do?menuId=2000104",
  //    "param": {
  //      "pageType": 3,
  //      "pageIndex": 1,
  //      "pageSize": 10,
  //      "total": 30,
  //      "crdtPrdtTypeNM": "전체",
  //      "listOrder": "crdtGradAvgAsc",
  //      "menuId":"2000104",
  //      "BLTN_ID":"BB000000000000000151"
  //    },
  //    "docMerge": "add",
  //    "xpath": {
  //      "repeat": "//table[@class='table_list resTable MyMoneybank01']/tbody/tr[@class='onOffTr']",
  //      //"limit": "5",
  //      "doc": {
  //        "company": "//td[1]/text()",
  //        "title": "//td[2]/text()",
  //        "rate": "//td[4]/text()"
  //      }
  //    }
  //  },
  //  {
  //    "module": "http",
  //    "action": "xpathRepeat",
  //    "method": "POST",
  //    "url": "http://finlife.fss.or.kr",
  //    "path": "/creditfacility/selectCreditfacility.do?menuId=2000104",
  //    "param": {
  //      "pageType": 3,
  //      "pageIndex": 2,
  //      "pageSize": 10,
  //      "total": 30,
  //      "crdtPrdtTypeNM": "전체",
  //      "listOrder": "crdtGradAvgAsc",
  //      "menuId":"2000104",
  //      "BLTN_ID":"BB000000000000000151"
  //    },
  //    "docMerge": "add",
  //    "xpath": {
  //      "repeat": "//table[@class='table_list resTable MyMoneybank01']/tbody/tr[@class='onOffTr']",
  //      //"limit": "5",
  //      "doc": {
  //        "company": "//td[1]/text()",
  //        "title": "//td[2]/text()",
  //        "rate": "//td[4]/text()"
  //      }
  //    }
  //  },
  //  {
  //    "module": "http",
  //    "action": "xpathRepeat",
  //    "method": "POST",
  //    "url": "http://finlife.fss.or.kr",
  //    "path": "/creditfacility/selectCreditfacility.do?menuId=2000104",
  //    "param": {
  //      "pageType": 3,
  //      "pageIndex": 3,
  //      "pageSize": 10,
  //      "total": 30,
  //      "crdtPrdtTypeNM": "전체",
  //      "listOrder": "crdtGradAvgAsc",
  //      "menuId":"2000104",
  //      "BLTN_ID":"BB000000000000000151"
  //    },
  //    "docMerge": "add",
  //    "xpath": {
  //      "repeat": "//table[@class='table_list resTable MyMoneybank01']/tbody/tr[@class='onOffTr']",
  //      //"limit": "5",
  //      "doc": {
  //        "company": "//td[1]/text()",
  //        "title": "//td[2]/text()",
  //        "rate": "//td[4]/text()"
  //      }
  //    }
  //  }
  //];

  //outJson.actions = [
  //  {'module': require('http'), 'action': 'json', 'docType': 'add', 'preHandler': function(json) {json.page=1;}},
  //  {'module': require('http'), 'action': 'json', 'docType': 'add', 'preHandler': function(json) {json.page=2;}},
  //  {'module': require('http'), 'action': 'json', 'docType': 'add', 'preHandler': function(json) {json.page=3;}}
  //];

  task.execute('sequence', botName, user, inJson, outJson, successCallback, errorCallback, template);

}

var service = {
  sites: [
    {name: 'moneta', isMeta: true,

      typeConvertor: {
        category: {
          in: {'credit': 'sinyong', 'mortage': 'budongsan'},
          out: {'credit': 'sinyong', 'mortage': 'budongsan'}
        },
        category2: {
          in: function(txt) {if (txt == 'credit') return 'sinyong';},
          out: function(txt) {if (txt == 'sinyong') return 'credit';}
        },
        rate: {
          in: {'*.%': '$1'},
          out: {'*.%': '$1'}
        }
      },

      "repeat": {
        "module": "http",
        "action": "xpathRepeat",
        "url": "http://movie.naver.com",
        "path": "/movie/running/current.nhn?view=list&tab=normal&order=reserve",
        param: {category: '+credit+', order: '-rate'},
        "xpath": {
          "repeat": "//ul[@class='lst_detail_t1']/li",
          "limit": "5",
          "doc": {
            "title": "//dt[@class='tit']/a/text()",
            "path": "//dt[@class='tit']/a/@href",
            "director": "//dl[@class='info_txt1']/dd[2]//a/text()",
            "actors": "//dl[@class='info_txt1']/dd[3]//a/text()"
          },
          regexp: {
            "title": "//dt[@class='tit']/a/text()",
            "path": "//dt[@class='tit']/a/@href",
            "director": "//dl[@class='info_txt1']/dd[2]//a/text()",
            "actors": "//dl[@class='info_txt1']/dd[3]//a/text()"

          }
        },
        ttl: 60
      },

      "one": {
        "module": "http",
        "action": "xpathByIndex",
        "url": "http://movie.naver.com",
        "xpath": {
          "doc": {
            "title": "//div[@class='mv_info']/h3[@class='h_movie']/a[1]/text()",
            "director": "//dl[@class='info_spec']/dd[2]/p/a/text()",
            "actors": "//dl[@class='info_spec']/dd[3]/p/a/text()",
            "poster_img": "//div[@class='poster']//img/@src"
          }
        },
        ttl: 60
      }

    },

    {name: 'shinhan', isMeta: true, list_url: 'http://', detail_url: 'http://'}
  ],
  joner: {

  },
  config: {
    'mongo': {
      db: 'bot',
      collections: 'products'
    },
    dbCache: true,
    ttl: 60
  },
  model: {
    name: {type: String, default: '', required: 'name is required'},
    category: {type: String, default: '', required: ''}
  }
};



