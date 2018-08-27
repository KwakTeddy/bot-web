'use strict';

angular.module('playchat').controller('DialogLearningDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$rootScope', 'LanguageService', 'ModalService', 'FileUploader', function ($window, $scope, $resource, $cookies, $location, $compile, $rootScope, LanguageService, ModalService, FileUploader)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > ' + LanguageService('Dialog Learning'), '/modules/playchat/gnb/client/imgs/speech.png');

    var chatbot = $cookies.getObject('chatbot');

    var DialogsetsFindService = $resource('/api/:botId/dialogsets/findbytitle', { botId: '@botId' });
    var DialogSetsService = $resource('/api/:botId/dialogsets/:dialogsetId', { botId: '@botId', dialogsetId: '@dialogsetId' }, { update: { method: 'PUT' } });
    var DialogsService = $resource('/api/dialogsets/:dialogsetId/dialogs/:dialogsId', { dialogsetId: '@dialogset', dialogsId: '@dialogsId', language: chatbot.language }, { update: { method: 'PUT' } });

    //UI Data
    $scope.topicOpened = false;

    var user = $cookies.getObject('user');
    var openDialogsets = $cookies.getObject('openDialogsets');
    var currentPage = 1;

    $scope.myBotAuth = chatbot.myBotAuth;

    $scope.openModal = {
        isOpened: false,
        data: {}
    };

    $scope.importModal = {
        isOpened: false,
        data: {}
    };

    $scope.newAnswerInputCount = 1;
    $scope.newQuestionInputCount = 1;

    //UI Handling
    (function()
    {
        angular.element('.dialog-learning-development-content input:first').focus();

        $scope.$on('focusToDialogSet', function()
        {
            angular.element('.dialog-learning-development-content textarea:first').focus();
        });

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
                for(var i=0; i<list.length; i++)
                {
                    if(list[i].category)
                    {
                        list[i].category = list[i].category.split('@@@');
                        $scope.topicOpened = true;
                    }
                }

                $scope.dialogs = list;

                angular.element('textarea:first').focus();

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
                        if(list[i].category)
                        {
                            list[i].category = list[i].category.split('@@@');
                        }

                        $scope.dialogs.push(list[i]);
                    }
                }
            });
        });

        $scope.save = function(data, callback)
        {
            if(!$scope.myBotAuth.edit)
            {
                return alert(LanguageService('You do not have permission to edit this bot'));
            }

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
                    if(callback)
                        callback(result);
                });
            }

            angular.element('.new-dialog-title+form .question-area').find('textarea').each(function(index)
            {
                if(index > 0)
                {
                    $(this).remove();
                }
            });

            angular.element('.new-dialog-title+form .answer-area').find('textarea').each(function(index)
            {
                if(index > 0)
                {
                    $(this).remove();
                }
            });

            // $rootScope.$broadcast('simulator-build');
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
                if(inputList[i].value)
                    data.inputRaw.push(inputList[i].value);
            }

            for(var i=0, l=outputList.length; i<l; i++)
            {
                if(outputList[i].value)
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

                angular.element('textarea:first').focus();
            });
        };

        $scope.addInputElement = function(e, type)
        {
            var check = false;
            angular.element(e.currentTarget.parentElement).find('.textarea-wrapper > textarea').each(function()
            {
                if(!this.value)
                {
                    check = true;
                    this.focus();
                }
            });

            if(!check)
            {
                if(type == 'answer')
                {
                    $scope.newAnswerInputCount++;
                }
                else if(type == 'question')
                {
                    $scope.newQuestionInputCount++;
                }

                // 현재 element의 clone을 만들고 현재 element 이전으로 집어넣으면 완성.
                var target = angular.element(e.currentTarget.parentElement).find('.textarea-wrapper:last').get(0);
                angular.element($compile(target.outerHTML)($scope)).insertAfter(target).find('textarea').val('').focus().removeAttr('required');
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

        $scope.inputKeydownElement = function(e, type)
        {
            var event = e.originalEvent;

            if(e.keyCode == 13)
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
                    if(event.shiftKey)
                    {
                        //multi
                        angular.element($compile(e.currentTarget.parentElement.outerHTML)($scope)).insertAfter(e.currentTarget.parentElement).find('textarea').val('').focus();

                        if(type == 'inputRaw')
                        {
                            $scope.newQuestionInputCount++;
                        }
                        else if(type == 'output')
                        {
                            $scope.newAnswerInputCount++;
                        }

                        e.preventDefault();
                        e.stopPropagation();
                    }
                    else if(event.ctrlKey || event.metaKey)
                    {
                        $scope.addDialog({ currentTarget : angular.element(e.currentTarget).parent().parent().get(0) });
                    }
                }
            }
            else if(e.keyCode == 40)
            {
                var target = angular.element('.dialog-learning-development-content-row').get(1);
                if(target)
                {
                    if(type == 'inputRaw')
                    {
                        angular.element(target).find('.question-area textarea:first').focus();
                    }
                    else if(type == 'output')
                    {
                        angular.element(target).find('.answer-area textarea:first').focus();
                    }
                }
            }
            else if(e.keyCode == 45)
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
                    if(type == 'inputRaw')
                    {
                        $scope.newQuestionInputCount++;
                    }
                    else if(type == 'output')
                    {
                        $scope.newAnswerInputCount++;
                    }

                    // 현재 element의 clone을 만들고 현재 element 이전으로 집어넣으면 완성.
                    var target = angular.element(e.currentTarget.parentElement).find('textarea:last').get(0);
                    angular.element($compile(target.outerHTML)($scope)).insertAfter(target).val('').focus();
                }
            }
            else if(e.keyCode == 46)
            {
                if(e.shiftKey)
                {
                    angular.element(e.currentTarget).parent().prev().find('textarea').focus();
                    angular.element(e.currentTarget).parent().remove();

                    if(type == 'inputRaw')
                    {
                        $scope.newQuestionInputCount--;
                    }
                    else if(type == 'output')
                    {
                        $scope.newAnswerInputCount--;
                    }
                }
            }
        };

        $scope.inputKeydown = function(e, dialog, type, current)
        {
            var event = e.originalEvent;
            if(e.keyCode == 13) //Enter
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
                    if(event.ctrlKey || event.metaKey)
                    {
                        //여기는 어차피 편집하면 저장이 되는 구조임.
                    }
                    else if(event.shiftKey)
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
                            angular.element(e.currentTarget.parentElement.parentElement).find('textarea:last').focus();
                        }, 10);

                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }
            else if(e.keyCode == 38)//윗 방향키
            {
                var target = angular.element(e.currentTarget).parent().parent().parent().parent().prev().get(0);
                if(target)
                {
                    if(type == 'inputRaw')
                    {
                        angular.element(target).find('.question-area textarea:first').focus();
                    }
                    else if(type == 'output')
                    {
                        angular.element(target).find('.answer-area textarea:first').focus();
                    }
                }
            }
            else if(e.keyCode == 40) //아래 방향키
            {
                var target = angular.element(e.currentTarget).parent().parent().parent().parent().next().get(0);
                if(target)
                {
                    if(type == 'inputRaw')
                    {
                        angular.element(target).find('.question-area textarea:first').focus();
                    }
                    else if(type == 'output')
                    {
                        angular.element(target).find('.answer-area textarea:first').focus();
                    }
                }
            }
            else if(e.keyCode == 46) //Delete
            {
                if(e.shiftKey)
                {
                    if(dialog.inputRaw.length > 1)
                    {
                        var form = e.currentTarget.parentElement.parentElement.parentElement;
                        var index = dialog.inputRaw.indexOf(current);
                        dialog.inputRaw.splice(index, 1);

                        setTimeout(function()
                        {
                            $scope.saveModified(type, e, form);
                        }, 100);
                    }
                    else if(dialog.inputRaw.length == 1)
                    {
                        if(confirm($scope.lan('Are you sure you want to delete this item?')))
                        {
                            DialogsService.delete({ dialogsetId: dialog.dialogset, dialogsId: dialog._id, botId: chatbot.id }, function(err, result)
                            {
                                var index = $scope.dialogs.indexOf(dialog);
                                $scope.dialogs.splice(index, 1);
                            });
                        }
                    }
                }
            }
            else if(e.keyCode == 45) //Insert
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

                    setTimeout(function()
                    {
                        angular.element(e.currentTarget.parentElement.parentElement).find('textarea:last').focus();
                    }, 50);
                }
            }
            else
            {
                console.log(e.keyCode);
            }
        };

        $scope.deleteInput = function(dialogs, index)
        {
            dialogs.splice(index, 1);
        };

        $scope.deleteNewInput = function(e, type)
        {
            angular.element(e.currentTarget.parentElement).remove();
            if(type == 'answer')
            {
                $scope.newAnswerInputCount--;
            }
            else if(type == 'question')
            {
                $scope.newQuestionInputCount--;
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

                    var index = $scope.dialogs.indexOf(dialog);
                    $scope.dialogs.splice(index, 1);

                    // $rootScope.$broadcast('simulator-build');
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
                angular.element(element).find('.delete-img').show();
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

        $scope.saveModified = function(type, e, isDelete)
        {
            // 만약 타이핑중 tab을 눌러서 blur처리가 되면 바로 저장.
            if(e.currentTarget.watchTimeout)
                clearTimeout(e.currentTarget.watchTimeout);

            //만약 값이 변동이 없다면 저장하지 않음.
            if(e.currentTarget.prevValue == e.currentTarget.value && !isDelete)
            {
                return;
            }

            var element = undefined;

            if(isDelete)
                element = isDelete;
            else
                element = e.currentTarget.parentElement.parentElement.parentElement;

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
        
        $scope.selectTab = function(dialogset)
        {
            $scope.currentDialogsetId = dialogset._id;
            $scope.currentDialogsetTitle = dialogset.title;
            $scope.getDialogs($scope.currentDialogsetId);
        };

        $scope.initialize = function()
        {
            //탭 불러오기.
            // $scope.loadTabs(openDialogsets[chatbot.id]);

            $scope.currentDialogsetId = $location.search().dialogsetId || 'default';
            $scope.currentDialogsetTitle = $location.search().dialogsetTitle || 'default';

            DialogSetsService.query({ botId: chatbot._id }, function(list)
            {
                $scope.dialogsetList = list;

                $scope.$parent.loaded('working-ground');

                if($scope.currentDialogsetId == 'default')
                {
                    for(var i=0; i<list.length; i++)
                    {
                        if(list[i].title == 'default')
                        {
                            $scope.currentDialogsetId = list[i]._id;
                            $scope.getDialogs($scope.currentDialogsetId);
                            break;
                        }
                    }
                }
                else
                {
                    $scope.getDialogs($scope.currentDialogsetId);
                }
            },
            function(err)
            {
                alert(err);
            });
        };
    })();

    DialogsetsFindService.get({ botId: chatbot._id, title: 'default' }, function(dialogset)
    {
        if(!dialogset.title)
        {
            DialogSetsService.save({ botId: chatbot._id, title: 'default', language: chatbot.language, usable: true }, function(dialogset)
            {
                $rootScope.$broadcast('simulator-build');
                $scope.initialize();
            },
            function(err)
            {
                if(err.status == 401)
                {
                    $scope.initialize();
                }
                else
                {
                    alert(err.data.error || err.data.message);
                }
            });
        }
        else
        {
            $scope.initialize();
        }
    });

    (function()
    {
        var importModal = new ModalService('importModal', $scope);
        importModal.setOpenCallback(function()
        {
            setTimeout(function()
            {
                angular.element('.dialogset-title').focus();
            }, 100);
        });

        $scope.openVideo = function(e)
        {
            $cookies.put('openVideoDialogSet', 'true');

            var target = e.currentTarget;
            angular.element(target).hide().prev().show().prev().show();
        };

        $scope.closeVideo = function(e)
        {
            $cookies.put('openVideoDialogSet', 'false');

            var target = e.currentTarget;
            angular.element(target).parent().hide().next().hide().next().show();
        };

        var isOpen = $cookies.get('openVideoDialogSet');
        if(!isOpen || isOpen == 'true')
        {
            angular.element('.video-popup > div').show();
            angular.element('.video-popup > img').hide();
            angular.element('.video-wrapper').hide();
            setTimeout(function()
            {
                angular.element('.video-wrapper').show('slow');
            }, 1000);
        }
        else
        {
            angular.element('.video-popup > div').hide();
            angular.element('.video-popup > img').show();
        }

        $scope.isOpenVideoPopup = false;
        $scope.openVideoPopup = function()
        {
            $scope.isOpenVideoPopup = true;
        };

        $scope.closeVideoPopup = function()
        {
            $scope.isOpenVideoPopup = false;
        };
    })();

    $scope.lan = LanguageService;
}]);
