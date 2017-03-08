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

// make nodes and links from dialogs
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

var width = 1900,
    height = 900,
    force, zoom, svg, input_box, output_box, tip, path, node, rect;

var w = 200, h = 120, rect_color = "aliceblue";

var text, line, text2, text3, line2;

d3.json("js/dialog.json", function(data) {
    var dialogs = [];
    console.log(data);
    dialogs = data;

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

    force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(300)
        .charge(-2500)
        .on("tick", tick)
        .start();

    zoom = d3.behavior.zoom()
        .scaleExtent([0.3, 10])
        .on("zoom", zoomed);

    svg = d3.select("canvas").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)
        .append('svg:g');

    force.drag().on("dragstart", function () {
        d3.event.sourceEvent.stopPropagation();
    });

    input_box = svg.append("text")
            .attr("x", 12)
            .attr("dy", "1.35em")
            .style("fill", "steelblue")
            .style("font", "10px sans-serif")
        ;
    output_box = svg.append("text")
            .attr("x", 12)
            .attr("dy", "2.35em")
            .style("fill", "steelblue")
            .style("font", "10px sans-serif")
        ;

//tooltip
    tip = d3.tip()
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
        .attr("refX", 10)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    path = svg.append("g").selectAll("path")
        .data(force.links())
        .enter().append("path")
        .attr("class", function(d) { return "link " + d.type; })
        .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

// define the nodes
    node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .on("click", click)
        .on("dblclick", dblclick)
        .call(force.drag);

// add the nodes
    /*
     var circle = node.append("circle")
     .attr("r", 5);
     */
    rect = node.append("rect")
        .attr("width", w)
        .attr("height", h)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", rect_color)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        //.attr("fill-opacity", 0.2)
        .style("stroke", function(d) { return d3.rgb("blue").darker(); })

// add the text
    text = node.append("text")
        .style("pointer-events", "none")
        .attr("x", 20)
        .attr("dy", "1.35em")
        .style("font-weight", "bold")
        .text(function(d) { return d.name; });

    line = node.append("line")
        .style("pointer-events", "none")
        .attr("x1", 0)
        .attr("y1", "18")
        .attr("x2", w)
        .attr("y2", "18")
        .attr("stroke-width", 1.2)
        .style("stroke", function(d) { return d3.rgb("blue").darker(); });

    text2 = node.append("text")
        .style("pointer-events", "none")
        .attr("x", 7)
        .attr("dy", "3em")
        .text(function(d) { return "In: " + d.input; })
        .call(wrap, w-30, 2);

    line2 = node.append("line")
        .style("pointer-events", "none")
        .attr("x1", 0)
        .attr("y1", "50")
        .attr("x2", w)
        .attr("y2", "50")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "0,2 1")
        .attr("stroke", "gray");

    text3 = node.append("text")
        .style("pointer-events", "none")
        .attr("x", 7)
        .attr("dy", "6.5em")
        .text(function(d) { return "Out: " + d.output; })
        .call(wrap, w-25, 5);

});

function zoomed() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
    force.start();
}

function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
    d3.select(this).classed("dragging", false);
}


// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
    path.attr("d", linkArc);
    rect.attr("transform", transform);
    line.attr("transform", transform);
    line2.attr("transform", transform);
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
        x1 -= w/2;
        x2 -= w/2;
        y2 -= h/2;

        return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
    } 
    else {
        //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        
        // straight line
        var startx = x1,
            starty = y1,
            endx = x2,
            endy = y2;
        if (Math.abs(y2-y1) < h+ h/2) {
            if (x1 < x2) {
                startx += w/2;
                endx -= w/2;
            } else {
                startx -= w/2;
                endx += w/2;
            }
        }
        else
        {
            if (y1 < y2) {
                starty += h/2;
                endy -= h/2;
            } else {
                starty -= h/2;
                endy += h/2;
            }
        }
        return "M" + startx + "," + starty + "L" + endx + "," + endy;
        //return "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
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
    //input_box.text(JSON.stringify(d.dialog));
    console.log(d.dialog);
    console.log(JSON.stringify((d.dialog)));

    /*
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
        */
}

function dblclick(d) {
    input_box.text("");
    output_box.text("");

    /*
    d3.select(this).select("rect").transition()
        .duration(750)
        .attr("width", w)
        .attr("height", h)
        .style("fill", rect_color);
    d3.select(this).selectAll("text").transition()
        .duration(750)
        .attr("x", 12)
        .style("fill", "black")
        .style("font", "10px sans-serif");
        */
}

function wrap(text, width, maxLine) {
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

        var linenum = 1;
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                if (++linenum > maxLine) {
                    tspan.text(line.join(" ") + "...");
                    return;
                }
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 5).attr("dy", lineHeight + "em").text(word);
            }
        }
    });
}

