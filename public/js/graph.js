// dialogs
// {name: string, input:, task: output: , children: if:}
// input: string || { types: regexp: string} || false || {if: 'condition'} || [string, string...]
// task: function name || {action: function body}
// output: string || [ {if: 'condition', output: children: ] || {call: string} || {returnCall: string } || {up: number} || {repeat: number, options: } || {output: string}
// children: [ {input:, output:, children: } ]
// options: {output: string} || {returnDialog: string}
// types: [ {name: string, listName: string, field: string, typeCheck: string, raw: boolean} ]
//

/*
var links = [
  {source: "Microsoft", target: "Amazon", type: "licensing"},
  {source: "Samsung", target: "Apple", type: "suit"},
];
*/

var nodes = [];
var links = [];

var num = 0;
var handleDialog = function(dialog)
{
    dialog.name = dialog.name || (dialog.name = "dialog#" + ++num);
    nodes[dialog.name] = nodes[dialog.name] || (nodes[dialog.name] = { name: dialog.name });
    nodes[dialog.name].input  = dialog.input;
    nodes[dialog.name].output = dialog.output;
    nodes[dialog.name].dialog = dialog;

    if (dialog.children) {
        dialog.children.forEach(function(child) {
            handleDialog(child);
        });
    }
};

var handleOutput = function(dialog, output)
{
    if (output.output) {
        handleOutput(dialog, output.output);
    }
    if (output.options) {
        if (output.options.returnDialog) {
            links.push({ source: nodes[dialog.name], target: nodes[output.options.returnDialog], type: "returnDialog" });
        }
    }

    if (output.call) {
        links.push({ source: nodes[dialog.name], target: nodes[output.call], type: "call" });
    }
    if (output.callChild) {
        links.push({ source: nodes[dialog.name], target: nodes[output.callChild], type: "callChild" });
    }
    if (output.returnCall) {
        links.push({ source: nodes[dialog.name], target: nodes[output.returnCall], type: "returnCall" });
    }
};

var handleLink = function(dialog)
{
    if (dialog.children) {
        dialog.children.forEach(function(child) {
            handleLink(child);
            links.push({ source: nodes[dialog.name], target: nodes[child.name], type: "child" });
        });
    }
    if (Array.isArray(dialog.output)) {
        for (var i=0; i < dialog.output.length; ++i) {
            handleOutput(dialog, dialog.output[i]);
        }
    } else {
        handleOutput(dialog, dialog.output);
    }
};

dialogs.forEach(handleDialog); // for-loop is 10 times faster
dialogs.forEach(handleLink);
console.log(nodes);
console.log(links);

/*
// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});
*/

var width = 1900,
    height = 900;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(300)
    .charge(-2400)
    .on("tick", tick)
    .start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
/*
var svg = d3.select("body")
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    //class to make it responsive
    .classed("svg-content-responsive", true);
*/

var input_box = svg.append("text")
    .attr("x", 12)
    .attr("dy", "1.35em")
    .style("fill", "steelblue")
    .style("font", "10px sans-serif")
;
var output_box = svg.append("text")
    .attr("x", 12)
    .attr("dy", "2.35em")
    .style("fill", "steelblue")
    .style("font", "10px sans-serif")
;

//tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        var input = (typeof d.input == 'string' ? d.input.replace(/(?:\r\n|\r|\n)/g, '<br />') : d.input);
        var output = (typeof d.output == 'string' ? d.output.replace(/(?:\r\n|\r|\n)/g, '<br />') : d.output);
        return "<strong>Input:</strong><br/><span style='color:cornflowerblue'>" + input + "</span><br/><br/>" +
            "<strong>Output:</strong><br/><span style='color:cornflowerblue'>" + output + "</span>";
    })
svg.call(tip);

