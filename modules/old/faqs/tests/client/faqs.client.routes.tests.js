(function () {
  'use strict';

  describe('Faqs Route Tests', function () {
    // Initialize global variables
    var $scope,
      FaqsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FaqsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FaqsService = _FaqsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('faqs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/faqs');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FaqsController,
          mockFaq;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('faqs.view');
          $templateCache.put('modules/faqs/client/views/view-faq.client.view.html', '');

          // create mock Faq
          mockFaq = new FaqsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Faq Name'
          });

          //Initialize Controller
          FaqsController = $controller('FaqsController as vm', {
            $scope: $scope,
            faqResolve: mockFaq
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:faqId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.faqResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            faqId: 1
          })).toEqual('/faqs/1');
        }));

        it('should attach an Faq to the controller scope', function () {
          expect($scope.vm.faq._id).toBe(mockFaq._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/faqs/client/views/view-faq.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FaqsController,
          mockFaq;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('faqs.create');
          $templateCache.put('modules/faqs/client/views/form-faq.client.view.html', '');

          // create mock Faq
          mockFaq = new FaqsService();

          //Initialize Controller
          FaqsController = $controller('FaqsController as vm', {
            $scope: $scope,
            faqResolve: mockFaq
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.faqResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/faqs/create');
        }));

        it('should attach an Faq to the controller scope', function () {
          expect($scope.vm.faq._id).toBe(mockFaq._id);
          expect($scope.vm.faq._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/faqs/client/views/form-faq.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FaqsController,
          mockFaq;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('faqs.edit');
          $templateCache.put('modules/faqs/client/views/form-faq.client.view.html', '');

          // create mock Faq
          mockFaq = new FaqsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Faq Name'
          });

          //Initialize Controller
          FaqsController = $controller('FaqsController as vm', {
            $scope: $scope,
            faqResolve: mockFaq
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:faqId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.faqResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            faqId: 1
          })).toEqual('/faqs/1/edit');
        }));

        it('should attach an Faq to the controller scope', function () {
          expect($scope.vm.faq._id).toBe(mockFaq._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/faqs/client/views/form-faq.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
