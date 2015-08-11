
var express = require("express");
var user = require(__dirname + "/../controllers/user");
var index = require(__dirname + "/../controllers/index");
var files = require(__dirname + "/../controllers/file");
var upload = require(__dirname + "/../controllers/upload");
var api = require(__dirname + "/../controllers/api");


module.exports = function(parent, options) {
    var urls = [
        {
            index : 1,
            list : [
                {
                    key : '/',
                    handler : index.index,
                    method : 'get'
                },
                {
                    key : '/login',
                    handler : user.login,
                    method : "get"
                },
                {
                    key : '/dologin',
                    handler : user.dologin,
                    method : "post"
                },
                {
                    key : '/files/:file(*)',
                    handler : files.download,
                    method : "get"
                },
                {
                    key : '/upload',
                    handler : upload.show,
                    method : "get"
                },
                {
                    key : '/upload',
                    handler : upload.upload,
                    method : "post"
                },
                {
                    key : '/api/repos',
                    handler : api.repos,
                    method : "get"
                },
                {
                    key : '/api/repos/:name',
                    handler : api.reposQuery,
                    method : "get"
                },
            ]
        },
        {
            index : 2,
            before : user.before,
            list : [
                {
                    key : '/users',
                    handler : user.list,
                    method : 'get'
                },
                {
                    key : '/users/:uid',
                    handler : user.view,
                    method : 'get'
                },
                {
                    key : '/users/:uid/edit',
                    handler : user.edit,
                    method : 'get'
                }
            ]
        }
    ];

    var verbose = options.verbose;
    var app = express();

    app.map = function (a, route) {
        for(var i = 0; i < a.length; i++){
            var p = a[i];
            var before = p.before;
            var after = p.after;
            //var template
            var list = p.list;
            for(var j = 0; j < list.length; j++){
                var r = list[j];
                var key = r.key;
                var handler = r.handler;
                var method = r.method;

                if(before && after){
                    app[method](key, before, handler, after);
                }else if(before){
                    app[method](key, before, handler);
                }else if(after){
                    app[method](key, handler, after);
                }else{
                    app[method](key, handler);
                }
            }
        }
    }

    app.map(urls);
    parent.use(app);
}
