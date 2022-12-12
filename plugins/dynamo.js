const fp = require('fastify-plugin')
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
/**
 * Plugin for dynamoDB client
 *  
 * @see 
 */
module.exports = fp(async function (fastify, options) {
    // If AWS_SERVICE_ENDPOINT is available, assume it's local
    const awsOptions = fastify.config.AWS_SERVICE_ENDPOINT && {
        forcePathStyle: true,
        endpoint: fastify.config.AWS_SERVICE_ENDPOINT,
        region: 'us-east-1'
    }
    // console.log(`dynamoDb client options: ${JSON.stringify(options)}`)

    const ddbClient = new DynamoDBClient(awsOptions)
    const marshallOptions = {
        // Whether to automatically convert empty strings, blobs, and sets to `null`.
        convertEmptyValues: false, // false, by default.
        // Whether to remove undefined values while marshalling.
        removeUndefinedValues: false, // false, by default.
        // Whether to convert typeof object to map attribute.
        convertClassInstanceToMap: true, // false, by default.
    };
    const unmarshallOptions = {
        // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
        wrapNumbers: true, // false, by default.
    };
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })
    fastify.decorate('dynamo', ddbDocClient)
    fastify.decorate('dynamoClient', ddbClient)
}, { name: "dynamo", dependencies: ["environment"] }
)