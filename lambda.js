const awsLambdaFastify = require('@fastify/aws-lambda')
const server = require('./server')

const proxy = awsLambdaFastify(server, { binaryMimeTypes: ['application/octet-stream', 'image/jpeg'] })
// or
// const proxy = awsLambdaFastify(app, { binaryMimeTypes: ['application/octet-stream'], serializeLambdaArguments: false /* default is true */ })

exports.handler = proxy
// or
// exports.handler = (event, context, callback) => proxy(event, context, callback)
// or
// exports.handler = (event, context) => proxy(event, context)
// or
// exports.handler = async (event, context) => proxy(event, context)