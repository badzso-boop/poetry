// src/models/user.js
class User {
    constructor(id, username, email, passwordHash, profileImgUrl, role, poems, albums, bio) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.profileImgUrl = profileImgUrl;
        this.role = role;
        this.poems = poems
        this.albums = albums
        this.bio = bio
    }
}
  
module.exports = User;