export type FieldErrors = Record<string, string>

export class AppError extends Error {
    status: number
    errors?: FieldErrors

    constructor(message: string, status = 400, errors?: FieldErrors) {
        super(message)
        this.name = "AppError"
        this.status = status
        this.errors = errors
    }
}
