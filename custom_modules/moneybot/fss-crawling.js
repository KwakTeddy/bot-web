var path = require('path');
var utils = require(path.resolve('./modules/bot/action/common/utils'));
var config = require(path.resolve('./config/config'));
var bot = require(path.resolve('config/lib/bot')).getBot('moneybot');
var mongoose = require('mongoose');
var async = require('async');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));

const FSS_AUTH_KEY = 'de8a7edbf5b5bcdc7090fbac32189902';

exports.faqQuestion = {
  module: 'task',
  action: 'question',
  paramDefs: [
    {type: 'faq', name: 'faq질문', question: '궁금한 질문을 입력해주세요.'}
  ],
  preCallback: function(task, context, callback) {
    task.out = '+title+\n+content+';
    callback(task, context);
  }
};

exports.faq = {
  module: 'mongo',
  action: 'findById',
  mongo: {
    model: 'faq',
    _id: ''
  },
  preCallback: function(task, context, callback) {
    task.mongo._id = task.id;
    task.out = '+title+ \n +content+';
    callback(task, context);
  }
};

const CAR_TYPE = [/*'A'*/, 'B', 'C'/*, 'D', 'F'*/];         // 소형A, 소형B, 중형, 대형, 다인승
const AGE_TYPE = ['D', 'H'/*, 'I', 'J', 'F', 'G'*/];    // 만26, 만31, 만38, 만43, 만51, 만61
const PERIOD = [/*'A',*/ 'B'];                          // 최초가입, 가입경력3년(무사고)
const MIN_AGE = [/*'1', '2',*/ '3'];                    // 26, 30, 35 특약
const FAM_TYPE = ['B', 'C'/*, 'A'*/];                   // 1인, 부부, 가족
const SEX = ['A'/*, 'B'*/];                             // 남, 여
const REQUITAL = ['G', 'F'];                        // 자차포함, 자차제외

var carInsu0 = {
  module: 'task',
  action: 'sequence',
  actions: [
  {
    module: "http",
    action: "simpleRequest",
    method: "GET",
    uri: 'http://www.e-insmarket.or.kr/aimt/search.knia',
    param: {
      carType:'C',
      ageType:'H',
      period:'B',
      minAge:'2',
      famType:'C',
      sex:'A',
      requital:'G'
      // ordering:'ASC'
      // _:'1481468108229'
    },
    xpath: {
      _repeat: '//table[@class="table_type01"]/tbody/tr',
      kor_co_nm: './/td[2]/span/span/text()',
      fin_prdt_nm: './/td[3]/text()',
      paym_atm: './/td[4]/text()',
      memo: './/td[5]/ul/li/text()',
      url: './/td[6]/span/button/@data-url'
    },
    preCallback: function (task, context, callback) {

      task.param.carType = CAR_TYPE[task.topTask.carTypeIndex];
      task.param.ageType = AGE_TYPE[task.topTask.ageTypeIndex];
      task.param.period = PERIOD[task.topTask.periodIndex];
      task.param.minAge = MIN_AGE[task.topTask.minAgeIndex];
      task.param.famType = FAM_TYPE[task.topTask.famTypeIndex];
      task.param.sex = SEX[task.topTask.sexIndex];
      task.param.requital = REQUITAL[task.topTask.requitalIndex];

      console.log(task.param.carType, task.param.ageType, task.param.period, task.param.minAge, task.param.famType, task.param.sex, task.param.requital);

      callback(task, context);
    },
    postCallback: function (task, context, callback) {
      for (var i = 0; i < task.doc.length; i++) {
        var doc = task.doc[i];
        doc.prdt_div = 'C';
        doc.carType = task.param.carType;
        doc.ageType = task.param.ageType;
        doc.period = task.param.period;
        doc.minAge = task.param.minAge;
        doc.famType = task.param.famType;
        doc.sex = task.param.sex;
        doc.requital = task.param.requital;

        doc.paym_atm = doc.paym_atm.replace(',','');

        console.log(task.param.carType, task.param.ageType, task.param.period, task.param.minAge, task.param.famType, task.param.sex, task.param.requital);
      }

      if(task.topTask.doc === undefined) task.topTask.doc = [];
      task.topTask.doc = task.topTask.doc.concat(task.doc);
      callback(task, context);
    }
  },
  {
    module: 'mongo',
    action: 'update',
    mongo: {
      model: 'fssProduct',
      query: {'kor_co_nm': '', 'fin_prdt_nm': ''},
      options: {upsert: true}
    },
    preCallback: function (task, context, callback) {
      task.doc = task.topTask.doc;
      callback(task, context);
    }
  }
]
};

bot.setTask('carInsu0', carInsu0);

