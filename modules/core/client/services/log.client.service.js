(function () {
    'user strict';

    angular.module('playchat').factory('LogService', function ()
    {
        var LogService = function()
        {
            this.userId = undefined;
        };
        
        LogService.prototype.init = function(userId, botId)
        {
            this.userId = userId;
            this.botId = botId;

            var origin = window.location.origin;
            var url = origin + '/logging';
    
            var data = {};
            data.url = window.location.pathname ;
            if(userId) data.userId = userId;
            if(botId) data.botId = botId;
            $.ajax({
                type: "POST",
                url: url,
                data: data
            });
    

            var that = this;
            var pushState = history.pushState;
            history.pushState = function(a, b, state) {
                if (typeof history.onpushstate == "function") {
                    history.onpushstate({state: state});
                }
                if(state.indexOf(origin) == 0){
                    state = state.replace(origin, '');
                }

                var statePathname = state.split('?')[0].split('#')[0];
                if(statePathname.slice(-1) == '/' && statePathname.length > 1) statePathname = statePathname.slice(0, -1);


                if(statePathname != window.location.pathname){
                    var data = {};
                    data.url = statePathname ;
                    // console.log($.cookie.get())
                    if(that.userId) data.userId = that.userId;
                    if(that.botId) data.botId = that.botId;
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: data
                    });
                }
                return pushState.apply(history, arguments);
            }
        };
        
        return new LogService();
    });
})();
