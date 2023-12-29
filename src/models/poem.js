// src/models/poem.js
class Poem {
    constructor(id, title, content, userId, creationDate, author, likes, comments) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.creationDate = creationDate;
        this.author = author
        this.likes = likes
        this.comments = comments
    }
}
  
module.exports = Poem;  