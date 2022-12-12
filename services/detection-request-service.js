'use strict'
const { ExecuteStatementCommand } = require("@aws-sdk/client-dynamodb")
const DetectionRequestDto = require('../entity/detection-request-dto')
const fp = require('fastify-plugin')
const { PutCommand } = require("@aws-sdk/lib-dynamodb")
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const { SendMessageCommand } = require("@aws-sdk/client-sqs")


/**
 * @param {import("fastify").FastifyInstance} fastify 
 * @param {*} opts 
 */
module.exports = fp(async function (fastify, opts) {
    // Services for DynamoDB
    const getDetectionRequestStatusById = async (requestId) => {
        const params = {
            Statement: `select pk, sk, last_updated_date, created_date from "${fastify.config.DYNAMODB_TABLE_NAME}" where pk=? and begins_with(sk,'status-')`,
            Parameters: [{ S: `detection_request-${requestId}` }],
        }
        const result = await fastify.dynamo.send(new ExecuteStatementCommand(params))
        return result
    }

    const getDetectionRequestByIdAndStatus = async (requestId, status) => {
        const params = {
            Statement: `select pk, sk, data_1, last_updated_date, created_date from "${fastify.config.DYNAMODB_TABLE_NAME}" where pk=? and sk=?`,
            Parameters: [{ S: `detection_request-${requestId}` }, { S: `status-${status}` }],
        }
        const result = await fastify.dynamo.send(new ExecuteStatementCommand(params))
        return result
    }

    const saveDetectionRequest = async (detectionRequest) => {
        const detectionRequestDto = new DetectionRequestDto(detectionRequest)
        const params = {
            TableName: fastify.config.DYNAMODB_TABLE_NAME,
            Item: detectionRequestDto
        }
        const result = await fastify.dynamo.send(new PutCommand(params))
        return result
    }

    // Service for S3
    const uploadDetectionInput = async (requestId, file) => {
        const { data, name, ...otherFields } = file
        const params = {
            Bucket: fastify.config.S3_INPUT_BUCKET_NAME,
            Key: `${requestId}/${name}`,
            Body: data,
        }
        await fastify.s3.send(new PutObjectCommand(params))
        return params
    }

    const downloadDetectionOutput = async (objectKey) => {
        const bucketParams = {
            Bucket: fastify.config.S3_OUTPUT_BUCKET_NAME,
            Key: objectKey,
        }
        const dataReadableStream = await fastify.s3.send(new GetObjectCommand(bucketParams));
        return dataReadableStream
    }

    // Services for SQS
    const sendDetectionRequestMessage = async (detectionRequest) => {
        const params = {
            //SQS_QUEUE_URL; e.g., 'https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME',
            QueueUrl: fastify.config.SQS_QUEUE_URL,
            MessageAttributes: {
                ContentType: {
                    DataType: "String",
                    StringValue: "application/json",
                }
            },
            MessageBody: JSON.stringify(detectionRequest),
            // MessageDeduplicationId: detectionRequest.requestId,
        }
        fastify.log.info(fastify.config.DYNAMODB_TABLE_NAME)
        return await fastify.sqs.send(new SendMessageCommand(params));
    }


    fastify.decorate('detectionRequestService', {
        getDetectionRequestStatusById,
        getDetectionRequestByIdAndStatus,
        saveDetectionRequest,
        uploadDetectionInput,
        downloadDetectionOutput,
        sendDetectionRequestMessage
    })
})
