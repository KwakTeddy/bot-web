'use strict';

var currentInput;
var currentNode;

var setInput = function(cur) {
  currentInput = cur;
  currentNode = cur.replace(/_/g,'.');
};


// Bots controller
angular.module('bots').controller('BotController', [
  '$resource', '$scope', '$state', '$window', '$timeout', '$compile', '$stateParams', 'botResolve', 'TemplatesService', 'FileUploader', 'dialogsetsResolve',
  function ($resource, $scope, $state, $window, $timeout, $compile, $stateParams, bot, TemplatesService, FileUploader, dialogsetsResolve) {
    var vm = this;
    vm.bot = bot;
    vm.dialogSets= dialogsetsResolve;

    console.log(vm.bot);

    // Create new Bot
    vm.create = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');
        return false;
      }

      // default settings
      vm.bot.isMakeFile = true;
      vm.bot.using = true;

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

    //connect dialogset to bot

    vm.dialogsetsConnect = function (target) {
      if (!vm.bot.dialogsets){
        vm.bot['dialogsets'] = [];
      }
      vm.bot.dialogsets.push(target._id);
      vm.bot.$update(function (response) {
        vm.bot = response;
        target.use = true;

      }, function (err) {
        console.log(err);
      })
    };

    vm.dialogsetsDisconnect = function (target) {
      var index = vm.bot.dialogsets.indexOf(target._id);
      if (index > -1) {
        vm.bot.dialogsets.splice(index, 1);
      }
      console.log(vm.bot);
      vm.bot.$update(function (response) {
        target.use = false;
        vm.bot = response;
      }, function (err) {
        console.log(err);
      })
    };

    /********************* template *********************/

    var editor;
    vm.templates = TemplatesService.query({}, function(templates){
      if (vm.bot.templateId) {
        for (var i=0; i < templates.length; ++i) {
          if (templates[i]._id === vm.bot.templateId) {
            vm.selectTemplate(templates[i]);
          }
        }
      }
    });

    vm.unselectTemplate = function() {
      vm.selectedTemplate = undefined;
      if (editor)
        editor.destroy();
    };

    var types = {
      "string": {"type":"string"},
      "date" : {"type":"string", "format":"date"},
      "datetime" : {"type":"string", "format":"datetime"},
      "time" : {"type":"string", "format":"time"},
      "number" : {"type":"string", "format":"number"},
      "image" : {
        "type":"string",
        "format":"image",
        /*
         "readonly":"true",
         "links": [
         {
         "href":"{{self}}",
         "mediaType":"image",
         }
         ]
         */
      },
    };

    vm.parseSchema = function(dataSchema) {
      var jsonSchema;
      try {
        jsonSchema = JSON.parse(dataSchema);
      } catch(e) {
        alert("invalid schema" + e.message);
        return;
      }


      var schema = {};

      Object.keys(jsonSchema).forEach(function(key) {
        //TODO
        if (jsonSchema[key].hidden) return;
        var type = jsonSchema[key].type.toLowerCase();
        if (types[type]) {
          schema[key] = types[type];
        } else {
          switch (type) {
            case "enum":
              schema[key] = {type:"string", enum:jsonSchema[key].data};
              break;
            case "list":
              schema[key] = {type:"array", items:{ type:"object", "properties": vm.parseSchema(jsonSchema[key].schema) }};
              break;
            default:
              console.log("unknown type: " + type + "in template schema:" + jsonSchema);
              break;
          }
        }
      });
      return schema;
    };

    vm.selectTemplate = function(template) {
      vm.selectedTemplate = template;

      // init json editor
      JSONEditor.defaults.options.theme = 'bootstrap3';
      JSONEditor.defaults.options.iconlib= 'fontawesome4';

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
        //format: "grid",
      };

      schema.properties = vm.parseSchema(template.dataSchema);


      if (editor) {
        editor.destroy();
      }

      editor = new JSONEditor(document.getElementById('editor_holder'), {
        schema: schema,
        disable_collapse: true,
        disable_properties: true,
      });

      $compile(document.getElementById('editor_holder'))($scope);
      if (vm.bot.templateId === template._id) {
        editor.setValue(vm.bot.templateData);
      }

      editor.on('change', function() {
        $compile(document.getElementById('editor_holder'))($scope);
        $scope.ierror = {};
        $scope.isuccess = {};

      });
    };

    /********************* image *********************/
    //$scope.imageURL = undefined;

    // Create file imageUploader instance
    $scope.jsonImageUploader = new FileUploader({
      url: '/api/bots/image-files',
      alias: 'uploadImageFile',
      autoUpload: true
    });

    var setValue = function(value) {
      //document.getElementById(currentInput).value = value;
      editor.getEditor(currentNode).setValue(value);
    };

    $scope.jsonImageUploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        if('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1) {
          $scope.isuccess[currentInput] = null;
          $scope.ierror[currentInput] = true;
          setValue('');
        }
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.jsonImageUploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            //$scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.jsonImageUploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.ierror[currentInput] = null;
      $scope.isuccess[currentInput] = true;

      setValue(response.filename);
      // Clear upload buttons
      $scope.cancelImageUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.jsonImageUploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelImageUpload();
      setValue('');

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadImageFiles = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.jsonImageUploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelImageUpload = function () {
      $scope.jsonImageUploader.clearQueue();
      // $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);
