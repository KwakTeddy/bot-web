(function()
{
    'use strict';
    angular.module('playchat').controller('OutboundController', ['$window', '$scope', '$resource', '$cookies', '$location', '$timeout', 'LanguageService', '$rootScope', 'FileUploader', 'ExcelDownloadService', function ($window, $scope, $resource, $cookies, $location, $timeout, LanguageService, $rootScope, FileUploader, ExcelDownloadService)
    {
        $scope.$parent.changeWorkingGroundName(LanguageService('Bot Profile'), '/modules/playchat/working-ground/chatbot-edit/client/imgs/botsetting.png');

        var ChatbotAuthService = $resource('/api/:botId/bot-auth/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
        var ChatbotEditService = $resource('/api/:botId/chatbot-edit', { botId: '@botId' }, { update: { method: 'PUT' } });
        var ChatbotEidtOptionService = $resource('/api/:botId/chatbot-edit/options', { botId: '@botId' }, { update: { method: 'PUT' } });
        var ChatBotShareService = $resource('/api/chatbots/:botId/share', { botId: '@botId' });

        var chatbot = $scope.chatbot = $cookies.getObject('chatbot');

        $scope.user = $cookies.getObject('user');

        $scope.list = [];
        $scope.openShareModal = false;
        $scope.openUploadModal = false;
        $scope.share = {};

        // for loading finish
        angular.element('.main-logo-background').css('opacity', 0);
        $timeout(() => {
            angular.element('.main-logo-background').css('display', 'none');
        },500);

        $scope.host = $location.host() + ($location.port() && $location.port() != 443 ? ':' + $location.port() : '');
        if($location.host() == 'localhost' || $location.port() == 8443)
            $scope.host = 'http://' + $scope.host;
        else
            $scope.host = 'https://' + $scope.host;

        $scope.botImage = '';

        $scope.botOptions = {
            use: 'true',
            useAutoCorrection: 'false'
        };

        (function()
        {
            $scope.uploader = new FileUploader({
                url: '/api/' + chatbot.id + '/dialog-graphs/uploadImage',
                alias: 'uploadFile',
                autoUpload: true
            });

            $scope.uploader.onErrorItem = function(item, response, status, headers)
            {
                alert(response.message);
            };

            $scope.uploader.onSuccessItem = function(item, response, status, headers)
            {
                $scope.image = {
                    url: response.url,
                    displayname: item.file.name
                };

                $scope.botImage = response.url;
            };

            $scope.uploader.onProgressItem = function(fileItem, progress)
            {
                console.log(progress);
            };
        })();

        (function()
        {
            $scope.chatbot.imageFile = $scope.chatbot.imageFile || '/modules/playchat/working-ground/dashboard/client/imgs/bigsumnail.png';

            // ChatbotEditService.get({ botId: chatbot._id }, function(bot)
            // {
            //     chatbot = $scope.chatbot = bot;
            //     $scope.chatbot.imageFile = '/modules/playchat/working-ground/dashboard/client/imgs/bigsumnail.png';
            //     $cookies.putObject(bot);
            // },
            // function(err)
            // {
            //     alert(err.data.message);
            // });

            $scope.saveChatbot = function()
            {
                ChatbotEditService.update({ botId: chatbot._id, name: $scope.chatbot.name, description: $scope.chatbot.description, language: $scope.chatbot.language, imageFile: $scope.chatbot.imageFile }, function(editedBot)
                {
                    $cookies.putObject("chatbot", $scope.chatbot);
                    angular.element("#gnb-bot-name").html($scope.chatbot.name);
                    angular.element("#simulator-bot-name").html($scope.chatbot.name);
                    $rootScope.$broadcast('simulator-build');
                    alert($scope.lan('Saved.'));
                },
                function(err)
                {
                    if(err.status == 401)
                    {
                        alert(LanguageService('You do not have permission to edit this bot'));
                    }
                    else
                    {
                        alert(err.data.message);
                    }
                });
            };

            $scope.getList = function()
            {
                ChatbotAuthService.get({ botId: chatbot._id }, function(result)
                {
                    var version = result.version;
                    var list = result.list;

                    $scope.list = list;

                    $scope.$parent.loaded('working-ground');
                },
                function(err)
                {
                    alert(err);
                });

                ChatbotEidtOptionService.get({ botId: chatbot.id }, function(result)
                {
                    var options = JSON.parse(angular.toJson(result));
                    for(var key in options)
                    {
                        if(options[key] === true || options[key] === false)
                        {
                            $scope.botOptions[key] = options[key] + '';
                        }
                        else
                        {
                            $scope.botOptions[key] = options[key];
                        }
                    }
                },
                function(err)
                {
                    console.log(err);
                });
            };

            $scope.saveAuth = function(item)
            {
                if(item.edit)
                {
                    item.read = true;
                }

                ChatbotAuthService.update({ botId: chatbot._id, _id: item._id, read: item.read, edit: item.edit }, function(result)
                {
                    console.log(result);
                },
                function(err)
                {
                    alert(err);
                });
            };

            $scope.addNewMember = function()
            {
                $scope.openShareModal = true;
            };

            $scope.showUploadModal = function()
            {
                $scope.openUploadModal = true;
            };

            $scope.closeShareModal = function()
            {
                $scope.openShareModal = false;
            };

            $scope.closeUploadModal = function()
            {
                $scope.openUploadModal = false;
            };

            $scope.uploadImage = function(e)
            {
                e.currentTarget.previousElementSibling.click();
            };

            $scope.addExternalImage = function()
            {
                $scope.botImage = prompt(LanguageService('Write URL address here.'));
            };

            $scope.shareChatbot = function()
            {
                if(!$scope.share.read && !$scope.share.write)
                {
                    alert($scope.lan('Please select at least one permission'));
                    return false;
                }

                if($scope.share.edit)
                {
                    $scope.share.read = true;
                }

                ChatBotShareService.save({ botId: chatbot._id, data: JSON.parse(angular.toJson($scope.share)), language: $scope.user.language }, function(result)
                {
                    $scope.share = {};
                    $scope.getList();
                    $scope.openShareModal = false;
                    alert('Shared ' + chatbot.name + ' to ' + $scope.share.email);
                },
                function(err)
                {
                    alert(err.data.message);
                });
            };

            $scope.deleteAuth = function(item, list)
            {
                if(confirm($scope.lan('Are you sure you want to delete this item?')))
                {
                    ChatbotAuthService.delete({ botId: chatbot._id, _id: item._id }, function(result)
                    {
                        var index = list.indexOf(item);
                        list.splice(index, 1);
                    },
                    function(err)
                    {
                        alert(err.data.message);
                    });
                }
            };

            $scope.saveUpload = function()
            {
                $scope.openUploadModal = false;
                $scope.chatbot.imageFile = $scope.botImage;
                $scope.botImage = '';
            };

            $scope.changeBotOptions = function()
            {
                var options = {};
                for(var key in $scope.botOptions)
                {
                    if($scope.botOptions[key] == 'true')
                    {
                        options[key] = true;
                    }
                    else if($scope.botOptions[key] == 'false')
                    {
                        options[key] = false;
                    }
                }

                ChatbotEidtOptionService.update({ botId: chatbot.id, options: options }, function()
                {
                    alert($scope.lan('Saved.'));
                },
                function(err)
                {

                });
            };
        })();

        $scope.excelDownload = () => {
            var template = {
                sheetName: 'Contact',
                columnOrder: ['Name', 'Mobile'],
                orderedData: [{
                    Name: '',
                    Mobile: ''
                }]
            };

            ExcelDownloadService.download('userID', 'Telebook', null, template);
        };
        //$scope.getList();
        $scope.excelDownload();
        $scope.lan = LanguageService;
    }]);
})();
