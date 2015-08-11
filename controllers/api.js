var repos = [
    { name: 'express', url: 'http://github.com/strongloop/express' }
    , { name: 'stylus', url: 'http://github.com/learnboost/stylus' }
    , { name: 'cluster', url: 'http://github.com/learnboost/cluster' }
];

exports.repos = function(req, res, next){
    res.send(repos);
};

exports.reposQuery = function(req, res, next){
    var name = req.params.name;
    for(var i = 0; i < repos.length; i++){
        if(repos[i].name == name){
            res.send(repos[i]);
            return;
        }
    }
    res.send('cant find.');
};