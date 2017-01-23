'use strict';

var   path = require('path'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

var private_bot = require(path.resolve('custom_modules/private_bot/kakao-restore'));
/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  if(req.query['_p'] == 'nomenu') {  // 모바일 화면
    res.render('modules/core/server/views/nomenu-index', {
      user: req.user
    });
  } else {
    res.render('modules/core/server/views/index', {
      user: req.user || null
    });
  }
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

exports.uploadFile = function (req, res) {
  console.log('uploadFile:' );

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './custom_modules/private_bot/_data/ko/kakao/')
    },
    filename: function (req, file, cb) {
      cb(null, req.params.filename + path.parse(file.originalname).ext);
      // cb(null, req.params.filename)
    }
  });

  // var user = req.user;
  var message = null;
  var upload = multer({storage: storage}).single('uploadFile');
  var dialogUploadFileFilter = require(path.resolve('./config/lib/multer')).dialogUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = dialogUploadFileFilter;

  // if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading file'
        });
      } else {
        console.log('uploadFile:' + req.file.filename);
        res.json({result: 'ok', filename: req.file.filename});
      }
    });
  // } else {
  //   res.status(400).send({
  //     message: 'User is not signed in'
  //   });
  // }
};


exports.convertFile = function (req, res) {

  var dir = path.resolve('custom_modules/private_bot/_data/ko/kakao/');
  var filename = req.body.filename;
  var info = path.parse(path.join(dir, filename));
  var csvname = info.name + '.csv';
  var dlgname = info.name + '_dlg.csv';

  if(info.ext == '.txt') {
    private_bot.convertFile(path.join(dir, filename), path.join(dir, csvname),
      function(result) {
        private_bot.convertConversation(path.join(dir,csvname), path.join(dir, dlgname),
          function() {
            private_bot.insertDatasetFile(path.join(dir, dlgname),
              function(result) {
                console.log('convertFile: ' + filename);
                res.json({result: 'ok'});
              });
          });
      });

  } else if(info.ext == '.csv') {
    private_bot.convertConversation(path.join(dir,csvname), path.join(dir, dlgname),
      function() {
        private_bot.insertDatasetFile(path.join(dir, dlgname),
          function(result) {
            console.log('convertFile: ' + filename);
            res.json({result: 'ok'});
          });
      });
  }

}