'use strict';

// Bots controller
angular.module('bots').controller('DialogTreeController', ['$scope', '$rootScope', '$state', '$window','$timeout',
  '$stateParams', '$resource', 'Dialogs', 'DialogSaveService', 'OpenTasksService', 'FileUploader',
  function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, Dialogs, DialogSaveService,
            OpenTasksService, FileUploader) {

    var vm = this;
    vm.userId = $rootScope.userId;
    vm.bot_id = $stateParams.botId;
    vm.file_id = $stateParams.fileId;
    vm.maxId = 0;
    vm.isChanged = false;
    vm.changeHistory = [];

    vm.setChanged = function(c, updateScope) {
      if (c == true) {
        vm.changeHistory.push({source:angular.copy(selectedNode), dialogs:angular.copy(dialogs)});
      }
      vm.isChanged = c;

      if (updateScope) {
        $scope.$apply();
      }
    };

    $scope.undo = function() {
      if (vm.changeHistory.length > 0) {
        var history = vm.changeHistory.pop();
        dialogs = history.dialogs;
        vm.initTreeData();
        init(history.source);
      }
      if (vm.changeHistory.length == 0) {
        vm.setChanged(false);
      }
    };

    console.log('Tree Controller');

    // internal data represented by tree
    var links_internal = [];
    var nodes = [];
    var dialogs;
    var treeData;

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
            update(currentNode);
            centerNode(currentNode);
          }
        } catch(e) {
          console.log(e);
        }
      }
    });

    $scope.openTask = function(task, isCommon) {

    };

    $scope.openType = function(type) {

    };

    // dialog editing
    $scope.addI = function(input) {
      var init = {};
      init.type = $scope.getInputTypes(input)[0];
      init.str = '';
      $scope.openEdit(init, input);
    };

    $scope.removeI = function(i, input) {
      input.splice(input.indexOf(i),1);
    };

    $scope.openEdit = function(i, input) {
      vm.curInput = input;
      vm.targetI = i;
      vm.curI = angular.copy(i);
      vm.inputMode = true;
    };

    $scope.addO = function(input) {
      var init = {};
      init.type = $scope.getOutputTypes(input)[0];
      init.str = '';
      $scope.openEditO(init, input);
    };

    $scope.openEditO = function(o, output) {
      vm.curOutput = output;
      vm.targetO = o;
      vm.curO = angular.copy(o);
      vm.inputModeO = true;
    };

    $scope.saveI = function() {
      vm.targetI.type = vm.curI.type;
      vm.targetI.str = vm.curI.str;

      if (vm.curInput.indexOf(vm.targetI) == -1)
        vm.curInput.push(vm.targetI);

      $scope.resetI();
    };

    $scope.saveO = function() {
      vm.targetO.type = vm.curO.type;
      vm.targetO.str = vm.curO.str;

      if (vm.curOutput.indexOf(vm.targetO) == -1)
        vm.curOutput.push(vm.targetO);

      $scope.resetO();
    };

    $scope.resetI= function() {
      vm.inputMode = false;
    };

    $scope.resetO= function() {
      vm.inputModeO = false;
    };

    $scope.setType = function(i, type) {
      i.type = type;
      if (type != "Text" && type != "If" && type !="Regexp" && type !="Button")
        i.str = "";
    };

    $scope.getPlaceHolder = function(type, isOut) {
      if (type === 'Text') {
        if (isOut) return "답변을 입력해주세요";
        return "질문을 입력해주세요";
      }
      if (type === 'RegExp') return "정규식을 입력해주세요";
      if (type === 'Type') return "타입을 입력해주세요";
      if (type === 'Button') return "버튼 이름을 입력해주세요";
      if (type === 'If') return "조건을 입력해주세요";
    };

    vm.inputTypes = ["Text","RegExp","Type","If"];
    vm.outputTypes = ["Text","Call","ReturnCall","CallChild","Up"];

    var findType = function(input, typeName) {
      for (var i=0; i < input.length; ++i) {
        if (input[i].type === typeName) {
          return true;
        }
      }
      return false;
    };

    $scope.getInputTypes = function(input, i) {
      var types = [];
      if (!input) return types;
      vm.inputTypes.forEach(function(t) {
        if (t === 'Type' || (i != undefined && t === i.type) || !findType(input,t))
          types.push(t);
      });
      return types;
    };

    $scope.getOutputTypes = function(input, i) {
      var types = [];
      if (!input) return types;
      var isDone = false;
      vm.outputTypes.forEach(function(t) {
        if (findType(input,t)) {
          isDone = true;
        }
      });
      if ((!isDone || (i != undefined && vm.outputTypes.indexOf(i.type) != -1))) {
        if (!findType(input, 'Button') && !findType(input,'Image'))
          types = angular.copy(vm.outputTypes);
        else
          types.push('Text');
      }
      if (!isDone || (isDone && findType(input,'Text'))) {
        if (!findType(input,'Image'))
          types.push('Image');
        types.push('Button');
      }
      if (!findType(input,"If") || (i != undefined && i.type == "If"))
        types.push("If");
      return types;
    };

    $scope.addInput = function() {
      //["","",{types:[{name:'', typeCheck:'', raw:true},..,regexp:''}]]
      var input = [];
      $scope.dialog.input.push(input);
      $scope.addI(input);
    };

    $scope.removeInput = function(input) {
      $scope.dialog.input.splice($scope.dialog.input.indexOf(input),1);
    };

    $scope.addOutput= function() {
      var output = [];
      $scope.dialog.output.push(output);
      $scope.addO(output);
    };

    $scope.removeOutput = function(output) {
      $scope.dialog.output.splice($scope.dialog.output.indexOf(output),1);
    };

    var currentKeyword = "";
    var currentSearchIdx = 0;

    $scope.searchNode = function() {
      //find the node
      var selectedVal = document.getElementById('search').value;
      var node = baseSvg.selectAll(".node");
      if (selectedVal != "") {
        var selected = node.filter(function (d, i) {
          return d.name.search(selectedVal) != -1;
        });
        if (currentKeyword !== selectedVal) {
          currentKeyword = selectedVal;
          currentSearchIdx = 0;
        }

        if (selected && selected.length == 1) {
          selectedNode = selected[0][currentSearchIdx].__data__;
          selectedSVG = d3.select(selected[0][currentSearchIdx]);
          update(selectedNode);
          centerNode(selectedNode);

          currentSearchIdx = (++currentSearchIdx) % selected[0].length;
        }
      }
    };

    vm.btnClass = [];
    vm.btnClass['Text'] = 'btn-primary';
    vm.btnClass['RegExp'] = 'btn-success';
    vm.btnClass['Type'] = 'btn-warning';
    vm.btnClass['Call'] = 'btn-danger';
    vm.btnClass['CallChild'] = 'btn-danger';
    vm.btnClass['ReturnCall'] = 'btn-danger';
    vm.btnClass['If'] = 'btn-info';
    vm.btnClass['Image'] = 'btn-warning';
    vm.btnClass['Button'] = 'btn-success';

    vm.getButtonClass = function(type) {
      return vm.btnClass[type];
    };

    var initInput = function(input) {
      var res = [];
      input.forEach(function(d) {
        var r = [];
        if (d.text) {
          r.push({type: 'Text', str: d.text});
        }
        if (d.types) {
          d.types.forEach(function (t) {
            r.push({type: 'Type', str: t.name});
          });
        }
        if (d.regexp) {
          r.push({type: 'RegExp', str: d.regexp});
        }
        if (d.if) {
          r.push({type:'If', str:d.if});
        }

        res.push(r);
      });
      return res;
    };

    var initOutput = function(output) {
      var res = [];
      output.forEach(function(d) {
        var r = [];
        if (d.output) {
          r.push({type:'Text', str:d.output});
        }
        if (d.call) {
          r.push({type:'Call', str:d.call});
        }
        if (d.callChild) {
          r.push({type:'CallChild', str:d.callChild});
        }
        if (d.returnCall) {
          r.push({type:'ReturnCall', str:d.returnCall});
        }
        if (d.if) {
          r.push({type:'If', str:d.if, output:d.output});
        }
        if (d.up) {
          r.push({type:'Up', str:d.up});
        }
        if (d.buttons) {
          d.buttons.forEach(function(b) {
            r.push({type:'Button', str:b.name});
          });
        }
        if (d.image) {
          r.push({type:'Image', str:d.image});
        }
        res.push(r);
      });
      return res;
    };

    var restoreInput = function(result) {
      var input = [];
      result.forEach(function(res) {
        var obj = {};
        res.forEach(function(r) {
          if (r.type === 'Text') {
            obj.text = r.str;
          } else if (r.type === 'Type') {
            (obj.types || (obj.types = [])).push(vm.type_dic[r.str]);
          } else if (r.type === 'RegExp') {
            obj.regexp = r.str;
          } else if (r.type === 'If') {
            obj.if = r.str;
          }
        });
        if (Object.keys(obj).length !== 0)
          input.push(obj);
      });
      return input;
    };

    var restoreOutput = function(result) {
      var output = [];
      result.forEach(function(res) {
        var o = {};
        res.forEach(function(r) {
          if (r.type === 'Text') {
            o.output = r.str;
          } else if (r.type === 'Call') {
            o.call = r.str;
          } else if (r.type === 'CallChild') {
            o.callChild = r.str;
          } else if (r.type === 'ReturnCall') {
            o.returnCall = r.str;
          } else if (r.type === 'If') {
            o.if = r.str;
          } else if (r.type === 'Up') {
            o.up = r.str;
          } else if (r.type === 'Image') {
            o.image = r.str;
          } else if (r.type === 'Button') {
            (o.buttons || (o.buttons = [])).push({name:r.str});
          }
        });
        output.push(o);
      });
      return output;
    };

    $scope.findOne = function (dialog) {
      $scope.dialog = {};
      $scope.dialog.name = dialog.name;
      $scope.dialog.input = initInput(dialog.input);
      $scope.dialog.task = dialog.task;
      $scope.dialog.output = initOutput(dialog.output);

      $scope.$apply();
      $('.modal-with-form').click();
    };

    $scope.update = function (isValid) {
      vm.setChanged(true);

      // $scope.error = null;
      // if (!isValid) {
      //   $event.stopPropagation();
      //   $scope.$broadcast('show-errors-check-validity', 'dialogForm');
      //   return false;
      // }

      selectedNode.name = $scope.dialog.name;
      selectedNode.input = restoreInput($scope.dialog.input);
      selectedNode.task = $scope.dialog.task;
      selectedNode.output = restoreOutput($scope.dialog.output);

      selectedSVG.remove();
      update(selectedNode);
      //Dialogs.update(dialog);
    };

    $scope.save = function() {
      vm.changeHistory = [];
      vm.setChanged(false);
      var clear = function(node)
      {
        delete node.parent;
        delete node.x;
        delete node.x0;
        delete node.y;
        delete node.y0;
        delete node.input_text;
        delete node.output_text;
        delete node.image_text;
        delete node.buttons;
        delete node.depth;

        if (node.children)
          node.children.forEach(clear);
      };

      dialogs.forEach(clear);

      DialogSaveService.update({botId: vm.botId, fileName: vm.fileName, dialogs:dialogs},
        function() {
          new PNotify({
            title: '저장 완료',
            text: '',
            type: 'success'
          });
          console.log("saved");
        }, function(err) {
          console.log(err);
        });
    };

    $scope.getInputType = function(type) {
      if (type === 'Text' || type === 'If' || type === 'Up' || type === 'RegExp')
        return 'text';
      if (type === 'Call' || type === 'CallChild' || type === 'ReturnCall' || type =='ReturnChild')
        return 'dialog';
      if (type === 'Image')
        return 'image';
      if (type === 'Button')
        return 'text';
      if (type === 'Type')
        return 'type';
    };

    $scope.dialogList = function() {
      var names = [];
      for (var d in nodes) {
        if (d !== selectedNode.name)
          names.push(d);
      }
      return names;
    };

    // make nodes and links_internal from dialogs
    var handleInput = function(input) {
      if (Array.isArray(input)) {
        var text = [];
        input.forEach(function(i) {
          if (i.text)
            text.push('[단어] '+ i.text);
          if (i.types && i.types[0].name) {
            i.types.forEach(function (t) {
              text.push('[타입] ' + t.name);
            });
          }
          if (i.regexp)
            text.push('[정규식] ' + i.regexp);
          if (i.if)
            text.push('[조건] ' + i.if);
        });
        return text + "";
      } else {
        // for dialogs from dlg
        if(input == 'string') return input;
        else if(input.types && input.types[0].name) {
          return '[타입] ' + input.types[0].name;
        } else if(input.if) {
          return '[조건] ' + input.if;
        } else {
          return input;
        }
      }
    };

    var handlePrintOutput = function(dialog, output) {
      if (typeof output == 'string') return output;
      else if(Array.isArray(output)) {
        var _output = '';
        for (var i = 0; i < output.length; i++) {
          if (i !== 0) _output += ', ';
          _output += handlePrintOutput(dialog, output[i]);
        }
        return _output;
      } else {
        var text = [];
        if (typeof output.output === 'string') {
          text.push('[문장] ' + output.output);
        }
        if (output.if) {
          text.push('[조건] ' + output.if);
        }
        if (output.call) {
          text.push('[Call] ' + output.call);
        }
        if (output.returnCall) {
          text.push('[ReturnCall] ' + output.returnCall);
        }
        if (output.callChild) {
          text.push('[callChild] ' + output.callChild);
        }
        if (output.up) {
          text.push('[up] ' + output.up);
        }
        if (output.image) {
          dialog.image_text = '/files/' + output.image;
        }
        if (output.buttons) {
          dialog.buttons = output.buttons.map(function(b) { return b.name });
        }

        return text + "";
      }
    };

    var initPrintOutput = function(dialog) {
      delete dialog.image_text;
      delete dialog.buttons;
    };

    var handleDialog = function(dialog)
    {
      dialog.name = dialog.name || (dialog.name = "dialog" + "_" + dialog.id);
      nodes[dialog.name] = nodes[dialog.name] || (nodes[dialog.name] = dialog);
      if (!Array.isArray(dialog.input))
        dialog.input = [dialog.input];
      nodes[dialog.name].input_text  = handleInput(dialog.input);
      if (!Array.isArray(dialog.output))
        dialog.output = [dialog.output];
      initPrintOutput(dialog);
      nodes[dialog.name].output_text = handlePrintOutput(dialog, dialog.output);

      if (dialog.id)
        vm.maxId = Math.max(vm.maxId, parseInt(dialog.id.substring(vm.fileName.length, dialog.id.length)));

      if (dialog.children) {
        dialog.children.forEach(function(child) {
          handleDialog(child);
        });
      }
    };

    var handleOutput = function(dialog, output) {
      if (Array.isArray(output)) {
        for (var i=0; i < output.length; ++i)
          handleOutput(dialog,output[i]);
      }
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

    vm.initTreeData = function() {
      treeData = {name: '시작', id: 'dummystart', children: []};
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
    };

    $resource('/api/dialogs/:bot_id/:file_id', {}).get({bot_id: vm.bot_id, file_id: vm.file_id}, function(res) {
      vm.botId = res.botId;
      vm.fileName = res.fileName;
      vm.tasks = res.tasks;
      vm.types = res.types;
      vm.type_dic = res.type_dic;
      dialogs = res.data;

      OpenTasksService.query().$promise.then(function(result) {
        vm.commonTasks = result;
      });

      //console.log(JSON.stringify(dialogs));
      vm.initTreeData();
      init();
    });

    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;

    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    var viewerWidth = document.getElementById('tree-container').clientWidth;
    var viewerHeight = document.getElementById('sidebar-left').clientHeight;

    // size of rect
    var rectW = 220, rectH = 130;
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
        // var input_text = (typeof d.input_text == 'string' ? d.input_text.replace(/(?:\r\n|\r|\n)/g, '<br />') : d.input_text);
        // var output_text = (typeof d.output_text == 'string' ? d.output_text.replace(/(?:\r\n|\r|\n)/g, '<br />') : d.output_text);
        // return "<strong>Input:</strong><br/><span style='color:cornflowerblue'>" + input_text + "</span><br/><br/>" +
        //   "<strong>Output:</strong><br/><span style='color:cornflowerblue'>" + output_text + "</span>";
        return "<image src='" + d.image_text + "' height='120px'>";
      });
    baseSvg.call(tip);

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

    var init = function(source) {
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
      if (source) {
        update(source);
        centerNode(source);
      } else {
        update(root);
        centerNode(root, 'start');
      }
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

      // TODO: need to update source and target in other links
      nodes = [];
      links_internal = [];
      dialogs.forEach(handleDialog);
      dialogs.forEach(handleLink);

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
        .style('fill', '#DADAEB');
      // .attr("stroke-width", 2)
      // .style("stroke", function (d) {
      //   return d._children ? "lightsteelblue" : "#fff";
      // })
      //.on('mouseover', tip.show)
      //.on('mouseout', tip.hide);

      // add the text
      nodeEnter.append("text")
        .attr("id", "name")
        .attr("class","nodetext nodetitle")
        .style("pointer-events", "none")
        .attr("x", "1em")
        .attr("dy", "1.30em")
        .text(function(d) { return d.name; });

      nodeEnter.append("line")
        .style("pointer-events", "none")
        .attr("x1", 0)
        .attr("y1", "18")
        .attr("x2", rectW)
        .attr("y2", "18")
        // .attr("stroke-width", 1.2)
        .style("stroke", function(d) { return d3.rgb("#7CA4C0").darker(); });

      nodeEnter.append("text")
        .attr("id", "input")
        .attr("class","nodetext")
        .style("pointer-events", "none")
        .attr("x", 7)
        .attr("dy", "3em")
        .text(function(d) { return "In: " + (d.input_text ? d.input_text: ""); })
        .call(wrap, rectW-30, 1);

      nodeEnter.append("line")
        .style("pointer-events", "none")
        .attr("x1", 0)
        .attr("y1", "2.7em")
        .attr("x2", rectW)
        .attr("y2", "2.7em")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "0,2 1")
        .attr("stroke", "gray");

      nodeEnter.append("text")
        .attr("id", "task")
        .attr("class","nodetext")
        .style("pointer-events", "none")
        .attr("x", 7)
        .attr("dy", "5em")
        .text(function(d) { return "Task: " + (d.task ? d.task : ""); })
        .call(wrap, rectW-25, 2);

      nodeEnter.append("line")
        .style("pointer-events", "none")
        .attr("x1", 0)
        .attr("y1", "4.3em")
        .attr("x2", rectW)
        .attr("y2", "4.3em")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "0,2 1")
        .attr("stroke", "gray");

      nodeEnter.append("text")
        .attr("id", "output")
        .attr("class","nodetext")
        .style("pointer-events", "none")
        .attr("x", 7)
        .attr("dy", "7em")
        .text(function(d) { return "Out: " + (d.output_text ? d.output_text : ""); })
        .call(wrap, rectW-25, 2);

      nodeEnter.append("line")
        .style("pointer-events", "none")
        .attr("x1", 0)
        .attr("y1", "6.7em")
        .attr("x2", rectW)
        .attr("y2", "6.7em")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "0,2 1")
        .attr("stroke", "gray");

      var showTip = function(d) {
        if (d.image_text)
          tip.show(d);
      };

      nodeEnter.append("text")
        .attr("id", "image")
        .attr("class","nodetext")
        .attr("x", 7)
        .attr("dy", "10em")
        .text(function(d) { return "Image: " + (d.image_text ? d.image_text: ""); })
        .on('mouseover', showTip)
        .on('mouseout', tip.hide)
        .call(wrap, rectW-25, 1);

      nodeEnter.append("text")
        .attr("id", "image")
        .attr("class","nodetext")
        .style("pointer-events", "none")
        .attr("x", 7)
        .attr("dy", "12em")
        .text(function(d) { return "Button: " + (d.buttons ? d.buttons + "": ""); })
        .call(wrap, rectW-25, 1);

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


      // add the text
      // nodeUpdate.select("text#name")
      //   .text(function(d) { return d.name; });
      //
      // nodeUpdate.select("text#input")
      //   .text(function(d) { return "In: " + (d.input_text ? d.input_text: ""); })
      //   .call(wrap, rectW-30, 1);
      //
      // nodeUpdate.select("text#task")
      //   .text(function(d) { return "Task: " + (d.task ? d.task : ""); })
      //   .call(wrap, rectW-25, 2);
      //
      // nodeUpdate.select("text#output")
      //   .text(function(d) { return "Out: " + (d.output_text ? d.output_text : ""); })
      //   .call(wrap, rectW-25, 2);
      //
      // // Fade the text in
      // nodeUpdate.select("text")
      //   .transition().duration(0)
      //   .style("fill", "red")
      //   .transition().duration(1000)
      //   .style("fill", "black");

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
        link
          .filter(function(d) { return d.source.y !== d.target.y;})
          .transition()
          .duration(duration)
          .attr("d", diag);

        link
          .filter(function(d) { return d.source.y === d.target.y;})
          .transition()
          .duration(duration)
          .attr("d", function(d) {
            var sx = d.source.x + rectH/2;
            var sy = d.source.y + rectW;
            var tx = d.target.x + rectH/2;
            var ty = d.target.y + rectW;
            var cx = (sx+tx) / 2;
            var cy = sy + Math.abs(sx-tx) / itemHeight * 40 + 50;
            return "M" + sy + " " + sx + " Q " + cy + " " + cx +" " + ty + " " + tx;
          });

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
          currentNode = undefined;
        }, 1300);
      }

      if(selectedNode) {
        // draw selector
        d3.selectAll(".selectedRect").remove();
        d3.selectAll(".icon").remove();

        selectedSVG.append("rect")
          .attr("class", "selectedRect")
          .attr("id", "selected")
          .attr("y", -25)
          .attr("width", rectW)
          .attr("height", rectH+25)
          .attr("rx", 5)
          .attr("ry", 5);
        selectedSVG.append("rect")
          .attr("class", "selectedRect")
          .attr("id", "selected")
          .attr("y", -25)
          .attr("width", rectW)
          .attr("height", 25)
          .style("pointer-events", "none")
          .style('fill', 'lightsteelblue')
          .style("opacity", 0.8)
          .attr("rx", 5)
          .attr("ry", 5);

        if (selectedNode.depth == 0) {
          selectedSVG.append('text')
            .on("click", addChild)
            .attr("class", "icon")
            .attr("x", rectW-25)
            .attr("y", -4)
            .text(function(d) { return '\uf067';} );
          return;
        }

        selectedSVG.append('text')
          .on("click", edit)
          .attr("class", "icon")
          .attr("x", rectW-25*4)
          .attr("y", -4)
          .text(function(d) { return '\uf044';} );
        selectedSVG.append('text')
          .on("click", addChild)
          .attr("class", "icon")
          .attr("x", rectW-25*3)
          .attr("y", -4)
          .text(function(d) { return '\uf067';} );
        selectedSVG.append('text')
          .on("click", deleteNode)
          .attr("class", "icon")
          .attr("x", rectW-25*2)
          .attr("y", -5)
          .text(function(d) { return '\uf00d';} );
        selectedSVG.append('text')
          .on("click", toggleAndCenter)
          .attr("class", "icon")
          .attr("x", rectW-25)
          .attr("y", -4)
          .text(function(d) { if (d.children) return '\uf053'; else if (d._children) return '\uf054';} );


      } else {
        d3.selectAll(".selectedRect").remove();
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
      if (isStart != undefined) {
        if (isStart === 'start') {
          x -= 300;
        } else {
          //x -= 400;
        }
      }
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
      vm.setChanged(true, true);
      d3.event.stopPropagation();
      if (d._children) {
        toggleChildren(d);
      }
      var newDialog = {name:"", id:vm.fileName + (++vm.maxId), filename:vm.fileName, input:[], output:[]};
      (d.children || (d.children = [])).push(newDialog);
      if (d.depth === 0)
        dialogs.push(newDialog);
      update(d);
    }

    function initSelect() {
      selectedNode = null;
      selectedSVG = null;
    }

    function deleteNode(d) {
      vm.setChanged(true, true);
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

      if (d.depth == 1) {
        for (var i=0; i < dialogs.length; ++i) {
          if (dialogs[i].id === d.id) {
            dialogs.splice(i,1);
            break;
          }
        }
      }

      //TODO: need to remove other links such as call...
      delete_int(d);
      update(d.parent);
    }

    function delete_int(d) {
      if (d.children) {
        d.deleted_children = d.children;
        d.deleted_children.forEach(delete_int);
        d.children = null;
      }
    }

    function edit(d) {
      d3.event.stopPropagation();
      angular.element(document.getElementById('control')).scope().findOne(d);
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
      d3.event.stopPropagation();
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

    /********************* image *********************/
    $scope.imageURL = undefined;
    $scope.error = {};
    $scope.success = {};

    // Create file imageUploader instance
    $scope.imageUploader = new FileUploader({
      url: '/api/user-bots/image-files',
      alias: 'uploadImageFile',
      autoUpload: true
    });

    $scope.imageUploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        if('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1){
          $scope.success.image = null;
          $scope.error['image'] = '이미지 파일이 아니에요'
        }else {
          $scope.error.image = null;
        }
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.imageUploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.imageUploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success['image'] = true;

      vm.curO.str = response.filename;
      // Clear upload buttons
      $scope.cancelImageUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.imageUploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelImageUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadImageFiles = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.imageUploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelImageUpload = function () {
      $scope.imageUploader.clearQueue();
      // $scope.imageURL = $scope.user.profileImageURL;
    };
  }]
);



