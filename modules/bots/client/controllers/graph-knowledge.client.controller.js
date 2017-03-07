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
            if(nodes[r.node1] == undefined) nodes[r.node1] = {name: r.node1, isMain: false, isHighlighted: false};
            if(nodes[r.node2] == undefined) nodes[r.node2] = {name: r.node2, isMain: false, isHighlighted: false};

            links.push({source: nodes[r.node1], target: nodes[r.node2], type:'child', kind: r.link});

            console.log(JSON.stringify({source: nodes[r.node1], target: nodes[r.node2], type:'child', kind: r.link}));
        };

        var resetNodes = function()
        {
            for (var i=0; i < nodes.length; ++i) {
                nodes[i].isHighlighted = false;
                nodes[i].isMain = false;
            }
        }
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

        $scope.$on('keyinput', function(event, arg0) {
            var input = arg0;
            $resource('/api/user-bots-analytics/context', {}).get({input: input}, function(res) {
                vm.best;
                if(res.result && res.result.length > 0) vm.best = res.result[0];
                else vm.best = undefined;

                // console.log(res.result);
                if(vm.best != undefined) {
                    var highLightedNodes = vm.best.input.split(' ');
                    // 이 노드 값들을 반짝이게 함
                    if (highLightedNodes != undefined) {
                        resetNodes();
                        console.log(highLightedNodes);
                        for (var i=0; i < highLightedNodes.length; ++i) {
                            if (nodes[highLightedNodes[i]] != undefined) {
                                nodes[highLightedNodes[i]].isHighlighted = true;
                                console.log(JSON.stringify(nodes[highLightedNodes[i]]));
                            }
                        }
                        update();
                    }
                }
            })
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
                            }
                        }
                    }
                }
            });
            update();
        });

        var width = document.getElementById('canvas').clientWidth;
        var height = document.getElementById('sidebar-left').clientHeight;

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(300)
            .charge(-700)
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

        var diagonal = d3.svg.diagonal()
            .source(function(d) {
                if (d.source.isMain) {
                    return {"x": width /2, "y": height/2 };
                }
                return {"x": d.source.x, "y": d.source.y };
            })
            .target(function(d) {
                if (d.target.isMain) {
                    return {"x": width /2, "y": height/2 };
                }
                return {"x": d.target.x, "y": d.target.y };
            })
            .projection(function(d) { return [d.x, d.y]; });


// Use elliptical arc path segments to doubly-encode directionality.
        function tick() {
            path.attr("d", diagonal);
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
            d.isHighlighted = !d.isHighlighted;
            console.log(d);

            update();
        }

        var mainColor = "lightblue";
        var highlightedColor = "pink";

        function update()
        {
            path = path.data(links);

            // add new links
            path.enter().append("path")
                .attr("class", function(d) { return "link " + d.type; })

            // remove old links
            path.exit().remove();

            edgelabels = edgelabels.data(links);
            // add new edge labels;
            edgelabels.enter().append('text')
                .style("pointer-events", "none")
                .text(function(d) { return d.kind; });

            // remove old edge labels;
            edgelabels.exit().remove();

            circle = circle.data(d3.values(nodes));

            // update existing nodes
            circle.selectAll('circle')
                .transition().duration(700)
                .style("fill", function(d) {
                    if (d.isMain) {
                        return mainColor;
                    }
                    else if (d.isHighlighted) {
                        return highlightedColor;
                    }
                });

            var g = circle.enter().append('svg:g');

            g.on("click", click)
                .call(force.drag);

            g.append("circle")
                .attr("r", radius)
                .attr("class", "node")
                .transition().duration(700)
                .style("fill", function(d) {
                    if (d.isMain) {
                        return mainColor;
                    }
                    else if (d.isHighlighted) {
                        return highlightedColor;
                    }
                });


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



