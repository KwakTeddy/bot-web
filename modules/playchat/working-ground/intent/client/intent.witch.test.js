Witch.createScenario('intent', function()
{
    var t = this.addTest('openNewModal');
    t.addAction('#openNewModal', 'click');
    t.addCompareAction('.management-modal', 'style.display deep', 'equals', 'flex', true);
    t.addCompareAction('.management-modal .intent-title', 'value', 'empty', '', true);
    t.addCompareAction('.management-modal input[name="content"]', 'value', 'empty', '', true);

    var testContent = '테스트-' + new Date().getTime();
    var t2 = this.addTest('addIntentByButtonClick');
    t2.addAction('.management-modal input[name="content"]', 'typing', { text: testContent });
    t2.addAction('.management-modal input[name="content"]+button', 'click');
    t2.addCompareAction('#intentList tr:last-child td:first-child', 'text', 'equals', testContent, true);

    testContent = '테스트2-' + new Date().getTime();
    var t2 = this.addTest('addIntentByEnter');
    t2.addAction('.management-modal input[name="content"]', 'typing', { text: testContent });
    t2.addAction('.management-modal input[name="content"]', 'keydown', { keyCode: 13 });
    t2.addCompareAction('#intentList tr:last-child td:first-child', 'text', 'equals', testContent, true);

    var t3 = this.addTest('saveIntentFailure');
    t3.addAction('.management-modal .tab-footer .blue-button', 'click');
    t3.addCompareAction('.management-modal', 'style.display deep', 'equals', 'none', false);

    // var t4 = this.addTest('saveIntent');
    // t4.addAction('.management-modal input[name="name"]', 'typing', { text: '테스트 인텐트' });
    // t4.addCompareAction('.management-modal input[name="name"]', 'value', 'equals', '테스트 인텐트', true);
    // t3.addAction('.management-modal .tab-footer .blue-button', 'click');
    // t3.addCompareAction('.management-modal', 'style.display deep', 'equals', 'none', true, { timeout: 1000 });
    // t3.addCompareAction('#intents tr:first-child td:first-child a', 'text', 'equals', '테스트 인텐트', true);
});