var carInsu = {
  module: 'task',
  action: 'while',
  preCallback: function (task, context, callback) {
    task.topTask.carTypeIndex = -1;
    callback(task, context);
  },
  whileIf: function(task, context) {
    if(++task.topTask.carTypeIndex < CAR_TYPE.length) return true;
    else return false;
  },
  actions: [
    {
      module: 'task',
      action: 'while',
      preCallback: function (task, context, callback) {
        task.topTask.ageTypeIndex = -1;
        callback(task, context);
      },
      whileIf: function(task, context) {
        if(++task.topTask.ageTypeIndex < AGE_TYPE.length) return true;
        else return false;
      },
      actions: [
        {
          module: 'task',
          action: 'while',
          preCallback: function (task, context, callback) {
            task.topTask.periodIndex = -1;
            callback(task, context);
          },
          whileIf: function(task, context) {
            if(++task.topTask.periodIndex < PERIOD.length) return true;
            else return false;
          },
          actions: [
            {
              module: 'task',
              action: 'while',
              preCallback: function (task, context, callback) {
                task.topTask.minAgeIndex = -1;
                callback(task, context);
              },
              whileIf: function(task, context) {
                if(++task.topTask.minAgeIndex < MIN_AGE.length) return true;
                else return false;
              },
              actions: [
                {
                  module: 'task',
                  action: 'while',
                  preCallback: function (task, context, callback) {
                    task.topTask.famTypeIndex = -1;
                    callback(task, context);
                  },
                  whileIf: function(task, context) {
                    if(++task.topTask.famTypeIndex < FAM_TYPE.length) return true;
                    else return false;
                  },
                  actions: [
                    {
                      module: 'task',
                      action: 'while',
                      preCallback: function (task, context, callback) {
                        task.topTask.sexIndex = -1;
                        callback(task, context);
                      },
                      whileIf: function(task, context) {
                        if(++task.topTask.sexIndex < SEX.length) return true;
                        else return false;
                      },
                      actions: [
                        {
                          module: 'task',
                          action: 'while',
                          preCallback: function (task, context, callback) {
                            task.topTask.requitalIndex = -1;
                            callback(task, context);
                          },
                          whileIf: function(task, context) {
                            if(++task.topTask.requitalIndex < REQUITAL.length) return true;
                            else return false;
                          },
                          actions: [
                            carInsu0
                          ]
                        }
                      ]
                    }
                  ]
                }

              ]
            }
          ]
        }
      ]
    }
  ]
};
bot.setTask('carInsu', carInsu);


const DEPOSIT_CODE = ['020000', '030200', '030300', '050000', '060000'];

var fssOpenAPI = {
  module: 'task',
  action: 'while',
  preCallback: function(task, context, callback) {
    task.topTask.pageNo = undefined;
    task.topTask.totalPage = undefined;

    callback(task, context);
  },
  whileIf: function(task, context) {
    if(task.topTask.pageNo !== undefined && task.topTask.totalPage <= task.topTask.pageNo) return false;
    else return true;
  },
  actions: [
    { module: "http",
      action: "simpleRequest",
      method: "GET",
      uri: '',
      param: {
        auth: FSS_AUTH_KEY,
        topFinGrpNo: '',
        pageNo: '1'
      },
      preCallback: function(task, context, callback) {
        task.uri = task.topTask.uri;
        task.param.topFinGrpNo = DEPOSIT_CODE[task.topTask.groupIndex];

        if(task.topTask.pageNo !== undefined) task.param.pageNo = Number(task.topTask.pageNo) + 1;
        else task.param.pageNo = 1;

        callback(task, context);
      },
      postCallback: function(task, context, callback) {
        task.topTask.totalPage = task.doc.result.max_page_no;
        task.topTask.pageNo = task.doc.result.now_page_no;

        var optionList = task.doc.result.optionList;
        for (var i = 0; i < optionList.length; i++) {
          var option = optionList[i];
          for (var j = 0; j < task.doc.result.baseList.length; j++) {
            var base = task.doc.result.baseList[j];
            if(option.dcls_month == base.dcls_month &&
              option.fin_co_no == base.fin_co_no &&
              option.fin_prdt_cd == base.fin_prdt_cd) {
              optionList[i] = utils.merge(base, option, true);
              optionList[i].prdt_div = task.doc.result.prdt_div;
            }
          }
        }

        for (var i = 0; i < optionList.length; i++) {
          var doc = optionList[i];
          console.log(JSON.stringify(doc));
        }
        
        if(task.topTask.doc === undefined) task.topTask.doc = [];
        // task.topTask.doc = task.topTask.doc.concat(task.doc.result.baseList);
        task.topTask.doc = task.topTask.doc.concat(optionList);

        // console.log(JSON.stringify(task.doc.result, 2));
        callback(task, context);
      }
    }
  ]
};

