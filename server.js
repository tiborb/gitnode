const Hapi = require('hapi');
const halacious = require('halacious');
const octo = require('./src/search/octo');
const server = new Hapi.Server();
const Joi = require('joi');

server.connection({
    host: 'localhost',
    port: 8000,
  });

server.register(halacious, function(err) {
      if (err) {
          console.log(err);
      }
  });

// Add the route
server.route({
    method: 'GET',
    path: '/users/{lang}',
    handler: function(request, reply) {
        octo.searchByLang(request.params.lang, request.query.limit)
        .then((users) => reply({
                users: users,
            }))
         .catch((err) => {
            console.error(err);
            return reply(err);
         });
      },
      config: {
        validate: {
            params: {
              lang: Joi.string().alphanum().min(1).max(30).required(),
            },
            query: {
              limit: Joi.number().integer().min(1).max(999999),
            },
        },
    },
  });

// Start the server
server.start((err) => {
    if (err) {
      throw err;
    };

    console.log('Server running at:', server.info.uri);
  });

module.exports = server;
