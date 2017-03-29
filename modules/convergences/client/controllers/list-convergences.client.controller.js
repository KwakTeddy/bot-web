(function () {
  'use strict';
  angular
    .module('convergences')
    .controller('ConvergencesListController', ConvergencesListController);

  ConvergencesListController.$inject = ['ConvergencesService', '$scope', '$timeout', '$interval', '$rootScope'];

  function ConvergencesListController(ConvergencesService, $scope, $timeout, $interval, $rootScope) {
    var vm = this;
    vm.show = 1;
    $rootScope.$on('videoToggle', function (event,args) {
       vm.videoToggle = args;
    });

    vm.noControl = function (cb) {
      var videoSrc = document.getElementById('videoTag')
        videoSrc.removeAttribute('controls');
      $scope.elm1.removeAttribute('controls');
    };
    vm.addControl = function (file) {
        var videoSrc = document.getElementById('videoTag')
        videoSrc.setAttribute('controls', true);
        console.log(videoSrc);

        var fileReader = new FileReader();
        console.log(fileReader);
        var result = fileReader.readAsDataURL(videoSrc);
        console.log(result);
    };


  }
}());
