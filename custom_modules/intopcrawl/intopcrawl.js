var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('./engine/core/bot')).getBot('intopcrawl');
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var crawl_itemsSchema = {
  id: {
    type: Number
  },
  store_name: {
    type: String
  },
  item_category: {
    type: String
  },
  item_name: {
    type: String
  },
  item_link: {
    type: String
  },
  item_numver: {
    type: String
  },
  item_price: {
    type: Number
  },
  item_sale_price: {
    type: Number
  },
  item_color: {
    type: String
  },
  item_size: {
    type: String
  },
  item_milelage: {
    type: String
  },
  item_summary: {
    type: String
  },
  item_detail: {
    type: String
  },
  item_image: {
    type: String
  },
  inserted_date: {
    type: Date
  }
};

var crawl_codiSchema = {
  store_name: {
    type: String
  },
  item_number: {
    type: String
  },
  codi_item_number: {
    type: String
  }
};

var qna_postSchema = {
  id: {
    type: Number
  },
  qna_content: {
    type: String
  },
  qna_item_number: {
    type: String
  },
  qna_link_number: {
    type: String
  },
  qna_number: {
    type: String
  },
  qna_type: {
    type: String
  },
  qna_when_inserted: {
    type: Date
  },
  qna_writer: {
    type: String
  },
  qna_write_date: {
    type: Date
  },
  store_name: {
    type: String
  }
};

var qnaSchema = {
  question: String,
  answer: String
};

var metatypeexampleSchema = {
  meta_type_id: {
    type: Number
  },
  value: {
    type: String
  },
  value_numerical: {
    type: Number
  }
};

var metatypeSchema = {
  id: {
    type: Number
  },
  value: {
    type: String
  },
  item_category: {
    type: Number
  },
  group: {
    type: String
  }
};

var metaSchema = {
  id: {
    type: Number
  },
  dependencytype: {
    type: String
  },
  dependencyvalue: {
    type: String
  },
  item_id: {
    type: Number
  },
  meta_type_id: {
    type: Number
  },
  value: {
    type: String
  }
};

var categorySchema = {
  id: {
    type: Number
  },
  gender: {
    type: String
  },
  name: {
    type: String
  },
  parent_id: {
    type: Number
  }
};


exports.itemscrawl = function (task,context,callback) {
  var mysql = require('mysql');
  var crawl = mongo.getModel('gas_crawl_items',crawl_itemsSchema);
  var connection = mysql.createConnection({
    host: 'backup-2017-03-17.c9xpl7bryatp.ap-northeast-2.rds.amazonaws.com',
    user: 'crawl_root',
    password: 'crawl',
    database: 'gas'
  });

  connection.connect(function(err){
    if (err){
      console.log("cannot connect to database");
      console.log(err);
    }
    else
    {
      console.log("connected to database");
    }
  });

  connection.query('select * from gas_crawl_items', function (error, results, fields) {
    if (error) {
      throw error;
      callback(task,context);
    } else {
      async.eachSeries(results, function(doc, cb) {
        crawl.update({id: doc.id}, doc, {upsert: true}, function(err) {
          if (err) {
            return err;
            callback(task, context);
          }
        });
        cb(null)
      }, function (err) {
        console.log("data saved");
        callback(task,context);
      });
      // console.log(results);
      // callback(task,context);
    }
  });
};

exports.codicrawl = function (task,context,callback) {
  var mysql = require('mysql');
  var crawl = mongo.getModel('gas_codi_items',crawl_codiSchema);
  var connection = mysql.createConnection({
    host: 'backup-2017-03-17.c9xpl7bryatp.ap-northeast-2.rds.amazonaws.com',
    user: 'crawl_root',
    password: 'crawl',
    database: 'gas'
  });

  connection.connect(function(err){
    if (err){
      console.log("cannot connect to database");
      console.log(err);
    }
    else
    {
      console.log("connected to database");
    }
  });

  connection.query('select * from gas_codi_items', function (error, results, fields) {
    if (error) {
      throw error;
      callback(task,context);
    } else {
      async.eachSeries(results, function(doc, cb) {
        crawl.update({$and: [{store_name: doc.store_name},{item_number: doc.item_number},{codi_item_number: doc.codi_item_number}]}, doc, {upsert: true}, function(err) {
          if (err) {
            return err;
            callback(task, context);
          }
        });
        cb(null)
      }, function (err) {
        console.log("data saved");
        callback(task,context);
      });
      // console.log(results);
      // callback(task,context);
    }
  });
};

