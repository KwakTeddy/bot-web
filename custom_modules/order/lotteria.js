var path = require('path');
var utils = require(path.resolve('./modules/bot/action/common/utils'));

exports.order = {
  module: 'task',
  action: 'sequence',
  paramDefs: [
    {type: 'lotteriaMenu', name: 'menu', display: '메뉴', isDisplay: false},
    {type: 'count', name: 'orderCount', isRequire: false, display: '주문개수', isDisplay: false}
  ],
  actions: [

    // 메뉴 선택
    {
      module: 'task',
      action: 'iteration',
      preCallback: function(task, context, callback) {
        task.topTask.pId = task.topTask.typeDoc.id;
        callback(task, context);
      },
      condition: function(task, context) {
        return task.isRepeat == undefined || task.isRepeat;
      },
      actions: [
        {
          module: 'task',
          action: 'question',
          condition: function(task, context) {
            if(task.topTask.pId) return false;
            return true;
          },
          paramDefs: [
            {type: 'lotteriaMenu', name: 'menu', display: '메뉴', required: true, question: '주문할 메뉴를 말씀해 주세요.'},
            {type: 'count', name: 'orderCount', display: '주문개수', required: false}
          ],
          preCallback: function(task, context) {
            task.topTask.pId = task.typeDoc.id;
            task.topTask.count = task.count;
            callback(task, context);
          }
        },
        // 메뉴 카테고리
        {
          module: 'task',
          action: 'question',
          condition: function(task, context) {
            if(task.topTask.pId) return false;
            return true;
          },
          paramDefs: [
            {type: 'string', name: 'menuType', question: '종류를 선택해주세요\n1.추천메뉴\n2.버거\n3.팩\n4.치킨\n5.디저트\n6.드링크',
              customCheck: function (text, type, task, context, callback) {
                try {
                  var num = Number(text);
                  if (num >= 1 && num <= 6) {
                    callback(text, task, true);
                    return;
                  }
                } catch (e) {}

                callback(text, task, false);
              }
            }
          ],
          postCallback: function(task, context, callback) {
            if(task.menuType == '1') task.path = '/RIA/homeservice/homeservice.asp';
            else if(task.menuType == '2') task.path = '/RIA/homeservice/burger.asp';
            else if(task.menuType == '3') task.path = '/RIA/homeservice/pack.asp';
            else if(task.menuType == '4') task.path = '/RIA/homeservice/chicken.asp';
            else if(task.menuType == '5') task.path = '/RIA/homeservice/dessert.asp';
            else if(task.menuType == '6') task.path = '/RIA/homeservice/drink.asp';

            callback(task, context);
          }
        },

        // 홈서비스 메뉴보기
        {
          module: 'http',
          action: 'xpathRepeat',
          condition: function(task, context) {
            if(task.topTask.pId) return false;
            return true;
          },
          url: 'https://homeservice.lotteria.com',
          path: '/RIA/homeservice/homeservice.asp',
          xpath: {
            repeat: '//ul[@class="menu_list"]/li',
            // limit: 10,
            doc: {
              title: '//p[@class="desc"]/text()',
              optionsPath: '//div[@class="cart_left"]/div',
              price: '//div[@class="cart_left"]/span/b/text()',
              id: '//div[@class="cart_left"]/span/input/@value'
            }
          },

          preCallback: function(task, context, callback) {
            if(task.preTask.path) task.path = task.preTask.path;

            callback(task, context);
          },
          postCallback: function(task, context, callback) {
            for(var i = 0; i < task.doc.length; i++) {

              if(task.doc[i].optionsPath) {
                task.doc[i].options = [];
                task.doc[i].prices = [];
                task.doc[i].ids = [];

                for(var j = 0; j < task.doc[i].optionsPath.length; j++) {
                  task.doc[i].options[j] = task.doc[i].optionsPath[j].childNodes[1].firstChild.toString();
                  task.doc[i].prices[j] = task.doc[i].optionsPath[j].childNodes[1].childNodes[1].firstChild.toString().replace(/,/g, '');
                  task.doc[i].ids[j] = task.doc[i].optionsPath[j].childNodes[0].getAttribute('value');
                }
              }

              if((task.doc[i].price == undefined || task.doc[i].price == '') &&
                (task.doc[i].prices))
                task.doc[i].price = task.doc[i].prices[0];

              if((task.doc[i].id == undefined || task.doc[i].id == '') &&
                (task.doc[i].ids))
                task.doc[i].id = task.doc[i].ids[0];
            }

            callback(task, context);
          },
          taskOut: "원하는 메뉴를 선택해 주세요.\n##+index+ +title+ +price+원\n#"
        },

        // 메뉴 선택
        {
          module: 'task',
          action: 'question',
          condition: function(task, context) {
            if(task.topTask.pId) return false;
            return true;
          },
          paramDefs: [
            {
              type: 'number', name: 'menu', display: '메뉴', required: true, isDisplay: false, question: '메뉴를 선택해 주세요 ',
              customCheck: function (text, type, task, context, callback) {
                try {
                  var num = Number(text);
                  if (num >= 1 && num <= 10 /*task.preTask.doc.length*/) {
                    callback(text, task, true);
                    return;
                  }
                } catch (e) {}

                callback(text, task, false);
              }
            }
          ],
          postCallback: function(task, context, callback) {
            task.topTask.selectMenu = task.preTask.doc[task.menu-1];
            task.topTask.pId = task.topTask.selectMenu.id;

            callback(task, context);
          }
        },

        // 옵션 메뉴
        {
          module: 'task',
          action: 'question',
          condition: function(task, context) {
            if(!task.topTask.pId && task.topTask.selectMenu.options && task.topTask.selectMenu.options.length > 0) return true;
            return false;
          },
          paramDefs: [
            {type: 'string', name: 'optionMenu',
              question: function(task, context) {
                var q = '메뉴 종류를 선택해 주세요.\n';
                for(var i = 0; i < task.topTask.selectMenu.options.length; i++) {
                  q += (i+1) + '. ' + task.topTask.selectMenu.options[i] + ' ' + task.topTask.selectMenu.prices[i] + '원\n';
                }
                return q;
              },
              customCheck: function (text, type, task, context, callback) {
                try {
                  var num = Number(text);
                  if (num >= 1 && num <= 3) {
                    callback(text, task, true);
                    return;
                  }
                } catch (e) {}

                callback(text, task, true);
              }
            }
          ],
          postCallback: function(task, context, callback) {
            task.topTask.pId = task.topTask.selectMenu.ids[task.optionMenu-1];

            callback(task, context);
          }
        },

        // 상품담기
        {
          module: 'http',
          action: 'plaintext',
          url: 'https://homeservice.lotteria.com',
          path: '/RIA/api/json/Cart/Cart.Proc.json.asp?callback=jQuery18200016291653109714588_1470820544969',
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          param: {
            pId: '',
            cnt: 1
          },
          regexp: {
            doc: {
              json: /\((.*)\)$/g
              // result: /"Result"\s*:\s*(\w*)\s*,/g,
              // eMessage: /"eMessage"\s*:\s*"([^"]*)"/g
            }
          },
          preCallback: function(task, context, callback) {
            task.param.pId = task.topTask.pId;
            if(task.topTask.count) task.param.cnt = task.topTask.count;
            callback(task, context);
          },
          postCallback: function(task, context, callback) {
            // task.doc = JSON.parse(task.doc.json);
            // if(task.doc.result == 'false') {
            //   task.topTask.topSuccessCallback('장바구니에 담을 수 없습니다.\n' + task.doc.eMessage);
            // } else {
              callback(task, context);
            // }
          }
        },

        // 추가주문 질문
        {
          module: 'task',
          action: 'question',
          paramDefs: [
            {type: 'string', name: 'addOrderCheck', required: true, question: '다른 메뉴를 추가로 주문하시겠습니까?'}
          ],
          postCallback: function(task, context, callback) {
            var re = new RegExp(context.global.messages.yesRegExp, 'g');
            if(!task.parent.isRepeat && task.in.search(re) != -1) {
              task.isRepeat = true;
            } else {
              task.isRepeat = false;
            }
            task.topTask.pId = null;

            callback(task, context);
          }
        }
      ]
    },

    // sms 인증 요청
    {
      module: 'http',
      action: 'plaintext',
      method: 'POST',
      url: 'https://homeservice.lotteria.com',
      path: '/RIA/api/json/member/PhoneAuth.json.asp?callback=jQuery18200016291653109714588_1470820544969',
      headers: {
        'Content-type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        Referer: 'https://homeservice.lotteria.com/RIA/member/login.asp'
      },
      paramDefs: [
        {type: 'mobile', name: 'mobile', display: '휴대폰번호', isReuired: true, question: '휴대폰 번호를 말씀해 주세요.'
          // , default: '010-6316-5683'
        }
      ],
      param: {
        phone1: '',
        phone2: '',
        phone3: ''
      },
      regexp: {
        doc: {
          //jQuery18200016291653109714588_1470820544969({"seq":"9939311","authCode":"945182","errorCode":"0","errorMsg":"\uC778\uC99D\uBC88\uD638\uAC00 \uBC1C\uC1A1\uB418\uC5C8\uC2B5\uB2C8\uB2E4 \uC7A0\uC2DC \uAE30\uB2E4\uB824\uC8FC\uC138\uC694"})
          // callback: /(\w*)\(/g,
          seq: /"seq"\s*:\s*"(\d*)"/g,
          authCode: /"authCode"\s*:\s*"(\d*)"/g
        }
      },
      preCallback: function(task, context, callback) {

        var re = /\b((?:(010)[-.]?(\d{4})|(01[1|6|7|8|9])[-.]?(\d{3,4}))[-.]?(\d{4}))\b/g;

        task.mobile.replace(re, function(match, p1, p2, p3, p4, p5, p6) {
          if(p2 && p3) {
            task.param.phone1 = p2;
            task.param.phone2 = p3;
            task.param.phone3 = p6;
          } else if(p4 && p5) {
            task.param.phone1 = p4;
            task.param.phone2 = p5;
            task.param.phone3 = p6;
          }

          return match;
        });

        callback(task, context);
      },
      postCallback: function(task, context, callback) {
        context.user.mobile = task.mobile;

        callback(task, context);
      }
    },

    // 인증요청
    {
      module: 'http',
      action: 'plaintext',
      method: 'POST',
      url: 'https://homeservice.lotteria.com',
      path: '/RIA/api/json/member/PhoneAuth.json.asp?callback=jQuery18200016291653109714588_1470820544969',
      headers: {
        'Content-type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        Referer: 'https://homeservice.lotteria.com/RIA/member/login.asp'

      },
      paramDefs: [
        {type: 'string', name: 'mobile', display: '인증번호', isReuired: true, question: '인증번호를 말씀해 주세요.'}
      ],
      param: {
        seq: '',
        phone1: '',
        phone2: '',
        phone3: '',
        authCode: ''
      },
      preCallback: function(task, context, callback) {
        task.param.phone1 = '';
        task.param.phone2 = task.preTask.param.phone2;
        task.param.phone3 = task.preTask.param.phone3;

        task.param.seq = task.preTask.doc.seq;
        task.param.authCode = task.preTask.doc.authCode;

        callback(task, context);
      },
      postCallback: function(task, context, callback) {
        // console.log(task._text);

        callback(task, context);
      }
    },

    // 장바구니 이동
    {
      module: 'http',
      action: 'xpath',
      url: 'https://homeservice.lotteria.com',
      path: '/RIA/cart/cart.asp',
      xpath: {
        doc: {
          sKey: '//input[@name="sKey"]/@value',
          totalPrice: '//b[@class="product_init txtTotalPrice"]/text()'
        }
      },
      postCallback: function(task, context, callback) {
        // console.log(task._text);
        task.topTask.sKey = task.doc.sKey;
        if(task.doc.totalPrice) {
          task.topTask.totalPrice = task.doc.totalPrice.replace(/,/g, '');
        }

        callback(task, context);
      }
    },

    // 주문하기 클릭, 로그인 안한 경우 로그인 화면 redirect
    {
      module: 'http',
      action: 'xpath',
      url: 'https://homeservice.lotteria.com',
      path: '/RIA/cart/order.asp',
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      param:
      {
        sKey: ''
      },
      xpath: {
        doc: {
          title: '//title/text()'
        }
      },
      preCallback: function(task, context, callback) {
        task.param.sKey = task.preTask.doc.sKey;
        callback(task, context);
      },
      postCallback: function(task, context, callback) {
        // if(task.doc.title.search(/로그인/g) != -1) {
        //   console.log('주문하기 로그인 필요');
        //
        //   taskModule.executeTask(login, context, function(_task, _context) {
        //     console.log('로그인 후 처리');
        //
        //     task.reExecute = true;
        //     callback(task, context);
        //   });
        // } else {
        //   callback(task, context);
        // }

        // console.log(task._text);

        if(task.doc.title.search(/로그인/g) != -1) {
          console.log('주문하기 로그인 필요');
          // return;
        }
        callback(task, context);
      }
    },

    // 주소입력
    {
      module: 'task',
      action: 'sequence',
      paramDefs: [
        {type: 'address', name: 'address', display: '주소', isReuired: true, question: '주소를 말씀해 주세요.'
          // ,default: '경기도 부천시 원미구 중동 1106 위브더스테이트 103-3302'
          // ,default: '서울시 영등포구 국제금융로 20 율촌빌딩 11'
          // , default: '서울특별시 금천구 가산동 60-3 대륭포스트타워5차 1606호'
        }
      ],
      actions: [
        // 동검색
        {
          module: 'http',
          action: 'plaintext',
          method: 'POST',
          url: 'https://homeservice.lotteria.com',
          path: '/RIA/api/json/address/searchDong.json.asp?callback=jQuery18204446762312011845_1472370113237',
          param: {
            dong: ''
          },
          regexp: {
            doc: {
              json: /\((.*)\)$/g
            }
          },
          preCallback: function(task, context, callback) {
            task.param.dong = task.parent.addressJibun.dong;
            callback(task, context);
          },
          postCallback: function(task, context, callback) {
            var jsonStr = task.doc.json;
            var list = JSON.parse(jsonStr).Articles;

            for(var i = 0; i < list.length; i++) {
              if(task.parent.addressJibun.sido == list[i].sido &&
                task.parent.addressJibun.sigungu == list[i].sigugun &&
                task.parent.addressJibun.dong == list[i].dong) {

                task.addrPart = list[i].sido + ' ' + list[i].sigugun + ' ' + list[i].dong;

                break;
              }
            }

            context.user.address = task.address.address;

            callback(task, context);
          }
        },
        // 상세주소입력
        {
          module: 'http',
          action: 'plaintext',
          method: 'POST',
          url: 'https://homeservice.lotteria.com',
          path: '/RIA/api/json/address/checkAddr.json.asp?callback=jQuery18204446762312011845_1472370113237',
          param: {
            checkAddrFlag: 'J'
            // checkAddr: '경기도 부천시 원미구 중동',
            // checkAddrDetail: '1106 위브더스테이트',
            // checkAddrDesc: '103-3302'

            // checkAddrFlag:N
            // checkAddr:경기 부천시  신흥로 190-0 위브더스테이트
            // checkAddrDetail:103동 3302호
            // checkAddrDesc:
          },
          regexp: {
            doc: {
              json: /\((.*)\)$/g
            }
          },
          preCallback: function(task, context, callback) {
            task.param.checkAddr = task.preTask.addrPart;
            task.param.checkAddrDetail =  task.parent.addressJibun.bungi + ' ' + task.parent.addressJibun.building + ' ' +
              task.parent.addressJibun.detail;
            task.param.checkAddrDesc = '';

            // console.log(JSON.stringify(task.param));
            callback(task, context);
          },
          // jQuery182005611188629582564_1472215833890({"Articles":[{"GUBUN":"\uB3C4\uB85C\uBA85","NODE":"P","ADDRS":"\uACBD\uAE30\uB3C4","ADDRG":"\uBD80\uCC9C\uC2DC","ADDRE":"\uC911\uB3D9","DTL05":"","BKF":"1106","DTL27":"\uC704\uBE0C\uB354\uC2A4\uD14C\uC774\uD2B8\uC544\uD30C\uD2B8","STDADDRW":"","GISX":"180234.0000000000","GISY":"444371.0000000000","NRALV1":"\uACBD\uAE30\uB3C4","NRALV2":"\uBD80\uCC9C\uC2DC","NRALV3":"","NADRS":"\uC2E0\uD765\uB85C","NBK":"190","NDTL05":"","NADR3S":"","NADRE":"(\uC911\uB3D9,\uC704\uBE0C\uB354\uC2A4\uD14C\uC774\uD2B8\uC544\uD30C\uD2B8)","NNMX":"180234.7203623664","NNMY":"444371.1637905300"}],"RCD2":"121125","RCD3":"5","RMG3":"\uAC74\uBB3C\uC758 '\uB3D9' \uB610\uB294 '\uD638'\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.","tot":"2","result":true})
          postCallback: function(task, context, callback) {
            var jsonStr = task.doc.json;
            var list = JSON.parse(jsonStr).Articles;

            for(var i = 0; i < list.length; i++) {
              var values = [];
              for(var key in list[i]) {
                if(key == 'GUBUN' || key == 'NODE') continue;
                values.push(list[i][key]);
              }

              task.topTask.confirmAddr = values.join('|');
            }

            // console.log(JSON.stringify(values));
            // console.log(values.join('|'));
            // 도로명|P|경기도|부천시|중동||1106|위브더스테이트아파트||180234.0000000000|444371.0000000000|경기도|부천시||신흥로|190|||(중동,위브더스테이트아파트)|180234.7203623664|444371.1637905300

            callback(task, context);
          }
        },
        // 주소확인 (매장조회)
        {
          module: 'http',
          action: 'plaintext',
          method: 'POST',
          url: 'https://homeservice.lotteria.com',
          path: '/RIA/api/json/address/findStore.json.asp?callback=jQuery18204446762312011845_1472370113237',
          param: {
            // confirm_addr: '지번|경기도|부천시|중동||1106|위브더스테이트아파트||180234.0000000000|444371.0000000000|경기도|부천시||신흥로|190|||(중동,위브더스테이트아파트)|180234.7203623664|444371.1637905300',
            // confirm_addr: '도로|경기도|부천시|중동||1106|위브더스테이트아파트||180234.0000000000|444371.0000000000|경기도|부천시||신흥로|190|||(중동,위브더스테이트아파트)|180234.7203623664|444371.1637905300',
            phone1: '010',
            phone2: '6316',
            phone3: '5683'
          },
          regexp: {
            doc: {
              json: /\((.*)\)$/g
            }
          },
          preCallback: function(task, context, callback) {
            task.param.confirm_addr = '지번|' + task.topTask.confirmAddr;
            console.log(task.param.confirm_addr);
            callback(task, context);
          },
          postCallback: function(task, context, callback) {

            var jsonStr = task.doc.json;
            var list = JSON.parse(jsonStr).Articles;

            for(var i = 0; i < list.length; i++) {
              if(list[i]['BRANCH_STATE_NM'] == '정상영업') {
                task.topTask.branch = list[i];
                // console.log(JSON.stringify(list[i]));
                break;
              }
            }

            callback(task, context);
          }
        },
        // 매장확인
        {
          module: 'http',
          action: 'plaintext',
          method: 'POST',
          url: 'https://homeservice.lotteria.com',
          path: '/RIA/api/json/address/checkStore.json.asp?callback=jQuery18204446762312011845_1472370113237',
          param: {
            branch_id: ''
          },
          regexp: {
            doc: {
              json: /\((.*)\)$/g
            }
          },
          preCallback: function(task, context, callback) {
            task.param.branch_id = task.topTask.branch.BRANCH_ID;
            callback(task, context);
          },
          // jQuery182005611188629582564_1472215833890({"result":true,"message":null})
          postCallback: function(task, context, callback) {

            // var jsonStr = task.doc.json;
            // var json = JSON.parse(jsonStr);

            callback(task, context);
          }
        }
      ]
    },

    //주문확인
    {
      module: 'http',
      action: 'xpath',
      method: 'POST',
      url: 'https://homeservice.lotteria.com',
      path: '/RIA/cart/payment.asp',
      param: {
        phone: '',
        deliveryTime: '30',
        sKey: '',
        gubun_addr: '1',
        select_addr: '',
        addrDesc: '',
        selectStore: '',
        tmpDeliveryTime: '30',
        tmpStartTime: '22',
        tmpEndTime: '24',
        selectTime:'now'
      },
      xpath: {
        doc: {
          title: '//title/text()',
          totalPrice: '//input[@name="totalPrice"]/@value'
        }
      },
      preCallback: function(task, context, callback) {
        task.param.phone = context.user.mobile.replace(/-/g, '');
        task.param.sKey = task.topTask.sKey;
        task.param.selectStore = task.topTask.branch.BRANCH_ID;
        task.param.select_addr = task.topTask.confirmAddr;

        callback(task, context);
      },
      // jQuery182005611188629582564_1472215833890({"result":true,"message":null})
      postCallback: function(task, context, callback) {
        if(task.doc.title.search(/로그인/g) != -1) {
          console.log('주문하기 로그인 필요');
          return;
        }

        // console.log(task._text);
        if(task.doc.totalPrice) {
          task.topTask.totalPrice = task.doc.totalPrice.replace(/,/g, '');
        }

        console.log('주문확인' + task.topTask.totalPrice);

        callback(task, context);
      }
    },
    //주문완료
    {
      module: 'http',
      action: 'xpath',
      method: 'POST',
      url: 'https://homeservice.lotteria.com',
      path: '/RIA/api/json/cart/payment.proc.json.asp',
      param: {
        isMembership: 'false',
        checkVal: 'true',
        sKey: '',
        userID: '',
        phone: '',
        selectStore: '',
        deliveryTime: '30',
        selectTime: 'now',
        BUSINESS_DATE: '20160826',
        req_sale_amt: '9800',
        gubun_addr: '1',
        // addr: '경기도|부천시|중동||1106|위브더스테이트아파트|103동 3302호|180234.0000000000|444371.0000000000|경기도|부천시||신흥로|190||103동 3302호| (중동,위브더스테이트아파트)|180251.1593460757|444289.2192132780',
        addr: '',
        addrDesc: '',

        termsCollect: 'Y',
        paymentType: '1', // 1 현금결제 2 현금결제+영수증 3 신용카드(배달시
        memo: ''
      },
      paramDefs: [
        {
          type: 'number', name: 'paymentType', display: '결제방식', isReuired: true, question: '결제방식을 알려주세요.\n1. 현금결제\n2.현금결제+영수정\n3.신용카드',
          customCheck: function(text, type, task, context, callback) {
            try {
              var num = Number(text);
              if(num >= 1 && num <= 3) {
                callback(text, task, true);
                return;
              }
            } catch(e) {}

            callback(text, task, false);
          }
        },
        {type: 'string', name: 'memo', display: '메모', isReuired: true, question: '추가요청 사항이 있으면 입력해 주세요'}
      ],
      preCallback: function(task, context, callback) {
        task.param.phone = context.user.mobile.replace(/-/g, '');
        task.param.sKey = task.topTask.sKey;
        task.param.selectStore = task.topTask.branch.BRANCH_ID;
        task.param.addr = task.topTask.confirmAddr;

        task.param.BUSINESS_DATE = (new Date()).toISOString().slice(0,10).replace(/-/g,"");
        task.param.req_sale_amt = task.topTask.totalPrice;

        if(task.paymentType == '1' || task.paymentType == '2' || task.paymentType == '3')
          task.param.paymentType = task.paymentType;
        else
          task.param.paymentType = '3'; // 1 현금결제 2 현금결제+영수증 3 신용카드(배달시
        task.param.memo = task.memo;

        console.log(JSON.stringify(task.param));
      }
    }

  ]
};


