const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const User = require('../../src/entity/user');

lab.test('user entity', (done) => {
    let user = new User('login', 'name', 'url', 2);
    Code.expect(user.username).to.exist();
    Code.expect(user.name).to.exist();
    Code.expect(user.avatarUrl).to.exist();
    Code.expect(user.followers).to.exist();
    done();
});
