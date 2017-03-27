var fs = require('fs');
var path = require('path');
var logger = require(path.resolve('config/lib/logger'));
var utils = require(path.resolve('modules/bot/action/common/utils'));


function botBuild(bot, botPath) {
  var botDir;
  if(botPath) botDir = path.resolve(botPath);
  else botDir = path.resolve('custom_modules/' + bot);

  var fileFilter = function(file) { return file.endsWith('dlg'); };

  var files;
  try {
    files = utils.readdirRecursive(botDir);
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if(file != file.normalize('NFC')) {
        files[i] = file.normalize('NFC');
      }
    }
    files = files.filter(fileFilter);
  } catch(e) {
    logger.info('botBuild: ' + botDir + ' 경로 없음');
    return;
  }

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    // var dlgPath = path.join(botDir, file);
    var info = path.parse(file);
    // var jsPath = path.join(info.dir, info.name + '.js');
    var dialogPath = path.join(info.dir, info.name + '.dialog.js');

    if(fs.existsSync(dialogPath) &&
      fs.statSync(file).mtime <= fs.statSync(dialogPath).mtime) {
      logger.info('\t building dlg file: ' + file + ' [SKIP]');

      continue;
    }

    logger.info('\t building dlg file: ' + file + ' -> ' + info.name + '.dialog.js');

    var text = fs.readFileSync(file, 'utf8');
    // console.log(text);
    var js = build(text, false);

    js = '\n' + js + '\n\n' + build(text, true);

    // try {
    //   var include = fs.readFileSync(path.join(info.dir, info.name + '.js'), 'utf8');
    //   if(include) js = include + js;
    // } catch(e) {}

    var tail = '\nvar _bot = require(require(\'path\').resolve("config/lib/bot")).getBot(\'' + bot + '\');' +
      '\n_bot.setDialogs(dialogs);' +
      '\n_bot.setCommonDialogs(commonDialogs);\n';
    js = js + tail;

    // graph view TEST
    // TODO 파일별로 저장하기
    //   var tail2 = '\n// TEST' + '\nvar json = JSON.stringify(dialogs);' + '\nconsole.log(json);' +
    //     '\nvar fs = require(\'fs\');' +
    //       '\nfs.writeFile(require(\'path\').resolve("public/js") + "/dialog.json", json, function(err) {' +
    //       '\nif(err) { return console.log(err); }' +
    //       '\nconsole.log("dialog.json was saved!"); });'
    //   js += tail2;

    fs.writeFileSync(dialogPath, js, 'utf8');

  }
}
exports.botBuild = botBuild;

