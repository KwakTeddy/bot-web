// var net = require('net');
// var request = require('request');
// var path = require('path');
// var chat = require(path.resolve('engine2/bot/server/controllers/bot.server.controller'));
// var contextModule = require(path.resolve('engine2/bot/engine/common/context'));
// var config = require(path.resolve('config/config'));
// var async = require('async');
//
// var subscribe = '';
// var subscribePageToken = '';
// var mongoose = require('mongoose');
// var UserBotFbPage = mongoose.model('UserBotFbPage');
// var OverTextLink = mongoose.model('OverTextLink');
// var botLib = require(path.resolve('./engine2/bot.js'));
// var utils = require(path.resolve('engine2/bot/action/common/utils'));
// var crypto = require('crypto');
// var UserDialog = mongoose.model('UserDialog');
// var UserDialogLog = mongoose.model('UserDialogLog');
//
// var util =require('util'); //temporary
// var botContext = '';
// var bot = "";

var async = require('async');
var request = require('request');
var path = require('path');
var config = require(path.resolve('config/config'));

var mongoose = require('mongoose');
var UserBotFbPage = mongoose.model('UserBotFbPage');

(function()
{
    var Facebook = function()
    {
        //테스트용
        this.PAGE_ACCESS_TOKEN = 'EAAEQcB2wZC5MBAM74uGkfE97nqjZBh7JXa2B6RYJ6zx6SUTuJXp2Kanyfz87Bpt2dLWq3GcG2M1nGCyaj94XfLfDZCNQG26hJudPne2kjKUKLx0t6yj3XdH1KKGUheffAw507Qkjt4J58H5x0ZCnYEodQzkoZAXXrqEjwRXhK7AZDZD';

        this.pageInfos = {};
    };

    Facebook.prototype.get = function(req, res)
    {
        if(req.query['hub.verify_token'] === 'moneybrain_token')
        {
            res.status(200).send(req.query['hub.challenge']);
        }
        else
        {
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);
        }
    };

    Facebook.prototype.sendMessage = function(botId, accessToken, message, sender)
    {
        var Engine = require('../core.js');

        var that = this;
        if(message.text)
        {
            Engine.process(botId, 'facebook', sender.id, message.text, {}, function(context, out)
            {
                var output = out.output;
                var message = that.makeOutputMessage(output);

                request.post({ url: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + accessToken, json: { recipient: { id: sender.id }, message: message } }, function(err, response, body)
                {
                    console.log(body);
                });
            },
            function(err)
            {
                if(err == 'old-version')
                {
                    request.post({ url : 'https://old.playchat.ai/facebook/' + botId + '/webhook', json: data }, function(err, response, body)
                    {
                        console.log(body);
                    });
                }
                else
                {
                    console.log(err);
                }
            });
        }
    };

    Facebook.prototype.post = function(req, res)
    {
        var that = this;
        var data = req.body;
        
        if(data.object == 'page')
        {
            async.eachSeries(data.entry, function(entry, next)
            {
                var messaging = entry.messaging;
                async.eachSeries(messaging, function(event, next)
                {
                    var sender = event.sender;
                    var recipient = event.recipient;
                    var timestamp = event.timestamp;
                    var message = event.message;

                    console.log(sender);
                    console.log(recipient);
                    console.log(message);

                    that.getPageInfo(recipient.id, function(err, data)
                    {
                        if(!err)
                        {
                            that.pageInfos[recipient.id] = data;

                            that.sendMessage(data.userBotId, data.accessToken, message, sender);
                        }
                    });

                    next();
                },
                function()
                {
                    next();
                });
            },
            function()
            {
                res.status(200).end();
            });
        }
        else
        {
            res.status(200).end();
        }
    };

    Facebook.prototype.getPageInfo = function(senderId, callback)
    {
        UserBotFbPage.findOne({ pageId: senderId }).exec(function(err, data)
        {
            if(err)
            {
                callback(err);
            }
            else
            {
                callback(null, data);
            }
        });
    };

    Facebook.prototype.makeOutputMessage = function(output)
    {
        var message = {};
        var urlButtons = [];
        var quick_replies = [];
        if(output.buttons)
        {
            for(var i=0; i<output.buttons.length; i++)
            {
                if(output.buttons[i].url)
                {
                    urlButtons.push({ type: 'web_url', url: output.buttons[i].url, title: output.buttons[i].text });
                }
                else
                {
                    quick_replies.push({ content_type: 'text', title: output.buttons[i].text, payload: '' });
                }
            }
        }

        if(output.image)
        {
            output.image.url = output.image.url.startsWith('http') ? output.image.url : config.host + output.image.url;

            //무조건 템플릿으로 보내야함.
            var attachment =
            {
                type: 'template',
                payload:
                {
                    template_type: 'generic',
                    elements:
                    [
                        {
                            title: output.text,
                            image_url: output.image.url,
                            subtitle: '',
                            default_action:
                            {
                                type: 'web_url',
                                url: output.image.url
                            },
                        }
                    ]
                }
            };

            if(urlButtons.length > 0)
            {
                attachment.payload.elements[0].buttons = urlButtons;
            }

            message.attachment = attachment;
        }
        else if(urlButtons.length > 0)
        {
            var attachment =
            {
                type: 'template',
                payload:
                {
                    template_type: 'button',
                    text: output.text,
                    buttons: urlButtons
                }
            };

            message.attachment = attachment;
        }
        else
        {
            message.text = output.text;

            if(urlButtons.length > 0)
            {
                message.buttons = urlButtons;
            }
        }

        if(quick_replies.length > 0)
        {
            message.quick_replies = quick_replies;
        }

        return message;
    };

    module.exports = new Facebook();
})();
 
