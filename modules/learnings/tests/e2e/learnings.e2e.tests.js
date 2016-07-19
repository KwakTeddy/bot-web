'use strict';

describe('Learnings E2E Tests:', function () {
  describe('Test learnings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/learnings');
      expect(element.all(by.repeater('learning in learnings')).count()).toEqual(0);
    });
  });
});
