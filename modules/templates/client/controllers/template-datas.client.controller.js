(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('templates')
    .controller('TemplateDatasController', TemplateDatasController);

  TemplateDatasController.$inject = ['$scope', '$state', '$stateParams', 'Authentication', 'templateResolve', 'templateDataResolve', '$compile', 'FileUploader', '$window', '$timeout'];

  function TemplateDatasController($scope, $state, $stateParams, Authentication, template, templateData, $compile, FileUploader, $window, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.template = template;
    vm.templateData = templateData;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    function initTemplateData() {
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
      vm.templateData.__content = _templateData;
    }

    initTemplateData();

    /********************* image *********************/
    $scope.imageURL = undefined;
    $scope.error = {};
    $scope.success = {};

    // Create file imageUploader instance
    $scope.imageUploader = new FileUploader({
      url: '/api/user-bots/image-files',
      alias: 'uploadImageFile',
      autoUpload: true
    });

    $scope.imageUploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        if('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1){
          $scope.success.image = null;
          $scope.error['image'] = '이미지 파일이 아니에요'
        }else {
          $scope.error.image = null;
        }
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.imageUploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.imageUploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success['image'] = true;
      vm.templateData.__content.image = '/files/' + response.filename;
      // angular.element('#templateImg').attr("src", vm.templateData.__content.image);
      console.log(vm.templateData);
      // Clear upload buttons
      $scope.cancelImageUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.imageUploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelImageUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadImageFiles = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.imageUploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelImageUpload = function () {
      $scope.imageUploader.clearQueue();
      // $scope.imageURL = $scope.user.profileImageURL;
    };

    /********************* html Rendering *********************/
    //템플릿봇 만들시 스키마에 따라 개별 html 만들기
    angular.element('#templateDataForm').append(
      '<form name="templateDataForm" class="form-horizontal form-bordered" ng-submit="vm.save(templateDataForm.$valid)"novalidate="novalidate">' +
        '<div class="panel-body" id="templateDataGroup">' +
        '</div>' +
        '<footer class="panel-footer">' +
          '<div class="row">' +
            '<div class="col-sm-12 text-center" ng-hide="vm.templateData && vm.templateData._id">' +
              '<button type="submit" class="btn btn-primary">생성</button>' +
              '<button type="button" class="btn btn-danger" ui-sref="template-datas.list">취소</button>' +
            '</div>' +
            '<div class="col-sm-12 text-center" ng-show="vm.templateData && vm.templateData._id">' +
              '<a class="btn btn-primary" ng-click="vm.save(templateDataForm.$valid, templateDataForm)">' +
               '<i class="glyphicon glyphicon-edit"></i> 수정' +
              '</a>' +
              '<a class="btn btn-danger" ng-click="vm.remove()">' +
                '<i class="glyphicon glyphicon-trash"></i> 삭제' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</footer>' +
      '</form>'
    );

    var menuSchema = JSON.parse(vm.template.dataSchema)[$stateParams.listName];
    if(menuSchema){
      vm.schema = menuSchema.schema;
      var element;
      var keys = Object.keys(vm.schema);
      keys.forEach(function (key) {
        element =
          '<div class="form-group" ng-class="{ \'has-success\': templateDataForm.content_'+ key +'.$valid && vm.submitted,\'has-error\': templateDataForm.content_'+ key +'.$invalid && vm.submitted }">' +
            '<label class="col-sm-3 control-label"> ' + vm.schema[key].title +
              '<span class="required" aria-required="true">*</span>' +
            '</label>' +
            '<div class="col-sm-9">';
        if(vm.schema[key].type == "Image"){
          element +=
            '<img data-ng-if="vm.templateData.__content.image" ng-src="{{vm.templateData.__content.image}}" style="width: 100px">' +
            '<input name="content_' + key +'" type="file" nv-file-select uploader="imageUploader">' +
            '<p class="help-block" ng-show="templateDataForm.content_'+ key +'.$error.required && vm.submitted">빈 칸이에요 </p>'+
            '</div>' +
            '</div>'
        }else if (vm.schema[key].type == "Number") {
          element +=
            '<input type="number" name="content_' + key + '" ng-model="vm.templateData.__content.' + key + '"  id="_content" rows="5" class="form-control" placeholder="내용을 입력해 주세요" required="" aria-required="true" aria-invalid="true">' +
            '<p class="help-block" ng-show="templateDataForm.content_'+ key +'.$error.required && vm.submitted">빈 칸이에요 </p>'+
            '<div>' +
            '</div>'
        }else {
          element +=
            '<textarea name="content_' + key +'" ng-model="vm.templateData.__content.' + key + '" class="form-control" placeholder="내용을 입력해 주세요" required="" aria-required="true" aria-invalid="true">' +
            '</textarea>' +
            '<p class="help-block" ng-show="templateDataForm.content_'+ key +'.$error.required && vm.submitted">빈 칸 이에요</p>'+
            '</div>' +
            '</div>'
        }
        angular.element('#templateDataGroup').append(element);
      });
      $compile(document.getElementById('templateDataForm'))($scope);
    }else {
      vm.schema = JSON.parse(template.dataSchema);
      Object.keys(vm.schema).forEach(function (key) {
        if(vm.schema[key].type != "List"){
          var element =
            '<div class="form-group" ng-class="{ \'has-success\': templateDataForm.content_'+ key +'.$valid && vm.submitted,\'has-error\': templateDataForm.content_'+ key +'.$invalid && vm.submitted }">' +
            '<label class="col-sm-3 control-label"> ' + vm.schema[key].title + '' +
            '<span class="required" aria-required="true">*</span>' +
            '</label>' +
            '<div class="col-sm-9">';
          if(vm.schema[key].type == "Image"){
            element +=
              '<img data-ng-if="vm.templateData.__content.image" id="templateImg" ng-src="{{vm.templateData.__content.image}}" style="width: 100px">' +
              '<input name="content_' + key +'" type="file" nv-file-select uploader="imageUploader">' +
              '</div>' +
              '</div>'
          }else if (vm.schema[key].type == "Enum") {
            element +=
              '<div class="btn-group" uib-dropdown is-open="status.isopen" style="width: 100%">' +
              '<button id="single-button" type="button" class="btn btn-default" uib-dropdown-toggle ng-disabled="disabled" style="width: 100%" data-ng-bind="vm.templateData.__content[\''+key + '\']">' +
              '<span class="caret"></span> ' +
              '</button> '+
              '<ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button" style="width: 100%;text-align: center"> ' +
              '<li role="menuitem" ng-repeat="item in vm.schema[\'' + key + '\'].data track by $index" ng-click="vm.templateData.__content[\''+key + '\'] = item">' +
              '<a href="#">{{item}}</a>' +
              '</li> ' +
              '</ul>' +
              '</div>' +
              '</div>' +
              '</div>'
          }else if (vm.schema[key].type == "Time") {
            var start;
            var date = new Date();
            if(typeof vm.templateData.__content[key] == "string") {
              start = vm.templateData.__content[key].split(':');
              date.setHours(start[0], start[1], 0, 0);
              vm.templateData.__content[key] = date;
            }
            element +=
              '<input type="time" name="content_' + key + '" ng-model="vm.templateData.__content.' + key + '"  id="_content" rows="5" class="form-control" placeholder="내용을 입력해 주세요" required="" aria-required="true" aria-invalid="true">' +
              '<div>' +
              '</div>'
          }else if (vm.schema[key].type == "Number") {
            element +=
              '<input type="number" name="content_' + key + '" ng-model="vm.templateData.__content.' + key + '"  id="_content" rows="5" class="form-control" placeholder="내용을 입력해 주세요" required="" aria-required="true" aria-invalid="true">' +
              '<p class="help-block" ng-show="templateDataForm.content_'+ key +'.$error.required && vm.submitted">빈 칸이에요 </p>'+
              '<div>' +
              '</div>'
          }else if (vm.schema[key].type == "String") {
            if(key == "address"){
              var address1 = vm.templateData.__content[key].split(',')[0];
              var address2 = vm.templateData.__content[key].split(',')[1];
              vm.templateData.__content['address1'] = address1;
              vm.templateData.__content['address2'] = address2;
              element +=
                '<div class="col-sm-7" style="padding-left: 0">' +
                  '<input ng-disabled= true ng-model="vm.templateData.__content.address1"  class="form-control" placeholder="내용을 입력해 주세요" required="" aria-required="true" aria-invalid="true">' +
                '</div>'+
                '<div class="col-sm-3">' +
                  '<input name="content_' + key + '" ng-model="vm.templateData.__content.address2"  class="form-control" placeholder="내용을 입력해 주세요" required="" aria-required="true" aria-invalid="true">' +
                  '<p class="help-block" ng-show="templateDataForm.content_'+ key +'.$error.required && vm.submitted">상세 주소를 입력하세요 </p>'+
                '</div>'+
                '<div class="col-sm-2">' +
                  '<a href="#" class="btn btn-default" ng-click="vm.findAddress()">주소 검색</a>'+
                '</div>'+
                '</div>'+
                '</div>';
            }else if(key == "mobile"){
              var mobile = /^\d{2,3}-\d{3,4}-\d{4}$/;
              element +=
                '<input name="content_'+key+'" type="text" ng-pattern = "'+ mobile +'" ng-model="vm.templateData.__content.' + key + '" class="form-control" placeholder="내용을 입력해 주세요" required="" aria-required="true" aria-invalid="true">' +
                '<p class="help-block" ng-show="templateDataForm.content_'+ key +'.$error.required && vm.submitted">핸드폰 번호를 입력하세요 </p>'+
                '<p class="help-block" ng-show="templateDataForm.content_'+ key +'.$error.pattern && vm.submitted">핸드폰 번호 형식이 아니에요 </p>'+
                '<div>' +
                '</div>'
            }else if(key == "phone"){
              var phone = /^\d{2,3}-\d{3,4}-\d{4}$/;
              element +=
                '<input name="content_'+key+'" type="text" ng-pattern = "'+ phone +'" ng-model="vm.templateData.__content.' + key + '" name="junha" class="form-control" placeholder="내용을 입력해 주세요" required="" aria-required="true" aria-invalid="true">' +
                '<p class="help-block" ng-show="templateDataForm.content_'+ key +'.$error.required && vm.submitted">전화번호를 입력하세요 </p>'+
                '<p class="help-block" ng-show="templateDataForm.content_'+ key +'.$error.pattern && vm.submitted">전화번호 형식이 아니에요 </p>'+
                '<div>' +
                '</div>'
            }else {
              element +=
                '<textarea name="content_'+key+'" ng-model="vm.templateData.__content.' + key + '"  id="_content" rows="5" class="form-control" placeholder="내용을 입력해 주세요" required="" aria-required="true" aria-invalid="true">' +
                '</textarea>' +
                '<p class="help-block" ng-show="templateDataForm.content_'+ key +'.$error.required && vm.submitted">핸드폰 번호를 입력하세요 </p>'+
                '<p class="help-block" ng-show="templateDataForm.content_'+ key +'.$error.pattern && vm.submitted">핸드폰 번호 형식이 아니에요 </p>'+
                '<div>' +
                '</div>';
            }
          }
          // element += '</div></div>';
          angular.element('#templateDataGroup').append(element);
        }
      });
      $compile(angular.element("#templateDataForm"))($scope);
      console.log($scope)
    }

    vm.findAddress = function() {
      new daum.Postcode({
        oncomplete: function(data) {
          $scope.$apply(function () {
            vm.templateData.__content['address1'] = data.address;
          });
        }
      }).open();
    };

    // Remove existing Custom action
    function remove() {
      if (confirm('삭제하시겠습니까?')) {
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
    function save(isValid, templateDataForm) {
      console.log(templateDataForm);
      vm.submitted = true;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'templateDataForm');
        return false;
      }
      vm.templateData.templateId = template._id;
      vm.templateData.listName = $stateParams.listName;
      vm.templateData.upTemplateId = $stateParams.upTemplateId;
      if(vm.templateData.__content.address) vm.templateData.__content.address = vm.templateData.__content.address1 + ',' + vm.templateData.__content.address2;
      Object.keys(vm.templateData.__content).forEach(function (key) {
        if(vm.templateData.__content[key] instanceof Date) vm.templateData.__content[key] = vm.templateData.__content[key].getHours().toString() + ':' + vm.templateData.__content[key].getMinutes().toString()
      });

      vm.templateData._content = JSON.stringify(vm.templateData.__content);

      if (vm.templateData._id) vm.templateData.$update(successCallback, errorCallback);
      else                     vm.templateData.$save(successCallback, errorCallback);

      function successCallback(res) {
        if ($stateParams.listName == "null"){
          console.log(res);
          vm.templateData = res;
          initTemplateData();
          alert('수정되었습니다')
        }else {
          $state.go('template-datas.list', {
            templateId: template._id,
            listName : $stateParams.listName,
            upTemplate: vm.templateData.upTemplateId
          }, {reload: true});
        }
      }
      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
