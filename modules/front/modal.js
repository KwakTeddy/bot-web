var CustomModal = undefined;
(function()
{
    CustomModal = function()
    {
        this.template =
            '<div class="modal fade in" id="login_modal" style="display: block">\n' +
            '    <div class="modal-dialog">\n' +
            '        <div class="modal-content" id="modal-content">\n' +
            '            <div class="modal-header">\n' +
            '                <button type="button" class="close" id="modal-close">\n' +
            '                    <span aria-hidden="true">&times;</span>\n' +
            '                </button>\n' +
            '                <h4 class="modal-title">{title}</h4>\n' +
            '            </div>\n' +
            '            <div class="modal-body">{content}</div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>';
    };

    CustomModal.prototype.open = function(title, content, confirmCallback, cancelCallback)
    {
        var div = document.createElement('div');
        div.innerHTML = this.template.replace('{title}', title).replace('{content}', content).replace('{footer}', this.defaultFooter);

        var style = document.createElement('style');
        style.innerHTML = this.style;

        div.querySelector('.custom-modal-confirm-button').addEventListener('click', confirmCallback);
        div.querySelector('.custom-modal-cancel-button').addEventListener('click', cancelCallback);

        div.appendChild(style);

        document.body.appendChild(div);
    };

    CustomModal.prototype.openWithTemplate = function(titleTemplate, contentTemplate, footerTemplate, callback)
    {
        var div = document.createElement('div');
        div.innerHTML = this.template.replace('{title}', titleTemplate).replace('{content}', contentTemplate).replace('{footer}', footerTemplate);

        div.addEventListener('mouseup', function (e) {
            var currentElement = e.currentTarget;
            currentElement.parentElement.removeChild(currentElement);
            e.stopPropagation();
            e.preventDefault();
        });
        div.querySelector('#modal-content').addEventListener('mouseup', function (e) {
            e.stopPropagation();
            e.preventDefault();

        });
        document.body.appendChild(div);
        callback(div);
    };
})();
