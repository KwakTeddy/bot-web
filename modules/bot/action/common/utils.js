exports.merge = merge;

function merge(source1, source2){
  if(!source1 && !source2) return undefined;
  else if(!source1 && source2) return source2;
  else if(source1 && !source2) return source1;

  for (var attrname in source2) {
    if(!source1[attrname]) {
      if (source2[attrname].constructor==Object) {
        source1[attrname] = clone(source2[attrname]);
      } else {
        source1[attrname] = source2[attrname];
      }
    }
  }

  return source1;
};


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
};

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
};

exports.requireNoCache = requireNoCache;
function requireNoCache(filePath) {
  delete require.cache[require.resolve(filePath)];
  return require(filePath);
}


function convertEncoding(from, to, str) {
  var Iconv  = require('iconv').Iconv;
  var iconv = new Iconv(from.toUpperCase(), to + '//TRANSLIT//IGNORE');
  return iconv.convert(new Buffer(str, 'binary')).toString(to);
}
exports.convertEncoding = convertEncoding;