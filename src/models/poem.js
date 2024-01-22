// src/models/poem.js
class Poem {
    constructor(id, title, content, userId, creationDate, author, likes, likeDb, comments, visible, comment, labels) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.creationDate = creationDate;
        this.author = author
        this.likes = likes
        this.likeDb = likeDb
        this.comments = comments
        this.visible = visible
        this.comment = comment
        this.labels = labels
    }
}
  
module.exports = Poem;  