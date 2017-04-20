'use strict';

// Bots controller
angular.module('bots').controller('DialogTreeController', ['$scope', '$rootScope', '$state', '$window','$timeout',
'$stateParams', '$resource', 'Dialogs',
  function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, Dialogs) {
    var vm = this;
    vm.userId = $rootScope.userId;
    vm.bot_id = $stateParams.botId;
    vm.file_id = $stateParams.fileId;

    console.log('Tree Controller');

    var links_internal = [];
    var nodes = [];
    var links = [];
    var dialogs;

    // var currentDialog;
    var currentNode;
    var selectedNode;
    var selectedSVG;

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
            //console.log(JSON.stringify(currentNode));
            update(currentNode);
            centerNode(currentNode);
          }
        } catch(e) {
          console.log(e);
        }
      }
    });

    // dialog editing
    $scope.addInput = function() {
      $scope.dialog.inputs.push({str:""});
    };
    $scope.addOutput= function() {
      $scope.dialog.outputs.push({str:""});
    };

    $scope.searchNode = function() {
      //find the node
      var selectedVal = document.getElementById('search').value;
      var node = baseSvg.selectAll(".node");
      if (selectedVal != "") {
        var selected = node.filter(function (d, i) {
          return d.name === selectedVal;
        });
        if(selected && selected.length == 1) {
          currentNode = selected[0][0].__data__;
          //console.log(JSON.stringify(currentNode));
          update(currentNode);
          centerNode(currentNode);
        }
      }
    };

    var makeStr = function(obj) {
      if (Array.isArray(obj)) {
        return obj.map(function (o) { return {str: o}; });
      }
      return [{str: obj}];
    };

    var unMake = function(obj) {
      if (Array.isArray(obj)) {
        return obj.map(function (o) { return o['str']; });
      }
    };

    $scope.findOne = function (dialogId) {
      $scope.dialog = { botId: vm.botId, dialogId: dialogId };

      var dialog = Dialogs.get({
        botId: vm.botId,
        dialogId: dialogId
      }, function() {
        $scope.dialog.name = dialog.name;
        $scope.dialog.inputs = makeStr(dialog.inputs);
        $scope.dialog.outputs = makeStr(dialog.outputs);
        $('.modal-with-form').click();
      });
    };

    $scope.update = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'dialogForm');
        return false;
      }
      var dialog = $scope.dialog;
      dialog.inputs = unMake($scope.dialog.inputs);
      dialog.outputs = unMake($scope.dialog.outputs);
      console.log(JSON.stringify((dialog)));

      Dialogs.update(dialog);
    };

    // make nodes and links_internal from dialogs
    var handleInput = function(input) {
      if(typeof input == 'string') return input;
      else if(input.types && input.types[0].name) {
        return '[타입] ' + input.types[0].name;
      } else if(input.if) {
        return '[조건] ' + input.if;
      } else {
        return input;
      }
    };

    var handlePrintOutput = function(output) {
      if (typeof output == 'string') return output;
      else if(Array.isArray(output)) {
        var _output = '';
        for(var i = 0; i < output.length; i++) {
          if(i !== 0) _output += ', ';
          _output += handlePrintOutput(output[i]);
        }
        return _output;
      } else if(output.if) {
        return '[조건] ' + output.if;
      } else {
        return output;
      }
    };

    var handleDialog = function(dialog)
    {
      dialog.name = dialog.name || (dialog.name = "dialog" + "_" + dialog.id);
      nodes[dialog.name] = nodes[dialog.name] || (nodes[dialog.name] = dialog);
      nodes[dialog.name].input_text  = handleInput(dialog.input);
      nodes[dialog.name].output_text = handlePrintOutput(dialog.output);

      if (dialog.children) {
        dialog.children.forEach(function(child) {
          handleDialog(child);
        });
      }
    };

    var handleOutput = function(dialog, output) {
      if (output.output) {
        handleOutput(dialog, output.output);
      }
      if (output.options) {
        if (output.options.returnDialog) {
          if (nodes[output.options.returnDialog]) {
            output.options.returnDialog = undefined;
          } else {
            links_internal.push({source: nodes[dialog.name], target: nodes[output.options.returnDialog], type: "returnDialog"});
          }
        }
      }

      if (output.call) {
        if (nodes[output.call]) {
          links_internal.push({source: nodes[dialog.name], target: nodes[output.call], type: "call"});
        } else {
          output.call = undefined;
        }
      }
      if (output.callChild) {
        if (nodes[output.callChild]) {
          links_internal.push({source: nodes[dialog.name], target: nodes[output.callChild], type: "callChild"});
        } else {
          output.callChild = undefined;
        }
      }
      if (output.returnCall) {
        if (nodes[output.returnCall]) {
          links_internal.push({source: nodes[dialog.name], target: nodes[output.returnCall], type: "returnCall"});
        } else {
          output.returnCall = undefined;
        }
      }
    };

    var handleLink = function(dialog)
    {
      if (dialog.children) {
        dialog.children.forEach(function(child) {
          handleLink(child);
          if (nodes[child.name] ) {
            // child relationship is already included in links created by tree
            //links_internal.push({source: nodes[dialog.name], target: nodes[child.name], type: "child"});
          } else {
            console.log("undefined=" + dialog.name + ".child=" + child.name);
          }
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

    var treeData = {name: '시작', children: []};

    $resource('/api/dialogs/:bot_id/:file_id', {}).get({bot_id: vm.bot_id, file_id: vm.file_id}, function(res) {
      vm.botId = res.botId;
      vm.fileId = res.fileId;
      dialogs = res.data;
      for (var i = 0; i < dialogs.length; i++) {
        var d = dialogs[i];
        d.name = d.name || (d.name = "dialog_" + d.id);
        treeData.children.push(d);
      }
      treeData.children.forEach(function (d) {
        if (d.children) {
          d.children.forEach(function (e) {
            //collapse(e);
          });
        }
      });

      dialogs.forEach(handleDialog); // for-loop is 10 times faster
      dialogs.forEach(handleLink);
      console.log(nodes);
      console.log(links_internal);

      init();
    });

    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;

    // panning variables
    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    var viewerWidth = document.getElementById('tree-container').clientWidth;
    var viewerHeight = document.getElementById('sidebar-left').clientHeight;

    // size of rect
    var rectW = 220, rectH = 100;
    // height for one node
    var itemHeight = rectH+100;
    // width for one depth
    var labelWidth = 350;

    var tree = d3.layout.tree()
      .size([viewerHeight, viewerWidth]);

    // A recursive helper function for performing some setup by walking through all nodes
    function visit(parent, visitFn, childrenFn) {
      if (!parent) return;

      visitFn(parent);

      var children = childrenFn(parent);
      if (children) {
        var count = children.length;
        for (var i = 0; i < count; i++) {
          visit(children[i], visitFn, childrenFn);
        }
      }
    }

    // Define the zoom function for the zoomable tree
    function zoom() {
      svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#tree-container").append("svg")
      .attr("width", viewerWidth)
      .attr("height", viewerHeight)
      .attr("class", "overlay graph-svg-component")
      .call(zoomListener);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var input_text = (typeof d.input_text == 'string' ? d.input_text.replace(/(?:\r\n|\r|\n)/g, '<br />') : d.input_text);
        var output_text = (typeof d.output_text == 'string' ? d.output_text.replace(/(?:\r\n|\r|\n)/g, '<br />') : d.output_text);
        return "<strong>Input:</strong><br/><span style='color:cornflowerblue'>" + input_text + "</span><br/><br/>" +
          "<strong>Output:</strong><br/><span style='color:cornflowerblue'>" + output_text + "</span>";
      });
    baseSvg.call(tip);

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

    var init = function() {
      // Define the root
      root = treeData;
      root.x0 = viewerHeight / 2;
      root.y0 = 0;

      // Call visit function to establish maxLabelLength
      visit(treeData, function (d) {
        totalNodes++;
        if (d.name != undefined)
          maxLabelLength = Math.max(d.name.length, maxLabelLength);

      }, function (d) {
        return d.children && d.children.length > 0 ? d.children : null;
      });

      // Layout the tree initially and center on the root node.
      update(root);
      centerNode(root, true);
    };

    var links_SVG, links_internal_SVG;

    function update(source) {
      tip.hide();
      // Compute the new height, function counts total children of root node and sets tree height accordingly.
      // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
      // This makes the layout more consistent.
      var levelWidth = [1];
      var childCount = function (level, n) {

        if (n.children && n.children.length > 0) {
          if (levelWidth.length <= level + 1) levelWidth.push(0);

          levelWidth[level + 1] += n.children.length;
          n.children.forEach(function (d) {
            childCount(level + 1, d);
          });
        }
      };
      childCount(0, root);
      var newHeight = d3.max(levelWidth) * itemHeight;
      tree = tree.size([newHeight, viewerWidth]);

      // Compute the new tree layout.
      var nodes_tree = tree.nodes(root).reverse();
      var links = tree.links(nodes_tree);


      // Set widths between levels based on maxLabelLength.
      nodes_tree.forEach(function (d) {
        //d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
        d.y = (d.depth * labelWidth); //maxLabelLength * 10px
        // alternatively to keep a fixed scale one can set a fixed depth per level
        // Normalize for fixed-depth by commenting out below line
        // d.y = (d.depth * 500); //500px per level.
      });

      // var layout = function(node) {
      //   if (node.parent != null) {
      //     node.x = node.parent.x + itemHeight * node.parent.children.indexOf(node);
      //   }
      //   if (node.children) {
      //     node.children.forEach(layout);
      //   }
      // };
      // treeData.children.forEach(layout);

      // Update the nodes…
      var node = svgGroup.selectAll("g.node")
        .data(nodes_tree, function (d) {
          return d.id || (d.id = ++i);
        });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

      nodeEnter.append("rect")
        .attr('class', 'nodeRect')
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("rx", 5)
        .attr("ry", 5)
        .style('fill', '#DADAEB')
        // .attr("stroke-width", 2)
        // .style("stroke", function (d) {
        //   return d._children ? "lightsteelblue" : "#fff";
        // })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

      // add the text
      var text = nodeEnter.append("text")
        .attr("class","nodetext nodetitle")
        .style("pointer-events", "none")
        .attr("x", "1em")
        .attr("dy", "1.30em")
        .text(function(d) { return d.name; });

      var line = nodeEnter.append("line")
        .style("pointer-events", "none")
        .attr("x1", 0)
        .attr("y1", "18")
        .attr("x2", rectW)
        .attr("y2", "18")
        // .attr("stroke-width", 1.2)
        .style("stroke", function(d) { return d3.rgb("#7CA4C0").darker(); });

      var text2 = nodeEnter.append("text")
        .attr("class","nodetext")
        .style("pointer-events", "none")
        .attr("x", 7)
        .attr("dy", "3em")
        .text(function(d) { return "In: " + (d.input_text ? d.input_text: ""); })
        .call(wrap, rectW-30, 1);

      var line2 = nodeEnter.append("line")
        .style("pointer-events", "none")
        .attr("x1", 0)
        .attr("y1", "2.7em")
        .attr("x2", rectW)
        .attr("y2", "2.7em")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "0,2 1")
        .attr("stroke", "gray");

      var text3 = nodeEnter.append("text")
        .attr("class","nodetext")
        .style("pointer-events", "none")
        .attr("x", 7)
        .attr("dy", "5em")
        .text(function(d) { return "Task: " + (d.task ? d.task : ""); })
        .call(wrap, rectW-25, 2);

      var line2 = nodeEnter.append("line")
        .style("pointer-events", "none")
        .attr("x1", 0)
        .attr("y1", "4.3em")
        .attr("x2", rectW)
        .attr("y2", "4.3em")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "0,2 1")
        .attr("stroke", "gray");

      var text4 = nodeEnter.append("text")
        .attr("class","nodetext")
        .style("pointer-events", "none")
        .attr("x", 7)
        .attr("dy", "7em")
        .text(function(d) { return "Out: " + (d.output_text ? d.output_text : ""); })
        .call(wrap, rectW-25, 2);

      // Change the rect fill depending on whether it has children and is collapsed
      // node.select("rect.nodeRect")
      //   .style("stroke", function (d) {
      //     return d._children ? "lightsteelblue" : "#fff";
      //   });

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      // Fade the text in
      nodeUpdate.select("text")
        .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

      nodeExit.select("circle")
        .attr("r", 0);

      nodeExit.select("text")
        .style("fill-opacity", 0);

      // Update the links…
      var drawLink = function(link, linkArray, className, diag) {
        link = svgGroup.selectAll("path." + className)
          .data(linkArray, function (d) {
            return d.source.id + d.target.id + d.type;
          });
        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
          .attr("class", function(d) { return className + " " + d.type; })
          .attr("x", rectW /2 )
          .attr("y", rectH /2)
          .attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
          .attr("d", function (d) {
            var o = {
              x: source.x0,
              y: source.y0,
            };
            return diag({
              source: o,
              target: o
            });
          });

        // Transition links to their new position.
        link.transition()
          .duration(duration)
          .attr("d", diag);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
          .duration(duration)
          .attr("d", function (d) {
            var o = {
              x: source.x,
              y: source.y
            };
            return diag({
              source: o,
              target: o
            });
          })
          .remove();
      };
      // define a d3 diagonal projection for use by the node paths later on.
      var diagonal = d3.svg.diagonal()
        .source(function(d) {
          var source_y = d.source.y;
          if (d.source.y < d.target.y) {
            source_y += rectW;
          } else if (d.source.y === d.target.y) {
            source_y += rectW;
          }
          return {"x": d.source.x + rectH/2, "y": source_y };
        })
        .target(function(d) {
          var target_y = d.target.y;
          if (d.source.y > d.target.y) {
            target_y += rectW;
          } else if (d.source.y === d.target.y) {
            target_y += rectW;
          }
          return {"x": d.target.x + rectH/2, "y": target_y };
        })
        .projection(function (d) {
          return [d.y, d.x];
        });
      drawLink(links_SVG, links, "link", diagonal);

      // Per-type markers, as they don't inherit styles.
      baseSvg.append("defs").selectAll("marker")
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

      // define a d3 diagonal projection for use by the node paths later on.
      drawLink(links_internal_SVG, links_internal, "link_internal", diagonal);

      // var edgelabels = svgGroup.selectAll(".edgelabel")
      //   .data(links_internal)
      //   .enter().append('text')
      //   .text(function(d) { return d.type; })
      //   .attr("x", function(d) {
      //     return ((d.source.x + rectW/2 + d.target.x + rectW/2 )/2);
      //   })
      //   .attr("y", function(d) {
      //     return ((d.source.y + rectH/2 + d.target.y + rectH/2 )/2);
      //   });

      // Stash the old positions for transition.
      nodes_tree.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      if(currentNode) {
        // draw selector
        svgGroup.append("rect")
          .attr("id", currentNode.name)
          .attr("x", currentNode.y)
          .attr("y", currentNode.x)
          .attr("width", rectW)
          .attr("height", rectH)
          .attr("rx", 5)
          .attr("ry", 5)
          .style("pointer-events", "none")
          .style('fill', 'black')
          .style('opacity', '0.3');
        setTimeout(function () {
          d3.select("#" + currentNode.name).remove();
        }, 1300);
      }

      if(selectedNode) {
        // draw selector
        d3.select("#selected").remove();
        d3.selectAll(".icon").remove();

        var rect = selectedSVG.append("rect")
          .attr("class", "selectedRect")
          .attr("id", "selected")
          .attr("y", -25)
          .attr("width", rectW)
          .attr("height", rectH+25)
          .attr("rx", 5)
          .attr("ry", 5);
        var t1 = selectedSVG.append('text')
          .on("click", edit)
          .attr("class", "icon")
          .attr("x", rectW-25*4)
          .attr("y", -4)
          .text(function(d) { return '\uf044';} );
        var t1 = selectedSVG.append('text')
          .on("click", addChild)
          .attr("class", "icon")
          .attr("x", rectW-25*3)
          .attr("y", -4)
          .text(function(d) { return '\uf067';} );
        var t1 = selectedSVG.append('text')
          .on("click", deleteNode)
          .attr("class", "icon")
          .attr("x", rectW-25*2)
          .attr("y", -5)
          .text(function(d) { return '\uf00d';} );
        var t2 = selectedSVG.append('text')
          .on("click", toggleChildren)
          .attr("class", "icon")
          .attr("x", rectW-25)
          .attr("y", -4)
          .text(function(d) { if (d.children) return '\uf053'; else return '\uf054';} );


      } else {
        d3.select("#selected").remove();
        d3.selectAll(".icon").remove();
      }
    }

    // node interactions

    // Toggle children on click.
    function click(d) {
      if (d3.event.defaultPrevented) return; // click suppressed
      selectedNode = d;
      selectedSVG = d3.select(this);
      update(d);
      centerNode(d);
    }

    function toggleAndCenter(d) {
      d = toggleChildren(d);
      update(d);
      centerNode(d);
    }

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
    function centerNode(source, isStart) {
      var scale = zoomListener.scale();
      var x = -source.y0;
      if (isStart != undefined) x -= 300;
      var y = -source.x0 - 200;
      x = x * scale + viewerWidth / 2;
      y = y * scale + viewerHeight / 2;
      d3.select('g').transition()
        .duration(duration)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
      zoomListener.scale(scale);
      zoomListener.translate([x, y]);
    }

    function addChild(d) {
      d3.event.stopPropagation();
    }

    function initSelect() {
      selectedNode = undefined;
      selectedSVG = undefined;
    }

    function deleteNode(d) {
      d3.event.stopPropagation();
      initSelect();

      if (d.parent && d.parent.children) {
        for (var i=0; i < d.parent.children.length; ++i) {
          if (d.parent.children[i].id === d.id) {
            d.parent.children.splice(i,1);
            break;
          }
        }
      }
      // TODO: need to update source and target in other links
      nodes = [];
      links_internal = [];
      dialogs.forEach(handleDialog);
      dialogs.forEach(handleLink);
      // TODO: if undo might be possible,
      //delete_int(d);
      update(treeData);
    }

    function delete_int(d) {
      d.deleted = true;
      if (d.children) {
        d._children = d.children;
        d._children.forEach(delete_int);
        d.children = null;
      }
    }

    function edit(d) {
      d3.event.stopPropagation();
      angular.element(document.getElementById('control')).scope().findOne(d.id);
    }

    // Helper functions for collapsing and expanding nodes.
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function expand(d) {
      if (d._children) {
        d.children = d._children;
        d.children.forEach(expand);
        d._children = null;
      }
    }

    // Toggle children function
    function toggleChildren(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else if (d._children) {
        d.children = d._children;
        d._children = null;
      }
      return d;
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

    // TODO: Pan function, can be better implemented.
    var panTimer;
    function pan(domNode, direction) {
      var speed = panSpeed;
      if (panTimer) {
        clearTimeout(panTimer);
        var translateCoords = d3.transform(svgGroup.attr("transform"));
        var translateX, translateY;
        if (direction == 'left' || direction == 'right') {
          translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
          translateY = translateCoords.translate[1];
        } else if (direction == 'up' || direction == 'down') {
          translateX = translateCoords.translate[0];
          translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
        }
        var scaleX = translateCoords.scale[0];
        var scaleY = translateCoords.scale[1];
        var scale = zoomListener.scale();
        svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
        d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
        zoomListener.scale(zoomListener.scale());
        zoomListener.translate([translateX, translateY]);
        panTimer = setTimeout(function () {
          pan(domNode, speed, direction);
        }, 50);
      }
    }

  }]
);



