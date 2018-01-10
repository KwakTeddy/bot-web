'use strict';

angular.module('template').controller('restaurantParkController', ['$scope', '$resource', '$cookies', 'FileUploader','$rootScope', function ($scope, $resource, $cookies, FileUploader,$rootScope)
{
    $scope.$parent.changeWorkingGroundName('컨텐츠 관리 > 주차정보관리', '/modules/playchat/gnb/client/imgs/park_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/parks', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);

    $scope.datas = [];
    $scope.findAddress = function(e,index)
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
                    //도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
                    if(fullRoadAddr !== ''){
                        fullRoadAddr += extraRoadAddr;
                    }

                    // 우편번호와 주소 정보를 해당 필드에 넣는다.
                    // document.getElementById('sample4_postcode').value = data.zonecode; //5자리 새우편번호 사용
                    // document.getElementById('sample4_roadAddress').value = fullRoadAddr;
                    // document.getElementById('sample4_jibunAddress').value = data.jibunAddress;
                    //console.log('address=============== : ', fullRoadAddr);

                    //$scope.datas.parkaddress = fullRoadAddr;
                    $scope.datas[index].parkaddress = fullRoadAddr;
                     e.currentTarget.previousElementSibling.value = fullRoadAddr + ' ';
                    e.currentTarget.previousElementSibling.focus();

                    //$scope.datas.parkaddress = fullRoadAddr;
                    // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
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

        $scope.add = function()
        {
            $scope.datas.push({ parkname: '', parksize: '', parkdetails: '', parkaddress: '', parkornot: '' });
        };

        $scope.delete = function(index)
        {
            $scope.datas.splice(index, 1);
            for(var i=0; i<$scope.datas.length; i++)
            {
                delete $scope.datas[i].uploader;
            }

            var datas = JSON.parse(angular.toJson($scope.datas));
            DataService.save({ templateId: $scope.template.id, botId: chatbot.id, datas: datas }, function(result)
                {
                    console.log(result);
                    alert("삭제하였습니다");
                    $rootScope.$broadcast('simulator-build');

                },
                function(err)
                {
                    alert(err);
                });
        };

        $scope.save = function()
        {
            var datas = JSON.parse(angular.toJson($scope.datas));

            console.log('데이터스 : ', datas);

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
