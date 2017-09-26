'use strict';

describe('Bot auths E2E Tests:', function () {
  describe('Test Bot auths page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/bot-auths');
      expect(element.all(by.repeater('bot-auth in bot-auths')).count()).toEqual(0);
    });
  });
});
