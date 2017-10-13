(function()
{
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var ResponseManager = function()
    {

    };

    ResponseManager.prototype.returnResponse = function(dialog, responseCallback)
    {
        var output = dialog.output;
        if((typeof output == 'Array' || typeof output == 'object') && output.length)
        {
            var index = getRandomInt(0, output.length-1);
            responseCallback(output[index]);
        }
        else if(typeof output == 'string' || output.text)
        {
            responseCallback(output);
        }
    };

    module.exports = new ResponseManager();
})();
