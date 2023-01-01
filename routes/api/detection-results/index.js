'use strict'
var _ = require('lodash')
const { Readable } = require('node:stream');
const { DETECTION_REQUEST_STATUS } = require('../../../constants')
const { getDetectionStatusParamsSchema } = require('../../../schema/validation/detection-request-validation-schema')

/**
 * @param {import("fastify").FastifyInstance} fastify 
 * @param {*} opts 
 */
module.exports = async function (fastify, opts) {
    fastify.register(require('../../../services/detection-request-service'))

    fastify.get('/:requestId', {
        schema: { params: getDetectionStatusParamsSchema },
        handler: async function (request, reply) {
            try {
                const { requestId } = request.params
                const detectionRequestsFound = await fastify.detectionRequestService.getDetectionRequestByIdAndStatus(requestId, DETECTION_REQUEST_STATUS.PROCESSED)

                if (_.get(detectionRequestsFound, 'Items').length < 1) {
                    reply.notFound()
                } else {
                    // const inputPath = JSON.parse(detectionRequestsFound[0].data_1
                    const parsedRequest = JSON.parse(_.get(detectionRequestsFound, 'Items[0].data_1.S'))
                    const outputPath = _.get(parsedRequest, 'outputPath')

                    const s3Response = await fastify.detectionRequestService.downloadDetectionOutput(outputPath)
                    reply.type(s3Response.ContentType)
                    await reply.send(new Readable().wrap(s3Response.Body))
                }
            } catch (e) {
                reply.internalServerError(e)
            }
        }
    })
}
