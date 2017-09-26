'use strict';

var currentInput;
var currentNode;

var setInput = function(cur) {
  currentInput = cur;
  currentNode = cur.replace(/_/g,'.');
};


// Bots controller
angular.module('bots').controller('BotController', 
  ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams', 'Authentication', 'botResolve', 'FileUploader',
    'BotsService', 'BotCommentService', 'BotDialogService', 'UserBotsFollowService', 'UserBotsGraphService',
    '$http', '$uibModal', 'TemplatesService', '$compile', '$cookies', '$resource',
  function ($scope, $rootScope, $state, $window, $timeout, $stateParams, Authentication, bot, FileUploader,
            BotsService, botCommentService, botDialogService, botsFollowService, BotsGraphService,
            $http, $uibModal, TemplatesService, $compile, $cookies, $resource) {
    var vm = this;
    vm.user = Authentication.user;
    vm.bot = bot;
    console.log(vm.bot);
    $timeout(function () {
      console.log('type : ' + vm.type);
      console.log('state : ' + vm.state);
      document.getElementById('sidebar-left').style.display = 'none';
      document.getElementById('chat-include').style.display = 'none';
      document.getElementById('log-button').style.display = 'none';
      document.getElementById('intent-button').style.display = 'none';
      document.getElementById('main').classList.remove('content-body');
    });

    vm.type = '';
    if($state.is('bots.create')) {vm.state = 'create'; vm.type = 'edit-kind';}
    else if($state.is('bots.edit')) {vm.state = 'edit'; vm.type = 'edit';}
    else if ($state.is('bots.view')) {
      vm.state = 'view';
      vm.type = 'view';
      vm.startChat();
    }

    vm.changeType = function(type) {
      vm.type= type;
      if (vm.type == 'view' && vm.state == 'create')
        vm.startChat();
    };

    // console.log(vm.user);
    // console.log(vm.bot);
    vm.isPublic = true;
    vm.sample = false;
    $scope.error = {};
    if ((vm.bot.id == 'restaurantbot') || (vm.bot.id == 'athena') || (vm.bot.id == 'hairshopbot') || (vm.bot.id == 'massagebot') || (vm.bot.id == 'nailbot') || (vm.bot.id == 'order')){
      vm.sample = true;
      vm.videoSrc = '/videos/'+ vm.bot.id+'.mov'
    }
    if (bot && bot._id && !bot.public) {
      if (bot.templateData){
        vm.isPublic = true;
      }else {
        if (vm.bot.dialogsets){
          $resource('/api/dialogueNum/:dialogsets', {}).get({dialogsets: vm.bot.dialogsets[0]}, function (res) {
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
      vm.bot.public = true;
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
    vm.isMine = (vm.bot.user != null && (vm.user.username === vm.bot.user.username));
    vm.isLearnable = (vm.bot.user != null && (vm.bot.learn || vm.isMine));

    vm.bot.userFollow = botsFollowService.list({bot: vm.bot, botUserId: vm.user._id, check: true}, function(res) {
      if(res.length > 0) vm.bot.userFollow = true;
      else vm.bot.userFollow = undefined;
      // console.log(res);
    });
    // botsFollowService.get()
    // if(vm.bot && vm.bot._id)
    //   $rootScope.$broadcast('setbot', vm.bot);

    vm.botChat = function(bot) {
      // $scope.$emit('setbot', bot);
      console.log('vm.botChat');
      $rootScope.$broadcast('setbot', bot);
    };

    if ($stateParams.noGraph)
      $scope.nograph = true;
    vm.startChat = function() {
      if ($cookies.get("nograph") == undefined && !$scope.nograph) {
        $state.go('bots.graph', {botId: vm.bot._id}, {location:'replace'});
      } else {
        vm.botChat(vm.bot);
      }
    };

    vm.followBot = function(bot) {
      botsFollowService.follow({botUserId: vm.user._id, bot: bot._id}, function(result) {
        vm.bot = result;
        vm.bot.userFollow = true;
        // alert('친구로 추가 되었습니다.')
      });
    };

    vm.unfollowBot = function(bot) {
      botsFollowService.unfollow({botUserId: vm.user._id, bot: bot._id}, function(result) {
        vm.bot = result;
        vm.bot.userFollow = undefined;
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
        title: vm.bot.name,
        description: vm.bot.description,
        picture: location.protocol+'//'+location.hostname+'/'+ vm.bot.imageFile,
      }, function(response){
        console.log(response);
      });
    };

    vm.kakaoShare = function () {
      $scope.location = location.href;
      console.log(vm.bot);
      console.log($scope.location);
      Kakao.Story.share({
        url: $scope.location,
        text: vm.bot.name+'-'+ vm.bot.description
      });
    };

    vm.twitterShare = function () {
      $scope.location = location.href;
      window.open('https://twitter.com/intent/tweet?text='+ vm.bot.name+'-'+ vm.bot.description + '&url=' + $scope.location, 'popup', 'width=600, height=400')
    };

    // Connect bot Dialogue
    vm.modal = function (channel, method) {
      $scope.channel = channel;
      $scope.method = method;
      $scope.botId = vm.bot.id;
      $scope.host = location.protocol + "//" + location.host;

      if ((channel == 'facebook') && (method !== 'easy')){
        $scope.fbLoading = true;
        $scope.noPage = false;
        return $http.get('/api/auth/facebook/token/' + vm.user._id).then(function (result) {
          FB.api('/me/accounts?fields=picture,name,link,access_token,perms&access_token=' + result.data.additionalProvidersData.facebook.accessToken, function(response) {
            if (response.error){
              console.log(response.error);
              var url = '/api/auth/facebook/page';
              // if ($state.previous && $state.previous.href) {
              //     url += '?redirect_to=' + encodeURIComponent($state.previous.h`ref);
              // }
              // Effectively call OAuth authentication route:
              console.log(url);
              $scope.fbLoading = false;
              $window.location.href = url;
            } else {
              console.log(response);
              $http.post('/api/auth/facebook/pageInfo', {user: vm.user._id, list: true, pageInfo: response.data}).then(function (res) {
                for(var i = 0; i < res.data.length; i++){
                  for(var j = 0; j < response.data.length; j++){
                    if ((res.data[i].pageId == response.data[j].id) && res.data[i].connect){
                      response.data[j]['connected'] = res.data[i].bot;
                      continue;
                    }else {
                      response.data[j]['connected'] = false;
                    }
                  }
                }

                $scope.fbLoading = false;
                $scope.pageLists = [];
                $scope.pageLists = response.data;
                if (!response.data.length){
                  $scope.noPage = true;
                }

                $scope.close = function () {
                  modalInstance.dismiss();
                };

                $scope.connect = function (page) {
                  // modalInstance.dismiss();
                  FB.api('/me/subscribed_apps?access_token='+ page.access_token, 'post', function (response) {
                    if(response.success){
                      var info = {};
                      info['user'] = vm.user._id;
                      info['bot'] = vm.bot._id;
                      info['botId'] = vm.bot.id;
                      info['page'] = page;
                      info['connect'] = true;
                      page['connected'] = vm.bot;
                      $http.post('/api/auth/facebook/pageInfo', info, function (err) {
                        if(err) {
                          console.log(err)
                        }else {

                        }
                      });
                    }else {

                    }
                  });
                };
                $scope.disconnect = function (page) {
                  // modalInstance.dismiss();
                  var info = {};
                  info['user'] = vm.user._id;
                  info['bot'] = vm.bot._id;
                  info['botId'] = vm.bot.id;
                  info['page'] = page;
                  info['connect'] = false;
                  page['connected'] = false;
                  FB.api('/me/subscribed_apps?access_token='+ page.access_token, 'delete', function (response) {
                    console.log(response);
                    if (response.success){
                      page['connected'] = false;
                      $http.post('/api/auth/facebook/pageInfo', info, function (err) {
                        if(err) {
                          console.log(err)
                        }else {

                        }
                      });
                    }else {

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
              });
            }
          });
        });
      }
      $scope.close = function () {
        modalInstance.dismiss();
      };
      var modalInstance = $uibModal.open({
        templateUrl: 'modules/bots/client/views/modal-user-bots.client.connect.html',
        scope: $scope
      });
      modalInstance.result.then(function (response) {
        console.log(response);
      })
    };

    // vm.press_id = function(event) {
    //   var key = event.keyCode;
    //   if((key >=48 && key <= 90) || (key == 189) || (key >=96 && key <= 105) || (key == 8) ||
    //     (key == 9) || (key == 13) || (key == 16) || (key == 37) || (key == 39) || (key == 116)){
    //     return true;
    //   }
    //   else{
    //     event.preventDefault();
    //     event.stopPropagation();
    //     return false;
    //   }
    // };

    if (!vm.bot || !vm.bot._id) {
      $scope.$watch('vm.bot.id', function () {
        if (vm.bot.id) {
          vm.bot.id = vm.bot.id.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g,'');
          vm.bot.id = vm.bot.id.replace(/^[0-9]/g,'');
          vm.bot.id = vm.bot.id.replace(/ /g,'');
          $resource('/api/bot-exist', {}).get({bot_id: vm.bot.id}, function (res) {
            if (res) {
              $scope.error = {};
              console.log(res);
              console.log($scope.error);
              if($scope.error){
                $scope.error.id = "같은 아이디가 존재합니다";
              }
              if(res._id){
                $scope.error.id = "같은 아이디가 존재합니다";
              }else {
                $scope.error = null;
              }
              return false;
            }
          }, function (err) {
            $scope.error.id = null;
          });
        }
      });
    }

    vm.checkAndChangeType = function(isValid, type) {
      console.log(isValid)
      console.log(type)
      $scope.error = {};
      $scope.submitted = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');
        return false;
      }

      if ($scope.error.id)
        return false;
      /*
       if (vm.selectedTemplate) {
       var errors = editor.validate();
       if (errors.length) {
       $scope.$broadcast('show-errors-check-validity', 'botForm');
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
        console.log(errors)
        if (errors.length) {
          editor.options.show_errors = "interactive";
          editor.onChange();
          return false;
        }
        vm.bot.template = vm.selectedTemplate;
        vm.bot.template.templateData = editor.getValue();
      } else {
        if (vm.bot.template) {
          vm.bot.template = null;
        }
      }
      return true;
    };

    // Create new bot
    vm.create = function (isValid) {
      console.log(isValid)
      console.log($scope.error)
      console.log(vm.checkTemplate());
      // $scope.error = null;
      $scope.submitted = true;


      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');
        return false;
      }
      if ($scope.error && $scope.error.id) return false;
      if ($scope.error && ($scope.error.file || $scope.error.image)){
        var modalInstance = $uibModal.open({
          templateUrl: 'modules/bots/client/views/modal-user-bots.client.error.html',
          scope: $scope
        });
        modalInstance.result.then(function (response) {
          console.log(response);
        });
        return false;
      }
      if (!vm.checkTemplate()) return false;
      vm.learning = true;
      // vm.type = 'connect';

      if(!vm.bot.imageFile) vm.bot.imageFile = "/files/default.png";

      vm.bot['isMakeFile'] = true;

      vm.bot.$save(function (response) {
        // vm.learning = false;
        // var modalInstance = $uibModal.open({
        //   templateUrl: 'modules/bots/client/views/modal-user-bots.client.learning.html',
        //   scope: $scope
        // });
        // $scope.close = function () {
        //   modalInstance.dismiss();
        // };
        // modalInstance.result.then(function (response) {
        //   console.log(response);
        // });

        if($state.is('bots.create') || $state.is('bots.edit')) {
          $rootScope.$broadcast('setbot', vm.bot);
        }

        vm.saved = true;
        $state.go("developer-home")
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Update existing bot
    vm.update = function (isValid) {
      console.log(isValid);
      $scope.error = null;
      $scope.submitted = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'botForm');
        return false;
      }

      if (!vm.checkTemplate()) {
        return false;
      }

      console.log(vm.bot._id);
      vm.type ='connect';
      vm.learning = true;
      if(vm.bot && vm.bot._id) {
        vm.bot.$update(function (response) {
          vm.learning = false;

          var modalInstance = $uibModal.open({
            templateUrl: 'modules/bots/client/views/modal-user-bots.client.learning.html',
            scope: $scope
          });
          modalInstance.result.then(function (response) {
            console.log(response);
          });

          if($state.is('bots.create') || $state.is('bots.edit')) {
            $rootScope.$broadcast('resetbot', vm.bot);
          }
          //$state.go('bots.list', {listType: 'my'});
        }, function (errorResponse) {
          console.log(errorResponse);
          $scope.error = errorResponse.data.message;
        });
      }
    };

    vm.graph = function() {
      botsGraphService.update({botId: vm.bot._id }, function(err, result) {
        console.log("graph updated");
      });
    };

    // Remove existing bot
    vm.remove = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'modules/bots/client/views/modal-user-bots.client.remove.html',
        scope: $scope
      });
      $scope.delete = function () {
        if (vm.bot && vm.bot._id) {
          vm.bot.$remove(function () {
            $state.go('bots.list', {listType: 'my'});
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
    if (vm.bot && vm.bot._id) {
      vm.editType = 'file';
      if (vm.bot.templateId) {
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


      if (vm.bot.templateId) {
        for (var i=0; i < templates.length; ++i) {
          if (templates[i]._id === vm.bot.templateId) {
            vm.selectTemplate(templates[i]);
          }
        }
      }
    });


    vm.unselectTemplate = function() {
      vm.bot.public = false;
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

    vm.parseSchema = function(dataSchema, parsed) {
      console.log(dataSchema);
      var jsonSchema;
      var schema = {};

      try {
        if(!parsed || (typeof dataSchema == 'string')) jsonSchema = JSON.parse(dataSchema);
        else jsonSchema = dataSchema;
      } catch(e) {
        alert("invalid schema" + e.message);
        return;
      }
      Object.keys(jsonSchema).forEach(function(key) {
        if (jsonSchema[key].hidden) return;
        var type = jsonSchema[key].type.toLowerCase();
        if (!types[type]) {
          switch (type) {
            case "enum":
              schema[key] = {type: "string", options:{grid_columns:3}, enum: jsonSchema[key].data};
              break;
            case "list":
              var properties;
              if(typeof jsonSchema[key].schema == "String") properties =  vm.parseSchema(jsonSchema[key].schema);
              else properties =  vm.parseSchema(jsonSchema[key].schema, true);

              console.log(properties);

              schema[key] = {
                type: "array",
                format: "table",
                uniqueItems: true,
                options: {grid_columns:12},
                items: {
                  type: "object",
                  title: jsonSchema[key]['item_title'] ? jsonSchema[key]['item_title'] : "항목",
                  /*format:"grid",*/
                  "properties": properties
                }
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
      if (vm.bot && !vm.bot._id) vm.bot.public = true;

      // init json editor
      JSONEditor.defaults.options.theme = 'bootstrap3';
      JSONEditor.defaults.options.iconlib= 'fontawesome4';
      JSONEditor.defaults.options.required_by_default = 'true';
      JSONEditor.defaults.options.disable_array_delete_all_rows = 'true';
      JSONEditor.defaults.options.disable_array_delete_last_row = 'true';
      JSONEditor.defaults.language = "kr";
      JSONEditor.defaults.languages.kr = {
        error_uniqueItems: "리스트에 중복된 항목이 있습니다",
        button_add_row_title: "{{0}} 추가"
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

      if (JSONEditor.defaults.custom_validators.length == 0) JSONEditor.defaults.custom_validators.push(custom_validator);

      $scope.ierror = {};
      $scope.isuccess = {};

      var schema = {
        type: "object",
        title: template.name,
        properties: {},
        format: "grid"
      };
      console.log(schema);

      schema.properties = vm.parseSchema(template.dataSchema);
      console.log(schema);
      console.log("schema="+ JSON.stringify(schema));
      if (editor) editor.destroy();

      editor = new JSONEditor(document.getElementById('editor_holder'), {
        schema: schema,
        disable_collapse: true,
        disable_properties: true,
        disable_edit_json: true,
        disable_array_reorder: true,
        grid_columns: 3
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
      if (vm.bot.templateId === template._id) {
        console.log("given input=" + JSON.stringify(vm.bot.templateData));
        editor.setValue(vm.bot.templateData);
      }

      vm.address1 = "";
      vm.address2 = "";

      $scope.$watch('vm.address2', function () {
        if (vm.address2 && vm.address2 != "")
          editor.getEditor("root.address").setValue(vm.address1 + ", " + vm.address2);
        else
          editor.getEditor("root.address").setValue("");
      });

      if (vm.bot.templateData && vm.bot.templateData.address) {
        var addrs = vm.bot.templateData.address.split(',');
        vm.address1 = addrs[0];
        vm.address2 = addrs[1];
      }

      editor.on('change', function() {
        console.log('editor.onchange -> $compile editor');
        var inputList = document.getElementsByName("mine");
        console.log(inputList);
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
    // vm.dialog = new botDialogService({user: vm.user, bot: vm.bot, botId: vm.bot.id});
    // vm.dialogs = botDialogService.query({botId: vm.bot.id});

    vm.createDialog = function(isValid) {
      if (!isValid) {
        alert("질문과 답변을 입력해주세요");
        return false;
      }

      vm.dialog.$save(function (response) {
        vm.dialogs.push(response);

        vm.dialog = new botDialogService({user: vm.user, bot: vm.bot, botId: vm.bot.id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        vm.dialog = new botDialogService({user: vm.user, bot: vm.bot, botId: vm.bot.id});
      })
    };

    vm.updateDialog = function (dialog) {
      dialog.botId = vm.bot.id;
      dialog.$update(function(response) {
        console.log(response);
      });
    };

    vm.removeDialog = function(dialog) {
      dialog.botId = vm.bot.id;
      dialog.$remove(function(response) {
        console.log(response);
        dialog.deleted = 'true';
      });
    };

    /********************* comment *********************/
    // vm.comment = new botCommentService({user: vm.user, bot: vm.bot, botId: vm.bot._id});
    // vm.comments = botCommentService.query({botId: vm.bot._id});

    vm.createComment = function(isValid) {
      if (!isValid) {
        alert("댓글은 10자 이상 입력해주세요");
        return false;
      }

      vm.comment.$save(function (response) {
        vm.comments.push(response);
        console.log(vm.comments);

        vm.comment = new botCommentService({user: vm.user, bot: vm.bot, botId: vm.bot._id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        vm.comment = new botCommentService({user: vm.user, bot: vm.bot, botId: vm.bot._id});
      })
    };

    vm.updateComment = function (comment) {
      comment.botId = vm.bot._id;
      comment.$update(function(response) {
        console.log(response);
      });
    };

    vm.removeComment = function(comment) {
      comment.botId = vm.bot._id;
      comment.$remove(function(response) {
        console.log(response);
        comment.deleted = 'true';
      });
    };

    // // Find a list of bots
    // $scope.find = function () {
    //   vm.bots = botsService.query();
    // };
    //
    // // Find existing bot
    // $scope.findOne = function () {
    //   vm.bot = botsService.get({
    //     botId: $stateParams.botId
    //   });
    // };


    /********************* image *********************/
    $scope.imageURL = undefined;
    $scope.error = {};
    $scope.success = {};

    // Create file imageUploader instance
    $scope.imageUploader = new FileUploader({
      url: '/api/bots/image-files',
      alias: 'uploadImageFile',
      autoUpload: true
    });

    $scope.imageUploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        console.log(type);
        if('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1){
          $scope.success.image = null;
          $scope.error['image'] = '이미지 파일이 아니에요'
        }
        else {
          if($scope.error) $scope.error.image = null;
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
      if (!$scope.success) $scope.success = {};

      $scope.success['image'] = true;

      vm.bot.imageFile = '/files/' + response.filename;
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
          if ($scope.error) $scope.error['file'] = '대화 파일이 아니에요'
        }else {
          if ($scope.error) $scope.error.file = null;
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

      // vm.bot.dialogFile = response.filename;

      vm.bot.path = response.path;
      vm.bot.filename = response.filename;
      vm.bot.originalFilename = response.originalFilename;

      vm.bot.fileuploaded = true;

      if (response.count && response.count > 100) {
        vm.isPublic = true;
        vm.bot.public = true;
      } else {
        vm.isPublic = false;
        vm.bot.public = false;
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














  //   var vm = this;
  //   vm.bot = bot;
  //   vm.dialogSets= dialogsetsResolve;
  //
  //   $timeout(function () {
  //     document.getElementById('sidebar-left').style.display = 'none';
  //     document.getElementById('chat-include').style.display = 'none';
  //     document.getElementById('log-button').style.display = 'none';
  //     document.getElementById('intent-button').style.display = 'none';
  //     document.getElementById('main').classList.remove('content-body');
  //   });
  //
  //   if(!vm.bot._id){
  //     $scope.$watch('vm.bot.id', function () {
  //       if (vm.bot.id) {
  //         vm.bot.id = vm.bot.id.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g,'');
  //         vm.bot.id = vm.bot.id.replace(/[0-9]/g,'');
  //         vm.bot.id = vm.bot.id.replace(/ /g,'');
  //         $resource('/api/bot-exist', {}).get({bot_id: vm.bot.id}, function (res) {
  //           if (res) {
  //             $scope.error = {};
  //             console.log(res);
  //             console.log($scope.error);
  //             if($scope.error){
  //               $scope.error.id = "같은 아이디가 존재합니다";
  //             }
  //             if(res._id){
  //               $scope.error.id = "같은 아이디가 존재합니다";
  //             }else {
  //               $scope.error = null;
  //             }
  //             return false;
  //           }
  //         }, function (err) {
  //           if($scope.error){
  //             $scope.error.id = null;
  //           }
  //         });
  //       }
  //     });
  //   }
  //
  //
  //   // Create new Bot
  //   vm.create = function (isValid) {
  //     $scope.error = null;
  //     if (!isValid) {
  //       $scope.$broadcast('show-errors-check-validity', 'botForm');
  //       return false;
  //     }
  //
  //     // default settings
  //     vm.bot.isMakeFile = true;
  //     vm.bot.using = true;
  //
  //     if (vm.selectedTemplate) {
  //       var errors = editor.validate();
  //       if (errors.length) {
  //         $scope.$broadcast('show-errors-check-validity', 'botForm');
  //         return false;
  //       }
  //       vm.bot.template = vm.selectedTemplate;
  //       vm.bot.template.templateData = editor.getValue();
  //     }
  //
  //     vm.bot.$save(function (response) {
  //       $state.go('bots.list');
  //       $cookies.put('default_bot', response.id);
  //       $timeout(function () {
  //         //$route.reload?
  //         $window.location.reload();
  //       }, 100)
  //
  //       // $location.path('bots/' + response._id);
  //     }, function (errorResponse) {
  //       $scope.error = errorResponse.data.message;
  //     });
  //   };
  //
  //   // Remove existing Bot
  //   vm.remove = function () {
  //     if (confirm('정말 삭제하시겠습니까?')) {
  //       if (vm.bot && vm.bot._id) {
  //         vm.bot.$remove(function () {
  //
  //           BotsService.query({my: 1}).$promise.then(function (result) {
  //             console.log(result)
  //             if (result.length){
  //               $rootScope.botId = result[0].id;
  //               $rootScope.bot = result[0];
  //
  //               $cookies.put('default_bot', result[0].id);
  //               $cookies.put('botObjectId', result[0]._id);
  //               $state.go('bots.list');
  //               $timeout(function () {
  //                 $window.location.reload();
  //               }, 100)
  //             }else {
  //               $rootScope.botId = null;
  //               $rootScope.bot = null;
  //
  //               $cookies.put('default_bot', null);
  //               $cookies.put('botObjectId', null);
  //               $timeout(function () {
  //                 $window.location.reload();
  //               }, 100)
  //               if(confirm('봇이 없습니다. 지금 봇을 만드세요!')){
  //                 $state.go('bots.create');
  //               }else {
  //                 $state.go('bots.list')
  //               }
  //
  //
  //             }
  //           }, function (err) {
  //             console.log(err)
  //           });
  //         }, function (errorResponse) {
  //           $scope.error = errorResponse.data.message;
  //         });
  //       }
  //     }
  //   };
  //
  //   // Update existing Bot
  //   vm.update = function (isValid) {
  //     $scope.error = null;
  //     if (!isValid) {
  //       $scope.$broadcast('show-errors-check-validity', 'botForm');
  //       return false;
  //     }
  //
  //     if (vm.selectedTemplate) {
  //       var errors = editor.validate();
  //       if (errors.length) {
  //         $scope.$broadcast('show-errors-check-validity', 'botForm');
  //         return false;
  //       }
  //       vm.bot.template = vm.selectedTemplate;
  //       vm.bot.template.templateData = editor.getValue();
  //     } else {
  //       vm.bot.template = null;
  //     }
  //
  //     if(vm.bot && vm.bot._id) {
  //       vm.bot.$update(function () {
  //         $state.go('bots.list');
  //         $timeout(function () {
  //           $window.location.reload();
  //         }, 100)
  //       }, function (errorResponse) {
  //         $scope.error = errorResponse.data.message;
  //       });
  //     }
  //   };
  //
  //   //connect dialogset to bot
  //
  //   vm.dialogsetsConnect = function (target) {
  //     if (!vm.bot.dialogsets){
  //       vm.bot['dialogsets'] = [];
  //     }
  //     vm.bot.dialogsets.push(target._id);
  //     vm.bot.$update(function (response) {
  //       vm.bot = response;
  //       target.use = true;
  //
  //     }, function (err) {
  //       console.log(err);
  //     })
  //   };
  //
  //   vm.dialogsetsDisconnect = function (target) {
  //     var index = vm.bot.dialogsets.indexOf(target._id);
  //     if (index > -1) {
  //       vm.bot.dialogsets.splice(index, 1);
  //     }
  //     console.log(vm.bot);
  //     vm.bot.$update(function (response) {
  //       target.use = false;
  //       vm.bot = response;
  //     }, function (err) {
  //       console.log(err);
  //     })
  //   };
  //
  //   /********************* template *********************/
  //
  //   var editor;
  //   vm.templates = TemplatesService.query({}, function(templates){
  //     if (vm.bot.templateId) {
  //       for (var i=0; i < templates.length; ++i) {
  //         if (templates[i]._id === vm.bot.templateId) {
  //           vm.selectTemplate(templates[i]);
  //         }
  //       }
  //     }
  //   });
  //
  //   vm.unselectTemplate = function() {
  //     vm.selectedTemplate = undefined;
  //     if (editor)
  //       editor.destroy();
  //   };
  //
  //   var types = {
  //     "string": {"type":"string"},
  //     "date" : {"type":"string", "format":"date"},
  //     "datetime" : {"type":"string", "format":"datetime"},
  //     "time" : {"type":"string", "format":"time"},
  //     "number" : {"type":"string", "format":"number"},
  //     "image" : {
  //       "type":"string",
  //       "format":"image",
  //       /*
  //        "readonly":"true",
  //        "links": [
  //        {
  //        "href":"{{self}}",
  //        "mediaType":"image",
  //        }
  //        ]
  //        */
  //     },
  //   };
  //
  //   vm.parseSchema = function(dataSchema) {
  //     var jsonSchema;
  //     try {
  //       jsonSchema = JSON.parse(dataSchema);
  //     } catch(e) {
  //       alert("invalid schema" + e.message);
  //       return;
  //     }
  //
  //
  //     var schema = {};
  //
  //     Object.keys(jsonSchema).forEach(function(key) {
  //       //TODO
  //       if (jsonSchema[key].hidden) return;
  //       var type = jsonSchema[key].type.toLowerCase();
  //       if (types[type]) {
  //         schema[key] = types[type];
  //       } else {
  //         switch (type) {
  //           case "enum":
  //             schema[key] = {type:"string", enum:jsonSchema[key].data};
  //             break;
  //           case "list":
  //             schema[key] = {type:"array", items:{ type:"object", "properties": vm.parseSchema(jsonSchema[key].schema) }};
  //             break;
  //           default:
  //             console.log("unknown type: " + type + "in template schema:" + jsonSchema);
  //             break;
  //         }
  //       }
  //     });
  //     return schema;
  //   };
  //
  //   vm.selectTemplate = function(template) {
  //     vm.selectedTemplate = template;
  //
  //     // init json editor
  //     JSONEditor.defaults.options.theme = 'bootstrap3';
  //     JSONEditor.defaults.options.iconlib= 'fontawesome4';
  //
  //     JSONEditor.defaults.custom_validators.push(function(schema, value, path) {
  //       var errors = [];
  //       if (value === "") {
  //         // Errors must be an object with `path`, `property`, and `message`
  //         errors.push({
  //           path: path,
  //           property: 'format',
  //           message: 'empty value is not allowed'
  //         });
  //       }
  //       return errors;
  //     });
  //
  //     var schema = {
  //       type: "object",
  //       title: template.name,
  //       properties: {},
  //       //format: "grid",
  //     };
  //
  //     schema.properties = vm.parseSchema(template.dataSchema);
  //
  //
  //     if (editor) {
  //       editor.destroy();
  //     }
  //
  //     editor = new JSONEditor(document.getElementById('editor_holder'), {
  //       schema: schema,
  //       disable_collapse: true,
  //       disable_properties: true,
  //     });
  //
  //     $compile(document.getElementById('editor_holder'))($scope);
  //     if (vm.bot.templateId === template._id) {
  //       editor.setValue(vm.bot.templateData);
  //     }
  //
  //     editor.on('change', function() {
  //       $compile(document.getElementById('editor_holder'))($scope);
  //       $scope.ierror = {};
  //       $scope.isuccess = {};
  //
  //     });
  //   };
  //
  //   /********************* image *********************/
  //   //$scope.imageURL = undefined;
  //
  //   // Create file imageUploader instance
  //   $scope.jsonImageUploader = new FileUploader({
  //     url: '/api/bots/image-files',
  //     alias: 'uploadImageFile',
  //     autoUpload: true
  //   });
  //
  //   var setValue = function(value) {
  //     //document.getElementById(currentInput).value = value;
  //     editor.getEditor(currentNode).setValue(value);
  //   };
  //
  //   $scope.jsonImageUploader.filters.push({
  //     name: 'imageFilter',
  //     fn: function (item, options) {
  //       var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
  //       if('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1) {
  //         $scope.isuccess[currentInput] = null;
  //         $scope.ierror[currentInput] = true;
  //         setValue('');
  //       }
  //       return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
  //     }
  //   });
  //
  //   // Called after the user selected a new picture file
  //   $scope.jsonImageUploader.onAfterAddingFile = function (fileItem) {
  //     if ($window.FileReader) {
  //       var fileReader = new FileReader();
  //       fileReader.readAsDataURL(fileItem._file);
  //
  //       fileReader.onload = function (fileReaderEvent) {
  //         $timeout(function () {
  //           //$scope.imageURL = fileReaderEvent.target.result;
  //         }, 0);
  //       };
  //     }
  //   };
  //
  //   // Called after the user has successfully uploaded a new picture
  //   $scope.jsonImageUploader.onSuccessItem = function (fileItem, response, status, headers) {
  //     // Show success message
  //     $scope.ierror[currentInput] = null;
  //     $scope.isuccess[currentInput] = true;
  //
  //     setValue(response.filename);
  //     // Clear upload buttons
  //     $scope.cancelImageUpload();
  //   };
  //
  //   // Called after the user has failed to uploaded a new picture
  //   $scope.jsonImageUploader.onErrorItem = function (fileItem, response, status, headers) {
  //     // Clear upload buttons
  //     $scope.cancelImageUpload();
  //     setValue('');
  //
  //     // Show error message
  //     $scope.error = response.message;
  //   };
  //
  //   // Change user profile picture
  //   $scope.uploadImageFiles = function () {
  //     // Clear messages
  //     $scope.success = $scope.error = null;
  //
  //     // Start upload
  //     $scope.jsonImageUploader.uploadAll();
  //   };
  //
  //   // Cancel the upload process
  //   $scope.cancelImageUpload = function () {
  //     $scope.jsonImageUploader.clearQueue();
  //     // $scope.imageURL = $scope.user.profileImageURL;
  //   };
  //
  //
  //
  //   /********************* image *********************/
  //   $scope.imageURL = undefined;
  //   $scope.error = {};
  //   $scope.success = {};
  //
  //   // Create file imageUploader instance
  //   $scope.imageUploader = new FileUploader({
  //     url: '/api/user-bots/image-files',
  //     alias: 'uploadImageFile',
  //     autoUpload: true
  //   });
  //
  //   $scope.imageUploader.filters.push({
  //     name: 'imageFilter',
  //     fn: function (item, options) {
  //       var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
  //       if('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1){
  //         $scope.success.image = null;
  //         $scope.error['image'] = '이미지 파일이 아니에요'
  //       }else {
  //         $scope.error.image = null;
  //       }
  //       return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
  //     }
  //   });
  //
  //   // Called after the user selected a new picture file
  //   $scope.imageUploader.onAfterAddingFile = function (fileItem) {
  //     if ($window.FileReader) {
  //       var fileReader = new FileReader();
  //       fileReader.readAsDataURL(fileItem._file);
  //
  //       fileReader.onload = function (fileReaderEvent) {
  //         $timeout(function () {
  //           $scope.imageURL = fileReaderEvent.target.result;
  //         }, 0);
  //       };
  //     }
  //   };
  //
  //   // Called after the user has successfully uploaded a new picture
  //   $scope.imageUploader.onSuccessItem = function (fileItem, response, status, headers) {
  //     // Show success message
  //     $scope.success['image'] = true;
  //
  //     vm.bot.imageFile = '/files/' + response.filename;
  //     // Clear upload buttons
  //     $scope.cancelImageUpload();
  //   };
  //
  //   // Called after the user has failed to uploaded a new picture
  //   $scope.imageUploader.onErrorItem = function (fileItem, response, status, headers) {
  //     // Clear upload buttons
  //     $scope.cancelImageUpload();
  //
  //     // Show error message
  //     $scope.error = response.message;
  //   };
  //
  //   // Change user profile picture
  //   $scope.uploadImageFiles = function () {
  //     // Clear messages
  //     $scope.success = $scope.error = null;
  //
  //     // Start upload
  //     $scope.imageUploader.uploadAll();
  //   };
  //
  //   // Cancel the upload process
  //   $scope.cancelImageUpload = function () {
  //     $scope.imageUploader.clearQueue();
  //     // $scope.imageURL = $scope.user.profileImageURL;
  //   };
  }
]);
