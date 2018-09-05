var AdminController = require('../controllers/admin.server.controller.js');
var TemplateAdminController = require('../controllers/template-admin.server.controller.js');

module.exports = function(app)
{
    app.all('/api/admin/*', AdminController.core);
    app.get('/api/template-categories', TemplateAdminController.findTemplateCategories);
    app.post('/api/admin/templates', TemplateAdminController.createTemplate);
    app.get('/api/admin/users/closed-beta', AdminController.findCloseBetaUser);
    app.post('/api/admin/users/closed-beta', AdminController.approveCloseBetaUser);

    app.post('/api/reporting', AdminController.saveReporting);

    app.post('/api/cs/addBoard', AdminController.addBoard);
    // app.get('/api/cs/board', AdminController);
    app.post('/api/cs/page', AdminController.page);
    app.get('/api/cs/search', AdminController.search);
    app.post('/api/cs/upload', AdminController.uploadFile);
    app.post('/api/cs/reply', AdminController.postingReply);
    app.get('/api/cs/reply', AdminController.getReply);
    app.get('/api/cs/delete', AdminController.delete);
    app.get('/api/cs/view', AdminController.getView);
    app.post('/api/cs/view', AdminController.postView);


};


/*

router.get('/', function(req,res){
    // 처음 index로 접속 했을시 나오는 부분
    // db에서 게시글 리스트 가져와서 출력
    // pagination 추가 -> 11/17
    // page는 1-5까지 보여줌 -> db에서 총 갯수 잡아와서 10으로 나눠서 올림해야함
    // 한페이지에 10개의 게시글: limit: 10, skip: (page-1)*10 이면 될 듯
    // page number는 param으로 받아오기 가장 처음엔 param 없으니까 그땐 자동 1로 설정
    res.render('board');


    // var page = req.param('page');
    // if(page == null) {page = 1;}
    //
    // var skipSize = (page-1)*10;
    // var limitSize = 10;
    // var pageNum = 1;
    //
    //
    // BoardContents.count({deleted:false},function(err, totalCount){
    //     // db에서 날짜 순으로 데이터들을 가져옴
    //     if(err) throw err;
    //
    //     pageNum = Math.ceil(totalCount/limitSize);
    //     BoardContents.find({deleted:false}).sort({date:-1}).skip(skipSize).limit(limitSize).exec(function(err, pageContents) {
    //         if(err) throw err;
    //
    //
    //         res.render('board', {title: "Board", contents: pageContents, pagination: pageNum, searchWord: ''});
    //     });
    // });

});

router.post('/page',function(req,res){
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
})

router.get('/search', function(req, res){
    // 글 검색하는 부분

    res.render('board');


    // var search_word = req.param('searchWord');
    // var searchCondition = {$regex:search_word};
    //
    // var page = req.param('page');
    // if(page == null) {page = 1;}
    // var skipSize = (page-1)*10;
    // var limitSize = 10;
    // var pageNum = 1;
    //
    // BoardContents.count({deleted:false, $or:[{title:searchCondition},{contents:searchCondition},{writer:searchCondition}]},function(err, searchCount){
    //     if(err) throw err;
    //     pageNum = Math.ceil(searchCount/limitSize);
    //
    //     BoardContents.find({deleted:false, $or:[{title:searchCondition},{contents:searchCondition},{writer:searchCondition}]}).sort({date:-1}).skip(skipSize).limit(limitSize).exec(function(err, searchContents){
    //         if(err) throw err;
    //
    //         res.render('board', {title: "Board", contents: searchContents, pagination: pageNum, searchWord: search_word});
    //     });
    // });
});

router.post('/search',function(req, res){
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
});


router.post('/', upload.array('UploadFile'),function(req, res){
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
});

router.get('/download/:path', function(req, res){
    // file download

    var path = req.params.path;
    res.download('./upload/'+path, path);
    console.log(path);
});

router.post('/reply', function(req, res){
    // 댓글 다는 부분
    var reply_writer = req.body.replyWriter;
    var reply_comment = req.body.replyComment;
    var reply_id = req.body.replyId;

    addComment(reply_id, reply_writer, reply_comment);

    res.redirect('/boards/view?id='+reply_id);
});

router.get('/reply', function(req, res) {
    // 댓글 ajax로 페이징 하는 부분
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
});

router.get('/delete', function(req, res) {
    // 삭제하는 부분

    var contentId = req.param('id');

    BoardContents.update({_id:contentId}, {$set:{deleted:true}}, function(err){
        if(err) throw err;
        res.redirect('/boards');
    });
});

router.get('/view', function(req, res){
    // 글 보는 부분. 글 내용을 출력하고 조회수를 늘려줘야함
    // 댓글 페이지 추가 해줌, 5개씩 출력함

    res.render('boardDetail');
    // var contentId = req.param('id');
    //
    // BoardContents.findOne({_id:contentId}, function(err, rawContent){
    //     if(err) throw err;
    //     rawContent.count += 1;
    //     var reply_pg = Math.ceil(rawContent.comments.length/5);
    //
    //     rawContent.save(function(err){
    //         if(err) throw err;
    //
    //         res.render('boardDetail',{title: "Board", content:rawContent, replyPage: reply_pg});
    //     });
    // })
});

router.post('/view',function(req,res){
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
})

router.get('/password', function(req, res){
    // 글 비밀번호 찾아오기
    var id = req.param('id');

    BoardContents.findOne({_id: id}, function(err, rawContents){
       res.send(rawContents.password);
    });
});

 */
