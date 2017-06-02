var net = require('net');
var request = require('request');
var path = require('path');
var chat = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
var contextModule = require(path.resolve('modules/bot/engine/common/context'));
var util = require('util');
var config = require(path.resolve('config/config'));


exports.message =  function(req, res) {
  console.log("navertalk message");
  console.log(JSON.stringify(req.body));

    // default response
    var response = {
      success: true,
      request: {
        event: "send", /* send message */
        sender: "partner", /* 파트너가 보내는 메시지 */
        user : req.body.user, /* 유저 식별값 */
        partner: req.body.partner, /* 파트너 식별값 wc1234 */
      }
    };
    var from = req.body.user;

    switch(req.body.event) {
      // 메시지 전송 이벤트 처리
      case 'send' :
        if(req.body.sender == 'user' && req.body.textContent) {
          console.log(req.params.bot)
          chat.write('navertalk', from, 'Shinhancard', req.body.textContent.text, req.body, function (serverText, json) {
            console.log(util.inspect(serverText, {showHidden: false, depth: null}));
            console.log(util.inspect(json, {showHidden: false, depth: null}));
          // chat.write('navertalk', from, req.params.bot, req.body.textContent.text, req.body, function (serverText, json) {


            respondMessage(response, serverText, json, res);
            res.json(response);
          });

          // response.request.textContent.text = 'echo: ' + req.body.textContent.text;
        } else {
          // 그외의 경우는 무반응
          res.json({ success: true });
        }
        break;

      // 채팅창 오픈 이벤트 처리
      case 'open' :
        switch(req.body.options.inflow) {
          // 채팅리스트로부터 인입되었을때
          case 'list' :
            response.request.textContent.text = '안녕하세요 PlayChat입니다. 인기봇, 최신봇, 친구봇, 마이봇 중 하나를 입력해주세요. 되돌아가시려면 목록을 입력해주세요';
            res.json(response);
            break;

          // 유입경로가 없거나 화면을 갱신하였을때
          case 'none' :
            response.request.textContent.text = '안녕하세요 PlayChat입니다. 인기봇, 최신봇, 친구봇, 마이봇 중 하나를 입력해주세요. 되돌아가시려면 목록을 입력해주세요';
            res.json(response);
            break;

          default:
            res.json({ success: true });
        }
        break;

      // 친구 이벤트 처리
      case 'friend' :
        if(req.body.options.set == 'on') {
          // 친구 추가시
          response.request.textContent.text = '친구가되어주셔서 감사합니다.';
          res.json(response);

        } else if(req.body.options.set == 'off') {
          // 친구 쵤회시
          response.request.textContent.text = '다음번에 꼭 친구추가 부탁드려요.';
          res.json(response);
        }
        break;

      // 그외의 이벤트에 대해 무반응
      default:
        res.json({ success: true });
    }
};


