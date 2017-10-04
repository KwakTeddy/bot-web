'use strict';

angular.module('playchat.working-ground').controller('DialogLearningDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', 'ModalService', 'PagingService', function ($window, $scope, $resource, $cookies, $location, $compile, ModalService, PagingService)
{
    var DialogsetsService = $resource('/api/dialogsets/:botId/findbytitle', { botId: '@botId' });
    var DialogsService = $resource('/api/dialogs/:dialogsetId', { dialogsetId: '@dialogset' }, { update: { method: 'PUT' } });
    var DialogsPageService = $resource('/api/dialogs/:dialogsetId/totalpage', { dialogsetId: '@dialogsetId' });

    //UI Data
    $scope.topicOpened = false;

    var chatbot = $cookies.getObject('chatbot');
    var user = $cookies.getObject('user');

    //UI Handling
    (function()
    {
        angular.element('.dialog-learning-development-content input:first').focus();

        $scope.getDialogs = function(dialogsetId)
        {
            var page = page || $location.search().page || 1;
            var countPerPage = $location.search().countPerPage || 50;

            DialogsPageService.get({ dialogsetId: dialogsetId, countPerPage: countPerPage }, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            DialogsService.query({ dialogsetId: dialogsetId, page: page, countPerPage: countPerPage }, function(list)
            {
                $scope.dialogs = list;
                $scope.$parent.loaded('working-ground');
            });
        };

        $scope.save = function(data)
        {
            data.dialogset = $scope.currentDialogsetId;

            DialogsService.save(data, function(result)
            {
            });
        };

        $scope.getDialogFromElement = function(element)
        {
            var inputList = element.querySelectorAll('.question-area input');
            var outputList = element.querySelectorAll('.answer-area input');

            var data = {};
            data.input = [];
            data.output = [];

            for(var i=0, l=inputList.length; i<l; i++)
            {
                data.input.push(inputList[i].value);
            }

            for(var i=0, l=outputList.length; i<l; i++)
            {
                data.output.push(outputList[i].value);
            }

            return data;
        };

        $scope.addDialog = function(e)
        {
            var parent = e.currentTarget.parentElement;
            parent.removeChild(parent.querySelector('.new-dialog-title'));
            parent.querySelector('button').parentElement.removeChild(parent.querySelector('button'));

            var data = $scope.getDialogFromElement(parent);
            $scope.save(data);

            var template = angular.element('#dialogLearningRowTemplate').html();
            var el = angular.element('.dialog-learning-development-content').prepend($compile(template)($scope));
            el.find('input:first').focus();
        };

        $scope.addInput = function(e)
        {
            var prev = e.currentTarget.previousElementSibling;
            var clone = prev.cloneNode();
            clone.value = '';

            prev.parentElement.insertBefore(clone, e.currentTarget);
            clone.focus();
        };

        $scope.$watch('topicOpened', function(after, before)
        {
            if(after && !before)
            {
                angular.element('.dialog-learning-development-content').addClass('topic-open');
                angular.element('.slide').css('background', '#038eda');
            }
            else
            {
                angular.element('.dialog-learning-development-content').removeClass('topic-open');
                angular.element('.slide').css('background', '');
            }
        });

        $scope.selectTab = function(id)
        {
            angular.element('.tabs1 .select_tab').removeClass('select_tab');
            angular.element('.tabs1 li[data-id="' + id + '"]').addClass('select_tab');
            $scope.getDialogs(id);
        };

        $scope.createTab = function(id, title)
        {
            var template = '<li ng-click="selectTab(\'' + id + '\');" data-id="' + id + '"><a href="#">' + title + '</a></li>';
            angular.element($compile(template)($scope)).insertBefore(angular.element('.tabs1 > li:last'));
        };

        $scope.loadTabs = function(list)
        {
            for(var key in list)
            {
                $scope.createTab(list[key], key);
            }
        };

        $scope.initialize = function()
        {
            //탭 불러오기.
            $scope.loadTabs(user.opendDialogsets);

            $scope.currentDialogsetId = $location.search().dialogsetId || 'default';
            $scope.currentDialogsetTitle = $location.search().dialogsetTitle || 'default';

            // 만약 다이얼로그셋 id가 default라면..
            if($scope.currentDialogsetId == 'default')
                $scope.currentDialogsetId = user.opendDialogsets['default']

            // dialogsetId가 현재 열리지 않았다면.
            if(!user.opendDialogsets.hasOwnProperty($scope.currentDialogsetTitle))
            {
                //저장하고
                user.opendDialogsets[$scope.currentDialogsetTitle] = $scope.currentDialogsetId;
                $cookies.putObject('user', JSON.stringify(user.opendDialogsets));

                //해당 다이얼로그셋 탭 생성.
                $scope.createTab($scope.currentDialogsetId, $scope.currentDialogsetTitle);
            }

            // 탭 셀렉트
            $scope.selectTab($scope.currentDialogsetId);
        };
    })();

    // 현재 사용자가 열어둔 다이얼로그셋을 가져온다.
    if(!user.opendDialogsets)
    {
        user.opendDialogsets = {};
    }
    else
    {
        user.opendDialogsets = JSON.parse(user.opendDialogsets);
    }

    //만약 default가 없다면 생성.
    if(!user.opendDialogsets.hasOwnProperty('default'))
    {
        DialogsetsService.get({ botId: chatbot._id, title: 'default' }, function(dialogset)
        {
            user.opendDialogsets['default'] = dialogset._id;
            $cookies.putObject('user', JSON.stringify(user.opendDialogsets));
            
            $scope.initialize();
        });
    }
    else
    {
        $scope.initialize();
    }
}]);
