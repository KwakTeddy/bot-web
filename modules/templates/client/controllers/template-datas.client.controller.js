(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('templates')
    .controller('TemplateDatasController', TemplateDatasController);

  TemplateDatasController.$inject = ['$scope', '$state', '$stateParams', 'Authentication', 'templateResolve', 'templateDataResolve'];

  function TemplateDatasController($scope, $state, $stateParams, Authentication, template, templateData) {
    var vm = this;

    vm.authentication = Authentication;
    vm.template = template;
    vm.templateData = templateData;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    try {
      if($stateParams.listName == 'null') {
        vm.schema = JSON.parse(template.dataSchema);
        vm.lists = [];
        Object.keys(vm.schema).forEach(function(key,index) {
          if(vm.schema[key].type == 'List') {
            vm.schema[key]._key = key;
            vm.lists.push(vm.schema[key]);
          }
        });
      }

    } catch(e) {
      console.log(e);
    }

    var _templateData = {};
    _templateData = Object.assign(_templateData, vm.templateData);
    delete _templateData._id;
    delete _templateData.templateId;
    delete _templateData.listName;
    delete _templateData.upTemplateId;
    delete _templateData.$promise;
    delete _templateData.$resolved;
    delete _templateData['__v'];

    vm.templateData._content = JSON.stringify(_templateData);

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.templateData.templateId = template._id;
        vm.templateData.listName = $stateParams.listName;
        vm.templateData.upTemplateId = $stateParams.upTemplateId;

        vm.templateData.$remove($state.go('template-datas.list'), {
          templateId: vm.templateData.templateId,
          listName : vm.templateData.listName,
          upTemplate: vm.templateData.upTemplateId
        }, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.templateDataForm');
        return false;
      }

      vm.templateData.templateId = template._id;
      vm.templateData.listName = $stateParams.listName;
      vm.templateData.upTemplateId = $stateParams.upTemplateId;

      if (vm.templateData._id) {
        vm.templateData.$update(successCallback, errorCallback);
      } else {
        vm.templateData.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('template-datas.list', {
          templateId: vm.templateData.templateId,
          listName : vm.templateData.listName,
          upTemplate: vm.templateData.upTemplateId
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
