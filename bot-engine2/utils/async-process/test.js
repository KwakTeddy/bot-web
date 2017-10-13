var AsyncProcess = require('./core.js');

var ap = new AsyncProcess();

var f = function(time, done)
{
    setTimeout(function()
    {
        console.log(time);
        done();
    }, time);
};

ap.done(function()
{
    console.log('작업완료');
});

f(1000, ap.makeAsyncProcess());
f(2000, ap.makeAsyncProcess());
f(3000, ap.makeAsyncProcess());
