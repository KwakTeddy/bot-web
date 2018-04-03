(function()
{
    var PlayChatWeb = function(botId, botName)
    {
        this.host = 'http://localhost:8443';
        this.botId = botId;
        this.botName = botName;
    };

    (function()
    {
        this.initElements = function()
        {
            this.iframe = document.createElement('iframe');
            this.iframe.style.position = 'fixed';
            this.iframe.style.right = '20px';
            this.iframe.style.bottom = '20px';
            this.iframe.style.width = '300px';
            this.iframe.style.height = '400px';
            this.iframe.style.border = '1px solid #ddd';
            this.iframe.style.boxShadow = '0px 4px 10px 0px rgba(0, 0, 0, 0.75)';
            this.iframe.style.zIndex = 1000;

            document.body.appendChild(this.iframe);

            this.container = document.createElement('div');
            this.container.className = 'PlayChatWebContainer';
            this.container.style.display = 'none';

            this.header = document.createElement('div');
            this.header.className = 'PlayChatWebHeader';
            this.header.innerText = 'PlayChat';

            this.bodyContainer = document.createElement('div');
            this.bodyContainer.className = 'PlayChatBodyContainer';

            this.messageContainer = document.createElement('div');
            this.messageContainer.className = 'PlayChatMsgContainer';

            this.messageInput = document.createElement('input');
            this.messageInput.placeholder = '메시지를 입력해주세요';
            this.messageContainer.appendChild(this.messageInput);

            this.container.appendChild(this.header);
            this.container.appendChild(this.bodyContainer);
            this.container.appendChild(this.messageContainer);

        };

        this.init = function()
        {
            window.addEventListener('DOMContentLoaded', function()
            {
                this.initElements();
                var body = this.iframe.contentDocument.body;

                var style = document.createElement('link');
                style.setAttribute('rel', 'stylesheet');
                style.setAttribute('href', this.host + '/js/playchat-web/playchat-web.css');

                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = this.host + '/js/playchat-web/playchat-web-core.js';

                body.appendChild(style);
                body.appendChild(this.container);
                body.appendChild(script);
                body.setAttribute('data-id', this.botId || '');
                body.setAttribute('data-name', this.botName || '');

            }.bind(this));
        };

    }).call(PlayChatWeb.prototype);

    window.PlayChatWeb = PlayChatWeb;
})();
