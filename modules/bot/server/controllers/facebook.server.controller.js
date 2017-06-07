var net = require('net');
var request = require('request');
var path = require('path');
var chat = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
var contextModule = require(path.resolve('modules/bot/engine/common/context'));
var config = require(path.resolve('config/config'));

var subscribe = '';
var subscribePageToken = '';
var mongoose = require('mongoose');
var UserBotFbPage = mongoose.model('UserBotFbPage');
var botLib = require(path.resolve('config/lib/bot'));
var utils = require(path.resolve('modules/bot/action/common/utils'));


var util =require('util'); //temporary
var botContext = '';
 

exports.messageGet =  function(req, res) {
  contextModule.getContext(req.params.bot, 'facebook', null, null, function(context) {
      var bot = '';
      if (!context.botUser){
          bot = context.bot
      }else {
          bot = context.botUser.orgBot
      }
      // var bot = context.botUser.orgBot || context.bot;

      if (req.query['hub.mode'] === 'subscribe' &&
          req.query['hub.verify_token'] === bot.facebook.VALIDATION_TOKEN) {
          console.log("Validating webhook");
          res.status(200).send(req.query['hub.challenge']);
      } else {
          console.error("Failed validation. Make sure the validation tokens match.");
          res.sendStatus(403);
      }
  });
};


exports.message = function (req, res) {
  var data = req.body;
  if (data.object == 'page') {      // Make sure this is a page subscription
    data.entry.forEach(function(pageEntry) {       // There may be multiple if batched
          pageEntry.messaging.forEach(function(messagingEvent) {          // Iterate over each messaging event
            messagingEvent.botId = req.params.bot;

            if (messagingEvent.message) receivedMessage(messagingEvent);
            else if (messagingEvent.postback) receivedPostback(messagingEvent);
            else if (messagingEvent.optin) receivedAuthentication(messagingEvent);
            else if (messagingEvent.delivery) receivedDeliveryConfirmation(messagingEvent);
            else console.log("Webhook received unknown messagingEvent: ", messagingEvent);
          });
      });
      res.sendStatus(200); // You must send back a 200, within 20 seconds, to let us know you've
  }else {
    return false;
  }
};

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var message = event.message;
  if (event.botId == "subscribeBot"){
    console.log('Subscribe Coming In');
      UserBotFbPage.findOne({pageId: event.recipient.id}, function (err, data) {
          if (err){
              console.log(err);
          }else {
              subscribe = true;
              subscribePageToken = data.accessToken;
              event.botId = data.userBotId;
              contextModule.getContext(event.botId, 'facebook', senderID, null, function(context) {
                botContext = context;
                if(recipientID == data.pageId) {
                  var messageId = message.mid;
                  var messageText = message.text;
                  var messageAttachments = message.attachments;
                  if (messageAttachments){
                      var imageData = JSON.parse(JSON.stringify(messageAttachments));
                      message = {};
                      if (imageData[0].type == 'image'){
                        imageData[0].type = 'photo'
                      }
                      message['inputType'] =  imageData[0].type;
                      message.url = imageData[0].payload.url;
                      messageText='fbImage';
                  }
                  chat.write('facebook', senderID, event.botId, messageText, message, function (retText, task) {
                      respondMessage(senderID, retText, event.botId, task);
                  });
                }
              });
          }
      });
  }else {
      if (!global._bots[event.botId]){
        botLib.loadBot(event.botId, function (realbot) {
          if(recipientID == global._bots[event.botId].facebook.id) {
            contextModule.getContext(event.botId, 'facebook', senderID, null, function(context) {
              //console.log('receivedMessage: ', event);

              bot = context.botUser.orgBot || context.bot;
              if(recipientID == bot.facebook.id) {
                console.log('2 senderID: ' + senderID + ', recipientID: ' + recipientID);

                var messageId = message.mid;
                var messageText = message.text;
                var messageAttachments = message.attachments;

                chat.write('facebook', senderID, event.botId, messageText, message, function (retText, task) {
                  respondMessage(senderID, retText, event.botId, task);
                });
              }
            });
          }
        });
      }else {
        if(recipientID == global._bots[event.botId].facebook.id) {
          contextModule.getContext(event.botId, 'facebook', senderID, null, function(context) {
            //console.log('receivedMessage: ', event);

            bot = context.botUser.orgBot || context.bot;
            if(recipientID == bot.facebook.id) {
              console.log('2 senderID: ' + senderID + ', recipientID: ' + recipientID);

              var messageId = message.mid;
              var messageText = message.text;
              var messageAttachments = message.attachments;

              chat.write('facebook', senderID, event.botId, messageText, message, function (retText, task) {
                respondMessage(senderID, retText, event.botId, task);
              });
            }
          });
        }
      }
  }
}

