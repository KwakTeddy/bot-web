//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('ExcelDownloadService', function($http)
    {
        var f = function(botId, fileName, dateObject, template)
        {
            var startYear =  dateObject.start.getFullYear();
            var startMonth = dateObject.start.getMonth() + 1;
            var startDay =   dateObject.start.getDate();
            var endYear =  dateObject.end.getFullYear();
            var endMonth = dateObject.end.getMonth() + 1;
            var endDay =   dateObject.end.getDate();

            var date = {
                start: startYear + "/" + startMonth + "/" + startDay,
                end: endYear + "/" + endMonth + "/" + endDay
            };

            $http.post('/api/analytics/statistics/exel-download/' + botId, {data: template, date: date, transpose: true}).then(function (doc)
            {
                fileName = botId + '_' + fileName + '_' + startYear + '-' + startMonth + '-' + startDay + '~' + endYear + '-' + endMonth + '-' + endDay + '_' + '.xlsx';
                function s2ab(s)
                {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }

                saveAs(new Blob([s2ab(doc.data)],{type:"application/octet-stream"}), fileName);
            }, function (err) {
                console.log(err);
            });
        };

        return { download: f };
    });
})();