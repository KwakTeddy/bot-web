'use strict';

describe('Custom actions E2E Tests:', function () {
  describe('Test Custom actions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/templates');
      expect(element.all(by.repeater('template in templates')).count()).toEqual(0);
    });
  });
});
