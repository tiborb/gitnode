const Hapi = require('hapi');
const halacious = require('halacious');
const octo = require('./src/search/octo');
const server = new Hapi.Server();

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
        octo.searchByLang(lang)
        .then((users) => reply({
                users: users,
            }))
         .catch((err) => {
            return reply(err);
        });
      },
  });

// Start the server
server.start((err) => {
    if (err) {
      throw err;
    };

    console.log('Server running at:', server.info.uri);
  });
