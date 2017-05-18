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


var util =require('util'); //temporary

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
  console.log(req.params[req.params.bot]);
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
  contextModule.getContext(botId, 'facebook', to, null, function(context) {
    var bot = context.botUser.orgBot || context.bot;

    if (subscribe){
        tokenData = subscribePageToken;
    }else {
        tokenData = bot.facebook.PAGE_ACCESS_TOKEN;
    }

    console.log(util.inspect(task, {showHidden: false, depth: null}))
    console.log('999999999998989812398129839128398');
    console.log(to);

    if (task && task.result) {
      // If we receive a text message, check to see if it matches any special
      // keywords and send back the corresponding example. Otherwise, just echo
      // the text we received.
      console.log(util.inspect(task), {showHidden: false, depth: null})
      console.log(util.inspect(Object.keys(task.result).toString(), {showHidden: false, depth: null}))
      switch (Object.keys(task.result).toString()) {
        case 'image':
          sendGenericMessage(to, text, task.result, tokenData);
          break;

        case 'image,buttons':
          sendGenericMessage(to, text, task.result, tokenData);
          break;
        case 'buttons':
          sendButtonMessage(to, text, task.result, tokenData);
          break;

        case 'items':
          sendGenericMessage(to, text, task.result, tokenData);
          break;

        case 'receipt':
          sendReceiptMessage(to);
          break;

        case 'smartReply':
          smartReplyMessage(to, text, task.result, tokenData);
          break;

        default:
          sendTextMessage(to, text, task.result, tokenData);
      }
    }else {
      console.log('taks' + util.inspect(task), {showHidden: false, depth: null})
      console.log('taks' + util.inspect(text), {showHidden: false, depth: null})
      if (task){
        delete task.inNLP;
        delete task.inRaw;
        if(task.output){
          delete task.output
        }
      }
      if(text){
        if (task.hasOwnProperty('image')){
          if (task.hasOwnProperty('buttons')){
            //text && image && buttons
            sendGenericMessage(to, text, task, tokenData);

          }else {
            //text && image
            sendGenericMessage(to, text, task, tokenData);

          }
        }else {
          if (task.hasOwnProperty('buttons')){
            //text && buttons
            sendButtonMessage(to, text, task, tokenData);

          }else {
            //text
            sendTextMessage(to, text, task, tokenData);
          }
        }
      }else {
        if (task.hasOwnProperty('image')){
          if (task.hasOwnProperty('buttons')){
            //image && buttons
            sendGenericMessage(to, text, task, tokenData);

          }else {
            //image
            sendImageMessage(to, text, task, tokenData);

          }
        }else {
          if (task.hasOwnProperty('buttons')){
            //buttons this is error

          }else {
            //nothing
            sendTextMessage(to, text, task, tokenData);

          }
        }
      }
    }
  });
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
  console.log('--------------------------------------------------------------------------')
  console.log(event.botId)
  if (event.botId == "subscribeBot"){
    console.log('Subscribe Coming In');
    console.log()
      UserBotFbPage.findOne({pageId: event.recipient.id}, function (err, data) {
          if (err){
              console.log(err);
          }else {
            console.log('here is data');
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
                    console.log(util.inspect(messageText, {showHidden: false, depth: null}))
                    if (messageAttachments){
                        console.log(util.inspect(messageAttachments, {showHidden: false, depth: null}))
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
                        console.log('this is write');
                        console.log(util.inspect(retText, {showHidden: false, depth: null}));
                        console.log(util.inspect(task, {showHidden: false, depth: null}));
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
  if(task.image){
    if (task.image.url.substring(0,4) !== 'http'){
      task.image.url = 'https://shinhan.moneybrain.ai' + task.image.url
      // task.image.url = config.host + task.image.url
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
  console.log('-----------------------=--------------------------------------------------')
  console.log('imageMessage: ' + util.inspect(messageData), {showHidden: false, depth: null});
  console.log('imageMessage: ' + util.inspect(messageData.message.attachment.payload), {showHidden: false, depth: null});

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
  for(var i = 0; i < task.buttons.length; i++){
    task.buttons[i].title = task.buttons[i].text;
    delete task.buttons[i].text;
    task.buttons[i]['type'] = 'postback';
    task.buttons[i]['payload'] = {text: 'thehwlll'};
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
          buttons: task.buttons
        }
      }
    }
  };
  console.log(util.inspect(messageData, {showHidden: false, depth: null}));
  console.log(util.inspect(messageData.message.payload, {showHidden: false, depth: null}));

  callSendAPI(messageData, token);
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function sendGenericMessage(recipientId, text, task, token) {
  console.log('sendGenericMessage----------------------------------')
  if (task.items){
    task = task.items;
    for(var i =0; i < task.length; i++){
      if (task[i].text){
        task[i].subtitle = task[i].text;
        delete task[i].text;
      }
      if (task[i].imageUrl) {
        if (task[i].imageUrl.substring(0,4) !== 'http'){
          task[i].imageUrl = config.host + task[i].imageUrl
        }
        task[i].image_url = task[i].imageUrl;
        delete task[i].imageUrl;
      }
      if (task[i].buttons) {
        for (var j = 0; j < task[i].buttons.length; j++) {
          task[i].buttons[j].title = task[i].buttons[j].text;
          delete task[i].buttons[j].text;
          task[i].buttons[j]['type'] = 'web_url';
        }
      }
    }
    task.splice(10);
  }else {
    if (task.buttons){
      for(var i = 0; i < task.buttons.length; i++){
        task.buttons[i].title = task.buttons[i].text;
        delete task.buttons[i].text;
        task.buttons[i]['type'] = 'web_url';
        task['title'] = text;
      }
    }
    if(task.image){
      if (task.image.url.substring(0,4) !== 'http'){
        task.image.url = config.host + task.image.url
      }
      task.image_url = task.image.url;
      delete task.image;
      task['title'] = text;
    }
    task = [task];
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
          template_type: "generic",
          elements: task
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

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData, PAGE_ACCESS_TOKEN) {
  console.log(PAGE_ACCESS_TOKEN);
  console.log(util.inspect(messageData));
  // console.log('callSendAPI: ', messageData);
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    // qs: { access_token: PAGE_ACCESS_TOKEN || 'EAAWvTpdxqVYBAErPqmZBKy3PwB5nyWkZCXT4h6HfDNZC8u5ZAlYMZCMXrPErG7Qzeac6gLGNzGUpb3opKVCeHxPe4xkcn2zl1SGVb4Rh9ZCbnseRcbAXCZBoy6dRNhir1pD9HODdxM1N0eItAGl2CR5JVZBXnV5SOOZCvhKKw2SUM5wZDZD' },
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
