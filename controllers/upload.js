var multiparty = require('multiparty');
var format = require('util').format;
var fs = require('fs');
var _updir = __dirname + '/../public/upload/';

exports.show = function(req, res, next){
    res.render('upload');
};

exports.upload = function(req, res, next){
    var form = new multiparty.Form({ uploadDir : _updir});
    var image;
    var title;
    var fileName;
    form.on('error', next);
    form.on('close', function(){
        console.log("on close");
        res.send("finish");
    });
    form.on('field', function(name, val){
        console.log("on field " + name + '\t' + val);
        if (name !== 'title') return;
        title = val;
    });

    // listen on part event for image file
    form.on('part', function(part) {
        console.log("on part : " + part.filename);
        if (!part.filename) return;
        if (part.name !== 'image') return part.resume();
        image = {};
        image.filename = part.filename;
        image.size = 0;
        part.on('data', function (buf) {
            image.size += buf.length;
        });
        fileName = part.filename;
    });

    form.on('file', function(name,file){
        console.log("on file:", name + '\t' + file.path + '\t' + file.originalFilename);

        var tmp_path = file.path;
        var target_path = fileName || file.path;
        fs.renameSync(tmp_path, target_path, function(err) {
            if(err) console.error(err.stack);
        });
    });

    // parse the form
    form.parse(req);
};