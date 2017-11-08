var myWorker = new Worker("/lib/tracking/tracking-worker.js");

(function()
{
    'use strict';

    angular.module('playchat').controller('DemoController', ['$scope', '$resource', 'Socket', function ($scope, $resource, Socket)
    {
        var ContextAnalyticsService = $resource('/api/demo/context');

        $scope.$parent.loading = false;

        var video = document.getElementById('video');
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        var tracker = new tracking.ObjectTracker('face');
        tracker.setInitialScale(4);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);

        tracking.track('#video', tracker,
        {
            camera: true
        });

        myWorker.onmessage = function(event)
        {
            tracker.emit('track', event);
        };

        tracker.on('track', function(event)
        {
            context.clearRect(0, 0, canvas.width, canvas.height);

            event.data.forEach(function(rect)
            {
                //console.log(rect.x);
                context.strokeStyle = '#a64ceb';
                context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                context.font = '11px Helvetica';
                context.fillStyle = "#fff";
                context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);

                document.querySelector('.diagram').style.left = rect.x + 'px';
                document.querySelector('.diagram').style.top = rect.y + 'px';
            });
        });

        document.getElementById("toggletracking").addEventListener("click", function()
        {
            window.senddata = !window.senddata;

            if (window.senddata)
            {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        });

        (function()
        {
            var emitMsg = function(msg)
            {
                var options = { dev: true };

                var params = {};
                params.bot = 'demo';
                params.user = 'demo-user';
                params.msg = msg;
                params.options = options;

                Socket.emit('send_msg', params);
            };

            // voice
            var selected = undefined
            var timer = undefined;
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";
            recognition.onend = function()
            {
                console.log('끝');
                recognition.start();
            };

            recognition.onresult = function(event)
            {
                var results = event.results;
                for(var i=0; i<results.length; i++)
                {
                    console.log(results[i][0]);
                    selected = results[i][0];
                }

                if(selected.used)
                {
                    return;
                }

                if(timer)
                {
                    clearTimeout(timer);
                }

                timer = setTimeout(function()
                {
                    console.log('실행 : ', selected);
                    selected.used = true;

                    ContextAnalyticsService.get({ botId: 'demo', userId: 'demo-user', input: selected.transcript }, function(context)
                    {
                        console.log('컨텍스트 : ', context);
                    },
                    function(err)
                    {
                        console.log(err);
                    });

                    selected = undefined

                    recognition.stop();
                }, 1000);
            };

            recognition.start();

            Socket.on('send_msg', function(data)
            {
                console.log('데이터 : ', data);
                // setTimeout(function()
                // {
                //     var msg = new SpeechSynthesisUtterance(data);
                //     window.speechSynthesis.speak(msg);
                // }, 500);
            });

            emitMsg(':build');
        })();
    }]);
})();
