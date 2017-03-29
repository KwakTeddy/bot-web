'use strict';

// Bots controller
angular.module('bots').controller('BotController', ['$scope', '$state', '$stateParams', 'botResolve', 'TemplatesService',
  function ($scope, $state, $stateParams, bot, TemplatesService) {
    var vm = this;
    vm.bot = bot;

    var editor;

    vm.templates = TemplatesService.query({}, function(templates){
      if (vm.bot.templateId) {
        for (var i=0; i < templates.length; ++i) {
          if (templates[i]._id == vm.bot.templateId) {
            vm.selectTemplate(templates[i]);
          }
        }
      }
    });

    // Create new Bot
    vm.create = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');
        return false;
      }

      if (vm.selectedTemplate) {
        var errors = editor.validate();
        if (errors.length) {
          $scope.$broadcast('show-errors-check-validity', 'botForm');
          return false;
        }
        vm.bot.template = vm.selectedTemplate;
        vm.bot.template.templateData = editor.getValue();
      }

      vm.bot.$save(function (response) {
        $state.go('bots.list');
        // $location.path('bots/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Bot
    vm.remove = function () {
      if (vm.bot && vm.bot._id) {
        vm.bot.$remove(function () {
          $state.go('bots.list');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    // Update existing Bot
    vm.update = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');
        return false;
      }

      if (vm.selectedTemplate) {
        var errors = editor.validate();
        if (errors.length) {
          $scope.$broadcast('show-errors-check-validity', 'botForm');
          return false;
        }
        vm.bot.template = vm.selectedTemplate;
        vm.bot.template.templateData = editor.getValue();
      } else {
        vm.bot.template = null;
      }

      if(vm.bot && vm.bot._id) {
        vm.bot.$update(function () {
          $state.go('bots.list');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    vm.unselectTemplate = function() {
      vm.selectedTemplate = undefined;
      if (editor)
        editor.destroy();
    };

    vm.selectTemplate = function(template) {
      vm.selectedTemplate = template;

      // init json editor
      JSONEditor.defaults.options.theme = 'bootstrap3';
      JSONEditor.defaults.custom_validators.push(function(schema, value, path) {
        var errors = [];
        if (value === "") {
          // Errors must be an object with `path`, `property`, and `message`
          errors.push({
            path: path,
            property: 'format',
            message: 'empty value is not allowed'
          });
        }
        return errors;
      });

      var schema = {
        type: "object",
        title: template.name,
        properties: {},
      };

      var types = {
        "string": {"type":"string"},
        "date" : {"type":"string", "format":"date"},
        "datetime" : {"type":"string", "format":"datetime"},
        "time" : {"type":"string", "format":"time"},
      };

      var dataSchema;
      try {
        dataSchema = eval("dataSchema=" + template.dataSchema);
      } catch(e) {
        alert("invalid schema" + e.message);
        return;
      }

      Object.keys(dataSchema).forEach(function(key) {
        dataSchema[key] = types[dataSchema[key].name.toLowerCase()];
      });
      schema.properties = dataSchema;

      console.log(schema);

      if (editor) {
        editor.destroy();
      }

      editor = new JSONEditor(document.getElementById('editor_holder'), {
        schema: schema,
        disable_collapse: true,
        disable_properties: true,
      });

      if (vm.bot.templateId === template._id) {
        editor.setValue(vm.bot.templateData);
      }

    };

    // // Find a list of Bots
    // $scope.find = function () {
    //   vm.bots = BotsService.query();
    // };
    //
    // // Find existing Bot
    // $scope.findOne = function () {
    //   vm.bot = BotsService.get({
    //     botId: $stateParams.botId
    //   });
    // };
  }
]);
