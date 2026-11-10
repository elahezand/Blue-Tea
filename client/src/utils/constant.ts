// Cookie names set by the backend on login
export const AUTH_COOKIES = {
  ACCESS: "token",
  REFRESH: "refreshToken",
  LOGGED_IN: "bt_logged_in",
} as const;

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

// Backend endpoints used both on the server (serverFetch) and in the browser (useApi hooks)
export const ENDPOINTS = {
  ARTICLES: "/articles",
  CART: "/cart",
  CATEGORY_TREE: "/categories/tree",
  CART_ITEMS: "/cart/items",
  CART_SYNC: "/cart/sync",
  CART_DISCOUNT: "/cart/discount",
  CONTACTS: "/contacts",
  WISHLIST: "/wishlist",
  MY_TICKETS: "/tickets/me",
  PRODUCTS: "/products",
  LATEST_COMMENTS: "/comments/latest",
  MENU: "/menu",
  RESERVATIONS: "/reservations",
  SEND_CODE: "/auth/send-code",
  VERIFY_CODE: "/auth/verify-code",
} as const;

export const ARTICLES_PER_PAGE = 9;
export const WISHLIST_PER_PAGE = 12;
export const PRODUCTS_PER_PAGE = 12;
export const HOME_PRODUCTS = 12;
export const COMMENTS_PER_PAGE = 5;

// localStorage key of the cart of a visitor who is not logged in
export const GUEST_CART_KEY = "bluetea_guest_cart";

export const ROUTES = {
  LOGIN: "/login-register",
  ACCOUNT: "/account",
  ADMIN: "/p-admin",
  HOME: "/",
} as const;