
/**
 * User
 */
class User {

  /**
   * @param {String} username
   * @param {String} name
   * @param {String} avatarUrl
   * @param {Integer} followers
   */
    constructor(username, name, avatarUrl, followers) {
        this.username = username;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.followers = followers;
    }
}

module.exports = User;
