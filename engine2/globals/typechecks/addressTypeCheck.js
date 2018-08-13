var utils = require('../../utils/utils.js');

var mongoose = require('mongoose');

var 건물정보스키마 = {
    법정동코드: String,
    시도명: String,
    시군구명: String,
    법정읍면동명: String,
    법정리명: String,
    산여부: String,
    지번본번: String,
    지번부번: String,
    도로명코드: String,
    도로명: String,
    지하여부: String,
    건물본번: String,
    건물부번: String,
    건축물대장건물명: String,
    상세건물명: String,
    건물관리번호: String,
    읍면동일련번호: String,
    행정동코드: String,
    행정동명: String,
    우편번호: String,
    우편일련번호: String,
    다량배달처명: String,
    이동사유코드: String,
    고시일자: String,
    변경전도로명주소: String,
    시군구용건물명: String,
    공동주택여부: String,
    기초구역번호: String,
    상세주소부여여부: String,
    비고1: String,
    비고2: String
};

var buildingdataModel = mongoose.model('buildingdata', 건물정보스키마);

function searchAddress(task, context, callback)
{
    var model = buildingdataModel;

    var query = {};
    var 시도명, 시군구명, 읍면동명, 행정동명, 도로명, 리명, 본번, 부번, 상세주소, 도로명상세주소, 건물명;

    var 지번Re = /(?:(경기도|경기|강원도|강원|충청북도|충북|충청남도|충남|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주|서울특별시|서울시|서울|인천광역시|인천시|인천|대전광역시|대전시|대전|대구광역시|대구시|대구|광주광역시|광주시|광주|부산광역시|부산시|부산|울산광역시|울산시|울산|세>종특별자치시|세종특별시|세종시|세종)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?(?:(?:([가-힣]+읍|[가-힣]+면|[가-힣]+동[\s가-힣]+[\s0-9]+가|[가-힣]+동|[가-힣]+[\s0-9]+가)|([가-힣]+\d+읍|[가-힣]+\d+면|[가-힣]+\d+동))|(?:(?:[가-힣]+읍\s+|[가-힣]+면\s+)?([가-힣]+[\s0-9]*번?로[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?로)))\s*([가-힣]+\d*리)?\s*(\d+)?(?:\s*-\s*(\d+))?(?:(?:\s*,?\s*|\s+)([^\\(]*))?(?:\s*\(([^,\s]+)(?:\s*,?\s*([^\\)]*))?\))?/i;
    var matched = task.inRaw.match(지번Re);
    console.log('matched: ' + matched);
    if(matched != null) {
        if (matched[1] != null) {
            if (matched[1] == '경기') 시도명 = '경기도';
            else if (matched[1] == '강원') 시도명 = '강원도';
            else if (matched[1] == '충북') 시도명 = '충청북도';
            else if (matched[1] == '충남') 시도명 = '충청남도';
            else if (matched[1] == '전북') 시도명 = '전라북도';
            else if (matched[1] == '전남') 시도명 = '전라남도';
            else if (matched[1] == '경북') 시도명 = '경상북도';
            else if (matched[1] == '경남') 시도명 = '경상남도';
            else if (matched[1] == '제주') 시도명 = '제주특별자치도';
            else if (matched[1] == '제주도') 시도명 = '제주특별자치도';
            else if (matched[1] == '서울') 시도명 = '서울특별시';
            else if (matched[1] == '서울시') 시도명 = '서울특별시';
            else if (matched[1] == '인천') 시도명 = '인천광역시';
            else if (matched[1] == '인천시') 시도명 = '인천광역시';
            else if (matched[1] == '대전') 시도명 = '대전광역시';
            else if (matched[1] == '대전시') 시도명 = '대전광역시';
            else if (matched[1] == '대구') 시도명 = '대구광역시';
            else if (matched[1] == '대구시') 시도명 = '대구광역시';
            else if (matched[1] == '광주') 시도명 = '광주광역시';
            else if (matched[1] == '광주시') 시도명 = '광주광역시';
            else if (matched[1] == '부산') 시도명 = '부산광역시';
            else if (matched[1] == '부산시') 시도명 = '부산광역시';
            else if (matched[1] == '울산') 시도명 = '울산광역시';
            else if (matched[1] == '울산시') 시도명 = '울산광역시';
            else if (matched[1] == '세종') 시도명 = '세종특별자치시';
            else if (matched[1] == '세종시') 시도명 = '세종특별자치시';
            else 시도명 = matched[1];
        } else {
            시도명 = matched[1];
        }

        시군구명 = matched[2];
        읍면동명 = matched[3];
        행정동명 = matched[4];
        도로명 = matched[5];
        리명 = matched[6];
        본번 = matched[7];
        부번 = matched[8];
        상세주소 = matched[9] ? matched[9].trim() : matched[9];

        if(도로명) {
            도로명 = 도로명.replace(/\s/, '');
            query.도로명 = 도로명;
            if(본번) query.건물본번 = 본번;
            if(부번) query.건물부번 = 부번;
            else if(본번) query.건물부번 = '0';
        } else if(읍면동명) {
            query.법정읍면동명 = 읍면동명.replace(/\s/, '');
            if(리명) query.법정리명 = 리명;
            // else query.법정리명 = '';
            if(본번) query.지번본번 = 본번;
            if(부번) query.지번부번 = 부번;
            else if(본번) query.지번부번 = '0';
        } else if(행정동명) {
            행정동명 = 행정동명.replace(/\s/, '');
            query.행정동명 = 행정동명;
            if(본번) query.지번본번 = 본번;
            if(부번) query.지번부번 = 부번;
            else if(본번) query.지번부번 = '0';
        }
        if(시도명) query.시도명 = 시도명;
        if(시군구명) query.시군구명 = new RegExp(시군구명, 'i');

    }

    task.doc = null;

    // query.시군구명 = "용산구";

    if(Object.keys(query).length == 0) {
        callback(task, context);
    } else {
        model.aggregate([
            {$match: query},
            {$group: {
                _id: '$도로명코드',
                시도명: {$first: '$시도명'},
                시군구명: {$first: '$시군구명'},
                법정읍면동명: {$first: '$법정읍면동명'},
                법정리명: {$first: '$법정리명'},
                행정동명: {$first: '$행정동명'},
                지번본번: {$first: '$지번본번'},
                지번부번: {$first: '$지번부번'},
                도로명: {$first: '$도로명'},
                건물본번: {$first: '$건물본번'},
                건물부번: {$first: '$건물부번'},
                시군구용건물명: {$first: '$시군구용건물명'},
                도로명코드: {$first: '$도로명코드'},
                읍면동일련번호: {$first: '$읍면동일련번호'}
            }},
            {$limit: 10}
        ], function(err, docs) {
            if(err) {
                logger.debug('searchAddress : ' + task.inRaw + ' ' + err);
            } else {
                // if(docs.length == 0)
                //   logger.debug('searchAddress: ' + task.inRaw + ' / count: ' + docs.length);
                console.log(JSON.stringify(docs));

                var 시군구Re = /(?:(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?/g;
                if(docs.length > 1) {
                    matched = task.inRaw.match(시군구Re);
                    // console.log('시군구Re: '+matched);
                    if (matched != null) {
                        if (matched[1] != null) {
                            if (matched[1] == '경기') 시도명 = '경기도';
                            else if (matched[1] == '강원') 시도명 = '강원도';
                            else if (matched[1] == '충북') 시도명 = '충청북도';
                            else if (matched[1] == '충남') 시도명 = '충청남도';
                            else if (matched[1] == '전북') 시도명 = '전라북도';
                            else if (matched[1] == '전남') 시도명 = '전라남도';
                            else if (matched[1] == '경북') 시도명 = '경상북도';
                            else if (matched[1] == '경남') 시도명 = '경상남도';
                            else if (matched[1] == '제주') 시도명 = '제주특별자치도';
                            else if (matched[1] == '제주도') 시도명 = '제주특별자치도';
                            else if (matched[1] == '서울') 시도명 = '서울특별시';
                            else if (matched[1] == '서울시') 시도명 = '서울특별시';
                            else if (matched[1] == '인천') 시도명 = '인천광역시';
                            else if (matched[1] == '인천시') 시도명 = '인천광역시';
                            else if (matched[1] == '대전') 시도명 = '대전광역시';
                            else if (matched[1] == '대전시') 시도명 = '대전광역시';
                            else if (matched[1] == '대구') 시도명 = '대구광역시';
                            else if (matched[1] == '대구시') 시도명 = '대구광역시';
                            else if (matched[1] == '광주') 시도명 = '광주광역시';
                            else if (matched[1] == '광주시') 시도명 = '광주광역시';
                            else if (matched[1] == '부산') 시도명 = '부산광역시';
                            else if (matched[1] == '부산시') 시도명 = '부산광역시';
                            else if (matched[1] == '울산') 시도명 = '울산광역시';
                            else if (matched[1] == '울산시') 시도명 = '울산광역시';
                            else if (matched[1] == '세종') 시도명 = '세종특별자치시';
                            else if (matched[1] == '세종시') 시도명 = '세종특별자치시';
                            else 시도명 = matched[1];
                        } else {
                            시도명 = matched[1];
                        }

                        시군구명 = matched[2];
                    }
                }

                for (var i = 0; i < docs.length && i < 10; i++) {
                    var doc = docs[i];
                    // console.log(!(시도명 && 시도명 == doc.시도명 && 시군구명 && doc.시군구명))
                    // console.log('건물명2: '+건물명);
                    // console.log('시도명: '+시도명);
                    // console.log('독시도명: '+doc.시도명);
                    // console.log('시군구명: ' +시군구명);
                    // console.log('독시군구명: '+doc.시군구명);
                    if(본번) {
                        if(docs.length > 1 && !건물명) {
                            if(!(시도명 && 시도명 == doc.시도명 && 시군구명 && doc.시군구명)) continue;
                        }
                        var 상세주소Re = new RegExp(doc.시군구용건물명 + '\\s+', 'i');
                        console.log('----------');
                        if(상세주소 && doc.시군구용건물명 != '') 도로명상세주소 = 상세주소.replace(상세주소Re, '');
                        console.log(1);
                        var _doc = {
                            시도명: doc.시도명,
                            시군구명: doc.시군구명,
                            법정읍면동명: doc.법정읍면동명,
                            법정리명: doc.법정리명,
                            행정동명: doc.행정동명,
                            지번본번: doc.지번본번,
                            지번부번: doc.지번부번,
                            도로명: doc.도로명,
                            건물본번: doc.건물본번,
                            건물부번: doc.건물부번,
                            시군구용건물명: doc.시군구용건물명,
                            도로명코드: doc.도로명코드,
                            읍면동일련번호: doc.읍면동일련번호
                        };

                        console.log(2);
                        _doc.지번주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '') +
                                    doc.지번본번 + (doc.지번부번 != '0' ? '-' + doc.지번부번 : '') + (상세주소 != undefined ? ' ' + 상세주소 : '');

                        _doc.도로명주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.도로명 + ' ' + doc.건물본번 + (doc.건물부번 != '0' ? '-' + doc.건물부번: '') +
                                     (도로명상세주소 != undefined ? ', ' + 도로명상세주소 : '') + ' (' + doc.법정읍면동명 + (doc.시군구용건물명 != '' ? ', ' + doc.시군구용건물명 : '') + ')';

                        _doc.상세주소 = 상세주소;

                        _doc.in = task.inRaw;

                        if(Array.isArray(task.doc)) task.doc.push(_doc);
                        else if(task.doc) task.doc = [task.doc, _doc];
                        else task.doc = utils.clone(_doc);

                    } else {
                        if(읍면동명) {
                            var _doc = {
                                시도명: doc.시도명,
                                시군구명: doc.시군구명,
                                법정읍면동명: doc.법정읍면동명,
                                법정리명: doc.법정리명,
                                행정동명: doc.행정동명
                            };

                            _doc.지번주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '');

                            _doc.in = task.inRaw;

                            if(Array.isArray(task.doc)) task.doc.push(_doc);
                            else if(task.doc) task.doc = [task.doc, _doc];
                            else task.doc = utils.clone(_doc);

                            break;
                        }
                    }

                    // logger.debug('searchAddress: ' +
                    //   task.inRaw + ' / ' +
                    //   doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '') +
                    //   doc.지번본번 + (doc.지번부번 != '0' ? '-' + doc.지번부번 : '') + (상세주소 != undefined ? ' ' + 상세주소 : '') + ' / ' + doc.행정동명 + ' / ' +
                    //   doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.도로명 + ' ' + doc.건물본번 + (doc.건물부번 != '0' ? '-' + doc.건물부번: '') +
                    //   (도로명상세주소 != undefined ? ', ' + 도로명상세주소 : '') + ' (' + doc.법정읍면동명 + (doc.시군구용건물명 != '' ? ', ' + doc.시군구용건물명 : '') + ')');

                    // + doc.상세건물명 + ' ' + doc.도로명코드 + ',' + doc.읍면동일련번호 + ', ' + doc.건물관리번호
                }
            }

            // console.log(task.doc);
            callback(task, context);

        })
    }
};

function searchAddress2(task, context, callback) {

    var model = mongo.getModel('건물정보', 건물정보스키마);

    var query = {};
    var 시도명, 시군구명, 읍면동명, 행정동명, 도로명, 리명, 본번, 부번, 상세주소, 도로명상세주소, 건물명, 시군구, 시군구의시도, 시도;

    var 지번Re = /(?:(경기도|경기|강원도|강원|충청북도|충북|충청남도|충남|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주|서울특별시|서울시|서울|인천광역시|인천시|인천|대전광역시|대전시|대전|대구광역시|대구시|대구|광주광역시|광주시|광주|부산광역시|부산시|부산|울산광역시|울산시|울산|세종특별자치시|세종특별시|세종시|세종)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?(?:(?:([가-힣]+읍|[가-힣]+면|[가-힣]+동|[가-힣]+\s[0-9]+가)|([가-힣]+\d+읍|[가-힣]+\d+면|[가-힣]+\d+동))|(?:(?:[가-힣]+읍\s+|[가-힣]+면\s+)?([가-힣]+[\s0-9]*번?로[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?로)))\s*([가-힣]+\d*리)?\s*(\d+)?(?:\s*-\s*(\d+))?(?:(?:\s*,?\s*|\s+)([^\\(]*))?(?:\s*\(([^,\s]+)(?:\s*,?\s*([^\\)]*))?\))?|(?:(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)|(?:^(경기도|경기|강원도|강원|충청북도|충북|충청남도|충남|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주|서울특별시|서울시|서울|인천광역시|인천시|인천|대전광역시|대전시|대전|대구광역시|대구시|대구|광주광역시|광주시|광주|부산광역시|부산시|부산|울산광역시|울산시|울산|세종특별자치시|세종특별시|세종시|세종)$)|(여의도)/i;
    var matched = task.inRaw.match(지번Re);
    // console.log('matched: ' + matched);
    if(matched != null) {
        if (matched[1] != null) {
            if (matched[1] == '경기') 시도명 = '경기도';
            else if (matched[1] == '강원') 시도명 = '강원도';
            else if (matched[1] == '충북') 시도명 = '충청북도';
            else if (matched[1] == '충남') 시도명 = '충청남도';
            else if (matched[1] == '전북') 시도명 = '전라북도';
            else if (matched[1] == '전남') 시도명 = '전라남도';
            else if (matched[1] == '경북') 시도명 = '경상북도';
            else if (matched[1] == '경남') 시도명 = '경상남도';
            else if (matched[1] == '제주') 시도명 = '제주특별자치도';
            else if (matched[1] == '제주도') 시도명 = '제주특별자치도';
            else if (matched[1] == '서울') 시도명 = '서울특별시';
            else if (matched[1] == '서울시') 시도명 = '서울특별시';
            else if (matched[1] == '인천') 시도명 = '인천광역시';
            else if (matched[1] == '인천시') 시도명 = '인천광역시';
            else if (matched[1] == '대전') 시도명 = '대전광역시';
            else if (matched[1] == '대전시') 시도명 = '대전광역시';
            else if (matched[1] == '대구') 시도명 = '대구광역시';
            else if (matched[1] == '대구시') 시도명 = '대구광역시';
            else if (matched[1] == '광주') 시도명 = '광주광역시';
            else if (matched[1] == '광주시') 시도명 = '광주광역시';
            else if (matched[1] == '부산') 시도명 = '부산광역시';
            else if (matched[1] == '부산시') 시도명 = '부산광역시';
            else if (matched[1] == '울산') 시도명 = '울산광역시';
            else if (matched[1] == '울산시') 시도명 = '울산광역시';
            else if (matched[1] == '세종') 시도명 = '세종특별자치시';
            else if (matched[1] == '세종시') 시도명 = '세종특별자치시';
            else 시도명 = matched[1];
        } else {
            시도명 = matched[1];
        }

        시군구명 = matched[2];
        읍면동명 = matched[3];
        행정동명 = matched[4];
        도로명 = matched[5];
        리명 = matched[6];
        본번 = matched[7];
        부번 = matched[8];
        상세주소 = matched[9] ? matched[9].trim() : matched[9];
        시군구의시도 = matched[12];
        시군구 = matched[13];
        시도 = matched[14];
        if (matched[15]) {
            읍면동명 = matched[15] + '동';
        }
        console.log('시군구의시도: ' + 시군구의시도);
        console.log('시군구: ' + 시군구);
        console.log('시도: ' + 시도);
        console.log('읍면동명: ' + 읍면동명);
        console.log('도로명: ' + 도로명);
        console.log('본번: ' + 본번);

        if(도로명) {
            도로명 = 도로명.replace(/\s/, '');
            query.도로명 = 도로명;
            if(본번) query.건물본번 = 본번;
            if(부번) query.건물부번 = 부번;
            else if(본번) query.건물부번 = '0';
        } else if(읍면동명) {
            query.법정읍면동명 = 읍면동명;
            if(리명) query.법정리명 = 리명;
            // else query.법정리명 = '';
            if(본번) query.지번본번 = 본번;
            if(부번) query.지번부번 = 부번;
            else if(본번) query.지번부번 = '0';
        } else if(행정동명) {
            행정동명 = 행정동명.replace(/\s/, '');
            query.행정동명 = 행정동명;
            if(본번) query.지번본번 = 본번;
            if(부번) query.지번부번 = 부번;
            else if(본번) query.지번부번 = '0';
        }

        if(시도) query.시도명 = 시도;
        if(시군구) query.시군구명 = new RegExp(시군구, 'i');
        console.log(Object.keys(query).length);

    } else {
        var 건물명Re = /\B(?:[a-zA-Z가-힣]+\s*\d+차[a-zA-Z가-힣]*|[0-9a-zA-Z가-힣]+)(?:\s|$)/g;
        var 건물명예외Re = /^(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시|[가-힣]+시|[가-힣]+군|[가-힣]+구|[가-힣]+읍|[0-9가-힣]+면|[0-9가-힣]+동|[0-9가-힣]+리|아파트|휴대폰|상가|건물|주택)$/i;
        matched = task.inRaw.match(건물명Re);
        if (matched != null) {
            건물명 = matched[0];
            console.log('건물명1: ' + 건물명)
            // console.log('inRaw: ' + task.inRaw);
            // console.log('matched: ' + matched);
            if (matched != null && matched instanceof Array) {
                if (matched.length > 1) {
                    query = {$or: []};
                    for (var i = 0; i < matched.length; i++) {
                        var match = matched[i].trim();
                        // console.log(match);
                        // logger.debug('건물명예외Re:' +match + ',' +  건물명예외Re + ','  + match.search(건물명예외Re));
                        if (match.search(건물명예외Re) == -1)
                            query.$or.push({시군구용건물명: match});
                    }
                } else {
                    if (matched[0].trim().search(건물명예외Re) == -1)
                        query = {시군구용건물명: matched[0].trim()};
                    // console.log('-------------------')
                    // console.log(JSON.stringify(query));
                }

                var last = matched[matched.length - 1];
                var lastRe = new RegExp(last + '\\s+(.*)', 'i');
                matched = task.inRaw.match(lastRe);
                console.log('matched: ' + matched);
                if (matched != null) {
                    상세주소 = matched[1];
                } else {
                    상세주소 = undefined;
                }
            }
        }}

    task.doc = null;

    // console.log(JSON.stringify(query));

    if(Object.keys(query).length == 0) {
        callback(task, context);
    } else if (읍면동명||도로명||행정동명||본번||부번||리명||건물명) {
        console.log('query start');
        model.aggregate([
            {$match: query},
            {$group: {
                _id: '$도로명코드',
                시도명: {$first: '$시도명'},
                시군구명: {$first: '$시군구명'},
                법정읍면동명: {$first: '$법정읍면동명'},
                법정리명: {$first: '$법정리명'},
                행정동명: {$first: '$행정동명'},
                지번본번: {$first: '$지번본번'},
                지번부번: {$first: '$지번부번'},
                도로명: {$first: '$도로명'},
                건물본번: {$first: '$건물본번'},
                건물부번: {$first: '$건물부번'},
                시군구용건물명: {$first: '$시군구용건물명'},
                도로명코드: {$first: '$도로명코드'},
                읍면동일련번호: {$first: '$읍면동일련번호'}
            }},
            {$limit: 10}
        ], function(err, docs) {
            if(err) {
                logger.debug('searchAddress : ' + task.inRaw + ' ' + err);
            } else {
                // if(docs.length == 0)
                //   logger.debug('searchAddress: ' + task.inRaw + ' / count: ' + docs.length);
                // console.log(JSON.stringify(docs));
                // var 시군구Re = /(?:(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?/g;
                // if(docs.length > 1) {
                //   matched = task.inRaw.match(시군구Re);
                //   // console.log('시군구Re: '+matched);
                //   if (matched != null) {
                //     if (matched[1] != null) {
                //       if (matched[1] == '경기') 시도명 = '경기도';
                //       else if (matched[1] == '강원') 시도명 = '강원도';
                //       else if (matched[1] == '충북') 시도명 = '충청북도';
                //       else if (matched[1] == '충남') 시도명 = '충청남도';
                //       else if (matched[1] == '전북') 시도명 = '전라북도';
                //       else if (matched[1] == '전남') 시도명 = '전라남도';
                //       else if (matched[1] == '경북') 시도명 = '경상북도';
                //       else if (matched[1] == '경남') 시도명 = '경상남도';
                //       else if (matched[1] == '제주') 시도명 = '제주특별자치도';
                //       else if (matched[1] == '제주도') 시도명 = '제주특별자치도';
                //       else if (matched[1] == '서울') 시도명 = '서울특별시';
                //       else if (matched[1] == '서울시') 시도명 = '서울특별시';
                //       else if (matched[1] == '인천') 시도명 = '인천광역시';
                //       else if (matched[1] == '인천시') 시도명 = '인천광역시';
                //       else if (matched[1] == '대전') 시도명 = '대전광역시';
                //       else if (matched[1] == '대전시') 시도명 = '대전광역시';
                //       else if (matched[1] == '대구') 시도명 = '대구광역시';
                //       else if (matched[1] == '대구시') 시도명 = '대구광역시';
                //       else if (matched[1] == '광주') 시도명 = '광주광역시';
                //       else if (matched[1] == '광주시') 시도명 = '광주광역시';
                //       else if (matched[1] == '부산') 시도명 = '부산광역시';
                //       else if (matched[1] == '부산시') 시도명 = '부산광역시';
                //       else if (matched[1] == '울산') 시도명 = '울산광역시';
                //       else if (matched[1] == '울산시') 시도명 = '울산광역시';
                //       else if (matched[1] == '세종') 시도명 = '세종특별자치시';
                //       else if (matched[1] == '세종시') 시도명 = '세종특별자치시';
                //       else 시도명 = matched[1];
                //     } else {
                //       시도명 = matched[1];
                //     }
                //
                //     시군구명 = matched[2];
                //   }
                // }

                for (var i = 0; i < docs.length && i < 10; i++) {
                    var doc = docs[i];
                    // console.log(!(시도명 && 시도명 == doc.시도명 && 시군구명 && doc.시군구명))
                    // console.log('건물명2: '+건물명);
                    // console.log('시도명: '+시도명);
                    // console.log('독시도명: '+doc.시도명);
                    // console.log('시군구명: ' +시군구명);
                    // console.log('독시군구명: '+doc.시군구명);
                    // if(본번||건물명) {
                    if (본번||건물명) {
                        if(docs.length > 1 && !건물명) {
                            if(!(시도명 && 시도명 == doc.시도명 && 시군구명 && doc.시군구명)) continue;
                        }
                        var 상세주소Re = new RegExp(doc.시군구용건물명 + '\\s+', 'i');
                        console.log('----------');
                        if(상세주소 && doc.시군구용건물명 != '') 도로명상세주소 = 상세주소.replace(상세주소Re, '');
                        console.log(1);
                        var _doc = {
                            시도명: doc.시도명,
                            시군구명: doc.시군구명,
                            법정읍면동명: doc.법정읍면동명,
                            법정리명: doc.법정리명,
                            행정동명: doc.행정동명,
                            지번본번: doc.지번본번,
                            지번부번: doc.지번부번,
                            도로명: doc.도로명,
                            건물본번: doc.건물본번,
                            건물부번: doc.건물부번,
                            시군구용건물명: doc.시군구용건물명,
                            도로명코드: doc.도로명코드,
                            읍면동일련번호: doc.읍면동일련번호
                        };

                        console.log(2);
                        _doc.지번주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '') +
                                    doc.지번본번 + (doc.지번부번 != '0' ? '-' + doc.지번부번 : '') + (상세주소 != undefined ? ' ' + 상세주소 : '');

                        _doc.도로명주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.도로명 + ' ' + doc.건물본번 + (doc.건물부번 != '0' ? '-' + doc.건물부번: '') +
                                     (도로명상세주소 != undefined ? ', ' + 도로명상세주소 : '') + ' (' + doc.법정읍면동명 + (doc.시군구용건물명 != '' ? ', ' + doc.시군구용건물명 : '') + ')';

                        _doc.상세주소 = 상세주소;

                        _doc.in = task.inRaw;

                        if(Array.isArray(task.doc)) task.doc.push(_doc);
                        else if(task.doc) task.doc = [task.doc, _doc];
                        else task.doc = utils.clone(_doc);
                        // console.log('task1: '+JSON.stringify(task.doc));

                    } else if (읍면동명) {
                        var _doc = {
                            시도명: doc.시도명,
                            시군구명: doc.시군구명,
                            법정읍면동명: doc.법정읍면동명,
                            법정리명: doc.법정리명,
                            행정동명: doc.행정동명
                        };

                        _doc.지번주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ' : '');

                        _doc.in = task.inRaw;

                        // console.log('_doc: '+JSON.stringify(_doc));
                        // console.log('task3: '+JSON.stringify(task.doc));
                        // console.log(Array.isArray(task.doc));

                        if (Array.isArray(task.doc)) {
                            for (var j = 0; j < task.doc.length; j++) {
                                if (task.doc[j].시도명 == _doc.시도명) {
                                    var same;
                                    break;
                                }
                            }
                            if (typeof same == undefined) {
                                task.doc.push(_doc)
                            }
                        } else if (task.doc && task.doc.시도명 != _doc.시도명) {
                            task.doc = [task.doc, _doc];
                        }
                        else {
                            task.doc = utils.clone(_doc);
                        }

                        // console.log('i::::::::::::::'+i);
                        // if(Array.isArray(task.doc)) console.log(task.doc[j].시도명);
                        // console.log('task2: '+JSON.stringify(task.doc));
                        // break;
                    }
                    // } else if (시군구) {
                    //   var _doc = {
                    //     시도명: doc.시도명,
                    //     시군구명: doc.시군구명
                    //   };
                    //
                    //   _doc.지번주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '');
                    //
                    //   _doc.in = task.inRaw;
                    //
                    //   // console.log('_doc: '+JSON.stringify(_doc));
                    //   // console.log('task3: '+JSON.stringify(task.doc));
                    //   // console.log(Array.isArray(task.doc));
                    //
                    //   if (Array.isArray(task.doc)) {
                    //     for (var j = 0; j < task.doc.length; j++) {
                    //       if (task.doc[j].시도명 == _doc.시도명) {
                    //         var same;
                    //         break;
                    //       }
                    //     }
                    //     if (typeof same == undefined) {
                    //       task.doc.push(_doc)
                    //     }
                    //   } else if (task.doc && task.doc.시도명 != _doc.시도명) {
                    //     task.doc = [task.doc, _doc];
                    //   }
                    //   else {
                    //     task.doc = utils.clone(_doc);
                    //   }
                    //
                    //   // console.log('i::::::::::::::'+i);
                    //   // if(Array.isArray(task.doc)) console.log(task.doc[j].시도명);
                    //   // console.log('task2: '+JSON.stringify(task.doc));
                    //   // break;
                    // } else if (시도) {
                    //   var _doc = {
                    //     시도명: doc.시도명
                    //   };
                    //   console.log('doc.시도명: '+ doc.시도명);
                    //
                    //   _doc.지번주소 = doc.시도명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '');
                    //
                    //   _doc.in = task.inRaw;
                    //
                    //   // console.log('_doc: '+JSON.stringify(_doc));
                    //   // console.log('task3: '+JSON.stringify(task.doc));
                    //   // console.log(Array.isArray(task.doc));
                    //
                    //   if (Array.isArray(task.doc)) {
                    //     for (var j = 0; j < task.doc.length; j++) {
                    //       if (task.doc[j].시도명 == _doc.시도명) {
                    //         var same;
                    //         break;
                    //       }
                    //     }
                    //     if (typeof same == undefined) {
                    //       task.doc.push(_doc)
                    //     }
                    //   } else if (task.doc && task.doc.시도명 != _doc.시도명) {
                    //     task.doc = [task.doc, _doc];
                    //   }
                    //   else {
                    //     task.doc = utils.clone(_doc);
                    //   }
                    //
                    //   // console.log('i::::::::::::::'+i);
                    //   // if(Array.isArray(task.doc)) console.log(task.doc[j].시도명);
                    //   // console.log('task2: '+JSON.stringify(task.doc));
                    //   // break;
                    // }

                    // logger.debug('searchAddress: ' +
                    //   task.inRaw + ' / ' +
                    //   doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '') +
                    //   doc.지번본번 + (doc.지번부번 != '0' ? '-' + doc.지번부번 : '') + (상세주소 != undefined ? ' ' + 상세주소 : '') + ' / ' + doc.행정동명 + ' / ' +
                    //   doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.도로명 + ' ' + doc.건물본번 + (doc.건물부번 != '0' ? '-' + doc.건물부번: '') +
                    //   (도로명상세주소 != undefined ? ', ' + 도로명상세주소 : '') + ' (' + doc.법정읍면동명 + (doc.시군구용건물명 != '' ? ', ' + doc.시군구용건물명 : '') + ')');

                    // + doc.상세건물명 + ' ' + doc.도로명코드 + ',' + doc.읍면동일련번호 + ', ' + doc.건물관리번호
                }
            }
            // console.log('docs: ' + JSON.stringify(docs));
            // console.log('task.doc: '+JSON.stringify(task.doc));
            callback(task, context);

        })
    } else if (시군구||시도||시군구의시도) {
        if (시도) {
            var _doc = {
                시도명: 시도
            };

            _doc.지번주소 = 시도 + ' ';

            _doc.in = task.inRaw;

            // console.log('_doc: '+JSON.stringify(_doc));
            // console.log('task3: '+JSON.stringify(task.doc));
            // console.log(Array.isArray(task.doc));

            if (Array.isArray(task.doc)) {
                for (var j = 0; j < task.doc.length; j++) {
                    if (task.doc[j].시도명 == _doc.시도명) {
                        var same;
                        break;
                    }
                }
                if (typeof same == undefined) {
                    task.doc.push(_doc)
                }
            } else if (task.doc && task.doc.시도명 != _doc.시도명) {
                task.doc = [task.doc, _doc];
            }
            else {
                task.doc = utils.clone(_doc);
            }
        } else if (시군구의시도) {
            var _doc = {
                시도명: 시군구의시도,
                시군구명: 시군구
            };

            _doc.지번주소 = 시군구의시도 + ' ' + 시군구 + ' ';

            _doc.in = task.inRaw;

            // console.log('_doc: '+JSON.stringify(_doc));
            // console.log('task3: '+JSON.stringify(task.doc));
            // console.log(Array.isArray(task.doc));

            if (Array.isArray(task.doc)) {
                for (var j = 0; j < task.doc.length; j++) {
                    if (task.doc[j].시도명 == _doc.시도명) {
                        var same;
                        break;
                    }
                }
                if (typeof same == undefined) {
                    task.doc.push(_doc)
                }
            } else if (task.doc && task.doc.시도명 != _doc.시도명) {
                task.doc = [task.doc, _doc];
            }
            else {
                task.doc = utils.clone(_doc);
            }
        } else if (시군구) {
            console.log('시군구는 바로'+ 시군구);
            var _doc = {
                시군구명: 시군구
            };

            _doc.지번주소 = 시군구 + ' ';

            _doc.in = task.inRaw;

            // console.log('_doc: '+JSON.stringify(_doc));
            // console.log('task3: '+JSON.stringify(task.doc));
            // console.log(Array.isArray(task.doc));

            if (Array.isArray(task.doc)) {
                for (var j = 0; j < task.doc.length; j++) {
                    if (task.doc[j].시도명 == _doc.시도명) {
                        var same;
                        break;
                    }
                }
                if (typeof same == undefined) {
                    task.doc.push(_doc)
                }
            } else if (task.doc && task.doc.시도명 != _doc.시도명) {
                task.doc = [task.doc, _doc];
            }
            else {
                task.doc = utils.clone(_doc);
            }
        }
        callback(task,context);
    }
};

module.exports = function(globals)
{
    globals.setTypeChecks('addressTypeCheck', function(dialog, context, callback)
    {
        var that = this;
        var address = {};
        address.inRaw = dialog.userInput.text;
        searchAddress(address, context, function()
        {
            if(address.doc == undefined)
            {
                console.log('nodata: ' + address.inRaw);
                callback(false);
            }
            else if(Array.isArray(address.doc))
            {
                for (var i = 0; i < address.doc.length; i++)
                {
                    console.log('multi: ' + address.inRaw + ' / ' + address.doc[i].지번주소 + ' / ' + address.doc[i].도로명주소);
                }

                dialog.userInput.types[that.name] = address.doc[0];

                callback(true, dialog.userInput.text);
            }
            else if(address.doc)
            {
                console.log(address.inRaw + ' / ' + address.doc.지번주소 + ' / ' + address.doc.도로명주소);

                dialog.userInput.types[that.name] = address.doc;

                callback(true, dialog.userInput.text);
            }
        });
    });

    globals.setTypeChecks('addressTypeCheck2', function(text, type, task, context, callback)
    {
        var address = {};
        address.inRaw = text;
        searchAddress2(address, context, function() {
            if(address.doc == undefined) {
                logger.debug('nodata: ' + address.inRaw);

                callback(text, task, false);
            } else if(Array.isArray(address.doc)) {
                for (var i = 0; i < address.doc.length; i++) {
                    logger.debug('multi: ' + address.inRaw + ' / ' + address.doc[i].지번주소 + ' / ' + address.doc[i].도로명주소);
                }
                task[type.name] = address.doc;
                callback(text, task, true);
            } else if(address.doc) {
                logger.debug(address.inRaw + ' / ' + address.doc.지번주소 + ' / ' + address.doc.도로명주소);
                task[type.name] = address.doc;
                callback(text, task, true);
            }
        });
    });

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

        var http = require('./http');
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
