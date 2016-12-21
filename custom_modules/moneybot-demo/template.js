var path = require('path');
var utils = require(path.resolve('./modules/bot/action/common/utils'));

exports.control = {
  module: 'task',
  action: 'sequence',
  actions: [
    {
      module: 'template',
      action: 'movies',
      postCallback: function(task, context, callback) {
        callback(task, context);
      }
    },
    {
      module: 'task',
      action: 'if',
      actions: [
        {
          if: "(task.topTask.action == 'sequence')",
          module: 'template',
          action: 'movies',
          preCallback: function(task, context, callback) {
            callback(task, context);
          }
        },
        {
          if: function(task, context) {
            return task.topTask.doc;
          },
          module: 'template',
          action: 'fssSequence',
          preCallback: function(task, context, callback) {
            callback(task, context);
          }
        }
      ]
    },
    {
      module: 'mongo',
      action: 'find',
      save: true,
      mongo: {
        model: 'CreditLoan',
        query: {companyType: '은행', creditProductType: '일반신용대출'},
        sort: "-rate1",
        limit: 5
      },
      preCallback: function(task, context, callback) {
        callback(task, context);
      }
    }
  ]
};

exports.repeat = {
  module: 'task',
  action: 'repeat',
  actions: [
    {
      module: 'mongo',
      action: 'find',
      if: function(task, context) {
        if(! task.currentPage) task.currentPage = 1;
        else task.currentPage++;
        task.totalPage = 4;

        return task.currentPage < task.totalPage;
      },
      preCallback: function(task, context, callback) {
        callback(task, context);
      },
      mongo: {
        model: 'CreditLoan',
        query: {companyType: '은행', creditProductType: '일반신용대출'},
        sort: "-rate1",
        limit: 5
      }
    }
  ]
};

exports.if = {
  module: 'task',
  action: 'if',
  actions: [
    {

      if: "(task.topTask.action == 'sequence')",
      module: 'template',
      action: 'movies',
      preCallback: function(task, context, callback) {
        callback(task, context);
      }
    },
    {
      if: function(task, context) {
        return task.topTask.doc;
      },
      module: 'template',
      action: 'fssSequence',
      preCallback: function(task, context, callback) {
        callback(task, context);
      }
    }
  ]
};

exports.paramCheck = {
  module: 'http',
  action: 'plaintext',
  url: 'https://www.google.com',
  path: '/',
  paramDefs: [
    {type: 'lotteriaMenu', name: 'menu', display: '메뉴', required: true, question: '주문할 메뉴를 말씀해 주세요.'},
    {type: 'count', name: 'orderCount', display: '주문개수', required: true, question: '주문할 개수를 입력해 주세요'}

    // {type: 'address', name: 'address', display: '주소', isReuired: true, question: '주소를 말씀해 주세요.'},
    // {type: 'menu', name: 'menu', display: '메뉴', isReuired: true, question: '주문하실 메뉴를 말씀해 주세요.'},
    // {type: 'mobile', name: 'mobile', display: '휴대폰번호', isReuired: true, question: '휴대폰번호를 말씀해 주세요.'}
  ]
}