function respondMessage(response, text, task, res) {
  if (task && task.result) {
    if (task){
      delete task.inNLP;
      delete task.inRaw;
      delete task.name;
      delete task.action;
      delete task.topTask;
      if(task.output){
        delete task.output
      }
    }
    // If we receive a text message, check response see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    console.log(util.inspect(task), {showHidden: false, depth: null})
    console.log(util.inspect(Object.keys(task.result).toString(), {showHidden: false, depth: null}))
    switch (Object.keys(task.result).toString()) {
      case 'image':
        sendGenericMessage(response, text, task.result);
        break;

      case 'image,buttons':
        sendGenericMessage(response, text, task.result);
        break;
      case 'buttons':
        sendButtonMessage(response, text, task.result);
        break;

      case 'items':
        sendGenericMessage(response, text, task.result);
        break;

      case 'receipt':
        sendReceiptMessage(response);
        break;

      case 'smartReply':
        smartReplyMessage(response, text, task.result);
        break;

      default:
        sendTextMessage(response, text, task.result);
    }
  }else {
    console.log('taks' + util.inspect(task), {showHidden: false, depth: null})
    console.log('taks' + util.inspect(text), {showHidden: false, depth: null})
    if (task){
      delete task.inNLP;
      delete task.inRaw;
      delete task.name;
      delete task.action;
      delete task.topTask;
      if(task.output){
        delete task.output
      }
    }
    if(text){
      if (task && task.hasOwnProperty('image')){
        if (task.hasOwnProperty('buttons')){
          //text && image && buttons
          sendCompositeMessage(response, text, task, res);

        }else {
          //text && image
          sendCompositeMessage(response, text, task, res);

        }
      }else {
        if (task && task.hasOwnProperty('buttons')){
          //text && buttons
          sendCompositeMessage(response, text, task, res);

        }else {
          //text
          sendTextMessage(response, text, task, res);
        }
      }
    }else {
      if (task && task.hasOwnProperty('image')){
        if (task && task.hasOwnProperty('buttons')){
          //image && buttons _ error
          // sendGenericMessage(response, text, task);

        }else {
          //image
          sendImageMessage(response, text, task, res);

        }
      }else {
        //only button or nothing _ error
        // if (task.hasOwnProperty('buttons')){
        //   //buttons this is error
        //
        // }else {
        //   //nothing
        //   sendTextMessage(response, text, task);
        //
        // }
      }
    }
  }
}

function sendTextMessage(response, text, task, res) {
  response.request['textContent'] = {text: ''};
  response.request.textContent.text = text;
  res.json(response)
}

function sendImageMessage(response, text, task, res) {
  if (task.image.url.substring(0,4) !== 'http'){
    task.image.url = config.host + task.image.url
  }
  response.request['imageContent'] = {imageUrl: '', height: '594', width: '420'};
  response.request.imageContent.imageUrl = task.image.url;
  res.json(response)
}

function sendCompositeMessage(response, text, task, res) {
  response.request['compositeContent'] = { compositeList: []};
  if(task.items){

  }else {
    var composit = {};
    composit['title'] = text;
    // composit['description'] = text;
    if(task.image){
      if (task.image.url.substring(0,4) !== 'http'){
        task.image.url = config.host + task.image.url
      }
      composit['image'] = {imageUrl: task.image.url, height: '530', width: '290'};
    }
    if(task.buttons){
      composit['buttonList'] = [];
      for(var i = 0; i < task.buttons.length; i++){
        var button = '';
        if ( task.buttons[i].url){
          button = {
            "type": "LINK",
            "link": {
              "title": '', /* 버튼에 노출하는 버튼명 (최대 20자)*/
              "url": "", /* 톡톡 PC버전 채팅창에서 링크 URL */
              "mobileUrl": "", /* 톡톡 모바일버전 채팅창에서 링크 URL */
              "targetSelf": true, /* 톡톡 모바일버전 채팅창에서 버튼클릭시 자창(true)/새창(false) 여부 (default: false) */
              "pcTargetSelf": false, /* 톡톡 PC버전 채팅창에서 버튼클릭시 자창(true)/새창(false) 여부 (default: false) */
              "pcPopupSpecs": "titlebar=0,menubar= 0,toolbar=0,scrollbars=0,resizable=0,width=412,height=640" /* pcTargetSelf 속성이 false 이면서 pcPopupSpecs 가 정의되면 팝업으로 전환 */
            }
          };
          button.link.title = task.buttons[i].text;
          button.link.url = task.buttons[i].url;
          button.link.mobileUrl = task.buttons[i].url;
        }else {
          button = {
            "type": "TEXT",
            "text": "", /* 버튼에 노출하는 버튼명 (최대 20자)*/
            "code": "" /* code를 정의하는경우 유저가 보내는 send이벤트 textContent에 code가 삽입되어 전송됨 (최대 1,000자)*/
          };
          button.text = task.buttons[i].text;
          button.code = '123123123';
        }
        composit.buttonList.push(button);
      }
    }
    response.request.compositeContent.compositeList.push(composit)
    res.json(response);
  }
}
