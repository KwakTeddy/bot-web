'use strict';

describe('Custom actions E2E Tests:', function () {
  describe('Test Custom actions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/entitys');
      expect(element.all(by.repeater('entity in entitys')).count()).toEqual(0);
    });
  });
});
