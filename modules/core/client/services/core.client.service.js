/**
 * Created by Phebe on 2016. 7. 11..
 */
(function () {
  'use strict';

  angular
    .module('core')
    .factory('CoreUtils', CoreUtils)
    .filter('propsFilter', function() {
      return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
          var keys = Object.keys(props);

          items.forEach(function(item) {
            var itemMatches = false;

            for (var i = 0; i < keys.length; i++) {
              var prop = keys[i];
              var text = props[prop].toLowerCase();
              if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                itemMatches = true;
                break;
              }
            }

            if (itemMatches) {
              out.push(item);
            }
          });
        } else {
          // Let the output be the input untouched
          out = items;
        }

        return out;
      };
    });

  // if(_platform == 'mobile') {
  //   CoreUtils.$inject = ['$ionicPopup'];
  // } else {
  //   CoreUtils.$inject = ['$uibModal'];
  // }
  CoreUtils.$inject = ['$uibModal'];
  function CoreUtils(popup) { // popup == $ionicPopup or uibModal
    return {
      getFullAddress: function(data) {
        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        var fullAddr = ''; // 최종 주소 변수
        var extraAddr = ''; // 조합형 주소 변수

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
          fullAddr = data.roadAddress;

        } else { // 사용자가 지번 주소를 선택했을 경우(J)
          fullAddr = data.addressJibun;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
        if (data.userSelectedType === 'R') {
          //법정동명이 있을 경우 추가한다.
          if (data.bname !== '') {
            extraAddr += data.bname;
          }
          // 건물명이 있을 경우 추가한다.
          if (data.buildingName !== '') {
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
          fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
        }
        return fullAddr;
      },
      changeDateStrToDate: function (model) {
        if(model.created && typeof model.created === 'string') {
          model.created = new Date(model.created);
        }
        if(model.startDate && typeof model.startDate === 'string') {
          model.startDate = new Date(model.startDate);
        }
        if(model.endDate && typeof model.endDate === 'string') {
          model.endDate = new Date(model.endDate);
        }
        if(model.moneyEndDate && typeof model.moneyEndDate === 'string') {
          model.moneyEndDate = new Date(model.moneyEndDate);
        }
        if(model.issueExpectDate && typeof model.issueExpectDate === 'string') {
          model.issueExpectDate = new Date(model.issueExpectDate);
        }
        if(model.cpBirth && typeof model.cpBirth === 'string') {
          model.cpBirth = new Date(model.cpBirth);
        }
        if(model.issueCompleteDate && typeof model.issueCompleteDate === 'string') {
          model.issueCompleteDate = new Date(model.issueCompleteDate);
        }
        if(model.updated && typeof model.updated === 'string') {
          model.updated = new Date(model.updated);
        }
        if(model.resetPasswordExpires && typeof model.resetPasswordExpires === 'string') {
          model.resetPasswordExpires = new Date(model.resetPasswordExpires);
        }
        if(model.confirmEmailExpires && typeof model.confirmEmailExpires === 'string') {
          model.confirmEmailExpires = new Date(model.confirmEmailExpires);
        }
      },
      showConfirmAlert: function (message, callback) {
        popup.open({
          backdrop: 'static',
          templateUrl: 'modules/core/client/views/show-alert.modal.client.view.html',
          controller: 'AlertController',
          resolve: {
            resolve: function () {
              return {
                message: message,
                callback: callback,
                yesText: undefined,
                noText: undefined
              };
            }
          }
        });
      },
      showYesOrNoAlert: function (message, callback, yesText, noText) {
        popup.open({
          backdrop: 'static',
          templateUrl: 'modules/core/client/views/show-alert.modal.client.view.html',
          controller: 'AlertController',
          resolve: {
            resolve: function () {
              return {
                message: message,
                callback: callback,
                yesText: yesText ? yesText : '예',
                noText: noText ? noText : '아니오'
              };
            }
          }
        });
      }
    };
  }
})();
