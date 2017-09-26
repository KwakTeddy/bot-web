'use strict';

// angular.module('users')
//   .directive('passwordVerify', [function() {
//     return {
//       require: 'ngModel',
//       scope: {
//         passwordVerify: '='
//       },
//       link: function(scope, element, attrs, ngModel) {
//         var status = true;
//         scope.$watch(function() {
//           var combined;
//           if (scope.passwordVerify || ngModel) {
//             combined = scope.passwordVerify + '_' + ngModel;
//           }
//           return combined;
//         }, function(value) {
//           if (value) {
//             ngModel.$validators.passwordVerify = function (password) {
//               var origin = scope.passwordVerify;
//               return (origin !== password) ? false : true;
//             };
//           }
//         });
//       }
//     };
//   }]);

angular.module('users')
  .directive('equals', [function () {
    return{
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        if(!ngModel) return;

        // watch own value and re-validate on change
        scope.$watch(attrs.ngModel, function() {
          validate();
        });

        // observe the other value and re-validate on change
        attrs.$observe('equals', function (val) {
          validate();
        });

        var validate = function() {
          // values
          var val1 = ngModel.$viewValue;
          var val2 = attrs.equals;
          // set validity
          ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
        };
      }
    }
  }]);

