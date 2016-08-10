
exports.creditLoanQuery= {
  module: 'task',
    action: 'sequence',
    actions: [
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
      preCallback: function(outJson, json, callback) {
        json.mongo.query.companyType = outJson.companyType;
        json.mongo.query.creditProductType = outJson.creditProductType;

        if(outJson.credit.search(/10/g) != -1) json.mongo.sort = '-rate10';
        else if(outJson.credit.search(/9/g) != -1) json.mongo.sort = '-rate9';
        else if(outJson.credit.search(/8/g) != -1) json.mongo.sort = '-rate8';
        else if(outJson.credit.search(/7/g) != -1) json.mongo.sort = '-rate7';
        else if(outJson.credit.search(/6/g) != -1) json.mongo.sort = '-rate6';
        else if(outJson.credit.search(/5/g) != -1) json.mongo.sort = '-rate5';
        else if(outJson.credit.search(/4/g) != -1) json.mongo.sort = '-rate4';
        else if(outJson.credit.search(/4/g) != -1) json.mongo.sort = '-rate3';
        else if(outJson.credit.search(/2/g) != -1) json.mongo.sort = '-rate2';
        else if(outJson.credit.search(/1/g) != -1) json.mongo.sort = '-rate1';
        else json.mongo.sort = '-rate';

        callback(json);
      }
    }
  ]
};


exports.fssCreditLoanSave = {
  module: 'task',
    action: 'sequence',
    actions: [
    {
      module: 'task',
      action: 'repeater',
      actions: [
        {
          module: "moneybot",
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
    },
    {
      module: 'task',
      action: 'repeater',
      actions: [
        {
          module: "moneybot",
          action: "fssCredit",
          param: {
            topFinGrpNo: '',
            topFinGrpNoNM: '전체',
            crdtPrdtType: 2,
            crdtPrdtTypeNM: '마이너스한도대출',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '은행';
              json.doc[i].creditProductType = '마이너스한도대출';
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
          action: "fssCredit",
          param: {
            topFinGrpNo: '030300',
            topFinGrpNoNM: '저축은행',
            crdtPrdtType:1,
            crdtPrdtTypeNM:'일반신용대출',
            pageIndex: 1
          },
          postCallback: function(outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '저축은행';
              json.doc[i].creditProductType = '일반신용대출';
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
          action: "fssCredit",
          param: {
            topFinGrpNo: '030200',
            topFinGrpNoNM: '카드/캐피탈',
            crdtPrdtType: 1,
            crdtPrdtTypeNM: '현금서비스',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '카드/캐피탈';
              json.doc[i].creditProductType = '현금서비스';
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
          action: "fssCredit",
          param: {
            topFinGrpNo: '030200',
            topFinGrpNoNM: '카드/캐피탈',
            crdtPrdtType: 3,
            crdtPrdtTypeNM: '카드론',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '카드/캐피탈';
              json.doc[i].creditProductType = '카드론';
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
          action: "fssCredit",
          param: {
            topFinGrpNo: '050000',
            topFinGrpNoNM: '보험회사',
            crdtPrdtType: 1,
            crdtPrdtTypeNM: '일반신용대출',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '보험회사';
              json.doc[i].creditProductType = '일반신용대출';
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
        model: 'CreditLoan',
        schema: {
          companyType: 'String',
          creditProductType: 'String',
          company: 'String',
          title: 'String',
          rate1: 'String',
          rate2: 'String',
          rate3: 'String',
          rate4: 'String',
          rate5: 'String',
          rate6: 'String',
          rate7: 'String',
          rate8: 'String',
          rate9: 'String',
          rate10: 'String',
          rate: 'String'
        },
        query: {company: '', title: ''},
        options: {upsert: true}
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
  "docMerge": "add",
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
