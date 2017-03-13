'use strict';

describe('Custom actions E2E Tests:', function () {
  describe('Test Custom actions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/dialogsets');
      expect(element.all(by.repeater('dialogset in dialogsets')).count()).toEqual(0);
    });
  });
});
