'use strict';

angular.module('playchat.working-ground').controller('DialogLearningDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', 'ModalService', 'PagingService', function ($window, $scope, $resource, $cookies, $location, $compile, ModalService, PagingService)
{
    var DialogsetsService = $resource('/api/:botId/dialogsets/findbytitle', { botId: '@botId' });
    var DialogsService = $resource('/api/dialogsets/:dialogsetId/dialogs/:dialogsId', { dialogsetId: '@dialogset', dialogsId: '@dialogsId' }, { update: { method: 'PUT' } });

    //UI Data
    $scope.topicOpened = false;

    var chatbot = $cookies.getObject('chatbot');
    var user = $cookies.getObject('user');
    var openDialogsets = $cookies.getObject('openDialogsets');
    var currentPage = 1;

    //UI Handling
    (function()
    {
        angular.element('.dialog-learning-development-content input:first').focus();

        $scope.search = function(e)
        {
            if(e.keyCode == 13)
            {
                currentPage = 1;
                $scope.getDialogs($scope.currentDialogsetId, e.currentTarget.value);
            }
            else if(e.keyCode == 8)
            {
                //backspace
                if(e.currentTarget.value.length == 1)
                {
                    $scope.getDialogs($scope.currentDialogsetId);
                }
            }
        };

        var countPerPage = $location.search().countPerPage || 50;

        $scope.getDialogs = function(dialogsetId, rawText)
        {
            // 현재 페이지에 해당하는 데이터 가져오기.
            DialogsService.query({ dialogsetId: dialogsetId, page: currentPage, countPerPage: countPerPage, rawText: rawText }, function(list)
            {
                $scope.dialogs = list;
                console.log(list);

                // 로딩 끝.
                $scope.$parent.loaded('working-ground');
            });
        };

        $scope.$on('working-ground-scroll-bottom', function(e)
        {
            // 다음 페이지에 해당하는 내용 가져오기.
            angular.element('.more-progress').css('opacity', 1);
            DialogsService.query({ dialogsetId: $scope.currentDialogsetId, page: currentPage+1, countPerPage: countPerPage, rawText: rawText }, function(list)
            {
                angular.element('.more-progress').css('opacity', 0);
                if(list.length > 0)
                {
                    currentPage++;
                    for(var i=0, l=list.length; i<l; i++)
                    {
                        $scope.dialogs.push(list[i]);
                    }
                }
            });
        });

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
            var deleteButton = parent.querySelector('.functions-area .delete-img');
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

        $scope.inputKeydown = function(e)
        {
            console.log('어이 : ', e.keyCode);
            var event = e.originalEvent;
            if(e.keyCode == 13 && (event.ctrlKey || event.metaKey))
            {
                console.log(e.currentTarget.parentElement.parentElement.parentElement.previousElementSibling);
                var blur = ' ng-keyup="watchModified(\'output\', $event)" ng-blur="saveModified(\'input\', $event)"';
                if(!e.currentTarget.parentElement.parentElement.parentElement.previousElementSibling)
                    blur = '';

                var input = '<input type="text" class="data-input" ng-keydown="inputKeydown($event);" value="" ng-focus="checkModify($event);"' + blur + '>';

                angular.element($compile(input)($scope)).insertBefore(e.currentTarget.nextElementSibling).focus();


                // e.currentTarget.parentElement.insertBefore(clone, e.currentTarget.nextElementSibling);
            }
        };

        $scope.deleteDialog = function(dialog, e)
        {
            if(confirm('정말 삭제하시겠습니까'))
            {
                DialogsService.delete({ dialogsetId: dialog.dialogset, dialogsId: dialog._id }, function(err, result)
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
            angular.element(element).find('.functions-area img').hide();
            element.querySelector('.saved-img').style.display = 'inline';

            setTimeout(function()
            {
                //delete 이미지 출력
                angular.element(element).find('.functions-area img').hide();
                element.querySelector('.delete-img').style.display = 'inline';
            }, 1000);
        };

        var printSavingImage = function(element)
        {
            angular.element(element).find('.functions-area img').hide();
            element.querySelector('.saving-img').style.display = 'inline';
        };

        var printEditingImage = function(element)
        {
            angular.element(element).find('.functions-area img').hide();
            element.querySelector('.editing-img').style.display = 'inline';
        };

        $scope.watchModified = function(type, e)
        {
            // 사용자의 타이핑으로 실제 값이 달라졌을때 진행.
            if(e.currentTarget.prevValue != e.currentTarget.value)
            {
                //사용자가 계속 타이핑하면 timeout 초기화
                if(e.currentTarget.watchTimeout)
                    clearTimeout(e.currentTarget.watchTimeout);

                //editing 이미지 출력
                var element = e.currentTarget.parentElement.parentElement.parentElement;
                printEditingImage(element);

                e.currentTarget.watchTimeout = setTimeout(function()
                {
                    // 타이핑을 멈추고 1초가 지나면 저장.
                    // printSavingImage(element); 너무 빨라서 의미가 없다.
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
        
        $scope.isArray = function(item)
        {
            if((typeof item == 'Array' || typeof item == 'object') && item.length)
            {
                return true;
            }
            else
            {
                return false;
            }
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

        $scope.selectTab = function(id, title)
        {
            angular.element('.tabs1 .select_tab').removeClass('select_tab');
            angular.element('.tabs1 li[data-id="' + id + '"]').addClass('select_tab');
            $scope.getDialogs(id);
            angular.element('.dialog-learning-development-content input:first').focus();

            $location.search('dialogsetId', id);
            $location.search('dialogsetTitle', title);
        };

        $scope.createTab = function(id, title)
        {
            var template = '<li ng-click="selectTab(\'' + id + '\', \'' + title + '\');" data-id="' + id + '"><a href="#">' + title + '</a></li>';
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
            $scope.loadTabs(openDialogsets);

            $scope.currentDialogsetId = $location.search().dialogsetId || 'default';
            $scope.currentDialogsetTitle = $location.search().dialogsetTitle || 'default';

            // 만약 다이얼로그셋 id가 default라면..
            if($scope.currentDialogsetId == 'default')
                $scope.currentDialogsetId = openDialogsets['default']

            // dialogsetId가 현재 열리지 않았다면.
            if(!openDialogsets.hasOwnProperty($scope.currentDialogsetTitle))
            {
                //저장하고
                openDialogsets[$scope.currentDialogsetTitle] = $scope.currentDialogsetId;
                //쿠기는 string밖에 저장이 안되서 부득이하게
                $cookies.putObject('openDialogsets', JSON.stringify(openDialogsets));

                //해당 다이얼로그셋 탭 생성.
                $scope.createTab($scope.currentDialogsetId, $scope.currentDialogsetTitle);
            }

            var title = '';
            for(var key in openDialogsets)
            {
                if(openDialogsets[key] == $scope.currentDialogsetId)
                {
                    title = key;
                    break;
                }
            }
            // 탭 셀렉트
            $scope.selectTab($scope.currentDialogsetId, title);
        };
    })();

    // 현재 사용자가 열어둔 다이얼로그셋을 가져온다.
    if(!openDialogsets)
    {
        openDialogsets = {};
    }
    else
    {
        openDialogsets = JSON.parse(openDialogsets);
    }

    //만약 default가 없다면 생성.
    if(!openDialogsets.hasOwnProperty('default'))
    {
        DialogsetsService.get({ botId: chatbot._id, title: 'default' }, function(dialogset)
        {
            openDialogsets['default'] = dialogset._id;

            //쿠기는 string밖에 저장이 안되서 부득이하게
            $cookies.putObject('openDialogsets', JSON.stringify(openDialogsets));

            $scope.initialize();
        });
    }
    else
    {
        $scope.initialize();
    }
}]);
