// src/models/poem.js
class Poem {
    constructor(id, title, content, userId, creationDate) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.creationDate = creationDate;
    }
}
  
module.exports = Poem;  