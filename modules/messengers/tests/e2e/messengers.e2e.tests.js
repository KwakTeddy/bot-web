'use strict';

describe('Messengers E2E Tests:', function () {
  describe('Test messengers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/messengers');
      expect(element.all(by.repeater('messenger in messengers')).count()).toEqual(0);
    });
  });
});
