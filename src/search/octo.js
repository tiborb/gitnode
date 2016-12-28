const config = require('config');
const User = require('../entity/user');
const github = require('octonode');
const client = github.client(config.get('oauth.token'));

let octo = {

    /**
     * @param {String} lang
     * @return {Promise}
     */
    searchUsers(lang) {
        return new Promise((resolve, reject) => {
            client.search().users({
                q: `language:${lang}`,
                sort: 'created',
                order: 'asc',
            }, function(err, data) {
                if (err) {
                    reject(err);
                };
                if (data && data.items) {
                    let users = [];
                    data.items.forEach(function(entry) {
                        users.push(new User(entry.login, null, entry.avatar_url, null));
                    });
                    resolve(users);
                }
            });
        });
    },

    /**
     * @param {Object[]} users
     * @return {Promise}
     */
    lookupUsers(users) {
        return new Promise((resolve, reject) => {
            let promises = users.map((user) => {
                return new Promise((res, rej) => {
                    client.user(user.username).info(function(err, data) {
                        if (err) {
                            rej(err);
                        };
                        user.name = data.name;
                        user.followers = data.followers;

                        res(user);
                    });
                });
            });

            Promise.all(promises)
                .then((users) => {
                resolve(users);
            });
        });
    },

    /**
     * @param {String} lang
     * @return {Promise}
     */
    searchByLang(lang) {
        return new Promise((resolve, reject) => {
            octo.searchUsers(lang)
            .then(octo.lookupUsers)
            .then((users) => {
                resolve(users);
            }).catch((err) => {
                reject(err);
            });
        });
    },
};

module.exports = octo;
