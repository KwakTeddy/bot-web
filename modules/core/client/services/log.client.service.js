(function () {
    'user strict';

    angular.module('playchat').factory('LogService', function () {

        return {
            init : function (userId, botId) {
                var origin = window.location.origin;
                var url = origin + '/logging';

                var data = {};
                data.url = window.location.pathname ;
                data.userId = userId;
                data.botId = botId;
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data
                });


                var pushState = history.pushState;
                history.pushState = function(a, b, state) {
                    if (typeof history.onpushstate == "function") {
                        history.onpushstate({state: state});
                    }
                    if(state.indexOf(origin) == 0){
                        state = state.replace(origin, '');
                    }

                    if(state.indexOf(window.location.pathname) == -1){
                        var data = {};
                        data.url = state ;
                        data.userId = userId;
                        data.botId = botId;
                        $.ajax({
                            type: "POST",
                            url: url,
                            data: data
                        });
                    }
                    return pushState.apply(history, arguments);
                }
            }
        }
    });
})();
