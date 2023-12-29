// src/models/like.js
class Like {
    constructor(id, userId, poemId, dateLiked, username) {
        this.id = id;
        this.userId = userId;
        this.poemId = poemId;
        this.dateLiked = dateLiked;
        this.username = username
    }
}
  
module.exports = Like;