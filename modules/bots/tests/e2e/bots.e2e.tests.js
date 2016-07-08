'use strict';

describe('Bots E2E Tests:', function () {
  describe('Test bots page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/bots');
      expect(element.all(by.repeater('bot in bots')).count()).toEqual(0);
    });
  });
});
