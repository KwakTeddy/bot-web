var path = require('path');
var http = require(path.resolve('./engine2/utils/http.js'));

module.exports = function(globals)
{
    globals.setTypeChecks('addressGovTypeCheck', function(text, type, task, context, callback)
    {
        var userTokens = text.split(' ');
        var tmpTokens = utils.clone(userTokens);
        var addrPart, addrDetail;
        for(var i = tmpTokens.length - 1; i >= 0; i--) {
            if(tmpTokens[i].endsWith('길') || tmpTokens[i].endsWith('로')) {
                addrPart = tmpTokens.splice(0, i+2).join(' ');
                addrDetail = tmpTokens.join(' ');
                break;
            } else if(tmpTokens[i].search(/^[^\d].*동$/g) != -1 || userTokens[i].endsWith('리')) {
                addrPart = tmpTokens.splice(0, i+2).join(' ');
                addrDetail = tmpTokens.join(' ');
                break;
            }
        }

        task.addressOrg = {};
        task.addressOrg.address = text;
        task.addressOrg.addrTokens = userTokens;
        task.addressOrg.addrPart = addrPart;
        task.addressOrg.addrDetail = addrDetail;
        task.addressOrg.detailToken = tmpTokens;

        if(!addrPart) {
            type.message = context.global.messages.typeAddress;
            return;
        }

        var httpTask = {
            action: 'xml',
            url: 'http://www.juso.go.kr',
            path: '/addrlink/addrLinkApi.do',
            param: {confmKey: ADDRESS_KEY, currentPage: 1, countPerPage: 30, keyword: addrPart}
        };

        http.execute(httpTask, context, function(_task, context) {
            if(_task.doc.results.common.totalCount == 0) {
                type.message = context.global.messages.typeAddressCheck1;
            } else {
                var addr;
                if(_task.doc.results.juso instanceof Array) {
                    addr = _task.doc.results.juso[0];
                } else {
                    addr = _task.doc.results.juso;
                }

                task.address = {};
                task.addressJibun = {};

                task.address.address = addr.roadAddr;
                task.address.roadAddrPart1 = addr.roadAddrPart1;
                task.address.roadAddrPart2 = addr.roadAddrPart2;
                task.address.zipNo = addr.zipNo;

                task.addressJibun.address = addr.jibunAddr;
                task.addressJibun.zipNo = addr.zipNo;

                var jusoToken = addr.jibunAddr.split(' ');
                var roadToken = addr.roadAddrPart1.split(' ');
                if(jusoToken[0].endsWith('시')) {
                    task.addressJibun.sido = jusoToken[0];
                    task.addressJibun.sigungu = jusoToken[1];
                    task.addressJibun.dong = jusoToken[2];
                    task.addressJibun.bungi = jusoToken[4];
                    task.addressJibun.building = jusoToken[5];

                    task.address.sido = roadToken[0];
                    task.address.sigungu = roadToken[1];
                    task.address.road = roadToken[2];
                    task.address.roadNum = roadToken[3];
                } else {
                    if (jusoToken[1].endsWith('시')) {
                        task.addressJibun.sido = jusoToken[0];
                        // 현재 도로명주소 API 비정상으로 나오고 있음
                        // task.addressJibun.sigungu = jusoToken[1] + ' ' + jusoToken[2];
                        // task.addressJibun.dong = jusoToken[3];
                        task.addressJibun.sigungu = jusoToken[1];
                        task.addressJibun.dong = jusoToken[2];
                        task.addressJibun.bungi = jusoToken[4];
                        task.addressJibun.building = jusoToken[5];

                        task.address.sido = roadToken[0];
                        task.address.sigungu = roadToken[1];
                        task.address.road = roadToken[2];
                        task.address.roadNum = roadToken[3];

                    } else if (jusoToken[1].endsWith('군')) {
                        task.addressJibun.sido = jusoToken[0];
                        task.addressJibun.sigungu = jusoToken[1];
                        task.addressJibun.dong = jusoToken[2];
                        task.addressJibun.bungi = jusoToken[4];
                        task.addressJibun.building = jusoToken[5];

                        task.address.sido = roadToken[0];
                        task.address.sigungu = roadToken[1];
                        task.address.road = roadToken[2];
                        task.address.roadNum = roadToken[3];
                    }
                }

                for(var i = 0; i < tmpTokens.length; i++) {
                    if(task.addressJibun.address.indexOf(tmpTokens[i]) == -1) {
                        task.addressJibun.detail = tmpTokens.slice(i).join(' ');
                        task.addressJibun.address += ' ' + task.addressJibun.detail;
                        break;
                    }
                }

                // 주소 API 에서 동이 안나오는 오류 임시 처리

                var sigu = task.addressJibun.sigungu.split(' ');
                if(sigu.length == 1 && sigu[0].endsWith('시')) {
                    for(var i = 0; i < userTokens.length; i++) {
                        if(userTokens[i].search(/^[^\d].*구$/g) != -1) {
                            task.addressJibun.sigungu += ' ' + userTokens[i];
                            break;
                        }
                    }
                }

                task.address.detail = task.addressJibun.detail;
                task.address.address = addr.roadAddrPart1 + ', ' + task.address.detail + addr.roadAddrPart2;

                console.log(JSON.stringify(task.address));
                console.log(JSON.stringify(task.addressJibun));

                callback(text, task, true);
            }
        });
    });
};
