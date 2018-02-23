var CustomModal = undefined;
(function()
{
    CustomModal = function()
    {
        this.style = '.custom-modal-background { position: fixed; left: 0; right: 0; top: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; }';
        this.template = '<div class="custom-modal-background">' +
                         '  <div>' +
                             '  <div class="custom-modal-title">{title}</div>' +
                             '  <div class="custom-modal-content">{content}</div>' +
                             '  <div class="custom-modal-footer">{footer}</div>' +
                         '  </div>' +
                         '</div>';

        this.defaultFooter = '<button type="button" class="custom-modal-confirm-button">Confirm</button>' +
                             '<button type="button" class="custom-modal-cancel-button">Cancel</button>';
    };

    CustomModal.prototype.open = function(title, content, confirmCallback, cancelCallback)
    {
        var div = document.createElement('div');
        div.innerHTML = this.template.replace('{title}', title).replace('{content}', content).replace('{footer}', this.defaultFooter);

        var style = document.createElement('style');
        style.innerHTML = this.style;

        div.querySelector('.custom-modal-confirm-button').addEventListener('click', confirmCallback);
        div.querySelector('.custom-modal-cancel-button').addEventListener('click', cancelCallback);

        document.body.appendChild(style);
        document.body.appendChild(div);
    };

    CustomModal.prototype.openWithTemplate = function(titleTemplate, contentTemplate, footerTemplate, callback)
    {
        var div = document.createElement('div');
        div.innerHTML = this.template.replace('{title}', titleTemplate).replace('{content}', contentTemplate).replace('{footer}', footerTemplate);

        var style = document.createElement('style');
        style.innerHTML = this.style;

        document.body.appendChild(style);
        document.body.appendChild(div);

        callback(div);
    };
})();
