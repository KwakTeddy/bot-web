
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
        sort: {'rate1': +1},
        limit: 5
      },
      preCallback: function(outJson, json, callback) {
        json.mongo.query.companyType = outJson.companyType;
        json.mongo.query.creditProductType = outJson.creditProductType;
        json.mongo.query[outJson.rate] = {$ne: '-'};

        if(outJson.credit.search(/10/g) != -1) json.mongo.sort = {'rate10': +1};
        else if(outJson.credit.search(/9/g) != -1) json.mongo.sort = {'rate9': +1};
        else if(outJson.credit.search(/8/g) != -1) json.mongo.sort = {'rate8': +1};
        else if(outJson.credit.search(/7/g) != -1) json.mongo.sort = {'rate7': +1};
        else if(outJson.credit.search(/6/g) != -1) json.mongo.sort = {'rate6': +1};
        else if(outJson.credit.search(/5/g) != -1) json.mongo.sort = {'rate5': +1};
        else if(outJson.credit.search(/4/g) != -1) json.mongo.sort = {'rate4': +1};
        else if(outJson.credit.search(/3/g) != -1) json.mongo.sort = {'rate3': +1};
        else if(outJson.credit.search(/2/g) != -1) json.mongo.sort = {'rate2': +1};
        else if(outJson.credit.search(/1/g) != -1) json.mongo.sort = {'rate1': +1};
        else json.mongo.sort = {rate: +1};

        callback(json);
      }
    }
  ]
};

// exports.MortgageTest = {
//   module: 'task',
//   action: 'sequence',
//   actions: [
//     {
//       module: 'mongo',
//       action: 'find',
//       save: true,
//       mongo: {
//         model: 'MortgageLoan',
//         query: {sorthouse: '아파트'},
//         sort: {lowinterest: +1},
//         limit: 5
//       }
//     }
//   ]
// }


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
    "pageSize": 50,
    "pageUnit": 50,
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

exports.MortgageLoanQuery= {
  module: 'task',
  action: 'sequence',
  actions: [
    {
      module: 'mongo',
      action: 'find',
      save: true,
      mongo: {
        model: 'MortgageLoan',
        query: {companyType: '은행', sorthouse: '아파트'},
        sort: {lowinterest: +1},
        limit: 5
      },
      preCallback: function(outJson, json, callback) {
        if(outJson.companyType == '전체') delete json.mongo.query.companyType;
        else json.mongo.query.companyType = outJson.companyType;
        if(outJson.sorthouse == '전체') delete json.mongo.query.sorthouse;
        else json.mongo.query.sorthouse = outJson.sorthouse;

        callback(json);
      }
    }
  ]
};

