'use strict';

(function () {
  // Learnings Controller Spec
  describe('Learnings Controller Tests', function () {
    // Initialize global variables
    var LearningsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Learnings,
      mockLearning;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Learnings_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Learnings = _Learnings_;

      // create mock learning
      mockLearning = new Learnings({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Learning about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['enterprise', 'user']
      };

      // Initialize the Learnings controller.
      LearningsController = $controller('LearningsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one learning object fetched from XHR', inject(function (Learnings) {
      // Create a sample learnings array that includes the new learning
      var sampleLearnings = [mockLearning];

      // Set GET response
      $httpBackend.expectGET('api/learnings').respond(sampleLearnings);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.learnings).toEqualData(sampleLearnings);
    }));

    it('$scope.findOne() should create an array with one learning object fetched from XHR using a learningId URL parameter', inject(function (Learnings) {
      // Set the URL parameter
      $stateParams.learningId = mockLearning._id;

      // Set GET response
      $httpBackend.expectGET(/api\/learnings\/([0-9a-fA-F]{24})$/).respond(mockLearning);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.learning).toEqualData(mockLearning);
    }));

    describe('$scope.create()', function () {
      var sampleLearningPostData;

      beforeEach(function () {
        // Create a sample learning object
        sampleLearningPostData = new Learnings({
          title: 'An Learning about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Learning about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Learnings) {
        // Set POST response
        $httpBackend.expectPOST('api/learnings', sampleLearningPostData).respond(mockLearning);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the learning was created
        expect($location.path.calls.mostRecent().args[0]).toBe('learnings/' + mockLearning._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/learnings', sampleLearningPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock learning in scope
        scope.learning = mockLearning;
      });

      it('should update a valid learning', inject(function (Learnings) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/learnings\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/learnings/' + mockLearning._id);
      }));

      it('should set scope.error to error response message', inject(function (Learnings) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/learnings\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(learning)', function () {
      beforeEach(function () {
        // Create new learnings array and include the learning
        scope.learnings = [mockLearning, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/learnings\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockLearning);
      });

      it('should send a DELETE request with a valid learningId and remove the learning from the scope', inject(function (Learnings) {
        expect(scope.learnings.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.learning = mockLearning;

        $httpBackend.expectDELETE(/api\/learnings\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to learnings', function () {
        expect($location.path).toHaveBeenCalledWith('learnings');
      });
    });
  });
}());
