(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('franchises')
    .controller('FranchiseMenusController', FranchiseMenusController);

  FranchiseMenusController.$inject = ['$scope', '$state', 'Authentication', 'menuResolve'];

  function FranchiseMenusController($scope, $state, Authentication, menus) {
    var vm = this;

    vm.authentication = Authentication;
    // vm.franchise = franchise;
    vm.error = null;
    vm.form = {};
    // vm.remove = remove;
    vm.save = save;
    vm.onKeyPress = onKeyPress;

    vm.menus = menus;

    vm.addMenu = function() {
      vm.menus._menus.push({
        name: '', price: '',
        options: [{optionName: '', optionValues: [{name: '', price: ''}]}],
        additions: [{name: '', price: ''}]
      });
    };
    vm.removeMenu = function(index) {
      vm.menus._menus.splice(index, 1);
    };
    vm.addOptions = function(index) {
      vm.menus._menus[index].options.push({optionName: '', optionValues: [{name: '', price: ''}]});
    };
    vm.removeOptions = function(index, index2) {
      vm.menus._menus[index].options.splice(index2, 1);
    };

    vm.addOptionMenu = function(index, index2) {
      vm.menus._menus[index].options[index2].optionValues.push({name: '', price: ''});
    };
    vm.removeOptionMenu = function(index, index2, index3) {
      vm.menus._menus[index].options[index2].optionValues.splice(index3, 1);
    };

    vm.addAdditionMenu = function(index) {
      vm.menus._menus[index].additions.push({name: '', price: ''});
    };
    vm.removeAdditionMenu = function(index, index2) {
      vm.menus._menus[index].additions.splice(index2, 1);
    };

    if(vm.menus._menus == undefined || vm.menus._menus.length == 0) {
      vm.menus._menus = [];
      vm.addMenu();
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.franchiseForm');
        return false;
      }

      // TODO: move create/update logic to service
      // if (vm.menus._id) {
        vm.menus.$update(successCallback, errorCallback);
      // } else {
      //   vm.menus.$save(successCallback, errorCallback);
      // }

      function successCallback(res) {
        $state.go('franchises.list', {
          franchiseId: res.franchise
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function onKeyPress(event) {
      // event.ctrlKey &&
      if(event.keyCode == 40 ) {    // DOWN
        vm.addMenu();
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
