var Logger = require('./logger.js');

(function()
{
    // 이 모듈의 역할은 어디서 호출하든지 바로 채널에 에러로 전달해준다.
    var Error = function()
    {
        this.callbacks = {};
    };

    Error.prototype.setCallback = function(user, callback)
    {
        this.callbacks[user] = callback;
    };

    Error.prototype.delegate = function(user, err)
    {
        Logger.error(err);
        this.callbacks[user](err);
    };

    module.exports = new Error();
})();
