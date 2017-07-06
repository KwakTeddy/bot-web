var mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser'),
  UserDialog = mongoose.model('UserDialog'),
  async = require('async');



exports.mongodump = function (req, res) {
  UserDialog.find({botId: "Shinhancard"}).exec(function (err, data) {
    if(err){
      console.log(err);
    }
    else {
      async.eachSeries(data, function (dialog, cb) {
        BotUser.findOne({userKey: dialog.userId}).exec(function (err2, data2) {
          if(err) {
            console.log(err2);
          }
          else {
            if(data2.botId && data2.botId.length){
              cb(null)
            }else {
              data2['botId'] = ["Shinhancard"];
              data2.save(function (err3) {
                if(err3) {
                  console.log(err3);
                }
                else {
                  cb(null)
                }
              })
            }
          }
        })
      }, function (err) {
        res.send('hi');
      });
    }
  });
};

