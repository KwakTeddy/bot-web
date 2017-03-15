
var nouns = [
  { condition: {word: '나이'},
    sentences: [
    "나이는 숫자에 불과해",
    "나이가 뭐가 중요해",
    "한국 사람들은 그렇게 나이를 물어보더라!",
    "나이는 중요한 게 아니야",
    "나이는 잘 모르겠는데..",
    "나이? 글쎄 나이는 모르겠어",
    "나이 질문한건가? 나이는 잘 모르겠는데..",
    "나이는 왜 자꾸 묻는거야~",
    "나이 얘기말고 다른 얘기하자~!",
    "나이보단 다른 얘기가 재밌을 것 같은데 ㅎㅎ"
  ]}

];

var verbs = [
  { condition: {word: '되다', time: '과거', question: '언제'},
    sentences: [
      "그게 언제였더라.. 기억이 잘 안나네..",
      "좀 오래 됐어~",
      "오래된 것 같은데..",
      "한참 됐지!",
      "글쎄 꽤 된 것 같은데!"
    ]}
];

var sentenceType = [
  { condition: {time: '과거', question: '언제'},
    sentences: [
      "누구였는지 몰라",
      "그 때 그 사람...",
      "누구?",
      "누가?",
      "누구였더라..."
    ]}
];

function quibble(input, inputRaw, context, callback) {
  callback();
}