const postDetectionRequestBodySchema = {
    type: 'object',
    properties: {
      file: {
        type: 'object',
        required: ['mimetype', 'data', 'name']
      },
      confidenceThreshold:{
        type: 'number',
        minimum: 0.01,
        maximum: 0.99
      }
    },
    required: ['file']
  }

const getDetectionStatusParamsSchema = {
    type: 'object',
    required: ['requestId'],
    properties: {
        requestId: { type: 'string', minLength: 1, maxLength: 100 },
    }
}

module.exports = {
    postDetectionRequestBodySchema,
    getDetectionStatusParamsSchema
}