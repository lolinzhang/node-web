var Movie = require("../model/movie");
//var logger = require(__dirname + '/../app').logger('movie');


exports.movieAdd = function(req, res, next){
    console.log("move....");

    if(req.params.name){//update
        return res.render('movie', {
            title:req.params.name+'|电影|管理|moive.me',
            label:'编辑电影:'+req.params.name,
            movie:req.params.name
        });
    } else {
        return res.render('movie',{
            title:'新增加|电影|管理|moive.me',
            label:'新增加电影',
            movie:false
        });
    }

};

exports.doMovieAdd = function(req, res, next){

    var json = JSON.parse(req.body.content);

    if(json._id){   //update

    }else{  //insert
        Movie.save(json, function(err){
            if(err){
                res.send({'success' : false});
            }
        });
    }
    res.send({'success':true});

};

exports.movieJson = function(req, res, next){
    Movie.findByName(req.params.name,function(err, obj){
        res.send(obj);
    });
};

exports.query = function(req, res, next){
    var query = {};
    if(req.query.name){
        query['name'] = new RegExp(req.query.name);
    }

    Movie.findByName(query.name,function(err, obj){
        res.send(obj);
    });
};