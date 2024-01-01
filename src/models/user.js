// src/models/user.js
class User {
    constructor(id, username, email, passwordHash, profileImgUrl, role, poems, albums) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.profileImgUrl = profileImgUrl;
        this.role = role;
        this.poems = poems
        this.albums = albums
    }
}
  
module.exports = User;