var path = require('path');
var ahk = require(path.resolve('./modules/bot/action/common/ahk'));
var bot = require(path.resolve('./engine/core/bot')).getBot('moneybot');

var wooribank = {
  // module: 'automation',
  // task: 'ahk',
  name: 'testAhk',
  action: ahkAction,
  commands: [
    { ieOpen: true},
    { ieNavigate: 'https://spib.wooribank.com/pib/Dream?withyou=CMLGN0001'},
    { js: '\
        try {\
          document.getElementById("USER_ID").value = "com2best";\
          document.getElementById("PWD").focus();\
        }catch(e) {\
          alert(e);\
        }\
      '
    },
    { sleep: 5000},
    { virtualKeyboard: 'Finger2167'},
    { js: '\
        try {\
          var event = document.createEvent("MouseEvents");\
          event.initEvent("click", false, true);\
          document.getElementById("id_login").dispatchEvent(event);\
        }catch(e) {\
          alert(e);\
        }\
      '
    },
    { sleep: 3000},
    { ieNavigate: 'https://spib.wooribank.com/pib/Dream?withyou=PSINQ0027'},
    // { ieGetHtml: true},
    { js: '\
      try {\
        function setValueSelect(selName, selVal) {\
          var sel = document.getElementById(selName);\
          var val = selVal;\
          var opts = sel.options;\
          for(var opt, j = 0; opt = opts[j]; j++) {\
            if(opt.value == val) {\
              sel.selectedIndex = j;\
              break;\
            }\
          }\
        }\
        \
        setValueSelect("otherAcc", "1002435512892");\
        setValueSelect("INQSTADY_8Y", "2017");\
        setValueSelect("INQSTADY_8M", "01");\
        setValueSelect("INQSTADY_8D", "01");\
        setValueSelect("INQENDDY_8Y", "2017");\
        setValueSelect("INQENDDY_8M", "01");\
        setValueSelect("INQENDDY_8D", "06");\
        \
        var event = document.createEvent("HTMLEvents");\
        event.initEvent("change", false, true);\
        \
        document.getElementById("otherAcc").dispatchEvent(event);\
        document.getElementById("INQENDDY_8Y").dispatchEvent(event);\
        document.getElementById("INQENDDY_8M").dispatchEvent(event);\
        document.getElementById("INQENDDY_8D").dispatchEvent(event);\
        document.getElementById("INQSTADY_8Y").dispatchEvent(event);\
        document.getElementById("INQSTADY_8M").dispatchEvent(event);\
        document.getElementById("INQSTADY_8D").dispatchEvent(event);\
        \
        event = document.createEvent("MouseEvents");\
        event.initEvent("click", false, true);\
        document.getElementById("trnsSearch").dispatchEvent(event);\
      }catch(e) {\
        alert(e);\
      }\
    '},
    { sleep: 2000},
    { ieGetHtml: true},
    // { ieClose: true}
    {close: true}
  ],
  xpath: {

  }
};

bot.setTask('wooribank', wooribank);

var bccard = {
  // module: 'automation',
  // task: 'ahk',
  action: ahkAction,
  commands: [
    { ieOpen: true},
    { ieNavigate: 'http://isson.bccard.com/3rd/openSigninFormPage.jsp?UURL=http%3A%2F%2Fisson.bccard.com%2Fnls3%2Ffcs&NONCE=ARHMuweIezA9YY4XCuBYpf5ALGbthvmJsJ7EsTJKUigPBmszLZC3r8PO61Vaf6p7x7FR0hL4S%2BNCx%2BLlHWR6Gw%3D%3D&FORM=777'},
    { sleep: 5000},
    { js: '\
        try {\
          document.getElementById("loginId").value = "sy0815";\
          var event = document.createEvent("MouseEvents");\
          event.initEvent("click", false, true);\
          document.getElementById("loginPw").dispatchEvent(event);\
        }catch(e) {\
          alert(e);\
        }\
      '
    },
    { sleep: 7000},
    { virtualKeyboard: 'Finger2167!'},
    // { js: '\
    //     try {\
    //         sendPWD();\
    //     }catch(e) {\
    //       alert(e);\
    //     }\
    //   '
    // },
    // // { ieClose: true}
    // { sleep: 2000},
    // { ieNavigate: 'https://www.bccard.com/app/card/ApproveActn.do'},
    // {
    //   js: '\
    //     try {\
    //       document.getElementsByName("ra")[1].checked = true;\
    //       reSetRadio("custom_date");\
    //       \
    //       document.getElementById("fromDate").value = "2016-12-01";\
    //       document.getElementById("toDate").value = "2016-12-31";\
    //       first_submit();\
    //     } catch(e) {alert(e);}\
    // '},
    // { ieGetHtml: true},
    {close: true}
  ],
  xpath: {

  }
};