bot.setTask('fssOpenAPI', fssOpenAPI);

var fssDeposit = {
  module: 'task',
  action: 'sequence',
  preCallback: function(task, context, callback) {
    task.topTask.groupIndex = undefined;
    task.topTask.uri = 'http://finlife.fss.or.kr/finlifeapi/depositProductsSearch.json';
    callback(task, context);
  },
  actions: [
    {
      module: 'task',
      action: 'while',
      whileIf: function(task, context) {
        if(task.topTask.groupIndex === undefined) {
          task.topTask.groupIndex = 0;
          return true;
        } else if(DEPOSIT_CODE.length - 1 > task.topTask.groupIndex) {
          task.topTask.groupIndex ++;
          return true;
        } else {
          return false;
        }
      },
      actions: [
        { template: fssOpenAPI}
      ],
      postCallback: function(task, context, callback) {
        // console.log(task.topTask.doc);
        callback(task, context);
      }
    },

    {
      module: 'mongo',
      action: 'update',
      mongo: {
        model: 'fssProduct',
        query: {'dcls_month': '', 'fin_co_no': '', 'fin_prdt_cd': '', 'fin_prdt_nm': ''},
        options: {upsert: true}
      },
      preCallback: function (task, context, callback) {
        task.doc = task.topTask.doc;
        callback(task, context);
      }
    }
  ]
};
bot.setTask('fssDeposit', fssDeposit);

var fssSaving = {
  template: fssDeposit,
  preCallback: function(task, context, callback) {
    task.topTask.groupIndex = undefined;
    task.topTask.uri = 'http://finlife.fss.or.kr/finlifeapi/savingProductsSearch.json';
    callback(task, context);
  }
};
bot.setTask('fssSaving', fssSaving);

var fssAnnuitySaving = {
  template: fssDeposit,
  preCallback: function(task, context, callback) {
    task.topTask.groupIndex = undefined;
    task.topTask.uri = 'http://finlife.fss.or.kr/finlifeapi/annuitySavingProductsSearch.json';
    callback(task, context);
  }
};
bot.setTask('fssAnnuitySaving', fssAnnuitySaving);

var fssMortgageLoan = {
  template: fssDeposit,
  preCallback: function(task, context, callback) {
    task.topTask.groupIndex = undefined;
    task.topTask.uri = 'http://finlife.fss.or.kr/finlifeapi/mortgageLoanProductsSearch.json';
    callback(task, context);
  }
};
bot.setTask('fssMortgageLoan', fssMortgageLoan);


var fssRentHouseLoan = {
  template: fssDeposit,
  preCallback: function(task, context, callback) {
    task.topTask.groupIndex = undefined;
    task.topTask.uri = 'http://finlife.fss.or.kr/finlifeapi/rentHouseLoanProductsSearch.json';
    callback(task, context);
  }
};
bot.setTask('fssRentHouseLoan', fssRentHouseLoan);

var fssCreditLoan = {
  template: fssDeposit,
  preCallback: function(task, context, callback) {
    task.topTask.groupIndex = undefined;
    task.topTask.uri = 'http://finlife.fss.or.kr/finlifeapi/creditLoanProductsSearch.json';
    callback(task, context);
  }
};
bot.setTask('fssCreditLoan', fssCreditLoan);


var fssAll = {
  module: 'task',
  action: 'sequence',
  actions: [
    fssDeposit,
    fssSaving,
    fssAnnuitySaving,
    fssMortgageLoan,
    fssRentHouseLoan,
    fssCreditLoan
  ]
};

bot.setTask('fssAll', fssAll);

var fssDepositQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'D', 'save_trm': '12'},
    sort: {'intr_rate2': -1}
  }
};

bot.setTask('fssDepositQuery', fssDepositQuery);


var fssSavingQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'S', 'save_trm': '12'},
    sort: {'intr_rate2': -1}
  }
};
bot.setTask('fssSavingQuery', fssSavingQuery);

var fssAnnuitySavingQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'P'},
    sort: {'avg_prft_rate': -1}
  }
};

bot.setTask('fssAnnuitySavingQuery', fssAnnuitySavingQuery);

var fssMortgageLoanQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'M'},
    sort: {'lend_rate_min': +1}
  }
};

bot.setTask('fssMortgageLoanQuery', fssMortgageLoanQuery);

var fssRentHouseLoanQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'R'},
    sort: {'lend_rate_min': +1}
  }
};

bot.setTask('fssRentHouseLoanQuery', fssRentHouseLoanQuery);

var fssCreditLoanQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'C'},
    sort: {'crdt_grad_avg': +1}
  }
};

bot.setTask('fssCreditLoanQuery', fssCreditLoanQuery);


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






