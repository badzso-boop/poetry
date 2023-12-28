// src/models/user.js
class User {
    constructor(id, username, email, passwordHash, profileImgUrl) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.profileImgUrl = profileImgUrl;
    }
}
  
module.exports = User;