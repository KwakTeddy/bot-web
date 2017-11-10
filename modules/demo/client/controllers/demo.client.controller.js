var myWorker = new Worker("/lib/tracking/tracking-worker.js");

(function()
{
    'use strict';

    angular.module('playchat').controller('DemoController', ['$scope', '$resource', 'Socket', function ($scope, $resource, Socket)
    {
        $scope.$parent.loading = false;

        $scope.initDiagram = function()
        {
            $scope.diagram = $scope.diagram || {};
            $scope.diagram.suggestion = [];
            $scope.diagram.intent = undefined;
            $scope.diagram.context = undefined;
            $scope.diagram.turnTaking = undefined;
            // $scope.diagram.emotion = [];

            console.log('초기화 : ', $scope.diagram);

            angular.element('#suggestionDiagram').css('height', '70px');
        };

        $scope.initDiagram();

        // (function()
        // {
        //     //Camera size setting;
        //     var width = angular.element(window).width();
        //     var height = angular.element(window).height();
        //
        //     angular.element('.video-wrapper').css('width', width + 'px').css('height', height + 'px');
        //     angular.element(window).on('resize', function()
        //     {
        //         console.log('리사이즈');
        //         var width = angular.element(window).width();
        //         var height = angular.element(window).height();
        //         angular.element('.video-wrapper').css('width', width + 'px').css('height', height + 'px');
        //     });
        // })();


        (function()
        {
            // Tracking setting

            // tracking.initUserMedia_ = function(element, opt_options)
            // {
            //     window.navigator.getUserMedia({
            //         video: {
            //             width: 1280,
            //             height: 720
            //         },
            //         audio: !!(opt_options && opt_options.audio)
            //     }, function(stream) {
            //         try {
            //             element.src = window.URL.createObjectURL(stream);
            //         } catch (err) {
            //             element.src = stream;
            //         }
            //     }, function() {
            //         throw Error('Cannot capture user camera.');
            //     });
            // };
            //
            // var tracker = new tracking.ObjectTracker('face');
            // tracker.setInitialScale(4);
            // tracker.setStepSize(2);
            // tracker.setEdgesDensity(0.1);
            //
            //
            // tracking.track('#video', tracker,
            // {
            //     camera: true
            // });

            // Tracking setting

            // tracking.initUserMedia_ = function(element, opt_options)
            // {
            //     window.navigator.getUserMedia({
            //         video: {
            //             width: 1280,
            //             height: 720
            //         },
            //         audio: !!(opt_options && opt_options.audio)
            //     }, function(stream) {
            //         try {
            //             element.src = window.URL.createObjectURL(stream);
            //         } catch (err) {
            //             element.src = stream;
            //         }
            //     }, function() {
            //         throw Error('Cannot capture user camera.');
            //     });
            // };
            //
            // var tracker = new tracking.ObjectTracker('face');
            // tracker.setInitialScale(4);
            // tracker.setStepSize(2);
            // tracker.setEdgesDensity(0.1);
            //
            //
            // tracking.track('#video', tracker,
            // {
            //     camera: true
            // });

            var video = angular.element('video').get(0);

            navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

            navigator.getMedia({ video: !0, audio: !1 }, function(stream)
            {
                if(navigator.mozGetUserMedia)
                    video.mozSrcObject = stream;
                else
                {
                    var vu = window.URL || window.webkitURL;
                    video.src = vu.createObjectURL(stream);
                }
                video.play();
            }, function(error)
            {
                if(window.console)
                    console.error(error);
            });

            var streaming = false;

            var width = angular.element(window).width();
            video.addEventListener('canplay', function(ev)
            {
                if(!streaming)
                {
                    var height = video.videoHeight / (video.videoWidth / width) - 8;
                    video.setAttribute('width', width);
                    video.setAttribute('height', height);
                    streaming = true;
                }
            }, !1);

            angular.element(window).on('resize', function()
            {
                var width = angular.element(window).width();
                var height = video.videoHeight / (video.videoWidth / width) - 8;
                video.setAttribute('width', width);
                video.setAttribute('height', height);

                console.log('머지 ', width);
            });
        })();


        (function()
        {
            var emotionLabel = {
                0: 'anger',
                1: 'boredom',
                2: 'empty',
                3: 'enthusiasm',
                4: 'fun',
                5: 'happiness',
                6: 'hate',
                7: 'love',
                8: 'neutral',
                9: 'relief',
                10: 'sadness',
                11: 'surprise',
                12: 'worry'
            };

            /*********************** voice **********************************/
            var recognition;
            var final_transcript = '';
            var recognizing = false;
            var ignore_onend;
            var start_timestamp;
            var finalFinish = false, timeoutFinish = false;
            var regcognitionTimer;
            var opacityTimer = undefined;

            Socket.on('response-dl', function(data)
            {
                console.log('딥러닝 데이터 : ' , data);

                if(data.error == -1)
                {
                    var probability = data.probability;

                    for(var i=0; i<probability.length; i++)
                    {
                        probability[i] = { name : emotionLabel[i], value: parseInt(probability[i]*100) / 100 };
                    }

                    probability.sort(function(a, b)
                    {
                        return b.value - a.value;
                    });

                    probability.splice(5, 7);

                    $scope.diagram.emotion = probability;
                }
                else
                {
                    $scope.diagram.emotion = [];
                }
            });

            Socket.on('response-analytics', function(data)
            {
                clearTimeout(opacityTimer);

                var context = data;
                angular.element('.diagram').css('opacity', '1');
                console.log('분석 데이터 : ' , data);
                if(context.nlu.nlp)
                {
                    $scope.diagram.nlp = context.nlu.nlp;
                }
                else
                {
                    $scope.diagram.nlp = undefined;
                }

                if(context.nlu)
                {
                    if(context.nlu.contextInfo && context.nlu.contextInfo.contextHistory && context.nlu.contextInfo.contextHistory[0])
                    {
                        $scope.diagram.context = Object.keys(context.nlu.contextInfo.contextHistory[0])[0];
                    }

                    if(context.nlu.dialog.intent)
                    {
                        $scope.diagram.intent = context.nlu.dialog.intent;
                        if(!isNaN($scope.diagram.intent.matchRate))
                        {
                            $scope.diagram.intent.matchRate = parseInt($scope.diagram.intent.matchRate * 10) / 10;
                        }
                    }
                    else
                    {
                        $scope.diagram.intent = undefined;
                    }
                }

                if(context.entities)
                {
                    $scope.diagram.entity = [];
                    for(var key in context.entities)
                    {
                        for(var i=0; i<context.entities[key].length; i++)
                        {
                            $scope.diagram.entity.push(context.entities[key][i]);
                        }
                    }
                }
                else
                {
                    $scope.diagram.entity = undefined;
                }

                if(context.turnTaking)
                {
                    $scope.diagram.turnTaking = context.turnTaking;
                }
                else
                {
                    $scope.diagram.turnTaking = undefined;
                }

                if(Object.keys(context.nlu.contextInfo.contextHistory[0]).length > 0)
                {
                    $scope.diagram.context = Object.keys(context.nlu.contextInfo.contextHistory[0])[0];
                }
                else
                {
                    $scope.diagram.context = undefined;
                }

                if(context.nlu.matchInfo.qa.length > 0)
                {
                    // angular.element('#suggestionDiagram').css('height', '220px');
                    $scope.diagram.suggestion = [];
                    for(var i=0; i<context.nlu.matchInfo.qa.length && i < 5; i++)
                    {
                        var matchRate = parseInt((context.nlu.matchInfo.qa[i].matchRate || 0) * 10);

                        if(matchRate == 0)
                            continue;

                        context.nlu.matchInfo.qa[i].matchRate = matchRate / 10;

                        $scope.diagram.suggestion.push(context.nlu.matchInfo.qa[i]);
                    }

                    if($scope.diagram.suggestion.length == 0)
                    {
                        // recognizeStart();
                        return;
                    }

                    setTimeout(function()
                    {
                        var height = angular.element('#suggestionDiagram table').css('height');
                        angular.element('#suggestionDiagram').css('height', height.replace('px', '')*1 + 40 + 'px');
                    }, 100);

                    // recognizeStart();
                }
                else
                {
                    // recognizeStart();
                }

                // opacityTimer = setTimeout(function()
                // {
                //     angular.element('.diagram').css('opacity', '0');
                // }, 1000 * 10);
            });

            var sendSocket = function(text)
            {
                console.log('실행 : ', text);
                // Socket.emit('deeplearning', { bot: 'demo', user: 'demo-user', msg: text, options: { language: 'en' } });
                Socket.emit('analytics', { bot: 'demo', user: 'demo-user', msg: text, options: { language: 'en' } });
            };

            var makeRecognition = function()
            {
                if (!('webkitSpeechRecognition' in window))
                {
                    // console.log('upgrade');
                }
                else
                {
                    recognition = new webkitSpeechRecognition();
                    recognition.continuous = true;
                    recognition.interimResults = true;

                    recognition.onstart = function() {
                        console.log('recognition.onstart');

                        recognizing = true;
                    };

                    recognition.onerror = function(event)
                    {
                        // console.log('recognition.onerror' + event.error);

                        // if (event.error == 'no-speech') {
                        //     // console.log('info_no_speech');
                        //     ignore_onend = true;
                        // } else if (event.error == 'audio-capture') {
                        //     // console.log('info_no_microphone');
                        //     ignore_onend = true;
                        // } else if (event.error == 'not-allowed') {
                        //     if (event.timeStamp - start_timestamp < 100) {
                        //         // console.log('info_blocked');
                        //     } else {
                        //         // console.log('info_denied');
                        //     }
                        //     ignore_onend = true;
                        // } else ignore_onend = true;
                    };

                    recognition.onend = function()
                    {
                        console.log('recognition.onend');

                        // if(recognizing) recognizeStart();
                        recognizing = false;
                        if (ignore_onend) return;


                        if (!final_transcript) {
                            // console.log('info_start');
                            return;
                        }
                        // console.log('recognition.onend: ' + final_transcript);

                        // recognizeStart();

                        // vm.sendMsg(final_transcript);
                    };

                    recognition.onresult = function(event) {
                        console.log('recognition.onresult');

                        // clearTimeout(remainTimer);

                        if (ignore_onend) return;
                        // ignore_onend = false;

                        var isFinal = false;
                        var interim_transcript = '';
                        for (var i = event.resultIndex; i < event.results.length; ++i) {

                            if (event.results[i].isFinal) {
                                isFinal = true;
                            }

                            // if (event.results[i].isFinal) {
                            //   final_transcript += event.results[i][0].transcript;
                            //   isFinal = true;
                            // } else {
                            interim_transcript += event.results[i][0].transcript;
                            // }
                        }

                        final_transcript = interim_transcript;

                        if (final_transcript || interim_transcript)
                        {
                            // console.log('transcript: ' + interim_transcript);
                        }

                        sendSocket(interim_transcript);

                        if(isFinal)
                        {
                            // console.log('isFinal:' + 'final('+finalFinish + '),timeout(' + timeoutFinish + ')');
                            if(timeoutFinish) {
                                finalFinish = false; timeoutFinish = false;
                                return;
                            }
                            finalFinish = true;
                            // console.log('isFinal:' + interim_transcript);
                            // recognizeStop();

                            //send
                            sendSocket(interim_transcript);
                        }
                        else
                        {
                            if(regcognitionTimer)
                            {
                                clearTimeout(regcognitionTimer);
                            }

                            regcognitionTimer = setTimeout(function()
                            {
                                // console.log('timeout:' + 'final('+finalFinish + '),timeout(' + timeoutFinish + ')');
                                if(finalFinish)
                                {
                                    // console.log('여기');
                                    finalFinish = false; timeoutFinish = false;
                                    return;
                                }
                                else if(timeoutFinish)
                                {
                                    // console.log('여기');
                                    return;
                                }

                                timeoutFinish = true;
                                // console.log('timeout: ' + interim_transcript);
                                if(interim_transcript != undefined && interim_transcript != '')
                                {
                                    ignore_onend = true;
                                    // recognizeStop();

                                    //send
                                    sendSocket(interim_transcript);
                                }
                            }, 3000);
                        }
                    };

                    // setInterval(function()
                    // {
                    //     console.log('재개설 : ');
                    //     makeRecognition();
                    //     recognizeStart();
                    // }, 1000 * 30);
                }
            };

            makeRecognition();

            function recognizeStop() {
                // console.log('recognizeStop');

                recognizing = false;
                if (recognition != undefined) recognition.stop();
            }

            function recognizeStart() {
                // console.log('recognizeStart');
                // if (recognizing && recognition != undefined) {
                //     recognition.stop();
                //     return;
                // }

                recognition.lang = 'en-US';
                // console.log(recognition);
                recognition.start();

                final_transcript = '';
                ignore_onend = false;
                finalFinish = false;
                timeoutFinish = false;
                recognizing = true;

                // start_timestamp = event.timeStamp;
            }

            recognizeStart();
        })();


        //// Tracking
        // (function()
        // {
        //     var width = angular.element(window).width();
        //     var height = angular.element(window).height();
        //
        //     angular.element('.video-container').css('width', width + 'px').css('height', height + 'px');
        //     angular.element(window).on('resize', function()
        //     {
        //         console.log('리사이즈');
        //         var width = angular.element(window).width();
        //         var height = angular.element(window).height();
        //         angular.element('.video-container').css('width', width + 'px').css('height', height + 'px');
        //     });
        //
        //     var canvas = document.querySelector('canvas');
        //     var context = canvas.getContext('2d');
        //     var diagramPositions = {};
        //
        //     diagramPositions.nlpDiagram = { x: 30, y: 60, width: 300, height: 80 };
        //     diagramPositions.contextDiagram = { x: 400, y: 60, width: 150, height: 80 };
        //     diagramPositions.intentDiagram = { x: 30, y: 200, width: 300, height: 80 };
        //     diagramPositions.turnTakingDiagram = { x: 750, y: 150, width: 180, height: 35 };
        //
        //     var cx = 1280 / 2;
        //     var cy = 960 / 2;
        //
        //     var tracker = new tracking.ObjectTracker('face');
        //     tracker.setInitialScale(4);
        //     tracker.setStepSize(2);
        //     tracker.setEdgesDensity(0.1);
        //
        //     tracking.track('#video', tracker,
        //     {
        //         camera: true
        //     });
        //
        //     myWorker.onmessage = function(event)
        //     {
        //         tracker.emit('track', event);
        //     };
        //
        //     tracker.on('track', function(event)
        //     {
        //         context.clearRect(0, 0, canvas.width, canvas.height);
        //
        //         event.data.forEach(function(rect)
        //         {
        //             //console.log(rect.x);
        //             context.strokeStyle = '#a64ceb';
        //             context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        //             context.font = '11px Helvetica';
        //             context.fillStyle = "#fff";
        //             context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        //             context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        //
        //             var x2 = rect.x + rect.width / 2;
        //             var y2 = rect.y + rect.height / 2;
        //
        //             var xOffset = x2 - cx;
        //             var yOffset = y2 - cy;
        //
        //             if(xOffset > 100 || yOffset > 100)
        //                 return;
        //
        //             // for(var key in diagramPositions)
        //             var key = 'nlpDiagram';
        //             {
        //                 // 사각형의 중심을 구하고.
        //                 // if(diagramPositions[key].x + xOffset >= 0 && diagramPositions[key].x + xOffset + diagramPositions[key].width <= 1290 && diagramPositions[key].y + yOffset >= 0 && diagramPositions[key].y + yOffset + diagramPositions[key].height <= 920)
        //                     angular.element('.diagram-container').css('left', xOffset + 'px').css('top', yOffset + 'px');
        //                 // else
        //                 //     break;
        //
        //                 // if(diagramPositions[key].y + yOffset >= 0 && diagramPositions[key].y + yOffset + diagramPositions[key].height <= 920)
        //                 //     angular.element('#' + key).css('top', diagramPositions[key].y + yOffset + 'px');
        //             }
        //         });
        //     });
        //
        //     document.getElementById("toggletracking").addEventListener("click", function()
        //     {
        //         window.senddata = !window.senddata;
        //
        //         if (window.senddata)
        //         {
        //             // context.clearRect(0, 0, canvas.width, canvas.height);
        //         }
        //     });
        //
        //     window.senddata = true;
        // })();
        //
        //
        //
        // ///// Voice & Diagram
        // (function()
        // {
        //     var ContextAnalyticsService = $resource('/api/demo/context');
        //     var DeepLearningService = $resource('/api/demo/deeplearning');
        //
        //     var emitMsg = function(msg)
        //     {
        //         var options = { dev: true };
        //
        //         var params = {};
        //         params.bot = 'demo';
        //         params.user = 'demo-user';
        //         params.msg = msg;
        //         params.options = options;
        //
        //         Socket.emit('send_msg', params);
        //     };
        //
        //     // voice
        //     window.utterances = undefined;
        //
        //     var pause = false;
        //     var printScript = '';
        //     var selected = undefined
        //     var timer = undefined;
        //     var recognition = new webkitSpeechRecognition();
        //     recognition.continuous = true;
        //     recognition.interimResults = true;
        //     recognition.lang = 'en-US';
        //
        //     recognition.onstart = function()
        //     {
        //         console.log('시작');
        //     };
        //
        //     recognition.onend = function()
        //     {
        //         console.log('끝');
        //         printScript = undefined;
        //         if(pause)
        //         {
        //             return;
        //         }
        //
        //         recognition.start();
        //     };
        //
        //     recognition.onresult = function(event)
        //     {
        //         console.log('퍼즈 : ', pause);
        //         if(pause)
        //             return;
        //
        //         var results = event.results;
        //         for(var i=0; i<results.length; i++)
        //         {
        //             selected = results[i][0];
        //             if(results[i].isFinal)
        //             {
        //                 recognition.stop();
        //             }
        //         }
        //
        //         if(selected.used || printScript == selected.transcript)
        //         {
        //             return;
        //         }
        //
        //         selected.used = true;
        //
        //         if(timer)
        //         {
        //             clearTimeout(timer);
        //         }
        //
        //         timer = setTimeout(function()
        //         {
        //             console.log('실행 : ', selected);
        //             printScript = selected.transcript;
        //             ContextAnalyticsService.get({ botId: 'demo', userId: 'demo-user', input: selected.transcript, language: 'en' }, function(context)
        //             {
        //                 console.log('컨텍스트 : ', context);
        //                 if(context.nlp)
        //                 {
        //                     $scope.diagram.nlp = context.nlp;
        //                 }
        //
        //                 if(context.nlu)
        //                 {
        //                     if(context.nlu.contextInfo && context.nlu.contextInfo.contextHistory && context.nlu.contextInfo.contextHistory[0])
        //                     {
        //                         $scope.diagram.context = Object.keys(context.nlu.contextInfo.contextHistory[0])[0];
        //                     }
        //
        //                     if(context.nlu.dialog.intent)
        //                     {
        //                         $scope.diagram.intent = context.nlu.dialog.intent;
        //                     }
        //                 }
        //
        //                 if(context.turnTaking)
        //                 {
        //                     $scope.diagram.turnTaking = context.turnTaking;
        //                 }
        //
        //
        //                 if(context.suggestion.length > 0)
        //                 {
        //                     $scope.diagram.suggestion = [];
        //                     for(var i=0; i<context.suggestion.length; i++)
        //                     {
        //                         var matchRate = parseInt((context.suggestion[i].matchRate || 0) * 10);
        //
        //                         if(matchRate == 0)
        //                             continue;
        //
        //                         context.suggestion[i].matchPercent = '';
        //                         for(var j=0; j<matchRate; j++)
        //                         {
        //                             context.suggestion[i].matchPercent += '|';
        //                         }
        //
        //                         context.suggestion[i].matchRate = matchRate / 10;
        //
        //                         $scope.diagram.suggestion.push(context.suggestion[i]);
        //                     }
        //
        //                     var msg = new SpeechSynthesisUtterance(context.suggestion[0].output);
        //                     msg.lang = 'en-US';
        //                     msg.pitch = 1;
        //                     msg.onstart = function()
        //                     {
        //                         console.log('봇 말하기 시작');
        //                         pause = true;
        //                         recognition.stop();
        //                     };
        //
        //                     msg.onend = function()
        //                     {
        //                         console.log('봇 말하기 끝');
        //
        //                         pause = false
        //
        //                         recognition.start();
        //
        //                         setTimeout(function()
        //                         {
        //                             $scope.$apply(function()
        //                             {
        //                                 $scope.diagram.suggestion = [];
        //                                 $scope.diagram.nlp = undefined;
        //                                 $scope.diagram.turnTaking = undefined;
        //                                 $scope.diagram.intent = undefined;
        //                                 $scope.diagram.context = undefined;
        //                             });
        //                         }, 10000);
        //                     };
        //
        //                     setTimeout(function()
        //                     {
        //                         window.utterances = msg;
        //                         window.speechSynthesis.speak(msg);
        //                     }, 100);
        //                 }
        //                 else
        //                 {
        //                     console.log('퍼즈 : ', pause);
        //                     recognition.stop();
        //
        //                     setTimeout(function()
        //                     {
        //                         $scope.$apply(function()
        //                         {
        //                             $scope.diagram.nlp = undefined;
        //                             $scope.diagram.turnTaking = undefined;
        //                             $scope.diagram.intent = undefined;
        //                             $scope.diagram.context = undefined;
        //                         });
        //                     }, 10000);
        //                 }
        //             },
        //             function(err)
        //             {
        //                 console.log(err);
        //             });
        //
        //             selected = undefined;
        //         }, 1000);
        //     };
        //
        //     recognition.start();
        //
        //     Socket.on('send_msg', function(data)
        //     {
        //         console.log('데이터 : ', data);
        //     });
        //
        //     emitMsg(':build');
        // })();
    }]);
})();
