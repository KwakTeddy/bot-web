(function()
{
    'use strict';
    angular.module('playchat').controller('UserProfileController', ['$window', '$http','$scope', '$resource', '$cookies', '$rootScope', 'LanguageService', function ($window,$http, $scope, $resource, $cookies, $rootScope, LanguageService)
    {
        $scope.$parent.loading = false;

        var user = $cookies.getObject('user');
        $scope.user = user;
        console.log("user: " + JSON.stringify($scope.user));

        (function()
        {
            $scope.getList = function () {
                // var bizKindOfBusiness = document.getElementById("bizKindOfBusiness");
                // if(bizKindOfBusiness.options[bizKindOfBusiness.selectedIndex].text !== "업종을 선택하세요."){
                //     $scope.credentials.bizKindOfBusiness = bizKindOfBusiness.options[bizKindOfBusiness.selectedIndex].text;
                // }else{
                //     $scope.credentials.bizKindOfBusiness = '';
                // }



               //  if($scope.user.bizKindOfBusiness === ""){
               //      $scope.user.bizKindOfBusiness = "업종을 선택하세요.";
               //  }
               //
               //  if($scope.user.bizChair === ""){
               //      $scope.user.bizChair = "직책";
               // }

                $scope.password = '';
                $scope.passwordConfirm = '';
                console.log("bizKindOfBusiness: " + $scope.user.bizKindOfBusiness);
            };

            $scope.save = function()
            {
                if($scope.password && $scope.passwordConfirm)
                {
                    if($scope.password != $scope.passwordConfirm)
                    {
                        return alert(LanguageService('Password is disaccord'));
                    }
                    else{
                        $scope.user.password = $scope.password;
                    }
                }
                else
                {
                    $scope.password = '';
                }

                if($scope.user.bizKindOfBusiness === "업종을 선택하세요." ){
                    $scope.user.bizKindOfBusiness = "";
                }

                if($scope.bizChair === "직책"){
                    $scope.user.bizChair = "";
                }

                $http.post('/api/users/updateBizAuthUser', $scope.user).success(function (response)
                {
                    $window.location.href = '/playchat/development/create-bot';
                    $cookies.putObject('user', user);
                    $rootScope.$broadcast('changeLanguage');

                    alert(LanguageService('Has been applied'));
                }).error(function (response)
                {
                    console.log(response);
                    alert(response);
                })
            };

        })();

        $scope.lan = LanguageService;
        $scope.getList();
    }]);

})();
