var path = require('path');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Report = mongoose.model('Report');

var nodemailer = require('nodemailer');
var config = require(path.resolve('./config/config'));
var smtpTransport = nodemailer.createTransport(config.mailer.options);

var fs = require('fs');

var BoardContents = mongoose.model('BoardContents');


module.exports.core = function(req, res, next)
{
    if(req.user.roles.indexOf('admin') == -1)
      return res.status(401).end();

    next();
};

module.exports.findCloseBetaUser = function(req, res, next)
{
    User.find({ username: /user/ }, {username: true, email: true, displayName: true, created: true, state: true}).sort({ state: -1, created: -1 }).lean().exec(function(err, list)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        res.jsonp(list);
    });
};

module.exports.approveCloseBetaUser = function(req, res, next)
{
    User.findOne({ email: req.body.email }).exec(function(err, user)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }


        if(user)
        {
            user.state = true;
            user.save(function(err)
            {
                if(err)
                {
                    console.error(err);
                    return res.status(400).send({ error: err });
                }

                var subject = {
                    ko: "클로즈베타 승인 완료",
                    en: "Play Chat Closed Beta Approved",
                    zh: "PlayChat封闭测试版批准",
                    jp: "PlayChatクローズドベータ承認済み"
                }

                var mailOptions = {
                    to: user.email,
                    from: config.mailer.from,
                    subject: subject[req.user.language],
                    html: fs.readFileSync(path.resolve('./modules/admin/server/controllers/template/approve.' + req.user.language + '.server.view.html')).toString()
                };

                smtpTransport.sendMail(mailOptions, function (err)
                {
                    if (!err)
                    {
                        return res.status(200).send({ message: 'An email has been sent to the provided email with further instructions.' });
                    }
                    else
                    {
                        console.log(err);
                        return res.status(400).send({ message: 'Failure sending email' });
                    }
                });
            });
        }
        else
        {
            res.status(404).send();
        }
    });
};


module.exports.saveReporting = function(req, res)
{
    var report = new Report();

    report.content = req.body.content;
    report.email = req.user.email;

    report.save(function(err)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        res.jsonp(report);
    });
};


// added by Leon for teddy

module.exports.page = function(req,res){
    var page = req.param('page');
    if(page == null) {page = 1;}

    var skipSize = (page-1)*10;
    var limitSize = 10;
    var pageNum = 1;


    BoardContents.count({deleted:false},function(err, totalCount){
        // db에서 날짜 순으로 데이터들을 가져옴
        if(err) throw err;

        pageNum = Math.ceil(totalCount/limitSize);
        BoardContents.find({deleted:false}).sort({date:-1}).skip(skipSize).limit(limitSize).exec(function(err, pageContents) {
            if(err) throw err;


            res.send({title: "Board", contents: pageContents, pagination: pageNum, searchWord: ''});
        });
    });
}



module.exports.search = function(req, res) {
    var search_word = req.param('searchWord');
    var searchCondition = {$regex:search_word};

    var page = req.param('page');
    if(page == null) {page = 1;}
    var skipSize = (page-1)*10;
    var limitSize = 10;
    var pageNum = 1;

    BoardContents.count({deleted:false, $or:[{title:searchCondition},{contents:searchCondition},{writer:searchCondition}]},function(err, searchCount){
        if(err) throw err;
        pageNum = Math.ceil(searchCount/limitSize);

        BoardContents.find({deleted:false, $or:[{title:searchCondition},{contents:searchCondition},{writer:searchCondition}]}).sort({date:-1}).skip(skipSize).limit(limitSize).exec(function(err, searchContents){
            if(err) throw err;

            res.send({title: "Board", contents: searchContents, pagination: pageNum, searchWord: search_word});
        });
    });
}


