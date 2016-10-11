var fs = require('fs');
var path = require('path');
var logger = require(path.resolve('config/lib/logger'));
var utils = require(path.resolve('modules/bot/action/common/utils'));


function botBuild(bot) {
  var botDir = path.resolve('custom_modules/' + bot);
  var fileFilter = function(file) { return file.endsWith('dlg'); };

  var files;
  try {
    files = fs.readdirSync(botDir);
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
    var dlgPath = path.join(botDir, file);
    var info = path.parse(dlgPath);
    var jsPath = path.join(info.dir, info.name + '.dialog.js');

    if(fs.statSync(dlgPath).mtime <= fs.statSync(jsPath).mtime) {
      logger.info('botBuild: SKIP ' + file);

      continue;
    }

    logger.info('botBuild: ' + file);

    var text = fs.readFileSync(dlgPath, 'utf8');
    // console.log(text);
    var js = build(text, false);

    js = '\n' + js + '\n\n' + build(text, true);

    try {
      var include = fs.readFileSync(path.join(info.dir, 'include.js'), 'utf8');
      if(include) js = include + js;
    } catch(e) {}

    try {
      var include = fs.readFileSync(path.join(info.dir, info.name + '.include.js'), 'utf8');
      if(include) js = include + js;
    } catch(e) {}


    var tail = '\nvar bot = require(path.resolve("config/lib/bot"));\nbot.setDialogs("' + bot + '", dialogs);';
    tail += '\nbot.setGlobalDialogs("' + bot + '", globalDialogs);\n';
    js = js + tail;

    fs.writeFileSync(jsPath, js, 'utf8');
  }
}
exports.botBuild = botBuild;

function build(text, isCommon) {
  // var step = '';
  var output;
  var tab = '  ';

  var lines = text.split('\n');
  var i = 0;
  var textEscape = function(text) {
    text = text.replace(/\/\/(.*)/, '').trim();
    if(text.startsWith('{') || text.startsWith('/') || text.startsWith('if')   || text.startsWith('function') || text === 'false' || text === 'undefined' || text === 'null' || text == '') return text;
    else {
      return '\'' + text.replace(/'/g, '\\\'') + '\'';
    }
  };

  var parseDialog = function (step) {
    var dialogs = [];

    for (; i < lines.length; i++) {
      var line = lines[i];
      var inc = false;

      while (line.search(/^\s*$/) != -1 || line.search(/^\s*\/\/(.*)$/) != -1) {
        if(i + 1 < lines.length) {line = line = lines[++i];inc = true;}
        else break;
      }

      if (line.startsWith(step + (isCommon && (step === '')? 'c<':'<')) || line.search(new RegExp('^'+step + '[^<>]*\s*:')) != -1) {
        var dialog = '';
        var name;
        var inputs = [];
        var tasks = [];
        var outputs = [];
        var children;
        var match;

        if((match = line.match(new RegExp('^' + step + '([^<>]*)\s*:\s*(.*)'))) != undefined) {
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
          ((isCommon && line.indexOf('c<') != -1) || (!isCommon && line.indexOf('c<') == -1))) {
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

            if(i + 1 < lines.length) {line = line = lines[++i];inc = true;}
            else break;

            _initMatched = true;
          }

          if(!_initMatched) continue;

          while (line.search(/^\s*>/) == -1) {
            tasks.push(tab + line);

            if(i + 1 < lines.length) {line = line = lines[++i];inc = true;}
            else break;
          }

          while (line.search(/^\s*>/) != -1) {
            outputs.push(line.replace(/^\s*>\s*(.*)\s*$/g, function (match, p1) {
              p1 = textEscape(p1);
              var _m = p1.match(/if\s*\(\s*(.*)\s*\)\s*(.*)+/);
              if(_m) {
                return '{if: ' + textEscape(_m[1]) + ', output: ' + textEscape(_m[2]) + '}';
              } else return p1;
            }));

            if(i + 1 < lines.length) {line = line = lines[++i];inc = true;}
            else break;
          }
        }

        while (line.search(/^\s*$/) != -1 || line.search(/^\s*\/\/(.*)$/) != -1) {
          if(i + 1 < lines.length) {line = line = lines[++i];inc = true;}
          else break;
        }

        if((match = line.match(new RegExp('^(' + step + '\\s+)<'))) != undefined) {
          // if(inc) i--;
          children = parseDialog(match[1]);
        } else {
          children = null;
        }

        while (line.search(/^\s*$/) != -1 || line.search(/^\s*\/\/(.*)$/) != -1) {
          if(i + 1 < lines.length) {line = line = lines[++i];inc = true;}
          else break;
        }

        dialog += step + '{';

        var add = false;
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
        return dialogs.join(',\n');
      }

      if(inc) i--;
    }

    return dialogs.join(',\n');
  };

  if(isCommon) {
    output = 'var globalDialogs = [\n' + parseDialog('') + '\n];\n\n';
  } else {
    output = 'var dialogs = [\n' + parseDialog('') + '\n];\n\n';
  }

  // console.log(output);

  return output;
}

//var str = fs.readFileSync(path.resolve('custom_modules/sample/sample.dlg'), 'utf8');
//build(str);

botBuild('sample');

