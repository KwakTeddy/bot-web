(function()
{
    var PlayWebBot = function(botId)
    {
        this.botId = botId;

        this.init();
    };

    (function()
    {
        this.init = function()
        {
            var iframe = document.createElement('iframe');
            iframe.src = 'http://localhost:8443/playchat/webchatting';

            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '400px';
            iframe.style.height = '400px';

            document.body.appendChild(iframe);
        };
    }).call(PlayWebBot.prototype);

    window.PlayWebBot = PlayWebBot;
})();
