//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DateRangePickerService', function($window, $rootScope, LanguageService)
    {
        var f = function(selector, dateObject, updateCallback)
        {
            var start = moment().subtract(29, 'days');
            var end = moment();

            function cb(start, end, isFirst) {
                dateObject.start = start._d;
                dateObject.end = end._d;
                $(selector + ' span').html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));

                if(isFirst !== true)
                {
                    updateCallback();
                }
            }

            var mm = moment();

            var ranges = {};
            ranges[LanguageService('Today')] = [moment(), moment()];
            ranges[LanguageService('Last 7 days')]= [(moment().set({date: moment().get('date') - 7})), moment()];
            ranges[LanguageService('Last 30 days')]= [moment().set({date: moment().get('date') - 30}), moment()];
            ranges[LanguageService('This Month')]= [moment().set({month: moment().get('month')}), moment().set({date: moment().endOf('month').get('date')})];
            ranges[LanguageService('Last Month')]= [moment().set({month: mm.get('month')-1}), moment().set({month: mm.get('month')-1, date: moment().set({month: mm.get('month')-1}).endOf('month').get('date')})];

            $(selector).daterangepicker({
                parentEl: "#date-container",
                startDate: start,
                endDate: end,
                opens: "left",
                minDate : moment().subtract(62, 'days'),
                maxDate : moment().endOf('month'),
                ranges: ranges,
                locale: {
                    "format": "YYYY/MM/DD",
                    "separator": " - ",
                    "applyLabel": LanguageService('Apply'),
                    "cancelLabel": LanguageService('Cancel'),
                    "fromLabel": LanguageService('from'),
                    "toLabel": LanguageService('to'),
                    "customRangeLabel": LanguageService('Select Dates'),
                    "weekLabel": LanguageService('week'),
                    "daysOfWeek": [
                        LanguageService('Sunday'),
                        LanguageService('Monday'),
                        LanguageService('Tuesday'),
                        LanguageService('Wednesday'),
                        LanguageService('Thursday'),
                        LanguageService('Friday'),
                        LanguageService('Saturday')
                    ],
                    monthNames: [
                        LanguageService('January'),
                        LanguageService('February'),
                        LanguageService('March'),
                        LanguageService('April'),
                        LanguageService('May'),
                        LanguageService('June'),
                        LanguageService('July'),
                        LanguageService('August'),
                        LanguageService('September'),
                        LanguageService('October'),
                        LanguageService('November'),
                        LanguageService('December')
                    ],
                    "firstDay": 1
                }
            }, cb);

            cb(start, end, true);
        };

        return { init: f };
    });
})();
