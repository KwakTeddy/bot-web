'use strict';

(function () {
  // Messengers Controller Spec
  describe('Messengers Controller Tests', function () {
    // Initialize global variables
    var MessengersController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Messengers,
      mockMessenger;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Messengers_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Messengers = _Messengers_;

      // create mock messenger
      mockMessenger = new Messengers({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Messenger about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['enterprise', 'user']
      };

      // Initialize the Messengers controller.
      MessengersController = $controller('MessengersController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one messenger object fetched from XHR', inject(function (Messengers) {
      // Create a sample messengers array that includes the new messenger
      var sampleMessengers = [mockMessenger];

      // Set GET response
      $httpBackend.expectGET('api/messengers').respond(sampleMessengers);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.messengers).toEqualData(sampleMessengers);
    }));

    it('$scope.findOne() should create an array with one messenger object fetched from XHR using a messengerId URL parameter', inject(function (Messengers) {
      // Set the URL parameter
      $stateParams.messengerId = mockMessenger._id;

      // Set GET response
      $httpBackend.expectGET(/api\/messengers\/([0-9a-fA-F]{24})$/).respond(mockMessenger);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.messenger).toEqualData(mockMessenger);
    }));

    describe('$scope.create()', function () {
      var sampleMessengerPostData;

      beforeEach(function () {
        // Create a sample messenger object
        sampleMessengerPostData = new Messengers({
          title: 'An Messenger about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Messenger about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Messengers) {
        // Set POST response
        $httpBackend.expectPOST('api/messengers', sampleMessengerPostData).respond(mockMessenger);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the messenger was created
        expect($location.path.calls.mostRecent().args[0]).toBe('messengers/' + mockMessenger._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/messengers', sampleMessengerPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock messenger in scope
        scope.messenger = mockMessenger;
      });

      it('should update a valid messenger', inject(function (Messengers) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/messengers\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/messengers/' + mockMessenger._id);
      }));

      it('should set scope.error to error response message', inject(function (Messengers) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/messengers\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(messenger)', function () {
      beforeEach(function () {
        // Create new messengers array and include the messenger
        scope.messengers = [mockMessenger, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/messengers\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockMessenger);
      });

      it('should send a DELETE request with a valid messengerId and remove the messenger from the scope', inject(function (Messengers) {
        expect(scope.messengers.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.messenger = mockMessenger;

        $httpBackend.expectDELETE(/api\/messengers\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to messengers', function () {
        expect($location.path).toHaveBeenCalledWith('messengers');
      });
    });
  });
}());
