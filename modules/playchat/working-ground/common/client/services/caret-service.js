//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('CaretService', function($window, $rootScope)
    {
        return {
            placeCaretAtEnd: function(el)
            {
                el.focus();
                if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined")
                {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    range.collapse(false);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                else if (typeof document.body.createTextRange != "undefined")
                {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(false);
                    textRange.select();
                }
            },
            placeCaretAtIndex: function(node, index)
            {
                var range = document.createRange();
                var sel = window.getSelection();
                range.setStart(node, index);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        };
    });
})();