exports.fssMortgageLoanSave = {
  module: 'task',
  action: 'sequence',
  actions: [
    {
      module: 'task',
      action: 'repeater',
      actions: [
        {
          module: "moneybot",
          action: "fssMortgage",
          param: {
            topFinGrpNo: '030300',
            topFinGrpNoNM: '저축은행',
            mrtgTypeNM: '아파트',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            // console.log('./////////////////////////////////');
            // console.log(JSON.stringify(outJson));
            // console.log(JSON.stringify(json));
            //
            // if(outJson.doc) {
            //   console.log('//////////////////TH : ' + outJson.doc.totalCnt);
            // }
            // if(outJson.doc.totalCnt) {
            //   var lastPage = makePages(outJson.doc.totalCnt, outJson.doc.pageSize);
            //   if(outJson.doc.pages) {
            //     outJson.doc.pages[outJson.doc.pages.length-1] = lastPage;
            //   }
            //   console.log(outJson.doc.totalCnt + ',' + outJson.doc.pageSize);
            //   console.log(lastPage);
            // }

            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '저축은행';
              json.doc[i].sorthouse = '아파트';
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
          action: "fssMortgage",
          param: {
            topFinGrpNo: '020000',
            topFinGrpNoNM: '은행',
            mrtgTypeNM: '아파트',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '은행';
              json.doc[i].sorthouse = '아파트';
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
          action: "fssMortgage",
          param: {
            topFinGrpNo: '050000',
            topFinGrpNoNM: '보험',
            mrtgTypeNM: '아파트',
            pageIndex: 1
          },
          postCallback: function(outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '보험';
              json.doc[i].sorthouse = '아파트';
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
          action: "fssMortgage",
          param: {
            topFinGrpNo: '020000',
            topFinGrpNoNM: '은행',
            mrtgTypeNM: '아파트외',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '은행';
              json.doc[i].sorthouse = '아파트외';
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
          action: "fssMortgage",
          param: {
            topFinGrpNo: '030300',
            topFinGrpNoNM: '저축은행',
            mrtgTypeNM: '아파트외',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '저축은행';
              json.doc[i].sorthouse = '아파트외';
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
          action: "fssMortgage",
          param: {
            topFinGrpNo: '050000',
            topFinGrpNoNM: '보험',
            mrtgTypeNM: '아파트외',
            pageIndex: 1
          },
          postCallback: function(outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '보험';
              json.doc[i].sorthouse = '아파트외';
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
        model: 'MortgageLoan',
        schema: {
          companyType: 'String',
          creditProductType: 'String',
          company: 'String',
          title: 'String',
          sorthouse: 'String',
          sortinterest: 'String',
          sortexchange: 'String',
          lowinterest: 'String',
          highinterest: 'String',
          lastinterest: 'String',
          meanexchange: 'String'
        },
        query: {company: '', title: '', sortinterest: '', sortexchange: ''},
        options: {upsert: true}
      }
    }
  ]
};

exports.fssMortgage = {
  "module": "http",
  "action": "xpathRepeat",
  "method": "POST",
  "url": "http://finlife.fss.or.kr",
  "path": "/mortagageloan/selectMortagageLoan.do?menuId=2000102",
  "param": {
    "pageType": "ajax",
    "pageIndex": 1,
    "pageSize": 50,
    "pageUnit": 50,
    "lendRateType":"",
    "rpayType": "",
    "areaCd": "",

    "listOrder": "lendRateMinAsc",
    "menuId":"2000102",
    "BLTN_ID":"BB000000000000000133"
  },
  "docMerge": "add",
  "xpath": {
    "repeat": "//table[@class='table_list resTable']/tbody/tr[@class='onOffTr']",
    //"limit": "5",
    "doc": {
      "company": "//td[2]/text()",
      "title": "//td[3]/text()",
      "sorthouse": "//td[4]/text()",
      "sortinterest": "//td[5]/text()",
      "sortexchange": "//td[6]/text()",
      "lowinterest": "//td[7]/text()",
      "highinterest": "//td[8]/text()",
      "lastinterest": "//td[9]/text()",
      "meanexchange": "//td[10]/text()"
    },
    // "totalCnt" : "//span[@id='totalCnt']/text()",
    // "pageSize" : "//input[@name='pageSize']/@value",
    "pages": "//div[@class='paginate']/a/text()",
    "currentPage": "//div[@class='paginate']/a[@class='pag-select']/text()"
  }
};


// function makePages(total, pageSize) {
//   var pages = '';
//   var pageCount = total / pageSize;
//   if(total % pageSize > 0) {
//     pageCount += 1;
//   }
//   // for(var i=0; i<pageCount; i++) {
//   //   pages += ('' + (i+1));
//   // }
//   // return pages;
//   return pageCount;
// }

exports.RentQuery= {
  module: 'task',
  action: 'sequence',
  actions: [
    {
      module: 'mongo',
      action: 'find',
      save: true,
      mongo: {
        model: 'Rent',
        query: {companyType: '은행'},
        sort: {lowinterest: +1},
        limit: 5
      },
      preCallback: function(outJson, json, callback) {
        if(outJson.companyType == '전체') delete json.mongo.query.companyType;
        else json.mongo.query.companyType = outJson.companyType;

        callback(json);
      }
    }
  ]
};

exports.fssRentSave = {
  module: 'task',
  action: 'sequence',
  actions: [
    {
      module: 'task',
      action: 'repeater',
      actions: [
        {
          module: "moneybot",
          action: "fssRent",
          param: {
            topFinGrpNo: '020000',
            topFinGrpNoNM: '은행',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '은행';
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
          action: "fssRent",
          param: {
            topFinGrpNo: '030300',
            topFinGrpNoNM: '저축은행',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '저축은행';
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
          action: "fssRent",
          param: {
            topFinGrpNo: '050000',
            topFinGrpNoNM: '보험',
            pageIndex: 1
          },
          postCallback: function(outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '보험';
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
        model: 'Rent',
        schema: {
          companyType: 'String',
          creditProductType: 'String',
          company: 'String',
          title: 'String',
          sorthouse: 'String',
          sortinterest: 'String',
          sortexchange: 'String',
          lowinterest: 'String',
          highinterest: 'String',
          lastinterest: 'String',
          meanexchange: 'String'
        },
        query: {company: '', title: '', sortinterest: '', sortexchange: ''},
        options: {upsert: true}
      }
    }
  ]
};

exports.fssRent = {
  "module": "http",
  "action": "xpathRepeat",
  "method": "POST",
  "url": "http://finlife.fss.or.kr",
  "path": "/rentsubsidy/selectRentSubsidy.do?menuId=2000103",
  "param": {
    "pageType": "ajax",
    "pageIndex": 1,
    "pageSize": 50,
    "pageUnit": 50,
    "lendRateType":"",
    "rpayType": "",
    "areaCd": "",
    "listOrder": "lendRateMinAsc",
    "menuId":"2000103",
    "BLTN_ID":"BB000000000000000150"
  },
  "docMerge": "add",
  "xpath": {
    "repeat": "//table[@class='table_list resTable']/tbody/tr[@class='onOffTr']",
    //"limit": "5",
    "doc": {
      "company": "//td[2]/text()",
      "title": "//td[3]/text()",
      "sortinterest": "//td[4]/text()",
      "sortexchange": "//td[5]/text()",
      "lowinterest": "//td[6]/text()",
      "highinterest": "//td[7]/text()",
      "lastinterest": "//td[8]/text()",
      "meanexchange": "//td[9]/text()"
    },
    "pages": "//div[@class='paginate']/a/text()",
    "currentPage": "//div[@class='paginate']/a[@class='pag-select']/text()"
  }
};

exports.DepositQuery= {
  module: 'task',
  action: 'sequence',
  actions: [
    {
      module: 'mongo',
      action: 'find',
      save: true,
      mongo: {
        model: 'Deposit',
        query: {companyType: '은행', period: '6개월'},
        sort: {afterrealmoney: -1},
        limit: 5
      },
      preCallback: function(outJson, json, callback) {
        if(outJson.companyType == '전체') delete json.mongo.query.companyType;
        else json.mongo.query.companyType = outJson.companyType;
        if(outJson.period == '전체') delete json.mongo.query.period;
        else json.mongo.query.period = outJson.period;

        callback(json);
      }
    }
  ]
};

exports.fssDepositSave = {
  module: 'task',
  action: 'sequence',
  actions: [
    {
      module: 'task',
      action: 'repeater',
      actions: [
        {
          module: "moneybot",
          action: "fssDeposit",
          param: {
            saveTrm: 6,
            topFinGrpNo: '020000',
            topFinGrpNoNM: '은행',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '은행';
              json.doc[i].period = '6개월'
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
          action: "fssDeposit",
          param: {
            saveTrm: 12,
            topFinGrpNo: '020000',
            topFinGrpNoNM: '은행',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '은행';
              json.doc[i].period = '12개월'
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
          action: "fssDeposit",
          param: {
            saveTrm: 24,
            topFinGrpNo: '020000',
            topFinGrpNoNM: '은행',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '은행';
              json.doc[i].period = '24개월'
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
          action: "fssDeposit",
          param: {
            saveTrm: 36,
            topFinGrpNo: '020000',
            topFinGrpNoNM: '은행',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '은행';
              json.doc[i].period = '36개월'
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
          action: "fssDeposit",
          param: {
            saveTrm: 6,
            topFinGrpNo: '030300',
            topFinGrpNoNM: '저축은행',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '저축은행';
              json.doc[i].period = '6개월'
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
          action: "fssDeposit",
          param: {
            saveTrm: 12,
            topFinGrpNo: '030300',
            topFinGrpNoNM: '저축은행',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '저축은행';
              json.doc[i].period = '12개월'
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
          action: "fssDeposit",
          param: {
            saveTrm: 24,
            topFinGrpNo: '030300',
            topFinGrpNoNM: '저축은행',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '저축은행';
              json.doc[i].period = '24개월'
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
          action: "fssDeposit",
          param: {
            saveTrm: 36,
            topFinGrpNo: '030300',
            topFinGrpNoNM: '저축은행',
            pageIndex: 1
          },
          postCallback: function (outJson, json, callback) {
            json.param.pageIndex++;
            for(var i = 0; i < json.doc.length; i++) {
              json.doc[i].companyType = '저축은행';
              json.doc[i].period = '36개월'
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
          period: 'String',
          companyType: 'String',
          company: 'String',
          title: 'String',
          beforeinterest: 'String',
          afterinterest: 'String',
          afterinterestmoney: 'String',
          afterrealmoney: 'String',
          sortinterest: 'String',
          lastinterest: 'String',
          meanexchange: 'String'
        },
        query: {company: '', title: '', sortinterest: '', period: ''},
        options: {upsert: true}
      }
    }
  ]
};

exports.fssDeoposit = {
  "module": "http",
  "action": "xpathRepeat",
  "method": "POST",
  "url": "http://finlife.fss.or.kr",
  "path": "/deposit/selectDeposit.do?menuId=2000100",
  "param": {
    "pageType": "ajax",
    "pageIndex": 1,
    "pageSize": 50,
    "pageUnit": 50,
    "areaCd": "",
    "listOrder": "intrRateDesc",
    "menuId":"2000100",
    "BLTN_ID":"BB000000000000000135"
  },
  "docMerge": "add",
  "xpath": {
    "repeat": "//table[@class='table_list resTable']/tbody/tr[@class='onOffTr']",
    //"limit": "5",
    "doc": {
      "company": "//td[2]/text()",
      "title": "//td[3]/text()",
      "beforeinterest": "//td[4]/text()",
      "afterinterest": "//td[5]/text()",
      "afterinterestmoney": "//td[6]/text()",
      "afterrealmoney": "//td[7]/text()",
      "sortinterest": "//td[8]/text()"
    },
    "pages": "//div[@class='paginate']/a/text()",
    "currentPage": "//div[@class='paginate']/a[@class='pag-select']/text()"
  }
};
