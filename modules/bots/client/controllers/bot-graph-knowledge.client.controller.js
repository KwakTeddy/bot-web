'use strict';

// Bots controller
angular.module('user-bots').controller('BotGraphKnowledgeController', ['$scope', '$rootScope', '$state', '$window',
'$timeout', '$stateParams', '$resource', '$document', '$cookies', 'Authentication', 'userBotResolve',
    function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, $document, $cookies, Authentication, userBot) {
      var vm = this;
      //vm.user = Authentication.user;
      vm.userId = $rootScope.userId;
      vm.userBot = userBot;

      //test
      vm.answer = "";
      vm.question = "";

      $rootScope.$broadcast('setUserBotAlways', userBot);

      vm.sendMsg = function() {
        $rootScope.$broadcast('sendMsgFromFarAway', vm.question);
        vm.question = '';
      };

      $rootScope.$broadcast('stopKeyDown');
      $document.bind("keydown", function (event) {
        $rootScope.$broadcast('keyinput', vm.question);
      });

      vm.closeGraph = function() {
        $rootScope.nograph = true;
      };

      vm.noGraph = function() {
        // need to set cookie
        $cookies.put("nograph","true");
        vm.closeGraph();
      };
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

      console.log(vm.userBot.id);
      $resource('/api/factLinks/findByBotId/:factUserID/:bot_id', {}).query({factUserID: vm.userId, bot_id: vm.userBot.id}, function(res) {
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

      var textTimer = null;
      var showText = function (target,message, index, interval) {
        if (index < message.length) {
          var char = message[index++];
          if (char == '\n')
            char = "<br>";
          $(target).append(char);
          textTimer = setTimeout(function () { showText(target,message, index, interval); }, interval);
        } else {
          textTimer = null;
        }
      };

      var main = document.getElementById('chat_main');
      var addItems = function(items) {
        var innerHTML =
          '<div class="chat-items owl-carousel owl-theme" style="clear: both">';

        for(var i in items) {
          innerHTML += '<div class="item" >' +
            '<div class="thumbnail">';
          if(items[i].imageUrl) innerHTML += '<img src="' + items[i].imageUrl + '" >';
          innerHTML += '<div class="caption">';
          if(items[i].title) innerHTML += '<h3>' + items[i].title + '</h3>';
          if(items[i].text) innerHTML += '<p>' + items[i].text + '</p>';
          innerHTML += '</div>';

          if(items[i].buttons) {
            for(var j in items[i].buttons) {
              innerHTML += '<div class="chat-item-button"><a href="' + items[i].buttons[j].url + '" target="_blank">' + items[i].buttons[j].text + '</a></div>';
            }
          }

          innerHTML += '</div></div>';
        }

        innerHTML += '</div>';

        main.innerHTML = '';
        main.innerHTML =  innerHTML;

        $('.chat-items').owlCarousel({
          loop:false,
          nav:false,
          margin: 0,
          items: 2
        });

        main.scrollTop = main.scrollHeight - main.clientHeight;
      };

      $scope.$on('onmsg', function(event, arg0) {
        if (arg0.message.items) {
          vm.isAnswer = false;
          addItems(arg0.message.items);
          return;
        }

        vm.isAnswer = true;
        var input='';
        if (typeof arg0.message === 'string')
          input = arg0.message;
        else {
          input = arg0.message.text;
        }


        $('#answer').text('');
        if (textTimer != null)
          clearTimeout(textTimer);
        showText('#answer', input, 0, 70);

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
      var height = document.getElementById('canvas').clientHeight;
      //var height = document.getElementById('sidebar-left').clientHeight;

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
        .attr("class", "graph-svg-component")
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
        if (!path) return;

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



