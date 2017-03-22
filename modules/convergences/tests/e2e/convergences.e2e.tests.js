'use strict';

describe('Convergences E2E Tests:', function () {
  describe('Test Convergences page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/convergences');
      expect(element.all(by.repeater('convergence in convergences')).count()).toEqual(0);
    });
  });
});
