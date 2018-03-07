'use strict';

describe('Bot users E2E Tests:', function () {
  describe('Test Bot users page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/bot-users');
      expect(element.all(by.repeater('bot-user in bot-users')).count()).toEqual(0);
    });
  });
});
