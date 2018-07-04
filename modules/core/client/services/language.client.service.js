//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('LanguageService', function($cookies, $rootScope)
    {
        // var user = $cookies.getObject('user');
        // var userLang = navigator.language || navigator.userLanguage;
        // var code = user ? user.language : userLang || 'en';

        // code = code.split('-')[0];

        var code = $cookies.get('language');

        $rootScope.$on('changeLanguage', function()
        {
            // user = $cookies.getObject('user');
            //
            // code = user ? user.language : userLang || 'en';
            //
            // code = code.split('-')[0];

            code = $cookies.get('language');
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
                "zh": "请使用账号密码进行登录"
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
            "Agree to Terms of Use and Privacy Policy.": {
                "ko": "이용약관 및 개인정보 보호 정책에 동의합니다.",
                "en": "Agree to Terms of Use and Privacy Policy.",
                "jp": "利用約款および個人情報保護政策に同意します。",
                "zh": "同意使用条款和隐私政策"
            },
            "Sign up": {
                "ko": "가입신청",
                "en": "Sign up",
                "jp": "ログイン",
                "zh": "登录"
            },
            "Your verification URL has expired.": {
                "ko": "인증 URL이 만료되었습니다.",
                "en": "Your verification URL has expired.",
                "zh": "您的验证网址已过期。",
                "jp": "確認URLの有効期限が切れています。"
            },
            "We sent a verification e-mail to": {
                "ko": "이메일로 인증 이메일이 전송되었습니다.",
                "en": "We sent a verification e-mail to ",
                "jp": "メールで認証メールが送られました。 ",
                "zh": "验证电子邮件已经发到您的邮箱了 "
            },
            "Please check your e-mail box. The validity time of the certificate is one hour.": {
                "ko": "이메일을 확인해주세요. 인증가능시간은 한시간 내에 마감됩니다.",
                "en": "Please check your e-mail box. The validity time of the certificate is one hour.",
                "jp": "電子メールを確認してください。 認証可能時間は一時間内に締め切られます。",
                "zh": "请检查您的电子邮箱，验证码的有效期为一个小时。"
            },
            "If you would like to receive the e-mail again": {
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
            "Signning is successfuly done": {
                "ko": "회원가입은 되었지만 E-mail 인증 메일 보내기에 실패했어요. 관리자에게 문의해주세요.",
                "en": "Signning is successfuly done",
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
            "Your account is signed up from google.": {
                "ko": "구글을 통해 이미 로그인 되어 있는 상태입니다.",
                "en": "Your account is signed up from google.",
                "jp": "あなたのアカウントはGoogleからサインアップされています。",
                "zh": "您已经通过Google账号进行了登录。"
            },
            "Your account is signed up from facebook.": {
                "ko": "페이스북 통해 이미 로그인 되어 있는 상태입니다.",
                "en": "Your account is signed up from facebook.",
                "jp": "あなたのアカウントはFacebookからサインアップされています。",
                "zh": "您已经通过Facebook账号进行了登录。"
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
                "zh": "分享聊天机器人",
                "jp": "チャットボットを共有する"
            },
            "New chatbot": {
                "ko": "새 봇 만들기",
                "en": "New chatbot",
                "jp": "新しいチェッボッ",
                "zh": "新建聊天机器人"
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
                "zh": "读"
            },
            "Write": {
                "ko": "쓰기",
                "en": "Write",
                "jp": "書く",
                "zh": "写"
            },
            "Flow chatbots are tree-based. The user is driven down a specific path": {
                "ko": "플로우 챗봇은 트리구조입니다. 사용자는 개발자가 지정한 특정 대화 구조에 맞게 대화를 진행하게 됩니다.",
                "en": "Flow chatbots are tree-based. The user is driven down a specific path, a path previously defined by the chatbot's developer",
                "jp": "フローチャットボットはツリー構造です。 使用者は開発者が指定した特定対話構造に合わせて対話を進めるようになります。",
                "zh": "流程聊天机器人是树形结构的。用户要根据开发人员特定的对话结构来进行对话。"
            },
            "Cancel": {
                "ko": "취소",
                "en": "Cancel",
                "jp": "キャンセル",
                "zh": "取消"
            },
            "New Chatbot": {
                "ko": "새봇",
                "en": "New Chatbot",
                "jp": "新しいチェッボッ",
                "zh": "创建聊天机器人"
            },
            "Blank Bot": {
                "ko": "빈 봇",
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
                "zh": "说明"
            },
            "Create": {
                "ko": "생성",
                "en": "Create",
                "jp": "作り",
                "zh": "创建"
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
                "ko": "대화 시나리오",
                "en": "Dialog Scenario",
                "jp": "ダイアログシナリオ",
                "zh": "对话场景"
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
                "ko": "대화 셋",
                "en": "Dialog Set",
                "jp": "ダイアログセット",
                "zh": "对话集"
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
                "ko": "태스크",
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
                "zh": "可以管理对话场景。"
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
                "zh": "回答"
            },
            "New Dialog": {
                "ko": "New Dialog",
                "en": "New Dialog",
                "jp": "新しい対話",
                "zh": "新的对话"
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
                "jp": "変更事項が保存されませんでした。 移動しますか。?",
                "zh": "变动的部分还没有进行保存。您确定要转向其他页面吗？"
            },
            "Update is not saved. Do you want to close without saving?": {
                "ko": "변경사항이 저장되지 않았습니다. 취소하시겠습니까?",
                "en": "Update is not saved. Do you want to close without saving?",
                "jp": "更新は保存されません。 保存せずに終了しますか？",
                "zh": "更新没有保存。 你想关闭而不储蓄？"
            },
            "search description1": {
              "ko": "검색: Ctrl or Command + F",
              "en": "Search: Ctrl or Command + F",
              "jp": "サーチ: Ctrl or Command + F",
              "zh": "搜索: Ctrl or Command + F"
            },
            "search description2": {
                "ko": "다음으로 계속 검색: Ctrl or Command + G",
                "en": "Next Occurrence: Ctrl or Command + G",
                "jp": "次の発生: Ctrl or Command + G",
                "zh": "下一次发生: Ctrl or Command + G"
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
            "Bot files not found.": {
                "ko": "봇 파일을 찾을 수 없습니다",
                "en": "Bot files not found.",
                "jp": "ボットファイルが見つかりません。",
                "zh": "没有找到Bot文件。"
            },
            "You do not have permission to access this bot": {
                "ko": "이 봇에 접근할 수 있는 권한이 없습니다.",
                "en": "You do not have permission to read this bot",
                "jp": "このボットにアクセスする権限がありません。",
                "zh": "您无权访问此机器人。"
            },
            "You do not have permission to edit this bot": {
                "ko": "이 봇을 편집할 수 있는 권한이 없습니다.",
                "en": "You do not have permission to edit this bot",
                "jp": "あなたはこのボットを編集する権限を持っていません。",
                "zh": "您无权编辑此机器人。"
            },
            "Your bot's permissions are not set. Please select bot again. This message is shown only once at the beginning.": {
                "ko": "봇의 권한이 설정되어 있지 않습니다. 봇을 다시 선택하십시오. 이 메시지는 처음에 한 번만 표시됩니다.",
                "en": "Your bot's permissions are not set. Please select bot again. This message is shown only once at the beginning.",
                "jp": "あなたのボットの権限は設定されていません。 ボットをもう一度選択してください。 このメッセージは最初に1回だけ表示されます。",
                "zh": "你的机器人的权限没有设置。 请再次选择机器人。 此消息在开始时只显示一次。"
            },
            "The bot is not selected. Please select a bot.": {
                "ko": "봇이 선택되지 않았습니다. 봇을 선택해주세요.",
                "en": "The bot is not selected. Please select a bot.",
                "jp": "ボットは選択されていません。 ボットを選択してください。",
                "zh": "机器人未被选中。 请选择一个机器人。"
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
                "zh": "更多"
            },
            "Add Child": {
                "ko": "자식카드 생성",
                "en": "Add Child",
                "jp": "チャイルド生成",
                "zh": "添加子对话场景卡片"
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
            "Duplicate only this card": {
                "ko": "이 카드만 복제하기",
                "en": "Duplicate only this card",
                "jp": "このカードのみを複製する",
                "zh": "仅复制此卡片"
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
                "zh": "新的对话场景卡片"
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
                "zh": "对话场景卡片名称"
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
            "Change chatbot image": {
                "ko": "챗봇 이미지 변경",
                "en": "Change chatbot image",
                "zh": "更改chatbot图像。",
                "jp": "chatbotイメージを変更します。"
            },
            "Upload bot image": {
                "ko": "챗봇 이미지 업로드",
                "en": "Add image",
                "jp": "チャットボット画像をアップロードする",
                "zh": "上传chatbot图片"
            },
            "Insert external image": {
                "ko": "외부 이미지 삽입",
                "en": "Add image",
                "jp": "外部画像を挿入",
                "zh": "插入图片链接"
            },
            "Click to change image": {
                "ko": "이미지 변경",
                "en": "Click to change image",
                "jp": "イメージ変更",
                "zh": "点击更改图像"
            },
            "Click to upload image": {
                "ko": "챗봇 이미지 업로드",
                "en": "Click to upload image",
                "jp": "クリックして画像をアップロード",
                "zh": "点击上传图片"
            },
            "Add button": {
                "ko": "버튼 삽입",
                "en": "Add button",
                "jp": "ボタン挿入",
                "zh": "添加按钮"
            },
            "Add action": {
                "ko": "대화 흐름 조절",
                "en": "Control dialog flow",
                "zh": "控制对话流动",
                "jp": "ダイアログフローの制御"
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
                "zh": "对话选择"
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
            "When editing output with complex structure": {
                "ko": "복잡한 Output 구조 편집중에는 Basic모드로 전환할 수 없습니다.",
                "en": "When editing output with complex structure",
                "jp": " it is not possible to switch to the basic mode.",
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
                "ko": "데이터가 없습니다.",
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
                "zh": "学习对话框名称"
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
            "is duplicated": {
                "ko": " 은 중복된 이름 입니다.",
                "en": " is duplicated.",
                "jp": " は重複する名前です。",
                "zh": " 是重复的名称。"
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
            "Delete only this card": {
                "ko": "이 카드만 삭제하기",
                "en": "Delete only this card",
                "jp": "このカードのみを削除する。",
                "zh": "仅删除此卡片"
            },
            "delete": {
                "ko": "삭제",
                "en": "delete",
                "jp": "削除",
                "zh": "删除"
            },
            "Task Name": {
                "ko": "태스크 이름",
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
                "zh": "失败的对话场景卡片"
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
                "zh": "上一个对话场景卡片"
            },
            "User Input": {
                "ko": "사용자 입력",
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
                "zh": "对话量(近30天)"
            },
            "Number of Cumulated Users": {
                "ko": "누적 이용자",
                "en": "Number of Cumulated Users",
                "jp": "累積利用者",
                "zh": "累计用户量"
            },
            "Recent(30 days) Users.": {
                "ko": "이용자 (30일)",
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
                "zh": "对话成功率"
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
            "Most Frequently Used Input": {
                "ko": "사용자 입력 TOP 10",
                "en": "Most Frequently Used Input",
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
                "zh": "对话场景使用前10"
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
                "ko": "일별 대화량",
                "en": "Historical amount of dialog(channel)",
                "jp": "期間別デファリャン(チャネル)",
                "zh": "日对话量（频道）"
            },
            "Historical amount of dialog(Success/Fail)": {
                "ko": "일별 대화 성공/실패",
                "en": "Historical amount of dialog(Success/Fail)",
                "jp": "期間別デファリャン(成功/失敗)",
                "zh": "日对话量（成功/失败）"
            },
            "Ratio of dialog on channels": {
                "ko": "채널별 대화",
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
                "zh": "使用"
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
                "zh": "失败对话记录"
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
                "zh": "总结"
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
                "zh": "时域"
            },
            "Dialog Graph Path": {
                "ko": "대화 경로",
                "en": "Dialog Graph Path",
                "jp": "対話ルート",
                "zh": "对话路径"
            },
            "Dialog Training": {
                "ko": "대화학습",
                "en": "Dialog Training",
                "zh": "对话学习",
                "jp": "ダイアログトレーニング"
            },
            "Dialog Set Usage": {
                "ko": "대화량 - 대화셋",
                "en": "Dialog Traffic - Dialog Set",
                "jp": "デファリャン - ダイアログセット",
                "zh": "对话量 - 对话集"

                // "ko": "대화셋 이용",
                // "en": "Dialog Set Usage",
                // "jp": "ダイアログセットの使用法",
                // "zh": "对话场景卡片使用量"
            },
            "Dialog Scenario Usage": {
                "ko": "대화량 - 시나리오",
                "en": "Dialog Traffic - Dialog Scenario",
                "jp": "デファリャン - ダイアログシナリオ",
                "zh": "对话量 - 对话场景"

                // "ko": "대화 시나리오 이용",
                // "en": "Dialog Scenario Usage",
                // "jp": "ダイアログシナリオの使用法",
                // "zh": "对话场景使用情况"
            },
            "User Detail": {
                "ko": "사용자 세부 정보",
                "en": "User Detail",
                "jp": "ユーザーの詳細",
                "zh": "用户详情"
            },
            "Dialog Training Input": {
                "ko": "사용자 입력 - 대화셋",
                "en": "User Input - Dialog set",
                "jp": "ユーザー入力 - ダイアログセット",
                "zh": "用户输入 - 对话集"

                // "ko": "대화 학습 입력값",
                // "en": "Dialog Training Input",
                // "jp": "対話学習、入力値",
                // "zh": "对话学习输入"
            },
            "Dialog Graph Input": {
                "ko": "사용자 입력 - 대화 시나리오",
                "en": "User Input - Dialog Scenario",
                "jp": "ユーザー入力 - ダイアログシナリオ",
                "zh": "用户输入 - 对话场景"

                // "ko": "대화 그래프 입력값",
                // "en": "Dialog Graph Input",
                // "jp": "対話のグラフの入力値",
                // "zh": "对话场景输入"
            },
            "User Input Intent": {
                "ko": "사용자 입력 - 인텐트",
                "en": "User Input - Intent",
                "jp": "ユーザー入力 - インテント",
                "zh": "用户输入 - 意图"

                // "ko": "대화 그래프 입력값",
                // "en": "Dialog Graph Input",
                // "jp": "対話のグラフの入力値",
                // "zh": "对话场景输入"
            },
            "Failed Dialogs": {
                "ko": "실패 대화",
                "en": "Failed Dialogs",
                "jp": "失敗対話",
                "zh": "失败对话"
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
                "jp": "インテント分析",
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
                "zh": "日语",
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
                "zh": "对话输入",
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
                "zh": "第一次使用PlayChat？",
                "jp": "PlayChatを初めてお使いですか？"
            },
            "Choose Dialogset": {
                "ko": "대화셋 선택",
                "en": "Choose Dialogset",
                "zh": "选择对话场景卡片",
                "jp": "ダイアログセットを選択"
            },
            "Enter dialogset name": {
                "ko": "대화셋 이름을 입력해주세요",
                "en": "Enter dialogset name",
                "zh": "输入对话场景卡片名称。",
                "jp": "ダイアログセット名を入力します。"
            },
            "If you would like to receive the e-mail again, please click on the again button.": {
                "ko": "이메일 재전송을 원하시면 '재전송' 버튼을 눌러주세요.",
                "en": "If you would like to receive the e-mail again, please click on the again button.",
                "zh": "如果您想重新接收邮件，请点击再次发送按钮。",
                "jp": "メールを再受信したい場合は、'再送信'ボタンを押してください。"
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
                "jp": "今すぐやってみて下さい"
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
                "ko": "키워드, #인텐트, @엔터티, $타입, /정규식/, if(조건식)",
                "en": "Keyword, #Intent, @Entity, $Type, /RegExp/, if(Condition)",
                "zh": "关键字, #意图, @实体, $类型, /正则表达式/, if(条件)",
                "jp": "キーワード, #インテント, @エンティティ, $タイプ, /正規表現/, if(調子)"
            },
            "Keyword": {
                "ko": "키워드",
                "en": "Keyword",
                "zh": "关键字",
                "jp": "キーワード"
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
                "ko": "무시하기",
                "en": "Ignore",
                "zh": "忽略",
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
            "There is an unsupported version of the graph file. if you are using previous version, then please move below.": {
                "ko": "더 이상 지원하지 않는 버전의 그래프 파일입니다.<br/>아래 주소로 이동해서 사용해주세요.",
                "en": "There is an unsupported version of the graph file.<br/>if you are using previous version, then please move below.",
                "zh": "有一个不受支持的图形文件版本。<br/>如果您使用的是以前的版本，请在下面移动。",
                "jp": "サポートされていないバージョンのグラフファイルがあります。<br/>以前のバージョンを使用している場合は、下に移動してください。"
            },
            "It is a chatbot made in old version PlayChat. Go to old version PlayChat.":
            {
                "ko": "구 버전 플레이챗에서 제작된 챗봇입니다. 구 버전 플레이챗으로 이동합니다.",
                "en": "It is a chatbot made in old version PlayChat. Go to old version PlayChat.",
                "zh": "这是一个旧版PlayChat制作的聊天机器人。 转到旧版PlayChat。",
                "jp": "古いバージョンのPlayChatで作られたチャットボットです。 古いバージョンのPlayChatに移動します。"
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
                "zh": "检测到JSON格式错误。 聊天机器人可能无法正常工作。 您想保存吗？",
                "jp": "JSONフォーマットエラーが検出されました。 チャットボットが正しく動作しない可能性があります。 それを保存しますか？"
            },
            "Please enter a regular expression.": {
                "ko": "정규식을 입력해주세요. ex) /[a-z]*/",
                "en": "Please enter a regular expression. ex) /[a-z]*/",
                "zh": "请输入正则表达式。 ex）/[a-z]*/",
                "jp": "正規表現。 ex）/[a-z]*/"
            },
            "Entering conditional statements.": {
                "ko": "조건문을 입력해주세요. ex) if(a == b)",
                "en": "Please enter the condition. ex) if (a == b)",
                "zh": "请输入条件。 ex）if（a == b）",
                "jp": "条件を入力してください。 ex） if（a == b）"
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
            "Amount of Session": {
                "ko": "세션수량",
                "en": "Amount of Session",
                "zh": "会话数量",
                "jp": "セッション量"
            },
            "Usage of Dialog Set": {
                "ko": "대화 사용량",
                "en": "Usage of Dialog Set",
                "zh": "对话场景卡片的使用",
                "jp": "ダイアログセットの使用法"
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
                "zh": "对话路径",
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
                "zh": "申请免费内测",
                "jp": "無料クローズドベータ版に登録する"
            },
            "Registration for closed beta": {
                "ko": "클로즈베타 신청",
                "en": "Registration for closed beta",
                "zh": "申请内测",
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
            "BotId is already using": {
                "ko": "봇 아이디가 이미 사용중입니다.",
                "en": "BotId is already using",
                "zh": "BotId已经在使用",
                "jp": "BotIdは既に使用しています"
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
                "zh": "对话场景管理",
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
            "Manage Shop Picture":{
                "ko": "매장사진관리",
                "en": "Manage Shop Picture",
                "zh": "店面图片管理",
                "jp": "Manage Shop Picture"
            },
            "Authorization":{
                "ko": "권한",
                "en": "Authorization",
                "zh": "权限",
                "jp": "認証"
            },





            //dashboard
            "Chatbot has been made!":{
                "ko": "챗봇이 만들어졌습니다!",
                "en": "Chatbot has been made!",
                "zh": "聊天机器人创建成功!",
                "jp": "Chatbot has been made!"
            },
            "Let it study conversation":{
                "ko": "대화 학습 시키기",
                "en": "Let it study conversation",
                "zh": "开始对话学习",
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
            "Create Scenario":{
                "ko": "시나리오 시작",
                "en": "Create Scenario",
                "zh": "开始场景",
                "jp": "Create Scenario"
            },
            "Connect Channel":{
                "ko": "채널 연결",
                "en": "Connect Channel",
                "zh": "连接频道",
                "jp": "Connect Channel"
            },
            "We service chatbot by connecting to Phoneline, KakaoTalk or Facebook.":{
                "ko": "전화, 카카오톡, 페이스북에 연결해서 챗봇을 서비스합니다.",
                "en": "We service chatbot by connecting to Phoneline, KakaoTalk or Facebook.",
                "zh": "我们提供将聊天机器人连接到电话，微信，Kakao Talk和Facebook等平台上的服务。",
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
                "zh": "您可以查看AI回复的对话历史记录。",
                "jp": "Artificial Intelligence may automatically review the dialogue breakdown of the conversation."
            },
            "We can make it learn how to answer to the questions that it was not able to reply.":{
                "ko": "응답하지 못한 질문에 대한 답변을 학습시 킬수 있습니다.",
                "en": "We can make it learn how to answer to the questions that it was not able to reply.",
                "zh": "您可以让它学习它回答不了的问题。",
                "jp": "We can make it learn how to answer to the questions that it was not able to reply."
            },
            "usage statistics":{
                "ko": "사용통계",
                "en": "usage statistics",
                "zh": "使用情况统计",
                "jp": "usage statistics"
            },
            "You may search the usage amount by the number of conversations, number of people logged in by dates and etc.":{
                "ko": "기간별 접속자수, 대화수, 등 사용량을 조회해 볼 수 있습니다.",
                "en": "You may search the usage amount by the number of conversations, number  of people logged in by dates and etc.",
                "zh": "您可以查看每个时间周期使用的用户数量，对话数量等使用量。",
                "jp": "You may search the usage amount by the number of conversations, number  of people logged in by dates and etc."

            },
            "Use the template bots to make your own chatbot in a second.":{
                "ko": "아래 두가지 템플릿을 이용하면 나만의 챗봇을 뚝딱 만들 수 있어요.",
                "en": "Use the template bots to make your own chatbot in a second.",
                "zh": "请使用下面两种方式轻松地开发聊天机器人。",
                "jp": "Use the template bots to make your own chatbot in a second."
            },
            "Bot Id": {
                "ko": "챗봇 아이디",
                "en": "Bot Id",
                "zh": "机器ID",
                "jp": "ボットID"
            },
            "Bot Name":{
                "ko": "챗봇명",
                "en": "Bot Name",
                "zh": "机器人名",
                "jp": "机器人名称"
            },
            "Use the template bots to make your own chatbot in a second":{
                "ko": "아래 두가지 방식으로 챗봇을 쉽게 개발해 보세요.",
                "en": "Use the template bots to make your own chatbot in a second",
                "zh": "请使用下面两种方式轻松地开发聊天机器人。",
                "jp": "Use the template bots to make your own chatbot in a second"
            },




            //channel
            "Create a Kakao YellowID":{
                "ko": "카카오 플러스친구에 가입하세요.(https://center-pf.kakao.com/login)",
                "en": "Create a Kakao Plusfriend account(https://center-pf.kakao.com/login)",
                "zh": "申请一个Kakao yellow账号。(https://center-pf.kakao.com/login)",
                "jp": "Kakao Plusfriendアカウントを作成する(https://center-pf.kakao.com/login)"
            },
            "Make a Yellow ID profile.":{
                "ko": "새 플러스친구를 만들어 주세요.",
                "en": "Make a new plusfriend.",
                "zh": "创建一个新的plus朋友主页。",
                "jp": "新しいプラスフレンドを作る。"
            },
            "Go to the Auto ID page.":{
                "ko": "플러스 친구 관리자 센터로 접속하세요.",
                "en": "Go to the administrator page of plusfriend",
                "zh": "点击左侧菜单的智能聊天按钮，然后点击API型下方的设置进入API设置画面。",
                "jp": "plusfriendの管理者ページに移動します。"
            },
            "Go to API auto-response setup page.":{
                "ko": "스마트채팅 메뉴로 이동 후 API형 설정하기를 클릭하세요.",
                "en": "Click to API setting button after go to smart chatting.",
                "zh": "分别输入APP的名称，API的URL（可以在聊天机器人频道中的微信里获得），电话号码等。",
                "jp": "スマートチャットに行った後、APIタイプ設定ボタンをクリックしてください。"
            },
            "Set the app name, URL, description, and phone number. You need to set the URL to the URL below!":{
                "ko": "앱 이름, URL, 설명, 전화번호를 입력하세요. 이 때 URL을 아래의 Webhook URL로 설정해야 합니다.",
                "en": "Set the app name, URL, description, and phone number. You need to set the URL to the Webhook URL below!",
                "zh": "然后点击保存后，点击开始按钮，并在左侧菜单中的1对1聊天中设置主要的漏出权限。",
                "jp": "アプリ名、URL、説明、電話番号を設定します。 以下のWebhook URLにURLを設定する必要があります。"
            },
            "You must be a member of Line. Please log in first with Lind application or Web.":{
                "ko": "LINE회원이어야해요 LINE 앱 또는 웹으로 회원가입해요",
                "en": "You must be a member of Line. Please log in first with Lind application or Web.",
                "zh": "只有LINE的会员才可以使用LINE的应用或者网页",
                "jp": "You must be a member of Line. Please log in first with Lind application or Web."
            },
            "If you signed up, please register your email to be used in LINE Business Center":{
                "ko": "가입이 됐다면 LINE Business Center에서 사용할 이메일을 등록해요",
                "en": "If you signed up, please register your email to be used in LINE Business Center",
                "zh": "如果您已经加入了LINE的会员可以在LINE Business Center里面用邮箱进行登录",
                "jp": "If you signed up, please register your email to be used in LINE Business Center"
            },
            "On the Services tab, click the Start Messaging API button and enter the information.":{
                "ko": "서비스 탭에서 Messaging API 시작하기 버튼을 누르고 정보를 입력해요",
                "en": "On the Services tab, click the Start Messaging API button and enter the information.",
                "zh": "在服务选项卡上点击Messaging API开始按钮并输入信息",
                "jp": "On the Services tab, click the Start Messaging API button and enter the information."
            },
            "In LINE Manager, press the API ON button and allow the use of Webhook, then save.":{
                "ko": "LINE Manager에서 API 켜기 버튼을 누르고 Webhook 사용을 허용하고 저장해요",
                "en": "In LINE Manager, press the API ON button and allow the use of Webhook, then save.",
                "zh": "在LINE Manager中点击打开API按钮然后允许Webhook的使用并保存",
                "jp": "In LINE Manager, press the API ON button and allow the use of Webhook, then save."
            },
            "Go to Account List tab in LINE Business Center":{
                "ko": "LINE Business Center에서 계정 목록 탭으로 이동해요",
                "en": "Go to Account List tab in LINE Business Center",
                "zh": "在LINE Business Center中打开账号目录",
                "jp": "Go to Account List tab in LINE Business Center"
            },
            "Press the LINE Developers button in the Messaging API.":{
                "ko": "Messaging API에 있는 LINE Developers 버튼을 눌러요",
                "en": "Press the LINE Developers button in the Messaging API.",
                "zh": "点击在Messaging API中有的LINE Developers按钮",
                "jp": "Press the LINE Developers button in the Messaging API."
            },
            "Press the ISSUE button to get a Channel access token.":{
                "ko": "ISSUE 버튼을 눌러 Channel access token을 발급받아요",
                "en": "Press the ISSUE button to get a Channel access token.",
                "zh": "点击ISSUE按钮得到Channel access token",
                "jp": "Press the ISSUE button to get a Channel access token."
            },
            "Press the EDIT button to copy the Webhook URL below, save it and verify it":{
                "ko": "EDIT 버튼을 눌러 Webhook URL을 아래의 Webhook URL을 복사해 넣고 저장 및 확인해요",
                "en": "Press the EDIT button to copy the Webhook URL below, save it and verify it",
                "zh": "点击EDIT按钮，然后把Webhook URL下面有的Webhook URL复制并粘贴上，在进行保存和确认",
                "jp": "Press the EDIT button to copy the Webhook URL below, save it and verify it"
            },
            "It's done!":{
                "ko": "다 끝났습니다!",
                "en": "It's done!",
                "zh": "完成！",
                "jp": "It's done!"
            },
            "Connect to Naver TalktTalk Partner Center (partner.talk.naver.com)":{
                "ko": "네이버톡톡 파트너센터 접속 (partner.talk.naver.com)",
                "en": "Connect to Naver TalktTalk Partner Center (partner.talk.naver.com)",
                "zh": "打开Naver Talk Talk (partner.talk.naver.com)",
                "jp": "Connect to Naver TalktTalk Partner Center (partner.talk.naver.com)"
            },
            "Sign in with a corporate ID or a representative personal ID":{
                "ko": "회사 단체아이디 또는 대표성있는 개인아이디로 로그인",
                "en": "Sign in with a corporate ID or a representative personal ID",
                "zh": "用团体账号或者是个人账号登录",
                "jp": "Sign in with a corporate ID or a representative personal ID"
            },
            "Manage My Account> Create New Chat Account":{
                "ko": "내 계정관리 > 새로운 톡톡 계정 만들기 클릭",
                "en": "Manage My Account> Create New Chat Account",
                "zh": "进入我的账号管理>点击创建新的Talk Talk",
                "jp": "Manage My Account> Create New Chat Account"
            },
            "Click on 'Link to Service Later' without selecting a service from the list.":{
                "ko": "서비스 선택하기에서 서비스 선택없이 서비스 연결 나중에 하기 클릭!",
                "en": "Click on 'Link to Service Later' without selecting a service from the list.",
                "zh": "在服务选项中先不要选择服务，点击以后再连接服务!",
                "jp": "Click on 'Link to Service Later' without selecting a service from the list."
            },
            "When you create a test account, select an individual, and when creating a service account, select a business or an organization, and then input information such as the representative image, profile name and contact.":{
                "ko": "테스트 계정생성시 개인을 선택, 서비스 계정생성시 사업자 또는 기관/단체을 선택 후 다음 대표이미지, 프로필명, 휴대폰 번호 등 정보를 입력 후 사용신청하세요.",
                "en": "When you create a test account, select an individual, and when creating a service account, select a business or an organization, and then input information such as the representative image, profile name and contact.",
                "zh": "创建测试账户时，选择个人，创建服务账户时选择企业或者是机关/团体，在输入代表的姓名，个人资料和联系人信息等后申请使用。",
                "jp": "When you create a test account, select an individual, and when creating a service account, select a business or an organization, and then input information such as the representative image, profile name and contact."
            },
            "The created account is in the process validation. When the verification is completed, it will be in an active status and the notification will be sent by SMS":{
                "ko": "생성된 계정은 검수중 상태이며, 검수가 완료되면 사용중상태로 변경되고 SMS로 알림 전송됩니다.",
                "en": "The created account is in the process validation. When the verification is completed, it will be in an active status and the notification will be sent by SMS",
                "zh": "申请的账号在审查状态，等审查完后您会收到审查状态变更短信。",
                "jp": "The created account is in the process validation. When the verification is completed, it will be in an active status and the notification will be sent by SMS"
            },
            "In Account Management, click Account Home under Account Management in the list of registered accounts.":{
                "ko": "내 계정관리의 등록된 계정 리스트에서 계정관리로 계정 홈을 클릭하세요.",
                "en": "In Account Management, click Account Home under Account Management in the list of registered accounts.",
                "zh": "在我的账号管理里点击申请的账号进入当然账号主页。",
                "jp": "In Account Management, click Account Home under Account Management in the list of registered accounts."
            },
            "Click 'API Setting' menu of agreement and chatbot through setting menu. (registration required for beta period)":{
                "ko": "좌측 메뉴 챗봇 API 하위 API 설정 메뉴를 통해 이용약관동의 및 챗봇을 설정하세요. (beta기간에는 등록신청 필요)",
                "en": "Click 'API Setting' menu of agreement and chatbot through setting menu. (registration required for beta period)",
                "zh": "通过左侧菜单中聊天机器人API子菜单中的API设置菜单选择同意使用条款然后进行聊天机器人设置（需要输入申请测试时间）",
                "jp": "Click 'API Setting' menu of agreement and chatbot through setting menu. (registration required for beta period)"
            },
            "After Naver has approved the use of API, please enter the URL provided by playchat.":{
                "ko": "네이버의 API사용 승인이 된 후 playchat에서 제공하는 URL을 입력하여 연결하세요.",
                "en": "After Naver has approved the use of API, please enter the URL provided by playchat.",
                "zh": "当NaverAPI可以使用后再输入Playchat提供的URL就可以连接上啦。",
                "jp": "After Naver has approved the use of API, please enter the URL provided by playchat."
            },
            "Page name":{
                "ko": "페이지 이름",
                "en": "Page name",
                "zh": "页面名称",
                "jp": "Page name"
            },
            "Page link":{
                "ko": "페이지 링크",
                "en": "Page link",
                "zh": "页面链接",
                "jp": "Page link"
            },
            "Register":{
                "ko": "신청하기",
                "en": "Register",
                "zh": "申请",
                "jp": "Register"
            },
            "You can also use the service on your phone to serve customers with the same content used in messenger.":{
                "ko": "메신져를 통해서 고객에게 서비스하는 내용을 전화에서도 사용 하실 수 있습니다.",
                "en": "You can also use the service on your phone to serve customers with the same content used in messenger.",
                "zh": "通过聊天软件，向用户提供的服务在电话上也一样可以实现。",
                "jp": "You can also use the service on your phone to serve customers with the same content used in messenger."
            },
            "If you want to use the Playchat phone, please click the button to apply after filling in the form below.":{
                "ko": "Playchat 전화를 사용하시고자 하시는 회원님께서는 아래 양식을 게제후 신청하기 버튼을 눌러주세요.",
                "en": "If you want to use the Playchat phone, please click the button to apply after filling in the form below.",
                "zh": "想使用playchat电话的用户请按照下面的样式录入点击申请按钮。",
                "jp": "If you want to use the Playchat phone, please click the button to apply after filling in the form below."
            },
            "An Internet phone number will be issued when the application is received.":{
                "ko": "신청이 접수되면 인터넷 전화번호가 발급됩니다.",
                "en": "An Internet phone number will be issued when the application is received.",
                "zh": "我们会给申请通过的用户发网络电话。",
                "jp": "An Internet phone number will be issued when the application is received."
            },
            "It may take 3-4 business days.":{
                "ko": "영업일자로 3~4일이 소요될 수 있습니다.",
                "en": "It may take 3-4 business days.",
                "zh": "大概需要3~4个工作日。",
                "jp": "It may take 3-4 business days."
            },
            "* This service is free during the beta service period and the contents of the service are subject to change.":{
                "ko": "* 본 서비스는 베타 서비스 기간동안 무료로 제공되며, 서비스 내용은 변경 될 수 있습니다.",
                "en": "* This service is free during the beta service period and the contents of the service are subject to change.",
                "zh": "* 本服务只免费提供给内测服务使用期间，同时服务内容可以变更。",
                "jp": "* This service is free during the beta service period and the contents of the service are subject to change."
            },
            "Inquiry: tel) 02-858-5683":{
                "ko": "신청문의 : tel)02-858-5683",
                "en": "Inquiry: tel) 02-858-5683",
                "zh": "申请电话：电话）02-858-5683",
                "jp": "Inquiry: tel) 02-858-5683"
            },
            "Contact":{
                "ko": "전화번호",
                "en": "Contact",
                "zh": "电话号码",
                "jp": "Contact"
            },
            "No phone number. If you would like to receive a Playchat phone number, please contact us with the number above.":{
                "ko": "전화번호가 없습니다. Playchat 전화 번호를 발급받으시려면 위 전화번호로 신청을 문의해주시기 바랍니다.",
                "en": "No phone number. If you would like to receive a Playchat phone number, please contact us with the number above.",
                "zh": "没有电话号码，如果您想使用playchat电话号码，请和上面的电话号码联系并进行咨询。",
                "jp": "No phone number. If you would like to receive a Playchat phone number, please contact us with the number above."
            },
            "Create a new Facebook Page":{
                "ko": "페이스북 페이지 새로 만들기",
                "en": "Create a new Facebook Page",
                "zh": "新建Facebook页面",
                "jp": "Create a new Facebook Page"
            },
            "wechatScription1":{
                "ko": "Wechat 개인 계정번호가 있어야 합니다. 없으면 휴대폰에서 wechat app 다운로드 후 신청해주세요.",
                "en": "You must have a personal Wechat account number. If you do not have it, please apply after downloading the wechat app from your mobile phone.",
                "zh": "首先您要有微信个人账号，如果没有的话先在手机上下载微信，然后申请。",
                "jp": "You must have a personal Wechat account number. If you do not have it, please apply after downloading the wechat app from your mobile phone."
            },
            "wechatScription2":{
                "ko": "https://mp.weixin.qq.com/ 에 가서  상단의 “WeChat Official Accounts“을 신청하세요.",
                "en": "Go to https://mp.weixin.qq.com/ and apply for \"WeChat Official Accounts\" at the top.",
                "zh": "然后到https://mp.weixin.qq.com/里申请微信公众号（申请的过程中需要用到微信号）",
                "jp": "Go to https://mp.weixin.qq.com/ and apply for \"WeChat Official Accounts\" at the top."
            },
            "wechatScription3":{
                "ko": "신청 후 \"Basic configuration\"라는 버튼 클릭하세요. 그 다음 오른 쪽에 있는 \"I agree” 앞에 체크를 하시고, “Become a developer“라는 버튼 클릭하세요.",
                "en": "After applying, please click \"Basic configuration\" button. Then check the box next to \"I agree\" on the right-hand side and click on the button \"Become a developer\".",
                "zh": "申请以后点击“基本配置”按钮，然后在左边画面里点击“我同意”后，点击“成为开发者”按钮。",
                "jp": "After applying, please click \"Basic configuration\" button. Then check the box next to \"I agree\" on the right-hand side and click on the button \"Become a developer\"."
            },
            "wechatScription3-1":
            {
                "ko": "AppId와 EncodingAESKey를 복사해서 아래에 입력하고 저장 버튼을 클릭합니다. EncodingAESKey는 Change Configuration 버튼 클릭 후 생성할 수 있습니다.",
                "en": "Copy the AppId and EncodingAESKey below and click the Save button. EncodingAESKey can be created after clicking the \"Change Configuration\" button.",
                "zh": "复制下面的AppId和EncodingAESKey并单击保存按钮。 EncodingAESKey可以在单击“更改配置”按钮后创建。",
                "jp": "下のAppIdとEncodingAESKeyをコピーし、[保存]ボタンをクリックします。 EncodingAESKeyは、Change Configurationボタンをクリックした後に作成できます。"
            },
            "wechatScription4":{
                "ko": "\"Change Configuration\" 라는 버튼 클릭하세요. 입력칸에는 Playchat 페이지 왼쪽 메뉴 중 Channel를 클릭하고 wechat의 연결버튼을 눌렀을 때 안내되는 URL을 입력하시면 됩니다. 그후, Token에는 moneybrain_token 이라고 입력하세요.",
                "en": "Click on \"Change Configuration\" button. In the input box, type the URL address which can be checked from Playchat page.(Channel>Connect to Wechat). Then, in the Token, type moneybrain_token.",
                "zh": "然后点击左下方的“基本配置”按钮，输入URL（从playchat里面的频道里点击微信下方的链接获得），然后在Token中输入“moneybrain_token”。",
                "jp": "Click on \"Change Configuration\" button. In the input box, type the URL address which can be checked from Playchat page.(Channel>Connect to Wechat). Then, in the Token, type moneybrain_token."
            },
            "wechatScription5":{
                "ko": "그리고 Encoding AESKey는  Encoding AESKey 뒤에 있는 “Random Generation“라는 버튼을 클릭하면 자동적으로 생성됩니다. 그 후, “Change Configuration” 라는 버튼 옆에 있는 “Enable“라는 버튼을 클릭하세요.",
                "en": "Encoding AESKey is created automatically when you click on the button called \"Random Generation\" after Encoding AESKey. Then click on the button labeled \"Enable\", which is placed next to the button labeled \"Change Configuration\".",
                "zh": "接着点击Encoding AESKey后方的“随机生成”，然后提交。提交完毕后再点击“修改配置”旁边的“启用按钮”。然后把相对应的AppId和EncodingAESKey输入到playchat频道菜单中微信连接里面并提交。",
                "jp": "Encoding AESKey is created automatically when you click on the button called \"Random Generation\" after Encoding AESKey. Then click on the button labeled \"Enable\", which is placed next to the button labeled \"Change Configuration\"."
            },
            "wechatScription6":{
                "ko": "휴대폰 WeChat 어플리케이션을 실행한 후, \"Add Contact\" 에 있는 “Official Accounts “버튼을 클릭하세요. 검색창에 Wechat에서 주어진 나의 “WeChat Official Accounts “를 찾으면 완료!",
                "en": "Open WeChat application in your cell phone and click \"click the \"Official Accounts\" button in \"Add Contact\" If you find \"Wechat Official Accounts given, it's all done!",
                "zh": "立即打开手机在添加朋友里选择添加“公众号”，找到自己设定的公众号名称即可开始使用您的聊天机器人啦~",
                "jp": "Open WeChat application in your cell phone and click \"click the \"Official Accounts\" button in \"Add Contact\" If you find \"Wechat Official Accounts given, it's all done!"
            },

            //추가하는 거
            "Intent Usage":{
                "ko": "인텐트 사용량",
                "en": "Intent Usage",
                "zh": "意图使用量",
                "jp": "Intent Usage"
            },
            "from":{
                "ko": "부터",
                "en": "from",
                "zh": "开始",
                "jp": "from"
            },
            "to":{
                "ko": "까지",
                "en": "to",
                "zh": "结束",
                "jp": "to"
            },
            "week":{
                "ko": "주",
                "en": "week",
                "zh": "周",
                "jp": "週間"
            },
            "Sunday":{
                "ko": "일",
                "en": "Sun",
                "zh": "周日",
                "jp": "日曜日"
            },
            "Monday":{
                "ko": "월",
                "en": "Mon",
                "zh": "周一",
                "jp": "月曜日"
            },
            "Tuesday":{
                "ko": "화",
                "en": "Tue",
                "zh": "周二",
                "jp": "火曜日"
            },
            "Wednesday":{
                "ko": "수",
                "en": "Wed",
                "zh": "周三",
                "jp": "水曜日"
            },
            "Thursday":{
                "ko": "목",
                "en": "Thu",
                "zh": "周四",
                "jp": "木曜日"
            },
            "Friday":{
                "ko": "금",
                "en": "Fri",
                "zh": "周五",
                "jp": "金曜日"
            },
            "Saturday":{
                "ko": "토",
                "en": "Sat",
                "zh": "周六",
                "jp": "土曜日"
            },
            "January":{
                "ko": "1월",
                "en": "Jan",
                "zh": "1月",
                "jp": "1月"
            },
            "February":{
                "ko": "2월",
                "en": "Feb",
                "zh": "2月",
                "jp": "2月"
            },
            "March":{
                "ko": "3월",
                "en": "Mar",
                "zh": "3月",
                "jp": "3月"
            },
            "April":{
                "ko": "4월",
                "en": "Apr",
                "zh": "4月",
                "jp": "4月"
            },
            "May":{
                "ko": "5월",
                "en": "May",
                "zh": "5月",
                "jp": "5月"
            },
            "June":{
                "ko": "6월",
                "en": "Jun",
                "zh": "6月",
                "jp": "6月"
            },
            "July":{
                "ko": "7월",
                "en": "Jul",
                "zh": "7月",
                "jp": "7月"
            },
            "August":{
                "ko": "8월",
                "en": "Aug",
                "zh": "8月",
                "jp": "8月"
            },
            "September":{
                "ko": "9월",
                "en": "Sep",
                "zh": "9月",
                "jp": "9月"
            },
            "October":{
                "ko": "10월",
                "en": "Oct",
                "zh": "10月",
                "jp": "10月"
            },
            "November":{
                "ko": "11월",
                "en": "Nov",
                "zh": "11月",
                "jp": "11月"
            },
            "December":{
                "ko": "12월",
                "en": "Dec",
                "zh": "12月",
                "jp": "12月"
            },
            "This e-mail is under confirm process. Please confirm your email.": {
                "ko": "E-mail이 아직 인증되지 않았습니다.",
                "en": "This e-mail is under confirm process. Please confirm your email.",
                "zh": "This e-mail is under confirm process. Please confirm your email.",
                "jp": "This e-mail is under confirm process. Please confirm your email."
            },
            "This e-mail is not registered or the password is wrong.": {
                "ko": "가입되지 않은 E-mail이거나 비밀번호가 잘못되었습니다",
                "en": "This e-mail is not registered or the password is wrong.",
                "zh": "这个邮箱暂时还没有注册或者密码错误",
                "jp": "この電子メールは登録されていないか、パスワードが間違っています。"
            },
            "Open Dialogset": {
                "ko": "대화셋 열기",
                "en": "Open Dialogset",
                "zh": "打开学习对话框",
                "jp": "開くダイアログセット"
            },
            "Template Download": {
                "ko": "양식 다운로드",
                "en": "Template Download",
                "zh": "模板下载",
                "jp": "テンプレートのダウンロード"
            },
            "Type the Entity Name": {
                "ko": "엔터티 이름을 입력해주세요",
                "en": "Type the Entity Name",
                "jp": "エンティティ名を入力します。",
                "zh": "输入实体名称"
            },


            //guide
            "Move to next or previous editor": {
                "ko": "다음이나 이전으로 이동하기",
                "en": "Move to next or previous editor",
                "jp": "Move to next or previous editor",
                "zh": "把光标移动到下一个/上一个输入框"
            },
            "Move to Dialog Graph": {
                "ko": "대화 그래프로 이동하기",
                "en": "Move to Dialog Graph",
                "jp": "Move to Dialog Graph",
                "zh": "转到对话场景"
            },
            "Navigate Dialog": {
                "ko": "다이얼로그 네이게이션",
                "en": "Navigate Dialog",
                "jp": "Navigate Dialog",
                "zh": "对话导航"
            },
            "Move Dialog Up/Down": {
                "ko": "다이얼로그 위/아래로 옮기기",
                "en": "Move Dialog Up/Down",
                "jp": "Move Dialog Up/Down",
                "zh": "向上/向下移动对话场景卡片"
            },
            "Open Edit Dialog": {
                "ko": "다이얼로그 수정하기",
                "en": "Open Edit Dialog",
                "jp": "Open Edit Dialog",
                "zh": "打开编辑对话"
            },
            "Cancel Edit": {
                "ko": "수정 취소",
                "en": "Cancel Edit",
                "jp": "Cancel Edit",
                "zh": "取消修改"
            },
            "Add Child dialog": {
                "ko": "Child 다이얼로그 추가하기",
                "en": "Add Child dialog",
                "jp": "Add Child dialog",
                "zh": "添加子对话场景卡片"
            },
            "Add Sibling dialog": {
                "ko": "Sibling 다이얼로그 추가하기",
                "en": "Add Sibling dialog",
                "jp": "Add Sibling dialog",
                "zh": "添加姊妹对话场景卡片"
            },
            "Delete Dialog": {
                "ko": "다이얼로그 삭제",
                "en": "Delete Dialog",
                "jp": "Delete Dialog",
                "zh": "删除对话场景卡片"
            },
            "Expand/Collapse Child Dialog": {
                "ko": "Child 다이얼로그 늘이기/줄이기",
                "en": "Expand/Collapse Child Dialog",
                "jp": "Expand/Collapse Child Dialog",
                "zh": "展开/折叠子对话场景卡片"
            },
            "Dialog Graph Editor ShortCut": {
                "ko": "대화 그래프 수정 바로가기",
                "en": "Dialog Graph Editor ShortCut",
                "jp": "Dialog Graph Editor ShortCut",
                "zh": "对话场景编辑快捷方式"
            },
            "Move focus to next input": {
                "ko": "다음 인풋으로 이동하기",
                "en": "Move focus to next input",
                "jp": "Move focus to next input",
                "zh": "把光标移动到下一个输入框"
            },
            "Add input or output": {
                "ko": "인풋과 아웃풋 추가하기",
                "en": "Add input or output",
                "jp": "Add input or output",
                "zh": "添加输入/输出"
            },
            "Choose a file": {
                "ko": "파일 선택",
                "en": "Choose a file",
                "jp": "ファイルを選択する",
                "zh": "选择文件"
            },
            "Change your password": {
                "ko": "비밀번호를 변경해주세요",
                "en": "Change your password",
                "jp": "パスワードを変更してください",
                "zh": "更改您的密码"
            },
            "Password Confirm": {
                "ko": "비밀번호 확인",
                "en": "Password Confirm",
                "jp": "パスワード確認",
                "zh": "确认密码"
            },
            "Change": {
                "ko": "변경하기",
                "en": "Change",
                "jp": "変化する",
                "zh": "更改"
            },
            "Dialog Graph Code Editor Shortcut": {
                "ko": "Dialog Graph Code Editor Shortcut",
                "en": "Dialog Graph Code Editor Shortcut",
                "jp": "Dialog Graph Code Editor Shortcut",
                "zh": "转到对话场景代码"
            },
            "Move to previous or next tab": {
                "ko": "Move to previous or next tab",
                "en": "Move to previous or next tab",
                "jp": "Move to previous or next tab",
                "zh": "移动到之前或者下一个tab"
            },
            "Dialog Set Shortcut": {
                "ko": "Dialog Set Shortcut",
                "en": "Dialog Set Shortcut",
                "jp": "Dialog Set Shortcut",
                "zh": "学习对话框快捷方式"
            },
            "Add Multi Input or Output": {
                "ko": "multi input/output 추가",
                "en": "Add Multi Input or Output",
                "jp": "Add Multi Input or Output",
                "zh": "对话学习快捷方式"
            },
            "Move focus to upper or lower input": {
                "ko": "Move focus to upper or lower input",
                "en": "Move focus to upper or lower input",
                "jp": "Move focus to upper or lower input",
                "zh": "将光标移动到上一个或者下一个输入"
            },
            "Delete multi Input or Output": {
                "ko": "Delete multi Input or Output",
                "en": "Delete multi Input or Output",
                "jp": "Delete multi Input or Output",
                "zh": "删除多输入或者输出"
            },
            "Move focus to simulator input": {
                "ko": "Move focus to simulator input",
                "en": "Move focus to simulator input",
                "jp": "Move focus to simulator input",
                "zh": "将光标移动到模拟输入"
            },
            "Move focus to dialog graph or dialog set": {
                "ko": "Move focus to dialog graph or dialog set",
                "en": "Move focus to dialog graph or dialog set",
                "jp": "Move focus to dialog graph or dialog set",
                "zh": "将光标移动到对话场景或者对话集处"
            },
            "Reset simulator": {
                "ko": "Reset simulator",
                "en": "Reset simulator",
                "jp": "Reset simulator",
                "zh": "重置模拟器"
            },
            "Save & Reset simulator": {
                "ko": "Save & Reset simulator",
                "en": "Save & Reset simulator",
                "jp": "Save & Reset simulator",
                "zh": "保存并重置模拟器"
            },
            "Only Javascript files are allowed!": {
                "ko": "자바스크립트 파일만 업로드 할 수 있습니다!",
                "en": "Only Javascript files are allowed!",
                "zh": "请不要上传非Javascript格式的文件！",
                "jp": "Javascriptファイルのみが許可されています！"
            },
            "Sample Bot": {
                "ko": "샘플로 만들기",
                "en": "Create by sample",
                "zh": "使用样本创建",
                "jp": "サンプルで作成"
            },
            "Sample Hotel": {
                "ko": "샘플 호텔봇",
                "en": "Sample Hotel Bot",
                "zh": "酒店聊天机器人样本",
                "jp": "サンプルホテルボット"
            },
            "Sample Restaurant": {
                "ko": "샘플 레스토랑봇",
                "en": "Sample Restaurant Bot",
                "zh": "餐厅机器人样本",
                "jp": "サンプルレストランボット"
            },
            "Sample Hospital": {
                "ko": "샘플 병원봇",
                "en": "Sample Hospital Bot",
                "zh": "医院机器人样本",
                "jp": "サンプル病院ボット"
            },
            "Email has been sent again.": {
                "ko": "이메일이 다시 전송되었습니다.",
                "en": "Email has been sent again.",
                "zh": "邮件已重新发送。",
                "jp": "emailこの再送信されました。"
            },
            "Playchat, Super-Simple Conversational A.I. Platform": {
                "ko": "초간단 대화형 인공지능 챗봇 플랫폼 Playchat",
                "en": "Playchat, Super-Simple Conversational A.I. Platform",
                "zh": "Playchat，超级简单的对话人工智能聊天机器人平台",
                "jp": "Playchat, Super-Simple Conversational A.I. Platform"
            },
            "Start creating your own chatbot without a single line of coding but with PlayChat Closed Beta Service.": {
                "ko": "코딩 없이도 개발 가능한 인공지능 챗봇 플랫폼 Playchat의 클로즈 베타 서비스를 시작합니다. ",
                "en": "Start creating your own chatbot without a single line of coding but with PlayChat Closed Beta Service.",
                "zh": "开始使用PlayChat测试版服务，不需要任何代码，就能创建自己的聊天机器人。",
                "jp": "Start creating your own chatbot without a single line of coding but with PlayChat Closed Beta Service."
            },
            "Apply Now and get special offer": {
                "ko": "지금 바로 신청하세요.",
                "en": "Apply Now and get special offer",
                "zh": "立即申请",
                "jp": "Apply Now and get special offer"
            },
            "Special Offer ONLY for the PlayChat Beta Service Users": {
                "ko": "가입자 제공 혜택",
                "en": "Special Offer ONLY for the PlayChat Beta Service Users",
                "zh": "加入PlayChat内测用户的特别优惠",
                "jp": "Special Offer ONLY for the PlayChat Beta Service Users"
            },
            "One, Apply now and use for free (for the first 50 applicants)": {
                "ko": "하나, 지금 신청하면 무료로 이용 가능합니다. (선착순 50명)",
                "en": "One, Apply now and use for free (for the first 50 applicants)",
                "zh": "一. 现在申请可免费使用（前50名）",
                "jp": "One, Apply now and use for free (for the first 50 applicants)"
            },
            "Two, Apply now for Free Chatbot Development Training Course (for the first 20 applicants)": {
                "ko": "둘, 무료 인공지능 챗봇 개발 교육 (20명 선착순)",
                "en": "Two, Apply now for Free Chatbot Development Training Course (for the first 20 applicants)",
                "zh": "二. 免费聊天机器人开发培训课程（前20名）",
                "jp": "Two, Apply now for Free Chatbot Development Training Course (for the first 20 applicants)"
            },
            "Three, Participate in Chatbot Development Contest and get Prize: One Thousand Dollars for the Winner, Five Hundred Dollars for the Runner-up!": {
                "ko": "셋, 챗봇 대회 입상시 상금 지급! 1등 100만원, 2등 50만원!",
                "en": "Three, Participate in Chatbot Development Contest and get Prize: One Thousand Dollars for the Winner, Five Hundred Dollars for the Runner-up!",
                "zh": "三. 参加聊天机器人开发大赛，一等奖100万韩元，二等奖50万韩元！",
                "jp": "Three, Participate in Chatbot Development Contest and get Prize: One Thousand Dollars for the Winner, Five Hundred Dollars for the Runner-up!"
            },
            "Error reporting and suggestions for improvement": {
                "ko": "오류보고 및 개선제안",
                "en": "Error reporting and suggestions for improvement",
                "zh": "错误报告和改进建议",
                "jp": "エラー報告と改善のための提案"
            },
            "Send" : {
                "ko": "보내기",
                "en": "Send",
                "zh": "发送",
                "jp": "送信"
            },
            "Successfully transferred!": {
                "ko": "성공적으로 전송되었습니다!",
                "en": "Successfully transferred!",
                "zh": "成功转移！",
                "jp": "転送に成功しました！"
            },
            "Move Dialog": {
                "ko": "대화 이동",
                "en": "Call",
                "zh": "移动对话场景卡片",
                "jp": "移動ダイアログ"
            },
            "Ask the question again": {
                "ko": "다시 질문하기",
                "en": "Ask the question again",
                "zh": "再次提问",
                "jp": "もう一度質問してください"
            },
            "Search after dialog moved": {
                "ko": "대화 이동 후 검색",
                "en": "Search after dialog moved",
                "zh": "移动对话场景卡片后搜索。",
                "jp": "ダイアログが移動した後の検索。"
            },
            "Move to previous dialog": {
                "ko": "이전 대화로 이동",
                "en": "Move to previous dialog",
                "zh": "移到上一个对话场景卡片",
                "jp": "前のダイアログに移動"
            },
            "Move to parent dialog": {
                "ko": "상위 대화로 이동",
                "en": "Move to parent dialog",
                "zh": "返回上一层对话的父母卡片",
                "jp": "上位スレッドに移動"
            },
            "Return": {
                "ko": "돌아가기",
                "en": "Return",
                "zh": "返回",
                "jp": "戻る"
            },
            "Return call": {
                "ko": "돌아가기용 대화 이동",
                "en": "Return Call",
                "zh": "返回移动",
                "jp": "リターンコール"
            },
            "Card Name": {
                "ko": "카드 이름",
                "en": "Card Name",
                "zh": "卡片名称",
                "jp": "カード名"
            },
            "Function before Answer": {
                "ko": "답변 전 실행함수",
                "en": "Function before Answer",
                "zh": "回答前执行的函数",
                "jp": "回答前の機能"
            },
            "Chatbot Answer": {
                "ko": "챗봇 답변",
                "en": "Chatbot Answer",
                "zh": "聊天机器人回答",
                "jp": "チャットロボットアンサー"
            },

            "SampleBot Category": {
                "ko": "샘플봇 종류",
                "en": "SampleBot Category",
                "zh": "样本机器人分类",
                "jp": "サンプルのボットカテゴリ"
            },
            "edu_input_keyword" : {
                "ko": "기능가이드 챗봇 (사용자입력_키워드)",
                "en": "Feature Guide Chatbot (User Input_keyword)",
                "zh": "功能指南Chatbot（用户输入关键字）",
                "jp": "機能ガイドチャットボット（ユーザー入力_キーワード）"
            },
            "edu_input_entity" : {
                "ko": "기능가이드 챗봇 (사용자입력_엔터티)",
                "en": "Feature Guide Chatbot (User Input_Entity)",
                "zh": "功能指南Chatbot（用户输入实体）",
                "jp": "機能ガイドChatbot（User Input_Entity）"
            },
            "edu_input_intent" : {
                "ko": "기능가이드 챗봇 (사용자입력_인텐트)",
                "en": "Feature Guide Chatbot (User Input_Intent)",
                "zh": "功能指南Chatbot（用户Input_Intent）",
                "jp": "機能ガイドチャットボット（ユーザー入力_番号）"
            },
            "edu_input_regexp" : {
                "ko": "기능가이드 챗봇 (사용자입력_정규식)",
                "en": "Feature Guide Chatbot (User Input_Regexp)",
                "zh": "功能指南Chatbot（用户输入_Regexp）",
                "jp": "機能ガイドChatbot（ユーザー入力_Regexp）"
            },
            "edu_input_type" : {
                "ko": "기능가이드 챗봇 (사용자입력_타입)",
                "en": "Feature Guide Chatbot (User Input_Type)",
                "zh": "功能指南Chatbot（用户输入类型）",
                "jp": "機能ガイドチャットボット（ユーザー入力タイプ）"
            },
            "edu_input_if" : {
                "ko": "기능가이드 챗봇 (사용자입력_조건문)",
                "en": "Feature Guide Chatbot (User Input_if)",
                "zh": "功能指南Chatbot（用户输入_if）",
                "jp": "機能ガイドChatbot（User Input_if）"
            },
            "edu_input_variable" : {
                "ko": "기능가이드 챗봇 (사용자입력_변수)",
                "en": "Feature Guide Chatbot (User Input_Variable)",
                "zh": "功能指南Chatbot（用户输入变量）",
                "jp": "機能ガイドチャットボット（ユーザー入力_可変）"
            },
            "edu_task_crawling" : {
                "ko": "기능가이드 챗봇 (함수_크롤링)",
                "en": "Feature Guide Chatbot (Function_Crawling)",
                "zh": "功能指南Chatbot（功能_爬行）",
                "jp": "機能ガイドChatbot（Function_Crawling）"
            },
            "edu_task_api" : {
                "ko": "기능가이드 챗봇 (함수_API)",
                "en": "Feature Guide Chatbot (Function_API)",
                "zh": "功能指南Chatbot（Function_API）",
                "jp": "機能ガイドChatbot（Function_API）"
            },
            "edu_output_variable" : {
                "ko": "기능가이드 챗봇 (챗봇답변_변수)",
                "en": "Feature Guide Chatbot (Chatbot Answer_Variable)",
                "zh": "功能指南Chatbot（Chatbot Answer_Variable）",
                "jp": "機能ガイドチャットボット（チャットボットAnswer_Variable）"
            },
            "edu_output_if" : {
                "ko": "기능가이드 챗봇 (챗봇답변_조건문)",
                "en": "Feature Guide Chatbot (Chatbot Answer_if)",
                "zh": "功能指南Chatbot（Chatbot Answer_if）",
                "jp": "機能ガイドチャットボット（Chatbot Answer_if）"
            },
            "edu_output_call" : {
                "ko": "기능가이드 챗봇 (챗봇답변_대화이동)",
                "en": "Feature Guide Chatbot (Chatbot Answer_Move other dialog)",
                "zh": "功能指南Chatbot（Chatbot Answer_Move其他对话框）",
                "jp": "機能ガイドチャットボット（Chatbot Answer_Move他のダイアログ）"
            },
            "edu_output_repeat" : {
                "ko": "기능가이드 챗봇 (챗봇답변_다시질문하기)",
                "en": "Feature Guide Chatbot (Chatbot Answer_Repeat question)",
                "zh": "功能指南Chatbot（Chatbot Answer_Repeat问题）",
                "jp": "機能ガイドチャットボット（チャットボットアンサー_質問の返信）"
            },
            "edu_output_up" : {
                "ko": "기능가이드 챗봇 (챗봇답변_이전대화이동)",
                "en": "Feature Guide Chatbot (Chatbot Answer_Move previous dialog)",
                "zh": "特征指南Chatbot（Chatbot Answer_Move前一个对话框）",
                "jp": "機能ガイドチャットボット（チャットボットアンサー_前のダイアログ）"
            },
            "edu_output_callchild" : {
                "ko": "기능가이드 챗봇 (챗봇답변_대화이동 후 검색)",
                "en": "Feature Guide Chatbot (Chatbot Answer_Move Move other dialog then search)",
                "zh": "特征指南Chatbot（Chatbot Answer_Move移动其他对话框然后搜索）",
                "jp": "機能ガイドChatbot（Chatbot Answer_Move他のダイアログを移動してから検索する)"
            },
            "edu_output_returncall" : {
                "ko": "기능가이드 챗봇 (챗봇답변_돌아오기용 대화이동)",
                "en": "Feature Guide Chatbot (Move other dialog for return)",
                "zh": "功能指南Chatbot（移动其他对话框以返回）",
                "jp": "機能ガイドチャットボット（他のダイアログを移動して戻る）"
            },
            "DM_Cut": {
                "ko": "잘라내기",
                "en": "Cut",
                "zh": "剪切",
                "jp": "カット。"
            },
            "DM_Copy": {
                "ko": "복사하기",
                "en": "Copy",
                "zh": "复制",
                "jp": "コピー"
            },
            "DM_Paste": {
                "ko": "붙여넣기",
                "en": "Paste",
                "zh": "粘贴",
                "jp": "ペースト"
            },
            "DialogGraphManagementCreateDescription": {
                "ko": "파일 이름은 알파벳 대문자 또는 알파벳 소문자로 시작해야하며 알파벳 또는 숫자 또는 대시 (-) 여야합니다.",
                "en": "File names must start with a alphabet capital letter or a alphabet small letter and must be alphabet or number or dash(-).",
                "zh": "文件名必须以字母大写或小写字母开头，并且必须是字母或数字或破折号（-）。",
                "jp": "ファイル名はアルファベット大文字またはアルファベット小文字で始まり、アルファベットまたは数字またはダッシュ（-）でなければなりません。"
            },
            "Double click to editing": {
                "ko": "편집하려면 더블클릭 하세요.",
                "en": "Double click to editing",
                "zh": "双击进行编辑。",
                "jp": "ダブルクリックして編集します。"
            },
            "BotIdPattern": {
                "ko": "봇 아이디는 알파벳 소문자 혹은 대문자로 시작해야 합니다.",
                "en": "Bot id must be starts with alphabet small or capital letter",
                "zh": "机器ID必须以字母小写或大写字母开头。",
                "jp": "ボットIDはアルファベット小文字または大文字で始まる必要があります。"
            },
            "Has been applied": {
                "ko": "적용되었습니다.",
                "en": "Has been applied",
                "zh": "已被应用。",
                "jp": "適用された。"
            },
            "There was a temporary error. Please try again in a few minutes.": {
                "ko": "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                "en": "There was a temporary error. Please try again in a few minutes.",
                "zh": "有一个暂时的错误。 请在几分钟后再试一次。",
                "jp": "一時的なエラーがありました。 数分後にもう一度お試しください。"
            },
            "Your email is not signed up.": {
                "ko": "가입되지 않은 Email 입니다.",
                "en": "Your email is not signed up.",
                "zh": "您的电子邮件未注册。",
                "jp": "あなたのメールアドレスはサインアップされていません。"
            },
            "Get started right away.": {
                "ko": "바로시작하기",
                "en": "Get started right away.",
                "zh": "立即开始。",
                "jp": "すぐに始めましょう。"
            },
            "Your email is verified.": {
                "ko": "인증되었습니다.",
                "en": "Your email is verified.",
                "zh": "您的电子邮件已验证。",
                "jp": "あなたの電子メールが確認されます。"
            },
            "There are already added images. Do you want to change it?": {
                "ko": "이미 추가된 이미지가 있습니다. 변경하시겠습니까?",
                "en": "There are already added images. Do you want to change it?",
                "zh": "已经添加了图像。 你想改变它吗？",
                "jp": "既に画像が追加されています。 あなたはそれを変更したいですか？"
            },
            "Image address string length is big. please down sizing image adress string length.": {
                "ko": "이미지 주소 문자열 길이가 깁니다. 이미지 주소 문자열 길이를 줄이십시오.",
                "en": "Image address string length is big. please down sizing image adress string length.",
                "zh": "图像地址字符串的长度很大。 请缩小图像地址字符串长度。",
                "jp": "イメージアドレス文字列の長さが大きいです。 イメージアドレス文字列の長さを縮小してください。"
            },
            "ko": {
                "ko": "한국어",
                "en": "Korean",
                "zh": "韩国语",
                "jp": "韓国語"
            },
            "en": {
                "ko": "영어",
                "en": "English",
                "zh": "英语",
                "jp": "英語"
            },
            "zh": {
                "ko": "중국어",
                "en": "Chinese",
                "zh": "中文",
                "jp": "中国語"
            },
            "jp": {
                "ko": "일본어",
                "en": "Japanese",
                "zh": "日本语",
                "jp": "日本語"
            },
            "default.js": {
                "ko": "함수 작업공간",
                "en": "Function workspace",
                "zh": "函数功能实现区",
                "jp": "関数ワークスペース"
            },
            "default.graph.js": {
                "ko": "대화시나리오",
                "en": "Dialog Scenario",
                "zh": "对话场景卡片图",
                "jp": "ダイアログシナリオ"
            },
            "bot.js": {
                "ko": "챗봇 설정",
                "en": "Chatbot Settings",
                "zh": "Chatbot设置",
                "jp": "チャットボットの設定"
            },
            "Changing information": {
                "ko": "정보수정",
                "en": "Changing information",
                "zh": "信息修改",
                "jp": "情報の変更"
            },
            "Questions or error reports and suggestions for improvement are received as friends with KakaoTalk Plus. Move to the PlayChat Plus friend? if select the 'Cancel', then you can send to our email.": {
                "ko": "질문 또는 오류보고 및 개선제안은 카카오톡 플러스친구로 받고 있습니다. 플레이챗 플러스친구로 이동하시겠습니까?\n\n'취소'를 선택하시면 저희에게 직접 메일을 보내실 수 있습니다.",
                "en": "Questions or error reports and suggestions for improvement are received as friends with KakaoTalk Plus. Move to the PlayChat Plus friend?\n\nif select the 'Cancel', then you can send to our email.",
                "zh": "与KakaoTalk Plus一起收到问题或错误报告以及改进建议。 移至PlayChat Plus朋友？\n\n如果选择“取消”，那么你可以发送到我们的电子邮件。",
                "jp": "質問やエラー報告、改善の提案は、カカオトークプラスで友人として受け取ります。 PlayChat Plusの友達に移動しますか？\n\n'キャンセル'を選択した場合、私たちの電子メールに送信することができます。"
            },
            "Chatbot Basic Information": {
                "ko": "챗봇 기본정보",
                "en": "Chatbot Basic Information",
                "zh": "Chatbot基本信息",
                "jp": "チャットボットの基本情報"
            },
            "Chatbot Options": {
                "ko": "챗봇 옵션",
                "en": "Chatbot Options",
                "zh": "Chatbot选项",
                "jp": "チャットボットのオプション"
            },
            "Option Name": {
                "ko": "옵션 명",
                "en": "Option Name",
                "zh": "选项名称",
                "jp": "オプション名"
            },
            "Option Value": {
                "ko": "옵션 값",
                "en": "Option Value",
                "zh": "期权价值",
                "jp": "オプション値"
            },
            "Chatbot Usable": {
                "ko": "챗봇 사용여부",
                "en": "Chatbot Usable",
                "zh": "Chatbot可用",
                "jp": "Chatbot使用可能"
            },
            "Chatbot Usable Description": {
                "ko": "(default: true) false일 경우 챗봇 사용이 중지됩니다.",
                "en": "(default: true) If false, chatbots will be disabled.",
                "zh": "（默认值：true）如果为false，chatbots将被禁用。",
                "jp": "（デフォルト：true）falseの場合、チャットボットは無効になります。"
            },
            "Auto Correction Usable": {
                "ko": "오타자동수정 기능 사용여부",
                "en": "Auto Correction Usable",
                "zh": "自动校正可用",
                "jp": "使用可能な自動補正"
            },
            "Auto Correction Usable Description": {
                "ko": "(default: false) true일경우 오타수정기능이 사용됩니다.",
                "en": "(default: false) If true, typo correction will be used.",
                "zh": "（默认值：false）如果为true，则会使用拼写错误更正。",
                "jp": "（デフォルト：false）trueの場合は、誤植が使用されます。"
            },
            "Chatbot Sharing": {
                "ko": "챗봇 공유",
                "en": "Chatbot Sharing",
                "zh": "聊天机器人共享",
                "jp": "チャットボットの共有"
            },
            "Start cards can not be deleted": {
                "ko": "시작카드는 삭제할 수 없습니다",
                "en": "Start cards can not be deleted",
                "zh": "启动卡不能被删除",
                "jp": "スタートカードは削除できません"
            },
            "The format does not match": {
                "ko": "형식이 일치하지 않습니다.",
                "en": "The format does not match",
                "zh": "格式不匹配",
                "jp": "フォーマットが一致しません"
            },
            "User input analysis": {
                "ko": "사용자입력 분석",
                "en": "User input analysis",
                "zh": "用户输入分析",
                "jp": "ユーザー入力分析"
            },
            "Entity Analysis": {
                "ko": "엔티티 분석",
                "en": "Entity Analysis",
                "zh": "实体分析",
                "jp": "エンティティ分析"
            },
            "Task Log": {
                "ko": "태스크 로그",
                "en": "Task Log",
                "zh": "任务日志",
                "jp": "タスクログ"
            },
            "Answer Analysis": {
                "ko": "답변 분석",
                "en": "Answer Analysis",
                "zh": "答案分析",
                "jp": "回答の分析"
            },
            "Natural language processing": {
                "ko": "자연어처리",
                "en": "Natural language processing",
                "zh": "自然语言处理",
                "jp": "自然言語処理"
            },
            "Natural language analysis": {
                "ko": "자연어 분석",
                "en": "Natural language analysis",
                "zh": "自然语言分析",
                "jp": "自然言語解析"
            },
            "Word class": {
                "ko": "품사",
                "en": "Word class",
                "zh": "词类",
                "jp": "単語クラス"
            },
            "Matching Intent": {
                "ko": "일치 인텐트",
                "en": "Matching Intent",
                "zh": "匹配意图",
                "jp": "マッチングの意図"
            },
            "Matching Rate": {
                "ko": "매치율",
                "en": "Matching Rate",
                "zh": "匹配率",
                "jp": "マッチング率"
            },
            "Email": {
                "ko": "이메일주소",
                "en": "Email",
                "zh": "电子邮件",
                "jp": "Eメール"
            },
            "Authority": {
                "ko": "권한",
                "en": "Authority",
                "zh": "权威",
                "jp": "権限"
            },
            "Add Member": {
                "ko": "멤버 추가",
                "en": "Add Member",
                "zh": "添加成员",
                "jp": "メンバーを追加"
            },
            "User Key": {
                "ko": "사용자 아이디",
                "en": "User Key",
                "zh": "用户密钥",
                "jp": "ユーザー・キー"
            },
            "Last conversation date": {
                "ko": "마지막 대화일자",
                "en": "Last conversation date",
                "zh": "上次会话日期",
                "jp": "最後の会話日"
            },
            "Date of first conversation": {
                "ko": "첫 대화 날짜",
                "en": "Date of first conversation",
                "zh": "第一次对话的日期",
                "jp": "最初会話の日付"
            },
            "Mobile": {
                "ko": "휴대폰 번호",
                "en": "Mobile",
                "zh": "移动",
                "jp": "モバイル"
            },
            "Provider": {
                "ko": "제공자",
                "en": "Provider",
                "zh": "提供商",
                "jp": "プロバイダ"
            },
            "The newly added card is still being edited.": {
                "ko": "새로 추가한 카드가 아직 편집중입니다.",
                "en": "The newly added card is still being edited.",
                "zh": "新添加的卡仍在编辑中。",
                "jp": "新しく追加されたカードはまだ編集中です。"
            },
            "Key": {
                "ko": "키",
                "en": "Key",
                "zh": "键",
                "jp": "キー"
            },
            "Value": {
                "ko": "값",
                "en": "Value",
                "zh": "值",
                "jp": "値"
            },
            "Dialog Card Id": {
                "ko": "대화카드 아이디",
                "en": "Dialog Card Id",
                "zh": "对话卡ID",
                "jp": "ダイアログカードID"
            },
            "Dialog Card Name": {
                "ko": "대화카드 이름",
                "en": "Dialog Card Name",
                "zh": "对话卡名称",
                "jp": "ダイアログ・カード名"
            },
            "Dialogset Name": {
                "ko": "대화셋 이름",
                "en": "Dialogset Name",
                "zh": "对话框名称",
                "jp": "ダイアログセット名"
            },
            "Matched Dialog Card": {
                "ko": "매칭된 대화카드",
                "en": "Matched Dialog Card",
                "zh": "匹配的对话卡",
                "jp": "一致したダイアログカード"
            },
            "Minimum": {
                "ko": "최소",
                "en": "Minimum",
                "zh": "匹配的对话卡",
                "jp": "一致したダイアログカード"
            },
            "Action Target": {
                "ko": "액션 대상",
                "en": "Action Target",
                "zh": "行动目标",
                "jp": "アクションターゲット"
            },
            "Options": {
                "ko": "옵션",
                "en": "Options",
                "zh": "选项",
                "jp": "オプション"
            },
            "Edit": {
                "ko": "수정하기",
                "en": "Edit",
                "zh": "编辑",
                "jp": "編集"
            },
            "Telegram": {
                "ko": "텔레그램",
                "en": "Telegram",
                "zh": "Telegram",
                "jp": "Telegram"
            },
            "Connected": {
                "ko": "연결되었습니다",
                "en": "Connected",
                "zh": "连接的。",
                "jp": "接続されました。"
            },
            "MiniWebChat": {
                "ko": "미니웹 채팅창",
                "en": "Mini Web Chat",
                "zh": "迷你网络聊天",
                "jp": "ミニウェブチャット"
            },
            "Insert the code below into the head or body of the website where you want to attach the mini-web chat window": {
                "ko": "미니 웹 채팅창을 붙일 웹사이트의 <head> 또는 <body>에 아래 코드를 삽입하세요.",
                "en": "Insert the code below into the <head> or <body> of the website where you want to attach the mini-web chat window",
                "zh": "将以下代码插入您想要附加迷你网络聊天窗口的网站的<head>或<body>中。",
                "jp": "ミニウェブチャットウィンドウを付けるウェブサイトの<head>または<body>に次のコードを挿入します。"
            },
            "Mobile Web Url": {
                "ko": "모바일 웹 주소",
                "en": "Mobile Web Url",
                "zh": "移动网址",
                "jp": "モバイルウェブURL"
            }
        };

        var list = {};

        var lan = function(key)
        {

            if(!key) return '';

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
