var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('athena');
var async = require('async');

var newscrawl = {
    module: 'http',
    action: "simpleRequest",
    uri: 'http://news.naver.com',
    path: '/main/ranking/popularDay.nhn?rankingType=popular_day&sectionId=000',
    method: 'GET',
    param: {
        rankingType: 'popular_day',
        sectionId: '000'
    },
    xpath: {
        // tag: '//*[@id="table_list"]/tr[1]/td[1]/text()',
        title: '//*[@id="wrap"]/table/tbody/tr/td[2]/div/div[1]/div[1]/span/text()'
        // date: '//*[@id="FOOTER_wrap"]/div[2]/div[1]/div[2]/span[1]/text()',
        // content: '//*[@id="CONTENTS_wrap"]/form/div[5]/table[1]/tbody/tr[3]/td/text()'
    },
    postCallback: function (task, context, callback) {
        console.log(task._text);

        // task.doc.date = task.doc.date.trim();
        // task.doc.content = task.doc.content.trim();
        // task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

        console.log(JSON.stringify(task.doc));

        // task.doc.company = 'KB생명';
        // task.doc.originalId = task.doc.company;
        // task.topTask.doc[task.topTask.index] = task.doc;
        callback(task, context);
    }
};

bot.setTask('newscrawl', newscrawl);
exports.newscrawl = newscrawl;
