//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('LanguageService', function($cookies, $rootScope)
    {
        var user = $cookies.getObject('user');
        var userLang = navigator.language || navigator.userLanguage;
        var code = user ? user.language : userLang || 'en';

        code = code.split('-')[0];

        $rootScope.$on('changeLanguage', function()
        {
            user = $cookies.getObject('user');
            code = user ? user.language : userLang || 'en';

            code = code.split('-')[0];
        });

        var languages = {
            "Welcome to Playchat!": {
                "ko": "플레이챗에 오신 걸 환영합니다!",
                "en": "Welcome to Playchat!",
                "jp": "プレーイチェッにいらっしゃったことを歓迎します!",
                "zh": "欢迎来到Playchat!"
            },
            "Please sign in with your account.": {
                "ko": "로그인해주세요.",
                "en": "Please sign in with your account.",
                "jp": "ログインしてください。",
                "zh": "请使用账号密码登录。"
            },
            "Sign in with your social network account.": {
                "ko": "SNS 계정으로 로그인해보세요.",
                "en": "Sign in with your social network account.",
                "jp": "SNSアカウントでログインすること",
                "zh": "第三方账号登录。"
            },
            "Sign in with Facebook": {
                "ko": "페이스북으로 로그인",
                "en": "Sign in with Facebook",
                "jp": "フェイスブックアカウントでログインすること",
                "zh": "Facebook账号登录"
            },
            "Sign in with Google": {
                "ko": "구글계정으로 로그인",
                "en": "Sign in with Google",
                "jp": "グーグルアカウントでログインすること",
                "zh": "Google账号登录"
            },
            "Sign in with Kakao": {
                "ko": "카카오톡으로 로그인",
                "en": "Sign in with Kakao",
                "jp": "カカオトークのアカウントでログインすること",
                "zh": "Kakaotalk账号登录"
            },
            "Email ID": {
                "ko": "이메일 주소",
                "en": "Email ID",
                "jp": "メールアドレス",
                "zh": "电子邮件ID"
            },
            "Password": {
                "ko": "비밀번호",
                "en": "Password",
                "jp": "パスワード",
                "zh": "密码"
            },
            "Forget your password?": {
                "ko": "비밀번호를 잊으셨나요?",
                "en": "Forget your password?",
                "jp": "秘密番号を探す",
                "zh": "忘记密码？"
            },
            "Sign in": {
                "ko": "로그인",
                "en": "Sign in",
                "jp": "ログイン",
                "zh": "登录"
            },
            "Create Account": {
                "ko": "가입하기",
                "en": "Create Account",
                "jp": "加入すること",
                "zh": "注册"
            },
            "Terms of Use and Privacy Policy": {
                "ko": "이용약관 및 개인정보 보호 정책",
                "en": "Terms of Use and Privacy Policy",
                "jp": "利用約款および個人情報保護政策",
                "zh": "使用条款和隐私政策"
            },
            "Create your account": {
                "ko": "가입하기",
                "en": "Create your account",
                "jp": "加入すること",
                "zh": "注册"
            },
            "Please create your account.": {
                "ko": "가입해보세요.",
                "en": "Please create your account.",
                "jp": "加入してみてください。",
                "zh": "注册您的新账号。"
            },
            "Username": {
                "ko": "사용자 이름",
                "en": "Username",
                "jp": "使用者の名前",
                "zh": "用户名"
            },
            "Password confirm": {
                "ko": "비밀번호 확인",
                "en": "Password confirm",
                "jp": "暗証番号確認",
                "zh": "密码确认"
            },
            "Agree to Terms of Use and Privacy Policy": {
                "ko": "이용약관 및 개인정보 보호 정책에 동의합니다.",
                "en": "Agree to Terms of Use and Privacy Policy",
                "jp": "利用約款および個人情報保護政策に同意します。",
                "zh": "同意使用条款和隐私政策"
            },
            "Sign up": {
                "ko": "가입신청",
                "en": "Sign up",
                "jp": "ログイン",
                "zh": "登录"
            },
            "We sent a verification e-mail to": {
                "ko": "이메일로 인증 이메일이 전송되었습니다.",
                "en": "We sent a verification e-mail to ",
                "jp": "メールで認証メールが送られました。 ",
                "zh": "验证电子邮件已经发到您的邮箱了。 "
            },
            "Please check your e-mail box. The validity time of the certificate is one hour.": {
                "ko": "이메일을 확인해주세요. 인증가능시간은 한시간 내에 마감됩니다.",
                "en": "Please check your e-mail box. The validity time of the certificate is one hour.",
                "jp": "電子メールを確認してください。 認証可能時間は一時間内に締め切られます。",
                "zh": "请检查您的电子邮箱。证书的有效期为一个小时。"
            },
            "\"If you would like to receive the e-mail again": {
                "ko": "이메일 재전송을 원하시면 '재전송' 버튼을 눌러주세요.",
                "en": "\"If you would like to receive the e-mail again",
                "jp": " please click on the again button.\"",
                "zh": "メールへの再転送をお望みでしたら'再送信'ボタンを押してください。"
            },
            "Receive again": {
                "ko": "재전송",
                "en": "Receive again",
                "jp": "再送信",
                "zh": "再次发送"
            },
            "\"Signning is successfuly done": {
                "ko": "회원가입은 되었지만 E-mail 인증 메일 보내기에 실패했어요. 관리자에게 문의해주세요.",
                "en": "\"Signning is successfuly done",
                "jp": " but verification e-mail sending is failed. Please contact us.\"",
                "zh": "会員加入はなったが、E-mail認証メール送ることに失敗しました。 管理者に問い合わせてください。"
            },
            "You already signed up by facebook": {
                "ko": "페이스북을 통해 이미 로그인 되어 있는 상태입니다.",
                "en": "You already signed up by facebook.",
                "jp": "フェイスブックを通じて、すでにログインできている状態です",
                "zh": "您已经通过Facebook账号进行了登录。"
            },
            "You already signed up by kakao": {
                "ko": "카카오톡을 통해 이미 로그인 되어 있는 상태입니다.",
                "en": "You already signed up by kakao.",
                "jp": "あなたはすでにカカオによってサインアップしています",
                "zh": "您已经通过Kakao账号进行了登录。"
            },
            "You already signed up by google": {
                "ko": "구글을 통해 이미 로그인 되어 있는 상태입니다.",
                "en": "You already signed up by google.",
                "jp": "あなたはすでにGoogleによってサインアップしています。",
                "zh": "您已经通过Google账号进行了登录。"
            },
            "Invalid email address.": {
                "ko": "유효한 형식의 이메일이 아니에요",
                "en": "Invalid email address.",
                "jp": "有効な形式の電子メールがないです",
                "zh": "无效的电子邮件地址。"
            },
            "Find your password": {
                "ko": "비밀번호 찾기",
                "en": "Find your password",
                "jp": "パスワード忘れ",
                "zh": "找回密码"
            },
            "Please enter your email.": {
                "ko": "이메일 주소를 입력하세요.",
                "en": "Please enter your email.",
                "jp": "メールアドレスを入力してください。",
                "zh": "请输入您的电子邮箱。"
            },
            "Find": {
                "ko": "찾기",
                "en": "Find",
                "jp": "探す",
                "zh": "找回"
            },
            "We sent email to you for reset password.": {
                "ko": "비밀번호 재설정을 위한 이메일을 보내드렸습니다.",
                "en": "We sent email to you for reset password.",
                "jp": "暗証番号の再設定を向けたメールを送ってあげました。",
                "zh": "我们将向您发送重置密码邮件。"
            },
            "Your account is signed up from kakao.": {
                "ko": "카카오톡을 통해 이미 로그인 되어 있는 상태입니다.",
                "en": "Your account is signed up from kakao.",
                "jp": "カカオトークを通じてすでにログインできている状態です。",
                "zh": "您已经通过Kakaotalk账号进行了登录。"
            },
            "Email is not found.": {
                "ko": "등록된 이메일이 없습니다.",
                "en": "Email is not found.",
                "jp": "登録されたメールがありません。",
                "zh": "没有注册过的电子邮箱。"
            },
            "Profile": {
                "ko": "프로필",
                "en": "Profile",
                "jp": "プロフィール",
                "zh": "头像"
            },
            "E-mail": {
                "ko": "이메일",
                "en": "E-mail",
                "jp": "メール",
                "zh": "电子邮件"
            },
            "Last name": {
                "ko": "성",
                "en": "Last name",
                "jp": "姓",
                "zh": "姓"
            },
            "First name": {
                "ko": "이름",
                "en": "First name",
                "jp": "名前",
                "zh": "名"
            },
            "Update": {
                "ko": "업데이트",
                "en": "Update",
                "jp": "アップデート",
                "zh": "更新"
            },
            "Delete Account": {
                "ko": "계정 지우기",
                "en": "Delete Account",
                "jp": "アカウントを消すこと",
                "zh": "删除账号"
            },
            "My chatbot": {
                "ko": "나의 챗봇",
                "en": "My chatbot",
                "jp": "私のチェッボッ",
                "zh": "我的聊天机器人"
            },
            "Shared chatbot": {
                "ko": "공유된 챗봇",
                "en": "Shared chatbot",
                "jp": "共有されたチェッボッ",
                "zh": "共享的聊天机器人"
            },
            "Share chatbot": {
                "ko": "챗봇 공유하기",
                "en": "Share chatbot",
                "zh": "分享chatbot",
                "jp": "チャットボットを共有する"
            },
            "New chatbot": {
                "ko": "새 봇 만들기",
                "en": "New chatbot",
                "jp": "新しいチェッボッ",
                "zh": "新的聊天机器人"
            },
            "Chatbot": {
                "ko": "챗봇",
                "en": "Chatbot",
                "jp": "チェッボッ",
                "zh": "聊天机器人"
            },
            "Share": {
                "ko": "공유하기",
                "en": "Share",
                "jp": "共有すること",
                "zh": "分享"
            },
            "Member ID(Email)": {
                "ko": "멤버 아이디(이메일)",
                "en": "Member ID(Email)",
                "jp": "メンバー・アイディ(メール)",
                "zh": "会员ID（电子邮箱）"
            },
            "Authoriztion": {
                "ko": "권한",
                "en": "Authoriztion",
                "jp": "権限",
                "zh": "权限"
            },
            "Read": {
                "ko": "읽기",
                "en": "Read",
                "jp": "読むこと",
                "zh": "阅读"
            },
            "Write": {
                "ko": "쓰기",
                "en": "Write",
                "jp": "書く",
                "zh": "写"
            },
            "Flow chatbots are tree-based. The user is driven down a specific path": {
                "ko": "플로우 챗봇은 트리구조입니다. 사용자는 개발자가 지정한 특정 대화 구조에 맞게 대화를 진행하게 됩니다.",
                "en": "\"Flow chatbots are tree-based. The user is driven down a specific path",
                "jp": " a path previously defined by the chatbot's developer\"",
                "zh": "フローチェッボッはツリー構造です。 使用者は開発者が指定した特定対話構造に合わせて対話を進めるようになります。"
            },
            "Cancel": {
                "ko": "취소",
                "en": "Cancel",
                "jp": "キャンセル",
                "zh": "取消"
            },
            "New Chatbot": {
                "ko": "New Chatbot",
                "en": "New Chatbot",
                "jp": "新しいチェッボッ",
                "zh": "新的聊天机器人"
            },
            "Blank Bot": {
                "ko": "Blank Bot",
                "en": "Blank Bot",
                "jp": "空いたボット",
                "zh": "空白机器人"
            },
            "Templates": {
                "ko": "템플릿",
                "en": "Templates",
                "jp": "テンプレート",
                "zh": "模板"
            },
            "Service": {
                "ko": "서비스",
                "en": "Service",
                "jp": "サービス",
                "zh": "服务"
            },
            "Create Bot": {
                "ko": "봇 만들기",
                "en": "Create Bot",
                "jp": "ボット作り",
                "zh": "创建机器人"
            },
            "Id": {
                "ko": "아이디",
                "en": "Id",
                "jp": "ハンドルネーム",
                "zh": "账号"
            },
            "Name": {
                "ko": "이름",
                "en": "Name",
                "jp": "名前",
                "zh": "名称"
            },
            "Language": {
                "ko": "언어",
                "en": "Language",
                "jp": "言語",
                "zh": "语言"
            },
            "Description": {
                "ko": "설명",
                "en": "Description",
                "jp": "説明",
                "zh": "描述"
            },
            "Create": {
                "ko": "Create",
                "en": "Create",
                "jp": "作り",
                "zh": "创建"
            },
            " 머니브레인 MoneyBrain\"": {
                "ko": "\"아테나 Athena - 인공지능 챗봇 플랫폼",
                "en": " 머니브레인 MoneyBrain\"",
                "jp": "\"Athena - Conversational A.I. Platform",
                "zh": " MoneyBrain\""
            },
            "Docs": {
                "ko": "Docs",
                "en": "Docs",
                "jp": "文書",
                "zh": "文件"
            },
            "Forum": {
                "ko": "Forum",
                "en": "Forum",
                "jp": "フォーラム",
                "zh": "论坛"
            },
            "Support": {
                "ko": "Support",
                "en": "Support",
                "jp": "サポート",
                "zh": "支持"
            },
            "Store": {
                "ko": "Store",
                "en": "Store",
                "jp": "ストア",
                "zh": "商店"
            },
            "Bot Profile": {
                "ko": "봇 프로필",
                "en": "Bot Profile",
                "jp": "ボットプロフィール",
                "zh": "机器人配置文件"
            },
            "Dialog Develop": {
                "ko": "다이얼로그 개발하기",
                "en": "Dialog Develop",
                "jp": "ダイアログ開発すること",
                "zh": "开发对话"
            },
            "Dialog Learning": {
                "ko": "대화 학습",
                "en": "Dialog Learning",
                "jp": "対話学習",
                "zh": "对话学习"
            },
            "Dialog Graph": {
                "ko": "다이얼로그 그래프",
                "en": "Dialog Graph",
                "jp": "ダイアロググラフ",
                "zh": "对话框图"
            },
            "Dialog Learning trains questions and answers accordingly.": {
                "ko": "대화 학습 기능은 1:1로 이루어진 질문답변을 챗봇에게 학습 시키는 기능입니다.",
                "en": "Dialog Learning trains questions and answers accordingly.",
                "jp": "対話学習機能は1:1で行われた質問の答弁をチェッボッに学習させる機能です。",
                "zh": "对话学习功能可以对聊天机器人进行1对1式问题对答案的训练。"
            },
            "Dialog Graph can develop a staged conversation. This enables a in-depth communication with users. It also can utilize intent": {
                "ko": "대화 그래프 개발 기능은 단계적인 대화를 개발할 수 있는 기능입니다 이 기능은 이용자와 심도 있는 대화를 구성 하는데 유용하며 인텐트 엔터티 정규식 기능을 활용 할 수 있습니다.",
                "en": "Dialog Graph can develop a staged conversation. This enables a in-depth communication with users. It also can utilize intent",
                "jp": " entity and regular expressions.",
                "zh": "対話グラフ開発機能は段階的な対話を開発できる機能ですこの機能は利用者と踏み込んだ対話を構成するのに有効かつインテントゥエントティ正規式機能を活用することができます。"
            },
            "Short cut": {
                "ko": "바로가기",
                "en": "Short cut",
                "jp": "ショートカット",
                "zh": "快捷方式"
            },
            "Dialog Management": {
                "ko": "대화 관리",
                "en": "Dialog Management",
                "jp": "対話管理",
                "zh": "对话管理"
            },
            "Dialog Set": {
                "ko": "대화셋",
                "en": "Dialog Set",
                "jp": "デファセッ",
                "zh": "问答添加模块"
            },
            "Intent": {
                "ko": "인텐트",
                "en": "Intent",
                "jp": "インテントゥ",
                "zh": "意图"
            },
            "Entity": {
                "ko": "엔터티",
                "en": "Entity",
                "jp": "エントティ",
                "zh": "实体"
            },
            "Task": {
                "ko": "테스크",
                "en": "Task",
                "jp": "タスク",
                "zh": "任务"
            },
            "Manage the trained dialog knowledge.": {
                "ko": "학습 시킨 대화 지식을 관리 할 수 있습니다.",
                "en": "Manage the trained dialog knowledge.",
                "jp": "学習させた対話知識を管理できます。",
                "zh": "可以管理训练过的对话知识。"
            },
            "Manage your dialog graph.": {
                "ko": "대화 그래프를 관리 할 수 있습니다.",
                "en": "Manage your dialog graph.",
                "jp": "対話のグラフを管理できます。",
                "zh": "可以管理对话框图。"
            },
            "Add or Edit your Intent.": {
                "ko": "Intent를 추가 및 편집 할 수 있습니다.",
                "en": "Add or Edit your Intent.",
                "jp": "Intentを追加および編集することができます。",
                "zh": "可以添加和编辑意图。"
            },
            "Add or Edit your Task.": {
                "ko": "Task를 추가 및 편집 할 수 있습니다.",
                "en": "Add or Edit your Task.",
                "jp": "Taskを追加および編集することができます。",
                "zh": "可以添加和编辑任务。"
            },
            "default": {
                "ko": "기본값",
                "en": "default",
                "jp": "デフォルト値",
                "zh": "默认"
            },
            "Question": {
                "ko": "Question",
                "en": "Question",
                "jp": "質問",
                "zh": "问题"
            },
            "Answer": {
                "ko": "Answer",
                "en": "Answer",
                "jp": "答弁",
                "zh": "答案"
            },
            "New Dialog": {
                "ko": "New Dialog",
                "en": "New Dialog",
                "jp": "新しい対話",
                "zh": "新的对话框"
            },
            "Topic": {
                "ko": "Topic",
                "en": "Topic",
                "jp": "テーマ",
                "zh": "话题"
            },
            "Are you sure you want to delete this item?": {
                    "ko": "정말 삭제하시겠습니까?",
                "en": "Are you sure you want to delete this item?",
                "jp": "本当に削除しますか",
                "zh": "您确定要删除吗？"
            },
            "Compact": {
                "ko": "간단히 보기",
                "en": "Compact",
                "jp": "簡単に見ること",
                "zh": "紧凑"
            },
            "Undo": {
                "ko": "실행취소",
                "en": "Undo",
                "jp": "戻る",
                "zh": "返回 "
            },
            "Redo": {
                "ko": "다시실행",
                "en": "Redo",
                "jp": "もう一度する",
                "zh": "重来"
            },
            "Save": {
                "ko": "저장",
                "en": "Save",
                "jp": "保存する",
                "zh": "保存"
            },
            "Back to Failed Dialog": {
                "ko": "실패 대화로 돌아가기",
                "en": "Back to Failed Dialog",
                "jp": "失敗対話に戻ること",
                "zh": "返回失败的对话"
            },
            "Saved.": {
                "ko": "저장되었습니다!",
                "en": "Saved!",
                "jp": "保存されました!",
                "zh": "保存成功！"
            },
            "Update is not saved. Do you want to exit without saving?": {
                "ko": "변경사항이 저장되지 않았습니다. 이동하시겠습니까?",
                "en": "Update is not saved. Do you want to exit without saving?",
                "jp": "変更事項が保存されませんでした。 移動しますか。",
                "zh": "变动的部分还没有进行保存。您确定要转向其他页面吗？"
            },
            "Graph Loading Failed": {
                "ko": "그래프 로드 실패",
                "en": "Graph Loading Failed",
                "jp": "グラフロード失敗",
                "zh": ""
            },
            "File not found.": {
                "ko": "파일을 찾을 수 없습니다",
                "en": "File not found.",
                "jp": "ファイルが見つかりません。",
                "zh": "未找到文件。"
            },
            "The last entity cannot be deleted.": {
                "ko": "마지막 엔티티는 삭제할 수 없습니다",
                "en": "The last entity cannot be deleted.",
                "jp": "最後のエンティティは削除できません",
                "zh": "最后的实体不能被删除。"
            },
            "The last synonym cannot be deleted.": {
                "ko": "마지막 Synonym은 삭제할 수 없습니다",
                "en": "The last synonym cannot be deleted.",
                "jp": "最後のSynonymは削除することはできません",
                "zh": "最后的同义词不能被删除。"
            },
            "The last input cannot be deleted.": {
                "ko": "마지막 Input은 삭제할 수 없습니다",
                "en": "The last input cannot be deleted.",
                "jp": "最後のInputは削除することはできません",
                "zh": "最后一个输入不能被删除。"
            },
            "Filename is duplicated. Keep going?": {
                "ko": "파일이름이 중복되었습니다. 계속 하시겠습니까?",
                "en": "Filename is duplicated. Keep going?",
                "jp": "ファイル名前が重複しました。 続きますか。",
                "zh": "文件名重复。您确定要继续吗？"
            },
            "More": {
                "ko": "더 보기",
                "en": "More",
                "jp": "もっと見る",
                "zh": "更"
            },
            "Add Child": {
                "ko": "차일드 생성",
                "en": "Add Child",
                "jp": "チャイルド生成",
                "zh": "添加子对话框"
            },
            "Move Up": {
                "ko": "위로 가기",
                "en": "Move Up",
                "jp": "上へ行く",
                "zh": "上移"
            },
            "Move Down": {
                "ko": "아래로 가기",
                "en": "Move Down",
                "jp": "の下に行くこと",
                "zh": "下移"
            },
            "Duplicate": {
                "ko": "복제하기",
                "en": "Duplicate",
                "jp": "コピー",
                "zh": "复制"
            },
            "Delete": {
                "ko": "삭제하기",
                "en": "Delete",
                "jp": "削除すること",
                "zh": "删除"
            },
            "New dialog": {
                "ko": "새로만들기",
                "en": "New dialog",
                "jp": "新たに創出すること",
                "zh": "新的对话框"
            },
            "Advanced": {
                "ko": "고급",
                "en": "Advanced",
                "jp": "高級",
                "zh": "高级 "
            },
            "Dialog name": {
                "ko": "대화이름",
                "en": "Dialog name",
                "jp": "対話の名前",
                "zh": "对话框名称"
            },
            "Input": {
                "ko": "입력값",
                "en": "Input",
                "jp": "入力値",
                "zh": "输入"
            },
            "Output": {
                "ko": "출력값",
                "en": "Output",
                "jp": "出力値",
                "zh": "输出"
            },
            "Edit here.": {
                "ko": "여기를 편집하세요",
                "en": "Edit here.",
                "jp": "ここを編集してください",
                "zh": "请在这里编辑。"
            },
            "Create a button name.": {
                "ko": "버튼 이름을 입력하세요",
                "en": "Create a button name.",
                "jp": "ボタンの名前を入力してください",
                "zh": "请在这里输入按钮名称。"
            },
            "Write URL address here.": {
                "ko": "URL을 입력하세요",
                "en": "Write URL address here.",
                "jp": "URLを入力してください",
                "zh": "请在这里写URL地址。"
            },
            " #인텐트": {
                "ko": "\"키워드",
                "en": " #인텐트",
                "jp": " @엔티티",
                "zh": " $타입"
            },
            "and": {
                "ko": "그리고",
                "en": "and",
                "jp": "それに。",
                "zh": "和"
            },
            "or": {
                "ko": "또는",
                "en": "or",
                "jp": "または",
                "zh": "或"
            },
            "Content": {
                "ko": "컨텐츠",
                "en": "Content",
                "jp": "コンテント",
                "zh": "内容"
            },
            "Action": {
                "ko": "액션",
                "en": "Action",
                "jp": "アクション",
                "zh": "动作 "
            },
            "IF": {
                "ko": "조건",
                "en": "IF",
                "jp": "条件",
                "zh": "条件 "
            },
            "Add image": {
                "ko": "이미지 삽입",
                "en": "Add image",
                "jp": "イメージの挿入",
                "zh": "添加图片"
            },
            "Click to change image": {
                "ko": "이미지 변경",
                "en": "Click to change image",
                "jp": "イメージ変更",
                "zh": "点击更改图像"
            },
            "Add button": {
                "ko": "버튼 삽입",
                "en": "Add button",
                "jp": "ボタン挿入",
                "zh": "添加按钮"
            },
            "Action1": {
                "ko": "액션 1",
                "en": "Action1",
                "jp": "アクション1",
                "zh": "动作1"
            },
            "Action Type": {
                "ko": "액션 타입",
                "en": "Action Type",
                "jp": "アクションタイプ",
                "zh": "动作类型"
            },
            "Dialog Select": {
                "ko": "대화 선택",
                "en": "Dialog Select",
                "jp": "対話選択",
                "zh": "对话框选择"
            },
            "Option": {
                "ko": "옵션",
                "en": "Option",
                "jp": "オプション",
                "zh": "选项"
            },
            "One more backspace will delete the Input.": {
                "ko": "한번더 Backpace를 누르면 Input이 삭제됩니다.",
                "en": "One more backspace will delete the Input.",
                "jp": "もう一度Backpaceを押すとInputが削除されます。",
                "zh": "再输入一个删除键将删除输入。"
            },
            "Intent is applied as the form of input.": {
                "ko": "이미 인텐트 형태의 Input이 추가되어 있습니다.",
                "en": "Intent is applied as the form of input.",
                "jp": "すでにインテントゥ形のInputが追加されています。",
                "zh": "意图输入添加成功。"
            },
            "Input cannot be changed to other forms of input.": {
                "ko": "다른 형태의 Input으로 변경할 수 없습니다.",
                "en": "Input cannot be changed to other forms of input.",
                "jp": "他の形のInputに変更できません。",
                "zh": "输入不能改变为其他形式的输入。"
            },
            "Regular Expression is applied as the form of input.": {
                "ko": "이미 정규식 형태의 Input이 추가되어 있습니다",
                "en": "Regular Expression is applied as the form of input.",
                "jp": "すでに正規式の形のInputが追加されています",
                "zh": "正则表达式输入添加成功。"
            },
            "Conditional Expression is applied as the form of input.": {
                "ko": "이미 조건식 형태의 Input이 추가되어 있습니다",
                "en": "Conditional Expression is applied as the form of input.",
                "jp": "すでに趙建植(チョ・ゴンシク)形のInputが追加されています",
                "zh": "条件表达式输入添加成功。"
            },
            "Text is applied as the form of input.": {
                "ko": "이미 텍스트 형태의 Input이 추가되어 있습니다.",
                "en": "Text is applied as the form of input.",
                "jp": "すでにテキスト形式のInputが追加されています。",
                "zh": "文本输入添加成功。"
            },
            "The last Output cannot be deleted.": {
                "ko": "마지막 Output은 삭제할 수 없습니다",
                "en": "The last Output cannot be deleted.",
                "jp": "最後のOutputは削除することはできません",
                "zh": "最后的输出不能被删除。"
            },
            "\"When editing output with complex structure": {
                "ko": "복잡한 Output 구조 편집중에는 Basic모드로 전환할 수 없습니다.",
                "en": "\"When editing output with complex structure",
                "jp": " it is not possible to switch to the basic mode.\"",
                "zh": "複雑なOutput構造、編集中にはBasicモードに転換できません。"
            },
            "Entity Add": {
                "ko": "엔터티 추가하기",
                "en": "Entity Add",
                "jp": "エントティ追加すること",
                "zh": "实体添加"
            },
            "Entity name": {
                "ko": "Entity name",
                "en": "Entity name",
                "jp": "エントティの名前",
                "zh": "实体名称"
            },
            "Value Name": {
                "ko": "Value Name",
                "en": "Value Name",
                "jp": "バリューの名前",
                "zh": "值名称"
            },
            "Synonyms": {
                "ko": "동의어",
                "en": "Synonyms",
                "jp": "同義語",
                "zh": "同义词"
            },
            "Intent Add": {
                "ko": "인텐트 추가하기",
                "en": "Intent Add",
                "jp": "インテントゥ追加すること",
                "zh": "意图添加"
            },
            "Intent name": {
                "ko": "Intent name",
                "en": "Intent name",
                "jp": "インテントゥの名前",
                "zh": "意图名称"
            },
            "Intent sentence": {
                "ko": "인텐트 문장",
                "en": "Intent sentence",
                "jp": "インテントゥ文章",
                "zh": "意图句子"
            },
            "Import": {
                "ko": "불러오기",
                "en": "Import",
                "jp": "呼ぶこと",
                "zh": "上传"
            },
            "Default": {
                "ko": "기본값",
                "en": "Default",
                "jp": "デフォルト値",
                "zh": "默认"
            },
            "Shared": {
                "ko": "공유하기",
                "en": "Shared",
                "jp": "共有すること",
                "zh": "共享"
            },
            "Add New": {
                "ko": "새로 만들기",
                "en": "Add New",
                "jp": "新たに創出すること",
                "zh": "添加"
            },
            "File Name": {
                "ko": "File Name",
                "en": "File Name",
                "jp": "ファイル名",
                "zh": "文件名称"
            },
            "empty": {
                "ko": "비우기",
                "en": "empty",
                "jp": "空にすること",
                "zh": "无"
            },
            "File Type": {
                "ko": "파일 타입",
                "en": "File Type",
                "jp": "ファイルタイプ",
                "zh": "文件类型"
            },
            "Type name of the file.": {
                "ko": "파일 이름을 입력해주세요",
                "en": "Type name of the file.",
                "jp": "ファイルの名前を入力してください",
                "zh": "输入文件的名称。"
            },
            "Close": {
                "ko": "닫기",
                "en": "Close",
                "jp": "閉じる",
                "zh": "关闭"
            },
            "Task Add": {
                "ko": "테스크 추가하기",
                "en": "Task Add",
                "jp": "タスクの追加すること",
                "zh": "任务添加"
            },
            "Task Name(It should start with a small letter)": {
                "ko": "태스크 이름(영문자 소문자로 시작해야 합니다)",
                "en": "Task Name(It should start with a small letter)",
                "jp": "タスクの名前(英字小文字で始めなければなりません)",
                "zh": "任务名称（必须以小写字母开头）"
            },
            "Task Logic": {
                "ko": "테스크 논리",
                "en": "Task Logic",
                "jp": "タスクの論理",
                "zh": "任务逻辑"
            },
            "Title": {
                "ko": "제목",
                "en": "Title",
                "jp": "タイトル",
                "zh": "标题"
            },
            "Last Update": {
                "ko": "최근 업데이트",
                "en": "Last Update",
                "jp": "最新にアップデイト",
                "zh": "最后更新"
            },
            "Usable": {
                "ko": "사용하기",
                "en": "Usable",
                "jp": "使用すること",
                "zh": "启用"
            },
            "Move to the preivious page": {
                "ko": "이전페이지이동",
                "en": "Move to the preivious page",
                "jp": "移転ページ移動",
                "zh": "转到之前页面"
            },
            "Move to the next page": {
                "ko": "다음페이지이동",
                "en": "Move to the next page",
                "jp": "次のページ移動",
                "zh": "转到下一页"
            },
            "Dialog Set Name": {
                "ko": "대화셋 이름을 입력해주세요",
                "en": "Dialog Set Name",
                "jp": "デファセッの名前を入力してください",
                "zh": "对话框设置名称"
            },
            "Type contents": {
                "ko": "내용을 입력해주세요",
                "en": "Type contents",
                "jp": "内容を入力してください",
                "zh": "输入内容"
            },
            "(csv or xlsx file)": {
                "ko": "(csv 또는 xlsx 파일)",
                "en": "(csv or xlsx file)",
                "jp": "(csvまたはxlsxファイル)",
                "zh": "（csv或xlsx文件）"
            },
            "Type": {
                "ko": "타입",
                "en": "Type",
                "jp": "タイプ",
                "zh": "类型"
            },
            "Contents": {
                "ko": "컨텐츠",
                "en": "Contents",
                "jp": "コンテンツ",
                "zh": "内容"
            },
            "List": {
                "ko": "목록",
                "en": "List",
                "jp": "リスト",
                "zh": "目录"
            },
            "Synonym": {
                "ko": "유의어",
                "en": "Synonym",
                "jp": "類義語",
                "zh": "近义词"
            },
            "Add": {
                "ko": "추가하기",
                "en": "Add",
                "jp": "追加すること",
                "zh": "添加"
            },
            "Entity edit": {
                "ko": "엔터티 수정",
                "en": "Entity edit",
                "jp": "エントティ修正",
                "zh": "实体编辑"
            },
            "OO is duplicated name. ": {
                "ko": "OO은 중복된 이름 입니다.",
                "en": "OO is duplicated name. ",
                "jp": "OOは重複する名前です。",
                "zh": "OO是重复的名称。"
            },
            "Type the Intent Name.": {
                "ko": "인텐트 이름을 입력해주세요",
                "en": "Type the Intent Name.",
                "jp": "インテントゥの名前を入力してください",
                "zh": "请输入意图名称。"
            },
            "Add contents.": {
                "ko": "내용을 추가해주세요",
                "en": "Add contents.",
                "jp": "内容を追加してください",
                "zh": "添加意图内容。"
            },
            "contents": {
                "ko": "내용",
                "en": "contents",
                "jp": "内容",
                "zh": "内容"
            },
            "delete": {
                "ko": "삭제",
                "en": "delete",
                "jp": "削除",
                "zh": "删除"
            },
            "Task Name": {
                "ko": "테스크 이름",
                "en": "Task Name",
                "jp": "タスクの名前",
                "zh": "任务名称"
            },
            "Operation": {
                "ko": "운영",
                "en": "Operation",
                "jp": "機能",
                "zh": "功能"
            },
            "User": {
                "ko": "사용자",
                "en": "User",
                "jp": "使用者",
                "zh": "用户"
            },
            "Search": {
                "ko": "검색하기",
                "en": "Search",
                "jp": "検索すること",
                "zh": "搜索"
            },
            "Advanced Search": {
                "ko": "고급 검색",
                "en": "Advanced Search",
                "jp": "高級検索",
                "zh": "高级搜索"
            },
            "Clear": {
                "ko": "",
                "en": "Clear",
                "jp": "",
                "zh": "清除"
            },
            "Failed Dialog": {
                "ko": "실패대화",
                "en": "Failed Dialog",
                "jp": "失敗対話",
                "zh": "失败的对话框"
            },
            "Management": {
                "ko": "관리",
                "en": "Management",
                "jp": "管理",
                "zh": "管理"
            },
            "Previous Dialog": {
                "ko": "이전 대화",
                "en": "Previous Dialog",
                "jp": "以前対話",
                "zh": "上一个对话框"
            },
            "User Input": {
                "ko": "사용자 입력값",
                "en": "User Input",
                "jp": "ユーザ入力値",
                "zh": "用户输入"
            },
            "Count": {
                "ko": "카운트",
                "en": "Count",
                "jp": "カウント",
                "zh": "计数"
            },
            "Manage": {
                "ko": "관리",
                "en": "Manage",
                "jp": "管理",
                "zh": "管理"
            },
            "Suggestion related by question.": {
                "ko": "질문 중심의 추천목록",
                "en": "Suggestion related by question.",
                "jp": "質問中心の推薦リスト",
                "zh": "以问题为中心的推荐目录"
            },
            "Suggestion related by answer.": {
                "ko": "답변 중심의 추천목록",
                "en": "Suggestion related by answer.",
                "jp": "答弁中心の推薦リスト",
                "zh": "以答案为中心的推荐目录"
            },
            "Real Time Users": {
                "ko": "실시간 이용자",
                "en": "Real Time Users",
                "jp": "リアルタイム利用者",
                "zh": "实时用户"
            },
            "Cumulated number of Dialogs": {
                "ko": "누적 대화량",
                "en": "Cumulated number of Dialogs",
                "jp": "累積デファリャン",
                "zh": "累计对话量"
            },
            "Number of Dialogs(30days)": {
                "ko": "대화량 (30일)",
                "en": "Number of Dialogs(30days)",
                "jp": "デファリャン(30日)",
                "zh": "对话量（最近30天）"
            },
            "Number of Cumulated Users": {
                "ko": "누적 이용자",
                "en": "Number of Cumulated Users",
                "jp": "累積利用者",
                "zh": "累计用户量"
            },
            "Recent(30 days) Users.": {
                "ko": "최근 30일 이용자",
                "en": "Recent(30 days) Users.",
                "jp": "最近、30日利用者",
                "zh": "最近30天的用户"
            },
            "Number of daily Users": {
                "ko": "일자별 대화량",
                "en": "Number of daily Users",
                "jp": "日付別デファリャン",
                "zh": "日用户量"
            },
            "User distribution on channels": {
                "ko": "채널별 이용자 분포",
                "en": "User distribution on channels",
                "jp": "チャンネル別利用者の分布",
                "zh": "用户在各频道上的分布"
            },
            "Rate of Successive Dialogs": {
                "ko": "대화 성공률",
                "en": "Rate of Successive Dialogs",
                "jp": "対話の成功率",
                "zh": "成功的对话数"
            },
            "Success": {
                "ko": "성공",
                "en": "Success",
                "jp": "成功",
                "zh": "成功"
            },
            "Fail": {
                "ko": "실패",
                "en": "Fail",
                "jp": "失敗",
                "zh": "失败"
            },
            "Top 10 Most Frequently Used Input": {
                "ko": "사용자 입력 TOP 10",
                "en": "Top 10 Most Frequently Used Input",
                "jp": "ユーザ入力TOP 10",
                "zh": "最常用的输入前10"
            },
            "Top 10 Failed Dialog": {
                "ko": "대화 실패 TOP 10",
                "en": "Top 10 Failed Dialog",
                "jp": "対話失敗TOP 10",
                "zh": "对话失败前10"
            },
            "Top 10 scenario usage": {
                "ko": "시나리오 사용량 TOP 10",
                "en": "Top 10 scenario usage",
                "jp": "シナリオの使用量TOP 10",
                "zh": "场景使用量前10"
            },
            "Dialog": {
                "ko": "대화",
                "en": "Dialog",
                "jp": "対話",
                "zh": "对话"
            },
            "amount of usage": {
                "ko": "사용량",
                "en": "amount of usage",
                "jp": "使用量",
                "zh": "使用量"
            },
            "Excel Download": {
                "ko": "Excel 다운로드",
                "en": "Excel Download",
                "jp": "Excelダウンロード",
                "zh": "Excel下载"
            },
            "Historical amount of dialog(channel)": {
                "ko": "기간별 대화량 (채널)",
                "en": "Historical amount of dialog(channel)",
                "jp": "期間別デファリャン(チャネル)",
                "zh": "不同时间段对话量（频道）"
            },
            "Historical amount of dialog(Success/Fail)": {
                "ko": "기간별 대화량 (성공/실패)",
                "en": "Historical amount of dialog(Success/Fail)",
                "jp": "期間別デファリャン(成功/失敗)",
                "zh": "不同时间段对话量（成功/失败）"
            },
            "Ratio of dialog on channels": {
                "ko": "채널별 대화 비율",
                "en": "Ratio of dialog on channels",
                "jp": "チャンネル別対話の割合",
                "zh": "不同频道上的对话比率"
            },
            "Kakaotalk": {
                "ko": "카카오톡",
                "en": "Kakaotalk",
                "jp": "カカオトーク",
                "zh": "Kakaotalk"
            },
            "Facebook": {
                "ko": "페이스북",
                "en": "Facebook",
                "jp": "フェイスブック",
                "zh": "Facebook"
            },
            "Naver talk talk": {
                "ko": "네이버 톡톡",
                "en": "Naver talk talk",
                "jp": "ネイバー、トクトク",
                "zh": "Naver talk talk"
            },
            "Daily users": {
                "ko": "일별 사용자",
                "en": "Daily users",
                "jp": "ことごとの使用者",
                "zh": "日用户"
            },
            "Channel users": {
                "ko": "채널별 사용자",
                "en": "Channel users",
                "jp": "チャンネル別の使用者",
                "zh": "频道用户"
            },
            "Total": {
                "ko": "합계",
                "en": "Total",
                "jp": "合計",
                "zh": "总计"
            },
            "Today": {
                "ko": "오늘",
                "en": "Today",
                "jp": "今日",
                "zh": "今天"
            },
            "Yesterday": {
                "ko": "어제",
                "en": "Yesterday",
                "jp": "昨日",
                "zh": "昨天"
            },
            "Last 7 days": {
                "ko": "지난 7일",
                "en": "Last 7 days",
                "jp": "この7日",
                "zh": "最近7天"
            },
            "Last 30 days": {
                "ko": "지난 30일",
                "en": "Last 30 days",
                "jp": "この30日",
                "zh": "最近30天"
            },
            "This Month": {
                "ko": "이번 달",
                "en": "This Month",
                "jp": "今月",
                "zh": "本月"
            },
            "Last Month": {
                "ko": "지난 달",
                "en": "Last Month",
                "jp": "先月",
                "zh": "上个月"
            },
            "Select Dates": {
                "ko": "날짜 직접 선택",
                "en": "Select Dates",
                "jp": "日付直接選択",
                "zh": "选择日期"
            },
            "Apply": {
                "ko": "적용",
                "en": "Apply",
                "jp": "適用",
                "zh": "申请"
            },
            "Trained Dialog": {
                "ko": "학습 대화 목록",
                "en": "Trained Dialog",
                "jp": "学習対話目録",
                "zh": "学习过的对话目录"
            },
            "Graph ID": {
                "ko": "그래프 아이디",
                "en": "Graph ID",
                "jp": "グラフ・アイディ",
                "zh": "图表ID"
            },
            "Graph Name": {
                "ko": "그래프 이름",
                "en": "Graph Name",
                "jp": "グラフの名前",
                "zh": "图表名称"
            },
            "Dialog number": {
                "ko": "대화숫자",
                "en": "Dialog number",
                "jp": "対話数字",
                "zh": "对话数字"
            },
            "User's input": {
                "ko": "이용자 입력",
                "en": "User's input",
                "jp": "利用者入力",
                "zh": "用户的输入"
            },
            "1st": {
                "ko": "1위",
                "en": "1st ",
                "jp": "1位",
                "zh": "第1"
            },
            "2nd": {
                "ko": "2위",
                "en": "2nd",
                "jp": "2位",
                "zh": "第2"
            },
            "3rd": {
                "ko": "3위",
                "en": "3rd",
                "jp": "3位",
                "zh": "第3"
            },
            "4th": {
                "ko": "4위",
                "en": "4th",
                "jp": "4位",
                "zh": "第4"
            },
            "5th": {
                "ko": "5위",
                "en": "5th",
                "jp": "5位",
                "zh": "第5"
            },
            "Top 10 Intent": {
                "ko": "인텐트 TOP 10",
                "en": "Top 10 Intent",
                "jp": "インテントゥTOP 10",
                "zh": "意图使用前10"
            },
            "List of Failed Dialog": {
                "ko": "실패 대화 목록",
                "en": "List of Failed Dialog",
                "jp": "失敗対話目録",
                "zh": "失败的对话目录"
            },
            "Number of Failure": {
                "ko": "실패횟수",
                "en": "Number of Failure",
                "jp": "失敗回数",
                "zh": "失败次数"
            },
            "Dashboard": {
                "ko": "대시보드",
                "en": "Dashboard",
                "jp": "ダッシュボード",
                "zh": "我的主页"
            },
            "Development": {
                "ko": "개발",
                "en": "Development",
                "jp": "開発",
                "zh": "开发"
            },
            "Channel": {
                "ko": "채널",
                "en": "Channel",
                "jp": "チャンネル",
                "zh": "频道 "
            },
            "Human Chat log -> Live Chat log": {
                "ko": "라이브 채팅",
                "en": "Human Chat log -> Live Chat log",
                "jp": "ライブチャット",
                "zh": "即时聊天"
            },
            "AI Chat log": {
                "ko": "인공지능 대화 내역",
                "en": "AI Chat log",
                "jp": "人工知能チャットのログ",
                "zh": "AI聊天记录"
            },
            "Failed Chat log": {
                "ko": "실패 대화 로그",
                "en": "Failed Chat log",
                "jp": "失敗対話ログ",
                "zh": "失败的聊天记录"
            },
            "Analysis": {
                "ko": "분석",
                "en": "Analysis",
                "jp": "分析",
                "zh": "分析"
            },
            "Summary": {
                "ko": "요약",
                "en": "Summary",
                "jp": "要約",
                "zh": "概括"
            },
            "Dialog Traffic": {
                "ko": "대화량",
                "en": "Dialog Traffic",
                "jp": "デファリャン",
                "zh": "对话量"
            },
            "Session": {
                "ko": "세션",
                "en": "Session",
                "jp": "セッション",
                "zh": "对话"
            },
            "Dialog Graph Path": {
                "ko": "대화 경로",
                "en": "Dialog Graph Path",
                "jp": "対話ルート",
                "zh": "对话框图路径"
            },
            "Dialog Training": {
                "ko": "대화학습",
                "en": "Dialog Training",
                "zh": "对话培训",
                "jp": "ダイアログトレーニング"
            },
            "Dialog Training Usage": {
                "ko": "대화 학습 이용",
                "en": "Dialog Training Usage",
                "jp": "会話学習の利用",
                "zh": "对话学习的使用"
            },
            "Dialog Graph Usage": {
                "ko": "대화 그래프 이용",
                "en": "Dialog Graph Usage",
                "jp": "対話グラフを利用",
                "zh": "对话框图的使用"
            },
            "Dialog Training Input": {
                "ko": "대화 학습 입력값",
                "en": "Dialog Training Input",
                "jp": "対話学習、入力値",
                "zh": "对话学习输入"
            },
            "Dialog Graph Input": {
                "ko": "대화 그래프 입력값",
                "en": "Dialog Graph Input",
                "jp": "対話のグラフの入力値",
                "zh": "对话框图输入"
            },
            "Failed Dialogs": {
                "ko": "실패 대화",
                "en": "Failed Dialogs",
                "jp": "失敗対話",
                "zh": "失败的对话框"
            },
            "Bot Link": {
                "ko": "Bot Link",
                "en": "Bot Link",
                "jp": "Bot Link",
                "zh": "Bot连接"
            },
            "Entity analysis": {
                "ko": "엔터티 분석",
                "en": "Entity analysis",
                "jp": "Entity analysis",
                "zh": "实体分析"
            },
            "Intent analysis": {
                "ko": "인텐트 분석",
                "en": "Intent analysis",
                "jp": "Intent analysis",
                "zh": "意图分析"
            },
            "KaKao Talk": {
                "ko": "카카오톡",
                "en": "KaKao Talk",
                "jp": "KaKao Talk",
                "zh": "KaKao Talk"
            },
            "LOG": {
                "ko": "로그",
                "en": "LOG",
                "jp": "LOG",
                "zh": "日志"
            },
            "Line": {
                "ko": "라인",
                "en": "Line",
                "jp": "Line",
                "zh": "Line"
            },
            "Messanger": {
                "ko": "Messanger",
                "en": "Messanger",
                "jp": "Messanger",
                "zh": "Messanger"
            },
            "Naver Talk Talk": {
                "ko": "네이버 톡톡",
                "en": "Naver Talk Talk",
                "jp": "Naver Talk Talk",
                "zh": "Naver Talk Talk"
            },
            "Signout": {
                "ko": "로그아웃",
                "en": "Signout",
                "jp": "Signout",
                "zh": "注销"
            },









            // 새로 추가된 부분
            "ID": {
                "ko": "아이디",
                "en": "Id",
                "zh" : "Id",
                "jp" : "Id"
            },
            "Korean": {
                "ko": "한국어",
                "en": "Korean",
                "zh": "韩语",
                "jp": "韓国語"
            },
            "English": {
                "ko": "영어",
                "en": "English",
                "zh": "英语",
                "jp": "英語"
            },
            "Chinese": {
                "ko": "중국어",
                "en": "Chinese",
                "zh": "中文",
                "jp": "中国語"
            },
            "Japanese": {
                "ko": "일본어",
                "en": "Japanese",
                "zh": "日本",
                "jp": "日本語"
            },
            "Rename": {
                "ko": "이름변경",
                "en": "Rename",
                "zh": "改名",
                "jp": "名前を変更する"
            },
            "Confirm": {
                "ko": "확인",
                "en": "Confirm",
                "zh": "确认",
                "jp": "確認"
            },
            "Task name": {
                "ko": "Task 이름",
                "en": "Task name",
                "zh": "任务名称",
                "jp": "Task name"
            },
            "Type Add": {
                "ko": "Type 추가",
                "en": "Type Add",
                "zh": "输入Add",
                "jp": "タイプ追加"
            },
            "Type Logic": {
                "ko": "Type 로직",
                "en": "Type Logic",
                "zh": "类型逻辑",
                "jp": "タイプロジック"
            },
            "Type name": {
                "ko": "Type 이름",
                "en": "Type name",
                "zh": "类型名称",
                "jp": "型名"
            },
            "Press Enter to add": {
                "ko": "Enter를 누르면 추가됩니다",
                "en": "Press Enter to add",
                "zh": "按Enter键添加。",
                "jp": "Enterキーを押すと、追加されます。"
            },
            "Content is already added": {
                "ko": "Content가 이미 추가되었습니다.",
                "en": "Content is already added",
                "zh": "内容已添加",
                "jp": "コンテンツは既に追加されています"
            },
            "Intent edit": {
                "ko": "Intent 편집",
                "en": "Intent edit",
                "zh": "意图编辑",
                "jp": "インテント編集"
            },
            "Create File" : {
                "ko": "파일생성",
                "en": "Create File",
                "zh": "创建文件",
                "jp": "ファイルの作成"
            },
            "New Memo": {
                "ko": "새로운메모",
                "en": "New Memo",
                "zh": "新备忘录",
                "jp": "新しいメモ"
            },
            "History": {
                "ko": "History",
                "en": "History",
                "zh": "History",
                "jp": "History"
            },
            "Dialog Count": {
                "ko": "대화수",
                "en": "Dialog Count",
                "zh": "对话量",
                "jp": "ダイアログ数"
            },
            "Use Count": {
                "ko": "사용횟수",
                "en": "Use Count",
                "zh": "使用量",
                "jp": "カウントを使用する"
            },
            "Dialog Input": {
                "ko": "대화입력",
                "en": "Dialog Input",
                "zh": "对话框输入",
                "jp": "ダイアログ入力"
            },
            "Basic Information": {
                "ko": "기본정보",
                "en": "Basic Information",
                "zh": "基本信息",
                "jp": "基本情報"
            },
            "Copy": {
                "ko": "복사",
                "en": "Copy",
                "zh": "复制",
                "jp": "コピー"
            },
            "Copied the text!": {
                "ko": "복사되었습니다!",
                "en": "Copied the text!",
                "zh": "复制文本！",
                "jp": "テキストをコピーしました！"
            },
            "New to Playchat?": {
                "ko": "플레이챗에 처음이십니까?",
                "en": "New to PlayChat?",
                "zh": "PlayChat新手？",
                "jp": "PlayChatを初めてお使いですか？"
            },
            "Choose Dialogset": {
                "ko": "대화셋 선택",
                "en": "Choose Dialogset",
                "zh": "选择对话框",
                "jp": "ダイアログセットを選択"
            },
            "Enter dialogset name": {
                "ko": "대화셋 이름을 입력해주세요",
                "en": "Enter dialogset name",
                "zh": "输入对话框名称。",
                "jp": "ダイアログセット名を入力します。"
            },
            "If you would like to receive the e-mail again, please click on the again button.": {
                "ko": "If you would like to receive the e-mail again, please click on the again button.",
                "en": "If you would like to receive the e-mail again, please click on the again button.",
                "zh": "如果你重新接收邮件，请点击再次发送按钮",
                "jp": "If you would like to receive the e-mail again, please click on the again button."
            },
            "You do not have any Facebook pages to connect to.": {
                "ko": "연결가능한 페이스북 페이지가 없습니다.",
                "en": "You do not have any Facebook pages to connect to.",
                "zh": "您没有任何Facebook页面连接到。",
                "jp": "接続するFacebookページはありません。"
            },
            "Try now": {
                "ko": "Try now",
                "en": "Try now",
                "zh": "现在试试",
                "jp": "今すぐやってみて下さい\n"
            },
            "Connect": {
                "ko": "연결하기",
                "en": "Connect",
                "zh": "连接",
                "jp": "接続する"
            },
            "Disconnect": {
                "ko": "연결해제",
                "en": "Disconnect",
                "zh": "断开",
                "jp": "切断する"
            },
            "Please select at least one permission": {
                "ko": "하나 이상의 권한을 선택하십시오.",
                "en": "Please select at least one permission",
                "zh": "请至少选择一个权限",
                "jp": "少なくとも1つの権限を選択してください"
            },
            "Keyword, #Intent, @Entity, $Type, /RegExp/, if(Condition)": {
                "ko": "키워드, #인텐트, @엔티티, $타입, /정규식/, if(조건식)",
                "en": "Keyword, #Intent, @Entity, $Type, /RegExp/, if(Condition)",
                "zh": "关键词, #意图, @实体, $类型, /正则表达式/, if(条件)",
                "jp": "キーワード, #インテント, @エンティティ, $タイプ, /正規表現/, if(調子)"
            },
            "Human Chat log": {
                "ko": "상담원 대화 내역",
                "en": "Human Chat log",
                "zh" : "咨询对话历史记录",
                "jp" : "エージェントの会話履歴。"
            },
            "Please enter Type name": {
                "ko": "타입 이름을 입력해주세요.",
                "en": "Please enter Type name",
                "zh": "请输入类型名称。",
                "jp": "タイプ名を入力してください。"
            }
            ,
            "Please enter Task name": {
                "ko": "Task 이름을 입력해주세요.",
                "en": "Please enter Task name",
                "zh": "请输入任务名称",
                "jp": "タスク名を入力してください"
            },
            "Ignore": {
                "ko": "Ignore",
                "en": "Ignore",
                "zh": "忽视",
                "jp": "無視する"
            },
            "Jump": {
                "ko": "Jump",
                "en": "Jump",
                "zh": "跳跃",
                "jp": "ジャンプ"
            },
            "JSON Format Error": {
                "ko": "JSON 형식 오류",
                "en": "JSON Format Error",
                "zh": "JSON格式错误",
                "jp": "JSON形式のエラー"
            },
            "There is an error in the graph file or an unsupported version of the graph file.": {
                "ko": "그래프 파일에 오류가 있거나 지원하지 않는 버전의 그래프 파일입니다.",
                "en": "There is an error in the graph file or an unsupported version of the graph file.",
                "zh": "图形文件或图形文件的不受支持的版本中存在错误。",
                "jp": "グラフファイルまたはサポートされていないバージョンのグラフファイルにエラーがあります。"
            },
            "View Source": {
                "ko": "소스보기",
                "en": "View Source",
                "zh": "查看来源",
                "jp": "ソースを表示"
            },
            "JSON Format error detected. The chatbot may not work properly. Do you want to save it?": {
                "ko": "JSON Format 오류가 발견되었습니다. 챗봇이 정상적으로 동작하지 않을 수 있습니다. 저장하시겠습니까?",
                "en": "JSON Format error detected. The chatbot may not work properly. Do you want to save it?",
                "zh": "检测到JSON格式错误。 chatbot可能无法正常工作。 你想保存吗？",
                "jp": "JSONフォーマットエラーが検出されました。 チャットボットが正しく動作しない可能性があります。 それを保存しますか？"
            },
            "Typing the regular expression, press Enter to finish.": {
                "ko": "정규식 입력 중, 마치려면 Enter를 입력해주세요.",
                "en": "While typing the regular expression, press Enter to finish.",
                "zh": "输入正则表达式，按Enter完成。",
                "jp": "正規表現を入力し、Enterキーを押して終了します。"
            },
            "Entering conditional statements, press Enter to finish.": {
                "ko": "조건문 입력 중, 마치려면 Enter를 입력해주세요.",
                "en": "Entering conditional statements, press Enter to finish.",
                "zh": "输入条件语句，按Enter完成。",
                "jp": "条件文を入力し、Enterキーを押して終了します。"
            },
            "Back to Graph edit mode": {
                "ko": "그래프 편집으로 돌아가기",
                "en": "Back to Graph edit mode",
                "zh": "返回图形编辑模式",
                "jp": "グラフ編集モードに戻る"
            },
            "Select": {
                "ko": "선택",
                "en": "Select",
                "zh": "选择",
                "jp": "選択"
            },
            "Socket": {
                "ko": "소켓",
                "en": "Socket",
                "zh": "无",
                "jp": "ソケット"
            },
            "Average amount of traffic per session": {
                "ko": "세션당 평균 대화량",
                "en": "Average amount of traffic per session",
                "zh": "每个会话的平均通信量",
                "jp": "セッションあたりの平均会話量"
            },
            "Ratio": {
                "ko": "비율",
                "en": "Ratio",
                "zh": "比率",
                "jp": "比"
            },
            "User Count": {
                "ko": "이용자수",
                "en": "User Count",
                "zh": "用户数",
                "jp": "ユーザーカウント"
            },
            "Daily conversions metrics": {
                "ko": "일별 대화량 통계",
                "en": "Daily conversions metrics",
                "zh": "每日转化指标",
                "jp": "毎日のコンバージョンメトリック"
            },
            "Graph Path" :{
                "ko": "그래프 경로",
                "en": "Graph Path",
                "zh": "对话框图路径",
                "jp": "グラフパス"
            },
            "Usage Count": {
                "ko": "사용 횟수",
                "en": "Usage Count",
                "zh": "使用量",
                "jp": "使用回数"
            },
            "Template": {
                "ko": "템플릿",
                "en": "Template",
                "zh": "模板",
                "jp": "テンプレート"
            },
            "Learning": {
                "ko": "학습중",
                "en": "Learning",
                "zh": "学习中",
                "jp": "学んでいる"
            },
            "Password is disaccord": {
                "ko": "비밀번호가 일치하지 않습니다.",
                "en": "Password is disaccord",
                "zh": "密码不一致",
                "jp": "パスワードは不一致です"
            },
            "Register for free closed beta": {
                "ko": "무료로 클로즈베타 신청하기",
                "en": "Register for free closed beta",
                "zh": "注册免费内测",
                "jp": "無料クローズドベータ版に登録する"
            },
            "Registration for closed beta": {
                "ko": "클로즈베타 신청",
                "en": "Registration for closed beta",
                "zh": "申请内测。",
                "jp": "クローズドベータ版の登録。"
            },
            "Email is already signed up.": {
                "ko": "이미 등록된 이메일 입니다.",
                "en": "Email is already signed up.",
                "zh": "电子邮件已经注册。",
                "jp": "電子メールはすでにサインアップされています。"
            },
            "Phone": {
                "ko": "휴대폰",
                "en": "Phone",
                "zh": "电话",
                "jp": "電話"
            },
            "Organization": {
                "ko": "소속",
                "en": "Organization",
                "zh": "组织",
                "jp": "組織"

            },
            "WeChat": {
                "ko": "위챗",
                "en": "WeChat",
                "zh": "微信",
                "jp": "WeChat"
            },
            "Name is already using": {
                "ko": "이미 사용중인 이름입니다.",
                "en": "Name is already using",
                "zh": "名称已经在使用",
                "jp": "名前は既に使用しています"
            },
            "Manage Contents": {
                "ko": "컨텐츠 관리",
                "en": "Manage Contents",
                "zh": "内容管理",
                "jp": "Manage Contents"
            },
            "manage reservation":{
                "ko": "예약관리",
                "en": "manage reservation",
                "zh": "预约管理",
                "jp": "manage reservation"
            },
            "manage procedural information":{
                "ko": "시술정보관리",
                "en": "manage procedural information",
                "zh": "治疗信息管理",
                "jp": "manage procedural information"
            },
            "Manage Event":{
                "ko": "이벤트관리",
                "en": "Manage Event",
                "zh": "活动管理",
                "jp": "Manage Event"
            },
            "Manage Conversation Graph":{
                "ko": "대화그래프관리",
                "en": "Manage Conversation Graph",
                "zh": "对话框图管理",
                "jp": "Manage Conversation Graph"
            },
            "Manage Intent":{
                "ko": "인텐트관리",
                "en": "Manage Intent",
                "zh": "意向管理",
                "jp": "Manage Intent"
            },
            "Manage Entity":{
                "ko": "엔터티관리",
                "en": "Manage Entity",
                "zh": "实体管理",
                "jp": "Manage Entity"
            },
            "Manage Menu":{
                "ko": "메뉴관리",
                "en": "Manage Menu",
                "zh": "菜单管理",
                "jp": "Manage Menu"
            },
            "Manage orders":{
                "ko": "주문관리",
                "en": "Manage orders",
                "zh": "订单管理",
                "jp": "Manage orders"
            },
            "Manage Parking":{
                "ko": "주차정보관리",
                "en": "Manage Parking",
                "zh": "停车信息管理",
                "jp": "Manage Parking"
            },
            "Manage Shuttle":{
                "ko": "셔틀정보관리",
                "en": "Manage Shuttle",
                "zh": "班车信息管理",
                "jp": "Manage Shuttle"
            },
            "Manage Facility":{
                "ko": "시설정보관리",
                "en": "Manage Facility",
                "zh": "设施信息管理",
                "jp": "Manage Facility"
            },
            "Manage Room":{
                "ko": "객실정보관리",
                "en": "Manage Room",
                "zh": "房间信息管理",
                "jp": "Manage Room"
            },
            "Manage Dining":{
                "ko": "다이닝정보관리",
                "en": "Manage Dining",
                "zh": "餐饮信息管理",
                "jp": "Manage Dining"
            },
            "Manage Booking":{
                "ko": "예약정보관리",
                "en": "Manage Booking",
                "zh": "预订信息管理",
                "jp": "Manage Booking"
            },
            "start for free":{
                "ko": "무료로 시작하기",
                "en": "start for free",
                "zh": "免费开始",
                "jp": "start for free"
            },





            //dashboard
            "Chat bot has been made!":{
                "ko": "챗봇이 만들어졌습니다!",
                "en": "Chat bot has been made!",
                "zh": "聊天机器人创建成功!",
                "jp": "Chat bot has been made!"
            },
            "Let it study conversation":{
                "ko": "대화 학습 시키기",
                "en": "Let it study conversation",
                "zh": "让它学习对话",
                "jp": "Let it study conversation"
            },
            "We may let it learn how to answer accordingly towards the questions guests has asked":{
                "ko": "고객이 물어본 질문에 어떻게 답변하지 학습시킬 수 있습니다.",
                "en": "We may let it learn how to answer accordingly towards the questions guests has asked",
                "zh": "我们可以让它学习如何回答客户提出的问题。",
                "jp": "We may let it learn how to answer accordingly towards the questions guests has asked"
            },
            "Start Learning":{
                "ko": "학습 시작",
                "en": "Start Learning",
                "zh": "开始学习",
                "jp": "Start Learning"
            },
            "Make the Conversational scenario":{
                "ko": "대화 시나리오 만들기",
                "en": "Make the Conversational scenario",
                "zh": "创建一个对话场景",
                "jp": "Make the Conversational scenario"
            },
            "We develop the conversations to answer by phases or scenario other than just a simple question and answer.":{
                "ko": "단순한 질문 답변이 아닌, 시나리오 또는 단계적으로 답변을 할 수 있도록 대화를 개발합니다.",
                "en": "We develop the conversations to answer by phases or scenario other than just a simple question and answer.",
                "zh": "不仅仅是简单的提问和回答，我们还可以开发出具有对话场景或者阶段式回答的对话。",
                "jp": "We develop the conversations to answer by phases or scenario other than just a simple question and answer."
            },
            "Scenario Start":{
                "ko": "시나리오 시작",
                "en": "Scenario Start",
                "zh": "开始场景",
                "jp": "Scenario Start"
            },
            "Connect Channel":{
                "ko": "채널 연결",
                "en": "Connect Channel",
                "zh": "链接频道",
                "jp": "Connect Channel"
            },
            "We service chatbot by connecting to Phoneline, KakaoTalk or Facebook.":{
                "ko": "전화, 카카오톡, 페이스북에 연결해서 챗봇을 서비스합니다.",
                "en": "We service chatbot by connecting to Phoneline, KakaoTalk or Facebook.",
                "zh": "我们提供连接到电话，Kakao Talk和Facebook以提供聊天机器人的服务。",
                "jp": "We service chatbot by connecting to Phoneline, KakaoTalk or Facebook."
            },
            "Dialogue Breakdown":{
                "ko": "대화내역",
                "en": "Dialogue Breakdown",
                "zh": "对话历史记录",
                "jp": "Dialogue Breakdown"
            },
            "Artificial Intelligence may automatically review the dialogue breakdown of the conversation.":{
                "ko": "인공지능이 자동으로 상담한 대화내역을 확인 할 수 있습니다.",
                "en": "Artificial Intelligence may automatically review the dialogue breakdown of the conversation.",
                "zh": "您可以查看AI自动咨询的对话历史记录。",
                "jp": "Artificial Intelligence may automatically review the dialogue breakdown of the conversation."
            },
            "We can make it learn how to answer to the questions that it was not able to reply.":{
                "ko": "응답하지 못한 질문에 대한 답변을 학습시 킬수 있습니다.",
                "en": "We can make it learn how to answer to the questions that it was not able to reply.",
                "zh": "您可以学习回答你没有回答的问题。",
                "jp": "We can make it learn how to answer to the questions that it was not able to reply."
            },
            "usage statistics":{
                "ko": "사용통계",
                "en": "usage statistics",
                "zh": "使用情况统计",
                "jp": "usage statistics"
            },
            "You may search the usage amount by the number of conversations, number  of people logged in by dates and etc.":{
                "ko": "기간별 접속자수, 대화수, 등 사용량을 조회해 볼 수 있습니다.",
                "en": "You may search the usage amount by the number of conversations, number of people logged in by dates and etc.",
                "zh": "您可以查看每个时间周期使用的用户数量，对话数量等使用量。",
                "jp": "You may search the usage amount by the number of conversations, number of people logged in by dates and etc."
            },
            "Use the template bots to make your own chatbot in a second.":{
                "ko": "아래 두가지 템플릿을 이용하면 나만의 챗봇을 뚝딱 만들 수 있어요.",
                "en": "Use the template bots to make your own chatbot in a second.",
                "zh": "请使用下面两种方式轻松地开发聊天机器人。",
                "jp": "Use the template bots to make your own chatbot in a second."
            },
            "Bot Name":{
                "ko": "챗봇명",
                "en": "Bot Name",
                "zh": "机器人名",
                "jp": "Bot Name"
            }
        };

        var list = {};

        var lan = function(key)
        {
            if(!key)
                return '';

            key = key.trim();
            if(!languages[key])
            {
                if(!list[key])
                    list[key] = true;

                console.error('language', key);

                return 'no messages';
            }
            else
            {
                return languages[key][code] || languages[key]['en'];
            }
        };

        return lan;
    });
})();
