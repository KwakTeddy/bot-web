/*
 export userdialogs as input/output pair to csv from mongodb

 - need to convert encoding of the output
 - how to run

 mongo bot export.js > dialog.csv
 iconv -c -f utf-8 -t euc-kr dialog.csv > dialogkr.csv

 */

'use strict';

var data = db.userdialogs.find({botId:"park", dialog:{$nin:[":reset user",":build athena reset"]}},{inOut:1, dialog:1,_id:0}).toArray();

var result = [];
var curIdx = 0;
data.forEach(function (obj) {
 if (obj.inOut) {
   curIdx = result.push([obj.dialog]) -1;
 } else {
   if (result[curIdx] && result[curIdx].length == 1) {
     result[curIdx].push(obj.dialog);
   }
 }
});

result.forEach(function(obj) {
  print(obj[0] + "," + obj[1]+"\n");
});


