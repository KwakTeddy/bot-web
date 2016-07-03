var net = require('net');
var request = require('request');
var chat = require('../controllers/chat.server.controller');
var moneybot = require('../controllers/moneybot.server.controller');

const CHANNEL_ID = 1469815524;
const CHANNEL_SECRET = 'b3250f6b4b68374c2c9d70314980b814';
const MID = 'uf4867e86aa4c0e064754b0555d52a98f';

const sendHeader = {
  'Content-Type' : 'application/json; charset=UTF-8',
  'X-Line-ChannelID' : CHANNEL_ID,
  'X-Line-ChannelSecret' : CHANNEL_SECRET,
  'X-Line-Trusted-User-With-ACL' : MID
};

var chatBot = "";

exports.keyboard = function (req, res) {
  console.log("kakao keyboard");

  var sendMsg =
  {
    "type": "text"
  };

  res.write(JSON.stringify(sendMsg));
  res.end();
};


exports.message = function (req, res) {
  console.log("kakao message");
  console.log(JSON.stringify(req.body));

  if(req.body && req.body.user_key && req.body.content) {
    var from = req.body.user_key;
    var type = req.body.type;
    var text = req.body.content;

    chat.write(from, req.params.botId, text, function (serverText) {
      moneybot.receivedMoneyBot(from, serverText, function(retText, url) {
        respondMessage(res, retText, url)
      });
    });
  }

};


exports.friend = function (req, res) {
  console.log("kakao friend");
  res.end();
};

exports.deleteFriend = function (req, res) {
  console.log("kakao friend delete");
  res.end();
};

exports.deleteChatRoom = function (req, res) {
  console.log("kakao chat_room");
  res.end();
};


function respondMessage(res, text, link) {
  if(link) {
    var linkMsg =
    {
      "message": {
        "text": text,
        "message_button": {
          "label": "상세정보보기",
          "url": url
        }
      }
    };

    console.log(JSON.stringify(linkMsg));
    res.write(JSON.stringify(linkMsg));
    res.end();

  } else {
    var sendMsg =
    {
      "message": {
        "text": text
      }
    };

    console.log(JSON.stringify(sendMsg));
    res.write(JSON.stringify(sendMsg));
    res.end();
  }
}

///////////////////////////////////////////////////////////////////
// 기존 샘플


function receiveOperations(reqJson) {
  var mid = reqJson.result[0].content.params[0];
  if(reqJson.result[0].content.opType == 4) {
    console.log('Add friend your account:' + mid);
  } else if(reqJson.result[0].content.opType == 8) {
    console.log('blocked your account:' + mid);
  }
}

function parrotMessages(reqJson) {
  var content = reqJson.result[0].content;
  var contentType = content.contentType;
  var toMid = content.from;

  switch (contentType) {
    case 1:
      if(content.text.substring(0,4) == "!주사위") {
        diceSend(toMid);
      } else if(content.text.substring(0,3) == "!랜덤") {
        randSend(toMid);
      } else if(content.text.substring(0,3) == "!전등") {
        lightSend(toMid, content.text);
      } else if(content.text.substring(0,3) == "!리치") {
        sendRich(toMid);
      }else {
        sendText(toMid, content.text);
      }
      break;
    case 2:
      sendImage(toMid, 'SERVER/test_image1.jpg', 'SERVER/test_preview.jpg');
      break;
    case 3:
      sendVideo(toMid, 'SERVER/test_video.mp4', 'SERVER/test_video_preview.jpg');
      break;
    case 4:
      sendAudio(toMid, 'SERVER/test_audio.m4a', 253000);
      break;
    case 7:
      sendLocation(toMid, content.location.title, content.location.address, content.location.latitude, content.location.longitude);
      break;
    case 8:
      sendSticker(toMid, content.contentMetadata.STKPKGID, content.contentMetadata.STKID, content.contentMetadata.STKVER);
      break;
    default:
      sendText(toMid, 'not support message');
      console.log('not support message');
      break;
  }

}

