exports.download = function(req, res, next){
    var file = req.params.file;
    var path = __dirname + '/../public/files/' + file;
    res.download(path, function(err){
        if (!err) return; // file sent
        if (err && err.status !== 404) return next(err); // non-404 error
        // file for download not found
        res.statusCode = 404;
        res.send('Cant find that file, sorry!');
    });
}