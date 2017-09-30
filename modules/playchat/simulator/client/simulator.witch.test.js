Witch.createScenario('simulator', function()
{
    var t = this.addTest('대화 테스트');
    t.addAction('#simulatorBody+div > input', 'typing', { text: '안녕하세요' });
    t.addAction('#simulatorBody+div > input', 'keydown', { keyCode: 13 });
    t.addCompareAction('#simulatorBody .question:last .speech-text', 'text', 'equals', '안녕하세요', true);
    t.addCompareAction('#simulatorBody .answer', 'list.length', '>=', '2', true);
    t.addCompareAction('#simulatorBody .answer:last .speech-text', 'text', 'typeof', 'string', true);

    // var actions = [];
    // actions.push('#simulatorBody+div > input::typing::안녕하세요');
    // actions.push('#simulatorBody+div > input::keydown::enter');
    // this.createTest('대화 입력', actions, '#simulatorBody .question:last-child .speech-text', 'text::equals::안녕하세요::true');
});
