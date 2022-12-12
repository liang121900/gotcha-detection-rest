const { v1: uuidv1 } = require('uuid');
const fp = require('fastify-plugin')
/**
 * Plugin for uuid
 *  
 * @see https://github.com/uuidjs/uuid
 */
module.exports = fp(async function (fastify, options) {
    fastify.decorate('uuid', uuidv1)
})
