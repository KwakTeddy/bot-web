'use strict';

describe('Menu navigations E2E Tests:', function () {
  describe('Test Menu navigations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/menu-navigations');
      expect(element.all(by.repeater('menu-navigation in menu-navigations')).count()).toEqual(0);
    });
  });
});
