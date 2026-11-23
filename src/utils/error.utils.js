export class NotFoundError extends Error {
    constructor (status, message) {
        super()
        this.status = status
        this.message = message
    }
}

export class ConflictError extends Error {
    constructor (status, message) {
        super()
        this.status = status
        this.message = message
    }
}

export class EnternalServerError extends Error {
    constructor (status, message) {
        super()
        this.status = status
        this.message = message
    }
}

export class BadRwquestError extends Error {
    constructor (status, message) {
        super()
        this.status = status
        this.message = message
    }
}
