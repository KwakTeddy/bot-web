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
            $scope.diagram.emotion = undefined;
            $scope.diagram.profile = undefined;
            $scope.diagram.speech = {};

            // $scope.diagram = $scope.diagram || {};
            // $scope.diagram.nlp = [{ text: 'ajskdfjaosifjoawjefowjiofejwofjioewjfoweajfoiweajfowajfoewjf', pos: ''}];
            // $scope.diagram.suggestion = [];
            // $scope.diagram.intent = { name: '이름이 뭐니?', matchRate: 0.7 };
            // $scope.diagram.context = '이름';
            // $scope.diagram.turnTaking = 0.7;

            console.log('초기화 : ', $scope.diagram);

            angular.element('#suggestionDiagram').css('height', '70px');
        };

        $scope.initDiagram();

        (function()
        {
            var video = angular.element('video').get(0);

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

            var analyticsTimer = undefined;
            var deeplearningTimer = undefined;

            /**
             * Returns a random integer between min (inclusive) and max (inclusive)
             * Using Math.round() will give you a non-uniform distribution!
             */
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // Socket.on('response-dl', function(data)
            // {
            //     clearTimeout(deeplearningTimer);
            //
            //     if(data && data.error == -1)
            //     {
            //         var probability = data.probability;
            //
            //         for(var i=0; i<probability.length; i++)
            //         {
            //             probability[i] = { name : emotionLabel[i], value: parseInt(probability[i]*100) / 100 };
            //         }
            //
            //         probability.sort(function(a, b)
            //         {
            //             return b.value - a.value;
            //         });
            //
            //         probability.splice(5, 7);
            //
            //         $scope.diagram.emotion = probability;
            //     }
            //
            //     // deeplearningTimer = setTimeout(function()
            //     // {
            //     //     $scope.diagram.emotion = [];
            //     // }, 1000 * 10);
            // });

            Socket.on('response-analytics', function(data)
            {
                console.log('데이터 : ', data);
                clearTimeout(analyticsTimer);

                $scope.diagram.profile = {};
                $scope.diagram.turnTaking = 0;

                var context = data;
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

                if(context.entities && Object.keys(context.entities).length > 0)
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

                // if(context.turnTaking)
                // {
                //     $scope.diagram.turnTaking = context.turnTaking;
                // }
                // else
                // {
                //     $scope.diagram.turnTaking = undefined;
                // }

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
                    // $scope.diagram.suggestion = [];
                    var temp = [];
                    for(var i=0; i<context.nlu.matchInfo.qa.length && i < 5; i++)
                    {
                        var matchRate = parseInt((context.nlu.matchInfo.qa[i].matchRate || 0) * 10);

                        // if(matchRate == 0)
                        //     continue;

                        context.nlu.matchInfo.qa[i].matchRate = matchRate / 10;

                        temp.push(context.nlu.matchInfo.qa[i]);
                    }

                    if(temp.length == 0)
                    {
                        // recognizeStart();
                        $scope.diagram.turnTaking = getRandomInt(1, 8) / 10;
                    }
                    else
                    {
                        temp.sort(function(a, b)
                        {
                            return b.matchRate - a.matchRate;
                        });

                        if(temp[0].matchRate < 1)
                            temp[0].matchRate += 0.05;
                        $scope.diagram.turnTaking = 1;
                        $scope.diagram.suggestion = temp;

                        setTimeout(function()
                        {
                            var height = angular.element('#suggestionDiagram table').css('height');
                            angular.element('#suggestionDiagram').css('height', height.replace('px', '')*1 + 40 + 'px');
                        }, 100);
                    }

                    console.log('turnTaking: ', $scope.diagram.turnTaking);
                }
                else
                {
                    // recognizeStart();
                    $scope.diagram.turnTaking = 0;
                }

                $scope.diagram.profile.age = getRandomInt(25, 35);
                $scope.diagram.profile.language = [];

                data.language.sort(function(a, b)
                {
                    return b[1] - a[1];
                });

                for(var i=0; i<data.language.length && i<1; i++)
                {
                    $scope.diagram.profile.language.push({ name: data.language[i][0], rate: Math.round(data.language[i][1] * 100) / 100 });
                }

                console.log('실행');
                analyticsTimer = setTimeout(function()
                {
                    $scope.diagram.nlp = undefined;
                    $scope.diagram.context = undefined;
                    $scope.diagram.intent = undefined;
                    $scope.diagram.entity = undefined;
                    $scope.diagram.turnTaking = undefined;
                    $scope.diagram.emotion = undefined;

                    $scope.diagram.profile = undefined;

                    if($scope.diagram.suggestion[0])
                    {
                        var msg = new SpeechSynthesisUtterance();
                        var voices = window.speechSynthesis.getVoices();
                        msg.voice = voices[0];
                        msg.rate = 1;
                        msg.pitch = 1;
                        msg.text = $scope.diagram.suggestion[0].output;

                        console.log('우와 : ', $scope.diagram.suggestion[0]);

                        msg.onend = function(e) {
                            console.log('Finished in ' + event.elapsedTime + ' seconds.');

                            $scope.diagram.suggestion = [];
                        };

                        speechSynthesis.speak(msg);
                    }

                    console.log($scope.diagram.suggestion);

                }, 1000);
            });

            var sendSocket = function(text)
            {
                Socket.emit('deeplearning', { bot: 'demo', user: 'demo-user', msg: text, options: { language: 'ko' } });
                Socket.emit('analytics', { bot: 'demo', user: 'demo-user', msg: text, options: { language: 'ko' } });
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

                        recognizeStart();

                        // if(recognizing) recognizeStart();
                        recognizing = false;
                        if (ignore_onend) return;

                        if (!final_transcript) {
                            // console.log('info_start');
                            return;
                        }
                    };

                    var timeForSpeed = undefined;
                    var timerForSpeed = undefined;
                    var count = 0;

                    recognition.onresult = function(event) {
                        console.log('recognition.onresult');

                        if(!timeForSpeed)
                            timeForSpeed = new Date().getTime();

                        // clearTimeout(remainTimer);

                        if (ignore_onend) return;
                        // ignore_onend = false;

                        var isFinal = false;
                        var interim_transcript = '';
                        for (var i = event.resultIndex; i < event.results.length; ++i) {

                            if (event.results[i].isFinal) {
                                isFinal = true;
                            }

                            interim_transcript += event.results[i][0].transcript;
                        }

                        final_transcript = interim_transcript;

                        clearTimeout(timerForSpeed);
                        timerForSpeed = setTimeout(function()
                        {
                            timeForSpeed = undefined;
                            console.log('시간 초기화');
                            recognizeStop();
                        }, 1000 * 2);

                        var now = new Date().getTime();

                        var sec = (now - timeForSpeed) / 1000;

                        console.log('초초 : ', sec);

                        if(sec > 0)
                        {
                            $scope.diagram.speech.speed = Math.round(final_transcript.length / sec);
                        }

                        if (final_transcript || interim_transcript)
                        {
                            // console.log('transcript: ' + interim_transcript);
                        }

                        if(isFinal)
                        {
                            // console.log('isFinal:' + 'final('+finalFinish + '),timeout(' + timeoutFinish + ')');
                            if(timeoutFinish) {
                                finalFinish = false; timeoutFinish = false;
                                return;
                            }
                            finalFinish = true;
                            // console.log('isFinal:' + interim_transcript);
                            recognizeStop();

                            //send
                            sendSocket(interim_transcript);
                        }
                        else
                        {
                            // if(count % 2 == 0)
                            // {
                            //     sendSocket(interim_transcript);
                            //     count = 0;
                            // }
                            //
                            // count++;
                        }
                        // else
                        // {
                        //     if(regcognitionTimer)
                        //     {
                        //         clearTimeout(regcognitionTimer);
                        //     }
                        //
                        //     regcognitionTimer = setTimeout(function()
                        //     {
                        //         // console.log('timeout:' + 'final('+finalFinish + '),timeout(' + timeoutFinish + ')');
                        //         if(finalFinish)
                        //         {
                        //             // console.log('여기');
                        //             finalFinish = false; timeoutFinish = false;
                        //             return;
                        //         }
                        //         else if(timeoutFinish)
                        //         {
                        //             // console.log('여기');
                        //             return;
                        //         }
                        //
                        //         timeoutFinish = true;
                        //         // console.log('timeout: ' + interim_transcript);
                        //         if(interim_transcript != undefined && interim_transcript != '')
                        //         {
                        //             ignore_onend = true;
                        //             // recognizeStop();
                        //
                        //             //send
                        //             sendSocket(interim_transcript);
                        //         }
                        //     }, 3000);
                        // }
                    };
                }
            };

            makeRecognition();

            function recognizeStop() {
                // console.log('recognizeStop');

                recognizing = false;
                if (recognition != undefined) recognition.stop();
            }

            function recognizeStart() {

                recognition.lang = 'ko-KR';
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


        (function()
        {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;

            var audioContext = new AudioContext();
            var isPlaying = false;
            var sourceNode = null;
            var analyser = null;
            var theBuffer = null;
            var DEBUGCANVAS = null;
            var mediaStreamSource = null;
            var detectorElem,
                canvasElem,
                waveCanvas,
                pitchElem,
                noteElem,
                detuneElem,
                detuneAmount;

            var rafID = null;
            var tracks = null;
            var buflen = 1024;
            var buf = new Float32Array( buflen );

            var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.
            var GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

            var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

            function autoCorrelate( buf, sampleRate ) {
                var SIZE = buf.length;
                var MAX_SAMPLES = Math.floor(SIZE/2);
                var best_offset = -1;
                var best_correlation = 0;
                var rms = 0;
                var foundGoodCorrelation = false;
                var correlations = new Array(MAX_SAMPLES);

                for (var i=0;i<SIZE;i++) {
                    var val = buf[i];
                    rms += val*val;
                }
                rms = Math.sqrt(rms/SIZE);
                if (rms<0.01) // not enough signal
                    return -1;

                var lastCorrelation=1;
                for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
                    var correlation = 0;

                    for (var i=0; i<MAX_SAMPLES; i++) {
                        correlation += Math.abs((buf[i])-(buf[i+offset]));
                    }
                    correlation = 1 - (correlation/MAX_SAMPLES);
                    correlations[offset] = correlation; // store it, for the tweaking we need to do below.
                    if ((correlation>GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
                        foundGoodCorrelation = true;
                        if (correlation > best_correlation) {
                            best_correlation = correlation;
                            best_offset = offset;
                        }
                    } else if (foundGoodCorrelation) {
                        // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
                        // Now we need to tweak the offset - by interpolating between the values to the left and right of the
                        // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
                        // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
                        // (anti-aliased) offset.

                        // we know best_offset >=1,
                        // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
                        // we can't drop into this clause until the following pass (else if).
                        var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];
                        return sampleRate/(best_offset+(8*shift));
                    }
                    lastCorrelation = correlation;
                }
                if (best_correlation > 0.01) {
                    // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
                    return sampleRate/best_offset;
                }
                return -1;
//	var best_frequency = sampleRate/best_offset;
            }

            function noteFromPitch( frequency ) {
                var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
                return Math.round( noteNum ) + 69;
            }

            function frequencyFromNoteNumber( note ) {
                return 440 * Math.pow(2,(note-69)/12);
            }

            function centsOffFromPitch( frequency, note ) {
                return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
            }

            function getAverageVolume(array) {
                var values = 0;
                var average;

                var length = array.length;

                // get all the frequency amplitudes
                for (var i = 0; i < length; i++) {
                    values += array[i];
                }

                average = values / length;
                return average;
            }

            function updatePitch()
            {
                analyser.getFloatTimeDomainData( buf );
                var ac = autoCorrelate( buf, audioContext.sampleRate );
                // TODO: Paint confidence meter on canvasElem here.

                if (ac == -1) {
                } else {
                    var pitch = ac;
                    // pitchElem.innerText = Math.round( pitch ) ;
                    var note =  noteFromPitch( pitch );
                    // noteElem.innerHTML = noteStrings[note%12];
                    var detune = centsOffFromPitch( pitch, note );

                    $scope.$apply(function()
                    {
                        $scope.diagram.speech.pitch = Math.round( pitch );
                        $scope.diagram.speech.note = noteStrings[note%12];
                        if (detune == 0 ) {
                            $scope.diagram.speech.detune = undefined;
                        } else {
                            // detuneAmount.innerHTML = Math.abs( detune );

                            $scope.diagram.speech.detune = { type: detune < 0 ? 'flat' : 'sharp', value: Math.abs(detune) };
                        }
                    });
                }

                var array =  new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                var average = getAverageVolume(array);

                $scope.diagram.speech.volume = Math.round(average);

                if (!window.requestAnimationFrame)
                    window.requestAnimationFrame = window.webkitRequestAnimationFrame;
                rafID = window.requestAnimationFrame( updatePitch );
            }

            function gotStream(stream) {
                // Create an AudioNode from the stream.
                mediaStreamSource = audioContext.createMediaStreamSource(stream);

                // Connect it to the destination.
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 2048;
                mediaStreamSource.connect( analyser );

                updatePitch();
            }

            function initAudio() {
                if (!navigator.getUserMedia)
                    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                if (!navigator.cancelAnimationFrame)
                    navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
                if (!navigator.requestAnimationFrame)
                    navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

                navigator.getUserMedia(
                    {
                        "audio": {
                            "mandatory": {
                                "googEchoCancellation": "false",
                                "googAutoGainControl": "false",
                                "googNoiseSuppression": "false",
                                "googHighpassFilter": "false"
                            },
                            "optional": []
                        }
                    }, gotStream, function(e) {
                        alert('Error getting audio');
                        console.log(e);
                    });
            }

            function initVideo() {
                if (!navigator.getUserMedia)
                    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                if (!navigator.cancelAnimationFrame)
                    navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
                if (!navigator.requestAnimationFrame)
                    navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

                navigator.getUserMedia(
                    {
                        video: true
                    }, function(stream){
                        if(navigator.mozGetUserMedia)
                            video.mozSrcObject = stream;
                        else
                        {
                            var vu = window.URL || window.webkitURL;
                            video.src = vu.createObjectURL(stream);
                        }
                        video.play();
                    }, function(e) {
                        alert('Error getting video');
                        console.log(e);
                    });
            }

            initAudio();
            initVideo();
        })();
    }]);
})();
