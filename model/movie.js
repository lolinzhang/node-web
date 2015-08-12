var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var MovieSchema = new Schema({
    name : String
});

var Movie = mongodb.mongoose.model("Movie", MovieSchema);

var MovieDAO = function(){};

module.exports = new MovieDAO();

MovieDAO.prototype.save = function(obj, callback){
    var instance = new Movie(obj);
    instance.save(function(err){
        callback(err);
    });
};

MovieDAO.prototype.findByName = function(name, callback) {
    Movie.findOne({name:name}, function(err, obj){
        callback(err, obj);
    });
};
