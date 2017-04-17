var net = require('net');
var request = require('request');
var path = require('path');
var chat = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
var contextModule = require(path.resolve('modules/bot/engine/common/context'));

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
        textContent: {
          text: ''
        }
      }
    };
    var from = req.body.user;
    var type = req.body.type;
    var text = req.body.textContent.text;

    switch(req.body.event) {
      // 메시지 전송 이벤트 처리
      case 'send' :
        if(req.body.sender == 'user' && req.body.textContent) {
          // 유저가 보내는 메시지에 대해 echo로 전송

          chat.write('navertalk', from, req.params.bot, text, req.body, function (serverText, json) {
            // respondMessage(res, serverText, json)
            JSON.stringify(serverText);
            response.request.textContent.text = serverText;
            res.json(response);
          });


          response.request.textContent.text = 'echo: ' + req.body.textContent.text;

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
            response.request.textContent.text = '리스트에서 눌러서 방문하셨네요.';
            res.json(response);
            break;

          // 유입경로가 없거나 화면을 갱신하였을때
          case 'none' :
            response.request.textContent.text = '화면을 갱신하셨네요.';
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

    chat.write('navertalk', from, req.params.bot, text, function (serverText, json) {
      respondMessage(res, serverText, json)
    });
};

function respondMessage(res, text, json) {
  var sendMsg =
    {
      "message": {
        "text": text
      }
    };

  if(json && json.photoUrl) {
    sendMsg.message.photo = {
      "url": json.photoUrl,
      "width": json.photoWidth,
      "height":json.photoHeight
    }
  }

  if(json && json.result && json.result.image) {
    sendMsg.message.photo = {
      "url": json.result.image.url,
      "width": json.result.image.width || 640,
      "height":json.result.image.height || 480
    };

    if(!json.url) {
      sendMsg.message.message_button =
        {
          "label": (json.urlMessage ? json.urlMessage : "이미지보기"),
          "url": json.result.image.url
        };
    }
  }

  if(json && json.url) {
    sendMsg.message.message_button =
      {
        "label": (json.urlMessage ? json.urlMessage : "상세정보보기"),
        "url": json.url
      };
  }

  if(json && json.buttons) {
    sendMsg.keyboard =
      {
        "type": "buttons",
        "buttons": json.buttons
      };
  }

  console.log(JSON.stringify(sendMsg));
  res.write(JSON.stringify(sendMsg));
  res.end();
}
