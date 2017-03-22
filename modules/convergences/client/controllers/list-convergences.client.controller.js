(function () {
  'use strict';
  angular
    .module('convergences')
    .controller('ConvergencesListController', ConvergencesListController);

  ConvergencesListController.$inject = ['ConvergencesService', '$scope', '$timeout', '$interval'];

  function ConvergencesListController(ConvergencesService, $scope, $timeout, $interval) {
    var vm = this;
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
