'use strict';

describe('Custom actions E2E Tests:', function () {
  describe('Test Custom actions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/concepts');
      expect(element.all(by.repeater('concept in concepts')).count()).toEqual(0);
    });
  });
});
