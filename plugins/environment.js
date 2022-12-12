'use strict'

const fp = require('fastify-plugin')
const fastifyEnv = require('@fastify/env')

/**
 * This plugins allows reading environment variables from .env file
 *
 * @see https://github.com/fastify/fastify-env
 */
module.exports = fp(async function (fastify, opts) {
    const schema = {
        type: 'object',
        required: ['PORT', 'DYNAMODB_TABLE_NAME', 'S3_INPUT_BUCKET_NAME', 'S3_OUTPUT_BUCKET_NAME', 'SQS_QUEUE_URL'],
        properties: {
            PORT: {
                type: 'string',
                default: 3000
            },
            DYNAMODB_TABLE_NAME: {
                type: 'string',
            }
            ,
            S3_INPUT_BUCKET_NAME: {
                type: 'string',
            },
            S3_OUTPUT_BUCKET_NAME: {
                type: 'string',
            },
            AWS_SERVICE_ENDPOINT: {
                type: 'string'
            },
            SQS_QUEUE_URL: {
                type: 'string'
            }
        }
    }

    const options = {
        confKey: 'config', // optional, default: 'config'
        schema: schema,
        dotenv: true // will read .env in root folder
        //data: data // optional, default: process.env
    }

    fastify
        .register(fastifyEnv, options)
        .ready((err) => {
            if (err) console.error(err)
            fastify.log.info(fastify.config) // or fastify[options.confKey]
        })

}, { name: "environment" })

