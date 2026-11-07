import type { FieldErrors } from "@/types/api"

// One error shape for every failed request, built from what the backend sends back.
// No toast or browser code here, so it is safe on the server too.

export const STATUS_MESSAGES: Record<number, string> = {
    400: "Please fill out the required fields correctly.",
    401: "Please log in first.",
    403: "You do not have access to this.",
    404: "Not found.",
    409: "This already exists.",
    410: "This code has expired.",
    422: "Your information is not valid.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "Something went wrong on our side. Please try again.",
    502: "The server is not available right now. Try again in a few minutes.",
    503: "The server is not available right now. Try again in a few minutes.",
    504: "The server took too long to answer. Try again in a few minutes.",
}

export const NETWORK_MESSAGE = "No connection to the server. Check your internet and try again."
export const TIMEOUT_MESSAGE = "The request took too long. Please try again."

interface ApiErrorInfo {
    message: string
    status?: number
    errors?: FieldErrors | null
    data?: unknown
    code?: string
}

export class ApiError extends Error {
    /** HTTP status, 0 = no response (network / timeout) */
    status: number
    /** Field errors: { email: "Invalid email", ... } */
    errors: FieldErrors | null
    /** Raw body from the backend */
    data: unknown
    code?: string

    constructor({ message, status = 0, errors = null, data = null, code }: ApiErrorInfo) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.errors = errors
        this.data = data
        this.code = code
    }
}

// The parts of an axios error this file reads (kept loose so anything thrown can be passed in)
interface ErrorLike {
    code?: string
    message?: string
    request?: unknown
    response?: { status: number; data?: unknown }
}

type Body = Record<string, unknown> | string | null | undefined

// Field errors can come in different shapes; all become { field: "first message" }
//   { errors: { email: "Invalid" } }               { errors: { email: ["Invalid"] } }
//   { errors: [{ path: ["email"], message: "" }] }  (zod issues)
//   { errors: [{ field: "email", msg: "" }] }       { errors: { fieldErrors: { email: [""] } } } (zod flatten)
const toFieldErrors = (raw: unknown): FieldErrors | null => {
    if (!raw || typeof raw !== "object") return null
    const obj = raw as Record<string, unknown>
    const source = obj.fieldErrors && typeof obj.fieldErrors === "object" ? obj.fieldErrors : raw
    const result: FieldErrors = {}

    if (Array.isArray(source)) {
        source.forEach((entry: unknown) => {
            if (!entry || typeof entry !== "object") return
            const item = entry as Record<string, any>
            const key = Array.isArray(item.path) ? item.path.join(".") : item.path || item.field || item.name || item.param
            const text = item.message || item.msg
            if (key && text && !result[key]) result[key] = String(text)
        })
    } else {
        Object.entries(source as Record<string, any>).forEach(([key, value]) => {
            const text = Array.isArray(value) ? value[0] : typeof value === "object" ? value?.message : value
            if (text) result[key] = String(text)
        })
    }

    return Object.keys(result).length ? result : null
}

const pickMessage = (body: Body): string | null => {
    // A plain-text body is used only when it is short and not an HTML error page
    if (typeof body === "string") return body.trim() && body.length < 300 && !body.trim().startsWith("<") ? body.trim() : null
    const text = body?.message || body?.error || body?.msg
    return typeof text === "string" && text.trim() ? text.trim() : null
}

/** Turns any axios error (or anything thrown) into an ApiError. */
export const toApiError = (thrown: unknown): ApiError => {
    if (thrown instanceof ApiError) return thrown
    const error = (thrown ?? {}) as ErrorLike

    if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
        return new ApiError({ message: TIMEOUT_MESSAGE, code: error.code })
    }

    if (!error?.response) {
        return new ApiError({ message: error?.request ? NETWORK_MESSAGE : error?.message || NETWORK_MESSAGE, code: error?.code })
    }

    const { status, data } = error.response
    const body = data as Body
    const fields = typeof body === "object" && body ? body.errors ?? body.fieldErrors : null
    const errors = toFieldErrors(fields)
    // 5xx messages are often internal details (stack, DB errors), so the user gets a friendly one
    const message =
        (status >= 500 && STATUS_MESSAGES[status]) ||
        pickMessage(body) ||
        (errors && Object.values(errors)[0]) ||
        STATUS_MESSAGES[status] ||
        `Unexpected error (${status})`

    return new ApiError({ message, status, errors, data, code: error.code })
}


/**
 * Writes the backend's field errors into a react-hook-form form.
 * Returns true when at least one field got an error.
 *   onError: (error) => applyFieldErrors(error, setError)
 */
export const applyFieldErrors = (
    error: unknown,
    setError: (field: any, error: { type: string; message: string }) => void
): boolean => {
    const { errors } = toApiError(error)
    if (!errors) return false
    Object.entries(errors).forEach(([field, message]) => setError(field, { type: "server", message }))
    return true
}
