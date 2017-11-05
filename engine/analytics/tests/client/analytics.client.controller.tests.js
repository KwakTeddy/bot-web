(function () {
  'use strict';

  describe('Bot users Controller Tests', function () {
    // Initialize global variables
    var BotUsersController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      BotUsersService,
      mockBotUser;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _BotUsersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      BotUsersService = _BotUsersService_;

      // create mock Bot user
      mockBotUser = new BotUsersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Bot user Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['enterprise', 'user']
      };

      // Initialize the Bot users controller.
      BotUsersController = $controller('Bot usersController as vm', {
        $scope: $scope,
        botUserResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleBotUserPostData;

      beforeEach(function () {
        // Create a sample Bot user object
        sampleBotUserPostData = new BotUsersService({
          name: 'Bot user Name'
        });

        $scope.vm.botUser = sampleBotUserPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (BotUsersService) {
        // Set POST response
        $httpBackend.expectPOST('api/bot-users', sampleBotUserPostData).respond(mockBotUser);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Bot user was created
        expect($state.go).toHaveBeenCalledWith('bot-users.view', {
          botUserId: mockBotUser._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/bot-users', sampleBotUserPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Bot user in $scope
        $scope.vm.botUser = mockBotUser;
      });

      it('should update a valid Bot user', inject(function (BotUsersService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/bot-users\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('bot-users.view', {
          botUserId: mockBotUser._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (BotUsersService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/bot-users\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Bot users
        $scope.vm.botUser = mockBotUser;
      });

      it('should delete the Bot user and redirect to Bot users', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/bot-users\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('bot-users.list');
      });

      it('should should not delete the Bot user and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