bot.setTask('bccard', bccard);

var net = require('net');
var async = require('async');

function ahkAction(task, context, callback) {
  var client;
  // var server = '192.168.1.4';
  var server = '10.211.55.3';

  if(context.dialog.ahkClient) {
    client = context.dialog.ahkClient;
  } else {
    client = net.connect({port:27015, host:server}, function(){
      console.log('Client connected');
      context.dialog.ahkClient = client;
    });
  }

  var buffer = null, bufferSize = 0;
  client.on('data', function(_data){
    data = _data.toString();
    console.log('Client data: ' + data);

    // TODO 분할 전송시 처리, 헤더에 전송길이 처리
    if(data.startsWith('IeGetHtml')) {
      var preIdx = 0, idx = -1;
      idx = data.indexOf(' ', preIdx);
      command = data.substring(preIdx, idx);
      preIdx = idx;
      idx = data.indexOf(' ', preIdx+1);
      result = data.substring(preIdx+1, idx);
      preIdx = idx;
      idx = data.indexOf(' ', preIdx+1);
      bufferSize = Number(data.substring(preIdx+1, idx));

      buffer = data;
      if(buffer.length >= bufferSize) {parseClient(buffer); buffer = null;}
    } else if(buffer != null) {
      buffer += data;
      console.log(buffer.length + '/' + bufferSize);

      if(buffer.length >= bufferSize) {parseClient(buffer); buffer = null;}
    } else {
      parseClient(data);
    }
  });

  client.on('error', function(){
    processClient();
    console.log('Client disconnected');
  });

  client.on('timeout', function(){
    processClient();
    console.log('Client timeout');
  });

  client.on('end', function(){
    console.log('Client disconnected');
  });

  var parseClient = function(data) {
    if(data) {
      var command, result, message;
      var preIdx = 0, idx = -1;
      if((idx = data.indexOf(' ', preIdx)) != -1) {
        command = data.substring(preIdx, idx);

        preIdx = idx;
        if((idx = data.indexOf(' ', preIdx+1)) != -1) {
          result = data.substring(preIdx+1, idx);
          message = data.substring(idx+1);
        } else {
          result = data.substring(preIdx+1);
        }
      }
      console.log(command + ' ' + result);

      processClient(command, result, message);
    }
  };

  var processClient;
  async.waterfall([
    function(cb1) {
      processClient = function(command, result, message) {
        if (result !== '0') {
          cb1(true);
        } else {
          if(command === 'IeReady') cb1(null);
        }
      }
    },
    function(cb1) {
      async.eachSeries(task.commands, function(command, cb) {
        if(command.ieOpen == true) {
          client.write('IeOpen');
        } else if(command.ieNavigate) {
          client.write('IeNavigate ' + command.ieNavigate);
        } else if(command.ieClose == true) {
          client.write('IeClose');
        } else if(command.js) {
          client.write('IeJavascript ' + command.js);
        } else if(command.ieGetHtml == true) {
          client.write('IeGetHtml');
        } else if(command.virtualKeyboard) {
          client.write('VirtualKeyboard ' + command.virtualKeyboard);
        } else if(command.sleep) {
          client.write('Sleep ' + command.sleep);
        } else if(command.close == true) {
          client.end();
          client = null;
          context.dialog.ahkClient = undefined;
          cb(true);
        }

        processClient = function(command, result, message) {
          if (result !== '0') {
            cb(true);
          } else {
            if(command === 'ieGetHtml') task._text = message;
            if(command === 'ieClose') {
              client.end();
              client = null;
              context.dialog.ahkClient = undefined;
            }

            cb(null);
          }
        }
      }, function(err) {
        cb1(null);
      });
    }
  ], function(err) {
    callback(task, context);
  });
}

