'use strict';

// Bots controller
angular.module('bots').controller('GraphKnowledgeController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams', '$resource',
    function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, Authentication) {
        var vm = this;
        //vm.user = Authentication.user;
        vm.userId = $rootScope.userId;

        // if(vm.userBot && vm.userBot._id)
        //   $rootScope.$broadcast('setUserBot', vm.userBot);

        /*
        vm.type = '';
        if($state.is('user-bots-web.create')) {vm.state = 'create'; vm.type = 'edit';}
        else if($state.is('user-bots-web.edit')) {vm.state = 'edit'; vm.type = 'edit';}
        else if($state.is('user-bots-web.view')) {vm.state = 'view'; vm.type = 'view';}

        vm.changeType = function(type) {
            vm.type= type;
        };
        */

        console.log('KnowledgeGrpah Controller');

        var nodes = [];
        var links = [];

        var addLink = function(r) {
            if(nodes[r.node1] == undefined) nodes[r.node1] = {name: r.node1, isMain: false, isHighlighted: false, count: 0};
            if(nodes[r.node2] == undefined) nodes[r.node2] = {name: r.node2, isMain: false, isHighlighted: false, count: 0};

            links.push({source: nodes[r.node1], target: nodes[r.node2], type:'child', kind: r.link});

            nodes[r.node1].count++;
            nodes[r.node2].count++;

            console.log(JSON.stringify({source: nodes[r.node1], target: nodes[r.node2], type:'child', kind: r.link}));
        };

        var resetNodes = function()
        {
            for (var key in nodes) {
                nodes[key].isHighlighted = false;
                nodes[key].isMain = false;
            }
        };

        $resource('/api/factLinks/find/:factUserID', {}).query({factUserID: vm.userId}, function(res) {
            for(var i = 0; i < res.length; i++) {
                addLink(res[i]);
            }
            console.log(nodes);
            console.log(links);
            update();
        });

        $scope.$on('updateLog', function(event, arg0) {
            var index = $rootScope.logUpdated.indexOf('[FACT_ADD]');

            if(index != -1) {
                var json = $rootScope.logUpdated.substring('[FACT_ADD]'.length);

                try {
                    addLink(JSON.parse(json));
                } catch(e) {
                    console.log(e);
                }
            }
            update();
        });

      var timer = null, timer2 = null, timer3 = null;
      $scope.$on('keyinput', function(event, arg0) {
        if(timer == null) {
          timer = setTimeout(function () {
            var input = arg0;
            $resource('/api/user-bots-analytics/nlp', {}).get({input: input}, function (res) {

                resetNodes();
                if (res.result != undefined) {
                  var highLightedNodes = res.result.split(' ');
                  // 이 노드 값들을 반짝이게 함
                  if (highLightedNodes != undefined) {
                    console.log(highLightedNodes);
                    for (var i = 0; i < highLightedNodes.length; ++i) {
                      if (nodes[highLightedNodes[i]] != undefined) {
                        nodes[highLightedNodes[i]].isHighlighted = true;
                        console.log(JSON.stringify(nodes[highLightedNodes[i]]));
                      }
                    }
                  }
                }
                update();

                if(timer2 == null) {
                  timer2 = setTimeout(function () {
                    resetNodes();
                    update();
                    timer2 = null;
                  }, 3000);
                }

              timer = null;
            })
          }, 100);
        }
      });

        $scope.$on('onmsg', function(event, arg0) {
            var input = arg0.message;
            resetNodes();
            $resource('/api/user-bots-analytics/nlp', {}).get({input: input}, function(res) {
                if(res.result) {
                    var centeredNodes = res.result.split(' ');
                    // 이 노드 값들 가운데로 이동함
                    if (centeredNodes != undefined) {
                        for (var i=0; i < centeredNodes.length; ++i) {
                            if (nodes[centeredNodes[i]] != undefined) {
                                nodes[centeredNodes[i]].isMain = true;
                                nodes[centeredNodes[i]].x = width / 2;
                                nodes[centeredNodes[i]].y = height / 2;
                                console.log(JSON.stringify(nodes[centeredNodes[i]]));
                                break;
                            }
                        }
                    }
                }
            });
            update();
            if (timer3 == null) {
                timer3 = setTimeout(function() { resetNodes(); update(); timer3 = null; }, 3000);
            }
        });

        var width = document.getElementById('canvas').clientWidth;
        var height = document.getElementById('sidebar-left').clientHeight;

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(100)
            .charge(-300)
          // .linkDistance(300)
          // .charge(-700)
            .on("tick", tick)

        var zoom = d3.behavior.zoom()
            .scaleExtent([0.3, 10])
            .on("zoom", zoomed);

        var svg = d3.select("#canvas").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom)
            .append('svg:g');

        var path = svg.append('svg:g').selectAll('path'),
            circle = svg.append('svg:g').selectAll('g'),
            edgelabels = svg.selectAll(".edgelabel");

        force.drag().on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); });

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

        function zoomed() {
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

// Per-type markers, as they don't inherit styles.
        var radius = 30;

        function linkArc(d) {
            return "M" + d.source.x+ "," + d.source.y+ "L" + d.target.x + "," + d.target.y;
        }

// Use elliptical arc path segments to doubly-encode directionality.
        function tick() {
            path.attr("d", linkArc);
            circle.attr("transform", transform);
            edgelabels
                .attr("x", function(d) {
                    return ((d.source.x + d.target.x)/2);
                })
                .attr("y", function(d) {
                    return ((d.source.y + d.target.y)/2);
                });
        }

        function transform(d) {
            if (d.isMain) {
                d.x = width / 2;
                d.y = height / 2;
            }
            return "translate(" + d.x + "," + d.y + ")";
        }

        function click(d) {
            /*
            d.isHighlighted = !d.isHighlighted;
            console.log(d);

            update();
            */
        }

        var mainColor = "lightblue";
        var highlightedColor = "pink";

        var colors = d3.scale.category20c(d3.range(0,20));
        function fillCircle(d)
        {
            if (d.isMain) {
                return mainColor;
            }
            else if (d.isHighlighted) {
                return highlightedColor;
            }
            else {
              var len = d.name.length;
              return colors(len % 5);
            }
        }

      function radiusCircle(d)
      {
        if (d.isMain) {
          return radius*3;
        }
        else if (d.isHighlighted) {
          return radius*2;
        }
        else {
          if(d.count < 10) return 10.0 + radius * (d.count/10.0);
          else return radius;
        }
      }

      function update()
        {
            path = path.data(links);

            // add new links
            path.enter().append("path")
                .attr("class", function(d) { return "link " + d.type; })

            // remove old links
            path.exit().remove();

/*
            edgelabels = edgelabels.data(links);
            // add new edge labels;
            edgelabels.enter().append('text')
                .style("pointer-events", "none")
                .text(function(d) { return d.kind; });

            // remove old edge labels;
            edgelabels.exit().remove();
*/

            circle = circle.data(d3.values(nodes));

            // update existing nodes
            circle.selectAll('circle')
                .transition().duration(700)
                .attr("r", radiusCircle)
                .style("fill", fillCircle);

            var g = circle.enter().append('svg:g');

            g.on("click", click)
                .call(force.drag);

            g.append("circle")
                .attr("r", radiusCircle)
                .attr("class", "node")
                .transition().duration(700)
                .style("fill", fillCircle);


            g.append("text")
                .attr("x", 0)
                .attr("y", 0)
                .style("text-anchor","middle")
                .style("alignment-baseline","middle")
                .style("font-weight", "bold")
                .style("pointer-events", "none")
                .text(function(d) { return d.name; });

            // remove old nodes
            circle.exit().remove();

            // set the graph in motion
            force.nodes(d3.values(nodes))
                .links(links)
                .start();
        }
        update();

    }]
);



