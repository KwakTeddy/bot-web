angular.module('core').controller('TextExpandController', ['$scope', '$state', 'Authentication', 'Menus', '$cookies', '$http', '$rootScope', 'Socket', '$location', '$window', 'BotsService', '$compile',
function ($scope, $state, Authentication, Menus, $cookies, $http, $rootScope, Socket)
{
    $scope.text = '';
    Socket.on('send_msg_text', function (message)
    {
        $scope.text = message;
        console.log('out:' + message);
    });
}]);
