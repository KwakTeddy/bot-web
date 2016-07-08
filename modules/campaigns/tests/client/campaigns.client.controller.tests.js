'use strict';

(function () {
  // Campaigns Controller Spec
  describe('Campaigns Controller Tests', function () {
    // Initialize global variables
    var CampaignsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Campaigns,
      mockCampaign;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Campaigns_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Campaigns = _Campaigns_;

      // create mock campaign
      mockCampaign = new Campaigns({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Campaign about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Campaigns controller.
      CampaignsController = $controller('CampaignsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one campaign object fetched from XHR', inject(function (Campaigns) {
      // Create a sample campaigns array that includes the new campaign
      var sampleCampaigns = [mockCampaign];

      // Set GET response
      $httpBackend.expectGET('api/campaigns').respond(sampleCampaigns);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.campaigns).toEqualData(sampleCampaigns);
    }));

    it('$scope.findOne() should create an array with one campaign object fetched from XHR using a campaignId URL parameter', inject(function (Campaigns) {
      // Set the URL parameter
      $stateParams.campaignId = mockCampaign._id;

      // Set GET response
      $httpBackend.expectGET(/api\/campaigns\/([0-9a-fA-F]{24})$/).respond(mockCampaign);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.campaign).toEqualData(mockCampaign);
    }));

    describe('$scope.create()', function () {
      var sampleCampaignPostData;

      beforeEach(function () {
        // Create a sample campaign object
        sampleCampaignPostData = new Campaigns({
          title: 'An Campaign about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Campaign about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Campaigns) {
        // Set POST response
        $httpBackend.expectPOST('api/campaigns', sampleCampaignPostData).respond(mockCampaign);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the campaign was created
        expect($location.path.calls.mostRecent().args[0]).toBe('campaigns/' + mockCampaign._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/campaigns', sampleCampaignPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock campaign in scope
        scope.campaign = mockCampaign;
      });

      it('should update a valid campaign', inject(function (Campaigns) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/campaigns\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/campaigns/' + mockCampaign._id);
      }));

      it('should set scope.error to error response message', inject(function (Campaigns) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/campaigns\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(campaign)', function () {
      beforeEach(function () {
        // Create new campaigns array and include the campaign
        scope.campaigns = [mockCampaign, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/campaigns\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockCampaign);
      });

      it('should send a DELETE request with a valid campaignId and remove the campaign from the scope', inject(function (Campaigns) {
        expect(scope.campaigns.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.campaign = mockCampaign;

        $httpBackend.expectDELETE(/api\/campaigns\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to campaigns', function () {
        expect($location.path).toHaveBeenCalledWith('campaigns');
      });
    });
  });
}());
