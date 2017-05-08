(function () {
  'use strict';

  angular
    .module('intents')
    .controller('IntentsListController', IntentsListController);

  IntentsListController.$inject = ['intentsResolve', '$cookies', '$http'];

  function IntentsListController(intents, $cookies, $http) {
    var vm = this;

    vm.intents = intents;
    vm.bot = '';

    $http.get('/api/bots/byNameId/' + $cookies.get('default_bot')).then(function (result) {
      console.log(result.data);
      vm.bot = result.data;
    }, function (err) {
      console.log(err);
    });
  }
})();