/*
 * Postback Event
 */
function receivedPostback(event) {
  var senderID = event.sender.id;
  var payload = event.postback.payload;
  var recipientID = event.recipient.id;

  if (event.botId == "subscribeBot"){
    UserBotFbPage.findOne({pageId: event.recipient.id}, function (err, data) {
      if (err){
        console.log(err);
      }else {
        subscribe = true;
        subscribePageToken = data.accessToken;
        event.botId = data.userBotId;
        contextModule.getContext(event.botId, 'facebook', senderID, null, function(context) {
          botContext = context;
          console.log("Received postback");
          chat.write('facebook', senderID, event.botId, payload, null, function (retText, task) {
            respondMessage(senderID, retText, event.botId, task);
          });
        });
      }
    });
  }else {

    if (!global._bots[event.botId]){
      botLib.loadBot(event.botId, function (realbot) {
        if(recipientID == global._bots[event.botId].facebook.id) {
          contextModule.getContext(event.botId, 'facebook', senderID, null, function(context) {
            botContext = context;
            if(recipientID == bot.facebook.id) {
              chat.write('facebook', senderID, event.botId, payload, null, function (retText, task) {
                respondMessage(senderID, retText, event.botId, task);
              });
            }
          });
        }
      });
    }else {
      if(recipientID == global._bots[event.botId].facebook.id) {
        contextModule.getContext(event.botId, 'facebook', senderID, null, function(context) {
          botContext = context;
          if(recipientID == bot.facebook.id) {
            chat.write('facebook', senderID, event.botId, payload, null, function (retText, task) {
              respondMessage(senderID, retText, event.botId, task);
            });
          }
        });
      }
    }
  }
}

/*
 * Delivery Confirmation Event
 */
function receivedDeliveryConfirmation(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var delivery = event.delivery;
  var messageIDs = delivery.mids;
  var watermark = delivery.watermark;
  var sequenceNumber = delivery.seq;

  if (messageIDs) {
    messageIDs.forEach(function(messageID) {
      // console.log("Received delivery confirmation for message ID: %s",
      //   messageID);
    });
  }

  // console.log("All message before %d were delivered.", watermark);
}


/*
 * Authorization Event
 */
function receivedAuthentication(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfAuth = event.timestamp;

  // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
  // The developer can set this to an arbitrary value to associate the
  // authentication callback with the 'Send to Messenger' click event. This is
  // a way to do account linking when the user clicks the 'Send to Messenger'
  // plugin.
  var passThroughParam = event.optin.ref;

  console.log("Received authentication for user %d and page %d with pass " +
    "through param '%s' at %d", senderID, recipientID, passThroughParam,
    timeOfAuth);

  // When an authentication is received, we'll send a message back to the sender
  // to let them know it was successful.
  sendTextMessage(senderID, "Authentication successful");
}


