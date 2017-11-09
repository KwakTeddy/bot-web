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
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');

            var diagramPositions = {};

            diagramPositions.nlpDiagram = { x: 30, y: 60 };
            diagramPositions.contextDiagram = { x: 400, y: 60 };
            diagramPositions.intentDiagram = { x: 30, y: 200 };
            diagramPositions.turnTakingDiagram = { x: 750, y: 150 };

            // 최초에 거리를 먼저 측정해둠.
            for(var key in diagramPositions)
            {
                var x1 = diagramPositions[key].x;
                var y1 = diagramPositions[key].y;

                var x2 = 1024 / 2;
                var y2 = 768 / 2;

                var distance = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2 - y1, 2));
                diagramPositions[key].distance = distance;
            }


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


                    for(var key in diagramPositions)
                    {
                        var x1 = diagramPositions[key].x;
                        var y1 = diagramPositions[key].y;

                        // 사각형의 중심을 구하고.
                        var x2 = rect.x + rect.width / 2;
                        var y2 = rect.y + rect.height / 2;

                        var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                        //최초 거리보다 멀어졌다면.
                        if(diagramPositions[key].distance < distance)
                        {
                            var offset = distance - diagramPositions[key].distance;
                            if(x2 >= 1024 / 2)
                            {
                                diagramPositions[key].x += offset;
                            }
                            else
                            {
                                diagramPositions[key].x -= offset;
                            }

                            if(y2 >= 768 / 2)
                            {
                                diagramPositions[key].y += offset;
                            }
                            else
                            {
                                diagramPositions[key].y -= offset;
                            }

                            angular.element('#' + key).css('left', diagramPositions[key].x + 'px').css('top', diagramPositions[key].y + 'px');
                        }
                    }
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

                            var msg = new SpeechSynthesisUtterance(context.suggestion[0].output);
                            msg.lang = 'en-US';
                            window.speechSynthesis.speak(msg);
                        }

                        setTimeout(function()
                        {
                            $scope.$apply(function()
                            {
                                $scope.initDiagram();
                            });
                        }, 5000);
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
