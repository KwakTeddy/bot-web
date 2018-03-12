'use strict';

var path = require('path');
var multer = require('multer');
var config = require(path.resolve('./config/config'));

var util = require('util');
var mongoose = require('mongoose');
// var OverTextLink = mongoose.model('OverTextLink');

var frontLanguage = require(path.resolve('./modules/core/server/controllers/front.language.js'));

var UserLog = mongoose.model('UserLog');


/**
 * Render the main application page
 */
exports.renderIndex = function (req, res, next)
{
    if(req.path.startsWith('/kakao') || req.path.startsWith('/line') || req.path.startsWith('/facebook') || req.path.startsWith('/navertalk') || req.path.startsWith('/wechat'))
    {
        return next();
    }

    if(req.path == '/')
    {
        var lanCategory = ['ko', 'en', 'zh', 'ja'];
        var browserLan = req.headers["accept-language"] ? req.headers["accept-language"].split('-')[0] : '';

        var queryLan = req.query.lan;
        var code = queryLan || browserLan;

        if(lanCategory.indexOf(code) == -1) code = 'en';

        res.render('modules/front/index', frontLanguage(code));
        return;
    }

    var path_uri = req.path;
    var path = path_uri.split('/');

    var platform = 'web';
    if(req.headers['user-agent'])
    {
        var ua = req.headers['user-agent'].toLowerCase();
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4)))
        {
            if (!req.path.startsWith("/mobile"))
            {
                platform = 'mobile';
            }
        }
    }

    req.session.platform = platform;

    console.log(req.subdomains);
    res.render('modules/core/server/views/layout', { user: req.user || null, platform: platform });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};


/**
 * get config
 */
exports.logging = function (req, res) {
    var userLog = new UserLog();
    userLog.userId = req.body.userId;
    userLog.url = req.body.url;
    userLog.botId = req.body.botId;

    userLog.save(function (err) {
        if(err)
        {
            console.log(err);
            return res.status(400).send({error: err});
        }
        res.end();
    })



};

/**
* get config
*/
exports.getConfig = function (req, res) {
  var configData = {};
  configData['facebook'] = {};
  configData.facebook['clientID'] = config.facebook.clientID;
  configData['enterprise'] = config.enterprise;
  res.json(configData);
};


/**
 * get fbOvertext
 */
exports.fbOvertext = function (req, res) {
  // OverTextLink.findOne({index: req.params.index}).exec(function (err, result) {
  //   if(err){
  //     console.log(err)
  //   }else {
  //     if(result){
  //       res.render('modules/core/server/views/facebookOvertext', {
  //         text: result.text,
  //         enterpriseName: config.enterprise.name ? config.enterprise.name : 'Moneybrain'
  //       });
  //     }else {
  //       res.render('modules/core/server/views/facebookOvertext', {
  //         text: '링크의 유효기간이 만료되었습니다',
  //         enterpriseName: config.enterprise.name ? config.enterprise.name : 'Moneybrain'
  //       });
  //     }
  //   }
  // });
};


/**
 * get notice
 */
exports.notice = function (req, res) {
  res.render('modules/core/server/views/notice', {
    text: '[유의사항]\n\n- 계약 체결 전 상품에 관한 상세한 사항은 상품설명서 및 약관을 읽어보시기 바랍니다. \n- 연체 이자율은 연체일수 및 약정금리에 따라 23.0~27.9%가 적용됩니다. \n- 신용카드 남용은 가계경제에 위협이 됩니다. \n- 수신거부 080-800-8114(무료) \n- 여신협회 심의필번호 제 2017-000-00000호',
    enterpriseName: '신한카드'
  });
};
