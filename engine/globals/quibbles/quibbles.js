module.exports = function(globals)
{
    var quibbles = [
        "?",
        "??",
        "음...",
        "몰라...",
        "엥?",
        "응?",
        "글쎄...",
        "..",
        "...",
        "ㅋㅋ",
        "아",
        "ㅇ",
        "무슨 말인지 모르겠어",
        "다시 얘기해줘",
        "다시 말해봐",
        "말 좀 똑바로 해봐~"
    ];

    globals.setQuibbles('quibbles', quibbles);
};
