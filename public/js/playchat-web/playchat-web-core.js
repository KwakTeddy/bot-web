(function()
{
    var Socket = function()
    {
        this.host = PlayChatWeb.host;
        this.userId = new Date().getTime();
        this.botId = document.body.getAttribute('data-id');
        this.botName = document.body.getAttribute('data-name');

        this.container = document.body.querySelector('.PlayChatBodyContainer');

        if(!this.botId)
        {
            return console.error('botId is not defined');
        }

        this.init();
    };

    Socket.prototype.send = function(msg)
    {
        var params = {};
        params.bot = this.botId;
        params.user = this.userId;
        params.msg = msg;

        this.socket.emit('send_msg', params);
    };

    var getCurrentTime = function(time)
    {
        var date = undefined;
        if(time)
            date = new Date(time);
        else
            date = new Date();

        var options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleDateString('ko-KR', options);
    };

    Socket.prototype.receive = function(data)
    {
        var that = this;

        var output = data.output;

        var template = '<div class="answer">\n' +
                       '    <img src="' + this.host + '/modules/playchat/simulator/client/imgs/bot.png">\n' +
                       '    <div class="system-text">\n' +
                       '        <span class="name">{botName}</span>\n' +
                       '        <span class="time">{time}</span>\n' +
                       '    </div>\n' +
                       '    <div class="bubble">\n' +
                       '        <em class="tail"></em>\n' +
                       '        <div class="speech">\n' +
                       '            <div class="speech-text">{text}</div>\n' +
                       '        </div>\n' +
                       '    </div>\n' +
                       '</div>';

        template = template.replace('{botName}', this.botName).replace('{time}', getCurrentTime()).replace('{text}', (output.text || '' ).replace(/</gi, '&lt;').replace(/>/gi, '&gt;').replace(/\n/gi, '<br>'));

        var div = document.createElement('div');
        div.innerHTML = template;

        template = div.children[0];

        if(output.image && output.image.url)
        {
            var t = document.createElement('div');
            t.className = 'output-image';
            t.innerHTML = '<img src="' + output.image.url + '" alt="' + output.image.displayname + '">';

            template.querySelector('.speech').appendChild(t);
        }

        if(output.buttons)
        {
            var html = '';
            for(var i=0; i<output.buttons.length; i++)
            {
                if(output.buttons[i].url)
                {
                    html = '<a href="' + output.buttons[i].url + '" style="color: #038eda; border: 0;" target="_blank">' + output.buttons[i].text + '</a>' + html;
                }
                else
                {
                    html += '<a style="cursor: pointer;" href="#" target="_blank">' + output.buttons[i].text + '</a>';
                }
            }

            var t = document.createElement('div');
            t.className = 'output-buttons';
            t.innerHTML = html;

            template.querySelector('.speech').appendChild(t);
        }

        this.container.appendChild(template);

        var buttons = this.container.querySelectorAll('.output-buttons a');
        for(var i=0; i<buttons.length; i++)
        {
            buttons[i].addEventListener('click', function(e)
            {
                var output = this.innerText;

                that.addUserBubble(output);

                that.send(output);

                e.preventDefault();
                e.stopPropagation();
            });
        }

        this.container.scrollTop = this.container.scrollHeight;
    };

    Socket.prototype.addUserBubble = function(text)
    {
        var template = '<div class="question">\n' +
                       '    <div class="system-text">\n' +
                       '        <span class="time">{time}</span>\n' +
                       '    </div>\n' +
                       '    <div class="bubble">\n' +
                       '        <em class="tail"></em>\n' +
                       '        <div>\n' +
                       '            <div class="speech">\n' +
                       '                <div class="speech-text">{text}</div>\n' +
                       '            </div>\n' +
                       '        </div>\n' +
                       '    </div>\n' +
                       '</div>';

        template = template.replace('{time}', getCurrentTime()).replace('{text}', text);

        var div = document.createElement('div');
        div.innerHTML = template;

        template = div.children[0];

        this.container.appendChild(template);

        this.container.scrollTop = this.container.scrollHeight;
    };

    Socket.prototype.init = function()
    {
        var that = this;

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.host + '/socket.io/socket.io.js';
        script.onload = function()
        {
            var socket = io(that.host);
            socket.on('connect', function()
            {
                that.socket = socket;
                that.send(':reset user');

                document.body.querySelector('.PlayChatMsgContainer input').addEventListener('keydown', function(e)
                {
                    if(e.keyCode == 13)
                    {
                        var text = this.value;
                        that.addUserBubble(text);
                        this.value = '';
                        that.send(text);
                    }
                });
            });

            socket.on('send_msg', function(data)
            {
                that.receive(data);
            });

            socket.on('disconnect', function()
            {
                var div = document.createElement('div');
                div.innerText = '연결이 종료되었습니다';
                div.style.fontSize = '12px';
                div.style.color = '#aaa';
                div.style.textAlign = 'center';

                that.container.appendChild(div);
            });
        };

        document.body.appendChild(script);
    };

    window.PlayChatSocket = Socket;
})();
