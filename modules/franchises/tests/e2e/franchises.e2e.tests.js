'use strict';

describe('Custom actions E2E Tests:', function () {
  describe('Test Custom actions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/franchises');
      expect(element.all(by.repeater('franchise in franchises')).count()).toEqual(0);
    });
  });
});
