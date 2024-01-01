// src/models/album.js
class Album {
    constructor(id, userId, title, description, creationDate, poems) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
        this.poems = poems
    }
}
  
module.exports = Album;