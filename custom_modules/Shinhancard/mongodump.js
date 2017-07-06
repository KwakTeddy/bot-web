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
      var count = 0;
      async.eachSeries(data, function (dialog, cb) {
        console.log(count);
        BotUser.findOne({userKey: dialog.userId}).exec(function (err2, data2) {
          if(err) {
            console.log(err2);
          }
          else {
            if(!data2){
              cb(null);
            }else {
              if(data2.botId && data2.botId.length){
                console.log('already Data');
                count++;
                cb(null)
              }else {
                data2['botId'] = ["Shinhancard"];
                data2.save(function (err3) {
                  if(err3) {
                    console.log(err3);
                  }
                  else {
                    console.log('new Data Added');
                    count++;
                    cb(null)
                  }
                })
              }
            }
          }
        })
      }, function (err) {
        res.send('hi');
      });
    }
  });
};

