'use strict'
var _ = require('lodash')
const fileUpload = require('fastify-file-upload')
const DetectionRequest = require('../../../model/detection-request')
const { DETECTION_REQUEST_STATUS } = require('../../../constants')
const { postDetectionRequestBodySchema, getDetectionStatusParamsSchema } = require('../../../schema/validation/detection-request-validation-schema')

const MIME_TYPES_ALLOWED = new Set(['image/jpeg'])

const isValidMimeType = (mimeType) => {
  return MIME_TYPES_ALLOWED.has(mimeType)
}

/**
 * @param {import("fastify").FastifyInstance} fastify 
 * @param {*} opts 
 */
module.exports = async function (fastify, opts) {

  /**
   * Options of the limits can be found on:
   * https://github.com/mscdex/busboy#api
   */
  fastify.register(fileUpload, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 1,
    },
  })

  fastify.register(require('../../../plugins/uuid'))
  fastify.register(require('../../../services/detection-request-service'))
  /**
   *  Get request status by id
   */
  fastify.get('/:requestId', {
    schema: { params: getDetectionStatusParamsSchema },
    handler: async function (request, reply) {
      const { requestId } = request.params
      try {
        const detectionRequestsFound = await fastify.detectionRequestService.getDetectionRequestStatusById(requestId)
        if (detectionRequestsFound && detectionRequestsFound.Items && detectionRequestsFound.Items.length > 0) {
          const item = (_.orderBy(detectionRequestsFound.Items, ['last_updated_date.S', 'created_date.S',], ['desc', 'desc']))[0]
          reply.send({ requestId, status: _.split(item.sk.S, '-', 2)[1], lastUpdatedDate: item.last_updated_date.S, createdDate: item.created_date.S })
        }
        else
          reply.notFound()
      } catch (e) {
        reply.send(e)
      }
    }
  })

  /**
   * Post request for uploading image for object detection
   */
  fastify.post('/', {
    schema: { body: postDetectionRequestBodySchema },
    handler: async (request, reply) => {
      const file = request.body.file
      if (!isValidMimeType(_.get(file, 'mimetype'))) {
        reply.badRequest(`Invalid mime type, acceptable mime types are [${Array.from(MIME_TYPES_ALLOWED.values())}]`)
      }

      // generate uuid
      const requestId = fastify.uuid()
      const detectionRequest = new DetectionRequest({ requestId: requestId, fileName: file.name })
      try {
        // upload file to s3
        const { Key } = await fastify.detectionRequestService.uploadDetectionInput(requestId, file)
        detectionRequest.inputPath = Key
        // save request to dynamoDB, use await there, otherwise, the exeception won't be caught
        await fastify.detectionRequestService.saveDetectionRequest(detectionRequest)
        // send msg to sqs
        await fastify.detectionRequestService.sendDetectionRequestMessage(detectionRequest)
        reply.send({ requestId: detectionRequest.requestId, fileName: detectionRequest.fileName, status: detectionRequest.status, createdDate: detectionRequest.createdDate })
      } catch (err) {
        request.log.error(err)
        detectionRequest.status = DETECTION_REQUEST_STATUS.ERRORED
        detectionRequest.errorMessage = err
        await fastify.detectionRequestService.saveDetectionRequest(detectionRequest)
        reply.internalServerError(err)
      }
    }
  })

}
