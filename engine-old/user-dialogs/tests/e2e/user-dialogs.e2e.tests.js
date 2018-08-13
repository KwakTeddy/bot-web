'use strict';

describe('Bot users E2E Tests:', function () {
  describe('Test Bot users page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/user-dialogs');
      expect(element.all(by.repeater('user-dialog in user-dialogs')).count()).toEqual(0);
    });
  });
});
