angular.module('playchat').controller('CreateBotPopupController', ['$window', '$scope', '$resource', '$cookies', '$location', '$timeout','LanguageService', 'FileUploader', function ($window, $scope, $resource, $cookies, $location, $timeout, LanguageService, FileUploader)
{
    var ChatbotService = $resource('/api/chatbots');
    var user = $cookies.getObject('user');

    $scope.defaultBotProfile = {
        companyName : 'Moneybrain',
        companyCall : '070-7775-3011',
        rejectCall : '...what?',
        description : 'Hello. This is Moneybrain.,inc\nWelcome to visit our BizchatService Page.'
    };

    $scope.customBotProfile = {};
    $scope.botProfile = {};

    $scope.useBasicProfile = true;

    var _globalImg = "/modules/playchat/working-ground/create-bot/client/imgs/sampleBotImg.jpg";
    var _imageSet = () => {
        var background = null;
        if($scope.botProfile.imageFile && $scope.botProfile.imageFile != ''){
            background = ['url("',$scope.botProfile.imageFile,'") no-repeat 50% center/100%'].join("");
        }else{
            background = ['url("',_globalImg,'") no-repeat 50% center/100%'].join("");
        }

        angular.element('.pic-area').css('background',background);
    };

    $scope.offPopup = () => {
        angular.element('#createBotPopup').fadeOut();
    };

    $scope.turnProfile = (is) => {
        if(is){
            $scope.useBasicProfile = true;
            $scope.botProfile = $scope.defaultBotProfile;
        }else{
            $scope.useBasicProfile = false;
            $scope.botProfile = $scope.customBotProfile;
            $timeout(()=>{
                _imageSet();

                angular.element('.pic-area').hover((e)=>{
                    angular.element('.pic-area-trigger').fadeIn(500)
                },(e)=>{
                    angular.element('.pic-area-trigger').fadeOut(500)
                });
            });
        }
        document.getElementsByName('choice')[0].checked = is
    };

    $scope.uploader = () => {
        var uploader = new FileUploader({
            url: '/api/chatbots/uploadImage',
            alias: 'uploadFile',
            autoUpload: true
        });

        uploader.onSuccessItem = function(item, response, status, headers)
        {
            // bind with card scope
            $scope.customBotProfile.imageFile = response.url;
            _imageSet();
        };

        uploader.onErrorItem = function(item, response, status, headers)
        {
            alert(response.message);
        };

        uploader.onProgressItem = function(fileItem, progress)
        {
            console.log(progress);
        };


        return uploader;
    };

    $scope.addImage = () => {
        var imageFile = angular.element('.pic-area').find('input[type="file"]');
        $timeout(function()
        {
            imageFile.click();
        });
    };

    $scope.save = function(profile)
    {
        console.log(profile);
        if(!profile.name ||
            !profile.companyName ||
            !profile.companyCall ||
            !profile.rejectCall){
            return alert('필수정보가 누락되었습니다\n내용을 채워주세요.')
        }
        profile.type = 'survey';
        profile.id = profile.type + '_' + user.username.replace(/\s/gi, '') + '_' + new Date().getTime();
        profile.language = 'ko';

        //profile.sampleCategory = '';


        ChatbotService.save(profile, function(chatbot)
            {
                delete chatbot.user;
                chatbot.myBotAuth = { read: true, edit: true };

                if(JSON.stringify(chatbot).length > 4096)
                {
                    alert(LanguageService('Image address string length is big. please down sizing image adress string length.'));
                }
                else
                {
                    $cookies.putObject('chatbot', chatbot);
                    $location.url('/playchat/development/my-bot');
                }
            },
            function(err)
            {
                if(err.data.message == 'Duplicated Bot')
                {
                    alert(LanguageService('Name is already using'));
                }
                else if(err.data.message == 'Duplicated Bot Id')
                {
                    alert(LanguageService('BotId is already using'));
                }
                else
                {
                    alert(err.data.error || err.data.message);
                }
            });
    };

    (()=>{
        $scope.turnProfile($scope.useBasicProfile);
    })();

    $scope.lan=LanguageService;
}]);
