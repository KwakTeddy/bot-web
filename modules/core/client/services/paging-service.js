//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('PagingService', function($window, $rootScope)
    {
        function getPrevNextPage(page, totalPage)
        {
            var prev = 1;
            var next = 11;

            if(totalPage < 11)
                next = totalPage;

            if(page > 10 && page <= 20)
            {
                if(totalPage >= 21)
                    next = 21;
                else
                    next = totalPage;
            }
            else if(page > 20)
            {
                var c = parseInt(page / 10) * 10;
                prev += c - 10;

                if(next + c <= totalPage)
                    next += c;
                else
                    next = totalPage;
            }

            return { prev : prev, next : next };
        };

        function getPageOptions(page, totalPage)
        {
            var endPage = 10 * (parseInt((page-1)/10) + 1);
            if(endPage > totalPage)
                endPage = totalPage;

            endPage = endPage == 0 ? 1 : endPage;

            var pages = [];
            for(var i=1 + (10 * parseInt((page-1)/10)); i<=endPage; i++)
            {
                pages.push(i);
            }

            var options = getPrevNextPage(page, totalPage);
            options.pages = pages;
            options.currentPage = parseInt(page);

            return options;
        };

        return getPageOptions;
    });
})();
