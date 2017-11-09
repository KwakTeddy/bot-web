var myWorker = new Worker("/lib/tracking/tracking-worker.js");

(function()
{
    'use strict';

    angular.module('playchat').controller('DemoController', ['$scope', '$resource', 'Socket', function ($scope, $resource, Socket)
    {
        $scope.$parent.loading = false;

        $scope.initDiagram = function()
        {
            $scope.diagram = {
                nlp: undefined,
                suggestion: [],
                intent: undefined,
                turnTaking: undefined
            };
        };

        $scope.initDiagram();


        //// Tracking
        (function()
        {
            var canvas = document.querySelector('canvas');
            var context = canvas.getContext('2d');
            var diagramPositions = {};

            diagramPositions.nlpDiagram = { x: 30, y: 60, width: 300, height: 80 };
            diagramPositions.contextDiagram = { x: 400, y: 60, width: 150, height: 80 };
            diagramPositions.intentDiagram = { x: 30, y: 200, width: 300, height: 80 };
            diagramPositions.turnTakingDiagram = { x: 750, y: 150, width: 180, height: 35 };

            var cx = 1280 / 2;
            var cy = 960 / 2;

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

                    var x2 = rect.x + rect.width / 2;
                    var y2 = rect.y + rect.height / 2;

                    var xOffset = x2 - cx;
                    var yOffset = y2 - cy;

                    if(xOffset > 100 || yOffset > 100)
                        return;

                    // for(var key in diagramPositions)
                    var key = 'nlpDiagram';
                    {
                        // 사각형의 중심을 구하고.
                        // if(diagramPositions[key].x + xOffset >= 0 && diagramPositions[key].x + xOffset + diagramPositions[key].width <= 1290 && diagramPositions[key].y + yOffset >= 0 && diagramPositions[key].y + yOffset + diagramPositions[key].height <= 920)
                            angular.element('.diagram-container').css('left', xOffset + 'px').css('top', yOffset + 'px');
                        // else
                        //     break;

                        // if(diagramPositions[key].y + yOffset >= 0 && diagramPositions[key].y + yOffset + diagramPositions[key].height <= 920)
                        //     angular.element('#' + key).css('top', diagramPositions[key].y + yOffset + 'px');
                    }
                });
            });

            document.getElementById("toggletracking").addEventListener("click", function()
            {
                window.senddata = !window.senddata;

                if (window.senddata)
                {
                    // context.clearRect(0, 0, canvas.width, canvas.height);
                }
            });

            window.senddata = true;
        })();



        ///// Voice & Diagram
        (function()
        {
            var ContextAnalyticsService = $resource('/api/demo/context');
            var DeepLearningService = $resource('/api/demo/deeplearning');

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
            window.utterances = undefined;

            var pause = false;
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
                printScript = undefined;
            };

            recognition.onresult = function(event)
            {
                if(pause)
                    return;

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
                    console.log('실행 : ', selected);
                    recognition.stop();
                    printScript = selected.transcript;
                    ContextAnalyticsService.get({ botId: 'demo', userId: 'demo-user', input: selected.transcript, language: 'en' }, function(context)
                    {
                        recognition.start();
                        console.log('컨텍스트 : ', context);
                        if(context.nlp)
                        {
                            $scope.diagram.nlp = context.nlp;
                        }

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

                            pause = true;
                            var msg = new SpeechSynthesisUtterance(context.suggestion[0].output);
                            msg.lang = 'en-US';
                            msg.pitch = 1;
                            msg.onstart = function()
                            {
                                console.log('봇 말하기 시작');
                            };

                            msg.onend = function()
                            {
                                console.log('봇 말하기 끝');
                                pause = false;

                                setTimeout(function()
                                {
                                    $scope.$apply(function()
                                    {
                                        $scope.initDiagram();
                                    });
                                }, 3000);
                            };

                            setTimeout(function()
                            {
                                window.utterances = msg;
                                window.speechSynthesis.speak(msg);
                            }, 100);
                        }

                        if(context.turnTaking)
                        {
                            $scope.diagram.turnTaking = context.turnTaking;
                        }
                    },
                    function(err)
                    {
                        console.log(err);
                    });

                    selected = undefined;
                }, 1000);
            };

            recognition.start();

            Socket.on('send_msg', function(data)
            {
                console.log('데이터 : ', data);
            });

            emitMsg(':build');
        })();
    }]);
})();
