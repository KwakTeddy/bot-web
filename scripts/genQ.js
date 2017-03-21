/**
 * Created by Wonjun on 2017-03-21.
 */
'use strict';
var path = require('path');
const csv = require('csvtojson');

var csvFile = path.resolve("q.csv");

var curWord = '';
var curTense = '';
var curQuestion = '';
var out = "";
var newLine = false;
var isFirst = true;

var tense = {
  "현재":1,
  "과거":2,
  "미래":3
};

out = "var verbQuibbles = [";
csv({noheader:false})
  .fromFile(csvFile)
  .on('csv',  function(csvRow) {
    if (csvRow[0] != '' || csvRow[1] != '' || csvRow[2] != '') {
      newLine = true
    }
    if (csvRow[0] != '') curWord = csvRow[0];
    if (csvRow[1] != '') curTense = tense[csvRow[1]];
    if (csvRow[2] != '') curQuestion = csvRow[2];

    if (newLine) {
      if (!isFirst) {
        out += "]},\n";
      } else {
        isFirst = false;
      }
      out +="{ condition: {word: '" + curWord + "', tenseType:" + curTense + ", questionWord: '" + curQuestion + "'}, sentences: [\n";
      newLine = false;
    }
    out += '"' + csvRow[4] + '",\n';
  })
  .on('done', function(error) {
    out += "];";
    console.log(out);
  });
