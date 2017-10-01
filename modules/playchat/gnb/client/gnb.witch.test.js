Witch.createScenario('gnb', function()
{
    this.addTest('GNB 접기').addAction('.gnb-close', 'click').addCompareAction('.logo-min', 'style.display deep', 'equals', 'none', true);

    var t = this.addTest('GNB 펼치기');
    t.addAction('.gnb-open', 'click');
    t.addCompareAction('.logo-min', 'style.display deep', 'equals', 'inline', true);


    var t = this.addTest('하위 메뉴 펼치기');
    t.addAction('.menu-item-group:nth-child(2) .menu-item .close', 'click');
    t.addCompareAction('.menu-item-group:nth-child(2) .sub-menu-item-group', 'style.height deep', '>', '0', true);
});
