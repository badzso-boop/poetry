// src/models/user.js
class User {
    constructor(id, username, email, passwordHash, profileImgUrl, role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.profileImgUrl = profileImgUrl;
        this.role = role;
    }
}
  
module.exports = User;