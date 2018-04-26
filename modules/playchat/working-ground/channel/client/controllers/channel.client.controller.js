'use strict';

angular.module('playchat').controller('ChannelController', ['$window', '$scope', '$resource', '$cookies', '$location', '$state', '$http', 'LanguageService', function ($window, $scope, $resource, $cookies, $location, $state, $http, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Channel'), '/modules/playchat/gnb/client/imgs/channel_grey.png');

    $scope.$parent.loaded('working-ground');

    var FacebookPageService = $resource('/auth/facebook/page');
    var TelegramService = $resource('/api/:botId/channel/telegram', { botId: '@botId' });
    var WeChatService = $resource('/api/:botId/channel/wechat', { botId: '@botId' });
    var LineAccessTokenService = $resource('/api/:botId/channel/line', { botId: '@botId' });

    $scope.host = $location.host() + ($location.port() && $location.port() != 443 ? ':' + $location.port() : '');
    if($location.host() == 'localhost')
        $scope.host = 'http://' + $scope.host;
    else
        $scope.host = 'https://' + $scope.host;

    var chatbot = $scope.chatbot = $cookies.getObject('chatbot');

    $scope.myBotAuth = chatbot.myBotAuth;
    if(!$scope.myBotAuth.edit)
    {
        alert(LanguageService('You do not have permission to edit this bot'));
        location.href='/playchat/';
        return;
    }

    $scope.help = {
        kakao: false,
        naver: false,
        line: false,
        facebook: false,
        telegram: false
    };

    $scope.lineAccessToken = '';
    $scope.lineChannelId = '';
    $scope.lineChannelSecret = '';
    $scope.telegramToken = '';

    var user = $cookies.getObject('user');

    (function()
    {
        $(document).ready(function()
        {
            var connection = $cookies.get('facebookconnection');
            if(connection)
            {
                $cookies.remove('facebookconnection');
                $scope.connectFacebook();
            }
        });

        LineAccessTokenService.get({ botId: chatbot.id }, function(result)
        {
            $scope.lineAccessToken = result.accessToken;
            $scope.lineChannelSecret = result.secret;
            $scope.lineChannelId = result.channelId;
        });

        TelegramService.get({ botId: chatbot.id }, function(result)
        {
            $scope.telegramToken = result.token || '';
        });

        WeChatService.get({ botId: chatbot.id }, function(result)
        {
            console.log('리절트 : ', result);

            $scope.wechatAppId = result.appId;
            $scope.wechatKey = result.encodingAESKey;
        });

        $scope.saveLineInfo = function()
        {
            LineAccessTokenService.save({ botId: chatbot.id, accessToken: $scope.lineAccessToken, channelId: $scope.lineChannelId, secret: $scope.lineChannelSecret }, function()
            {
                alert(LanguageService('Saved.'));
            });
        };

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

                FB.api('/me/accounts?fields=picture,name,link,access_token,perms&access_token=' + accessToken, function(response)
                {
                    console.log(response);
                    if(response.error)
                    {
                        console.log(response.error);
                    }
                    else
                    {
                        if(!response.data.length)
                        {
                            FB.api('/me/permissions?access_token='+accessToken, function (response2)
                            { //현재 토큰의 권한 확인
                                if(response2.error)
                                {
                                    console.log(response2.error)
                                }
                                else
                                {
                                    var hasPageToken = '';
                                    for(var i = 0; i < response2.data.length; i++)
                                    {
                                        if(response2.data[i].permission == "manage_pages"){
                                            hasPageToken = true;
                                            break
                                        }
                                    }

                                    if(!hasPageToken)
                                    { // 페이지 권한 요청
                                        $cookies.put('facebookconnection', 'true');
                                        var url = '/auth/facebook/page?redirect_to=' + $scope.host + '/playchat/channel';
                                        $window.location.href = url; //register facebook but No page Token(getting Token)
                                    }
                                    else
                                    { //페이지가 없음
                                        $scope.help.facebook = true;
                                    }
                                }
                            });
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

                                console.log(response.data);

                                $scope.pageList = response.data;

                                $scope.help.facebook = true;
                            });
                        }
                    }
                });
            });
        };

        $scope.saveWeChatToken = function(e)
        {
            var encodingAESKey = $('#encodingAESKey').val();
            var appId = $('#wechatAppId').val();

            if(!encodingAESKey || !appId)
            {
                return alert('AppId와 encodingAESKey를 입력해주세요');
            }

            WeChatService.save({ botId: chatbot.id, appId: appId, encodingAESKey: encodingAESKey }, function()
            {
                alert(LanguageService('Connected'));
                $scope.help.wechat = false;
            },
            function(err)
            {
                console.error(err);
                alert('Error');
            });
        };

        $scope.connectTelegram = function(e)
        {
            var prev = e.currentTarget.previousElementSibling;
            var token = prev.value;

            TelegramService.save({ botId: chatbot.id, token: token }, function()
            {
                alert(LanguageService('Connected'));
                $scope.help.telegram = false;
            },
            function(err)
            {
                console.error(err);
                alert('Error');
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

        $scope.copyLink = function(e)
        {
            try {
                var copyText = e.currentTarget.previousElementSibling;
                copyText.select();
                document.execCommand("Copy");
                alert($scope.lan('Copied the text!'));
            }
            catch(err)
            {
                console.error(err);
                alert('Error');
            }
        };
    })();


    $scope.lan=LanguageService;
}]);