exports.login = login;

var login = {
  module: 'task',
  action: 'sequence',
  actions: [
    {
      module: 'http',
      action: 'xpath',
      url: 'https://member.lpoint.com',
      path: '/door/sso/authUser.jsp',
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      param:
      {
        returnurl: 'https://homeservice.lotteria.com/RIA/member/login.proc.asp?rtnUrl=https://homeservice.lotteria.com/RIA/',
        sid: 'RIAHS',
        opentype: '',
        loginid: 'com2best',
        password: 'rltkd6tl!'
      },
      preCallback: function(task, context, callback) {
        callback(task, context);
      },
      postCallback: function(task, context, callback) {
        console.log(task._text);
        console.log('login: ' + task.param.loginid);
        callback(task, context);
      }
    },
    {
      module: 'http',
      action: 'xpath',
      url: 'https://member.lpoint.com',
      path: '/app/login/LSLA100200.do',
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      param: {
        onlId: 'com2best',
        popup: 'N',
        gubun: 'F',
        sid: 'RIAHS',
        frnYn: 'N',
        type: 'PW5',
        returnurl: 'https://homeservice.lotteria.com/RIA/member/login.proc.asp?rtnUrl=https://homeservice.lotteria.com/RIA/',
      },
      postCallback: function (task, context, callback) {
        context.user.logined = true;
        console.log(task._text);
        callback(task, context);
      }
    },
    {
      module: 'http',
      action: 'xpath',
      url: 'https://member.lpoint.com',
      path: '/app/login/LSLA100210.do',
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      param: {
        msgcd: '1',
        frnYn: 'N',
        popup: 'N',
        type: 'PW5',
        sid: 'RIAHS',
        returnurl: 'https://homeservice.lotteria.com/RIA/member/login.proc.asp?rtnUrl=https://homeservice.lotteria.com/RIA/',
      },
      postCallback: function (task, context, callback) {
        context.user.logined = true;
        console.log(task._text);
        callback(task, context);
      }
    }
  ]
};