exports.smsAuth = {
  module: 'task',
  action: 'sequence',
  actions: [
    //{
    //  module: 'http',
    //  action: 'xpath',
    //  method: 'GET',
    //  url: 'https://homeservice.lotteria.com',
    //  path: '/RIA/member/login.asp',
    //
    //},
    {
      module: 'http',
      action: 'plaintext',
      method: 'POST',
      url: 'https://homeservice.lotteria.com',
//      path: '/RIA/api/json/member/PhoneAuth.json.asp?callback=jQuery182048760307969276484_1470818695295',
      path: '/',
      headers: {
        'Content-type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        Referer: 'https://homeservice.lotteria.com/RIA/member/login.asp'
      },
      param: {
        phone1: '',
        phone2: '',
        phone3: ''
      },
      regexp: {
        doc: {
          //jQuery18200016291653109714588_1470820544969({"seq":"9939311","authCode":"945182","errorCode":"0","errorMsg":"\uC778\uC99D\uBC88\uD638\uAC00 \uBC1C\uC1A1\uB418\uC5C8\uC2B5\uB2C8\uB2E4 \uC7A0\uC2DC \uAE30\uB2E4\uB824\uC8FC\uC138\uC694"})
          callback: /(\w*)\(/g,
          seq: /"seq"\s*:\s*"(\d*)"/g,
          authCode: /"authCode"\s*:\s*"(\d*)"/g
        }
      },
      preCallback: function(outJson, json, callback) {
        json.param.phone1 = outJson.phone1;
        json.param.phone2 = outJson.phone2;
        json.param.phone3 = outJson.phone3;

        callback(json);
      }
    },
    {
      module: 'task',
      action: 'userText'
    },
    {
      module: 'http',
      action: 'plaintext',
      method: 'POST',
      url: 'https://homeservice.lotteria.com',
      //path: '/RIA/api/json/member/PhoneAuth.json.asp?callback=jQuery18200016291653109714588_1470820544969',
      path: '/',
      headers: {
        'Content-type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        Referer: 'https://homeservice.lotteria.com/RIA/member/login.asp'

      },
      param: {
        seq: '',
        phone1: '',
        phone2: '',
        phone3: '',
        authCode: ''
      },
      preCallback: function(outJson, json, callback) {
        json.param.phone1 = '';
        json.param.phone2 = outJson.phone2;
        json.param.phone3 = outJson.phone3;

        json.param.seq = outJson.doc.seq;
        json.param.authCode = outJson.doc.authCode;

        callback(json);
      }
    }

  ]
}

exports.fssRepeater = {
  module: 'task',
  action: 'repeat',
  actions: [
    {
      module: "template",
      action: "fssCredit",
      param: {
        topFinGrpNo: '',
        topFinGrpNoNM: '전체',
        crdtPrdtType: 1,
        crdtPrdtTypeNM: '일반신용대출',
        pageIndex: 1
      },
      postCallback: function (task, context, callback) {
        task.param.pageIndex++;
        for(var i = 0; i < task.doc.length; i++) {
          task.doc[i].companyType = '은행';
          task.doc[i].creditProductType = '일반신용대출';
        }
        callback(task, context);
      }
    }
  ]
};

exports.fssSequence = {
  module: 'task',
  action: 'sequence',
  actions: [
    {
      module: "template",
      action: "fssCredit",
      param: {
        topFinGrpNo: '',
        topFinGrpNoNM: '전체',
        crdtPrdtType: 1,
        crdtPrdtTypeNM: '일반신용대출',
        pageIndex: 1
      }
    },
    {
      module: "template",
      action: "fssCredit",
      param: {
        topFinGrpNo: '',
        topFinGrpNoNM: '전체',
        crdtPrdtType: 1,
        crdtPrdtTypeNM: '일반신용대출',
        pageIndex: 2
      }
    },
    {
      module: "template",
      action: "fssCredit",
      param: {
        topFinGrpNo: '',
        topFinGrpNoNM: '전체',
        crdtPrdtType: 1,
        crdtPrdtTypeNM: '일반신용대출',
        pageIndex: 3
      }
    }
  ]
};

exports.fssCredit = {
  "module": "http",
  "action": "xpathRepeat",
  "method": "POST",
  "url": "http://finlife.fss.or.kr",
  "path": "/creditfacility/selectCreditfacility.do?menuId=2000104",
  "param": {
  "pageType": 3,
    "pageIndex": 1,
    "pageSize": 10,
    "total": 30,
    "listOrder": "crdtGradAvgAsc",
    "menuId":"2000104",
    "BLTN_ID":"BB000000000000000151"
  },
  docMerge: "add",
  "xpath": {
    "repeat": "//table[@class='table_list resTable MyMoneybank01']/tbody/tr[@class='onOffTr']",
    //"limit": "5",
    "doc": {
      "company": "//td[1]/text()",
      "title": "//td[2]/text()",
      "rate1": "//td[4]/text()",
      "rate2": "//td[4]/text()",
      "rate3": "//td[5]/text()",
      "rate4": "//td[5]/text()",
      "rate5": "//td[6]/text()",
      "rate6": "//td[6]/text()",
      "rate7": "//td[7]/text()",
      "rate8": "//td[7]/text()",
      "rate9": "//td[8]/text()",
      "rate10": "//td[8]/text()",
      "rate": "//td[9]/text()"
    },
    "pages": "//div[@class='paginate']/a/text()",
    "currentPage": "//div[@class='paginate']/a[@class='pag-select']/text()"
  }
};

exports.movies = {
  "module": "http",
  "action": "xpathRepeat",
  "url": "http://movie.naver.com",
  "path": "/movie/running/current.nhn?view=list&tab=normal&order=reserve",
  "save": "true",
  "xpath": {
    "repeat": "//ul[@class='lst_detail_t1']/li",
    "limit": "5",
    "doc": {
      "title": "//dt[@class='tit']/a/text()",
      "path": "//dt[@class='tit']/a/@href",
      "director": "//dl[@class='info_txt1']/dd[2]//a/text()",
      "actors": "//dl[@class='info_txt1']/dd[3]//a/text()"
    }
  }
};

exports.movie = {
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
  }
};

