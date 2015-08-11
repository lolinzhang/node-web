function User(name){
    this.name = name;
    this.id = 1;
    this.salt = '';
    this.hash = '';
}

User.prototype.toJson = function(){
    return {
        id : this.id,
        name : this.name
    };
};