exports.faqcrawl = function (task,context,callback) {
  var mysql = require('mysql');
  var crawl = mongo.getModel('qna_post',qna_postSchema);
  var connection = mysql.createConnection({
    host: 'backup-2017-03-17.c9xpl7bryatp.ap-northeast-2.rds.amazonaws.com',
    user: 'crawl_root',
    password: 'crawl',
    database: 'gas'
  });

  connection.connect(function(err){
    if (err){
      console.log("cannot connect to database");
      console.log(err);
    }
    else
    {
      console.log("connected to database");
    }
  });

  connection.query('select * from qna_post', function (error, results, fields) {
    if (error) {
      throw error;
      callback(task,context);
    } else {
      async.eachSeries(results, function(doc, cb) {
        if (doc.qna_content) {
          doc.qna_content = doc.qna_content.replace(/[가-힣]{1,2}.(님)/g,"고객님");
          doc.qna_content = doc.qna_content.replace(/,/g," ");
          doc.qna_content = doc.qna_content.replace(/"/g,"");
        }
        crawl.update({id: doc.id}, doc, {upsert: true}, function(err) {
          if (err) {
            return err;
            callback(task, context);
          }
        });
        cb(null)
      }, function (err) {
        console.log("data saved");
        callback(task,context);
      });
      // console.log(results);
      // callback(task,context);
    }
  });
};

exports.arrnageqna = function (task,context,callback) {
  var mysql = require('mysql');
  var crawl = mongo.getModel('qna_post',qna_postSchema);
  var qna = mongo.getModel('qna_arrange', qnaSchema);

  crawl.find().lean().exec(function(err,docs) {
    if (err) {
      return err;
      callback(task, context);
    } else {
      console.log(docs);
      async.eachSeries(docs, function (doc,cb) {
        if (doc.qna_link_number != '') {
          crawl.find({qna_number: doc.qna_link_number}).lean().exec(function(err,datas) {
            var data = datas[0];
            qna.update({question:data.qna_content},{quetion: data.qna_title, answer: doc.qna_content}, {upsert: true}, function(err) {
              if (err) {
                return err;
                callback(task, context);
              }
            });
            cb(null)
          })
        } else {
          cb(null)
        }
      }, function (err) {
        console.log("arrange finish");
        callback(task,context);
      });
    }
  });
  // async.eachSeries(results, function(doc, cb) {
  //   crawl.find({id: doc.id}, doc, {upsert: true}, function(err) {
  //     if (err) {
  //       return err;
  //       callback(task, context);
  //     }
  //   });
  //   cb(null)
  // }, function (err) {
  //   console.log("data saved");
  //   callback(task,context);
  // });
  // console.log(results);
  // callback(task,context);
};

exports.metatypeexamplecrawl = function (task,context,callback) {
  var mysql = require('mysql');
  var crawl = mongo.getModel('gas_item_meta_type_example',metatypeexampleSchema);
  var connection = mysql.createConnection({
    host: 'backup-2017-03-17.c9xpl7bryatp.ap-northeast-2.rds.amazonaws.com',
    user: 'crawl_root',
    password: 'crawl',
    database: 'gas'
  });

  connection.connect(function(err){
    if (err){
      console.log("cannot connect to database");
      console.log(err);
    }
    else
    {
      console.log("connected to database");
    }
  });

  connection.query('select * from gas_item_meta_type_example', function (error, results, fields) {
    if (error) {
      throw error;
      callback(task,context);
    } else {
      async.eachSeries(results, function(doc, cb) {
        crawl.update({meta_type_id: doc.meta_type_id}, doc, {upsert: true}, function(err) {
          if (err) {
            return err;
            callback(task, context);
          }
        });
        cb(null)
      }, function (err) {
        console.log("data saved");
        callback(task,context);
      });
      // console.log(results);
      // callback(task,context);
    }
  });
};

exports.metatypecrawl = function (task,context,callback) {
  var mysql = require('mysql');
  var crawl = mongo.getModel('gas_item_meta_type',metatypeSchema);
  var connection = mysql.createConnection({
    host: 'backup-2017-03-17.c9xpl7bryatp.ap-northeast-2.rds.amazonaws.com',
    user: 'crawl_root',
    password: 'crawl',
    database: 'gas'
  });

  connection.connect(function(err){
    if (err){
      console.log("cannot connect to database");
      console.log(err);
    }
    else
    {
      console.log("connected to database");
    }
  });

  connection.query('select * from gas_item_meta_type', function (error, results, fields) {
    if (error) {
      throw error;
      callback(task,context);
    } else {
      async.eachSeries(results, function(doc, cb) {
        crawl.update({id: doc.id}, doc, {upsert: true}, function(err) {
          if (err) {
            return err;
            callback(task, context);
          }
        });
        cb(null)
      }, function (err) {
        console.log("data saved");
        callback(task,context);
      });
      // console.log(results);
      // callback(task,context);
    }
  });
};

exports.metacrawl = function (task,context,callback) {
  var mysql = require('mysql');
  var crawl = mongo.getModel('gas_item_metas',metaSchema);
  var connection = mysql.createConnection({
    host: 'backup-2017-03-17.c9xpl7bryatp.ap-northeast-2.rds.amazonaws.com',
    user: 'crawl_root',
    password: 'crawl',
    database: 'gas'
  });

  connection.connect(function(err){
    if (err){
      console.log("cannot connect to database");
      console.log(err);
    }
    else
    {
      console.log("connected to database");
    }
  });

  connection.query('select * from gas_item_metas', function (error, results, fields) {
    if (error) {
      throw error;
      callback(task,context);
    } else {
      async.eachSeries(results, function(doc, cb) {
        crawl.update({id: doc.id}, doc, {upsert: true}, function(err) {
          if (err) {
            return err;
            callback(task, context);
          }
        });
        cb(null)
      }, function (err) {
        console.log("data saved");
        callback(task,context);
      });
      // console.log(results);
      // callback(task,context);
    }
  });
};

exports.categorycrawl = function (task,context,callback) {
  var mysql = require('mysql');
  var crawl = mongo.getModel('gas_item_category',categorySchema);
  var connection = mysql.createConnection({
    host: 'backup-2017-03-17.c9xpl7bryatp.ap-northeast-2.rds.amazonaws.com',
    user: 'crawl_root',
    password: 'crawl',
    database: 'gas'
  });

  connection.connect(function(err){
    if (err){
      console.log("cannot connect to database");
      console.log(err);
    }
    else
    {
      console.log("connected to database");
    }
  });

  connection.query('select * from gas_item_category', function (error, results, fields) {
    if (error) {
      throw error;
      callback(task,context);
    } else {
      async.eachSeries(results, function(doc, cb) {
        crawl.update({id: doc.id}, doc, {upsert: true}, function(err) {
          if (err) {
            return err;
            callback(task, context);
          }
        });
        cb(null)
      }, function (err) {
        console.log("data saved");
        callback(task,context);
      });
      // console.log(results);
      // callback(task,context);
    }
  });
};
