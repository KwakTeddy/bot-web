var myWorker = new Worker("/lib/tracking/tracking-worker.js");

(function()
{
    'use strict';

    angular.module('playchat').controller('DemoController', ['$scope', '$resource', 'Socket', function ($scope, $resource, Socket)
    {
        $scope.diagram = {
            nlp: '',
            suggestion: []
        };

        var ContextAnalyticsService = $resource('/api/demo/context');
        var DeepLearningService = $resource('/api/demo/deeplearning');

        $scope.$parent.loading = false;

        var video = document.getElementById('video');
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        var lastSquare = undefined;

        var prevNlpDiagramPosition = { x: 30, y: 30 };

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

                if(lastSquare)
                {
                    var x = rect.x - 300;
                    x = x <= 30 ? 30 : x;

                    var y = rect.y - 300;
                    y = y <= 30 ? 30 : y;

                    if(Math.abs(x - prevNlpDiagramPosition.x) < 100 && Math.abs(y - prevNlpDiagramPosition.y) < 100)
                    {
                        angular.element('#nlpDiagram').css('left', x + 'px').css('top', y + 'px');

                        prevNlpDiagramPosition.x = x;
                        prevNlpDiagramPosition.y = y;
                    }
                }

                lastSquare = rect;
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
            var printScript = '';
            var selected = undefined
            var timer = undefined;
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
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

                if(selected.used || printScript == selected.transcript)
                {
                    return;
                }

                selected.used = true;

                if(timer)
                {
                    clearTimeout(timer);
                }

                timer = setTimeout(function()
                {
                    recognition.stop();
                    printScript = selected.transcript;
                    ContextAnalyticsService.get({ botId: 'demo', userId: 'demo-user', input: selected.transcript, language: 'en' }, function(context)
                    {
                        console.log('컨텍스트 : ', context);

                        if(context.nlp)
                            $scope.diagram.nlp = context.nlp;

                        if(context.suggestion.length > 0)
                        {
                            $scope.diagram.suggestion = [];
                            for(var i=0; i<context.suggestion.length; i++)
                            {
                                var matchRate = parseInt((context.suggestion[i].matchRate || 0) * 10);

                                if(matchRate == 0)
                                    continue;

                                context.suggestion[i].matchPercent = '';
                                for(var j=0; j<matchRate; j++)
                                {
                                    context.suggestion[i].matchPercent += '|';
                                }

                                context.suggestion[i].matchRate = matchRate / 10;

                                $scope.diagram.suggestion.push(context.suggestion[i]);
                            }

                            console.log('흠', context.suggestion[0].output);
                            var msg = new SpeechSynthesisUtterance(context.suggestion[0].output);
                            msg.lang = 'en-US';
                            window.speechSynthesis.speak(msg);
                        }
                        else
                        {
                            $scope.diagram.suggestion = [];
                        }
                    },
                    function(err)
                    {
                        console.log(err);
                    });

                    // DeepLearningService.get({ user: selected.transcript }, function(dlResult)
                    // {
                    //     console.log(dlResult);
                    //     var msg = new SpeechSynthesisUtterance(dlResult);
                    //     window.speechSynthesis.speak(msg);
                    // },
                    // function(err)
                    // {
                    //     console.log(err);
                    // });

                    selected = undefined;
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

            // ContextAnalyticsService.get({ botId: 'demo', userId: 'demo-user', input: '양문형 형태 알려줘' }, function(context)
            // {
            //     console.log('컨텍스트 : ', context);
            // },
            // function(err)
            // {
            //     console.log(err);
            // });

            emitMsg(':build');
        })();
    }]);
})();