function respondMessage(to, text, botId, task) {
  var tokenData = '';
  var bot = botContext.botUser.orgBot || botContext.bot;

  if (subscribe) tokenData = subscribePageToken;
  else tokenData = bot.facebook.PAGE_ACCESS_TOKEN;

  if (task && task.result) {
    var result = task.result;

    switch (Object.keys(result).toString()) {
      case 'image':
        sendGenericMessage(to, text, result, tokenData);
        break;

      case 'image,buttons':
        sendGenericMessage(to, text, result, tokenData);
        break;
      case 'buttons':
        sendButtonMessage(to, text, result, tokenData);
        break;

      case 'items':
        sendGenericMessage(to, text, result, tokenData);
        break;

      case 'receipt':
        sendReceiptMessage(to);
        break;

      case 'smartReply':
        smartReplyMessage(to, text, result, tokenData);
        break;

      default:
        sendTextMessage(to, text, result, tokenData);
    }
  }else {
    if(text){
      if (task && task.hasOwnProperty('image')){
        if (task.hasOwnProperty('buttons')){
          //text && image && buttons
          sendGenericMessage(to, text, task, tokenData);

        }else {
          //text && image
          sendGenericMessage(to, text, task, tokenData);

        }
      }else {
        if (task && task.hasOwnProperty('buttons')){
          //text && buttons
          sendButtonMessage(to, text, task, tokenData);

        }else {
          //text
          sendTextMessage(to, text, task, tokenData);
        }
      }
    }else {
      if (task && task.hasOwnProperty('image')){
        if (task && task.hasOwnProperty('buttons')){
          //image && buttons _ error
          console.log('only image and buttons. No TEXT!')
        }else {
          //image
          sendImageMessage(to, text, task, tokenData);

        }
      }else {
        //only button or nothing _ error
        console.log('only button or nothing!')
      }
    }
  }
}
exports.respondMessage = respondMessage;


/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, text, task, token) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: text
    }
  };
  callSendAPI(messageData, token);
}


/*
 * Send a message with an using the Send API.
 *
 */
function sendImageMessage(recipientId, text, task, token) {
  if(task.image){
    if (task.image.url.substring(0,4) !== 'http'){
      task.image.url = config.host + task.image.url
    }
  }

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: task.image.url
        }
      }
    }
  };
  callSendAPI(messageData, token);
}

/*
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId, text, task, token) {
  var bot = botContext.botUser.orgBot || botContext.bot;
  var buttons = [];

  if(bot && bot.commonButtons && bot.commonButtons.length && botContext.botUser._currentDialog.name && (botContext.botUser._currentDialog.name != botContext.bot.startDialog.name)){
    if(task.buttons) task.buttons =  task.buttons.slice(0, task.buttons.length - bot.commonButtons.length);
    else if(task.result.buttons) task.result.buttons =  task.result.buttons.slice(0, task.buttons.length - bot.commonButtons.length);
  }

  if(task.buttons.length > 3){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: text
    }
  };

  callSendAPI(messageData, token);

  }else {
    for(var i = 0; i < task.buttons.length; i++){
      var btn = {};
      btn['title'] = task.buttons[i].text;
      if (task.buttons[i].url){
        btn['type'] = 'web_url';

      }else {
        btn['type'] = 'postback';
        btn['payload'] = task.buttons[i].text
      }
      buttons.push(btn)
    }

    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: text,
            buttons: buttons
          }
        }
      }
    };
    callSendAPI(messageData, token);
  }
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function sendGenericMessage(recipientId, text, task, token) {
  if (task.items){
    task = task.items;
    var elements = [];
    var elementsLength;
    if (task.length > 10) elementsLength = 10;
    else elementsLength = task.length;

    for(var i =0; i < elementsLength; i++){
      var elm = {}
      if (task[i].text){
        elm['title'] = task[i].title;
        elm['subtitle'] = task[i].text;
      }
      if (task[i].imageUrl) {
        if (task[i].imageUrl.substring(0,4) !== 'http'){
          task[i].imageUrl = config.host + task[i].imageUrl
        }
        elm['image_url'] = task[i].imageUrl
      }
      if (task[i].buttons) {
        var buttons = [];
        var buttonLength;

        if (task[i].buttons.length > 3) buttonLength = 3;
        else buttonLength = task[i].buttons.length;

        for (var j = 0; j < buttonLength; j++) {
          var btn = {};
          btn["title"] = task[i].buttons[j].text;
          if ( task[i].buttons[j].url){
            btn['type'] = 'web_url';
            btn['url'] = task[i].buttons[j].url;
          }else {
            btn['type'] = 'postback';
            btn['payload'] = task[i].buttons[j].text;
          }
          buttons.push(btn);
        }
        elm['buttons'] = buttons;
      }
      elements.push(elm);
    }
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: elements,
            image_aspect_ratio: 'square'
          }
        }
      }
    };
    callSendAPI(messageData, token);

  }else {
    var imageUrl = "";
    var buttons = [];

    if(task.image){
      if (task.image.url.substring(0,4) !== 'http') imageUrl = config.host + task.image.url;
      else imageUrl = task.image.url;
    }

    if (task.buttons){
      var buttonLength;
      if (task.buttons.length > 3) buttonLength = 3;
      else buttonLength = task.buttons.length;

      for(var i = 0; i < buttonLength; i++){
        var btn = {
          title: task.buttons[i].text
        };

        if ( task.buttons[i].url){
          btn['type'] = 'web_url';
          btn['url'] = task.buttons[i].url;
        }else {
          btn['type'] = 'postback';
          btn['payload'] = task.buttons[i].text;
        }
        buttons.push(btn);
      }
    }

    if(true){
      var messageData1 = {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: "image",
            payload: {
              "url": imageUrl
            }
          }
        }
      };

      var messageData2 = {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text : text,
              buttons: buttons
            }
          }
        }
      };

      callSendAPI(messageData1, token, function () {
        callSendAPI(messageData2, token)
      });
    }else {
      var messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [{
                title: text,
                image_url: imageUrl,
                buttons: buttons
              }],
              image_aspect_ratio: 'square'
            }
          }
        }
      };
      callSendAPI(messageData, token);
    }
  }
}

/*
 * Send a receipt message using the Send API.
 *
 */
