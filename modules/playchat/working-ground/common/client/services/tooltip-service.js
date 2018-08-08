//Bot users service used to communicate Bot users REST endpoints
(function ()
{
   'use strict';

   var template = '<div class="tooltip">\n' +
                    '<span>{text}</span>\n' +
                    '<em class="tail"></em>\n' +
                  '</div>';

   var instance = undefined;
   angular.module('playchat').factory('ToolTipService', function($window, $rootScope)
   {
        var ToolTip = function(target, direction, text)
        {
            this.target = target;
            this.direction = direction;
            this.text = text;
        };

        ToolTip.prototype.show = function()
        {
            var t = template.replace('{text}', this.text);

            t = angular.element(t);
            angular.element('body').append(t);

            if(this.target.get(0))
            {
                this.target = this.target.get(0);
            }

            var rect = this.target.getBoundingClientRect();
        };

        return ToolTip;
   });
})();
