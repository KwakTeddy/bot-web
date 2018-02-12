var crypto    = require('crypto');
var text      = '302019054';
var secret    = '2003'; //make this your secret!!

// console.log('https://billgates-web.kakao.com/r/selfMeter/tms/2003?billerUserKey=' + text + '&hashCode=' + crypto.createHmac("sha256", secret).update(text).digest('base64') + '&UTM_SOURCE=sclgas&UTM_MEDIUM=lms&UTM_CAMPAIGN=meter');


var hmac = crypto.createHmac('sha512', secret);
hmac.write(text);
hmac.end()
var result = hmac.read();
result = new Buffer(result).toString('base64');
// console.log('https://billgates-web.kakao.com/r/selfMeter/tms/2003?billerUserKey=' + text + '&hashCode=' + result + '&utm_source=sclgas&utm_medium=lms&utm_campaign=meter');
console.log('https://billgates-web.kakao.com/r/selfMeter/tms/2003?billerUserKey=' + text + '&hashCode=' + crypto.createHmac("SHA256", secret).update(text).digest('base64') + '&utm_source=sclgas&utm_medium=lms&utm_campaign=meter');
//zqdO4nziFU2sduOPB86xPmAHl0HFkrY-kRk9ExzDCfI
//zqdO4nziFU2sduOPB86xPmAHl0HFkrY+kRk9ExzDCfI=

var CryptoJS = require('crypto-js');
var hash = CryptoJS.HmacSHA256(text, secret);
var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

console.log(hashInBase64);