// Per-type markers, as they don't inherit styles.
svg.append("defs").selectAll("marker")
    .data(["call","callChild", "returnCall", "returnDialog", "child"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");

var path = svg.append("g").selectAll("path")
    .data(force.links())
  .enter().append("path")
    .attr("class", function(d) { return "link " + d.type; })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .on("click", click)
    .on("dblclick", dblclick)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .call(force.drag);

// add the nodes
/*
var circle = node.append("circle")
    .attr("r", 5);
*/
var w = 200, h = 80;
var rect = node.append("rect")
    .attr("width", w)
    .attr("height", h)
    .attr("rx", 5)
    .attr("ry", 5)
    .style("fill", function(d) { return "white"; })
    .style("stroke", function(d) { return d3.rgb("#e6653e").darker(); })

// add the text 
var text = node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

var text2 = node.append("text")
    .attr("x", 7)
    .attr("dy", "1.5em")
    .text(function(d) { return "In: " + d.input; });

var text3 = node.append("text")
    .attr("x", 7)
    .attr("dy", "3em")
    .text(function(d) { return "Out: " + d.output; })
    .call(wrap, w);


// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
  path.attr("d", linkArc);
  rect.attr("transform", transform);
  text.attr("transform", transform);
  text2.attr("transform", transform);
  text3.attr("transform", transform);
}

function linkArc(d) {
    var x1 = d.source.x + w/2,
        y1 = d.source.y + h/2,
        x2 = d.target.x + w/2,
        y2 = d.target.y + h/2,
        dx = x2 - x1,
        dy = y2 - y1,
        dr = Math.sqrt(dx * dx + dy * dy),

        // Defaults for normal edge.
        drx = dr,
        dry = dr,
        xRotation = 0, // degrees
        largeArc = 0, // 1 or 0
        sweep = 1; // 1 or 0

    // Self edge.
    if ( x1 === x2 && y1 === y2 ) {
        // Fiddle with this angle to get loop oriented.
        xRotation = -45;

        // Needs to be 1.
        largeArc = 1;

        // Change sweep to change orientation of loop. 
        //sweep = 0;

        // Make drx and dry different to get an ellipse
        // instead of a circle.
        drx = 20;
        dry = 15;

        // For whatever reason the arc collapses to a point if the beginning
        // and ending points of the arc are the same, so kludge it.
        x2 = x2 + 1;
        y2 = y2 + 1;

        return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
    } 
    else {
        //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        
        // straight line
        var startx,starty,endx,endy;
        if (x1 < x2) {
            startx = x1 + w/2;
            endx = x2 - w/2;
        } else {
            startx = x1 - w/2;
            endx = x2 + w/2;
        }
        if (y1 < y2) {
            starty = y1 + h/2;
            endy = y2 - h/2;
        } else {
            starty = y1 - h/2;
            endy = y2 + h/2;
        }
        //return "M" + startx + "," + starty + "L" + endx + "," + endy;
        return "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
        //return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;

        // bezier-connected edges
        /*
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y;
        var qx = dy /  1 * 1, //linknum is defined above
            qy = -dx / 1 * 1;
        var qx1 = (d.source.x + (dx / 2)) + qx,
            qy1 = (d.source.y + (dy / 2)) + qy;
        return "M"+d.source.x+" "+d.source.y+" C" + d.source.x + " " + d.source.y + " " + qx1 + " " + qy1 + " " + d.target.x + " " + d.target.y;
        */

    }


}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function click(d) {
    input_box.text(JSON.stringify(d.dialog));
    console.log(d.dialog);

    d3.select(this).selectAll("text").transition()
        .duration(750)
        .attr("x", 22)
        //.style("fill", "steelblue")
        .style("font", "20px sans-serif");
    d3.select(this).select("rect").transition()
        .duration(750)
        .attr("width", w*2)
        .attr("height", h*2)
        .style("fill", "steelblue");
}

function dblclick(d) {
    input_box.text("");
    output_box.text("");

    d3.select(this).select("rect").transition()
        .duration(750)
        .attr("width", w)
        .attr("height", h)
        .style("fill", "white");
    d3.select(this).selectAll("text").transition()
        .duration(750)
        .attr("x", 12)
        .style("fill", "black")
        .style("font", "10px sans-serif");
}

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 5).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 5).attr("dy", lineHeight + "em").text(word);
            }
        }
    });
}
