var net = require('net');
var request = require('request');
var path = require('path');
var chat = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
var contextModule = require(path.resolve('modules/bot/engine/common/context'));

var subscribe = '';
var subscribePageToken = '';
var mongoose = require('mongoose');
var UserBotFbPage = mongoose.model('UserBotFbPage');
var botLib = require(path.resolve('config/lib/bot'));


var util =require('util'); //temporary

// var APP_SECRET =  "174b2a851e3811c3f2c267d46708d212";
// var PAGE_ACCESS_TOKEN =  "EAAYwPrsj1ZA0BAORAoGhxvLLs5eRZADJ8BheTdjOXu8lT0X2tVFwZAZCEJiWFenFHCVqSuctfONET6dhbPDBnlivq5sXEvBABTnRlYpX8hLxZAnO2lywRiA6sVlbYAvG1n1EpQwkVhZAdrmq1p9PlQRUu327O1ohcZBwVLYZCn3beQZDZD";
// var VALIDATION_TOKEN = "my_voice_is_my_password_verify_me";

// var APP_SECRET =  "eb2974959255583150013648e7ac5da4";
// var PAGE_ACCESS_TOKEN =  "EAAJGZBCFjFukBAE63miCdcKFwqTEmbbhSbm6jIr6ws5I7fKnWSMUqIzGfHZBDTqmW0wra5xZBZCLWg2O9miPcc6WdVQRyfHdDCYuhLjIbng0njUHqOdbasHcSZAs2WEO7zG72wgmciNsF138QCq1vLnzMHR3XYIP0VnV1iZBsZAngZDZD";
// var VALIDATION_TOKEN = "moneybrain_token";


