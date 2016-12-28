const Code = require('code');
const expect = Code.expect;
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const after = lab.after;
const before = lab.before;

// require hapi server
const Server = require('../../server.js');
const nock = require('nock');

// tests
describe('functional tests - users', () => {
    before((done) => {
      nock('https://api.github.com/').get('/search/users?sort=created&order=asc&q=language:erlang').times(3).reply(200, {
            'incomplete_results': false,
            'total_count': 2,
            'items': [
              {
                  'login': 'mojombo',
                  'id': 1,
                  'avatar_url': 'https://dummy.png',
              },
              {
                  'login': 'mojombo2',
                  'id': 1,
                  'avatar_url': 'https://dummy2.png',
              },
            ],
          });
              nock('https://api.github.com/').get('/users/mojombo').times(3).reply(200, {
                  'login': 'mojombo',
                  'avatar_url': 'https://github.com/dummy.gif',
                  'name': 'monalisa mojombo',
                  'followers': 20,
              });

              nock('https://api.github.com/').get('/users/mojombo2').times(3).reply(200, {
                'login': 'mojombo2',
                'avatar_url': 'https://github.com/dummy.gif',
                'name': 'monalisa mojombo2',
                'followers': 10,
              });
        done();
    });

    it('should get max users', (done) => {
        Server.inject({
            method: 'GET',
            url: '/users/erlang',
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.entity.users).to.have.length(2);
            done();
        });
    });

    it('should get one user', (done) => {
        Server.inject({
            method: 'GET',
            url: '/users/erlang?limit=1',
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.entity.users).to.have.length(1);
            done();
        });
    });

    it('should get two users', (done) => {
        Server.inject({
            method: 'GET',
            url: '/users/erlang?limit=777',
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.entity.users).to.have.length(2);
            done();
        });
    });

    it('should be invalid request ', (done) => {
        Server.inject({
            method: 'GET',
            url: '/users/erlang?limit=isnumeric',
        }, (response) => {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('should be invalid request ', (done) => {
        Server.inject({
            method: 'GET',
            url: '/wrong',
        }, (response) => {
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    after((done) => {
        // placeholder to do something post tests
        done();
    });
});
