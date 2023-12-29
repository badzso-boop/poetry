// src/models/comment.js
class Comment {
    constructor(id, userId, poemId, commentText, dateCommented, commenter) {
        this.id = id;
        this.userId = userId;
        this.poemId = poemId;
        this.commentText = commentText;
        this.dateCommented = dateCommented;
        this.commenter = commenter
    }
}
  
module.exports = Comment;