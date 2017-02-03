var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('test');
var taskModule = require(path.resolve('./modules/bot/action/common/task'));

var executeAction = function(task, context, callback) {
  var words = context.dialog.inRaw.split(' ');

  var _task = bot.tasks[words[1]];
  taskModule.executeTask(_task, context, function(_task, context) {
    callback(_task, context);
  });
}

bot.setAction('executeAction', executeAction);

// KB생명

var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.kbli.co.kr/',
  method: 'POST',
  param: {
    // queryType: 'SQL',
    // sqlKind: 'sql',
    // fileXml: 'HO_CC.HO_CC_01.HO_CC_01_01',
    // querId: 'getList',
    // paramValue: 'ThisPage%3D1%E2%88%A5RowPerPage%3D10%E2%88%A5type%3D1%E2%88%A5sub_type%3D%E2%88%A5s_type%3D1%E2%88%A5s_name%3D'
  },
  xpath: {
    tag: '//*[@id="table_list"]/tr[1]/td[1]/text()',
    title: '//*[@id="table_list"]/tr[1]/td[2]/a/text()',
    date: '//*[@id="FOOTER_wrap"]/div[2]/div[1]/div[2]/span[1]/text()',
    content: '//*[@id="CONTENTS_wrap"]/form/div[5]/table[1]/tbody/tr[3]/td/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = 'KB생명';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};

/*
// KB손해보험
// HTML (O) XPATH (O) MONGO (O) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://www.kbinsure.co.kr/CG602010001.ec',
  method: 'GET',
  param: {
    version: '1'
  },
  xpath: {
    // tag: '//*[@id="top10div"]/div/ul/li[1]/a/dl/dd/div[1]/text()',
    tag: '//*[@id="top10div"]/div/ul/li[10]/a/dl/dd/div[1]/text()',
    // title: '//*[@id="top10div"]/div/ul/li[1]/a/dl/dd/div[2]/text()',
    title: '//*[@id="top10div"]/div/ul/li[10]/a/dl/dd/div[2]/text()',
    date: '//*[@id="mFooter"]/div[2]/div[2]/p[3]/strong[1]/em/text()',
    // content: '//*[@id="top10div"]/div/ul/li[1]/div/dl/dd/span/p[1]/span/text()',
    content: '//*[@id="top10div"]/div/ul/li[10]/div/dl/dd/p/font/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = 'KB손해보험';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};

var One = {
  module:'task',
  action: 'sequence',
  preCallbck: function(task,context,callback) {
    task.topTask.company = 'KB손해보험'
  },
  actions: [
    {
      template: FAQ
    },
    {
      module: 'mongo',
      action: 'update',
      mongo: {
        model: 'fnfaq',
        query: {'company': 'KB손해보험', 'originalId': ''},
        options: {upsert: true}
      },
      preCallback: function (task, context, callback) {
        task.doc = task.topTask.doc;
        callback(task, context);
      }
    }
  ]
}
bot.setTask('One', One);
exports.One = One;
*/

/*
// 현대해상화재보험
// HTML (X) XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.hi.co.kr/bin/CC/CU/CCCU6001G.jsp',
  method: 'GET',
  param: {
    // ceuid: 'AG5A385319224',
    // pts: '1484889483418',
    // pi: '1',
    // rtd: '32696',
    // url: 'www.hi.co.kr/bin/CC/CU/CCCU6001G.jsp',
    // clink: 'javascript:getFoward(HHCU6001M01L,1)',
    // cname: 'href',
    // ctype: 'LINK',
    // rnd: '0.24921840591030198'
  },
  xpath: {
    tag: '//*[@id="dt_53"]/a/text()',
    title: '//*[@id="dt_53"]/a/span/text()',
    date: '//*[@id="footer"]/div[2]/div/div[1]/address/em[3]/text()',
    content: '//*[@id="dd_53"]/p/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '현대해상화재보험';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 한화손해보험
// HTML (X) XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://www1.hwgeneralins.com/customer/faq/list.jsp',
  method: 'POST',
  param: {
    nodeId: 'NODE0000000208_:1484889126474'
  },
  xpath: {
    tag: '//*[@id="content"]/ul[1]/li[5]/a/text()',
    title: '//*[@id="subpage"]/div[1]/ul/li[1]/a/text()',
    date: '//*[@id="footer"]/div/div[2]/div[1]/p[1]/font/b[1]/text()',
    content: '//*[@id="subpage"]/div[1]/ul/li[1]/a/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '한화손해보험';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 동부화재
// HTML (O) XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.idongbu.com/custom/faq/faq3.jsp',
  method: 'GET',
  param: {
    listID: '64',
    curpage: '1'
  },
  xpath: {
    tag: '//*[@id="ontab"]/span/span/text()',
    title: '//*[@id="faq-list"]/dt[1]/a/text()',
    date: '//*[@id="footer"]/div[1]/div[2]/ul[2]/li[2]/text()',
    content: '//*[@id="answer1_view"]/p/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '동부화재';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 삼성화재
// HTML (O) XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://www.samsungfire.com/CnCustomer.do?method=initFaqList',
  method: 'GET',
  param: {
    method: 'initFaqList'
  },
  xpath: {
    tag: '//*[@id="contents_in"]/div[1]/dl/dd[1]/span[1]/a/text()',
    title: '//*[@id="contents_in"]/div[2]/form/div/dl/dt[1]/a/text()',
    date: '//*[@id="footer_link_wrap"]/div[3]/ul[1]/li[3]/a/text()',
    content: '//*[@id="contents_in"]/div[2]/form/div/dl/dt[1]/a/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '삼성화재';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

// 누르면 추가로 네트워크에 들어오는 것들 어떻게 처리할지 고-민

/*
// 교보생명
// HTML (X) XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.kyobo.co.kr/webdocs/view.jsp?screenId=SCSCUNLM001&menuId=MN0000382&biztype=main',
  method: 'GET',
  param: {
    screenId: 'SCSCUNLM001',
    menuId: 'MN0000382',
    biztype: 'main'
  },
  xpath: {
    tag: '//*[@id="447"]/a/span[1]/text()',
    title: '//*[@id="447"]/a/span[2]/text()',
    date: '//*[@id="footer"]/article/aside/div/p/text()',
    content: '//*[@id="jsMakePrintArea_0"]/p[1]/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '교보생명';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

// 카드 회사들이 사이트 까다롭고 복잡하게 많이 만들어놓음.

/*
// 현대카드
// HTML (X) : tag랑 date만 들어옴. XPATH (^) MONGO (X) 깨짐 (X) 
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.hyundaicard.com/cpu/cs/CPUCS0101_01.hc',
  method: 'GET',
  param: {
  },
  xpath: {
    tag: '//*[@id="container"]/div[2]/div/section[2]/ul[2]/li[1]/a/text()',
    title: '//*[@id="resultList"]/li[1]/div[1]/a/text()',
    date: '//*[@id="footer"]/div/div/div[1]/ul/li[2]/text()',
    content: '//*[@id="contents1"]/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '현대카드';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 우리카드
// HTML (O) XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://sccd.wooribank.com/ccd/Dream?withyou=CDCNT0213',
  method: 'GET',
  param: {
    withyou: 'CDCNT0213'
  },
  xpath: {
    tag: '//*[@id="frm"]/table[2]/tbody/tr[1]/td[1]/text()',
    title: '//*[@id="frm"]/table[2]/tbody/tr[1]/td[2]/a/text()',
    date: '//*[@id="frm"]/table[2]/tbody/tr[1]/td[3]/text()',
    content: '//*[@id="frm"]/table[2]/tbody/tr[1]/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '우리카드';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 신한카드
// HTML (X) XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.shinhancard.com/hpp/HPPCUSTMN/HPPFaqList.shc',
  method: 'GET',
  param: {
    dummy: '20140109'
  },
  xpath: {
    tag: '//*[@id="pbContent"]/div[4]/h3/html/body/div/div[3]/div/div[2]/div[2]/table/tbody/tr[27]/th/text()',
    title: '//*[@id="faqlist"]/dt[1]/a/text()',
    date: '//*[@id="pbFooter"]/div/ul/li[1]/text()',
    content: '//*[@id="KNOW0000000914"]/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '신한카드';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 삼성카드
// HTML (X) : 위아래는 들어오는데 나머지가 안들어옴. XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.samsungcard.com/personal/customer-service/faq/UHPPCC0201M0.jsp?click=gnb_customer_faq',
  method: 'GET',
  param: {
    click: 'gnb_customer_faq'
  },
  xpath: {
    tag: '//*[@id="tit_cate2"]/h2/text()',
    title: '//*[@id="1204932"]/p/text()',
    date: '//*[@id="footer"]/div/div[1]/ul/li[3]/dl/dd[1]/span[2]/text()',
    content: '//*[@id="inUl_0"]/li[1]/div[2]/div/p/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '삼성카드';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 비씨카드
// HTML (X) XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.bccard.com/app/card/FaqListActn.do?parentId=NODE0000001069',
  method: 'GET',
  param: {
    parentId: ''
  },
  xpath: {
    tag: '//*[@id="faqListBody"]/tr[1]/td[2]/text()',
    title: '//*[@id="faqTdKNOW0000005004NODE0000001076"]/a/text()',
    date: '//*[@id="footer"]/div[1]/ul/li[4]/span/text()',
    content: '//*[@id="KNOW0000005004NODE0000001076"]/p[17]/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '비씨카드';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 롯데카드
// HTML (X) XPATH(X) MONGO (X) 깨짐 (X)
// 다른 사이트들에 비해 특이한 형식
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.lottecard.co.kr/app/IHCSTAA_V100.do',
  method: 'GET',
  param: {
  },
  xpath: {
    tag: '//*[@id="hglee"]/div[3]/div[1]/ul/li[1]/a/text()',
    title: '//*[@id="hglee"]/div[3]/div[2]/ul/li[1]/dl/dt/a/text()',
    date: '//*[@id="hglee"]/div[1]/table/tbody/tr/th/label/text()',
    content: '/html/body/font[3]/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '롯데카드';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 한국수출입은행
// HTML (O) XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.koreaexim.go.kr/site/program/board/basicboard/list?boardtypeid=384&menuid=001006001001&searchselect2=FA01',
  method: 'GET',
  param: {
    boardtypeid: '384',
    menuid: '001006001001',
    searchselect2: 'FA01',
    pagesize: '10',
    currentPage: '1'
  },
  xpath: {
    tag: '//*[@id="boardForm"]/div/ul/li[1]/a/strong/text()',
    title: '//*[@id="boardForm"]/div/ul/li[1]/a/span[2]/text()',
    date: '//*[@id="footer"]/div/div[3]/div[2]/span[1]/text()',
    content: '//*[@id="boardForm"]/div/ul/li[1]/div/p/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '한국수출입은행';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 새마을금고 금융상품몰
// HTML (X) XPATH(X) MONGO(X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://www.knia.or.kr/consumer/counsel/counsel02/',
  method: 'POST',
  param: {
    pageRows: '10',
    pageUnit: '10',
    totalRows: '111',
    currentPageNo: '1',
    categorynum: '0',
    seq: '0',
    pageNo: '2'
  },
  xpath: {
    tag: '//*[@id="cus0101"]/div[3]/div[4]/div/table/tbody/tr[1]/th/em/text()',
    title: '//*[@id="cus0101"]/div[3]/div[4]/div/table/tbody/tr[1]/td/a/text()',
    date: '//*[@id="footer"]/div/div[2]/div[2]/div/dl/dd[2]/span/text()',
    content: '//*[@id="cus0101"]/div[3]/div[4]/div/table/tbody/tr[1]/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '새마을금고';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 신한은행
// HTML (X) XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://cs.shinhan.com/cs_index.jsp',
  method: 'GET',
  param: {
  },
  xpath: {
    tag: '//*[@id="FAQGRID_cell_0_0"]/nobr/text()',
    title: '//*[@id="FAQGRID_cell_0_1"]/nobr/a/text()',
    date: '//*[@id="FAQGRID_cell_0_0"]/nobr/text()',
    content: '//*[@id="row2"]/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '신한은행';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// SC제일은행
// HTML (X) XPATH(^) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.standardchartered.co.kr/np/kr/cm/cc/FaqList.jsp?menuId=HT00010104000000&rnb=1&rnbStep=4&bodid=10030000',
  method: 'POST',
  param: {
    menuId: 'HT00010104000000',
    rnb: '1',
    rnbStep: '4',
    bodid: '1003000'
  },
  xpath: {
    tag: '//*[@id="titleNm"]/text()',
    title: '//*[@id="destFocus1"]/text()',
    date: '//*[@id="toggle-contents1"]/div/div[1]/text()',
    content: '//*[@id="decodeContent1"]/ul/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = 'SC제일은행';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 하나은행 - 대출
// HTML (O) XPATH (X) MONGO (X) 깨짐 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.kebhana.com/cont/customer/customer01/customer0102/customer010203/index.jsp',
  method: 'GET',
  param: {
  },
  xpath: {
    tag: '//*[@id="contents"]/h3/text()',
    title: '//*[@id="contents"]/ul[2]/li[1]/a/text()',
    date: '//*[@id="footer"]/div/dl/dd[2]/text()',
    content: '//*[@id="contents"]/ul[2]/li[1]/div/div/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '하나은행-대출';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

/*
// 손해보험협회
// HTML: O, XPATH: O, MONGO: O, HTML깨짐: X
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://www.knia.or.kr/consumer/counsel/counsel02/',
  method: 'POST',
  param: {
    page: '4'
  },
  xpath: {
    tag: '/html/body/div/div[3]/div/div[2]/div[2]/table/tbody/tr[27]/th/text()',
    title: '/html/body/div/div[3]/div/div[2]/div[2]/table/tbody/tr[27]/td/text()',
    date: '/html/body/div/div[3]/div/div[2]/div[2]/table/tbody/tr[28]/th/text()',
    content: '/html/body/div/div[3]/div/div[2]/div[2]/table/tbody/tr[28]/td/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '손해보험협회';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};

bot.setTask('FAQ', FAQ);
exports.FAQ = FAQ;
*/

/*
// 저축은행중앙회
// TypeError: cannot read property _text of null
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.fsb.or.kr/assurance/asr_qa1.do',
  method: 'POST',
  param: {
  },
  xpath: {
    tag: '//*[@id="subContents"]/div[4]/h3/strong/text()',
    title: '//*[@id="acc0"]/dt[1]/a/text()',
    date: '//*[@id="footer"]/div/div[2]/div[2]/dl/dd[2]/text()',
    content: '//*[@id="acc0"]/dd[1]/p[1]/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '저축은행중앙회';
    // task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};

bot.setTask('FAQ', FAQ);
exports.FAQ = FAQ;
*/

/*
// 서민금융진흥원-맞춤대출
// HTML (X) XPATH (X) MONGO (X) 깨지는 것 (X)
var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.koreaeasyloan.com/customer/oftenQuestion.ke',
  method: 'GET',
  param: {
  },
  xpath: {
    tag: '//*[@id="tbl_list"]/tbody/tr[1]/td[1]/text()',
    title: '//*[@id="tbl_list"]/tbody/tr[1]/td[2]/a/text()',
    date: '//*[@id="tbl_list"]/tbody/tr[1]/td[3]/text()',
    content: '//*[@id="tbl_list"]/tbody/tr[2]/td/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = '서민금융진흥원-맞춤대출';
    task.doc.originalId = task.doc.company;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};
*/

bot.setTask('FAQ', FAQ);
exports.FAQ = FAQ;

