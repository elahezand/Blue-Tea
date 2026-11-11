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
  ABOUT: "/pages/about",
  ADMIN_ARTICLES: "/articles/admin",
  ADMIN_PRODUCTS: "/products/admin",
  ADMIN_DASHBOARD: "/dashboard/admin",
  MY_DASHBOARD: "/dashboard/me",
  ORDERS: "/orders",
  MY_ORDERS: "/orders/me",
  MY_ORDERS_CANCEL: "/orders/me/cancel",
  MY_ORDERS_DELIVERED: "/orders/me/delivered",
  ADMIN_ORDERS: "/orders/admin",
  ORDERS_SHIP: "/orders/ship",
  ORDERS_CANCEL: "/orders/cancel",
  ORDERS_CANCEL_ITEM: "/orders/cancel-item",
  MY_NOTIFICATIONS: "/notifications/me",
  ADMIN_NOTIFICATIONS: "/notifications/admin",
  CART: "/cart",
  ADMIN_CARTS: "/cart/admin",
  CATEGORIES: "/categories",
  ADMIN_CATEGORIES: "/categories/admin",
  CATEGORY_TREE: "/categories/tree",
  CART_ITEMS: "/cart/items",
  CART_SYNC: "/cart/sync",
  CART_DISCOUNT: "/cart/discount",
  CONTACTS: "/contacts",
  ADMIN_CONTACTS: "/contacts/admin",
  CONTACTS_REPLY: "/contacts/reply",
  MY_CONTACTS: "/contacts/me",
  WISHLIST: "/wishlist",
  WISHLIST_TOGGLE: "/wishlist/toggle",
  TICKETS: "/tickets",
  MY_TICKETS: "/tickets/me",
  ADMIN_TICKETS: "/tickets/admin",
  TICKETS_REPLY: "/tickets/reply",
  PRODUCTS: "/products",
  COMMENTS: "/comments",
  ADMIN_COMMENTS: "/comments/admin",
  COMMENTS_ACCEPT: "/comments/accept",
  COMMENTS_REJECT: "/comments/reject",
  COMMENTS_REPLY: "/comments/reply",
  MY_COMMENTS: "/comments/me",
  LATEST_COMMENTS: "/comments/latest",
  MENU: "/menu",
  ADMIN_MENU: "/menu/admin",
  RESERVATIONS: "/reservations",
  MY_RESERVATIONS: "/reservations/me",
  MY_RESERVATIONS_CANCEL: "/reservations/me/cancel",
  ADMIN_RESERVATIONS: "/reservations/admin",
  RESERVATIONS_CANCEL: "/reservations/cancel",
  SEND_CODE: "/auth/send-code",
  VERIFY_CODE: "/auth/verify-code",
  SIGN_OUT: "/auth/signout",
  USERS: "/users",
  USERS_BANNED: "/users/banned",
  USERS_BAN: "/users/ban",
  USERS_UNBAN: "/users/unban",
  PROFILE: "/users/profile",
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