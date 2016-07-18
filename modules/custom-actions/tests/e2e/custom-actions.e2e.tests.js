'use strict';

describe('Custom actions E2E Tests:', function () {
  describe('Test Custom actions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/custom-actions');
      expect(element.all(by.repeater('custom-action in custom-actions')).count()).toEqual(0);
    });
  });
});