function sendReceiptMessage(recipientId, text, task, token) {
  // Generate a random receipt ID as the API requires a unique ID
  var receiptId = "order" + Math.floor(Math.random()*1000);

  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      attachment: {
        type: "template",
        payload: {
          template_type: "receipt",
          recipient_name: "Peter Chang",
          order_number: receiptId,
          currency: "USD",
          payment_method: "Visa 1234",
          timestamp: "1428444852",
          elements: [{
            title: "Oculus Rift",
            subtitle: "Includes: headset, sensor, remote",
            quantity: 1,
            price: 599.00,
            currency: "USD",
            image_url: "http://messengerdemo.parseapp.com/img/riftsq.png"
          }, {
            title: "Samsung Gear VR",
            subtitle: "Frost White",
            quantity: 1,
            price: 99.99,
            currency: "USD",
            image_url: "http://messengerdemo.parseapp.com/img/gearvrsq.png"
          }],
          address: {
            street_1: "1 Hacker Way",
            street_2: "",
            city: "Menlo Park",
            postal_code: "94025",
            state: "CA",
            country: "US"
          },
          summary: {
            subtotal: 698.99,
            shipping_cost: 20.00,
            total_tax: 57.67,
            total_cost: 626.66
          },
          adjustments: [{
            name: "New Customer Discount",
            amount: -50
          }, {
            name: "$100 Off Coupon",
            amount: -100
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a receipt message using the Send API.
 *
 */
function smartReplyMessage(recipientId, text, task, token) {
  for (var i = 0; i < task.smartReply.length; i++){
    task.smartReply[i] = {"title" : task.smartReply[i]};
    task.smartReply[i]['content_type'] = 'text';
    task.smartReply[i]['payload'] = task.smartReply[i].title;
  }
  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      "text": text,
      "quick_replies": task.smartReply
    }
  };

  callSendAPI(messageData, token);
}

function callSendAPI(messageData, PAGE_ACCESS_TOKEN, cb) {
  console.log(util.inspect(messageData, {showHidden: false, depth: null}));
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Successfully sent message");
      if(cb) cb();
    } else {
      console.log("Unable to send message.");
      console.log(JSON.stringify(response.body.error));
      console.log(error);
    }
  });
}


/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
      .update(buf)
      .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}
