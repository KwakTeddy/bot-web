var path = require('path');
var async = require('async');
var fs = require('fs');
var zhNLP = require(path.resolve('./modules/bot/engine/nlp/processor_zh'));

var data = fs.readFileSync(path.resolve("./external_modules/factLink/factLinkData.txt"), 'utf8');
var entries = data.split('\n');
console.log("line count: " + entries.length);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/bot-dev";

async.eachSeries(entries, function(entry, cb) {
    entry = entry.replace(/(^\s*)|(\s*$)/gi, "");
    if (entry=="") cb();

    zhNLP.analyzeFactLinks(null, entry, function(node1, node2, link) {
        if (node1!="" && node2!="" && link!="") {
            console.log("              -" + entry);
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dic = {botUser: "5bdd3aff-ba24-4a0e-8d4c-9805f09a233d", bot_id: "MaYun", node1: node1, node2: node2, link: link, created: new Date()};
                db.collection("factlinks").insertOne(dic, function(err, res) {
                    if (err) throw err;
                    console.log(dic);
                    db.close();
                });
            });
        }
    });
    cb();
}, function(err) {
    console.log("done...");
})
