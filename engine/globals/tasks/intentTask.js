module.exports = function(globals)
{
    var intentTask = {

        action: function(task, context, callback) {
            // console.log(JSON.stringify(task.typeDoc, null, 2));

            if(Array.isArray(task.typeDoc)) {
                if(task.typeDoc.length > 1) task._output = task.typeDoc[0].output;
                else task._output = task.typeDoc[0].output;

                console.log(task.typeDoc[0].inputRaw + ', ' + task.typeDoc[0].input + '(' + task.typeDoc[0].matchCount + ', ' + task.typeDoc[0].matchRate + ')');
            } else {
                task._output = task.typeDoc.output;
                console.log(task.typeDoc.inputRaw + ', ' + task.typeDoc.input + '(' + task.typeDoc.matchCount + ', ' + task.typeDoc.matchRate + ')');
            }

            if(Array.isArray(task._output)) {
                task._output = task._output[Math.floor(Math.random() * task._output.length)];
            }

            callback(task, context);
        }
    };

    globals.setTasks('intentTask', intentTask);
};
