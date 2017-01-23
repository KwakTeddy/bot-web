'use strict';

module.exports.profileUploadFileFilter = function (req, file, cb) {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

module.exports.dialogUploadFileFilter = function (req, file, cb) {
  if (file.mimetype !== 'text/plain' && file.mimetype !== 'text/csv') {
    return cb(new Error('Only txt/csv files are allowed!'), false);
  }
  cb(null, true);
};