bot.setAction('ahk', ahk);

// { ieOpen: true},
// { ieNavigate: 'http://www.moneybrain.ai'},
// { ieClose: true},
// { jqueryInjection: true},
// { js: ''},
// { dom: {selector: '', data: ''}},
// { dom: {selector: '', data: ''}},
// { event: {selector: '', event: ''}},
// { ahk: ''},
// { sleep: 3000},
// { controlClick: {title: '', content: '', instance: 1}, timeout: 3000},
// { ieGetHtml: true}


function connectAhk(task, context, callback) {
  var client = net.connect({port:27015, host:'10.211.55.3'}, function(){
    console.log('Client connected');
    // console.log(client.write('한글테스트'));
    // callback(task, context);
  });

  var buffer = null, bufferSize = 0;
  client.on('data', function(_data){
    data = _data.toString();

    // TODO 분할 전송시 처리, 헤더에 전송길이 처리
    if(data.startsWith('IeGetHtml')) {
      var preIdx = 0, idx = -1;
      idx = data.indexOf(' ', preIdx);
      command = data.substring(preIdx, idx);
      preIdx = idx;
      idx = data.indexOf(' ', preIdx+1);
      result = data.substring(preIdx+1, idx);
      preIdx = idx;
      idx = data.indexOf(' ', preIdx+1);
      bufferSize = Number(data.substring(preIdx+1, idx));

      buffer = data;
      if(buffer.length >= bufferSize) {processClient(buffer); buffer = null;}
    } else if(buffer != null) {
      buffer += data;
      console.log(buffer.length + '/' + bufferSize);

      if(buffer.length >= bufferSize) {processClient(buffer); buffer = null;}
    } else if(data.startsWith('Ie')) {
      processClient(data);
    }
  });

  client.on('end', function(){
    console.log('Client disconnected');
  });

  var processClient = function(data) {
//    console.log('processClient: ' + data);

    var command, result, message;
    if(data) {
      var preIdx = 0, idx = -1, command, result, message;
      if((idx = data.indexOf(' ', preIdx)) != -1) {
        command = data.substring(preIdx, idx);

        preIdx = idx;
        if((idx = data.indexOf(' ', preIdx+1)) != -1) {
          result = data.substring(preIdx+1, idx);

          message = data.substring(idx+1);
        } else {
          result = data.substring(preIdx+1);
        }
      }

      console.log(command + ' ' + result);
      //  client.end();

      if(result === '0') {
        if(command === 'IeReady') {
          client.write('IeOpen');
        } else if(command === 'IeOpen') {

          client.write('IeNavigate' + ' ' +  'http://www.moneybrain.ai');

        } else if(command === 'IeNavigate') {

          var script = '\
          document.getElementById("query").value = "test";\
          var event = document.createEvent("MouseEvents");\
          event.initEvent("click", false, true);\
          document.getElementById("search_btn").dispatchEvent(event);\
          ';

          // client.write('IeJavascript' + ' ' +  script);
          client.write('IeGetHtml');

        } else if(command === 'IeJavascript') {

          client.write('IeGetHtml');

        } else if(command === 'IeGetHtml') {

          client.write('IeClose');

        } else if(command === 'IeClose') {
          console.log(buffer);
          client.end();
          callback(task, context);
        }
      } else {
        client.end();
        callback(task, context);
      }
    }
  }
}

bot.setAction("connectAhk", connectAhk);

// document.getElementById("query").value = "test";
// var event = document.createEvent("MouseEvents");
// event.initEvent("click", false, true);
// document.getElementById("search_btn").dispatchEvent(event);


