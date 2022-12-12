const fp = require('fastify-plugin')
const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3")

/**
 * Plugin for dynamoDB client
 *  
 * @see 
 */
module.exports = fp(async function (fastify, options) {
    // If AWS_SERVICE_ENDPOINT is available, assume it's local
    const awsOptions = fastify.config.AWS_SERVICE_ENDPOINT && {
        endpoint: fastify.config.AWS_SERVICE_ENDPOINT,
        region: 'us-east-1',
        forcePathStyle: true // To get rid of ENOTFOUND error to localstack
    }
    //console.log(`aws client options: ${JSON.stringify(awsOptions)}`)
    const s3Client = new S3Client(awsOptions);

    // fastify.decorate('dynamo', ddbDocClient)
    fastify.decorate('s3', s3Client)
}, { name: "s3", dependencies: ["environment"] }
)