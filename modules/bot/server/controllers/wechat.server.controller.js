
exports.message =  function(req, res) {
  var signature = req.query['signature'];
  var timestamp = req.query['timestamp'];
  var nonce = req.query['nonce'];
  var echostr = req.query['echostr'];

  console.log('signature: ' + signature);
  console.log('timestamp: ' + timestamp);
  console.log('nonce: ' + nonce);
  console.log('echostr: ' + echostr);

  res.write(echostr);
  res.end();
}