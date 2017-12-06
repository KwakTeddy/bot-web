var path = require('path');
var bot = require(path.resolve('engine/bot')).getTemplateBot('restaurant');
var mongoModule = require(path.resolve('engine/bot/action/common/mongo'));

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var eventCategoryAction = {
    name: 'eventCategoryAction',
    action: function(task, context, callback) {
        var model, query, sort;

        model = mongoModule.getModel('restaurant-events');
        query = {botId: context.bot.id};
        sort = {'_id': -1};

        model.find({ botId: context.bot.id }).sort({ _id: -1 }).exec(function(err, list)
        {
            if(!list)
            {
                callback(task, context);
            }
            else
            {
                console.log('ㅑㅐ너랴ㅐㄴ어래쟈 결과 : ', list);

                var events = [];
                for(var i=0; i<list.length; i++)
                {
                    events.push({ name: list[i].name, description: list[i].description, image: list[i].image });
                }

                context.dialog.events = events;
                task.doc = events;
                callback(task,context);
            }
        });

        // model.aggregate([
        //     {$match: query},
        //     {$sort: sort},
        //     {$group: {
        //         _id: '$category',
        //         category: {$first: '$category'}
        //     }}
        // ], function(err, docs) {
        //     if(docs == undefined) {
        //         callback(task, context);
        //     } else {
        //         var categorys = [];
        //         for (var i = 0; i < docs.length; i++) {
        //             var doc = docs[i];
        //
        //             var category = doc.category;
        //             if(!_.includes(categorys, category)){
        //                 categorys.push({name: category});
        //             }
        //
        //             // for (var j = 0; j < doc.category.length; j++) {
        //             //   var category = doc.category[j];
        //             //   if(!_.includes(categorys, category)){
        //             //     categorys.push({name: category});
        //             //   }
        //             // }
        //         }
        //
        //         if (categorys.length == 1) {
        //
        //             console.log('카테고리 : ', categorys);
        //             task.doc = categorys;
        //             context.dialog.categorys = categorys;
        //             eventAction(task,context, function(task,context) {
        //                 callback(task,context);
        //             });
        //         } else if (categorys.length > 1) {
        //             task.doc = categorys;
        //             context.dialog.categorys = categorys;
        //             callback(task,context);
        //         } else {
        //             callback(task,context);
        //         }
        //     }
        // });
    }
}

bot.setTask("eventCategoryAction", eventCategoryAction);
