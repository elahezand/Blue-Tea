// Cookie names set by the backend on login
export const AUTH_COOKIES = {
  ACCESS: "token",
  REFRESH: "refreshToken",
} as const;

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export const ROUTES = {
  LOGIN: "/login-register",
  ACCOUNT: "/account",
  ADMIN: "/p-admin",
  HOME: "/",
} as const;
