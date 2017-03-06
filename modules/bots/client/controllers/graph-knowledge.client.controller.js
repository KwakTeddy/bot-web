'use strict';

// Bots controller
angular.module('bots').controller('GraphKnowledgeController', ['$scope', '$timeout', '$stateParams',
  function ($scope, $timeout, $stateParams) {
    var vm = this;
    // $scope.authentication = Authentication;

    console.log('GraphDialogController');


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
      .charge(-2500)
      .on("tick", tick)
      .start();

    var zoom = d3.behavior.zoom()
      .scaleExtent([0.3, 10])
      .on("zoom", zoomed);

    var svg = d3.select("#canvas").append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom)
      .append('svg:g');

    force.drag().on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); });

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
      .attr("refX", 10)
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
      .call(force.drag);

// add the nodes
    /*
     var circle = node.append("circle")
     .attr("r", 5);
     */
    var w = 200, h = 100, rect_color = "aliceblue";
    var rect = node.append("rect")
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
    var text = node.append("text")
      .attr("x", 20)
      .attr("dy", "1.35em")
      .style("font-weight", "bold")
      .text(function(d) { return d.name; });

    var line = node.append("line")
      .attr("x1", 0)
      .attr("y1", "18")
      .attr("x2", w)
      .attr("y2", "18")
      .attr("stroke-width", 1.2)
      .style("stroke", function(d) { return d3.rgb("blue").darker(); });

    var text2 = node.append("text")
      .attr("x", 7)
      .attr("dy", "3em")
      .text(function(d) { return "In: " + d.input; });

    var line2 = node.append("line")
      .attr("x1", 0)
      .attr("y1", "37")
      .attr("x2", w)
      .attr("y2", "37")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "0,2 1")
      .attr("stroke", "gray");

    var text3 = node.append("text")
      .attr("x", 7)
      .attr("dy", "5em")
      .text(function(d) { return "Out: " + d.output; })
      .call(wrap, w);


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
      input_box.text(JSON.stringify(d.dialog));
      console.log(d.dialog);

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




  }]
);


