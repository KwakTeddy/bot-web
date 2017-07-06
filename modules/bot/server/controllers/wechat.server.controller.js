
exports.message =  function(req, res) {
  console.log(JSON.stringify(req));

  var signature = req.params['signature'];
  var timestamp = req.params['timestamp'];
  var nonce = req.params['nonce'];
  var echostr = req.params['echostr'];

  res.write(echostr);
  res.end();
}