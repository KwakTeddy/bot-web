
exports.mergeJSON = mergeJSON;

function mergeJSON(source1,source2){
  if(!source1 && !source2) return undefined;
  else if(!source1 && source2) return source2;
  else if(source1 && !source2) return source1;

  var mergedJSON = Object.assign({}, source1);

  for (var attrname in source2) {
    if ( source2[attrname]!=null && source2[attrname].constructor==Object ) {
      mergedJSON[attrname] = mergeJSON(source1[attrname], source2[attrname]);

    } else {
      mergedJSON[attrname] = source2[attrname];

    }

  }

  return mergedJSON;
}
