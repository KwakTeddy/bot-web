Witch.createScenario('gnb', function()
{
    this.addTest('GNB 접기').addAction('.gnb-close', 'click').addCompareAction('.logo-min', 'style.display deep', 'equals', 'none', true);

    var t = this.addTest('GNB 펼치기');
    t.addAction('.gnb-open', 'click');
    t.addCompareAction('.logo-min', 'style.display deep', 'equals', 'inline', true);
});
