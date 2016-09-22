(function () {
  'use strict';

  describe('Custom actions Route Tests', function () {
    // Initialize global variables
    var $scope,
      DeliveryOrdersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DeliveryOrdersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DeliveryOrdersService = _DeliveryOrdersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('deliveryOrders');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/deliveryOrders');
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
          DeliveryOrdersController,
          mockDeliveryOrder;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('deliveryOrders.view');
          $templateCache.put('modules/deliveryOrders/client/views/view-deliveryOrder.client.view.html', '');

          // create mock Custom action
          mockDeliveryOrder = new DeliveryOrdersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          DeliveryOrdersController = $controller('DeliveryOrdersController as vm', {
            $scope: $scope,
            deliveryOrderResolve: mockDeliveryOrder
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:deliveryOrderId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.deliveryOrderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            deliveryOrderId: 1
          })).toEqual('/deliveryOrders/1');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.deliveryOrder._id).toBe(mockDeliveryOrder._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/deliveryOrders/client/views/view-deliveryOrder.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DeliveryOrdersController,
          mockDeliveryOrder;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('deliveryOrders.create');
          $templateCache.put('modules/deliveryOrders/client/views/form-deliveryOrder.client.view.html', '');

          // create mock Custom action
          mockDeliveryOrder = new DeliveryOrdersService();

          //Initialize Controller
          DeliveryOrdersController = $controller('DeliveryOrdersController as vm', {
            $scope: $scope,
            deliveryOrderResolve: mockDeliveryOrder
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.deliveryOrderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/deliveryOrders/create');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.deliveryOrder._id).toBe(mockDeliveryOrder._id);
          expect($scope.vm.deliveryOrder._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/deliveryOrders/client/views/form-deliveryOrder.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DeliveryOrdersController,
          mockDeliveryOrder;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('deliveryOrders.edit');
          $templateCache.put('modules/deliveryOrders/client/views/form-deliveryOrder.client.view.html', '');

          // create mock Custom action
          mockDeliveryOrder = new DeliveryOrdersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          DeliveryOrdersController = $controller('DeliveryOrdersController as vm', {
            $scope: $scope,
            deliveryOrderResolve: mockDeliveryOrder
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:deliveryOrderId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.deliveryOrderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            deliveryOrderId: 1
          })).toEqual('/deliveryOrders/1/edit');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.deliveryOrder._id).toBe(mockDeliveryOrder._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/deliveryOrders/client/views/form-deliveryOrder.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
