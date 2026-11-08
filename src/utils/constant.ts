export const AUTH_COOKIES = {
  ACCESS: "token",
  REFRESH: "refreshToken",
} as const;

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export const ENDPOINTS = {
  ARTICLES: "/articles",
  CART: "/cart",
  CART_ITEMS: "/cart/items",
  CONTACTS: "/contacts",
} as const;

export const ARTICLES_PER_PAGE = 9;

export const ROUTES = {
  LOGIN: "/login-register",
  ACCOUNT: "/account",
  ADMIN: "/p-admin",
  HOME: "/",
} as const;