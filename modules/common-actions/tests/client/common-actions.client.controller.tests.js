(function () {
  'use strict';

  describe('Custom actions Controller Tests', function () {
    // Initialize global variables
    var CommonActionsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CommonActionsService,
      mockCommonAction;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CommonActionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CommonActionsService = _CommonActionsService_;

      // create mock Custom action
      mockCommonAction = new CommonActionsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Custom action Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['enterprise', 'user']
      };

      // Initialize the Custom actions controller.
      CommonActionsController = $controller('Custom actionsController as vm', {
        $scope: $scope,
        commonActionResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleCommonActionPostData;

      beforeEach(function () {
        // Create a sample Custom action object
        sampleCommonActionPostData = new CommonActionsService({
          name: 'Custom action Name'
        });

        $scope.vm.commonAction = sampleCommonActionPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CommonActionsService) {
        // Set POST response
        $httpBackend.expectPOST('api/common-actions', sampleCommonActionPostData).respond(mockCommonAction);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Custom action was created
        expect($state.go).toHaveBeenCalledWith('common-actions.view', {
          commonActionId: mockCommonAction._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/common-actions', sampleCommonActionPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Custom action in $scope
        $scope.vm.commonAction = mockCommonAction;
      });

      it('should update a valid Custom action', inject(function (CommonActionsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/common-actions\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('common-actions.view', {
          commonActionId: mockCommonAction._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (CommonActionsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/common-actions\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Custom actions
        $scope.vm.commonAction = mockCommonAction;
      });

      it('should delete the Custom action and redirect to Custom actions', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/common-actions\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('common-actions.list');
      });

      it('should should not delete the Custom action and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
