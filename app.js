/**
 * Module dependencies.
 */

var express = require("express");
var logger = require("morgan");
var session = require("express-session");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = module.exports = express();

// settings

// which prevents the need for extensions
//app.set("view engine", "jade");
//app.engine('.html', require('ejs').__express);
app.set('view engine', 'ejs');

// set views for error and 404 pages
app.set("views", __dirname + "/views");

// define a custom res.message() method
// which stores messages in the session
app.response.message = function(msg){
    // reference `req.session` via the `this.req` reference
    var sess = this.req.session;
    // simply add the msg to an array for later
    sess.messages = sess.messages || [];
    sess.messages.push(msg);
    return this;
};

// log
if(!module.parent){
    app.use(logger("dev"));
}

// serve static files
app.use("/static", express.static(__dirname + "/public"));

// session support
app.use(session({
    resave : false, // don't save session if unmodified
    saveUninitialized : false,  // don't create session until something stored
    secret: 'some secret here'
}));

// parse request bodies (req.body)
app.use(bodyParser.urlencoded({extended : true}));

// allow overriding methods in query (?_method=put)
app.use(methodOverride("_method"));

// expose the "messages" local variable when views are rendered
app.use(function(req, res, next){
    var msgs = req.session.messages || [];

    // expose "messages" local variable
    res.locals.messages = msgs;

    // expose "hasMessages"
    res.locals.hasMessages = !! msgs.length;

    next();

    // empty or "flush" the messages so they
    // don't build up
    req.session.messages = [];
});

// Session-persisted message middleware
app.use(function(req, res, next){
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = "";
    if(err){
        res.locals.message = '<p class="msg error">' + err + '</p>';
    }

    if(msg){
        res.locals.message = '<p class="msg success">' + msg + '</p>';
    }

    next();
});

// load controllers
require("./lib/router")(app, { verbose : !module.parent });

app.use(function(err, req, res, next){
    //log it
    if(!module.parent){
        console.error(err.stack);
    }

    // error page
    res.status(500).render("5xx");
});

// assume 404 since no middleware responded
app.use(function(req, res, next){
    res.status(404).render("404", { url : req.originalUrl});
});

/* istanbul ignore next */
if(!module.parent){
    app.listen(3000);
    console.log('Express started on port 3000');
}