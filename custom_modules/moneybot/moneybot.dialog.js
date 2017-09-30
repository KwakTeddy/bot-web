
주민등록번호_입력:

var dialogs = [
{
  input: '주민등록번호입력',
  output: '주민등록번호를 말씀해 주세요',
  children: [
    {
      input: '주민번호형식맞는경우',
      output: {output: '주민등록번호가 입력되었습니다', return: 1}
    },
    {
      input: '',
      output: '주민번호 형식이 틀렸습니다.'
    }
  ]
},
{
  input: '휴대폰번호입력',
  output: '휴대폰번호를 말씀해 주세요',
  children: [
    {
      input: '주민번호형식맞는경우',
      output: {output: '휴대폰번호가 입력되었습니다', return: 1}
    },
    {
      input: '',
      output: '형식이 틀렸습니다.'
    }
  ]
},
{
  input: '금융 상품',
  output: '금융상품 안내해 드리겠습니다. 1. 신용대출 2. 아파트담보대출 3. 전세대출 4. 정기예금 5. 적금 6. 연금 7. 자동차보험',
  children: [
    {
      input: '1',
      output: {call: '신용대출'}
    },
    {
      input: '2',
      output: {call: '아파트담보대출'}
    },
    {
      input: '3',
      output: {call: '전세대출'}
    },
    {
      input: '4',
      output: {call: '예금'}
    },
    {
      input: '5',
      output: {call: '적금'}
    },
    {
      input: '6',
      output: {call: '연금'}
    },
    {
      input: '7',
      output: {call: '자동차보험'}
    }
  ]
},
{
  name: '적금',
  input: '적금',
  task:   'fssSavingQuery',
  output: '금리순 적금 상품 입니다.\n#savings#+index+. +kor_co_nm+ +fin_prdt_nm+ 세전 +intr_rate2+%\n# 번호를 선택해주세요.',
  children: [
    {
      input: {types: [{name: 'saving', listName: 'savings', typeCheck: 'listTypeCheck'}]},
      output: '[+saving.fin_prdt_nm+ - +saving.kor_co_nm+]\n금리: +saving.intr_rate_type_nm+ +saving.intr_rate+% ~ +saving.intr_rate2+% (+saving.save_trm+개월 기준)\n최고한도: +saving.max_limit+원\n가입방법: +saving.join_way+\n'
    }
  ]
},
{
  name: '예금',
  input: '예금',
  task:   'fssDepositQuery',
  output: '금리순 예금 상품 입니다.\n##+index+. +kor_co_nm+ +fin_prdt_nm+ 세전 +intr_rate2+%\n# 번호를 선택해주세요.',
  children: [
    {
      input: {types: [{name: 'deposit', listName: 'deposits', typeCheck: 'listTypeCheck'}]},
      output: '[+deposit.fin_prdt_nm+ - +deposit.kor_co_nm+]\n금리: +deposit.intr_rate_type_nm+ +deposit.intr_rate+% ~ +deposit.intr_rate2+% (+deposit.save_trm+개월 기준)\n최고한도: +deposit.max_limit+원\n가입방법: +deposit.join_way+\n'
    }
  ]
},
{
  name: '연금',
  input: '연금',
  task:   'fssAnnuitySavingQuery',
  output: '금리순 예금 상품 입니다.\n#annuitysavings#+index+. +kor_co_nm+ +fin_prdt_nm+ 연평균수익률 +avg_prft_rate+%\n# 번호를 선택해주세요.',
  children: [
    {
      input: {types: [{name: 'annuitysaving', listName: 'annuitysavings', typeCheck: 'listTypeCheck'}]},
      output: '[+annuitysaving.fin_prdt_nm+ - +annuitysaving.kor_co_nm+]\n종류:+annuitysaving.pnsn_kind_nm+ +annuitysaving.prdt_type_nm+\n수익률: +annuitysaving.avg_prft_rate+\n가입방법: +annuitysaving.join_way+\n연금납입: +annuitysaving.paym_prd_nm+ +annuitysaving.mon_paym_atm_nm+\n연금수령: +annuitysaving.pnsn_strt_age_nm+ +annuitysaving.pnsn_recp_trm_nm+ +annuitysaving.pnsn_recp_amt+'
    }
  ]
},
{
  name: '아파트담보대출',
  input: ['주택 대출', '아파트 대출'],
  task:   'fssMortgageLoanQuery',
  output: '금리순 대출 상품 입니다.\n#mortgageloans#+index+. +kor_co_nm+ +fin_prdt_nm+ +lend_rate_min+%\n# 번호를 선택해주세요.',
  children: [
    {
      input: {types: [{name: 'mortgageloan', listName: 'mortgageloans', typeCheck: 'listTypeCheck'}]},
      output: '[+mortgageloan.fin_prdt_nm+ - +mortgageloan.kor_co_nm+]\n금리: +mortgageloan.rpay_type_nm+ +mortgageloan.lend_rate_min+% ~ +mortgageloan.lend_rate_max+%\n연체이자율: +mortgageloan.dly_rate+\n중도상환수수료: +mortgageloan.erly_rpay_fee+\n대출한도: +mortgageloan.loan_lmt+ 원\n가입방법: +mortgageloan.join_way+'
    }
  ]
},
{
  name: '전세대출',
  input: '전세 대출',
  task:   'fssRentHouseLoanQuery',
  output: '금리순 대출 상품 입니다.\n#renthouseloans#+index+. +kor_co_nm+ +fin_prdt_nm+ +lend_rate_min+%\n# 번호를 선택해주세요.',
  children: [
    {
      input: {types: [{name: 'renthouseloan', listName: 'renthouseloans', typeCheck: 'listTypeCheck'}]},
      output: '[+renthouseloan.fin_prdt_nm+ - +renthouseloan.kor_co_nm+]\n금리: +renthouseloan.rpay_type_nm+ +renthouseloan.lend_rate_min+% ~ +renthouseloan.lend_rate_max+%\n연체이자율: +renthouseloan.dly_rate+\n중도상환수수료: +renthouseloan.erly_rpay_fee+\n대출한도: +renthouseloan.loan_lmt+ 원\n가입방법: +renthouseloan.join_way+'
    }
  ]
},
{
  name: '신용대출',
  input: '신용 대출',
  task:   'fssCreditLoanQuery',
  output: '금리순 신용 대출 상품 입니다.\n#creditloans#+index+. +kor_co_nm+ +fin_prdt_nm+ +crdt_grad_avg+%\n# 번호를 선택해주세요.',
  children: [
    {
      input: {types: [{name: 'creditloan', listName: 'creditloans', typeCheck: 'listTypeCheck'}]},
      output: '[+creditloan.fin_prdt_nm+ - +creditloan.kor_co_nm+]\n종류: +creditloan.crdt_prdt_type_nm+\n평균금리: +creditloan.crdt_lend_rate_type_nm+ +creditloan.crdt_grad_avg+ %\n가입방법: +creditloan.join_way+'
    }
  ]
},
{
  name: '자동차보험',
  input: '자동차 보험 추천',
  output: '최저가순 자동차보험 상품 입니다. ##+index+. +name+ +rate+\n# 번호를 선택해주세요.',
  children: [
    {
      input: {types: [{name: 'saving', listName: 'savings', typeCheck: 'listTypeCheck'}]},
      output: '[+saving.fin_prdt_nm+ - +saving.kor_co_nm+]\n금리: +saving.intr_rate_type_nm+ +saving.intr_rate+% ~ +saving.intr_rate2+% (+saving.save_trm+개월 기준)\n최고한도: +saving.max_limit+원\n가입방법: +saving.join_way+\n'
    }
  ]
},
{
  input: '금융상품 가입',
  output: [
  {if: '\'사이트이동인경우\'', output: '가입 사이트로 이동합니다.'}, 
  {if: '\'전화상담이 필요한 경우\'', output: '신속하게 상담원이 전화드리겠습니다.'}, 
  {if: '\'직접가입이 가능한경우\'', output: '비대면 가입 프로세스'}]
}
];

var commonDialogs = [
{
  name: '시작',
  input: '~시작',
  output: '안녕하세요. 인공지능 금융비서 머니봇 입니다. 무엇을 도와드릴까요?'
},
{
  name: '상위',
  input: '상위',
  output: {up : 1}
},
{
  name: '이전페이지',
  input: '이전',
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  name: '다음페이지',
  input: '다음',
  output: {repeat: 1, options: {page: 'next'}}
},
{
  name: '답변없음',
  input: '',
  output: '알아듣지 못하는 말입니다.\n고객센터로 연결해드릴까요?',
  children: [
    {
      input: '~네',
      output: '고객센터 번호는 1577-7314입니다.'
    }
  ]
}
];


var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('moneybot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
