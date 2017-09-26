(function () {
  'use strict';

  // Banks controller
  angular
    .module('banks')
    .controller('BankSaveController', BankSaveController);

  BankSaveController.$inject = ['$scope', '$state', 'BanksService'];

  function BankSaveController ($scope, $state, BanksService) {
    var vm = this;

    vm.BANKS = [
      {bankName: '신한', bankCode: '88'},
      {bankName: '농협', bankCode: '11'},
      {bankName: '하나', bankCode: '81'},
      {bankName: '우리', bankCode: '20'},
      {bankName: '국민', bankCode: '04'},
      {bankName: '기업', bankCode: '03'},
      {bankName: '대구', bankCode: '31'},
      {bankName: '씨티', bankCode: '27'},
      {bankName: 'SC제일', bankCode: '23'},
      {bankName: '새마을', bankCode: '45'}
    ];

    vm.init = function () {
      BanksService.query({userKey: userKey}, function (banks, err) {
        vm.banks = banks;

        angular.forEach(vm.banks, function (bank) {
          for(var i=0; i<$scope.BANKS.length; i++) {
            if(bank.bankCode == $scope.BANKS[i].bankCode) {
              $scope.BANKS[i] = bank;
              break;
            }
          }
        });
      });
    };
    vm.bank = {};


    vm.error = null;
    vm.form = {};


    vm.selectBank = function (bank) {
      vm.bank = bank;
      vm.bank.userID = null;
      vm.bank.userPassword = null;
    };

    vm.save = function(valid) {
      if(!valid) {
        return;
      }
      if(vm.bank._id) {
        vm.bank.$save({userKey: userKey}, successCallback, errorCallback);
      } else {
        new BanksService(vm.bank).$save({userKey: userKey}, successCallback, errorCallback);
      }

      function successCallback(res) {
        // Close ?
        vm.error = '저장되었습니다. 상단 뒤로가기로 카카오톡으로 돌아가 주세요';
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    // // Remove existing Bank
    // function remove() {
    //   if (confirm('Are you sure you want to delete?')) {
    //     vm.bank.$remove($state.go('banks.list'));
    //   }
    // }
    //
    // // Save Bank
    // function save(isValid) {
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'vm.form.bankForm');
    //     return false;
    //   }
    //
    //   // TODO: move create/update logic to service
    //   if (vm.bank._id) {
    //     vm.bank.$update(successCallback, errorCallback);
    //   } else {
    //     vm.bank.$save(successCallback, errorCallback);
    //   }
    //
    //   function successCallback(res) {
    //     $state.go('banks.view', {
    //       bankId: res._id
    //     });
    //   }
    //
    //   function errorCallback(res) {
    //     vm.error = res.data.message;
    //   }
    // }
  }
})();
