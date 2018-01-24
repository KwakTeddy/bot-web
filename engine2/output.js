(function()
{
    var OutputManager = function()
    {

    };

    OutputManager.prototype.getRandomInt = function(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    OutputManager.prototype.make = function(output)
    {
        console.log();
        console.log('----- OutputManager make [Start]');


        console.log('result: ', output);
        console.log('----- OutputManager make [End]');
        console.log();

        return resultMessage;
    };

    module.exports = new OutputManager();
})();
