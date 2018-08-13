var path = require('path');
var fs = require('fs');
var Q = require('q');

exports.readFirstLine = function (path) {
  return Q.promise(function (resolve, reject) {
    var rs = fs.createReadStream(path, {encoding: 'utf8'});
    var acc = '';
    var pos = 0;
    var index;
    rs
      .on('data', function (chunk) {
        index = chunk.indexOf('\n');
        acc += chunk;
        index !== -1 ? rs.close() : pos += chunk.length;
      })
      .on('close', function () {
        resolve(acc.slice(0, pos + index));
      })
      .on('error', function (err) {
        reject(err);
      })
  });
};

exports.merge = merge;

function merge(source1, source2, overwrite){
  if(!source1 && !source2) return undefined;
  else if(!source1 && source2) return source2;
  else if(source1 && !source2) return source1;

  for (var attrname in source2) {
    if(overwrite) {
      if (source2[attrname] && source2[attrname].constructor==Object) {
        source1[attrname] = cloneWithParent(source2[attrname]);
      } else {
        source1[attrname] = source2[attrname];
      }
    } else if(!source1[attrname]) {
      if (source2[attrname] && source2[attrname].constructor==Object) {
        source1[attrname] = cloneWithParent(source2[attrname]);
      } else {
        source1[attrname] = source2[attrname];
      }
    }
  }

  return source1;
}



exports.mergeWithClone = mergeWithClone;
function mergeWithClone(source1, source2){
  if(!source1 && !source2) return undefined;
  else if(!source1 && source2) return source2;
  else if(source1 && !source2) return source1;

  var merged = Object.assign({}, source1);

  for (var attrname in source2) {
    if ( source2[attrname]!=null && source2[attrname].constructor==Object ) {
      merged[attrname] = mergeWithClone(source1[attrname], source2[attrname]);
    } else {
      merged[attrname] = source2[attrname];
    }
  }

  return merged;
}

exports.clone = clone;

function clone(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return obj;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

exports.cloneWithParent = cloneWithParent;

function cloneWithParent(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return obj;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = cloneWithParent(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        if(attr.startsWith('parent') || attr.startsWith('top')) copy[attr] = obj[attr];
        else copy[attr] = cloneWithParent(obj[attr]);
      }
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

exports.cloneWithoutCycle = cloneWithoutCycle;

function cloneWithoutCycle(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return obj;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = cloneWithoutCycle(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        if(!attr.startsWith('parent') && !attr.startsWith('top') && !attr.startsWith('topTask'))
          copy[attr] = cloneWithoutCycle(obj[attr]);
      }
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

exports.requireNoCache = requireNoCache;
function requireNoCache(filePath, isForce) {
  if(process.env.NODE_ENV == 'development' || isForce == true)
    delete require.cache[require.resolve(filePath)];
  return require(require.resolve(filePath));
}


function convertEncoding(from, to, str) {
  var Iconv  = require('iconv').Iconv;
  var iconv = new Iconv(from.toUpperCase(), to + '//TRANSLIT//IGNORE');
  return iconv.convert(new Buffer(str, 'binary')).toString(to);
}
exports.convertEncoding = convertEncoding;

function findConcepts(context, name) {
  var concepts;
  if ((concepts = context.bot.concepts)) {
    if(concepts[name] && Array.isArray(concepts[name])) {
      return [name].concat(concepts[name]);
    }
  }

  if ((concepts = context.global.concepts)) {
    if(concepts[name] && Array.isArray(concepts[name])) {
      return [name].concat(concepts[name]);
    }
  }

  return [name];
}

exports.findConcepts = findConcepts;

function conceptsString(context, name) {
  var concepts;
  if ((concepts = context.bot.concepts)) {
    if(concepts[name] && Array.isArray(concepts[name])) {
      return name + '|' + concepts[name].join('|');
    }
  }

  if ((concepts = context.global.concepts)) {
    if(concepts[name] && Array.isArray(concepts[name])) {
      return name + '|' + concepts[name].join('|');
    }
  }

  return name;
}

exports.conceptsString = conceptsString;


function conceptRegExp(context, regexp) {
  if(regexp == undefined) return regexp;

  var match = regexp.toString().match(new RegExp('^/(.*?)/([gimy]*)$'));
  if (match) {
    var str = match[1];

    str = str.replace(/~([0-9a-zA-Z가-힣]+)/g, function (match, p1) {
      return '(?:' + conceptsString(context, p1) + ')';
    });

    return new RegExp(str, regexp.flags);
  } else {
    try {
      var str = regexp;

      str = str.replace(/~([0-9a-zA-Z가-힣]+)/g, function (match, p1) {
        return '(?:' + conceptsString(context, p1) + ')';
      });

      return new RegExp(str, regexp.flags);
    } catch(e) {
      return null;
    }
  }
}

exports.concepRegExp = conceptRegExp;


function toDialogString(object) {
  if(object == undefined)
    return 'undefined';
  else if(object instanceof RegExp)
    return object.toString();
  else if(object instanceof Function)
    return 'function ' + object.name;
  else if(typeof object == 'string') {
    var idx = object.indexOf('\n');
    if(idx != -1) return object.substring(0, idx);
    else return object;
  } else if(Array.isArray(object)) {
    var strs = [];
    for (var i = 0; i < object.length; i++) {
      var obj = object[i];
      strs.push(toDialogString(obj));
    }

    return '[' + strs.join(', ') + ']';
  } else if (object.key == 'children') {
    return 'children';
  } else if(typeof object == 'object') {
    if (object.typeCheck) {
      return object.name + 'Type';
    } else {
      var strs = [];

      for (var key in object) {
        if(key=='output' && Array.isArray(object[key])) strs.push(key + ': outputs');
        else strs.push(key + ': ' + toDialogString(object[key]));
      }

      return '{' + strs.join(', ') + '}';
    }
  } else {
    return object.toString();
  }
}

exports.toDialogString = toDialogString;


RegExp.escape = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


function readdirRecursive (dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(readdirRecursive(file))
    else results.push(file)
  });
  return results
}

exports.readdirRecursive = readdirRecursive;


function censor(censor) {
  var i = 0;

  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
      return '[Circular]';

    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;
  }
}

exports.censor = censor;

var os = require('os');
function getLocalIPAddress() {

  var _address = '127.0.0.1';
  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        _address = address.address;
        // addresses.push(address.address);
      }
    }
  }

  return _address;
}

exports.getLocalIPAddress = getLocalIPAddress;
