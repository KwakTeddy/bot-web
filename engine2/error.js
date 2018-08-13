var Logger = require('./logger.js');

(function()
{
    // 이 모듈의 역할은 어디서 호출하든지 바로 채널에 에러로 전달해준다.
    var Error = function(callback)
    {
        this.callback = callback;
    };

    Error.prototype.delegate = function(err)
    {
        Logger.error(err);
        if(this.callback)
        {
            this.callback(err);
        }
    };

    module.exports = Error;
})();