function sendText(toMid, text) {
  if( typeof toMid == "string" ) {
    toMid = [toMid];
  }

  var data = {
    "to": toMid,
    "toChannel": "1383378250",
    "eventType":"138311608800106203",
    "content": {
      "contentType":1,
      "toType":1,
      "text":text
    }
  };

  sendMessage(data);
}
function sendImage(toMid, imageUrl, previewUrl) {
  if( typeof toMid == "string" ) {
    toMid = [toMid];
  }

  var data = {
    "to": toMid,
    "toChannel": "1383378250",
    "eventType":"138311608800106203",
    "content": {
      "contentType":2,
      "toType":1,
      "originalContentUrl":imageUrl, // only jpeg < 1024×1024
      "previewImageUrl":previewUrl // only jpeg < 240×240
    }
  };

  sendMessage(data);
}
function sendVideo(toMid, videoUrl, previewUrl) {
  if( typeof toMid == "string" ) {
    toMid = [toMid];
  }

  var data = {
    "to": toMid,
    "toChannel": "1383378250",
    "eventType":"138311608800106203",
    "content": {
      "contentType":3,
      "toType":1,
      "originalContentUrl":videoUrl, // mp4 recommended
      "previewImageUrl":previewUrl // thumbnail image
    }
  };

  sendMessage(data);
}
function sendAudio(toMid, audioUrl, duration) {
  if( typeof toMid == "string" ) {
    toMid = [toMid];
  }

  var data = {
    "to": toMid,
    "toChannel": "1383378250",
    "eventType":"138311608800106203",
    "content": {
      "contentType":4,
      "toType":1,
      "originalContentUrl":audioUrl, // m4a recommended
      "contentMetadata":{
        "AUDLEN":duration // Length of voice message (ms)
      }
    }
  };

  sendMessage(data);
}
function sendLocation(toMid, title, address, latitude, longitude) {
  if( typeof toMid == "string" ) {
    toMid = [toMid];
  }

  var data = {
    "to": toMid,
    "toChannel": "1383378250",
    "eventType":"138311608800106203",
    "content": {
      "contentType":7,
      "toType":1,
      "text":title,
      "location":{
        "title":title + '\n' + address,
        "latitude":latitude,
        "longitude":longitude
      }
    }
  };

  sendMessage(data);
}
function sendSticker(toMid, stkpkgid, stkid, stkver) {
  if( typeof toMid == "string" ) {
    toMid = [toMid];
  }

  var data = {
    "to": toMid,
    "toChannel": "1383378250",
    "eventType":"138311608800106203",
    "content": {
      "contentType":8,
      "toType":1,
      "contentMetadata":{
        "STKPKGID":stkpkgid,
        "STKID":stkid,
        "STKVER":stkver
      }
    }
  };

  sendMessage(data);
}

function sendRich(toMid) {
  if( typeof toMid == "string" ) {
    toMid = [toMid];
  }

  var data = {
    "to": toMid,
    "toChannel": "1383378250",
    "eventType": "138311608800106203",
    "content": {
      "contentType": 12,
      "toType": 1,
      "contentMetadata": {
        "DOWNLOAD_URL": "IMAGE_SERVER/rich",
        "SPEC_REV": "1",
        "ALT_TEXT": "강릉 라임비치 펜션",
        "MARKUP_JSON": "{\"canvas\":{\"width\": 1040, \"height\": 623, \"initialScene\": \"scene1\"},\"images\":{\"image1\": {\"x\": 0, \"y\": 0, \"w\": 1040, \"h\": 623}},\"actions\": {\"link1\": {\"type\": \"web\",\"text\": \"강릉 라임비치 펜션\",\"params\": {\"linkUri\": \"http://limebeach.co.kr/\"}},\"link2\": {\"type\": \"web\",\"text\": \"강릉 라임비치 펜션 예약\",\"params\": {\"linkUri\": \"http://limebeach.co.kr/reserve.html\"}}},\"scenes\":{\"scene1\": {\"draws\": [{\"image\": \"image1\", \"x\": 0, \"y\": 0, \"w\": 1040, \"h\": 623}],\"listeners\": [{\"type\": \"touch\", \"params\": [0, 0, 520, 623], \"action\": \"link1\"},{\"type\": \"touch\", \"params\": [520, 0, 520, 623], \"action\": \"link2\"}]}}}"
      }
    }
  }

  sendMessage(data);
}


function sendMessage(data) {
  var options = {
    url: 'https://trialbot-api.line.me/v1/events',
    headers: sendHeader,
    json: true,
    body: data
  };

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      if(response.statusCode == 400 && data.content.contentType != 1) {
        sendText(data.to, 'not support message');
      }
      console.log('error: '+ JSON.stringify(response));
    }
  });
}

function getMessageContent(messageId) {
  var contentUrl = "https://trialbot-api.line.me/v1/bot/message/" + messageId + "/content";
  var options = {
    url: contentUrl,
    headers: sendHeader,
    encoding: 'binary'
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body.toString(), 'binary').toString('base64');
      console.log(data);
      res.send("getMessageContent:" + data);
    }
  });
}

function getMessageContentPreview(messageId) {
  var contentUrl = "https://trialbot-api.line.me/v1/bot/message/" + messageId + "/content/preview";
  var options = {
    url: contentUrl,
    headers: sendHeader,
    encoding: 'binary'
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body.toString(), 'binary').toString('base64');
      console.log(data);
      res.send("getMessageContent:" + data);
    }
  });
}

function getUserProfile(mid) {
  var options = {
    url: 'https://trialbot-api.line.me/v1/profiles?mids=' + mid,
    headers: sendHeader
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body.toString());
      res.send("result:" + body.toString());
    }
  });

}



//====================================================================================

function diceSend(toMid) {
  sendText(toMid, '주사위를 던졌다! ' + (Math.floor(Math.random() * 6) + 1) + '이 나왔다!');
}
function randSend(toMid) {
  sendText(toMid, '랜덤값을 꺼냈다! ' + Math.floor(Math.random() * 101) + '이 나왔다!');
}
function lightSend(toMid, message) {
  if(content.text.substring(0,5) == "!전등 켜") {
    request.post('http://GPIO_SERVER/on', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        sendText(data.to, 'on!');
      } else {
        console.log('error: '+ JSON.stringify(response));
      }
    });
  } else {
    request.post('http://GPIO_SERVER/off', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        sendText(data.to, 'off!');
      } else {
        console.log('error: '+ JSON.stringify(response));
      }
    });
  }

}
//====================================================================================

