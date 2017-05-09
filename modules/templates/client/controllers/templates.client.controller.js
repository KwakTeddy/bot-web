(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('templates')
    .controller('TemplatesController', TemplatesController);

  TemplatesController.$inject = ['$scope', '$state', 'Authentication', 'templateResolve'];

  function TemplatesController($scope, $state, Authentication, template) {
    var vm = this;

    vm.authentication = Authentication;
    vm.template = template;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.categorys = [
      '요식업', '숙박여행', '의료건강', '교육', '뷰티', '온라인쇼핑', '오픈마켓', '비지니스'
    ];

    // create the editor
    var container = document.getElementById("jsoneditor");
    var options = {name: vm.template.id, sortObjectKeys: true, mode: 'tree'};
    var editor = new JSONEditor2(container, options);
    if(vm.template.dataSchema){
      vm.template.dataSchema = JSON.parse(vm.template.dataSchema);
      editor.set(vm.template.dataSchema);
    }

    vm.toTree = function () {
      editor.destroy();
      options.mode = 'tree';
      editor = new JSONEditor2(container, options);
      console.log(editor);
      editor.set(vm.template.dataSchema);
    };

    vm.toText = function () {
      editor.destroy();
      options.mode = 'text';
      editor = new JSONEditor2(container, options);
      console.log(editor);
      editor.set(vm.template.dataSchema);
    };

    vm.toCode = function () {
      editor.destroy();
      options.mode = 'code';
      editor = new JSONEditor2(container, options);
      editor.set(vm.template.dataSchema);
      var ad =document.getElementsByClassName('jsoneditor-poweredBy')[0];
      ad.parentNode.removeChild(ad)
    };

    vm.toForm = function () {
      editor.destroy();
      editor = new JSONEditor2(container, {mode: 'form'});
      console.log(editor);
      editor.set(vm.template.dataSchema);
    };

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.template.$remove($state.go('templates.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.templateForm');
        return false;
      }
      vm.template.dataSchema = editor.get();
      vm.template.dataSchema = JSON.stringify(vm.template.dataSchema);
      // TODO: move create/update logic to service
      if (vm.template._id) {
        vm.template.$update(successCallback, errorCallback);
      } else {
        vm.template.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('templates.list', {
          templateId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        console.log(res);
        vm.error = res.data.message;
      }
    }
  }
})();
