module.exports = class ApiError extends Error {
    status;
    errors;
    constructor(status, message, errors){
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(){
        return new ApiError(401, 'Do not authorized')
    }

    static BedRequest(message, errors = []){
        return new ApiError(400, message, errors)
    }
}