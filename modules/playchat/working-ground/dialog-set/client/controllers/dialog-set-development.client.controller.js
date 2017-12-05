'use strict';

angular.module('playchat').controller('DialogLearningDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$rootScope', 'ModalService', 'PagingService', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, $compile, $rootScope, LanguageService)
{
    $scope.$parent.changeWorkingGroundName('Development > Dialog Learning', '/modules/playchat/gnb/client/imgs/speech.png');

    var DialogsetsFindService = $resource('/api/:botId/dialogsets/findbytitle', { botId: '@botId' });
    var DialogSetsService = $resource('/api/:botId/dialogsets/:dialogsetId', { botId: '@botId', dialogsetId: '@dialogsetId' }, { update: { method: 'PUT' } });
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
            DialogsService.query({ dialogsetId: dialogsetId, page: currentPage, countPerPage: countPerPage, rawText: rawText, botId: chatbot.id }, function(list)
            {
                $scope.dialogs = list;

                // 로딩 끝.
                $scope.$parent.loaded('working-ground');
            });
        };

        $scope.$on('working-ground-scroll-bottom', function(e)
        {
            // 다음 페이지에 해당하는 내용 가져오기.
            angular.element('.more-progress').css('opacity', 1);
            DialogsService.query({ dialogsetId: $scope.currentDialogsetId, page: currentPage+1, countPerPage: countPerPage, rawText: angular.element('#search').val(), botId: chatbot.id }, function(list)
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
            data.botId = chatbot.id;

            if(data._id)
            {
                DialogsService.update(data, function(result)
                {
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

            $rootScope.$broadcast('simulator-build');
        };

        $scope.getDialogFromElement = function(element)
        {
            var inputList = element.querySelectorAll('.question-area textarea');
            var outputList = element.querySelectorAll('.answer-area textarea');

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
            var parent = e.currentTarget.parentElement;
            var data = $scope.getDialogFromElement(parent);
            $scope.save(data, function(dialog)
            {
                angular.element(parent).find('textarea').val('');
                $scope.dialogs.unshift(dialog);
            });
        };

        $scope.addInputElement = function(e)
        {
            var check = false;
            angular.element(e.currentTarget.parentElement).find('textarea').each(function()
            {
                if(!this.value)
                {
                    check = true;
                    this.focus();
                }
            });

            if(!check)
            {
                // 현재 element의 clone을 만들고 현재 element 이전으로 집어넣으면 완성.
                var target = angular.element(e.currentTarget.parentElement).find('textarea:last').get(0);
                angular.element($compile(target.outerHTML)($scope)).insertAfter(target).val('').focus();
            }
        };

        // 각 input에서 중앙 plus 버튼 클릭시 호출.
        $scope.addInput = function(e, dialog, type)
        {
            var check = false;
            angular.element(e.currentTarget.parentElement).find('textarea').each(function()
            {
                if(!this.value)
                {
                    check = true;
                    this.focus();
                }
            });

            if(!check)
            {
                if(!$scope.isArray(dialog[type]))
                {
                    dialog[type] = [dialog[type], ''];
                }
                else
                {
                    dialog[type].push('');
                }
            }
        };

        $scope.inputKeydownElement = function(e)
        {
            var event = e.originalEvent;
            if(e.keyCode == 13 && (event.ctrlKey || event.metaKey))
            {
                var check = false;
                angular.element(e.currentTarget.parentElement).find('textarea').each(function()
                {
                    if(!this.value)
                    {
                        check = true;
                        this.focus();
                    }
                });

                if(!check)
                {
                    angular.element($compile(e.currentTarget.outerHTML)($scope)).insertAfter(e.currentTarget).val('').focus();
                }
            }
        };

        $scope.inputKeydown = function(e, dialog, type, current)
        {
            var event = e.originalEvent;
            if(e.keyCode == 13 && (event.ctrlKey || event.metaKey))
            {
                var check = false;
                angular.element(e.currentTarget.parentElement).find('textarea').each(function()
                {
                    if(!this.value)
                    {
                        check = true;
                        this.focus();
                    }
                });

                if(!check)
                {
                    if($scope.isArray(dialog[type]))
                    {
                        if(current)
                        {
                            var index = dialog[type].indexOf(current);
                            dialog[type].splice(index + 1, 0, '');
                        }
                        else
                        {
                            dialog[type].push('');
                        }
                    }
                    else
                    {
                        dialog[type] = [dialog[type], ''];
                    }

                    setTimeout(function()
                    {
                        angular.element(e.currentTarget.parentElement).find('textarea:last').focus();
                    }, 10);
                }
            }
        };

        $scope.deleteDialog = function(dialog, e)
        {
            if(confirm($scope.lan('Are you sure you want to delete this item?')))
            {
                DialogsService.delete({ dialogsetId: dialog.dialogset, dialogsId: dialog._id, botId: chatbot.id }, function(err, result)
                {
                    var target = e.currentTarget.parentElement.parentElement.parentElement;
                    target.parentElement.removeChild(target);

                    $rootScope.$broadcast('simulator-build');
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
            data.botId = chatbot.id;

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
            $scope.loadTabs(openDialogsets[chatbot.id]);

            $scope.currentDialogsetId = $location.search().dialogsetId || 'default';
            $scope.currentDialogsetTitle = $location.search().dialogsetTitle || 'default';

            // 만약 다이얼로그셋 id가 default라면..
            if($scope.currentDialogsetId == 'default')
                $scope.currentDialogsetId = openDialogsets[chatbot.id]['default'];

            // dialogsetId가 현재 열리지 않았다면.
            if(!openDialogsets[chatbot.id].hasOwnProperty($scope.currentDialogsetTitle))
            {
                //저장하고
                openDialogsets[chatbot.id][$scope.currentDialogsetTitle] = $scope.currentDialogsetId;
                //쿠기는 string밖에 저장이 안되서 부득이하게
                $cookies.putObject('openDialogsets', JSON.stringify(openDialogsets));

                //해당 다이얼로그셋 탭 생성.
                $scope.createTab($scope.currentDialogsetId, $scope.currentDialogsetTitle);
            }

            var title = '';
            for(var key in openDialogsets[chatbot.id])
            {
                if(openDialogsets[chatbot.id][key] == $scope.currentDialogsetId)
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

    if(!openDialogsets[chatbot.id])
    {
        openDialogsets[chatbot.id] = {};
    }

    DialogsetsFindService.get({ botId: chatbot._id, title: 'default' }, function(dialogset)
    {
        if(!dialogset.title)
        {
            DialogSetsService.save({ botId: chatbot._id, title: 'default', usable: true }, function(dialogset)
            {
                if(!openDialogsets[chatbot.id].hasOwnProperty('default'))
                {
                    openDialogsets[chatbot.id]['default'] = dialogset._id;

                    //쿠기는 string밖에 저장이 안되서 부득이하게
                    $cookies.putObject('openDialogsets', JSON.stringify(openDialogsets));

                    $scope.initialize();
                }
                else
                {
                    $scope.initialize();
                }
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        }
        else
        {
            openDialogsets[chatbot.id]['default'] = dialogset._id;

            //쿠기는 string밖에 저장이 안되서 부득이하게
            $cookies.putObject('openDialogsets', JSON.stringify(openDialogsets));

            $scope.initialize();
        }
    });
    $scope.lan=LanguageService;
}]);
