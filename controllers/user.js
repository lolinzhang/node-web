/**
 * Module dependencies.
 */
var hash = require("../lib/pass.js").hash;

var users = {
    lolin: { name: 'lolin' }
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)
hash('lolin', function(err, salt, hash){
    if(err){
        throw err;
    }
    users.lolin.salt = salt;
    users.lolin.hash = hash;
});

function authenticate(name, pass, fn){
    if (!module.parent){
        console.log('authenticating %s:%s', name, pass);
    }
    var user = users[name];
    // query the db for the given username
    if(!user){
        return fn(new Error('can not find user'));
    }

    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    hash(pass, user.salt, function(err, hash){
        if(err){
            return fn(err);
        }
        if(hash == user.hash){
            return fn(null, user);
        }
        fn(new Error('password error'));
    });
}


exports.before = function(req, res, next){
    console.log("next:", req.originalUrl);
    if(req.session.user){
        next();
    }else{
        req.session.nextUri = req.originalUrl;
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
};

exports.login = function(req, res, next){
    res.render('login');
};

exports.dologin = function(req, res, next){
    authenticate(req.body.username, req.body.password, function(err, user){
        if (user) {
            var nextUri = req.session.nextUri;

            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function(){
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                console.log("do" + nextUri);
                req.session.user = user;
                if(nextUri){
                    res.redirect(nextUri);

                }else{
                    req.session.success = 'Authenticated as ' + user.name
                        + ' click to <a href="/logout">logout</a>. '
                        + ' You may now access <a href="/restricted">/restricted</a>.';
                    res.redirect('back');
                }


            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.'
                + ' (use "tj" and "foobar")';
            res.redirect('/login');
        }
    });
};

exports.list = function(req, res, next){
    res.send('user list');
};

exports.view = function(req, res, next){
    res.send('user ' + req.params.uid);
};

exports.edit = function(req, res, next){
    res.send('user ' + req.params.uid + " edit");
};

