'use strict';

angular.module('template').controller('hotelRoomController', ['$scope', '$resource', '$cookies', 'FileUploader','$rootScope', function ($scope, $resource, $cookies, FileUploader,$rootScope)
{
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/rooms', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);

    $scope.datas = [];

    (function()
    {
        $scope.getList = function()
        {
            ChatbotTemplateService.get({ templateId: chatbot.templateId._id }, function(result)
                {
                    $scope.template = result;

                    DataService.query({ templateId: result.id, botId: chatbot.id }, function(list)
                        {
                            $scope.datas = list;
                            console.log(list);
                            for(var i=0; i<list.length; i++)
                            {
                                addUploader(i);
                            }
                        },
                        function(err)
                        {
                            alert(err);
                        });
                },
                function(err)
                {
                    alert(err);
                });
        };

        var addUploader = function(index)
        {
            $scope.datas[index].uploader = new FileUploader({
                url: '/api/' + chatbot.id + '/template-contents/upload',
                alias: 'uploadImage',
                autoUpload: true
            });

            $scope.datas[index].uploader.onErrorItem = function(item, response, status, headers)
            {
            };

            $scope.datas[index].uploader.onSuccessItem = function(item, response, status, headers)
            {
                $scope.datas[index].room_image = response.url;
            };

            $scope.datas[index].uploader.onProgressItem = function(fileItem, progress)
            {
                angular.element('.form-box-progress').css('width', progress + '%');
            };
        };

        $scope.editImage = function(e)
        {
            angular.element(e.currentTarget).next().click();
        };

        $scope.add = function()
        {
            $scope.datas.push({category_name: '',room_form: '',room_kind: '',room_bed: '',room_size: '',room_checkin: '',room_checkout: '',room_price: '',room_facility1: '',room_facility2: '',room_facility3: '',room_facility4: '',room_facility5: '',room_facility6: '',room_facility7: '',room_introduction: '', uploader: undefined });
            addUploader($scope.datas.length-1);
        };

        $scope.delete = function(index)
        {
            $scope.datas.splice(index, 1);
        };

        $scope.save = function()
        {
            for(var i=0; i<$scope.datas.length; i++)
            {
                delete $scope.datas[i].uploader;
            }

            var datas = JSON.parse(angular.toJson($scope.datas));
            DataService.save({ templateId: $scope.template.id, botId: chatbot.id, datas: datas }, function(result)
                {
                    console.log(result);
                    alert("저장하였습니다");
                    $rootScope.$broadcast('simulator-build');
                },
                function(err)
                {
                    alert(err);
                });
        };
    })();

    $scope.getList();
}]);
