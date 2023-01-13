const { DETECTION_REQUEST_STATUS } = require("../constants")
module.exports = class {
    constructor({ requestId, fileName, inputPath, confidenceThreshold }) {
        this.errorMessage = ""
        this.outputPath = ""
        this.confidenceThreshold = confidenceThreshold
        this.createdDate = new Date()
        this.lastUpdatedDate = new Date()
        this.status = DETECTION_REQUEST_STATUS.CREATED
        Object.assign(this, { requestId, fileName, inputPath, confidenceThreshold })
    }
}