(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('restaurants')
    .controller('MenusController', MenusController);

  MenusController.$inject = ['$scope', '$state', 'Authentication', 'menuResolve'];

  function MenusController($scope, $state, Authentication, menus) {
    var vm = this;

    vm.authentication = Authentication;
    // vm.restaurant = restaurant;
    vm.error = null;
    vm.form = {};
    // vm.remove = remove;
    vm.save = save;
    vm.onKeyPress = onKeyPress;

    vm.menus = menus;

    if(vm.menus._menus == undefined || vm.menus._menus.length == 0) {
      vm.menus._menus = {
        name: '', price: '', options: {'': {'': ''}}, additions: {'': ''}
      };

      // vm.menus._menus = [
      //   {name: '후라이드치킨', price: 10000, options: {'': {'': 0}}, additions: {'무많이': 1000, '소스추가': 500}},
      //   {name: '양념치킨', price: 20000, options: {'선택': {'순살': 17000, '비순살': 18000}}, additions: {'': 0}}
      // ];
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.restaurantForm');
        return false;
      }

      // TODO: move create/update logic to service
      // if (vm.menus._id) {
        vm.menus.$update(successCallback, errorCallback);
      // } else {
      //   vm.menus.$save(successCallback, errorCallback);
      // }

      function successCallback(res) {
        $state.go('menu.list', {
          restaurantId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


    function onKeyPress(event) {
      // event.ctrlKey &&
      if(event.keyCode == 40 ) {    // DOWN
        vm.menus._menus.push({
          name: '', price: '', options: {'': {'': ''}}, additions: {'': ''}
        });
      }
    }
  }
})();


function merge(source1, source2){
  if(!source1 && !source2) return undefined;
  else if(!source1 && source2) return source2;
  else if(source1 && !source2) return source1;

  for (var attrname in source2) {
    if(!source1[attrname]) {
      if (source2[attrname].constructor==Object) {
        source1[attrname] = clone(source2[attrname]);
      } else {
        source1[attrname] = source2[attrname];
      }
    }
  }

  return source1;
};

function clone(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return obj;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};
