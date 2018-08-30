

angular.module('playchat').controller('BizCsbbsAnalysisController', ['$scope', '$rootScope', 'PagingService','$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope, $rootScope, PagingService, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService) {
}
};


// angular.module('playchat', ['ngRoute'])
//     .factory('BoardService', ['$http', function ($http) {
//         var path = '/bbs/rest/hello/test';
//         var boards = [];
//
//         $http.get(path).success(function (data) {
//             console.log(data);
//             data.forEach(function (board) {
//                 console.log(board);
//                 boards.push(board);
//             });
//         });
//
//         return {
//             boards: boards,
//         };
//     }])
//     .config(function($routeProvider){
//         $routeProvider.when("/",
//             {
//                 templateUrl: "boards.html",
//                 controller: "BoardCtrl",
//                 controllerAs: "board"
//             }
//         )
//             .when('/cookies',
//                 {
//                     template: "NOM NOM NOM NOM"
//                 }
//             )
//             .otherwise({
//                 template: "This route isn't set!"
//             });
//     })
//     .controller('BoardCtrl', ['$scope', 'BoardService',
//         function ($scope, BoardService) {
//             $scope.boards = BoardService.boards;
//             $scope.toggleForm = "Off";
//             $scope.toggle = function() {
//                 $scope.toggleForm = $scope.toggleForm == "On" ? "Off" : "On";
//             }
//         }
//     ])
//     .controller('Login',function($scope) {
//         $scope.loggedIn = "false";
//     })
//     .controller('LoginForm', function($scope, $http) {
//         $scope.loginForm = "login";
//         $scope.setForm = function(mode) {
//             $scope.loginForm = mode;
//         }
//         $scope.register = function() {
//             console.log("wtf");
//             $http({
//                 method: 'POST',
//                 url: '/bbs/rest/hello',
//                 data: {name: "test1", desc: "test2"},
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }});
//         }
//     });
