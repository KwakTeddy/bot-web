var mongoose = require('mongoose');
var UserBotFbPage = mongoose.model('UserBotFbPage');

exports.facebookPage = function (req, res) {
    if (!req.body.list){ //change the information about facebook page connected
        UserBotFbPage.findOne({pageId : req.body.page.id}, function (err, data) {
            if(err){
                console.log(err);
            }else {
                if (data){
                    data.accessToken = req.body.page.access_token;
                    data.bot = req.body.userBot;
                    data.userBotId = req.body.userBotId;
                    data.connect = req.body.connect;
                    data.user = req.user._id;
                    data.save(function (err) {
                        if (err){
                            console.log(err);
                        }else {
                            return res.json(data);
                        }
                    })
                }else {
                    var info = {};
                    info['picture'] = req.body.page.picture.data.url;
                    info['name'] = req.body.page.name;
                    info['link'] = req.body.page.link;
                    info['accessToken'] = req.body.page.access_token;
                    info['pageId'] = req.body.page.id;
                    info['user'] = req.body.user;
                    info['bot'] = req.body.userBot;
                    info['userBotId'] = req.body.userBotId;
                    info['connect'] = req.body.connect;
                    var userBotFbPage = new UserBotFbPage(info);
                    userBotFbPage.save(function (err) {
                        if (err){
                            console.log(err);
                        }else {
                            return res.json(data);
                        }
                    })

                }
            }

        })
    }else { //get facebook pages connected
        var pageIds = [];
        for(var i = 0; i < req.body.pageInfo.length; i++){
            pageIds.push(req.body.pageInfo[i].id)
        }
        UserBotFbPage.find({pageId: {$in: pageIds}}).populate('bot').exec(function (err, data) {
            if(err){
                console.log(err);
            }else {
                return res.json(data);
            }

        })
    }
};
