var path = require('path');
var config = require(path.resolve('config/config'));
var util = require('util');

(function()
{
    var NaverTalk = function()
    {

    };

    NaverTalk.prototype.message = function(req, res)
    {
        var Engine = require('../core.js');
        console.log("navertalk message");

        // default response
        var response = {
            success: true,
            request: {
                event: "send", /* send message */
                sender: "partner", /* 파트너가 보내는 메시지 */
                user : req.body.user, /* 유저 식별값 */
                partner: req.body.partner /* 파트너 식별값 wc1234 */
            }
        };

        var userKey = req.body.user;
        var inputRaw = req.body.textContent.text;

        var event = req.body.event;
        if(event == 'send')
        {
            // 메시지 전송 이벤트 처리
            if(req.body.sender == 'user' && req.body.textContent)
            {
                Engine.process(req.params.botId, 'navertalk', userKey, inputRaw, {}, function(context, out)
                {

                },
                function(err)
                {
                    //에러 처리
                });
            }
            else
            {
                // 그외의 경우는 무반응
                res.json({ success: true });
            }
        }
        else if(event == 'open')
        {
            Engine.process(req.params.botId, 'navertalk', userKey, '시작', {}, function(context, out)
            {

            },
            function(err)
            {
                //에러 처리
            });
        }
        else if(event == 'friend')
        {
            if(req.body.options.set == 'on')
            {
                // 친구 추가시
                response.request.textContent.text = '친구가 되어주셔서 감사합니다.';
                res.json(response);

            } else if(req.body.options.set == 'off') {
                // 친구 쵤회시
                response.request.textContent.text = '다음번에 꼭 친구추가 부탁드려요.';
                res.json(response);
            }
        }
        else
        {
            res.json({ success: true });
        }
    };

    module.exports = new NaverTalk();
})();


function respondMessage(response, text, task, res) {
  if (task && task.result) {
    switch (Object.keys(task.result).toString()) {
      case 'image':
        sendImageMessage(response, text, task.result, res);
        break;

      case 'image,buttons':
        sendCompositeMessage(response, text, task.result, res);
        break;

      case 'items':
        sendCompositeMessage(response, text, task.result, res);
        break;

      default:
        sendTextMessage(response, text, task.result, res);
    }
  }else {
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
          console.log('only image and buttons. No TEXT!')

        }else {
          //image
          sendImageMessage(response, text, task, res);

        }
      }else {
        //only button or nothing _ error
        console.log('only button or nothing!')
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
    task = task.items;
    var length = task.length;
    if(length > 10) length = 10; // 최대 10개
    for(var i =0; i < length; i++){
      var composit = {};
      if(task[i].title){
        composit['title'] = task[i].title;
        composit['description'] = task[i].text;
      }else {
        composit['title'] = task[i].text;
      }


      if(task[i].imageUrl){
        if (task[i].imageUrl.substring(0,4) !== 'http'){
          task[i].imageUrl = config.host + task[i].imageUrl
        }
        composit['image'] = {imageUrl: task[i].imageUrl, height: '530', width: '290'};
      }
      
      
      if (task[i].buttons) {
        composit['buttonList'] = [];
        for(var k = 0; k < task[i].buttons.length; k++){
          var button = '';
          if ( task[i].buttons[k].url){
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
            button.link.title = task[i].buttons[k].text;
            button.link.url = task[i].buttons[k].url;
            button.link.mobileUrl = task[i].buttons[k].url;
          }else {
            button = {
              "type": "TEXT",
              "text": "", /* 버튼에 노출하는 버튼명 (최대 20자)*/
              "code": "" /* code를 정의하는경우 유저가 보내는 send이벤트 textContent에 code가 삽입되어 전송됨 (최대 1,000자)*/
            };
            button.text = task[i].buttons[k].text;
          }
          composit.buttonList.push(button);
        }
      }
      response.request.compositeContent.compositeList.push(composit);
    }
    console.log(util.inspect(response, {showHidden: false, depth: null}))
    res.json(response);

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
      var buttonLength;
      if(task.buttons.length > 10) buttonLength = 10;
      else buttonLength = task.buttons.length;
      for(var i = 0; i < buttonLength; i++){
        var button = {};
        if ( task.buttons[i].url){
          button = {
            "type": "LINK",
            "link": {
              "title": "", /* 버튼에 노출하는 버튼명 (최대 20자)*/
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
          if(button.link.title.length > 20) button.link.title = button.link.title.substring(0,19);

        }else {
          button = {
            "type": "TEXT",
            "text": "", /* 버튼에 노출하는 버튼명 (최대 20자)*/
            // "code": "" /* code를 정의하는경우 유저가 보내는 send이벤트 textContent에 code가 삽입되어 전송됨 (최대 1,000자)*/
          };
          button.text = task.buttons[i].text;
          if(button.text.length > 20) button.text = button.text.substring(0,19);

        }
        composit.buttonList.push(button);
      }
    }
    response.request.compositeContent.compositeList.push(composit);
    console.log(util.inspect(response), {showHidden: false, depth: null})
    // console.log(util.inspect(response.request.compositeContent.compositeList), {showHidden: false, depth: null})
    // console.log(util.inspect(response.request.compositeContent.compositeList[0]), {showHidden: false, depth: null})
    res.json(response);
  }
}
