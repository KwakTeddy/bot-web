'use strict';

describe('Channels E2E Tests:', function () {
  describe('Test bot page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/bot');
      expect(element.all(by.repeater('channel in bot')).count()).toEqual(0);
    });
  });
});
