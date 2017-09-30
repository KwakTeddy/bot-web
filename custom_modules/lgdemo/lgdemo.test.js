/**
 * Created by moneybrain on 2017. 7. 5..
 */

/**
 * Created by moneybrain on 2017. 7. 5..
 */

'use strict';

var assert = require('assert');
var path = require('path');
var mongoose = require(path.resolve('config/lib/mongoose.js'));
var bot_server;
var bot;

describe('Bot', function () {
    var channel = "socket";
    var bot_name = 'lgdemo';
    var user = 'com2best';

    var msgEqual = function (msg, expected, done) {
        bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
            assert.equal(out, expected);
            done();
        });
    };

    var msgMatch = function (msg, expected, done) {
        bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
            console.log('---------------------------------------\n' + out + '\n---------------------------------------\n' +  expected + '\n' + out.search(new RegExp(expected, 'i')));
            assert.notEqual(-1, out.search(new RegExp(expected, 'i')));
            done();
        });
    };

    before(function () {
        var app = require(path.resolve('config/lib/app.js'));
        app.start();

        bot_server = require(path.resolve('./bot-engine/bot.js'));
        bot = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
    });

    describe('start', function () {
        // before(function () {
        //   bot_server.loadBot(bot_name);
        // });

        it('load', function(done) {
            bot_server.loadBot(bot_name, function() {
                done();
            });
        });


        it('1', function (done) {
            msgMatch(':reset user', '안녕하세요. LG전자 고객센터 데모 입니다.', done);
        });
        it('2', function (done) {
            msgMatch('센터 찾아줘', '고객님, 현재 고객님께서 계신 근처의 서비스 센터를 안내해 드릴까요\\?', done);
        });
        it('3', function (done) {
            msgMatch('응', '현재 계신 지역을 말씀해 주세요.\n예시\\)\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60\\-3\n3.도로명주소: 금천구 디지털로9길 68\n4.건물명: 여의도 트윈타워\n5.지하철역: 여의도역|현재 계신 지역을 말씀해주세요.', done);
        });
        it('4', function (done) {
            msgMatch('강남역', '강남구 역삼동 맞나요\\?|이 주소가 맞나요\\?', done);
        });
        it('5', function (done) {
            msgMatch('응', '현재 고객님께서 계신 위치해서 가장 가까운 서비스센터는 강남역 휴대폰서비스센터 0.22km 입니다.\n 인근의 가까운 다른 서비스센터로 도곡서비스센터 1.9km 가 있습니다.\n 어떤 서비스 센터 정보를 안내해드릴까요\\?|어떤 서비스 센터 정보를 안내해드릴까요\\?', done);
        });
        it('6', function (done) {
            msgMatch('강남', '\\[강남역 휴대폰서비스센터\\]\n\\- 주소: 서울 강남구 역삼동 820\\-9 글라스타워 16층 \n\\- 영업시간 : 평일: 09:00 ~ 18:00, 토요일: 09:00 ~ 13:00\n\\- 전화번호: 02\\-6925\\-2304\n\\- 주차가능\n서비스 센터의 위치를 지도에서 확인하시겠습니까\\?|서비스센터 정보는 다음과 같습니다. 위치를 지도에서 확인하시겠습니까\\?', done);
        });
        it('7', function (done) {
            msgMatch('응', '강남역 휴대폰서비스센터의 위치정보입니다\n해당 서비스 센터의 방문 예약을 하시겠습니까\\?', done);
        });
        it('8', function (done) {
            msgMatch('아니', 'Windows  8 가 아닌 타 버전 OS 부팅이 안되는 경우 \\(Linux,  DOS, Windows XP, Windows 7 등\\)         대상 모델 :  Windows8 적용 모델, FreeDOS 모델   증상 :   시스템 format  후 Windows 7\\(혹은 타OS\\)을 설치 하였으나 부팅 장치 리스트만 출력되고 부팅되지  않음. \\(시스템 사용 중\\) USB memory key로  DOS 혹은 Windows 설치를 위해 부팅 시도하였으나 경고 메시지만 출력되고 부팅 되지  않음       내용 및  조치  방안     \\[ 원인 및 History  \\]    Microsoft  requirement로 Windows8에 적용된 Secure Boot\\(UEFI Secure Boot\\)이 Windows8의 하위  OS  \\(Legacy OS \\- Linux, DOS, Windows XP, Windows 7 등\\)를 보안 문제로 부팅하지  못하게 막기 때문에 발생하는 문제   \\[조치 가이드\\]  1\\) 시스템 다시  시작 \\? \\[F2 key\\]를 눌러서 BIOS Setup 메뉴에 진입   2\\) \\[Security\\]  tab으로 이동 \\? \\[Secure Boot Configuration\\] 메뉴로 진입   3\\) \\[UEFI Secure  Boot\\]이 \\[Enabled\\]로 되어있고, \\[Protected Signatures\\]가 \\[Enabled \\(User Mode\\)\\]인지  확인 합니다.   4\\) \\[Change to  Customization\\] 혹은 \\[Change to Customized Signatures\\]를 선택하고 \\[Enter key\\]를  누른 후, 경고 메시지가 나오면 \\[Yes\\]를 선택 합니다.  5\\) \\[F10 key\\]를  눌러서 Save&Exit를 한 후에, 다시 BIOS Setup의 \\[Secure Boot Configuration\\]  메뉴로 진입하여  \\[UEFI Secure Boot\\]이 \\[Disabled\\]로 변경 되고, \\[Protected  Signatures\\]가 \\[Disabled \\(Setup Mode\\)\\]인지 확인 합니다.  6\\) 다시 Booting을  시도 합니다.   ', done);
        });
        it('9', function (done) {
            msgMatch('처음', '안녕하세요. LG전자 고객센터 데모 입니다.', done);
        });
        it('10', function (done) {
            msgMatch('출장 수리', '고객님, 불편을 끼쳐드려 죄송합니다. 현재 고객님께서 무슨 말씀을 하시는지 이해를 못하였습니다.\n 고객센터의 전문 상담원과 연결을 원하십니까\\?', done);
        });
        it('11', function (done) {
            msgMatch('출장 수리 예약', '서비스 센터 방문 예약을 도와드릴까요\\?', done);
        });
        it('12', function (done) {
            msgMatch('응', '서비스를 받고 싶으신 제품을 말씀해주세요.', done);
        });
        it('13', function (done) {
            msgMatch('핸드폰', '고객님 근처의 서비스 센터를 파악한 후에 수리가능여부를 안내해드려도 될까요\\?', done);
        });
        it('14', function (done) {
            msgMatch('응', '현재 계신 지역을 말씀해 주세요.\n예시\\)\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60\\-3\n3.도로명주소: 금천구 디지털로9길 68\n4.건물명: 여의도 트윈타워\n5.지하철역: 여의도역|현재 계신 지역을 말씀해주세요.', done);
        });
        it('15', function (done) {
            msgMatch('강남역', '강남구 역삼동 맞나요\\?|이 주소가 맞나요\\?', done);
        });
        it('16', function (done) {
            msgMatch('응', '현재 고객님께서 계신 위치해서 가장 가까운 서비스센터는 강남역 휴대폰서비스센터 0.22km 입니다.\n 인근의 가까운 다른 서비스센터로 도곡서비스센터 1.9km 가 있습니다.\n 어떤 서비스 센터 정보를 안내해드릴까요\\?|어떤 서비스 센터 정보를 안내해드릴까요\\?', done);
        });
        it('17', function (done) {
            msgMatch('처음', '안녕하세요. LG전자 고객센터 데모 입니다.', done);
        });
        it('18', function (done) {
            msgMatch('수리 예약', '서비스 센터 방문 예약을 도와드릴까요\\?', done);
        });
        it('19', function (done) {
            msgMatch('응', '서비스를 받고 싶으신 제품을 말씀해주세요.', done);
        });
        it('20', function (done) {
            msgMatch('에어컨', '에어컨 상품은 서비스 센터에서 수리를 받으시는 것보다 출장 수리를 예약하여, 기사님을 통하여 서비스를 받으시면 더욱 편리합니다.\n서비스 기사님의 출장수리 예약을 도와드릴까요\\?|서비스 기사님의 출장 수리 예약을 도와드릴까요\\?', done);
        });
        it('21', function (done) {
            msgMatch('응', '출장 수리 예약을 하기 위하여, 간단한 정보 몇가지를 수집하도록 하겠습니다. \n 수리가 필요한 제품의 증상을 입력해 주세요.', done);
        });
        it('22', function (done) {
            msgMatch('에어컨 고장', '출장 방문시 안내를 받으실 분의 성함을 입력해 주세요.', done);
        });
        it('23', function (done) {
            msgMatch('김지섭', '저희 기사님께서 출장 방문시 연락드릴 휴대폰 번호를 입력해주세요.', done);
        });
        it('24', function (done) {
            msgMatch('01092597716', '출장 방문을 하기 위해서는 고객님의 정확한 주소가 필요합니다.\n 지번 또는 도로명을 포함한 상세주소를 입력 부탁드리겠습니다.', done);
        });
        it('25', function (done) {
            msgMatch('관악구 봉천동 898-2 경원하이츠 307호', '출장 수리를 받고 싶으신 날짜를 입력해주세요', done);
        });
        it('26', function (done) {
            msgMatch('7월 10일', '고객님께서 지정하신 날짜에 출장 수리 예약이 가능한 시간 목록입니다. 원하시는 시간을 선택해주세요\n오전\n09:00 09:30 09:50\n10:10 10:30 11:00\n11:20 11:30 11:50\n오후\n12:00 12:30 12:50\n13:00 13:20 13:40\n15:00 15:10 15:50\n 16:10 16:20 16:50\n17:00 17:20 17:40|원하시는 시간을 말씀해주세요.', done);
        });
        it('27', function (done) {
            msgMatch('15:00', '출장수리 예약이 완료되었습니다. \n더 필요하신 게 있으신가요\\?', done);
        });
        it('28', function (done) {
            msgMatch('응', '고객님, 어떤 부분이 궁금하신가요\\?', done);
        });
        it('29', function (done) {
            msgMatch('영업 시간 알려줘', '고객님 근처의 서비스 센터를 파악한 후에 영업시간을 안내해드려도 될까요\\?', done);
        });
        it('30', function (done) {
            msgMatch('응', '현재 계신 지역을 말씀해 주세요.\n예시\\)\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60\\-3\n3.도로명주소: 금천구 디지털로9길 68\n4.건물명: 여의도 트윈타워\n5.지하철역: 여의도역|현재 계신 지역을 말씀해주세요.', done);
        });
        it('31', function (done) {
            msgMatch('강남역', '강남구 역삼동 맞나요\\?|이 주소가 맞나요\\?', done);
        });
        it('32', function (done) {
            msgMatch('응', '현재 고객님께서 계신 위치해서 가장 가까운 서비스센터는 강남역 휴대폰서비스센터 0.22km 입니다.\n 인근의 가까운 다른 서비스센터로 도곡서비스센터 1.9km 가 있습니다.\n 어떤 서비스 센터 정보를 안내해드릴까요\\?|어떤 서비스 센터 정보를 안내해드릴까요\\?', done);
        });
        it('33', function (done) {
            msgMatch('강남', '해당 서비스 센터의 영업시간은\n평일 09:00부터 18:00까지,\n 토요일 09:00부터 13:00까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요', done);
        });
        it('34', function (done) {
            msgMatch('응', '고객님, 불편을 끼쳐드려 죄송합니다. 현재 고객님께서 무슨 말씀을 하시는지 이해를 못하였습니다.\n 고객센터의 전문 상담원과 연결을 원하십니까\\?', done);
        });
        it('35', function (done) {
            msgMatch('처음', '안녕하세요. LG전자 고객센터 데모 입니다.', done);
        });
        it('36', function (done) {
            msgMatch('어떻게 가', '고객님 근처의 서비스 센터를 파악한 후에 방문경로를 안내해드려도 될까요\\?', done);
        });
        it('37', function (done) {
            msgMatch('응', '현재 계신 지역을 말씀해 주세요.\n예시\\)\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60\\-3\n3.도로명주소: 금천구 디지털로9길 68\n4.건물명: 여의도 트윈타워\n5.지하철역: 여의도역|현재 계신 지역을 말씀해주세요.', done);
        });
        it('38', function (done) {
            msgMatch('강남역', '강남구 역삼동 맞나요\\?|이 주소가 맞나요\\?', done);
        });
        it('39', function (done) {
            msgMatch('응', '현재 고객님께서 계신 위치해서 가장 가까운 서비스센터는 강남역 휴대폰서비스센터 0.22km 입니다.\n 인근의 가까운 다른 서비스센터로 도곡서비스센터 1.9km 가 있습니다.\n 어떤 서비스 센터 정보를 안내해드릴까요\\?|어떤 서비스 센터 정보를 안내해드릴까요\\?', done);
        });
        it('40', function (done) {
            msgMatch('강남', '강남역 휴대폰서비스센터의 위치정보입니다\n\\- 주소: 서울 강남구 역삼동 820\\-9 글라스타워 16층 \n\\- 영업시간 : 평일: 09:00 ~ 18:00, 토요일: 09:00 ~ 13:00\n\\- 전화번호: 02\\-6925\\-2304\n\\- 주차가능\n해당 서비스 센터의 방문 예약을 하시겠습니까\\?|위치정보는 다음과 같습니다. 방문예약을 하시겠습니까\\?', done);
        });
        it('41', function (done) {
            msgMatch('아니', 'Windows  8 가 아닌 타 버전 OS 부팅이 안되는 경우 \\(Linux,  DOS, Windows XP, Windows 7 등\\)         대상 모델 :  Windows8 적용 모델, FreeDOS 모델   증상 :   시스템 format  후 Windows 7\\(혹은 타OS\\)을 설치 하였으나 부팅 장치 리스트만 출력되고 부팅되지  않음. \\(시스템 사용 중\\) USB memory key로  DOS 혹은 Windows 설치를 위해 부팅 시도하였으나 경고 메시지만 출력되고 부팅 되지  않음       내용 및  조치  방안     \\[ 원인 및 History  \\]    Microsoft  requirement로 Windows8에 적용된 Secure Boot\\(UEFI Secure Boot\\)이 Windows8의 하위  OS  \\(Legacy OS \\- Linux, DOS, Windows XP, Windows 7 등\\)를 보안 문제로 부팅하지  못하게 막기 때문에 발생하는 문제   \\[조치 가이드\\]  1\\) 시스템 다시  시작 \\? \\[F2 key\\]를 눌러서 BIOS Setup 메뉴에 진입   2\\) \\[Security\\]  tab으로 이동 \\? \\[Secure Boot Configuration\\] 메뉴로 진입   3\\) \\[UEFI Secure  Boot\\]이 \\[Enabled\\]로 되어있고, \\[Protected Signatures\\]가 \\[Enabled \\(User Mode\\)\\]인지  확인 합니다.   4\\) \\[Change to  Customization\\] 혹은 \\[Change to Customized Signatures\\]를 선택하고 \\[Enter key\\]를  누른 후, 경고 메시지가 나오면 \\[Yes\\]를 선택 합니다.  5\\) \\[F10 key\\]를  눌러서 Save&Exit를 한 후에, 다시 BIOS Setup의 \\[Secure Boot Configuration\\]  메뉴로 진입하여  \\[UEFI Secure Boot\\]이 \\[Disabled\\]로 변경 되고, \\[Protected  Signatures\\]가 \\[Disabled \\(Setup Mode\\)\\]인지 확인 합니다.  6\\) 다시 Booting을  시도 합니다.   ', done);
        });
        it('42', function (done) {
            msgMatch('처음', '안녕하세요. LG전자 고객센터 데모 입니다.', done);
        });
        it('43', function (done) {
            msgMatch('방문 수리 예약', '서비스 센터 방문 예약을 도와드릴까요\\?', done);
        });
        it('44', function (done) {
            msgMatch('출장 수리 예약', '서비스 센터 방문 예약을 도와드릴까요\\?', done);
        });
        it('45', function (done) {
            msgMatch('처음', '안녕하세요. LG전자 고객센터 데모 입니다.', done);
        });
        it('46', function (done) {
            msgMatch('수리 가능 품목', '고객님 근처의 서비스 센터를 파악한 후에 수리가능품목을 안내해드려도 될까요\\?', done);
        });
        it('47', function (done) {
            msgMatch('응', '현재 계신 지역을 말씀해 주세요.\n예시\\)\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60\\-3\n3.도로명주소: 금천구 디지털로9길 68\n4.건물명: 여의도 트윈타워\n5.지하철역: 여의도역|현재 계신 지역을 말씀해주세요.', done);
        });
        it('48', function (done) {
            msgMatch('강남역', '강남구 역삼동 맞나요\\?|이 주소가 맞나요\\?', done);
        });
        it('49', function (done) {
            msgMatch('응', '현재 고객님께서 계신 위치해서 가장 가까운 서비스센터는 강남역 휴대폰서비스센터 0.22km 입니다.\n 인근의 가까운 다른 서비스센터로 도곡서비스센터 1.9km 가 있습니다.\n 어떤 서비스 센터 정보를 안내해드릴까요\\?|어떤 서비스 센터 정보를 안내해드릴까요\\?', done);
        });
        it('50', function (done) {
            msgMatch('강남', '문의 주신 서비스센터의 수리 가능 품목은 휴대폰, PC, 스마트워치, Friends, 패드, 헤드셋, 컴퓨터주변기기 입니다.\n 해당 서비스 센터 정보를 알려드릴까요\\?', done);
        });
        it('51', function (done) {
            msgMatch('응', '고객님, 불편을 끼쳐드려 죄송합니다. 현재 고객님께서 무슨 말씀을 하시는지 이해를 못하였습니다.\n 고객센터의 전문 상담원과 연결을 원하십니까\\?', done);
        });

















        /*
         add a test case here
         it('bot should return "expected" for "msg", function(done) {
         bot_test(bot_name, 'msg', "expected", done);
         });
         */
    });
});
