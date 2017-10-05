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

            // 페이징 옵션 가져오기.
            DialogsPageService.get({ dialogsetId: dialogsetId, countPerPage: countPerPage }, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);

                // 이후 스크롤이 바닥까지 닿으면 다음 50개를 가져와야함.
            });

            // 현재 페이지에 해당하는 데이터 가져오기.
            DialogsService.query({ dialogsetId: dialogsetId, page: page, countPerPage: countPerPage }, function(list)
            {
                $scope.dialogs = list;

                // 로딩 끝.
                $scope.$parent.loaded('working-ground');
            });
        };

        $scope.save = function(data, callback)
        {
            data.dialogset = $scope.currentDialogsetId;

            if(data._id)
            {
                DialogsService.update(data, function(result)
                {
                    console.log('업데이트 : ', result);

                    if(callback)
                        callback(result);
                });
            }
            else
            {
                DialogsService.save(data, function(result)
                {
                    console.log(result);

                    if(callback)
                        callback(result);
                });
            }
        };

        $scope.getDialogFromElement = function(element)
        {
            var inputList = element.querySelectorAll('.question-area input');
            var outputList = element.querySelectorAll('.answer-area input');

            var data = {};
            data.inputRaw = [];
            data.output = [];

            for(var i=0, l=inputList.length; i<l; i++)
            {
                data.inputRaw.push(inputList[i].value);
            }

            for(var i=0, l=outputList.length; i<l; i++)
            {
                data.output.push(outputList[i].value);
            }

            return data;
        };

        $scope.addDialog = function(e)
        {
            // 파란색 입력창에서 add 버튼을 클릭하면 입력내용 저장하고 해당 element를 아래로 내린다.

            // 회색 입력창은 add버튼이 필요 없으므로 add 버튼 삭제.
            var parent = e.currentTarget.parentElement;
            parent.removeChild(parent.querySelector('.new-dialog-title'));
            parent.querySelector('button').parentElement.removeChild(parent.querySelector('button'));

            // 삭제 버튼 활성화
            var deleteButton = parent.querySelector('.functions-area img');
            deleteButton.style.display = 'inline';

            // input과 output 데이터 가져와서 저장.
            var data = $scope.getDialogFromElement(parent);
            $scope.save(data, function(dialog)
            {
                // 삭제버튼 handling
                deleteButton.addEventListener('click', function(e)
                {
                    $scope.deleteDialog(dialog, { currentTarget: deleteButton });
                });
            });

            // 새로 템플릿에서 element를 가져와서 파란색 입력창을 만들어낸다.
            var template = angular.element('#dialogLearningRowTemplate').html();
            var el = angular.element('.dialog-learning-development-content').prepend($compile(template)($scope));
            el.find('input:first').focus();
        };

        // 각 input에서 중앙 plus 버튼 클릭시 호출.
        $scope.addInput = function(e)
        {
            // 현재 element의 clone을 만들고 현재 element 이전으로 집어넣으면 완성.
            var prev = e.currentTarget.previousElementSibling;
            var clone = prev.cloneNode();
            clone.value = '';

            prev.parentElement.insertBefore(clone, e.currentTarget);
            clone.focus();
        };

        $scope.deleteDialog = function(dialog, e)
        {
            if(confirm('정말 삭제하시겠습니까'))
            {
                DialogsService.delete({ dialogsetId: dialog._id }, function(err, result)
                {
                    var target = e.currentTarget.parentElement.parentElement.parentElement;
                    target.parentElement.removeChild(target);
                });
            }
        };

        $scope.checkModify = function(e)
        {
            // input에 포커스가 들어오면 이후 저장 전 비교를 위해 기존값을 저장한다.
            e.currentTarget.prevValue = e.currentTarget.value;
        };

        var printSavedImage = function(element)
        {
            //saved 이미지 출력
            element.querySelector('.saving-img').style.display = 'none';
            element.querySelector('.saved-img').style.display = 'inline';

            setTimeout(function()
            {
                //saved 이미지 삭제
                element.querySelector('.saved-img').style.display = 'none';
                element.querySelector('.delete-img').style.display = 'inline';
            }, 1000);
        };

        var printSavingImage = function(element)
        {
            element.querySelector('.saving-img').style.display = 'inline';
            element.querySelector('.saved-img').style.display = 'none';
            element.querySelector('.delete-img').style.display = 'none';
        };

        $scope.watchModified = function(type, e)
        {
            // 사용자의 타이핑으로 실제 값이 달라졌을때 진행.
            if(e.currentTarget.prevValue != e.currentTarget.value)
            {
                //사용자가 계속 타이핑하면 timeout 초기화
                if(e.currentTarget.watchTimeout)
                    clearTimeout(e.currentTarget.watchTimeout);

                //saving 이미지 출력
                var element = e.currentTarget.parentElement.parentElement.parentElement;
                printSavingImage(element);

                e.currentTarget.watchTimeout = setTimeout(function()
                {
                    // 타이핑을 멈추고 1초가 지나면 저장.
                    $scope.saveModified(type, e);
                }, 1000);
            }
        };

        $scope.saveModified = function(type, e)
        {
            // 만약 타이핑중 tab을 눌러서 blur처리가 되면 바로 저장.
            if(e.currentTarget.watchTimeout)
                clearTimeout(e.currentTarget.watchTimeout);

            var element = e.currentTarget.parentElement.parentElement.parentElement;

            //만약 값이 변동이 없다면 저장하지 않음.
            if(e.currentTarget.prevValue == e.currentTarget.value)
            {
                return;
            }

            var data = $scope.getDialogFromElement(element);
            data._id = element.getAttribute('data-id');

            $scope.save(data, function()
            {
                //saved 이미지 출력
                printSavedImage(element);

                // 기존값을 현재값으로 바꾼다.
                e.currentTarget.prevValue = e.currentTarget.value;
            });
        };

        $scope.$watch('topicOpened', function(after, before)
        {
            // 토픽부분 접기 펼치기
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
            angular.element('.dialog-learning-development-content input:first').focus();
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
                //쿠기는 string밖에 저장이 안되서 부득이하게
                user.opendDialogsets = JSON.stringify(user.opendDialogsets);
                $cookies.putObject('user', user);
                user.opendDialogsets = JSON.parse(user.opendDialogsets);

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

            //쿠기는 string밖에 저장이 안되서 부득이하게
            user.opendDialogsets = JSON.stringify(user.opendDialogsets);
            $cookies.putObject('user', user);
            user.opendDialogsets = JSON.parse(user.opendDialogsets);
            
            $scope.initialize();
        });
    }
    else
    {
        $scope.initialize();
    }
}]);