function build(text, isCommon) {
  var number = 0;

  // 주석 escape
  text = text.replace(/['][^'\n]*\/\/[^'\n]*[']|["][^"\n]*\/\/[^"\n]*["]/g, function (match, p1, p2, p3, p4) {
    return match.replace('//', '\\/\\/');
  });

  // 라인 주석
  text = text.replace(/\s*\/\/(.*)\n|\s*\/\/(.*)$/g, function (match, p1) {
    return '\n';
  });

  // 영역 주석
  text = text.replace(/\/\*(\*(?!\/)|[^*])*\*\//g, function (match, p1) {
    return '';
  });

  // tab 공백으로 바꾸기
  text = text.replace(/\t/g, function (match, p1) {
    return '    ';
  });

  // 주석 escape 복원
  text = text.replace(/['][^'\n]*(\\\/\\\/)[^'\n]*[']|["][^"\n]*(\\\/\\\/)[^"\n]*["]/g, function (match, p1) {
    return match.replace('\\/\\/', '//');
  });

  // 공백줄 삭제
  text = text.replace(/(?:\s*[\n])+/g, function (match, p1) {
    return '\n';
  });

  // var step = '';
  var output;
  var tab = '  ';

  var lines = text.split('\n');
  var i = 0;
  var textEscape = function(text) {
    // text = text.replace(/\/\/(.*)/, '').trim();
    if(text.startsWith('{') || text.startsWith('/') || text.startsWith('if')   || text.startsWith('function') || text === 'false' || text === 'undefined' || text === 'null'/* || text == ''*/) return text;
    else {
      return '\'' + text.replace(/'/g, '\\\'') + '\'';
    }
  };

  var jsLines = [];

  var parseDialog = function (step) {
    var dialogs = [];

    for (; i < lines.length; i++) {
      var line = lines[i];
      var inc = false;
      //console.log(step + (i+1) + ' start parseDialog');

      // while (line.search(/^\s*$/) != -1 || line.search(/^\s*\/\/(.*)$/) != -1) {
      //   if(i + 1 < lines.length) {line = line = lines[++i];inc = true;}
      //   else break;
      // }

      if(!line.startsWith(step)) {
        i--;
        //console.log(step + (i+1) + ' end parseDialog 3');
        return dialogs.join(',\n');
      }

      if (line.startsWith(step + (isCommon && (step === '')? 'c<':'<')) || line.search(new RegExp('^'+step + '[a-zA-Z가-힣]*:')) != -1) {
        var dialog = '';
        var name;
        var inputs = [];
        var tasks = [];
        var outputs = [];
        var children;
        var match;

        if((match = line.match(new RegExp('^' + step + '([a-zA-Z가-힣]*):\s*(.*)'))) != undefined) {
          name = textEscape(match[1]);

          if(match[2] != undefined && match[2].trim() != '') {
            line = step + match[2].trim();
          } else {
            if (i + 1 < lines.length) {line = lines[++i];inc = true;}
          }
        } else {
          name =undefined;
        }

        if (line.indexOf('>') != -1 &&
          (((isCommon && step === '') && line.indexOf('c<') != -1) || (!(isCommon && step === '') && line.indexOf('c<') == -1))) {
          var re;
          if(isCommon && (step == '')) re = /^\s*c<\s*(.*)\s*>\s*(.*)/g;
          else re = /^\s*<\s*(.*)\s*>\s*(.*)/g;
          line.replace(re, function (match, p1, p2) {
            inputs.push(textEscape(p1));
            outputs.push(textEscape(p2));

            return match;
          });

          if (i + 1 < lines.length) {line = lines[++i];inc = true;}
        } else {

          var _initMatched = false;
          while (line.startsWith(step + (isCommon && (step === '')? 'c<':'<'))) {
            var re;
            if(isCommon && (step == '')) re = /^\s*c<\s*(.*)\s*$/g;
            else re = /^\s*<\s*(.*)\s*$/g;

            inputs.push(line.replace(re, function (match, p1) {
              return textEscape(p1);
            }));

            if(i + 1 < lines.length) {line = lines[++i];inc = true;}
            else break;

            _initMatched = true;
          }

          if(!_initMatched) continue;

          while (line.search(/^\s*>/) == -1) {
            tasks.push(tab + line);

            if(i + 1 < lines.length) {line = lines[++i];inc = true;}
            else break;
          }

          while (line.startsWith(step + '>') /*line.search(/^\s*>/) != -1*/) {
            //console.log(step + (i+1) + ' outputs parseDialog');

            outputs.push(line.replace(/^\s*>\s*(.*)\s*$/g, function (match, p1) {
              p1 = textEscape(p1);
              var _m;

              if((_m = p1.match(/if\s*\(\s*(.*)\s*\)\s*(.*)+/))) {
                var str;
                str = 'if: ' + textEscape(_m[1]) + ', output: ' + textEscape(_m[2]);

                if (lines[i + 1] && (match = lines[i + 1].match(new RegExp('^(' + step + '\\s+)<'))) != undefined) {
                  if (i + 1 < lines.length) {
                    line = lines[++i];
                    inc = true;
                  }
                  // else break;

                  //console.log(step + (i+1) + ' before parseDialog 1');
                  children = parseDialog(match[1]);
                  //console.log(step + (i+1) + ' after parseDialog 1');
                  if (children) str += ', \n' + step + tab + tab + 'children: [\n' + children + '\n' + step + tab + ']';
                }

                str = '\n' + step + tab + '{' + str + '}';
                return str;
              } else if(_m = p1.match(/iff\s*\(\s*(.*)\s*\)\s*(.*)+/)) {
                var str;
                str = 'if: ' + _m[1] + ', output: ' + textEscape(_m[2]);

                if (lines[i + 1] && (match = lines[i + 1].match(new RegExp('^(' + step + '\\s+)<'))) != undefined) {
                  if (i + 1 < lines.length) {
                    line = lines[++i];
                    inc = true;
                  }
                  // else break;

                  //console.log(step + (i+1) + ' before parseDialog 1');
                  children = parseDialog(match[1]);
                  //console.log(step + (i+1) + ' after parseDialog 1');
                  if (children) str += ', \n' + step + tab + tab + 'children: [\n' + children + '\n' + step + tab + ']';
                }

                str = '\n' + step + tab + '{' + str + '}';
                return str;
              } else {
                if(lines[i+1] && (match = lines[i+1].match(new RegExp('^(' + step + '\\s+)<'))) != undefined) {
                  var str = p1;
                  if(i + 1 < lines.length) {line = lines[++i];inc = true;}
                  // else break;

                  //console.log(step + (i+1) + ' before parseDialog 1');
                  children = parseDialog(match[1]);
                  //console.log(step + (i+1) + ' after parseDialog 1');
                  if(children) {
                    // str = 'output: ' + str;
                    str += ', \n' + step + tab + tab + 'children: [\n' + children + '\n' + step + tab + ']';
                  }

                  if(outputs.length >= 1) return '\n' + step + tab + '{' + 'output: ' + str + '}';
                  else return str;
                } else return p1;
              }
            }));

            if(i + 1 < lines.length) {line = lines[++i];inc = true;}
            else break;
          }
        }

        // while (line.search(/^\s*$/) != -1 || line.search(/^\s*\/\/(.*)$/) != -1) {
        //   if(i + 1 < lines.length) {line = lines[++i];inc = true;}
        //   else break;
        // }

        if((match = line.match(new RegExp('^(' + step + '\\s+)<'))) != undefined) {
          //console.log(step + (i+1) + ' before parseDialog 2');
          children = parseDialog(match[1]);
          //console.log(step + (i+1) + ' after parseDialog 2');
        } else {
          children = null;
        }

        // while (line.search(/^\s*$/) != -1 || line.search(/^\s*\/\/(.*)$/) != -1) {
        //   if(i + 1 < lines.length) {line = lines[++i];inc = true;}
        //   else break;
        // }

        dialog += step + '{';

        var add = false;
        if(add) {dialog += ','; } add = true;
        dialog += '\n' + step + tab + 'id: ' + (number++);

        if(name) {
          if(add) {dialog += ','; } add = true;
          dialog += '\n' + step + tab + 'name: ' + name;
        }

        if (inputs.length == 1) {
          if(inputs[0] != '') {
            if(add) {dialog += ','; } add = true;
            dialog += '\n' + step + tab + 'input: ' + inputs[0];
          }
        } else {
          if(add) {dialog += ','; } add = true;
          dialog += '\n' + step + tab + 'input: [' + inputs.join(', ') + ']';
        }

        if (tasks.length > 0) {
          if(add) {dialog += ','; } add = true;
          dialog += '\n' + step + tab + 'task: ' + tasks.join('\n');
        }

        if (outputs.length == 1) {
          if(add) {dialog += ','; add = true;}
          dialog += '\n' + step + tab + 'output: ' + outputs[0];
        } else {
          if(add) {dialog += ','; } add = true;
          dialog += '\n' + step + tab + 'output: [' + outputs.join(', ') + ']';
        }

        if(children) {
          if(add) {dialog += ','; } add = true;
          dialog += '\n' + step + tab + 'children: [\n' + children + '\n' + step + tab + ']';
        }

        dialog += '\n' + step + '}';

        dialogs.push(dialog);
      }

      if(!line.startsWith(step)) {
        if(inc) i--;
        //console.log(step + (i+1) + ' end parseDialog 1');
        return dialogs.join(',\n');
      }

      // if(!isCommon && !inc && dialogs.length == 0 && step === '' && !(line.startsWith(step + 'c<') || line.startsWith(step + '<') || line.search(new RegExp('^'+step + '[^<>]*\s*:')) != -1)) {
      if(!isCommon && !inc && dialogs.length == 0 && step === '' && line.search(/\s+</) == -1 && !line.startsWith('>')) {
        jsLines.push(line);
      }

      if(inc) i--;
      //console.log(step + (i+1) + ' end parseDialog 2');
    }

    return dialogs.join(',\n');
  };

  if(isCommon) {
    output = 'var commonDialogs = [\n' + parseDialog('') + '\n];\n\n';
  } else {
    output = 'var dialogs = [\n' + parseDialog('') + '\n];';
    output = jsLines.join('\n') + '\n\n' + output;
  }

  // console.log(output);

  return output;
}

//var str = fs.readFileSync(path.resolve('custom_modules/sample/sample.dlg'), 'utf8');
//build(str);

// botBuild('sample');

