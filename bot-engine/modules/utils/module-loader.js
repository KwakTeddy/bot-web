var recursiveReader = require('recursive-readdir');
(function()
{
    module.exports.load = function(path, options, callback)
    {
        var fileList = [];
        options = options || {};
        recursiveReader(path, options.ignores || [], function(err, files)
        {
            for(var i=0, l=files.length; i<l; i++)
            {
                var check = false;
                if(options.postfix && files[i].endsWith(options.postfix))
                {
                    check = true;
                }

                if(check)
                    fileList.push(files[i]);
            }

            callback(fileList);
        });
    };
})();
