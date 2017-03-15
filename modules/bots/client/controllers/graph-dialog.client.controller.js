'use strict';

// Bots controller
angular.module('bots').controller('GraphDialogController', ['$scope', '$rootScope', '$timeout', '$stateParams', 'fileResolve', 'BotFilesService',
  function ($scope, $rootScope, $timeout, $stateParams, file, BotFilesService) {
    var vm = this;
    // $scope.authentication = Authentication;

    var nodes = [];
    var links = [];

    // var currentDialog;
    var currentNode;
    $scope.$on('updateLog', function(event, arg0) {
      var index = $rootScope.logUpdated.indexOf('[DIALOG_SEL]');

      if(index != -1) {
        var json = $rootScope.logUpdated.substring('[DIALOG_SEL]'.length);

        console.log(json);
        currentNode = null;
        try {
          var dialog = JSON.parse(json);
          for(var i in nodes) {
            if(nodes[i].id == dialog.id) {
              currentNode = nodes[i];
              break;
            }
          }

          if(currentNode) {
            console.log(JSON.stringify(currentNode));
            update();
          }
        } catch(e) {
          console.log(e);
        }
      }
    });

// make nodes and links from dialogs

    var handleInput = function(input) {
      if(typeof input == 'String') return input;
      else if(input.types && input.types[0].name) {
        return '[타입] ' + input.types[0].name;
      } else if(input.if) {
        return '[조건] ' + input.if;
      } else {
        return input;
      }
    }

    var handlePrintOutput = function(output) {
      if (typeof output == 'String') return output;
      else if(Array.isArray(output)) {
        var _output = '';
        for(var i = 0; i < output.length; i++) {
          if(i != 0) _output += ', ';
          _output += handlePrintOutput(output[i]);
        }
        return _output;
      } else if(output.if) {
        return '[조건] ' + output.if;
      } else {
        return output;
      }
    };

    var num = 0;
    var handleDialog = function(dialog)
    {
      dialog.name = dialog.name || (dialog.name = "dialog" + ++num);
      nodes[dialog.name] = nodes[dialog.name] || (nodes[dialog.name] = { name: dialog.name });
      nodes[dialog.name].id  = dialog.id;
      nodes[dialog.name].input  = handleInput(dialog.input);
      nodes[dialog.name].output = handlePrintOutput(dialog.output);
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

    var width = document.getElementById('canvas').clientWidth;
    var height = document.getElementById('sidebar-left').clientHeight;

    // var width = 1900,
    //   height = 900,
    var  force, zoom, svg, tip, path, node, rect;

    var w = 200, h = 70;

    var text, line, text2, text3, line2, edgelabels;

    d3.json("/js/dialog.json2", function(data) {
      var dialogs = [];
      console.log(data);
      dialogs = data;

      dialogs.forEach(handleDialog); // for-loop is 10 times faster
      dialogs.forEach(handleLink);
      console.log(nodes);
      console.log(links);

      force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(400)
        .charge(-2500)
        .on("tick", tick)
        .start();

      zoom = d3.behavior.zoom()
        .scaleExtent([0.3, 10])
        .on("zoom", zoomed);

      svg = d3.select("#canvas").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)
        .append('svg:g');

      force.drag().on("dragstart", function () {
        d3.event.sourceEvent.stopPropagation();
      });

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

      edgelabels = svg.selectAll(".edgelabel")
          .data(force.links())
          .enter().append('text')
          .text(function(d) { return d.type; });

// define the nodes
      node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .on("click", click)
        .call(force.drag);

// add the nodes
      rect = node.append("rect")
        .attr("width", w)
        .attr("height", h)
        .attr("rx", 5)
        .attr("ry", 5)
        .style('fill', '#DADAEB')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

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
        // .attr("stroke-width", 1.2)
        .style("stroke", function(d) { return d3.rgb("#7CA4C0").darker(); });

      text2 = node.append("text")
        .style("pointer-events", "none")
        .attr("x", 7)
        .attr("dy", "3em")
        .text(function(d) { return "In: " + d.input; })
        .call(wrap, w-30, 1);

      line2 = node.append("line")
        .style("pointer-events", "none")
        .attr("x1", 0)
        .attr("y1", "37")
        .attr("x2", w)
        .attr("y2", "37")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "0,2 1")
        .attr("stroke", "gray");

      text3 = node.append("text")
        .style("pointer-events", "none")
        .attr("x", 7)
        .attr("dy", "5em")
        .text(function(d) { return "Out: " + d.output; })
        .call(wrap, w-25, 2);

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
      path.attr("d", diagonal);
        edgelabels
            .attr("x", function(d) {
                return ((d.source.x + w/2 + d.target.x + w/2 )/2);
            })
            .attr("y", function(d) {
                return ((d.source.y + h/2 + d.target.y + h/2 )/2);
            });
      rect.attr("transform", transform);
      line.attr("transform", transform);
      line2.attr("transform", transform);
      text.attr("transform", transform);
      text2.attr("transform", transform);
      text3.attr("transform", transform);
    }

      var diagonal = d3.svg.diagonal()
          .source(function(d) {
              var x1 = d.source.x + w/2,
                  y1 = d.source.y + h/2,
                  x2 = d.target.x + w/2,
                  y2 = d.target.y + h/2;
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
              return {"x": startx, "y": starty };
          })
          .target(function(d) {
              var x1 = d.source.x + w/2,
                  y1 = d.source.y + h/2,
                  x2 = d.target.x + w/2,
                  y2 = d.target.y + h/2;
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
              return {"x": endx, "y": endy};
          })
          .projection(function(d) { return [d.x, d.y]; });


    function transform(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }

    function click(d) {
        d3.event.stopPropagation();
        var dcx = (window.innerWidth/2-d.x*zoom.scale());
        var dcy = (window.innerHeight/2-d.y*zoom.scale());
        zoom.translate([dcx,dcy]);
        svg.transition().duration(700)
            .attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");

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
              line.pop();
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

    function update()
    {
      if(currentNode) {
        // d3.event.stopPropagation();
        var dcx = (width/2-currentNode.x*zoom.scale());
        var dcy = (height/2-(currentNode.y-h)*zoom.scale());
        zoom.translate([dcx,dcy]);
        svg.transition().duration(500)
          .attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");

        svg.append("rect")
          .attr("id", currentNode.name)
          .attr("x", currentNode.x)
          .attr("y", currentNode.y)
          .attr("width", w)
          .attr("height", h)
          .attr("rx", 5)
          .attr("ry", 5)
          .style('fill', 'black')
          .style('opacity', '0.3')

        setTimeout(function() {
          d3.select("#" + currentNode.name).remove();
        }, 1300);
      }
    }

  }]
);
