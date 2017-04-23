'use strict';

describe('Entities E2E Tests:', function () {
  describe('Test Entities page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/entities');
      expect(element.all(by.repeater('entity in entities')).count()).toEqual(0);
    });
  });
});
