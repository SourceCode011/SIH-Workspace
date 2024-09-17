class Application {
    constructor(applicationId, enrollmentNo, idProofUrl, isAccepted, userId) {
        this.applicationId = applicationId;
        this.enrollmentNo = enrollmentNo;
        this.idProofUrl = idProofUrl;
        this.isAccepted = isAccepted;
        this.userId = userId;
    }

    // Getter and Setter for applicationId
    get application_id() {
        return this.applicationId;
    }

    set application_id(applicationId) {
        this.applicationId = applicationId;
    }

    // Getter and Setter for enrollmentNo
    get enrollment_no() {
        return this.enrollmentNo;
    }

    set enrollment_no(enrollmentNo) {
        this.enrollmentNo = enrollmentNo;
    }

    // Getter and Setter for idProofUrl
    get id_proof_url() {
        return this.idProofUrl;
    }

    set id_proof_url(idProofUrl) {
        this.idProofUrl = idProofUrl;
    }

    // Getter and Setter for isAccepted
    get is_accepted() {
        return this.isAccepted;
    }

    set is_accepted(isAccepted) {
        this.isAccepted = isAccepted;
    }

    // Getter and Setter for userId
    get user_id() {
        return this.userId;
    }

    set user_id(userId) {
        this.userId = userId;
    }
}

export default Application;