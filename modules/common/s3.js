(function()
{
    var path = require('path');
    var fs = require('fs');

    var AWS = require('aws-sdk');
    AWS.config.update(require(path.resolve('./aws-s3-credentials.json')));

    var S3 = function()
    {
        this.s3 = new AWS.S3();
    };

    S3.prototype.uploadFile = function(bucket, dir, name, path, callback)
    {
        var that = this;
        fs.readFile(path, function(err, data)
        {
            if(err)
            {
                if(callback)
                {
                    callback(err);
                }
            }
            else
            {
                var base64data = new Buffer(data, 'binary');
                var param = {};
                param.Bucket = bucket;
                param.Key = dir + '/' + name;
                param.Body = base64data;
                param.ACL = 'public-read';

                that.s3.putObject(param, function (err, response)
                {
                    if(err)
                    {
                        callback(err);
                    }
                    else if(callback)
                    {
                        callback(null, 'https://s3.ap-northeast-2.amazonaws.com/playchat-files/' + dir + '/' + name);
                    }
                });
            }
        });
    };

    module.exports = new S3();
})();
