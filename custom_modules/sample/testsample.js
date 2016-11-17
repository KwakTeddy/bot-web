var async = require('async');
var mongoose = require('mongoose');

var restaurantModel;
var franchiseModel;
var franmenuModel;

var doc = restaurantModel.findOne();
var franchiseModel.findOne(doc.franchise);




if(name != '교촌') {
    restaurantModel.findOne({name: ''}, function(err, doc) {
        franchiseModel.find({_id: doc.franchise}, function(err, doc2) {
            console.log(doc2.name);
        });

        console.logs(docs.length);
    });

} else {
    franchiseModel.find({_id: 1}, function(err, doc2) {
        console.log(doc2.name);
    });

}

console.logs(docs.length);


async.waterfall([
    function(cb) {
        if(name == '맥도날드') {
            cb(true);
        } if(name != '교촌') {
            restaurantModel.findOne({name: ''}, function(err, doc) {
                cb(null);
            }
        } else {
            doc = 1;
            cb(null);
        }
    },

    function(cb) {
        franchiseModel.find({_id: doc.franchise}, function(err, doc2) {
            console.log(doc2.name);
        });
    },

    function(cb) {

    }
], function(err) {

})





restaurantModel.find({name: ''}, function(err, docs) {

    for(var i = 0; i < docs.length; i ++) {
        franchiseModel.find({_id: doc[i].franchise}, function(err, doc2) {
            if(doc[i].name == '교촌') break;
            console.log(doc2.name);
        });
    }

    console.logs(docs.length);
});


restaurantModel.find({name: ''}, function(err, docs) {
    async.eachSeries(docs, function(doc, cb) {
        franchiseModel.find({_id: doc.franchise}, function(err, doc2) {

            if(doc[i].name == '교촌') cb(true);
            else cb(null);

            console.log(doc2.name);
        });

    }, function(err) {

    });

}


client.elements('tr').then(function(res) {
    async.eachSeries(docs, function(doc, cb) {
        client.elementIdClick(v.ELEMENT, function(err, res) {
            cb(null);
        });
    })
}))


client.elements('tr').then(function(res) {
    var len = res.value.length;
    var count = 0;
    async.whilst(
        function() { return count < 5; },
        function(callback) {
            count++;

            client.click('div:nth-child(' + count + ')', function(err, res) {
                cb(null);
            });
        },
        function (err, n) {
            // 5 seconds have passed, n = 5
        }
    );

}


var count = 0;
async.whilst(
    function() { return count < 5; },
    function(callback) {

        count++;

    },
    function (err, n) {
        // 5 seconds have passed, n = 5
    }
);
