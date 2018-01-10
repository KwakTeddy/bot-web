'use strict';

angular.module('playchat').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', '$rootScope', '$stateParams', '$cookies', '$timeout', function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, $rootScope, $stateParams, $cookies, $timeout)
{
    $scope.$parent.loading = false;

    // var vm = this;
    // $scope.authentication = Authentication;
    // $scope.popoverMsg = PasswordValidator.getPopoverMsg();
    // $scope.credentials = {};
    // $scope.error = $location.search().err;
    //
    // console.log("AuthenticationController");
    //
    // var stingParser = $state.current.name;
    // var parsedString = stingParser.split('.');
    // if (parsedString[0] == 'user-bots-web') {
    //   $scope.passwordForgot = 'user-bots-web.password.forgot';
    //   $scope.authenticationSignup = 'user-bots-web.authentication.signup';
    //   $scope.authenticationSignin = 'user-bots-web.authentication.signin';
    //
    // } else {
    //   $timeout(function () {
    //     // document.getElementById('sidebar-left').style.display = 'none';
    //     // document.getElementById('chat-include').style.display = 'none';
    //     // document.getElementById('log-button').style.display = 'none';
    //     // document.getElementById('intent-button').style.display = 'none';
    //   });
    //   $scope.passwordForgot = 'password.forgot';
    //   $scope.authenticationSignup = 'authentication.signup';
    //   $scope.authenticationSignin = 'authentication.signin';
    // }
    // $timeout(function () {
    //   document.getElementById("main").style.setProperty("margin", 0, "important")
    // });
    //
    // // If user is signed in then redirect back home
    //   console.log($scope.authentication.user, $cookies.get("login"));
    // if ($scope.authentication.user || $cookies.get("login")) {
    //     if ($window.__CONFIG.platform == 'mobile'){
    //         $state.go('homeMobile')
    //     }else {
    //         if(window.location.href.indexOf('developer') > -1){
    //           $state.go('developer-home')
    //         }else {
    //             if($state.previous){
    //                 $state.go($state.previous.state.name || 'chatbots', $state.previous.params);
    //             }
    //             else {
    //                 $state.go('chatbots');
    //             }
    //        }
    //     }
    // }
    //
    // $scope.signup = function (isValid) {
    //
    //   if ($scope.authentication.user) {
    //       if ($window.__CONFIG.platform == 'mobile'){
    //           $state.go('homeMobile')
    //       }else {
    //           if(window.location.href.indexOf('developer') > -1){
    //             $state.go('developer-home')
    //           }else {
    //             $state.go($state.previous.state.name || 'chatbots', $state.previous.params);
    //           }
    //       }
    //   }
    //   $scope.error = {};
    //   $scope.submitted = true;
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'userForm');
    //     return false;
    //   }
    //   document.getElementById('loading-screen').style.setProperty("display", "block", "important");
    //   console.log('transferServerTime')
    //
    //   $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
    //       console.log(response);
    //     if ($window.__CONFIG.platform == 'mobile'){
    //         var alertPopup = $ionicPopup.alert({
    //             title: '반가워요 ' + $scope.credentials.username + '님!',
    //             template: '회원가입이 되었어요. <br> 하지만 ' + $scope.credentials.email + '에서 <br> 메일 인증을 하셔야돼요'
    //         });
    //
    //         alertPopup.then(function(res) {
    //             console.log(res);
    //             $scope.credentials = {};
    //             $state.go('homeMobile');
    //         });
    //     } else {
    //         document.getElementById('loading-screen').style.setProperty("display", "none", "important");
    //         var modalInstance = $uibModal.open({
    //             templateUrl: 'modules/users/client/views/authentication/email.confirm.modal.html',
    //             backdrop: 'static',
    //             scope: $scope
    //         });
    //         $scope.close = function () {
    //             modalInstance.dismiss();
    //             if(window.location.href.indexOf('developer') > -1){
    //               $state.go('developer-home')
    //             }else {
    //               $state.go($state.previous.state.name || 'chatbots', $state.previous.params);
    //             }
    //         };
    //         $scope.resend = function () {
    //             modalInstance.dismiss();
    //             var modalInstanceSecond = $uibModal.open({
    //                 templateUrl: 'modules/users/client/views/authentication/email.confirm.resend.modal.html',
    //                 scope: $scope
    //             });
    //
    //
    //             $http.post('/api/auth/signin', {resendEmail: $scope.credentials.email}).success(function (response) {
    //                 console.log(response);
    //                 modalInstanceSecond.result.then(function (response) {
    //                     console.log(response);
    //                 });
    //                 if(window.location.href.indexOf('developer') > -1){
    //                   $state.go('developer-home')
    //                 }else {
    //                   $state.go($state.previous.state.name || 'chatbots', $state.previous.params);
    //                 }
    //
    //             }).error(function (response) {
    //                 console.log(response)
    //             })
    //         };
    //         modalInstance.result.then(function (response) {
    //             console.log(response);
    //         });
    //     }
    //
    //   }).error(function (response) {
    //     document.getElementById('loading-screen').style.setProperty("display", "none", "important");
    //     console.log(response);
    //     if(response.message.match('가입되어 있는 E-mail이네요')){
    //       $scope.error.email = response.message;
    //     } else if(response.message.match('SNS')) {
    //       $scope.error.email = response.message;
    //     } else if(response.message.match('Failure sending email')) {
    //       $scope.error.email = '회원가입은 되었지만 E-mail 인증 메일 보내기에 실패했어요. 관리자에게 문의해주세요.'
    //     } else if(response.message.match('valid email')){
    //       $scope.error.email = '유효한 형식의 이메일이 아니에요'
    //     }
    //   });
    // };
    //
    // var stingParser = $state.current.name;
    // var parsedString = stingParser.split('.');
    //
    // $scope.privacy = function () {
    //   var modalInstance = $uibModal.open({
    //       templateUrl: 'modules/users/client/views/authentication/signup.client.privacy.view.html',
    //       scope: $scope
    //   });
    //   modalInstance.result.then(function (response) {
    //       console.log(response);
    //   });
    //   $scope.close = function () {
    //     modalInstance.dismiss();
    //   }
    // };
    //
    // $scope.signin = function (isValid) {
    //   $scope.error = null;
    //   $scope.submitted = true;
    //
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'userForm');
    //     return false;
    //   }
    //   $http.post('/api/auth/signin?redirect_to=' + encodeURIComponent($state.previous.href), $scope.credentials).success(function (response) {
    //     $scope.authentication.user = response;
    //     $cookies.putObject('user', response);
    //     $cookies.put('login', true);
    //     if ($window.__CONFIG.platform == 'mobile'){
    //         $rootScope.closeSigninModal();
    //         $state.go($state.previous.state.name || 'homeMobile', $state.previous.params);
    //     }else {
    //       if(window.location.href.indexOf('developer') > -1) $state.go('developer-home');
    //       else                                               $state.go($state.previous.state.name || 'chatbots', $state.previous.params);
    //     }
    //   }).error(function (response) {
    //     console.log(response);
    //     $scope.error = response.message;
    //     if (response.message.match('E-mail 확인절차')){
    //       if ($window.__CONFIG.platform == 'mobile'){
    //           // An elaborate, custom popup
    //           var myPopup = $ionicPopup.show({
    //               template: '회원가입은 했지만<br> ' + $scope.credentials.email + ' 메일 인증을 안하셨어요. <br> 인증 메일을 다시 받으시려면 재전송 버튼을 눌러주세요.',
    //               title: 'E-mail 인증이 안됐어요ㅠㅠ',
    //               // subTitle: 'Please use normal things',
    //               scope: $scope,
    //               buttons: [
    //                   { text: 'Cancel' },
    //                   {
    //                       text: '<b>재전송</b>',
    //                       type: 'button-positive',
    //                       onTap: function(e) {
    //                           $state.go('homeMobile');
    //                           $rootScope.closeSigninModal();
    //                           $http.post('/api/auth/signin', {resendEmail: $scope.credentials.email}).success(function (response) {
    //                               var alertPopup = $ionicPopup.alert({
    //                                   title: '인증메일 재발송',
    //                                   template: '인증 메일을 재발송 했어요. <br>' + $scope.credentials.email + '에서 확인해주세요'
    //                               });
    //
    //                               alertPopup.then(function(res) {
    //                                   console.log(res);
    //                               });
    //                               $scope.credentials = {};
    //                           }).error(function (response) {
    //                               console.log(response)
    //                           });
    //                       }
    //                   }
    //               ]
    //           });
    //
    //           // $timeout(function() {
    //           //     myPopup.close(); //close the popup after 3 seconds for some reason
    //           // }, 3000);
    //       } else {
    //           var modalInstance = $uibModal.open({
    //               templateUrl: 'modules/users/client/views/authentication/email.confirm.modal.html',
    //               scope: $scope
    //           });
    //           modalInstance.result.then(function (response) {
    //               console.log(response);
    //           });
    //           $scope.close = function () {
    //             console.log(window.location.href);
    //             modalInstance.dismiss();
    //             if(window.location.href.indexOf('developer') > -1){
    //               $state.go('developer-home')
    //             }else {
    //               $state.go($state.previous.state.name || 'chatbots', $state.previous.params);
    //             }
    //           };
    //           $scope.resend = function () {
    //               modalInstance.dismiss();
    //               var modalInstanceSecond = $uibModal.open({
    //                   templateUrl: 'modules/users/client/views/authentication/email.confirm.resend.modal.html',
    //                   scope: $scope
    //               });
    //               $http.post('/api/auth/signin', {resendEmail: $scope.credentials.email}).success(function (response) {
    //                   console.log(response);
    //                   modalInstanceSecond.result.then(function (response) {
    //                       console.log(response);
    //                   });
    //                   if(window.location.href.indexOf('developer') > -1){
    //                     $state.go('developer-home')
    //                   }else {
    //                     $state.go($state.previous.state.name || 'chatbots', $state.previous.params);
    //                   }
    //
    //               }).error(function (response) {
    //                   console.log(response)
    //               })
    //           };
    //       }
    //     }
    //   });
    // };
    // $scope.closeSigninModal = function () {
    //   $rootScope.closeSigninModal();
    //   // $state.go('homeMobile')
    //     $ionicSideMenuDelegate.toggleLeft(true);
    // };
    // $scope.closeEmailConfirmModal = function () {
    //   $rootScope.closeEmailConfirmModal();
    //   // $state.go('homeMobile')
    //   $ionicSideMenuDelegate.toggleLeft(true);
    // };
    // $scope.openSignup = function () {
    //   $rootScope.closeSigninModal();
    //   $state.go('authenticationMobile.signup');
    // };
    // $scope.openForgotPassword = function () {
    //   $rootScope.closeSigninModal();
    //   $state.go('mobilePassword.forgot');
    // };
    //
    //
    // // OAuth provider request
    // $scope.callOauthProvider = function (url) {
    //   if ($state.previous && $state.previous.href) {
    //     url += '?redirect_to=' + encodeURIComponent($state.previous.href);
    //   }
    //   if (window.location.href.indexOf('developer') > -1){
    //     url += '?redirect_to=/developer';
    //   }
    //   $window.location.href = url;
    // };
    //

}]);