var dialogs =
  [
    {
      input: {
        types: [{name: 'address', typeCheck: 'address.addressTypeCheck2', raw: true}],
        regexp: /~서비스센터/
      },
      output: {callChild: '위치찾기'}
    },
    {
      name: '위치찾기',
      input: '~서비스센터',
      output: '현재 계신 지역을 말씀해 주세요.\n예시)\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60-3\n3.도로명주소: 금천구 디지털로9길 68\n4.건물명: 조은아트빌',
      children: [
        {
          input: {types: [{name: 'address', typeCheck: 'address.addressTypeCheck2', raw: true}]},
          output: [
            {
              if: '!Array.isArray(context.dialog.address)',
              output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?',
              children: [
                {
                  input: '~네',
                  output: {call: '서비스센터정보'}
                },
                {
                  input: {if: 'true'},
                  output: {up: 1}
                }
              ]
            },
            {
              if: 'Array.isArray(context.dialog.address)',
              output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#',
              children: [
                {
                  input: {
                    types: [{
                      name: 'address',
                      listName: 'address',
                      typeCheck: 'listTypeCheck'
                    }]
                  },
                  output: {call: '서비스센터정보'}
                },
                {
                  input: {if: 'true'},
                  output: {up: 1}
                }
              ]
            }]
        },
        {
          input: {if: 'true'},
          output: {repeat: 1, options: {output: '지역을 찾을 수 없습니다. 동명을 말씀해주세요.'}}
        }
      ]
    },
    {
      name: '서비스센터정보',
      input: false,
      task: 'lgdemo.searchCenterTask',
      output: '가장 가까운 서비스센터는 +item.0.svc_center_name+ +item.0.distance+km 입니다.\n인근의 다른 서비스센터로 +item.1.svc_center_name+ +item.1.distance+km 가 있습니다.\n어디로 안내해 드릴까요?',
      children: [
        {
          input: {
            types: [{
              name: 'center',
              listName: 'item',
              field: 'svc_center_name',
              typeCheck: 'listTypeCheck'
            }]
          },
          task: {action: 'function(task, context, callback) {context.user.center = context.dialog.center;callback(task, context);}'},
          output: {
            output: '+center.svc_center_name+\n주소: +center.address3+\n영업시간\n평일: +center.winter_week_open+ ~ +center.winter_week_close+\n토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n전화번호: +center.phone+\n+center.parking+\n경로를 안내해드릴까요?',
            return: 1
          },
          children: [
            {
              input: '~네',
              output: {call: '방문경로'}
            },
            {
              input: '~아니요',
              output: '더 필요하신 게 있으신가요?',
              children: [
                {
                  input: '~네',
                  output: '궁금하신 걸 말씀해주세요~'
                },
                {
                  input: '~아니요',
                  output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      input: '~네',
                      output: '좋은 하루 보내세요.\n감사합니다.'
                    },
                    {
                      input: '~아니요',
                      output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          input: {if: 'true'} > {repeat: 1, options: {output: '목록에서 선택해주세요.\n'}} < {if: 'true'},
          output: {repeat: 1, options: {output: '목록에서 선택해주세요.\n'}}
        }
      ]
    },
    {
      name: '시간체크',
      input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}], regexp: /~영업/},
      task: {action: 'lgdemo.checkTime'},
      output: [
        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '시간체크'}}},
        {
          if: 'context.dialog.check == true',
          output: '죄송합니다. 영업 시간이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        },
        {
          if: 'context.dialog.check == false', output: '네 서비스 받으실 수 있는 시간 입니다.\n더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        },
        {
          if: 'context.dialog.check == \'re\'',
          output: '오후 / 오전을 붙여서 이야기 해주세요.\n예시: 오후 2시 영업해?, 14시 영업해?\n더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        }]
    },
    {
      name: '날짜체크',
      input: {types: [{name: 'date', typeCheck: 'dateTypeCheck', raw: true}], regexp: /~영업/},
      task: {action: 'lgdemo.checkDate'},
      output: [
        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '날짜체크'}}},
        {
          if: 'context.dialog.check == true',
          output: '죄송합니다. 영업일이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        },
        {
          if: 'context.dialog.check == false',
          output: '네 영업일입니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        }]
    },
    {
      name: '토요일영업',
      input: ['~월요일', '~화요일', '~수요일', '~목요일', '~금요일', '~토요일'],
      output: [
        {
          if: 'lgdemo.locationNotExists',
          output: {returnCall: '위치찾기', options: {returnDialog: '토요일영업'}}
        },
        {
          output: '네 영업일입니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        }]
    },
    {
      name: '수리가능',
      input: {types: [{name: 'repairable', typeCheck: 'lgdemo.repairableTypecheck', raw: true}]},
      task: {action: 'lgdemo.repairableCheck'},
      output: [
        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '수리가능'}}},
        {
          if: 'context.dialog.repairable == true',
          output: '네 +category+ 상품은 현 지점에서 현장 수리 가능합니다.\n센터 정보를 알려드릴까요?',
          children: [
            {
              input: '~네',
              output: '+center.svc_center_name+\n주소: +center.address3+\n영업시간\n평일: +center.winter_week_open+ ~ +center.winter_week_close+\n토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n전화번호: +center.phone+\n+center.parking+\n경로를 안내해드릴까요?',
              children: [
                {
                  input: '~네',
                  output: {call: '방문경로'}
                },
                {
                  input: '~아니요',
                  output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      input: '~네',
                      output: '좋은 하루 보내세요.\n감사합니다.'
                    },
                    {
                      input: '~아니요',
                      output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                    }
                  ]
                }
              ]
            },
            {
              input: '~아니요',
              output: '더 필요하신 게 있으신가요?',
              children: [
                {
                  input: '~네',
                  output: '궁금하신 걸 말씀해주세요~'
                },
                {
                  input: '~아니요',
                  output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      input: '~네',
                      output: '좋은 하루 보내세요.\n감사합니다.'
                    },
                    {
                      input: '~아니요',
                      output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          if: 'context.dialog.repairable == \'remote\'',
          output: '+category+ 상품은 출장 수리가 필요합니다.\n출장수리 신청은 아래 LG전자 서비스 홈페이지에서 가능합니다.\nwww.lgservice.co.kr/reserve/selectBusinessTrip.do\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n 좋은 하루 보내세요. 감사합니다.\n센터 정보를 알려드릴까요?',
          children: [
            {
              input: '~네',
              output: '+center.svc_center_name+\n주소: +center.address3+\n영업시간\n평일: +center.winter_week_open+ ~ +center.winter_week_close+\n토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n전화번호: +center.phone+\n+center.parking+\n경로를 안내해드릴까요?',
              children: [
                {
                  input: '~네',
                  output: {call: '방문경로'}
                },
                {
                  input: '~아니요',
                  output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      input: '~네',
                      output: '좋은 하루 보내세요.\n감사합니다.'
                    },
                    {
                      input: '~아니요',
                      output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                    }
                  ]
                }
              ]
            },
            {
              input: '~아니요',
              output: '더 필요하신 게 있으신가요?',
              children: [
                {
                  input: '~네',
                  output: '궁금하신 걸 말씀해주세요~'
                },
                {
                  input: '~아니요',
                  output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      input: '~네',
                      output: '좋은 하루 보내세요.\n감사합니다.'
                    },
                    {
                      input: '~아니요',
                      output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          if: 'context.dialog.repairable == false',
          output: '죄송합니다. 이 영업점에서는 취급하지 않는 품목입니다.\n센터 정보를 알려드릴까요?',
          children: [
            {
              input: '~네',
              output: '+center.svc_center_name+\n주소: +center.address3+\n영업시간\n평일: +center.winter_week_open+ ~ +center.winter_week_close+\n토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n전화번호: +center.phone+\n+center.parking+\n경로를 안내해드릴까요?',
              children: [
                {
                  input: '~네',
                  output: {call: '방문경로'}
                },
                {
                  input: '~아니요',
                  output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      input: '~네',
                      output: '좋은 하루 보내세요.\n감사합니다.'
                    },
                    {
                      input: '~아니요',
                      output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                    }
                  ]
                }
              ]
            },
            {
              input: '~아니요',
              output: '더 필요하신 게 있으신가요?',
              children: [
                {
                  input: '~네',
                  output: '궁금하신 걸 말씀해주세요~'
                },
                {
                  input: '~아니요',
                  output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      input: '~네',
                      output: '좋은 하루 보내세요.\n감사합니다.'
                    },
                    {
                      input: '~아니요',
                      output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                    }
                  ]
                }
              ]
            }
          ]
        }]
    },
    {
      name: '수리가능품목',
      input: '~수리 ~가능',
      task: {action: 'lgdemo.repairableList'},
      output: [
        {
          if: 'lgdemo.locationNotExists',
          output: {returnCall: '위치찾기', options: {returnDialog: '수리가능품목'}}
        },
        {
          output: '해당 서비스센터의 수리 가능 품목은 +center.productlist+ 입니다.\n센터 정보를 알려드릴까요?',
          children: [
            {
              input: '~네',
              output: '+center.svc_center_name+\n주소: +center.address3+\n영업시간\n평일: +center.winter_week_open+ ~ +center.winter_week_close+\n토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n전화번호: +center.phone+\n+center.parking+\n경로를 안내해드릴까요?',
              children: [
                {
                  input: '~네',
                  output: {call: '방문경로'}
                },
                {
                  input: '~아니요',
                  output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      input: '~네',
                      output: '좋은 하루 보내세요.\n감사합니다.'
                    },
                    {
                      input: '~아니요',
                      output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                    }
                  ]
                }
              ]
            },
            {
              input: '~아니요',
              output: '더 필요하신 게 있으신가요?',
              children: [
                {
                  input: '~네',
                  output: '궁금하신 걸 말씀해주세요~'
                },
                {
                  input: '~아니요',
                  output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      input: '~네',
                      output: '좋은 하루 보내세요.\n감사합니다.'
                    },
                    {
                      input: '~아니요',
                      output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                    }
                  ]
                }
              ]
            }
          ]
        }]
    },
    {
      name: '공휴일영업',
      input: ['~공휴일', '일요일'],
      output: [
        {
          if: 'lgdemo.locationNotExists',
          output: {returnCall: '위치찾기', options: {returnDialog: '공휴일영업'}}
        },
        {
          output: '죄송합니다. 영업일이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        }]
    },
    {
      name: '영업시간',
      input: '~영업 ~시간',
      output: [
        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '영업시간'}}},
        {
          output: '해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        }]
    },
    {
      name: '방문경로',
      input: ['어떻다 찾다', '어떻다 ~가다', '경로', '가는 방법'],
      output: [
        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '방문경로'}}},
        {
          output: '어떻게 방문하실 계획인가요?\n 1. 지하철\n 2. 버스\n 3. 자가용 \n4. 네비게이션',
          children: [
            {
              input: ['1', '지하철'],
              output: '+center.lms_subway+\n방문 예약을 하시겠습니까?',
              children: [
                {
                  input: '~네',
                  output: {call: '방문예약'}
                },
                {
                  input: '~아니요',
                  output: '더 필요하신 게 있으신가요?',
                  children: [
                    {
                      input: '~네',
                      output: '궁금하신 걸 말씀해주세요~'
                    },
                    {
                      input: '~아니요',
                      output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                      children: [
                        {
                          input: '~네',
                          output: '좋은 하루 보내세요.\n감사합니다.'
                        },
                        {
                          input: '~아니요',
                          output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              input: ['2', '버스'],
              output: '+center.lms_bus+\n방문 예약을 하시겠습니까?',
              children: [
                {
                  input: '~네',
                  output: {call: '방문예약'}
                },
                {
                  input: '~아니요',
                  output: '더 필요하신 게 있으신가요?',
                  children: [
                    {
                      input: '~네',
                      output: '궁금하신 걸 말씀해주세요~'
                    },
                    {
                      input: '~아니요',
                      output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                      children: [
                        {
                          input: '~네',
                          output: '좋은 하루 보내세요.\n감사합니다.'
                        },
                        {
                          input: '~아니요',
                          output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              input: ['3', '자가용'],
              output: '+center.owner+\n방문 예약을 하시겠습니까?',
              children: [
                {
                  input: '~네',
                  output: {call: '방문예약'}
                },
                {
                  input: '~아니요',
                  output: '더 필요하신 게 있으신가요?',
                  children: [
                    {
                      input: '~네',
                      output: '궁금하신 걸 말씀해주세요~'
                    },
                    {
                      input: '~아니요',
                      output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                      children: [
                        {
                          input: '~네',
                          output: '좋은 하루 보내세요.\n감사합니다.'
                        },
                        {
                          input: '~아니요',
                          output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              input: ['4', '경로', '네비게이션', '네비'],
              task: 'lgdemo.ang',
              output: '경로안내입니다 \n +_docs.link_find+\n방문 예약을 하시겠습니까?',
              children: [
                {
                  input: '~네',
                  output: {call: '방문예약'}
                },
                {
                  input: '~아니요',
                  output: '더 필요하신 게 있으신가요?',
                  children: [
                    {
                      input: '~네',
                      output: '궁금하신 걸 말씀해주세요~'
                    },
                    {
                      input: '~아니요',
                      output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                      children: [
                        {
                          input: '~네',
                          output: '좋은 하루 보내세요.\n감사합니다.'
                        },
                        {
                          input: '~아니요',
                          output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }]
    },
    {
      name: '방문예약',
      input: '예약',
      output: '센터 방문 예약은 아래 LG전자 서비스 홈페이지에서 가능합니다.\nwww.lgservice.co.kr/reserve/selectVisit.do\n경로를 안내해드릴까요?',
      children: [
        {
          input: '~네',
          output: {call: '방문경로'}
        },
        {
          input: '~아니요',
          output: '더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: '전화번호안내',
      input: '~번호',
      output: [
        {
          if: 'lgdemo.locationNotExists',
          output: {returnCall: '위치찾기', options: {returnDialog: '전화번호안내'}}
        },
        {
          output: '+center.svc_center_name+ 전화번호입니다.\n +center.phone+\n더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        }]
    },
    {
      name: '주차안내',
      input: '~주차',
      output: [
        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '주차안내'}}},
        {
          output: '+center.owner+\n더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        }]
    }
  ];

var commonDialogs = [
  {
    name: '시작',
    input: '시작',
    task:   {action: 'startAction'},
    output: '안녕하세요. LG전자 고객센터 데모 입니다.'
  },
  {
    input: '이전',
    output: {up:1}
  },
  {
    input: '전페이지',
    output: {repeat: 1, options: {page: 'pre'}}
  },
  {
    input: '다음페이지',
    output: {repeat: 1, options: {page: 'next'}}
  },
  {
    input: '콜센터',
    output: '고객센터 번호는 1577-7314입니다.'
  },
  {
    name: '답변없음',
    input: '',
    output: '알아듣지 못하는 말입니다.\n고객센터로 연결해드릴까요?',
    children: [
      {
        input: '~네',
        output: '고객센터 번호는 1577-7314입니다.'
      },
      {
        input: '~아니요',
        output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
        children: [
          {
            input: '~네',
            output: '좋은 하루 보내세요.\n감사합니다.'
          },
          {
            input: '~아니요',
            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
          }
        ]
      }
    ]
  }
];
