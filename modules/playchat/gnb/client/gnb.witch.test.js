Witch.createScenario('aaa', function()
{
    this.createTest('Test gnb-close', '.gnb-close::click', '.logo-min', 'style.display deep::equals::none::true');
    this.createTest('Test gnb-open', '.gnb-open::click', '.logo-min', 'style.display deep::equals::inline::true');
});