module.exports.addBoard = function(req, res) {

    var data = req.body;
    var newBoardContents = new BoardContents();
    newBoardContents.writer = data.writer;
    newBoardContents.title = data.title;
    newBoardContents.contents = data.content;
    newBoardContents.password = data.password;

    newBoardContents.save(function (err,rtn) {
        if (err)
            return res.status(300).send(err.toJSON());
        else
            return res.send({status:true,data:rtn._id});

        BoardContents.findOne({_id: rtn._id}, {_id: 1}, function (err, newBoardId) {
            if (err) res.status(300).send(err.toJSON());

            if (upFile && upFile != null) {
                var renaming = renameUploadFile(newBoardId.id, upFile);

                for (var i = 0; i < upFile.length; i++) {
                    fs.rename(renaming.tmpname[i], renaming.fsname[i], function (err) {
                        if (err) res.status(300).send(err.toJSON());
                    });
                }

                for (var i = 0; i < upFile.length; i++) {
                    BoardContents.update({_id: newBoardId.id}, {$push: {fileUp: renaming.fullname[i]}}, function (err) {
                        if (err) res.status(300).send(err.toJSON());
                    });
                }
            }
        });
    });
}



module.exports.modBoard = function (req, res) {
    var modContent = content.replace(/\r\n/gi, "\\r\\n");

    BoardContents.findOne({_id:id}, function(err, originContent){
        if(err) throw err;
        originContent.updated.push({title: originContent.title, contents:originContent.contents});
        originContent.save(function(err){
            if(err) throw err;
        });
    });

    BoardContents.update({_id:id}, {$set: {title: title, contents: modContent, date: Date.now()}}, function(err) {
        if(err) throw err;
    });
}

module.exports.addComment = function (id, writer, comment) {
    BoardContents.findOne({_id: id}, function(err, rawContent){
        if(err) throw err;

        rawContent.comments.unshift({name:writer, memo: comment});
        rawContent.save(function(err){
            if(err) throw err;
        });
    });
}

module.exports.getFileDate = function(req, res) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    var fullDate = year+""+month+""+day+""+hour+""+min+""+sec;

    return fullDate
}

module.exports.uploadFile = function(req, res) {
    //field name은 form의 input file의 name과 같아야함
    // 글 작성하고 submit하게 되면 저장이 되는 부분
    // 글 수정하고 submit하면 수정된 결과가 저장되는 부분
    var mode = req.param('mode');

    var addNewTitle = req.body.addContentSubject;
    var addNewWriter = req.body.addContentWriter;
    var addNewPassword = req.body.addContentPassword;
    var addNewContent = req.body.addContents;
    var upFile = req.files; // 업로드 된 파일을 받아옴

    var modTitle = req.body.modContentSubject;
    var modContent = req.body.modContents;
    var modId = req.body.modId;

    if(mode == 'add') {
        if (isSaved(upFile)) { // 파일이 제대로 업로드 되었는지 확인 후 디비에 저장시키게 됨
            addBoard(addNewTitle, addNewWriter, addNewContent, addNewPassword, upFile);
            res.redirect('/boards');
        } else {
            console.log("파일이 저장되지 않았습니다!");
        }
    } else {
        modBoard(modId, modTitle, modContent);
        res.redirect('/boards');
    }
}


module.exports.renameUploadFile = function(req, res) {
    // 업로드 할때 리네이밍 하는 곳!
    var renameForUpload = {};
    var newFile = upFile; // 새로 들어 온 파일
    var tmpPath = [];
    var tmpType = [];
    var index = [];
    var rename = [];
    var fileName = [];
    var fullName = []; // 다운로드 시 보여줄 이름 필요하니까 원래 이름까지 같이 저장하자!
    var fsName = [];

    for (var i = 0; i < newFile.length; i++) {
        tmpPath[i] = newFile[i].path;
        tmpType[i] = newFile[i].mimetype.split('/')[1]; // 확장자 저장해주려고!
        index[i] = tmpPath[i].split('/').length;
        rename[i] = tmpPath[i].split('/')[index[i] - 1];
        fileName [i] = itemId + "_" + getFileDate(new Date()) + "_" + rename[i] + "." + tmpType[i]; // 파일 확장자 명까지 같이 가는 이름 "글아이디_날짜_파일명.확장자"
        fullName [i] = fileName[i] + ":" + newFile[i].originalname.split('.')[0]; // 원래 이름까지 같이 가는 이름 "글아이디_날짜_파일명.확장자:보여줄 이름"
        fsName [i] = getDirname(1)+"upload/"+fileName[i]; // fs.rename 용 이름 "./upload/글아이디_날짜_파일명.확장자"
    }

    renameForUpload.tmpname = tmpPath;
    renameForUpload.filename = fileName;
    renameForUpload.fullname = fullName;
    renameForUpload.fsname = fsName;

    return renameForUpload;
}

