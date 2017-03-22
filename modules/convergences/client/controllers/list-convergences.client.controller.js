(function () {
  'use strict';
  angular
    .module('convergences')
    .controller('ConvergencesListController', ConvergencesListController);

  ConvergencesListController.$inject = ['ConvergencesService', '$scope', '$timeout', '$interval'];

  function ConvergencesListController(ConvergencesService, $scope, $timeout, $interval) {
    var vm = this;


    vm.videoToggle = true;
    vm.videoPlay = false;

    function execActions(actions) {
      for(var i = 0; i < actions.length; i++) {
        var item = actions[i];
        if(item.action == 'play-video-full') {

          if(!vm.videoPlay) {
            document.getElementById('videoSection').style.visibility = 'visible';
            vm.videoPlay = true;
          } else {
            vm.videoToggle = !vm.videoToggle;

          }

          setTimeout(function() {
            var playerName;
            if(!vm.videoToggle) playerName = 'videoPlayer2';
            else playerName = 'videoPlayer1';


            var source = document.createElement('source');
            source.setAttribute('src', item.url);
            source.setAttribute('type', 'video/mp4');

            var video = document.getElementById(playerName);
            if(video.childNodes && video.childNodes.length > 0) {
              video.replaceChild(source, video.childNodes[0]);
            } else video.appendChild(source);
          }, 100);

        }
      }
    }




    vm.show = 1;

    vm.noControl = function (cb) {
      var videoSrc = document.getElementById('videoTag')
        videoSrc.removeAttribute('controls');
      $scope.elm1.removeAttribute('controls');
    };
    vm.addControl = function (cb) {
        var videoSrc = document.getElementById('videoTag')
        videoSrc.setAttribute('controls', true);
    };

    vm.changeVideo = function (which) {
       var height = screen.height;
       // var height = document.getElementById('html').clientHeight;
       // var width = document.getElementById('developer-body').clientWidth;
       var width = screen.width;
       if (vm.show == 1){
           var videoTarget = document.getElementById('videoSrc1');
           var target = document.getElementById('videoTag');
           var target1 = document.getElementById('videoTag1');
           // videoTarget.src = which;
           // target.pause();
           // target1.play();

           // target.style.height = height+'px';
           // target.style.width = width+'px';
           vm.show = vm.show*-1;
       } else if (vm.show == -1){
           var videoTarget = document.getElementById('videoSrc');
           var target = document.getElementById('videoTag');
           var target1 = document.getElementById('videoTag1');
           // videoTarget.src = which;
           // target.play();
           // target1.pause();
           vm.show = vm.show*-1;
       }

    };
    // $timeout(function () {
    //     vm.changeVideo();
    // }, 3000, true)
  }
}());
