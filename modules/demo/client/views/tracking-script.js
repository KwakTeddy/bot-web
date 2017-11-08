var myWorker = new Worker("tracking-worker.js");

window.onload = function() {
    initTracker();
};

var initTracker = function(argument) {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    tracking.track('#video', tracker, {
        camera: true
    });

    myWorker.onmessage = function(event) {
        tracker.emit('track', event);
    }
    tracker.on('track', function(event) {

        context.clearRect(0, 0, canvas.width, canvas.height);

        event.data.forEach(function(rect) {
            //console.log(rect.x);
            context.strokeStyle = '#a64ceb';
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        });
    });

    document.getElementById("toggletracking").addEventListener("click", function() {
        window.senddata = !window.senddata;

        if (window.senddata) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

}
