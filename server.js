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
        let lang = request.params.lang;
        let limit = request.query.limit;
        let schema = Joi.object().keys({
            lang: Joi.string().alphanum().min(1).max(30).required(),
            limit: Joi.number().integer().min(1).max(99999999),
        }).with('lang', 'limit');

        let errors = Joi.validate({lang: lang, limit: limit}, schema);

        if (null === errors.error) {
          octo.searchByLang(lang, limit)
          .then((users) => reply({
                  users: users,
              }))
           .catch((err) => {
              console.error(err);
              return reply(err);
           });
        } else {
            let Boom = require('boom');
            return reply(Boom.badRequest('Invalid request'));
        }
      },
  });

// Start the server
server.start((err) => {
    if (err) {
      throw err;
    };

    console.log('Server running at:', server.info.uri);
  });
