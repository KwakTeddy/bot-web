
exports.fssRepeater = {
  module: 'task',
  action: 'repeater',
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
      postCallback: function (outJson, json, callback) {
        json.param.pageIndex++;
        for(var i = 0; i < json.doc.length; i++) {
          json.doc[i].companyType = '은행';
          json.doc[i].creditProductType = '일반신용대출';
        }
        callback(json);
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