exports.messageGet =  function(req, res) {
  contextModule.getContext(req.params.bot, 'facebook', null, null, function(context) {
      // console.log(req.query['hub.mode'] + ', ' + req.query['hub.verify_token'] + ',' + context.bot.facebook.VALIDATION_TOKEN );
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
  // Make sure this is a page subscription
  if (data.object == 'page') {
      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach(function(pageEntry) {
          var pageID = pageEntry.id;
          var timeOfEvent = pageEntry.time;

          // Iterate over each messaging event
          pageEntry.messaging.forEach(function(messagingEvent) {
              messagingEvent.botId = req.params.bot;

              if (messagingEvent.optin) {
                  receivedAuthentication(messagingEvent);
              } else if (messagingEvent.message) {
                  receivedMessage(messagingEvent);
              } else if (messagingEvent.delivery) {
                  receivedDeliveryConfirmation(messagingEvent);
              } else if (messagingEvent.postback) {
                  receivedPostback(messagingEvent);
              } else {
                  // console.log("Webhook received unknown messagingEvent: ", messagingEvent);
              }
          });
      });

      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know you've
      // successfully received the callback. Otherwise, the request will time out.
      res.sendStatus(200);
  }
};

exports.respondMessage = respondMessage;
function respondMessage(to, text, botId, task) {
  var tokenData = '';
  var messageData = {
    recipient: {
      id: to
    },
    message: {
      text: text
    }
  };
  contextModule.getContext(botId, 'facebook', to, null, function(context) {
    var bot = context.botUser.orgBot || context.bot;

    if (subscribe){
        // callSendAPI(messageData, subscribePageToken);
        tokenData = subscribePageToken;
    }else {
        // callSendAPI(messageData, bot.facebook.PAGE_ACCESS_TOKEN);
        tokenData = bot.facebook.PAGE_ACCESS_TOKEN;
    }

    if (task && task.result) {
      // If we receive a text message, check to see if it matches any special
      // keywords and send back the corresponding example. Otherwise, just echo
      // the text we received.
      switch (Object.keys(task.result).toString()) {
        case 'image':
          sendGenericMessage(to, text, task, tokenData);
          break;

        case 'buttons':
          sendButtonMessage(to, text, task, tokenData);
          break;

        case 'items':
          sendGenericMessage(to, text, task, tokenData);
          break;

        case 'receipt':
          sendReceiptMessage(to);
          break;

        default:
          sendTextMessage(to, text);
      }
    }
    // else if (messageAttachments) {
    //   sendTextMessage(to, "Message with attachment received");
    // }
    else {
      sendTextMessage(to, text, task, tokenData);
      // sendTextMessage(to, "서버가 연결되어 있지 않습니다.");
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

/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to
 * Messenger" plugin, it is the 'data-ref' field. Read more at
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference#auth
 *
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


/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference#received_message
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  if (event.botId == "subscribeBot"){
    console.log('Subscribe Coming In');
      UserBotFbPage.findOne({pageId: event.recipient.id}, function (err, data) {
          if (err){
              console.log(err);
          }else {
            console.log(JSON.stringify(data));
              subscribe = true;
              subscribePageToken = data.accessToken;
              event.botId = data.userBotId;
              contextModule.getContext(event.botId, 'facebook', senderID, null, function(context) {
                  //console.log('receivedMessage: ', event);

                  var bot = context.botUser.orgBot || context.bot;
                  if(recipientID == data.pageId) {
                      console.log('2 senderID: ' + senderID + ', recipientID: ' + recipientID);

                      var messageId = message.mid;
                      var messageText = message.text;
                      var messageAttachments = message.attachments;

                      chat.write('facebook', senderID, event.botId, messageText, message, function (retText, task) {
                          console.log('this is write');
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

              var bot = context.botUser.orgBot || context.bot;
              if(recipientID == bot.facebook.id) {
                console.log('2 senderID: ' + senderID + ', recipientID: ' + recipientID);

                var messageId = message.mid;
                var messageText = message.text;
                var messageAttachments = message.attachments;

                chat.write('facebook', senderID, event.botId, messageText, message, function (retText, task) {
                  console.log('this is write')
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

            var bot = context.botUser.orgBot || context.bot;
            if(recipientID == bot.facebook.id) {
              console.log('2 senderID: ' + senderID + ', recipientID: ' + recipientID);

              var messageId = message.mid;
              var messageText = message.text;
              var messageAttachments = message.attachments;

              chat.write('facebook', senderID, event.botId, messageText, message, function (retText, task) {
                console.log('this is write')
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
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference#message_delivery
 *
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
 * Postback Event
 *`
 * This event is called when a postback is tapped on a Structured Message. Read
 * more at https://developers.facebook.com/docs/messenger-platform/webhook-reference#postback
 *
 */
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  sendTextMessage(senderID, "Postback called");
}


/*
 * Send a message with an using the Send API.
 *
 */
function sendImageMessage(recipientId, text, task, token) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          title: text,
          url: task.result.image.url
        }
      }
    }
  };

  callSendAPI(messageData, token);
}

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
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId, text, task, token) {
  for(var i = 0; i < task.result.buttons.length; i++){
    task.result.buttons[i].title = task.result.buttons[i].text;
    delete task.result.buttons[i].text;
    task.result.buttons[i]['type'] = 'web_url';
  }
  console.log(util.inspect(task, {showHidden: false, depth: null}));

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
          buttons: task.result.buttons
        }
      }
    }
  };
  callSendAPI(messageData, token);
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function sendGenericMessage(recipientId, text, task, token) {
  if (task.result.items){
    task.result = task.result.items;
    for(var i =0; i < task.result.length; i++){
      if (task.result[i].text){
        task.result[i].subtitle = task.result[i].text;
        delete task.result[i].text;
      }
      if (task.result[i].imageUrl) {
        task.result[i].image_url = task.result[i].imageUrl;
        delete task.result[i].imageUrl;
      }
      if (task.result[i].buttons) {
        for (var j = 0; j < task.result[i].buttons.length; j++) {
          task.result[i].buttons[j].title = task.result[i].buttons[j].text;
          delete task.result[i].buttons[j].text;
          task.result[i].buttons[j]['type'] = 'web_url';
        }
      }
    }
    task.result.splice(10);
  }else {
    if (task.result.buttons){
      for(var i = 0; i < task.result.buttons.length; i++){
        task.result.buttons[i].title = task.result.buttons[i].text;
        delete task.result.buttons[i].text;
        task.result.buttons[i]['type'] = 'web_url';
        task.result['title'] = text;
      }
    }
    if(task.result.image){
      task.result.image_url = task.result.image;
      delete task.result.image;
      task.result.image_url = task.result.image_url.url;
      task.result['title'] = text;
    }
    task.result = [task.result];
  }
  console.log(util.inspect(task.result, {showHidden: false, depth: null}));
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: task.result
          // elements: [{
          //   title: "rift",
          //   subtitle: "Next-generation virtual reality",
          //   item_url: "https://www.oculus.com/en-us/rift/",
          //   image_url: "http://messengerdemo.parseapp.com/img/rift.png",
          //   buttons: [{
          //     type: "web_url",
          //     url: "https://www.oculus.com/en-us/rift/",
          //     title: "Open Web URL"
          //   }, {
          //     type: "postback",
          //     title: "Call Postback",
          //     payload: "Payload for first bubble",
          //   }],
          // }, {
          //   title: "touch",
          //   subtitle: "Your Hands, Now in VR",
          //   item_url: "https://www.oculus.com/en-us/touch/",
          //   image_url: "http://messengerdemo.parseapp.com/img/touch.png",
          //   buttons: [{
          //     type: "web_url",
          //     url: "https://www.oculus.com/en-us/touch/",
          //     title: "Open Web URL"
          //   }, {
          //     type: "postback",
          //     title: "Call Postback",
          //     payload: "Payload for second bubble",
          //   }]
          // }]
        }
      }
    }
  };

  callSendAPI(messageData, token);
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
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData, PAGE_ACCESS_TOKEN) {
  console.log(PAGE_ACCESS_TOKEN);
  // console.log('callSendAPI: ', messageData);
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.log("Unable to send message.");
      console.log(JSON.stringify(response.body.error));
      console.log(error);

    }
  });
}
