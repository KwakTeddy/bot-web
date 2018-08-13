'use strict';

(function () {
  // Bots Controller Spec
  describe('Bots Controller Tests', function () {
    // Initialize global variables
    var BotsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Bots,
      mockBot;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Bots_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Bots = _Bots_;

      // create mock bot
      mockBot = new Bots({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Bot about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['enterprise', 'user']
      };

      // Initialize the Bots controller.
      BotsController = $controller('BotsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one bot object fetched from XHR', inject(function (Bots) {
      // Create a sample bots array that includes the new bot
      var sampleBots = [mockBot];

      // Set GET response
      $httpBackend.expectGET('api/bots').respond(sampleBots);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.bots).toEqualData(sampleBots);
    }));

    it('$scope.findOne() should create an array with one bot object fetched from XHR using a botId URL parameter', inject(function (Bots) {
      // Set the URL parameter
      $stateParams.botId = mockBot._id;

      // Set GET response
      $httpBackend.expectGET(/api\/bots\/([0-9a-fA-F]{24})$/).respond(mockBot);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.bot).toEqualData(mockBot);
    }));

    describe('$scope.create()', function () {
      var sampleBotPostData;

      beforeEach(function () {
        // Create a sample bot object
        sampleBotPostData = new Bots({
          title: 'An Bot about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Bot about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Bots) {
        // Set POST response
        $httpBackend.expectPOST('api/bots', sampleBotPostData).respond(mockBot);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the bot was created
        expect($location.path.calls.mostRecent().args[0]).toBe('bots/' + mockBot._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/bots', sampleBotPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock bot in scope
        scope.bot = mockBot;
      });

      it('should update a valid bot', inject(function (Bots) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/bots\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/bots/' + mockBot._id);
      }));

      it('should set scope.error to error response message', inject(function (Bots) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/bots\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(bot)', function () {
      beforeEach(function () {
        // Create new bots array and include the bot
        scope.bots = [mockBot, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/bots\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockBot);
      });

      it('should send a DELETE request with a valid botId and remove the bot from the scope', inject(function (Bots) {
        expect(scope.bots.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.bot = mockBot;

        $httpBackend.expectDELETE(/api\/bots\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to bots', function () {
        expect($location.path).toHaveBeenCalledWith('bots');
      });
    });
  });
}());
