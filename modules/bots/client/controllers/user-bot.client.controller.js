'use strict';

var currentInput;
var currentNode;

var setInput = function(cur) {
  currentInput = cur;
  currentNode = cur.replace(/_/g,'.');
};

if (_platform !== 'mobile'){
  $(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });

  // UserBots controller
  angular.module('user-bots').controller('UserBotController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams',
    'Authentication', 'userBotResolve', 'FileUploader', 'UserBotsService', 'UserBotCommentService', 'UserBotDialogService',
    'UserBotsFollowService', 'UserBotsGraphService','$http', '$uibModal', 'TemplatesService', '$compile', '$cookies', '$resource',
    function ($scope, $rootScope, $state, $window, $timeout, $stateParams, Authentication, userBot, FileUploader,
              UserBotsService, UserBotCommentService, UserBotDialogService, UserBotsFollowService, UserBotsGraphService,
              $http, $uibModal, TemplatesService, $compile, $cookies, $resource) {
      var vm = this;
      vm.user = Authentication.user;
      vm.userBot = userBot;
      console.log(vm.user);
      console.log(vm.userBot);
      vm.isPublic = true;
      vm.sample = false;
      if ((vm.userBot.id == 'restaurantbot') || (vm.userBot.id == 'athena') || (vm.userBot.id == 'hairshopbot') || (vm.userBot.id == 'massagebot') || (vm.userBot.id == 'nailbot') || (vm.userBot.id == 'order')){
        vm.sample = true;
        vm.videoSrc = '/videos/'+ vm.userBot.id+'.mov'
      }
      if (userBot && userBot._id && !userBot.public) {
        if (userBot.templateData){
          vm.isPublic = true;
        }else {
          if (vm.userBot.dialogsets){
            $resource('/api/dialogueNum/:dialogsets', {}).get({dialogsets: vm.userBot.dialogsets[0]}, function (res) {
              if (res) {
                if (res.count > 100){
                  vm.isPublic = true;
                }else {
                  vm.isPublic = false;
                }
              }
            }, function (err) {
              console.log(err)
            });

          }else {
            vm.isPublic = false;
          }
        }
      } else {
        vm.userBot.public = true;
      }

      vm.isAdmin = function() {
        /*
        for (var i=0; i < vm.user.roles.length; ++i) {
          if (vm.user.roles[i] === "admin")
            return true;
        }
        return false;
        */
        if (vm.user.email === "com2best@gmail.com")
          return true;
        return false;
      };

      vm.findAddress = function() {
        new daum.Postcode({
          oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            // 예제를 참고하여 다양한 활용법을 확인해 보세요.
            //document.getElementsByName("address1")[0].value = data.address;
            $scope.$apply(function () {
              vm.address1 = data.address;
            });
          }
        }).open();
      };

      vm.userId = $rootScope.userId;
      vm.isMine = (vm.userBot.user != null && (vm.user.username === vm.userBot.user.username));
      vm.isLearnable = (vm.userBot.user != null && (vm.userBot.learn || vm.isMine));

      vm.userBot.userFollow = UserBotsFollowService.list({userBot: vm.userBot, botUserId: vm.user._id, check: true}, function(res) {
        if(res.length > 0) vm.userBot.userFollow = true;
        else vm.userBot.userFollow = undefined;
        // console.log(res);
      });
      // UserBotsFollowService.get()
      // if(vm.userBot && vm.userBot._id)
      //   $rootScope.$broadcast('setUserBot', vm.userBot);

      vm.userBotChat = function(userBot) {
        // $scope.$emit('setUserBot', userBot);
        console.log('vm.userBotChat');
        $rootScope.$broadcast('setUserBot', userBot);
      };

      if ($stateParams.noGraph)
        $scope.nograph = true;
      vm.startChat = function() {
        if ($cookies.get("nograph") == undefined && !$scope.nograph) {
          $state.go('user-bots-web.graph', {userBotId: vm.userBot._id});
        } else {
          vm.userBotChat(vm.userBot);
        }
      };

      vm.type = '';
      if($state.is('user-bots-web.create')) {vm.state = 'create'; vm.type = 'edit';}
      else if($state.is('user-bots-web.edit')) {vm.state = 'edit'; vm.type = 'edit';}
      else if ($state.is('user-bots-web.view')) {
        vm.state = 'view';
        vm.type = 'view';
        vm.startChat();
      }

      vm.changeType = function(type) {
        vm.type= type;
        if (vm.type == 'view' && vm.state == 'create')
          vm.startChat();
      };

      vm.followBot = function(userBot) {
        UserBotsFollowService.follow({botUserId: vm.user._id, userBot: userBot._id}, function(result) {
          vm.userBot = result;
          vm.userBot.user = {};
          vm.userBot.user['username'] = vm.user.username;
          vm.userBot.userFollow = true;
          // alert('친구로 추가 되었습니다.')
        });
      };

      vm.unfollowBot = function(userBot) {
        UserBotsFollowService.unfollow({botUserId: vm.user._id, userBot: userBot._id}, function(result) {
          vm.userBot = result;
          vm.userBot.user = {};
          vm.userBot.user['username'] = vm.user.username;
          vm.userBot.userFollow = undefined;
          console.log(result);
          // alert('친구를 취소하였습니다.')
        });
      };

      vm.fbShare = function () {
        $scope.location = location.href;
        FB.ui({
          method: 'share',
          display: 'popup',
          href: $scope.location,
          title: vm.userBot.name,
          description: vm.userBot.description,
          picture: location.protocol+'//'+location.hostname+'/'+ vm.userBot.imageFile,
        }, function(response){
          console.log(response);
        });
      };

      vm.kakaoShare = function () {
        $scope.location = location.href;
        console.log(vm.userBot);
        console.log($scope.location);
        Kakao.Story.share({
          url: $scope.location,
          text: vm.userBot.name+'-'+ vm.userBot.description
        });
      };

      vm.twitterShare = function () {
        $scope.location = location.href;
        window.open('https://twitter.com/intent/tweet?text='+ vm.userBot.name+'-'+ vm.userBot.description + '&url=' + $scope.location, 'popup', 'width=600, height=400')
      };

      // Connect UserBot Dialogue
      vm.modal = function (channel, method) {
        $scope.channel = channel;
        $scope.method = method;
        $scope.userBotId = vm.userBot.id;
        $scope.host = location.protocol + "//" + location.host;

        if ((channel == 'facebook') && (method !== 'easy')){
          $scope.fbLoading = true;
          FB.api('/me/accounts?fields=picture,name,link,access_token,perms', function(response) {
            if (response.error){
              var url = '/api/auth/facebook/page';
              // if ($state.previous && $state.previous.href) {
              //     url += '?redirect_to=' + encodeURIComponent($state.previous.href);
              // }
              // Effectively call OAuth authentication route:
                console.log(url);
              $window.location.href = url;
            } else {
              $scope.fbLoading = false;
              $scope.pageLists = [];
              $scope.pageLists = response.data;
            }
          });
        }
        $scope.close = function () {
          modalInstance.dismiss();
        };
        $scope.connect = function (page) {
          modalInstance.dismiss();
          console.log(page);
          FB.api('/'+page.id +'/subscribed_apps?access_token='+ 'EAAWIPOJg3OsBANXIEBavV3gk3Skr0UtSIqIU5hxGUCMjZA3szbDlJ2l9pEc1AdVZB3ijCdNTNfgnIM0aGPZAQmCG9kGzuc1YXoTY33fWH97Qv4PnNf0lgoWLr1bbVfOYolE0jHzR2fcZAnNVHIDpFPk7ZC6ZCvmA3ExqxtK6OreQZDZD', 'post', function (response) {
            console.log(response);
            if(response){
              var info = {};
              info['user'] = vm.user._id;
              info['userBot'] = vm.userBot._id;
              info['userBotId'] = vm.userBot.id;
              info['page'] = page;
              $http.post('/api/auth/facebook/pageInfo', info, function (err) {
                  if(err) {
                      console.log(err)
                  }
              });
            }
          });
        };
        var modalInstance = $uibModal.open({
          templateUrl: 'modules/bots/client/views/modal-user-bots.client.connect.html',
          scope: $scope
        });
        modalInstance.result.then(function (response) {
          console.log(response);
        })
      };

      if (!vm.userBot || !vm.userBot._id) {
        $scope.$watch('vm.userBot.id', function () {
          $resource('/api/bot-exist', {}).get({bot_id: vm.userBot.id}, function (res) {
            if (res) {
              $scope.error.id = "같은 아이디가 존재합니다";
              return false;
            }
          }, function (err) {
            $scope.error.id = null;
          });
        });
      }

      vm.checkAndChangeType = function(isValid, type) {
        $scope.submitted = true;
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'userBotForm');
          return false;
        }

        if ($scope.error.id)
          return false;
        /*
        if (vm.selectedTemplate) {
          var errors = editor.validate();
          if (errors.length) {
            $scope.$broadcast('show-errors-check-validity', 'userBotForm');
            return false;
          }
        }
        */

        vm.changeType(type);
      };

      vm.getImage = function(template) {
        if (!template.image)
          return "/images/sns/facebook-messenger-android.png";
        return template.image;
      };

      vm.checkTemplate = function() {
        if (vm.selectedTemplate) {
          var errors = editor.validate();
          if (errors.length) {
            editor.options.show_errors = "interactive";
            editor.onChange();
            return false;
          }
          vm.userBot.template = vm.selectedTemplate;
          vm.userBot.template.templateData = editor.getValue();
          console.log(JSON.stringify(vm.userBot.template.templateData));
        } else {
          if (vm.userBot.template) {
            vm.userBot.template = null;
          }
        }
        return true;
      };

      // Create new UserBot
      vm.create = function (isValid) {
        // $scope.error = null;
        $scope.submitted = true;
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'userBotForm');
          return false;
        }

        if ($scope.error.id)
          return false;

        if ($scope.error.file || $scope.error.image){
          var modalInstance = $uibModal.open({
            templateUrl: 'modules/bots/client/views/modal-user-bots.client.error.html',
            scope: $scope
          });
          modalInstance.result.then(function (response) {
            console.log(response);
          });
          return false;
        }
        vm.learning = true;
        if(!vm.userBot.imageFile){
          vm.userBot.imageFile = "/files/default.png"
        }

        if (!vm.checkTemplate()) {
          return false;
        }

        vm.type = 'connect';

        vm.userBot.$save(function (response) {
          vm.learning = false;
          $scope.close = function () {
            modalInstance.dismiss();
          };
          var modalInstance = $uibModal.open({
            templateUrl: 'modules/bots/client/views/modal-user-bots.client.learning.html',
            scope: $scope
          });
          modalInstance.result.then(function (response) {
            console.log(response);
          });

          if($state.is('user-bots-web.create') || $state.is('user-bots-web.edit')) {
            $rootScope.$broadcast('setUserBot', vm.userBot);

            // vm.type = 'connect';
            // $state.go('user-bots-web.list', {'#': 'myBots'});
          } else {
            // vm.type = 'conenct';
            // $state.go('user-bots.list');
          }
          // $location.path('userBots/' + response._id);
          vm.saved = true;
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      // Update existing UserBot
      vm.update = function (isValid) {
        console.log(isValid);
        $scope.error = null;
        $scope.submitted = true;
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'userBotForm');
          return false;
        }

        if (!vm.checkTemplate()) {
          return false;
        }

        console.log(vm.userBot._id);
        vm.type ='connect';
        vm.learning = true;
        if(vm.userBot && vm.userBot._id) {
          vm.userBot.$update(function (response) {
            vm.learning = false;

            var modalInstance = $uibModal.open({
              templateUrl: 'modules/bots/client/views/modal-user-bots.client.learning.html',
              scope: $scope
            });
            modalInstance.result.then(function (response) {
              console.log(response);
            });

            if($state.is('user-bots-web.create') || $state.is('user-bots-web.edit')) {
              $rootScope.$broadcast('resetUserBot', vm.userBot);
            }
            //$state.go('user-bots-web.list', {listType: 'my'});
          }, function (errorResponse) {
            console.log(errorResponse);
            $scope.error = errorResponse.data.message;
          });
        }
      };

      vm.graph = function() {
        UserBotsGraphService.update({userBotId: vm.userBot._id }, function(err, result) {
          console.log("graph updated");
        });
      };

      // Remove existing UserBot
      vm.remove = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'modules/bots/client/views/modal-user-bots.client.remove.html',
          scope: $scope
        });
        $scope.delete = function () {
          if (vm.userBot && vm.userBot._id) {
            vm.userBot.$remove(function () {
              $state.go('user-bots-web.list', {listType: 'my'});
            }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
            });
          }
        };
        $scope.close = function () {
          modalInstance.dismiss();
        }
      };

      /********************* template *********************/
      vm.editType = 'start';
      if (vm.userBot && vm.userBot._id) {
        vm.editType = 'file';
        if (vm.userBot.templateId) {
          vm.editType = 'template';
        }
      }
      vm.setEditType = function(type) { vm.editType = type; };
      var editor;
      vm.restaurantBusinessTemplates = [];
      vm.accommodationTemplates = [];
      vm.medicalTemplates = [];
      vm.eduTemplates = [];
      vm.beautyTemplates = [];
      vm.onlineShoppingTemplates = [];
      vm.openMarketTemplates = [];
      vm.businessTemplates = [];
      TemplatesService.query({}, function(templates){
        for(var i = 0; i < templates.length; i++){
          if (templates[i].category && templates[i].category.name == '요식업') {
            vm.restaurantBusinessTemplates.push(templates[i]);
            continue;
          }
          if (templates[i].category && templates[i].category.name == '숙박여행') {
            vm.accommodationTemplates.push(templates[i]);
            continue;
          }
          if (templates[i].category && templates[i].category.name == '의료건강') {
            vm.medicalTemplates.push(templates[i]);
            continue;
          }
          if (templates[i].category && templates[i].category.name == '교육') {
            vm.eduTemplates.push(templates[i]);
            continue;
          }
          if (templates[i].category && templates[i].category.name == '뷰티') {
            vm.beautyTemplates.push(templates[i]);
            continue;
          }
          if (templates[i].category && templates[i].category.name == '온라인쇼핑') {
            vm.onlineShoppingTemplates.push(templates[i]);
            continue;
          }
          if (templates[i].category && templates[i].category.name == '오픈마켓') {
            vm.openMarketTemplates.push(templates[i]);
            continue;
          }
          if (templates[i].category && templates[i].category.name == '비지니스') {
            vm.businessTemplates.push(templates[i]);
            continue;
          }
        }


        if (vm.userBot.templateId) {
          for (var i=0; i < templates.length; ++i) {
            if (templates[i]._id === vm.userBot.templateId) {
              vm.selectTemplate(templates[i]);
            }
          }
        }
      });


      vm.unselectTemplate = function() {
        vm.userBot.public = false;
        vm.selectedTemplate = undefined;
        if (editor)
          editor.destroy();
      };

      var types = {
        "string": {"type":"string"},
        "date" : {"type":"string", "format":"date"},
        "datetime" : {"type":"string", "format":"datetime"},
        "time" : {"type":"string", "format":"time", "options": {"grid_columns":3}},
        "number" : {"type":"string", "format":"number"},
        "image" : {
          "type":"string",
          "format":"image",
           "readonly":"true",
           /*
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

        console.log(jsonSchema);

        var schema = {};

        Object.keys(jsonSchema).forEach(function(key) {
          if (jsonSchema[key].hidden) return;
          var type = jsonSchema[key].type.toLowerCase();
          if (!types[type]) {
            switch (type) {
              case "enum":
                schema[key] = {type: "string", options:{grid_columns:3}, enum: jsonSchema[key].data};
                break;
              case "list":
                schema[key] = {
                  type: "array",
                  format: "table",
                  uniqueItems: true,
                  items: {
                    type: "object",
                    title: jsonSchema[key]['item_title'] ? jsonSchema[key]['item_title'] : "항목",
                    /*format:"grid",*/
                    "properties": vm.parseSchema(jsonSchema[key].schema)}
                };
                break;
              default:
                console.log("unknown type: " + type + "in template schema:" + jsonSchema);
                break;
            }
          } else {
            schema[key] = angular.copy(types[type]);
          }
          var keys = Object.keys(jsonSchema[key]);
          for (var i=0; i < keys.length; ++i) {
            if (keys[i] != 'type' && keys[i] != 'enum')
              schema[key][keys[i]] = jsonSchema[key][keys[i]];
            //TODO: move to template definition
            if (key === 'address') {
              schema[key]["options"] = {grid_columns: 12};
              schema[key]["readonly"] = true;
            }
            if (key === 'startTime')
              schema[key]["default"] = '09:00';
            if (key === 'endTime')
              schema[key]["default"] = '18:00';
          }
        });
        return schema;
      };

      vm.selectTemplate = function(template) {
        console.log(template);

        vm.selectedTemplate = template;

        // default public:true for template bot
        if (vm.userBot && !vm.userBot._id)
          vm.userBot.public = true;

        // init json editor
        JSONEditor.defaults.options.theme = 'bootstrap3';
        JSONEditor.defaults.options.iconlib= 'fontawesome4';
        JSONEditor.defaults.options.required_by_default = 'true';
        JSONEditor.defaults.options.disable_array_delete_all_rows = 'true';
        JSONEditor.defaults.options.disable_array_delete_last_row = 'true';
        JSONEditor.defaults.language = "kr";
        JSONEditor.defaults.languages.kr = {
          error_uniqueItems: "리스트에 중복된 항목이 있습니다",
          button_add_row_title: "{{0}} 추가",
        };
        //JSONEditor.defaults.options.show_erros = 'change';

        var custom_validator = function(schema, value, path) {
          var errors = [];

          if (path === "root.phone") {
            var regExp = /^\d{2,3}-\d{3,4}-\d{4}$/;
            if (!regExp.test(value))
              errors.push({
                path: path,
                property: 'format',
                message: "전화번호를 입력해주세요"
              });
            return errors;
          }

          if (path === "root.mobile") {
            var regExp = /^\d{3}-\d{3,4}-\d{4}$/;
            if (!regExp.test(value))
              errors.push({
                path: path,
                property: 'format',
                message: "휴대폰 번호를 입력해주세요"
              });
            return errors;
          }

          if (path === "root.address") {
            if (value === "") {
              errors.push({
                path: path,
                property: 'format',
                message: schema.title + "를 입력해주세요"
              });
              return errors;
            }
          }

          if (schema.format !== "image" && value === "") {
            // Errors must be an object with `path`, `property`, and `message`
            var msg;
            switch (schema.format) {
              case 'date': msg = "날짜를 입력해주세요"; break;
              case 'time': msg = "시각을 입력해주세요"; break;
              case "image": msg = "이미지 파일을 선택해주세요"; break;
              default: msg = "내용을 입력해주세요"; break;
            }
            errors.push({
              path: path,
              property: 'format',
              message: msg
            });
          }
          return errors;
        };

        if (JSONEditor.defaults.custom_validators.length == 0) {
          JSONEditor.defaults.custom_validators.push(custom_validator);
        }

        $scope.ierror = {};
        $scope.isuccess = {};

        var schema = {
          type: "object",
          title: template.name,
          properties: {},
          format: "grid",
        };

        schema.properties = vm.parseSchema(template.dataSchema);

        console.log("schema="+ JSON.stringify(schema));

        if (editor) {
          editor.destroy();
        }

        editor = new JSONEditor(document.getElementById('editor_holder'), {
          schema: schema,
          disable_collapse: true,
          disable_properties: true,
          disable_edit_json: true,
          grid_columns: 3,
        });

        // special handling for address
        if (document.getElementsByName("root[address]").length == 1) {
          var innerHTML = '&nbsp;&nbsp;&nbsp;<button class="btn btn-default" ng-click="vm.findAddress()" >주소검색</button>';
          document.getElementsByName("root[address]")[0].insertAdjacentHTML("beforebegin", innerHTML);
          innerHTML = '<div name="mine" class="row" style="padding-top:10px">';
          innerHTML += '<div class="col-md-7"><input ng-model="vm.address1" type="text" class="form-control" name="address1" disabled></div>';
          innerHTML += '<div class="col-md-5"><input ng-model="vm.address2" ng-disabled="!vm.address1" type="text" class="form-control" name="address2"></div>';
          innerHTML += "</div>";
          document.getElementsByName("root[address]")[0].insertAdjacentHTML("beforebegin", innerHTML);
          document.getElementsByName("root[address]")[0].style.display = "none";
        }
        $compile(document.getElementById('editor_holder'))($scope);
        if (vm.userBot.templateId === template._id) {
          console.log("given input=" + JSON.stringify(vm.userBot.templateData));
          editor.setValue(vm.userBot.templateData);
        }

        vm.address1 = "";
        vm.address2 = "";

        $scope.$watch('vm.address2', function () {
          if (vm.address2 && vm.address2 != "")
            editor.getEditor("root.address").setValue(vm.address1 + ", " + vm.address2);
          else
            editor.getEditor("root.address").setValue("");
        });

        if (vm.userBot.templateData && vm.userBot.templateData.address) {
          var addrs = vm.userBot.templateData.address.split(',');
          vm.address1 = addrs[0];
          vm.address2 = addrs[1];
        }

        editor.on('change', function() {
          console.log('editor.onchange -> $compile editor');
          var inputList = document.getElementsByName("mine");
          var compileList = [];
          for (var idx=0; idx < inputList.length; ++idx) {
            var input = inputList[idx];
            if (input.getAttribute("compiled") && input.getAttribute("compiled") == "false") {
              compileList.push(input);
            }
          }
          $compile(compileList)($scope);
          compileList.forEach(function(obj) {
            obj.setAttribute("compiled", "true");
          });

          editor.options.show_errors = undefined;
          $scope.$apply();
        });
      };

      /********************* image *********************/
      //$scope.imageURL = undefined;

      // Create file imageUploader instance
      $scope.jsonImageUploader = new FileUploader({
        url: '/api/user-bots/image-files',
        alias: 'uploadImageFile',
        autoUpload: true
      });

      var setValue = function(value) {
        //document.getElementById(currentInput).value = value;
        editor.getEditor(currentNode).setValue('/files/' + value);
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
        $scope.ierror = response.message;
      };

      // Change user profile picture
      $scope.uploadImageFiles = function () {
        // Clear messages
        $scope.isuccess = $scope.ierror = null;

        // Start upload
        $scope.jsonImageUploader.uploadAll();
      };

      // Cancel the upload process
      $scope.cancelImageUpload = function () {
        $scope.jsonImageUploader.clearQueue();
        setValue('');
        // $scope.imageURL = $scope.user.profileImageURL;
      };


      /********************* dialog *********************/
      vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, botId: vm.userBot.id});
      vm.dialogs = UserBotDialogService.query({botId: vm.userBot.id});

      vm.createDialog = function(isValid) {
        if (!isValid) {
          alert("질문과 답변을 입력해주세요");
          return false;
        }

        vm.dialog.$save(function (response) {
          vm.dialogs.push(response);

          vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, botId: vm.userBot.id});
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
          vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, botId: vm.userBot.id});
        })
      };

      vm.updateDialog = function (dialog) {
        dialog.userBotId = vm.userBot.id;
        dialog.$update(function(response) {
          console.log(response);
        });
      };

      vm.removeDialog = function(dialog) {
        dialog.userBotId = vm.userBot.id;
        dialog.$remove(function(response) {
          console.log(response);
          dialog.deleted = 'true';
        });
      };

      /********************* comment *********************/
      vm.comment = new UserBotCommentService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
      vm.comments = UserBotCommentService.query({userBotId: vm.userBot._id});

      vm.createComment = function(isValid) {
        if (!isValid) {
          alert("댓글은 10자 이상 입력해주세요");
          return false;
        }

        vm.comment.$save(function (response) {
          vm.comments.push(response);
          console.log(vm.comments);

          vm.comment = new UserBotCommentService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
          vm.comment = new UserBotCommentService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
        })
      };

      vm.updateComment = function (comment) {
        comment.userBotId = vm.userBot._id;
        comment.$update(function(response) {
          console.log(response);
        });
      };

      vm.removeComment = function(comment) {
        comment.userBotId = vm.userBot._id;
        comment.$remove(function(response) {
          console.log(response);
          comment.deleted = 'true';
        });
      };

      // // Find a list of UserBots
      // $scope.find = function () {
      //   vm.userBots = UserBotsService.query();
      // };
      //
      // // Find existing UserBot
      // $scope.findOne = function () {
      //   vm.userBot = UserBotsService.get({
      //     userBotId: $stateParams.userBotId
      //   });
      // };


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

        vm.userBot.imageFile = '/files/' + response.filename;
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



      // Create file uploader instance
      $scope.uploader = new FileUploader({
        // url: '/api/user-bots/dataset-files',
        url: '/api/dialogsets/uploadfile',
        alias: 'uploadFile',
        autoUpload: true
      });

      $scope.uploader.filters.push({
        name: 'fileFilter',
        fn: function (item, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          if('|plain|txt|csv|vnd.ms-excel|'.indexOf(type) == -1){
            $scope.success.file = null;
            $scope.error['file'] = '대화 파일이 아니에요'
          }else {
            $scope.error.file = null;
          }
          return '|plain|txt|csv|smi|vnd.ms-excel|'.indexOf(type) !== -1;
        }
      });

      // Called after the user selected a new dialog file
      $scope.uploader.onAfterAddingFile = function (fileItem) {
        if ($window.FileReader) {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(fileItem._file);

          fileReader.onload = function (fileReaderEvent) {
            $timeout(function () {
            }, 0);
          };
        }
      };

      // var User = $resource('/user/:userId', {userId:'@id'});

      // Called after the user has successfully uploaded a new dialog
      $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // Show success message
        $scope.success['file'] = true;

        // vm.userBot.dialogFile = response.filename;

        vm.userBot.path = response.path;
        vm.userBot.filename = response.filename;
        vm.userBot.originalFilename = response.originalFilename;

        vm.userBot.fileuploaded = true;

        if (response.count && response.count > 100) {
          vm.isPublic = true;
          vm.userBot.public = true;
        } else {
          vm.isPublic = false;
          vm.userBot.public = false;
        }

        // Clear upload buttons
        $scope.cancelUpload();
      };

      // Called after the user has failed to uploaded a new dialog
      $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
        // Clear upload buttons
        $scope.cancelUpload();

        // Show error message
        $scope.success.file = null;
        $scope.error['file'] = response.message;
      };

      // Change user profile picture
      $scope.uploadDialogFiles = function () {
        // Clear messages
        $scope.success = $scope.error = null;

        // Start upload
        $scope.uploader.uploadAll();
      };

      // Cancel the upload process
      $scope.cancelUpload = function () {
        $scope.uploader.clearQueue();
        // $scope.imageURL = $scope.user.profileImageURL;
      };

    }
  ]);
}else {
    // UserBots controller
    angular.module('user-bots').controller('UserBotController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams',
        'Authentication', 'userBotResolve', 'UserBotsService', 'UserBotCommentService', 'UserBotDialogService', 'UserBotsFollowService', '$http', '$uibModal',
        function ($scope, $rootScope, $state, $window, $timeout, $stateParams, Authentication, userBot, UserBotsService, UserBotCommentService, UserBotDialogService, UserBotsFollowService, $http, $uibModal) {
            var vm = this;
            vm.user = Authentication.user;
            vm.userBot = userBot;
            vm.userBot.public = true;
            vm.userId = $rootScope.userId;

            vm.isMine = (vm.userBot.user != null && (vm.user.username === vm.userBot.user.username));
            vm.isLearnable = (vm.userBot.user != null && (vm.userBot.learn || vm.isMine));

            vm.userBot.userFollow = UserBotsFollowService.list({userBot: vm.userBot, botUserId: vm.user._id}, function(res) {
                if(res.length > 0) vm.userBot.userFollow = true;
                else vm.userBot.userFollow = undefined;
                // console.log(res);
            });
            // UserBotsFollowService.get()
            // if(vm.userBot && vm.userBot._id)
            //   $rootScope.$broadcast('setUserBot', vm.userBot);

            vm.userBotChat = function(userBot) {
                // $scope.$emit('setUserBot', userBot);
                console.log('vm.userBotChat');
                $rootScope.$broadcast('setUserBot', userBot);
            };

            vm.type = '';
            if($state.is('user-bots-web.create')) {vm.state = 'create'; vm.type = 'edit';}
            else if($state.is('user-bots-web.edit')) {vm.state = 'edit'; vm.type = 'edit';}
            else if($state.is('user-bots-web.view')) {vm.state = 'view'; vm.type = 'view'; vm.userBotChat(vm.userBot); }

            vm.changeType = function(type) {
                vm.type= type;
            };

            vm.followBot = function(userBot) {
                UserBotsFollowService.follow({botUserId: vm.user._id, userBot: userBot._id}, function(err, result) {
                    vm.userBot.userFollow = true;
                    // alert('친구로 추가 되었습니다.')
                });
            };

            vm.unfollowBot = function(userBot) {
                UserBotsFollowService.unfollow({botUserId: vm.user._id, userBot: userBot._id}, function(err, result) {
                    vm.userBot.userFollow = undefined;
                    // alert('친구를 취소하였습니다.')
                });
            };

            vm.fbShare = function () {
                $scope.location = location.href;
                FB.ui({
                    method: 'share',
                    display: 'popup',
                    href: $scope.location,
                    title: vm.userBot.name,
                    description: vm.userBot.description,
                    picture: location.protocol+'//'+location.hostname+'/'+ vm.userBot.imageFile,
                }, function(response){
                    console.log(response);
                });
            };

            vm.kakaoShare = function () {
                $scope.location = location.href;
                console.log(vm.userBot.description);
                Kakao.Story.share({
                    url: $scope.location,
                    text: vm.userBot.name+'-'+ vm.userBot.description
                });
            };

            vm.twitterShare = function () {
                $scope.location = location.href;
                window.open('https://twitter.com/intent/tweet?text='+ vm.userBot.name+'-'+ vm.userBot.description + '&url=' + $scope.location, 'popup', 'width=600, height=400')
            };

            // Create new UserBot
            vm.create = function (isValid) {
                // $scope.error = null;
                $scope.submitted = true;
                if (!isValid) {
                    $scope.$broadcast('show-errors-check-validity', 'userBotForm');
                    return false;
                }
                if ($scope.error.file || $scope.error.image){
                    var modalInstance = $uibModal.open({
                        templateUrl: 'modules/bots/client/views/modal-user-bots.client.error.html',
                        scope: $scope
                    });
                    modalInstance.result.then(function (response) {
                        console.log(response);
                    });
                    return false;
                }
                vm.learning = true;
                if(!vm.userBot.imageFile){
                    vm.userBot.imageFile = "/files/default.png"
                }
                vm.type = 'connect';
                vm.userBot.$save(function (response) {
                    vm.learning = false;
                    $scope.close = function () {
                        modalInstance.dismiss();
                    };
                    var modalInstance = $uibModal.open({
                        templateUrl: 'modules/bots/client/views/modal-user-bots.client.learning.html',
                        scope: $scope
                    });
                    modalInstance.result.then(function (response) {
                        console.log(response);
                    });

                    if($state.is('user-bots-web.create') || $state.is('user-bots-web.edit')) {
                        $rootScope.$broadcast('setUserBot', vm.userBot);

                        // vm.type = 'connect';
                        // $state.go('user-bots-web.list', {'#': 'myBots'});
                    } else {
                        // vm.type = 'conenct';
                        // $state.go('user-bots.list');
                    }
                    // $location.path('userBots/' + response._id);
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            // Remove existing UserBot
            vm.remove = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'modules/bots/client/views/modal-user-bots.client.remove.html',
                    scope: $scope
                });
                $scope.delete = function () {
                    if (vm.userBot && vm.userBot._id) {
                        vm.userBot.$remove(function () {
                            $state.go('user-bots-web.list', {listType: 'my'});
                        }, function (errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    }
                };
                $scope.close = function () {
                    modalInstance.dismiss();
                }
            };

            // Update existing UserBot
            vm.update = function (isValid) {
                console.log(isValid);
                $scope.error = null;
                $scope.submitted = true;
                if (!isValid) {
                    $scope.$broadcast('show-errors-check-validity', 'userBotForm');
                    return false;
                }
                console.log(vm.userBot._id);
                if(vm.userBot && vm.userBot._id) {
                    vm.userBot.$update(function () {
                        $state.go('user-bots-web.list', {listType: 'my'});
                    }, function (errorResponse) {
                        console.log(errorResponse);
                        $scope.error = errorResponse.data.message;
                    });
                }
            };

            // Connect UserBot Dialogue
            vm.modal = function (channel, method) {
                $scope.channel = channel;
                $scope.method = method;
                $scope.userBotId = vm.userBot.id;

                if ((channel == 'facebook') && (method !== 'easy')){
                    FB.api('/me/accounts?fields=picture,name,link,access_token', function(response) {
                      console.log(response);
                      if (response.error && (response.error.code == 2500)){
                        var url = '/api/auth/facebook/page';
                        if ($state.previous && $state.previous.href) {
                            url += '?redirect_to=' + encodeURIComponent($state.previous.href);
                        }
                        // Effectively call OAuth authentication route:
                          console.log(url);
                        $window.location.href = url;
                      }
                      $scope.pageList = [];
                      $scope.pageList = response.data;
                    });
                }
                $scope.close = function () {
                    modalInstance.dismiss();
                };
                $scope.connect = function (page) {
                    modalInstance.dismiss();
                    console.log(page);
                    FB.api('me/subscribed_apps?access_token='+ page.access_token, 'post', function (response) {
                        console.log(response)
                    });
                    // FB.api('1557169960967403/subscriptions', 'post', {object: 'page', callback_url: '/api/facebook/'+ '123' +'/webhook', verify_token: 'moneybrain_token'}, function (response) {
                    //     console.log(response)
                    // })
                };
                var modalInstance = $uibModal.open({
                    templateUrl: 'modules/bots/client/views/modal-user-bots.client.connect.html',
                    scope: $scope
                });
                modalInstance.result.then(function (response) {
                    console.log(response);
                })
            };

            /********************* dialog *********************/
            vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, botId: vm.userBot.id});
            vm.dialogs = UserBotDialogService.query({botId: vm.userBot.id});

            vm.createDialog = function(isValid) {
                if (!isValid) {
                    alert("질문과 답변을 입력해주세요");
                    return false;
                }

                vm.dialog.$save(function (response) {
                    vm.dialogs.push(response);

                    vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, botId: vm.userBot.id});
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                    vm.dialog = new UserBotDialogService({user: vm.user, userBot: vm.userBot, botId: vm.userBot.id});
                })
            };

            vm.updateDialog = function (dialog) {
                dialog.userBotId = vm.userBot.id;
                dialog.$update(function(response) {
                    console.log(response);
                });
            };

            vm.removeDialog = function(dialog) {
                dialog.userBotId = vm.userBot.id;
                dialog.$remove(function(response) {
                    console.log(response);
                    dialog.deleted = 'true';
                });
            };

            /********************* dialog *********************/
            vm.comment = new UserBotCommentService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
            vm.comments = UserBotCommentService.query({userBotId: vm.userBot._id});

            vm.createComment = function(isValid) {
                if (!isValid) {
                    alert("댓글은 10자 이상 입력해주세요");
                    return false;
                }

                vm.comment.$save(function (response) {
                    vm.comments.push(response);
                    console.log(vm.comments);

                    vm.comment = new UserBotCommentService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                    vm.comment = new UserBotCommentService({user: vm.user, userBot: vm.userBot, userBotId: vm.userBot._id});
                })
            };

            vm.updateComment = function (comment) {
                comment.userBotId = vm.userBot._id;
                comment.$update(function(response) {
                    console.log(response);
                });
            };

            vm.removeComment = function(comment) {
                comment.userBotId = vm.userBot._id;
                comment.$remove(function(response) {
                    console.log(response);
                    comment.deleted = 'true';
                });
            };
        }
    ]);
}
