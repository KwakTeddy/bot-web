(function()
{
    'use strict';
    angular.module('playchat').controller('OutboundController', ['$window', '$scope', '$resource', '$cookies', '$location', '$timeout', 'LanguageService', '$rootScope', 'FileUploader', 'ExcelDownloadService', function ($window, $scope, $resource, $cookies, $location, $timeout, LanguageService, $rootScope, FileUploader, ExcelDownloadService)
    {
        $scope.$parent.changeWorkingGroundName(LanguageService('Bot Profile'), '/modules/playchat/working-ground/chatbot-edit/client/imgs/botsetting.png');

        var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
        var SharedChatBotService = $resource('/api/chatbots/shared');
        const match = /\b((?:010[-.]?\d{4}|01[1|6|7|8|9][-.]?\d{3,4})[-.]?\d{4})\b/g;
        var page = 1;
        var countPerPage = $location.search().countPerPage || 50;

        var user = $cookies.getObject('user');

        $scope.botList = [];
        $scope.selectedBot = 'null';

        $scope.getList = function()
        {
            ChatBotService.query({ page: page, countPerPage: countPerPage, type : true }, function(list)
            {
                list.forEach((e) => {
                    e.created = moment(e.created).format('YYYY.MM.DD');
                });

                $scope.botList = list;
                console.log($scope.botList)

            });
        };

        $scope.setRegular = (e) => {
            if(e&&e.number){
                if(!e.number.match(match)){
                    e.number = '';
                    e.use = false;
                }else{
                    e.use = true;
                }
            }
        };

        $scope.clear = () => {
            $scope.numberset = [];
        };

        //var _mk_default = () => {
        //    var arr = [];
        //    var count = 12;
        //    for(var i in count){
        //        var value = {name:'',number:'',use:false};
        //        arr.push(value);
        //    }
        //    return arr;
        //};


        // default environment setting
        (() => {
            $scope.getList();
            angular.element('.main-logo-background').css('opacity', 0);
            $timeout(function()
            {
                angular.element('.main-logo-background').css('display', 'none');
            }, 1200);
        })();

        $scope.$parent.loaded('working-ground');


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

        $scope.test = (e) => {
            console.log($scope.selectedBot)
        };
        //$scope.getList();
        //$scope.excelDownload();
        $scope.lan = LanguageService;
    }]);
})();
