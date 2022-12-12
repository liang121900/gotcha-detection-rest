module.exports = class {
    constructor(detectionRequest) {
        this.pk = `detection_request-${detectionRequest.requestId}`
        this.sk = `status-${detectionRequest.status}`
        this.data_1 = JSON.stringify(detectionRequest)
        this.created_date = new Date().toISOString()
        this.last_updated_date = this.created_date
    }
}