'use strict';

describe('Banks E2E Tests:', function () {
  describe('Test Banks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/banks');
      expect(element.all(by.repeater('bank in banks')).count()).toEqual(0);
    });
  });
});
