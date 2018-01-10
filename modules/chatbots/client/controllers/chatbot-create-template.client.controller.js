(function()
{
    'use strict';

    angular.module('playchat').controller('ChatbotCreateTemplateController', ['$scope', '$resource', '$stateParams', '$location', '$compile', '$cookies','FileUploader', 'LanguageService', function ($scope, $resource, $stateParams, $location, $compile, $cookies, FileUploader,LanguageService)
    {
        var ChatbotService = $resource('/api/chatbots');
        var ChatbotTemplatesService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' });
        var ChatbotTemplateDataService = $resource('/api/:botId/template-data', { botId: '@botId' });

        $scope.$parent.loading = false;

        $scope.templateId = $stateParams.templateId;

        var user = $cookies.getObject('user');
        $scope.bot = {
            language: user.language !== undefined ? user.language: 'en'
        };

        var user = $cookies.getObject('user');

        (function()
        {
            if($scope.templateId != 'blank' && $scope.templateId != 'sample')
            {
                ChatbotTemplatesService.get({ templateId: $stateParams.templateId }, function(template)
                {
                    console.log(template);

                    $scope.template = template;

                    angular.element('#templateCreateHtml').html('').append($compile(template.createHtml)($scope));
                },
                function(err)
                {
                    alert(err);
                });
            }

            $scope.findAddress = function(e)
            {
                new daum.Postcode({
                    oncomplete: function(data) {
                        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                        // 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
                        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                        try
                        {
                            var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
                            var extraRoadAddr = ''; // 도로명 조합형 주소 변수

                            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                                extraRoadAddr += data.bname;
                            }
                            // 건물명이 있고, 공동주택일 경우 추가한다.
                            if(data.buildingName !== '' && data.apartment === 'Y'){
                                extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                            }
                            // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                            if(extraRoadAddr !== ''){
                                extraRoadAddr = ' (' + extraRoadAddr + ')';
                            }
                            // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
                            if(fullRoadAddr !== ''){
                                fullRoadAddr += extraRoadAddr;
                            }

                            // 우편번호와 주소 정보를 해당 필드에 넣는다.
                            // document.getElementById('sample4_postcode').value = data.zonecode; //5자리 새우편번호 사용
                            // document.getElementById('sample4_roadAddress').value = fullRoadAddr;
                            // document.getElementById('sample4_jibunAddress').value = data.jibunAddress;

                            e.currentTarget.previousElementSibling.value = fullRoadAddr + ' ';
                            e.currentTarget.previousElementSibling.focus();

                            // // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
                            // if(data.autoRoadAddress) {
                            //     //예상되는 도로명 주소에 조합형 주소를 추가한다.
                            //     var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                            //     document.getElementById('guide').innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
                            //
                            // } else if(data.autoJibunAddress) {
                            //     var expJibunAddr = data.autoJibunAddress;
                            //     document.getElementById('guide').innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';
                            //
                            // } else {
                            //     document.getElementById('guide').innerHTML = '';
                            // }
                        }
                        catch(err)
                        {
                            console.error(err);
                        }
                    }
                }).open();
            };

            $scope.data={};

            var addUploader = function()
            {
                $scope.data.uploader = new FileUploader({
                    url: '/api/' + $scope.bot.id + '/template-contents/upload',
                    alias: 'uploadImage',
                    autoUpload: true
                });

                $scope.data.uploader.onErrorItem = function(item, response, status, headers)
                {
                };

                $scope.data.uploader.onSuccessItem = function(item, response, status, headers)
                {
                    $scope.data.image = response.url;
                };

                $scope.data.uploader.onProgressItem = function(fileItem, progress)
                {
                    angular.element('.form-box-progress').css('width', progress + '%');
                };
            };

            $scope.editImage = function(e)
            {
                angular.element(e.currentTarget).next().click();
            };
            addUploader();
            console.log('-----------------------'+$scope.data.image);


            $scope.save = function()
            {
                if(!$scope.bot.id)
                {
                    $scope.bot.id = 'blank_' + user.username.replace(/\s/gi, '') + '_' + new Date().getTime();
                }

                // if(!$scope.bot.id.match(/^[a-zA-Z]+/))
                // {
                //     return alert($scope.lan('아이디는 영문자 소문자로 시작해야합니다.'));
                // }
                //var data={};
                ChatbotService.save({ id: $scope.bot.id, name: $scope.bot.name, language: $scope.bot.language, description: $scope.bot.description, isSample: $scope.templateId == 'sample' }, function(chatbot)
                {
                    delete chatbot.user;
                    $cookies.putObject('chatbot', chatbot);
                    $location.url('/playchat/?isFirst=true');
                },
                function(err)
                {
                    if(err.data.message == 'Duplicated Bot')
                    {
                        alert(LanguageService('Name is already using'));
                    }
                    else
                    {
                        alert(err.data.error || err.data.message);
                    }
                });
            };

            var getValue = function(target)
            {
                var type = target.getAttribute('type');
                if(type == 'checkbox')
                {
                    return target.checked;
                }
                else
                {
                    return target.value;
                }
            };

            $scope.saveTemplateBot = function(e)
            {

                var data = {};
                angular.element(e.currentTarget).find('*[name]').each(function()
                {
                    var key = $(this).attr('name');

                    if(key.indexOf('.') != -1)
                    {
                        var ref = data;
                        var split = key.split('.');
                        for(var i=0; i<split.length; i++)
                        {
                            if(i < split.length -1 && !ref[split[i]])
                                ref[split[i]] = {};
                            else if(i == split.length-1)
                                ref[split[i]] = getValue(this);

                            ref = ref[split[i]];
                        }
                    }
                    else
                    {
                        data[key] = getValue(this);
                    }
                });

                if(!$scope.data.image)
                {
                    data.image = undefined;
                }
                else
                {
                    data.image=$scope.data.image;
                }

                if(!data.language)
                {
                    data.language = 'ko';
                }

                data.name = angular.element('input[data-bot-name="true"]').val();

                ChatbotService.save({ id: $scope.template.id + '_' + $cookies.getObject('user').username.replace(/\s/gi, '') + '_' + new Date().getTime(), name: data.name, language: data.language, description: data.description, templateId: $scope.template._id, templateDir: $scope.template.id }, function(chatbot)
                {
                    delete chatbot.user;
                    $cookies.putObject('chatbot', chatbot);


                    ChatbotTemplateDataService.save({ templateId: $scope.template.id, botId: chatbot.id, data: data }, function(result)
                    {
                        $location.url('/playchat/?isFirst=true');
                    },
                    function(err)
                    {
                        alert(err.data.error || err.data.message);
                    });
                },
                function(err)
                {
                    if(err.data.message == 'Duplicated Bot')
                    {
                        alert(LanguageService('Name is already using'));
                    }
                    else
                    {
                        alert(err.data.error || err.data.message);
                    }
                });
            };

            $scope.cancel = function()
            {
                location.href = '/playchat/chatbots';
            };


            $scope.lan=LanguageService;
        })();
    }]);
})();
