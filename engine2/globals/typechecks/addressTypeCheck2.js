function searchAddress2(task, context, callback) {

    var model = mongo.getModel('건물정보', 건물정보스키마);

    var query = {};
    var 시도명, 시군구명, 읍면동명, 행정동명, 도로명, 리명, 본번, 부번, 상세주소, 도로명상세주소, 건물명, 시군구, 시군구의시도, 시도;

    var 지번Re = /(?:(경기도|경기|강원도|강원|충청북도|충북|충청남도|충남|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주|서울특별시|서울시|서울|인천광역시|인천시|인천|대전광역시|대전시|대전|대구광역시|대구시|대구|광주광역시|광주시|광주|부산광역시|부산시|부산|울산광역시|울산시|울산|세종특별자치시|세종특별시|세종시|세종)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?(?:(?:([가-힣]+읍|[가-힣]+면|[가-힣]+동|[가-힣]+\s[0-9]+가)|([가-힣]+\d+읍|[가-힣]+\d+면|[가-힣]+\d+동))|(?:(?:[가-힣]+읍\s+|[가-힣]+면\s+)?([가-힣]+[\s0-9]*번?로[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?로)))\s*([가-힣]+\d*리)?\s*(\d+)?(?:\s*-\s*(\d+))?(?:(?:\s*,?\s*|\s+)([^\\(]*))?(?:\s*\(([^,\s]+)(?:\s*,?\s*([^\\)]*))?\))?|(?:(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)|(?:^(경기도|경기|강원도|강원|충청북도|충북|충청남도|충남|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주|서울특별시|서울시|서울|인천광역시|인천시|인천|대전광역시|대전시|대전|대구광역시|대구시|대구|광주광역시|광주시|광주|부산광역시|부산시|부산|울산광역시|울산시|울산|세종특별자치시|세종특별시|세종시|세종)$)|(여의도)/i;
    var matched = task.inRaw.match(지번Re);
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

    } else {
        var 건물명Re = /\B(?:[a-zA-Z가-힣]+\s*\d+차[a-zA-Z가-힣]*|[0-9a-zA-Z가-힣]+)(?:\s|$)/g;
        var 건물명예외Re = /^(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시|[가-힣]+시|[가-힣]+군|[가-힣]+구|[가-힣]+읍|[0-9가-힣]+면|[0-9가-힣]+동|[0-9가-힣]+리|아파트|휴대폰|상가|건물|주택)$/i;
        matched = task.inRaw.match(건물명Re);
        if (matched != null) {
            건물명 = matched[0];
            if (matched != null && matched instanceof Array) {
                if (matched.length > 1) {
                    query = {$or: []};
                    for (var i = 0; i < matched.length; i++) {
                        var match = matched[i].trim();
                        // logger.debug('건물명예외Re:' +match + ',' +  건물명예외Re + ','  + match.search(건물명예외Re));
                        if (match.search(건물명예외Re) == -1)
                            query.$or.push({시군구용건물명: match});
                    }
                } else {
                    if (matched[0].trim().search(건물명예외Re) == -1)
                        query = {시군구용건물명: matched[0].trim()};
                }

                var last = matched[matched.length - 1];
                var lastRe = new RegExp(last + '\\s+(.*)', 'i');
                matched = task.inRaw.match(lastRe);
                if (matched != null) {
                    상세주소 = matched[1];
                } else {
                    상세주소 = undefined;
                }
            }
        }}

    task.doc = null;

    if(Object.keys(query).length == 0) {
        callback(task, context);
    } else if (읍면동명||도로명||행정동명||본번||부번||리명||건물명) {
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
                // var 시군구Re = /(?:(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?/g;
                // if(docs.length > 1) {
                //   matched = task.inRaw.match(시군구Re);
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
                    if (본번||건물명) {
                        if(docs.length > 1 && !건물명) {
                            if(!(시도명 && 시도명 == doc.시도명 && 시군구명 && doc.시군구명)) continue;
                        }
                        var 상세주소Re = new RegExp(doc.시군구용건물명 + '\\s+', 'i');
                        if(상세주소 && doc.시군구용건물명 != '') 도로명상세주소 = 상세주소.replace(상세주소Re, '');
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

                        _doc.지번주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '') +
                                    doc.지번본번 + (doc.지번부번 != '0' ? '-' + doc.지번부번 : '') + (상세주소 != undefined ? ' ' + 상세주소 : '');

                        _doc.도로명주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.도로명 + ' ' + doc.건물본번 + (doc.건물부번 != '0' ? '-' + doc.건물부번: '') +
                                     (도로명상세주소 != undefined ? ', ' + 도로명상세주소 : '') + ' (' + doc.법정읍면동명 + (doc.시군구용건물명 != '' ? ', ' + doc.시군구용건물명 : '') + ')';

                        _doc.상세주소 = 상세주소;

                        _doc.in = task.inRaw;

                        if(Array.isArray(task.doc)) task.doc.push(_doc);
                        else if(task.doc) task.doc = [task.doc, _doc];
                        else task.doc = utils.clone(_doc);

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
                    //   // break;
                    // } else if (시도) {
                    //   var _doc = {
                    //     시도명: doc.시도명
                    //   };
                    //
                    //   _doc.지번주소 = doc.시도명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '');
                    //
                    //   _doc.in = task.inRaw;
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
            callback(task, context);

        })
    } else if (시군구||시도||시군구의시도) {
        if (시도) {
            var _doc = {
                시도명: 시도
            };

            _doc.지번주소 = 시도 + ' ';

            _doc.in = task.inRaw;

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
            var _doc = {
                시군구명: 시군구
            };

            _doc.지번주소 = 시군구 + ' ';

            _doc.in = task.inRaw;

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
};
