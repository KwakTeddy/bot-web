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
        nodes['나이'] = {name: '나이', isMain: true, isHighlighted: true};
        nodes['20살'] = {name: '20살', isMain: false, isHighlighted: true};
        nodes['취미'] = {name: '취미', isMain: false, isHighlighted: false};
        nodes['농구'] = {name: '농구', isMain: false, isHighlighted: false};

        var links = [
            {source: nodes['나이'], target: nodes['20살'], type:'child', kind:'이다'},
            {source: nodes['취미'], target: nodes['농구'], type:'child', kind:'이다'},
        ];

        var addLink = function(r) {
            if(nodes[r.node1] == undefined) nodes[r.node1] = {name: r.node1, isMain: false, isHighlighted: false};
            if(nodes[r.node2] == undefined) nodes[r.node2] = {name: r.node2, isMain: false, isHighlighted: false};

            links.push({source: nodes[r.node1], target: nodes[r.node2], type:'child', kind: r.link});

            console.log(JSON.stringify({source: nodes[r.node1], target: nodes[r.node2], type:'child', kind: r.link}));
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
            console.log(nodes);
            console.log(links);
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
                    var highLightedNodes = vm.best.split(' ');
                    // 이 노드 값들을 반짝이게 함
                    resetNodes();
                    for (var i=0; i < highLightedNodes.length; ++i)
                    {
                        nodes[highLightedNodes[i]].isHighlighted = true;
                    }
                }
                console.log(nodes);
                console.log(links);
                update();
            })
        });

        $scope.$on('onmsg', function(event, arg0) {
            var input = arg0.message;
            $resource('/api/user-bots-analytics/nlp', {}).get({input: input}, function(res) {
                if(res.result) {
                    var centeredNodes = res.result.split(' ');
                    // 이 노드 값들 가운데로 이동함
                }
                console.log(nodes);
                console.log(links);
                update();
            })
        });

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
                .classed('highlighted', function(d) { return d.isHighlighted;})
                .transition().duration(700)
                .style("opacity", function(d) { return d.isMain ? 1 : .9;})

            var g = circle.enter().append('svg:g');

            g.on("click", click)
                .call(force.drag);

            g.append("circle")
                .attr("r", radius)
                .attr("class", "node")
                .classed('highlighted', function(d) { return d.isHighlighted;})
                .transition().duration(700)
                .style("opacity", function(d) { return d.isMain ? 1 : .9;})


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

        // only respond once per keydown
        var lastKeyDown = -1;

        function keydown() {
            d3.event.preventDefault();

            if(lastKeyDown !== -1) return;
            lastKeyDown = d3.event.keyCode;

            switch(d3.event.keyCode) {
                case 8: // backspace

                    //test
                    var node = {name: '누구냐', isMain: false, isHighlighted: false};
                    node.x = 30;
                    node.y = 40;
                    nodes[node.name] = node;

                    break;
                case 46: // delete
                    nodes["나이"].isMain = !nodes["나이"].isMain;
                    break;

                case 66: // B
                    delete nodes["누구냐"];
                    break;
                case 76: // L
                    break;
                case 82: // R
                    break;
            }
            update();
        }

        function keyup() {
            lastKeyDown = -1;
        }

        d3.select(window)
            .on('keydown', keydown)
            .on('keyup', keyup);
        update();

    }]
);



