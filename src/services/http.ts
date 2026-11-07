import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { ApiError, toApiError } from "@/utils/apiError";
import { ROUTES } from "@/utils/constant";

// Browser HTTP client. Auth lives in HttpOnly cookies (token + refreshToken),
// so every request is sent with credentials and there is no token in JS.
//
// Extra options you can pass on any request:
//   silent: true           -> no error toast (handle the error yourself)
//   skipAuthRefresh: true  -> on 401 do not try the refresh token

declare module "axios" {
    interface AxiosRequestConfig {
        silent?: boolean
        skipAuthRefresh?: boolean
        /** set by the interceptor: this request was already retried after a refresh */
        _retry?: boolean
    }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const REFRESH_URL = "/auth/refresh"

// A 401 from these means "wrong code / not logged in", not "session expired".
// Rename to your backend's routes for the phone login.
const NO_REFRESH_URLS = ["/auth/send-code", "/auth/verify-code", "/auth/signout", "/auth/refresh"]

const http = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 15000,
})

// ---------- refresh token ----------
// When several requests get 401 at the same time, only one refresh call is sent
// and the others wait for it, then all of them are retried.
let refreshPromise: Promise<unknown> | null = null

const refreshSession = (): Promise<unknown> => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(REFRESH_URL, {}, { baseURL: BASE_URL, withCredentials: true, timeout: 15000 })
            .finally(() => { refreshPromise = null })
    }
    return refreshPromise
}

const redirectToLogin = (): void => {
    if (typeof window === "undefined") return
    const { pathname, search } = window.location
    if (pathname.startsWith(ROUTES.LOGIN)) return
    window.location.href = `${ROUTES.LOGIN}?next=${encodeURIComponent(pathname + search)}`
}

const canRefresh = (config: InternalAxiosRequestConfig, status?: number): boolean =>
    status === 401 &&
    typeof window !== "undefined" &&
    !config._retry &&
    !config.skipAuthRefresh &&
    !NO_REFRESH_URLS.some((url) => config.url?.startsWith(url))

// ---------- error toast ----------
// The same message is shown once even if several requests fail together
const notifyError = (apiError: ApiError): void => {
    if (typeof window === "undefined") return
    toast.error(apiError.message, { id: `api-error-${apiError.status}-${apiError.message}` })
}

// ---------- interceptors ----------
http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // Request cancelled by React Query / AbortController: not an error for the user
        if (axios.isCancel(error)) return Promise.reject(error)

        const config = (error.config ?? {}) as InternalAxiosRequestConfig
        const status = error.response?.status

        if (canRefresh(config, status)) {
            config._retry = true
            try {
                await refreshSession()
                return http(config)
            } catch {
                const expired = new ApiError({ message: "Your session has expired. Please log in again.", status: 401 })
                if (!config.silent) notifyError(expired)
                redirectToLogin()
                return Promise.reject(expired)
            }
        }

        const apiError = toApiError(error)
        if (!config.silent) notifyError(apiError)
        return Promise.reject(apiError)
    }
)

export { http }
export default http
