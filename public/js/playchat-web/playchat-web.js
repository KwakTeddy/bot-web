(function()
{
    var PlayChatWeb = function(botId, botName, host)
    {
        this.host = host;
        this.botId = botId;
        this.botName = botName;
    };

    (function()
    {
        this.initElements = function()
        {
            this.iframe = document.createElement('iframe');
            this.iframe.style.position = 'fixed';
            this.iframe.style.right = '25px';
            this.iframe.style.bottom = '25px';
            this.iframe.style.width = '280pt';

            // explorer only
            if(navigator.userAgent.indexOf("MSIE")!=-1){
                this.iframe.style.width = '380pt';
            }

            this.iframe.style.height = '70%';
            this.iframe.style.maxHeight = '720px';
            this.iframe.style.minHeight = '480px';
            this.iframe.style.border = 'none';
            this.iframe.style.animation = 'fXAEQw 0.25s ease-out !important';
            this.iframe.style.overflow = 'hidden';
            this.iframe.style.zIndex = 1000;

            document.body.appendChild(this.iframe);

            this.container = document.createElement('div');
            this.container.className = 'PlayChatWebContainer';

            this.header = document.createElement('div');
            this.header.className = 'PlayChatWebHeader';
            this.header.innerHTML = '<div class="close"></div> <span>PlayChat</span>';

            this.bodyContainer = document.createElement('div');
            this.bodyContainer.className = 'PlayChatBodyContainer';
            this.bodyContainer.innerHTML = '';

            this.messageContainer = document.createElement('div');
            this.messageContainer.className = 'PlayChatMsgContainer';

            this.messageInput = document.createElement('input');
            this.messageInput.placeholder = '메시지를 입력해주세요';
            this.messageContainer.appendChild(this.messageInput);

            this.container.appendChild(this.header);
            this.container.appendChild(this.bodyContainer);
            this.container.appendChild(this.messageContainer);

            this.icon = document.createElement('div');
            this.icon.className = 'PlayChatIcon';
            this.icon.innerHTML = '<a></a>';

            var that = this;
            this.icon.addEventListener('click', function()
            {
                that.container.style.display = 'flex';
            });

            this.container.querySelector('.close').addEventListener('click', function()
            {
                that.container.style.display = '';
            });
        };

        this.init = function()
        {
            var that = this;
            window.addEventListener('DOMContentLoaded', function()
            {
                this.initElements();
                var body = this.iframe.contentDocument.body;

                this.iframe.contentDocument.host = that.host;

                var style = document.createElement('link');
                style.setAttribute('rel', 'stylesheet');
                style.setAttribute('href', this.host + '/js/playchat-web/playchat-web.css');

                var script = document.createElement('script');
                script.type = 'text/javascript';

                script.src = this.host + '/js/playchat-web/playchat-web-core.js';

                body.appendChild(style);
                body.appendChild(this.container);
                body.appendChild(this.icon);
                body.appendChild(script);
                body.setAttribute('data-id', this.botId || '');
                body.setAttribute('data-name', this.botName || '');

            }.bind(this));
        };

    }).call(PlayChatWeb.prototype);

    window.PlayChatWeb = PlayChatWeb;
})();
