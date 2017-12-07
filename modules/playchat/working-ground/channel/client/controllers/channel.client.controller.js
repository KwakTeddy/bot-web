'use strict';

angular.module('playchat').controller('ChannelController', ['$window', '$scope', '$resource', '$cookies', '$location', '$http', 'LanguageService', function ($window, $scope, $resource, $cookies, $location, $http, LanguageService)
{
    $scope.$parent.changeWorkingGroundName('Channel', '/modules/playchat/gnb/client/imgs/channel.png');

    $scope.$parent.loaded('working-ground');


    var FacebookPageService = $resource('/auth/facebook/page');

    console.log('채널');

    $scope.host = 'https://' + $location.host() + ($location.port() ? ':' + $location.port() : $location.port());
    $scope.chatbot = $cookies.getObject('chatbot');

    $scope.help = {
        kakao: false,
        naver: false,
        line: false,
        facebook: false
    };

    var user = $cookies.getObject('user');

    (function()
    {
        $scope.getAccessToken = function(callback)
        {
            FB.getLoginStatus(function(response)
            {
                if (response.status === 'connected')
                {
                    var accessToken = response.authResponse.accessToken;

                    callback(accessToken);
                }
                else
                {
                    FB.login(function(response)
                    {
                        if (response.authResponse)
                        {
                            var accessToken = response.authResponse.accessToken;

                            callback(accessToken);
                        }
                        else
                        {
                            console.log('User cancelled login or did not fully authorize.');
                        }
                    });
                }
            });
        };

        $scope.connect = function (page)
        {
            FB.api('/me/subscribed_apps?access_token=' + page.access_token, 'post', function (response)
            { // 페이지 연결하기
                if (response.success)
                {
                    var info = {};
                    info['user'] = user._id;
                    info['userBot'] = $scope.chatbot._id;
                    info['userBotId'] = $scope.chatbot.id;
                    info['page'] = page;
                    info['connect'] = true;

                    page['connected'] = true;

                    $http.post('/api/auth/facebook/pageInfo', info).then(function (response)
                    { //페이지 연결정보 데이터 변경
                        FB.api('me/messenger_profile?access_token=' + page.access_token, 'post', { //페이지 시작 화면 설정
                            "persistent_menu": [
                                {
                                    "locale": "default",
                                    "call_to_actions": [
                                        {
                                            "type": "postback",
                                            "title": "시작하기",
                                            "payload": "시작",
                                            "webview_height_ratio": "full"
                                        }
                                    ]
                                }
                            ],
                            "get_started": {
                                "payload": "시작"
                            }
                        },
                        function (response)
                        {
                            console.log(response)
                        });
                    },
                    function (err)
                    {
                        console.log(err)
                    });
                }
                else
                {
                    console.log(response);
                }
            });
        };

        $scope.disconnect = function (page)
        {
            var info = {};
            info['user'] = user._id;
            info['userBot'] = $scope.chatbot._id;
            info['userBotId'] = $scope.chatbot.id;
            info['page'] = page;
            info['connect'] = false;
            page['connected'] = false;
            FB.api('/me/subscribed_apps?access_token='+ page.access_token, 'delete', function (response) { //페이지 연결 해제
                if (response.success){
                    page['connected'] = false;
                    $http.post('/api/auth/facebook/pageInfo', info).then(function (response) {//페이지 연결정보 변경
                        FB.api('me/messenger_profile?access_token='+ page.access_token, 'DELETE', { //페이지 시작 화면 설정
                            "fields":[
                                "get_started",
                                "persistent_menu",
                                "greeting"
                            ]
                        }, function (response) {
                            console.log(response)
                        });
                    }, function (err) {
                        console.log(err)
                    })
                }else {
                    console.log(response)
                }
            });
        };

        $scope.connectFacebook = function()
        {
            $scope.getAccessToken(function(accessToken)
            {
                $scope.pageList = [];

                console.log('엑세스 토큰 : ', accessToken);
                FB.api('/me/accounts?fields=picture,name,link,access_token,perms&access_token=' + accessToken, function(response)
                {
                    console.log(response);
                    if(response.error)
                    {
                        alert('페이지를 가져오는데 실패했습니다');
                    }
                    else
                    {
                        if(!response.data.length)
                        {
                            //페이지 없음
                        }
                        else
                        {
                            $http.post('/api/auth/facebook/pageInfo', {user: user._id, list: true, pageInfo: response.data}).then(function (res)
                            { // 페이지 연결정보 불러오기
                                for (var j = 0; j < response.data.length; j++)
                                {
                                    for (var i = 0; i < res.data.length; i++)
                                    {
                                        if ((res.data[i].pageId == response.data[j].id) && res.data[i].connect)
                                        {
                                            response.data[j]['connected'] = res.data[i].bot;
                                            break;
                                        }
                                        else
                                        {
                                            response.data[j]['connected'] = false;
                                        }
                                    }
                                }

                                $scope.pageList = response.data;

                                $scope.help.facebook = true;
                            });
                        }
                    }
                });
            });
        };

        $scope.viewHelp = function(name)
        {
            $scope.help[name] = true;
        };

        $scope.closeHelp = function(name)
        {
            $scope.help[name] = false;
        };
    })();


    $scope.lan=LanguageService;
}]);
