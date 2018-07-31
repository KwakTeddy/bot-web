'use strict';

(function () {
  // Channels Controller Spec
  describe('Channels Controller Tests', function () {
    // Initialize global variables
    var ChannelsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Channels,
      mockChannel;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Channels_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Channels = _Channels_;

      // create mock channel
      mockChannel = new Channels({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Channel about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['enterprise', 'user']
      };

      // Initialize the Channels controller.
      ChannelsController = $controller('ChannelsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one channel object fetched from XHR', inject(function (Channels) {
      // Create a sample bot array that includes the new channel
      var sampleChannels = [mockChannel];

      // Set GET response
      $httpBackend.expectGET('api/bot').respond(sampleChannels);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.channels).toEqualData(sampleChannels);
    }));

    it('$scope.findOne() should create an array with one channel object fetched from XHR using a channelId URL parameter', inject(function (Channels) {
      // Set the URL parameter
      $stateParams.channelId = mockChannel._id;

      // Set GET response
      $httpBackend.expectGET(/api\/channels\/([0-9a-fA-F]{24})$/).respond(mockChannel);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.channel).toEqualData(mockChannel);
    }));

    describe('$scope.create()', function () {
      var sampleChannelPostData;

      beforeEach(function () {
        // Create a sample channel object
        sampleChannelPostData = new Channels({
          title: 'An Channel about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Channel about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Channels) {
        // Set POST response
        $httpBackend.expectPOST('api/bot', sampleChannelPostData).respond(mockChannel);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the channel was created
        expect($location.path.calls.mostRecent().args[0]).toBe('bot/' + mockChannel._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/bot', sampleChannelPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock channel in scope
        scope.channel = mockChannel;
      });

      it('should update a valid channel', inject(function (Channels) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/channels\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/bot/' + mockChannel._id);
      }));

      it('should set scope.error to error response message', inject(function (Channels) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/channels\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(channel)', function () {
      beforeEach(function () {
        // Create new bot array and include the channel
        scope.channels = [mockChannel, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/channels\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockChannel);
      });

      it('should send a DELETE request with a valid channelId and remove the channel from the scope', inject(function (Channels) {
        expect(scope.channels.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.channel = mockChannel;

        $httpBackend.expectDELETE(/api\/channels\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to bot', function () {
        expect($location.path).toHaveBeenCalledWith('channels');
      });
    });
  });
}());
