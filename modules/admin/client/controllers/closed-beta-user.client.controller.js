(function()
{
    'use strict';

    angular.module('playchat').controller('ClosedBetaUserController', ['$scope', '$resource', '$cookies', '$location', function ($scope, $resource, $cookies, $location)
    {
        var ClosedBetaUserService = $resource('/api/admin/users/closed-beta');

        $scope.users = [];

        (function()
        {
            $scope.getUsers = function()
            {
                ClosedBetaUserService.query({}, function(list)
                {
                    console.log(list);
                    $scope.users = list;
                    $scope.$parent.loading = false;
                },
                function(err)
                {
                    alert(err);
                });
            }

            $scope.approve = function(e, user)
            {
                var target = e.currentTarget;
                angular.element(target).hide().next().show();

                ClosedBetaUserService.save({ email: user.email }, function(result)
                {
                    user.state = true;
                    alert('승인완료');
                },
                function(error)
                {
                    angular.element(target).show().next().hide();
                    console.error(error);
                    alert(error);
                });
            };

        })();

        $scope.getUsers();
    }]);
})();
