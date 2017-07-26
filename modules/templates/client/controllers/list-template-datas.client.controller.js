(function () {
  'use strict';

  angular
    .module('templates')
    .controller('TemplateDatasListController', TemplateDatasListController);

  TemplateDatasListController.$inject = ['$scope', '$state', '$stateParams', 'templateDatasResolve', 'templateResolve','DTOptionsBuilder', 'DTColumnBuilder', '$timeout', '$compile', '$http', '$cookies'];

  function TemplateDatasListController($scope, $state, $stateParams, templateDatas, template, DTOptionsBuilder, DTColumnBuilder, $timeout, $compile, $http, $cookies) {
    var vm = this;
    var dataSchema;
    if (typeof JSON.parse(template.dataSchema)[$stateParams.listName].schema == "string") dataSchema = JSON.parse(JSON.parse(template.dataSchema)[$stateParams.listName].schema);
    else dataSchema = JSON.parse(template.dataSchema)[$stateParams.listName].schema;
    $scope.botId = $cookies.get('default_bot');
    vm.dtColumns = [ ];
    var keys = Object.keys(dataSchema);
    keys.forEach(function (key) {
      var html;
      vm.dtColumns.push(
        DTColumnBuilder.newColumn(key, dataSchema[key].title).renderWith(function(data, type, full) {
          if(data) {
            if(key == 'image') html = '<img src="' + data + '" style="width: 100px">';
            else html = data;
            return html
          }
          else return null
        })
      );
      // if(key == 'image'){
      //   vm.dtColumns.push(
      //     DTColumnBuilder.newColumn(key, dataSchema[key].title).renderWith(function(data, type, full) {
      //       if(data) {
      //         return '<img src="' + data + '" style="width: 100px">'
      //       }
      //       else return null
      //     })
      //   )
      // }else {
      //   vm.dtColumns.push(
      //     DTColumnBuilder.newColumn(key, dataSchema[key].title).renderWith(function(data, type, full) {
      //       if(data) return data;
      //       else return null
      //     })
      //   )
      // }
    });
    vm.dtColumns.push(
      DTColumnBuilder.newColumn(null).withTitle('관리').notSortable() 
        .renderWith(function(data, type, full, meta) { 
          return '<button style="width: 100%" class="btn btn-default" data-ui-sref="template-datas.edit({templateDataId: \'' + data._id + '\'})">' + '수정' + '</button>' 
        })
    );

    vm.dtOptions = DTOptionsBuilder.newOptions() 
      .withFnServerData(serverData) 
      .withDataProp("data") 
      .withOption('processing', true) 
      .withOption('serverSide', true) 
      .withDisplayLength(10) 
      .withOption('bLengthChange', false) 
      .withOption('info', false) 
      .withOption('dom', 'l<"toolbar">frtip') 
      .withOption('initComplete', function(settings, json) { 
        $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search'); 
        $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope); 
        $compile(angular.element('#' + settings.sTableId).contents())($scope); 
      });

    function serverData(sSource, aoData, fnCallback, oSettings) {
      var search = undefined;
      var sortDir = aoData[2].value[0].dir;
      var sortCol = aoData[1].value[aoData[2].value[0].column].data;
      var sort = {target: sortCol, dir: sortDir};
      if(aoData[0].value == 1) {
        sortDir = 'asc';
        sortCol = 'created';
      }
      var url ='/api/template-datas/' + $stateParams.templateId + '/' + $stateParams.listName + '/' + $stateParams.upTemplateId + '?sortDir=' +sortDir+ '&sortCol=' + sortCol;
      if(aoData[5].value.value) {
        search = aoData[5].value.value;
        url += '&search=' + search;
      }
      $http({
        method: 'GET',
        url: url
      })
        .then(function(result) {
          var records = {
            'draw': aoData[0].value,
            'recordsTotal': result.data.length,
            "recordsFiltered": result.data.length,
            "data": result.data
          };
          $timeout(function () {
            $compile(angular.element('#dt').contents())($scope);
          });
          fnCallback(records);
        });
    }

    vm.templateDatas = templateDatas;
  }
})();
