'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
const cors = require('@fastify/cors')

/**
 * 
 * @param {import("fastify").FastifyInstance} fastify 
 * @param {*} opts 
 */
module.exports = async function (fastify, opts) {
  // Place here your custom code!
  const DistPath = path.join(__dirname, 'ui', 'build')

  fastify.register(require('@fastify/static'), {
    root: DistPath
  })

  fastify.setNotFoundHandler(function (request, reply) {
    if (!request.url.includes('/api/'))
      reply.sendFile("index.html");
    else
      reply.notFound(`Route ${request.url} not found`)
  });

  await fastify.register(cors, {
    origin: ['http://localhost:3000']
  })


  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })


}