//
//
//exports.message = function (req, res)
//{
//     var data = req.body;
//    console.log(data);
//    if (data.object == 'page')
//     {      // Make sure this is a page subscription
//         data.entry.forEach(function(pageEntry)
//         {       // There may be multiple if batched
//             pageEntry.messaging.forEach(function(messagingEvent)
//             {          // Iterate over each messaging event
//                 messagingEvent.botId = req.params.bot;
//
//                 if (messagingEvent.message)
//                 {
//                     receivedMessage(messagingEvent);
//                 }
//                 else if (messagingEvent.postback)
//                 {
//                     receivedPostback(messagingEvent);
//                 }
//                 else if (messagingEvent.optin)
//                 {
//                     receivedAuthentication(messagingEvent);
//                 }
//                 else if (messagingEvent.delivery)
//                 {
//                     receivedDeliveryConfirmation(messagingEvent);
//                 }
//                 else
//                 {
//                     console.log("Webhook received unknown messagingEvent: ", messagingEvent);
//                 }
//           });
//       });
//
//       res.sendStatus(200); // You must send back a 200, within 20 seconds, to let us know you've
//     }
//     else
//     {
//         return false;
//     }
//};
//
// function liveChatAddDialog(botId, message , userId, inOut)
// {
//     var query = {
//         botId: botId,
//         userId : userId,
//         channel: "facebook",
//         dialog: message,
//         inOut: inOut,
//         fail: false,
//         liveChat: true
//     };
//
//     UserDialog.create(query, function(err, data)
//     {
//         if(err)
//         {
//             console.log(err);
//         }
//         else
//         {
//             var query =
//             {
//                 botId: botId,
//                 userId : userId,
//                 channel: "facebook",
//                 year: (new Date()).getYear() + 1900,
//                 month: (new Date()).getMonth() + 1,
//                 date: (new Date()).getDate()
//             };
//
//             UserDialogLog.update(query, query, {upsert: true}, function(err2, data2)
//             {
//                 if(err2)
//                 {
//                     console.log(err2);
//                 }
//                 else
//                 {
//                     return true
//                 }
//             });
//         }
//     });
// }
//
// function receivedMessage(event)
// {
//     var senderID = event.sender.id;
//     var recipientID = event.recipient.id;
//     var message = event.message;
//     var messageId = message.mid;
//     var messageText = message.text;
//     var messageAttachments = message.attachments;
//     var attachmentData = '';
//
//     if (messageAttachments)
//     {
//         attachmentData = JSON.parse(JSON.stringify(messageAttachments));
//
//         if (attachmentData[0].type == 'image')
//         {
//             attachmentData[0].type = 'photo';
//         }
//
//         if (attachmentData[0].type == 'fallback')
//         {
//             return true;
//         }
//
//         if (attachmentData[0].payload && attachmentData[0].payload.url)
//         {
//             message.url = attachmentData[0].payload.url;
//         }
//
//         message['inputType'] = attachmentData[0].type;
//         messageText = 'fbImage';
//     }
//
//     async.waterfall(
//     [
//         function (done)
//         {
//             if(message.is_echo)
//             {
//                 if(!message.metadata)
//                 {
//                     UserBotFbPage.findOne({pageId: senderID}, function (err, data)
//                     {
//                         if (err)
//                         {
//                             console.log(err);
//                         }
//                         else
//                         {
//                             liveChatAddDialog(data.userBotId, messageText, recipientID, false);
//                             contextModule.getContext(data.userBotId, 'facebook', recipientID, null, function(context)
//                             {
//                                 console.log(util.inspect(context.user));
//                                 context.user.liveChat = 3;
//                                 return done(true);
//                             });
//                         }
//                     });
//                 }
//                 else
//                 {
//                     return done(true);
//                 }
//             }
//             else
//             {
//                 return done(null);
//             }
//         },
//     function (done) {
//       if (event.botId == "subscribeBot" || !event.botId){
//         console.log('Subscribe Coming In');
//         UserBotFbPage.findOne({pageId: event.recipient.id}, function (err, data) {
//           if (err){
//             console.log(err);
//             return done(err);
//           }else {
//             if(recipientID != data.pageId) return true;
//             subscribe = true;
//             subscribePageToken = data.accessToken;
//             event.botId = data.userBotId;
//             return done(null);
//           }
//         });
//       }else {
//         if (recipientID != bot && bot.facebook && bot.facebook.id){
//          return done(true)
//         }
//         if (!global._bots[event.botId]){
//           botLib.loadBot(event.botId, function (realbot) {
//             return done(null);
//           });
//         }else {
//           return done(null);
//         }
//       }
//     },
//     function (done) {
//       chat.write('facebook', senderID, event.botId, messageText, message, function (retText, task) {
//         contextModule.getContext(event.botId, 'facebook', senderID, null, function(context) {
//           botContext = context;
//           bot = botContext.botUser.orgBot || botContext.bot;
//           switch(true) {
//           case botContext.user.liveChat == 1 :
//             botContext.user.liveChat++;
//             break;
//
//           case botContext.user.liveChat > 1 :
//             botContext.user.liveChat++;
//             // liveChatAddDialog(event.botId, messageText , senderID, true);
//             return true;
//           }
//           respondMessage(senderID, retText, event.botId, task);
//           return done(null);
//         });
//       });
//     }
//     ], function (err) {
//     if (err) {
//       return true;
//     }
//     });
// }
//
// /*
//  * Postback Event
//  */
// function receivedPostback(event) {
//   var senderID = event.sender.id;
//   var payload = event.postback.payload;
//   var recipientID = event.recipient.id;
//
//   if (event.botId == "subscribeBot"){
//     UserBotFbPage.findOne({pageId: event.recipient.id}, function (err, data) {
//       if (err){
//         console.log(err);
//       }else {
//         subscribe = true;
//         subscribePageToken = data.accessToken;
//         event.botId = data.userBotId;
//         contextModule.getContext(event.botId, 'facebook', senderID, null, function(context) {
//           botContext = context;
//           console.log("Received postback");
//           chat.write('facebook', senderID, event.botId, payload, null, function (retText, task) {
//             respondMessage(senderID, retText, event.botId, task);
//           });
//         });
//       }
//     });
//   }else {
//
//     if (!global._bots[event.botId]){
//       botLib.loadBot(event.botId, function (realbot) {
//         if(recipientID == global._bots[event.botId].facebook.id) {
//           contextModule.getContext(event.botId, 'facebook', senderID, null, function(context) {
//             botContext = context;
//             if(recipientID == bot.facebook.id) {
//               chat.write('facebook', senderID, event.botId, payload, null, function (retText, task) {
//                 respondMessage(senderID, retText, event.botId, task);
//               });
//             }
//           });
//         }
//       });
//     }else {
//       if(recipientID == global._bots[event.botId].facebook.id) {
//         contextModule.getContext(event.botId, 'facebook', senderID, null, function(context) {
//           botContext = context;
//           if(recipientID == bot.facebook.id) {
//             chat.write('facebook', senderID, event.botId, payload, null, function (retText, task) {
//               respondMessage(senderID, retText, event.botId, task);
//             });
//           }
//         });
//       }
//     }
//   }
// }
//
// /*
//  * Delivery Confirmation Event
//  */
// function receivedDeliveryConfirmation(event) {
//   var senderID = event.sender.id;
//   var recipientID = event.recipient.id;
//   var delivery = event.delivery;
//   var messageIDs = delivery.mids;
//   var watermark = delivery.watermark;
//   var sequenceNumber = delivery.seq;
//
//   if (messageIDs) {
//     messageIDs.forEach(function(messageID) {
//       // console.log("Received delivery confirmation for message ID: %s",
//       //   messageID);
//     });
//   }
//
//   // console.log("All message before %d were delivered.", watermark);
// }
//
//
// /*
//  * Authorization Event
//  */
// function receivedAuthentication(event) {
//   var senderID = event.sender.id;
//   var recipientID = event.recipient.id;
//   var timeOfAuth = event.timestamp;
//
//   // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
//   // The developer can set this to an arbitrary value to associate the
//   // authentication callback with the 'Send to Messenger' click event. This is
//   // a way to do account linking when the user clicks the 'Send to Messenger'
//   // plugin.
//   var passThroughParam = event.optin.ref;
//
//   console.log("Received authentication for user %d and page %d with pass " +
//     "through param '%s' at %d", senderID, recipientID, passThroughParam,
//     timeOfAuth);
//
//   // When an authentication is received, we'll send a message back to the sender
//   // to let them know it was successful.
//   sendTextMessage(senderID, "Authentication successful");
// }
//
//
// function respondMessage(to, text, botId, task) {
//   var tokenData = '';
//
//   if (subscribe) tokenData = subscribePageToken;
//   else tokenData = bot.facebook.PAGE_ACCESS_TOKEN;
//
//   if(bot && bot.commonButtons && bot.commonButtons.length && botContext.botUser._currentDialog.name && (botContext.botUser._currentDialog.name != botContext.bot.startDialog.name)){
//     if(task && task.buttons) task.buttons =  task.buttons.slice(0, task.buttons.length - bot.commonButtons.length);
//     else if(task && task.result && task.result.buttons) task.result.buttons =  task.result.buttons.slice(0, task.buttons.length - bot.commonButtons.length);
//   }
//
//   if (task && task.result) {
//     var result = task.result;
//
//     switch (Object.keys(result).toString()) {
//       case 'image':
//         sendGenericMessage(to, text, result, tokenData);
//         break;
//
//       case 'image,buttons':
//         sendGenericMessage(to, text, result, tokenData);
//         break;
//       case 'buttons':
//         if(config.enterprise.name){
//           smartReplyMessage(to, text, result, tokenData);
//         }else {
//           sendButtonMessage(to, text, result, tokenData);
//         }
//         break;
//
//       case 'items':
//         sendGenericMessage(to, text, result, tokenData);
//         break;
//
//       case 'receipt':
//         sendReceiptMessage(to);
//         break;
//
//       case 'smartReply':
//         smartReplyMessage(to, text, result, tokenData);
//         break;
//
//       default:
//         sendTextMessage(to, text, result, tokenData);
//     }
//   }else {
//     if(text){
//       if (task && task.hasOwnProperty('image')){
//         if (task.hasOwnProperty('buttons')){
//           //text && image && buttons
//           sendGenericMessage(to, text, task, tokenData);
//
//         }else {
//           //text && image
//           sendGenericMessage(to, text, task, tokenData);
//
//         }
//       }else {
//         if (task && task.hasOwnProperty('buttons')){
//           //text && buttons
//           if(config.enterprise.name){
//             smartReplyMessage(to, text, task, tokenData);
//           }else {
//             sendButtonMessage(to, text, task, tokenData);
//           }
//         }else {
//           //text
//           sendTextMessage(to, text, task, tokenData);
//         }
//       }
//     }else {
//       if (task && task.hasOwnProperty('image')){
//         if (task && task.hasOwnProperty('buttons')){
//           //image && buttons _ error
//           console.log('only image and buttons. No TEXT!')
//         }else {
//           //image
//           sendImageMessage(to, text, task, tokenData);
//
//         }
//       }else {
//         //only button or nothing _ error
//         console.log('only button or nothing!')
//       }
//     }
//   }
// }
// exports.respondMessage = respondMessage;
//
//
// /*
//  * Send a text message using the Send API.
//  *
//  */
// function sendTextMessage(recipientId, text, task, token) {
//   if(text.length > 640){
//     var subtext = text.substring(0, 639);
//     var buttons = [{
//       "type":"web_url",
//       "url": config.host + '/facebookOvertext/',
//       "title":"전문 보기"
//     }];
//     var messageData = {
//       recipient: {
//         id: recipientId
//       },
//       message: {
//         attachment: {
//           type: "template",
//           payload: {
//             template_type: "button",
//             text: subtext,
//             buttons: buttons
//           }
//         }
//       }
//     };
//     crypto.randomBytes(20, function (err, buffer) {
//       var index = buffer.toString('hex');
//       buttons[0].url = buttons[0].url + index;
//       var overTextLink = new OverTextLink();
//       overTextLink['text'] = text;
//       overTextLink['index'] = index;
//       overTextLink.save(function (err) {
//         if(err){
//           console.log(err)
//         }else {
//           callSendAPI(messageData, token);
//         }
//       })
//     });
//   }else {
//     var messageData = {
//       recipient: {
//         id: recipientId
//       },
//       message: {
//         text: text
//       }
//     };
//     callSendAPI(messageData, token);
//   }
// }
//
//
// /*
//  * Send a message with an using the Send API.
//  *
//  */
// function sendImageMessage(recipientId, text, task, token) {
//   if(task.image){
//     if (task.image.url.substring(0,4) !== 'http'){
//       task.image.url = config.host + task.image.url
//     }
//   }
//
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       attachment: {
//         type: "image",
//         payload: {
//           url: task.image.url
//         }
//       }
//     }
//   };
//   callSendAPI(messageData, token);
// }
//
// /*
//  * Send a button message using the Send API.
//  *
//  */
// function sendButtonMessage(recipientId, text, task, token) {
//   var bot = botContext.botUser.orgBot || botContext.bot;
//   var buttons = [];
//
//   if(task.buttons.length > 3){
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       text: text
//     }
//   };
//
//   callSendAPI(messageData, token);
//
//   }else {
//     for(var i = 0; i < task.buttons.length; i++){
//       var btn = {};
//       btn['title'] = task.buttons[i].text;
//       if (task.buttons[i].url){
//         btn['type'] = 'web_url';
//
//       }else {
//         btn['type'] = 'postback';
//         btn['payload'] = task.buttons[i].text
//       }
//       buttons.push(btn)
//     }
//
//     var messageData = {
//       recipient: {
//         id: recipientId
//       },
//       message: {
//         attachment: {
//           type: "template",
//           payload: {
//             template_type: "button",
//             text: text,
//             buttons: buttons
//           }
//         }
//       }
//     };
//     callSendAPI(messageData, token);
//   }
// }
//
// /*
//  * Send a Structured Message (Generic Message type) using the Send API.
//  *
//  */
// function sendGenericMessage(recipientId, text, task, token) {
//   if (task.items){
//     task = task.items;
//     var elements = [];
//     var elementsLength;
//     if (task.length > 10) elementsLength = 10;
//     else elementsLength = task.length;
//
//     for(var i =0; i < elementsLength; i++){
//       var elm = {}
//       if (task[i].text){
//         elm['title'] = task[i].title;
//         elm['subtitle'] = task[i].text;
//       }
//       if (task[i].imageUrl) {
//         if (task[i].imageUrl.substring(0,4) !== 'http'){
//           task[i].imageUrl = config.host + task[i].imageUrl
//         }
//         elm['image_url'] = task[i].imageUrl
//       }
//       if (task[i].buttons) {
//         var buttons = [];
//         var buttonLength;
//
//         if (task[i].buttons.length > 3) buttonLength = 3;
//         else buttonLength = task[i].buttons.length;
//
//         for (var j = 0; j < buttonLength; j++) {
//           var btn = {};
//           btn["title"] = task[i].buttons[j].text;
//           if ( task[i].buttons[j].url){
//             btn['type'] = 'web_url';
//             btn['url'] = task[i].buttons[j].url;
//           }else {
//             btn['type'] = 'postback';
//             btn['payload'] = task[i].buttons[j].text;
//           }
//           buttons.push(btn);
//         }
//         elm['buttons'] = buttons;
//       }
//       elements.push(elm);
//     }
//     var messageData = {
//       recipient: {
//         id: recipientId
//       },
//       message: {
//         attachment: {
//           type: "template",
//           payload: {
//             template_type: "generic",
//             elements: elements,
//             image_aspect_ratio: 'square'
//           }
//         }
//       }
//     };
//     callSendAPI(messageData, token);
//
//   }else {
//     var imageUrl = "";
//     var buttons = [];
//
//     if(task.image){
//       if (task.image.url.substring(0,4) !== 'http') imageUrl = config.host + task.image.url;
//       else imageUrl = task.image.url;
//     }
//
//     if (task.buttons){
//       var buttonLength;
//       if (task.buttons.length > 3) buttonLength = 3;
//       else buttonLength = task.buttons.length;
//
//       for(var i = 0; i < buttonLength; i++){
//         var btn = {
//           title: task.buttons[i].text
//         };
//
//         if ( task.buttons[i].url){
//           btn['type'] = 'web_url';
//           btn['url'] = task.buttons[i].url;
//         }else {
//           btn['type'] = 'postback';
//           btn['payload'] = task.buttons[i].text;
//         }
//         buttons.push(btn);
//       }
//     }
//
//     if(true){
//       var messageData1 = {
//         recipient: {
//           id: recipientId
//         },
//         message: {
//           attachment: {
//             type: "image",
//             payload: {
//               "url": imageUrl
//             }
//           }
//         }
//       };
//
//       var messageData2 = {
//         recipient: {
//           id: recipientId
//         },
//         message: {
//           attachment: {
//             type: "template",
//             payload: {
//               template_type: "button",
//               text : text,
//               buttons: buttons
//             }
//           }
//         }
//       };
//
//       callSendAPI(messageData1, token, function () {
//         callSendAPI(messageData2, token)
//       });
//     }else {
//       var messageData = {
//         recipient: {
//           id: recipientId
//         },
//         message: {
//           attachment: {
//             type: "template",
//             payload: {
//               template_type: "generic",
//               elements: [{
//                 title: text,
//                 image_url: imageUrl,
//                 buttons: buttons
//               }],
//               image_aspect_ratio: 'square'
//             }
//           }
//         }
//       };
//       callSendAPI(messageData, token);
//     }
//   }
// }
//
// /*
//  * Send a list message using the Send API.
//  *
//  */
// function listMessage(recipientId, text, task, token) {
//
//   var elements = [];
//   for(var i = 0; i < task.buttons.length; i++){
//     var elm = {};
//     elm['title']
//   }
//
//   var messageData = {
//     "recipient":{
//       "id": recipientId
//     }, "message": {
//       "attachment": {
//         "type": "template",
//         "payload": {
//           "template_type": "list",
//           "elements": [
//             {
//               "title": "Classic T-Shirt Collection",
//               "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",
//               "subtitle": "See all our colors",
//               "default_action": {
//                 "type": "web_url",
//                 "url": "https://peterssendreceiveapp.ngrok.io/shop_collection",
//                 "messenger_extensions": true,
//                 "webview_height_ratio": "tall",
//                 "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
//               },
//               "buttons": [
//                 {
//                   "title": "View",
//                   "type": "web_url",
//                   "url": "https://peterssendreceiveapp.ngrok.io/collection",
//                   "messenger_extensions": true,
//                   "webview_height_ratio": "tall",
//                   "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
//                 }
//               ]
//             },
//             {
//               "title": "Classic White T-Shirt",
//               "image_url": "https://peterssendreceiveapp.ngrok.io/img/white-t-shirt.png",
//               "subtitle": "100% Cotton, 200% Comfortable",
//               "default_action": {
//                 "type": "web_url",
//                 "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
//                 "messenger_extensions": true,
//                 "webview_height_ratio": "tall",
//                 "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
//               },
//               "buttons": [
//                 {
//                   "title": "Shop Now",
//                   "type": "web_url",
//                   "url": "https://peterssendreceiveapp.ngrok.io/shop?item=100",
//                   "messenger_extensions": true,
//                   "webview_height_ratio": "tall",
//                   "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
//                 }
//               ]
//             },
//             {
//               "title": "Classic Blue T-Shirt",
//               "image_url": "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
//               "subtitle": "100% Cotton, 200% Comfortable",
//               "default_action": {
//                 "type": "web_url",
//                 "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
//                 "messenger_extensions": true,
//                 "webview_height_ratio": "tall",
//                 "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
//               },
//               "buttons": [
//                 {
//                   "title": "Shop Now",
//                   "type": "web_url",
//                   "url": "https://peterssendreceiveapp.ngrok.io/shop?item=101",
//                   "messenger_extensions": true,
//                   "webview_height_ratio": "tall",
//                   "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
//                 }
//               ]
//             },
//             {
//               "title": "Classic Black T-Shirt",
//               "image_url": "https://peterssendreceiveapp.ngrok.io/img/black-t-shirt.png",
//               "subtitle": "100% Cotton, 200% Comfortable",
//               "default_action": {
//                 "type": "web_url",
//                 "url": "https://peterssendreceiveapp.ngrok.io/view?item=102",
//                 "messenger_extensions": true,
//                 "webview_height_ratio": "tall",
//                 "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
//               },
//               "buttons": [
//                 {
//                   "title": "Shop Now",
//                   "type": "web_url",
//                   "url": "https://peterssendreceiveapp.ngrok.io/shop?item=102",
//                   "messenger_extensions": true,
//                   "webview_height_ratio": "tall",
//                   "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
//                 }
//               ]
//             }
//           ],
//           "buttons": [
//             {
//               "title": "View More",
//               "type": "postback",
//               "payload": "payload"
//             }
//           ]
//         }
//       }
//     }
//
//   };
//   callSendAPI(messageData, token);
// }
//
//
// /*
//  * Send a receipt message using the Send API.
//  *
//  */
// function sendReceiptMessage(recipientId, text, task, token) {
//   // Generate a random receipt ID as the API requires a unique ID
//   var receiptId = "order" + Math.floor(Math.random()*1000);
//
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message:{
//       attachment: {
//         type: "template",
//         payload: {
//           template_type: "receipt",
//           recipient_name: "Peter Chang",
//           order_number: receiptId,
//           currency: "USD",
//           payment_method: "Visa 1234",
//           timestamp: "1428444852",
//           elements: [{
//             title: "Oculus Rift",
//             subtitle: "Includes: headset, sensor, remote",
//             quantity: 1,
//             price: 599.00,
//             currency: "USD",
//             image_url: "http://messengerdemo.parseapp.com/img/riftsq.png"
//           }, {
//             title: "Samsung Gear VR",
//             subtitle: "Frost White",
//             quantity: 1,
//             price: 99.99,
//             currency: "USD",
//             image_url: "http://messengerdemo.parseapp.com/img/gearvrsq.png"
//           }],
//           address: {
//             street_1: "1 Hacker Way",
//             street_2: "",
//             city: "Menlo Park",
//             postal_code: "94025",
//             state: "CA",
//             country: "US"
//           },
//           summary: {
//             subtotal: 698.99,
//             shipping_cost: 20.00,
//             total_tax: 57.67,
//             total_cost: 626.66
//           },
//           adjustments: [{
//             name: "New Customer Discount",
//             amount: -50
//           }, {
//             name: "$100 Off Coupon",
//             amount: -100
//           }]
//         }
//       }
//     }
//   };
//
//   callSendAPI(messageData);
// }
//
// /*
//  * Send a receipt message using the Send API.
//  *
//  */
// function smartReplyMessage(recipientId, text, task, token) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message:{
//       "text": text,
//       "quick_replies": ''
//     }
//   };
//   if(task.smartReply && task.smartReply.length){
//     for (var i = 0; i < task.smartReply.length; i++){
//       task.smartReply[i] = {"title" : task.smartReply[i]};
//       task.smartReply[i]['content_type'] = 'text';
//       task.smartReply[i]['payload'] = task.smartReply[i].title;
//     }
//     messageData.message.quick_replies = task.smartReply;
//   }
//
//   if(task.buttons){
//     var smartReplies = [];
//     for(var i = 0; i < task.buttons.length; i++){
//       var repl = {content_type:"text"};
//       repl['title'] = i+1;
//       repl['payload'] = i+1;
//       smartReplies.push(repl);
//     }
//     messageData.message.quick_replies = smartReplies;
//   }
//   callSendAPI(messageData, token);
// }
//
// function callSendAPI(messageData, PAGE_ACCESS_TOKEN, cb) {
//   if(messageData.message) messageData.message['metadata'] = "sentByChatBot";
//
//   if(bot && bot.commonQuickReplies && bot.commonQuickReplies.length
//     && botContext.botUser._currentDialog.name && !botContext.user.liveChat
//     && (botContext.botUser._currentDialog.name != botContext.bot.startDialog.name)
//     && (botContext.botUser._currentDialog.name != botContext.bot.noDialog.name)){
//     var quick_replies = [];
//     if(!messageData.message['quick_replies']) messageData.message['quick_replies']= [];
//
//     bot.commonQuickReplies.forEach(function (b) {
//       var btn = {content_type: "text"};
//       btn['title'] = b.text;
//       btn['payload'] = b.text;
//       messageData.message.quick_replies.push(btn);
//     });
//   }
//
//   if(bot && bot.commonQuickReplies && bot.commonQuickReplies.length
//     && botContext.botUser._currentDialog.name
//     && (botContext.botUser._currentDialog.name == botContext.bot.noDialog.name)){
//     messageData.message['quick_replies'] = [{content_type: "text", title: "시작메뉴", payload: "시작메뉴"}]
//   }
//   request({
//     uri: 'https://graph.facebook.com/v2.6/me/messages',
//     qs: { access_token: PAGE_ACCESS_TOKEN },
//     method: 'POST',
//     json: messageData
//
//   }, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       console.log("Successfully sent message");
//       if(cb) cb();
//     } else {
//         console.log("Unable to send message.");
//         console.log(JSON.stringify(response.body.error));
//         console.log(error);
//     }
//   });
// }
//
// module.exports.refresh = function(req, res)
// {
//
// };
//
//
// /*
//  * Verify that the callback came from Facebook. Using the App Secret from
//  * the App Dashboard, we can verify the signature that is sent with each
//  * callback in the x-hub-signature field, located in the header.
//  *
//  * https://developers.facebook.com/docs/graph-api/webhooks#setup
//  *
//  */
// function verifyRequestSignature(req, res, buf) {
//   var signature = req.headers["x-hub-signature"];
//
//   if (!signature) {
//     // For testing, let's log an error. In production, you should throw an
//     // error.
//     console.error("Couldn't validate the signature.");
//   } else {
//     var elements = signature.split('=');
//     var method = elements[0];
//     var signatureHash = elements[1];
//
//     var expectedHash = crypto.createHmac('sha1', APP_SECRET)
//       .update(buf)
//       .digest('hex');
//
//     if (signatureHash != expectedHash) {
//       throw new Error("Couldn't validate the request signature.");
//     }
//   }
// }