// module.experts.getDirname = function(req, res) {
//     //원하는 상위폴더까지 리턴해줌. 0은 현재 위치까지, 1은 그 상위.. 이런 식으로
//     // 리네임과, 파일의 경로를 따오기 위해 필요함.
//
//     var order = num;
//     var dirname = __dirname.split('/');
//     var result = '';
//
//     for(var i=0;i<dirname.length-order;i++){
//         result += dirname[i] + '/';
//     }
//
//     return result;
// }

module.exports.isSaved = function (req, res) {
    var savedFile = upFile;
    var count = 0;

    if(savedFile != null) { // 파일 존재시 -> tmp폴더에 파일 저장여부 확인 -> 있으면 저장, 없으면 에러메시지
        for (var i = 0; i < savedFile.length; i++) {
            if(fs.statSync(getDirname(1) + savedFile[i].path).isFile()){ //fs 모듈을 사용해서 파일의 존재 여부를 확인한다.
                count ++; // true인 결과 갯수 세서
            };

        }
        if(count == savedFile.length){  //올린 파일 갯수랑 같으면 패스
            return true;
        }else{
            return false;
        }
    }else{ // 파일이 처음부터 없는 경우
        return true;
    }
}

// file download
module.exports.uploadFile = function (req, res) {
    var path = req.params.path;
    res.download('./upload/'+path, path);
    console.log(path);

}

// 댓글 다는 부분 - Posting Reply
module.exports.postingReply = function (req, res) {

    var data = req.body
    var reply_writer = data.replyWriter;
    var reply_comment = data.replyComment;
    var reply_id = data.replyId;

    addComment(reply_id, reply_writer, reply_comment);

    res.redirect('/boards/view?id='+reply_id);
}

// 댓글 ajax로 페이징 하는 부분
module.exports.getReply = function (req, res) {
    var id = req.param('id');
    var page = req.param('page');
    var max = req.param('max'); // 댓글 총 갯수 확인
    var skipSize = (page-1)*5;
    var limitSize = skipSize + 5;

    if(max < skipSize+5) {limitSize = max*1;} // 댓글 갯수 보다 넘어가는 경우는 댓글 수로 맞춰줌 (몽고디비 쿼리에서 limit은 양의 정수여야함)
    BoardContents.findOne({_id: id}, {comments: {$slice: [skipSize, limitSize]}} , function(err, pageReply){
        if(err) throw err;
        res.send(pageReply.comments);
    });
}


// 글 삭제하는 부분
module.exports.delete = function (req, res) {
    var contentId = req.param('id');
    BoardContents.update({_id:contentId}, {$set:{deleted:true}}, function(err){
        if(err) throw err;
        res.redirect('/boards');
    });
}

// 글 비밀번호 찾아오기
module.exports.getPW = function (req, res) {
    var id = req.param('id');
    BoardContents.findOne({_id: id}, function(err, rawContents){
        res.send(rawContents.password);
    });
}


// 글 상세보기
module.exports.getView = function (req, res) {
    var contentId = req.param('id');
    BoardContents.findOne({_id:contentId}, function(err, rawContent){
        if(err) throw err;
        rawContent.count += 1;
        var reply_pg = Math.ceil(rawContent.comments.length/5);
        rawContent.save(function(err){
            if(err) throw err;

            res.render('boardDetail',{title: "Board", content:rawContent, replyPage: reply_pg});
        });
    })
}

module.exports.postView = function (req, res) {
    var contentId = req.param('id');

    BoardContents.findOne({_id:contentId}, function(err, rawContent){
        if(err) throw err;
        rawContent.count += 1;
        var reply_pg = Math.ceil(rawContent.comments.length/5);

        rawContent.save(function(err){
            if(err) throw err;

            res.send({title: "Board", content:rawContent, replyPage: reply_pg});
        });
    })
}
