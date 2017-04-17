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

    switch(req.body.event) {
      // 메시지 전송 이벤트 처리
      case 'send' :
        if(req.body.sender == 'user' && req.body.textContent) {
          //
          chat.write('navertalk', from, req.params.bot, req.body.textContent.text, req.body, function (serverText, json) {
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
            response.request.textContent.text = '안녕하세요 PlayChat입니다. 인기봇, 최신봇, 친구봇, 마이봇 중 하나를 입력해주세요.';
            res.json(response);
            break;

          // 유입경로가 없거나 화면을 갱신하였을때
          case 'none' :
            response.request.textContent.text = '안녕하세요 PlayChat입니다. 인기봇, 최신봇, 친구봇, 마이봇 중 하나를 입력해주세요.';
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
