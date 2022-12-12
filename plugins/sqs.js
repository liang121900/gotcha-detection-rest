const fp = require('fastify-plugin')
const { SQSClient } = require("@aws-sdk/client-sqs")

/**
 * Plugin for sqs client
 *  
 * @see 
 */
module.exports = fp(async function (fastify, options) {
    // If AWS_SERVICE_ENDPOINT is available, assume it's local
    const awsOptions = fastify.config.AWS_SERVICE_ENDPOINT && {
        endpoint: fastify.config.AWS_SERVICE_ENDPOINT,
        region: 'us-east-1',
        // forcePathStyle: true // To get rid of ENOTFOUND error to localstack
    }

    fastify.decorate('sqs', new SQSClient(awsOptions))
}, { name: "sqs", dependencies: ["environment"] }
)