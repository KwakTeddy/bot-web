'use strict';

describe('Custom actions E2E Tests:', function () {
  describe('Test Custom actions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/restaurants');
      expect(element.all(by.repeater('restaurant in restaurants')).count()).toEqual(0);
    });
  });
});
